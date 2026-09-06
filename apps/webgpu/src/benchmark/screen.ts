// AETHER GPU Benchmark — Main Screen
// Quick / Full / Sustained benchmark modes with results table and export

import { initBenchmark, getDevice, destroyBenchmark, type BenchmarkResult, type DeviceDiagnostics } from './engine';
import { benchmarkVectorAdd } from './bench-vecadd';
import { benchmarkMatmul } from './bench-matmul';
import { benchmarkConv2D } from './bench-conv2d';
import { benchmarkSoftmax } from './bench-softmax';
import { benchmarkRMSNorm } from './bench-rmsnorm';
import { benchmarkAttention } from './bench-attention';
import { benchmarkMemory } from './bench-memory';
import { benchmarkSustained } from './bench-sustained';
import { runAllTests } from './tests';
import { saveResults, getAllRuns, exportJSON, downloadJSON, clearAllRuns } from './results-store';

let _container: HTMLElement | null = null;
let _running = false;

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

function setProgress(pct: number, msg: string) {
  if (!_container) return;
  const fill = _container.querySelector('#progress-fill') as HTMLElement;
  const label = _container.querySelector('#progress-label') as HTMLElement;
  if (fill) fill.style.width = pct < 0 ? '0%' : `${Math.min(pct, 100)}%`;
  if (label) label.textContent = msg;
}

function renderResultsTable(results: BenchmarkResult[]) {
  if (!_container) return;
  const tableEl = _container.querySelector('#results-table') as HTMLElement;
  if (!tableEl) return;

  if (results.length === 0) {
    tableEl.innerHTML = '<div class="empty-state"><p>No results yet</p></div>';
    return;
  }

  let html = `<table style="width:100%;border-collapse:collapse;font-size:12px;font-family:var(--mono)">
    <thead>
      <tr style="border-bottom:1px solid var(--border)">
        <th style="text-align:left;padding:6px;color:var(--text-dim)">Operation</th>
        <th style="text-align:left;padding:6px;color:var(--text-dim)">Input</th>
        <th style="text-align:right;padding:6px;color:var(--text-dim)">Time</th>
        <th style="text-align:right;padding:6px;color:var(--text-dim)">Throughput</th>
        <th style="text-align:right;padding:6px;color:var(--text-dim)">Memory</th>
        <th style="text-align:center;padding:6px;color:var(--text-dim)">Status</th>
      </tr>
    </thead>
    <tbody>`;

  for (const r of results) {
    const statusCls = r.success ? 'color:var(--green)' : 'color:var(--red)';
    const statusText = r.success ? 'PASS' : 'FAIL';
    html += `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:6px;color:var(--text)">${r.name}</td>
      <td style="padding:6px;color:var(--text-dim)">${r.inputSize}</td>
      <td style="padding:6px;text-align:right;color:var(--text)">${r.executionTimeMs.toFixed(2)} ms</td>
      <td style="padding:6px;text-align:right;color:var(--text)">${r.throughput}</td>
      <td style="padding:6px;text-align:right;color:var(--text-dim)">${formatBytes(r.memoryBytes)}</td>
      <td style="padding:6px;text-align:center;${statusCls}">${statusText}</td>
    </tr>`;
  }

  html += '</tbody></table>';
  tableEl.innerHTML = html;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

async function runQuickBenchmark() {
  if (_running) return;
  _running = true;

  const runBtn = _container?.querySelector('#btn-quick') as HTMLButtonElement;
  if (runBtn) runBtn.disabled = true;

  const allResults: BenchmarkResult[] = [];

  try {
    log('═══ QUICK BENCHMARK ═══', 'info');
    setProgress(0, 'Initializing GPU...');

    const diag = await initBenchmark();
    log(`Adapter: ${diag.adapterName}`, 'ok');
    log(`Timestamp query: ${diag.timestampQuerySupport ? 'YES' : 'NO'}`, '');

    // Correctness tests first
    log('', '');
    log('── CORRECTNESS TESTS ──', 'info');
    const tests = await runAllTests();
    for (const t of tests) {
      log(`  ${t.pass ? '✓' : '✗'} ${t.name}: ${t.details} (max err: ${t.maxError.toExponential(2)})`, t.pass ? 'ok' : 'err');
    }
    const allPass = tests.every(t => t.pass);
    log(`  ${allPass ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`, allPass ? 'ok' : 'err');

    // Quick benchmarks: VecAdd 1M, Matmul 128+256, Softmax small, RMSNorm small
    log('', '');
    log('── BENCHMARKS ──', 'info');

    setProgress(10, 'Vector Add...');
    log('▸ Vector Addition', 'info');
    const vecResults = await benchmarkVectorAdd();
    for (const r of vecResults) {
      log(`  ${r.name} ${r.inputSize}: ${r.executionTimeMs.toFixed(2)} ms — ${r.throughput} [${r.success ? 'PASS' : 'FAIL'}]`, r.success ? 'ok' : 'err');
      allResults.push(r);
    }

    setProgress(30, 'Matrix Multiply...');
    log('▸ Matrix Multiply', 'info');
    const matResults = await benchmarkMatmul();
    for (const r of matResults) {
      log(`  ${r.name} ${r.inputSize}: ${r.executionTimeMs.toFixed(2)} ms — ${r.throughput} [${r.success ? 'PASS' : 'FAIL'}]`, r.success ? 'ok' : 'err');
      allResults.push(r);
    }

    setProgress(60, 'Softmax...');
    log('▸ Softmax', 'info');
    const softResults = await benchmarkSoftmax();
    for (const r of softResults) {
      log(`  ${r.name} ${r.inputSize}: ${r.executionTimeMs.toFixed(2)} ms — ${r.throughput} [${r.success ? 'PASS' : 'FAIL'}]`, r.success ? 'ok' : 'err');
      allResults.push(r);
    }

    setProgress(80, 'RMSNorm...');
    log('▸ RMSNorm', 'info');
    const rmsResults = await benchmarkRMSNorm();
    for (const r of rmsResults) {
      log(`  ${r.name} ${r.inputSize}: ${r.executionTimeMs.toFixed(2)} ms — ${r.throughput} [${r.success ? 'PASS' : 'FAIL'}]`, r.success ? 'ok' : 'err');
      allResults.push(r);
    }

    setProgress(100, 'Done');
    log('', '');
    log('═══ QUICK BENCHMARK COMPLETE ═══', 'info');
    log(`${allResults.length} tests run`, '');

    renderResultsTable(allResults);

    // Save to IndexedDB
    try {
      await saveResults(allResults, {
        adapter: diag.adapterName,
        os: detectOS(),
        browser: detectBrowser(),
      });
    } catch { /* ignore save errors */ }
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    setProgress(0, 'Error');
  } finally {
    _running = false;
    if (runBtn) runBtn.disabled = false;
  }
}

async function runFullBenchmark() {
  if (_running) return;
  _running = true;

  const runBtn = _container?.querySelector('#btn-full') as HTMLButtonElement;
  if (runBtn) runBtn.disabled = true;

  const allResults: BenchmarkResult[] = [];

  try {
    log('═══ FULL BENCHMARK ═══', 'info');
    setProgress(0, 'Initializing GPU...');

    const diag = await initBenchmark();
    log(`Adapter: ${diag.adapterName}`, 'ok');

    // Correctness tests
    log('', '');
    log('── CORRECTNESS TESTS ──', 'info');
    const tests = await runAllTests();
    for (const t of tests) {
      log(`  ${t.pass ? '✓' : '✗'} ${t.name}: ${t.details} (max err: ${t.maxError.toExponential(2)})`, t.pass ? 'ok' : 'err');
    }

    const benchmarks = [
      { name: 'Vector Addition', fn: benchmarkVectorAdd, pct: 10 },
      { name: 'Matrix Multiply', fn: benchmarkMatmul, pct: 25 },
      { name: 'Convolution', fn: benchmarkConv2D, pct: 40 },
      { name: 'Softmax', fn: benchmarkSoftmax, pct: 55 },
      { name: 'RMSNorm', fn: benchmarkRMSNorm, pct: 65 },
      { name: 'Attention', fn: benchmarkAttention, pct: 75 },
      { name: 'Memory', fn: () => benchmarkMemory(diag), pct: 90 },
    ];

    for (const b of benchmarks) {
      setProgress(b.pct, `${b.name}...`);
      log(`▸ ${b.name}`, 'info');
      try {
        const results = await b.fn();
        for (const r of results) {
          log(`  ${r.inputSize}: ${r.executionTimeMs.toFixed(2)} ms — ${r.throughput} [${r.success ? 'PASS' : 'FAIL'}]`, r.success ? 'ok' : 'err');
          allResults.push(r);
        }
      } catch (e) {
        log(`  ERROR: ${(e as Error).message}`, 'err');
      }
    }

    setProgress(100, 'Done');
    log('', '');
    log('═══ FULL BENCHMARK COMPLETE ═══', 'info');
    log(`${allResults.length} tests run`, '');

    renderResultsTable(allResults);

    try {
      await saveResults(allResults, {
        adapter: diag.adapterName,
        os: detectOS(),
        browser: detectBrowser(),
      });
    } catch { /* ignore */ }
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    setProgress(0, 'Error');
  } finally {
    _running = false;
    if (runBtn) runBtn.disabled = false;
  }
}

async function runSustainedBenchmark() {
  if (_running) return;
  _running = true;

  const runBtn = _container?.querySelector('#btn-sustained') as HTMLButtonElement;
  if (runBtn) runBtn.disabled = true;

  const allResults: BenchmarkResult[] = [];

  try {
    log('═══ SUSTAINED LOAD BENCHMARK ═══', 'info');
    log('This will run 30s + 60s + 180s = 270s total', 'warn');
    log('Keep the screen on and do not switch tabs', 'warn');
    setProgress(0, 'Initializing GPU...');

    await initBenchmark();

    const sustainedResults = await benchmarkSustained((pct, msg) => {
      if (pct >= 0) setProgress(pct, msg);
      log(`  ${msg}`, '');
    });

    for (const r of sustainedResults) {
      log(`  ${r.name}: ${r.avgGflops.toFixed(1)} GFLOPS avg, throttled=${r.thermalThrottling}`, r.thermalThrottling ? 'warn' : 'ok');
      allResults.push(r);
    }

    setProgress(100, 'Done');
    log('', '');
    log('═══ SUSTAINED BENCHMARK COMPLETE ═══', 'info');

    renderResultsTable(allResults);

    try {
      await saveResults(allResults, {
        adapter: (await initBenchmark()).adapterName,
        os: detectOS(),
        browser: detectBrowser(),
      });
    } catch { /* ignore */ }
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
    setProgress(0, 'Error');
  } finally {
    _running = false;
    if (runBtn) runBtn.disabled = false;
  }
}

async function runCorrectnessTests() {
  if (_running) return;
  _running = true;

  try {
    log('═══ CORRECTNESS TESTS ═══', 'info');
    await initBenchmark();
    const tests = await runAllTests();
    let allPass = true;
    for (const t of tests) {
      log(`${t.pass ? '✓' : '✗'} ${t.name}: ${t.details} — max error: ${t.maxError.toExponential(2)}`, t.pass ? 'ok' : 'err');
      if (!t.pass) allPass = false;
    }
    log('', '');
    log(allPass ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED', allPass ? 'ok' : 'err');
  } catch (e) {
    log(`ERROR: ${(e as Error).message}`, 'err');
  } finally {
    _running = false;
  }
}

async function exportBenchmarkJSON() {
  try {
    const runs = await getAllRuns();
    if (runs.length === 0) {
      log('No results to export. Run a benchmark first.', 'warn');
      return;
    }
    const latest = runs[runs.length - 1];
    const json = exportJSON(latest.results, {
      adapter: latest.adapter,
      os: latest.os,
      browser: latest.browser,
      timestamp: latest.timestamp,
    });
    downloadJSON(json);
    log('JSON exported', 'ok');
  } catch (e) {
    log(`Export error: ${(e as Error).message}`, 'err');
  }
}

async function showHistory() {
  try {
    const runs = await getAllRuns();
    log(`── HISTORY: ${runs.length} saved runs ──`, 'info');
    for (const r of runs.slice(-5)) {
      log(`  ${r.timestamp} — ${r.results.length} results — ${r.adapter}`, '');
    }
  } catch (e) {
    log(`History error: ${(e as Error).message}`, 'err');
  }
}

async function clearHistory() {
  try {
    await clearAllRuns();
    log('History cleared', 'ok');
  } catch (e) {
    log(`Clear error: ${(e as Error).message}`, 'err');
  }
}

function detectOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes('iPhone') || ua.includes('iPad')) {
    const m = ua.match(/OS (\d+_\d+)/);
    return `iOS ${m ? m[1].replace('_', '.') : '?'}`;
  }
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Android')) return 'Android';
  return 'Unknown';
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Firefox')) return 'Firefox';
  return 'Unknown';
}

export function render(el: HTMLElement) {
  _container = el;
  el.innerHTML = `
    <h2>GPU Compute Benchmark</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Real WebGPU compute benchmarks running on the device GPU.
      All measurements from actual timed execution.
    </p>

    <div class="card" style="border-color:var(--border)">
      <div class="card-header">
        <span class="card-title">Device Info</span>
        <span class="badge badge-info" id="device-badge">NOT INITIALIZED</span>
      </div>
      <div id="device-info" style="font-size:12px;color:var(--text-dim);margin-top:8px"></div>
    </div>

    <div class="btn-row">
      <button class="btn" id="btn-quick">⚡ QUICK BENCHMARK</button>
      <button class="btn" id="btn-full">FULL BENCHMARK</button>
      <button class="btn btn-outline" id="btn-sustained">SUSTAINED (270s)</button>
      <button class="btn btn-outline" id="btn-tests">✓ TESTS ONLY</button>
    </div>

    <div class="btn-row">
      <button class="btn btn-outline" id="btn-export">EXPORT JSON</button>
      <button class="btn btn-outline" id="btn-history">HISTORY</button>
      <button class="btn btn-outline" id="btn-clear">CLEAR HISTORY</button>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0">
      <span id="progress-label" style="font-size:12px;color:var(--text-dim)">Ready</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" id="progress-fill" style="width:0%"></div>
    </div>

    <div id="results-table"></div>

    <div class="log" id="bench-log"></div>
  `;

  // Bind buttons
  el.querySelector('#btn-quick')?.addEventListener('click', runQuickBenchmark);
  el.querySelector('#btn-full')?.addEventListener('click', runFullBenchmark);
  el.querySelector('#btn-sustained')?.addEventListener('click', runSustainedBenchmark);
  el.querySelector('#btn-tests')?.addEventListener('click', runCorrectnessTests);
  el.querySelector('#btn-export')?.addEventListener('click', exportBenchmarkJSON);
  el.querySelector('#btn-history')?.addEventListener('click', showHistory);
  el.querySelector('#btn-clear')?.addEventListener('click', clearHistory);

  // Auto-initialize on load to show device info
  initBenchmark().then(diag => {
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
  });
}
