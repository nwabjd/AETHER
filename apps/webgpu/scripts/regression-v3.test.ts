// Regression tests for Performance V3 scoring + reliability logic.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyConfidence, safeThroughput, computeReadiness, classifyFeasibility,
  setTimerResolution,
} from '../src/benchmark/results-v3.ts';
import type { V3Result } from '../src/benchmark/results-v3.ts';

setTimerResolution(1);

test('V3: confidence classification uses timer resolution', () => {
  assert.equal(classifyConfidence(0), 'UNMEASURABLE');
  assert.equal(classifyConfidence(0.5), 'UNMEASURABLE'); // ≤ timer res 1ms
  assert.equal(classifyConfidence(1), 'UNMEASURABLE');
  assert.equal(classifyConfidence(3), 'LOW');      // <5ms
  assert.equal(classifyConfidence(10), 'MEDIUM');  // 5–20ms
  assert.equal(classifyConfidence(50), 'HIGH');    // ≥20ms
});

test('V3: safeThroughput never emits Infinity', () => {
  assert.deepEqual(safeThroughput(1000, 0, 'GFLOPS'), { value: null, capped: false });
  assert.deepEqual(safeThroughput(1000, NaN, 'GFLOPS'), { value: null, capped: false });
  assert.deepEqual(safeThroughput(0, 5, 'GFLOPS'), { value: null, capped: false });
  const absurd = safeThroughput(1e30, 0.001, 'GFLOPS');
  assert.equal(absurd.value, null);
  assert.equal(absurd.capped, true);
  const ok = safeThroughput(2e9, 5, 'GFLOPS'); // 2e9 / 0.005 = 4e11 / 1e9 = 400 GFLOPS
  assert.equal(ok.value, 400);
  assert.equal(ok.capped, false);
});

function mk(conf: V3Result['confidence'], perOpMs: number): V3Result {
  return {
    category: 'X', operation: 'op', workload: 'w', shape: 's',
    repetitions: 10, totalMs: perOpMs, estimatedPerOperationMs: perOpMs,
    medianMs: perOpMs, p95Ms: perOpMs, p99Ms: perOpMs,
    timingMethod: 'HOST_WALL_CLOCK_AMPLIFIED', confidence: conf,
    correctnessPassed: true, throughput: null, throughputUnit: '', notes: '', measurable: conf !== 'UNMEASURABLE',
  };
}

test('V3: readiness scoring weights and caps at 100', () => {
  const ok = [mk('HIGH', 1), mk('HIGH', 1), mk('HIGH', 1)];
  const bad = [mk('UNMEASURABLE', 0)];
  const mem = [{ allocated: true, sizeMB: 512 }, { allocated: true, sizeMB: 256 }];
  const r = computeReadiness(ok, ok, ok, ok, ok, mem, 3);
  assert.ok(r.tensorCompute.score > 80);
  assert.equal(r.memory.score, 100);
  const r2 = computeReadiness(bad, bad, bad, bad, bad, [{ allocated: false, sizeMB: 64 }], 50);
  assert.ok(r2.overall < 30);
});

test('V3: feasibility classification is deterministic', () => {
  const ok = computeReadiness(
    [mk('HIGH', 1)], [mk('HIGH', 1)], [mk('HIGH', 1)],
    [mk('HIGH', 1)], [mk('HIGH', 1)], [{ allocated: true, sizeMB: 512 }], 2
  );
  const f = classifyFeasibility(ok);
  assert.equal(f.transformerInference, 'GREEN');
  assert.equal(f.vaeDecoding, 'GREEN');
});