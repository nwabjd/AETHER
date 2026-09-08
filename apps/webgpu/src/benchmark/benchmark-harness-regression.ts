// AETHER GPU Benchmark — Harness regression (TASK 20)
//
// Proves the benchmark harness behaves correctly on-device:
//   1. TimingManager warmup actually submits real command buffers.
//   2. Phase benchmark is gated on correctness before any timing.
//   3. No full-tensor readback happens during timing iterations.
//   4. Timing completion uses the 4-byte CompletionToken.
//   5. Measurement iterations are individually submitted.
//   6. mapAsync never overlaps.
//   7. The device is not lost.
// Plus the fresh-context contract (correctness ctx destroyed before the
// benchmark ctx exists, ids distinct).

import { TimingManager } from './timing.ts';
import { getDevice, hasDeviceLost, getDeviceLostInfo } from './engine.ts';
import { harnessCounters } from './harness-counters.ts';
import {
  runAttentionPhaseCorrectness,
  attentionPhaseSamples,
  createBenchmarkAttentionContext,
  destroyAttentionContext,
  attentionContextTrace,
} from './perf-kernels.ts';
import type { PerfSample } from './perf-report.ts';

export interface HarnessRegressionCheck {
  name: string;
  ok: boolean;
  detail: string;
}

export interface HarnessRegressionResult {
  passed: boolean;
  checks: HarnessRegressionCheck[];
}

export async function runHarnessRegression(seq = 4, iterations = 3): Promise<HarnessRegressionResult> {
  const checks: HarnessRegressionCheck[] = [];
  if (!getDevice()) {
    checks.push({ name: 'GPU device available', ok: false, detail: 'no GPU device' });
  }

  harnessCounters.reset();
  const traceBaseline = attentionContextTrace();
  let tm: TimingManager;
  try {
    tm = new TimingManager(getDevice());
  } catch (err) {
    checks.push({ name: 'TimingManager constructs', ok: false, detail: String((err as Error).message) });
    return { passed: false, checks };
  }

  try {
    // Window 1 — CORRECTNESS (fresh correctness context, full-output readbacks are expected).
    const c0 = harnessCounters.snapshot();
    let correctness;
    try {
      correctness = await runAttentionPhaseCorrectness(seq, 64, 1);
    } catch (err) {
      throw new Error(`Attention phase correctness failed — fix correctness before benchmarking. ${(err as Error).message}`);
    }
    const c1 = harnessCounters.snapshot();
    const correctnessReadbacks = c1.readbackOperations - c0.readbackOperations;
    checks.push({ name: 'Correctness reads full outputs', ok: correctnessReadbacks >= 6, detail: `readbackOperations delta=${correctnessReadbacks}` });
    checks.push({
      name: 'Gated on correctness',
      ok: correctness.maxErrs.qkt < 1e-2 && correctness.maxErrs.soft < 1e-2 && correctness.maxErrs.pv < 1e-2,
      detail: `qkt=${correctness.maxErrs.qkt.toExponential(2)} soft=${correctness.maxErrs.soft.toExponential(2)} pv=${correctness.maxErrs.pv.toExponential(2)}`,
    });

    // Window 2 — PERFORMANCE (fresh benchmark context; ONLY completion-token waits).
    const b0 = harnessCounters.snapshot();
    const ctx = await createBenchmarkAttentionContext(seq, 64, 1);
    let samples: PerfSample[] = [];
    try {
      samples = await attentionPhaseSamples(tm, ctx, iterations);
    } finally {
      destroyAttentionContext(ctx);
    }
    const b1 = harnessCounters.snapshot();
    const perfReadbacks = b1.readbackOperations - b0.readbackOperations;
    const deltaMeas = b1.measurementSubmissions - b0.measurementSubmissions;
    const deltaWarm = b1.warmupSubmissions - b0.warmupSubmissions;
    const deltaCompletion = b1.completionReads - b0.completionReads;

    checks.push({ name: 'Phase benchmark completes', ok: samples.length === 3, detail: `samples=${samples.length} (expect 3: qkt/softmax/pv)` });
    checks.push({ name: 'Warmup actually submitted', ok: deltaWarm >= 3, detail: `warmupSubmissions delta=${deltaWarm} (3/phase)` });
    checks.push({ name: 'No full-tensor readback during timing', ok: perfReadbacks === 0, detail: `readbackOperations delta=${perfReadbacks}` });
    checks.push({ name: 'Completion token used for timing', ok: deltaCompletion > 0, detail: `completionReads delta=${deltaCompletion}` });
    checks.push({ name: 'Measurement iterations submitted', ok: deltaMeas === samples.reduce((a, x) => a + x.iterations, 0), detail: `measurementSubmissions delta=${deltaMeas} (samples total ${samples.reduce((a, x) => a + x.iterations, 0)})` });
    checks.push({ name: 'mapAsync never overlaps', ok: !b1.mapOverlapDetected, detail: `mapOverlapDetected=${b1.mapOverlapDetected}` });
    checks.push({ name: 'Device not lost', ok: !hasDeviceLost() && getDeviceLostInfo().reason === null, detail: `lost=${hasDeviceLost()} reason=${getDeviceLostInfo().reason ?? '-'}` });

    // Fresh-context contract: correctness context ids exist, benchmark context
    // ids exist, all destroyed, and every correctness id < every benchmark id.
    const trace = attentionContextTrace().slice(traceBaseline.length);
    const correctnessIds = trace.filter((t) => t.kind === 'correctness').map((t) => t.id);
    const benchmarkIds = trace.filter((t) => t.kind === 'benchmark').map((t) => t.id);
    const allDestroyed = trace.every((t) => t.destroyed);
    const distinct = correctnessIds.length > 0 && benchmarkIds.length > 0 && Math.max(...correctnessIds) < Math.min(...benchmarkIds);
    checks.push({
      name: 'Fresh contexts: correctness destroyed before benchmark',
      ok: allDestroyed && distinct,
      detail: `correctness ids=[${correctnessIds.join(',')}] benchmark ids=[${benchmarkIds.join(',')}] allDestroyed=${allDestroyed}`,
    });
  } catch (err) {
    checks.push({ name: 'Phase benchmark completes', ok: false, detail: String((err as Error).message) });
  } finally {
    tm.destroy();
  }

  return { passed: checks.every((c) => c.ok), checks };
}

export function formatHarnessRegression(result: HarnessRegressionResult): string {
  const lines = ['— Harness Regression —', `RESULT: ${result.passed ? 'PASS' : 'FAIL'}`];
  for (const c of result.checks) lines.push(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}: ${c.detail}`);
  return lines.join('\n');
}