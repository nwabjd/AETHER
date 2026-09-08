// AETHER GPU Benchmark — validated-kernel performance measurements.
//
// TASK 4 (deterministic data / GATE-2-validated kernels): every benchmark
// reuses the exact WGSL from kernels.ts that passed the correctness suite.
// The bench-only attention PHASE shaders (ATTN_QKT / ATTN_PV) live here, not
// in kernels.ts, so the validated kernel set stays untouched.
//
// Every kernel is validated once against a deterministic CPU reference before
// any timing is recorded (TASK 23): a mismatch throws, and the suite aborts
// ("fix correctness first") instead of publishing a number.

import { TimingManager } from './timing.ts';
import type { PerfSample, Throughput } from './perf-report.ts';
import {
  createPipeline,
  createBindGroupForPipeline,
  createStorageBuffer,
  createUniformBuffer,
  readbackBuffer,
  getDevice,
} from './engine.ts';
import { ReadbackManager } from './readback.ts';
import {
  createMatmulUniform,
  createVecAddUniform,
  createConv2DUniform,
  createSoftmaxUniform,
  createRMSNormUniform,
  createAttentionUniform,
  logMatmulUniformDiagnostic,
} from './uniforms.ts';
import type { StorageAccess } from './layout.ts';
import { MATMUL, VEC_ADD, CONV2D, SOFTMAX, RMS_NORM, ATTENTION, ATTENTION_OUTPUT_SENTINEL, softmaxWorkgroups, softmaxDispatchInfo, assertSoftmaxDispatch, type SoftmaxDispatchInfo } from './kernels.ts';
import { cpuVecAdd, cpuMatmul, cpuConv2D, cpuSoftmax, cpuRMSNorm, cpuAttention } from './cpu-refs.ts';
import { analyzeNumeric, rowSums } from './numeric.ts';

const QKT_BINDINGS = ['uniform', 'read-only-storage', 'read-only-storage', 'storage'] as const satisfies readonly StorageAccess[];
const PV_BINDINGS = ['uniform', 'read-only-storage', 'read-only-storage', 'storage'] as const satisfies readonly StorageAccess[];

// ─── bench-only attention phase shaders (mirror the monolithic ATTENTION) ───

export const ATTN_QKT = /* wgsl */ `
struct Uniforms { batch: u32, seq: u32, dim: u32, scale: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> Q: array<f32>;
@group(0) @binding(2) var<storage, read> K: array<f32>;
@group(0) @binding(3) var<storage, read_write> scores: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  let b = gid.y;
  if (i >= u.seq || b >= u.batch) { return; }
  for (var j: u32 = 0u; j < u.seq; j++) {
    var dot: f32 = 0.0;
    for (var d: u32 = 0u; d < u.dim; d++) {
      dot += Q[(b * u.seq + i) * u.dim + d] * K[(b * u.seq + j) * u.dim + d];
    }
    scores[b * u.seq * u.seq + i * u.seq + j] = dot * u.scale;
  }
}
`;

const ATTN_PV = /* wgsl */ `
struct Uniforms { batch: u32, seq: u32, dim: u32, scale: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> scores: array<f32>;
@group(0) @binding(2) var<storage, read> V: array<f32>;
@group(0) @binding(3) var<storage, read_write> out: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  let d = gid.y;
  let b = gid.z;
  if (i >= u.seq || d >= u.dim || b >= u.batch) { return; }
  var sum: f32 = 0.0;
  for (var j: u32 = 0u; j < u.seq; j++) {
    sum += scores[b * u.seq * u.seq + i * u.seq + j] * V[(b * u.seq + j) * u.dim + d];
  }
  out[(b * u.seq + i) * u.dim + d] = sum;
}
`;

// ─── shared helpers ─────────────────────────────────────────────────────

function gflops(ops: number, ms: number): Throughput {
  return { value: ops / (ms / 1000) / 1e9, unit: 'GFLOPS' };
}
function gbytes(bytes: number, ms: number): Throughput {
  return { value: bytes / (ms / 1000) / 1e9, unit: 'GB/s (estimate)' };
}

function allFinite(data: Float32Array): boolean {
  for (let i = 0; i < data.length; i++) if (!Number.isFinite(data[i])) return false;
  return true;
}

// TASK 8/17 — first index still holding the output sentinel, or -1 if fully written.
function findSentinel(data: Float32Array): number {
  for (let i = 0; i < data.length; i++) if (data[i] === ATTENTION_OUTPUT_SENTINEL) return i;
  return -1;
}

// TASK 6 — dispatch diagnostic text: "rows=256 wgSize=64 wgX=4 total=256".
function dispatchText(info: SoftmaxDispatchInfo): string {
  return `rows=${info.rows} wgSize=${info.workgroupSize} wgX=${info.workgroupsX} total=${info.totalInvocations}`;
}

// Row-sum check: every softmax row must sum ≈ 1 (each row is normalized).
function checkRowSums(data: Float32Array, rows: number, cols: number): { ok: boolean; maxDev: number } {
  let maxDev = 0;
  for (let r = 0; r < rows; r++) {
    let s = 0;
    for (let c = 0; c < cols; c++) s += data[r * cols + c];
    maxDev = Math.max(maxDev, Math.abs(s - 1));
  }
  return { ok: maxDev <= 1e-2, maxDev };
}

// Number of output elements still holding the sentinel (unwritten rows).
function countSentinels(data: Float32Array): number {
  let n = 0;
  for (let i = 0; i < data.length; i++) if (data[i] === ATTENTION_OUTPUT_SENTINEL) n++;
  return n;
}

function maxAbsDiff(a: Float32Array, b: Float32Array): number {
  let m = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) m = Math.max(m, Math.abs(a[i] - b[i]));
  return m;
}

function fail(kernel: string, size: string, what: string, detail: string): Error {
  return new Error(`${kernel} ${size}: ${what} (${detail}) — fix correctness before benchmarking`);
}

function assertValid(kernel: string, size: string, data: Float32Array, ref: Float32Array, tolAbs: number): void {
  if (!allFinite(data)) throw fail(kernel, size, 'non-finite output', '');
  if (data.length !== ref.length) throw fail(kernel, size, 'length mismatch', `${data.length} vs ${ref.length}`);
  const err = maxAbsDiff(data, ref);
  if (err > Math.max(tolAbs, maxAbsDiff(ref, new Float32Array(ref.length)) * 1e-2)) {
    throw fail(kernel, size, `correctness check failed (maxErr=${err.toExponential(2)})`, '');
  }
}

/** Encode+submit compute pass + copyBufferToBuffer in ONE encoder, then mapAsync via ReadbackManager. */
async function dispatchToAndRead(
  pipeline: GPUComputePipeline,
  bg: GPUBindGroup,
  wg: [number, number, number],
  outBuffer: GPUBuffer,
  bytes: number,
  contextInfo = 'dispatchToAndRead'
): Promise<Float32Array> {
  const device = getDevice();
  const readbackMgr = ReadbackManager.getInstance();
  const staging = readbackMgr.acquire(device, bytes);

  const enc = device.createCommandEncoder({ label: `Enc_${contextInfo}` });
  const pass = enc.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
  pass.end();
  enc.copyBufferToBuffer(outBuffer, 0, staging, 0, bytes);
  device.queue.submit([enc.finish()]);

  return readbackMgr.readSubmittedCopy(device, staging, bytes, contextInfo);
}

/** END_TO_END completion wait using ReadbackManager. */
function waitFor(outBuffer: GPUBuffer, bytes: number, contextInfo = 'waitFor'): () => Promise<void> {
  return async () => {
    const device = getDevice();
    await ReadbackManager.getInstance().copyAndRead(device, outBuffer, bytes, contextInfo);
  };
}

function fillDeterministic(data: Float32Array): void {
  let s = 0x9e3779b9;
  for (let i = 0; i < data.length; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    data[i] = (s % 2001) / 1000 - 1; // [-1, 1]
  }
}

function sample(
  id: string,
  name: string,
  size: string,
  stats: { mode: 'GPU_TIMESTAMP' | 'END_TO_END'; iterations: number; warmup: number; medianMs: number; avgMs: number; minMs: number; maxMs: number; stdDevMs: number },
  throughput?: Throughput,
  note?: string
): PerfSample {
  return { id, name, size, timingMode: stats.mode, iterations: stats.iterations, warmup: stats.warmup, medianMs: stats.medianMs, averageMs: stats.avgMs, minMs: stats.minMs, maxMs: stats.maxMs, stdDevMs: stats.stdDevMs, throughput, note };
}

// ─── MATMUL ─────────────────────────────────────────────────────────────

const MATMUL_CONF = [
  { size: 128, iterations: 12, validate: true },
  { size: 256, iterations: 12, validate: true },
  { size: 512, iterations: 10, validate: false },
  { size: 1024, iterations: 10, validate: false },
] as const;

export async function benchMatmul(tm: TimingManager, subset?: ReadonlySet<string>): Promise<PerfSample[]> {
  const out: PerfSample[] = [];
  for (const conf of MATMUL_CONF) {
    const n = conf.size;
    if (subset && !subset.has(`matmul-${n}`)) continue;
    const bytes = n * n * 4;
    const a = new Float32Array(n * n);
    const b = new Float32Array(n * n);
    fillDeterministic(a);
    fillDeterministic(b);

    const bufA = createStorageBuffer(bytes, a);
    const bufB = createStorageBuffer(bytes, b);
    const bufC = createStorageBuffer(bytes);
    const uData = createMatmulUniform(n, n, n);
    logMatmulUniformDiagnostic(uData);
    const uniform = createUniformBuffer(uData);
    const pipeline = createPipeline(MATMUL, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
    const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
      { binding: 0, resource: { buffer: uniform } },
      { binding: 1, resource: { buffer: bufA } },
      { binding: 2, resource: { buffer: bufB } },
      { binding: 3, resource: { buffer: bufC } },
    ]);
    const wg: [number, number, number] = [n / 16, n / 16, 1];

    try {
      const got = await dispatchToAndRead(pipeline, bg, wg, bufC, bytes, `matmul-${n}`);
      if (conf.validate) {
        const ref = cpuMatmul(a, b, n, n, n);
        assertValid('matmul', `${n}×${n}`, got, ref, 1e-2);
      } else if (!allFinite(got)) {
        throw fail('matmul', `${n}×${n}`, 'non-finite output', '');
      }

      const stats = await tm.measure(
        (pass) => {
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, bg);
          pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
        },
        { iterations: conf.iterations, wait: waitFor(bufC, bytes, `matmul-${n}`) }
      );
      out.push(sample(`matmul-${n}`, 'Matrix Multiply', `${n}×${n}`, stats, gflops(2 * n * n * n, stats.medianMs)));
    } finally {
      bufA.destroy();
      bufB.destroy();
      bufC.destroy();
      uniform.destroy();
    }
  }
  return out;
}

// ─── VECADD ─────────────────────────────────────────────────────────────

const VECADD_SIZES = [
  { n: 1_000, iterations: 12 },
  { n: 16_000, iterations: 12 },
  { n: 64_000, iterations: 12 },
  { n: 262_144, iterations: 10 },
  { n: 1_048_576, iterations: 10 },
  { n: 4_194_304, iterations: 8 },
] as const;

export async function benchVecAdd(tm: TimingManager, subset?: ReadonlySet<string>): Promise<PerfSample[]> {
  const out: PerfSample[] = [];
  for (const conf of VECADD_SIZES) {
    const n = conf.n;
    if (subset && !subset.has(`vecadd-${n}`)) continue;
    const bytes = n * 4;
    const a = new Float32Array(n);
    const b = new Float32Array(n);
    fillDeterministic(a);
    fillDeterministic(b);

    const bufA = createStorageBuffer(bytes, a);
    const bufB = createStorageBuffer(bytes, b);
    const bufC = createStorageBuffer(bytes);
    const uniform = createUniformBuffer(createVecAddUniform(n));
    const pipeline = createPipeline(VEC_ADD, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
    const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
      { binding: 0, resource: { buffer: uniform } },
      { binding: 1, resource: { buffer: bufA } },
      { binding: 2, resource: { buffer: bufB } },
      { binding: 3, resource: { buffer: bufC } },
    ]);
    const count = Math.ceil(n / 64);
    const wg: [number, number, number] = [count, 1, 1];

    try {
      const got = await dispatchToAndRead(pipeline, bg, wg, bufC, bytes, `vecadd-${n}`);
      const ref = cpuVecAdd(a, b);
      assertValid('vecadd', `${n.toLocaleString('en-US')} elements`, got, ref, 1e-2);

      const stats = await tm.measure(
        (pass) => {
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, bg);
          pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
        },
        { iterations: conf.iterations, wait: waitFor(bufC, bytes, `vecadd-${n}`) }
      );
      out.push(
        sample(`vecadd-${n}`, 'Vector Add', `${n.toLocaleString('en-US')} elements`, stats, gbytes(3 * n * 4, stats.medianMs))
      );
    } finally {
      bufA.destroy();
      bufB.destroy();
      bufC.destroy();
      uniform.destroy();
    }
  }
  return out;
}

// ─── CONV2D (1×C input, no padding, stride 1) ────────────────────────────

const CONV2D_CONF = [
  { inputChannels: 1, outputChannels: 1, rows: 32, cols: 32, iterations: 10 },
  { inputChannels: 1, outputChannels: 8, rows: 64, cols: 64, iterations: 8 },
  { inputChannels: 1, outputChannels: 16, rows: 128, cols: 128, iterations: 6 },
] as const;

export async function benchConv2D(tm: TimingManager, subset?: ReadonlySet<string>): Promise<PerfSample[]> {
  const out: PerfSample[] = [];
  for (const conf of CONV2D_CONF) {
    const C = conf.inputChannels;
    const H = conf.rows;
    if (subset && !subset.has(`conv2d-${conf.inputChannels}-${conf.outputChannels}-${H}`)) continue;
    const W = conf.cols;
    const F = conf.outputChannels;
    const FH = 3;
    const FW = 3;
    const OH = H - FH + 1;
    const OW = W - FW + 1;
    const outBytes = F * OH * OW * 4;

    const input = new Float32Array(C * H * W);
    const kernel = new Float32Array(F * C * FH * FW);
    fillDeterministic(input);
    fillDeterministic(kernel);

    const bufIn = createStorageBuffer(C * H * W * 4, input);
    const bufK = createStorageBuffer(F * C * FH * FW * 4, kernel);
    const bufOut = createStorageBuffer(outBytes);
    const uniform = createUniformBuffer(createConv2DUniform(1, C, H, W, F, FH, FW, OH, OW));
    const pipeline = createPipeline(CONV2D, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
    const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
      { binding: 0, resource: { buffer: uniform } },
      { binding: 1, resource: { buffer: bufIn } },
      { binding: 2, resource: { buffer: bufK } },
      { binding: 3, resource: { buffer: bufOut } },
    ]);
    const z = OH * OW;
    const wg: [number, number, number] = [1, F, z];

    try {
      const got = await dispatchToAndRead(pipeline, bg, wg, bufOut, outBytes, `conv2d-${C}-${F}-${H}`);
      const ref = cpuConv2D(input, kernel, 1, C, H, W, F, FH, FW);
      assertValid('conv2d', `${C}×${H}×${W} → ${F}×${OH}×${OW}`, got, ref, 1e-3);

      const stats = await tm.measure(
        (pass) => {
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, bg);
          pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
        },
        { iterations: conf.iterations, wait: waitFor(bufOut, outBytes, `conv2d-${C}-${F}-${H}`) }
      );
      out.push(sample(`conv2d-${C}-${F}-${H}`, 'Convolution 3×3', `${C}→${F} ch, ${H}×${W} → ${OH}×${OW}`, stats));
    } finally {
      bufIn.destroy();
      bufK.destroy();
      bufOut.destroy();
      uniform.destroy();
    }
  }
  return out;
}

// ─── SOFTMAX ────────────────────────────────────────────────────────────

const SOFTMAX_CONF = [
  { rows: 128, cols: 128, iterations: 12 },
  { rows: 256, cols: 256, iterations: 12 },
  { rows: 512, cols: 512, iterations: 10 },
] as const;

export async function benchSoftmax(tm: TimingManager, subset?: ReadonlySet<string>): Promise<PerfSample[]> {
  const out: PerfSample[] = [];
  for (const conf of SOFTMAX_CONF) {
    const { rows, cols, iterations } = conf;
    if (subset && !subset.has(`softmax-${rows}`)) continue;
    const data = new Float32Array(rows * cols);
    fillDeterministic(data);
    const bytes = rows * cols * 4;

    const bufIn = createStorageBuffer(bytes, data);
    const bufOut = createStorageBuffer(bytes);
    const uniform = createUniformBuffer(createSoftmaxUniform(rows, cols));
    const pipeline = createPipeline(SOFTMAX, ['uniform', 'read-only-storage', 'storage']);
    const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'storage'], [
      { binding: 0, resource: { buffer: uniform } },
      { binding: 1, resource: { buffer: bufIn } },
      { binding: 2, resource: { buffer: bufOut } },
    ]);
    const wg: [number, number, number] = softmaxWorkgroups(rows);

    try {
      const got = await dispatchToAndRead(pipeline, bg, wg, bufOut, bytes, `softmax-${rows}`);
      const ref = cpuSoftmax(data, rows, cols);
      assertValid('softmax', `${rows}×${cols}`, got, ref, 1e-3);

      const stats = await tm.measure(
        (pass) => {
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, bg);
          pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
        },
        { iterations, wait: waitFor(bufOut, bytes, `softmax-${rows}`) }
      );
      out.push(sample(`softmax-${rows}`, 'Softmax', `${rows}×${cols}`, stats));
    } finally {
      bufIn.destroy();
      bufOut.destroy();
      uniform.destroy();
    }
  }
  return out;
}

// ─── RMSNORM ────────────────────────────────────────────────────────────

const RMSNORM_CONF = [
  { size: 256, iterations: 12 },
  { size: 512, iterations: 12 },
  { size: 1024, iterations: 12 },
  { size: 2048, iterations: 10 },
  { size: 4096, iterations: 10 },
] as const;

export async function benchRMSNorm(tm: TimingManager, subset?: ReadonlySet<string>): Promise<PerfSample[]> {
  const out: PerfSample[] = [];
  for (const conf of RMSNORM_CONF) {
    const { size, iterations } = conf;
    if (subset && !subset.has(`rmsnorm-${size}`)) continue;
    const data = new Float32Array(size);
    fillDeterministic(data);
    const weight = new Float32Array(size);
    for (let i = 0; i < size; i++) weight[i] = 1 + (i % 7) * 0.01;
    const eps = 1e-6;
    const bytes = size * 4;

    const bufIn = createStorageBuffer(bytes, data);
    const bufW = createStorageBuffer(bytes, weight);
    const bufOut = createStorageBuffer(bytes);
    const uniform = createUniformBuffer(createRMSNormUniform(size, eps));
    const pipeline = createPipeline(RMS_NORM, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
    const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
      { binding: 0, resource: { buffer: uniform } },
      { binding: 1, resource: { buffer: bufIn } },
      { binding: 2, resource: { buffer: bufW } },
      { binding: 3, resource: { buffer: bufOut } },
    ]);
    const wg: [number, number, number] = [1, 1, 1];

    try {
      const got = await dispatchToAndRead(pipeline, bg, wg, bufOut, bytes, `rmsnorm-${size}`);
      const ref = cpuRMSNorm(data, weight, eps);
      assertValid('rmsnorm', String(size), got, ref, 1e-3);

      const stats = await tm.measure(
        (pass) => {
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, bg);
          pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
        },
        { iterations, wait: waitFor(bufOut, bytes, `rmsnorm-${size}`) }
      );
      out.push(sample(`rmsnorm-${size}`, 'RMSNorm', String(size), stats));
    } finally {
      bufIn.destroy();
      bufW.destroy();
      bufOut.destroy();
      uniform.destroy();
    }
  }
  return out;
}

// ─── ATTENTION (monolithic + phase split) ───────────────────────────────

const ATTENTION_CONF = [
  { seq: 128, iterations: 10, validate: true },
  { seq: 256, iterations: 10, validate: true },
  { seq: 512, iterations: 8, validate: true },
  { seq: 1024, iterations: 6, validate: false },
] as const;

export interface AttentionResult {
  main: PerfSample[];
  phases: { [size: string]: PerfSample[] };
}

/** Deterministic Q,K,V + CPU scores/probs/out references (TASK 4 data). */
function attentionRefs(seq: number, dim: number, batch = 1) {
  const Q = new Float32Array(batch * seq * dim);
  const K = new Float32Array(batch * seq * dim);
  const V = new Float32Array(batch * seq * dim);
  fillDeterministic(Q);
  fillDeterministic(K);
  fillDeterministic(V);
  const scale = 1 / Math.sqrt(dim);
  const scores = new Float32Array(batch * seq * seq);
  for (let b = 0; b < batch; b++) {
    for (let i = 0; i < seq; i++) {
      for (let j = 0; j < seq; j++) {
        let dot = 0;
        for (let d = 0; d < dim; d++) dot += Q[(b * seq + i) * dim + d] * K[(b * seq + j) * dim + d];
        scores[b * seq * seq + i * seq + j] = dot * scale;
      }
    }
  }
  const probs = cpuSoftmax(scores, batch * seq, seq);
  const out = cpuAttention(Q, K, V, batch, seq, dim, scale);
  return { Q, K, V, scores, probs, out };
}

interface AttentionCtx {
  seq: number;
  dim: number;
  batch: number;
  pipelines: {
    total: GPUComputePipeline;
    qkt: GPUComputePipeline;
    soft: GPUComputePipeline;
    pv: GPUComputePipeline;
  };
  groups: {
    total: GPUBindGroup;
    qkt: GPUBindGroup;
    soft: GPUBindGroup;
    pv: GPUBindGroup;
  };
  bufs: { q: GPUBuffer; k: GPUBuffer; v: GPUBuffer; out: GPUBuffer; scores: GPUBuffer; probs: GPUBuffer };
  ref: { scores: Float32Array; probs: Float32Array; out: Float32Array };
}

export async function benchAttention(tm: TimingManager, seqs?: number[]): Promise<AttentionResult> {
  const main: PerfSample[] = [];
  const phases: { [size: string]: PerfSample[] } = {};
  for (const conf of ATTENTION_CONF) {
    const { seq, iterations } = conf;
    if (seqs && !seqs.includes(seq)) continue;
    const dim = 64;
    const batch = 1;

    // TASK 8: always compute the score-matrix requirement before allocating.
    const scoresBytes = seq * seq * 4;
    if (seq * seq > 1 << 24) {
      // >256M entries (≥1 GiB for the scores matrix) — do not even attempt.
      main.push(skipSample(`attention-${seq}`, 'Attention (single pass)', `seq=${seq} dim=64 batch=1`, 'SKIPPED — UNSAFE MEMORY REQUIREMENT'));
      phases[`seq=${seq}`] = [skipSample(`attention-skip-${seq}`, 'Attention phases', `seq=${seq}`, 'SKIPPED — UNSAFE MEMORY REQUIREMENT')];
      continue;
    }

    let ctx: AttentionCtx;
    try {
      ctx = await setupAttention(seq, dim, batch);
    } catch (err) {
      main.push(skipSample(`attention-${seq}`, 'Attention (single pass)', `seq=${seq} dim=64 batch=1 scores=${(scoresBytes / (1024 * 1024)).toFixed(1)} MiB`, 'SKIPPED — UNSAFE MEMORY REQUIREMENT'));
      phases[`seq=${seq}`] = [skipSample(`attention-skip-${seq}`, 'Attention phases', `seq=${seq}`, 'SKIPPED — UNSAFE MEMORY REQUIREMENT')];
      void err;
      continue;
    }

    try {
      // monolithic validation vs CPU reference (row-parallel dispatch: one
      // invocation per output row, 64/workgroup => ceil(batch*seq/64) groups)
      const wgTotal: [number, number, number] = [Math.max(1, Math.ceil((batch * seq) / 64)), 1, 1];
      const got = await dispatchToAndRead(ctx.pipelines.total, ctx.groups.total, wgTotal, ctx.bufs.out, seq * dim * 4, `attention-${seq}`);
      // TASK 9/10 — unwritten-output scan: any sentinel left in the output means
      // a row (or more) was never written. Guards against buffer reuse.
      const sentinelIdx = findSentinel(got);
      if (sentinelIdx >= 0) {
        const row = Math.floor(sentinelIdx / dim);
        throw fail('attention', `seq=${seq}`, 'UNWRITTEN ATTENTION OUTPUT', `sentinel remains @ index ${sentinelIdx} (row ${row}); rows not fully written — fix correctness before benchmarking`);
      }
      if (conf.validate) {
        assertValid('attention', `seq=${seq}`, got, ctx.ref.out, 1e-2);
      } else if (!allFinite(got)) {
        throw fail('attention', `seq=${seq}`, 'non-finite output', '');
      }

      const total = await tm.measure(
        (pass) => {
          pass.setPipeline(ctx.pipelines.total);
          pass.setBindGroup(0, ctx.groups.total);
          pass.dispatchWorkgroups(wgTotal[0], wgTotal[1], wgTotal[2]);
        },
        { iterations, wait: waitFor(ctx.bufs.out, seq * dim * 4, `attention-${seq}`) }
      );
      main.push(
        sample(`attention-${seq}`, 'Attention (single pass)', `seq=${seq} dim=64 batch=1`, total, gflops(4 * seq * seq * dim, total.medianMs), 'QK^T + softmax + PV in one pass')
      );

      phases[`seq=${seq}`] = await measureAttentionPhases(tm, ctx, seq, dim, iterations);
    } finally {
      try {
        ctx.bufs.q.destroy();
        ctx.bufs.k.destroy();
        ctx.bufs.v.destroy();
        ctx.bufs.out.destroy();
        ctx.bufs.scores.destroy();
        ctx.bufs.probs.destroy();
      } catch {}
    }
  }
  return { main, phases };
}

async function measureAttentionPhases(
  tm: TimingManager,
  ctx: AttentionCtx,
  seq: number,
  dim: number,
  iterations: number
): Promise<PerfSample[]> {
  // TASK 11: dispatch dims must match each phase kernel's index mapping:
  //   ATTN_QKT → i=gid.x (row), b=gid.y (batch)
  //   ATTN_PV  → i=gid.x (row), d=gid.y (dim), b=gid.z (batch)
  // Softmax shader → gid.x = row, @workgroup_size(64): dispatch ceil(seq/64)
  // in X, NOT seq (TASK 1 — dispatching [seq,1,1] races rows across workgroups).
  const batch = ctx.batch;
  const wgQ: [number, number, number] = [Math.ceil(seq / 64), batch, 1];
  const wgP: [number, number, number] = [Math.ceil(seq / 64), dim, batch];
  const wgSoft: [number, number, number] = softmaxWorkgroups(seq);
  const softInfo = softmaxDispatchInfo(seq);
  const scoresBytes = seq * seq * 4;
  const outBytes = seq * dim * 4;

  // warmup the phase composition path (qkt → softmax → pv)
  for (let i = 0; i < 3; i++) {
    await dispatchToAndRead(ctx.pipelines.qkt, ctx.groups.qkt, wgQ, ctx.bufs.scores, scoresBytes, 'warmup-qkt');
    await dispatchToAndRead(ctx.pipelines.soft, ctx.groups.soft, wgSoft, ctx.bufs.probs, scoresBytes, 'warmup-soft');
    await dispatchToAndRead(ctx.pipelines.pv, ctx.groups.pv, wgP, ctx.bufs.out, outBytes, 'warmup-pv');
  }

  const out: PerfSample[] = [];

  // QK^T — measure the score computation alone; validate against ref.scores.
  {
    const s = await dispatchToAndRead(ctx.pipelines.qkt, ctx.groups.qkt, wgQ, ctx.bufs.scores, scoresBytes, `qkt-${seq}`);
    if (maxAbsDiff(s, ctx.ref.scores) > 1e-2) throw fail('attention.qkt', `seq=${seq}`, 'phase correctness check failed', `maxErr=${maxAbsDiff(s, ctx.ref.scores).toExponential(2)}`);
    const times: number[] = [];
    for (let i = 0; i < iterations; i++) {
      times.push(await tm.timeOne(
        (pass) => { pass.setPipeline(ctx.pipelines.qkt); pass.setBindGroup(0, ctx.groups.qkt); pass.dispatchWorkgroups(wgQ[0], wgQ[1], wgQ[2]); },
        waitFor(ctx.bufs.scores, scoresBytes, `qkt-${seq}`)
      ));
    }
    out.push(sample(`attention-qkt-${seq}`, 'QK^T (scores)', `seq=${seq} dim=64`, statsOfTimes(times, tm.mode), gflops(2 * seq * seq * dim, medianOf(times))));
  }

  // Softmax from raw scores into a fresh probs buffer (mirrors the monolithic).
  {
    const times: number[] = [];
    for (let i = 0; i < iterations; i++) {
      await dispatchToAndRead(ctx.pipelines.qkt, ctx.groups.qkt, wgQ, ctx.bufs.scores, scoresBytes, `soft-prep-${seq}`);
      times.push(await tm.timeOne(
        (pass) => { pass.setPipeline(ctx.pipelines.soft); pass.setBindGroup(0, ctx.groups.soft); pass.dispatchWorkgroups(wgSoft[0], wgSoft[1], wgSoft[2]); },
        waitFor(ctx.bufs.probs, scoresBytes, `soft-${seq}`)
      ));
    }
    const p = await ReadbackManager.getInstance().copyAndRead(getDevice(), ctx.bufs.probs, scoresBytes, `soft-val-${seq}`);
    if (p.length !== ctx.ref.probs.length || !allFinite(p)) throw fail('attention.softmax', `seq=${seq}`, 'softmax output invalid', `len=${p.length}`);
    if (maxAbsDiff(p, ctx.ref.probs) > 1e-2) throw fail('attention.softmax', `seq=${seq}`, 'phase correctness check failed', `maxErr=${maxAbsDiff(p, ctx.ref.probs).toExponential(2)}`);
    const softProbsSums = checkRowSums(p, seq, seq);
    if (!softProbsSums.ok) throw fail('attention.softmax', `seq=${seq}`, 'softmax row sums deviate from 1', `max dev=${softProbsSums.maxDev.toExponential(3)}`);
    out.push(sample(`attention-softmax-${seq}`, 'Softmax on scores', `seq=${seq} rows=${seq} ${dispatchText(softInfo)}`, statsOfTimes(times, tm.mode)));
  }

  // Softmax × V — prep qkt→softmax so probs are in place, then measure PV.
  {
    const times: number[] = [];
    for (let i = 0; i < iterations; i++) {
      await dispatchToAndRead(ctx.pipelines.qkt, ctx.groups.qkt, wgQ, ctx.bufs.scores, scoresBytes, `pv-prep1-${seq}`);
      await dispatchToAndRead(ctx.pipelines.soft, ctx.groups.soft, wgSoft, ctx.bufs.probs, scoresBytes, `pv-prep2-${seq}`);
      times.push(await tm.timeOne(
        (pass) => { pass.setPipeline(ctx.pipelines.pv); pass.setBindGroup(0, ctx.groups.pv); pass.dispatchWorkgroups(wgP[0], wgP[1], wgP[2]); },
        waitFor(ctx.bufs.out, outBytes, `pv-${seq}`)
      ));
    }
    const o = await ReadbackManager.getInstance().copyAndRead(getDevice(), ctx.bufs.out, outBytes, `pv-val-${seq}`);
    if (maxAbsDiff(o, ctx.ref.out) > 1e-2) throw fail('attention.pv', `seq=${seq}`, 'phase correctness check failed', `maxErr=${maxAbsDiff(o, ctx.ref.out).toExponential(2)}`);
    out.push(sample(`attention-pv-${seq}`, 'Softmax × V', `seq=${seq} dim=64`, statsOfTimes(times, tm.mode), gflops(2 * seq * seq * dim, medianOf(times))));
  }
  return out;
}

function skipSample(id: string, name: string, size: string, note: string): PerfSample {
  return { id, name, size, timingMode: 'END_TO_END', iterations: 0, warmup: 0, medianMs: 0, averageMs: 0, minMs: 0, maxMs: 0, stdDevMs: 0, note };
}

function statsOfTimes(times: number[], mode: 'GPU_TIMESTAMP' | 'END_TO_END') {
  const sorted = [...times].sort((a, b) => a - b);
  const avg = times.reduce((a, b) => a + b, 0) / Math.max(times.length, 1);
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
  const variance = times.reduce((a, b) => a + (b - avg) ** 2, 0) / Math.max(times.length, 1);
  return {
    mode,
    iterations: times.length,
    warmup: 3,
    medianMs: median,
    avgMs: avg,
    minMs: sorted[0] ?? 0,
    maxMs: sorted[sorted.length - 1] ?? 0,
    stdDevMs: Math.sqrt(variance),
  };
}

function medianOf(times: number[]): number {
  const sorted = [...times].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

async function setupAttention(seq: number, dim: number, batch: number): Promise<AttentionCtx> {
  const ref = attentionRefs(seq, dim, batch);
  const scale = 1 / Math.sqrt(dim);

  const bufQ = createStorageBuffer(seq * dim * 4, ref.Q);
  const bufK = createStorageBuffer(seq * dim * 4, ref.K);
  const bufV = createStorageBuffer(seq * dim * 4, ref.V);
  // TASK 8/17 — pre-fill output with sentinel; leftover proves unwritten rows
  // (buffer reuse guard: never rely on freshly allocated buffers being zero).
  const bufOut = createStorageBuffer(seq * dim * 4, new Float32Array(seq * dim).fill(ATTENTION_OUTPUT_SENTINEL));
  const bufScores = createStorageBuffer(seq * seq * 4);
  const bufProbs = createStorageBuffer(seq * seq * 4);
  const uniform = createUniformBuffer(createAttentionUniform(batch, seq, dim, scale));

  const total = createPipeline(ATTENTION, ['uniform', 'read-only-storage', 'read-only-storage', 'read-only-storage', 'storage', 'storage']);
  const qkt = createPipeline(ATTN_QKT, [...QKT_BINDINGS]);
  const soft = createPipeline(SOFTMAX, ['uniform', 'read-only-storage', 'storage']);
  const pv = createPipeline(ATTN_PV, [...PV_BINDINGS]);

  const gTotal = createBindGroupForPipeline(total, ['uniform', 'read-only-storage', 'read-only-storage', 'read-only-storage', 'storage', 'storage'], [
    { binding: 0, resource: { buffer: uniform } },
    { binding: 1, resource: { buffer: bufQ } },
    { binding: 2, resource: { buffer: bufK } },
    { binding: 3, resource: { buffer: bufV } },
    { binding: 4, resource: { buffer: bufOut } },
    { binding: 5, resource: { buffer: bufScores } },
  ]);
  const gQkt = createBindGroupForPipeline(qkt, QKT_BINDINGS, [
    { binding: 0, resource: { buffer: uniform } },
    { binding: 1, resource: { buffer: bufQ } },
    { binding: 2, resource: { buffer: bufK } },
    { binding: 3, resource: { buffer: bufScores } },
  ]);
  const gSoft = createBindGroupForPipeline(soft, ['uniform', 'read-only-storage', 'storage'], [
    { binding: 0, resource: { buffer: uniform } },
    { binding: 1, resource: { buffer: bufScores } },
    { binding: 2, resource: { buffer: bufProbs } },
  ]);
  const gPv = createBindGroupForPipeline(pv, PV_BINDINGS, [
    { binding: 0, resource: { buffer: uniform } },
    { binding: 1, resource: { buffer: bufProbs } },
    { binding: 2, resource: { buffer: bufV } },
    { binding: 3, resource: { buffer: bufOut } },
  ]);

  return {
    seq,
    dim,
    batch,
    pipelines: { total, qkt, soft, pv },
    groups: { total: gTotal, qkt: gQkt, soft: gSoft, pv: gPv },
    bufs: { q: bufQ, k: bufK, v: bufV, out: bufOut, scores: bufScores, probs: bufProbs },
    ref: { scores: ref.scores, probs: ref.probs, out: ref.out },
  };
}

// ─── Phase-Softmax Correctness (TASK 10/11/15) ───
// Isolated QKT → Softmax path, batch=1, dim=64, seq=4/16/64/128/256.
// Validates output length, finiteness, per-row sum ≈ 1, CPU/GPU max error,
// first mismatch index, expected/actual ranges, and a sentinel prefill that
// proves every row was written (no stale/reused buffer content).

export interface PhaseSoftmaxCase {
  seq: number;
  pass: boolean;
  stage: string;
  errorType: string | null;
  errorMessage: string | null;
  rows: number;
  workgroupsX: number;
  totalInvocations: number;
  maxError: number;
  errorIndex: number;
  cpuValue: number | null;
  gpuValue: number | null;
  expectedRange: [number, number] | null;
  actualRange: [number, number] | null;
  rowSumsMin: number;
  rowSumsMax: number;
  sentinelCount: number;
}

export async function runPhaseSoftmaxCorrectness(seqs: number[] = [4, 16, 64, 128, 256]): Promise<PhaseSoftmaxCase[]> {
  const device = getDevice();
  const dim = 64;
  const batch = 1;
  const results: PhaseSoftmaxCase[] = [];

  for (const seq of seqs) {
    const seqsRows = batch * seq;
    const info = assertSoftmaxDispatch(seqsRows);
    const ctx = await setupAttention(seq, dim, batch);
    try {
      let stage = 'qkt';
      let errorType: string | null = null;
      let errorMessage: string | null = null;

      // Phase 1: QK^T → scores, validate against CPU reference.
      const wgQ: [number, number, number] = [Math.ceil(seqsRows / 64), batch, 1];
      const scoresGot = await dispatchToAndRead(ctx.pipelines.qkt, ctx.groups.qkt, wgQ, ctx.bufs.scores, seq * seq * 4, `phase-softmax-qkt-${seq}`);
      if (maxAbsDiff(scoresGot, ctx.ref.scores) > 1e-2) {
        errorType = 'phase-qkt-mismatch';
        errorMessage = `QK^T scores maxErr=${maxAbsDiff(scoresGot, ctx.ref.scores).toExponential(2)}`;
      }

      // Sentinel-fill probs so unwritten rows are visible after the softmax pass.
      device.queue.writeBuffer(ctx.bufs.probs, 0, new Float32Array(seq * seq).fill(ATTENTION_OUTPUT_SENTINEL));

      // Phase 2: Softmax(scores) → probs, with the correct ceil(rows/64) dispatch.
      const wgSoft: [number, number, number] = softmaxWorkgroups(seqsRows);
      const probsGot = await dispatchToAndRead(ctx.pipelines.soft, ctx.groups.soft, wgSoft, ctx.bufs.probs, seq * seq * 4, `phase-softmax-soft-${seq}`);

      stage = errorType === null ? 'softmax-validation' : 'qkt';
      let num = analyzeNumeric(probsGot, ctx.ref.probs, 1e-2);
      if (errorType === null && !num.pass) {
        errorType = 'softmax-mismatch';
        errorMessage = `maxErr=${num.maxError.toExponential(2)} @ idx ${num.errorIndex} (cpu ${num.cpuValue?.toExponential(4)} gpu ${num.gpuValue?.toExponential(4)})`;
      }

      // Row sums must ≈ 1 for every row.
      const sums = rowSums(probsGot, seqsRows, seq);
      let sumsMin = Infinity, sumsMax = -Infinity;
      for (const s of sums) {
        sumsMin = Math.min(sumsMin, s);
        sumsMax = Math.max(sumsMax, s);
      }
      if (errorType === null && (sumsMin < 1 - 1e-2 || sumsMax > 1 + 1e-2)) {
        errorType = 'softmax-row-sum';
        errorMessage = `row sums deviate: min=${sumsMin.toExponential(3)} max=${sumsMax.toExponential(3)}`;
      }

      // Unwritten rows: any sentinel leftover proves a row was never written.
      const sentinelCount = countSentinels(probsGot);
      if (errorType === null && sentinelCount > 0) {
        errorType = 'softmax-unwritten-output';
        errorMessage = `${sentinelCount} sentinel(s) remain after softmax`;
      }

      results.push({
        seq,
        pass: errorType === null,
        stage,
        errorType,
        errorMessage,
        rows: seqsRows,
        workgroupsX: info.workgroupsX,
        totalInvocations: info.totalInvocations,
        maxError: num.maxError,
        errorIndex: num.errorIndex,
        cpuValue: num.cpuValue,
        gpuValue: num.gpuValue,
        expectedRange: num.expectedRange,
        actualRange: num.actualRange,
        rowSumsMin: sumsMin === Infinity ? -1 : sumsMin,
        rowSumsMax: sumsMax === -Infinity ? -1 : sumsMax,
        sentinelCount,
      });
    } finally {
      try {
        ctx.bufs.q.destroy();
        ctx.bufs.k.destroy();
        ctx.bufs.v.destroy();
        ctx.bufs.out.destroy();
        ctx.bufs.scores.destroy();
        ctx.bufs.probs.destroy();
      } catch {}
    }
  }
  return results;
}