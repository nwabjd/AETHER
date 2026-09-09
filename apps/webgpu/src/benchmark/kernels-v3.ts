// AETHER GPU Benchmark V3 — Model-Shaped Kernel Definitions
//
// These are NEW kernels for model-relevant operations not already in kernels.ts.
// We reuse the existing MATMUL, SOFTMAX, RMS_NORM, CONV2D, VEC_ADD kernels
// directly for their respective V3 workloads. Only genuinely new operations
// are defined here.

export const GELU = /* wgsl */ `
@group(0) @binding(0) var<storage, read> input: array<f32>;
@group(0) @binding(1) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&input)) { return; }
  let x = input[i];
  let t = 0.7978845608 * (x + 0.044715 * x * x * x);
  output[i] = 0.5 * x * (1.0 + tanh(t));
}
`;

export const SILU = /* wgsl */ `
@group(0) @binding(0) var<storage, read> input: array<f32>;
@group(0) @binding(1) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&input)) { return; }
  let x = input[i];
  output[i] = x / (1.0 + exp(-x));
}
`;

export const EMBEDDING_LOOKUP = /* wgsl */ `
struct Uniforms { vocabSize: u32, hiddenDim: u32, numTokens: u32, pad: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> indices: array<u32>;
@group(0) @binding(2) var<storage, read> vocabTable: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u.numTokens * u.hiddenDim) { return; }
  let tokenIdx = i / u.hiddenDim;
  let dimIdx = i % u.hiddenDim;
  let vocabIdx = indices[tokenIdx];
  output[i] = vocabTable[vocabIdx * u.hiddenDim + dimIdx];
}
`;

export const ADD_BIAS = /* wgsl */ `
@group(0) @binding(0) var<storage, read> input: array<f32>;
@group(0) @binding(1) var<storage, read> bias: array<f32>;
@group(0) @binding(2) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&input)) { return; }
  let col = i % arrayLength(&bias);
  output[i] = input[i] + bias[col];
}
`;

export const TEMPORAL_MIX = /* wgsl */ `
struct Uniforms { frames: u32, height: u32, width: u32, channels: u32,
                 kernelSize: u32, outFrames: u32, pad0: u32, pad1: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  let outSize = u.outFrames * u.height * u.width * u.channels;
  if (i >= outSize) { return; }
  let c = i % u.channels;
  let w = (i / u.channels) % u.width;
  let h = (i / (u.channels * u.width)) % u.height;
  let t_out = i / (u.channels * u.width * u.height);
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.kernelSize; k++) {
    let t_in = t_out + k;
    if (t_in < u.frames) {
      let inIdx = t_in * u.height * u.width * u.channels + h * u.width * u.channels + w * u.channels + c;
      sum += input[inIdx] * weight[k * u.channels + c];
    }
  }
  output[i] = sum;
}
`;

// ─── Uniform constructors for V3 kernels ──────────────────────────────────

export function createEmbeddingUniform(vocabSize: number, hiddenDim: number, numTokens: number): ArrayBuffer {
  const data = new ArrayBuffer(16);
  const u32 = new Uint32Array(data);
  u32[0] = vocabSize >>> 0;
  u32[1] = hiddenDim >>> 0;
  u32[2] = numTokens >>> 0;
  u32[3] = 0;
  return data;
}

export function createTemporalMixUniform(
  frames: number, height: number, width: number, channels: number,
  kernelSize: number, outFrames: number
): ArrayBuffer {
  const data = new ArrayBuffer(32);
  const u32 = new Uint32Array(data);
  u32[0] = frames >>> 0;
  u32[1] = height >>> 0;
  u32[2] = width >>> 0;
  u32[3] = channels >>> 0;
  u32[4] = kernelSize >>> 0;
  u32[5] = outFrames >>> 0;
  u32[6] = 0;
  u32[7] = 0;
  return data;
}
