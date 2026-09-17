// G5 controlled-repetition classifier + aggregator (pure logic, no browser I/O).
//
// The browser repeatedly runs the FULL V3.1.3 benchmark. Each repetition leaves
// a ForensicRunRecord in localStorage. This module:
//   - verifies each run against the G5 success criteria,
//   - classifies failures along the A–G ladder,
//   - aggregates a campaign into the summary consumed by g5-results.json +
//     G5_REPORT.md.
//
// It is kept free of DOM/globalThis so it can be unit-tested deterministically.

export interface MilestoneLike {
  t: string;
  state: string;
}

export interface RecordLike {
  runId: string;
  status: string;
  startedAt: string;
  lastUpdatedAt: string;
  lastHeartbeat: string | null;
  finishedAt: string | null;
  currentPhase: string | null;
  currentCategory: string | null;
  completedCategories: string[];
  lastMilestone: string | null;
  milestones?: MilestoneLike[];
  interruption: { kind: string; reason: string; error: string | null; stack: string | null; at: string } | null;
  deviceHealth: { lost: boolean; reason?: string; message?: string } | null;
  error: string | null;
  persistenceFailures: number;
}

export const G5_RUNGS = [128, 256, 512, 768, 1024, 1536, 2048];
export const REQUIRED_CATEGORIES = ['quantizedMatmul', 'decodeAttention', 'transformerBlocks', 'memoryBudget', 'attention'];
export const EXECUTED_SIZES = ['0.5B', '1B'];
export const GUARD_BLOCKED_SIZES = ['1.5B', '3B', '7B'];

export interface RungVerification {
  mb: number;
  enter: boolean;
  enterIndex: number;
  checkpointed: boolean;
  checkpointedIndex: number;
  orderOk: boolean; // enter present AND before checkpointed
  complete: boolean; // enter && checkpointed && orderOk
}

export interface RunVerification {
  runId: string;
  ok: boolean;
  checks: {
    statusCompleted: boolean;
    allCategories: boolean;
    interruptionNull: boolean;
    errorNull: boolean;
    deviceNotLost: boolean;
    persistenceFailuresZero: boolean;
    allRungsComplete: boolean;
    transformerSignatureOk: boolean;
    finalCompletion: boolean;
  };
  rungs: RungVerification[];
  transformer: {
    executed: string[];
    guardBlocked: string[];
    guardBehaviorChanged: boolean;
  };
  guardBehaviorChanged: boolean;
  failureLadder: string | null; // A–G letter or null when ok
  failureKind: string | null;
  failureWindow: string | null;   // e.g. the last milestone before death
  failureSignature: string | null; // composite for reproducibility matching
  anyGuardBlockMilestone: boolean;
}

export function milestoneStates(rec: RecordLike): string[] {
  return (rec.milestones ?? []).map((m) => m.state);
}

/** Rungs are recorded as `MEMORY_BUDGET <N>MB ENTER` / `MEMORY_BUDGET <N>MB CHECKPOINTED`. */
export function verifyRungs(rec: RecordLike): RungVerification[] {
  const states = milestoneStates(rec);
  return G5_RUNGS.map((mb) => {
    const enterState = `MEMORY_BUDGET ${mb}MB ENTER`;
    const cpState = `MEMORY_BUDGET ${mb}MB CHECKPOINTED`;
    const enterIndex = states.indexOf(enterState);
    const cpIndex = states.indexOf(cpState);
    const enter = enterIndex >= 0;
    const checkpointed = cpIndex >= 0;
    const orderOk = enter && checkpointed && enterIndex < cpIndex;
    return { mb, enter, enterIndex, checkpointed, checkpointedIndex: cpIndex, orderOk, complete: enter && checkpointed && orderOk };
  });
}

export function verifyTransformer(rec: RecordLike): {
  executed: string[]; guardBlocked: string[]; guardBehaviorChanged: boolean;
} {
  const states = milestoneStates(rec);
  const executed = EXECUTED_SIZES.filter((s) =>
    states.some((st) => st.startsWith(`${s} `) && st.includes('GUARD_PASS')) &&
    states.includes(`${s} CHECKPOINTED`),
  );
  const guardBlocked = GUARD_BLOCKED_SIZES.filter((s) =>
    states.includes(`${s} GUARD_BLOCK CHECKPOINTED`) && states.includes(`${s} CHECKPOINTED`),
  );
  const guardBehaviorChanged = EXECUTED_SIZES.some((s) => states.includes(`${s} GUARD_BLOCK`)) ||
    GUARD_BLOCKED_SIZES.some((s) => states.some((st) => st.startsWith(`${s} `) && st.includes('GUARD_PASS')));
  return { executed, guardBlocked, guardBehaviorChanged };
}

/** The G5 A–G failure ladder (prompt §Failure Classification) evaluated purely. */
export function classifyFailure(rec: RecordLike): { ladder: string; kind: string; window: string | null; signature: string | null } {
  const states = milestoneStates(rec);
  const lastMs = states.length ? states[states.length - 1] : null;

  // A. Device loss
  if (rec.deviceHealth?.lost) {
    return { ladder: 'A', kind: 'WEBGPU_DEVICE_LOST', window: lastMs, signature: rec.status + '|DEVICE_LOST|' + (lastMs ?? 'NONE') };
  }
  const interKind = rec.interruption?.kind ?? null;
  if (interKind === 'WEBGPU_DEVICE_LOST') {
    return { ladder: 'A', kind: 'WEBGPU_DEVICE_LOST', window: lastMs, signature: rec.status + '|DEVICE_LOST|' + (lastMs ?? 'NONE') };
  }

  // B. Explicit guard abort → controlled, NOT a failure (only when the run
  // actually ended via a TRANSFORMER_SUITE_RESOURCE_LIMIT interruption; a
  // normal FULL completion legitimately contains GUARD_BLOCK milestones and
  // is a SUCCESS, never a failure).
  if (interKind === 'TRANSFORMER_SUITE_RESOURCE_LIMIT') {
    return { ladder: 'B', kind: 'TRANSFORMER_SUITE_RESOURCE_LIMIT', window: lastMs, signature: rec.status + '|GUARD_ABORT|' + (lastMs ?? 'NONE') };
  }

  // B0. Guard *behavior change* (previously-executed now blocked, or
  // previously-guarded now executing) → STOP CONDITION A mutation. Never a
  // benign abort.
  const trans = verifyTransformer(rec);
  if (trans.guardBehaviorChanged) {
    return { ladder: 'A2', kind: 'GUARD_BEHAVIOR_CHANGED', window: lastMs, signature: 'GUARD_BEHAVIOR_CHANGED' };
  }

  // C. Persistence failure
  if (rec.persistenceFailures > 0) {
    return { ladder: 'C', kind: 'PERSISTENCE_FAILURE', window: lastMs, signature: rec.status + '|PERSISTENCE|' + rec.persistenceFailures };
  }

  // D. Recorded runtime error
  if (interKind && ['JAVASCRIPT_EXCEPTION', 'GPU_VALIDATION_ERROR', 'RESOURCE_LIMIT', 'UNHANDLED_REJECTION', 'GPU_ERROR'].includes(interKind)) {
    return { ladder: 'D', kind: interKind, window: lastMs, signature: rec.status + '|' + interKind + '|' + (lastMs ?? 'NONE') };
  }
  if (rec.error && !rec.deviceHealth?.lost && interKind !== 'PAGE_TERMINATED_OR_BROWSER_RELOADED') {
    return { ladder: 'D', kind: 'RECORDED_RUNTIME_ERROR', window: lastMs, signature: rec.status + '|RUNTIME_ERROR|' + (lastMs ?? 'NONE') };
  }

  // E. Stall (no marching runtime present)
  if (rec.status === 'RUNNING') {
    return { ladder: 'E', kind: 'BENCHMARK_STALL', window: lastMs, signature: rec.status + '|STALL|' + (lastMs ?? 'NONE') };
  }

  // F. Page or browser terminated
  if (interKind === 'PAGE_TERMINATED_OR_BROWSER_RELOADED' || rec.status === 'INTERRUPTED') {
    return { ladder: 'F', kind: 'PAGE_OR_BROWSER_TERMINATED', window: lastMs, signature: rec.status + '|PAGE_TERMINATED|' + (lastMs ?? 'NONE') };
  }

  // G. Unknown
  return { ladder: 'G', kind: 'UNKNOWN_FAILURE', window: lastMs, signature: rec.status + '|UNKNOWN|' + (lastMs ?? 'NONE') };
}

/** Everything that must hold for one repetition to count as a full success. */
export function verifyRun(rec: RecordLike): RunVerification {
  const statusCompleted = rec.status === 'COMPLETED';
  const allCategories = REQUIRED_CATEGORIES.every((c) => (rec.completedCategories ?? []).includes(c));
  const interruptionNull = rec.interruption === null || rec.interruption === undefined;
  const errorNull = rec.error === null || rec.error === undefined;
  const deviceNotLost = !(rec.deviceHealth?.lost ?? false);
  const persistenceFailuresZero = rec.persistenceFailures === 0;
  const rungs = verifyRungs(rec);
  const allRungsComplete = rungs.every((r) => r.complete);
  const transformer = verifyTransformer(rec);
  const transformerSignatureOk =
    EXECUTED_SIZES.every((s) => transformer.executed.includes(s)) &&
    GUARD_BLOCKED_SIZES.every((s) => transformer.guardBlocked.includes(s)) &&
    !transformer.guardBehaviorChanged;
  const finalCompletion = statusCompleted && !!rec.finishedAt;

  const ok = statusCompleted && allCategories && interruptionNull && errorNull && deviceNotLost &&
    persistenceFailuresZero && allRungsComplete && transformerSignatureOk && finalCompletion;

  let failureLadder: string | null = null;
  let failureKind: string | null = null;
  let failureWindow: string | null = null;
  let failureSignature: string | null = null;
  if (!ok) {
    const f = classifyFailure(rec);
    failureLadder = f.ladder;
    failureKind = f.kind;
    failureWindow = f.window;
    failureSignature = f.signature;
  }

  const anyGuardBlockMilestone = milestoneStates(rec).some((s) => s.includes('GUARD_BLOCK'));

  return {
    runId: rec.runId,
    ok,
    checks: {
      statusCompleted, allCategories, interruptionNull, errorNull, deviceNotLost,
      persistenceFailuresZero, allRungsComplete, transformerSignatureOk, finalCompletion,
    },
    rungs,
    transformer,
    guardBehaviorChanged: transformer.guardBehaviorChanged,
    failureLadder,
    failureKind,
    failureWindow,
    failureSignature,
    anyGuardBlockMilestone,
  };
}

/** Consistency rule: a previously-guarded model must stay guarded (FULL path). */
export function guardConsistencyOk(ver: RunVerification): boolean {
  return GUARD_BLOCKED_SIZES.every((s) => ver.transformer.guardBlocked.includes(s)) && !ver.transformer.guardBehaviorChanged;
}

// ─── Campaign aggregation ────────────────────────────────────────────────

export interface CampaignMoment {
  t: string;
  runCount: number;
  okCount: number;
}

/** Duration of a completed run in ms from its forensic timestamps. */
export function durationMs(rec: RecordLike): number | null {
  if (!rec.startedAt || !rec.finishedAt) return null;
  const s = new Date(rec.startedAt).getTime();
  const f = new Date(rec.finishedAt).getTime();
  if (!isFinite(s) || !isFinite(f)) return null;
  return Math.max(f - s, 0);
}

export function median(nums: number[]): number | null {
  if (!nums.length) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export interface CampaignSummary {
  attempted: number;
  completed: number;
  interrupted: number;
  ok: number;
  okRate: number; // ok/attempted
  durationsMs: { min: number | null; median: number | null; mean: number | null; max: number | null; count: number };
  perRungMs: { mb: number; min: number | null; median: number | null; mean: number | null; max: number | null; count: number }[];
  failures: { index: number; runId: string; ladder: string; kind: string; window: string | null; signature: string | null }[];
  reproducibleFailure: boolean;
  reproducibleSignature: string | null;
}

export function aggregateCampaign(records: RecordLike[], runIndexHint?: Map<string, number>): CampaignSummary {
  const statuses = records.map((r) => r.status);
  const attempted = records.length;
  const completed = statuses.filter((s) => s === 'COMPLETED').length;
  const interrupted = statuses.filter((s) => s === 'INTERRUPTED').length;
  const verified = records.map(verifyRun);
  const ok = verified.filter((v) => v.ok).length;
  const okRate = attempted ? ok / attempted : 0;

  const durations = records.map(durationMs).filter((d): d is number => d !== null);
  const mean = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : null;

  const perRungAgg = G5_RUNGS.map((mb) => {
    const samples: number[] = [];
    for (const rec of records) {
      const states = milestoneStates(rec);
      const enter = states.findIndex((s) => s === `MEMORY_BUDGET ${mb}MB ENTER`);
      const cp = states.findIndex((s) => s === `MEMORY_BUDGET ${mb}MB CHECKPOINTED`);
      if (enter >= 0 && cp > enter) {
        const t0 = new Date((rec.milestones ?? [])[enter].t).getTime();
        const t1 = new Date((rec.milestones ?? [])[cp].t).getTime();
        if (isFinite(t0) && isFinite(t1)) samples.push(Math.max(t1 - t0, 0));
      }
    }
    const m = median(samples);
    const me = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : null;
    return { mb, min: samples.length ? Math.min(...samples) : null, median: m, mean: me, max: samples.length ? Math.max(...samples) : null, count: samples.length };
  });

  const failures = verified.map((v, i) => ({ index: i + 1, runId: records[i].runId, ladder: v.failureLadder, kind: v.failureKind, window: v.failureWindow, signature: v.failureSignature }))
    .filter((f) => f.ladder !== null)

  const bySig = new Map<string, number>();
  for (const f of failures) if (f.signature) bySig.set(f.signature, (bySig.get(f.signature) ?? 0) + 1);
  const dup = [...bySig.entries()].filter(([, n]) => n >= 2).map(([s]) => s);
  const reproducibleFailure = dup.length > 0;
  const reproducibleSignature = dup.length ? dup[0] : null;

  return {
    attempted, completed, interrupted, ok, okRate,
    durationsMs: { min: durations.length ? Math.min(...durations) : null, median: median(durations), mean, max: durations.length ? Math.max(...durations) : null, count: durations.length },
    perRungMs: perRungAgg,
    failures,
    reproducibleFailure,
    reproducibleSignature,
  };
}