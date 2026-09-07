// AETHER GPU Benchmark — Diagnostic Screen
// Isolated diagnostics only: GPU SANITY, STANDALONE MATMUL, HARNESS MATMUL.
// Performance benchmarks are disabled until correctness is independently proven.
//
// Each diagnostic renders its own PASS/FAIL card with stage, error type and
// error message, and the footer shows build ID + commit + build time so a
// stale Safari cache is immediately obvious.

import { initBenchmark, getDevice, getDeviceLostInfo, hasDeviceLost, type DeviceDiagnostics } from './engine';
import {
  runAllTests,
  testMatmul,
  installUncapturedCollector,
  drainUncaptured,
  type TestResult,
  type KernelCaseResult,
  type SuiteReport,
  type SuiteReportEntry,
} from './tests';
import { runGpuSanity } from './sanity';
import { runStandaloneMatmul } from './standalone-matmul';
import { AETHER_BUILD_ID, AETHER_COMMIT, AETHER_BUILD_TIME } from '../build-info';

let _container: HTMLElement | null = null;
let _running = false;
let _listenersInstalled = false;
let _deviceDiag: DeviceDiagnostics | null = null;

// CORRECTNESS stays locked until these all pass.
const _gateStatus = { sanity: false, standaloneMatmul: false, harnessMatmul: false };

function gatesPassed(): boolean {
  return _gateStatus.sanity && _gateStatus.standaloneMatmul && _gateStatus.harnessMatmul;
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
    renderResultCard('res-harness', {
      title: 'HARNESS MATMUL',
      pass: h.pass,
      stage: h.pass ? 'complete' : h.cases.find((c) => !c.pass)?.stage ?? 'runGpuTest',
      errorType: h.pass ? null : h.cases.find((c) => !c.pass)?.errorType ?? null,
      errorMessage: h.pass ? null : h.cases.find((c) => !c.pass)?.errorMessage ?? h.details,
      notes: [`cases: ${caseSummary || '—'}`, `max error: ${h.maxError >= 0 ? h.maxError.toExponential(2) : '—'}`],
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
      Three independent checks — each requests its own GPU device. Performance benchmarks are disabled until correctness is proven.
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
        <span class="card-title">Runtime Source Verification</span>
      </div>
      <div id="diag-panel" style="margin-top:8px"></div>
    </div>

    <div class="btn-row" style="margin-top:16px">
      <button class="btn" id="btn-sanity">GPU SANITY</button>
      <button class="btn btn-outline" id="btn-standalone">STANDALONE MATMUL</button>
      <button class="btn btn-outline" id="btn-harness">HARNESS MATMUL</button>
      <button class="btn btn-outline" id="btn-correctness">CORRECTNESS (LOCKED)</button>
    </div>

    <div id="res-sanity"></div>
    <div id="res-standalone"></div>
    <div id="res-harness"></div>

    <div id="validation-panel"></div>
    <div id="report-panel"></div>

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
  el.querySelector('#btn-harness')?.addEventListener('click', runHarnessMatmulHandler);

  const correctBtn = el.querySelector('#btn-correctness') as HTMLButtonElement | null;
  if (correctBtn) {
    correctBtn.addEventListener('click', runCorrectnessTests);
    correctBtn.disabled = !gatesPassed();
    correctBtn.textContent = gatesPassed() ? 'CORRECTNESS' : 'CORRECTNESS (LOCKED)';
  }

  // Suppress unhandled errors so failures render in the log instead of a crash dialog.
  const errorHandler = (e: Event) => { e.preventDefault(); };
  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', errorHandler);

  // Auto-initialize on load to show device info + diagnostics.
  initBenchmark().then(diag => {
    _deviceDiag = diag;
    installListeners();
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