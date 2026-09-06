// AETHER Tensor Runtime — MemoryPool
// Tracks GPU memory usage

import { getGPUContext } from './gpu-context';

export class MemoryPool {
  private allocated = new Map<GPUBuffer, number>();
  private _totalBytes = 0;

  allocate(size: number, usage: GPUBufferUsageFlags): GPUBuffer {
    const ctx = getGPUContext();
    const aligned = Math.ceil(size / 16) * 16;
    const buffer = ctx.device.createBuffer({ size: aligned, usage });
    this.allocated.set(buffer, aligned);
    this._totalBytes += aligned;
    return buffer;
  }

  free(buffer: GPUBuffer): void {
    const size = this.allocated.get(buffer);
    if (size !== undefined) {
      this._totalBytes -= size;
      this.allocated.delete(buffer);
    }
    buffer.destroy();
  }

  get totalBytes(): number { return this._totalBytes; }
  get allocationCount(): number { return this.allocated.size; }

  stats(): { totalBytes: number; allocations: number } {
    return { totalBytes: this._totalBytes, allocations: this.allocated.size };
  }
}
