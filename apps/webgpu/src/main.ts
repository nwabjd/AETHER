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
import * as Forensics from './screens/forensics';
import { purgeLegacyServiceWorkers, resetAetherCache } from './sw-purge';

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

function renderResetComplete() {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;text-align:center;gap:16px;padding:24px">
      <h2 style="color:var(--green, #22c55e);margin:0">AETHER CACHE RESET COMPLETE</h2>
      <p style="color:var(--text-dim, #9ca3af);margin:0">Please reload AETHER normally.</p>
      <button id="btn-reset-reload" class="btn">Reload AETHER</button>
    </div>
  `;
  app.querySelector('#btn-reset-reload')?.addEventListener('click', () => {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    window.location.reload();
  });
}

async function boot() {
  // Special cache-reset route: full purge, then show a result page. Do NOT
  // redirect automatically so the user can see the outcome.
  if (window.location.hash === '#reset') {
    await resetAetherCache();
    renderResetComplete();
    return;
  }

  // Special read-only forensic route: renders ONLY a localStorage evidence
  // viewer. Runs before init()/purge so no benchmark UI, GPU init, service
  // worker purge, or cache touching ever executes. localStorage is read only.
  if (window.location.hash === '#forensics') {
    const app = document.getElementById('app')!;
    Forensics.render(app);
    const leaveForensics = () => {
      if (window.location.hash !== '#forensics') {
        window.removeEventListener('hashchange', leaveForensics);
        init();
      }
    };
    window.addEventListener('hashchange', leaveForensics);
    return;
  }

  // One-time cleanup BEFORE any UI initializes (purge stale service workers).
  await purgeLegacyServiceWorkers();

  init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => void boot());
} else {
  void boot();
}