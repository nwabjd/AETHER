// AETHER GPU Benchmark — Layout Regression Test (Node, no GPU required)
//
// Guard against the root cause of the iPhone harness failure: bind-group
// layouts must keep `var<storage, read>` bindings typed read-only-storage.
// If any helper ever degrades them back to generic `storage`, or the WGSL
// declarations drift from the canonical binding arrays, this test fails.
//
// Run: npm test   (node --experimental-strip-types scripts/regression-layout.test.ts)
import { strict as assert } from 'node:assert';

import {
  buildBindingLayoutEntries,
  assertBindingCount,
  type StorageAccess,
} from '../src/benchmark/layout.ts';
import {
  VEC_ADD_BINDINGS,
  MATMUL_BINDINGS,
  CONV2D_BINDINGS,
  SOFTMAX_BINDINGS,
  RMS_NORM_BINDINGS,
  ATTENTION_BINDINGS,
} from '../src/benchmark/bindings.ts';
import {
  VEC_ADD,
  MATMUL,
  CONV2D,
  SOFTMAX,
  RMS_NORM,
  ATTENTION,
  softmaxWorkgroups,
  softmaxDispatchInfo,
  assertSoftmaxDispatch,
} from '../src/benchmark/kernels.ts';

const KERNELS: Record<string, string> = { VEC_ADD, MATMUL, CONV2D, SOFTMAX, RMS_NORM, ATTENTION };
const BINDINGS: Record<string, readonly StorageAccess[]> = {
  VEC_ADD: VEC_ADD_BINDINGS,
  MATMUL: MATMUL_BINDINGS,
  CONV2D: CONV2D_BINDINGS,
  SOFTMAX: SOFTMAX_BINDINGS,
  RMS_NORM: RMS_NORM_BINDINGS,
  ATTENTION: ATTENTION_BINDINGS,
};

// Parses `@group(0) @binding(n) var<...>` declarations out of the WGSL.
function shaderBindingTypes(code: string): (string | undefined)[] {
  const types: (string | undefined)[] = [];
  const re = /@group\(0\)\s*@binding\((\d+)\)\s*var<(uniform|storage,\s*(read|read_write))>/g;
  for (const m of code.matchAll(re)) {
    const idx = Number(m[1]);
    const decl = m[2];
    types[idx] = decl === 'uniform' ? 'uniform' : m[3] === 'read' ? 'read-only-storage' : 'storage';
  }
  return types;
}

for (const name of Object.keys(KERNELS)) {
  const parsed = shaderBindingTypes(KERNELS[name]);
  const expected = BINDINGS[name];

  // WGSL `var<storage, read>` bindings must map 1:1 to the binding array.
  assert.deepEqual(parsed, [...expected], `WGSL declarations must match ${name} binding array`);

  // The layout builder must render each declared access type unchanged,
  // and must keep read-only bindings read-only (never generic storage).
  const entries = buildBindingLayoutEntries(expected);
  const rendered = entries.map((e) => e.buffer && e.buffer.type);
  assert.equal(rendered.length, expected.length, `${name}: entry count must equal binding count`);
  for (let i = 0; i < expected.length; i++) {
    assert.ok(entries[i].buffer && entries[i].buffer.type, `${name}: binding ${i} must be explicit`);
    assert.equal(rendered[i], expected[i], `${name}: binding ${i} layout type must stay ${expected[i]}`);
  }
}

// The exact regression that failed on iPhone: MatMul input bindings must be
// read-only-storage all the way through, with read_write output kept storage.
const matmulRendered = buildBindingLayoutEntries(MATMUL_BINDINGS).map((e) => e.buffer!.type);
assert.deepEqual(matmulRendered, [
  'uniform',
  'read-only-storage',
  'read-only-storage',
  'storage',
]);

const attentionRendered = buildBindingLayoutEntries(ATTENTION_BINDINGS).map((e) => e.buffer!.type);
assert.deepEqual(attentionRendered, [
  'uniform',
  'read-only-storage',
  'read-only-storage',
  'read-only-storage',
  'storage',
  'storage',
]);

// TASK 1–7 — ATTENTION is a row-parallel correctness kernel: @workgroup_size(64)
// with one invocation per output row. Any reintroduction of the serial i-loop
// (a single invocation computing every row) must fail here.
assert.match(ATTENTION, /@compute\s*@workgroup_size\(64\)/, 'ATTENTION must use @workgroup_size(64)');
assert.match(ATTENTION, /let\s+rowIndex\s*=\s*gid\.x/, 'ATTENTION must derive the output row from global_invocation_id');
assert.match(ATTENTION, /let\s+totalRows\s*=\s*u\.batch\s*\*\s*u\.seq/, 'ATTENTION must compute totalRows from batch*seq');
assert.match(ATTENTION, /let\s+b\s*=\s*rowIndex\s*\/\s*u\.seq/, 'ATTENTION must derive batch from rowIndex');
assert.match(ATTENTION, /let\s+i\s*=\s*rowIndex\s*%\s*u\.seq/, 'ATTENTION must derive row within batch from rowIndex');
assert.doesNotMatch(ATTENTION, /for \(var i = 0u; i < u\.seq; i\+\+\)/, 'ATTENTION must NOT contain a serial per-row loop');

// Count validation must fail clearly on mismatch.
assert.throws(
  () => assertBindingCount(MATMUL_BINDINGS, [{ binding: 0 }, { binding: 1 }]),
  /binding count mismatch/
);

// TASK 4 — the shared SOFTMAX shader stays a row-per-invocation kernel:
// @workgroup_size(64) with gid.x → row and a bounds check. It must NOT be
// rewritten into a multi-row/in-place variant until the correctness gate is
// fully green.
assert.match(SOFTMAX, /@compute\s*@workgroup_size\(64\)/, 'SOFTMAX must keep @workgroup_size(64)');
assert.match(SOFTMAX, /let\s+row\s*=\s*gid\.x/, 'SOFTMAX must map gid.x → row');
assert.match(SOFTMAX, /if\s*\(row\s*>=\s*u\.rows\)\s*\{\s*return;\s*\}/, 'SOFTMAX must bounds-check row against u.rows');

// TASK 5/6/7 — dispatch single source of truth + invariant: ceil(rows/64) in X.
// Rows are 1:1 with invocations; total invocations covers [rows, rows+64).
assert.deepEqual(softmaxWorkgroups(4), [1, 1, 1]);
assert.deepEqual(softmaxWorkgroups(64), [1, 1, 1]);
assert.deepEqual(softmaxWorkgroups(65), [2, 1, 1]);
assert.deepEqual(softmaxWorkgroups(128), [2, 1, 1]);
assert.deepEqual(softmaxWorkgroups(256), [4, 1, 1]);
assert.deepEqual(softmaxWorkgroups(512), [8, 1, 1]);
assert.deepEqual(softmaxDispatchInfo(128), { rows: 128, workgroupSize: 64, workgroupsX: 2, totalInvocations: 128 });
const inv = assertSoftmaxDispatch(256);
assert.equal(inv.workgroupsX, 4);
assert.equal(inv.totalInvocations, 256);
assert.throws(
  () => assertSoftmaxDispatch(-1),
  /softmax dispatch invariant violated/,
  'assertSoftmaxDispatch must reject a negative row count'
);

console.log(`PASS: layout regression — read-only-storage bindings preserved for all ${Object.keys(KERNELS).length} kernels`);