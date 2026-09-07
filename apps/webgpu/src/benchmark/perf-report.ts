// AETHER GPU Benchmark — Report model, browser/thermal capture, interpretation.
// Pure data/string logic (no DOM imports) so the interpretation rules and the
// exact TASK 15 JSON shape are unit-testable in Node without WebGPU.

import type { TimingMode, TimingStats } from './timing';
import type { DeviceDiagnostics } from './engine';

export interface Throughput {
  value: number;
  unit: string;
}

export interface PerfSample {
  id: string;
  name: string;
  size: string;
  timingMode: TimingMode;
  iterations: number;
  warmup: number;
  medianMs: number;
  averageMs: number;
  minMs: number;
  maxMs: number;
  stdDevMs: number;
  throughput?: Throughput;
  note?: string;
  error?: string;
}

export interface MemoryResult {
  id: string;
  requestedBytes: number;
  requestedMiB: number;
  created: boolean;
  success: boolean;
  note?: string;
}

export interface OverheadSample {
  id: string;
  name: string;
  size: string;
  timingMode: TimingMode;
  perOpMs: number;
  totalMs: number;
  iterations: number;
  samplesMs: number[];
  note?: string;
}

export interface CommandBatchingResult {
  id: string;
  name: string;
  dispatches: number;
  timingMode: TimingMode;
  totalMedianMs: number;
  perDispatchMs: number;
  samplesMs: number[];
}

export interface SustainedSample {
  second: number;
  avgMs: number;
  gflops: number;
}

export interface SustainedResult {
  durationSeconds: number;
  samples: SustainedSample[];
  first10sAvgGflops: number;
  last10sAvgGflops: number;
  throttled: boolean;
  dropPct: number;
  avgGflops: number;
  minGflops: number;
  maxGflops: number;
  thermalBefore: string;
  thermalAfter: string;
  timingMode: TimingMode | 'AGGREGATE_END_TO_END';
  error?: string;
}

export interface PerfReport {
  device: {
    webgpuAvailable: boolean;
    adapterName: string;
    adapterVendor: string;
    adapterDevice: string;
    features: string[];
    timestampQuerySupport: boolean;
    isFallbackAdapter: boolean;
  };
  browser: {
    userAgent: string;
    platform: string;
    hardwareConcurrency: number | null;
    deviceMemory: number | null;
    thermalState: string;
    gpuUtilization: string;
  };
  webgpu: {
    limits: Record<string, number>;
    maxBufferSize: number;
    maxStorageBufferBindingSize: number;
  };
  timingMode: TimingMode;
  timestamp: string;
  build: { id: string | null; commit: string | null; time: string | null };
  tests: {
    matmul: PerfSample[];
    vecadd: PerfSample[];
    conv2d: PerfSample[];
    softmax: PerfSample[];
    rmsnorm: PerfSample[];
    attention: PerfSample[];
    attentionPhases: { [size: string]: PerfSample[] };
  };
  memory: MemoryResult[];
  bufferReuse: { [mode: string]: OverheadSample };
  pipelineCache: { [mode: string]: OverheadSample };
  commandBatching: CommandBatchingResult[];
  sustained: SustainedResult | null;
  /** Set when a benchmark (e.g. validation) fails and the suite aborts early. */
  suiteError?: string;
}

/** Per TASK 20: never fabricate a utilization figure. */
export function gpuUtilizationValue(): string {
  const nav = typeof navigator !== 'undefined' ? (navigator as unknown as Record<string, unknown>) : undefined;
  if (
    nav &&
    (typeof nav.getGpuUtilization === 'function' ||
      typeof (nav as Record<string, unknown>).gpuUtilization === 'number')
  ) {
    try {
      const v = typeof nav.getGpuUtilization === 'function' ? nav.getGpuUtilization() : nav.gpuUtilization;
      return typeof v === 'number' ? `${v}%` : 'UNAVAILABLE';
    } catch {
      return 'UNAVAILABLE';
    }
  }
  return 'UNAVAILABLE';
}

/**
 * TASK 14: thermal state. Browsers do not generally expose device
 * temperature; report UNAVAILABLE instead of inventing values.
 */
export function thermalStateValue(): string {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  if (!nav) return 'UNAVAILABLE';
  const anyNav = nav as unknown as Record<string, unknown>;
  if (typeof anyNav.getDeviceThermalLevel === 'function') {
    try {
      const v = (anyNav.getDeviceThermalLevel as () => unknown)();
      return String(v);
    } catch {
      return 'UNAVAILABLE';
    }
  }
  return 'UNAVAILABLE';
}

export interface BrowserInfo {
  userAgent: string;
  platform: string;
  hardwareConcurrency: number | null;
  deviceMemory: number | null;
  thermalState: string;
  gpuUtilization: string;
}

export function captureBrowserInfo(): BrowserInfo {
  const nav = typeof navigator !== 'undefined' ? (navigator as unknown as Record<string, unknown>) : undefined;
  return {
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    platform: nav && typeof nav.platform === 'string' ? (nav.platform as string) : 'unknown',
    hardwareConcurrency: nav && typeof nav.hardwareConcurrency === 'number' ? (nav.hardwareConcurrency as number) : null,
    deviceMemory: nav && typeof nav.deviceMemory === 'number' ? (nav.deviceMemory as number) : null,
    thermalState: thermalStateValue(),
    gpuUtilization: gpuUtilizationValue(),
  };
}

export interface ReportInput {
  diag: DeviceDiagnostics;
  browser: BrowserInfo;
  timingMode: TimingMode;
  build: { id: string | null; commit: string | null; time: string | null };
  tests: PerfReport['tests'];
  memory: MemoryResult[];
  bufferReuse: { [mode: string]: OverheadSample };
  pipelineCache: { [mode: string]: OverheadSample };
  commandBatching: CommandBatchingResult[];
  sustained: SustainedResult | null;
  suiteError?: string;
}

/** Round-trip safe for JSON.stringify (NaN/Infinity → null). */
function sanitize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function buildPerfReport(input: ReportInput): PerfReport {
  const diag = input.diag;
  const report: PerfReport = {
    device: {
      webgpuAvailable: diag.webgpuAvailable,
      adapterName: diag.adapterName,
      adapterVendor: diag.adapterVendor,
      adapterDevice: diag.adapterDevice,
      features: diag.adapterFeatures,
      timestampQuerySupport: diag.timestampQuerySupport,
      isFallbackAdapter: diag.isFallbackAdapter,
    },
    browser: input.browser,
    webgpu: {
      limits: {
        maxBufferSize: diag.maxBufferSize,
        maxStorageBufferBindingSize: diag.maxStorageBufferBindingSize,
        maxComputeWorkgroupSizeX: diag.maxComputeWorkgroupSizeX,
        maxComputeWorkgroupSizeY: diag.maxComputeWorkgroupSizeY,
        maxComputeWorkgroupSizeZ: diag.maxComputeWorkgroupSizeZ,
        maxComputeInvocationsPerWorkgroup: diag.maxComputeInvocationsPerWorkgroup,
        maxComputeWorkgroupsPerDimension: diag.maxComputeWorkgroupsPerDimension,
      },
      maxBufferSize: diag.maxBufferSize,
      maxStorageBufferBindingSize: diag.maxStorageBufferBindingSize,
    },
    timingMode: input.timingMode,
    timestamp: new Date().toISOString(),
    build: input.build,
    tests: input.tests,
    memory: input.memory,
    bufferReuse: input.bufferReuse,
    pipelineCache: input.pipelineCache,
    commandBatching: input.commandBatching,
    sustained: input.sustained,
    suiteError: input.suiteError,
  };
  return sanitize(report);
}

export interface IphoneResultSample {
  test: string;
  configuration: string;
  iterations: number;
  warmup: number;
  minMs: number;
  maxMs: number;
  meanMs: number;
  medianMs: number;
  stdDevMs: number;
  timingMode: string;
  throughput?: string | null;
  note?: string | null;
}

export interface IphoneBaselineJson {
  device: PerfReport['device'];
  browser: PerfReport['browser'];
  webgpu: PerfReport['webgpu'];
  timingMode: string;
  timestamp: string;
  commit: string | null;
  results: Record<string, IphoneResultSample>;
}

/** TASK 18 — exact exported JSON shape for benchmarks/iphone-gpu-results.json. */
export function buildIphoneBaseline(report: PerfReport): IphoneBaselineJson {
  const results: Record<string, IphoneResultSample> = {};
  const put = (test: string, configuration: string, s: PerfSample): void => {
    results[`${test}.${configuration}`] = {
      test,
      configuration,
      iterations: s.iterations,
      warmup: s.warmup,
      minMs: s.minMs,
      maxMs: s.maxMs,
      meanMs: s.averageMs,
      medianMs: s.medianMs,
      stdDevMs: s.stdDevMs,
      timingMode: s.timingMode,
      throughput: s.throughput ? `${s.throughput.value.toFixed(2)} ${s.throughput.unit}` : null,
      note: s.note ?? null,
    };
  };

  for (const s of report.tests.matmul) put('matmul', s.size, s);
  for (const s of report.tests.vecadd) put('vecadd', s.size, s);
  for (const s of report.tests.conv2d) put('conv2d', s.size, s);
  for (const s of report.tests.softmax) put('softmax', s.size, s);
  for (const s of report.tests.rmsnorm) put('rmsnorm', s.size, s);
  for (const s of report.tests.attention) put('attention', s.size, s);
  for (const [size, phaseSamples] of Object.entries(report.tests.attentionPhases)) {
    for (const s of phaseSamples) put('attention', `${s.name} ${size}`, s);
  }
  for (const m of report.memory) {
    results[`memory.${m.requestedMiB} MiB`] = {
      test: 'memory',
      configuration: `${m.requestedMiB} MiB`,
      iterations: 1,
      warmup: 0,
      minMs: 0,
      maxMs: 0,
      meanMs: 0,
      medianMs: 0,
      stdDevMs: 0,
      timingMode: 'ALLOCATION',
      note: `${m.requestedMiB} MiB requested (${m.requestedBytes} B) — created=${m.success ? 'yes' : 'no'}, success=${m.success ? 'yes' : 'no'}${m.note ? ` — ${m.note}` : ''}`,
      throughput: null,
    };
  }
  for (const key of Object.keys(report.bufferReuse)) {
    const o = report.bufferReuse[key];
    results[`bufferReuse.${o.name}`] = {
      test: 'bufferReuse',
      configuration: o.name,
      iterations: o.iterations,
      warmup: 0,
      minMs: medianOf(o.samplesMs),
      maxMs: o.samplesMs[o.samplesMs.length - 1] ?? 0,
      meanMs: o.totalMs / Math.max(o.iterations, 1),
      medianMs: o.perOpMs,
      stdDevMs: 0,
      timingMode: o.timingMode,
      throughput: null,
      note: `per-op (median) ${o.perOpMs.toFixed(3)} ms — ${o.note ?? ''}`.trim(),
    };
  }
  for (const key of Object.keys(report.pipelineCache)) {
    const o = report.pipelineCache[key];
    results[`pipelineReuse.${o.name}`] = {
      test: 'pipelineReuse',
      configuration: o.name,
      iterations: o.iterations,
      warmup: 0,
      minMs: medianOf(o.samplesMs),
      maxMs: o.samplesMs[o.samplesMs.length - 1] ?? 0,
      meanMs: o.totalMs / Math.max(o.iterations, 1),
      medianMs: o.perOpMs,
      stdDevMs: 0,
      timingMode: o.timingMode,
      throughput: null,
      note: `per-op (median) ${o.perOpMs.toFixed(3)} ms — ${o.note ?? ''}`.trim(),
    };
  }
  for (const c of report.commandBatching) {
    results[`commandBatching.${c.name}`] = {
      test: 'commandBatching',
      configuration: c.name,
      iterations: c.samplesMs.length,
      warmup: 0,
      minMs: c.samplesMs[0] ?? 0,
      maxMs: c.samplesMs[c.samplesMs.length - 1] ?? 0,
      meanMs: c.samplesMs.reduce((a, b) => a + b, 0) / Math.max(c.samplesMs.length, 1),
      medianMs: c.totalMedianMs,
      stdDevMs: 0,
      timingMode: c.timingMode,
      throughput: null,
      note: `${c.dispatches} work dispatches across ${c.name.includes('one command buffer') ? 'passes in one command buffer' : 'separate submissions'}`,
    };
  }
  if (report.sustained) {
    const s = report.sustained;
    results['sustained.30sec'] = {
      test: 'sustained',
      configuration: 'MatMul 256×256, 30 seconds',
      iterations: s.samples.length,
      warmup: 0,
      minMs: s.minGflops,
      maxMs: s.maxGflops,
      meanMs: s.avgGflops,
      medianMs: s.samples[Math.floor(s.samples.length / 2)]?.gflops ?? 0,
      stdDevMs: 0,
      timingMode: s.timingMode,
      throughput: null,
      note: `avg ${s.avgGflops.toFixed(1)} GFLOPS; first10s ${s.first10sAvgGflops.toFixed(1)}, last10s ${s.last10sAvgGflops.toFixed(1)}; throttled=${s.throttled ? 'yes' : 'no'} (miss=${s.dropPct.toFixed(1)}%)${s.error ? ` — ${s.error}` : ''}`,
    };
  }
  if (report.suiteError) results['suite.error'] = {
    test: 'suite',
    configuration: 'aborted',
    iterations: 0,
    warmup: 0,
    minMs: 0,
    maxMs: 0,
    meanMs: 0,
    medianMs: 0,
    stdDevMs: 0,
    timingMode: report.timingMode,
    throughput: null,
    note: report.suiteError,
  };

  return {
    device: report.device,
    browser: report.browser,
    webgpu: report.webgpu,
    timingMode: report.timingMode,
    timestamp: report.timestamp,
    commit: report.build.commit,
    results,
  };
}

// ─── TASK 21 — result interpretation (data-driven, no theoretical maxima) ───

function medianOf(times: number[]): number {
  if (times.length === 0) return 0;
  const sorted = [...times].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

export function interpretResults(report: PerfReport): string[] {
  const lines: string[] = [];
  const matmul = report.tests.matmul;
  const vecadd = report.tests.vecadd;
  const attn = report.tests.attention;

  const bestMatmul = (() => {
    if (matmul.length === 0) return null;
    const withGflops = matmul.filter((s) => s.throughput);
    if (withGflops.length === 0) return null;
    return withGflops.reduce((a, b) => (a.throughput!.value > b.throughput!.value ? a : b));
  })();

  if (bestMatmul) {
    lines.push(
      `compute-bound: largest MatMul throughput measured ${bestMatmul.throughput!.value.toFixed(1)} ${bestMatmul.throughput!.unit} at ${bestMatmul.size} — matrix multiply is the classic compute-bound workload here.`
    );
  } else {
    lines.push('compute-bound: no usable MatMul throughput recorded.');
  }

  const bestVec = vecadd.reduce<PerfSample | null>(
    (acc, s) => (s.throughput && (!acc || s.throughput.value > acc.throughput!.value) ? s : acc),
    null
  );
  if (bestVec && bestVec.throughput) {
    lines.push(
      `memory-bandwidth-sensitive: Vector Add peaks at ${bestVec.throughput.value.toFixed(1)} ${bestVec.throughput.unit} at ${bestVec.size} — trivial ALU per element, so this reflects practical device memory bandwidth.`
    );
  } else {
    lines.push('memory-bandwidth-sensitive: no usable Vector Add bandwidth recorded.');
  }

  if (attn.length >= 2) {
    const sorted = [...attn].sort((a, b) => a.size.length - b.size.length);
    const largest = sorted[sorted.length - 1];
    lines.push(
      `attention bottleneck: largest tested single-pass attention (${largest.size}) took ${largest.medianMs.toFixed(2)} ms median (${largest.timingMode}). Scores grow O(seq²): this is the workload most likely to bottleneck video diffusion decoding.`
    );
  } else if (attn.length === 1) {
    lines.push(
      `attention bottleneck: attention at ${attn[0].size} took ${attn[0].medianMs.toFixed(2)} ms median (${attn[0].timingMode}). Scores grow O(seq²).`
    );
  }

  // Attention scaling: doubling seq should ~quadruple score-compute time.
  const scaled: PerfSample[] = attn.filter((s) => /seq=(\d+)/.test(s.size)).sort((a, b) => parseInt(b.size.match(/seq=(\d+)/)![1], 10) - parseInt(a.size.match(/seq=(\d+)/)![1], 10));
  if (scaled.length >= 2) {
    const bigger = scaled[0]; // largest seq
    const smaller = scaled[1];
    const ratio = bigger.medianMs / Math.max(smaller.medianMs, 1e-9);
    const seqBig = parseInt(bigger.size.match(/seq=(\d+)/)![1], 10);
    const seqSmall = parseInt(smaller.size.match(/seq=(\d+)/)![1], 10);
    const step = seqBig / seqSmall;
    lines.push(
      `attention scaling: ${bigger.size} ran ${ratio.toFixed(2)}× slower than ${smaller.size} (seq ×${step}). With O(seq²) scores, doubling seq multiplies score work by ~4× — expect ~${(step * step).toFixed(1)}× per double if score-dominated.`
    );
  } else {
    lines.push('attention scaling: need 2+ attention sizes to compute a scaling ratio.');
  }

  const okMemory = report.memory.filter((m) => m.created && m.success);
  if (okMemory.length > 0) {
    const largest = okMemory.reduce((a, b) => (a.requestedBytes > b.requestedBytes ? a : b));
    lines.push(
      `largest safe tested tensor: single storage buffer of ${(largest.requestedBytes / (1024 * 1024)).toFixed(0)} MiB allocated and survived. This is a tested allocation, not the total GPU memory.`
    );
  } else {
    lines.push('largest safe tested tensor: no successful memory allocation recorded.');
  }

  const brs = report.bufferReuse;
  if (brs.allocateDestroy && brs.bufferReuse && brs.allocateDestroy.perOpMs > 0) {
    const ratio = brs.bufferReuse.perOpMs / brs.allocateDestroy.perOpMs;
    lines.push(
      `buffer reuse: persistent reuse measured ${(ratio * 100).toFixed(0)}% of the allocate/destroy per-op cost (${brs.allocateDestroy.perOpMs.toFixed(3)} ms → ${brs.bufferReuse.perOpMs.toFixed(3)} ms). Persistent buffers should be the default in the tensor runtime.`
    );
  } else {
    lines.push('buffer reuse: insufficient data to compare allocation strategies.');
  }

  return lines;
}

/** Mark helper: expose stats median helper for the sustained test. */
export { medianOf };