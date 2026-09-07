// AETHER GPU Benchmark — Benchmark 6: Attention (Deterministic, very small)
import {
  getDevice, createUniformBuffer, createStorageBuffer,
  createPipeline, formatBytes,
  type BenchmarkResult,
} from './engine';
import { ATTENTION } from './kernels';
import { ATTENTION_BINDINGS } from './bindings';
import { createAttentionUniform } from './uniforms';
import { runGpuTest } from './gpu-test';

export async function benchmarkAttention(): Promise<BenchmarkResult[]> {
  const device = getDevice();
  const results: BenchmarkResult[] = [];
  const pipeline = createPipeline(ATTENTION, ATTENTION_BINDINGS);

  // Very small: batch=1, seq=4, dim=4
  const batch = 1, seq = 4, dim = 4;
  const scale = 1 / Math.sqrt(dim);
  const qkvSize = batch * seq * dim;
  const scoresSize = batch * seq * seq;

  // Deterministic Q, K, V
  const qData = new Float32Array(qkvSize).map((_, i) => (i % dim + 1) * 0.1);
  const kData = new Float32Array(qkvSize).map((_, i) => (i % dim + 1) * 0.1);
  const vData = new Float32Array(qkvSize).map((_, i) => (i % dim + 1) * 0.1);

  const bufQ = createStorageBuffer(qkvSize * 4, qData);
  const bufK = createStorageBuffer(qkvSize * 4, kData);
  const bufV = createStorageBuffer(qkvSize * 4, vData);
  const bufOut = createStorageBuffer(qkvSize * 4);
  const bufScores = createStorageBuffer(scoresSize * 4);
  const uBuf = createUniformBuffer(createAttentionUniform(batch, seq, dim, scale));

  const bindGroup = device.createBindGroup({
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

  const testResult = await runGpuTest(device, {
    name: 'Attention',
    pipeline,
    bindGroup,
    workgroups: [batch, 1, 1],
    outputBuffer: bufOut,
    outputBytes: qkvSize * 4,
    validator: (data) => {
      // Just check it's finite and not NaN for now
      const pass = data.every(v => isFinite(v));
      return { pass, error: pass ? '' : 'Non-finite output' };
    }
  });

  results.push({
    id: `attention_${batch}x${seq}x${dim}`,
    name: 'Attention',
    inputSize: `batch=${batch} seq=${seq} dim=${dim}`,
    executionTimeMs: 0,
    throughput: 'N/A',
    memoryBytes: (qkvSize * 3 + qkvSize + scoresSize) * 4,
    success: testResult.pass,
    error: testResult.error || undefined,
    gpuTimingAvailable: false,
  });

  bufQ.destroy();
  bufK.destroy();
  bufV.destroy();
  bufOut.destroy();
  bufScores.destroy();
  uBuf.destroy();
  return results;
}