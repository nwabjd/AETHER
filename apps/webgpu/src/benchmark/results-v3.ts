// AETHER GPU Benchmark V3 — Result Schema, Reliability, and Scoring
//
// Centralizes the V3 result type, reliability classification, throughput
// sanity checks, and the AETHER Local AI Readiness Score.

export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNMEASURABLE';
export type Feasibility = 'GREEN' | 'YELLOW' | 'RED';

export interface V3Result {
  category: string;
  operation: string;
  workload: string;
  shape: string;
  repetitions: number;
  totalMs: number;
  estimatedPerOperationMs: number;
  medianMs: number;
  p95Ms: number;
  p99Ms: number;
  timingMethod: string;
  confidence: Confidence;
  correctnessPassed: boolean;
  throughput: number | null;
  throughputUnit: string;
  notes: string;
  measurable: boolean;
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

const GFLOPS_HARD_CAP = 500;     // no known mobile GPU exceeds this
const GBPS_HARD_CAP = 1_000;     // no mobile memory bus exceeds this

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
