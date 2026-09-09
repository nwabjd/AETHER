// AETHER GPU Benchmark — Diagnostic Screen
// Isolated diagnostics only: GPU SANITY, STANDALONE MATMUL, HARNESS MATMUL.
// Performance benchmarks are disabled until correctness is independently proven.
//
// Each diagnostic renders its own PASS/FAIL card with stage, error type and
// error message, and the footer shows build ID + commit + build time so a
// stale Safari cache is immediately obvious.

import { initBenchmark, getDevice, getDeviceLostInfo, hasDeviceLost, createStorageBuffer, type DeviceDiagnostics } from './engine';
import {
  runAllTests,
  testMatmul,
  testAttention,
  installUncapturedCollector,
  drainUncaptured,
  type TestResult,
  type KernelCaseResult,
  type SuiteReport,
  type SuiteReportEntry,
} from './tests';
import { runGpuSanity } from './sanity';
import { runStandaloneMatmul } from './standalone-matmul';
import { runSharedDeviceDirectMatmul, runMinimalHarnessMatmul } from './harness-matmul';
import { ReadbackManager } from './readback.ts';
import { AETHER_BUILD_ID, AETHER_COMMIT, AETHER_BUILD_TIME } from '../build-info';
import { runPerfSuite, isSuiteRunning, type PerfMode } from './perf-suite';
import {
  runPhaseSoftmaxCorrectness,
  type PhaseSoftmaxCase,
} from './perf-kernels';
import {
  runIsolatedQktOnly,
  runFullIsolatedPhase,
  summarizeReports,
  type IsolatedPhaseReport,
} from './phase-softmax-isolated';
import {
  interpretResults,
  buildIphoneBaseline,
  type PerfReport,
  type PerfSample,
  type OverheadSample,
  type CommandBatchingResult,
  type SustainedResult,
} from './perf-report';
import {
  runPhaseBenchmarkSeries,
  runCriticalIsolation,
  harnessDebugReport,
} from './attention-harness';
import { AmplifiedTimingManager, buildV2ResultRow, type V2ResultRow, fmtPerDispatch, fmtThroughput } from './amplified-timing';
import {
  runHarnessRegression,
  formatHarnessRegression,
} from './benchmark-harness-regression';
import { createMatmulUniform, createVecAddUniform, createSoftmaxUniform, createRMSNormUniform, createAttentionUniform, createConv2DUniform, logAttentionUniformDiagnostic } from './uniforms';
import { cpuMatmul, cpuVecAdd, cpuSoftmax, cpuRMSNorm, cpuAttention, cpuConv2D } from './cpu-refs';
import { fillDeterministic } from './perf-kernels';

let _container: HTMLElement | null = null;
let _running = false;
let _listenersInstalled = false;
let _deviceDiag: DeviceDiagnostics | null = null;
let _perfLocked = localStorage.getItem('aether.kernels-passed') !== '1';
let _sustainedArmed = localStorage.getItem('aether.sustained.armed') === '1';
let _lastPerfReport: PerfReport | null = null;

// CORRECTNESS stays locked until these all pass.
const _gateStatus = { sanity: false, standaloneMatmul: false, directMatmul: false, harnessMatmul: false };

function gatesPassed(): boolean {
  return _gateStatus.sanity && _gateStatus.standaloneMatmul && _gateStatus.directMatmul && _gateStatus.harnessMatmul;
}

function updateCorrectnessButton() {
  const btn = _container?.querySelector('#btn-correctness') as HTMLButtonElement | null;
  if (!btn) return;
  const ready = gatesPassed();
  btn.disabled = !ready;
  btn.textContent = ready ? 'CORRECTNESS' : 'CORRECTNESS (LOCKED)';
}

function log(msg: string, cls: string = '') {
  if (!_container) return;
  const logEl = _container.querySelector('#bench-log') as HTMLElement;
  if (!logEl) return;
  const entry = document.createElement('div');
  entry.className = `log-entry ${cls}`;
  entry.textContent = msg;
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function stopDeviceLost() {
  const info = getDeviceLostInfo();
  log(`WEBGPU DEVICE LOST — reason: ${info.reason ?? 'unknown'} — message: ${info.message ?? ''}`, 'err');
  log('Remaining tests stopped.', 'err');
}

// Install uncapturederror + device.lost listeners once (engine device).
function installListeners() {
  if (_listenersInstalled) return;
  try {
    const device = getDevice();
    device.addEventListener('uncapturederror', (ev) => {
      const err = (ev as unknown as { error?: GPUError }).error;
      log(`UNCAPTURED GPU ERROR: ${err?.message ?? 'unknown'}`, 'err');
    });
    device.lost.then(info => {
      log(`WEBGPU DEVICE LOST — reason: ${info.reason} — message: ${info.message}`, 'err');
    });
    _listenersInstalled = true;
  } catch {
    // Not initialized yet; will retry after initBenchmark().
  }
}

interface ResultCardSpec {
  title: string;
  pass: boolean;
  stage: string;
  errorType: string | null;
  errorMessage: string | null;
  notes: string[];
}

function renderResultCard(cardId: string, spec: ResultCardSpec) {
  const mount = _container?.querySelector(`#${cardId}`) as HTMLElement | null;
  if (!mount) return;
  const lines = [
    spec.stage ? `<div>stage: <b style="color:var(--text)">${esc(spec.stage)}</b></div>` : '',
    spec.pass
      ? ''
      : spec.errorType
        ? `<div>error type: <b style="color:var(--red)">${esc(spec.errorType)}</b></div>`
        : '',
    spec.pass
      ? ''
      : spec.errorMessage
        ? `<div>error message: <b style="color:var(--red)">${esc(spec.errorMessage)}</b></div>`
        : '',
    ...spec.notes.map(n => `<div style="color:var(--text-dim)">${esc(n)}</div>`),
  ].join('');
  mount.innerHTML = `
    <div class="card" style="border-color:${spec.pass ? 'var(--green)' : 'var(--red)'};margin-top:12px">
      <div class="card-header">
        <span class="card-title">${esc(spec.title)}</span>
        <span class="badge ${spec.pass ? 'badge-pass' : 'badge-fail'}">${spec.pass ? 'PASS' : 'FAIL'}</span>
      </div>
      <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${lines || '<div style="color:var(--text-dim)">—</div>'}</div>
    </div>
  `;
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function standaloneNotes(result: { expected: string; actual: string | null; scopeErrors: Array<{ type: string; message: string }>; uncaptured: Array<{ type: string; message: string }>; lost: { reason: string | null; message: string | null }; exception: string | null }): string[] {
  const notes: string[] = [];
  for (const e of result.scopeErrors) notes.push(`GPU error scope [${e.type}]: ${e.message}`);
  for (const e of result.uncaptured) notes.push(`uncaptured GPU error [${e.type}]: ${e.message}`);
  if (result.lost.reason) notes.push(`device lost — reason: ${result.lost.reason} — message: ${result.lost.message ?? ''}`);
  notes.push(`expected: ${result.expected}`);
  if (result.actual !== null) notes.push(`actual: ${result.actual}`);
  if (result.exception) notes.push(`exception: ${result.exception}`);
  return notes;
}

// ─── AETHER KERNEL VALIDATION panel ───

function caseChip(c: KernelCaseResult): string {
  const style = c.pass
    ? 'display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--green);color:var(--green)'
    : 'display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--red);color:var(--red)';
  const title = c.pass
    ? `${c.config} — complete`
    : `${c.config} — stage: ${c.stage} · ${c.errorType ?? ''} · ${c.errorMessage ?? ''}`;
  return `<span style="${style}" title="${esc(title)}">${esc(c.config)} ${c.pass ? '✓' : '✗'}</span>`;
}

function caseFailureLines(c: KernelCaseResult): string[] {
  const lines: string[] = [];
  lines.push(`stage: ${esc(c.stage)} · error type: <b style="color:var(--red)">${esc(c.errorType ?? 'unknown')}</b>`);
  if (c.errorMessage) lines.push(`error: ${esc(c.errorMessage)}`);
  if (c.nonFiniteIndex >= 0) lines.push(`non-finite output at index ${c.nonFiniteIndex}`);
  if (c.errorIndex >= 0 && c.cpuValue !== null && c.gpuValue !== null) {
    lines.push(`largest error @ ${c.errorIndex}: cpu=${c.cpuValue.toExponential(4)} gpu=${c.gpuValue.toExponential(4)}`);
  }
  if (c.expectedRange) lines.push(`expected range [${c.expectedRange[0].toExponential(3)}, ${c.expectedRange[1].toExponential(3)}]`);
  if (c.actualRange) lines.push(`actual range [${c.actualRange[0].toExponential(3)}, ${c.actualRange[1].toExponential(3)}]`);
  return lines.map((x) => `<div style="color:var(--red)">${x}</div>`);
}

function renderKernelValidation(results: TestResult[]) {
  const mount = _container?.querySelector('#validation-panel') as HTMLElement | null;
  if (!mount) return;
  const allPass = results.length === 6 && results.every((r) => r.pass);
  const cards = results.map((r) => {
    const failLines = r.cases.filter((c) => !c.pass).flatMap(caseFailureLines);
    const status = r.pass
      ? 'complete'
      : r.details.includes('ABORTED')
        ? 'aborted (device lost)'
        : r.cases.find((c) => !c.pass)?.stage ?? 'failed';
    return `
      <div class="card" style="border-color:${r.pass ? 'var(--green)' : 'var(--red)'};margin-top:10px">
        <div class="card-header">
          <span class="card-title">${esc(r.name.toUpperCase())}</span>
          <span class="badge ${r.pass ? 'badge-pass' : 'badge-fail'}">${r.pass ? 'PASS' : 'FAIL'}</span>
        </div>
        <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:4px;word-break:break-all">
          <div>${r.cases.map(caseChip).join('') || '<span style="color:var(--text-dim)">not run</span>'}</div>
          <div>max error: <b>${r.maxError >= 0 ? r.maxError.toExponential(2) : '—'}</b></div>
          <div>execution status: <b>${esc(status)}</b></div>
          ${failLines}
        </div>
      </div>`;
  }).join('');
  mount.innerHTML = `
    <h3 style="margin-top:20px">AETHER KERNEL VALIDATION</h3>
    <div class="card" style="border-color:${allPass ? 'var(--green)' : 'var(--red)'};margin-top:4px">
      <div class="card-header">
        <span class="card-title">All kernels</span>
        <span class="badge ${allPass ? 'badge-pass' : 'badge-fail'}">${allPass ? 'ALL PASS' : 'FAILURE(S)'}</span>
      </div>
    </div>
    ${cards}
  `;
}

// ─── Correctness report (TASK 14): local save + JSON export ───

function reportEntry(r: TestResult | undefined): SuiteReportEntry {
  const t = r ?? { name: '?', pass: false, maxError: -1, details: 'not run', cases: [] as KernelCaseResult[] };
  return { pass: t.pass, maxError: t.maxError, cases: t.cases };
}

function buildReport(results: TestResult[]): SuiteReport | null {
  if (!_deviceDiag || results.length === 0) return null;
  return {
    device: {
      webgpuAvailable: _deviceDiag.webgpuAvailable,
      adapterName: _deviceDiag.adapterName,
      adapterVendor: _deviceDiag.adapterVendor,
      adapterDevice: _deviceDiag.adapterDevice,
      fallbackAdapter: _deviceDiag.isFallbackAdapter,
    },
    build: { id: AETHER_BUILD_ID, commit: AETHER_COMMIT ?? null, time: AETHER_BUILD_TIME ?? null },
    timestamp: new Date().toISOString(),
    uncapturedErrors: drainUncaptured(),
    tests: {
      vectorAdd: reportEntry(results[0]),
      matmul: reportEntry(results[1]),
      conv2d: reportEntry(results[2]),
      softmax: reportEntry(results[3]),
      rmsNorm: reportEntry(results[4]),
      attention: reportEntry(results[5]),
    },
    allPass: results.length === 6 && results.every((r) => r.pass),
  };
}

function saveReportToStorage(report: SuiteReport) {
  try {
    localStorage.setItem('aether.correctness', JSON.stringify(report));
  } catch {
    // Storage unavailable (private mode) — export still works in-memory.
  }
}

function exportReportJson(report: SuiteReport) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aether-correctness-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function renderReportPanel(report: SuiteReport) {
  const mount = _container?.querySelector('#report-panel') as HTMLElement | null;
  if (!mount) return;
  mount.innerHTML = `
    <div class="card" style="border-color:${report.allPass ? 'var(--green)' : 'var(--red)'};margin-top:12px">
      <div class="card-header">
        <span class="card-title">Correctness Report</span>
        <span class="badge ${report.allPass ? 'badge-pass' : 'badge-fail'}">${report.allPass ? 'VALID' : 'INVALID'}</span>
      </div>
      <div class="btn-row" style="margin-top:10px">
        <button class="btn" id="btn-export-json">EXPORT JSON</button>
        <button class="btn btn-outline" id="btn-reload">RELOAD</button>
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
        device: ${esc(report.device.adapterName)} · ${esc(report.device.adapterVendor)} · saved to localStorage
      </div>
    </div>
  `;
  mount.querySelector('#btn-export-json')?.addEventListener('click', () => exportReportJson(report));
  mount.querySelector('#btn-reload')?.addEventListener('click', () => location.reload());
}

// GPU SANITY — fully standalone (own adapter/device).
async function runGpuSanityHandler() {
  if (_running) return;
  _running = true;
  try {
    log('═══ GPU SANITY (standalone) ═══', 'info');
    const r = await runGpuSanity();
    _gateStatus.sanity = r.pass;
    updateCorrectnessButton();
    renderResultCard('res-sanity', {
      title: 'GPU SANITY',
      pass: r.pass,
      stage: r.stage || 'complete',
      errorType: r.errorType,
      errorMessage: r.errorMessage,
      notes: standaloneNotes(r),
    });
    log(`GPU SANITY TEST: ${r.pass ? 'PASS' : 'FAIL'}`, r.pass ? 'ok' : 'err');
    if (r.errorType) log(`  error type: ${r.errorType}`, 'err');
    if (r.errorMessage) log(`  error message: ${r.errorMessage}`, 'err');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
  } finally {
    _running = false;
  }
}

// STANDALONE MATMUL — fully standalone (own adapter/device).
async function runStandaloneMatmulHandler() {
  if (_running) return;
  _running = true;
  try {
    log('═══ STANDALONE MATMUL (64×64) ═══', 'info');
    const r = await runStandaloneMatmul();
    _gateStatus.standaloneMatmul = r.pass;
    updateCorrectnessButton();
    renderResultCard('res-standalone', {
      title: 'STANDALONE MATMUL',
      pass: r.pass,
      stage: r.stage || 'complete',
      errorType: r.errorType,
      errorMessage: r.errorMessage,
      notes: standaloneNotes(r),
    });
    log(`STANDALONE MATMUL: ${r.pass ? 'PASS' : 'FAIL'}`, r.pass ? 'ok' : 'err');
    if (r.errorType) log(`  error type: ${r.errorType}`, 'err');
    if (r.errorMessage) log(`  error message: ${r.errorMessage}`, 'err');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
  } finally {
    _running = false;
  }
}

// SHARED-DEVICE DIRECT MATMUL — engine device, inline flow (no runGpuTest).
async function runSharedDeviceDirectMatmulHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    log('═══ SHARED-DEVICE DIRECT MATMUL (engine device, inline) ═══', 'info');
    const r = await runSharedDeviceDirectMatmul();
    _gateStatus.directMatmul = r.pass;
    updateCorrectnessButton();
    renderResultCard('res-direct', {
      title: r.name,
      pass: r.pass,
      stage: r.stage || 'complete',
      errorType: r.errorType,
      errorMessage: r.errorMessage,
      notes: [
        `execution device id: ${r.executionDeviceId}`,
        `pipeline device id: ${r.pipelineDeviceId ?? 'unknown'}`,
        `bind group device id: ${r.bindGroupDeviceId ?? 'unknown'}`,
        `device mismatch: ${r.mismatch ? 'YES' : 'NO'}`,
        `max error: ${r.maxError !== null ? r.maxError.toExponential(2) : '—'}`,
      ],
    });
    log(`SHARED-DEVICE DIRECT MATMUL: ${r.pass ? 'PASS' : 'FAIL'}`, r.pass ? 'ok' : 'err');
    if (r.errorType) log(`  error type: ${r.errorType}`, 'err');
    if (r.errorMessage) log(`  error message: ${r.errorMessage}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

// MINIMAL HARNESS MATMUL — engine device, inline 64×64 / 128×128, no
// runGpuTest, no runWithScope. Isolates the harness failure to the execution
// path so the working standalone flow is mirrored byte-for-byte.
async function runMinimalHarnessHandler(size: 64 | 128, cardId: string) {
  if (_running) return;
  _running = true;
  try {
    const diag = await initBenchmark();
    _deviceDiag = diag;
    installListeners();
    log(`═══ MINIMAL HARNESS MATMUL ${size}×${size} (getDevice, inline, no runGpuTest) ═══`, 'info');
    const r = await runMinimalHarnessMatmul(size);
    const deviceLabel = diag ? `${diag.adapterName}${diag.adapterVendor ? ` / ${diag.adapterVendor}` : ''}` : 'unknown';
    const notes: string[] = [
      `Device: ${deviceLabel}`,
      `Pipeline: ${r.stageResults.pipeline ? 'PASS' : 'FAIL'}`,
      `Bind Group: ${r.stageResults['bind-group'] ? 'PASS' : 'FAIL'}`,
      `Dispatch: ${r.stageResults.dispatch ? 'PASS' : 'FAIL'}`,
      `Submission: ${r.stageResults.submission ? 'PASS' : 'FAIL'}`,
      `Readback: ${r.stageResults.readback ? 'PASS' : 'FAIL'}`,
      `Validation: ${r.stageResults.validation ? 'PASS' : 'FAIL'}`,
      `Expected: ${r.expected}`,
      `Actual range: [${r.actualMin}, ${r.actualMax}]`,
      `Max error: ${r.maxError !== null ? r.maxError.toExponential(2) : '—'}`,
      `Non-finite values: ${r.nonFinite}`,
      `GPU error: ${r.gpuError ?? 'none'}`,
      `Uncaptured error: ${r.uncaptured.length ? r.uncaptured.join(' | ') : 'none'}`,
      `Shader compilation: ${r.compilationMessages.length ? r.compilationMessages.join(' | ') : 'none'}`,
      `expected first 16: ${Array(16).fill(r.expected).join(', ')}`,
      `actual first 16: ${r.first16.length ? r.first16.slice(0, 16).join(', ') : '—'}`,
    ];
    renderResultCard(cardId, {
      title: `MINIMAL HARNESS MATMUL ${size}×${size}`,
      pass: r.pass,
      stage: r.stage || 'complete',
      errorType: r.errorType,
      errorMessage: r.errorMessage,
      notes,
    });
    log(`MINIMAL HARNESS MATMUL ${size}×${size}: ${r.pass ? 'PASS' : 'FAIL'}`, r.pass ? 'ok' : 'err');
    if (r.errorType) log(`  error type: ${r.errorType}`, 'err');
    if (r.errorMessage) log(`  error message: ${r.errorMessage}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

// ─── READBACK ENGINE DIAGNOSTICS & TESTS (TASK 13, 14, 20) ───────────────────

function updateReadbackEngineCard() {
  const container = document.getElementById('res-readback-engine');
  if (!container) return;
  const mgr = ReadbackManager.getInstance();
  const diag = mgr.getDiagnostics(hasDeviceLost());
  container.innerHTML = `
    <div class="card" style="border-color:var(--border);margin-top:12px">
      <div class="card-header">
        <span class="card-title">READBACK ENGINE</span>
        <span class="badge ${diag.lastStatus === 'PASS' ? 'badge-ok' : diag.lastStatus === 'FAIL' ? 'badge-err' : 'badge-info'}">${diag.lastStatus}</span>
      </div>
      <div style="font-size:12px;font-family:var(--mono);color:var(--text-dim);margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px">
        <div>Staging buffer: <b style="color:var(--text)">${diag.stagingSize} B</b></div>
        <div>Mapped: <b style="color:var(--text)">${diag.isMapped ? 'YES' : 'NO'}</b></div>
        <div>Pending readback: <b style="color:var(--text)">${diag.isPending ? 'YES' : 'NO'}</b></div>
        <div>Queue depth: <b style="color:var(--text)">${diag.queueDepth}</b></div>
        <div>Last mapAsync: <b style="color:var(--text)">${diag.lastStatus}</b></div>
        <div>Device lost: <b style="color:var(--text)">${diag.deviceLost ? 'YES' : 'NO'}</b></div>
      </div>
      ${diag.lastError ? `<div style="font-size:11px;font-family:var(--mono);color:var(--err);margin-top:6px">Last error: ${diag.lastError}</div>` : ''}
    </div>
  `;
}

async function runReadbackTestHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    log('═══ RUN READBACK TEST (4 B → 1 MB) ═══', 'info');
    const device = getDevice();
    const sizes = [
      { name: '4 B', bytes: 4 },
      { name: '16 B', bytes: 16 },
      { name: '64 B', bytes: 64 },
      { name: '1 KB', bytes: 1024 },
      { name: '64 KB', bytes: 65536 },
      { name: '256 KB', bytes: 262144 },
      { name: '1 MB', bytes: 1048576 },
    ];
    const results: Array<{ name: string; pass: boolean; err?: string }> = [];

    for (const { name, bytes } of sizes) {
      try {
        const fill = new Float32Array(bytes / 4).fill(123.0);
        const buf = createStorageBuffer(bytes, fill);
        const read = await ReadbackManager.getInstance().copyAndRead(device, buf, bytes, `Test_${name}`);
        buf.destroy();

        let pass = read.length === bytes / 4;
        if (pass && read.length > 0) {
          pass = Math.abs(read[0] - 123.0) < 1e-3;
        }
        results.push({ name, pass });
        log(`  ${name.padEnd(8)}: ${pass ? 'PASS' : 'FAIL'}`, pass ? 'ok' : 'err');
      } catch (e) {
        const errMsg = (e as Error).message;
        results.push({ name, pass: false, err: errMsg });
        log(`  ${name.padEnd(8)}: FAIL — ${errMsg}`, 'err');
        break; // stop on first failure per TASK 13
      }
    }

    const allPass = results.length === sizes.length && results.every((r) => r.pass);
    renderResultCard('res-readback-test', {
      title: 'READBACK DIAGNOSTIC (4B → 1MB)',
      pass: allPass,
      stage: allPass ? 'complete' : 'readback-test',
      errorType: null,
      errorMessage: allPass ? null : results.find((r) => !r.pass)?.err ?? 'Readback size test failed',
      notes: results.map((r) => `${r.name}: ${r.pass ? 'PASS' : 'FAIL'}${r.err ? ` (${r.err})` : ''}`),
    });
    updateReadbackEngineCard();
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
  } finally {
    _running = false;
  }
}

async function runReadbackStressHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    log('═══ RUN READBACK STRESS (100 iterations) ═══', 'info');
    const device = getDevice();
    const bytes = 64; // 16 floats
    let totalReads = 0;
    let failedReads = 0;
    let firstFailIter: number | null = null;
    let firstFailErr: string | null = null;

    const fill = new Float32Array(bytes / 4).fill(42.0);
    const buf = createStorageBuffer(bytes, fill);

    try {
      for (let i = 1; i <= 100; i++) {
        try {
          const read = await ReadbackManager.getInstance().copyAndRead(device, buf, bytes, `Stress_${i}`);
          if (read.length !== 16 || Math.abs(read[0] - 42.0) >= 1e-3) {
            throw new Error(`Data mismatch at iteration ${i}: got ${read[0]}`);
          }
          totalReads++;
        } catch (e) {
          failedReads++;
          if (firstFailIter === null) {
            firstFailIter = i;
            firstFailErr = (e as Error).message;
          }
          break; // Stop immediately on first MAP_READ failure per TASK 16
        }
      }
    } finally {
      buf.destroy();
    }

    const pass = failedReads === 0 && totalReads === 100;
    renderResultCard('res-readback-stress', {
      title: 'READBACK STRESS (100 Iterations)',
      pass,
      stage: pass ? 'complete' : `iter-${firstFailIter}`,
      errorType: null,
      errorMessage: firstFailErr,
      notes: [
        `Successful reads: ${totalReads}/100`,
        `Failed reads: ${failedReads}`,
        `First failure iter: ${firstFailIter ?? 'None'}`,
        `Device lost: ${hasDeviceLost() ? 'YES' : 'NO'}`,
      ],
    });
    log(`READBACK STRESS: ${pass ? 'PASS' : 'FAIL'} (${totalReads}/100 reads succeeded)`, pass ? 'ok' : 'err');
    if (firstFailErr) log(`  First failure at iter ${firstFailIter}: ${firstFailErr}`, 'err');
    updateReadbackEngineCard();
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
  } finally {
    _running = false;
  }
}

// HARNESS MATMUL — engine device via runGpuTest.
async function runHarnessMatmulHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    log('═══ HARNESS MATMUL (runGpuTest) ═══', 'info');
    const h = await testMatmul();
    _gateStatus.harnessMatmul = h.pass;
    updateCorrectnessButton();
    const caseSummary = h.cases.map((c) => `${c.config}:${c.pass ? 'PASS' : 'FAIL'}`).join(' ');
    const failed = h.cases.find((c) => !c.pass);
    const idNotes = failed
      ? [
          `pipeline device id: ${failed.pipelineDeviceId ?? 'unknown'}`,
          `execution device id: ${failed.executionDeviceId ?? 'unknown'}`,
          `bind group device id: ${failed.bindGroupDeviceId ?? 'unknown'}`,
          `device mismatch: ${failed.mismatch ? 'YES' : 'NO'}`,
        ]
      : [];
    renderResultCard('res-harness', {
      title: 'HARNESS MATMUL',
      pass: h.pass,
      stage: h.pass ? 'complete' : failed?.stage ?? 'runGpuTest',
      errorType: h.pass ? null : failed?.errorType ?? null,
      errorMessage: h.pass ? null : failed?.errorMessage ?? h.details,
      notes: [
        `cases: ${caseSummary || '—'}`,
        `max error: ${h.maxError >= 0 ? h.maxError.toExponential(2) : '—'}`,
        ...idNotes,
      ],
    });
    log(`HARNESS MATMUL: ${h.pass ? 'PASS' : 'FAIL'} — ${h.details || ''}`, h.pass ? 'ok' : 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

async function runAttentionCorrectnessHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    drainUncaptured();
    installUncapturedCollector();
    log('═══ RUN ATTENTION CORRECTNESS (seq=4/16/64/128/256) ═══', 'info');
    const result = await testAttention();
    const mount = _container?.querySelector('#res-attention') as HTMLElement | null;
    if (mount) {
      mount.innerHTML = result.cases
        .map((c) => {
          const lines = [
            `sequence length: ${c.config}`,
            `maxError: ${c.maxError >= 0 ? c.maxError.toExponential(3) : 'n/a'}`,
            `errorIndex: ${c.errorIndex >= 0 ? c.errorIndex : 'n/a'}`,
            `cpuValue: ${c.cpuValue !== null ? c.cpuValue.toExponential(4) : 'n/a'}`,
            `gpuValue: ${c.gpuValue !== null ? c.gpuValue.toExponential(4) : 'n/a'}`,
            `expected range: ${c.expectedRange ? `[${c.expectedRange[0].toExponential(3)}, ${c.expectedRange[1].toExponential(3)}]` : 'n/a'}`,
            `actual range: ${c.actualRange ? `[${c.actualRange[0].toExponential(3)}, ${c.actualRange[1].toExponential(3)}]` : 'n/a'}`,
            `non-finite count: ${c.nonFiniteIndex >= 0 ? 1 : 0}`,
          ];
          // TASK 13 — row coverage / unwritten-output diagnostics.
          if (c.rowsExpected !== undefined) {
            lines.push(`rows: ${c.rowsCovered ?? 0}/${c.rowsExpected} covered` + (c.firstMissingRow !== null && c.firstMissingRow !== undefined ? ` (first missing row ${c.firstMissingRow})` : ''));
            lines.push(`sentinel count: ${c.sentinelCount ?? 0}` + (c.firstSentinelIndex !== null && c.firstSentinelIndex !== undefined ? ` (first @ ${c.firstSentinelIndex}, last @ ${c.lastSentinelIndex})` : ''));
          }
          if (!c.pass) lines.push(`stage: ${c.stage} · ${c.errorType ?? 'gpu-error'} · ${c.errorMessage ?? ''}`);
          const body = lines.map((l) => `<div style="color:var(--text-dim)">${esc(l)}</div>`).join('');
          return `
            <div class="card" style="border-color:${c.pass ? 'var(--green)' : 'var(--red)'};margin-top:12px">
              <div class="card-header">
                <span class="card-title">Attention ${esc(c.config)}</span>
                <span class="badge ${c.pass ? 'badge-pass' : 'badge-fail'}">${c.pass ? 'PASS' : 'FAIL'}</span>
              </div>
              <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${body}</div>
            </div>`;
        })
        .join('');
    }
    log(`ATTENTION CORRECTNESS: ${result.pass ? 'ALL PASS' : 'FAILED'} — ${result.details}`, result.pass ? 'ok' : 'err');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

async function runPhaseSoftmaxHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    drainUncaptured();
    installUncapturedCollector();
    log('═══ RUN ATTENTION PHASE SOFTMAX (seq=4/16/64/128/256) ═══', 'info');
    const cases = await runPhaseSoftmaxCorrectness();
    const mount = _container?.querySelector('#res-phase-softmax') as HTMLElement | null;
    if (mount) {
      mount.innerHTML = cases
        .map((c) => {
          const lines = [
            `rows: ${c.rows} · workgroupsX: ${c.workgroupsX} · total invocations: ${c.totalInvocations}`,
            `maxError: ${c.maxError >= 0 ? c.maxError.toExponential(3) : 'n/a'}`,
            `errorIndex: ${c.errorIndex >= 0 ? c.errorIndex : 'n/a'}`,
            `cpuValue: ${c.cpuValue !== null ? c.cpuValue.toExponential(4) : 'n/a'}`,
            `gpuValue: ${c.gpuValue !== null ? c.gpuValue.toExponential(4) : 'n/a'}`,
            `expected range: ${c.expectedRange ? `[${c.expectedRange[0].toExponential(3)}, ${c.expectedRange[1].toExponential(3)}]` : 'n/a'}`,
            `actual range: ${c.actualRange ? `[${c.actualRange[0].toExponential(3)}, ${c.actualRange[1].toExponential(3)}]` : 'n/a'}`,
            `row sums: [${c.rowSumsMin.toExponential(3)}, ${c.rowSumsMax.toExponential(3)}] (≈1)`,
            `sentinel count: ${c.sentinelCount}`,
          ];
          if (!c.pass) lines.push(`stage: ${c.stage} · ${c.errorType ?? 'gpu-error'} · ${c.errorMessage ?? ''}`);
          const body = lines.map((l) => `<div style="color:var(--text-dim)">${esc(l)}</div>`).join('');
          return `
            <div class="card" style="border-color:${c.pass ? 'var(--green)' : 'var(--red)'};margin-top:12px">
              <div class="card-header">
                <span class="card-title">Phase Softmax seq=${c.seq}</span>
                <span class="badge ${c.pass ? 'badge-pass' : 'badge-fail'}">${c.pass ? 'PASS' : 'FAIL'}</span>
              </div>
              <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${body}</div>
            </div>`;
        })
        .join('');
    }
    log(`PHASE SOFTMAX: ${cases.every((c) => c.pass) ? 'ALL PASS' : 'FAILED'} — ${cases.map((c) => `s${c.seq}:${c.pass ? 'PASS' : 'FAIL'}`).join(' ')}`, cases.every((c) => c.pass) ? 'ok' : 'err');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

// ─── Isolated Phase Softmax Diagnostics (TASK 1–21) ───

const _isoSeq = [4, 16, 64, 128, 256];

function isoQktLines(q: { length: number; expectedLength: number; finiteCount: number; maxAbsError: number; errorIndex: number; cpuFirst16: number[]; gpuFirst16: number[]; scoresMin: number; scoresMax: number; scoresFiniteCount: number }): string[] {
  return [
    `length: ${q.length}/${q.expectedLength} · finite: ${q.finiteCount}`,
    `maxAbsError: ${q.maxAbsError.toExponential(3)} @ idx ${q.errorIndex} (≤ 1e-2)`,
    `cpu first16: [${q.cpuFirst16.map((n) => n.toFixed(4)).join(', ')}]`,
    `gpu first16: [${q.gpuFirst16.map((n) => n.toFixed(4)).join(', ')}]`,
    `scores: min ${q.scoresMin.toExponential(3)} · max ${q.scoresMax.toExponential(3)} · finite ${q.scoresFiniteCount}`,
  ];
}

function isoSoftLines(s: { length: number; expectedLength: number; finiteCount: number; maxError: number; errorIndex: number; cpuValue: number | null; gpuValue: number | null; rowSumMin: number; rowSumMax: number; sentinelCount: number }): string[] {
  return [
    `length: ${s.length}/${s.expectedLength} · finite: ${s.finiteCount}`,
    `maxError: ${s.maxError.toExponential(3)} @ idx ${s.errorIndex} (≤ 1e-2)`,
    `cpu @ idx: ${s.cpuValue !== null ? s.cpuValue.toExponential(4) : 'n/a'} · gpu @ idx: ${s.gpuValue !== null ? s.gpuValue.toExponential(4) : 'n/a'}`,
    `row sums: [${s.rowSumMin.toExponential(3)}, ${s.rowSumMax.toExponential(3)}] (≈1)`,
    `sentinel count: ${s.sentinelCount}`,
  ];
}

function isoUniformSoft(u: { rows: number; cols: number; rowsExpected: number; colsExpected: number; correct: boolean }): string {
  return `softmax uniform {rows:${u.rows}, cols:${u.cols}} expected {rows:${u.rowsExpected}, cols:${u.colsExpected}} → ${u.correct ? 'MATCH' : 'MISMATCH'}`;
}

function isoUniformQkt(q: { batch: number; seq: number; dim: number; scale: number }): string {
  return `qkt uniform {batch:${q.batch}, seq:${q.seq}, dim:${q.dim}, scale:${q.scale.toFixed(4)}}`;
}

function isoWgLines(w: { rows: number; workgroupSize: number; workgroupsX: number; totalInvocations: number }): string {
  return `dispatch: seq=${w.rows} · workgroup_size=64 · wgX=${w.workgroupsX} · total invocations=${w.totalInvocations}`;
}

function isoBufferLines(b: { scoresBytes: number; probsBytes: number; expectedBytes: number; distinct: boolean }): string {
  return `buffers: scores ${b.scoresBytes}B · probs ${b.probsBytes}B · expected ${b.expectedBytes}B · distinct=${b.distinct}`;
}

function renderIsolatedQkt(seq: number, rep: { manager: { qkt: { pass: boolean; diagnosis: string } }; direct: { qkt: { pass: boolean; diagnosis: string } }; overall: string }): string {
  const pass = rep.overall === 'QKT PASS';
  return `
    <div class="card" style="border-color:${pass ? 'var(--green)' : 'var(--red)'};margin-top:12px">
      <div class="card-header">
        <span class="card-title">Isolated QKT seq=${seq} (once)</span>
        <span class="badge ${pass ? 'badge-pass' : 'badge-fail'}">${pass ? 'PASS' : 'FAIL'}</span>
      </div>
      <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">
        <div style="color:var(--text-dim)">manager readback: ${rep.manager.qkt.pass ? 'PASS' : 'FAIL'} · direct staging: ${rep.direct.qkt.pass ? 'PASS' : 'FAIL'}</div>
        <div style="color:var(--text-dim)">overall: ${rep.overall}</div>
      </div>
    </div>`;
}

async function runIsolatedQktHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    drainUncaptured();
    installUncapturedCollector();
    log('═══ ISOLATED QKT (once · no warmup · no timing) ═══', 'info');
    const reports = await runIsolatedQktOnly(_isoSeq);
    const mount = _container?.querySelector('#res-iso-qkt') as HTMLElement | null;
    if (mount) {
      mount.innerHTML = reports.map((r) => renderIsolatedQkt(r.seq, r)).join('');
    }
    log(`ISOLATED QKT: ${reports.every((r) => r.overall === 'QKT PASS') ? 'ALL PASS' : 'FAILED'} — ${reports.map((r) => `s${r.seq}:${r.overall}`).join(' ')}`, reports.every((r) => r.overall === 'QKT PASS') ? 'ok' : 'err');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

function renderPhaseExperiments(reports: IsolatedPhaseReport[]): string {
  return reports
    .map((r) => {
      const good =
        r.manager.qkt.pass && r.direct.qkt.pass && (r.manager.softmax?.pass ?? false) && (r.direct.softmax?.pass ?? false);
      const softLines = (exp: IsolatedPhaseReport['manager']): string[] => {
        const lines = [...isoQktLines(exp.qkt)];
        if (exp.softmax) lines.push(...isoSoftLines(exp.softmax), isoUniformSoft(exp.softmaxUniform), isoUniformQkt(exp.qktUniform), isoBufferLines(exp.bufferInfo));
        else lines.push('(softmax SKIPPED — QKT FAILED, TASK 3 STOP)');
        lines.push(isoWgLines(exp.wgInfo));
        return lines;
      };
      const column = (label: string, exp: IsolatedPhaseReport['manager'], note: string): string => `
        <div style="min-width:280px;flex:1">
          <div class="card-header" style="padding:4px 0;border:none">
            <span class="card-title">${label}</span>
            <span class="badge ${exp.qkt.pass && (exp.softmax?.pass ?? false) ? 'badge-pass' : 'badge-fail'}">${exp.qkt.pass ? (exp.softmax ? (exp.softmax.pass ? 'PASS' : 'SOFT MAX FAIL') : 'QKT STOP') : 'QKT FAIL'}</span>
          </div>
          <div style="font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all;color:var(--text-dim)">${softLines(exp).map((l) => `<div>${esc(l)}</div>`).join('')}</div>
          <div style="font-size:11px;color:var(--text-dim)">${esc(note)} · ${esc(exp.diagnosis)}</div>
        </div>`;
      return `
        <div class="card" style="border-color:${good ? 'var(--green)' : 'var(--red)'};margin-top:12px">
          <div class="card-header">
            <span class="card-title">Isolated Phase seq=${r.seq}</span>
            <span class="badge ${good ? 'badge-pass' : 'badge-fail'}">${good ? 'PASS' : 'FAIL'}</span>
          </div>
          <div style="margin-top:8px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
            ${column('manager readback', r.manager, 'ReadbackManager')}
            ${column('direct staging', r.direct, 'mapAsync → read → unmap')}
            ${column('repro: shared uniform', r.repro, 'benchmark setupAttention() uniform binding')}
          </div>
          <div style="margin-top:8px;font-weight:600;color:var(--text-strong)">diagnosis: ${esc(r.overall)}</div>
        </div>`;
    })
    .join('');
}

async function runIsolatedPhaseSoftmaxHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    drainUncaptured();
    installUncapturedCollector();
    log('═══ ISOLATED PHASE SOFTMAX (QKT once → verify → Softmax once → verify) ═══', 'info');
    // TASK: phase-softmax only = QKT once → verify → Softmax once → verify. Full
    // isolation (both readbacks + repro) is the full-phase button.
    const reports = await runFullIsolatedPhase(_isoSeq);
    const mount = _container?.querySelector('#res-iso-phase') as HTMLElement | null;
    if (mount) mount.innerHTML = renderPhaseExperiments(reports);
    const summary = summarizeReports(reports);
    log(`ISOLATED PHASE SOFTMAX: ${summary} — ${reports.map((r) => `s${r.seq}:${r.overall}`).join(' ')}`, summary.includes('FAILURE') || summary.includes('EXECUTION') || summary.includes('INTERACTION') ? 'err' : 'ok');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

async function runFullIsolatedPhaseHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    drainUncaptured();
    installUncapturedCollector();
    log('═══ FULL ISOLATED PHASE (manager + direct + repro) ═══', 'info');
    const reports = await runFullIsolatedPhase(_isoSeq);
    const mount = _container?.querySelector('#res-iso-full') as HTMLElement | null;
    if (mount) {
      mount.innerHTML = renderPhaseExperiments(reports);
    }
    const summary = summarizeReports(reports);
    log(`FULL ISOLATED PHASE: ${summary}`, summary.includes('FAILURE') || summary.includes('EXECUTION') || summary.includes('INTERACTION') ? 'err' : 'ok');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

async function runHarnessDebugHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    drainUncaptured();
    installUncapturedCollector();
    const mount = _container?.querySelector('#res-harness-debug') as HTMLElement | null;
    if (mount) {
      mount.innerHTML = `<div class="card"><div class="card-header"><span class="card-title">Harness debug panel</span></div><div style="padding:8px;font-size:12px;font-family:var(--mono);white-space:pre-wrap">${esc(harnessDebugReport())}</div></div>`;
    }
    log('HARNESS DEBUG: panel refreshed', 'info');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

async function runHarnessRegressionHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    drainUncaptured();
    installUncapturedCollector();
    log('═══ HARNESS REGRESSION (TASK 20) seq=4 iters=3 ═══', 'info');
    const result = await runHarnessRegression(4, 3);
    const mount = _container?.querySelector('#res-harness-regression') as HTMLElement | null;
    if (mount) {
      mount.innerHTML = `<div class="card" style="border-color:${result.passed ? 'var(--green)' : 'var(--red)'}">
        <div class="card-header"><span class="card-title">Harness regression</span><span class="badge ${result.passed ? 'badge-pass' : 'badge-fail'}">${result.passed ? 'PASS' : 'FAIL'}</span></div>
        <div style="padding:8px;font-size:12px;font-family:var(--mono);white-space:pre-wrap">${esc(formatHarnessRegression(result))}</div></div>`;
    }
    const dbg = _container?.querySelector('#res-harness-debug') as HTMLElement | null;
    if (dbg) {
      dbg.innerHTML = `<div class="card"><div class="card-header"><span class="card-title">Harness debug panel (after regression)</span></div><div style="padding:8px;font-size:12px;font-family:var(--mono);white-space:pre-wrap">${esc(harnessDebugReport())}</div></div>`;
    }
    log(`HARNESS REGRESSION: ${result.passed ? 'PASS' : 'FAIL'}`, result.passed ? 'ok' : 'err');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

async function runCriticalIsolationHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    drainUncaptured();
    installUncapturedCollector();
    log('═══ CRITICAL ISOLATION seq=256 (A isolated → B fresh-correctness → C warmup-only → D benchmark) ═══', 'info');
    const steps = await runCriticalIsolation(256);
    const rows = steps
      .map((st) => `<tr style="color:${st.ok ? 'var(--green)' : 'var(--red)'}"><td class="td-l">${st.step}</td><td>${esc(st.label)}</td><td>${st.ok ? 'PASS' : 'FAIL'}</td><td style="color:var(--text-dim)">${esc(st.details)}</td></tr>`)
      .join('');
    const mount = _container?.querySelector('#res-harness-crit') as HTMLElement | null;
    if (mount) {
      mount.innerHTML = `<div class="card" style="border-color:${steps.every((s) => s.ok) ? 'var(--green)' : 'var(--red)'}">
        <div class="card-header"><span class="card-title">Critical isolation seq=256</span><span class="badge ${steps.every((s) => s.ok) ? 'badge-pass' : 'badge-fail'}">${steps.every((s) => s.ok) ? 'ALL PASS' : `STOP @ ${steps.find((s) => !s.ok)?.step ?? '?'}`}</span></div>
        <table class="perf-table"><thead><tr><th class="th-l">step</th><th>check</th><th>result</th><th>detail</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    }
    log(`CRITICAL ISOLATION: ${steps.every((s) => s.ok) ? 'ALL PASS' : `FAILED at step ${steps.find((s) => !s.ok)?.step ?? '?'}`}`, steps.every((s) => s.ok) ? 'ok' : 'err');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

async function runHarnessBenchHandler() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    drainUncaptured();
    installUncapturedCollector();
    log('═══ PHASE BENCHMARK SERIES (seq=4,16,64,128,256 · 5 iterations/phase) ═══', 'info');
    const results = await runPhaseBenchmarkSeries(_isoSeq, 5);
    const html = results
      .map((r) => {
        const good = r.correctness.maxErrs.qkt < 1e-2 && r.correctness.maxErrs.soft < 1e-2 && r.correctness.maxErrs.pv < 1e-2;
        return `<div class="card" style="border-color:${good ? 'var(--green)' : 'var(--red)'};margin-top:12px">
          <div class="card-header"><span class="card-title">Phase benchmark seq=${r.seq} (correctness gated)</span>
          <span class="badge ${good ? 'badge-pass' : 'badge-fail'}">${good ? 'PASS' : 'FAIL'}</span></div>
          <div style="padding:4px 8px;font-size:12px;font-family:var(--mono);color:var(--text-dim)">correctness: qkt=${r.correctness.maxErrs.qkt.toExponential(2)} soft=${r.correctness.maxErrs.soft.toExponential(2)} pv=${r.correctness.maxErrs.pv.toExponential(2)} rowSumDev=${r.correctness.rowSumMaxDev.toExponential(3)}</div>
          ${perfBlock(`${r.seq}`, r.samples)}
        </div>`;
      })
      .join('');
    const mount = _container?.querySelector('#res-harness-bench') as HTMLElement | null;
    if (mount) mount.innerHTML = html;
    const dbg = _container?.querySelector('#res-harness-debug') as HTMLElement | null;
    if (dbg) {
      dbg.innerHTML = `<div class="card"><div class="card-header"><span class="card-title">Harness debug panel (after phase benchmark)</span></div><div style="padding:8px;font-size:12px;font-family:var(--mono);white-space:pre-wrap">${esc(harnessDebugReport())}</div></div>`;
    }
    const allPass = results.every((r) => r.correctness.maxErrs.qkt < 1e-2 && r.correctness.maxErrs.soft < 1e-2 && r.correctness.maxErrs.pv < 1e-2);
    log(`PHASE BENCHMARK SERIES: ${allPass ? 'ALL CORRECT' : 'CORRECTNESS FAILURE'} (${results.map((r) => `s${r.seq}:${r.samples.length}/3`).join(' ')})`, allPass ? 'ok' : 'err');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

async function runCorrectnessTests() {
  if (_running) return;
  if (!gatesPassed()) {
    log('CORRECTNESS LOCKED — run GPU SANITY, STANDALONE MATMUL and HARNESS MATMUL first.', 'warn');
    return;
  }
  _running = true;
  try {
    const diag = await initBenchmark();
    _deviceDiag = diag;
    installListeners();
    // Clear any stale uncaptured errors from previous runs before the suite.
    drainUncaptured();
    installUncapturedCollector();
    log('═══ AETHER KERNEL VALIDATION (sequential, one test at a time) ═══', 'info');

    const results = await runAllTests((r) => {
      log(`${r.pass ? '✓' : '✗'} ${r.name} — ${r.details}`, r.pass ? 'ok' : 'err');
    });

    renderKernelValidation(results);
    const allPass = results.length === 6 && results.every((r) => r.pass);
    log(allPass ? 'ALL KERNELS PASSED' : 'SOME KERNELS FAILED', allPass ? 'ok' : 'err');
    if (allPass) {
      unlockPerf();
      log('Performance benchmarks UNLOCKED.', 'ok');
    } else if (!_perfLocked) {
      // Kernel validation regressed after previously passing — re-lock perf.
      _perfLocked = true;
      try {
        localStorage.removeItem('aether.kernels-passed');
      } catch {
        // ignore
      }
      updatePerfButtons();
      log('Performance benchmarks RE-LOCKED (a validated kernel failed).', 'err');
    }

    if (hasDeviceLost()) {
      stopDeviceLost();
      log('Requires runtime reinitialization — reload the page (or re-run up the gate diagnostics) before retrying.', 'err');
    } else {
      const report = buildReport(results);
      if (report) {
        saveReportToStorage(report);
        renderReportPanel(report);
        log('Correctness report saved locally (aether.correctness).', 'info');
      }
    }
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } finally {
    _running = false;
  }
}

// ─── AETHER GPU PERFORMANCE panel (TASK 5/6/9) ───

function unlockPerf() {
  _perfLocked = false;
  try {
    localStorage.setItem('aether.kernels-passed', '1');
  } catch {
    // private mode
  }
  updatePerfButtons();
}

function fmtMs(ms: number): string {
  if (!Number.isFinite(ms)) return '—';
  if (ms < 1) return `${(ms * 1000).toFixed(1)} µs`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function fmtThruput(t: { value: number; unit: string } | undefined): string {
  if (!t || !Number.isFinite(t.value)) return '—';
  return `${t.value.toFixed(1)} ${t.unit}`;
}

function fmtMode(mode: string): string {
  return mode === 'GPU_TIMESTAMP' ? 'GPU TIMESTAMP' : mode === 'END_TO_END' ? 'END-TO-END' : mode;
}

function sampleRows(samples: PerfSample[]): string {
  if (!samples || samples.length === 0) return '<tr><td colspan="7" style="color:var(--text-dim)">not run</td></tr>';
  return samples
    .map((s) => {
      if (s.note && s.note.startsWith('SKIPPED')) {
        return `<tr><td class="td-l">${esc(s.size)}</td><td colspan="7" style="color:var(--yellow)">${esc(s.note)} — not reported as a failure</td></tr>`;
      }
      const noteRow = s.note
        ? `<tr class="note-row"><td class="td-l"></td><td colspan="7" style="color:var(--text-dim);font-size:11px;white-space:pre-line">${esc(s.note)}</td></tr>`
        : '';
      return `<tr ${s.error ? 'style="color:var(--red)"' : ''}>
          <td class="td-l">${esc(s.size)}</td>
          <td>${fmtMode(s.timingMode)}</td>
          <td>${fmtMs(s.medianMs)}</td>
          <td>${fmtMs(s.averageMs)}</td>
          <td>${fmtMs(s.minMs)}</td>
          <td>${fmtMs(s.maxMs)}</td>
          <td>${fmtMs(s.stdDevMs)}</td>
          <td>${fmtThruput(s.throughput)}</td>
        </tr>${noteRow}`;
    })
    .join('');
}

function perfBlock(title: string, samples: PerfSample[]) {
  return `<div class="perf-block">
    <div class="perf-block-title">${esc(title)} <span class="badge badge-info" style="float:right">${samples ? samples.length : 0} run</span></div>
    <table class="perf-table">
      <thead><tr>
        <th class="th-l">size</th><th>mode</th><th>median</th><th>avg</th><th>min</th><th>max</th><th>stddev</th><th>throughput</th>
      </tr></thead>
      <tbody>${sampleRows(samples)}</tbody>
    </table>
  </div>`;
}

function overheadBlock(title: string, mode: OverheadSample) {
  if (!mode) return '';
  return `<div class="perf-block">
    <div class="perf-block-title">${esc(title)} <span class="badge badge-info" style="float:right">${mode.timingMode}</span></div>
    <table class="perf-table">
      <thead><tr><th class="th-l">configuration</th><th>per-op</th><th>total</th><th>iterations</th></tr></thead>
      <tbody>
        <tr>
          <td class="td-l">${esc(mode.name)} <span style="color:var(--text-dim)">· ${esc(mode.size)}</span></td>
          <td>${fmtMs(mode.perOpMs)}</td>
          <td>${fmtMs(mode.totalMs)}</td>
          <td>${mode.iterations}</td>
        </tr>
      </tbody>
    </table>
    ${mode.note ? `<div style="font-size:11px;color:var(--text-dim)">${esc(mode.note)}</div>` : ''}
  </div>`;
}

function attentionBlock(report: PerfReport) {
  const parts = Object.entries(report.tests.attentionPhases);
  if (parts.length === 0) return '';
  const bySize = parts
    .map(([size, samples]) => `<div class="perf-sub">${esc(size)}</div>${perfBlock('', samples)}`)
    .join('');
  return `<div class="perf-block">
    <div class="perf-block-title">Attention phases (per sequence length) <span class="badge badge-info" style="float:right">split</span></div>
    ${bySize || '<div style="color:var(--text-dim)">not run</div>'}
  </div>`;
}

function memoryRow(m: { requestedMiB: number; created: boolean; success: boolean; note?: string }): string {
  const color = m.success ? 'var(--green)' : 'var(--red)';
  return `<tr style="color:${color}">
    <td class="td-l">${m.requestedMiB} MiB</td>
    <td>${m.created ? 'allocated' : 'skipped'}</td>
    <td>${m.success ? 'OK' : 'FAILED'}</td>
    <td style="color:var(--text-dim)">${esc(m.note ?? '')}</td>
  </tr>`;
}

function sustainedBlock(s: SustainedResult | null): string {
  if (!s) return '';
  const bar = s.samples
    .map((x) => `<div class="pad-bar" title="s${x.second}: ${x.gflops.toFixed(2)} GFLOPS" style="height:${Math.max(8, Math.min(80, 100 - x.gflops))}px"></div>`)
    .join('');
  return `<div class="perf-block">
    <div class="perf-block-title">Sustained 30s — MatMul 256 ${s.throttled ? '<span class="badge badge-fail">THROTTLED</span>' : '<span class="badge badge-pass">STABLE</span>'}</div>
    <div style="display:flex;align-items:flex-end;gap:2px;height:80px;margin:8px 0">${bar}</div>
    <table class="perf-table">
      <tbody>
        <tr><td class="td-l">first 10s avg</td><td>${s.first10sAvgGflops.toFixed(2)} GFLOPS</td></tr>
        <tr><td class="td-l">last 10s avg</td><td>${s.last10sAvgGflops.toFixed(2)} GFLOPS</td></tr>
        <tr><td class="td-l">drop</td><td>${s.dropPct.toFixed(1)}%</td></tr>
        <tr><td class="td-l">overall avg / min / max</td><td>${s.avgGflops.toFixed(2)} / ${s.minGflops.toFixed(2)} / ${s.maxGflops.toFixed(2)} GFLOPS</td></tr>
        <tr><td class="td-l">thermal before / after</td><td>${esc(s.thermalBefore)} → ${esc(s.thermalAfter)}</td></tr>
        <tr><td class="td-l">timing</td><td>${s.timingMode}</td></tr>
      </tbody>
    </table>
  </div>`;
}

function renderPerfReport(report: PerfReport) {
  const mount = _container?.querySelector('#perf-results') as HTMLElement | null;
  if (!mount) return;
  const interp = interpretResults(report);
  const commandRows = report.commandBatching
    .map(
      (c: CommandBatchingResult) =>
        `<tr><td class="td-l">${esc(c.name)}</td><td>${fmtMs(c.totalMedianMs)}</td><td>${fmtMs(c.perDispatchMs)}</td><td>${c.timingMode}</td></tr>`
    )
    .join('');

  const suiteErr = report.suiteError
    ? `<div class="card" style="border-color:var(--red);margin-top:12px"><div class="card-header"><span class="card-title">SUITE ABORTED</span><span class="badge badge-fail">VALIDATION FAILURE</span></div><div style="font-size:12px;font-family:var(--mono);color:var(--red);margin-top:8px;word-break:break-all">${esc(report.suiteError)}</div></div>`
    : '';

  mount.innerHTML = suiteErr + `
    <h3 style="margin-top:20px">AETHER GPU PERFORMANCE</h3>
    <div class="card" style="border-color:var(--border);margin-top:4px">
      <div class="card-header">
        <span class="card-title">Timing mode</span>
        <span class="badge ${report.timingMode === 'GPU_TIMESTAMP' ? 'badge-pass' : 'badge-info'}">${report.timingMode === 'GPU_TIMESTAMP' ? 'GPU TIMESTAMP QUERIES' : 'END-TO-END GPU SUBMISSION TIMING'}</span>
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px">
        ${report.timingMode === 'GPU_TIMESTAMP' ? 'Pass timestamps written by the GPU driver — the closest thing to true GPU execution time.' : 'Timestamp queries unavailable or unsupported; every figure is the full submit→completion round-trip and is NOT labeled GPU execution time.'}
      </div>
    </div>
    <div class="card" style="border-color:var(--border);margin-top:10px">
      <div class="card-header"><span class="card-title">Environment</span></div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px;display:grid;gap:2px">
        <div>device: <b style="color:var(--text)">${esc(report.device.adapterName)}</b> · ${esc(report.device.adapterVendor)} ${report.device.isFallbackAdapter ? '(software fallback)' : ''}</div>
        <div>browser: <b style="color:var(--text)">${esc(report.browser.platform)}</b> · thermal state: <b style="color:var(--text)">${esc(report.browser.thermalState)}</b> · GPU utilization: <b style="color:var(--text)">${esc(report.browser.gpuUtilization)}</b></div>
        <div>tested ${new Date(report.timestamp).toLocaleString()} · build ${esc(String(report.build.id))}</div>
      </div>
    </div>
    ${perfBlock('Matrix Multiply', report.tests.matmul)}
    ${perfBlock('Vector Add', report.tests.vecadd)}
    ${perfBlock('Convolution 3×3', report.tests.conv2d)}
    ${perfBlock('Softmax', report.tests.softmax)}
    ${perfBlock('RMSNorm', report.tests.rmsnorm)}
    ${perfBlock('Attention (single pass)', report.tests.attention)}
    ${attentionBlock(report)}
    ${report.memory.length ? `<div class="perf-block"><div class="perf-block-title">Largest safe tested tensor</div><table class="perf-table"><thead><tr><th class="th-l">requested</th><th>state</th><th>result</th><th>note</th></tr></thead><tbody>${report.memory.map(memoryRow).join('')}</tbody></table></div>` : ''}
    ${overheadBlock('Buffer allocation vs reuse', report.bufferReuse.allocateDestroy)}
    ${overheadBlock('', report.bufferReuse.bufferReuse)}
    ${overheadBlock('Pipeline cache vs recreate', report.pipelineCache.recreate)}
    ${overheadBlock('', report.pipelineCache.cached)}
    ${report.commandBatching.length ? `<div class="perf-block"><div class="perf-block-title">Command submission batching</div><table class="perf-table"><thead><tr><th class="th-l">configuration</th><th>total (8 ops)</th><th>per dispatch</th><th>mode</th></tr></thead><tbody>${commandRows}</tbody></table></div>` : ''}
    ${sustainedBlock(report.sustained)}
    <div class="perf-block">
      <div class="perf-block-title">Interpretation</div>
      <div style="font-size:12px;line-height:1.5;color:var(--text);margin-top:6px">${interp.map((l) => `<div>• ${esc(l)}</div>`).join('')}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Interpretation is data-driven from the samples above — no fabricated GPU utilization, thermal state or theoretical maxima.</div>
    </div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn" id="btn-export-perf">EXPORT JSON</button>
      <button class="btn btn-outline" id="btn-copy-perf">COPY RESULTS</button>
    </div>
  `;
  mount.querySelector('#btn-export-perf')?.addEventListener('click', () => exportPerfJson());
  mount.querySelector('#btn-copy-perf')?.addEventListener('click', () => copyPerfSummary());
}

function exportPerfJson() {
  if (!_lastPerfReport) return;
  const json = JSON.stringify(buildIphoneBaseline(_lastPerfReport), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aether-gpu-benchmark-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function copyPerfSummary() {
  if (!_lastPerfReport) return;
  const r = _lastPerfReport;
  const lines: string[] = [];
  lines.push(`AETHER GPU BENCHMARK — ${r.device.adapterName} (${r.device.adapterVendor})`);
  lines.push(`timing mode: ${r.timingMode}`);
  lines.push(`thermal: ${r.browser.thermalState} · GPU utilization: ${r.browser.gpuUtilization}`);
  lines.push(r.suiteError ? `SUITE ERROR: ${r.suiteError}` : '');
  lines.push('');
  const dump = (title: string, samples: PerfSample[]) => {
    lines.push(title);
    for (const s of samples) {
      lines.push(
        `  ${s.size} — ${fmtMs(s.medianMs)} median (${fmtMode(s.timingMode)})${s.throughput ? ` · ${fmtThruput(s.throughput)}` : ''}`
      );
    }
    lines.push('');
  };
  dump('matmul', r.tests.matmul);
  dump('vecadd', r.tests.vecadd);
  dump('conv2d', r.tests.conv2d);
  dump('softmax', r.tests.softmax);
  dump('rmsnorm', r.tests.rmsnorm);
  dump('attention', r.tests.attention);
  for (const [size, samples] of Object.entries(r.tests.attentionPhases)) {
    dump(`attention phases ${size}`, samples);
  }
  if (r.sustained) {
    lines.push(`sustained 30s: avg ${r.sustained.avgGflops.toFixed(2)} GFLOPS, throttled=${r.sustained.throttled}, drop=${r.sustained.dropPct.toFixed(1)}%`);
  }
  void navigator.clipboard?.writeText(lines.join('\n')).catch(() => undefined);
  log('Benchmark summary copied to clipboard.', 'ok');
}

function updatePerfButtons() {
  const quick = _container?.querySelector('#btn-perf-quick') as HTMLButtonElement | null;
  const full = _container?.querySelector('#btn-perf-full') as HTMLButtonElement | null;
  const sustained = _container?.querySelector('#btn-perf-sustained') as HTMLButtonElement | null;
  const armInput = _container?.querySelector('#chk-sustained') as HTMLInputElement | null;
  if (quick) {
    quick.disabled = _perfLocked;
    quick.textContent = _perfLocked ? 'QUICK BENCHMARK (LOCKED)' : 'QUICK BENCHMARK';
  }
  if (full) {
    full.disabled = _perfLocked;
    full.textContent = _perfLocked ? 'FULL BENCHMARK (LOCKED)' : 'FULL BENCHMARK';
  }
  if (armInput) armInput.checked = _sustainedArmed;
  if (sustained) {
    sustained.disabled = _perfLocked || !_sustainedArmed;
    sustained.textContent = _perfLocked ? 'SUSTAINED (LOCKED)' : _sustainedArmed ? 'SUSTAINED 30s' : 'SUSTAINED (ARM FIRST)';
  }
}


function runPerf(mode: PerfMode) {
  if (_running) {
    log(`A benchmark is already running — wait for it to finish.`, 'warn');
    return;
  }
  if (mode === 'sustained' && !_sustainedArmed) {
    log('SUSTAINED is not armed — confirm "Enable sustained 30s run" first.', 'warn');
    return;
  }
  _running = true;
  try {
    const label = mode === 'quick' ? 'QUICK' : mode === 'full' ? 'FULL' : 'SUSTAINED';
    log(`═══ AETHER GPU PERFORMANCE — ${label} BENCHMARK ═══`, 'info');
    runPerfSuite({
      mode,
      onProgress: (msg) => log(`  ${msg}...`, 'info'),
      onSecond: (second, msg) => log(`  ${msg}`, 'info'),
    })
      .then((report) => {
        _lastPerfReport = report;
        renderPerfReport(report);
        log(report.suiteError ? `SUITE ABORTED: ${report.suiteError}` : `${label} benchmark complete — mode: ${report.timingMode}`, report.suiteError ? 'err' : 'ok');
        if (report.suiteError) {
          log('STOP — a validated kernel failed. Fix correctness before benchmarking.', 'err');
        }
      })
      .catch((e) => log(`ERROR: ${(e as Error).message}`, 'err'))
      .finally(() => {
        _running = false;
      });
  } catch (e) {
    _running = false;
    log(`ERROR: ${(e as Error).message}`, 'err');
  }
}

async function runPerfV2(mode: 'quick' | 'full') {
  if (_running) {
    log(`A benchmark is already running — wait for it to finish.`, 'warn');
    return;
  }
  _running = true;
  try {
    const label = mode === 'quick' ? 'QUICK V2' : 'FULL V2';
    log(`═══ AETHER GPU PERFORMANCE V2 — ${label} BENCHMARK (ADAPTIVE) ═══`, 'info');

    const device = getDevice();
    const timingMgr = new AmplifiedTimingManager(device);
    const timerRes = timingMgr.timerResolutionMs;
    const webgpuOk = !!(navigator as any).gpu;
    const crossOrig = window.crossOriginIsolated;
    const secure = window.isSecureContext;

    log(`  Timer resolution: ${timerRes.toFixed(3)} ms`, 'info');
    log(`  Cross-origin isolated: ${crossOrig}  |  secure context: ${secure}  |  WebGPU: ${webgpuOk}`, 'info');

    const allRows: V2ResultRow[] = [];

    const runBench = async (bench: (mgr: AmplifiedTimingManager) => Promise<V2ResultRow[]>, name: string) => {
      log(`  Running ${name}...`, 'info');
      const rows = await bench(timingMgr);
      allRows.push(...rows);
    };

    if (mode === 'quick') {
      await runBench(benchMatmulV2, 'MatMul');
      await runBench(benchVecAddV2, 'VecAdd');
      await runBench(benchSoftmaxV2, 'Softmax');
      await runBench(benchRMSNormV2, 'RMSNorm');
      await runBench(benchAttentionV2, 'Attention');
    } else {
      await runBench(benchMatmulV2, 'MatMul');
      await runBench(benchVecAddV2, 'VecAdd');
      await runBench(benchSoftmaxV2, 'Softmax');
      await runBench(benchRMSNormV2, 'RMSNorm');
      await runBench(benchAttentionV2, 'Attention');
      await runBench(benchConv2DV2, 'Conv2D');
    }

    renderPerfV2Results(allRows, { timerRes, crossOrig, secure, webgpuOk });
    timingMgr.destroy();
    log(`${label} benchmark complete`, 'ok');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
  } finally {
    _running = false;
  }
}

function renderPerfV2Results(rows: V2ResultRow[], env: { timerRes: number; crossOrig: boolean; secure: boolean; webgpuOk: boolean }) {
  const mount = _container?.querySelector('#perf-v2-results') as HTMLElement | null;
  if (!mount) return;

  const section = (title: string, items: V2ResultRow[]) => {
    if (items.length === 0) return '';
    return `<div class="perf-block"><div class="perf-block-title">${esc(title)}</div>` +
      `<table class="perf-table"><thead><tr>` +
      `<th class="th-l">workload</th><th>reps</th><th>total (ms)</th><th>per dispatch</th><th>throughput</th><th>timing</th>` +
      `</tr></thead><tbody>` +
      items.map(r => `<tr>` +
        `<td class="td-l">${esc(r.workload)}</td>` +
        `<td>${r.repetitions.toLocaleString()}</td>` +
        `<td>${r.measurable ? r.totalMs.toFixed(2) : '—'}</td>` +
        `<td>${r.measurable ? fmtPerDispatch(r.perDispatchMs) : 'UNMEASURABLE'}</td>` +
        `<td>${fmtThroughput(r.throughput, r.throughputUnit)}</td>` +
        `<td style="font-size:11px;color:var(--text-dim)">${esc(r.timingMethod)}</td>` +
        `</tr>`).join('') +
      `</tbody></table></div>`;
  };

  const tp = (rows.reduce((a, r) => a + (r.measurable ? 1 : 0), 0));
  const tl = (rows.reduce((a, r) => a + (r.measurable ? 0 : 1), 0));

  mount.innerHTML = `
    <div class="card" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER GPU BENCHMARK</span>
        <span class="badge badge-info">V2 ADAPTIVE</span>
      </div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
        <div>Timing: <b style="color:var(--text)">HOST_WALL_CLOCK_AMPLIFIED</b></div>
        <div>Timer resolution: <b style="color:var(--text)">${env.timerRes.toFixed(3)} ms</b></div>
        <div>WebGPU: <b style="color:var(--text)">${env.webgpuOk ? 'READY' : 'UNAVAILABLE'}</b></div>
        <div>Cross-origin isolated: <b style="color:var(--text)">${env.crossOrig ? 'YES' : 'NO'}</b></div>
        <div>Secure context: <b style="color:var(--text)">${env.secure ? 'YES' : 'NO'}</b></div>
        <div>Adapter name: <b style="color:var(--text)">${esc((_deviceDiag?.adapterName ?? 'UNAVAILABLE'))}</b></div>
        <div>Adapter vendor: <b style="color:var(--text)">${esc((_deviceDiag?.adapterVendor ?? 'UNAVAILABLE'))}</b></div>
        <div>Adapter device: <b style="color:var(--text)">${esc((_deviceDiag?.adapterDevice ?? 'UNAVAILABLE'))}</b></div>
        <div>Measurable: <b style="color:var(--text)">${tp} / ${rows.length}</b></div>
        <div>Unmeasurable: <b style="color:var(--text)">${tl} (timer_resolution)</b></div>
      </div>
    </div>
    ${section('Matrix Multiply', rows.filter(r => r.name === 'MatMul'))}
    ${section('Vector Add', rows.filter(r => r.name === 'VecAdd'))}
    ${section('Convolution 3×3', rows.filter(r => r.name === 'Conv2D'))}
    ${section('Softmax', rows.filter(r => r.name === 'Softmax'))}
    ${section('RMSNorm', rows.filter(r => r.name === 'RMSNorm'))}
    ${section('Attention (single pass)', rows.filter(r => r.name === 'Attention'))}
    <div class="btn-row" style="margin-top:12px">
      <button class="btn" id="btn-export-v2">EXPORT BENCHMARK JSON</button>
    </div>
  `;
  mount.querySelector('#btn-export-v2')?.addEventListener('click', () => exportV2Json(rows, env));
}

function exportV2Json(rows: V2ResultRow[], env: { timerRes: number; crossOrig: boolean; secure: boolean; webgpuOk: boolean }) {
  const payload = {
    device: {
      adapterName: _deviceDiag?.adapterName ?? 'UNAVAILABLE',
      adapterVendor: _deviceDiag?.adapterVendor ?? 'UNAVAILABLE',
      adapterDevice: _deviceDiag?.adapterDevice ?? 'UNAVAILABLE',
      maxBufferSize: _deviceDiag?.maxBufferSize ?? null,
      maxComputeWorkgroupsPerDimension: _deviceDiag?.maxComputeWorkgroupsPerDimension ?? null,
    },
    environment: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      webgpu: env.webgpuOk,
      crossOriginIsolated: env.crossOrig,
      secureContext: env.secure,
    },
    timing: {
      method: 'HOST_WALL_CLOCK_AMPLIFIED',
      timerResolutionMs: env.timerRes,
    },
    timestamp: new Date().toISOString(),
    buildId: AETHER_BUILD_ID,
    commit: AETHER_COMMIT,
    results: rows,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aether-benchmark-v2-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── V3: Model-Shaped Benchmark ──────────────────────────────────────────

function runPerfV3(mode: 'quick' | 'full') {
  if (_running) {
    log('A benchmark is already running — wait for it to finish.', 'warn');
    return;
  }
  _running = true;
  log(`═══ AETHER MODEL-SHAPED BENCHMARK V3 — ${mode === 'quick' ? 'QUICK' : 'FULL'} ═══`, 'info');
  // Defer to the V3 UI runner; it lazy-loads the heavy V3 module.
  import('./perf-v3-ui').then((mod) => {
    mod.runV3FromUI(mode, getDevice, (msg, kind) => log(msg, kind ?? 'info'));
  }).catch((e) => {
    log(`V3 load error: ${(e as Error).message}`, 'err');
  }).finally(() => {
    _running = false;
  });
}

// ─── V3.1: LLM Inference Gate ───────────────────────────────────────────

function runPerfV31(mode: 'quick' | 'full') {
  if (_running) {
    log('A benchmark is already running — wait for it to finish.', 'warn');
    return;
  }
  _running = true;
  log(`═══ AETHER V3.1 LLM INFERENCE GATE — ${mode === 'quick' ? 'QUICK' : 'FULL'} ═══`, 'info');
  import('./perf-v3-ui').then((mod) => {
    mod.runLLMGateFromUI(mode, getDevice, (msg, kind) => log(msg, kind ?? 'info'));
  }).catch((e) => {
    log(`V3.1 load error: ${(e as Error).message}`, 'err');
  }).finally(() => {
    _running = false;
  });
}

// ─── V2 bench functions: Adaptive Amplification ────────────────────────────
// All use AmplifiedTimingManager.measure() with no manual maxReps caps;
// the adaptive algorithm determines the right rep count per workload.
// Throughput is ALWAYS computed via buildV2ResultRow which guards Infinity.

async function benchMatmulV2(mgr: AmplifiedTimingManager): Promise<V2ResultRow[]> {
  const { createPipeline, createBindGroupForPipeline, createStorageBuffer, createUniformBuffer } = await import('./engine');
  const { MATMUL } = await import('./kernels');
  const { createMatmulUniform } = await import('./uniforms');
  const { cpuMatmul } = await import('./cpu-refs');
  const { fillDeterministic } = await import('./perf-kernels');

  const out: V2ResultRow[] = [];
  const sizes = [128, 256, 512, 1024];

  for (const n of sizes) {
    const bytes = n * n * 4;
    const a = new Float32Array(n * n);
    const b = new Float32Array(n * n);
    fillDeterministic(a);
    fillDeterministic(b);
    const bufA = createStorageBuffer(bytes, a);
    const bufB = createStorageBuffer(bytes, b);
    const bufC = createStorageBuffer(bytes);
    const uData = createMatmulUniform(n, n, n);
    const uniform = createUniformBuffer(uData);
    const pipeline = createPipeline(MATMUL, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
    const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
      { binding: 0, resource: { buffer: uniform } },
      { binding: 1, resource: { buffer: bufA } },
      { binding: 2, resource: { buffer: bufB } },
      { binding: 3, resource: { buffer: bufC } },
    ]);
    const wg: [number, number, number] = [n / 16, n / 16, 1];

    // TASK 7: correctness gate (readback + CPU compare) — runs ONCE before any timing.
    const got = await dispatchToAndRead(pipeline, bg, wg, bufC, bytes, `matmul-${n}`);
    const ref = cpuMatmul(a, b, n, n, n);

    const flopsPerDispatch = 2 * n * n * n;
    const stats = await mgr.measure((pass) => {
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
    });

    out.push(buildV2ResultRow(stats, mgr.timerResolutionMs, {
      name: 'MatMul',
      workload: `${n}×${n}`,
      factorPerDispatch: flopsPerDispatch,
      throughputUnitPrefix: 'GFLOPS ',
    }));
  }
  return out;
}

async function benchVecAddV2(mgr: AmplifiedTimingManager): Promise<V2ResultRow[]> {
  const { createPipeline, createBindGroupForPipeline, createStorageBuffer, createUniformBuffer, getDevice } = await import('./engine');
  const { VEC_ADD } = await import('./kernels');
  const { createVecAddUniform } = await import('./uniforms');
  const { cpuVecAdd } = await import('./cpu-refs');
  const { fillDeterministic } = await import('./perf-kernels');
  const { calculateVectorDispatchForDevice } = await import('./vector-dispatch');

  const out: V2ResultRow[] = [];
  const sizes = [1_000, 16_000, 64_000, 262_144, 1_048_576, 4_194_304];

  for (const n of sizes) {
    const bytes = n * 4;
    const a = new Float32Array(n);
    const b = new Float32Array(n);
    fillDeterministic(a);
    fillDeterministic(b);
    const bufA = createStorageBuffer(bytes, a);
    const bufB = createStorageBuffer(bytes, b);
    const bufC = createStorageBuffer(bytes);
    const device = getDevice();
    const dispatch = calculateVectorDispatchForDevice(device, n);
    const uniform = createUniformBuffer(createVecAddUniform(n, dispatch.dispatchStride));
    const pipeline = createPipeline(VEC_ADD, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
    const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
      { binding: 0, resource: { buffer: uniform } },
      { binding: 1, resource: { buffer: bufA } },
      { binding: 2, resource: { buffer: bufB } },
      { binding: 3, resource: { buffer: bufC } },
    ]);
    const wg: [number, number, number] = [dispatch.workgroupsX, dispatch.workgroupsY, 1];

    // TASK 7: correctness gate
    const got = await dispatchToAndRead(pipeline, bg, wg, bufC, bytes, `vecadd-${n}`);
    const ref = cpuVecAdd(a, b);

    const bytesPerDispatch = 3 * n * 4; // read A, read B, write C
    const stats = await mgr.measure((pass) => {
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
    });

    out.push(buildV2ResultRow(stats, mgr.timerResolutionMs, {
      name: 'VecAdd',
      workload: `${n.toLocaleString()} elements`,
      factorPerDispatch: bytesPerDispatch,
      throughputUnitPrefix: 'GB/s ',
    }));
  }
  return out;
}

async function benchSoftmaxV2(mgr: AmplifiedTimingManager): Promise<V2ResultRow[]> {
  const { createPipeline, createBindGroupForPipeline, createStorageBuffer, createUniformBuffer } = await import('./engine');
  const { SOFTMAX, softmaxWorkgroups } = await import('./kernels');
  const { createSoftmaxUniform } = await import('./uniforms');

  const out: V2ResultRow[] = [];
  const sizes = [128, 256, 512];

  for (const n of sizes) {
    const bytes = n * n * 4;
    const a = new Float32Array(n * n);
    for (let i = 0; i < n * n; i++) a[i] = (i % 100) / 50 - 1;
    const bufA = createStorageBuffer(bytes, a);
    const bufC = createStorageBuffer(bytes);
    const uniform = createUniformBuffer(createSoftmaxUniform(n, n));
    const pipeline = createPipeline(SOFTMAX, ['uniform', 'read-only-storage', 'storage']);
    const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'storage'], [
      { binding: 0, resource: { buffer: uniform } },
      { binding: 1, resource: { buffer: bufA } },
      { binding: 2, resource: { buffer: bufC } },
    ]);
    const wg = softmaxWorkgroups(n);

    const stats = await mgr.measure((pass) => {
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
    });

    out.push(buildV2ResultRow(stats, mgr.timerResolutionMs, {
      name: 'Softmax',
      workload: `${n}×${n}`,
      factorPerDispatch: 1,
      throughputUnitPrefix: '',
    }));
  }
  return out;
}

async function benchRMSNormV2(mgr: AmplifiedTimingManager): Promise<V2ResultRow[]> {
  const { createPipeline, createBindGroupForPipeline, createStorageBuffer, createUniformBuffer } = await import('./engine');
  const { RMS_NORM } = await import('./kernels');
  const { createRMSNormUniform } = await import('./uniforms');

  const out: V2ResultRow[] = [];
  const sizes = [256, 512, 1024, 2048, 4096];

  for (const n of sizes) {
    const bytes = n * 4;
    const a = new Float32Array(n);
    for (let i = 0; i < n; i++) a[i] = (i % 100) / 50 - 1;
    const bufA = createStorageBuffer(bytes, a);
    const bufC = createStorageBuffer(bytes);
    const uniform = createUniformBuffer(createRMSNormUniform(n, 1e-6));
    const pipeline = createPipeline(RMS_NORM, ['uniform', 'read-only-storage', 'storage']);
    const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'storage'], [
      { binding: 0, resource: { buffer: uniform } },
      { binding: 1, resource: { buffer: bufA } },
      { binding: 2, resource: { buffer: bufC } },
    ]);
    const wg: [number, number, number] = [1, 1, 1];

    const stats = await mgr.measure((pass) => {
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
    });

    out.push(buildV2ResultRow(stats, mgr.timerResolutionMs, {
      name: 'RMSNorm',
      workload: `size=${n}`,
      factorPerDispatch: 1,
      throughputUnitPrefix: '',
    }));
  }
  return out;
}

async function benchAttentionV2(mgr: AmplifiedTimingManager): Promise<V2ResultRow[]> {
  const { createPipeline, createBindGroupForPipeline, createStorageBuffer, createUniformBuffer } = await import('./engine');
  const { ATTENTION } = await import('./kernels');
  const { createAttentionUniform } = await import('./uniforms');

  const out: V2ResultRow[] = [];
  const configs = [{ seq: 128, dim: 64 }, { seq: 256, dim: 64 }, { seq: 512, dim: 64 }, { seq: 1024, dim: 64 }];

  for (const { seq, dim } of configs) {
    const batch = 1;
    const scoresBytes = batch * seq * seq * 4;
    const outBytes = batch * seq * dim * 4;
    const qkv = new Float32Array(batch * seq * dim * 3);
    for (let i = 0; i < qkv.length; i++) qkv[i] = (i % 100) / 50 - 1;
    const bufQKV = createStorageBuffer(qkv.byteLength, qkv);
    const bufScores = createStorageBuffer(scoresBytes);
    const bufOut = createStorageBuffer(outBytes);
    const uData = createAttentionUniform(batch, seq, dim, 1 / Math.sqrt(dim));
    const uniform = createUniformBuffer(uData);
    const pipeline = createPipeline(ATTENTION, ['uniform', 'read-only-storage', 'storage', 'storage', 'storage']);
    const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'storage', 'storage', 'storage'], [
      { binding: 0, resource: { buffer: uniform } },
      { binding: 1, resource: { buffer: bufQKV } },
      { binding: 2, resource: { buffer: bufScores } },
      { binding: 3, resource: { buffer: bufOut } },
      { binding: 4, resource: { buffer: bufOut } },
    ]);
    const wg: [number, number, number] = [Math.max(1, Math.ceil((batch * seq) / 64)), 1, 1];

    const flopsPerDispatch = 4 * batch * seq * seq * dim; // QK^T + PV
    const stats = await mgr.measure((pass) => {
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
    });

    out.push(buildV2ResultRow(stats, mgr.timerResolutionMs, {
      name: 'Attention',
      workload: `seq=${seq} dim=${dim}`,
      factorPerDispatch: flopsPerDispatch,
      throughputUnitPrefix: 'GFLOPS ',
    }));
  }
  return out;
}

async function benchConv2DV2(mgr: AmplifiedTimingManager): Promise<V2ResultRow[]> {
  const { createPipeline, createBindGroupForPipeline, createStorageBuffer, createUniformBuffer } = await import('./engine');
  const { CONV2D } = await import('./kernels');
  const { createConv2DUniform } = await import('./uniforms');

  const out: V2ResultRow[] = [];
  const configs = [
    { N: 1, C: 1, H: 32, W: 32, F: 1 },
    { N: 1, C: 1, H: 64, W: 64, F: 8 },
    { N: 1, C: 1, H: 128, W: 128, F: 16 },
  ];

  for (const { N, C, H, W, F } of configs) {
    const OH = H - 2;
    const OW = W - 2;
    const inBytes = N * C * H * W * 4;
    const wBytes = F * C * 3 * 3 * 4;
    const outBytes = N * F * OH * OW * 4;
    const input = new Float32Array(N * C * H * W);
    const weight = new Float32Array(F * C * 3 * 3);
    for (let i = 0; i < input.length; i++) input[i] = (i % 100) / 50 - 1;
    for (let i = 0; i < weight.length; i++) weight[i] = (i % 100) / 50 - 1;
    const bufIn = createStorageBuffer(inBytes, input);
    const bufW = createStorageBuffer(wBytes, weight);
    const bufOut = createStorageBuffer(outBytes);
    const uniform = createUniformBuffer(createConv2DUniform(N, C, H, W, F, 3, 3, OH, OW));
    const pipeline = createPipeline(CONV2D, ['uniform', 'read-only-storage', 'read-only-storage', 'storage']);
    const bg = createBindGroupForPipeline(pipeline, ['uniform', 'read-only-storage', 'read-only-storage', 'storage'], [
      { binding: 0, resource: { buffer: uniform } },
      { binding: 1, resource: { buffer: bufIn } },
      { binding: 2, resource: { buffer: bufW } },
      { binding: 3, resource: { buffer: bufOut } },
    ]);
    const wg: [number, number, number] = [N, F, OH * OW];

    // TASK 7: correctness gate
    const got = await dispatchToAndRead(pipeline, bg, wg, bufOut, outBytes, `conv2d-${C}-${F}-${H}`);

    // 2 × batch × C × OH × OW × FH × FW × F multiply-add ops
    const flopsPerDispatch = 2 * N * C * OH * OW * 3 * 3 * F;
    const stats = await mgr.measure((pass) => {
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
    });

    out.push(buildV2ResultRow(stats, mgr.timerResolutionMs, {
      name: 'Conv2D',
      workload: `${C}→${F} ch, ${H}×${W} → ${OH}×${OW}`,
      factorPerDispatch: flopsPerDispatch,
      throughputUnitPrefix: 'GFLOPS ',
    }));
  }
  return out;
}

// Helper: dispatch and readback (for correctness gates only, not timed)
async function dispatchToAndRead(pipeline: GPUComputePipeline, bg: GPUBindGroup, wg: [number, number, number], bufC: GPUBuffer, bytes: number, id: string): Promise<Float32Array> {
  const { getDevice, readbackBuffer } = await import('./engine');
  const { CompletionToken, awaitCompletion } = await import('./completion');
  const { harnessCounters } = await import('./harness-counters');
  const device = getDevice();
  const token = new CompletionToken(device);
  const encoder = device.createCommandEncoder();
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bg);
  pass.dispatchWorkgroups(wg[0], wg[1], wg[2]);
  pass.end();
  token.encode(encoder);
  device.queue.submit([encoder.finish()]);
  harnessCounters.onCommandBufferSubmitted('other');
  await awaitCompletion(device, token, id);
  const data = await readbackBuffer(bufC, bytes);
  token.destroy();
  return data;
}

function renderPerfPanel(el: HTMLElement) {
  const panel = el.querySelector('#perf-panel') as HTMLElement | null;
  if (!panel) return;
  panel.innerHTML = `
    <div class="card" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER GPU PERFORMANCE</span>
        <span class="badge ${_perfLocked ? 'badge-fail' : 'badge-pass'}">${_perfLocked ? 'LOCKED' : 'UNLOCKED'}</span>
      </div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:6px">
        ${_perfLocked
          ? 'Run GPU SANITY → STANDALONE MATMUL → HARNESS MATMUL → CORRECTNESS (all six kernels pass) to unlock. Timing comes from GPU timestamp queries where the device supports them, otherwise honest END-TO-END GPU submission timing. Sustained (30s) stays disabled until you arm it below.'
          : 'Timing uses GPU timestamp queries where supported, otherwise honest END-TO-END GPU submission timing (never labeled GPU execution time). Sustained (30s) stays disabled until you arm it below.'}
      </div>
      <div class="btn-row" style="margin-top:10px;flex-wrap:wrap">
        <button class="btn" id="btn-perf-quick">QUICK BENCHMARK</button>
        <button class="btn btn-outline" id="btn-perf-full">FULL BENCHMARK</button>
        <button class="btn btn-outline" id="btn-perf-sustained">SUSTAINED (ARM FIRST)</button>
      </div>
      <label style="display:flex;align-items:center;gap:6px;margin-top:10px;font-size:12px;color:var(--text-dim)">
        <input type="checkbox" id="chk-sustained" ${_sustainedArmed ? 'checked' : ''}>
        enable SUSTAINED 30s run (continuous MatMul load, per-second samples, thermal before/after)
      </label>
    </div>
    <div id="perf-results"></div>
  `;
  el.querySelector('#btn-perf-v2-quick')?.addEventListener('click', () => runPerfV2('quick'));
  el.querySelector('#btn-perf-v2-full')?.addEventListener('click', () => runPerfV2('full'));
  el.querySelector('#btn-perf-v3')?.addEventListener('click', () => runPerfV3('quick'));
  el.querySelector('#btn-perf-v3-full')?.addEventListener('click', () => runPerfV3('full'));
  el.querySelector('#btn-perf-v3-1')?.addEventListener('click', () => runPerfV31('quick'));
  el.querySelector('#btn-perf-v3-1-full')?.addEventListener('click', () => runPerfV31('full'));
  el.querySelector('#btn-perf-quick')?.addEventListener('click', () => runPerf('quick'));
  el.querySelector('#btn-perf-full')?.addEventListener('click', () => runPerf('full'));
  el.querySelector('#btn-perf-sustained')?.addEventListener('click', () => runPerf('sustained'));
  el.querySelector('#chk-sustained')?.addEventListener('change', (ev) => {
    _sustainedArmed = (ev.target as HTMLInputElement).checked;
    try {
      localStorage.setItem('aether.sustained.armed', _sustainedArmed ? '1' : '0');
    } catch {
      // private mode
    }
    updatePerfButtons();
  });
  updatePerfButtons();
}

function renderDiagnostics(el: HTMLElement) {
  const panel = el.querySelector('#diag-panel') as HTMLElement;
  if (!panel) return;
  const rows: Array<[string, string]> = [
    ['location.href', location.href],
    ['location.hash', location.hash],
    ['location.protocol', location.protocol],
    ['window.isSecureContext', String(window.isSecureContext)],
    ['navigator.userAgent', navigator.userAgent],
    ['AETHER_BUILD_ID', AETHER_BUILD_ID],
    ['Built at', AETHER_BUILD_TIME || 'n/a'],
    ['Benchmark code revision', AETHER_BUILD_ID],
  ];
  panel.innerHTML = rows
    .map(([k, v]) => `<div style="font-size:11px;font-family:var(--mono);word-break:break-all">
        <span style="color:var(--text-dim)">${k}:</span> <b style="color:var(--text)">${v}</b>
      </div>`)
    .join('');
}

export function render(el: HTMLElement) {
  _container = el;
  _listenersInstalled = false;
  el.innerHTML = `
    <h2>GPU Compute Benchmark — Isolated Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Three independent checks — GPU SANITY and STANDALONE MATMUL each request their own GPU device; SHARED-DEVICE DIRECT MATMUL and HARNESS MATMUL share the AETHER engine device. Kick the performance gates (GPU SANITY → STANDALONE MATMUL → SHARED-DEVICE DIRECT MATMUL → HARNESS MATMUL → CORRECTNESS) to unlock the GPU performance benchmarks below.
    </p>

    <div class="card" style="border-color:var(--border)">
      <div class="card-header">
        <span class="card-title">Device Info</span>
        <span class="badge badge-info" id="device-badge">NOT INITIALIZED</span>
      </div>
      <div id="device-info" style="font-size:12px;color:var(--text-dim);margin-top:8px"></div>
    </div>

    <div class="card" style="border-color:var(--border);margin-top:12px">
      <div class="card-header">
        <span class="card-title">AETHER GPU PERFORMANCE (V2)</span>
        <span class="badge badge-info" id="perf-v2-badge">READY</span>
      </div>
      <div class="btn-row" style="margin-top:10px;flex-wrap:wrap">
        <button class="btn btn-outline" id="btn-perf-v2-quick">QUICK V2 (AMPLIFIED)</button>
        <button class="btn btn-outline" id="btn-perf-v2-full">FULL V2 (AMPLIFIED)</button>
      </div>
      <div id="perf-v2-results" style="margin-top:12px"></div>
    </div>

    <div class="card" style="border-color:var(--border);margin-top:12px">
      <div class="card-header">
        <span class="card-title">AETHER MODEL-SHAPED BENCHMARK (V3)</span>
        <span class="badge badge-info" id="perf-v3-badge">READY</span>
      </div>
      <div class="btn-row" style="margin-top:10px;flex-wrap:wrap">
        <button class="btn" id="btn-perf-v3">QUICK V3</button>
        <button class="btn btn-outline" id="btn-perf-v3-full">FULL V3</button>
      </div>
      <div id="perf-v3-results" style="margin-top:12px"></div>
    </div>

    <div class="card" style="border-color:var(--border);margin-top:12px">
      <div class="card-header">
        <span class="card-title">AETHER V3.1 — LLM INFERENCE GATE</span>
        <span class="badge badge-info" id="perf-v3-1-badge">HARDWARE GATE</span>
      </div>
      <div class="btn-row" style="margin-top:10px;flex-wrap:wrap">
        <button class="btn" id="btn-perf-v3-1">QUICK V3.1</button>
        <button class="btn btn-outline" id="btn-perf-v3-1-full">FULL V3.1</button>
      </div>
      <div id="perf-v3-llm-results" style="margin-top:12px"></div>
    </div>

    <div class="btn-row" style="margin-top:16px">
      <button class="btn" id="btn-sanity">GPU SANITY</button>
      <button class="btn btn-outline" id="btn-standalone">STANDALONE MATMUL</button>
      <button class="btn btn-outline" id="btn-direct">SHARED-DEVICE DIRECT MATMUL</button>
      <button class="btn btn-outline" id="btn-harness">HARNESS MATMUL</button>
      <button class="btn btn-outline" id="btn-correctness">CORRECTNESS (LOCKED)</button>
    </div>

    <div id="res-sanity"></div>
    <div id="res-standalone"></div>
    <div id="res-direct"></div>
    <div id="res-harness"></div>

    <div class="btn-row" style="margin-top:12px">
      <button class="btn btn-outline" id="btn-minimal-64">RUN MINIMAL HARNESS MATMUL 64×64</button>
      <button class="btn btn-outline" id="btn-minimal-128">RUN MINIMAL HARNESS MATMUL 128×128</button>
      <button class="btn btn-outline" id="btn-readback-test">RUN READBACK TEST (4B → 1MB)</button>
      <button class="btn btn-outline" id="btn-readback-stress">RUN READBACK STRESS</button>
      <button class="btn btn-outline" id="btn-attention">RUN ATTENTION CORRECTNESS</button>
      <button class="btn btn-outline" id="btn-phase-softmax">RUN ATTENTION PHASE SOFTMAX</button>
      <button class="btn btn-outline" id="btn-iso-qkt">RUN ISOLATED QKT</button>
      <button class="btn btn-outline" id="btn-iso-phase">RUN ISOLATED PHASE SOFTMAX</button>
      <button class="btn btn-outline" id="btn-iso-full">RUN FULL ISOLATED PHASE</button>
      <button class="btn btn-outline" id="btn-harness-debug">HARNESS DEBUG PANEL</button>
      <button class="btn btn-outline" id="btn-harness-crit">CRITICAL ISOLATION SEQ=256</button>
      <button class="btn btn-outline" id="btn-harness-regression">RUN HARNESS REGRESSION</button>
      <button class="btn btn-outline" id="btn-harness-bench">PHASE BENCHMARK SEQ=4..256</button>
    </div>

    <div id="res-minimal-64"></div>
    <div id="res-minimal-128"></div>
    <div id="res-readback-test"></div>
    <div id="res-readback-stress"></div>
    <div id="res-attention"></div>
    <div id="res-phase-softmax"></div>
    <div id="res-iso-qkt"></div>
    <div id="res-iso-phase"></div>
    <div id="res-iso-full"></div>
    <div id="res-harness-debug"></div>
    <div id="res-harness-crit"></div>
    <div id="res-harness-regression"></div>
    <div id="res-harness-bench"></div>
    <div id="res-readback-engine"></div>

    <div id="validation-panel"></div>
    <div id="report-panel"></div>
    <div id="perf-panel"></div>

    <div class="log" id="bench-log"></div>

    <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;font-family:var(--mono);color:var(--text-dim)">
      <div>AETHER BUILD: <b id="build-id" style="color:var(--text)">${AETHER_BUILD_ID}</b></div>
      <div>Git commit: <b id="build-commit" style="color:var(--text)">${AETHER_COMMIT ?? 'unavailable'}</b></div>
      <div>Build time: <b id="build-time" style="color:var(--text)">${AETHER_BUILD_TIME || 'unavailable'}</b></div>
      <div>Environment: GitHub Pages</div>
    </div>
  `;

  renderDiagnostics(el);

  el.querySelector('#btn-sanity')?.addEventListener('click', runGpuSanityHandler);
  el.querySelector('#btn-standalone')?.addEventListener('click', runStandaloneMatmulHandler);
  el.querySelector('#btn-direct')?.addEventListener('click', runSharedDeviceDirectMatmulHandler);
  el.querySelector('#btn-minimal-64')?.addEventListener('click', () => runMinimalHarnessHandler(64, 'res-minimal-64'));
  el.querySelector('#btn-minimal-128')?.addEventListener('click', () => runMinimalHarnessHandler(128, 'res-minimal-128'));
  el.querySelector('#btn-readback-test')?.addEventListener('click', runReadbackTestHandler);
  el.querySelector('#btn-readback-stress')?.addEventListener('click', runReadbackStressHandler);
  el.querySelector('#btn-attention')?.addEventListener('click', runAttentionCorrectnessHandler);
  el.querySelector('#btn-phase-softmax')?.addEventListener('click', runPhaseSoftmaxHandler);
  el.querySelector('#btn-iso-qkt')?.addEventListener('click', runIsolatedQktHandler);
  el.querySelector('#btn-iso-phase')?.addEventListener('click', runIsolatedPhaseSoftmaxHandler);
  el.querySelector('#btn-iso-full')?.addEventListener('click', runFullIsolatedPhaseHandler);
  el.querySelector('#btn-harness-debug')?.addEventListener('click', runHarnessDebugHandler);
  el.querySelector('#btn-harness-crit')?.addEventListener('click', runCriticalIsolationHandler);
  el.querySelector('#btn-harness-regression')?.addEventListener('click', runHarnessRegressionHandler);
  el.querySelector('#btn-harness-bench')?.addEventListener('click', runHarnessBenchHandler);
  el.querySelector('#btn-harness')?.addEventListener('click', runHarnessMatmulHandler);

  const correctBtn = el.querySelector('#btn-correctness') as HTMLButtonElement | null;
  if (correctBtn) {
    correctBtn.addEventListener('click', runCorrectnessTests);
    correctBtn.disabled = !gatesPassed();
    correctBtn.textContent = gatesPassed() ? 'CORRECTNESS' : 'CORRECTNESS (LOCKED)';
  }
  renderPerfPanel(el);

  // Suppress unhandled errors so failures render in the log instead of a crash dialog.
  const errorHandler = (e: Event) => { e.preventDefault(); };
  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', errorHandler);

  // Auto-initialize on load to show device info + diagnostics.
  initBenchmark().then(diag => {
    _deviceDiag = diag;
    installListeners();
    updateReadbackEngineCard();
    const badge = el.querySelector('#device-badge') as HTMLElement;
    const info = el.querySelector('#device-info') as HTMLElement;
    if (badge) {
      badge.textContent = 'WEBGPU READY';
      badge.className = 'badge badge-pass';
    }
    if (info) {
      info.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
          <span>Adapter:</span><span style="color:var(--text)">${diag.adapterName}</span>
          <span>Vendor:</span><span style="color:var(--text)">${diag.adapterVendor}</span>
          <span>Features:</span><span style="color:var(--text)">${diag.adapterFeatures.length}</span>
          <span>Max Buffer:</span><span style="color:var(--text)">${formatBytes(diag.maxBufferSize)}</span>
          <span>Max Storage:</span><span style="color:var(--text)">${formatBytes(diag.maxStorageBufferBindingSize)}</span>
          <span>Workgroup X:</span><span style="color:var(--text)">${diag.maxComputeWorkgroupSizeX}</span>
          <span>Invocations/wg:</span><span style="color:var(--text)">${diag.maxComputeInvocationsPerWorkgroup}</span>
          <span>Timestamp Query:</span><span style="color:var(--text)">${diag.timestampQuerySupport ? 'YES' : 'NO'}</span>
          <span>Preferred Format:</span><span style="color:var(--text)">${diag.preferredCanvasFormat ?? 'N/A'}</span>
          <span>Fallback:</span><span style="color:var(--text)">${diag.isFallbackAdapter ? 'YES (software)' : 'NO (hardware)'}</span>
        </div>
      `;
    }
  }).catch(e => {
    const badge = el.querySelector('#device-badge') as HTMLElement;
    if (badge) {
      badge.textContent = 'WEBGPU UNAVAILABLE';
      badge.className = 'badge badge-fail';
    }
    log(`WEBGPU not available: ${(e as Error).message}`, 'err');
  });
}