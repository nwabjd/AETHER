// AETHER GPU Benchmark — Benchmark 3: Conv2D (Deterministic, 1 thread per output)
import {
  getDevice, createUniformBuffer, createStorageBuffer,
  createPipeline, formatBytes,
  type BenchmarkResult,
} from './engine';
import { CONV2D } from './kernels';
import { CONV2D_BINDINGS } from './bindings';
import { createConv2DUniform } from './uniforms';
import { runGpuTest } from './gpu-test';

export async function benchmarkConv2D(): Promise<BenchmarkResult[]> {
  const device = getDevice();
  const results: BenchmarkResult[] = [];
  const pipeline = createPipeline(CONV2D, CONV2D_BINDINGS);

  // Small deterministic test: 1x1x5x5 input, 1x1x3x3 kernel
  const N = 1, C = 1, H = 5, W = 5, F = 1, FH = 3, FW = 3;
  const OH = H - FH + 1;
  const OW = W - FW + 1;

  const inputElements = N * C * H * W;
  const kernelElements = F * C * FH * FW;
  const outputElements = N * F * OH * OW;

  // Deterministic input: 1.0 everywhere
  const inputData = new Float32Array(inputElements).fill(1.0);
  // Deterministic kernel: 1.0 everywhere
  const kernelData = new Float32Array(kernelElements).fill(1.0);

  const bufInput = createStorageBuffer(inputElements * 4, inputData);
  const bufKernel = createStorageBuffer(kernelElements * 4, kernelData);
  const bufOutput = createStorageBuffer(outputElements * 4);
  const uBuf = createUniformBuffer(createConv2DUniform(N, C, H, W, F, FH, FW, OH, OW));

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uBuf } },
      { binding: 1, resource: { buffer: bufInput } },
      { binding: 2, resource: { buffer: bufKernel } },
      { binding: 3, resource: { buffer: bufOutput } },
    ],
  });

  const testResult = await runGpuTest(device, {
    name: 'Conv2D',
    pipeline,
    bindGroup,
    workgroups: [N, F, OH * OW], // 1 invocation per output pixel
    outputBuffer: bufOutput,
    outputBytes: outputElements * 4,
    validator: (data) => {
      // Expected: each output = 3x3 = 9.0 (since all 1s)
      const expected = 9.0;
      const pass = data.every(v => Math.abs(v - expected) < 1e-4);
      return { pass, error: pass ? '' : `Expected ${expected}, got ${data[0]}` };
    }
  });

  results.push({
    id: `conv2d_${N}x${C}x${H}x${W}`,
    name: 'Conv2D',
    inputSize: `${N}x${C}x${H}x${W} k=${FH}`,
    executionTimeMs: 0,
    throughput: 'N/A',
    memoryBytes: (inputElements + kernelElements + outputElements) * 4,
    success: testResult.pass,
    error: testResult.error || undefined,
    gpuTimingAvailable: false,
  });

  bufInput.destroy();
  bufKernel.destroy();
  bufOutput.destroy();
  uBuf.destroy();
  return results;
}