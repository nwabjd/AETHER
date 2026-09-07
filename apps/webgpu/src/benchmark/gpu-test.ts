// AETHER GPU Benchmark — Isolated Test Execution
import { getDevice } from './engine';

export interface GpuTestParams {
  name: string;
  pipeline: GPUComputePipeline;
  bindGroup: GPUBindGroup;
  workgroups: [number, number, number];
  outputBuffer: GPUBuffer;
  outputBytes: number;
  validator: (data: Float32Array) => { pass: boolean, error: string };
}

type GPUErrorFilter = 'validation' | 'out-of-memory' | 'internal';

function pushScopeSafe(device: GPUDevice, filter: GPUErrorFilter): boolean {
  try {
    device.pushErrorScope(filter);
    return true;
  } catch {
    // Some implementations (iOS Safari) do not support every scope type.
    return false;
  }
}

async function popScopesSafe(device: GPUDevice, count: number): Promise<GPUError | null> {
  let firstError: GPUError | null = null;
  for (let i = 0; i < count; i++) {
    try {
      const err = await device.popErrorScope();
      if (err && !firstError) firstError = err;
    } catch {
      // Ignore scope pop failures; never leave the stack unbalanced.
    }
  }
  return firstError;
}

function withTimeout(p: Promise<void>, ms: number): Promise<void> {
  let timer: number | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = window.setTimeout(() => reject(new Error(`GPU operation timed out after ${ms}ms`)), ms);
  });
  return Promise.race([p, timeout]).finally(() => {
    if (timer !== undefined) window.clearTimeout(timer);
  });
}

export async function runGpuTest(params: GpuTestParams): Promise<{ pass: boolean, error: string | null, stage: string, errorType: string | null }> {
  const device = getDevice();

  // Push error scopes defensively. If a scope type is unsupported, skip it.
  const scopeFilters: GPUErrorFilter[] = ['validation', 'out-of-memory', 'internal'];
  let pushed = 0;
  for (const f of scopeFilters) {
    if (pushScopeSafe(device, f)) pushed++;
  }

  let stage = 'encode';

  try {
    const staging = device.createBuffer({
      size: params.outputBytes,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    // Single command buffer, single submit: compute pass + copy to staging.
    stage = 'encode';
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    stage = 'dispatch';
    pass.setPipeline(params.pipeline);
    pass.setBindGroup(0, params.bindGroup);
    pass.dispatchWorkgroups(...params.workgroups);
    pass.end();
    stage = 'submit';
    encoder.copyBufferToBuffer(params.outputBuffer, 0, staging, 0, params.outputBytes);
    device.queue.submit([encoder.finish()]);

    // mapAsync waits for all prior submitted work; does not depend on the
    // flaky onSubmittedWorkDone() API on iOS Safari.
    stage = 'readback';
    await withTimeout(staging.mapAsync(GPUMapMode.READ), 15000);
    const data = new Float32Array(staging.getMappedRange().slice(0));
    staging.unmap();
    staging.destroy();

    const gpuError = await popScopesSafe(device, pushed);
    if (gpuError) return { pass: false, error: `GPU Error: ${gpuError.message}`, stage: 'submit', errorType: (gpuError as { type?: string }).type ?? null };

    stage = 'validation';
    const validation = params.validator(data);
    return { pass: validation.pass, error: validation.pass ? null : validation.error, stage: validation.pass ? 'complete' : 'validation', errorType: validation.pass ? null : 'output-mismatch' };
  } catch (e) {
    // Always pop scopes so the per-device stack stays balanced across tests.
    await popScopesSafe(device, pushed);
    return { pass: false, error: (e as Error).message, stage, errorType: 'exception' };
  }
}