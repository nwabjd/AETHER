// AETHER Tensor Runtime — CommandScheduler
// Batches GPU commands for efficient submission

import { getGPUContext } from './gpu-context';

type CommandFn = (encoder: GPUCommandEncoder) => void;

export class CommandScheduler {
  private pending: CommandFn[] = [];
  private _active = false;

  get active(): boolean { return this._active; }

  submit(fn: CommandFn): void {
    this.pending.push(fn);
  }

  flush(): void {
    if (this.pending.length === 0) return;

    const ctx = getGPUContext();
    const encoder = ctx.device.createCommandEncoder();

    for (const fn of this.pending) {
      fn(encoder);
    }

    ctx.device.queue.submit([encoder.finish()]);
    this.pending = [];
  }

  async flushAndWait(): Promise<void> {
    this.flush();
    const ctx = getGPUContext();
    await ctx.device.queue.onSubmittedWorkDone();
  }

  clear(): void {
    this.pending = [];
  }
}
