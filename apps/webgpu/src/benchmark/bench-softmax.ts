// AETHER GPU Benchmark — Benchmark 4: Softmax (Deterministic, Non-In-Place)
import {
  getDevice, createUniformBuffer, createStorageBuffer,
  createPipeline, formatBytes,
  type BenchmarkResult,
} from './engine';
import { SOFTMAX } from './kernels';
import { SOFTMAX_BINDINGS } from './bindings';
import { createSoftmaxUniform } from './uniforms';
import { runGpuTest } from './gpu-test';

export async function benchmarkSoftmax(): Promise<BenchmarkResult[]> {
  const device = getDevice();
  const results: BenchmarkResult[] = [];
  const pipeline = createPipeline(SOFTMAX, SOFTMAX_BINDINGS);

  const TESTS = [
    { rows: 1, cols: 64 },
    { rows: 4, cols: 64 },
  ];

  for (const t of TESTS) {
    const N = t.rows * t.cols;
    const bytes = N * 4;
    
    const data = new Float32Array(N).map((_, i) => (i % t.cols) * 0.1);
    const bufInput = createStorageBuffer(bytes, data);
    const bufOutput = createStorageBuffer(bytes);
    const uBuf = createUniformBuffer(createSoftmaxUniform(t.rows, t.cols));

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufInput } },
        { binding: 2, resource: { buffer: bufOutput } },
      ],
    });

    const testResult = await runGpuTest(device, {
      name: 'Softmax',
      pipeline,
      bindGroup,
      workgroups: [t.rows, 1, 1],
      outputBuffer: bufOutput,
      outputBytes: bytes,
      validator: (data) => {
        let pass = true;
        for (let r = 0; r < t.rows; r++) {
          const base = r * t.cols;
          let sum = 0;
          for (let c = 0; c < t.cols; c++) sum += data[base + c];
          if (Math.abs(sum - 1.0) > 1e-4) { pass = false; break; }
        }
        return { pass, error: pass ? '' : 'Softmax rows do not sum to 1' };
      }
    });

    results.push({
      id: `softmax_${t.rows}x${t.cols}`,
      name: 'Softmax',
      inputSize: `${t.rows}x${t.cols}`,
      executionTimeMs: 0,
      throughput: 'N/A',
      memoryBytes: bytes,
      success: testResult.pass,
      error: testResult.error || undefined,
      gpuTimingAvailable: false,
    });

    bufInput.destroy();
    bufOutput.destroy();
    uBuf.destroy();
  }
  return results;
}