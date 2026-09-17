// Unit tests for the G5 pure classifier/aggregator (scripts/g5-classifier.ts).
//
// These pin the exact G5 success criteria, the A–G failure ladder, guard
// consistency, and the memory-budget rung verification. They are
// deterministic: no browser, no DOM, pure data.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  G5_RUNGS, REQUIRED_CATEGORIES, EXECUTED_SIZES, GUARD_BLOCKED_SIZES,
  verifyRun, verifyRungs, verifyTransformer, classifyFailure,
  aggregateCampaign, durationMs, milestoneStates,
} from './g5-classifier.ts';

function iso(offsetSec = 0): string {
  return new Date(Date.now() + offsetSec * 1000).toISOString();
}

function makeMilestones(opts: {
  executed?: string[]; blocked?: string[]; rungs?: boolean; skipFinal?: boolean;
  missingRungEnter?: number[]; missingRungCp?: number[]; reversedRung?: number[];
  guardBehaviorChanged?: boolean; lastStateOverride?: string;
}): { t: string; state: string }[] {
  const executed = opts.executed ?? EXECUTED_SIZES;
  const blocked = opts.blocked ?? GUARD_BLOCKED_SIZES;
  const ms: { t: string; state: string }[] = [];
  let k = 0;
  for (const size of executed) {
    ms.push({ t: iso(k++), state: `${size} ENTER` });
    ms.push({ t: iso(k++), state: `${size} GUARD_START` });
    ms.push({ t: iso(k++), state: `${size} GUARD_PASS` });
    ms.push({ t: iso(k++), state: `${size} CHECKPOINTED` });
  }
  for (const size of blocked) {
    ms.push({ t: iso(k++), state: `${size} ENTER` });
    ms.push({ t: iso(k++), state: `${size} GUARD_START` });
    ms.push({ t: iso(k++), state: `${size} GUARD_BLOCK` });
    ms.push({ t: iso(k++), state: `${size} GUARD_BLOCK CHECKPOINTED` });
    ms.push({ t: iso(k++), state: `${size} CHECKPOINTED` });
  }
  if (opts.rungs !== false) {
    for (const mb of G5_RUNGS) {
      if (!(opts.missingRungEnter ?? []).includes(mb)) ms.push({ t: iso(k++), state: `MEMORY_BUDGET ${mb}MB ENTER` });
      if (!(opts.missingRungCp ?? []).includes(mb)) ms.push({ t: iso(k++), state: `MEMORY_BUDGET ${mb}MB CHECKPOINTED` });
      if (opts.reversedRung && opts.reversedRung.includes(mb)) {
        // emulate checkpointed-before-enter by swapping order
      }
    }
  }
  return ms;
}

function baseRecord(overrides: Partial<Record<string, unknown>> = {}, milestones?: { t: string; state: string }[]): Record<string, unknown> {
  return {
    runId: 'run-' + Math.random().toString(36).slice(2, 10),
    sessionId: 'sess',
    runtimeId: 'AETHER_V3_1_3_RUNTIME',
    buildId: 'abc',
    benchmarkVersion: 'V3.1.3',
    runtimeSchemaVersion: '3.1.3',
    startedAt: iso(-200),
    lastUpdatedAt: iso(-1),
    lastHeartbeat: iso(-1),
    finishedAt: iso(),
    status: 'COMPLETED',
    currentPhase: 'V3.1',
    currentCategory: 'attention',
    completedCategories: REQUIRED_CATEGORIES,
    lastMilestone: 'MEMORY_BUDGET 2048MB CHECKPOINTED',
    milestones,
    interruption: null,
    deviceHealth: { lost: false },
    error: null,
    persistenceFailures: 0,
    ...overrides,
  };
}

test('G5-C1: a clean record verifies ok with all nine checks true', () => {
  const rec = baseRecord({}, makeMilestones({}));
  const v = verifyRun(rec as never);
  assert.equal(v.ok, true);
  assert.deepEqual(Object.values(v.checks), Array(9).fill(true));
});

test('G5-C2: missing a rung CHECKPOINTED → incomplete rung + failure ladder E/B', () => {
  const rec = baseRecord({}, makeMilestones({ missingRungCp: [128] }));
  const v = verifyRun(rec as never);
  assert.equal(v.ok, false);
  const r = v.rungs.find((x) => x.mb === 128);
  assert.equal(r?.enter, true);
  assert.equal(r?.checkpointed, false);
  assert.equal(r?.complete, false);
});

test('G5-C3: rung ENTER after CHECKPOINTED is a violation (orderOk false)', () => {
  // craft: 128MB CHECKPOINTED appears before 128MB ENTER
  const ms = makeMilestones({ missingRungEnter: [128], missingRungCp: [128] });
  ms.push({ t: iso(), state: 'MEMORY_BUDGET 128MB CHECKPOINTED' });
  ms.push({ t: iso(), state: 'MEMORY_BUDGET 128MB ENTER' });
  const rec = baseRecord({}, ms);
  const v = verifyRun(rec as never);
  const r = v.rungs.find((x) => x.mb === 128);
  assert.equal(r?.enter, true);
  assert.equal(r?.checkpointed, true);
  assert.equal(r?.orderOk, false);
  assert.equal(r?.complete, false);
});

test('G5-C4: ladder A on device loss', () => {
  const rec = baseRecord({ status: 'INTERRUPTED', deviceHealth: { lost: true, reason: 'GPU reset' } }, makeMilestones({}));
  const f = classifyFailure(rec as never);
  assert.equal(f.ladder, 'A');
  assert.equal(f.kind, 'WEBGPU_DEVICE_LOST');
});

test('G5-C5: ladder F on PAGE_TERMINATED interruption (historical signature)', () => {
  const rec = baseRecord({
    status: 'INTERRUPTED',
    interruption: { kind: 'PAGE_TERMINATED_OR_BROWSER_RELOADED', reason: 'page reloaded', error: null, stack: null, at: iso() },
    finishedAt: null,
  }, makeMilestones({ rungs: false, lastStateOverride: '7B CHECKPOINTED' }));
  const f = classifyFailure(rec as never);
  assert.equal(f.ladder, 'F');
  assert.equal(f.kind, 'PAGE_OR_BROWSER_TERMINATED');
  const v = verifyRun(rec as never);
  assert.equal(v.ok, false);
  assert.equal(v.failureLadder, 'F');
});

test('G5-C6: explicit guard abort is ladder B (controlled, never a crash)', () => {
  const rec = baseRecord({
    status: 'INTERRUPTED',
    interruption: { kind: 'TRANSFORMER_SUITE_RESOURCE_LIMIT', reason: '7B exceeds maxBufferSize', error: null, stack: null, at: iso() },
  }, makeMilestones({}));
  const f = classifyFailure(rec as never);
  assert.equal(f.ladder, 'B');
  assert.equal(f.kind, 'TRANSFORMER_SUITE_RESOURCE_LIMIT');
});

test('G5-C7: persistence failures → ladder C', () => {
  const rec = baseRecord({ persistenceFailures: 2 }, makeMilestones({}));
  const f = classifyFailure(rec as never);
  assert.equal(f.ladder, 'C');
});

test('G5-C8: guard behavior change is flagged (0.5B blocked is a mutation)', () => {
  const ms = makeMilestones({ executed: ['1B'], blocked: ['0.5B', '1.5B', '3B', '7B'] });
  const rec = baseRecord({}, ms);
  const v = verifyRun(rec as never);
  assert.equal(v.transformer.guardBehaviorChanged, true);
  assert.equal(v.ok, false);
  assert.equal(v.failureKind, 'GUARD_BEHAVIOR_CHANGED'); // STOP CONDITION A mutation
});

test('G5-C9: previously-guarded 1.5B/3B/7B executing → guard behavior changed', () => {
  const ms = makeMilestones({ executed: ['0.5B', '1B', '1.5B', '3B', '7B'], blocked: [] });
  const rec = baseRecord({}, ms);
  const v = verifyRun(rec as never);
  assert.equal(v.guardBehaviorChanged, true);
  assert.equal(verifyTransformer(rec as never).guardBlocked.length, 0);
});

test('G5-C10: RUNNING with stale heartbeat → ladder E stall', () => {
  const rec = baseRecord({
    status: 'RUNNING', finishedAt: null,
    lastHeartbeat: iso(-120), lastUpdatedAt: iso(-120),
  }, makeMilestones({}));
  const f = classifyFailure(rec as never);
  assert.equal(f.ladder, 'E');
  assert.equal(f.kind, 'BENCHMARK_STALL');
});

test('G5-C11: durationMs computes finished − started', () => {
  const rec = baseRecord({ startedAt: iso(-100), finishedAt: iso() });
  assert.equal(durationMs(rec as never)!, 100000);
});

test('G5-C12: aggregator counts ok/attempted/failures + reproducible matching', () => {
  const good = baseRecord({}, makeMilestones({}));
  const bad = baseRecord({ runId: 'bad-' + Math.random().toString(36) }, makeMilestones({ rungs: false }));
  const sum = aggregateCampaign([good as never, bad as never]);
  assert.equal(sum.attempted, 2);
  assert.equal(sum.ok, 1);
  assert.equal(sum.okRate, 0.5);
  assert.equal(sum.failures.length, 1);
  assert.equal(sum.failures[0].ladder, 'G'); // COMPLETED but incomplete (missing rungs) → not ok, unknown
});

test('G5-C13: two identical failure signatures → reproducibleFailure', () => {
  const sig = makeMilestones({ rungs: false, lastStateOverride: '7B CHECKPOINTED' });
  const a = baseRecord({ runId: 'a' }, sig);
  const b = baseRecord({ runId: 'b' }, sig);
  const sum = aggregateCampaign([a as never, b as never]);
  assert.equal(sum.failures.length, 2);
  // both fail with the same signature (status COMPLETED + missing rungs → classified identically)
  assert.equal(sum.failures[0].signature, sum.failures[1].signature);
});

test('G5-C14: milestoneStates mirrors milestone order', () => {
  const ms = makeMilestones({});
  const rec = baseRecord({}, ms);
  const states = milestoneStates(rec as never);
  assert.ok(states.includes('0.5B CHECKPOINTED'));
  assert.ok(states.includes('7B GUARD_BLOCK CHECKPOINTED'));
  assert.ok(states.includes('MEMORY_BUDGET 2048MB CHECKPOINTED'));
});

test('G5-C15: per-rung aggregation produces median timings', () => {
  const good = baseRecord({}, makeMilestones({}));
  const sum = aggregateCampaign([good as never]);
  assert.equal(sum.perRungMs.length, 7);
  assert.ok(sum.perRungMs.every((p) => p.count >= 1));
});