// AETHER V3.1.3 — Unified Persisted-Interruption Classifier (shared, pure)
//
// Single source of truth for deciding HOW a previous V3.1 run ended from
// *durable* evidence only. Every consumer of interruption classification
// delegates here and passes the SAME evidence shape, so the resume banner
// (crash-safety classifies a pending checkpoint), the startup/orphan recovery
// path (forensic-history classifies a stale RUNNING archive record), the
// personal persistent archive, and the #forensics viewer can never disagree
// about the same evidence again.
//
// Isolation rules:
//   - This module is PURE and side-effect free. No storage, no globals, no
//     device access — classification cannot hide a crash or touch state.
//   - It imports NOTHING from crash-safety or forensic-history (both import
//     this module), so there is no import cycle and no way for classification
//     to drag in benchmark machinery.
//   - Historical truth is preserved: when a run already has a persisted
//     interruption it is returned verbatim; nothing is fabricated or upgraded.
//
// The kind strings returned here MUST stay in sync with `InterruptionKind`
// in crash-safety.ts (the authoritative union type). This module keeps the
// shared decision logic; crash-safety owns the type.

export interface EvidenceInterruption {
  kind?: string;
  reason?: string;
  error?: string | null;
  stack?: string | null;
  at?: string;
}

export interface EvidenceDeviceHealth {
  lost?: boolean;
  reason?: string;
  message?: string;
}

export interface EvidenceRuntimeError {
  error?: string | null;
  stack?: string | null;
  timestamp?: string;
}

/**
 * The full durable evidence a classifier may consult. `status` is the run
 * status observed at the moment classification happens; `at` is a fallback
 * timestamp used for any kind DERIVED from evidence (device loss, guard abort,
 * page termination) — live callers leave it unset and get "now".
 */
export interface InterruptionEvidence {
  status?: string | null;
  interruption?: EvidenceInterruption | null;
  deviceHealth?: EvidenceDeviceHealth | null;
  guardAbortedBlockNames?: string[];
  runtimeError?: EvidenceRuntimeError | null;
  at?: string;
}

export interface ClassifiedInterruption {
  kind: string;
  reason: string;
  error: string | null;
  stack: string | null;
  at: string;
}

/**
 * Matches the forensic milestone forms emitted around a controlled guard
 * abort: `7B GUARD_BLOCK` (legacy archives) and the explicit new form
 * `7B GUARD_BLOCK CHECKPOINTED` (added by the guarded path alongside the
 * existing `7B CHECKPOINTED`). Group 1 is the block config name.
 */
export const GUARD_BLOCK_MILESTONE_RE = /^(.+?) GUARD_BLOCK(?: CHECKPOINTED)?$/;

/**
 * Extract the ordered, de-duplicated block-config names that were aborted by
 * the safe-transformer guard, read from the forensic milestone mirror. Only
 * milestones that are exactly a guard-block state match — measured-block
 * states (`... GUARD_PASS`, `... MEASURE_DONE`, ...) never match.
 */
export function guardAbortedNamesFromMilestoneStates(states: readonly (string | null)[]): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  for (const s of states) {
    if (!s) continue;
    const m = GUARD_BLOCK_MILESTONE_RE.exec(s);
    if (m && !seen.has(m[1])) {
      seen.add(m[1]);
      names.push(m[1]);
    }
  }
  return names;
}

/**
 * Classify how a previous run ended from durable evidence alone. Decision
 * ladder (strongest evidence first), identical for every caller:
 *
 *   1. Persisted interruption        → returned verbatim (historical truth).
 *   2. deviceHealth.lost             → WEBGPU_DEVICE_LOST.
 *   3. guardAbortedBlockNames        → TRANSFORMER_SUITE_RESOURCE_LIMIT
 *                                      (controlled guard abort, NOT a crash).
 *   4. status RUNNING, no handler    → PAGE_TERMINATED_OR_BROWSER_RELOADED
 *                                      (never fabricate a JS exception).
 *   5. recorded runtime error        → GPU_VALIDATION_ERROR / RESOURCE_LIMIT /
 *                                      JAVASCRIPT_EXCEPTION (mirrors the
 *                                      historical live classifier).
 *   6. no evidence                   → UNKNOWN.
 *
 * Returns a full classification (never null); callers that have no run at all
 * short-circuit before calling so this stays honest about what "no evidence"
 * means.
 */
export function classifyPersistedInterruption(evidence: InterruptionEvidence): ClassifiedInterruption {
  const now = (): string => new Date().toISOString();
  const at = (): string => evidence.at ?? now();
  const err = evidence.runtimeError;

  const inter = evidence.interruption;
  if (inter && inter.kind) {
    return {
      kind: inter.kind,
      reason: inter.reason ?? '',
      error: inter.error ?? null,
      stack: inter.stack ?? null,
      at: inter.at ?? at(),
    };
  }

  const health = evidence.deviceHealth;
  if (health?.lost) {
    const r = health.reason;
    const m = health.message;
    return {
      kind: 'WEBGPU_DEVICE_LOST',
      reason: `GPU device lost${r ? `: ${r}` : ''}${m ? ` — ${m}` : ''}`,
      error: m ?? null,
      stack: null,
      at: at(),
    };
  }

  const guardNames = evidence.guardAbortedBlockNames ?? [];
  if (guardNames.length > 0) {
    return {
      kind: 'TRANSFORMER_SUITE_RESOURCE_LIMIT',
      reason:
        `Safe transformer memory guard aborted required block(s) ${guardNames.join(', ')} BEFORE allocation (resourceLimit) — a controlled resource-limit abort, NOT a JavaScript exception, device loss, or random page reload. The page then terminated/reloaded before the run could finalize.`,
      error: err?.error ?? null,
      stack: err?.stack ?? null,
      at: at(),
    };
  }

  if (evidence.status === 'RUNNING') {
    return {
      kind: 'PAGE_TERMINATED_OR_BROWSER_RELOADED',
      reason:
        'The page was terminated or reloaded during the benchmark with no surviving JavaScript handler. No checkpoint was finalized — data above is the last consistent state.',
      error: err?.error ?? null,
      stack: err?.stack ?? null,
      at: at(),
    };
  }

  if (err?.error) {
    const msg = `${err.error} ${err.stack ?? ''}`.toLowerCase();
    if (msg.includes('validation')) {
      return { kind: 'GPU_VALIDATION_ERROR', reason: err.error, error: err.error, stack: err.stack ?? null, at: err.timestamp ?? at() };
    }
    if (msg.includes('limit') && (msg.includes('alloc') || msg.includes('buffer') || msg.includes('memory'))) {
      return { kind: 'RESOURCE_LIMIT', reason: err.error, error: err.error, stack: err.stack ?? null, at: err.timestamp ?? at() };
    }
    return { kind: 'JAVASCRIPT_EXCEPTION', reason: err.error, error: err.error, stack: err.stack ?? null, at: err.timestamp ?? at() };
  }

  return { kind: 'UNKNOWN', reason: 'No crash evidence recorded.', error: null, stack: null, at: at() };
}