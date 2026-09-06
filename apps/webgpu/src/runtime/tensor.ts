// AETHER Tensor Runtime — Tensor
// Core tensor abstraction

import { TensorShape } from './tensor-shape';
import { TensorDType, dtypeBytes } from './tensor-dtype';
import { TensorBuffer } from './tensor-buffer';
import { getGPUContext } from './gpu-context';

export class Tensor {
  readonly shape: TensorShape;
  readonly dtype: TensorDType;
  readonly buffer: TensorBuffer;

  constructor(shape: TensorShape, dtype: TensorDType = TensorDType.Float32, buffer?: TensorBuffer) {
    this.shape = shape;
    this.dtype = dtype;
    this.buffer = buffer ?? new TensorBuffer(shape, dtype);
  }

  static fromFloat32(data: Float32Array | number[], shape: number[]): Tensor {
    const arr = data instanceof Float32Array ? data : new Float32Array(data);
    const s = new TensorShape(shape);
    return new Tensor(s, TensorDType.Float32, TensorBuffer.fromData(s, arr, TensorDType.Float32));
  }

  static fromInt32(data: Int32Array | number[], shape: number[]): Tensor {
    const arr = data instanceof Int32Array ? data : new Int32Array(data);
    const s = new TensorShape(shape);
    return new Tensor(s, TensorDType.Int32, TensorBuffer.fromData(s, arr, TensorDType.Int32));
  }

  static zeros(shape: number[], dtype: TensorDType = TensorDType.Float32): Tensor {
    const s = new TensorShape(shape);
    const bytes = s.size * dtypeBytes(dtype);
    const ctx = getGPUContext();
    const buf = ctx.device.createBuffer({
      size: bytes,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Uint8Array(buf.getMappedRange()).fill(0);
    buf.unmap();
    const tb = new TensorBuffer(s, dtype, buf);
    return new Tensor(s, dtype, tb);
  }

  static ones(shape: number[], dtype: TensorDType = TensorDType.Float32): Tensor {
    const size = new TensorShape(shape).size;
    const data = new Float32Array(size).fill(1);
    return Tensor.fromFloat32(data, shape);
  }

  static randn(shape: number[]): Tensor {
    const size = new TensorShape(shape).size;
    const data = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      // Box-Muller transform
      const u1 = Math.random();
      const u2 = Math.random();
      data[i] = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }
    return Tensor.fromFloat32(data, shape);
  }

  async readback(): Promise<Float32Array> {
    return this.buffer.readback();
  }

  destroy(): void {
    this.buffer.destroy();
  }
}
