// AETHER GPU Benchmark — Uniform Buffer Packing Direct Byte-Level Unit Tests
import { strict as assert } from 'node:assert';
import {
  createMatmulUniform,
  createVecAddUniform,
  createConv2DUniform,
  createSoftmaxUniform,
  createRMSNormUniform,
  createAttentionUniform,
} from '../src/benchmark/uniforms.ts';

// MatMul 128×128 uniform byte layout (u32 fields)
{
  const buf = createMatmulUniform(128, 128, 128);
  const u32 = new Uint32Array(buf);
  const f32 = new Float32Array(buf);

  assert.equal(buf.byteLength, 16);
  assert.equal(u32[0], 128);
  assert.equal(u32[1], 128);
  assert.equal(u32[2], 128);
  assert.equal(u32[3], 0);

  // Float32Array view at [0] must NOT equal float 128.0
  assert.notEqual(f32[0], 128.0);
}

// MatMul 256×256 uniform byte layout (u32 fields)
{
  const buf = createMatmulUniform(256, 256, 256);
  const u32 = new Uint32Array(buf);
  const f32 = new Float32Array(buf);

  assert.equal(buf.byteLength, 16);
  assert.equal(u32[0], 256);
  assert.equal(u32[1], 256);
  assert.equal(u32[2], 256);
  assert.equal(u32[3], 0);

  assert.notEqual(f32[0], 256.0);
}

// VecAdd 1024 uniform byte layout (N + dispatchStride, both u32)
{
  const buf = createVecAddUniform(1024, 16 * 64);
  const u32 = new Uint32Array(buf);

  assert.equal(buf.byteLength, 16);
  assert.equal(u32[0], 1024);
  assert.equal(u32[1], 16 * 64); // dispatchStride = workgroupsX * 64
  assert.equal(u32[2], 0);
  assert.equal(u32[3], 0);
}

// VecAdd 4,194,304 uniform — dispatchStride = 65,535 * 64 = 4,194,240
{
  const buf = createVecAddUniform(4194304, 65535 * 64);
  const u32 = new Uint32Array(buf);

  assert.equal(buf.byteLength, 16);
  assert.equal(u32[0], 4194304);
  assert.equal(u32[1], 65535 * 64);
  assert.equal(u32[2], 0);
  assert.equal(u32[3], 0);
}

// Conv2D uniform byte layout (9 x u32 fields)
{
  const buf = createConv2DUniform(1, 1, 32, 32, 8, 3, 3, 30, 30);
  const u32 = new Uint32Array(buf);

  assert.equal(buf.byteLength, 48); // 12 * 4 bytes
  assert.equal(u32[0], 1);
  assert.equal(u32[1], 1);
  assert.equal(u32[2], 32);
  assert.equal(u32[3], 32);
  assert.equal(u32[4], 8);
  assert.equal(u32[5], 3);
  assert.equal(u32[6], 3);
  assert.equal(u32[7], 30);
  assert.equal(u32[8], 30);
}

// Softmax 256×256 uniform byte layout
{
  const buf = createSoftmaxUniform(256, 256);
  const u32 = new Uint32Array(buf);

  assert.equal(buf.byteLength, 16);
  assert.equal(u32[0], 256);
  assert.equal(u32[1], 256);
}

// RMSNorm uniform byte layout (mixed u32 + f32)
{
  const eps = 1e-6;
  const buf = createRMSNormUniform(1024, eps);
  const u32 = new Uint32Array(buf);
  const f32 = new Float32Array(buf);

  assert.equal(buf.byteLength, 16);
  assert.equal(u32[0], 1024);
  assert.ok(Math.abs(f32[1] - eps) < 1e-12);
}

// Attention uniform byte layout (mixed 3x u32 + 1x f32)
{
  const scale = 1 / Math.sqrt(64);
  const buf = createAttentionUniform(1, 256, 64, scale);
  const u32 = new Uint32Array(buf);
  const f32 = new Float32Array(buf);

  assert.equal(buf.byteLength, 16);
  assert.equal(u32[0], 1);
  assert.equal(u32[1], 256);
  assert.equal(u32[2], 64);
  assert.ok(Math.abs(f32[3] - scale) < 1e-6);
}

console.log('PASS: Uniform buffer packing unit tests');
