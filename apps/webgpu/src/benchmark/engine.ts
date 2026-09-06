// AETHER GPU Benchmark — Core Engine
// Real timing using performance.now() + queue.onSubmittedWorkDone()
// All measurements are from actual execution, never theoretical

export interface BenchmarkResult {
  id: string;
  name: string;
  inputSize: string;
  executionTimeMs: number;
  throughput: string;
  memoryBytes: number;
  success: boolean;
  error?: string;
  gpuTimingAvailable: boolean;
  details?: Record<string, string | number>;
}

export interface DeviceDiagnostics {
  webgpuAvailable: boolean;
  adapterName: string;
  adapterVendor: string;
  adapterDevice: string;
  adapterFeatures: string[];
  adapterLimits: Record<string, number>;
  preferredCanvasFormat: string | null;
  maxBufferSize: number;
  maxStorageBufferBindingSize: number;
  maxComputeWorkgroupSizeX: number;
  maxComputeWorkgroupSizeY: number;
  maxComputeWorkgroupSizeZ: number;
  maxComputeInvocationsPerWorkgroup: number;
  maxComputeWorkgroupsPerDimension: number;
  timestampQuerySupport: boolean;
  isFallbackAdapter: boolean;
}

let _device: GPUDevice | null = null;
let _adapter: GPUAdapter | null = null;
let _diagnostics: DeviceDiagnostics | null = null;

export async function initBenchmark(): Promise<DeviceDiagnostics> {
  if (_diagnostics) return _diagnostics;

  if (!navigator.gpu) {
    throw new Error('WebGPU not supported');
  }

  const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
  if (!adapter) throw new Error('No GPU adapter available');

  const hasTimestampQuery = adapter.features.has('timestamp-query');

  const device = await adapter.requestDevice({
    requiredFeatures: hasTimestampQuery ? ['timestamp-query'] : [],
  });

  device.lost.then(info => {
    console.error('Benchmark device lost:', info.message);
    _device = null;
    _adapter = null;
    _diagnostics = null;
  });

  _adapter = adapter;
  _device = device;

  let preferredCanvasFormat: string | null = null;
  try {
    preferredCanvasFormat = navigator.gpu.getPreferredCanvasFormat();
  } catch {
    // not available in all contexts
  }

  const lim = adapter.limits;
  const featuresArr: string[] = [];
  for (const f of adapter.features) {
    featuresArr.push(f);
  }

  _diagnostics = {
    webgpuAvailable: true,
    adapterName: (adapter as any).name ?? 'Unknown',
    adapterVendor: (adapter as any).vendor ?? 'Unknown',
    adapterDevice: (adapter as any).device ?? 'Unknown',
    adapterFeatures: featuresArr,
    adapterLimits: {
      maxBufferSize: lim.maxBufferSize,
      maxTextureDimension1D: lim.maxTextureDimension1D,
      maxTextureDimension2D: lim.maxTextureDimension2D,
      maxTextureDimension3D: lim.maxTextureDimension3D,
      maxComputeWorkgroupStorageSize: lim.maxComputeWorkgroupStorageSize,
      maxComputeInvocationsPerWorkgroup: lim.maxComputeInvocationsPerWorkgroup,
      maxStorageBufferBindingSize: lim.maxStorageBufferBindingSize,
      maxUniformBufferBindingSize: lim.maxUniformBufferBindingSize,
      maxComputeWorkgroupSizeX: lim.maxComputeWorkgroupSizeX,
      maxComputeWorkgroupSizeY: lim.maxComputeWorkgroupSizeY,
      maxComputeWorkgroupSizeZ: lim.maxComputeWorkgroupSizeZ,
      maxComputeWorkgroupsPerDimension: lim.maxComputeWorkgroupsPerDimension,
      maxColorAttachments: lim.maxColorAttachments,
      minStorageBufferOffsetAlignment: lim.minStorageBufferOffsetAlignment,
      minUniformBufferOffsetAlignment: lim.minUniformBufferOffsetAlignment,
    },
    preferredCanvasFormat,
    maxBufferSize: lim.maxBufferSize,
    maxStorageBufferBindingSize: lim.maxStorageBufferBindingSize,
    maxComputeWorkgroupSizeX: lim.maxComputeWorkgroupSizeX,
    maxComputeWorkgroupSizeY: lim.maxComputeWorkgroupSizeY,
    maxComputeWorkgroupSizeZ: lim.maxComputeWorkgroupSizeZ,
    maxComputeInvocationsPerWorkgroup: lim.maxComputeInvocationsPerWorkgroup,
    maxComputeWorkgroupsPerDimension: lim.maxComputeWorkgroupsPerDimension,
    timestampQuerySupport: hasTimestampQuery,
    isFallbackAdapter: (adapter as any).isFallbackAdapter ?? false,
  };

  return _diagnostics;
}

export function getDevice(): GPUDevice {
  if (!_device) throw new Error('Benchmark not initialized. Call initBenchmark() first.');
  return _device;
}

export function destroyBenchmark(): void {
  if (_device) {
    _device.destroy();
    _device = null;
    _adapter = null;
    _diagnostics = null;
  }
}

// ─── Timing helpers ───

export function createUniformBuffer(data: ArrayBuffer): GPUBuffer {
  const device = getDevice();
  const buf = device.createBuffer({
    size: Math.ceil(data.byteLength / 16) * 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buf, 0, data);
  return buf;
}

export function createStorageBuffer(size: number, data?: Float32Array): GPUBuffer {
  const device = getDevice();
  const usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;

  if (data) {
    const buf = device.createBuffer({
      size: Math.max(size, data.byteLength),
      usage,
      mappedAtCreation: true,
    });
    new Float32Array(buf.getMappedRange()).set(data);
    buf.unmap();
    return buf;
  }

  return device.createBuffer({ size, usage });
}

export function createReadBuffer(size: number): GPUBuffer {
  const device = getDevice();
  return device.createBuffer({
    size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
}

export async function readbackBuffer(src: GPUBuffer, size: number): Promise<Float32Array> {
  const device = getDevice();
  const staging = createReadBuffer(size);
  const encoder = device.createCommandEncoder();
  encoder.copyBufferToBuffer(src, 0, staging, 0, size);
  device.queue.submit([encoder.finish()]);
  await staging.mapAsync(GPUMapMode.READ);
  const data = new Float32Array(staging.getMappedRange().slice(0));
  staging.unmap();
  staging.destroy();
  return data;
}

export function createPipeline(code: string, bindings: number): GPUComputePipeline {
  const device = getDevice();
  const layout = device.createBindGroupLayout({
    entries: Array.from({ length: bindings }, (_, i) => ({
      binding: i,
      visibility: GPUShaderStage.COMPUTE,
      buffer: i === 0
        ? { type: 'uniform' as const }
        : { type: 'storage' as const },
    })),
  });

  return device.createComputePipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [layout] }),
    compute: {
      module: device.createShaderModule({ code }),
      entryPoint: 'main',
    },
  });
}

export function createBindGroup(
  pipeline: GPUComputePipeline,
  entries: GPUBindGroupEntry[]
): GPUBindGroup {
  const device = getDevice();
  const layout = pipeline.getBindGroupLayout(0);
  return device.createBindGroup({ layout, entries });
}

// ─── Benchmark runner ───

export interface TimingResult {
  avgMs: number;
  minMs: number;
  maxMs: number;
  p50Ms: number;
  iterations: number;
}

export async function timeExecution(
  fn: () => void,
  iterations: number = 50,
  warmup: number = 5
): Promise<TimingResult> {
  const device = getDevice();

  // Warmup
  for (let i = 0; i < warmup; i++) {
    fn();
  }

  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    await device.queue.onSubmittedWorkDone();
    const end = performance.now();
    times.push(end - start);
  }

  times.sort((a, b) => a - b);
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const p50 = times[Math.floor(times.length / 2)];

  return {
    avgMs: avg,
    minMs: times[0],
    maxMs: times[times.length - 1],
    p50Ms: p50,
    iterations,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function formatMs(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)} us`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}
