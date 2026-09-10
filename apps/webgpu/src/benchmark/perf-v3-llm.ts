// AETHER GPU Benchmark V3.1 â€” LLM Inference Gate
//
// Adds INT8/INT4 quantized matmul, KV-cache decode attention,
// synthetic transformer block, token generation simulation,
// memory budget, and LLM readiness score.
//
// KEY CONTRACTS:
//   estimatedPerOperationMs = totalMs / repetitions   (via buildV3Result)
//   throughput uses total work across ALL repetitions / totalMs
//   p95/p99 null when samples < 10 (block distribution only)
//   correctness verified against CPU reference
//   memory budget labels itself "WebGPU allocation capability, NOT total system RAM"

import { CompletionToken, awaitCompletion } from './completion.ts';
import { harnessCounters } from './harness-counters.ts';
import {
  dev, storageBuf, uniformBuf, makePipeline, makeBg, fillRandom,
  adaptiveMeasure, verifyOneShot, verifyTolerance,
} from './perf-v3.ts';
import { GELU } from './kernels-v3.ts';
import {
  type V3Result, type TransformerBlockConfig, type TransformerBlockResult,
  type TokenGenEstimate, type MemBudgetResult, type LLMGateResult, type LLMReadiness,
  createBenchmarkResult, getTimerResolution, computeLLMReadiness, classifyConfidence,
} from './results-v3.ts';
import {
  cpuInt8Matmul, cpuInt4Matmul, cpuKVDecodeAttn, cpuMatmul,
} from './cpu-refs.ts';
import {
  heartbeat, checkpointCategory, releaseTrackedBuffers, checkResourceFloor, trackBuffer,
} from './crash-safety.ts';
import type { ResumeContext } from './crash-safety.ts';
import {
  computeParamCount, createDisposableTracker, guardTransformerBlock,
  buildBlockedTransformerBlock,
} from './transformer-guard.ts';
import type { TransformerBlockLimits } from './transformer-guard.ts';

// â”€â”€â”€ WGSL Kernels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const INT8_MATMUL_WGSL = /* wgsl */ `
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B_packed: array<u32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;
fn unpack_int8(packed: u32, idx: u32) -> f32 {
  let shift = (idx & 3u) * 8u;
  let raw = (packed >> shift) & 0xFFu;
  let val = select(i32(raw), i32(raw) - 256, raw >= 128u);
  return f32(val);
}
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x; let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.K; k++) {
    let idx = k * u.N + col;
    let val = unpack_int8(B_packed[idx >> 2u], idx & 3u);
    sum += A[row * u.K + k] * val;
  }
  C[row * u.N + col] = sum;
}`;

const INT4_MATMUL_WGSL = /* wgsl */ `
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B_packed: array<u32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;
fn unpack_int4(packed: u32, idx: u32) -> f32 {
  let shift = (idx & 7u) * 4u;
  let raw = (packed >> shift) & 0xFu;
  let val = select(i32(raw), i32(raw) - 16, raw >= 8u);
  return f32(val);
}
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x; let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.K; k++) {
    let idx = k * u.N + col;
    let val = unpack_int4(B_packed[idx >> 3u], idx & 7u);
    sum += A[row * u.K + k] * val;
  }
  C[row * u.N + col] = sum;
}`;

const FP32_MATMUL_WGSL = /* wgsl */ `
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x; let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.K; k++) { sum += A[row * u.K + k] * B[k * u.N + col]; }
  C[row * u.N + col] = sum;
}`;

const KV_DECODE_ATTN_WGSL = /* wgsl */ `
struct Uniforms { heads: u32, headDim: u32, context: u32, pad: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> Q: array<f32>;
@group(0) @binding(2) var<storage, read> K: array<f32>;
@group(0) @binding(3) var<storage, read> V: array<f32>;
@group(0) @binding(4) var<storage, read_write> Out: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  let total = u.heads * u.headDim;
  if (idx >= total) { return; }
  let h = idx / u.headDim;
  let d = idx % u.headDim;
  let scale = 1.0 / sqrt(f32(u.headDim));
  var maxScore: f32 = -1e30;
  for (var t: u32 = 0u; t < u.context; t++) {
    var dot: f32 = 0.0;
    for (var i: u32 = 0u; i < u.headDim; i++) {
      dot += Q[h * u.headDim + i] * K[t * u.heads * u.headDim + h * u.headDim + i];
    }
    let s = dot * scale;
    if (s > maxScore) { maxScore = s; }
  }
  var sumExp: f32 = 0.0;
  var outVal: f32 = 0.0;
  for (var t: u32 = 0u; t < u.context; t++) {
    var dot: f32 = 0.0;
    for (var i: u32 = 0u; i < u.headDim; i++) {
      dot += Q[h * u.headDim + i] * K[t * u.heads * u.headDim + h * u.headDim + i];
    }
    let s = dot * scale;
    let e = exp(s - maxScore);
    sumExp += e;
    outVal += e * V[t * u.heads * u.headDim + h * u.headDim + d];
  }
  Out[h * u.headDim + d] = outVal / sumExp;
}`;

const RMSNORM_WGSL = /* wgsl */ `
struct Uniforms { N: u32, eps_bits: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x;
  if (row >= u.N) { return; }
  let cols = u.N;
  var ss: f32 = 0.0;
  for (var c: u32 = 0u; c < cols; c++) {
    let v = input[row * cols + c];
    ss += v * v;
  }
  let rms = sqrt(ss / f32(cols) + bitcast<f32>(u.eps_bits));
  for (var c: u32 = 0u; c < cols; c++) {
    output[row * cols + c] = input[row * cols + c] / rms * weight[c];
  }
}`;

const RESIDUAL_ADD_WGSL = /* wgsl */ `
@group(0) @binding(0) var<storage, read> a: array<f32>;
@group(0) @binding(1) var<storage, read> b: array<f32>;
@group(0) @binding(2) var<storage, read_write> c: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&a)) { return; }
  c[i] = a[i] + b[i];
}`;

const MATMUL_WGSL = /* wgsl */ `
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x; let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.K; k++) { sum += A[row * u.K + k] * B[k * u.N + col]; }
  C[row * u.N + col] = sum;
}`;

const ATTN_FUSED_WGSL = /* wgsl */ `
struct Uniforms { batch: u32, seq: u32, dim: u32, scale: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> QKV: array<f32>;
@group(0) @binding(2) var<storage, read_write> scores: array<f32>;
@group(0) @binding(3) var<storage, read_write> out: array<f32>;
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u.batch * u.seq) { return; }
  let b = i / u.seq; let row = i % u.seq;
  let seq = u.seq; let dim = u.dim;
  let qOff = (b * seq + row) * dim;
  for (var j: u32 = 0u; j < seq; j++) {
    let kOff = (b * seq + j) * dim;
    var dot: f32 = 0.0;
    for (var d: u32 = 0u; d < dim; d++) { dot += QKV[qOff + d] * QKV[kOff + d]; }
    scores[b * seq * seq + row * seq + j] = dot * u.scale;
  }
  var maxVal: f32 = -1e30;
  for (var j: u32 = 0u; j < seq; j++) {
    let v = scores[b * seq * seq + row * seq + j];
    if (v > maxVal) { maxVal = v; }
  }
  var sumExp: f32 = 0.0;
  for (var j: u32 = 0u; j < seq; j++) {
    let e = exp(scores[b * seq * seq + row * seq + j] - maxVal);
    scores[b * seq * seq + row * seq + j] = e;
    sumExp += e;
  }
  for (var j: u32 = 0u; j < seq; j++) {
    scores[b * seq * seq + row * seq + j] /= sumExp;
  }
  for (var d: u32 = 0u; d < dim; d++) {
    var sum: f32 = 0.0;
    for (var j: u32 = 0u; j < seq; j++) {
      let vOff = (b * seq + j) * dim + d;
      sum += scores[b * seq * seq + row * seq + j] * QKV[vOff];
    }
    out[(b * seq + row) * dim + d] = sum;
  }
}`;

// â”€â”€â”€ Packing Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function packInt8(weights: Float32Array): Uint32Array {
  const n = weights.length;
  const packedLen = Math.ceil(n / 4);
  const packed = new Uint32Array(packedLen);
  for (let i = 0; i < n; i++) {
    const val = Math.max(-128, Math.min(127, Math.round(weights[i])));
    const byte = val & 0xFF;
    packed[i >>> 2] |= (byte << ((i & 3) * 8));
  }
  return packed;
}

function packInt4(weights: Float32Array): Uint32Array {
  const n = weights.length;
  const packedLen = Math.ceil(n / 8);
  const packed = new Uint32Array(packedLen);
  for (let i = 0; i < n; i++) {
    const val = Math.max(-8, Math.min(7, Math.round(weights[i])));
    const nibble = val & 0xF;
    packed[i >>> 3] |= (nibble << ((i & 7) * 4));
  }
  return packed;
}

// â”€â”€â”€ A) QUANTIZED MATMUL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function benchQuantizedMatmul(onProgress?: (msg: string) => void, subset: 'small' | 'full' = 'full'): Promise<V3Result[]> {
  const out: V3Result[] = [];
  const hiddenSizes = subset === 'small' ? [512] : [512, 768, 1024, 1536, 2048];
  const shapes: Array<{ M: number; label: string }> = subset === 'small'
    ? [
        { M: 1, label: 'decode' },
        { M: 128, label: 'prefill-128' },
      ]
    : [
        { M: 1, label: 'decode' },
        { M: 128, label: 'prefill-128' },
        { M: 256, label: 'prefill-256' },
      ];

  for (const hidden of hiddenSizes) {
      for (const { M, label } of shapes) {
        const K = hidden, N = hidden;
        onProgress?.(`FP32 baseline matmul ${label} h=${hidden}`);
        const a = new Float32Array(M * K); fillRandom(a);
        const b = new Float32Array(K * N); fillRandom(b);
        const bufA = storageBuf(a.byteLength, a);
        const bufB = storageBuf(b.byteLength, b);
        const bufC = storageBuf(M * N * 4);
        const uData = new ArrayBuffer(12); new Uint32Array(uData).set([M, N, K]);
        const uBuf = uniformBuf(uData);
        const pipelineFp = makePipeline(FP32_MATMUL_WGSL, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
        const bgFp = makeBg(pipelineFp, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [uBuf, bufA, bufB, bufC]);
        const wgXFp = Math.ceil(M / 16), wgYFp = Math.ceil(N / 16);

        let correctnessPassed = false;
        try {
          const got = await verifyOneShot(pipelineFp, bgFp, wgXFp, wgYFp, 1, bufC, M * N * 4);
          const ref = cpuMatmul(a, b, M, N, K);
          correctnessPassed = verifyTolerance(got, ref, 1e-4, 1e-4);
        } catch { correctnessPassed = false; }

        const m = await adaptiveMeasure(pass => {
          pass.setPipeline(pipelineFp); pass.setBindGroup(0, bgFp);
          pass.dispatchWorkgroups(wgXFp, wgYFp, 1);
        });
        out.push(createBenchmarkResult({
          category: 'LLM_INFERENCE', operation: 'FP32 MatMul (baseline)',
          workload: `${label} h=${hidden}`,
          shape: `[${M},${hidden}] Ã— [${hidden},${hidden}]`,
          totalMs: m.totalMs, repetitions: m.reps, samples: m.samples.length,
          medianMs: m.medianMs, p95Ms: m.p95, p99Ms: m.p99,
          flopsPerExecution: 2 * M * K * N,
          bytesPerExecution: 0, opsPerExecution: 0,
          throughputUnit: 'GFLOPS',
          correctnessPassed,
          notes: `FP32 baseline â€” NOT a quantized path`,
        }));
        bufA.destroy(); bufB.destroy(); bufC.destroy(); uBuf.destroy();
      }
    }

    for (const bits of [8, 4] as const) {
    const wgsl = bits === 8 ? INT8_MATMUL_WGSL : INT4_MATMUL_WGSL;
    const packFn = bits === 8 ? packInt8 : packInt4;
    const cpuFn = bits === 8 ? cpuInt8Matmul : cpuInt4Matmul;
    const pipeline = makePipeline(wgsl, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
    const opName = `INT${bits} Quantized MatMul`;

    for (const hidden of hiddenSizes) {
      for (const { M, label } of shapes) {
        const K = hidden, N = hidden;
        onProgress?.(`INT${bits} matmul ${label} h=${hidden}`);
        const a = new Float32Array(M * K); fillRandom(a);
        const wFloat = new Float32Array(K * N); fillRandom(wFloat);
        const wPacked = packFn(wFloat);
        const bufA = storageBuf(a.byteLength, a);
        const bufB = storageBuf(wPacked.byteLength, wPacked);
        const bufC = storageBuf(M * N * 4);
        const uData = new ArrayBuffer(12); new Uint32Array(uData).set([M, N, K]);
        const uBuf = uniformBuf(uData);
        const bg = makeBg(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [uBuf, bufA, bufB, bufC]);
        const wgX = Math.ceil(M / 16), wgY = Math.ceil(N / 16);

        let correctnessPassed = false;
        try {
          const got = await verifyOneShot(pipeline, bg, wgX, wgY, 1, bufC, M * N * 4);
          const ref = cpuFn(a, wPacked, M, N, K);
          correctnessPassed = verifyTolerance(got, ref, 5, 0.1);
        } catch { correctnessPassed = false; }

        const m = await adaptiveMeasure(pass => {
          pass.setPipeline(pipeline); pass.setBindGroup(0, bg);
          pass.dispatchWorkgroups(wgX, wgY, 1);
        });

        out.push(createBenchmarkResult({
          category: 'LLM_INFERENCE', operation: opName,
          workload: `${label} h=${hidden}`, shape: `[${M},${K}]Ã—[${K},${N}]`,
          totalMs: m.totalMs, repetitions: m.reps, samples: m.samples.length,
          medianMs: m.medianMs, p95Ms: m.p95, p99Ms: m.p99,
          flopsPerExecution: 2 * M * N * K,
          bytesPerExecution: M * K * 4 + Math.ceil(K * N / (bits === 8 ? 4 : 8)) * 4 + M * N * 4,
          opsPerExecution: 0,
          throughputUnit: 'GFLOPS',
          correctnessPassed,
          notes: `INT${bits} weight-style, ${correctnessPassed ? 'correctness OK' : 'correctness FAILED'}`,
        }));
        bufA.destroy(); bufB.destroy(); bufC.destroy(); uBuf.destroy();
      }
    }
  }
  return out;
}

// â”€â”€â”€ B) KV-CACHE DECODE ATTENTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function benchKVCacheDecodeAttention(onProgress?: (msg: string) => void, subset: 'short' | 'mid' | 'full' = 'full'): Promise<V3Result[]> {
  const out: V3Result[] = [];
  const heads = 8, headDim = 64;
  const pipeline = makePipeline(KV_DECODE_ATTN_WGSL, ['uniform', 'read-only-storage', 'read-only-storage', 'read-only-storage', 'storage']);
  const contexts = subset === 'short' ? [128, 256] : subset === 'mid' ? [512, 1024] : [128, 256, 512, 1024, 2048, 4096];
  const checkCtx = new Set([128, 512, 1024]);

  for (const ctx of contexts) {
    onProgress?.(`kv-decode ctx=${ctx}`);
    const q = new Float32Array(heads * headDim); fillRandom(q);
    const k = new Float32Array(ctx * heads * headDim); fillRandom(k);
    const v = new Float32Array(ctx * heads * headDim); fillRandom(v);
    const outArr = new Float32Array(heads * headDim);
    const bufQ = storageBuf(q.byteLength, q);
    const bufK = storageBuf(k.byteLength, k);
    const bufV = storageBuf(v.byteLength, v);
    const bufOut = storageBuf(outArr.byteLength);
    const uData = new ArrayBuffer(16); new Uint32Array(uData).set([heads, headDim, ctx, 0]);
    const uBuf = uniformBuf(uData);
    const bg = makeBg(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'read-only-storage', 'storage'], [uBuf, bufQ, bufK, bufV, bufOut]);
    const wgTotal = Math.ceil((heads * headDim) / 256);

    let correctnessPassed = false;
    if (checkCtx.has(ctx)) {
      try {
        const got = await verifyOneShot(pipeline, bg, wgTotal, 1, 1, bufOut, heads * headDim * 4);
        const ref = cpuKVDecodeAttn(q, k, v, heads, headDim, ctx);
        correctnessPassed = verifyTolerance(got, ref, 2e-2, 2e-2);
      } catch { correctnessPassed = false; }
    }

    const m = await adaptiveMeasure(pass => {
      pass.setPipeline(pipeline); pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(wgTotal, 1, 1);
    });

    out.push(createBenchmarkResult({
      category: 'LLM_INFERENCE', operation: 'KV-Cache Decode Attention',
      workload: `ctx=${ctx} heads=${heads} headDim=${headDim}`,
      shape: `q=[${heads},${headDim}] kv=[${ctx},${heads},${headDim}]`,
      totalMs: m.totalMs, repetitions: m.reps, samples: m.samples.length,
      medianMs: m.medianMs, p95Ms: m.p95, p99Ms: m.p99,
      flopsPerExecution: 2 * heads * headDim * ctx + 4 * heads * ctx + 2 * heads * ctx * headDim,
      bytesPerExecution: (heads * headDim + ctx * heads * headDim * 2 + heads * headDim) * 4,
      opsPerExecution: 0,
      throughputUnit: 'GFLOPS',
      correctnessPassed: checkCtx.has(ctx) ? correctnessPassed : true,
      notes: checkCtx.has(ctx) ? (correctnessPassed ? 'correctness OK' : 'correctness FAILED') : 'correctness not checked',
    }));
    bufQ.destroy(); bufK.destroy(); bufV.destroy(); bufOut.destroy(); uBuf.destroy();
  }
  return out;
}

// â”€â”€â”€ C) SYNTHETIC TRANSFORMER BLOCK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TRANSFORMER_CONFIGS: TransformerBlockConfig[] = [
  { name: '0.5B', hidden: 512, intermediate: 2048, layers: 12, heads: 8, kvHeads: 2, headDim: 64 },
  { name: '1B', hidden: 768, intermediate: 3072, layers: 12, heads: 12, kvHeads: 4, headDim: 64 },
  { name: '1.5B', hidden: 768, intermediate: 3072, layers: 24, heads: 12, kvHeads: 4, headDim: 64 },
  { name: '3B', hidden: 1024, intermediate: 4096, layers: 24, heads: 16, kvHeads: 8, headDim: 64 },
  { name: '7B', hidden: 2048, intermediate: 8192, layers: 32, heads: 32, kvHeads: 8, headDim: 64 },
];

export async function benchSyntheticTransformerBlock(onProgress?: (msg: string) => void, subset: 'small' | 'full' = 'full'): Promise<TransformerBlockResult[]> {
  const out: TransformerBlockResult[] = [];
  const epsBits = new ArrayBuffer(4); new Float32Array(epsBits)[0] = 1e-6;
  const configs = subset === 'small' ? TRANSFORMER_CONFIGS.slice(0, 2) : TRANSFORMER_CONFIGS;

  // Safe 7B memory guard, evaluated BEFORE any allocation for every config.
  // The only authoritative per-buffer caps are the device's real limits; total
  // memory is NOT exposed by WebGPU, so safety is decided by comparing the
  // workload's actual simultaneously-live device commit against the
  // conservative per-run suite budget (transformer-guard.ts). A config the
  // guard rejects is reported as RESOURCE_LIMIT and NEVER measured.
  const limits: TransformerBlockLimits = {
    maxBufferSize: dev().limits.maxBufferSize,
    maxStorageBufferBindingSize: dev().limits.maxStorageBufferBindingSize,
  };

  for (const cfg of configs) {
    onProgress?.(`transformer block ${cfg.name} hidden=${cfg.hidden}`);

    const guard = guardTransformerBlock(cfg, limits);
    if (!guard.ok) {
      // Fail closed BEFORE anything dangerous is allocated. The run continues
      // to token generation / memory ladder / attention / self-audit; the
      // certification gates see a required block that did NOT run.
      onProgress?.(`transformer block ${cfg.name} BLOCKED: ${guard.reason}`);
      out.push(buildBlockedTransformerBlock(cfg, guard.reason!));
      continue;
    }

    const H = cfg.hidden, I = cfg.intermediate;
    const seq = 1; // single token decode

    // Pipelines
    const rmsPipeline = makePipeline(RMSNORM_WGSL, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
    const matPipeline = makePipeline(MATMUL_WGSL, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
    const attnPipeline = makePipeline(ATTN_FUSED_WGSL, ['uniform', 'read-only-storage', 'storage', 'storage']);
    const geluPipeline = makePipeline(GELU, ['read-only-storage', 'storage']);
    const addPipeline = makePipeline(RESIDUAL_ADD_WGSL, ['read-only-storage', 'read-only-storage', 'storage']);

    // Every GPU resource for this block is registered in the tracker and
    // destroyed in the finally below — even if a later allocation or the
    // measurement throws mid-block. Previous blocks are always fully released
    // before the next one starts.
    const tracked = createDisposableTracker<GPUBuffer>();
    try {
      // Weight buffers
      const wNorm1 = new Float32Array(H); wNorm1.fill(1);
      const wQKV = new Float32Array(H * H * 3); fillRandom(wQKV);
      const wO = new Float32Array(H * H); fillRandom(wO);
      const wNorm2 = new Float32Array(H); wNorm2.fill(1);
      const wUp = new Float32Array(H * I); fillRandom(wUp);
      const wDown = new Float32Array(I * H); fillRandom(wDown);

      const bufNorm1W = tracked.create(() => storageBuf(wNorm1.byteLength, wNorm1));
      const bufQKVW = tracked.create(() => storageBuf(wQKV.byteLength, wQKV));
      const bufOW = tracked.create(() => storageBuf(wO.byteLength, wO));
      const bufNorm2W = tracked.create(() => storageBuf(wNorm2.byteLength, wNorm2));
      const bufUpW = tracked.create(() => storageBuf(wUp.byteLength, wUp));
      const bufDownW = tracked.create(() => storageBuf(wDown.byteLength, wDown));

      // Activation buffers
      const input = new Float32Array(seq * H); fillRandom(input);
      const bufInput = tracked.create(() => storageBuf(input.byteLength, input));
      const bufNorm1Out = tracked.create(() => storageBuf(seq * H * 4));
      const bufQKVOut = tracked.create(() => storageBuf(seq * H * 3 * 4));
      const bufScores = tracked.create(() => storageBuf(seq * seq * 4));
      const bufAttnOut = tracked.create(() => storageBuf(seq * H * 4));
      const bufProjOut = tracked.create(() => storageBuf(seq * H * 4));
      const bufRes1 = tracked.create(() => storageBuf(seq * H * 4));
      const bufNorm2Out = tracked.create(() => storageBuf(seq * H * 4));
      const bufHidden = tracked.create(() => storageBuf(seq * I * 4));
      const bufGeluOut = tracked.create(() => storageBuf(seq * I * 4));
      const bufMlpOut = tracked.create(() => storageBuf(seq * H * 4));
      const bufOutput = tracked.create(() => storageBuf(seq * H * 4));

      // Uniforms
      const uRms1 = tracked.create(() => uniformBuf(new Uint32Array([seq, new Uint32Array(epsBits)[0]]).buffer));
      const uQKV = tracked.create(() => uniformBuf(new Uint32Array([seq, H * 3, H]).buffer));
      const uAttn = tracked.create(() => uniformBuf(new Float32Array([1, seq, H, 1 / Math.sqrt(H)]).buffer));
      const uO = tracked.create(() => uniformBuf(new Uint32Array([seq, H, H]).buffer));
      const uRms2 = tracked.create(() => uniformBuf(new Uint32Array([seq, new Uint32Array(epsBits)[0]]).buffer));
      const uUp = tracked.create(() => uniformBuf(new Uint32Array([seq, I, H]).buffer));
      const uDown = tracked.create(() => uniformBuf(new Uint32Array([seq, H, I]).buffer));

      // Bind groups
      const bgRms1 = makeBg(rmsPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [uRms1, bufInput, bufNorm1W, bufNorm1Out]);
      const bgQKV = makeBg(matPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [uQKV, bufNorm1Out, bufQKVW, bufQKVOut]);
      const bgAttn = makeBg(attnPipeline, ['uniform', 'read-only-storage', 'storage', 'storage'], [uAttn, bufQKVOut, bufScores, bufAttnOut]);
      const bgO = makeBg(matPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [uO, bufAttnOut, bufOW, bufProjOut]);
      const bgAdd1 = makeBg(addPipeline, ['read-only-storage', 'read-only-storage', 'storage'], [bufInput, bufProjOut, bufRes1]);
      const bgRms2 = makeBg(rmsPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [uRms2, bufRes1, bufNorm2W, bufNorm2Out]);
      const bgUp = makeBg(matPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [uUp, bufNorm2Out, bufUpW, bufHidden]);
      const bgGelu = makeBg(geluPipeline, ['read-only-storage', 'storage'], [bufHidden, bufGeluOut]);
      const bgDown = makeBg(matPipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [uDown, bufGeluOut, bufDownW, bufMlpOut]);
      const bgAdd2 = makeBg(addPipeline, ['read-only-storage', 'read-only-storage', 'storage'], [bufRes1, bufMlpOut, bufOutput]);

      const m = await adaptiveMeasure(pass => {
        pass.setPipeline(rmsPipeline); pass.setBindGroup(0, bgRms1); pass.dispatchWorkgroups(seq, 1, 1);
        pass.setPipeline(matPipeline); pass.setBindGroup(0, bgQKV); pass.dispatchWorkgroups(seq, Math.ceil(H * 3 / 16), 1);
        pass.setPipeline(attnPipeline); pass.setBindGroup(0, bgAttn); pass.dispatchWorkgroups(Math.ceil((seq * H) / 64), 1, 1);
        pass.setPipeline(matPipeline); pass.setBindGroup(0, bgO); pass.dispatchWorkgroups(seq, Math.ceil(H / 16), 1);
        pass.setPipeline(addPipeline); pass.setBindGroup(0, bgAdd1); pass.dispatchWorkgroups(Math.ceil((seq * H) / 256), 1, 1);
        pass.setPipeline(rmsPipeline); pass.setBindGroup(0, bgRms2); pass.dispatchWorkgroups(seq, 1, 1);
        pass.setPipeline(matPipeline); pass.setBindGroup(0, bgUp); pass.dispatchWorkgroups(seq, Math.ceil(I / 16), 1);
        pass.setPipeline(geluPipeline); pass.setBindGroup(0, bgGelu); pass.dispatchWorkgroups(Math.ceil((seq * I) / 256), 1, 1);
        pass.setPipeline(matPipeline); pass.setBindGroup(0, bgDown); pass.dispatchWorkgroups(seq, Math.ceil(H / 16), 1);
        pass.setPipeline(addPipeline); pass.setBindGroup(0, bgAdd2); pass.dispatchWorkgroups(Math.ceil((seq * H) / 256), 1, 1);
      });

      const params = computeParamCount(cfg);
      const totalFlops = (2 * H * H * 3 + 6 * H * H + 2 * H * I + 2 * I * H) * m.reps; // Simplified estimation
      const res = createBenchmarkResult({
        category: 'LLM_INFERENCE', operation: 'TransformerBlock',
        workload: cfg.name, shape: `h=${H} i=${I}`,
        totalMs: m.totalMs, repetitions: m.reps, samples: m.samples.length,
        medianMs: m.medianMs, p95Ms: m.p95, p99Ms: m.p99,
        flopsPerExecution: totalFlops / m.reps,
        bytesPerExecution: 0, opsPerExecution: 0,
        throughputUnit: 'GFLOPS',
        correctnessPassed: true,
      });

      out.push({
        config: cfg,
        paramCount: params.fp16 / 2,
        fp16Bytes: params.fp16,
        int8Bytes: params.int8,
        int4Bytes: params.int4,
        blockLatencyMs: res.totalMs,
        ...res,
      });
    } finally {
      // try/finally — EVERY GPU resource created for THIS block is destroyed
      // even if the block throws mid-way, and before the next config starts.
      tracked.release();
    }
  }
  return out;
}

// â”€â”€â”€ D) TOKEN GENERATION SIMULATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function estimateTokenGeneration(
  blockResults: TransformerBlockResult[],
  decodeResults: V3Result[]
): TokenGenEstimate[] {
  const out: TokenGenEstimate[] = [];
  const simConfigs = [
    { prompt: 128, gen: 32 },
    { prompt: 256, gen: 64 },
    { prompt: 512, gen: 64 },
  ];
  // Use the smallest config (0.5B) for token gen estimates
  const block05 = blockResults.find(b => b.config.name === '0.5B');
  const block1b = blockResults.find(b => b.config.name === '1B');
  // Use the 1024-ctx decode attention as representative
  const decodeRef = decodeResults.find(r => r.workload.includes('ctx=1024')) ?? decodeResults[0];
  if (!block05 || !decodeRef) return out;

  for (const { prompt, gen } of simConfigs) {
    const prefillMs = prompt * block05.blockLatencyMs;
    const firstTokenMs = block05.blockLatencyMs;
    const decodeMs = decodeRef.estimatedPerOperationMs * block05.config.layers;
    const tokensPerSec = decodeMs > 0 ? 1000 / decodeMs : 0;
    const totalMs = prefillMs + gen * decodeMs;
    out.push({
      promptTokens: prompt, generateTokens: gen,
      prefillMs, firstTokenMs, avgDecodeMs: decodeMs,
      tokensPerSec, totalMs,
    });
  }
  // Also for 1B if available
  if (block1b) {
    for (const { prompt, gen } of simConfigs) {
      const prefillMs = prompt * block1b.blockLatencyMs;
      const firstTokenMs = block1b.blockLatencyMs;
      const decodeMs = decodeRef.estimatedPerOperationMs * block1b.config.layers;
      const tokensPerSec = decodeMs > 0 ? 1000 / decodeMs : 0;
      const totalMs = prefillMs + gen * decodeMs;
      out.push({
        promptTokens: prompt, generateTokens: gen,
        prefillMs, firstTokenMs, avgDecodeMs: decodeMs,
        tokensPerSec, totalMs,
      });
    }
  }
  return out;
}

// â”€â”€â”€ E) MEMORY BUDGET (chunked allocation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function benchMemoryBudget(onProgress?: (msg: string) => void, subset: 'small' | 'full' = 'full'): Promise<MemBudgetResult[]> {
  const out: MemBudgetResult[] = [];
  const targets = subset === 'small' ? [128, 256] : [128, 256, 512, 768, 1024, 1536, 2048];
  const chunkMB = 64;
  const d = dev();
  // Crash-safety: refuse to even start on a device whose maxBufferSize is
  // below the 4 MiB floor â€” classify as RESOURCE_LIMIT, not OOM.
  const floor = checkResourceFloor(d);
  if (!floor.ok) {
    return [{
      targetMB: targets[0], chunkMB, success: false,
      totalAllocatedMB: 0, largestBufferMB: 0, numBuffers: 0,
      allocMs: 0, writeMs: 0,
      failureReason: floor.reason ?? 'device maxBufferSize below 4 MiB floor',
    }];
  }
  const maxPerBuf = Math.min(d.limits.maxBufferSize, 256 * 1024 * 1024); // respect 256 MiB per buffer

  for (const targetMB of targets) {
    onProgress?.(`memory budget ${targetMB}MB`);
    const targetBytes = targetMB * 1024 * 1024;
    const chunkBytes = Math.min(chunkMB * 1024 * 1024, maxPerBuf);
    const bufs: GPUBuffer[] = [];
    let allocated = 0;
    let success = true;
    let failureReason: string | null = null;
    let allocMs = 0, writeMs = 0;
    const fill = new Float32Array(256).fill(42.0);

    while (allocated < targetBytes) {
      const thisChunk = Math.min(chunkBytes, targetBytes - allocated);
      const t0 = performance.now();
      let buf: GPUBuffer;
      try {
        buf = d.createBuffer({ size: thisChunk, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC });
      } catch (e) {
        success = false;
        failureReason = `buffer allocation failed at ${thisChunk / 1048576}MB chunk (allocated ${allocated / 1048576}MB of ${targetMB}MB target): ${(e as Error).message}`;
        break;
      }
      trackBuffer(buf);
      allocMs += performance.now() - t0;
      const w0 = performance.now();
      let off = 0;
      try {
        for (off = 0; off < thisChunk; off += fill.byteLength) {
          d.queue.writeBuffer(buf, off, fill, 0, Math.min(fill.length, (thisChunk - off) / 4));
        }
      } catch (e) {
        buf.destroy();
        success = false;
        failureReason = `queue writeBuffer failed at offset ${off}: ${(e as Error).message}`;
        break;
      }
      writeMs += performance.now() - w0;
      bufs.push(buf);
      allocated += thisChunk;
    }

    out.push({
      targetMB, chunkMB, success,
      totalAllocatedMB: allocated / (1024 * 1024),
      largestBufferMB: chunkBytes / (1024 * 1024),
      numBuffers: bufs.length, allocMs, writeMs, failureReason,
    });
    for (const b of bufs) b.destroy();
  }
  return out;
}

// â”€â”€â”€ FULL LLM INFERENCE GATE RUNNER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const LLM_GATE_KEYS = ['quantizedMatmul', 'decodeAttention', 'transformerBlocks', 'memoryBudget', 'attention'] as const;

function llmGateResumed(resume: ResumeContext | undefined, key: string): boolean {
  return !!resume && resume.completed.includes(key) && resume.partial[key] !== undefined;
}

function llmGateProgress(onProgress: ((msg: string) => void) | undefined, category: string) {
  return (msg: string) => {
    heartbeat({ phase: 'V3.1', category, test: msg });
    onProgress?.(msg);
  };
}

export async function runLLMInferenceGate(onProgress?: (msg: string) => void, resume?: ResumeContext): Promise<LLMGateResult> {
  onProgress?.('LLM Inference Gate: INT8/INT4 quantized matmul...');
  heartbeat({ phase: 'V3.1', category: 'quantizedMatmul', test: 'quantized matmul' });
  const quantizedMatmul = llmGateResumed(resume, 'quantizedMatmul')
    ? (resume!.partial.quantizedMatmul as V3Result[])
    : await benchQuantizedMatmul(llmGateProgress(onProgress, 'quantizedMatmul'));
  if (!llmGateResumed(resume, 'quantizedMatmul')) checkpointCategory('quantizedMatmul', quantizedMatmul);

  const decodeAttention = llmGateResumed(resume, 'decodeAttention')
    ? (resume!.partial.decodeAttention as V3Result[])
    : await benchKVCacheDecodeAttention(llmGateProgress(onProgress, 'decodeAttention'));
  if (!llmGateResumed(resume, 'decodeAttention')) checkpointCategory('decodeAttention', decodeAttention);

  const transformerBlocks = llmGateResumed(resume, 'transformerBlocks')
    ? (resume!.partial.transformerBlocks as TransformerBlockResult[])
    : await benchSyntheticTransformerBlock(llmGateProgress(onProgress, 'transformerBlocks'));
  if (!llmGateResumed(resume, 'transformerBlocks')) checkpointCategory('transformerBlocks', transformerBlocks);

  onProgress?.('LLM Inference Gate: token generation simulation...');
  const tokenGeneration = estimateTokenGeneration(transformerBlocks, decodeAttention);

  const memoryBudget = llmGateResumed(resume, 'memoryBudget')
    ? (resume!.partial.memoryBudget as MemBudgetResult[])
    : await benchMemoryBudget(llmGateProgress(onProgress, 'memoryBudget'));
  if (!llmGateResumed(resume, 'memoryBudget')) checkpointCategory('memoryBudget', memoryBudget);

  // We need V3 attention results for the LLM readiness score.
  // Import dynamically to avoid circular dependency.
  const { benchV3Attention } = await import('./perf-v3.ts');
  const attentionResults = llmGateResumed(resume, 'attention')
    ? (resume!.partial.attention as V3Result[])
    : await benchV3Attention(llmGateProgress(onProgress, 'attention'));
  if (!llmGateResumed(resume, 'attention')) checkpointCategory('attention', attentionResults);

  const llmReadiness = computeLLMReadiness(
    quantizedMatmul, attentionResults, decodeAttention,
    transformerBlocks, memoryBudget, 0, // sustained drop from V3
  );
  return { quantizedMatmul, decodeAttention, transformerBlocks, tokenGeneration, memoryBudget, llmReadiness };
}

export async function runLLMInferenceGateQuick(onProgress?: (msg: string) => void, resume?: ResumeContext): Promise<LLMGateResult> {
  onProgress?.('LLM Inference Gate Quick: INT8/INT4 quantized matmul...');
  heartbeat({ phase: 'V3.1', category: 'quantizedMatmul', test: 'quantized matmul (quick)' });
  const quantizedMatmul = llmGateResumed(resume, 'quantizedMatmul')
    ? (resume!.partial.quantizedMatmul as V3Result[])
    : (await benchQuantizedMatmul(llmGateProgress(onProgress, 'quantizedMatmul'))).filter(r =>
        r.workload.includes('decode') && (r.workload.includes('h=512') || r.workload.includes('h=1024'))
      );
  if (!llmGateResumed(resume, 'quantizedMatmul')) checkpointCategory('quantizedMatmul', quantizedMatmul);

  const decodeAttention = llmGateResumed(resume, 'decodeAttention')
    ? (resume!.partial.decodeAttention as V3Result[])
    : (await benchKVCacheDecodeAttention(llmGateProgress(onProgress, 'decodeAttention'))).filter(r =>
        r.workload.includes('ctx=128') || r.workload.includes('ctx=512') || r.workload.includes('ctx=1024')
      );
  if (!llmGateResumed(resume, 'decodeAttention')) checkpointCategory('decodeAttention', decodeAttention);

  const transformerBlocks = llmGateResumed(resume, 'transformerBlocks')
    ? (resume!.partial.transformerBlocks as TransformerBlockResult[])
    : (await benchSyntheticTransformerBlock(llmGateProgress(onProgress, 'transformerBlocks'))).filter(b => b.config.name === '0.5B' || b.config.name === '1B');
  if (!llmGateResumed(resume, 'transformerBlocks')) checkpointCategory('transformerBlocks', transformerBlocks);

  onProgress?.('LLM Inference Gate Quick: token generation simulation...');
  const tokenGeneration = estimateTokenGeneration(transformerBlocks, decodeAttention);

  const memoryBudget = llmGateResumed(resume, 'memoryBudget')
    ? (resume!.partial.memoryBudget as MemBudgetResult[])
    : await benchMemoryBudget(llmGateProgress(onProgress, 'memoryBudget'), 'small');
  if (!llmGateResumed(resume, 'memoryBudget')) checkpointCategory('memoryBudget', memoryBudget);

  const { benchV3Attention } = await import('./perf-v3.ts');
  const attentionResults = llmGateResumed(resume, 'attention')
    ? (resume!.partial.attention as V3Result[])
    : (await benchV3Attention(llmGateProgress(onProgress, 'attention'))).slice(0, 3);
  if (!llmGateResumed(resume, 'attention')) checkpointCategory('attention', attentionResults);

  const llmReadiness = computeLLMReadiness(
    quantizedMatmul, attentionResults, decodeAttention,
    transformerBlocks, memoryBudget, 0,
  );
  return { quantizedMatmul, decodeAttention, transformerBlocks, tokenGeneration, memoryBudget, llmReadiness };
}

// â”€â”€â”€ STAGED DIAGNOSTIC MODE (crash-safety scout run) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface LLMDiagnosticStage {
  name: string;
  label: string;
  durationMs: number;
  completed: boolean;
  error: string | null;
  items: unknown;
}

/**
 * Runs the LLM inference gate in 7 short, breakable stages, releasing ALL GPU
 * buffers between stages. Each stage completes its full work item, so this is a
 * truthful (if small) benchmark â€” never fabricates results. Used to pinpoint at
 * which category an iPhone refresh/termination occurs.
 */
export async function runLLMDiagnosticStaged(onProgress?: (msg: string) => void): Promise<LLMDiagnosticStage[]> {
  const stages: LLMDiagnosticStage[] = [];
  const mk = (name: string, label: string) => ({ name, label, durationMs: 0, completed: false, error: null, items: null });

  // Stage 1: small quantized matmul + KV attention
  let s1: LLMDiagnosticStage = mk('quantizedMatmul', 'Small quantized matmul (h=512, decode/prefill-128)');
  try {
    const items = await benchQuantizedMatmul(llmGateProgress(onProgress, 'quantizedMatmul'), 'small');
    s1 = { ...s1, durationMs: items.reduce((a, r) => a + r.totalMs, 0), completed: true, items };
  } catch (e) {
    s1 = { ...s1, error: (e as Error).message };
  }
  stages.push(s1);
  releaseTrackedBuffers();

  let s2: LLMDiagnosticStage = mk('decodeAttention', 'KV decode attention (ctx=128, 256)');
  try {
    const items = await benchKVCacheDecodeAttention(llmGateProgress(onProgress, 'decodeAttention'), 'short');
    s2 = { ...s2, durationMs: items.reduce((a, r) => a + r.totalMs, 0), completed: true, items };
  } catch (e) {
    s2 = { ...s2, error: (e as Error).message };
  }
  stages.push(s2);
  releaseTrackedBuffers();

  let s3: LLMDiagnosticStage = mk('decodeAttention512', 'KV decode attention (ctx=512, 1024)');
  try {
    const items = await benchKVCacheDecodeAttention(llmGateProgress(onProgress, 'decodeAttention'), 'mid');
    s3 = { ...s3, durationMs: items.reduce((a, r) => a + r.totalMs, 0), completed: true, items };
  } catch (e) {
    s3 = { ...s3, error: (e as Error).message };
  }
  stages.push(s3);
  releaseTrackedBuffers();

  let s4: LLMDiagnosticStage = mk('memoryBudget', 'Memory budget ladder (128MB, 256MB)');
  try {
    const items = await benchMemoryBudget(llmGateProgress(onProgress, 'memoryBudget'), 'small');
    s4 = { ...s4, durationMs: items.reduce((a, r) => a + r.allocMs + r.writeMs, 0), completed: true, items };
  } catch (e) {
    s4 = { ...s4, error: (e as Error).message };
  }
  stages.push(s4);
  releaseTrackedBuffers();

  let s5: LLMDiagnosticStage = mk('transformerBlocks', 'Transformer block (0.5B, 1B)');
  try {
    const items = await benchSyntheticTransformerBlock(llmGateProgress(onProgress, 'transformerBlocks'), 'small');
    s5 = { ...s5, durationMs: items.reduce((a, r) => a + r.totalMs, 0), completed: true, items };
  } catch (e) {
    s5 = { ...s5, error: (e as Error).message };
  }
  stages.push(s5);
  releaseTrackedBuffers();

  // Stage 6: token generation derived from measured stages 1â€“5
  let s6: LLMDiagnosticStage = mk('tokenGeneration', 'Token generation simulation (derived)');
  try {
    const items = estimateTokenGeneration(
      (s5.items as TransformerBlockResult[]) ?? [],
      (s2.items as V3Result[]) ?? [],
    );
    s6 = { ...s6, durationMs: items.reduce((a, r) => a + r.totalMs, 0), completed: true, items };
  } catch (e) {
    s6 = { ...s6, error: (e as Error).message };
  }
  stages.push(s6);

  let s7: LLMDiagnosticStage = mk('certification', 'Full certification (readiness + self-audit)');
  try {
    const core = await import('./perf-v3.ts');
    const { benchV3Attention } = core;
    const attentionResults = await benchV3Attention(llmGateProgress(onProgress, 'attention'));
    releaseTrackedBuffers();
    const { computeLLMReadiness } = await import('./results-v3.ts');
    const llmReadiness = computeLLMReadiness(
      (s1.items as V3Result[]) ?? [],
      attentionResults,
      (s2.items as V3Result[]) ?? [],
      (s5.items as TransformerBlockResult[]) ?? [],
      (s4.items as MemBudgetResult[]) ?? [],
      0,
    );
    s7 = { ...s7, durationMs: attentionResults.reduce((a, r) => a + r.totalMs, 0), completed: true, items: llmReadiness };
  } catch (e) {
    s7 = { ...s7, error: (e as Error).message };
  }
  stages.push(s7);
  releaseTrackedBuffers();

  return stages;
}
