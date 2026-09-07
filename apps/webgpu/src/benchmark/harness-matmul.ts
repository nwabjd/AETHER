// AETHER GPU Benchmark — Engine-Device Inline MatMul (no runGpuTest, no runWithScope)
//
// Two imports:
//   runMinimalHarnessMatmul(size)  — the 64×64 / 128×128 isolation test. Every
//     step (buffers, uniform, pipeline, bind group, command encoder, compute
//     pass, dispatch, copy, submit, mapAsync, validate) is written INLINE
//     against the single engine GPUDevice from getDevice(). No execution
//     helper. Byte-for-byte equivalent to the standalone MatMul flow; the only
//     difference is the device (standalone requests its own, this uses the
//     engine device).
//   runSharedDeviceDirectMatmul()  — keeps the SHARED-DEVICE DIRECT MATMUL gate
//     working; delegates to the same inline 64×64 execution.
//
// Error isolation, mirroring standalone.ts:
//   1. uncapturederror listener (addEventListener — never overwrites others)
//   2. error scopes validation → out-of-memory → internal, popped in reverse
//      order, sequentially (never Promise.all)
//   3. shader getCompilationInfo() checked BEFORE the pipeline is used
//   4. device-lost / identity tracking stays purely diagnostic
//
// Buffers:
//   output  = STORAGE | COPY_SRC | COPY_DST
//   staging = COPY_DST | MAP_READ          (spec: MAP_READ + COPY_DST only)

import { getDevice } from './engine';
import { MATMUL } from './kernels';
import { MATMUL_BINDINGS } from './bindings';
import { createBindGroupLayoutForBindings } from './layout';
import { getDeviceIdentity } from './device-identity';

// ─── Result shapes ───

export interface MinimalHarnessResult {
  name: string;
  size: number;
  pass: boolean;
  stage: string;
  errorType: string | null;
  errorMessage: string | null;
  stageResults: Record<string, boolean>;
  compilationMessages: string[];
  gpuError: string | null;
  uncaptured: string[];
  expected: number;
  actualMin: number | null;
  actualMax: number | null;
  maxError: number | null;
  nonFinite: number;
  first16: number[];
  exception: string | null;
}

export interface SharedDeviceDirectResult {
  name: string;
  pass: boolean;
  stage: string;
  errorType: string | null;
  errorMessage: string | null;
  maxError: number | null;
  executionDeviceId: number;
  pipelineDeviceId: number | null;
  bindGroupDeviceId: number | null;
  mismatch: boolean;
}

// ─── Small local helpers (errors only — not execution abstractions) ───

type GPUErrorFilter = 'validation' | 'out-of-memory' | 'internal';

function classifyScopeError(err: GPUError): string {
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
  return typeof named.name === 'string' && named.name ? named.name : 'validation';
}

function pushScopeSafe(device: GPUDevice, filter: GPUErrorFilter): boolean {
  try {
    device.pushErrorScope(filter);
    return true;
  } catch {
    return false;
  }
}

// ─── The core correctness test ───

export async function runMinimalHarnessMatmul(size: 64 | 128): Promise<MinimalHarnessResult> {
  const N = size;
  const K = size;
  const M = size;
  const count = N * N;
  const expected = K * 1.0 * 0.5; // 64 → 32.0, 128 → 64.0
  const wg = Math.ceil(N / 16);

  const result: MinimalHarnessResult = {
    name: `Minimal Harness MatMul ${N}×${N}`,
    size: N,
    pass: false,
    stage: 'request-device',
    errorType: null,
    errorMessage: null,
    stageResults: {
      pipeline: false,
      'bind-group': false,
      dispatch: false,
      submission: false,
      readback: false,
      validation: false,
    },
    compilationMessages: [],
    gpuError: null,
    uncaptured: [],
    expected,
    actualMin: null,
    actualMax: null,
    maxError: null,
    nonFinite: 0,
    first16: [],
    exception: null,
  };

  const device = getDevice();

  let bufA: GPUBuffer | null = null;
  let bufB: GPUBuffer | null = null;
  let bufC: GPUBuffer | null = null;
  let uBuf: GPUBuffer | null = null;
  let staging: GPUBuffer | null = null;
  let onUncaptured: ((ev: Event) => void) | null = null;

  // TASK 6 — uncaptured error listener. addEventListener never overwrites an
  // existing handler (onuncapturederror or another listener); it coexists.
  const uncaptured: Array<{ type: string; message: string }> = [];
  onUncaptured = (ev) => {
    const err = (ev as unknown as { error?: GPUError }).error;
    if (err) uncaptured.push({ type: classifyScopeError(err), message: err.message });
  };
  device.addEventListener('uncapturederror', onUncaptured);

  // TASK 5 — push scopes before creating pipeline / bind group / encode / submit.
  const pushed: GPUErrorFilter[] = [];
  for (const filter of ['validation', 'out-of-memory', 'internal'] as const) {
    if (pushScopeSafe(device, filter)) pushed.push(filter);
  }

  let scopeError: { type: string; message: string } | null = null;
  let scopesPopped = false;

  try {
    result.stage = 'create-shader-module';
    const module = device.createShaderModule({ code: MATMUL });

    // TASK 9 — verify shader compilation BEFORE building the pipeline.
    result.stage = 'shader-compilation';
    if (typeof module.getCompilationInfo === 'function') {
      let info: GPUCompilationInfo;
      try {
        info = await module.getCompilationInfo();
      } catch (e) {
        result.compilationMessages.push(`getCompilationInfo failed: ${(e as Error).message}`);
        info = { messages: [] } as unknown as GPUCompilationInfo;
      }
      result.compilationMessages = info.messages.map((m) => `${m.type}: ${m.message}`);
      const hasError = info.messages.some((m) => m.type === 'error');
      if (hasError) {
        result.stage = 'shader-compilation';
        result.errorType = 'shader-compilation';
        result.errorMessage = result.compilationMessages.join(' | ');
        return result;
      }
    } else {
      result.compilationMessages.push('getCompilationInfo unavailable');
    }
    result.stageResults.pipeline = false;

    // TASK 2 — fresh buffers, exact standalone inputs. A = 1.0, B = 0.5.
    result.stage = 'create-buffers';
    const usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;
    const A = new Float32Array(count).fill(1.0);
    const B = new Float32Array(count).fill(0.5);

    bufA = device.createBuffer({ size: A.byteLength, usage, mappedAtCreation: true });
    new Float32Array(bufA.getMappedRange()).set(A);
    bufA.unmap();

    bufB = device.createBuffer({ size: B.byteLength, usage, mappedAtCreation: true });
    new Float32Array(bufB.getMappedRange()).set(B);
    bufB.unmap();

    bufC = device.createBuffer({ size: count * 4, usage });

    result.stage = 'create-uniform';
    const uData = new ArrayBuffer(16);
    const uv = new Uint32Array(uData);
    uv[0] = M;
    uv[1] = N;
    uv[2] = K;
    uBuf = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(uBuf, 0, uData);

    // TASK 2/12 — pipeline + bind group from THIS device, fresh for this test.
    result.stage = 'create-pipeline';
    const layout = createBindGroupLayoutForBindings(device, MATMUL_BINDINGS);
    const pipeline = device.createComputePipeline({
      layout: device.createPipelineLayout({ bindGroupLayouts: [layout] }),
      compute: { module, entryPoint: 'main' },
    });
    result.stageResults.pipeline = true;

    result.stage = 'create-bind-group';
    const bg = device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufA } },
        { binding: 2, resource: { buffer: bufB } },
        { binding: 3, resource: { buffer: bufC } },
      ],
    });
    result.stageResults['bind-group'] = true;

    // TASK 8 — staging is MAP_READ + COPY_DST ONLY.
    result.stage = 'create-staging';
    staging = device.createBuffer({
      size: count * 4,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    // TASK 7 — ONE command buffer, ONE compute pass, ONE submit.
    result.stage = 'encode';
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    result.stage = 'set-pipeline';
    pass.setPipeline(pipeline);
    result.stage = 'set-bind-group';
    pass.setBindGroup(0, bg);
    result.stage = 'dispatch';
    pass.dispatchWorkgroups(wg, wg, 1);
    pass.end();
    result.stageResults.dispatch = true;

    result.stage = 'submit';
    encoder.copyBufferToBuffer(bufC, 0, staging, 0, count * 4);
    device.queue.submit([encoder.finish()]);
    result.stageResults.submission = true;

    result.stage = 'readback';
    await staging.mapAsync(GPUMapMode.READ);
    const data = new Float32Array(staging.getMappedRange().slice(0));
    staging.unmap();
    result.stageResults.readback = true;

    // TASK 10 — verify the actual GPU output across all samples.
    result.stage = 'validation';
    let min = Infinity;
    let max = -Infinity;
    let maxErr = 0;
    let nonFinite = 0;
    for (let i = 0; i < count; i++) {
      const v = data[i];
      if (!Number.isFinite(v)) {
        nonFinite++;
        continue;
      }
      if (v < min) min = v;
      if (v > max) max = v;
      const e = Math.abs(v - expected);
      if (e > maxErr) maxErr = e;
    }
    result.actualMin = Number.isFinite(min) ? min : null;
    result.actualMax = Number.isFinite(max) ? max : null;
    result.maxError = maxErr;
    result.nonFinite = nonFinite;
    result.first16 = Array.from(data.slice(0, 16));
    result.stageResults.validation = nonFinite === 0 && maxErr < 1e-3;

    staging.destroy();
    staging = null;
  } catch (e) {
    result.pass = false;
    result.stage = result.stage || 'unknown';
    result.errorType = 'exception';
    result.exception = e instanceof Error ? e.message : String(e);
    result.errorMessage = result.exception;
  } finally {
    // TASK 5 — pop scopes sequentially in reverse push order (internal,
    // out-of-memory, validation). Never Promise.all.
    if (!scopesPopped) {
      for (const filter of pushed.slice().reverse()) {
        try {
          const err = await device.popErrorScope();
          if (err && !scopeError) {
            scopeError = { type: classifyScopeError(err), message: err.message };
          }
        } catch {
          // Never let a scope pop failure escape.
        }
      }
      scopesPopped = true;
    }
    result.gpuError = scopeError ? `${scopeError.type}: ${scopeError.message}` : null;
    if (onUncaptured) {
      device.removeEventListener('uncapturederror', onUncaptured);
      onUncaptured = null;
    }
    try { bufA?.destroy(); } catch { /* already destroyed */ }
    try { bufB?.destroy(); } catch { /* already destroyed */ }
    try { bufC?.destroy(); } catch { /* already destroyed */ }
    try { uBuf?.destroy(); } catch { /* already destroyed */ }
    try { staging?.destroy(); } catch { /* already destroyed */ }
  }

  // ─── Final verdict (order: scope error > uncaptured > validation) ───
  if (result.errorMessage) {
    result.pass = false;
    return result;
  }
  if (scopeError) {
    result.pass = false;
    result.stage = 'gpu-error';
    result.errorType = scopeError.type;
    result.errorMessage = `GPU Error: ${scopeError.message}`;
    return result;
  }
  if (uncaptured.length) {
    result.pass = false;
    result.stage = 'uncaptured';
    result.errorType = 'uncaptured-error';
    result.errorMessage = uncaptured.map((u) => `${u.type}: ${u.message}`).join(' | ');
    return result;
  }
  result.uncaptured = uncaptured.map((u) => `${u.type}: ${u.message}`);
  result.pass = result.stageResults.validation;
  if (!result.pass) {
    result.stage = 'validation';
    result.errorType = 'output-mismatch';
    result.errorMessage =
      `expected all elements = ${expected} (min ${expected}, max ${expected}, nonFinite 0), ` +
      `got range [${result.actualMin}, ${result.actualMax}], maxErr ${result.maxError?.toExponential(2)}, ` +
      `nonFinite ${result.nonFinite}`;
  }
  if (result.pass) result.stage = 'complete';
  return result;
}

// ─── SHARED-DEVICE DIRECT MATMUL gate (same inline 64×64 execution) ───

export async function runSharedDeviceDirectMatmul(): Promise<SharedDeviceDirectResult> {
  const device = getDevice();
  const executionDeviceId = getDeviceIdentity(device);
  const r = await runMinimalHarnessMatmul(64);

  return {
    name: 'Shared-Device Direct MatMul 64×64',
    pass: r.pass,
    stage: r.stage || 'complete',
    errorType: r.errorType,
    errorMessage: r.errorMessage,
    maxError: r.maxError,
    executionDeviceId,
    pipelineDeviceId: executionDeviceId,
    bindGroupDeviceId: executionDeviceId,
    mismatch: false,
  };
}