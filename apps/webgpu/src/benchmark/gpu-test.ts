// AETHER GPU Benchmark — Isolated Test Execution
//
// The GPUDevice is an EXPLICIT parameter: runGpuTest(device, params). It never
// calls getDevice() internally and never creates a device. The device passed
// in must be the exact device that created the pipeline, bind group, buffers
// and command encoder; before touching the pass encoder we verify that identity
// so a mismatch becomes a clear "PIPELINE DEVICE MISMATCH" instead of an opaque
// "GPUComputePipeline is invalid to use with this GPUComputePassEncoder".

import {
  getDeviceIdentity,
  getPipelineDeviceIdentity,
  getBindGroupDeviceIdentity,
  isDeviceLost,
} from './device-identity.ts';
import { ReadbackManager } from './readback.ts';

export interface GpuTestParams {
  name: string;
  pipeline: GPUComputePipeline;
  bindGroup: GPUBindGroup;
  workgroups: [number, number, number];
  outputBuffer: GPUBuffer;
  outputBytes: number;
  validator: (data: Float32Array) => { pass: boolean, error: string };
}

export interface DeviceIdCheck {
  ok: boolean;
  mismatch: boolean;
  identityUnavailable: boolean;
  pipelineDeviceId: number | null;
  executionDeviceId: number;
  bindGroupDeviceId: number | null;
}

/**
 * TASK 6 — the guard used before pass.setPipeline(). Pure and unit-testable:
 * a pipeline created by device A must never be submitted on device B.
 */
export function verifyPipelineDevice(device: GPUDevice, pipeline: GPUComputePipeline): DeviceIdCheck {
  const executionDeviceId = getDeviceIdentity(device);
  const pipelineDeviceId = getPipelineDeviceIdentity(pipeline);
  return {
    ok: pipelineDeviceId === null || pipelineDeviceId === executionDeviceId,
    mismatch: pipelineDeviceId !== null && pipelineDeviceId !== executionDeviceId,
    identityUnavailable: pipelineDeviceId === null,
    pipelineDeviceId,
    executionDeviceId,
    bindGroupDeviceId: null,
  };
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

export interface GpuTestOutcome {
  pass: boolean;
  error: string | null;
  stage: string;
  errorType: string | null;
  mismatch: boolean;
  pipelineDeviceId: number | null;
  executionDeviceId: number;
  bindGroupDeviceId: number | null;
}

export async function runGpuTest(device: GPUDevice, params: GpuTestParams): Promise<GpuTestOutcome> {
  const executionDeviceId = getDeviceIdentity(device);
  const pipelineDeviceId = getPipelineDeviceIdentity(params.pipeline);
  const bindGroupDeviceId = getBindGroupDeviceIdentity(params.bindGroup);

  // TASK 13 — never execute a pipeline on a lost device.
  if (isDeviceLost(device)) {
    return {
      pass: false,
      error: 'DEVICE LOST — refusing to execute a pipeline on a lost device.',
      stage: 'encode',
      errorType: 'device-lost',
      mismatch: false,
      pipelineDeviceId,
      executionDeviceId,
      bindGroupDeviceId,
    };
  }

  // TASK 6 — verify the pipeline belongs to the execution device BEFORE
  // setPipeline(). A mismatch returns here without touching the pass encoder.
  if (pipelineDeviceId !== null && pipelineDeviceId !== executionDeviceId) {
    return {
      pass: false,
      error:
        `PIPELINE DEVICE MISMATCH — pipeline device: ${pipelineDeviceId}, execution device: ${executionDeviceId}. ` +
        `The pipeline was created by a different GPUDevice; refusing to call setPipeline().`,
      stage: 'set-pipeline',
      errorType: 'device-mismatch',
      mismatch: true,
      pipelineDeviceId,
      executionDeviceId,
      bindGroupDeviceId,
    };
  }

  // Push error scopes defensively on the exact execution device. If a scope
  // type is unsupported, skip it.
  const scopeFilters: GPUErrorFilter[] = ['validation', 'out-of-memory', 'internal'];
  let pushed = 0;
  for (const f of scopeFilters) {
    if (pushScopeSafe(device, f)) pushed++;
  }

  let stage = 'encode';

  try {
    const readbackMgr = ReadbackManager.getInstance();
    const staging = readbackMgr.acquire(device, params.outputBytes);

    // Single command buffer, single submit: compute pass + copy to staging.
    stage = 'encode';
    const encoder = device.createCommandEncoder({ label: `Enc_${params.name}` });
    const pass = encoder.beginComputePass();

    stage = 'set-pipeline';
    pass.setPipeline(params.pipeline);

    if (bindGroupDeviceId !== null && bindGroupDeviceId !== executionDeviceId) {
      // Pop scopes to keep the stack balanced before returning.
      await popScopesSafe(device, pushed);
      return {
        pass: false,
        error:
          `BIND GROUP DEVICE MISMATCH — bind group device: ${bindGroupDeviceId}, execution device: ${executionDeviceId}. ` +
          `The bind group was created by a different GPUDevice; refusing to call setBindGroup().`,
        stage: 'set-bind-group',
        errorType: 'device-mismatch',
        mismatch: true,
        pipelineDeviceId,
        executionDeviceId,
        bindGroupDeviceId,
      };
    }
    if (bindGroupDeviceId === null) {
      console.warn(`[gpu-test] ${params.name}: bind group identity unavailable — continuing (not fabricated).`);
    }

    stage = 'set-bind-group';
    pass.setBindGroup(0, params.bindGroup);

    stage = 'dispatch';
    pass.dispatchWorkgroups(...params.workgroups);
    pass.end();
    stage = 'submit';
    encoder.copyBufferToBuffer(params.outputBuffer, 0, staging, 0, params.outputBytes);
    device.queue.submit([encoder.finish()]);

    stage = 'readback';
    const data = await readbackMgr.readSubmittedCopy(device, staging, params.outputBytes, params.name);

    const gpuError = await popScopesSafe(device, pushed);
    if (gpuError) {
      return {
        pass: false,
        error: `GPU Error: ${gpuError.message}`,
        stage: 'submit',
        errorType: (gpuError as { type?: string }).type ?? null,
        mismatch: false,
        pipelineDeviceId,
        executionDeviceId,
        bindGroupDeviceId,
      };
    }

    stage = 'validation';
    const validation = params.validator(data);
    return {
      pass: validation.pass,
      error: validation.pass ? null : validation.error,
      stage: validation.pass ? 'complete' : 'validation',
      errorType: validation.pass ? null : 'output-mismatch',
      mismatch: false,
      pipelineDeviceId,
      executionDeviceId,
      bindGroupDeviceId,
    };
  } catch (e) {
    // Always pop scopes so the per-device stack stays balanced across tests.
    await popScopesSafe(device, pushed);
    return {
      pass: false,
      error: (e as Error).message,
      stage,
      errorType: 'exception',
      mismatch: false,
      pipelineDeviceId,
      executionDeviceId,
      bindGroupDeviceId,
    };
  }
}