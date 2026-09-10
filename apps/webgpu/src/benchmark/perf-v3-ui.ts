// AETHER GPU Benchmark V3.1.3 — UI Rendering + Export
//
// Renders the V3 result into a premium technical dashboard and provides
// JSON + Markdown report export. 
// 
// AUTHORITATIVE CONSTANTS:
const AETHER_RUNTIME_ID = "AETHER_V3_1_3_RUNTIME";
const AETHER_BENCHMARK_VERSION = "V3.1.3";
const AETHER_RUNTIME_SCHEMA_VERSION = "3.1.3";

import { runV3Full, runV3Quick, type V3FullResult } from './perf-v3.ts';
import {
  type V3Result, type AETHERReadiness, type FeasibilityReport,
  type LLMGateResult, type TransformerBlockResult, type TokenGenEstimate, type MemBudgetResult,
  getTimerResolution, setTimerResolution,
  validateResultIntegrity, validateLLMGateIntegrity, computeLLMReadinessStatus,
} from './results-v3.ts';
import {
  type CertificationGates, type SelfAuditV3113,
  checkV3ResultIntegrity, computeCertificationGates, buildLlmInferenceV3113, runSelfAuditV3113,
  finalizeCertificationWithInterruption,
} from './v3113.ts';
import { runLLMInferenceGate, runLLMInferenceGateQuick, runLLMDiagnosticStaged } from './perf-v3-llm.ts';
import {
  beginBenchmark, completeBenchmark, interrupt, monitorDeviceLost,
  getRuntimeError, getDeviceHealth, getCheckpoint, clearRuntimeError,
  startHeartbeatTicker, stopHeartbeatTicker,
} from './crash-safety.ts';
import type { ResumeContext, RuntimeErrorRecord, InterruptionKind } from './crash-safety.ts';
import { createBenchmarkResult } from './results-v3.ts';

// Force runtime inclusion of V3.1.3 sentinels (prevents tree-shaking)
export const AETHER_V313_SENTINELS = {
  AETHER_RUNTIME_ID: AETHER_RUNTIME_ID,
  AETHER_BENCHMARK_VERSION: AETHER_BENCHMARK_VERSION,
  AETHER_RUNTIME_SCHEMA_VERSION: AETHER_RUNTIME_SCHEMA_VERSION,
  runSelfAuditV3113,
  runLLMGateFromUI,
  runLLMInferenceGate,
  createBenchmarkResult,
};


export interface V3Environment {
  adapterName: string;
  adapterVendor: string;
  adapterDevice: string;
  maxBufferSize: number | null;
  maxWorkgroupsPerDim: number | null;
  device: string;
  platform: string;
  userAgent: string;
  webgpu: boolean;
  crossOriginIsolated: boolean;
  secureContext: boolean;
  timerResolutionMs: number;
}

// Global store for the most recent LLM inference gate results, so the
// combined V3.1.1 export can embed them under results.llmInference.
export let _llmGateResults: LLMGateResult | null = null;

// Build the structured llmInference export object with the exact field
// names required by the V3.1.1 spec (context, kvCacheBytes, status, etc.).
export function buildLLMInferenceExport(gate: LLMGateResult | null) {
  if (!gate) return null;

  const quantizedMatmul = gate.quantizedMatmul.map(r => {
    const isInt8 = r.workload.startsWith('INT8');
    return {
      operation: r.operation,
      workload: r.workload,
      shape: r.shape,
      status: r.measurable && r.totalMs > 0 ? 'MEASURED' : 'UNSUPPORTED',
      latencyMs: r.totalMs,
      estimatedPerOperationMs: r.estimatedPerOperationMs,
      throughput: r.throughput,
      throughputUnit: r.throughputUnit,
      correctnessPassed: r.correctnessPassed,
      confidence: r.confidence,
      quantizationPath: isInt8
        ? 'weight-only INT8 — 4 int8 weights packed per u32, sign-extended two-complement unpack in WGSL'
        : 'weight-only INT4 — 8 int4 weights packed per u32, sign-extended two-complement unpack in WGSL',
    };
  });

  const decodeAttention = gate.decodeAttention.map(r => {
    const ctx = parseInt(/ctx=(\d+)/.exec(r.workload)?.[1] ?? '0', 10);
    const heads = parseInt(/heads=(\d+)/.exec(r.workload)?.[1] ?? '8', 10);
    const headDim = parseInt(/headDim=(\d+)/.exec(r.workload)?.[1] ?? '64', 10);
    return {
      context: ctx,
      heads,
      headDim,
      latencyMs: r.totalMs,
      estimatedPerOperationMs: r.estimatedPerOperationMs,
      correctnessPassed: r.correctnessPassed,
      confidence: r.confidence,
      // K cache + V cache, both f32: ctx * heads * headDim * 4 bytes * 2
      kvCacheBytes: ctx * heads * headDim * 8,
      status: r.measurable && r.totalMs > 0 ? 'MEASURED' : 'UNSUPPORTED',
    };
  });

  const transformerBlocks = gate.transformerBlocks.map(b => ({
    name: b.config.name,
    hiddenSize: b.config.hidden,
    intermediateSize: b.config.intermediate,
    layers: b.config.layers,
    heads: b.config.heads,
    kvHeads: b.config.kvHeads,
    approxParameterCount: b.paramCount,
    approxFP16WeightMB: +(b.fp16Bytes / (1024 * 1024)).toFixed(2),
    approxINT8WeightMB: +(b.int8Bytes / (1024 * 1024)).toFixed(2),
    approxINT4WeightMB: +(b.int4Bytes / (1024 * 1024)).toFixed(2),
    syntheticBlockLatencyMs: b.totalMs,
    estimatedTokenLatencyMs: +(b.totalMs * b.config.layers).toFixed(3),
    confidence: b.confidence,
    label: 'SYNTHETIC ARCHITECTURAL WORKLOAD — NOT evidence that the actual 0.5B/1B/etc model fits',
  }));

  const tokenGeneration = gate.tokenGeneration.map(t => ({
    prompt: t.promptTokens,
    generate: t.generateTokens,
    prefillLatencyMs: t.prefillMs,
    firstTokenLatencyMs: t.firstTokenMs,
    averageDecodeLatencyMs: t.avgDecodeMs,
    estimatedTokensPerSecond: t.tokensPerSec,
    generationTimeMs: t.totalMs,
    label: 'SYNTHETIC INFERENCE ESTIMATE — not actual model results',
  }));

  const memoryBudget = gate.memoryBudget.map(mb => ({
    requestedMB: mb.targetMB,
    allocatedMB: +mb.totalAllocatedMB.toFixed(2),
    largestBufferMB: mb.largestBufferMB,
    bufferCount: mb.numBuffers,
    allocationTimeMs: mb.allocMs,
    writeTimeMs: mb.writeMs,
    status: mb.success ? 'OK' : 'FAILED',
  }));

  return {
    quantizedMatmul,
    decodeAttention,
    transformerBlocks,
    tokenGeneration,
    memoryBudget,
    note: 'WebGPU allocation capability, NOT total system RAM.',
  };
}

// Build the V3.1.3 self-audit + certification gates. The benchmark FAILS
// certification if any mandatory gate fails or any invariant is violated.
export function buildSelfAudit(
  results: V3FullResult | null,
  gate: LLMGateResult | null,
  timerResolutionMs: number
) {
  // Collect all V3Result arrays across the full V3 dashboard
  const batchResults: V3Result[] = results
    ? [...results.matmul, ...results.attention, ...results.mlp, ...results.rmsnorm,
       ...results.embedding, ...results.imageOps, ...results.vae, ...results.video]
    : [];

  // Run the V3.1.3 integrity + certification gates
  const gateResult = (() => {
    const base = computeCertificationGates(gate, batchResults);
    // Crash-safety: fail closed if the benchmark was ever interrupted.
    const checkpoint = getCheckpoint();
    if (checkpoint?.interruption) {
      return finalizeCertificationWithInterruption(base, checkpoint.interruption);
    }
    const runtimeError = getRuntimeError();
    const health = getDeviceHealth();
    const interruption = runtimeError
      ? {
          kind: (runtimeError as RuntimeErrorRecord & { category: InterruptionKind | null }).category as InterruptionKind,
          reason: runtimeError.error,
          error: runtimeError.error,
          stack: runtimeError.stack,
          at: runtimeError.timestamp,
        }
      : health.lost
        ? {
            kind: 'WEBGPU_DEVICE_LOST' as const,
            reason: health.reason ?? 'device lost',
            error: health.message ?? null,
            stack: null,
            at: new Date().toISOString(),
          }
        : null;
    if (interruption) {
      return finalizeCertificationWithInterruption(base, interruption);
    }
    return base;
  })();
  const llmInference = gate ? buildLlmInferenceV3113(gate) : null;
  const selfAudit = runSelfAuditV3113(llmInference, timerResolutionMs);

  // Build the legacy audit shape for backward compat with the JSON export
  const allV3 = [...batchResults, ...(gate ? [...gate.quantizedMatmul, ...gate.decodeAttention] : [])];
  const timerFloorCount = allV3.filter(r => r.timerFloorLimited).length;
  const correctnessFailed = allV3.filter(r => r.notes.includes('correctness FAILED'));
  const llmReadinessStatus = computeLLMReadinessStatus(
    gate?.llmReadiness ?? null,
    gate?.quantizedMatmul.length ?? 0,
    gate?.decodeAttention.length ?? 0,
    gate?.transformerBlocks.length ?? 0,
    gate?.tokenGeneration.length ?? 0,
    gate?.memoryBudget.length ?? 0
  );

  return {
    generatedAt: new Date().toISOString(),
    normalization: { ok: gateResult.timingIntegrity === 'PASS', checked: allV3.length, issues: [] },
    throughput: { ok: gateResult.throughputIntegrity === 'PASS', checked: allV3.length, issues: [] },
    correctness: {
      checked: allV3.filter(r => r.notes.includes('correctness')).length,
      passed: allV3.filter(r => r.correctnessPassed).length,
      failed: correctnessFailed.map(r => `${r.operation} (${r.workload})`),
    },
    timerLimitations: {
      timerResolutionMs,
      timerFloorLimitedCount: timerFloorCount,
      note: `Timer resolution ≈ ${timerResolutionMs} ms. Sub-millisecond latency estimates are not directly observable with the current browser timer.`,
    },
    // V3.1.3 certification gates
    timingIntegrity: gateResult.timingIntegrity,
    throughputIntegrity: gateResult.throughputIntegrity,
    correctnessIntegrity: gateResult.correctnessIntegrity,
    llmSuiteComplete: gateResult.llmSuiteComplete,
    memorySuiteComplete: gateResult.memorySuiteComplete,
    overallCertified: gateResult.overallCertified,
    certificationStatus: gateResult.certificationStatus,
    certificationReasons: gateResult.reasons,
    // Legacy field kept for compat
    certification: gateResult.overallCertified ? 'PASS' : 'FAIL',
    llmReadinessScore: llmReadinessStatus.llmReadinessScore,
    llmReadinessStatus: llmReadinessStatus.llmReadinessStatus,
    llmReadinessReason: llmReadinessStatus.reason,
    // V3.1.3 self-audit checks
    selfAuditChecks: selfAudit,
    // Crash-safety forensics
    deviceHealth: getDeviceHealth(),
    runtimeError: getRuntimeError(),
    interruption: getCheckpoint()?.interruption ?? null,
  };
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

function confBadge(c: string): string {
  const color = c === 'HIGH' ? 'var(--green)' : c === 'MEDIUM' ? 'var(--yellow)' : c === 'LOW' ? 'var(--red)' : 'var(--text-dim)';
  return `<span style="color:${color};font-weight:600">${c}</span>`;
}

function sustainedClassification(dropPct: number): string {
  if (dropPct <= 5) {
    return '<div style="font-size:11px;color:var(--text-dim);margin-top:6px">Classification: <b>NO SIGNIFICANT DEGRADATION OBSERVABLE</b> — timer resolution ≈ 1ms, so low-magnitude thermal throttling cannot be precisely resolved by this method.</div>';
  }
  if (dropPct <= 20) {
    return '<div style="font-size:11px;color:var(--yellow);margin-top:6px">Classification: <b>MINOR PERFORMANCE DROP OBSERVED</b> — possibly thermal/sustained-load related; verify with a higher-resolution measurement method.</div>';
  }
  return '<div style="font-size:11px;color:var(--red);margin-top:6px">Classification: <b>SIGNIFICANT PERFORMANCE DROP</b> — likely sustained-load or thermal throttling; verify with a higher-resolution measurement method.</div>';
}

function fmtOp(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) return '—';
  if (ms <= 0 || !Number.isFinite(ms)) return 'UNMEASURABLE';
  if (ms < 1) return `${(ms * 1000).toFixed(1)} µs`;
  return `${ms.toFixed(3)} ms`;
}

function fmtThroughput(r: V3Result): string {
  if (r.throughput === null || r.throughput === undefined || !Number.isFinite(r.throughput)) {
    return r.notes.includes('INVALID') ? 'INVALID' : '—';
  }
  return `${r.throughput.toFixed(2)} ${r.throughputUnit}`;
}

function section(title: string, rows: V3Result[]): string {
  if (rows.length === 0) return '';
  return `<div class="v3-section">
    <div class="v3-section-title">${esc(title)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>block ms</th><th>est/op ms</th><th>median</th><th>p95</th><th>total FLOPs</th><th>total bytes</th><th>throughput</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${rows.map(r => `<tr>
        <td>${esc(r.operation)}<br/><small style="color:var(--text-dim)">${esc(r.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${esc(r.shape)}</td>
        <td>${r.repetitions.toLocaleString()}</td>
        <td>${r.measurable ? r.blockMs.toFixed(2) : '—'}</td>
        <td>${r.measurable ? fmtOp(r.estimatedPerOperationMs) : '—'}</td>
        <td>${fmtOp(r.medianMs)}</td>
        <td>${fmtOp(r.p95Ms)}</td>
        <td>${r.totalFLOPs > 0 ? r.totalFLOPs.toExponential(3) : '—'}</td>
        <td>${r.totalBytes > 0 ? (r.totalBytes / 1048576).toFixed(1) + ' MiB' : '—'}</td>
        <td>${fmtThroughput(r)}</td>
        <td>${confBadge(r.confidence)}</td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function scoreBar(label: string, score: number): string {
  return `<div class="score-row">
    <div class="score-label">${esc(label)}</div>
    <div class="score-track"><div class="score-fill" style="width:${score}%"></div></div>
    <div class="score-val">${score}</div>
  </div>`;
}

function feasBadge(f: FeasibilityReport[keyof FeasibilityReport] | string): string {
  const color = f === 'GREEN' ? 'var(--green)' : f === 'YELLOW' ? 'var(--yellow)' : 'var(--red)';
  return `<span style="color:${color};font-weight:700">${f}</span>`;
}

// Transformer-inference classification MUST be gated on the LLM-specific
// gate, not on legacy FP32 MatMul/MLP tests alone. If the LLM gate is
// missing or uncertified, we refuse to show a green transformer badge.
function llmGatedTransformerClass(legacy: FeasibilityReport['transformerInference']): string {
  const gate = _llmGateResults;
  const hasLLMTests =
    (gate?.quantizedMatmul.length ?? 0) > 0 &&
    (gate?.decodeAttention.length ?? 0) > 0 &&
    (gate?.transformerBlocks.length ?? 0) > 0;
  const certified = gate != null && gate.llmReadiness != null && gate.llmReadiness.overall > 0 && hasLLMTests;
  if (!certified) {
    return `<span style="color:var(--red);font-weight:700">NOT CERTIFIED</span> <span style="font-size:10px;color:var(--text-dim)">(requires INT8/INT4 matmul + KV-cache decode + transformer block gate)</span>`;
  }
  return feasBadge(legacy) + ` <span style="font-size:10px;color:var(--text-dim)">(LLM gate: ${gate!.llmReadiness.overall}/100)</span>`;
}

export function renderV3Certification(results: V3FullResult, env: V3Environment): string {
  const sa = buildSelfAudit(results, _llmGateResults, env.timerResolutionMs);

  const gate = (label: string, status: 'PASS' | 'FAIL') => {
    const color = status === 'PASS' ? 'var(--green)' : 'var(--red)';
    return `<span style="display:inline-block;padding:2px 8px;border:1px solid ${color};border-radius:4px;font-size:11px;margin:2px"><b style="color:${color}">${status}</b> ${label}</span>`;
  };

  const isCertified = sa.certificationStatus === 'CERTIFIED';
  const certColor = isCertified ? 'var(--green)' : 'var(--red)';

  return `<div style="padding:10px 12px;border:2px solid ${certColor};border-radius:8px;margin-bottom:12px;font-size:12px;background:${isCertified ? 'rgba(0,200,0,0.05)' : 'rgba(200,0,0,0.05)'}">
    <div style="font-size:14px;font-weight:700;color:${certColor};margin-bottom:6px">
      AETHER DEVICE CERTIFICATION: ${isCertified ? 'CERTIFIED' : 'NOT CERTIFIED'}
    </div>
    <div style="margin-bottom:4px">
      ${gate('WEBGPU', _llmGateResults ? 'PASS' : 'FAIL')}
      ${gate('TIMING', sa.timingIntegrity ?? 'FAIL')}
      ${gate('THROUGHPUT', sa.throughputIntegrity ?? 'FAIL')}
      ${gate('CORRECTNESS', sa.correctnessIntegrity ?? 'FAIL')}
      ${gate('LLM SUITE', sa.llmSuiteComplete ?? 'FAIL')}
      ${gate('MEMORY SUITE', sa.memorySuiteComplete ?? 'FAIL')}
    </div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:4px">
      Timer resolution: ~${env.timerResolutionMs.toFixed(1)} ms &mdash; Sub-millisecond latency estimates are not directly observable with the current browser timer.
    </div>
    ${(sa.certificationReasons?.length ?? 0) > 0
      ? `<div style="margin-top:6px;font-size:11px;color:var(--red)">${sa.certificationReasons!.map(r => esc(r)).join(' · ')}</div>`
      : ''}
  </div>`;
}

function renderV3(results: V3FullResult, env: V3Environment, log: (msg: string, kind?: string) => void) {
  const mount = document.getElementById('perf-v3-results');
  if (!mount) return;

  const score = results.readiness;
  const feas = results.feasibility;

  mount.innerHTML = `
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
<div class="card-header">
        <span class="card-title">AETHER MODEL-SHAPED BENCHMARK — V3</span>
        <span class="badge badge-info">MODEL RELEVANT</span>
      </div>

      ${renderV3Certification(results, env)}

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${esc(env.adapterName)}</b></div>
          <div>Vendor: <b>${esc(env.adapterVendor)}</b></div>
          <div>Device: <b>${esc(env.adapterDevice)}</b></div>
          <div>Platform: <b>${esc(env.platform)}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">WEBGPU</div>
          <div>Status: <b style="color:${env.webgpu ? 'var(--green)' : 'var(--red)'}">${env.webgpu ? 'READY' : 'UNAVAILABLE'}</b></div>
          <div>maxBufferSize: <b>${env.maxBufferSize ? (env.maxBufferSize / 1073741824).toFixed(2) + ' GiB' : 'UNAVAILABLE'}</b></div>
          <div>maxWorkgroups/dim: <b>${env.maxWorkgroupsPerDim?.toLocaleString() ?? 'UNAVAILABLE'}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">TIMING</div>
          <div>Method: <b>HOST_WALL_CLOCK<br/>AMPLIFIED</b></div>
          <div>Timer resolution: <b>${env.timerResolutionMs.toFixed(3)} ms</b></div>
          <div>Cross-origin: <b>${env.crossOriginIsolated ? 'YES' : 'NO'}</b></div>
          <div>Secure: <b>${env.secureContext ? 'YES' : 'NO'}</b></div>
        </div>
      </div>

      ${section('TRANSFORMER — MatMul', results.matmul)}
      ${section('TRANSFORMER — RMSNorm', results.rmsnorm)}
      ${section('TRANSFORMER — Embedding', results.embedding)}
      ${section('ATTENTION', results.attention)}
      ${section('MLP', results.mlp)}
      ${section('IMAGE — Elementwise', results.imageOps)}
      ${section('IMAGE — VAE Decoder', results.vae)}
      ${section('VIDEO — Temporal Mixing', results.video)}

      <div class="v3-section">
        <div class="v3-section-title">MEMORY PRESSURE</div>
        <table class="perf-table">
          <thead><tr><th>size</th><th>alloc</th><th>alloc ms</th><th>write ms</th></tr></thead>
          <tbody>
          ${results.memory.map(m => `<tr>
            <td>${m.sizeMB} MB</td>
            <td style="color:${m.allocated ? 'var(--green)' : 'var(--red)'}">${m.allocated ? 'OK' : 'FAIL'}</td>
            <td>${m.allocMs > 0 ? m.allocMs.toFixed(1) : '—'}</td>
            <td>${m.writeMs > 0 ? m.writeMs.toFixed(1) : '—'}</td>
          </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="v3-section">
        <div class="v3-section-title">SUSTAINED PERFORMANCE (30s)</div>
        <table class="perf-table">
          <thead><tr><th>metric</th><th>value</th></tr></thead>
          <tbody>
            <tr><td>operations</td><td>${results.sustained.totalOps.toLocaleString()}</td></tr>
            <tr><td>average latency</td><td>${results.sustained.avgMs.toFixed(3)} ms</td></tr>
            <tr><td>median latency</td><td>${results.sustained.medianMs.toFixed(3)} ms</td></tr>
            <tr><td>p95 latency</td><td>${results.sustained.p95Ms.toFixed(3)} ms</td></tr>
            <tr><td>p99 latency</td><td>${results.sustained.p99Ms.toFixed(3)} ms</td></tr>
            <tr><td>first 5s avg</td><td>${results.sustained.first5sMs.toFixed(3)} ms</td></tr>
            <tr><td>last 5s avg</td><td>${results.sustained.last5sMs.toFixed(3)} ms</td></tr>
<tr><td>performance drop</td><td style="color:${results.sustained.dropPct > 20 ? 'var(--red)' : results.sustained.dropPct > 5 ? 'var(--yellow)' : 'var(--green)'}">${results.sustained.dropPct.toFixed(1)}%</td></tr>
          </tbody>
        </table>
        ${sustainedClassification(results.sustained.dropPct)}
        <div style="font-size:11px;color:var(--text-dim);margin-top:6px">thermalTelemetry: UNAVAILABLE · gpuUtilization: UNAVAILABLE</div>
      </div>

      <div class="v3-section">
        <div class="v3-section-title">AETHER LOCAL AI READINESS SCORE (heuristic)</div>
        ${scoreBar('TENSOR_COMPUTE', score.tensorCompute.score)}
        ${scoreBar('ATTENTION', score.attention.score)}
        ${scoreBar('MLP', score.mlp.score)}
        ${scoreBar('MEMORY', score.memory.score)}
        ${scoreBar('IMAGE_PROCESSING', score.imageProcessing.score)}
        ${scoreBar('VIDEO_PROCESSING', score.videoProcessing.score)}
        ${scoreBar('SUSTAINED_PERFORMANCE', score.sustainedPerf.score)}
        <div class="overall-row"><span>LOCAL_AI_READINESS</span><span>${score.overall} / 100</span></div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
          Heuristic benchmark score — NOT an official Apple performance rating.
        </div>
      </div>

<div class="v3-section">
        <div class="v3-section-title">LOCAL AI CAPABILITY CLASSIFICATION</div>
        <table class="perf-table">
          <thead><tr><th>capability</th><th>class</th></tr></thead>
          <tbody>
            <tr><td>Transformer inference</td><td>${llmGatedTransformerClass(feas.transformerInference)}</td></tr>
            <tr><td>Image generation</td><td>${feasBadge(feas.imageGeneration)}</td></tr>
            <tr><td>VAE decoding</td><td>${feasBadge(feas.vaeDecoding)}</td></tr>
            <tr><td>Video latent processing</td><td>${feasBadge(feas.videoLatent)}</td></tr>
            <tr><td>Temporal attention</td><td>${feasBadge(feas.temporalAttention)}</td></tr>
            <tr><td>Long-context processing</td><td>${feasBadge(feas.longContext)}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
<button class="btn" id="btn-export-v3-json">EXPORT COMPLETE V3.1.3 JSON</button>
        <button class="btn btn-outline" id="btn-export-v3-report">EXPORT V3 REPORT</button>
      </div>
    </div>
  `;

  mount.querySelector('#btn-export-v3-json')?.addEventListener('click', () => exportV3Json(results, env));
  mount.querySelector('#btn-export-v3-report')?.addEventListener('click', () => exportV3Markdown(results, env));
  log('V3 benchmark complete', 'ok');
}

// ─── Export helpers ──────────────────────────────────────────────────────

function download(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function exportV3Json(results: V3FullResult, env: V3Environment) {
  const selfAudit = buildSelfAudit(results, _llmGateResults, env.timerResolutionMs);
  const llmInferenceV3113 = _llmGateResults ? buildLlmInferenceV3113(_llmGateResults) : null;

  const payload = {
    version: 'AETHER V3.1.3',
    device: env,
    environment: {
      userAgent: env.userAgent,
      platform: env.platform,
      webgpu: env.webgpu,
      crossOriginIsolated: env.crossOriginIsolated,
      secureContext: env.secureContext,
    },
    timing: { method: 'HOST_WALL_CLOCK_AMPLIFIED', timerResolutionMs: env.timerResolutionMs },
    timestamp: new Date().toISOString(),
    buildId: (globalThis as any).AETHER_BUILD_ID ?? null,
    commit: (globalThis as any).AETHER_COMMIT ?? null,
    results,
    // V3.1.3 structured LLM inference suite (Phase 7A-F)
    llmInference: llmInferenceV3113,
    // V3.1.3 certification gates (Phase 8-9)
    certification: {
      timingIntegrity: selfAudit.timingIntegrity ?? 'FAIL',
      throughputIntegrity: selfAudit.throughputIntegrity ?? 'FAIL',
      correctnessIntegrity: selfAudit.correctnessIntegrity ?? 'FAIL',
      llmSuiteComplete: selfAudit.llmSuiteComplete ?? 'FAIL',
      memorySuiteComplete: selfAudit.memorySuiteComplete ?? 'FAIL',
      overallCertified: selfAudit.overallCertified ?? false,
      certificationStatus: selfAudit.certificationStatus ?? 'NOT_CERTIFIED',
      reasons: selfAudit.certificationReasons ?? [],
    },
    // V3.1.3 self-audit (Phase 12)
    selfAudit: selfAudit.selfAuditChecks ?? null,
    // Legacy fields for backward compat
    llmReadinessScore: selfAudit.llmReadinessScore,
    llmReadinessStatus: selfAudit.llmReadinessStatus,
    llmReadinessReason: selfAudit.llmReadinessReason,
    // Crash-safety forensics (A–J interruption classification)
    deviceHealth: getDeviceHealth(),
    runtimeError: getRuntimeError(),
    interruption: getCheckpoint()?.interruption ?? null,
  };
  download('aether-v3-1-3-complete.json', JSON.stringify(payload, null, 2), 'application/json');
}

function exportV3Markdown(results: V3FullResult, env: V3Environment) {
const mkRows = (rows: V3Result[]) => rows.map(r =>
    `| ${r.operation} | ${r.shape} | ${r.repetitions} | ${fmtOp(r.blockMs)} | ${fmtOp(r.estimatedPerOperationMs)} | ${r.totalFLOPs > 0 ? r.totalFLOPs.toExponential(3) : r.totalBytes > 0 ? r.totalBytes + ' B' : '—'} | ${r.confidence} | ${fmtThroughput(r)} |`
  ).join('\n');
  const md = `# AETHER — PERFORMANCE V3.1 / LLM INFERENCE GATE

- Date: ${new Date().toISOString()}
- Device: ${env.device}
- Platform: ${env.platform}
- Adapter: ${env.adapterName} / ${env.adapterVendor} / ${env.adapterDevice}
- WebGPU: ${env.webgpu ? 'READY' : 'UNAVAILABLE'}
- maxBufferSize: ${env.maxBufferSize ? (env.maxBufferSize / 1073741824).toFixed(2) + ' GiB' : 'UNAVAILABLE'}
- Timer resolution: ${env.timerResolutionMs.toFixed(3)} ms
- Cross-origin isolated: ${env.crossOriginIsolated ? 'YES' : 'NO'}
- Secure context: ${env.secureContext ? 'YES' : 'NO'}

## Transformer — MatMul
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${mkRows(results.matmul)}

## Transformer — RMSNorm
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${mkRows(results.rmsnorm)}

## Transformer — Embedding
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${mkRows(results.embedding)}

## Attention
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${mkRows(results.attention)}

## MLP
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${mkRows(results.mlp)}

## Image Operations
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${mkRows(results.imageOps)}

## VAE Decoder
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${mkRows(results.vae)}

## Video — Temporal Mixing
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${mkRows(results.video)}

## Memory
| size | alloc |
|---|---|
${results.memory.map(m => `| ${m.sizeMB} MB | ${m.allocated ? 'OK' : 'FAIL'} |`).join('\n')}

## Sustained Performance (30s)
- operations: ${results.sustained.totalOps}
- average: ${results.sustained.avgMs.toFixed(3)} ms
- median: ${results.sustained.medianMs.toFixed(3)} ms
- p95: ${results.sustained.p95Ms.toFixed(3)} ms
- p99: ${results.sustained.p99Ms.toFixed(3)} ms
- first 5s: ${results.sustained.first5sMs.toFixed(3)} ms
- last 5s: ${results.sustained.last5sMs.toFixed(3)} ms
- drop: ${results.sustained.dropPct.toFixed(1)}%
- thermalTelemetry: UNAVAILABLE
- gpuUtilization: UNAVAILABLE

## AETHER Local AI Readiness Score (heuristic — not an official Apple rating)
- TENSOR_COMPUTE: ${results.readiness.tensorCompute.score}
- ATTENTION: ${results.readiness.attention.score}
- MLP: ${results.readiness.mlp.score}
- MEMORY: ${results.readiness.memory.score}
- IMAGE_PROCESSING: ${results.readiness.imageProcessing.score}
- VIDEO_PROCESSING: ${results.readiness.videoProcessing.score}
- SUSTAINED_PERFORMANCE: ${results.readiness.sustainedPerf.score}
- **LOCAL_AI_READINESS: ${results.readiness.overall} / 100**

## Local AI Capability Classification
- Transformer inference: ${results.feasibility.transformerInference}
- Image generation: ${results.feasibility.imageGeneration}
- VAE decoding: ${results.feasibility.vaeDecoding}
- Video latent processing: ${results.feasibility.videoLatent}
- Temporal attention: ${results.feasibility.temporalAttention}
- Long-context processing: ${results.feasibility.longContext}

## Limitations
- HOST_WALL_CLOCK_AMPLIFIED measures CPU submission + completion overhead, not raw GPU execution.
- Timer quantization (~1 ms) limits precision; per-op figures are ESTIMATED via amplification.
- Correctness for V3 perf benches is NOT re-verified per-run (TASK 7/19 separation); rely on the V1 correctness suite for math validation.
- thermal/gpuUtilization unavailable in browser.
- Adaptive amplification may mark tiny kernels UNMEASURABLE near timer resolution.
`;
  download('aether-v3-report.md', md, 'text/markdown');
}

// ─── Runner hook used by screen.ts button ────────────────────────────────

export async function runV3FromUI(mode: 'quick' | 'full', getDevice: () => GPUDevice, log: (msg: string, kind?: string) => void) {
  try {
    const device = getDevice();
    setTimerResolution(detectTimerResolution());
    const results = await (mode === 'quick' ? runV3Quick : runV3Full)((msg) => log(`V3: ${msg}`, 'info'));
    const env = await gatherEnv(device);
    renderV3(results, env, log);
  } catch (e) {
    log(`V3 ERROR: ${(e as Error).message}`, 'err');
  }
}

function detectTimerResolution(): number {
  let min = Infinity;
  for (let i = 0; i < 200; i++) {
    const a = performance.now();
    let b = performance.now();
    while (b === a) b = performance.now();
    const d = b - a;
    if (d > 0 && d < min) min = d;
  }
  return Number.isFinite(min) && min > 0 ? min : 1;
}

async function gatherEnv(device: GPUDevice): Promise<V3Environment> {
  let adapterName = 'UNAVAILABLE', vendor = 'UNAVAILABLE', chip = 'UNAVAILABLE';
  let maxBuf = null, maxWg = null;
  try {
    const info = device.adapterInfo ?? (device as any).adapterInfo;
    if (info) {
      adapterName = info.description || info.vendor || 'UNAVAILABLE';
      vendor = info.vendor || 'UNAVAILABLE';
      chip = info.device || info.architecture || 'UNAVAILABLE';
    }
    const limits = device.limits;
    maxBuf = limits?.maxBufferSize ?? null;
    maxWg = limits?.maxComputeWorkgroupsPerDimension ?? null;
  } catch {
    // keep UNAVAILABLE
  }
  const nav: any = navigator;
  const uaData = nav.userAgentData;
  return {
    adapterName, adapterVendor: vendor, adapterDevice: chip,
    maxBufferSize: maxBuf, maxWorkgroupsPerDim: maxWg,
    device: uaData?.platform ?? navigator.platform ?? 'UNAVAILABLE',
    platform: uaData?.platform ?? navigator.platform ?? 'UNAVAILABLE',
    userAgent: navigator.userAgent,
    webgpu: !!(nav.gpu),
    crossOriginIsolated: window.crossOriginIsolated,
    secureContext: window.isSecureContext,
    timerResolutionMs: getTimerResolution(),
  };
}

// ─── V3.1 LLM Inference Gate ───────────────────────────────────────────

function fmtBytes(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return bytes + ' B';
}

function fmtBytesShort(mb: number): string {
  if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GB';
  return mb + ' MB';
}

function llmSection(title: string, rows: V3Result[]): string {
  if (rows.length === 0) return '';
  return `<div class="v3-section">
    <div class="v3-section-title">${esc(title)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>block ms</th><th>est/op ms</th><th>total FLOPs</th><th>total bytes</th><th>throughput</th><th>conf</th><th>correct</th>
      </tr></thead>
      <tbody>
      ${rows.map(r => `<tr>
        <td>${esc(r.operation)}<br/><small style="color:var(--text-dim)">${esc(r.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${esc(r.shape)}</td>
        <td>${r.repetitions.toLocaleString()}</td>
        <td>${r.measurable ? r.blockMs.toFixed(2) : '—'}</td>
        <td>${r.measurable ? fmtOp(r.estimatedPerOperationMs) : '—'}</td>
        <td>${r.totalFLOPs > 0 ? r.totalFLOPs.toExponential(3) : '—'}</td>
        <td>${r.totalBytes > 0 ? (r.totalBytes / 1048576).toFixed(1) + ' MiB' : '—'}</td>
        <td>${fmtThroughput(r)}</td>
        <td>${confBadge(r.confidence)}</td>
        <td>${r.correctnessPassed ? '<span style="color:var(--green)">OK</span>' : '<span style="color:var(--red)">FAIL</span>'}</td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function renderBlockTable(blocks: TransformerBlockResult[]): string {
  if (blocks.length === 0) return '';
  return `<div class="v3-section">
    <div class="v3-section-title">SYNTHETIC TRANSFORMER BLOCK (NOT real model benchmarks)</div>
    <table class="perf-table">
      <thead><tr>
        <th>class</th><th>hidden</th><th>intermediate</th><th>layers</th><th>heads</th><th>kvHeads</th><th>params</th><th>FP16</th><th>INT8</th><th>INT4</th><th>block ms</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${blocks.map(b => `<tr>
        <td><b>${esc(b.config.name)}</b></td>
        <td>${b.config.hidden}</td>
        <td>${b.config.intermediate}</td>
        <td>${b.config.layers}</td>
        <td>${b.config.heads}</td>
        <td>${b.config.kvHeads}</td>
        <td>${(b.paramCount / 1e6).toFixed(1)}M</td>
        <td>${fmtBytesShort(b.fp16Bytes / (1024 * 1024))}</td>
        <td>${fmtBytesShort(b.int8Bytes / (1024 * 1024))}</td>
        <td>${fmtBytesShort(b.int4Bytes / (1024 * 1024))}</td>
        <td>${b.confidence !== 'UNMEASURABLE' ? b.blockLatencyMs.toFixed(3) + ' ms' : 'UNMEASURABLE'}</td>
        <td>${confBadge(b.confidence)}</td>
      </tr>`).join('')}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Architectural workload simulations — NOT claims that corresponding real models fit.</div>
  </div>`;
}

function renderTokenGenTable(estimates: TokenGenEstimate[]): string {
  if (estimates.length === 0) return '';
  return `<div class="v3-section">
    <div class="v3-section-title">TOKEN GENERATION SIMULATION (SYNTHETIC INFERENCE ESTIMATES)</div>
    <table class="perf-table">
      <thead><tr>
        <th>prompt</th><th>generate</th><th>prefill ms</th><th>first token ms</th><th>avg decode ms</th><th>tokens/sec</th><th>total ms</th>
      </tr></thead>
      <tbody>
      ${estimates.map(e => `<tr>
        <td>${e.promptTokens}</td>
        <td>${e.generateTokens}</td>
        <td>${e.prefillMs.toFixed(1)}</td>
        <td>${e.firstTokenMs.toFixed(3)}</td>
        <td>${e.avgDecodeMs.toFixed(3)}</td>
        <td>${e.tokensPerSec > 0 ? e.tokensPerSec.toFixed(1) : '—'}</td>
        <td>${e.totalMs.toFixed(1)}</td>
      </tr>`).join('')}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">SYNTHETIC estimates based on measured block latencies. Do NOT use as real model performance claims.</div>
  </div>`;
}

function renderMemBudgetTable(budget: MemBudgetResult[]): string {
  if (budget.length === 0) return '';
  return `<div class="v3-section">
    <div class="v3-section-title">MEMORY BUDGET (chunked allocation)</div>
    <table class="perf-table">
      <thead><tr>
        <th>target</th><th>allocated</th><th>success</th><th>buffers</th><th>chunk</th><th>alloc ms</th><th>write ms</th>
      </tr></thead>
      <tbody>
      ${budget.map(b => `<tr>
        <td>${b.targetMB} MB</td>
        <td>${b.totalAllocatedMB.toFixed(0)} MB</td>
        <td style="color:${b.success ? 'var(--green)' : 'var(--red)'}">${b.success ? 'OK' : 'FAIL'}</td>
        <td>${b.numBuffers}</td>
        <td>${b.chunkMB} MB</td>
        <td>${b.allocMs > 0 ? b.allocMs.toFixed(1) : '—'}</td>
        <td>${b.writeMs > 0 ? b.writeMs.toFixed(1) : '—'}</td>
      </tr>`).join('')}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">WebGPU allocation capability, NOT total system RAM.</div>
  </div>`;
}

function renderCertificationBanner(gate: LLMGateResult): string {
  const sa = buildSelfAudit(null, gate, getTimerResolution());
  const isCertified = sa.overallCertified;
  const color = isCertified ? 'var(--green)' : 'var(--red)';
  const gateBadge = (label: string, status: string) => {
    const c = status === 'PASS' ? 'var(--green)' : 'var(--red)';
    return `<b style="color:${c}">${status}</b> ${label}`;
  };
  return `<div style="padding:8px 10px;border:1px solid ${color};border-radius:6px;margin-bottom:12px;font-size:12px">
    <b style="color:${color}">SELF-AUDIT CERTIFICATION: ${sa.certification}</b>
    <span style="color:var(--text-dim)"> — ${gateBadge('TIMING', sa.timingIntegrity)} · ${gateBadge('THROUGHPUT', sa.throughputIntegrity)} · ${gateBadge('CORRECTNESS', sa.correctnessIntegrity)} · ${gateBadge('LLM SUITE', sa.llmSuiteComplete)} · ${gateBadge('MEMORY SUITE', sa.memorySuiteComplete)}</span>
    <div style="margin-top:4px;font-size:11px;color:var(--text-dim)">
      ${sa.llmSuiteComplete === 'PASS' ? '' : 'LLM suite incomplete — '}
      Normalization ${sa.normalization?.ok ? 'OK' : 'FAIL'} · Throughput ${sa.throughput?.ok ? 'OK' : 'FAIL'} · Timer-floor ${sa.timerLimitations?.timerFloorLimitedCount ?? 0} result(s)
    </div>
    ${(sa.certificationReasons?.length ?? 0) > 0
      ? `<ul style="margin:4px 0 0 18px;padding:0">${sa.certificationReasons!.map(r => `<li>${esc(r)}</li>`).join('')}</ul>`
      : ''}
  </div>`;
}

function renderLLMReadiness(ready: LLMGateResult['llmReadiness']): string {
  const g = _llmGateResults;
  const status = computeLLMReadinessStatus(
    ready,
    g?.quantizedMatmul.length ?? 1,
    g?.decodeAttention.length ?? 1,
    g?.transformerBlocks.length ?? 1,
    g?.tokenGeneration.length ?? 1,
    g?.memoryBudget.length ?? 1
  );
  const certColor = status.llmReadinessStatus === 'CERTIFIED' ? 'var(--green)' : 'var(--red)';
  return `<div class="v3-section">
    <div class="v3-section-title">AETHER LLM READINESS SCORE (heuristic)</div>
    <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">HEURISTIC — NOT A MODEL BENCHMARK</div>
    ${scoreBar('COMPUTE (INT8/INT4 matmul)', ready.computeScore)}
    ${scoreBar('MEMORY (budget allocation)', ready.memoryScore)}
    ${scoreBar('ATTENTION (full-sequence)', ready.attentionScore)}
    ${scoreBar('DECODE (KV-cache decode)', ready.decodeScore)}
    ${scoreBar('TRANSFORMER BLOCK', ready.transformerBlockScore)}
    ${scoreBar('SUSTAINED PERFORMANCE', ready.sustainedScore)}
    <div class="overall-row"><span>AETHER LLM READINESS</span><span>${ready.overall} / 100</span></div>
    <div style="font-size:12px;margin-top:6px">Status: <b style="color:${certColor}">${status.llmReadinessStatus}</b> ${status.llmReadinessStatus === 'NOT CERTIFIED' ? `— ${esc(status.reason)}` : ''}</div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
      Heuristic LLM readiness score — NOT an official Apple performance rating. Do NOT select a model automatically. Do NOT claim GREEN transformer inference from legacy MatMul/MLP tests alone.
    </div>
  </div>`;
}

export function renderLLMGate(results: LLMGateResult, env: V3Environment, log: (msg: string, kind?: string) => void) {
  const mount = document.getElementById('perf-v3-llm-results');
  if (!mount) return;
  mount.innerHTML = `
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER V3.1 — LLM INFERENCE GATE</span>
        <span class="badge badge-info">HARDWARE GATE</span>
      </div>

      ${renderCertificationBanner(results)}

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${esc(env.adapterName)}</b></div>
          <div>Vendor: <b>${esc(env.adapterVendor)}</b></div>
          <div>Platform: <b>${esc(env.platform)}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">TIMING</div>
          <div>Method: <b>HOST_WALL_CLOCK<br/>AMPLIFIED</b></div>
          <div>Timer: <b>${env.timerResolutionMs.toFixed(3)} ms</b></div>
        </div>
      </div>

      ${llmSection('INT8/INT4 QUANTIZED MATMUL', results.quantizedMatmul)}
      ${llmSection('KV-CACHE DECODE ATTENTION', results.decodeAttention)}
      ${renderBlockTable(results.transformerBlocks)}
      ${renderTokenGenTable(results.tokenGeneration)}
      ${renderMemBudgetTable(results.memoryBudget)}
      ${renderLLMReadiness(results.llmReadiness)}

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
        <button class="btn" id="btn-export-llm-json">EXPORT LLM JSON</button>
        <button class="btn btn-outline" id="btn-export-llm-report">EXPORT LLM REPORT</button>
      </div>
    </div>
  `;
  mount.querySelector('#btn-export-llm-json')?.addEventListener('click', () => exportLLMJson(results, env));
  mount.querySelector('#btn-export-llm-report')?.addEventListener('click', () => exportLLMMarkdown(results, env));
  log('V3.1 LLM Inference Gate complete', 'ok');
}

function exportLLMJson(results: LLMGateResult, env: V3Environment) {
  const selfAudit = buildSelfAudit(null, results, env.timerResolutionMs);
  const llmInferenceV3113 = buildLlmInferenceV3113(results);
  const payload = {
    benchmarkVersion: AETHER_BENCHMARK_VERSION,
    runtimeSchemaVersion: AETHER_RUNTIME_SCHEMA_VERSION,
    benchmarkEngine: AETHER_RUNTIME_ID,
    device: env,
    timestamp: new Date().toISOString(),
    buildId: (globalThis as any).AETHER_BUILD_ID ?? 'unknown',
    commit: (globalThis as any).AETHER_COMMIT ?? 'unknown',
    llmInference: llmInferenceV3113,
    certification: {
      timingIntegrity: selfAudit.timingIntegrity ?? 'FAIL',
      throughputIntegrity: selfAudit.throughputIntegrity ?? 'FAIL',
      correctnessIntegrity: selfAudit.correctnessIntegrity ?? 'FAIL',
      llmSuiteComplete: selfAudit.llmSuiteComplete ?? 'FAIL',
      memorySuiteComplete: selfAudit.memorySuiteComplete ?? 'FAIL',
      overallCertified: selfAudit.overallCertified ?? false,
      certificationStatus: selfAudit.certificationStatus ?? 'NOT_CERTIFIED',
      reasons: selfAudit.certificationReasons ?? [],
    },
    selfAudit: selfAudit.selfAuditChecks ?? null,
    note: 'WebGPU allocation capability, NOT total system RAM.',
    // Crash-safety forensics (A–J interruption classification)
    deviceHealth: getDeviceHealth(),
    runtimeError: getRuntimeError(),
    interruption: getCheckpoint()?.interruption ?? null,
  };
  // Post-serialization audit as required by Phase 14
  const serialized = JSON.stringify(payload, null, 2);
  const parsed = JSON.parse(serialized);
  const postAudit = runSelfAuditV3113(parsed.llmInference, env.timerResolutionMs);
  
  if (!postAudit.ok) {
    console.error('POST-EXPORT AUDIT FAILED', postAudit.failures);
  }

  download('aether-v3-1-3-llm-gate.json', serialized, 'application/json');
}

function exportLLMMarkdown(results: LLMGateResult, env: V3Environment) {
  const mkRows = (rows: V3Result[]) => rows.map(r =>
    `| ${r.operation} | ${r.shape} | ${r.repetitions} | ${fmtOp(r.blockMs)} | ${fmtOp(r.estimatedPerOperationMs)} | ${r.totalFLOPs > 0 ? r.totalFLOPs.toExponential(3) : r.totalBytes > 0 ? r.totalBytes + ' B' : '—'} | ${r.confidence} | ${fmtThroughput(r)} | ${r.correctnessPassed ? 'OK' : 'FAIL'} |`
  ).join('\n');
  const md = `# AETHER V3.1 — LLM INFERENCE GATE

- Date: ${new Date().toISOString()}
- Device: ${env.device}
- Adapter: ${env.adapterName} / ${env.adapterVendor}
- Timer: ${env.timerResolutionMs.toFixed(3)} ms

## INT8/INT4 Quantized MatMul
| operation | shape | reps | total | est/op | work | conf | throughput | correct |
|---|---|---|---|---|---|---|---|---|
${mkRows(results.quantizedMatmul)}

## KV-Cache Decode Attention
| operation | shape | reps | total | est/op | work | conf | throughput | correct |
|---|---|---|---|---|---|---|---|---|
${mkRows(results.decodeAttention)}

## Synthetic Transformer Block (NOT real model benchmarks)
| class | hidden | intermediate | layers | heads | kvHeads | params | FP16 | INT8 | INT4 | block ms | conf |
|---|---|---|---|---|---|---|---|---|---|---|---|
${results.transformerBlocks.map(b => `| ${b.config.name} | ${b.config.hidden} | ${b.config.intermediate} | ${b.config.layers} | ${b.config.heads} | ${b.config.kvHeads} | ${(b.paramCount / 1e6).toFixed(1)}M | ${fmtBytesShort(b.fp16Bytes / (1024 * 1024))} | ${fmtBytesShort(b.int8Bytes / (1024 * 1024))} | ${fmtBytesShort(b.int4Bytes / (1024 * 1024))} | ${b.blockLatencyMs.toFixed(3)} | ${b.confidence} |`).join('\n')}

## Token Generation Simulation (SYNTHETIC INFERENCE ESTIMATES)
| prompt | generate | prefill ms | first token ms | avg decode ms | tokens/sec | total ms |
|---|---|---|---|---|---|---|
${results.tokenGeneration.map(e => `| ${e.promptTokens} | ${e.generateTokens} | ${e.prefillMs.toFixed(1)} | ${e.firstTokenMs.toFixed(3)} | ${e.avgDecodeMs.toFixed(3)} | ${e.tokensPerSec > 0 ? e.tokensPerSec.toFixed(1) : '—'} | ${e.totalMs.toFixed(1)} |`).join('\n')}

## Memory Budget
| target | allocated | success | buffers | chunk | alloc ms | write ms |
|---|---|---|---|---|---|---|
${results.memoryBudget.map(b => `| ${b.targetMB} MB | ${b.totalAllocatedMB.toFixed(0)} MB | ${b.success ? 'OK' : 'FAIL'} | ${b.numBuffers} | ${b.chunkMB} MB | ${b.allocMs.toFixed(1)} | ${b.writeMs.toFixed(1)} |`).join('\n')}

WebGPU allocation capability, NOT total system RAM.

## AETHER LLM Readiness Score (heuristic)
- COMPUTE: ${results.llmReadiness.computeScore}
- MEMORY: ${results.llmReadiness.memoryScore}
- ATTENTION: ${results.llmReadiness.attentionScore}
- DECODE: ${results.llmReadiness.decodeScore}
- TRANSFORMER_BLOCK: ${results.llmReadiness.transformerBlockScore}
- SUSTAINED: ${results.llmReadiness.sustainedScore}
- **AETHER_LLM_READINESS: ${results.llmReadiness.overall} / 100**

## Limitations
- INT8/INT4 matmul uses weight-only quantization with sign-extended unpacking in WGSL.
- KV-cache decode attention uses two-pass softmax (max + exp) per thread.
- Synthetic transformer block chains 10 compute passes per forward; actual models have KV-cache optimizations.
- Token generation is SYNTHETIC — estimates based on measured block latencies, NOT real model inference.
- Memory budget measures WebGPU buffer allocation capability, NOT total device RAM.
- thermal/gpuUtilization unavailable in browser.
- Heuristic score — NOT an official Apple performance rating.
`;
  download('aether-v3-1-llm-report.md', md, 'text/markdown');
}

// ─── Runner hook used by screen.ts V3.1 button ──────────────────────────

function buildResumeContextFromCheckpoint(includeCompletedAll: boolean): ResumeContext {
  const cp = getCheckpoint();
  if (!cp) return { completed: [], partial: {} };
  if (!includeCompletedAll || cp.status !== 'INTERRUPTED') return { completed: [], partial: {} };
  return { completed: cp.completedCategories, partial: cp.partialResults };
}

export async function runLLMGateFromUI(mode: 'quick' | 'full', getDevice: () => GPUDevice, log: (msg: string, kind?: string) => void, opts?: { resume?: ResumeContext }) {
  const resume = opts?.resume ?? null;
  try {
    const device = getDevice();
    setTimerResolution(detectTimerResolution());
    const { runLLMInferenceGate, runLLMInferenceGateQuick } = await import('./perf-v3-llm.ts');
    log('AETHER V3.1.3 RUNTIME ACTIVE', 'info');
    log(`buildId: ${(globalThis as any).AETHER_BUILD_ID ?? 'unknown'}`, 'info');
    log('llmSuite: ENABLED', 'info');
    log('memorySuite: ENABLED', 'info');
    log('normalizedResults: ENABLED', 'info');
    log('postExportAudit: ENABLED', 'info');
    if (resume) log(`crash-safety: RESUMING interrupted run (${resume.completed.length} categories cached)`, 'info');

    // Crash-safety lifecycle
    beginBenchmark('V3.1', mode, {
      resume: resume ? { completed: resume.completed, partial: resume.partial } : undefined,
    }, (globalThis as any).AETHER_BUILD_ID ?? null);
    const stopDeviceMonitor = monitorDeviceLost(device);
    const stopTicker = startHeartbeatTicker();
    const runner = mode === 'quick' ? runLLMInferenceGateQuick : runLLMInferenceGate;

    try {
      const results = await runner(
        (msg) => log(`V3.1: ${msg}`, 'info'),
        resume ?? undefined,
      );
      completeBenchmark();
      stopTicker();
      stopDeviceMonitor();
      clearRuntimeError();
      _llmGateResults = results;
      const { validateLLMGateIntegrity } = await import('./results-v3.ts');
      const gateAudit = validateLLMGateIntegrity(results);
      if (!gateAudit.ok) {
        log(`V3.1 AUDIT FAILURES: ${gateAudit.issues.length}`, 'err');
        for (const i of gateAudit.issues) log(`  - ${i.operation} ${i.workload}: ${i.detail}`, 'err');
      } else {
        log('V3.1 audit OK: normalization + throughput verified for LLM gate results.', 'ok');
      }
      const env = await gatherEnv(device);
      renderLLMGate(results, env, log);
    } catch (e) {
      stopTicker();
      stopDeviceMonitor();
      const err = e as Error;
      const msg = `${err.message} ${err.stack ?? ''}`.toLowerCase();
      if (msg.includes('validation')) {
        interrupt('GPU_VALIDATION_ERROR', err.message, err);
      } else if (msg.includes('limit') && (msg.includes('alloc') || msg.includes('buffer') || msg.includes('memory'))) {
        interrupt('RESOURCE_LIMIT', err.message, err);
      } else {
        interrupt('JAVASCRIPT_EXCEPTION', err.message, err);
      }
      log(`V3.1 ERROR: ${err.message}`, 'err');
      log('crash-safety: benchmark interrupted (A–J), certification FAILED, partial results preserved. RELOAD the page and press RESUME.', 'warn');
    }
  } catch (e) {
    log(`V3.1 ERROR: ${(e as Error).message}`, 'err');
  }
}

export async function runLLMDiagnosticFromUI(getDevice: () => GPUDevice, log: (msg: string, kind?: string) => void) {
  try {
    const device = getDevice();
    setTimerResolution(detectTimerResolution());
    const { runLLMDiagnosticStaged } = await import('./perf-v3-llm.ts');
    log('AETHER V3.1.3 STAGED DIAGNOSTIC ACTIVE', 'info');
    beginBenchmark('V3.1', 'quick', undefined, (globalThis as any).AETHER_BUILD_ID ?? null);
    const stopDeviceMonitor = monitorDeviceLost(device);
    const stopTicker = startHeartbeatTicker();
    const env = await gatherEnv(device);
    const stages = await runLLMDiagnosticStaged((msg) => log(`DIAG: ${msg}`, 'info'));
    stopTicker();
    stopDeviceMonitor();
    completeBenchmark();
    for (const s of stages) {
      const state = s.completed ? (s.error ? 'ERROR' : 'DONE') : 'SKIPPED';
      log(`DIAG ${state}: ${s.label}${s.error ? ` — ${s.error}` : ''} (${Math.round(s.durationMs)}ms)`, s.completed && !s.error ? 'ok' : 'err');
    }
    log(`DIAG done: ${stages.filter(s => s.completed).length}/${stages.length} stages completed`, 'ok');
    log(`DIAG env: ${env.device} | maxBufferSize: ${env.maxBufferSize ? Math.round(env.maxBufferSize / 1048576) + ' MB' : 'UNAVAILABLE'} | timer: ${env.timerResolutionMs.toFixed(3)} ms`, 'info');
    log('crash-safety: diagnostic complete. Export the LLM JSON to capture the full staged report.', 'info');
  } catch (e) {
    log(`DIAG ERROR: ${(e as Error).message}`, 'err');
  }
}


