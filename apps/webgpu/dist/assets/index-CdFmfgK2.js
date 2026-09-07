(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=t(a);fetch(a.href,o)}})();function Fr(e){let r="Unknown",t="Unknown",n="Unknown",a="Unknown";const o=e.match(/OS (\d+)_(\d+)/);o&&(n="iOS",a=`${o[1]}.${o[2]}`);const s=e.match(/Mac OS X (\d+)[_.](\d+)/);if(s&&(n="macOS",a=`${s[1]}.${s[2]}`),e.includes("Windows")){n="Windows";const u=e.match(/Windows NT (\d+\.\d+)/);u&&(a=u[1])}if(e.includes("Android")){n="Android";const u=e.match(/Android (\d+[\.\d]*)/);u&&(a=u[1])}if(e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")){r="Safari";const u=e.match(/Version\/(\d+[\.\d]*)/);u&&(t=u[1])}if(e.includes("Chrome")&&!e.includes("Edg")){r="Chrome";const u=e.match(/Chrome\/(\d+[\.\d]*)/);u&&(t=u[1])}if(e.includes("Edg/")){r="Edge";const u=e.match(/Edg\/(\d+[\.\d]*)/);u&&(t=u[1])}if(e.includes("Firefox")){r="Firefox";const u=e.match(/Firefox\/(\d+[\.\d]*)/);u&&(t=u[1])}return{browserName:r,browserVersion:t,osName:n,osVersion:a}}function Rr(e){return!!(e.includes("FBAN")||e.includes("FBIOS")||e.includes("Twitter")||e.includes("Instagram")||e.includes("Line/")||e.includes("WeChat")||e.includes("MicroMessenger")||e.includes("CocoaPods")||e.includes("wv)")||e.includes("Electron")||e.includes("; wv)"))}function qr(e){return e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")}async function ke(){const e=navigator.userAgent,r=Fr(e),t=r.osName==="iOS",n=qr(e),a=Rr(e),o=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,s={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:e,platform:navigator.platform,isIOS:t,isSafari:n,isWebView:a,isStandalone:o,browserName:r.browserName,browserVersion:r.browserVersion,osName:r.osName,osVersion:r.osVersion},i={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(a)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:s,gpu:i};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:t?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:s,gpu:i};if(!navigator.gpu){let u="navigator.gpu is undefined. WebGPU API is not exposed.",c="";if(t){if(parseInt(r.osVersion.split(".")[0],10)<26)return u=`iOS ${r.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,c="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i};if(r.browserName!=="Safari")return u=`Running ${r.browserName} on iOS ${r.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,c="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:u,recommendation:c,environment:s,gpu:i}}return r.osName==="macOS"&&parseInt(r.osVersion.split(".")[0],10)<14?(u=`macOS ${r.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,c="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i}):(c="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i})}try{const u=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!u){i.adapterError="requestAdapter() returned null";let d="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",f="";return t?parseInt(r.osVersion.split(".")[0],10)>=26&&(d=`iOS ${r.osVersion} with Safari ${r.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,f="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(d="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",f="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):f="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:d,recommendation:f,environment:s,gpu:i}}i.adapterName=u.name??"Unknown GPU",i.adapterVendor=u.vendor??"Unknown",i.adapterDevice=u.device??"Unknown",i.isFallbackAdapter=u.isFallbackAdapter??!1;const c=[];for(const d of u.features)c.push(d.replace(/-/g," ").replace(/\b\w/g,f=>f.toUpperCase()));i.features=c;const l=u.limits;i.limits={maxBufferSize:l.maxBufferSize,maxTextureDimension1D:l.maxTextureDimension1D,maxTextureDimension2D:l.maxTextureDimension2D,maxTextureDimension3D:l.maxTextureDimension3D,maxComputeWorkgroupStorageSize:l.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:l.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:l.maxStorageBufferBindingSize,maxUniformBufferBindingSize:l.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:l.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:l.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:l.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:l.maxComputeWorkgroupsPerDimension,maxColorAttachments:l.maxColorAttachments,minStorageBufferOffsetAlignment:l.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:l.minUniformBufferOffsetAlignment};try{(await u.requestDevice({requiredLimits:{}})).destroy()}catch(d){return i.deviceError=d.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${i.adapterName}) but requestDevice() failed: ${d.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:s,gpu:i}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${i.adapterName}.`,recommendation:"No action needed.",environment:s,gpu:i}}catch(u){return i.adapterError=u.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${u.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:s,gpu:i}}}function xr(e){const r=[];if(r.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),r.push(""),r.push(`STATUS: ${e.statusLabel}`),r.push(`CASE: ${e.case}`),r.push(`REASON: ${e.reason}`),r.push(`RECOMMENDATION: ${e.recommendation}`),r.push(""),r.push("── ENVIRONMENT ──"),r.push(`  URL: ${e.environment.url}`),r.push(`  Protocol: ${e.environment.protocol}`),r.push(`  Hostname: ${e.environment.hostname}`),r.push(`  Secure Context: ${e.environment.isSecureContext}`),r.push(`  iOS: ${e.environment.isIOS}`),r.push(`  Safari: ${e.environment.isSafari}`),r.push(`  WebView: ${e.environment.isWebView}`),r.push(`  Standalone PWA: ${e.environment.isStandalone}`),r.push(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`),r.push(`  OS: ${e.environment.osName} ${e.environment.osVersion}`),r.push(`  Platform: ${e.environment.platform}`),r.push(`  User Agent: ${e.environment.userAgent}`),r.push(""),r.push("── WEBGPU ──"),r.push(`  navigator.gpu exists: ${e.gpu.navigatorGpuExists}`),e.gpu.adapterName&&r.push(`  Adapter: ${e.gpu.adapterName}`),e.gpu.adapterVendor&&r.push(`  Vendor: ${e.gpu.adapterVendor}`),e.gpu.adapterDevice&&r.push(`  Device: ${e.gpu.adapterDevice}`),e.gpu.adapterError&&r.push(`  Adapter Error: ${e.gpu.adapterError}`),e.gpu.deviceError&&r.push(`  Device Error: ${e.gpu.deviceError}`),r.push(`  Fallback adapter: ${e.gpu.isFallbackAdapter}`),e.gpu.features.length>0){r.push(`  Features (${e.gpu.features.length}):`);for(const t of e.gpu.features)r.push(`    ${t}`)}if(e.gpu.limits){r.push("  Limits:");for(const[t,n]of Object.entries(e.gpu.limits))r.push(`    ${t}: ${typeof n=="number"?n.toLocaleString():n}`)}return r.push(""),r.push(`Timestamp: ${new Date().toISOString()}`),r.join(`
`)}function he(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function J(){const e=await ke();if(!e.ready||!e.gpu.adapterName)return null;const r=e.gpu.limits;return{available:!0,adapterName:e.gpu.adapterName,adapterVendor:e.gpu.adapterVendor,adapterDevice:e.gpu.adapterDevice,features:e.gpu.features,limits:{maxBufferSize:r.maxBufferSize,maxTextureDimension1D:r.maxTextureDimension1D,maxTextureDimension2D:r.maxTextureDimension2D,maxTextureDimension3D:r.maxTextureDimension3D,maxComputeWorkgroupStorageSize:r.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:r.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:r.maxStorageBufferBindingSize,maxUniformBufferBindingSize:r.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:r.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:r.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:r.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:r.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:r.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:r.minUniformBufferOffsetAlignment,maxColorAttachments:r.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:e.gpu.isFallbackAdapter,featuresMap:new Set(e.gpu.features),diagnostic:e}}async function ee(e,r=[]){const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("Failed to re-acquire GPU adapter");const n=await t.requestDevice({requiredFeatures:r.filter(a=>e.featuresMap.has(a)),requiredLimits:{}});return n.lost.then(a=>{console.error("WebGPU device lost:",a.message)}),n}function Hr(e){const r=e.environment,t=e.gpu;let n="badge-fail";e.case==="D"?n="badge-pass":(e.case==="B"||e.case==="C")&&(n="badge-warn");let a=`
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
    `),a}function Ir(e){e.innerHTML=`
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;const r=e.querySelector("#device-status"),t=e.querySelector("#device-info");ke().then(n=>{n.ready?r.innerHTML=`
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `:r.innerHTML="",t.innerHTML=Hr(n)})}const jr=Object.freeze(Object.defineProperty({__proto__:null,render:Ir},Symbol.toStringTag,{value:"Module"}));let E=class Sr{buffer;shape;dtype;size;device;constructor(r,t,n="f32"){this.device=r,this.shape=[...t],this.dtype=n,this.size=t.reduce((s,i)=>s*i,1);const a=n==="f32"?4:n==="f16"?2:4;this.buffer=r.createBuffer({size:this.size*a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(n==="f32"?new Float32Array(this.buffer.getMappedRange()):n==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(r,t,n){const a=new Sr(r,n,t instanceof Float32Array?"f32":"i32");return r.queue.writeBuffer(a.buffer,0,t.buffer),a}async readback(){const r=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t=this.device.createCommandEncoder();t.copyBufferToBuffer(this.buffer,0,r,0,this.buffer.size),this.device.queue.submit([t.finish()]),await r.mapAsync(GPUMapMode.READ);const n=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),n}destroy(){this.buffer.destroy()}};async function de(e,r,t=50,n){const a=[];for(let c=0;c<Math.min(5,t);c++)await r();for(let c=0;c<t;c++){const l=performance.now();await r(),await Ur?.queue.onSubmittedWorkDone();const d=performance.now();a.push(d-l)}a.sort((c,l)=>c-l);const o=a.reduce((c,l)=>c+l,0)/a.length,s=a[0],i=a[a.length-1],u={name:e,avgMs:o,minMs:s,maxMs:i,iterations:t};if(n){const l=n/(o/1e3)/1e9;u.gflops=l,u.throughput=`${l.toFixed(2)} GFLOPS`}return u}let Ur=null;function re(e){Ur=e}function fe(e){const r=[`${e.name}: ${e.avgMs.toFixed(2)} ms avg`,`(${e.minMs.toFixed(2)} – ${e.maxMs.toFixed(2)} ms)`,`[${e.iterations} iterations]`];return e.throughput&&r.push(e.throughput),r.join(" ")}const Ce=`
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
`,Vr=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= uniforms.N) { return; }
  data[i] = max(data[i], 0.0);
}
`,Kr=`
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
`,Yr=`
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
`,Xr=`
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
`,Zr=`
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
`;let v=null,ae=null;function B(e,r=""){if(!ae)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,ae.appendChild(t),ae.scrollTop=ae.scrollHeight}async function Ye(){B("═══ TINY NEURAL NETWORK TEST ═══","info"),B("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),B("");const e=await J();if(!e)return B("WebGPU not available","err"),!1;v=await ee(e),re(v);const r=performance.now(),t=E.fromData(v,new Float32Array([1,.5,-.3,.8]),[4]),n=E.fromData(v,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),a=E.fromData(v,new Float32Array([.1,-.1,.2]),[3]),o=new ArrayBuffer(12),s=new Uint32Array(o);s[0]=1,s[1]=3,s[2]=4;const i=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:v.createShaderModule({code:Ce}),entryPoint:"main"}}),c=v.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(c,0,o);const l=new E(v,[1,3]),d=v.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:t.buffer}},{binding:2,resource:{buffer:n.buffer}},{binding:3,resource:{buffer:l.buffer}}]});let f=v.createCommandEncoder(),m=f.beginComputePass();m.setPipeline(u),m.setBindGroup(0,d),m.dispatchWorkgroups(1,1,1),m.end(),v.queue.submit([f.finish()]),B(`  input[4]:  [${Array.from(await t.readback()).map(D=>D.toFixed(2)).join(", ")}]`,""),B("  W1[4×3]:   4 rows × 3 cols",""),B("  Matmul result: computing...","");const p=await l.readback();B(`  h1 = input @ W1: [${Array.from(p).map(D=>D.toFixed(3)).join(", ")}]`,"ok");for(let D=0;D<3;D++)p[D]+=[.1,-.1,.2][D];v.queue.writeBuffer(l.buffer,0,p.buffer),B(`  h1 + bias:       [${Array.from(p).map(D=>D.toFixed(3)).join(", ")}]`,"ok");const g=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),b=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[g]}),compute:{module:v.createShaderModule({code:Vr}),entryPoint:"main"}}),y=new ArrayBuffer(4);new Uint32Array(y)[0]=3;const w=v.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(w,0,y);const h=v.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:l.buffer}}]});f=v.createCommandEncoder(),m=f.beginComputePass(),m.setPipeline(b),m.setBindGroup(0,h),m.dispatchWorkgroups(1,1,1),m.end(),v.queue.submit([f.finish()]);const C=await l.readback();B(`  ReLU(h1):         [${Array.from(C).map(D=>D.toFixed(3)).join(", ")}]`,"ok");const P=E.fromData(v,new Float32Array([.7,-.3,.5]),[3,1]),A=new E(v,[1,1]),T=new ArrayBuffer(12),k=new Uint32Array(T);k[0]=1,k[1]=1,k[2]=3;const O=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),z=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[O]}),compute:{module:v.createShaderModule({code:Ce}),entryPoint:"main"}}),Oe=v.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(Oe,0,T);const Wr=v.createBindGroup({layout:O,entries:[{binding:0,resource:{buffer:Oe}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:P.buffer}},{binding:3,resource:{buffer:A.buffer}}]});f=v.createCommandEncoder(),m=f.beginComputePass(),m.setPipeline(z),m.setBindGroup(0,Wr),m.dispatchWorkgroups(1,1,1),m.end(),v.queue.submit([f.finish()]);const Lr=await A.readback(),zr=(performance.now()-r).toFixed(1);return B(`  Final output: ${Lr[0].toFixed(4)}`,"ok"),B(`  Total pipeline: ${zr} ms`,"ok"),B("",""),B("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),t.destroy(),n.destroy(),a.destroy(),l.destroy(),P.destroy(),A.destroy(),c.destroy(),Oe.destroy(),w.destroy(),v.destroy(),!0}async function Qr(){B("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const e=await J();if(!e)return null;v=await ee(e),re(v);const r=[64,128,256,512],t=[];for(const n of r){const a=E.fromData(v,new Float32Array(n*n).fill(1),[n,n]),o=E.fromData(v,new Float32Array(n*n).fill(.5),[n,n]),s=new E(v,[n,n]),i=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:v.createShaderModule({code:Ce}),entryPoint:"main"}}),c=new ArrayBuffer(12),l=new Uint32Array(c);l[0]=n,l[1]=n,l[2]=n;const d=await de(`${n}×${n} matmul`,async()=>{const f=v.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(f,0,c);const m=v.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:s.buffer}}]}),p=v.createCommandEncoder(),g=p.beginComputePass();g.setPipeline(u),g.setBindGroup(0,m);const b=Math.ceil(n/16);g.dispatchWorkgroups(b,b,1),g.end(),v.queue.submit([p.finish()]),f.destroy()},30,2*n*n*n);t.push(d),B(fe(d),"ok"),a.destroy(),o.destroy(),s.destroy()}return v.destroy(),t[t.length-1]}async function Jr(){B("═══ CONVOLUTION BENCHMARK ═══","info");const e=await J();if(!e)return null;v=await ee(e),re(v);const r=1,t=3,n=32,a=32,o=8,s=3,i=3,u=n-s+1,c=a-i+1,l=E.fromData(v,new Float32Array(r*t*n*a).fill(.5),[r,t,n,a]),d=E.fromData(v,new Float32Array(o*t*s*i).fill(.1),[o,t,s,i]),f=new E(v,[r,o,u,c]),m=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),p=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[m]}),compute:{module:v.createShaderModule({code:Kr}),entryPoint:"main"}}),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=r,b[1]=t,b[2]=n,b[3]=a,b[4]=o,b[5]=s,b[6]=i,b[7]=u,b[8]=c;const y=await de(`Conv2D ${r}×${t}×${n}×${a} k=${s}→${o}×${u}×${c}`,async()=>{const w=v.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(w,0,g);const h=v.createBindGroup({layout:m,entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:d.buffer}},{binding:3,resource:{buffer:f.buffer}}]}),C=v.createCommandEncoder(),P=C.beginComputePass();P.setPipeline(p),P.setBindGroup(0,h),P.dispatchWorkgroups(r,o,1),P.end(),v.queue.submit([C.finish()]),w.destroy()},20,2*r*o*t*s*i*u*c);return B(fe(y),"ok"),l.destroy(),d.destroy(),f.destroy(),v.destroy(),y}async function et(){B("═══ ATTENTION BENCHMARK ═══","info");const e=await J();if(!e)return null;v=await ee(e),re(v);const r=1,t=64,n=64,a=1/Math.sqrt(n),o=E.fromData(v,new Float32Array(r*t*n).fill(.1),[r,t,n]),s=E.fromData(v,new Float32Array(r*t*n).fill(.1),[r,t,n]),i=E.fromData(v,new Float32Array(r*t*n).fill(.1),[r,t,n]),u=new E(v,[r,t,n]),c=new E(v,[r,t,t]),l=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),d=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[l]}),compute:{module:v.createShaderModule({code:Yr}),entryPoint:"main"}}),f=new ArrayBuffer(16),m=new Uint32Array(f),p=new Float32Array(f);m[0]=r,m[1]=t,m[2]=n,p[3]=a;const g=await de(`Attention b=${r} s=${t} d=${n}`,async()=>{const b=v.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(b,0,f);const y=v.createBindGroup({layout:l,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}},{binding:4,resource:{buffer:u.buffer}},{binding:5,resource:{buffer:c.buffer}}]}),w=v.createCommandEncoder(),h=w.beginComputePass();h.setPipeline(d),h.setBindGroup(0,y),h.dispatchWorkgroups(r,1,1),h.end(),v.queue.submit([w.finish()]),b.destroy()},20);return B(fe(g),"ok"),o.destroy(),s.destroy(),i.destroy(),u.destroy(),c.destroy(),v.destroy(),g}function rt(e){e.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,ae=e.querySelector("#model-log"),e.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{ae.innerHTML="",await Ye()}),e.querySelector("#btn-all-bench").addEventListener("click",async()=>{ae.innerHTML="",await Ye(),B("",""),await Qr(),B("",""),await Jr(),B("",""),await et(),B("",""),B("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const tt=Object.freeze(Object.defineProperty({__proto__:null,render:rt},Symbol.toStringTag,{value:"Module"}));let U=null,Q=null;function R(e,r=""){if(!Q)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,Q.appendChild(t),Q.scrollTop=Q.scrollHeight}function Pr(e,r){const t=new Float32Array(e*r*4);for(let n=0;n<r;n++)for(let a=0;a<e;a++){const o=(n*e+a)*4,s=(a>>4)+(n>>4)&1;t[o+0]=s?.9:a/e*.8,t[o+1]=s?.3:n/r*.6,t[o+2]=s?.6:.4,t[o+3]=1}return t}function _e(e,r,t){const n=document.createElement("canvas");n.width=r,n.height=t;const a=n.getContext("2d"),o=a.createImageData(r,t);for(let s=0;s<r*t*4;s++)o.data[s]=Math.round(e[s]*255);return a.putImageData(o,0,0),n}async function Xe(){R("═══ GRAYSCALE TEST ═══","info");const e=await J();if(!e){R("WebGPU unavailable","err");return}U=await ee(e),re(U);const r=256,t=256,n=Pr(r,t),a=E.fromData(U,n,[r*t*4]),o=new E(U,[r*t*4]),s=U.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=U.createComputePipeline({layout:U.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:U.createShaderModule({code:Zr}),entryPoint:"main"}}),u=new ArrayBuffer(4);new Uint32Array(u)[0]=r*t;const c=await de("Grayscale 256×256",async()=>{const p=U.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});U.queue.writeBuffer(p,0,u);const g=U.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:o.buffer}}]}),b=U.createCommandEncoder(),y=b.beginComputePass();y.setPipeline(i),y.setBindGroup(0,g),y.dispatchWorkgroups(Math.ceil(r*t/256),1,1),y.end(),U.queue.submit([b.finish()]),p.destroy()},50);R(fe(c),"ok");const l=await o.readback(),d=_e(n,r,t),f=_e(l,r,t),m=qe?.querySelector("#image-display");if(m){m.innerHTML="";const p=document.createElement("div");p.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const g=document.createElement("div");g.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',g.appendChild(d);const b=document.createElement("div");b.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',b.appendChild(f),p.appendChild(g),p.appendChild(b),m.appendChild(p)}a.destroy(),o.destroy(),U.destroy(),R("✓ Grayscale complete","ok")}async function Ze(){R("═══ CONVOLUTION KERNEL TEST ═══","info");const e=await J();if(!e){R("WebGPU unavailable","err");return}U=await ee(e),re(U);const r=128,t=128,n=3,a=Pr(r,t),o={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},s=U.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=U.createComputePipeline({layout:U.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:U.createShaderModule({code:Xr}),entryPoint:"main"}}),u=new ArrayBuffer(16),c=new Uint32Array(u);c[0]=r,c[1]=t,c[2]=n,c[3]=0;for(const[l,d]of Object.entries(o)){const f=E.fromData(U,a,[r*t*4]),m=E.fromData(U,d,[n*n]),p=new E(U,[r*t*4]),g=await de(`Conv ${l} ${r}×${t}`,async()=>{const w=U.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});U.queue.writeBuffer(w,0,u);const h=U.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:m.buffer}},{binding:2,resource:{buffer:f.buffer}},{binding:3,resource:{buffer:p.buffer}}]}),C=U.createCommandEncoder(),P=C.beginComputePass();P.setPipeline(i),P.setBindGroup(0,h),P.dispatchWorkgroups(Math.ceil(r/16),Math.ceil(t/16),1),P.end(),U.queue.submit([C.finish()]),w.destroy()},30);R(fe(g),"ok");const b=await p.readback(),y=qe?.querySelector("#image-display");if(y){const w=_e(b,r,t),h=document.createElement("div");h.style.cssText="display:inline-block;margin:4px",h.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${l}</div>`,h.appendChild(w),y.appendChild(h)}f.destroy(),m.destroy(),p.destroy()}U.destroy(),R("✓ All convolution kernels applied","ok")}let qe=null;function at(e){qe=e,e.innerHTML=`
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
  `,Q=e.querySelector("#image-log"),e.querySelector("#btn-grayscale").addEventListener("click",async()=>{Q.innerHTML="",e.querySelector("#image-display").innerHTML="",await Xe()}),e.querySelector("#btn-conv").addEventListener("click",async()=>{Q.innerHTML="",e.querySelector("#image-display").innerHTML="",await Ze()}),e.querySelector("#btn-all-img").addEventListener("click",async()=>{Q.innerHTML="",e.querySelector("#image-display").innerHTML="",await Xe(),R("",""),await Ze(),R("",""),R("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const nt=Object.freeze(Object.defineProperty({__proto__:null,render:at},Symbol.toStringTag,{value:"Module"}));let G=null,ve=null,Se=null;function We(e,r=""){if(!ve)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,ve.appendChild(t),ve.scrollTop=ve.scrollHeight}const ot=`
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
`;let Le=0,Ue=0;async function st(e,r,t,n,a){const o=await J();if(!o){We("WebGPU unavailable","err");return}G=await ee(o),re(G);const[s,i]=n.value.split("x").map(Number);e.width=s,e.height=i,Le=parseInt(a.value);const u=G.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=G.createComputePipeline({layout:G.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:G.createShaderModule({code:ot}),entryPoint:"main"}}),l=G.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),d=e.getContext("2d"),f=G.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let m=performance.now(),p=0,g=0;r.textContent="RENDERING",r.className="badge badge-pass";function b(){const y=new ArrayBuffer(16),w=new Uint32Array(y);w[0]=s,w[1]=i,w[2]=Ue,w[3]=Le,G.queue.writeBuffer(f,0,y);const h=G.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:l}}]}),C=G.createCommandEncoder(),P=C.beginComputePass();P.setPipeline(c),P.setBindGroup(0,h),P.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(i/16),1),P.end();const A=G.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});C.copyBufferToBuffer(l,0,A,0,s*i*4*4),G.queue.submit([C.finish()]),A.mapAsync(GPUMapMode.READ).then(()=>{const T=new Float32Array(A.getMappedRange().slice(0));A.unmap(),A.destroy();const k=d.createImageData(s,i);for(let z=0;z<s*i*4;z++)k.data[z]=Math.round(T[z]*255);d.putImageData(k,0,0),Ue++,g++;const O=performance.now();O-m>=1e3&&(p=Math.round(g*1e3/(O-m)),t.textContent=`${p} FPS | Frame ${Ue} | ${s}×${i}`,g=0,m=O),Se=requestAnimationFrame(b)})}b()}function Qe(){Se!==null&&(cancelAnimationFrame(Se),Se=null),G&&(G.destroy(),G=null)}function it(e){e.innerHTML=`
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
  `,ve=e.querySelector("#video-log");const r=e.querySelector("#video-canvas"),t=e.querySelector("#video-status"),n=e.querySelector("#video-fps"),a=e.querySelector("#res-select"),o=e.querySelector("#mode-select");e.querySelector("#btn-start").addEventListener("click",()=>{Qe(),Ue=0,Le=parseInt(o.value),We(`Starting GPU compute video: ${a.value} mode=${o.value}`,"info"),st(r,t,n,a,o)}),e.querySelector("#btn-stop").addEventListener("click",()=>{Qe(),t.textContent="STOPPED",t.className="badge badge-info",We("Rendering stopped","warn")})}const ut=Object.freeze(Object.defineProperty({__proto__:null,render:it},Symbol.toStringTag,{value:"Module"}));let ie=null;function S(e,r=""){if(!ie)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,ie.appendChild(t),ie.scrollTop=ie.scrollHeight}async function ct(){if(ie.innerHTML="",S("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),S(`Timestamp: ${new Date().toISOString()}`,""),!await lt())return;const r=await J();if(!r){S("Cannot proceed: GPU not ready","err");return}S("",""),S("── MEMORY TEST ──","info");const t=await ee(r);re(t);const n=Math.floor(r.limits.maxBufferSize/1048576);S(`Attempting to allocate buffer at reported max: ${n} MB`,"");try{const a=t.createBuffer({size:r.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});S("Buffer allocation at max: SUCCESS","ok"),a.destroy()}catch(a){S(`Buffer allocation at max: FAILED — ${a.message}`,"warn");for(const o of[256,128,64,32])try{const s=t.createBuffer({size:o*1048576,usage:GPUBufferUsage.STORAGE});S(`Largest successful allocation: ${o} MB`,"ok"),s.destroy();break}catch{continue}}S("",""),S("── COMPUTE THROUGHPUT ──","info");for(const a of[64,128,256]){const o=E.fromData(t,new Float32Array(a*a).fill(1),[a,a]),s=E.fromData(t,new Float32Array(a*a).fill(1),[a,a]),i=new E(t,[a,a]),u=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=t.createComputePipeline({layout:t.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:t.createShaderModule({code:Ce}),entryPoint:"main"}}),l=await de(`matmul ${a}×${a}`,async()=>{const d=t.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),f=new ArrayBuffer(12);new Uint32Array(f).set([a,a,a]),t.queue.writeBuffer(d,0,f);const m=t.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),p=t.createCommandEncoder(),g=p.beginComputePass();g.setPipeline(c),g.setBindGroup(0,m);const b=Math.ceil(a/16);g.dispatchWorkgroups(b,b,1),g.end(),t.queue.submit([p.finish()]),d.destroy()},30,2*a*a*a);S(fe(l),"ok"),o.destroy(),s.destroy(),i.destroy()}t.destroy(),S("",""),S("═══ DIAGNOSTICS COMPLETE ═══","info")}async function lt(){const e=await ke();return xr(e),S("── WEBGPU STATUS ──","info"),S(`${e.statusLabel} (Case ${e.case})`,e.ready?"ok":"err"),S(`Reason: ${e.reason}`,""),S(`Recommendation: ${e.recommendation}`,""),S("",""),S("── ENVIRONMENT ──","info"),S(`  URL: ${e.environment.url}`,""),S(`  Secure Context: ${e.environment.isSecureContext}`,e.environment.isSecureContext?"ok":"err"),S(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`,""),S(`  OS: ${e.environment.osName} ${e.environment.osVersion}`,""),S(`  iOS: ${e.environment.isIOS}`,""),S(`  Safari: ${e.environment.isSafari}`,""),S(`  WebView: ${e.environment.isWebView}`,e.environment.isWebView?"err":""),S(`  navigator.gpu: ${e.gpu.navigatorGpuExists}`,e.gpu.navigatorGpuExists?"ok":"err"),e.gpu.adapterName&&(S(`  Adapter: ${e.gpu.adapterName}`,"ok"),S(`  Vendor: ${e.gpu.adapterVendor}`,"")),e.gpu.adapterError&&S(`  Adapter Error: ${e.gpu.adapterError}`,"err"),e.gpu.deviceError&&S(`  Device Error: ${e.gpu.deviceError}`,"err"),e.ready?!0:(S("",""),S("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function dt(e){e.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,ie=e.querySelector("#diag-log"),e.querySelector("#btn-diag").addEventListener("click",()=>{ct()})}const ft=Object.freeze(Object.defineProperty({__proto__:null,render:dt},Symbol.toStringTag,{value:"Module"}));class Z{dims;ndim;size;strides;constructor(r){this.dims=typeof r=="number"?[r]:[...r],this.ndim=this.dims.length,this.size=this.dims.reduce((a,o)=>a*o,1);const t=new Array(this.ndim);let n=1;for(let a=this.ndim-1;a>=0;a--)t[a]=n,n*=this.dims[a];this.strides=t}equals(r){if(this.ndim!==r.ndim)return!1;for(let t=0;t<this.ndim;t++)if(this.dims[t]!==r.dims[t])return!1;return!0}isContiguous(){let r=1;for(let t=this.ndim-1;t>=0;t--){if(this.strides[t]!==r)return!1;r*=this.dims[t]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new Z([1])}static from(...r){return new Z(r)}}var V=(e=>(e.Float32="f32",e.Float16="f16",e.Int32="i32",e.Int8="i8",e.Uint8="u8",e))(V||{});const pt={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function Cr(e){return pt[e].bytes}let I=null;async function mt(){if(I)return I;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const r=e.limits,t=new Set(e.features),n=await e.requestDevice({requiredLimits:{}});return n.lost.then(a=>{console.error("WebGPU device lost:",a.message),I=null}),I={adapter:e,device:n,limits:{maxBufferSize:r.maxBufferSize,maxTextureDimension1D:r.maxTextureDimension1D,maxTextureDimension2D:r.maxTextureDimension2D,maxTextureDimension3D:r.maxTextureDimension3D,maxComputeWorkgroupStorageSize:r.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:r.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:r.maxStorageBufferBindingSize,maxUniformBufferBindingSize:r.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:r.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:r.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:r.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:r.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:r.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:r.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:r.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:r.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:r.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:r.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:r.minStorageBufferOffsetAlignment,maxColorAttachments:r.maxColorAttachments,maxTextureArrayLayers:r.maxTextureArrayLayers},features:t},I}function $(){if(!I)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return I}function gt(){I&&(I.device.destroy(),I=null)}class ue{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(r,t,n){this.shape=r,this.dtype=t,this.byteSize=r.size*Cr(t),this.gpuBuffer=n??$().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(r,t,n=V.Float32){const a=$(),o=new ue(r,n);return a.device.queue.writeBuffer(o.gpuBuffer,0,t.buffer,t.byteOffset,t.byteLength),o}async readback(){const r=$(),t=r.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),n=r.device.createCommandEncoder();n.copyBufferToBuffer(this.gpuBuffer,0,t,0,this.byteSize),r.device.queue.submit([n.finish()]),await t.mapAsync(GPUMapMode.READ);const a=new Float32Array(t.getMappedRange().slice(0));return t.unmap(),t.destroy(),a}destroy(){this.gpuBuffer.destroy()}}class x{shape;dtype;buffer;constructor(r,t=V.Float32,n){this.shape=r,this.dtype=t,this.buffer=n??new ue(r,t)}static fromFloat32(r,t){const n=r instanceof Float32Array?r:new Float32Array(r),a=new Z(t);return new x(a,V.Float32,ue.fromData(a,n,V.Float32))}static fromInt32(r,t){const n=r instanceof Int32Array?r:new Int32Array(r),a=new Z(t);return new x(a,V.Int32,ue.fromData(a,n,V.Int32))}static zeros(r,t=V.Float32){const n=new Z(r),a=n.size*Cr(t),s=$().device.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(s.getMappedRange()).fill(0),s.unmap();const i=new ue(n,t,s);return new x(n,t,i)}static ones(r,t=V.Float32){const n=new Z(r).size,a=new Float32Array(n).fill(1);return x.fromFloat32(a,r)}static randn(r){const t=new Z(r).size,n=new Float32Array(t);for(let a=0;a<t;a++){const o=Math.random(),s=Math.random();n[a]=Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*s)}return x.fromFloat32(n,r)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class bt{cache=new Map;getOrCreate(r,t,n){if(this.cache.has(r))return this.cache.get(r);const a=$(),o=a.device.createComputePipeline({layout:a.device.createPipelineLayout({bindGroupLayouts:[n]}),compute:{module:a.device.createShaderModule({code:t}),entryPoint:"main"}});return this.cache.set(r,o),o}get(r){return this.cache.get(r)}clear(){this.cache.clear()}}const vt=`
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
`,yt=`
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
`,wt=`
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
`,ht=`
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
`,xt=`
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
`,St=`
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
`,Ut=`
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
`,Pt=`
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
`,Ct=`
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
`,Bt=`
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
`;function Mt(e,r,t,n,a){const o=new Float32Array(t*n);for(let s=0;s<t;s++)for(let i=0;i<n;i++){let u=0;for(let c=0;c<a;c++)u+=e[s*a+c]*r[c*n+i];o[s*n+i]=u}return o}function Et(e,r){const t=new Float32Array(e.length);for(let n=0;n<e.length;n++)t[n]=e[n]+r[n];return t}function At(e,r){const t=new Float32Array(e.length);for(let n=0;n<e.length;n++)t[n]=e[n]*r[n];return t}function Tt(e,r,t=1e-6){const n=e.length;let a=0;for(let i=0;i<n;i++)a+=e[i]*e[i];const o=Math.sqrt(a/n+t),s=new Float32Array(n);for(let i=0;i<n;i++)s[i]=e[i]/o*r[i];return s}function $t(e,r,t,n=1e-6){const a=e.length;let o=0;for(let c=0;c<a;c++)o+=e[c];o/=a;let s=0;for(let c=0;c<a;c++){const l=e[c]-o;s+=l*l}s/=a;const i=1/Math.sqrt(s+n),u=new Float32Array(a);for(let c=0;c<a;c++)u[c]=(e[c]-o)*i*r[c]+t[c];return u}function kt(e,r,t){const n=new Float32Array(e.length);for(let a=0;a<r;a++){const o=a*t;let s=-1e30;for(let u=0;u<t;u++)e[o+u]>s&&(s=e[o+u]);let i=0;for(let u=0;u<t;u++)n[o+u]=Math.exp(e[o+u]-s),i+=n[o+u];for(let u=0;u<t;u++)n[o+u]/=i}return n}function Gt(e,r,t,n=1e4){const a=new Float32Array(e.length);a.set(e);for(let o=0;o<r*t/2;o++){const s=Math.floor(o/(t/2)),i=o%(t/2),u=1/Math.pow(n,i/t),c=s*u,l=Math.cos(c),d=Math.sin(c),f=o*2,m=o*2+1,p=a[f],g=a[m];a[f]=p*l-g*d,a[m]=p*d+g*l}return a}function Ot(e,r,t,n,a,o,s,i,u){const c=a-i+1,l=o-u+1,d=new Float32Array(t*s*c*l);for(let f=0;f<t;f++)for(let m=0;m<s;m++)for(let p=0;p<c;p++)for(let g=0;g<l;g++){let b=0;for(let y=0;y<n;y++)for(let w=0;w<i;w++)for(let h=0;h<u;h++)b+=e[((f*n+y)*a+p+w)*o+g+h]*r[((m*n+y)*i+w)*u+h];d[((f*s+m)*c+p)*l+g]=b}return d}function Dt(e,r,t){const n=new Float32Array(r*t);for(let a=0;a<r;a++)for(let o=0;o<t;o++)n[o*r+a]=e[a*t+o];return n}function Nt(e,r,t,n,a,o){const s=new Float32Array(n*a*o);for(let i=0;i<a;i++)for(let u=0;u<n;u++){const c=u*r/n,l=i*t/a,d=Math.floor(c),f=Math.floor(l),m=Math.min(d+1,r-1),p=Math.min(f+1,t-1),g=c-d,b=l-f;for(let y=0;y<o;y++){const w=e[(f*r+d)*o+y],h=e[(f*r+m)*o+y],C=e[(p*r+d)*o+y],P=e[(p*r+m)*o+y];s[(i*n+u)*o+y]=w*(1-g)*(1-b)+h*g*(1-b)+C*(1-g)*b+P*g*b}}return s}const j=new bt;function Y(e){return $().device.createBindGroupLayout({entries:Array.from({length:e},(t,n)=>({binding:n,visibility:GPUShaderStage.COMPUTE,buffer:n===0?{type:"uniform"}:{type:"storage"}}))})}function Ge(e){const r=$(),t=r.device.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.device.queue.writeBuffer(t,0,e),t}function ne(e,r,t,n,a,o){const s=$(),i=Ge(a),u=[{binding:0,resource:{buffer:i}},...n.map((d,f)=>({binding:f+1,resource:{buffer:d.buffer.gpuBuffer}}))],c=s.device.createBindGroup({layout:t,entries:u}),l=e.beginComputePass();return l.setPipeline(r),l.setBindGroup(0,c),l.dispatchWorkgroups(o),l.end(),i}async function oe(e,r,t,n,a){const o=$(),s=x.zeros([t,n]),i=Y(4),u=j.getOrCreate("matmul",vt,i),c=new ArrayBuffer(12),l=new Uint32Array(c);l[0]=t,l[1]=n,l[2]=a;const d=o.device.createCommandEncoder();return ne(d,u,i,[e,r,s],c,Math.ceil(t/16)*Math.ceil(n/16)),o.device.queue.submit([d.finish()]),s}function se(e,r,t,n,a){return Mt(e,r,t,n,a)}async function Je(e,r){const t=$(),n=x.zeros([e.shape.size]),a=Y(4),o=j.getOrCreate("add",yt,a),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=t.device.createCommandEncoder();return ne(i,o,a,[e,r,n],s,Math.ceil(e.shape.size/256)),t.device.queue.submit([i.finish()]),n}function er(e,r){return Et(e,r)}async function rr(e,r){const t=$(),n=x.zeros([e.shape.size]),a=Y(4),o=j.getOrCreate("multiply",wt,a),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=t.device.createCommandEncoder();return ne(i,o,a,[e,r,n],s,Math.ceil(e.shape.size/256)),t.device.queue.submit([i.finish()]),n}function tr(e,r){return At(e,r)}async function ar(e,r,t=1e-6){const n=$(),a=e.shape.size,o=x.zeros([a]),s=Y(4),i=j.getOrCreate("rms_norm",ht,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=a,new Float32Array(u)[1]=t;const c=n.device.createCommandEncoder();return ne(c,i,s,[e,r,o],u,1),n.device.queue.submit([c.finish()]),o}function nr(e,r,t=1e-6){return Tt(e,r,t)}async function or(e,r,t,n=1e-6){const a=$(),o=e.shape.size,s=x.zeros([o]),i=a.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=j.getOrCreate("layer_norm",xt,i),c=new ArrayBuffer(8);new Uint32Array(c)[0]=o,new Float32Array(c)[1]=n;const l=$(),d=Ge(c),f=l.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:e.buffer.gpuBuffer}},{binding:2,resource:{buffer:r.buffer.gpuBuffer}},{binding:3,resource:{buffer:t.buffer.gpuBuffer}},{binding:4,resource:{buffer:s.buffer.gpuBuffer}}]}),m=l.device.createCommandEncoder(),p=m.beginComputePass();return p.setPipeline(u),p.setBindGroup(0,f),p.dispatchWorkgroups(1),p.end(),l.device.queue.submit([m.finish()]),s}function sr(e,r,t,n=1e-6){return $t(e,r,t,n)}async function ir(e,r,t){const n=$(),a=x.zeros([r,t]),o=n.device.createCommandEncoder();o.copyBufferToBuffer(e.buffer.gpuBuffer,0,a.buffer.gpuBuffer,0,r*t*4);const s=Y(2),i=j.getOrCreate("softmax",St,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=r,new Uint32Array(u)[1]=t;const c=Ge(u),l=n.device.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:a.buffer.gpuBuffer}}]}),d=o.beginComputePass();return d.setPipeline(i),d.setBindGroup(0,l),d.dispatchWorkgroups(Math.ceil(r)),d.end(),n.device.queue.submit([o.finish()]),a}function ur(e,r,t){return kt(e,r,t)}async function cr(e,r,t,n=1e4){const a=$(),o=x.zeros([r,t]),s=a.device.createCommandEncoder();s.copyBufferToBuffer(e.buffer.gpuBuffer,0,o.buffer.gpuBuffer,0,r*t*4);const i=Y(2),u=j.getOrCreate("rope",Ut,i),c=new ArrayBuffer(12);new Uint32Array(c)[0]=r,new Uint32Array(c)[1]=t,new Float32Array(c)[2]=n;const l=Ge(c),d=a.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:o.buffer.gpuBuffer}}]}),f=s.beginComputePass();return f.setPipeline(u),f.setBindGroup(0,d),f.dispatchWorkgroups(Math.ceil(r*t/2/256)),f.end(),a.device.queue.submit([s.finish()]),o}function lr(e,r,t,n=1e4){return Gt(e,r,t,n)}async function dr(e,r,t,n,a,o,s,i,u){const c=$(),l=a-i+1,d=o-u+1,f=x.zeros([t,s,l,d]),m=Y(4),p=j.getOrCreate("conv2d",Pt,m),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=t,b[1]=n,b[2]=a,b[3]=o,b[4]=s,b[5]=i,b[6]=u,b[7]=l,b[8]=d;const y=c.device.createCommandEncoder();return ne(y,p,m,[e,r,f],g,t*s),c.device.queue.submit([y.finish()]),f}function fr(e,r,t,n,a,o,s,i,u){return Ot(e,r,t,n,a,o,s,i,u)}async function pr(e,r,t){const n=$(),a=x.zeros([t,r]),o=Y(3),s=j.getOrCreate("transpose_2d",Ct,o),i=new ArrayBuffer(8);new Uint32Array(i)[0]=r,new Uint32Array(i)[1]=t;const u=n.device.createCommandEncoder();return ne(u,s,o,[e,a],i,Math.ceil(r/16)*Math.ceil(t/16)),n.device.queue.submit([u.finish()]),a}function mr(e,r,t){return Dt(e,r,t)}async function gr(e,r,t,n,a,o){const s=$(),i=x.zeros([a*n*o]),u=Y(3),c=j.getOrCreate("interpolate_bilinear",Bt,u),l=new ArrayBuffer(20),d=new Uint32Array(l);d[0]=r,d[1]=t,d[2]=n,d[3]=a,d[4]=o;const f=s.device.createCommandEncoder();return ne(f,c,u,[e,i],l,Math.ceil(n/16)*Math.ceil(a/16)),s.device.queue.submit([f.finish()]),i}function br(e,r,t,n,a,o){return Nt(e,r,t,n,a,o)}let ce=null,Be=null;function F(e,r=""){if(!ce)return;const t=document.createElement("div");t.className=`log-entry ${r}`,t.textContent=e,ce.appendChild(t),ce.scrollTop=ce.scrollHeight}function N(e,r,t=.001){if(e.length!==r.length)return!1;for(let n=0;n<e.length;n++){const a=Math.abs(e[n]-r[n]),o=Math.max(Math.abs(e[n]),Math.abs(r[n]),1e-8);if(a/o>t)return!1}return!0}async function _(e,r,t=20){for(let a=0;a<3;a++)r();const n=[];for(let a=0;a<t;a++){const o=performance.now();r(),n.push(performance.now()-o)}return n.reduce((a,o)=>a+o,0)/n.length}async function W(e,r,t=20){const n=[];for(let a=0;a<Math.min(5,t);a++)await r();for(let a=0;a<t;a++){const o=performance.now();await r(),n.push(performance.now()-o)}return n.reduce((a,o)=>a+o,0)/n.length}function _t(e){if(!Be)return;const r=document.createElement("tr");r.innerHTML=`
    <td style="font-weight:600">${e.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${e.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${e.speedup>=1?"var(--green)":"var(--red)"}">
      ${e.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${e.correct?"badge-pass":"badge-fail"}">${e.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${e.tolerance.toExponential(1)}</td>
  `,Be.appendChild(r)}async function Wt(){ce.innerHTML="",Be.innerHTML="",F("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),F("Initializing WebGPU...","");let e;try{e=await mt()}catch(n){F(`FATAL: ${n.message}`,"err"),F("WebGPU is not available. Cannot run GPU benchmarks.","err");return}F(`GPU: ${e.adapter.name??"Unknown"}`,"ok"),F(`Running benchmarks...
`,"");const r=[];{const s=x.randn([64,64]),i=x.randn([64,64]),u=await s.readback(),c=await i.readback(),l=await _("matmul 64",()=>se(u,c,64,64,64)),d=await W("matmul 64",async()=>{(await oe(s,i,64,64,64)).destroy()}),f=await(await oe(s,i,64,64,64)).readback(),m=se(u,c,64,64,64),p=N(m,f),g=Math.max(...Array.from(m).map((b,y)=>Math.abs(b-f[y])));r.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:l,gpuMs:d,speedup:l/d,correct:p,tolerance:g}),s.destroy(),i.destroy()}{const s=x.randn([256,256]),i=x.randn([256,256]),u=await s.readback(),c=await i.readback(),l=await _("matmul 256",()=>se(u,c,256,256,256),10),d=await W("matmul 256",async()=>{(await oe(s,i,256,256,256)).destroy()}),f=await(await oe(s,i,256,256,256)).readback(),m=se(u,c,256,256,256),p=N(m,f),g=Math.max(...Array.from(m).map((b,y)=>Math.abs(b-f[y])));r.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:l,gpuMs:d,speedup:l/d,correct:p,tolerance:g}),s.destroy(),i.destroy()}{const s=x.randn([512,512]),i=x.randn([512,512]),u=await s.readback(),c=await i.readback(),l=await _("matmul 512",()=>se(u,c,512,512,512),5),d=await W("matmul 512",async()=>{(await oe(s,i,512,512,512)).destroy()}),f=await(await oe(s,i,512,512,512)).readback(),m=se(u,c,512,512,512),p=N(m,f),g=Math.max(...Array.from(m).map((b,y)=>Math.abs(b-f[y])));r.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:l,gpuMs:d,speedup:l/d,correct:p,tolerance:g}),s.destroy(),i.destroy()}{const a=x.randn([1e6]),o=x.randn([1e6]),s=await a.readback(),i=await o.readback(),u=await _("add 1M",()=>er(s,i)),c=await W("add 1M",async()=>{(await Je(a,o)).destroy()}),l=await(await Je(a,o)).readback(),d=er(s,i),f=N(d,l),m=Math.max(...Array.from(d).map((p,g)=>Math.abs(p-l[g])));r.push({name:"Add",shape:"[1000000]",cpuMs:u,gpuMs:c,speedup:u/c,correct:f,tolerance:m}),a.destroy(),o.destroy()}{const a=x.randn([1e6]),o=x.randn([1e6]),s=await a.readback(),i=await o.readback(),u=await _("mul 1M",()=>tr(s,i)),c=await W("mul 1M",async()=>{(await rr(a,o)).destroy()}),l=await(await rr(a,o)).readback(),d=tr(s,i),f=N(d,l),m=Math.max(...Array.from(d).map((p,g)=>Math.abs(p-l[g])));r.push({name:"Multiply",shape:"[1000000]",cpuMs:u,gpuMs:c,speedup:u/c,correct:f,tolerance:m}),a.destroy(),o.destroy()}{const a=x.randn([1024]),o=x.ones([1024]),s=await a.readback(),i=await o.readback(),u=await _("rmsnorm",()=>nr(s,i)),c=await W("rmsnorm",async()=>{(await ar(a,o)).destroy()}),l=await(await ar(a,o)).readback(),d=nr(s,i),f=N(d,l),m=Math.max(...Array.from(d).map((p,g)=>Math.abs(p-l[g])));r.push({name:"RMSNorm",shape:"[1024]",cpuMs:u,gpuMs:c,speedup:u/c,correct:f,tolerance:m}),a.destroy(),o.destroy()}{const a=x.randn([1024]),o=x.ones([1024]),s=x.zeros([1024]),i=await a.readback(),u=await o.readback(),c=await s.readback(),l=await _("layernorm",()=>sr(i,u,c)),d=await W("layernorm",async()=>{(await or(a,o,s)).destroy()}),f=await(await or(a,o,s)).readback(),m=sr(i,u,c),p=N(m,f),g=Math.max(...Array.from(m).map((b,y)=>Math.abs(b-f[y])));r.push({name:"LayerNorm",shape:"[1024]",cpuMs:l,gpuMs:d,speedup:l/d,correct:p,tolerance:g}),a.destroy(),o.destroy(),s.destroy()}{const o=x.randn([32,128]),s=await o.readback(),i=await _("softmax",()=>ur(new Float32Array(s),32,128)),u=await W("softmax",async()=>{(await ir(x.fromFloat32(new Float32Array(s),[32,128]),32,128)).destroy()}),c=await(await ir(x.fromFloat32(new Float32Array(s),[32,128]),32,128)).readback(),l=ur(new Float32Array(s),32,128),d=N(l,c),f=Math.max(...Array.from(l).map((m,p)=>Math.abs(m-c[p])));r.push({name:"Softmax",shape:"[32, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:f}),o.destroy()}{const o=x.randn([16,128]),s=await o.readback(),i=await _("rope",()=>lr(new Float32Array(s),16,128)),u=await W("rope",async()=>{(await cr(x.fromFloat32(new Float32Array(s),[16,128]),16,128)).destroy()}),c=await(await cr(x.fromFloat32(new Float32Array(s),[16,128]),16,128)).readback(),l=lr(new Float32Array(s),16,128),d=N(l,c),f=Math.max(...Array.from(l).map((m,p)=>Math.abs(m-c[p])));r.push({name:"RoPE",shape:"[16, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:f}),o.destroy()}{const l=x.randn([1,3,16,16]),d=x.randn([4,3,3,3]),f=await l.readback(),m=await d.readback(),p=await _("conv2d",()=>fr(f,m,1,3,16,16,4,3,3)),g=await W("conv2d",async()=>{(await dr(l,d,1,3,16,16,4,3,3)).destroy()}),b=await(await dr(l,d,1,3,16,16,4,3,3)).readback(),y=fr(f,m,1,3,16,16,4,3,3),w=N(y,b),h=Math.max(...Array.from(y).map((C,P)=>Math.abs(C-b[P])));r.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:p,gpuMs:g,speedup:p/g,correct:w,tolerance:h}),l.destroy(),d.destroy()}{const o=x.randn([256,256]),s=await o.readback(),i=await _("transpose",()=>mr(s,256,256)),u=await W("transpose",async()=>{(await pr(o,256,256)).destroy()}),c=await(await pr(o,256,256)).readback(),l=mr(s,256,256),d=N(l,c),f=Math.max(...Array.from(l).map((m,p)=>Math.abs(m-c[p])));r.push({name:"Transpose",shape:"[256, 256]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:f}),o.destroy()}{const u=x.randn([3072]),c=await u.readback(),l=await _("interp",()=>br(c,32,32,64,64,3)),d=await W("interp",async()=>{(await gr(u,32,32,64,64,3)).destroy()}),f=await(await gr(u,32,32,64,64,3)).readback(),m=br(c,32,32,64,64,3),p=N(m,f),g=Math.max(...Array.from(m).map((b,y)=>Math.abs(b-f[y])));r.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:l,gpuMs:d,speedup:l/d,correct:p,tolerance:g}),u.destroy()}F("",""),F("═══ RESULTS ═══","info");for(const n of r){_t(n);const a=n.correct?"✓":"✗",o=n.correct?"ok":"err";F(`${a} ${n.name} (${n.shape}): CPU ${n.cpuMs.toFixed(2)} ms | GPU ${n.gpuMs.toFixed(2)} ms | ${n.speedup.toFixed(1)}× | max diff ${n.tolerance.toExponential(1)}`,o)}const t=r.filter(n=>n.correct).length;F("",""),F(`═══ ${t}/${r.length} CORRECT ═══`,t===r.length?"ok":"err"),gt()}function Lt(e){e.innerHTML=`
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
  `,ce=e.querySelector("#bench-log"),Be=e.querySelector("#bench-tbody"),e.querySelector("#btn-run-bench").addEventListener("click",()=>{Wt()})}const zt=Object.freeze(Object.defineProperty({__proto__:null,render:Lt},Symbol.toStringTag,{value:"Module"}));let X=null,xe="";function Ft(e){const r=e.environment,t=e.gpu,n=e.case==="D"?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)";let a=`
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
  `,a}function Rt(e){e.innerHTML=`
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;const r=e.querySelector("#wgdiag-result");X=e.querySelector("#btn-copy-report"),e.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{r.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',X.disabled=!0;const t=await ke();xe=xr(t),r.innerHTML=Ft(t),X.disabled=!1}),X.addEventListener("click",async()=>{if(xe)try{await navigator.clipboard.writeText(xe),X.textContent="Copied!",setTimeout(()=>{X.textContent="Copy Diagnostics"},2e3)}catch{const t=document.createElement("textarea");t.value=xe,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t),X.textContent="Copied!",setTimeout(()=>{X.textContent="Copy Diagnostics"},2e3)}}),e.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const qt=Object.freeze(Object.defineProperty({__proto__:null,render:Rt},Symbol.toStringTag,{value:"Module"}));let ye=null,te=null,Me=null,ze=null;async function He(){if(te&&!ye&&(te=null),te)return te;if(!navigator.gpu)throw new Error("WebGPU not supported");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const r=e.features.has("timestamp-query"),t=await e.requestDevice({requiredFeatures:r?["timestamp-query"]:[],requiredLimits:{}});Me=null,ze=null,t.lost.then(s=>{console.error("Benchmark device lost:",s.reason,s.message),Me=s.reason??"unknown",ze=s.message??"",ye=null,te=null}),ye=t;let n=null;try{n=navigator.gpu.getPreferredCanvasFormat()}catch{}const a=e.limits,o=[];for(const s of e.features)o.push(s);return te={webgpuAvailable:!0,adapterName:e.name??"Unknown",adapterVendor:e.vendor??"Unknown",adapterDevice:e.device??"Unknown",adapterFeatures:o,adapterLimits:{maxBufferSize:a.maxBufferSize,maxTextureDimension1D:a.maxTextureDimension1D,maxTextureDimension2D:a.maxTextureDimension2D,maxTextureDimension3D:a.maxTextureDimension3D,maxComputeWorkgroupStorageSize:a.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:a.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:a.maxStorageBufferBindingSize,maxUniformBufferBindingSize:a.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:a.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:a.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:a.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:a.maxComputeWorkgroupsPerDimension,maxColorAttachments:a.maxColorAttachments,minStorageBufferOffsetAlignment:a.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:a.minUniformBufferOffsetAlignment},preferredCanvasFormat:n,maxBufferSize:a.maxBufferSize,maxStorageBufferBindingSize:a.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:a.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:a.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:a.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:a.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:a.maxComputeWorkgroupsPerDimension,timestampQuerySupport:r,isFallbackAdapter:e.isFallbackAdapter??!1},te}function H(){if(!ye)throw new Error("Benchmark not initialized. Call initBenchmark() first.");return ye}function Ht(){return{reason:Me,message:ze}}function Ee(){return Me!==null}function pe(e){const r=H(),t=r.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(t,0,e),t}function K(e,r){const t=H(),n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(r){const a=t.createBuffer({size:Math.max(e,r.byteLength),usage:n,mappedAtCreation:!0});return new Float32Array(a.getMappedRange()).set(r),a.unmap(),a}return t.createBuffer({size:e,usage:n})}function me(e,r){const t=H(),n=t.createBindGroupLayout({entries:Array.from({length:r},(a,o)=>({binding:o,visibility:GPUShaderStage.COMPUTE,buffer:o===0?{type:"uniform"}:{type:"storage"}}))});return t.createComputePipeline({layout:t.createPipelineLayout({bindGroupLayouts:[n]}),compute:{module:t.createShaderModule({code:e}),entryPoint:"main"}})}const It=`
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
`,Br=`
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
`,jt=`
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
`,Vt=`
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
`,Kt=`
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
`,Yt=`
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
`;function Xt(e,r){try{return e.pushErrorScope(r),!0}catch{return!1}}async function vr(e,r){let t=null;for(let n=0;n<r;n++)try{const a=await e.popErrorScope();a&&!t&&(t=a)}catch{}return t}function Zt(e,r){let t;const n=new Promise((a,o)=>{t=window.setTimeout(()=>o(new Error(`GPU operation timed out after ${r}ms`)),r)});return Promise.race([e,n]).finally(()=>{t!==void 0&&window.clearTimeout(t)})}async function ge(e){const r=H(),t=["validation","out-of-memory","internal"];let n=0;for(const a of t)Xt(r,a)&&n++;try{const a=r.createBuffer({size:e.outputBytes,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),o=r.createCommandEncoder(),s=o.beginComputePass();s.setPipeline(e.pipeline),s.setBindGroup(0,e.bindGroup),s.dispatchWorkgroups(...e.workgroups),s.end(),o.copyBufferToBuffer(e.outputBuffer,0,a,0,e.outputBytes),r.queue.submit([o.finish()]),await Zt(a.mapAsync(GPUMapMode.READ),15e3);const i=new Float32Array(a.getMappedRange().slice(0));a.unmap(),a.destroy();const u=await vr(r,n);if(u)return{pass:!1,error:`GPU Error: ${u.message}`};const c=e.validator(i);return{pass:c.pass,error:c.pass?null:c.error}}catch(a){return await vr(r,n),{pass:!1,error:a.message}}}function Qt(e,r,t,n,a){const o=new Float32Array(t*n);for(let s=0;s<t;s++)for(let i=0;i<n;i++){let u=0;for(let c=0;c<a;c++)u+=e[s*a+c]*r[c*n+i];o[s*n+i]=u}return o}function Jt(e,r,t,n,a,o,s,i,u){const c=a-i+1,l=o-u+1,d=new Float32Array(t*s*c*l);for(let f=0;f<t;f++)for(let m=0;m<s;m++)for(let p=0;p<c;p++)for(let g=0;g<l;g++){let b=0;for(let y=0;y<n;y++)for(let w=0;w<i;w++)for(let h=0;h<u;h++)b+=e[((f*n+y)*a+p+w)*o+g+h]*r[((m*n+y)*i+w)*u+h];d[((f*s+m)*c+p)*l+g]=b}return d}function ea(e,r,t){const n=new Float32Array(e.length);for(let a=0;a<r;a++){const o=a*t;let s=-1e30;for(let u=0;u<t;u++)e[o+u]>s&&(s=e[o+u]);let i=0;for(let u=0;u<t;u++){const c=Math.exp(e[o+u]-s);n[o+u]=c,i+=c}for(let u=0;u<t;u++)n[o+u]/=i}return n}function ra(e,r,t,n,a,o,s){const i=new Float32Array(n*a*o);for(let u=0;u<n;u++)for(let c=0;c<a;c++){const l=[];let d=-1e30;for(let p=0;p<a;p++){let g=0;for(let y=0;y<o;y++)g+=e[(u*a+c)*o+y]*r[(u*a+p)*o+y];const b=g*s;l.push(b),b>d&&(d=b)}let f=0;const m=l.map(p=>{const g=Math.exp(p-d);return f+=g,g});for(let p=0;p<a;p++){const g=m[p]/f;for(let b=0;b<o;b++)i[(u*a+c)*o+b]+=g*t[(u*a+p)*o+b]}}return i}function ta(e,r,t){const n=e.length;let a=0;for(let i=0;i<n;i++)a+=e[i]*e[i];const o=Math.sqrt(a/n+t),s=new Float32Array(n);for(let i=0;i<n;i++)s[i]=e[i]/o*r[i];return s}function q(e){return K(e.byteLength,e)}async function aa(){try{const r=new Float32Array(64).fill(1),t=new Float32Array(64).fill(2),n=q(r),a=q(t),o=K(64*4),s=new ArrayBuffer(4);new Uint32Array(s)[0]=64;const i=pe(s),u=me(It,4),c=H().createBindGroup({layout:u.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:o}}]}),l=await ge({name:"VecAdd",pipeline:u,bindGroup:c,workgroups:[1,1,1],outputBuffer:o,outputBytes:64*4,validator:d=>{const f=d.every((m,p)=>Math.abs(m-3)<1e-5);return{pass:f,error:f?"":"Incorrect values"}}});return n.destroy(),a.destroy(),o.destroy(),i.destroy(),{name:"VecAdd",pass:l.pass,maxError:0,details:l.error||"N=64"}}catch(e){return{name:"VecAdd",pass:!1,maxError:1/0,details:e.message}}}async function na(){try{const r=new Float32Array(4096).fill(1),t=new Float32Array(64*64).fill(.5),n=q(r),a=q(t),o=K(64*64*4),s=new ArrayBuffer(12),i=new Uint32Array(s);i[0]=64,i[1]=64,i[2]=64;const u=pe(s),c=me(Br,4),l=H().createBindGroup({layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:o}}]}),d=await ge({name:"Matmul",pipeline:c,bindGroup:l,workgroups:[Math.ceil(64/16),Math.ceil(64/16),1],outputBuffer:o,outputBytes:64*64*4,validator:f=>{const m=Qt(r,t,64,64,64);let p=0;for(let b=0;b<64*64;b++)p=Math.max(p,Math.abs(f[b]-m[b]));const g=p<.001;return{pass:g,error:g?"":`Max error: ${p}`}}});return n.destroy(),a.destroy(),o.destroy(),u.destroy(),{name:"Matmul",pass:d.pass,maxError:0,details:d.error||"64×64"}}catch(e){return{name:"Matmul",pass:!1,maxError:1/0,details:e.message}}}async function oa(){try{const c=new Float32Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]),l=new Float32Array([1,0,-1,1,0,-1,1,0,-1]),d=q(c),f=q(l),m=K(1*1*3*3*4),p=new ArrayBuffer(36),g=new Uint32Array(p);g[0]=1,g[1]=1,g[2]=5,g[3]=5,g[4]=1,g[5]=3,g[6]=3,g[7]=3,g[8]=3;const b=pe(p),y=me(jt,4),w=H().createBindGroup({layout:y.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:m}}]}),h=await ge({name:"Conv2D",pipeline:y,bindGroup:w,workgroups:[1,1,3*3],outputBuffer:m,outputBytes:1*1*3*3*4,validator:C=>{const P=Jt(c,l,1,1,5,5,1,3,3);let A=0;for(let k=0;k<C.length;k++)A=Math.max(A,Math.abs(C[k]-P[k]));const T=A<1e-4;return{pass:T,error:T?"":`Max error: ${A}`}}});return d.destroy(),f.destroy(),m.destroy(),b.destroy(),{name:"Conv2D",pass:h.pass,maxError:0,details:h.error||"1×1×5×5"}}catch(e){return{name:"Conv2D",pass:!1,maxError:1/0,details:e.message}}}async function sa(){try{const t=new Float32Array([-2,-1,0,1,2,2,1,0,-1,-2]),n=K(t.byteLength,t),a=K(t.byteLength),o=new ArrayBuffer(8);new Uint32Array(o)[0]=2,new Uint32Array(o)[1]=5;const s=pe(o),i=me(Vt,3),u=H().createBindGroup({layout:i.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}}]}),c=await ge({name:"Softmax",pipeline:i,bindGroup:u,workgroups:[2,1,1],outputBuffer:a,outputBytes:t.byteLength,validator:l=>{const d=ea(t,2,5);let f=0;for(let p=0;p<t.length;p++)f=Math.max(f,Math.abs(l[p]-d[p]));const m=f<1e-4;return{pass:m,error:m?"":`Max error: ${f}`}}});return n.destroy(),a.destroy(),s.destroy(),{name:"Softmax",pass:c.pass,maxError:0,details:c.error||"Rows=2"}}catch(e){return{name:"Softmax",pass:!1,maxError:1/0,details:e.message}}}async function ia(){try{const t=new Float32Array([1,2,3,4,5,6,7,8]),n=new Float32Array(8).fill(1),a=q(t),o=q(n),s=K(8*4),i=new ArrayBuffer(8);new Uint32Array(i)[0]=8,new Float32Array(i)[1]=1e-6;const u=pe(i),c=me(Kt,4),l=H().createBindGroup({layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:s}}]}),d=await ge({name:"RMSNorm",pipeline:c,bindGroup:l,workgroups:[1,1,1],outputBuffer:s,outputBytes:8*4,validator:f=>{const m=ta(t,n,1e-6);let p=0;for(let b=0;b<8;b++)p=Math.max(p,Math.abs(f[b]-m[b]));const g=p<.001;return{pass:g,error:g?"":`Max error: ${p}`}}});return a.destroy(),o.destroy(),s.destroy(),u.destroy(),{name:"RMSNorm",pass:d.pass,maxError:0,details:d.error||"N=8"}}catch(e){return{name:"RMSNorm",pass:!1,maxError:1/0,details:e.message}}}async function ua(){try{const n=1/Math.sqrt(4),a=1*4*4,o=1*4*4,s=()=>{const A=new Float32Array(a);for(let T=0;T<a;T++)A[T]=(T%4+1)*.1;return A},i=s(),u=s(),c=s(),l=q(i),d=q(u),f=q(c),m=K(a*4),p=K(o*4),g=new ArrayBuffer(16),b=new Uint32Array(g),y=new Float32Array(g);b[0]=1,b[1]=4,b[2]=4,y[3]=n;const w=pe(g),h=me(Yt,6),C=H().createBindGroup({layout:h.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:d}},{binding:3,resource:{buffer:f}},{binding:4,resource:{buffer:m}},{binding:5,resource:{buffer:p}}]}),P=await ge({name:"Attention",pipeline:h,bindGroup:C,workgroups:[1,1,1],outputBuffer:m,outputBytes:a*4,validator:A=>{const T=ra(i,u,c,1,4,4,n);let k=0;for(let z=0;z<a;z++)k=Math.max(k,Math.abs(A[z]-T[z]));const O=k<.001;return{pass:O,error:O?"":`Max error: ${k}`}}});return l.destroy(),d.destroy(),f.destroy(),m.destroy(),p.destroy(),w.destroy(),{name:"Attention",pass:P.pass,maxError:0,details:P.error||"Finite check passed"}}catch(e){return{name:"Attention",pass:!1,maxError:1/0,details:e.message}}}const ca=["validation","out-of-memory","internal"];function Mr(e){try{if(typeof GPUOutOfMemoryError<"u"&&e instanceof GPUOutOfMemoryError)return"out-of-memory";if(typeof GPUInternalError<"u"&&e instanceof GPUInternalError)return"internal";if(typeof GPUValidationError<"u"&&e instanceof GPUValidationError)return"validation"}catch{}const r=e;return typeof r.name=="string"&&r.name?r.name:"validation"}async function Er(){if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const r=await e.requestDevice(),t=[],n={reason:null,message:null};return r.addEventListener("uncapturederror",a=>{const o=a.error;t.push({type:Mr(o),message:o.message})}),r.lost.then(a=>{n.reason=a.reason??"unknown",n.message=a.message??""}),{device:r,uncaptured:t,lost:n}}function Ar(e){let r=0;for(const t of ca)try{e.pushErrorScope(t),r++}catch{}return r}async function Ae(e,r){const t=[];for(let n=0;n<r;n++)try{const a=await e.popErrorScope();a&&t.push({type:Mr(a),message:a.message})}catch{}return t}async function Tr(e,r){try{return{ok:!0,value:await r()}}catch(t){return{ok:!1,stage:e,error:t instanceof Error?t.message:String(t)}}}const la=`
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
`,De=[6,8,10,12];async function da(){const e={name:"GPU Sanity",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"[6, 8, 10, 12]",actual:null,exception:null};let r=null,t=0,n=!1,a=null;const o=await Tr("request-device",()=>Er());if(!o.ok)return e.stage=o.stage,e.errorType="exception",e.errorMessage=o.error,e;r=o.value,e.stage="request-device";try{if(r.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${r.lost.reason}: ${r.lost.message??""}`,e;t=Ar(r.device);const u=new Float32Array([1,2,3,4]),c=new Float32Array([5,6,7,8]),l=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const d=r.device.createBuffer({size:16,usage:l,mappedAtCreation:!0});new Float32Array(d.getMappedRange()).set(u),d.unmap();const f=r.device.createBuffer({size:16,usage:l,mappedAtCreation:!0});new Float32Array(f.getMappedRange()).set(c),f.unmap();const m=r.device.createBuffer({size:16,usage:l}),p=r.device.createBuffer({size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});e.stage="create-pipeline";const g=r.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),b=r.device.createComputePipeline({layout:r.device.createPipelineLayout({bindGroupLayouts:[g]}),compute:{module:r.device.createShaderModule({code:la}),entryPoint:"main"}});e.stage="create-bind-group";const y=r.device.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:m}}]});e.stage="encode-submit";const w=r.device.createCommandEncoder(),h=w.beginComputePass();h.setPipeline(b),h.setBindGroup(0,y),h.dispatchWorkgroups(1,1,1),h.end(),w.copyBufferToBuffer(m,0,p,0,16),r.device.queue.submit([w.finish()]),e.stage="readback",await p.mapAsync(GPUMapMode.READ);const C=new Float32Array(p.getMappedRange().slice(0));p.unmap(),p.destroy(),e.stage="validate-output",e.scopeErrors=await Ae(r.device,t),n=!0,a=Array.from(C),e.actual=a.join(", "),d.destroy(),f.destroy(),m.destroy()}catch(u){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=u instanceof Error?u.message:String(u)}finally{if(r&&t>0&&!n)try{e.scopeErrors=await Ae(r.device,t)}catch{}}if(e.uncaptured=r.uncaptured,r.lost.reason&&!e.scopeErrors.length&&!e.errorMessage)return e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${r.lost.reason}: ${r.lost.message??""}`,e;if(e.scopeErrors.length>0)return e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e;if(e.uncaptured.length>0)return e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e;if(e.errorMessage)return e.pass=!1,e;const s=a??[],i=s.length===De.length&&De.every((u,c)=>Math.abs(s[c]-u)<1e-6);return e.pass=i,i||(e.errorType="output-mismatch",e.errorMessage=`expected [${De.join(", ")}], got ${e.actual}`),e}async function fa(){const e={name:"Standalone MatMul 64×64",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"all elements = 32.0",actual:null,exception:null};let r=null,t=0,n=!1,a=null;const o=await Tr("request-device",()=>Er());if(!o.ok)return e.stage=o.stage,e.errorType="exception",e.errorMessage=o.error,e;r=o.value,e.stage="request-device";try{if(r.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${r.lost.reason}: ${r.lost.message??""}`,e;t=Ar(r.device);const s=64,i=64,u=s*s,c=new Float32Array(u).fill(1),l=new Float32Array(u).fill(.5),d=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const f=r.device.createBuffer({size:c.byteLength,usage:d,mappedAtCreation:!0});new Float32Array(f.getMappedRange()).set(c),f.unmap();const m=r.device.createBuffer({size:l.byteLength,usage:d,mappedAtCreation:!0});new Float32Array(m.getMappedRange()).set(l),m.unmap();const p=r.device.createBuffer({size:u*4,usage:d}),g=r.device.createBuffer({size:u*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),b=new ArrayBuffer(16),y=new Uint32Array(b);y[0]=s,y[1]=s,y[2]=i;const w=r.device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.device.queue.writeBuffer(w,0,b),e.stage="create-pipeline";const h=r.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),C=r.device.createComputePipeline({layout:r.device.createPipelineLayout({bindGroupLayouts:[h]}),compute:{module:r.device.createShaderModule({code:Br}),entryPoint:"main"}});e.stage="create-bind-group";const P=r.device.createBindGroup({layout:h,entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:m}},{binding:3,resource:{buffer:p}}]});e.stage="encode-submit";const A=r.device.createCommandEncoder(),T=A.beginComputePass();T.setPipeline(C),T.setBindGroup(0,P),T.dispatchWorkgroups(4,4,1),T.end(),A.copyBufferToBuffer(p,0,g,0,u*4),r.device.queue.submit([A.finish()]),e.stage="readback",await g.mapAsync(GPUMapMode.READ);const k=new Float32Array(g.getMappedRange().slice(0));g.unmap(),g.destroy(),e.stage="validate-output",e.scopeErrors=await Ae(r.device,t),n=!0,a=0;for(let O=0;O<u;O++)a=Math.max(a,Math.abs(k[O]-32));e.actual=`max err = ${a.toExponential(2)}`,f.destroy(),m.destroy(),p.destroy(),w.destroy()}catch(s){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=s instanceof Error?s.message:String(s)}finally{if(r&&t>0&&!n)try{e.scopeErrors=await Ae(r.device,t)}catch{}}return e.uncaptured=r.uncaptured,r.lost.reason&&!e.scopeErrors.length&&!e.errorMessage?(e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${r.lost.reason}: ${r.lost.message??""}`,e):e.scopeErrors.length>0?(e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e):e.uncaptured.length>0?(e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e):e.errorMessage?(e.pass=!1,e):(e.pass=a!==null&&a<.001,e.pass||(e.errorType="output-mismatch",e.errorMessage=`expected all elements = 32.0, got ${e.actual}`),e)}function $r(...e){for(const r of e)if(r)return r}const Pe=$r("fd76bab16d6ed7c27aaee2220ec30a1337ecff58"),kr=$r("2026-09-07T05:24:21.804Z"),Fe=Pe??kr??`dev-${Date.now().toString(36)}`,pa=Pe&&/^[0-9a-f]{40}$/.test(Pe)?Pe:null,Gr=kr??"";let we=null,L=!1,Re=!1;const le={sanity:!1,standaloneMatmul:!1,harnessMatmul:!1};function Te(){return le.sanity&&le.standaloneMatmul&&le.harnessMatmul}function Ie(){const e=we?.querySelector("#btn-correctness");if(!e)return;const r=Te();e.disabled=!r,e.textContent=r?"CORRECTNESS":"CORRECTNESS (LOCKED)"}function M(e,r=""){if(!we)return;const t=we.querySelector("#bench-log");if(!t)return;const n=document.createElement("div");n.className=`log-entry ${r}`,n.textContent=e,t.appendChild(n),t.scrollTop=t.scrollHeight}function yr(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function $e(){const e=Ht();M(`WEBGPU DEVICE LOST — reason: ${e.reason??"unknown"} — message: ${e.message??""}`,"err"),M("Remaining tests stopped.","err")}function je(){if(!Re)try{const e=H();e.addEventListener("uncapturederror",r=>{const t=r.error;M(`UNCAPTURED GPU ERROR: ${t?.message??"unknown"}`,"err")}),e.lost.then(r=>{M(`WEBGPU DEVICE LOST — reason: ${r.reason} — message: ${r.message}`,"err")}),Re=!0}catch{}}function Ve(e,r){const t=we?.querySelector(`#${e}`);if(!t)return;const n=[r.stage?`<div>stage: <b style="color:var(--text)">${be(r.stage)}</b></div>`:"",r.pass?"":r.errorType?`<div>error type: <b style="color:var(--red)">${be(r.errorType)}</b></div>`:"",r.pass?"":r.errorMessage?`<div>error message: <b style="color:var(--red)">${be(r.errorMessage)}</b></div>`:"",...r.notes.map(a=>`<div style="color:var(--text-dim)">${be(a)}</div>`)].join("");t.innerHTML=`
    <div class="card" style="border-color:${r.pass?"var(--green)":"var(--red)"};margin-top:12px">
      <div class="card-header">
        <span class="card-title">${be(r.title)}</span>
        <span class="badge ${r.pass?"badge-pass":"badge-fail"}">${r.pass?"PASS":"FAIL"}</span>
      </div>
      <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${n||'<div style="color:var(--text-dim)">—</div>'}</div>
    </div>
  `}function be(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Or(e){const r=[];for(const t of e.scopeErrors)r.push(`GPU error scope [${t.type}]: ${t.message}`);for(const t of e.uncaptured)r.push(`uncaptured GPU error [${t.type}]: ${t.message}`);return e.lost.reason&&r.push(`device lost — reason: ${e.lost.reason} — message: ${e.lost.message??""}`),r.push(`expected: ${e.expected}`),e.actual!==null&&r.push(`actual: ${e.actual}`),e.exception&&r.push(`exception: ${e.exception}`),r}async function ma(){if(!L){L=!0;try{M("═══ GPU SANITY (standalone) ═══","info");const e=await da();le.sanity=e.pass,Ie(),Ve("res-sanity",{title:"GPU SANITY",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:Or(e)}),M(`GPU SANITY TEST: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&M(`  error type: ${e.errorType}`,"err"),e.errorMessage&&M(`  error message: ${e.errorMessage}`,"err")}catch(e){M(`ERROR: ${e.message}`,"err")}finally{L=!1}}}async function ga(){if(!L){L=!0;try{M("═══ STANDALONE MATMUL (64×64) ═══","info");const e=await fa();le.standaloneMatmul=e.pass,Ie(),Ve("res-standalone",{title:"STANDALONE MATMUL",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:Or(e)}),M(`STANDALONE MATMUL: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&M(`  error type: ${e.errorType}`,"err"),e.errorMessage&&M(`  error message: ${e.errorMessage}`,"err")}catch(e){M(`ERROR: ${e.message}`,"err")}finally{L=!1}}}async function ba(){if(!L){L=!0;try{await He(),je(),M("═══ HARNESS MATMUL (runGpuTest) ═══","info");const e=await na();le.harnessMatmul=e.pass,Ie(),Ve("res-harness",{title:"HARNESS MATMUL",pass:e.pass,stage:"runGpuTest",errorType:e.pass?null:"test-failure",errorMessage:e.pass?null:e.details,notes:[`details: ${e.details||"—"}`,`max error: ${e.maxError.toExponential(2)}`]}),M(`HARNESS MATMUL: ${e.pass?"PASS":"FAIL"} — ${e.details||""}`,e.pass?"ok":"err"),Ee()&&$e()}catch(e){M(`ERROR: ${e.message}`,"err"),Ee()&&$e()}finally{L=!1}}}async function va(){if(!L){if(!Te()){M("CORRECTNESS LOCKED — run GPU SANITY, STANDALONE MATMUL and HARNESS MATMUL first.","warn");return}L=!0;try{await He(),je(),M("═══ CORRECTNESS TESTS ═══","info");const e=[{name:"Vector Add",fn:aa},{name:"Conv2D",fn:oa},{name:"Softmax",fn:sa},{name:"RMSNorm",fn:ia},{name:"Attention",fn:ua}];let r=!0;for(const t of e){if(Ee()){$e();return}try{const n=await t.fn();M(`${n.pass?"✓":"✗"} ${n.name}: ${n.details||""} (max err: ${n.maxError.toExponential(2)})`,n.pass?"ok":"err"),n.pass||(r=!1)}catch(n){M(`✗ ${t.name}: FAILED WITH ERROR: ${n.message}`,"err"),r=!1}}M("",""),M(r?"ALL TESTS PASSED":"SOME TESTS FAILED",r?"ok":"err")}catch(e){M(`ERROR: ${e.message}`,"err"),Ee()&&$e()}finally{L=!1}}}function ya(e){const r=e.querySelector("#diag-panel");if(!r)return;const t=[["location.href",location.href],["location.hash",location.hash],["location.protocol",location.protocol],["window.isSecureContext",String(window.isSecureContext)],["navigator.userAgent",navigator.userAgent],["AETHER_BUILD_ID",Fe],["Built at",Gr||"n/a"],["Benchmark code revision",Fe]];r.innerHTML=t.map(([n,a])=>`<div style="font-size:11px;font-family:var(--mono);word-break:break-all">
        <span style="color:var(--text-dim)">${n}:</span> <b style="color:var(--text)">${a}</b>
      </div>`).join("")}function wa(e){we=e,Re=!1,e.innerHTML=`
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

    <div class="log" id="bench-log"></div>

    <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;font-family:var(--mono);color:var(--text-dim)">
      <div>AETHER BUILD: <b id="build-id" style="color:var(--text)">${Fe}</b></div>
      <div>Git commit: <b id="build-commit" style="color:var(--text)">${pa??"unavailable"}</b></div>
      <div>Build time: <b id="build-time" style="color:var(--text)">${Gr||"unavailable"}</b></div>
      <div>Environment: GitHub Pages</div>
    </div>
  `,ya(e),e.querySelector("#btn-sanity")?.addEventListener("click",ma),e.querySelector("#btn-standalone")?.addEventListener("click",ga),e.querySelector("#btn-harness")?.addEventListener("click",ba);const r=e.querySelector("#btn-correctness");r&&(r.addEventListener("click",va),r.disabled=!Te(),r.textContent=Te()?"CORRECTNESS":"CORRECTNESS (LOCKED)");const t=n=>{n.preventDefault()};window.addEventListener("error",t),window.addEventListener("unhandledrejection",t),He().then(n=>{je();const a=e.querySelector("#device-badge"),o=e.querySelector("#device-info");a&&(a.textContent="WEBGPU READY",a.className="badge badge-pass"),o&&(o.innerHTML=`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
          <span>Adapter:</span><span style="color:var(--text)">${n.adapterName}</span>
          <span>Vendor:</span><span style="color:var(--text)">${n.adapterVendor}</span>
          <span>Features:</span><span style="color:var(--text)">${n.adapterFeatures.length}</span>
          <span>Max Buffer:</span><span style="color:var(--text)">${yr(n.maxBufferSize)}</span>
          <span>Max Storage:</span><span style="color:var(--text)">${yr(n.maxStorageBufferBindingSize)}</span>
          <span>Workgroup X:</span><span style="color:var(--text)">${n.maxComputeWorkgroupSizeX}</span>
          <span>Invocations/wg:</span><span style="color:var(--text)">${n.maxComputeInvocationsPerWorkgroup}</span>
          <span>Timestamp Query:</span><span style="color:var(--text)">${n.timestampQuerySupport?"YES":"NO"}</span>
          <span>Preferred Format:</span><span style="color:var(--text)">${n.preferredCanvasFormat??"N/A"}</span>
          <span>Fallback:</span><span style="color:var(--text)">${n.isFallbackAdapter?"YES (software)":"NO (hardware)"}</span>
        </div>
      `)}).catch(n=>{const a=e.querySelector("#device-badge");a&&(a.textContent="WEBGPU UNAVAILABLE",a.className="badge badge-fail"),M(`WEBGPU not available: ${n.message}`,"err")})}const ha=Object.freeze(Object.defineProperty({__proto__:null,render:wa},Symbol.toStringTag,{value:"Module"}));function xa(e){const r=e.toLowerCase();return r.includes("aether")||r==="external-cache"||r.startsWith("workbox-")||r.includes("webgpu")}async function Dr(){if("serviceWorker"in navigator)try{const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(r=>r.unregister().catch(()=>{})))}catch{}}async function Nr(){if("caches"in window)try{const e=await caches.keys();await Promise.all(e.filter(xa).map(r=>caches.delete(r).catch(()=>{})))}catch{}}async function Sa(){try{const e=[],r=indexedDB;if(r.databases){const t=await r.databases();for(const n of t)n.name&&n.name.toLowerCase().includes("aether")&&e.push(n.name)}else e.push("aether-gpu-benchmark");for(const t of e)await new Promise(n=>{const a=indexedDB.deleteDatabase(t);a.onsuccess=()=>n(),a.onerror=()=>n(),a.onblocked=()=>n()})}catch{}}async function Ua(){await Dr(),await Nr()}async function Pa(){await Dr(),await Nr(),await Sa()}const Ke=[{id:"gpubench",label:"GPU Bench",module:ha},{id:"device",label:"Device Test",module:jr},{id:"webgpudiag",label:"WebGPU Diag",module:qt},{id:"model",label:"Model Test",module:tt},{id:"tensor",label:"Tensor Bench",module:zt},{id:"image",label:"Image Test",module:nt},{id:"video",label:"Video Test",module:ut},{id:"diag",label:"Diagnostics",module:ft}];let _r="gpubench";function wr(){const e=window.location.hash.replace("#","");return Ke.some(r=>r.id===e)?e:e==="diagnostics/webgpu"||e==="webgpu"?"webgpudiag":"gpubench"}function Ne(e){_r=e,window.location.hash=e;const r=document.getElementById("nav"),t=document.getElementById("screen");r.querySelectorAll("button").forEach(a=>{a.classList.toggle("active",a.dataset.screen===e)});const n=Ke.find(a=>a.id===e);n&&n.module.render(t)}function Ca(){const e=document.getElementById("app");e.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const r=document.getElementById("nav");document.getElementById("screen"),Ke.forEach(n=>{const a=document.createElement("button");a.textContent=n.label,a.dataset.screen=n.id,a.addEventListener("click",()=>Ne(n.id)),r.appendChild(a)});const t=wr();Ne(t),window.addEventListener("hashchange",()=>{const n=wr();n!==_r&&Ne(n)})}function Ba(){const e=document.getElementById("app");e.innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;text-align:center;gap:16px;padding:24px">
      <h2 style="color:var(--green, #22c55e);margin:0">AETHER CACHE RESET COMPLETE</h2>
      <p style="color:var(--text-dim, #9ca3af);margin:0">Please reload AETHER normally.</p>
      <button id="btn-reset-reload" class="btn">Reload AETHER</button>
    </div>
  `,e.querySelector("#btn-reset-reload")?.addEventListener("click",()=>{history.replaceState(null,"",window.location.pathname+window.location.search),window.location.reload()})}async function hr(){if(window.location.hash==="#reset"){await Pa(),Ba();return}await Ua(),Ca()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>void hr()):hr();
