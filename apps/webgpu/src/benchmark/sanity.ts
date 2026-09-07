// AETHER GPU Benchmark — Fully Standalone GPU Sanity Test
// Requests its OWN adapter + device (no benchmark engine, no runGpuTest) and
// runs the simplest possible compute:
//   create -> encode -> submit -> map -> validate
// One pipeline, one bind group, one command encoder, one compute pass,
// one submission, one readback.
//
// Inputs:  A = [1,2,3,4], B = [5,6,7,8]
// Expected: C[i] = A[i] + B[i]  =>  [6,8,10,12]
//
// Full error capture: uncapturederror listener, validation/out-of-memory/
// internal error scopes around the whole test, and device.lost reporting.

import {
  acquireStandaloneDevice,
  guarded,
  pushStandaloneScopes,
  popStandaloneScopeErrors,
  type StandaloneHandle,
  type StandaloneResult,
} from './standalone';

const SANITY_WGSL = /* wgsl */ `
@group(0) @binding(0) var<storage, read> a: array<f32>;
@group(0) @binding(1) var<storage, read> b: array<f32>;
@group(0) @binding(2) var<storage, read_write> c: array<f32>;

@compute @workgroup_size(4)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i < 4u) {
    c[i] = a[i] + b[i];
  }
}
`;

const EXPECTED_SANITY = [6, 8, 10, 12];

export async function runGpuSanity(): Promise<StandaloneResult> {
  const result: StandaloneResult = {
    name: 'GPU Sanity',
    pass: false,
    stage: '',
    errorType: null,
    errorMessage: null,
    scopeErrors: [],
    uncaptured: [],
    lost: { reason: null, message: null },
    expected: '[6, 8, 10, 12]',
    actual: null,
    exception: null,
  };

  let handle: StandaloneHandle | null = null;
  let pushed = 0;
  let popped = false;
  let dataOut: number[] | null = null;

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

    const A = new Float32Array([1, 2, 3, 4]);
    const B = new Float32Array([5, 6, 7, 8]);
    const usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;

    result.stage = 'create-buffers';
    const bufA = handle.device.createBuffer({ size: 16, usage, mappedAtCreation: true });
    new Float32Array(bufA.getMappedRange()).set(A);
    bufA.unmap();

    const bufB = handle.device.createBuffer({ size: 16, usage, mappedAtCreation: true });
    new Float32Array(bufB.getMappedRange()).set(B);
    bufB.unmap();

    const bufC = handle.device.createBuffer({ size: 16, usage });
    const staging = handle.device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    result.stage = 'create-pipeline';
    const layout = handle.device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      ],
    });
    const pipeline = handle.device.createComputePipeline({
      layout: handle.device.createPipelineLayout({ bindGroupLayouts: [layout] }),
      compute: {
        module: handle.device.createShaderModule({ code: SANITY_WGSL }),
        entryPoint: 'main',
      },
    });

    result.stage = 'create-bind-group';
    const bg = handle.device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: { buffer: bufA } },
        { binding: 1, resource: { buffer: bufB } },
        { binding: 2, resource: { buffer: bufC } },
      ],
    });

    result.stage = 'encode-submit';
    const encoder = handle.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(1, 1, 1);
    pass.end();
    encoder.copyBufferToBuffer(bufC, 0, staging, 0, 16);
    handle.device.queue.submit([encoder.finish()]);

    result.stage = 'readback';
    await staging.mapAsync(GPUMapMode.READ);
    const data = new Float32Array(staging.getMappedRange().slice(0));
    staging.unmap();
    staging.destroy();

    result.stage = 'validate-output';
    result.scopeErrors = await popStandaloneScopeErrors(handle.device, pushed);
    popped = true;
    dataOut = Array.from(data);
    result.actual = dataOut.join(', ');

    bufA.destroy();
    bufB.destroy();
    bufC.destroy();
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

  const got = dataOut ?? [];
  const ok = got.length === EXPECTED_SANITY.length && EXPECTED_SANITY.every((v, i) => Math.abs(got[i] - v) < 1e-6);
  result.pass = ok;
  if (!ok) {
    result.errorType = 'output-mismatch';
    result.errorMessage = `expected [${EXPECTED_SANITY.join(', ')}], got ${result.actual}`;
  }

  return result;
}