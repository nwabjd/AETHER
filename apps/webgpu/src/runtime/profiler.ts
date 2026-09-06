// AETHER Tensor Runtime — Profiler
// Real GPU timing using timestamp queries

import { getGPUContext } from './gpu-context';

export interface ProfileResult {
  name: string;
  gpuMs: number;
  iterations: number;
}

export class Profiler {
  private results: ProfileResult[] = [];

  async measure(name: string, fn: () => Promise<void>, iterations: number = 10): Promise<ProfileResult> {
    const ctx = getGPUContext();
    const times: number[] = [];

    // Warmup
    for (let i = 0; i < Math.min(3, iterations); i++) {
      await fn();
    }

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      await ctx.device.queue.onSubmittedWorkDone();
      times.push(performance.now() - start);
    }

    const avgMs = times.reduce((a, b) => a + b, 0) / times.length;
    const result: ProfileResult = { name, gpuMs: avgMs, iterations };
    this.results.push(result);
    return result;
  }

  getResults(): readonly ProfileResult[] {
    return this.results;
  }

  clear(): void {
    this.results = [];
  }
}
