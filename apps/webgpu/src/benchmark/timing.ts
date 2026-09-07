// AETHER GPU Benchmark — TimingManager + statistics
//
// TASK 12 (timing accuracy): the manager decides once whether the device
// supports WebGPU timestamp queries. If supported it measures GPU pass
// duration directly via timestamps (beginning/end of pass). Otherwise every
// measurement is clearly a FULL END-TO-END completion timing
// (submit → wait for completion) and is NEVER labelled "GPU execution time".
// A single report never mixes the two modes; each sample carries its mode.

export type TimingMode = 'GPU_TIMESTAMP' | 'END_TO_END';

export interface TimingStats {
  mode: TimingMode;
  /** number of measured iterations actually recorded */
  iterations: number;
  /** number of warmup iterations that were run but not recorded */
  warmup: number;
  avgMs: number;
  medianMs: number;
  minMs: number;
  maxMs: number;
  stdDevMs: number;
  /** sorted per-iteration times (ms) — raw data for the report */
  samplesMs: number[];
  /** reason a fallback occurred, when mode flipped mid-measurement */
  note?: string;
}

export function statsOf(times: number[], mode: TimingMode, iterations: number, warmup: number, note?: string): TimingStats {
  const n = times.length;
  const sorted = [...times].sort((a, b) => a - b);
  const avg = n > 0 ? times.reduce((a, b) => a + b, 0) / n : 0;
  const median = n > 0 ? sorted[Math.floor(n / 2)] : 0;
  const variance = n > 0 ? times.reduce((a, b) => a + (b - avg) * (b - avg), 0) / n : 0;
  return {
    mode,
    iterations: n,
    warmup,
    avgMs: avg,
    medianMs: median,
    minMs: n > 0 ? sorted[0] : 0,
    maxMs: n > 0 ? sorted[n - 1] : 0,
    stdDevMs: Math.sqrt(variance),
    samplesMs: sorted,
    note,
  };
}

interface TimestampWrites {
  querySet: GPUQuerySet;
  beginningOfPassWriteIndex: number;
  endOfPassWriteIndex: number;
}

export interface MeasureOptions {
  iterations: number;
  warmup?: number;
  /**
   * End-to-end completion wait used when timestamp queries are unavailable or
   * unsupported. Returning when the submitted work has finished on the GPU
   * keeps end-to-end numbers honest instead of measuring submission only.
   */
  wait?: () => Promise<void>;
}

export class TimingManager {
  private readonly device: GPUDevice;
  private _mode: TimingMode;
  private _querySet: GPUQuerySet | null = null;
  private _resolve: GPUBuffer | null = null;
  private _periodNs = 1;
  private _fallbackLogged: string | null = null;

  constructor(device: GPUDevice) {
    this.device = device;
    const ok = this.tryEnableTimestamps(device);
    this._mode = ok ? 'GPU_TIMESTAMP' : 'END_TO_END';
  }

  private tryEnableTimestamps(device: GPUDevice): boolean {
    try {
      if (!device.features || typeof device.features.has !== 'function') return false;
      if (!device.features.has('timestamp-query')) return false;

      const querySet = device.createQuerySet({ type: 'timestamp', count: 2 });
      const resolve = device.createBuffer({
        size: 16,
        usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
      });

      // Probe the pass-level timestampWrites API once so a silently unsupported
      // implementation falls back before any measurement, not in the middle.
      const enc = device.createCommandEncoder();
      const pass = enc.beginComputePass({
        timestampWrites: {
          querySet,
          beginningOfPassWriteIndex: 0,
          endOfPassWriteIndex: 1,
        },
      });
      pass.end();
      enc.finish();

      this._querySet = querySet;
      this._resolve = resolve;
      const period = (device.limits as unknown as { timestampPeriod?: number }).timestampPeriod;
      this._periodNs = typeof period === 'number' && period > 0 ? period : 1;
      return true;
    } catch {
      this._querySet?.destroy?.();
      this._resolve?.destroy?.();
      this._querySet = null;
      this._resolve = null;
      return false;
    }
  }

  get mode(): TimingMode {
    return this._mode;
  }

  get fallbackNote(): string | null {
    return this._fallbackLogged;
  }

  async measure(fn: (pass: GPUComputePassEncoder) => void, opts: MeasureOptions): Promise<TimingStats> {
    const warmup = opts.warmup ?? 3;

    // Warmup: run through the full dispatch path (including the end-to-end
    // sync so shader JIT / first-submit latency settles) without recording.
    for (let i = 0; i < warmup; i++) {
      this.dispatchPass(fn);
      await this.sync();
    }

    const times: number[] = [];
    for (let i = 0; i < opts.iterations; i++) {
      let ms: number;
      if (this._mode === 'GPU_TIMESTAMP') {
        const t = await this.measureTimestampPass(fn);
        if (t === null) {
          this.fallback('timestamp query returned zero/undefined values — switched to END_TO_END');
          ms = await this.measureEndToEnd(fn, opts.wait);
        } else {
          ms = t;
        }
      } else {
        ms = await this.measureEndToEnd(fn, opts.wait);
      }
      times.push(ms);
    }

    return statsOf(times, this._mode, opts.iterations, warmup, this._fallbackLogged ?? undefined);
  }

  private dispatchPass(fn: (pass: GPUComputePassEncoder) => void, tsWrites?: TimestampWrites): GPUCommandEncoder {
    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginComputePass(tsWrites ? { timestampWrites: tsWrites } : undefined);
    fn(pass);
    pass.end();
    return encoder;
  }

  /**
   * Time a single dispatch pass. Used for phase measurements where each
   * iteration needs preparation dispatches before the timed pass runs.
   */
  async timeOne(fn: (pass: GPUComputePassEncoder) => void, wait?: () => Promise<void>): Promise<number> {
    if (this._mode === 'GPU_TIMESTAMP') {
      const t = await this.measureTimestampPass(fn);
      if (t !== null) return t;
      this.fallback('timestamp query returned zero/undefined values — switched to END_TO_END');
    }
    return this.measureEndToEnd(fn, wait);
  }

  private async measureTimestampPass(fn: (pass: GPUComputePassEncoder) => void): Promise<number | null> {
    if (!this._querySet || !this._resolve) return null;
    try {
      const encoder = this.dispatchPass(fn, {
        querySet: this._querySet,
        beginningOfPassWriteIndex: 0,
        endOfPassWriteIndex: 1,
      });
      encoder.resolveQuerySet(this._querySet, 0, 2, this._resolve, 0);
      this.device.queue.submit([encoder.finish()]);

      const staging = this.device.createBuffer({
        size: 16,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      });
      const copy = this.device.createCommandEncoder();
      copy.copyBufferToBuffer(this._resolve, 0, staging, 0, 16);
      this.device.queue.submit([copy.finish()]);

      await staging.mapAsync(GPUMapMode.READ);
      const ts = new BigUint64Array(staging.getMappedRange());
      const delta = Number(ts[1] - ts[0]);
      staging.unmap();
      staging.destroy();
      if (!(delta > 0)) return null;
      return (delta * this._periodNs) / 1e6;
    } catch {
      return null;
    }
  }

  private async measureEndToEnd(fn: (pass: GPUComputePassEncoder) => void, wait?: () => Promise<void>): Promise<number> {
    const start = performance.now();
    const encoder = this.dispatchPass(fn);
    this.device.queue.submit([encoder.finish()]);
    if (wait) {
      await wait();
    } else {
      await this.sync();
    }
    return performance.now() - start;
  }

  /** Wait for all previously submitted work to finish (completion sync). */
  private async sync(): Promise<void> {
    try {
      await this.device.queue.onSubmittedWorkDone();
    } catch {
      // iOS Safari may reject onSubmittedWorkDone; fall back to a bounded wait.
      await new Promise((r) => setTimeout(r, 16));
    }
  }

  private fallback(reason: string) {
    if (!this._fallbackLogged) this._fallbackLogged = reason;
    this._mode = 'END_TO_END';
    try {
      this._querySet?.destroy();
      this._resolve?.destroy();
    } catch {
      // best-effort cleanup
    }
    this._querySet = null;
    this._resolve = null;
  }

  destroy() {
    try {
      this._querySet?.destroy();
      this._resolve?.destroy();
    } catch {
      // best-effort cleanup
    }
    this._querySet = null;
    this._resolve = null;
  }
}