// AETHER Tensor Runtime — Operations
// GPU kernels + CPU references + correctness verification

import { getGPUContext } from '../gpu-context';
import { Tensor } from '../tensor';
import { TensorShape } from '../tensor-shape';
import { TensorDType } from '../tensor-dtype';
import { PipelineCache } from '../pipeline-cache';
import {
  MATMUL, MATMUL_QUANT, ADD, MULTIPLY,
  RMS_NORM, LAYER_NORM, SOFTMAX, ROPE,
  CONV2D, TRANSPOSE_2D, INTERPOLATE_BILINEAR,
} from './wgsl';
import {
  cpuMatmul, cpuMatmulQuant, cpuAdd, cpuMultiply,
  cpuRMSNorm, cpuLayerNorm, cpuSoftmax, cpuRoPE,
  cpuConv2D, cpuTranspose2D, cpuInterpolateBilinear,
} from './cpu-reference';

const pipelineCache = new PipelineCache();

function createLayout(bindings: number): GPUBindGroupLayout {
  const ctx = getGPUContext();
  return ctx.device.createBindGroupLayout({
    entries: Array.from({ length: bindings }, (_, i) => ({
      binding: i,
      visibility: GPUShaderStage.COMPUTE,
      buffer: i === 0
        ? { type: 'uniform' as const }
        : { type: 'storage' as const },
    })),
  });
}

function createUniformBuffer(data: ArrayBuffer): GPUBuffer {
  const ctx = getGPUContext();
  const buf = ctx.device.createBuffer({
    size: Math.ceil(data.byteLength / 16) * 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  ctx.device.queue.writeBuffer(buf, 0, data);
  return buf;
}

function dispatch1D(
  encoder: GPUCommandEncoder,
  pipeline: GPUComputePipeline,
  layout: GPUBindGroupLayout,
  tensors: Tensor[],
  uniformData: ArrayBuffer,
  workgroupCount: number
): GPUBuffer {
  const ctx = getGPUContext();
  const uBuf = createUniformBuffer(uniformData);

  const entries: GPUBindGroupEntry[] = [
    { binding: 0, resource: { buffer: uBuf } },
    ...tensors.map((t, i) => ({ binding: i + 1, resource: { buffer: t.buffer.gpuBuffer } })),
  ];

  const bg = ctx.device.createBindGroup({ layout, entries });

  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(workgroupCount);
  pass.end();

  return uBuf;
}

// ─── Matmul ───

export async function opMatmul(A: Tensor, B: Tensor, M: number, N: number, K: number): Promise<Tensor> {
  const ctx = getGPUContext();
  const C = Tensor.zeros([M, N]);

  const layout = createLayout(4);
  const pipeline = pipelineCache.getOrCreate('matmul', MATMUL, layout);

  const uniforms = new ArrayBuffer(12);
  const uv = new Uint32Array(uniforms);
  uv[0] = M; uv[1] = N; uv[2] = K;

  const encoder = ctx.device.createCommandEncoder();
  dispatch1D(encoder, pipeline, layout, [A, B, C], uniforms, Math.ceil(M / 16) * Math.ceil(N / 16));
  ctx.device.queue.submit([encoder.finish()]);

  return C;
}

export function refMatmul(A: Float32Array, B: Float32Array, M: number, N: number, K: number): Float32Array {
  return cpuMatmul(A, B, M, N, K);
}

// ─── Quantized Matmul ───

export async function opMatmulQuant(A: Tensor, B: Tensor, M: number, N: number, K: number, scale: number): Promise<Tensor> {
  const ctx = getGPUContext();
  const C = Tensor.zeros([M, N]);

  const layout = createLayout(4);
  const pipeline = pipelineCache.getOrCreate('matmul_quant', MATMUL_QUANT, layout);

  const uniforms = new ArrayBuffer(16);
  const uv = new Uint32Array(uniforms);
  const fv = new Float32Array(uniforms);
  uv[0] = M; uv[1] = N; uv[2] = K;
  fv[3] = scale;

  const encoder = ctx.device.createCommandEncoder();
  dispatch1D(encoder, pipeline, layout, [A, B, C], uniforms, Math.ceil(M / 16) * Math.ceil(N / 16));
  ctx.device.queue.submit([encoder.finish()]);

  return C;
}

export function refMatmulQuant(A: Float32Array, B: Int32Array, M: number, N: number, K: number, scale: number): Float32Array {
  return cpuMatmulQuant(A, B, M, N, K, scale);
}

// ─── Add ───

export async function opAdd(A: Tensor, B: Tensor): Promise<Tensor> {
  const ctx = getGPUContext();
  const C = Tensor.zeros([A.shape.size]);

  const layout = createLayout(4);
  const pipeline = pipelineCache.getOrCreate('add', ADD, layout);

  const uniforms = new ArrayBuffer(4);
  new Uint32Array(uniforms)[0] = A.shape.size;

  const encoder = ctx.device.createCommandEncoder();
  dispatch1D(encoder, pipeline, layout, [A, B, C], uniforms, Math.ceil(A.shape.size / 256));
  ctx.device.queue.submit([encoder.finish()]);

  return C;
}

export function refAdd(A: Float32Array, B: Float32Array): Float32Array {
  return cpuAdd(A, B);
}

// ─── Multiply ───

export async function opMultiply(A: Tensor, B: Tensor): Promise<Tensor> {
  const ctx = getGPUContext();
  const C = Tensor.zeros([A.shape.size]);

  const layout = createLayout(4);
  const pipeline = pipelineCache.getOrCreate('multiply', MULTIPLY, layout);

  const uniforms = new ArrayBuffer(4);
  new Uint32Array(uniforms)[0] = A.shape.size;

  const encoder = ctx.device.createCommandEncoder();
  dispatch1D(encoder, pipeline, layout, [A, B, C], uniforms, Math.ceil(A.shape.size / 256));
  ctx.device.queue.submit([encoder.finish()]);

  return C;
}

export function refMultiply(A: Float32Array, B: Float32Array): Float32Array {
  return cpuMultiply(A, B);
}

// ─── RMSNorm ───

export async function opRMSNorm(input: Tensor, weight: Tensor, eps: number = 1e-6): Promise<Tensor> {
  const ctx = getGPUContext();
  const N = input.shape.size;
  const output = Tensor.zeros([N]);

  const layout = createLayout(4);
  const pipeline = pipelineCache.getOrCreate('rms_norm', RMS_NORM, layout);

  const uniforms = new ArrayBuffer(8);
  new Uint32Array(uniforms)[0] = N;
  new Float32Array(uniforms)[1] = eps;

  const encoder = ctx.device.createCommandEncoder();
  dispatch1D(encoder, pipeline, layout, [input, weight, output], uniforms, 1);
  ctx.device.queue.submit([encoder.finish()]);

  return output;
}

export function refRMSNorm(input: Float32Array, weight: Float32Array, eps: number = 1e-6): Float32Array {
  return cpuRMSNorm(input, weight, eps);
}

// ─── LayerNorm ───

export async function opLayerNorm(input: Tensor, gamma: Tensor, beta: Tensor, eps: number = 1e-6): Promise<Tensor> {
  const ctx = getGPUContext();
  const N = input.shape.size;
  const output = Tensor.zeros([N]);

  const layout = ctx.device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
    ],
  });

  const pipeline = pipelineCache.getOrCreate('layer_norm', LAYER_NORM, layout);

  const uniforms = new ArrayBuffer(8);
  new Uint32Array(uniforms)[0] = N;
  new Float32Array(uniforms)[1] = eps;

  const ctx2 = getGPUContext();
  const uBuf = createUniformBuffer(uniforms);
  const bg = ctx2.device.createBindGroup({
    layout,
    entries: [
      { binding: 0, resource: { buffer: uBuf } },
      { binding: 1, resource: { buffer: input.buffer.gpuBuffer } },
      { binding: 2, resource: { buffer: gamma.buffer.gpuBuffer } },
      { binding: 3, resource: { buffer: beta.buffer.gpuBuffer } },
      { binding: 4, resource: { buffer: output.buffer.gpuBuffer } },
    ],
  });

  const encoder = ctx2.device.createCommandEncoder();
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(1);
  pass.end();
  ctx2.device.queue.submit([encoder.finish()]);

  return output;
}

export function refLayerNorm(input: Float32Array, gamma: Float32Array, beta: Float32Array, eps: number = 1e-6): Float32Array {
  return cpuLayerNorm(input, gamma, beta, eps);
}

// ─── Softmax ───

export async function opSoftmax(data: Tensor, rows: number, cols: number): Promise<Tensor> {
  const ctx = getGPUContext();
  const output = Tensor.zeros([rows, cols]);

  // Copy input to output buffer for in-place operation
  const encoder = ctx.device.createCommandEncoder();
  encoder.copyBufferToBuffer(data.buffer.gpuBuffer, 0, output.buffer.gpuBuffer, 0, rows * cols * 4);

  const layout = createLayout(2);
  const pipeline = pipelineCache.getOrCreate('softmax', SOFTMAX, layout);

  const uniforms = new ArrayBuffer(8);
  new Uint32Array(uniforms)[0] = rows;
  new Uint32Array(uniforms)[1] = cols;

  const uBuf = createUniformBuffer(uniforms);
  const bg = ctx.device.createBindGroup({
    layout,
    entries: [
      { binding: 0, resource: { buffer: uBuf } },
      { binding: 1, resource: { buffer: output.buffer.gpuBuffer } },
    ],
  });

  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(Math.ceil(rows));
  pass.end();
  ctx.device.queue.submit([encoder.finish()]);

  return output;
}

export function refSoftmax(data: Float32Array, rows: number, cols: number): Float32Array {
  return cpuSoftmax(data, rows, cols);
}

// ─── RoPE ───

export async function opRoPE(data: Tensor, seq: number, dim: number, base: number = 10000): Promise<Tensor> {
  const ctx = getGPUContext();
  const output = Tensor.zeros([seq, dim]);

  // Copy input
  const encoder = ctx.device.createCommandEncoder();
  encoder.copyBufferToBuffer(data.buffer.gpuBuffer, 0, output.buffer.gpuBuffer, 0, seq * dim * 4);

  const layout = createLayout(2);
  const pipeline = pipelineCache.getOrCreate('rope', ROPE, layout);

  const uniforms = new ArrayBuffer(12);
  new Uint32Array(uniforms)[0] = seq;
  new Uint32Array(uniforms)[1] = dim;
  new Float32Array(uniforms)[2] = base;

  const uBuf = createUniformBuffer(uniforms);
  const bg = ctx.device.createBindGroup({
    layout,
    entries: [
      { binding: 0, resource: { buffer: uBuf } },
      { binding: 1, resource: { buffer: output.buffer.gpuBuffer } },
    ],
  });

  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(Math.ceil(seq * dim / 2 / 256));
  pass.end();
  ctx.device.queue.submit([encoder.finish()]);

  return output;
}

export function refRoPE(data: Float32Array, seq: number, dim: number, base: number = 10000): Float32Array {
  return cpuRoPE(data, seq, dim, base);
}

// ─── Conv2D ───

export async function opConv2D(
  input: Tensor, kernel: Tensor,
  N: number, C: number, H: number, W: number,
  F: number, FH: number, FW: number
): Promise<Tensor> {
  const ctx = getGPUContext();
  const OH = H - FH + 1;
  const OW = W - FW + 1;
  const output = Tensor.zeros([N, F, OH, OW]);

  const layout = createLayout(4);
  const pipeline = pipelineCache.getOrCreate('conv2d', CONV2D, layout);

  const uniforms = new ArrayBuffer(36);
  const uv = new Uint32Array(uniforms);
  uv[0] = N; uv[1] = C; uv[2] = H; uv[3] = W;
  uv[4] = F; uv[5] = FH; uv[6] = FW; uv[7] = OH; uv[8] = OW;

  const encoder = ctx.device.createCommandEncoder();
  dispatch1D(encoder, pipeline, layout, [input, kernel, output], uniforms, N * F);
  ctx.device.queue.submit([encoder.finish()]);

  return output;
}

export function refConv2D(
  input: Float32Array, kernel: Float32Array,
  N: number, C: number, H: number, W: number,
  F: number, FH: number, FW: number
): Float32Array {
  return cpuConv2D(input, kernel, N, C, H, W, F, FH, FW);
}

// ─── Transpose ───

export async function opTranspose2D(data: Tensor, rows: number, cols: number): Promise<Tensor> {
  const ctx = getGPUContext();
  const output = Tensor.zeros([cols, rows]);

  const layout = createLayout(3);
  const pipeline = pipelineCache.getOrCreate('transpose_2d', TRANSPOSE_2D, layout);

  const uniforms = new ArrayBuffer(8);
  new Uint32Array(uniforms)[0] = rows;
  new Uint32Array(uniforms)[1] = cols;

  const encoder = ctx.device.createCommandEncoder();
  dispatch1D(encoder, pipeline, layout, [data, output], uniforms, Math.ceil(rows / 16) * Math.ceil(cols / 16));
  ctx.device.queue.submit([encoder.finish()]);

  return output;
}

export function refTranspose2D(data: Float32Array, rows: number, cols: number): Float32Array {
  return cpuTranspose2D(data, rows, cols);
}

// ─── Interpolation ───

export async function opInterpolate(
  data: Tensor,
  inW: number, inH: number,
  outW: number, outH: number,
  channels: number
): Promise<Tensor> {
  const ctx = getGPUContext();
  const output = Tensor.zeros([outH * outW * channels]);

  const layout = createLayout(3);
  const pipeline = pipelineCache.getOrCreate('interpolate_bilinear', INTERPOLATE_BILINEAR, layout);

  const uniforms = new ArrayBuffer(20);
  const uv = new Uint32Array(uniforms);
  uv[0] = inW; uv[1] = inH; uv[2] = outW; uv[3] = outH; uv[4] = channels;

  const encoder = ctx.device.createCommandEncoder();
  dispatch1D(encoder, pipeline, layout, [data, output], uniforms, Math.ceil(outW / 16) * Math.ceil(outH / 16));
  ctx.device.queue.submit([encoder.finish()]);

  return output;
}

export function refInterpolate(
  data: Float32Array,
  inW: number, inH: number,
  outW: number, outH: number,
  channels: number
): Float32Array {
  return cpuInterpolateBilinear(data, inW, inH, outW, outH, channels);
}
