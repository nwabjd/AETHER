(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();function Zr(e){let r="Unknown",t="Unknown",a="Unknown",n="Unknown";const o=e.match(/OS (\d+)_(\d+)/);o&&(a="iOS",n=`${o[1]}.${o[2]}`);const s=e.match(/Mac OS X (\d+)[_.](\d+)/);if(s&&(a="macOS",n=`${s[1]}.${s[2]}`),e.includes("Windows")){a="Windows";const u=e.match(/Windows NT (\d+\.\d+)/);u&&(n=u[1])}if(e.includes("Android")){a="Android";const u=e.match(/Android (\d+[\.\d]*)/);u&&(n=u[1])}if(e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")){r="Safari";const u=e.match(/Version\/(\d+[\.\d]*)/);u&&(t=u[1])}if(e.includes("Chrome")&&!e.includes("Edg")){r="Chrome";const u=e.match(/Chrome\/(\d+[\.\d]*)/);u&&(t=u[1])}if(e.includes("Edg/")){r="Edge";const u=e.match(/Edg\/(\d+[\.\d]*)/);u&&(t=u[1])}if(e.includes("Firefox")){r="Firefox";const u=e.match(/Firefox\/(\d+[\.\d]*)/);u&&(t=u[1])}return{browserName:r,browserVersion:t,osName:a,osVersion:n}}function Jr(e){return!!(e.includes("FBAN")||e.includes("FBIOS")||e.includes("Twitter")||e.includes("Instagram")||e.includes("Line/")||e.includes("WeChat")||e.includes("MicroMessenger")||e.includes("CocoaPods")||e.includes("wv)")||e.includes("Electron")||e.includes("; wv)"))}function et(e){return e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")}async function Oe(){const e=navigator.userAgent,r=Zr(e),t=r.osName==="iOS",a=et(e),n=Jr(e),o=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,s={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:e,platform:navigator.platform,isIOS:t,isSafari:a,isWebView:n,isStandalone:o,browserName:r.browserName,browserVersion:r.browserVersion,osName:r.osName,osVersion:r.osVersion},i={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(n)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:s,gpu:i};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:t?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:s,gpu:i};if(!navigator.gpu){let u="navigator.gpu is undefined. WebGPU API is not exposed.",c="";if(t){if(parseInt(r.osVersion.split(".")[0],10)<26)return u=`iOS ${r.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,c="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i};if(r.browserName!=="Safari")return u=`Running ${r.browserName} on iOS ${r.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,c="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:u,recommendation:c,environment:s,gpu:i}}return r.osName==="macOS"&&parseInt(r.osVersion.split(".")[0],10)<14?(u=`macOS ${r.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,c="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i}):(c="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i})}try{const u=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!u){i.adapterError="requestAdapter() returned null";let d="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",f="";return t?parseInt(r.osVersion.split(".")[0],10)>=26&&(d=`iOS ${r.osVersion} with Safari ${r.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,f="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(d="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",f="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):f="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:d,recommendation:f,environment:s,gpu:i}}i.adapterName=u.name??"Unknown GPU",i.adapterVendor=u.vendor??"Unknown",i.adapterDevice=u.device??"Unknown",i.isFallbackAdapter=u.isFallbackAdapter??!1;const c=[];for(const d of u.features)c.push(d.replace(/-/g," ").replace(/\b\w/g,f=>f.toUpperCase()));i.features=c;const l=u.limits;i.limits={maxBufferSize:l.maxBufferSize,maxTextureDimension1D:l.maxTextureDimension1D,maxTextureDimension2D:l.maxTextureDimension2D,maxTextureDimension3D:l.maxTextureDimension3D,maxComputeWorkgroupStorageSize:l.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:l.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:l.maxStorageBufferBindingSize,maxUniformBufferBindingSize:l.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:l.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:l.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:l.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:l.maxComputeWorkgroupsPerDimension,maxColorAttachments:l.maxColorAttachments,minStorageBufferOffsetAlignment:l.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:l.minUniformBufferOffsetAlignment};try{(await u.requestDevice({requiredLimits:{}})).destroy()}catch(d){return i.deviceError=d.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${i.adapterName}) but requestDevice() failed: ${d.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:s,gpu:i}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${i.adapterName}.`,recommendation:"No action needed.",environment:s,gpu:i}}catch(u){return i.adapterError=u.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${u.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:s,gpu:i}}}function Br(e){const r=[];if(r.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),r.push(""),r.push(`STATUS: ${e.statusLabel}`),r.push(`CASE: ${e.case}`),r.push(`REASON: ${e.reason}`),r.push(`RECOMMENDATION: ${e.recommendation}`),r.push(""),r.push("── ENVIRONMENT ──"),r.push(`  URL: ${e.environment.url}`),r.push(`  Protocol: ${e.environment.protocol}`),r.push(`  Hostname: ${e.environment.hostname}`),r.push(`  Secure Context: ${e.environment.isSecureContext}`),r.push(`  iOS: ${e.environment.isIOS}`),r.push(`  Safari: ${e.environment.isSafari}`),r.push(`  WebView: ${e.environment.isWebView}`),r.push(`  Standalone PWA: ${e.environment.isStandalone}`),r.push(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`),r.push(`  OS: ${e.environment.osName} ${e.environment.osVersion}`),r.push(`  Platform: ${e.environment.platform}`),r.push(`  User Agent: ${e.environment.userAgent}`),r.push(""),r.push("── WEBGPU ──"),r.push(`  navigator.gpu exists: ${e.gpu.navigatorGpuExists}`),e.gpu.adapterName&&r.push(`  Adapter: ${e.gpu.adapterName}`),e.gpu.adapterVendor&&r.push(`  Vendor: ${e.gpu.adapterVendor}`),e.gpu.adapterDevice&&r.push(`  Device: ${e.gpu.adapterDevice}`),e.gpu.adapterError&&r.push(`  Adapter Error: ${e.gpu.adapterError}`),e.gpu.deviceError&&r.push(`  Device Error: ${e.gpu.deviceError}`),r.push(`  Fallback adapter: ${e.gpu.isFallbackAdapter}`),e.gpu.features.length>0){r.push(`  Features (${e.gpu.features.length}):`);for(const t of e.gpu.features)r.push(`    ${t}`)}if(e.gpu.limits){r.push("  Limits:");for(const[t,a]of Object.entries(e.gpu.limits))r.push(`    ${t}: ${typeof a=="number"?a.toLocaleString():a}`)}return r.push(""),r.push(`Timestamp: ${new Date().toISOString()}`),r.join(`
`)}function Pe(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function J(){const e=await Oe();if(!e.ready||!e.gpu.adapterName)return null;const r=e.gpu.limits;return{available:!0,adapterName:e.gpu.adapterName,adapterVendor:e.gpu.adapterVendor,adapterDevice:e.gpu.adapterDevice,features:e.gpu.features,limits:{maxBufferSize:r.maxBufferSize,maxTextureDimension1D:r.maxTextureDimension1D,maxTextureDimension2D:r.maxTextureDimension2D,maxTextureDimension3D:r.maxTextureDimension3D,maxComputeWorkgroupStorageSize:r.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:r.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:r.maxStorageBufferBindingSize,maxUniformBufferBindingSize:r.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:r.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:r.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:r.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:r.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:r.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:r.minUniformBufferOffsetAlignment,maxColorAttachments:r.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:e.gpu.isFallbackAdapter,featuresMap:new Set(e.gpu.features),diagnostic:e}}async function ee(e,r=[]){const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("Failed to re-acquire GPU adapter");const a=await t.requestDevice({requiredFeatures:r.filter(n=>e.featuresMap.has(n)),requiredLimits:{}});return a.lost.then(n=>{console.error("WebGPU device lost:",n.message)}),a}function rt(e){const r=e.environment,t=e.gpu;let a="badge-fail";e.case==="D"?a="badge-pass":(e.case==="B"||e.case==="C")&&(a="badge-warn");let n=`
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
      <div class="row"><span class="row-label">URL</span><span class="row-value" style="font-size:10px;word-break:break-all;max-width:60%">${r.url}</span></div>
      <div class="row"><span class="row-label">Protocol</span><span class="row-value">${r.protocol}</span></div>
      <div class="row"><span class="row-label">Hostname</span><span class="row-value">${r.hostname}</span></div>
      <div class="row"><span class="row-label">Secure Context</span><span class="row-value">${r.isSecureContext?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">Browser</span><span class="row-value">${r.browserName} ${r.browserVersion}</span></div>
      <div class="row"><span class="row-label">OS</span><span class="row-value">${r.osName} ${r.osVersion}</span></div>
      <div class="row"><span class="row-label">Platform</span><span class="row-value">${r.platform}</span></div>
      <div class="row"><span class="row-label">iOS</span><span class="row-value">${r.isIOS?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">Safari</span><span class="row-value">${r.isSafari?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">WebView / In-App</span><span class="row-value">${r.isWebView?"Yes (BLOCKED)":"No"}</span></div>
      <div class="row"><span class="row-label">Standalone PWA</span><span class="row-value">${r.isStandalone?"Yes":"No"}</span></div>
    </div>
  `;return t.adapterName&&(n+=`
      <h3>GPU Adapter</h3>
      <div class="card">
        <div class="row"><span class="row-label">Name</span><span class="row-value">${t.adapterName}</span></div>
        <div class="row"><span class="row-label">Vendor</span><span class="row-value">${t.adapterVendor||"Unknown"}</span></div>
        <div class="row"><span class="row-label">Device</span><span class="row-value">${t.adapterDevice||"Unknown"}</span></div>
        <div class="row"><span class="row-label">Fallback</span><span class="row-value">${t.isFallbackAdapter?"Yes (software)":"No (hardware)"}</span></div>
      </div>
    `),t.adapterError&&(n+=`
      <h3>Adapter Error</h3>
      <div class="card" style="border-color:var(--red)">
        <p style="font-size:13px;color:var(--red)">${t.adapterError}</p>
      </div>
    `),t.deviceError&&(n+=`
      <h3>Device Error</h3>
      <div class="card" style="border-color:var(--red)">
        <p style="font-size:13px;color:var(--red)">${t.deviceError}</p>
      </div>
    `),t.limits&&(n+=`
      <h3>GPU Limits</h3>
      <div class="card">
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${Pe(t.limits.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${t.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${t.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${t.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${Pe(t.limits.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${Pe(t.limits.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${Pe(t.limits.maxComputeWorkgroupStorageSize)}</span></div>
        <div class="row"><span class="row-label">Max invocations/wg</span><span class="row-value">${t.limits.maxComputeInvocationsPerWorkgroup}</span></div>
        <div class="row"><span class="row-label">Max workgroup size</span><span class="row-value">${t.limits.maxComputeWorkgroupSizeX}×${t.limits.maxComputeWorkgroupSizeY}×${t.limits.maxComputeWorkgroupSizeZ}</span></div>
        <div class="row"><span class="row-label">Max workgroups/dim</span><span class="row-value">${t.limits.maxComputeWorkgroupsPerDimension}</span></div>
        <div class="row"><span class="row-label">Max color attachments</span><span class="row-value">${t.limits.maxColorAttachments}</span></div>
        <div class="row"><span class="row-label">Storage buf alignment</span><span class="row-value">${t.limits.minStorageBufferOffsetAlignment} B</span></div>
        <div class="row"><span class="row-label">Uniform buf alignment</span><span class="row-value">${t.limits.minUniformBufferOffsetAlignment} B</span></div>
      </div>
    `),t.features.length>0&&(n+=`
      <h3>Features (${t.features.length})</h3>
      <div class="card">
        ${t.features.map(o=>`<div class="row"><span class="row-value">${o}</span></div>`).join("")}
      </div>
    `),n}function tt(e){e.innerHTML=`
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;const r=e.querySelector("#device-status"),t=e.querySelector("#device-info");Oe().then(a=>{a.ready?r.innerHTML=`
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `:r.innerHTML="",t.innerHTML=rt(a)})}const at=Object.freeze(Object.defineProperty({__proto__:null,render:tt},Symbol.toStringTag,{value:"Module"}));let A=class Er{buffer;shape;dtype;size;device;constructor(r,t,a="f32"){this.device=r,this.shape=[...t],this.dtype=a,this.size=t.reduce((s,i)=>s*i,1);const n=a==="f32"?4:a==="f16"?2:4;this.buffer=r.createBuffer({size:this.size*n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(a==="f32"?new Float32Array(this.buffer.getMappedRange()):a==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(r,t,a){const n=new Er(r,a,t instanceof Float32Array?"f32":"i32");return r.queue.writeBuffer(n.buffer,0,t.buffer),n}async readback(){const r=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t=this.device.createCommandEncoder();t.copyBufferToBuffer(this.buffer,0,r,0,this.buffer.size),this.device.queue.submit([t.finish()]),await r.mapAsync(GPUMapMode.READ);const a=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),a}destroy(){this.buffer.destroy()}};async function be(e,r,t=50,a){const n=[];for(let c=0;c<Math.min(5,t);c++)await r();for(let c=0;c<t;c++){const l=performance.now();await r(),await Mr?.queue.onSubmittedWorkDone();const d=performance.now();n.push(d-l)}n.sort((c,l)=>c-l);const o=n.reduce((c,l)=>c+l,0)/n.length,s=n[0],i=n[n.length-1],u={name:e,avgMs:o,minMs:s,maxMs:i,iterations:t};if(a){const l=a/(o/1e3)/1e9;u.gflops=l,u.throughput=`${l.toFixed(2)} GFLOPS`}return u}let Mr=null;function re(e){Mr=e}function ve(e){const r=[`${e.name}: ${e.avgMs.toFixed(2)} ms avg`,`(${e.minMs.toFixed(2)} – ${e.maxMs.toFixed(2)} ms)`,`[${e.iterations} iterations]`];return e.throughput&&r.push(e.throughput),r.join(" ")}const Ee=`
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
`,nt=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= uniforms.N) { return; }
  data[i] = max(data[i], 0.0);
}
`,ot=`
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
`,st=`
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
`,it=`
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
`,ut=`
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
`;let v=null,ae=null;function C(e,r=""){if(!ae)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,ae.appendChild(t),ae.scrollTop=ae.scrollHeight}async function Je(){C("═══ TINY NEURAL NETWORK TEST ═══","info"),C("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),C("");const e=await J();if(!e)return C("WebGPU not available","err"),!1;v=await ee(e),re(v);const r=performance.now(),t=A.fromData(v,new Float32Array([1,.5,-.3,.8]),[4]),a=A.fromData(v,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),n=A.fromData(v,new Float32Array([.1,-.1,.2]),[3]),o=new ArrayBuffer(12),s=new Uint32Array(o);s[0]=1,s[1]=3,s[2]=4;const i=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:v.createShaderModule({code:Ee}),entryPoint:"main"}}),c=v.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(c,0,o);const l=new A(v,[1,3]),d=v.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:t.buffer}},{binding:2,resource:{buffer:a.buffer}},{binding:3,resource:{buffer:l.buffer}}]});let f=v.createCommandEncoder(),p=f.beginComputePass();p.setPipeline(u),p.setBindGroup(0,d),p.dispatchWorkgroups(1,1,1),p.end(),v.queue.submit([f.finish()]),C(`  input[4]:  [${Array.from(await t.readback()).map(G=>G.toFixed(2)).join(", ")}]`,""),C("  W1[4×3]:   4 rows × 3 cols",""),C("  Matmul result: computing...","");const m=await l.readback();C(`  h1 = input @ W1: [${Array.from(m).map(G=>G.toFixed(3)).join(", ")}]`,"ok");for(let G=0;G<3;G++)m[G]+=[.1,-.1,.2][G];v.queue.writeBuffer(l.buffer,0,m.buffer),C(`  h1 + bias:       [${Array.from(m).map(G=>G.toFixed(3)).join(", ")}]`,"ok");const b=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),g=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[b]}),compute:{module:v.createShaderModule({code:nt}),entryPoint:"main"}}),y=new ArrayBuffer(4);new Uint32Array(y)[0]=3;const w=v.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(w,0,y);const h=v.createBindGroup({layout:b,entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:l.buffer}}]});f=v.createCommandEncoder(),p=f.beginComputePass(),p.setPipeline(g),p.setBindGroup(0,h),p.dispatchWorkgroups(1,1,1),p.end(),v.queue.submit([f.finish()]);const E=await l.readback();C(`  ReLU(h1):         [${Array.from(E).map(G=>G.toFixed(3)).join(", ")}]`,"ok");const B=A.fromData(v,new Float32Array([.7,-.3,.5]),[3,1]),k=new A(v,[1,1]),q=new ArrayBuffer(12),K=new Uint32Array(q);K[0]=1,K[1]=1,K[2]=3;const F=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),ie=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[F]}),compute:{module:v.createShaderModule({code:Ee}),entryPoint:"main"}}),_e=v.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(_e,0,q);const Yr=v.createBindGroup({layout:F,entries:[{binding:0,resource:{buffer:_e}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:B.buffer}},{binding:3,resource:{buffer:k.buffer}}]});f=v.createCommandEncoder(),p=f.beginComputePass(),p.setPipeline(ie),p.setBindGroup(0,Yr),p.dispatchWorkgroups(1,1,1),p.end(),v.queue.submit([f.finish()]);const Xr=await k.readback(),Qr=(performance.now()-r).toFixed(1);return C(`  Final output: ${Xr[0].toFixed(4)}`,"ok"),C(`  Total pipeline: ${Qr} ms`,"ok"),C("",""),C("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),t.destroy(),a.destroy(),n.destroy(),l.destroy(),B.destroy(),k.destroy(),c.destroy(),_e.destroy(),w.destroy(),v.destroy(),!0}async function ct(){C("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const e=await J();if(!e)return null;v=await ee(e),re(v);const r=[64,128,256,512],t=[];for(const a of r){const n=A.fromData(v,new Float32Array(a*a).fill(1),[a,a]),o=A.fromData(v,new Float32Array(a*a).fill(.5),[a,a]),s=new A(v,[a,a]),i=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:v.createShaderModule({code:Ee}),entryPoint:"main"}}),c=new ArrayBuffer(12),l=new Uint32Array(c);l[0]=a,l[1]=a,l[2]=a;const d=await be(`${a}×${a} matmul`,async()=>{const f=v.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(f,0,c);const p=v.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:s.buffer}}]}),m=v.createCommandEncoder(),b=m.beginComputePass();b.setPipeline(u),b.setBindGroup(0,p);const g=Math.ceil(a/16);b.dispatchWorkgroups(g,g,1),b.end(),v.queue.submit([m.finish()]),f.destroy()},30,2*a*a*a);t.push(d),C(ve(d),"ok"),n.destroy(),o.destroy(),s.destroy()}return v.destroy(),t[t.length-1]}async function lt(){C("═══ CONVOLUTION BENCHMARK ═══","info");const e=await J();if(!e)return null;v=await ee(e),re(v);const r=1,t=3,a=32,n=32,o=8,s=3,i=3,u=a-s+1,c=n-i+1,l=A.fromData(v,new Float32Array(r*t*a*n).fill(.5),[r,t,a,n]),d=A.fromData(v,new Float32Array(o*t*s*i).fill(.1),[o,t,s,i]),f=new A(v,[r,o,u,c]),p=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),m=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[p]}),compute:{module:v.createShaderModule({code:ot}),entryPoint:"main"}}),b=new ArrayBuffer(36),g=new Uint32Array(b);g[0]=r,g[1]=t,g[2]=a,g[3]=n,g[4]=o,g[5]=s,g[6]=i,g[7]=u,g[8]=c;const y=await be(`Conv2D ${r}×${t}×${a}×${n} k=${s}→${o}×${u}×${c}`,async()=>{const w=v.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(w,0,b);const h=v.createBindGroup({layout:p,entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:d.buffer}},{binding:3,resource:{buffer:f.buffer}}]}),E=v.createCommandEncoder(),B=E.beginComputePass();B.setPipeline(m),B.setBindGroup(0,h),B.dispatchWorkgroups(r,o,1),B.end(),v.queue.submit([E.finish()]),w.destroy()},20,2*r*o*t*s*i*u*c);return C(ve(y),"ok"),l.destroy(),d.destroy(),f.destroy(),v.destroy(),y}async function dt(){C("═══ ATTENTION BENCHMARK ═══","info");const e=await J();if(!e)return null;v=await ee(e),re(v);const r=1,t=64,a=64,n=1/Math.sqrt(a),o=A.fromData(v,new Float32Array(r*t*a).fill(.1),[r,t,a]),s=A.fromData(v,new Float32Array(r*t*a).fill(.1),[r,t,a]),i=A.fromData(v,new Float32Array(r*t*a).fill(.1),[r,t,a]),u=new A(v,[r,t,a]),c=new A(v,[r,t,t]),l=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),d=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[l]}),compute:{module:v.createShaderModule({code:st}),entryPoint:"main"}}),f=new ArrayBuffer(16),p=new Uint32Array(f),m=new Float32Array(f);p[0]=r,p[1]=t,p[2]=a,m[3]=n;const b=await be(`Attention b=${r} s=${t} d=${a}`,async()=>{const g=v.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(g,0,f);const y=v.createBindGroup({layout:l,entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}},{binding:4,resource:{buffer:u.buffer}},{binding:5,resource:{buffer:c.buffer}}]}),w=v.createCommandEncoder(),h=w.beginComputePass();h.setPipeline(d),h.setBindGroup(0,y),h.dispatchWorkgroups(r,1,1),h.end(),v.queue.submit([w.finish()]),g.destroy()},20);return C(ve(b),"ok"),o.destroy(),s.destroy(),i.destroy(),u.destroy(),c.destroy(),v.destroy(),b}function ft(e){e.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,ae=e.querySelector("#model-log"),e.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{ae.innerHTML="",await Je()}),e.querySelector("#btn-all-bench").addEventListener("click",async()=>{ae.innerHTML="",await Je(),C("",""),await ct(),C("",""),await lt(),C("",""),await dt(),C("",""),C("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const pt=Object.freeze(Object.defineProperty({__proto__:null,render:ft},Symbol.toStringTag,{value:"Module"}));let P=null,Z=null;function W(e,r=""){if(!Z)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,Z.appendChild(t),Z.scrollTop=Z.scrollHeight}function Tr(e,r){const t=new Float32Array(e*r*4);for(let a=0;a<r;a++)for(let n=0;n<e;n++){const o=(a*e+n)*4,s=(n>>4)+(a>>4)&1;t[o+0]=s?.9:n/e*.8,t[o+1]=s?.3:a/r*.6,t[o+2]=s?.6:.4,t[o+3]=1}return t}function Re(e,r,t){const a=document.createElement("canvas");a.width=r,a.height=t;const n=a.getContext("2d"),o=n.createImageData(r,t);for(let s=0;s<r*t*4;s++)o.data[s]=Math.round(e[s]*255);return n.putImageData(o,0,0),a}async function er(){W("═══ GRAYSCALE TEST ═══","info");const e=await J();if(!e){W("WebGPU unavailable","err");return}P=await ee(e),re(P);const r=256,t=256,a=Tr(r,t),n=A.fromData(P,a,[r*t*4]),o=new A(P,[r*t*4]),s=P.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=P.createComputePipeline({layout:P.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:P.createShaderModule({code:ut}),entryPoint:"main"}}),u=new ArrayBuffer(4);new Uint32Array(u)[0]=r*t;const c=await be("Grayscale 256×256",async()=>{const m=P.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});P.queue.writeBuffer(m,0,u);const b=P.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:o.buffer}}]}),g=P.createCommandEncoder(),y=g.beginComputePass();y.setPipeline(i),y.setBindGroup(0,b),y.dispatchWorkgroups(Math.ceil(r*t/256),1,1),y.end(),P.queue.submit([g.finish()]),m.destroy()},50);W(ve(c),"ok");const l=await o.readback(),d=Re(a,r,t),f=Re(l,r,t),p=je?.querySelector("#image-display");if(p){p.innerHTML="";const m=document.createElement("div");m.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const b=document.createElement("div");b.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',b.appendChild(d);const g=document.createElement("div");g.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',g.appendChild(f),m.appendChild(b),m.appendChild(g),p.appendChild(m)}n.destroy(),o.destroy(),P.destroy(),W("✓ Grayscale complete","ok")}async function rr(){W("═══ CONVOLUTION KERNEL TEST ═══","info");const e=await J();if(!e){W("WebGPU unavailable","err");return}P=await ee(e),re(P);const r=128,t=128,a=3,n=Tr(r,t),o={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},s=P.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=P.createComputePipeline({layout:P.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:P.createShaderModule({code:it}),entryPoint:"main"}}),u=new ArrayBuffer(16),c=new Uint32Array(u);c[0]=r,c[1]=t,c[2]=a,c[3]=0;for(const[l,d]of Object.entries(o)){const f=A.fromData(P,n,[r*t*4]),p=A.fromData(P,d,[a*a]),m=new A(P,[r*t*4]),b=await be(`Conv ${l} ${r}×${t}`,async()=>{const w=P.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});P.queue.writeBuffer(w,0,u);const h=P.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:p.buffer}},{binding:2,resource:{buffer:f.buffer}},{binding:3,resource:{buffer:m.buffer}}]}),E=P.createCommandEncoder(),B=E.beginComputePass();B.setPipeline(i),B.setBindGroup(0,h),B.dispatchWorkgroups(Math.ceil(r/16),Math.ceil(t/16),1),B.end(),P.queue.submit([E.finish()]),w.destroy()},30);W(ve(b),"ok");const g=await m.readback(),y=je?.querySelector("#image-display");if(y){const w=Re(g,r,t),h=document.createElement("div");h.style.cssText="display:inline-block;margin:4px",h.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${l}</div>`,h.appendChild(w),y.appendChild(h)}f.destroy(),p.destroy(),m.destroy()}P.destroy(),W("✓ All convolution kernels applied","ok")}let je=null;function mt(e){je=e,e.innerHTML=`
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
  `,Z=e.querySelector("#image-log"),e.querySelector("#btn-grayscale").addEventListener("click",async()=>{Z.innerHTML="",e.querySelector("#image-display").innerHTML="",await er()}),e.querySelector("#btn-conv").addEventListener("click",async()=>{Z.innerHTML="",e.querySelector("#image-display").innerHTML="",await rr()}),e.querySelector("#btn-all-img").addEventListener("click",async()=>{Z.innerHTML="",e.querySelector("#image-display").innerHTML="",await er(),W("",""),await rr(),W("",""),W("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const gt=Object.freeze(Object.defineProperty({__proto__:null,render:mt},Symbol.toStringTag,{value:"Module"}));let T=null,xe=null,Ue=null;function Fe(e,r=""){if(!xe)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,xe.appendChild(t),xe.scrollTop=xe.scrollHeight}const bt=`
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
`;let ze=0,Ae=0;async function vt(e,r,t,a,n){const o=await J();if(!o){Fe("WebGPU unavailable","err");return}T=await ee(o),re(T);const[s,i]=a.value.split("x").map(Number);e.width=s,e.height=i,ze=parseInt(n.value);const u=T.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=T.createComputePipeline({layout:T.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:T.createShaderModule({code:bt}),entryPoint:"main"}}),l=T.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),d=e.getContext("2d"),f=T.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let p=performance.now(),m=0,b=0;r.textContent="RENDERING",r.className="badge badge-pass";function g(){const y=new ArrayBuffer(16),w=new Uint32Array(y);w[0]=s,w[1]=i,w[2]=Ae,w[3]=ze,T.queue.writeBuffer(f,0,y);const h=T.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:l}}]}),E=T.createCommandEncoder(),B=E.beginComputePass();B.setPipeline(c),B.setBindGroup(0,h),B.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(i/16),1),B.end();const k=T.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});E.copyBufferToBuffer(l,0,k,0,s*i*4*4),T.queue.submit([E.finish()]),k.mapAsync(GPUMapMode.READ).then(()=>{const q=new Float32Array(k.getMappedRange().slice(0));k.unmap(),k.destroy();const K=d.createImageData(s,i);for(let ie=0;ie<s*i*4;ie++)K.data[ie]=Math.round(q[ie]*255);d.putImageData(K,0,0),Ae++,b++;const F=performance.now();F-p>=1e3&&(m=Math.round(b*1e3/(F-p)),t.textContent=`${m} FPS | Frame ${Ae} | ${s}×${i}`,b=0,p=F),Ue=requestAnimationFrame(g)})}g()}function tr(){Ue!==null&&(cancelAnimationFrame(Ue),Ue=null),T&&(T.destroy(),T=null)}function yt(e){e.innerHTML=`
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
  `,xe=e.querySelector("#video-log");const r=e.querySelector("#video-canvas"),t=e.querySelector("#video-status"),a=e.querySelector("#video-fps"),n=e.querySelector("#res-select"),o=e.querySelector("#mode-select");e.querySelector("#btn-start").addEventListener("click",()=>{tr(),Ae=0,ze=parseInt(o.value),Fe(`Starting GPU compute video: ${n.value} mode=${o.value}`,"info"),vt(r,t,a,n,o)}),e.querySelector("#btn-stop").addEventListener("click",()=>{tr(),t.textContent="STOPPED",t.className="badge badge-info",Fe("Rendering stopped","warn")})}const wt=Object.freeze(Object.defineProperty({__proto__:null,render:yt},Symbol.toStringTag,{value:"Module"}));let de=null;function S(e,r=""){if(!de)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,de.appendChild(t),de.scrollTop=de.scrollHeight}async function ht(){if(de.innerHTML="",S("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),S(`Timestamp: ${new Date().toISOString()}`,""),!await xt())return;const r=await J();if(!r){S("Cannot proceed: GPU not ready","err");return}S("",""),S("── MEMORY TEST ──","info");const t=await ee(r);re(t);const a=Math.floor(r.limits.maxBufferSize/1048576);S(`Attempting to allocate buffer at reported max: ${a} MB`,"");try{const n=t.createBuffer({size:r.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});S("Buffer allocation at max: SUCCESS","ok"),n.destroy()}catch(n){S(`Buffer allocation at max: FAILED — ${n.message}`,"warn");for(const o of[256,128,64,32])try{const s=t.createBuffer({size:o*1048576,usage:GPUBufferUsage.STORAGE});S(`Largest successful allocation: ${o} MB`,"ok"),s.destroy();break}catch{continue}}S("",""),S("── COMPUTE THROUGHPUT ──","info");for(const n of[64,128,256]){const o=A.fromData(t,new Float32Array(n*n).fill(1),[n,n]),s=A.fromData(t,new Float32Array(n*n).fill(1),[n,n]),i=new A(t,[n,n]),u=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=t.createComputePipeline({layout:t.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:t.createShaderModule({code:Ee}),entryPoint:"main"}}),l=await be(`matmul ${n}×${n}`,async()=>{const d=t.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),f=new ArrayBuffer(12);new Uint32Array(f).set([n,n,n]),t.queue.writeBuffer(d,0,f);const p=t.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),m=t.createCommandEncoder(),b=m.beginComputePass();b.setPipeline(c),b.setBindGroup(0,p);const g=Math.ceil(n/16);b.dispatchWorkgroups(g,g,1),b.end(),t.queue.submit([m.finish()]),d.destroy()},30,2*n*n*n);S(ve(l),"ok"),o.destroy(),s.destroy(),i.destroy()}t.destroy(),S("",""),S("═══ DIAGNOSTICS COMPLETE ═══","info")}async function xt(){const e=await Oe();return Br(e),S("── WEBGPU STATUS ──","info"),S(`${e.statusLabel} (Case ${e.case})`,e.ready?"ok":"err"),S(`Reason: ${e.reason}`,""),S(`Recommendation: ${e.recommendation}`,""),S("",""),S("── ENVIRONMENT ──","info"),S(`  URL: ${e.environment.url}`,""),S(`  Secure Context: ${e.environment.isSecureContext}`,e.environment.isSecureContext?"ok":"err"),S(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`,""),S(`  OS: ${e.environment.osName} ${e.environment.osVersion}`,""),S(`  iOS: ${e.environment.isIOS}`,""),S(`  Safari: ${e.environment.isSafari}`,""),S(`  WebView: ${e.environment.isWebView}`,e.environment.isWebView?"err":""),S(`  navigator.gpu: ${e.gpu.navigatorGpuExists}`,e.gpu.navigatorGpuExists?"ok":"err"),e.gpu.adapterName&&(S(`  Adapter: ${e.gpu.adapterName}`,"ok"),S(`  Vendor: ${e.gpu.adapterVendor}`,"")),e.gpu.adapterError&&S(`  Adapter Error: ${e.gpu.adapterError}`,"err"),e.gpu.deviceError&&S(`  Device Error: ${e.gpu.deviceError}`,"err"),e.ready?!0:(S("",""),S("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function St(e){e.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,de=e.querySelector("#diag-log"),e.querySelector("#btn-diag").addEventListener("click",()=>{ht()})}const Pt=Object.freeze(Object.defineProperty({__proto__:null,render:St},Symbol.toStringTag,{value:"Module"}));class Q{dims;ndim;size;strides;constructor(r){this.dims=typeof r=="number"?[r]:[...r],this.ndim=this.dims.length,this.size=this.dims.reduce((n,o)=>n*o,1);const t=new Array(this.ndim);let a=1;for(let n=this.ndim-1;n>=0;n--)t[n]=a,a*=this.dims[n];this.strides=t}equals(r){if(this.ndim!==r.ndim)return!1;for(let t=0;t<this.ndim;t++)if(this.dims[t]!==r.dims[t])return!1;return!0}isContiguous(){let r=1;for(let t=this.ndim-1;t>=0;t--){if(this.strides[t]!==r)return!1;r*=this.dims[t]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new Q([1])}static from(...r){return new Q(r)}}var H=(e=>(e.Float32="f32",e.Float16="f16",e.Int32="i32",e.Int8="i8",e.Uint8="u8",e))(H||{});const Ct={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function $r(e){return Ct[e].bytes}let z=null;async function Ut(){if(z)return z;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const r=e.limits,t=new Set(e.features),a=await e.requestDevice({requiredLimits:{}});return a.lost.then(n=>{console.error("WebGPU device lost:",n.message),z=null}),z={adapter:e,device:a,limits:{maxBufferSize:r.maxBufferSize,maxTextureDimension1D:r.maxTextureDimension1D,maxTextureDimension2D:r.maxTextureDimension2D,maxTextureDimension3D:r.maxTextureDimension3D,maxComputeWorkgroupStorageSize:r.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:r.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:r.maxStorageBufferBindingSize,maxUniformBufferBindingSize:r.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:r.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:r.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:r.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:r.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:r.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:r.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:r.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:r.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:r.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:r.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:r.minStorageBufferOffsetAlignment,maxColorAttachments:r.maxColorAttachments,maxTextureArrayLayers:r.maxTextureArrayLayers},features:t},z}function M(){if(!z)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return z}function At(){z&&(z.device.destroy(),z=null)}class fe{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(r,t,a){this.shape=r,this.dtype=t,this.byteSize=r.size*$r(t),this.gpuBuffer=a??M().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(r,t,a=H.Float32){const n=M(),o=new fe(r,a);return n.device.queue.writeBuffer(o.gpuBuffer,0,t.buffer,t.byteOffset,t.byteLength),o}async readback(){const r=M(),t=r.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),a=r.device.createCommandEncoder();a.copyBufferToBuffer(this.gpuBuffer,0,t,0,this.byteSize),r.device.queue.submit([a.finish()]),await t.mapAsync(GPUMapMode.READ);const n=new Float32Array(t.getMappedRange().slice(0));return t.unmap(),t.destroy(),n}destroy(){this.gpuBuffer.destroy()}}class x{shape;dtype;buffer;constructor(r,t=H.Float32,a){this.shape=r,this.dtype=t,this.buffer=a??new fe(r,t)}static fromFloat32(r,t){const a=r instanceof Float32Array?r:new Float32Array(r),n=new Q(t);return new x(n,H.Float32,fe.fromData(n,a,H.Float32))}static fromInt32(r,t){const a=r instanceof Int32Array?r:new Int32Array(r),n=new Q(t);return new x(n,H.Int32,fe.fromData(n,a,H.Int32))}static zeros(r,t=H.Float32){const a=new Q(r),n=a.size*$r(t),s=M().device.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(s.getMappedRange()).fill(0),s.unmap();const i=new fe(a,t,s);return new x(a,t,i)}static ones(r,t=H.Float32){const a=new Q(r).size,n=new Float32Array(a).fill(1);return x.fromFloat32(n,r)}static randn(r){const t=new Q(r).size,a=new Float32Array(t);for(let n=0;n<t;n++){const o=Math.random(),s=Math.random();a[n]=Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*s)}return x.fromFloat32(a,r)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class Bt{cache=new Map;getOrCreate(r,t,a){if(this.cache.has(r))return this.cache.get(r);const n=M(),o=n.device.createComputePipeline({layout:n.device.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:n.device.createShaderModule({code:t}),entryPoint:"main"}});return this.cache.set(r,o),o}get(r){return this.cache.get(r)}clear(){this.cache.clear()}}const Et=`
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
`,Mt=`
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
`,Tt=`
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
`,$t=`
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
`,kt=`
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
`,Gt=`
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
`,Dt=`
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
`,Ot=`
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
`,Nt=`
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
`,_t=`
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
`;function Lt(e,r,t,a,n){const o=new Float32Array(t*a);for(let s=0;s<t;s++)for(let i=0;i<a;i++){let u=0;for(let c=0;c<n;c++)u+=e[s*n+c]*r[c*a+i];o[s*a+i]=u}return o}function Wt(e,r){const t=new Float32Array(e.length);for(let a=0;a<e.length;a++)t[a]=e[a]+r[a];return t}function Rt(e,r){const t=new Float32Array(e.length);for(let a=0;a<e.length;a++)t[a]=e[a]*r[a];return t}function Ft(e,r,t=1e-6){const a=e.length;let n=0;for(let i=0;i<a;i++)n+=e[i]*e[i];const o=Math.sqrt(n/a+t),s=new Float32Array(a);for(let i=0;i<a;i++)s[i]=e[i]/o*r[i];return s}function zt(e,r,t,a=1e-6){const n=e.length;let o=0;for(let c=0;c<n;c++)o+=e[c];o/=n;let s=0;for(let c=0;c<n;c++){const l=e[c]-o;s+=l*l}s/=n;const i=1/Math.sqrt(s+a),u=new Float32Array(n);for(let c=0;c<n;c++)u[c]=(e[c]-o)*i*r[c]+t[c];return u}function It(e,r,t){const a=new Float32Array(e.length);for(let n=0;n<r;n++){const o=n*t;let s=-1e30;for(let u=0;u<t;u++)e[o+u]>s&&(s=e[o+u]);let i=0;for(let u=0;u<t;u++)a[o+u]=Math.exp(e[o+u]-s),i+=a[o+u];for(let u=0;u<t;u++)a[o+u]/=i}return a}function qt(e,r,t,a=1e4){const n=new Float32Array(e.length);n.set(e);for(let o=0;o<r*t/2;o++){const s=Math.floor(o/(t/2)),i=o%(t/2),u=1/Math.pow(a,i/t),c=s*u,l=Math.cos(c),d=Math.sin(c),f=o*2,p=o*2+1,m=n[f],b=n[p];n[f]=m*l-b*d,n[p]=m*d+b*l}return n}function Ht(e,r,t,a,n,o,s,i,u){const c=n-i+1,l=o-u+1,d=new Float32Array(t*s*c*l);for(let f=0;f<t;f++)for(let p=0;p<s;p++)for(let m=0;m<c;m++)for(let b=0;b<l;b++){let g=0;for(let y=0;y<a;y++)for(let w=0;w<i;w++)for(let h=0;h<u;h++)g+=e[((f*a+y)*n+m+w)*o+b+h]*r[((p*a+y)*i+w)*u+h];d[((f*s+p)*c+m)*l+b]=g}return d}function jt(e,r,t){const a=new Float32Array(r*t);for(let n=0;n<r;n++)for(let o=0;o<t;o++)a[o*r+n]=e[n*t+o];return a}function Vt(e,r,t,a,n,o){const s=new Float32Array(a*n*o);for(let i=0;i<n;i++)for(let u=0;u<a;u++){const c=u*r/a,l=i*t/n,d=Math.floor(c),f=Math.floor(l),p=Math.min(d+1,r-1),m=Math.min(f+1,t-1),b=c-d,g=l-f;for(let y=0;y<o;y++){const w=e[(f*r+d)*o+y],h=e[(f*r+p)*o+y],E=e[(m*r+d)*o+y],B=e[(m*r+p)*o+y];s[(i*a+u)*o+y]=w*(1-b)*(1-g)+h*b*(1-g)+E*(1-b)*g+B*b*g}}return s}const I=new Bt;function V(e){return M().device.createBindGroupLayout({entries:Array.from({length:e},(t,a)=>({binding:a,visibility:GPUShaderStage.COMPUTE,buffer:a===0?{type:"uniform"}:{type:"storage"}}))})}function Ne(e){const r=M(),t=r.device.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.device.queue.writeBuffer(t,0,e),t}function oe(e,r,t,a,n,o){const s=M(),i=Ne(n),u=[{binding:0,resource:{buffer:i}},...a.map((d,f)=>({binding:f+1,resource:{buffer:d.buffer.gpuBuffer}}))],c=s.device.createBindGroup({layout:t,entries:u}),l=e.beginComputePass();return l.setPipeline(r),l.setBindGroup(0,c),l.dispatchWorkgroups(o),l.end(),i}async function ue(e,r,t,a,n){const o=M(),s=x.zeros([t,a]),i=V(4),u=I.getOrCreate("matmul",Et,i),c=new ArrayBuffer(12),l=new Uint32Array(c);l[0]=t,l[1]=a,l[2]=n;const d=o.device.createCommandEncoder();return oe(d,u,i,[e,r,s],c,Math.ceil(t/16)*Math.ceil(a/16)),o.device.queue.submit([d.finish()]),s}function ce(e,r,t,a,n){return Lt(e,r,t,a,n)}async function ar(e,r){const t=M(),a=x.zeros([e.shape.size]),n=V(4),o=I.getOrCreate("add",Mt,n),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=t.device.createCommandEncoder();return oe(i,o,n,[e,r,a],s,Math.ceil(e.shape.size/256)),t.device.queue.submit([i.finish()]),a}function nr(e,r){return Wt(e,r)}async function or(e,r){const t=M(),a=x.zeros([e.shape.size]),n=V(4),o=I.getOrCreate("multiply",Tt,n),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=t.device.createCommandEncoder();return oe(i,o,n,[e,r,a],s,Math.ceil(e.shape.size/256)),t.device.queue.submit([i.finish()]),a}function sr(e,r){return Rt(e,r)}async function ir(e,r,t=1e-6){const a=M(),n=e.shape.size,o=x.zeros([n]),s=V(4),i=I.getOrCreate("rms_norm",$t,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=n,new Float32Array(u)[1]=t;const c=a.device.createCommandEncoder();return oe(c,i,s,[e,r,o],u,1),a.device.queue.submit([c.finish()]),o}function ur(e,r,t=1e-6){return Ft(e,r,t)}async function cr(e,r,t,a=1e-6){const n=M(),o=e.shape.size,s=x.zeros([o]),i=n.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=I.getOrCreate("layer_norm",kt,i),c=new ArrayBuffer(8);new Uint32Array(c)[0]=o,new Float32Array(c)[1]=a;const l=M(),d=Ne(c),f=l.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:e.buffer.gpuBuffer}},{binding:2,resource:{buffer:r.buffer.gpuBuffer}},{binding:3,resource:{buffer:t.buffer.gpuBuffer}},{binding:4,resource:{buffer:s.buffer.gpuBuffer}}]}),p=l.device.createCommandEncoder(),m=p.beginComputePass();return m.setPipeline(u),m.setBindGroup(0,f),m.dispatchWorkgroups(1),m.end(),l.device.queue.submit([p.finish()]),s}function lr(e,r,t,a=1e-6){return zt(e,r,t,a)}async function dr(e,r,t){const a=M(),n=x.zeros([r,t]),o=a.device.createCommandEncoder();o.copyBufferToBuffer(e.buffer.gpuBuffer,0,n.buffer.gpuBuffer,0,r*t*4);const s=V(2),i=I.getOrCreate("softmax",Gt,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=r,new Uint32Array(u)[1]=t;const c=Ne(u),l=a.device.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:n.buffer.gpuBuffer}}]}),d=o.beginComputePass();return d.setPipeline(i),d.setBindGroup(0,l),d.dispatchWorkgroups(Math.ceil(r)),d.end(),a.device.queue.submit([o.finish()]),n}function fr(e,r,t){return It(e,r,t)}async function pr(e,r,t,a=1e4){const n=M(),o=x.zeros([r,t]),s=n.device.createCommandEncoder();s.copyBufferToBuffer(e.buffer.gpuBuffer,0,o.buffer.gpuBuffer,0,r*t*4);const i=V(2),u=I.getOrCreate("rope",Dt,i),c=new ArrayBuffer(12);new Uint32Array(c)[0]=r,new Uint32Array(c)[1]=t,new Float32Array(c)[2]=a;const l=Ne(c),d=n.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:o.buffer.gpuBuffer}}]}),f=s.beginComputePass();return f.setPipeline(u),f.setBindGroup(0,d),f.dispatchWorkgroups(Math.ceil(r*t/2/256)),f.end(),n.device.queue.submit([s.finish()]),o}function mr(e,r,t,a=1e4){return qt(e,r,t,a)}async function gr(e,r,t,a,n,o,s,i,u){const c=M(),l=n-i+1,d=o-u+1,f=x.zeros([t,s,l,d]),p=V(4),m=I.getOrCreate("conv2d",Ot,p),b=new ArrayBuffer(36),g=new Uint32Array(b);g[0]=t,g[1]=a,g[2]=n,g[3]=o,g[4]=s,g[5]=i,g[6]=u,g[7]=l,g[8]=d;const y=c.device.createCommandEncoder();return oe(y,m,p,[e,r,f],b,t*s),c.device.queue.submit([y.finish()]),f}function br(e,r,t,a,n,o,s,i,u){return Ht(e,r,t,a,n,o,s,i,u)}async function vr(e,r,t){const a=M(),n=x.zeros([t,r]),o=V(3),s=I.getOrCreate("transpose_2d",Nt,o),i=new ArrayBuffer(8);new Uint32Array(i)[0]=r,new Uint32Array(i)[1]=t;const u=a.device.createCommandEncoder();return oe(u,s,o,[e,n],i,Math.ceil(r/16)*Math.ceil(t/16)),a.device.queue.submit([u.finish()]),n}function yr(e,r,t){return jt(e,r,t)}async function wr(e,r,t,a,n,o){const s=M(),i=x.zeros([n*a*o]),u=V(3),c=I.getOrCreate("interpolate_bilinear",_t,u),l=new ArrayBuffer(20),d=new Uint32Array(l);d[0]=r,d[1]=t,d[2]=a,d[3]=n,d[4]=o;const f=s.device.createCommandEncoder();return oe(f,c,u,[e,i],l,Math.ceil(a/16)*Math.ceil(n/16)),s.device.queue.submit([f.finish()]),i}function hr(e,r,t,a,n,o){return Vt(e,r,t,a,n,o)}let pe=null,Me=null;function L(e,r=""){if(!pe)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,pe.appendChild(t),pe.scrollTop=pe.scrollHeight}function D(e,r,t=.001){if(e.length!==r.length)return!1;for(let a=0;a<e.length;a++){const n=Math.abs(e[a]-r[a]),o=Math.max(Math.abs(e[a]),Math.abs(r[a]),1e-8);if(n/o>t)return!1}return!0}async function O(e,r,t=20){for(let n=0;n<3;n++)r();const a=[];for(let n=0;n<t;n++){const o=performance.now();r(),a.push(performance.now()-o)}return a.reduce((n,o)=>n+o,0)/a.length}async function N(e,r,t=20){const a=[];for(let n=0;n<Math.min(5,t);n++)await r();for(let n=0;n<t;n++){const o=performance.now();await r(),a.push(performance.now()-o)}return a.reduce((n,o)=>n+o,0)/a.length}function Kt(e){if(!Me)return;const r=document.createElement("tr");r.innerHTML=`
    <td style="font-weight:600">${e.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${e.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${e.speedup>=1?"var(--green)":"var(--red)"}">
      ${e.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${e.correct?"badge-pass":"badge-fail"}">${e.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${e.tolerance.toExponential(1)}</td>
  `,Me.appendChild(r)}async function Yt(){pe.innerHTML="",Me.innerHTML="",L("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),L("Initializing WebGPU...","");let e;try{e=await Ut()}catch(a){L(`FATAL: ${a.message}`,"err"),L("WebGPU is not available. Cannot run GPU benchmarks.","err");return}L(`GPU: ${e.adapter.name??"Unknown"}`,"ok"),L(`Running benchmarks...
`,"");const r=[];{const s=x.randn([64,64]),i=x.randn([64,64]),u=await s.readback(),c=await i.readback(),l=await O("matmul 64",()=>ce(u,c,64,64,64)),d=await N("matmul 64",async()=>{(await ue(s,i,64,64,64)).destroy()}),f=await(await ue(s,i,64,64,64)).readback(),p=ce(u,c,64,64,64),m=D(p,f),b=Math.max(...Array.from(p).map((g,y)=>Math.abs(g-f[y])));r.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:b}),s.destroy(),i.destroy()}{const s=x.randn([256,256]),i=x.randn([256,256]),u=await s.readback(),c=await i.readback(),l=await O("matmul 256",()=>ce(u,c,256,256,256),10),d=await N("matmul 256",async()=>{(await ue(s,i,256,256,256)).destroy()}),f=await(await ue(s,i,256,256,256)).readback(),p=ce(u,c,256,256,256),m=D(p,f),b=Math.max(...Array.from(p).map((g,y)=>Math.abs(g-f[y])));r.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:b}),s.destroy(),i.destroy()}{const s=x.randn([512,512]),i=x.randn([512,512]),u=await s.readback(),c=await i.readback(),l=await O("matmul 512",()=>ce(u,c,512,512,512),5),d=await N("matmul 512",async()=>{(await ue(s,i,512,512,512)).destroy()}),f=await(await ue(s,i,512,512,512)).readback(),p=ce(u,c,512,512,512),m=D(p,f),b=Math.max(...Array.from(p).map((g,y)=>Math.abs(g-f[y])));r.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:b}),s.destroy(),i.destroy()}{const n=x.randn([1e6]),o=x.randn([1e6]),s=await n.readback(),i=await o.readback(),u=await O("add 1M",()=>nr(s,i)),c=await N("add 1M",async()=>{(await ar(n,o)).destroy()}),l=await(await ar(n,o)).readback(),d=nr(s,i),f=D(d,l),p=Math.max(...Array.from(d).map((m,b)=>Math.abs(m-l[b])));r.push({name:"Add",shape:"[1000000]",cpuMs:u,gpuMs:c,speedup:u/c,correct:f,tolerance:p}),n.destroy(),o.destroy()}{const n=x.randn([1e6]),o=x.randn([1e6]),s=await n.readback(),i=await o.readback(),u=await O("mul 1M",()=>sr(s,i)),c=await N("mul 1M",async()=>{(await or(n,o)).destroy()}),l=await(await or(n,o)).readback(),d=sr(s,i),f=D(d,l),p=Math.max(...Array.from(d).map((m,b)=>Math.abs(m-l[b])));r.push({name:"Multiply",shape:"[1000000]",cpuMs:u,gpuMs:c,speedup:u/c,correct:f,tolerance:p}),n.destroy(),o.destroy()}{const n=x.randn([1024]),o=x.ones([1024]),s=await n.readback(),i=await o.readback(),u=await O("rmsnorm",()=>ur(s,i)),c=await N("rmsnorm",async()=>{(await ir(n,o)).destroy()}),l=await(await ir(n,o)).readback(),d=ur(s,i),f=D(d,l),p=Math.max(...Array.from(d).map((m,b)=>Math.abs(m-l[b])));r.push({name:"RMSNorm",shape:"[1024]",cpuMs:u,gpuMs:c,speedup:u/c,correct:f,tolerance:p}),n.destroy(),o.destroy()}{const n=x.randn([1024]),o=x.ones([1024]),s=x.zeros([1024]),i=await n.readback(),u=await o.readback(),c=await s.readback(),l=await O("layernorm",()=>lr(i,u,c)),d=await N("layernorm",async()=>{(await cr(n,o,s)).destroy()}),f=await(await cr(n,o,s)).readback(),p=lr(i,u,c),m=D(p,f),b=Math.max(...Array.from(p).map((g,y)=>Math.abs(g-f[y])));r.push({name:"LayerNorm",shape:"[1024]",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:b}),n.destroy(),o.destroy(),s.destroy()}{const o=x.randn([32,128]),s=await o.readback(),i=await O("softmax",()=>fr(new Float32Array(s),32,128)),u=await N("softmax",async()=>{(await dr(x.fromFloat32(new Float32Array(s),[32,128]),32,128)).destroy()}),c=await(await dr(x.fromFloat32(new Float32Array(s),[32,128]),32,128)).readback(),l=fr(new Float32Array(s),32,128),d=D(l,c),f=Math.max(...Array.from(l).map((p,m)=>Math.abs(p-c[m])));r.push({name:"Softmax",shape:"[32, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:f}),o.destroy()}{const o=x.randn([16,128]),s=await o.readback(),i=await O("rope",()=>mr(new Float32Array(s),16,128)),u=await N("rope",async()=>{(await pr(x.fromFloat32(new Float32Array(s),[16,128]),16,128)).destroy()}),c=await(await pr(x.fromFloat32(new Float32Array(s),[16,128]),16,128)).readback(),l=mr(new Float32Array(s),16,128),d=D(l,c),f=Math.max(...Array.from(l).map((p,m)=>Math.abs(p-c[m])));r.push({name:"RoPE",shape:"[16, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:f}),o.destroy()}{const l=x.randn([1,3,16,16]),d=x.randn([4,3,3,3]),f=await l.readback(),p=await d.readback(),m=await O("conv2d",()=>br(f,p,1,3,16,16,4,3,3)),b=await N("conv2d",async()=>{(await gr(l,d,1,3,16,16,4,3,3)).destroy()}),g=await(await gr(l,d,1,3,16,16,4,3,3)).readback(),y=br(f,p,1,3,16,16,4,3,3),w=D(y,g),h=Math.max(...Array.from(y).map((E,B)=>Math.abs(E-g[B])));r.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:m,gpuMs:b,speedup:m/b,correct:w,tolerance:h}),l.destroy(),d.destroy()}{const o=x.randn([256,256]),s=await o.readback(),i=await O("transpose",()=>yr(s,256,256)),u=await N("transpose",async()=>{(await vr(o,256,256)).destroy()}),c=await(await vr(o,256,256)).readback(),l=yr(s,256,256),d=D(l,c),f=Math.max(...Array.from(l).map((p,m)=>Math.abs(p-c[m])));r.push({name:"Transpose",shape:"[256, 256]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:f}),o.destroy()}{const u=x.randn([3072]),c=await u.readback(),l=await O("interp",()=>hr(c,32,32,64,64,3)),d=await N("interp",async()=>{(await wr(u,32,32,64,64,3)).destroy()}),f=await(await wr(u,32,32,64,64,3)).readback(),p=hr(c,32,32,64,64,3),m=D(p,f),b=Math.max(...Array.from(p).map((g,y)=>Math.abs(g-f[y])));r.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:b}),u.destroy()}L("",""),L("═══ RESULTS ═══","info");for(const a of r){Kt(a);const n=a.correct?"✓":"✗",o=a.correct?"ok":"err";L(`${n} ${a.name} (${a.shape}): CPU ${a.cpuMs.toFixed(2)} ms | GPU ${a.gpuMs.toFixed(2)} ms | ${a.speedup.toFixed(1)}× | max diff ${a.tolerance.toExponential(1)}`,o)}const t=r.filter(a=>a.correct).length;L("",""),L(`═══ ${t}/${r.length} CORRECT ═══`,t===r.length?"ok":"err"),At()}function Xt(e){e.innerHTML=`
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
  `,pe=e.querySelector("#bench-log"),Me=e.querySelector("#bench-tbody"),e.querySelector("#btn-run-bench").addEventListener("click",()=>{Yt()})}const Qt=Object.freeze(Object.defineProperty({__proto__:null,render:Xt},Symbol.toStringTag,{value:"Module"}));let Y=null,Ce="";function Zt(e){const r=e.environment,t=e.gpu,a=e.case==="D"?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)";let n=`
    <div style="text-align:center;margin:20px 0">
      <div style="font-size:28px;font-weight:800;color:${a};letter-spacing:1px">${e.statusLabel}</div>
      <div style="font-size:14px;color:var(--text-dim);margin-top:8px">Case ${e.case}</div>
    </div>

    <div class="card" style="border-color:${a}">
      <div class="card-title" style="margin-bottom:8px">Diagnosis</div>
      <p style="font-size:13px;color:var(--text);line-height:1.6">${e.reason}</p>
      <p style="font-size:13px;color:var(--text);margin-top:10px;font-weight:600;line-height:1.6">${e.recommendation}</p>
    </div>
  `;if(n+=`
    <h3>Environment</h3>
    <div class="card">
      <div class="row"><span class="row-label">URL</span><span class="row-value" style="font-size:10px;word-break:break-all;max-width:55%;text-align:right">${r.url}</span></div>
      <div class="row"><span class="row-label">Protocol</span><span class="row-value">${r.protocol}</span></div>
      <div class="row"><span class="row-label">Hostname</span><span class="row-value">${r.hostname}</span></div>
      <div class="row"><span class="row-label">Secure Context</span><span class="row-value" style="color:${r.isSecureContext?"var(--green)":"var(--red)"}">${r.isSecureContext?"Yes ✓":"No ✗"}</span></div>
      <div class="row"><span class="row-label">Browser</span><span class="row-value">${r.browserName} ${r.browserVersion}</span></div>
      <div class="row"><span class="row-label">OS</span><span class="row-value">${r.osName} ${r.osVersion}</span></div>
      <div class="row"><span class="row-label">Platform</span><span class="row-value">${r.platform}</span></div>
      <div class="row"><span class="row-label">iOS Device</span><span class="row-value">${r.isIOS?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">Safari</span><span class="row-value">${r.isSafari?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">WebView / In-App Browser</span><span class="row-value" style="color:${r.isWebView?"var(--red)":"var(--green)"}">${r.isWebView?"Yes (BLOCKED)":"No"}</span></div>
      <div class="row"><span class="row-label">Standalone PWA</span><span class="row-value">${r.isStandalone?"Yes":"No"}</span></div>
    </div>
  `,n+=`
    <h3>WebGPU API</h3>
    <div class="card">
      <div class="row"><span class="row-label">navigator.gpu</span><span class="row-value" style="color:${t.navigatorGpuExists?"var(--green)":"var(--red)"}">${t.navigatorGpuExists?"Exists ✓":"Undefined ✗"}</span></div>
  `,t.adapterName&&(n+=`
      <div class="row"><span class="row-label">Adapter</span><span class="row-value">${t.adapterName}</span></div>
      <div class="row"><span class="row-label">Vendor</span><span class="row-value">${t.adapterVendor||"Unknown"}</span></div>
      <div class="row"><span class="row-label">Device</span><span class="row-value">${t.adapterDevice||"Unknown"}</span></div>
      <div class="row"><span class="row-label">Fallback</span><span class="row-value">${t.isFallbackAdapter?"Yes (software)":"No (hardware)"}</span></div>
    `),t.adapterError&&(n+=`<div class="row"><span class="row-label">Adapter Error</span><span class="row-value" style="color:var(--red)">${t.adapterError}</span></div>`),t.deviceError&&(n+=`<div class="row"><span class="row-label">Device Error</span><span class="row-value" style="color:var(--red)">${t.deviceError}</span></div>`),n+="</div>",t.limits){const o=t.limits,s=i=>i>=1073741824?`${(i/1073741824).toFixed(1)} GB`:i>=1048576?`${(i/1048576).toFixed(1)} MB`:i>=1024?`${(i/1024).toFixed(1)} KB`:`${i} B`;n+=`
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
    `}return t.features.length>0&&(n+=`
      <h3>Features (${t.features.length})</h3>
      <div class="card">
        ${t.features.map(o=>`<div class="row"><span class="row-value">${o}</span></div>`).join("")}
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
  `,n}function Jt(e){e.innerHTML=`
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;const r=e.querySelector("#wgdiag-result");Y=e.querySelector("#btn-copy-report"),e.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{r.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',Y.disabled=!0;const t=await Oe();Ce=Br(t),r.innerHTML=Zt(t),Y.disabled=!1}),Y.addEventListener("click",async()=>{if(Ce)try{await navigator.clipboard.writeText(Ce),Y.textContent="Copied!",setTimeout(()=>{Y.textContent="Copy Diagnostics"},2e3)}catch{const t=document.createElement("textarea");t.value=Ce,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t),Y.textContent="Copied!",setTimeout(()=>{Y.textContent="Copy Diagnostics"},2e3)}}),e.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const ea=Object.freeze(Object.defineProperty({__proto__:null,render:Jt},Symbol.toStringTag,{value:"Module"})),ra=typeof GPUShaderStage<"u"?GPUShaderStage.COMPUTE:4;function ta(e,r=ra){return e.map((t,a)=>({binding:a,visibility:r,buffer:{type:t}}))}function kr(e,r){return e.createBindGroupLayout({entries:ta(r)})}function aa(e,r,t="bind group"){if(e.length!==r.length)throw new Error(`${t} binding count mismatch: pipeline layout declares ${e.length} bindings but ${r.length} entries were provided.`)}let Se=null,te=null,Te=null,Ie=null;async function Ve(){if(te&&!Se&&(te=null),te)return te;if(!navigator.gpu)throw new Error("WebGPU not supported");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const r=e.features.has("timestamp-query"),t=await e.requestDevice({requiredFeatures:r?["timestamp-query"]:[],requiredLimits:{}});Te=null,Ie=null,t.lost.then(s=>{console.error("Benchmark device lost:",s.reason,s.message),Te=s.reason??"unknown",Ie=s.message??"",Se=null,te=null}),Se=t;let a=null;try{a=navigator.gpu.getPreferredCanvasFormat()}catch{}const n=e.limits,o=[];for(const s of e.features)o.push(s);return te={webgpuAvailable:!0,adapterName:e.name??"Unknown",adapterVendor:e.vendor??"Unknown",adapterDevice:e.device??"Unknown",adapterFeatures:o,adapterLimits:{maxBufferSize:n.maxBufferSize,maxTextureDimension1D:n.maxTextureDimension1D,maxTextureDimension2D:n.maxTextureDimension2D,maxTextureDimension3D:n.maxTextureDimension3D,maxComputeWorkgroupStorageSize:n.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:n.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:n.maxStorageBufferBindingSize,maxUniformBufferBindingSize:n.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:n.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:n.maxComputeWorkgroupsPerDimension,maxColorAttachments:n.maxColorAttachments,minStorageBufferOffsetAlignment:n.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:n.minUniformBufferOffsetAlignment},preferredCanvasFormat:a,maxBufferSize:n.maxBufferSize,maxStorageBufferBindingSize:n.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:n.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:n.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:n.maxComputeWorkgroupsPerDimension,timestampQuerySupport:r,isFallbackAdapter:e.isFallbackAdapter??!1},te}function se(){if(!Se)throw new Error("Benchmark not initialized. Call initBenchmark() first.");return Se}function na(){return{reason:Te,message:Ie}}function ge(){return Te!==null}function ye(e){const r=se(),t=r.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(t,0,e),t}function j(e,r){const t=se(),a=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(r){const n=t.createBuffer({size:Math.max(e,r.byteLength),usage:a,mappedAtCreation:!0});return new Float32Array(n.getMappedRange()).set(r),n.unmap(),n}return t.createBuffer({size:e,usage:a})}function oa(e,r,t){const a=se();if(r.length===0)throw new Error("createPipeline: bindingTypes must be non-empty (uniform / read-only-storage / storage)");const n=kr(a,r),o=a.createShaderModule({code:e}),s=a.createComputePipeline({layout:a.createPipelineLayout({bindGroupLayouts:[n]}),compute:{module:o,entryPoint:"main"}}),i=u=>t?.({bindingTypes:r,compilationMessages:u,pipelineLayoutInspected:!0});return typeof o.getCompilationInfo=="function"&&o.getCompilationInfo().then(u=>i(u.messages)).catch(()=>i([])),s}function sa(e,r,t){const a=se();aa(r,t,"createBindGroupForPipeline");const n=e.getBindGroupLayout(0);return a.createBindGroup({layout:n,entries:t})}const ia=`
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
`,Gr=`
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
`,ua=`
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
`,ca=`
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
`,la=`
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
`,da=`
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
`,fa=["uniform","read-only-storage","read-only-storage","storage"],Dr=["uniform","read-only-storage","read-only-storage","storage"],pa=["uniform","read-only-storage","read-only-storage","storage"],ma=["uniform","read-only-storage","storage"],ga=["uniform","read-only-storage","read-only-storage","storage"],ba=["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"];function va(e,r){try{return e.pushErrorScope(r),!0}catch{return!1}}async function xr(e,r){let t=null;for(let a=0;a<r;a++)try{const n=await e.popErrorScope();n&&!t&&(t=n)}catch{}return t}function ya(e,r){let t;const a=new Promise((n,o)=>{t=window.setTimeout(()=>o(new Error(`GPU operation timed out after ${r}ms`)),r)});return Promise.race([e,a]).finally(()=>{t!==void 0&&window.clearTimeout(t)})}async function wa(e){const r=se(),t=["validation","out-of-memory","internal"];let a=0;for(const o of t)va(r,o)&&a++;let n="encode";try{const o=r.createBuffer({size:e.outputBytes,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});n="encode";const s=r.createCommandEncoder(),i=s.beginComputePass();n="dispatch",i.setPipeline(e.pipeline),i.setBindGroup(0,e.bindGroup),i.dispatchWorkgroups(...e.workgroups),i.end(),n="submit",s.copyBufferToBuffer(e.outputBuffer,0,o,0,e.outputBytes),r.queue.submit([s.finish()]),n="readback",await ya(o.mapAsync(GPUMapMode.READ),15e3);const u=new Float32Array(o.getMappedRange().slice(0));o.unmap(),o.destroy();const c=await xr(r,a);if(c)return{pass:!1,error:`GPU Error: ${c.message}`,stage:"submit",errorType:c.type??null};n="validation";const l=e.validator(u);return{pass:l.pass,error:l.pass?null:l.error,stage:l.pass?"complete":"validation",errorType:l.pass?null:"output-mismatch"}}catch(o){return await xr(r,a),{pass:!1,error:o.message,stage:n,errorType:"exception"}}}function ha(e,r){const t=new Float32Array(e.length);for(let a=0;a<e.length;a++)t[a]=e[a]+r[a];return t}function xa(e,r,t,a,n){const o=new Float32Array(t*a);for(let s=0;s<t;s++)for(let i=0;i<a;i++){let u=0;for(let c=0;c<n;c++)u+=e[s*n+c]*r[c*a+i];o[s*a+i]=u}return o}function Sa(e,r,t,a,n,o,s,i,u){const c=n-i+1,l=o-u+1,d=new Float32Array(t*s*c*l);for(let f=0;f<t;f++)for(let p=0;p<s;p++)for(let m=0;m<c;m++)for(let b=0;b<l;b++){let g=0;for(let y=0;y<a;y++)for(let w=0;w<i;w++)for(let h=0;h<u;h++)g+=e[((f*a+y)*n+m+w)*o+b+h]*r[((p*a+y)*i+w)*u+h];d[((f*s+p)*c+m)*l+b]=g}return d}function Pa(e,r,t){const a=new Float32Array(e.length);for(let n=0;n<r;n++){const o=n*t;let s=-1e30;for(let u=0;u<t;u++)e[o+u]>s&&(s=e[o+u]);let i=0;for(let u=0;u<t;u++){const c=Math.exp(e[o+u]-s);a[o+u]=c,i+=c}for(let u=0;u<t;u++)a[o+u]/=i}return a}function Ca(e,r,t){const a=e.length;let n=0;for(let i=0;i<a;i++)n+=e[i]*e[i];const o=Math.sqrt(n/a+t),s=new Float32Array(a);for(let i=0;i<a;i++)s[i]=e[i]/o*r[i];return s}function Ua(e,r,t,a,n,o,s){const i=new Float32Array(a*n*o);for(let u=0;u<a;u++)for(let c=0;c<n;c++){const l=[];let d=-1e30;for(let m=0;m<n;m++){let b=0;for(let y=0;y<o;y++)b+=e[(u*n+c)*o+y]*r[(u*n+m)*o+y];const g=b*s;l.push(g),g>d&&(d=g)}let f=0;const p=l.map(m=>{const b=Math.exp(m-d);return f+=b,b});for(let m=0;m<n;m++){const b=p[m]/f;for(let g=0;g<o;g++)i[(u*n+c)*o+g]+=b*t[(u*n+m)*o+g]}}return i}function Aa(e,r,t){const a=e.length!==r.length,n=Math.min(e.length,r.length);let o=!0,s=-1,i=0,u=-1,c=null,l=null,d=1/0,f=-1/0,p=1/0,m=-1/0;for(let g=0;g<n;g++){const y=e[g],w=r[g];if(!Number.isFinite(y)){o=!1,s<0&&(s=g);continue}w<d&&(d=w),w>f&&(f=w),y<p&&(p=y),y>m&&(m=y);const h=Math.abs(y-w);h>i&&(i=h,u=g,c=w,l=y)}if(o){for(let g=n;g<e.length;g++)if(!Number.isFinite(e[g])){o=!1,s=g;break}}const b=!a&&o&&u>=0&&i<=t;return{maxError:i,errorIndex:u,cpuValue:c,gpuValue:l,expectedRange:d===1/0||f===-1/0?null:[d,f],actualRange:p===1/0||m===-1/0?null:[p,m],nonFiniteIndex:s,allFinite:o,lengthMismatch:a,pass:b}}function Ba(e,r,t){const a=new Float32Array(r);for(let n=0;n<r;n++){let o=0;for(let s=0;s<t;s++)o+=e[n*t+s];a[n]=o}return a}const qe=[];let Sr=!1;function Or(){if(!Sr)try{se().addEventListener("uncapturederror",r=>{const t=r.error;t&&qe.push(t.message)}),Sr=!0}catch{}}function Nr(){const e=qe.slice();return qe.length=0,e}function R(e){return j(e.byteLength,e)}function Pr(e,r,t,a){return{config:e,pass:!1,stage:r,errorType:t,errorMessage:a,maxError:-1,errorIndex:-1,cpuValue:null,gpuValue:null,expectedRange:null,actualRange:null,nonFiniteIndex:-1}}async function we(e){let r=null,t="pipeline",a=null,n=null;try{t="pipeline";const o=oa(e.code,e.bindingTypes);t="bind-group";const s=sa(o,e.bindingTypes,e.entries),i=await wa({name:e.name,pipeline:o,bindGroup:s,workgroups:e.workgroups,outputBuffer:e.outputBuffer,outputBytes:e.outputBytes,validator:d=>(r=d,{pass:!0,error:""})});if(t=i.stage,!i.pass)return Pr(e.config,t,i.errorType??"gpu-error",i.error??"GPU execution failed");if(r===null)throw new Error("GPU returned no data after readback");t="validation";const u=Aa(r,e.reference,e.tolerance),c=e.extraCheck?e.extraCheck(r):null,l=u.pass&&c===null;return l||(u.allFinite?u.lengthMismatch?(a="shape-mismatch",n=`GPU length ${r.length} != CPU reference length ${e.reference.length}`):u.pass?(a="constraint",n=c??"output constraint violated"):(a="output-mismatch",n=`max abs error ${u.maxError.toExponential(3)} at index ${u.errorIndex} (cpu ${u.cpuValue?.toExponential(4)??"n/a"}, gpu ${u.gpuValue?.toExponential(4)??"n/a"})`):(a="non-finite",n=`non-finite output at index ${u.nonFiniteIndex}`)),{config:e.config,pass:l,stage:l?"complete":"validation",errorType:l?null:a,errorMessage:l?null:n,maxError:u.maxError,errorIndex:u.errorIndex,cpuValue:u.cpuValue,gpuValue:u.gpuValue,expectedRange:u.expectedRange,actualRange:u.actualRange,nonFiniteIndex:u.nonFiniteIndex}}catch(o){return Pr(e.config,t,a??"exception",n??o.message)}finally{try{e.dispose()}catch{}}}function he(e,r){const t=r.length>0&&r.every(o=>o.pass),a=r.reduce((o,s)=>Math.max(o,s.maxError),0),n=r.map(o=>`${o.config}:${o.pass?"PASS":"FAIL"}`).join(" ");return{name:e,pass:t,maxError:t?a:-1,details:n,cases:r}}async function Ea(e){const r=new Float32Array(e).fill(1),t=new Float32Array(e).fill(2),a=R(r),n=R(t),o=j(e*4),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e;const i=ye(s);return we({name:"VecAdd",config:`N=${e}`,code:ia,bindingTypes:fa,workgroups:[Math.ceil(e/64),1,1],entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:o}}],outputBuffer:o,outputBytes:e*4,reference:ha(r,t),tolerance:1e-5,dispose:()=>{a.destroy(),n.destroy(),o.destroy(),i.destroy()}})}async function Ma(){const e=[];for(const r of[64,1024,65536])if(e.push(await Ea(r)),!e[e.length-1].pass)break;return he("VecAdd",e)}async function Ta(e){const r=new Float32Array(e*e).fill(1),t=new Float32Array(e*e).fill(.5),a=R(r),n=R(t),o=j(e*e*4),s=new ArrayBuffer(12),i=new Uint32Array(s);i[0]=e,i[1]=e,i[2]=e;const u=ye(s);return we({name:"Matmul",config:`${e}×${e}`,code:Gr,bindingTypes:Dr,workgroups:[Math.ceil(e/16),Math.ceil(e/16),1],entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:o}}],outputBuffer:o,outputBytes:e*e*4,reference:xa(r,t,e,e,e),tolerance:.001,dispose:()=>{a.destroy(),n.destroy(),o.destroy(),u.destroy()}})}async function _r(){const e=[];for(const r of[32,64,128])if(e.push(await Ta(r)),!e[e.length-1].pass)break;return he("Matmul",e)}function $a(e){if(e===1){const y=new Float32Array(25);for(let h=0;h<y.length;h++)y[h]=h+1;const w=new Float32Array([1,0,-1,1,0,-1,1,0,-1]);return{config:"5×5→3×3",N:1,C:1,H:5,W:5,F:1,FH:3,FW:3,input:y,kernel:w}}const r=1,t=2,a=3,n=3,o=1,s=2,i=2,u=new Float32Array(r*t*a*n);for(let l=0;l<u.length;l++)u[l]=l+1;const c=new Float32Array(o*t*s*i).fill(1);return{config:"C=2 (channel indexing)",N:r,C:t,H:a,W:n,F:o,FH:s,FW:i,input:u,kernel:c}}async function ka(e){const r=$a(e),{N:t,C:a,H:n,W:o,F:s,FH:i,FW:u}=r,c=n-i+1,l=o-u+1,d=t*s*c*l*4,f=R(r.input),p=R(r.kernel),m=j(d),b=new ArrayBuffer(9*4),g=new Uint32Array(b);g[0]=t,g[1]=a,g[2]=n,g[3]=o,g[4]=s,g[5]=i,g[6]=u,g[7]=c,g[8]=l;const y=ye(b);return we({name:"Conv2D",config:r.config,code:ua,bindingTypes:pa,workgroups:[t,s,c*l],entries:[{binding:0,resource:{buffer:y}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:m}}],outputBuffer:m,outputBytes:d,reference:Sa(r.input,r.kernel,t,a,n,o,s,i,u),tolerance:1e-4,dispose:()=>{f.destroy(),p.destroy(),m.destroy(),y.destroy()}})}async function Ga(){const e=[];for(const r of[1,2])if(e.push(await ka(r)),!e[e.length-1].pass)break;return he("Conv2D",e)}function Da(e){if(e===1)return{rows:2,cols:5,data:new Float32Array([-2,-1,0,1,2,2,1,0,-1,-2])};const r=4,t=16,a=new Float32Array(r*t);for(let n=0;n<a.length;n++)a[n]=n%t*.1-1;return{rows:r,cols:t,data:a}}async function Oa(e){const r=Da(e),t=r.rows,a=r.cols,n=r.data.byteLength,o=j(n,r.data),s=j(n),i=new ArrayBuffer(8);new Uint32Array(i)[0]=t,new Uint32Array(i)[1]=a;const u=ye(i);return we({name:"Softmax",config:`${t}×${a}`,code:ca,bindingTypes:ma,workgroups:[t,1,1],entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}}],outputBuffer:s,outputBytes:n,reference:Pa(r.data,t,a),tolerance:1e-4,extraCheck:c=>{for(let d=0;d<c.length;d++)if(c[d]<-1e-6)return`negative softmax output ${c[d].toExponential(3)} at index ${d}`;const l=Ba(c,t,a);for(let d=0;d<t;d++)if(Math.abs(l[d]-1)>1e-4)return`row ${d} sums to ${l[d].toExponential(3)} (expected ≈ 1)`;return null},dispose:()=>{o.destroy(),s.destroy(),u.destroy()}})}async function Na(){const e=[];for(const r of[1,2])if(e.push(await Oa(r)),!e[e.length-1].pass)break;return he("Softmax",e)}function _a(e){if(e===1)return{N:8,input:new Float32Array([1,2,3,4,5,6,7,8]),weight:new Float32Array(8).fill(1),eps:1e-6};const r=128,t=new Float32Array(r);for(let a=0;a<r;a++)t[a]=a*37%11*.5+.1;return{N:r,input:t,weight:new Float32Array(r).fill(1),eps:1e-6}}async function La(e){const r=_a(e),t=r.N,a=R(r.input),n=R(r.weight),o=j(t*4),s=new ArrayBuffer(8);new Uint32Array(s)[0]=t,new Float32Array(s)[1]=r.eps;const i=ye(s);return we({name:"RMSNorm",config:`N=${t}`,code:la,bindingTypes:ga,workgroups:[1,1,1],entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:o}}],outputBuffer:o,outputBytes:t*4,reference:Ca(r.input,r.weight,r.eps),tolerance:.001,dispose:()=>{a.destroy(),n.destroy(),o.destroy(),i.destroy()}})}async function Wa(){const e=[];for(const r of[1,2])if(e.push(await La(r)),!e[e.length-1].pass)break;return he("RMSNorm",e)}function Ra(e){const t=e===1?4:8,a=t,n=1/Math.sqrt(a),o=()=>{const s=new Float32Array(1*t*a);for(let i=0;i<s.length;i++)s[i]=(i%a+1)*.1;return s};return{batch:1,seq:t,dim:a,scale:n,Q:o(),K:o(),V:o()}}async function Fa(e){const r=Ra(e),{batch:t,seq:a,dim:n,scale:o}=r,s=t*a*n,i=t*a*a,u=R(r.Q),c=R(r.K),l=R(r.V),d=j(s*4),f=j(i*4),p=new ArrayBuffer(16),m=new Uint32Array(p),b=new Float32Array(p);m[0]=t,m[1]=a,m[2]=n,b[3]=o;const g=ye(p);return we({name:"Attention",config:`b${t}-s${a}-d${n}`,code:da,bindingTypes:ba,workgroups:[t,1,1],entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:l}},{binding:4,resource:{buffer:d}},{binding:5,resource:{buffer:f}}],outputBuffer:d,outputBytes:s*4,reference:Ua(r.Q,r.K,r.V,t,a,n,o),tolerance:.001,dispose:()=>{u.destroy(),c.destroy(),l.destroy(),d.destroy(),f.destroy(),g.destroy()}})}async function za(){const e=[];for(const r of[1,2])if(e.push(await Fa(r)),!e[e.length-1].pass)break;return he("Attention",e)}async function Ia(e){Or();const r=[{key:"vectorAdd",name:"VecAdd",fn:Ma},{key:"matmul",name:"Matmul",fn:_r},{key:"conv2d",name:"Conv2D",fn:Ga},{key:"softmax",name:"Softmax",fn:Na},{key:"rmsNorm",name:"RMSNorm",fn:Wa},{key:"attention",name:"Attention",fn:za}],t=[];for(const a of r){if(ge()){t.push({name:a.name,pass:!1,maxError:-1,details:"ABORTED — device lost",cases:[]});break}const n=await a.fn();if(t.push(n),e?.(n),ge())break}return t}const qa=["validation","out-of-memory","internal"];function Lr(e){try{if(typeof GPUOutOfMemoryError<"u"&&e instanceof GPUOutOfMemoryError)return"out-of-memory";if(typeof GPUInternalError<"u"&&e instanceof GPUInternalError)return"internal";if(typeof GPUValidationError<"u"&&e instanceof GPUValidationError)return"validation"}catch{}const r=e;return typeof r.name=="string"&&r.name?r.name:"validation"}async function Wr(){if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const r=await e.requestDevice(),t=[],a={reason:null,message:null};return r.addEventListener("uncapturederror",n=>{const o=n.error;t.push({type:Lr(o),message:o.message})}),r.lost.then(n=>{a.reason=n.reason??"unknown",a.message=n.message??""}),{device:r,uncaptured:t,lost:a}}function Rr(e){let r=0;for(const t of qa)try{e.pushErrorScope(t),r++}catch{}return r}async function $e(e,r){const t=[];for(let a=0;a<r;a++)try{const n=await e.popErrorScope();n&&t.push({type:Lr(n),message:n.message})}catch{}return t}async function Fr(e,r){try{return{ok:!0,value:await r()}}catch(t){return{ok:!1,stage:e,error:t instanceof Error?t.message:String(t)}}}const Ha=`
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
`,Le=[6,8,10,12];async function ja(){const e={name:"GPU Sanity",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"[6, 8, 10, 12]",actual:null,exception:null};let r=null,t=0,a=!1,n=null;const o=await Fr("request-device",()=>Wr());if(!o.ok)return e.stage=o.stage,e.errorType="exception",e.errorMessage=o.error,e;r=o.value,e.stage="request-device";try{if(r.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${r.lost.reason}: ${r.lost.message??""}`,e;t=Rr(r.device);const u=new Float32Array([1,2,3,4]),c=new Float32Array([5,6,7,8]),l=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const d=r.device.createBuffer({size:16,usage:l,mappedAtCreation:!0});new Float32Array(d.getMappedRange()).set(u),d.unmap();const f=r.device.createBuffer({size:16,usage:l,mappedAtCreation:!0});new Float32Array(f.getMappedRange()).set(c),f.unmap();const p=r.device.createBuffer({size:16,usage:l}),m=r.device.createBuffer({size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});e.stage="create-pipeline";const b=r.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),g=r.device.createComputePipeline({layout:r.device.createPipelineLayout({bindGroupLayouts:[b]}),compute:{module:r.device.createShaderModule({code:Ha}),entryPoint:"main"}});e.stage="create-bind-group";const y=r.device.createBindGroup({layout:b,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}}]});e.stage="encode-submit";const w=r.device.createCommandEncoder(),h=w.beginComputePass();h.setPipeline(g),h.setBindGroup(0,y),h.dispatchWorkgroups(1,1,1),h.end(),w.copyBufferToBuffer(p,0,m,0,16),r.device.queue.submit([w.finish()]),e.stage="readback",await m.mapAsync(GPUMapMode.READ);const E=new Float32Array(m.getMappedRange().slice(0));m.unmap(),m.destroy(),e.stage="validate-output",e.scopeErrors=await $e(r.device,t),a=!0,n=Array.from(E),e.actual=n.join(", "),d.destroy(),f.destroy(),p.destroy()}catch(u){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=u instanceof Error?u.message:String(u)}finally{if(r&&t>0&&!a)try{e.scopeErrors=await $e(r.device,t)}catch{}}if(e.uncaptured=r.uncaptured,r.lost.reason&&!e.scopeErrors.length&&!e.errorMessage)return e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${r.lost.reason}: ${r.lost.message??""}`,e;if(e.scopeErrors.length>0)return e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e;if(e.uncaptured.length>0)return e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e;if(e.errorMessage)return e.pass=!1,e;const s=n??[],i=s.length===Le.length&&Le.every((u,c)=>Math.abs(s[c]-u)<1e-6);return e.pass=i,i||(e.errorType="output-mismatch",e.errorMessage=`expected [${Le.join(", ")}], got ${e.actual}`),e}async function Va(){const e={name:"Standalone MatMul 64×64",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"all elements = 32.0",actual:null,exception:null};let r=null,t=0,a=!1,n=null;const o=await Fr("request-device",()=>Wr());if(!o.ok)return e.stage=o.stage,e.errorType="exception",e.errorMessage=o.error,e;r=o.value,e.stage="request-device";try{if(r.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${r.lost.reason}: ${r.lost.message??""}`,e;t=Rr(r.device);const s=64,i=64,u=s*s,c=new Float32Array(u).fill(1),l=new Float32Array(u).fill(.5),d=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const f=r.device.createBuffer({size:c.byteLength,usage:d,mappedAtCreation:!0});new Float32Array(f.getMappedRange()).set(c),f.unmap();const p=r.device.createBuffer({size:l.byteLength,usage:d,mappedAtCreation:!0});new Float32Array(p.getMappedRange()).set(l),p.unmap();const m=r.device.createBuffer({size:u*4,usage:d}),b=r.device.createBuffer({size:u*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),g=new ArrayBuffer(16),y=new Uint32Array(g);y[0]=s,y[1]=s,y[2]=i;const w=r.device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.device.queue.writeBuffer(w,0,g),e.stage="create-pipeline";const h=kr(r.device,Dr),E=r.device.createComputePipeline({layout:r.device.createPipelineLayout({bindGroupLayouts:[h]}),compute:{module:r.device.createShaderModule({code:Gr}),entryPoint:"main"}});e.stage="create-bind-group";const B=r.device.createBindGroup({layout:h,entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:m}}]});e.stage="encode-submit";const k=r.device.createCommandEncoder(),q=k.beginComputePass();q.setPipeline(E),q.setBindGroup(0,B),q.dispatchWorkgroups(4,4,1),q.end(),k.copyBufferToBuffer(m,0,b,0,u*4),r.device.queue.submit([k.finish()]),e.stage="readback",await b.mapAsync(GPUMapMode.READ);const K=new Float32Array(b.getMappedRange().slice(0));b.unmap(),b.destroy(),e.stage="validate-output",e.scopeErrors=await $e(r.device,t),a=!0,n=0;for(let F=0;F<u;F++)n=Math.max(n,Math.abs(K[F]-32));e.actual=`max err = ${n.toExponential(2)}`,f.destroy(),p.destroy(),m.destroy(),w.destroy()}catch(s){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=s instanceof Error?s.message:String(s)}finally{if(r&&t>0&&!a)try{e.scopeErrors=await $e(r.device,t)}catch{}}return e.uncaptured=r.uncaptured,r.lost.reason&&!e.scopeErrors.length&&!e.errorMessage?(e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${r.lost.reason}: ${r.lost.message??""}`,e):e.scopeErrors.length>0?(e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e):e.uncaptured.length>0?(e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e):e.errorMessage?(e.pass=!1,e):(e.pass=n!==null&&n<.001,e.pass||(e.errorType="output-mismatch",e.errorMessage=`expected all elements = 32.0, got ${e.actual}`),e)}function zr(...e){for(const r of e)if(r)return r}const Be=zr("fdb2fd7f5e106d27a426c242e5cf7f8c05d6c78a"),Ir=zr("2026-09-07T06:07:24.144Z"),ke=Be??Ir??`dev-${Date.now().toString(36)}`,qr=Be&&/^[0-9a-f]{40}$/.test(Be)?Be:null,Ke=Ir??"";let ne=null,_=!1,He=!1,X=null;const me={sanity:!1,standaloneMatmul:!1,harnessMatmul:!1};function Ge(){return me.sanity&&me.standaloneMatmul&&me.harnessMatmul}function Ye(){const e=ne?.querySelector("#btn-correctness");if(!e)return;const r=Ge();e.disabled=!r,e.textContent=r?"CORRECTNESS":"CORRECTNESS (LOCKED)"}function U(e,r=""){if(!ne)return;const t=ne.querySelector("#bench-log");if(!t)return;const a=document.createElement("div");a.className=`log-entry ${r}`,a.textContent=e,t.appendChild(a),t.scrollTop=t.scrollHeight}function Cr(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function De(){const e=na();U(`WEBGPU DEVICE LOST — reason: ${e.reason??"unknown"} — message: ${e.message??""}`,"err"),U("Remaining tests stopped.","err")}function Xe(){if(!He)try{const e=se();e.addEventListener("uncapturederror",r=>{const t=r.error;U(`UNCAPTURED GPU ERROR: ${t?.message??"unknown"}`,"err")}),e.lost.then(r=>{U(`WEBGPU DEVICE LOST — reason: ${r.reason} — message: ${r.message}`,"err")}),He=!0}catch{}}function Qe(e,r){const t=ne?.querySelector(`#${e}`);if(!t)return;const a=[r.stage?`<div>stage: <b style="color:var(--text)">${$(r.stage)}</b></div>`:"",r.pass?"":r.errorType?`<div>error type: <b style="color:var(--red)">${$(r.errorType)}</b></div>`:"",r.pass?"":r.errorMessage?`<div>error message: <b style="color:var(--red)">${$(r.errorMessage)}</b></div>`:"",...r.notes.map(n=>`<div style="color:var(--text-dim)">${$(n)}</div>`)].join("");t.innerHTML=`
    <div class="card" style="border-color:${r.pass?"var(--green)":"var(--red)"};margin-top:12px">
      <div class="card-header">
        <span class="card-title">${$(r.title)}</span>
        <span class="badge ${r.pass?"badge-pass":"badge-fail"}">${r.pass?"PASS":"FAIL"}</span>
      </div>
      <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${a||'<div style="color:var(--text-dim)">—</div>'}</div>
    </div>
  `}function $(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Hr(e){const r=[];for(const t of e.scopeErrors)r.push(`GPU error scope [${t.type}]: ${t.message}`);for(const t of e.uncaptured)r.push(`uncaptured GPU error [${t.type}]: ${t.message}`);return e.lost.reason&&r.push(`device lost — reason: ${e.lost.reason} — message: ${e.lost.message??""}`),r.push(`expected: ${e.expected}`),e.actual!==null&&r.push(`actual: ${e.actual}`),e.exception&&r.push(`exception: ${e.exception}`),r}function Ka(e){const r=e.pass?"display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--green);color:var(--green)":"display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--red);color:var(--red)",t=e.pass?`${e.config} — complete`:`${e.config} — stage: ${e.stage} · ${e.errorType??""} · ${e.errorMessage??""}`;return`<span style="${r}" title="${$(t)}">${$(e.config)} ${e.pass?"✓":"✗"}</span>`}function Ya(e){const r=[];return r.push(`stage: ${$(e.stage)} · error type: <b style="color:var(--red)">${$(e.errorType??"unknown")}</b>`),e.errorMessage&&r.push(`error: ${$(e.errorMessage)}`),e.nonFiniteIndex>=0&&r.push(`non-finite output at index ${e.nonFiniteIndex}`),e.errorIndex>=0&&e.cpuValue!==null&&e.gpuValue!==null&&r.push(`largest error @ ${e.errorIndex}: cpu=${e.cpuValue.toExponential(4)} gpu=${e.gpuValue.toExponential(4)}`),e.expectedRange&&r.push(`expected range [${e.expectedRange[0].toExponential(3)}, ${e.expectedRange[1].toExponential(3)}]`),e.actualRange&&r.push(`actual range [${e.actualRange[0].toExponential(3)}, ${e.actualRange[1].toExponential(3)}]`),r.map(t=>`<div style="color:var(--red)">${t}</div>`)}function Xa(e){const r=ne?.querySelector("#validation-panel");if(!r)return;const t=e.length===6&&e.every(n=>n.pass),a=e.map(n=>{const o=n.cases.filter(i=>!i.pass).flatMap(Ya),s=n.pass?"complete":n.details.includes("ABORTED")?"aborted (device lost)":n.cases.find(i=>!i.pass)?.stage??"failed";return`
      <div class="card" style="border-color:${n.pass?"var(--green)":"var(--red)"};margin-top:10px">
        <div class="card-header">
          <span class="card-title">${$(n.name.toUpperCase())}</span>
          <span class="badge ${n.pass?"badge-pass":"badge-fail"}">${n.pass?"PASS":"FAIL"}</span>
        </div>
        <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:4px;word-break:break-all">
          <div>${n.cases.map(Ka).join("")||'<span style="color:var(--text-dim)">not run</span>'}</div>
          <div>max error: <b>${n.maxError>=0?n.maxError.toExponential(2):"—"}</b></div>
          <div>execution status: <b>${$(s)}</b></div>
          ${o}
        </div>
      </div>`}).join("");r.innerHTML=`
    <h3 style="margin-top:20px">AETHER KERNEL VALIDATION</h3>
    <div class="card" style="border-color:${t?"var(--green)":"var(--red)"};margin-top:4px">
      <div class="card-header">
        <span class="card-title">All kernels</span>
        <span class="badge ${t?"badge-pass":"badge-fail"}">${t?"ALL PASS":"FAILURE(S)"}</span>
      </div>
    </div>
    ${a}
  `}function le(e){const r=e??{pass:!1,maxError:-1,cases:[]};return{pass:r.pass,maxError:r.maxError,cases:r.cases}}function Qa(e){return!X||e.length===0?null:{device:{webgpuAvailable:X.webgpuAvailable,adapterName:X.adapterName,adapterVendor:X.adapterVendor,adapterDevice:X.adapterDevice,fallbackAdapter:X.isFallbackAdapter},build:{id:ke,commit:qr??null,time:Ke??null},timestamp:new Date().toISOString(),uncapturedErrors:Nr(),tests:{vectorAdd:le(e[0]),matmul:le(e[1]),conv2d:le(e[2]),softmax:le(e[3]),rmsNorm:le(e[4]),attention:le(e[5])},allPass:e.length===6&&e.every(r=>r.pass)}}function Za(e){try{localStorage.setItem("aether.correctness",JSON.stringify(e))}catch{}}function Ja(e){const r=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),t=URL.createObjectURL(r),a=document.createElement("a");a.href=t,a.download=`aether-correctness-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`,a.click(),URL.revokeObjectURL(t)}function en(e){const r=ne?.querySelector("#report-panel");r&&(r.innerHTML=`
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
        device: ${$(e.device.adapterName)} · ${$(e.device.adapterVendor)} · saved to localStorage
      </div>
    </div>
  `,r.querySelector("#btn-export-json")?.addEventListener("click",()=>Ja(e)),r.querySelector("#btn-reload")?.addEventListener("click",()=>location.reload()))}async function rn(){if(!_){_=!0;try{U("═══ GPU SANITY (standalone) ═══","info");const e=await ja();me.sanity=e.pass,Ye(),Qe("res-sanity",{title:"GPU SANITY",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:Hr(e)}),U(`GPU SANITY TEST: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&U(`  error type: ${e.errorType}`,"err"),e.errorMessage&&U(`  error message: ${e.errorMessage}`,"err")}catch(e){U(`ERROR: ${e.message}`,"err")}finally{_=!1}}}async function tn(){if(!_){_=!0;try{U("═══ STANDALONE MATMUL (64×64) ═══","info");const e=await Va();me.standaloneMatmul=e.pass,Ye(),Qe("res-standalone",{title:"STANDALONE MATMUL",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:Hr(e)}),U(`STANDALONE MATMUL: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&U(`  error type: ${e.errorType}`,"err"),e.errorMessage&&U(`  error message: ${e.errorMessage}`,"err")}catch(e){U(`ERROR: ${e.message}`,"err")}finally{_=!1}}}async function an(){if(!_){_=!0;try{await Ve(),Xe(),U("═══ HARNESS MATMUL (runGpuTest) ═══","info");const e=await _r();me.harnessMatmul=e.pass,Ye();const r=e.cases.map(t=>`${t.config}:${t.pass?"PASS":"FAIL"}`).join(" ");Qe("res-harness",{title:"HARNESS MATMUL",pass:e.pass,stage:e.pass?"complete":e.cases.find(t=>!t.pass)?.stage??"runGpuTest",errorType:e.pass?null:e.cases.find(t=>!t.pass)?.errorType??null,errorMessage:e.pass?null:e.cases.find(t=>!t.pass)?.errorMessage??e.details,notes:[`cases: ${r||"—"}`,`max error: ${e.maxError>=0?e.maxError.toExponential(2):"—"}`]}),U(`HARNESS MATMUL: ${e.pass?"PASS":"FAIL"} — ${e.details||""}`,e.pass?"ok":"err"),ge()&&De()}catch(e){U(`ERROR: ${e.message}`,"err"),ge()&&De()}finally{_=!1}}}async function nn(){if(!_){if(!Ge()){U("CORRECTNESS LOCKED — run GPU SANITY, STANDALONE MATMUL and HARNESS MATMUL first.","warn");return}_=!0;try{X=await Ve(),Xe(),Nr(),Or(),U("═══ AETHER KERNEL VALIDATION (sequential, one test at a time) ═══","info");const r=await Ia(a=>{U(`${a.pass?"✓":"✗"} ${a.name} — ${a.details}`,a.pass?"ok":"err")});Xa(r);const t=r.length===6&&r.every(a=>a.pass);if(U(t?"ALL KERNELS PASSED":"SOME KERNELS FAILED",t?"ok":"err"),ge())De(),U("Requires runtime reinitialization — reload the page (or re-run up the gate diagnostics) before retrying.","err");else{const a=Qa(r);a&&(Za(a),en(a),U("Correctness report saved locally (aether.correctness).","info"))}}catch(e){U(`ERROR: ${e.message}`,"err"),ge()&&De()}finally{_=!1}}}function on(e){const r=e.querySelector("#diag-panel");if(!r)return;const t=[["location.href",location.href],["location.hash",location.hash],["location.protocol",location.protocol],["window.isSecureContext",String(window.isSecureContext)],["navigator.userAgent",navigator.userAgent],["AETHER_BUILD_ID",ke],["Built at",Ke||"n/a"],["Benchmark code revision",ke]];r.innerHTML=t.map(([a,n])=>`<div style="font-size:11px;font-family:var(--mono);word-break:break-all">
        <span style="color:var(--text-dim)">${a}:</span> <b style="color:var(--text)">${n}</b>
      </div>`).join("")}function sn(e){ne=e,He=!1,e.innerHTML=`
    <h2>GPU Compute Benchmark — Isolated Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Three independent checks — each requests its own GPU device. Performance benchmarks are disabled until correctness is proven.
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
      <button class="btn btn-outline" id="btn-harness">HARNESS MATMUL</button>
      <button class="btn btn-outline" id="btn-correctness">CORRECTNESS (LOCKED)</button>
    </div>

    <div id="res-sanity"></div>
    <div id="res-standalone"></div>
    <div id="res-harness"></div>

    <div id="validation-panel"></div>
    <div id="report-panel"></div>

    <div class="log" id="bench-log"></div>

    <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;font-family:var(--mono);color:var(--text-dim)">
      <div>AETHER BUILD: <b id="build-id" style="color:var(--text)">${ke}</b></div>
      <div>Git commit: <b id="build-commit" style="color:var(--text)">${qr??"unavailable"}</b></div>
      <div>Build time: <b id="build-time" style="color:var(--text)">${Ke||"unavailable"}</b></div>
      <div>Environment: GitHub Pages</div>
    </div>
  `,on(e),e.querySelector("#btn-sanity")?.addEventListener("click",rn),e.querySelector("#btn-standalone")?.addEventListener("click",tn),e.querySelector("#btn-harness")?.addEventListener("click",an);const r=e.querySelector("#btn-correctness");r&&(r.addEventListener("click",nn),r.disabled=!Ge(),r.textContent=Ge()?"CORRECTNESS":"CORRECTNESS (LOCKED)");const t=a=>{a.preventDefault()};window.addEventListener("error",t),window.addEventListener("unhandledrejection",t),Ve().then(a=>{X=a,Xe();const n=e.querySelector("#device-badge"),o=e.querySelector("#device-info");n&&(n.textContent="WEBGPU READY",n.className="badge badge-pass"),o&&(o.innerHTML=`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
          <span>Adapter:</span><span style="color:var(--text)">${a.adapterName}</span>
          <span>Vendor:</span><span style="color:var(--text)">${a.adapterVendor}</span>
          <span>Features:</span><span style="color:var(--text)">${a.adapterFeatures.length}</span>
          <span>Max Buffer:</span><span style="color:var(--text)">${Cr(a.maxBufferSize)}</span>
          <span>Max Storage:</span><span style="color:var(--text)">${Cr(a.maxStorageBufferBindingSize)}</span>
          <span>Workgroup X:</span><span style="color:var(--text)">${a.maxComputeWorkgroupSizeX}</span>
          <span>Invocations/wg:</span><span style="color:var(--text)">${a.maxComputeInvocationsPerWorkgroup}</span>
          <span>Timestamp Query:</span><span style="color:var(--text)">${a.timestampQuerySupport?"YES":"NO"}</span>
          <span>Preferred Format:</span><span style="color:var(--text)">${a.preferredCanvasFormat??"N/A"}</span>
          <span>Fallback:</span><span style="color:var(--text)">${a.isFallbackAdapter?"YES (software)":"NO (hardware)"}</span>
        </div>
      `)}).catch(a=>{const n=e.querySelector("#device-badge");n&&(n.textContent="WEBGPU UNAVAILABLE",n.className="badge badge-fail"),U(`WEBGPU not available: ${a.message}`,"err")})}const un=Object.freeze(Object.defineProperty({__proto__:null,render:sn},Symbol.toStringTag,{value:"Module"}));function cn(e){const r=e.toLowerCase();return r.includes("aether")||r==="external-cache"||r.startsWith("workbox-")||r.includes("webgpu")}async function jr(){if("serviceWorker"in navigator)try{const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(r=>r.unregister().catch(()=>{})))}catch{}}async function Vr(){if("caches"in window)try{const e=await caches.keys();await Promise.all(e.filter(cn).map(r=>caches.delete(r).catch(()=>{})))}catch{}}async function ln(){try{const e=[],r=indexedDB;if(r.databases){const t=await r.databases();for(const a of t)a.name&&a.name.toLowerCase().includes("aether")&&e.push(a.name)}else e.push("aether-gpu-benchmark");for(const t of e)await new Promise(a=>{const n=indexedDB.deleteDatabase(t);n.onsuccess=()=>a(),n.onerror=()=>a(),n.onblocked=()=>a()})}catch{}}async function dn(){await jr(),await Vr()}async function fn(){await jr(),await Vr(),await ln()}const Ze=[{id:"gpubench",label:"GPU Bench",module:un},{id:"device",label:"Device Test",module:at},{id:"webgpudiag",label:"WebGPU Diag",module:ea},{id:"model",label:"Model Test",module:pt},{id:"tensor",label:"Tensor Bench",module:Qt},{id:"image",label:"Image Test",module:gt},{id:"video",label:"Video Test",module:wt},{id:"diag",label:"Diagnostics",module:Pt}];let Kr="gpubench";function Ur(){const e=window.location.hash.replace("#","");return Ze.some(r=>r.id===e)?e:e==="diagnostics/webgpu"||e==="webgpu"?"webgpudiag":"gpubench"}function We(e){Kr=e,window.location.hash=e;const r=document.getElementById("nav"),t=document.getElementById("screen");r.querySelectorAll("button").forEach(n=>{n.classList.toggle("active",n.dataset.screen===e)});const a=Ze.find(n=>n.id===e);a&&a.module.render(t)}function pn(){const e=document.getElementById("app");e.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const r=document.getElementById("nav");document.getElementById("screen"),Ze.forEach(a=>{const n=document.createElement("button");n.textContent=a.label,n.dataset.screen=a.id,n.addEventListener("click",()=>We(a.id)),r.appendChild(n)});const t=Ur();We(t),window.addEventListener("hashchange",()=>{const a=Ur();a!==Kr&&We(a)})}function mn(){const e=document.getElementById("app");e.innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;text-align:center;gap:16px;padding:24px">
      <h2 style="color:var(--green, #22c55e);margin:0">AETHER CACHE RESET COMPLETE</h2>
      <p style="color:var(--text-dim, #9ca3af);margin:0">Please reload AETHER normally.</p>
      <button id="btn-reset-reload" class="btn">Reload AETHER</button>
    </div>
  `,e.querySelector("#btn-reset-reload")?.addEventListener("click",()=>{history.replaceState(null,"",window.location.pathname+window.location.search),window.location.reload()})}async function Ar(){if(window.location.hash==="#reset"){await fn(),mn();return}await dn(),pn()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>void Ar()):Ar();
