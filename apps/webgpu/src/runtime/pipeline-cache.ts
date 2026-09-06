// AETHER Tensor Runtime — PipelineCache
// Caches compiled compute pipelines to avoid recompilation

import { getGPUContext } from './gpu-context';

export class PipelineCache {
  private cache = new Map<string, GPUComputePipeline>();

  getOrCreate(name: string, code: string, layout: GPUBindGroupLayout): GPUComputePipeline {
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    const ctx = getGPUContext();
    const pipeline = ctx.device.createComputePipeline({
      layout: ctx.device.createPipelineLayout({ bindGroupLayouts: [layout] }),
      compute: {
        module: ctx.device.createShaderModule({ code }),
        entryPoint: 'main',
      },
    });

    this.cache.set(name, pipeline);
    return pipeline;
  }

  get(name: string): GPUComputePipeline | undefined {
    return this.cache.get(name);
  }

  clear(): void {
    this.cache.clear();
  }
}
