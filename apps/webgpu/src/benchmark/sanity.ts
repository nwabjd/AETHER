// AETHER GPU Benchmark — Zero-Dependency GPU Sanity Test
// Deliberately independent of the runGpuTest harness:
//   create -> encode -> submit -> map -> validate
// One pipeline, one bind group, one command encoder, one compute pass,
// one submission, one readback.
//
// Inputs:  A = [1,2,3,4], B = [5,6,7,8]
// Output:  C[i] = A[i] + B[i]  =>  [6,8,10,12]

import { initBenchmark, getDevice } from './engine';

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

export interface StandaloneResult {
  name: string;
  pass: boolean;
  expected?: string;
  actual?: string;
  errors: string[];
  exception: string | null;
}

export const ERROR_SCOPES = ['validation', 'out-of-memory', 'internal'] as const;

type GPUErrorFilter = 'validation' | 'out-of-memory' | 'internal';

export function pushScopes(device: GPUDevice): number {
  let n = 0;
  for (const s of ERROR_SCOPES) {
    try {
      device.pushErrorScope(s as GPUErrorFilter);
      n++;
    } catch {
      // Some implementations do not support every scope type — skip.
    }
  }
  return n;
}

export async function popScopes(device: GPUDevice, count: number): Promise<string[]> {
  const errors: string[] = [];
  for (let i = 0; i < count; i++) {
    try {
      const e = await device.popErrorScope();
      if (e) errors.push(e.message);
    } catch {
      // Ignore scope pop failures; never leave the stack unbalanced.
    }
  }
  return errors;
}

export async function runGpuSanity(): Promise<StandaloneResult> {
  const result: StandaloneResult = {
    name: 'GPU Sanity',
    pass: false,
    expected: '[6, 8, 10, 12]',
    errors: [],
    exception: null,
  };

  try {
    await initBenchmark();
    const device = getDevice();
    const pushed = pushScopes(device);

    const A = new Float32Array([1, 2, 3, 4]);
    const B = new Float32Array([5, 6, 7, 8]);
    const EXPECTED: number[] = [6, 8, 10, 12];

    const usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;

    const bufA = device.createBuffer({ size: 16, usage, mappedAtCreation: true });
    new Float32Array(bufA.getMappedRange()).set(A);
    bufA.unmap();

    const bufB = device.createBuffer({ size: 16, usage, mappedAtCreation: true });
    new Float32Array(bufB.getMappedRange()).set(B);
    bufB.unmap();

    const bufC = device.createBuffer({ size: 16, usage });
    const staging = device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const layout = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      ],
    });
    const pipeline = device.createComputePipeline({
      layout: device.createPipelineLayout({ bindGroupLayouts: [layout] }),
      compute: {
        module: device.createShaderModule({ code: SANITY_WGSL }),
        entryPoint: 'main',
      },
    });
    const bg = device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: { buffer: bufA } },
        { binding: 1, resource: { buffer: bufB } },
        { binding: 2, resource: { buffer: bufC } },
      ],
    });

    // One encoder, one compute pass, one submission.
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(1, 1, 1);
    pass.end();
    encoder.copyBufferToBuffer(bufC, 0, staging, 0, 16);
    device.queue.submit([encoder.finish()]);

    await staging.mapAsync(GPUMapMode.READ);
    const data = new Float32Array(staging.getMappedRange().slice(0));
    staging.unmap();
    staging.destroy();

    // Uncaptured errors first.
    result.errors = await popScopes(device, pushed);
    if (result.errors.length > 0) {
      result.pass = false;
      result.actual = data.join(', ');
      return result;
    }

    const got = Array.from(data);
    const ok = EXPECTED.every((v, i) => Math.abs(got[i] - v) < 1e-6);
    result.pass = ok;
    result.actual = got.join(', ');

    bufA.destroy();
    bufB.destroy();
    bufC.destroy();
  } catch (e) {
    // Always pop scopes so the device error-scope stack stays balanced.
    result.exception = (e as Error).message;
    try {
      result.errors.push(...(await popScopes(getDevice(), 3)));
    } catch {
      // device may be lost
    }
  }

  return result;
}