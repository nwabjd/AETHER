// AETHER GPU Benchmark — Amplified Timing (Performance V2)
//
// TASK 2 (AmplifiedTimingManager): sidesteps browser timer resolution issues
// by repeating small workloads N times in a single command buffer.
// Measures total time for N repetitions and reports per-dispatch average.
// Avoids 0.0 results for sub-millisecond operations.

import { CompletionToken, awaitCompletion } from './completion.ts';
import { harnessCounters } from './harness-counters.ts';
import { statsOf, type TimingMode } from './timing.ts';

export type AmplifiedTimingMode = 'AMPLIFIED_END_TO_END' | 'AMPLIFIED_GPU_TIMESTAMP';

export interface AmplifiedTimingStats {
  mode: AmplifiedTimingMode;
  iterations: number;
  warmup: number;
  repetitions: number;
  totalMs: {
    avg: number;
    median: number;
    min: number;
    max: number;
    stdDev: number;
  };
  perDispatchMs: {
    avg: number;
    median: number;
    min: number;
    max: number;
    stdDev: number;
  };
  samplesTotalMs: number[];
}

export class AmplifiedTimingManager {
  private readonly device: GPUDevice;
  private readonly _completion: CompletionToken;
  private readonly _targetMinMs = 20;
  private readonly _targetMaxMs = 200;

  constructor(device: GPUDevice) {
    this.device = device;
    this._completion = new CompletionToken(device);
  }

  /**
   * TASK 18: Detect effective timer resolution.
   * Measures performance.now() jitter by repeatedly calling it.
   */
  static detectTimerResolution(): number {
    let minDelta = Infinity;
    for (let i = 0; i < 100; i++) {
      const t1 = performance.now();
      let t2 = performance.now();
      while (t2 === t1) {
        t2 = performance.now();
      }
      minDelta = Math.min(minDelta, t2 - t1);
    }
    return minDelta;
  }

  /**
   * TASK 4: Automatically choose repetition count to hit target duration (20-200ms).
   * Starts at 1, multiplies by 10 until target reached or capped.
   */
  async estimateRepetitions(
    fn: (pass: GPUComputePassEncoder) => void,
    maxReps = 1000
  ): Promise<number> {
    let reps = 1;
    while (reps < maxReps) {
      const elapsed = await this.measureOneBlock(fn, reps);
      if (elapsed >= this._targetMinMs) break;
      
      // If 1 rep was e.g. 0.1ms, 10 reps might be 1ms, 100 reps 10ms...
      // We want to reach at least 20ms.
      const nextReps = reps * 10;
      if (nextReps > maxReps) break;
      reps = nextReps;
    }
    return reps;
  }

  /**
   * TASK 3/5/17: Run amplified measurement suite.
   * Warmup x3, then 5 amplified measurements.
   */
  async measure(
    fn: (pass: GPUComputePassEncoder) => void,
    opts: { iterations?: number; warmup?: number; maxReps?: number } = {}
  ): Promise<AmplifiedTimingStats> {
    const iterations = opts.iterations ?? 5;
    const warmup = opts.warmup ?? 3;
    const maxReps = opts.maxReps ?? 1000;

    const repetitions = await this.estimateRepetitions(fn, maxReps);

    // Warmup
    for (let i = 0; i < warmup; i++) {
      await this.measureOneBlock(fn, repetitions);
    }

    const samplesTotalMs: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const ms = await this.measureOneBlock(fn, repetitions);
      samplesTotalMs.push(ms);
    }

    const totalStats = statsOf(samplesTotalMs, 'END_TO_END', iterations, warmup);
    const perDispatchMs = samplesTotalMs.map(t => t / repetitions);
    const perDispatchStats = statsOf(perDispatchMs, 'END_TO_END', iterations, warmup);

    return {
      mode: 'AMPLIFIED_END_TO_END',
      iterations,
      warmup,
      repetitions,
      totalMs: {
        avg: totalStats.avgMs,
        median: totalStats.medianMs,
        min: totalStats.minMs,
        max: totalStats.maxMs,
        stdDev: totalStats.stdDevMs,
      },
      perDispatchMs: {
        avg: perDispatchStats.avgMs,
        median: perDispatchStats.medianMs,
        min: perDispatchStats.minMs,
        max: perDispatchStats.maxMs,
        stdDev: perDispatchStats.stdDevMs,
      },
      samplesTotalMs: totalStats.samplesMs,
    };
  }

  /**
   * TASK 3/8/9: Encodes N compute passes into one command buffer,
   * waits for completion once, returns total wall-clock time.
   */
  private async measureOneBlock(
    fn: (pass: GPUComputePassEncoder) => void,
    reps: number
  ): Promise<number> {
    const start = performance.now();
    const encoder = this.device.createCommandEncoder({ label: `Amplified_Block_${reps}` });
    harnessCounters.onCommandBufferCreated();

    for (let i = 0; i < reps; i++) {
      const pass = encoder.beginComputePass();
      fn(pass);
      pass.end();
    }

    // TASK 9: Completion token (tiny copy) at the end of the same command buffer.
    this._completion.encode(encoder);
    const cmd = encoder.finish();
    this.device.queue.submit([cmd]);
    harnessCounters.onCommandBufferSubmitted('measurement');

    await awaitCompletion(this.device, this._completion, 'amplified-block');
    return performance.now() - start;
  }

  destroy() {
    this._completion.destroy();
  }
}
