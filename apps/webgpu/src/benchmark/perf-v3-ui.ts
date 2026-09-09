// AETHER GPU Benchmark V3 — UI Rendering + Export
//
// Renders the V3 result into a premium technical dashboard and provides
// JSON + Markdown report export. Kept separate from screen.ts to stay clean.

import { runV3Full, runV3Quick, type V3FullResult } from './perf-v3.ts';
import {
  type V3Result, type AETHERReadiness, type FeasibilityReport,
  getTimerResolution, setTimerResolution,
} from './results-v3.ts';

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

function esc(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

function confBadge(c: string): string {
  const color = c === 'HIGH' ? 'var(--green)' : c === 'MEDIUM' ? 'var(--yellow)' : c === 'LOW' ? 'var(--red)' : 'var(--text-dim)';
  return `<span style="color:${color};font-weight:600">${c}</span>`;
}

function fmtOp(ms: number): string {
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
        <th>operation</th><th>shape</th><th>reps</th><th>total</th><th>est/op</th><th>median</th><th>p95</th><th>throughput</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${rows.map(r => `<tr>
        <td>${esc(r.operation)}<br/><small style="color:var(--text-dim)">${esc(r.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${esc(r.shape)}</td>
        <td>${r.repetitions.toLocaleString()}</td>
        <td>${r.measurable ? (r.totalMs > 0 ? r.totalMs.toFixed(2) : '0.00') : '—'}</td>
        <td>${confBadge(r.confidence)} ${fmtOp(r.estimatedPerOperationMs)}</td>
        <td>${fmtOp(r.medianMs)}</td>
        <td>${fmtOp(r.p95Ms)}</td>
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

export function renderV3(results: V3FullResult, env: V3Environment, log: (msg: string, kind?: string) => void) {
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
            <tr><td>Transformer inference</td><td>${feasBadge(feas.transformerInference)}</td></tr>
            <tr><td>Image generation</td><td>${feasBadge(feas.imageGeneration)}</td></tr>
            <tr><td>VAE decoding</td><td>${feasBadge(feas.vaeDecoding)}</td></tr>
            <tr><td>Video latent processing</td><td>${feasBadge(feas.videoLatent)}</td></tr>
            <tr><td>Temporal attention</td><td>${feasBadge(feas.temporalAttention)}</td></tr>
            <tr><td>Long-context processing</td><td>${feasBadge(feas.longContext)}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
        <button class="btn" id="btn-export-v3-json">EXPORT V3 JSON</button>
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
  const payload = {
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
  };
  download('aether-v3.json', JSON.stringify(payload, null, 2), 'application/json');
}

function exportV3Markdown(results: V3FullResult, env: V3Environment) {
  const mkRows = (rows: V3Result[]) => rows.map(r =>
    `| ${r.operation} | ${r.shape} | ${r.repetitions} | ${fmtOp(r.totalMs)} | ${fmtOp(r.estimatedPerOperationMs)} | ${r.confidence} | ${fmtThroughput(r)} |`
  ).join('\n');
  const md = `# AETHER — PERFORMANCE V3 / MODEL-SHAPED GPU BENCHMARK

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


