// AETHER GPU Benchmark — Diagnostic Screen
// Diagnostic iteration: only GPU SANITY / MATMUL / CORRECTNESS are available.
// Performance benchmarks are disabled until correctness is independently proven.
//
// Shows build ID + commit so a stale Safari cache is immediately obvious.

import { initBenchmark, getDevice, getDeviceLostInfo, hasDeviceLost } from './engine';
import { testVecAdd, testMatmul, testConv2D, testSoftmax, testRMSNorm, testAttention } from './tests';
import { runGpuSanity } from './sanity';
import { runStandaloneMatmul } from './standalone-matmul';
import { AETHER_BUILD_ID, AETHER_COMMIT } from '../build-info';

let _container: HTMLElement | null = null;
let _running = false;
let _listenersInstalled = false;

// TASK 11: gate tests — CORRECTNESS stays locked until these all pass.
const _gateStatus = { sanity: false, standaloneMatmul: false, harnessMatmul: false };

function gatesPassed(): boolean {
  return _gateStatus.sanity && _gateStatus.standaloneMatmul && _gateStatus.harnessMatmul;
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

// TASK 7 + TASK 8: install uncapturederror + device.lost listeners once.
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

// TASK 4 + TASK 5: GPU SANITY button.
async function runSanityTest() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    log('═══ GPU SANITY ═══', 'info');
    const r = await runGpuSanity();
    log(`GPU SANITY TEST: ${r.pass ? 'PASS' : 'FAIL'}`, r.pass ? 'ok' : 'err');
    if (r.expected) log(`  expected: ${r.expected}`, '');
    if (r.actual) log(`  actual:   ${r.actual}`, r.pass ? 'ok' : 'err');
    for (const e of r.errors) log(`  GPU error scope result: ${e}`, 'err');
    if (r.exception) log(`  exception: ${r.exception}`, 'err');
    if (hasDeviceLost()) stopDeviceLost();
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
  } finally {
    _running = false;
  }
}

// TASK 6: A/B comparison — standalone sanity, standalone matmul, harness matmul.
async function runMatmulDiagnostics() {
  if (_running) return;
  _running = true;
  try {
    await initBenchmark();
    installListeners();
    log('═══ MATMUL DIAGNOSTICS ═══', 'info');

    // 1/3 — standalone GPU sanity
    log('— 1/3 Standalone GPU sanity —', 'info');
    const s = await runGpuSanity();
    _gateStatus.sanity = s.pass;
    log(`GPU SANITY TEST: ${s.pass ? 'PASS' : 'FAIL'}`, s.pass ? 'ok' : 'err');
    for (const e of s.errors) log(`  error scope result: ${e}`, 'err');
    if (s.exception) log(`  exception: ${s.exception}`, 'err');
    if (hasDeviceLost()) { stopDeviceLost(); return; }

    // 2/3 — standalone matmul
    log('— 2/3 Standalone MatMul (64×64) —', 'info');
    const m = await runStandaloneMatmul();
    _gateStatus.standaloneMatmul = m.pass;
    log(`STANDALONE MATMUL: ${m.pass ? 'PASS' : 'FAIL'}`, m.pass ? 'ok' : 'err');
    if (m.expected) log(`  expected: ${m.expected}`, '');
    if (m.actual) log(`  actual:   ${m.actual}`, m.pass ? 'ok' : 'err');
    for (const e of m.errors) log(`  error scope result: ${e}`, 'err');
    if (m.exception) log(`  exception: ${m.exception}`, 'err');
    if (hasDeviceLost()) { stopDeviceLost(); return; }

    // 3/3 — harness matmul (runGpuTest)
    log('— 3/3 Harness MatMul (runGpuTest) —', 'info');
    const h = await testMatmul();
    _gateStatus.harnessMatmul = h.pass;
    log(`HARNESS MATMUL: ${h.pass ? 'PASS' : 'FAIL'} — ${h.details || ''}`, h.pass ? 'ok' : 'err');
    if (hasDeviceLost()) { stopDeviceLost(); return; }

    if (gatesPassed()) {
      log('All three gate tests passed — CORRECTNESS enabled.', 'ok');
      const correctBtn = _container?.querySelector('#btn-correctness') as HTMLButtonElement | null;
      if (correctBtn) {
        correctBtn.disabled = false;
        correctBtn.textContent = 'CORRECTNESS';
      }
    }

    log('═══ MATMUL DIAGNOSTICS COMPLETE ═══', 'info');
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
    log('CORRECTNESS LOCKED — run GPU SANITY and MATMUL first.', 'warn');
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
    <h2>GPU Compute Benchmark — Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Isolated GPU checks. Performance benchmarks are disabled until correctness is proven.
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

    <div class="btn-row">
      <button class="btn" id="btn-sanity">GPU SANITY</button>
      <button class="btn btn-outline" id="btn-matmul">MATMUL</button>
      <button class="btn btn-outline" id="btn-correctness">CORRECTNESS (LOCKED)</button>
    </div>

    <div class="log" id="bench-log"></div>

    <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;font-family:var(--mono);color:var(--text-dim)">
      <div>App build: <b id="build-id" style="color:var(--text)">${AETHER_BUILD_ID}</b></div>
      <div>Git commit: <b id="build-commit" style="color:var(--text)">${AETHER_COMMIT ?? 'unavailable'}</b></div>
      <div>Environment: GitHub Pages</div>
    </div>
  `;

  renderDiagnostics(el);

  el.querySelector('#btn-sanity')?.addEventListener('click', runSanityTest);
  el.querySelector('#btn-matmul')?.addEventListener('click', runMatmulDiagnostics);

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
    if (el.querySelector('#diag-panel')) {
      log(`WEBGPU not available: ${(e as Error).message}`, 'err');
    }
  });
}