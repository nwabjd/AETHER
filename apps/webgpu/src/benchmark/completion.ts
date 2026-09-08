// AETHER GPU Benchmark — CompletionToken (TASK 12)
//
// Minimal GPU→CPU completion primitive for END_TO_END timing. The token is a
// 4-byte STORAGE|COPY_SRC source copied into a dedicated 4-byte MAP_READ|COPY_DST
// staging buffer *inside the same command buffer* as the measured kernel. Mapping
// the staging buffer therefore resolves only after the kernel work above it in
// that command buffer has finished — without ever reading the benchmark output.
//
// All map() calls are funneled through a global promise chain so mapAsync never
// overlaps (TASK 12/17); the counters module independently PROVES that by
// tracking active maps and flagging any overlap.

import { harnessCounters } from './harness-counters.ts';

let tokenSeq = 0;
let mapChain: Promise<void> = Promise.resolve();

/** Static 4-byte contract constants for CPU/Node regression testing. */
export const completionTokenContract = {
  sizeOfSrc: 4,
  sizeOfDst: 4,
  usageSsrc: 24, // GPUBufferUsage.STORAGE(8) | COPY_SRC(16)
  usageDst: 17, // GPUBufferUsage.MAP_READ(1) | COPY_DST(16)
};

export class CompletionToken {
  readonly id: number;
  readonly size = 4;
  readonly device: GPUDevice;
  readonly src: GPUBuffer;
  readonly dst: GPUBuffer;

  constructor(device: GPUDevice) {
    this.device = device;
    this.id = ++tokenSeq;
    // src is an opaque zero-initialized storage buffer — the copy destination
    // never exceeds 4 bytes and never depends on benchmark output contents.
    this.src = device.createBuffer({
      label: `CompletionToken_${this.id}_src`,
      size: 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
    this.dst = device.createBuffer({
      label: `CompletionToken_${this.id}_dst`,
      size: 4,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });
  }

  /** Encode the tiny copy into an already-open command encoder. */
  encode(enc: GPUCommandEncoder): void {
    enc.copyBufferToBuffer(this.src, 0, this.dst, 0, 4);
  }

  destroy(): void {
    try {
      this.src.destroy();
      this.dst.destroy();
    } catch {
      // best-effort cleanup
    }
  }
}

/**
 * Await GPU completion of the previously submitted work by mapping the token's
 * staging buffer. Serialized globally; never overlaps mapAsync.
 */
export async function awaitCompletion(device: GPUDevice, token: CompletionToken, contextInfo = 'completion'): Promise<void> {
  const p = mapChain.then(async () => {
    harnessCounters.onMapBegin();
    try {
      try {
        await token.dst.mapAsync(GPUMapMode.READ, 0, token.size);
      } catch (e) {
        throw new Error(`CompletionToken await FAIL [${contextInfo}] — ${(e as Error).message ?? String(e)}`);
      }
      harnessCounters.onCompletionRead();
      // Read the mapped range so the map is meaningful (any value: the copy
      // completing is the signal), then immediately unmap for reuse.
      const range = token.dst.getMappedRange(0, token.size);
      void new Uint32Array(range);
      token.dst.unmap();
    } finally {
      harnessCounters.onMapEnd();
    }
  });
  mapChain = p.then(
    () => {},
    () => {}
  );
  return p;
}

/** Create a fresh command buffer containing ONLY the completion copy, submit, and await. */
export async function submitCompletionOnly(device: GPUDevice, token: CompletionToken, contextInfo = 'completion-only'): Promise<void> {
  const enc = device.createCommandEncoder({ label: `Enc_${contextInfo}` });
  harnessCounters.onCommandBufferCreated();
  token.encode(enc);
  const cmd = enc.finish();
  device.queue.submit([cmd]);
  harnessCounters.onCommandBufferSubmitted('sync');
  await awaitCompletion(device, token, contextInfo);
}