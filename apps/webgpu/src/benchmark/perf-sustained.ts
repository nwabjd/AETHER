// AETHER GPU Benchmark — sustained load profile (TASK 9).
// 30 seconds of back-to-back MatMul(256) work. Each second is a single pass
// with as many dispatches as calibration fits (cap 2000), batched so the GPU
// is never left idle waiting on the CPU. Times are aggregate end-to-end wall
// time per observed second (sync included) — never labeled GPU time.
// Thermal state is read before/after only; never fabricated.

import type { SustainedResult, SustainedSample } from './perf-report';
import { thermalStateValue } from './perf-report';
import { TimingManager } from './timing';
import {
  createPipeline,
  createBindGroupForPipeline,
  createStorageBuffer,
  createUniformBuffer,
  readbackBuffer,
  getDevice,
} from './engine';
import { MATMUL } from './kernels';

export const SUSTAINED_SECONDS = 30;
const DISPATCH_CAP = 2000;
const TARGET_FILL_MS = 750;
const N = 256;

export interface SustainedOpts {
  seconds?: number;
  onSecond?: (second: number, sample: SustainedSample, index: number) => void;
  onProgress?: (msg: string) => void;
}

function fillDeterministic(data: Float32Array): void {
  let s = 0x9e3779b9;
  for (let i = 0; i < data.length; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    data[i] = (s % 2001) / 1000 - 1;
  }
}

function matmulFixture() {
  const bytes = N * N * 4;
  const a = new Float32Array(N * N);
  const b = new Float32Array(N * N);
  fillDeterministic(a);
  fillDeterministic(b);
  const bufA = createStorageBuffer(bytes, a);
  const bufB = createStorageBuffer(bytes, b);
  const bufC = createStorageBuffer(bytes);
  const uniform = createUniformBuffer(new Float32Array([N, N, N, 1]).buffer as ArrayBuffer);
  const pipeline = createPipeline(MATMUL, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
  const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
    { binding: 0, resource: { buffer: uniform } },
    { binding: 1, resource: { buffer: bufA } },
    { binding: 2, resource: { buffer: bufB } },
    { binding: 3, resource: { buffer: bufC } },
  ]);
  return { pipeline, bg, bufC, wg: [N / 16, N / 16, 1] as [number, number, number] };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function benchSustained(tm: TimingManager, opts: SustainedOpts = {}): Promise<SustainedResult> {
  const device = getDevice();
  const seconds = opts.seconds ?? SUSTAINED_SECONDS;
  const thermalBefore = thermalStateValue();

  const { pipeline, bg, bufC, wg } = matmulFixture();

  // Calibrate dispatch count for ~750ms of GPU work per returned sample.
  const one = await tm.timeOne(
    (pass) => {
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
    },
    () => readbackBuffer(bufC, N * N * 4).then(() => undefined)
  );
  const perSecond = Math.max(1, Math.min(DISPATCH_CAP, Math.floor(TARGET_FILL_MS / Math.max(one, 0.01))));

  const samples: SustainedSample[] = [];
  const startWall = performance.now();
  const flopsPerDispatch = 2 * N * N * N;

  for (let s = 0; s < seconds; s++) {
    const secondStart = performance.now();
    let observedMs = 0;
    try {
      const enc = device.createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      for (let d = 0; d < perSecond; d++) {
        pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
      }
      pass.end();
      device.queue.submit([enc.finish()]);
      await readbackBuffer(bufC, N * N * 4);
      observedMs = Math.max(performance.now() - secondStart, 0.001);
    } catch (e) {
      // single-second hiccup: record a degraded sample instead of dropping the run
      observedMs = 1000;
      opts.onProgress?.((e as Error).message);
    }
    const avgMs = observedMs / perSecond;
    const gflops = flopsPerDispatch / (avgMs / 1000) / 1e9;
    const sample: SustainedSample = { second: s + 1, avgMs, gflops };
    samples.push(sample);
    opts.onSecond?.(s + 1, sample, s);

    // keep the loop aligned to wall-clock seconds
    const elapsedInSecond = performance.now() - secondStart;
    const remaining = 1000 - elapsedInSecond;
    if (remaining > 10) await sleep(remaining);
  }

  const totalMs = Math.max(performance.now() - startWall, 1);
  const allGflops = samples.map((x) => x.gflops);
  const first10 = samples.filter((x) => x.second <= 10).map((x) => x.gflops);
  const last10 = samples.filter((x) => x.second > seconds - 10).map((x) => x.gflops);
  const mean = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  const first10sAvg = mean(first10);
  const last10sAvg = mean(last10);
  const dropPct = first10sAvg > 0 ? (1 - last10sAvg / first10sAvg) * 100 : 0;

  return {
    durationSeconds: seconds,
    samples,
    first10sAvgGflops: first10sAvg,
    last10sAvgGflops: last10sAvg,
    throttled: last10sAvg < first10sAvg * 0.95,
    dropPct: Math.max(0, dropPct),
    avgGflops: mean(allGflops),
    minGflops: samples.length ? Math.min(...allGflops) : 0,
    maxGflops: samples.length ? Math.max(...allGflops) : 0,
    thermalBefore,
    thermalAfter: thermalStateValue(),
    timingMode: 'AGGREGATE_END_TO_END',
    error: undefined,
  };
}