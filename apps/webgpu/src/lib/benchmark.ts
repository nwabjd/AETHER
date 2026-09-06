// AETHER WebGPU — Benchmark utilities

export interface BenchmarkResult {
  name: string;
  avgMs: number;
  minMs: number;
  maxMs: number;
  iterations: number;
  gflops?: number;
  throughput?: string;
}

export async function benchmark(
  name: string,
  fn: () => Promise<void>,
  iterations: number = 50,
  flopsPerOp?: number
): Promise<BenchmarkResult> {
  const times: number[] = [];

  // Warmup
  for (let i = 0; i < Math.min(5, iterations); i++) {
    await fn();
  }

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    await devicePromise?.queue.onSubmittedWorkDone();
    const end = performance.now();
    times.push(end - start);
  }

  times.sort((a, b) => a - b);
  const avgMs = times.reduce((a, b) => a + b, 0) / times.length;
  const minMs = times[0];
  const maxMs = times[times.length - 1];

  const result: BenchmarkResult = {
    name,
    avgMs,
    minMs,
    maxMs,
    iterations,
  };

  if (flopsPerOp) {
    const opsPerSec = (flopsPerOp / (avgMs / 1000));
    const gflops = opsPerSec / 1e9;
    result.gflops = gflops;
    result.throughput = `${gflops.toFixed(2)} GFLOPS`;
  }

  return result;
}

// Module-level device reference for queue sync
let devicePromise: GPUDevice | null = null;
export function setBenchmarkDevice(d: GPUDevice) { devicePromise = d; }

export function formatResult(r: BenchmarkResult): string {
  const parts = [
    `${r.name}: ${r.avgMs.toFixed(2)} ms avg`,
    `(${r.minMs.toFixed(2)} – ${r.maxMs.toFixed(2)} ms)`,
    `[${r.iterations} iterations]`,
  ];
  if (r.throughput) parts.push(r.throughput);
  return parts.join(' ');
}
