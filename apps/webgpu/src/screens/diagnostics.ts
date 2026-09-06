// AETHER WebGPU — Diagnostics Screen
// Real measurements only. Uses the complete diagnostic system.

import { runWebGPUDiagnostics, formatDiagnosticReport } from '../lib/webgpu-diagnostics';
import { detectGPU, getDevice, formatBytes } from '../lib/gpu';
import { Tensor } from '../lib/tensor';
import { benchmark, formatResult, setBenchmarkDevice } from '../lib/benchmark';
import { MATMUL_SHADER } from '../lib/shaders/kernels';

let logEl: HTMLElement | null = null;

function log(msg: string, cls: string = '') {
  if (!logEl) return;
  const line = document.createElement('div');
  line.className = `log-entry ${cls}`;
  line.textContent = msg;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

async function runDiagnostics(): Promise<void> {
  logEl!.innerHTML = '';

  // ── Step 1: Full WebGPU Diagnostic ──
  log('═══ AETHER WEBGPU DIAGNOSTICS ═══', 'info');
  log(`Timestamp: ${new Date().toISOString()}`, '');

  const d = await runWebGPUDiagnosticStep();
  if (!d) return;

  // ── Step 2: GPU Device + Memory Test ──
  const info = await detectGPU();
  if (!info) {
    log('Cannot proceed: GPU not ready', 'err');
    return;
  }

  log('', '');
  log('── MEMORY TEST ──', 'info');
  const device = await getDevice(info);
  setBenchmarkDevice(device);

  const maxBufMB = Math.floor(info.limits.maxBufferSize / 1048576);
  log(`Attempting to allocate buffer at reported max: ${maxBufMB} MB`, '');

  try {
    const testBuf = device.createBuffer({
      size: info.limits.maxBufferSize,
      usage: GPUBufferUsage.STORAGE,
    });
    log(`Buffer allocation at max: SUCCESS`, 'ok');
    testBuf.destroy();
  } catch (e) {
    log(`Buffer allocation at max: FAILED — ${(e as Error).message}`, 'warn');
    for (const mb of [256, 128, 64, 32]) {
      try {
        const testBuf = device.createBuffer({ size: mb * 1048576, usage: GPUBufferUsage.STORAGE });
        log(`Largest successful allocation: ${mb} MB`, 'ok');
        testBuf.destroy();
        break;
      } catch { continue; }
    }
  }

  // ── Step 3: Compute Benchmark ──
  log('', '');
  log('── COMPUTE THROUGHPUT ──', 'info');

  for (const N of [64, 128, 256]) {
    const A = Tensor.fromData(device, new Float32Array(N * N).fill(1.0), [N, N]);
    const B = Tensor.fromData(device, new Float32Array(N * N).fill(1.0), [N, N]);
    const C = new Tensor(device, [N, N]);

    const layout = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      ],
    });

    const pipeline = device.createComputePipeline({
      layout: device.createPipelineLayout({ bindGroupLayouts: [layout] }),
      compute: { module: device.createShaderModule({ code: MATMUL_SHADER }), entryPoint: 'main' },
    });

    const result = await benchmark(
      `matmul ${N}×${N}`,
      async () => {
        const ub = device.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
        const uniforms = new ArrayBuffer(12);
        new Uint32Array(uniforms).set([N, N, N]);
        device.queue.writeBuffer(ub, 0, uniforms);
        const bg = device.createBindGroup({
          layout,
          entries: [
            { binding: 0, resource: { buffer: ub } },
            { binding: 1, resource: { buffer: A.buffer } },
            { binding: 2, resource: { buffer: B.buffer } },
            { binding: 3, resource: { buffer: C.buffer } },
          ],
        });
        const enc = device.createCommandEncoder();
        const pass = enc.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bg);
        const wg = Math.ceil(N / 16);
        pass.dispatchWorkgroups(wg, wg, 1);
        pass.end();
        device.queue.submit([enc.finish()]);
        ub.destroy();
      },
      30,
      2 * N * N * N
    );

    log(formatResult(result), 'ok');
    A.destroy(); B.destroy(); C.destroy();
  }

  device.destroy();

  log('', '');
  log('═══ DIAGNOSTICS COMPLETE ═══', 'info');
}

async function runWebGPUDiagnosticStep(): Promise<boolean> {
  const d = await runWebGPUDiagnostics();
  const report = formatDiagnosticReport(d);

  log('── WEBGPU STATUS ──', 'info');
  log(`${d.statusLabel} (Case ${d.case})`, d.ready ? 'ok' : 'err');
  log(`Reason: ${d.reason}`, '');
  log(`Recommendation: ${d.recommendation}`, '');
  log('', '');
  log('── ENVIRONMENT ──', 'info');
  log(`  URL: ${d.environment.url}`, '');
  log(`  Secure Context: ${d.environment.isSecureContext}`, d.environment.isSecureContext ? 'ok' : 'err');
  log(`  Browser: ${d.environment.browserName} ${d.environment.browserVersion}`, '');
  log(`  OS: ${d.environment.osName} ${d.environment.osVersion}`, '');
  log(`  iOS: ${d.environment.isIOS}`, '');
  log(`  Safari: ${d.environment.isSafari}`, '');
  log(`  WebView: ${d.environment.isWebView}`, d.environment.isWebView ? 'err' : '');
  log(`  navigator.gpu: ${d.gpu.navigatorGpuExists}`, d.gpu.navigatorGpuExists ? 'ok' : 'err');

  if (d.gpu.adapterName) {
    log(`  Adapter: ${d.gpu.adapterName}`, 'ok');
    log(`  Vendor: ${d.gpu.adapterVendor}`, '');
  }
  if (d.gpu.adapterError) log(`  Adapter Error: ${d.gpu.adapterError}`, 'err');
  if (d.gpu.deviceError) log(`  Device Error: ${d.gpu.deviceError}`, 'err');

  if (!d.ready) {
    log('', '');
    log('Cannot run GPU benchmarks. Fix the issue above first.', 'err');
    return false;
  }

  return true;
}

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `;

  logEl = container.querySelector('#diag-log')!;

  container.querySelector('#btn-diag')!.addEventListener('click', () => {
    runDiagnostics();
  });
}
