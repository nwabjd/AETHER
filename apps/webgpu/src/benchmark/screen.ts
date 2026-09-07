// AETHER GPU Benchmark — Diagnostic Screen
// Isolated diagnostics only: GPU SANITY, STANDALONE MATMUL, HARNESS MATMUL.
// Performance benchmarks are disabled until correctness is independently proven.
//
// Each diagnostic renders its own PASS/FAIL card with stage, error type and
// error message, and the footer shows build ID + commit + build time so a
// stale Safari cache is immediately obvious.

import { initBenchmark, getDevice, getDeviceLostInfo, hasDeviceLost } from './engine';
import { testVecAdd, testMatmul, testConv2D, testSoftmax, testRMSNorm, testAttention } from './tests';
import { runGpuSanity } from './sanity';
import { runStandaloneMatmul } from './standalone-matmul';
import { AETHER_BUILD_ID, AETHER_COMMIT, AETHER_BUILD_TIME } from '../build-info';

let _container: HTMLElement | null = null;
let _running = false;
let _listenersInstalled = false;

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
    renderResultCard('res-harness', {
      title: 'HARNESS MATMUL',
      pass: h.pass,
      stage: 'runGpuTest',
      errorType: h.pass ? null : 'test-failure',
      errorMessage: h.pass ? null : h.details,
      notes: [`details: ${h.details || '—'}`, `max error: ${h.maxError.toExponential(2)}`],
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
    await initBenchmark();
    installListeners();
    log('═══ CORRECTNESS TESTS ═══', 'info');
    const testFunctions = [
      { name: 'Vector Add', fn: testVecAdd },
      { name: 'Conv2D', fn: testConv2D },
      { name: 'Softmax', fn: testSoftmax },
      { name: 'RMSNorm', fn: testRMSNorm },
      { name: 'Attention', fn: testAttention },
    ];

    let allPass = true;
    for (const t of testFunctions) {
      if (hasDeviceLost()) { stopDeviceLost(); return; }
      try {
        const res = await t.fn();
        log(`${res.pass ? '✓' : '✗'} ${res.name}: ${res.details || ''} (max err: ${res.maxError.toExponential(2)})`, res.pass ? 'ok' : 'err');
        if (!res.pass) allPass = false;
      } catch (e) {
        log(`✗ ${t.name}: FAILED WITH ERROR: ${(e as Error).message}`, 'err');
        allPass = false;
      }
    }
    log('', '');
    log(allPass ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED', allPass ? 'ok' : 'err');
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