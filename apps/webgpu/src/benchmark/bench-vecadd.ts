// AETHER GPU Benchmark — Benchmark 1: Vector Addition
// C = A + B across multiple sizes

import {
  getDevice, createUniformBuffer, createStorageBuffer,
  createPipeline, formatBytes,
  type BenchmarkResult,
} from './engine';
import { VEC_ADD } from './kernels';
import { VEC_ADD_BINDINGS } from './bindings';
import { runGpuTest } from './gpu-test';

export async function benchmarkVectorAdd(): Promise<BenchmarkResult[]> {
  const device = getDevice();
  const results: BenchmarkResult[] = [];
  const pipeline = createPipeline(VEC_ADD, VEC_ADD_BINDINGS);

  // Deterministic, small test first
  const SIZES = [64, 1024, 65536]; 

  for (const N of SIZES) {
    const bytes = N * 4;
    const aData = new Float32Array(N).fill(1.0);
    const bData = new Float32Array(N).fill(2.0);

    const bufA = createStorageBuffer(bytes, aData);
    const bufB = createStorageBuffer(bytes, bData);
    const bufC = createStorageBuffer(bytes);
    const uniformData = new ArrayBuffer(4);
    new Uint32Array(uniformData)[0] = N;
    const uBuf = createUniformBuffer(uniformData);

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufA } },
        { binding: 2, resource: { buffer: bufB } },
        { binding: 3, resource: { buffer: bufC } },
      ],
    });

    const testResult = await runGpuTest({
      name: 'Vector Addition',
      pipeline,
      bindGroup,
      workgroups: [Math.ceil(N / 64), 1, 1], // Conservative workgroups
      outputBuffer: bufC,
      outputBytes: bytes,
      validator: (data) => {
        const pass = data.every(v => Math.abs(v - 3.0) < 1e-5);
        return { pass, error: pass ? '' : 'Incorrect values' };
      }
    });

    results.push({
      id: `vecadd_${N}`,
      name: 'Vector Addition',
      inputSize: `${N} elements (${formatBytes(bytes)})`,
      executionTimeMs: 0, // Simplified for now
      throughput: 'N/A',
      memoryBytes: bytes * 3,
      success: testResult.pass,
      error: testResult.error || undefined,
      gpuTimingAvailable: false,
    });

    bufA.destroy();
    bufB.destroy();
    bufC.destroy();
    uBuf.destroy();
  }
  return results;
}
