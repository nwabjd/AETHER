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

export async function runGpuTest(params: GpuTestParams): Promise<{ pass: boolean, error: string | null }> {
  const device = getDevice();
  device.pushErrorScope('validation');
  device.pushErrorScope('out-of-memory');
  device.pushErrorScope('internal');

  try {
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(params.pipeline);
    pass.setBindGroup(0, params.bindGroup);
    pass.dispatchWorkgroups(...params.workgroups);
    pass.end();
    device.queue.submit([encoder.finish()]);
    await device.queue.onSubmittedWorkDone();

    const errors = await Promise.all([
      device.popErrorScope(),
      device.popErrorScope(),
      device.popErrorScope()
    ]);
    const firstError = errors.find(e => e !== null);
    if (firstError) return { pass: false, error: `Validation Error: ${firstError.message}` };

    const staging = device.createBuffer({
      size: params.outputBytes,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    const encoder2 = device.createCommandEncoder();
    encoder2.copyBufferToBuffer(params.outputBuffer, 0, staging, 0, params.outputBytes);
    device.queue.submit([encoder2.finish()]);
    await staging.mapAsync(GPUMapMode.READ);
    const data = new Float32Array(staging.getMappedRange().slice(0));
    staging.unmap();
    staging.destroy();

    const validation = params.validator(data);
    return { pass: validation.pass, error: validation.pass ? null : validation.error };
  } catch (e) {
    return { pass: false, error: (e as Error).message };
  }
}
