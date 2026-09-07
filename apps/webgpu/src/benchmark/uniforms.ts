// AETHER GPU Benchmark — Uniform Buffer Packing Helpers
//
// WGSL uniform structs use u32 and f32 fields. JavaScript Float32Array
// interprets values as IEEE-754 float bit patterns, but WGSL u32 fields
// expect raw unsigned integer bit representations. Using Float32Array
// for u32 fields produces incorrect GPU results.
//
// These helpers create ArrayBuffers with the exact byte representation
// matching each shader's struct Uniforms declaration.

/**
 * struct Uniforms { M: u32, N: u32, K: u32 }  — 16 bytes padded
 */
export function createMatmulUniform(M: number, N: number, K: number): ArrayBuffer {
  const data = new ArrayBuffer(16);
  const u32 = new Uint32Array(data);
  u32[0] = M >>> 0;
  u32[1] = N >>> 0;
  u32[2] = K >>> 0;
  u32[3] = 0;
  return data;
}

/**
 * struct Uniforms { N: u32 }  — 16 bytes padded
 */
export function createVecAddUniform(N: number): ArrayBuffer {
  const data = new ArrayBuffer(16);
  const u32 = new Uint32Array(data);
  u32[0] = N >>> 0;
  u32[1] = 0;
  u32[2] = 0;
  u32[3] = 0;
  return data;
}

/**
 * struct Uniforms { N: u32, C: u32, H: u32, W: u32, F: u32, FH: u32, FW: u32, OH: u32, OW: u32 }
 * 9 u32 fields = 36 bytes → 48 bytes padded for 16-byte alignment
 */
export function createConv2DUniform(
  N: number,
  C: number,
  H: number,
  W: number,
  F: number,
  FH: number,
  FW: number,
  OH: number,
  OW: number
): ArrayBuffer {
  const data = new ArrayBuffer(48);
  const u32 = new Uint32Array(data);
  u32[0] = N >>> 0;
  u32[1] = C >>> 0;
  u32[2] = H >>> 0;
  u32[3] = W >>> 0;
  u32[4] = F >>> 0;
  u32[5] = FH >>> 0;
  u32[6] = FW >>> 0;
  u32[7] = OH >>> 0;
  u32[8] = OW >>> 0;
  u32[9] = 0;
  u32[10] = 0;
  u32[11] = 0;
  return data;
}

/**
 * struct Uniforms { rows: u32, cols: u32 }  — 16 bytes padded
 */
export function createSoftmaxUniform(rows: number, cols: number): ArrayBuffer {
  const data = new ArrayBuffer(16);
  const u32 = new Uint32Array(data);
  u32[0] = rows >>> 0;
  u32[1] = cols >>> 0;
  u32[2] = 0;
  u32[3] = 0;
  return data;
}

/**
 * struct Uniforms { N: u32, eps: f32 }  — 16 bytes padded
 */
export function createRMSNormUniform(N: number, eps: number): ArrayBuffer {
  const data = new ArrayBuffer(16);
  const u32 = new Uint32Array(data);
  const f32 = new Float32Array(data);
  u32[0] = N >>> 0;
  f32[1] = eps;
  u32[2] = 0;
  u32[3] = 0;
  return data;
}

/**
 * struct Uniforms { batch: u32, seq: u32, dim: u32, scale: f32 }  — 16 bytes
 */
export function createAttentionUniform(
  batch: number,
  seq: number,
  dim: number,
  scale: number
): ArrayBuffer {
  const data = new ArrayBuffer(16);
  const u32 = new Uint32Array(data);
  const f32 = new Float32Array(data);
  u32[0] = batch >>> 0;
  u32[1] = seq >>> 0;
  u32[2] = dim >>> 0;
  f32[3] = scale;
  return data;
}

/**
 * Generic helper for raw u32 array
 */
export function createU32Uniform(values: number[]): ArrayBuffer {
  const size = Math.max(Math.ceil(values.length / 4) * 16, 16);
  const data = new ArrayBuffer(size);
  const u32 = new Uint32Array(data);
  for (let i = 0; i < values.length; i++) {
    u32[i] = values[i] >>> 0;
  }
  return data;
}

/**
 * Generic helper for u32 followed by f32
 */
export function createU32F32Uniform(u32Values: number[], f32Values: number[]): ArrayBuffer {
  const total = u32Values.length + f32Values.length;
  const size = Math.max(Math.ceil(total / 4) * 16, 16);
  const data = new ArrayBuffer(size);
  const u32 = new Uint32Array(data);
  const f32 = new Float32Array(data);
  for (let i = 0; i < u32Values.length; i++) {
    u32[i] = u32Values[i] >>> 0;
  }
  for (let i = 0; i < f32Values.length; i++) {
    f32[u32Values.length + i] = f32Values[i];
  }
  return data;
}

/**
 * TASK 9 — Runtime Uniform Diagnostic
 * Inspects actual uploaded ArrayBuffer bytes and prints decoded Uint32 values.
 */
export function logMatmulUniformDiagnostic(buffer: ArrayBuffer): void {
  const u32 = new Uint32Array(buffer);
  const bytes = new Uint8Array(buffer);
  const hexBytes = Array.from(bytes.slice(0, 16))
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ');

  console.log(`MATMUL UNIFORM DIAGNOSTIC:`);
  console.log(`M: ${u32[0]}`);
  console.log(`N: ${u32[1]}`);
  console.log(`K: ${u32[2]}`);
  console.log(`Uniform bytes: ${hexBytes}`);
}
