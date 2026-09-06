// AETHER Tensor Runtime — Barrel export

export { TensorShape } from './tensor-shape';
export { TensorDType, dtypeBytes } from './tensor-dtype';
export { TensorBuffer } from './tensor-buffer';
export { TensorArena } from './tensor-arena';
export { Tensor } from './tensor';
export { initGPUContext, getGPUContext, destroyGPUContext } from './gpu-context';
export { CommandScheduler } from './command-scheduler';
export { KernelRegistry } from './kernel-registry';
export { PipelineCache } from './pipeline-cache';
export { MemoryPool } from './memory-pool';
export { Profiler } from './profiler';

export {
  opMatmul, opMatmulQuant, opAdd, opMultiply,
  opRMSNorm, opLayerNorm, opSoftmax, opRoPE,
  opConv2D, opTranspose2D, opInterpolate,
  refMatmul, refMatmulQuant, refAdd, refMultiply,
  refRMSNorm, refLayerNorm, refSoftmax, refRoPE,
  refConv2D, refTranspose2D, refInterpolate,
} from './kernels/ops';
