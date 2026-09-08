// AETHER GPU Benchmark — Attention phase harness (TASK 3/5/20/24)
//
// Orchestrates the strict correctness-before-performance pipeline for the phase
// benchmark:
//   1. runAttentionPhaseCorrectness() — fresh CORRECTNESS context, full-output
//      readbacks only, never touches TimingManager. Context destroyed after.
//   2. measureAttentionPhases() — fresh BENCHMARK context created *after* the
//      correctness context is destroyed; timing via 4-byte CompletionToken,
//      zero full-output readbacks.
//   3. runAttentionPhaseBenchmark() — GATES performance on correctness with the
//      TASK 5 abort message before any benchmark context exists.
//   4. runCriticalIsolation(seq) — TASK 24 A/B/C/D sequence, stop at first fail.
//   5. harnessDebugReport() — feeds the TASK 22 developer panel.

import { TimingManager } from './timing.ts';
import { getDevice, getDeviceLostInfo, hasDeviceLost } from './engine.ts';
import { harnessCounters } from './harness-counters.ts';
import {
  runAttentionPhaseCorrectness,
  attentionPhaseSamples,
  createBenchmarkAttentionContext,
  measureAttentionPhasePerformance,
  destroyAttentionContext,
  attentionContextTrace,
  type PhaseCorrectnessReport,
  type AttentionContextTraceEntry,
} from './perf-kernels.ts';
import type { PerfSample } from './perf-report.ts';
import { runFullIsolatedPhase } from './phase-softmax-isolated.ts';

export interface AttentionPhaseBenchmarkResult {
  seq: number;
  dim: number;
  iterations: number;
  correctness: PhaseCorrectnessReport;
  samples: PerfSample[];
}

/**
 * End-to-end phase benchmark for one seq. Hard-gated: any phase correctness
 * failure aborts with the TASK 5 message and NO benchmark context is created.
 * Correctness and performance each use their own freshly-created context.
 */
export async function runAttentionPhaseBenchmark(seq: number, dim = 64, iterations = 5): Promise<AttentionPhaseBenchmarkResult> {
  let tm: TimingManager;
  try {
    tm = new TimingManager(getDevice());
  } catch {
    throw new Error(`Attention phase benchmark FAIL [seq=${seq}] — no GPU device.`);
  }
  try {
    let correctness: PhaseCorrectnessReport;
    try {
      correctness = await runAttentionPhaseCorrectness(seq, dim, 1);
    } catch (err) {
      throw new Error(`Attention phase correctness failed — fix correctness before benchmarking. ${(err as Error).message}`);
    }
    // Performance runs against a FRESH benchmark context created only after the
    // correctness context above was destroyed; timing uses CompletionToken only.
    const ctx = await createBenchmarkAttentionContext(seq, dim, 1);
    try {
      const samples = await attentionPhaseSamples(tm, ctx, iterations);
      return { seq, dim, iterations, correctness, samples };
    } finally {
      destroyAttentionContext(ctx);
    }
  } finally {
    tm.destroy();
  }
}

export async function runPhaseBenchmarkSeries(seqs: number[] = [4, 16, 64, 128, 256], iterations = 5): Promise<AttentionPhaseBenchmarkResult[]> {
  const out: AttentionPhaseBenchmarkResult[] = [];
  for (const seq of seqs) {
    out.push(await runAttentionPhaseBenchmark(seq, 64, iterations));
  }
  return out;
}

export interface CriticalIsolationStep {
  step: 'A' | 'B' | 'C' | 'D';
  label: string;
  ok: boolean;
  details: string;
}

/**
 * TASK 24 critical isolation at seq=256, stopping at the first failing step:
 *   A — truly isolated phase correctness (no harness at all)
 *   B — fresh-context phase correctness through the harness path
 *   C — warmup-only (3 real submissions, zero measurements)
 *   D — full benchmark at 5 iterations
 */
export async function runCriticalIsolation(seq = 256): Promise<CriticalIsolationStep[]> {
  const out: CriticalIsolationStep[] = [];

  // A
  try {
    const reports = await runFullIsolatedPhase([seq], 64, 1);
    const r = reports[0];
    const ok = !!(r && r.manager.qkt.pass && r.manager.softmax?.pass && r.direct.qkt.pass && r.direct.softmax?.pass);
    out.push({ step: 'A', label: 'isolated phase correctness (manager + direct)', ok, details: r ? `overall=${r.overall} manager=${r.manager.softmax?.pass ?? false} direct=${r.direct.softmax?.pass ?? false}` : 'no report' });
    if (!ok) return out;
  } catch (err) {
    out.push({ step: 'A', label: 'isolated phase correctness (manager + direct)', ok: false, details: String((err as Error).message) });
    return out;
  }

  // B
  try {
    const rep = await runAttentionPhaseCorrectness(seq, 64, 1);
    out.push({
      step: 'B',
      label: 'fresh-context phase correctness',
      ok: true,
      details: `qktMaxErr=${rep.maxErrs.qkt.toExponential(2)} softMaxErr=${rep.maxErrs.soft.toExponential(2)} pvMaxErr=${rep.maxErrs.pv.toExponential(2)} rowSumDev=${rep.rowSumMaxDev.toExponential(3)}`,
    });
  } catch (err) {
    out.push({ step: 'B', label: 'fresh-context phase correctness', ok: false, details: String((err as Error).message) });
    return out;
  }

  // C — warmup-only across a fresh benchmark context; 0 measured iterations.
  const warmupBefore = harnessCounters.snapshot();
  let tm: TimingManager;
  try {
    tm = new TimingManager(getDevice());
  } catch (err) {
    out.push({ step: 'C', label: 'warmup-only (3 real submissions)', ok: false, details: `no device: ${(err as Error).message}` });
    return out;
  }
  try {
    const ctx = await createBenchmarkAttentionContext(seq, 64, 1);
    try {
      const warm = await measureAttentionPhasePerformance(tm, ctx, 'qkt', 0);
      const warmupDelta = harnessCounters.snapshot().warmupSubmissions - warmupBefore.warmupSubmissions;
      const ok = warm.warmup === 3 && warmupDelta === 3;
      out.push({ step: 'C', label: 'warmup-only (3 real submissions)', ok, details: `warmup=${warm.warmup} iterations=${warm.iterations} warmupSubmissionsDelta=${warmupDelta}` });
      if (!ok) return out;
    } finally {
      destroyAttentionContext(ctx);
    }
  } catch (err) {
    out.push({ step: 'C', label: 'warmup-only (3 real submissions)', ok: false, details: String((err as Error).message) });
    return out;
  } finally {
    tm.destroy();
  }

  // D — full 5-iteration benchmark.
  try {
    const res = await runAttentionPhaseBenchmark(seq, 64, 5);
    out.push({ step: 'D', label: 'benchmark (5 iterations / phase)', ok: true, details: `samples=${res.samples.length} qkt=${res.samples[0]?.medianMs.toFixed(3) ?? 'n/a'}ms` });
  } catch (err) {
    out.push({ step: 'D', label: 'benchmark (5 iterations / phase)', ok: false, details: String((err as Error).message) });
  }
  return out;
}

/** Human-readable harness state for the TASK 22 developer panel. */
export function harnessDebugReport(): string {
  const s = harnessCounters.snapshot();
  const trace = attentionContextTrace();
  const lost = hasDeviceLost();
  const lostInfo = getDeviceLostInfo();
  const correctnessCtx = trace.filter((t) => t.kind === 'correctness');
  const benchmarkCtx = trace.filter((t) => t.kind === 'benchmark');
  const allDestroyed = correctnessCtx.every((t) => t.destroyed) && benchmarkCtx.every((t) => t.destroyed);
  const distinct = correctnessCtx.length > 0 && benchmarkCtx.length > 0 && Math.max(...correctnessCtx.map((t) => t.id)) < Math.min(...benchmarkCtx.map((t) => t.id));
  const lines = [
    '— AETHER Harness Debug Panel —',
    `commandBuffers: created=${s.commandBuffersCreated} submitted=${s.commandBuffersSubmitted}`,
    `submissions: warmup=${s.warmupSubmissions} measurement=${s.measurementSubmissions} sync=${s.syncSubmissions}`,
    `completion reads: ${s.completionReads}`,
    `full-tensor readbacks: ${s.readbackOperations}`,
    `mapAsync overlap: ${s.mapOverlapDetected ? 'YES (BUG)' : 'NO'}`,
    `correctness contexts: ${correctnessCtx.length} (ids ${correctnessCtx.map((t) => t.id).join(',') || 'none'})`,
    `benchmark contexts: ${benchmarkCtx.length} (ids ${benchmarkCtx.map((t) => t.id).join(',') || 'none'})`,
    `all contexts destroyed: ${allDestroyed}`,
    `correctness destroyed before benchmark: ${distinct}`,
    `device lost: ${lost ? 'YES' : 'NO'} (${lostInfo.reason ?? '-'}/${lostInfo.message ?? '-'})`,
  ];
  return lines.join('\n');
}

export type { AttentionContextTraceEntry };