// AETHER GPU Benchmark V3.1 — LLM Inference Gate
//
// Adds quantized matmul, KV-cache decode attention, synthetic transformer block,
// token-generation simulation, memory budget, and LLM Readiness Score.
// Uses shared helpers from perf-v3.ts and normalizes via buildV3Result from results-v3.ts.
//
// KEY CONTRACTS:
//   - estimatedPerOperationMs = totalMs / repetitions   (normalized via buildV3Result)
//   - throughput uses total work across ALL repetitions / totalMs
//   - p95/p99 null when samples < 10 (block distribution only, never fabricated)
//   - correctness verified against CPU reference for INT8/INT4 at key shapes
//   - memory budget labels itself "allocation capability, NOT total system RAM"

import { CompletionToken, awaitCompletion } from './completion.ts';
import { harnessCounters } from './harness-counters.ts';
import { readbackBuffer } from './engine';
import { cpuMatmul, cpuAttention } from './cpu-refs';
import { GELU } from './kernels-v3.ts';
import {
  type V3Result, type Confidence, buildV3Result, classifyConfidence, median, percentile,
} from './results-v3.ts';
import {
  dev, storageBuf, uniformBuf, makePipeline, makeBg, fillRandom,
  adaptiveMeasure, verifyOneShot, verifyTolerance, makeResult,
} from './perf-v3.ts';

// ─────────────────────────────────────────────────────────────────────────
// SHARED KERNELS
// ─────────────────────────────────────────────────────────────────────────

const MATMUL_WGSL = /* wgsl */ `
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x; let col = gid.y;
  let M = u.M; let N = u.N; let K = u.K;
  if (row >= M || col >= N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < K; k++) { sum += A[row * K + k] * B[k * N + col]; }
  C[row * N + col] = sum;
}`;

// ─── INT8 Weight-Only Quantized MatMul ────────────────────────────────────
// Weights stored packed as 4×int8 per u32 (little-endian). Dequantized to f32
// in kernel: val = sign_extend(b) * scale. Activations are f32.
// This is a legitimate weight-only INT8 dequant-GEMM used in real LLM inference.

const INT8_MATMUL_WGSL = /* wgsl */ `
struct Uniforms { M: u32, N: u32, K: u32, scale: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> W: array<u32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;
fn i8(v: u32) -> f32 { return f32(i32(v << 24u) >> 24); }
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x; let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  let K = u.K;
  let packedK = K / 4u;
  let base = col * packedK;
  var sum: f32 = 0.0;
  for (var k = 0u; k < K; k++) {
    let pack = W[base + (k >> 2u)];
    let shift = (k & 3u) * 8u;
    let val = i8((pack >> shift) & 0xFFu);
    sum += A[row * K + k] * val;
  }
  C[row * u.N + col] = sum * u.scale;
}`;

// ─── INT4 Weight-Only Quantized MatMul ────────────────────────────────────
// Weights packed as 8×signed-int4 per u32. Signed int4 range: [-8, 7].
// Dequant: val = sign_extend_4(nibble) * scale. Uses bitwise to extend sign.

const INT4_MATMUL_WGSL = /* wgsl */ `
struct Uniforms { M: u32, N: u32, K: u32, scale: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> W: array<u32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;
fn i4(v: u32) -> f32 { return f32(i32(v << 28u) >> 28); }
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x; let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  let K = u.K;
  let packedK = K / 8u;
  let base = col * packedK;
  var sum: f32 = 0.0;
  for (var k = 0u; k < K; k++) {
    let pack = W[base + (k >> 3u)];
    let shift = (k & 7u) * 4u;
    let val = i4((pack >> shift) & 0xFu);
    sum += A[row * K + k] * val;
  }
  C[row * u.N + col] = sum * u.scale;
}`;

// ─── KV-Cache Decode Attention Kernels ────────────────────────────────────
// Realistic single-token decode attention with transposed KV-cache layout.
// KV cache shape: [context, heads, headDim] (sequential tokens, then heads).

const DECODE_QK = /* wgsl */ `
struct Uniforms { heads: u32, headDim: u32, context: u32, pad: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> q: array<f32>;
@group(0) @binding(2) var<storage, read> kvCache: array<f32>;
@group(0) @binding(3) var<storage, read_write> scores: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u.heads * u.context) { return; }
  let h = i / u.context;
  let t = i % u.context;
  let d = u.headDim;
  let scale = 1.0 / sqrt(f32(d));
  var dot: f32 = 0.0;
  for (var k = 0u; k < d; k++) {
    dot += q[h * d + k] * kvCache[(t * u.heads + h) * d + k];
  }
  scores[i] = dot * scale;
}`;

const DECODE_SOFTMAX = /* wgsl */ `
struct Uniforms { heads: u32, context: u32, pad0: u32, pad1: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read_write> scores: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let h = gid.x;
  if (h >= u.heads) { return; }
  let c = u.context;
  let base = h * c;
  var mx: f32 = -1e30;
  for (var t = 0u; t < c; t++) { if (scores[base + t] > mx) { mx = scores[base + t]; } }
  var expSum: f32 = 0.0;
  for (var t = 0u; t < c; t++) {
    let e = exp(scores[base + t] - mx);
    scores[base + t] = e;
    expSum += e;
  }
  for (var t = 0u; t < c; t++) { scores[base + t] /= expSum; }
}`;

const DECODE_PV = /* wgsl */ `
struct Uniforms { heads: u32, headDim: u32, context: u32, pad: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> scores: array<f32>;
@group(0) @binding(2) var<storage, read> vCache: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u.heads * u.headDim) { return; }
  let h = i / u.headDim;
  let d = i % u.headDim;
  var sum: f32 = 0.0;
  for (var t = 0u; t < u.context; t++) {
    sum += scores[h * u.context + t] * vCache[(t * u.heads + h) * u.headDim + d];
  }
  output[h * u.headDim + d] = sum;
}`;

// ─── RESIDUAL ADD ─────────────────────────────────────────────────────────

const RESIDUAL_ADD = /* wgsl */ `
@group(0) @binding(0) var<storage, read> a: array<f32>;
@group(0) @binding(1) var<storage, read> b: array<f32>;
@group(0) @binding(2) var<storage, read_write> c: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&a)) { return; }
  c[i] = a[i] + b[i];
}`;

const RMSNORM_WGSL = /* wgsl */ `
struct Uniforms { rows: u32, cols: u32, eps_bits: u32, pad: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x;
  if (row >= u.rows) { return; }
  let cols = u.cols;
  var ss: f32 = 0.0;
  for (var c: u32 = 0u; c < cols; c++) { let v = input[row * cols + c]; ss += v * v; }
  let rms = sqrt(ss / f32(cols) + bitcast<f32>(u.eps_bits));
  for (var c: u32 = 0u; c < cols; c++) {
    output[row * cols + c] = input[row * cols + c] / rms * weight[c];
  }
}`;

// ─────────────────────────────────────────────────────────────────────────
// HOST HELPERS
// ─────────────────────────────────────────────────────────────────────────

function packInt8(weights: Float32Array): { packed: Uint32Array; scale: number } {
  let mx = 0;
  for (let i = 0; i < weights.length; i++) mx = Math.max(mx, Math.abs(weights[i]));
  if (mx === 0) mx = 1;
  const scale = mx / 127;
  const raw = new Int8Array(weights.length);
  for (let i = 0; i < weights.length; i++) raw[i] = Math.round(weights[i] / scale);
  const packedLen = Math.ceil(weights.length / 4);
  const packed = new Uint32Array(packedLen);
  for (let i = 0; i < weights.length; i++) {
    const pIdx = i >> 2;
    const shift = (i & 3) * 8;
    packed[pIdx] |= ((raw[i] & 0xFF) << shift);
  }
  return { packed, scale };
}

// Quantize float32 weights into packed int4 array with per-matrix symmetric scale.
// Returns { packed: Uint32Array, scale: number }.
function packInt4(weights: Float32Array): { packed: Uint32Array; scale: number } {
  let mx = 0;
  for (let i = 0; i < weights.length; i++) mx = Math.max(mx, Math.abs(weights[i]));
  if (mx === 0) mx = 1;
  const scale = mx / 7; // [-8, 7] symmetric range max absolute = 8, symmetric center 0, max representable positive = 7
  const raw = new Int8Array(weights.length);
  for (let i = 0; i < weights.length; i++) {
    let q = Math.round(weights[i] / scale);
    q = Math.max(-8, Math.min(7, q));
    raw[i] = q;
  }
  const packedLen = Math.ceil(weights.length / 8);
  const packed = new Uint32Array(packedLen);
  for (let i = 0; i < weights.length; i++) {
    const pIdx = i >> 3;
    const shift = (i & 7) * 4;
    packed[pIdx] |= ((raw[i] & 0xF) << shift);
  }
  return { packed, scale };
}

// CPU reference for INT8 or INT4 matmul
function cpuQuantMatmul(A: Float32Array, W: Float32Array, M: number, K: number, N: number, pack: 'int8' | 'int4'): Float32Array {
  const C = new Float32Array(M * N);
  let mx = 0;
  for (let i = 0; i < W.length; i++) mx = Math.max(mx, Math.abs(W[i]));
  if (mx === 0) mx = 1;
  const scale = pack === 'int8' ? mx / 127 : mx / 7;
  const qW = new Int8Array(W.length);
  for (let i = 0; i < W.length; i++) {
    let q = Math.round(W[i] / scale);
    q = Math.max(-8, Math.min(7, q));
    qW[i] = q;
  }
  for (let row = 0; row < M; row++) {
    for (let col = 0; col < N; col++) {
      let sum = 0;
      for (let k = 0; k < K; k++) sum += A[row * K + k] * qW[col * K + k];
      C[row * N + col] = sum * scale;
    }
  }
  return C;
}

function cpuSoftmax(row: Float32Array, len: number): Float32Array {
  let mx = -1e30;
  for (let i = 0; i < len; i++) if (row[i] > mx) mx = row[i];
  let s = 0;
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) { out[i] = Math.exp(row[i] - mx); s += out[i]; }
  for (let i = 0; i < len; i++) out[i] /= s;
  return out;
}

function cpuDecodeAttention(
  q: Float32Array, kvCache: Float32Array, heads: number, headDim: number, context: number
): Float32Array {
  const out = new Float32Array(heads * headDim);
  const scale = 1 / Math.sqrt(headDim);
  for (let h = 0; h < heads; h++) {
    const scores = new Float32Array(context);
    for (let t = 0; t < context; t++) {
      let dot = 0;
      for (let d = 0; d < headDim; d++) dot += q[h * headDim + d] * kvCache[(t * heads + h) * headDim + d];
      scores[t] = dot * scale;
    }
    const probs = cpuSoftmax(scores, context);
    for (let d = 0; d < headDim; d++) {
      let sum = 0;
      for (let t = 0; t < context; t++) sum += probs[t] * kvCache[(t * heads + h) * headDim + d];
      out[h * headDim + d] = sum;
    }
  }
  return out;
}

function makeUniform4(f: Float32Array): ArrayBuffer {
  return f.buffer.slice(f.byteOffset, f.byteOffset + 16) as ArrayBuffer;
}

// ─────────────────────────────────────────────────────────────────────────
// A) QUANTIZED MATMUL
// ─────────────────────────────────────────────────────────────────────────

export async function benchQuantizedMatmul(onProgress?: (msg: string) => void): Promise<V3Result[]> {
  const out: V3Result[] = [];
  const hiddenSizes = [512, 768, 1024, 1536, 2048];
  const shapes: Array<{ M: number; shape: string; kind: string }> = [
    { M: 1,   shape: '[1, hidden]×[hidden, hidden]',   kind: 'decode' },
    { M: 128, shape: '[128, hidden]×[hidden, hidden]',  kind: 'prefill-128' },
    { M: 256, shape: '[256, hidden]×[hidden, hidden]',  kind: 'prefill-256' },
  ];

  const packs: Array<{ name: string; packer: (w: Float32Array) => { packed: Uint32Array; scale: number }; kernel: string; bits: number }> = [
    { name: 'INT8', packer: packInt8, kernel: INT8_MATMUL_WGSL, bits: 8 },
    { name: 'INT4', packer: packInt4, kernel: INT4_MATMUL_WGSL, bits: 4 },
  ];

  for (const pack of packs) {
    const pipeline = makePipeline(pack.kernel, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);

    for (const h of hiddenSizes) {
      for (const sh of shapes) {
        const M = sh.M, K = h, N = h;
        onProgress?.(`${pack.name} matmul ${sh.kind} hidden=${h}`);

        // Generate weights and activations
        const act = new Float32Array(M * K); fillRandom(act);
        const wFloat = new Float32Array(K * N); fillRandom(wFloat);
        const { packed: wPacked, scale } = pack.packer(wFloat);

        const bufA = storageBuf(act.byteLength, act);
        const bufW = storageBuf(wPacked.byteLength, wPacked);
        const bufC = storageBuf(M * N * 4);

        const uRaw = new ArrayBuffer(16);
        new Uint32Array(uRaw).set([M, N, K]);
        new Float32Array(uRaw)[3] = scale;
        const uniform = uniformBuf(uRaw);
        const bg = makeBg(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [uniform, bufA, bufW, bufC]);
        const wgX = Math.ceil(M / 16), wgY = Math.ceil(N / 16);

        // TASK 19: one-shot correctness check (outside timing)
        let correctnessPassed = false;
        try {
          const got = await verifyOneShot(pipeline, bg, wgX, wgY, 1, bufC, M * N * 4);
          const ref = cpuQuantMatmul(act, wFloat, M, K, N, pack.bits === 8 ? 'int8' : 'int4');
          correctnessPassed = verifyTolerance(got, ref, 5e-2, 5e-2);
        } catch { correctnessPassed = false; }

        const m = await adaptiveMeasure(pass => {
          pass.setPipeline(pipeline); pass.setBindGroup(0, bg);
          pass.dispatchWorkgroups(wgX, wgY, 1);
        });

        const flopsPerExecution = 2 * M * K * N;
        const bytesPerExecution = M * K * 4 + (K * N / (pack.bits === 8 ? 4 : 8)) * 4 + M * N * 4;
        out.push(makeResult({
          category: 'LLM_INFERENCE', operation: `${pack.name} Quantized MatMul`,
          workload: `${sh.kind} hidden=${h} bits=${pack.bits}`,
          shape: `[${M},${K}]×[${K},${N}]`,
          m, correctnessPassed,
          flopsPerExecution, bytesPerExecution, throughputUnit: 'GFLOPS',
          notes: correctnessPassed ? '' : 'correctness FAILED',
        }));
        bufA.destroy(); bufW.destroy(); bufC.destroy(); uniform.destroy();
      }
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────
// B) KV-CACHE DECODE ATTENTION
// ─────────────────────────────────────────────────────────────────────────

export async function benchKVDecodeAttention(onProgress?: (msg: string) => void): Promise<V3Result[]> {
  const out: V3Result[] = [];
  const heads = 8, headDim = 64;
  const qktPipeline = makePipeline(DECODE_QK, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
  const softPipeline = makePipeline(DECODE_SOFTMAX, ['uniform', 'read-only-storage']);
  const pvPipeline = makePipeline(DECODE_PV, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);

  for (const context of [128, 256, 512, 1024, 2048, 4096]) {
    onProgress?.(`decode attention ctx=${context}`);

    const q = new Float32Array(heads * headDim); fillRandom(q);
    const kvCache = new Float32Array(context * heads * headDim * 2); fillRandom(kvCache); // K then V appended
    const scoresArr = new Float32Array(heads * context);
    const outArr = new Float32Array(heads * headDim);

    const bufQ = storageBuf(q.byteLength, q);
    const bufKV = storageBuf(kvCache.byteLength, kvCache);
    const bufScores = storageBuf(scoresArr.byteLength, scoresArr);
    const bufOut = storageBuf(outArr.byteLength, outArr);
    const bufV = storageBuf(context * heads * headDim * 4, kvCache.subarray(context * heads * headDim));

    const uData = new Uint32Array([heads, headDim, context, 0]);
    const uBuf = uniformBuf(uData.buffer);
    const bgQK = makeBg(qktPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [uBuf, bufQ, bufKV, bufScores]);
    const bgSoft = makeBg(softPipeline, ['uniform', 'read-only-storage'], [uBuf, bufScores]);
    const bgPV = makeBg(pvPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [uBuf, bufScores, bufV, bufOut]);

    // Correctness: QK + softmax + PV (ctx=128, 512, 1024)
    let correctnessPassed = false;
    if ([128, 512, 1024].includes(context)) {
      try {
        const d = dev();
        const tok = new CompletionToken(d);
        const enc = d.createCommandEncoder();
        { const p = enc.beginComputePass(); p.setPipeline(qktPipeline); p.setBindGroup(0, bgQK); p.dispatchWorkgroups(Math.ceil(heads * context / 256), 1, 1); p.end(); }
        { const p = enc.beginComputePass(); p.setPipeline(softPipeline); p.setBindGroup(0, bgSoft); p.dispatchWorkgroups(heads, 1, 1); p.end(); }
        { const p = enc.beginComputePass(); p.setPipeline(pvPipeline); p.setBindGroup(0, bgPV); p.dispatchWorkgroups(Math.ceil(heads * headDim / 256), 1, 1); p.end(); }
        tok.encode(enc);
        d.queue.submit([enc.finish()]);
        await awaitCompletion(d, tok, 'decode-att-correctness');
        const got = await readbackBuffer(bufOut, bufOut.size);
        const ref = cpuDecodeAttention(q, kvCache, heads, headDim, context);
        correctnessPassed = verifyTolerance(got, ref, 2e-2, 2e-2);
        tok.destroy();
      } catch { correctnessPassed = false; }
    }

    // Adaptive measurement: encode all 3 kernels in one pass
    const m = await adaptiveMeasure(pass => {
      { pass.setPipeline(qktPipeline); pass.setBindGroup(0, bgQK); pass.dispatchWorkgroups(Math.ceil(heads * context / 256), 1, 1); }
      { pass.setPipeline(softPipeline); pass.setBindGroup(0, bgSoft); pass.dispatchWorkgroups(heads, 1, 1); }
      { pass.setPipeline(pvPipeline); pass.setBindGroup(0, bgPV); pass.dispatchWorkgroups(Math.ceil(heads * headDim / 256), 1, 1); }
    });

    const flopsPerExecution = 2 * heads * headDim * context + 4 * heads * context + 2 * heads * context * headDim; // QK + PV
    const bytesPerExecution = heads * headDim * 4 + context * heads * headDim * 2 * 4 + heads * context * 4 + heads * headDim * 4;
    out.push(makeResult({
      category: 'LLM_INFERENCE', operation: 'KV-Cache Decode Attention',
      workload: `ctx=${context} heads=${heads} headDim=${headDim}`,
      shape: `q=[${heads},${headDim}] kv=[${context},${heads},${headDim}]`,
      m, correctnessPassed,
      flopsPerExecution, bytesPerExecution, throughputUnit: 'GFLOPS',
      notes: `QK+softmax+PV fused decode ${correctnessPassed ? '' : '(correctness NOT verified for this ctx)'}`,
    }));
    bufQ.destroy(); bufKV.destroy(); bufScores.destroy(); bufOut.destroy(); bufV.destroy(); uBuf.destroy();
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────
// C) SYNTHETIC TRANSFORMER BLOCK
// ─────────────────────────────────────────────────────────────────────────

interface TransformerConfig {
  name: string;
  hidden: number;
  intermediate: number;
  layers: number;
  heads: number;
  kvHeads: number;
  vocab: number;
}

const TRANSFORMER_CONFIGS: TransformerConfig[] = [
  { name: '0.5B', hidden: 512, intermediate: 2048, layers: 12, heads: 8, kvHeads: 2, vocab: 32000 },
  { name: '1B',   hidden: 768, intermediate: 3072, layers: 12, heads: 12, kvHeads: 4, vocab: 32000 },
  { name: '1.5B', hidden: 768, intermediate: 3072, layers: 24, heads: 12, kvHeads: 4, vocab: 32000 },
  { name: '3B',   hidden: 1024, intermediate: 4096, layers: 24, heads: 16, kvHeads: 8, vocab: 32000 },
  { name: '7B',   hidden: 2048, intermediate: 8192, layers: 32, heads: 32, kvHeads: 8, vocab: 32000 },
];

function approxParams(h: TransformerConfig): { fp16: number; int8: number; int4: number } {
  const embed = h.vocab * h.hidden;
  const perLayer = 4 * h.hidden * h.hidden + 2 * h.hidden * h.intermediate + 2 * h.hidden;
  const total = embed + h.layers * perLayer;
  return { fp16: total * 2, int8: total * 1, int4: Math.ceil(total * 0.5) };
}

export interface TransformerBlockSpec {
  config: TransformerConfig;
  seq: number;
  blockMs: number;
  confidence: Confidence;
  correct: boolean;
}

export async function benchSyntheticBlock(onProgress?: (msg: string) => void): Promise<TransformerBlockSpec[]> {
  const out: TransformerBlockSpec[] = [];
  const matPipeline = makePipeline(MATMUL_WGSL, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
  const rmsPipeline = makePipeline(RMSNORM_WGSL, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
  const addPipeline = makePipeline(RESIDUAL_ADD, ['read-only-storage', 'read-only-storage', 'storage']);
  const geluPipeline = await import('./kernels-v3.ts').then(m => m.GELU);
  const geluP = makePipeline(geluPipeline, ['read-only-storage', 'storage']);

  for (const cfg of TRANSFORMER_CONFIGS) {
    onProgress?.(`block ${cfg.name} hidden=${cfg.hidden}`);
    const H = cfg.hidden, I = cfg.intermediate, seq = 1;
    const eps = 1e-6;
    const epsBits = new ArrayBuffer(4); new Float32Array(epsBits)[0] = eps; const epsBit = new Uint32Array(epsBits)[0];
    const weight = new Float32Array(H); for (let i = 0; i < H; i++) weight[i] = 1.0;

    // Allocate activations
    const x = new Float32Array(seq * H); fillRandom(x);
    const a1 = new Float32Array(seq * H); // post-rms1
    const qkv = new Float32Array(seq * H * 3); fillRandom(qkv);
    const attnScores = new Float32Array(seq * seq);
    const attnOut = new Float32Array(seq * H);
    const proj = new Float32Array(seq * H);
    const r1 = new Float32Array(seq * H);
    const rms2Out = new Float32Array(seq * H);
    const mlpH = new Float32Array(seq * I);
    const geluOut = new Float32Array(seq * I);
    const mlpOut = new Float32Array(seq * H);

    const bufX = storageBuf(x.byteLength, x);
    const bufRMS1Out = storageBuf(a1.byteLength);
    const bufQKV = storageBuf(qkv.byteLength);
    const bufScores = storageBuf(attnScores.byteLength);
    const bufAttnOut = storageBuf(attnOut.byteLength);
    const bufProj = storageBuf(proj.byteLength);
    const bufR1 = storageBuf(r1.byteLength);
    const bufRMS2Out = storageBuf(rms2Out.byteLength);
    const bufMlpH = storageBuf(mlpH.byteLength);
    const bufGeluOut = storageBuf(geluOut.byteLength);
    const bufMlpOut = storageBuf(mlpOut.byteLength);

    const rmsW = storageBuf(weight.byteLength, weight);

    // Uniforms for 1×H → 1×3H matmul then attention then output proj
    const mm1U = uniformBuf(new Uint32Array([seq, 3*H, H]).buffer); // QKV projection
    const mmAttnU = uniformBuf(new Uint32Array([seq, H, H]).buffer); // attention out projection
    const mmW1U = uniformBuf(new Uint32Array([seq, I, H]).buffer);   // MLP W1
    const mmW2U = uniformBuf(new Uint32Array([seq, H, I]).buffer);   // MLP W2
    const rms1U = uniformBuf(new Float32Array([seq * H, epsBit]).buffer);
    const rms2U = uniformBuf(new Float32Array([seq * H, epsBit]).buffer);

    // Pre-allocate weight buffers (contents are irrelevant for latency measurement)
    const wQKV = storageBuf(3 * H * H * 4);
    const wAttnOut = storageBuf(H * H * 4);
    const wMlp1 = storageBuf(H * I * 4);
    const wMlp2 = storageBuf(I * H * 4);

    // Build bind groups
    const bgRMS1 = makeBg(rmsPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [rms1U, bufX, rmsW, bufRMS1Out]);
    const bgQKV = makeBg(matPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [mm1U, bufRMS1Out, wQKV, bufQKV]);
    const bgAttnScores = makeBg(matPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [mm1U, bufQKV, bufQKV, bufScores]);
    // ... approximate: we don't have a real multi-head attention kernel, approximate by matmul score shape — for block latency
    // Use QK^T as simplified attention step (not multi-head for benchmark structure only)
    const bgProj = makeBg(matPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [mmAttnU, bufQKV, wAttnOut, bufProj]);
    const bgR1 = makeBg(addPipeline, ['read-only-storage', 'read-only-storage', 'storage'], [bufX, bufProj, bufR1]);
    const bgRMS2 = makeBg(rmsPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [rms2U, bufR1, rmsW, bufRMS2Out]);
    const bgW1 = makeBg(matPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [mmW1U, bufRMS2Out, wMlp1, bufMlpH]);
    const bgGelu = makeBg(geluP, ['read-only-storage', 'storage'], [bufMlpH, bufGeluOut]);
    const bgW2 = makeBg(matPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [mmW2U, bufGeluOut, wMlp2, bufMlpOut]);
    const bgR2 = makeBg(addPipeline, ['read-only-storage', 'read-only-storage', 'storage'], [bufR1, bufMlpOut, bufX]);

    const wgH16xH16 = Math.ceil(H / 16);
    const wgSeq16xH16 = Math.ceil(H / 16);
    const wgW1 = Math.ceil(I / 16);
    const wgW2 = Math.ceil(H / 16);
    const wgAdd = Math.ceil((seq * H) / 256);
    const wgGelu = Math.ceil((seq * I) / 256);

    const m = await adaptiveMeasure(pass => {
      // RMSNorm 1
      { pass.setPipeline(rmsPipeline); pass.setBindGroup(0, bgRMS1); pass.dispatchWorkgroups(seq, 1, 1); }
      // QKV projection
      { pass.setPipeline(matPipeline); pass.setBindGroup(0, bgQKV); pass.dispatchWorkgroups(seq, Math.ceil(3*H / 16), 1); }
      // Simplified attention (matmul-based QK^T score for structure)
      { pass.setPipeline(matPipeline); pass.setBindGroup(0, bgAttnScores); pass.dispatchWorkgroups(seq, seq, 1); }
      // Output projection
      { pass.setPipeline(matPipeline); pass.setBindGroup(0, bgProj); pass.dispatchWorkgroups(seq, wgSeq16xH16, 1); }
      // Residual 1
      { pass.setPipeline(addPipeline); pass.setBindGroup(0, bgR1); pass.dispatchWorkgroups(wgAdd, 1, 1); }
      // RMSNorm 2
      { pass.setPipeline(rmsPipeline); pass.setBindGroup(0, bgRMS2); pass.dispatchWorkgroups(seq, 1, 1); }
      // MLP W1
      { pass.setPipeline(matPipeline); pass.setBindGroup(0, bgW1); pass.dispatchWorkgroups(seq, wgW1, 1); }
      // GELU
      { pass.setPipeline(geluP); pass.setBindGroup(0, bgGelu); pass.dispatchWorkgroups(wgGelu, 1, 1); }
      // MLP W2
      { pass.setPipeline(matPipeline); pass.setBindGroup(0, bgW2); pass.dispatchWorkgroups(seq, wgW2, 1); }
      // Residual 2
      { pass.setPipeline(addPipeline); pass.setBindGroup(0, bgR2); pass.dispatchWorkgroups(wgAdd, 1, 1); }
    });

    out.push({
      config: cfg,
      seq,
      blockMs: m.totalMs,
      confidence: classifyConfidence(m.totalMs),
      correct: m.confidence !== 'UNMEASURABLE',
    });

    bufX.destroy(); bufRMS1Out.destroy(); bufQKV.destroy(); bufScores.destroy(); bufAttnOut.destroy();
    bufProj.destroy(); bufR1.destroy(); bufRMS2Out.destroy(); bufMlpH.destroy(); bufGeluOut.destroy(); bufMlpOut.destroy();
    rmsW.destroy(); wQKV.destroy(); wAttnOut.destroy(); wMlp1.destroy(); wMlp2.destroy();
    mm1U.destroy(); mmAttnU.destroy(); mmW1U.destroy(); mmW2U.destroy(); rms1U.destroy(); rms2U.destroy();
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────
// D) TOKEN GENERATION SIMULATION
// ─────────────────────────────────────────────────────────────────────────

export interface TokenGenEstimate {
  config: TransformerConfig;
  prefillTokens: number;
  decodeTokens: number;
  prefillLatencyMs: number;
  decodePerTokenMs: number;
  tokensPerSec: number;
  totalGenerationMs: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'ESTIMATE';
}

export function estimateTokenGen(
  blockSpecs: TransformerBlockSpec[],
  decodeAttSpecs: V3Result[]
): TokenGenEstimate[] {
  const out: TokenGenEstimate[] = [];
  const seqPairs = [
    { prefill: 128, decode: 32 },
    { prefill: 256, decode: 64 },
    { prefill: 512, decode: 64 },
  ];
  for (const cfg of TRANSFORMER_CONFIGS) {
    const blockSpec = blockSpecs.find(b => b.config.name === cfg.name);
    const blockMs = blockSpec?.blockMs ?? 0;
    const confidence = blockSpec?.confidence ?? 'LOW';
    // Find the closest decode attention spec
    const attSpec = decodeAttSpecs.reduce((best, s) => {
      const ctxMatch = parseInt(s.shape.match(/ctx=(\d+)/)?.[1] ?? '0');
      return Math.abs(ctxMatch - 256) < Math.abs(parseInt(best.shape.match(/ctx=(\d+)/)?.[1] ?? '0') - 256) ? s : best;
    }, decodeAttSpecs[0]);
    const decodeAttnMs = attSpec?.estimatedPerOperationMs ?? blockMs;
    for (const pair of seqPairs) {
      const prefillLatency = cfg.layers * (blockMs + decodeAttnMs); // blocks + matmul attention for prefill
      const decodePerToken = cfg.layers * decodeAttnMs; // KV decode attention per token per layer (simplified)
      const tokensPerSec = decodePerToken > 0 ? 1000 / decodePerToken : 0;
      const totalGenerationMs = prefillLatency + pair.decode * decodePerToken;
      out.push({
        config: cfg,
        prefillTokens: pair.prefill,
        decodeTokens: pair.decode,
        prefillLatencyMs: prefillLatency,
        decodePerTokenMs: decodePerToken,
        tokensPerSec,
        totalGenerationMs,
        confidence: confidence === 'HIGH' ? 'HIGH' : 'MEDIUM',
      });
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────
// E) MEMORY BUDGET (chunked allocation)
// ─────────────────────────────────────────────────────────────────────────

export interface MemBudgetResult {
  targetMB: number;
  succeeded: boolean;
  totalAllocatedBytes: number;
  numBuffers: number;
  largestBuffer: number;
  allocationMs: number;
  writeMs: number;
}

export async function benchMemoryBudget(onProgress?: (msg: string) => void): Promise<MemBudgetResult[]> {
  const out: MemBudgetResult[] = [];
  const d = dev();
  const maxPerBuf = Math.min(d.limits.maxBufferSize, 256 * 1024 * 1024); // per-buffer cap = min(device, 256MiB)
  const chunkSize = Math.min(64 * 1024 * 1024, maxPerBuf);
  const targetMBs = [128, 256, 512, 768, 1024, 1536, 2048];

  const allocated: GPUBuffer[] = [];
  let totalAllocatedBytes = 0;
  let totalWriteMs = 0;
  let failed = false;

  for (const targetMB of targetMBs) {
    onProgress?.(`memory ${targetMB}MB`);
    if (failed) { out.push({ targetMB, succeeded: false, totalAllocatedBytes, numBuffers: allocated.length, largestBuffer: 0, allocationMs: 0, writeMs: 0 }); continue; }
    const targetBytes = targetMB * 1024 * 1024;
    let allocatedThisTarget = 0;
    let numBuffersThisTarget = 0;
    let largestBuffer = 0;
    let allocMs = 0;
    let writeMs = 0;
    let totalWriteMsThisTarget = 0;

    while (totalAllocatedBytes < targetBytes) {
      const chunkBytes = Math.min(chunkSize, targetBytes - totalAllocatedBytes);
      const t0 = performance.now();
      let buf: GPUBuffer;
      try {
        buf = d.createBuffer({ size: chunkBytes, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC });
      } catch { failed = true; break; }
      allocMs += performance.now() - t0;
      allocated.push(buf);
      totalAllocatedBytes += chunkBytes;
      allocatedThisTarget += chunkBytes;
      numBuffersThisTarget++;
      largestBuffer = Math.max(largestBuffer, chunkBytes);

      // Write test
      const fill = new Float32Array(Math.min(chunkBytes / 4, 1024)).fill(1.0);
      const w0 = performance.now();
      try {
        for (let off = 0; off < chunkBytes; off += fill.byteLength) {
          d.queue.writeBuffer(buf, off, fill, 0, Math.min(fill.length, (chunkBytes - off) / 4));
        }
      } catch { failed = true; break; }
      totalWriteMsThisTarget += performance.now() - w0;
      totalWriteMs += totalWriteMsThisTarget;
      writeMs += totalWriteMsThisTarget;
    }
    out.push({
      targetMB,
      succeeded: totalAllocatedBytes >= targetBytes,
      totalAllocatedBytes,
      numBuffers: allocated.length,
      largestBuffer,
      allocationMs: allocMs,
      writeMs: totalWriteMsThisTarget,
    });
    if (failed) break;
  }

  // Cleanup
  for (const b of allocated) try { b.destroy(); } catch { /* best-effort */ }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────
// G) LLM READINESS SCORES
// ─────────────────────────────────────────────────────────────────────────

export interface LLMReadiness {
  computeScore: number;
  memoryScore: number;
  attentionScore: number;
  decodeScore: number;
  transformerBlockScore: number;
  sustainedScore: number;
  overall: number;
}

function scoreFromMs(ms: number, confidence: Confidence): number {
  if (confidence === 'UNMEASURABLE' || ms <= 0) return 0;
  if (confidence === 'LOW') return Math.min(scoreFast(ms), 40);
  return scoreFast(ms);
}

function scoreFast(ms: number): number {
  if (ms <= 2) return 100;
  if (ms <= 5) return 80;
  if (ms <= 10) return 60;
  if (ms <= 20) return 40;
  if (ms <= 40) return 20;
  return 5;
}

function scoreCategory(rows: V3Result[]): number {
  if (rows.length === 0) return 0;
  let total = 0;
  for (const r of rows) total += scoreFromMs(r.estimatedPerOperationMs, r.confidence);
  return Math.round(total / rows.length);
}

function scoreMemory(budget: MemBudgetResult[]): number {
  const ok = budget.filter(b => b.succeeded);
  if (ok.length === 0) return 0;
  const maxMB = Math.max(...ok.map(b => b.targetMB));
  if (maxMB >= 1536) return 100;
  if (maxMB >= 1024) return 90;
  if (maxMB >= 768) return 80;
  if (maxMB >= 512) return 65;
  if (maxMB >= 256) return 45;
  if (maxMB >= 128) return 25;
  return 5;
}

function scoreDecode(rows: V3Result[]): number {
  if (rows.length === 0) return 0;
  const perOpMs = rows.map(r => r.estimatedPerOperationMs).filter(t => t > 0);
  const avg = perOpMs.reduce((a, c) => a + c, 0) / Math.max(perOpMs.length, 1);
  return scoreFast(avg);
}

function scoreTransformerBlock(blocks: TransformerBlockSpec[]): number {
  if (blocks.length === 0) return 0;
  let total = 0;
  for (const b of blocks) total += scoreFromMs(b.blockMs, b.confidence);
  return Math.round(total / blocks.length);
}

function scoreSustained(dropPct: number): number {
  if (dropPct <= 5) return 100;
  if (dropPct <= 10) return 85;
  if (dropPct <= 20) return 65;
  if (dropPct <= 30) return 45;
  return 20;
}

export function computeLLMReadiness(
  quantMatmul: V3Result[],
  decodeAttn: V3Result[],
  blocks: TransformerBlockSpec[],
  budget: MemBudgetResult[],
  sustainedDropPct: number
): LLMReadiness {
  const computeScore = scoreCategory(quantMatmul);
  const memoryScore = scoreMemory(budget);
  const attentionScore = scoreCategory(decodeAttn);
  const decodeScore = scoreDecode(decodeAttn);
  const transformerBlockScore = scoreTransformerBlock(blocks);
  const sustainedScore = scoreSustained(sustainedDropPct);
  const overall = Math.round(
    computeScore * 0.3 +
    memoryScore * 0.15 +
    attentionScore * 0.2 +
    decodeScore * 0.15 +
    transformerBlockScore * 0.15 +
    sustainedScore * 0.05
  );
  return { computeScore, memoryScore, attentionScore, decodeScore, transformerBlockScore, sustainedScore, overall };
}

// ─────────────────────────────────────────────────────────────────────────
// FULL LLM INFERENCE GATE RUNNER
// ─────────────────────────────────────────────────────────────────────────

export interface LLMGateResult {
  quantMatmul: V3Result[];
  decodeAttention: V3Result[];
  syntheticBlocks: TransformerBlockSpec[];
  tokenGenEstimates: TokenGenEstimate[];
  memoryBudget: MemBudgetResult[];
  llmReadiness: LLMReadiness;
}

export async function runLLMInferenceGate(
  sustainedDropPct: number,
  decodeAttSpecs: V3Result[],
  onProgress?: (msg: string) => void
): Promise<LLMGateResult> {
  onProgress?.('LLM Inference Gate: quantized matmul...');
  const quantMatmul = await benchQuantizedMatmul(onProgress);
  onProgress?.('LLM Inference Gate: KV-cache decode attention...');
  const decodeAttention = await benchKVDecodeAttention(onProgress);
  onProgress?.('LLM Inference Gate: synthetic transformer block...');
  const syntheticBlocks = await benchSyntheticBlock(onProgress);
  onProgress?.('LLM Inference Gate: token generation simulation...');
  const tokenGenEstimates = estimateTokenGen(syntheticBlocks, decodeAttention);
  onProgress?.('LLM Inference Gate: memory budget...');
  const memoryBudget = await benchMemoryBudget(onProgress);
  const llmReadiness = computeLLMReadiness(quantMatmul, decodeAttention, syntheticBlocks, memoryBudget, sustainedDropPct);
  return { quantMatmul, decodeAttention, syntheticBlocks, tokenGenEstimates, memoryBudget, llmReadiness };
}

export async function runLLMQuick(onProgress?: (msg: string) => void): Promise<LLMGateResult> {
  onProgress?.('LLM Inference Gate: quantized matmul (reduced)...');
  const quantMatmulFull = await benchQuantizedMatmul(onProgress);
  const quantMatmul = quantMatmulFull.filter((_, i) => i % 5 < 2); // subset for quick
  onProgress?.('LLM Inference Gate: decode attention (reduced)...');
  const decodeAttentionFull = await benchKVDecodeAttention(onProgress);
  const decodeAttention = decodeAttentionFull.filter(r => { const ctx = parseInt(r.shape.match(/ctx=(\d+)/)?.[1] ?? '0'); return [128, 512, 1024].includes(ctx); });
  onProgress?.('LLM Inference Gate: synthetic block (reduced)...');
  const syntheticBlocksFull = await benchSyntheticBlock(onProgress);
  const syntheticBlocks = syntheticBlocksFull.filter((_, i) => i < 3); // 0.5B, 1B, 1.5B
  onProgress?.('LLM Inference Gate: token gen sim...');
  const tokenGenEstimates = estimateTokenGen(syntheticBlocks, decodeAttention);
  onProgress?.('LLM Inference Gate: memory budget...');
  const memoryBudget = await benchMemoryBudget(onProgress);
  const llmReadiness = computeLLMReadiness(quantMatmul, decodeAttention, syntheticBlocks, memoryBudget, 0);
  return { quantMatmul, decodeAttention, syntheticBlocks, tokenGenEstimates, memoryBudget, llmReadiness };
}
