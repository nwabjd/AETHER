// AETHER WebGPU — Main Application

import './style.css';
import * as DeviceTest from './screens/device-test';
import * as ModelTest from './screens/model-test';
import * as ImageTest from './screens/image-test';
import * as VideoTest from './screens/video-test';
import * as Diagnostics from './screens/diagnostics';
import * as TensorBench from './screens/tensor-bench';
import * as WebGPUDiag from './screens/webgpu-diagnostics';
import * as GPUBench from './benchmark/screen';

const screens = [
  { id: 'gpubench', label: 'GPU Bench', module: GPUBench },
  { id: 'device', label: 'Device Test', module: DeviceTest },
  { id: 'webgpudiag', label: 'WebGPU Diag', module: WebGPUDiag },
  { id: 'model', label: 'Model Test', module: ModelTest },
  { id: 'tensor', label: 'Tensor Bench', module: TensorBench },
  { id: 'image', label: 'Image Test', module: ImageTest },
  { id: 'video', label: 'Video Test', module: VideoTest },
  { id: 'diag', label: 'Diagnostics', module: Diagnostics },
];

let currentScreen = 'gpubench';

function getScreenIdFromHash(): string {
  const hash = window.location.hash.replace('#', '');
  if (screens.some(s => s.id === hash)) return hash;
  // Map old routes
  if (hash === 'diagnostics/webgpu' || hash === 'webgpu') return 'webgpudiag';
  return 'gpubench';
}

function navigateTo(id: string) {
  currentScreen = id;
  window.location.hash = id;

  const nav = document.getElementById('nav')!;
  const screenEl = document.getElementById('screen')!;

  nav.querySelectorAll('button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === id);
  });

  const screen = screens.find(s => s.id === id);
  if (screen) {
    screen.module.render(screenEl);
  }
}

function init() {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;

  const nav = document.getElementById('nav')!;
  const screenEl = document.getElementById('screen')!;

  screens.forEach(s => {
    const btn = document.createElement('button');
    btn.textContent = s.label;
    btn.dataset.screen = s.id;
    btn.addEventListener('click', () => navigateTo(s.id));
    nav.appendChild(btn);
  });

  // Route from URL hash
  const initial = getScreenIdFromHash();
  navigateTo(initial);

  // Handle hash changes
  window.addEventListener('hashchange', () => {
    const id = getScreenIdFromHash();
    if (id !== currentScreen) navigateTo(id);
  });
}

// NOTE: No service worker registration. The benchmark runs as a normal static
// HTTPS app so Safari can never execute stale cached JavaScript.

init();
