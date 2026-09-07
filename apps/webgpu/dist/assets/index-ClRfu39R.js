(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=t(a);fetch(a.href,o)}})();function Br(e){let r="Unknown",t="Unknown",n="Unknown",a="Unknown";const o=e.match(/OS (\d+)_(\d+)/);o&&(n="iOS",a=`${o[1]}.${o[2]}`);const s=e.match(/Mac OS X (\d+)[_.](\d+)/);if(s&&(n="macOS",a=`${s[1]}.${s[2]}`),e.includes("Windows")){n="Windows";const u=e.match(/Windows NT (\d+\.\d+)/);u&&(a=u[1])}if(e.includes("Android")){n="Android";const u=e.match(/Android (\d+[\.\d]*)/);u&&(a=u[1])}if(e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")){r="Safari";const u=e.match(/Version\/(\d+[\.\d]*)/);u&&(t=u[1])}if(e.includes("Chrome")&&!e.includes("Edg")){r="Chrome";const u=e.match(/Chrome\/(\d+[\.\d]*)/);u&&(t=u[1])}if(e.includes("Edg/")){r="Edge";const u=e.match(/Edg\/(\d+[\.\d]*)/);u&&(t=u[1])}if(e.includes("Firefox")){r="Firefox";const u=e.match(/Firefox\/(\d+[\.\d]*)/);u&&(t=u[1])}return{browserName:r,browserVersion:t,osName:n,osVersion:a}}function Mr(e){return!!(e.includes("FBAN")||e.includes("FBIOS")||e.includes("Twitter")||e.includes("Instagram")||e.includes("Line/")||e.includes("WeChat")||e.includes("MicroMessenger")||e.includes("CocoaPods")||e.includes("wv)")||e.includes("Electron")||e.includes("; wv)"))}function Ar(e){return e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")}async function Ee(){const e=navigator.userAgent,r=Br(e),t=r.osName==="iOS",n=Ar(e),a=Mr(e),o=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,s={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:e,platform:navigator.platform,isIOS:t,isSafari:n,isWebView:a,isStandalone:o,browserName:r.browserName,browserVersion:r.browserVersion,osName:r.osName,osVersion:r.osVersion},i={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(a)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:s,gpu:i};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:t?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:s,gpu:i};if(!navigator.gpu){let u="navigator.gpu is undefined. WebGPU API is not exposed.",c="";if(t){if(parseInt(r.osVersion.split(".")[0],10)<26)return u=`iOS ${r.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,c="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i};if(r.browserName!=="Safari")return u=`Running ${r.browserName} on iOS ${r.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,c="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:u,recommendation:c,environment:s,gpu:i}}return r.osName==="macOS"&&parseInt(r.osVersion.split(".")[0],10)<14?(u=`macOS ${r.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,c="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i}):(c="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i})}try{const u=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!u){i.adapterError="requestAdapter() returned null";let f="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",d="";return t?parseInt(r.osVersion.split(".")[0],10)>=26&&(f=`iOS ${r.osVersion} with Safari ${r.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,d="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(f="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",d="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):d="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:f,recommendation:d,environment:s,gpu:i}}i.adapterName=u.name??"Unknown GPU",i.adapterVendor=u.vendor??"Unknown",i.adapterDevice=u.device??"Unknown",i.isFallbackAdapter=u.isFallbackAdapter??!1;const c=[];for(const f of u.features)c.push(f.replace(/-/g," ").replace(/\b\w/g,d=>d.toUpperCase()));i.features=c;const l=u.limits;i.limits={maxBufferSize:l.maxBufferSize,maxTextureDimension1D:l.maxTextureDimension1D,maxTextureDimension2D:l.maxTextureDimension2D,maxTextureDimension3D:l.maxTextureDimension3D,maxComputeWorkgroupStorageSize:l.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:l.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:l.maxStorageBufferBindingSize,maxUniformBufferBindingSize:l.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:l.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:l.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:l.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:l.maxComputeWorkgroupsPerDimension,maxColorAttachments:l.maxColorAttachments,minStorageBufferOffsetAlignment:l.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:l.minUniformBufferOffsetAlignment};try{(await u.requestDevice({requiredLimits:{}})).destroy()}catch(f){return i.deviceError=f.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${i.adapterName}) but requestDevice() failed: ${f.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:s,gpu:i}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${i.adapterName}.`,recommendation:"No action needed.",environment:s,gpu:i}}catch(u){return i.adapterError=u.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${u.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:s,gpu:i}}}function pr(e){const r=[];if(r.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),r.push(""),r.push(`STATUS: ${e.statusLabel}`),r.push(`CASE: ${e.case}`),r.push(`REASON: ${e.reason}`),r.push(`RECOMMENDATION: ${e.recommendation}`),r.push(""),r.push("── ENVIRONMENT ──"),r.push(`  URL: ${e.environment.url}`),r.push(`  Protocol: ${e.environment.protocol}`),r.push(`  Hostname: ${e.environment.hostname}`),r.push(`  Secure Context: ${e.environment.isSecureContext}`),r.push(`  iOS: ${e.environment.isIOS}`),r.push(`  Safari: ${e.environment.isSafari}`),r.push(`  WebView: ${e.environment.isWebView}`),r.push(`  Standalone PWA: ${e.environment.isStandalone}`),r.push(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`),r.push(`  OS: ${e.environment.osName} ${e.environment.osVersion}`),r.push(`  Platform: ${e.environment.platform}`),r.push(`  User Agent: ${e.environment.userAgent}`),r.push(""),r.push("── WEBGPU ──"),r.push(`  navigator.gpu exists: ${e.gpu.navigatorGpuExists}`),e.gpu.adapterName&&r.push(`  Adapter: ${e.gpu.adapterName}`),e.gpu.adapterVendor&&r.push(`  Vendor: ${e.gpu.adapterVendor}`),e.gpu.adapterDevice&&r.push(`  Device: ${e.gpu.adapterDevice}`),e.gpu.adapterError&&r.push(`  Adapter Error: ${e.gpu.adapterError}`),e.gpu.deviceError&&r.push(`  Device Error: ${e.gpu.deviceError}`),r.push(`  Fallback adapter: ${e.gpu.isFallbackAdapter}`),e.gpu.features.length>0){r.push(`  Features (${e.gpu.features.length}):`);for(const t of e.gpu.features)r.push(`    ${t}`)}if(e.gpu.limits){r.push("  Limits:");for(const[t,n]of Object.entries(e.gpu.limits))r.push(`    ${t}: ${typeof n=="number"?n.toLocaleString():n}`)}return r.push(""),r.push(`Timestamp: ${new Date().toISOString()}`),r.join(`
`)}function he(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function J(){const e=await Ee();if(!e.ready||!e.gpu.adapterName)return null;const r=e.gpu.limits;return{available:!0,adapterName:e.gpu.adapterName,adapterVendor:e.gpu.adapterVendor,adapterDevice:e.gpu.adapterDevice,features:e.gpu.features,limits:{maxBufferSize:r.maxBufferSize,maxTextureDimension1D:r.maxTextureDimension1D,maxTextureDimension2D:r.maxTextureDimension2D,maxTextureDimension3D:r.maxTextureDimension3D,maxComputeWorkgroupStorageSize:r.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:r.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:r.maxStorageBufferBindingSize,maxUniformBufferBindingSize:r.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:r.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:r.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:r.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:r.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:r.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:r.minUniformBufferOffsetAlignment,maxColorAttachments:r.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:e.gpu.isFallbackAdapter,featuresMap:new Set(e.gpu.features),diagnostic:e}}async function ee(e,r=[]){const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("Failed to re-acquire GPU adapter");const n=await t.requestDevice({requiredFeatures:r.filter(a=>e.featuresMap.has(a)),requiredLimits:{}});return n.lost.then(a=>{console.error("WebGPU device lost:",a.message)}),n}function Er(e){const r=e.environment,t=e.gpu;let n="badge-fail";e.case==="D"?n="badge-pass":(e.case==="B"||e.case==="C")&&(n="badge-warn");let a=`
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
  `;return t.adapterName&&(a+=`
      <h3>GPU Adapter</h3>
      <div class="card">
        <div class="row"><span class="row-label">Name</span><span class="row-value">${t.adapterName}</span></div>
        <div class="row"><span class="row-label">Vendor</span><span class="row-value">${t.adapterVendor||"Unknown"}</span></div>
        <div class="row"><span class="row-label">Device</span><span class="row-value">${t.adapterDevice||"Unknown"}</span></div>
        <div class="row"><span class="row-label">Fallback</span><span class="row-value">${t.isFallbackAdapter?"Yes (software)":"No (hardware)"}</span></div>
      </div>
    `),t.adapterError&&(a+=`
      <h3>Adapter Error</h3>
      <div class="card" style="border-color:var(--red)">
        <p style="font-size:13px;color:var(--red)">${t.adapterError}</p>
      </div>
    `),t.deviceError&&(a+=`
      <h3>Device Error</h3>
      <div class="card" style="border-color:var(--red)">
        <p style="font-size:13px;color:var(--red)">${t.deviceError}</p>
      </div>
    `),t.limits&&(a+=`
      <h3>GPU Limits</h3>
      <div class="card">
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${he(t.limits.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${t.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${t.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${t.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${he(t.limits.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${he(t.limits.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${he(t.limits.maxComputeWorkgroupStorageSize)}</span></div>
        <div class="row"><span class="row-label">Max invocations/wg</span><span class="row-value">${t.limits.maxComputeInvocationsPerWorkgroup}</span></div>
        <div class="row"><span class="row-label">Max workgroup size</span><span class="row-value">${t.limits.maxComputeWorkgroupSizeX}×${t.limits.maxComputeWorkgroupSizeY}×${t.limits.maxComputeWorkgroupSizeZ}</span></div>
        <div class="row"><span class="row-label">Max workgroups/dim</span><span class="row-value">${t.limits.maxComputeWorkgroupsPerDimension}</span></div>
        <div class="row"><span class="row-label">Max color attachments</span><span class="row-value">${t.limits.maxColorAttachments}</span></div>
        <div class="row"><span class="row-label">Storage buf alignment</span><span class="row-value">${t.limits.minStorageBufferOffsetAlignment} B</span></div>
        <div class="row"><span class="row-label">Uniform buf alignment</span><span class="row-value">${t.limits.minUniformBufferOffsetAlignment} B</span></div>
      </div>
    `),t.features.length>0&&(a+=`
      <h3>Features (${t.features.length})</h3>
      <div class="card">
        ${t.features.map(o=>`<div class="row"><span class="row-value">${o}</span></div>`).join("")}
      </div>
    `),a}function Tr(e){e.innerHTML=`
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;const r=e.querySelector("#device-status"),t=e.querySelector("#device-info");Ee().then(n=>{n.ready?r.innerHTML=`
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `:r.innerHTML="",t.innerHTML=Er(n)})}const $r=Object.freeze(Object.defineProperty({__proto__:null,render:Tr},Symbol.toStringTag,{value:"Module"}));let A=class mr{buffer;shape;dtype;size;device;constructor(r,t,n="f32"){this.device=r,this.shape=[...t],this.dtype=n,this.size=t.reduce((s,i)=>s*i,1);const a=n==="f32"?4:n==="f16"?2:4;this.buffer=r.createBuffer({size:this.size*a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(n==="f32"?new Float32Array(this.buffer.getMappedRange()):n==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(r,t,n){const a=new mr(r,n,t instanceof Float32Array?"f32":"i32");return r.queue.writeBuffer(a.buffer,0,t.buffer),a}async readback(){const r=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t=this.device.createCommandEncoder();t.copyBufferToBuffer(this.buffer,0,r,0,this.buffer.size),this.device.queue.submit([t.finish()]),await r.mapAsync(GPUMapMode.READ);const n=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),n}destroy(){this.buffer.destroy()}};async function de(e,r,t=50,n){const a=[];for(let c=0;c<Math.min(5,t);c++)await r();for(let c=0;c<t;c++){const l=performance.now();await r(),await gr?.queue.onSubmittedWorkDone();const f=performance.now();a.push(f-l)}a.sort((c,l)=>c-l);const o=a.reduce((c,l)=>c+l,0)/a.length,s=a[0],i=a[a.length-1],u={name:e,avgMs:o,minMs:s,maxMs:i,iterations:t};if(n){const l=n/(o/1e3)/1e9;u.gflops=l,u.throughput=`${l.toFixed(2)} GFLOPS`}return u}let gr=null;function re(e){gr=e}function pe(e){const r=[`${e.name}: ${e.avgMs.toFixed(2)} ms avg`,`(${e.minMs.toFixed(2)} – ${e.maxMs.toFixed(2)} ms)`,`[${e.iterations} iterations]`];return e.throughput&&r.push(e.throughput),r.join(" ")}const Ue=`
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
`,Gr=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= uniforms.N) { return; }
  data[i] = max(data[i], 0.0);
}
`,kr=`
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
`,Or=`
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
`,Dr=`
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
`,Nr=`
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
`;let v=null,ae=null;function M(e,r=""){if(!ae)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,ae.appendChild(t),ae.scrollTop=ae.scrollHeight}async function Re(){M("═══ TINY NEURAL NETWORK TEST ═══","info"),M("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),M("");const e=await J();if(!e)return M("WebGPU not available","err"),!1;v=await ee(e),re(v);const r=performance.now(),t=A.fromData(v,new Float32Array([1,.5,-.3,.8]),[4]),n=A.fromData(v,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),a=A.fromData(v,new Float32Array([.1,-.1,.2]),[3]),o=new ArrayBuffer(12),s=new Uint32Array(o);s[0]=1,s[1]=3,s[2]=4;const i=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:v.createShaderModule({code:Ue}),entryPoint:"main"}}),c=v.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(c,0,o);const l=new A(v,[1,3]),f=v.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:t.buffer}},{binding:2,resource:{buffer:n.buffer}},{binding:3,resource:{buffer:l.buffer}}]});let d=v.createCommandEncoder(),m=d.beginComputePass();m.setPipeline(u),m.setBindGroup(0,f),m.dispatchWorkgroups(1,1,1),m.end(),v.queue.submit([d.finish()]),M(`  input[4]:  [${Array.from(await t.readback()).map(D=>D.toFixed(2)).join(", ")}]`,""),M("  W1[4×3]:   4 rows × 3 cols",""),M("  Matmul result: computing...","");const p=await l.readback();M(`  h1 = input @ W1: [${Array.from(p).map(D=>D.toFixed(3)).join(", ")}]`,"ok");for(let D=0;D<3;D++)p[D]+=[.1,-.1,.2][D];v.queue.writeBuffer(l.buffer,0,p.buffer),M(`  h1 + bias:       [${Array.from(p).map(D=>D.toFixed(3)).join(", ")}]`,"ok");const g=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),b=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[g]}),compute:{module:v.createShaderModule({code:Gr}),entryPoint:"main"}}),y=new ArrayBuffer(4);new Uint32Array(y)[0]=3;const w=v.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(w,0,y);const h=v.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:l.buffer}}]});d=v.createCommandEncoder(),m=d.beginComputePass(),m.setPipeline(b),m.setBindGroup(0,h),m.dispatchWorkgroups(1,1,1),m.end(),v.queue.submit([d.finish()]);const B=await l.readback();M(`  ReLU(h1):         [${Array.from(B).map(D=>D.toFixed(3)).join(", ")}]`,"ok");const U=A.fromData(v,new Float32Array([.7,-.3,.5]),[3,1]),E=new A(v,[1,1]),$=new ArrayBuffer(12),G=new Uint32Array($);G[0]=1,G[1]=1,G[2]=3;const H=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),z=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[H]}),compute:{module:v.createShaderModule({code:Ue}),entryPoint:"main"}}),Ge=v.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(Ge,0,$);const Pr=v.createBindGroup({layout:H,entries:[{binding:0,resource:{buffer:Ge}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:U.buffer}},{binding:3,resource:{buffer:E.buffer}}]});d=v.createCommandEncoder(),m=d.beginComputePass(),m.setPipeline(z),m.setBindGroup(0,Pr),m.dispatchWorkgroups(1,1,1),m.end(),v.queue.submit([d.finish()]);const Ur=await E.readback(),Cr=(performance.now()-r).toFixed(1);return M(`  Final output: ${Ur[0].toFixed(4)}`,"ok"),M(`  Total pipeline: ${Cr} ms`,"ok"),M("",""),M("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),t.destroy(),n.destroy(),a.destroy(),l.destroy(),U.destroy(),E.destroy(),c.destroy(),Ge.destroy(),w.destroy(),v.destroy(),!0}async function _r(){M("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const e=await J();if(!e)return null;v=await ee(e),re(v);const r=[64,128,256,512],t=[];for(const n of r){const a=A.fromData(v,new Float32Array(n*n).fill(1),[n,n]),o=A.fromData(v,new Float32Array(n*n).fill(.5),[n,n]),s=new A(v,[n,n]),i=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:v.createShaderModule({code:Ue}),entryPoint:"main"}}),c=new ArrayBuffer(12),l=new Uint32Array(c);l[0]=n,l[1]=n,l[2]=n;const f=await de(`${n}×${n} matmul`,async()=>{const d=v.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(d,0,c);const m=v.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:s.buffer}}]}),p=v.createCommandEncoder(),g=p.beginComputePass();g.setPipeline(u),g.setBindGroup(0,m);const b=Math.ceil(n/16);g.dispatchWorkgroups(b,b,1),g.end(),v.queue.submit([p.finish()]),d.destroy()},30,2*n*n*n);t.push(f),M(pe(f),"ok"),a.destroy(),o.destroy(),s.destroy()}return v.destroy(),t[t.length-1]}async function Wr(){M("═══ CONVOLUTION BENCHMARK ═══","info");const e=await J();if(!e)return null;v=await ee(e),re(v);const r=1,t=3,n=32,a=32,o=8,s=3,i=3,u=n-s+1,c=a-i+1,l=A.fromData(v,new Float32Array(r*t*n*a).fill(.5),[r,t,n,a]),f=A.fromData(v,new Float32Array(o*t*s*i).fill(.1),[o,t,s,i]),d=new A(v,[r,o,u,c]),m=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),p=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[m]}),compute:{module:v.createShaderModule({code:kr}),entryPoint:"main"}}),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=r,b[1]=t,b[2]=n,b[3]=a,b[4]=o,b[5]=s,b[6]=i,b[7]=u,b[8]=c;const y=await de(`Conv2D ${r}×${t}×${n}×${a} k=${s}→${o}×${u}×${c}`,async()=>{const w=v.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(w,0,g);const h=v.createBindGroup({layout:m,entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:f.buffer}},{binding:3,resource:{buffer:d.buffer}}]}),B=v.createCommandEncoder(),U=B.beginComputePass();U.setPipeline(p),U.setBindGroup(0,h),U.dispatchWorkgroups(r,o,1),U.end(),v.queue.submit([B.finish()]),w.destroy()},20,2*r*o*t*s*i*u*c);return M(pe(y),"ok"),l.destroy(),f.destroy(),d.destroy(),v.destroy(),y}async function zr(){M("═══ ATTENTION BENCHMARK ═══","info");const e=await J();if(!e)return null;v=await ee(e),re(v);const r=1,t=64,n=64,a=1/Math.sqrt(n),o=A.fromData(v,new Float32Array(r*t*n).fill(.1),[r,t,n]),s=A.fromData(v,new Float32Array(r*t*n).fill(.1),[r,t,n]),i=A.fromData(v,new Float32Array(r*t*n).fill(.1),[r,t,n]),u=new A(v,[r,t,n]),c=new A(v,[r,t,t]),l=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),f=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[l]}),compute:{module:v.createShaderModule({code:Or}),entryPoint:"main"}}),d=new ArrayBuffer(16),m=new Uint32Array(d),p=new Float32Array(d);m[0]=r,m[1]=t,m[2]=n,p[3]=a;const g=await de(`Attention b=${r} s=${t} d=${n}`,async()=>{const b=v.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(b,0,d);const y=v.createBindGroup({layout:l,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}},{binding:4,resource:{buffer:u.buffer}},{binding:5,resource:{buffer:c.buffer}}]}),w=v.createCommandEncoder(),h=w.beginComputePass();h.setPipeline(f),h.setBindGroup(0,y),h.dispatchWorkgroups(r,1,1),h.end(),v.queue.submit([w.finish()]),b.destroy()},20);return M(pe(g),"ok"),o.destroy(),s.destroy(),i.destroy(),u.destroy(),c.destroy(),v.destroy(),g}function Fr(e){e.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,ae=e.querySelector("#model-log"),e.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{ae.innerHTML="",await Re()}),e.querySelector("#btn-all-bench").addEventListener("click",async()=>{ae.innerHTML="",await Re(),M("",""),await _r(),M("",""),await Wr(),M("",""),await zr(),M("",""),M("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const Lr=Object.freeze(Object.defineProperty({__proto__:null,render:Fr},Symbol.toStringTag,{value:"Module"}));let C=null,Z=null;function L(e,r=""){if(!Z)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,Z.appendChild(t),Z.scrollTop=Z.scrollHeight}function br(e,r){const t=new Float32Array(e*r*4);for(let n=0;n<r;n++)for(let a=0;a<e;a++){const o=(n*e+a)*4,s=(a>>4)+(n>>4)&1;t[o+0]=s?.9:a/e*.8,t[o+1]=s?.3:n/r*.6,t[o+2]=s?.6:.4,t[o+3]=1}return t}function Oe(e,r,t){const n=document.createElement("canvas");n.width=r,n.height=t;const a=n.getContext("2d"),o=a.createImageData(r,t);for(let s=0;s<r*t*4;s++)o.data[s]=Math.round(e[s]*255);return a.putImageData(o,0,0),n}async function qe(){L("═══ GRAYSCALE TEST ═══","info");const e=await J();if(!e){L("WebGPU unavailable","err");return}C=await ee(e),re(C);const r=256,t=256,n=br(r,t),a=A.fromData(C,n,[r*t*4]),o=new A(C,[r*t*4]),s=C.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=C.createComputePipeline({layout:C.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:C.createShaderModule({code:Nr}),entryPoint:"main"}}),u=new ArrayBuffer(4);new Uint32Array(u)[0]=r*t;const c=await de("Grayscale 256×256",async()=>{const p=C.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});C.queue.writeBuffer(p,0,u);const g=C.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:o.buffer}}]}),b=C.createCommandEncoder(),y=b.beginComputePass();y.setPipeline(i),y.setBindGroup(0,g),y.dispatchWorkgroups(Math.ceil(r*t/256),1,1),y.end(),C.queue.submit([b.finish()]),p.destroy()},50);L(pe(c),"ok");const l=await o.readback(),f=Oe(n,r,t),d=Oe(l,r,t),m=Fe?.querySelector("#image-display");if(m){m.innerHTML="";const p=document.createElement("div");p.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const g=document.createElement("div");g.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',g.appendChild(f);const b=document.createElement("div");b.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',b.appendChild(d),p.appendChild(g),p.appendChild(b),m.appendChild(p)}a.destroy(),o.destroy(),C.destroy(),L("✓ Grayscale complete","ok")}async function Ie(){L("═══ CONVOLUTION KERNEL TEST ═══","info");const e=await J();if(!e){L("WebGPU unavailable","err");return}C=await ee(e),re(C);const r=128,t=128,n=3,a=br(r,t),o={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},s=C.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=C.createComputePipeline({layout:C.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:C.createShaderModule({code:Dr}),entryPoint:"main"}}),u=new ArrayBuffer(16),c=new Uint32Array(u);c[0]=r,c[1]=t,c[2]=n,c[3]=0;for(const[l,f]of Object.entries(o)){const d=A.fromData(C,a,[r*t*4]),m=A.fromData(C,f,[n*n]),p=new A(C,[r*t*4]),g=await de(`Conv ${l} ${r}×${t}`,async()=>{const w=C.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});C.queue.writeBuffer(w,0,u);const h=C.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:m.buffer}},{binding:2,resource:{buffer:d.buffer}},{binding:3,resource:{buffer:p.buffer}}]}),B=C.createCommandEncoder(),U=B.beginComputePass();U.setPipeline(i),U.setBindGroup(0,h),U.dispatchWorkgroups(Math.ceil(r/16),Math.ceil(t/16),1),U.end(),C.queue.submit([B.finish()]),w.destroy()},30);L(pe(g),"ok");const b=await p.readback(),y=Fe?.querySelector("#image-display");if(y){const w=Oe(b,r,t),h=document.createElement("div");h.style.cssText="display:inline-block;margin:4px",h.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${l}</div>`,h.appendChild(w),y.appendChild(h)}d.destroy(),m.destroy(),p.destroy()}C.destroy(),L("✓ All convolution kernels applied","ok")}let Fe=null;function Rr(e){Fe=e,e.innerHTML=`
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
  `,Z=e.querySelector("#image-log"),e.querySelector("#btn-grayscale").addEventListener("click",async()=>{Z.innerHTML="",e.querySelector("#image-display").innerHTML="",await qe()}),e.querySelector("#btn-conv").addEventListener("click",async()=>{Z.innerHTML="",e.querySelector("#image-display").innerHTML="",await Ie()}),e.querySelector("#btn-all-img").addEventListener("click",async()=>{Z.innerHTML="",e.querySelector("#image-display").innerHTML="",await qe(),L("",""),await Ie(),L("",""),L("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const qr=Object.freeze(Object.defineProperty({__proto__:null,render:Rr},Symbol.toStringTag,{value:"Module"}));let k=null,ye=null,Se=null;function De(e,r=""){if(!ye)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,ye.appendChild(t),ye.scrollTop=ye.scrollHeight}const Ir=`
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
`;let Ne=0,Pe=0;async function Hr(e,r,t,n,a){const o=await J();if(!o){De("WebGPU unavailable","err");return}k=await ee(o),re(k);const[s,i]=n.value.split("x").map(Number);e.width=s,e.height=i,Ne=parseInt(a.value);const u=k.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=k.createComputePipeline({layout:k.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:k.createShaderModule({code:Ir}),entryPoint:"main"}}),l=k.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),f=e.getContext("2d"),d=k.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let m=performance.now(),p=0,g=0;r.textContent="RENDERING",r.className="badge badge-pass";function b(){const y=new ArrayBuffer(16),w=new Uint32Array(y);w[0]=s,w[1]=i,w[2]=Pe,w[3]=Ne,k.queue.writeBuffer(d,0,y);const h=k.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:l}}]}),B=k.createCommandEncoder(),U=B.beginComputePass();U.setPipeline(c),U.setBindGroup(0,h),U.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(i/16),1),U.end();const E=k.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});B.copyBufferToBuffer(l,0,E,0,s*i*4*4),k.queue.submit([B.finish()]),E.mapAsync(GPUMapMode.READ).then(()=>{const $=new Float32Array(E.getMappedRange().slice(0));E.unmap(),E.destroy();const G=f.createImageData(s,i);for(let z=0;z<s*i*4;z++)G.data[z]=Math.round($[z]*255);f.putImageData(G,0,0),Pe++,g++;const H=performance.now();H-m>=1e3&&(p=Math.round(g*1e3/(H-m)),t.textContent=`${p} FPS | Frame ${Pe} | ${s}×${i}`,g=0,m=H),Se=requestAnimationFrame(b)})}b()}function He(){Se!==null&&(cancelAnimationFrame(Se),Se=null),k&&(k.destroy(),k=null)}function jr(e){e.innerHTML=`
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
  `,ye=e.querySelector("#video-log");const r=e.querySelector("#video-canvas"),t=e.querySelector("#video-status"),n=e.querySelector("#video-fps"),a=e.querySelector("#res-select"),o=e.querySelector("#mode-select");e.querySelector("#btn-start").addEventListener("click",()=>{He(),Pe=0,Ne=parseInt(o.value),De(`Starting GPU compute video: ${a.value} mode=${o.value}`,"info"),Hr(r,t,n,a,o)}),e.querySelector("#btn-stop").addEventListener("click",()=>{He(),t.textContent="STOPPED",t.className="badge badge-info",De("Rendering stopped","warn")})}const Vr=Object.freeze(Object.defineProperty({__proto__:null,render:jr},Symbol.toStringTag,{value:"Module"}));let ce=null;function S(e,r=""){if(!ce)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,ce.appendChild(t),ce.scrollTop=ce.scrollHeight}async function Kr(){if(ce.innerHTML="",S("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),S(`Timestamp: ${new Date().toISOString()}`,""),!await Yr())return;const r=await J();if(!r){S("Cannot proceed: GPU not ready","err");return}S("",""),S("── MEMORY TEST ──","info");const t=await ee(r);re(t);const n=Math.floor(r.limits.maxBufferSize/1048576);S(`Attempting to allocate buffer at reported max: ${n} MB`,"");try{const a=t.createBuffer({size:r.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});S("Buffer allocation at max: SUCCESS","ok"),a.destroy()}catch(a){S(`Buffer allocation at max: FAILED — ${a.message}`,"warn");for(const o of[256,128,64,32])try{const s=t.createBuffer({size:o*1048576,usage:GPUBufferUsage.STORAGE});S(`Largest successful allocation: ${o} MB`,"ok"),s.destroy();break}catch{continue}}S("",""),S("── COMPUTE THROUGHPUT ──","info");for(const a of[64,128,256]){const o=A.fromData(t,new Float32Array(a*a).fill(1),[a,a]),s=A.fromData(t,new Float32Array(a*a).fill(1),[a,a]),i=new A(t,[a,a]),u=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=t.createComputePipeline({layout:t.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:t.createShaderModule({code:Ue}),entryPoint:"main"}}),l=await de(`matmul ${a}×${a}`,async()=>{const f=t.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=new ArrayBuffer(12);new Uint32Array(d).set([a,a,a]),t.queue.writeBuffer(f,0,d);const m=t.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),p=t.createCommandEncoder(),g=p.beginComputePass();g.setPipeline(c),g.setBindGroup(0,m);const b=Math.ceil(a/16);g.dispatchWorkgroups(b,b,1),g.end(),t.queue.submit([p.finish()]),f.destroy()},30,2*a*a*a);S(pe(l),"ok"),o.destroy(),s.destroy(),i.destroy()}t.destroy(),S("",""),S("═══ DIAGNOSTICS COMPLETE ═══","info")}async function Yr(){const e=await Ee();return pr(e),S("── WEBGPU STATUS ──","info"),S(`${e.statusLabel} (Case ${e.case})`,e.ready?"ok":"err"),S(`Reason: ${e.reason}`,""),S(`Recommendation: ${e.recommendation}`,""),S("",""),S("── ENVIRONMENT ──","info"),S(`  URL: ${e.environment.url}`,""),S(`  Secure Context: ${e.environment.isSecureContext}`,e.environment.isSecureContext?"ok":"err"),S(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`,""),S(`  OS: ${e.environment.osName} ${e.environment.osVersion}`,""),S(`  iOS: ${e.environment.isIOS}`,""),S(`  Safari: ${e.environment.isSafari}`,""),S(`  WebView: ${e.environment.isWebView}`,e.environment.isWebView?"err":""),S(`  navigator.gpu: ${e.gpu.navigatorGpuExists}`,e.gpu.navigatorGpuExists?"ok":"err"),e.gpu.adapterName&&(S(`  Adapter: ${e.gpu.adapterName}`,"ok"),S(`  Vendor: ${e.gpu.adapterVendor}`,"")),e.gpu.adapterError&&S(`  Adapter Error: ${e.gpu.adapterError}`,"err"),e.gpu.deviceError&&S(`  Device Error: ${e.gpu.deviceError}`,"err"),e.ready?!0:(S("",""),S("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function Xr(e){e.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,ce=e.querySelector("#diag-log"),e.querySelector("#btn-diag").addEventListener("click",()=>{Kr()})}const Qr=Object.freeze(Object.defineProperty({__proto__:null,render:Xr},Symbol.toStringTag,{value:"Module"}));class Q{dims;ndim;size;strides;constructor(r){this.dims=typeof r=="number"?[r]:[...r],this.ndim=this.dims.length,this.size=this.dims.reduce((a,o)=>a*o,1);const t=new Array(this.ndim);let n=1;for(let a=this.ndim-1;a>=0;a--)t[a]=n,n*=this.dims[a];this.strides=t}equals(r){if(this.ndim!==r.ndim)return!1;for(let t=0;t<this.ndim;t++)if(this.dims[t]!==r.dims[t])return!1;return!0}isContiguous(){let r=1;for(let t=this.ndim-1;t>=0;t--){if(this.strides[t]!==r)return!1;r*=this.dims[t]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new Q([1])}static from(...r){return new Q(r)}}var j=(e=>(e.Float32="f32",e.Float16="f16",e.Int32="i32",e.Int8="i8",e.Uint8="u8",e))(j||{});const Zr={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function vr(e){return Zr[e].bytes}let q=null;async function Jr(){if(q)return q;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const r=e.limits,t=new Set(e.features),n=await e.requestDevice({requiredLimits:{}});return n.lost.then(a=>{console.error("WebGPU device lost:",a.message),q=null}),q={adapter:e,device:n,limits:{maxBufferSize:r.maxBufferSize,maxTextureDimension1D:r.maxTextureDimension1D,maxTextureDimension2D:r.maxTextureDimension2D,maxTextureDimension3D:r.maxTextureDimension3D,maxComputeWorkgroupStorageSize:r.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:r.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:r.maxStorageBufferBindingSize,maxUniformBufferBindingSize:r.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:r.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:r.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:r.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:r.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:r.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:r.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:r.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:r.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:r.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:r.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:r.minStorageBufferOffsetAlignment,maxColorAttachments:r.maxColorAttachments,maxTextureArrayLayers:r.maxTextureArrayLayers},features:t},q}function T(){if(!q)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return q}function et(){q&&(q.device.destroy(),q=null)}class le{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(r,t,n){this.shape=r,this.dtype=t,this.byteSize=r.size*vr(t),this.gpuBuffer=n??T().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(r,t,n=j.Float32){const a=T(),o=new le(r,n);return a.device.queue.writeBuffer(o.gpuBuffer,0,t.buffer,t.byteOffset,t.byteLength),o}async readback(){const r=T(),t=r.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),n=r.device.createCommandEncoder();n.copyBufferToBuffer(this.gpuBuffer,0,t,0,this.byteSize),r.device.queue.submit([n.finish()]),await t.mapAsync(GPUMapMode.READ);const a=new Float32Array(t.getMappedRange().slice(0));return t.unmap(),t.destroy(),a}destroy(){this.gpuBuffer.destroy()}}class x{shape;dtype;buffer;constructor(r,t=j.Float32,n){this.shape=r,this.dtype=t,this.buffer=n??new le(r,t)}static fromFloat32(r,t){const n=r instanceof Float32Array?r:new Float32Array(r),a=new Q(t);return new x(a,j.Float32,le.fromData(a,n,j.Float32))}static fromInt32(r,t){const n=r instanceof Int32Array?r:new Int32Array(r),a=new Q(t);return new x(a,j.Int32,le.fromData(a,n,j.Int32))}static zeros(r,t=j.Float32){const n=new Q(r),a=n.size*vr(t),s=T().device.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(s.getMappedRange()).fill(0),s.unmap();const i=new le(n,t,s);return new x(n,t,i)}static ones(r,t=j.Float32){const n=new Q(r).size,a=new Float32Array(n).fill(1);return x.fromFloat32(a,r)}static randn(r){const t=new Q(r).size,n=new Float32Array(t);for(let a=0;a<t;a++){const o=Math.random(),s=Math.random();n[a]=Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*s)}return x.fromFloat32(n,r)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class rt{cache=new Map;getOrCreate(r,t,n){if(this.cache.has(r))return this.cache.get(r);const a=T(),o=a.device.createComputePipeline({layout:a.device.createPipelineLayout({bindGroupLayouts:[n]}),compute:{module:a.device.createShaderModule({code:t}),entryPoint:"main"}});return this.cache.set(r,o),o}get(r){return this.cache.get(r)}clear(){this.cache.clear()}}const tt=`
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
`,at=`
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
`,nt=`
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
`,ot=`
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
`,st=`
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
`,it=`
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
`,ut=`
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
`,ct=`
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
`,lt=`
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
`,ft=`
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
`;function dt(e,r,t,n,a){const o=new Float32Array(t*n);for(let s=0;s<t;s++)for(let i=0;i<n;i++){let u=0;for(let c=0;c<a;c++)u+=e[s*a+c]*r[c*n+i];o[s*n+i]=u}return o}function pt(e,r){const t=new Float32Array(e.length);for(let n=0;n<e.length;n++)t[n]=e[n]+r[n];return t}function mt(e,r){const t=new Float32Array(e.length);for(let n=0;n<e.length;n++)t[n]=e[n]*r[n];return t}function gt(e,r,t=1e-6){const n=e.length;let a=0;for(let i=0;i<n;i++)a+=e[i]*e[i];const o=Math.sqrt(a/n+t),s=new Float32Array(n);for(let i=0;i<n;i++)s[i]=e[i]/o*r[i];return s}function bt(e,r,t,n=1e-6){const a=e.length;let o=0;for(let c=0;c<a;c++)o+=e[c];o/=a;let s=0;for(let c=0;c<a;c++){const l=e[c]-o;s+=l*l}s/=a;const i=1/Math.sqrt(s+n),u=new Float32Array(a);for(let c=0;c<a;c++)u[c]=(e[c]-o)*i*r[c]+t[c];return u}function vt(e,r,t){const n=new Float32Array(e.length);for(let a=0;a<r;a++){const o=a*t;let s=-1e30;for(let u=0;u<t;u++)e[o+u]>s&&(s=e[o+u]);let i=0;for(let u=0;u<t;u++)n[o+u]=Math.exp(e[o+u]-s),i+=n[o+u];for(let u=0;u<t;u++)n[o+u]/=i}return n}function yt(e,r,t,n=1e4){const a=new Float32Array(e.length);a.set(e);for(let o=0;o<r*t/2;o++){const s=Math.floor(o/(t/2)),i=o%(t/2),u=1/Math.pow(n,i/t),c=s*u,l=Math.cos(c),f=Math.sin(c),d=o*2,m=o*2+1,p=a[d],g=a[m];a[d]=p*l-g*f,a[m]=p*f+g*l}return a}function wt(e,r,t,n,a,o,s,i,u){const c=a-i+1,l=o-u+1,f=new Float32Array(t*s*c*l);for(let d=0;d<t;d++)for(let m=0;m<s;m++)for(let p=0;p<c;p++)for(let g=0;g<l;g++){let b=0;for(let y=0;y<n;y++)for(let w=0;w<i;w++)for(let h=0;h<u;h++)b+=e[((d*n+y)*a+p+w)*o+g+h]*r[((m*n+y)*i+w)*u+h];f[((d*s+m)*c+p)*l+g]=b}return f}function ht(e,r,t){const n=new Float32Array(r*t);for(let a=0;a<r;a++)for(let o=0;o<t;o++)n[o*r+a]=e[a*t+o];return n}function xt(e,r,t,n,a,o){const s=new Float32Array(n*a*o);for(let i=0;i<a;i++)for(let u=0;u<n;u++){const c=u*r/n,l=i*t/a,f=Math.floor(c),d=Math.floor(l),m=Math.min(f+1,r-1),p=Math.min(d+1,t-1),g=c-f,b=l-d;for(let y=0;y<o;y++){const w=e[(d*r+f)*o+y],h=e[(d*r+m)*o+y],B=e[(p*r+f)*o+y],U=e[(p*r+m)*o+y];s[(i*n+u)*o+y]=w*(1-g)*(1-b)+h*g*(1-b)+B*(1-g)*b+U*g*b}}return s}const I=new rt;function Y(e){return T().device.createBindGroupLayout({entries:Array.from({length:e},(t,n)=>({binding:n,visibility:GPUShaderStage.COMPUTE,buffer:n===0?{type:"uniform"}:{type:"storage"}}))})}function Te(e){const r=T(),t=r.device.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.device.queue.writeBuffer(t,0,e),t}function se(e,r,t,n,a,o){const s=T(),i=Te(a),u=[{binding:0,resource:{buffer:i}},...n.map((f,d)=>({binding:d+1,resource:{buffer:f.buffer.gpuBuffer}}))],c=s.device.createBindGroup({layout:t,entries:u}),l=e.beginComputePass();return l.setPipeline(r),l.setBindGroup(0,c),l.dispatchWorkgroups(o),l.end(),i}async function ie(e,r,t,n,a){const o=T(),s=x.zeros([t,n]),i=Y(4),u=I.getOrCreate("matmul",tt,i),c=new ArrayBuffer(12),l=new Uint32Array(c);l[0]=t,l[1]=n,l[2]=a;const f=o.device.createCommandEncoder();return se(f,u,i,[e,r,s],c,Math.ceil(t/16)*Math.ceil(n/16)),o.device.queue.submit([f.finish()]),s}function ue(e,r,t,n,a){return dt(e,r,t,n,a)}async function je(e,r){const t=T(),n=x.zeros([e.shape.size]),a=Y(4),o=I.getOrCreate("add",at,a),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=t.device.createCommandEncoder();return se(i,o,a,[e,r,n],s,Math.ceil(e.shape.size/256)),t.device.queue.submit([i.finish()]),n}function Ve(e,r){return pt(e,r)}async function Ke(e,r){const t=T(),n=x.zeros([e.shape.size]),a=Y(4),o=I.getOrCreate("multiply",nt,a),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=t.device.createCommandEncoder();return se(i,o,a,[e,r,n],s,Math.ceil(e.shape.size/256)),t.device.queue.submit([i.finish()]),n}function Ye(e,r){return mt(e,r)}async function Xe(e,r,t=1e-6){const n=T(),a=e.shape.size,o=x.zeros([a]),s=Y(4),i=I.getOrCreate("rms_norm",ot,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=a,new Float32Array(u)[1]=t;const c=n.device.createCommandEncoder();return se(c,i,s,[e,r,o],u,1),n.device.queue.submit([c.finish()]),o}function Qe(e,r,t=1e-6){return gt(e,r,t)}async function Ze(e,r,t,n=1e-6){const a=T(),o=e.shape.size,s=x.zeros([o]),i=a.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=I.getOrCreate("layer_norm",st,i),c=new ArrayBuffer(8);new Uint32Array(c)[0]=o,new Float32Array(c)[1]=n;const l=T(),f=Te(c),d=l.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:e.buffer.gpuBuffer}},{binding:2,resource:{buffer:r.buffer.gpuBuffer}},{binding:3,resource:{buffer:t.buffer.gpuBuffer}},{binding:4,resource:{buffer:s.buffer.gpuBuffer}}]}),m=l.device.createCommandEncoder(),p=m.beginComputePass();return p.setPipeline(u),p.setBindGroup(0,d),p.dispatchWorkgroups(1),p.end(),l.device.queue.submit([m.finish()]),s}function Je(e,r,t,n=1e-6){return bt(e,r,t,n)}async function er(e,r,t){const n=T(),a=x.zeros([r,t]),o=n.device.createCommandEncoder();o.copyBufferToBuffer(e.buffer.gpuBuffer,0,a.buffer.gpuBuffer,0,r*t*4);const s=Y(2),i=I.getOrCreate("softmax",it,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=r,new Uint32Array(u)[1]=t;const c=Te(u),l=n.device.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:a.buffer.gpuBuffer}}]}),f=o.beginComputePass();return f.setPipeline(i),f.setBindGroup(0,l),f.dispatchWorkgroups(Math.ceil(r)),f.end(),n.device.queue.submit([o.finish()]),a}function rr(e,r,t){return vt(e,r,t)}async function tr(e,r,t,n=1e4){const a=T(),o=x.zeros([r,t]),s=a.device.createCommandEncoder();s.copyBufferToBuffer(e.buffer.gpuBuffer,0,o.buffer.gpuBuffer,0,r*t*4);const i=Y(2),u=I.getOrCreate("rope",ut,i),c=new ArrayBuffer(12);new Uint32Array(c)[0]=r,new Uint32Array(c)[1]=t,new Float32Array(c)[2]=n;const l=Te(c),f=a.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:o.buffer.gpuBuffer}}]}),d=s.beginComputePass();return d.setPipeline(u),d.setBindGroup(0,f),d.dispatchWorkgroups(Math.ceil(r*t/2/256)),d.end(),a.device.queue.submit([s.finish()]),o}function ar(e,r,t,n=1e4){return yt(e,r,t,n)}async function nr(e,r,t,n,a,o,s,i,u){const c=T(),l=a-i+1,f=o-u+1,d=x.zeros([t,s,l,f]),m=Y(4),p=I.getOrCreate("conv2d",ct,m),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=t,b[1]=n,b[2]=a,b[3]=o,b[4]=s,b[5]=i,b[6]=u,b[7]=l,b[8]=f;const y=c.device.createCommandEncoder();return se(y,p,m,[e,r,d],g,t*s),c.device.queue.submit([y.finish()]),d}function or(e,r,t,n,a,o,s,i,u){return wt(e,r,t,n,a,o,s,i,u)}async function sr(e,r,t){const n=T(),a=x.zeros([t,r]),o=Y(3),s=I.getOrCreate("transpose_2d",lt,o),i=new ArrayBuffer(8);new Uint32Array(i)[0]=r,new Uint32Array(i)[1]=t;const u=n.device.createCommandEncoder();return se(u,s,o,[e,a],i,Math.ceil(r/16)*Math.ceil(t/16)),n.device.queue.submit([u.finish()]),a}function ir(e,r,t){return ht(e,r,t)}async function ur(e,r,t,n,a,o){const s=T(),i=x.zeros([a*n*o]),u=Y(3),c=I.getOrCreate("interpolate_bilinear",ft,u),l=new ArrayBuffer(20),f=new Uint32Array(l);f[0]=r,f[1]=t,f[2]=n,f[3]=a,f[4]=o;const d=s.device.createCommandEncoder();return se(d,c,u,[e,i],l,Math.ceil(n/16)*Math.ceil(a/16)),s.device.queue.submit([d.finish()]),i}function cr(e,r,t,n,a,o){return xt(e,r,t,n,a,o)}let fe=null,Ce=null;function F(e,r=""){if(!fe)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,fe.appendChild(t),fe.scrollTop=fe.scrollHeight}function N(e,r,t=.001){if(e.length!==r.length)return!1;for(let n=0;n<e.length;n++){const a=Math.abs(e[n]-r[n]),o=Math.max(Math.abs(e[n]),Math.abs(r[n]),1e-8);if(a/o>t)return!1}return!0}async function _(e,r,t=20){for(let a=0;a<3;a++)r();const n=[];for(let a=0;a<t;a++){const o=performance.now();r(),n.push(performance.now()-o)}return n.reduce((a,o)=>a+o,0)/n.length}async function W(e,r,t=20){const n=[];for(let a=0;a<Math.min(5,t);a++)await r();for(let a=0;a<t;a++){const o=performance.now();await r(),n.push(performance.now()-o)}return n.reduce((a,o)=>a+o,0)/n.length}function St(e){if(!Ce)return;const r=document.createElement("tr");r.innerHTML=`
    <td style="font-weight:600">${e.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${e.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${e.speedup>=1?"var(--green)":"var(--red)"}">
      ${e.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${e.correct?"badge-pass":"badge-fail"}">${e.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${e.tolerance.toExponential(1)}</td>
  `,Ce.appendChild(r)}async function Pt(){fe.innerHTML="",Ce.innerHTML="",F("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),F("Initializing WebGPU...","");let e;try{e=await Jr()}catch(n){F(`FATAL: ${n.message}`,"err"),F("WebGPU is not available. Cannot run GPU benchmarks.","err");return}F(`GPU: ${e.adapter.name??"Unknown"}`,"ok"),F(`Running benchmarks...
`,"");const r=[];{const s=x.randn([64,64]),i=x.randn([64,64]),u=await s.readback(),c=await i.readback(),l=await _("matmul 64",()=>ue(u,c,64,64,64)),f=await W("matmul 64",async()=>{(await ie(s,i,64,64,64)).destroy()}),d=await(await ie(s,i,64,64,64)).readback(),m=ue(u,c,64,64,64),p=N(m,d),g=Math.max(...Array.from(m).map((b,y)=>Math.abs(b-d[y])));r.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:l,gpuMs:f,speedup:l/f,correct:p,tolerance:g}),s.destroy(),i.destroy()}{const s=x.randn([256,256]),i=x.randn([256,256]),u=await s.readback(),c=await i.readback(),l=await _("matmul 256",()=>ue(u,c,256,256,256),10),f=await W("matmul 256",async()=>{(await ie(s,i,256,256,256)).destroy()}),d=await(await ie(s,i,256,256,256)).readback(),m=ue(u,c,256,256,256),p=N(m,d),g=Math.max(...Array.from(m).map((b,y)=>Math.abs(b-d[y])));r.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:l,gpuMs:f,speedup:l/f,correct:p,tolerance:g}),s.destroy(),i.destroy()}{const s=x.randn([512,512]),i=x.randn([512,512]),u=await s.readback(),c=await i.readback(),l=await _("matmul 512",()=>ue(u,c,512,512,512),5),f=await W("matmul 512",async()=>{(await ie(s,i,512,512,512)).destroy()}),d=await(await ie(s,i,512,512,512)).readback(),m=ue(u,c,512,512,512),p=N(m,d),g=Math.max(...Array.from(m).map((b,y)=>Math.abs(b-d[y])));r.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:l,gpuMs:f,speedup:l/f,correct:p,tolerance:g}),s.destroy(),i.destroy()}{const a=x.randn([1e6]),o=x.randn([1e6]),s=await a.readback(),i=await o.readback(),u=await _("add 1M",()=>Ve(s,i)),c=await W("add 1M",async()=>{(await je(a,o)).destroy()}),l=await(await je(a,o)).readback(),f=Ve(s,i),d=N(f,l),m=Math.max(...Array.from(f).map((p,g)=>Math.abs(p-l[g])));r.push({name:"Add",shape:"[1000000]",cpuMs:u,gpuMs:c,speedup:u/c,correct:d,tolerance:m}),a.destroy(),o.destroy()}{const a=x.randn([1e6]),o=x.randn([1e6]),s=await a.readback(),i=await o.readback(),u=await _("mul 1M",()=>Ye(s,i)),c=await W("mul 1M",async()=>{(await Ke(a,o)).destroy()}),l=await(await Ke(a,o)).readback(),f=Ye(s,i),d=N(f,l),m=Math.max(...Array.from(f).map((p,g)=>Math.abs(p-l[g])));r.push({name:"Multiply",shape:"[1000000]",cpuMs:u,gpuMs:c,speedup:u/c,correct:d,tolerance:m}),a.destroy(),o.destroy()}{const a=x.randn([1024]),o=x.ones([1024]),s=await a.readback(),i=await o.readback(),u=await _("rmsnorm",()=>Qe(s,i)),c=await W("rmsnorm",async()=>{(await Xe(a,o)).destroy()}),l=await(await Xe(a,o)).readback(),f=Qe(s,i),d=N(f,l),m=Math.max(...Array.from(f).map((p,g)=>Math.abs(p-l[g])));r.push({name:"RMSNorm",shape:"[1024]",cpuMs:u,gpuMs:c,speedup:u/c,correct:d,tolerance:m}),a.destroy(),o.destroy()}{const a=x.randn([1024]),o=x.ones([1024]),s=x.zeros([1024]),i=await a.readback(),u=await o.readback(),c=await s.readback(),l=await _("layernorm",()=>Je(i,u,c)),f=await W("layernorm",async()=>{(await Ze(a,o,s)).destroy()}),d=await(await Ze(a,o,s)).readback(),m=Je(i,u,c),p=N(m,d),g=Math.max(...Array.from(m).map((b,y)=>Math.abs(b-d[y])));r.push({name:"LayerNorm",shape:"[1024]",cpuMs:l,gpuMs:f,speedup:l/f,correct:p,tolerance:g}),a.destroy(),o.destroy(),s.destroy()}{const o=x.randn([32,128]),s=await o.readback(),i=await _("softmax",()=>rr(new Float32Array(s),32,128)),u=await W("softmax",async()=>{(await er(x.fromFloat32(new Float32Array(s),[32,128]),32,128)).destroy()}),c=await(await er(x.fromFloat32(new Float32Array(s),[32,128]),32,128)).readback(),l=rr(new Float32Array(s),32,128),f=N(l,c),d=Math.max(...Array.from(l).map((m,p)=>Math.abs(m-c[p])));r.push({name:"Softmax",shape:"[32, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:f,tolerance:d}),o.destroy()}{const o=x.randn([16,128]),s=await o.readback(),i=await _("rope",()=>ar(new Float32Array(s),16,128)),u=await W("rope",async()=>{(await tr(x.fromFloat32(new Float32Array(s),[16,128]),16,128)).destroy()}),c=await(await tr(x.fromFloat32(new Float32Array(s),[16,128]),16,128)).readback(),l=ar(new Float32Array(s),16,128),f=N(l,c),d=Math.max(...Array.from(l).map((m,p)=>Math.abs(m-c[p])));r.push({name:"RoPE",shape:"[16, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:f,tolerance:d}),o.destroy()}{const l=x.randn([1,3,16,16]),f=x.randn([4,3,3,3]),d=await l.readback(),m=await f.readback(),p=await _("conv2d",()=>or(d,m,1,3,16,16,4,3,3)),g=await W("conv2d",async()=>{(await nr(l,f,1,3,16,16,4,3,3)).destroy()}),b=await(await nr(l,f,1,3,16,16,4,3,3)).readback(),y=or(d,m,1,3,16,16,4,3,3),w=N(y,b),h=Math.max(...Array.from(y).map((B,U)=>Math.abs(B-b[U])));r.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:p,gpuMs:g,speedup:p/g,correct:w,tolerance:h}),l.destroy(),f.destroy()}{const o=x.randn([256,256]),s=await o.readback(),i=await _("transpose",()=>ir(s,256,256)),u=await W("transpose",async()=>{(await sr(o,256,256)).destroy()}),c=await(await sr(o,256,256)).readback(),l=ir(s,256,256),f=N(l,c),d=Math.max(...Array.from(l).map((m,p)=>Math.abs(m-c[p])));r.push({name:"Transpose",shape:"[256, 256]",cpuMs:i,gpuMs:u,speedup:i/u,correct:f,tolerance:d}),o.destroy()}{const u=x.randn([3072]),c=await u.readback(),l=await _("interp",()=>cr(c,32,32,64,64,3)),f=await W("interp",async()=>{(await ur(u,32,32,64,64,3)).destroy()}),d=await(await ur(u,32,32,64,64,3)).readback(),m=cr(c,32,32,64,64,3),p=N(m,d),g=Math.max(...Array.from(m).map((b,y)=>Math.abs(b-d[y])));r.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:l,gpuMs:f,speedup:l/f,correct:p,tolerance:g}),u.destroy()}F("",""),F("═══ RESULTS ═══","info");for(const n of r){St(n);const a=n.correct?"✓":"✗",o=n.correct?"ok":"err";F(`${a} ${n.name} (${n.shape}): CPU ${n.cpuMs.toFixed(2)} ms | GPU ${n.gpuMs.toFixed(2)} ms | ${n.speedup.toFixed(1)}× | max diff ${n.tolerance.toExponential(1)}`,o)}const t=r.filter(n=>n.correct).length;F("",""),F(`═══ ${t}/${r.length} CORRECT ═══`,t===r.length?"ok":"err"),et()}function Ut(e){e.innerHTML=`
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
  `,fe=e.querySelector("#bench-log"),Ce=e.querySelector("#bench-tbody"),e.querySelector("#btn-run-bench").addEventListener("click",()=>{Pt()})}const Ct=Object.freeze(Object.defineProperty({__proto__:null,render:Ut},Symbol.toStringTag,{value:"Module"}));let X=null,xe="";function Bt(e){const r=e.environment,t=e.gpu,n=e.case==="D"?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)";let a=`
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
  `,a+=`
    <h3>WebGPU API</h3>
    <div class="card">
      <div class="row"><span class="row-label">navigator.gpu</span><span class="row-value" style="color:${t.navigatorGpuExists?"var(--green)":"var(--red)"}">${t.navigatorGpuExists?"Exists ✓":"Undefined ✗"}</span></div>
  `,t.adapterName&&(a+=`
      <div class="row"><span class="row-label">Adapter</span><span class="row-value">${t.adapterName}</span></div>
      <div class="row"><span class="row-label">Vendor</span><span class="row-value">${t.adapterVendor||"Unknown"}</span></div>
      <div class="row"><span class="row-label">Device</span><span class="row-value">${t.adapterDevice||"Unknown"}</span></div>
      <div class="row"><span class="row-label">Fallback</span><span class="row-value">${t.isFallbackAdapter?"Yes (software)":"No (hardware)"}</span></div>
    `),t.adapterError&&(a+=`<div class="row"><span class="row-label">Adapter Error</span><span class="row-value" style="color:var(--red)">${t.adapterError}</span></div>`),t.deviceError&&(a+=`<div class="row"><span class="row-label">Device Error</span><span class="row-value" style="color:var(--red)">${t.deviceError}</span></div>`),a+="</div>",t.limits){const o=t.limits,s=i=>i>=1073741824?`${(i/1073741824).toFixed(1)} GB`:i>=1048576?`${(i/1048576).toFixed(1)} MB`:i>=1024?`${(i/1024).toFixed(1)} KB`:`${i} B`;a+=`
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
    `}return t.features.length>0&&(a+=`
      <h3>Features (${t.features.length})</h3>
      <div class="card">
        ${t.features.map(o=>`<div class="row"><span class="row-value">${o}</span></div>`).join("")}
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
  `,a}function Mt(e){e.innerHTML=`
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;const r=e.querySelector("#wgdiag-result");X=e.querySelector("#btn-copy-report"),e.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{r.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',X.disabled=!0;const t=await Ee();xe=pr(t),r.innerHTML=Bt(t),X.disabled=!1}),X.addEventListener("click",async()=>{if(xe)try{await navigator.clipboard.writeText(xe),X.textContent="Copied!",setTimeout(()=>{X.textContent="Copy Diagnostics"},2e3)}catch{const t=document.createElement("textarea");t.value=xe,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t),X.textContent="Copied!",setTimeout(()=>{X.textContent="Copy Diagnostics"},2e3)}}),e.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const At=Object.freeze(Object.defineProperty({__proto__:null,render:Mt},Symbol.toStringTag,{value:"Module"}));let we=null,te=null,Be=null,_e=null;async function me(){if(te&&!we&&(te=null),te)return te;if(!navigator.gpu)throw new Error("WebGPU not supported");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const r=e.features.has("timestamp-query"),t=await e.requestDevice({requiredFeatures:r?["timestamp-query"]:[],requiredLimits:{}});Be=null,_e=null,t.lost.then(s=>{console.error("Benchmark device lost:",s.reason,s.message),Be=s.reason??"unknown",_e=s.message??"",we=null,te=null}),we=t;let n=null;try{n=navigator.gpu.getPreferredCanvasFormat()}catch{}const a=e.limits,o=[];for(const s of e.features)o.push(s);return te={webgpuAvailable:!0,adapterName:e.name??"Unknown",adapterVendor:e.vendor??"Unknown",adapterDevice:e.device??"Unknown",adapterFeatures:o,adapterLimits:{maxBufferSize:a.maxBufferSize,maxTextureDimension1D:a.maxTextureDimension1D,maxTextureDimension2D:a.maxTextureDimension2D,maxTextureDimension3D:a.maxTextureDimension3D,maxComputeWorkgroupStorageSize:a.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:a.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:a.maxStorageBufferBindingSize,maxUniformBufferBindingSize:a.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:a.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:a.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:a.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:a.maxComputeWorkgroupsPerDimension,maxColorAttachments:a.maxColorAttachments,minStorageBufferOffsetAlignment:a.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:a.minUniformBufferOffsetAlignment},preferredCanvasFormat:n,maxBufferSize:a.maxBufferSize,maxStorageBufferBindingSize:a.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:a.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:a.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:a.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:a.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:a.maxComputeWorkgroupsPerDimension,timestampQuerySupport:r,isFallbackAdapter:e.isFallbackAdapter??!1},te}function O(){if(!we)throw new Error("Benchmark not initialized. Call initBenchmark() first.");return we}function Et(){return{reason:Be,message:_e}}function ne(){return Be!==null}function ge(e){const r=O(),t=r.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(t,0,e),t}function K(e,r){const t=O(),n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(r){const a=t.createBuffer({size:Math.max(e,r.byteLength),usage:n,mappedAtCreation:!0});return new Float32Array(a.getMappedRange()).set(r),a.unmap(),a}return t.createBuffer({size:e,usage:n})}function be(e,r){const t=O(),n=t.createBindGroupLayout({entries:Array.from({length:r},(a,o)=>({binding:o,visibility:GPUShaderStage.COMPUTE,buffer:o===0?{type:"uniform"}:{type:"storage"}}))});return t.createComputePipeline({layout:t.createPipelineLayout({bindGroupLayouts:[n]}),compute:{module:t.createShaderModule({code:e}),entryPoint:"main"}})}const Tt=`
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
`,yr=`
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
`,$t=`
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
`,Gt=`
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
`,kt=`
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
`,Ot=`
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
`;function Dt(e,r){try{return e.pushErrorScope(r),!0}catch{return!1}}async function lr(e,r){let t=null;for(let n=0;n<r;n++)try{const a=await e.popErrorScope();a&&!t&&(t=a)}catch{}return t}function Nt(e,r){let t;const n=new Promise((a,o)=>{t=window.setTimeout(()=>o(new Error(`GPU operation timed out after ${r}ms`)),r)});return Promise.race([e,n]).finally(()=>{t!==void 0&&window.clearTimeout(t)})}async function ve(e){const r=O(),t=["validation","out-of-memory","internal"];let n=0;for(const a of t)Dt(r,a)&&n++;try{const a=r.createBuffer({size:e.outputBytes,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),o=r.createCommandEncoder(),s=o.beginComputePass();s.setPipeline(e.pipeline),s.setBindGroup(0,e.bindGroup),s.dispatchWorkgroups(...e.workgroups),s.end(),o.copyBufferToBuffer(e.outputBuffer,0,a,0,e.outputBytes),r.queue.submit([o.finish()]),await Nt(a.mapAsync(GPUMapMode.READ),15e3);const i=new Float32Array(a.getMappedRange().slice(0));a.unmap(),a.destroy();const u=await lr(r,n);if(u)return{pass:!1,error:`GPU Error: ${u.message}`};const c=e.validator(i);return{pass:c.pass,error:c.pass?null:c.error}}catch(a){return await lr(r,n),{pass:!1,error:a.message}}}function _t(e,r,t,n,a){const o=new Float32Array(t*n);for(let s=0;s<t;s++)for(let i=0;i<n;i++){let u=0;for(let c=0;c<a;c++)u+=e[s*a+c]*r[c*n+i];o[s*n+i]=u}return o}function Wt(e,r,t,n,a,o,s,i,u){const c=a-i+1,l=o-u+1,f=new Float32Array(t*s*c*l);for(let d=0;d<t;d++)for(let m=0;m<s;m++)for(let p=0;p<c;p++)for(let g=0;g<l;g++){let b=0;for(let y=0;y<n;y++)for(let w=0;w<i;w++)for(let h=0;h<u;h++)b+=e[((d*n+y)*a+p+w)*o+g+h]*r[((m*n+y)*i+w)*u+h];f[((d*s+m)*c+p)*l+g]=b}return f}function zt(e,r,t){const n=new Float32Array(e.length);for(let a=0;a<r;a++){const o=a*t;let s=-1e30;for(let u=0;u<t;u++)e[o+u]>s&&(s=e[o+u]);let i=0;for(let u=0;u<t;u++){const c=Math.exp(e[o+u]-s);n[o+u]=c,i+=c}for(let u=0;u<t;u++)n[o+u]/=i}return n}function Ft(e,r,t,n,a,o,s){const i=new Float32Array(n*a*o);for(let u=0;u<n;u++)for(let c=0;c<a;c++){const l=[];let f=-1e30;for(let p=0;p<a;p++){let g=0;for(let y=0;y<o;y++)g+=e[(u*a+c)*o+y]*r[(u*a+p)*o+y];const b=g*s;l.push(b),b>f&&(f=b)}let d=0;const m=l.map(p=>{const g=Math.exp(p-f);return d+=g,g});for(let p=0;p<a;p++){const g=m[p]/d;for(let b=0;b<o;b++)i[(u*a+c)*o+b]+=g*t[(u*a+p)*o+b]}}return i}function Lt(e,r,t){const n=e.length;let a=0;for(let i=0;i<n;i++)a+=e[i]*e[i];const o=Math.sqrt(a/n+t),s=new Float32Array(n);for(let i=0;i<n;i++)s[i]=e[i]/o*r[i];return s}function R(e){return K(e.byteLength,e)}async function Rt(){try{const r=new Float32Array(64).fill(1),t=new Float32Array(64).fill(2),n=R(r),a=R(t),o=K(64*4),s=new ArrayBuffer(4);new Uint32Array(s)[0]=64;const i=ge(s),u=be(Tt,4),c=O().createBindGroup({layout:u.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:o}}]}),l=await ve({name:"VecAdd",pipeline:u,bindGroup:c,workgroups:[1,1,1],outputBuffer:o,outputBytes:64*4,validator:f=>{const d=f.every((m,p)=>Math.abs(m-3)<1e-5);return{pass:d,error:d?"":"Incorrect values"}}});return n.destroy(),a.destroy(),o.destroy(),i.destroy(),{name:"VecAdd",pass:l.pass,maxError:0,details:l.error||"N=64"}}catch(e){return{name:"VecAdd",pass:!1,maxError:1/0,details:e.message}}}async function wr(){try{const r=new Float32Array(4096).fill(1),t=new Float32Array(64*64).fill(.5),n=R(r),a=R(t),o=K(64*64*4),s=new ArrayBuffer(12),i=new Uint32Array(s);i[0]=64,i[1]=64,i[2]=64;const u=ge(s),c=be(yr,4),l=O().createBindGroup({layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:o}}]}),f=await ve({name:"Matmul",pipeline:c,bindGroup:l,workgroups:[Math.ceil(64/16),Math.ceil(64/16),1],outputBuffer:o,outputBytes:64*64*4,validator:d=>{const m=_t(r,t,64,64,64);let p=0;for(let b=0;b<64*64;b++)p=Math.max(p,Math.abs(d[b]-m[b]));const g=p<.001;return{pass:g,error:g?"":`Max error: ${p}`}}});return n.destroy(),a.destroy(),o.destroy(),u.destroy(),{name:"Matmul",pass:f.pass,maxError:0,details:f.error||"64×64"}}catch(e){return{name:"Matmul",pass:!1,maxError:1/0,details:e.message}}}async function qt(){try{const c=new Float32Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]),l=new Float32Array([1,0,-1,1,0,-1,1,0,-1]),f=R(c),d=R(l),m=K(1*1*3*3*4),p=new ArrayBuffer(36),g=new Uint32Array(p);g[0]=1,g[1]=1,g[2]=5,g[3]=5,g[4]=1,g[5]=3,g[6]=3,g[7]=3,g[8]=3;const b=ge(p),y=be($t,4),w=O().createBindGroup({layout:y.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:d}},{binding:3,resource:{buffer:m}}]}),h=await ve({name:"Conv2D",pipeline:y,bindGroup:w,workgroups:[1,1,3*3],outputBuffer:m,outputBytes:1*1*3*3*4,validator:B=>{const U=Wt(c,l,1,1,5,5,1,3,3);let E=0;for(let G=0;G<B.length;G++)E=Math.max(E,Math.abs(B[G]-U[G]));const $=E<1e-4;return{pass:$,error:$?"":`Max error: ${E}`}}});return f.destroy(),d.destroy(),m.destroy(),b.destroy(),{name:"Conv2D",pass:h.pass,maxError:0,details:h.error||"1×1×5×5"}}catch(e){return{name:"Conv2D",pass:!1,maxError:1/0,details:e.message}}}async function It(){try{const t=new Float32Array([-2,-1,0,1,2,2,1,0,-1,-2]),n=K(t.byteLength,t),a=K(t.byteLength),o=new ArrayBuffer(8);new Uint32Array(o)[0]=2,new Uint32Array(o)[1]=5;const s=ge(o),i=be(Gt,3),u=O().createBindGroup({layout:i.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}}]}),c=await ve({name:"Softmax",pipeline:i,bindGroup:u,workgroups:[2,1,1],outputBuffer:a,outputBytes:t.byteLength,validator:l=>{const f=zt(t,2,5);let d=0;for(let p=0;p<t.length;p++)d=Math.max(d,Math.abs(l[p]-f[p]));const m=d<1e-4;return{pass:m,error:m?"":`Max error: ${d}`}}});return n.destroy(),a.destroy(),s.destroy(),{name:"Softmax",pass:c.pass,maxError:0,details:c.error||"Rows=2"}}catch(e){return{name:"Softmax",pass:!1,maxError:1/0,details:e.message}}}async function Ht(){try{const t=new Float32Array([1,2,3,4,5,6,7,8]),n=new Float32Array(8).fill(1),a=R(t),o=R(n),s=K(8*4),i=new ArrayBuffer(8);new Uint32Array(i)[0]=8,new Float32Array(i)[1]=1e-6;const u=ge(i),c=be(kt,4),l=O().createBindGroup({layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:s}}]}),f=await ve({name:"RMSNorm",pipeline:c,bindGroup:l,workgroups:[1,1,1],outputBuffer:s,outputBytes:8*4,validator:d=>{const m=Lt(t,n,1e-6);let p=0;for(let b=0;b<8;b++)p=Math.max(p,Math.abs(d[b]-m[b]));const g=p<.001;return{pass:g,error:g?"":`Max error: ${p}`}}});return a.destroy(),o.destroy(),s.destroy(),u.destroy(),{name:"RMSNorm",pass:f.pass,maxError:0,details:f.error||"N=8"}}catch(e){return{name:"RMSNorm",pass:!1,maxError:1/0,details:e.message}}}async function jt(){try{const n=1/Math.sqrt(4),a=1*4*4,o=1*4*4,s=()=>{const E=new Float32Array(a);for(let $=0;$<a;$++)E[$]=($%4+1)*.1;return E},i=s(),u=s(),c=s(),l=R(i),f=R(u),d=R(c),m=K(a*4),p=K(o*4),g=new ArrayBuffer(16),b=new Uint32Array(g),y=new Float32Array(g);b[0]=1,b[1]=4,b[2]=4,y[3]=n;const w=ge(g),h=be(Ot,6),B=O().createBindGroup({layout:h.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:d}},{binding:4,resource:{buffer:m}},{binding:5,resource:{buffer:p}}]}),U=await ve({name:"Attention",pipeline:h,bindGroup:B,workgroups:[1,1,1],outputBuffer:m,outputBytes:a*4,validator:E=>{const $=Ft(i,u,c,1,4,4,n);let G=0;for(let z=0;z<a;z++)G=Math.max(G,Math.abs(E[z]-$[z]));const H=G<.001;return{pass:H,error:H?"":`Max error: ${G}`}}});return l.destroy(),f.destroy(),d.destroy(),m.destroy(),p.destroy(),w.destroy(),{name:"Attention",pass:U.pass,maxError:0,details:U.error||"Finite check passed"}}catch(e){return{name:"Attention",pass:!1,maxError:1/0,details:e.message}}}const Vt=`
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
`,Kt=["validation","out-of-memory","internal"];function hr(e){let r=0;for(const t of Kt)try{e.pushErrorScope(t),r++}catch{}return r}async function Me(e,r){const t=[];for(let n=0;n<r;n++)try{const a=await e.popErrorScope();a&&t.push(a.message)}catch{}return t}async function xr(){const e={name:"GPU Sanity",pass:!1,expected:"[6, 8, 10, 12]",errors:[],exception:null};try{await me();const r=O(),t=hr(r),n=new Float32Array([1,2,3,4]),a=new Float32Array([5,6,7,8]),o=[6,8,10,12],s=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,i=r.createBuffer({size:16,usage:s,mappedAtCreation:!0});new Float32Array(i.getMappedRange()).set(n),i.unmap();const u=r.createBuffer({size:16,usage:s,mappedAtCreation:!0});new Float32Array(u.getMappedRange()).set(a),u.unmap();const c=r.createBuffer({size:16,usage:s}),l=r.createBuffer({size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),f=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),d=r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[f]}),compute:{module:r.createShaderModule({code:Vt}),entryPoint:"main"}}),m=r.createBindGroup({layout:f,entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:c}}]}),p=r.createCommandEncoder(),g=p.beginComputePass();g.setPipeline(d),g.setBindGroup(0,m),g.dispatchWorkgroups(1,1,1),g.end(),p.copyBufferToBuffer(c,0,l,0,16),r.queue.submit([p.finish()]),await l.mapAsync(GPUMapMode.READ);const b=new Float32Array(l.getMappedRange().slice(0));if(l.unmap(),l.destroy(),e.errors=await Me(r,t),e.errors.length>0)return e.pass=!1,e.actual=b.join(", "),e;const y=Array.from(b),w=o.every((h,B)=>Math.abs(y[B]-h)<1e-6);e.pass=w,e.actual=y.join(", "),i.destroy(),u.destroy(),c.destroy()}catch(r){e.exception=r.message;try{e.errors.push(...await Me(O(),3))}catch{}}return e}async function Yt(){const e={name:"Standalone MatMul 64×64",pass:!1,expected:"all elements = 32.0",errors:[],exception:null};try{await me();const r=O(),t=hr(r),n=64,a=64,o=n*n,s=new Float32Array(o).fill(1),i=new Float32Array(o).fill(.5),u=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,c=r.createBuffer({size:s.byteLength,usage:u,mappedAtCreation:!0});new Float32Array(c.getMappedRange()).set(s),c.unmap();const l=r.createBuffer({size:i.byteLength,usage:u,mappedAtCreation:!0});new Float32Array(l.getMappedRange()).set(i),l.unmap();const f=r.createBuffer({size:o*4,usage:u}),d=r.createBuffer({size:o*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),m=new ArrayBuffer(16),p=new Uint32Array(m);p[0]=n,p[1]=n,p[2]=a;const g=r.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(g,0,m);const b=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),y=r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[b]}),compute:{module:r.createShaderModule({code:yr}),entryPoint:"main"}}),w=r.createBindGroup({layout:b,entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:f}}]}),h=r.createCommandEncoder(),B=h.beginComputePass();B.setPipeline(y),B.setBindGroup(0,w),B.dispatchWorkgroups(4,4,1),B.end(),h.copyBufferToBuffer(f,0,d,0,o*4),r.queue.submit([h.finish()]),await d.mapAsync(GPUMapMode.READ);const U=new Float32Array(d.getMappedRange().slice(0));if(d.unmap(),d.destroy(),e.errors=await Me(r,t),e.errors.length>0)return e.actual=String(U[0]),e;let E=0;for(let $=0;$<o;$++)E=Math.max(E,Math.abs(U[$]-32));e.pass=E<.001,e.actual=`max err = ${E.toExponential(2)}`,c.destroy(),l.destroy(),f.destroy(),g.destroy()}catch(r){e.exception=r.message;try{e.errors.push(...await Me(O(),3))}catch{}}return e}const Ae="39f155de59e8b4f4cb1835b7e3ae119a96b69116";let We=null,V=!1,ze=!1;function P(e,r=""){if(!We)return;const t=We.querySelector("#bench-log");if(!t)return;const n=document.createElement("div");n.className=`log-entry ${r}`,n.textContent=e,t.appendChild(n),t.scrollTop=t.scrollHeight}function fr(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function oe(){const e=Et();P(`WEBGPU DEVICE LOST — reason: ${e.reason??"unknown"} — message: ${e.message??""}`,"err"),P("Remaining tests stopped.","err")}function $e(){if(!ze)try{const e=O();e.addEventListener("uncapturederror",r=>{const t=r.error;P(`UNCAPTURED GPU ERROR: ${t?.message??"unknown"}`,"err")}),e.lost.then(r=>{P(`WEBGPU DEVICE LOST — reason: ${r.reason} — message: ${r.message}`,"err")}),ze=!0}catch{}}async function Xt(){if(!V){V=!0;try{await me(),$e(),P("═══ GPU SANITY ═══","info");const e=await xr();P(`GPU SANITY: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.expected&&P(`  expected: ${e.expected}`,""),e.actual&&P(`  actual:   ${e.actual}`,e.pass?"ok":"err");for(const r of e.errors)P(`  GPU error scope result: ${r}`,"err");e.exception&&P(`  exception: ${e.exception}`,"err"),ne()&&oe()}catch(e){P(`ERROR: ${e.message}`,"err")}finally{V=!1}}}async function Qt(){if(!V){V=!0;try{await me(),$e(),P("═══ MATMUL DIAGNOSTICS ═══","info"),P("— 1/3 Standalone GPU sanity —","info");const e=await xr();P(`Standalone GPU sanity: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err");for(const n of e.errors)P(`  error scope result: ${n}`,"err");if(e.exception&&P(`  exception: ${e.exception}`,"err"),ne()){oe();return}P("— 2/3 Standalone MatMul (64×64) —","info");const r=await Yt();P(`Standalone MatMul: ${r.pass?"PASS":"FAIL"}`,r.pass?"ok":"err"),r.expected&&P(`  expected: ${r.expected}`,""),r.actual&&P(`  actual:   ${r.actual}`,r.pass?"ok":"err");for(const n of r.errors)P(`  error scope result: ${n}`,"err");if(r.exception&&P(`  exception: ${r.exception}`,"err"),ne()){oe();return}P("— 3/3 Harness MatMul (runGpuTest) —","info");const t=await wr();if(P(`Harness MatMul: ${t.pass?"PASS":"FAIL"} — ${t.details||""}`,t.pass?"ok":"err"),ne()){oe();return}P("═══ MATMUL DIAGNOSTICS COMPLETE ═══","info")}catch(e){P(`ERROR: ${e.message}`,"err"),ne()&&oe()}finally{V=!1}}}async function Zt(){if(!V){V=!0;try{await me(),$e(),P("═══ CORRECTNESS TESTS ═══","info");const e=[{name:"Vector Add",fn:Rt},{name:"Matmul",fn:wr},{name:"Conv2D",fn:qt},{name:"Softmax",fn:It},{name:"RMSNorm",fn:Ht},{name:"Attention",fn:jt}];let r=!0;for(const t of e){if(ne()){oe();return}try{const n=await t.fn();P(`${n.pass?"✓":"✗"} ${n.name}: ${n.details||""} (max err: ${n.maxError.toExponential(2)})`,n.pass?"ok":"err"),n.pass||(r=!1)}catch(n){P(`✗ ${t.name}: FAILED WITH ERROR: ${n.message}`,"err"),r=!1}}P("",""),P(r?"ALL TESTS PASSED":"SOME TESTS FAILED",r?"ok":"err")}catch(e){P(`ERROR: ${e.message}`,"err"),ne()&&oe()}finally{V=!1}}}function Jt(e){const r=e.querySelector("#diag-panel");if(!r)return;const t=[["location.href",location.href],["location.hash",location.hash],["location.protocol",location.protocol],["window.isSecureContext",String(window.isSecureContext)],["navigator.userAgent",navigator.userAgent],["AETHER_BUILD_ID",Ae],["Benchmark code revision",Ae]];r.innerHTML=t.map(([n,a])=>`<div style="font-size:11px;font-family:var(--mono);word-break:break-all">
        <span style="color:var(--text-dim)">${n}:</span> <b style="color:var(--text)">${a}</b>
      </div>`).join("")}function ea(e){We=e,ze=!1,e.innerHTML=`
    <h2>GPU Compute Benchmark — Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Isolated GPU checks. Performance benchmarks are disabled until correctness is proven.
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

    <div class="btn-row">
      <button class="btn" id="btn-sanity">GPU SANITY</button>
      <button class="btn btn-outline" id="btn-matmul">MATMUL</button>
      <button class="btn btn-outline" id="btn-correctness">CORRECTNESS</button>
    </div>

    <div class="log" id="bench-log"></div>

    <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;font-family:var(--mono);color:var(--text-dim)">
      <div>Build: <b id="build-id" style="color:var(--text)">${Ae}</b></div>
      <div>Environment: GitHub Pages</div>
      <div>Commit: <b id="build-commit" style="color:var(--text)">${Ae}</b></div>
    </div>
  `,Jt(e),e.querySelector("#btn-sanity")?.addEventListener("click",Xt),e.querySelector("#btn-matmul")?.addEventListener("click",Qt),e.querySelector("#btn-correctness")?.addEventListener("click",Zt);const r=t=>{t.preventDefault()};window.addEventListener("error",r),window.addEventListener("unhandledrejection",r),me().then(t=>{$e();const n=e.querySelector("#device-badge"),a=e.querySelector("#device-info");n&&(n.textContent="WEBGPU READY",n.className="badge badge-pass"),a&&(a.innerHTML=`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
          <span>Adapter:</span><span style="color:var(--text)">${t.adapterName}</span>
          <span>Vendor:</span><span style="color:var(--text)">${t.adapterVendor}</span>
          <span>Features:</span><span style="color:var(--text)">${t.adapterFeatures.length}</span>
          <span>Max Buffer:</span><span style="color:var(--text)">${fr(t.maxBufferSize)}</span>
          <span>Max Storage:</span><span style="color:var(--text)">${fr(t.maxStorageBufferBindingSize)}</span>
          <span>Workgroup X:</span><span style="color:var(--text)">${t.maxComputeWorkgroupSizeX}</span>
          <span>Invocations/wg:</span><span style="color:var(--text)">${t.maxComputeInvocationsPerWorkgroup}</span>
          <span>Timestamp Query:</span><span style="color:var(--text)">${t.timestampQuerySupport?"YES":"NO"}</span>
          <span>Preferred Format:</span><span style="color:var(--text)">${t.preferredCanvasFormat??"N/A"}</span>
          <span>Fallback:</span><span style="color:var(--text)">${t.isFallbackAdapter?"YES (software)":"NO (hardware)"}</span>
        </div>
      `)}).catch(t=>{const n=e.querySelector("#device-badge");n&&(n.textContent="WEBGPU UNAVAILABLE",n.className="badge badge-fail"),e.querySelector("#diag-panel")&&P(`WEBGPU not available: ${t.message}`,"err")})}const ra=Object.freeze(Object.defineProperty({__proto__:null,render:ea},Symbol.toStringTag,{value:"Module"})),Le=[{id:"gpubench",label:"GPU Bench",module:ra},{id:"device",label:"Device Test",module:$r},{id:"webgpudiag",label:"WebGPU Diag",module:At},{id:"model",label:"Model Test",module:Lr},{id:"tensor",label:"Tensor Bench",module:Ct},{id:"image",label:"Image Test",module:qr},{id:"video",label:"Video Test",module:Vr},{id:"diag",label:"Diagnostics",module:Qr}];let Sr="gpubench";function dr(){const e=window.location.hash.replace("#","");return Le.some(r=>r.id===e)?e:e==="diagnostics/webgpu"||e==="webgpu"?"webgpudiag":"gpubench"}function ke(e){Sr=e,window.location.hash=e;const r=document.getElementById("nav"),t=document.getElementById("screen");r.querySelectorAll("button").forEach(a=>{a.classList.toggle("active",a.dataset.screen===e)});const n=Le.find(a=>a.id===e);n&&n.module.render(t)}function ta(){const e=document.getElementById("app");e.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const r=document.getElementById("nav");document.getElementById("screen"),Le.forEach(n=>{const a=document.createElement("button");a.textContent=n.label,a.dataset.screen=n.id,a.addEventListener("click",()=>ke(n.id)),r.appendChild(a)});const t=dr();ke(t),window.addEventListener("hashchange",()=>{const n=dr();n!==Sr&&ke(n)})}ta();
