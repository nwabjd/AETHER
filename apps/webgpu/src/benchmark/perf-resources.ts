// AETHER GPU Benchmark — resource/allocation strategy comparisons (TASK 8).
// TASK 12: allocation, pipeline creation and command encoding happen outside
// any timestamp query, so these are always honest END_TO_END measurements of
// the whole operation, never mislabeled as GPU execution time.

import type { MemoryResult, OverheadSample, CommandBatchingResult } from './perf-report';
import {
  createPipeline,
  createBindGroupForPipeline,
  createStorageBuffer,
  createUniformBuffer,
  readbackBuffer,
  runWithScope,
  getDevice,
} from './engine';
import { VEC_ADD } from './kernels';

const RESOURCE_ITERS = 30;
const RESOURCE_N = 65536; // 256 KiB per buffer

interface VecAddFixture {
  pipeline: GPUComputePipeline;
  wg: [number, number, number];
  n: number;
}

function makeVecAddPipeline(): { pipeline: GPUComputePipeline } {
  const pipeline = createPipeline(VEC_ADD, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
  return { pipeline };
}

function median(list: number[]): number {
  if (list.length === 0) return 0;
  const s = [...list].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

async function endToEndOp(fn: () => Promise<void>): Promise<number> {
  const t0 = performance.now();
  await fn();
  return performance.now() - t0;
}

// ─── TASK 8a — Memory allocation ladder (stop on first failure) ───────────

const MEMORY_MIB = [1, 4, 8, 16, 32, 64, 128];

export async function benchMemory(): Promise<MemoryResult[]> {
  const device = getDevice();
  const results: MemoryResult[] = [];
  const held: GPUBuffer[] = [];
  let stopped = false;

  for (const mib of MEMORY_MIB) {
    if (stopped) {
      results.push({
        id: `memory-${mib}-mib`,
        requestedBytes: mib * 1024 * 1024,
        requestedMiB: mib,
        created: false,
        success: false,
        note: 'not attempted (previous allocation failed)',
      });
      continue;
    }
    const requested = mib * 1024 * 1024;
    let created = false;
    let ok = false;
    let note: string | undefined;
    try {
      const buf = createStorageBuffer(requested);
      created = true;
      held.push(buf);
      const { error } = await runWithScope(device, 'memory-allocate', async () => {
        // Force the allocation to land on the GPU: read the first words back.
        await readbackBuffer(buf, 4);
        return true;
      });
      ok = !error;
      note = error ? `GPU error while forcing allocation: ${error}` : undefined;
    } catch (e) {
      note = (e as Error).message;
    }
    results.push({ id: `memory-${mib}-mib`, requestedBytes: requested, requestedMiB: mib, created, success: ok, note });
    if (!ok) stopped = true;
  }

  for (const b of held) {
    try {
      b.destroy();
    } catch {
      // best effort
    }
  }
  return results;
}

// ─── TASK 8b — Buffer allocation vs reuse ────────────────────────────────

export async function benchBufferReuse(): Promise<{ allocateDestroy: OverheadSample; bufferReuse: OverheadSample }> {
  const { pipeline } = makeVecAddPipeline();
  const n = RESOURCE_N;
  const bytes = n * 4;
  const wg: [number, number, number] = [Math.ceil(n / 64), 1, 1];
  const a = new Float32Array(n);
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    a[i] = (i % 100) / 25 - 2;
    b[i] = (i % 77) / 13 - 3;
  }
  const uniform = createUniformBuffer(new Float32Array([n, 0, 0, 0]).buffer as ArrayBuffer);

  // allocate + destroy every operation
  const allocTimes: number[] = [];
  for (let i = 0; i < RESOURCE_ITERS; i++) {
    const ms = await endToEndOp(async () => {
      const bufA = createStorageBuffer(bytes, a);
      const bufB = createStorageBuffer(bytes, b);
      const bufC = createStorageBuffer(bytes);
      const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
        { binding: 0, resource: { buffer: uniform } },
        { binding: 1, resource: { buffer: bufA } },
        { binding: 2, resource: { buffer: bufB } },
        { binding: 3, resource: { buffer: bufC } },
      ]);
      const enc = getDevice().createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
      pass.end();
      getDevice().queue.submit([enc.finish()]);
      await readbackBuffer(bufC, bytes);
      bufA.destroy();
      bufB.destroy();
      bufC.destroy();
    });
    allocTimes.push(ms);
  }

  // persistent buffers reused across every operation
  const bufA = createStorageBuffer(bytes, a);
  const bufB = createStorageBuffer(bytes, b);
  const bufC = createStorageBuffer(bytes);
  const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
    { binding: 0, resource: { buffer: uniform } },
    { binding: 1, resource: { buffer: bufA } },
    { binding: 2, resource: { buffer: bufB } },
    { binding: 3, resource: { buffer: bufC } },
  ]);
  const reuseTimes: number[] = [];
  for (let i = 0; i < RESOURCE_ITERS; i++) {
    const ms = await endToEndOp(async () => {
      const enc = getDevice().createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
      pass.end();
      getDevice().queue.submit([enc.finish()]);
      await readbackBuffer(bufC, bytes);
    });
    reuseTimes.push(ms);
  }

  return {
    allocateDestroy: {
      id: 'buffer-allocate-destroy',
      name: 'Allocate + Destroy per op',
      size: `${formatRatioBytes(3 * n * 4)} (3 × VecAdd buffers)`,
      timingMode: 'END_TO_END',
      perOpMs: median(allocTimes),
      totalMs: allocTimes.reduce((a, c) => a + c, 0),
      iterations: RESOURCE_ITERS,
      samplesMs: [...allocTimes].sort((x, y) => x - y),
      note: 'full op = create 3 buffers + bind group + dispatch + readback + destroy',
    },
    bufferReuse: {
      id: 'buffer-reuse',
      name: 'Reuse persistent buffers',
      size: `${formatRatioBytes(3 * n * 4)} (3 × VecAdd buffers)`,
      timingMode: 'END_TO_END',
      perOpMs: median(reuseTimes),
      totalMs: reuseTimes.reduce((a, c) => a + c, 0),
      iterations: RESOURCE_ITERS,
      samplesMs: [...reuseTimes].sort((x, y) => x - y),
      note: 'full op = dispatch + readback on pre-allocated buffers',
    },
  };
}

// ─── TASK 8c — Pipeline cache vs recreate ───────────────────────────────

export async function benchPipelineCache(): Promise<{ recreate: OverheadSample; cached: OverheadSample }> {
  const n = RESOURCE_N;
  const bytes = n * 4;
  const wg: [number, number, number] = [Math.ceil(n / 64), 1, 1];
  const a = new Float32Array(n);
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    a[i] = (i % 100) / 25 - 2;
    b[i] = (i % 77) / 13 - 3;
  }
const bufA = createStorageBuffer(bytes, a);
  const bufB = createStorageBuffer(bytes, b);
  const bufC = createStorageBuffer(bytes);
  const uniform = createUniformBuffer(new Float32Array([n, 0, 0, 0]).buffer as ArrayBuffer);

  // recreate pipeline + bind group every operation
  const recreateTimes: number[] = [];
  for (let i = 0; i < RESOURCE_ITERS; i++) {
    const ms = await endToEndOp(async () => {
      const pipeline = createPipeline(VEC_ADD, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
      const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
        { binding: 0, resource: { buffer: uniform } },
        { binding: 1, resource: { buffer: bufA } },
        { binding: 2, resource: { buffer: bufB } },
        { binding: 3, resource: { buffer: bufC } },
      ]);
      const enc = getDevice().createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
      pass.end();
      getDevice().queue.submit([enc.finish()]);
      await readbackBuffer(bufC, bytes);
      if (typeof (pipeline as unknown as { destroy?: () => void }).destroy === 'function') {
        (pipeline as unknown as { destroy: () => void }).destroy();
      }
    });
    recreateTimes.push(ms);
  }

  // pipeline cached once
  const pipeline = createPipeline(VEC_ADD, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
  const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
    { binding: 0, resource: { buffer: uniform } },
    { binding: 1, resource: { buffer: bufA } },
    { binding: 2, resource: { buffer: bufB } },
    { binding: 3, resource: { buffer: bufC } },
  ]);
  const cachedTimes: number[] = [];
  for (let i = 0; i < RESOURCE_ITERS; i++) {
    const ms = await endToEndOp(async () => {
      const enc = getDevice().createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
      pass.end();
      getDevice().queue.submit([enc.finish()]);
      await readbackBuffer(bufC, bytes);
    });
    cachedTimes.push(ms);
  }

  return {
    recreate: {
      id: 'pipeline-recreate',
      name: 'Recreate pipeline per op',
      size: 'VecAdd 65536',
      timingMode: 'END_TO_END',
      perOpMs: median(recreateTimes),
      totalMs: recreateTimes.reduce((a, c) => a + c, 0),
      iterations: RESOURCE_ITERS,
      samplesMs: [...recreateTimes].sort((x, y) => x - y),
      note: 'full op = createPipeline + bind group + dispatch + readback',
    },
    cached: {
      id: 'pipeline-cached',
      name: 'Cached pipeline',
      size: 'VecAdd 65536',
      timingMode: 'END_TO_END',
      perOpMs: median(cachedTimes),
      totalMs: cachedTimes.reduce((a, c) => a + c, 0),
      iterations: RESOURCE_ITERS,
      samplesMs: [...cachedTimes].sort((x, y) => x - y),
      note: 'full op = dispatch + readback on a pre-built pipeline',
    },
  };
}

// ─── TASK 8d — Command batching (8 dispatches, one submit vs eight) ─────

const BATCH_DISPATCHES = 8;
const BATCH_N = 4096;

export async function benchCommandBatching(): Promise<CommandBatchingResult[]> {
  const n = BATCH_N;
  const bytes = n * 4;
  const wg: [number, number, number] = [Math.ceil(n / 64), 1, 1];
  const a = new Float32Array(n);
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    a[i] = (i % 100) / 25 - 2;
    b[i] = (i % 77) / 13 - 3;
  }
  const uniform = createUniformBuffer(new Float32Array([n, 0, 0, 0]).buffer as ArrayBuffer);
  const stored = createStorageBuffer(bytes, a);
  const stored2 = createStorageBuffer(bytes, b);
  const bufC = createStorageBuffer(bytes);
  const pipeline = createPipeline(VEC_ADD, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
  const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
    { binding: 0, resource: { buffer: uniform } },
    { binding: 1, resource: { buffer: stored } },
    { binding: 2, resource: { buffer: stored2 } },
    { binding: 3, resource: { buffer: bufC } },
  ]);

  // individual: 8 separate encoders/submits per iteration
  const indivTimes: number[] = [];
  for (let i = 0; i < 20; i++) {
    const ms = await endToEndOp(async () => {
      const encoders: GPUCommandEncoder[] = [];
      for (let d = 0; d < BATCH_DISPATCHES; d++) {
        const enc = getDevice().createCommandEncoder();
        const pass = enc.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bg);
        pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
        pass.end();
        encoders.push(enc);
      }
      for (const enc of encoders) getDevice().queue.submit([enc.finish()]);
      await readbackBuffer(bufC, bytes);
    });
    indivTimes.push(ms);
  }

  // batched: 8 compute passes encoded into one command buffer → single submit
  const batchTimes: number[] = [];
  for (let i = 0; i < 20; i++) {
    const ms = await endToEndOp(async () => {
      const enc = getDevice().createCommandEncoder();
      for (let d = 0; d < BATCH_DISPATCHES; d++) {
        const pass = enc.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bg);
        pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
        pass.end();
      }
      getDevice().queue.submit([enc.finish()]);
      await readbackBuffer(bufC, bytes);
    });
    batchTimes.push(ms);
  }

  return [
    {
      id: 'command-batch-individual',
      name: `${BATCH_DISPATCHES} × VecAdd(${BATCH_N}) — individual submits`,
      dispatches: BATCH_DISPATCHES,
      timingMode: 'END_TO_END',
      totalMedianMs: median(indivTimes),
      perDispatchMs: median(indivTimes) / BATCH_DISPATCHES,
      samplesMs: [...indivTimes].sort((x, y) => x - y),
    },
    {
      id: 'command-batch-batched',
      name: `${BATCH_DISPATCHES} × VecAdd(${BATCH_N}) — 8 passes, one command buffer`,
      dispatches: BATCH_DISPATCHES,
      timingMode: 'END_TO_END',
      totalMedianMs: median(batchTimes),
      perDispatchMs: median(batchTimes) / BATCH_DISPATCHES,
      samplesMs: [...batchTimes].sort((x, y) => x - y),
    },
  ];
}

function formatRatioBytes(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MiB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${bytes} B`;
}