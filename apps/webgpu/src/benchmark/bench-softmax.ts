// AETHER GPU Benchmark — Benchmark 4: Softmax
// Row-wise softmax with correctness verification

import {
  getDevice, createUniformBuffer, createStorageBuffer, readbackBuffer,
  createPipeline, timeExecution, formatBytes,
  type BenchmarkResult,
} from './engine';
import { SOFTMAX } from './kernels';

function cpuSoftmax(data: Float32Array, rows: number, cols: number): Float32Array {
  const out = new Float32Array(data.length);
  for (let r = 0; r < rows; r++) {
    const base = r * cols;
    let max = -1e30;
    for (let c = 0; c < cols; c++) {
      if (data[base + c] > max) max = data[base + c];
    }
    let sumExp = 0;
    for (let c = 0; c < cols; c++) {
      const e = Math.exp(data[base + c] - max);
      out[base + c] = e;
      sumExp += e;
    }
    for (let c = 0; c < cols; c++) {
      out[base + c] /= sumExp;
    }
  }
  return out;
}

const TESTS = [
  { rows: 1, cols: 1024, name: '1×1024' },
  { rows: 32, cols: 1024, name: '32×1024' },
  { rows: 128, cols: 1024, name: '128×1024' },
  { rows: 512, cols: 1024, name: '512×1024' },
  { rows: 1024, cols: 1024, name: '1024×1024' },
];

export async function benchmarkSoftmax(): Promise<BenchmarkResult[]> {
  const device = getDevice();
  const results: BenchmarkResult[] = [];

  const pipeline = createPipeline(SOFTMAX, 2);
  const layout = pipeline.getBindGroupLayout(0);

  for (const t of TESTS) {
    try {
      const N = t.rows * t.cols;
      const bytes = N * 4;

      const data = new Float32Array(N);
      for (let i = 0; i < N; i++) data[i] = (Math.random() - 0.5) * 10;

      const bufData = createStorageBuffer(bytes, data);

      const uniformData = new ArrayBuffer(8);
      new Uint32Array(uniformData)[0] = t.rows;
      new Uint32Array(uniformData)[1] = t.cols;
      const uBuf = createUniformBuffer(uniformData);

      const bindGroup = device.createBindGroup({
        layout,
        entries: [
          { binding: 0, resource: { buffer: uBuf } },
          { binding: 1, resource: { buffer: bufData } },
        ],
      });

      const timing = await timeExecution(() => {
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.dispatchWorkgroups(t.rows);
        pass.end();
        device.queue.submit([encoder.finish()]);
      }, 50);

      // Verify
      const gpuResult = await readbackBuffer(bufData, bytes);
      const cpuResult = cpuSoftmax(data, t.rows, t.cols);
      let maxErr = 0;
      for (let i = 0; i < N; i++) {
        maxErr = Math.max(maxErr, Math.abs(gpuResult[i] - cpuResult[i]));
      }
      const correct = maxErr < 1e-4;

      results.push({
        id: `softmax_${t.name}`,
        name: 'Softmax',
        inputSize: t.name,
        executionTimeMs: timing.avgMs,
        throughput: `${(N / (timing.avgMs / 1000) / 1e6).toFixed(1)} M elements/s`,
        memoryBytes: bytes,
        success: correct,
        gpuTimingAvailable: true,
        details: {
          rows: t.rows,
          cols: t.cols,
          maxError: maxErr,
          iterations: timing.iterations,
          minMs: timing.minMs,
          maxMs: timing.maxMs,
          p50Ms: timing.p50Ms,
          correctness: correct ? 'PASS' : 'FAIL',
        },
      });

      bufData.destroy();
      uBuf.destroy();
    } catch (e) {
      results.push({
        id: `softmax_${t.name}`,
        name: 'Softmax',
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
