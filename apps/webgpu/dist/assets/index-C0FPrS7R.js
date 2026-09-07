(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();function Yt(e){let t="Unknown",n="Unknown",a="Unknown",r="Unknown";const o=e.match(/OS (\d+)_(\d+)/);o&&(a="iOS",r=`${o[1]}.${o[2]}`);const s=e.match(/Mac OS X (\d+)[_.](\d+)/);if(s&&(a="macOS",r=`${s[1]}.${s[2]}`),e.includes("Windows")){a="Windows";const u=e.match(/Windows NT (\d+\.\d+)/);u&&(r=u[1])}if(e.includes("Android")){a="Android";const u=e.match(/Android (\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")){t="Safari";const u=e.match(/Version\/(\d+[\.\d]*)/);u&&(n=u[1])}if(e.includes("Chrome")&&!e.includes("Edg")){t="Chrome";const u=e.match(/Chrome\/(\d+[\.\d]*)/);u&&(n=u[1])}if(e.includes("Edg/")){t="Edge";const u=e.match(/Edg\/(\d+[\.\d]*)/);u&&(n=u[1])}if(e.includes("Firefox")){t="Firefox";const u=e.match(/Firefox\/(\d+[\.\d]*)/);u&&(n=u[1])}return{browserName:t,browserVersion:n,osName:a,osVersion:r}}function Xt(e){return!!(e.includes("FBAN")||e.includes("FBIOS")||e.includes("Twitter")||e.includes("Instagram")||e.includes("Line/")||e.includes("WeChat")||e.includes("MicroMessenger")||e.includes("CocoaPods")||e.includes("wv)")||e.includes("Electron")||e.includes("; wv)"))}function Qt(e){return e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")}async function Ne(){const e=navigator.userAgent,t=Yt(e),n=t.osName==="iOS",a=Qt(e),r=Xt(e),o=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,s={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:e,platform:navigator.platform,isIOS:n,isSafari:a,isWebView:r,isStandalone:o,browserName:t.browserName,browserVersion:t.browserVersion,osName:t.osName,osVersion:t.osVersion},i={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(r)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:s,gpu:i};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:n?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:s,gpu:i};if(!navigator.gpu){let u="navigator.gpu is undefined. WebGPU API is not exposed.",c="";if(n){if(parseInt(t.osVersion.split(".")[0],10)<26)return u=`iOS ${t.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,c="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i};if(t.browserName!=="Safari")return u=`Running ${t.browserName} on iOS ${t.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,c="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:u,recommendation:c,environment:s,gpu:i}}return t.osName==="macOS"&&parseInt(t.osVersion.split(".")[0],10)<14?(u=`macOS ${t.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,c="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i}):(c="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i})}try{const u=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!u){i.adapterError="requestAdapter() returned null";let f="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",d="";return n?parseInt(t.osVersion.split(".")[0],10)>=26&&(f=`iOS ${t.osVersion} with Safari ${t.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,d="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(f="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",d="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):d="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:f,recommendation:d,environment:s,gpu:i}}i.adapterName=u.name??"Unknown GPU",i.adapterVendor=u.vendor??"Unknown",i.adapterDevice=u.device??"Unknown",i.isFallbackAdapter=u.isFallbackAdapter??!1;const c=[];for(const f of u.features)c.push(f.replace(/-/g," ").replace(/\b\w/g,d=>d.toUpperCase()));i.features=c;const l=u.limits;i.limits={maxBufferSize:l.maxBufferSize,maxTextureDimension1D:l.maxTextureDimension1D,maxTextureDimension2D:l.maxTextureDimension2D,maxTextureDimension3D:l.maxTextureDimension3D,maxComputeWorkgroupStorageSize:l.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:l.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:l.maxStorageBufferBindingSize,maxUniformBufferBindingSize:l.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:l.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:l.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:l.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:l.maxComputeWorkgroupsPerDimension,maxColorAttachments:l.maxColorAttachments,minStorageBufferOffsetAlignment:l.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:l.minUniformBufferOffsetAlignment};try{(await u.requestDevice({requiredLimits:{}})).destroy()}catch(f){return i.deviceError=f.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${i.adapterName}) but requestDevice() failed: ${f.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:s,gpu:i}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${i.adapterName}.`,recommendation:"No action needed.",environment:s,gpu:i}}catch(u){return i.adapterError=u.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${u.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:s,gpu:i}}}function Et(e){const t=[];if(t.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),t.push(""),t.push(`STATUS: ${e.statusLabel}`),t.push(`CASE: ${e.case}`),t.push(`REASON: ${e.reason}`),t.push(`RECOMMENDATION: ${e.recommendation}`),t.push(""),t.push("── ENVIRONMENT ──"),t.push(`  URL: ${e.environment.url}`),t.push(`  Protocol: ${e.environment.protocol}`),t.push(`  Hostname: ${e.environment.hostname}`),t.push(`  Secure Context: ${e.environment.isSecureContext}`),t.push(`  iOS: ${e.environment.isIOS}`),t.push(`  Safari: ${e.environment.isSafari}`),t.push(`  WebView: ${e.environment.isWebView}`),t.push(`  Standalone PWA: ${e.environment.isStandalone}`),t.push(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`),t.push(`  OS: ${e.environment.osName} ${e.environment.osVersion}`),t.push(`  Platform: ${e.environment.platform}`),t.push(`  User Agent: ${e.environment.userAgent}`),t.push(""),t.push("── WEBGPU ──"),t.push(`  navigator.gpu exists: ${e.gpu.navigatorGpuExists}`),e.gpu.adapterName&&t.push(`  Adapter: ${e.gpu.adapterName}`),e.gpu.adapterVendor&&t.push(`  Vendor: ${e.gpu.adapterVendor}`),e.gpu.adapterDevice&&t.push(`  Device: ${e.gpu.adapterDevice}`),e.gpu.adapterError&&t.push(`  Adapter Error: ${e.gpu.adapterError}`),e.gpu.deviceError&&t.push(`  Device Error: ${e.gpu.deviceError}`),t.push(`  Fallback adapter: ${e.gpu.isFallbackAdapter}`),e.gpu.features.length>0){t.push(`  Features (${e.gpu.features.length}):`);for(const n of e.gpu.features)t.push(`    ${n}`)}if(e.gpu.limits){t.push("  Limits:");for(const[n,a]of Object.entries(e.gpu.limits))t.push(`    ${n}: ${typeof a=="number"?a.toLocaleString():a}`)}return t.push(""),t.push(`Timestamp: ${new Date().toISOString()}`),t.join(`
`)}function Pe(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function ce(){const e=await Ne();if(!e.ready||!e.gpu.adapterName)return null;const t=e.gpu.limits;return{available:!0,adapterName:e.gpu.adapterName,adapterVendor:e.gpu.adapterVendor,adapterDevice:e.gpu.adapterDevice,features:e.gpu.features,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:e.gpu.isFallbackAdapter,featuresMap:new Set(e.gpu.features),diagnostic:e}}async function le(e,t=[]){const n=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!n)throw new Error("Failed to re-acquire GPU adapter");const a=await n.requestDevice({requiredFeatures:t.filter(r=>e.featuresMap.has(r)),requiredLimits:{}});return a.lost.then(r=>{console.error("WebGPU device lost:",r.message)}),a}function Zt(e){const t=e.environment,n=e.gpu;let a="badge-fail";e.case==="D"?a="badge-pass":(e.case==="B"||e.case==="C")&&(a="badge-warn");let r=`
    <div class="card" style="border-color:${e.ready?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)"}">
      <div class="card-header">
        <span class="card-title" style="font-size:18px">${e.statusLabel}</span>
        <span class="badge ${a}">CASE ${e.case}</span>
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
  `;return n.adapterName&&(r+=`
      <h3>GPU Adapter</h3>
      <div class="card">
        <div class="row"><span class="row-label">Name</span><span class="row-value">${n.adapterName}</span></div>
        <div class="row"><span class="row-label">Vendor</span><span class="row-value">${n.adapterVendor||"Unknown"}</span></div>
        <div class="row"><span class="row-label">Device</span><span class="row-value">${n.adapterDevice||"Unknown"}</span></div>
        <div class="row"><span class="row-label">Fallback</span><span class="row-value">${n.isFallbackAdapter?"Yes (software)":"No (hardware)"}</span></div>
      </div>
    `),n.adapterError&&(r+=`
      <h3>Adapter Error</h3>
      <div class="card" style="border-color:var(--red)">
        <p style="font-size:13px;color:var(--red)">${n.adapterError}</p>
      </div>
    `),n.deviceError&&(r+=`
      <h3>Device Error</h3>
      <div class="card" style="border-color:var(--red)">
        <p style="font-size:13px;color:var(--red)">${n.deviceError}</p>
      </div>
    `),n.limits&&(r+=`
      <h3>GPU Limits</h3>
      <div class="card">
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${Pe(n.limits.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${n.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${n.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${n.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${Pe(n.limits.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${Pe(n.limits.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${Pe(n.limits.maxComputeWorkgroupStorageSize)}</span></div>
        <div class="row"><span class="row-label">Max invocations/wg</span><span class="row-value">${n.limits.maxComputeInvocationsPerWorkgroup}</span></div>
        <div class="row"><span class="row-label">Max workgroup size</span><span class="row-value">${n.limits.maxComputeWorkgroupSizeX}×${n.limits.maxComputeWorkgroupSizeY}×${n.limits.maxComputeWorkgroupSizeZ}</span></div>
        <div class="row"><span class="row-label">Max workgroups/dim</span><span class="row-value">${n.limits.maxComputeWorkgroupsPerDimension}</span></div>
        <div class="row"><span class="row-label">Max color attachments</span><span class="row-value">${n.limits.maxColorAttachments}</span></div>
        <div class="row"><span class="row-label">Storage buf alignment</span><span class="row-value">${n.limits.minStorageBufferOffsetAlignment} B</span></div>
        <div class="row"><span class="row-label">Uniform buf alignment</span><span class="row-value">${n.limits.minUniformBufferOffsetAlignment} B</span></div>
      </div>
    `),n.features.length>0&&(r+=`
      <h3>Features (${n.features.length})</h3>
      <div class="card">
        ${n.features.map(o=>`<div class="row"><span class="row-value">${o}</span></div>`).join("")}
      </div>
    `),r}function Jt(e){e.innerHTML=`
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;const t=e.querySelector("#device-status"),n=e.querySelector("#device-info");Ne().then(a=>{a.ready?t.innerHTML=`
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `:t.innerHTML="",n.innerHTML=Zt(a)})}const er=Object.freeze(Object.defineProperty({__proto__:null,render:Jt},Symbol.toStringTag,{value:"Module"}));let k=class Tt{buffer;shape;dtype;size;device;constructor(t,n,a="f32"){this.device=t,this.shape=[...n],this.dtype=a,this.size=n.reduce((s,i)=>s*i,1);const r=a==="f32"?4:a==="f16"?2:4;this.buffer=t.createBuffer({size:this.size*r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(a==="f32"?new Float32Array(this.buffer.getMappedRange()):a==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(t,n,a){const r=new Tt(t,a,n instanceof Float32Array?"f32":"i32");return t.queue.writeBuffer(r.buffer,0,n.buffer),r}async readback(){const t=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),n=this.device.createCommandEncoder();n.copyBufferToBuffer(this.buffer,0,t,0,this.buffer.size),this.device.queue.submit([n.finish()]),await t.mapAsync(GPUMapMode.READ);const a=new Float32Array(t.getMappedRange().slice(0));return t.unmap(),t.destroy(),a}destroy(){this.buffer.destroy()}};async function Se(e,t,n=50,a){const r=[];for(let c=0;c<Math.min(5,n);c++)await t();for(let c=0;c<n;c++){const l=performance.now();await t(),await kt?.queue.onSubmittedWorkDone();const f=performance.now();r.push(f-l)}r.sort((c,l)=>c-l);const o=r.reduce((c,l)=>c+l,0)/r.length,s=r[0],i=r[r.length-1],u={name:e,avgMs:o,minMs:s,maxMs:i,iterations:n};if(a){const l=a/(o/1e3)/1e9;u.gflops=l,u.throughput=`${l.toFixed(2)} GFLOPS`}return u}let kt=null;function fe(e){kt=e}function Be(e){const t=[`${e.name}: ${e.avgMs.toFixed(2)} ms avg`,`(${e.minMs.toFixed(2)} – ${e.maxMs.toFixed(2)} ms)`,`[${e.iterations} iterations]`];return e.throughput&&t.push(e.throughput),t.join(" ")}const Ge=`
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
`,tr=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= uniforms.N) { return; }
  data[i] = max(data[i], 0.0);
}
`,rr=`
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
`,nr=`
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
`,ar=`
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
`,or=`
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
`;let y=null,me=null;function T(e,t=""){if(!me)return;const n=document.createElement("div");n.className=`log-entry ${t}`,n.textContent=e,me.appendChild(n),me.scrollTop=me.scrollHeight}async function st(){T("═══ TINY NEURAL NETWORK TEST ═══","info"),T("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),T("");const e=await ce();if(!e)return T("WebGPU not available","err"),!1;y=await le(e),fe(y);const t=performance.now(),n=k.fromData(y,new Float32Array([1,.5,-.3,.8]),[4]),a=k.fromData(y,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),r=k.fromData(y,new Float32Array([.1,-.1,.2]),[3]),o=new ArrayBuffer(12),s=new Uint32Array(o);s[0]=1,s[1]=3,s[2]=4;const i=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:y.createShaderModule({code:Ge}),entryPoint:"main"}}),c=y.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(c,0,o);const l=new k(y,[1,3]),f=y.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:a.buffer}},{binding:3,resource:{buffer:l.buffer}}]});let d=y.createCommandEncoder(),p=d.beginComputePass();p.setPipeline(u),p.setBindGroup(0,f),p.dispatchWorkgroups(1,1,1),p.end(),y.queue.submit([d.finish()]),T(`  input[4]:  [${Array.from(await n.readback()).map(F=>F.toFixed(2)).join(", ")}]`,""),T("  W1[4×3]:   4 rows × 3 cols",""),T("  Matmul result: computing...","");const m=await l.readback();T(`  h1 = input @ W1: [${Array.from(m).map(F=>F.toFixed(3)).join(", ")}]`,"ok");for(let F=0;F<3;F++)m[F]+=[.1,-.1,.2][F];y.queue.writeBuffer(l.buffer,0,m.buffer),T(`  h1 + bias:       [${Array.from(m).map(F=>F.toFixed(3)).join(", ")}]`,"ok");const g=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),b=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[g]}),compute:{module:y.createShaderModule({code:tr}),entryPoint:"main"}}),v=new ArrayBuffer(4);new Uint32Array(v)[0]=3;const x=y.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(x,0,v);const S=y.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:l.buffer}}]});d=y.createCommandEncoder(),p=d.beginComputePass(),p.setPipeline(b),p.setBindGroup(0,S),p.dispatchWorkgroups(1,1,1),p.end(),y.queue.submit([d.finish()]);const A=await l.readback();T(`  ReLU(h1):         [${Array.from(A).map(F=>F.toFixed(3)).join(", ")}]`,"ok");const w=k.fromData(y,new Float32Array([.7,-.3,.5]),[3,1]),B=new k(y,[1,1]),E=new ArrayBuffer(12),C=new Uint32Array(E);C[0]=1,C[1]=1,C[2]=3;const G=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),N=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[G]}),compute:{module:y.createShaderModule({code:Ge}),entryPoint:"main"}}),re=y.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(re,0,E);const de=y.createBindGroup({layout:G,entries:[{binding:0,resource:{buffer:re}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:w.buffer}},{binding:3,resource:{buffer:B.buffer}}]});d=y.createCommandEncoder(),p=d.beginComputePass(),p.setPipeline(N),p.setBindGroup(0,de),p.dispatchWorkgroups(1,1,1),p.end(),y.queue.submit([d.finish()]);const Ae=await B.readback(),Ue=(performance.now()-t).toFixed(1);return T(`  Final output: ${Ae[0].toFixed(4)}`,"ok"),T(`  Total pipeline: ${Ue} ms`,"ok"),T("",""),T("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),n.destroy(),a.destroy(),r.destroy(),l.destroy(),w.destroy(),B.destroy(),c.destroy(),re.destroy(),x.destroy(),y.destroy(),!0}async function sr(){T("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const e=await ce();if(!e)return null;y=await le(e),fe(y);const t=[64,128,256,512],n=[];for(const a of t){const r=k.fromData(y,new Float32Array(a*a).fill(1),[a,a]),o=k.fromData(y,new Float32Array(a*a).fill(.5),[a,a]),s=new k(y,[a,a]),i=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:y.createShaderModule({code:Ge}),entryPoint:"main"}}),c=new ArrayBuffer(12),l=new Uint32Array(c);l[0]=a,l[1]=a,l[2]=a;const f=await Se(`${a}×${a} matmul`,async()=>{const d=y.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(d,0,c);const p=y.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:s.buffer}}]}),m=y.createCommandEncoder(),g=m.beginComputePass();g.setPipeline(u),g.setBindGroup(0,p);const b=Math.ceil(a/16);g.dispatchWorkgroups(b,b,1),g.end(),y.queue.submit([m.finish()]),d.destroy()},30,2*a*a*a);n.push(f),T(Be(f),"ok"),r.destroy(),o.destroy(),s.destroy()}return y.destroy(),n[n.length-1]}async function ir(){T("═══ CONVOLUTION BENCHMARK ═══","info");const e=await ce();if(!e)return null;y=await le(e),fe(y);const t=1,n=3,a=32,r=32,o=8,s=3,i=3,u=a-s+1,c=r-i+1,l=k.fromData(y,new Float32Array(t*n*a*r).fill(.5),[t,n,a,r]),f=k.fromData(y,new Float32Array(o*n*s*i).fill(.1),[o,n,s,i]),d=new k(y,[t,o,u,c]),p=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),m=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[p]}),compute:{module:y.createShaderModule({code:rr}),entryPoint:"main"}}),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=t,b[1]=n,b[2]=a,b[3]=r,b[4]=o,b[5]=s,b[6]=i,b[7]=u,b[8]=c;const v=await Se(`Conv2D ${t}×${n}×${a}×${r} k=${s}→${o}×${u}×${c}`,async()=>{const x=y.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(x,0,g);const S=y.createBindGroup({layout:p,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:f.buffer}},{binding:3,resource:{buffer:d.buffer}}]}),A=y.createCommandEncoder(),w=A.beginComputePass();w.setPipeline(m),w.setBindGroup(0,S),w.dispatchWorkgroups(t,o,1),w.end(),y.queue.submit([A.finish()]),x.destroy()},20,2*t*o*n*s*i*u*c);return T(Be(v),"ok"),l.destroy(),f.destroy(),d.destroy(),y.destroy(),v}async function ur(){T("═══ ATTENTION BENCHMARK ═══","info");const e=await ce();if(!e)return null;y=await le(e),fe(y);const t=1,n=64,a=64,r=1/Math.sqrt(a),o=k.fromData(y,new Float32Array(t*n*a).fill(.1),[t,n,a]),s=k.fromData(y,new Float32Array(t*n*a).fill(.1),[t,n,a]),i=k.fromData(y,new Float32Array(t*n*a).fill(.1),[t,n,a]),u=new k(y,[t,n,a]),c=new k(y,[t,n,n]),l=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),f=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[l]}),compute:{module:y.createShaderModule({code:nr}),entryPoint:"main"}}),d=new ArrayBuffer(16),p=new Uint32Array(d),m=new Float32Array(d);p[0]=t,p[1]=n,p[2]=a,m[3]=r;const g=await Se(`Attention b=${t} s=${n} d=${a}`,async()=>{const b=y.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(b,0,d);const v=y.createBindGroup({layout:l,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}},{binding:4,resource:{buffer:u.buffer}},{binding:5,resource:{buffer:c.buffer}}]}),x=y.createCommandEncoder(),S=x.beginComputePass();S.setPipeline(f),S.setBindGroup(0,v),S.dispatchWorkgroups(t,1,1),S.end(),y.queue.submit([x.finish()]),b.destroy()},20);return T(Be(g),"ok"),o.destroy(),s.destroy(),i.destroy(),u.destroy(),c.destroy(),y.destroy(),g}function cr(e){e.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,me=e.querySelector("#model-log"),e.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{me.innerHTML="",await st()}),e.querySelector("#btn-all-bench").addEventListener("click",async()=>{me.innerHTML="",await st(),T("",""),await sr(),T("",""),await ir(),T("",""),await ur(),T("",""),T("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const lr=Object.freeze(Object.defineProperty({__proto__:null,render:cr},Symbol.toStringTag,{value:"Module"}));let $=null,ie=null;function Y(e,t=""){if(!ie)return;const n=document.createElement("div");n.className=`log-entry ${t}`,n.textContent=e,ie.appendChild(n),ie.scrollTop=ie.scrollHeight}function Gt(e,t){const n=new Float32Array(e*t*4);for(let a=0;a<t;a++)for(let r=0;r<e;r++){const o=(a*e+r)*4,s=(r>>4)+(a>>4)&1;n[o+0]=s?.9:r/e*.8,n[o+1]=s?.3:a/t*.6,n[o+2]=s?.6:.4,n[o+3]=1}return n}function ze(e,t,n){const a=document.createElement("canvas");a.width=t,a.height=n;const r=a.getContext("2d"),o=r.createImageData(t,n);for(let s=0;s<t*n*4;s++)o.data[s]=Math.round(e[s]*255);return r.putImageData(o,0,0),a}async function it(){Y("═══ GRAYSCALE TEST ═══","info");const e=await ce();if(!e){Y("WebGPU unavailable","err");return}$=await le(e),fe($);const t=256,n=256,a=Gt(t,n),r=k.fromData($,a,[t*n*4]),o=new k($,[t*n*4]),s=$.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=$.createComputePipeline({layout:$.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:$.createShaderModule({code:or}),entryPoint:"main"}}),u=new ArrayBuffer(4);new Uint32Array(u)[0]=t*n;const c=await Se("Grayscale 256×256",async()=>{const m=$.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});$.queue.writeBuffer(m,0,u);const g=$.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:o.buffer}}]}),b=$.createCommandEncoder(),v=b.beginComputePass();v.setPipeline(i),v.setBindGroup(0,g),v.dispatchWorkgroups(Math.ceil(t*n/256),1,1),v.end(),$.queue.submit([b.finish()]),m.destroy()},50);Y(Be(c),"ok");const l=await o.readback(),f=ze(a,t,n),d=ze(l,t,n),p=Ie?.querySelector("#image-display");if(p){p.innerHTML="";const m=document.createElement("div");m.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const g=document.createElement("div");g.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',g.appendChild(f);const b=document.createElement("div");b.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',b.appendChild(d),m.appendChild(g),m.appendChild(b),p.appendChild(m)}r.destroy(),o.destroy(),$.destroy(),Y("✓ Grayscale complete","ok")}async function ut(){Y("═══ CONVOLUTION KERNEL TEST ═══","info");const e=await ce();if(!e){Y("WebGPU unavailable","err");return}$=await le(e),fe($);const t=128,n=128,a=3,r=Gt(t,n),o={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},s=$.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=$.createComputePipeline({layout:$.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:$.createShaderModule({code:ar}),entryPoint:"main"}}),u=new ArrayBuffer(16),c=new Uint32Array(u);c[0]=t,c[1]=n,c[2]=a,c[3]=0;for(const[l,f]of Object.entries(o)){const d=k.fromData($,r,[t*n*4]),p=k.fromData($,f,[a*a]),m=new k($,[t*n*4]),g=await Se(`Conv ${l} ${t}×${n}`,async()=>{const x=$.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});$.queue.writeBuffer(x,0,u);const S=$.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:p.buffer}},{binding:2,resource:{buffer:d.buffer}},{binding:3,resource:{buffer:m.buffer}}]}),A=$.createCommandEncoder(),w=A.beginComputePass();w.setPipeline(i),w.setBindGroup(0,S),w.dispatchWorkgroups(Math.ceil(t/16),Math.ceil(n/16),1),w.end(),$.queue.submit([A.finish()]),x.destroy()},30);Y(Be(g),"ok");const b=await m.readback(),v=Ie?.querySelector("#image-display");if(v){const x=ze(b,t,n),S=document.createElement("div");S.style.cssText="display:inline-block;margin:4px",S.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${l}</div>`,S.appendChild(x),v.appendChild(S)}d.destroy(),p.destroy(),m.destroy()}$.destroy(),Y("✓ All convolution kernels applied","ok")}let Ie=null;function fr(e){Ie=e,e.innerHTML=`
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
  `,ie=e.querySelector("#image-log"),e.querySelector("#btn-grayscale").addEventListener("click",async()=>{ie.innerHTML="",e.querySelector("#image-display").innerHTML="",await it()}),e.querySelector("#btn-conv").addEventListener("click",async()=>{ie.innerHTML="",e.querySelector("#image-display").innerHTML="",await ut()}),e.querySelector("#btn-all-img").addEventListener("click",async()=>{ie.innerHTML="",e.querySelector("#image-display").innerHTML="",await it(),Y("",""),await ut(),Y("",""),Y("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const dr=Object.freeze(Object.defineProperty({__proto__:null,render:fr},Symbol.toStringTag,{value:"Module"}));let W=null,Me=null,Te=null;function Re(e,t=""){if(!Me)return;const n=document.createElement("div");n.className=`log-entry ${t}`,n.textContent=e,Me.appendChild(n),Me.scrollTop=Me.scrollHeight}const pr=`
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
`;let Le=0,ke=0;async function mr(e,t,n,a,r){const o=await ce();if(!o){Re("WebGPU unavailable","err");return}W=await le(o),fe(W);const[s,i]=a.value.split("x").map(Number);e.width=s,e.height=i,Le=parseInt(r.value);const u=W.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=W.createComputePipeline({layout:W.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:W.createShaderModule({code:pr}),entryPoint:"main"}}),l=W.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),f=e.getContext("2d"),d=W.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let p=performance.now(),m=0,g=0;t.textContent="RENDERING",t.className="badge badge-pass";function b(){const v=new ArrayBuffer(16),x=new Uint32Array(v);x[0]=s,x[1]=i,x[2]=ke,x[3]=Le,W.queue.writeBuffer(d,0,v);const S=W.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:l}}]}),A=W.createCommandEncoder(),w=A.beginComputePass();w.setPipeline(c),w.setBindGroup(0,S),w.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(i/16),1),w.end();const B=W.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});A.copyBufferToBuffer(l,0,B,0,s*i*4*4),W.queue.submit([A.finish()]),B.mapAsync(GPUMapMode.READ).then(()=>{const E=new Float32Array(B.getMappedRange().slice(0));B.unmap(),B.destroy();const C=f.createImageData(s,i);for(let N=0;N<s*i*4;N++)C.data[N]=Math.round(E[N]*255);f.putImageData(C,0,0),ke++,g++;const G=performance.now();G-p>=1e3&&(m=Math.round(g*1e3/(G-p)),n.textContent=`${m} FPS | Frame ${ke} | ${s}×${i}`,g=0,p=G),Te=requestAnimationFrame(b)})}b()}function ct(){Te!==null&&(cancelAnimationFrame(Te),Te=null),W&&(W.destroy(),W=null)}function gr(e){e.innerHTML=`
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
  `,Me=e.querySelector("#video-log");const t=e.querySelector("#video-canvas"),n=e.querySelector("#video-status"),a=e.querySelector("#video-fps"),r=e.querySelector("#res-select"),o=e.querySelector("#mode-select");e.querySelector("#btn-start").addEventListener("click",()=>{ct(),ke=0,Le=parseInt(o.value),Re(`Starting GPU compute video: ${r.value} mode=${o.value}`,"info"),mr(t,n,a,r,o)}),e.querySelector("#btn-stop").addEventListener("click",()=>{ct(),n.textContent="STOPPED",n.className="badge badge-info",Re("Rendering stopped","warn")})}const br=Object.freeze(Object.defineProperty({__proto__:null,render:gr},Symbol.toStringTag,{value:"Module"}));let ve=null;function U(e,t=""){if(!ve)return;const n=document.createElement("div");n.className=`log-entry ${t}`,n.textContent=e,ve.appendChild(n),ve.scrollTop=ve.scrollHeight}async function yr(){if(ve.innerHTML="",U("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),U(`Timestamp: ${new Date().toISOString()}`,""),!await vr())return;const t=await ce();if(!t){U("Cannot proceed: GPU not ready","err");return}U("",""),U("── MEMORY TEST ──","info");const n=await le(t);fe(n);const a=Math.floor(t.limits.maxBufferSize/1048576);U(`Attempting to allocate buffer at reported max: ${a} MB`,"");try{const r=n.createBuffer({size:t.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});U("Buffer allocation at max: SUCCESS","ok"),r.destroy()}catch(r){U(`Buffer allocation at max: FAILED — ${r.message}`,"warn");for(const o of[256,128,64,32])try{const s=n.createBuffer({size:o*1048576,usage:GPUBufferUsage.STORAGE});U(`Largest successful allocation: ${o} MB`,"ok"),s.destroy();break}catch{continue}}U("",""),U("── COMPUTE THROUGHPUT ──","info");for(const r of[64,128,256]){const o=k.fromData(n,new Float32Array(r*r).fill(1),[r,r]),s=k.fromData(n,new Float32Array(r*r).fill(1),[r,r]),i=new k(n,[r,r]),u=n.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=n.createComputePipeline({layout:n.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:n.createShaderModule({code:Ge}),entryPoint:"main"}}),l=await Se(`matmul ${r}×${r}`,async()=>{const f=n.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=new ArrayBuffer(12);new Uint32Array(d).set([r,r,r]),n.queue.writeBuffer(f,0,d);const p=n.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),m=n.createCommandEncoder(),g=m.beginComputePass();g.setPipeline(c),g.setBindGroup(0,p);const b=Math.ceil(r/16);g.dispatchWorkgroups(b,b,1),g.end(),n.queue.submit([m.finish()]),f.destroy()},30,2*r*r*r);U(Be(l),"ok"),o.destroy(),s.destroy(),i.destroy()}n.destroy(),U("",""),U("═══ DIAGNOSTICS COMPLETE ═══","info")}async function vr(){const e=await Ne();return Et(e),U("── WEBGPU STATUS ──","info"),U(`${e.statusLabel} (Case ${e.case})`,e.ready?"ok":"err"),U(`Reason: ${e.reason}`,""),U(`Recommendation: ${e.recommendation}`,""),U("",""),U("── ENVIRONMENT ──","info"),U(`  URL: ${e.environment.url}`,""),U(`  Secure Context: ${e.environment.isSecureContext}`,e.environment.isSecureContext?"ok":"err"),U(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`,""),U(`  OS: ${e.environment.osName} ${e.environment.osVersion}`,""),U(`  iOS: ${e.environment.isIOS}`,""),U(`  Safari: ${e.environment.isSafari}`,""),U(`  WebView: ${e.environment.isWebView}`,e.environment.isWebView?"err":""),U(`  navigator.gpu: ${e.gpu.navigatorGpuExists}`,e.gpu.navigatorGpuExists?"ok":"err"),e.gpu.adapterName&&(U(`  Adapter: ${e.gpu.adapterName}`,"ok"),U(`  Vendor: ${e.gpu.adapterVendor}`,"")),e.gpu.adapterError&&U(`  Adapter Error: ${e.gpu.adapterError}`,"err"),e.gpu.deviceError&&U(`  Device Error: ${e.gpu.deviceError}`,"err"),e.ready?!0:(U("",""),U("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function wr(e){e.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,ve=e.querySelector("#diag-log"),e.querySelector("#btn-diag").addEventListener("click",()=>{yr()})}const hr=Object.freeze(Object.defineProperty({__proto__:null,render:wr},Symbol.toStringTag,{value:"Module"}));class se{dims;ndim;size;strides;constructor(t){this.dims=typeof t=="number"?[t]:[...t],this.ndim=this.dims.length,this.size=this.dims.reduce((r,o)=>r*o,1);const n=new Array(this.ndim);let a=1;for(let r=this.ndim-1;r>=0;r--)n[r]=a,a*=this.dims[r];this.strides=n}equals(t){if(this.ndim!==t.ndim)return!1;for(let n=0;n<this.ndim;n++)if(this.dims[n]!==t.dims[n])return!1;return!0}isContiguous(){let t=1;for(let n=this.ndim-1;n>=0;n--){if(this.strides[n]!==t)return!1;t*=this.dims[n]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new se([1])}static from(...t){return new se(t)}}var ne=(e=>(e.Float32="f32",e.Float16="f16",e.Int32="i32",e.Int8="i8",e.Uint8="u8",e))(ne||{});const xr={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function Ot(e){return xr[e].bytes}let ee=null;async function Sr(){if(ee)return ee;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.limits,n=new Set(e.features),a=await e.requestDevice({requiredLimits:{}});return a.lost.then(r=>{console.error("WebGPU device lost:",r.message),ee=null}),ee={adapter:e,device:a,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:t.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:t.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:t.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:t.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:t.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:t.maxTextureArrayLayers},features:n},ee}function _(){if(!ee)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return ee}function Br(){ee&&(ee.device.destroy(),ee=null)}class we{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(t,n,a){this.shape=t,this.dtype=n,this.byteSize=t.size*Ot(n),this.gpuBuffer=a??_().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(t,n,a=ne.Float32){const r=_(),o=new we(t,a);return r.device.queue.writeBuffer(o.gpuBuffer,0,n.buffer,n.byteOffset,n.byteLength),o}async readback(){const t=_(),n=t.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),a=t.device.createCommandEncoder();a.copyBufferToBuffer(this.gpuBuffer,0,n,0,this.byteSize),t.device.queue.submit([a.finish()]),await n.mapAsync(GPUMapMode.READ);const r=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),r}destroy(){this.gpuBuffer.destroy()}}class M{shape;dtype;buffer;constructor(t,n=ne.Float32,a){this.shape=t,this.dtype=n,this.buffer=a??new we(t,n)}static fromFloat32(t,n){const a=t instanceof Float32Array?t:new Float32Array(t),r=new se(n);return new M(r,ne.Float32,we.fromData(r,a,ne.Float32))}static fromInt32(t,n){const a=t instanceof Int32Array?t:new Int32Array(t),r=new se(n);return new M(r,ne.Int32,we.fromData(r,a,ne.Int32))}static zeros(t,n=ne.Float32){const a=new se(t),r=a.size*Ot(n),s=_().device.createBuffer({size:r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(s.getMappedRange()).fill(0),s.unmap();const i=new we(a,n,s);return new M(a,n,i)}static ones(t,n=ne.Float32){const a=new se(t).size,r=new Float32Array(a).fill(1);return M.fromFloat32(r,t)}static randn(t){const n=new se(t).size,a=new Float32Array(n);for(let r=0;r<n;r++){const o=Math.random(),s=Math.random();a[r]=Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*s)}return M.fromFloat32(a,t)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class Ar{cache=new Map;getOrCreate(t,n,a){if(this.cache.has(t))return this.cache.get(t);const r=_(),o=r.device.createComputePipeline({layout:r.device.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:r.device.createShaderModule({code:n}),entryPoint:"main"}});return this.cache.set(t,o),o}get(t){return this.cache.get(t)}clear(){this.cache.clear()}}const Mr=`
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
`,Cr=`
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
`,Ur=`
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
`,Pr=`
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
`,$r=`
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
`,Er=`
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
`,Tr=`
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
`,kr=`
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
`,Gr=`
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
`,Or=`
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
`;function Nr(e,t,n,a,r){const o=new Float32Array(n*a);for(let s=0;s<n;s++)for(let i=0;i<a;i++){let u=0;for(let c=0;c<r;c++)u+=e[s*r+c]*t[c*a+i];o[s*a+i]=u}return o}function Dr(e,t){const n=new Float32Array(e.length);for(let a=0;a<e.length;a++)n[a]=e[a]+t[a];return n}function _r(e,t){const n=new Float32Array(e.length);for(let a=0;a<e.length;a++)n[a]=e[a]*t[a];return n}function Fr(e,t,n=1e-6){const a=e.length;let r=0;for(let i=0;i<a;i++)r+=e[i]*e[i];const o=Math.sqrt(r/a+n),s=new Float32Array(a);for(let i=0;i<a;i++)s[i]=e[i]/o*t[i];return s}function Wr(e,t,n,a=1e-6){const r=e.length;let o=0;for(let c=0;c<r;c++)o+=e[c];o/=r;let s=0;for(let c=0;c<r;c++){const l=e[c]-o;s+=l*l}s/=r;const i=1/Math.sqrt(s+a),u=new Float32Array(r);for(let c=0;c<r;c++)u[c]=(e[c]-o)*i*t[c]+n[c];return u}function zr(e,t,n){const a=new Float32Array(e.length);for(let r=0;r<t;r++){const o=r*n;let s=-1e30;for(let u=0;u<n;u++)e[o+u]>s&&(s=e[o+u]);let i=0;for(let u=0;u<n;u++)a[o+u]=Math.exp(e[o+u]-s),i+=a[o+u];for(let u=0;u<n;u++)a[o+u]/=i}return a}function Rr(e,t,n,a=1e4){const r=new Float32Array(e.length);r.set(e);for(let o=0;o<t*n/2;o++){const s=Math.floor(o/(n/2)),i=o%(n/2),u=1/Math.pow(a,i/n),c=s*u,l=Math.cos(c),f=Math.sin(c),d=o*2,p=o*2+1,m=r[d],g=r[p];r[d]=m*l-g*f,r[p]=m*f+g*l}return r}function Lr(e,t,n,a,r,o,s,i,u){const c=r-i+1,l=o-u+1,f=new Float32Array(n*s*c*l);for(let d=0;d<n;d++)for(let p=0;p<s;p++)for(let m=0;m<c;m++)for(let g=0;g<l;g++){let b=0;for(let v=0;v<a;v++)for(let x=0;x<i;x++)for(let S=0;S<u;S++)b+=e[((d*a+v)*r+m+x)*o+g+S]*t[((p*a+v)*i+x)*u+S];f[((d*s+p)*c+m)*l+g]=b}return f}function qr(e,t,n){const a=new Float32Array(t*n);for(let r=0;r<t;r++)for(let o=0;o<n;o++)a[o*t+r]=e[r*n+o];return a}function Ir(e,t,n,a,r,o){const s=new Float32Array(a*r*o);for(let i=0;i<r;i++)for(let u=0;u<a;u++){const c=u*t/a,l=i*n/r,f=Math.floor(c),d=Math.floor(l),p=Math.min(f+1,t-1),m=Math.min(d+1,n-1),g=c-f,b=l-d;for(let v=0;v<o;v++){const x=e[(d*t+f)*o+v],S=e[(d*t+p)*o+v],A=e[(m*t+f)*o+v],w=e[(m*t+p)*o+v];s[(i*a+u)*o+v]=x*(1-g)*(1-b)+S*g*(1-b)+A*(1-g)*b+w*g*b}}return s}const te=new Ar;function ae(e){return _().device.createBindGroupLayout({entries:Array.from({length:e},(n,a)=>({binding:a,visibility:GPUShaderStage.COMPUTE,buffer:a===0?{type:"uniform"}:{type:"storage"}}))})}function De(e){const t=_(),n=t.device.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.device.queue.writeBuffer(n,0,e),n}function ge(e,t,n,a,r,o){const s=_(),i=De(r),u=[{binding:0,resource:{buffer:i}},...a.map((f,d)=>({binding:d+1,resource:{buffer:f.buffer.gpuBuffer}}))],c=s.device.createBindGroup({layout:n,entries:u}),l=e.beginComputePass();return l.setPipeline(t),l.setBindGroup(0,c),l.dispatchWorkgroups(o),l.end(),i}async function be(e,t,n,a,r){const o=_(),s=M.zeros([n,a]),i=ae(4),u=te.getOrCreate("matmul",Mr,i),c=new ArrayBuffer(12),l=new Uint32Array(c);l[0]=n,l[1]=a,l[2]=r;const f=o.device.createCommandEncoder();return ge(f,u,i,[e,t,s],c,Math.ceil(n/16)*Math.ceil(a/16)),o.device.queue.submit([f.finish()]),s}function ye(e,t,n,a,r){return Nr(e,t,n,a,r)}async function lt(e,t){const n=_(),a=M.zeros([e.shape.size]),r=ae(4),o=te.getOrCreate("add",Cr,r),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=n.device.createCommandEncoder();return ge(i,o,r,[e,t,a],s,Math.ceil(e.shape.size/256)),n.device.queue.submit([i.finish()]),a}function ft(e,t){return Dr(e,t)}async function dt(e,t){const n=_(),a=M.zeros([e.shape.size]),r=ae(4),o=te.getOrCreate("multiply",Ur,r),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=n.device.createCommandEncoder();return ge(i,o,r,[e,t,a],s,Math.ceil(e.shape.size/256)),n.device.queue.submit([i.finish()]),a}function pt(e,t){return _r(e,t)}async function mt(e,t,n=1e-6){const a=_(),r=e.shape.size,o=M.zeros([r]),s=ae(4),i=te.getOrCreate("rms_norm",Pr,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=r,new Float32Array(u)[1]=n;const c=a.device.createCommandEncoder();return ge(c,i,s,[e,t,o],u,1),a.device.queue.submit([c.finish()]),o}function gt(e,t,n=1e-6){return Fr(e,t,n)}async function bt(e,t,n,a=1e-6){const r=_(),o=e.shape.size,s=M.zeros([o]),i=r.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=te.getOrCreate("layer_norm",$r,i),c=new ArrayBuffer(8);new Uint32Array(c)[0]=o,new Float32Array(c)[1]=a;const l=_(),f=De(c),d=l.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:e.buffer.gpuBuffer}},{binding:2,resource:{buffer:t.buffer.gpuBuffer}},{binding:3,resource:{buffer:n.buffer.gpuBuffer}},{binding:4,resource:{buffer:s.buffer.gpuBuffer}}]}),p=l.device.createCommandEncoder(),m=p.beginComputePass();return m.setPipeline(u),m.setBindGroup(0,d),m.dispatchWorkgroups(1),m.end(),l.device.queue.submit([p.finish()]),s}function yt(e,t,n,a=1e-6){return Wr(e,t,n,a)}async function vt(e,t,n){const a=_(),r=M.zeros([t,n]),o=a.device.createCommandEncoder();o.copyBufferToBuffer(e.buffer.gpuBuffer,0,r.buffer.gpuBuffer,0,t*n*4);const s=ae(2),i=te.getOrCreate("softmax",Er,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=t,new Uint32Array(u)[1]=n;const c=De(u),l=a.device.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:r.buffer.gpuBuffer}}]}),f=o.beginComputePass();return f.setPipeline(i),f.setBindGroup(0,l),f.dispatchWorkgroups(Math.ceil(t)),f.end(),a.device.queue.submit([o.finish()]),r}function wt(e,t,n){return zr(e,t,n)}async function ht(e,t,n,a=1e4){const r=_(),o=M.zeros([t,n]),s=r.device.createCommandEncoder();s.copyBufferToBuffer(e.buffer.gpuBuffer,0,o.buffer.gpuBuffer,0,t*n*4);const i=ae(2),u=te.getOrCreate("rope",Tr,i),c=new ArrayBuffer(12);new Uint32Array(c)[0]=t,new Uint32Array(c)[1]=n,new Float32Array(c)[2]=a;const l=De(c),f=r.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:o.buffer.gpuBuffer}}]}),d=s.beginComputePass();return d.setPipeline(u),d.setBindGroup(0,f),d.dispatchWorkgroups(Math.ceil(t*n/2/256)),d.end(),r.device.queue.submit([s.finish()]),o}function xt(e,t,n,a=1e4){return Rr(e,t,n,a)}async function St(e,t,n,a,r,o,s,i,u){const c=_(),l=r-i+1,f=o-u+1,d=M.zeros([n,s,l,f]),p=ae(4),m=te.getOrCreate("conv2d",kr,p),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=n,b[1]=a,b[2]=r,b[3]=o,b[4]=s,b[5]=i,b[6]=u,b[7]=l,b[8]=f;const v=c.device.createCommandEncoder();return ge(v,m,p,[e,t,d],g,n*s),c.device.queue.submit([v.finish()]),d}function Bt(e,t,n,a,r,o,s,i,u){return Lr(e,t,n,a,r,o,s,i,u)}async function At(e,t,n){const a=_(),r=M.zeros([n,t]),o=ae(3),s=te.getOrCreate("transpose_2d",Gr,o),i=new ArrayBuffer(8);new Uint32Array(i)[0]=t,new Uint32Array(i)[1]=n;const u=a.device.createCommandEncoder();return ge(u,s,o,[e,r],i,Math.ceil(t/16)*Math.ceil(n/16)),a.device.queue.submit([u.finish()]),r}function Mt(e,t,n){return qr(e,t,n)}async function Ct(e,t,n,a,r,o){const s=_(),i=M.zeros([r*a*o]),u=ae(3),c=te.getOrCreate("interpolate_bilinear",Or,u),l=new ArrayBuffer(20),f=new Uint32Array(l);f[0]=t,f[1]=n,f[2]=a,f[3]=r,f[4]=o;const d=s.device.createCommandEncoder();return ge(d,c,u,[e,i],l,Math.ceil(a/16)*Math.ceil(r/16)),s.device.queue.submit([d.finish()]),i}function Ut(e,t,n,a,r,o){return Ir(e,t,n,a,r,o)}let he=null,Oe=null;function V(e,t=""){if(!he)return;const n=document.createElement("div");n.className=`log-entry ${t}`,n.textContent=e,he.appendChild(n),he.scrollTop=he.scrollHeight}function I(e,t,n=.001){if(e.length!==t.length)return!1;for(let a=0;a<e.length;a++){const r=Math.abs(e[a]-t[a]),o=Math.max(Math.abs(e[a]),Math.abs(t[a]),1e-8);if(r/o>n)return!1}return!0}async function H(e,t,n=20){for(let r=0;r<3;r++)t();const a=[];for(let r=0;r<n;r++){const o=performance.now();t(),a.push(performance.now()-o)}return a.reduce((r,o)=>r+o,0)/a.length}async function j(e,t,n=20){const a=[];for(let r=0;r<Math.min(5,n);r++)await t();for(let r=0;r<n;r++){const o=performance.now();await t(),a.push(performance.now()-o)}return a.reduce((r,o)=>r+o,0)/a.length}function Hr(e){if(!Oe)return;const t=document.createElement("tr");t.innerHTML=`
    <td style="font-weight:600">${e.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${e.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${e.speedup>=1?"var(--green)":"var(--red)"}">
      ${e.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${e.correct?"badge-pass":"badge-fail"}">${e.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${e.tolerance.toExponential(1)}</td>
  `,Oe.appendChild(t)}async function jr(){he.innerHTML="",Oe.innerHTML="",V("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),V("Initializing WebGPU...","");let e;try{e=await Sr()}catch(a){V(`FATAL: ${a.message}`,"err"),V("WebGPU is not available. Cannot run GPU benchmarks.","err");return}V(`GPU: ${e.adapter.name??"Unknown"}`,"ok"),V(`Running benchmarks...
`,"");const t=[];{const s=M.randn([64,64]),i=M.randn([64,64]),u=await s.readback(),c=await i.readback(),l=await H("matmul 64",()=>ye(u,c,64,64,64)),f=await j("matmul 64",async()=>{(await be(s,i,64,64,64)).destroy()}),d=await(await be(s,i,64,64,64)).readback(),p=ye(u,c,64,64,64),m=I(p,d),g=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-d[v])));t.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:l,gpuMs:f,speedup:l/f,correct:m,tolerance:g}),s.destroy(),i.destroy()}{const s=M.randn([256,256]),i=M.randn([256,256]),u=await s.readback(),c=await i.readback(),l=await H("matmul 256",()=>ye(u,c,256,256,256),10),f=await j("matmul 256",async()=>{(await be(s,i,256,256,256)).destroy()}),d=await(await be(s,i,256,256,256)).readback(),p=ye(u,c,256,256,256),m=I(p,d),g=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-d[v])));t.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:l,gpuMs:f,speedup:l/f,correct:m,tolerance:g}),s.destroy(),i.destroy()}{const s=M.randn([512,512]),i=M.randn([512,512]),u=await s.readback(),c=await i.readback(),l=await H("matmul 512",()=>ye(u,c,512,512,512),5),f=await j("matmul 512",async()=>{(await be(s,i,512,512,512)).destroy()}),d=await(await be(s,i,512,512,512)).readback(),p=ye(u,c,512,512,512),m=I(p,d),g=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-d[v])));t.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:l,gpuMs:f,speedup:l/f,correct:m,tolerance:g}),s.destroy(),i.destroy()}{const r=M.randn([1e6]),o=M.randn([1e6]),s=await r.readback(),i=await o.readback(),u=await H("add 1M",()=>ft(s,i)),c=await j("add 1M",async()=>{(await lt(r,o)).destroy()}),l=await(await lt(r,o)).readback(),f=ft(s,i),d=I(f,l),p=Math.max(...Array.from(f).map((m,g)=>Math.abs(m-l[g])));t.push({name:"Add",shape:"[1000000]",cpuMs:u,gpuMs:c,speedup:u/c,correct:d,tolerance:p}),r.destroy(),o.destroy()}{const r=M.randn([1e6]),o=M.randn([1e6]),s=await r.readback(),i=await o.readback(),u=await H("mul 1M",()=>pt(s,i)),c=await j("mul 1M",async()=>{(await dt(r,o)).destroy()}),l=await(await dt(r,o)).readback(),f=pt(s,i),d=I(f,l),p=Math.max(...Array.from(f).map((m,g)=>Math.abs(m-l[g])));t.push({name:"Multiply",shape:"[1000000]",cpuMs:u,gpuMs:c,speedup:u/c,correct:d,tolerance:p}),r.destroy(),o.destroy()}{const r=M.randn([1024]),o=M.ones([1024]),s=await r.readback(),i=await o.readback(),u=await H("rmsnorm",()=>gt(s,i)),c=await j("rmsnorm",async()=>{(await mt(r,o)).destroy()}),l=await(await mt(r,o)).readback(),f=gt(s,i),d=I(f,l),p=Math.max(...Array.from(f).map((m,g)=>Math.abs(m-l[g])));t.push({name:"RMSNorm",shape:"[1024]",cpuMs:u,gpuMs:c,speedup:u/c,correct:d,tolerance:p}),r.destroy(),o.destroy()}{const r=M.randn([1024]),o=M.ones([1024]),s=M.zeros([1024]),i=await r.readback(),u=await o.readback(),c=await s.readback(),l=await H("layernorm",()=>yt(i,u,c)),f=await j("layernorm",async()=>{(await bt(r,o,s)).destroy()}),d=await(await bt(r,o,s)).readback(),p=yt(i,u,c),m=I(p,d),g=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-d[v])));t.push({name:"LayerNorm",shape:"[1024]",cpuMs:l,gpuMs:f,speedup:l/f,correct:m,tolerance:g}),r.destroy(),o.destroy(),s.destroy()}{const o=M.randn([32,128]),s=await o.readback(),i=await H("softmax",()=>wt(new Float32Array(s),32,128)),u=await j("softmax",async()=>{(await vt(M.fromFloat32(new Float32Array(s),[32,128]),32,128)).destroy()}),c=await(await vt(M.fromFloat32(new Float32Array(s),[32,128]),32,128)).readback(),l=wt(new Float32Array(s),32,128),f=I(l,c),d=Math.max(...Array.from(l).map((p,m)=>Math.abs(p-c[m])));t.push({name:"Softmax",shape:"[32, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:f,tolerance:d}),o.destroy()}{const o=M.randn([16,128]),s=await o.readback(),i=await H("rope",()=>xt(new Float32Array(s),16,128)),u=await j("rope",async()=>{(await ht(M.fromFloat32(new Float32Array(s),[16,128]),16,128)).destroy()}),c=await(await ht(M.fromFloat32(new Float32Array(s),[16,128]),16,128)).readback(),l=xt(new Float32Array(s),16,128),f=I(l,c),d=Math.max(...Array.from(l).map((p,m)=>Math.abs(p-c[m])));t.push({name:"RoPE",shape:"[16, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:f,tolerance:d}),o.destroy()}{const l=M.randn([1,3,16,16]),f=M.randn([4,3,3,3]),d=await l.readback(),p=await f.readback(),m=await H("conv2d",()=>Bt(d,p,1,3,16,16,4,3,3)),g=await j("conv2d",async()=>{(await St(l,f,1,3,16,16,4,3,3)).destroy()}),b=await(await St(l,f,1,3,16,16,4,3,3)).readback(),v=Bt(d,p,1,3,16,16,4,3,3),x=I(v,b),S=Math.max(...Array.from(v).map((A,w)=>Math.abs(A-b[w])));t.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:m,gpuMs:g,speedup:m/g,correct:x,tolerance:S}),l.destroy(),f.destroy()}{const o=M.randn([256,256]),s=await o.readback(),i=await H("transpose",()=>Mt(s,256,256)),u=await j("transpose",async()=>{(await At(o,256,256)).destroy()}),c=await(await At(o,256,256)).readback(),l=Mt(s,256,256),f=I(l,c),d=Math.max(...Array.from(l).map((p,m)=>Math.abs(p-c[m])));t.push({name:"Transpose",shape:"[256, 256]",cpuMs:i,gpuMs:u,speedup:i/u,correct:f,tolerance:d}),o.destroy()}{const u=M.randn([3072]),c=await u.readback(),l=await H("interp",()=>Ut(c,32,32,64,64,3)),f=await j("interp",async()=>{(await Ct(u,32,32,64,64,3)).destroy()}),d=await(await Ct(u,32,32,64,64,3)).readback(),p=Ut(c,32,32,64,64,3),m=I(p,d),g=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-d[v])));t.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:l,gpuMs:f,speedup:l/f,correct:m,tolerance:g}),u.destroy()}V("",""),V("═══ RESULTS ═══","info");for(const a of t){Hr(a);const r=a.correct?"✓":"✗",o=a.correct?"ok":"err";V(`${r} ${a.name} (${a.shape}): CPU ${a.cpuMs.toFixed(2)} ms | GPU ${a.gpuMs.toFixed(2)} ms | ${a.speedup.toFixed(1)}× | max diff ${a.tolerance.toExponential(1)}`,o)}const n=t.filter(a=>a.correct).length;V("",""),V(`═══ ${n}/${t.length} CORRECT ═══`,n===t.length?"ok":"err"),Br()}function Kr(e){e.innerHTML=`
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
  `,he=e.querySelector("#bench-log"),Oe=e.querySelector("#bench-tbody"),e.querySelector("#btn-run-bench").addEventListener("click",()=>{jr()})}const Vr=Object.freeze(Object.defineProperty({__proto__:null,render:Kr},Symbol.toStringTag,{value:"Module"}));let oe=null,$e="";function Yr(e){const t=e.environment,n=e.gpu,a=e.case==="D"?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)";let r=`
    <div style="text-align:center;margin:20px 0">
      <div style="font-size:28px;font-weight:800;color:${a};letter-spacing:1px">${e.statusLabel}</div>
      <div style="font-size:14px;color:var(--text-dim);margin-top:8px">Case ${e.case}</div>
    </div>

    <div class="card" style="border-color:${a}">
      <div class="card-title" style="margin-bottom:8px">Diagnosis</div>
      <p style="font-size:13px;color:var(--text);line-height:1.6">${e.reason}</p>
      <p style="font-size:13px;color:var(--text);margin-top:10px;font-weight:600;line-height:1.6">${e.recommendation}</p>
    </div>
  `;if(r+=`
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
  `,r+=`
    <h3>WebGPU API</h3>
    <div class="card">
      <div class="row"><span class="row-label">navigator.gpu</span><span class="row-value" style="color:${n.navigatorGpuExists?"var(--green)":"var(--red)"}">${n.navigatorGpuExists?"Exists ✓":"Undefined ✗"}</span></div>
  `,n.adapterName&&(r+=`
      <div class="row"><span class="row-label">Adapter</span><span class="row-value">${n.adapterName}</span></div>
      <div class="row"><span class="row-label">Vendor</span><span class="row-value">${n.adapterVendor||"Unknown"}</span></div>
      <div class="row"><span class="row-label">Device</span><span class="row-value">${n.adapterDevice||"Unknown"}</span></div>
      <div class="row"><span class="row-label">Fallback</span><span class="row-value">${n.isFallbackAdapter?"Yes (software)":"No (hardware)"}</span></div>
    `),n.adapterError&&(r+=`<div class="row"><span class="row-label">Adapter Error</span><span class="row-value" style="color:var(--red)">${n.adapterError}</span></div>`),n.deviceError&&(r+=`<div class="row"><span class="row-label">Device Error</span><span class="row-value" style="color:var(--red)">${n.deviceError}</span></div>`),r+="</div>",n.limits){const o=n.limits,s=i=>i>=1073741824?`${(i/1073741824).toFixed(1)} GB`:i>=1048576?`${(i/1048576).toFixed(1)} MB`:i>=1024?`${(i/1024).toFixed(1)} KB`:`${i} B`;r+=`
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
    `}return n.features.length>0&&(r+=`
      <h3>Features (${n.features.length})</h3>
      <div class="card">
        ${n.features.map(o=>`<div class="row"><span class="row-value">${o}</span></div>`).join("")}
      </div>
    `),r+=`
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
  `,r}function Xr(e){e.innerHTML=`
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;const t=e.querySelector("#wgdiag-result");oe=e.querySelector("#btn-copy-report"),e.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{t.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',oe.disabled=!0;const n=await Ne();$e=Et(n),t.innerHTML=Yr(n),oe.disabled=!1}),oe.addEventListener("click",async()=>{if($e)try{await navigator.clipboard.writeText($e),oe.textContent="Copied!",setTimeout(()=>{oe.textContent="Copy Diagnostics"},2e3)}catch{const n=document.createElement("textarea");n.value=$e,document.body.appendChild(n),n.select(),document.execCommand("copy"),document.body.removeChild(n),oe.textContent="Copied!",setTimeout(()=>{oe.textContent="Copy Diagnostics"},2e3)}}),e.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const Qr=Object.freeze(Object.defineProperty({__proto__:null,render:Xr},Symbol.toStringTag,{value:"Module"}));let Ce=null,pe=null;async function xe(){if(pe&&!Ce&&(pe=null),pe)return pe;if(!navigator.gpu)throw new Error("WebGPU not supported");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.features.has("timestamp-query"),n=await e.requestDevice({requiredFeatures:t?["timestamp-query"]:[],requiredLimits:{}});n.lost.then(s=>{console.error("Benchmark device lost:",s.message),Ce=null,pe=null}),Ce=n;let a=null;try{a=navigator.gpu.getPreferredCanvasFormat()}catch{}const r=e.limits,o=[];for(const s of e.features)o.push(s);return pe={webgpuAvailable:!0,adapterName:e.name??"Unknown",adapterVendor:e.vendor??"Unknown",adapterDevice:e.device??"Unknown",adapterFeatures:o,adapterLimits:{maxBufferSize:r.maxBufferSize,maxTextureDimension1D:r.maxTextureDimension1D,maxTextureDimension2D:r.maxTextureDimension2D,maxTextureDimension3D:r.maxTextureDimension3D,maxComputeWorkgroupStorageSize:r.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:r.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:r.maxStorageBufferBindingSize,maxUniformBufferBindingSize:r.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:r.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:r.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:r.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:r.maxComputeWorkgroupsPerDimension,maxColorAttachments:r.maxColorAttachments,minStorageBufferOffsetAlignment:r.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:r.minUniformBufferOffsetAlignment},preferredCanvasFormat:a,maxBufferSize:r.maxBufferSize,maxStorageBufferBindingSize:r.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:r.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:r.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:r.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:r.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:r.maxComputeWorkgroupsPerDimension,timestampQuerySupport:t,isFallbackAdapter:e.isFallbackAdapter??!1},pe}function O(){if(!Ce)throw new Error("Benchmark not initialized. Call initBenchmark() first.");return Ce}function L(e){const t=O(),n=t.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(n,0,e),n}function P(e,t){const n=O(),a=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(t){const r=n.createBuffer({size:Math.max(e,t.byteLength),usage:a,mappedAtCreation:!0});return new Float32Array(r.getMappedRange()).set(t),r.unmap(),r}return n.createBuffer({size:e,usage:a})}function Zr(e){return O().createBuffer({size:e,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})}async function Nt(e,t){const n=O(),a=Zr(t),r=n.createCommandEncoder();r.copyBufferToBuffer(e,0,a,0,t),n.queue.submit([r.finish()]),await a.mapAsync(GPUMapMode.READ);const o=new Float32Array(a.getMappedRange().slice(0));return a.unmap(),a.destroy(),o}function q(e,t){const n=O(),a=n.createBindGroupLayout({entries:Array.from({length:t},(r,o)=>({binding:o,visibility:GPUShaderStage.COMPUTE,buffer:o===0?{type:"uniform"}:{type:"storage"}}))});return n.createComputePipeline({layout:n.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:n.createShaderModule({code:e}),entryPoint:"main"}})}async function Jr(e,t=50,n=5){const a=O();for(let i=0;i<Math.min(n,3);i++)e();const r=[];for(let i=0;i<t;i++){const u=performance.now();e();try{await a.queue.onSubmittedWorkDone()}catch{await new Promise(l=>setTimeout(l,50))}const c=performance.now();r.push(c-u)}r.sort((i,u)=>i-u);const o=r.reduce((i,u)=>i+u,0)/r.length,s=r[Math.floor(r.length/2)];return{avgMs:o,minMs:r[0],maxMs:r[r.length-1],p50Ms:s,iterations:t}}function R(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}const Dt=`
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
`,He=`
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
`,_t=`
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
`,Wt=`
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
`,zt=`
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
`;function en(e,t){try{return e.pushErrorScope(t),!0}catch{return!1}}async function Pt(e,t){let n=null;for(let a=0;a<t;a++)try{const r=await e.popErrorScope();r&&!n&&(n=r)}catch{}return n}function tn(e,t){let n;const a=new Promise((r,o)=>{n=window.setTimeout(()=>o(new Error(`GPU operation timed out after ${t}ms`)),t)});return Promise.race([e,a]).finally(()=>{n!==void 0&&window.clearTimeout(n)})}async function Z(e){const t=O(),n=["validation","out-of-memory","internal"];let a=0;for(const r of n)en(t,r)&&a++;try{const r=t.createBuffer({size:e.outputBytes,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),o=t.createCommandEncoder(),s=o.beginComputePass();s.setPipeline(e.pipeline),s.setBindGroup(0,e.bindGroup),s.dispatchWorkgroups(...e.workgroups),s.end(),o.copyBufferToBuffer(e.outputBuffer,0,r,0,e.outputBytes),t.queue.submit([o.finish()]),await tn(r.mapAsync(GPUMapMode.READ),15e3);const i=new Float32Array(r.getMappedRange().slice(0));r.unmap(),r.destroy();const u=await Pt(t,a);if(u)return{pass:!1,error:`GPU Error: ${u.message}`};const c=e.validator(i);return{pass:c.pass,error:c.pass?null:c.error}}catch(r){return await Pt(t,a),{pass:!1,error:r.message}}}async function Rt(){const e=O(),t=[],n=q(Dt,4),a=[64,1024,65536];for(const r of a){const o=r*4,s=new Float32Array(r).fill(1),i=new Float32Array(r).fill(2),u=P(o,s),c=P(o,i),l=P(o),f=new ArrayBuffer(4);new Uint32Array(f)[0]=r;const d=L(f),p=e.createBindGroup({layout:n.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:l}}]}),m=await Z({name:"Vector Addition",pipeline:n,bindGroup:p,workgroups:[Math.ceil(r/64),1,1],outputBuffer:l,outputBytes:o,validator:g=>{const b=g.every(v=>Math.abs(v-3)<1e-5);return{pass:b,error:b?"":"Incorrect values"}}});t.push({id:`vecadd_${r}`,name:"Vector Addition",inputSize:`${r} elements (${R(o)})`,executionTimeMs:0,throughput:"N/A",memoryBytes:o*3,success:m.pass,error:m.error||void 0,gpuTimingAvailable:!1}),u.destroy(),c.destroy(),l.destroy(),d.destroy()}return t}const rn=[128,256,512];function nn(e,t,n,a,r){const o=new Float32Array(n*a);for(let s=0;s<n;s++)for(let i=0;i<a;i++){let u=0;for(let c=0;c<r;c++)u+=e[s*r+c]*t[c*a+i];o[s*a+i]=u}return o}async function Lt(){const e=O(),t=[],n=q(He,4),a=n.getBindGroupLayout(0);for(const r of rn)try{const o=r,s=r,u=(o*s+s*r+o*r)*4,c=new Float32Array(o*s).fill(1),l=new Float32Array(s*r).fill(.5),f=P(o*s*4,c),d=P(s*r*4,l),p=P(o*r*4),m=new ArrayBuffer(12),g=new Uint32Array(m);g[0]=o,g[1]=r,g[2]=s;const b=L(m),v=e.createBindGroup({layout:a,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:d}},{binding:3,resource:{buffer:p}}]}),x=Math.ceil(o/16),S=Math.ceil(r/16),A=await Jr(()=>{const C=e.createCommandEncoder(),G=C.beginComputePass();G.setPipeline(n),G.setBindGroup(0,v),G.dispatchWorkgroups(x,S),G.end(),e.queue.submit([C.finish()])},r<=256?50:20);let w=!0;if(r<=256){const C=await Nt(p,o*r*4),G=nn(c,l,o,r,s);for(let N=0;N<o*r;N++)if(Math.abs(C[N]-G[N])>.001){w=!1;break}}const B=2*o*r*s,E=B/(A.avgMs/1e3)/1e9;t.push({id:`matmul_${r}`,name:"Matrix Multiplication",inputSize:`${r}×${r}`,executionTimeMs:A.avgMs,throughput:`${E.toFixed(2)} GFLOPS`,memoryBytes:u,success:w,gpuTimingAvailable:!0,details:{M:o,N:r,K:s,flops:B,gflops:E,iterations:A.iterations,minMs:A.minMs,maxMs:A.maxMs,p50Ms:A.p50Ms,correctness:r<=256?w?"PASS":"FAIL":"NOT_TESTED (>256)"}}),f.destroy(),d.destroy(),p.destroy(),b.destroy()}catch(o){t.push({id:`matmul_${r}`,name:"Matrix Multiplication",inputSize:`${r}×${r}`,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:o.message,gpuTimingAvailable:!1})}return t}async function an(){const e=O(),t=[],n=q(_t,4),a=1,r=1,o=5,s=5,i=1,u=3,c=3,l=o-u+1,f=s-c+1,d=a*r*o*s,p=i*r*u*c,m=a*i*l*f,g=new Float32Array(d).fill(1),b=new Float32Array(p).fill(1),v=P(d*4,g),x=P(p*4,b),S=P(m*4),A=new ArrayBuffer(36),w=new Uint32Array(A);w[0]=a,w[1]=r,w[2]=o,w[3]=s,w[4]=i,w[5]=u,w[6]=c,w[7]=l,w[8]=f;const B=L(A),E=e.createBindGroup({layout:n.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:B}},{binding:1,resource:{buffer:v}},{binding:2,resource:{buffer:x}},{binding:3,resource:{buffer:S}}]}),C=await Z({name:"Conv2D",pipeline:n,bindGroup:E,workgroups:[a,i,l*f],outputBuffer:S,outputBytes:m*4,validator:G=>{const re=G.every(de=>Math.abs(de-9)<1e-4);return{pass:re,error:re?"":`Expected 9, got ${G[0]}`}}});return t.push({id:`conv2d_${a}x${r}x${o}x${s}`,name:"Conv2D",inputSize:`${a}x${r}x${o}x${s} k=${u}`,executionTimeMs:0,throughput:"N/A",memoryBytes:(d+p+m)*4,success:C.pass,error:C.error||void 0,gpuTimingAvailable:!1}),v.destroy(),x.destroy(),S.destroy(),B.destroy(),t}async function qt(){const e=O(),t=[],n=q(Ft,3),a=[{rows:1,cols:64},{rows:4,cols:64}];for(const r of a){const o=r.rows*r.cols,s=o*4,i=new Float32Array(o).map((m,g)=>g%r.cols*.1),u=P(s,i),c=P(s),l=new ArrayBuffer(8);new Uint32Array(l)[0]=r.rows,new Uint32Array(l)[1]=r.cols;const f=L(l),d=e.createBindGroup({layout:n.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:c}}]}),p=await Z({name:"Softmax",pipeline:n,bindGroup:d,workgroups:[r.rows,1,1],outputBuffer:c,outputBytes:s,validator:m=>{let g=!0;for(let b=0;b<r.rows;b++){const v=b*r.cols;let x=0;for(let S=0;S<r.cols;S++)x+=m[v+S];if(Math.abs(x-1)>1e-4){g=!1;break}}return{pass:g,error:g?"":"Softmax rows do not sum to 1"}}});t.push({id:`softmax_${r.rows}x${r.cols}`,name:"Softmax",inputSize:`${r.rows}x${r.cols}`,executionTimeMs:0,throughput:"N/A",memoryBytes:s,success:p.pass,error:p.error||void 0,gpuTimingAvailable:!1}),u.destroy(),c.destroy(),f.destroy()}return t}async function It(){const e=O(),t=[],n=q(Wt,4),a=[8,128,512];for(const r of a){const o=r*4,s=new Float32Array(r).fill(.5),i=new Float32Array(r).fill(1),u=P(o,s),c=P(o,i),l=P(o),f=new ArrayBuffer(8);new Uint32Array(f)[0]=r,new Float32Array(f)[1]=1e-6;const d=L(f),p=e.createBindGroup({layout:n.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:l}}]}),m=await Z({name:"RMSNorm",pipeline:n,bindGroup:p,workgroups:[1,1,1],outputBuffer:l,outputBytes:o,validator:g=>{const b=s.reduce((A,w)=>A+w*w,0),v=Math.sqrt(b/r+1e-6),x=s.map(A=>A/v),S=g.every((A,w)=>Math.abs(A-x[w])<1e-4);return{pass:S,error:S?"":`Incorrect values: got ${g[0]} expected ${x[0]}`}}});t.push({id:`rmsnorm_${r}`,name:"RMSNorm",inputSize:`${r} elements (${R(o)})`,executionTimeMs:0,throughput:"N/A",memoryBytes:o*3,success:m.pass,error:m.error||void 0,gpuTimingAvailable:!1}),u.destroy(),c.destroy(),l.destroy(),d.destroy()}return t}async function on(){const e=O(),t=[],n=q(zt,6),a=1,r=4,o=4,s=1/Math.sqrt(o),i=a*r*o,u=a*r*r,c=new Float32Array(i).map((E,C)=>(C%o+1)*.1),l=new Float32Array(i).map((E,C)=>(C%o+1)*.1),f=new Float32Array(i).map((E,C)=>(C%o+1)*.1),d=P(i*4,c),p=P(i*4,l),m=P(i*4,f),g=P(i*4),b=P(u*4),v=new ArrayBuffer(16),x=new Uint32Array(v),S=new Float32Array(v);x[0]=a,x[1]=r,x[2]=o,S[3]=s;const A=L(v),w=e.createBindGroup({layout:n.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:A}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:m}},{binding:4,resource:{buffer:g}},{binding:5,resource:{buffer:b}}]}),B=await Z({name:"Attention",pipeline:n,bindGroup:w,workgroups:[a,1,1],outputBuffer:g,outputBytes:i*4,validator:E=>{const C=E.every(G=>isFinite(G));return{pass:C,error:C?"":"Non-finite output"}}});return t.push({id:`attention_${a}x${r}x${o}`,name:"Attention",inputSize:`batch=${a} seq=${r} dim=${o}`,executionTimeMs:0,throughput:"N/A",memoryBytes:(i*3+i+u)*4,success:B.pass,error:B.error||void 0,gpuTimingAvailable:!1}),d.destroy(),p.destroy(),m.destroy(),g.destroy(),b.destroy(),A.destroy(),t}async function sn(e){const t=O(),n=[],a=e.maxBufferSize;{let r=0,o=Math.min(a,256*1024*1024);try{for(;o<=a;){const s=t.createBuffer({size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});if(r=o,s.destroy(),o>=a)break;o=Math.min(o*2,a)}}catch{}n.push({id:"mem_max_buffer",name:"Max Buffer Size",inputSize:`limit=${R(a)}`,executionTimeMs:0,throughput:`accepted=${R(r)}`,memoryBytes:r,success:r>0,gpuTimingAvailable:!1,details:{maxBufferSizeLimit:a,maxBufferAccepted:r,match:r===a?"EXACT":"PARTIAL"}})}{const r=[1048576,16777216,67108864,134217728].filter(o=>o<=a);for(const o of r)try{const i=[];for(let c=0;c<20;c++){const l=performance.now(),f=t.createBuffer({size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});i.push(performance.now()-l),f.destroy()}const u=i.reduce((c,l)=>c+l,0)/i.length;n.push({id:`mem_alloc_${o}`,name:"Allocation Time",inputSize:R(o),executionTimeMs:u,throughput:`${(o/(u/1e3)/1048576).toFixed(1)} MB/s`,memoryBytes:o,success:!0,gpuTimingAvailable:!1,details:{avgMs:u,iterations:20}})}catch(s){n.push({id:`mem_alloc_${o}`,name:"Allocation Time",inputSize:R(o),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}{const r=[1048576,16777216,67108864].filter(o=>o<=a);for(const o of r)try{const s=o/4,i=new Float32Array(s).fill(3.14),u=Ee(o),c=20,l=[];for(let d=0;d<c;d++){const p=performance.now();t.queue.writeBuffer(u,0,i.buffer),await t.queue.onSubmittedWorkDone(),l.push(performance.now()-p)}const f=l.reduce((d,p)=>d+p,0)/l.length;n.push({id:`mem_upload_${o}`,name:"Upload Time",inputSize:R(o),executionTimeMs:f,throughput:`${(o/(f/1e3)/1048576).toFixed(1)} MB/s`,memoryBytes:o,success:!0,gpuTimingAvailable:!1,details:{avgMs:f,iterations:c,method:"queue.writeBuffer"}}),u.destroy()}catch(s){n.push({id:`mem_upload_${o}`,name:"Upload Time",inputSize:R(o),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}{const r=[1048576,16777216,67108864].filter(o=>o<=a);for(const o of r)try{const s=Ee(o),i=10,u=[];for(let l=0;l<i;l++){const f=performance.now();await Nt(s,o),u.push(performance.now()-f)}const c=u.reduce((l,f)=>l+f,0)/u.length;n.push({id:`mem_readback_${o}`,name:"Readback Time",inputSize:R(o),executionTimeMs:c,throughput:`${(o/(c/1e3)/1048576).toFixed(1)} MB/s`,memoryBytes:o,success:!0,gpuTimingAvailable:!1,details:{avgMs:c,iterations:i,method:"copyBufferToBuffer + mapAsync"}}),s.destroy()}catch(s){n.push({id:`mem_readback_${o}`,name:"Readback Time",inputSize:R(o),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}{const r=Math.min(16777216,a);try{const s=Ee(r),i=new Float32Array(r/4).fill(1),u=[];for(let d=0;d<50;d++){const p=performance.now();t.queue.writeBuffer(s,0,i.buffer),u.push(performance.now()-p)}const c=[];for(let d=0;d<50;d++){const p=performance.now(),m=t.createBuffer({size:r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(m,0,i.buffer),m.destroy(),c.push(performance.now()-p)}const l=u.reduce((d,p)=>d+p,0)/u.length,f=c.reduce((d,p)=>d+p,0)/c.length;n.push({id:"mem_reuse_vs_realloc",name:"Buffer Reuse vs Re-alloc",inputSize:R(r),executionTimeMs:l,throughput:`reuse=${l.toFixed(3)}ms re-alloc=${f.toFixed(3)}ms`,memoryBytes:r,success:!0,gpuTimingAvailable:!1,details:{reuseAvgMs:l,reallocAvgMs:f,speedup:(f/l).toFixed(1)+"x",iterations:50}}),s.destroy()}catch(o){n.push({id:"mem_reuse_vs_realloc",name:"Buffer Reuse vs Re-alloc",inputSize:R(r),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:o.message,gpuTimingAvailable:!1})}}{let r=0;const o=[64*1024*1024,128*1024*1024,256*1024*1024].filter(s=>s<=a);for(const s of o)try{const i=Ee(s),u=new Float32Array(Math.min(s/4,1024)).fill(42);t.queue.writeBuffer(i,0,u.buffer),await t.queue.onSubmittedWorkDone(),r=s,i.destroy()}catch{break}n.push({id:"mem_useful_working_set",name:"Useful Working Set",inputSize:`tested up to ${R(a)}`,executionTimeMs:0,throughput:`confirmed=${R(r)}`,memoryBytes:r,success:r>0,gpuTimingAvailable:!1,details:{maxBufferSize:a,usefulWorkingSet:r}})}return n}function Ee(e,t){const n=O(),a=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;return n.createBuffer({size:e,usage:a})}const Fe=[30,60,180];async function un(e){const t=O(),n=[],a=256,r=a,o=a,s=2*r*a*o,i=q(He,4),u=i.getBindGroupLayout(0),c=new Float32Array(r*o).fill(1),l=new Float32Array(o*a).fill(.5),f=P(r*o*4,c),d=P(o*a*4,l),p=P(r*a*4),m=new ArrayBuffer(12),g=new Uint32Array(m);g[0]=r,g[1]=a,g[2]=o;const b=L(m),v=t.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:d}},{binding:3,resource:{buffer:p}}]}),x=Math.ceil(r/16),S=Math.ceil(a/16);function A(){const w=t.createCommandEncoder(),B=w.beginComputePass();B.setPipeline(i),B.setBindGroup(0,v),B.dispatchWorkgroups(x,S),B.end(),t.queue.submit([w.finish()])}for(const w of Fe)try{e?.(0,`Starting ${w}s sustained test...`);const B=[],E=performance.now();let C=E,G=0;for(let D=0;D<5;D++)A(),await t.queue.onSubmittedWorkDone();for(;;){const D=(performance.now()-E)/1e3;if(D>=w)break;const J=performance.now();let _e=0;for(;!(performance.now()-J>=1e3);)A(),await t.queue.onSubmittedWorkDone(),_e++;const at=(performance.now()-J)/1e3,Kt=at/_e*1e3,ot=s*_e/(at*1e9);B.push({second:G,avgMs:Kt,gflops:ot}),G++;const Vt=Math.min(D/w*100,100);e?.(Vt,`${w}s test: ${Math.floor(D)}s / ${w}s — ${ot.toFixed(1)} GFLOPS`)}const N=B.slice(0,10),re=B.slice(-10),de=N.reduce((D,J)=>D+J.gflops,0)/N.length,Ae=re.reduce((D,J)=>D+J.gflops,0)/re.length,Ue=Ae<de*.85,F=B.reduce((D,J)=>D+J.gflops,0)/B.length;n.push({id:`sustained_${w}s`,name:`Sustained Load ${w}s`,inputSize:`${a}×${a} matmul`,executionTimeMs:B.reduce((D,J)=>D+J.avgMs,0)/B.length,throughput:`${F.toFixed(1)} GFLOPS avg`,memoryBytes:(r*o+o*a+r*a)*4,success:!0,gpuTimingAvailable:!0,samples:B,thermalThrottling:Ue,avgGflops:F,durationSeconds:w,details:{duration:w,totalSamples:B.length,avgGflops:F,minGflops:Math.min(...B.map(D=>D.gflops)),maxGflops:Math.max(...B.map(D=>D.gflops)),first10sAvg:de,last10sAvg:Ae,throttled:Ue?"YES":"NO",dropPct:((1-Ae/de)*100).toFixed(1)+"%"}}),e?.(100,`${w}s test complete — ${F.toFixed(1)} GFLOPS avg`),w!==Fe[Fe.length-1]&&(e?.(-1,"Cooling down 10s before next test..."),await new Promise(D=>setTimeout(D,1e4)))}catch(B){n.push({id:`sustained_${w}s`,name:`Sustained Load ${w}s`,inputSize:`${a}×${a} matmul`,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:B.message,gpuTimingAvailable:!1,samples:[],thermalThrottling:!1,avgGflops:0,durationSeconds:w})}return f.destroy(),d.destroy(),p.destroy(),b.destroy(),n}function cn(e,t,n,a,r){const o=new Float32Array(n*a);for(let s=0;s<n;s++)for(let i=0;i<a;i++){let u=0;for(let c=0;c<r;c++)u+=e[s*r+c]*t[c*a+i];o[s*a+i]=u}return o}function ln(e,t,n,a,r,o,s,i,u){const c=r-i+1,l=o-u+1,f=new Float32Array(n*s*c*l);for(let d=0;d<n;d++)for(let p=0;p<s;p++)for(let m=0;m<c;m++)for(let g=0;g<l;g++){let b=0;for(let v=0;v<a;v++)for(let x=0;x<i;x++)for(let S=0;S<u;S++)b+=e[((d*a+v)*r+m+x)*o+g+S]*t[((p*a+v)*i+x)*u+S];f[((d*s+p)*c+m)*l+g]=b}return f}function fn(e,t,n){const a=new Float32Array(e.length);for(let r=0;r<t;r++){const o=r*n;let s=-1e30;for(let u=0;u<n;u++)e[o+u]>s&&(s=e[o+u]);let i=0;for(let u=0;u<n;u++){const c=Math.exp(e[o+u]-s);a[o+u]=c,i+=c}for(let u=0;u<n;u++)a[o+u]/=i}return a}function dn(e,t,n,a,r,o,s){const i=new Float32Array(a*r*o);for(let u=0;u<a;u++)for(let c=0;c<r;c++){const l=[];let f=-1e30;for(let m=0;m<r;m++){let g=0;for(let v=0;v<o;v++)g+=e[(u*r+c)*o+v]*t[(u*r+m)*o+v];const b=g*s;l.push(b),b>f&&(f=b)}let d=0;const p=l.map(m=>{const g=Math.exp(m-f);return d+=g,g});for(let m=0;m<r;m++){const g=p[m]/d;for(let b=0;b<o;b++)i[(u*r+c)*o+b]+=g*n[(u*r+m)*o+b]}}return i}function pn(e,t,n){const a=e.length;let r=0;for(let i=0;i<a;i++)r+=e[i]*e[i];const o=Math.sqrt(r/a+n),s=new Float32Array(a);for(let i=0;i<a;i++)s[i]=e[i]/o*t[i];return s}function X(e){return P(e.byteLength,e)}async function je(){try{const t=new Float32Array(64).fill(1),n=new Float32Array(64).fill(2),a=X(t),r=X(n),o=P(64*4),s=new ArrayBuffer(4);new Uint32Array(s)[0]=64;const i=L(s),u=q(Dt,4),c=O().createBindGroup({layout:u.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:r}},{binding:3,resource:{buffer:o}}]}),l=await Z({name:"VecAdd",pipeline:u,bindGroup:c,workgroups:[1,1,1],outputBuffer:o,outputBytes:64*4,validator:f=>{const d=f.every((p,m)=>Math.abs(p-3)<1e-5);return{pass:d,error:d?"":"Incorrect values"}}});return a.destroy(),r.destroy(),o.destroy(),i.destroy(),{name:"VecAdd",pass:l.pass,maxError:0,details:l.error||"N=64"}}catch(e){return{name:"VecAdd",pass:!1,maxError:1/0,details:e.message}}}async function Ke(){try{const t=new Float32Array(4096).fill(1),n=new Float32Array(64*64).fill(.5),a=X(t),r=X(n),o=P(64*64*4),s=new ArrayBuffer(12),i=new Uint32Array(s);i[0]=64,i[1]=64,i[2]=64;const u=L(s),c=q(He,4),l=O().createBindGroup({layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:r}},{binding:3,resource:{buffer:o}}]}),f=await Z({name:"Matmul",pipeline:c,bindGroup:l,workgroups:[Math.ceil(64/16),Math.ceil(64/16),1],outputBuffer:o,outputBytes:64*64*4,validator:d=>{const p=cn(t,n,64,64,64);let m=0;for(let b=0;b<64*64;b++)m=Math.max(m,Math.abs(d[b]-p[b]));const g=m<.001;return{pass:g,error:g?"":`Max error: ${m}`}}});return a.destroy(),r.destroy(),o.destroy(),u.destroy(),{name:"Matmul",pass:f.pass,maxError:0,details:f.error||"64×64"}}catch(e){return{name:"Matmul",pass:!1,maxError:1/0,details:e.message}}}async function Ve(){try{const c=new Float32Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]),l=new Float32Array([1,0,-1,1,0,-1,1,0,-1]),f=X(c),d=X(l),p=P(1*1*3*3*4),m=new ArrayBuffer(36),g=new Uint32Array(m);g[0]=1,g[1]=1,g[2]=5,g[3]=5,g[4]=1,g[5]=3,g[6]=3,g[7]=3,g[8]=3;const b=L(m),v=q(_t,4),x=O().createBindGroup({layout:v.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:d}},{binding:3,resource:{buffer:p}}]}),S=await Z({name:"Conv2D",pipeline:v,bindGroup:x,workgroups:[1,1,3*3],outputBuffer:p,outputBytes:1*1*3*3*4,validator:A=>{const w=ln(c,l,1,1,5,5,1,3,3);let B=0;for(let C=0;C<A.length;C++)B=Math.max(B,Math.abs(A[C]-w[C]));const E=B<1e-4;return{pass:E,error:E?"":`Max error: ${B}`}}});return f.destroy(),d.destroy(),p.destroy(),b.destroy(),{name:"Conv2D",pass:S.pass,maxError:0,details:S.error||"1×1×5×5"}}catch(e){return{name:"Conv2D",pass:!1,maxError:1/0,details:e.message}}}async function Ye(){try{const n=new Float32Array([-2,-1,0,1,2,2,1,0,-1,-2]),a=P(n.byteLength,n),r=P(n.byteLength),o=new ArrayBuffer(8);new Uint32Array(o)[0]=2,new Uint32Array(o)[1]=5;const s=L(o),i=q(Ft,3),u=O().createBindGroup({layout:i.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:r}}]}),c=await Z({name:"Softmax",pipeline:i,bindGroup:u,workgroups:[2,1,1],outputBuffer:r,outputBytes:n.byteLength,validator:l=>{const f=fn(n,2,5);let d=0;for(let m=0;m<n.length;m++)d=Math.max(d,Math.abs(l[m]-f[m]));const p=d<1e-4;return{pass:p,error:p?"":`Max error: ${d}`}}});return a.destroy(),r.destroy(),s.destroy(),{name:"Softmax",pass:c.pass,maxError:0,details:c.error||"Rows=2"}}catch(e){return{name:"Softmax",pass:!1,maxError:1/0,details:e.message}}}async function Xe(){try{const n=new Float32Array([1,2,3,4,5,6,7,8]),a=new Float32Array(8).fill(1),r=X(n),o=X(a),s=P(8*4),i=new ArrayBuffer(8);new Uint32Array(i)[0]=8,new Float32Array(i)[1]=1e-6;const u=L(i),c=q(Wt,4),l=O().createBindGroup({layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:r}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:s}}]}),f=await Z({name:"RMSNorm",pipeline:c,bindGroup:l,workgroups:[1,1,1],outputBuffer:s,outputBytes:8*4,validator:d=>{const p=pn(n,a,1e-6);let m=0;for(let b=0;b<8;b++)m=Math.max(m,Math.abs(d[b]-p[b]));const g=m<.001;return{pass:g,error:g?"":`Max error: ${m}`}}});return r.destroy(),o.destroy(),s.destroy(),u.destroy(),{name:"RMSNorm",pass:f.pass,maxError:0,details:f.error||"N=8"}}catch(e){return{name:"RMSNorm",pass:!1,maxError:1/0,details:e.message}}}async function Qe(){try{const a=1/Math.sqrt(4),r=1*4*4,o=1*4*4,s=()=>{const B=new Float32Array(r);for(let E=0;E<r;E++)B[E]=(E%4+1)*.1;return B},i=s(),u=s(),c=s(),l=X(i),f=X(u),d=X(c),p=P(r*4),m=P(o*4),g=new ArrayBuffer(16),b=new Uint32Array(g),v=new Float32Array(g);b[0]=1,b[1]=4,b[2]=4,v[3]=a;const x=L(g),S=q(zt,6),A=O().createBindGroup({layout:S.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:d}},{binding:4,resource:{buffer:p}},{binding:5,resource:{buffer:m}}]}),w=await Z({name:"Attention",pipeline:S,bindGroup:A,workgroups:[1,1,1],outputBuffer:p,outputBytes:r*4,validator:B=>{const E=dn(i,u,c,1,4,4,a);let C=0;for(let N=0;N<r;N++)C=Math.max(C,Math.abs(B[N]-E[N]));const G=C<.001;return{pass:G,error:G?"":`Max error: ${C}`}}});return l.destroy(),f.destroy(),d.destroy(),p.destroy(),m.destroy(),x.destroy(),{name:"Attention",pass:w.pass,maxError:0,details:w.error||"Finite check passed"}}catch(e){return{name:"Attention",pass:!1,maxError:1/0,details:e.message}}}const mn="aether-gpu-benchmark",gn=1,ue="results";function Ze(){return new Promise((e,t)=>{const n=indexedDB.open(mn,gn);n.onupgradeneeded=()=>{const a=n.result;a.objectStoreNames.contains(ue)||a.createObjectStore(ue,{keyPath:"id"})},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}async function Je(e,t){const n=await Ze(),a=`run_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,r={id:a,timestamp:new Date().toISOString(),device:navigator.userAgent,adapter:t.adapter,os:t.os,browser:t.browser,results:e};return new Promise((o,s)=>{const i=n.transaction(ue,"readwrite");i.objectStore(ue).put(r),i.oncomplete=()=>o(a),i.onerror=()=>s(i.error)})}async function Ht(){const e=await Ze();return new Promise((t,n)=>{const r=e.transaction(ue,"readonly").objectStore(ue).getAll();r.onsuccess=()=>t(r.result),r.onerror=()=>n(r.error)})}async function bn(){const e=await Ze();return new Promise((t,n)=>{const a=e.transaction(ue,"readwrite");a.objectStore(ue).clear(),a.oncomplete=()=>t(),a.onerror=()=>n(a.error)})}function yn(e,t){const n={version:"1.0",exportDate:new Date().toISOString(),userAgent:navigator.userAgent,deviceInfo:t??{},results:e.map(a=>({...a,details:a.details??{}}))};return JSON.stringify(n,null,2)}function vn(e,t){const n=`aether-benchmark-${Date.now()}.json`,a=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(a),o=document.createElement("a");o.href=r,o.download=n,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(r)}let Q=null,K=!1;function h(e,t=""){if(!Q)return;const n=Q.querySelector("#bench-log");if(!n)return;const a=document.createElement("div");a.className=`log-entry ${t}`,a.textContent=e,n.appendChild(a),n.scrollTop=n.scrollHeight}function z(e,t){if(!Q)return;const n=Q.querySelector("#progress-fill"),a=Q.querySelector("#progress-label");n&&(n.style.width=e<0?"0%":`${Math.min(e,100)}%`),a&&(a.textContent=t)}function et(e){if(!Q)return;const t=Q.querySelector("#results-table");if(!t)return;if(e.length===0){t.innerHTML='<div class="empty-state"><p>No results yet</p></div>';return}let n=`<table style="width:100%;border-collapse:collapse;font-size:12px;font-family:var(--mono)">
    <thead>
      <tr style="border-bottom:1px solid var(--border)">
        <th style="text-align:left;padding:6px;color:var(--text-dim)">Operation</th>
        <th style="text-align:left;padding:6px;color:var(--text-dim)">Input</th>
        <th style="text-align:right;padding:6px;color:var(--text-dim)">Time</th>
        <th style="text-align:right;padding:6px;color:var(--text-dim)">Throughput</th>
        <th style="text-align:right;padding:6px;color:var(--text-dim)">Memory</th>
        <th style="text-align:center;padding:6px;color:var(--text-dim)">Status</th>
      </tr>
    </thead>
    <tbody>`;for(const a of e){const r=a.success?"color:var(--green)":"color:var(--red)",o=a.success?"PASS":"FAIL";n+=`<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:6px;color:var(--text)">${a.name}</td>
      <td style="padding:6px;color:var(--text-dim)">${a.inputSize}</td>
      <td style="padding:6px;text-align:right;color:var(--text)">${a.executionTimeMs.toFixed(2)} ms</td>
      <td style="padding:6px;text-align:right;color:var(--text)">${a.throughput}</td>
      <td style="padding:6px;text-align:right;color:var(--text-dim)">${qe(a.memoryBytes)}</td>
      <td style="padding:6px;text-align:center;${r}">${o}</td>
    </tr>`}n+="</tbody></table>",t.innerHTML=n}function qe(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function wn(){if(K)return;K=!0;const e=Q?.querySelector("#btn-quick");e&&(e.disabled=!0);const t=[];try{h("═══ QUICK BENCHMARK ═══","info"),z(0,"Initializing GPU...");const n=await xe();h(`Adapter: ${n.adapterName}`,"ok"),h(`Timestamp query: ${n.timestampQuerySupport?"YES":"NO"}`,""),h("",""),h("── CORRECTNESS TESTS ──","info");const a=[{name:"Vector Add",fn:je},{name:"Matmul",fn:Ke},{name:"Conv2D",fn:Ve},{name:"Softmax",fn:Ye},{name:"RMSNorm",fn:Xe},{name:"Attention",fn:Qe}];let r=!0;for(const c of a)try{const l=await c.fn();h(`  ${l.pass?"✓":"✗"} ${l.name}: ${l.details||""} (max err: ${l.maxError.toExponential(2)})`,l.pass?"ok":"err"),l.pass||(r=!1)}catch(l){h(`  ✗ ${c.name}: FAILED WITH ERROR: ${l.message}`,"err"),r=!1}h(`  ${r?"ALL TESTS PASSED":"SOME TESTS FAILED"}`,r?"ok":"err"),h("",""),h("── BENCHMARKS ──","info"),z(10,"Vector Add..."),h("▸ Vector Addition","info");const o=await Rt();for(const c of o)h(`  ${c.name} ${c.inputSize}: ${c.executionTimeMs.toFixed(2)} ms — ${c.throughput} [${c.success?"PASS":"FAIL"}]`,c.success?"ok":"err"),t.push(c);z(30,"Matrix Multiply..."),h("▸ Matrix Multiply","info");const s=await Lt();for(const c of s)h(`  ${c.name} ${c.inputSize}: ${c.executionTimeMs.toFixed(2)} ms — ${c.throughput} [${c.success?"PASS":"FAIL"}]`,c.success?"ok":"err"),t.push(c);z(60,"Softmax..."),h("▸ Softmax","info");const i=await qt();for(const c of i)h(`  ${c.name} ${c.inputSize}: ${c.executionTimeMs.toFixed(2)} ms — ${c.throughput} [${c.success?"PASS":"FAIL"}]`,c.success?"ok":"err"),t.push(c);z(80,"RMSNorm..."),h("▸ RMSNorm","info");const u=await It();for(const c of u)h(`  ${c.name} ${c.inputSize}: ${c.executionTimeMs.toFixed(2)} ms — ${c.throughput} [${c.success?"PASS":"FAIL"}]`,c.success?"ok":"err"),t.push(c);z(100,"Done"),h("",""),h("═══ QUICK BENCHMARK COMPLETE ═══","info"),h(`${t.length} tests run`,""),et(t);try{await Je(t,{adapter:n.adapterName,os:tt(),browser:rt()})}catch{}}catch(n){h(`ERROR: ${n.message}`,"err"),z(0,"Error")}finally{K=!1,e&&(e.disabled=!1)}}async function hn(){if(K)return;K=!0;const e=Q?.querySelector("#btn-full");e&&(e.disabled=!0);const t=[];try{h("═══ FULL BENCHMARK ═══","info"),z(0,"Initializing GPU...");const n=await xe();h(`Adapter: ${n.adapterName}`,"ok"),h("",""),h("── CORRECTNESS TESTS ──","info");const a=[{name:"Vector Add",fn:je},{name:"Matmul",fn:Ke},{name:"Conv2D",fn:Ve},{name:"Softmax",fn:Ye},{name:"RMSNorm",fn:Xe},{name:"Attention",fn:Qe}];for(const o of a)try{const s=await o.fn();h(`  ${s.pass?"✓":"✗"} ${s.name}: ${s.details||""} (max err: ${s.maxError.toExponential(2)})`,s.pass?"ok":"err")}catch(s){h(`  ✗ ${o.name}: FAILED WITH ERROR: ${s.message}`,"err")}const r=[{name:"Vector Addition",fn:Rt,pct:10},{name:"Matrix Multiply",fn:Lt,pct:25},{name:"Convolution",fn:an,pct:40},{name:"Softmax",fn:qt,pct:55},{name:"RMSNorm",fn:It,pct:65},{name:"Attention",fn:on,pct:75},{name:"Memory",fn:()=>sn(n),pct:90}];for(const o of r){z(o.pct,`${o.name}...`),h(`▸ ${o.name}`,"info");try{const s=await o.fn();for(const i of s)h(`  ${i.inputSize}: ${i.executionTimeMs.toFixed(2)} ms — ${i.throughput} [${i.success?"PASS":"FAIL"}]`,i.success?"ok":"err"),t.push(i)}catch(s){h(`  ERROR: ${s.message}`,"err")}}z(100,"Done"),h("",""),h("═══ FULL BENCHMARK COMPLETE ═══","info"),h(`${t.length} tests run`,""),et(t);try{await Je(t,{adapter:n.adapterName,os:tt(),browser:rt()})}catch{}}catch(n){h(`ERROR: ${n.message}`,"err"),z(0,"Error")}finally{K=!1,e&&(e.disabled=!1)}}async function xn(){if(K)return;K=!0;const e=Q?.querySelector("#btn-sustained");e&&(e.disabled=!0);const t=[];try{h("═══ SUSTAINED LOAD BENCHMARK ═══","info"),h("This will run 30s + 60s + 180s = 270s total","warn"),h("Keep the screen on and do not switch tabs","warn"),z(0,"Initializing GPU..."),await xe();const n=await un((a,r)=>{a>=0&&z(a,r),h(`  ${r}`,"")});for(const a of n)h(`  ${a.name}: ${a.avgGflops.toFixed(1)} GFLOPS avg, throttled=${a.thermalThrottling}`,a.thermalThrottling?"warn":"ok"),t.push(a);z(100,"Done"),h("",""),h("═══ SUSTAINED BENCHMARK COMPLETE ═══","info"),et(t);try{await Je(t,{adapter:(await xe()).adapterName,os:tt(),browser:rt()})}catch{}}catch(n){h(`ERROR: ${n.message}`,"err"),z(0,"Error")}finally{K=!1,e&&(e.disabled=!1)}}async function Sn(){if(!K){K=!0;try{h("═══ CORRECTNESS TESTS ═══","info"),await xe();try{O().onuncapturederror=n=>{const a=n.error?.message||"unknown GPU error";h(`UNCAPTURED GPU ERROR: ${a}`,"err")}}catch{}const e=[{name:"Vector Add",fn:je},{name:"Matmul",fn:Ke},{name:"Conv2D",fn:Ve},{name:"Softmax",fn:Ye},{name:"RMSNorm",fn:Xe},{name:"Attention",fn:Qe}];let t=!0;for(const n of e)try{const a=await n.fn();h(`${a.pass?"✓":"✗"} ${a.name}: ${a.details||""} (max err: ${a.maxError.toExponential(2)})`,a.pass?"ok":"err"),a.pass||(t=!1)}catch(a){h(`✗ ${n.name}: FAILED WITH ERROR: ${a.message}`,"err"),t=!1}h("",""),h(t?"ALL TESTS PASSED":"SOME TESTS FAILED",t?"ok":"err")}catch(e){h(`ERROR: ${e.message}`,"err")}finally{K=!1}}}async function Bn(){try{const e=await Ht();if(e.length===0){h("No results to export. Run a benchmark first.","warn");return}const t=e[e.length-1],n=yn(t.results,{adapter:t.adapter,os:t.os,browser:t.browser,timestamp:t.timestamp});vn(n),h("JSON exported","ok")}catch(e){h(`Export error: ${e.message}`,"err")}}async function An(){try{const e=await Ht();h(`── HISTORY: ${e.length} saved runs ──`,"info");for(const t of e.slice(-5))h(`  ${t.timestamp} — ${t.results.length} results — ${t.adapter}`,"")}catch(e){h(`History error: ${e.message}`,"err")}}async function Mn(){try{await bn(),h("History cleared","ok")}catch(e){h(`Clear error: ${e.message}`,"err")}}function tt(){const e=navigator.userAgent;if(e.includes("iPhone")||e.includes("iPad")){const t=e.match(/OS (\d+_\d+)/);return`iOS ${t?t[1].replace("_","."):"?"}`}return e.includes("Mac")?"macOS":e.includes("Windows")?"Windows":e.includes("Android")?"Android":"Unknown"}function rt(){const e=navigator.userAgent;return e.includes("Safari")&&!e.includes("Chrome")?"Safari":e.includes("Chrome")&&!e.includes("Edg")?"Chrome":e.includes("Edg")?"Edge":e.includes("Firefox")?"Firefox":"Unknown"}function Cn(e){Q=e,e.innerHTML=`
    <h2>GPU Compute Benchmark</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Real WebGPU compute benchmarks running on the device GPU.
      All measurements from actual timed execution.
    </p>

    <div class="card" style="border-color:var(--border)">
      <div class="card-header">
        <span class="card-title">Device Info</span>
        <span class="badge badge-info" id="device-badge">NOT INITIALIZED</span>
      </div>
      <div id="device-info" style="font-size:12px;color:var(--text-dim);margin-top:8px"></div>
    </div>

    <div class="btn-row">
      <button class="btn" id="btn-correctness">✓ CORRECTNESS ONLY</button>
      <button class="btn btn-outline" id="btn-quick">⚡ QUICK BENCHMARK</button>
      <button class="btn btn-outline" id="btn-full">FULL BENCHMARK</button>
      <button class="btn btn-outline" id="btn-sustained">SUSTAINED (270s)</button>
    </div>

    <div class="btn-row">
      <button class="btn btn-outline" id="btn-export">EXPORT JSON</button>
      <button class="btn btn-outline" id="btn-history">HISTORY</button>
      <button class="btn btn-outline" id="btn-clear">CLEAR HISTORY</button>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0">
      <span id="progress-label" style="font-size:12px;color:var(--text-dim)">Ready</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" id="progress-fill" style="width:0%"></div>
    </div>

    <div id="results-table"></div>

    <div class="log" id="bench-log"></div>
  `,e.querySelector("#btn-quick")?.addEventListener("click",wn),e.querySelector("#btn-full")?.addEventListener("click",hn),e.querySelector("#btn-sustained")?.addEventListener("click",xn),e.querySelector("#btn-correctness")?.addEventListener("click",Sn),e.querySelector("#btn-export")?.addEventListener("click",Bn),e.querySelector("#btn-history")?.addEventListener("click",An),e.querySelector("#btn-clear")?.addEventListener("click",Mn);const t=n=>{n.preventDefault()};window.addEventListener("error",t),window.addEventListener("unhandledrejection",t),xe().then(n=>{const a=e.querySelector("#device-badge"),r=e.querySelector("#device-info");a&&(a.textContent="WEBGPU READY",a.className="badge badge-pass"),r&&(r.innerHTML=`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
          <span>Adapter:</span><span style="color:var(--text)">${n.adapterName}</span>
          <span>Vendor:</span><span style="color:var(--text)">${n.adapterVendor}</span>
          <span>Features:</span><span style="color:var(--text)">${n.adapterFeatures.length}</span>
          <span>Max Buffer:</span><span style="color:var(--text)">${qe(n.maxBufferSize)}</span>
          <span>Max Storage:</span><span style="color:var(--text)">${qe(n.maxStorageBufferBindingSize)}</span>
          <span>Workgroup X:</span><span style="color:var(--text)">${n.maxComputeWorkgroupSizeX}</span>
          <span>Invocations/wg:</span><span style="color:var(--text)">${n.maxComputeInvocationsPerWorkgroup}</span>
          <span>Timestamp Query:</span><span style="color:var(--text)">${n.timestampQuerySupport?"YES":"NO"}</span>
          <span>Preferred Format:</span><span style="color:var(--text)">${n.preferredCanvasFormat??"N/A"}</span>
          <span>Fallback:</span><span style="color:var(--text)">${n.isFallbackAdapter?"YES (software)":"NO (hardware)"}</span>
        </div>
      `)}).catch(n=>{const a=e.querySelector("#device-badge");a&&(a.textContent="WEBGPU UNAVAILABLE",a.className="badge badge-fail")})}const Un=Object.freeze(Object.defineProperty({__proto__:null,render:Cn},Symbol.toStringTag,{value:"Module"})),nt=[{id:"gpubench",label:"GPU Bench",module:Un},{id:"device",label:"Device Test",module:er},{id:"webgpudiag",label:"WebGPU Diag",module:Qr},{id:"model",label:"Model Test",module:lr},{id:"tensor",label:"Tensor Bench",module:Vr},{id:"image",label:"Image Test",module:dr},{id:"video",label:"Video Test",module:br},{id:"diag",label:"Diagnostics",module:hr}];let jt="gpubench";function $t(){const e=window.location.hash.replace("#","");return nt.some(t=>t.id===e)?e:e==="diagnostics/webgpu"||e==="webgpu"?"webgpudiag":"gpubench"}function We(e){jt=e,window.location.hash=e;const t=document.getElementById("nav"),n=document.getElementById("screen");t.querySelectorAll("button").forEach(r=>{r.classList.toggle("active",r.dataset.screen===e)});const a=nt.find(r=>r.id===e);a&&a.module.render(n)}function Pn(){const e=document.getElementById("app");e.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const t=document.getElementById("nav");document.getElementById("screen"),nt.forEach(a=>{const r=document.createElement("button");r.textContent=a.label,r.dataset.screen=a.id,r.addEventListener("click",()=>We(a.id)),t.appendChild(r)});const n=$t();We(n),window.addEventListener("hashchange",()=>{const a=$t();a!==jt&&We(a)}),"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").catch(()=>{})}Pn();
