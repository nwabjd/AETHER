// AETHER Tensor Runtime — TensorArena
// Pooled GPUBuffer allocation to reduce allocation overhead

import { getGPUContext } from './gpu-context';

interface ArenaBlock {
  buffer: GPUBuffer;
  size: number;
  free: boolean;
}

export class TensorArena {
  private blocks: ArenaBlock[] = [];
  private totalAllocated = 0;

  allocate(size: number): GPUBuffer {
    // Align to 16 bytes
    const aligned = Math.ceil(size / 16) * 16;

    // Find a free block that fits
    for (const block of this.blocks) {
      if (block.free && block.size >= aligned) {
        block.free = false;
        return block.buffer;
      }
    }

    // Allocate new block
    const ctx = getGPUContext();
    const buffer = ctx.device.createBuffer({
      size: aligned,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    });

    this.blocks.push({ buffer, size: aligned, free: false });
    this.totalAllocated += aligned;
    return buffer;
  }

  free(buffer: GPUBuffer): void {
    const block = this.blocks.find(b => b.buffer === buffer);
    if (block) block.free = true;
  }

  freeAll(): void {
    for (const block of this.blocks) {
      block.buffer.destroy();
    }
    this.blocks = [];
    this.totalAllocated = 0;
  }

  get allocatedBytes(): number {
    return this.totalAllocated;
  }

  get usedBlocks(): number {
    return this.blocks.filter(b => !b.free).length;
  }
}
