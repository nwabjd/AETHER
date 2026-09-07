// AETHER GPU Benchmark — CPU Reference + Numeric Unit Tests (Node, no GPU)
// Keeps the CPU references, tensor shapes, numerical tolerance, non-finite
// detection and deterministic inputs runnable without WebGPU. The GPU
// integration tests live in the browser suite (tests.ts) and run on-device.
//
// Run: npm test
import { strict as assert } from 'node:assert';

import {
  cpuVecAdd,
  cpuMatmul,
  cpuConv2D,
  cpuSoftmax,
  cpuRMSNorm,
  cpuAttention,
} from '../src/benchmark/cpu-refs.ts';
import { analyzeNumeric, rowSums } from '../src/benchmark/numeric.ts';

// ── Vector Add ──
{
  const A = new Float32Array([1, 2, 3]);
  const B = new Float32Array([4, 5, 6]);
  const C = cpuVecAdd(A, B);
  assert.deepEqual(Array.from(C), [5, 7, 9]);
  assert.equal(C.length, 3, 'tensor shape (N)');
}

// ── Matrix Multiply (2×2: identity × B = B) ──
{
  const A = new Float32Array([1, 0, 0, 1]);
  const B = new Float32Array([1, 2, 3, 4]);
  const C = cpuMatmul(A, B, 2, 2, 2);
  assert.deepEqual(Array.from(C), [1, 2, 3, 4]);
  assert.equal(C.length, 4, 'tensor shape (M×N)');
}

// ── Conv2D (5×5 input 1..25, 3×3 kernel columns [1,0,-1]) ──
{
  const N = 1, C = 1, H = 5, W = 5, F = 1, FH = 3, FW = 3;
  const input = new Float32Array(N * C * H * W);
  for (let i = 0; i < input.length; i++) input[i] = i + 1;
  const kernel = new Float32Array([1, 0, -1, 1, 0, -1, 1, 0, -1]);
  const out = cpuConv2D(input, kernel, N, C, H, W, F, FH, FW);
  assert.equal(out.length, 3 * 3, 'tensor shape (OH×OW)');
  // hand-computed top-left: (1-3)+(6-8)+(11-13) = -6
  assert.ok(Math.abs(out[0] - (-6)) < 1e-9, `top-left conv = ${out[0]}`);
  assert.ok(out.every((v) => Number.isFinite(v)));
}

// ── Softmax (stable, row sums ≈ 1, outputs in [0,1]) ──
{
  const rows = 2, cols = 5;
  const data = new Float32Array([-2, -1, 0, 1, 2, 2, 1, 0, -1, -2]);
  const out = cpuSoftmax(data, rows, cols);
  assert.equal(out.length, data.length);
  const sums = rowSums(out, rows, cols);
  // f32 storage of individual probabilities allows ~1e-8 drift per row.
  for (const s of sums) assert.ok(Math.abs(s - 1) < 1e-6, `row sum ≈ 1, got ${s}`);
  assert.ok(out.every((v) => v >= 0 && v <= 1 && Number.isFinite(v)), 'softmax outputs sane');
  assert.ok(cpuSoftmax(data, rows, cols).every((v, i) => v === out[i]), 'never mutates input');
}

// ── RMSNorm (N=8, weight ones, eps 1e-6) ──
{
  const input = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const weight = new Float32Array(8).fill(1);
  const out = cpuRMSNorm(input, weight, 1e-6);
  const sumSq = Array.from(input).reduce((s, v) => s + v * v, 0);
  const rms = Math.sqrt(sumSq / 8 + 1e-6);
  assert.equal(out.length, 8);
  // out[] is stored as f32, so round the f64 expectation with Math.fround.
  assert.ok(Math.abs(out[0] - Math.fround(1 / rms)) < 1e-9, `out[0] = ${out[0]}`);
  assert.ok(Math.abs(out[7] - Math.fround(8 / rms)) < 1e-9, `out[7] = ${out[7]}`);
}

// ── Attention (seq=1 reduces to V: single score softmax = 1) ──
{
  const batch = 1, seq = 1, dim = 4;
  const scale = 1 / Math.sqrt(dim);
  const Q = new Float32Array([1, 2, 3, 4]);
  const K = new Float32Array([1, 2, 3, 4]);
  const V = new Float32Array([5, 6, 7, 8]);
  const out = cpuAttention(Q, K, V, batch, seq, dim, scale);
  assert.equal(out.length, batch * seq * dim);
  for (let i = 0; i < dim; i++) {
    assert.ok(Math.abs(out[i] - V[i]) < 1e-9, `attention output ${i} = ${out[i]}`);
  }
}

// ── analyzeNumeric: tolerance, largest-error index, values, ranges ──
{
  const gpu = new Float32Array([1, 2, 3, 4, 5]);
  const cpu = new Float32Array([1, 2, 3, 4, 6]);
  const info = analyzeNumeric(gpu, cpu, 1e-5);
  assert.equal(info.pass, false);
  assert.ok(Math.abs(info.maxError - 1) < 1e-9, `maxError ${info.maxError}`);
  assert.equal(info.errorIndex, 4);
  assert.equal(info.cpuValue, 6);
  assert.equal(info.gpuValue, 5);
  assert.equal(info.allFinite, true);
  assert.equal(info.nonFiniteIndex, -1);
  assert.deepEqual(Array.from(info.expectedRange!), [1, 6]);
  assert.deepEqual(Array.from(info.actualRange!), [1, 5]);
}

// ── analyzeNumeric: NaN/Infinity must FAIL, index reported ──
{
  const bad = analyzeNumeric(new Float32Array([1, NaN, 3]), new Float32Array([1, 2, 3]), 1e-5);
  assert.equal(bad.pass, false);
  assert.equal(bad.allFinite, false);
  assert.equal(bad.nonFiniteIndex, 1);

  const inf = analyzeNumeric(new Float32Array([1, Infinity, 3]), new Float32Array([1, 2, 3]), 1e-5);
  assert.equal(inf.pass, false);
  assert.equal(inf.nonFiniteIndex, 1);
}

// ── analyzeNumeric: length mismatch must FAIL ──
{
  const len = analyzeNumeric(new Float32Array([1, 2]), new Float32Array([1, 2, 3]), 1e-5);
  assert.equal(len.lengthMismatch, true);
  assert.equal(len.pass, false);
}

// ── analyzeNumeric: zero-error (perfect match) must PASS with useful diagnostics ──
{
  const gpu = new Float32Array([32, 32, 32]);
  const cpu = new Float32Array([32, 32, 32]);
  const r = analyzeNumeric(gpu, cpu, 1e-3);
  assert.equal(r.pass, true, 'perfect match must pass');
  assert.equal(r.maxError, 0, 'maxError == 0');
  assert.equal(r.errorIndex, 0, 'errorIndex seeded with first element');
  assert.equal(r.cpuValue, 32, 'cpuValue recorded');
  assert.equal(r.gpuValue, 32, 'gpuValue recorded');
  assert.equal(r.allFinite, true);
  assert.equal(r.lengthMismatch, false);
}

// ── analyzeNumeric: small mismatch must FAIL with correct index ──
{
  const gpu = new Float32Array([32, 32, 32.01]);
  const cpu = new Float32Array([32, 32, 32]);
  const r = analyzeNumeric(gpu, cpu, 1e-3);
  assert.equal(r.pass, false);
  assert.ok(Math.abs(r.maxError - 0.01) < 1e-3, `maxError ${r.maxError}`);
  assert.equal(r.errorIndex, 2);
  assert.equal(r.cpuValue, 32);
  assert.ok(Math.abs(r.gpuValue! - 32.01) < 1e-3);
}

// ── analyzeNumeric: empty arrays must FAIL (nothing to compare) ──
{
  const r = analyzeNumeric(new Float32Array([]), new Float32Array([]), 1e-3);
  assert.equal(r.pass, false, 'empty arrays must not pass');
  assert.equal(r.allFinite, true);
  assert.equal(r.lengthMismatch, false);
}

console.log('PASS: CPU reference + numeric unit tests');