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