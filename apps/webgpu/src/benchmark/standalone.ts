// AETHER GPU Benchmark — Standalone Diagnostic Helpers
// Shared by the fully standalone GPU sanity + standalone MatMul tests.
// Deliberately independent of the benchmark engine (engine.ts / gpu-test.ts):
// each test requests its own adapter + device so the engine harness cannot
// influence the result.
//
// Error capture guarantees:
//   1. device "uncapturederror" listener -> uncaptured errors (type + message)
//   2. error scopes validation / out-of-memory / internal wrap the whole test
//   3. device.lost is recorded with reason + message

export interface GpuErrorEntry {
  type: string;
  message: string;
}

export interface DeviceLostInfo {
  reason: string | null;
  message: string | null;
}

export interface StandaloneHandle {
  device: GPUDevice;
  uncaptured: GpuErrorEntry[];
  lost: DeviceLostInfo;
}

export interface StandaloneResult {
  name: string;
  pass: boolean;
  stage: string;
  errorType: string | null;
  errorMessage: string | null;
  scopeErrors: GpuErrorEntry[];
  uncaptured: GpuErrorEntry[];
  lost: DeviceLostInfo;
  expected: string;
  actual: string | null;
  exception: string | null;
}

export const STANDALONE_ERROR_SCOPES = ['validation', 'out-of-memory', 'internal'] as const;

type GpuErrorFilter = 'validation' | 'out-of-memory' | 'internal';

function gpuErrorType(err: GPUError): string {
  try {
    if (typeof GPUOutOfMemoryError !== 'undefined' && err instanceof GPUOutOfMemoryError) {
      return 'out-of-memory';
    }
    if (typeof GPUInternalError !== 'undefined' && err instanceof GPUInternalError) {
      return 'internal';
    }
    if (typeof GPUValidationError !== 'undefined' && err instanceof GPUValidationError) {
      return 'validation';
    }
  } catch {
    // Constructors unavailable — fall through to name probe.
  }
  const named = err as unknown as { name?: unknown };
  if (typeof named.name === 'string' && named.name) return named.name;
  return 'validation';
}

export async function acquireStandaloneDevice(): Promise<StandaloneHandle> {
  if (!navigator.gpu) throw new Error('WebGPU not supported in this browser');
  const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
  if (!adapter) throw new Error('No GPU adapter available');
  const device = await adapter.requestDevice();

  const uncaptured: GpuErrorEntry[] = [];
  const lost: DeviceLostInfo = { reason: null, message: null };

  device.addEventListener('uncapturederror', (ev) => {
    const err = (ev as GPUUncapturedErrorEvent).error;
    uncaptured.push({ type: gpuErrorType(err), message: err.message });
  });
  device.lost.then((info) => {
    lost.reason = (info.reason as string) ?? 'unknown';
    lost.message = info.message ?? '';
  });

  return { device, uncaptured, lost };
}

export function pushStandaloneScopes(device: GPUDevice): number {
  let n = 0;
  for (const scope of STANDALONE_ERROR_SCOPES) {
    try {
      device.pushErrorScope(scope as GpuErrorFilter);
      n++;
    } catch {
      // Some implementations do not support every scope type — skip.
    }
  }
  return n;
}

export async function popStandaloneScopeErrors(device: GPUDevice, count: number): Promise<GpuErrorEntry[]> {
  const entries: GpuErrorEntry[] = [];
  for (let i = 0; i < count; i++) {
    try {
      const err = await device.popErrorScope();
      if (err) {
        entries.push({ type: gpuErrorType(err), message: err.message });
      }
    } catch {
      // Never let a scope pop failure escape; the stack must stay balanced.
    }
  }
  return entries;
}

// Wrap a single step so the failing stage name is recorded alongside the error.
export type StandaloneStep<T> = () => T | Promise<T>;

export async function guarded<T>(
  stage: string,
  fn: StandaloneStep<T>
): Promise<{ ok: true; value: T } | { ok: false; stage: string; error: string }> {
  try {
    return { ok: true, value: await fn() };
  } catch (e) {
    return { ok: false, stage, error: e instanceof Error ? e.message : String(e) };
  }
}