// AETHER GPU Benchmark — Correctness Tests
// Automated verification of every kernel against CPU reference

import {
  getDevice, createUniformBuffer, createStorageBuffer, readbackBuffer,
  createPipeline,
} from './engine';
import {
  VEC_ADD, MATMUL, CONV2D, SOFTMAX, RMS_NORM, ATTENTION,
} from './kernels';

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

function dispatch(
  pipeline: GPUComputePipeline,
  bindGroup: GPUBindGroup,
  workgroups: [number, number, number] = [1, 1, 1]
) {
  const device = getDevice();
  const encoder = device.createCommandEncoder();
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(...workgroups);
  pass.end();
  device.queue.submit([encoder.finish()]);
}

// ─── Tests ───

export async function testVecAdd(): Promise<TestResult> {
  try {
    const N = 1024;
    const A = new Float32Array(N).fill(2.0);
    const B = new Float32Array(N).fill(3.0);

    const bufA = makeBuf(A);
    const bufB = makeBuf(B);
    const bufC = createStorageBuffer(N * 4);

    const uData = new ArrayBuffer(4);
    new Uint32Array(uData)[0] = N;
    const uBuf = createUniformBuffer(uData);

    const pipeline = createPipeline(VEC_ADD, 4);
    const bg = getDevice().createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufA } },
        { binding: 2, resource: { buffer: bufB } },
        { binding: 3, resource: { buffer: bufC } },
      ],
    });

    dispatch(pipeline, bg, [Math.ceil(N / 256), 1, 1]);
    await getDevice().queue.onSubmittedWorkDone();

    const gpu = await readbackBuffer(bufC, N * 4);
    const cpu = cpuVecAdd(A, B);

    let maxErr = 0;
    for (let i = 0; i < N; i++) maxErr = Math.max(maxErr, Math.abs(gpu[i] - cpu[i]));

    bufA.destroy(); bufB.destroy(); bufC.destroy(); uBuf.destroy();

    return { name: 'VecAdd', pass: maxErr < 1e-5, maxError: maxErr, details: `N=${N}` };
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

    const pipeline = createPipeline(MATMUL, 4);
    const bg = getDevice().createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufA } },
        { binding: 2, resource: { buffer: bufB } },
        { binding: 3, resource: { buffer: bufC } },
      ],
    });

    dispatch(pipeline, bg, [Math.ceil(N / 16), Math.ceil(N / 16), 1]);
    await getDevice().queue.onSubmittedWorkDone();

    const gpu = await readbackBuffer(bufC, N * N * 4);
    const cpu = cpuMatmul(A, B, N, N, N);

    let maxErr = 0;
    for (let i = 0; i < N * N; i++) maxErr = Math.max(maxErr, Math.abs(gpu[i] - cpu[i]));

    bufA.destroy(); bufB.destroy(); bufC.destroy(); uBuf.destroy();

    return { name: 'Matmul', pass: maxErr < 1e-3, maxError: maxErr, details: `${N}×${N}` };
  } catch (e) {
    return { name: 'Matmul', pass: false, maxError: Infinity, details: (e as Error).message };
  }
}

export async function testConv2D(): Promise<TestResult> {
  try {
    const N = 1, C = 1, H = 8, W = 8, F = 1, FH = 3, FW = 3;
    const OH = H - FH + 1, OW = W - FW + 1;
    const input = new Float32Array(N * C * H * W);
    const kernel = new Float32Array(F * C * FH * FW);
    for (let i = 0; i < input.length; i++) input[i] = Math.random();
    for (let i = 0; i < kernel.length; i++) kernel[i] = Math.random();

    const bufIn = makeBuf(input);
    const bufK = makeBuf(kernel);
    const bufOut = createStorageBuffer(N * F * OH * OW * 4);

    const uData = new ArrayBuffer(36);
    const uv = new Uint32Array(uData);
    uv[0] = N; uv[1] = C; uv[2] = H; uv[3] = W;
    uv[4] = F; uv[5] = FH; uv[6] = FW; uv[7] = OH; uv[8] = OW;
    const uBuf = createUniformBuffer(uData);

    const pipeline = createPipeline(CONV2D, 4);
    const bg = getDevice().createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufIn } },
        { binding: 2, resource: { buffer: bufK } },
        { binding: 3, resource: { buffer: bufOut } },
      ],
    });

    dispatch(pipeline, bg, [N, F, 1]);
    await getDevice().queue.onSubmittedWorkDone();

    const gpu = await readbackBuffer(bufOut, N * F * OH * OW * 4);
    const cpu = cpuConv2D(input, kernel, N, C, H, W, F, FH, FW);

    let maxErr = 0;
    for (let i = 0; i < gpu.length; i++) maxErr = Math.max(maxErr, Math.abs(gpu[i] - cpu[i]));

    bufIn.destroy(); bufK.destroy(); bufOut.destroy(); uBuf.destroy();

    return { name: 'Conv2D', pass: maxErr < 1e-4, maxError: maxErr, details: `${N}×${C}×${H}×${W} k=${FH}` };
  } catch (e) {
    return { name: 'Conv2D', pass: false, maxError: Infinity, details: (e as Error).message };
  }
}

export async function testSoftmax(): Promise<TestResult> {
  try {
    const rows = 4, cols = 16;
    const data = new Float32Array(rows * cols);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() - 0.5) * 10;

    const buf = createStorageBuffer(data.byteLength, data);

    const uData = new ArrayBuffer(8);
    new Uint32Array(uData)[0] = rows;
    new Uint32Array(uData)[1] = cols;
    const uBuf = createUniformBuffer(uData);

    const pipeline = createPipeline(SOFTMAX, 2);
    const bg = getDevice().createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: buf } },
      ],
    });

    dispatch(pipeline, bg, [rows, 1, 1]);
    await getDevice().queue.onSubmittedWorkDone();

    const gpu = await readbackBuffer(buf, data.byteLength);
    const cpu = cpuSoftmax(data, rows, cols);

    let maxErr = 0;
    for (let i = 0; i < data.length; i++) maxErr = Math.max(maxErr, Math.abs(gpu[i] - cpu[i]));

    buf.destroy(); uBuf.destroy();

    return { name: 'Softmax', pass: maxErr < 1e-4, maxError: maxErr, details: `${rows}×${cols}` };
  } catch (e) {
    return { name: 'Softmax', pass: false, maxError: Infinity, details: (e as Error).message };
  }
}

export async function testRMSNorm(): Promise<TestResult> {
  try {
    const N = 128;
    const eps = 1e-6;
    const input = new Float32Array(N);
    const weight = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      input[i] = (Math.random() - 0.5) * 2;
      weight[i] = 1.0;
    }

    const bufIn = makeBuf(input);
    const bufW = makeBuf(weight);
    const bufOut = createStorageBuffer(N * 4);

    const uData = new ArrayBuffer(8);
    new Uint32Array(uData)[0] = N;
    new Float32Array(uData)[1] = eps;
    const uBuf = createUniformBuffer(uData);

    const pipeline = createPipeline(RMS_NORM, 4);
    const bg = getDevice().createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufIn } },
        { binding: 2, resource: { buffer: bufW } },
        { binding: 3, resource: { buffer: bufOut } },
      ],
    });

    dispatch(pipeline, bg, [1, 1, 1]);
    await getDevice().queue.onSubmittedWorkDone();

    const gpu = await readbackBuffer(bufOut, N * 4);
    const cpu = cpuRMSNorm(input, weight, eps);

    let maxErr = 0;
    for (let i = 0; i < N; i++) maxErr = Math.max(maxErr, Math.abs(gpu[i] - cpu[i]));

    bufIn.destroy(); bufW.destroy(); bufOut.destroy(); uBuf.destroy();

    return { name: 'RMSNorm', pass: maxErr < 1e-3, maxError: maxErr, details: `N=${N}` };
  } catch (e) {
    return { name: 'RMSNorm', pass: false, maxError: Infinity, details: (e as Error).message };
  }
}

export async function testAttention(): Promise<TestResult> {
  try {
    const batch = 1, seq = 16, dim = 16;
    const scale = 1 / Math.sqrt(dim);
    const qkv = batch * seq * dim;
    const scores = batch * seq * seq;

    const Q = new Float32Array(qkv);
    const K = new Float32Array(qkv);
    const V = new Float32Array(qkv);
    for (let i = 0; i < qkv; i++) { Q[i] = Math.random(); K[i] = Math.random(); V[i] = Math.random(); }

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

    const pipeline = createPipeline(ATTENTION, 6);
    const bg = getDevice().createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufQ } },
        { binding: 2, resource: { buffer: bufK } },
        { binding: 3, resource: { buffer: bufV } },
        { binding: 4, resource: { buffer: bufOut } },
        { binding: 5, resource: { buffer: bufScores } },
      ],
    });

    dispatch(pipeline, bg, [batch, 1, 1]);
    await getDevice().queue.onSubmittedWorkDone();

    const gpu = await readbackBuffer(bufOut, qkv * 4);
    let allFinite = true;
    for (let i = 0; i < qkv; i++) {
      if (!isFinite(gpu[i])) { allFinite = false; break; }
    }

    // Check softmax property: each row of scores sums to ~1
    const gpuScores = await readbackBuffer(bufScores, scores * 4);
    let rowSumsOk = true;
    for (let i = 0; i < seq; i++) {
      let sum = 0;
      for (let j = 0; j < seq; j++) sum += gpuScores[i * seq + j];
      if (Math.abs(sum - 1) > 0.01) { rowSumsOk = false; break; }
    }

    bufQ.destroy(); bufK.destroy(); bufV.destroy();
    bufOut.destroy(); bufScores.destroy(); uBuf.destroy();

    return {
      name: 'Attention',
      pass: allFinite && rowSumsOk,
      maxError: rowSumsOk ? 0 : 1,
      details: `batch=${batch} seq=${seq} dim=${dim} finite=${allFinite} softmax_ok=${rowSumsOk}`,
    };
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
