// AETHER GPU Benchmark — Standalone 64×64 Matrix Multiplication
// Uses the exact known-good MATMUL kernel, executed with the simplest possible
// inline create -> encode -> submit -> map -> validate flow.
// Does NOT call runGpuTest — this is the control group for diagnosing whether
// the shared harness (runGpuTest) is responsible for failures.
//
// Dispatch:  4×4×1 workgroups, @workgroup_size(16, 16)  =>  64×64 threads.
// Mapping:   row = gid.x, col = gid.y, C[row*N+col] = Σ_k A[row*K+k]·B[k*N+col].

import { initBenchmark, getDevice } from './engine';
import { MATMUL } from './kernels';
import { pushScopes, popScopes, type StandaloneResult } from './sanity';

export async function runStandaloneMatmul(): Promise<StandaloneResult> {
  const result: StandaloneResult = {
    name: 'Standalone MatMul 64×64',
    pass: false,
    expected: 'all elements = 32.0',
    errors: [],
    exception: null,
  };

  try {
    await initBenchmark();
    const device = getDevice();
    const pushed = pushScopes(device);

    const N = 64;
    const K = 64;
    const count = N * N;
    const A = new Float32Array(count).fill(1.0);
    const B = new Float32Array(count).fill(0.5);

    const usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;

    const bufA = device.createBuffer({ size: A.byteLength, usage, mappedAtCreation: true });
    new Float32Array(bufA.getMappedRange()).set(A);
    bufA.unmap();

    const bufB = device.createBuffer({ size: B.byteLength, usage, mappedAtCreation: true });
    new Float32Array(bufB.getMappedRange()).set(B);
    bufB.unmap();

    const bufC = device.createBuffer({ size: count * 4, usage });
    const staging = device.createBuffer({
      size: count * 4,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const uData = new ArrayBuffer(16);
    const uv = new Uint32Array(uData);
    uv[0] = N; uv[1] = N; uv[2] = K; // M, N, K
    const uBuf = device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(uBuf, 0, uData);

    const layout = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      ],
    });
    const pipeline = device.createComputePipeline({
      layout: device.createPipelineLayout({ bindGroupLayouts: [layout] }),
      compute: {
        module: device.createShaderModule({ code: MATMUL }),
        entryPoint: 'main',
      },
    });
    const bg = device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: { buffer: uBuf } },
        { binding: 1, resource: { buffer: bufA } },
        { binding: 2, resource: { buffer: bufB } },
        { binding: 3, resource: { buffer: bufC } },
      ],
    });

    // 64/16 = 4 workgroups per dimension => dispatch 4×4×1.
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(4, 4, 1);
    pass.end();
    encoder.copyBufferToBuffer(bufC, 0, staging, 0, count * 4);
    device.queue.submit([encoder.finish()]);

    await staging.mapAsync(GPUMapMode.READ);
    const data = new Float32Array(staging.getMappedRange().slice(0));
    staging.unmap();
    staging.destroy();

    result.errors = await popScopes(device, pushed);
    if (result.errors.length > 0) {
      result.actual = String(data[0]);
      return result;
    }

    // CPU reference: A = ones, B = 0.5, K = 64  =>  every cell = 64 * 1 * 0.5 = 32.
    let maxErr = 0;
    for (let i = 0; i < count; i++) {
      maxErr = Math.max(maxErr, Math.abs(data[i] - 32.0));
    }
    result.pass = maxErr < 1e-3;
    result.actual = `max err = ${maxErr.toExponential(2)}`;

    bufA.destroy();
    bufB.destroy();
    bufC.destroy();
    uBuf.destroy();
  } catch (e) {
    result.exception = (e as Error).message;
    try {
      result.errors.push(...(await popScopes(getDevice(), 3)));
    } catch {
      // device may be lost
    }
  }

  return result;
}