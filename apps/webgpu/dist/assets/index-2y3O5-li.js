(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=r(a);fetch(a.href,o)}})();function yn(e){let t="Unknown",r="Unknown",n="Unknown",a="Unknown";const o=e.match(/OS (\d+)_(\d+)/);o&&(n="iOS",a=`${o[1]}.${o[2]}`);const i=e.match(/Mac OS X (\d+)[_.](\d+)/);if(i&&(n="macOS",a=`${i[1]}.${i[2]}`),e.includes("Windows")){n="Windows";const u=e.match(/Windows NT (\d+\.\d+)/);u&&(a=u[1])}if(e.includes("Android")){n="Android";const u=e.match(/Android (\d+[\.\d]*)/);u&&(a=u[1])}if(e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")){t="Safari";const u=e.match(/Version\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Chrome")&&!e.includes("Edg")){t="Chrome";const u=e.match(/Chrome\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Edg/")){t="Edge";const u=e.match(/Edg\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Firefox")){t="Firefox";const u=e.match(/Firefox\/(\d+[\.\d]*)/);u&&(r=u[1])}return{browserName:t,browserVersion:r,osName:n,osVersion:a}}function hn(e){return!!(e.includes("FBAN")||e.includes("FBIOS")||e.includes("Twitter")||e.includes("Instagram")||e.includes("Line/")||e.includes("WeChat")||e.includes("MicroMessenger")||e.includes("CocoaPods")||e.includes("wv)")||e.includes("Electron")||e.includes("; wv)"))}function wn(e){return e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")}async function Mt(){const e=navigator.userAgent,t=yn(e),r=t.osName==="iOS",n=wn(e),a=hn(e),o=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,i={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:e,platform:navigator.platform,isIOS:r,isSafari:n,isWebView:a,isStandalone:o,browserName:t.browserName,browserVersion:t.browserVersion,osName:t.osName,osVersion:t.osVersion},s={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(a)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:i,gpu:s};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:r?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:i,gpu:s};if(!navigator.gpu){let u="navigator.gpu is undefined. WebGPU API is not exposed.",l="";if(r){if(parseInt(t.osVersion.split(".")[0],10)<26)return u=`iOS ${t.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,l="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:l,environment:i,gpu:s};if(t.browserName!=="Safari")return u=`Running ${t.browserName} on iOS ${t.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,l="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:u,recommendation:l,environment:i,gpu:s}}return t.osName==="macOS"&&parseInt(t.osVersion.split(".")[0],10)<14?(u=`macOS ${t.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,l="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:l,environment:i,gpu:s}):(l="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:l,environment:i,gpu:s})}try{const u=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!u){s.adapterError="requestAdapter() returned null";let f="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",p="";return r?parseInt(t.osVersion.split(".")[0],10)>=26&&(f=`iOS ${t.osVersion} with Safari ${t.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,p="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(f="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",p="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):p="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:f,recommendation:p,environment:i,gpu:s}}s.adapterName=u.name??"Unknown GPU",s.adapterVendor=u.vendor??"Unknown",s.adapterDevice=u.device??"Unknown",s.isFallbackAdapter=u.isFallbackAdapter??!1;const l=[];for(const f of u.features)l.push(f.replace(/-/g," ").replace(/\b\w/g,p=>p.toUpperCase()));s.features=l;const c=u.limits;s.limits={maxBufferSize:c.maxBufferSize,maxTextureDimension1D:c.maxTextureDimension1D,maxTextureDimension2D:c.maxTextureDimension2D,maxTextureDimension3D:c.maxTextureDimension3D,maxComputeWorkgroupStorageSize:c.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:c.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:c.maxStorageBufferBindingSize,maxUniformBufferBindingSize:c.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:c.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:c.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:c.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:c.maxComputeWorkgroupsPerDimension,maxColorAttachments:c.maxColorAttachments,minStorageBufferOffsetAlignment:c.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:c.minUniformBufferOffsetAlignment};try{(await u.requestDevice({requiredLimits:{}})).destroy()}catch(f){return s.deviceError=f.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${s.adapterName}) but requestDevice() failed: ${f.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:i,gpu:s}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${s.adapterName}.`,recommendation:"No action needed.",environment:i,gpu:s}}catch(u){return s.adapterError=u.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${u.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:i,gpu:s}}}function Nr(e){const t=[];if(t.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),t.push(""),t.push(`STATUS: ${e.statusLabel}`),t.push(`CASE: ${e.case}`),t.push(`REASON: ${e.reason}`),t.push(`RECOMMENDATION: ${e.recommendation}`),t.push(""),t.push("── ENVIRONMENT ──"),t.push(`  URL: ${e.environment.url}`),t.push(`  Protocol: ${e.environment.protocol}`),t.push(`  Hostname: ${e.environment.hostname}`),t.push(`  Secure Context: ${e.environment.isSecureContext}`),t.push(`  iOS: ${e.environment.isIOS}`),t.push(`  Safari: ${e.environment.isSafari}`),t.push(`  WebView: ${e.environment.isWebView}`),t.push(`  Standalone PWA: ${e.environment.isStandalone}`),t.push(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`),t.push(`  OS: ${e.environment.osName} ${e.environment.osVersion}`),t.push(`  Platform: ${e.environment.platform}`),t.push(`  User Agent: ${e.environment.userAgent}`),t.push(""),t.push("── WEBGPU ──"),t.push(`  navigator.gpu exists: ${e.gpu.navigatorGpuExists}`),e.gpu.adapterName&&t.push(`  Adapter: ${e.gpu.adapterName}`),e.gpu.adapterVendor&&t.push(`  Vendor: ${e.gpu.adapterVendor}`),e.gpu.adapterDevice&&t.push(`  Device: ${e.gpu.adapterDevice}`),e.gpu.adapterError&&t.push(`  Adapter Error: ${e.gpu.adapterError}`),e.gpu.deviceError&&t.push(`  Device Error: ${e.gpu.deviceError}`),t.push(`  Fallback adapter: ${e.gpu.isFallbackAdapter}`),e.gpu.features.length>0){t.push(`  Features (${e.gpu.features.length}):`);for(const r of e.gpu.features)t.push(`    ${r}`)}if(e.gpu.limits){t.push("  Limits:");for(const[r,n]of Object.entries(e.gpu.limits))t.push(`    ${r}: ${typeof n=="number"?n.toLocaleString():n}`)}return t.push(""),t.push(`Timestamp: ${new Date().toISOString()}`),t.join(`
`)}function ut(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function Pe(){const e=await Mt();if(!e.ready||!e.gpu.adapterName)return null;const t=e.gpu.limits;return{available:!0,adapterName:e.gpu.adapterName,adapterVendor:e.gpu.adapterVendor,adapterDevice:e.gpu.adapterDevice,features:e.gpu.features,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:e.gpu.isFallbackAdapter,featuresMap:new Set(e.gpu.features),diagnostic:e}}async function $e(e,t=[]){const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("Failed to re-acquire GPU adapter");const n=await r.requestDevice({requiredFeatures:t.filter(a=>e.featuresMap.has(a)),requiredLimits:{}});return n.lost.then(a=>{console.error("WebGPU device lost:",a.message)}),n}function xn(e){const t=e.environment,r=e.gpu;let n="badge-fail";e.case==="D"?n="badge-pass":(e.case==="B"||e.case==="C")&&(n="badge-warn");let a=`
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
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${ut(r.limits.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${r.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${r.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${r.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${ut(r.limits.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${ut(r.limits.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${ut(r.limits.maxComputeWorkgroupStorageSize)}</span></div>
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
    `),a}function Sn(e){e.innerHTML=`
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;const t=e.querySelector("#device-status"),r=e.querySelector("#device-info");Mt().then(n=>{n.ready?t.innerHTML=`
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `:t.innerHTML="",r.innerHTML=xn(n)})}const Mn=Object.freeze(Object.defineProperty({__proto__:null,render:Sn},Symbol.toStringTag,{value:"Module"}));let T=class Rr{buffer;shape;dtype;size;device;constructor(t,r,n="f32"){this.device=t,this.shape=[...r],this.dtype=n,this.size=r.reduce((i,s)=>i*s,1);const a=n==="f32"?4:n==="f16"?2:4;this.buffer=t.createBuffer({size:this.size*a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(n==="f32"?new Float32Array(this.buffer.getMappedRange()):n==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(t,r,n){const a=new Rr(t,n,r instanceof Float32Array?"f32":"i32");return t.queue.writeBuffer(a.buffer,0,r.buffer),a}async readback(){const t=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r=this.device.createCommandEncoder();r.copyBufferToBuffer(this.buffer,0,t,0,this.buffer.size),this.device.queue.submit([r.finish()]),await t.mapAsync(GPUMapMode.READ);const n=new Float32Array(t.getMappedRange().slice(0));return t.unmap(),t.destroy(),n}destroy(){this.buffer.destroy()}};async function je(e,t,r=50,n){const a=[];for(let l=0;l<Math.min(5,r);l++)await t();for(let l=0;l<r;l++){const c=performance.now();await t(),await _r?.queue.onSubmittedWorkDone();const f=performance.now();a.push(f-c)}a.sort((l,c)=>l-c);const o=a.reduce((l,c)=>l+c,0)/a.length,i=a[0],s=a[a.length-1],u={name:e,avgMs:o,minMs:i,maxMs:s,iterations:r};if(n){const c=n/(o/1e3)/1e9;u.gflops=c,u.throughput=`${c.toFixed(2)} GFLOPS`}return u}let _r=null;function Ue(e){_r=e}function Ve(e){const t=[`${e.name}: ${e.avgMs.toFixed(2)} ms avg`,`(${e.minMs.toFixed(2)} – ${e.maxMs.toFixed(2)} ms)`,`[${e.iterations} iterations]`];return e.throughput&&t.push(e.throughput),t.join(" ")}const gt=`
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
`,En=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= uniforms.N) { return; }
  data[i] = max(data[i], 0.0);
}
`,An=`
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
`,Pn=`
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
`,$n=`
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
`,Un=`
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
`;let w=null,ke=null;function B(e,t=""){if(!ke)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,ke.appendChild(r),ke.scrollTop=ke.scrollHeight}async function Zt(){B("═══ TINY NEURAL NETWORK TEST ═══","info"),B("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),B("");const e=await Pe();if(!e)return B("WebGPU not available","err"),!1;w=await $e(e),Ue(w);const t=performance.now(),r=T.fromData(w,new Float32Array([1,.5,-.3,.8]),[4]),n=T.fromData(w,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),a=T.fromData(w,new Float32Array([.1,-.1,.2]),[3]),o=new ArrayBuffer(12),i=new Uint32Array(o);i[0]=1,i[1]=3,i[2]=4;const s=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:w.createShaderModule({code:gt}),entryPoint:"main"}}),l=w.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(l,0,o);const c=new T(w,[1,3]),f=w.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:n.buffer}},{binding:3,resource:{buffer:c.buffer}}]});let p=w.createCommandEncoder(),d=p.beginComputePass();d.setPipeline(u),d.setBindGroup(0,f),d.dispatchWorkgroups(1,1,1),d.end(),w.queue.submit([p.finish()]),B(`  input[4]:  [${Array.from(await r.readback()).map(G=>G.toFixed(2)).join(", ")}]`,""),B("  W1[4×3]:   4 rows × 3 cols",""),B("  Matmul result: computing...","");const m=await c.readback();B(`  h1 = input @ W1: [${Array.from(m).map(G=>G.toFixed(3)).join(", ")}]`,"ok");for(let G=0;G<3;G++)m[G]+=[.1,-.1,.2][G];w.queue.writeBuffer(c.buffer,0,m.buffer),B(`  h1 + bias:       [${Array.from(m).map(G=>G.toFixed(3)).join(", ")}]`,"ok");const g=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),b=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[g]}),compute:{module:w.createShaderModule({code:En}),entryPoint:"main"}}),v=new ArrayBuffer(4);new Uint32Array(v)[0]=3;const h=w.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(h,0,v);const y=w.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:c.buffer}}]});p=w.createCommandEncoder(),d=p.beginComputePass(),d.setPipeline(b),d.setBindGroup(0,y),d.dispatchWorkgroups(1,1,1),d.end(),w.queue.submit([p.finish()]);const E=await c.readback();B(`  ReLU(h1):         [${Array.from(E).map(G=>G.toFixed(3)).join(", ")}]`,"ok");const x=T.fromData(w,new Float32Array([.7,-.3,.5]),[3,1]),k=new T(w,[1,1]),O=new ArrayBuffer(12),F=new Uint32Array(O);F[0]=1,F[1]=1,F[2]=3;const R=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),X=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[R]}),compute:{module:w.createShaderModule({code:gt}),entryPoint:"main"}}),Ne=w.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(Ne,0,O);const me=w.createBindGroup({layout:R,entries:[{binding:0,resource:{buffer:Ne}},{binding:1,resource:{buffer:c.buffer}},{binding:2,resource:{buffer:x.buffer}},{binding:3,resource:{buffer:k.buffer}}]});p=w.createCommandEncoder(),d=p.beginComputePass(),d.setPipeline(X),d.setBindGroup(0,me),d.dispatchWorkgroups(1,1,1),d.end(),w.queue.submit([p.finish()]);const Z=await k.readback(),ie=(performance.now()-t).toFixed(1);return B(`  Final output: ${Z[0].toFixed(4)}`,"ok"),B(`  Total pipeline: ${ie} ms`,"ok"),B("",""),B("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),r.destroy(),n.destroy(),a.destroy(),c.destroy(),x.destroy(),k.destroy(),l.destroy(),Ne.destroy(),h.destroy(),w.destroy(),!0}async function Cn(){B("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const e=await Pe();if(!e)return null;w=await $e(e),Ue(w);const t=[64,128,256,512],r=[];for(const n of t){const a=T.fromData(w,new Float32Array(n*n).fill(1),[n,n]),o=T.fromData(w,new Float32Array(n*n).fill(.5),[n,n]),i=new T(w,[n,n]),s=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:w.createShaderModule({code:gt}),entryPoint:"main"}}),l=new ArrayBuffer(12),c=new Uint32Array(l);c[0]=n,c[1]=n,c[2]=n;const f=await je(`${n}×${n} matmul`,async()=>{const p=w.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(p,0,l);const d=w.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),m=w.createCommandEncoder(),g=m.beginComputePass();g.setPipeline(u),g.setBindGroup(0,d);const b=Math.ceil(n/16);g.dispatchWorkgroups(b,b,1),g.end(),w.queue.submit([m.finish()]),p.destroy()},30,2*n*n*n);r.push(f),B(Ve(f),"ok"),a.destroy(),o.destroy(),i.destroy()}return w.destroy(),r[r.length-1]}async function Bn(){B("═══ CONVOLUTION BENCHMARK ═══","info");const e=await Pe();if(!e)return null;w=await $e(e),Ue(w);const t=1,r=3,n=32,a=32,o=8,i=3,s=3,u=n-i+1,l=a-s+1,c=T.fromData(w,new Float32Array(t*r*n*a).fill(.5),[t,r,n,a]),f=T.fromData(w,new Float32Array(o*r*i*s).fill(.1),[o,r,i,s]),p=new T(w,[t,o,u,l]),d=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),m=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[d]}),compute:{module:w.createShaderModule({code:An}),entryPoint:"main"}}),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=t,b[1]=r,b[2]=n,b[3]=a,b[4]=o,b[5]=i,b[6]=s,b[7]=u,b[8]=l;const v=await je(`Conv2D ${t}×${r}×${n}×${a} k=${i}→${o}×${u}×${l}`,async()=>{const h=w.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(h,0,g);const y=w.createBindGroup({layout:d,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:c.buffer}},{binding:2,resource:{buffer:f.buffer}},{binding:3,resource:{buffer:p.buffer}}]}),E=w.createCommandEncoder(),x=E.beginComputePass();x.setPipeline(m),x.setBindGroup(0,y),x.dispatchWorkgroups(t,o,1),x.end(),w.queue.submit([E.finish()]),h.destroy()},20,2*t*o*r*i*s*u*l);return B(Ve(v),"ok"),c.destroy(),f.destroy(),p.destroy(),w.destroy(),v}async function Tn(){B("═══ ATTENTION BENCHMARK ═══","info");const e=await Pe();if(!e)return null;w=await $e(e),Ue(w);const t=1,r=64,n=64,a=1/Math.sqrt(n),o=T.fromData(w,new Float32Array(t*r*n).fill(.1),[t,r,n]),i=T.fromData(w,new Float32Array(t*r*n).fill(.1),[t,r,n]),s=T.fromData(w,new Float32Array(t*r*n).fill(.1),[t,r,n]),u=new T(w,[t,r,n]),l=new T(w,[t,r,r]),c=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),f=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[c]}),compute:{module:w.createShaderModule({code:Pn}),entryPoint:"main"}}),p=new ArrayBuffer(16),d=new Uint32Array(p),m=new Float32Array(p);d[0]=t,d[1]=r,d[2]=n,m[3]=a;const g=await je(`Attention b=${t} s=${r} d=${n}`,async()=>{const b=w.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(b,0,p);const v=w.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:i.buffer}},{binding:3,resource:{buffer:s.buffer}},{binding:4,resource:{buffer:u.buffer}},{binding:5,resource:{buffer:l.buffer}}]}),h=w.createCommandEncoder(),y=h.beginComputePass();y.setPipeline(f),y.setBindGroup(0,v),y.dispatchWorkgroups(t,1,1),y.end(),w.queue.submit([h.finish()]),b.destroy()},20);return B(Ve(g),"ok"),o.destroy(),i.destroy(),s.destroy(),u.destroy(),l.destroy(),w.destroy(),g}function kn(e){e.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,ke=e.querySelector("#model-log"),e.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{ke.innerHTML="",await Zt()}),e.querySelector("#btn-all-bench").addEventListener("click",async()=>{ke.innerHTML="",await Zt(),B("",""),await Cn(),B("",""),await Bn(),B("",""),await Tn(),B("",""),B("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const Dn=Object.freeze(Object.defineProperty({__proto__:null,render:kn},Symbol.toStringTag,{value:"Module"}));let U=null,we=null;function ee(e,t=""){if(!we)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,we.appendChild(r),we.scrollTop=we.scrollHeight}function Lr(e,t){const r=new Float32Array(e*t*4);for(let n=0;n<t;n++)for(let a=0;a<e;a++){const o=(n*e+a)*4,i=(a>>4)+(n>>4)&1;r[o+0]=i?.9:a/e*.8,r[o+1]=i?.3:n/t*.6,r[o+2]=i?.6:.4,r[o+3]=1}return r}function Gt(e,t,r){const n=document.createElement("canvas");n.width=t,n.height=r;const a=n.getContext("2d"),o=a.createImageData(t,r);for(let i=0;i<t*r*4;i++)o.data[i]=Math.round(e[i]*255);return a.putImageData(o,0,0),n}async function Jt(){ee("═══ GRAYSCALE TEST ═══","info");const e=await Pe();if(!e){ee("WebGPU unavailable","err");return}U=await $e(e),Ue(U);const t=256,r=256,n=Lr(t,r),a=T.fromData(U,n,[t*r*4]),o=new T(U,[t*r*4]),i=U.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),s=U.createComputePipeline({layout:U.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:U.createShaderModule({code:Un}),entryPoint:"main"}}),u=new ArrayBuffer(4);new Uint32Array(u)[0]=t*r;const l=await je("Grayscale 256×256",async()=>{const m=U.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});U.queue.writeBuffer(m,0,u);const g=U.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:o.buffer}}]}),b=U.createCommandEncoder(),v=b.beginComputePass();v.setPipeline(s),v.setBindGroup(0,g),v.dispatchWorkgroups(Math.ceil(t*r/256),1,1),v.end(),U.queue.submit([b.finish()]),m.destroy()},50);ee(Ve(l),"ok");const c=await o.readback(),f=Gt(n,t,r),p=Gt(c,t,r),d=qt?.querySelector("#image-display");if(d){d.innerHTML="";const m=document.createElement("div");m.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const g=document.createElement("div");g.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',g.appendChild(f);const b=document.createElement("div");b.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',b.appendChild(p),m.appendChild(g),m.appendChild(b),d.appendChild(m)}a.destroy(),o.destroy(),U.destroy(),ee("✓ Grayscale complete","ok")}async function er(){ee("═══ CONVOLUTION KERNEL TEST ═══","info");const e=await Pe();if(!e){ee("WebGPU unavailable","err");return}U=await $e(e),Ue(U);const t=128,r=128,n=3,a=Lr(t,r),o={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},i=U.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),s=U.createComputePipeline({layout:U.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:U.createShaderModule({code:$n}),entryPoint:"main"}}),u=new ArrayBuffer(16),l=new Uint32Array(u);l[0]=t,l[1]=r,l[2]=n,l[3]=0;for(const[c,f]of Object.entries(o)){const p=T.fromData(U,a,[t*r*4]),d=T.fromData(U,f,[n*n]),m=new T(U,[t*r*4]),g=await je(`Conv ${c} ${t}×${r}`,async()=>{const h=U.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});U.queue.writeBuffer(h,0,u);const y=U.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:d.buffer}},{binding:2,resource:{buffer:p.buffer}},{binding:3,resource:{buffer:m.buffer}}]}),E=U.createCommandEncoder(),x=E.beginComputePass();x.setPipeline(s),x.setBindGroup(0,y),x.dispatchWorkgroups(Math.ceil(t/16),Math.ceil(r/16),1),x.end(),U.queue.submit([E.finish()]),h.destroy()},30);ee(Ve(g),"ok");const b=await m.readback(),v=qt?.querySelector("#image-display");if(v){const h=Gt(b,t,r),y=document.createElement("div");y.style.cssText="display:inline-block;margin:4px",y.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${c}</div>`,y.appendChild(h),v.appendChild(y)}p.destroy(),d.destroy(),m.destroy()}U.destroy(),ee("✓ All convolution kernels applied","ok")}let qt=null;function On(e){qt=e,e.innerHTML=`
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
  `,we=e.querySelector("#image-log"),e.querySelector("#btn-grayscale").addEventListener("click",async()=>{we.innerHTML="",e.querySelector("#image-display").innerHTML="",await Jt()}),e.querySelector("#btn-conv").addEventListener("click",async()=>{we.innerHTML="",e.querySelector("#image-display").innerHTML="",await er()}),e.querySelector("#btn-all-img").addEventListener("click",async()=>{we.innerHTML="",e.querySelector("#image-display").innerHTML="",await Jt(),ee("",""),await er(),ee("",""),ee("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const Gn=Object.freeze(Object.defineProperty({__proto__:null,render:On},Symbol.toStringTag,{value:"Module"}));let I=null,Ze=null,ft=null;function Nt(e,t=""){if(!Ze)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Ze.appendChild(r),Ze.scrollTop=Ze.scrollHeight}const Nn=`
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
`;let Rt=0,pt=0;async function Rn(e,t,r,n,a){const o=await Pe();if(!o){Nt("WebGPU unavailable","err");return}I=await $e(o),Ue(I);const[i,s]=n.value.split("x").map(Number);e.width=i,e.height=s,Rt=parseInt(a.value);const u=I.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),l=I.createComputePipeline({layout:I.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:I.createShaderModule({code:Nn}),entryPoint:"main"}}),c=I.createBuffer({size:i*s*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),f=e.getContext("2d"),p=I.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let d=performance.now(),m=0,g=0;t.textContent="RENDERING",t.className="badge badge-pass";function b(){const v=new ArrayBuffer(16),h=new Uint32Array(v);h[0]=i,h[1]=s,h[2]=pt,h[3]=Rt,I.queue.writeBuffer(p,0,v);const y=I.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:c}}]}),E=I.createCommandEncoder(),x=E.beginComputePass();x.setPipeline(l),x.setBindGroup(0,y),x.dispatchWorkgroups(Math.ceil(i/16),Math.ceil(s/16),1),x.end();const k=I.createBuffer({size:i*s*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});E.copyBufferToBuffer(c,0,k,0,i*s*4*4),I.queue.submit([E.finish()]),k.mapAsync(GPUMapMode.READ).then(()=>{const O=new Float32Array(k.getMappedRange().slice(0));k.unmap(),k.destroy();const F=f.createImageData(i,s);for(let X=0;X<i*s*4;X++)F.data[X]=Math.round(O[X]*255);f.putImageData(F,0,0),pt++,g++;const R=performance.now();R-d>=1e3&&(m=Math.round(g*1e3/(R-d)),r.textContent=`${m} FPS | Frame ${pt} | ${i}×${s}`,g=0,d=R),ft=requestAnimationFrame(b)})}b()}function tr(){ft!==null&&(cancelAnimationFrame(ft),ft=null),I&&(I.destroy(),I=null)}function _n(e){e.innerHTML=`
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
  `,Ze=e.querySelector("#video-log");const t=e.querySelector("#video-canvas"),r=e.querySelector("#video-status"),n=e.querySelector("#video-fps"),a=e.querySelector("#res-select"),o=e.querySelector("#mode-select");e.querySelector("#btn-start").addEventListener("click",()=>{tr(),pt=0,Rt=parseInt(o.value),Nt(`Starting GPU compute video: ${a.value} mode=${o.value}`,"info"),Rn(t,r,n,a,o)}),e.querySelector("#btn-stop").addEventListener("click",()=>{tr(),r.textContent="STOPPED",r.className="badge badge-info",Nt("Rendering stopped","warn")})}const Ln=Object.freeze(Object.defineProperty({__proto__:null,render:_n},Symbol.toStringTag,{value:"Module"}));let Fe=null;function $(e,t=""){if(!Fe)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Fe.appendChild(r),Fe.scrollTop=Fe.scrollHeight}async function Fn(){if(Fe.innerHTML="",$("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),$(`Timestamp: ${new Date().toISOString()}`,""),!await In())return;const t=await Pe();if(!t){$("Cannot proceed: GPU not ready","err");return}$("",""),$("── MEMORY TEST ──","info");const r=await $e(t);Ue(r);const n=Math.floor(t.limits.maxBufferSize/1048576);$(`Attempting to allocate buffer at reported max: ${n} MB`,"");try{const a=r.createBuffer({size:t.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});$("Buffer allocation at max: SUCCESS","ok"),a.destroy()}catch(a){$(`Buffer allocation at max: FAILED — ${a.message}`,"warn");for(const o of[256,128,64,32])try{const i=r.createBuffer({size:o*1048576,usage:GPUBufferUsage.STORAGE});$(`Largest successful allocation: ${o} MB`,"ok"),i.destroy();break}catch{continue}}$("",""),$("── COMPUTE THROUGHPUT ──","info");for(const a of[64,128,256]){const o=T.fromData(r,new Float32Array(a*a).fill(1),[a,a]),i=T.fromData(r,new Float32Array(a*a).fill(1),[a,a]),s=new T(r,[a,a]),u=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),l=r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:r.createShaderModule({code:gt}),entryPoint:"main"}}),c=await je(`matmul ${a}×${a}`,async()=>{const f=r.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=new ArrayBuffer(12);new Uint32Array(p).set([a,a,a]),r.queue.writeBuffer(f,0,p);const d=r.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:i.buffer}},{binding:3,resource:{buffer:s.buffer}}]}),m=r.createCommandEncoder(),g=m.beginComputePass();g.setPipeline(l),g.setBindGroup(0,d);const b=Math.ceil(a/16);g.dispatchWorkgroups(b,b,1),g.end(),r.queue.submit([m.finish()]),f.destroy()},30,2*a*a*a);$(Ve(c),"ok"),o.destroy(),i.destroy(),s.destroy()}r.destroy(),$("",""),$("═══ DIAGNOSTICS COMPLETE ═══","info")}async function In(){const e=await Mt();return Nr(e),$("── WEBGPU STATUS ──","info"),$(`${e.statusLabel} (Case ${e.case})`,e.ready?"ok":"err"),$(`Reason: ${e.reason}`,""),$(`Recommendation: ${e.recommendation}`,""),$("",""),$("── ENVIRONMENT ──","info"),$(`  URL: ${e.environment.url}`,""),$(`  Secure Context: ${e.environment.isSecureContext}`,e.environment.isSecureContext?"ok":"err"),$(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`,""),$(`  OS: ${e.environment.osName} ${e.environment.osVersion}`,""),$(`  iOS: ${e.environment.isIOS}`,""),$(`  Safari: ${e.environment.isSafari}`,""),$(`  WebView: ${e.environment.isWebView}`,e.environment.isWebView?"err":""),$(`  navigator.gpu: ${e.gpu.navigatorGpuExists}`,e.gpu.navigatorGpuExists?"ok":"err"),e.gpu.adapterName&&($(`  Adapter: ${e.gpu.adapterName}`,"ok"),$(`  Vendor: ${e.gpu.adapterVendor}`,"")),e.gpu.adapterError&&$(`  Adapter Error: ${e.gpu.adapterError}`,"err"),e.gpu.deviceError&&$(`  Device Error: ${e.gpu.deviceError}`,"err"),e.ready?!0:($("",""),$("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function zn(e){e.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,Fe=e.querySelector("#diag-log"),e.querySelector("#btn-diag").addEventListener("click",()=>{Fn()})}const Wn=Object.freeze(Object.defineProperty({__proto__:null,render:zn},Symbol.toStringTag,{value:"Module"}));class he{dims;ndim;size;strides;constructor(t){this.dims=typeof t=="number"?[t]:[...t],this.ndim=this.dims.length,this.size=this.dims.reduce((a,o)=>a*o,1);const r=new Array(this.ndim);let n=1;for(let a=this.ndim-1;a>=0;a--)r[a]=n,n*=this.dims[a];this.strides=r}equals(t){if(this.ndim!==t.ndim)return!1;for(let r=0;r<this.ndim;r++)if(this.dims[r]!==t.dims[r])return!1;return!0}isContiguous(){let t=1;for(let r=this.ndim-1;r>=0;r--){if(this.strides[r]!==t)return!1;t*=this.dims[r]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new he([1])}static from(...t){return new he(t)}}var ce=(e=>(e.Float32="f32",e.Float16="f16",e.Int32="i32",e.Int8="i8",e.Uint8="u8",e))(ce||{});const qn={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function Fr(e){return qn[e].bytes}let ne=null;async function Hn(){if(ne)return ne;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.limits,r=new Set(e.features),n=await e.requestDevice({requiredLimits:{}});return n.lost.then(a=>{console.error("WebGPU device lost:",a.message),ne=null}),ne={adapter:e,device:n,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:t.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:t.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:t.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:t.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:t.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:t.maxTextureArrayLayers},features:r},ne}function _(){if(!ne)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return ne}function jn(){ne&&(ne.device.destroy(),ne=null)}class Ie{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(t,r,n){this.shape=t,this.dtype=r,this.byteSize=t.size*Fr(r),this.gpuBuffer=n??_().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(t,r,n=ce.Float32){const a=_(),o=new Ie(t,n);return a.device.queue.writeBuffer(o.gpuBuffer,0,r.buffer,r.byteOffset,r.byteLength),o}async readback(){const t=_(),r=t.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),n=t.device.createCommandEncoder();n.copyBufferToBuffer(this.gpuBuffer,0,r,0,this.byteSize),t.device.queue.submit([n.finish()]),await r.mapAsync(GPUMapMode.READ);const a=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),a}destroy(){this.gpuBuffer.destroy()}}class A{shape;dtype;buffer;constructor(t,r=ce.Float32,n){this.shape=t,this.dtype=r,this.buffer=n??new Ie(t,r)}static fromFloat32(t,r){const n=t instanceof Float32Array?t:new Float32Array(t),a=new he(r);return new A(a,ce.Float32,Ie.fromData(a,n,ce.Float32))}static fromInt32(t,r){const n=t instanceof Int32Array?t:new Int32Array(t),a=new he(r);return new A(a,ce.Int32,Ie.fromData(a,n,ce.Int32))}static zeros(t,r=ce.Float32){const n=new he(t),a=n.size*Fr(r),i=_().device.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(i.getMappedRange()).fill(0),i.unmap();const s=new Ie(n,r,i);return new A(n,r,s)}static ones(t,r=ce.Float32){const n=new he(t).size,a=new Float32Array(n).fill(1);return A.fromFloat32(a,t)}static randn(t){const r=new he(t).size,n=new Float32Array(r);for(let a=0;a<r;a++){const o=Math.random(),i=Math.random();n[a]=Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*i)}return A.fromFloat32(n,t)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class Vn{cache=new Map;getOrCreate(t,r,n){if(this.cache.has(t))return this.cache.get(t);const a=_(),o=a.device.createComputePipeline({layout:a.device.createPipelineLayout({bindGroupLayouts:[n]}),compute:{module:a.device.createShaderModule({code:r}),entryPoint:"main"}});return this.cache.set(t,o),o}get(t){return this.cache.get(t)}clear(){this.cache.clear()}}const Kn=`
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
`,Yn=`
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
`,Qn=`
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
`,Xn=`
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
`,Zn=`
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
`,Jn=`
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
`,ea=`
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
`,ta=`
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
`,ra=`
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
`,na=`
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
`;function aa(e,t,r,n,a){const o=new Float32Array(r*n);for(let i=0;i<r;i++)for(let s=0;s<n;s++){let u=0;for(let l=0;l<a;l++)u+=e[i*a+l]*t[l*n+s];o[i*n+s]=u}return o}function oa(e,t){const r=new Float32Array(e.length);for(let n=0;n<e.length;n++)r[n]=e[n]+t[n];return r}function sa(e,t){const r=new Float32Array(e.length);for(let n=0;n<e.length;n++)r[n]=e[n]*t[n];return r}function ia(e,t,r=1e-6){const n=e.length;let a=0;for(let s=0;s<n;s++)a+=e[s]*e[s];const o=Math.sqrt(a/n+r),i=new Float32Array(n);for(let s=0;s<n;s++)i[s]=e[s]/o*t[s];return i}function ua(e,t,r,n=1e-6){const a=e.length;let o=0;for(let l=0;l<a;l++)o+=e[l];o/=a;let i=0;for(let l=0;l<a;l++){const c=e[l]-o;i+=c*c}i/=a;const s=1/Math.sqrt(i+n),u=new Float32Array(a);for(let l=0;l<a;l++)u[l]=(e[l]-o)*s*t[l]+r[l];return u}function ca(e,t,r){const n=new Float32Array(e.length);for(let a=0;a<t;a++){const o=a*r;let i=-1e30;for(let u=0;u<r;u++)e[o+u]>i&&(i=e[o+u]);let s=0;for(let u=0;u<r;u++)n[o+u]=Math.exp(e[o+u]-i),s+=n[o+u];for(let u=0;u<r;u++)n[o+u]/=s}return n}function la(e,t,r,n=1e4){const a=new Float32Array(e.length);a.set(e);for(let o=0;o<t*r/2;o++){const i=Math.floor(o/(r/2)),s=o%(r/2),u=1/Math.pow(n,s/r),l=i*u,c=Math.cos(l),f=Math.sin(l),p=o*2,d=o*2+1,m=a[p],g=a[d];a[p]=m*c-g*f,a[d]=m*f+g*c}return a}function da(e,t,r,n,a,o,i,s,u){const l=a-s+1,c=o-u+1,f=new Float32Array(r*i*l*c);for(let p=0;p<r;p++)for(let d=0;d<i;d++)for(let m=0;m<l;m++)for(let g=0;g<c;g++){let b=0;for(let v=0;v<n;v++)for(let h=0;h<s;h++)for(let y=0;y<u;y++)b+=e[((p*n+v)*a+m+h)*o+g+y]*t[((d*n+v)*s+h)*u+y];f[((p*i+d)*l+m)*c+g]=b}return f}function fa(e,t,r){const n=new Float32Array(t*r);for(let a=0;a<t;a++)for(let o=0;o<r;o++)n[o*t+a]=e[a*r+o];return n}function pa(e,t,r,n,a,o){const i=new Float32Array(n*a*o);for(let s=0;s<a;s++)for(let u=0;u<n;u++){const l=u*t/n,c=s*r/a,f=Math.floor(l),p=Math.floor(c),d=Math.min(f+1,t-1),m=Math.min(p+1,r-1),g=l-f,b=c-p;for(let v=0;v<o;v++){const h=e[(p*t+f)*o+v],y=e[(p*t+d)*o+v],E=e[(m*t+f)*o+v],x=e[(m*t+d)*o+v];i[(s*n+u)*o+v]=h*(1-g)*(1-b)+y*g*(1-b)+E*(1-g)*b+x*g*b}}return i}const se=new Vn;function pe(e){return _().device.createBindGroupLayout({entries:Array.from({length:e},(r,n)=>({binding:n,visibility:GPUShaderStage.COMPUTE,buffer:n===0?{type:"uniform"}:{type:"storage"}}))})}function Et(e){const t=_(),r=t.device.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.device.queue.writeBuffer(r,0,e),r}function Ge(e,t,r,n,a,o){const i=_(),s=Et(a),u=[{binding:0,resource:{buffer:s}},...n.map((f,p)=>({binding:p+1,resource:{buffer:f.buffer.gpuBuffer}}))],l=i.device.createBindGroup({layout:r,entries:u}),c=e.beginComputePass();return c.setPipeline(t),c.setBindGroup(0,l),c.dispatchWorkgroups(o),c.end(),s}async function Re(e,t,r,n,a){const o=_(),i=A.zeros([r,n]),s=pe(4),u=se.getOrCreate("matmul",Kn,s),l=new ArrayBuffer(12),c=new Uint32Array(l);c[0]=r,c[1]=n,c[2]=a;const f=o.device.createCommandEncoder();return Ge(f,u,s,[e,t,i],l,Math.ceil(r/16)*Math.ceil(n/16)),o.device.queue.submit([f.finish()]),i}function _e(e,t,r,n,a){return aa(e,t,r,n,a)}async function rr(e,t){const r=_(),n=A.zeros([e.shape.size]),a=pe(4),o=se.getOrCreate("add",Yn,a),i=new ArrayBuffer(4);new Uint32Array(i)[0]=e.shape.size;const s=r.device.createCommandEncoder();return Ge(s,o,a,[e,t,n],i,Math.ceil(e.shape.size/256)),r.device.queue.submit([s.finish()]),n}function nr(e,t){return oa(e,t)}async function ar(e,t){const r=_(),n=A.zeros([e.shape.size]),a=pe(4),o=se.getOrCreate("multiply",Qn,a),i=new ArrayBuffer(4);new Uint32Array(i)[0]=e.shape.size;const s=r.device.createCommandEncoder();return Ge(s,o,a,[e,t,n],i,Math.ceil(e.shape.size/256)),r.device.queue.submit([s.finish()]),n}function or(e,t){return sa(e,t)}async function sr(e,t,r=1e-6){const n=_(),a=e.shape.size,o=A.zeros([a]),i=pe(4),s=se.getOrCreate("rms_norm",Xn,i),u=new ArrayBuffer(8);new Uint32Array(u)[0]=a,new Float32Array(u)[1]=r;const l=n.device.createCommandEncoder();return Ge(l,s,i,[e,t,o],u,1),n.device.queue.submit([l.finish()]),o}function ir(e,t,r=1e-6){return ia(e,t,r)}async function ur(e,t,r,n=1e-6){const a=_(),o=e.shape.size,i=A.zeros([o]),s=a.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=se.getOrCreate("layer_norm",Zn,s),l=new ArrayBuffer(8);new Uint32Array(l)[0]=o,new Float32Array(l)[1]=n;const c=_(),f=Et(l),p=c.device.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:e.buffer.gpuBuffer}},{binding:2,resource:{buffer:t.buffer.gpuBuffer}},{binding:3,resource:{buffer:r.buffer.gpuBuffer}},{binding:4,resource:{buffer:i.buffer.gpuBuffer}}]}),d=c.device.createCommandEncoder(),m=d.beginComputePass();return m.setPipeline(u),m.setBindGroup(0,p),m.dispatchWorkgroups(1),m.end(),c.device.queue.submit([d.finish()]),i}function cr(e,t,r,n=1e-6){return ua(e,t,r,n)}async function lr(e,t,r){const n=_(),a=A.zeros([t,r]),o=n.device.createCommandEncoder();o.copyBufferToBuffer(e.buffer.gpuBuffer,0,a.buffer.gpuBuffer,0,t*r*4);const i=pe(2),s=se.getOrCreate("softmax",Jn,i),u=new ArrayBuffer(8);new Uint32Array(u)[0]=t,new Uint32Array(u)[1]=r;const l=Et(u),c=n.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:a.buffer.gpuBuffer}}]}),f=o.beginComputePass();return f.setPipeline(s),f.setBindGroup(0,c),f.dispatchWorkgroups(Math.ceil(t)),f.end(),n.device.queue.submit([o.finish()]),a}function dr(e,t,r){return ca(e,t,r)}async function fr(e,t,r,n=1e4){const a=_(),o=A.zeros([t,r]),i=a.device.createCommandEncoder();i.copyBufferToBuffer(e.buffer.gpuBuffer,0,o.buffer.gpuBuffer,0,t*r*4);const s=pe(2),u=se.getOrCreate("rope",ea,s),l=new ArrayBuffer(12);new Uint32Array(l)[0]=t,new Uint32Array(l)[1]=r,new Float32Array(l)[2]=n;const c=Et(l),f=a.device.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:o.buffer.gpuBuffer}}]}),p=i.beginComputePass();return p.setPipeline(u),p.setBindGroup(0,f),p.dispatchWorkgroups(Math.ceil(t*r/2/256)),p.end(),a.device.queue.submit([i.finish()]),o}function pr(e,t,r,n=1e4){return la(e,t,r,n)}async function mr(e,t,r,n,a,o,i,s,u){const l=_(),c=a-s+1,f=o-u+1,p=A.zeros([r,i,c,f]),d=pe(4),m=se.getOrCreate("conv2d",ta,d),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=r,b[1]=n,b[2]=a,b[3]=o,b[4]=i,b[5]=s,b[6]=u,b[7]=c,b[8]=f;const v=l.device.createCommandEncoder();return Ge(v,m,d,[e,t,p],g,r*i),l.device.queue.submit([v.finish()]),p}function gr(e,t,r,n,a,o,i,s,u){return da(e,t,r,n,a,o,i,s,u)}async function br(e,t,r){const n=_(),a=A.zeros([r,t]),o=pe(3),i=se.getOrCreate("transpose_2d",ra,o),s=new ArrayBuffer(8);new Uint32Array(s)[0]=t,new Uint32Array(s)[1]=r;const u=n.device.createCommandEncoder();return Ge(u,i,o,[e,a],s,Math.ceil(t/16)*Math.ceil(r/16)),n.device.queue.submit([u.finish()]),a}function vr(e,t,r){return fa(e,t,r)}async function yr(e,t,r,n,a,o){const i=_(),s=A.zeros([a*n*o]),u=pe(3),l=se.getOrCreate("interpolate_bilinear",na,u),c=new ArrayBuffer(20),f=new Uint32Array(c);f[0]=t,f[1]=r,f[2]=n,f[3]=a,f[4]=o;const p=i.device.createCommandEncoder();return Ge(p,l,u,[e,s],c,Math.ceil(n/16)*Math.ceil(a/16)),i.device.queue.submit([p.finish()]),s}function hr(e,t,r,n,a,o){return pa(e,t,r,n,a,o)}let ze=null,bt=null;function J(e,t=""){if(!ze)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,ze.appendChild(r),ze.scrollTop=ze.scrollHeight}function j(e,t,r=.001){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++){const a=Math.abs(e[n]-t[n]),o=Math.max(Math.abs(e[n]),Math.abs(t[n]),1e-8);if(a/o>r)return!1}return!0}async function V(e,t,r=20){for(let a=0;a<3;a++)t();const n=[];for(let a=0;a<r;a++){const o=performance.now();t(),n.push(performance.now()-o)}return n.reduce((a,o)=>a+o,0)/n.length}async function K(e,t,r=20){const n=[];for(let a=0;a<Math.min(5,r);a++)await t();for(let a=0;a<r;a++){const o=performance.now();await t(),n.push(performance.now()-o)}return n.reduce((a,o)=>a+o,0)/n.length}function ma(e){if(!bt)return;const t=document.createElement("tr");t.innerHTML=`
    <td style="font-weight:600">${e.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${e.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${e.speedup>=1?"var(--green)":"var(--red)"}">
      ${e.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${e.correct?"badge-pass":"badge-fail"}">${e.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${e.tolerance.toExponential(1)}</td>
  `,bt.appendChild(t)}async function ga(){ze.innerHTML="",bt.innerHTML="",J("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),J("Initializing WebGPU...","");let e;try{e=await Hn()}catch(n){J(`FATAL: ${n.message}`,"err"),J("WebGPU is not available. Cannot run GPU benchmarks.","err");return}J(`GPU: ${e.adapter.name??"Unknown"}`,"ok"),J(`Running benchmarks...
`,"");const t=[];{const i=A.randn([64,64]),s=A.randn([64,64]),u=await i.readback(),l=await s.readback(),c=await V("matmul 64",()=>_e(u,l,64,64,64)),f=await K("matmul 64",async()=>{(await Re(i,s,64,64,64)).destroy()}),p=await(await Re(i,s,64,64,64)).readback(),d=_e(u,l,64,64,64),m=j(d,p),g=Math.max(...Array.from(d).map((b,v)=>Math.abs(b-p[v])));t.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:c,gpuMs:f,speedup:c/f,correct:m,tolerance:g}),i.destroy(),s.destroy()}{const i=A.randn([256,256]),s=A.randn([256,256]),u=await i.readback(),l=await s.readback(),c=await V("matmul 256",()=>_e(u,l,256,256,256),10),f=await K("matmul 256",async()=>{(await Re(i,s,256,256,256)).destroy()}),p=await(await Re(i,s,256,256,256)).readback(),d=_e(u,l,256,256,256),m=j(d,p),g=Math.max(...Array.from(d).map((b,v)=>Math.abs(b-p[v])));t.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:c,gpuMs:f,speedup:c/f,correct:m,tolerance:g}),i.destroy(),s.destroy()}{const i=A.randn([512,512]),s=A.randn([512,512]),u=await i.readback(),l=await s.readback(),c=await V("matmul 512",()=>_e(u,l,512,512,512),5),f=await K("matmul 512",async()=>{(await Re(i,s,512,512,512)).destroy()}),p=await(await Re(i,s,512,512,512)).readback(),d=_e(u,l,512,512,512),m=j(d,p),g=Math.max(...Array.from(d).map((b,v)=>Math.abs(b-p[v])));t.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:c,gpuMs:f,speedup:c/f,correct:m,tolerance:g}),i.destroy(),s.destroy()}{const a=A.randn([1e6]),o=A.randn([1e6]),i=await a.readback(),s=await o.readback(),u=await V("add 1M",()=>nr(i,s)),l=await K("add 1M",async()=>{(await rr(a,o)).destroy()}),c=await(await rr(a,o)).readback(),f=nr(i,s),p=j(f,c),d=Math.max(...Array.from(f).map((m,g)=>Math.abs(m-c[g])));t.push({name:"Add",shape:"[1000000]",cpuMs:u,gpuMs:l,speedup:u/l,correct:p,tolerance:d}),a.destroy(),o.destroy()}{const a=A.randn([1e6]),o=A.randn([1e6]),i=await a.readback(),s=await o.readback(),u=await V("mul 1M",()=>or(i,s)),l=await K("mul 1M",async()=>{(await ar(a,o)).destroy()}),c=await(await ar(a,o)).readback(),f=or(i,s),p=j(f,c),d=Math.max(...Array.from(f).map((m,g)=>Math.abs(m-c[g])));t.push({name:"Multiply",shape:"[1000000]",cpuMs:u,gpuMs:l,speedup:u/l,correct:p,tolerance:d}),a.destroy(),o.destroy()}{const a=A.randn([1024]),o=A.ones([1024]),i=await a.readback(),s=await o.readback(),u=await V("rmsnorm",()=>ir(i,s)),l=await K("rmsnorm",async()=>{(await sr(a,o)).destroy()}),c=await(await sr(a,o)).readback(),f=ir(i,s),p=j(f,c),d=Math.max(...Array.from(f).map((m,g)=>Math.abs(m-c[g])));t.push({name:"RMSNorm",shape:"[1024]",cpuMs:u,gpuMs:l,speedup:u/l,correct:p,tolerance:d}),a.destroy(),o.destroy()}{const a=A.randn([1024]),o=A.ones([1024]),i=A.zeros([1024]),s=await a.readback(),u=await o.readback(),l=await i.readback(),c=await V("layernorm",()=>cr(s,u,l)),f=await K("layernorm",async()=>{(await ur(a,o,i)).destroy()}),p=await(await ur(a,o,i)).readback(),d=cr(s,u,l),m=j(d,p),g=Math.max(...Array.from(d).map((b,v)=>Math.abs(b-p[v])));t.push({name:"LayerNorm",shape:"[1024]",cpuMs:c,gpuMs:f,speedup:c/f,correct:m,tolerance:g}),a.destroy(),o.destroy(),i.destroy()}{const o=A.randn([32,128]),i=await o.readback(),s=await V("softmax",()=>dr(new Float32Array(i),32,128)),u=await K("softmax",async()=>{(await lr(A.fromFloat32(new Float32Array(i),[32,128]),32,128)).destroy()}),l=await(await lr(A.fromFloat32(new Float32Array(i),[32,128]),32,128)).readback(),c=dr(new Float32Array(i),32,128),f=j(c,l),p=Math.max(...Array.from(c).map((d,m)=>Math.abs(d-l[m])));t.push({name:"Softmax",shape:"[32, 128]",cpuMs:s,gpuMs:u,speedup:s/u,correct:f,tolerance:p}),o.destroy()}{const o=A.randn([16,128]),i=await o.readback(),s=await V("rope",()=>pr(new Float32Array(i),16,128)),u=await K("rope",async()=>{(await fr(A.fromFloat32(new Float32Array(i),[16,128]),16,128)).destroy()}),l=await(await fr(A.fromFloat32(new Float32Array(i),[16,128]),16,128)).readback(),c=pr(new Float32Array(i),16,128),f=j(c,l),p=Math.max(...Array.from(c).map((d,m)=>Math.abs(d-l[m])));t.push({name:"RoPE",shape:"[16, 128]",cpuMs:s,gpuMs:u,speedup:s/u,correct:f,tolerance:p}),o.destroy()}{const c=A.randn([1,3,16,16]),f=A.randn([4,3,3,3]),p=await c.readback(),d=await f.readback(),m=await V("conv2d",()=>gr(p,d,1,3,16,16,4,3,3)),g=await K("conv2d",async()=>{(await mr(c,f,1,3,16,16,4,3,3)).destroy()}),b=await(await mr(c,f,1,3,16,16,4,3,3)).readback(),v=gr(p,d,1,3,16,16,4,3,3),h=j(v,b),y=Math.max(...Array.from(v).map((E,x)=>Math.abs(E-b[x])));t.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:m,gpuMs:g,speedup:m/g,correct:h,tolerance:y}),c.destroy(),f.destroy()}{const o=A.randn([256,256]),i=await o.readback(),s=await V("transpose",()=>vr(i,256,256)),u=await K("transpose",async()=>{(await br(o,256,256)).destroy()}),l=await(await br(o,256,256)).readback(),c=vr(i,256,256),f=j(c,l),p=Math.max(...Array.from(c).map((d,m)=>Math.abs(d-l[m])));t.push({name:"Transpose",shape:"[256, 256]",cpuMs:s,gpuMs:u,speedup:s/u,correct:f,tolerance:p}),o.destroy()}{const u=A.randn([3072]),l=await u.readback(),c=await V("interp",()=>hr(l,32,32,64,64,3)),f=await K("interp",async()=>{(await yr(u,32,32,64,64,3)).destroy()}),p=await(await yr(u,32,32,64,64,3)).readback(),d=hr(l,32,32,64,64,3),m=j(d,p),g=Math.max(...Array.from(d).map((b,v)=>Math.abs(b-p[v])));t.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:c,gpuMs:f,speedup:c/f,correct:m,tolerance:g}),u.destroy()}J("",""),J("═══ RESULTS ═══","info");for(const n of t){ma(n);const a=n.correct?"✓":"✗",o=n.correct?"ok":"err";J(`${a} ${n.name} (${n.shape}): CPU ${n.cpuMs.toFixed(2)} ms | GPU ${n.gpuMs.toFixed(2)} ms | ${n.speedup.toFixed(1)}× | max diff ${n.tolerance.toExponential(1)}`,o)}const r=t.filter(n=>n.correct).length;J("",""),J(`═══ ${r}/${t.length} CORRECT ═══`,r===t.length?"ok":"err"),jn()}function ba(e){e.innerHTML=`
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
  `,ze=e.querySelector("#bench-log"),bt=e.querySelector("#bench-tbody"),e.querySelector("#btn-run-bench").addEventListener("click",()=>{ga()})}const va=Object.freeze(Object.defineProperty({__proto__:null,render:ba},Symbol.toStringTag,{value:"Module"}));let be=null,ct="";function ya(e){const t=e.environment,r=e.gpu,n=e.case==="D"?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)";let a=`
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
    `),r.adapterError&&(a+=`<div class="row"><span class="row-label">Adapter Error</span><span class="row-value" style="color:var(--red)">${r.adapterError}</span></div>`),r.deviceError&&(a+=`<div class="row"><span class="row-label">Device Error</span><span class="row-value" style="color:var(--red)">${r.deviceError}</span></div>`),a+="</div>",r.limits){const o=r.limits,i=s=>s>=1073741824?`${(s/1073741824).toFixed(1)} GB`:s>=1048576?`${(s/1048576).toFixed(1)} MB`:s>=1024?`${(s/1024).toFixed(1)} KB`:`${s} B`;a+=`
      <h3>GPU Limits</h3>
      <div class="card">
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${i(o.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${o.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${o.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${o.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${i(o.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${i(o.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${i(o.maxComputeWorkgroupStorageSize)}</span></div>
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
  `,a}function ha(e){e.innerHTML=`
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;const t=e.querySelector("#wgdiag-result");be=e.querySelector("#btn-copy-report"),e.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{t.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',be.disabled=!0;const r=await Mt();ct=Nr(r),t.innerHTML=ya(r),be.disabled=!1}),be.addEventListener("click",async()=>{if(ct)try{await navigator.clipboard.writeText(ct),be.textContent="Copied!",setTimeout(()=>{be.textContent="Copy Diagnostics"},2e3)}catch{const r=document.createElement("textarea");r.value=ct,document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),be.textContent="Copied!",setTimeout(()=>{be.textContent="Copy Diagnostics"},2e3)}}),e.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const wa=Object.freeze(Object.defineProperty({__proto__:null,render:ha},Symbol.toStringTag,{value:"Module"})),xa=typeof GPUShaderStage<"u"?GPUShaderStage.COMPUTE:4;function Sa(e,t=xa){return e.map((r,n)=>({binding:n,visibility:t,buffer:{type:r}}))}function Ht(e,t){return e.createBindGroupLayout({entries:Sa(t)})}function Ma(e,t,r="bind group"){if(e.length!==t.length)throw new Error(`${r} binding count mismatch: pipeline layout declares ${e.length} bindings but ${t.length} entries were provided.`)}const wr=new WeakMap,_t=new WeakMap,Lt=new WeakMap,Ir=new WeakSet;let Ea=1;function At(e){let t=wr.get(e);return t===void 0&&(t=Ea++,wr.set(e,t)),t}function Aa(e,t){_t.set(e,At(t))}function Pa(e){return _t.has(e)?_t.get(e):null}function $a(e,t){Lt.set(e,At(t))}function Ua(e){return Lt.has(e)?Lt.get(e):null}function Ca(e){Ir.add(e)}function Ba(e){return Ir.has(e)}let Je=null,Be=null,vt=null,Ft=null;async function Oe(){if(Be&&!Je&&(Be=null),Be)return Be;if(!navigator.gpu)throw new Error("WebGPU not supported");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.features.has("timestamp-query"),r=await e.requestDevice({requiredFeatures:t?["timestamp-query"]:[],requiredLimits:{}});vt=null,Ft=null,r.lost.then(i=>{console.error("Benchmark device lost:",i.reason,i.message),Ca(r),vt=i.reason??"unknown",Ft=i.message??"",Je=null,Be=null}),Je=r;let n=null;try{n=navigator.gpu.getPreferredCanvasFormat()}catch{}const a=e.limits,o=[];for(const i of e.features)o.push(i);return Be={webgpuAvailable:!0,adapterName:e.name??"Unknown",adapterVendor:e.vendor??"Unknown",adapterDevice:e.device??"Unknown",adapterFeatures:o,adapterLimits:{maxBufferSize:a.maxBufferSize,maxTextureDimension1D:a.maxTextureDimension1D,maxTextureDimension2D:a.maxTextureDimension2D,maxTextureDimension3D:a.maxTextureDimension3D,maxComputeWorkgroupStorageSize:a.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:a.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:a.maxStorageBufferBindingSize,maxUniformBufferBindingSize:a.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:a.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:a.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:a.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:a.maxComputeWorkgroupsPerDimension,maxColorAttachments:a.maxColorAttachments,minStorageBufferOffsetAlignment:a.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:a.minUniformBufferOffsetAlignment},preferredCanvasFormat:n,maxBufferSize:a.maxBufferSize,maxStorageBufferBindingSize:a.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:a.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:a.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:a.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:a.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:a.maxComputeWorkgroupsPerDimension,timestampQuerySupport:t,isFallbackAdapter:e.isFallbackAdapter??!1},Be}function C(){if(!Je)throw new Error("Benchmark not initialized. Call initBenchmark() first.");return Je}function Ta(){return{reason:vt,message:Ft}}function oe(){return vt!==null}async function ka(e,t,r){e.pushErrorScope("validation"),e.pushErrorScope("out-of-memory"),e.pushErrorScope("internal");try{const n=await r(),o=(await Promise.all([e.popErrorScope(),e.popErrorScope(),e.popErrorScope()])).find(i=>i!==null);return{result:n,error:o?o.message:null}}catch(n){return await e.popErrorScope(),await e.popErrorScope(),await e.popErrorScope(),{result:null,error:n.message}}}function W(e){const t=C(),r=t.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(r,0,e),r}function M(e,t){const r=C(),n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(t){const a=r.createBuffer({size:Math.max(e,t.byteLength),usage:n,mappedAtCreation:!0});return new Float32Array(a.getMappedRange()).set(t),a.unmap(),a}return r.createBuffer({size:e,usage:n})}function Da(e){return C().createBuffer({size:e,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})}async function N(e,t){const r=C(),n=Da(t),a=r.createCommandEncoder();a.copyBufferToBuffer(e,0,n,0,t),r.queue.submit([a.finish()]),await n.mapAsync(GPUMapMode.READ);const o=new Float32Array(n.getMappedRange().slice(0));return n.unmap(),n.destroy(),o}function q(e,t,r){const n=C();if(t.length===0)throw new Error("createPipeline: bindingTypes must be non-empty (uniform / read-only-storage / storage)");const a=Ht(n,t),o=n.createShaderModule({code:e}),i=n.createComputePipeline({layout:n.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:o,entryPoint:"main"}});Aa(i,n);const s=u=>r?.({bindingTypes:t,compilationMessages:u,pipelineLayoutInspected:!0});return typeof o.getCompilationInfo=="function"&&o.getCompilationInfo().then(u=>s(u.messages)).catch(()=>s([])),i}function z(e,t,r){const n=C();Ma(t,r,"createBindGroupForPipeline");const a=e.getBindGroupLayout(0),o=n.createBindGroup({layout:a,entries:r});return $a(o,n),o}const We=`
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
`,rt=`
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
`,zr=`
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
`,jt=`
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
`,Wr=`
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
`,qr=`
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
`,Oa=["uniform","read-only-storage","read-only-storage","storage"],Vt=["uniform","read-only-storage","read-only-storage","storage"],Ga=["uniform","read-only-storage","read-only-storage","storage"],Na=["uniform","read-only-storage","storage"],Ra=["uniform","read-only-storage","read-only-storage","storage"],_a=["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"];function La(e,t){try{return e.pushErrorScope(t),!0}catch{return!1}}async function Ut(e,t){let r=null;for(let n=0;n<t;n++)try{const a=await e.popErrorScope();a&&!r&&(r=a)}catch{}return r}function Fa(e,t){let r;const n=new Promise((a,o)=>{r=window.setTimeout(()=>o(new Error(`GPU operation timed out after ${t}ms`)),t)});return Promise.race([e,n]).finally(()=>{r!==void 0&&window.clearTimeout(r)})}async function Ia(e,t){const r=At(e),n=Pa(t.pipeline),a=Ua(t.bindGroup);if(Ba(e))return{pass:!1,error:"DEVICE LOST — refusing to execute a pipeline on a lost device.",stage:"encode",errorType:"device-lost",mismatch:!1,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a};if(n!==null&&n!==r)return{pass:!1,error:`PIPELINE DEVICE MISMATCH — pipeline device: ${n}, execution device: ${r}. The pipeline was created by a different GPUDevice; refusing to call setPipeline().`,stage:"set-pipeline",errorType:"device-mismatch",mismatch:!0,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a};const o=["validation","out-of-memory","internal"];let i=0;for(const u of o)La(e,u)&&i++;let s="encode";try{const u=e.createBuffer({size:t.outputBytes,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});s="encode";const l=e.createCommandEncoder(),c=l.beginComputePass();if(s="set-pipeline",c.setPipeline(t.pipeline),a!==null&&a!==r)return await Ut(e,i),{pass:!1,error:`BIND GROUP DEVICE MISMATCH — bind group device: ${a}, execution device: ${r}. The bind group was created by a different GPUDevice; refusing to call setBindGroup().`,stage:"set-bind-group",errorType:"device-mismatch",mismatch:!0,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a};a===null&&console.warn(`[gpu-test] ${t.name}: bind group identity unavailable — continuing (not fabricated).`),s="set-bind-group",c.setBindGroup(0,t.bindGroup),s="dispatch",c.dispatchWorkgroups(...t.workgroups),c.end(),s="submit",l.copyBufferToBuffer(t.outputBuffer,0,u,0,t.outputBytes),e.queue.submit([l.finish()]),s="readback",await Fa(u.mapAsync(GPUMapMode.READ),15e3);const f=new Float32Array(u.getMappedRange().slice(0));u.unmap(),u.destroy();const p=await Ut(e,i);if(p)return{pass:!1,error:`GPU Error: ${p.message}`,stage:"submit",errorType:p.type??null,mismatch:!1,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a};s="validation";const d=t.validator(f);return{pass:d.pass,error:d.pass?null:d.error,stage:d.pass?"complete":"validation",errorType:d.pass?null:"output-mismatch",mismatch:!1,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a}}catch(u){return await Ut(e,i),{pass:!1,error:u.message,stage:s,errorType:"exception",mismatch:!1,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a}}}function Hr(e,t){const r=new Float32Array(e.length);for(let n=0;n<e.length;n++)r[n]=e[n]+t[n];return r}function jr(e,t,r,n,a){const o=new Float32Array(r*n);for(let i=0;i<r;i++)for(let s=0;s<n;s++){let u=0;for(let l=0;l<a;l++)u+=e[i*a+l]*t[l*n+s];o[i*n+s]=u}return o}function Vr(e,t,r,n,a,o,i,s,u){const l=a-s+1,c=o-u+1,f=new Float32Array(r*i*l*c);for(let p=0;p<r;p++)for(let d=0;d<i;d++)for(let m=0;m<l;m++)for(let g=0;g<c;g++){let b=0;for(let v=0;v<n;v++)for(let h=0;h<s;h++)for(let y=0;y<u;y++)b+=e[((p*n+v)*a+m+h)*o+g+y]*t[((d*n+v)*s+h)*u+y];f[((p*i+d)*l+m)*c+g]=b}return f}function Kt(e,t,r){const n=new Float32Array(e.length);for(let a=0;a<t;a++){const o=a*r;let i=-1e30;for(let u=0;u<r;u++)e[o+u]>i&&(i=e[o+u]);let s=0;for(let u=0;u<r;u++){const l=Math.exp(e[o+u]-i);n[o+u]=l,s+=l}for(let u=0;u<r;u++)n[o+u]/=s}return n}function Kr(e,t,r){const n=e.length;let a=0;for(let s=0;s<n;s++)a+=e[s]*e[s];const o=Math.sqrt(a/n+r),i=new Float32Array(n);for(let s=0;s<n;s++)i[s]=e[s]/o*t[s];return i}function Yr(e,t,r,n,a,o,i){const s=new Float32Array(n*a*o);for(let u=0;u<n;u++)for(let l=0;l<a;l++){const c=[];let f=-1e30;for(let m=0;m<a;m++){let g=0;for(let v=0;v<o;v++)g+=e[(u*a+l)*o+v]*t[(u*a+m)*o+v];const b=g*i;c.push(b),b>f&&(f=b)}let p=0;const d=c.map(m=>{const g=Math.exp(m-f);return p+=g,g});for(let m=0;m<a;m++){const g=d[m]/p;for(let b=0;b<o;b++)s[(u*a+l)*o+b]+=g*r[(u*a+m)*o+b]}}return s}function za(e,t,r){const n=e.length!==t.length,a=Math.min(e.length,t.length);let o=!0,i=-1,s=0,u=-1,l=null,c=null,f=1/0,p=-1/0,d=1/0,m=-1/0,g=!1;for(let v=0;v<a;v++){const h=e[v],y=t[v];if(!Number.isFinite(h)){o=!1,i<0&&(i=v);continue}y<f&&(f=y),y>p&&(p=y),h<d&&(d=h),h>m&&(m=h),g||(g=!0,u=0,l=y,c=h);const E=Math.abs(h-y);E>s&&(s=E,u=v,l=y,c=h)}if(o){for(let v=a;v<e.length;v++)if(!Number.isFinite(e[v])){o=!1,i=v;break}}const b=!n&&o&&g&&s<=r;return{maxError:s,errorIndex:u,cpuValue:l,gpuValue:c,expectedRange:f===1/0||p===-1/0?null:[f,p],actualRange:d===1/0||m===-1/0?null:[d,m],nonFiniteIndex:i,allFinite:o,lengthMismatch:n,pass:b}}function Wa(e,t,r){const n=new Float32Array(t);for(let a=0;a<t;a++){let o=0;for(let i=0;i<r;i++)o+=e[a*r+i];n[a]=o}return n}function Yt(e,t,r){const n=new ArrayBuffer(16),a=new Uint32Array(n);return a[0]=e>>>0,a[1]=t>>>0,a[2]=r>>>0,a[3]=0,n}function nt(e){const t=new ArrayBuffer(16),r=new Uint32Array(t);return r[0]=e>>>0,r[1]=0,r[2]=0,r[3]=0,t}function Qr(e,t,r,n,a,o,i,s,u){const l=new ArrayBuffer(48),c=new Uint32Array(l);return c[0]=e>>>0,c[1]=t>>>0,c[2]=r>>>0,c[3]=n>>>0,c[4]=a>>>0,c[5]=o>>>0,c[6]=i>>>0,c[7]=s>>>0,c[8]=u>>>0,c[9]=0,c[10]=0,c[11]=0,l}function Xr(e,t){const r=new ArrayBuffer(16),n=new Uint32Array(r);return n[0]=e>>>0,n[1]=t>>>0,n[2]=0,n[3]=0,r}function Zr(e,t){const r=new ArrayBuffer(16),n=new Uint32Array(r),a=new Float32Array(r);return n[0]=e>>>0,a[1]=t,n[2]=0,n[3]=0,r}function Jr(e,t,r,n){const a=new ArrayBuffer(16),o=new Uint32Array(a),i=new Float32Array(a);return o[0]=e>>>0,o[1]=t>>>0,o[2]=r>>>0,i[3]=n,a}function qa(e){const t=new Uint32Array(e),r=new Uint8Array(e),n=Array.from(r.slice(0,16)).map(a=>a.toString(16).padStart(2,"0")).join(" ");console.log("MATMUL UNIFORM DIAGNOSTIC:"),console.log(`M: ${t[0]}`),console.log(`N: ${t[1]}`),console.log(`K: ${t[2]}`),console.log(`Uniform bytes: ${n}`)}const It=[];let xr=!1;function en(){if(!xr)try{C().addEventListener("uncapturederror",t=>{const r=t.error;r&&It.push(r.message)}),xr=!0}catch{}}function tn(){const e=It.slice();return It.length=0,e}function te(e){return M(e.byteLength,e)}function Sr(e,t,r,n){return{config:e,pass:!1,stage:t,errorType:r,errorMessage:n,maxError:-1,errorIndex:-1,cpuValue:null,gpuValue:null,expectedRange:null,actualRange:null,nonFiniteIndex:-1}}async function Ke(e){const t=C();let r=null,n="pipeline",a=null,o=null;try{n="pipeline";const i=q(e.code,e.bindingTypes);n="bind-group";const s=z(i,e.bindingTypes,e.entries),u=await Ia(t,{name:e.name,pipeline:i,bindGroup:s,workgroups:e.workgroups,outputBuffer:e.outputBuffer,outputBytes:e.outputBytes,validator:p=>(r=p,{pass:!0,error:""})});if(n=u.stage,!u.pass)return{...Sr(e.config,n,u.errorType??"gpu-error",u.error??"GPU execution failed"),pipelineDeviceId:u.pipelineDeviceId,executionDeviceId:u.executionDeviceId,bindGroupDeviceId:u.bindGroupDeviceId,mismatch:u.mismatch};if(r===null)throw new Error("GPU returned no data after readback");n="validation";const l=za(r,e.reference,e.tolerance),c=e.extraCheck?e.extraCheck(r):null,f=l.pass&&c===null;return f||(l.allFinite?l.lengthMismatch?(a="shape-mismatch",o=`GPU length ${r.length} != CPU reference length ${e.reference.length}`):l.pass?(a="constraint",o=c??"output constraint violated"):(a="output-mismatch",o=`max abs error ${l.maxError.toExponential(3)} at index ${l.errorIndex} (cpu ${l.cpuValue?.toExponential(4)??"n/a"}, gpu ${l.gpuValue?.toExponential(4)??"n/a"})`):(a="non-finite",o=`non-finite output at index ${l.nonFiniteIndex}`)),{config:e.config,pass:f,stage:f?"complete":"validation",errorType:f?null:a,errorMessage:f?null:o,maxError:l.maxError,errorIndex:l.errorIndex,cpuValue:l.cpuValue,gpuValue:l.gpuValue,expectedRange:l.expectedRange,actualRange:l.actualRange,nonFiniteIndex:l.nonFiniteIndex,pipelineDeviceId:u.pipelineDeviceId,executionDeviceId:u.executionDeviceId,bindGroupDeviceId:u.bindGroupDeviceId,mismatch:u.mismatch}}catch(i){return Sr(e.config,n,a??"exception",o??i.message)}finally{try{e.dispose()}catch{}}}function Ye(e,t){const r=t.length>0&&t.every(o=>o.pass),n=t.reduce((o,i)=>Math.max(o,i.maxError),0),a=t.map(o=>`${o.config}:${o.pass?"PASS":"FAIL"}`).join(" ");return{name:e,pass:r,maxError:r?n:-1,details:a,cases:t}}async function Ha(e){const t=new Float32Array(e).fill(1),r=new Float32Array(e).fill(2),n=te(t),a=te(r),o=M(e*4),i=W(nt(e));return Ke({name:"VecAdd",config:`N=${e}`,code:We,bindingTypes:Oa,workgroups:[Math.ceil(e/64),1,1],entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:o}}],outputBuffer:o,outputBytes:e*4,reference:Hr(t,r),tolerance:1e-5,dispose:()=>{n.destroy(),a.destroy(),o.destroy(),i.destroy()}})}async function ja(){const e=[];for(const t of[64,1024,65536])if(e.push(await Ha(t)),!e[e.length-1].pass)break;return Ye("VecAdd",e)}async function Va(e){const t=new Float32Array(e*e).fill(1),r=new Float32Array(e*e).fill(.5),n=te(t),a=te(r),o=M(e*e*4),i=W(Yt(e,e,e));return Ke({name:"Matmul",config:`${e}×${e}`,code:rt,bindingTypes:Vt,workgroups:[Math.ceil(e/16),Math.ceil(e/16),1],entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:o}}],outputBuffer:o,outputBytes:e*e*4,reference:jr(t,r,e,e,e),tolerance:.001,dispose:()=>{n.destroy(),a.destroy(),o.destroy(),i.destroy()}})}async function rn(){const e=[];for(const t of[32,64,128])if(e.push(await Va(t)),!e[e.length-1].pass)break;return Ye("Matmul",e)}function Ka(e){if(e===1){const v=new Float32Array(25);for(let y=0;y<v.length;y++)v[y]=y+1;const h=new Float32Array([1,0,-1,1,0,-1,1,0,-1]);return{config:"5×5→3×3",N:1,C:1,H:5,W:5,F:1,FH:3,FW:3,input:v,kernel:h}}const t=1,r=2,n=3,a=3,o=1,i=2,s=2,u=new Float32Array(t*r*n*a);for(let c=0;c<u.length;c++)u[c]=c+1;const l=new Float32Array(o*r*i*s).fill(1);return{config:"C=2 (channel indexing)",N:t,C:r,H:n,W:a,F:o,FH:i,FW:s,input:u,kernel:l}}async function Ya(e){const t=Ka(e),{N:r,C:n,H:a,W:o,F:i,FH:s,FW:u}=t,l=a-s+1,c=o-u+1,f=r*i*l*c*4,p=te(t.input),d=te(t.kernel),m=M(f),g=W(Qr(r,n,a,o,i,s,u,l,c));return Ke({name:"Conv2D",config:t.config,code:zr,bindingTypes:Ga,workgroups:[r,i,l*c],entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:d}},{binding:3,resource:{buffer:m}}],outputBuffer:m,outputBytes:f,reference:Vr(t.input,t.kernel,r,n,a,o,i,s,u),tolerance:1e-4,dispose:()=>{p.destroy(),d.destroy(),m.destroy(),g.destroy()}})}async function Qa(){const e=[];for(const t of[1,2])if(e.push(await Ya(t)),!e[e.length-1].pass)break;return Ye("Conv2D",e)}function Xa(e){if(e===1)return{rows:2,cols:5,data:new Float32Array([-2,-1,0,1,2,2,1,0,-1,-2])};const t=4,r=16,n=new Float32Array(t*r);for(let a=0;a<n.length;a++)n[a]=a%r*.1-1;return{rows:t,cols:r,data:n}}async function Za(e){const t=Xa(e),r=t.rows,n=t.cols,a=t.data.byteLength,o=M(a,t.data),i=M(a),s=W(Xr(r,n));return Ke({name:"Softmax",config:`${r}×${n}`,code:jt,bindingTypes:Na,workgroups:[r,1,1],entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:i}}],outputBuffer:i,outputBytes:a,reference:Kt(t.data,r,n),tolerance:1e-4,extraCheck:u=>{for(let c=0;c<u.length;c++)if(u[c]<-1e-6)return`negative softmax output ${u[c].toExponential(3)} at index ${c}`;const l=Wa(u,r,n);for(let c=0;c<r;c++)if(Math.abs(l[c]-1)>1e-4)return`row ${c} sums to ${l[c].toExponential(3)} (expected ≈ 1)`;return null},dispose:()=>{o.destroy(),i.destroy(),s.destroy()}})}async function Ja(){const e=[];for(const t of[1,2])if(e.push(await Za(t)),!e[e.length-1].pass)break;return Ye("Softmax",e)}function eo(e){if(e===1)return{N:8,input:new Float32Array([1,2,3,4,5,6,7,8]),weight:new Float32Array(8).fill(1),eps:1e-6};const t=128,r=new Float32Array(t);for(let n=0;n<t;n++)r[n]=n*37%11*.5+.1;return{N:t,input:r,weight:new Float32Array(t).fill(1),eps:1e-6}}async function to(e){const t=eo(e),r=t.N,n=te(t.input),a=te(t.weight),o=M(r*4),i=W(Zr(r,t.eps));return Ke({name:"RMSNorm",config:`N=${r}`,code:Wr,bindingTypes:Ra,workgroups:[1,1,1],entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:o}}],outputBuffer:o,outputBytes:r*4,reference:Kr(t.input,t.weight,t.eps),tolerance:.001,dispose:()=>{n.destroy(),a.destroy(),o.destroy(),i.destroy()}})}async function ro(){const e=[];for(const t of[1,2])if(e.push(await to(t)),!e[e.length-1].pass)break;return Ye("RMSNorm",e)}function no(e){const r=e===1?4:8,n=r,a=1/Math.sqrt(n),o=()=>{const i=new Float32Array(1*r*n);for(let s=0;s<i.length;s++)i[s]=(s%n+1)*.1;return i};return{batch:1,seq:r,dim:n,scale:a,Q:o(),K:o(),V:o()}}async function ao(e){const t=no(e),{batch:r,seq:n,dim:a,scale:o}=t,i=r*n*a,s=r*n*n,u=te(t.Q),l=te(t.K),c=te(t.V),f=M(i*4),p=M(s*4),d=W(Jr(r,n,a,o));return Ke({name:"Attention",config:`b${r}-s${n}-d${a}`,code:qr,bindingTypes:_a,workgroups:[r,1,1],entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}},{binding:4,resource:{buffer:f}},{binding:5,resource:{buffer:p}}],outputBuffer:f,outputBytes:i*4,reference:Yr(t.Q,t.K,t.V,r,n,a,o),tolerance:.001,dispose:()=>{u.destroy(),l.destroy(),c.destroy(),f.destroy(),p.destroy(),d.destroy()}})}async function oo(){const e=[];for(const t of[1,2])if(e.push(await ao(t)),!e[e.length-1].pass)break;return Ye("Attention",e)}async function so(e){en();const t=[{key:"vectorAdd",name:"VecAdd",fn:ja},{key:"matmul",name:"Matmul",fn:rn},{key:"conv2d",name:"Conv2D",fn:Qa},{key:"softmax",name:"Softmax",fn:Ja},{key:"rmsNorm",name:"RMSNorm",fn:ro},{key:"attention",name:"Attention",fn:oo}],r=[];for(const n of t){if(oe()){r.push({name:n.name,pass:!1,maxError:-1,details:"ABORTED — device lost",cases:[]});break}const a=await n.fn();if(r.push(a),e?.(a),oe())break}return r}const io=["validation","out-of-memory","internal"];function nn(e){try{if(typeof GPUOutOfMemoryError<"u"&&e instanceof GPUOutOfMemoryError)return"out-of-memory";if(typeof GPUInternalError<"u"&&e instanceof GPUInternalError)return"internal";if(typeof GPUValidationError<"u"&&e instanceof GPUValidationError)return"validation"}catch{}const t=e;return typeof t.name=="string"&&t.name?t.name:"validation"}async function an(){if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=await e.requestDevice(),r=[],n={reason:null,message:null};return t.addEventListener("uncapturederror",a=>{const o=a.error;r.push({type:nn(o),message:o.message})}),t.lost.then(a=>{n.reason=a.reason??"unknown",n.message=a.message??""}),{device:t,uncaptured:r,lost:n}}function on(e){let t=0;for(const r of io)try{e.pushErrorScope(r),t++}catch{}return t}async function yt(e,t){const r=[];for(let n=0;n<t;n++)try{const a=await e.popErrorScope();a&&r.push({type:nn(a),message:a.message})}catch{}return r}async function sn(e,t){try{return{ok:!0,value:await t()}}catch(r){return{ok:!1,stage:e,error:r instanceof Error?r.message:String(r)}}}const uo=`
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
`,Ct=[6,8,10,12];async function co(){const e={name:"GPU Sanity",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"[6, 8, 10, 12]",actual:null,exception:null};let t=null,r=0,n=!1,a=null;const o=await sn("request-device",()=>an());if(!o.ok)return e.stage=o.stage,e.errorType="exception",e.errorMessage=o.error,e;t=o.value,e.stage="request-device";try{if(t.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;r=on(t.device);const u=new Float32Array([1,2,3,4]),l=new Float32Array([5,6,7,8]),c=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const f=t.device.createBuffer({size:16,usage:c,mappedAtCreation:!0});new Float32Array(f.getMappedRange()).set(u),f.unmap();const p=t.device.createBuffer({size:16,usage:c,mappedAtCreation:!0});new Float32Array(p.getMappedRange()).set(l),p.unmap();const d=t.device.createBuffer({size:16,usage:c}),m=t.device.createBuffer({size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});e.stage="create-pipeline";const g=t.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),b=t.device.createComputePipeline({layout:t.device.createPipelineLayout({bindGroupLayouts:[g]}),compute:{module:t.device.createShaderModule({code:uo}),entryPoint:"main"}});e.stage="create-bind-group";const v=t.device.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:d}}]});e.stage="encode-submit";const h=t.device.createCommandEncoder(),y=h.beginComputePass();y.setPipeline(b),y.setBindGroup(0,v),y.dispatchWorkgroups(1,1,1),y.end(),h.copyBufferToBuffer(d,0,m,0,16),t.device.queue.submit([h.finish()]),e.stage="readback",await m.mapAsync(GPUMapMode.READ);const E=new Float32Array(m.getMappedRange().slice(0));m.unmap(),m.destroy(),e.stage="validate-output",e.scopeErrors=await yt(t.device,r),n=!0,a=Array.from(E),e.actual=a.join(", "),f.destroy(),p.destroy(),d.destroy()}catch(u){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=u instanceof Error?u.message:String(u)}finally{if(t&&r>0&&!n)try{e.scopeErrors=await yt(t.device,r)}catch{}}if(e.uncaptured=t.uncaptured,t.lost.reason&&!e.scopeErrors.length&&!e.errorMessage)return e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;if(e.scopeErrors.length>0)return e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e;if(e.uncaptured.length>0)return e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e;if(e.errorMessage)return e.pass=!1,e;const i=a??[],s=i.length===Ct.length&&Ct.every((u,l)=>Math.abs(i[l]-u)<1e-6);return e.pass=s,s||(e.errorType="output-mismatch",e.errorMessage=`expected [${Ct.join(", ")}], got ${e.actual}`),e}async function lo(){const e={name:"Standalone MatMul 64×64",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"all elements = 32.0",actual:null,exception:null};let t=null,r=0,n=!1,a=null;const o=await sn("request-device",()=>an());if(!o.ok)return e.stage=o.stage,e.errorType="exception",e.errorMessage=o.error,e;t=o.value,e.stage="request-device";try{if(t.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;r=on(t.device);const i=64,s=64,u=i*i,l=new Float32Array(u).fill(1),c=new Float32Array(u).fill(.5),f=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const p=t.device.createBuffer({size:l.byteLength,usage:f,mappedAtCreation:!0});new Float32Array(p.getMappedRange()).set(l),p.unmap();const d=t.device.createBuffer({size:c.byteLength,usage:f,mappedAtCreation:!0});new Float32Array(d.getMappedRange()).set(c),d.unmap();const m=t.device.createBuffer({size:u*4,usage:f}),g=t.device.createBuffer({size:u*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),b=new ArrayBuffer(16),v=new Uint32Array(b);v[0]=i,v[1]=i,v[2]=s;const h=t.device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.device.queue.writeBuffer(h,0,b),e.stage="create-pipeline";const y=Ht(t.device,Vt),E=t.device.createComputePipeline({layout:t.device.createPipelineLayout({bindGroupLayouts:[y]}),compute:{module:t.device.createShaderModule({code:rt}),entryPoint:"main"}});e.stage="create-bind-group";const x=t.device.createBindGroup({layout:y,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:d}},{binding:3,resource:{buffer:m}}]});e.stage="encode-submit";const k=t.device.createCommandEncoder(),O=k.beginComputePass();O.setPipeline(E),O.setBindGroup(0,x),O.dispatchWorkgroups(4,4,1),O.end(),k.copyBufferToBuffer(m,0,g,0,u*4),t.device.queue.submit([k.finish()]),e.stage="readback",await g.mapAsync(GPUMapMode.READ);const F=new Float32Array(g.getMappedRange().slice(0));g.unmap(),g.destroy(),e.stage="validate-output",e.scopeErrors=await yt(t.device,r),n=!0,a=0;for(let R=0;R<u;R++)a=Math.max(a,Math.abs(F[R]-32));e.actual=`max err = ${a.toExponential(2)}`,p.destroy(),d.destroy(),m.destroy(),h.destroy()}catch(i){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=i instanceof Error?i.message:String(i)}finally{if(t&&r>0&&!n)try{e.scopeErrors=await yt(t.device,r)}catch{}}return e.uncaptured=t.uncaptured,t.lost.reason&&!e.scopeErrors.length&&!e.errorMessage?(e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e):e.scopeErrors.length>0?(e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e):e.uncaptured.length>0?(e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e):e.errorMessage?(e.pass=!1,e):(e.pass=a!==null&&a<.001,e.pass||(e.errorType="output-mismatch",e.errorMessage=`expected all elements = 32.0, got ${e.actual}`),e)}function Mr(e){try{if(typeof GPUOutOfMemoryError<"u"&&e instanceof GPUOutOfMemoryError)return"out-of-memory";if(typeof GPUInternalError<"u"&&e instanceof GPUInternalError)return"internal";if(typeof GPUValidationError<"u"&&e instanceof GPUValidationError)return"validation"}catch{}const t=e;return typeof t.name=="string"&&t.name?t.name:"validation"}function fo(e,t){try{return e.pushErrorScope(t),!0}catch{return!1}}async function un(e){const t=e,r=e,n=e,a=t*t,o=r*1*.5,i=Math.ceil(t/16),s={name:`Minimal Harness MatMul ${t}×${t}`,size:t,pass:!1,stage:"request-device",errorType:null,errorMessage:null,stageResults:{pipeline:!1,"bind-group":!1,dispatch:!1,submission:!1,readback:!1,validation:!1},compilationMessages:[],gpuError:null,uncaptured:[],expected:o,actualMin:null,actualMax:null,maxError:null,nonFinite:0,first16:[],exception:null},u=C();let l=null,c=null,f=null,p=null,d=null,m=null;const g=[];m=y=>{const E=y.error;E&&g.push({type:Mr(E),message:E.message})},u.addEventListener("uncapturederror",m);const b=[];for(const y of["validation","out-of-memory","internal"])fo(u,y)&&b.push(y);let v=null,h=!1;try{s.stage="create-shader-module";const y=u.createShaderModule({code:rt});if(s.stage="shader-compilation",typeof y.getCompilationInfo=="function"){let ge;try{ge=await y.getCompilationInfo()}catch(ue){s.compilationMessages.push(`getCompilationInfo failed: ${ue.message}`),ge={messages:[]}}if(s.compilationMessages=ge.messages.map(ue=>`${ue.type}: ${ue.message}`),ge.messages.some(ue=>ue.type==="error"))return s.stage="shader-compilation",s.errorType="shader-compilation",s.errorMessage=s.compilationMessages.join(" | "),s}else s.compilationMessages.push("getCompilationInfo unavailable");s.stageResults.pipeline=!1,s.stage="create-buffers";const E=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,x=new Float32Array(a).fill(1),k=new Float32Array(a).fill(.5);l=u.createBuffer({size:x.byteLength,usage:E,mappedAtCreation:!0}),new Float32Array(l.getMappedRange()).set(x),l.unmap(),c=u.createBuffer({size:k.byteLength,usage:E,mappedAtCreation:!0}),new Float32Array(c.getMappedRange()).set(k),c.unmap(),f=u.createBuffer({size:a*4,usage:E}),s.stage="create-uniform";const O=new ArrayBuffer(16),F=new Uint32Array(O);F[0]=n,F[1]=t,F[2]=r,p=u.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u.queue.writeBuffer(p,0,O),s.stage="create-pipeline";const R=Ht(u,Vt),X=u.createComputePipeline({layout:u.createPipelineLayout({bindGroupLayouts:[R]}),compute:{module:y,entryPoint:"main"}});s.stageResults.pipeline=!0,s.stage="create-bind-group";const Ne=u.createBindGroup({layout:R,entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:f}}]});s.stageResults["bind-group"]=!0,s.stage="create-staging",d=u.createBuffer({size:a*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),s.stage="encode";const me=u.createCommandEncoder(),Z=me.beginComputePass();s.stage="set-pipeline",Z.setPipeline(X),s.stage="set-bind-group",Z.setBindGroup(0,Ne),s.stage="dispatch",Z.dispatchWorkgroups(i,i,1),Z.end(),s.stageResults.dispatch=!0,s.stage="submit",me.copyBufferToBuffer(f,0,d,0,a*4),u.queue.submit([me.finish()]),s.stageResults.submission=!0,s.stage="readback",await d.mapAsync(GPUMapMode.READ);const ie=new Float32Array(d.getMappedRange().slice(0));d.unmap(),s.stageResults.readback=!0,s.stage="validation";let G=1/0,st=-1/0,it=0,$t=0;for(let ge=0;ge<a;ge++){const Ce=ie[ge];if(!Number.isFinite(Ce)){$t++;continue}Ce<G&&(G=Ce),Ce>st&&(st=Ce);const ue=Math.abs(Ce-o);ue>it&&(it=ue)}s.actualMin=Number.isFinite(G)?G:null,s.actualMax=Number.isFinite(st)?st:null,s.maxError=it,s.nonFinite=$t,s.first16=Array.from(ie.slice(0,16)),s.stageResults.validation=$t===0&&it<.001,d.destroy(),d=null}catch(y){s.pass=!1,s.stage=s.stage||"unknown",s.errorType="exception",s.exception=y instanceof Error?y.message:String(y),s.errorMessage=s.exception}finally{if(!h){for(const y of b.slice().reverse())try{const E=await u.popErrorScope();E&&!v&&(v={type:Mr(E),message:E.message})}catch{}h=!0}s.gpuError=v?`${v.type}: ${v.message}`:null,m&&(u.removeEventListener("uncapturederror",m),m=null);try{l?.destroy()}catch{}try{c?.destroy()}catch{}try{f?.destroy()}catch{}try{p?.destroy()}catch{}try{d?.destroy()}catch{}}return s.errorMessage?(s.pass=!1,s):v?(s.pass=!1,s.stage="gpu-error",s.errorType=v.type,s.errorMessage=`GPU Error: ${v.message}`,s):g.length?(s.pass=!1,s.stage="uncaptured",s.errorType="uncaptured-error",s.errorMessage=g.map(y=>`${y.type}: ${y.message}`).join(" | "),s):(s.uncaptured=g.map(y=>`${y.type}: ${y.message}`),s.pass=s.stageResults.validation,s.pass||(s.stage="validation",s.errorType="output-mismatch",s.errorMessage=`expected all elements = ${o} (min ${o}, max ${o}, nonFinite 0), got range [${s.actualMin}, ${s.actualMax}], maxErr ${s.maxError?.toExponential(2)}, nonFinite ${s.nonFinite}`),s.pass&&(s.stage="complete"),s)}async function po(){const e=C(),t=At(e),r=await un(64);return{name:"Shared-Device Direct MatMul 64×64",pass:r.pass,stage:r.stage||"complete",errorType:r.errorType,errorMessage:r.errorMessage,maxError:r.maxError,executionDeviceId:t,pipelineDeviceId:t,bindGroupDeviceId:t,mismatch:!1}}function cn(...e){for(const t of e)if(t)return t}const mt=cn("f2f8cd4479d682d74e5c03ceb6a356ec8892dc87"),ln=cn("2026-09-07T12:13:14.172Z"),qe=mt??ln??`dev-${Date.now().toString(36)}`,ht=mt&&/^[0-9a-f]{40}$/.test(mt)?mt:null,et=ln??"";function mo(e,t,r,n,a){const o=e.length,i=[...e].sort((c,f)=>c-f),s=o>0?e.reduce((c,f)=>c+f,0)/o:0,u=o>0?i[Math.floor(o/2)]:0,l=o>0?e.reduce((c,f)=>c+(f-s)*(f-s),0)/o:0;return{mode:t,iterations:o,warmup:n,avgMs:s,medianMs:u,minMs:o>0?i[0]:0,maxMs:o>0?i[o-1]:0,stdDevMs:Math.sqrt(l),samplesMs:i,note:a}}class go{device;_mode;_querySet=null;_resolve=null;_periodNs=1;_fallbackLogged=null;constructor(t){this.device=t;const r=this.tryEnableTimestamps(t);this._mode=r?"GPU_TIMESTAMP":"END_TO_END"}tryEnableTimestamps(t){try{if(!t.features||typeof t.features.has!="function"||!t.features.has("timestamp-query"))return!1;const r=t.createQuerySet({type:"timestamp",count:2}),n=t.createBuffer({size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),a=t.createCommandEncoder();a.beginComputePass({timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}).end(),a.finish(),this._querySet=r,this._resolve=n;const i=t.limits.timestampPeriod;return this._periodNs=typeof i=="number"&&i>0?i:1,!0}catch{return this._querySet?.destroy?.(),this._resolve?.destroy?.(),this._querySet=null,this._resolve=null,!1}}get mode(){return this._mode}get fallbackNote(){return this._fallbackLogged}async measure(t,r){const n=r.warmup??3;for(let o=0;o<n;o++)this.dispatchPass(t),await this.sync();const a=[];for(let o=0;o<r.iterations;o++){let i;if(this._mode==="GPU_TIMESTAMP"){const s=await this.measureTimestampPass(t);s===null?(this.fallback("timestamp query returned zero/undefined values — switched to END_TO_END"),i=await this.measureEndToEnd(t,r.wait)):i=s}else i=await this.measureEndToEnd(t,r.wait);a.push(i)}return mo(a,this._mode,r.iterations,n,this._fallbackLogged??void 0)}dispatchPass(t,r){const n=this.device.createCommandEncoder(),a=n.beginComputePass(r?{timestampWrites:r}:void 0);return t(a),a.end(),n}async timeOne(t,r){if(this._mode==="GPU_TIMESTAMP"){const n=await this.measureTimestampPass(t);if(n!==null)return n;this.fallback("timestamp query returned zero/undefined values — switched to END_TO_END")}return this.measureEndToEnd(t,r)}async measureTimestampPass(t){if(!this._querySet||!this._resolve)return null;try{const r=this.dispatchPass(t,{querySet:this._querySet,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1});r.resolveQuerySet(this._querySet,0,2,this._resolve,0),this.device.queue.submit([r.finish()]);const n=this.device.createBuffer({size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),a=this.device.createCommandEncoder();a.copyBufferToBuffer(this._resolve,0,n,0,16),this.device.queue.submit([a.finish()]),await n.mapAsync(GPUMapMode.READ);const o=new BigUint64Array(n.getMappedRange()),i=Number(o[1]-o[0]);return n.unmap(),n.destroy(),i>0?i*this._periodNs/1e6:null}catch{return null}}async measureEndToEnd(t,r){const n=performance.now(),a=this.dispatchPass(t);return this.device.queue.submit([a.finish()]),r?await r():await this.sync(),performance.now()-n}async sync(){try{await this.device.queue.onSubmittedWorkDone()}catch{await new Promise(t=>setTimeout(t,16))}}fallback(t){this._fallbackLogged||(this._fallbackLogged=t),this._mode="END_TO_END";try{this._querySet?.destroy(),this._resolve?.destroy()}catch{}this._querySet=null,this._resolve=null}destroy(){try{this._querySet?.destroy(),this._resolve?.destroy()}catch{}this._querySet=null,this._resolve=null}}const Er=["uniform","read-only-storage","read-only-storage","storage"],Ar=["uniform","read-only-storage","read-only-storage","storage"],bo=`
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
`,vo=`
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
`;function wt(e,t){return{value:e/(t/1e3)/1e9,unit:"GFLOPS"}}function yo(e,t){return{value:e/(t/1e3)/1e9,unit:"GB/s (estimate)"}}function Qt(e){for(let t=0;t<e.length;t++)if(!Number.isFinite(e[t]))return!1;return!0}function ye(e,t){let r=0;const n=Math.min(e.length,t.length);for(let a=0;a<n;a++)r=Math.max(r,Math.abs(e[a]-t[a]));return r}function Ee(e,t,r,n){return new Error(`${e} ${t}: ${r} (${n}) — fix correctness before benchmarking`)}function Qe(e,t,r,n,a){if(!Qt(r))throw Ee(e,t,"non-finite output","");if(r.length!==n.length)throw Ee(e,t,"length mismatch",`${r.length} vs ${n.length}`);const o=ye(r,n);if(o>Math.max(a,ye(n,new Float32Array(n.length))*.01))throw Ee(e,t,`correctness check failed (maxErr=${o.toExponential(2)})`,"")}async function H(e,t,r,n,a){const o=C(),i=o.createCommandEncoder(),s=i.beginComputePass();s.setPipeline(e),s.setBindGroup(0,t),s.dispatchWorkgroups(r[0],r[1],r[2]),s.end(),o.queue.submit([i.finish()]),await N(n,a)}function de(e,t){return()=>N(e,t).then(()=>{})}function re(e){let t=2654435769;for(let r=0;r<e.length;r++)t=t*1664525+1013904223>>>0,e[r]=t%2001/1e3-1}function fe(e,t,r,n,a,o){return{id:e,name:t,size:r,timingMode:n.mode,iterations:n.iterations,warmup:n.warmup,medianMs:n.medianMs,averageMs:n.avgMs,minMs:n.minMs,maxMs:n.maxMs,stdDevMs:n.stdDevMs,throughput:a,note:o}}const ho=[{size:128,iterations:12,validate:!0},{size:256,iterations:12,validate:!0},{size:512,iterations:10,validate:!1},{size:1024,iterations:10,validate:!1}];async function wo(e,t){const r=[];for(const n of ho){const a=n.size;if(t&&!t.has(`matmul-${a}`))continue;const o=a*a*4,i=new Float32Array(a*a),s=new Float32Array(a*a);re(i),re(s);const u=M(o,i),l=M(o,s),c=M(o),f=Yt(a,a,a);qa(f);const p=W(f),d=q(rt,["uniform","read-only-storage","read-only-storage","storage"]),m=z(d,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]),g=[a/16,a/16,1];await H(d,m,g,c,o);const b=await N(c,o);if(n.validate){const h=jr(i,s,a,a,a);Qe("matmul",`${a}×${a}`,b,h,.01)}else if(!Qt(b))throw Ee("matmul",`${a}×${a}`,"non-finite output","");const v=await e.measure(h=>{h.setPipeline(d),h.setBindGroup(0,m),h.dispatchWorkgroups(g[0],g[1],g[2])},{iterations:n.iterations,wait:de(c,o)});r.push(fe(`matmul-${a}`,"Matrix Multiply",`${a}×${a}`,v,wt(2*a*a*a,v.medianMs)))}return r}const xo=[{n:1e3,iterations:12},{n:16e3,iterations:12},{n:64e3,iterations:12},{n:262144,iterations:10},{n:1048576,iterations:10},{n:4194304,iterations:8}];async function So(e,t){const r=[];for(const n of xo){const a=n.n;if(t&&!t.has(`vecadd-${a}`))continue;const o=a*4,i=new Float32Array(a),s=new Float32Array(a);re(i),re(s);const u=M(o,i),l=M(o,s),c=M(o),f=W(nt(a)),p=q(We,["uniform","read-only-storage","read-only-storage","storage"]),d=z(p,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]),g=[Math.ceil(a/64),1,1];await H(p,d,g,c,o);const b=await N(c,o),v=Hr(i,s);Qe("vecadd",`${a.toLocaleString("en-US")} elements`,b,v,.01);const h=await e.measure(y=>{y.setPipeline(p),y.setBindGroup(0,d),y.dispatchWorkgroups(g[0],g[1],g[2])},{iterations:n.iterations,wait:de(c,o)});r.push(fe(`vecadd-${a}`,"Vector Add",`${a.toLocaleString("en-US")} elements`,h,yo(3*a*4,h.medianMs)))}return r}const Mo=[{inputChannels:1,outputChannels:1,rows:32,cols:32,iterations:10},{inputChannels:1,outputChannels:8,rows:64,cols:64,iterations:8},{inputChannels:1,outputChannels:16,rows:128,cols:128,iterations:6}];async function Eo(e,t){const r=[];for(const n of Mo){const a=n.inputChannels,o=n.rows,i=n.cols,s=n.outputChannels,u=3,l=3,c=o-u+1,f=i-l+1,p=new Float32Array(a*o*i),d=new Float32Array(s*a*u*l);re(p),re(d);const m=M(a*o*i*4,p),g=M(s*a*u*l*4,d),b=M(s*c*f*4),v=W(Qr(1,a,o,i,s,u,l,c,f)),h=q(zr,["uniform","read-only-storage","read-only-storage","storage"]),y=z(h,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:g}},{binding:3,resource:{buffer:b}}]),E=c*f,x=[1,s,E];await H(h,y,x,b,s*c*f*4);const k=await N(b,s*c*f*4),O=Vr(p,d,1,a,o,i,s,u,l);Qe("conv2d",`${a}×${o}×${i} → ${s}×${c}×${f}`,k,O,.001);const F=await e.measure(R=>{R.setPipeline(h),R.setBindGroup(0,y),R.dispatchWorkgroups(x[0],x[1],x[2])},{iterations:n.iterations,wait:de(b,s*c*f*4)});r.push(fe(`conv2d-${a}-${s}-${o}`,"Convolution 3×3",`${a}→${s} ch, ${o}×${i} → ${c}×${f}`,F))}return r}const Ao=[{rows:128,cols:128,iterations:12},{rows:256,cols:256,iterations:12},{rows:512,cols:512,iterations:10}];async function Po(e,t){const r=[];for(const n of Ao){const{rows:a,cols:o,iterations:i}=n;if(t&&!t.has(`softmax-${a}`))continue;const s=new Float32Array(a*o);re(s);const u=M(a*o*4,s),l=M(a*o*4),c=W(Xr(a,o)),f=q(jt,["uniform","read-only-storage","storage"]),p=z(f,["uniform","read-only-storage","storage"],[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}}]),d=[a,1,1];await H(f,p,d,l,a*o*4);const m=await N(l,a*o*4),g=Kt(s,a,o);Qe("softmax",`${a}×${o}`,m,g,.001);const b=await e.measure(v=>{v.setPipeline(f),v.setBindGroup(0,p),v.dispatchWorkgroups(d[0],d[1],d[2])},{iterations:i,wait:de(l,a*o*4)});r.push(fe(`softmax-${a}`,"Softmax",`${a}×${o}`,b))}return r}const $o=[{size:256,iterations:12},{size:512,iterations:12},{size:1024,iterations:12},{size:2048,iterations:10},{size:4096,iterations:10}];async function Uo(e,t){const r=[];for(const n of $o){const{size:a,iterations:o}=n;if(t&&!t.has(`rmsnorm-${a}`))continue;const i=new Float32Array(a);re(i);const s=new Float32Array(a);for(let y=0;y<a;y++)s[y]=1+y%7*.01;const u=1e-6,l=M(a*4,i),c=M(a*4,s),f=M(a*4),p=W(Zr(a,u)),d=q(Wr,["uniform","read-only-storage","read-only-storage","storage"]),m=z(d,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:f}}]),g=[1,1,1];await H(d,m,g,f,a*4);const b=await N(f,a*4),v=Kr(i,s,u);Qe("rmsnorm",String(a),b,v,.001);const h=await e.measure(y=>{y.setPipeline(d),y.setBindGroup(0,m),y.dispatchWorkgroups(g[0],g[1],g[2])},{iterations:o,wait:de(f,a*4)});r.push(fe(`rmsnorm-${a}`,"RMSNorm",String(a),h))}return r}const Co=[{seq:128,iterations:10,validate:!0},{seq:256,iterations:10,validate:!0},{seq:512,iterations:8,validate:!0},{seq:1024,iterations:6,validate:!1}];function Bo(e,t,r=1){const n=new Float32Array(r*e*t),a=new Float32Array(r*e*t),o=new Float32Array(r*e*t);re(n),re(a),re(o);const i=1/Math.sqrt(t),s=new Float32Array(r*e*e);for(let c=0;c<r;c++)for(let f=0;f<e;f++)for(let p=0;p<e;p++){let d=0;for(let m=0;m<t;m++)d+=n[(c*e+f)*t+m]*a[(c*e+p)*t+m];s[c*e*e+f*e+p]=d*i}const u=Kt(s,r*e,e),l=Yr(n,a,o,r,e,t,i);return{Q:n,K:a,V:o,scores:s,probs:u,out:l}}async function To(e,t){const r=[],n={};for(const a of Co){const{seq:o,iterations:i}=a;if(t&&!t.includes(o))continue;const s=64,u=1,l=o*o*4;if(o*o>1<<24){r.push(lt(`attention-${o}`,"Attention (single pass)",`seq=${o} dim=64 batch=1`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")),n[`seq=${o}`]=[lt(`attention-skip-${o}`,"Attention phases",`seq=${o}`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")];continue}let c;try{c=await Do(o,s,u)}catch{r.push(lt(`attention-${o}`,"Attention (single pass)",`seq=${o} dim=64 batch=1 scores=${(l/(1024*1024)).toFixed(1)} MiB`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")),n[`seq=${o}`]=[lt(`attention-skip-${o}`,"Attention phases",`seq=${o}`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")];continue}await H(c.pipelines.total,c.groups.total,[u,1,1],c.bufs.out,o*s*4);const f=await N(c.bufs.out,o*s*4);if(a.validate)Qe("attention",`seq=${o}`,f,c.ref.out,.01);else if(!Qt(f))throw Ee("attention",`seq=${o}`,"non-finite output","");const p=await e.measure(d=>{d.setPipeline(c.pipelines.total),d.setBindGroup(0,c.groups.total),d.dispatchWorkgroups(u,1,1)},{iterations:i,wait:de(c.bufs.out,o*s*4)});r.push(fe(`attention-${o}`,"Attention (single pass)",`seq=${o} dim=64 batch=1`,p,wt(4*o*o*s,p.medianMs),"QK^T + softmax + PV in one pass")),n[`seq=${o}`]=await ko(e,c,o,s,i)}return{main:r,phases:n}}async function ko(e,t,r,n,a){const o=[Math.ceil(r/64),1,1],i=[Math.ceil(r/64),n,1],s=r*r*4,u=r*n*4;for(let c=0;c<3;c++)await H(t.pipelines.qkt,t.groups.qkt,o,t.bufs.scores,s),await H(t.pipelines.soft,t.groups.soft,[r,1,1],t.bufs.probs,s),await H(t.pipelines.pv,t.groups.pv,i,t.bufs.out,u);const l=[];{await H(t.pipelines.qkt,t.groups.qkt,o,t.bufs.scores,s);const c=await N(t.bufs.scores,s);if(ye(c,t.ref.scores)>.01)throw Ee("attention.qkt",`seq=${r}`,"phase correctness check failed",`maxErr=${ye(c,t.ref.scores).toExponential(2)}`);const f=[];for(let p=0;p<a;p++)f.push(await e.timeOne(d=>{d.setPipeline(t.pipelines.qkt),d.setBindGroup(0,t.groups.qkt),d.dispatchWorkgroups(o[0],o[1],o[2])},de(t.bufs.scores,s)));l.push(fe(`attention-qkt-${r}`,"QK^T (scores)",`seq=${r} dim=64`,Bt(f,e.mode),wt(2*r*r*n,Pr(f))))}{const c=[];for(let p=0;p<a;p++)await H(t.pipelines.qkt,t.groups.qkt,o,t.bufs.scores,s),c.push(await e.timeOne(d=>{d.setPipeline(t.pipelines.soft),d.setBindGroup(0,t.groups.soft),d.dispatchWorkgroups(r,1,1)},de(t.bufs.probs,s)));const f=await N(t.bufs.probs,s);if(ye(f,t.ref.probs)>.01)throw Ee("attention.softmax",`seq=${r}`,"phase correctness check failed",`maxErr=${ye(f,t.ref.probs).toExponential(2)}`);l.push(fe(`attention-softmax-${r}`,"Softmax on scores",`seq=${r} rows=${r}`,Bt(c,e.mode)))}{const c=[];for(let p=0;p<a;p++)await H(t.pipelines.qkt,t.groups.qkt,o,t.bufs.scores,s),await H(t.pipelines.soft,t.groups.soft,[r,1,1],t.bufs.probs,s),c.push(await e.timeOne(d=>{d.setPipeline(t.pipelines.pv),d.setBindGroup(0,t.groups.pv),d.dispatchWorkgroups(i[0],i[1],i[2])},de(t.bufs.out,u)));const f=await N(t.bufs.out,u);if(ye(f,t.ref.out)>.01)throw Ee("attention.pv",`seq=${r}`,"phase correctness check failed",`maxErr=${ye(f,t.ref.out).toExponential(2)}`);l.push(fe(`attention-pv-${r}`,"Softmax × V",`seq=${r} dim=64`,Bt(c,e.mode),wt(2*r*r*n,Pr(c))))}return l}function lt(e,t,r,n){return{id:e,name:t,size:r,timingMode:"END_TO_END",iterations:0,warmup:0,medianMs:0,averageMs:0,minMs:0,maxMs:0,stdDevMs:0,note:n}}function Bt(e,t){const r=[...e].sort((i,s)=>i-s),n=e.reduce((i,s)=>i+s,0)/Math.max(e.length,1),a=r[Math.floor(r.length/2)]??0,o=e.reduce((i,s)=>i+(s-n)**2,0)/Math.max(e.length,1);return{mode:t,iterations:e.length,warmup:3,medianMs:a,avgMs:n,minMs:r[0]??0,maxMs:r[r.length-1]??0,stdDevMs:Math.sqrt(o)}}function Pr(e){const t=[...e].sort((r,n)=>r-n);return t[Math.floor(t.length/2)]??0}async function Do(e,t,r){const n=Bo(e,t,r),a=1/Math.sqrt(t),o=M(e*t*4,n.Q),i=M(e*t*4,n.K),s=M(e*t*4,n.V),u=M(e*t*4),l=M(e*e*4),c=M(e*e*4),f=W(Jr(r,e,t,a)),p=q(qr,["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"]),d=q(bo,[...Er]),m=q(jt,["uniform","read-only-storage","storage"]),g=q(vo,[...Ar]),b=z(p,["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"],[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:u}},{binding:5,resource:{buffer:l}}]),v=z(d,Er,[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:l}}]),h=z(m,["uniform","read-only-storage","storage"],[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:c}}]),y=z(g,Ar,[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:u}}]);return{seq:e,dim:t,batch:r,pipelines:{total:p,qkt:d,soft:m,pv:g},groups:{total:b,qkt:v,soft:h,pv:y},bufs:{q:o,k:i,v:s,out:u,scores:l,probs:c},ref:{scores:n.scores,probs:n.probs,out:n.out}}}const xe=30,dn=65536;function Oo(){return{pipeline:q(We,["uniform","read-only-storage","read-only-storage","storage"])}}function Se(e){if(e.length===0)return 0;const t=[...e].sort((r,n)=>r-n);return t[Math.floor(t.length/2)]}async function He(e){const t=performance.now();return await e(),performance.now()-t}const Go=[1,4,8,16,32,64,128];async function No(){const e=C(),t=[],r=[];let n=!1;for(const a of Go){if(n){t.push({id:`memory-${a}-mib`,requestedBytes:a*1024*1024,requestedMiB:a,created:!1,success:!1,note:"not attempted (previous allocation failed)"});continue}const o=a*1024*1024;let i=!1,s=!1,u;try{const l=M(o);i=!0,r.push(l);const{error:c}=await ka(e,"memory-allocate",async()=>(await N(l,4),!0));s=!c,u=c?`GPU error while forcing allocation: ${c}`:void 0}catch(l){u=l.message}t.push({id:`memory-${a}-mib`,requestedBytes:o,requestedMiB:a,created:i,success:s,note:u}),s||(n=!0)}for(const a of r)try{a.destroy()}catch{}return t}async function Ro(){const{pipeline:e}=Oo(),t=dn,r=t*4,n=[Math.ceil(t/64),1,1],a=new Float32Array(t),o=new Float32Array(t);for(let d=0;d<t;d++)a[d]=d%100/25-2,o[d]=d%77/13-3;const i=W(nt(t)),s=[];for(let d=0;d<xe;d++){const m=await He(async()=>{const g=M(r,a),b=M(r,o),v=M(r),h=z(e,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:g}},{binding:2,resource:{buffer:b}},{binding:3,resource:{buffer:v}}]),y=C().createCommandEncoder(),E=y.beginComputePass();E.setPipeline(e),E.setBindGroup(0,h),E.dispatchWorkgroups(n[0],n[1],n[2]),E.end(),C().queue.submit([y.finish()]),await N(v,r),g.destroy(),b.destroy(),v.destroy()});s.push(m)}const u=M(r,a),l=M(r,o),c=M(r),f=z(e,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]),p=[];for(let d=0;d<xe;d++){const m=await He(async()=>{const g=C().createCommandEncoder(),b=g.beginComputePass();b.setPipeline(e),b.setBindGroup(0,f),b.dispatchWorkgroups(n[0],n[1],n[2]),b.end(),C().queue.submit([g.finish()]),await N(c,r)});p.push(m)}return{allocateDestroy:{id:"buffer-allocate-destroy",name:"Allocate + Destroy per op",size:`${$r(3*t*4)} (3 × VecAdd buffers)`,timingMode:"END_TO_END",perOpMs:Se(s),totalMs:s.reduce((d,m)=>d+m,0),iterations:xe,samplesMs:[...s].sort((d,m)=>d-m),note:"full op = create 3 buffers + bind group + dispatch + readback + destroy"},bufferReuse:{id:"buffer-reuse",name:"Reuse persistent buffers",size:`${$r(3*t*4)} (3 × VecAdd buffers)`,timingMode:"END_TO_END",perOpMs:Se(p),totalMs:p.reduce((d,m)=>d+m,0),iterations:xe,samplesMs:[...p].sort((d,m)=>d-m),note:"full op = dispatch + readback on pre-allocated buffers"}}}async function _o(){const e=dn,t=e*4,r=[Math.ceil(e/64),1,1],n=new Float32Array(e),a=new Float32Array(e);for(let d=0;d<e;d++)n[d]=d%100/25-2,a[d]=d%77/13-3;const o=M(t,n),i=M(t,a),s=M(t),u=W(nt(e)),l=[];for(let d=0;d<xe;d++){const m=await He(async()=>{const g=q(We,["uniform","read-only-storage","read-only-storage","storage"]),b=z(g,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:s}}]),v=C().createCommandEncoder(),h=v.beginComputePass();h.setPipeline(g),h.setBindGroup(0,b),h.dispatchWorkgroups(r[0],r[1],r[2]),h.end(),C().queue.submit([v.finish()]),await N(s,t),typeof g.destroy=="function"&&g.destroy()});l.push(m)}const c=q(We,["uniform","read-only-storage","read-only-storage","storage"]),f=z(c,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:s}}]),p=[];for(let d=0;d<xe;d++){const m=await He(async()=>{const g=C().createCommandEncoder(),b=g.beginComputePass();b.setPipeline(c),b.setBindGroup(0,f),b.dispatchWorkgroups(r[0],r[1],r[2]),b.end(),C().queue.submit([g.finish()]),await N(s,t)});p.push(m)}return{recreate:{id:"pipeline-recreate",name:"Recreate pipeline per op",size:"VecAdd 65536",timingMode:"END_TO_END",perOpMs:Se(l),totalMs:l.reduce((d,m)=>d+m,0),iterations:xe,samplesMs:[...l].sort((d,m)=>d-m),note:"full op = createPipeline + bind group + dispatch + readback"},cached:{id:"pipeline-cached",name:"Cached pipeline",size:"VecAdd 65536",timingMode:"END_TO_END",perOpMs:Se(p),totalMs:p.reduce((d,m)=>d+m,0),iterations:xe,samplesMs:[...p].sort((d,m)=>d-m),note:"full op = dispatch + readback on a pre-built pipeline"}}}const ve=8,Tt=4096;async function Lo(){const e=Tt,t=e*4,r=[Math.ceil(e/64),1,1],n=new Float32Array(e),a=new Float32Array(e);for(let d=0;d<e;d++)n[d]=d%100/25-2,a[d]=d%77/13-3;const o=W(nt(e)),i=M(t,n),s=M(t,a),u=M(t),l=q(We,["uniform","read-only-storage","read-only-storage","storage"]),c=z(l,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:i}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:u}}]),f=[];for(let d=0;d<20;d++){const m=await He(async()=>{const g=[];for(let b=0;b<ve;b++){const v=C().createCommandEncoder(),h=v.beginComputePass();h.setPipeline(l),h.setBindGroup(0,c),h.dispatchWorkgroups(r[0],r[1],r[2]),h.end(),g.push(v)}for(const b of g)C().queue.submit([b.finish()]);await N(u,t)});f.push(m)}const p=[];for(let d=0;d<20;d++){const m=await He(async()=>{const g=C().createCommandEncoder();for(let b=0;b<ve;b++){const v=g.beginComputePass();v.setPipeline(l),v.setBindGroup(0,c),v.dispatchWorkgroups(r[0],r[1],r[2]),v.end()}C().queue.submit([g.finish()]),await N(u,t)});p.push(m)}return[{id:"command-batch-individual",name:`${ve} × VecAdd(${Tt}) — individual submits`,dispatches:ve,timingMode:"END_TO_END",totalMedianMs:Se(f),perDispatchMs:Se(f)/ve,samplesMs:[...f].sort((d,m)=>d-m)},{id:"command-batch-batched",name:`${ve} × VecAdd(${Tt}) — 8 passes, one command buffer`,dispatches:ve,timingMode:"END_TO_END",totalMedianMs:Se(p),perDispatchMs:Se(p)/ve,samplesMs:[...p].sort((d,m)=>d-m)}]}function $r(e){return`${(e/1024).toFixed(1)} KiB`}function Fo(){const e=typeof navigator<"u"?navigator:void 0;if(e&&(typeof e.getGpuUtilization=="function"||typeof e.gpuUtilization=="number"))try{const t=typeof e.getGpuUtilization=="function"?e.getGpuUtilization():e.gpuUtilization;return typeof t=="number"?`${t}%`:"UNAVAILABLE"}catch{return"UNAVAILABLE"}return"UNAVAILABLE"}function zt(){const e=typeof navigator<"u"?navigator:void 0;if(!e)return"UNAVAILABLE";const t=e;if(typeof t.getDeviceThermalLevel=="function")try{const r=t.getDeviceThermalLevel();return String(r)}catch{return"UNAVAILABLE"}return"UNAVAILABLE"}function Ur(){const e=typeof navigator<"u"?navigator:void 0;return{userAgent:typeof navigator<"u"?navigator.userAgent:"unknown",platform:e&&typeof e.platform=="string"?e.platform:"unknown",hardwareConcurrency:e&&typeof e.hardwareConcurrency=="number"?e.hardwareConcurrency:null,deviceMemory:e&&typeof e.deviceMemory=="number"?e.deviceMemory:null,thermalState:zt(),gpuUtilization:Fo()}}function Io(e){return JSON.parse(JSON.stringify(e))}function Cr(e){const t=e.diag,r={device:{webgpuAvailable:t.webgpuAvailable,adapterName:t.adapterName,adapterVendor:t.adapterVendor,adapterDevice:t.adapterDevice,features:t.adapterFeatures,timestampQuerySupport:t.timestampQuerySupport,isFallbackAdapter:t.isFallbackAdapter},browser:e.browser,webgpu:{limits:{maxBufferSize:t.maxBufferSize,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension},maxBufferSize:t.maxBufferSize,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize},timingMode:e.timingMode,timestamp:new Date().toISOString(),build:e.build,tests:e.tests,memory:e.memory,bufferReuse:e.bufferReuse,pipelineCache:e.pipelineCache,commandBatching:e.commandBatching,sustained:e.sustained,suiteError:e.suiteError};return Io(r)}function zo(e){const t={},r=(n,a,o)=>{t[`${n}.${a}`]={test:n,configuration:a,iterations:o.iterations,warmup:o.warmup,minMs:o.minMs,maxMs:o.maxMs,meanMs:o.averageMs,medianMs:o.medianMs,stdDevMs:o.stdDevMs,timingMode:o.timingMode,throughput:o.throughput?`${o.throughput.value.toFixed(2)} ${o.throughput.unit}`:null,note:o.note??null}};for(const n of e.tests.matmul)r("matmul",n.size,n);for(const n of e.tests.vecadd)r("vecadd",n.size,n);for(const n of e.tests.conv2d)r("conv2d",n.size,n);for(const n of e.tests.softmax)r("softmax",n.size,n);for(const n of e.tests.rmsnorm)r("rmsnorm",n.size,n);for(const n of e.tests.attention)r("attention",n.size,n);for(const[n,a]of Object.entries(e.tests.attentionPhases))for(const o of a)r("attention",`${o.name} ${n}`,o);for(const n of e.memory)t[`memory.${n.requestedMiB} MiB`]={test:"memory",configuration:`${n.requestedMiB} MiB`,iterations:1,warmup:0,minMs:0,maxMs:0,meanMs:0,medianMs:0,stdDevMs:0,timingMode:"ALLOCATION",note:`${n.requestedMiB} MiB requested (${n.requestedBytes} B) — created=${n.success?"yes":"no"}, success=${n.success?"yes":"no"}${n.note?` — ${n.note}`:""}`,throughput:null};for(const n of Object.keys(e.bufferReuse)){const a=e.bufferReuse[n];t[`bufferReuse.${a.name}`]={test:"bufferReuse",configuration:a.name,iterations:a.iterations,warmup:0,minMs:Br(a.samplesMs),maxMs:a.samplesMs[a.samplesMs.length-1]??0,meanMs:a.totalMs/Math.max(a.iterations,1),medianMs:a.perOpMs,stdDevMs:0,timingMode:a.timingMode,throughput:null,note:`per-op (median) ${a.perOpMs.toFixed(3)} ms — ${a.note??""}`.trim()}}for(const n of Object.keys(e.pipelineCache)){const a=e.pipelineCache[n];t[`pipelineReuse.${a.name}`]={test:"pipelineReuse",configuration:a.name,iterations:a.iterations,warmup:0,minMs:Br(a.samplesMs),maxMs:a.samplesMs[a.samplesMs.length-1]??0,meanMs:a.totalMs/Math.max(a.iterations,1),medianMs:a.perOpMs,stdDevMs:0,timingMode:a.timingMode,throughput:null,note:`per-op (median) ${a.perOpMs.toFixed(3)} ms — ${a.note??""}`.trim()}}for(const n of e.commandBatching)t[`commandBatching.${n.name}`]={test:"commandBatching",configuration:n.name,iterations:n.samplesMs.length,warmup:0,minMs:n.samplesMs[0]??0,maxMs:n.samplesMs[n.samplesMs.length-1]??0,meanMs:n.samplesMs.reduce((a,o)=>a+o,0)/Math.max(n.samplesMs.length,1),medianMs:n.totalMedianMs,stdDevMs:0,timingMode:n.timingMode,throughput:null,note:`${n.dispatches} work dispatches across ${n.name.includes("one command buffer")?"passes in one command buffer":"separate submissions"}`};if(e.sustained){const n=e.sustained;t["sustained.30sec"]={test:"sustained",configuration:"MatMul 256×256, 30 seconds",iterations:n.samples.length,warmup:0,minMs:n.minGflops,maxMs:n.maxGflops,meanMs:n.avgGflops,medianMs:n.samples[Math.floor(n.samples.length/2)]?.gflops??0,stdDevMs:0,timingMode:n.timingMode,throughput:null,note:`avg ${n.avgGflops.toFixed(1)} GFLOPS; first10s ${n.first10sAvgGflops.toFixed(1)}, last10s ${n.last10sAvgGflops.toFixed(1)}; throttled=${n.throttled?"yes":"no"} (miss=${n.dropPct.toFixed(1)}%)${n.error?` — ${n.error}`:""}`}}return e.suiteError&&(t["suite.error"]={test:"suite",configuration:"aborted",iterations:0,warmup:0,minMs:0,maxMs:0,meanMs:0,medianMs:0,stdDevMs:0,timingMode:e.timingMode,throughput:null,note:e.suiteError}),{device:e.device,browser:e.browser,webgpu:e.webgpu,timingMode:e.timingMode,timestamp:e.timestamp,commit:e.build.commit,results:t}}function Br(e){if(e.length===0)return 0;const t=[...e].sort((r,n)=>r-n);return t[Math.floor(t.length/2)]}function Wo(e){const t=[],r=e.tests.matmul,n=e.tests.vecadd,a=e.tests.attention,o=(()=>{if(r.length===0)return null;const c=r.filter(f=>f.throughput);return c.length===0?null:c.reduce((f,p)=>f.throughput.value>p.throughput.value?f:p)})();o?t.push(`compute-bound: largest MatMul throughput measured ${o.throughput.value.toFixed(1)} ${o.throughput.unit} at ${o.size} — matrix multiply is the classic compute-bound workload here.`):t.push("compute-bound: no usable MatMul throughput recorded.");const i=n.reduce((c,f)=>f.throughput&&(!c||f.throughput.value>c.throughput.value)?f:c,null);if(i&&i.throughput?t.push(`memory-bandwidth-sensitive: Vector Add peaks at ${i.throughput.value.toFixed(1)} ${i.throughput.unit} at ${i.size} — trivial ALU per element, so this reflects practical device memory bandwidth.`):t.push("memory-bandwidth-sensitive: no usable Vector Add bandwidth recorded."),a.length>=2){const c=[...a].sort((p,d)=>p.size.length-d.size.length),f=c[c.length-1];t.push(`attention bottleneck: largest tested single-pass attention (${f.size}) took ${f.medianMs.toFixed(2)} ms median (${f.timingMode}). Scores grow O(seq²): this is the workload most likely to bottleneck video diffusion decoding.`)}else a.length===1&&t.push(`attention bottleneck: attention at ${a[0].size} took ${a[0].medianMs.toFixed(2)} ms median (${a[0].timingMode}). Scores grow O(seq²).`);const s=a.filter(c=>/seq=(\d+)/.test(c.size)).sort((c,f)=>parseInt(f.size.match(/seq=(\d+)/)[1],10)-parseInt(c.size.match(/seq=(\d+)/)[1],10));if(s.length>=2){const c=s[0],f=s[1],p=c.medianMs/Math.max(f.medianMs,1e-9),d=parseInt(c.size.match(/seq=(\d+)/)[1],10),m=parseInt(f.size.match(/seq=(\d+)/)[1],10),g=d/m;t.push(`attention scaling: ${c.size} ran ${p.toFixed(2)}× slower than ${f.size} (seq ×${g}). With O(seq²) scores, doubling seq multiplies score work by ~4× — expect ~${(g*g).toFixed(1)}× per double if score-dominated.`)}else t.push("attention scaling: need 2+ attention sizes to compute a scaling ratio.");const u=e.memory.filter(c=>c.created&&c.success);if(u.length>0){const c=u.reduce((f,p)=>f.requestedBytes>p.requestedBytes?f:p);t.push(`largest safe tested tensor: single storage buffer of ${(c.requestedBytes/(1024*1024)).toFixed(0)} MiB allocated and survived. This is a tested allocation, not the total GPU memory.`)}else t.push("largest safe tested tensor: no successful memory allocation recorded.");const l=e.bufferReuse;if(l.allocateDestroy&&l.bufferReuse&&l.allocateDestroy.perOpMs>0){const c=l.bufferReuse.perOpMs/l.allocateDestroy.perOpMs;t.push(`buffer reuse: persistent reuse measured ${(c*100).toFixed(0)}% of the allocate/destroy per-op cost (${l.allocateDestroy.perOpMs.toFixed(3)} ms → ${l.bufferReuse.perOpMs.toFixed(3)} ms). Persistent buffers should be the default in the tensor runtime.`)}else t.push("buffer reuse: insufficient data to compare allocation strategies.");return t}const qo=30,Ho=2e3,jo=750,L=256;function Tr(e){let t=2654435769;for(let r=0;r<e.length;r++)t=t*1664525+1013904223>>>0,e[r]=t%2001/1e3-1}function Vo(){const e=L*L*4,t=new Float32Array(L*L),r=new Float32Array(L*L);Tr(t),Tr(r);const n=M(e,t),a=M(e,r),o=M(e),i=W(Yt(L,L,L)),s=q(rt,["uniform","read-only-storage","read-only-storage","storage"]),u=z(s,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:o}}]);return{pipeline:s,bg:u,bufC:o,wg:[L/16,L/16,1]}}function Ko(e){return new Promise(t=>setTimeout(t,e))}async function Yo(e,t={}){const r=C(),n=t.seconds??qo,a=zt(),{pipeline:o,bg:i,bufC:s,wg:u}=Vo(),l=await e.timeOne(x=>{x.setPipeline(o),x.setBindGroup(0,i),x.dispatchWorkgroups(u[0],u[1],u[2])},()=>N(s,L*L*4).then(()=>{})),c=Math.max(1,Math.min(Ho,Math.floor(jo/Math.max(l,.01)))),f=[],p=performance.now(),d=2*L*L*L;for(let x=0;x<n;x++){const k=performance.now();let O=0;try{const Z=r.createCommandEncoder(),ie=Z.beginComputePass();ie.setPipeline(o),ie.setBindGroup(0,i);for(let G=0;G<c;G++)ie.dispatchWorkgroups(u[0],u[1],u[2]);ie.end(),r.queue.submit([Z.finish()]),await N(s,L*L*4),O=Math.max(performance.now()-k,.001)}catch(Z){O=1e3,t.onProgress?.(Z.message)}const F=O/c,R=d/(F/1e3)/1e9,X={second:x+1,avgMs:F,gflops:R};f.push(X),t.onSecond?.(x+1,X,x);const me=1e3-(performance.now()-k);me>10&&await Ko(me)}Math.max(performance.now()-p,1);const m=f.map(x=>x.gflops),g=f.filter(x=>x.second<=10).map(x=>x.gflops),b=f.filter(x=>x.second>n-10).map(x=>x.gflops),v=x=>x.length?x.reduce((k,O)=>k+O,0)/x.length:0,h=v(g),y=v(b),E=h>0?(1-y/h)*100:0;return{durationSeconds:n,samples:f,first10sAvgGflops:h,last10sAvgGflops:y,throttled:y<h*.95,dropPct:Math.max(0,E),avgGflops:v(m),minGflops:f.length?Math.min(...m):0,maxGflops:f.length?Math.max(...m):0,thermalBefore:a,thermalAfter:zt(),timingMode:"AGGREGATE_END_TO_END",error:void 0}}let kt=!1;const Xe={matmul:new Set(["matmul-256","matmul-512"]),vecadd:new Set(["vecadd-1048576"]),conv2d:new Set,softmax:new Set(["softmax-256"]),rmsnorm:new Set(["rmsnorm-1024"]),attentionSeqs:[256]};async function Qo(e){if(kt)throw new Error("A benchmark suite is already running.");kt=!0;let t=null;try{const r=await Oe();t=new go(C());const n=Ur(),a={id:qe,commit:ht??null,time:et??null},o=e.mode==="full",i={matmul:[],vecadd:[],conv2d:[],softmax:[],rmsnorm:[],attention:[],attentionPhases:{}},s=m=>e.onProgress?.(m);s("matmul"),i.matmul=await wo(t,o?void 0:Xe.matmul),s("vecadd"),i.vecadd=await So(t,o?void 0:Xe.vecadd),o&&(s("conv2d"),i.conv2d=await Eo(t)),s("softmax"),i.softmax=await Po(t,o?void 0:Xe.softmax),s("rmsnorm"),i.rmsnorm=await Uo(t,o?void 0:Xe.rmsnorm),s("attention");const u=await To(t,o?void 0:Xe.attentionSeqs);i.attention=u.main,i.attentionPhases=u.phases;let l=[],c={},f={},p=[],d=null;return o&&(s("memory"),l=await No(),s("buffer reuse"),c=await Ro(),s("pipeline cache"),f=await _o(),s("command batching"),p=await Lo()),e.mode==="sustained"&&(s("sustained (30s)"),d=await Yo(t,{onSecond:(m,g)=>e.onSecond?.(m,`s${m}: ${g.gflops.toFixed(2)} GFLOPS`)})),Cr({diag:r,browser:n,timingMode:t.mode,build:a,tests:i,memory:l,bufferReuse:c,pipelineCache:f,commandBatching:p,sustained:d})}catch(r){const n={matmul:[],vecadd:[],conv2d:[],softmax:[],rmsnorm:[],attention:[],attentionPhases:{}};let a=null;try{a=await Oe()}catch{}if(a&&t)return Cr({diag:a,browser:Ur(),timingMode:t.mode,build:{id:qe,commit:ht??null,time:et??null},tests:n,memory:[],bufferReuse:{},pipelineCache:{},commandBatching:[],sustained:null,suiteError:r.message});throw r}finally{t?.destroy(),kt=!1}}let Q=null,D=!1,Wt=!1,le=null,Y=localStorage.getItem("aether.kernels-passed")!=="1",De=localStorage.getItem("aether.sustained.armed")==="1",tt=null;const Me={sanity:!1,standaloneMatmul:!1,directMatmul:!1,harnessMatmul:!1};function xt(){return Me.sanity&&Me.standaloneMatmul&&Me.directMatmul&&Me.harnessMatmul}function Pt(){const e=Q?.querySelector("#btn-correctness");if(!e)return;const t=xt();e.disabled=!t,e.textContent=t?"CORRECTNESS":"CORRECTNESS (LOCKED)"}function S(e,t=""){if(!Q)return;const r=Q.querySelector("#bench-log");if(!r)return;const n=document.createElement("div");n.className=`log-entry ${t}`,n.textContent=e,r.appendChild(n),r.scrollTop=r.scrollHeight}function kr(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function Ae(){const e=Ta();S(`WEBGPU DEVICE LOST — reason: ${e.reason??"unknown"} — message: ${e.message??""}`,"err"),S("Remaining tests stopped.","err")}function at(){if(!Wt)try{const e=C();e.addEventListener("uncapturederror",t=>{const r=t.error;S(`UNCAPTURED GPU ERROR: ${r?.message??"unknown"}`,"err")}),e.lost.then(t=>{S(`WEBGPU DEVICE LOST — reason: ${t.reason} — message: ${t.message}`,"err")}),Wt=!0}catch{}}function ot(e,t){const r=Q?.querySelector(`#${e}`);if(!r)return;const n=[t.stage?`<div>stage: <b style="color:var(--text)">${P(t.stage)}</b></div>`:"",t.pass?"":t.errorType?`<div>error type: <b style="color:var(--red)">${P(t.errorType)}</b></div>`:"",t.pass?"":t.errorMessage?`<div>error message: <b style="color:var(--red)">${P(t.errorMessage)}</b></div>`:"",...t.notes.map(a=>`<div style="color:var(--text-dim)">${P(a)}</div>`)].join("");r.innerHTML=`
    <div class="card" style="border-color:${t.pass?"var(--green)":"var(--red)"};margin-top:12px">
      <div class="card-header">
        <span class="card-title">${P(t.title)}</span>
        <span class="badge ${t.pass?"badge-pass":"badge-fail"}">${t.pass?"PASS":"FAIL"}</span>
      </div>
      <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${n||'<div style="color:var(--text-dim)">—</div>'}</div>
    </div>
  `}function P(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function fn(e){const t=[];for(const r of e.scopeErrors)t.push(`GPU error scope [${r.type}]: ${r.message}`);for(const r of e.uncaptured)t.push(`uncaptured GPU error [${r.type}]: ${r.message}`);return e.lost.reason&&t.push(`device lost — reason: ${e.lost.reason} — message: ${e.lost.message??""}`),t.push(`expected: ${e.expected}`),e.actual!==null&&t.push(`actual: ${e.actual}`),e.exception&&t.push(`exception: ${e.exception}`),t}function Xo(e){const t=e.pass?"display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--green);color:var(--green)":"display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--red);color:var(--red)",r=e.pass?`${e.config} — complete`:`${e.config} — stage: ${e.stage} · ${e.errorType??""} · ${e.errorMessage??""}`;return`<span style="${t}" title="${P(r)}">${P(e.config)} ${e.pass?"✓":"✗"}</span>`}function Zo(e){const t=[];return t.push(`stage: ${P(e.stage)} · error type: <b style="color:var(--red)">${P(e.errorType??"unknown")}</b>`),e.errorMessage&&t.push(`error: ${P(e.errorMessage)}`),e.nonFiniteIndex>=0&&t.push(`non-finite output at index ${e.nonFiniteIndex}`),e.errorIndex>=0&&e.cpuValue!==null&&e.gpuValue!==null&&t.push(`largest error @ ${e.errorIndex}: cpu=${e.cpuValue.toExponential(4)} gpu=${e.gpuValue.toExponential(4)}`),e.expectedRange&&t.push(`expected range [${e.expectedRange[0].toExponential(3)}, ${e.expectedRange[1].toExponential(3)}]`),e.actualRange&&t.push(`actual range [${e.actualRange[0].toExponential(3)}, ${e.actualRange[1].toExponential(3)}]`),t.map(r=>`<div style="color:var(--red)">${r}</div>`)}function Jo(e){const t=Q?.querySelector("#validation-panel");if(!t)return;const r=e.length===6&&e.every(a=>a.pass),n=e.map(a=>{const o=a.cases.filter(s=>!s.pass).flatMap(Zo),i=a.pass?"complete":a.details.includes("ABORTED")?"aborted (device lost)":a.cases.find(s=>!s.pass)?.stage??"failed";return`
      <div class="card" style="border-color:${a.pass?"var(--green)":"var(--red)"};margin-top:10px">
        <div class="card-header">
          <span class="card-title">${P(a.name.toUpperCase())}</span>
          <span class="badge ${a.pass?"badge-pass":"badge-fail"}">${a.pass?"PASS":"FAIL"}</span>
        </div>
        <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:4px;word-break:break-all">
          <div>${a.cases.map(Xo).join("")||'<span style="color:var(--text-dim)">not run</span>'}</div>
          <div>max error: <b>${a.maxError>=0?a.maxError.toExponential(2):"—"}</b></div>
          <div>execution status: <b>${P(i)}</b></div>
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
  `}function Le(e){const t=e??{pass:!1,maxError:-1,cases:[]};return{pass:t.pass,maxError:t.maxError,cases:t.cases}}function es(e){return!le||e.length===0?null:{device:{webgpuAvailable:le.webgpuAvailable,adapterName:le.adapterName,adapterVendor:le.adapterVendor,adapterDevice:le.adapterDevice,fallbackAdapter:le.isFallbackAdapter},build:{id:qe,commit:ht??null,time:et??null},timestamp:new Date().toISOString(),uncapturedErrors:tn(),tests:{vectorAdd:Le(e[0]),matmul:Le(e[1]),conv2d:Le(e[2]),softmax:Le(e[3]),rmsNorm:Le(e[4]),attention:Le(e[5])},allPass:e.length===6&&e.every(t=>t.pass)}}function ts(e){try{localStorage.setItem("aether.correctness",JSON.stringify(e))}catch{}}function rs(e){const t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=`aether-correctness-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`,n.click(),URL.revokeObjectURL(r)}function ns(e){const t=Q?.querySelector("#report-panel");t&&(t.innerHTML=`
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
  `,t.querySelector("#btn-export-json")?.addEventListener("click",()=>rs(e)),t.querySelector("#btn-reload")?.addEventListener("click",()=>location.reload()))}async function as(){if(!D){D=!0;try{S("═══ GPU SANITY (standalone) ═══","info");const e=await co();Me.sanity=e.pass,Pt(),ot("res-sanity",{title:"GPU SANITY",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:fn(e)}),S(`GPU SANITY TEST: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&S(`  error type: ${e.errorType}`,"err"),e.errorMessage&&S(`  error message: ${e.errorMessage}`,"err")}catch(e){S(`ERROR: ${e.message}`,"err")}finally{D=!1}}}async function os(){if(!D){D=!0;try{S("═══ STANDALONE MATMUL (64×64) ═══","info");const e=await lo();Me.standaloneMatmul=e.pass,Pt(),ot("res-standalone",{title:"STANDALONE MATMUL",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:fn(e)}),S(`STANDALONE MATMUL: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&S(`  error type: ${e.errorType}`,"err"),e.errorMessage&&S(`  error message: ${e.errorMessage}`,"err")}catch(e){S(`ERROR: ${e.message}`,"err")}finally{D=!1}}}async function ss(){if(!D){D=!0;try{await Oe(),at(),S("═══ SHARED-DEVICE DIRECT MATMUL (engine device, inline) ═══","info");const e=await po();Me.directMatmul=e.pass,Pt(),ot("res-direct",{title:e.name,pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:[`execution device id: ${e.executionDeviceId}`,`pipeline device id: ${e.pipelineDeviceId??"unknown"}`,`bind group device id: ${e.bindGroupDeviceId??"unknown"}`,`device mismatch: ${e.mismatch?"YES":"NO"}`,`max error: ${e.maxError!==null?e.maxError.toExponential(2):"—"}`]}),S(`SHARED-DEVICE DIRECT MATMUL: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&S(`  error type: ${e.errorType}`,"err"),e.errorMessage&&S(`  error message: ${e.errorMessage}`,"err"),oe()&&Ae()}catch(e){S(`ERROR: ${e.message}`,"err"),oe()&&Ae()}finally{D=!1}}}async function Dr(e,t){if(!D){D=!0;try{const r=await Oe();le=r,at(),S(`═══ MINIMAL HARNESS MATMUL ${e}×${e} (getDevice, inline, no runGpuTest) ═══`,"info");const n=await un(e),o=[`Device: ${r?`${r.adapterName}${r.adapterVendor?` / ${r.adapterVendor}`:""}`:"unknown"}`,`Pipeline: ${n.stageResults.pipeline?"PASS":"FAIL"}`,`Bind Group: ${n.stageResults["bind-group"]?"PASS":"FAIL"}`,`Dispatch: ${n.stageResults.dispatch?"PASS":"FAIL"}`,`Submission: ${n.stageResults.submission?"PASS":"FAIL"}`,`Readback: ${n.stageResults.readback?"PASS":"FAIL"}`,`Validation: ${n.stageResults.validation?"PASS":"FAIL"}`,`Expected: ${n.expected}`,`Actual range: [${n.actualMin}, ${n.actualMax}]`,`Max error: ${n.maxError!==null?n.maxError.toExponential(2):"—"}`,`Non-finite values: ${n.nonFinite}`,`GPU error: ${n.gpuError??"none"}`,`Uncaptured error: ${n.uncaptured.length?n.uncaptured.join(" | "):"none"}`,`Shader compilation: ${n.compilationMessages.length?n.compilationMessages.join(" | "):"none"}`,`expected first 16: ${Array(16).fill(n.expected).join(", ")}`,`actual first 16: ${n.first16.length?n.first16.slice(0,16).join(", "):"—"}`];ot(t,{title:`MINIMAL HARNESS MATMUL ${e}×${e}`,pass:n.pass,stage:n.stage||"complete",errorType:n.errorType,errorMessage:n.errorMessage,notes:o}),S(`MINIMAL HARNESS MATMUL ${e}×${e}: ${n.pass?"PASS":"FAIL"}`,n.pass?"ok":"err"),n.errorType&&S(`  error type: ${n.errorType}`,"err"),n.errorMessage&&S(`  error message: ${n.errorMessage}`,"err"),oe()&&Ae()}catch(r){S(`ERROR: ${r.message}`,"err"),oe()&&Ae()}finally{D=!1}}}async function is(){if(!D){D=!0;try{await Oe(),at(),S("═══ HARNESS MATMUL (runGpuTest) ═══","info");const e=await rn();Me.harnessMatmul=e.pass,Pt();const t=e.cases.map(a=>`${a.config}:${a.pass?"PASS":"FAIL"}`).join(" "),r=e.cases.find(a=>!a.pass),n=r?[`pipeline device id: ${r.pipelineDeviceId??"unknown"}`,`execution device id: ${r.executionDeviceId??"unknown"}`,`bind group device id: ${r.bindGroupDeviceId??"unknown"}`,`device mismatch: ${r.mismatch?"YES":"NO"}`]:[];ot("res-harness",{title:"HARNESS MATMUL",pass:e.pass,stage:e.pass?"complete":r?.stage??"runGpuTest",errorType:e.pass?null:r?.errorType??null,errorMessage:e.pass?null:r?.errorMessage??e.details,notes:[`cases: ${t||"—"}`,`max error: ${e.maxError>=0?e.maxError.toExponential(2):"—"}`,...n]}),S(`HARNESS MATMUL: ${e.pass?"PASS":"FAIL"} — ${e.details||""}`,e.pass?"ok":"err"),oe()&&Ae()}catch(e){S(`ERROR: ${e.message}`,"err"),oe()&&Ae()}finally{D=!1}}}async function us(){if(!D){if(!xt()){S("CORRECTNESS LOCKED — run GPU SANITY, STANDALONE MATMUL and HARNESS MATMUL first.","warn");return}D=!0;try{le=await Oe(),at(),tn(),en(),S("═══ AETHER KERNEL VALIDATION (sequential, one test at a time) ═══","info");const t=await so(n=>{S(`${n.pass?"✓":"✗"} ${n.name} — ${n.details}`,n.pass?"ok":"err")});Jo(t);const r=t.length===6&&t.every(n=>n.pass);if(S(r?"ALL KERNELS PASSED":"SOME KERNELS FAILED",r?"ok":"err"),r)cs(),S("Performance benchmarks UNLOCKED.","ok");else if(!Y){Y=!0;try{localStorage.removeItem("aether.kernels-passed")}catch{}St(),S("Performance benchmarks RE-LOCKED (a validated kernel failed).","err")}if(oe())Ae(),S("Requires runtime reinitialization — reload the page (or re-run up the gate diagnostics) before retrying.","err");else{const n=es(t);n&&(ts(n),ns(n),S("Correctness report saved locally (aether.correctness).","info"))}}catch(e){S(`ERROR: ${e.message}`,"err"),oe()&&Ae()}finally{D=!1}}}function cs(){Y=!1;try{localStorage.setItem("aether.kernels-passed","1")}catch{}St()}function ae(e){return Number.isFinite(e)?e<1?`${(e*1e3).toFixed(1)} µs`:e<1e3?`${e.toFixed(2)} ms`:`${(e/1e3).toFixed(2)} s`:"—"}function pn(e){return!e||!Number.isFinite(e.value)?"—":`${e.value.toFixed(1)} ${e.unit}`}function mn(e){return e==="GPU_TIMESTAMP"?"GPU TIMESTAMP":e==="END_TO_END"?"END-TO-END":e}function ls(e){return!e||e.length===0?'<tr><td colspan="7" style="color:var(--text-dim)">not run</td></tr>':e.map(t=>t.note&&t.note.startsWith("SKIPPED")?`<tr><td class="td-l">${P(t.size)}</td><td colspan="7" style="color:var(--yellow)">${P(t.note)} — not reported as a failure</td></tr>`:`<tr ${t.error?'style="color:var(--red)"':""}>
          <td class="td-l">${P(t.size)}</td>
          <td>${mn(t.timingMode)}</td>
          <td>${ae(t.medianMs)}</td>
          <td>${ae(t.averageMs)}</td>
          <td>${ae(t.minMs)}</td>
          <td>${ae(t.maxMs)}</td>
          <td>${ae(t.stdDevMs)}</td>
          <td>${pn(t.throughput)}</td>
        </tr>`).join("")}function Te(e,t){return`<div class="perf-block">
    <div class="perf-block-title">${P(e)} <span class="badge badge-info" style="float:right">${t?t.length:0} run</span></div>
    <table class="perf-table">
      <thead><tr>
        <th class="th-l">size</th><th>mode</th><th>median</th><th>avg</th><th>min</th><th>max</th><th>stddev</th><th>throughput</th>
      </tr></thead>
      <tbody>${ls(t)}</tbody>
    </table>
  </div>`}function dt(e,t){return t?`<div class="perf-block">
    <div class="perf-block-title">${P(e)} <span class="badge badge-info" style="float:right">${t.timingMode}</span></div>
    <table class="perf-table">
      <thead><tr><th class="th-l">configuration</th><th>per-op</th><th>total</th><th>iterations</th></tr></thead>
      <tbody>
        <tr>
          <td class="td-l">${P(t.name)} <span style="color:var(--text-dim)">· ${P(t.size)}</span></td>
          <td>${ae(t.perOpMs)}</td>
          <td>${ae(t.totalMs)}</td>
          <td>${t.iterations}</td>
        </tr>
      </tbody>
    </table>
    ${t.note?`<div style="font-size:11px;color:var(--text-dim)">${P(t.note)}</div>`:""}
  </div>`:""}function ds(e){const t=Object.entries(e.tests.attentionPhases);return t.length===0?"":`<div class="perf-block">
    <div class="perf-block-title">Attention phases (per sequence length) <span class="badge badge-info" style="float:right">split</span></div>
    ${t.map(([n,a])=>`<div class="perf-sub">${P(n)}</div>${Te("",a)}`).join("")||'<div style="color:var(--text-dim)">not run</div>'}
  </div>`}function fs(e){return`<tr style="color:${e.success?"var(--green)":"var(--red)"}">
    <td class="td-l">${e.requestedMiB} MiB</td>
    <td>${e.created?"allocated":"skipped"}</td>
    <td>${e.success?"OK":"FAILED"}</td>
    <td style="color:var(--text-dim)">${P(e.note??"")}</td>
  </tr>`}function ps(e){if(!e)return"";const t=e.samples.map(r=>`<div class="pad-bar" title="s${r.second}: ${r.gflops.toFixed(2)} GFLOPS" style="height:${Math.max(8,Math.min(80,100-r.gflops))}px"></div>`).join("");return`<div class="perf-block">
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
  </div>`}function ms(e){const t=Q?.querySelector("#perf-results");if(!t)return;const r=Wo(e),n=e.commandBatching.map(o=>`<tr><td class="td-l">${P(o.name)}</td><td>${ae(o.totalMedianMs)}</td><td>${ae(o.perDispatchMs)}</td><td>${o.timingMode}</td></tr>`).join(""),a=e.suiteError?`<div class="card" style="border-color:var(--red);margin-top:12px"><div class="card-header"><span class="card-title">SUITE ABORTED</span><span class="badge badge-fail">VALIDATION FAILURE</span></div><div style="font-size:12px;font-family:var(--mono);color:var(--red);margin-top:8px;word-break:break-all">${P(e.suiteError)}</div></div>`:"";t.innerHTML=a+`
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
    ${Te("Matrix Multiply",e.tests.matmul)}
    ${Te("Vector Add",e.tests.vecadd)}
    ${Te("Convolution 3×3",e.tests.conv2d)}
    ${Te("Softmax",e.tests.softmax)}
    ${Te("RMSNorm",e.tests.rmsnorm)}
    ${Te("Attention (single pass)",e.tests.attention)}
    ${ds(e)}
    ${e.memory.length?`<div class="perf-block"><div class="perf-block-title">Largest safe tested tensor</div><table class="perf-table"><thead><tr><th class="th-l">requested</th><th>state</th><th>result</th><th>note</th></tr></thead><tbody>${e.memory.map(fs).join("")}</tbody></table></div>`:""}
    ${dt("Buffer allocation vs reuse",e.bufferReuse.allocateDestroy)}
    ${dt("",e.bufferReuse.bufferReuse)}
    ${dt("Pipeline cache vs recreate",e.pipelineCache.recreate)}
    ${dt("",e.pipelineCache.cached)}
    ${e.commandBatching.length?`<div class="perf-block"><div class="perf-block-title">Command submission batching</div><table class="perf-table"><thead><tr><th class="th-l">configuration</th><th>total (8 ops)</th><th>per dispatch</th><th>mode</th></tr></thead><tbody>${n}</tbody></table></div>`:""}
    ${ps(e.sustained)}
    <div class="perf-block">
      <div class="perf-block-title">Interpretation</div>
      <div style="font-size:12px;line-height:1.5;color:var(--text);margin-top:6px">${r.map(o=>`<div>• ${P(o)}</div>`).join("")}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Interpretation is data-driven from the samples above — no fabricated GPU utilization, thermal state or theoretical maxima.</div>
    </div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn" id="btn-export-perf">EXPORT JSON</button>
      <button class="btn btn-outline" id="btn-copy-perf">COPY RESULTS</button>
    </div>
  `,t.querySelector("#btn-export-perf")?.addEventListener("click",()=>gs()),t.querySelector("#btn-copy-perf")?.addEventListener("click",()=>bs())}function gs(){if(!tt)return;const e=JSON.stringify(zo(tt),null,2),t=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=`aether-gpu-benchmark-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`,n.click(),URL.revokeObjectURL(r)}function bs(){if(!tt)return;const e=tt,t=[];t.push(`AETHER GPU BENCHMARK — ${e.device.adapterName} (${e.device.adapterVendor})`),t.push(`timing mode: ${e.timingMode}`),t.push(`thermal: ${e.browser.thermalState} · GPU utilization: ${e.browser.gpuUtilization}`),t.push(e.suiteError?`SUITE ERROR: ${e.suiteError}`:""),t.push("");const r=(n,a)=>{t.push(n);for(const o of a)t.push(`  ${o.size} — ${ae(o.medianMs)} median (${mn(o.timingMode)})${o.throughput?` · ${pn(o.throughput)}`:""}`);t.push("")};r("matmul",e.tests.matmul),r("vecadd",e.tests.vecadd),r("conv2d",e.tests.conv2d),r("softmax",e.tests.softmax),r("rmsnorm",e.tests.rmsnorm),r("attention",e.tests.attention);for(const[n,a]of Object.entries(e.tests.attentionPhases))r(`attention phases ${n}`,a);e.sustained&&t.push(`sustained 30s: avg ${e.sustained.avgGflops.toFixed(2)} GFLOPS, throttled=${e.sustained.throttled}, drop=${e.sustained.dropPct.toFixed(1)}%`),navigator.clipboard?.writeText(t.join(`
`)).catch(()=>{}),S("Benchmark summary copied to clipboard.","ok")}function St(){const e=Q?.querySelector("#btn-perf-quick"),t=Q?.querySelector("#btn-perf-full"),r=Q?.querySelector("#btn-perf-sustained"),n=Q?.querySelector("#chk-sustained");e&&(e.disabled=Y,e.textContent=Y?"QUICK BENCHMARK (LOCKED)":"QUICK BENCHMARK"),t&&(t.disabled=Y,t.textContent=Y?"FULL BENCHMARK (LOCKED)":"FULL BENCHMARK"),n&&(n.checked=De),r&&(r.disabled=Y||!De,r.textContent=Y?"SUSTAINED (LOCKED)":De?"SUSTAINED 30s":"SUSTAINED (ARM FIRST)")}function Dt(e){if(D){S("A benchmark is already running — wait for it to finish.","warn");return}if(e==="sustained"&&!De){S('SUSTAINED is not armed — confirm "Enable sustained 30s run" first.',"warn");return}D=!0;try{const t=e==="quick"?"QUICK":e==="full"?"FULL":"SUSTAINED";S(`═══ AETHER GPU PERFORMANCE — ${t} BENCHMARK ═══`,"info"),Qo({mode:e,onProgress:r=>S(`  ${r}...`,"info"),onSecond:(r,n)=>S(`  ${n}`,"info")}).then(r=>{tt=r,ms(r),S(r.suiteError?`SUITE ABORTED: ${r.suiteError}`:`${t} benchmark complete — mode: ${r.timingMode}`,r.suiteError?"err":"ok"),r.suiteError&&S("STOP — a validated kernel failed. Fix correctness before benchmarking.","err")}).catch(r=>S(`ERROR: ${r.message}`,"err")).finally(()=>{D=!1})}catch(t){D=!1,S(`ERROR: ${t.message}`,"err")}}function vs(e){const t=e.querySelector("#perf-panel");t&&(t.innerHTML=`
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
        <input type="checkbox" id="chk-sustained" ${De?"checked":""}>
        enable SUSTAINED 30s run (continuous MatMul load, per-second samples, thermal before/after)
      </label>
    </div>
    <div id="perf-results"></div>
  `,e.querySelector("#btn-perf-quick")?.addEventListener("click",()=>Dt("quick")),e.querySelector("#btn-perf-full")?.addEventListener("click",()=>Dt("full")),e.querySelector("#btn-perf-sustained")?.addEventListener("click",()=>Dt("sustained")),e.querySelector("#chk-sustained")?.addEventListener("change",r=>{De=r.target.checked;try{localStorage.setItem("aether.sustained.armed",De?"1":"0")}catch{}St()}),St())}function ys(e){const t=e.querySelector("#diag-panel");if(!t)return;const r=[["location.href",location.href],["location.hash",location.hash],["location.protocol",location.protocol],["window.isSecureContext",String(window.isSecureContext)],["navigator.userAgent",navigator.userAgent],["AETHER_BUILD_ID",qe],["Built at",et||"n/a"],["Benchmark code revision",qe]];t.innerHTML=r.map(([n,a])=>`<div style="font-size:11px;font-family:var(--mono);word-break:break-all">
        <span style="color:var(--text-dim)">${n}:</span> <b style="color:var(--text)">${a}</b>
      </div>`).join("")}function hs(e){Q=e,Wt=!1,e.innerHTML=`
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
    </div>

    <div id="res-minimal-64"></div>
    <div id="res-minimal-128"></div>

    <div id="validation-panel"></div>
    <div id="report-panel"></div>
    <div id="perf-panel"></div>

    <div class="log" id="bench-log"></div>

    <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;font-family:var(--mono);color:var(--text-dim)">
      <div>AETHER BUILD: <b id="build-id" style="color:var(--text)">${qe}</b></div>
      <div>Git commit: <b id="build-commit" style="color:var(--text)">${ht??"unavailable"}</b></div>
      <div>Build time: <b id="build-time" style="color:var(--text)">${et||"unavailable"}</b></div>
      <div>Environment: GitHub Pages</div>
    </div>
  `,ys(e),e.querySelector("#btn-sanity")?.addEventListener("click",as),e.querySelector("#btn-standalone")?.addEventListener("click",os),e.querySelector("#btn-direct")?.addEventListener("click",ss),e.querySelector("#btn-minimal-64")?.addEventListener("click",()=>Dr(64,"res-minimal-64")),e.querySelector("#btn-minimal-128")?.addEventListener("click",()=>Dr(128,"res-minimal-128")),e.querySelector("#btn-harness")?.addEventListener("click",is);const t=e.querySelector("#btn-correctness");t&&(t.addEventListener("click",us),t.disabled=!xt(),t.textContent=xt()?"CORRECTNESS":"CORRECTNESS (LOCKED)"),vs(e);const r=n=>{n.preventDefault()};window.addEventListener("error",r),window.addEventListener("unhandledrejection",r),Oe().then(n=>{le=n,at();const a=e.querySelector("#device-badge"),o=e.querySelector("#device-info");a&&(a.textContent="WEBGPU READY",a.className="badge badge-pass"),o&&(o.innerHTML=`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
          <span>Adapter:</span><span style="color:var(--text)">${n.adapterName}</span>
          <span>Vendor:</span><span style="color:var(--text)">${n.adapterVendor}</span>
          <span>Features:</span><span style="color:var(--text)">${n.adapterFeatures.length}</span>
          <span>Max Buffer:</span><span style="color:var(--text)">${kr(n.maxBufferSize)}</span>
          <span>Max Storage:</span><span style="color:var(--text)">${kr(n.maxStorageBufferBindingSize)}</span>
          <span>Workgroup X:</span><span style="color:var(--text)">${n.maxComputeWorkgroupSizeX}</span>
          <span>Invocations/wg:</span><span style="color:var(--text)">${n.maxComputeInvocationsPerWorkgroup}</span>
          <span>Timestamp Query:</span><span style="color:var(--text)">${n.timestampQuerySupport?"YES":"NO"}</span>
          <span>Preferred Format:</span><span style="color:var(--text)">${n.preferredCanvasFormat??"N/A"}</span>
          <span>Fallback:</span><span style="color:var(--text)">${n.isFallbackAdapter?"YES (software)":"NO (hardware)"}</span>
        </div>
      `)}).catch(n=>{const a=e.querySelector("#device-badge");a&&(a.textContent="WEBGPU UNAVAILABLE",a.className="badge badge-fail"),S(`WEBGPU not available: ${n.message}`,"err")})}const ws=Object.freeze(Object.defineProperty({__proto__:null,render:hs},Symbol.toStringTag,{value:"Module"}));function xs(e){const t=e.toLowerCase();return t.includes("aether")||t==="external-cache"||t.startsWith("workbox-")||t.includes("webgpu")}async function gn(){if("serviceWorker"in navigator)try{const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(t=>t.unregister().catch(()=>{})))}catch{}}async function bn(){if("caches"in window)try{const e=await caches.keys();await Promise.all(e.filter(xs).map(t=>caches.delete(t).catch(()=>{})))}catch{}}async function Ss(){try{const e=[],t=indexedDB;if(t.databases){const r=await t.databases();for(const n of r)n.name&&n.name.toLowerCase().includes("aether")&&e.push(n.name)}else e.push("aether-gpu-benchmark");for(const r of e)await new Promise(n=>{const a=indexedDB.deleteDatabase(r);a.onsuccess=()=>n(),a.onerror=()=>n(),a.onblocked=()=>n()})}catch{}}async function Ms(){await gn(),await bn()}async function Es(){await gn(),await bn(),await Ss()}const Xt=[{id:"gpubench",label:"GPU Bench",module:ws},{id:"device",label:"Device Test",module:Mn},{id:"webgpudiag",label:"WebGPU Diag",module:wa},{id:"model",label:"Model Test",module:Dn},{id:"tensor",label:"Tensor Bench",module:va},{id:"image",label:"Image Test",module:Gn},{id:"video",label:"Video Test",module:Ln},{id:"diag",label:"Diagnostics",module:Wn}];let vn="gpubench";function Or(){const e=window.location.hash.replace("#","");return Xt.some(t=>t.id===e)?e:e==="diagnostics/webgpu"||e==="webgpu"?"webgpudiag":"gpubench"}function Ot(e){vn=e,window.location.hash=e;const t=document.getElementById("nav"),r=document.getElementById("screen");t.querySelectorAll("button").forEach(a=>{a.classList.toggle("active",a.dataset.screen===e)});const n=Xt.find(a=>a.id===e);n&&n.module.render(r)}function As(){const e=document.getElementById("app");e.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const t=document.getElementById("nav");document.getElementById("screen"),Xt.forEach(n=>{const a=document.createElement("button");a.textContent=n.label,a.dataset.screen=n.id,a.addEventListener("click",()=>Ot(n.id)),t.appendChild(a)});const r=Or();Ot(r),window.addEventListener("hashchange",()=>{const n=Or();n!==vn&&Ot(n)})}function Ps(){const e=document.getElementById("app");e.innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;text-align:center;gap:16px;padding:24px">
      <h2 style="color:var(--green, #22c55e);margin:0">AETHER CACHE RESET COMPLETE</h2>
      <p style="color:var(--text-dim, #9ca3af);margin:0">Please reload AETHER normally.</p>
      <button id="btn-reset-reload" class="btn">Reload AETHER</button>
    </div>
  `,e.querySelector("#btn-reset-reload")?.addEventListener("click",()=>{history.replaceState(null,"",window.location.pathname+window.location.search),window.location.reload()})}async function Gr(){if(window.location.hash==="#reset"){await Es(),Ps();return}await Ms(),As()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>void Gr()):Gr();
