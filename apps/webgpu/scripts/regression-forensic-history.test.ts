// Regression tests for the AETHER V3.1.3 persistent forensic run history
// (src/benchmark/forensic-history.ts) and its observer wiring inside
// crash-safety.ts. The mirror must produce durable archive records, survive
// page termination (orphan recovery), and NEVER write to or alter the legacy
// checkpoint (`aether_v313_checkpoint`) or milestone (`aether_v313_milestones`)
// keys.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  beginBenchmark, checkpointCategory, completeBenchmark, finalizeInterrupted, recordMilestone,
  setStorageForTests, resetForTests,
  CHECKPOINT_KEY, TRANSFORMER_MILESTONE_KEY,
} from '../src/benchmark/crash-safety.ts';
import {
  beginForensicRun, appendForensicMilestone, updateForensicRun, finalizeForensicRun,
  recoverOrphanedForensicRuns, clearForensicHistory, resetForensicActive,
  getForensicRuns, getForensicRun, getLatestForensicRun, getForensicMilestones,
  getForensicSnapshot, getForensicStorageStatus, getForensicArchiveRaw, getActiveForensicRunId,
  getActiveForensicRun,
  setForensicStorageForTests,
  FORENSIC_RUNS_KEY, MAX_ARCHIVE_BYTES,
  type ForensicRunRecord,
} from '../src/benchmark/forensic-history.ts';

type TStorage = {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
  writes: string[];
};

function memStorage(onWrite?: (key: string) => void): TStorage {
  const m = new Map<string, string>();
  const writes: string[] = [];
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => { m.set(k, v); writes.push(k); onWrite?.(k); },
    removeItem: (k: string) => { m.delete(k); },
    writes,
  };
}

function iso(): string {
  return new Date().toISOString();
}

function makeRecord(id: string, fields: Partial<ForensicRunRecord> = {}): ForensicRunRecord {
  return {
    runId: id,
    sessionId: 's-' + id,
    runtimeId: 'AETHER_V3_1_3_RUNTIME',
    buildId: 'build',
    benchmarkVersion: 'V3.1.3',
    runtimeSchemaVersion: '3.1.3',
    startedAt: iso(),
    lastUpdatedAt: iso(),
    lastHeartbeat: iso(),
    finishedAt: null,
    status: 'COMPLETED',
    currentPhase: null,
    currentCategory: null,
    completedCategories: [],
    lastMilestone: null,
    milestones: [],
    interruption: null,
    deviceHealth: { lost: false },
    partialResults: {},
    partialResultKeys: [],
    error: null,
    recoveredAt: null,
    persistenceFailures: 0,
    ...fields,
  };
}

function freshStorages(): { cs: TStorage; fs: TStorage } {
  const cs = memStorage();
  const fs = memStorage();
  setStorageForTests(cs);
  setForensicStorageForTests(fs);
  return { cs, fs };
}

// ─── Wiring through crash-safety (observer mirror) ───────────────────────

test('FH T1: beginBenchmark wires a single RUNNING forensic run with metadata', () => {
  resetForTests();
  freshStorages();
  beginBenchmark('V3.1', 'full', undefined, 'testbuild-abc');
  const runs = getForensicRuns();
  assert.equal(runs.length, 1);
  const r = runs[0];
  assert.equal(r.status, 'RUNNING');
  assert.equal(r.buildId, 'testbuild-abc');
  assert.equal(r.benchmarkVersion, 'V3.1.3');
  assert.equal(r.runtimeSchemaVersion, '3.1.3');
  assert.equal(r.milestones.length, 0);
});

test('FH T2: recordMilestone mirrors to the archive AFTER the legacy write', () => {
  resetForTests();
  const order: string[] = [];
  const cs = memStorage((k) => { if (k === TRANSFORMER_MILESTONE_KEY) order.push('legacy-milestone'); });
  const fs = memStorage((k) => { if (k === FORENSIC_RUNS_KEY) order.push('forensic-archive'); });
  setStorageForTests(cs);
  setForensicStorageForTests(fs);
  beginBenchmark('V3.1', 'full', undefined, 'tb');
  order.length = 0;
  recordMilestone('1.5B ENTER');
  assert.deepEqual(order, ['legacy-milestone', 'forensic-archive']);
  const run = getLatestForensicRun();
  assert.equal(run?.lastMilestone, '1.5B ENTER');
  assert.deepEqual(
    run?.milestones.map((m) => m.state),
    ['1.5B ENTER']
  );
});

test('FH T3: checkpointCategory mirrors completedCategories + partial key counts', () => {
  resetForTests();
  freshStorages();
  beginBenchmark('V3.1', 'quick', undefined, 'tb');
  checkpointCategory('MATMUL', [{}, {}, {}]);
  checkpointCategory('ATTENTION', { notArray: true });
  const run = getLatestForensicRun()!;
  assert.ok(run.completedCategories.includes('MATMUL'));
  assert.ok(run.completedCategories.includes('ATTENTION'));
  assert.deepEqual(run.partialResultKeys.sort(), ['ATTENTION', 'MATMUL'].sort());
  assert.equal(run.partialResults['MATMUL'].count, 3);
  assert.equal(run.partialResults['ATTENTION'].count, 1); // non-array → single entry
});

test('FH T4: completeBenchmark finalizes COMPLETED with finishedAt and retains milestones', () => {
  resetForTests();
  freshStorages();
  beginBenchmark('V3.1', 'quick', undefined, 'tb');
  recordMilestone('1.5B ENTER');
  recordMilestone('1.5B UPLOAD_W6');
  completeBenchmark();
  const run = getLatestForensicRun()!;
  assert.equal(run.status, 'COMPLETED');
  assert.ok(run.finishedAt);
  assert.equal(run.milestones.length, 2);
  assert.equal(getForensicStorageStatus().completedRuns, 1);
});

test('FH T5: finalizeInterrupted finalizes INTERRUPTED and preserves the interruption', () => {
  resetForTests();
  freshStorages();
  beginBenchmark('V3.1', 'full', undefined, 'tb');
  finalizeInterrupted('JAVASCRIPT_EXCEPTION', 'boom', 'msg', 'stk');
  const run = getLatestForensicRun()!;
  assert.equal(run.status, 'INTERRUPTED');
  assert.equal(run.interruption?.kind, 'JAVASCRIPT_EXCEPTION');
  assert.equal(run.interruption?.reason, 'boom');
  assert.equal(run.interruption?.error, 'msg');
  assert.equal(run.interruption?.stack, 'stk');
  assert.equal(run.error, 'msg');
});

// ─── Direct module semantics ─────────────────────────────────────────────

test('FH T6: multiple appendForensicMilestone calls land in the same run', () => {
  resetForensicActive();
  freshStorages();
  beginForensicRun();
  appendForensicMilestone('x1');
  appendForensicMilestone('x2');
  appendForensicMilestone('x3');
  const runs = getForensicRuns();
  assert.equal(runs.length, 1);
  assert.deepEqual(runs[0].milestones.map((m) => m.state), ['x1', 'x2', 'x3']);
});

test('FH T7: beginForensicRun twice creates two distinct records', () => {
  resetForensicActive();
  freshStorages();
  beginForensicRun();
  beginForensicRun();
  const runs = getForensicRuns();
  assert.equal(runs.length, 2);
  assert.notEqual(runs[0].runId, runs[1].runId);
});

test('FH T8: retention evicts oldest COMPLETED first, preserves every RUNNING record', () => {
  resetForensicActive();
  freshStorages();
  const doneIds: string[] = [];
  for (let i = 0; i < 16; i++) {
    beginForensicRun();
    finalizeForensicRun({ status: 'COMPLETED' });
    doneIds.push(getLatestForensicRun()!.runId);
  }
  beginForensicRun();
  const activeId = getLatestForensicRun()!.runId;
  beginForensicRun();
  const newestId = getLatestForensicRun()!.runId;
  const runs = getForensicRuns();
  assert.equal(runs.length, 16);
  assert.ok(runs.some((r) => r.runId === activeId), 'active RUNNING preserved');
  assert.ok(runs.some((r) => r.runId === newestId), 'newest RUNNING preserved');
  assert.ok(!runs.some((r) => r.runId === doneIds[0]), 'oldest COMPLETED evicted');
  assert.ok(!runs.some((r) => r.runId === doneIds[1]), 'second-oldest COMPLETED evicted');
  assert.equal(getForensicStorageStatus().activeRuns, 2);
});

test('FH T9: milestone retention keeps the tail 256 entries', () => {
  resetForensicActive();
  freshStorages();
  beginForensicRun();
  for (let i = 0; i < 300; i++) appendForensicMilestone(`m${i}`);
  const run = getLatestForensicRun()!;
  assert.equal(run.milestones.length, 256);
  assert.equal(run.milestones[0].state, 'm44');  // first evicted entries m0..m43
  assert.equal(run.milestones[255].state, 'm299');
});

test('FH T10: oversized archive is evicted aggressively without throwing', () => {
  resetForensicActive();
  const store = memStorage();
  setForensicStorageForTests(store);
  const big: ForensicRunRecord[] = [];
  for (let i = 0; i < 25; i++) {
    const milestones = Array.from({ length: 500 }, (_, j) => ({ t: iso(), state: `milestone-${i}-${j}-`.padEnd(80, 'x') }));
    big.push(makeRecord(`big-${i}`, { milestones }));
  }
  store.setItem(FORENSIC_RUNS_KEY, JSON.stringify(big));
  assert.doesNotThrow(() => beginForensicRun());
  const status = getForensicStorageStatus();
  assert.ok(status.archiveBytes <= MAX_ARCHIVE_BYTES, `archive ${status.archiveBytes}B > cap ${MAX_ARCHIVE_BYTES}B`);
  assert.equal(status.corrupted, false);
});

// ─── Orphan recovery ─────────────────────────────────────────────────────

test('FH T11: stale RUNNING record recovers to INTERRUPTED (page terminated/reloaded)', () => {
  resetForensicActive();
  freshStorages();
  const orphan = makeRecord('orphan-1', { status: 'RUNNING', sessionId: 'some-other-page', deviceHealth: { lost: false } });
  setForensicStorageForTests(memStorage());
  const store = memStorage();
  setForensicStorageForTests(store);
  store.setItem(FORENSIC_RUNS_KEY, JSON.stringify([orphan]));
  assert.equal(recoverOrphanedForensicRuns(), 1);
  const run = getLatestForensicRun()!;
  assert.equal(run.status, 'INTERRUPTED');
  assert.equal(run.interruption?.kind, 'PAGE_TERMINATED_OR_BROWSER_RELOADED');
  assert.ok(run.recoveredAt);
});

test('FH T12: stale RUNNING with lost device recovers as WEBGPU_DEVICE_LOST', () => {
  resetForensicActive();
  const store = memStorage();
  setForensicStorageForTests(store);
  const orphan = makeRecord('orphan-2', {
    status: 'RUNNING', sessionId: 'some-other-page',
    deviceHealth: { lost: true, reason: 'destroyed', message: 'mid-run' },
  });
  store.setItem(FORENSIC_RUNS_KEY, JSON.stringify([orphan]));
  assert.equal(recoverOrphanedForensicRuns(), 1);
  const run = getLatestForensicRun()!;
  assert.equal(run.status, 'INTERRUPTED');
  assert.equal(run.interruption?.kind, 'WEBGPU_DEVICE_LOST');
  assert.ok(run.interruption?.reason.includes('GPU device lost'));
});

test('FH T13: the current session run is never recovered', () => {
  resetForensicActive();
  freshStorages();
  beginForensicRun();
  assert.equal(recoverOrphanedForensicRuns(), 0);
  const run = getLatestForensicRun()!;
  assert.equal(run.status, 'RUNNING');
});

// ─── Clear + legacy-key isolation ────────────────────────────────────────

test('FH T14: clearForensicHistory removes ONLY the forensic archive key', () => {
  resetForTests();
  const { cs, fs } = freshStorages();
  beginBenchmark('V3.1', 'quick', undefined, 'tb');
  recordMilestone('1.5B ENTER');
  assert.notEqual(cs.getItem(CHECKPOINT_KEY), null);
  assert.notEqual(cs.getItem(TRANSFORMER_MILESTONE_KEY), null);
  assert.notEqual(fs.getItem(FORENSIC_RUNS_KEY), null);
  clearForensicHistory();
  assert.equal(fs.getItem(FORENSIC_RUNS_KEY), null);
  assert.notEqual(cs.getItem(CHECKPOINT_KEY), null, 'checkpoint key must survive');
  assert.notEqual(cs.getItem(TRANSFORMER_MILESTONE_KEY), null, 'milestone log must survive');
});

test('FH T15: snapshots and milestone reads return defensive copies', () => {
  resetForensicActive();
  freshStorages();
  beginForensicRun();
  appendForensicMilestone('keep');
  const runId = getActiveForensicRunId()!;
  const s1 = getForensicSnapshot();
  const s2 = getForensicSnapshot();
  assert.ok(s1 && s2);
  assert.notEqual(s1, s2);
  s1.runId = 'mutated';
  s1.completedCategories.push('HACK');
  assert.equal(getForensicSnapshot()!.runId, runId);
  assert.equal(getForensicSnapshot()!.completedCategories.length, 0);
  const ms = getForensicMilestones(runId);
  ms[0].state = 'poisoned';
  assert.equal(getForensicMilestones(runId)[0].state, 'keep');
});

test('FH T16: storage failure never throws and flags persistenceFailures', () => {
  resetForensicActive();
  const failing: TStorage = {
    getItem: () => JSON.stringify([]),
    setItem: () => { throw new Error('quota'); },
    removeItem: () => {},
    writes: [],
  };
  setForensicStorageForTests(failing);
  assert.doesNotThrow(() => beginForensicRun());
  appendForensicMilestone('x');
  finalizeForensicRun({ status: 'COMPLETED' });
  const active = getActiveForensicRun();
  assert.ok(active, 'in-memory active run must exist even when persistence fails');
  assert.ok(active.persistenceFailures >= 1);
  const snap = getForensicSnapshot(active);
  assert.equal(snap!.persistenceOk, false);
});

test('FH T17: corrupted archive reports corrupted without throwing; runs unreadable', () => {
  resetForensicActive();
  const store = memStorage();
  setForensicStorageForTests(store);
  store.setItem(FORENSIC_RUNS_KEY, '{not valid json');
  assert.doesNotThrow(() => recoverOrphanedForensicRuns());
  const status = getForensicStorageStatus();
  assert.equal(status.corrupted, true);
  assert.equal(status.archiveExists, true);
  assert.equal(getForensicRuns().length, 0);
});

test('FH T18: corrupted archive is safely reset by the next begin (forensic key only)', () => {
  resetForTests();
  const { cs, fs } = freshStorages();
  fs.setItem(FORENSIC_RUNS_KEY, 'garbage');
  beginBenchmark('V3.1', 'quick', undefined, 'tb');
  assert.equal(getForensicStorageStatus().corrupted, false);
  assert.equal(getForensicRuns().length, 1);
  assert.notEqual(cs.getItem(CHECKPOINT_KEY), null);
});

test('FH T19: orphan recovery never touches the legacy keys', () => {
  resetForTests();
  const { cs, fs } = freshStorages();
  beginBenchmark('V3.1', 'full', undefined, 'tb');
  recordMilestone('1.5B ENTER');
  completeBenchmark();
  const cpBefore = cs.getItem(CHECKPOINT_KEY);
  const msBefore = cs.getItem(TRANSFORMER_MILESTONE_KEY);
  const orphan = makeRecord('orphan-3', { status: 'RUNNING', sessionId: 'x' });
  fs.setItem(FORENSIC_RUNS_KEY, JSON.stringify([orphan]));
  recoverOrphanedForensicRuns();
  assert.equal(cs.getItem(CHECKPOINT_KEY), cpBefore);
  assert.equal(cs.getItem(TRANSFORMER_MILESTONE_KEY), msBefore);
  assert.equal(getForensicStorageStatus().incompleteRuns, 1);
});

// ─── Storage-only key audit (dashboard unchanged) ────────────────────────

test('FH T20: full crash-safety lifecycle writes ONLY the intended keys', () => {
  resetForTests();
  const { cs, fs } = freshStorages();
  beginBenchmark('V3.1', 'quick', undefined, 'tb');
  checkpointCategory('MATMUL', [{}, {}]);
  recordMilestone('1.5B ENTER');
  completeBenchmark();
  assert.deepEqual([...new Set(cs.writes)].sort(), [CHECKPOINT_KEY, TRANSFORMER_MILESTONE_KEY].sort());
  assert.deepEqual([...new Set(fs.writes)].sort(), [FORENSIC_RUNS_KEY]);
});

test('FH T21: getForensicArchiveRaw round-trips the persisted archive', () => {
  resetForensicActive();
  freshStorages();
  beginForensicRun();
  appendForensicMilestone('a');
  const raw = getForensicArchiveRaw();
  assert.ok(raw && raw.startsWith('['));
  const parsed = JSON.parse(raw) as ForensicRunRecord[];
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].milestones.length, 1);
});

test('FH T22: getForensicStorageStatus counts active/incomplete/completed correctly', () => {
  resetForensicActive();
  freshStorages();
  beginForensicRun();
  finalizeForensicRun({ status: 'COMPLETED' });
  beginForensicRun();
  finalizeForensicRun({ status: 'INTERRUPTED', interruption: { kind: 'JAVASCRIPT_EXCEPTION', reason: 'r', error: null, stack: null, at: iso() } });
  beginForensicRun(); // stays RUNNING
  const st = getForensicStorageStatus();
  assert.equal(st.runCount, 3);
  assert.equal(st.completedRuns, 1);
  assert.equal(st.incompleteRuns, 1);
  assert.equal(st.activeRuns, 1);
  assert.equal(st.maxRuns, 16);
  assert.equal(st.maxMilestonesPerRun, 256);
  assert.ok(st.archiveBytes > 0);
});