// AETHER GPU Benchmark — Harness Architecture Regression Test (Node, no GPU required)
//
// TASK 20 (CPU half): proves the benchmark harness contracts that do not need a
// GPU:
//   - the phase dispatch dims table is exactly ceil(seq/64) in X for all phases
//   - the harness SOFTMAX uniform payload decodes as { rows=seq, cols=seq } while
//     the ATTENTION uniform decodes as { batch=1, seq, dim, scale } — i.e. the
//     old one-uniform-for-both bug is structurally gone
//   - harnessCounters counts warmup / measurement / sync submissions separately,
//     reports full-tensor readbacks and completion reads, and PROVES mapAsync
//     overlap when two maps are active at once
//
// Run: npm test
import { strict as assert } from 'node:assert';

import { attentionPhaseDispatch, ATTN_QKT, ATTN_PV, runAttentionPhaseCorrectness, createBenchmarkAttentionContext, measureAttentionPhasePerformance } from '../src/benchmark/perf-kernels.ts';
import { completionTokenContract } from '../src/benchmark/completion.ts';
import { harnessCounters } from '../src/benchmark/harness-counters.ts';
import { createSoftmaxUniform, createAttentionUniform } from '../src/benchmark/uniforms.ts';
import { decodeRowsCols, decodeAttention } from '../src/benchmark/phase-softmax-isolated.ts';

const SEQS = [4, 16, 64, 128, 256];
const DIM = 64;

// ─── dispatch dims (TASK 11 contract) ───

for (const seq of SEQS) {
  const d = attentionPhaseDispatch(seq, DIM, 1);
  const expectedX = Math.ceil(seq / 64);
  assert.deepEqual(d.wgQ, [expectedX, 1, 1], `QKT dispatch for seq=${seq}`);
  assert.deepEqual(d.wgSoft, [expectedX, 1, 1], `softmax dispatch for seq=${seq}`);
  assert.deepEqual(d.wgP, [expectedX, DIM, 1], `PV dispatch for seq=${seq}`);
  assert.equal(d.scoresBytes, seq * seq * 4, `scores bytes seq=${seq}`);
  assert.equal(d.outBytes, seq * DIM * 4, `out bytes seq=${seq}`);
}

// ─── harness SOFTMAX uniform is { rows, cols }, never the attention struct ───

for (const seq of SEQS) {
  const softPayload = createSoftmaxUniform(seq, seq);
  const decoded = decodeRowsCols(softPayload);
  assert.deepEqual(decoded, { rows: seq, cols: seq }, `softmax uniform decode seq=${seq}`);

  const attnPayload = createAttentionUniform(1, seq, DIM, 1 / Math.sqrt(DIM));
  const attn = decodeAttention(attnPayload);
  assert.equal(attn.batch, 1, 'attention batch field');
  assert.equal(attn.seq, seq, 'attention seq field');
  // THE BUG: binding the attention struct to SOFTMAX decodes as rows=batch=1.
  assert.notEqual(decoded.rows, attn.batch || 1, `softmax rows must equal seq, not batch (seq=${seq})`);
}

// ─── harness counters: submission classification + map overlap proof ───

harnessCounters.reset();
harnessCounters.onCommandBufferCreated();
harnessCounters.onCommandBufferSubmitted('warmup');
harnessCounters.onCommandBufferSubmitted('warmup');
harnessCounters.onCommandBufferSubmitted('warmup');
harnessCounters.onCommandBufferSubmitted('measurement');
harnessCounters.onCommandBufferCreated();
harnessCounters.onCommandBufferSubmitted('measurement');
harnessCounters.onCommandBufferSubmitted('sync');
harnessCounters.onReadbackOperation();
const s0 = harnessCounters.snapshot();
assert.equal(s0.commandBuffersCreated, 2, 'created count');
assert.equal(s0.commandBuffersSubmitted, 6, 'submitted count');
assert.equal(s0.warmupSubmissions, 3, 'warmup count');
assert.equal(s0.measurementSubmissions, 2, 'measurement count');
assert.equal(s0.syncSubmissions, 1, 'sync count');
assert.equal(s0.readbackOperations, 1, 'readback count');
assert.equal(s0.completionReads, 0, 'completion reads before');

harnessCounters.onMapBegin();
harnessCounters.onMapBegin(); // overlapping map → must be flagged
assert.ok(harnessCounters.snapshot().mapOverlapDetected, 'overlapping mapAsync must be detected');
harnessCounters.onMapEnd();
harnessCounters.onMapEnd();
harnessCounters.onCompletionRead();
const s1 = harnessCounters.snapshot();
assert.equal(s1.completionReads, 1, 'completion reads after');
assert.equal(s1.peakMappedConcurrent, 2, 'peak mapped concurrency');

harnessCounters.reset();
const s2 = harnessCounters.snapshot();
assert.equal(s2.commandBuffersSubmitted, 0, 'reset clears counters');
assert.equal(s2.mapOverlapDetected, false, 'reset clears overlap flag');
assert.equal(s2.peakMappedConcurrent, 0, 'reset clears peak concurrency');

// ─── completion-token 4-byte contract ───

assert.equal(completionTokenContract.sizeOfSrc, 4, 'completion token src is 4 bytes');
assert.equal(completionTokenContract.sizeOfDst, 4, 'completion token dst is 4 bytes');
assert.equal(completionTokenContract.usageSsrc, 24, 'STORAGE|COPY_SRC = 24');
assert.equal(completionTokenContract.usageDst, 17, 'MAP_READ|COPY_DST = 17');

// ─── phase benchmark ARM is wired (GPU execution covered on-device) ───

assert.equal(typeof runAttentionPhaseCorrectness, 'function', 'runAttentionPhaseCorrectness exported');
assert.equal(typeof createBenchmarkAttentionContext, 'function', 'createBenchmarkAttentionContext exported');
assert.equal(typeof measureAttentionPhasePerformance, 'function', 'measureAttentionPhasePerformance exported');
assert.ok(ATTN_QKT.includes('scale'), 'QKT WGSL preserved');
assert.ok(ATTN_PV.includes('scale'), 'PV WGSL preserved');

console.log(`regression-harness: PASS — ${SEQS.length} seqs, uniforms, counters, completion, wiring`);