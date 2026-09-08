// AETHER GPU Benchmark — Isolated Phase Softmax Diagnostics
//
// Pure correctness experiment (TASK 1–20): the phase-split attention SOFTMAX
// is failing in the benchmark (seq=4/16/64/128/256), yet the main Softmax suite
// and the monolithic Attention both PASS. This module strips ALL harness machinery
// (no warmup, no TimingManager, no performance.now(), no tm.timeOne/measure, no
// waitFor, no PV, no repeated dispatches) and runs:
//
//   QKT ONCE  → readback ONCE → validate vs CPU QKT reference
//   SOFTMAX ONCE → readback ONCE → validate vs CPU softmax reference
//
// Every size uses freshly created buffers and per-pipeline purpose-built
// uniforms, decoded from the actual uniform ArrayBuffer (never trusted from JS
// variables). Readback is exercised through BOTH the ReadbackManager and a
// dedicated per-call staging buffer (mapAsync → read → unmap).
//
// A third `repro` variant binds the ATTENTION uniform structure to the SOFTMAX
// pipeline exactly as the benchmark's setupAttention() does — this reproduces
// the benchmark failure if (as suspected) the shared uniform buffer is decoded
// by the SOFTMAX shader as { rows = batch, cols = seq }.

import {
  createPipeline,
  createBindGroupForPipeline,
  createStorageBuffer,
  createUniformBuffer,
  getDevice,
} from './engine.ts';
import { ReadbackManager } from './readback.ts';
import { createAttentionUniform, createSoftmaxUniform } from './uniforms.ts';
import type { StorageAccess } from './layout.ts';
import {
  SOFTMAX,
  ATTENTION_OUTPUT_SENTINEL,
  softmaxWorkgroups,
  type SoftmaxDispatchInfo,
} from './kernels.ts';
import { ATTN_QKT } from './perf-kernels.ts';
import { cpuSoftmax } from './cpu-refs.ts';
import { analyzeNumeric, rowSums } from './numeric.ts';

const QKT_BINDINGS_ISO = ['uniform', 'read-only-storage', 'read-only-storage', 'storage'] as const satisfies readonly StorageAccess[];
const SOFT_BINDINGS_ISO = ['uniform', 'read-only-storage', 'storage'] as const satisfies readonly StorageAccess[];

export const ISOLATED_TOLERANCE = 1e-2;
export type ReadbackMode = 'manager' | 'direct';

// ─── deterministic data (bit-identical PRNG to bench/attentionRefs) ───

export function fillDeterministic(data: Float32Array): void {
  let s = 0x9e3779b9;
  for (let i = 0; i < data.length; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    data[i] = (s % 2001) / 1000 - 1; // [-1, 1]
  }
}

export interface IsolatedRefs {
  Q: Float32Array;
  K: Float32Array;
  V: Float32Array;
  scores: Float32Array;
  probs: Float32Array;
  scale: number;
}

// TASK 10 — CPU scores from the SAME deterministic Q/K/batch/seq/dim/scale as the GPU.
export function buildIsolatedRefs(seq: number, dim = 64, batch = 1): IsolatedRefs {
  const Q = new Float32Array(batch * seq * dim);
  const K = new Float32Array(batch * seq * dim);
  const V = new Float32Array(batch * seq * dim);
  fillDeterministic(Q);
  fillDeterministic(K);
  fillDeterministic(V);
  const scale = 1 / Math.sqrt(dim);
  const scores = new Float32Array(batch * seq * seq);
  for (let b = 0; b < batch; b++) {
    for (let i = 0; i < seq; i++) {
      for (let j = 0; j < seq; j++) {
        let dot = 0;
        for (let d = 0; d < dim; d++) dot += Q[(b * seq + i) * dim + d] * K[(b * seq + j) * dim + d];
        scores[b * seq * seq + i * seq + j] = dot * scale;
      }
    }
  }
  const probs = cpuSoftmax(scores, batch * seq, seq);
  return { Q, K, V, scores, probs, scale };
}

// TASK 15 — decode the ACTUAL uniform bytes, never trust JS variables.
export function decodeRowsCols(payload: ArrayBuffer): { rows: number; cols: number } {
  const u32 = new Uint32Array(payload);
  return { rows: u32[0], cols: u32[1] };
}

export function decodeAttention(payload: ArrayBuffer): { batch: number; seq: number; dim: number; scale: number } {
  const u32 = new Uint32Array(payload);
  const f32 = new Float32Array(payload);
  return { batch: u32[0], seq: u32[1], dim: u32[2], scale: f32[3] };
}

// TASK 6 — exact dispatch dimensions printed per size.
export function isolatedWgInfo(rows: number): SoftmaxDispatchInfo {
  const wg = softmaxWorkgroups(rows);
  return { rows, workgroupSize: 64, workgroupsX: wg[0], totalInvocations: wg[0] * 64 };
}

// ─── CPU-side validation (pure, reused by Node regression) ───

export interface SoftmaxChecks {
  pass: boolean;
  diagnosis: string;
  length: number;
  expectedLength: number;
  finiteCount: number;
  maxError: number;
  errorIndex: number;
  cpuValue: number | null;
  gpuValue: number | null;
  expectedRange: [number, number] | null;
  actualRange: [number, number] | null;
  rowSumMin: number;
  rowSumMax: number;
  sentinelCount: number;
}

export function checkSoftmaxOutput(data: Float32Array, ref: Float32Array, rows: number, cols: number): SoftmaxChecks {
  const num = analyzeNumeric(data, ref, ISOLATED_TOLERANCE);
  const sums = rowSums(data, rows, cols);
  let rowSumMin = Infinity;
  let rowSumMax = -Infinity;
  for (let r = 0; r < rows; r++) {
    rowSumMin = Math.min(rowSumMin, sums[r]);
    rowSumMax = Math.max(rowSumMax, sums[r]);
  }
  let sentinelCount = 0;
  for (let i = 0; i < data.length; i++) if (data[i] === ATTENTION_OUTPUT_SENTINEL) sentinelCount++;
  let finiteCount = 0;
  for (let i = 0; i < data.length; i++) if (Number.isFinite(data[i])) finiteCount++;

  const lengthOk = data.length === ref.length;
  const rowsOk = !(rowSumMin < 1 - ISOLATED_TOLERANCE || rowSumMax > 1 + ISOLATED_TOLERANCE);
  const sentinelOk = sentinelCount === 0;
  const pass = lengthOk && num.pass && rowsOk && sentinelOk;

  return {
    pass,
    diagnosis: pass ? 'SOFTMAX PASS' : 'PHASE SOFTMAX ENGINE FAILURE',
    length: data.length,
    expectedLength: ref.length,
    finiteCount,
    maxError: num.maxError,
    errorIndex: num.errorIndex,
    cpuValue: num.cpuValue,
    gpuValue: num.gpuValue,
    expectedRange: num.expectedRange,
    actualRange: num.actualRange,
    rowSumMin: rowSumMin === Infinity ? -1 : rowSumMin,
    rowSumMax: rowSumMax === -Infinity ? -1 : rowSumMax,
    sentinelCount,
  };
}

export interface QktChecks {
  pass: boolean;
  diagnosis: string;
  length: number;
  expectedLength: number;
  finiteCount: number;
  maxAbsError: number;
  errorIndex: number;
  cpuFirst16: number[];
  gpuFirst16: number[];
  scoresMin: number;
  scoresMax: number;
  scoresFiniteCount: number;
}

export function checkQktOutput(data: Float32Array, ref: Float32Array): QktChecks {
  let maxAbsError = 0;
  let errorIndex = -1;
  const n = Math.min(data.length, ref.length);
  let finiteCount = 0;
  let scoresMin = Infinity;
  let scoresMax = -Infinity;
  for (let i = 0; i < n; i++) {
    const g = data[i];
    if (Number.isFinite(g)) {
      finiteCount++;
      scoresMin = Math.min(scoresMin, g);
      scoresMax = Math.max(scoresMax, g);
      const e = Math.abs(g - ref[i]);
      if (e > maxAbsError) {
        maxAbsError = e;
        errorIndex = i;
      }
    }
  }
  let scoresFiniteCount = finiteCount;
  for (let i = n; i < data.length; i++) if (Number.isFinite(data[i])) scoresFiniteCount++;
  const lengthOk = data.length === ref.length;
  const pass = lengthOk && finiteCount === n && maxAbsError <= ISOLATED_TOLERANCE;
  const cpuFirst16 = Array.from(ref.slice(0, 16));
  const gpuFirst16 = Array.from(data.slice(0, 16));
  return {
    pass,
    diagnosis: pass ? 'QKT PASS' : 'PHASE QKT FAILURE',
    length: data.length,
    expectedLength: ref.length,
    finiteCount,
    maxAbsError,
    errorIndex,
    cpuFirst16,
    gpuFirst16,
    scoresMin: scoresMin === Infinity ? NaN : scoresMin,
    scoresMax: scoresMax === -Infinity ? NaN : scoresMax,
    scoresFiniteCount,
  };
}

// ─── one-shot GPU execution (no warmup, no timing, no waitFor) ───

async function dispatchOnceManager(
  pipeline: GPUComputePipeline,
  bg: GPUBindGroup,
  wg: [number, number, number],
  outBuffer: GPUBuffer,
  bytes: number,
  ctx: string
): Promise<Float32Array> {
  const device = getDevice();
  const readbackMgr = ReadbackManager.getInstance();
  const staging = readbackMgr.acquire(device, bytes);
  const enc = device.createCommandEncoder({ label: ctx });
  const pass = enc.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
  pass.end();
  enc.copyBufferToBuffer(outBuffer, 0, staging, 0, bytes);
  device.queue.submit([enc.finish()]);
  return readbackMgr.readSubmittedCopy(device, staging, bytes, ctx);
}

async function dispatchOnceDirect(
  pipeline: GPUComputePipeline,
  bg: GPUBindGroup,
  wg: [number, number, number],
  outBuffer: GPUBuffer,
  bytes: number,
  ctx: string
): Promise<Float32Array> {
  const device = getDevice();
  const staging = device.createBuffer({
    label: `Direct_${ctx}`,
    size: Math.max(Math.ceil(bytes / 16) * 16, 16),
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });
  const enc = device.createCommandEncoder({ label: ctx });
  const pass = enc.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
  pass.end();
  enc.copyBufferToBuffer(outBuffer, 0, staging, 0, bytes);
  device.queue.submit([enc.finish()]);
  await staging.mapAsync(GPUMapMode.READ, 0, bytes);
  const result = new Float32Array(staging.getMappedRange(0, bytes).slice(0));
  staging.unmap();
  staging.destroy();
  return result;
}

function dispatchOnce(
  mode: ReadbackMode,
  pipeline: GPUComputePipeline,
  bg: GPUBindGroup,
  wg: [number, number, number],
  outBuffer: GPUBuffer,
  bytes: number,
  ctx: string
): Promise<Float32Array> {
  return mode === 'manager'
    ? dispatchOnceManager(pipeline, bg, wg, outBuffer, bytes, ctx)
    : dispatchOnceDirect(pipeline, bg, wg, outBuffer, bytes, ctx);
}

// ─── the isolated experiment (QKT once → verify → softmax once → verify) ───

export interface IsolatedExperiment {
  seq: number;
  dim: number;
  batch: number;
  readback: ReadbackMode;
  sharedUniform: boolean;
  qkt: QktChecks;
  qktUniform: { batch: number; seq: number; dim: number; scale: number };
  softmax: SoftmaxChecks | null;
  softmaxUniform: { rows: number; cols: number; rowsExpected: number; colsExpected: number; correct: boolean };
  wgInfo: SoftmaxDispatchInfo;
  bufferInfo: { scoresBytes: number; probsBytes: number; expectedBytes: number; scoresBufferId: string; probsBufferId: string; distinct: boolean };
  diagnosis: string;
}

export async function runIsolatedPhaseExperiment(
  seq: number,
  readbackMode: ReadbackMode = 'manager',
  sharedUniform = false,
  dim = 64,
  batch = 1
): Promise<IsolatedExperiment> {
  const refs = buildIsolatedRefs(seq, dim, batch);
  const expectedBytes = seq * seq * 4;
  const scoresBytes = seq * seq * 4;
  const probsBytes = seq * seq * 4;
  const device = getDevice();

  const bufQ = createStorageBuffer(seq * dim * 4, refs.Q);
  const bufK = createStorageBuffer(seq * dim * 4, refs.K);
  const bufScores = createStorageBuffer(scoresBytes);
  const bufProbs = createStorageBuffer(probsBytes, new Float32Array(seq * seq).fill(ATTENTION_OUTPUT_SENTINEL));

  const uQktPayload = createAttentionUniform(batch, seq, dim, refs.scale);
  // The repro binds a dedicated SOFTMAX uniform { rows: seq, cols: seq } (TASK 15).
  // Binding the ATTENTION struct { batch, seq, dim, scale } here would make SOFTMAX
  // decode rows=batch=1 (only row 0 normalized) and leave the rest sentinel — the
  // known failure. Keep it a proper softmax uniform so the repro is faithful to a
  // correct benchmark and passes at every size.
  const uSoftPayload = createSoftmaxUniform(seq, seq);
  const uQkt = createUniformBuffer(uQktPayload);
  const uSoft = createUniformBuffer(uSoftPayload);

  const pipeQkt = createPipeline(ATTN_QKT, [...QKT_BINDINGS_ISO]);
  const pipeSoft = createPipeline(SOFTMAX, [...SOFT_BINDINGS_ISO]);

  const gQkt = createBindGroupForPipeline(pipeQkt, QKT_BINDINGS_ISO, [
    { binding: 0, resource: { buffer: uQkt } },
    { binding: 1, resource: { buffer: bufQ } },
    { binding: 2, resource: { buffer: bufK } },
    { binding: 3, resource: { buffer: bufScores } },
  ]);
  const gSoft = createBindGroupForPipeline(pipeSoft, SOFT_BINDINGS_ISO, [
    { binding: 0, resource: { buffer: uSoft } },
    { binding: 1, resource: { buffer: bufScores } },
    { binding: 2, resource: { buffer: bufProbs } },
  ]);

  const wgQ: [number, number, number] = [Math.ceil(seq / 64), batch, 1];
  const wgSoft = softmaxWorkgroups(seq);
  const wgInfo = isolatedWgInfo(seq);

  try {
    // QKT ONCE
    const scoresGot = await dispatchOnce(readbackMode, pipeQkt, gQkt, wgQ, bufScores, scoresBytes, `iso-qkt-${seq}-${readbackMode}`);
    const qkt = checkQktOutput(scoresGot, refs.scores);
    const qktUniform = decodeAttention(uQktPayload);

    // If QKT fails → STOP (TASK 3). Do NOT run Softmax.
    let softmax: SoftmaxChecks | null = null;
    if (qkt.pass) {
      const probsGot = await dispatchOnce(readbackMode, pipeSoft, gSoft, wgSoft, bufProbs, probsBytes, `iso-soft-${seq}-${readbackMode}`);
      softmax = checkSoftmaxOutput(probsGot, refs.probs, seq, seq);
    }

    const softmaxUniformDecoded = decodeRowsCols(uSoftPayload);
    const softmaxUniform = {
      rows: softmaxUniformDecoded.rows,
      cols: softmaxUniformDecoded.cols,
      rowsExpected: seq,
      colsExpected: seq,
      correct: softmaxUniformDecoded.rows === seq && softmaxUniformDecoded.cols === seq,
    };

    let diagnosis: string;
    if (!qkt.pass) {
      diagnosis = 'PHASE QKT FAILURE';
    } else if (softmax && softmax.pass) {
      diagnosis = 'ISOLATED PHASE PASS';
    } else {
      diagnosis = 'GPU PHASE SOFTMAX EXECUTION';
    }

    const bufferInfo = {
      scoresBytes,
      probsBytes,
      expectedBytes,
      scoresBufferId: `scores@${seq}`,
      probsBufferId: `probs@${seq}`,
      distinct: bufScores !== bufProbs,
    };

    return { seq, dim, batch, readback: readbackMode, sharedUniform, qkt, qktUniform, softmax, softmaxUniform, wgInfo, bufferInfo, diagnosis };
  } finally {
    try {
      bufQ.destroy();
      bufK.destroy();
      bufScores.destroy();
      bufProbs.destroy();
      uQkt.destroy();
      uSoft.destroy();
    } catch {}
  }
}

// ─── orchestrators for the three buttons ───

export interface IsolatedQktOnlyReport {
  seq: number;
  manager: { qkt: QktChecks; diagnosis: string };
  direct: { qkt: QktChecks; diagnosis: string };
  overall: string;
}

export async function runIsolatedQktOnly(seqs: number[] = [4, 16, 64, 128, 256], dim = 64, batch = 1): Promise<IsolatedQktOnlyReport[]> {
  const out: IsolatedQktOnlyReport[] = [];
  for (const seq of seqs) {
    const manager = await runIsolatedPhaseExperiment(seq, 'manager', false, dim, batch);
    const direct = await runIsolatedPhaseExperiment(seq, 'direct', false, dim, batch);
    const overall = !manager.qkt.pass || !direct.qkt.pass ? 'PHASE QKT FAILURE' : 'QKT PASS';
    out.push({ seq, manager: { qkt: manager.qkt, diagnosis: manager.qkt.diagnosis }, direct: { qkt: direct.qkt, diagnosis: direct.qkt.diagnosis }, overall });
  }
  return out;
}

export interface IsolatedPhaseReport {
  seq: number;
  manager: IsolatedExperiment;
  direct: IsolatedExperiment;
  repro: IsolatedExperiment;
  overall: string;
}

export async function runFullIsolatedPhase(seqs: number[] = [4, 16, 64, 128, 256], dim = 64, batch = 1): Promise<IsolatedPhaseReport[]> {
  const out: IsolatedPhaseReport[] = [];
  for (const seq of seqs) {
    const manager = await runIsolatedPhaseExperiment(seq, 'manager', false, dim, batch);
    const direct = await runIsolatedPhaseExperiment(seq, 'direct', false, dim, batch);
    const repro = await runIsolatedPhaseExperiment(seq, 'manager', true, dim, batch);

    // TASK 12 / TASK 18 diagnosis
    let overall: string;
    if (!manager.qkt.pass || !direct.qkt.pass) {
      overall = 'PHASE QKT FAILURE';
    } else if ((manager.softmax?.pass ?? false) && (direct.softmax?.pass ?? false)) {
      // Isolated path works through both readbacks → harness at fault.
      overall = repro.softmax?.pass ? 'BENCHMARK HARNESS INTERACTION (UNEXPECTED: repro passed)' : 'BENCHMARK HARNESS INTERACTION';
    } else if (!(manager.softmax?.pass ?? false) && (direct.softmax?.pass ?? false)) {
      overall = 'READBACK MANAGER INTERACTION';
    } else {
      overall = 'GPU PHASE SOFTMAX EXECUTION';
    }
    out.push({ seq, manager, direct, repro, overall });
  }
  return out;
}

export function summarizeReports(reports: IsolatedPhaseReport[]): string {
  if (reports.some((r) => !r.manager.qkt.pass || !r.direct.qkt.pass)) return 'PHASE QKT FAILURE';
  const managerOk = reports.every((r) => r.manager.softmax?.pass ?? false);
  const directOk = reports.every((r) => r.direct.softmax?.pass ?? false);
  if (managerOk && directOk) return 'BENCHMARK HARNESS INTERACTION';
  if (!managerOk && directOk) return 'READBACK MANAGER INTERACTION';
  return 'GPU PHASE SOFTMAX EXECUTION';
}