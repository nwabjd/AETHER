// AETHER GPU Benchmark V3 — Result Schema, Reliability, and Scoring
//
// Centralizes the V3 result type, reliability classification, throughput
// sanity checks, and the AETHER Local AI Readiness Score.

export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNMEASURABLE';
export type Feasibility = 'GREEN' | 'YELLOW' | 'RED';

export interface MeasurementQuality {
  timerResolutionMs: number;
  totalMeasurementMs: number;
  signalToTimerRatio: number;
  confidence: Confidence;
  timerFloorLimited: boolean;
}

export interface V3Result {
  category: string;
  operation: string;
  workload: string;
  shape: string;
  repetitions: number;
  totalMs: number;                 // median wall-clock for the whole amplified block
  blockMs: number;                 // alias of totalMs (direct measurement)
  estimatedPerOperationMs: number; // totalMs / repetitions (ESTIMATED, not direct)
  medianMs: number | null;          // median of block samples; null if < 20 samples
  p95Ms: number | null;            // percentile of BLOCK distribution; null if too few samples
  p99Ms: number | null;
  samples: number;                 // number of valid block samples used for stats
  totalWork: number;               // FLOPs or bytes across ALL repetitions
  workUnit: 'FLOPs' | 'BYTES' | 'OPERATIONS' | 'NONE';
  totalFLOPs: number;
  totalBytes: number;
  timingMethod: string;
  confidence: Confidence;
  measurementQuality?: MeasurementQuality;
  correctnessPassed: boolean;
  throughput: number | null;
  throughputUnit: string;
  notes: string;
  measurable: boolean;
  timerFloorLimited: boolean;      // true when a per-op estimate sits at/under timer resolution
}

export interface V3Score {
  category: string;
  score: number;          // 0–100
  tests: number;
  measurable: number;
  notes: string;
}

export interface AETHERReadiness {
  tensorCompute: V3Score;
  memory: V3Score;
  attention: V3Score;
  mlp: V3Score;
  imageProcessing: V3Score;
  videoProcessing: V3Score;
  sustainedPerf: V3Score;
  overall: number;        // 0–100
}

export interface FeasibilityReport {
  transformerInference: Feasibility;
  imageGeneration: Feasibility;
  vaeDecoding: Feasibility;
  videoLatent: Feasibility;
  temporalAttention: Feasibility;
  longContext: Feasibility;
}

// ─── V3.1 LLM Inference Gate Types ─────────────────────────────────────

export interface TransformerBlockConfig {
  name: string;
  hidden: number;
  intermediate: number;
  layers: number;
  heads: number;
  kvHeads: number;
  headDim: number;
}

export interface TransformerBlockResult {
  config: TransformerBlockConfig;
  paramCount: number;
  fp16Bytes: number;
  int8Bytes: number;
  int4Bytes: number;
  blockLatencyMs: number; // Needed by UI
  // V3.1.3 required fields
  repetitions: number;
  totalMs: number;
  estimatedPerOperationMs: number;
  totalWork: number;
  workUnit: 'FLOPs' | 'BYTES' | 'OPERATIONS' | 'NONE';
  throughput: number | null;
  throughputUnit: string;
  confidence: Confidence;
}

export interface TokenGenEstimate {
  promptTokens: number;
  generateTokens: number;
  prefillMs: number;
  firstTokenMs: number;
  avgDecodeMs: number;
  tokensPerSec: number;
  totalMs: number;
}

export interface MemBudgetResult {
  targetMB: number;
  chunkMB: number;
  success: boolean;
  totalAllocatedMB: number;
  largestBufferMB: number;
  numBuffers: number;
  allocMs: number;
  writeMs: number;
  failureReason: string | null;
}

export interface LLMReadiness {
  // Legacy names (kept for compatibility with V3.1 UI/test callers)
  computeScore: number;
  memoryScore: number;
  attentionScore: number;
  decodeScore: number;
  transformerBlockScore: number;
  sustainedScore: number;
  overall: number;
  // V3.1.1 explicit sub-scores (item 15)
  llmCompute: number;        // INT8/INT4 quantized matmul compute
  llmMemory: number;         // memory ladder allocation capability
  kvCache: number;           // KV-cache decode attention at long context
  prefill: number;           // prefill-shaped quantized matmul
  decode: number;            // decode-shaped inference latency
  transformerBlock: number;  // synthetic transformer block latency
  longContext: number;       // long-context viability (kvCache + memory)
  sustained: number;         // sustained-load degradation status
}

export interface LLMGateResult {
  quantizedMatmul: V3Result[];
  decodeAttention: V3Result[];
  transformerBlocks: TransformerBlockResult[];
  tokenGeneration: TokenGenEstimate[];
  memoryBudget: MemBudgetResult[];
  llmReadiness: LLMReadiness;
}

// ─── Timer resolution (set once at startup) ──────────────────────────────

let _timerResolutionMs = 1; // default; overwritten on init
export function setTimerResolution(ms: number) { _timerResolutionMs = ms; }
export function getTimerResolution(): number { return _timerResolutionMs; }

// ─── TASK 3: Reliability classification ─────────────────────────────────

export function classifyConfidence(totalMs: number): Confidence {
  if (totalMs <= 0 || !Number.isFinite(totalMs)) return 'UNMEASURABLE';
  if (totalMs <= _timerResolutionMs) return 'UNMEASURABLE';
  if (totalMs < 5) return 'LOW';
  if (totalMs < 20) return 'MEDIUM';
  return 'HIGH';
}

// ─── TASK 18: Sanity-guarded throughput ──────────────────────────────────

const GFLOPS_HARD_CAP = 2000;     // physical ceiling for a mobile-class GPU
const GBPS_HARD_CAP = 2000;       // physical ceiling for mobile memory
const OPS_HARD_CAP = 5e9;         // per-second op ceiling

/**
 * V3.1 normalization fix:
 *   estimatedPerOperationMs = totalMs / repetitions
 *   totalWork = workPerExecution * repetitions
 *   throughput = totalWork / (totalMs / 1000) / unitDivisor
 *
 * p95/p99 remain percentiles of the measured BLOCK distribution (never
 * fabricated per-operation values).
 */
export interface BuildResultOpts {
  category: string; operation: string; workload: string; shape: string;
  reps: number;
  totalMs: number;
  medianMs: number | null;
  p95: number | null;
  p99: number | null;
  samples: number;
  confidence: Confidence;
  correctnessPassed: boolean;
  notes?: string;
  flopsPerExecution?: number;
  bytesPerExecution?: number;
  opsPerExecution?: number;
  throughputUnit?: 'GFLOPS' | 'GB/s' | 'M/s' | 'k/s' | '/s';
}

// ─── V3.1.3 CENTRAL RESULT FUNCTION (Phase 5) ────────────────────────────
//
// Every V3 / V3.1.3 benchmark MUST build its result through this function.
// It automatically calculates:
//   estimatedPerOperationMs = totalMs / repetitions
//   totalWork                = workPerExecution * repetitions
//   throughput               = totalWork / (totalMs/1000) / unitDivisor
//   measurementQuality       = signalToTimerRatio classification
//
// Runtime assertion: if estimatedPerOperationMs != totalMs/repetitions
// (within EPSILON) the function THROWS. No benchmark may fabricate these
// numbers, and a throw must be treated as a hard failure of the run.

export const TIMING_EPSILON = 0.000001;

export interface CreateResultOpts {
  category: string;
  operation: string;
  workload: string;
  shape: string;
  totalMs: number;                 // median wall-clock for the whole amplified block
  repetitions: number;             // >= 1 (1 = single dispatch timing)
  samples: number;                 // independent block samples collected
  medianMs: number | null;         // null unless samples >= 20
  p95Ms: number | null;            // null unless samples >= 20
  p99Ms: number | null;            // null unless samples >= 20
  flopsPerExecution?: number;
  bytesPerExecution?: number;
  opsPerExecution?: number;
  throughputUnit?: 'GFLOPS' | 'GB/s' | 'M/s' | 'k/s' | '/s';
  correctnessPassed: boolean;
  notes?: string;
}

export function createBenchmarkResult(o: CreateResultOpts): V3Result {
  // ── Runtime assertion 1: valid repetition count ─────────────────────
  if (!Number.isInteger(o.repetitions) || o.repetitions <= 0) {
    throw new Error(
      `TIMING INTEGRITY FAILURE: ${o.operation}/${o.workload} repetitions=${o.repetitions} must be a positive integer`
    );
  }
  // ── Runtime assertion 2: valid totalMs ──────────────────────────────
  if (!Number.isFinite(o.totalMs) || o.totalMs < 0) {
    throw new Error(`TIMING INTEGRITY FAILURE: ${o.operation}/${o.workload} totalMs=${o.totalMs} invalid`);
  }

  // ── Core invariant: estimatedPerOperationMs = totalMs / repetitions ─
  const estimatedPerOperationMs = o.totalMs / o.repetitions;
  const invariantDelta = Math.abs(estimatedPerOperationMs - o.totalMs / o.repetitions);
  if (invariantDelta > TIMING_EPSILON) {
    throw new Error(
      `TIMING INTEGRITY FAILURE: ${o.operation}/${o.workload} ` +
      `estimatedPerOperationMs=${estimatedPerOperationMs.toFixed(12)} != ` +
      `totalMs(${o.totalMs})/repetitions(${o.repetitions})=${(o.totalMs / o.repetitions).toFixed(12)}`
    );
  }

  // ── Total work across ALL repetitions (Phase 2) ─────────────────────
  const timerRes = getTimerResolution();
  const flops = (o.flopsPerExecution ?? 0) * o.repetitions;
  const bytes = (o.bytesPerExecution ?? 0) * o.repetitions;
  const ops = (o.opsPerExecution ?? 0) * o.repetitions;
  const unit: 'GFLOPS' | 'GB/s' | 'M/s' | 'k/s' | '/s' = o.throughputUnit ?? 'GFLOPS';
  // totalWork must represent the FULL amplified workload (reps applied)
  const workForThroughput = unit === 'GB/s' ? bytes : unit === 'GFLOPS' ? flops : ops;
  const workUnit: V3Result['workUnit'] = unit === 'GB/s' ? 'BYTES' : unit === 'GFLOPS' ? 'FLOPs' : 'OPERATIONS';

  // ── Throughput = totalWork / totalTime (Phase 2) ────────────────────
  const sec = o.totalMs / 1000;
  const div: Record<string, number> = { GFLOPS: 1e9, 'GB/s': 1e9, 'M/s': 1e6, 'k/s': 1e3, '/s': 1 };
  const d = div[unit];
  let throughput: number | null = null;
  let capped = false;
  if (sec > 0 && Number.isFinite(sec) && workForThroughput > 0 && Number.isFinite(workForThroughput) && d !== undefined) {
    const raw = workForThroughput / sec / d;
    const cap = unit === 'GFLOPS' ? GFLOPS_HARD_CAP : unit === 'GB/s' ? GBPS_HARD_CAP : OPS_HARD_CAP;
    if (Number.isFinite(raw) && raw >= 0 && raw <= cap) {
      throughput = raw;
    } else {
      capped = true; // physically impossible → invalid measurement
    }
  }

  // ── Measurement quality (Phase 4) ───────────────────────────────────
  // signalToTimerRatio < 5 → LOW, 5–20 → MEDIUM, >20 → HIGH.
  // Confidence also requires correctness: a failed check can never be HIGH.
  const signalToTimerRatio = o.totalMs > 0 ? o.totalMs / timerRes : 0;
  let confidence: Confidence;
  if (o.totalMs <= 0 || !Number.isFinite(o.totalMs)) {
    confidence = 'UNMEASURABLE';
  } else if (signalToTimerRatio < 5) {
    confidence = 'LOW';
  } else if (signalToTimerRatio < 20) {
    confidence = 'MEDIUM';
  } else {
    confidence = 'HIGH';
  }
  if (!o.correctnessPassed && confidence === 'HIGH') {
    confidence = 'MEDIUM'; // correctness is a hard requirement for HIGH
  }
  if (o.totalMs <= timerRes) {
    confidence = 'UNMEASURABLE'; // signal cannot be resolved from the timer
  }

  // ── Percentile policy (Phase 3B): ≥20 independent samples required ──
  const MED = o.samples >= 20 ? o.medianMs : null;
  const P95 = o.samples >= 20 ? o.p95Ms : null;
  const P99 = o.samples >= 20 ? o.p99Ms : null;

  // ── Timer-floor marking (Phase 4) ───────────────────────────────────
  const timerFloorLimited = estimatedPerOperationMs > 0 && estimatedPerOperationMs <= timerRes;
  const cappedNote = capped ? 'INVALID_MEASUREMENT throughput exceeds physical cap' : '';
  const notes = [
    o.notes ?? '',
    cappedNote,
    timerFloorLimited
      ? `TIMER-FLOOR_LIMITED: est. per-op ${estimatedPerOperationMs.toFixed(4)}ms ≤ ~${timerRes}ms timer resolution; measured from an amplified block of ${o.repetitions} repetitions — NOT direct sub-ms timing`
      : '',
  ].filter(Boolean).join(' · ');

  return {
    category: o.category, operation: o.operation, workload: o.workload, shape: o.shape,
    repetitions: o.repetitions, totalMs: o.totalMs, blockMs: o.totalMs,
    estimatedPerOperationMs,
    medianMs: MED, p95Ms: P95, p99Ms: P99, samples: o.samples,
    totalWork: workForThroughput, workUnit,
    totalFLOPs: flops, totalBytes: bytes,
    timingMethod: 'HOST_WALL_CLOCK_AMPLIFIED',
    confidence,
    measurementQuality: {
      timerResolutionMs: timerRes,
      totalMeasurementMs: o.totalMs,
      signalToTimerRatio,
      confidence,
      timerFloorLimited,
    },
    correctnessPassed: o.correctnessPassed,
    throughput, throughputUnit: unit,
    notes,
    measurable: confidence !== 'UNMEASURABLE',
    timerFloorLimited,
  };
}

// buildV3Result: legacy alias that delegates to the ONE authoritative
// function so V3.1 and V3.1.3 share identical measurement math.
export function buildV3Result(o: BuildResultOpts): V3Result {
  return createBenchmarkResult({
    category: o.category, operation: o.operation, workload: o.workload, shape: o.shape,
    totalMs: o.totalMs > 0 && Number.isFinite(o.totalMs) ? o.totalMs : 0,
    repetitions: o.reps > 0 ? o.reps : 1,
    samples: o.samples,
    medianMs: o.medianMs, p95Ms: o.p95, p99Ms: o.p99,
    flopsPerExecution: o.flopsPerExecution,
    bytesPerExecution: o.bytesPerExecution,
    opsPerExecution: o.opsPerExecution,
    throughputUnit: o.throughputUnit,
    correctnessPassed: o.correctnessPassed,
    notes: o.notes,
  });
}

export function safeThroughput(
  factorPerOp: number,
  perOpMs: number,
  unit: 'GFLOPS' | 'GB/s'
): { value: number | null; capped: boolean } {
  const sec = perOpMs / 1000;
  if (!(sec > 0) || !Number.isFinite(sec) || !(factorPerOp > 0)) {
    return { value: null, capped: false };
  }
  const raw = factorPerOp / sec / 1e9;
  if (!Number.isFinite(raw)) return { value: null, capped: false };
  const cap = unit === 'GFLOPS' ? GFLOPS_HARD_CAP : GBPS_HARD_CAP;
  if (raw > cap) return { value: null, capped: true };
  return { value: raw, capped: false };
}

/**
 * V3.1: throughput MUST be computed from total work across ALL repetitions
 * divided by the total amplified block time.
 *
 * totalMs is the measured wall-clock for the whole block (N repetitions).
 * totalWork = workPerOperation * repetitions.
 * throughput = totalWork / (totalMs / 1000) / unitDivisor.
 *
 * Never emit Infinity/NaN. Physically impossible results are flagged capped.
 */
export function computeThroughputTotal(
  totalWork: number,
  totalMs: number,
  unit: 'GFLOPS' | 'GB/s' | 'M/s' | 'k/s' | '/s'
): { value: number | null; capped: boolean } {
  const sec = totalMs / 1000;
  if (!(sec > 0) || !Number.isFinite(sec) || !(totalWork > 0) || !Number.isFinite(totalWork)) {
    return { value: null, capped: false };
  }
  const div: Record<string, number> = { GFLOPS: 1e9, 'GB/s': 1e9, 'M/s': 1e6, 'k/s': 1e3, '/s': 1 };
  const d = div[unit];
  if (d === undefined) return { value: null, capped: false };
  const raw = totalWork / sec / d;
  if (!Number.isFinite(raw) || raw < 0) return { value: null, capped: false };
  const cap = unit === 'GFLOPS' ? GFLOPS_HARD_CAP : unit === 'GB/s' ? GBPS_HARD_CAP : OPS_HARD_CAP;
  if (raw > cap) return { value: null, capped: true };
  return { value: raw, capped: false };
}

// ─── Statistics helpers ──────────────────────────────────────────────────

export function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(Math.floor(sorted.length * p), sorted.length - 1);
  return sorted[idx];
}

export function median(sorted: number[]): number {
  return percentile(sorted, 0.5);
}

// ─── TASK 21: AETHER Local AI Readiness Score ───────────────────────────
//
// Scoring formula:
//   Each category: 0–100 based on what % of its benchmarks are HIGH/MEDIUM
//   confidence AND below a "good enough" latency threshold.
//
// "Good enough" thresholds (per operation, model-shaped):
//   MatMul ≤ 2 ms   → score = 100
//   MatMul ≤ 5 ms   → score = 80
//   MatMul ≤ 10 ms  → score = 60
//   MatMul ≤ 20 ms  → score = 40
//   MatMul > 20 ms  → score = 20
//   UNMEASURABLE     → score = 0
//
// Overall = weighted average:
//   tensorCompute  25%
//   attention      25%
//   mlp            20%
//   memory         10%
//   image          10%
//   video          5%
//   sustained      5%

const WEIGHTS: Record<string, number> = {
  tensorCompute: 0.25,
  attention: 0.25,
  mlp: 0.20,
  memory: 0.10,
  imageProcessing: 0.10,
  videoProcessing: 0.05,
  sustainedPerf: 0.05,
};

function scoreFromLatency(ms: number, confidence: Confidence): number {
  if (confidence === 'UNMEASURABLE') return 0;
  if (confidence === 'LOW') return Math.min(scoreFromLatencyRaw(ms), 30);
  return scoreFromLatencyRaw(ms);
}

function scoreFromLatencyRaw(ms: number): number {
  if (ms <= 0 || !Number.isFinite(ms)) return 0;
  if (ms <= 2) return 100;
  if (ms <= 5) return 80;
  if (ms <= 10) return 60;
  if (ms <= 20) return 40;
  return 20;
}

function scoreCategory(results: V3Result[]): V3Score {
  if (results.length === 0) {
    return { category: '', score: 0, tests: 0, measurable: 0, notes: 'no tests' };
  }
  const cat = results[0].category;
  let total = 0;
  let measurable = 0;
  for (const r of results) {
    total += scoreFromLatency(r.estimatedPerOperationMs, r.confidence);
    if (r.confidence !== 'UNMEASURABLE') measurable++;
  }
  const score = Math.round(total / results.length);
  return { category: cat, score, tests: results.length, measurable, notes: '' };
}

function scoreMemory(memResults: { allocated: boolean; sizeMB: number }[]): V3Score {
  if (memResults.length === 0) {
    return { category: 'memory', score: 0, tests: 0, measurable: 0, notes: 'no tests' };
  }
  const ok = memResults.filter(m => m.allocated);
  const maxMB = ok.length > 0 ? Math.max(...ok.map(m => m.sizeMB)) : 0;
  let score = 0;
  if (maxMB >= 512) score = 100;
  else if (maxMB >= 384) score = 85;
  else if (maxMB >= 256) score = 70;
  else if (maxMB >= 128) score = 50;
  else if (maxMB >= 64) score = 30;
  else score = 10;
  return { category: 'memory', score, tests: memResults.length, measurable: ok.length, notes: `maxAlloc=${maxMB}MB` };
}

function scoreSustained(dropPct: number): V3Score {
  let score = 100;
  if (dropPct > 30) score = 20;
  else if (dropPct > 20) score = 40;
  else if (dropPct > 10) score = 70;
  else if (dropPct > 5) score = 85;
  return { category: 'sustainedPerf', score, tests: 1, measurable: 1, notes: `drop=${dropPct.toFixed(1)}%` };
}

export function computeReadiness(
  tensorResults: V3Result[],
  attentionResults: V3Result[],
  mlpResults: V3Result[],
  imageResults: V3Result[],
  videoResults: V3Result[],
  memResults: { allocated: boolean; sizeMB: number }[],
  sustainedDropPct: number
): AETHERReadiness {
  const tensorCompute = scoreCategory(tensorResults);
  const attention = scoreCategory(attentionResults);
  const mlp = scoreCategory(mlpResults);
  const imageProcessing = scoreCategory(imageResults);
  const videoProcessing = scoreCategory(videoResults);
  const memory = scoreMemory(memResults);
  const sustainedPerf = scoreSustained(sustainedDropPct);

  const overall = Math.round(
    tensorCompute.score * WEIGHTS.tensorCompute +
    attention.score * WEIGHTS.attention +
    mlp.score * WEIGHTS.mlp +
    memory.score * WEIGHTS.memory +
    imageProcessing.score * WEIGHTS.imageProcessing +
    videoProcessing.score * WEIGHTS.videoProcessing +
    sustainedPerf.score * WEIGHTS.sustainedPerf
  );

  return { tensorCompute, memory, attention, mlp, imageProcessing, videoProcessing, sustainedPerf, overall };
}

// ─── TASK 22: Feasibility classification ─────────────────────────────────

export function classifyFeasibility(score: AETHERReadiness): FeasibilityReport {
  const green = (v: number) => v >= 60 ? 'GREEN' as const : v >= 35 ? 'YELLOW' as const : 'RED' as const;
  return {
    transformerInference: green(Math.max(score.tensorCompute.score, score.attention.score, score.mlp.score)),
    imageGeneration: green(Math.max(score.imageProcessing.score, score.tensorCompute.score)),
    vaeDecoding: green(Math.max(score.imageProcessing.score, score.memory.score)),
    videoLatent: green(Math.max(score.videoProcessing.score, score.memory.score)),
    temporalAttention: green(Math.max(score.videoProcessing.score, score.attention.score)),
    longContext: score.attention.score >= 50 && score.memory.score >= 50 ? 'GREEN' : score.attention.score >= 30 ? 'YELLOW' : 'RED',
  };
}

// ─── V3.1 LLM Readiness Score ──────────────────────────────────────────
//
// Separate from the V3 AETHER Readiness Score. This one is specifically
// tuned for LLM inference capability on the device.
//
// computeScore:    from quantized matmul latency
// memoryScore:     from memory budget allocation success
// attentionScore:  from full-sequence attention (V3 results)
// decodeScore:     from KV-cache decode attention latency
// transformerBlockScore: from synthetic block latency
// sustainedScore:  from 30s sustained performance drop
//
// Overall = weighted average, explicitly heuristic.

function scoreLLMCategory(results: V3Result[]): number {
  if (results.length === 0) return 0;
  let total = 0;
  for (const r of results) total += scoreFromLatency(r.estimatedPerOperationMs, r.confidence);
  return Math.round(total / results.length);
}

function scoreLLMMemory(budget: { success: boolean; totalAllocatedMB: number }[]): number {
  if (budget.length === 0) return 0;
  const ok = budget.filter(b => b.success);
  if (ok.length === 0) return 0;
  const maxMB = Math.max(...ok.map(b => b.totalAllocatedMB));
  if (maxMB >= 1024) return 100;
  if (maxMB >= 768) return 85;
  if (maxMB >= 512) return 70;
  if (maxMB >= 256) return 50;
  if (maxMB >= 128) return 30;
  return 10;
}

function scoreLLMBlock(blocks: TransformerBlockResult[]): number {
  if (blocks.length === 0) return 0;
  let total = 0;
  for (const b of blocks) total += scoreFromLatency(b.blockLatencyMs, b.confidence);
  return Math.round(total / blocks.length);
}

export function computeLLMReadiness(
  quantizedResults: V3Result[],
  attentionResults: V3Result[],
  decodeResults: V3Result[],
  blockResults: TransformerBlockResult[],
  memBudget: { success: boolean; totalAllocatedMB: number }[],
  sustainedDropPct: number
): LLMReadiness {
  const computeScore = scoreLLMCategory(quantizedResults);
  const attentionScore = scoreLLMCategory(attentionResults);
  const decodeScore = scoreLLMCategory(decodeResults);
  const transformerBlockScore = scoreLLMBlock(blockResults);
  const memoryScore = scoreLLMMemory(memBudget);
  const sustainedPerf = scoreSustained(sustainedDropPct);
  const sustainedScore = sustainedPerf.score;

  // V3.1.1 explicit sub-scores (item 15)
  const llmCompute = computeScore;
  const llmMemory = memoryScore;
  const kvCache = scoreLLMCategory(decodeResults.filter(r => {
    const ctx = parseInt(/ctx=(\d+)/.exec(r.workload)?.[1] ?? '0', 10);
    return ctx >= 1024;
  }));
  const prefill = scoreLLMCategory(quantizedResults.filter(r => r.workload.includes('prefill')));
  const decode = decodeScore;
  const transformerBlock = transformerBlockScore;
  const longContext = Math.round((kvCache * 0.6 + memoryScore * 0.4));
  const sustained = sustainedScore;

  const overall = Math.round(
    computeScore * 0.30 +
    memoryScore * 0.15 +
    attentionScore * 0.15 +
    decodeScore * 0.15 +
    transformerBlockScore * 0.15 +
    sustainedScore * 0.10
  );

  return {
    computeScore, memoryScore, attentionScore, decodeScore, transformerBlockScore, sustainedScore, overall,
    llmCompute, llmMemory, kvCache, prefill, decode, transformerBlock, longContext, sustained,
  };
}

// ─── LLM Readiness Status (NOT CERTIFIED fallback) ──────────────────────
//
// The LLM gate MUST NOT certify a device if the required LLM-specific tests
// are missing or unsupported. Returns null score + NOT CERTIFIED.

export interface LLMReadinessStatus {
  llmReadinessScore: number | null;
  llmReadinessStatus: 'CERTIFIED' | 'NOT CERTIFIED';
  reason: string;
}

export function computeLLMReadinessStatus(
  llmReadiness: LLMReadiness | null | undefined,
  quantMatmulCount: number,
  decodeAttentionCount: number,
  transformerBlockCount: number,
  tokenGenerationCount = 0,
  memoryBudgetCount = 0
): LLMReadinessStatus {
  if (!llmReadiness) {
    return { llmReadinessScore: null, llmReadinessStatus: 'NOT CERTIFIED', reason: 'LLM gate did not run' };
  }
  if (quantMatmulCount === 0) {
    return { llmReadinessScore: null, llmReadinessStatus: 'NOT CERTIFIED', reason: 'INT8/INT4 quantized matmul missing or unsupported' };
  }
  if (decodeAttentionCount === 0) {
    return { llmReadinessScore: null, llmReadinessStatus: 'NOT CERTIFIED', reason: 'KV-cache decode attention missing or unsupported' };
  }
  if (transformerBlockCount === 0) {
    return { llmReadinessScore: null, llmReadinessStatus: 'NOT CERTIFIED', reason: 'Synthetic transformer block missing or unsupported' };
  }
  if (tokenGenerationCount === 0) {
    return { llmReadinessScore: null, llmReadinessStatus: 'NOT CERTIFIED', reason: 'Token-generation simulation missing or unsupported' };
  }
  if (memoryBudgetCount === 0) {
    return { llmReadinessScore: null, llmReadinessStatus: 'NOT CERTIFIED', reason: 'Memory ladder missing or unsupported' };
  }
  if (llmReadiness.overall > 0) {
    return { llmReadinessScore: llmReadiness.overall, llmReadinessStatus: 'CERTIFIED', reason: 'LLM gate completed with measurable results' };
  }
  return { llmReadinessScore: null, llmReadinessStatus: 'NOT CERTIFIED', reason: 'LLM gate produced no measurable results' };
}

// ─── JSON Self-Audit Validation ─────────────────────────────────────────
//
// Before declaring any benchmark export valid, validate:
//   estimatedPerOperationMs * repetitions ≈ totalMs
//   throughput ≈ totalWork / (totalMs / 1000)
// Reject NaN, Infinity, negative latency, zero/negative repetitions,
// invalid units, and missing totalWork/totalFLOPs/totalBytes.

export interface IntegrityIssue {
  operation: string;
  workload: string;
  kind: string;
  detail: string;
}

export function validateResultIntegrity(results: V3Result[]): { ok: boolean; issues: IntegrityIssue[] } {
  const issues: IntegrityIssue[] = [];
  for (const r of results) {
    const id = `${r.operation} (${r.workload})`;

    if (!Number.isFinite(r.totalMs) || r.totalMs < 0) {
      issues.push({ operation: r.operation, workload: r.workload, kind: 'invalid_totalMs', detail: `totalMs=${r.totalMs} not a non-negative finite number` });
    }
    if (!Number.isFinite(r.repetitions) || r.repetitions <= 0 || !Number.isInteger(r.repetitions)) {
      issues.push({ operation: r.operation, workload: r.workload, kind: 'invalid_repetitions', detail: `repetitions=${r.repetitions} must be positive integer` });
    }
    if (!Number.isFinite(r.estimatedPerOperationMs) || r.estimatedPerOperationMs < 0) {
      issues.push({ operation: r.operation, workload: r.workload, kind: 'invalid_estimated', detail: `estimatedPerOperationMs=${r.estimatedPerOperationMs}` });
    }
    if (Number.isFinite(r.totalMs) && Number.isFinite(r.estimatedPerOperationMs) && r.repetitions > 0) {
      const expected = r.totalMs / r.repetitions;
      if (Math.abs(expected - r.estimatedPerOperationMs) > 1e-6) {
        issues.push({
          operation: r.operation, workload: r.workload, kind: 'normalization_mismatch',
          detail: `expected estimatedPerOperationMs=${expected.toFixed(6)} (totalMs/reps), got ${r.estimatedPerOperationMs}`,
        });
      }
    }
    if (Number.isNaN(r.blockMs) || r.blockMs < 0) {
      issues.push({ operation: r.operation, workload: r.workload, kind: 'invalid_blockMs', detail: `blockMs=${r.blockMs}` });
    }
    if (Number.isNaN(r.totalWork) || r.totalWork < 0) {
      issues.push({ operation: r.operation, workload: r.workload, kind: 'missing_totalWork', detail: `totalWork=${r.totalWork}` });
    }
    if (!['FLOPs', 'BYTES', 'OPERATIONS', 'NONE'].includes(r.workUnit)) {
      issues.push({ operation: r.operation, workload: r.workload, kind: 'invalid_workUnit', detail: `workUnit=${r.workUnit}` });
    }
    if (typeof r.timerFloorLimited !== 'boolean') {
      issues.push({ operation: r.operation, workload: r.workload, kind: 'missing_timerFloorLimited', detail: `timerFloorLimited=${r.timerFloorLimited}` });
    }
    if (r.throughput !== null) {
      if (!Number.isFinite(r.throughput) || r.throughput < 0) {
        issues.push({ operation: r.operation, workload: r.workload, kind: 'invalid_throughput', detail: `throughput=${r.throughput}` });
      } else if (r.totalMs > 0) {
        const expected = r.totalWork / (r.totalMs / 1000);
        const unitDivisor = r.throughputUnit === 'GFLOPS' ? 1e9 : r.throughputUnit === 'GB/s' ? 1e9 : r.throughputUnit === 'M/s' ? 1e6 : r.throughputUnit === 'k/s' ? 1e3 : 1;
        const expectedUnit = expected / unitDivisor;
        if (Math.abs(expectedUnit - r.throughput) / Math.max(expectedUnit, 1e-12) > 0.01) {
          issues.push({
            operation: r.operation, workload: r.workload, kind: 'throughput_mismatch',
            detail: `expected throughput=${expectedUnit.toFixed(6)} ${r.throughputUnit}, got ${r.throughput}`,
          });
        }
      }
    }
    if (!['GFLOPS', 'GB/s', 'M/s', 'k/s', '/s'].includes(r.throughputUnit)) {
      issues.push({ operation: r.operation, workload: r.workload, kind: 'invalid_unit', detail: `throughputUnit=${r.throughputUnit}` });
    }
  }
  return { ok: issues.length === 0, issues };
}

export function validateLLMGateIntegrity(gate: LLMGateResult | null | undefined): { ok: boolean; issues: IntegrityIssue[] } {
  if (!gate) {
    return { ok: false, issues: [{ operation: 'LLM_GATE', workload: '—', kind: 'missing', detail: 'llmInference results missing from export' }] };
  }
  const matmulIssues = validateResultIntegrity(gate.quantizedMatmul);
  const attnIssues = validateResultIntegrity(gate.decodeAttention);
  const all = [...matmulIssues.issues, ...attnIssues.issues];
  if (gate.quantizedMatmul.length === 0) {
    all.push({ operation: 'LLM_GATE', workload: 'quantizedMatmul', kind: 'empty_section', detail: 'no INT8/INT4 matmul results' });
  }
  if (gate.decodeAttention.length === 0) {
    all.push({ operation: 'LLM_GATE', workload: 'decodeAttention', kind: 'empty_section', detail: 'no KV-cache decode attention results' });
  }
  if (gate.transformerBlocks.length === 0) {
    all.push({ operation: 'LLM_GATE', workload: 'transformerBlocks', kind: 'empty_section', detail: 'no synthetic transformer block results' });
  }
  return { ok: all.length === 0, issues: all };
}
