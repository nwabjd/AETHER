// AETHER GPU Benchmark — Amplified Timing (Performance V2, Adaptive)
//
// Purpose: produce timer-robust measurements for sub-millisecond GPU workloads
// where Safari/WebKit's performance.now() quantization makes single-dispatc.h
// timings unreliable (legacy END_TO_END often reports 0.000 ms / Infinity).
//
// Methodology (HOST_WALL_CLOCK_AMPLIFIED):
//   one command encoder → N identical dispatches → ONE submit → ONE tiny
//   completion token → await completion once. totalMs is HOST wall-clock for
//   the whole block; perDispatchMs = totalMs / N.
//
// Never fabricates GPU timestamps. If real timestamp-query support is later
// detected and enabled, that path is reported as GPU_TIMESTAMP and is kept
// strictly separate from the host-wall-clock path.

import { CompletionToken, awaitCompletion } from './completion.ts';
import { harnessCounters } from './harness-counters.ts';

export type V2TimingMethod = 'HOST_WALL_CLOCK_AMPLIFIED' | 'GPU_TIMESTAMP';

/** TASK 4: explicit repetition ladder (order of magnitude steps). */
export const AMPLIFICATION_LADDER: readonly number[] = [
  1, 10, 100, 1_000, 10_000, 100_000, 1_000_000,
];

export interface AmplifiedTimingStats {
  method: V2TimingMethod;
  repetitions: number;
  totalMs: number;        // median total elapsed (host wall clock)
  perDispatchMs: number;  // median per-dispatch
  medianMs: number;       // aliases for schema clarity
  meanMs: number;
  minMs: number;
  maxMs: number;
  stddevMs: number;
  warmup: number;
  iterations: number;
  measurable: boolean;
  reason?: string;
  samplesTotalMs: number[];
}

export class AmplifiedTimingManager {
  private readonly device: GPUDevice;
  private _completion: CompletionToken;
  private readonly targetMinMs: number;
  private readonly targetMaxMs: number;
  readonly timerResolutionMs: number;

  constructor(device: GPUDevice, opts: { targetMinMs?: number; targetMaxMs?: number } = {}) {
    this.device = device;
    this.targetMinMs = opts.targetMinMs ?? 20;
    this.targetMaxMs = opts.targetMaxMs ?? 200;
    this._completion = new CompletionToken(device);
    this.timerResolutionMs = AmplifiedTimingManager.detectTimerResolution();
  }

  destroy() {
    try {
      this._completion.destroy();
    } catch {
      // best-effort
    }
  }

  /**
   * TASK 18: Explicit timer-resolution detector.
   * Smallest observable positive delta of performance.now() over many samples.
   */
  static detectTimerResolution(samples = 200): number {
    let min = Infinity;
    for (let i = 0; i < samples; i++) {
      const a = performance.now();
      let b = performance.now();
      while (b === a) {
        b = performance.now();
      }
      const d = b - a;
      if (d > 0 && d < min) min = d;
    }
    // A robust floor so we never claim sub-microsecond resolution that the
    // platform does not actually provide.
    if (!Number.isFinite(min) || min <= 0) min = 1;
    return min;
  }

  /**
   * TASK 2/4: Adaptive amplification.
   *
   * 1. Run a small calibration block (one dispatch) to get a per-dispatch
   *    estimate, applying the explicit ladder upward only as needed.
   * 2. Compute the repetitions needed to reach `targetMinMs` total.
   * 3. Clamp to the nearest ladder step that is >= needed.
   * 4. Never exceed a safe max (default 1,000,000) to avoid a GPU watchdog hit.
   *
   * Guarantees: if the calibration itself is measurable, the returned `reps`
   * will reach the target unless capped by safety — it never silently returns a
   * reps count that is far short of the target the way a blind x10 loop can.
   */
  async estimateRepetitions(
    fn: (pass: GPUComputePassEncoder) => void,
    maxReps = 1_000_000
  ): Promise<number> {
    // Calibrate with the smallest block so the per-workload estimate is cheap.
    let calibrationReps = 1;
    let calMs = await this.measureOneBlock(fn, calibrationReps);
    if (calMs <= 0 || !Number.isFinite(calMs)) {
      // Timer quantization swallowed even one dispatch. Climb a little.
      calMs = 0;
      for (const step of AMPLIFICATION_LADDER) {
        if (step === 1) continue;
        const m = await this.measureOneBlock(fn, step);
        if (m > 0 && Number.isFinite(m)) {
          calibrationReps = step;
          calMs = m;
          break;
        }
      }
      if (calMs <= 0 || !Number.isFinite(calMs)) {
        // Genuinely unmeasurable even after laddering.
        return Math.min(AMPLIFICATION_LADDER[AMPLIFICATION_LADDER.length - 1], maxReps);
      }
    }

    const perDispatchEstimate = calMs / calibrationReps;
    // How many repetitions to reach the target window (guard divide-by-zero).
    let needed = Math.ceil(this.targetMinMs / perDispatchEstimate);
    if (!Number.isFinite(needed) || needed <= 0) needed = 1;

    // Snap `needed` up to the next ladder step (>= needed).
    let reps = AMPLIFICATION_LADDER[AMPLIFICATION_LADDER.length - 1];
    for (const step of AMPLIFICATION_LADDER) {
      if (step >= needed) {
        reps = step;
        break;
      }
    }
    // Safety cap below the GPU watchdog maximum.
    reps = Math.min(reps, maxReps);
    return Math.max(reps, 1);
  }

  /**
   * TASK 3/8/9: Run warmup (actually submitted + awaited) then `iterations`
   * amplified measurements. Returns per-block total + computed stats.
   */
  async measure(
    fn: (pass: GPUComputePassEncoder) => void,
    opts: { iterations?: number; warmup?: number; maxReps?: number; method?: V2TimingMethod } = {}
  ): Promise<AmplifiedTimingStats> {
    const iterations = opts.iterations ?? 7;
    const warmup = opts.warmup ?? 3;
    const maxReps = opts.maxReps ?? 1_000_000;
    const method: V2TimingMethod = opts.method ?? 'HOST_WALL_CLOCK_AMPLIFIED';

    const repetitions = await this.estimateRepetitions(fn, maxReps);

    // TASK 8: warmups are genuinely submitted and awaited (measureOneBlock does
    // encoder → finish → submit → completion). We never build-then-discard.
    for (let i = 0; i < warmup; i++) {
      await this.measureOneBlock(fn, repetitions);
    }

    const samplesTotalMs: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const ms = await this.measureOneBlock(fn, repetitions);
      samplesTotalMs.push(ms);
    }

    const finites = samplesTotalMs.filter((t) => Number.isFinite(t) && t > 0);
    const measurable = finites.length > 0;

    const total = this.stats(finites);
    const per = this.stats(finites.map((t) => t / repetitions));

    return {
      method,
      repetitions,
      totalMs: total.median,
      perDispatchMs: per.median,
      medianMs: total.median,
      meanMs: total.mean,
      minMs: total.min,
      maxMs: total.max,
      stddevMs: total.stddev,
      warmup,
      iterations,
      measurable,
      reason: measurable ? undefined : 'timer_resolution',
      samplesTotalMs,
    };
  }

  /** TASK 9: statistics — median primary; also mean/min/max/stddev. */
  private stats(times: number[]): { median: number; mean: number; min: number; max: number; stddev: number } {
    const n = times.length;
    if (n === 0) {
      return { median: 0, mean: 0, min: 0, max: 0, stddev: 0 };
    }
    const sorted = [...times].sort((a, b) => a - b);
    const median = sorted[Math.floor(n / 2)];
    const mean = times.reduce((a, c) => a + c, 0) / n;
    const min = sorted[0];
    const max = sorted[n - 1];
    const variance = times.reduce((a, c) => a + (c - mean) * (c - mean), 0) / n;
    return { median, mean, min, max, stddev: Math.sqrt(variance) };
  }

  /**
   * TASK 3/6: Measure one amplified block.
   * one command encoder → N dispatches → finish → submit → one completion token
   * → await once. This keeps submission/sync overhead amortized across N.
   */
  private async measureOneBlock(fn: (pass: GPUComputePassEncoder) => void, reps: number): Promise<number> {
    const start = performance.now();
    const encoder = this.device.createCommandEncoder({ label: `Amplified_Block_${reps}` });
    harnessCounters.onCommandBufferCreated();

    for (let i = 0; i < reps; i++) {
      const pass = encoder.beginComputePass();
      fn(pass);
      pass.end();
    }

    // TASK 7/9: tiny completion token — never a full-output readback.
    this._completion.encode(encoder);
    const cmd = encoder.finish();
    try {
      this.device.queue.submit([cmd]);
    } catch (e) {
      return 0;
    }
    harnessCounters.onCommandBufferSubmitted('measurement');

    try {
      await awaitCompletion(this.device, this._completion, 'amplified-block');
    } catch {
      return 0;
    }
    const elapsed = performance.now() - start;
    return Number.isFinite(elapsed) && elapsed >= 0 ? elapsed : 0;
  }
}

/**
 * TASK 3/11: Centralized throughput computation that NEVER emits
 * Infinity / NaN / -0 undefined. If elapsed seconds <= 0, returns an
 * unmeasurable result.
 *
 * `factorPerDispatch` is the operation count (FLOPs or bytes) per dispatch.
 */
export function computeThroughput(
  factorPerDispatch: number,
  perDispatchMs: number | null | undefined
): { value: number | null; unit: string; measurable: boolean; reason?: string } {
  const secs = (Number(perDispatchMs) || 0) / 1000;
  if (!(secs > 0) || !Number.isFinite(secs) || !(factorPerDispatch > 0)) {
    return { value: null, unit: '', measurable: false, reason: 'timer_resolution' };
  }
  const value = factorPerDispatch / secs;
  if (!Number.isFinite(value)) {
    return { value: null, unit: '', measurable: false, reason: 'timer_resolution' };
  }
  return { value, unit: 'op/s', measurable: true };
}

/** Pick an SI-ish unit label for the throughput magnitude. */
export function throughputLabel(magnitude: number): string {
  if (magnitude >= 1e9) return 'G/s';
  if (magnitude >= 1e6) return 'M/s';
  if (magnitude >= 1e3) return 'k/s';
  return '/s';
}

export interface V2ResultRow {
  name: string;
  workload: string;
  repetitions: number;
  totalMs: number;
  perDispatchMs: number;
  medianMs: number;
  meanMs: number;
  minMs: number;
  maxMs: number;
  stddevMs: number;
  timingMethod: V2TimingMethod;
  timerResolutionMs: number;
  throughput: number | null;
  throughputUnit: string;
  measurable: boolean;
  reason?: string;
}

/** TASK 12: Build a schema-conformant result row, Infinity-guarded. */
export function buildV2ResultRow(
  s: AmplifiedTimingStats,
  timerResolutionMs: number,
  row: {
    name: string;
    workload: string;
    factorPerDispatch: number;
    throughputUnitPrefix?: string;
  }
): V2ResultRow {
  const tp = computeThroughput(row.factorPerDispatch, s.perDispatchMs);
  const unit = tp.measurable && tp.unit
    ? `${(row.throughputUnitPrefix ?? '')}${throughputLabel(tp.value!)}`
    : '';
  return {
    name: row.name,
    workload: row.workload,
    repetitions: s.repetitions,
    totalMs: s.totalMs,
    perDispatchMs: s.perDispatchMs,
    medianMs: s.medianMs,
    meanMs: s.meanMs,
    minMs: s.minMs,
    maxMs: s.maxMs,
    stddevMs: s.stddevMs,
    timingMethod: s.method,
    timerResolutionMs,
    throughput: tp.value,
    throughputUnit: unit,
    measurable: s.measurable && tp.measurable,
    reason: s.measurable ? tp.reason : s.reason,
  };
}

/** Display helper: never prints Infinity/NaN/-0. */
export function fmtPerDispatch(ms: number | null | undefined): string {
  const v = Number(ms);
  if (!Number.isFinite(v) || v < 0) return '—';
  if (v === 0) return '0.000 ms';
  if (v < 1) return `${(v * 1000).toFixed(1)} µs`;
  return `${v.toFixed(3)} ms`;
}

export function fmtThroughput(tp: number | null | undefined, unit: string): string {
  if (tp === null || tp === undefined || !Number.isFinite(tp)) return 'UNMEASURABLE';
  return `${tp.toFixed(2)} ${unit || 'op/s'}`;
}
