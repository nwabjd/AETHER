// AETHER GPU Benchmark — Benchmark 1: Vector Addition
// C = A + B across multiple sizes

import {
  getDevice, createUniformBuffer, createStorageBuffer, readbackBuffer,
  createPipeline, createBindGroup, timeExecution, formatBytes,
  type BenchmarkResult,
} from './engine';
import { VEC_ADD } from './kernels';

const SIZES = [1024, 65536, 1_048_576, 16_777_216, 67_108_864];

export async function benchmarkVectorAdd(): Promise<BenchmarkResult[]> {
  const device = getDevice();
  const results: BenchmarkResult[] = [];

  const pipeline = createPipeline(VEC_ADD, 4);
  const layout = pipeline.getBindGroupLayout(0);

  for (const N of SIZES) {
    const bytes = N * 4;
    try {
      const aData = new Float32Array(N).fill(1.0);
      const bData = new Float32Array(N).fill(2.0);

      const bufA = createStorageBuffer(bytes, aData);
      const bufB = createStorageBuffer(bytes, bData);
      const bufC = createStorageBuffer(bytes);

      const uniformData = new ArrayBuffer(4);
      new Uint32Array(uniformData)[0] = N;
      const uBuf = createUniformBuffer(uniformData);

      const bindGroup = device.createBindGroup({
        layout,
        entries: [
          { binding: 0, resource: { buffer: uBuf } },
          { binding: 1, resource: { buffer: bufA } },
          { binding: 2, resource: { buffer: bufB } },
          { binding: 3, resource: { buffer: bufC } },
        ],
      });

      const workgroups = Math.ceil(N / 256);

      const timing = await timeExecution(() => {
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.dispatchWorkgroups(workgroups);
        pass.end();
        device.queue.submit([encoder.finish()]);
      }, 50);

      // Verify correctness
      const result = await readbackBuffer(bufC, bytes);
      const correct = result.every(v => Math.abs(v - 3.0) < 1e-5);

      const throughput = N / (timing.avgMs / 1000);

      results.push({
        id: `vecadd_${N}`,
        name: 'Vector Addition',
        inputSize: `${N} elements (${formatBytes(bytes)})`,
        executionTimeMs: timing.avgMs,
        throughput: `${(throughput / 1e6).toFixed(1)} M elements/s`,
        memoryBytes: bytes * 3,
        success: correct,
        gpuTimingAvailable: true,
        details: {
          iterations: timing.iterations,
          minMs: timing.minMs,
          maxMs: timing.maxMs,
          p50Ms: timing.p50Ms,
          elementsPerSecond: throughput,
          correctness: correct ? 'PASS' : 'FAIL',
        },
      });

      bufA.destroy();
      bufB.destroy();
      bufC.destroy();
      uBuf.destroy();
    } catch (e) {
      results.push({
        id: `vecadd_${N}`,
        name: 'Vector Addition',
        inputSize: `${N} elements (${formatBytes(bytes)})`,
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
