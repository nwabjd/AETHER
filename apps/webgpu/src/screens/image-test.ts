// AETHER WebGPU — Image Test Screen
// GPU-accelerated image processing via compute shaders

import { detectGPU, getDevice, formatBytes } from '../lib/gpu';
import { Tensor } from '../lib/tensor';
import {
  IMAGE_KERNEL_SHADER,
  GRAYSCALE_SHADER,
} from '../lib/shaders/kernels';
import { setBenchmarkDevice, benchmark, formatResult } from '../lib/benchmark';

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

function createTestImage(w: number, h: number): Float32Array {
  const data = new Float32Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      // Checkerboard pattern with color gradient
      const checker = ((x >> 4) + (y >> 4)) & 1;
      data[i + 0] = checker ? 0.9 : (x / w) * 0.8; // R
      data[i + 1] = checker ? 0.3 : (y / h) * 0.6; // G
      data[i + 2] = checker ? 0.6 : 0.4;             // B
      data[i + 3] = 1.0;                              // A
    }
  }
  return data;
}

function floatToCanvas(data: Float32Array, w: number, h: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  for (let i = 0; i < w * h * 4; i++) {
    img.data[i] = Math.round(data[i] * 255);
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

async function runGrayscaleTest(): Promise<void> {
  log('═══ GRAYSCALE TEST ═══', 'info');

  const info = await detectGPU();
  if (!info) { log('WebGPU unavailable', 'err'); return; }
  device = await getDevice(info);
  setBenchmarkDevice(device);

  const W = 256, H = 256;
  const pixels = createTestImage(W, H);
  const input = Tensor.fromData(device, pixels, [W * H * 4]);
  const output = new Tensor(device, [W * H * 4]);

  const layout = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
    ],
  });

  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [layout] }),
    compute: { module: device.createShaderModule({ code: GRAYSCALE_SHADER }), entryPoint: 'main' },
  });

  const uniforms = new ArrayBuffer(4);
  new Uint32Array(uniforms)[0] = W * H;

  const result = await benchmark('Grayscale 256×256', async () => {
    const ub = device!.createBuffer({ size: 4, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    device!.queue.writeBuffer(ub, 0, uniforms);
    const bg = device!.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: { buffer: ub } },
        { binding: 1, resource: { buffer: input.buffer } },
        { binding: 2, resource: { buffer: output.buffer } },
      ],
    });
    const enc = device!.createCommandEncoder();
    const pass = enc.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(Math.ceil(W * H / 256), 1, 1);
    pass.end();
    device!.queue.submit([enc.finish()]);
    ub.destroy();
  }, 50);

  log(formatResult(result), 'ok');

  const outData = await output.readback();
  const inputCanvas = floatToCanvas(pixels, W, H);
  const outputCanvas = floatToCanvas(outData, W, H);

  const display = containerRef?.querySelector('#image-display');
  if (display) {
    display.innerHTML = '';
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0';

    const inWrap = document.createElement('div');
    inWrap.innerHTML = '<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>';
    inWrap.appendChild(inputCanvas);

    const outWrap = document.createElement('div');
    outWrap.innerHTML = '<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>';
    outWrap.appendChild(outputCanvas);

    row.appendChild(inWrap);
    row.appendChild(outWrap);
    display.appendChild(row);
  }

  input.destroy(); output.destroy();
  device.destroy();
  log('✓ Grayscale complete', 'ok');
}

async function runConvolutionTest(): Promise<void> {
  log('═══ CONVOLUTION KERNEL TEST ═══', 'info');

  const info = await detectGPU();
  if (!info) { log('WebGPU unavailable', 'err'); return; }
  device = await getDevice(info);
  setBenchmarkDevice(device);

  const W = 128, H = 128, K = 3;
  const pixels = createTestImage(W, H);

  const kernels: Record<string, Float32Array> = {
    'Edge Detect': new Float32Array([
      -1, -1, -1,
      -1,  8, -1,
      -1, -1, -1,
    ]),
    'Sharpen': new Float32Array([
      0, -1,  0,
     -1,  5, -1,
      0, -1,  0,
    ]),
    'Blur': new Float32Array([
      1/9, 1/9, 1/9,
      1/9, 1/9, 1/9,
      1/9, 1/9, 1/9,
    ]),
    'Emboss': new Float32Array([
     -2, -1,  0,
     -1,  1,  1,
      0,  1,  2,
    ]),
  };

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
    compute: { module: device.createShaderModule({ code: IMAGE_KERNEL_SHADER }), entryPoint: 'main' },
  });

  const uniforms = new ArrayBuffer(16);
  const uv = new Uint32Array(uniforms);
  uv[0] = W; uv[1] = H; uv[2] = K; uv[3] = 0; // mode 0 = convolve

  for (const [name, kernelData] of Object.entries(kernels)) {
    const input = Tensor.fromData(device, pixels, [W * H * 4]);
    const kernel = Tensor.fromData(device, kernelData, [K * K]);
    const output = new Tensor(device, [W * H * 4]);

    const result = await benchmark(`Conv ${name} ${W}×${H}`, async () => {
      const ub = device!.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      device!.queue.writeBuffer(ub, 0, uniforms);
      const bg = device!.createBindGroup({
        layout,
        entries: [
          { binding: 0, resource: { buffer: ub } },
          { binding: 1, resource: { buffer: kernel.buffer } },
          { binding: 2, resource: { buffer: input.buffer } },
          { binding: 3, resource: { buffer: output.buffer } },
        ],
      });
      const enc = device!.createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.dispatchWorkgroups(Math.ceil(W / 16), Math.ceil(H / 16), 1);
      pass.end();
      device!.queue.submit([enc.finish()]);
      ub.destroy();
    }, 30);

    log(formatResult(result), 'ok');

    const outData = await output.readback();
    const display = containerRef?.querySelector('#image-display');
    if (display) {
      const outCanvas = floatToCanvas(outData, W, H);
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:inline-block;margin:4px';
      wrap.innerHTML = `<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${name}</div>`;
      wrap.appendChild(outCanvas);
      display.appendChild(wrap);
    }

    input.destroy(); kernel.destroy(); output.destroy();
  }

  device.destroy();
  log('✓ All convolution kernels applied', 'ok');
}

let containerRef: HTMLElement | null = null;

export function render(container: HTMLElement): void {
  containerRef = container;
  container.innerHTML = `
    <h2>Image Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      GPU-accelerated image processing using WebGPU compute shaders.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-grayscale">Run Grayscale</button>
      <button class="btn btn-outline" id="btn-conv">Run Convolution Kernels</button>
      <button class="btn btn-outline" id="btn-all-img">Run All</button>
    </div>

    <div class="log" id="image-log"></div>
    <div id="image-display"></div>
  `;

  logEl = container.querySelector('#image-log')!;

  container.querySelector('#btn-grayscale')!.addEventListener('click', async () => {
    logEl!.innerHTML = '';
    container.querySelector('#image-display')!.innerHTML = '';
    await runGrayscaleTest();
  });

  container.querySelector('#btn-conv')!.addEventListener('click', async () => {
    logEl!.innerHTML = '';
    container.querySelector('#image-display')!.innerHTML = '';
    await runConvolutionTest();
  });

  container.querySelector('#btn-all-img')!.addEventListener('click', async () => {
    logEl!.innerHTML = '';
    container.querySelector('#image-display')!.innerHTML = '';
    await runGrayscaleTest();
    log('', '');
    await runConvolutionTest();
    log('', '');
    log('═══ ALL IMAGE TESTS COMPLETE ═══', 'info');
  });
}
