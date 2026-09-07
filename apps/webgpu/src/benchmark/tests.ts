// AETHER GPU Benchmark — Correctness Tests
// Automated verification of every kernel against CPU reference

import {
  createUniformBuffer, createStorageBuffer,
  createPipeline, createBindGroupForPipeline,
} from './engine';
import {
  VEC_ADD, MATMUL, CONV2D, SOFTMAX, RMS_NORM, ATTENTION,
} from './kernels';
import {
  VEC_ADD_BINDINGS, MATMUL_BINDINGS, CONV2D_BINDINGS,
  SOFTMAX_BINDINGS, RMS_NORM_BINDINGS, ATTENTION_BINDINGS,
} from './bindings';

interface TestResult {
  name: string;
  pass: boolean;
  maxError: number;
  details: string;
}

// ─── CPU References ───

function cpuVecAdd(A: Float32Array, B: Float32Array): Float32Array {
  const C = new Float32Array(A.length);
  for (let i = 0; i < A.length; i++) C[i] = A[i] + B[i];
  return C;
}

function cpuMatmul(A: Float32Array, B: Float32Array, M: number, N: number, K: number): Float32Array {
  const C = new Float32Array(M * N);
  for (let r = 0; r < M; r++) {
    for (let c = 0; c < N; c++) {
      let sum = 0;
      for (let k = 0; k < K; k++) sum += A[r * K + k] * B[k * N + c];
      C[r * N + c] = sum;
    }
  }
  return C;
}

function cpuConv2D(
  input: Float32Array, kernel: Float32Array,
  N: number, C: number, H: number, W: number,
  F: number, FH: number, FW: number
): Float32Array {
  const OH = H - FH + 1;
  const OW = W - FW + 1;
  const output = new Float32Array(N * F * OH * OW);
  for (let n = 0; n < N; n++) {
    for (let f = 0; f < F; f++) {
      for (let oh = 0; oh < OH; oh++) {
        for (let ow = 0; ow < OW; ow++) {
          let sum = 0;
          for (let c = 0; c < C; c++) {
            for (let fh = 0; fh < FH; fh++) {
              for (let fw = 0; fw < FW; fw++) {
                sum += input[((n * C + c) * H + oh + fh) * W + ow + fw]
                     * kernel[((f * C + c) * FH + fh) * FW + fw];
              }
            }
          }
          output[((n * F + f) * OH + oh) * OW + ow] = sum;
        }
      }
    }
  }
  return output;
}

function cpuSoftmax(data: Float32Array, rows: number, cols: number): Float32Array {
  const out = new Float32Array(data.length);
  for (let r = 0; r < rows; r++) {
    const base = r * cols;
    let max = -1e30;
    for (let c = 0; c < cols; c++) if (data[base + c] > max) max = data[base + c];
    let sumExp = 0;
    for (let c = 0; c < cols; c++) {
      const e = Math.exp(data[base + c] - max);
      out[base + c] = e;
      sumExp += e;
    }
    for (let c = 0; c < cols; c++) out[base + c] /= sumExp;
  }
  return out;
}

function cpuAttention(
  Q: Float32Array, K: Float32Array, V: Float32Array,
  batch: number, seq: number, dim: number, scale: number
): Float32Array {
  const out = new Float32Array(batch * seq * dim);
  for (let b = 0; b < batch; b++) {
    for (let i = 0; i < seq; i++) {
      const scores: number[] = [];
      let max = -1e30;
      for (let j = 0; j < seq; j++) {
        let dot = 0;
        for (let d = 0; d < dim; d++) {
          dot += Q[(b * seq + i) * dim + d] * K[(b * seq + j) * dim + d];
        }
        const s = dot * scale;
        scores.push(s);
        if (s > max) max = s;
      }
      let sumExp = 0;
      const exps = scores.map(s => {
        const e = Math.exp(s - max);
        sumExp += e;
        return e;
      });
      for (let j = 0; j < seq; j++) {
        const p = exps[j] / sumExp;
        for (let d = 0; d < dim; d++) {
          out[(b * seq + i) * dim + d] += p * V[(b * seq + j) * dim + d];
        }
      }
    }
  }
  return out;
}

function cpuRMSNorm(input: Float32Array, weight: Float32Array, eps: number): Float32Array {
  const N = input.length;
  let sumSq = 0;
  for (let i = 0; i < N; i++) sumSq += input[i] * input[i];
  const rms = Math.sqrt(sumSq / N + eps);
  const out = new Float32Array(N);
  for (let i = 0; i < N; i++) out[i] = (input[i] / rms) * weight[i];
  return out;
}

// ─── GPU Helpers ───

function makeBuf(data: Float32Array): GPUBuffer {
  return createStorageBuffer(data.byteLength, data);
}

// ─── Tests ───

import { runGpuTest } from './gpu-test';

export async function testVecAdd(): Promise<TestResult> {
  try {
    const N = 64;
    const A = new Float32Array(N).fill(1.0);
    const B = new Float32Array(N).fill(2.0);

    const bufA = makeBuf(A);
    const bufB = makeBuf(B);
    const bufC = createStorageBuffer(N * 4);

    const uData = new ArrayBuffer(4);
    new Uint32Array(uData)[0] = N;
    const uBuf = createUniformBuffer(uData);

    const pipeline = createPipeline(VEC_ADD, VEC_ADD_BINDINGS);
    const bg = createBindGroupForPipeline(pipeline, VEC_ADD_BINDINGS, [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufA } },
        { binding: 2, resource: { buffer: bufB } },
        { binding: 3, resource: { buffer: bufC } },
      ]);

    const res = await runGpuTest({
      name: 'VecAdd',
      pipeline,
      bindGroup: bg,
      workgroups: [1, 1, 1],
      outputBuffer: bufC,
      outputBytes: N * 4,
      validator: (data) => {
        const pass = data.every((v, i) => Math.abs(v - 3.0) < 1e-5);
        return { pass, error: pass ? '' : 'Incorrect values' };
      }
    });

    bufA.destroy(); bufB.destroy(); bufC.destroy(); uBuf.destroy();
    return { name: 'VecAdd', pass: res.pass, maxError: 0, details: res.error || 'N=64' };
  } catch (e) {
    return { name: 'VecAdd', pass: false, maxError: Infinity, details: (e as Error).message };
  }
}

export async function testMatmul(): Promise<TestResult> {
  try {
    const N = 64;
    const A = new Float32Array(N * N).fill(1.0);
    const B = new Float32Array(N * N).fill(0.5);

    const bufA = makeBuf(A);
    const bufB = makeBuf(B);
    const bufC = createStorageBuffer(N * N * 4);

    const uData = new ArrayBuffer(12);
    const uv = new Uint32Array(uData);
    uv[0] = N; uv[1] = N; uv[2] = N;
    const uBuf = createUniformBuffer(uData);

    const pipeline = createPipeline(MATMUL, MATMUL_BINDINGS);
    const bg = createBindGroupForPipeline(pipeline, MATMUL_BINDINGS, [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufA } },
        { binding: 2, resource: { buffer: bufB } },
        { binding: 3, resource: { buffer: bufC } },
      ]);

    const res = await runGpuTest({
      name: 'Matmul',
      pipeline,
      bindGroup: bg,
      workgroups: [Math.ceil(N / 16), Math.ceil(N / 16), 1],
      outputBuffer: bufC,
      outputBytes: N * N * 4,
      validator: (data) => {
        const cpu = cpuMatmul(A, B, N, N, N);
        let maxErr = 0;
        for (let i = 0; i < N * N; i++) maxErr = Math.max(maxErr, Math.abs(data[i] - cpu[i]));
        const pass = maxErr < 1e-3;
        return { pass, error: pass ? '' : `Max error: ${maxErr}` };
      }
    });

    bufA.destroy(); bufB.destroy(); bufC.destroy(); uBuf.destroy();
    return { name: 'Matmul', pass: res.pass, maxError: 0, details: res.error || `${N}×${N}` };
  } catch (e) {
    return { name: 'Matmul', pass: false, maxError: Infinity, details: (e as Error).message };
  }
}

export async function testConv2D(): Promise<TestResult> {
  try {
    const N = 1, C = 1, H = 5, W = 5, F = 1, FH = 3, FW = 3;
    const OH = H - FH + 1, OW = W - FW + 1;
    const input = new Float32Array([
      1,2,3,4,5,
      6,7,8,9,10,
      11,12,13,14,15,
      16,17,18,19,20,
      21,22,23,24,25
    ]);
    const kernel = new Float32Array([
      1,0,-1,
      1,0,-1,
      1,0,-1
    ]);

    const bufIn = makeBuf(input);
    const bufK = makeBuf(kernel);
    const bufOut = createStorageBuffer(N * F * OH * OW * 4);

    const uData = new ArrayBuffer(36);
    const uv = new Uint32Array(uData);
    uv[0] = N; uv[1] = C; uv[2] = H; uv[3] = W;
    uv[4] = F; uv[5] = FH; uv[6] = FW; uv[7] = OH; uv[8] = OW;
    const uBuf = createUniformBuffer(uData);

    const pipeline = createPipeline(CONV2D, CONV2D_BINDINGS);
    const bg = createBindGroupForPipeline(pipeline, CONV2D_BINDINGS, [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufIn } },
        { binding: 2, resource: { buffer: bufK } },
        { binding: 3, resource: { buffer: bufOut } },
      ]);

    const res = await runGpuTest({
      name: 'Conv2D',
      pipeline,
      bindGroup: bg,
      workgroups: [N, F, OH * OW], // 1 invocation per pixel
      outputBuffer: bufOut,
      outputBytes: N * F * OH * OW * 4,
      validator: (data) => {
        const cpu = cpuConv2D(input, kernel, N, C, H, W, F, FH, FW);
        let maxErr = 0;
        for (let i = 0; i < data.length; i++) maxErr = Math.max(maxErr, Math.abs(data[i] - cpu[i]));
        const pass = maxErr < 1e-4;
        return { pass, error: pass ? '' : `Max error: ${maxErr}` };
      }
    });

    bufIn.destroy(); bufK.destroy(); bufOut.destroy(); uBuf.destroy();
    return { name: 'Conv2D', pass: res.pass, maxError: 0, details: res.error || `${N}×${C}×${H}×${W}` };
  } catch (e) {
    return { name: 'Conv2D', pass: false, maxError: Infinity, details: (e as Error).message };
  }
}

export async function testSoftmax(): Promise<TestResult> {
  try {
    const rows = 2, cols = 5;
    const data = new Float32Array([-2,-1,0,1,2, 2,1,0,-1,-2]);

    const bufIn = createStorageBuffer(data.byteLength, data);
    const bufOut = createStorageBuffer(data.byteLength);

    const uData = new ArrayBuffer(8);
    new Uint32Array(uData)[0] = rows;
    new Uint32Array(uData)[1] = cols;
    const uBuf = createUniformBuffer(uData);

    const pipeline = createPipeline(SOFTMAX, SOFTMAX_BINDINGS);
    const bg = createBindGroupForPipeline(pipeline, SOFTMAX_BINDINGS, [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufIn } },
        { binding: 2, resource: { buffer: bufOut } },
      ]);

    const res = await runGpuTest({
      name: 'Softmax',
      pipeline,
      bindGroup: bg,
      workgroups: [rows, 1, 1],
      outputBuffer: bufOut,
      outputBytes: data.byteLength,
      validator: (gpuData) => {
        const cpu = cpuSoftmax(data, rows, cols);
        let maxErr = 0;
        for (let i = 0; i < data.length; i++) maxErr = Math.max(maxErr, Math.abs(gpuData[i] - cpu[i]));
        const pass = maxErr < 1e-4;
        return { pass, error: pass ? '' : `Max error: ${maxErr}` };
      }
    });
    
    bufIn.destroy(); bufOut.destroy(); uBuf.destroy();
    return { name: 'Softmax', pass: res.pass, maxError: 0, details: res.error || 'Rows=2' };
  } catch (e) {
    return { name: 'Softmax', pass: false, maxError: Infinity, details: (e as Error).message };
  }
}

export async function testRMSNorm(): Promise<TestResult> {
  try {
    const N = 8;
    const eps = 1e-6;
    const input = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const weight = new Float32Array(N).fill(1.0);

    const bufIn = makeBuf(input);
    const bufW = makeBuf(weight);
    const bufOut = createStorageBuffer(N * 4);

    const uData = new ArrayBuffer(8);
    new Uint32Array(uData)[0] = N;
    new Float32Array(uData)[1] = eps;
    const uBuf = createUniformBuffer(uData);

    const pipeline = createPipeline(RMS_NORM, RMS_NORM_BINDINGS);
    const bg = createBindGroupForPipeline(pipeline, RMS_NORM_BINDINGS, [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufIn } },
        { binding: 2, resource: { buffer: bufW } },
        { binding: 3, resource: { buffer: bufOut } },
      ]);

    const res = await runGpuTest({
      name: 'RMSNorm',
      pipeline,
      bindGroup: bg,
      workgroups: [1, 1, 1],
      outputBuffer: bufOut,
      outputBytes: N * 4,
      validator: (data) => {
        const cpu = cpuRMSNorm(input, weight, eps);
        let maxErr = 0;
        for (let i = 0; i < N; i++) maxErr = Math.max(maxErr, Math.abs(data[i] - cpu[i]));
        const pass = maxErr < 1e-3;
        return { pass, error: pass ? '' : `Max error: ${maxErr}` };
      }
    });

    bufIn.destroy(); bufW.destroy(); bufOut.destroy(); uBuf.destroy();
    return { name: 'RMSNorm', pass: res.pass, maxError: 0, details: res.error || `N=${N}` };
  } catch (e) {
    return { name: 'RMSNorm', pass: false, maxError: Infinity, details: (e as Error).message };
  }
}

export async function testAttention(): Promise<TestResult> {
  try {
    const batch = 1, seq = 4, dim = 4;
    const scale = 1 / Math.sqrt(dim);
    const qkv = batch * seq * dim;
    const scores = batch * seq * seq;

    const makeVals = () => {
      const a = new Float32Array(qkv);
      for (let i = 0; i < qkv; i++) a[i] = (i % dim + 1) * 0.1;
      return a;
    };
    const Q = makeVals();
    const K = makeVals();
    const V = makeVals();

    const bufQ = makeBuf(Q);
    const bufK = makeBuf(K);
    const bufV = makeBuf(V);
    const bufOut = createStorageBuffer(qkv * 4);
    const bufScores = createStorageBuffer(scores * 4);

    const uData = new ArrayBuffer(16);
    const uv = new Uint32Array(uData);
    const fv = new Float32Array(uData);
    uv[0] = batch; uv[1] = seq; uv[2] = dim;
    fv[3] = scale;
    const uBuf = createUniformBuffer(uData);

    const pipeline = createPipeline(ATTENTION, ATTENTION_BINDINGS);
    const bg = createBindGroupForPipeline(pipeline, ATTENTION_BINDINGS, [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufQ } },
        { binding: 2, resource: { buffer: bufK } },
        { binding: 3, resource: { buffer: bufV } },
        { binding: 4, resource: { buffer: bufOut } },
        { binding: 5, resource: { buffer: bufScores } },
      ]);

    const res = await runGpuTest({
      name: 'Attention',
      pipeline,
      bindGroup: bg,
      workgroups: [batch, 1, 1],
      outputBuffer: bufOut,
      outputBytes: qkv * 4,
      validator: (gpuData) => {
        const cpu = cpuAttention(Q, K, V, batch, seq, dim, scale);
        let maxErr = 0;
        for (let i = 0; i < qkv; i++) maxErr = Math.max(maxErr, Math.abs(gpuData[i] - cpu[i]));
        const pass = maxErr < 1e-3;
        return { pass, error: pass ? '' : `Max error: ${maxErr}` };
      }
    });

    bufQ.destroy(); bufK.destroy(); bufV.destroy();
    bufOut.destroy(); bufScores.destroy(); uBuf.destroy();

    return { name: 'Attention', pass: res.pass, maxError: 0, details: res.error || 'Finite check passed' };
  } catch (e) {
    return { name: 'Attention', pass: false, maxError: Infinity, details: (e as Error).message };
  }
}

export async function runAllTests(): Promise<TestResult[]> {
  return [
    await testVecAdd(),
    await testMatmul(),
    await testConv2D(),
    await testSoftmax(),
    await testRMSNorm(),
    await testAttention(),
  ];
}
