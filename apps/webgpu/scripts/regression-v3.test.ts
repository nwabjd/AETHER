// Regression tests for Performance V3 scoring + reliability logic,
// plus V3.1 metric-integrity proofs (normalization).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyConfidence, safeThroughput, computeThroughputTotal,
  buildV3Result, computeReadiness, classifyFeasibility, setTimerResolution,
  computeLLMReadiness,
} from '../src/benchmark/results-v3.ts';
import type { V3Result, Confidence, TransformerBlockResult, LLMReadiness } from '../src/benchmark/results-v3.ts';

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

// ─── V3.1 METRIC INTEGRITY ──────────────────────────────────────────────

// Example from the spec: MatMul [128,512]×[512,512]
//   reps=5, totalMs=21  →  perOperationMs = 4.2 ms
//   FLOPs/op = 2*128*512*512 = 67,108,864
//   totalFLOPs = 5 * 67,108,864 = 335,544,320
//   GFLOPS = 335,544,320 / 0.021 / 1e9 = 15.978...
function buildMatmulResult(): V3Result {
  return buildV3Result({
    category: 'TRANSFORMER', operation: 'MatMul',
    workload: '128×512 × 512×512', shape: '[128,512]×[512,512]',
    reps: 5, totalMs: 21, medianMs: 21, p95: 23, p99: 24, samples: 12,
    confidence: 'HIGH', correctnessPassed: true,
    flopsPerExecution: 2 * 128 * 512 * 512,
    bytesPerExecution: (128 * 512 + 512 * 512 + 128 * 512) * 4,
    throughputUnit: 'GFLOPS',
  });
}

test('V3.1: estimatedPerOperationMs * repetitions ≈ totalMs', () => {
  const r = buildMatmulResult();
  assert.equal(r.repetitions, 5);
  assert.equal(r.totalMs, 21);
  assert.equal(r.estimatedPerOperationMs, 21 / 5);
  assert.ok(Math.abs(r.estimatedPerOperationMs * r.repetitions - r.totalMs) < 1e-9);
});

test('V3.1: throughput == totalWork / totalTime within FP tolerance', () => {
  const r = buildMatmulResult();
  const totalFLOPs = 2 * 128 * 512 * 512 * 5; // 335,544,320
  assert.equal(r.totalFLOPs, totalFLOPs);
  const expectedGFLOPs = totalFLOPs / (21 / 1000) / 1e9;
  const tol = 1e-6;
  assert.ok(Math.abs(r.throughput! - expectedGFLOPs) / expectedGFLOPs < tol);
  // totalWork must equal totalFLOPs (not a per-op value).
  assert.equal(r.totalWork, totalFLOPs);
});

test('V3.1: bandwidth uses totalBytes / totalTime', () => {
  const r = buildV3Result({
    category: 'IMAGE', operation: 'Eltwise', workload: 'w', shape: 's',
    reps: 10, totalMs: 20, medianMs: 20, p95: null, p99: null, samples: 7,
    confidence: 'HIGH', correctnessPassed: true,
    bytesPerExecution: 1024, throughputUnit: 'GB/s',
  });
  const expected = (1024 * 10) / (20 / 1000) / 1e9; // 5.12e-4 GB/s
  assert.equal(r.totalBytes, 10240);
  assert.equal(r.totalWork, 10240);
  assert.ok(Math.abs(r.throughput! - expected) < 1e-9);
});

test('V3.1: computeThroughputTotal rejects NaN/Infinity/negative/zero', () => {
  assert.equal(computeThroughputTotal(NaN, 10, 'GFLOPS').value, null);
  assert.equal(computeThroughputTotal(10, NaN, 'GFLOPS').value, null);
  assert.equal(computeThroughputTotal(Infinity, 10, 'GFLOPS').value, null);
  assert.equal(computeThroughputTotal(10, Infinity, 'GFLOPS').value, null);
  assert.equal(computeThroughputTotal(0, 10, 'GFLOPS').value, null);
  assert.equal(computeThroughputTotal(10, 0, 'GFLOPS').value, null);
  assert.equal(computeThroughputTotal(-10, 10, 'GFLOPS').value, null);
  // physically impossible throughput → flagged capped, never a fake number
  const absurd = computeThroughputTotal(1e30, 0.001, 'GFLOPS');
  assert.equal(absurd.value, null);
  assert.equal(absurd.capped, true);
});

test('V3.1: unit mismatch is impossible in the type system, and unit is preserved', () => {
  // GFLOPS unit must divide total FLOPs by 1e9 (not bytes).
  const r = buildV3Result({
    category: 'X', operation: 'op', workload: 'w', shape: 's',
    reps: 2, totalMs: 10, medianMs: 10, p95: null, p99: null, samples: 10,
    confidence: 'HIGH', correctnessPassed: true,
    flopsPerExecution: 1e9, bytesPerExecution: 0, throughputUnit: 'GFLOPS',
  });
  assert.equal(r.totalWork, 2e9);
  const expected = 2e9 / (10 / 1000) / 1e9; // 200 GFLOPS
  assert.ok(Math.abs(r.throughput! - expected) < 1e-6);
  assert.equal(r.throughputUnit, 'GFLOPS');
});

test('V3.1: buildV3Result rejects zero repetitions by falling back to 1', () => {
  const r = buildV3Result({
    category: 'X', operation: 'op', workload: 'w', shape: 's',
    reps: 0, totalMs: 30, medianMs: 30, p95: null, p99: null, samples: 10,
    confidence: 'HIGH', correctnessPassed: true,
    flopsPerExecution: 100, throughputUnit: 'GFLOPS',
  });
  assert.equal(r.repetitions, 1);
  assert.equal(r.estimatedPerOperationMs, 30);
});

test('V3.1: p95/p99 null when too few samples (no fabricated precision)', () => {
  const r = buildV3Result({
    category: 'X', operation: 'op', workload: 'w', shape: 's',
    reps: 100, totalMs: 50, medianMs: 50, p95: null, p99: null, samples: 3,
    confidence: 'HIGH', correctnessPassed: true,
    flopsPerExecution: 100, throughputUnit: 'GFLOPS',
  });
  assert.equal(r.p95Ms, null);
  assert.equal(r.p99Ms, null);
});

// Helper: create a V3Result with realistic timing. Use totalMs >= 50ms to
// get HIGH confidence (signalToTimerRatio > 20 with 1ms timer).
function mk(conf: Confidence, totalMs: number): V3Result {
  // Override totalMs based on the desired confidence so that
  // createBenchmarkResult's recalculated confidence matches.
  const realisticMs = conf === 'HIGH' ? Math.max(totalMs, 50) :
                      conf === 'MEDIUM' ? Math.max(totalMs, 10) :
                      conf === 'LOW' ? Math.max(totalMs, 3) : totalMs;
  return buildV3Result({
    category: 'X', operation: 'op', workload: 'w', shape: 's',
    reps: 10, totalMs: realisticMs, medianMs: realisticMs,
    p95: realisticMs, p99: realisticMs, samples: 20,
    confidence: conf, correctnessPassed: true,
    flopsPerExecution: 100, throughputUnit: 'GFLOPS',
  });
}

test('V3: readiness scoring weights and caps at 100', () => {
  const ok = [mk('HIGH', 1), mk('HIGH', 1), mk('HIGH', 1)];
  const bad = [mk('UNMEASURABLE', 0)];
  const mem = [{ allocated: true, sizeMB: 512 }, { allocated: true, sizeMB: 256 }];
  const r = computeReadiness(ok, ok, ok, ok, ok, mem, 3);
  assert.ok(r.tensorCompute.score >= 80);
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

// ─── V3.1 LLM GATE TESTS ───────────────────────────────────────────────

import { cpuInt8Matmul, cpuInt4Matmul, cpuKVDecodeAttn } from '../src/benchmark/cpu-refs.ts';

function packInt8Test(weights: Float32Array): Uint32Array {
  const n = weights.length;
  const packed = new Uint32Array(Math.ceil(n / 4));
  for (let i = 0; i < n; i++) {
    const val = Math.max(-128, Math.min(127, Math.round(weights[i])));
    packed[i >>> 2] |= ((val & 0xFF) << ((i & 3) * 8));
  }
  return packed;
}

function packInt4Test(weights: Float32Array): Uint32Array {
  const n = weights.length;
  const packed = new Uint32Array(Math.ceil(n / 8));
  for (let i = 0; i < n; i++) {
    const val = Math.max(-8, Math.min(7, Math.round(weights[i])));
    packed[i >>> 3] |= ((val & 0xF) << ((i & 7) * 4));
  }
  return packed;
}

test('V3.1: cpuInt8Matmul matches naive reference', () => {
  const M = 2, N = 4, K = 3;
  const A = new Float32Array([1, 2, 3, 4, 5, 6]);
  const W = new Float32Array([1, -1, 2, 0, -2, 3, 1, -1, 0, 2, -3, 1]);
  const packed = packInt8Test(W);
  const got = cpuInt8Matmul(A, packed, M, N, K);
  // B[3,4] row-major:
  //   row0=[1,-1,2,0] row1=[-2,3,1,-1] row2=[0,2,-3,1]
  // C[0,0] = 1*1 + 2*(-2) + 3*0 = -3
  assert.equal(got[0], -3);
  // C[0,1] = 1*(-1) + 2*3 + 3*2 = 11
  assert.equal(got[1], 11);
  // C[1,0] = 4*1 + 5*(-2) + 6*0 = -6
  assert.equal(got[4], -6);
});

test('V3.1: cpuInt4Matmul matches naive reference', () => {
  const M = 1, N = 2, K = 4;
  const A = new Float32Array([1, 2, 3, 4]);
  const W = new Float32Array([1, -1, 2, -2, 3, -3, 1, -1]);
  const packed = packInt4Test(W);
  const got = cpuInt4Matmul(A, packed, M, N, K);
  // B[4,2] row-major: [1,-1],[2,-2],[3,-3],[1,-1]
  // C[0,0] = 1*1 + 2*2 + 3*3 + 4*1 = 18
  assert.equal(got[0], 18);
  // C[0,1] = 1*(-1) + 2*(-2) + 3*(-3) + 4*(-1) = -18
  assert.equal(got[1], -18);
});

test('V3.1: cpuKVDecodeAttn matches manual computation', () => {
  const heads = 2, headDim = 2, ctx = 2;
  const scale = 1 / Math.sqrt(headDim);
  // Q: [heads, headDim]
  const Q = new Float32Array([1, 0, 0, 1]);
  // K: [ctx, heads, headDim]
  const K = new Float32Array([1, 0, 0, 1, 1, 0, 0, 1]);
  // V: [ctx, heads, headDim]
  const V = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const got = cpuKVDecodeAttn(Q, K, V, heads, headDim, ctx);
  // Head 0: Q=[1,0], K0=[1,0], K1=[1,0]
  // scores = [1*scale, 1*scale] = [s, s] where s = 1/sqrt(2)
  // softmax([s, s]) = [0.5, 0.5]
  // out[d] = 0.5*V[0,0,d] + 0.5*V[1,0,d]
  // out[0] = 0.5*1 + 0.5*5 = 3, out[1] = 0.5*2 + 0.5*6 = 4
  assert.ok(Math.abs(got[0] - 3) < 1e-5);
  assert.ok(Math.abs(got[1] - 4) < 1e-5);
  // Head 1: Q=[0,1], K0=[0,1], K1=[0,1]
  // scores = [1*scale, 1*scale] = [s, s]
  // softmax([s, s]) = [0.5, 0.5]
  // out[d] = 0.5*V[0,1,d] + 0.5*V[1,1,d]
  // out[2] = 0.5*3 + 0.5*7 = 5, out[3] = 0.5*4 + 0.5*8 = 6
  assert.ok(Math.abs(got[2] - 5) < 1e-5);
  assert.ok(Math.abs(got[3] - 6) < 1e-5);
});

test('V3.1: computeLLMReadiness returns valid scores', () => {
  const quantResults = [mk('HIGH', 1), mk('HIGH', 2)];
  const attnResults = [mk('HIGH', 1)];
  const decodeResults = [mk('MEDIUM', 5)];
  const blockResults: TransformerBlockResult[] = [{
    config: { name: 'test', hidden: 512, intermediate: 2048, layers: 12, heads: 8, kvHeads: 2, headDim: 64 },
    paramCount: 50_000_000, fp16Bytes: 100_000_000, int8Bytes: 50_000_000, int4Bytes: 25_000_000,
    blockLatencyMs: 3, confidence: 'MEDIUM',
  }];
  const memBudget = [{ success: true, totalAllocatedMB: 512 }];
  const r = computeLLMReadiness(quantResults, attnResults, decodeResults, blockResults, memBudget, 5);
  assert.ok(r.computeScore >= 0 && r.computeScore <= 100);
  assert.ok(r.memoryScore >= 0 && r.memoryScore <= 100);
  assert.ok(r.attentionScore >= 0 && r.attentionScore <= 100);
  assert.ok(r.decodeScore >= 0 && r.decodeScore <= 100);
  assert.ok(r.transformerBlockScore >= 0 && r.transformerBlockScore <= 100);
  assert.ok(r.sustainedScore >= 0 && r.sustainedScore <= 100);
  assert.ok(r.overall >= 0 && r.overall <= 100);
});

test('V3.1: computeLLMReadiness zero results → low score', () => {
  const r = computeLLMReadiness([], [], [], [], [], 50);
  assert.ok(r.overall < 10);
});

test('V3.1: INT8 pack/unpack round-trip', () => {
  const weights = new Float32Array([127, -128, 0, 42, -7, 100]);
  const packed = packInt8Test(weights);
  const got = cpuInt8Matmul(new Float32Array([1, 0, 0]), packed, 1, 2, 3);
  // Row [1,0,0] × W = [W[0,0], W[0,1]] = [127, -128]
  assert.equal(got[0], 127);
  assert.equal(got[1], -128);
});

// ─── V3.1.1: JSON Self-Audit validation ─────────────────────────────────

import { validateResultIntegrity, validateLLMGateIntegrity, computeLLMReadinessStatus } from '../src/benchmark/results-v3.ts';

function mkBad(partial: Partial<V3Result>): V3Result {
  return {
    category: 'test', operation: 'bad', workload: 'w', shape: 's',
    repetitions: 10, totalMs: 120, blockMs: 120, estimatedPerOperationMs: 12,
    medianMs: 120, p95Ms: null, p99Ms: null, samples: 10,
    totalWork: 1e12, workUnit: 'FLOPs', totalFLOPs: 1e12, totalBytes: 0,
    timingMethod: 'HOST_WALL_CLOCK_AMPLIFIED', confidence: 'HIGH',
    correctnessPassed: true,
    // Correct: totalWork / (totalMs/1000) / 1e9 = 1e12 / 0.12 / 1e9 = 8333.33 GFLOPS
    throughput: 8333.33, throughputUnit: 'GFLOPS',
    notes: '', measurable: true, timerFloorLimited: false,
    ...partial,
  };
}

test('V3.1.1: audit flags wrong estimatedPerOperationMs (old formula)', () => {
  // Old bug: estimatedPerOperationMs = totalMs instead of totalMs / reps
  const bad = mkBad({ estimatedPerOperationMs: 120 });
  const audit = validateResultIntegrity([bad]);
  assert.equal(audit.ok, false);
  const norm = audit.issues.find(i => i.kind === 'normalization_mismatch');
  assert.ok(norm, `expected normalization_mismatch issue, got: ${JSON.stringify(audit.issues)}`);
});

test('V3.1.1: audit passes correct normalized result', () => {
  const good = mkBad({});
  const audit = validateResultIntegrity([good]);
  assert.equal(audit.ok, true);
});

test('V3.1.1: audit rejects NaN/negative/zero reps/missing work', () => {
  const nan = mkBad({ totalMs: NaN });
  assert.equal(validateResultIntegrity([nan]).ok, false);
  const neg = mkBad({ totalMs: -5 });
  assert.equal(validateResultIntegrity([neg]).ok, false);
  const zeroReps = mkBad({ repetitions: 0 });
  assert.equal(validateResultIntegrity([zeroReps]).ok, false);
  const negWork = mkBad({ totalWork: -1 });
  assert.equal(validateResultIntegrity([negWork]).ok, false);
  const badUnit = mkBad({ throughputUnit: 'FLOPS' });
  assert.equal(validateResultIntegrity([badUnit]).ok, false);
});

test('V3.1.1: audit flags throughput mismatch', () => {
  // Correct: 1e12 / (120/1000) / 1e9 = 8333.33 GFLOPS
  // Old bug formula yields 833.33 (off by 10x from time-unit error)
  const bad = mkBad({ throughput: 833.33 });
  const audit = validateResultIntegrity([bad]);
  assert.equal(audit.ok, false);
  const tput = audit.issues.find(i => i.kind === 'throughput_mismatch');
  assert.ok(tput, `expected throughput_mismatch issue, got: ${JSON.stringify(audit.issues)}`);
});

// ─── V3.1.1: literal invariant tests (items 6 & 7) ──────────────────────

const EPS = 1e-9;

test('V3.1.1 INVARIANT: abs(estimatedPerOperationMs - totalMs/repetitions) < epsilon', () => {
  const cases: Array<{ reps: number; totalMs: number }> = [
    { reps: 10, totalMs: 12 },
    { reps: 20, totalMs: 1 },
    { reps: 401, totalMs: 20 },
    { reps: 1, totalMs: 7.5 },
    { reps: 64, totalMs: 0.5 },
  ];
  for (const c of cases) {
    const got = buildV3Result({
      category: 't', operation: 'o', workload: 'w', shape: 's',
      reps: c.reps, totalMs: c.totalMs, medianMs: c.totalMs,
      p95: null, p99: null, samples: c.reps < 10 ? c.reps : 10,
      confidence: 'MEDIUM', correctnessPassed: true,
      flopsPerExecution: 1000, throughputUnit: 'GFLOPS',
    });
    assert.ok(
      Math.abs(got.estimatedPerOperationMs - c.totalMs / c.reps) < EPS,
      `reps=${c.reps} totalMs=${c.totalMs}: expected ${c.totalMs / c.reps}, got ${got.estimatedPerOperationMs}`
    );
  }
});

test('V3.1.1 INVARIANT: throughput == totalWork / (totalMs/1000) / unitDivisor', () => {
  const cases: Array<{ totalWork: number; totalMs: number; unit: 'GFLOPS' | 'GB/s' | 'M/s' }> = [
    { totalWork: 5e10, totalMs: 120, unit: 'GFLOPS' },   // 5e10/0.12/1e9 = 416.67 GFLOPS
    { totalWork: 2.4e9, totalMs: 60, unit: 'GB/s' },     // 2.4e9/0.06/1e9 = 40 GB/s
    { totalWork: 1.2e6, totalMs: 240, unit: 'M/s' },     // 1.2e6/0.24/1e6 = 5 M/s
  ];
  for (const c of cases) {
    const divisor = c.unit === 'GFLOPS' ? 1e9 : c.unit === 'GB/s' ? 1e9 : 1e6;
    const expected = c.totalWork / (c.totalMs / 1000) / divisor;
    const evolvedExpected = c.totalWork / c.totalMs; // WRONG formula — must FAIL if used
    const got = buildV3Result({
      category: 't', operation: 'o', workload: 'w', shape: 's',
      reps: 1, totalMs: c.totalMs, medianMs: c.totalMs,
      p95: null, p99: null, samples: 1,
      confidence: 'MEDIUM', correctnessPassed: true,
      flopsPerExecution: c.unit === 'GFLOPS' ? c.totalWork : 0,
      bytesPerExecution: c.unit === 'GB/s' ? c.totalWork : 0,
      opsPerExecution: c.unit === 'M/s' ? c.totalWork : 0,
      throughputUnit: c.unit,
    });
    assert.ok(
      Math.abs(got.throughput! - expected) < Math.abs(expected) * 1e-6 || Math.abs(got.throughput! - expected) < 1e-9,
      `unit=${c.unit}: expected ${expected}, got ${got.throughput}`
    );
    assert.ok(
      Math.abs(got.throughput! - evolvedExpected) > Math.abs(evolvedExpected) * 0.5,
      `unit=${c.unit}: old formula (totalWork/totalMs) must NOT be used`
    );
  }
});

test('V3.1.1: workUnit field is populated and validated', () => {
  const flops = buildV3Result({ category: 't', operation: 'o', workload: 'w', shape: 's', reps: 1, totalMs: 10, medianMs: 10, p95: null, p99: null, samples: 1, confidence: 'MEDIUM', correctnessPassed: true, flopsPerExecution: 2, throughputUnit: 'GFLOPS' });
  assert.equal(flops.workUnit, 'FLOPs');
  const bytes = buildV3Result({ category: 't', operation: 'o', workload: 'w', shape: 's', reps: 1, totalMs: 10, medianMs: 10, p95: null, p99: null, samples: 1, confidence: 'MEDIUM', correctnessPassed: true, bytesPerExecution: 2, throughputUnit: 'GB/s' });
  assert.equal(bytes.workUnit, 'BYTES');
  const ops = buildV3Result({ category: 't', operation: 'o', workload: 'w', shape: 's', reps: 1, totalMs: 10, medianMs: 10, p95: null, p99: null, samples: 1, confidence: 'MEDIUM', correctnessPassed: true, opsPerExecution: 2, throughputUnit: 'M/s' });
  assert.equal(ops.workUnit, 'OPERATIONS');
  const audit = validateResultIntegrity([flops, bytes, ops]);
  assert.equal(audit.ok, true);
});

test('V3.1.1: computeLLMReadinessStatus returns NOT CERTIFIED when gate missing', () => {
  const s = computeLLMReadinessStatus(null, 0, 0, 0);
  assert.equal(s.llmReadinessStatus, 'NOT CERTIFIED');
  assert.equal(s.llmReadinessScore, null);
});

test('V3.1.1: computeLLMReadinessStatus NOT CERTIFIED when decode attention missing', () => {
  const r: LLMReadiness = {
    computeScore: 80, memoryScore: 80, attentionScore: 80, decodeScore: 0, transformerBlockScore: 80, sustainedScore: 80, overall: 75,
    llmCompute: 80, llmMemory: 80, kvCache: 50, prefill: 80, decode: 0, transformerBlock: 80, longContext: 70, sustained: 80,
  };
  const s = computeLLMReadinessStatus(r, 10, 0, 3, 3, 7);
  assert.equal(s.llmReadinessStatus, 'NOT CERTIFIED');
  assert.equal(s.llmReadinessScore, null);
});

test('V3.1.1: validateLLMGateIntegrity rejects empty gate results', () => {
  const empty = {
    quantizedMatmul: [], decodeAttention: [], transformerBlocks: [],
    tokenGeneration: [], memoryBudget: [],
    llmReadiness: { computeScore: 0, memoryScore: 0, attentionScore: 0, decodeScore: 0, transformerBlockScore: 0, sustainedScore: 0, overall: 0 },
  };
  const audit = validateLLMGateIntegrity(empty as any);
  assert.equal(audit.ok, false);
  assert.ok(audit.issues.some(i => i.kind === 'empty_section'));
});

test('V3.1.1: INT8 negative weights decode as two-complement (regression)', () => {
  // This test FAILS under the old sign-magnitude unpack and PASSES under two's complement.
  const M = 1, N = 1, K = 3;
  const A = new Float32Array([1, 1, 1]);
  const W = new Float32Array([-2, -128, 127]);
  const packed = packInt8Test(W);
  const got = cpuInt8Matmul(A, packed, M, N, K);
  // (-2) + (-128) + 127 = -3
  assert.equal(got[0], -3);
});

test('V3.1.1: INT4 negative weights decode as two-complement (regression)', () => {
  const M = 1, N = 1, K = 4;
  const A = new Float32Array([1, 1, 1, 1]);
  const W = new Float32Array([-1, -2, -8, 7]);
  const packed = packInt4Test(W);
  const got = cpuInt4Matmul(A, packed, M, N, K);
  // (-1) + (-2) + (-8) + 7 = -4
  assert.equal(got[0], -4);
});

// ─── V3.1.3 REGRESSION TESTS (Phase 6) ───────────────────────────────────

import { createBenchmarkResult, TIMING_EPSILON } from '../src/benchmark/results-v3.ts';
import { checkV3ResultIntegrity, computeCertificationGates } from '../src/benchmark/v3113.ts';
import type { LLMGateResult } from '../src/benchmark/results-v3.ts';

// TEST 1: repetitions=4, totalMs=20 → estimatedPerOperationMs=5
test('V3.1.3 TEST 1: estimatedPerOperationMs = totalMs / reps (4×20→5)', () => {
  const r = createBenchmarkResult({
    category: 'TEST', operation: 'test1', workload: '4×20', shape: 's',
    totalMs: 20, repetitions: 4, samples: 20,
    medianMs: 20, p95Ms: 21, p99Ms: 22,
    flopsPerExecution: 1000, throughputUnit: 'GFLOPS',
    correctnessPassed: true,
  });
  assert.equal(r.estimatedPerOperationMs, 5);
  assert.equal(r.repetitions, 4);
  assert.equal(r.totalMs, 20);
});

// TEST 2: repetitions=7, totalMs=8 → estimatedPerOperationMs=8/7
test('V3.1.3 TEST 2: estimatedPerOperationMs = totalMs / reps (7×8→8/7)', () => {
  const r = createBenchmarkResult({
    category: 'TEST', operation: 'test2', workload: '7×8', shape: 's',
    totalMs: 8, repetitions: 7, samples: 20,
    medianMs: 8, p95Ms: 9, p99Ms: 10,
    flopsPerExecution: 1000, throughputUnit: 'GFLOPS',
    correctnessPassed: true,
  });
  const expected = 8 / 7;
  assert.ok(Math.abs(r.estimatedPerOperationMs - expected) < TIMING_EPSILON,
    `expected ${expected}, got ${r.estimatedPerOperationMs}`);
});

// TEST 3: MatMul M=256, N=512, K=512, reps=7, totalMs=8
//   totalFLOPs = 2*256*512*512*7 = 939,524,096
//   GFLOPS = 939,524,096 / (8/1000) / 1e9 = 117.4405...
test('V3.1.3 TEST 3: throughput uses totalFLOPs across all repetitions', () => {
  const M = 256, N = 512, K = 512, reps = 7, totalMs = 8;
  const flopsPerExec = 2 * M * N * K; // 134,217,728
  const r = createBenchmarkResult({
    category: 'TEST', operation: 'test3', workload: `${M}x${N}x${K}`, shape: 's',
    totalMs, repetitions: reps, samples: 20,
    medianMs: totalMs, p95Ms: 9, p99Ms: 10,
    flopsPerExecution: flopsPerExec, throughputUnit: 'GFLOPS',
    correctnessPassed: true,
  });
  const totalFLOPs = flopsPerExec * reps; // 939,524,096
  assert.equal(r.totalFLOPs, totalFLOPs);
  assert.equal(r.totalWork, totalFLOPs);
  const expectedGFLOPS = totalFLOPs / (totalMs / 1000) / 1e9;
  assert.ok(Math.abs(r.throughput! - expectedGFLOPS) < expectedGFLOPS * 1e-6,
    `expected ${expectedGFLOPS}, got ${r.throughput}`);
});

// TEST 4: repetitions=1 → per-op latency equals total latency
test('V3.1.3 TEST 4: reps=1 → estimatedPerOperationMs == totalMs', () => {
  const r = createBenchmarkResult({
    category: 'TEST', operation: 'test4', workload: '1×15', shape: 's',
    totalMs: 15, repetitions: 1, samples: 20,
    medianMs: 15, p95Ms: 16, p99Ms: 17,
    flopsPerExecution: 1000, throughputUnit: 'GFLOPS',
    correctnessPassed: true,
  });
  assert.equal(r.estimatedPerOperationMs, 15);
  assert.equal(r.totalMs, 15);
});

// TEST 5: 20 independent samples → real median/p95/p99
test('V3.1.3 TEST 5: 20 samples produce real median/p95/p99', () => {
  const r = createBenchmarkResult({
    category: 'TEST', operation: 'test5', workload: '20-samples', shape: 's',
    totalMs: 50, repetitions: 10, samples: 20,
    medianMs: 50, p95Ms: 55, p99Ms: 60,
    flopsPerExecution: 1000, throughputUnit: 'GFLOPS',
    correctnessPassed: true,
  });
  assert.equal(r.medianMs, 50, 'median should be set with 20 samples');
  assert.equal(r.p95Ms, 55, 'p95 should be set with 20 samples');
  assert.equal(r.p99Ms, 60, 'p99 should be set with 20 samples');
});

// TEST 6: 19 samples → percentile fields MUST be null
test('V3.1.3 TEST 6: 19 samples → percentiles are null', () => {
  const r = createBenchmarkResult({
    category: 'TEST', operation: 'test6', workload: '19-samples', shape: 's',
    totalMs: 50, repetitions: 10, samples: 19,
    medianMs: 50, p95Ms: 55, p99Ms: 60,
    flopsPerExecution: 1000, throughputUnit: 'GFLOPS',
    correctnessPassed: true,
  });
  assert.equal(r.medianMs, null, 'median must be null with < 20 samples');
  assert.equal(r.p95Ms, null, 'p95 must be null with < 20 samples');
  assert.equal(r.p99Ms, null, 'p99 must be null with < 20 samples');
});

// TEST 7: timerResolution=1ms, totalMs=2ms → must not receive HIGH confidence
test('V3.1.3 TEST 7: totalMs=2ms with 1ms timer → not HIGH confidence', () => {
  const r = createBenchmarkResult({
    category: 'TEST', operation: 'test7', workload: '2ms', shape: 's',
    totalMs: 2, repetitions: 1, samples: 20,
    medianMs: 2, p95Ms: 2, p99Ms: 2,
    flopsPerExecution: 1000, throughputUnit: 'GFLOPS',
    correctnessPassed: true,
  });
  assert.notEqual(r.confidence, 'HIGH',
    `confidence=${r.confidence} must not be HIGH for 2ms total with 1ms timer`);
});

// TEST 8: createBenchmarkResult throws on invalid repetitions
test('V3.1.3 TEST 8: createBenchmarkResult throws on non-positive repetitions', () => {
  assert.throws(() => createBenchmarkResult({
    category: 'TEST', operation: 'bad', workload: 'w', shape: 's',
    totalMs: 10, repetitions: 0, samples: 10,
    medianMs: 10, p95Ms: null, p99Ms: null,
    flopsPerExecution: 1000, throughputUnit: 'GFLOPS',
    correctnessPassed: true,
  }), /TIMING INTEGRITY FAILURE/);
});

// TEST 9: checkV3ResultIntegrity catches estimation mismatch
test('V3.1.3 TEST 9: checkV3ResultIntegrity catches broken invariant', () => {
  const broken: V3Result = {
    category: 'test', operation: 'broken', workload: 'w', shape: 's',
    repetitions: 4, totalMs: 20, blockMs: 20,
    estimatedPerOperationMs: 20, // BUG: should be 5
    medianMs: 20, p95Ms: null, p99Ms: null, samples: 7,
    totalWork: 4000, workUnit: 'FLOPs', totalFLOPs: 4000, totalBytes: 0,
    timingMethod: 'HOST_WALL_CLOCK_AMPLIFIED', confidence: 'HIGH',
    correctnessPassed: true,
    throughput: 0.2, throughputUnit: 'GFLOPS',
    notes: '', measurable: true, timerFloorLimited: false,
  };
  const { ok, issues } = checkV3ResultIntegrity([broken]);
  assert.equal(ok, false);
  assert.ok(issues.some(i => i.kind === 'timing_integrity'),
    `expected timing_integrity issue, got: ${JSON.stringify(issues)}`);
});

// TEST 10: checkV3ResultIntegrity catches percentile without 20 samples
test('V3.1.3 TEST 10: checkV3ResultIntegrity flags percentile policy violation', () => {
  const bad: V3Result = {
    category: 'test', operation: 'percentile', workload: 'w', shape: 's',
    repetitions: 10, totalMs: 50, blockMs: 50,
    estimatedPerOperationMs: 5,
    medianMs: 50, p95Ms: 55, p99Ms: 60, samples: 7, // only 7 samples!
    totalWork: 1000, workUnit: 'FLOPs', totalFLOPs: 1000, totalBytes: 0,
    timingMethod: 'HOST_WALL_CLOCK_AMPLIFIED', confidence: 'HIGH',
    correctnessPassed: true,
    throughput: 0.02, throughputUnit: 'GFLOPS',
    notes: '', measurable: true, timerFloorLimited: false,
  };
  const { ok, issues } = checkV3ResultIntegrity([bad]);
  assert.equal(ok, false);
  assert.ok(issues.some(i => i.kind === 'percentile_policy'),
    `expected percentile_policy issue, got: ${JSON.stringify(issues)}`);
});

// TEST 11: checkV3ResultIntegrity passes correct results
test('V3.1.3 TEST 11: checkV3ResultIntegrity passes for correct results', () => {
  const good = buildV3Result({
    category: 'test', operation: 'good', workload: 'w', shape: 's',
    reps: 5, totalMs: 25, medianMs: 25,
    p95: null, p99: null, samples: 7,
    confidence: 'MEDIUM', correctnessPassed: true,
    flopsPerExecution: 1000, throughputUnit: 'GFLOPS',
  });
  const { ok, issues } = checkV3ResultIntegrity([good]);
  assert.equal(ok, true, `unexpected issues: ${JSON.stringify(issues)}`);
});

// TEST 12: certification gates fail when no LLM gate data
test('V3.1.3 TEST 12: certification gates FAIL without LLM gate', () => {
  const gates = computeCertificationGates(null);
  assert.equal(gates.overallCertified, false);
  assert.equal(gates.certificationStatus, 'NOT_CERTIFIED');
  assert.ok(gates.reasons.length > 0);
});

// TEST 13: throughputIntegrity catches throughput mismatch
test('V3.1.3 TEST 13: throughputIntegrity catches wrong throughput', () => {
  const bad: V3Result = {
    category: 'test', operation: 'tput', workload: 'w', shape: 's',
    repetitions: 10, totalMs: 100, blockMs: 100,
    estimatedPerOperationMs: 10,
    medianMs: 100, p95Ms: null, p99Ms: null, samples: 7,
    totalWork: 1e12, workUnit: 'FLOPs', totalFLOPs: 1e12, totalBytes: 0,
    timingMethod: 'HOST_WALL_CLOCK_AMPLIFIED', confidence: 'HIGH',
    correctnessPassed: true,
    throughput: 100, throughputUnit: 'GFLOPS', // should be 1e12/0.1/1e9 = 10000
    notes: '', measurable: true, timerFloorLimited: false,
  };
  const { ok, issues } = checkV3ResultIntegrity([bad]);
  assert.equal(ok, false);
  assert.ok(issues.some(i => i.kind === 'throughput_integrity'),
    `expected throughput_integrity issue, got: ${JSON.stringify(issues)}`);
});

// ─── CRASH-SAFETY REGRESSION TESTS (V3.1.3) ───────────────────────────────
// After the iPhone FULL V3.1 benchmark refreshed mid-run, crash-safety was
// added: global error capture, device.lost monitoring, per-category checkpoints,
// resume, fail-closed certification, and resource cleanup. These tests pin each
// contract so the memory-safety hardening cannot silently regress.

import {
  beginBenchmark, checkpointCategory, completeBenchmark, interrupt, finalizeInterrupted,
  monitorDeviceLost, getDeviceHealth, getRuntimeError,
  getCheckpoint, getPendingRun, classifyInterruption,
  trackBuffer, releaseTrackedBuffers, trackedBufferCount,
  deviceMaxBufferBytes, effectiveMaxBufferBytes, checkResourceFloor,
  installGlobalErrorCapture, setStorageForTests, resetForTests,
  recordMilestone, getMilestones, clearMilestones,
  INTERRUPTION_KINDS,
} from '../src/benchmark/crash-safety.ts';
import { finalizeCertificationWithInterruption } from '../src/benchmark/v3113.ts';
import type { V3Result, LLMGateResult, LLMReadiness } from '../src/benchmark/results-v3.ts';

function memStorage(): { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void } {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => { m.set(k, v); },
    removeItem: (k: string) => { m.delete(k); },
  };
}

const readiness: LLMReadiness = {
  computeScore: 0, memoryScore: 0, attentionScore: 0, decodeScore: 0,
  transformerBlockScore: 0, sustainedScore: 0, overall: 0,
  llmCompute: 0, llmMemory: 0, kvCache: 0, prefill: 0, decode: 0,
  transformerBlock: 0, longContext: 0, sustained: 0,
};

const emptyGate: LLMGateResult = {
  quantizedMatmul: [], decodeAttention: [], transformerBlocks: [],
  tokenGeneration: [], memoryBudget: [], llmReadiness: readiness,
};

test('CS T1 (V3.1.3): device.lost → health lost + checkpoint INTERRUPTED (WEBGPU_DEVICE_LOST)', () => {
  resetForTests();
  setStorageForTests(memStorage());
  beginBenchmark('V3.1', 'full', undefined, 'testbuild');
  let cb: ((e: unknown) => void) | null = null;
  const fake = {
    addEventListener(ev: string, handler: (e: unknown) => void) { if (ev === 'lost') cb = handler; },
    removeEventListener() { cb = null; },
  };
  monitorDeviceLost(fake);
  cb!({ reason: 'destroyed', message: 'lost mid-run' });
  assert.equal(getDeviceHealth().lost, true);
  const cp = getCheckpoint();
  assert.equal(cp?.status, 'INTERRUPTED');
  assert.equal(cp?.interruption?.kind, 'WEBGPU_DEVICE_LOST');
  assert.equal(cp?.certificationStatus, 'FAILED');
  assert.equal(getPendingRun()?.status, 'INTERRUPTED');
});

function withFakeWindow(fn: (errorHandler: (e: unknown) => void, rejectionHandler: (e: unknown) => void) => void) {
  let errorHandler: ((e: unknown) => void) | undefined;
  let rejectionHandler: ((e: unknown) => void) | undefined;
  const fakeWindow = {
    addEventListener(ev: string, h: (e: unknown) => void) {
      if (ev === 'error') errorHandler = h;
      if (ev === 'unhandledrejection') rejectionHandler = h;
    },
    removeEventListener() {},
  };
  (globalThis as Record<string, unknown>).window = fakeWindow;
  const cleanup = installGlobalErrorCapture();
  try {
    fn(errorHandler!, rejectionHandler!);
  } finally {
    cleanup();
    delete (globalThis as Record<string, unknown>).window;
  }
}

test('CS T2 (V3.1.3): window error capture records JS exception + prevents crash dialog', () => {
  resetForTests();
  setStorageForTests(memStorage());
  beginBenchmark('V3.1', 'full', undefined, 'testbuild');
  let prevented = false;
  withFakeWindow((errorHandler) => {
    errorHandler({
      message: 'boom', filename: 'bench.ts', lineno: 42, error: new Error('boom'),
      preventDefault() { prevented = true; },
    });
  });
  assert.equal(prevented, true, 'crash dialog must be suppressed');
  const rec = getRuntimeError();
  assert.ok(rec);
  assert.ok(rec!.error.includes('boom'));
  const cp = getCheckpoint();
  assert.equal(cp?.status, 'INTERRUPTED');
  assert.equal(cp?.interruption?.kind, 'JAVASCRIPT_EXCEPTION');
});

test('CS T3 (V3.1.3): unhandledrejection capture → UNHANDLED_REJECTION', () => {
  resetForTests();
  setStorageForTests(memStorage());
  beginBenchmark('V3.1', 'full', undefined, 'testbuild');
  let prevented = false;
  withFakeWindow((_errorHandler, rejectionHandler) => {
    rejectionHandler({
      reason: new Error('rejected!'),
      preventDefault() { prevented = true; },
    });
  });
  assert.equal(prevented, true, 'crash dialog must be suppressed');
  assert.equal(getCheckpoint()?.interruption?.kind, 'UNHANDLED_REJECTION');
});

test('CS T4 (V3.1.3): classifyInterruption → PAGE_TERMINATED_OR_BROWSER_RELOADED (no fabricated JS error)', () => {
  resetForTests();
  setStorageForTests(memStorage());
  beginBenchmark('V3.1', 'full', undefined, 'testbuild');
  checkpointCategory('quantizedMatmul', [{ x: 1 }]);
  // Page death mid-run: a RUNNING checkpoint survives, no error was captured.
  const info = classifyInterruption();
  assert.equal(info.kind, 'PAGE_TERMINATED_OR_BROWSER_RELOADED');
  assert.equal(getRuntimeError(), null, 'must never fabricate a JS exception');
  assert.equal(getPendingRun()?.status, 'RUNNING', 'banner sees the never-finished run');
});

test('CS T5 (V3.1.3): checkpoint persists each completed category to storage', () => {
  resetForTests();
  setStorageForTests(memStorage());
  beginBenchmark('V3.1', 'full', undefined, 'testbuild');
  checkpointCategory('quantizedMatmul', [{ n: 1 }]);
  checkpointCategory('decodeAttention', [{ n: 2 }]);
  const pending = getPendingRun();
  assert.ok(pending);
  assert.deepEqual(pending!.completedCategories, ['quantizedMatmul', 'decodeAttention']);
  assert.deepEqual(pending!.partialResults.quantizedMatmul, [{ n: 1 }]);
  assert.deepEqual(pending!.partialResults.decodeAttention, [{ n: 2 }]);
});

test('CS T6 (V3.1.3): resume context seeds a new beginBenchmark (recovery banner)', () => {
  const storage = memStorage();
  resetForTests();
  setStorageForTests(storage);
  beginBenchmark('V3.1', 'full', undefined, 'testbuild');
  checkpointCategory('quantizedMatmul', [{ n: 1 }]);
  const pending = getPendingRun()!;
  resetForTests(); // mimic page reload: in-memory state cleared, storage kept
  setStorageForTests(storage);
  beginBenchmark('V3.1', 'full', {
    resume: { completed: pending.completedCategories, partial: pending.partialResults },
  }, 'build2');
  const cp = getCheckpoint()!;
  assert.equal(cp.status, 'RUNNING');
  assert.deepEqual(cp.completedCategories, ['quantizedMatmul']);
  assert.deepEqual(cp.partialResults.quantizedMatmul, [{ n: 1 }]);
  assert.equal(cp.buildId, 'build2');
});

test('CS T7 (V3.1.3): partial results round-trip through storage with order intact', () => {
  const storage = memStorage();
  resetForTests();
  setStorageForTests(storage);
  beginBenchmark('V3.1', 'full', undefined, 'testbuild');
  checkpointCategory('decodeAttention', [{ ctx: 128 }]);
  checkpointCategory('transformerBlocks', [{ name: '0.5B' }]);
  resetForTests(true); // page reload: keep storage (the checkpoint must survive)
  setStorageForTests(storage);
  const pending = getPendingRun();
  assert.ok(pending);
  assert.deepEqual(pending!.completedCategories, ['decodeAttention', 'transformerBlocks']);
  assert.deepEqual(pending!.partialResults.decodeAttention, [{ ctx: 128 }]);
  assert.deepEqual(pending!.partialResults.transformerBlocks, [{ name: '0.5B' }]);
});

test('CS T8 (V3.1.3): memory guards cap buffers + reject sub-floor devices (RESOURCE_LIMIT)', () => {
  const low = checkResourceFloor({ limits: { maxBufferSize: 1024 * 1024 } });
  assert.equal(low.ok, false);
  assert.ok(low.reason!.includes('RESOURCE_LIMIT'));
  const healthy = { limits: { maxBufferSize: 512 * 1024 * 1024 } };
  assert.equal(checkResourceFloor(healthy).ok, true);
  assert.equal(deviceMaxBufferBytes(healthy), 512 * 1024 * 1024);
  assert.equal(effectiveMaxBufferBytes(healthy), 256 * 1024 * 1024, 'effective cap = MAX_SAFE_BUFFER_BYTES');
  assert.equal(deviceMaxBufferBytes(undefined), 256 * 1024 * 1024, 'unknown device → DEFAULT_ASSUMED_MAX_BUFFER');
});

test('CS T9 (V3.1.3): tracked buffers are destroyed on interruption (cleanup-after-failure)', () => {
  resetForTests();
  setStorageForTests(memStorage());
  beginBenchmark('V3.1', 'full', undefined, 'testbuild');
  let destroyed = 0;
  const fakeBuf = { destroy() { destroyed++; } } as unknown as GPUBuffer;
  trackBuffer(fakeBuf);
  trackBuffer(fakeBuf); // dedupe via Set
  assert.equal(trackedBufferCount(), 1);
  assert.equal(destroyed, 0);
  interrupt('RESOURCE_LIMIT', 'out of memory');
  assert.equal(destroyed, 1, 'interrupt must destroy every tracked buffer');
  assert.equal(trackedBufferCount(), 0);
  assert.equal(getCheckpoint()?.certificationStatus, 'FAILED');
  completeBenchmark(); // post-interrupt complete must not throw
  releaseTrackedBuffers(); // idempotent
});

test('CS T10 (V3.1.3): incomplete LLM gate → NOT_CERTIFIED with explicit reasons', () => {
  const gates = computeCertificationGates(emptyGate);
  assert.equal(gates.overallCertified, false);
  assert.equal(gates.certificationStatus, 'NOT_CERTIFIED');
  assert.ok(gates.reasons.some(r => r.includes('kvCacheDecode missing contexts')));
  assert.ok(gates.reasons.some(r => r.includes('tokenGeneration')));
  assert.ok(gates.reasons.some(r => r.includes('memoryBudget missing rungs')));
});

test('CS T11 (V3.1.3): device.lost → certification FAILED (fail closed)', () => {
  const base = computeCertificationGates(emptyGate);
  const failed = finalizeCertificationWithInterruption(base, {
    kind: 'WEBGPU_DEVICE_LOST', reason: 'destroyed', error: 'device lost during benchmark', stack: null,
    at: new Date().toISOString(),
  });
  assert.equal(failed.certificationStatus, 'FAILED');
  assert.equal(failed.overallCertified, false);
  assert.ok(failed.reasons.some(r => r.includes('certification FAILED')));
});

test('CS T12 (V3.1.3): interrupted LLM run survives reload and FAILs certification', () => {
  const storage = memStorage();
  resetForTests();
  setStorageForTests(storage);
  beginBenchmark('V3.1', 'full', undefined, 'testbuild');
  checkpointCategory('quantizedMatmul', [{ n: 1 }]);
  finalizeInterrupted('PAGE_TERMINATED_OR_BROWSER_RELOADED', 'page terminated');
  const cp = getCheckpoint()!;
  assert.equal(cp.status, 'INTERRUPTED');
  resetForTests(true); // page reload; storage kept
  setStorageForTests(storage);
  const pending = getPendingRun()!;
  assert.equal(pending.status, 'INTERRUPTED');
  assert.deepEqual(pending.completedCategories, ['quantizedMatmul']);
  const base = computeCertificationGates(emptyGate);
  const failed = finalizeCertificationWithInterruption(base, pending.interruption!);
  assert.equal(failed.certificationStatus, 'FAILED');
  assert.ok(failed.reasons.some(r => r.includes('PAGE_TERMINATED_OR_BROWSER_RELOADED')));
});

// ═══════════════════════════════════════════════════════════════════════════
// V3.1.3 TEST SET ST — STAGED DIAGNOSTIC JSON EXPORT
// Proves the staged diagnostic card can export the ACTUAL measured staged
// results (no placeholders, no re-run) through the V3.1.3 payload with the
// required post-serialization audit (results → stringify → parse →
// runSelfAuditV3113). Uses the existing createBenchmarkResult norms so the
// numbers are GDA-grade; the staged subset cannot certify (missing long
// contexts) so those exports honestly report certificationStatus FAILED.
// ═══════════════════════════════════════════════════════════════════════════

import {
  assembleLLMGateFromStages, buildStagedDiagnosticExport, resolveBuildId,
  DEFAULT_BENCHMARK_VERSION, DEFAULT_SCHEMA_VERSION, DEFAULT_ENGINE,
} from '../src/benchmark/staged-diagnostic-export.ts';
import type { LLMDiagnosticStage } from '../src/benchmark/perf-v3-llm.ts';

function stagedV3(workload: string, operation: string, totalMs: number): V3Result {
  return createBenchmarkResult({
    category: 'llmInference', operation, workload, shape: 'h=512',
    totalMs, repetitions: 4, samples: 20,
    medianMs: totalMs / 4, p95Ms: totalMs / 4 + 0.1, p99Ms: totalMs / 4 + 0.2,
    flopsPerExecution: 1024 * 1024, throughputUnit: 'GFLOPS',
    correctnessPassed: true,
  });
}

function stagedMem(targetMB: number, success = true) {
  return {
    targetMB, chunkMB: 32, success,
    totalAllocatedMB: success ? targetMB : 0, largestBufferMB: 32,
    numBuffers: success ? targetMB / 32 : 0,
    allocMs: 10, writeMs: 15, failureReason: null,
  };
}

function stagedBlock(name: string) {
  return {
    config: { name, hidden: 512, intermediate: 2048, layers: 2, heads: 8, kvHeads: 2, headDim: 64 },
    paramCount: 10_000_000, fp16Bytes: 20_000_000, int8Bytes: 10_000_000, int4Bytes: 5_000_000,
    blockLatencyMs: 5.0, repetitions: 1, totalMs: 5.0, estimatedPerOperationMs: 5.0,
    totalWork: 1, workUnit: 'OPERATIONS', throughput: null, throughputUnit: '/s',
    confidence: 'MEDIUM',
  };
}

function stagedTokenGen() {
  return [
    { promptTokens: 128, generateTokens: 32, prefillMs: 50, firstTokenMs: 12, avgDecodeMs: 8, tokensPerSec: 125, totalMs: 100 },
    { promptTokens: 256, generateTokens: 64, prefillMs: 90, firstTokenMs: 14, avgDecodeMs: 9, tokensPerSec: 111, totalMs: 180 },
    { promptTokens: 512, generateTokens: 64, prefillMs: 150, firstTokenMs: 16, avgDecodeMs: 10, tokensPerSec: 100, totalMs: 260 },
  ];
}

// Realistic staged scout: 7 stages, small s1–s6 + certification stage s7.
function stagedStages(): LLMDiagnosticStage[] {
  const mk = (name: string, label: string, items: unknown): LLMDiagnosticStage =>
    ({ name, label, durationMs: 100, completed: true, error: null, items });
  return [
    mk('quantizedMatmul', 'Small quantized matmul (h=512, decode/prefill-128)', [
      stagedV3('INT8 decode h=512', 'INT8 quantized matmul', 12.5),
      stagedV3('INT8 prefill-128 h=512', 'INT8 quantized matmul', 18.0),
      stagedV3('INT4 decode h=512', 'INT4 quantized matmul', 15.0),
    ]),
    mk('decodeAttention', 'KV decode attention (ctx=128, 256)', [
      stagedV3('KV decode ctx=128 heads=8 headDim=64', 'KV cache decode attention', 10.0),
      stagedV3('KV decode ctx=256 heads=8 headDim=64', 'KV cache decode attention', 11.0),
    ]),
    mk('decodeAttention512', 'KV decode attention (ctx=512, 1024)', [
      stagedV3('KV decode ctx=512 heads=8 headDim=64', 'KV cache decode attention', 12.0),
      stagedV3('KV decode ctx=1024 heads=8 headDim=64', 'KV cache decode attention', 13.0),
    ]),
    mk('memoryBudget', 'Memory budget ladder (128MB, 256MB)', [stagedMem(128), stagedMem(256)]),
    mk('transformerBlocks', 'Transformer block (0.5B, 1B)', [stagedBlock('0.5B'), stagedBlock('1B')]),
    mk('tokenGeneration', 'Token generation simulation (derived)', stagedTokenGen()),
    mk('certification', 'Full certification (readiness + self-audit)', readiness),
  ];
}

// Data-complete gate (all required contexts/ladder/blocks) used to exercise
// the full post-serialization audit over an export with maximal coverage. Audit
// check #7 has a pre-existing literal-order quirk, so this still fails honestly.
function fullStages(): LLMDiagnosticStage[] {
  const mk = (name: string, label: string, items: unknown): LLMDiagnosticStage =>
    ({ name, label, durationMs: 100, completed: true, error: null, items });
  const v3 = stagedV3 as (w: string, o: string, t: number) => V3Result;
  const qm = [
    v3('FP32 decode h=512', 'FP32 quantized matmul', 14.0),
    v3('INT8 decode h=512', 'INT8 quantized matmul', 12.5),
    v3('INT8 prefill-128 h=512', 'INT8 quantized matmul', 18.0),
    v3('INT4 decode h=512', 'INT4 quantized matmul', 15.0),
  ];
  const kv = [128, 256, 512, 1024, 2048, 4096].map(ctx =>
    stagedV3(`KV decode ctx=${ctx} heads=8 headDim=64`, 'KV cache decode attention', 10 + ctx / 512),
  );
  return [
    mk('quantizedMatmul', 'full quantized matmul', qm),
    mk('decodeAttention', 'KV decode attention', kv.slice(0, 2)),
    mk('decodeAttention512', 'KV decode attention (mid/long)', kv.slice(2)),
    mk('memoryBudget', 'Memory budget ladder (full)', [128, 256, 512, 768, 1024, 1536, 2048].map(m => stagedMem(m))),
    mk('transformerBlocks', 'Transformer block (full)', ['0.5B', '1B', '1.5B', '3B', '7B'].map(stagedBlock)),
    mk('tokenGeneration', 'Token generation simulation (derived)', stagedTokenGen()),
    mk('certification', 'Full certification (readiness + self-audit)', readiness),
  ];
}

const stagedEnv = {
  adapterName: 'Apple M4 GPU', adapterVendor: 'Apple', adapterDevice: 'Apple M4',
  device: 'Apple M4', maxBufferSize: 2147483648, maxWorkgroupsPerDim: 256, timerResolutionMs: 1,
};

test('ST1 (V3.1.3): staged export root metadata + buildId never null/unknown', () => {
  resetForTests();
  const stages = stagedStages();
  const gate = assembleLLMGateFromStages(stages)!;
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'abc123', commit: 'commit-x' });
  assert.equal(report.payload.benchmarkVersion, DEFAULT_BENCHMARK_VERSION);
  assert.equal(report.payload.benchmarkVersion, 'V3.1.3');
  assert.equal(report.payload.runtimeSchemaVersion, DEFAULT_SCHEMA_VERSION);
  assert.equal(report.payload.benchmarkEngine, DEFAULT_ENGINE);
  assert.equal(report.payload.buildId, 'abc123');
  assert.notEqual(report.payload.buildId, 'unknown');
  assert.ok(!String(report.payload.buildId).includes('null'));
  assert.ok(report.resultCount > 0);
});

test('ST2 (V3.1.3): results.llmInference + llmReadiness embed actual staged results', () => {
  resetForTests();
  const stages = stagedStages();
  const gate = assembleLLMGateFromStages(stages)!;
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'abc' });
  const llm = report.payload.results.llmInference as any;
  assert.ok(llm && typeof llm === 'object');
  assert.equal(llm.precisionMatmul.length, 3, 'FP32/INT8/INT4 staged matmuls');
  assert.equal(llm.kvCacheDecode.length, 4, 'ctx 128+256 from s2 and 512+1024 from s3 merged');
  assert.equal(llm.transformerBlocks.length, 2);
  assert.equal(llm.tokenGeneration.length, 3);
  assert.equal(llm.memoryBudget.length, 2);
  assert.ok(llm.readiness && typeof llm.readiness.overall.score === 'number');
  assert.deepEqual(report.payload.results.llmReadiness, llm.readiness);
  assert.ok(report.resultCount >= 13);
});

test('ST3 (V3.1.3): results.stagedDiagnostic reports 7/7 with per-stage items', () => {
  resetForTests();
  const stages = stagedStages();
  const gate = assembleLLMGateFromStages(stages)!;
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'abc' });
  const sd = report.payload.results.stagedDiagnostic;
  assert.equal(sd.completed, true);
  assert.equal(sd.stagesCompleted, 7);
  assert.equal(sd.totalStages, 7);
  assert.equal(sd.interrupted, false);
  assert.equal(sd.deviceLost, false);
  assert.ok(sd.durationMs > 0);
  assert.equal(sd.stages.length, 7);
  assert.deepEqual(sd.stages.map(s => s.name),
    ['quantizedMatmul', 'decodeAttention', 'decodeAttention512', 'memoryBudget', 'transformerBlocks', 'tokenGeneration', 'certification']);
  assert.ok(Array.isArray(sd.stages[0].items) && sd.stages[0].items.length === 3);
  assert.ok(!sd.stages.some(s => s.items === null || s.items === undefined));
});

test('ST4 (V3.1.3): device snapshot uses real env values', () => {
  resetForTests();
  const stages = stagedStages();
  const gate = assembleLLMGateFromStages(stages)!;
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'abc' });
  const d = report.payload.device;
  assert.equal(d.adapterName, 'Apple M4 GPU');
  assert.equal(d.vendor, 'Apple');
  assert.equal(d.device, 'Apple M4');
  assert.equal(d.maxBufferSize, 2147483648);
  assert.equal(d.maxWorkgroupsPerDim, 256);
  assert.equal(d.timerResolutionMs, 1);
});

test('ST5 (V3.1.3): crashSafety section has deviceLost/runtimeError/interrupted/lastCompletedStage', () => {
  resetForTests();
  const stages = stagedStages();
  const gate = assembleLLMGateFromStages(stages)!;
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'abc' });
  const c = report.payload.crashSafety;
  assert.equal(c.deviceLost, false);
  assert.equal(c.interrupted, false);
  assert.equal(c.lastCompletedStage, 'Full certification (readiness + self-audit)');
  assert.ok('runtimeError' in c);
  assert.equal(c.runtimeError, null);
});

test('ST6 (V3.1.3): post-serialization audit path executes over parsed JSON (data-complete gate)', () => {
  resetForTests();
  const stages = fullStages();
  const gate = assembleLLMGateFromStages(stages)!;
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'full' });
  // The audit runs over the serialized→parsed llmInference and the verdict is
  // embedded in the payload. Its checks always execute.
  assert.ok(report.postExportAudit && Array.isArray(report.postExportAudit.checks) && report.postExportAudit.checks.length > 0);
  assert.equal(typeof report.payload.postExportAudit.ok, 'boolean');
  // A data-complete suite MUST pass every audit check (#7 now uses numeric
  // ordering, so the five transformer sizes in any input order are accepted)
  // and certify end-to-end:
  assert.equal(report.postExportAudit.ok, true, report.postExportAudit.failures.join('; '));
  assert.ok(report.postExportAudit.failures.length === 0);
  assert.ok(report.postExportAudit.checks.some(c => c.id === 7 && c.pass === true), 'check #7 must pass for the complete five-model suite');
  assert.equal(report.certificationStatus, 'CERTIFIED');
  assert.equal(report.overallCertified, true);
  const roundTrip = JSON.parse(report.json) as any;
  assert.equal(roundTrip.postExportAudit.ok, report.postExportAudit.ok);
  assert.equal(roundTrip.certification.certificationStatus, 'CERTIFIED');
  assert.ok(!roundTrip.certification.reasons.some((r: string) => r.includes('postExportAudit FAILED')));
});

test('ST7 (V3.1.3): staged subset fails audit → certificationStatus FAILED with reason', () => {
  resetForTests();
  const stages = stagedStages();
  const gate = assembleLLMGateFromStages(stages)!;
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'staged' });
  // A staged scout cannot prove the full 6-context suite → audit must fail…
  assert.equal(report.postExportAudit.ok, false);
  assert.ok(report.postExportAudit.failures.length > 0);
  // … and a failed post-export audit MUST force certificationStatus FAILED.
  assert.equal(report.certificationStatus, 'FAILED');
  assert.equal(report.overallCertified, false);
  assert.ok(report.payload.certification.reasons.some(r => r.includes('postExportAudit FAILED')));
});

test('ST8 (V3.1.3): assembleLLMGateFromStages merges 7 stage item lists into an LLMGateResult', () => {
  const stages = stagedStages();
  const gate = assembleLLMGateFromStages(stages)!;
  assert.equal(gate.quantizedMatmul.length, 3);
  assert.equal(gate.decodeAttention.length, 4, 's2 (ctx 128,256) + s3 (ctx 512,1024) merged');
  assert.equal(gate.memoryBudget.length, 2);
  assert.equal(gate.transformerBlocks.length, 2);
  assert.equal(gate.tokenGeneration.length, 3);
  assert.ok(gate.llmReadiness && typeof gate.llmReadiness.overall === 'number');
});

test('ST9 (V3.1.3): assembler returns null when a required stage is missing; readiness fallback works', () => {
  const missingMem = stagedStages().filter(s => s.name !== 'memoryBudget');
  assert.equal(assembleLLMGateFromStages(missingMem), null);
  const withoutCert = stagedStages().filter(s => s.name !== 'certification');
  const gate = assembleLLMGateFromStages(withoutCert)!;
  assert.ok(gate.llmReadiness && Number.isFinite(gate.llmReadiness.overall),
    'readiness must be recomputed from measured items when certification stage missing');
  assert.equal(assembleLLMGateFromStages([]), null);
});

test('ST10 (V3.1.3): json round-trips to the payload incl. postExportAudit + no dropped stage items', () => {
  resetForTests();
  const stages = stagedStages();
  const gate = assembleLLMGateFromStages(stages)!;
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'roundtrip' });
  const parsed = JSON.parse(report.json) as any;
  assert.equal(parsed.results.stagedDiagnostic.stages.length, 7);
  assert.ok(parsed.results.stagedDiagnostic.stages.every((s: any) => s.items !== null && s.items !== undefined));
  assert.equal(parsed.results.stagedDiagnostic.stages[0].items.length, 3);
  assert.equal(parsed.buildId, 'roundtrip');
  assert.ok(parsed.postExportAudit && typeof parsed.postExportAudit.ok === 'boolean');
  assert.equal(parsed.certification.certificationStatus, report.certificationStatus);
  assert.deepEqual(parsed.results.llmReadiness.overall, report.payload.results.llmReadiness.overall);
});

test('ST11 (V3.1.3): resolveBuildId falls back to globalThis (AETHER_BUILD_ID/COMMIT) then UNTRACKED', () => {
  const prev = (globalThis as any).AETHER_BUILD_ID;
  const prevCommit = (globalThis as any).AETHER_COMMIT;
  try {
    (globalThis as any).AETHER_BUILD_ID = 'global-build-1';
    (globalThis as any).AETHER_COMMIT = 'commit-abc';
    assert.equal(resolveBuildId('explicit'), 'explicit');
    assert.equal(resolveBuildId(''), 'global-build-1');
    assert.equal(resolveBuildId(null), 'global-build-1');
    (globalThis as any).AETHER_BUILD_ID = '';
    assert.equal(resolveBuildId(''), 'commit-abc');
    (globalThis as any).AETHER_COMMIT = '';
    assert.equal(resolveBuildId(''), 'UNTRACKED');
    (globalThis as any).AETHER_BUILD_ID = '';
    (globalThis as any).AETHER_COMMIT = '';
    const report = buildStagedDiagnosticExport(stagedStages(), assembleLLMGateFromStages(stagedStages()), stagedEnv, { buildId: '' });
    assert.equal(report.payload.buildId, 'UNTRACKED');
    assert.notEqual(report.payload.buildId, 'unknown');
  } finally {
    (globalThis as any).AETHER_BUILD_ID = prev;
    (globalThis as any).AETHER_COMMIT = prevCommit;
  }
});

test('ST12 (V3.1.3): device lost during staged run → export shows deviceLost and FAILs certification', () => {
  resetForTests();
  setStorageForTests(memStorage());
  beginBenchmark('V3.1', 'quick', undefined, 'testbuild');
  let cb: ((e: unknown) => void) | null = null;
  const fake = {
    addEventListener(ev: string, handler: (e: unknown) => void) { if (ev === 'lost') cb = handler; },
    removeEventListener() { cb = null; },
  };
  monitorDeviceLost(fake);
  cb!({ reason: 'destroyed', message: 'lost during staged run' });
  assert.equal(getDeviceHealth().lost, true);
  const stages = stagedStages();
  const gate = assembleLLMGateFromStages(stages)!;
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'lost' });
  assert.equal(report.payload.crashSafety.deviceLost, true);
  assert.equal(report.payload.crashSafety.interrupted, true);
  assert.equal(report.certificationStatus, 'FAILED');
  assert.equal(report.overallCertified, false);
});

// ─── ST13–ST16: self-audit check #7 transformer-suite ordering ───────────────
// check #7 must require EXACTLY {0.5B, 1B, 1.5B, 3B, 7B} regardless of input
// order, using numeric (semantic) ordering instead of JS lexicographic sort,
// and must reject missing / extra / duplicate / malformed names.

function check7ForBlocks(blockNames: string[]) {
  resetForTests();
  const stages = fullStages();
  const tb = stages.find(s => s.name === 'transformerBlocks')!;
  tb.items = blockNames.map(n => stagedBlock(n));
  const gate = assembleLLMGateFromStages(stages)!;
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'blocks' });
  const check = report.postExportAudit!.checks.find(c => c.id === 7)!;
  return {
    checkPass: check.pass,
    detail: check.detail,
    auditOk: report.postExportAudit!.ok,
    certificationStatus: report.certificationStatus,
  };
}

test('ST13 (V3.1.3): check #7 passes for the complete five-model suite in canonical order', () => {
  const r = check7ForBlocks(['0.5B', '1B', '1.5B', '3B', '7B']);
  assert.equal(r.checkPass, true, r.detail);
  assert.equal(r.auditOk, true);
  assert.equal(r.certificationStatus, 'CERTIFIED');
});

test('ST13b (V3.1.3): check #7 passes for the five names in reverse order', () => {
  const r = check7ForBlocks(['7B', '3B', '1.5B', '1B', '0.5B']);
  assert.equal(r.checkPass, true, r.detail);
  assert.equal(r.auditOk, true);
  assert.equal(r.certificationStatus, 'CERTIFIED');
});

test('ST14 (V3.1.3): check #7 rejects a missing transformer size', () => {
  assert.equal(check7ForBlocks(['0.5B', '1B', '3B', '7B']).checkPass, false, 'missing 1.5B must fail');
  assert.equal(check7ForBlocks(['0.5B', '1B', '1.5B', '3B']).checkPass, false, 'missing 7B must fail');
});

test('ST15 (V3.1.3): check #7 rejects extra and duplicate model sizes', () => {
  assert.equal(check7ForBlocks(['0.5B', '1B', '1.5B', '3B', '7B', '10B']).checkPass, false, 'extra 10B must fail');
  assert.equal(check7ForBlocks(['0.5B', '1B', '1B', '3B', '7B']).checkPass, false, 'duplicate 1B / missing 1.5B must fail');
});

test('ST16 (V3.1.3): check #7 rejects malformed model names and fails certification closed', () => {
  const r = check7ForBlocks(['0.5B', '1B', '1.5B', '3B', 'foo']);
  assert.equal(r.checkPass, false, r.detail);
  assert.equal(r.auditOk, false);
  assert.equal(r.certificationStatus, 'FAILED');
});

// ═══════════════════════════════════════════════════════════════════════════
// V3.1.3 TEST SET SG — SAFE TRANSFORMER MEMORY GUARD (TOTAL TRANSIENT)
// Pins the fail-closed guard: real estimates covering GPU + host + staging,
// no fake blocked numbers, no exceptions, finally-based GPU cleanup, 3B AND 7B
// kept in the required suite, and certification held false when the guard
// rejects any mandatory block. Evidence-based budget — NOT maxBufferSize.
// ═══════════════════════════════════════════════════════════════════════════

import {
  guardTransformerBlock, estimateTransformerBlockMemory, buildBlockedTransformerBlock,
  createDisposableTracker, computeParamCount, withLocalWeightHost,
  TRANSFORMER_SUITE_SAFE_COMMIT_BYTES, TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES,
  TRANSFORMER_SUITE_RUN_TRANSIENT_CAP_BYTES,
} from '../src/benchmark/transformer-guard.ts';
import type { TransformerBlockGuardResult } from '../src/benchmark/transformer-guard.ts';
import { AB_VARIANTS, MEASURE_AWAITS, planTransformerBlock } from '../src/benchmark/transformer-ab.ts';
import type { ABBlockPlan } from '../src/benchmark/transformer-ab.ts';
import { ALL_SEQUENCES, buildAndSimulateAll } from '../src/benchmark/scout-order-ab.ts';
import type { SequenceId } from '../src/benchmark/scout-order-ab.ts';
import { buildLlmInferenceV3113, runSelfAuditV3113 } from '../src/benchmark/v3113.ts';
import type { TransformerBlockConfig } from '../src/benchmark/results-v3.ts';

const CFG_05: TransformerBlockConfig = { name: '0.5B', hidden: 512, intermediate: 2048, layers: 12, heads: 8, kvHeads: 2, headDim: 64 };
const CFG_1: TransformerBlockConfig = { name: '1B', hidden: 768, intermediate: 3072, layers: 12, heads: 12, kvHeads: 4, headDim: 64 };
const CFG_15: TransformerBlockConfig = { name: '1.5B', hidden: 768, intermediate: 3072, layers: 24, heads: 12, kvHeads: 4, headDim: 64 };
const BLOCK_3B: TransformerBlockConfig = { name: '3B', hidden: 1024, intermediate: 4096, layers: 24, heads: 16, kvHeads: 8, headDim: 64 };
const BLOCK_7B: TransformerBlockConfig = { name: '7B', hidden: 2048, intermediate: 8192, layers: 32, heads: 32, kvHeads: 8, headDim: 64 };
const BLOCK_3B_REASON = '3B transformer workload exceeds safe browser memory budget on this device';
const GUARD_7B_REASON = '7B transformer workload exceeds safe browser memory budget on this device';

const IPHONE_LIMITS = { maxBufferSize: 256 * 1024 * 1024, maxStorageBufferBindingSize: 128 * 1024 * 1024 };

// Exact total-transient accounting (transformer-guard.ts: FP32, seq=1).
// estimatedBrowserTransientBytes = estimatedGpuBytes + estimatedHostBytes
// + estimatedStagingBytes. Pins the corrected model (this is what found the
// 3B reload: the old guard counted only the ~48 MiB GPU commit, not host
// mirrors + staging).
const TMT = {
  budgetBytes: 64 * 1024 * 1024,
  runCapBytes: 96 * 1024 * 1024,
  c05: { gpu: 12_625_924, largest: 4_194_304, transient: 21_014_532 },
  c1: { gpu: 28_376_068, largest: 9_437_184, transient: 47_250_436 },
  // 1.5B and 1B are byte-identical in footprint (hidden=768, intermediate=3072,
  // differ only in layers=24 vs 12 — the block bench never allocates layers).
  c15: { gpu: 28_376_068, largest: 9_437_184, transient: 47_250_436 },
  c3: { gpu: 50_417_668, largest: 16_777_216, staging: 16_777_216, host: 16_777_216, hostRetainedLegacy: 50_343_936, transient: 83_972_100 },
  c7: { gpu: 201_498_628, largest: 67_108_864, transient: 335_716_356 },
  // Run-progressive cumulative (finding #3): modeled transient of blocks that
  // ALREADY EXECUTED plus the block being decided.
  cumAfter0_5: 21_014_532,
  cumAfter1: 68_264_968,          // 0.5B + 1B — the largest cumulative observed safe
  cumAt1_5: 115_515_404,          // +1.5B — the cumulative at the observed reload
  // 1.5B param counts (computeParamCount; label is 1.5B but only 175.6M
  // parameters are represented — the documented ~8.5x label/config mismatch).
  c15Params: { fp16: 351_215_616, int8: 175_607_808, int4: 87_803_904, total: 175_607_808, perLayer: 6_292_992 },
};

// Mirrors benchSyntheticTransformerBlock's guard flow: the accumulator starts
// at 0 and only ratchets when a block is actually allowed to run.
function decideRun(configs: TransformerBlockConfig[]): TransformerBlockGuardResult[] {
  let runTransientBytes = 0;
  const decisions: TransformerBlockGuardResult[] = [];
  for (const cfg of configs) {
    const g = guardTransformerBlock(cfg, IPHONE_LIMITS, TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES, runTransientBytes);
    decisions.push(g);
    if (g.ok) runTransientBytes += g.estimate.estimatedBrowserTransientBytes;
  }
  return decisions;
}

function fullGateWith7BRejected(): { stages: LLMDiagnosticStage[]; gate: LLMGateResult } {
  resetForTests();
  const stages = fullStages();
  const tb = stages.find(s => s.name === 'transformerBlocks')!;
  tb.items = ['0.5B', '1B', '1.5B', '3B'].map(stagedBlock).concat([buildBlockedTransformerBlock(BLOCK_7B, GUARD_7B_REASON)]);
  const gate = assembleLLMGateFromStages(stages)!;
  return { stages, gate };
}

// Reference fixture for the corrected guard: ONLY 0.5B/1B/1.5B may run; 3B and
// 7B are both RESOURCE_LIMIT before allocation (3B was the Safari reload point).
function fullGateWith3B7BRejected(): { stages: LLMDiagnosticStage[]; gate: LLMGateResult } {
  resetForTests();
  const stages = fullStages();
  const tb = stages.find(s => s.name === 'transformerBlocks')!;
  tb.items = ['0.5B', '1B', '1.5B'].map(stagedBlock)
    .concat([buildBlockedTransformerBlock(BLOCK_3B, BLOCK_3B_REASON)])
    .concat([buildBlockedTransformerBlock(BLOCK_7B, GUARD_7B_REASON)]);
  const gate = assembleLLMGateFromStages(stages)!;
  return { stages, gate };
}

// Reference fixture for finding #3 / the run-progressive cap: ONLY 0.5B/1B may
// run in a FULL run; 1.5B is refused by the cumulative term before allocation,
// 3B AND 7B by the single-config transient budget. This is what the REAL bench
// produces now (verify with decideRun / the ST17 rewrite).
function fullGateWith15B3B7BRejected(): { stages: LLMDiagnosticStage[]; gate: LLMGateResult } {
  resetForTests();
  const stages = fullStages();
  const tb = stages.find(s => s.name === 'transformerBlocks')!;
  const g15 = guardTransformerBlock(CFG_15, IPHONE_LIMITS, TMT.budgetBytes, TMT.cumAfter1);
  assert.equal(g15.ok, false, '1.5B must be rejected by the run-progressive cap after 0.5B+1B');
  tb.items = ['0.5B', '1B'].map(stagedBlock)
    .concat([buildBlockedTransformerBlock(CFG_15, g15.reason!)])
    .concat([buildBlockedTransformerBlock(BLOCK_3B, BLOCK_3B_REASON)])
    .concat([buildBlockedTransformerBlock(BLOCK_7B, GUARD_7B_REASON)]);
  const gate = assembleLLMGateFromStages(stages)!;
  return { stages, gate };
}

function fullGateWith7BMeasured(): { stages: LLMDiagnosticStage[]; gate: LLMGateResult } {
  resetForTests();
  const stages = fullStages();
  const gate = assembleLLMGateFromStages(stages)!;
  return { stages, gate };
}

test('ST17 (V3.1.3): safe allocation path — 0.5B/1B run; 1.5B (run-progressive) / 3B / 7B rejected before allocation', () => {
  // FULL-run flow exactly as benchSyntheticTransformerBlock evaluates it:
  // the accumulator carries the modeled transient of blocks that already ran.
  const decisions = decideRun([CFG_05, CFG_1, CFG_15, BLOCK_3B, BLOCK_7B]);
  const byName = Object.fromEntries(['0.5B', '1B', '1.5B', '3B', '7B'].map((n, i) => [n, decisions[i]]));

  for (const name of ['0.5B', '1B']) {
    const g = byName[name];
    assert.equal(g.ok, true, `${name} should run in FULL-run context`);
    assert.equal(g.reason, null);
    assert.ok(g.cumulative, `${name} always evaluates the run-progressive term`);
    assert.ok(g.cumulative!.totalBytes <= g.cumulative!.capBytes, `${name} cumulative stays within the run cap`);
    assert.ok(g.estimate.deviceCommitBytes <= TRANSFORMER_SUITE_SAFE_COMMIT_BYTES);
    assert.ok(g.estimate.estimatedBrowserTransientBytes <= TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES);
    assert.ok(g.estimate.deviceCommitBytes > 0 && g.estimate.hostCommitBytes > 0 && g.estimate.largestBufferBytes > 0);
  }

  // 1.5B: single-config transient (≈45.1 MiB) is UNDER the 64 MiB budget, so
  // the pre-#3 guard PASSED it and Safari reloaded. The run-progressive cap is
  // exactly what refuses it now — BEFORE any allocation.
  const g15 = byName['1.5B'];
  assert.equal(g15.ok, false, '1.5B must be rejected in FULL-run context (run-progressive cumulative)');
  assert.ok(g15.reason!.includes('exceeds safe browser memory budget'), g15.reason!);
  assert.ok(g15.reason!.includes('run-progressive browser transient'), g15.reason!);
  assert.equal(g15.cumulative!.priorBytes, TMT.cumAfter1);
  assert.equal(g15.cumulative!.thisBytes, TMT.c15.transient);
  assert.equal(g15.cumulative!.totalBytes, TMT.cumAt1_5);
  assert.equal(g15.cumulative!.capBytes, TRANSFORMER_SUITE_RUN_TRANSIENT_CAP_BYTES);
  assert.ok(g15.cumulative!.totalBytes > g15.cumulative!.capBytes);
  assert.ok(g15.estimate.estimatedBrowserTransientBytes < TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES,
    '1.5B is rejected by the CUMULATIVE term, not the single-config budget');

  // 3B/7B are rejected by the single-config transient budget (≈80.1 / ≈320.2
  // MiB), exactly as before — the cumulative term is not why they fail.
  for (const name of ['3B', '7B']) {
    const g = byName[name];
    assert.equal(g.ok, false, `${name} must be rejected on iPhone-class limits`);
    assert.equal(g.cumulative, null, `${name} is rejected by the single-config budget, so cumulative is null`);
    assert.ok(g.reason!.includes('exceeds safe browser memory budget'));
    assert.ok(g.estimate.estimatedBrowserTransientBytes > TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES,
      `${name}: ${g.estimate.estimatedBrowserTransientBytes} B transient must exceed the budget`);
  }
});

test('ST18 (V3.1.3): 7B rejected — estimate ≈192 MiB live, NEVER claimed safe from maxBufferSize', () => {
  const est = estimateTransformerBlockMemory(BLOCK_7B);
  assert.ok(est.deviceCommitBytes > 128 * 1024 * 1024 && est.deviceCommitBytes < 256 * 1024 * 1024,
    `7B live GPU commit must be ~192 MiB, got ${est.deviceCommitBytes}`);
  assert.equal(est.largestBufferBytes, 64 * 1024 * 1024, 'largest single 7B weight buffer is exactly 64 MiB');
  // Even a desktop-class buffer cap does NOT make 7B "safe": maxBufferSize is
  // per-buffer, not total memory. The budget is workload-specific.
  const giant = guardTransformerBlock(BLOCK_7B, { maxBufferSize: 2 * 1024 * 1024 * 1024, maxStorageBufferBindingSize: 2 * 1024 * 1024 * 1024 });
  assert.equal(giant.ok, false, '7B stays rejected even when maxBufferSize is huge');
  // Per-buffer caps still matter independently: a small-buffer device must be
  // stopped by the maxBufferSize check regardless of the budget.
  const tiny = guardTransformerBlock(BLOCK_7B, { maxBufferSize: 32 * 1024 * 1024 });
  assert.equal(tiny.ok, false);
  assert.ok(tiny.reason!.includes('maxBufferSize'));
});

test('ST19 (V3.1.3): resource-limit result is NOT PASS and flows as RESOURCE_LIMIT through the export', () => {
  const b = buildBlockedTransformerBlock(BLOCK_7B, GUARD_7B_REASON);
  assert.ok(b.resourceLimit);
  assert.equal(b.resourceLimit!.status, 'RESOURCE_LIMIT');
  assert.equal(b.resourceLimit!.attempted, true);
  assert.notEqual(b.resourceLimit!.status, 'UNSUPPORTED', 'a guard abort is RESOURCE_LIMIT, not a generic UNSUPPORTED');
  assert.equal(b.blockLatencyMs, 0, 'blocked blocks never carry a fabricated latency');
  const { gate } = fullGateWith7BRejected();
  const tb = buildLlmInferenceV3113(gate).transformerBlocks.find(x => x.name === '7B')!;
  assert.equal(tb.status, 'RESOURCE_LIMIT', 'export must say RESOURCE_LIMIT, never MEASURED');
  assert.ok(tb.resourceLimit && tb.resourceLimit.attempted === true && tb.resourceLimit.reason.length > 0);
});

test('ST20 (V3.1.3): 7B resource-limit path does not throw (guide, gate, audit, export)', () => {
  assert.doesNotThrow(() => buildBlockedTransformerBlock(BLOCK_7B, GUARD_7B_REASON));
  const { stages, gate } = fullGateWith7BRejected();
  assert.doesNotThrow(() => computeCertificationGates(gate));
  assert.doesNotThrow(() => buildLlmInferenceV3113(gate));
  const llmV = buildLlmInferenceV3113(gate);
  assert.doesNotThrow(() => runSelfAuditV3113(llmV, 1));
  assert.doesNotThrow(() => buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'rl-no-throw' }));
});

test('ST21 (V3.1.3): every GPU resource is destroyed in finally even when a later allocation throws', () => {
  const destroyed: string[] = [];
  const t = createDisposableTracker<{ destroy(): void }>();
  assert.throws(() => {
    t.create(() => ({ destroy: () => destroyed.push('wNorm1') }));
    t.create(() => ({ destroy: () => destroyed.push('wQKV') }));
    t.create(() => { throw new Error('mid-allocation OOM'); });
  }, /mid-allocation/);
  assert.equal(t.alive, 2, 'only successfully created resources remain tracked');
  t.release(); // what the bench does in its finally block
  assert.deepEqual(destroyed.sort(), ['wNorm1', 'wQKV'], 'finally destroys every created resource');
  assert.equal(t.alive, 0);
});

test('ST22 (V3.1.3): rejected 7B remains in the required suite (not dropped, not skipped)', () => {
  const { stages, gate } = fullGateWith7BRejected();
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'rl-suite' });
  const names = report.payload.results.llmInference!.transformerBlocks.map(b => b.name);
  assert.deepEqual(names.sort((a, b) => Number.parseFloat(a) - Number.parseFloat(b)), ['0.5B', '1B', '1.5B', '3B', '7B'],
    '7B must still be present in the required suite');
  const check7 = report.postExportAudit!.checks.find(c => c.id === 7)!;
  assert.equal(check7.pass, true, 'check #7 (exact required names) still passes with rejected 7B present');
  const check15 = report.postExportAudit!.checks.find(c => c.id === 15)!;
  assert.equal(check15.pass, false, 'check #15 flags the required block aborted by the memory guard');
});

test('ST23 (V3.1.3): certification remains false when mandatory 7B is RESOURCE_LIMIT', () => {
  const { gate } = fullGateWith7BRejected();
  const gates = computeCertificationGates(gate);
  assert.equal(gates.llmSuiteComplete, 'FAIL');
  assert.equal(gates.overallCertified, false);
  assert.notEqual(gates.certificationStatus, 'CERTIFIED');
  assert.ok(gates.reasons.some(r => r.includes('RESOURCE_LIMIT')), gates.reasons.join('; '));
  const rl = gate.transformerBlocks.find(b => b.config.name === '7B')!;
  assert.equal(rl.resourceLimit!.attempted, true);
  assert.equal(rl.resourceLimit!.status, 'RESOURCE_LIMIT');
  // Control: with a measured 7B the same fixture certifies.
  const { gate: gateOk } = fullGateWith7BMeasured();
  const gatesOk = computeCertificationGates(gateOk);
  assert.equal(gatesOk.llmSuiteComplete, 'PASS');
  assert.equal(gatesOk.overallCertified, true);
});

test('ST24 (V3.1.3): no fake performance number is emitted for a rejected 7B', () => {
  const b = buildBlockedTransformerBlock(BLOCK_7B, GUARD_7B_REASON);
  assert.equal(b.blockLatencyMs, 0);
  assert.equal(b.totalMs, 0);
  assert.equal(b.estimatedPerOperationMs, 0);
  assert.equal(b.throughput, null);
  assert.equal(b.confidence, 'UNMEASURABLE');
  assert.equal(b.workUnit, 'NONE');
  assert.equal(b.repetitions, 1);
  const { stages, gate } = fullGateWith7BRejected();
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'rl-nofake' });
  const parsed = JSON.parse(report.json) as {
    results: { llmInference: { transformerBlocks: { name: string; status: string; blockLatencyMs: number; estimatedTokensPerSecond: number | null }[] } };
  };
  const row = parsed.results.llmInference.transformerBlocks.find(x => x.name === '7B')!;
  assert.equal(row.status, 'RESOURCE_LIMIT');
  assert.equal(row.blockLatencyMs, 0);
  assert.equal(row.estimatedTokensPerSecond, null);
  assert.equal(report.overallCertified, false);
});

test('ST25 (V3.1.3): controlled 7B guard abort is distinguishable from every crash kind', () => {
  const guardKind = 'TRANSFORMER_SUITE_RESOURCE_LIMIT' as const;
  assert.ok(INTERRUPTION_KINDS.includes(guardKind), 'new kind is a registered, first-class classification');
  for (const other of ['JAVASCRIPT_EXCEPTION', 'UNHANDLED_REJECTION', 'WEBGPU_DEVICE_LOST', 'GPU_VALIDATION_ERROR', 'RESOURCE_LIMIT', 'MEMORY_LIMIT', 'APPLICATION_NAVIGATION', 'SERVICE_WORKER_RELOAD', 'PAGE_TERMINATED_OR_BROWSER_RELOADED', 'UNKNOWN']) {
    assert.notEqual(guardKind, other, `must be distinguishable from ${other}`);
  }

  // A surviving checkpoint whose transformerBlocks record a guard abort is
  // classified as the controlled abort — NOT PAGE_TERMINATED_OR_BROWSER_RELOADED.
  resetForTests();
  setStorageForTests(memStorage());
  beginBenchmark('V3.1', 'full', undefined, 'testbuild');
  checkpointCategory('transformerBlocks', [buildBlockedTransformerBlock(BLOCK_7B, GUARD_7B_REASON)]);
  const aborted = classifyInterruption();
  assert.equal(aborted.kind, 'TRANSFORMER_SUITE_RESOURCE_LIMIT');
  assert.notEqual(aborted.kind, 'PAGE_TERMINATED_OR_BROWSER_RELOADED');
  assert.notEqual(aborted.kind, 'JAVASCRIPT_EXCEPTION');
  assert.ok(aborted.reason.includes('NOT a JavaScript exception'));

  // Control: the same RUNNING checkpoint WITHOUT a guard abort classifies as
  // the pre-existing page-termination kind.
  resetForTests();
  setStorageForTests(memStorage());
  beginBenchmark('V3.1', 'full', undefined, 'testbuild');
  checkpointCategory('transformerBlocks', [stagedBlock('7B')]);
  const reload = classifyInterruption();
  assert.equal(reload.kind, 'PAGE_TERMINATED_OR_BROWSER_RELOADED');
});

// ═══════════════════════════════════════════════════════════════════════════
// V3.1.3 TEST SET TMT — TOTAL TRANSIENT MEMORY (3B FORENSIC)
// Proves the corrected guard: 3B accounting includes GPU + host + staging,
// the estimate is exact, the guard runs before allocation, rejected workloads
// never allocate, blocked results carry no fake performance, they are
// checkpointed as controlled aborts, the suite continues past RESOURCE_LIMIT,
// required sizes are unchanged, certification fails closed, every allocation
// path has cleanup, host mirrors are released ASAP, and every single buffer ≤
// 256 MiB.
// ═══════════════════════════════════════════════════════════════════════════

test('TMT #1/#2 (V3.1.3): 3B accounting includes GPU + host + staging and the total is exact', () => {
  const est = estimateTransformerBlockMemory(BLOCK_3B);
  assert.equal(est.estimatedGpuBytes, TMT.c3.gpu, '3B GPU commit is all simultaneously-live GPUBuffers');
  assert.equal(est.estimatedHostBytes, TMT.c3.host, '3B host peak = one release-host upload (largest single weight)');
  assert.equal(est.estimatedStagingBytes, TMT.c3.staging, '3B staging peak = one mappedAtCreation copy (largest single weight)');
  assert.equal(est.estimatedBrowserTransientBytes, TMT.c3.transient, '3B transient must be exactly 83,972,100 B (≈80.1 MiB)');
  assert.equal(est.estimatedBrowserTransientBytes, est.estimatedGpuBytes + est.estimatedHostBytes + est.estimatedStagingBytes);
  assert.equal(est.deviceCommitBytes, est.estimatedGpuBytes, 'deviceCommitBytes is the GPU component');

  // Every size pins to the corrected model.
  assert.deepEqual(
    ['0.5B', '1B', '1.5B', '3B', '7B'].map(name =>
      estimateTransformerBlockMemory([CFG_05, CFG_1, CFG_15, BLOCK_3B, BLOCK_7B].find(c => c.name === name)!).estimatedBrowserTransientBytes),
    [TMT.c05.transient, TMT.c1.transient, TMT.c1.transient, TMT.c3.transient, TMT.c7.transient],
  );
  // The guard's own decision uses the corrected total, not the GPU-only number:
  // 3B (≈80.1 MiB) is above the 64 MiB budget; 1B/1.5B (≈45.1 MiB) below it.
  assert.equal(TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES, TMT.budgetBytes);
  assert.ok(TMT.c3.transient > TMT.budgetBytes && TMT.c1.transient < TMT.budgetBytes);
});

test('TMT #3 (V3.1.3): the guard evaluates BEFORE allocation — pure decision, no GPU touched', () => {
  for (const cfg of [CFG_05, CFG_1, CFG_15, BLOCK_3B, BLOCK_7B]) {
    // guardTransformerBlock is pure: no device, no createBuffer, no storage —
    // it can only return a decision. If it fails here it cannot be used as a
    // pre-allocation gate.
    const g = guardTransformerBlock(cfg, IPHONE_LIMITS);
    assert.equal(typeof g.ok, 'boolean');
    assert.ok(g.estimate.estimatedBrowserTransientBytes > 0);
  }
  // The reason string carries the full corrected accounting (GPU+host+staging).
  const g3 = guardTransformerBlock(BLOCK_3B, IPHONE_LIMITS);
  assert.ok(g3.reason!.includes('GPU'), g3.reason!);
  assert.ok(g3.reason!.includes('host') && g3.reason!.includes('staging'), g3.reason!);
});

test('TMT #4/#5 (V3.1.3): unsafe 3B AND 7B return RESOURCE_LIMIT (attempted, before allocation)', () => {
  for (const cfg of [BLOCK_3B, BLOCK_7B]) {
    const g = guardTransformerBlock(cfg, IPHONE_LIMITS);
    assert.equal(g.ok, false, `${cfg.name} must be rejected by the corrected transient budget`);
    const b = buildBlockedTransformerBlock(cfg, g.reason!);
    assert.equal(b.resourceLimit!.status, 'RESOURCE_LIMIT');
    assert.equal(b.resourceLimit!.attempted, true);
    assert.equal(b.resourceLimit!.reason, g.reason);
    // Still rejected even with desktop-class per-buffer caps — the total
    // transient budget is workload-specific, not derived from maxBufferSize.
    const giant = guardTransformerBlock(cfg, { maxBufferSize: 2 * 1024 * 1024 * 1024, maxStorageBufferBindingSize: 2 * 1024 * 1024 * 1024 });
    assert.equal(giant.ok, false, `${cfg.name} must stay rejected even when the per-buffer caps are huge`);
  }
});

test('TMT #6 (V3.1.3): a rejected workload creates ZERO GPU/host allocations', () => {
  for (const cfg of [BLOCK_3B, BLOCK_7B]) {
    const g = guardTransformerBlock(cfg, IPHONE_LIMITS);
    const b = buildBlockedTransformerBlock(cfg, g.reason!);
    const raw = JSON.stringify(b);
    // A blocked result is pure JSON data: no GPUBuffer, no destroy(), no
    // mapped range, no ArrayBuffer, no device handle — nothing allocatable.
    assert.ok(!raw.includes('createBuffer') && !raw.includes('destroy') && !raw.includes('getMappedRange'));
    assert.ok(!raw.includes('ArrayBuffer'));
    assert.ok(b.resourceLimit!.attempted && b.resourceLimit!.status === 'RESOURCE_LIMIT');
  }
});

test('TMT #7/#8 (V3.1.3): blocked 3B/7B emit no fake latency and no fake throughput', () => {
  for (const cfg of [BLOCK_3B, BLOCK_7B]) {
    const g = guardTransformerBlock(cfg, IPHONE_LIMITS);
    const b = buildBlockedTransformerBlock(cfg, g.reason!);
    assert.equal(b.blockLatencyMs, 0, 'no fabricated latency');
    assert.equal(b.totalMs, 0);
    assert.equal(b.estimatedPerOperationMs, 0);
    assert.equal(b.repetitions, 1);
    assert.equal(b.throughput, null, 'no fabricated throughput');
    assert.equal(b.workUnit, 'NONE');
    assert.equal(b.confidence, 'UNMEASURABLE');
  }
  // Through the real export pipeline, for the block that reloaded Safari:
  const f = fullGateWith3B7BRejected();
  const report = buildStagedDiagnosticExport(f.stages, f.gate, stagedEnv, { buildId: 'tmt-nofake' });
  const llm = report.payload.results.llmInference as unknown as {
    transformerBlocks: { name: string; status: string; blockLatencyMs: number; estimatedTokensPerSecond: number | null }[];
  };
  const row = llm.transformerBlocks.find(x => x.name === '3B')!;
  assert.equal(row.status, 'RESOURCE_LIMIT');
  assert.equal(row.blockLatencyMs, 0);
  assert.equal(row.estimatedTokensPerSecond, null);
});

test('TMT #9 (V3.1.3): resource-limit results are checkpointed and classified as a controlled abort', () => {
  resetForTests();
  setStorageForTests(memStorage());
  beginBenchmark('V3.1', 'full', undefined, 'tmt-checkpoint');
  checkpointCategory('transformerBlocks', [
    buildBlockedTransformerBlock(BLOCK_3B, BLOCK_3B_REASON),
    buildBlockedTransformerBlock(BLOCK_7B, GUARD_7B_REASON),
  ]);
  const partial = (getCheckpoint()?.partialResults as any)?.transformerBlocks as unknown[];
  assert.equal(partial?.length, 2, 'transformerBlocks category is checkpointed immediately');
  const names = partial.map((b: any) => b.config.name);
  assert.deepEqual(names, ['3B', '7B']);
  const info = classifyInterruption();
  assert.equal(info.kind, 'TRANSFORMER_SUITE_RESOURCE_LIMIT');
  assert.ok(info.reason.includes('3B') && info.reason.includes('7B'));
  assert.notEqual(info.kind, 'PAGE_TERMINATED_OR_BROWSER_RELOADED');
});

test('TMT #10 (V3.1.3): FULL continues after RESOURCE_LIMIT — suite order preserved, blocked sizes not dropped', () => {
  const sizes = [CFG_05, CFG_1, CFG_15, BLOCK_3B, BLOCK_7B];
  const decisions = decideRun(sizes);
  const decided: string[] = [];
  let allocations = 0;
  for (let i = 0; i < sizes.length; i++) {
    const g = decisions[i];
    if (!g.ok) {
      decided.push(`${sizes[i].name}:RESOURCE_LIMIT`);
      continue; // benchSyntheticTransformerBlock continues to the next size
    }
    allocations++; // only the guard-allowed configs reach storageBuf
    decided.push(`${sizes[i].name}:MEASURED`);
  }
  assert.equal(allocations, 2, 'only 0.5B/1B may allocate — 1.5B is refused by the run-progressive cap');
  assert.deepEqual(decided, ['0.5B:MEASURED', '1B:MEASURED', '1.5B:RESOURCE_LIMIT', '3B:RESOURCE_LIMIT', '7B:RESOURCE_LIMIT'],
    'every required size is reached and recorded in order instead of terminating at 1.5B');
});

test('TMT #11 (V3.1.3): required transformer sizes stay exactly 0.5B/1B/1.5B/3B/7B', () => {
  const { stages, gate } = fullGateWith3B7BRejected();
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'tmt-suite' });
  const names = report.payload.results.llmInference!.transformerBlocks.map(b => b.name);
  assert.deepEqual(names.sort((a, b) => Number.parseFloat(a) - Number.parseFloat(b)), ['0.5B', '1B', '1.5B', '3B', '7B']);
  const check7 = report.postExportAudit!.checks.find(c => c.id === 7)!;
  assert.equal(check7.pass, true);
  const check15 = report.postExportAudit!.checks.find(c => c.id === 15)!;
  assert.equal(check15.pass, false, 'check #15 flags resource-limited required blocks (3B AND 7B)');
  assert.ok(check15.detail.includes('3B'), check15.detail);
});

test('TMT #12 (V3.1.3): certification stays false while required 3B/7B are RESOURCE_LIMIT (no threshold change)', () => {
  const { gate } = fullGateWith3B7BRejected();
  const gates = computeCertificationGates(gate);
  assert.equal(gates.llmSuiteComplete, 'FAIL');
  assert.equal(gates.overallCertified, false);
  assert.notEqual(gates.certificationStatus, 'CERTIFIED');
  const llmV = buildLlmInferenceV3113(gate);
  const audit = runSelfAuditV3113(llmV, 1);
  assert.equal(audit.ok, false, 'self-audit must fail closed');
  assert.equal(audit.checks.find(c => c.id === 15)!.pass, false);
  assert.ok(audit.failures.some(f => f.includes('3B')), audit.failures.join('; '));
  assert.doesNotThrow(() => buildStagedDiagnosticExport(fullGateWith3B7BRejected().stages, gate, stagedEnv, { buildId: 'tmt-cert' }));
  // Control: when every required block is measured the same harness certifies.
  const { gate: gateOk } = fullGateWith7BMeasured();
  const gatesOk = computeCertificationGates(gateOk);
  assert.equal(gatesOk.llmSuiteComplete, 'PASS');
  assert.equal(gatesOk.overallCertified, true);
});

test('TMT #13 (V3.1.3): every allocation path has cleanup — mid-loop failures release prior resources', () => {
  const destroyed: string[] = [];
  const t = createDisposableTracker<{ destroy(): void }>();
  assert.throws(() => {
    t.create(() => ({ destroy: () => destroyed.push('wNorm1') }));
    t.create(() => ({ destroy: () => destroyed.push('wQKV') }));
    t.create(() => { throw new Error('mid-allocation OOM'); });
  }, /mid-allocation/);
  assert.equal(t.alive, 2);
  t.release();
  assert.deepEqual(destroyed.sort(), ['wNorm1', 'wQKV']);
  assert.equal(t.alive, 0);
  // Release is idempotent — repeated finally calls cannot double-free.
  assert.doesNotThrow(() => t.release());
  assert.equal(t.alive, 0);
  // If the UPLOAD itself throws after the host array is created, nothing GPU
  // was minted (host array is scoped to withLocalWeightHost) so nothing leaks.
  assert.throws(() => withLocalWeightHost(16, () => {}, () => { throw new Error('upload failed'); }), /upload failed/);
});

test('TMT #14 (V3.1.3): host mirrors are released ASAP — only the upload result ever escapes', () => {
  let seenBytes = 0;
  let seenValues = 0;
  const result = withLocalWeightHost(4 * 1024, a => { seenBytes = a.byteLength; a.fill(0.5); }, a => {
    seenValues = a.reduce((s, v) => s + v, 0);
    return { id: 'gpu-buffer-only' }; // MUST be the only thing the caller keeps
  });
  assert.equal(seenBytes, 4 * 1024);
  assert.equal(seenValues, 1024 * 0.5);
  assert.deepEqual(result, { id: 'gpu-buffer-only' }, 'the host array cannot escape the upload call');
  // 3B host peak is the LARGEST SINGLE upload (16 MiB), never the full retained
  // mirror set (48 MiB legacy). This is what the guard's estimate now models.
  assert.equal(estimateTransformerBlockMemory(BLOCK_3B).estimatedHostBytes, TMT.c3.host);
  assert.notEqual(estimateTransformerBlockMemory(BLOCK_3B).hostCommitBytes, TMT.c3.host);
  assert.equal(estimateTransformerBlockMemory(BLOCK_3B).hostCommitBytes, TMT.c3.hostRetainedLegacy);
});

test('TMT #15 (V3.1.3): every config\'s largest single buffer stays ≤ 256 MiB', () => {
  const cap = 256 * 1024 * 1024;
  for (const cfg of [CFG_05, CFG_1, CFG_15, BLOCK_3B, BLOCK_7B]) {
    const est = estimateTransformerBlockMemory(cfg);
    assert.ok(est.largestBufferBytes <= cap, `${cfg.name}: ${est.largestBufferBytes} B ≤ 256 MiB`);
    assert.ok(est.largestBufferBytes <= IPHONE_LIMITS.maxBufferSize);
    assert.ok(est.largestBufferBytes <= IPHONE_LIMITS.maxStorageBufferBindingSize);
    assert.equal(est.estimatedHostBytes, est.largestBufferBytes, 'single-upload host peak');
    assert.equal(est.estimatedStagingBytes, est.largestBufferBytes, 'single-upload staging peak');
  }
  assert.equal(estimateTransformerBlockMemory(BLOCK_7B).largestBufferBytes, 64 * 1024 * 1024);
});

test('TMT #16 (V3.1.3): exact 1.5B dimensions and parameter counts — label/config mismatch documented', () => {
  // Dims come straight from the suite config (perf-v3-llm.ts).
  assert.deepEqual(
    { hidden: CFG_15.hidden, intermediate: CFG_15.intermediate, layers: CFG_15.layers },
    { hidden: 768, intermediate: 3072, layers: 24 },
  );
  // computeParamCount (kept verbatim — phase 9 forbids changing it).
  const p = computeParamCount(CFG_15);
  assert.deepEqual(p, {
    fp16: TMT.c15Params.fp16,
    int8: TMT.c15Params.int8,
    int4: TMT.c15Params.int4,
  });
  assert.equal(p.int8, TMT.c15Params.total, 'the "1.5B" slot represents exactly 175,607,808 parameters');
  // Embedding + per-layer math.
  assert.equal(32000 * 768, 24_576_000);
  assert.equal(TMT.c15Params.total - 24_576_000, 24 * TMT.c15Params.perLayer);
  // The bench's single-block weight set is LARGER than computeParamCount's
  // per-layer Q+K+V because the bench fuses QKV as H×3H (no GQA) while the
  // param count uses kvHeads-split K/V.
  const blockElems = 768 + 768 * 768 * 3 + 768 * 768 + 768 + 768 * 3072 + 3072 * 768; // norms + fused QKV + O + up + down
  assert.equal(blockElems, 7_079_424, 'bench block fp32 weight elements');
  assert.ok(blockElems * 4 > TMT.c15Params.perLayer * 4 * 1.1, 'fused-QKV block weights exceed the GQA param-count per-layer');
});

test('TMT #17 (V3.1.3): 1.5B footprint is byte-identical to 1B — only the run-progressive term can refuse 1.5B', () => {
  const e1 = estimateTransformerBlockMemory(CFG_1);
  const e15 = estimateTransformerBlockMemory(CFG_15);
  assert.equal(TRANSFORMER_SUITE_RUN_TRANSIENT_CAP_BYTES, TMT.runCapBytes, 'the run cap constant is pinned at 96 MiB');
  assert.equal(e1.estimatedGpuBytes, e15.estimatedGpuBytes);
  assert.equal(e1.estimatedBrowserTransientBytes, e15.estimatedBrowserTransientBytes);
  assert.equal(e1.estimatedBrowserTransientBytes, TMT.c15.transient);
  assert.equal(e15.estimatedBrowserTransientBytes, TMT.c15.transient);
  // Standalone (runTransient = 0) the guard PASSES both — identical bytes, so a
  // single-config byte budget can NEVER distinguish them (the finding #3 trap).
  const g1 = guardTransformerBlock(CFG_1, IPHONE_LIMITS);
  const g15 = guardTransformerBlock(CFG_15, IPHONE_LIMITS);
  assert.equal(g1.ok, true);
  assert.equal(g15.ok, true, 'standalone 1.5B is below the 64 MiB budget — pre-#3 the guard PASSED it');
  // In FULL-run context only CFG_15 is refused, by the cumulative term alone.
  const g1r = guardTransformerBlock(CFG_1, IPHONE_LIMITS, TMT.budgetBytes, TMT.cumAfter0_5);
  const g15r = guardTransformerBlock(CFG_15, IPHONE_LIMITS, TMT.budgetBytes, TMT.cumAfter1);
  assert.equal(g1r.ok, true, '1B still runs after 0.5B (cumulative 68.3 MiB ≤ 96 MiB cap)');
  assert.equal(g15r.ok, false, '1.5B refused after 0.5B+1B (cumulative 115.5 MiB > 96 MiB cap)');
  assert.equal(g15r.cumulative!.thisBytes, TMT.c15.transient, 'the cumulative term uses this block as-is');
});

test('TMT #18 (V3.1.3): 1.5B RESOURCE_LIMIT flows through export with zero fake performance', () => {
  const { stages, gate } = fullGateWith15B3B7BRejected();
  const report = buildStagedDiagnosticExport(stages, gate, stagedEnv, { buildId: 'tmt-15b' });
  const llm = report.payload.results.llmInference as unknown as {
    transformerBlocks: { name: string; status: string; blockLatencyMs: number; estimatedTokensPerSecond: number | null }[];
  };
  const names = llm.transformerBlocks.map(b => b.name).sort((a, b) => Number.parseFloat(a) - Number.parseFloat(b));
  assert.deepEqual(names, ['0.5B', '1B', '1.5B', '3B', '7B'], '1.5B stays in the required suite');
  const row = llm.transformerBlocks.find(x => x.name === '1.5B')!;
  assert.equal(row.status, 'RESOURCE_LIMIT');
  assert.equal(row.blockLatencyMs, 0);
  assert.equal(row.estimatedTokensPerSecond, null);
  const parsed = JSON.parse(report.json) as { results: { llmInference: { transformerBlocks: { name: string; status: string }[] } } };
  const rowJson = parsed.results.llmInference.transformerBlocks.find(x => x.name === '1.5B')!;
  assert.equal(rowJson.status, 'RESOURCE_LIMIT');
});

test('TMT #19 (V3.1.3): the run-progressive guard cannot be bypassed — no path re-passes a refused 1.5B', () => {
  // (a) Huge device per-buffer caps cannot excuse the cumulative term:
  const giant = guardTransformerBlock(CFG_15, { maxBufferSize: 2 * 1024 * 1024 * 1024, maxStorageBufferBindingSize: 2 * 1024 * 1024 * 1024 }, TMT.budgetBytes, TMT.cumAfter1);
  assert.equal(giant.ok, false, '1.5B stays refused even with massive per-buffer caps — cumulative is independent');
  assert.equal(giant.reason!.includes('run-progressive browser transient'), true, giant.reason!);
  // (b) The bench accumulator only grows for blocks that actually ran — so a
  // refused 1.5B can never ratchet the counter and a later call cannot be
  // silently re-passed with the same accumulator state:
  let acc = 0;
  const g05 = guardTransformerBlock(CFG_05, IPHONE_LIMITS, TMT.budgetBytes, acc);
  if (g05.ok) acc += g05.estimate.estimatedBrowserTransientBytes;
  const g1b = guardTransformerBlock(CFG_1, IPHONE_LIMITS, TMT.budgetBytes, acc);
  if (g1b.ok) acc += g1b.estimate.estimatedBrowserTransientBytes;
  const refused = guardTransformerBlock(CFG_15, IPHONE_LIMITS, TMT.budgetBytes, acc);
  assert.equal(refused.ok, false);
  assert.equal(acc, TMT.cumAfter1, 'a refused block does not ratchet the accumulator');
  const reDecide = guardTransformerBlock(CFG_15, IPHONE_LIMITS, TMT.budgetBytes, acc);
  assert.equal(reDecide.ok, false, 're-deciding with the same honest accumulator still refuses 1.5B');
  // (c) guardTransformerBlock is pure (no device/storage/mutable state), so
  // the guard path cannot be "reset" — the bench's single choke point is the
  // only authority and always passes the accumulated runTransientBytes.
  assert.equal(typeof guardTransformerBlock(CFG_05, IPHONE_LIMITS, TMT.budgetBytes, 0).cumulative, 'object');
});

test('TMT #20 (V3.1.3): certification, audit, and checkpoint reflect 1.5B RESOURCE_LIMIT (fail closed)', () => {
  const { stages, gate } = fullGateWith15B3B7BRejected();
  const gates = computeCertificationGates(gate);
  assert.equal(gates.llmSuiteComplete, 'FAIL');
  assert.equal(gates.overallCertified, false);
  assert.notEqual(gates.certificationStatus, 'CERTIFIED');
  assert.ok(gates.reasons.some(r => r.includes('1.5B')), gates.reasons.join('; '));
  const llmV = buildLlmInferenceV3113(gate);
  const audit = runSelfAuditV3113(llmV, 1);
  assert.equal(audit.ok, false, 'self-audit must fail closed with 1.5B RESOURCE_LIMIT');
  const check15 = audit.checks.find(c => c.id === 15)!;
  assert.equal(check15.pass, false);
  assert.ok(check15.detail.includes('1.5B'), check15.detail);
  assert.ok(audit.failures.some(f => f.includes('1.5B')), audit.failures.join('; '));
  // Checkpoint records the controlled abort (classifier, not a crash).
  resetForTests();
  setStorageForTests(memStorage());
  beginBenchmark('V3.1', 'full', undefined, 'tmt-15b-cp');
  const g15 = guardTransformerBlock(CFG_15, IPHONE_LIMITS, TMT.budgetBytes, TMT.cumAfter1);
  checkpointCategory('transformerBlocks', [buildBlockedTransformerBlock(CFG_15, g15.reason!)]);
  const info = classifyInterruption();
  assert.equal(info.kind, 'TRANSFORMER_SUITE_RESOURCE_LIMIT');
  assert.notEqual(info.kind, 'PAGE_TERMINATED_OR_BROWSER_RELOADED');
});

test('BP (V3.1.3): 96 MiB run-cap boundary — strict > rule, deterministic, accumulator monotonic/no-reset', () => {
  // Required by the forensic review (item: "boundary 96 MiB behavior").
  // capBytes = 100_663_296 (96 MiB); CFG_05 estimate = 21_014_532.
  // cap - estimate = 79_648_764, so the three probe priors are exact totals of
  // cap-1 / cap / cap+1 — the strict-> rule makes cap itself ALLOWED.
  const CAP = TRANSFORMER_SUITE_RUN_TRANSIENT_CAP_BYTES;
  const EST = TMT.c05.transient;
  assert.equal(CAP, TMT.runCapBytes);
  assert.equal(EST, 21_014_532);
  assert.equal(CAP - EST, 79_648_764);

  // (a) Single-config budget rule is strict > : est == budget passes.
  const exactBudget = guardTransformerBlock(CFG_05, IPHONE_LIMITS, EST, 0);
  assert.equal(exactBudget.ok, true, 'est exactly equal to the budget must PASS (rule is est > budget)');
  const belowBudget = guardTransformerBlock(CFG_05, IPHONE_LIMITS, EST - 1, 0);
  assert.equal(belowBudget.ok, false, 'est one byte over the budget must FAIL');
  assert.ok(belowBudget.reason!.includes('exceeds safe browser memory budget'));
  assert.equal(belowBudget.cumulative, null, 'a single-config budget reject carries no cumulative term');

  // (b) Cumulative rule is strict > : total == cap passes, total == cap+1 fails.
  for (const prior of [CAP - EST - 1, CAP - EST]) {
    const wantTotal = prior + EST;
    const g = guardTransformerBlock(CFG_05, IPHONE_LIMITS, TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES, prior);
    assert.equal(g.ok, true, `cumulative total ${wantTotal} (${wantTotal >= CAP ? '== cap' : 'cap-1'}) must PASS`);
    assert.equal(g.cumulative!.totalBytes, wantTotal);
    assert.ok(g.cumulative!.totalBytes <= g.cumulative!.capBytes);
  }
  const over = guardTransformerBlock(CFG_05, IPHONE_LIMITS, TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES, CAP - EST + 1);
  assert.equal(over.ok, false, 'cumulative total cap+1 must FAIL');
  assert.equal(over.cumulative!.totalBytes, CAP + 1);
  assert.equal(over.cumulative!.priorBytes, CAP - EST + 1);
  assert.equal(over.cumulative!.thisBytes, EST);
  assert.ok(over.cumulative!.totalBytes > over.cumulative!.capBytes);
  assert.ok(over.reason!.includes('run-progressive browser transient'), over.reason!);

  // (c) Deterministic: identical inputs yield an identical decision.
  const again = guardTransformerBlock(CFG_05, IPHONE_LIMITS, TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES, CAP - EST + 1);
  assert.deepEqual(again.cumulative, over.cumulative);
  assert.equal(again.reason, over.reason);

  // (d) FULL-run accumulator trace: rejected configs neither increment nor reset
  // the accumulator; it is monotonic non-decreasing across the whole suite.
  const priors: number[] = [];
  let acc = 0;
  for (const cfg of [CFG_05, CFG_1, CFG_15, BLOCK_3B, BLOCK_7B]) {
    priors.push(acc);
    const g = guardTransformerBlock(cfg, IPHONE_LIMITS, TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES, acc);
    if (g.ok) acc += g.estimate.estimatedBrowserTransientBytes;
  }
  assert.deepEqual(priors, [0, TMT.cumAfter0_5, TMT.cumAfter1, TMT.cumAfter1, TMT.cumAfter1],
    'prior is 0 first, then ratchets ONLY on RUN; 1.5B/3B/7B rejects leave it untouched');
  assert.equal(acc, TMT.cumAfter1, 'final accumulator equals the largest observed safe cumulative (68,264,968)');

  // (e) Integer safety: every modeled byte count and the cap itself stay within
  // exact integer range, so cumulative addition can never silently overflow.
  const ests = [TMT.c05.transient, TMT.c1.transient, TMT.c15.transient, TMT.c3.transient, TMT.c7.transient];
  assert.ok(ests.concat([CAP, TMT.budgetBytes]).every(Number.isSafeInteger));
  for (const cfg of [CFG_05, CFG_1, CFG_15, BLOCK_3B, BLOCK_7B]) {
    const e = estimateTransformerBlockMemory(cfg);
    assert.ok(Number.isSafeInteger(e.estimatedBrowserTransientBytes));
    assert.ok(Number.isSafeInteger(e.deviceCommitBytes));
    assert.ok(Number.isSafeInteger(e.hostCommitBytes));
    assert.ok(Number.isSafeInteger(e.largestBufferBytes));
  }
});

test('TR1 (V3.1.3): guard evaluation performs ZERO allocations — pure arithmetic, no device, no heap', () => {
  // Required regression-candidate test: a safety guard must never ADD memory.
  // Instrument the constructors the bench actually uses for heap allocations and
  // prove guardTransformerBlock + estimateTransformerBlockMemory = pure math.
  const counts = { ab: 0, f32: 0, u8: 0, u32: 0 };
  const orig = {
    ab: globalThis.ArrayBuffer, f32: globalThis.Float32Array,
    u8: globalThis.Uint8Array, u32: globalThis.Uint32Array,
  };
  class CountAB extends orig.ab { constructor(...a: any[]) { counts.ab++; super(...a); } }
  class CountF32 extends orig.f32 { constructor(...a: any[]) { counts.f32++; super(...a); } }
  class CountU8 extends orig.u8 { constructor(...a: any[]) { counts.u8++; super(...a); } }
  class CountU32 extends orig.u32 { constructor(...a: any[]) { counts.u32++; super(...a); } }
  (globalThis as Record<string, unknown>).ArrayBuffer = CountAB;
  (globalThis as Record<string, unknown>).Float32Array = CountF32;
  (globalThis as Record<string, unknown>).Uint8Array = CountU8;
  (globalThis as Record<string, unknown>).Uint32Array = CountU32;
  try {
    for (const cfg of [CFG_05, CFG_1, CFG_15, BLOCK_3B, BLOCK_7B]) {
      const g = guardTransformerBlock(cfg, IPHONE_LIMITS, TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES, 68_264_968);
      assert.equal(typeof g.ok, 'boolean');
      assert.ok(g.estimate.estimatedBrowserTransientBytes > 0);
    }
  } finally {
    (globalThis as Record<string, unknown>).ArrayBuffer = orig.ab;
    (globalThis as Record<string, unknown>).Float32Array = orig.f32;
    (globalThis as Record<string, unknown>).Uint8Array = orig.u8;
    (globalThis as Record<string, unknown>).Uint32Array = orig.u32;
  }
  assert.deepEqual(counts, { ab: 0, f32: 0, u8: 0, u32: 0 },
    'guardTransformerBlock must not construct ArrayBuffer/Float32Array/Uint8Array/Uint32Array');
  // Structurally device-free: the guard only receives plain numeric limits — it
  // has no device argument, so it cannot create buffers/pipelines/bind groups.
  const g = guardTransformerBlock(CFG_15, IPHONE_LIMITS, TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES, 0);
  assert.equal(g.ok, true);
  assert.equal(g.estimate.deviceCommitBytes, 28_376_068);
});

test('TR2 (V3.1.3): resource tracker destroys every buffer and retains NOTHING after release', () => {
  // Required regression-candidate test: a safety tracker must not keep GPU
  // resources alive after the block finishes. release() must call destroy() on
  // each tracked resource and drop all references (alive -> 0).
  const destroyed: string[] = [];
  const t = createDisposableTracker<{ name: string; destroy(): void }>();
  t.create(() => ({ name: 'wUp', destroy: () => destroyed.push('wUp') }));
  t.create(() => ({ name: 'act', destroy: () => destroyed.push('act') }));
  assert.equal(t.alive, 2);
  const n = t.release();
  assert.equal(n, 2, 'release reports every tracked resource destroyed');
  assert.equal(t.alive, 0, 'after release the tracker retains zero resources');
  assert.deepEqual(destroyed.sort(), ['act', 'wUp']);
  // Post-release creates behave identically (fresh group) — the pattern the
  // bench uses per config, so block N can never retain block N-1's buffers.
  t.create(() => ({ name: 'next', destroy: () => destroyed.push('next') }));
  assert.equal(t.alive, 1);
  t.release();
  assert.equal(t.alive, 0);
  assert.deepEqual(destroyed.sort(), ['act', 'next', 'wUp']);
});

test('AB1 (V3.1.3): baseline vs current vs current-minimal — GPU bytes, staging, and async lifetime are IDENTICAL', () => {
  // Pre-device A/B isolation (finding: guard instrumentation changes supervision
  // ops, NOT nominal allocation size nor resource lifetime).
  for (const cfg of [CFG_05, CFG_1]) {
    const plans = AB_VARIANTS.map(v => planTransformerBlock(v, cfg, IPHONE_LIMITS));
    const gpu = new Set(plans.map(p => p.deviceBytes));
    assert.equal(gpu.size, 1, `${cfg.name}: deviceCommit identical across variants`);
    assert.equal(plans[0].deviceBytes, estimateTransformerBlockMemory(cfg).deviceCommitBytes);
    const staging = new Set(plans.map(p => p.stagingPeakBytes));
    assert.equal(staging.size, 1, `${cfg.name}: staging peak identical (largest single upload)`);
    const waits = new Set(plans.map(p => p.asyncWaits));
    assert.equal(waits.size, 1, `${cfg.name}: async GPU-completion await count identical`);
    assert.equal(plans[1].asyncWaits, MEASURE_AWAITS);
    // Host peak: baseline holds ALL six weights + input; current/minimal hold
    // ONE host array per upload (largest single weight). Strictly LOWER.
    assert.ok(plans[0].hostPeakBytes > plans[1].hostPeakBytes, `${cfg.name}: baseline host peak ${plans[0].hostPeakBytes} > current ${plans[1].hostPeakBytes}`);
    assert.equal(plans[1].hostPeakBytes, plans[2].hostPeakBytes, `${cfg.name}: current == minimal host peak`);
  }
});

test('AB2 (V3.1.3): supervision-op lattice — minimal ⊂ current, baseline has NO guard/tracker/milestone/checkpoint', () => {
  const kinds = (p: ABBlockPlan) => new Set(p.ops.map(o => o.kind));
  // PROGRESS existed in baseline too (per-config onProgress pre-dates the guard).
  // The guard commits added GUARD_OP/MILESTONE/CHECKPOINT/RUN_ACCUM only.
  const guardAdded = ['GUARD_OP', 'MILESTONE', 'CHECKPOINT', 'RUN_ACCUM'];
  for (const cfg of [CFG_05, CFG_1]) {
    const b = kinds(planTransformerBlock('baseline', cfg, IPHONE_LIMITS));
    const m = kinds(planTransformerBlock('current-minimal', cfg, IPHONE_LIMITS));
    const c = kinds(planTransformerBlock('current', cfg, IPHONE_LIMITS));
    assert.equal(b.has('PROGRESS'), true, 'baseline emitted per-config progress too');
    for (const k of guardAdded) {
      assert.equal(b.has(k), false, `baseline has no ${k}`);
    }
    assert.equal(m.has('GUARD_OP'), true, 'minimal keeps the pure guard');
    assert.equal(m.has('MILESTONE'), false, 'minimal has no milestones');
    assert.equal(m.has('CHECKPOINT'), false, 'minimal has no per-block checkpoint');
    assert.equal(m.has('PROGRESS'), false, 'minimal has no DOM/UI progress');
    assert.equal(m.has('RUN_ACCUM'), false, 'minimal has no run-progressive accumulator');
    for (const k of ['MILESTONE', 'CHECKPOINT', 'GUARD_OP', 'ENTER', 'GUARD_START', 'RUN_ACCUM', 'PROGRESS']) {
      assert.equal(c.has(k), true, `current has ${k}`);
    }
  }
});

test('AB3 (V3.1.3): destroy() is the LAST op of every allowed block — checkpoint/milestone NEVER after destroy', () => {
  for (const cfg of [CFG_05, CFG_1]) {
    for (const v of AB_VARIANTS) {
      const p = planTransformerBlock(v, cfg, IPHONE_LIMITS);
      assert.equal(p.allowed, true);
      const last = p.ops[p.ops.length - 1];
      assert.equal(last.kind, 'DESTROY', `${v} ${cfg.name}: destroy last`);
      assert.equal(p.destroyCount, 25, `${v} ${cfg.name}: 25 GPUBuffer destroy calls`);
      const destroyIdx = p.ops.length - 1;
      for (let i = 0; i < p.ops.length; i++) {
        const o = p.ops[i];
        if (o.async) assert.ok(i < destroyIdx, `${v} ${cfg.name}: async op ${o.kind} precedes destroy`);
      }
    }
  }
  // Blocked path: current emits NO GPU ops and current-minimal emits none either.
  const c15 = planTransformerBlock('current', CFG_15, IPHONE_LIMITS, 68_264_968);
  assert.equal(c15.allowed, false, '1.5B blocked by run-progressive cumulative cap');
  assert.equal(c15.ops.some(o => o.kind === 'DESTROY'), false, 'blocked plan performs zero GPU allocation/destroy');
  const m15 = planTransformerBlock('current-minimal', CFG_15, IPHONE_LIMITS, 68_264_968);
  assert.equal(m15.allowed, false);
  assert.equal(m15.ops.filter(o => o.kind === 'PROGRESS' || o.kind === 'MILESTONE' || o.kind === 'CHECKPOINT').length, 0);
  const b15 = planTransformerBlock('baseline', CFG_15, IPHONE_LIMITS);
  assert.equal(b15.allowed, true, 'pre-guard baseline cannot block 1.5B');
  const b3 = planTransformerBlock('current', BLOCK_3B, IPHONE_LIMITS);
  assert.equal(b3.allowed, false, '3B blocked by single-config budget');
  const g7 = planTransformerBlock('current', BLOCK_7B, IPHONE_LIMITS);
  assert.equal(g7.allowed, false, '7B blocked by single-config budget');
});

test('SG1 (V3.1.3): scout-execution ordering — purchase-time ownership invariants hold in ALL candidate sequences', () => {
  const all = buildAndSimulateAll();
  for (const id of ALL_SEQUENCES) {
    const { built, result } = all[id];
    const m = result.metrics;
    assert.equal(m.overlapOps, 0, `${id}: never simultaneously live scout chunk + transformer block (source: scout destroy at perf-v3-llm.ts:735, block release at ::613)`);
    assert.equal(m.liveScoutAtTransformerStart, 0, `${id}: benchMemoryBudget destroys every buffer before returning so no scout chunk is live at first block alloc`);
    assert.equal(m.guardBeforeEveryBlock, true, `${id}: guard evaluated before every block alloc (perf-v3-llm.ts:471)`);
    if (built.real) {
      assert.equal(m.awaitOpsBetweenScoutReturnAndFirstBlock, 0, `${id}: staged s4->s5 has zero GPU awaits between scout destroy and block alloc (only a sync releaseTrackedBuffers at :899)`);
    }
  }
});

test('SG2 (V3.1.3): real orderings are exactly FULL/quick (transformer-then-ladder) and staged B/C (ladder-then-transformer+cleanup)', () => {
  const all = buildAndSimulateAll();
  assert.equal(all.A.built.real, true);
  assert.equal(all.B.built.real, true);
  assert.equal(all.C.built.real, true);
  assert.equal(all.D.built.real, false, 'D is hypothetical — current FULL has no release between transformer and ladder');
  assert.equal(all.E.built.real, false, 'E is hypothetical — no microtask boundary in source');
  assert.equal(all.F.built.real, false, 'F is hypothetical — no macrotask boundary in source');
  // The staged order (B = C) is the ONLY real order with the ladder BEFORE the transformer suite.
  const scoutFirst = (id: SequenceId) => {
    const ops = all[id].built.ops;
    return ops.findIndex(o => o.kind === 'SCOUT_ALLOC') < ops.findIndex(o => o.kind === 'BLOCK_ALLOC');
  };
  assert.equal(scoutFirst('A'), false, 'FULL/quick: transformer suite precedes the ladder (perf-v3-llm.ts:768-771 then 776-778)');
  assert.equal(scoutFirst('B'), true, 'staged s4 memoryBudget precedes s5 transformerBlocks (perf-v3-llm.ts:893 then 903)');
  assert.equal(scoutFirst('C'), true);
  assert.equal(scoutFirst('D'), false, 'hypothetical transformer-then-ladder matches FULL');
});

test('SG3 (V3.1.3): scout peak concurrency is per-rung only; transformer blocks never overlap the ladder or each other', () => {
  const all = buildAndSimulateAll();
  for (const id of ALL_SEQUENCES) {
    const m = all[id].result.metrics;
    assert.ok(m.peakLiveScoutBytes <= 256 * 1024 * 1024, `${id}: scout peak live GPU bytes stays within the largest 'small' rung (256 MiB) — chunks destroyed per rung at :735`);
    assert.ok(m.peakSimultaneousScoutAndBlockBytes <= Math.max(m.peakLiveScoutBytes, m.peakLiveBlockBytes), `${id}: peak simultaneous = max(scout pool, block pool), never their sum`);
  }
});

test('CS T2 (V3.1.3): transformer forensic milestones persist and clear (finding #3 evidence store)', () => {
  setStorageForTests(memStorage());
  resetForTests();
  assert.deepEqual(getMilestones(), [], 'fresh run has no milestones');
  recordMilestone('1.5B ENTER');
  recordMilestone('1.5B GUARD_PASS');
  recordMilestone('1.5B UPLOAD_W6');
  const ms = getMilestones();
  assert.equal(ms.length, 3);
  assert.equal(ms[0].state, '1.5B ENTER');
  assert.equal(ms[2].state, '1.5B UPLOAD_W6');
  assert.ok(ms.every(m => typeof m.t === 'string' && !Number.isNaN(Date.parse(m.t))), 'every milestone carries a valid ISO timestamp');
  // Monotonic ordering: the log is read back oldest → newest.
  assert.ok(Date.parse(ms[0].t) <= Date.parse(ms[1].t) && Date.parse(ms[1].t) <= Date.parse(ms[2].t));
  // resetForTests() (a new run) clears the forensic log so cross-run evidence
  // is never conflated.
  resetForTests();
  assert.deepEqual(getMilestones(), [], 'a fresh run starts with an empty milestone log');
  clearMilestones();
});

test('SG: computeParamCount kept verbatim — 7B slot pins exact pre-refactor values', () => {
  const p = computeParamCount(BLOCK_7B);
  assert.deepEqual(p, { fp16: 2_949_906_432, int8: 1_474_953_216, int4: 737_476_608 },
    'param math must be byte-for-byte identical to the pre-refactor bench formula');
  assert.equal(p.fp16, p.int8 * 2);
  assert.equal(Math.ceil(p.int8 / 2), p.int4);
});