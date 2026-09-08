(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function r(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=r(n);fetch(n.href,a)}})();function ss(e){let t="Unknown",r="Unknown",s="Unknown",n="Unknown";const a=e.match(/OS (\d+)_(\d+)/);a&&(s="iOS",n=`${a[1]}.${a[2]}`);const o=e.match(/Mac OS X (\d+)[_.](\d+)/);if(o&&(s="macOS",n=`${o[1]}.${o[2]}`),e.includes("Windows")){s="Windows";const u=e.match(/Windows NT (\d+\.\d+)/);u&&(n=u[1])}if(e.includes("Android")){s="Android";const u=e.match(/Android (\d+[\.\d]*)/);u&&(n=u[1])}if(e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")){t="Safari";const u=e.match(/Version\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Chrome")&&!e.includes("Edg")){t="Chrome";const u=e.match(/Chrome\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Edg/")){t="Edge";const u=e.match(/Edg\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Firefox")){t="Firefox";const u=e.match(/Firefox\/(\d+[\.\d]*)/);u&&(r=u[1])}return{browserName:t,browserVersion:r,osName:s,osVersion:n}}function as(e){return!!(e.includes("FBAN")||e.includes("FBIOS")||e.includes("Twitter")||e.includes("Instagram")||e.includes("Line/")||e.includes("WeChat")||e.includes("MicroMessenger")||e.includes("CocoaPods")||e.includes("wv)")||e.includes("Electron")||e.includes("; wv)"))}function os(e){return e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")}async function It(){const e=navigator.userAgent,t=ss(e),r=t.osName==="iOS",s=os(e),n=as(e),a=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,o={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:e,platform:navigator.platform,isIOS:r,isSafari:s,isWebView:n,isStandalone:a,browserName:t.browserName,browserVersion:t.browserVersion,osName:t.osName,osVersion:t.osVersion},i={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(n)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:o,gpu:i};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:r?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:o,gpu:i};if(!navigator.gpu){let u="navigator.gpu is undefined. WebGPU API is not exposed.",c="";if(r){if(parseInt(t.osVersion.split(".")[0],10)<26)return u=`iOS ${t.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,c="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:o,gpu:i};if(t.browserName!=="Safari")return u=`Running ${t.browserName} on iOS ${t.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,c="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:u,recommendation:c,environment:o,gpu:i}}return t.osName==="macOS"&&parseInt(t.osVersion.split(".")[0],10)<14?(u=`macOS ${t.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,c="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:o,gpu:i}):(c="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:o,gpu:i})}try{const u=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!u){i.adapterError="requestAdapter() returned null";let d="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",m="";return r?parseInt(t.osVersion.split(".")[0],10)>=26&&(d=`iOS ${t.osVersion} with Safari ${t.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,m="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(d="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",m="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):m="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:d,recommendation:m,environment:o,gpu:i}}i.adapterName=u.name??"Unknown GPU",i.adapterVendor=u.vendor??"Unknown",i.adapterDevice=u.device??"Unknown",i.isFallbackAdapter=u.isFallbackAdapter??!1;const c=[];for(const d of u.features)c.push(d.replace(/-/g," ").replace(/\b\w/g,m=>m.toUpperCase()));i.features=c;const l=u.limits;i.limits={maxBufferSize:l.maxBufferSize,maxTextureDimension1D:l.maxTextureDimension1D,maxTextureDimension2D:l.maxTextureDimension2D,maxTextureDimension3D:l.maxTextureDimension3D,maxComputeWorkgroupStorageSize:l.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:l.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:l.maxStorageBufferBindingSize,maxUniformBufferBindingSize:l.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:l.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:l.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:l.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:l.maxComputeWorkgroupsPerDimension,maxColorAttachments:l.maxColorAttachments,minStorageBufferOffsetAlignment:l.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:l.minUniformBufferOffsetAlignment};try{(await u.requestDevice({requiredLimits:{}})).destroy()}catch(d){return i.deviceError=d.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${i.adapterName}) but requestDevice() failed: ${d.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:o,gpu:i}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${i.adapterName}.`,recommendation:"No action needed.",environment:o,gpu:i}}catch(u){return i.adapterError=u.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${u.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:o,gpu:i}}}function hn(e){const t=[];if(t.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),t.push(""),t.push(`STATUS: ${e.statusLabel}`),t.push(`CASE: ${e.case}`),t.push(`REASON: ${e.reason}`),t.push(`RECOMMENDATION: ${e.recommendation}`),t.push(""),t.push("── ENVIRONMENT ──"),t.push(`  URL: ${e.environment.url}`),t.push(`  Protocol: ${e.environment.protocol}`),t.push(`  Hostname: ${e.environment.hostname}`),t.push(`  Secure Context: ${e.environment.isSecureContext}`),t.push(`  iOS: ${e.environment.isIOS}`),t.push(`  Safari: ${e.environment.isSafari}`),t.push(`  WebView: ${e.environment.isWebView}`),t.push(`  Standalone PWA: ${e.environment.isStandalone}`),t.push(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`),t.push(`  OS: ${e.environment.osName} ${e.environment.osVersion}`),t.push(`  Platform: ${e.environment.platform}`),t.push(`  User Agent: ${e.environment.userAgent}`),t.push(""),t.push("── WEBGPU ──"),t.push(`  navigator.gpu exists: ${e.gpu.navigatorGpuExists}`),e.gpu.adapterName&&t.push(`  Adapter: ${e.gpu.adapterName}`),e.gpu.adapterVendor&&t.push(`  Vendor: ${e.gpu.adapterVendor}`),e.gpu.adapterDevice&&t.push(`  Device: ${e.gpu.adapterDevice}`),e.gpu.adapterError&&t.push(`  Adapter Error: ${e.gpu.adapterError}`),e.gpu.deviceError&&t.push(`  Device Error: ${e.gpu.deviceError}`),t.push(`  Fallback adapter: ${e.gpu.isFallbackAdapter}`),e.gpu.features.length>0){t.push(`  Features (${e.gpu.features.length}):`);for(const r of e.gpu.features)t.push(`    ${r}`)}if(e.gpu.limits){t.push("  Limits:");for(const[r,s]of Object.entries(e.gpu.limits))t.push(`    ${r}: ${typeof s=="number"?s.toLocaleString():s}`)}return t.push(""),t.push(`Timestamp: ${new Date().toISOString()}`),t.join(`
`)}function yt(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function Re(){const e=await It();if(!e.ready||!e.gpu.adapterName)return null;const t=e.gpu.limits;return{available:!0,adapterName:e.gpu.adapterName,adapterVendor:e.gpu.adapterVendor,adapterDevice:e.gpu.adapterDevice,features:e.gpu.features,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:e.gpu.isFallbackAdapter,featuresMap:new Set(e.gpu.features),diagnostic:e}}async function De(e,t=[]){const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("Failed to re-acquire GPU adapter");const s=await r.requestDevice({requiredFeatures:t.filter(n=>e.featuresMap.has(n)),requiredLimits:{}});return s.lost.then(n=>{console.error("WebGPU device lost:",n.message)}),s}function is(e){const t=e.environment,r=e.gpu;let s="badge-fail";e.case==="D"?s="badge-pass":(e.case==="B"||e.case==="C")&&(s="badge-warn");let n=`
    <div class="card" style="border-color:${e.ready?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)"}">
      <div class="card-header">
        <span class="card-title" style="font-size:18px">${e.statusLabel}</span>
        <span class="badge ${s}">CASE ${e.case}</span>
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
  `;return r.adapterName&&(n+=`
      <h3>GPU Adapter</h3>
      <div class="card">
        <div class="row"><span class="row-label">Name</span><span class="row-value">${r.adapterName}</span></div>
        <div class="row"><span class="row-label">Vendor</span><span class="row-value">${r.adapterVendor||"Unknown"}</span></div>
        <div class="row"><span class="row-label">Device</span><span class="row-value">${r.adapterDevice||"Unknown"}</span></div>
        <div class="row"><span class="row-label">Fallback</span><span class="row-value">${r.isFallbackAdapter?"Yes (software)":"No (hardware)"}</span></div>
      </div>
    `),r.adapterError&&(n+=`
      <h3>Adapter Error</h3>
      <div class="card" style="border-color:var(--red)">
        <p style="font-size:13px;color:var(--red)">${r.adapterError}</p>
      </div>
    `),r.deviceError&&(n+=`
      <h3>Device Error</h3>
      <div class="card" style="border-color:var(--red)">
        <p style="font-size:13px;color:var(--red)">${r.deviceError}</p>
      </div>
    `),r.limits&&(n+=`
      <h3>GPU Limits</h3>
      <div class="card">
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${yt(r.limits.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${r.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${r.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${r.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${yt(r.limits.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${yt(r.limits.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${yt(r.limits.maxComputeWorkgroupStorageSize)}</span></div>
        <div class="row"><span class="row-label">Max invocations/wg</span><span class="row-value">${r.limits.maxComputeInvocationsPerWorkgroup}</span></div>
        <div class="row"><span class="row-label">Max workgroup size</span><span class="row-value">${r.limits.maxComputeWorkgroupSizeX}×${r.limits.maxComputeWorkgroupSizeY}×${r.limits.maxComputeWorkgroupSizeZ}</span></div>
        <div class="row"><span class="row-label">Max workgroups/dim</span><span class="row-value">${r.limits.maxComputeWorkgroupsPerDimension}</span></div>
        <div class="row"><span class="row-label">Max color attachments</span><span class="row-value">${r.limits.maxColorAttachments}</span></div>
        <div class="row"><span class="row-label">Storage buf alignment</span><span class="row-value">${r.limits.minStorageBufferOffsetAlignment} B</span></div>
        <div class="row"><span class="row-label">Uniform buf alignment</span><span class="row-value">${r.limits.minUniformBufferOffsetAlignment} B</span></div>
      </div>
    `),r.features.length>0&&(n+=`
      <h3>Features (${r.features.length})</h3>
      <div class="card">
        ${r.features.map(a=>`<div class="row"><span class="row-value">${a}</span></div>`).join("")}
      </div>
    `),n}function us(e){e.innerHTML=`
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;const t=e.querySelector("#device-status"),r=e.querySelector("#device-info");It().then(s=>{s.ready?t.innerHTML=`
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `:t.innerHTML="",r.innerHTML=is(s)})}const cs=Object.freeze(Object.defineProperty({__proto__:null,render:us},Symbol.toStringTag,{value:"Module"}));let O=class yn{buffer;shape;dtype;size;device;constructor(t,r,s="f32"){this.device=t,this.shape=[...r],this.dtype=s,this.size=r.reduce((o,i)=>o*i,1);const n=s==="f32"?4:s==="f16"?2:4;this.buffer=t.createBuffer({size:this.size*n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(s==="f32"?new Float32Array(this.buffer.getMappedRange()):s==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(t,r,s){const n=new yn(t,s,r instanceof Float32Array?"f32":"i32");return t.queue.writeBuffer(n.buffer,0,r.buffer),n}async readback(){const t=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r=this.device.createCommandEncoder();r.copyBufferToBuffer(this.buffer,0,t,0,this.buffer.size),this.device.queue.submit([r.finish()]),await t.mapAsync(GPUMapMode.READ);const s=new Float32Array(t.getMappedRange().slice(0));return t.unmap(),t.destroy(),s}destroy(){this.buffer.destroy()}};async function st(e,t,r=50,s){const n=[];for(let c=0;c<Math.min(5,r);c++)await t();for(let c=0;c<r;c++){const l=performance.now();await t(),await vn?.queue.onSubmittedWorkDone();const d=performance.now();n.push(d-l)}n.sort((c,l)=>c-l);const a=n.reduce((c,l)=>c+l,0)/n.length,o=n[0],i=n[n.length-1],u={name:e,avgMs:a,minMs:o,maxMs:i,iterations:r};if(s){const l=s/(a/1e3)/1e9;u.gflops=l,u.throughput=`${l.toFixed(2)} GFLOPS`}return u}let vn=null;function Oe(e){vn=e}function at(e){const t=[`${e.name}: ${e.avgMs.toFixed(2)} ms avg`,`(${e.minMs.toFixed(2)} – ${e.maxMs.toFixed(2)} ms)`,`[${e.iterations} iterations]`];return e.throughput&&t.push(e.throughput),t.join(" ")}const Pt=`
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
`,ls=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= uniforms.N) { return; }
  data[i] = max(data[i], 0.0);
}
`,ds=`
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
`,fs=`
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
`,ps=`
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
`,ms=`
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
`;let w=null,Ge=null;function D(e,t=""){if(!Ge)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Ge.appendChild(r),Ge.scrollTop=Ge.scrollHeight}async function Tr(){D("═══ TINY NEURAL NETWORK TEST ═══","info"),D("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),D("");const e=await Re();if(!e)return D("WebGPU not available","err"),!1;w=await De(e),Oe(w);const t=performance.now(),r=O.fromData(w,new Float32Array([1,.5,-.3,.8]),[4]),s=O.fromData(w,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),n=O.fromData(w,new Float32Array([.1,-.1,.2]),[3]),a=new ArrayBuffer(12),o=new Uint32Array(a);o[0]=1,o[1]=3,o[2]=4;const i=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:w.createShaderModule({code:Pt}),entryPoint:"main"}}),c=w.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(c,0,a);const l=new O(w,[1,3]),d=w.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:l.buffer}}]});let m=w.createCommandEncoder(),f=m.beginComputePass();f.setPipeline(u),f.setBindGroup(0,d),f.dispatchWorkgroups(1,1,1),f.end(),w.queue.submit([m.finish()]),D(`  input[4]:  [${Array.from(await r.readback()).map(G=>G.toFixed(2)).join(", ")}]`,""),D("  W1[4×3]:   4 rows × 3 cols",""),D("  Matmul result: computing...","");const p=await l.readback();D(`  h1 = input @ W1: [${Array.from(p).map(G=>G.toFixed(3)).join(", ")}]`,"ok");for(let G=0;G<3;G++)p[G]+=[.1,-.1,.2][G];w.queue.writeBuffer(l.buffer,0,p.buffer),D(`  h1 + bias:       [${Array.from(p).map(G=>G.toFixed(3)).join(", ")}]`,"ok");const g=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),h=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[g]}),compute:{module:w.createShaderModule({code:ls}),entryPoint:"main"}}),b=new ArrayBuffer(4);new Uint32Array(b)[0]=3;const v=w.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(v,0,b);const y=w.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:l.buffer}}]});m=w.createCommandEncoder(),f=m.beginComputePass(),f.setPipeline(h),f.setBindGroup(0,y),f.dispatchWorkgroups(1,1,1),f.end(),w.queue.submit([m.finish()]);const S=await l.readback();D(`  ReLU(h1):         [${Array.from(S).map(G=>G.toFixed(3)).join(", ")}]`,"ok");const $=O.fromData(w,new Float32Array([.7,-.3,.5]),[3,1]),A=new O(w,[1,1]),R=new ArrayBuffer(12),L=new Uint32Array(R);L[0]=1,L[1]=1,L[2]=3;const F=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),j=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[F]}),compute:{module:w.createShaderModule({code:Pt}),entryPoint:"main"}}),ie=w.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(ie,0,R);const ee=w.createBindGroup({layout:F,entries:[{binding:0,resource:{buffer:ie}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:$.buffer}},{binding:3,resource:{buffer:A.buffer}}]});m=w.createCommandEncoder(),f=m.beginComputePass(),f.setPipeline(j),f.setBindGroup(0,ee),f.dispatchWorkgroups(1,1,1),f.end(),w.queue.submit([m.finish()]);const te=await A.readback(),X=(performance.now()-t).toFixed(1);return D(`  Final output: ${te[0].toFixed(4)}`,"ok"),D(`  Total pipeline: ${X} ms`,"ok"),D("",""),D("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),r.destroy(),s.destroy(),n.destroy(),l.destroy(),$.destroy(),A.destroy(),c.destroy(),ie.destroy(),v.destroy(),w.destroy(),!0}async function gs(){D("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const e=await Re();if(!e)return null;w=await De(e),Oe(w);const t=[64,128,256,512],r=[];for(const s of t){const n=O.fromData(w,new Float32Array(s*s).fill(1),[s,s]),a=O.fromData(w,new Float32Array(s*s).fill(.5),[s,s]),o=new O(w,[s,s]),i=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:w.createShaderModule({code:Pt}),entryPoint:"main"}}),c=new ArrayBuffer(12),l=new Uint32Array(c);l[0]=s,l[1]=s,l[2]=s;const d=await st(`${s}×${s} matmul`,async()=>{const m=w.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(m,0,c);const f=w.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:a.buffer}},{binding:3,resource:{buffer:o.buffer}}]}),p=w.createCommandEncoder(),g=p.beginComputePass();g.setPipeline(u),g.setBindGroup(0,f);const h=Math.ceil(s/16);g.dispatchWorkgroups(h,h,1),g.end(),w.queue.submit([p.finish()]),m.destroy()},30,2*s*s*s);r.push(d),D(at(d),"ok"),n.destroy(),a.destroy(),o.destroy()}return w.destroy(),r[r.length-1]}async function bs(){D("═══ CONVOLUTION BENCHMARK ═══","info");const e=await Re();if(!e)return null;w=await De(e),Oe(w);const t=1,r=3,s=32,n=32,a=8,o=3,i=3,u=s-o+1,c=n-i+1,l=O.fromData(w,new Float32Array(t*r*s*n).fill(.5),[t,r,s,n]),d=O.fromData(w,new Float32Array(a*r*o*i).fill(.1),[a,r,o,i]),m=new O(w,[t,a,u,c]),f=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),p=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[f]}),compute:{module:w.createShaderModule({code:ds}),entryPoint:"main"}}),g=new ArrayBuffer(36),h=new Uint32Array(g);h[0]=t,h[1]=r,h[2]=s,h[3]=n,h[4]=a,h[5]=o,h[6]=i,h[7]=u,h[8]=c;const b=await st(`Conv2D ${t}×${r}×${s}×${n} k=${o}→${a}×${u}×${c}`,async()=>{const v=w.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(v,0,g);const y=w.createBindGroup({layout:f,entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:d.buffer}},{binding:3,resource:{buffer:m.buffer}}]}),S=w.createCommandEncoder(),$=S.beginComputePass();$.setPipeline(p),$.setBindGroup(0,y),$.dispatchWorkgroups(t,a,1),$.end(),w.queue.submit([S.finish()]),v.destroy()},20,2*t*a*r*o*i*u*c);return D(at(b),"ok"),l.destroy(),d.destroy(),m.destroy(),w.destroy(),b}async function hs(){D("═══ ATTENTION BENCHMARK ═══","info");const e=await Re();if(!e)return null;w=await De(e),Oe(w);const t=1,r=64,s=64,n=1/Math.sqrt(s),a=O.fromData(w,new Float32Array(t*r*s).fill(.1),[t,r,s]),o=O.fromData(w,new Float32Array(t*r*s).fill(.1),[t,r,s]),i=O.fromData(w,new Float32Array(t*r*s).fill(.1),[t,r,s]),u=new O(w,[t,r,s]),c=new O(w,[t,r,r]),l=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),d=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[l]}),compute:{module:w.createShaderModule({code:fs}),entryPoint:"main"}}),m=new ArrayBuffer(16),f=new Uint32Array(m),p=new Float32Array(m);f[0]=t,f[1]=r,f[2]=s,p[3]=n;const g=await st(`Attention b=${t} s=${r} d=${s}`,async()=>{const h=w.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(h,0,m);const b=w.createBindGroup({layout:l,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:i.buffer}},{binding:4,resource:{buffer:u.buffer}},{binding:5,resource:{buffer:c.buffer}}]}),v=w.createCommandEncoder(),y=v.beginComputePass();y.setPipeline(d),y.setBindGroup(0,b),y.dispatchWorkgroups(t,1,1),y.end(),w.queue.submit([v.finish()]),h.destroy()},20);return D(at(g),"ok"),a.destroy(),o.destroy(),i.destroy(),u.destroy(),c.destroy(),w.destroy(),g}function ys(e){e.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,Ge=e.querySelector("#model-log"),e.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{Ge.innerHTML="",await Tr()}),e.querySelector("#btn-all-bench").addEventListener("click",async()=>{Ge.innerHTML="",await Tr(),D("",""),await gs(),D("",""),await bs(),D("",""),await hs(),D("",""),D("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const vs=Object.freeze(Object.defineProperty({__proto__:null,render:ys},Symbol.toStringTag,{value:"Module"}));let U=null,ke=null;function le(e,t=""){if(!ke)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,ke.appendChild(r),ke.scrollTop=ke.scrollHeight}function wn(e,t){const r=new Float32Array(e*t*4);for(let s=0;s<t;s++)for(let n=0;n<e;n++){const a=(s*e+n)*4,o=(n>>4)+(s>>4)&1;r[a+0]=o?.9:n/e*.8,r[a+1]=o?.3:s/t*.6,r[a+2]=o?.6:.4,r[a+3]=1}return r}function ar(e,t,r){const s=document.createElement("canvas");s.width=t,s.height=r;const n=s.getContext("2d"),a=n.createImageData(t,r);for(let o=0;o<t*r*4;o++)a.data[o]=Math.round(e[o]*255);return n.putImageData(a,0,0),s}async function Br(){le("═══ GRAYSCALE TEST ═══","info");const e=await Re();if(!e){le("WebGPU unavailable","err");return}U=await De(e),Oe(U);const t=256,r=256,s=wn(t,r),n=O.fromData(U,s,[t*r*4]),a=new O(U,[t*r*4]),o=U.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=U.createComputePipeline({layout:U.createPipelineLayout({bindGroupLayouts:[o]}),compute:{module:U.createShaderModule({code:ms}),entryPoint:"main"}}),u=new ArrayBuffer(4);new Uint32Array(u)[0]=t*r;const c=await st("Grayscale 256×256",async()=>{const p=U.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});U.queue.writeBuffer(p,0,u);const g=U.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:a.buffer}}]}),h=U.createCommandEncoder(),b=h.beginComputePass();b.setPipeline(i),b.setBindGroup(0,g),b.dispatchWorkgroups(Math.ceil(t*r/256),1,1),b.end(),U.queue.submit([h.finish()]),p.destroy()},50);le(at(c),"ok");const l=await a.readback(),d=ar(s,t,r),m=ar(l,t,r),f=gr?.querySelector("#image-display");if(f){f.innerHTML="";const p=document.createElement("div");p.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const g=document.createElement("div");g.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',g.appendChild(d);const h=document.createElement("div");h.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',h.appendChild(m),p.appendChild(g),p.appendChild(h),f.appendChild(p)}n.destroy(),a.destroy(),U.destroy(),le("✓ Grayscale complete","ok")}async function Ur(){le("═══ CONVOLUTION KERNEL TEST ═══","info");const e=await Re();if(!e){le("WebGPU unavailable","err");return}U=await De(e),Oe(U);const t=128,r=128,s=3,n=wn(t,r),a={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},o=U.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=U.createComputePipeline({layout:U.createPipelineLayout({bindGroupLayouts:[o]}),compute:{module:U.createShaderModule({code:ps}),entryPoint:"main"}}),u=new ArrayBuffer(16),c=new Uint32Array(u);c[0]=t,c[1]=r,c[2]=s,c[3]=0;for(const[l,d]of Object.entries(a)){const m=O.fromData(U,n,[t*r*4]),f=O.fromData(U,d,[s*s]),p=new O(U,[t*r*4]),g=await st(`Conv ${l} ${t}×${r}`,async()=>{const v=U.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});U.queue.writeBuffer(v,0,u);const y=U.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:f.buffer}},{binding:2,resource:{buffer:m.buffer}},{binding:3,resource:{buffer:p.buffer}}]}),S=U.createCommandEncoder(),$=S.beginComputePass();$.setPipeline(i),$.setBindGroup(0,y),$.dispatchWorkgroups(Math.ceil(t/16),Math.ceil(r/16),1),$.end(),U.queue.submit([S.finish()]),v.destroy()},30);le(at(g),"ok");const h=await p.readback(),b=gr?.querySelector("#image-display");if(b){const v=ar(h,t,r),y=document.createElement("div");y.style.cssText="display:inline-block;margin:4px",y.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${l}</div>`,y.appendChild(v),b.appendChild(y)}m.destroy(),f.destroy(),p.destroy()}U.destroy(),le("✓ All convolution kernels applied","ok")}let gr=null;function ws(e){gr=e,e.innerHTML=`
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
  `,ke=e.querySelector("#image-log"),e.querySelector("#btn-grayscale").addEventListener("click",async()=>{ke.innerHTML="",e.querySelector("#image-display").innerHTML="",await Br()}),e.querySelector("#btn-conv").addEventListener("click",async()=>{ke.innerHTML="",e.querySelector("#image-display").innerHTML="",await Ur()}),e.querySelector("#btn-all-img").addEventListener("click",async()=>{ke.innerHTML="",e.querySelector("#image-display").innerHTML="",await Br(),le("",""),await Ur(),le("",""),le("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const xs=Object.freeze(Object.defineProperty({__proto__:null,render:ws},Symbol.toStringTag,{value:"Module"}));let Y=null,ct=null,St=null;function or(e,t=""){if(!ct)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,ct.appendChild(r),ct.scrollTop=ct.scrollHeight}const Ss=`
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
`;let ir=0,$t=0;async function $s(e,t,r,s,n){const a=await Re();if(!a){or("WebGPU unavailable","err");return}Y=await De(a),Oe(Y);const[o,i]=s.value.split("x").map(Number);e.width=o,e.height=i,ir=parseInt(n.value);const u=Y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=Y.createComputePipeline({layout:Y.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:Y.createShaderModule({code:Ss}),entryPoint:"main"}}),l=Y.createBuffer({size:o*i*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),d=e.getContext("2d"),m=Y.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let f=performance.now(),p=0,g=0;t.textContent="RENDERING",t.className="badge badge-pass";function h(){const b=new ArrayBuffer(16),v=new Uint32Array(b);v[0]=o,v[1]=i,v[2]=$t,v[3]=ir,Y.queue.writeBuffer(m,0,b);const y=Y.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:l}}]}),S=Y.createCommandEncoder(),$=S.beginComputePass();$.setPipeline(c),$.setBindGroup(0,y),$.dispatchWorkgroups(Math.ceil(o/16),Math.ceil(i/16),1),$.end();const A=Y.createBuffer({size:o*i*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});S.copyBufferToBuffer(l,0,A,0,o*i*4*4),Y.queue.submit([S.finish()]),A.mapAsync(GPUMapMode.READ).then(()=>{const R=new Float32Array(A.getMappedRange().slice(0));A.unmap(),A.destroy();const L=d.createImageData(o,i);for(let j=0;j<o*i*4;j++)L.data[j]=Math.round(R[j]*255);d.putImageData(L,0,0),$t++,g++;const F=performance.now();F-f>=1e3&&(p=Math.round(g*1e3/(F-f)),r.textContent=`${p} FPS | Frame ${$t} | ${o}×${i}`,g=0,f=F),St=requestAnimationFrame(h)})}h()}function Rr(){St!==null&&(cancelAnimationFrame(St),St=null),Y&&(Y.destroy(),Y=null)}function Es(e){e.innerHTML=`
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
  `,ct=e.querySelector("#video-log");const t=e.querySelector("#video-canvas"),r=e.querySelector("#video-status"),s=e.querySelector("#video-fps"),n=e.querySelector("#res-select"),a=e.querySelector("#mode-select");e.querySelector("#btn-start").addEventListener("click",()=>{Rr(),$t=0,ir=parseInt(a.value),or(`Starting GPU compute video: ${n.value} mode=${a.value}`,"info"),$s(t,r,s,n,a)}),e.querySelector("#btn-stop").addEventListener("click",()=>{Rr(),r.textContent="STOPPED",r.className="badge badge-info",or("Rendering stopped","warn")})}const Ms=Object.freeze(Object.defineProperty({__proto__:null,render:Es},Symbol.toStringTag,{value:"Module"}));let Qe=null;function T(e,t=""){if(!Qe)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Qe.appendChild(r),Qe.scrollTop=Qe.scrollHeight}async function As(){if(Qe.innerHTML="",T("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),T(`Timestamp: ${new Date().toISOString()}`,""),!await Ps())return;const t=await Re();if(!t){T("Cannot proceed: GPU not ready","err");return}T("",""),T("── MEMORY TEST ──","info");const r=await De(t);Oe(r);const s=Math.floor(t.limits.maxBufferSize/1048576);T(`Attempting to allocate buffer at reported max: ${s} MB`,"");try{const n=r.createBuffer({size:t.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});T("Buffer allocation at max: SUCCESS","ok"),n.destroy()}catch(n){T(`Buffer allocation at max: FAILED — ${n.message}`,"warn");for(const a of[256,128,64,32])try{const o=r.createBuffer({size:a*1048576,usage:GPUBufferUsage.STORAGE});T(`Largest successful allocation: ${a} MB`,"ok"),o.destroy();break}catch{continue}}T("",""),T("── COMPUTE THROUGHPUT ──","info");for(const n of[64,128,256]){const a=O.fromData(r,new Float32Array(n*n).fill(1),[n,n]),o=O.fromData(r,new Float32Array(n*n).fill(1),[n,n]),i=new O(r,[n,n]),u=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:r.createShaderModule({code:Pt}),entryPoint:"main"}}),l=await st(`matmul ${n}×${n}`,async()=>{const d=r.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=new ArrayBuffer(12);new Uint32Array(m).set([n,n,n]),r.queue.writeBuffer(d,0,m);const f=r.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),p=r.createCommandEncoder(),g=p.beginComputePass();g.setPipeline(c),g.setBindGroup(0,f);const h=Math.ceil(n/16);g.dispatchWorkgroups(h,h,1),g.end(),r.queue.submit([p.finish()]),d.destroy()},30,2*n*n*n);T(at(l),"ok"),a.destroy(),o.destroy(),i.destroy()}r.destroy(),T("",""),T("═══ DIAGNOSTICS COMPLETE ═══","info")}async function Ps(){const e=await It();return hn(e),T("── WEBGPU STATUS ──","info"),T(`${e.statusLabel} (Case ${e.case})`,e.ready?"ok":"err"),T(`Reason: ${e.reason}`,""),T(`Recommendation: ${e.recommendation}`,""),T("",""),T("── ENVIRONMENT ──","info"),T(`  URL: ${e.environment.url}`,""),T(`  Secure Context: ${e.environment.isSecureContext}`,e.environment.isSecureContext?"ok":"err"),T(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`,""),T(`  OS: ${e.environment.osName} ${e.environment.osVersion}`,""),T(`  iOS: ${e.environment.isIOS}`,""),T(`  Safari: ${e.environment.isSafari}`,""),T(`  WebView: ${e.environment.isWebView}`,e.environment.isWebView?"err":""),T(`  navigator.gpu: ${e.gpu.navigatorGpuExists}`,e.gpu.navigatorGpuExists?"ok":"err"),e.gpu.adapterName&&(T(`  Adapter: ${e.gpu.adapterName}`,"ok"),T(`  Vendor: ${e.gpu.adapterVendor}`,"")),e.gpu.adapterError&&T(`  Adapter Error: ${e.gpu.adapterError}`,"err"),e.gpu.deviceError&&T(`  Device Error: ${e.gpu.deviceError}`,"err"),e.ready?!0:(T("",""),T("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function Cs(e){e.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,Qe=e.querySelector("#diag-log"),e.querySelector("#btn-diag").addEventListener("click",()=>{As()})}const ks=Object.freeze(Object.defineProperty({__proto__:null,render:Cs},Symbol.toStringTag,{value:"Module"}));class Ce{dims;ndim;size;strides;constructor(t){this.dims=typeof t=="number"?[t]:[...t],this.ndim=this.dims.length,this.size=this.dims.reduce((n,a)=>n*a,1);const r=new Array(this.ndim);let s=1;for(let n=this.ndim-1;n>=0;n--)r[n]=s,s*=this.dims[n];this.strides=r}equals(t){if(this.ndim!==t.ndim)return!1;for(let r=0;r<this.ndim;r++)if(this.dims[r]!==t.dims[r])return!1;return!0}isContiguous(){let t=1;for(let r=this.ndim-1;r>=0;r--){if(this.strides[r]!==t)return!1;t*=this.dims[r]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new Ce([1])}static from(...t){return new Ce(t)}}var ye=(e=>(e.Float32="f32",e.Float16="f16",e.Int32="i32",e.Int8="i8",e.Uint8="u8",e))(ye||{});const Ts={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function xn(e){return Ts[e].bytes}let me=null;async function Bs(){if(me)return me;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.limits,r=new Set(e.features),s=await e.requestDevice({requiredLimits:{}});return s.lost.then(n=>{console.error("WebGPU device lost:",n.message),me=null}),me={adapter:e,device:s,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:t.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:t.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:t.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:t.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:t.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:t.maxTextureArrayLayers},features:r},me}function q(){if(!me)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return me}function Us(){me&&(me.device.destroy(),me=null)}class Xe{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(t,r,s){this.shape=t,this.dtype=r,this.byteSize=t.size*xn(r),this.gpuBuffer=s??q().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(t,r,s=ye.Float32){const n=q(),a=new Xe(t,s);return n.device.queue.writeBuffer(a.gpuBuffer,0,r.buffer,r.byteOffset,r.byteLength),a}async readback(){const t=q(),r=t.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),s=t.device.createCommandEncoder();s.copyBufferToBuffer(this.gpuBuffer,0,r,0,this.byteSize),t.device.queue.submit([s.finish()]),await r.mapAsync(GPUMapMode.READ);const n=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),n}destroy(){this.gpuBuffer.destroy()}}class C{shape;dtype;buffer;constructor(t,r=ye.Float32,s){this.shape=t,this.dtype=r,this.buffer=s??new Xe(t,r)}static fromFloat32(t,r){const s=t instanceof Float32Array?t:new Float32Array(t),n=new Ce(r);return new C(n,ye.Float32,Xe.fromData(n,s,ye.Float32))}static fromInt32(t,r){const s=t instanceof Int32Array?t:new Int32Array(t),n=new Ce(r);return new C(n,ye.Int32,Xe.fromData(n,s,ye.Int32))}static zeros(t,r=ye.Float32){const s=new Ce(t),n=s.size*xn(r),o=q().device.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(o.getMappedRange()).fill(0),o.unmap();const i=new Xe(s,r,o);return new C(s,r,i)}static ones(t,r=ye.Float32){const s=new Ce(t).size,n=new Float32Array(s).fill(1);return C.fromFloat32(n,t)}static randn(t){const r=new Ce(t).size,s=new Float32Array(r);for(let n=0;n<r;n++){const a=Math.random(),o=Math.random();s[n]=Math.sqrt(-2*Math.log(a))*Math.cos(2*Math.PI*o)}return C.fromFloat32(s,t)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class Rs{cache=new Map;getOrCreate(t,r,s){if(this.cache.has(t))return this.cache.get(t);const n=q(),a=n.device.createComputePipeline({layout:n.device.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:n.device.createShaderModule({code:r}),entryPoint:"main"}});return this.cache.set(t,a),a}get(t){return this.cache.get(t)}clear(){this.cache.clear()}}const Ds=`
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
`,Os=`
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
`,Is=`
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
`,Ns=`
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
`,Gs=`
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
`,Ls=`
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
`,Fs=`
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
`,_s=`
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
`,qs=`
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
`,zs=`
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
`;function Ws(e,t,r,s,n){const a=new Float32Array(r*s);for(let o=0;o<r;o++)for(let i=0;i<s;i++){let u=0;for(let c=0;c<n;c++)u+=e[o*n+c]*t[c*s+i];a[o*s+i]=u}return a}function Hs(e,t){const r=new Float32Array(e.length);for(let s=0;s<e.length;s++)r[s]=e[s]+t[s];return r}function js(e,t){const r=new Float32Array(e.length);for(let s=0;s<e.length;s++)r[s]=e[s]*t[s];return r}function Vs(e,t,r=1e-6){const s=e.length;let n=0;for(let i=0;i<s;i++)n+=e[i]*e[i];const a=Math.sqrt(n/s+r),o=new Float32Array(s);for(let i=0;i<s;i++)o[i]=e[i]/a*t[i];return o}function Ks(e,t,r,s=1e-6){const n=e.length;let a=0;for(let c=0;c<n;c++)a+=e[c];a/=n;let o=0;for(let c=0;c<n;c++){const l=e[c]-a;o+=l*l}o/=n;const i=1/Math.sqrt(o+s),u=new Float32Array(n);for(let c=0;c<n;c++)u[c]=(e[c]-a)*i*t[c]+r[c];return u}function Ys(e,t,r){const s=new Float32Array(e.length);for(let n=0;n<t;n++){const a=n*r;let o=-1e30;for(let u=0;u<r;u++)e[a+u]>o&&(o=e[a+u]);let i=0;for(let u=0;u<r;u++)s[a+u]=Math.exp(e[a+u]-o),i+=s[a+u];for(let u=0;u<r;u++)s[a+u]/=i}return s}function Qs(e,t,r,s=1e4){const n=new Float32Array(e.length);n.set(e);for(let a=0;a<t*r/2;a++){const o=Math.floor(a/(r/2)),i=a%(r/2),u=1/Math.pow(s,i/r),c=o*u,l=Math.cos(c),d=Math.sin(c),m=a*2,f=a*2+1,p=n[m],g=n[f];n[m]=p*l-g*d,n[f]=p*d+g*l}return n}function Xs(e,t,r,s,n,a,o,i,u){const c=n-i+1,l=a-u+1,d=new Float32Array(r*o*c*l);for(let m=0;m<r;m++)for(let f=0;f<o;f++)for(let p=0;p<c;p++)for(let g=0;g<l;g++){let h=0;for(let b=0;b<s;b++)for(let v=0;v<i;v++)for(let y=0;y<u;y++)h+=e[((m*s+b)*n+p+v)*a+g+y]*t[((f*s+b)*i+v)*u+y];d[((m*o+f)*c+p)*l+g]=h}return d}function Zs(e,t,r){const s=new Float32Array(t*r);for(let n=0;n<t;n++)for(let a=0;a<r;a++)s[a*t+n]=e[n*r+a];return s}function Js(e,t,r,s,n,a){const o=new Float32Array(s*n*a);for(let i=0;i<n;i++)for(let u=0;u<s;u++){const c=u*t/s,l=i*r/n,d=Math.floor(c),m=Math.floor(l),f=Math.min(d+1,t-1),p=Math.min(m+1,r-1),g=c-d,h=l-m;for(let b=0;b<a;b++){const v=e[(m*t+d)*a+b],y=e[(m*t+f)*a+b],S=e[(p*t+d)*a+b],$=e[(p*t+f)*a+b];o[(i*s+u)*a+b]=v*(1-g)*(1-h)+y*g*(1-h)+S*(1-g)*h+$*g*h}}return o}const be=new Rs;function Se(e){return q().device.createBindGroupLayout({entries:Array.from({length:e},(r,s)=>({binding:s,visibility:GPUShaderStage.COMPUTE,buffer:s===0?{type:"uniform"}:{type:"storage"}}))})}function Nt(e){const t=q(),r=t.device.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.device.queue.writeBuffer(r,0,e),r}function qe(e,t,r,s,n,a){const o=q(),i=Nt(n),u=[{binding:0,resource:{buffer:i}},...s.map((d,m)=>({binding:m+1,resource:{buffer:d.buffer.gpuBuffer}}))],c=o.device.createBindGroup({layout:r,entries:u}),l=e.beginComputePass();return l.setPipeline(t),l.setBindGroup(0,c),l.dispatchWorkgroups(a),l.end(),i}async function Ve(e,t,r,s,n){const a=q(),o=C.zeros([r,s]),i=Se(4),u=be.getOrCreate("matmul",Ds,i),c=new ArrayBuffer(12),l=new Uint32Array(c);l[0]=r,l[1]=s,l[2]=n;const d=a.device.createCommandEncoder();return qe(d,u,i,[e,t,o],c,Math.ceil(r/16)*Math.ceil(s/16)),a.device.queue.submit([d.finish()]),o}function Ke(e,t,r,s,n){return Ws(e,t,r,s,n)}async function Dr(e,t){const r=q(),s=C.zeros([e.shape.size]),n=Se(4),a=be.getOrCreate("add",Os,n),o=new ArrayBuffer(4);new Uint32Array(o)[0]=e.shape.size;const i=r.device.createCommandEncoder();return qe(i,a,n,[e,t,s],o,Math.ceil(e.shape.size/256)),r.device.queue.submit([i.finish()]),s}function Or(e,t){return Hs(e,t)}async function Ir(e,t){const r=q(),s=C.zeros([e.shape.size]),n=Se(4),a=be.getOrCreate("multiply",Is,n),o=new ArrayBuffer(4);new Uint32Array(o)[0]=e.shape.size;const i=r.device.createCommandEncoder();return qe(i,a,n,[e,t,s],o,Math.ceil(e.shape.size/256)),r.device.queue.submit([i.finish()]),s}function Nr(e,t){return js(e,t)}async function Gr(e,t,r=1e-6){const s=q(),n=e.shape.size,a=C.zeros([n]),o=Se(4),i=be.getOrCreate("rms_norm",Ns,o),u=new ArrayBuffer(8);new Uint32Array(u)[0]=n,new Float32Array(u)[1]=r;const c=s.device.createCommandEncoder();return qe(c,i,o,[e,t,a],u,1),s.device.queue.submit([c.finish()]),a}function Lr(e,t,r=1e-6){return Vs(e,t,r)}async function Fr(e,t,r,s=1e-6){const n=q(),a=e.shape.size,o=C.zeros([a]),i=n.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=be.getOrCreate("layer_norm",Gs,i),c=new ArrayBuffer(8);new Uint32Array(c)[0]=a,new Float32Array(c)[1]=s;const l=q(),d=Nt(c),m=l.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:e.buffer.gpuBuffer}},{binding:2,resource:{buffer:t.buffer.gpuBuffer}},{binding:3,resource:{buffer:r.buffer.gpuBuffer}},{binding:4,resource:{buffer:o.buffer.gpuBuffer}}]}),f=l.device.createCommandEncoder(),p=f.beginComputePass();return p.setPipeline(u),p.setBindGroup(0,m),p.dispatchWorkgroups(1),p.end(),l.device.queue.submit([f.finish()]),o}function _r(e,t,r,s=1e-6){return Ks(e,t,r,s)}async function qr(e,t,r){const s=q(),n=C.zeros([t,r]),a=s.device.createCommandEncoder();a.copyBufferToBuffer(e.buffer.gpuBuffer,0,n.buffer.gpuBuffer,0,t*r*4);const o=Se(2),i=be.getOrCreate("softmax",Ls,o),u=new ArrayBuffer(8);new Uint32Array(u)[0]=t,new Uint32Array(u)[1]=r;const c=Nt(u),l=s.device.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:n.buffer.gpuBuffer}}]}),d=a.beginComputePass();return d.setPipeline(i),d.setBindGroup(0,l),d.dispatchWorkgroups(Math.max(1,Math.ceil(t/256))),d.end(),s.device.queue.submit([a.finish()]),n}function zr(e,t,r){return Ys(e,t,r)}async function Wr(e,t,r,s=1e4){const n=q(),a=C.zeros([t,r]),o=n.device.createCommandEncoder();o.copyBufferToBuffer(e.buffer.gpuBuffer,0,a.buffer.gpuBuffer,0,t*r*4);const i=Se(2),u=be.getOrCreate("rope",Fs,i),c=new ArrayBuffer(12);new Uint32Array(c)[0]=t,new Uint32Array(c)[1]=r,new Float32Array(c)[2]=s;const l=Nt(c),d=n.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:a.buffer.gpuBuffer}}]}),m=o.beginComputePass();return m.setPipeline(u),m.setBindGroup(0,d),m.dispatchWorkgroups(Math.ceil(t*r/2/256)),m.end(),n.device.queue.submit([o.finish()]),a}function Hr(e,t,r,s=1e4){return Qs(e,t,r,s)}async function jr(e,t,r,s,n,a,o,i,u){const c=q(),l=n-i+1,d=a-u+1,m=C.zeros([r,o,l,d]),f=Se(4),p=be.getOrCreate("conv2d",_s,f),g=new ArrayBuffer(36),h=new Uint32Array(g);h[0]=r,h[1]=s,h[2]=n,h[3]=a,h[4]=o,h[5]=i,h[6]=u,h[7]=l,h[8]=d;const b=c.device.createCommandEncoder();return qe(b,p,f,[e,t,m],g,r*o),c.device.queue.submit([b.finish()]),m}function Vr(e,t,r,s,n,a,o,i,u){return Xs(e,t,r,s,n,a,o,i,u)}async function Kr(e,t,r){const s=q(),n=C.zeros([r,t]),a=Se(3),o=be.getOrCreate("transpose_2d",qs,a),i=new ArrayBuffer(8);new Uint32Array(i)[0]=t,new Uint32Array(i)[1]=r;const u=s.device.createCommandEncoder();return qe(u,o,a,[e,n],i,Math.ceil(t/16)*Math.ceil(r/16)),s.device.queue.submit([u.finish()]),n}function Yr(e,t,r){return Zs(e,t,r)}async function Qr(e,t,r,s,n,a){const o=q(),i=C.zeros([n*s*a]),u=Se(3),c=be.getOrCreate("interpolate_bilinear",zs,u),l=new ArrayBuffer(20),d=new Uint32Array(l);d[0]=t,d[1]=r,d[2]=s,d[3]=n,d[4]=a;const m=o.device.createCommandEncoder();return qe(m,c,u,[e,i],l,Math.ceil(s/16)*Math.ceil(n/16)),o.device.queue.submit([m.finish()]),i}function Xr(e,t,r,s,n,a){return Js(e,t,r,s,n,a)}let Ze=null,Ct=null;function ue(e,t=""){if(!Ze)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Ze.appendChild(r),Ze.scrollTop=Ze.scrollHeight}function ne(e,t,r=.001){if(e.length!==t.length)return!1;for(let s=0;s<e.length;s++){const n=Math.abs(e[s]-t[s]),a=Math.max(Math.abs(e[s]),Math.abs(t[s]),1e-8);if(n/a>r)return!1}return!0}async function se(e,t,r=20){for(let n=0;n<3;n++)t();const s=[];for(let n=0;n<r;n++){const a=performance.now();t(),s.push(performance.now()-a)}return s.reduce((n,a)=>n+a,0)/s.length}async function ae(e,t,r=20){const s=[];for(let n=0;n<Math.min(5,r);n++)await t();for(let n=0;n<r;n++){const a=performance.now();await t(),s.push(performance.now()-a)}return s.reduce((n,a)=>n+a,0)/s.length}function ea(e){if(!Ct)return;const t=document.createElement("tr");t.innerHTML=`
    <td style="font-weight:600">${e.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${e.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${e.speedup>=1?"var(--green)":"var(--red)"}">
      ${e.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${e.correct?"badge-pass":"badge-fail"}">${e.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${e.tolerance.toExponential(1)}</td>
  `,Ct.appendChild(t)}async function ta(){Ze.innerHTML="",Ct.innerHTML="",ue("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),ue("Initializing WebGPU...","");let e;try{e=await Bs()}catch(s){ue(`FATAL: ${s.message}`,"err"),ue("WebGPU is not available. Cannot run GPU benchmarks.","err");return}ue(`GPU: ${e.adapter.name??"Unknown"}`,"ok"),ue(`Running benchmarks...
`,"");const t=[];{const o=C.randn([64,64]),i=C.randn([64,64]),u=await o.readback(),c=await i.readback(),l=await se("matmul 64",()=>Ke(u,c,64,64,64)),d=await ae("matmul 64",async()=>{(await Ve(o,i,64,64,64)).destroy()}),m=await(await Ve(o,i,64,64,64)).readback(),f=Ke(u,c,64,64,64),p=ne(f,m),g=Math.max(...Array.from(f).map((h,b)=>Math.abs(h-m[b])));t.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:l,gpuMs:d,speedup:l/d,correct:p,tolerance:g}),o.destroy(),i.destroy()}{const o=C.randn([256,256]),i=C.randn([256,256]),u=await o.readback(),c=await i.readback(),l=await se("matmul 256",()=>Ke(u,c,256,256,256),10),d=await ae("matmul 256",async()=>{(await Ve(o,i,256,256,256)).destroy()}),m=await(await Ve(o,i,256,256,256)).readback(),f=Ke(u,c,256,256,256),p=ne(f,m),g=Math.max(...Array.from(f).map((h,b)=>Math.abs(h-m[b])));t.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:l,gpuMs:d,speedup:l/d,correct:p,tolerance:g}),o.destroy(),i.destroy()}{const o=C.randn([512,512]),i=C.randn([512,512]),u=await o.readback(),c=await i.readback(),l=await se("matmul 512",()=>Ke(u,c,512,512,512),5),d=await ae("matmul 512",async()=>{(await Ve(o,i,512,512,512)).destroy()}),m=await(await Ve(o,i,512,512,512)).readback(),f=Ke(u,c,512,512,512),p=ne(f,m),g=Math.max(...Array.from(f).map((h,b)=>Math.abs(h-m[b])));t.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:l,gpuMs:d,speedup:l/d,correct:p,tolerance:g}),o.destroy(),i.destroy()}{const n=C.randn([1e6]),a=C.randn([1e6]),o=await n.readback(),i=await a.readback(),u=await se("add 1M",()=>Or(o,i)),c=await ae("add 1M",async()=>{(await Dr(n,a)).destroy()}),l=await(await Dr(n,a)).readback(),d=Or(o,i),m=ne(d,l),f=Math.max(...Array.from(d).map((p,g)=>Math.abs(p-l[g])));t.push({name:"Add",shape:"[1000000]",cpuMs:u,gpuMs:c,speedup:u/c,correct:m,tolerance:f}),n.destroy(),a.destroy()}{const n=C.randn([1e6]),a=C.randn([1e6]),o=await n.readback(),i=await a.readback(),u=await se("mul 1M",()=>Nr(o,i)),c=await ae("mul 1M",async()=>{(await Ir(n,a)).destroy()}),l=await(await Ir(n,a)).readback(),d=Nr(o,i),m=ne(d,l),f=Math.max(...Array.from(d).map((p,g)=>Math.abs(p-l[g])));t.push({name:"Multiply",shape:"[1000000]",cpuMs:u,gpuMs:c,speedup:u/c,correct:m,tolerance:f}),n.destroy(),a.destroy()}{const n=C.randn([1024]),a=C.ones([1024]),o=await n.readback(),i=await a.readback(),u=await se("rmsnorm",()=>Lr(o,i)),c=await ae("rmsnorm",async()=>{(await Gr(n,a)).destroy()}),l=await(await Gr(n,a)).readback(),d=Lr(o,i),m=ne(d,l),f=Math.max(...Array.from(d).map((p,g)=>Math.abs(p-l[g])));t.push({name:"RMSNorm",shape:"[1024]",cpuMs:u,gpuMs:c,speedup:u/c,correct:m,tolerance:f}),n.destroy(),a.destroy()}{const n=C.randn([1024]),a=C.ones([1024]),o=C.zeros([1024]),i=await n.readback(),u=await a.readback(),c=await o.readback(),l=await se("layernorm",()=>_r(i,u,c)),d=await ae("layernorm",async()=>{(await Fr(n,a,o)).destroy()}),m=await(await Fr(n,a,o)).readback(),f=_r(i,u,c),p=ne(f,m),g=Math.max(...Array.from(f).map((h,b)=>Math.abs(h-m[b])));t.push({name:"LayerNorm",shape:"[1024]",cpuMs:l,gpuMs:d,speedup:l/d,correct:p,tolerance:g}),n.destroy(),a.destroy(),o.destroy()}{const a=C.randn([32,128]),o=await a.readback(),i=await se("softmax",()=>zr(new Float32Array(o),32,128)),u=await ae("softmax",async()=>{(await qr(C.fromFloat32(new Float32Array(o),[32,128]),32,128)).destroy()}),c=await(await qr(C.fromFloat32(new Float32Array(o),[32,128]),32,128)).readback(),l=zr(new Float32Array(o),32,128),d=ne(l,c),m=Math.max(...Array.from(l).map((f,p)=>Math.abs(f-c[p])));t.push({name:"Softmax",shape:"[32, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:m}),a.destroy()}{const a=C.randn([16,128]),o=await a.readback(),i=await se("rope",()=>Hr(new Float32Array(o),16,128)),u=await ae("rope",async()=>{(await Wr(C.fromFloat32(new Float32Array(o),[16,128]),16,128)).destroy()}),c=await(await Wr(C.fromFloat32(new Float32Array(o),[16,128]),16,128)).readback(),l=Hr(new Float32Array(o),16,128),d=ne(l,c),m=Math.max(...Array.from(l).map((f,p)=>Math.abs(f-c[p])));t.push({name:"RoPE",shape:"[16, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:m}),a.destroy()}{const l=C.randn([1,3,16,16]),d=C.randn([4,3,3,3]),m=await l.readback(),f=await d.readback(),p=await se("conv2d",()=>Vr(m,f,1,3,16,16,4,3,3)),g=await ae("conv2d",async()=>{(await jr(l,d,1,3,16,16,4,3,3)).destroy()}),h=await(await jr(l,d,1,3,16,16,4,3,3)).readback(),b=Vr(m,f,1,3,16,16,4,3,3),v=ne(b,h),y=Math.max(...Array.from(b).map((S,$)=>Math.abs(S-h[$])));t.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:p,gpuMs:g,speedup:p/g,correct:v,tolerance:y}),l.destroy(),d.destroy()}{const a=C.randn([256,256]),o=await a.readback(),i=await se("transpose",()=>Yr(o,256,256)),u=await ae("transpose",async()=>{(await Kr(a,256,256)).destroy()}),c=await(await Kr(a,256,256)).readback(),l=Yr(o,256,256),d=ne(l,c),m=Math.max(...Array.from(l).map((f,p)=>Math.abs(f-c[p])));t.push({name:"Transpose",shape:"[256, 256]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:m}),a.destroy()}{const u=C.randn([3072]),c=await u.readback(),l=await se("interp",()=>Xr(c,32,32,64,64,3)),d=await ae("interp",async()=>{(await Qr(u,32,32,64,64,3)).destroy()}),m=await(await Qr(u,32,32,64,64,3)).readback(),f=Xr(c,32,32,64,64,3),p=ne(f,m),g=Math.max(...Array.from(f).map((h,b)=>Math.abs(h-m[b])));t.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:l,gpuMs:d,speedup:l/d,correct:p,tolerance:g}),u.destroy()}ue("",""),ue("═══ RESULTS ═══","info");for(const s of t){ea(s);const n=s.correct?"✓":"✗",a=s.correct?"ok":"err";ue(`${n} ${s.name} (${s.shape}): CPU ${s.cpuMs.toFixed(2)} ms | GPU ${s.gpuMs.toFixed(2)} ms | ${s.speedup.toFixed(1)}× | max diff ${s.tolerance.toExponential(1)}`,a)}const r=t.filter(s=>s.correct).length;ue("",""),ue(`═══ ${r}/${t.length} CORRECT ═══`,r===t.length?"ok":"err"),Us()}function ra(e){e.innerHTML=`
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
  `,Ze=e.querySelector("#bench-log"),Ct=e.querySelector("#bench-tbody"),e.querySelector("#btn-run-bench").addEventListener("click",()=>{ta()})}const na=Object.freeze(Object.defineProperty({__proto__:null,render:ra},Symbol.toStringTag,{value:"Module"}));let Me=null,vt="";function sa(e){const t=e.environment,r=e.gpu,s=e.case==="D"?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)";let n=`
    <div style="text-align:center;margin:20px 0">
      <div style="font-size:28px;font-weight:800;color:${s};letter-spacing:1px">${e.statusLabel}</div>
      <div style="font-size:14px;color:var(--text-dim);margin-top:8px">Case ${e.case}</div>
    </div>

    <div class="card" style="border-color:${s}">
      <div class="card-title" style="margin-bottom:8px">Diagnosis</div>
      <p style="font-size:13px;color:var(--text);line-height:1.6">${e.reason}</p>
      <p style="font-size:13px;color:var(--text);margin-top:10px;font-weight:600;line-height:1.6">${e.recommendation}</p>
    </div>
  `;if(n+=`
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
  `,n+=`
    <h3>WebGPU API</h3>
    <div class="card">
      <div class="row"><span class="row-label">navigator.gpu</span><span class="row-value" style="color:${r.navigatorGpuExists?"var(--green)":"var(--red)"}">${r.navigatorGpuExists?"Exists ✓":"Undefined ✗"}</span></div>
  `,r.adapterName&&(n+=`
      <div class="row"><span class="row-label">Adapter</span><span class="row-value">${r.adapterName}</span></div>
      <div class="row"><span class="row-label">Vendor</span><span class="row-value">${r.adapterVendor||"Unknown"}</span></div>
      <div class="row"><span class="row-label">Device</span><span class="row-value">${r.adapterDevice||"Unknown"}</span></div>
      <div class="row"><span class="row-label">Fallback</span><span class="row-value">${r.isFallbackAdapter?"Yes (software)":"No (hardware)"}</span></div>
    `),r.adapterError&&(n+=`<div class="row"><span class="row-label">Adapter Error</span><span class="row-value" style="color:var(--red)">${r.adapterError}</span></div>`),r.deviceError&&(n+=`<div class="row"><span class="row-label">Device Error</span><span class="row-value" style="color:var(--red)">${r.deviceError}</span></div>`),n+="</div>",r.limits){const a=r.limits,o=i=>i>=1073741824?`${(i/1073741824).toFixed(1)} GB`:i>=1048576?`${(i/1048576).toFixed(1)} MB`:i>=1024?`${(i/1024).toFixed(1)} KB`:`${i} B`;n+=`
      <h3>GPU Limits</h3>
      <div class="card">
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${o(a.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${a.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${a.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${a.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${o(a.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${o(a.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${o(a.maxComputeWorkgroupStorageSize)}</span></div>
        <div class="row"><span class="row-label">Max invocations/wg</span><span class="row-value">${a.maxComputeInvocationsPerWorkgroup}</span></div>
        <div class="row"><span class="row-label">Max workgroup size</span><span class="row-value">${a.maxComputeWorkgroupSizeX}×${a.maxComputeWorkgroupSizeY}×${a.maxComputeWorkgroupSizeZ}</span></div>
        <div class="row"><span class="row-label">Max workgroups/dim</span><span class="row-value">${a.maxComputeWorkgroupsPerDimension}</span></div>
        <div class="row"><span class="row-label">Max color attachments</span><span class="row-value">${a.maxColorAttachments}</span></div>
        <div class="row"><span class="row-label">Storage buf alignment</span><span class="row-value">${a.minStorageBufferOffsetAlignment} B</span></div>
        <div class="row"><span class="row-label">Uniform buf alignment</span><span class="row-value">${a.minUniformBufferOffsetAlignment} B</span></div>
      </div>
    `}return r.features.length>0&&(n+=`
      <h3>Features (${r.features.length})</h3>
      <div class="card">
        ${r.features.map(a=>`<div class="row"><span class="row-value">${a}</span></div>`).join("")}
      </div>
    `),n+=`
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
  `,n}function aa(e){e.innerHTML=`
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;const t=e.querySelector("#wgdiag-result");Me=e.querySelector("#btn-copy-report"),e.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{t.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',Me.disabled=!0;const r=await It();vt=hn(r),t.innerHTML=sa(r),Me.disabled=!1}),Me.addEventListener("click",async()=>{if(vt)try{await navigator.clipboard.writeText(vt),Me.textContent="Copied!",setTimeout(()=>{Me.textContent="Copy Diagnostics"},2e3)}catch{const r=document.createElement("textarea");r.value=vt,document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),Me.textContent="Copied!",setTimeout(()=>{Me.textContent="Copy Diagnostics"},2e3)}}),e.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const oa=Object.freeze(Object.defineProperty({__proto__:null,render:aa},Symbol.toStringTag,{value:"Module"})),ia=typeof GPUShaderStage<"u"?GPUShaderStage.COMPUTE:4;function ua(e,t=ia){return e.map((r,s)=>({binding:s,visibility:t,buffer:{type:r}}))}function br(e,t){return e.createBindGroupLayout({entries:ua(t)})}function ca(e,t,r="bind group"){if(e.length!==t.length)throw new Error(`${r} binding count mismatch: pipeline layout declares ${e.length} bindings but ${t.length} entries were provided.`)}const Zr=new WeakMap,ur=new WeakMap,cr=new WeakMap,Sn=new WeakSet;let la=1;function Gt(e){let t=Zr.get(e);return t===void 0&&(t=la++,Zr.set(e,t)),t}function da(e,t){ur.set(e,Gt(t))}function fa(e){return ur.has(e)?ur.get(e):null}function pa(e,t){cr.set(e,Gt(t))}function ma(e){return cr.has(e)?cr.get(e):null}function ga(e){Sn.add(e)}function ba(e){return Sn.has(e)}class ha{commandBuffersCreated=0;commandBuffersSubmitted=0;warmupSubmissions=0;measurementSubmissions=0;syncSubmissions=0;readbackOperations=0;completionReads=0;mapOverlapDetected=!1;peakMappedConcurrent=0;_activeMaps=0;reset(){this.commandBuffersCreated=0,this.commandBuffersSubmitted=0,this.warmupSubmissions=0,this.measurementSubmissions=0,this.syncSubmissions=0,this.readbackOperations=0,this.completionReads=0,this.mapOverlapDetected=!1,this.peakMappedConcurrent=0,this._activeMaps=0}onCommandBufferCreated(){this.commandBuffersCreated++}onCommandBufferSubmitted(t="other"){this.commandBuffersSubmitted++,t==="warmup"?this.warmupSubmissions++:t==="measurement"?this.measurementSubmissions++:t==="sync"&&this.syncSubmissions++}onReadbackOperation(){this.readbackOperations++}onCompletionRead(){this.completionReads++}onMapBegin(){this._activeMaps>0&&(this.mapOverlapDetected=!0),this._activeMaps++,this.peakMappedConcurrent=Math.max(this.peakMappedConcurrent,this._activeMaps)}onMapEnd(){this._activeMaps=Math.max(0,this._activeMaps-1)}snapshot(){return{commandBuffersCreated:this.commandBuffersCreated,commandBuffersSubmitted:this.commandBuffersSubmitted,warmupSubmissions:this.warmupSubmissions,measurementSubmissions:this.measurementSubmissions,syncSubmissions:this.syncSubmissions,readbackOperations:this.readbackOperations,completionReads:this.completionReads,mapOverlapDetected:this.mapOverlapDetected,peakMappedConcurrent:this.peakMappedConcurrent}}}const B=new ha;class re{static instance=null;static getInstance(){return re.instance||(re.instance=new re),re.instance}stagingBuffer=null;currentStagingSize=0;isMapped=!1;isPending=!1;queueDepth=0;lastStatus="IDLE";lastError="";readbackChain=Promise.resolve();acquire(t,r){if(r<=0||r%4!==0)throw new Error(`Invalid readback size: ${r} (must be > 0 and 4-byte aligned)`);if(t.limits&&r>t.limits.maxBufferSize)throw new Error(`Readback size ${r} exceeds device limit maxBufferSize (${t.limits.maxBufferSize})`);if(!this.stagingBuffer||this.currentStagingSize<r){if(this.stagingBuffer){if(this.isMapped){try{this.stagingBuffer.unmap()}catch{}this.isMapped=!1}try{this.stagingBuffer.destroy()}catch{}this.stagingBuffer=null}const s=Math.max(Math.ceil(r/16)*16,16);this.stagingBuffer=t.createBuffer({label:"AETHER_Reusable_Staging_Buffer",size:s,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.currentStagingSize=s}return this.stagingBuffer}copyAndRead(t,r,s,n="Readback"){return this.enqueueReadback(t,async()=>{if(r.size<s)throw new Error(`Copy size ${s} exceeds source buffer size ${r.size}`);const a=this.acquire(t,s);if(a.size<s)throw new Error(`Staging buffer size ${a.size} is smaller than requested copy size ${s}`);const o=t.createCommandEncoder({label:`Encoder_${n}`});B.onCommandBufferCreated(),o.copyBufferToBuffer(r,0,a,0,s),t.queue.submit([o.finish()]),B.onCommandBufferSubmitted("readback"),this.isPending=!0,B.onReadbackOperation(),B.onMapBegin();try{await a.mapAsync(GPUMapMode.READ,0,s),this.isMapped=!0,this.isPending=!1;const i=a.getMappedRange(0,s),u=new Float32Array(i.slice(0));return a.unmap(),this.isMapped=!1,this.lastStatus="PASS",this.lastError="",u}catch(i){this.isPending=!1,this.isMapped=!1,this.lastStatus="FAIL";const u=i,c=u.name||"UnknownError",l=u.message||String(i),d=`mapAsync FAIL [${n}] — ${c}: ${l} (size: ${s}B, srcSize: ${r.size}B, stagingSize: ${a.size}B)`;throw this.lastError=d,console.error(d),new Error(d)}finally{B.onMapEnd()}})}readSubmittedCopy(t,r,s,n="ReadbackSubmitted"){return this.enqueueReadback(t,async()=>{this.isPending=!0,B.onReadbackOperation(),B.onMapBegin();try{await r.mapAsync(GPUMapMode.READ,0,s),this.isMapped=!0,this.isPending=!1;const a=r.getMappedRange(0,s),o=new Float32Array(a.slice(0));return r.unmap(),this.isMapped=!1,this.lastStatus="PASS",this.lastError="",o}catch(a){this.isPending=!1,this.isMapped=!1,this.lastStatus="FAIL";const o=a,i=o.name||"UnknownError",u=o.message||String(a),c=`mapAsync FAIL [${n}] — ${i}: ${u} (size: ${s}B, stagingSize: ${r.size}B)`;throw this.lastError=c,console.error(c),new Error(c)}finally{B.onMapEnd()}})}enqueueReadback(t,r){this.queueDepth++;const s=this.readbackChain.catch(()=>{}).then(()=>r()).finally(()=>{this.queueDepth=Math.max(0,this.queueDepth-1)});return this.readbackChain=s.then(()=>{},()=>{}),s}release(){if(this.stagingBuffer){if(this.isMapped){try{this.stagingBuffer.unmap()}catch{}this.isMapped=!1}try{this.stagingBuffer.destroy()}catch{}this.stagingBuffer=null,this.currentStagingSize=0}}getDiagnostics(t=!1){return{stagingSize:this.currentStagingSize,isMapped:this.isMapped,isPending:this.isPending,queueDepth:this.queueDepth,lastStatus:this.lastStatus,lastError:this.lastError,deviceLost:t}}}let lt=null,Ne=null,kt=null,lr=null;async function H(){if(Ne&&!lt&&(Ne=null),Ne)return Ne;if(!navigator.gpu)throw new Error("WebGPU not supported");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.features.has("timestamp-query"),r=await e.requestDevice({requiredFeatures:t?["timestamp-query"]:[],requiredLimits:{}});kt=null,lr=null,r.lost.then(o=>{console.error("Benchmark device lost:",o.reason,o.message),ga(r),kt=o.reason??"unknown",lr=o.message??"",lt=null,Ne=null}),lt=r;let s=null;try{s=navigator.gpu.getPreferredCanvasFormat()}catch{}const n=e.limits,a=[];for(const o of e.features)a.push(o);return Ne={webgpuAvailable:!0,adapterName:e.name??"Unknown",adapterVendor:e.vendor??"Unknown",adapterDevice:e.device??"Unknown",adapterFeatures:a,adapterLimits:{maxBufferSize:n.maxBufferSize,maxTextureDimension1D:n.maxTextureDimension1D,maxTextureDimension2D:n.maxTextureDimension2D,maxTextureDimension3D:n.maxTextureDimension3D,maxComputeWorkgroupStorageSize:n.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:n.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:n.maxStorageBufferBindingSize,maxUniformBufferBindingSize:n.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:n.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:n.maxComputeWorkgroupsPerDimension,maxColorAttachments:n.maxColorAttachments,minStorageBufferOffsetAlignment:n.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:n.minUniformBufferOffsetAlignment},preferredCanvasFormat:s,maxBufferSize:n.maxBufferSize,maxStorageBufferBindingSize:n.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:n.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:n.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:n.maxComputeWorkgroupsPerDimension,timestampQuerySupport:t,isFallbackAdapter:e.isFallbackAdapter??!1},Ne}function k(){if(!lt)throw new Error("Benchmark not initialized. Call initBenchmark() first.");return lt}function Tt(){return{reason:kt,message:lr}}function I(){return kt!==null}async function ya(e,t,r){e.pushErrorScope("validation"),e.pushErrorScope("out-of-memory"),e.pushErrorScope("internal");try{const s=await r(),a=(await Promise.all([e.popErrorScope(),e.popErrorScope(),e.popErrorScope()])).find(o=>o!==null);return{result:s,error:a?a.message:null}}catch(s){return await e.popErrorScope(),await e.popErrorScope(),await e.popErrorScope(),{result:null,error:s.message}}}function _(e){const t=k(),r=t.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(r,0,e),r}function M(e,t){const r=k(),s=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(t){const n=r.createBuffer({size:Math.max(e,t.byteLength),usage:s,mappedAtCreation:!0});return new Float32Array(n.getMappedRange()).set(t),n.unmap(),n}return r.createBuffer({size:e,usage:s})}async function xe(e,t,r="readbackBuffer"){const s=k();return re.getInstance().copyAndRead(s,e,t,r)}function V(e,t,r){const s=k();if(t.length===0)throw new Error("createPipeline: bindingTypes must be non-empty (uniform / read-only-storage / storage)");const n=br(s,t),a=s.createShaderModule({code:e}),o=s.createComputePipeline({layout:s.createPipelineLayout({bindGroupLayouts:[n]}),compute:{module:a,entryPoint:"main"}});da(o,s);const i=u=>r?.({bindingTypes:t,compilationMessages:u,pipelineLayoutInspected:!0});return typeof a.getCompilationInfo=="function"&&a.getCompilationInfo().then(u=>i(u.messages)).catch(()=>i([])),o}function W(e,t,r){const s=k();ca(t,r,"createBindGroupForPipeline");const n=e.getBindGroupLayout(0),a=s.createBindGroup({layout:n,entries:r});return pa(a,s),a}const et=`
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
`,gt=`
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
`,$n=`
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
`,Lt=`
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
`;function ot(e){return[Math.max(1,Math.ceil(e/64)),1,1]}function hr(e){const t=Math.max(1,Math.ceil(e/64));return{rows:e,workgroupSize:64,workgroupsX:t,totalInvocations:t*64}}function va(e){const t=hr(e);if(!(t.totalInvocations>=t.rows&&t.totalInvocations<t.rows+64))throw new Error(`softmax dispatch invariant violated: rows=${t.rows} wgX=${t.workgroupsX} total=${t.totalInvocations} (expected ${t.rows} ≤ total < ${t.rows+64})`);return t}const En=`
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
`,$e=-12345,ft=`
struct Uniforms { batch: u32, seq: u32, dim: u32, scale: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> Q: array<f32>;
@group(0) @binding(2) var<storage, read> K: array<f32>;
@group(0) @binding(3) var<storage, read> V: array<f32>;
@group(0) @binding(4) var<storage, read_write> out: array<f32>;
@group(0) @binding(5) var<storage, read_write> scores: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let totalRows = u.batch * u.seq;
  let rowIndex = gid.x;
  if (rowIndex >= totalRows) { return; }

  let b = rowIndex / u.seq;
  let i = rowIndex % u.seq;
  let base = b * u.seq * u.seq + i * u.seq;

  var max_val: f32 = -1e30;
  for (var j = 0u; j < u.seq; j++) {
    var dot: f32 = 0.0;
    for (var d = 0u; d < u.dim; d++) {
      dot += Q[(b * u.seq + i) * u.dim + d] * K[(b * u.seq + j) * u.dim + d];
    }
    let s = dot * u.scale;
    scores[base + j] = s;
    if (s > max_val) { max_val = s; }
  }

  var sum_exp: f32 = 0.0;
  for (var j = 0u; j < u.seq; j++) {
    let e = exp(scores[base + j] - max_val);
    scores[base + j] = e;
    sum_exp += e;
  }
  for (var j = 0u; j < u.seq; j++) {
    scores[base + j] /= sum_exp;
  }

  for (var d = 0u; d < u.dim; d++) {
    var sum: f32 = 0.0;
    for (var j = 0u; j < u.seq; j++) {
      sum += scores[base + j] * V[(b * u.seq + j) * u.dim + d];
    }
    out[(b * u.seq + i) * u.dim + d] = sum;
  }
}
`,wa=["uniform","read-only-storage","read-only-storage","storage"],yr=["uniform","read-only-storage","read-only-storage","storage"],xa=["uniform","read-only-storage","read-only-storage","storage"],Sa=["uniform","read-only-storage","storage"],$a=["uniform","read-only-storage","read-only-storage","storage"],Mn=["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"];function Ea(e,t){try{return e.pushErrorScope(t),!0}catch{return!1}}async function Qt(e,t){let r=null;for(let s=0;s<t;s++)try{const n=await e.popErrorScope();n&&!r&&(r=n)}catch{}return r}async function Ma(e,t){const r=Gt(e),s=fa(t.pipeline),n=ma(t.bindGroup);if(ba(e))return{pass:!1,error:"DEVICE LOST — refusing to execute a pipeline on a lost device.",stage:"encode",errorType:"device-lost",mismatch:!1,pipelineDeviceId:s,executionDeviceId:r,bindGroupDeviceId:n};if(s!==null&&s!==r)return{pass:!1,error:`PIPELINE DEVICE MISMATCH — pipeline device: ${s}, execution device: ${r}. The pipeline was created by a different GPUDevice; refusing to call setPipeline().`,stage:"set-pipeline",errorType:"device-mismatch",mismatch:!0,pipelineDeviceId:s,executionDeviceId:r,bindGroupDeviceId:n};const a=["validation","out-of-memory","internal"];let o=0;for(const u of a)Ea(e,u)&&o++;let i="encode";try{const u=re.getInstance(),c=u.acquire(e,t.outputBytes);i="encode";const l=e.createCommandEncoder({label:`Enc_${t.name}`}),d=l.beginComputePass();if(i="set-pipeline",d.setPipeline(t.pipeline),n!==null&&n!==r)return await Qt(e,o),{pass:!1,error:`BIND GROUP DEVICE MISMATCH — bind group device: ${n}, execution device: ${r}. The bind group was created by a different GPUDevice; refusing to call setBindGroup().`,stage:"set-bind-group",errorType:"device-mismatch",mismatch:!0,pipelineDeviceId:s,executionDeviceId:r,bindGroupDeviceId:n};n===null&&console.warn(`[gpu-test] ${t.name}: bind group identity unavailable — continuing (not fabricated).`),i="set-bind-group",d.setBindGroup(0,t.bindGroup),i="dispatch",d.dispatchWorkgroups(...t.workgroups),d.end(),i="submit",l.copyBufferToBuffer(t.outputBuffer,0,c,0,t.outputBytes),e.queue.submit([l.finish()]),i="readback";const m=await u.readSubmittedCopy(e,c,t.outputBytes,t.name),f=await Qt(e,o);if(f)return{pass:!1,error:`GPU Error: ${f.message}`,stage:"submit",errorType:f.type??null,mismatch:!1,pipelineDeviceId:s,executionDeviceId:r,bindGroupDeviceId:n};i="validation";const p=t.validator(m);return{pass:p.pass,error:p.pass?null:p.error,stage:p.pass?"complete":"validation",errorType:p.pass?null:"output-mismatch",mismatch:!1,pipelineDeviceId:s,executionDeviceId:r,bindGroupDeviceId:n}}catch(u){return await Qt(e,o),{pass:!1,error:u.message,stage:i,errorType:"exception",mismatch:!1,pipelineDeviceId:s,executionDeviceId:r,bindGroupDeviceId:n}}}function An(e,t){const r=new Float32Array(e.length);for(let s=0;s<e.length;s++)r[s]=e[s]+t[s];return r}function Pn(e,t,r,s,n){const a=new Float32Array(r*s);for(let o=0;o<r;o++)for(let i=0;i<s;i++){let u=0;for(let c=0;c<n;c++)u+=e[o*n+c]*t[c*s+i];a[o*s+i]=u}return a}function Cn(e,t,r,s,n,a,o,i,u){const c=n-i+1,l=a-u+1,d=new Float32Array(r*o*c*l);for(let m=0;m<r;m++)for(let f=0;f<o;f++)for(let p=0;p<c;p++)for(let g=0;g<l;g++){let h=0;for(let b=0;b<s;b++)for(let v=0;v<i;v++)for(let y=0;y<u;y++)h+=e[((m*s+b)*n+p+v)*a+g+y]*t[((f*s+b)*i+v)*u+y];d[((m*o+f)*c+p)*l+g]=h}return d}function Ft(e,t,r){const s=new Float32Array(e.length);for(let n=0;n<t;n++){const a=n*r;let o=-1e30;for(let u=0;u<r;u++)e[a+u]>o&&(o=e[a+u]);let i=0;for(let u=0;u<r;u++){const c=Math.exp(e[a+u]-o);s[a+u]=c,i+=c}for(let u=0;u<r;u++)s[a+u]/=i}return s}function kn(e,t,r){const s=e.length;let n=0;for(let i=0;i<s;i++)n+=e[i]*e[i];const a=Math.sqrt(n/s+r),o=new Float32Array(s);for(let i=0;i<s;i++)o[i]=e[i]/a*t[i];return o}function vr(e,t,r,s,n,a,o){const i=new Float32Array(s*n*a);for(let u=0;u<s;u++)for(let c=0;c<n;c++){const l=[];let d=-1e30;for(let p=0;p<n;p++){let g=0;for(let b=0;b<a;b++)g+=e[(u*n+c)*a+b]*t[(u*n+p)*a+b];const h=g*o;l.push(h),h>d&&(d=h)}let m=0;const f=l.map(p=>{const g=Math.exp(p-d);return m+=g,g});for(let p=0;p<n;p++){const g=f[p]/m;for(let h=0;h<a;h++)i[(u*n+c)*a+h]+=g*r[(u*n+p)*a+h]}}return i}function wr(e,t,r){const s=e.length!==t.length,n=Math.min(e.length,t.length);let a=!0,o=-1,i=0,u=-1,c=null,l=null,d=1/0,m=-1/0,f=1/0,p=-1/0,g=!1;for(let b=0;b<n;b++){const v=e[b],y=t[b];if(!Number.isFinite(v)){a=!1,o<0&&(o=b);continue}y<d&&(d=y),y>m&&(m=y),v<f&&(f=v),v>p&&(p=v),g||(g=!0,u=0,c=y,l=v);const S=Math.abs(v-y);S>i&&(i=S,u=b,c=y,l=v)}if(a){for(let b=n;b<e.length;b++)if(!Number.isFinite(e[b])){a=!1,o=b;break}}const h=!s&&a&&g&&i<=r;return{maxError:i,errorIndex:u,cpuValue:c,gpuValue:l,expectedRange:d===1/0||m===-1/0?null:[d,m],actualRange:f===1/0||p===-1/0?null:[f,p],nonFiniteIndex:o,allFinite:a,lengthMismatch:s,pass:h}}function xr(e,t,r){const s=new Float32Array(t);for(let n=0;n<t;n++){let a=0;for(let o=0;o<r;o++)a+=e[n*r+o];s[n]=a}return s}function Sr(e,t,r){const s=new ArrayBuffer(16),n=new Uint32Array(s);return n[0]=e>>>0,n[1]=t>>>0,n[2]=r>>>0,n[3]=0,s}function bt(e){const t=new ArrayBuffer(16),r=new Uint32Array(t);return r[0]=e>>>0,r[1]=0,r[2]=0,r[3]=0,t}function Tn(e,t,r,s,n,a,o,i,u){const c=new ArrayBuffer(48),l=new Uint32Array(c);return l[0]=e>>>0,l[1]=t>>>0,l[2]=r>>>0,l[3]=s>>>0,l[4]=n>>>0,l[5]=a>>>0,l[6]=o>>>0,l[7]=i>>>0,l[8]=u>>>0,l[9]=0,l[10]=0,l[11]=0,c}function _t(e,t){const r=new ArrayBuffer(16),s=new Uint32Array(r);return s[0]=e>>>0,s[1]=t>>>0,s[2]=0,s[3]=0,r}function Bn(e,t){const r=new ArrayBuffer(16),s=new Uint32Array(r),n=new Float32Array(r);return s[0]=e>>>0,n[1]=t,s[2]=0,s[3]=0,r}function qt(e,t,r,s){const n=new ArrayBuffer(16),a=new Uint32Array(n),o=new Float32Array(n);return a[0]=e>>>0,a[1]=t>>>0,a[2]=r>>>0,o[3]=s,n}function Aa(e){const t=new Uint32Array(e),r=new Uint8Array(e),s=Array.from(r.slice(0,16)).map(n=>n.toString(16).padStart(2,"0")).join(" ");console.log("MATMUL UNIFORM DIAGNOSTIC:"),console.log(`M: ${t[0]}`),console.log(`N: ${t[1]}`),console.log(`K: ${t[2]}`),console.log(`Uniform bytes: ${s}`)}function Un(e,t){const r=new Uint32Array(e),s=new Float32Array(e),n=new Uint8Array(e),a=Array.from(n.slice(0,16)).map(i=>i.toString(16).padStart(2,"0")).join(" "),o={batch:r[0],seq:r[1],dim:r[2],scale:s[3]};return console.log("ATTENTION UNIFORM DIAGNOSTIC:"),console.log(`batch: ${o.batch} (expected ${t.batch})`),console.log(`seq: ${o.seq} (expected ${t.seq})`),console.log(`dim: ${o.dim} (expected ${t.dim})`),console.log(`scale: ${o.scale} (expected ${t.scale})`),console.log(`Uniform bytes: ${a}`),o.batch!==t.batch>>>0?`uniform batch ${o.batch} != ${t.batch}`:o.seq!==t.seq>>>0?`uniform seq ${o.seq} != ${t.seq}`:o.dim!==t.dim>>>0?`uniform dim ${o.dim} != ${t.dim}`:Math.abs(o.scale-t.scale)>1e-6?`uniform scale ${o.scale} != ${t.scale}`:null}const dr=[];let Jr=!1;function fe(){if(!Jr)try{k().addEventListener("uncapturederror",t=>{const r=t.error;r&&dr.push(r.message)}),Jr=!0}catch{}}function pe(){const e=dr.slice();return dr.length=0,e}function J(e){return M(e.byteLength,e)}function tt(e,t,r,s){return{config:e,pass:!1,stage:t,errorType:r,errorMessage:s,maxError:-1,errorIndex:-1,cpuValue:null,gpuValue:null,expectedRange:null,actualRange:null,nonFiniteIndex:-1}}async function ze(e){const t=k();let r=null,s="pipeline",n=null,a=null;try{s="pipeline";const o=V(e.code,e.bindingTypes);s="bind-group";const i=W(o,e.bindingTypes,e.entries),u=await Ma(t,{name:e.name,pipeline:o,bindGroup:i,workgroups:e.workgroups,outputBuffer:e.outputBuffer,outputBytes:e.outputBytes,validator:p=>(r=p,{pass:!0,error:""})});if(s=u.stage,!u.pass)return{...tt(e.config,s,u.errorType??"gpu-error",u.error??"GPU execution failed"),pipelineDeviceId:u.pipelineDeviceId,executionDeviceId:u.executionDeviceId,bindGroupDeviceId:u.bindGroupDeviceId,mismatch:u.mismatch};if(r===null)throw new Error("GPU returned no data after readback");s="validation";const c=wr(r,e.reference,e.tolerance),l=e.extraCheck?e.extraCheck(r):null;let d=null,m={};if(e.postValidate)try{const p=await e.postValidate(r);d=p.error,m=p.diag??{}}catch(p){d=p.message}const f=c.pass&&l===null&&d===null;return f||(d!==null?(n="output-incomplete",a=d):c.allFinite?c.lengthMismatch?(n="shape-mismatch",a=`GPU length ${r.length} != CPU reference length ${e.reference.length}`):c.pass?(n="constraint",a=l??"output constraint violated"):(n="output-mismatch",a=`max abs error ${c.maxError.toExponential(3)} at index ${c.errorIndex} (cpu ${c.cpuValue?.toExponential(4)??"n/a"}, gpu ${c.gpuValue?.toExponential(4)??"n/a"})`):(n="non-finite",a=`non-finite output at index ${c.nonFiniteIndex}`)),{config:e.config,pass:f,stage:f?"complete":"validation",errorType:f?null:n,errorMessage:f?null:a,maxError:c.maxError,errorIndex:c.errorIndex,cpuValue:c.cpuValue,gpuValue:c.gpuValue,expectedRange:c.expectedRange,actualRange:c.actualRange,nonFiniteIndex:c.nonFiniteIndex,pipelineDeviceId:u.pipelineDeviceId,executionDeviceId:u.executionDeviceId,bindGroupDeviceId:u.bindGroupDeviceId,mismatch:u.mismatch,...m}}catch(o){return tt(e.config,s,n??"exception",a??o.message)}finally{try{e.dispose()}catch{}}}function _e(e,t){const r=t.length>0&&t.every(a=>a.pass),s=t.reduce((a,o)=>Math.max(a,o.maxError),0),n=t.map(a=>`${a.config}:${a.pass?"PASS":"FAIL"}`).join(" ");return{name:e,pass:r,maxError:r?s:-1,details:n,cases:t}}async function Pa(e){const t=new Float32Array(e).fill(1),r=new Float32Array(e).fill(2),s=J(t),n=J(r),a=M(e*4),o=_(bt(e));return ze({name:"VecAdd",config:`N=${e}`,code:et,bindingTypes:wa,workgroups:[Math.ceil(e/64),1,1],entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:a}}],outputBuffer:a,outputBytes:e*4,reference:An(t,r),tolerance:1e-5,dispose:()=>{s.destroy(),n.destroy(),a.destroy(),o.destroy()}})}async function Ca(){const e=[];for(const t of[64,1024,65536])if(e.push(await Pa(t)),!e[e.length-1].pass)break;return _e("VecAdd",e)}async function ka(e){const t=new Float32Array(e*e).fill(1),r=new Float32Array(e*e).fill(.5),s=J(t),n=J(r),a=M(e*e*4),o=_(Sr(e,e,e));return ze({name:"Matmul",config:`${e}×${e}`,code:gt,bindingTypes:yr,workgroups:[Math.ceil(e/16),Math.ceil(e/16),1],entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:a}}],outputBuffer:a,outputBytes:e*e*4,reference:Pn(t,r,e,e,e),tolerance:.001,dispose:()=>{s.destroy(),n.destroy(),a.destroy(),o.destroy()}})}async function Rn(){const e=[];for(const t of[32,64,128])if(e.push(await ka(t)),!e[e.length-1].pass)break;return _e("Matmul",e)}function Ta(e){if(e===1){const b=new Float32Array(25);for(let y=0;y<b.length;y++)b[y]=y+1;const v=new Float32Array([1,0,-1,1,0,-1,1,0,-1]);return{config:"5×5→3×3",N:1,C:1,H:5,W:5,F:1,FH:3,FW:3,input:b,kernel:v}}const t=1,r=2,s=3,n=3,a=1,o=2,i=2,u=new Float32Array(t*r*s*n);for(let l=0;l<u.length;l++)u[l]=l+1;const c=new Float32Array(a*r*o*i).fill(1);return{config:"C=2 (channel indexing)",N:t,C:r,H:s,W:n,F:a,FH:o,FW:i,input:u,kernel:c}}async function Ba(e){const t=Ta(e),{N:r,C:s,H:n,W:a,F:o,FH:i,FW:u}=t,c=n-i+1,l=a-u+1,d=r*o*c*l*4,m=J(t.input),f=J(t.kernel),p=M(d),g=_(Tn(r,s,n,a,o,i,u,c,l));return ze({name:"Conv2D",config:t.config,code:$n,bindingTypes:xa,workgroups:[r,o,c*l],entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}}],outputBuffer:p,outputBytes:d,reference:Cn(t.input,t.kernel,r,s,n,a,o,i,u),tolerance:1e-4,dispose:()=>{m.destroy(),f.destroy(),p.destroy(),g.destroy()}})}async function Ua(){const e=[];for(const t of[1,2])if(e.push(await Ba(t)),!e[e.length-1].pass)break;return _e("Conv2D",e)}function Ra(e){if(e===1)return{rows:2,cols:5,data:new Float32Array([-2,-1,0,1,2,2,1,0,-1,-2])};const t=4,r=16,s=new Float32Array(t*r);for(let n=0;n<s.length;n++)s[n]=n%r*.1-1;return{rows:t,cols:r,data:s}}async function Da(e){const t=Ra(e),r=t.rows,s=t.cols,n=t.data.byteLength,a=hr(r),o=M(n,t.data),i=M(n),u=_(_t(r,s));return ze({name:"Softmax",config:`${r}×${s} (wgX=${a.workgroupsX}, total=${a.totalInvocations})`,code:Lt,bindingTypes:Sa,workgroups:ot(r),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:i}}],outputBuffer:i,outputBytes:n,reference:Ft(t.data,r,s),tolerance:1e-4,extraCheck:c=>{for(let d=0;d<c.length;d++)if(c[d]<-1e-6)return`negative softmax output ${c[d].toExponential(3)} at index ${d}`;const l=xr(c,r,s);for(let d=0;d<r;d++)if(Math.abs(l[d]-1)>1e-4)return`row ${d} sums to ${l[d].toExponential(3)} (expected ≈ 1)`;return null},dispose:()=>{o.destroy(),i.destroy(),u.destroy()}})}async function Oa(){const e=[];for(const t of[1,2])if(e.push(await Da(t)),!e[e.length-1].pass)break;return _e("Softmax",e)}function Ia(e){if(e===1)return{N:8,input:new Float32Array([1,2,3,4,5,6,7,8]),weight:new Float32Array(8).fill(1),eps:1e-6};const t=128,r=new Float32Array(t);for(let s=0;s<t;s++)r[s]=s*37%11*.5+.1;return{N:t,input:r,weight:new Float32Array(t).fill(1),eps:1e-6}}async function Na(e){const t=Ia(e),r=t.N,s=J(t.input),n=J(t.weight),a=M(r*4),o=_(Bn(r,t.eps));return ze({name:"RMSNorm",config:`N=${r}`,code:En,bindingTypes:$a,workgroups:[1,1,1],entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:a}}],outputBuffer:a,outputBytes:r*4,reference:kn(t.input,t.weight,t.eps),tolerance:.001,dispose:()=>{s.destroy(),n.destroy(),a.destroy(),o.destroy()}})}async function Ga(){const e=[];for(const t of[1,2])if(e.push(await Na(t)),!e[e.length-1].pass)break;return _e("RMSNorm",e)}function Dn(e,t){return[Math.max(1,Math.ceil(e*t/64)),1,1]}function La(e,t,r){let s=0,n=null,a=null;const o=new Array(t).fill(!1);for(let c=0;c<e.length;c++)e[c]===$e&&(s++,n===null&&(n=c),a=c,o[Math.floor(c/r)]=!0);let i=0,u=null;for(let c=0;c<t;c++)o[c]?u===null&&(u=c):i++;return{rowsExpected:t,rowsCovered:i,firstMissingRow:u,sentinelCount:s,firstSentinelIndex:n,lastSentinelIndex:a}}function On(e,t,r){return async s=>{const n=La(s,e*t,r),a={rowsExpected:n.rowsExpected,rowsCovered:n.rowsCovered,firstMissingRow:n.firstMissingRow,sentinelCount:n.sentinelCount,firstSentinelIndex:n.firstSentinelIndex,lastSentinelIndex:n.lastSentinelIndex};let o=null;return n.sentinelCount>0&&(o=`UNWRITTEN ATTENTION OUTPUT — ${n.sentinelCount} sentinel(s) remain (first @ ${n.firstSentinelIndex}, last @ ${n.lastSentinelIndex}) — rows covered ${n.rowsCovered}/${n.rowsExpected}`+(n.firstMissingRow!==null?`, first missing row ${n.firstMissingRow}`:"")),{error:o,diag:a}}}async function In(e){const r=k().createShaderModule({code:e});if(typeof r.getCompilationInfo!="function")return null;let s;try{s=await r.getCompilationInfo()}catch(a){return`getCompilationInfo failed: ${a.message}`}const n=s.messages.filter(a=>a.type==="error");return n.length===0?null:n.map(a=>`[line ${a.lineNum}:${a.linePos}] ${a.message}`).join(" | ")}async function Fa(){const n=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),a=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),o=new Float32Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]),i=1*4*4,u=1*4*4,c=qt(1,4,4,.5),l=Un(c,{batch:1,seq:4,dim:4,scale:.5});if(l)return tt("Attention 4x4 Identity (b1-s4-d4)","uniform","uniform-packing",l);const d=await In(ft);if(d)return tt("Attention 4x4 Identity (b1-s4-d4)","shader-compilation","shader-compilation",d);const m=J(n),f=J(a),p=J(o),g=M(i*4,new Float32Array(i).fill($e)),h=M(u*4),b=_(c);return ze({name:"Attention",config:"4x4 Identity (b1-s4-d4)",code:ft,bindingTypes:Mn,workgroups:Dn(1,4),entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}},{binding:4,resource:{buffer:g}},{binding:5,resource:{buffer:h}}],outputBuffer:g,outputBytes:i*4,reference:vr(n,a,o,1,4,4,.5),tolerance:.001,postValidate:On(1,4,4),dispose:()=>{m.destroy(),f.destroy(),p.destroy(),g.destroy(),h.destroy(),b.destroy()}})}async function Nn(e){const s=1/Math.sqrt(64),n=()=>{const y=new Float32Array(1*e*64);for(let S=0;S<y.length;S++)y[S]=(S%64+1)*.1;return y},a=n(),o=n(),i=n(),u=1*e*64,c=1*e*e,l=qt(1,e,64,s),d=Un(l,{batch:1,seq:e,dim:64,scale:s});if(d)return tt(`Attention b1-s${e}-d64`,"uniform","uniform-packing",d);const m=await In(ft);if(m)return tt(`Attention b1-s${e}-d64`,"shader-compilation","shader-compilation",m);const f=J(a),p=J(o),g=J(i),h=M(u*4,new Float32Array(u).fill($e)),b=M(c*4),v=_(l);return ze({name:"Attention",config:`b1-s${e}-d64`,code:ft,bindingTypes:Mn,workgroups:Dn(1,e),entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:g}},{binding:4,resource:{buffer:h}},{binding:5,resource:{buffer:b}}],outputBuffer:h,outputBytes:u*4,reference:vr(a,o,i,1,e,64,s),tolerance:.001,postValidate:On(1,e,64),dispose:()=>{f.destroy(),p.destroy(),g.destroy(),h.destroy(),b.destroy(),v.destroy()}})}async function Gn(){const e=[];if(e.push(await Fa()),!e[e.length-1].pass)return _e("Attention",e);for(const t of[4,16,64,128,256])if(e.push(await Nn(t)),!e[e.length-1].pass)break;return _e("Attention",e)}async function _a(e){fe();const t=[{key:"vectorAdd",name:"VecAdd",fn:Ca},{key:"matmul",name:"Matmul",fn:Rn},{key:"conv2d",name:"Conv2D",fn:Ua},{key:"softmax",name:"Softmax",fn:Oa},{key:"rmsNorm",name:"RMSNorm",fn:Ga},{key:"attention",name:"Attention",fn:Gn}],r=[];for(const s of t){if(I()){r.push({name:s.name,pass:!1,maxError:-1,details:"ABORTED — device lost",cases:[]});break}const n=await s.fn();if(r.push(n),e?.(n),I())break}return r}const qa=["validation","out-of-memory","internal"];function Ln(e){try{if(typeof GPUOutOfMemoryError<"u"&&e instanceof GPUOutOfMemoryError)return"out-of-memory";if(typeof GPUInternalError<"u"&&e instanceof GPUInternalError)return"internal";if(typeof GPUValidationError<"u"&&e instanceof GPUValidationError)return"validation"}catch{}const t=e;return typeof t.name=="string"&&t.name?t.name:"validation"}async function Fn(){if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=await e.requestDevice(),r=[],s={reason:null,message:null};return t.addEventListener("uncapturederror",n=>{const a=n.error;r.push({type:Ln(a),message:a.message})}),t.lost.then(n=>{s.reason=n.reason??"unknown",s.message=n.message??""}),{device:t,uncaptured:r,lost:s}}function _n(e){let t=0;for(const r of qa)try{e.pushErrorScope(r),t++}catch{}return t}async function Bt(e,t){const r=[];for(let s=0;s<t;s++)try{const n=await e.popErrorScope();n&&r.push({type:Ln(n),message:n.message})}catch{}return r}async function qn(e,t){try{return{ok:!0,value:await t()}}catch(r){return{ok:!1,stage:e,error:r instanceof Error?r.message:String(r)}}}const za=`
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
`,Xt=[6,8,10,12];async function Wa(){const e={name:"GPU Sanity",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"[6, 8, 10, 12]",actual:null,exception:null};let t=null,r=0,s=!1,n=null;const a=await qn("request-device",()=>Fn());if(!a.ok)return e.stage=a.stage,e.errorType="exception",e.errorMessage=a.error,e;t=a.value,e.stage="request-device";try{if(t.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;r=_n(t.device);const u=new Float32Array([1,2,3,4]),c=new Float32Array([5,6,7,8]),l=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const d=t.device.createBuffer({size:16,usage:l,mappedAtCreation:!0});new Float32Array(d.getMappedRange()).set(u),d.unmap();const m=t.device.createBuffer({size:16,usage:l,mappedAtCreation:!0});new Float32Array(m.getMappedRange()).set(c),m.unmap();const f=t.device.createBuffer({size:16,usage:l}),p=t.device.createBuffer({size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});e.stage="create-pipeline";const g=t.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),h=t.device.createComputePipeline({layout:t.device.createPipelineLayout({bindGroupLayouts:[g]}),compute:{module:t.device.createShaderModule({code:za}),entryPoint:"main"}});e.stage="create-bind-group";const b=t.device.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:f}}]});e.stage="encode-submit";const v=t.device.createCommandEncoder(),y=v.beginComputePass();y.setPipeline(h),y.setBindGroup(0,b),y.dispatchWorkgroups(1,1,1),y.end(),v.copyBufferToBuffer(f,0,p,0,16),t.device.queue.submit([v.finish()]),e.stage="readback",await p.mapAsync(GPUMapMode.READ);const S=new Float32Array(p.getMappedRange().slice(0));p.unmap(),p.destroy(),e.stage="validate-output",e.scopeErrors=await Bt(t.device,r),s=!0,n=Array.from(S),e.actual=n.join(", "),d.destroy(),m.destroy(),f.destroy()}catch(u){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=u instanceof Error?u.message:String(u)}finally{if(t&&r>0&&!s)try{e.scopeErrors=await Bt(t.device,r)}catch{}}if(e.uncaptured=t.uncaptured,t.lost.reason&&!e.scopeErrors.length&&!e.errorMessage)return e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;if(e.scopeErrors.length>0)return e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e;if(e.uncaptured.length>0)return e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e;if(e.errorMessage)return e.pass=!1,e;const o=n??[],i=o.length===Xt.length&&Xt.every((u,c)=>Math.abs(o[c]-u)<1e-6);return e.pass=i,i||(e.errorType="output-mismatch",e.errorMessage=`expected [${Xt.join(", ")}], got ${e.actual}`),e}async function Ha(){const e={name:"Standalone MatMul 64×64",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"all elements = 32.0",actual:null,exception:null};let t=null,r=0,s=!1,n=null;const a=await qn("request-device",()=>Fn());if(!a.ok)return e.stage=a.stage,e.errorType="exception",e.errorMessage=a.error,e;t=a.value,e.stage="request-device";try{if(t.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;r=_n(t.device);const o=64,i=64,u=o*o,c=new Float32Array(u).fill(1),l=new Float32Array(u).fill(.5),d=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const m=t.device.createBuffer({size:c.byteLength,usage:d,mappedAtCreation:!0});new Float32Array(m.getMappedRange()).set(c),m.unmap();const f=t.device.createBuffer({size:l.byteLength,usage:d,mappedAtCreation:!0});new Float32Array(f.getMappedRange()).set(l),f.unmap();const p=t.device.createBuffer({size:u*4,usage:d}),g=t.device.createBuffer({size:u*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),h=new ArrayBuffer(16),b=new Uint32Array(h);b[0]=o,b[1]=o,b[2]=i;const v=t.device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.device.queue.writeBuffer(v,0,h),e.stage="create-pipeline";const y=br(t.device,yr),S=t.device.createComputePipeline({layout:t.device.createPipelineLayout({bindGroupLayouts:[y]}),compute:{module:t.device.createShaderModule({code:gt}),entryPoint:"main"}});e.stage="create-bind-group";const $=t.device.createBindGroup({layout:y,entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}}]});e.stage="encode-submit";const A=t.device.createCommandEncoder(),R=A.beginComputePass();R.setPipeline(S),R.setBindGroup(0,$),R.dispatchWorkgroups(4,4,1),R.end(),A.copyBufferToBuffer(p,0,g,0,u*4),t.device.queue.submit([A.finish()]),e.stage="readback",await g.mapAsync(GPUMapMode.READ);const L=new Float32Array(g.getMappedRange().slice(0));g.unmap(),g.destroy(),e.stage="validate-output",e.scopeErrors=await Bt(t.device,r),s=!0,n=0;for(let F=0;F<u;F++)n=Math.max(n,Math.abs(L[F]-32));e.actual=`max err = ${n.toExponential(2)}`,m.destroy(),f.destroy(),p.destroy(),v.destroy()}catch(o){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=o instanceof Error?o.message:String(o)}finally{if(t&&r>0&&!s)try{e.scopeErrors=await Bt(t.device,r)}catch{}}return e.uncaptured=t.uncaptured,t.lost.reason&&!e.scopeErrors.length&&!e.errorMessage?(e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e):e.scopeErrors.length>0?(e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e):e.uncaptured.length>0?(e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e):e.errorMessage?(e.pass=!1,e):(e.pass=n!==null&&n<.001,e.pass||(e.errorType="output-mismatch",e.errorMessage=`expected all elements = 32.0, got ${e.actual}`),e)}function en(e){try{if(typeof GPUOutOfMemoryError<"u"&&e instanceof GPUOutOfMemoryError)return"out-of-memory";if(typeof GPUInternalError<"u"&&e instanceof GPUInternalError)return"internal";if(typeof GPUValidationError<"u"&&e instanceof GPUValidationError)return"validation"}catch{}const t=e;return typeof t.name=="string"&&t.name?t.name:"validation"}function ja(e,t){try{return e.pushErrorScope(t),!0}catch{return!1}}async function zn(e){const t=e,r=e,s=e,n=t*t,a=r*1*.5,o=Math.ceil(t/16),i={name:`Minimal Harness MatMul ${t}×${t}`,size:t,pass:!1,stage:"request-device",errorType:null,errorMessage:null,stageResults:{pipeline:!1,"bind-group":!1,dispatch:!1,submission:!1,readback:!1,validation:!1},compilationMessages:[],gpuError:null,uncaptured:[],expected:a,actualMin:null,actualMax:null,maxError:null,nonFinite:0,first16:[],exception:null},u=k();let c=null,l=null,d=null,m=null,f=null,p=null;const g=[];p=y=>{const S=y.error;S&&g.push({type:en(S),message:S.message})},u.addEventListener("uncapturederror",p);const h=[];for(const y of["validation","out-of-memory","internal"])ja(u,y)&&h.push(y);let b=null,v=!1;try{i.stage="create-shader-module";const y=u.createShaderModule({code:gt});if(i.stage="shader-compilation",typeof y.getCompilationInfo=="function"){let Ee;try{Ee=await y.getCompilationInfo()}catch(he){i.compilationMessages.push(`getCompilationInfo failed: ${he.message}`),Ee={messages:[]}}if(i.compilationMessages=Ee.messages.map(he=>`${he.type}: ${he.message}`),Ee.messages.some(he=>he.type==="error"))return i.stage="shader-compilation",i.errorType="shader-compilation",i.errorMessage=i.compilationMessages.join(" | "),i}else i.compilationMessages.push("getCompilationInfo unavailable");i.stageResults.pipeline=!1,i.stage="create-buffers";const S=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,$=new Float32Array(n).fill(1),A=new Float32Array(n).fill(.5);c=u.createBuffer({size:$.byteLength,usage:S,mappedAtCreation:!0}),new Float32Array(c.getMappedRange()).set($),c.unmap(),l=u.createBuffer({size:A.byteLength,usage:S,mappedAtCreation:!0}),new Float32Array(l.getMappedRange()).set(A),l.unmap(),d=u.createBuffer({size:n*4,usage:S}),i.stage="create-uniform";const R=new ArrayBuffer(16),L=new Uint32Array(R);L[0]=s,L[1]=t,L[2]=r,m=u.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u.queue.writeBuffer(m,0,R),i.stage="create-pipeline";const F=br(u,yr),j=u.createComputePipeline({layout:u.createPipelineLayout({bindGroupLayouts:[F]}),compute:{module:y,entryPoint:"main"}});i.stageResults.pipeline=!0,i.stage="create-bind-group";const ie=u.createBindGroup({layout:F,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:d}}]});i.stageResults["bind-group"]=!0,i.stage="create-staging",f=u.createBuffer({size:n*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),i.stage="encode";const ee=u.createCommandEncoder(),te=ee.beginComputePass();i.stage="set-pipeline",te.setPipeline(j),i.stage="set-bind-group",te.setBindGroup(0,ie),i.stage="dispatch",te.dispatchWorkgroups(o,o,1),te.end(),i.stageResults.dispatch=!0,i.stage="submit",ee.copyBufferToBuffer(d,0,f,0,n*4),u.queue.submit([ee.finish()]),i.stageResults.submission=!0,i.stage="readback",await f.mapAsync(GPUMapMode.READ);const X=new Float32Array(f.getMappedRange().slice(0));f.unmap(),i.stageResults.readback=!0,i.stage="validation";let G=1/0,je=-1/0,ht=0,Yt=0;for(let Ee=0;Ee<n;Ee++){const Ie=X[Ee];if(!Number.isFinite(Ie)){Yt++;continue}Ie<G&&(G=Ie),Ie>je&&(je=Ie);const he=Math.abs(Ie-a);he>ht&&(ht=he)}i.actualMin=Number.isFinite(G)?G:null,i.actualMax=Number.isFinite(je)?je:null,i.maxError=ht,i.nonFinite=Yt,i.first16=Array.from(X.slice(0,16)),i.stageResults.validation=Yt===0&&ht<.001,f.destroy(),f=null}catch(y){i.pass=!1,i.stage=i.stage||"unknown",i.errorType="exception",i.exception=y instanceof Error?y.message:String(y),i.errorMessage=i.exception}finally{if(!v){for(const y of h.slice().reverse())try{const S=await u.popErrorScope();S&&!b&&(b={type:en(S),message:S.message})}catch{}v=!0}i.gpuError=b?`${b.type}: ${b.message}`:null,p&&(u.removeEventListener("uncapturederror",p),p=null);try{c?.destroy()}catch{}try{l?.destroy()}catch{}try{d?.destroy()}catch{}try{m?.destroy()}catch{}try{f?.destroy()}catch{}}return i.errorMessage?(i.pass=!1,i):b?(i.pass=!1,i.stage="gpu-error",i.errorType=b.type,i.errorMessage=`GPU Error: ${b.message}`,i):g.length?(i.pass=!1,i.stage="uncaptured",i.errorType="uncaptured-error",i.errorMessage=g.map(y=>`${y.type}: ${y.message}`).join(" | "),i):(i.uncaptured=g.map(y=>`${y.type}: ${y.message}`),i.pass=i.stageResults.validation,i.pass||(i.stage="validation",i.errorType="output-mismatch",i.errorMessage=`expected all elements = ${a} (min ${a}, max ${a}, nonFinite 0), got range [${i.actualMin}, ${i.actualMax}], maxErr ${i.maxError?.toExponential(2)}, nonFinite ${i.nonFinite}`),i.pass&&(i.stage="complete"),i)}async function Va(){const e=k(),t=Gt(e),r=await zn(64);return{name:"Shared-Device Direct MatMul 64×64",pass:r.pass,stage:r.stage||"complete",errorType:r.errorType,errorMessage:r.errorMessage,maxError:r.maxError,executionDeviceId:t,pipelineDeviceId:t,bindGroupDeviceId:t,mismatch:!1}}function Wn(...e){for(const t of e)if(t)return t}const Et=Wn("0ef39eb05ce63ae1fee6b286d043e3e31c1c4c7c"),Hn=Wn("2026-09-08T06:35:01.620Z"),rt=Et??Hn??`dev-${Date.now().toString(36)}`,Ut=Et&&/^[0-9a-f]{40}$/.test(Et)?Et:null,pt=Hn??"";let Ka=0,tn=Promise.resolve();class Ya{id;size=4;device;src;dst;constructor(t){this.device=t,this.id=++Ka,this.src=t.createBuffer({label:`CompletionToken_${this.id}_src`,size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.dst=t.createBuffer({label:`CompletionToken_${this.id}_dst`,size:4,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST})}encode(t){t.copyBufferToBuffer(this.src,0,this.dst,0,4)}destroy(){try{this.src.destroy(),this.dst.destroy()}catch{}}}async function Zt(e,t,r="completion"){const s=tn.then(async()=>{B.onMapBegin();try{try{await t.dst.mapAsync(GPUMapMode.READ,0,t.size)}catch(a){throw new Error(`CompletionToken await FAIL [${r}] — ${a.message??String(a)}`)}B.onCompletionRead();const n=t.dst.getMappedRange(0,t.size);new Uint32Array(n),t.dst.unmap()}finally{B.onMapEnd()}});return tn=s.then(()=>{},()=>{}),s}function Qa(e,t,r,s,n){const a=e.length,o=[...e].sort((l,d)=>l-d),i=a>0?e.reduce((l,d)=>l+d,0)/a:0,u=a>0?o[Math.floor(a/2)]:0,c=a>0?e.reduce((l,d)=>l+(d-i)*(d-i),0)/a:0;return{mode:t,iterations:a,warmup:s,avgMs:i,medianMs:u,minMs:a>0?o[0]:0,maxMs:a>0?o[a-1]:0,stdDevMs:Math.sqrt(c),samplesMs:o,note:n}}class zt{device;_mode;_querySet=null;_resolve=null;_periodNs=1;_fallbackLogged=null;_completion;constructor(t){this.device=t;const r=this.tryEnableTimestamps(t);this._mode=r?"GPU_TIMESTAMP":"END_TO_END",this._completion=new Ya(t)}tryEnableTimestamps(t){return!1}get mode(){return this._mode}get fallbackNote(){return this._fallbackLogged}async measure(t,r){const s=r.warmup??3;for(let a=0;a<s;a++){const o=this.dispatchPass(t);B.onCommandBufferCreated(),this._completion.encode(o);const i=o.finish();this.device.queue.submit([i]),B.onCommandBufferSubmitted("warmup"),await Zt(this.device,this._completion,`measure-warmup-${a}`)}const n=[];for(let a=0;a<r.iterations;a++){let o;if(this._mode==="GPU_TIMESTAMP"){const i=await this.measureTimestampPass(t);i===null?(this.fallback("timestamp query returned zero/undefined values — switched to END_TO_END"),o=await this.measureEndToEnd(t,r.wait)):o=i}else o=await this.measureEndToEnd(t,r.wait);n.push(o)}return Qa(n,this._mode,r.iterations,s,this._fallbackLogged??void 0)}dispatchPass(t,r){const s=this.device.createCommandEncoder(),n=s.beginComputePass(r?{timestampWrites:r}:void 0);return t(n),n.end(),s}async timeOne(t,r){if(this._mode==="GPU_TIMESTAMP"){const s=await this.measureTimestampPass(t);if(s!==null)return s;this.fallback("timestamp query returned zero/undefined values — switched to END_TO_END")}return this.measureEndToEnd(t,r)}async measureTimestampPass(t){if(!this._querySet||!this._resolve)return null;try{const r=this.dispatchPass(t,{querySet:this._querySet,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1});r.resolveQuerySet(this._querySet,0,2,this._resolve,0),B.onCommandBufferCreated(),this.device.queue.submit([r.finish()]),B.onCommandBufferSubmitted("measurement");const s=await re.getInstance().copyAndRead(this.device,this._resolve,16,"measureTimestampPass"),n=new BigUint64Array(s.buffer),a=Number(n[1]-n[0]);return a>0?a*this._periodNs/1e6:null}catch{return null}}async measureEndToEnd(t,r){const s=performance.now(),n=this.dispatchPass(t);this._completion.encode(n),B.onCommandBufferCreated();const a=n.finish();return this.device.queue.submit([a]),B.onCommandBufferSubmitted("measurement"),r?await r():await Zt(this.device,this._completion,"measure-end-to-end"),performance.now()-s}async sync(){try{const t=this.device.createCommandEncoder();B.onCommandBufferCreated(),this._completion.encode(t),this.device.queue.submit([t.finish()]),B.onCommandBufferSubmitted("sync"),await Zt(this.device,this._completion,"sync")}catch{await new Promise(t=>setTimeout(t,16))}}fallback(t){this._fallbackLogged||(this._fallbackLogged=t),this._mode="END_TO_END";try{this._querySet?.destroy(),this._resolve?.destroy()}catch{}this._querySet=null,this._resolve=null}destroy(){try{this._querySet?.destroy(),this._resolve?.destroy(),this._completion.destroy()}catch{}this._querySet=null,this._resolve=null}}const rn=["uniform","read-only-storage","read-only-storage","storage"],nn=["uniform","read-only-storage","read-only-storage","storage"],jn=`
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
`,Xa=`
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
`;function Rt(e,t){return{value:e/(t/1e3)/1e9,unit:"GFLOPS"}}function Za(e,t){return{value:e/(t/1e3)/1e9,unit:"GB/s (estimate)"}}function Je(e){for(let t=0;t<e.length;t++)if(!Number.isFinite(e[t]))return!1;return!0}function Ja(e){for(let t=0;t<e.length;t++)if(e[t]===$e)return t;return-1}function eo(e){return`rows=${e.rows} wgSize=${e.workgroupSize} wgX=${e.workgroupsX} total=${e.totalInvocations}`}function to(e,t,r){let s=0;for(let n=0;n<t;n++){let a=0;for(let o=0;o<r;o++)a+=e[n*r+o];s=Math.max(s,Math.abs(a-1))}return{ok:s<=.01,maxDev:s}}function ro(e){let t=0;for(let r=0;r<e.length;r++)e[r]===$e&&t++;return t}function Le(e,t){let r=0;const s=Math.min(e.length,t.length);for(let n=0;n<s;n++)r=Math.max(r,Math.abs(e[n]-t[n]));return r}function ce(e,t,r,s){return new Error(`${e} ${t}: ${r} (${s}) — fix correctness before benchmarking`)}function it(e,t,r,s,n){if(!Je(r))throw ce(e,t,"non-finite output","");if(r.length!==s.length)throw ce(e,t,"length mismatch",`${r.length} vs ${s.length}`);const a=Le(r,s);if(a>Math.max(n,Le(s,new Float32Array(s.length))*.01))throw ce(e,t,`correctness check failed (maxErr=${a.toExponential(2)})`,"")}async function Z(e,t,r,s,n,a="dispatchToAndRead"){const o=k(),i=re.getInstance(),u=i.acquire(o,n),c=o.createCommandEncoder({label:`Enc_${a}`});B.onCommandBufferCreated();const l=c.beginComputePass();return l.setPipeline(e),l.setBindGroup(0,t),l.dispatchWorkgroups(r[0],r[1],r[2]),l.end(),c.copyBufferToBuffer(s,0,u,0,n),o.queue.submit([c.finish()]),B.onCommandBufferSubmitted("other"),i.readSubmittedCopy(o,u,n,a)}function de(e){let t=2654435769;for(let r=0;r<e.length;r++)t=t*1664525+1013904223>>>0,e[r]=t%2001/1e3-1}function we(e,t,r,s,n,a){return{id:e,name:t,size:r,timingMode:s.mode,iterations:s.iterations,warmup:s.warmup,medianMs:s.medianMs,averageMs:s.avgMs,minMs:s.minMs,maxMs:s.maxMs,stdDevMs:s.stdDevMs,throughput:n,note:a}}const no=[{size:128,iterations:12,validate:!0},{size:256,iterations:12,validate:!0},{size:512,iterations:10,validate:!1},{size:1024,iterations:10,validate:!1}];async function so(e,t){const r=[];for(const s of no){const n=s.size;if(t&&!t.has(`matmul-${n}`))continue;const a=n*n*4,o=new Float32Array(n*n),i=new Float32Array(n*n);de(o),de(i);const u=M(a,o),c=M(a,i),l=M(a),d=Sr(n,n,n);Aa(d);const m=_(d),f=V(gt,["uniform","read-only-storage","read-only-storage","storage"]),p=W(f,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:l}}]),g=[n/16,n/16,1];try{const h=await Z(f,p,g,l,a,`matmul-${n}`);if(s.validate){const v=Pn(o,i,n,n,n);it("matmul",`${n}×${n}`,h,v,.01)}else if(!Je(h))throw ce("matmul",`${n}×${n}`,"non-finite output","");const b=await e.measure(v=>{v.setPipeline(f),v.setBindGroup(0,p),v.dispatchWorkgroups(g[0],g[1],g[2])},{iterations:s.iterations});r.push(we(`matmul-${n}`,"Matrix Multiply",`${n}×${n}`,b,Rt(2*n*n*n,b.medianMs)))}finally{u.destroy(),c.destroy(),l.destroy(),m.destroy()}}return r}const ao=[{n:1e3,iterations:12},{n:16e3,iterations:12},{n:64e3,iterations:12},{n:262144,iterations:10},{n:1048576,iterations:10},{n:4194304,iterations:8}];async function oo(e,t){const r=[];for(const s of ao){const n=s.n;if(t&&!t.has(`vecadd-${n}`))continue;const a=n*4,o=new Float32Array(n),i=new Float32Array(n);de(o),de(i);const u=M(a,o),c=M(a,i),l=M(a),d=_(bt(n)),m=V(et,["uniform","read-only-storage","read-only-storage","storage"]),f=W(m,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:l}}]),g=[Math.ceil(n/64),1,1];try{const h=await Z(m,f,g,l,a,`vecadd-${n}`),b=An(o,i);it("vecadd",`${n.toLocaleString("en-US")} elements`,h,b,.01);const v=await e.measure(y=>{y.setPipeline(m),y.setBindGroup(0,f),y.dispatchWorkgroups(g[0],g[1],g[2])},{iterations:s.iterations});r.push(we(`vecadd-${n}`,"Vector Add",`${n.toLocaleString("en-US")} elements`,v,Za(3*n*4,v.medianMs)))}finally{u.destroy(),c.destroy(),l.destroy(),d.destroy()}}return r}const io=[{inputChannels:1,outputChannels:1,rows:32,cols:32,iterations:10},{inputChannels:1,outputChannels:8,rows:64,cols:64,iterations:8},{inputChannels:1,outputChannels:16,rows:128,cols:128,iterations:6}];async function uo(e,t){const r=[];for(const s of io){const n=s.inputChannels,a=s.rows,o=s.cols,i=s.outputChannels,u=3,c=3,l=a-u+1,d=o-c+1,m=i*l*d*4,f=new Float32Array(n*a*o),p=new Float32Array(i*n*u*c);de(f),de(p);const g=M(n*a*o*4,f),h=M(i*n*u*c*4,p),b=M(m),v=_(Tn(1,n,a,o,i,u,c,l,d)),y=V($n,["uniform","read-only-storage","read-only-storage","storage"]),S=W(y,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:g}},{binding:2,resource:{buffer:h}},{binding:3,resource:{buffer:b}}]),$=l*d,A=[1,i,$];try{const R=await Z(y,S,A,b,m,`conv2d-${n}-${i}-${a}`),L=Cn(f,p,1,n,a,o,i,u,c);it("conv2d",`${n}×${a}×${o} → ${i}×${l}×${d}`,R,L,.001);const F=await e.measure(j=>{j.setPipeline(y),j.setBindGroup(0,S),j.dispatchWorkgroups(A[0],A[1],A[2])},{iterations:s.iterations});r.push(we(`conv2d-${n}-${i}-${a}`,"Convolution 3×3",`${n}→${i} ch, ${a}×${o} → ${l}×${d}`,F))}finally{g.destroy(),h.destroy(),b.destroy(),v.destroy()}}return r}const co=[{rows:128,cols:128,iterations:12},{rows:256,cols:256,iterations:12},{rows:512,cols:512,iterations:10}];async function lo(e,t){const r=[];for(const s of co){const{rows:n,cols:a,iterations:o}=s;if(t&&!t.has(`softmax-${n}`))continue;const i=new Float32Array(n*a);de(i);const u=n*a*4,c=M(u,i),l=M(u),d=_(_t(n,a)),m=V(Lt,["uniform","read-only-storage","storage"]),f=W(m,["uniform","read-only-storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:l}}]),p=ot(n);try{const g=await Z(m,f,p,l,u,`softmax-${n}`),h=Ft(i,n,a);it("softmax",`${n}×${a}`,g,h,.001);const b=await e.measure(v=>{v.setPipeline(m),v.setBindGroup(0,f),v.dispatchWorkgroups(p[0],p[1],p[2])},{iterations:o});r.push(we(`softmax-${n}`,"Softmax",`${n}×${a}`,b))}finally{c.destroy(),l.destroy(),d.destroy()}}return r}const fo=[{size:256,iterations:12},{size:512,iterations:12},{size:1024,iterations:12},{size:2048,iterations:10},{size:4096,iterations:10}];async function po(e,t){const r=[];for(const s of fo){const{size:n,iterations:a}=s;if(t&&!t.has(`rmsnorm-${n}`))continue;const o=new Float32Array(n);de(o);const i=new Float32Array(n);for(let b=0;b<n;b++)i[b]=1+b%7*.01;const u=1e-6,c=n*4,l=M(c,o),d=M(c,i),m=M(c),f=_(Bn(n,u)),p=V(En,["uniform","read-only-storage","read-only-storage","storage"]),g=W(p,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:d}},{binding:3,resource:{buffer:m}}]),h=[1,1,1];try{const b=await Z(p,g,h,m,c,`rmsnorm-${n}`),v=kn(o,i,u);it("rmsnorm",String(n),b,v,.001);const y=await e.measure(S=>{S.setPipeline(p),S.setBindGroup(0,g),S.dispatchWorkgroups(h[0],h[1],h[2])},{iterations:a});r.push(we(`rmsnorm-${n}`,"RMSNorm",String(n),y))}finally{l.destroy(),d.destroy(),m.destroy(),f.destroy()}}return r}const mo=[{seq:128,iterations:10,validate:!0},{seq:256,iterations:10,validate:!0},{seq:512,iterations:8,validate:!0},{seq:1024,iterations:6,validate:!1}];function Vn(e,t,r=1){const s=new Float32Array(r*e*t),n=new Float32Array(r*e*t),a=new Float32Array(r*e*t);return de(s),de(n),de(a),{Q:s,K:n,V:a,scale:1/Math.sqrt(t)}}function go(e,t,r=1){const{Q:s,K:n,V:a,scale:o}=Vn(e,t,r),i=new Float32Array(r*e*e);for(let l=0;l<r;l++)for(let d=0;d<e;d++)for(let m=0;m<e;m++){let f=0;for(let p=0;p<t;p++)f+=s[(l*e+d)*t+p]*n[(l*e+m)*t+p];i[l*e*e+d*e+m]=f*o}const u=Ft(i,r*e,e),c=vr(s,n,a,r,e,t,o);return{Q:s,K:n,V:a,scores:i,probs:u,out:c}}let bo=0;const $r=[];function fr(){return $r.slice()}async function ho(e,t){const r=[],s={};for(const n of mo){const{seq:a,iterations:o}=n;if(t&&!t.includes(a))continue;const i=64,u=1,c=a*a*4;if(a*a>1<<24){r.push(wt(`attention-${a}`,"Attention (single pass)",`seq=${a} dim=64 batch=1`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")),s[`seq=${a}`]=[wt(`attention-skip-${a}`,"Attention phases",`seq=${a}`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")];continue}let l;try{l=await jt(a,i,u)}catch{r.push(wt(`attention-${a}`,"Attention (single pass)",`seq=${a} dim=64 batch=1 scores=${(c/(1024*1024)).toFixed(1)} MiB`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")),s[`seq=${a}`]=[wt(`attention-skip-${a}`,"Attention phases",`seq=${a}`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")];continue}try{const d=[Math.max(1,Math.ceil(u*a/64)),1,1],m=await Z(l.pipelines.total,l.groups.total,d,l.bufs.out,a*i*4,`attention-${a}`),f=Ja(m);if(f>=0){const g=Math.floor(f/i);throw ce("attention",`seq=${a}`,"UNWRITTEN ATTENTION OUTPUT",`sentinel remains @ index ${f} (row ${g}); rows not fully written — fix correctness before benchmarking`)}if(n.validate)it("attention",`seq=${a}`,m,l.ref.out,.01);else if(!Je(m))throw ce("attention",`seq=${a}`,"non-finite output","");const p=await e.measure(g=>{g.setPipeline(l.pipelines.total),g.setBindGroup(0,l.groups.total),g.dispatchWorkgroups(d[0],d[1],d[2])},{iterations:o});r.push(we(`attention-${a}`,"Attention (single pass)",`seq=${a} dim=64 batch=1`,p,Rt(4*a*a*i,p.medianMs),"QK^T + softmax + PV in one pass")),s[`seq=${a}`]=await yo(e,a,i,o)}finally{We(l)}}return{main:r,phases:s}}function Er(e,t=64,r=1){return{seq:e,dim:t,batch:r,wgQ:[Math.ceil(e/64),r,1],wgP:[Math.ceil(e/64),t,r],wgSoft:ot(e),softInfo:hr(e),scoresBytes:e*e*4,outBytes:e*t*4}}async function Wt(e,t=64,r=1){const s=Er(e,t,r),n=await jt(e,t,r,"correctness",!0);if(!n.ref)throw ce("attention.phase",`seq=${e}`,"internal","ref missing for correctness context");try{const a=await Z(n.pipelines.qkt,n.groups.qkt,s.wgQ,n.bufs.scores,s.scoresBytes,`attention.qkt-correctness-${e}`),o=Le(a,n.ref.scores);if(!Je(a)||o>.01)throw ce("attention.qkt",`seq=${e}`,"phase correctness check failed",`maxErr=${o.toExponential(2)}`);await Z(n.pipelines.qkt,n.groups.qkt,s.wgQ,n.bufs.scores,s.scoresBytes,`attention.soft-prep-${e}`);const i=await Z(n.pipelines.soft,n.groups.soft,s.wgSoft,n.bufs.probs,s.scoresBytes,`attention.soft-correctness-${e}`),u=Le(i,n.ref.probs);if(i.length!==n.ref.probs.length||!Je(i)||u>.01)throw ce("attention.softmax",`seq=${e}`,"phase correctness check failed",`maxErr=${u.toExponential(2)}`);const c=to(i,e,e);if(!c.ok)throw ce("attention.softmax",`seq=${e}`,"phase correctness check failed",`row sum max dev=${c.maxDev.toExponential(3)}`);await Z(n.pipelines.qkt,n.groups.qkt,s.wgQ,n.bufs.scores,s.scoresBytes,`attention.pv-prep1-${e}`),await Z(n.pipelines.soft,n.groups.soft,s.wgSoft,n.bufs.probs,s.scoresBytes,`attention.pv-prep2-${e}`);const l=await Z(n.pipelines.pv,n.groups.pv,s.wgP,n.bufs.out,s.outBytes,`attention.pv-correctness-${e}`),d=Le(l,n.ref.out);if(!Je(l)||d>.01)throw ce("attention.pv",`seq=${e}`,"phase correctness check failed",`maxErr=${d.toExponential(2)}`);return{maxErrs:{qkt:o,soft:u,pv:d},rowSumMaxDev:c.maxDev}}finally{We(n)}}function Jt(e,t,r,s="dispatchOnce"){const n=k(),a=n.createCommandEncoder({label:`Enc_${s}`});B.onCommandBufferCreated();const o=a.beginComputePass();o.setPipeline(e),o.setBindGroup(0,t),o.dispatchWorkgroups(r[0],r[1],r[2]),o.end(),n.queue.submit([a.finish()]),B.onCommandBufferSubmitted("other")}async function Ht(e,t=64,r=1){return await jt(e,t,r,"benchmark",!1)}async function Mt(e,t,r,s){const n=Er(t.seq,t.dim,t.batch);r==="softmax"?Jt(t.pipelines.qkt,t.groups.qkt,n.wgQ,`soft-prep-${t.seq}`):r==="pv"&&(Jt(t.pipelines.qkt,t.groups.qkt,n.wgQ,`pv-prep1-${t.seq}`),Jt(t.pipelines.soft,t.groups.soft,n.wgSoft,`pv-prep2-${t.seq}`));const{pipeline:a,bg:o,wg:i}=r==="qkt"?{pipeline:t.pipelines.qkt,bg:t.groups.qkt,wg:n.wgQ}:r==="softmax"?{pipeline:t.pipelines.soft,bg:t.groups.soft,wg:n.wgSoft}:{pipeline:t.pipelines.pv,bg:t.groups.pv,wg:n.wgP};return await e.measure(u=>{u.setPipeline(a),u.setBindGroup(0,o),u.dispatchWorkgroups(i[0],i[1],i[2])},{iterations:s})}async function yo(e,t,r,s){try{await Wt(t,r,1)}catch(o){throw new Error(`Attention phase correctness failed — fix correctness before benchmarking. ${o.message}`)}const a=await Ht(t,r,1);try{return await Mr(e,a,s)}finally{We(a)}}async function Mr(e,t,r){const s=Er(t.seq,t.dim,t.batch),n=await Mt(e,t,"qkt",r),a=await Mt(e,t,"softmax",r),o=await Mt(e,t,"pv",r);return[we(`attention-qkt-${t.seq}`,"QK^T (scores)",`seq=${t.seq} dim=${t.dim}`,n,Rt(2*t.seq*t.seq*t.dim,n.medianMs)),we(`attention-softmax-${t.seq}`,"Softmax on scores",`seq=${t.seq} rows=${t.seq} ${eo(s.softInfo)}`,a),we(`attention-pv-${t.seq}`,"Softmax × V",`seq=${t.seq} dim=${t.dim}`,o,Rt(2*t.seq*t.seq*t.dim,o.medianMs))]}function wt(e,t,r,s){return{id:e,name:t,size:r,timingMode:"END_TO_END",iterations:0,warmup:0,medianMs:0,averageMs:0,minMs:0,maxMs:0,stdDevMs:0,note:s}}async function jt(e,t,r,s="main",n=!0){const a=++bo;$r.push({id:a,kind:s,destroyed:!1});const o=Vn(e,t,r),i=n?go(e,t,r):null,u=o.scale,c=M(e*t*4,o.Q),l=M(e*t*4,o.K),d=M(e*t*4,o.V),m=M(e*t*4,new Float32Array(e*t).fill($e)),f=M(e*e*4),p=M(e*e*4),g=_(qt(r,e,t,u)),h=_(_t(e,e)),b=V(ft,["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"]),v=V(jn,[...rn]),y=V(Lt,["uniform","read-only-storage","storage"]),S=V(Xa,[...nn]),$=W(b,["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"],[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:d}},{binding:4,resource:{buffer:m}},{binding:5,resource:{buffer:f}}]),A=W(v,rn,[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:f}}]),R=W(y,["uniform","read-only-storage","storage"],[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}}]),L=W(S,nn,[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:d}},{binding:3,resource:{buffer:m}}]);return{kind:s,ctxId:a,destroyed:!1,seq:e,dim:t,batch:r,pipelines:{total:b,qkt:v,soft:y,pv:S},groups:{total:$,qkt:A,soft:R,pv:L},bufs:{q:c,k:l,v:d,out:m,scores:f,probs:p},softUniform:h,ref:i?{scores:i.scores,probs:i.probs,out:i.out}:null}}function We(e){if(e.destroyed)return;try{e.bufs.q.destroy(),e.bufs.k.destroy(),e.bufs.v.destroy(),e.bufs.out.destroy(),e.bufs.scores.destroy(),e.bufs.probs.destroy(),e.softUniform.destroy()}catch{}e.destroyed=!0;const t=$r.find(r=>r.id===e.ctxId);t&&(t.destroyed=!0)}async function vo(e=[4,16,64,128,256]){const t=k(),r=64,s=1,n=[];for(const a of e){const o=s*a,i=va(o),u=await jt(a,r,s,"correctness",!0);try{let c="qkt",l=null,d=null;const m=u.ref,f=[Math.ceil(o/64),s,1],p=await Z(u.pipelines.qkt,u.groups.qkt,f,u.bufs.scores,a*a*4,`phase-softmax-qkt-${a}`);Le(p,m.scores)>.01&&(l="phase-qkt-mismatch",d=`QK^T scores maxErr=${Le(p,m.scores).toExponential(2)}`),t.queue.writeBuffer(u.bufs.probs,0,new Float32Array(a*a).fill($e));const g=ot(o),h=await Z(u.pipelines.soft,u.groups.soft,g,u.bufs.probs,a*a*4,`phase-softmax-soft-${a}`);c=l===null?"softmax-validation":"qkt";let b=wr(h,m.probs,.01);l===null&&!b.pass&&(l="softmax-mismatch",d=`maxErr=${b.maxError.toExponential(2)} @ idx ${b.errorIndex} (cpu ${b.cpuValue?.toExponential(4)} gpu ${b.gpuValue?.toExponential(4)})`);const v=xr(h,o,a);let y=1/0,S=-1/0;for(const A of v)y=Math.min(y,A),S=Math.max(S,A);l===null&&(y<1-.01||S>1+.01)&&(l="softmax-row-sum",d=`row sums deviate: min=${y.toExponential(3)} max=${S.toExponential(3)}`);const $=ro(h);l===null&&$>0&&(l="softmax-unwritten-output",d=`${$} sentinel(s) remain after softmax`),n.push({seq:a,pass:l===null,stage:c,errorType:l,errorMessage:d,rows:o,workgroupsX:i.workgroupsX,totalInvocations:i.totalInvocations,maxError:b.maxError,errorIndex:b.errorIndex,cpuValue:b.cpuValue,gpuValue:b.gpuValue,expectedRange:b.expectedRange,actualRange:b.actualRange,rowSumsMin:y===1/0?-1:y,rowSumsMax:S===-1/0?-1:S,sentinelCount:$})}finally{We(u)}}return n}const Te=30,Kn=65536;function wo(){return{pipeline:V(et,["uniform","read-only-storage","read-only-storage","storage"])}}function Be(e){if(e.length===0)return 0;const t=[...e].sort((r,s)=>r-s);return t[Math.floor(t.length/2)]}async function nt(e){const t=performance.now();return await e(),performance.now()-t}const xo=[1,4,8,16,32,64,128];async function So(){const e=k(),t=[],r=[];let s=!1;for(const n of xo){if(s){t.push({id:`memory-${n}-mib`,requestedBytes:n*1024*1024,requestedMiB:n,created:!1,success:!1,note:"not attempted (previous allocation failed)"});continue}const a=n*1024*1024;let o=!1,i=!1,u;try{const c=M(a);o=!0,r.push(c);const{error:l}=await ya(e,"memory-allocate",async()=>(await xe(c,4),!0));i=!l,u=l?`GPU error while forcing allocation: ${l}`:void 0}catch(c){u=c.message}t.push({id:`memory-${n}-mib`,requestedBytes:a,requestedMiB:n,created:o,success:i,note:u}),i||(s=!0)}for(const n of r)try{n.destroy()}catch{}return t}async function $o(){const{pipeline:e}=wo(),t=Kn,r=t*4,s=[Math.ceil(t/64),1,1],n=new Float32Array(t),a=new Float32Array(t);for(let f=0;f<t;f++)n[f]=f%100/25-2,a[f]=f%77/13-3;const o=_(bt(t)),i=[];for(let f=0;f<Te;f++){const p=await nt(async()=>{const g=M(r,n),h=M(r,a),b=M(r),v=W(e,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:g}},{binding:2,resource:{buffer:h}},{binding:3,resource:{buffer:b}}]),y=k().createCommandEncoder(),S=y.beginComputePass();S.setPipeline(e),S.setBindGroup(0,v),S.dispatchWorkgroups(s[0],s[1],s[2]),S.end(),k().queue.submit([y.finish()]),await xe(b,r),g.destroy(),h.destroy(),b.destroy()});i.push(p)}const u=M(r,n),c=M(r,a),l=M(r),d=W(e,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:l}}]),m=[];for(let f=0;f<Te;f++){const p=await nt(async()=>{const g=k().createCommandEncoder(),h=g.beginComputePass();h.setPipeline(e),h.setBindGroup(0,d),h.dispatchWorkgroups(s[0],s[1],s[2]),h.end(),k().queue.submit([g.finish()]),await xe(l,r)});m.push(p)}return{allocateDestroy:{id:"buffer-allocate-destroy",name:"Allocate + Destroy per op",size:`${sn(3*t*4)} (3 × VecAdd buffers)`,timingMode:"END_TO_END",perOpMs:Be(i),totalMs:i.reduce((f,p)=>f+p,0),iterations:Te,samplesMs:[...i].sort((f,p)=>f-p),note:"full op = create 3 buffers + bind group + dispatch + readback + destroy"},bufferReuse:{id:"buffer-reuse",name:"Reuse persistent buffers",size:`${sn(3*t*4)} (3 × VecAdd buffers)`,timingMode:"END_TO_END",perOpMs:Be(m),totalMs:m.reduce((f,p)=>f+p,0),iterations:Te,samplesMs:[...m].sort((f,p)=>f-p),note:"full op = dispatch + readback on pre-allocated buffers"}}}async function Eo(){const e=Kn,t=e*4,r=[Math.ceil(e/64),1,1],s=new Float32Array(e),n=new Float32Array(e);for(let f=0;f<e;f++)s[f]=f%100/25-2,n[f]=f%77/13-3;const a=M(t,s),o=M(t,n),i=M(t),u=_(bt(e)),c=[];for(let f=0;f<Te;f++){const p=await nt(async()=>{const g=V(et,["uniform","read-only-storage","read-only-storage","storage"]),h=W(g,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:i}}]),b=k().createCommandEncoder(),v=b.beginComputePass();v.setPipeline(g),v.setBindGroup(0,h),v.dispatchWorkgroups(r[0],r[1],r[2]),v.end(),k().queue.submit([b.finish()]),await xe(i,t),typeof g.destroy=="function"&&g.destroy()});c.push(p)}const l=V(et,["uniform","read-only-storage","read-only-storage","storage"]),d=W(l,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:i}}]),m=[];for(let f=0;f<Te;f++){const p=await nt(async()=>{const g=k().createCommandEncoder(),h=g.beginComputePass();h.setPipeline(l),h.setBindGroup(0,d),h.dispatchWorkgroups(r[0],r[1],r[2]),h.end(),k().queue.submit([g.finish()]),await xe(i,t)});m.push(p)}return{recreate:{id:"pipeline-recreate",name:"Recreate pipeline per op",size:"VecAdd 65536",timingMode:"END_TO_END",perOpMs:Be(c),totalMs:c.reduce((f,p)=>f+p,0),iterations:Te,samplesMs:[...c].sort((f,p)=>f-p),note:"full op = createPipeline + bind group + dispatch + readback"},cached:{id:"pipeline-cached",name:"Cached pipeline",size:"VecAdd 65536",timingMode:"END_TO_END",perOpMs:Be(m),totalMs:m.reduce((f,p)=>f+p,0),iterations:Te,samplesMs:[...m].sort((f,p)=>f-p),note:"full op = dispatch + readback on a pre-built pipeline"}}}const Ae=8,er=4096;async function Mo(){const e=er,t=e*4,r=[Math.ceil(e/64),1,1],s=new Float32Array(e),n=new Float32Array(e);for(let f=0;f<e;f++)s[f]=f%100/25-2,n[f]=f%77/13-3;const a=_(bt(e)),o=M(t,s),i=M(t,n),u=M(t),c=V(et,["uniform","read-only-storage","read-only-storage","storage"]),l=W(c,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:a}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:u}}]),d=[];for(let f=0;f<20;f++){const p=await nt(async()=>{const g=[];for(let h=0;h<Ae;h++){const b=k().createCommandEncoder(),v=b.beginComputePass();v.setPipeline(c),v.setBindGroup(0,l),v.dispatchWorkgroups(r[0],r[1],r[2]),v.end(),g.push(b)}for(const h of g)k().queue.submit([h.finish()]);await xe(u,t)});d.push(p)}const m=[];for(let f=0;f<20;f++){const p=await nt(async()=>{const g=k().createCommandEncoder();for(let h=0;h<Ae;h++){const b=g.beginComputePass();b.setPipeline(c),b.setBindGroup(0,l),b.dispatchWorkgroups(r[0],r[1],r[2]),b.end()}k().queue.submit([g.finish()]),await xe(u,t)});m.push(p)}return[{id:"command-batch-individual",name:`${Ae} × VecAdd(${er}) — individual submits`,dispatches:Ae,timingMode:"END_TO_END",totalMedianMs:Be(d),perDispatchMs:Be(d)/Ae,samplesMs:[...d].sort((f,p)=>f-p)},{id:"command-batch-batched",name:`${Ae} × VecAdd(${er}) — 8 passes, one command buffer`,dispatches:Ae,timingMode:"END_TO_END",totalMedianMs:Be(m),perDispatchMs:Be(m)/Ae,samplesMs:[...m].sort((f,p)=>f-p)}]}function sn(e){return`${(e/1024).toFixed(1)} KiB`}function Ao(){const e=typeof navigator<"u"?navigator:void 0;if(e&&(typeof e.getGpuUtilization=="function"||typeof e.gpuUtilization=="number"))try{const t=typeof e.getGpuUtilization=="function"?e.getGpuUtilization():e.gpuUtilization;return typeof t=="number"?`${t}%`:"UNAVAILABLE"}catch{return"UNAVAILABLE"}return"UNAVAILABLE"}function pr(){const e=typeof navigator<"u"?navigator:void 0;if(!e)return"UNAVAILABLE";const t=e;if(typeof t.getDeviceThermalLevel=="function")try{const r=t.getDeviceThermalLevel();return String(r)}catch{return"UNAVAILABLE"}return"UNAVAILABLE"}function an(){const e=typeof navigator<"u"?navigator:void 0;return{userAgent:typeof navigator<"u"?navigator.userAgent:"unknown",platform:e&&typeof e.platform=="string"?e.platform:"unknown",hardwareConcurrency:e&&typeof e.hardwareConcurrency=="number"?e.hardwareConcurrency:null,deviceMemory:e&&typeof e.deviceMemory=="number"?e.deviceMemory:null,thermalState:pr(),gpuUtilization:Ao()}}function Po(e){return JSON.parse(JSON.stringify(e))}function on(e){const t=e.diag,r={device:{webgpuAvailable:t.webgpuAvailable,adapterName:t.adapterName,adapterVendor:t.adapterVendor,adapterDevice:t.adapterDevice,features:t.adapterFeatures,timestampQuerySupport:t.timestampQuerySupport,isFallbackAdapter:t.isFallbackAdapter},browser:e.browser,webgpu:{limits:{maxBufferSize:t.maxBufferSize,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension},maxBufferSize:t.maxBufferSize,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize},timingMode:e.timingMode,timestamp:new Date().toISOString(),build:e.build,tests:e.tests,memory:e.memory,bufferReuse:e.bufferReuse,pipelineCache:e.pipelineCache,commandBatching:e.commandBatching,sustained:e.sustained,suiteError:e.suiteError};return Po(r)}function Co(e){const t={},r=(s,n,a)=>{t[`${s}.${n}`]={test:s,configuration:n,iterations:a.iterations,warmup:a.warmup,minMs:a.minMs,maxMs:a.maxMs,meanMs:a.averageMs,medianMs:a.medianMs,stdDevMs:a.stdDevMs,timingMode:a.timingMode,throughput:a.throughput?`${a.throughput.value.toFixed(2)} ${a.throughput.unit}`:null,note:a.note??null}};for(const s of e.tests.matmul)r("matmul",s.size,s);for(const s of e.tests.vecadd)r("vecadd",s.size,s);for(const s of e.tests.conv2d)r("conv2d",s.size,s);for(const s of e.tests.softmax)r("softmax",s.size,s);for(const s of e.tests.rmsnorm)r("rmsnorm",s.size,s);for(const s of e.tests.attention)r("attention",s.size,s);for(const[s,n]of Object.entries(e.tests.attentionPhases))for(const a of n)r("attention",`${a.name} ${s}`,a);for(const s of e.memory)t[`memory.${s.requestedMiB} MiB`]={test:"memory",configuration:`${s.requestedMiB} MiB`,iterations:1,warmup:0,minMs:0,maxMs:0,meanMs:0,medianMs:0,stdDevMs:0,timingMode:"ALLOCATION",note:`${s.requestedMiB} MiB requested (${s.requestedBytes} B) — created=${s.success?"yes":"no"}, success=${s.success?"yes":"no"}${s.note?` — ${s.note}`:""}`,throughput:null};for(const s of Object.keys(e.bufferReuse)){const n=e.bufferReuse[s];t[`bufferReuse.${n.name}`]={test:"bufferReuse",configuration:n.name,iterations:n.iterations,warmup:0,minMs:un(n.samplesMs),maxMs:n.samplesMs[n.samplesMs.length-1]??0,meanMs:n.totalMs/Math.max(n.iterations,1),medianMs:n.perOpMs,stdDevMs:0,timingMode:n.timingMode,throughput:null,note:`per-op (median) ${n.perOpMs.toFixed(3)} ms — ${n.note??""}`.trim()}}for(const s of Object.keys(e.pipelineCache)){const n=e.pipelineCache[s];t[`pipelineReuse.${n.name}`]={test:"pipelineReuse",configuration:n.name,iterations:n.iterations,warmup:0,minMs:un(n.samplesMs),maxMs:n.samplesMs[n.samplesMs.length-1]??0,meanMs:n.totalMs/Math.max(n.iterations,1),medianMs:n.perOpMs,stdDevMs:0,timingMode:n.timingMode,throughput:null,note:`per-op (median) ${n.perOpMs.toFixed(3)} ms — ${n.note??""}`.trim()}}for(const s of e.commandBatching)t[`commandBatching.${s.name}`]={test:"commandBatching",configuration:s.name,iterations:s.samplesMs.length,warmup:0,minMs:s.samplesMs[0]??0,maxMs:s.samplesMs[s.samplesMs.length-1]??0,meanMs:s.samplesMs.reduce((n,a)=>n+a,0)/Math.max(s.samplesMs.length,1),medianMs:s.totalMedianMs,stdDevMs:0,timingMode:s.timingMode,throughput:null,note:`${s.dispatches} work dispatches across ${s.name.includes("one command buffer")?"passes in one command buffer":"separate submissions"}`};if(e.sustained){const s=e.sustained;t["sustained.30sec"]={test:"sustained",configuration:"MatMul 256×256, 30 seconds",iterations:s.samples.length,warmup:0,minMs:s.minGflops,maxMs:s.maxGflops,meanMs:s.avgGflops,medianMs:s.samples[Math.floor(s.samples.length/2)]?.gflops??0,stdDevMs:0,timingMode:s.timingMode,throughput:null,note:`avg ${s.avgGflops.toFixed(1)} GFLOPS; first10s ${s.first10sAvgGflops.toFixed(1)}, last10s ${s.last10sAvgGflops.toFixed(1)}; throttled=${s.throttled?"yes":"no"} (miss=${s.dropPct.toFixed(1)}%)${s.error?` — ${s.error}`:""}`}}return e.suiteError&&(t["suite.error"]={test:"suite",configuration:"aborted",iterations:0,warmup:0,minMs:0,maxMs:0,meanMs:0,medianMs:0,stdDevMs:0,timingMode:e.timingMode,throughput:null,note:e.suiteError}),{device:e.device,browser:e.browser,webgpu:e.webgpu,timingMode:e.timingMode,timestamp:e.timestamp,commit:e.build.commit,results:t}}function un(e){if(e.length===0)return 0;const t=[...e].sort((r,s)=>r-s);return t[Math.floor(t.length/2)]}function ko(e){const t=[],r=e.tests.matmul,s=e.tests.vecadd,n=e.tests.attention,a=(()=>{if(r.length===0)return null;const l=r.filter(d=>d.throughput);return l.length===0?null:l.reduce((d,m)=>d.throughput.value>m.throughput.value?d:m)})();a?t.push(`compute-bound: largest MatMul throughput measured ${a.throughput.value.toFixed(1)} ${a.throughput.unit} at ${a.size} — matrix multiply is the classic compute-bound workload here.`):t.push("compute-bound: no usable MatMul throughput recorded.");const o=s.reduce((l,d)=>d.throughput&&(!l||d.throughput.value>l.throughput.value)?d:l,null);if(o&&o.throughput?t.push(`memory-bandwidth-sensitive: Vector Add peaks at ${o.throughput.value.toFixed(1)} ${o.throughput.unit} at ${o.size} — trivial ALU per element, so this reflects practical device memory bandwidth.`):t.push("memory-bandwidth-sensitive: no usable Vector Add bandwidth recorded."),n.length>=2){const l=[...n].sort((m,f)=>m.size.length-f.size.length),d=l[l.length-1];t.push(`attention bottleneck: largest tested single-pass attention (${d.size}) took ${d.medianMs.toFixed(2)} ms median (${d.timingMode}). Scores grow O(seq²): this is the workload most likely to bottleneck video diffusion decoding.`)}else n.length===1&&t.push(`attention bottleneck: attention at ${n[0].size} took ${n[0].medianMs.toFixed(2)} ms median (${n[0].timingMode}). Scores grow O(seq²).`);const i=n.filter(l=>/seq=(\d+)/.test(l.size)).sort((l,d)=>parseInt(d.size.match(/seq=(\d+)/)[1],10)-parseInt(l.size.match(/seq=(\d+)/)[1],10));if(i.length>=2){const l=i[0],d=i[1],m=l.medianMs/Math.max(d.medianMs,1e-9),f=parseInt(l.size.match(/seq=(\d+)/)[1],10),p=parseInt(d.size.match(/seq=(\d+)/)[1],10),g=f/p;t.push(`attention scaling: ${l.size} ran ${m.toFixed(2)}× slower than ${d.size} (seq ×${g}). With O(seq²) scores, doubling seq multiplies score work by ~4× — expect ~${(g*g).toFixed(1)}× per double if score-dominated.`)}else t.push("attention scaling: need 2+ attention sizes to compute a scaling ratio.");const u=e.memory.filter(l=>l.created&&l.success);if(u.length>0){const l=u.reduce((d,m)=>d.requestedBytes>m.requestedBytes?d:m);t.push(`largest safe tested tensor: single storage buffer of ${(l.requestedBytes/(1024*1024)).toFixed(0)} MiB allocated and survived. This is a tested allocation, not the total GPU memory.`)}else t.push("largest safe tested tensor: no successful memory allocation recorded.");const c=e.bufferReuse;if(c.allocateDestroy&&c.bufferReuse&&c.allocateDestroy.perOpMs>0){const l=c.bufferReuse.perOpMs/c.allocateDestroy.perOpMs;t.push(`buffer reuse: persistent reuse measured ${(l*100).toFixed(0)}% of the allocate/destroy per-op cost (${c.allocateDestroy.perOpMs.toFixed(3)} ms → ${c.bufferReuse.perOpMs.toFixed(3)} ms). Persistent buffers should be the default in the tensor runtime.`)}else t.push("buffer reuse: insufficient data to compare allocation strategies.");return t}const To=30,Bo=2e3,Uo=750,z=256;function cn(e){let t=2654435769;for(let r=0;r<e.length;r++)t=t*1664525+1013904223>>>0,e[r]=t%2001/1e3-1}function Ro(){const e=z*z*4,t=new Float32Array(z*z),r=new Float32Array(z*z);cn(t),cn(r);const s=M(e,t),n=M(e,r),a=M(e),o=_(Sr(z,z,z)),i=V(gt,["uniform","read-only-storage","read-only-storage","storage"]),u=W(i,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:a}}]);return{pipeline:i,bg:u,bufC:a,wg:[z/16,z/16,1]}}function Do(e){return new Promise(t=>setTimeout(t,e))}async function Oo(e,t={}){const r=k(),s=t.seconds??To,n=pr(),{pipeline:a,bg:o,bufC:i,wg:u}=Ro(),c=await e.timeOne($=>{$.setPipeline(a),$.setBindGroup(0,o),$.dispatchWorkgroups(u[0],u[1],u[2])},()=>xe(i,z*z*4).then(()=>{})),l=Math.max(1,Math.min(Bo,Math.floor(Uo/Math.max(c,.01)))),d=[],m=performance.now(),f=2*z*z*z;for(let $=0;$<s;$++){const A=performance.now();let R=0;try{const te=r.createCommandEncoder(),X=te.beginComputePass();X.setPipeline(a),X.setBindGroup(0,o);for(let G=0;G<l;G++)X.dispatchWorkgroups(u[0],u[1],u[2]);X.end(),r.queue.submit([te.finish()]),await xe(i,z*z*4),R=Math.max(performance.now()-A,.001)}catch(te){R=1e3,t.onProgress?.(te.message)}const L=R/l,F=f/(L/1e3)/1e9,j={second:$+1,avgMs:L,gflops:F};d.push(j),t.onSecond?.($+1,j,$);const ee=1e3-(performance.now()-A);ee>10&&await Do(ee)}Math.max(performance.now()-m,1);const p=d.map($=>$.gflops),g=d.filter($=>$.second<=10).map($=>$.gflops),h=d.filter($=>$.second>s-10).map($=>$.gflops),b=$=>$.length?$.reduce((A,R)=>A+R,0)/$.length:0,v=b(g),y=b(h),S=v>0?(1-y/v)*100:0;return{durationSeconds:s,samples:d,first10sAvgGflops:v,last10sAvgGflops:y,throttled:y<v*.95,dropPct:Math.max(0,S),avgGflops:b(p),minGflops:d.length?Math.min(...p):0,maxGflops:d.length?Math.max(...p):0,thermalBefore:n,thermalAfter:pr(),timingMode:"AGGREGATE_END_TO_END",error:void 0}}let tr=!1;const ut={matmul:new Set(["matmul-128","matmul-256","matmul-512"]),vecadd:new Set(["vecadd-1048576"]),conv2d:new Set,softmax:new Set(["softmax-256"]),rmsnorm:new Set(["rmsnorm-1024"]),attentionSeqs:[256]};async function Io(e){for(const t of e){const r=await Nn(t);if(!r.pass){const s=r.errorMessage?` (${r.errorMessage})`:"";return`attention seq=${t} ${r.errorType??"failed"}${s}`}}return null}async function No(e){if(tr)throw new Error("A benchmark suite is already running.");tr=!0;let t=null;try{const r=await H();t=new zt(k());const s=an(),n={id:rt,commit:Ut??null,time:pt??null},a=e.mode==="full",o={matmul:[],vecadd:[],conv2d:[],softmax:[],rmsnorm:[],attention:[],attentionPhases:{}},i=p=>e.onProgress?.(p);if(e.mode==="quick"){i("attention correctness gate (seq=128,256)");const p=await Io([128,256]);if(p)throw new Error(`Attention correctness failed — fix correctness before benchmarking. (${p})`)}i("matmul"),o.matmul=await so(t,a?void 0:ut.matmul),i("vecadd"),o.vecadd=await oo(t,a?void 0:ut.vecadd),a&&(i("conv2d"),o.conv2d=await uo(t)),i("softmax"),o.softmax=await lo(t,a?void 0:ut.softmax),i("rmsnorm"),o.rmsnorm=await po(t,a?void 0:ut.rmsnorm),i("attention");const u=await ho(t,a?void 0:ut.attentionSeqs);o.attention=u.main,o.attentionPhases=u.phases;let c=[],l={},d={},m=[],f=null;return a&&(i("memory"),c=await So(),i("buffer reuse"),l=await $o(),i("pipeline cache"),d=await Eo(),i("command batching"),m=await Mo()),e.mode==="sustained"&&(i("sustained (30s)"),f=await Oo(t,{onSecond:(p,g)=>e.onSecond?.(p,`s${p}: ${g.gflops.toFixed(2)} GFLOPS`)})),on({diag:r,browser:s,timingMode:t.mode,build:n,tests:o,memory:c,bufferReuse:l,pipelineCache:d,commandBatching:m,sustained:f})}catch(r){const s={matmul:[],vecadd:[],conv2d:[],softmax:[],rmsnorm:[],attention:[],attentionPhases:{}};let n=null;try{n=await H()}catch{}if(n&&t)return on({diag:n,browser:an(),timingMode:t.mode,build:{id:rt,commit:Ut??null,time:pt??null},tests:s,memory:[],bufferReuse:{},pipelineCache:{},commandBatching:[],sustained:null,suiteError:r.message});throw r}finally{t?.destroy(),tr=!1}}const ln=["uniform","read-only-storage","read-only-storage","storage"],dn=["uniform","read-only-storage","storage"],At=.01;function rr(e){let t=2654435769;for(let r=0;r<e.length;r++)t=t*1664525+1013904223>>>0,e[r]=t%2001/1e3-1}function Go(e,t=64,r=1){const s=new Float32Array(r*e*t),n=new Float32Array(r*e*t),a=new Float32Array(r*e*t);rr(s),rr(n),rr(a);const o=1/Math.sqrt(t),i=new Float32Array(r*e*e);for(let c=0;c<r;c++)for(let l=0;l<e;l++)for(let d=0;d<e;d++){let m=0;for(let f=0;f<t;f++)m+=s[(c*e+l)*t+f]*n[(c*e+d)*t+f];i[c*e*e+l*e+d]=m*o}const u=Ft(i,r*e,e);return{Q:s,K:n,V:a,scores:i,probs:u,scale:o}}function Lo(e){const t=new Uint32Array(e);return{rows:t[0],cols:t[1]}}function Fo(e){const t=new Uint32Array(e),r=new Float32Array(e);return{batch:t[0],seq:t[1],dim:t[2],scale:r[3]}}function _o(e){const t=ot(e);return{rows:e,workgroupSize:64,workgroupsX:t[0],totalInvocations:t[0]*64}}function qo(e,t,r,s){const n=wr(e,t,At),a=xr(e,r,s);let o=1/0,i=-1/0;for(let p=0;p<r;p++)o=Math.min(o,a[p]),i=Math.max(i,a[p]);let u=0;for(let p=0;p<e.length;p++)e[p]===$e&&u++;let c=0;for(let p=0;p<e.length;p++)Number.isFinite(e[p])&&c++;const l=e.length===t.length,d=!(o<1-At||i>1+At),m=u===0,f=l&&n.pass&&d&&m;return{pass:f,diagnosis:f?"SOFTMAX PASS":"PHASE SOFTMAX ENGINE FAILURE",length:e.length,expectedLength:t.length,finiteCount:c,maxError:n.maxError,errorIndex:n.errorIndex,cpuValue:n.cpuValue,gpuValue:n.gpuValue,expectedRange:n.expectedRange,actualRange:n.actualRange,rowSumMin:o===1/0?-1:o,rowSumMax:i===-1/0?-1:i,sentinelCount:u}}function zo(e,t){let r=0,s=-1;const n=Math.min(e.length,t.length);let a=0,o=1/0,i=-1/0;for(let f=0;f<n;f++){const p=e[f];if(Number.isFinite(p)){a++,o=Math.min(o,p),i=Math.max(i,p);const g=Math.abs(p-t[f]);g>r&&(r=g,s=f)}}let u=a;for(let f=n;f<e.length;f++)Number.isFinite(e[f])&&u++;const l=e.length===t.length&&a===n&&r<=At,d=Array.from(t.slice(0,16)),m=Array.from(e.slice(0,16));return{pass:l,diagnosis:l?"QKT PASS":"PHASE QKT FAILURE",length:e.length,expectedLength:t.length,finiteCount:a,maxAbsError:r,errorIndex:s,cpuFirst16:d,gpuFirst16:m,scoresMin:o===1/0?NaN:o,scoresMax:i===-1/0?NaN:i,scoresFiniteCount:u}}async function Wo(e,t,r,s,n,a){const o=k(),i=re.getInstance(),u=i.acquire(o,n),c=o.createCommandEncoder({label:a}),l=c.beginComputePass();return l.setPipeline(e),l.setBindGroup(0,t),l.dispatchWorkgroups(r[0],r[1],r[2]),l.end(),c.copyBufferToBuffer(s,0,u,0,n),o.queue.submit([c.finish()]),i.readSubmittedCopy(o,u,n,a)}async function Ho(e,t,r,s,n,a){const o=k(),i=o.createBuffer({label:`Direct_${a}`,size:Math.max(Math.ceil(n/16)*16,16),usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),u=o.createCommandEncoder({label:a}),c=u.beginComputePass();c.setPipeline(e),c.setBindGroup(0,t),c.dispatchWorkgroups(r[0],r[1],r[2]),c.end(),u.copyBufferToBuffer(s,0,i,0,n),o.queue.submit([u.finish()]),await i.mapAsync(GPUMapMode.READ,0,n);const l=new Float32Array(i.getMappedRange(0,n).slice(0));return i.unmap(),i.destroy(),l}function fn(e,t,r,s,n,a,o){return e==="manager"?Wo(t,r,s,n,a,o):Ho(t,r,s,n,a,o)}async function dt(e,t="manager",r=!1,s=64,n=1){const a=Go(e,s,n),o=e*e*4,i=e*e*4,u=e*e*4;k();const c=M(e*s*4,a.Q),l=M(e*s*4,a.K),d=M(i),m=M(u,new Float32Array(e*e).fill($e)),f=qt(n,e,s,a.scale),p=_t(e,e),g=_(f),h=_(p),b=V(jn,[...ln]),v=V(Lt,[...dn]),y=W(b,ln,[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:d}}]),S=W(v,dn,[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:m}}]),$=[Math.ceil(e/64),n,1],A=ot(e),R=_o(e);try{const L=await fn(t,b,y,$,d,i,`iso-qkt-${e}-${t}`),F=zo(L,a.scores),j=Fo(f);let ie=null;if(F.pass){const je=await fn(t,v,S,A,m,u,`iso-soft-${e}-${t}`);ie=qo(je,a.probs,e,e)}const ee=Lo(p),te={rows:ee.rows,cols:ee.cols,rowsExpected:e,colsExpected:e,correct:ee.rows===e&&ee.cols===e};let X;F.pass?ie&&ie.pass?X="ISOLATED PHASE PASS":X="GPU PHASE SOFTMAX EXECUTION":X="PHASE QKT FAILURE";const G={scoresBytes:i,probsBytes:u,expectedBytes:o,scoresBufferId:`scores@${e}`,probsBufferId:`probs@${e}`,distinct:d!==m};return{seq:e,dim:s,batch:n,readback:t,sharedUniform:r,qkt:F,qktUniform:j,softmax:ie,softmaxUniform:te,wgInfo:R,bufferInfo:G,diagnosis:X}}finally{try{c.destroy(),l.destroy(),d.destroy(),m.destroy(),g.destroy(),h.destroy()}catch{}}}async function jo(e=[4,16,64,128,256],t=64,r=1){const s=[];for(const n of e){const a=await dt(n,"manager",!1,t,r),o=await dt(n,"direct",!1,t,r),i=!a.qkt.pass||!o.qkt.pass?"PHASE QKT FAILURE":"QKT PASS";s.push({seq:n,manager:{qkt:a.qkt,diagnosis:a.qkt.diagnosis},direct:{qkt:o.qkt,diagnosis:o.qkt.diagnosis},overall:i})}return s}async function Ar(e=[4,16,64,128,256],t=64,r=1){const s=[];for(const n of e){const a=await dt(n,"manager",!1,t,r),o=await dt(n,"direct",!1,t,r),i=await dt(n,"manager",!0,t,r);let u;!a.qkt.pass||!o.qkt.pass?u="PHASE QKT FAILURE":(a.softmax?.pass??!1)&&(o.softmax?.pass??!1)?u=i.softmax?.pass?"BENCHMARK HARNESS INTERACTION (UNEXPECTED: repro passed)":"BENCHMARK HARNESS INTERACTION":!(a.softmax?.pass??!1)&&(o.softmax?.pass??!1)?u="READBACK MANAGER INTERACTION":u="GPU PHASE SOFTMAX EXECUTION",s.push({seq:n,manager:a,direct:o,repro:i,overall:u})}return s}function Yn(e){if(e.some(s=>!s.manager.qkt.pass||!s.direct.qkt.pass))return"PHASE QKT FAILURE";const t=e.every(s=>s.manager.softmax?.pass??!1),r=e.every(s=>s.direct.softmax?.pass??!1);return t&&r?"BENCHMARK HARNESS INTERACTION":!t&&r?"READBACK MANAGER INTERACTION":"GPU PHASE SOFTMAX EXECUTION"}async function Qn(e,t=64,r=5){let s;try{s=new zt(k())}catch{throw new Error(`Attention phase benchmark FAIL [seq=${e}] — no GPU device.`)}try{let n;try{n=await Wt(e,t,1)}catch(o){throw new Error(`Attention phase correctness failed — fix correctness before benchmarking. ${o.message}`)}const a=await Ht(e,t,1);try{const o=await Mr(s,a,r);return{seq:e,dim:t,iterations:r,correctness:n,samples:o}}finally{We(a)}}finally{s.destroy()}}async function Vo(e=[4,16,64,128,256],t=5){const r=[];for(const s of e)r.push(await Qn(s,64,t));return r}async function Ko(e=256){const t=[];try{const a=(await Ar([e],64,1))[0],o=!!(a&&a.manager.qkt.pass&&a.manager.softmax?.pass&&a.direct.qkt.pass&&a.direct.softmax?.pass);if(t.push({step:"A",label:"isolated phase correctness (manager + direct)",ok:o,details:a?`overall=${a.overall} manager=${a.manager.softmax?.pass??!1} direct=${a.direct.softmax?.pass??!1}`:"no report"}),!o)return t}catch(n){return t.push({step:"A",label:"isolated phase correctness (manager + direct)",ok:!1,details:String(n.message)}),t}try{const n=await Wt(e,64,1);t.push({step:"B",label:"fresh-context phase correctness",ok:!0,details:`qktMaxErr=${n.maxErrs.qkt.toExponential(2)} softMaxErr=${n.maxErrs.soft.toExponential(2)} pvMaxErr=${n.maxErrs.pv.toExponential(2)} rowSumDev=${n.rowSumMaxDev.toExponential(3)}`})}catch(n){return t.push({step:"B",label:"fresh-context phase correctness",ok:!1,details:String(n.message)}),t}const r=B.snapshot();let s;try{s=new zt(k())}catch(n){return t.push({step:"C",label:"warmup-only (3 real submissions)",ok:!1,details:`no device: ${n.message}`}),t}try{const n=await Ht(e,64,1);try{const a=await Mt(s,n,"qkt",0),o=B.snapshot().warmupSubmissions-r.warmupSubmissions,i=a.warmup===3&&o===3;if(t.push({step:"C",label:"warmup-only (3 real submissions)",ok:i,details:`warmup=${a.warmup} iterations=${a.iterations} warmupSubmissionsDelta=${o}`}),!i)return t}finally{We(n)}}catch(n){return t.push({step:"C",label:"warmup-only (3 real submissions)",ok:!1,details:String(n.message)}),t}finally{s.destroy()}try{const n=await Qn(e,64,5);t.push({step:"D",label:"benchmark (5 iterations / phase)",ok:!0,details:`samples=${n.samples.length} qkt=${n.samples[0]?.medianMs.toFixed(3)??"n/a"}ms`})}catch(n){t.push({step:"D",label:"benchmark (5 iterations / phase)",ok:!1,details:String(n.message)})}return t}function Pr(){const e=B.snapshot(),t=fr(),r=I(),s=Tt(),n=t.filter(c=>c.kind==="correctness"),a=t.filter(c=>c.kind==="benchmark"),o=n.every(c=>c.destroyed)&&a.every(c=>c.destroyed),i=n.length>0&&a.length>0&&Math.max(...n.map(c=>c.id))<Math.min(...a.map(c=>c.id));return["— AETHER Harness Debug Panel —",`commandBuffers: created=${e.commandBuffersCreated} submitted=${e.commandBuffersSubmitted}`,`submissions: warmup=${e.warmupSubmissions} measurement=${e.measurementSubmissions} sync=${e.syncSubmissions}`,`completion reads: ${e.completionReads}`,`full-tensor readbacks: ${e.readbackOperations}`,`mapAsync overlap: ${e.mapOverlapDetected?"YES (BUG)":"NO"}`,`correctness contexts: ${n.length} (ids ${n.map(c=>c.id).join(",")||"none"})`,`benchmark contexts: ${a.length} (ids ${a.map(c=>c.id).join(",")||"none"})`,`all contexts destroyed: ${o}`,`correctness destroyed before benchmark: ${i}`,`device lost: ${r?"YES":"NO"} (${s.reason??"-"}/${s.message??"-"})`].join(`
`)}async function Yo(e=4,t=3){const r=[];k()||r.push({name:"GPU device available",ok:!1,detail:"no GPU device"}),B.reset();const s=fr();let n;try{n=new zt(k())}catch(a){return r.push({name:"TimingManager constructs",ok:!1,detail:String(a.message)}),{passed:!1,checks:r}}try{const a=B.snapshot();let o;try{o=await Wt(e,64,1)}catch(A){throw new Error(`Attention phase correctness failed — fix correctness before benchmarking. ${A.message}`)}const u=B.snapshot().readbackOperations-a.readbackOperations;r.push({name:"Correctness reads full outputs",ok:u>=6,detail:`readbackOperations delta=${u}`}),r.push({name:"Gated on correctness",ok:o.maxErrs.qkt<.01&&o.maxErrs.soft<.01&&o.maxErrs.pv<.01,detail:`qkt=${o.maxErrs.qkt.toExponential(2)} soft=${o.maxErrs.soft.toExponential(2)} pv=${o.maxErrs.pv.toExponential(2)}`});const c=B.snapshot(),l=await Ht(e,64,1);let d=[];try{d=await Mr(n,l,t)}finally{We(l)}const m=B.snapshot(),f=m.readbackOperations-c.readbackOperations,p=m.measurementSubmissions-c.measurementSubmissions,g=m.warmupSubmissions-c.warmupSubmissions,h=m.completionReads-c.completionReads;r.push({name:"Phase benchmark completes",ok:d.length===3,detail:`samples=${d.length} (expect 3: qkt/softmax/pv)`}),r.push({name:"Warmup actually submitted",ok:g>=3,detail:`warmupSubmissions delta=${g} (3/phase)`}),r.push({name:"No full-tensor readback during timing",ok:f===0,detail:`readbackOperations delta=${f}`}),r.push({name:"Completion token used for timing",ok:h>0,detail:`completionReads delta=${h}`}),r.push({name:"Measurement iterations submitted",ok:p===d.reduce((A,R)=>A+R.iterations,0),detail:`measurementSubmissions delta=${p} (samples total ${d.reduce((A,R)=>A+R.iterations,0)})`}),r.push({name:"mapAsync never overlaps",ok:!m.mapOverlapDetected,detail:`mapOverlapDetected=${m.mapOverlapDetected}`}),r.push({name:"Device not lost",ok:!I()&&Tt().reason===null,detail:`lost=${I()} reason=${Tt().reason??"-"}`});const b=fr().slice(s.length),v=b.filter(A=>A.kind==="correctness").map(A=>A.id),y=b.filter(A=>A.kind==="benchmark").map(A=>A.id),S=b.every(A=>A.destroyed),$=v.length>0&&y.length>0&&Math.max(...v)<Math.min(...y);r.push({name:"Fresh contexts: correctness destroyed before benchmark",ok:S&&$,detail:`correctness ids=[${v.join(",")}] benchmark ids=[${y.join(",")}] allDestroyed=${S}`})}catch(a){r.push({name:"Phase benchmark completes",ok:!1,detail:String(a.message)})}finally{n.destroy()}return{passed:r.every(a=>a.ok),checks:r}}function Qo(e){const t=["— Harness Regression —",`RESULT: ${e.passed?"PASS":"FAIL"}`];for(const r of e.checks)t.push(`${r.ok?"PASS":"FAIL"}  ${r.name}: ${r.detail}`);return t.join(`
`)}let N=null,E=!1,mr=!1,ve=null,oe=localStorage.getItem("aether.kernels-passed")!=="1",Fe=localStorage.getItem("aether.sustained.armed")==="1",mt=null;const Ue={sanity:!1,standaloneMatmul:!1,directMatmul:!1,harnessMatmul:!1};function Dt(){return Ue.sanity&&Ue.standaloneMatmul&&Ue.directMatmul&&Ue.harnessMatmul}function Vt(){const e=N?.querySelector("#btn-correctness");if(!e)return;const t=Dt();e.disabled=!t,e.textContent=t?"CORRECTNESS":"CORRECTNESS (LOCKED)"}function x(e,t=""){if(!N)return;const r=N.querySelector("#bench-log");if(!r)return;const s=document.createElement("div");s.className=`log-entry ${t}`,s.textContent=e,r.appendChild(s),r.scrollTop=r.scrollHeight}function pn(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function K(){const e=Tt();x(`WEBGPU DEVICE LOST — reason: ${e.reason??"unknown"} — message: ${e.message??""}`,"err"),x("Remaining tests stopped.","err")}function Q(){if(!mr)try{const e=k();e.addEventListener("uncapturederror",t=>{const r=t.error;x(`UNCAPTURED GPU ERROR: ${r?.message??"unknown"}`,"err")}),e.lost.then(t=>{x(`WEBGPU DEVICE LOST — reason: ${t.reason} — message: ${t.message}`,"err")}),mr=!0}catch{}}function He(e,t){const r=N?.querySelector(`#${e}`);if(!r)return;const s=[t.stage?`<div>stage: <b style="color:var(--text)">${P(t.stage)}</b></div>`:"",t.pass?"":t.errorType?`<div>error type: <b style="color:var(--red)">${P(t.errorType)}</b></div>`:"",t.pass?"":t.errorMessage?`<div>error message: <b style="color:var(--red)">${P(t.errorMessage)}</b></div>`:"",...t.notes.map(n=>`<div style="color:var(--text-dim)">${P(n)}</div>`)].join("");r.innerHTML=`
    <div class="card" style="border-color:${t.pass?"var(--green)":"var(--red)"};margin-top:12px">
      <div class="card-header">
        <span class="card-title">${P(t.title)}</span>
        <span class="badge ${t.pass?"badge-pass":"badge-fail"}">${t.pass?"PASS":"FAIL"}</span>
      </div>
      <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${s||'<div style="color:var(--text-dim)">—</div>'}</div>
    </div>
  `}function P(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Xn(e){const t=[];for(const r of e.scopeErrors)t.push(`GPU error scope [${r.type}]: ${r.message}`);for(const r of e.uncaptured)t.push(`uncaptured GPU error [${r.type}]: ${r.message}`);return e.lost.reason&&t.push(`device lost — reason: ${e.lost.reason} — message: ${e.lost.message??""}`),t.push(`expected: ${e.expected}`),e.actual!==null&&t.push(`actual: ${e.actual}`),e.exception&&t.push(`exception: ${e.exception}`),t}function Xo(e){const t=e.pass?"display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--green);color:var(--green)":"display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--red);color:var(--red)",r=e.pass?`${e.config} — complete`:`${e.config} — stage: ${e.stage} · ${e.errorType??""} · ${e.errorMessage??""}`;return`<span style="${t}" title="${P(r)}">${P(e.config)} ${e.pass?"✓":"✗"}</span>`}function Zo(e){const t=[];return t.push(`stage: ${P(e.stage)} · error type: <b style="color:var(--red)">${P(e.errorType??"unknown")}</b>`),e.errorMessage&&t.push(`error: ${P(e.errorMessage)}`),e.nonFiniteIndex>=0&&t.push(`non-finite output at index ${e.nonFiniteIndex}`),e.errorIndex>=0&&e.cpuValue!==null&&e.gpuValue!==null&&t.push(`largest error @ ${e.errorIndex}: cpu=${e.cpuValue.toExponential(4)} gpu=${e.gpuValue.toExponential(4)}`),e.expectedRange&&t.push(`expected range [${e.expectedRange[0].toExponential(3)}, ${e.expectedRange[1].toExponential(3)}]`),e.actualRange&&t.push(`actual range [${e.actualRange[0].toExponential(3)}, ${e.actualRange[1].toExponential(3)}]`),t.map(r=>`<div style="color:var(--red)">${r}</div>`)}function Jo(e){const t=N?.querySelector("#validation-panel");if(!t)return;const r=e.length===6&&e.every(n=>n.pass),s=e.map(n=>{const a=n.cases.filter(i=>!i.pass).flatMap(Zo),o=n.pass?"complete":n.details.includes("ABORTED")?"aborted (device lost)":n.cases.find(i=>!i.pass)?.stage??"failed";return`
      <div class="card" style="border-color:${n.pass?"var(--green)":"var(--red)"};margin-top:10px">
        <div class="card-header">
          <span class="card-title">${P(n.name.toUpperCase())}</span>
          <span class="badge ${n.pass?"badge-pass":"badge-fail"}">${n.pass?"PASS":"FAIL"}</span>
        </div>
        <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:4px;word-break:break-all">
          <div>${n.cases.map(Xo).join("")||'<span style="color:var(--text-dim)">not run</span>'}</div>
          <div>max error: <b>${n.maxError>=0?n.maxError.toExponential(2):"—"}</b></div>
          <div>execution status: <b>${P(o)}</b></div>
          ${a}
        </div>
      </div>`}).join("");t.innerHTML=`
    <h3 style="margin-top:20px">AETHER KERNEL VALIDATION</h3>
    <div class="card" style="border-color:${r?"var(--green)":"var(--red)"};margin-top:4px">
      <div class="card-header">
        <span class="card-title">All kernels</span>
        <span class="badge ${r?"badge-pass":"badge-fail"}">${r?"ALL PASS":"FAILURE(S)"}</span>
      </div>
    </div>
    ${s}
  `}function Ye(e){const t=e??{pass:!1,maxError:-1,cases:[]};return{pass:t.pass,maxError:t.maxError,cases:t.cases}}function ei(e){return!ve||e.length===0?null:{device:{webgpuAvailable:ve.webgpuAvailable,adapterName:ve.adapterName,adapterVendor:ve.adapterVendor,adapterDevice:ve.adapterDevice,fallbackAdapter:ve.isFallbackAdapter},build:{id:rt,commit:Ut??null,time:pt??null},timestamp:new Date().toISOString(),uncapturedErrors:pe(),tests:{vectorAdd:Ye(e[0]),matmul:Ye(e[1]),conv2d:Ye(e[2]),softmax:Ye(e[3]),rmsNorm:Ye(e[4]),attention:Ye(e[5])},allPass:e.length===6&&e.every(t=>t.pass)}}function ti(e){try{localStorage.setItem("aether.correctness",JSON.stringify(e))}catch{}}function ri(e){const t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),r=URL.createObjectURL(t),s=document.createElement("a");s.href=r,s.download=`aether-correctness-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`,s.click(),URL.revokeObjectURL(r)}function ni(e){const t=N?.querySelector("#report-panel");t&&(t.innerHTML=`
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
  `,t.querySelector("#btn-export-json")?.addEventListener("click",()=>ri(e)),t.querySelector("#btn-reload")?.addEventListener("click",()=>location.reload()))}async function si(){if(!E){E=!0;try{x("═══ GPU SANITY (standalone) ═══","info");const e=await Wa();Ue.sanity=e.pass,Vt(),He("res-sanity",{title:"GPU SANITY",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:Xn(e)}),x(`GPU SANITY TEST: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&x(`  error type: ${e.errorType}`,"err"),e.errorMessage&&x(`  error message: ${e.errorMessage}`,"err")}catch(e){x(`ERROR: ${e.message}`,"err")}finally{E=!1}}}async function ai(){if(!E){E=!0;try{x("═══ STANDALONE MATMUL (64×64) ═══","info");const e=await Ha();Ue.standaloneMatmul=e.pass,Vt(),He("res-standalone",{title:"STANDALONE MATMUL",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:Xn(e)}),x(`STANDALONE MATMUL: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&x(`  error type: ${e.errorType}`,"err"),e.errorMessage&&x(`  error message: ${e.errorMessage}`,"err")}catch(e){x(`ERROR: ${e.message}`,"err")}finally{E=!1}}}async function oi(){if(!E){E=!0;try{await H(),Q(),x("═══ SHARED-DEVICE DIRECT MATMUL (engine device, inline) ═══","info");const e=await Va();Ue.directMatmul=e.pass,Vt(),He("res-direct",{title:e.name,pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:[`execution device id: ${e.executionDeviceId}`,`pipeline device id: ${e.pipelineDeviceId??"unknown"}`,`bind group device id: ${e.bindGroupDeviceId??"unknown"}`,`device mismatch: ${e.mismatch?"YES":"NO"}`,`max error: ${e.maxError!==null?e.maxError.toExponential(2):"—"}`]}),x(`SHARED-DEVICE DIRECT MATMUL: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&x(`  error type: ${e.errorType}`,"err"),e.errorMessage&&x(`  error message: ${e.errorMessage}`,"err"),I()&&K()}catch(e){x(`ERROR: ${e.message}`,"err"),I()&&K()}finally{E=!1}}}async function mn(e,t){if(!E){E=!0;try{const r=await H();ve=r,Q(),x(`═══ MINIMAL HARNESS MATMUL ${e}×${e} (getDevice, inline, no runGpuTest) ═══`,"info");const s=await zn(e),a=[`Device: ${r?`${r.adapterName}${r.adapterVendor?` / ${r.adapterVendor}`:""}`:"unknown"}`,`Pipeline: ${s.stageResults.pipeline?"PASS":"FAIL"}`,`Bind Group: ${s.stageResults["bind-group"]?"PASS":"FAIL"}`,`Dispatch: ${s.stageResults.dispatch?"PASS":"FAIL"}`,`Submission: ${s.stageResults.submission?"PASS":"FAIL"}`,`Readback: ${s.stageResults.readback?"PASS":"FAIL"}`,`Validation: ${s.stageResults.validation?"PASS":"FAIL"}`,`Expected: ${s.expected}`,`Actual range: [${s.actualMin}, ${s.actualMax}]`,`Max error: ${s.maxError!==null?s.maxError.toExponential(2):"—"}`,`Non-finite values: ${s.nonFinite}`,`GPU error: ${s.gpuError??"none"}`,`Uncaptured error: ${s.uncaptured.length?s.uncaptured.join(" | "):"none"}`,`Shader compilation: ${s.compilationMessages.length?s.compilationMessages.join(" | "):"none"}`,`expected first 16: ${Array(16).fill(s.expected).join(", ")}`,`actual first 16: ${s.first16.length?s.first16.slice(0,16).join(", "):"—"}`];He(t,{title:`MINIMAL HARNESS MATMUL ${e}×${e}`,pass:s.pass,stage:s.stage||"complete",errorType:s.errorType,errorMessage:s.errorMessage,notes:a}),x(`MINIMAL HARNESS MATMUL ${e}×${e}: ${s.pass?"PASS":"FAIL"}`,s.pass?"ok":"err"),s.errorType&&x(`  error type: ${s.errorType}`,"err"),s.errorMessage&&x(`  error message: ${s.errorMessage}`,"err"),I()&&K()}catch(r){x(`ERROR: ${r.message}`,"err"),I()&&K()}finally{E=!1}}}function Cr(){const e=document.getElementById("res-readback-engine");if(!e)return;const r=re.getInstance().getDiagnostics(I());e.innerHTML=`
    <div class="card" style="border-color:var(--border);margin-top:12px">
      <div class="card-header">
        <span class="card-title">READBACK ENGINE</span>
        <span class="badge ${r.lastStatus==="PASS"?"badge-ok":r.lastStatus==="FAIL"?"badge-err":"badge-info"}">${r.lastStatus}</span>
      </div>
      <div style="font-size:12px;font-family:var(--mono);color:var(--text-dim);margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px">
        <div>Staging buffer: <b style="color:var(--text)">${r.stagingSize} B</b></div>
        <div>Mapped: <b style="color:var(--text)">${r.isMapped?"YES":"NO"}</b></div>
        <div>Pending readback: <b style="color:var(--text)">${r.isPending?"YES":"NO"}</b></div>
        <div>Queue depth: <b style="color:var(--text)">${r.queueDepth}</b></div>
        <div>Last mapAsync: <b style="color:var(--text)">${r.lastStatus}</b></div>
        <div>Device lost: <b style="color:var(--text)">${r.deviceLost?"YES":"NO"}</b></div>
      </div>
      ${r.lastError?`<div style="font-size:11px;font-family:var(--mono);color:var(--err);margin-top:6px">Last error: ${r.lastError}</div>`:""}
    </div>
  `}async function ii(){if(!E){E=!0;try{await H(),Q(),x("═══ RUN READBACK TEST (4 B → 1 MB) ═══","info");const e=k(),t=[{name:"4 B",bytes:4},{name:"16 B",bytes:16},{name:"64 B",bytes:64},{name:"1 KB",bytes:1024},{name:"64 KB",bytes:65536},{name:"256 KB",bytes:262144},{name:"1 MB",bytes:1048576}],r=[];for(const{name:n,bytes:a}of t)try{const o=new Float32Array(a/4).fill(123),i=M(a,o),u=await re.getInstance().copyAndRead(e,i,a,`Test_${n}`);i.destroy();let c=u.length===a/4;c&&u.length>0&&(c=Math.abs(u[0]-123)<.001),r.push({name:n,pass:c}),x(`  ${n.padEnd(8)}: ${c?"PASS":"FAIL"}`,c?"ok":"err")}catch(o){const i=o.message;r.push({name:n,pass:!1,err:i}),x(`  ${n.padEnd(8)}: FAIL — ${i}`,"err");break}const s=r.length===t.length&&r.every(n=>n.pass);He("res-readback-test",{title:"READBACK DIAGNOSTIC (4B → 1MB)",pass:s,stage:s?"complete":"readback-test",errorType:null,errorMessage:s?null:r.find(n=>!n.pass)?.err??"Readback size test failed",notes:r.map(n=>`${n.name}: ${n.pass?"PASS":"FAIL"}${n.err?` (${n.err})`:""}`)}),Cr()}catch(e){x(`ERROR: ${e.message}`,"err")}finally{E=!1}}}async function ui(){if(!E){E=!0;try{await H(),Q(),x("═══ RUN READBACK STRESS (100 iterations) ═══","info");const e=k(),t=64;let r=0,s=0,n=null,a=null;const o=new Float32Array(t/4).fill(42),i=M(t,o);try{for(let c=1;c<=100;c++)try{const l=await re.getInstance().copyAndRead(e,i,t,`Stress_${c}`);if(l.length!==16||Math.abs(l[0]-42)>=.001)throw new Error(`Data mismatch at iteration ${c}: got ${l[0]}`);r++}catch(l){s++,n===null&&(n=c,a=l.message);break}}finally{i.destroy()}const u=s===0&&r===100;He("res-readback-stress",{title:"READBACK STRESS (100 Iterations)",pass:u,stage:u?"complete":`iter-${n}`,errorType:null,errorMessage:a,notes:[`Successful reads: ${r}/100`,`Failed reads: ${s}`,`First failure iter: ${n??"None"}`,`Device lost: ${I()?"YES":"NO"}`]}),x(`READBACK STRESS: ${u?"PASS":"FAIL"} (${r}/100 reads succeeded)`,u?"ok":"err"),a&&x(`  First failure at iter ${n}: ${a}`,"err"),Cr()}catch(e){x(`ERROR: ${e.message}`,"err")}finally{E=!1}}}async function ci(){if(!E){E=!0;try{await H(),Q(),x("═══ HARNESS MATMUL (runGpuTest) ═══","info");const e=await Rn();Ue.harnessMatmul=e.pass,Vt();const t=e.cases.map(n=>`${n.config}:${n.pass?"PASS":"FAIL"}`).join(" "),r=e.cases.find(n=>!n.pass),s=r?[`pipeline device id: ${r.pipelineDeviceId??"unknown"}`,`execution device id: ${r.executionDeviceId??"unknown"}`,`bind group device id: ${r.bindGroupDeviceId??"unknown"}`,`device mismatch: ${r.mismatch?"YES":"NO"}`]:[];He("res-harness",{title:"HARNESS MATMUL",pass:e.pass,stage:e.pass?"complete":r?.stage??"runGpuTest",errorType:e.pass?null:r?.errorType??null,errorMessage:e.pass?null:r?.errorMessage??e.details,notes:[`cases: ${t||"—"}`,`max error: ${e.maxError>=0?e.maxError.toExponential(2):"—"}`,...s]}),x(`HARNESS MATMUL: ${e.pass?"PASS":"FAIL"} — ${e.details||""}`,e.pass?"ok":"err"),I()&&K()}catch(e){x(`ERROR: ${e.message}`,"err"),I()&&K()}finally{E=!1}}}async function li(){if(!E){E=!0;try{await H(),Q(),pe(),fe(),x("═══ RUN ATTENTION CORRECTNESS (seq=4/16/64/128/256) ═══","info");const e=await Gn(),t=N?.querySelector("#res-attention");t&&(t.innerHTML=e.cases.map(r=>{const s=[`sequence length: ${r.config}`,`maxError: ${r.maxError>=0?r.maxError.toExponential(3):"n/a"}`,`errorIndex: ${r.errorIndex>=0?r.errorIndex:"n/a"}`,`cpuValue: ${r.cpuValue!==null?r.cpuValue.toExponential(4):"n/a"}`,`gpuValue: ${r.gpuValue!==null?r.gpuValue.toExponential(4):"n/a"}`,`expected range: ${r.expectedRange?`[${r.expectedRange[0].toExponential(3)}, ${r.expectedRange[1].toExponential(3)}]`:"n/a"}`,`actual range: ${r.actualRange?`[${r.actualRange[0].toExponential(3)}, ${r.actualRange[1].toExponential(3)}]`:"n/a"}`,`non-finite count: ${r.nonFiniteIndex>=0?1:0}`];r.rowsExpected!==void 0&&(s.push(`rows: ${r.rowsCovered??0}/${r.rowsExpected} covered`+(r.firstMissingRow!==null&&r.firstMissingRow!==void 0?` (first missing row ${r.firstMissingRow})`:"")),s.push(`sentinel count: ${r.sentinelCount??0}`+(r.firstSentinelIndex!==null&&r.firstSentinelIndex!==void 0?` (first @ ${r.firstSentinelIndex}, last @ ${r.lastSentinelIndex})`:""))),r.pass||s.push(`stage: ${r.stage} · ${r.errorType??"gpu-error"} · ${r.errorMessage??""}`);const n=s.map(a=>`<div style="color:var(--text-dim)">${P(a)}</div>`).join("");return`
            <div class="card" style="border-color:${r.pass?"var(--green)":"var(--red)"};margin-top:12px">
              <div class="card-header">
                <span class="card-title">Attention ${P(r.config)}</span>
                <span class="badge ${r.pass?"badge-pass":"badge-fail"}">${r.pass?"PASS":"FAIL"}</span>
              </div>
              <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${n}</div>
            </div>`}).join("")),x(`ATTENTION CORRECTNESS: ${e.pass?"ALL PASS":"FAILED"} — ${e.details}`,e.pass?"ok":"err")}catch(e){x(`ERROR: ${e.message}`,"err"),I()&&K()}finally{E=!1}}}async function di(){if(!E){E=!0;try{await H(),Q(),pe(),fe(),x("═══ RUN ATTENTION PHASE SOFTMAX (seq=4/16/64/128/256) ═══","info");const e=await vo(),t=N?.querySelector("#res-phase-softmax");t&&(t.innerHTML=e.map(r=>{const s=[`rows: ${r.rows} · workgroupsX: ${r.workgroupsX} · total invocations: ${r.totalInvocations}`,`maxError: ${r.maxError>=0?r.maxError.toExponential(3):"n/a"}`,`errorIndex: ${r.errorIndex>=0?r.errorIndex:"n/a"}`,`cpuValue: ${r.cpuValue!==null?r.cpuValue.toExponential(4):"n/a"}`,`gpuValue: ${r.gpuValue!==null?r.gpuValue.toExponential(4):"n/a"}`,`expected range: ${r.expectedRange?`[${r.expectedRange[0].toExponential(3)}, ${r.expectedRange[1].toExponential(3)}]`:"n/a"}`,`actual range: ${r.actualRange?`[${r.actualRange[0].toExponential(3)}, ${r.actualRange[1].toExponential(3)}]`:"n/a"}`,`row sums: [${r.rowSumsMin.toExponential(3)}, ${r.rowSumsMax.toExponential(3)}] (≈1)`,`sentinel count: ${r.sentinelCount}`];r.pass||s.push(`stage: ${r.stage} · ${r.errorType??"gpu-error"} · ${r.errorMessage??""}`);const n=s.map(a=>`<div style="color:var(--text-dim)">${P(a)}</div>`).join("");return`
            <div class="card" style="border-color:${r.pass?"var(--green)":"var(--red)"};margin-top:12px">
              <div class="card-header">
                <span class="card-title">Phase Softmax seq=${r.seq}</span>
                <span class="badge ${r.pass?"badge-pass":"badge-fail"}">${r.pass?"PASS":"FAIL"}</span>
              </div>
              <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${n}</div>
            </div>`}).join("")),x(`PHASE SOFTMAX: ${e.every(r=>r.pass)?"ALL PASS":"FAILED"} — ${e.map(r=>`s${r.seq}:${r.pass?"PASS":"FAIL"}`).join(" ")}`,e.every(r=>r.pass)?"ok":"err")}catch(e){x(`ERROR: ${e.message}`,"err"),I()&&K()}finally{E=!1}}}const Kt=[4,16,64,128,256];function fi(e){return[`length: ${e.length}/${e.expectedLength} · finite: ${e.finiteCount}`,`maxAbsError: ${e.maxAbsError.toExponential(3)} @ idx ${e.errorIndex} (≤ 1e-2)`,`cpu first16: [${e.cpuFirst16.map(t=>t.toFixed(4)).join(", ")}]`,`gpu first16: [${e.gpuFirst16.map(t=>t.toFixed(4)).join(", ")}]`,`scores: min ${e.scoresMin.toExponential(3)} · max ${e.scoresMax.toExponential(3)} · finite ${e.scoresFiniteCount}`]}function pi(e){return[`length: ${e.length}/${e.expectedLength} · finite: ${e.finiteCount}`,`maxError: ${e.maxError.toExponential(3)} @ idx ${e.errorIndex} (≤ 1e-2)`,`cpu @ idx: ${e.cpuValue!==null?e.cpuValue.toExponential(4):"n/a"} · gpu @ idx: ${e.gpuValue!==null?e.gpuValue.toExponential(4):"n/a"}`,`row sums: [${e.rowSumMin.toExponential(3)}, ${e.rowSumMax.toExponential(3)}] (≈1)`,`sentinel count: ${e.sentinelCount}`]}function mi(e){return`softmax uniform {rows:${e.rows}, cols:${e.cols}} expected {rows:${e.rowsExpected}, cols:${e.colsExpected}} → ${e.correct?"MATCH":"MISMATCH"}`}function gi(e){return`qkt uniform {batch:${e.batch}, seq:${e.seq}, dim:${e.dim}, scale:${e.scale.toFixed(4)}}`}function bi(e){return`dispatch: seq=${e.rows} · workgroup_size=64 · wgX=${e.workgroupsX} · total invocations=${e.totalInvocations}`}function hi(e){return`buffers: scores ${e.scoresBytes}B · probs ${e.probsBytes}B · expected ${e.expectedBytes}B · distinct=${e.distinct}`}function yi(e,t){const r=t.overall==="QKT PASS";return`
    <div class="card" style="border-color:${r?"var(--green)":"var(--red)"};margin-top:12px">
      <div class="card-header">
        <span class="card-title">Isolated QKT seq=${e} (once)</span>
        <span class="badge ${r?"badge-pass":"badge-fail"}">${r?"PASS":"FAIL"}</span>
      </div>
      <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">
        <div style="color:var(--text-dim)">manager readback: ${t.manager.qkt.pass?"PASS":"FAIL"} · direct staging: ${t.direct.qkt.pass?"PASS":"FAIL"}</div>
        <div style="color:var(--text-dim)">overall: ${t.overall}</div>
      </div>
    </div>`}async function vi(){if(!E){E=!0;try{await H(),Q(),pe(),fe(),x("═══ ISOLATED QKT (once · no warmup · no timing) ═══","info");const e=await jo(Kt),t=N?.querySelector("#res-iso-qkt");t&&(t.innerHTML=e.map(r=>yi(r.seq,r)).join("")),x(`ISOLATED QKT: ${e.every(r=>r.overall==="QKT PASS")?"ALL PASS":"FAILED"} — ${e.map(r=>`s${r.seq}:${r.overall}`).join(" ")}`,e.every(r=>r.overall==="QKT PASS")?"ok":"err")}catch(e){x(`ERROR: ${e.message}`,"err"),I()&&K()}finally{E=!1}}}function Zn(e){return e.map(t=>{const r=t.manager.qkt.pass&&t.direct.qkt.pass&&(t.manager.softmax?.pass??!1)&&(t.direct.softmax?.pass??!1),s=a=>{const o=[...fi(a.qkt)];return a.softmax?o.push(...pi(a.softmax),mi(a.softmaxUniform),gi(a.qktUniform),hi(a.bufferInfo)):o.push("(softmax SKIPPED — QKT FAILED, TASK 3 STOP)"),o.push(bi(a.wgInfo)),o},n=(a,o,i)=>`
        <div style="min-width:280px;flex:1">
          <div class="card-header" style="padding:4px 0;border:none">
            <span class="card-title">${a}</span>
            <span class="badge ${o.qkt.pass&&(o.softmax?.pass??!1)?"badge-pass":"badge-fail"}">${o.qkt.pass?o.softmax?o.softmax.pass?"PASS":"SOFT MAX FAIL":"QKT STOP":"QKT FAIL"}</span>
          </div>
          <div style="font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all;color:var(--text-dim)">${s(o).map(u=>`<div>${P(u)}</div>`).join("")}</div>
          <div style="font-size:11px;color:var(--text-dim)">${P(i)} · ${P(o.diagnosis)}</div>
        </div>`;return`
        <div class="card" style="border-color:${r?"var(--green)":"var(--red)"};margin-top:12px">
          <div class="card-header">
            <span class="card-title">Isolated Phase seq=${t.seq}</span>
            <span class="badge ${r?"badge-pass":"badge-fail"}">${r?"PASS":"FAIL"}</span>
          </div>
          <div style="margin-top:8px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
            ${n("manager readback",t.manager,"ReadbackManager")}
            ${n("direct staging",t.direct,"mapAsync → read → unmap")}
            ${n("repro: shared uniform",t.repro,"benchmark setupAttention() uniform binding")}
          </div>
          <div style="margin-top:8px;font-weight:600;color:var(--text-strong)">diagnosis: ${P(t.overall)}</div>
        </div>`}).join("")}async function wi(){if(!E){E=!0;try{await H(),Q(),pe(),fe(),x("═══ ISOLATED PHASE SOFTMAX (QKT once → verify → Softmax once → verify) ═══","info");const e=await Ar(Kt),t=N?.querySelector("#res-iso-phase");t&&(t.innerHTML=Zn(e));const r=Yn(e);x(`ISOLATED PHASE SOFTMAX: ${r} — ${e.map(s=>`s${s.seq}:${s.overall}`).join(" ")}`,r.includes("FAILURE")||r.includes("EXECUTION")||r.includes("INTERACTION")?"err":"ok")}catch(e){x(`ERROR: ${e.message}`,"err"),I()&&K()}finally{E=!1}}}async function xi(){if(!E){E=!0;try{await H(),Q(),pe(),fe(),x("═══ FULL ISOLATED PHASE (manager + direct + repro) ═══","info");const e=await Ar(Kt),t=N?.querySelector("#res-iso-full");t&&(t.innerHTML=Zn(e));const r=Yn(e);x(`FULL ISOLATED PHASE: ${r}`,r.includes("FAILURE")||r.includes("EXECUTION")||r.includes("INTERACTION")?"err":"ok")}catch(e){x(`ERROR: ${e.message}`,"err"),I()&&K()}finally{E=!1}}}async function Si(){if(!E){E=!0;try{await H(),Q(),pe(),fe();const e=N?.querySelector("#res-harness-debug");e&&(e.innerHTML=`<div class="card"><div class="card-header"><span class="card-title">Harness debug panel</span></div><div style="padding:8px;font-size:12px;font-family:var(--mono);white-space:pre-wrap">${P(Pr())}</div></div>`),x("HARNESS DEBUG: panel refreshed","info")}catch(e){x(`ERROR: ${e.message}`,"err"),I()&&K()}finally{E=!1}}}async function $i(){if(!E){E=!0;try{await H(),Q(),pe(),fe(),x("═══ HARNESS REGRESSION (TASK 20) seq=4 iters=3 ═══","info");const e=await Yo(4,3),t=N?.querySelector("#res-harness-regression");t&&(t.innerHTML=`<div class="card" style="border-color:${e.passed?"var(--green)":"var(--red)"}">
        <div class="card-header"><span class="card-title">Harness regression</span><span class="badge ${e.passed?"badge-pass":"badge-fail"}">${e.passed?"PASS":"FAIL"}</span></div>
        <div style="padding:8px;font-size:12px;font-family:var(--mono);white-space:pre-wrap">${P(Qo(e))}</div></div>`);const r=N?.querySelector("#res-harness-debug");r&&(r.innerHTML=`<div class="card"><div class="card-header"><span class="card-title">Harness debug panel (after regression)</span></div><div style="padding:8px;font-size:12px;font-family:var(--mono);white-space:pre-wrap">${P(Pr())}</div></div>`),x(`HARNESS REGRESSION: ${e.passed?"PASS":"FAIL"}`,e.passed?"ok":"err")}catch(e){x(`ERROR: ${e.message}`,"err"),I()&&K()}finally{E=!1}}}async function Ei(){if(!E){E=!0;try{await H(),Q(),pe(),fe(),x("═══ CRITICAL ISOLATION seq=256 (A isolated → B fresh-correctness → C warmup-only → D benchmark) ═══","info");const e=await Ko(256),t=e.map(s=>`<tr style="color:${s.ok?"var(--green)":"var(--red)"}"><td class="td-l">${s.step}</td><td>${P(s.label)}</td><td>${s.ok?"PASS":"FAIL"}</td><td style="color:var(--text-dim)">${P(s.details)}</td></tr>`).join(""),r=N?.querySelector("#res-harness-crit");r&&(r.innerHTML=`<div class="card" style="border-color:${e.every(s=>s.ok)?"var(--green)":"var(--red)"}">
        <div class="card-header"><span class="card-title">Critical isolation seq=256</span><span class="badge ${e.every(s=>s.ok)?"badge-pass":"badge-fail"}">${e.every(s=>s.ok)?"ALL PASS":`STOP @ ${e.find(s=>!s.ok)?.step??"?"}`}</span></div>
        <table class="perf-table"><thead><tr><th class="th-l">step</th><th>check</th><th>result</th><th>detail</th></tr></thead><tbody>${t}</tbody></table></div>`),x(`CRITICAL ISOLATION: ${e.every(s=>s.ok)?"ALL PASS":`FAILED at step ${e.find(s=>!s.ok)?.step??"?"}`}`,e.every(s=>s.ok)?"ok":"err")}catch(e){x(`ERROR: ${e.message}`,"err"),I()&&K()}finally{E=!1}}}async function Mi(){if(!E){E=!0;try{await H(),Q(),pe(),fe(),x("═══ PHASE BENCHMARK SERIES (seq=4,16,64,128,256 · 5 iterations/phase) ═══","info");const e=await Vo(Kt,5),t=e.map(a=>{const o=a.correctness.maxErrs.qkt<.01&&a.correctness.maxErrs.soft<.01&&a.correctness.maxErrs.pv<.01;return`<div class="card" style="border-color:${o?"var(--green)":"var(--red)"};margin-top:12px">
          <div class="card-header"><span class="card-title">Phase benchmark seq=${a.seq} (correctness gated)</span>
          <span class="badge ${o?"badge-pass":"badge-fail"}">${o?"PASS":"FAIL"}</span></div>
          <div style="padding:4px 8px;font-size:12px;font-family:var(--mono);color:var(--text-dim)">correctness: qkt=${a.correctness.maxErrs.qkt.toExponential(2)} soft=${a.correctness.maxErrs.soft.toExponential(2)} pv=${a.correctness.maxErrs.pv.toExponential(2)} rowSumDev=${a.correctness.rowSumMaxDev.toExponential(3)}</div>
          ${Pe(`${a.seq}`,a.samples)}
        </div>`}).join(""),r=N?.querySelector("#res-harness-bench");r&&(r.innerHTML=t);const s=N?.querySelector("#res-harness-debug");s&&(s.innerHTML=`<div class="card"><div class="card-header"><span class="card-title">Harness debug panel (after phase benchmark)</span></div><div style="padding:8px;font-size:12px;font-family:var(--mono);white-space:pre-wrap">${P(Pr())}</div></div>`);const n=e.every(a=>a.correctness.maxErrs.qkt<.01&&a.correctness.maxErrs.soft<.01&&a.correctness.maxErrs.pv<.01);x(`PHASE BENCHMARK SERIES: ${n?"ALL CORRECT":"CORRECTNESS FAILURE"} (${e.map(a=>`s${a.seq}:${a.samples.length}/3`).join(" ")})`,n?"ok":"err")}catch(e){x(`ERROR: ${e.message}`,"err"),I()&&K()}finally{E=!1}}}async function Ai(){if(!E){if(!Dt()){x("CORRECTNESS LOCKED — run GPU SANITY, STANDALONE MATMUL and HARNESS MATMUL first.","warn");return}E=!0;try{ve=await H(),Q(),pe(),fe(),x("═══ AETHER KERNEL VALIDATION (sequential, one test at a time) ═══","info");const t=await _a(s=>{x(`${s.pass?"✓":"✗"} ${s.name} — ${s.details}`,s.pass?"ok":"err")});Jo(t);const r=t.length===6&&t.every(s=>s.pass);if(x(r?"ALL KERNELS PASSED":"SOME KERNELS FAILED",r?"ok":"err"),r)Pi(),x("Performance benchmarks UNLOCKED.","ok");else if(!oe){oe=!0;try{localStorage.removeItem("aether.kernels-passed")}catch{}Ot(),x("Performance benchmarks RE-LOCKED (a validated kernel failed).","err")}if(I())K(),x("Requires runtime reinitialization — reload the page (or re-run up the gate diagnostics) before retrying.","err");else{const s=ei(t);s&&(ti(s),ni(s),x("Correctness report saved locally (aether.correctness).","info"))}}catch(e){x(`ERROR: ${e.message}`,"err"),I()&&K()}finally{E=!1}}}function Pi(){oe=!1;try{localStorage.setItem("aether.kernels-passed","1")}catch{}Ot()}function ge(e){return Number.isFinite(e)?e<1?`${(e*1e3).toFixed(1)} µs`:e<1e3?`${e.toFixed(2)} ms`:`${(e/1e3).toFixed(2)} s`:"—"}function Jn(e){return!e||!Number.isFinite(e.value)?"—":`${e.value.toFixed(1)} ${e.unit}`}function es(e){return e==="GPU_TIMESTAMP"?"GPU TIMESTAMP":e==="END_TO_END"?"END-TO-END":e}function Ci(e){return!e||e.length===0?'<tr><td colspan="7" style="color:var(--text-dim)">not run</td></tr>':e.map(t=>t.note&&t.note.startsWith("SKIPPED")?`<tr><td class="td-l">${P(t.size)}</td><td colspan="7" style="color:var(--yellow)">${P(t.note)} — not reported as a failure</td></tr>`:`<tr ${t.error?'style="color:var(--red)"':""}>
          <td class="td-l">${P(t.size)}</td>
          <td>${es(t.timingMode)}</td>
          <td>${ge(t.medianMs)}</td>
          <td>${ge(t.averageMs)}</td>
          <td>${ge(t.minMs)}</td>
          <td>${ge(t.maxMs)}</td>
          <td>${ge(t.stdDevMs)}</td>
          <td>${Jn(t.throughput)}</td>
        </tr>`).join("")}function Pe(e,t){return`<div class="perf-block">
    <div class="perf-block-title">${P(e)} <span class="badge badge-info" style="float:right">${t?t.length:0} run</span></div>
    <table class="perf-table">
      <thead><tr>
        <th class="th-l">size</th><th>mode</th><th>median</th><th>avg</th><th>min</th><th>max</th><th>stddev</th><th>throughput</th>
      </tr></thead>
      <tbody>${Ci(t)}</tbody>
    </table>
  </div>`}function xt(e,t){return t?`<div class="perf-block">
    <div class="perf-block-title">${P(e)} <span class="badge badge-info" style="float:right">${t.timingMode}</span></div>
    <table class="perf-table">
      <thead><tr><th class="th-l">configuration</th><th>per-op</th><th>total</th><th>iterations</th></tr></thead>
      <tbody>
        <tr>
          <td class="td-l">${P(t.name)} <span style="color:var(--text-dim)">· ${P(t.size)}</span></td>
          <td>${ge(t.perOpMs)}</td>
          <td>${ge(t.totalMs)}</td>
          <td>${t.iterations}</td>
        </tr>
      </tbody>
    </table>
    ${t.note?`<div style="font-size:11px;color:var(--text-dim)">${P(t.note)}</div>`:""}
  </div>`:""}function ki(e){const t=Object.entries(e.tests.attentionPhases);return t.length===0?"":`<div class="perf-block">
    <div class="perf-block-title">Attention phases (per sequence length) <span class="badge badge-info" style="float:right">split</span></div>
    ${t.map(([s,n])=>`<div class="perf-sub">${P(s)}</div>${Pe("",n)}`).join("")||'<div style="color:var(--text-dim)">not run</div>'}
  </div>`}function Ti(e){return`<tr style="color:${e.success?"var(--green)":"var(--red)"}">
    <td class="td-l">${e.requestedMiB} MiB</td>
    <td>${e.created?"allocated":"skipped"}</td>
    <td>${e.success?"OK":"FAILED"}</td>
    <td style="color:var(--text-dim)">${P(e.note??"")}</td>
  </tr>`}function Bi(e){if(!e)return"";const t=e.samples.map(r=>`<div class="pad-bar" title="s${r.second}: ${r.gflops.toFixed(2)} GFLOPS" style="height:${Math.max(8,Math.min(80,100-r.gflops))}px"></div>`).join("");return`<div class="perf-block">
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
  </div>`}function Ui(e){const t=N?.querySelector("#perf-results");if(!t)return;const r=ko(e),s=e.commandBatching.map(a=>`<tr><td class="td-l">${P(a.name)}</td><td>${ge(a.totalMedianMs)}</td><td>${ge(a.perDispatchMs)}</td><td>${a.timingMode}</td></tr>`).join(""),n=e.suiteError?`<div class="card" style="border-color:var(--red);margin-top:12px"><div class="card-header"><span class="card-title">SUITE ABORTED</span><span class="badge badge-fail">VALIDATION FAILURE</span></div><div style="font-size:12px;font-family:var(--mono);color:var(--red);margin-top:8px;word-break:break-all">${P(e.suiteError)}</div></div>`:"";t.innerHTML=n+`
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
    ${Pe("Matrix Multiply",e.tests.matmul)}
    ${Pe("Vector Add",e.tests.vecadd)}
    ${Pe("Convolution 3×3",e.tests.conv2d)}
    ${Pe("Softmax",e.tests.softmax)}
    ${Pe("RMSNorm",e.tests.rmsnorm)}
    ${Pe("Attention (single pass)",e.tests.attention)}
    ${ki(e)}
    ${e.memory.length?`<div class="perf-block"><div class="perf-block-title">Largest safe tested tensor</div><table class="perf-table"><thead><tr><th class="th-l">requested</th><th>state</th><th>result</th><th>note</th></tr></thead><tbody>${e.memory.map(Ti).join("")}</tbody></table></div>`:""}
    ${xt("Buffer allocation vs reuse",e.bufferReuse.allocateDestroy)}
    ${xt("",e.bufferReuse.bufferReuse)}
    ${xt("Pipeline cache vs recreate",e.pipelineCache.recreate)}
    ${xt("",e.pipelineCache.cached)}
    ${e.commandBatching.length?`<div class="perf-block"><div class="perf-block-title">Command submission batching</div><table class="perf-table"><thead><tr><th class="th-l">configuration</th><th>total (8 ops)</th><th>per dispatch</th><th>mode</th></tr></thead><tbody>${s}</tbody></table></div>`:""}
    ${Bi(e.sustained)}
    <div class="perf-block">
      <div class="perf-block-title">Interpretation</div>
      <div style="font-size:12px;line-height:1.5;color:var(--text);margin-top:6px">${r.map(a=>`<div>• ${P(a)}</div>`).join("")}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Interpretation is data-driven from the samples above — no fabricated GPU utilization, thermal state or theoretical maxima.</div>
    </div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn" id="btn-export-perf">EXPORT JSON</button>
      <button class="btn btn-outline" id="btn-copy-perf">COPY RESULTS</button>
    </div>
  `,t.querySelector("#btn-export-perf")?.addEventListener("click",()=>Ri()),t.querySelector("#btn-copy-perf")?.addEventListener("click",()=>Di())}function Ri(){if(!mt)return;const e=JSON.stringify(Co(mt),null,2),t=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(t),s=document.createElement("a");s.href=r,s.download=`aether-gpu-benchmark-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`,s.click(),URL.revokeObjectURL(r)}function Di(){if(!mt)return;const e=mt,t=[];t.push(`AETHER GPU BENCHMARK — ${e.device.adapterName} (${e.device.adapterVendor})`),t.push(`timing mode: ${e.timingMode}`),t.push(`thermal: ${e.browser.thermalState} · GPU utilization: ${e.browser.gpuUtilization}`),t.push(e.suiteError?`SUITE ERROR: ${e.suiteError}`:""),t.push("");const r=(s,n)=>{t.push(s);for(const a of n)t.push(`  ${a.size} — ${ge(a.medianMs)} median (${es(a.timingMode)})${a.throughput?` · ${Jn(a.throughput)}`:""}`);t.push("")};r("matmul",e.tests.matmul),r("vecadd",e.tests.vecadd),r("conv2d",e.tests.conv2d),r("softmax",e.tests.softmax),r("rmsnorm",e.tests.rmsnorm),r("attention",e.tests.attention);for(const[s,n]of Object.entries(e.tests.attentionPhases))r(`attention phases ${s}`,n);e.sustained&&t.push(`sustained 30s: avg ${e.sustained.avgGflops.toFixed(2)} GFLOPS, throttled=${e.sustained.throttled}, drop=${e.sustained.dropPct.toFixed(1)}%`),navigator.clipboard?.writeText(t.join(`
`)).catch(()=>{}),x("Benchmark summary copied to clipboard.","ok")}function Ot(){const e=N?.querySelector("#btn-perf-quick"),t=N?.querySelector("#btn-perf-full"),r=N?.querySelector("#btn-perf-sustained"),s=N?.querySelector("#chk-sustained");e&&(e.disabled=oe,e.textContent=oe?"QUICK BENCHMARK (LOCKED)":"QUICK BENCHMARK"),t&&(t.disabled=oe,t.textContent=oe?"FULL BENCHMARK (LOCKED)":"FULL BENCHMARK"),s&&(s.checked=Fe),r&&(r.disabled=oe||!Fe,r.textContent=oe?"SUSTAINED (LOCKED)":Fe?"SUSTAINED 30s":"SUSTAINED (ARM FIRST)")}function nr(e){if(E){x("A benchmark is already running — wait for it to finish.","warn");return}if(e==="sustained"&&!Fe){x('SUSTAINED is not armed — confirm "Enable sustained 30s run" first.',"warn");return}E=!0;try{const t=e==="quick"?"QUICK":e==="full"?"FULL":"SUSTAINED";x(`═══ AETHER GPU PERFORMANCE — ${t} BENCHMARK ═══`,"info"),No({mode:e,onProgress:r=>x(`  ${r}...`,"info"),onSecond:(r,s)=>x(`  ${s}`,"info")}).then(r=>{mt=r,Ui(r),x(r.suiteError?`SUITE ABORTED: ${r.suiteError}`:`${t} benchmark complete — mode: ${r.timingMode}`,r.suiteError?"err":"ok"),r.suiteError&&x("STOP — a validated kernel failed. Fix correctness before benchmarking.","err")}).catch(r=>x(`ERROR: ${r.message}`,"err")).finally(()=>{E=!1})}catch(t){E=!1,x(`ERROR: ${t.message}`,"err")}}function Oi(e){const t=e.querySelector("#perf-panel");t&&(t.innerHTML=`
    <div class="card" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER GPU PERFORMANCE</span>
        <span class="badge ${oe?"badge-fail":"badge-pass"}">${oe?"LOCKED":"UNLOCKED"}</span>
      </div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:6px">
        ${oe?"Run GPU SANITY → STANDALONE MATMUL → HARNESS MATMUL → CORRECTNESS (all six kernels pass) to unlock. Timing comes from GPU timestamp queries where the device supports them, otherwise honest END-TO-END GPU submission timing. Sustained (30s) stays disabled until you arm it below.":"Timing uses GPU timestamp queries where supported, otherwise honest END-TO-END GPU submission timing (never labeled GPU execution time). Sustained (30s) stays disabled until you arm it below."}
      </div>
      <div class="btn-row" style="margin-top:10px;flex-wrap:wrap">
        <button class="btn" id="btn-perf-quick">QUICK BENCHMARK</button>
        <button class="btn btn-outline" id="btn-perf-full">FULL BENCHMARK</button>
        <button class="btn btn-outline" id="btn-perf-sustained">SUSTAINED (ARM FIRST)</button>
      </div>
      <label style="display:flex;align-items:center;gap:6px;margin-top:10px;font-size:12px;color:var(--text-dim)">
        <input type="checkbox" id="chk-sustained" ${Fe?"checked":""}>
        enable SUSTAINED 30s run (continuous MatMul load, per-second samples, thermal before/after)
      </label>
    </div>
    <div id="perf-results"></div>
  `,e.querySelector("#btn-perf-quick")?.addEventListener("click",()=>nr("quick")),e.querySelector("#btn-perf-full")?.addEventListener("click",()=>nr("full")),e.querySelector("#btn-perf-sustained")?.addEventListener("click",()=>nr("sustained")),e.querySelector("#chk-sustained")?.addEventListener("change",r=>{Fe=r.target.checked;try{localStorage.setItem("aether.sustained.armed",Fe?"1":"0")}catch{}Ot()}),Ot())}function Ii(e){const t=e.querySelector("#diag-panel");if(!t)return;const r=[["location.href",location.href],["location.hash",location.hash],["location.protocol",location.protocol],["window.isSecureContext",String(window.isSecureContext)],["navigator.userAgent",navigator.userAgent],["AETHER_BUILD_ID",rt],["Built at",pt||"n/a"],["Benchmark code revision",rt]];t.innerHTML=r.map(([s,n])=>`<div style="font-size:11px;font-family:var(--mono);word-break:break-all">
        <span style="color:var(--text-dim)">${s}:</span> <b style="color:var(--text)">${n}</b>
      </div>`).join("")}function Ni(e){N=e,mr=!1,e.innerHTML=`
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

    <div class="btn-row" style="margin-top:12px">
      <button class="btn btn-outline" id="btn-minimal-64">RUN MINIMAL HARNESS MATMUL 64×64</button>
      <button class="btn btn-outline" id="btn-minimal-128">RUN MINIMAL HARNESS MATMUL 128×128</button>
      <button class="btn btn-outline" id="btn-readback-test">RUN READBACK TEST (4B → 1MB)</button>
      <button class="btn btn-outline" id="btn-readback-stress">RUN READBACK STRESS</button>
      <button class="btn btn-outline" id="btn-attention">RUN ATTENTION CORRECTNESS</button>
      <button class="btn btn-outline" id="btn-phase-softmax">RUN ATTENTION PHASE SOFTMAX</button>
      <button class="btn btn-outline" id="btn-iso-qkt">RUN ISOLATED QKT</button>
      <button class="btn btn-outline" id="btn-iso-phase">RUN ISOLATED PHASE SOFTMAX</button>
      <button class="btn btn-outline" id="btn-iso-full">RUN FULL ISOLATED PHASE</button>
      <button class="btn btn-outline" id="btn-harness-debug">HARNESS DEBUG PANEL</button>
      <button class="btn btn-outline" id="btn-harness-crit">CRITICAL ISOLATION SEQ=256</button>
      <button class="btn btn-outline" id="btn-harness-regression">RUN HARNESS REGRESSION</button>
      <button class="btn btn-outline" id="btn-harness-bench">PHASE BENCHMARK SEQ=4..256</button>
    </div>

    <div id="res-minimal-64"></div>
    <div id="res-minimal-128"></div>
    <div id="res-readback-test"></div>
    <div id="res-readback-stress"></div>
    <div id="res-attention"></div>
    <div id="res-phase-softmax"></div>
    <div id="res-iso-qkt"></div>
    <div id="res-iso-phase"></div>
    <div id="res-iso-full"></div>
    <div id="res-harness-debug"></div>
    <div id="res-harness-crit"></div>
    <div id="res-harness-regression"></div>
    <div id="res-harness-bench"></div>
    <div id="res-readback-engine"></div>

    <div id="validation-panel"></div>
    <div id="report-panel"></div>
    <div id="perf-panel"></div>

    <div class="log" id="bench-log"></div>

    <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;font-family:var(--mono);color:var(--text-dim)">
      <div>AETHER BUILD: <b id="build-id" style="color:var(--text)">${rt}</b></div>
      <div>Git commit: <b id="build-commit" style="color:var(--text)">${Ut??"unavailable"}</b></div>
      <div>Build time: <b id="build-time" style="color:var(--text)">${pt||"unavailable"}</b></div>
      <div>Environment: GitHub Pages</div>
    </div>
  `,Ii(e),e.querySelector("#btn-sanity")?.addEventListener("click",si),e.querySelector("#btn-standalone")?.addEventListener("click",ai),e.querySelector("#btn-direct")?.addEventListener("click",oi),e.querySelector("#btn-minimal-64")?.addEventListener("click",()=>mn(64,"res-minimal-64")),e.querySelector("#btn-minimal-128")?.addEventListener("click",()=>mn(128,"res-minimal-128")),e.querySelector("#btn-readback-test")?.addEventListener("click",ii),e.querySelector("#btn-readback-stress")?.addEventListener("click",ui),e.querySelector("#btn-attention")?.addEventListener("click",li),e.querySelector("#btn-phase-softmax")?.addEventListener("click",di),e.querySelector("#btn-iso-qkt")?.addEventListener("click",vi),e.querySelector("#btn-iso-phase")?.addEventListener("click",wi),e.querySelector("#btn-iso-full")?.addEventListener("click",xi),e.querySelector("#btn-harness-debug")?.addEventListener("click",Si),e.querySelector("#btn-harness-crit")?.addEventListener("click",Ei),e.querySelector("#btn-harness-regression")?.addEventListener("click",$i),e.querySelector("#btn-harness-bench")?.addEventListener("click",Mi),e.querySelector("#btn-harness")?.addEventListener("click",ci);const t=e.querySelector("#btn-correctness");t&&(t.addEventListener("click",Ai),t.disabled=!Dt(),t.textContent=Dt()?"CORRECTNESS":"CORRECTNESS (LOCKED)"),Oi(e);const r=s=>{s.preventDefault()};window.addEventListener("error",r),window.addEventListener("unhandledrejection",r),H().then(s=>{ve=s,Q(),Cr();const n=e.querySelector("#device-badge"),a=e.querySelector("#device-info");n&&(n.textContent="WEBGPU READY",n.className="badge badge-pass"),a&&(a.innerHTML=`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
          <span>Adapter:</span><span style="color:var(--text)">${s.adapterName}</span>
          <span>Vendor:</span><span style="color:var(--text)">${s.adapterVendor}</span>
          <span>Features:</span><span style="color:var(--text)">${s.adapterFeatures.length}</span>
          <span>Max Buffer:</span><span style="color:var(--text)">${pn(s.maxBufferSize)}</span>
          <span>Max Storage:</span><span style="color:var(--text)">${pn(s.maxStorageBufferBindingSize)}</span>
          <span>Workgroup X:</span><span style="color:var(--text)">${s.maxComputeWorkgroupSizeX}</span>
          <span>Invocations/wg:</span><span style="color:var(--text)">${s.maxComputeInvocationsPerWorkgroup}</span>
          <span>Timestamp Query:</span><span style="color:var(--text)">${s.timestampQuerySupport?"YES":"NO"}</span>
          <span>Preferred Format:</span><span style="color:var(--text)">${s.preferredCanvasFormat??"N/A"}</span>
          <span>Fallback:</span><span style="color:var(--text)">${s.isFallbackAdapter?"YES (software)":"NO (hardware)"}</span>
        </div>
      `)}).catch(s=>{const n=e.querySelector("#device-badge");n&&(n.textContent="WEBGPU UNAVAILABLE",n.className="badge badge-fail"),x(`WEBGPU not available: ${s.message}`,"err")})}const Gi=Object.freeze(Object.defineProperty({__proto__:null,render:Ni},Symbol.toStringTag,{value:"Module"}));function Li(e){const t=e.toLowerCase();return t.includes("aether")||t==="external-cache"||t.startsWith("workbox-")||t.includes("webgpu")}async function ts(){if("serviceWorker"in navigator)try{const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(t=>t.unregister().catch(()=>{})))}catch{}}async function rs(){if("caches"in window)try{const e=await caches.keys();await Promise.all(e.filter(Li).map(t=>caches.delete(t).catch(()=>{})))}catch{}}async function Fi(){try{const e=[],t=indexedDB;if(t.databases){const r=await t.databases();for(const s of r)s.name&&s.name.toLowerCase().includes("aether")&&e.push(s.name)}else e.push("aether-gpu-benchmark");for(const r of e)await new Promise(s=>{const n=indexedDB.deleteDatabase(r);n.onsuccess=()=>s(),n.onerror=()=>s(),n.onblocked=()=>s()})}catch{}}async function _i(){await ts(),await rs()}async function qi(){await ts(),await rs(),await Fi()}const kr=[{id:"gpubench",label:"GPU Bench",module:Gi},{id:"device",label:"Device Test",module:cs},{id:"webgpudiag",label:"WebGPU Diag",module:oa},{id:"model",label:"Model Test",module:vs},{id:"tensor",label:"Tensor Bench",module:na},{id:"image",label:"Image Test",module:xs},{id:"video",label:"Video Test",module:Ms},{id:"diag",label:"Diagnostics",module:ks}];let ns="gpubench";function gn(){const e=window.location.hash.replace("#","");return kr.some(t=>t.id===e)?e:e==="diagnostics/webgpu"||e==="webgpu"?"webgpudiag":"gpubench"}function sr(e){ns=e,window.location.hash=e;const t=document.getElementById("nav"),r=document.getElementById("screen");t.querySelectorAll("button").forEach(n=>{n.classList.toggle("active",n.dataset.screen===e)});const s=kr.find(n=>n.id===e);s&&s.module.render(r)}function zi(){const e=document.getElementById("app");e.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const t=document.getElementById("nav");document.getElementById("screen"),kr.forEach(s=>{const n=document.createElement("button");n.textContent=s.label,n.dataset.screen=s.id,n.addEventListener("click",()=>sr(s.id)),t.appendChild(n)});const r=gn();sr(r),window.addEventListener("hashchange",()=>{const s=gn();s!==ns&&sr(s)})}function Wi(){const e=document.getElementById("app");e.innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;text-align:center;gap:16px;padding:24px">
      <h2 style="color:var(--green, #22c55e);margin:0">AETHER CACHE RESET COMPLETE</h2>
      <p style="color:var(--text-dim, #9ca3af);margin:0">Please reload AETHER normally.</p>
      <button id="btn-reset-reload" class="btn">Reload AETHER</button>
    </div>
  `,e.querySelector("#btn-reset-reload")?.addEventListener("click",()=>{history.replaceState(null,"",window.location.pathname+window.location.search),window.location.reload()})}async function bn(){if(window.location.hash==="#reset"){await qi(),Wi();return}await _i(),zi()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>void bn()):bn();
