// AETHER GPU Benchmark — Benchmark 8: Sustained Load
// Run a controlled GPU workload continuously for 30s, 60s, 180s
// Record measurements every second

import {
  getDevice, createUniformBuffer, createStorageBuffer,
  createPipeline, timeExecution, formatBytes,
  type BenchmarkResult,
} from './engine';
import { MATMUL } from './kernels';
import { MATMUL_BINDINGS } from './bindings';

interface SustainedSample {
  second: number;
  avgMs: number;
  gflops: number;
}

export interface SustainedResult extends BenchmarkResult {
  samples: SustainedSample[];
  thermalThrottling: boolean;
  avgGflops: number;
  durationSeconds: number;
}

const DURATIONS = [30, 60, 180];

export async function benchmarkSustained(
  onProgress?: (pct: number, msg: string) => void
): Promise<SustainedResult[]> {
  const device = getDevice();
  const results: SustainedResult[] = [];

  // Use 256×256 matmul as the sustained workload
  const N = 256;
  const M = N, K = N;
  const flops = 2 * M * N * K;

  const pipeline = createPipeline(MATMUL, MATMUL_BINDINGS);
  const layout = pipeline.getBindGroupLayout(0);

  const aData = new Float32Array(M * K).fill(1.0);
  const bData = new Float32Array(K * N).fill(0.5);

  const bufA = createStorageBuffer(M * K * 4, aData);
  const bufB = createStorageBuffer(K * N * 4, bData);
  const bufC = createStorageBuffer(M * N * 4);

  const uniformData = new ArrayBuffer(12);
  const uv = new Uint32Array(uniformData);
  uv[0] = M; uv[1] = N; uv[2] = K;
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

  const wgX = Math.ceil(M / 16);
  const wgY = Math.ceil(N / 16);

  function dispatch() {
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(wgX, wgY);
    pass.end();
    device.queue.submit([encoder.finish()]);
  }

  for (const duration of DURATIONS) {
    try {
      onProgress?.(0, `Starting ${duration}s sustained test...`);

      const samples: SustainedSample[] = [];
      const startTime = performance.now();
      let lastSampleTime = startTime;
      let secondIdx = 0;

      // Warmup
      for (let i = 0; i < 5; i++) {
        dispatch();
        await device.queue.onSubmittedWorkDone();
      }

      while (true) {
        const elapsed = (performance.now() - startTime) / 1000;
        if (elapsed >= duration) break;

        // Measure 1 second of work
        const secStart = performance.now();
        let ops = 0;
        while (true) {
          const now = performance.now();
          if (now - secStart >= 1000) break;

          dispatch();
          await device.queue.onSubmittedWorkDone();
          ops++;
        }
        const secEnd = performance.now();
        const secElapsed = (secEnd - secStart) / 1000;

        const avgMs = (secElapsed / ops) * 1000;
        const gflops = (flops * ops) / (secElapsed * 1e9);

        samples.push({ second: secondIdx, avgMs, gflops });
        secondIdx++;

        const pct = Math.min((elapsed / duration) * 100, 100);
        onProgress?.(pct, `${duration}s test: ${Math.floor(elapsed)}s / ${duration}s — ${gflops.toFixed(1)} GFLOPS`);
      }

      // Detect thermal throttling: compare first 10s avg to last 10s avg
      const first10 = samples.slice(0, 10);
      const last10 = samples.slice(-10);
      const avgFirst = first10.reduce((a, b) => a + b.gflops, 0) / first10.length;
      const avgLast = last10.reduce((a, b) => a + b.gflops, 0) / last10.length;
      const thermalThrottling = avgLast < avgFirst * 0.85; // >15% drop

      const avgGflops = samples.reduce((a, b) => a + b.gflops, 0) / samples.length;

      results.push({
        id: `sustained_${duration}s`,
        name: `Sustained Load ${duration}s`,
        inputSize: `${N}×${N} matmul`,
        executionTimeMs: samples.reduce((a, b) => a + b.avgMs, 0) / samples.length,
        throughput: `${avgGflops.toFixed(1)} GFLOPS avg`,
        memoryBytes: (M * K + K * N + M * N) * 4,
        success: true,
        gpuTimingAvailable: true,
        samples,
        thermalThrottling,
        avgGflops,
        durationSeconds: duration,
        details: {
          duration,
          totalSamples: samples.length,
          avgGflops,
          minGflops: Math.min(...samples.map(s => s.gflops)),
          maxGflops: Math.max(...samples.map(s => s.gflops)),
          first10sAvg: avgFirst,
          last10sAvg: avgLast,
          throttled: thermalThrottling ? 'YES' : 'NO',
          dropPct: ((1 - avgLast / avgFirst) * 100).toFixed(1) + '%',
        },
      });

      onProgress?.(100, `${duration}s test complete — ${avgGflops.toFixed(1)} GFLOPS avg`);

      // Cool down between tests
      if (duration !== DURATIONS[DURATIONS.length - 1]) {
        onProgress?.(-1, 'Cooling down 10s before next test...');
        await new Promise(r => setTimeout(r, 10000));
      }
    } catch (e) {
      results.push({
        id: `sustained_${duration}s`,
        name: `Sustained Load ${duration}s`,
        inputSize: `${N}×${N} matmul`,
        executionTimeMs: 0,
        throughput: 'N/A',
        memoryBytes: 0,
        success: false,
        error: (e as Error).message,
        gpuTimingAvailable: false,
        samples: [],
        thermalThrottling: false,
        avgGflops: 0,
        durationSeconds: duration,
      });
    }
  }

  bufA.destroy();
  bufB.destroy();
  bufC.destroy();
  uBuf.destroy();

  return results;
}
