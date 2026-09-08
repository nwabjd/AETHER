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

// TASK 7 — the monolithic ATTENTION shader must stay a single-invocation
// correctness kernel (one invocation owns one batch => no data race on the
// shared scores/out buffers). Any reintroduction of @workgroup_size(>1) or a
// concurrent writer layout must fail here.
assert.match(ATTENTION, /@compute\s*@workgroup_size\(1\)/, 'ATTENTION must use @workgroup_size(1)');
assert.match(ATTENTION, /ONE INVOCATION OWNS ONE BATCH/, 'ATTENTION must document the single-owner contract');
assert.match(ATTENTION, /for \(var i = 0u; i < u\.seq; i\+\+\)/, 'ATTENTION must keep the serial row loop');

// Count validation must fail clearly on mismatch.
assert.throws(
  () => assertBindingCount(MATMUL_BINDINGS, [{ binding: 0 }, { binding: 1 }]),
  /binding count mismatch/
);

console.log(`PASS: layout regression — read-only-storage bindings preserved for all ${Object.keys(KERNELS).length} kernels`);