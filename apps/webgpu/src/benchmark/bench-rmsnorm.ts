// AETHER GPU Benchmark — Benchmark 5: RMSNorm (Deterministic)
import {
  getDevice, createUniformBuffer, createStorageBuffer,
  createPipeline, formatBytes,
  type BenchmarkResult,
} from './engine';
import { RMS_NORM } from './kernels';
import { RMS_NORM_BINDINGS } from './bindings';
import { runGpuTest } from './gpu-test';

export async function benchmarkRMSNorm(): Promise<BenchmarkResult[]> {
  const device = getDevice();
  const results: BenchmarkResult[] = [];
  const pipeline = createPipeline(RMS_NORM, RMS_NORM_BINDINGS);

  const SIZES = [8, 128, 512];

  for (const N of SIZES) {
    const bytes = N * 4;
    const inputData = new Float32Array(N).fill(0.5);
    const weightData = new Float32Array(N).fill(1.0);

    const bufInput = createStorageBuffer(bytes, inputData);
    const bufWeight = createStorageBuffer(bytes, weightData);
    const bufOutput = createStorageBuffer(bytes);

    const uniformData = new ArrayBuffer(8);
    new Uint32Array(uniformData)[0] = N;
    new Float32Array(uniformData)[1] = 1e-6;
    const uBuf = createUniformBuffer(uniformData);

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufInput } },
        { binding: 2, resource: { buffer: bufWeight } },
        { binding: 3, resource: { buffer: bufOutput } },
      ],
    });

    const testResult = await runGpuTest({
      name: 'RMSNorm',
      pipeline,
      bindGroup,
      workgroups: [1, 1, 1],
      outputBuffer: bufOutput,
      outputBytes: bytes,
      validator: (data) => {
        const sumSq = inputData.reduce((s, v) => s + v*v, 0);
        const rms = Math.sqrt(sumSq / N + 1e-6);
        const expected = inputData.map(v => (v / rms));
        const pass = data.every((v, i) => Math.abs(v - expected[i]) < 1e-4);
        return { pass, error: pass ? '' : `Incorrect values: got ${data[0]} expected ${expected[0]}` };
      }
    });

    results.push({
      id: `rmsnorm_${N}`,
      name: 'RMSNorm',
      inputSize: `${N} elements (${formatBytes(bytes)})`,
      executionTimeMs: 0,
      throughput: 'N/A',
      memoryBytes: bytes * 3,
      success: testResult.pass,
      error: testResult.error || undefined,
      gpuTimingAvailable: false,
    });

    bufInput.destroy();
    bufWeight.destroy();
    bufOutput.destroy();
    uBuf.destroy();
  }
  return results;
}