// AETHER Tensor Runtime — TensorBuffer
// Manages GPUBuffer creation, mapping, and lifecycle

import { TensorDType, dtypeBytes } from './tensor-dtype';
import { TensorShape } from './tensor-shape';
import { getGPUContext } from './gpu-context';

export class TensorBuffer {
  readonly shape: TensorShape;
  readonly dtype: TensorDType;
  readonly gpuBuffer: GPUBuffer;
  readonly byteSize: number;
  private _mapped = false;

  constructor(shape: TensorShape, dtype: TensorDType, buffer?: GPUBuffer) {
    this.shape = shape;
    this.dtype = dtype;
    this.byteSize = shape.size * dtypeBytes(dtype);
    this.gpuBuffer = buffer ?? getGPUContext().device.createBuffer({
      size: this.byteSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    });
  }

  static fromData(shape: TensorShape, data: Float32Array | Int32Array | Uint8Array, dtype: TensorDType = TensorDType.Float32): TensorBuffer {
    const ctx = getGPUContext();
    const buf = new TensorBuffer(shape, dtype);
    ctx.device.queue.writeBuffer(buf.gpuBuffer, 0, data.buffer, data.byteOffset, data.byteLength);
    return buf;
  }

  async readback(): Promise<Float32Array> {
    const ctx = getGPUContext();
    const staging = ctx.device.createBuffer({
      size: this.byteSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const encoder = ctx.device.createCommandEncoder();
    encoder.copyBufferToBuffer(this.gpuBuffer, 0, staging, 0, this.byteSize);
    ctx.device.queue.submit([encoder.finish()]);

    await staging.mapAsync(GPUMapMode.READ);
    const data = new Float32Array(staging.getMappedRange().slice(0));
    staging.unmap();
    staging.destroy();
    return data;
  }

  destroy(): void {
    this.gpuBuffer.destroy();
  }
}
