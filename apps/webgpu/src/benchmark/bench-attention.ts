// AETHER GPU Benchmark — Benchmark 6: Attention
// Simplified scaled dot-product attention

import {
  getDevice, createUniformBuffer, createStorageBuffer, readbackBuffer,
  createPipeline, timeExecution, formatBytes,
  type BenchmarkResult,
} from './engine';
import { ATTENTION } from './kernels';

const TESTS = [
  { batch: 1, seq: 128, dim: 64, name: 'seq=128 dim=64' },
  { batch: 1, seq: 256, dim: 64, name: 'seq=256 dim=64' },
  { batch: 1, seq: 512, dim: 64, name: 'seq=512 dim=64' },
  { batch: 1, seq: 128, dim: 128, name: 'seq=128 dim=128' },
  { batch: 1, seq: 256, dim: 128, name: 'seq=256 dim=128' },
  { batch: 1, seq: 512, dim: 128, name: 'seq=512 dim=128' },
];

export async function benchmarkAttention(): Promise<BenchmarkResult[]> {
  const device = getDevice();
  const results: BenchmarkResult[] = [];

  const pipeline = createPipeline(ATTENTION, 6);
  const layout = pipeline.getBindGroupLayout(0);

  for (const t of TESTS) {
    try {
      const { batch, seq, dim } = t;
      const scale = 1 / Math.sqrt(dim);
      const qkvSize = batch * seq * dim;
      const scoresSize = batch * seq * seq;

      const qData = new Float32Array(qkvSize).fill(0.1);
      const kData = new Float32Array(qkvSize).fill(0.1);
      const vData = new Float32Array(qkvSize).fill(0.1);

      const bufQ = createStorageBuffer(qkvSize * 4, qData);
      const bufK = createStorageBuffer(qkvSize * 4, kData);
      const bufV = createStorageBuffer(qkvSize * 4, vData);
      const bufOut = createStorageBuffer(qkvSize * 4);
      const bufScores = createStorageBuffer(scoresSize * 4);

      const uniformData = new ArrayBuffer(16);
      const uv = new Uint32Array(uniformData);
      const fv = new Float32Array(uniformData);
      uv[0] = batch; uv[1] = seq; uv[2] = dim;
      fv[3] = scale;
      const uBuf = createUniformBuffer(uniformData);

      const bindGroup = device.createBindGroup({
        layout,
        entries: [
          { binding: 0, resource: { buffer: uBuf } },
          { binding: 1, resource: { buffer: bufQ } },
          { binding: 2, resource: { buffer: bufK } },
          { binding: 3, resource: { buffer: bufV } },
          { binding: 4, resource: { buffer: bufOut } },
          { binding: 5, resource: { buffer: bufScores } },
        ],
      });

      const timing = await timeExecution(() => {
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.dispatchWorkgroups(batch);
        pass.end();
        device.queue.submit([encoder.finish()]);
      }, seq <= 256 ? 30 : 10);

      // Verify output is finite
      const gpuResult = await readbackBuffer(bufOut, qkvSize * 4);
      let allFinite = true;
      for (let i = 0; i < qkvSize; i++) {
        if (!isFinite(gpuResult[i])) {
          allFinite = false;
          break;
        }
      }

      const flops = 2 * batch * seq * seq * dim + 2 * batch * seq * seq + 2 * batch * seq * seq * dim;
      const gflops = flops / (timing.avgMs / 1000) / 1e9;

      results.push({
        id: `attention_${t.name}`,
        name: 'Attention',
        inputSize: t.name,
        executionTimeMs: timing.avgMs,
        throughput: `${gflops.toFixed(2)} GFLOPS`,
        memoryBytes: (qkvSize * 3 + qkvSize + scoresSize) * 4,
        success: allFinite,
        gpuTimingAvailable: true,
        details: {
          batch, seq, dim,
          scale,
          qkvBytes: qkvSize * 4,
          scoresBytes: scoresSize * 4,
          flops,
          gflops,
          iterations: timing.iterations,
          minMs: timing.minMs,
          maxMs: timing.maxMs,
          p50Ms: timing.p50Ms,
          outputFinite: allFinite ? 'YES' : 'NO',
        },
      });

      bufQ.destroy();
      bufK.destroy();
      bufV.destroy();
      bufOut.destroy();
      bufScores.destroy();
      uBuf.destroy();
    } catch (e) {
      results.push({
        id: `attention_${t.name}`,
        name: 'Attention',
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
