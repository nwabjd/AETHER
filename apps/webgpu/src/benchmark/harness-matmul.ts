// AETHER GPU Benchmark — SHARED-DEVICE DIRECT MATMUL
//
// Third comparison point in the gate ladder:
//   GPU SANITY (own device) → STANDALONE MATMUL (own device) →
//   SHARED-DEVICE DIRECT MATMUL (engine device, inline, NO runGpuTest) →
//   HARNESS MATMUL (engine device via runGpuTest).
//
// This deliberately does NOT call runGpuTest: every step — buffers, uniform,
// pipeline, bind group, command encoder, compute pass, dispatch, copy, submit,
// map, validate — runs inline against the single engine device captured by
// getDevice(). If this passes but HARNESS MATMUL fails, the bug is proven to
// live inside runGpuTest's execution path.
//
// Inputs match the standalone reference: A = 1.0, B = 0.5, K = 64 → 32.0.

import {
  getDevice,
  createStorageBuffer,
  createUniformBuffer,
  createPipeline,
  createBindGroupForPipeline,
  runWithScope,
} from './engine';
import {
  getDeviceIdentity,
  getPipelineDeviceIdentity,
  getBindGroupDeviceIdentity,
} from './device-identity';
import { MATMUL } from './kernels';
import { MATMUL_BINDINGS } from './bindings';

export interface SharedDeviceDirectResult {
  name: string;
  pass: boolean;
  stage: string;
  errorType: string | null;
  errorMessage: string | null;
  maxError: number | null;
  executionDeviceId: number;
  pipelineDeviceId: number | null;
  bindGroupDeviceId: number | null;
  mismatch: boolean;
}

export async function runSharedDeviceDirectMatmul(): Promise<SharedDeviceDirectResult> {
  const device = getDevice();
  const executionDeviceId = getDeviceIdentity(device);

  const result: SharedDeviceDirectResult = {
    name: 'Shared-Device Direct MatMul 64×64',
    pass: false,
    stage: 'request-device',
    errorType: null,
    errorMessage: null,
    maxError: null,
    executionDeviceId,
    pipelineDeviceId: null,
    bindGroupDeviceId: null,
    mismatch: false,
  };

  const N = 64;
  const count = N * N;
  const A = new Float32Array(count).fill(1.0);
  const B = new Float32Array(count).fill(0.5);
  const expected = 32.0;

  try {
    const { error } = await runWithScope(device, 'shared-device-direct-matmul', async () => {
      result.stage = 'create-buffers';
      const bufA = createStorageBuffer(A.byteLength, A);
      const bufB = createStorageBuffer(B.byteLength, B);
      const bufC = createStorageBuffer(count * 4);

      result.stage = 'create-uniform';
      const uData = new ArrayBuffer(16);
      const uv = new Uint32Array(uData);
      uv[0] = N; uv[1] = N; uv[2] = N; // M, N, K
      const uBuf = createUniformBuffer(uData);

      result.stage = 'create-pipeline';
      const pipeline = createPipeline(MATMUL, MATMUL_BINDINGS);
      result.pipelineDeviceId = getPipelineDeviceIdentity(pipeline) ?? executionDeviceId;

      result.stage = 'create-bind-group';
      const bg = createBindGroupForPipeline(pipeline, MATMUL_BINDINGS, [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufA } },
        { binding: 2, resource: { buffer: bufB } },
        { binding: 3, resource: { buffer: bufC } },
      ]);
      result.bindGroupDeviceId = getBindGroupDeviceIdentity(bg);

      // Pipeline identity must equal the execution device — defensive check,
      // inline here (the engine factories resolve to the same object).
      if (result.pipelineDeviceId !== null && result.pipelineDeviceId !== executionDeviceId) {
        result.mismatch = true;
        throw new Error(
          `PIPELINE DEVICE MISMATCH — pipeline device: ${result.pipelineDeviceId}, execution device: ${executionDeviceId}`
        );
      }

      result.stage = 'encode';
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginComputePass();
      result.stage = 'set-pipeline';
      pass.setPipeline(pipeline);
      result.stage = 'set-bind-group';
      pass.setBindGroup(0, bg);
      result.stage = 'dispatch';
      pass.dispatchWorkgroups(4, 4, 1);
      pass.end();
      const staging = device.createBuffer({
        size: count * 4,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      });
      result.stage = 'submit';
      encoder.copyBufferToBuffer(bufC, 0, staging, 0, count * 4);
      device.queue.submit([encoder.finish()]);

      result.stage = 'readback';
      await staging.mapAsync(GPUMapMode.READ);
      const data = new Float32Array(staging.getMappedRange().slice(0));
      staging.unmap();
      staging.destroy();

      result.stage = 'validation';
      let maxErr = 0;
      for (let i = 0; i < count; i++) {
        maxErr = Math.max(maxErr, Math.abs(data[i] - expected));
      }
      result.maxError = maxErr;
      uBuf.destroy();
      bufA.destroy();
      bufB.destroy();
      bufC.destroy();
      return true;
    });

    if (error) {
      result.pass = false;
      if (!result.errorMessage) {
        result.stage = result.stage || 'gpu';
        result.errorType = 'gpu-error';
        result.errorMessage = error;
      }
      return result;
    }
  } catch (e) {
    result.pass = false;
    result.stage = result.stage || 'unknown';
    result.errorType = 'exception';
    result.errorMessage = result.errorMessage ?? (e instanceof Error ? e.message : String(e));
    return result;
  }

  result.pass = result.maxError !== null && result.maxError < 1e-3;
  if (!result.pass) {
    result.stage = 'validation';
    result.errorType = 'output-mismatch';
    result.errorMessage = `expected all elements = ${expected}, got max err = ${result.maxError?.toExponential(2)}`;
  }

  return result;
}