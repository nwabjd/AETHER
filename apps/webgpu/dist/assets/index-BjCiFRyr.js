(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=r(a);fetch(a.href,o)}})();function on(e){let t="Unknown",r="Unknown",n="Unknown",a="Unknown";const o=e.match(/OS (\d+)_(\d+)/);o&&(n="iOS",a=`${o[1]}.${o[2]}`);const s=e.match(/Mac OS X (\d+)[_.](\d+)/);if(s&&(n="macOS",a=`${s[1]}.${s[2]}`),e.includes("Windows")){n="Windows";const u=e.match(/Windows NT (\d+\.\d+)/);u&&(a=u[1])}if(e.includes("Android")){n="Android";const u=e.match(/Android (\d+[\.\d]*)/);u&&(a=u[1])}if(e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")){t="Safari";const u=e.match(/Version\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Chrome")&&!e.includes("Edg")){t="Chrome";const u=e.match(/Chrome\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Edg/")){t="Edge";const u=e.match(/Edg\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Firefox")){t="Firefox";const u=e.match(/Firefox\/(\d+[\.\d]*)/);u&&(r=u[1])}return{browserName:t,browserVersion:r,osName:n,osVersion:a}}function sn(e){return!!(e.includes("FBAN")||e.includes("FBIOS")||e.includes("Twitter")||e.includes("Instagram")||e.includes("Line/")||e.includes("WeChat")||e.includes("MicroMessenger")||e.includes("CocoaPods")||e.includes("wv)")||e.includes("Electron")||e.includes("; wv)"))}function un(e){return e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")}async function bt(){const e=navigator.userAgent,t=on(e),r=t.osName==="iOS",n=un(e),a=sn(e),o=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,s={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:e,platform:navigator.platform,isIOS:r,isSafari:n,isWebView:a,isStandalone:o,browserName:t.browserName,browserVersion:t.browserVersion,osName:t.osName,osVersion:t.osVersion},i={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(a)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:s,gpu:i};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:r?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:s,gpu:i};if(!navigator.gpu){let u="navigator.gpu is undefined. WebGPU API is not exposed.",l="";if(r){if(parseInt(t.osVersion.split(".")[0],10)<26)return u=`iOS ${t.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,l="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:l,environment:s,gpu:i};if(t.browserName!=="Safari")return u=`Running ${t.browserName} on iOS ${t.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,l="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:u,recommendation:l,environment:s,gpu:i}}return t.osName==="macOS"&&parseInt(t.osVersion.split(".")[0],10)<14?(u=`macOS ${t.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,l="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:l,environment:s,gpu:i}):(l="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:l,environment:s,gpu:i})}try{const u=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!u){i.adapterError="requestAdapter() returned null";let d="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",p="";return r?parseInt(t.osVersion.split(".")[0],10)>=26&&(d=`iOS ${t.osVersion} with Safari ${t.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,p="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(d="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",p="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):p="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:d,recommendation:p,environment:s,gpu:i}}i.adapterName=u.name??"Unknown GPU",i.adapterVendor=u.vendor??"Unknown",i.adapterDevice=u.device??"Unknown",i.isFallbackAdapter=u.isFallbackAdapter??!1;const l=[];for(const d of u.features)l.push(d.replace(/-/g," ").replace(/\b\w/g,p=>p.toUpperCase()));i.features=l;const c=u.limits;i.limits={maxBufferSize:c.maxBufferSize,maxTextureDimension1D:c.maxTextureDimension1D,maxTextureDimension2D:c.maxTextureDimension2D,maxTextureDimension3D:c.maxTextureDimension3D,maxComputeWorkgroupStorageSize:c.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:c.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:c.maxStorageBufferBindingSize,maxUniformBufferBindingSize:c.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:c.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:c.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:c.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:c.maxComputeWorkgroupsPerDimension,maxColorAttachments:c.maxColorAttachments,minStorageBufferOffsetAlignment:c.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:c.minUniformBufferOffsetAlignment};try{(await u.requestDevice({requiredLimits:{}})).destroy()}catch(d){return i.deviceError=d.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${i.adapterName}) but requestDevice() failed: ${d.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:s,gpu:i}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${i.adapterName}.`,recommendation:"No action needed.",environment:s,gpu:i}}catch(u){return i.adapterError=u.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${u.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:s,gpu:i}}}function Pr(e){const t=[];if(t.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),t.push(""),t.push(`STATUS: ${e.statusLabel}`),t.push(`CASE: ${e.case}`),t.push(`REASON: ${e.reason}`),t.push(`RECOMMENDATION: ${e.recommendation}`),t.push(""),t.push("── ENVIRONMENT ──"),t.push(`  URL: ${e.environment.url}`),t.push(`  Protocol: ${e.environment.protocol}`),t.push(`  Hostname: ${e.environment.hostname}`),t.push(`  Secure Context: ${e.environment.isSecureContext}`),t.push(`  iOS: ${e.environment.isIOS}`),t.push(`  Safari: ${e.environment.isSafari}`),t.push(`  WebView: ${e.environment.isWebView}`),t.push(`  Standalone PWA: ${e.environment.isStandalone}`),t.push(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`),t.push(`  OS: ${e.environment.osName} ${e.environment.osVersion}`),t.push(`  Platform: ${e.environment.platform}`),t.push(`  User Agent: ${e.environment.userAgent}`),t.push(""),t.push("── WEBGPU ──"),t.push(`  navigator.gpu exists: ${e.gpu.navigatorGpuExists}`),e.gpu.adapterName&&t.push(`  Adapter: ${e.gpu.adapterName}`),e.gpu.adapterVendor&&t.push(`  Vendor: ${e.gpu.adapterVendor}`),e.gpu.adapterDevice&&t.push(`  Device: ${e.gpu.adapterDevice}`),e.gpu.adapterError&&t.push(`  Adapter Error: ${e.gpu.adapterError}`),e.gpu.deviceError&&t.push(`  Device Error: ${e.gpu.deviceError}`),t.push(`  Fallback adapter: ${e.gpu.isFallbackAdapter}`),e.gpu.features.length>0){t.push(`  Features (${e.gpu.features.length}):`);for(const r of e.gpu.features)t.push(`    ${r}`)}if(e.gpu.limits){t.push("  Limits:");for(const[r,n]of Object.entries(e.gpu.limits))t.push(`    ${r}: ${typeof n=="number"?n.toLocaleString():n}`)}return t.push(""),t.push(`Timestamp: ${new Date().toISOString()}`),t.join(`
`)}function et(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function we(){const e=await bt();if(!e.ready||!e.gpu.adapterName)return null;const t=e.gpu.limits;return{available:!0,adapterName:e.gpu.adapterName,adapterVendor:e.gpu.adapterVendor,adapterDevice:e.gpu.adapterDevice,features:e.gpu.features,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:e.gpu.isFallbackAdapter,featuresMap:new Set(e.gpu.features),diagnostic:e}}async function xe(e,t=[]){const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("Failed to re-acquire GPU adapter");const n=await r.requestDevice({requiredFeatures:t.filter(a=>e.featuresMap.has(a)),requiredLimits:{}});return n.lost.then(a=>{console.error("WebGPU device lost:",a.message)}),n}function cn(e){const t=e.environment,r=e.gpu;let n="badge-fail";e.case==="D"?n="badge-pass":(e.case==="B"||e.case==="C")&&(n="badge-warn");let a=`
    <div class="card" style="border-color:${e.ready?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)"}">
      <div class="card-header">
        <span class="card-title" style="font-size:18px">${e.statusLabel}</span>
        <span class="badge ${n}">CASE ${e.case}</span>
      </div>
      <p style="font-size:13px;color:var(--text-dim);margin-top:6px">${e.reason}</p>
      <p style="font-size:13px;color:var(--text);margin-top:8px;font-weight:500">${e.recommendation}</p>
    </div>

    <h3>Environment</h3>
    <div class="card">
      <div class="row"><span class="row-label">URL</span><span class="row-value" style="font-size:10px;word-break:break-all;max-width:60%">${t.url}</span></div>
      <div class="row"><span class="row-label">Protocol</span><span class="row-value">${t.protocol}</span></div>
      <div class="row"><span class="row-label">Hostname</span><span class="row-value">${t.hostname}</span></div>
      <div class="row"><span class="row-label">Secure Context</span><span class="row-value">${t.isSecureContext?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">Browser</span><span class="row-value">${t.browserName} ${t.browserVersion}</span></div>
      <div class="row"><span class="row-label">OS</span><span class="row-value">${t.osName} ${t.osVersion}</span></div>
      <div class="row"><span class="row-label">Platform</span><span class="row-value">${t.platform}</span></div>
      <div class="row"><span class="row-label">iOS</span><span class="row-value">${t.isIOS?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">Safari</span><span class="row-value">${t.isSafari?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">WebView / In-App</span><span class="row-value">${t.isWebView?"Yes (BLOCKED)":"No"}</span></div>
      <div class="row"><span class="row-label">Standalone PWA</span><span class="row-value">${t.isStandalone?"Yes":"No"}</span></div>
    </div>
  `;return r.adapterName&&(a+=`
      <h3>GPU Adapter</h3>
      <div class="card">
        <div class="row"><span class="row-label">Name</span><span class="row-value">${r.adapterName}</span></div>
        <div class="row"><span class="row-label">Vendor</span><span class="row-value">${r.adapterVendor||"Unknown"}</span></div>
        <div class="row"><span class="row-label">Device</span><span class="row-value">${r.adapterDevice||"Unknown"}</span></div>
        <div class="row"><span class="row-label">Fallback</span><span class="row-value">${r.isFallbackAdapter?"Yes (software)":"No (hardware)"}</span></div>
      </div>
    `),r.adapterError&&(a+=`
      <h3>Adapter Error</h3>
      <div class="card" style="border-color:var(--red)">
        <p style="font-size:13px;color:var(--red)">${r.adapterError}</p>
      </div>
    `),r.deviceError&&(a+=`
      <h3>Device Error</h3>
      <div class="card" style="border-color:var(--red)">
        <p style="font-size:13px;color:var(--red)">${r.deviceError}</p>
      </div>
    `),r.limits&&(a+=`
      <h3>GPU Limits</h3>
      <div class="card">
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${et(r.limits.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${r.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${r.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${r.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${et(r.limits.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${et(r.limits.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${et(r.limits.maxComputeWorkgroupStorageSize)}</span></div>
        <div class="row"><span class="row-label">Max invocations/wg</span><span class="row-value">${r.limits.maxComputeInvocationsPerWorkgroup}</span></div>
        <div class="row"><span class="row-label">Max workgroup size</span><span class="row-value">${r.limits.maxComputeWorkgroupSizeX}×${r.limits.maxComputeWorkgroupSizeY}×${r.limits.maxComputeWorkgroupSizeZ}</span></div>
        <div class="row"><span class="row-label">Max workgroups/dim</span><span class="row-value">${r.limits.maxComputeWorkgroupsPerDimension}</span></div>
        <div class="row"><span class="row-label">Max color attachments</span><span class="row-value">${r.limits.maxColorAttachments}</span></div>
        <div class="row"><span class="row-label">Storage buf alignment</span><span class="row-value">${r.limits.minStorageBufferOffsetAlignment} B</span></div>
        <div class="row"><span class="row-label">Uniform buf alignment</span><span class="row-value">${r.limits.minUniformBufferOffsetAlignment} B</span></div>
      </div>
    `),r.features.length>0&&(a+=`
      <h3>Features (${r.features.length})</h3>
      <div class="card">
        ${r.features.map(o=>`<div class="row"><span class="row-value">${o}</span></div>`).join("")}
      </div>
    `),a}function ln(e){e.innerHTML=`
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;const t=e.querySelector("#device-status"),r=e.querySelector("#device-info");bt().then(n=>{n.ready?t.innerHTML=`
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `:t.innerHTML="",r.innerHTML=cn(n)})}const dn=Object.freeze(Object.defineProperty({__proto__:null,render:ln},Symbol.toStringTag,{value:"Module"}));let T=class Ar{buffer;shape;dtype;size;device;constructor(t,r,n="f32"){this.device=t,this.shape=[...r],this.dtype=n,this.size=r.reduce((s,i)=>s*i,1);const a=n==="f32"?4:n==="f16"?2:4;this.buffer=t.createBuffer({size:this.size*a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(n==="f32"?new Float32Array(this.buffer.getMappedRange()):n==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(t,r,n){const a=new Ar(t,n,r instanceof Float32Array?"f32":"i32");return t.queue.writeBuffer(a.buffer,0,r.buffer),a}async readback(){const t=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r=this.device.createCommandEncoder();r.copyBufferToBuffer(this.buffer,0,t,0,this.buffer.size),this.device.queue.submit([r.finish()]),await t.mapAsync(GPUMapMode.READ);const n=new Float32Array(t.getMappedRange().slice(0));return t.unmap(),t.destroy(),n}destroy(){this.buffer.destroy()}};async function Ie(e,t,r=50,n){const a=[];for(let l=0;l<Math.min(5,r);l++)await t();for(let l=0;l<r;l++){const c=performance.now();await t(),await $r?.queue.onSubmittedWorkDone();const d=performance.now();a.push(d-c)}a.sort((l,c)=>l-c);const o=a.reduce((l,c)=>l+c,0)/a.length,s=a[0],i=a[a.length-1],u={name:e,avgMs:o,minMs:s,maxMs:i,iterations:r};if(n){const c=n/(o/1e3)/1e9;u.gflops=c,u.throughput=`${c.toFixed(2)} GFLOPS`}return u}let $r=null;function Se(e){$r=e}function ze(e){const t=[`${e.name}: ${e.avgMs.toFixed(2)} ms avg`,`(${e.minMs.toFixed(2)} – ${e.maxMs.toFixed(2)} ms)`,`[${e.iterations} iterations]`];return e.throughput&&t.push(e.throughput),t.join(" ")}const it=`
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x;
  let col = gid.y;
  if (row >= uniforms.M || col >= uniforms.N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < uniforms.K; k++) {
    sum += A[row * uniforms.K + k] * B[k * uniforms.N + col];
  }
  C[row * uniforms.N + col] = sum;
}
`,fn=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= uniforms.N) { return; }
  data[i] = max(data[i], 0.0);
}
`,pn=`
// Simple 2D convolution: input[N,C,H,W], kernel[K,C,FH,FW], output[N,F,OH,OW]
// We flatten spatial dims for simplicity.
struct Uniforms { N: u32, C: u32, H: u32, W: u32, F: u32, FH: u32, FW: u32, OH: u32, OW: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> kernel: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let n = gid.x;
  let f = gid.y;
  if (n >= u.N || f >= u.F) { return; }

  for (var oh = 0u; oh < u.OH; oh++) {
    for (var ow = 0u; ow < u.OW; ow++) {
      var sum: f32 = 0.0;
      for (var c = 0u; c < u.C; c++) {
        for (var fh = 0u; fh < u.FH; fh++) {
          for (var fw = 0u; fw < u.FW; fw++) {
            let ih = oh + fh;
            let iw = ow + fw;
            let in_idx = ((n * u.C + c) * u.H + ih) * u.W + iw;
            let k_idx = ((f * u.C + c) * u.FH + fh) * u.FW + fw;
            sum += input[in_idx] * kernel[k_idx];
          }
        }
      }
      let out_idx = ((n * u.F + f) * u.OH + oh) * u.OW + ow;
      output[out_idx] = sum;
    }
  }
}
`,mn=`
// Scaled dot-product attention: Q @ K^T * softmax, then @ V
// Q, K, V: [batch, seq, dim], output: [batch, seq, dim]
struct Uniforms { batch: u32, seq: u32, dim: u32, scale: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> Q: array<f32>;
@group(0) @binding(2) var<storage, read> K: array<f32>;
@group(0) @binding(3) var<storage, read> V: array<f32>;
@group(0) @binding(4) var<storage, read_write> out: array<f32>;
@group(0) @binding(5) var<storage, read_write> scores: array<f32>;

@compute @workgroup_size(16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let b = gid.x;
  if (b >= u.batch) { return; }

  for (var i = 0u; i < u.seq; i++) {
    var max_val: f32 = -1e30;
    for (var j = 0u; j < u.seq; j++) {
      var dot: f32 = 0.0;
      for (var d = 0u; d < u.dim; d++) {
        dot += Q[(b * u.seq + i) * u.dim + d] * K[(b * u.seq + j) * u.dim + d];
      }
      let s = dot * u.scale;
      scores[b * u.seq * u.seq + i * u.seq + j] = s;
      if (s > max_val) { max_val = s; }
    }

    // softmax
    var sum_exp: f32 = 0.0;
    for (var j = 0u; j < u.seq; j++) {
      let idx = b * u.seq * u.seq + i * u.seq + j;
      let e = exp(scores[idx] - max_val);
      scores[idx] = e;
      sum_exp += e;
    }
    for (var j = 0u; j < u.seq; j++) {
      scores[b * u.seq * u.seq + i * u.seq + j] /= sum_exp;
    }

    // weighted sum of V
    for (var d = 0u; d < u.dim; d++) {
      var sum: f32 = 0.0;
      for (var j = 0u; j < u.seq; j++) {
        sum += scores[b * u.seq * u.seq + i * u.seq + j] * V[(b * u.seq + j) * u.dim + d];
      }
      out[(b * u.seq + i) * u.dim + d] = sum;
    }
  }
}
`,gn=`
// Applies a user-selected kernel to an RGBA image buffer
// kernel: [K*K], input/output: [W*H] pixels, each pixel = 4 f32 (RGBA)
struct Uniforms { W: u32, H: u32, K: u32, mode: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> kernel_data: array<f32>;
@group(0) @binding(2) var<storage, read> input: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let x = gid.x;
  let y = gid.y;
  if (x >= u.W || y >= u.H) { return; }
  let half_k = u.K / 2u;
  var r: f32 = 0.0;
  var g: f32 = 0.0;
  var b: f32 = 0.0;
  var ki = 0u;
  for (var ky = 0u; ky < u.K; ky++) {
    for (var kx = 0u; kx < u.K; kx++) {
      let ix = clamp(x + kx - half_k, 0u, u.W - 1u);
      let iy = clamp(y + ky - half_k, 0u, u.H - 1u);
      let idx = (iy * u.W + ix) * 4u;
      let w = kernel_data[ki];
      r += input[idx + 0u] * w;
      g += input[idx + 1u] * w;
      b += input[idx + 2u] * w;
      ki++;
    }
  }
  let out_idx = (y * u.W + x) * 4u;
  output[out_idx + 0u] = clamp(r, 0.0, 1.0);
  output[out_idx + 1u] = clamp(g, 0.0, 1.0);
  output[out_idx + 2u] = clamp(b, 0.0, 1.0);
  output[out_idx + 3u] = input[out_idx + 3u];
}
`,bn=`
struct Uniforms { size: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u.size) { return; }
  let idx = i * 4u;
  let gray = 0.299 * input[idx] + 0.587 * input[idx + 1u] + 0.114 * input[idx + 2u];
  output[idx + 0u] = gray;
  output[idx + 1u] = gray;
  output[idx + 2u] = gray;
  output[idx + 3u] = input[idx + 3u];
}
`;let h=null,Pe=null;function B(e,t=""){if(!Pe)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Pe.appendChild(r),Pe.scrollTop=Pe.scrollHeight}async function Wt(){B("═══ TINY NEURAL NETWORK TEST ═══","info"),B("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),B("");const e=await we();if(!e)return B("WebGPU not available","err"),!1;h=await xe(e),Se(h);const t=performance.now(),r=T.fromData(h,new Float32Array([1,.5,-.3,.8]),[4]),n=T.fromData(h,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),a=T.fromData(h,new Float32Array([.1,-.1,.2]),[3]),o=new ArrayBuffer(12),s=new Uint32Array(o);s[0]=1,s[1]=3,s[2]=4;const i=h.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=h.createComputePipeline({layout:h.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:h.createShaderModule({code:it}),entryPoint:"main"}}),l=h.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});h.queue.writeBuffer(l,0,o);const c=new T(h,[1,3]),d=h.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:n.buffer}},{binding:3,resource:{buffer:c.buffer}}]});let p=h.createCommandEncoder(),f=p.beginComputePass();f.setPipeline(u),f.setBindGroup(0,d),f.dispatchWorkgroups(1,1,1),f.end(),h.queue.submit([p.finish()]),B(`  input[4]:  [${Array.from(await r.readback()).map(W=>W.toFixed(2)).join(", ")}]`,""),B("  W1[4×3]:   4 rows × 3 cols",""),B("  Matmul result: computing...","");const m=await c.readback();B(`  h1 = input @ W1: [${Array.from(m).map(W=>W.toFixed(3)).join(", ")}]`,"ok");for(let W=0;W<3;W++)m[W]+=[.1,-.1,.2][W];h.queue.writeBuffer(c.buffer,0,m.buffer),B(`  h1 + bias:       [${Array.from(m).map(W=>W.toFixed(3)).join(", ")}]`,"ok");const b=h.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),g=h.createComputePipeline({layout:h.createPipelineLayout({bindGroupLayouts:[b]}),compute:{module:h.createShaderModule({code:fn}),entryPoint:"main"}}),v=new ArrayBuffer(4);new Uint32Array(v)[0]=3;const y=h.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});h.queue.writeBuffer(y,0,v);const w=h.createBindGroup({layout:b,entries:[{binding:0,resource:{buffer:y}},{binding:1,resource:{buffer:c.buffer}}]});p=h.createCommandEncoder(),f=p.beginComputePass(),f.setPipeline(g),f.setBindGroup(0,w),f.dispatchWorkgroups(1,1,1),f.end(),h.queue.submit([p.finish()]);const $=await c.readback();B(`  ReLU(h1):         [${Array.from($).map(W=>W.toFixed(3)).join(", ")}]`,"ok");const x=T.fromData(h,new Float32Array([.7,-.3,.5]),[3,1]),k=new T(h,[1,1]),_=new ArrayBuffer(12),q=new Uint32Array(_);q[0]=1,q[1]=1,q[2]=3;const L=h.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),ae=h.createComputePipeline({layout:h.createPipelineLayout({bindGroupLayouts:[L]}),compute:{module:h.createShaderModule({code:it}),entryPoint:"main"}}),Ze=h.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});h.queue.writeBuffer(Ze,0,_);const Je=h.createBindGroup({layout:L,entries:[{binding:0,resource:{buffer:Ze}},{binding:1,resource:{buffer:c.buffer}},{binding:2,resource:{buffer:x.buffer}},{binding:3,resource:{buffer:k.buffer}}]});p=h.createCommandEncoder(),f=p.beginComputePass(),f.setPipeline(ae),f.setBindGroup(0,Je),f.dispatchWorkgroups(1,1,1),f.end(),h.queue.submit([p.finish()]);const Ce=await k.readback(),Ue=(performance.now()-t).toFixed(1);return B(`  Final output: ${Ce[0].toFixed(4)}`,"ok"),B(`  Total pipeline: ${Ue} ms`,"ok"),B("",""),B("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),r.destroy(),n.destroy(),a.destroy(),c.destroy(),x.destroy(),k.destroy(),l.destroy(),Ze.destroy(),y.destroy(),h.destroy(),!0}async function vn(){B("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const e=await we();if(!e)return null;h=await xe(e),Se(h);const t=[64,128,256,512],r=[];for(const n of t){const a=T.fromData(h,new Float32Array(n*n).fill(1),[n,n]),o=T.fromData(h,new Float32Array(n*n).fill(.5),[n,n]),s=new T(h,[n,n]),i=h.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=h.createComputePipeline({layout:h.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:h.createShaderModule({code:it}),entryPoint:"main"}}),l=new ArrayBuffer(12),c=new Uint32Array(l);c[0]=n,c[1]=n,c[2]=n;const d=await Ie(`${n}×${n} matmul`,async()=>{const p=h.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});h.queue.writeBuffer(p,0,l);const f=h.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:s.buffer}}]}),m=h.createCommandEncoder(),b=m.beginComputePass();b.setPipeline(u),b.setBindGroup(0,f);const g=Math.ceil(n/16);b.dispatchWorkgroups(g,g,1),b.end(),h.queue.submit([m.finish()]),p.destroy()},30,2*n*n*n);r.push(d),B(ze(d),"ok"),a.destroy(),o.destroy(),s.destroy()}return h.destroy(),r[r.length-1]}async function yn(){B("═══ CONVOLUTION BENCHMARK ═══","info");const e=await we();if(!e)return null;h=await xe(e),Se(h);const t=1,r=3,n=32,a=32,o=8,s=3,i=3,u=n-s+1,l=a-i+1,c=T.fromData(h,new Float32Array(t*r*n*a).fill(.5),[t,r,n,a]),d=T.fromData(h,new Float32Array(o*r*s*i).fill(.1),[o,r,s,i]),p=new T(h,[t,o,u,l]),f=h.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),m=h.createComputePipeline({layout:h.createPipelineLayout({bindGroupLayouts:[f]}),compute:{module:h.createShaderModule({code:pn}),entryPoint:"main"}}),b=new ArrayBuffer(36),g=new Uint32Array(b);g[0]=t,g[1]=r,g[2]=n,g[3]=a,g[4]=o,g[5]=s,g[6]=i,g[7]=u,g[8]=l;const v=await Ie(`Conv2D ${t}×${r}×${n}×${a} k=${s}→${o}×${u}×${l}`,async()=>{const y=h.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});h.queue.writeBuffer(y,0,b);const w=h.createBindGroup({layout:f,entries:[{binding:0,resource:{buffer:y}},{binding:1,resource:{buffer:c.buffer}},{binding:2,resource:{buffer:d.buffer}},{binding:3,resource:{buffer:p.buffer}}]}),$=h.createCommandEncoder(),x=$.beginComputePass();x.setPipeline(m),x.setBindGroup(0,w),x.dispatchWorkgroups(t,o,1),x.end(),h.queue.submit([$.finish()]),y.destroy()},20,2*t*o*r*s*i*u*l);return B(ze(v),"ok"),c.destroy(),d.destroy(),p.destroy(),h.destroy(),v}async function hn(){B("═══ ATTENTION BENCHMARK ═══","info");const e=await we();if(!e)return null;h=await xe(e),Se(h);const t=1,r=64,n=64,a=1/Math.sqrt(n),o=T.fromData(h,new Float32Array(t*r*n).fill(.1),[t,r,n]),s=T.fromData(h,new Float32Array(t*r*n).fill(.1),[t,r,n]),i=T.fromData(h,new Float32Array(t*r*n).fill(.1),[t,r,n]),u=new T(h,[t,r,n]),l=new T(h,[t,r,r]),c=h.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),d=h.createComputePipeline({layout:h.createPipelineLayout({bindGroupLayouts:[c]}),compute:{module:h.createShaderModule({code:mn}),entryPoint:"main"}}),p=new ArrayBuffer(16),f=new Uint32Array(p),m=new Float32Array(p);f[0]=t,f[1]=r,f[2]=n,m[3]=a;const b=await Ie(`Attention b=${t} s=${r} d=${n}`,async()=>{const g=h.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});h.queue.writeBuffer(g,0,p);const v=h.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}},{binding:4,resource:{buffer:u.buffer}},{binding:5,resource:{buffer:l.buffer}}]}),y=h.createCommandEncoder(),w=y.beginComputePass();w.setPipeline(d),w.setBindGroup(0,v),w.dispatchWorkgroups(t,1,1),w.end(),h.queue.submit([y.finish()]),g.destroy()},20);return B(ze(b),"ok"),o.destroy(),s.destroy(),i.destroy(),u.destroy(),l.destroy(),h.destroy(),b}function wn(e){e.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,Pe=e.querySelector("#model-log"),e.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{Pe.innerHTML="",await Wt()}),e.querySelector("#btn-all-bench").addEventListener("click",async()=>{Pe.innerHTML="",await Wt(),B("",""),await vn(),B("",""),await yn(),B("",""),await hn(),B("",""),B("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const xn=Object.freeze(Object.defineProperty({__proto__:null,render:wn},Symbol.toStringTag,{value:"Module"}));let C=null,me=null;function Z(e,t=""){if(!me)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,me.appendChild(r),me.scrollTop=me.scrollHeight}function Cr(e,t){const r=new Float32Array(e*t*4);for(let n=0;n<t;n++)for(let a=0;a<e;a++){const o=(n*e+a)*4,s=(a>>4)+(n>>4)&1;r[o+0]=s?.9:a/e*.8,r[o+1]=s?.3:n/t*.6,r[o+2]=s?.6:.4,r[o+3]=1}return r}function Ut(e,t,r){const n=document.createElement("canvas");n.width=t,n.height=r;const a=n.getContext("2d"),o=a.createImageData(t,r);for(let s=0;s<t*r*4;s++)o.data[s]=Math.round(e[s]*255);return a.putImageData(o,0,0),n}async function qt(){Z("═══ GRAYSCALE TEST ═══","info");const e=await we();if(!e){Z("WebGPU unavailable","err");return}C=await xe(e),Se(C);const t=256,r=256,n=Cr(t,r),a=T.fromData(C,n,[t*r*4]),o=new T(C,[t*r*4]),s=C.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=C.createComputePipeline({layout:C.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:C.createShaderModule({code:bn}),entryPoint:"main"}}),u=new ArrayBuffer(4);new Uint32Array(u)[0]=t*r;const l=await Ie("Grayscale 256×256",async()=>{const m=C.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});C.queue.writeBuffer(m,0,u);const b=C.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:o.buffer}}]}),g=C.createCommandEncoder(),v=g.beginComputePass();v.setPipeline(i),v.setBindGroup(0,b),v.dispatchWorkgroups(Math.ceil(t*r/256),1,1),v.end(),C.queue.submit([g.finish()]),m.destroy()},50);Z(ze(l),"ok");const c=await o.readback(),d=Ut(n,t,r),p=Ut(c,t,r),f=Rt?.querySelector("#image-display");if(f){f.innerHTML="";const m=document.createElement("div");m.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const b=document.createElement("div");b.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',b.appendChild(d);const g=document.createElement("div");g.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',g.appendChild(p),m.appendChild(b),m.appendChild(g),f.appendChild(m)}a.destroy(),o.destroy(),C.destroy(),Z("✓ Grayscale complete","ok")}async function Ht(){Z("═══ CONVOLUTION KERNEL TEST ═══","info");const e=await we();if(!e){Z("WebGPU unavailable","err");return}C=await xe(e),Se(C);const t=128,r=128,n=3,a=Cr(t,r),o={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},s=C.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=C.createComputePipeline({layout:C.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:C.createShaderModule({code:gn}),entryPoint:"main"}}),u=new ArrayBuffer(16),l=new Uint32Array(u);l[0]=t,l[1]=r,l[2]=n,l[3]=0;for(const[c,d]of Object.entries(o)){const p=T.fromData(C,a,[t*r*4]),f=T.fromData(C,d,[n*n]),m=new T(C,[t*r*4]),b=await Ie(`Conv ${c} ${t}×${r}`,async()=>{const y=C.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});C.queue.writeBuffer(y,0,u);const w=C.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:y}},{binding:1,resource:{buffer:f.buffer}},{binding:2,resource:{buffer:p.buffer}},{binding:3,resource:{buffer:m.buffer}}]}),$=C.createCommandEncoder(),x=$.beginComputePass();x.setPipeline(i),x.setBindGroup(0,w),x.dispatchWorkgroups(Math.ceil(t/16),Math.ceil(r/16),1),x.end(),C.queue.submit([$.finish()]),y.destroy()},30);Z(ze(b),"ok");const g=await m.readback(),v=Rt?.querySelector("#image-display");if(v){const y=Ut(g,t,r),w=document.createElement("div");w.style.cssText="display:inline-block;margin:4px",w.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${c}</div>`,w.appendChild(y),v.appendChild(w)}p.destroy(),f.destroy(),m.destroy()}C.destroy(),Z("✓ All convolution kernels applied","ok")}let Rt=null;function Sn(e){Rt=e,e.innerHTML=`
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
  `,me=e.querySelector("#image-log"),e.querySelector("#btn-grayscale").addEventListener("click",async()=>{me.innerHTML="",e.querySelector("#image-display").innerHTML="",await qt()}),e.querySelector("#btn-conv").addEventListener("click",async()=>{me.innerHTML="",e.querySelector("#image-display").innerHTML="",await Ht()}),e.querySelector("#btn-all-img").addEventListener("click",async()=>{me.innerHTML="",e.querySelector("#image-display").innerHTML="",await qt(),Z("",""),await Ht(),Z("",""),Z("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const Mn=Object.freeze(Object.defineProperty({__proto__:null,render:Sn},Symbol.toStringTag,{value:"Module"}));let I=null,Ve=null,at=null;function Bt(e,t=""){if(!Ve)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Ve.appendChild(r),Ve.scrollTop=Ve.scrollHeight}const En=`
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
`;let Tt=0,ot=0;async function Pn(e,t,r,n,a){const o=await we();if(!o){Bt("WebGPU unavailable","err");return}I=await xe(o),Se(I);const[s,i]=n.value.split("x").map(Number);e.width=s,e.height=i,Tt=parseInt(a.value);const u=I.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),l=I.createComputePipeline({layout:I.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:I.createShaderModule({code:En}),entryPoint:"main"}}),c=I.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),d=e.getContext("2d"),p=I.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let f=performance.now(),m=0,b=0;t.textContent="RENDERING",t.className="badge badge-pass";function g(){const v=new ArrayBuffer(16),y=new Uint32Array(v);y[0]=s,y[1]=i,y[2]=ot,y[3]=Tt,I.queue.writeBuffer(p,0,v);const w=I.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:c}}]}),$=I.createCommandEncoder(),x=$.beginComputePass();x.setPipeline(l),x.setBindGroup(0,w),x.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(i/16),1),x.end();const k=I.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});$.copyBufferToBuffer(c,0,k,0,s*i*4*4),I.queue.submit([$.finish()]),k.mapAsync(GPUMapMode.READ).then(()=>{const _=new Float32Array(k.getMappedRange().slice(0));k.unmap(),k.destroy();const q=d.createImageData(s,i);for(let ae=0;ae<s*i*4;ae++)q.data[ae]=Math.round(_[ae]*255);d.putImageData(q,0,0),ot++,b++;const L=performance.now();L-f>=1e3&&(m=Math.round(b*1e3/(L-f)),r.textContent=`${m} FPS | Frame ${ot} | ${s}×${i}`,b=0,f=L),at=requestAnimationFrame(g)})}g()}function jt(){at!==null&&(cancelAnimationFrame(at),at=null),I&&(I.destroy(),I=null)}function An(e){e.innerHTML=`
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
  `,Ve=e.querySelector("#video-log");const t=e.querySelector("#video-canvas"),r=e.querySelector("#video-status"),n=e.querySelector("#video-fps"),a=e.querySelector("#res-select"),o=e.querySelector("#mode-select");e.querySelector("#btn-start").addEventListener("click",()=>{jt(),ot=0,Tt=parseInt(o.value),Bt(`Starting GPU compute video: ${a.value} mode=${o.value}`,"info"),Pn(t,r,n,a,o)}),e.querySelector("#btn-stop").addEventListener("click",()=>{jt(),r.textContent="STOPPED",r.className="badge badge-info",Bt("Rendering stopped","warn")})}const $n=Object.freeze(Object.defineProperty({__proto__:null,render:An},Symbol.toStringTag,{value:"Module"}));let De=null;function A(e,t=""){if(!De)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,De.appendChild(r),De.scrollTop=De.scrollHeight}async function Cn(){if(De.innerHTML="",A("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),A(`Timestamp: ${new Date().toISOString()}`,""),!await Un())return;const t=await we();if(!t){A("Cannot proceed: GPU not ready","err");return}A("",""),A("── MEMORY TEST ──","info");const r=await xe(t);Se(r);const n=Math.floor(t.limits.maxBufferSize/1048576);A(`Attempting to allocate buffer at reported max: ${n} MB`,"");try{const a=r.createBuffer({size:t.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});A("Buffer allocation at max: SUCCESS","ok"),a.destroy()}catch(a){A(`Buffer allocation at max: FAILED — ${a.message}`,"warn");for(const o of[256,128,64,32])try{const s=r.createBuffer({size:o*1048576,usage:GPUBufferUsage.STORAGE});A(`Largest successful allocation: ${o} MB`,"ok"),s.destroy();break}catch{continue}}A("",""),A("── COMPUTE THROUGHPUT ──","info");for(const a of[64,128,256]){const o=T.fromData(r,new Float32Array(a*a).fill(1),[a,a]),s=T.fromData(r,new Float32Array(a*a).fill(1),[a,a]),i=new T(r,[a,a]),u=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),l=r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:r.createShaderModule({code:it}),entryPoint:"main"}}),c=await Ie(`matmul ${a}×${a}`,async()=>{const d=r.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=new ArrayBuffer(12);new Uint32Array(p).set([a,a,a]),r.queue.writeBuffer(d,0,p);const f=r.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),m=r.createCommandEncoder(),b=m.beginComputePass();b.setPipeline(l),b.setBindGroup(0,f);const g=Math.ceil(a/16);b.dispatchWorkgroups(g,g,1),b.end(),r.queue.submit([m.finish()]),d.destroy()},30,2*a*a*a);A(ze(c),"ok"),o.destroy(),s.destroy(),i.destroy()}r.destroy(),A("",""),A("═══ DIAGNOSTICS COMPLETE ═══","info")}async function Un(){const e=await bt();return Pr(e),A("── WEBGPU STATUS ──","info"),A(`${e.statusLabel} (Case ${e.case})`,e.ready?"ok":"err"),A(`Reason: ${e.reason}`,""),A(`Recommendation: ${e.recommendation}`,""),A("",""),A("── ENVIRONMENT ──","info"),A(`  URL: ${e.environment.url}`,""),A(`  Secure Context: ${e.environment.isSecureContext}`,e.environment.isSecureContext?"ok":"err"),A(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`,""),A(`  OS: ${e.environment.osName} ${e.environment.osVersion}`,""),A(`  iOS: ${e.environment.isIOS}`,""),A(`  Safari: ${e.environment.isSafari}`,""),A(`  WebView: ${e.environment.isWebView}`,e.environment.isWebView?"err":""),A(`  navigator.gpu: ${e.gpu.navigatorGpuExists}`,e.gpu.navigatorGpuExists?"ok":"err"),e.gpu.adapterName&&(A(`  Adapter: ${e.gpu.adapterName}`,"ok"),A(`  Vendor: ${e.gpu.adapterVendor}`,"")),e.gpu.adapterError&&A(`  Adapter Error: ${e.gpu.adapterError}`,"err"),e.gpu.deviceError&&A(`  Device Error: ${e.gpu.deviceError}`,"err"),e.ready?!0:(A("",""),A("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function Bn(e){e.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,De=e.querySelector("#diag-log"),e.querySelector("#btn-diag").addEventListener("click",()=>{Cn()})}const Tn=Object.freeze(Object.defineProperty({__proto__:null,render:Bn},Symbol.toStringTag,{value:"Module"}));class pe{dims;ndim;size;strides;constructor(t){this.dims=typeof t=="number"?[t]:[...t],this.ndim=this.dims.length,this.size=this.dims.reduce((a,o)=>a*o,1);const r=new Array(this.ndim);let n=1;for(let a=this.ndim-1;a>=0;a--)r[a]=n,n*=this.dims[a];this.strides=r}equals(t){if(this.ndim!==t.ndim)return!1;for(let r=0;r<this.ndim;r++)if(this.dims[r]!==t.dims[r])return!1;return!0}isContiguous(){let t=1;for(let r=this.ndim-1;r>=0;r--){if(this.strides[r]!==t)return!1;t*=this.dims[r]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new pe([1])}static from(...t){return new pe(t)}}var oe=(e=>(e.Float32="f32",e.Float16="f16",e.Int32="i32",e.Int8="i8",e.Uint8="u8",e))(oe||{});const kn={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function Ur(e){return kn[e].bytes}let te=null;async function Dn(){if(te)return te;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.limits,r=new Set(e.features),n=await e.requestDevice({requiredLimits:{}});return n.lost.then(a=>{console.error("WebGPU device lost:",a.message),te=null}),te={adapter:e,device:n,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:t.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:t.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:t.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:t.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:t.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:t.maxTextureArrayLayers},features:r},te}function G(){if(!te)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return te}function On(){te&&(te.device.destroy(),te=null)}class Oe{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(t,r,n){this.shape=t,this.dtype=r,this.byteSize=t.size*Ur(r),this.gpuBuffer=n??G().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(t,r,n=oe.Float32){const a=G(),o=new Oe(t,n);return a.device.queue.writeBuffer(o.gpuBuffer,0,r.buffer,r.byteOffset,r.byteLength),o}async readback(){const t=G(),r=t.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),n=t.device.createCommandEncoder();n.copyBufferToBuffer(this.gpuBuffer,0,r,0,this.byteSize),t.device.queue.submit([n.finish()]),await r.mapAsync(GPUMapMode.READ);const a=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),a}destroy(){this.gpuBuffer.destroy()}}class E{shape;dtype;buffer;constructor(t,r=oe.Float32,n){this.shape=t,this.dtype=r,this.buffer=n??new Oe(t,r)}static fromFloat32(t,r){const n=t instanceof Float32Array?t:new Float32Array(t),a=new pe(r);return new E(a,oe.Float32,Oe.fromData(a,n,oe.Float32))}static fromInt32(t,r){const n=t instanceof Int32Array?t:new Int32Array(t),a=new pe(r);return new E(a,oe.Int32,Oe.fromData(a,n,oe.Int32))}static zeros(t,r=oe.Float32){const n=new pe(t),a=n.size*Ur(r),s=G().device.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(s.getMappedRange()).fill(0),s.unmap();const i=new Oe(n,r,s);return new E(n,r,i)}static ones(t,r=oe.Float32){const n=new pe(t).size,a=new Float32Array(n).fill(1);return E.fromFloat32(a,t)}static randn(t){const r=new pe(t).size,n=new Float32Array(r);for(let a=0;a<r;a++){const o=Math.random(),s=Math.random();n[a]=Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*s)}return E.fromFloat32(n,t)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class Gn{cache=new Map;getOrCreate(t,r,n){if(this.cache.has(t))return this.cache.get(t);const a=G(),o=a.device.createComputePipeline({layout:a.device.createPipelineLayout({bindGroupLayouts:[n]}),compute:{module:a.device.createShaderModule({code:r}),entryPoint:"main"}});return this.cache.set(t,o),o}get(t){return this.cache.get(t)}clear(){this.cache.clear()}}const Nn=`
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x;
  let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.K; k++) {
    sum += A[row * u.K + k] * B[k * u.N + col];
  }
  C[row * u.N + col] = sum;
}
`,_n=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u.N) { return; }
  C[i] = A[i] + B[i];
}
`,Rn=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u.N) { return; }
  C[i] = A[i] * B[i];
}
`,Fn=`
struct Uniforms { N: u32, eps: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= 1u) { return; }
  var sum_sq: f32 = 0.0;
  for (var j: u32 = 0u; j < u.N; j++) {
    sum_sq += input[j] * input[j];
  }
  let rms = sqrt(sum_sq / f32(u.N) + u.eps);
  for (var j: u32 = 0u; j < u.N; j++) {
    output[j] = (input[j] / rms) * weight[j];
  }
}
`,Ln=`
struct Uniforms { N: u32, eps: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> gamma: array<f32>;
@group(0) @binding(3) var<storage, read> beta: array<f32>;
@group(0) @binding(4) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= 1u) { return; }
  var mean: f32 = 0.0;
  for (var j: u32 = 0u; j < u.N; j++) {
    mean += input[j];
  }
  mean /= f32(u.N);
  var var_sum: f32 = 0.0;
  for (var j: u32 = 0u; j < u.N; j++) {
    let d = input[j] - mean;
    var_sum += d * d;
  }
  let variance = var_sum / f32(u.N);
  let inv_std = 1.0 / sqrt(variance + u.eps);
  for (var j: u32 = 0u; j < u.N; j++) {
    output[j] = (input[j] - mean) * inv_std * gamma[j] + beta[j];
  }
}
`,In=`
struct Uniforms { rows: u32, cols: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x;
  if (row >= u.rows) { return; }
  let base = row * u.cols;
  var max_val: f32 = -1e30;
  for (var j: u32 = 0u; j < u.cols; j++) {
    if (data[base + j] > max_val) { max_val = data[base + j]; }
  }
  var sum_exp: f32 = 0.0;
  for (var j: u32 = 0u; j < u.cols; j++) {
    let e = exp(data[base + j] - max_val);
    data[base + j] = e;
    sum_exp += e;
  }
  for (var j: u32 = 0u; j < u.cols; j++) {
    data[base + j] /= sum_exp;
  }
}
`,zn=`
struct Uniforms { seq: u32, dim: u32, base: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u.seq * u.dim / 2u) { return; }
  let pos = i / (u.dim / 2u);
  let half = i % (u.dim / 2u);
  let freq = 1.0 / pow(u.base, f32(half) / f32(u.dim));
  let theta = f32(pos) * freq;
  let cos_t = cos(theta);
  let sin_t = sin(theta);
  let idx0 = i * 2u;
  let idx1 = i * 2u + 1u;
  let x0 = data[idx0];
  let x1 = data[idx1];
  data[idx0] = x0 * cos_t - x1 * sin_t;
  data[idx1] = x0 * sin_t + x1 * cos_t;
}
`,Wn=`
struct Uniforms { N: u32, C: u32, H: u32, W: u32, F: u32, FH: u32, FW: u32, OH: u32, OW: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> kernel: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let n = gid.x;
  let f = gid.y;
  if (n >= u.N || f >= u.F) { return; }
  for (var oh = 0u; oh < u.OH; oh++) {
    for (var ow = 0u; ow < u.OW; ow++) {
      var sum: f32 = 0.0;
      for (var c = 0u; c < u.C; c++) {
        for (var fh = 0u; fh < u.FH; fh++) {
          for (var fw = 0u; fw < u.FW; fw++) {
            let ih = oh + fh;
            let iw = ow + fw;
            let in_idx = ((n * u.C + c) * u.H + ih) * u.W + iw;
            let k_idx = ((f * u.C + c) * u.FH + fh) * u.FW + fw;
            sum += input[in_idx] * kernel[k_idx];
          }
        }
      }
      let out_idx = ((n * u.F + f) * u.OH + oh) * u.OW + ow;
      output[out_idx] = sum;
    }
  }
}
`,qn=`
struct Uniforms { rows: u32, cols: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let r = gid.x;
  let c = gid.y;
  if (r >= u.rows || c >= u.cols) { return; }
  output[c * u.rows + r] = input[r * u.cols + c];
}
`,Hn=`
struct Uniforms { inW: u32, inH: u32, outW: u32, outH: u32, channels: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let ox = gid.x;
  let oy = gid.y;
  if (ox >= u.outW || oy >= u.outH) { return; }

  let fx = f32(ox) * f32(u.inW) / f32(u.outW);
  let fy = f32(oy) * f32(u.inH) / f32(u.outH);

  let x0 = u32(fx);
  let y0 = u32(fy);
  let x1 = min(x0 + 1u, u.inW - 1u);
  let y1 = min(y0 + 1u, u.inH - 1u);

  let wx = fx - f32(x0);
  let wy = fy - f32(y0);

  for (var ch = 0u; ch < u.channels; ch++) {
    let v00 = input[(y0 * u.inW + x0) * u.channels + ch];
    let v10 = input[(y0 * u.inW + x1) * u.channels + ch];
    let v01 = input[(y1 * u.inW + x0) * u.channels + ch];
    let v11 = input[(y1 * u.inW + x1) * u.channels + ch];
    let val = v00 * (1.0 - wx) * (1.0 - wy)
            + v10 * wx * (1.0 - wy)
            + v01 * (1.0 - wx) * wy
            + v11 * wx * wy;
    output[(oy * u.outW + ox) * u.channels + ch] = val;
  }
}
`;function jn(e,t,r,n,a){const o=new Float32Array(r*n);for(let s=0;s<r;s++)for(let i=0;i<n;i++){let u=0;for(let l=0;l<a;l++)u+=e[s*a+l]*t[l*n+i];o[s*n+i]=u}return o}function Vn(e,t){const r=new Float32Array(e.length);for(let n=0;n<e.length;n++)r[n]=e[n]+t[n];return r}function Kn(e,t){const r=new Float32Array(e.length);for(let n=0;n<e.length;n++)r[n]=e[n]*t[n];return r}function Yn(e,t,r=1e-6){const n=e.length;let a=0;for(let i=0;i<n;i++)a+=e[i]*e[i];const o=Math.sqrt(a/n+r),s=new Float32Array(n);for(let i=0;i<n;i++)s[i]=e[i]/o*t[i];return s}function Qn(e,t,r,n=1e-6){const a=e.length;let o=0;for(let l=0;l<a;l++)o+=e[l];o/=a;let s=0;for(let l=0;l<a;l++){const c=e[l]-o;s+=c*c}s/=a;const i=1/Math.sqrt(s+n),u=new Float32Array(a);for(let l=0;l<a;l++)u[l]=(e[l]-o)*i*t[l]+r[l];return u}function Xn(e,t,r){const n=new Float32Array(e.length);for(let a=0;a<t;a++){const o=a*r;let s=-1e30;for(let u=0;u<r;u++)e[o+u]>s&&(s=e[o+u]);let i=0;for(let u=0;u<r;u++)n[o+u]=Math.exp(e[o+u]-s),i+=n[o+u];for(let u=0;u<r;u++)n[o+u]/=i}return n}function Zn(e,t,r,n=1e4){const a=new Float32Array(e.length);a.set(e);for(let o=0;o<t*r/2;o++){const s=Math.floor(o/(r/2)),i=o%(r/2),u=1/Math.pow(n,i/r),l=s*u,c=Math.cos(l),d=Math.sin(l),p=o*2,f=o*2+1,m=a[p],b=a[f];a[p]=m*c-b*d,a[f]=m*d+b*c}return a}function Jn(e,t,r,n,a,o,s,i,u){const l=a-i+1,c=o-u+1,d=new Float32Array(r*s*l*c);for(let p=0;p<r;p++)for(let f=0;f<s;f++)for(let m=0;m<l;m++)for(let b=0;b<c;b++){let g=0;for(let v=0;v<n;v++)for(let y=0;y<i;y++)for(let w=0;w<u;w++)g+=e[((p*n+v)*a+m+y)*o+b+w]*t[((f*n+v)*i+y)*u+w];d[((p*s+f)*l+m)*c+b]=g}return d}function ea(e,t,r){const n=new Float32Array(t*r);for(let a=0;a<t;a++)for(let o=0;o<r;o++)n[o*t+a]=e[a*r+o];return n}function ta(e,t,r,n,a,o){const s=new Float32Array(n*a*o);for(let i=0;i<a;i++)for(let u=0;u<n;u++){const l=u*t/n,c=i*r/a,d=Math.floor(l),p=Math.floor(c),f=Math.min(d+1,t-1),m=Math.min(p+1,r-1),b=l-d,g=c-p;for(let v=0;v<o;v++){const y=e[(p*t+d)*o+v],w=e[(p*t+f)*o+v],$=e[(m*t+d)*o+v],x=e[(m*t+f)*o+v];s[(i*n+u)*o+v]=y*(1-b)*(1-g)+w*b*(1-g)+$*(1-b)*g+x*b*g}}return s}const ne=new Gn;function ue(e){return G().device.createBindGroupLayout({entries:Array.from({length:e},(r,n)=>({binding:n,visibility:GPUShaderStage.COMPUTE,buffer:n===0?{type:"uniform"}:{type:"storage"}}))})}function vt(e){const t=G(),r=t.device.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.device.queue.writeBuffer(r,0,e),r}function $e(e,t,r,n,a,o){const s=G(),i=vt(a),u=[{binding:0,resource:{buffer:i}},...n.map((d,p)=>({binding:p+1,resource:{buffer:d.buffer.gpuBuffer}}))],l=s.device.createBindGroup({layout:r,entries:u}),c=e.beginComputePass();return c.setPipeline(t),c.setBindGroup(0,l),c.dispatchWorkgroups(o),c.end(),i}async function Be(e,t,r,n,a){const o=G(),s=E.zeros([r,n]),i=ue(4),u=ne.getOrCreate("matmul",Nn,i),l=new ArrayBuffer(12),c=new Uint32Array(l);c[0]=r,c[1]=n,c[2]=a;const d=o.device.createCommandEncoder();return $e(d,u,i,[e,t,s],l,Math.ceil(r/16)*Math.ceil(n/16)),o.device.queue.submit([d.finish()]),s}function Te(e,t,r,n,a){return jn(e,t,r,n,a)}async function Vt(e,t){const r=G(),n=E.zeros([e.shape.size]),a=ue(4),o=ne.getOrCreate("add",_n,a),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=r.device.createCommandEncoder();return $e(i,o,a,[e,t,n],s,Math.ceil(e.shape.size/256)),r.device.queue.submit([i.finish()]),n}function Kt(e,t){return Vn(e,t)}async function Yt(e,t){const r=G(),n=E.zeros([e.shape.size]),a=ue(4),o=ne.getOrCreate("multiply",Rn,a),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=r.device.createCommandEncoder();return $e(i,o,a,[e,t,n],s,Math.ceil(e.shape.size/256)),r.device.queue.submit([i.finish()]),n}function Qt(e,t){return Kn(e,t)}async function Xt(e,t,r=1e-6){const n=G(),a=e.shape.size,o=E.zeros([a]),s=ue(4),i=ne.getOrCreate("rms_norm",Fn,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=a,new Float32Array(u)[1]=r;const l=n.device.createCommandEncoder();return $e(l,i,s,[e,t,o],u,1),n.device.queue.submit([l.finish()]),o}function Zt(e,t,r=1e-6){return Yn(e,t,r)}async function Jt(e,t,r,n=1e-6){const a=G(),o=e.shape.size,s=E.zeros([o]),i=a.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=ne.getOrCreate("layer_norm",Ln,i),l=new ArrayBuffer(8);new Uint32Array(l)[0]=o,new Float32Array(l)[1]=n;const c=G(),d=vt(l),p=c.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:e.buffer.gpuBuffer}},{binding:2,resource:{buffer:t.buffer.gpuBuffer}},{binding:3,resource:{buffer:r.buffer.gpuBuffer}},{binding:4,resource:{buffer:s.buffer.gpuBuffer}}]}),f=c.device.createCommandEncoder(),m=f.beginComputePass();return m.setPipeline(u),m.setBindGroup(0,p),m.dispatchWorkgroups(1),m.end(),c.device.queue.submit([f.finish()]),s}function er(e,t,r,n=1e-6){return Qn(e,t,r,n)}async function tr(e,t,r){const n=G(),a=E.zeros([t,r]),o=n.device.createCommandEncoder();o.copyBufferToBuffer(e.buffer.gpuBuffer,0,a.buffer.gpuBuffer,0,t*r*4);const s=ue(2),i=ne.getOrCreate("softmax",In,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=t,new Uint32Array(u)[1]=r;const l=vt(u),c=n.device.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:a.buffer.gpuBuffer}}]}),d=o.beginComputePass();return d.setPipeline(i),d.setBindGroup(0,c),d.dispatchWorkgroups(Math.ceil(t)),d.end(),n.device.queue.submit([o.finish()]),a}function rr(e,t,r){return Xn(e,t,r)}async function nr(e,t,r,n=1e4){const a=G(),o=E.zeros([t,r]),s=a.device.createCommandEncoder();s.copyBufferToBuffer(e.buffer.gpuBuffer,0,o.buffer.gpuBuffer,0,t*r*4);const i=ue(2),u=ne.getOrCreate("rope",zn,i),l=new ArrayBuffer(12);new Uint32Array(l)[0]=t,new Uint32Array(l)[1]=r,new Float32Array(l)[2]=n;const c=vt(l),d=a.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:o.buffer.gpuBuffer}}]}),p=s.beginComputePass();return p.setPipeline(u),p.setBindGroup(0,d),p.dispatchWorkgroups(Math.ceil(t*r/2/256)),p.end(),a.device.queue.submit([s.finish()]),o}function ar(e,t,r,n=1e4){return Zn(e,t,r,n)}async function or(e,t,r,n,a,o,s,i,u){const l=G(),c=a-i+1,d=o-u+1,p=E.zeros([r,s,c,d]),f=ue(4),m=ne.getOrCreate("conv2d",Wn,f),b=new ArrayBuffer(36),g=new Uint32Array(b);g[0]=r,g[1]=n,g[2]=a,g[3]=o,g[4]=s,g[5]=i,g[6]=u,g[7]=c,g[8]=d;const v=l.device.createCommandEncoder();return $e(v,m,f,[e,t,p],b,r*s),l.device.queue.submit([v.finish()]),p}function sr(e,t,r,n,a,o,s,i,u){return Jn(e,t,r,n,a,o,s,i,u)}async function ir(e,t,r){const n=G(),a=E.zeros([r,t]),o=ue(3),s=ne.getOrCreate("transpose_2d",qn,o),i=new ArrayBuffer(8);new Uint32Array(i)[0]=t,new Uint32Array(i)[1]=r;const u=n.device.createCommandEncoder();return $e(u,s,o,[e,a],i,Math.ceil(t/16)*Math.ceil(r/16)),n.device.queue.submit([u.finish()]),a}function ur(e,t,r){return ea(e,t,r)}async function cr(e,t,r,n,a,o){const s=G(),i=E.zeros([a*n*o]),u=ue(3),l=ne.getOrCreate("interpolate_bilinear",Hn,u),c=new ArrayBuffer(20),d=new Uint32Array(c);d[0]=t,d[1]=r,d[2]=n,d[3]=a,d[4]=o;const p=s.device.createCommandEncoder();return $e(p,l,u,[e,i],c,Math.ceil(n/16)*Math.ceil(a/16)),s.device.queue.submit([p.finish()]),i}function lr(e,t,r,n,a,o){return ta(e,t,r,n,a,o)}let Ge=null,ut=null;function X(e,t=""){if(!Ge)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Ge.appendChild(r),Ge.scrollTop=Ge.scrollHeight}function j(e,t,r=.001){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++){const a=Math.abs(e[n]-t[n]),o=Math.max(Math.abs(e[n]),Math.abs(t[n]),1e-8);if(a/o>r)return!1}return!0}async function V(e,t,r=20){for(let a=0;a<3;a++)t();const n=[];for(let a=0;a<r;a++){const o=performance.now();t(),n.push(performance.now()-o)}return n.reduce((a,o)=>a+o,0)/n.length}async function K(e,t,r=20){const n=[];for(let a=0;a<Math.min(5,r);a++)await t();for(let a=0;a<r;a++){const o=performance.now();await t(),n.push(performance.now()-o)}return n.reduce((a,o)=>a+o,0)/n.length}function ra(e){if(!ut)return;const t=document.createElement("tr");t.innerHTML=`
    <td style="font-weight:600">${e.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${e.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${e.speedup>=1?"var(--green)":"var(--red)"}">
      ${e.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${e.correct?"badge-pass":"badge-fail"}">${e.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${e.tolerance.toExponential(1)}</td>
  `,ut.appendChild(t)}async function na(){Ge.innerHTML="",ut.innerHTML="",X("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),X("Initializing WebGPU...","");let e;try{e=await Dn()}catch(n){X(`FATAL: ${n.message}`,"err"),X("WebGPU is not available. Cannot run GPU benchmarks.","err");return}X(`GPU: ${e.adapter.name??"Unknown"}`,"ok"),X(`Running benchmarks...
`,"");const t=[];{const s=E.randn([64,64]),i=E.randn([64,64]),u=await s.readback(),l=await i.readback(),c=await V("matmul 64",()=>Te(u,l,64,64,64)),d=await K("matmul 64",async()=>{(await Be(s,i,64,64,64)).destroy()}),p=await(await Be(s,i,64,64,64)).readback(),f=Te(u,l,64,64,64),m=j(f,p),b=Math.max(...Array.from(f).map((g,v)=>Math.abs(g-p[v])));t.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:c,gpuMs:d,speedup:c/d,correct:m,tolerance:b}),s.destroy(),i.destroy()}{const s=E.randn([256,256]),i=E.randn([256,256]),u=await s.readback(),l=await i.readback(),c=await V("matmul 256",()=>Te(u,l,256,256,256),10),d=await K("matmul 256",async()=>{(await Be(s,i,256,256,256)).destroy()}),p=await(await Be(s,i,256,256,256)).readback(),f=Te(u,l,256,256,256),m=j(f,p),b=Math.max(...Array.from(f).map((g,v)=>Math.abs(g-p[v])));t.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:c,gpuMs:d,speedup:c/d,correct:m,tolerance:b}),s.destroy(),i.destroy()}{const s=E.randn([512,512]),i=E.randn([512,512]),u=await s.readback(),l=await i.readback(),c=await V("matmul 512",()=>Te(u,l,512,512,512),5),d=await K("matmul 512",async()=>{(await Be(s,i,512,512,512)).destroy()}),p=await(await Be(s,i,512,512,512)).readback(),f=Te(u,l,512,512,512),m=j(f,p),b=Math.max(...Array.from(f).map((g,v)=>Math.abs(g-p[v])));t.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:c,gpuMs:d,speedup:c/d,correct:m,tolerance:b}),s.destroy(),i.destroy()}{const a=E.randn([1e6]),o=E.randn([1e6]),s=await a.readback(),i=await o.readback(),u=await V("add 1M",()=>Kt(s,i)),l=await K("add 1M",async()=>{(await Vt(a,o)).destroy()}),c=await(await Vt(a,o)).readback(),d=Kt(s,i),p=j(d,c),f=Math.max(...Array.from(d).map((m,b)=>Math.abs(m-c[b])));t.push({name:"Add",shape:"[1000000]",cpuMs:u,gpuMs:l,speedup:u/l,correct:p,tolerance:f}),a.destroy(),o.destroy()}{const a=E.randn([1e6]),o=E.randn([1e6]),s=await a.readback(),i=await o.readback(),u=await V("mul 1M",()=>Qt(s,i)),l=await K("mul 1M",async()=>{(await Yt(a,o)).destroy()}),c=await(await Yt(a,o)).readback(),d=Qt(s,i),p=j(d,c),f=Math.max(...Array.from(d).map((m,b)=>Math.abs(m-c[b])));t.push({name:"Multiply",shape:"[1000000]",cpuMs:u,gpuMs:l,speedup:u/l,correct:p,tolerance:f}),a.destroy(),o.destroy()}{const a=E.randn([1024]),o=E.ones([1024]),s=await a.readback(),i=await o.readback(),u=await V("rmsnorm",()=>Zt(s,i)),l=await K("rmsnorm",async()=>{(await Xt(a,o)).destroy()}),c=await(await Xt(a,o)).readback(),d=Zt(s,i),p=j(d,c),f=Math.max(...Array.from(d).map((m,b)=>Math.abs(m-c[b])));t.push({name:"RMSNorm",shape:"[1024]",cpuMs:u,gpuMs:l,speedup:u/l,correct:p,tolerance:f}),a.destroy(),o.destroy()}{const a=E.randn([1024]),o=E.ones([1024]),s=E.zeros([1024]),i=await a.readback(),u=await o.readback(),l=await s.readback(),c=await V("layernorm",()=>er(i,u,l)),d=await K("layernorm",async()=>{(await Jt(a,o,s)).destroy()}),p=await(await Jt(a,o,s)).readback(),f=er(i,u,l),m=j(f,p),b=Math.max(...Array.from(f).map((g,v)=>Math.abs(g-p[v])));t.push({name:"LayerNorm",shape:"[1024]",cpuMs:c,gpuMs:d,speedup:c/d,correct:m,tolerance:b}),a.destroy(),o.destroy(),s.destroy()}{const o=E.randn([32,128]),s=await o.readback(),i=await V("softmax",()=>rr(new Float32Array(s),32,128)),u=await K("softmax",async()=>{(await tr(E.fromFloat32(new Float32Array(s),[32,128]),32,128)).destroy()}),l=await(await tr(E.fromFloat32(new Float32Array(s),[32,128]),32,128)).readback(),c=rr(new Float32Array(s),32,128),d=j(c,l),p=Math.max(...Array.from(c).map((f,m)=>Math.abs(f-l[m])));t.push({name:"Softmax",shape:"[32, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:p}),o.destroy()}{const o=E.randn([16,128]),s=await o.readback(),i=await V("rope",()=>ar(new Float32Array(s),16,128)),u=await K("rope",async()=>{(await nr(E.fromFloat32(new Float32Array(s),[16,128]),16,128)).destroy()}),l=await(await nr(E.fromFloat32(new Float32Array(s),[16,128]),16,128)).readback(),c=ar(new Float32Array(s),16,128),d=j(c,l),p=Math.max(...Array.from(c).map((f,m)=>Math.abs(f-l[m])));t.push({name:"RoPE",shape:"[16, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:p}),o.destroy()}{const c=E.randn([1,3,16,16]),d=E.randn([4,3,3,3]),p=await c.readback(),f=await d.readback(),m=await V("conv2d",()=>sr(p,f,1,3,16,16,4,3,3)),b=await K("conv2d",async()=>{(await or(c,d,1,3,16,16,4,3,3)).destroy()}),g=await(await or(c,d,1,3,16,16,4,3,3)).readback(),v=sr(p,f,1,3,16,16,4,3,3),y=j(v,g),w=Math.max(...Array.from(v).map(($,x)=>Math.abs($-g[x])));t.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:m,gpuMs:b,speedup:m/b,correct:y,tolerance:w}),c.destroy(),d.destroy()}{const o=E.randn([256,256]),s=await o.readback(),i=await V("transpose",()=>ur(s,256,256)),u=await K("transpose",async()=>{(await ir(o,256,256)).destroy()}),l=await(await ir(o,256,256)).readback(),c=ur(s,256,256),d=j(c,l),p=Math.max(...Array.from(c).map((f,m)=>Math.abs(f-l[m])));t.push({name:"Transpose",shape:"[256, 256]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:p}),o.destroy()}{const u=E.randn([3072]),l=await u.readback(),c=await V("interp",()=>lr(l,32,32,64,64,3)),d=await K("interp",async()=>{(await cr(u,32,32,64,64,3)).destroy()}),p=await(await cr(u,32,32,64,64,3)).readback(),f=lr(l,32,32,64,64,3),m=j(f,p),b=Math.max(...Array.from(f).map((g,v)=>Math.abs(g-p[v])));t.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:c,gpuMs:d,speedup:c/d,correct:m,tolerance:b}),u.destroy()}X("",""),X("═══ RESULTS ═══","info");for(const n of t){ra(n);const a=n.correct?"✓":"✗",o=n.correct?"ok":"err";X(`${a} ${n.name} (${n.shape}): CPU ${n.cpuMs.toFixed(2)} ms | GPU ${n.gpuMs.toFixed(2)} ms | ${n.speedup.toFixed(1)}× | max diff ${n.tolerance.toExponential(1)}`,o)}const r=t.filter(n=>n.correct).length;X("",""),X(`═══ ${r}/${t.length} CORRECT ═══`,r===t.length?"ok":"err"),On()}function aa(e){e.innerHTML=`
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
  `,Ge=e.querySelector("#bench-log"),ut=e.querySelector("#bench-tbody"),e.querySelector("#btn-run-bench").addEventListener("click",()=>{na()})}const oa=Object.freeze(Object.defineProperty({__proto__:null,render:aa},Symbol.toStringTag,{value:"Module"}));let ce=null,tt="";function sa(e){const t=e.environment,r=e.gpu,n=e.case==="D"?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)";let a=`
    <div style="text-align:center;margin:20px 0">
      <div style="font-size:28px;font-weight:800;color:${n};letter-spacing:1px">${e.statusLabel}</div>
      <div style="font-size:14px;color:var(--text-dim);margin-top:8px">Case ${e.case}</div>
    </div>

    <div class="card" style="border-color:${n}">
      <div class="card-title" style="margin-bottom:8px">Diagnosis</div>
      <p style="font-size:13px;color:var(--text);line-height:1.6">${e.reason}</p>
      <p style="font-size:13px;color:var(--text);margin-top:10px;font-weight:600;line-height:1.6">${e.recommendation}</p>
    </div>
  `;if(a+=`
    <h3>Environment</h3>
    <div class="card">
      <div class="row"><span class="row-label">URL</span><span class="row-value" style="font-size:10px;word-break:break-all;max-width:55%;text-align:right">${t.url}</span></div>
      <div class="row"><span class="row-label">Protocol</span><span class="row-value">${t.protocol}</span></div>
      <div class="row"><span class="row-label">Hostname</span><span class="row-value">${t.hostname}</span></div>
      <div class="row"><span class="row-label">Secure Context</span><span class="row-value" style="color:${t.isSecureContext?"var(--green)":"var(--red)"}">${t.isSecureContext?"Yes ✓":"No ✗"}</span></div>
      <div class="row"><span class="row-label">Browser</span><span class="row-value">${t.browserName} ${t.browserVersion}</span></div>
      <div class="row"><span class="row-label">OS</span><span class="row-value">${t.osName} ${t.osVersion}</span></div>
      <div class="row"><span class="row-label">Platform</span><span class="row-value">${t.platform}</span></div>
      <div class="row"><span class="row-label">iOS Device</span><span class="row-value">${t.isIOS?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">Safari</span><span class="row-value">${t.isSafari?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">WebView / In-App Browser</span><span class="row-value" style="color:${t.isWebView?"var(--red)":"var(--green)"}">${t.isWebView?"Yes (BLOCKED)":"No"}</span></div>
      <div class="row"><span class="row-label">Standalone PWA</span><span class="row-value">${t.isStandalone?"Yes":"No"}</span></div>
    </div>
  `,a+=`
    <h3>WebGPU API</h3>
    <div class="card">
      <div class="row"><span class="row-label">navigator.gpu</span><span class="row-value" style="color:${r.navigatorGpuExists?"var(--green)":"var(--red)"}">${r.navigatorGpuExists?"Exists ✓":"Undefined ✗"}</span></div>
  `,r.adapterName&&(a+=`
      <div class="row"><span class="row-label">Adapter</span><span class="row-value">${r.adapterName}</span></div>
      <div class="row"><span class="row-label">Vendor</span><span class="row-value">${r.adapterVendor||"Unknown"}</span></div>
      <div class="row"><span class="row-label">Device</span><span class="row-value">${r.adapterDevice||"Unknown"}</span></div>
      <div class="row"><span class="row-label">Fallback</span><span class="row-value">${r.isFallbackAdapter?"Yes (software)":"No (hardware)"}</span></div>
    `),r.adapterError&&(a+=`<div class="row"><span class="row-label">Adapter Error</span><span class="row-value" style="color:var(--red)">${r.adapterError}</span></div>`),r.deviceError&&(a+=`<div class="row"><span class="row-label">Device Error</span><span class="row-value" style="color:var(--red)">${r.deviceError}</span></div>`),a+="</div>",r.limits){const o=r.limits,s=i=>i>=1073741824?`${(i/1073741824).toFixed(1)} GB`:i>=1048576?`${(i/1048576).toFixed(1)} MB`:i>=1024?`${(i/1024).toFixed(1)} KB`:`${i} B`;a+=`
      <h3>GPU Limits</h3>
      <div class="card">
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${s(o.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${o.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${o.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${o.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${s(o.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${s(o.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${s(o.maxComputeWorkgroupStorageSize)}</span></div>
        <div class="row"><span class="row-label">Max invocations/wg</span><span class="row-value">${o.maxComputeInvocationsPerWorkgroup}</span></div>
        <div class="row"><span class="row-label">Max workgroup size</span><span class="row-value">${o.maxComputeWorkgroupSizeX}×${o.maxComputeWorkgroupSizeY}×${o.maxComputeWorkgroupSizeZ}</span></div>
        <div class="row"><span class="row-label">Max workgroups/dim</span><span class="row-value">${o.maxComputeWorkgroupsPerDimension}</span></div>
        <div class="row"><span class="row-label">Max color attachments</span><span class="row-value">${o.maxColorAttachments}</span></div>
        <div class="row"><span class="row-label">Storage buf alignment</span><span class="row-value">${o.minStorageBufferOffsetAlignment} B</span></div>
        <div class="row"><span class="row-label">Uniform buf alignment</span><span class="row-value">${o.minUniformBufferOffsetAlignment} B</span></div>
      </div>
    `}return r.features.length>0&&(a+=`
      <h3>Features (${r.features.length})</h3>
      <div class="card">
        ${r.features.map(o=>`<div class="row"><span class="row-value">${o}</span></div>`).join("")}
      </div>
    `),a+=`
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
  `,a}function ia(e){e.innerHTML=`
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;const t=e.querySelector("#wgdiag-result");ce=e.querySelector("#btn-copy-report"),e.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{t.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',ce.disabled=!0;const r=await bt();tt=Pr(r),t.innerHTML=sa(r),ce.disabled=!1}),ce.addEventListener("click",async()=>{if(tt)try{await navigator.clipboard.writeText(tt),ce.textContent="Copied!",setTimeout(()=>{ce.textContent="Copy Diagnostics"},2e3)}catch{const r=document.createElement("textarea");r.value=tt,document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),ce.textContent="Copied!",setTimeout(()=>{ce.textContent="Copy Diagnostics"},2e3)}}),e.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const ua=Object.freeze(Object.defineProperty({__proto__:null,render:ia},Symbol.toStringTag,{value:"Module"})),ca=typeof GPUShaderStage<"u"?GPUShaderStage.COMPUTE:4;function la(e,t=ca){return e.map((r,n)=>({binding:n,visibility:t,buffer:{type:r}}))}function Br(e,t){return e.createBindGroupLayout({entries:la(t)})}function da(e,t,r="bind group"){if(e.length!==t.length)throw new Error(`${r} binding count mismatch: pipeline layout declares ${e.length} bindings but ${t.length} entries were provided.`)}const dr=new WeakMap,kt=new WeakMap,Dt=new WeakMap,Tr=new WeakSet;let fa=1;function yt(e){let t=dr.get(e);return t===void 0&&(t=fa++,dr.set(e,t)),t}function pa(e,t){kt.set(e,yt(t))}function kr(e){return kt.has(e)?kt.get(e):null}function ma(e,t){Dt.set(e,yt(t))}function Dr(e){return Dt.has(e)?Dt.get(e):null}function ga(e){Tr.add(e)}function ba(e){return Tr.has(e)}let Ke=null,Me=null,ct=null,Ot=null;async function Ne(){if(Me&&!Ke&&(Me=null),Me)return Me;if(!navigator.gpu)throw new Error("WebGPU not supported");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.features.has("timestamp-query"),r=await e.requestDevice({requiredFeatures:t?["timestamp-query"]:[],requiredLimits:{}});ct=null,Ot=null,r.lost.then(s=>{console.error("Benchmark device lost:",s.reason,s.message),ga(r),ct=s.reason??"unknown",Ot=s.message??"",Ke=null,Me=null}),Ke=r;let n=null;try{n=navigator.gpu.getPreferredCanvasFormat()}catch{}const a=e.limits,o=[];for(const s of e.features)o.push(s);return Me={webgpuAvailable:!0,adapterName:e.name??"Unknown",adapterVendor:e.vendor??"Unknown",adapterDevice:e.device??"Unknown",adapterFeatures:o,adapterLimits:{maxBufferSize:a.maxBufferSize,maxTextureDimension1D:a.maxTextureDimension1D,maxTextureDimension2D:a.maxTextureDimension2D,maxTextureDimension3D:a.maxTextureDimension3D,maxComputeWorkgroupStorageSize:a.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:a.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:a.maxStorageBufferBindingSize,maxUniformBufferBindingSize:a.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:a.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:a.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:a.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:a.maxComputeWorkgroupsPerDimension,maxColorAttachments:a.maxColorAttachments,minStorageBufferOffsetAlignment:a.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:a.minUniformBufferOffsetAlignment},preferredCanvasFormat:n,maxBufferSize:a.maxBufferSize,maxStorageBufferBindingSize:a.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:a.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:a.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:a.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:a.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:a.maxComputeWorkgroupsPerDimension,timestampQuerySupport:t,isFallbackAdapter:e.isFallbackAdapter??!1},Me}function U(){if(!Ke)throw new Error("Benchmark not initialized. Call initBenchmark() first.");return Ke}function va(){return{reason:ct,message:Ot}}function he(){return ct!==null}async function Or(e,t,r){e.pushErrorScope("validation"),e.pushErrorScope("out-of-memory"),e.pushErrorScope("internal");try{const n=await r(),o=(await Promise.all([e.popErrorScope(),e.popErrorScope(),e.popErrorScope()])).find(s=>s!==null);return{result:n,error:o?o.message:null}}catch(n){return await e.popErrorScope(),await e.popErrorScope(),await e.popErrorScope(),{result:null,error:n.message}}}function F(e){const t=U(),r=t.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(r,0,e),r}function S(e,t){const r=U(),n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(t){const a=r.createBuffer({size:Math.max(e,t.byteLength),usage:n,mappedAtCreation:!0});return new Float32Array(a.getMappedRange()).set(t),a.unmap(),a}return r.createBuffer({size:e,usage:n})}function ya(e){return U().createBuffer({size:e,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})}async function D(e,t){const r=U(),n=ya(t),a=r.createCommandEncoder();a.copyBufferToBuffer(e,0,n,0,t),r.queue.submit([a.finish()]),await n.mapAsync(GPUMapMode.READ);const o=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),o}function z(e,t,r){const n=U();if(t.length===0)throw new Error("createPipeline: bindingTypes must be non-empty (uniform / read-only-storage / storage)");const a=Br(n,t),o=n.createShaderModule({code:e}),s=n.createComputePipeline({layout:n.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:o,entryPoint:"main"}});pa(s,n);const i=u=>r?.({bindingTypes:t,compilationMessages:u,pipelineLayoutInspected:!0});return typeof o.getCompilationInfo=="function"&&o.getCompilationInfo().then(u=>i(u.messages)).catch(()=>i([])),s}function R(e,t,r){const n=U();da(t,r,"createBindGroupForPipeline");const a=e.getBindGroupLayout(0),o=n.createBindGroup({layout:a,entries:r});return ma(o,n),o}const _e=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u.N) { return; }
  C[i] = A[i] + B[i];
}
`,Xe=`
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x;
  let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.K; k++) {
    sum += A[row * u.K + k] * B[k * u.N + col];
  }
  C[row * u.N + col] = sum;
}
`,Gr=`
struct Uniforms { N: u32, C: u32, H: u32, W: u32, F: u32, FH: u32, FW: u32, OH: u32, OW: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> kernel: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(1, 1, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let n = gid.x;
  let f = gid.y;
  let out_pos = gid.z;
  let oh = out_pos / u.OW;
  let ow = out_pos % u.OW;

  if (n >= u.N || f >= u.F || oh >= u.OH || ow >= u.OW) { return; }

  var sum: f32 = 0.0;
  for (var c = 0u; c < u.C; c++) {
    for (var fh = 0u; fh < u.FH; fh++) {
      for (var fw = 0u; fw < u.FW; fw++) {
        let ih = oh + fh;
        let iw = ow + fw;
        let in_idx = ((n * u.C + c) * u.H + ih) * u.W + iw;
        let k_idx = ((f * u.C + c) * u.FH + fh) * u.FW + fw;
        sum += input[in_idx] * kernel[k_idx];
      }
    }
  }
  let out_idx = ((n * u.F + f) * u.OH + oh) * u.OW + ow;
  output[out_idx] = sum;
}
`,Ft=`
struct Uniforms { rows: u32, cols: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x;
  if (row >= u.rows) { return; }
  let base = row * u.cols;
  var max_val: f32 = -1e30;
  for (var j: u32 = 0u; j < u.cols; j++) {
    if (input[base + j] > max_val) { max_val = input[base + j]; }
  }
  var sum_exp: f32 = 0.0;
  for (var j: u32 = 0u; j < u.cols; j++) {
    let e = exp(input[base + j] - max_val);
    output[base + j] = e;
    sum_exp += e;
  }
  for (var j: u32 = 0u; j < u.cols; j++) {
    output[base + j] /= sum_exp;
  }
}
`,Nr=`
struct Uniforms { N: u32, eps: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  var sum_sq: f32 = 0.0;
  for (var j: u32 = 0u; j < u.N; j++) {
    sum_sq += input[j] * input[j];
  }
  let rms = sqrt(sum_sq / f32(u.N) + u.eps);
  for (var j: u32 = 0u; j < u.N; j++) {
    output[j] = (input[j] / rms) * weight[j];
  }
}
`,_r=`
struct Uniforms { batch: u32, seq: u32, dim: u32, scale: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> Q: array<f32>;
@group(0) @binding(2) var<storage, read> K: array<f32>;
@group(0) @binding(3) var<storage, read> V: array<f32>;
@group(0) @binding(4) var<storage, read_write> out: array<f32>;
@group(0) @binding(5) var<storage, read_write> scores: array<f32>;

@compute @workgroup_size(16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let b = gid.x;
  if (b >= u.batch) { return; }

  for (var i = 0u; i < u.seq; i++) {
    var max_val: f32 = -1e30;
    for (var j = 0u; j < u.seq; j++) {
      var dot: f32 = 0.0;
      for (var d = 0u; d < u.dim; d++) {
        dot += Q[(b * u.seq + i) * u.dim + d] * K[(b * u.seq + j) * u.dim + d];
      }
      let s = dot * u.scale;
      scores[b * u.seq * u.seq + i * u.seq + j] = s;
      if (s > max_val) { max_val = s; }
    }

    var sum_exp: f32 = 0.0;
    for (var j = 0u; j < u.seq; j++) {
      let idx = b * u.seq * u.seq + i * u.seq + j;
      let e = exp(scores[idx] - max_val);
      scores[idx] = e;
      sum_exp += e;
    }
    for (var j = 0u; j < u.seq; j++) {
      scores[b * u.seq * u.seq + i * u.seq + j] /= sum_exp;
    }

    for (var d = 0u; d < u.dim; d++) {
      var sum: f32 = 0.0;
      for (var j = 0u; j < u.seq; j++) {
        sum += scores[b * u.seq * u.seq + i * u.seq + j] * V[(b * u.seq + j) * u.dim + d];
      }
      out[(b * u.seq + i) * u.dim + d] = sum;
    }
  }
}
`,ha=["uniform","read-only-storage","read-only-storage","storage"],lt=["uniform","read-only-storage","read-only-storage","storage"],wa=["uniform","read-only-storage","read-only-storage","storage"],xa=["uniform","read-only-storage","storage"],Sa=["uniform","read-only-storage","read-only-storage","storage"],Ma=["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"];function Ea(e,t){try{return e.pushErrorScope(t),!0}catch{return!1}}async function St(e,t){let r=null;for(let n=0;n<t;n++)try{const a=await e.popErrorScope();a&&!r&&(r=a)}catch{}return r}function Pa(e,t){let r;const n=new Promise((a,o)=>{r=window.setTimeout(()=>o(new Error(`GPU operation timed out after ${t}ms`)),t)});return Promise.race([e,n]).finally(()=>{r!==void 0&&window.clearTimeout(r)})}async function Aa(e,t){const r=yt(e),n=kr(t.pipeline),a=Dr(t.bindGroup);if(ba(e))return{pass:!1,error:"DEVICE LOST — refusing to execute a pipeline on a lost device.",stage:"encode",errorType:"device-lost",mismatch:!1,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a};if(n!==null&&n!==r)return{pass:!1,error:`PIPELINE DEVICE MISMATCH — pipeline device: ${n}, execution device: ${r}. The pipeline was created by a different GPUDevice; refusing to call setPipeline().`,stage:"set-pipeline",errorType:"device-mismatch",mismatch:!0,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a};const o=["validation","out-of-memory","internal"];let s=0;for(const u of o)Ea(e,u)&&s++;let i="encode";try{const u=e.createBuffer({size:t.outputBytes,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});i="encode";const l=e.createCommandEncoder(),c=l.beginComputePass();if(i="set-pipeline",c.setPipeline(t.pipeline),a!==null&&a!==r)return await St(e,s),{pass:!1,error:`BIND GROUP DEVICE MISMATCH — bind group device: ${a}, execution device: ${r}. The bind group was created by a different GPUDevice; refusing to call setBindGroup().`,stage:"set-bind-group",errorType:"device-mismatch",mismatch:!0,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a};a===null&&console.warn(`[gpu-test] ${t.name}: bind group identity unavailable — continuing (not fabricated).`),i="set-bind-group",c.setBindGroup(0,t.bindGroup),i="dispatch",c.dispatchWorkgroups(...t.workgroups),c.end(),i="submit",l.copyBufferToBuffer(t.outputBuffer,0,u,0,t.outputBytes),e.queue.submit([l.finish()]),i="readback",await Pa(u.mapAsync(GPUMapMode.READ),15e3);const d=new Float32Array(u.getMappedRange().slice(0));u.unmap(),u.destroy();const p=await St(e,s);if(p)return{pass:!1,error:`GPU Error: ${p.message}`,stage:"submit",errorType:p.type??null,mismatch:!1,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a};i="validation";const f=t.validator(d);return{pass:f.pass,error:f.pass?null:f.error,stage:f.pass?"complete":"validation",errorType:f.pass?null:"output-mismatch",mismatch:!1,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a}}catch(u){return await St(e,s),{pass:!1,error:u.message,stage:i,errorType:"exception",mismatch:!1,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a}}}function Rr(e,t){const r=new Float32Array(e.length);for(let n=0;n<e.length;n++)r[n]=e[n]+t[n];return r}function Fr(e,t,r,n,a){const o=new Float32Array(r*n);for(let s=0;s<r;s++)for(let i=0;i<n;i++){let u=0;for(let l=0;l<a;l++)u+=e[s*a+l]*t[l*n+i];o[s*n+i]=u}return o}function Lr(e,t,r,n,a,o,s,i,u){const l=a-i+1,c=o-u+1,d=new Float32Array(r*s*l*c);for(let p=0;p<r;p++)for(let f=0;f<s;f++)for(let m=0;m<l;m++)for(let b=0;b<c;b++){let g=0;for(let v=0;v<n;v++)for(let y=0;y<i;y++)for(let w=0;w<u;w++)g+=e[((p*n+v)*a+m+y)*o+b+w]*t[((f*n+v)*i+y)*u+w];d[((p*s+f)*l+m)*c+b]=g}return d}function Lt(e,t,r){const n=new Float32Array(e.length);for(let a=0;a<t;a++){const o=a*r;let s=-1e30;for(let u=0;u<r;u++)e[o+u]>s&&(s=e[o+u]);let i=0;for(let u=0;u<r;u++){const l=Math.exp(e[o+u]-s);n[o+u]=l,i+=l}for(let u=0;u<r;u++)n[o+u]/=i}return n}function Ir(e,t,r){const n=e.length;let a=0;for(let i=0;i<n;i++)a+=e[i]*e[i];const o=Math.sqrt(a/n+r),s=new Float32Array(n);for(let i=0;i<n;i++)s[i]=e[i]/o*t[i];return s}function zr(e,t,r,n,a,o,s){const i=new Float32Array(n*a*o);for(let u=0;u<n;u++)for(let l=0;l<a;l++){const c=[];let d=-1e30;for(let m=0;m<a;m++){let b=0;for(let v=0;v<o;v++)b+=e[(u*a+l)*o+v]*t[(u*a+m)*o+v];const g=b*s;c.push(g),g>d&&(d=g)}let p=0;const f=c.map(m=>{const b=Math.exp(m-d);return p+=b,b});for(let m=0;m<a;m++){const b=f[m]/p;for(let g=0;g<o;g++)i[(u*a+l)*o+g]+=b*r[(u*a+m)*o+g]}}return i}function $a(e,t,r){const n=e.length!==t.length,a=Math.min(e.length,t.length);let o=!0,s=-1,i=0,u=-1,l=null,c=null,d=1/0,p=-1/0,f=1/0,m=-1/0;for(let g=0;g<a;g++){const v=e[g],y=t[g];if(!Number.isFinite(v)){o=!1,s<0&&(s=g);continue}y<d&&(d=y),y>p&&(p=y),v<f&&(f=v),v>m&&(m=v);const w=Math.abs(v-y);w>i&&(i=w,u=g,l=y,c=v)}if(o){for(let g=a;g<e.length;g++)if(!Number.isFinite(e[g])){o=!1,s=g;break}}const b=!n&&o&&u>=0&&i<=r;return{maxError:i,errorIndex:u,cpuValue:l,gpuValue:c,expectedRange:d===1/0||p===-1/0?null:[d,p],actualRange:f===1/0||m===-1/0?null:[f,m],nonFiniteIndex:s,allFinite:o,lengthMismatch:n,pass:b}}function Ca(e,t,r){const n=new Float32Array(t);for(let a=0;a<t;a++){let o=0;for(let s=0;s<r;s++)o+=e[a*r+s];n[a]=o}return n}const Gt=[];let fr=!1;function Wr(){if(!fr)try{U().addEventListener("uncapturederror",t=>{const r=t.error;r&&Gt.push(r.message)}),fr=!0}catch{}}function qr(){const e=Gt.slice();return Gt.length=0,e}function J(e){return S(e.byteLength,e)}function pr(e,t,r,n){return{config:e,pass:!1,stage:t,errorType:r,errorMessage:n,maxError:-1,errorIndex:-1,cpuValue:null,gpuValue:null,expectedRange:null,actualRange:null,nonFiniteIndex:-1}}async function We(e){const t=U();let r=null,n="pipeline",a=null,o=null;try{n="pipeline";const s=z(e.code,e.bindingTypes);n="bind-group";const i=R(s,e.bindingTypes,e.entries),u=await Aa(t,{name:e.name,pipeline:s,bindGroup:i,workgroups:e.workgroups,outputBuffer:e.outputBuffer,outputBytes:e.outputBytes,validator:p=>(r=p,{pass:!0,error:""})});if(n=u.stage,!u.pass)return{...pr(e.config,n,u.errorType??"gpu-error",u.error??"GPU execution failed"),pipelineDeviceId:u.pipelineDeviceId,executionDeviceId:u.executionDeviceId,bindGroupDeviceId:u.bindGroupDeviceId,mismatch:u.mismatch};if(r===null)throw new Error("GPU returned no data after readback");n="validation";const l=$a(r,e.reference,e.tolerance),c=e.extraCheck?e.extraCheck(r):null,d=l.pass&&c===null;return d||(l.allFinite?l.lengthMismatch?(a="shape-mismatch",o=`GPU length ${r.length} != CPU reference length ${e.reference.length}`):l.pass?(a="constraint",o=c??"output constraint violated"):(a="output-mismatch",o=`max abs error ${l.maxError.toExponential(3)} at index ${l.errorIndex} (cpu ${l.cpuValue?.toExponential(4)??"n/a"}, gpu ${l.gpuValue?.toExponential(4)??"n/a"})`):(a="non-finite",o=`non-finite output at index ${l.nonFiniteIndex}`)),{config:e.config,pass:d,stage:d?"complete":"validation",errorType:d?null:a,errorMessage:d?null:o,maxError:l.maxError,errorIndex:l.errorIndex,cpuValue:l.cpuValue,gpuValue:l.gpuValue,expectedRange:l.expectedRange,actualRange:l.actualRange,nonFiniteIndex:l.nonFiniteIndex,pipelineDeviceId:u.pipelineDeviceId,executionDeviceId:u.executionDeviceId,bindGroupDeviceId:u.bindGroupDeviceId,mismatch:u.mismatch}}catch(s){return pr(e.config,n,a??"exception",o??s.message)}finally{try{e.dispose()}catch{}}}function qe(e,t){const r=t.length>0&&t.every(o=>o.pass),n=t.reduce((o,s)=>Math.max(o,s.maxError),0),a=t.map(o=>`${o.config}:${o.pass?"PASS":"FAIL"}`).join(" ");return{name:e,pass:r,maxError:r?n:-1,details:a,cases:t}}async function Ua(e){const t=new Float32Array(e).fill(1),r=new Float32Array(e).fill(2),n=J(t),a=J(r),o=S(e*4),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e;const i=F(s);return We({name:"VecAdd",config:`N=${e}`,code:_e,bindingTypes:ha,workgroups:[Math.ceil(e/64),1,1],entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:o}}],outputBuffer:o,outputBytes:e*4,reference:Rr(t,r),tolerance:1e-5,dispose:()=>{n.destroy(),a.destroy(),o.destroy(),i.destroy()}})}async function Ba(){const e=[];for(const t of[64,1024,65536])if(e.push(await Ua(t)),!e[e.length-1].pass)break;return qe("VecAdd",e)}async function Ta(e){const t=new Float32Array(e*e).fill(1),r=new Float32Array(e*e).fill(.5),n=J(t),a=J(r),o=S(e*e*4),s=new ArrayBuffer(12),i=new Uint32Array(s);i[0]=e,i[1]=e,i[2]=e;const u=F(s);return We({name:"Matmul",config:`${e}×${e}`,code:Xe,bindingTypes:lt,workgroups:[Math.ceil(e/16),Math.ceil(e/16),1],entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:o}}],outputBuffer:o,outputBytes:e*e*4,reference:Fr(t,r,e,e,e),tolerance:.001,dispose:()=>{n.destroy(),a.destroy(),o.destroy(),u.destroy()}})}async function Hr(){const e=[];for(const t of[32,64,128])if(e.push(await Ta(t)),!e[e.length-1].pass)break;return qe("Matmul",e)}function ka(e){if(e===1){const v=new Float32Array(25);for(let w=0;w<v.length;w++)v[w]=w+1;const y=new Float32Array([1,0,-1,1,0,-1,1,0,-1]);return{config:"5×5→3×3",N:1,C:1,H:5,W:5,F:1,FH:3,FW:3,input:v,kernel:y}}const t=1,r=2,n=3,a=3,o=1,s=2,i=2,u=new Float32Array(t*r*n*a);for(let c=0;c<u.length;c++)u[c]=c+1;const l=new Float32Array(o*r*s*i).fill(1);return{config:"C=2 (channel indexing)",N:t,C:r,H:n,W:a,F:o,FH:s,FW:i,input:u,kernel:l}}async function Da(e){const t=ka(e),{N:r,C:n,H:a,W:o,F:s,FH:i,FW:u}=t,l=a-i+1,c=o-u+1,d=r*s*l*c*4,p=J(t.input),f=J(t.kernel),m=S(d),b=new ArrayBuffer(9*4),g=new Uint32Array(b);g[0]=r,g[1]=n,g[2]=a,g[3]=o,g[4]=s,g[5]=i,g[6]=u,g[7]=l,g[8]=c;const v=F(b);return We({name:"Conv2D",config:t.config,code:Gr,bindingTypes:wa,workgroups:[r,s,l*c],entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:m}}],outputBuffer:m,outputBytes:d,reference:Lr(t.input,t.kernel,r,n,a,o,s,i,u),tolerance:1e-4,dispose:()=>{p.destroy(),f.destroy(),m.destroy(),v.destroy()}})}async function Oa(){const e=[];for(const t of[1,2])if(e.push(await Da(t)),!e[e.length-1].pass)break;return qe("Conv2D",e)}function Ga(e){if(e===1)return{rows:2,cols:5,data:new Float32Array([-2,-1,0,1,2,2,1,0,-1,-2])};const t=4,r=16,n=new Float32Array(t*r);for(let a=0;a<n.length;a++)n[a]=a%r*.1-1;return{rows:t,cols:r,data:n}}async function Na(e){const t=Ga(e),r=t.rows,n=t.cols,a=t.data.byteLength,o=S(a,t.data),s=S(a),i=new ArrayBuffer(8);new Uint32Array(i)[0]=r,new Uint32Array(i)[1]=n;const u=F(i);return We({name:"Softmax",config:`${r}×${n}`,code:Ft,bindingTypes:xa,workgroups:[r,1,1],entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}}],outputBuffer:s,outputBytes:a,reference:Lt(t.data,r,n),tolerance:1e-4,extraCheck:l=>{for(let d=0;d<l.length;d++)if(l[d]<-1e-6)return`negative softmax output ${l[d].toExponential(3)} at index ${d}`;const c=Ca(l,r,n);for(let d=0;d<r;d++)if(Math.abs(c[d]-1)>1e-4)return`row ${d} sums to ${c[d].toExponential(3)} (expected ≈ 1)`;return null},dispose:()=>{o.destroy(),s.destroy(),u.destroy()}})}async function _a(){const e=[];for(const t of[1,2])if(e.push(await Na(t)),!e[e.length-1].pass)break;return qe("Softmax",e)}function Ra(e){if(e===1)return{N:8,input:new Float32Array([1,2,3,4,5,6,7,8]),weight:new Float32Array(8).fill(1),eps:1e-6};const t=128,r=new Float32Array(t);for(let n=0;n<t;n++)r[n]=n*37%11*.5+.1;return{N:t,input:r,weight:new Float32Array(t).fill(1),eps:1e-6}}async function Fa(e){const t=Ra(e),r=t.N,n=J(t.input),a=J(t.weight),o=S(r*4),s=new ArrayBuffer(8);new Uint32Array(s)[0]=r,new Float32Array(s)[1]=t.eps;const i=F(s);return We({name:"RMSNorm",config:`N=${r}`,code:Nr,bindingTypes:Sa,workgroups:[1,1,1],entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:o}}],outputBuffer:o,outputBytes:r*4,reference:Ir(t.input,t.weight,t.eps),tolerance:.001,dispose:()=>{n.destroy(),a.destroy(),o.destroy(),i.destroy()}})}async function La(){const e=[];for(const t of[1,2])if(e.push(await Fa(t)),!e[e.length-1].pass)break;return qe("RMSNorm",e)}function Ia(e){const r=e===1?4:8,n=r,a=1/Math.sqrt(n),o=()=>{const s=new Float32Array(1*r*n);for(let i=0;i<s.length;i++)s[i]=(i%n+1)*.1;return s};return{batch:1,seq:r,dim:n,scale:a,Q:o(),K:o(),V:o()}}async function za(e){const t=Ia(e),{batch:r,seq:n,dim:a,scale:o}=t,s=r*n*a,i=r*n*n,u=J(t.Q),l=J(t.K),c=J(t.V),d=S(s*4),p=S(i*4),f=new ArrayBuffer(16),m=new Uint32Array(f),b=new Float32Array(f);m[0]=r,m[1]=n,m[2]=a,b[3]=o;const g=F(f);return We({name:"Attention",config:`b${r}-s${n}-d${a}`,code:_r,bindingTypes:Ma,workgroups:[r,1,1],entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}},{binding:4,resource:{buffer:d}},{binding:5,resource:{buffer:p}}],outputBuffer:d,outputBytes:s*4,reference:zr(t.Q,t.K,t.V,r,n,a,o),tolerance:.001,dispose:()=>{u.destroy(),l.destroy(),c.destroy(),d.destroy(),p.destroy(),g.destroy()}})}async function Wa(){const e=[];for(const t of[1,2])if(e.push(await za(t)),!e[e.length-1].pass)break;return qe("Attention",e)}async function qa(e){Wr();const t=[{key:"vectorAdd",name:"VecAdd",fn:Ba},{key:"matmul",name:"Matmul",fn:Hr},{key:"conv2d",name:"Conv2D",fn:Oa},{key:"softmax",name:"Softmax",fn:_a},{key:"rmsNorm",name:"RMSNorm",fn:La},{key:"attention",name:"Attention",fn:Wa}],r=[];for(const n of t){if(he()){r.push({name:n.name,pass:!1,maxError:-1,details:"ABORTED — device lost",cases:[]});break}const a=await n.fn();if(r.push(a),e?.(a),he())break}return r}const Ha=["validation","out-of-memory","internal"];function jr(e){try{if(typeof GPUOutOfMemoryError<"u"&&e instanceof GPUOutOfMemoryError)return"out-of-memory";if(typeof GPUInternalError<"u"&&e instanceof GPUInternalError)return"internal";if(typeof GPUValidationError<"u"&&e instanceof GPUValidationError)return"validation"}catch{}const t=e;return typeof t.name=="string"&&t.name?t.name:"validation"}async function Vr(){if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=await e.requestDevice(),r=[],n={reason:null,message:null};return t.addEventListener("uncapturederror",a=>{const o=a.error;r.push({type:jr(o),message:o.message})}),t.lost.then(a=>{n.reason=a.reason??"unknown",n.message=a.message??""}),{device:t,uncaptured:r,lost:n}}function Kr(e){let t=0;for(const r of Ha)try{e.pushErrorScope(r),t++}catch{}return t}async function dt(e,t){const r=[];for(let n=0;n<t;n++)try{const a=await e.popErrorScope();a&&r.push({type:jr(a),message:a.message})}catch{}return r}async function Yr(e,t){try{return{ok:!0,value:await t()}}catch(r){return{ok:!1,stage:e,error:r instanceof Error?r.message:String(r)}}}const ja=`
@group(0) @binding(0) var<storage, read> a: array<f32>;
@group(0) @binding(1) var<storage, read> b: array<f32>;
@group(0) @binding(2) var<storage, read_write> c: array<f32>;

@compute @workgroup_size(4)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i < 4u) {
    c[i] = a[i] + b[i];
  }
}
`,Mt=[6,8,10,12];async function Va(){const e={name:"GPU Sanity",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"[6, 8, 10, 12]",actual:null,exception:null};let t=null,r=0,n=!1,a=null;const o=await Yr("request-device",()=>Vr());if(!o.ok)return e.stage=o.stage,e.errorType="exception",e.errorMessage=o.error,e;t=o.value,e.stage="request-device";try{if(t.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;r=Kr(t.device);const u=new Float32Array([1,2,3,4]),l=new Float32Array([5,6,7,8]),c=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const d=t.device.createBuffer({size:16,usage:c,mappedAtCreation:!0});new Float32Array(d.getMappedRange()).set(u),d.unmap();const p=t.device.createBuffer({size:16,usage:c,mappedAtCreation:!0});new Float32Array(p.getMappedRange()).set(l),p.unmap();const f=t.device.createBuffer({size:16,usage:c}),m=t.device.createBuffer({size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});e.stage="create-pipeline";const b=t.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),g=t.device.createComputePipeline({layout:t.device.createPipelineLayout({bindGroupLayouts:[b]}),compute:{module:t.device.createShaderModule({code:ja}),entryPoint:"main"}});e.stage="create-bind-group";const v=t.device.createBindGroup({layout:b,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}}]});e.stage="encode-submit";const y=t.device.createCommandEncoder(),w=y.beginComputePass();w.setPipeline(g),w.setBindGroup(0,v),w.dispatchWorkgroups(1,1,1),w.end(),y.copyBufferToBuffer(f,0,m,0,16),t.device.queue.submit([y.finish()]),e.stage="readback",await m.mapAsync(GPUMapMode.READ);const $=new Float32Array(m.getMappedRange().slice(0));m.unmap(),m.destroy(),e.stage="validate-output",e.scopeErrors=await dt(t.device,r),n=!0,a=Array.from($),e.actual=a.join(", "),d.destroy(),p.destroy(),f.destroy()}catch(u){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=u instanceof Error?u.message:String(u)}finally{if(t&&r>0&&!n)try{e.scopeErrors=await dt(t.device,r)}catch{}}if(e.uncaptured=t.uncaptured,t.lost.reason&&!e.scopeErrors.length&&!e.errorMessage)return e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;if(e.scopeErrors.length>0)return e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e;if(e.uncaptured.length>0)return e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e;if(e.errorMessage)return e.pass=!1,e;const s=a??[],i=s.length===Mt.length&&Mt.every((u,l)=>Math.abs(s[l]-u)<1e-6);return e.pass=i,i||(e.errorType="output-mismatch",e.errorMessage=`expected [${Mt.join(", ")}], got ${e.actual}`),e}async function Ka(){const e={name:"Standalone MatMul 64×64",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"all elements = 32.0",actual:null,exception:null};let t=null,r=0,n=!1,a=null;const o=await Yr("request-device",()=>Vr());if(!o.ok)return e.stage=o.stage,e.errorType="exception",e.errorMessage=o.error,e;t=o.value,e.stage="request-device";try{if(t.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;r=Kr(t.device);const s=64,i=64,u=s*s,l=new Float32Array(u).fill(1),c=new Float32Array(u).fill(.5),d=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const p=t.device.createBuffer({size:l.byteLength,usage:d,mappedAtCreation:!0});new Float32Array(p.getMappedRange()).set(l),p.unmap();const f=t.device.createBuffer({size:c.byteLength,usage:d,mappedAtCreation:!0});new Float32Array(f.getMappedRange()).set(c),f.unmap();const m=t.device.createBuffer({size:u*4,usage:d}),b=t.device.createBuffer({size:u*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),g=new ArrayBuffer(16),v=new Uint32Array(g);v[0]=s,v[1]=s,v[2]=i;const y=t.device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.device.queue.writeBuffer(y,0,g),e.stage="create-pipeline";const w=Br(t.device,lt),$=t.device.createComputePipeline({layout:t.device.createPipelineLayout({bindGroupLayouts:[w]}),compute:{module:t.device.createShaderModule({code:Xe}),entryPoint:"main"}});e.stage="create-bind-group";const x=t.device.createBindGroup({layout:w,entries:[{binding:0,resource:{buffer:y}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:m}}]});e.stage="encode-submit";const k=t.device.createCommandEncoder(),_=k.beginComputePass();_.setPipeline($),_.setBindGroup(0,x),_.dispatchWorkgroups(4,4,1),_.end(),k.copyBufferToBuffer(m,0,b,0,u*4),t.device.queue.submit([k.finish()]),e.stage="readback",await b.mapAsync(GPUMapMode.READ);const q=new Float32Array(b.getMappedRange().slice(0));b.unmap(),b.destroy(),e.stage="validate-output",e.scopeErrors=await dt(t.device,r),n=!0,a=0;for(let L=0;L<u;L++)a=Math.max(a,Math.abs(q[L]-32));e.actual=`max err = ${a.toExponential(2)}`,p.destroy(),f.destroy(),m.destroy(),y.destroy()}catch(s){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=s instanceof Error?s.message:String(s)}finally{if(t&&r>0&&!n)try{e.scopeErrors=await dt(t.device,r)}catch{}}return e.uncaptured=t.uncaptured,t.lost.reason&&!e.scopeErrors.length&&!e.errorMessage?(e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e):e.scopeErrors.length>0?(e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e):e.uncaptured.length>0?(e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e):e.errorMessage?(e.pass=!1,e):(e.pass=a!==null&&a<.001,e.pass||(e.errorType="output-mismatch",e.errorMessage=`expected all elements = 32.0, got ${e.actual}`),e)}async function Ya(){const e=U(),t=yt(e),r={name:"Shared-Device Direct MatMul 64×64",pass:!1,stage:"request-device",errorType:null,errorMessage:null,maxError:null,executionDeviceId:t,pipelineDeviceId:null,bindGroupDeviceId:null,mismatch:!1},n=64,a=n*n,o=new Float32Array(a).fill(1),s=new Float32Array(a).fill(.5),i=32;try{const{error:u}=await Or(e,"shared-device-direct-matmul",async()=>{r.stage="create-buffers";const l=S(o.byteLength,o),c=S(s.byteLength,s),d=S(a*4);r.stage="create-uniform";const p=new ArrayBuffer(16),f=new Uint32Array(p);f[0]=n,f[1]=n,f[2]=n;const m=F(p);r.stage="create-pipeline";const b=z(Xe,lt);r.pipelineDeviceId=kr(b)??t,r.stage="create-bind-group";const g=R(b,lt,[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:d}}]);if(r.bindGroupDeviceId=Dr(g),r.pipelineDeviceId!==null&&r.pipelineDeviceId!==t)throw r.mismatch=!0,new Error(`PIPELINE DEVICE MISMATCH — pipeline device: ${r.pipelineDeviceId}, execution device: ${t}`);r.stage="encode";const v=e.createCommandEncoder(),y=v.beginComputePass();r.stage="set-pipeline",y.setPipeline(b),r.stage="set-bind-group",y.setBindGroup(0,g),r.stage="dispatch",y.dispatchWorkgroups(4,4,1),y.end();const w=e.createBuffer({size:a*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});r.stage="submit",v.copyBufferToBuffer(d,0,w,0,a*4),e.queue.submit([v.finish()]),r.stage="readback",await w.mapAsync(GPUMapMode.READ);const $=new Float32Array(w.getMappedRange().slice(0));w.unmap(),w.destroy(),r.stage="validation";let x=0;for(let k=0;k<a;k++)x=Math.max(x,Math.abs($[k]-i));return r.maxError=x,m.destroy(),l.destroy(),c.destroy(),d.destroy(),!0});if(u)return r.pass=!1,r.errorMessage||(r.stage=r.stage||"gpu",r.errorType="gpu-error",r.errorMessage=u),r}catch(u){return r.pass=!1,r.stage=r.stage||"unknown",r.errorType="exception",r.errorMessage=r.errorMessage??(u instanceof Error?u.message:String(u)),r}return r.pass=r.maxError!==null&&r.maxError<.001,r.pass||(r.stage="validation",r.errorType="output-mismatch",r.errorMessage=`expected all elements = ${i}, got max err = ${r.maxError?.toExponential(2)}`),r}function Qr(...e){for(const t of e)if(t)return t}const st=Qr("0b3b5b305a61421a099974e7b3a545b3e389bd8f"),Xr=Qr("2026-09-07T07:15:36.866Z"),Re=st??Xr??`dev-${Date.now().toString(36)}`,ft=st&&/^[0-9a-f]{40}$/.test(st)?st:null,Ye=Xr??"";function Qa(e,t,r,n,a){const o=e.length,s=[...e].sort((c,d)=>c-d),i=o>0?e.reduce((c,d)=>c+d,0)/o:0,u=o>0?s[Math.floor(o/2)]:0,l=o>0?e.reduce((c,d)=>c+(d-i)*(d-i),0)/o:0;return{mode:t,iterations:o,warmup:n,avgMs:i,medianMs:u,minMs:o>0?s[0]:0,maxMs:o>0?s[o-1]:0,stdDevMs:Math.sqrt(l),samplesMs:s,note:a}}class Xa{device;_mode;_querySet=null;_resolve=null;_periodNs=1;_fallbackLogged=null;constructor(t){this.device=t;const r=this.tryEnableTimestamps(t);this._mode=r?"GPU_TIMESTAMP":"END_TO_END"}tryEnableTimestamps(t){try{if(!t.features||typeof t.features.has!="function"||!t.features.has("timestamp-query"))return!1;const r=t.createQuerySet({type:"timestamp",count:2}),n=t.createBuffer({size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),a=t.createCommandEncoder();a.beginComputePass({timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}).end(),a.finish(),this._querySet=r,this._resolve=n;const s=t.limits.timestampPeriod;return this._periodNs=typeof s=="number"&&s>0?s:1,!0}catch{return this._querySet?.destroy?.(),this._resolve?.destroy?.(),this._querySet=null,this._resolve=null,!1}}get mode(){return this._mode}get fallbackNote(){return this._fallbackLogged}async measure(t,r){const n=r.warmup??3;for(let o=0;o<n;o++)this.dispatchPass(t),await this.sync();const a=[];for(let o=0;o<r.iterations;o++){let s;if(this._mode==="GPU_TIMESTAMP"){const i=await this.measureTimestampPass(t);i===null?(this.fallback("timestamp query returned zero/undefined values — switched to END_TO_END"),s=await this.measureEndToEnd(t,r.wait)):s=i}else s=await this.measureEndToEnd(t,r.wait);a.push(s)}return Qa(a,this._mode,r.iterations,n,this._fallbackLogged??void 0)}dispatchPass(t,r){const n=this.device.createCommandEncoder(),a=n.beginComputePass(r?{timestampWrites:r}:void 0);return t(a),a.end(),n}async timeOne(t,r){if(this._mode==="GPU_TIMESTAMP"){const n=await this.measureTimestampPass(t);if(n!==null)return n;this.fallback("timestamp query returned zero/undefined values — switched to END_TO_END")}return this.measureEndToEnd(t,r)}async measureTimestampPass(t){if(!this._querySet||!this._resolve)return null;try{const r=this.dispatchPass(t,{querySet:this._querySet,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1});r.resolveQuerySet(this._querySet,0,2,this._resolve,0),this.device.queue.submit([r.finish()]);const n=this.device.createBuffer({size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),a=this.device.createCommandEncoder();a.copyBufferToBuffer(this._resolve,0,n,0,16),this.device.queue.submit([a.finish()]),await n.mapAsync(GPUMapMode.READ);const o=new BigUint64Array(n.getMappedRange()),s=Number(o[1]-o[0]);return n.unmap(),n.destroy(),s>0?s*this._periodNs/1e6:null}catch{return null}}async measureEndToEnd(t,r){const n=performance.now(),a=this.dispatchPass(t);return this.device.queue.submit([a.finish()]),r?await r():await this.sync(),performance.now()-n}async sync(){try{await this.device.queue.onSubmittedWorkDone()}catch{await new Promise(t=>setTimeout(t,16))}}fallback(t){this._fallbackLogged||(this._fallbackLogged=t),this._mode="END_TO_END";try{this._querySet?.destroy(),this._resolve?.destroy()}catch{}this._querySet=null,this._resolve=null}destroy(){try{this._querySet?.destroy(),this._resolve?.destroy()}catch{}this._querySet=null,this._resolve=null}}const mr=["uniform","read-only-storage","read-only-storage","storage"],gr=["uniform","read-only-storage","read-only-storage","storage"],Za=`
struct Uniforms { batch: u32, seq: u32, dim: u32, scale: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> Q: array<f32>;
@group(0) @binding(2) var<storage, read> K: array<f32>;
@group(0) @binding(3) var<storage, read_write> scores: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  let b = gid.y;
  if (i >= u.seq || b >= u.batch) { return; }
  for (var j: u32 = 0u; j < u.seq; j++) {
    var dot: f32 = 0.0;
    for (var d: u32 = 0u; d < u.dim; d++) {
      dot += Q[(b * u.seq + i) * u.dim + d] * K[(b * u.seq + j) * u.dim + d];
    }
    scores[b * u.seq * u.seq + i * u.seq + j] = dot * u.scale;
  }
}
`,Ja=`
struct Uniforms { batch: u32, seq: u32, dim: u32, scale: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> scores: array<f32>;
@group(0) @binding(2) var<storage, read> V: array<f32>;
@group(0) @binding(3) var<storage, read_write> out: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  let d = gid.y;
  let b = gid.z;
  if (i >= u.seq || d >= u.dim || b >= u.batch) { return; }
  var sum: f32 = 0.0;
  for (var j: u32 = 0u; j < u.seq; j++) {
    sum += scores[b * u.seq * u.seq + i * u.seq + j] * V[(b * u.seq + j) * u.dim + d];
  }
  out[(b * u.seq + i) * u.dim + d] = sum;
}
`;function pt(e,t){return{value:e/(t/1e3)/1e9,unit:"GFLOPS"}}function eo(e,t){return{value:e/(t/1e3)/1e9,unit:"GB/s (estimate)"}}function It(e){for(let t=0;t<e.length;t++)if(!Number.isFinite(e[t]))return!1;return!0}function de(e,t){let r=0;const n=Math.min(e.length,t.length);for(let a=0;a<n;a++)r=Math.max(r,Math.abs(e[a]-t[a]));return r}function ye(e,t,r,n){return new Error(`${e} ${t}: ${r} (${n}) — fix correctness before benchmarking`)}function He(e,t,r,n,a){if(!It(r))throw ye(e,t,"non-finite output","");if(r.length!==n.length)throw ye(e,t,"length mismatch",`${r.length} vs ${n.length}`);const o=de(r,n);if(o>Math.max(a,de(n,new Float32Array(n.length))*.01))throw ye(e,t,`correctness check failed (maxErr=${o.toExponential(2)})`,"")}async function H(e,t,r,n,a){const o=U(),s=o.createCommandEncoder(),i=s.beginComputePass();i.setPipeline(e),i.setBindGroup(0,t),i.dispatchWorkgroups(r[0],r[1],r[2]),i.end(),o.queue.submit([s.finish()]),await D(n,a)}function se(e,t){return()=>D(e,t).then(()=>{})}function ee(e){let t=2654435769;for(let r=0;r<e.length;r++)t=t*1664525+1013904223>>>0,e[r]=t%2001/1e3-1}function ie(e,t,r,n,a,o){return{id:e,name:t,size:r,timingMode:n.mode,iterations:n.iterations,warmup:n.warmup,medianMs:n.medianMs,averageMs:n.avgMs,minMs:n.minMs,maxMs:n.maxMs,stdDevMs:n.stdDevMs,throughput:a,note:o}}const to=[{size:128,iterations:12,validate:!0},{size:256,iterations:12,validate:!0},{size:512,iterations:10,validate:!1},{size:1024,iterations:10,validate:!1}];async function ro(e,t){const r=[];for(const n of to){const a=n.size;if(t&&!t.has(`matmul-${a}`))continue;const o=a*a*4,s=new Float32Array(a*a),i=new Float32Array(a*a);ee(s),ee(i);const u=S(o,s),l=S(o,i),c=S(o),d=F(new Float32Array([a,a,a,1]).buffer),p=z(Xe,["uniform","read-only-storage","read-only-storage","storage"]),f=R(p,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]),m=[a/16,a/16,1];await H(p,f,m,c,o);const b=await D(c,o);if(n.validate){const v=Fr(s,i,a,a,a);He("matmul",`${a}×${a}`,b,v,.01)}else if(!It(b))throw ye("matmul",`${a}×${a}`,"non-finite output","");const g=await e.measure(v=>{v.setPipeline(p),v.setBindGroup(0,f),v.dispatchWorkgroups(m[0],m[1],m[2])},{iterations:n.iterations,wait:se(c,o)});r.push(ie(`matmul-${a}`,"Matrix Multiply",`${a}×${a}`,g,pt(2*a*a*a,g.medianMs)))}return r}const no=[{n:1e3,iterations:12},{n:16e3,iterations:12},{n:64e3,iterations:12},{n:262144,iterations:10},{n:1048576,iterations:10},{n:4194304,iterations:8}];async function ao(e,t){const r=[];for(const n of no){const a=n.n;if(t&&!t.has(`vecadd-${a}`))continue;const o=a*4,s=new Float32Array(a),i=new Float32Array(a);ee(s),ee(i);const u=S(o,s),l=S(o,i),c=S(o),d=F(new Float32Array([a,0,0,0]).buffer),p=z(_e,["uniform","read-only-storage","read-only-storage","storage"]),f=R(p,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]),b=[Math.ceil(a/64),1,1];await H(p,f,b,c,o);const g=await D(c,o),v=Rr(s,i);He("vecadd",`${a.toLocaleString("en-US")} elements`,g,v,.01);const y=await e.measure(w=>{w.setPipeline(p),w.setBindGroup(0,f),w.dispatchWorkgroups(b[0],b[1],b[2])},{iterations:n.iterations,wait:se(c,o)});r.push(ie(`vecadd-${a}`,"Vector Add",`${a.toLocaleString("en-US")} elements`,y,eo(3*a*4,y.medianMs)))}return r}const oo=[{inputChannels:1,outputChannels:1,rows:32,cols:32,iterations:10},{inputChannels:1,outputChannels:8,rows:64,cols:64,iterations:8},{inputChannels:1,outputChannels:16,rows:128,cols:128,iterations:6}];async function so(e,t){const r=[];for(const n of oo){const a=n.inputChannels,o=n.rows,s=n.cols,i=n.outputChannels,u=3,l=3,c=o-u+1,d=s-l+1,p=new Float32Array(a*o*s),f=new Float32Array(i*a*u*l);ee(p),ee(f);const m=S(a*o*s*4,p),b=S(i*a*u*l*4,f),g=S(i*c*d*4),v=F(new Float32Array([1,a,o,s,i,u,l,c,d,0,0,0]).buffer),y=z(Gr,["uniform","read-only-storage","read-only-storage","storage"]),w=R(y,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:b}},{binding:3,resource:{buffer:g}}]),$=c*d,x=[1,i,$];await H(y,w,x,g,i*c*d*4);const k=await D(g,i*c*d*4),_=Lr(p,f,1,a,o,s,i,u,l);He("conv2d",`${a}×${o}×${s} → ${i}×${c}×${d}`,k,_,.001);const q=await e.measure(L=>{L.setPipeline(y),L.setBindGroup(0,w),L.dispatchWorkgroups(x[0],x[1],x[2])},{iterations:n.iterations,wait:se(g,i*c*d*4)});r.push(ie(`conv2d-${a}-${i}-${o}`,"Convolution 3×3",`${a}→${i} ch, ${o}×${s} → ${c}×${d}`,q))}return r}const io=[{rows:128,cols:128,iterations:12},{rows:256,cols:256,iterations:12},{rows:512,cols:512,iterations:10}];async function uo(e,t){const r=[];for(const n of io){const{rows:a,cols:o,iterations:s}=n;if(t&&!t.has(`softmax-${a}`))continue;const i=new Float32Array(a*o);ee(i);const u=S(a*o*4,i),l=S(a*o*4),c=F(new Float32Array([a,o,0,0]).buffer),d=z(Ft,["uniform","read-only-storage","storage"]),p=R(d,["uniform","read-only-storage","storage"],[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}}]),f=[a,1,1];await H(d,p,f,l,a*o*4);const m=await D(l,a*o*4),b=Lt(i,a,o);He("softmax",`${a}×${o}`,m,b,.001);const g=await e.measure(v=>{v.setPipeline(d),v.setBindGroup(0,p),v.dispatchWorkgroups(f[0],f[1],f[2])},{iterations:s,wait:se(l,a*o*4)});r.push(ie(`softmax-${a}`,"Softmax",`${a}×${o}`,g))}return r}const co=[{size:256,iterations:12},{size:512,iterations:12},{size:1024,iterations:12},{size:2048,iterations:10},{size:4096,iterations:10}];async function lo(e,t){const r=[];for(const n of co){const{size:a,iterations:o}=n;if(t&&!t.has(`rmsnorm-${a}`))continue;const s=new Float32Array(a);ee(s);const i=new Float32Array(a);for(let w=0;w<a;w++)i[w]=1+w%7*.01;const u=1e-6,l=S(a*4,s),c=S(a*4,i),d=S(a*4),p=F(new Float32Array([a,u,0,0]).buffer),f=z(Nr,["uniform","read-only-storage","read-only-storage","storage"]),m=R(f,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:d}}]),b=[1,1,1];await H(f,m,b,d,a*4);const g=await D(d,a*4),v=Ir(s,i,u);He("rmsnorm",String(a),g,v,.001);const y=await e.measure(w=>{w.setPipeline(f),w.setBindGroup(0,m),w.dispatchWorkgroups(b[0],b[1],b[2])},{iterations:o,wait:se(d,a*4)});r.push(ie(`rmsnorm-${a}`,"RMSNorm",String(a),y))}return r}const fo=[{seq:128,iterations:10,validate:!0},{seq:256,iterations:10,validate:!0},{seq:512,iterations:8,validate:!0},{seq:1024,iterations:6,validate:!1}];function po(e,t,r=1){const n=new Float32Array(r*e*t),a=new Float32Array(r*e*t),o=new Float32Array(r*e*t);ee(n),ee(a),ee(o);const s=1/Math.sqrt(t),i=new Float32Array(r*e*e);for(let c=0;c<r;c++)for(let d=0;d<e;d++)for(let p=0;p<e;p++){let f=0;for(let m=0;m<t;m++)f+=n[(c*e+d)*t+m]*a[(c*e+p)*t+m];i[c*e*e+d*e+p]=f*s}const u=Lt(i,r*e,e),l=zr(n,a,o,r,e,t,s);return{Q:n,K:a,V:o,scores:i,probs:u,out:l}}async function mo(e,t){const r=[],n={};for(const a of fo){const{seq:o,iterations:s}=a;if(t&&!t.includes(o))continue;const i=64,u=1,l=o*o*4;if(o*o>1<<24){r.push(rt(`attention-${o}`,"Attention (single pass)",`seq=${o} dim=64 batch=1`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")),n[`seq=${o}`]=[rt(`attention-skip-${o}`,"Attention phases",`seq=${o}`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")];continue}let c;try{c=await bo(o,i,u)}catch{r.push(rt(`attention-${o}`,"Attention (single pass)",`seq=${o} dim=64 batch=1 scores=${(l/(1024*1024)).toFixed(1)} MiB`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")),n[`seq=${o}`]=[rt(`attention-skip-${o}`,"Attention phases",`seq=${o}`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")];continue}await H(c.pipelines.total,c.groups.total,[u,1,1],c.bufs.out,o*i*4);const d=await D(c.bufs.out,o*i*4);if(a.validate)He("attention",`seq=${o}`,d,c.ref.out,.01);else if(!It(d))throw ye("attention",`seq=${o}`,"non-finite output","");const p=await e.measure(f=>{f.setPipeline(c.pipelines.total),f.setBindGroup(0,c.groups.total),f.dispatchWorkgroups(u,1,1)},{iterations:s,wait:se(c.bufs.out,o*i*4)});r.push(ie(`attention-${o}`,"Attention (single pass)",`seq=${o} dim=64 batch=1`,p,pt(4*o*o*i,p.medianMs),"QK^T + softmax + PV in one pass")),n[`seq=${o}`]=await go(e,c,o,i,s)}return{main:r,phases:n}}async function go(e,t,r,n,a){const o=[Math.ceil(r/64),1,1],s=[Math.ceil(r/64),n,1],i=r*r*4,u=r*n*4;for(let c=0;c<3;c++)await H(t.pipelines.qkt,t.groups.qkt,o,t.bufs.scores,i),await H(t.pipelines.soft,t.groups.soft,[r,1,1],t.bufs.probs,i),await H(t.pipelines.pv,t.groups.pv,s,t.bufs.out,u);const l=[];{await H(t.pipelines.qkt,t.groups.qkt,o,t.bufs.scores,i);const c=await D(t.bufs.scores,i);if(de(c,t.ref.scores)>.01)throw ye("attention.qkt",`seq=${r}`,"phase correctness check failed",`maxErr=${de(c,t.ref.scores).toExponential(2)}`);const d=[];for(let p=0;p<a;p++)d.push(await e.timeOne(f=>{f.setPipeline(t.pipelines.qkt),f.setBindGroup(0,t.groups.qkt),f.dispatchWorkgroups(o[0],o[1],o[2])},se(t.bufs.scores,i)));l.push(ie(`attention-qkt-${r}`,"QK^T (scores)",`seq=${r} dim=64`,Et(d,e.mode),pt(2*r*r*n,br(d))))}{const c=[];for(let p=0;p<a;p++)await H(t.pipelines.qkt,t.groups.qkt,o,t.bufs.scores,i),c.push(await e.timeOne(f=>{f.setPipeline(t.pipelines.soft),f.setBindGroup(0,t.groups.soft),f.dispatchWorkgroups(r,1,1)},se(t.bufs.probs,i)));const d=await D(t.bufs.probs,i);if(de(d,t.ref.probs)>.01)throw ye("attention.softmax",`seq=${r}`,"phase correctness check failed",`maxErr=${de(d,t.ref.probs).toExponential(2)}`);l.push(ie(`attention-softmax-${r}`,"Softmax on scores",`seq=${r} rows=${r}`,Et(c,e.mode)))}{const c=[];for(let p=0;p<a;p++)await H(t.pipelines.qkt,t.groups.qkt,o,t.bufs.scores,i),await H(t.pipelines.soft,t.groups.soft,[r,1,1],t.bufs.probs,i),c.push(await e.timeOne(f=>{f.setPipeline(t.pipelines.pv),f.setBindGroup(0,t.groups.pv),f.dispatchWorkgroups(s[0],s[1],s[2])},se(t.bufs.out,u)));const d=await D(t.bufs.out,u);if(de(d,t.ref.out)>.01)throw ye("attention.pv",`seq=${r}`,"phase correctness check failed",`maxErr=${de(d,t.ref.out).toExponential(2)}`);l.push(ie(`attention-pv-${r}`,"Softmax × V",`seq=${r} dim=64`,Et(c,e.mode),pt(2*r*r*n,br(c))))}return l}function rt(e,t,r,n){return{id:e,name:t,size:r,timingMode:"END_TO_END",iterations:0,warmup:0,medianMs:0,averageMs:0,minMs:0,maxMs:0,stdDevMs:0,note:n}}function Et(e,t){const r=[...e].sort((s,i)=>s-i),n=e.reduce((s,i)=>s+i,0)/Math.max(e.length,1),a=r[Math.floor(r.length/2)]??0,o=e.reduce((s,i)=>s+(i-n)**2,0)/Math.max(e.length,1);return{mode:t,iterations:e.length,warmup:3,medianMs:a,avgMs:n,minMs:r[0]??0,maxMs:r[r.length-1]??0,stdDevMs:Math.sqrt(o)}}function br(e){const t=[...e].sort((r,n)=>r-n);return t[Math.floor(t.length/2)]??0}async function bo(e,t,r){const n=po(e,t,r),a=1/Math.sqrt(t),o=S(e*t*4,n.Q),s=S(e*t*4,n.K),i=S(e*t*4,n.V),u=S(e*t*4),l=S(e*e*4),c=S(e*e*4),d=F(new Float32Array([r,e,t,a]).buffer),p=z(_r,["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"]),f=z(Za,[...mr]),m=z(Ft,["uniform","read-only-storage","storage"]),b=z(Ja,[...gr]),g=R(p,["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:i}},{binding:4,resource:{buffer:u}},{binding:5,resource:{buffer:l}}]),v=R(f,mr,[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:l}}]),y=R(m,["uniform","read-only-storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:c}}]),w=R(b,gr,[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:u}}]);return{seq:e,dim:t,batch:r,pipelines:{total:p,qkt:f,soft:m,pv:b},groups:{total:g,qkt:v,soft:y,pv:w},bufs:{q:o,k:s,v:i,out:u,scores:l,probs:c},ref:{scores:n.scores,probs:n.probs,out:n.out}}}const ge=30,Zr=65536;function vo(){return{pipeline:z(_e,["uniform","read-only-storage","read-only-storage","storage"])}}function be(e){if(e.length===0)return 0;const t=[...e].sort((r,n)=>r-n);return t[Math.floor(t.length/2)]}async function Fe(e){const t=performance.now();return await e(),performance.now()-t}const yo=[1,4,8,16,32,64,128];async function ho(){const e=U(),t=[],r=[];let n=!1;for(const a of yo){if(n){t.push({id:`memory-${a}-mib`,requestedBytes:a*1024*1024,requestedMiB:a,created:!1,success:!1,note:"not attempted (previous allocation failed)"});continue}const o=a*1024*1024;let s=!1,i=!1,u;try{const l=S(o);s=!0,r.push(l);const{error:c}=await Or(e,"memory-allocate",async()=>(await D(l,4),!0));i=!c,u=c?`GPU error while forcing allocation: ${c}`:void 0}catch(l){u=l.message}t.push({id:`memory-${a}-mib`,requestedBytes:o,requestedMiB:a,created:s,success:i,note:u}),i||(n=!0)}for(const a of r)try{a.destroy()}catch{}return t}async function wo(){const{pipeline:e}=vo(),t=Zr,r=t*4,n=[Math.ceil(t/64),1,1],a=new Float32Array(t),o=new Float32Array(t);for(let f=0;f<t;f++)a[f]=f%100/25-2,o[f]=f%77/13-3;const s=F(new Float32Array([t,0,0,0]).buffer),i=[];for(let f=0;f<ge;f++){const m=await Fe(async()=>{const b=S(r,a),g=S(r,o),v=S(r),y=R(e,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:b}},{binding:2,resource:{buffer:g}},{binding:3,resource:{buffer:v}}]),w=U().createCommandEncoder(),$=w.beginComputePass();$.setPipeline(e),$.setBindGroup(0,y),$.dispatchWorkgroups(n[0],n[1],n[2]),$.end(),U().queue.submit([w.finish()]),await D(v,r),b.destroy(),g.destroy(),v.destroy()});i.push(m)}const u=S(r,a),l=S(r,o),c=S(r),d=R(e,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]),p=[];for(let f=0;f<ge;f++){const m=await Fe(async()=>{const b=U().createCommandEncoder(),g=b.beginComputePass();g.setPipeline(e),g.setBindGroup(0,d),g.dispatchWorkgroups(n[0],n[1],n[2]),g.end(),U().queue.submit([b.finish()]),await D(c,r)});p.push(m)}return{allocateDestroy:{id:"buffer-allocate-destroy",name:"Allocate + Destroy per op",size:`${vr(3*t*4)} (3 × VecAdd buffers)`,timingMode:"END_TO_END",perOpMs:be(i),totalMs:i.reduce((f,m)=>f+m,0),iterations:ge,samplesMs:[...i].sort((f,m)=>f-m),note:"full op = create 3 buffers + bind group + dispatch + readback + destroy"},bufferReuse:{id:"buffer-reuse",name:"Reuse persistent buffers",size:`${vr(3*t*4)} (3 × VecAdd buffers)`,timingMode:"END_TO_END",perOpMs:be(p),totalMs:p.reduce((f,m)=>f+m,0),iterations:ge,samplesMs:[...p].sort((f,m)=>f-m),note:"full op = dispatch + readback on pre-allocated buffers"}}}async function xo(){const e=Zr,t=e*4,r=[Math.ceil(e/64),1,1],n=new Float32Array(e),a=new Float32Array(e);for(let f=0;f<e;f++)n[f]=f%100/25-2,a[f]=f%77/13-3;const o=S(t,n),s=S(t,a),i=S(t),u=F(new Float32Array([e,0,0,0]).buffer),l=[];for(let f=0;f<ge;f++){const m=await Fe(async()=>{const b=z(_e,["uniform","read-only-storage","read-only-storage","storage"]),g=R(b,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:i}}]),v=U().createCommandEncoder(),y=v.beginComputePass();y.setPipeline(b),y.setBindGroup(0,g),y.dispatchWorkgroups(r[0],r[1],r[2]),y.end(),U().queue.submit([v.finish()]),await D(i,t),typeof b.destroy=="function"&&b.destroy()});l.push(m)}const c=z(_e,["uniform","read-only-storage","read-only-storage","storage"]),d=R(c,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:i}}]),p=[];for(let f=0;f<ge;f++){const m=await Fe(async()=>{const b=U().createCommandEncoder(),g=b.beginComputePass();g.setPipeline(c),g.setBindGroup(0,d),g.dispatchWorkgroups(r[0],r[1],r[2]),g.end(),U().queue.submit([b.finish()]),await D(i,t)});p.push(m)}return{recreate:{id:"pipeline-recreate",name:"Recreate pipeline per op",size:"VecAdd 65536",timingMode:"END_TO_END",perOpMs:be(l),totalMs:l.reduce((f,m)=>f+m,0),iterations:ge,samplesMs:[...l].sort((f,m)=>f-m),note:"full op = createPipeline + bind group + dispatch + readback"},cached:{id:"pipeline-cached",name:"Cached pipeline",size:"VecAdd 65536",timingMode:"END_TO_END",perOpMs:be(p),totalMs:p.reduce((f,m)=>f+m,0),iterations:ge,samplesMs:[...p].sort((f,m)=>f-m),note:"full op = dispatch + readback on a pre-built pipeline"}}}const le=8,Pt=4096;async function So(){const e=Pt,t=e*4,r=[Math.ceil(e/64),1,1],n=new Float32Array(e),a=new Float32Array(e);for(let f=0;f<e;f++)n[f]=f%100/25-2,a[f]=f%77/13-3;const o=F(new Float32Array([e,0,0,0]).buffer),s=S(t,n),i=S(t,a),u=S(t),l=z(_e,["uniform","read-only-storage","read-only-storage","storage"]),c=R(l,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:u}}]),d=[];for(let f=0;f<20;f++){const m=await Fe(async()=>{const b=[];for(let g=0;g<le;g++){const v=U().createCommandEncoder(),y=v.beginComputePass();y.setPipeline(l),y.setBindGroup(0,c),y.dispatchWorkgroups(r[0],r[1],r[2]),y.end(),b.push(v)}for(const g of b)U().queue.submit([g.finish()]);await D(u,t)});d.push(m)}const p=[];for(let f=0;f<20;f++){const m=await Fe(async()=>{const b=U().createCommandEncoder();for(let g=0;g<le;g++){const v=b.beginComputePass();v.setPipeline(l),v.setBindGroup(0,c),v.dispatchWorkgroups(r[0],r[1],r[2]),v.end()}U().queue.submit([b.finish()]),await D(u,t)});p.push(m)}return[{id:"command-batch-individual",name:`${le} × VecAdd(${Pt}) — individual submits`,dispatches:le,timingMode:"END_TO_END",totalMedianMs:be(d),perDispatchMs:be(d)/le,samplesMs:[...d].sort((f,m)=>f-m)},{id:"command-batch-batched",name:`${le} × VecAdd(${Pt}) — 8 passes, one command buffer`,dispatches:le,timingMode:"END_TO_END",totalMedianMs:be(p),perDispatchMs:be(p)/le,samplesMs:[...p].sort((f,m)=>f-m)}]}function vr(e){return`${(e/1024).toFixed(1)} KiB`}function Mo(){const e=typeof navigator<"u"?navigator:void 0;if(e&&(typeof e.getGpuUtilization=="function"||typeof e.gpuUtilization=="number"))try{const t=typeof e.getGpuUtilization=="function"?e.getGpuUtilization():e.gpuUtilization;return typeof t=="number"?`${t}%`:"UNAVAILABLE"}catch{return"UNAVAILABLE"}return"UNAVAILABLE"}function Nt(){const e=typeof navigator<"u"?navigator:void 0;if(!e)return"UNAVAILABLE";const t=e;if(typeof t.getDeviceThermalLevel=="function")try{const r=t.getDeviceThermalLevel();return String(r)}catch{return"UNAVAILABLE"}return"UNAVAILABLE"}function yr(){const e=typeof navigator<"u"?navigator:void 0;return{userAgent:typeof navigator<"u"?navigator.userAgent:"unknown",platform:e&&typeof e.platform=="string"?e.platform:"unknown",hardwareConcurrency:e&&typeof e.hardwareConcurrency=="number"?e.hardwareConcurrency:null,deviceMemory:e&&typeof e.deviceMemory=="number"?e.deviceMemory:null,thermalState:Nt(),gpuUtilization:Mo()}}function Eo(e){return JSON.parse(JSON.stringify(e))}function hr(e){const t=e.diag,r={device:{webgpuAvailable:t.webgpuAvailable,adapterName:t.adapterName,adapterVendor:t.adapterVendor,adapterDevice:t.adapterDevice,features:t.adapterFeatures,timestampQuerySupport:t.timestampQuerySupport,isFallbackAdapter:t.isFallbackAdapter},browser:e.browser,webgpu:{limits:{maxBufferSize:t.maxBufferSize,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension},maxBufferSize:t.maxBufferSize,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize},timingMode:e.timingMode,timestamp:new Date().toISOString(),build:e.build,tests:e.tests,memory:e.memory,bufferReuse:e.bufferReuse,pipelineCache:e.pipelineCache,commandBatching:e.commandBatching,sustained:e.sustained,suiteError:e.suiteError};return Eo(r)}function Po(e){const t={},r=(n,a,o)=>{t[`${n}.${a}`]={test:n,configuration:a,iterations:o.iterations,warmup:o.warmup,minMs:o.minMs,maxMs:o.maxMs,meanMs:o.averageMs,medianMs:o.medianMs,stdDevMs:o.stdDevMs,timingMode:o.timingMode,throughput:o.throughput?`${o.throughput.value.toFixed(2)} ${o.throughput.unit}`:null,note:o.note??null}};for(const n of e.tests.matmul)r("matmul",n.size,n);for(const n of e.tests.vecadd)r("vecadd",n.size,n);for(const n of e.tests.conv2d)r("conv2d",n.size,n);for(const n of e.tests.softmax)r("softmax",n.size,n);for(const n of e.tests.rmsnorm)r("rmsnorm",n.size,n);for(const n of e.tests.attention)r("attention",n.size,n);for(const[n,a]of Object.entries(e.tests.attentionPhases))for(const o of a)r("attention",`${o.name} ${n}`,o);for(const n of e.memory)t[`memory.${n.requestedMiB} MiB`]={test:"memory",configuration:`${n.requestedMiB} MiB`,iterations:1,warmup:0,minMs:0,maxMs:0,meanMs:0,medianMs:0,stdDevMs:0,timingMode:"ALLOCATION",note:`${n.requestedMiB} MiB requested (${n.requestedBytes} B) — created=${n.success?"yes":"no"}, success=${n.success?"yes":"no"}${n.note?` — ${n.note}`:""}`,throughput:null};for(const n of Object.keys(e.bufferReuse)){const a=e.bufferReuse[n];t[`bufferReuse.${a.name}`]={test:"bufferReuse",configuration:a.name,iterations:a.iterations,warmup:0,minMs:wr(a.samplesMs),maxMs:a.samplesMs[a.samplesMs.length-1]??0,meanMs:a.totalMs/Math.max(a.iterations,1),medianMs:a.perOpMs,stdDevMs:0,timingMode:a.timingMode,throughput:null,note:`per-op (median) ${a.perOpMs.toFixed(3)} ms — ${a.note??""}`.trim()}}for(const n of Object.keys(e.pipelineCache)){const a=e.pipelineCache[n];t[`pipelineReuse.${a.name}`]={test:"pipelineReuse",configuration:a.name,iterations:a.iterations,warmup:0,minMs:wr(a.samplesMs),maxMs:a.samplesMs[a.samplesMs.length-1]??0,meanMs:a.totalMs/Math.max(a.iterations,1),medianMs:a.perOpMs,stdDevMs:0,timingMode:a.timingMode,throughput:null,note:`per-op (median) ${a.perOpMs.toFixed(3)} ms — ${a.note??""}`.trim()}}for(const n of e.commandBatching)t[`commandBatching.${n.name}`]={test:"commandBatching",configuration:n.name,iterations:n.samplesMs.length,warmup:0,minMs:n.samplesMs[0]??0,maxMs:n.samplesMs[n.samplesMs.length-1]??0,meanMs:n.samplesMs.reduce((a,o)=>a+o,0)/Math.max(n.samplesMs.length,1),medianMs:n.totalMedianMs,stdDevMs:0,timingMode:n.timingMode,throughput:null,note:`${n.dispatches} work dispatches across ${n.name.includes("one command buffer")?"passes in one command buffer":"separate submissions"}`};if(e.sustained){const n=e.sustained;t["sustained.30sec"]={test:"sustained",configuration:"MatMul 256×256, 30 seconds",iterations:n.samples.length,warmup:0,minMs:n.minGflops,maxMs:n.maxGflops,meanMs:n.avgGflops,medianMs:n.samples[Math.floor(n.samples.length/2)]?.gflops??0,stdDevMs:0,timingMode:n.timingMode,throughput:null,note:`avg ${n.avgGflops.toFixed(1)} GFLOPS; first10s ${n.first10sAvgGflops.toFixed(1)}, last10s ${n.last10sAvgGflops.toFixed(1)}; throttled=${n.throttled?"yes":"no"} (miss=${n.dropPct.toFixed(1)}%)${n.error?` — ${n.error}`:""}`}}return e.suiteError&&(t["suite.error"]={test:"suite",configuration:"aborted",iterations:0,warmup:0,minMs:0,maxMs:0,meanMs:0,medianMs:0,stdDevMs:0,timingMode:e.timingMode,throughput:null,note:e.suiteError}),{device:e.device,browser:e.browser,webgpu:e.webgpu,timingMode:e.timingMode,timestamp:e.timestamp,commit:e.build.commit,results:t}}function wr(e){if(e.length===0)return 0;const t=[...e].sort((r,n)=>r-n);return t[Math.floor(t.length/2)]}function Ao(e){const t=[],r=e.tests.matmul,n=e.tests.vecadd,a=e.tests.attention,o=(()=>{if(r.length===0)return null;const c=r.filter(d=>d.throughput);return c.length===0?null:c.reduce((d,p)=>d.throughput.value>p.throughput.value?d:p)})();o?t.push(`compute-bound: largest MatMul throughput measured ${o.throughput.value.toFixed(1)} ${o.throughput.unit} at ${o.size} — matrix multiply is the classic compute-bound workload here.`):t.push("compute-bound: no usable MatMul throughput recorded.");const s=n.reduce((c,d)=>d.throughput&&(!c||d.throughput.value>c.throughput.value)?d:c,null);if(s&&s.throughput?t.push(`memory-bandwidth-sensitive: Vector Add peaks at ${s.throughput.value.toFixed(1)} ${s.throughput.unit} at ${s.size} — trivial ALU per element, so this reflects practical device memory bandwidth.`):t.push("memory-bandwidth-sensitive: no usable Vector Add bandwidth recorded."),a.length>=2){const c=[...a].sort((p,f)=>p.size.length-f.size.length),d=c[c.length-1];t.push(`attention bottleneck: largest tested single-pass attention (${d.size}) took ${d.medianMs.toFixed(2)} ms median (${d.timingMode}). Scores grow O(seq²): this is the workload most likely to bottleneck video diffusion decoding.`)}else a.length===1&&t.push(`attention bottleneck: attention at ${a[0].size} took ${a[0].medianMs.toFixed(2)} ms median (${a[0].timingMode}). Scores grow O(seq²).`);const i=a.filter(c=>/seq=(\d+)/.test(c.size)).sort((c,d)=>parseInt(d.size.match(/seq=(\d+)/)[1],10)-parseInt(c.size.match(/seq=(\d+)/)[1],10));if(i.length>=2){const c=i[0],d=i[1],p=c.medianMs/Math.max(d.medianMs,1e-9),f=parseInt(c.size.match(/seq=(\d+)/)[1],10),m=parseInt(d.size.match(/seq=(\d+)/)[1],10),b=f/m;t.push(`attention scaling: ${c.size} ran ${p.toFixed(2)}× slower than ${d.size} (seq ×${b}). With O(seq²) scores, doubling seq multiplies score work by ~4× — expect ~${(b*b).toFixed(1)}× per double if score-dominated.`)}else t.push("attention scaling: need 2+ attention sizes to compute a scaling ratio.");const u=e.memory.filter(c=>c.created&&c.success);if(u.length>0){const c=u.reduce((d,p)=>d.requestedBytes>p.requestedBytes?d:p);t.push(`largest safe tested tensor: single storage buffer of ${(c.requestedBytes/(1024*1024)).toFixed(0)} MiB allocated and survived. This is a tested allocation, not the total GPU memory.`)}else t.push("largest safe tested tensor: no successful memory allocation recorded.");const l=e.bufferReuse;if(l.allocateDestroy&&l.bufferReuse&&l.allocateDestroy.perOpMs>0){const c=l.bufferReuse.perOpMs/l.allocateDestroy.perOpMs;t.push(`buffer reuse: persistent reuse measured ${(c*100).toFixed(0)}% of the allocate/destroy per-op cost (${l.allocateDestroy.perOpMs.toFixed(3)} ms → ${l.bufferReuse.perOpMs.toFixed(3)} ms). Persistent buffers should be the default in the tensor runtime.`)}else t.push("buffer reuse: insufficient data to compare allocation strategies.");return t}const $o=30,Co=2e3,Uo=750,N=256;function xr(e){let t=2654435769;for(let r=0;r<e.length;r++)t=t*1664525+1013904223>>>0,e[r]=t%2001/1e3-1}function Bo(){const e=N*N*4,t=new Float32Array(N*N),r=new Float32Array(N*N);xr(t),xr(r);const n=S(e,t),a=S(e,r),o=S(e),s=F(new Float32Array([N,N,N,1]).buffer),i=z(Xe,["uniform","read-only-storage","read-only-storage","storage"]),u=R(i,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:o}}]);return{pipeline:i,bg:u,bufC:o,wg:[N/16,N/16,1]}}function To(e){return new Promise(t=>setTimeout(t,e))}async function ko(e,t={}){const r=U(),n=t.seconds??$o,a=Nt(),{pipeline:o,bg:s,bufC:i,wg:u}=Bo(),l=await e.timeOne(x=>{x.setPipeline(o),x.setBindGroup(0,s),x.dispatchWorkgroups(u[0],u[1],u[2])},()=>D(i,N*N*4).then(()=>{})),c=Math.max(1,Math.min(Co,Math.floor(Uo/Math.max(l,.01)))),d=[],p=performance.now(),f=2*N*N*N;for(let x=0;x<n;x++){const k=performance.now();let _=0;try{const Ce=r.createCommandEncoder(),Ue=Ce.beginComputePass();Ue.setPipeline(o),Ue.setBindGroup(0,s);for(let W=0;W<c;W++)Ue.dispatchWorkgroups(u[0],u[1],u[2]);Ue.end(),r.queue.submit([Ce.finish()]),await D(i,N*N*4),_=Math.max(performance.now()-k,.001)}catch(Ce){_=1e3,t.onProgress?.(Ce.message)}const q=_/c,L=f/(q/1e3)/1e9,ae={second:x+1,avgMs:q,gflops:L};d.push(ae),t.onSecond?.(x+1,ae,x);const Je=1e3-(performance.now()-k);Je>10&&await To(Je)}Math.max(performance.now()-p,1);const m=d.map(x=>x.gflops),b=d.filter(x=>x.second<=10).map(x=>x.gflops),g=d.filter(x=>x.second>n-10).map(x=>x.gflops),v=x=>x.length?x.reduce((k,_)=>k+_,0)/x.length:0,y=v(b),w=v(g),$=y>0?(1-w/y)*100:0;return{durationSeconds:n,samples:d,first10sAvgGflops:y,last10sAvgGflops:w,throttled:w<y*.95,dropPct:Math.max(0,$),avgGflops:v(m),minGflops:d.length?Math.min(...m):0,maxGflops:d.length?Math.max(...m):0,thermalBefore:a,thermalAfter:Nt(),timingMode:"AGGREGATE_END_TO_END",error:void 0}}let At=!1;const je={matmul:new Set(["matmul-256","matmul-512"]),vecadd:new Set(["vecadd-1048576"]),conv2d:new Set,softmax:new Set(["softmax-256"]),rmsnorm:new Set(["rmsnorm-1024"]),attentionSeqs:[256]};async function Do(e){if(At)throw new Error("A benchmark suite is already running.");At=!0;let t=null;try{const r=await Ne();t=new Xa(U());const n=yr(),a={id:Re,commit:ft??null,time:Ye??null},o=e.mode==="full",s={matmul:[],vecadd:[],conv2d:[],softmax:[],rmsnorm:[],attention:[],attentionPhases:{}},i=m=>e.onProgress?.(m);i("matmul"),s.matmul=await ro(t,o?void 0:je.matmul),i("vecadd"),s.vecadd=await ao(t,o?void 0:je.vecadd),o&&(i("conv2d"),s.conv2d=await so(t)),i("softmax"),s.softmax=await uo(t,o?void 0:je.softmax),i("rmsnorm"),s.rmsnorm=await lo(t,o?void 0:je.rmsnorm),i("attention");const u=await mo(t,o?void 0:je.attentionSeqs);s.attention=u.main,s.attentionPhases=u.phases;let l=[],c={},d={},p=[],f=null;return o&&(i("memory"),l=await ho(),i("buffer reuse"),c=await wo(),i("pipeline cache"),d=await xo(),i("command batching"),p=await So()),e.mode==="sustained"&&(i("sustained (30s)"),f=await ko(t,{onSecond:(m,b)=>e.onSecond?.(m,`s${m}: ${b.gflops.toFixed(2)} GFLOPS`)})),hr({diag:r,browser:n,timingMode:t.mode,build:a,tests:s,memory:l,bufferReuse:c,pipelineCache:d,commandBatching:p,sustained:f})}catch(r){const n={matmul:[],vecadd:[],conv2d:[],softmax:[],rmsnorm:[],attention:[],attentionPhases:{}};let a=null;try{a=await Ne()}catch{}if(a&&t)return hr({diag:a,browser:yr(),timingMode:t.mode,build:{id:Re,commit:ft??null,time:Ye??null},tests:n,memory:[],bufferReuse:{},pipelineCache:{},commandBatching:[],sustained:null,suiteError:r.message});throw r}finally{t?.destroy(),At=!1}}let Q=null,O=!1,_t=!1,fe=null,Y=localStorage.getItem("aether.kernels-passed")!=="1",Ae=localStorage.getItem("aether.sustained.armed")==="1",Qe=null;const ve={sanity:!1,standaloneMatmul:!1,directMatmul:!1,harnessMatmul:!1};function mt(){return ve.sanity&&ve.standaloneMatmul&&ve.directMatmul&&ve.harnessMatmul}function ht(){const e=Q?.querySelector("#btn-correctness");if(!e)return;const t=mt();e.disabled=!t,e.textContent=t?"CORRECTNESS":"CORRECTNESS (LOCKED)"}function M(e,t=""){if(!Q)return;const r=Q.querySelector("#bench-log");if(!r)return;const n=document.createElement("div");n.className=`log-entry ${t}`,n.textContent=e,r.appendChild(n),r.scrollTop=r.scrollHeight}function Sr(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function Le(){const e=va();M(`WEBGPU DEVICE LOST — reason: ${e.reason??"unknown"} — message: ${e.message??""}`,"err"),M("Remaining tests stopped.","err")}function wt(){if(!_t)try{const e=U();e.addEventListener("uncapturederror",t=>{const r=t.error;M(`UNCAPTURED GPU ERROR: ${r?.message??"unknown"}`,"err")}),e.lost.then(t=>{M(`WEBGPU DEVICE LOST — reason: ${t.reason} — message: ${t.message}`,"err")}),_t=!0}catch{}}function xt(e,t){const r=Q?.querySelector(`#${e}`);if(!r)return;const n=[t.stage?`<div>stage: <b style="color:var(--text)">${P(t.stage)}</b></div>`:"",t.pass?"":t.errorType?`<div>error type: <b style="color:var(--red)">${P(t.errorType)}</b></div>`:"",t.pass?"":t.errorMessage?`<div>error message: <b style="color:var(--red)">${P(t.errorMessage)}</b></div>`:"",...t.notes.map(a=>`<div style="color:var(--text-dim)">${P(a)}</div>`)].join("");r.innerHTML=`
    <div class="card" style="border-color:${t.pass?"var(--green)":"var(--red)"};margin-top:12px">
      <div class="card-header">
        <span class="card-title">${P(t.title)}</span>
        <span class="badge ${t.pass?"badge-pass":"badge-fail"}">${t.pass?"PASS":"FAIL"}</span>
      </div>
      <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${n||'<div style="color:var(--text-dim)">—</div>'}</div>
    </div>
  `}function P(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Jr(e){const t=[];for(const r of e.scopeErrors)t.push(`GPU error scope [${r.type}]: ${r.message}`);for(const r of e.uncaptured)t.push(`uncaptured GPU error [${r.type}]: ${r.message}`);return e.lost.reason&&t.push(`device lost — reason: ${e.lost.reason} — message: ${e.lost.message??""}`),t.push(`expected: ${e.expected}`),e.actual!==null&&t.push(`actual: ${e.actual}`),e.exception&&t.push(`exception: ${e.exception}`),t}function Oo(e){const t=e.pass?"display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--green);color:var(--green)":"display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--red);color:var(--red)",r=e.pass?`${e.config} — complete`:`${e.config} — stage: ${e.stage} · ${e.errorType??""} · ${e.errorMessage??""}`;return`<span style="${t}" title="${P(r)}">${P(e.config)} ${e.pass?"✓":"✗"}</span>`}function Go(e){const t=[];return t.push(`stage: ${P(e.stage)} · error type: <b style="color:var(--red)">${P(e.errorType??"unknown")}</b>`),e.errorMessage&&t.push(`error: ${P(e.errorMessage)}`),e.nonFiniteIndex>=0&&t.push(`non-finite output at index ${e.nonFiniteIndex}`),e.errorIndex>=0&&e.cpuValue!==null&&e.gpuValue!==null&&t.push(`largest error @ ${e.errorIndex}: cpu=${e.cpuValue.toExponential(4)} gpu=${e.gpuValue.toExponential(4)}`),e.expectedRange&&t.push(`expected range [${e.expectedRange[0].toExponential(3)}, ${e.expectedRange[1].toExponential(3)}]`),e.actualRange&&t.push(`actual range [${e.actualRange[0].toExponential(3)}, ${e.actualRange[1].toExponential(3)}]`),t.map(r=>`<div style="color:var(--red)">${r}</div>`)}function No(e){const t=Q?.querySelector("#validation-panel");if(!t)return;const r=e.length===6&&e.every(a=>a.pass),n=e.map(a=>{const o=a.cases.filter(i=>!i.pass).flatMap(Go),s=a.pass?"complete":a.details.includes("ABORTED")?"aborted (device lost)":a.cases.find(i=>!i.pass)?.stage??"failed";return`
      <div class="card" style="border-color:${a.pass?"var(--green)":"var(--red)"};margin-top:10px">
        <div class="card-header">
          <span class="card-title">${P(a.name.toUpperCase())}</span>
          <span class="badge ${a.pass?"badge-pass":"badge-fail"}">${a.pass?"PASS":"FAIL"}</span>
        </div>
        <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:4px;word-break:break-all">
          <div>${a.cases.map(Oo).join("")||'<span style="color:var(--text-dim)">not run</span>'}</div>
          <div>max error: <b>${a.maxError>=0?a.maxError.toExponential(2):"—"}</b></div>
          <div>execution status: <b>${P(s)}</b></div>
          ${o}
        </div>
      </div>`}).join("");t.innerHTML=`
    <h3 style="margin-top:20px">AETHER KERNEL VALIDATION</h3>
    <div class="card" style="border-color:${r?"var(--green)":"var(--red)"};margin-top:4px">
      <div class="card-header">
        <span class="card-title">All kernels</span>
        <span class="badge ${r?"badge-pass":"badge-fail"}">${r?"ALL PASS":"FAILURE(S)"}</span>
      </div>
    </div>
    ${n}
  `}function ke(e){const t=e??{pass:!1,maxError:-1,cases:[]};return{pass:t.pass,maxError:t.maxError,cases:t.cases}}function _o(e){return!fe||e.length===0?null:{device:{webgpuAvailable:fe.webgpuAvailable,adapterName:fe.adapterName,adapterVendor:fe.adapterVendor,adapterDevice:fe.adapterDevice,fallbackAdapter:fe.isFallbackAdapter},build:{id:Re,commit:ft??null,time:Ye??null},timestamp:new Date().toISOString(),uncapturedErrors:qr(),tests:{vectorAdd:ke(e[0]),matmul:ke(e[1]),conv2d:ke(e[2]),softmax:ke(e[3]),rmsNorm:ke(e[4]),attention:ke(e[5])},allPass:e.length===6&&e.every(t=>t.pass)}}function Ro(e){try{localStorage.setItem("aether.correctness",JSON.stringify(e))}catch{}}function Fo(e){const t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=`aether-correctness-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`,n.click(),URL.revokeObjectURL(r)}function Lo(e){const t=Q?.querySelector("#report-panel");t&&(t.innerHTML=`
    <div class="card" style="border-color:${e.allPass?"var(--green)":"var(--red)"};margin-top:12px">
      <div class="card-header">
        <span class="card-title">Correctness Report</span>
        <span class="badge ${e.allPass?"badge-pass":"badge-fail"}">${e.allPass?"VALID":"INVALID"}</span>
      </div>
      <div class="btn-row" style="margin-top:10px">
        <button class="btn" id="btn-export-json">EXPORT JSON</button>
        <button class="btn btn-outline" id="btn-reload">RELOAD</button>
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
        device: ${P(e.device.adapterName)} · ${P(e.device.adapterVendor)} · saved to localStorage
      </div>
    </div>
  `,t.querySelector("#btn-export-json")?.addEventListener("click",()=>Fo(e)),t.querySelector("#btn-reload")?.addEventListener("click",()=>location.reload()))}async function Io(){if(!O){O=!0;try{M("═══ GPU SANITY (standalone) ═══","info");const e=await Va();ve.sanity=e.pass,ht(),xt("res-sanity",{title:"GPU SANITY",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:Jr(e)}),M(`GPU SANITY TEST: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&M(`  error type: ${e.errorType}`,"err"),e.errorMessage&&M(`  error message: ${e.errorMessage}`,"err")}catch(e){M(`ERROR: ${e.message}`,"err")}finally{O=!1}}}async function zo(){if(!O){O=!0;try{M("═══ STANDALONE MATMUL (64×64) ═══","info");const e=await Ka();ve.standaloneMatmul=e.pass,ht(),xt("res-standalone",{title:"STANDALONE MATMUL",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:Jr(e)}),M(`STANDALONE MATMUL: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&M(`  error type: ${e.errorType}`,"err"),e.errorMessage&&M(`  error message: ${e.errorMessage}`,"err")}catch(e){M(`ERROR: ${e.message}`,"err")}finally{O=!1}}}async function Wo(){if(!O){O=!0;try{await Ne(),wt(),M("═══ SHARED-DEVICE DIRECT MATMUL (engine device, inline) ═══","info");const e=await Ya();ve.directMatmul=e.pass,ht(),xt("res-direct",{title:e.name,pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:[`execution device id: ${e.executionDeviceId}`,`pipeline device id: ${e.pipelineDeviceId??"unknown"}`,`bind group device id: ${e.bindGroupDeviceId??"unknown"}`,`device mismatch: ${e.mismatch?"YES":"NO"}`,`max error: ${e.maxError!==null?e.maxError.toExponential(2):"—"}`]}),M(`SHARED-DEVICE DIRECT MATMUL: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&M(`  error type: ${e.errorType}`,"err"),e.errorMessage&&M(`  error message: ${e.errorMessage}`,"err"),he()&&Le()}catch(e){M(`ERROR: ${e.message}`,"err"),he()&&Le()}finally{O=!1}}}async function qo(){if(!O){O=!0;try{await Ne(),wt(),M("═══ HARNESS MATMUL (runGpuTest) ═══","info");const e=await Hr();ve.harnessMatmul=e.pass,ht();const t=e.cases.map(a=>`${a.config}:${a.pass?"PASS":"FAIL"}`).join(" "),r=e.cases.find(a=>!a.pass),n=r?[`pipeline device id: ${r.pipelineDeviceId??"unknown"}`,`execution device id: ${r.executionDeviceId??"unknown"}`,`bind group device id: ${r.bindGroupDeviceId??"unknown"}`,`device mismatch: ${r.mismatch?"YES":"NO"}`]:[];xt("res-harness",{title:"HARNESS MATMUL",pass:e.pass,stage:e.pass?"complete":r?.stage??"runGpuTest",errorType:e.pass?null:r?.errorType??null,errorMessage:e.pass?null:r?.errorMessage??e.details,notes:[`cases: ${t||"—"}`,`max error: ${e.maxError>=0?e.maxError.toExponential(2):"—"}`,...n]}),M(`HARNESS MATMUL: ${e.pass?"PASS":"FAIL"} — ${e.details||""}`,e.pass?"ok":"err"),he()&&Le()}catch(e){M(`ERROR: ${e.message}`,"err"),he()&&Le()}finally{O=!1}}}async function Ho(){if(!O){if(!mt()){M("CORRECTNESS LOCKED — run GPU SANITY, STANDALONE MATMUL and HARNESS MATMUL first.","warn");return}O=!0;try{fe=await Ne(),wt(),qr(),Wr(),M("═══ AETHER KERNEL VALIDATION (sequential, one test at a time) ═══","info");const t=await qa(n=>{M(`${n.pass?"✓":"✗"} ${n.name} — ${n.details}`,n.pass?"ok":"err")});No(t);const r=t.length===6&&t.every(n=>n.pass);if(M(r?"ALL KERNELS PASSED":"SOME KERNELS FAILED",r?"ok":"err"),r)jo(),M("Performance benchmarks UNLOCKED.","ok");else if(!Y){Y=!0;try{localStorage.removeItem("aether.kernels-passed")}catch{}gt(),M("Performance benchmarks RE-LOCKED (a validated kernel failed).","err")}if(he())Le(),M("Requires runtime reinitialization — reload the page (or re-run up the gate diagnostics) before retrying.","err");else{const n=_o(t);n&&(Ro(n),Lo(n),M("Correctness report saved locally (aether.correctness).","info"))}}catch(e){M(`ERROR: ${e.message}`,"err"),he()&&Le()}finally{O=!1}}}function jo(){Y=!1;try{localStorage.setItem("aether.kernels-passed","1")}catch{}gt()}function re(e){return Number.isFinite(e)?e<1?`${(e*1e3).toFixed(1)} µs`:e<1e3?`${e.toFixed(2)} ms`:`${(e/1e3).toFixed(2)} s`:"—"}function en(e){return!e||!Number.isFinite(e.value)?"—":`${e.value.toFixed(1)} ${e.unit}`}function tn(e){return e==="GPU_TIMESTAMP"?"GPU TIMESTAMP":e==="END_TO_END"?"END-TO-END":e}function Vo(e){return!e||e.length===0?'<tr><td colspan="7" style="color:var(--text-dim)">not run</td></tr>':e.map(t=>t.note&&t.note.startsWith("SKIPPED")?`<tr><td class="td-l">${P(t.size)}</td><td colspan="7" style="color:var(--yellow)">${P(t.note)} — not reported as a failure</td></tr>`:`<tr ${t.error?'style="color:var(--red)"':""}>
          <td class="td-l">${P(t.size)}</td>
          <td>${tn(t.timingMode)}</td>
          <td>${re(t.medianMs)}</td>
          <td>${re(t.averageMs)}</td>
          <td>${re(t.minMs)}</td>
          <td>${re(t.maxMs)}</td>
          <td>${re(t.stdDevMs)}</td>
          <td>${en(t.throughput)}</td>
        </tr>`).join("")}function Ee(e,t){return`<div class="perf-block">
    <div class="perf-block-title">${P(e)} <span class="badge badge-info" style="float:right">${t?t.length:0} run</span></div>
    <table class="perf-table">
      <thead><tr>
        <th class="th-l">size</th><th>mode</th><th>median</th><th>avg</th><th>min</th><th>max</th><th>stddev</th><th>throughput</th>
      </tr></thead>
      <tbody>${Vo(t)}</tbody>
    </table>
  </div>`}function nt(e,t){return t?`<div class="perf-block">
    <div class="perf-block-title">${P(e)} <span class="badge badge-info" style="float:right">${t.timingMode}</span></div>
    <table class="perf-table">
      <thead><tr><th class="th-l">configuration</th><th>per-op</th><th>total</th><th>iterations</th></tr></thead>
      <tbody>
        <tr>
          <td class="td-l">${P(t.name)} <span style="color:var(--text-dim)">· ${P(t.size)}</span></td>
          <td>${re(t.perOpMs)}</td>
          <td>${re(t.totalMs)}</td>
          <td>${t.iterations}</td>
        </tr>
      </tbody>
    </table>
    ${t.note?`<div style="font-size:11px;color:var(--text-dim)">${P(t.note)}</div>`:""}
  </div>`:""}function Ko(e){const t=Object.entries(e.tests.attentionPhases);return t.length===0?"":`<div class="perf-block">
    <div class="perf-block-title">Attention phases (per sequence length) <span class="badge badge-info" style="float:right">split</span></div>
    ${t.map(([n,a])=>`<div class="perf-sub">${P(n)}</div>${Ee("",a)}`).join("")||'<div style="color:var(--text-dim)">not run</div>'}
  </div>`}function Yo(e){return`<tr style="color:${e.success?"var(--green)":"var(--red)"}">
    <td class="td-l">${e.requestedMiB} MiB</td>
    <td>${e.created?"allocated":"skipped"}</td>
    <td>${e.success?"OK":"FAILED"}</td>
    <td style="color:var(--text-dim)">${P(e.note??"")}</td>
  </tr>`}function Qo(e){if(!e)return"";const t=e.samples.map(r=>`<div class="pad-bar" title="s${r.second}: ${r.gflops.toFixed(2)} GFLOPS" style="height:${Math.max(8,Math.min(80,100-r.gflops))}px"></div>`).join("");return`<div class="perf-block">
    <div class="perf-block-title">Sustained 30s — MatMul 256 ${e.throttled?'<span class="badge badge-fail">THROTTLED</span>':'<span class="badge badge-pass">STABLE</span>'}</div>
    <div style="display:flex;align-items:flex-end;gap:2px;height:80px;margin:8px 0">${t}</div>
    <table class="perf-table">
      <tbody>
        <tr><td class="td-l">first 10s avg</td><td>${e.first10sAvgGflops.toFixed(2)} GFLOPS</td></tr>
        <tr><td class="td-l">last 10s avg</td><td>${e.last10sAvgGflops.toFixed(2)} GFLOPS</td></tr>
        <tr><td class="td-l">drop</td><td>${e.dropPct.toFixed(1)}%</td></tr>
        <tr><td class="td-l">overall avg / min / max</td><td>${e.avgGflops.toFixed(2)} / ${e.minGflops.toFixed(2)} / ${e.maxGflops.toFixed(2)} GFLOPS</td></tr>
        <tr><td class="td-l">thermal before / after</td><td>${P(e.thermalBefore)} → ${P(e.thermalAfter)}</td></tr>
        <tr><td class="td-l">timing</td><td>${e.timingMode}</td></tr>
      </tbody>
    </table>
  </div>`}function Xo(e){const t=Q?.querySelector("#perf-results");if(!t)return;const r=Ao(e),n=e.commandBatching.map(o=>`<tr><td class="td-l">${P(o.name)}</td><td>${re(o.totalMedianMs)}</td><td>${re(o.perDispatchMs)}</td><td>${o.timingMode}</td></tr>`).join(""),a=e.suiteError?`<div class="card" style="border-color:var(--red);margin-top:12px"><div class="card-header"><span class="card-title">SUITE ABORTED</span><span class="badge badge-fail">VALIDATION FAILURE</span></div><div style="font-size:12px;font-family:var(--mono);color:var(--red);margin-top:8px;word-break:break-all">${P(e.suiteError)}</div></div>`:"";t.innerHTML=a+`
    <h3 style="margin-top:20px">AETHER GPU PERFORMANCE</h3>
    <div class="card" style="border-color:var(--border);margin-top:4px">
      <div class="card-header">
        <span class="card-title">Timing mode</span>
        <span class="badge ${e.timingMode==="GPU_TIMESTAMP"?"badge-pass":"badge-info"}">${e.timingMode==="GPU_TIMESTAMP"?"GPU TIMESTAMP QUERIES":"END-TO-END GPU SUBMISSION TIMING"}</span>
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px">
        ${e.timingMode==="GPU_TIMESTAMP"?"Pass timestamps written by the GPU driver — the closest thing to true GPU execution time.":"Timestamp queries unavailable or unsupported; every figure is the full submit→completion round-trip and is NOT labeled GPU execution time."}
      </div>
    </div>
    <div class="card" style="border-color:var(--border);margin-top:10px">
      <div class="card-header"><span class="card-title">Environment</span></div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px;display:grid;gap:2px">
        <div>device: <b style="color:var(--text)">${P(e.device.adapterName)}</b> · ${P(e.device.adapterVendor)} ${e.device.isFallbackAdapter?"(software fallback)":""}</div>
        <div>browser: <b style="color:var(--text)">${P(e.browser.platform)}</b> · thermal state: <b style="color:var(--text)">${P(e.browser.thermalState)}</b> · GPU utilization: <b style="color:var(--text)">${P(e.browser.gpuUtilization)}</b></div>
        <div>tested ${new Date(e.timestamp).toLocaleString()} · build ${P(String(e.build.id))}</div>
      </div>
    </div>
    ${Ee("Matrix Multiply",e.tests.matmul)}
    ${Ee("Vector Add",e.tests.vecadd)}
    ${Ee("Convolution 3×3",e.tests.conv2d)}
    ${Ee("Softmax",e.tests.softmax)}
    ${Ee("RMSNorm",e.tests.rmsnorm)}
    ${Ee("Attention (single pass)",e.tests.attention)}
    ${Ko(e)}
    ${e.memory.length?`<div class="perf-block"><div class="perf-block-title">Largest safe tested tensor</div><table class="perf-table"><thead><tr><th class="th-l">requested</th><th>state</th><th>result</th><th>note</th></tr></thead><tbody>${e.memory.map(Yo).join("")}</tbody></table></div>`:""}
    ${nt("Buffer allocation vs reuse",e.bufferReuse.allocateDestroy)}
    ${nt("",e.bufferReuse.bufferReuse)}
    ${nt("Pipeline cache vs recreate",e.pipelineCache.recreate)}
    ${nt("",e.pipelineCache.cached)}
    ${e.commandBatching.length?`<div class="perf-block"><div class="perf-block-title">Command submission batching</div><table class="perf-table"><thead><tr><th class="th-l">configuration</th><th>total (8 ops)</th><th>per dispatch</th><th>mode</th></tr></thead><tbody>${n}</tbody></table></div>`:""}
    ${Qo(e.sustained)}
    <div class="perf-block">
      <div class="perf-block-title">Interpretation</div>
      <div style="font-size:12px;line-height:1.5;color:var(--text);margin-top:6px">${r.map(o=>`<div>• ${P(o)}</div>`).join("")}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Interpretation is data-driven from the samples above — no fabricated GPU utilization, thermal state or theoretical maxima.</div>
    </div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn" id="btn-export-perf">EXPORT JSON</button>
      <button class="btn btn-outline" id="btn-copy-perf">COPY RESULTS</button>
    </div>
  `,t.querySelector("#btn-export-perf")?.addEventListener("click",()=>Zo()),t.querySelector("#btn-copy-perf")?.addEventListener("click",()=>Jo())}function Zo(){if(!Qe)return;const e=JSON.stringify(Po(Qe),null,2),t=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=`aether-gpu-benchmark-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`,n.click(),URL.revokeObjectURL(r)}function Jo(){if(!Qe)return;const e=Qe,t=[];t.push(`AETHER GPU BENCHMARK — ${e.device.adapterName} (${e.device.adapterVendor})`),t.push(`timing mode: ${e.timingMode}`),t.push(`thermal: ${e.browser.thermalState} · GPU utilization: ${e.browser.gpuUtilization}`),t.push(e.suiteError?`SUITE ERROR: ${e.suiteError}`:""),t.push("");const r=(n,a)=>{t.push(n);for(const o of a)t.push(`  ${o.size} — ${re(o.medianMs)} median (${tn(o.timingMode)})${o.throughput?` · ${en(o.throughput)}`:""}`);t.push("")};r("matmul",e.tests.matmul),r("vecadd",e.tests.vecadd),r("conv2d",e.tests.conv2d),r("softmax",e.tests.softmax),r("rmsnorm",e.tests.rmsnorm),r("attention",e.tests.attention);for(const[n,a]of Object.entries(e.tests.attentionPhases))r(`attention phases ${n}`,a);e.sustained&&t.push(`sustained 30s: avg ${e.sustained.avgGflops.toFixed(2)} GFLOPS, throttled=${e.sustained.throttled}, drop=${e.sustained.dropPct.toFixed(1)}%`),navigator.clipboard?.writeText(t.join(`
`)).catch(()=>{}),M("Benchmark summary copied to clipboard.","ok")}function gt(){const e=Q?.querySelector("#btn-perf-quick"),t=Q?.querySelector("#btn-perf-full"),r=Q?.querySelector("#btn-perf-sustained"),n=Q?.querySelector("#chk-sustained");e&&(e.disabled=Y,e.textContent=Y?"QUICK BENCHMARK (LOCKED)":"QUICK BENCHMARK"),t&&(t.disabled=Y,t.textContent=Y?"FULL BENCHMARK (LOCKED)":"FULL BENCHMARK"),n&&(n.checked=Ae),r&&(r.disabled=Y||!Ae,r.textContent=Y?"SUSTAINED (LOCKED)":Ae?"SUSTAINED 30s":"SUSTAINED (ARM FIRST)")}function $t(e){if(O){M("A benchmark is already running — wait for it to finish.","warn");return}if(e==="sustained"&&!Ae){M('SUSTAINED is not armed — confirm "Enable sustained 30s run" first.',"warn");return}O=!0;try{const t=e==="quick"?"QUICK":e==="full"?"FULL":"SUSTAINED";M(`═══ AETHER GPU PERFORMANCE — ${t} BENCHMARK ═══`,"info"),Do({mode:e,onProgress:r=>M(`  ${r}...`,"info"),onSecond:(r,n)=>M(`  ${n}`,"info")}).then(r=>{Qe=r,Xo(r),M(r.suiteError?`SUITE ABORTED: ${r.suiteError}`:`${t} benchmark complete — mode: ${r.timingMode}`,r.suiteError?"err":"ok"),r.suiteError&&M("STOP — a validated kernel failed. Fix correctness before benchmarking.","err")}).catch(r=>M(`ERROR: ${r.message}`,"err")).finally(()=>{O=!1})}catch(t){O=!1,M(`ERROR: ${t.message}`,"err")}}function es(e){const t=e.querySelector("#perf-panel");t&&(t.innerHTML=`
    <div class="card" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER GPU PERFORMANCE</span>
        <span class="badge ${Y?"badge-fail":"badge-pass"}">${Y?"LOCKED":"UNLOCKED"}</span>
      </div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:6px">
        ${Y?"Run GPU SANITY → STANDALONE MATMUL → HARNESS MATMUL → CORRECTNESS (all six kernels pass) to unlock. Timing comes from GPU timestamp queries where the device supports them, otherwise honest END-TO-END GPU submission timing. Sustained (30s) stays disabled until you arm it below.":"Timing uses GPU timestamp queries where supported, otherwise honest END-TO-END GPU submission timing (never labeled GPU execution time). Sustained (30s) stays disabled until you arm it below."}
      </div>
      <div class="btn-row" style="margin-top:10px;flex-wrap:wrap">
        <button class="btn" id="btn-perf-quick">QUICK BENCHMARK</button>
        <button class="btn btn-outline" id="btn-perf-full">FULL BENCHMARK</button>
        <button class="btn btn-outline" id="btn-perf-sustained">SUSTAINED (ARM FIRST)</button>
      </div>
      <label style="display:flex;align-items:center;gap:6px;margin-top:10px;font-size:12px;color:var(--text-dim)">
        <input type="checkbox" id="chk-sustained" ${Ae?"checked":""}>
        enable SUSTAINED 30s run (continuous MatMul load, per-second samples, thermal before/after)
      </label>
    </div>
    <div id="perf-results"></div>
  `,e.querySelector("#btn-perf-quick")?.addEventListener("click",()=>$t("quick")),e.querySelector("#btn-perf-full")?.addEventListener("click",()=>$t("full")),e.querySelector("#btn-perf-sustained")?.addEventListener("click",()=>$t("sustained")),e.querySelector("#chk-sustained")?.addEventListener("change",r=>{Ae=r.target.checked;try{localStorage.setItem("aether.sustained.armed",Ae?"1":"0")}catch{}gt()}),gt())}function ts(e){const t=e.querySelector("#diag-panel");if(!t)return;const r=[["location.href",location.href],["location.hash",location.hash],["location.protocol",location.protocol],["window.isSecureContext",String(window.isSecureContext)],["navigator.userAgent",navigator.userAgent],["AETHER_BUILD_ID",Re],["Built at",Ye||"n/a"],["Benchmark code revision",Re]];t.innerHTML=r.map(([n,a])=>`<div style="font-size:11px;font-family:var(--mono);word-break:break-all">
        <span style="color:var(--text-dim)">${n}:</span> <b style="color:var(--text)">${a}</b>
      </div>`).join("")}function rs(e){Q=e,_t=!1,e.innerHTML=`
    <h2>GPU Compute Benchmark — Isolated Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Three independent checks — GPU SANITY and STANDALONE MATMUL each request their own GPU device; SHARED-DEVICE DIRECT MATMUL and HARNESS MATMUL share the AETHER engine device. Kick the performance gates (GPU SANITY → STANDALONE MATMUL → SHARED-DEVICE DIRECT MATMUL → HARNESS MATMUL → CORRECTNESS) to unlock the GPU performance benchmarks below.
    </p>

    <div class="card" style="border-color:var(--border)">
      <div class="card-header">
        <span class="card-title">Device Info</span>
        <span class="badge badge-info" id="device-badge">NOT INITIALIZED</span>
      </div>
      <div id="device-info" style="font-size:12px;color:var(--text-dim);margin-top:8px"></div>
    </div>

    <div class="card" style="border-color:var(--border);margin-top:12px">
      <div class="card-header">
        <span class="card-title">Runtime Source Verification</span>
      </div>
      <div id="diag-panel" style="margin-top:8px"></div>
    </div>

    <div class="btn-row" style="margin-top:16px">
      <button class="btn" id="btn-sanity">GPU SANITY</button>
      <button class="btn btn-outline" id="btn-standalone">STANDALONE MATMUL</button>
      <button class="btn btn-outline" id="btn-direct">SHARED-DEVICE DIRECT MATMUL</button>
      <button class="btn btn-outline" id="btn-harness">HARNESS MATMUL</button>
      <button class="btn btn-outline" id="btn-correctness">CORRECTNESS (LOCKED)</button>
    </div>

    <div id="res-sanity"></div>
    <div id="res-standalone"></div>
    <div id="res-direct"></div>
    <div id="res-harness"></div>

    <div id="validation-panel"></div>
    <div id="report-panel"></div>
    <div id="perf-panel"></div>

    <div class="log" id="bench-log"></div>

    <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;font-family:var(--mono);color:var(--text-dim)">
      <div>AETHER BUILD: <b id="build-id" style="color:var(--text)">${Re}</b></div>
      <div>Git commit: <b id="build-commit" style="color:var(--text)">${ft??"unavailable"}</b></div>
      <div>Build time: <b id="build-time" style="color:var(--text)">${Ye||"unavailable"}</b></div>
      <div>Environment: GitHub Pages</div>
    </div>
  `,ts(e),e.querySelector("#btn-sanity")?.addEventListener("click",Io),e.querySelector("#btn-standalone")?.addEventListener("click",zo),e.querySelector("#btn-direct")?.addEventListener("click",Wo),e.querySelector("#btn-harness")?.addEventListener("click",qo);const t=e.querySelector("#btn-correctness");t&&(t.addEventListener("click",Ho),t.disabled=!mt(),t.textContent=mt()?"CORRECTNESS":"CORRECTNESS (LOCKED)"),es(e);const r=n=>{n.preventDefault()};window.addEventListener("error",r),window.addEventListener("unhandledrejection",r),Ne().then(n=>{fe=n,wt();const a=e.querySelector("#device-badge"),o=e.querySelector("#device-info");a&&(a.textContent="WEBGPU READY",a.className="badge badge-pass"),o&&(o.innerHTML=`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
          <span>Adapter:</span><span style="color:var(--text)">${n.adapterName}</span>
          <span>Vendor:</span><span style="color:var(--text)">${n.adapterVendor}</span>
          <span>Features:</span><span style="color:var(--text)">${n.adapterFeatures.length}</span>
          <span>Max Buffer:</span><span style="color:var(--text)">${Sr(n.maxBufferSize)}</span>
          <span>Max Storage:</span><span style="color:var(--text)">${Sr(n.maxStorageBufferBindingSize)}</span>
          <span>Workgroup X:</span><span style="color:var(--text)">${n.maxComputeWorkgroupSizeX}</span>
          <span>Invocations/wg:</span><span style="color:var(--text)">${n.maxComputeInvocationsPerWorkgroup}</span>
          <span>Timestamp Query:</span><span style="color:var(--text)">${n.timestampQuerySupport?"YES":"NO"}</span>
          <span>Preferred Format:</span><span style="color:var(--text)">${n.preferredCanvasFormat??"N/A"}</span>
          <span>Fallback:</span><span style="color:var(--text)">${n.isFallbackAdapter?"YES (software)":"NO (hardware)"}</span>
        </div>
      `)}).catch(n=>{const a=e.querySelector("#device-badge");a&&(a.textContent="WEBGPU UNAVAILABLE",a.className="badge badge-fail"),M(`WEBGPU not available: ${n.message}`,"err")})}const ns=Object.freeze(Object.defineProperty({__proto__:null,render:rs},Symbol.toStringTag,{value:"Module"}));function as(e){const t=e.toLowerCase();return t.includes("aether")||t==="external-cache"||t.startsWith("workbox-")||t.includes("webgpu")}async function rn(){if("serviceWorker"in navigator)try{const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(t=>t.unregister().catch(()=>{})))}catch{}}async function nn(){if("caches"in window)try{const e=await caches.keys();await Promise.all(e.filter(as).map(t=>caches.delete(t).catch(()=>{})))}catch{}}async function os(){try{const e=[],t=indexedDB;if(t.databases){const r=await t.databases();for(const n of r)n.name&&n.name.toLowerCase().includes("aether")&&e.push(n.name)}else e.push("aether-gpu-benchmark");for(const r of e)await new Promise(n=>{const a=indexedDB.deleteDatabase(r);a.onsuccess=()=>n(),a.onerror=()=>n(),a.onblocked=()=>n()})}catch{}}async function ss(){await rn(),await nn()}async function is(){await rn(),await nn(),await os()}const zt=[{id:"gpubench",label:"GPU Bench",module:ns},{id:"device",label:"Device Test",module:dn},{id:"webgpudiag",label:"WebGPU Diag",module:ua},{id:"model",label:"Model Test",module:xn},{id:"tensor",label:"Tensor Bench",module:oa},{id:"image",label:"Image Test",module:Mn},{id:"video",label:"Video Test",module:$n},{id:"diag",label:"Diagnostics",module:Tn}];let an="gpubench";function Mr(){const e=window.location.hash.replace("#","");return zt.some(t=>t.id===e)?e:e==="diagnostics/webgpu"||e==="webgpu"?"webgpudiag":"gpubench"}function Ct(e){an=e,window.location.hash=e;const t=document.getElementById("nav"),r=document.getElementById("screen");t.querySelectorAll("button").forEach(a=>{a.classList.toggle("active",a.dataset.screen===e)});const n=zt.find(a=>a.id===e);n&&n.module.render(r)}function us(){const e=document.getElementById("app");e.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const t=document.getElementById("nav");document.getElementById("screen"),zt.forEach(n=>{const a=document.createElement("button");a.textContent=n.label,a.dataset.screen=n.id,a.addEventListener("click",()=>Ct(n.id)),t.appendChild(a)});const r=Mr();Ct(r),window.addEventListener("hashchange",()=>{const n=Mr();n!==an&&Ct(n)})}function cs(){const e=document.getElementById("app");e.innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;text-align:center;gap:16px;padding:24px">
      <h2 style="color:var(--green, #22c55e);margin:0">AETHER CACHE RESET COMPLETE</h2>
      <p style="color:var(--text-dim, #9ca3af);margin:0">Please reload AETHER normally.</p>
      <button id="btn-reset-reload" class="btn">Reload AETHER</button>
    </div>
  `,e.querySelector("#btn-reset-reload")?.addEventListener("click",()=>{history.replaceState(null,"",window.location.pathname+window.location.search),window.location.reload()})}async function Er(){if(window.location.hash==="#reset"){await is(),cs();return}await ss(),us()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>void Er()):Er();
