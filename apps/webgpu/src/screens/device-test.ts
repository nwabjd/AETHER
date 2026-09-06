// AETHER WebGPU — Device Test Screen
// Uses the complete diagnostic system

import { runWebGPUDiagnostics, formatDiagnosticReport, WebGPUDiagnostic } from '../lib/webgpu-diagnostics';
import { formatBytes } from '../lib/gpu';

function renderInfo(d: WebGPUDiagnostic): string {
  const env = d.environment;
  const gpu = d.gpu;

  let statusClass = 'badge-fail';
  if (d.case === 'D') statusClass = 'badge-pass';
  else if (d.case === 'B' || d.case === 'C') statusClass = 'badge-warn';

  let html = `
    <div class="card" style="border-color:${d.ready ? 'var(--green)' : d.case === 'E' ? 'var(--yellow)' : 'var(--red)'}">
      <div class="card-header">
        <span class="card-title" style="font-size:18px">${d.statusLabel}</span>
        <span class="badge ${statusClass}">CASE ${d.case}</span>
      </div>
      <p style="font-size:13px;color:var(--text-dim);margin-top:6px">${d.reason}</p>
      <p style="font-size:13px;color:var(--text);margin-top:8px;font-weight:500">${d.recommendation}</p>
    </div>

    <h3>Environment</h3>
    <div class="card">
      <div class="row"><span class="row-label">URL</span><span class="row-value" style="font-size:10px;word-break:break-all;max-width:60%">${env.url}</span></div>
      <div class="row"><span class="row-label">Protocol</span><span class="row-value">${env.protocol}</span></div>
      <div class="row"><span class="row-label">Hostname</span><span class="row-value">${env.hostname}</span></div>
      <div class="row"><span class="row-label">Secure Context</span><span class="row-value">${env.isSecureContext ? 'Yes' : 'No'}</span></div>
      <div class="row"><span class="row-label">Browser</span><span class="row-value">${env.browserName} ${env.browserVersion}</span></div>
      <div class="row"><span class="row-label">OS</span><span class="row-value">${env.osName} ${env.osVersion}</span></div>
      <div class="row"><span class="row-label">Platform</span><span class="row-value">${env.platform}</span></div>
      <div class="row"><span class="row-label">iOS</span><span class="row-value">${env.isIOS ? 'Yes' : 'No'}</span></div>
      <div class="row"><span class="row-label">Safari</span><span class="row-value">${env.isSafari ? 'Yes' : 'No'}</span></div>
      <div class="row"><span class="row-label">WebView / In-App</span><span class="row-value">${env.isWebView ? 'Yes (BLOCKED)' : 'No'}</span></div>
      <div class="row"><span class="row-label">Standalone PWA</span><span class="row-value">${env.isStandalone ? 'Yes' : 'No'}</span></div>
    </div>
  `;

  if (gpu.adapterName) {
    html += `
      <h3>GPU Adapter</h3>
      <div class="card">
        <div class="row"><span class="row-label">Name</span><span class="row-value">${gpu.adapterName}</span></div>
        <div class="row"><span class="row-label">Vendor</span><span class="row-value">${gpu.adapterVendor || 'Unknown'}</span></div>
        <div class="row"><span class="row-label">Device</span><span class="row-value">${gpu.adapterDevice || 'Unknown'}</span></div>
        <div class="row"><span class="row-label">Fallback</span><span class="row-value">${gpu.isFallbackAdapter ? 'Yes (software)' : 'No (hardware)'}</span></div>
      </div>
    `;
  }

  if (gpu.adapterError) {
    html += `
      <h3>Adapter Error</h3>
      <div class="card" style="border-color:var(--red)">
        <p style="font-size:13px;color:var(--red)">${gpu.adapterError}</p>
      </div>
    `;
  }

  if (gpu.deviceError) {
    html += `
      <h3>Device Error</h3>
      <div class="card" style="border-color:var(--red)">
        <p style="font-size:13px;color:var(--red)">${gpu.deviceError}</p>
      </div>
    `;
  }

  if (gpu.limits) {
    html += `
      <h3>GPU Limits</h3>
      <div class="card">
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${formatBytes(gpu.limits.maxBufferSize as number)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${gpu.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${gpu.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${gpu.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${formatBytes(gpu.limits.maxStorageBufferBindingSize as number)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${formatBytes(gpu.limits.maxUniformBufferBindingSize as number)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${formatBytes(gpu.limits.maxComputeWorkgroupStorageSize as number)}</span></div>
        <div class="row"><span class="row-label">Max invocations/wg</span><span class="row-value">${gpu.limits.maxComputeInvocationsPerWorkgroup}</span></div>
        <div class="row"><span class="row-label">Max workgroup size</span><span class="row-value">${gpu.limits.maxComputeWorkgroupSizeX}×${gpu.limits.maxComputeWorkgroupSizeY}×${gpu.limits.maxComputeWorkgroupSizeZ}</span></div>
        <div class="row"><span class="row-label">Max workgroups/dim</span><span class="row-value">${gpu.limits.maxComputeWorkgroupsPerDimension}</span></div>
        <div class="row"><span class="row-label">Max color attachments</span><span class="row-value">${gpu.limits.maxColorAttachments}</span></div>
        <div class="row"><span class="row-label">Storage buf alignment</span><span class="row-value">${gpu.limits.minStorageBufferOffsetAlignment} B</span></div>
        <div class="row"><span class="row-label">Uniform buf alignment</span><span class="row-value">${gpu.limits.minUniformBufferOffsetAlignment} B</span></div>
      </div>
    `;
  }

  if (gpu.features.length > 0) {
    html += `
      <h3>Features (${gpu.features.length})</h3>
      <div class="card">
        ${gpu.features.map(f => `<div class="row"><span class="row-value">${f}</span></div>`).join('')}
      </div>
    `;
  }

  return html;
}

export function render(container: HTMLElement): void {
  container.innerHTML = `
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;

  const statusEl = container.querySelector('#device-status')!;
  const infoEl = container.querySelector('#device-info')!;

  runWebGPUDiagnostics().then(d => {
    if (d.ready) {
      statusEl.innerHTML = `
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `;
    } else {
      statusEl.innerHTML = '';
    }
    infoEl.innerHTML = renderInfo(d);
  });
}
