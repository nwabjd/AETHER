// AETHER WebGPU — Model Test Screen
// Proves: JS → WebGPU → compute shader → tensor operation → result
// Then benchmarks: matmul, conv2d, attention

import { detectGPU, getDevice, formatBytes } from '../lib/gpu';
import { Tensor } from '../lib/tensor';
import { benchmark, formatResult, BenchmarkResult, setBenchmarkDevice } from '../lib/benchmark';
import {
  MATMUL_SHADER,
  CONV2D_SHADER,
  ATTENTION_SHADER,
  RELU_SHADER,
  SOFTMAX_SHADER,
} from '../lib/shaders/kernels';

let device: GPUDevice | null = null;
let logEl: HTMLElement | null = null;

function log(msg: string, cls: string = '') {
  if (!logEl) return;
  const line = document.createElement('div');
  line.className = `log-entry ${cls}`;
  line.textContent = msg;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

// ─── Tiny NN: proves the full pipeline works ───

async function runTinyNN(): Promise<boolean> {
  log('═══ TINY NEURAL NETWORK TEST ═══', 'info');
  log('Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)', 'info');
  log('');

  const info = await detectGPU();
  if (!info) { log('WebGPU not available', 'err'); return false; }
  device = await getDevice(info);
  setBenchmarkDevice(device);

  const t0 = performance.now();

  // Layer 1: input[4] @ W1[4,3] + b1[3] → ReLU
  const input = Tensor.fromData(device, new Float32Array([1.0, 0.5, -0.3, 0.8]), [4]);
  const W1 = Tensor.fromData(device, new Float32Array([
    0.2, -0.4, 0.1,
    0.5, 0.3, -0.2,
    -0.1, 0.6, 0.4,
    0.3, -0.1, 0.5,
  ]), [4, 3]);
  const b1 = Tensor.fromData(device, new Float32Array([0.1, -0.1, 0.2]), [3]);

  // Matmul: input[1,4] @ W1[4,3] = out[1,3]
  const uniforms = new ArrayBuffer(12);
  const uv = new Uint32Array(uniforms);
  uv[0] = 1; uv[1] = 3; uv[2] = 4; // M=1, N=3, K=4

  const layout1 = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
    ],
  });

  const pipeline1 = device.createComputePipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [layout1] }),
    compute: { module: device.createShaderModule({ code: MATMUL_SHADER }), entryPoint: 'main' },
  });

  const ubuf1 = device.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  device.queue.writeBuffer(ubuf1, 0, uniforms);

  const h1 = new Tensor(device, [1, 3]);

  const bg1 = device.createBindGroup({
    layout: layout1,
    entries: [
      { binding: 0, resource: { buffer: ubuf1 } },
      { binding: 1, resource: { buffer: input.buffer } },
      { binding: 2, resource: { buffer: W1.buffer } },
      { binding: 3, resource: { buffer: h1.buffer } },
    ],
  });

  let enc = device.createCommandEncoder();
  let pass = enc.beginComputePass();
  pass.setPipeline(pipeline1);
  pass.setBindGroup(0, bg1);
  pass.dispatchWorkgroups(1, 1, 1);
  pass.end();
  device.queue.submit([enc.finish()]);

  log(`  input[4]:  [${Array.from(await input.readback()).map(v => v.toFixed(2)).join(', ')}]`, '');
  log(`  W1[4×3]:   4 rows × 3 cols`, '');
  log(`  Matmul result: computing...`, '');

  const h1data = await h1.readback();
  log(`  h1 = input @ W1: [${Array.from(h1data).map(v => v.toFixed(3)).join(', ')}]`, 'ok');

  // Add bias
  for (let i = 0; i < 3; i++) h1data[i] += [0.1, -0.1, 0.2][i];
  device.queue.writeBuffer(h1.buffer, 0, h1data.buffer);
  log(`  h1 + bias:       [${Array.from(h1data).map(v => v.toFixed(3)).join(', ')}]`, 'ok');

  // ReLU via compute shader
  const reluLayout = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
    ],
  });

  const reluPipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [reluLayout] }),
    compute: { module: device.createShaderModule({ code: RELU_SHADER }), entryPoint: 'main' },
  });

  const reluUniforms = new ArrayBuffer(4);
  new Uint32Array(reluUniforms)[0] = 3;
  const reluUbuf = device.createBuffer({ size: 4, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  device.queue.writeBuffer(reluUbuf, 0, reluUniforms);

  const reluBg = device.createBindGroup({
    layout: reluLayout,
    entries: [
      { binding: 0, resource: { buffer: reluUbuf } },
      { binding: 1, resource: { buffer: h1.buffer } },
    ],
  });

  enc = device.createCommandEncoder();
  pass = enc.beginComputePass();
  pass.setPipeline(reluPipeline);
  pass.setBindGroup(0, reluBg);
  pass.dispatchWorkgroups(1, 1, 1);
  pass.end();
  device.queue.submit([enc.finish()]);

  const h1_relu = await h1.readback();
  log(`  ReLU(h1):         [${Array.from(h1_relu).map(v => v.toFixed(3)).join(', ')}]`, 'ok');

  // Layer 2: h1_relu[3] @ W2[3,1] = output[1]
  const W2 = Tensor.fromData(device, new Float32Array([0.7, -0.3, 0.5]), [3, 1]);
  const output = new Tensor(device, [1, 1]);

  const uniforms2 = new ArrayBuffer(12);
  const uv2 = new Uint32Array(uniforms2);
  uv2[0] = 1; uv2[1] = 1; uv2[2] = 3; // M=1, N=1, K=3

  const layout2 = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
    ],
  });

  const pipeline2 = device.createComputePipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [layout2] }),
    compute: { module: device.createShaderModule({ code: MATMUL_SHADER }), entryPoint: 'main' },
  });

  const ubuf2 = device.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  device.queue.writeBuffer(ubuf2, 0, uniforms2);

  const bg2 = device.createBindGroup({
    layout: layout2,
    entries: [
      { binding: 0, resource: { buffer: ubuf2 } },
      { binding: 1, resource: { buffer: h1.buffer } },
      { binding: 2, resource: { buffer: W2.buffer } },
      { binding: 3, resource: { buffer: output.buffer } },
    ],
  });

  enc = device.createCommandEncoder();
  pass = enc.beginComputePass();
  pass.setPipeline(pipeline2);
  pass.setBindGroup(0, bg2);
  pass.dispatchWorkgroups(1, 1, 1);
  pass.end();
  device.queue.submit([enc.finish()]);

  const outData = await output.readback();
  const elapsed = (performance.now() - t0).toFixed(1);
  log(`  Final output: ${outData[0].toFixed(4)}`, 'ok');
  log(`  Total pipeline: ${elapsed} ms`, 'ok');
  log('', '');
  log('✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result', 'ok');

  // Cleanup
  input.destroy(); W1.destroy(); b1.destroy(); h1.destroy();
  W2.destroy(); output.destroy(); ubuf1.destroy(); ubuf2.destroy();
  reluUbuf.destroy();
  device.destroy();

  return true;
}

// ─── Matrix Multiplication Benchmark ───

async function runMatmulBench(): Promise<BenchmarkResult | null> {
  log('═══ MATRIX MULTIPLICATION BENCHMARK ═══', 'info');

  const info = await detectGPU();
  if (!info) return null;
  device = await getDevice(info);
  setBenchmarkDevice(device);

  const sizes = [64, 128, 256, 512];
  const results: BenchmarkResult[] = [];

  for (const N of sizes) {
    const A = Tensor.fromData(device, new Float32Array(N * N).fill(1.0), [N, N]);
    const B = Tensor.fromData(device, new Float32Array(N * N).fill(0.5), [N, N]);
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

    const uniforms = new ArrayBuffer(12);
    const uv = new Uint32Array(uniforms);
    uv[0] = N; uv[1] = N; uv[2] = N;

    const result = await benchmark(
      `${N}×${N} matmul`,
      async () => {
        const ub = device!.createBuffer({ size: 12, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
        device!.queue.writeBuffer(ub, 0, uniforms);
        const bg = device!.createBindGroup({
          layout,
          entries: [
            { binding: 0, resource: { buffer: ub } },
            { binding: 1, resource: { buffer: A.buffer } },
            { binding: 2, resource: { buffer: B.buffer } },
            { binding: 3, resource: { buffer: C.buffer } },
          ],
        });
        const enc = device!.createCommandEncoder();
        const pass = enc.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bg);
        const wg = Math.ceil(N / 16);
        pass.dispatchWorkgroups(wg, wg, 1);
        pass.end();
        device!.queue.submit([enc.finish()]);
        ub.destroy();
      },
      30,
      2 * N * N * N // FLOPs for matmul
    );

    results.push(result);
    log(formatResult(result), 'ok');

    A.destroy(); B.destroy(); C.destroy();
  }

  device.destroy();
  return results[results.length - 1];
}

// ─── Conv2D Benchmark ───

async function runConvBench(): Promise<BenchmarkResult | null> {
  log('═══ CONVOLUTION BENCHMARK ═══', 'info');

  const info = await detectGPU();
  if (!info) return null;
  device = await getDevice(info);
  setBenchmarkDevice(device);

  const N = 1, C = 3, H = 32, W = 32, F = 8, KH = 3, KW = 3;
  const OH = H - KH + 1, OW = W - KW + 1;

  const input = Tensor.fromData(device, new Float32Array(N * C * H * W).fill(0.5), [N, C, H, W]);
  const kernel = Tensor.fromData(device, new Float32Array(F * C * KH * KW).fill(0.1), [F, C, KH, KW]);
  const output = new Tensor(device, [N, F, OH, OW]);

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
    compute: { module: device.createShaderModule({ code: CONV2D_SHADER }), entryPoint: 'main' },
  });

  const uniforms = new ArrayBuffer(36);
  const uv = new Uint32Array(uniforms);
  uv[0] = N; uv[1] = C; uv[2] = H; uv[3] = W;
  uv[4] = F; uv[5] = KH; uv[6] = KW; uv[7] = OH; uv[8] = OW;

  const result = await benchmark(
    `Conv2D ${N}×${C}×${H}×${W} k=${KH}→${F}×${OH}×${OW}`,
    async () => {
      const ub = device!.createBuffer({ size: 36, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      device!.queue.writeBuffer(ub, 0, uniforms);
      const bg = device!.createBindGroup({
        layout,
        entries: [
          { binding: 0, resource: { buffer: ub } },
          { binding: 1, resource: { buffer: input.buffer } },
          { binding: 2, resource: { buffer: kernel.buffer } },
          { binding: 3, resource: { buffer: output.buffer } },
        ],
      });
      const enc = device!.createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(N, F, 1);
      pass.end();
      device!.queue.submit([enc.finish()]);
      ub.destroy();
    },
    20,
    2 * N * F * C * KH * KW * OH * OW
  );

  log(formatResult(result), 'ok');
  input.destroy(); kernel.destroy(); output.destroy();
  device.destroy();
  return result;
}

// ─── Attention Benchmark ───

async function runAttentionBench(): Promise<BenchmarkResult | null> {
  log('═══ ATTENTION BENCHMARK ═══', 'info');

  const info = await detectGPU();
  if (!info) return null;
  device = await getDevice(info);
  setBenchmarkDevice(device);

  const batch = 1, seq = 64, dim = 64;
  const scale = 1.0 / Math.sqrt(dim);

  const Q = Tensor.fromData(device, new Float32Array(batch * seq * dim).fill(0.1), [batch, seq, dim]);
  const K = Tensor.fromData(device, new Float32Array(batch * seq * dim).fill(0.1), [batch, seq, dim]);
  const V = Tensor.fromData(device, new Float32Array(batch * seq * dim).fill(0.1), [batch, seq, dim]);
  const out = new Tensor(device, [batch, seq, dim]);
  const scores = new Tensor(device, [batch, seq, seq]);

  const layout = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
    ],
  });

  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [layout] }),
    compute: { module: device.createShaderModule({ code: ATTENTION_SHADER }), entryPoint: 'main' },
  });

  const uniforms = new ArrayBuffer(16);
  const uv = new Uint32Array(uniforms);
  const fv = new Float32Array(uniforms);
  uv[0] = batch; uv[1] = seq; uv[2] = dim;
  fv[3] = scale;

  const result = await benchmark(
    `Attention b=${batch} s=${seq} d=${dim}`,
    async () => {
      const ub = device!.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      device!.queue.writeBuffer(ub, 0, uniforms);
      const bg = device!.createBindGroup({
        layout,
        entries: [
          { binding: 0, resource: { buffer: ub } },
          { binding: 1, resource: { buffer: Q.buffer } },
          { binding: 2, resource: { buffer: K.buffer } },
          { binding: 3, resource: { buffer: V.buffer } },
          { binding: 4, resource: { buffer: out.buffer } },
          { binding: 5, resource: { buffer: scores.buffer } },
        ],
      });
      const enc = device!.createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(batch, 1, 1);
      pass.end();
      device!.queue.submit([enc.finish()]);
      ub.destroy();
    },
    20
  );

  log(formatResult(result), 'ok');
  Q.destroy(); K.destroy(); V.destroy(); out.destroy(); scores.destroy();
  device.destroy();
  return result;
}

// ─── Render ───

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `;

  logEl = container.querySelector('#model-log')!;

  container.querySelector('#btn-tiny-nn')!.addEventListener('click', async () => {
    logEl!.innerHTML = '';
    await runTinyNN();
  });

  container.querySelector('#btn-all-bench')!.addEventListener('click', async () => {
    logEl!.innerHTML = '';
    await runTinyNN();
    log('', '');
    await runMatmulBench();
    log('', '');
    await runConvBench();
    log('', '');
    await runAttentionBench();
    log('', '');
    log('═══ ALL BENCHMARKS COMPLETE ═══', 'info');
  });
}
