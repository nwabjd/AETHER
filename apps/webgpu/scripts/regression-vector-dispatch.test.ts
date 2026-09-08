// AETHER GPU Benchmark — Vector-Add 2D Dispatch Tiling Regression Test (Node, no GPU)
//
// Guards the scalable 2D dispatch in src/benchmark/vector-dispatch.ts. Proves
// that large Vector Add cases are tiled across X and Y so neither dimension
// exceeds maxComputeWorkgroupsPerDimension, and that the workgroup-ownership
// math never drops or double-writes an element.
//
// Run: npm test

import { strict as assert } from 'node:assert';
import {
  calculateVectorDispatch,
  assertVectorDispatch,
  formatVectorDispatch,
  type VectorDispatch,
} from '../src/benchmark/vector-dispatch.ts';
import { createVecAddUniform } from '../src/benchmark/uniforms.ts';
import { VEC_ADD } from '../src/benchmark/kernels.ts';

const WG = 64;
const MAX = 65535; // WebGPU portable default maxComputeWorkgroupsPerDimension

// ─── WGSL identity (TASK 5) ─────────────────────────────────────────────

assert.ok(
  VEC_ADD.includes('struct Uniforms { N: u32, dispatchStride: u32 }'),
  'VEC_ADD must carry { N, dispatchStride } uniform struct'
);
assert.ok(
  VEC_ADD.includes('let i = gid.x + gid.y * u.dispatchStride;'),
  'VEC_ADD must index via gid.x + gid.y * dispatchStride'
);
assert.ok(VEC_ADD.includes('if (i >= u.N) { return; }'), 'VEC_ADD must guard i >= N');
assert.ok(!VEC_ADD.includes('let i = gid.x;'), 'VEC_ADD must NOT use plain gid.x indexing');

// ─── Worker helper: verify every element 0..N-1 is reached exactly once ──
// The shader indexes `i = gid.x + gid.y * dispatchStride` where gid.x / gid.y
// are GLOBAL invocation coordinates spanning X*64 and Y*64 respectively, and
// dispatchStride = workgroupsX * 64 covers one full X-row of invocations.

function coverage(n: number, d: VectorDispatch): { reached: Set<number>; over: boolean; missed: number } {
  const reached = new Set<number>();
  const invX = d.workgroupsX * d.workgroupSize; // global invocations along X
  const invY = d.workgroupsY * d.workgroupSize; // global invocations along Y
  for (let gy = 0; gy < invY; gy++) {
    for (let gx = 0; gx < invX; gx++) {
      const i = gx + gy * d.dispatchStride;
      if (i < n) reached.add(i);
    }
  }
  return { reached, over: reached.size > n, missed: n - reached.size };
}

function assertFullCoverage(n: number, d: VectorDispatch): void {
  const { reached, over, missed } = coverage(n, d);
  assert.strictEqual(missed, 0, `N=${n}: ${missed} element(s) never written (missing from grid)`);
  assert.strictEqual(over, false, `N=${n}: grid produced indexes beyond N`);
  assert.strictEqual(reached.size, n, `N=${n}: reached ${reached.size} distinct elements, expected ${n}`);
}

function assertOned(d: VectorDispatch): void {
  assert.strictEqual(d.workgroupsY, 1, 'workgroupsY must stay 1 when X fits the limit');
}

// ─── TASK 7 — small/1D cases stay 1D ─────────────────────────────────────

{
  const d = calculateVectorDispatch(1000, MAX, WG);
  assert.strictEqual(d.workgroupsX, 16); // ceil(1000/64) = 16
  assert.strictEqual(d.workgroupsY, 1);
  assert.strictEqual(d.totalWorkgroups, 16);
  assertOned(d);
  assertFullCoverage(1000, d);
}

{
  const d = calculateVectorDispatch(1_048_576, MAX, WG);
  assert.strictEqual(d.workgroupsX, 16_384); // ceil(1MiB/64)
  assert.strictEqual(d.workgroupsY, 1);
  assertOned(d);
  assertFullCoverage(1_048_576, d);
}

// ─── TASK 6/11 — exact boundary cases on a 65535-limit device ───────────

// N = 65,535 × 64 = 4,194,240 → X=65,535, Y=1 (fits, no 2nd row needed)
{
  const d = calculateVectorDispatch(65535 * 64, MAX, WG);
  assert.strictEqual(d.workgroupsX, 65535);
  assert.strictEqual(d.workgroupsY, 1);
  assert.strictEqual(d.dispatchStride, 65535 * 64);
  assert.strictEqual(d.totalWorkgroups, 65535);
  assertOned(d);
  assertFullCoverage(65535 * 64, d);
}

// N = 65,536 × 64 = 4,194,304 → X=65,535, Y=2 (TASK 2 / TASK 6 / TASK 18)
{
  const d = calculateVectorDispatch(4_194_304, MAX, WG);
  assert.strictEqual(d.workgroupsX, 65535);
  assert.strictEqual(d.workgroupsY, 2);
  assert.strictEqual(d.dispatchStride, 65535 * 64); // 4,194,240
  assert.strictEqual(d.totalWorkgroups, 65536);
  assertFullCoverage(4_194_304, d);
  // boundary elements on both sides of the Y=1→Y=2 seam
  assert.ok(d.workgroupsX <= MAX && d.workgroupsY <= MAX, 'both dims within limit');
}

// N = 4,194,368 = 65,537 × 64 → X=65,535, Y=ceil(65537/65535)=2
{
  const d = calculateVectorDispatch(4_194_368, MAX, WG);
  assert.strictEqual(d.workgroupsX, 65535);
  assert.strictEqual(d.workgroupsY, 2);
  assert.strictEqual(d.totalWorkgroups, 65537);
  assertFullCoverage(4_194_368, d);
}

// N = 64 and 128 — tiny cases
{
  const d64 = calculateVectorDispatch(64, MAX, WG);
  assert.deepStrictEqual([d64.workgroupsX, d64.workgroupsY, d64.totalWorkgroups], [1, 1, 1]);
  assertFullCoverage(64, d64);

  const d128 = calculateVectorDispatch(128, MAX, WG);
  assert.deepStrictEqual([d128.workgroupsX, d128.workgroupsY, d128.totalWorkgroups], [2, 1, 2]);
  assertFullCoverage(128, d128);
}

// ─── TASK 18 — hypothetical device limit of 1024 ────────────────────────

{
  const d = calculateVectorDispatch(4_194_304, 1024, WG);
  assert.strictEqual(d.workgroupsX, 1024);
  const expectedY = Math.ceil(65536 / 1024); // 64
  assert.strictEqual(d.workgroupsY, expectedY);
  assert.ok(d.workgroupsX <= 1024 && d.workgroupsY <= 1024, 'both dims within the 1024 limit');
  assert.strictEqual(d.dispatchStride, 1024 * 64);
  assertFullCoverage(4_194_304, d);
  assertVectorDispatch(d);
}

// A small device limit that forces 2D tiling is still honored correctly.
{
  const d = calculateVectorDispatch(1000, 4, WG); // 16 workgroups → X=4, Y=4
  assert.strictEqual(d.workgroupsX, 4);
  assert.strictEqual(d.workgroupsY, 4);
  assert.strictEqual(d.dispatchStride, 4 * 64);
  assertVectorDispatch(d);
  assertFullCoverage(1000, d);
}

// ─── TASK 9 — hard assertions reject invalid geometries ─────────────────

assert.throws(() => calculateVectorDispatch(4_194_304, 65535, 0), /workgroupSize/);
assert.throws(() => assertVectorDispatch({ ...calculateVectorDispatch(1024, 65535), workgroupsX: 0 }), /workgroupsX/);
assert.throws(() => assertVectorDispatch({ ...calculateVectorDispatch(1024, 65535), workgroupsX: 70000 }), /exceeds maxComputeWorkgroupsPerDimension/);
assert.throws(() => assertVectorDispatch({ ...calculateVectorDispatch(1024, 65535), dispatchStride: 100 }), /dispatchStride/);
assert.throws(() => assertVectorDispatch({ ...calculateVectorDispatch(1024, 65535), totalWorkgroups: 999999 }), /totalWorkgroups/);

// ─── uniform packing matches the stride (TASK 4) ────────────────────────

{
  const u32 = new Uint32Array(createVecAddUniform(4_194_304, 65535 * 64));
  assert.strictEqual(u32[0], 4_194_304);
  assert.strictEqual(u32[1], 65535 * 64);
  assert.strictEqual(u32[2], 0);
  assert.strictEqual(u32[3], 0);
}

// ─── TASK 10 — diagnostics render the 4,194,304 case exactly ────────────

{
  const d = calculateVectorDispatch(4_194_304, 65535, WG);
  const text = formatVectorDispatch(d, 4_194_304);
  assert.ok(text.includes('Elements: 4,194,304'), 'diagnostic shows elements');
  assert.ok(text.includes('Workgroup size: 64'), 'diagnostic shows workgroup size');
  assert.ok(text.includes('Total workgroups: 65,536'), 'diagnostic shows total workgroups');
  assert.ok(text.includes('Dispatch X: 65,535'), 'diagnostic shows X');
  assert.ok(text.includes('Dispatch Y: 2'), 'diagnostic shows Y');
  assert.ok(text.includes('Dispatch Z: 1'), 'diagnostic shows Z');
  assert.ok(text.includes('Dispatch stride: 4,194,240'), 'diagnostic shows stride');
  assert.ok(text.includes('Max workgroups/dimension: 65,535'), 'diagnostic shows device limit');
  assert.ok(text.includes('Total theoretical invocations: 8,388,480'), 'diagnostic shows total invocations');
  assert.ok(text.includes('Valid elements: 4,194,304'), 'diagnostic shows valid elements');
}

console.log('regression-vector-dispatch: PASS');
