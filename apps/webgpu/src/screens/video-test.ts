// AETHER WebGPU — Video Test Screen
// Synthetic GPU compute video frames — NOT AI-generated

import { detectGPU, getDevice } from '../lib/gpu';
import { Tensor } from '../lib/tensor';
import { setBenchmarkDevice } from '../lib/benchmark';

let device: GPUDevice | null = null;
let logEl: HTMLElement | null = null;
let animFrameId: number | null = null;

function log(msg: string, cls: string = '') {
  if (!logEl) return;
  const line = document.createElement('div');
  line.className = `log-entry ${cls}`;
  line.textContent = msg;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

// Compute shader that generates a frame based on time
const FRAME_GEN_SHADER = /* wgsl */ `
struct Uniforms { W: u32, H: u32, frame: u32, mode: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read_write> pixels: array<f32>;

fn hsv2rgb(h: f32, s: f32, v: f32) -> vec3<f32> {
  let c = v * s;
  let x = c * (1.0 - abs(((h / 60.0) % 6.0) - 1.0));
  let m = v - c;
  var r: f32; var g: f32; var b: f32;
  if (h < 60.0)      { r = c; g = x; b = 0.0; }
  else if (h < 120.0) { r = x; g = c; b = 0.0; }
  else if (h < 180.0) { r = 0.0; g = c; b = x; }
  else if (h < 240.0) { r = 0.0; g = x; b = c; }
  else if (h < 300.0) { r = x; g = 0.0; b = c; }
  else                { r = c; g = 0.0; b = x; }
  return vec3(r + m, g + m, b + m);
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let x = gid.x;
  let y = gid.y;
  if (x >= u.W || y >= u.H) { return; }

  let idx = (y * u.W + x) * 4u;
  let t = f32(u.frame) * 0.05;
  let fx = f32(x) / f32(u.W);
  let fy = f32(y) / f32(u.H);

  if (u.mode == 0u) {
    // Plasma effect
    let v1 = sin(fx * 10.0 + t);
    let v2 = sin(fy * 10.0 + t * 0.7);
    let v3 = sin((fx + fy) * 8.0 + t * 0.5);
    let v4 = sin(sqrt(fx * fx + fy * fy) * 12.0 - t * 1.2);
    let h = (v1 + v2 + v3 + v4 + 4.0) * 45.0;
    let col = hsv2rgb(h, 0.8, 0.9);
    pixels[idx + 0u] = col.x;
    pixels[idx + 1u] = col.y;
    pixels[idx + 2u] = col.z;
    pixels[idx + 3u] = 1.0;
  } else if (u.mode == 1u) {
    // Wave interference
    let cx = 0.5 + 0.3 * sin(t * 0.8);
    let cy = 0.5 + 0.3 * cos(t * 1.1);
    let d1 = sqrt((fx - cx) * (fx - cx) + (fy - cy) * (fy - cy));
    let d2 = sqrt((fx - 0.7) * (fx - 0.7) + (fy - 0.3) * (fy - 0.3));
    let wave = sin(d1 * 30.0 - t * 4.0) + sin(d2 * 25.0 + t * 3.0);
    let v = (wave + 2.0) * 0.25;
    let col = hsv2rgb(v * 360.0, 0.7, v);
    pixels[idx + 0u] = col.x;
    pixels[idx + 1u] = col.y;
    pixels[idx + 2u] = col.z;
    pixels[idx + 3u] = 1.0;
  } else {
    // Mandelbrot zoom
    let cx = -0.745 + sin(t * 0.1) * 0.1;
    let cy = 0.186 + cos(t * 0.07) * 0.1;
    let zx = (fx - 0.5) * 2.5;
    let zy = (fy - 0.5) * 2.5;
    var iter = 0u;
    var x2 = zx;
    var y2 = zy;
    for (var i = 0u; i < 50u; i++) {
      if (x2 * x2 + y2 * y2 > 4.0) { break; }
      let tmp = x2 * x2 - y2 * y2 + cx;
      y2 = 2.0 * x2 * y2 + cy;
      x2 = tmp;
      iter++;
    }
    let v = f32(iter) / 50.0;
    let col = hsv2rgb(v * 360.0 + t * 20.0, 0.8, select(0.0, v, iter < 50u));
    pixels[idx + 0u] = col.x;
    pixels[idx + 1u] = col.y;
    pixels[idx + 2u] = col.z;
    pixels[idx + 3u] = 1.0;
  }
}
`;

let currentMode = 0;
let frameCount = 0;

async function startVideoRendering(
  canvas: HTMLCanvasElement,
  statusEl: HTMLElement,
  fpsEl: HTMLElement,
  resSelect: HTMLSelectElement,
  modeSelect: HTMLSelectElement,
): Promise<void> {
  const info = await detectGPU();
  if (!info) { log('WebGPU unavailable', 'err'); return; }
  device = await getDevice(info);
  setBenchmarkDevice(device);

  const [W, H] = resSelect.value.split('x').map(Number);
  canvas.width = W;
  canvas.height = H;
  currentMode = parseInt(modeSelect.value);

  const layout = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
    ],
  });

  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [layout] }),
    compute: { module: device.createShaderModule({ code: FRAME_GEN_SHADER }), entryPoint: 'main' },
  });

  const pixelBuf = device.createBuffer({
    size: W * H * 4 * 4,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const ctx = canvas.getContext('2d')!;
  const uniformBuf = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  let lastTime = performance.now();
  let fps = 0;
  let totalFrames = 0;

  statusEl.textContent = 'RENDERING';
  statusEl.className = 'badge badge-pass';

  function renderFrame() {
    const uniforms = new ArrayBuffer(16);
    const uv = new Uint32Array(uniforms);
    uv[0] = W; uv[1] = H; uv[2] = frameCount; uv[3] = currentMode;
    device!.queue.writeBuffer(uniformBuf, 0, uniforms);

    const bg = device!.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: { buffer: uniformBuf } },
        { binding: 1, resource: { buffer: pixelBuf } },
      ],
    });

    const enc = device!.createCommandEncoder();
    const pass = enc.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bg);
    pass.dispatchWorkgroups(Math.ceil(W / 16), Math.ceil(H / 16), 1);
    pass.end();

    // Copy to staging for readback
    const staging = device!.createBuffer({
      size: W * H * 4 * 4,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    enc.copyBufferToBuffer(pixelBuf, 0, staging, 0, W * H * 4 * 4);

    device!.queue.submit([enc.finish()]);

    staging.mapAsync(GPUMapMode.READ).then(() => {
      const data = new Float32Array(staging.getMappedRange().slice(0));
      staging.unmap();
      staging.destroy();

      const img = ctx.createImageData(W, H);
      for (let i = 0; i < W * H * 4; i++) {
        img.data[i] = Math.round(data[i] * 255);
      }
      ctx.putImageData(img, 0, 0);

      frameCount++;
      totalFrames++;

      const now = performance.now();
      if (now - lastTime >= 1000) {
        fps = Math.round(totalFrames * 1000 / (now - lastTime));
        fpsEl.textContent = `${fps} FPS | Frame ${frameCount} | ${W}×${H}`;
        totalFrames = 0;
        lastTime = now;
      }

      animFrameId = requestAnimationFrame(renderFrame);
    });
  }

  renderFrame();
}

function stopRendering(): void {
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  if (device) {
    device.destroy();
    device = null;
  }
}

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <h2>Video Test</h2>

    <div class="card" style="border-color:var(--yellow)">
      <div class="card-header">
        <span class="card-title" style="color:var(--yellow)">GPU COMPUTE TEST</span>
        <span class="badge badge-warn">SYNTHETIC</span>
      </div>
      <p style="font-size:12px;color:var(--text-dim);margin-top:4px">
        These frames are generated by WebGPU compute shaders in real time.
        This is NOT AI-generated video. It tests GPU rendering throughput.
      </p>
    </div>

    <div class="btn-row">
      <select id="res-select" style="background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:8px 12px;font-size:13px">
        <option value="256x256">256×256</option>
        <option value="512x512" selected>512×512</option>
        <option value="1024x1024">1024×1024</option>
      </select>
      <select id="mode-select" style="background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:8px 12px;font-size:13px">
        <option value="0">Plasma</option>
        <option value="1">Wave Interference</option>
        <option value="2">Mandelbrot Zoom</option>
      </select>
      <button class="btn" id="btn-start">Start</button>
      <button class="btn btn-outline" id="btn-stop">Stop</button>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0">
      <span id="video-status" class="badge badge-info">STOPPED</span>
      <span id="video-fps" style="font-family:var(--mono);font-size:12px;color:var(--text-dim)"></span>
    </div>

    <canvas id="video-canvas" width="512" height="512"></canvas>

    <div class="log" id="video-log"></div>
  `;

  logEl = container.querySelector('#video-log')!;
  const canvas = container.querySelector('#video-canvas') as HTMLCanvasElement;
  const statusEl = container.querySelector('#video-status') as HTMLElement;
  const fpsEl = container.querySelector('#video-fps') as HTMLElement;
  const resSelect = container.querySelector('#res-select') as HTMLSelectElement;
  const modeSelect = container.querySelector('#mode-select') as HTMLSelectElement;

  container.querySelector('#btn-start')!.addEventListener('click', () => {
    stopRendering();
    frameCount = 0;
    currentMode = parseInt(modeSelect.value);
    log(`Starting GPU compute video: ${resSelect.value} mode=${modeSelect.value}`, 'info');
    startVideoRendering(canvas, statusEl, fpsEl, resSelect, modeSelect);
  });

  container.querySelector('#btn-stop')!.addEventListener('click', () => {
    stopRendering();
    statusEl.textContent = 'STOPPED';
    statusEl.className = 'badge badge-info';
    log('Rendering stopped', 'warn');
  });
}
