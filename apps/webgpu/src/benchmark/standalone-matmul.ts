// AETHER GPU Benchmark — Fully Standalone 64×64 Matrix Multiplication
// Requests its OWN adapter + device (no benchmark engine, no runGpuTest) and
// executes the exact known-good MATMUL WGSL with the simplest possible
// inline create -> encode -> submit -> map -> validate flow.
//
// Dispatch:  4×4×1 workgroups, @workgroup_size(16, 16)  =>  64×64 threads.
// Mapping:   row = gid.x, col = gid.y, C[row*N+col] = Σ_k A[row*K+k]·B[k*N+col].
// Inputs:    A = 1.0 everywhere, B = 0.5 everywhere, K = 64.
// Expected:  every cell = 64 · 1.0 · 0.5 = 32.0.

import { MATMUL } from './kernels';
import {
  acquireStandaloneDevice,
  guarded,
  pushStandaloneScopes,
  popStandaloneScopeErrors,
  type StandaloneHandle,
  type StandaloneResult,
} from './standalone';

export async function runStandaloneMatmul(): Promise<StandaloneResult> {
  const result: StandaloneResult = {
    name: 'Standalone MatMul 64×64',
    pass: false,
    stage: '',
    errorType: null,
    errorMessage: null,
    scopeErrors: [],
    uncaptured: [],
    lost: { reason: null, message: null },
    expected: 'all elements = 32.0',
    actual: null,
    exception: null,
  };

  let handle: StandaloneHandle | null = null;
  let pushed = 0;
  let popped = false;
  let maxErr: number | null = null;

  const acquired = await guarded('request-device', () => acquireStandaloneDevice());
  if (!acquired.ok) {
    result.stage = acquired.stage;
    result.errorType = 'exception';
    result.errorMessage = acquired.error;
    return result;
  }
  handle = acquired.value;
  result.stage = 'request-device';

  try {
    if (handle.lost.reason) {
      result.stage = 'device-lost';
      result.errorType = 'device-lost';
      result.errorMessage = `${handle.lost.reason}: ${handle.lost.message ?? ''}`;
      return result;
    }

    pushed = pushStandaloneScopes(handle.device);

    const N = 64;
    const K = 64;
    const count = N * N;
    const A = new Float32Array(count).fill(1.0);
    const B = new Float32Array(count).fill(0.5);
    const usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;

    result.stage = 'create-buffers';
    const bufA = handle.device.createBuffer({ size: A.byteLength, usage, mappedAtCreation: true });
    new Float32Array(bufA.getMappedRange()).set(A);
    bufA.unmap();

    const bufB = handle.device.createBuffer({ size: B.byteLength, usage, mappedAtCreation: true });
    new Float32Array(bufB.getMappedRange()).set(B);
    bufB.unmap();

    const bufC = handle.device.createBuffer({ size: count * 4, usage });
    const staging = handle.device.createBuffer({
      size: count * 4,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const uData = new ArrayBuffer(16);
    const uv = new Uint32Array(uData);
    uv[0] = N; uv[1] = N; uv[2] = K; // M, N, K
    const uBuf = handle.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    handle.device.queue.writeBuffer(uBuf, 0, uData);

    result.stage = 'create-pipeline';
    const layout = handle.device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      ],
    });
    const pipeline = handle.device.createComputePipeline({
      layout: handle.device.createPipelineLayout({ bindGroupLayouts: [layout] }),
      compute: {
        module: handle.device.createShaderModule({ code: MATMUL }),
        entryPoint: 'main',
      },
    });

    result.stage = 'create-bind-group';
    const bg = handle.device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufA } },
        { binding: 2, resource: { buffer: bufB } },
        { binding: 3, resource: { buffer: bufC } },
      ],
    });

    // 64/16 = 4 workgroups per dimension => dispatch 4×4×1.
    result.stage = 'encode-submit';
    const encoder = handle.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(4, 4, 1);
    pass.end();
    encoder.copyBufferToBuffer(bufC, 0, staging, 0, count * 4);
    handle.device.queue.submit([encoder.finish()]);

    result.stage = 'readback';
    await staging.mapAsync(GPUMapMode.READ);
    const data = new Float32Array(staging.getMappedRange().slice(0));
    staging.unmap();
    staging.destroy();

    result.stage = 'validate-output';
    result.scopeErrors = await popStandaloneScopeErrors(handle.device, pushed);
    popped = true;

    // CPU reference: A = ones, B = 0.5, K = 64  =>  every cell = 32.
    maxErr = 0;
    for (let i = 0; i < count; i++) {
      maxErr = Math.max(maxErr, Math.abs(data[i] - 32.0));
    }
    result.actual = `max err = ${maxErr.toExponential(2)}`;

    bufA.destroy();
    bufB.destroy();
    bufC.destroy();
    uBuf.destroy();
  } catch (e) {
    result.stage = result.stage || 'unknown';
    result.errorType = 'exception';
    result.errorMessage = e instanceof Error ? e.message : String(e);
  } finally {
    // If the flow did not reach the pop, drain the scopes so the stack stays balanced.
    if (handle && pushed > 0 && !popped) {
      try {
        result.scopeErrors = await popStandaloneScopeErrors(handle.device, pushed);
      } catch {
        // device may be lost
      }
    }
  }

  // Merge captured diagnostics into the verdict.
  result.uncaptured = handle.uncaptured;
  if (handle.lost.reason && !result.scopeErrors.length && !result.errorMessage) {
    result.pass = false;
    result.stage = 'device-lost';
    result.errorType = 'device-lost';
    result.errorMessage = `${handle.lost.reason}: ${handle.lost.message ?? ''}`;
    return result;
  }
  if (result.scopeErrors.length > 0) {
    result.pass = false;
    result.errorType = result.scopeErrors[0].type;
    result.errorMessage = result.scopeErrors[0].message;
    return result;
  }
  if (result.uncaptured.length > 0) {
    result.pass = false;
    result.errorType = result.uncaptured[0].type;
    result.errorMessage = result.uncaptured[0].message;
    return result;
  }
  if (result.errorMessage) {
    result.pass = false;
    return result;
  }

  result.pass = maxErr !== null && maxErr < 1e-3;
  if (!result.pass) {
    result.errorType = 'output-mismatch';
    result.errorMessage = `expected all elements = 32.0, got ${result.actual}`;
  }

  return result;
}