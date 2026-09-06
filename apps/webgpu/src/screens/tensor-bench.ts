// AETHER Tensor Runtime — Benchmark Screen
// Correctness tests + performance benchmarks: CPU vs GPU

import { Tensor } from '../runtime/tensor';
import { TensorShape } from '../runtime/tensor-shape';
import { initGPUContext, destroyGPUContext } from '../runtime/gpu-context';
import {
  opMatmul, opAdd, opMultiply, opRMSNorm, opLayerNorm,
  opSoftmax, opRoPE, opConv2D, opTranspose2D, opInterpolate,
  refMatmul, refAdd, refMultiply, refRMSNorm, refLayerNorm,
  refSoftmax, refRoPE, refConv2D, refTranspose2D, refInterpolate,
} from '../runtime/kernels/ops';

interface BenchResult {
  name: string;
  shape: string;
  cpuMs: number;
  gpuMs: number;
  speedup: number;
  correct: boolean;
  tolerance: number;
}

let logEl: HTMLElement | null = null;
let tableBody: HTMLElement | null = null;

function log(msg: string, cls: string = '') {
  if (!logEl) return;
  const line = document.createElement('div');
  line.className = `log-entry ${cls}`;
  line.textContent = msg;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

function approxEqual(a: Float32Array, b: Float32Array, tol: number = 1e-3): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const diff = Math.abs(a[i] - b[i]);
    const norm = Math.max(Math.abs(a[i]), Math.abs(b[i]), 1e-8);
    if (diff / norm > tol) return false;
  }
  return true;
}

async function benchCPU(name: string, fn: () => void, iterations: number = 20): Promise<number> {
  // Warmup
  for (let i = 0; i < 3; i++) fn();
  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  return times.reduce((a, b) => a + b, 0) / times.length;
}

async function benchGPU(name: string, fn: () => Promise<void>, iterations: number = 20): Promise<number> {
  const times: number[] = [];
  for (let i = 0; i < Math.min(5, iterations); i++) await fn();
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    times.push(performance.now() - start);
  }
  return times.reduce((a, b) => a + b, 0) / times.length;
}

function addRow(result: BenchResult) {
  if (!tableBody) return;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td style="font-weight:600">${result.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${result.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${result.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${result.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${result.speedup >= 1 ? 'var(--green)' : 'var(--red)'}">
      ${result.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${result.correct ? 'badge-pass' : 'badge-fail'}">${result.correct ? 'PASS' : 'FAIL'}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${result.tolerance.toExponential(1)}</td>
  `;
  tableBody.appendChild(tr);
}

async function runAllBenchmarks() {
  logEl!.innerHTML = '';
  tableBody!.innerHTML = '';

  log('═══ TENSOR RUNTIME BENCHMARKS ═══', 'info');
  log('Initializing WebGPU...', '');

  let ctx;
  try {
    ctx = await initGPUContext();
  } catch (e) {
    log(`FATAL: ${(e as Error).message}`, 'err');
    log('WebGPU is not available. Cannot run GPU benchmarks.', 'err');
    return;
  }

  log(`GPU: ${(ctx.adapter as any).name ?? 'Unknown'}`, 'ok');
  log('Running benchmarks...\n', '');

  const results: BenchResult[] = [];

  // ─── Matmul 64×64 ───
  {
    const M = 64, N = 64, K = 64;
    const A = Tensor.randn([M, K]);
    const B = Tensor.randn([K, N]);
    const aData = await A.readback();
    const bData = await B.readback();

    const cpuTime = await benchCPU('matmul 64', () => refMatmul(aData, bData, M, N, K));
    const gpuTime = await benchGPU('matmul 64', async () => {
      const C = await opMatmul(A, B, M, N, K);
      C.destroy();
    });

    const gpuResult = await (await opMatmul(A, B, M, N, K)).readback();
    const cpuResult = refMatmul(aData, bData, M, N, K);
    const correct = approxEqual(cpuResult, gpuResult);
    const maxDiff = Math.max(...Array.from(cpuResult).map((v, i) => Math.abs(v - gpuResult[i])));

    results.push({ name: 'Matmul', shape: `${M}×${K} @ ${K}×${N}`, cpuMs: cpuTime, gpuMs: gpuTime, speedup: cpuTime / gpuTime, correct, tolerance: maxDiff });
    A.destroy(); B.destroy();
  }

  // ─── Matmul 256×256 ───
  {
    const M = 256, N = 256, K = 256;
    const A = Tensor.randn([M, K]);
    const B = Tensor.randn([K, N]);
    const aData = await A.readback();
    const bData = await B.readback();

    const cpuTime = await benchCPU('matmul 256', () => refMatmul(aData, bData, M, N, K), 10);
    const gpuTime = await benchGPU('matmul 256', async () => {
      const C = await opMatmul(A, B, M, N, K);
      C.destroy();
    });

    const gpuResult = await (await opMatmul(A, B, M, N, K)).readback();
    const cpuResult = refMatmul(aData, bData, M, N, K);
    const correct = approxEqual(cpuResult, gpuResult);
    const maxDiff = Math.max(...Array.from(cpuResult).map((v, i) => Math.abs(v - gpuResult[i])));

    results.push({ name: 'Matmul', shape: `${M}×${K} @ ${K}×${N}`, cpuMs: cpuTime, gpuMs: gpuTime, speedup: cpuTime / gpuTime, correct, tolerance: maxDiff });
    A.destroy(); B.destroy();
  }

  // ─── Matmul 512×512 ───
  {
    const M = 512, N = 512, K = 512;
    const A = Tensor.randn([M, K]);
    const B = Tensor.randn([K, N]);
    const aData = await A.readback();
    const bData = await B.readback();

    const cpuTime = await benchCPU('matmul 512', () => refMatmul(aData, bData, M, N, K), 5);
    const gpuTime = await benchGPU('matmul 512', async () => {
      const C = await opMatmul(A, B, M, N, K);
      C.destroy();
    });

    const gpuResult = await (await opMatmul(A, B, M, N, K)).readback();
    const cpuResult = refMatmul(aData, bData, M, N, K);
    const correct = approxEqual(cpuResult, gpuResult);
    const maxDiff = Math.max(...Array.from(cpuResult).map((v, i) => Math.abs(v - gpuResult[i])));

    results.push({ name: 'Matmul', shape: `${M}×${K} @ ${K}×${N}`, cpuMs: cpuTime, gpuMs: gpuTime, speedup: cpuTime / gpuTime, correct, tolerance: maxDiff });
    A.destroy(); B.destroy();
  }

  // ─── Add 1M elements ───
  {
    const N = 1_000_000;
    const A = Tensor.randn([N]);
    const B = Tensor.randn([N]);
    const aData = await A.readback();
    const bData = await B.readback();

    const cpuTime = await benchCPU('add 1M', () => refAdd(aData, bData));
    const gpuTime = await benchGPU('add 1M', async () => {
      const C = await opAdd(A, B);
      C.destroy();
    });

    const gpuResult = await (await opAdd(A, B)).readback();
    const cpuResult = refAdd(aData, bData);
    const correct = approxEqual(cpuResult, gpuResult);
    const maxDiff = Math.max(...Array.from(cpuResult).map((v, i) => Math.abs(v - gpuResult[i])));

    results.push({ name: 'Add', shape: `[${N}]`, cpuMs: cpuTime, gpuMs: gpuTime, speedup: cpuTime / gpuTime, correct, tolerance: maxDiff });
    A.destroy(); B.destroy();
  }

  // ─── Multiply 1M elements ───
  {
    const N = 1_000_000;
    const A = Tensor.randn([N]);
    const B = Tensor.randn([N]);
    const aData = await A.readback();
    const bData = await B.readback();

    const cpuTime = await benchCPU('mul 1M', () => refMultiply(aData, bData));
    const gpuTime = await benchGPU('mul 1M', async () => {
      const C = await opMultiply(A, B);
      C.destroy();
    });

    const gpuResult = await (await opMultiply(A, B)).readback();
    const cpuResult = refMultiply(aData, bData);
    const correct = approxEqual(cpuResult, gpuResult);
    const maxDiff = Math.max(...Array.from(cpuResult).map((v, i) => Math.abs(v - gpuResult[i])));

    results.push({ name: 'Multiply', shape: `[${N}]`, cpuMs: cpuTime, gpuMs: gpuTime, speedup: cpuTime / gpuTime, correct, tolerance: maxDiff });
    A.destroy(); B.destroy();
  }

  // ─── RMSNorm ───
  {
    const N = 1024;
    const input = Tensor.randn([N]);
    const weight = Tensor.ones([N]);
    const inputData = await input.readback();
    const weightData = await weight.readback();

    const cpuTime = await benchCPU('rmsnorm', () => refRMSNorm(inputData, weightData));
    const gpuTime = await benchGPU('rmsnorm', async () => {
      const C = await opRMSNorm(input, weight);
      C.destroy();
    });

    const gpuResult = await (await opRMSNorm(input, weight)).readback();
    const cpuResult = refRMSNorm(inputData, weightData);
    const correct = approxEqual(cpuResult, gpuResult);
    const maxDiff = Math.max(...Array.from(cpuResult).map((v, i) => Math.abs(v - gpuResult[i])));

    results.push({ name: 'RMSNorm', shape: `[${N}]`, cpuMs: cpuTime, gpuMs: gpuTime, speedup: cpuTime / gpuTime, correct, tolerance: maxDiff });
    input.destroy(); weight.destroy();
  }

  // ─── LayerNorm ───
  {
    const N = 1024;
    const input = Tensor.randn([N]);
    const gamma = Tensor.ones([N]);
    const beta = Tensor.zeros([N]);
    const inputData = await input.readback();
    const gammaData = await gamma.readback();
    const betaData = await beta.readback();

    const cpuTime = await benchCPU('layernorm', () => refLayerNorm(inputData, gammaData, betaData));
    const gpuTime = await benchGPU('layernorm', async () => {
      const C = await opLayerNorm(input, gamma, beta);
      C.destroy();
    });

    const gpuResult = await (await opLayerNorm(input, gamma, beta)).readback();
    const cpuResult = refLayerNorm(inputData, gammaData, betaData);
    const correct = approxEqual(cpuResult, gpuResult);
    const maxDiff = Math.max(...Array.from(cpuResult).map((v, i) => Math.abs(v - gpuResult[i])));

    results.push({ name: 'LayerNorm', shape: `[${N}]`, cpuMs: cpuTime, gpuMs: gpuTime, speedup: cpuTime / gpuTime, correct, tolerance: maxDiff });
    input.destroy(); gamma.destroy(); beta.destroy();
  }

  // ─── Softmax ───
  {
    const rows = 32, cols = 128;
    const data = Tensor.randn([rows, cols]);
    const dataData = await data.readback();

    const cpuTime = await benchCPU('softmax', () => refSoftmax(new Float32Array(dataData), rows, cols));
    const gpuTime = await benchGPU('softmax', async () => {
      const C = await opSoftmax(Tensor.fromFloat32(new Float32Array(dataData), [rows, cols]), rows, cols);
      C.destroy();
    });

    const gpuResult = await (await opSoftmax(Tensor.fromFloat32(new Float32Array(dataData), [rows, cols]), rows, cols)).readback();
    const cpuResult = refSoftmax(new Float32Array(dataData), rows, cols);
    const correct = approxEqual(cpuResult, gpuResult);
    const maxDiff = Math.max(...Array.from(cpuResult).map((v, i) => Math.abs(v - gpuResult[i])));

    results.push({ name: 'Softmax', shape: `[${rows}, ${cols}]`, cpuMs: cpuTime, gpuMs: gpuTime, speedup: cpuTime / gpuTime, correct, tolerance: maxDiff });
    data.destroy();
  }

  // ─── RoPE ───
  {
    const seq = 16, dim = 128;
    const data = Tensor.randn([seq, dim]);
    const dataData = await data.readback();

    const cpuTime = await benchCPU('rope', () => refRoPE(new Float32Array(dataData), seq, dim));
    const gpuTime = await benchGPU('rope', async () => {
      const C = await opRoPE(Tensor.fromFloat32(new Float32Array(dataData), [seq, dim]), seq, dim);
      C.destroy();
    });

    const gpuResult = await (await opRoPE(Tensor.fromFloat32(new Float32Array(dataData), [seq, dim]), seq, dim)).readback();
    const cpuResult = refRoPE(new Float32Array(dataData), seq, dim);
    const correct = approxEqual(cpuResult, gpuResult);
    const maxDiff = Math.max(...Array.from(cpuResult).map((v, i) => Math.abs(v - gpuResult[i])));

    results.push({ name: 'RoPE', shape: `[${seq}, ${dim}]`, cpuMs: cpuTime, gpuMs: gpuTime, speedup: cpuTime / gpuTime, correct, tolerance: maxDiff });
    data.destroy();
  }

  // ─── Conv2D ───
  {
    const N = 1, C = 3, H = 16, W = 16, F = 4, KH = 3, KW = 3;
    const input = Tensor.randn([N, C, H, W]);
    const kernel = Tensor.randn([F, C, KH, KW]);
    const inputData = await input.readback();
    const kernelData = await kernel.readback();

    const cpuTime = await benchCPU('conv2d', () => refConv2D(inputData, kernelData, N, C, H, W, F, KH, KW));
    const gpuTime = await benchGPU('conv2d', async () => {
      const O = await opConv2D(input, kernel, N, C, H, W, F, KH, KW);
      O.destroy();
    });

    const gpuResult = await (await opConv2D(input, kernel, N, C, H, W, F, KH, KW)).readback();
    const cpuResult = refConv2D(inputData, kernelData, N, C, H, W, F, KH, KW);
    const correct = approxEqual(cpuResult, gpuResult);
    const maxDiff = Math.max(...Array.from(cpuResult).map((v, i) => Math.abs(v - gpuResult[i])));

    results.push({ name: 'Conv2D', shape: `[${N},${C},${H},${W}] k=${KH}→${F}`, cpuMs: cpuTime, gpuMs: gpuTime, speedup: cpuTime / gpuTime, correct, tolerance: maxDiff });
    input.destroy(); kernel.destroy();
  }

  // ─── Transpose 2D ───
  {
    const rows = 256, cols = 256;
    const data = Tensor.randn([rows, cols]);
    const dataData = await data.readback();

    const cpuTime = await benchCPU('transpose', () => refTranspose2D(dataData, rows, cols));
    const gpuTime = await benchGPU('transpose', async () => {
      const C = await opTranspose2D(data, rows, cols);
      C.destroy();
    });

    const gpuResult = await (await opTranspose2D(data, rows, cols)).readback();
    const cpuResult = refTranspose2D(dataData, rows, cols);
    const correct = approxEqual(cpuResult, gpuResult);
    const maxDiff = Math.max(...Array.from(cpuResult).map((v, i) => Math.abs(v - gpuResult[i])));

    results.push({ name: 'Transpose', shape: `[${rows}, ${cols}]`, cpuMs: cpuTime, gpuMs: gpuTime, speedup: cpuTime / gpuTime, correct, tolerance: maxDiff });
    data.destroy();
  }

  // ─── Interpolate ───
  {
    const inW = 32, inH = 32, outW = 64, outH = 64, ch = 3;
    const data = Tensor.randn([inH * inW * ch]);
    const dataData = await data.readback();

    const cpuTime = await benchCPU('interp', () => refInterpolate(dataData, inW, inH, outW, outH, ch));
    const gpuTime = await benchGPU('interp', async () => {
      const C = await opInterpolate(data, inW, inH, outW, outH, ch);
      C.destroy();
    });

    const gpuResult = await (await opInterpolate(data, inW, inH, outW, outH, ch)).readback();
    const cpuResult = refInterpolate(dataData, inW, inH, outW, outH, ch);
    const correct = approxEqual(cpuResult, gpuResult);
    const maxDiff = Math.max(...Array.from(cpuResult).map((v, i) => Math.abs(v - gpuResult[i])));

    results.push({ name: 'Interpolate', shape: `${inW}×${inH} → ${outW}×${outH} ch=${ch}`, cpuMs: cpuTime, gpuMs: gpuTime, speedup: cpuTime / gpuTime, correct, tolerance: maxDiff });
    data.destroy();
  }

  // ─── Render results ───
  log('', '');
  log('═══ RESULTS ═══', 'info');

  for (const r of results) {
    addRow(r);
    const status = r.correct ? '✓' : '✗';
    const cls = r.correct ? 'ok' : 'err';
    log(`${status} ${r.name} (${r.shape}): CPU ${r.cpuMs.toFixed(2)} ms | GPU ${r.gpuMs.toFixed(2)} ms | ${r.speedup.toFixed(1)}× | max diff ${r.tolerance.toExponential(1)}`, cls);
  }

  const passed = results.filter(r => r.correct).length;
  log('', '');
  log(`═══ ${passed}/${results.length} CORRECT ═══`, passed === results.length ? 'ok' : 'err');

  destroyGPUContext();
}

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <h2>Tensor Runtime Benchmarks</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Each operation: GPU implementation, CPU reference, correctness verification, and performance comparison.
      All measurements are real. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="bench-log"></div>

    <div style="overflow-x:auto;margin-top:16px">
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="border-bottom:2px solid var(--border);text-align:left">
            <th style="padding:8px 12px;color:var(--text-dim)">Operation</th>
            <th style="padding:8px 12px;color:var(--text-dim)">Shape</th>
            <th style="padding:8px 12px;color:var(--text-dim)">CPU</th>
            <th style="padding:8px 12px;color:var(--text-dim)">GPU</th>
            <th style="padding:8px 12px;color:var(--text-dim)">Speedup</th>
            <th style="padding:8px 12px;color:var(--text-dim)">Correct</th>
            <th style="padding:8px 12px;color:var(--text-dim)">Max Diff</th>
          </tr>
        </thead>
        <tbody id="bench-tbody"></tbody>
      </table>
    </div>
  `;

  logEl = container.querySelector('#bench-log')!;
  tableBody = container.querySelector('#bench-tbody')!;

  container.querySelector('#btn-run-bench')!.addEventListener('click', () => {
    runAllBenchmarks();
  });
}
