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
import { runPerfSuite, isSuiteRunning, type PerfMode } from './perf-suite';
import {
  interpretResults,
  type PerfReport,
  type PerfSample,
  type OverheadSample,
  type CommandBatchingResult,
  type SustainedResult,
} from './perf-report';

let _container: HTMLElement | null = null;
let _running = false;
let _listenersInstalled = false;
let _deviceDiag: DeviceDiagnostics | null = null;
let _perfLocked = localStorage.getItem('aether.kernels-passed') !== '1';
let _sustainedArmed = localStorage.getItem('aether.sustained.armed') === '1';
let _lastPerfReport: PerfReport | null = null;

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
    .map(
      (s) =>
        `<tr ${s.error ? 'style="color:var(--red)"' : ''}>
          <td class="td-l">${esc(s.size)}</td>
          <td>${fmtMode(s.timingMode)}</td>
          <td>${fmtMs(s.medianMs)}</td>
          <td>${fmtMs(s.averageMs)}</td>
          <td>${fmtMs(s.minMs)}</td>
          <td>${fmtMs(s.maxMs)}</td>
          <td>${fmtMs(s.stdDevMs)}</td>
          <td>${fmtThruput(s.throughput)}</td>
        </tr>`
    )
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
  const blob = new Blob([JSON.stringify(_lastPerfReport, null, 2)], { type: 'application/json' });
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
      Three independent checks — each requests its own GPU device. Kick the performance gates (GPU SANITY → STANDALONE MATMUL → HARNESS MATMUL → CORRECTNESS) to unlock the GPU performance benchmarks below.
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