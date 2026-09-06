// AETHER WebGPU — Compute dispatch helper

import { Tensor, createBindGroupLayout, createPipeline } from './tensor';

export interface ComputeJob {
  shader: string;
  tensors: Tensor[];
  uniforms: ArrayBuffer;
  workgroups: [number, number, number];
}

export function runCompute(device: GPUDevice, job: ComputeJob): void {
  const bindings: GPUBufferBindingLayout[] = job.tensors.map(() => ({
    type: 'storage',
  }));

  // Uniform buffer is always binding 0, tensors follow
  const layout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'uniform' },
      },
      ...job.tensors.map((_, i) => ({
        binding: i + 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'storage' } as GPUBufferBindingLayout,
      })),
    ],
  });

  const pipeline = createPipeline(device, job.shader, layout);

  const uniformBuffer = device.createBuffer({
    size: job.uniforms.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(uniformBuffer, 0, job.uniforms);

  const bindGroup = device.createBindGroup({
    layout,
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer } },
      ...job.tensors.map((t, i) => ({
        binding: i + 1,
        resource: { buffer: t.buffer },
      })),
    ],
  });

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(...job.workgroups);
  pass.end();
  device.queue.submit([encoder.finish()]);

  uniformBuffer.destroy();
}

export async function runComputeAsync(device: GPUDevice, job: ComputeJob): Promise<void> {
  runCompute(device, job);
  await device.queue.onSubmittedWorkDone();
}
