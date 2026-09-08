// AETHER GPU Benchmark — Isolated Phase Softmax Regression Test (Node, no GPU required)
//
// Guards the phase-split attention SOFTMAX diagnostics in
// src/benchmark/phase-softmax-isolated.ts:
//   - the SOFTMAX / ATTN_QKT WGSL identity must not drift
//   - dispatch dims for seq=4/16/64/128/256 are exactly 1 / 1 / 1 / 2 / 4 workgroups
//   - the CPU reference (buildIsolatedRefs) is deterministic and row-stochastic
//   - uniform decoding of the REAL ArrayBuffers proves that binding the ATTENTION
//     uniform to the SOFTMAX pipeline decodes as { rows=batch, cols=seq } — the
//     suspected benchmark harness defect reproduced without a GPU
//   - the softmax/QKT validators flag sentinel residue, row-sum drift and non-finiteness
//   - the final diagnosis selector (TASK 18) picks the right breadcrumb
//
// Run: npm test
import { strict as assert } from 'node:assert';

import { SOFTMAX, softmaxWorkgroups, softmaxDispatchInfo, assertSoftmaxDispatch, ATTENTION_OUTPUT_SENTINEL } from '../src/benchmark/kernels.ts';
import { ATTN_QKT } from '../src/benchmark/perf-kernels.ts';
import { createSoftmaxUniform, createAttentionUniform } from '../src/benchmark/uniforms.ts';
import {
  buildIsolatedRefs,
  decodeRowsCols,
  decodeAttention,
  isolatedWgInfo,
  checkQktOutput,
  checkSoftmaxOutput,
  summarizeReports,
  type IsolatedPhaseReport,
} from '../src/benchmark/phase-softmax-isolated.ts';

const SEQS = [4, 16, 64, 128, 256];
const DIM = 64;

// ─── WGSL identity ───

assert.ok(SOFTMAX.includes('struct Uniforms { rows: u32, cols: u32 }'), 'SOFTMAX must keep { rows, cols } uniform struct');
assert.ok(SOFTMAX.includes('@workgroup_size(64)'), 'SOFTMAX must stay @workgroup_size(64)');
assert.ok(SOFTMAX.includes('let row = gid.x'), 'SOFTMAX must be row-parallel via gid.x');
assert.ok(SOFTMAX.includes('if (row >= u.rows) { return; }') || SOFTMAX.includes('if (row >= u.rows) { return }'), 'SOFTMAX must guard row >= u.rows');

assert.ok(ATTN_QKT.includes('struct Uniforms { batch: u32, seq: u32, dim: u32, scale: f32 }'), 'ATTN_QKT must keep attention uniform struct');
assert.ok(ATTN_QKT.includes('let i = gid.x'), 'ATTN_QKT must use gid.x for row');
assert.ok(ATTN_QKT.includes('let b = gid.y'), 'ATTN_QKT must use gid.y for batch');

// ─── dispatch dimensions (TASK 6) ───

const EXPECTED_WGX: Record<number, number> = { 4: 1, 16: 1, 64: 1, 128: 2, 256: 4 };
for (const seq of SEQS) {
  const wg = softmaxWorkgroups(seq);
  assert.deepStrictEqual(Array.from(wg), [EXPECTED_WGX[seq], 1, 1], `softmaxWorkgroups(${seq})`);
  const info = softmaxDispatchInfo(seq);
  assert.strictEqual(info.rows, seq);
  assert.strictEqual(info.workgroupSize, 64);
  assert.strictEqual(info.workgroupsX, EXPECTED_WGX[seq]);
  assert.strictEqual(info.totalInvocations, EXPECTED_WGX[seq] * 64);
  assert.strictEqual(assertSoftmaxDispatch(seq).totalInvocations, EXPECTED_WGX[seq] * 64);

  const iso = isolatedWgInfo(seq);
  assert.strictEqual(iso.rows, seq);
  assert.strictEqual(iso.workgroupsX, EXPECTED_WGX[seq], `isolatedWgInfo(${seq}).workgroupsX`);
  assert.strictEqual(iso.totalInvocations, EXPECTED_WGX[seq] * 64, `isolatedWgInfo(${seq}).totalInvocations`);
}

// ─── CPU reference determinism + row-stochasticity ───

for (const seq of SEQS) {
  const a = buildIsolatedRefs(seq, DIM, 1);
  const b = buildIsolatedRefs(seq, DIM, 1);
  assert.deepStrictEqual(Array.from(a.Q), Array.from(b.Q), `buildIsolatedRefs(${seq}) deterministic Q`);
  assert.deepStrictEqual(Array.from(a.K), Array.from(b.K), `buildIsolatedRefs(${seq}) deterministic K`);
  assert.deepStrictEqual(Array.from(a.scores), Array.from(b.scores), `buildIsolatedRefs(${seq}) deterministic scores`);
  assert.deepStrictEqual(Array.from(a.probs), Array.from(b.probs), `buildIsolatedRefs(${seq}) deterministic probs`);
  assert.strictEqual(a.Q.length, seq * DIM);
  assert.strictEqual(a.scores.length, seq * seq);
  assert.strictEqual(a.probs.length, seq * seq);
  assert.strictEqual(a.scale, 1 / Math.sqrt(DIM));
  assert.ok(a.probs.every((p) => Number.isFinite(p)), `probs ${seq} all finite`);

  const sums = new Float32Array(seq);
  for (let i = 0; i < seq * seq; i++) sums[Math.floor(i / seq)] += a.probs[i];
  for (let r = 0; r < seq; r++) {
    assert.ok(Math.abs(sums[r] - 1) < 1e-4, `ref probs row ${r} of seq=${seq} sums to ~1 (got ${sums[r]})`);
  }
}

// ─── uniform decoding of REAL payloads (TASK 15 + harness-mismatch signature) ───

assert.deepStrictEqual(decodeRowsCols(createSoftmaxUniform(256, 256)), { rows: 256, cols: 256 });
assert.deepStrictEqual(decodeRowsCols(createSoftmaxUniform(4, 4)), { rows: 4, cols: 4 });
assert.deepStrictEqual(decodeRowsCols(createSoftmaxUniform(128, 128)), { rows: 128, cols: 128 });

// The benchmark's setupAttention() binds the ATTENTION uniform to the SOFTMAX
// pipeline; decoded as {u32[0], u32[1]} this yields { rows=batch, cols=seq }.
assert.deepStrictEqual(decodeRowsCols(createAttentionUniform(1, 256, 64, 0.125)), { rows: 1, cols: 256 });
assert.deepStrictEqual(decodeRowsCols(createAttentionUniform(1, 4, 64, 0.125)), { rows: 1, cols: 4 });
assert.deepStrictEqual(decodeAttention(createAttentionUniform(1, 128, 64, 0.125)), { batch: 1, seq: 128, dim: 64, scale: 0.125 });

// ─── validators ───

for (const seq of SEQS) {
  const refs = buildIsolatedRefs(seq, DIM, 1);

  const qktOk = checkQktOutput(refs.scores, refs.scores);
  assert.strictEqual(qktOk.pass, true, `checkQktOutput correct seq=${seq}`);
  assert.strictEqual(qktOk.diagnosis, 'QKT PASS');
  assert.strictEqual(qktOk.maxAbsError, 0);
  assert.strictEqual(qktOk.expectedLength, seq * seq);

  const qktBad = checkQktOutput(new Float32Array(seq * seq).fill(0), refs.scores);
  assert.strictEqual(qktBad.pass, false, `checkQktOutput zeroed seq=${seq}`);
  assert.strictEqual(qktBad.diagnosis, 'PHASE QKT FAILURE');

  const softOk = checkSoftmaxOutput(refs.probs, refs.probs, seq, seq);
  assert.strictEqual(softOk.pass, true, `checkSoftmaxOutput correct seq=${seq}`);
  assert.strictEqual(softOk.diagnosis, 'SOFTMAX PASS');
  assert.strictEqual(softOk.sentinelCount, 0, `sentinelCount clean seq=${seq}`);
  assert.ok(Math.abs(softOk.rowSumMin - 1) < 1e-6 && Math.abs(softOk.rowSumMax - 1) < 1e-6, `row sums ~1 seq=${seq}`);

  const tampered = refs.probs.slice();
  for (let i = 0; i < seq; i++) tampered[i] = ATTENTION_OUTPUT_SENTINEL;
  const softBad = checkSoftmaxOutput(tampered, refs.probs, seq, seq);
  assert.strictEqual(softBad.pass, false, `sentinel tampering detected seq=${seq}`);
  assert.strictEqual(softBad.sentinelCount, seq, `sentinel scan seq=${seq}`);
  assert.strictEqual(softBad.diagnosis, 'PHASE SOFTMAX ENGINE FAILURE');
}

// ─── diagnosis selector (TASK 12 / TASK 18) ───

function fakeReport(managerSoft: boolean, directSoft: boolean, reproSoft: boolean, qktOk = true): IsolatedPhaseReport {
  const expQktOk = qktOk
    ? { pass: true, diagnosis: 'QKT PASS' }
    : { pass: false, diagnosis: 'PHASE QKT FAILURE' } as unknown;
  const mk = (softPass: boolean) =>
    ({
      seq: 64,
      readback: 'manager',
      sharedUniform: false,
      qkt: expQktOk,
      qktUniform: { batch: 1, seq: 64, dim: 64, scale: 0.125 },
      softmax: softPass ? { pass: true, diagnosis: 'SOFTMAX PASS' } : { pass: false, diagnosis: 'PHASE SOFTMAX ENGINE FAILURE' },
      softmaxUniform: { rows: 64, cols: 64, rowsExpected: 64, colsExpected: 64, correct: true },
      wgInfo: { rows: 64, workgroupSize: 64, workgroupsX: 1, totalInvocations: 64 },
      bufferInfo: { scoresBytes: 16384, probsBytes: 16384, expectedBytes: 16384, distinct: true },
      diagnosis: softPass ? 'ISOLATED PHASE PASS' : 'GPU PHASE SOFTMAX EXECUTION',
    }) as IsolatedPhaseReport['manager'];
  const mkRepro = (softPass: boolean) =>
    ({
      seq: 64,
      readback: 'manager',
      sharedUniform: true,
      qkt: expQktOk,
      qktUniform: { batch: 1, seq: 64, dim: 64, scale: 0.125 },
      softmax: softPass ? { pass: true, diagnosis: 'SOFTMAX PASS' } : { pass: false, diagnosis: 'PHASE SOFTMAX ENGINE FAILURE' },
      // The repro now binds a dedicated softmax uniform → decodes { rows: seq, cols: seq }.
      softmaxUniform: { rows: 64, cols: 64, rowsExpected: 64, colsExpected: 64, correct: true },
      wgInfo: { rows: 64, workgroupSize: 64, workgroupsX: 1, totalInvocations: 64 },
      bufferInfo: { scoresBytes: 16384, probsBytes: 16384, expectedBytes: 16384, distinct: true },
      diagnosis: softPass ? 'ISOLATED PHASE PASS' : 'GPU PHASE SOFTMAX EXECUTION',
    }) as IsolatedPhaseReport['manager'];
  return {
    seq: 64,
    manager: mk(managerSoft),
    direct: mk(directSoft),
    repro: mkRepro(reproSoft),
    overall: '',
  };
}

// All three paths (manager / direct / repro) pass → phase softmax fully PASS,
// no harness interaction remains.
assert.strictEqual(summarizeReports([fakeReport(true, true, true)]), 'BENCHMARK HARNESS INTERACTION');
assert.strictEqual(summarizeReports([fakeReport(true, true, false)]), 'BENCHMARK HARNESS INTERACTION');

// Both readbacks fail the softmax → GPU EXECUTION.
assert.strictEqual(summarizeReports([fakeReport(false, false, false)]), 'GPU PHASE SOFTMAX EXECUTION');

// Manager fails but direct passes → READBACK MANAGER.
assert.strictEqual(summarizeReports([fakeReport(false, true, false)]), 'READBACK MANAGER INTERACTION');

// QKT failure anywhere → PHASE QKT FAILURE (wins over every other diagnosis).
assert.strictEqual(summarizeReports([fakeReport(true, true, false, false)]), 'PHASE QKT FAILURE');

console.log('regression-phase-isolated: OK');