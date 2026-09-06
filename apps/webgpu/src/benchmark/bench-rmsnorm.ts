// AETHER GPU Benchmark — Benchmark 5: RMSNorm
// Root Mean Square Layer Normalization

import {
  getDevice, createUniformBuffer, createStorageBuffer, readbackBuffer,
  createPipeline, timeExecution, formatBytes,
  type BenchmarkResult,
} from './engine';
import { RMS_NORM } from './kernels';

function cpuRMSNorm(input: Float32Array, weight: Float32Array, eps: number): Float32Array {
  const N = input.length;
  let sumSq = 0;
  for (let i = 0; i < N; i++) sumSq += input[i] * input[i];
  const rms = Math.sqrt(sumSq / N + eps);
  const out = new Float32Array(N);
  for (let i = 0; i < N; i++) out[i] = (input[i] / rms) * weight[i];
  return out;
}

const TESTS = [
  { N: 64, name: 'N=64' },
  { N: 256, name: 'N=256' },
  { N: 1024, name: 'N=1024' },
  { N: 4096, name: 'N=4096 (typical LLM hidden)' },
  { N: 8192, name: 'N=8192 (large hidden)' },
  { N: 16384, name: 'N=16384' },
];

export async function benchmarkRMSNorm(): Promise<BenchmarkResult[]> {
  const device = getDevice();
  const results: BenchmarkResult[] = [];

  const pipeline = createPipeline(RMS_NORM, 4);
  const layout = pipeline.getBindGroupLayout(0);

  for (const t of TESTS) {
    try {
      const N = t.N;
      const eps = 1e-6;

      const inputData = new Float32Array(N);
      const weightData = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        inputData[i] = (Math.random() - 0.5) * 2;
        weightData[i] = 1.0;
      }

      const bufInput = createStorageBuffer(N * 4, inputData);
      const bufWeight = createStorageBuffer(N * 4, weightData);
      const bufOutput = createStorageBuffer(N * 4);

      const uniformData = new ArrayBuffer(8);
      new Uint32Array(uniformData)[0] = N;
      new Float32Array(uniformData)[1] = eps;
      const uBuf = createUniformBuffer(uniformData);

      const bindGroup = device.createBindGroup({
        layout,
        entries: [
          { binding: 0, resource: { buffer: uBuf } },
          { binding: 1, resource: { buffer: bufInput } },
          { binding: 2, resource: { buffer: bufWeight } },
          { binding: 3, resource: { buffer: bufOutput } },
        ],
      });

      const timing = await timeExecution(() => {
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.dispatchWorkgroups(1);
        pass.end();
        device.queue.submit([encoder.finish()]);
      }, 100);

      // Verify
      const gpuResult = await readbackBuffer(bufOutput, N * 4);
      const cpuResult = cpuRMSNorm(inputData, weightData, eps);
      let maxErr = 0;
      for (let i = 0; i < N; i++) {
        maxErr = Math.max(maxErr, Math.abs(gpuResult[i] - cpuResult[i]));
      }
      const correct = maxErr < 1e-3;

      results.push({
        id: `rmsnorm_${t.name}`,
        name: 'RMSNorm',
        inputSize: t.name,
        executionTimeMs: timing.avgMs,
        throughput: `${(N / (timing.avgMs / 1000) / 1e6).toFixed(1)} M elements/s`,
        memoryBytes: N * 4 * 3,
        success: correct,
        gpuTimingAvailable: true,
        details: {
          N,
          eps,
          maxError: maxErr,
          iterations: timing.iterations,
          minMs: timing.minMs,
          maxMs: timing.maxMs,
          p50Ms: timing.p50Ms,
          correctness: correct ? 'PASS' : 'FAIL',
        },
      });

      bufInput.destroy();
      bufWeight.destroy();
      bufOutput.destroy();
      uBuf.destroy();
    } catch (e) {
      results.push({
        id: `rmsnorm_${t.name}`,
        name: 'RMSNorm',
        inputSize: t.name,
        executionTimeMs: 0,
        throughput: 'N/A',
        memoryBytes: 0,
        success: false,
        error: (e as Error).message,
        gpuTimingAvailable: false,
      });
    }
  }

  return results;
}
