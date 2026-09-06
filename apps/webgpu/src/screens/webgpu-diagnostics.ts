// AETHER WebGPU — Dedicated WebGPU Diagnostics Screen
// /diagnostics/webgpu route
// Complete root-cause analysis with copy-to-clipboard

import { runWebGPUDiagnostics, formatDiagnosticReport, WebGPUDiagnostic } from '../lib/webgpu-diagnostics';

let copyBtn: HTMLButtonElement | null = null;
let lastReport = '';

function renderDetail(d: WebGPUDiagnostic): string {
  const env = d.environment;
  const gpu = d.gpu;

  const statusColor = d.case === 'D' ? 'var(--green)' : d.case === 'E' ? 'var(--yellow)' : 'var(--red)';

  let html = `
    <div style="text-align:center;margin:20px 0">
      <div style="font-size:28px;font-weight:800;color:${statusColor};letter-spacing:1px">${d.statusLabel}</div>
      <div style="font-size:14px;color:var(--text-dim);margin-top:8px">Case ${d.case}</div>
    </div>

    <div class="card" style="border-color:${statusColor}">
      <div class="card-title" style="margin-bottom:8px">Diagnosis</div>
      <p style="font-size:13px;color:var(--text);line-height:1.6">${d.reason}</p>
      <p style="font-size:13px;color:var(--text);margin-top:10px;font-weight:600;line-height:1.6">${d.recommendation}</p>
    </div>
  `;

  // Environment section
  html += `
    <h3>Environment</h3>
    <div class="card">
      <div class="row"><span class="row-label">URL</span><span class="row-value" style="font-size:10px;word-break:break-all;max-width:55%;text-align:right">${env.url}</span></div>
      <div class="row"><span class="row-label">Protocol</span><span class="row-value">${env.protocol}</span></div>
      <div class="row"><span class="row-label">Hostname</span><span class="row-value">${env.hostname}</span></div>
      <div class="row"><span class="row-label">Secure Context</span><span class="row-value" style="color:${env.isSecureContext ? 'var(--green)' : 'var(--red)'}">${env.isSecureContext ? 'Yes ✓' : 'No ✗'}</span></div>
      <div class="row"><span class="row-label">Browser</span><span class="row-value">${env.browserName} ${env.browserVersion}</span></div>
      <div class="row"><span class="row-label">OS</span><span class="row-value">${env.osName} ${env.osVersion}</span></div>
      <div class="row"><span class="row-label">Platform</span><span class="row-value">${env.platform}</span></div>
      <div class="row"><span class="row-label">iOS Device</span><span class="row-value">${env.isIOS ? 'Yes' : 'No'}</span></div>
      <div class="row"><span class="row-label">Safari</span><span class="row-value">${env.isSafari ? 'Yes' : 'No'}</span></div>
      <div class="row"><span class="row-label">WebView / In-App Browser</span><span class="row-value" style="color:${env.isWebView ? 'var(--red)' : 'var(--green)'}">${env.isWebView ? 'Yes (BLOCKED)' : 'No'}</span></div>
      <div class="row"><span class="row-label">Standalone PWA</span><span class="row-value">${env.isStandalone ? 'Yes' : 'No'}</span></div>
    </div>
  `;

  // WebGPU section
  html += `
    <h3>WebGPU API</h3>
    <div class="card">
      <div class="row"><span class="row-label">navigator.gpu</span><span class="row-value" style="color:${gpu.navigatorGpuExists ? 'var(--green)' : 'var(--red)'}">${gpu.navigatorGpuExists ? 'Exists ✓' : 'Undefined ✗'}</span></div>
  `;

  if (gpu.adapterName) {
    html += `
      <div class="row"><span class="row-label">Adapter</span><span class="row-value">${gpu.adapterName}</span></div>
      <div class="row"><span class="row-label">Vendor</span><span class="row-value">${gpu.adapterVendor || 'Unknown'}</span></div>
      <div class="row"><span class="row-label">Device</span><span class="row-value">${gpu.adapterDevice || 'Unknown'}</span></div>
      <div class="row"><span class="row-label">Fallback</span><span class="row-value">${gpu.isFallbackAdapter ? 'Yes (software)' : 'No (hardware)'}</span></div>
    `;
  }

  if (gpu.adapterError) {
    html += `<div class="row"><span class="row-label">Adapter Error</span><span class="row-value" style="color:var(--red)">${gpu.adapterError}</span></div>`;
  }
  if (gpu.deviceError) {
    html += `<div class="row"><span class="row-label">Device Error</span><span class="row-value" style="color:var(--red)">${gpu.deviceError}</span></div>`;
  }

  html += `</div>`;

  // Limits
  if (gpu.limits) {
    const lim = gpu.limits;
    const fmt = (v: number) => {
      if (v >= 1073741824) return `${(v / 1073741824).toFixed(1)} GB`;
      if (v >= 1048576) return `${(v / 1048576).toFixed(1)} MB`;
      if (v >= 1024) return `${(v / 1024).toFixed(1)} KB`;
      return `${v} B`;
    };
    html += `
      <h3>GPU Limits</h3>
      <div class="card">
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${fmt(lim.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${lim.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${lim.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${lim.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${fmt(lim.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${fmt(lim.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${fmt(lim.maxComputeWorkgroupStorageSize)}</span></div>
        <div class="row"><span class="row-label">Max invocations/wg</span><span class="row-value">${lim.maxComputeInvocationsPerWorkgroup}</span></div>
        <div class="row"><span class="row-label">Max workgroup size</span><span class="row-value">${lim.maxComputeWorkgroupSizeX}×${lim.maxComputeWorkgroupSizeY}×${lim.maxComputeWorkgroupSizeZ}</span></div>
        <div class="row"><span class="row-label">Max workgroups/dim</span><span class="row-value">${lim.maxComputeWorkgroupsPerDimension}</span></div>
        <div class="row"><span class="row-label">Max color attachments</span><span class="row-value">${lim.maxColorAttachments}</span></div>
        <div class="row"><span class="row-label">Storage buf alignment</span><span class="row-value">${lim.minStorageBufferOffsetAlignment} B</span></div>
        <div class="row"><span class="row-label">Uniform buf alignment</span><span class="row-value">${lim.minUniformBufferOffsetAlignment} B</span></div>
      </div>
    `;
  }

  // Features
  if (gpu.features.length > 0) {
    html += `
      <h3>Features (${gpu.features.length})</h3>
      <div class="card">
        ${gpu.features.map(f => `<div class="row"><span class="row-value">${f}</span></div>`).join('')}
      </div>
    `;
  }

  // Case-specific guidance
  html += `
    <h3>Quick Reference</h3>
    <div class="card">
      <div class="row"><span class="row-label">Case A</span><span class="row-value">navigator.gpu missing — browser lacks WebGPU</span></div>
      <div class="row"><span class="row-label">Case B</span><span class="row-value">requestAdapter() failed — no GPU adapter</span></div>
      <div class="row"><span class="row-label">Case C</span><span class="row-value">requestDevice() failed — driver/device error</span></div>
      <div class="row"><span class="row-label">Case D</span><span class="row-value" style="color:var(--green)">WebGPU fully functional</span></div>
      <div class="row"><span class="row-label">Case E</span><span class="row-value">Not a secure context — needs HTTPS</span></div>
      <div class="row"><span class="row-label">Case F</span><span class="row-value">Browser/OS too old — needs Safari 26+ / iOS 26+</span></div>
      <div class="row"><span class="row-label">Case G</span><span class="row-value">In-app browser / WebView — use standalone Safari</span></div>
    </div>
  `;

  return html;
}

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;

  const resultEl = container.querySelector('#wgdiag-result')!;
  copyBtn = container.querySelector('#btn-copy-report') as HTMLButtonElement;

  container.querySelector('#btn-run-wgdiag')!.addEventListener('click', async () => {
    resultEl.innerHTML = '<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>';
    copyBtn!.disabled = true;

    const d = await runWebGPUDiagnostics();
    lastReport = formatDiagnosticReport(d);
    resultEl.innerHTML = renderDetail(d);
    copyBtn!.disabled = false;
  });

  copyBtn!.addEventListener('click', async () => {
    if (!lastReport) return;
    try {
      await navigator.clipboard.writeText(lastReport);
      copyBtn!.textContent = 'Copied!';
      setTimeout(() => { copyBtn!.textContent = 'Copy Diagnostics'; }, 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = lastReport;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyBtn!.textContent = 'Copied!';
      setTimeout(() => { copyBtn!.textContent = 'Copy Diagnostics'; }, 2000);
    }
  });

  // Auto-run on load
  container.querySelector('#btn-run-wgdiag')!.dispatchEvent(new Event('click'));
}
