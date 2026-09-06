// AETHER WebGPU — Tensor runtime: buffer management, compute dispatch, kernels

export class Tensor {
  readonly buffer: GPUBuffer;
  readonly shape: readonly number[];
  readonly dtype: 'f32' | 'f16' | 'i32';
  readonly size: number;

  private device: GPUDevice;

  constructor(device: GPUDevice, shape: readonly number[], dtype: 'f32' | 'f16' | 'i32' = 'f32') {
    this.device = device;
    this.shape = [...shape];
    this.dtype = dtype;
    this.size = shape.reduce((a, b) => a * b, 1);

    const bytesPerElement = dtype === 'f32' ? 4 : dtype === 'f16' ? 2 : 4;
    this.buffer = device.createBuffer({
      size: this.size * bytesPerElement,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    // Zero-initialize
    const view = dtype === 'f32'
      ? new Float32Array(this.buffer.getMappedRange())
      : dtype === 'i32'
      ? new Int32Array(this.buffer.getMappedRange())
      : new Uint16Array(this.buffer.getMappedRange());
    view.fill(0);
    this.buffer.unmap();
  }

  static fromData(device: GPUDevice, data: Float32Array | Int32Array, shape: readonly number[]): Tensor {
    const t = new Tensor(device, shape, data instanceof Float32Array ? 'f32' : 'i32');
    device.queue.writeBuffer(t.buffer, 0, data.buffer);
    return t;
  }

  async readback(): Promise<Float32Array> {
    const staging = this.device.createBuffer({
      size: this.buffer.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const encoder = this.device.createCommandEncoder();
    encoder.copyBufferToBuffer(this.buffer, 0, staging, 0, this.buffer.size);
    this.device.queue.submit([encoder.finish()]);

    await staging.mapAsync(GPUMapMode.READ);
    const data = new Float32Array(staging.getMappedRange().slice(0));
    staging.unmap();
    staging.destroy();
    return data;
  }

  destroy(): void {
    this.buffer.destroy();
  }
}

export function createBindGroupLayout(
  device: GPUDevice,
  entries: GPUBufferBindingLayout[]
): GPUBindGroupLayout {
  return device.createBindGroupLayout({
    entries: entries.map((layout, i) => ({
      binding: i,
      visibility: GPUShaderStage.COMPUTE,
      buffer: layout,
    })),
  });
}

export function createPipeline(
  device: GPUDevice,
  code: string,
  layout: GPUBindGroupLayout
): GPUComputePipeline {
  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [layout],
  });

  return device.createComputePipeline({
    layout: pipelineLayout,
    compute: {
      module: device.createShaderModule({ code }),
      entryPoint: 'main',
    },
  });
}

export function dispatch(
  encoder: GPUCommandEncoder,
  pipeline: GPUComputePipeline,
  bindGroup: GPUBindGroup,
  workgroups: [number, number, number] = [1, 1, 1]
): void {
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(...workgroups);
  pass.end();
}
