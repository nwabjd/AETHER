// AETHER GPU Benchmark — Correctness Tests
// Every test: deterministic inputs, single command buffer, exact validation

import {
  getDevice, createUniformBuffer, createStorageBuffer,
  createPipeline,
} from './engine';
import {
  VEC_ADD, MATMUL, CONV2D, SOFTMAX, RMS_NORM, ATTENTION,
} from './kernels';

export interface TestResult {
  name: string;
  pass: boolean;
  maxError: number;
  details: string;
  webgpuError?: string;
}

// ─── Single-command-buffer test helper ───

async function runTest(
  name: string,
  pipeline: GPUComputePipeline,
  bindGroup: GPUBindGroup,
  workgroups: [number, number, number],
  outputBuffer: GPUBuffer,
  outputBytes: number,
  cpuData: Float32Array,
  tolerance: number
): Promise<TestResult> {
  const device = getDevice();

  try {
    // Error scopes
    device.pushErrorScope('validation');
    device.pushErrorScope('out-of-memory');
    device.pushErrorScope('internal');

    // ONE command buffer: compute pass + copy
    const encoder = device.createCommandEncoder();

    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(...workgroups);
    pass.end();

    const staging = device.createBuffer({
      size: outputBytes,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    encoder.copyBufferToBuffer(outputBuffer, 0, staging, 0, outputBytes);

    // Submit ONE command buffer
    device.queue.submit([encoder.finish()]);

    // Pop error scopes
    const [internalErr, oomErr, validationErr] = await Promise.all([
      device.popErrorScope(),
      device.popErrorScope(),
      device.popErrorScope(),
    ]);

    const wgErr = internalErr || oomErr || validationErr;
    if (wgErr) {
      staging.destroy();
      return { name, pass: false, maxError: Infinity, details: '', webgpuError: `Stage: Dispatch — ${wgErr.constructor.name}: ${wgErr.message}` };
    }

    // Wait for GPU, then map
    await device.queue.onSubmittedWorkDone();
    await staging.mapAsync(GPUMapMode.READ);
    const gpu = new Float32Array(staging.getMappedRange().slice(0));
    staging.unmap();
    staging.destroy();

    // Validate
    let maxErr = 0;
    for (let i = 0; i < cpuData.length; i++) {
      const err = Math.abs(gpu[i] - cpuData[i]);
      if (err > maxErr) maxErr = err;
    }

    const passOk = maxErr < tolerance;
    return {
      name,
      pass: passOk,
      maxError: maxErr,
      details: passOk ? `OK (${cpuData.length} elements)` : `Max error: ${maxErr.toExponential(3)} (tolerance: ${tolerance})`,
    };
  } catch (e) {
    return { name, pass: false, maxError: Infinity, details: (e as Error).message, webgpuError: `Stage: Exception — ${(e as Error).message}` };
  }
}

// ═══════════════════════════════════════
// TEST 1: Vector Add
// ═══════════════════════════════════════

export async function testVecAdd(): Promise<TestResult> {
  const N = 64;
  const A = new Float32Array(Array.from({ length: N }, (_, i) => i + 1));
  const B = new Float32Array(Array.from({ length: N }, (_, i) => 2 * i + 1));
  const expected = new Float32Array(N);
  for (let i = 0; i < N; i++) expected[i] = A[i] + B[i];

  const bufA = createStorageBuffer(A.byteLength, A);
  const bufB = createStorageBuffer(B.byteLength, B);
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

  const result = await runTest('VecAdd', pipeline, bg, [1, 1, 1], bufC, N * 4, expected, 1e-5);
  bufA.destroy(); bufB.destroy(); bufC.destroy(); uBuf.destroy();
  return result;
}

// ═══════════════════════════════════════
// TEST 2: Matrix Multiplication
// ═══════════════════════════════════════

export async function testMatmul(): Promise<TestResult> {
  const N = 64;
  const A = new Float32Array(N * N).fill(1.0);
  const B = new Float32Array(N * N).fill(0.5);

  // CPU reference
  const expected = new Float32Array(N * N);
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      let sum = 0;
      for (let k = 0; k < N; k++) sum += A[r * N + k] * B[k * N + c];
      expected[r * N + c] = sum;
    }

  const bufA = createStorageBuffer(A.byteLength, A);
  const bufB = createStorageBuffer(B.byteLength, B);
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

  const result = await runTest('Matmul', pipeline, bg,
    [Math.ceil(N / 16), Math.ceil(N / 16), 1],
    bufC, N * N * 4, expected, 1e-3);

  bufA.destroy(); bufB.destroy(); bufC.destroy(); uBuf.destroy();
  return result;
}

// ═══════════════════════════════════════
// TEST 3: RMSNorm
// ═══════════════════════════════════════

export async function testRMSNorm(): Promise<TestResult> {
  const N = 8;
  const eps = 1e-6;
  const input = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const weight = new Float32Array(N).fill(1.0);

  // CPU reference
  let sumSq = 0;
  for (let i = 0; i < N; i++) sumSq += input[i] * input[i];
  const rms = Math.sqrt(sumSq / N + eps);
  const expected = new Float32Array(N);
  for (let i = 0; i < N; i++) expected[i] = (input[i] / rms) * weight[i];

  const bufIn = createStorageBuffer(input.byteLength, input);
  const bufW = createStorageBuffer(weight.byteLength, weight);
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

  const result = await runTest('RMSNorm', pipeline, bg, [1, 1, 1], bufOut, N * 4, expected, 1e-4);
  bufIn.destroy(); bufW.destroy(); bufOut.destroy(); uBuf.destroy();
  return result;
}

// ═══════════════════════════════════════
// TEST 4: Softmax
// ═══════════════════════════════════════

export async function testSoftmax(): Promise<TestResult> {
  const rows = 2, cols = 5;
  const input = new Float32Array([-2, -1, 0, 1, 2, 2, 1, 0, -1, -2]);

  // CPU reference
  const expected = new Float32Array(rows * cols);
  for (let r = 0; r < rows; r++) {
    const base = r * cols;
    let max = -1e30;
    for (let c = 0; c < cols; c++) if (input[base + c] > max) max = input[base + c];
    let sumExp = 0;
    for (let c = 0; c < cols; c++) {
      const e = Math.exp(input[base + c] - max);
      expected[base + c] = e;
      sumExp += e;
    }
    for (let c = 0; c < cols; c++) expected[base + c] /= sumExp;
  }

  const bufIn = createStorageBuffer(input.byteLength, input);
  const bufOut = createStorageBuffer(input.byteLength);

  const uData = new ArrayBuffer(8);
  new Uint32Array(uData)[0] = rows;
  new Uint32Array(uData)[1] = cols;
  const uBuf = createUniformBuffer(uData);

  const pipeline = createPipeline(SOFTMAX, 3);
  const bg = getDevice().createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uBuf } },
      { binding: 1, resource: { buffer: bufIn } },
      { binding: 2, resource: { buffer: bufOut } },
    ],
  });

  const result = await runTest('Softmax', pipeline, bg, [rows, 1, 1], bufOut, input.byteLength, expected, 1e-4);
  bufIn.destroy(); bufOut.destroy(); uBuf.destroy();
  return result;
}

// ═══════════════════════════════════════
// TEST 5: Conv2D
// ═══════════════════════════════════════

export async function testConv2D(): Promise<TestResult> {
  const N = 1, C = 1, H = 5, W = 5, F = 1, FH = 3, FW = 3;
  const OH = H - FH + 1, OW = W - FW + 1;
  const input = new Float32Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]);
  const kernel = new Float32Array([1,0,-1,1,0,-1,1,0,-1]);

  // CPU reference
  const expected = new Float32Array(N * F * OH * OW);
  for (let oh = 0; oh < OH; oh++) {
    for (let ow = 0; ow < OW; ow++) {
      let sum = 0;
      for (let fh = 0; fh < FH; fh++) {
        for (let fw = 0; fw < FW; fw++) {
          sum += input[(oh + fh) * W + (ow + fw)] * kernel[fh * FW + fw];
        }
      }
      expected[oh * OW + ow] = sum;
    }
  }

  const bufIn = createStorageBuffer(input.byteLength, input);
  const bufK = createStorageBuffer(kernel.byteLength, kernel);
  const bufOut = createStorageBuffer(expected.byteLength);

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

  const result = await runTest('Conv2D', pipeline, bg,
    [N, F, OH * OW],
    bufOut, expected.byteLength, expected, 1e-4);

  bufIn.destroy(); bufK.destroy(); bufOut.destroy(); uBuf.destroy();
  return result;
}

// ═══════════════════════════════════════
// TEST 6: Attention
// ═══════════════════════════════════════

export async function testAttention(): Promise<TestResult> {
  const batch = 1, seq = 4, dim = 4;
  const scale = 1 / Math.sqrt(dim);
  const qkv = batch * seq * dim;

  // Deterministic Q, K, V
  const Q = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  const K = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  const V = new Float32Array([1,2,3,4, 5,6,7,8, 9,10,11,12, 13,14,15,16]);

  // CPU reference: out = softmax(Q @ K^T * scale) @ V
  // With identity Q and K: Q @ K^T = I, so scores = I * scale
  // softmax of scaled identity: each row has one nonzero entry at diagonal
  // So output = V (softmax of identity picks the diagonal column)
  const expected = new Float32Array(V);

  const bufQ = createStorageBuffer(Q.byteLength, Q);
  const bufK = createStorageBuffer(K.byteLength, K);
  const bufV = createStorageBuffer(V.byteLength, V);
  const bufOut = createStorageBuffer(qkv * 4);
  const bufScores = createStorageBuffer(batch * seq * seq * 4);

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

  const result = await runTest('Attention', pipeline, bg, [batch, 1, 1], bufOut, qkv * 4, expected, 1e-3);

  bufQ.destroy(); bufK.destroy(); bufV.destroy(); bufOut.destroy(); bufScores.destroy(); uBuf.destroy();
  return result;
}

// ═══════════════════════════════════════

export async function runAllTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  results.push(await testVecAdd());
  results.push(await testMatmul());
  results.push(await testRMSNorm());
  results.push(await testSoftmax());
  results.push(await testConv2D());
  results.push(await testAttention());
  return results;
}
