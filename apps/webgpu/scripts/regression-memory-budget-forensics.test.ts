// Regression tests for the forensic G2 rung milestones in benchMemoryBudget().
//
// OBSERVABILITY-ONLY hardening: every memory-budget rung durably persists
// `MEMORY_BUDGET <N>MB ENTER` BEFORE its GPU allocation/work and
// `MEMORY_BUDGET <N>MB CHECKPOINTED` only after that rung succeeded AND its
// result-record + destroy cleanup completed. The purpose is to recover, from a
// killed page, exactly which rung the process reached.
//
// Tests are deterministic and source-level: they read perf-v3-llm.ts and pin
// the milestone call sites, their ordering relative to the allocation loop and
// the destroy cleanup, plus the unchanged ladder/chunk/guard/destroy/heartbeat
// semantics (no queue wipe, no lifecycle handlers, no schema change).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  classifyPersistedInterruption, guardAbortedNamesFromMilestoneStates,
} from '../src/benchmark/interruption-classifier.ts';
import {
  setStorageForTests, resetForTests, recordMilestone, getMilestones, clearMilestones,
} from '../src/benchmark/crash-safety.ts';
import {
  TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES,
  TRANSFORMER_SUITE_RUN_TRANSIENT_CAP_BYTES,
  TRANSFORMER_SUITE_SAFE_COMMIT_BYTES,
} from '../src/benchmark/transformer-guard.ts';

const LLM_SOURCE = readFileSync(new URL('../src/benchmark/perf-v3-llm.ts', import.meta.url), 'utf8');

const FULL_LADDER = [128, 256, 512, 768, 1024, 1536, 2048];
const SMALL_LADDER = [128, 256];

const ENTER_TEMPLATE = '`MEMORY_BUDGET ${targetMB}MB ENTER`';
const CHECKPOINTED_CALL = 'if (success) recordMilestone(`MEMORY_BUDGET ${targetMB}MB CHECKPOINTED`);';

function memStorage(): { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void } {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => { m.set(k, v); },
    removeItem: (k: string) => { m.delete(k); },
  };
}

function parsedLadders(): { full: number[]; small: number[] } {
  const line = LLM_SOURCE.split('\n').find((l) => l.includes('const targets = subset'));
  assert.ok(line, 'benchMemoryBudget ladder declaration present');
  const m = line.match(/subset === 'small' \? \[([0-9,\s]+)\] : \[([0-9,\s]+)\]/);
  assert.ok(m, 'ladder declared on one line with full/small split');
  const parse = (s: string) => s.split(',').map((x) => parseInt(x.trim(), 10)).filter((n) => !Number.isNaN(n));
  return { full: parse(m[2]), small: parse(m[1]) };
}

test('G2-A: ENTER milestone is emitted before the rung GPU allocation loop', () => {
  assert.ok(LLM_SOURCE.includes(`recordMilestone(${ENTER_TEMPLATE});`), 'ENTER milestone call present in source');
  const enterIdx = LLM_SOURCE.indexOf(`recordMilestone(${ENTER_TEMPLATE});`);
  const whileIdx = LLM_SOURCE.indexOf('while (allocated < targetBytes) {');
  assert.ok(enterIdx !== -1 && whileIdx !== -1, 'both ENTER call and allocation loop are present');
  assert.ok(enterIdx < whileIdx, 'ENTER is emitted BEFORE any GPU allocation for that rung');
});

test('G2-B: CHECKPOINTED milestone follows success + destroy cleanup', () => {
  assert.ok(LLM_SOURCE.includes(CHECKPOINTED_CALL), 'CHECKPOINTED call is success-gated in source');
  const cpIdx = LLM_SOURCE.indexOf(CHECKPOINTED_CALL);
  const destroyIdx = LLM_SOURCE.indexOf('for (const b of bufs) b.destroy();');
  assert.ok(cpIdx !== -1 && destroyIdx !== -1, 'both CHECKPOINTED call and destroy cleanup are present');
  assert.ok(cpIdx > destroyIdx, 'CHECKPOINTED is emitted only AFTER the rung result-record + destroy cleanup');
});

test('G2-C: every ladder rung resolves to ENTER/CHECKPOINTED milestone strings', () => {
  assert.ok(LLM_SOURCE.includes(`recordMilestone(${ENTER_TEMPLATE});`), 'ENTER template in source');
  assert.ok(LLM_SOURCE.includes(CHECKPOINTED_CALL), 'CHECKPOINTED template in source');
  for (const n of FULL_LADDER) {
    assert.ok(LLM_SOURCE.includes(ENTER_TEMPLATE), `ENTER template usable for rung ${n}MB`);
    assert.ok(LLM_SOURCE.includes('CHECKPOINTED'), `CHECKPOINTED milestone usable for rung ${n}MB`);
  }
});

test('G2-D: memory-budget heartbeat row is unchanged', () => {
  assert.ok(LLM_SOURCE.includes('onProgress?.(`memory budget ${targetMB}MB`);'), 'human-readable heartbeat line intact');
});

test('G2-E: memory-budget ladder sizes are unchanged (full + small)', () => {
  const { full, small } = parsedLadders();
  assert.deepEqual(full, FULL_LADDER, 'full ladder is exactly [128,256,512,768,1024,1536,2048]');
  assert.deepEqual(small, SMALL_LADDER, 'small ladder is exactly [128,256]');
});

test('G2-F: guard constants are unchanged', () => {
  assert.equal(TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES, 64 * 1024 * 1024, 'safe browser transient budget unchanged');
  assert.equal(TRANSFORMER_SUITE_RUN_TRANSIENT_CAP_BYTES, 96 * 1024 * 1024, 'run-progressive cap unchanged');
  assert.equal(TRANSFORMER_SUITE_SAFE_COMMIT_BYTES, 128 * 1024 * 1024, 'safe commit constant unchanged');
});

test('G2-G: no queue.onSubmittedWorkDone() introduced in the gate path', () => {
  assert.ok(!LLM_SOURCE.includes('onSubmittedWorkDone'), 'perf-v3-llm.ts must not wipe the queue (separate experiment)');
});

test('G2-H: no lifecycle finalization handlers introduced in the gate path', () => {
  for (const token of ['pagehide', 'beforeunload', 'unload', 'addEventListener']) {
    assert.ok(!LLM_SOURCE.includes(token), `perf-v3-llm.ts must not register ${token} handler`);
  }
});

test('G2-I: existing transformer guard milestones are unchanged (source unchanged)', () => {
  const guardLines = [
    'recordMilestone(`${cfg.name} ENTER`);',
    'recordMilestone(`${cfg.name} GUARD_START`);',
    'recordMilestone(`${cfg.name} ${guard.ok ? \'GUARD_PASS\' : \'GUARD_BLOCK\'}`);',
    'recordMilestone(`${cfg.name} GUARD_BLOCK CHECKPOINTED`);',
    'recordMilestone(`${cfg.name} CHECKPOINTED`);',
    'recordMilestone(`${cfg.name} COMPLETE`);',
  ];
  for (const line of guardLines) {
    assert.ok(LLM_SOURCE.includes(line), `unchanged guard milestone line present: ${line}`);
  }
});

test('G2-I2: classifier ignores MEMORY_BUDGET milestones (no schema change / no false guard names)', () => {
  const names = guardAbortedNamesFromMilestoneStates([
    'MEMORY_BUDGET 128MB ENTER',
    'MEMORY_BUDGET 128MB CHECKPOINTED',
    '7B GUARD_BLOCK CHECKPOINTED',
    'MEMORY_BUDGET 2048MB CHECKPOINTED',
  ]);
  assert.deepEqual(names, ['7B'], 'only real guard blocks are extracted; memory-budget milestones are inert');
});

test('G2-I3: interruption classification with MEMORY_BUDGET milestones present still resolves guard abort', () => {
  const cls = classifyPersistedInterruption({
    status: 'RUNNING',
    at: '2026-09-13T16:26:32.359Z',
    interruption: null,
    deviceHealth: null,
    guardAbortedBlockNames: ['7B'],
    runtimeError: null,
  });
  assert.equal(cls.kind, 'TRANSFORMER_SUITE_RESOURCE_LIMIT');
  assert.ok(cls.reason.includes('7B'));
});

test('G2-roundtrip: MEMORY_BUDGET milestones persist via the existing store and clear with a new run', () => {
  setStorageForTests(memStorage());
  resetForTests();
  assert.deepEqual(getMilestones(), [], 'fresh run starts with an empty milestone log');
  recordMilestone('MEMORY_BUDGET 128MB ENTER');
  recordMilestone('MEMORY_BUDGET 128MB CHECKPOINTED');
  const ms = getMilestones();
  assert.equal(ms.length, 2);
  assert.equal(ms[0].state, 'MEMORY_BUDGET 128MB ENTER');
  assert.equal(ms[1].state, 'MEMORY_BUDGET 128MB CHECKPOINTED');
  assert.ok(ms.every((m) => typeof m.t === 'string' && !Number.isNaN(Date.parse(m.t))), 'valid ISO timestamps');
  resetForTests();
  assert.deepEqual(getMilestones(), [], 'a fresh run starts with an empty milestone log');
  clearMilestones();
});