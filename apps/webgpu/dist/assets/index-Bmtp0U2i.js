(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();function Yr(e){let t="Unknown",r="Unknown",a="Unknown",n="Unknown";const o=e.match(/OS (\d+)_(\d+)/);o&&(a="iOS",n=`${o[1]}.${o[2]}`);const s=e.match(/Mac OS X (\d+)[_.](\d+)/);if(s&&(a="macOS",n=`${s[1]}.${s[2]}`),e.includes("Windows")){a="Windows";const u=e.match(/Windows NT (\d+\.\d+)/);u&&(n=u[1])}if(e.includes("Android")){a="Android";const u=e.match(/Android (\d+[\.\d]*)/);u&&(n=u[1])}if(e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")){t="Safari";const u=e.match(/Version\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Chrome")&&!e.includes("Edg")){t="Chrome";const u=e.match(/Chrome\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Edg/")){t="Edge";const u=e.match(/Edg\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Firefox")){t="Firefox";const u=e.match(/Firefox\/(\d+[\.\d]*)/);u&&(r=u[1])}return{browserName:t,browserVersion:r,osName:a,osVersion:n}}function Qr(e){return!!(e.includes("FBAN")||e.includes("FBIOS")||e.includes("Twitter")||e.includes("Instagram")||e.includes("Line/")||e.includes("WeChat")||e.includes("MicroMessenger")||e.includes("CocoaPods")||e.includes("wv)")||e.includes("Electron")||e.includes("; wv)"))}function Xr(e){return e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")}async function pt(){const e=navigator.userAgent,t=Yr(e),r=t.osName==="iOS",a=Xr(e),n=Qr(e),o=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,s={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:e,platform:navigator.platform,isIOS:r,isSafari:a,isWebView:n,isStandalone:o,browserName:t.browserName,browserVersion:t.browserVersion,osName:t.osName,osVersion:t.osVersion},i={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(n)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:s,gpu:i};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:r?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:s,gpu:i};if(!navigator.gpu){let u="navigator.gpu is undefined. WebGPU API is not exposed.",l="";if(r){if(parseInt(t.osVersion.split(".")[0],10)<26)return u=`iOS ${t.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,l="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:l,environment:s,gpu:i};if(t.browserName!=="Safari")return u=`Running ${t.browserName} on iOS ${t.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,l="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:u,recommendation:l,environment:s,gpu:i}}return t.osName==="macOS"&&parseInt(t.osVersion.split(".")[0],10)<14?(u=`macOS ${t.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,l="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:l,environment:s,gpu:i}):(l="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:l,environment:s,gpu:i})}try{const u=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!u){i.adapterError="requestAdapter() returned null";let d="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",p="";return r?parseInt(t.osVersion.split(".")[0],10)>=26&&(d=`iOS ${t.osVersion} with Safari ${t.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,p="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(d="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",p="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):p="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:d,recommendation:p,environment:s,gpu:i}}i.adapterName=u.name??"Unknown GPU",i.adapterVendor=u.vendor??"Unknown",i.adapterDevice=u.device??"Unknown",i.isFallbackAdapter=u.isFallbackAdapter??!1;const l=[];for(const d of u.features)l.push(d.replace(/-/g," ").replace(/\b\w/g,p=>p.toUpperCase()));i.features=l;const c=u.limits;i.limits={maxBufferSize:c.maxBufferSize,maxTextureDimension1D:c.maxTextureDimension1D,maxTextureDimension2D:c.maxTextureDimension2D,maxTextureDimension3D:c.maxTextureDimension3D,maxComputeWorkgroupStorageSize:c.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:c.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:c.maxStorageBufferBindingSize,maxUniformBufferBindingSize:c.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:c.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:c.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:c.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:c.maxComputeWorkgroupsPerDimension,maxColorAttachments:c.maxColorAttachments,minStorageBufferOffsetAlignment:c.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:c.minUniformBufferOffsetAlignment};try{(await u.requestDevice({requiredLimits:{}})).destroy()}catch(d){return i.deviceError=d.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${i.adapterName}) but requestDevice() failed: ${d.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:s,gpu:i}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${i.adapterName}.`,recommendation:"No action needed.",environment:s,gpu:i}}catch(u){return i.adapterError=u.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${u.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:s,gpu:i}}}function yr(e){const t=[];if(t.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),t.push(""),t.push(`STATUS: ${e.statusLabel}`),t.push(`CASE: ${e.case}`),t.push(`REASON: ${e.reason}`),t.push(`RECOMMENDATION: ${e.recommendation}`),t.push(""),t.push("── ENVIRONMENT ──"),t.push(`  URL: ${e.environment.url}`),t.push(`  Protocol: ${e.environment.protocol}`),t.push(`  Hostname: ${e.environment.hostname}`),t.push(`  Secure Context: ${e.environment.isSecureContext}`),t.push(`  iOS: ${e.environment.isIOS}`),t.push(`  Safari: ${e.environment.isSafari}`),t.push(`  WebView: ${e.environment.isWebView}`),t.push(`  Standalone PWA: ${e.environment.isStandalone}`),t.push(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`),t.push(`  OS: ${e.environment.osName} ${e.environment.osVersion}`),t.push(`  Platform: ${e.environment.platform}`),t.push(`  User Agent: ${e.environment.userAgent}`),t.push(""),t.push("── WEBGPU ──"),t.push(`  navigator.gpu exists: ${e.gpu.navigatorGpuExists}`),e.gpu.adapterName&&t.push(`  Adapter: ${e.gpu.adapterName}`),e.gpu.adapterVendor&&t.push(`  Vendor: ${e.gpu.adapterVendor}`),e.gpu.adapterDevice&&t.push(`  Device: ${e.gpu.adapterDevice}`),e.gpu.adapterError&&t.push(`  Adapter Error: ${e.gpu.adapterError}`),e.gpu.deviceError&&t.push(`  Device Error: ${e.gpu.deviceError}`),t.push(`  Fallback adapter: ${e.gpu.isFallbackAdapter}`),e.gpu.features.length>0){t.push(`  Features (${e.gpu.features.length}):`);for(const r of e.gpu.features)t.push(`    ${r}`)}if(e.gpu.limits){t.push("  Limits:");for(const[r,a]of Object.entries(e.gpu.limits))t.push(`    ${r}: ${typeof a=="number"?a.toLocaleString():a}`)}return t.push(""),t.push(`Timestamp: ${new Date().toISOString()}`),t.join(`
`)}function Ze(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function ye(){const e=await pt();if(!e.ready||!e.gpu.adapterName)return null;const t=e.gpu.limits;return{available:!0,adapterName:e.gpu.adapterName,adapterVendor:e.gpu.adapterVendor,adapterDevice:e.gpu.adapterDevice,features:e.gpu.features,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:e.gpu.isFallbackAdapter,featuresMap:new Set(e.gpu.features),diagnostic:e}}async function he(e,t=[]){const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("Failed to re-acquire GPU adapter");const a=await r.requestDevice({requiredFeatures:t.filter(n=>e.featuresMap.has(n)),requiredLimits:{}});return a.lost.then(n=>{console.error("WebGPU device lost:",n.message)}),a}function Zr(e){const t=e.environment,r=e.gpu;let a="badge-fail";e.case==="D"?a="badge-pass":(e.case==="B"||e.case==="C")&&(a="badge-warn");let n=`
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
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${Ze(r.limits.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${r.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${r.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${r.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${Ze(r.limits.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${Ze(r.limits.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${Ze(r.limits.maxComputeWorkgroupStorageSize)}</span></div>
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
        ${r.features.map(o=>`<div class="row"><span class="row-value">${o}</span></div>`).join("")}
      </div>
    `),n}function Jr(e){e.innerHTML=`
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;const t=e.querySelector("#device-status"),r=e.querySelector("#device-info");pt().then(a=>{a.ready?t.innerHTML=`
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `:t.innerHTML="",r.innerHTML=Zr(a)})}const en=Object.freeze(Object.defineProperty({__proto__:null,render:Jr},Symbol.toStringTag,{value:"Module"}));let B=class hr{buffer;shape;dtype;size;device;constructor(t,r,a="f32"){this.device=t,this.shape=[...r],this.dtype=a,this.size=r.reduce((s,i)=>s*i,1);const n=a==="f32"?4:a==="f16"?2:4;this.buffer=t.createBuffer({size:this.size*n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(a==="f32"?new Float32Array(this.buffer.getMappedRange()):a==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(t,r,a){const n=new hr(t,a,r instanceof Float32Array?"f32":"i32");return t.queue.writeBuffer(n.buffer,0,r.buffer),n}async readback(){const t=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r=this.device.createCommandEncoder();r.copyBufferToBuffer(this.buffer,0,t,0,this.buffer.size),this.device.queue.submit([r.finish()]),await t.mapAsync(GPUMapMode.READ);const a=new Float32Array(t.getMappedRange().slice(0));return t.unmap(),t.destroy(),a}destroy(){this.buffer.destroy()}};async function Fe(e,t,r=50,a){const n=[];for(let l=0;l<Math.min(5,r);l++)await t();for(let l=0;l<r;l++){const c=performance.now();await t(),await wr?.queue.onSubmittedWorkDone();const d=performance.now();n.push(d-c)}n.sort((l,c)=>l-c);const o=n.reduce((l,c)=>l+c,0)/n.length,s=n[0],i=n[n.length-1],u={name:e,avgMs:o,minMs:s,maxMs:i,iterations:r};if(a){const c=a/(o/1e3)/1e9;u.gflops=c,u.throughput=`${c.toFixed(2)} GFLOPS`}return u}let wr=null;function we(e){wr=e}function Le(e){const t=[`${e.name}: ${e.avgMs.toFixed(2)} ms avg`,`(${e.minMs.toFixed(2)} – ${e.maxMs.toFixed(2)} ms)`,`[${e.iterations} iterations]`];return e.throughput&&t.push(e.throughput),t.join(" ")}const at=`
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
`,tn=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= uniforms.N) { return; }
  data[i] = max(data[i], 0.0);
}
`,rn=`
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
`,nn=`
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
`,an=`
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
`,on=`
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
`;let y=null,Me=null;function $(e,t=""){if(!Me)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Me.appendChild(r),Me.scrollTop=Me.scrollHeight}async function _t(){$("═══ TINY NEURAL NETWORK TEST ═══","info"),$("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),$("");const e=await ye();if(!e)return $("WebGPU not available","err"),!1;y=await he(e),we(y);const t=performance.now(),r=B.fromData(y,new Float32Array([1,.5,-.3,.8]),[4]),a=B.fromData(y,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),n=B.fromData(y,new Float32Array([.1,-.1,.2]),[3]),o=new ArrayBuffer(12),s=new Uint32Array(o);s[0]=1,s[1]=3,s[2]=4;const i=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:y.createShaderModule({code:at}),entryPoint:"main"}}),l=y.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(l,0,o);const c=new B(y,[1,3]),d=y.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:a.buffer}},{binding:3,resource:{buffer:c.buffer}}]});let p=y.createCommandEncoder(),f=p.beginComputePass();f.setPipeline(u),f.setBindGroup(0,d),f.dispatchWorkgroups(1,1,1),f.end(),y.queue.submit([p.finish()]),$(`  input[4]:  [${Array.from(await r.readback()).map(W=>W.toFixed(2)).join(", ")}]`,""),$("  W1[4×3]:   4 rows × 3 cols",""),$("  Matmul result: computing...","");const m=await c.readback();$(`  h1 = input @ W1: [${Array.from(m).map(W=>W.toFixed(3)).join(", ")}]`,"ok");for(let W=0;W<3;W++)m[W]+=[.1,-.1,.2][W];y.queue.writeBuffer(c.buffer,0,m.buffer),$(`  h1 + bias:       [${Array.from(m).map(W=>W.toFixed(3)).join(", ")}]`,"ok");const b=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),g=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[b]}),compute:{module:y.createShaderModule({code:tn}),entryPoint:"main"}}),v=new ArrayBuffer(4);new Uint32Array(v)[0]=3;const h=y.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(h,0,v);const w=y.createBindGroup({layout:b,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:c.buffer}}]});p=y.createCommandEncoder(),f=p.beginComputePass(),f.setPipeline(g),f.setBindGroup(0,w),f.dispatchWorkgroups(1,1,1),f.end(),y.queue.submit([p.finish()]);const C=await c.readback();$(`  ReLU(h1):         [${Array.from(C).map(W=>W.toFixed(3)).join(", ")}]`,"ok");const x=B.fromData(y,new Float32Array([.7,-.3,.5]),[3,1]),k=new B(y,[1,1]),N=new ArrayBuffer(12),q=new Uint32Array(N);q[0]=1,q[1]=1,q[2]=3;const _=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),ae=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[_]}),compute:{module:y.createShaderModule({code:at}),entryPoint:"main"}}),Qe=y.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(Qe,0,N);const Xe=y.createBindGroup({layout:_,entries:[{binding:0,resource:{buffer:Qe}},{binding:1,resource:{buffer:c.buffer}},{binding:2,resource:{buffer:x.buffer}},{binding:3,resource:{buffer:k.buffer}}]});p=y.createCommandEncoder(),f=p.beginComputePass(),f.setPipeline(ae),f.setBindGroup(0,Xe),f.dispatchWorkgroups(1,1,1),f.end(),y.queue.submit([p.finish()]);const Ae=await k.readback(),Ce=(performance.now()-t).toFixed(1);return $(`  Final output: ${Ae[0].toFixed(4)}`,"ok"),$(`  Total pipeline: ${Ce} ms`,"ok"),$("",""),$("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),r.destroy(),a.destroy(),n.destroy(),c.destroy(),x.destroy(),k.destroy(),l.destroy(),Qe.destroy(),h.destroy(),y.destroy(),!0}async function sn(){$("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const e=await ye();if(!e)return null;y=await he(e),we(y);const t=[64,128,256,512],r=[];for(const a of t){const n=B.fromData(y,new Float32Array(a*a).fill(1),[a,a]),o=B.fromData(y,new Float32Array(a*a).fill(.5),[a,a]),s=new B(y,[a,a]),i=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:y.createShaderModule({code:at}),entryPoint:"main"}}),l=new ArrayBuffer(12),c=new Uint32Array(l);c[0]=a,c[1]=a,c[2]=a;const d=await Fe(`${a}×${a} matmul`,async()=>{const p=y.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(p,0,l);const f=y.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:s.buffer}}]}),m=y.createCommandEncoder(),b=m.beginComputePass();b.setPipeline(u),b.setBindGroup(0,f);const g=Math.ceil(a/16);b.dispatchWorkgroups(g,g,1),b.end(),y.queue.submit([m.finish()]),p.destroy()},30,2*a*a*a);r.push(d),$(Le(d),"ok"),n.destroy(),o.destroy(),s.destroy()}return y.destroy(),r[r.length-1]}async function un(){$("═══ CONVOLUTION BENCHMARK ═══","info");const e=await ye();if(!e)return null;y=await he(e),we(y);const t=1,r=3,a=32,n=32,o=8,s=3,i=3,u=a-s+1,l=n-i+1,c=B.fromData(y,new Float32Array(t*r*a*n).fill(.5),[t,r,a,n]),d=B.fromData(y,new Float32Array(o*r*s*i).fill(.1),[o,r,s,i]),p=new B(y,[t,o,u,l]),f=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),m=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[f]}),compute:{module:y.createShaderModule({code:rn}),entryPoint:"main"}}),b=new ArrayBuffer(36),g=new Uint32Array(b);g[0]=t,g[1]=r,g[2]=a,g[3]=n,g[4]=o,g[5]=s,g[6]=i,g[7]=u,g[8]=l;const v=await Fe(`Conv2D ${t}×${r}×${a}×${n} k=${s}→${o}×${u}×${l}`,async()=>{const h=y.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(h,0,b);const w=y.createBindGroup({layout:f,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:c.buffer}},{binding:2,resource:{buffer:d.buffer}},{binding:3,resource:{buffer:p.buffer}}]}),C=y.createCommandEncoder(),x=C.beginComputePass();x.setPipeline(m),x.setBindGroup(0,w),x.dispatchWorkgroups(t,o,1),x.end(),y.queue.submit([C.finish()]),h.destroy()},20,2*t*o*r*s*i*u*l);return $(Le(v),"ok"),c.destroy(),d.destroy(),p.destroy(),y.destroy(),v}async function cn(){$("═══ ATTENTION BENCHMARK ═══","info");const e=await ye();if(!e)return null;y=await he(e),we(y);const t=1,r=64,a=64,n=1/Math.sqrt(a),o=B.fromData(y,new Float32Array(t*r*a).fill(.1),[t,r,a]),s=B.fromData(y,new Float32Array(t*r*a).fill(.1),[t,r,a]),i=B.fromData(y,new Float32Array(t*r*a).fill(.1),[t,r,a]),u=new B(y,[t,r,a]),l=new B(y,[t,r,r]),c=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),d=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[c]}),compute:{module:y.createShaderModule({code:nn}),entryPoint:"main"}}),p=new ArrayBuffer(16),f=new Uint32Array(p),m=new Float32Array(p);f[0]=t,f[1]=r,f[2]=a,m[3]=n;const b=await Fe(`Attention b=${t} s=${r} d=${a}`,async()=>{const g=y.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(g,0,p);const v=y.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}},{binding:4,resource:{buffer:u.buffer}},{binding:5,resource:{buffer:l.buffer}}]}),h=y.createCommandEncoder(),w=h.beginComputePass();w.setPipeline(d),w.setBindGroup(0,v),w.dispatchWorkgroups(t,1,1),w.end(),y.queue.submit([h.finish()]),g.destroy()},20);return $(Le(b),"ok"),o.destroy(),s.destroy(),i.destroy(),u.destroy(),l.destroy(),y.destroy(),b}function ln(e){e.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,Me=e.querySelector("#model-log"),e.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{Me.innerHTML="",await _t()}),e.querySelector("#btn-all-bench").addEventListener("click",async()=>{Me.innerHTML="",await _t(),$("",""),await sn(),$("",""),await un(),$("",""),await cn(),$("",""),$("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const dn=Object.freeze(Object.defineProperty({__proto__:null,render:ln},Symbol.toStringTag,{value:"Module"}));let U=null,me=null;function Z(e,t=""){if(!me)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,me.appendChild(r),me.scrollTop=me.scrollHeight}function xr(e,t){const r=new Float32Array(e*t*4);for(let a=0;a<t;a++)for(let n=0;n<e;n++){const o=(a*e+n)*4,s=(n>>4)+(a>>4)&1;r[o+0]=s?.9:n/e*.8,r[o+1]=s?.3:a/t*.6,r[o+2]=s?.6:.4,r[o+3]=1}return r}function St(e,t,r){const a=document.createElement("canvas");a.width=t,a.height=r;const n=a.getContext("2d"),o=n.createImageData(t,r);for(let s=0;s<t*r*4;s++)o.data[s]=Math.round(e[s]*255);return n.putImageData(o,0,0),a}async function Rt(){Z("═══ GRAYSCALE TEST ═══","info");const e=await ye();if(!e){Z("WebGPU unavailable","err");return}U=await he(e),we(U);const t=256,r=256,a=xr(t,r),n=B.fromData(U,a,[t*r*4]),o=new B(U,[t*r*4]),s=U.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=U.createComputePipeline({layout:U.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:U.createShaderModule({code:on}),entryPoint:"main"}}),u=new ArrayBuffer(4);new Uint32Array(u)[0]=t*r;const l=await Fe("Grayscale 256×256",async()=>{const m=U.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});U.queue.writeBuffer(m,0,u);const b=U.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:o.buffer}}]}),g=U.createCommandEncoder(),v=g.beginComputePass();v.setPipeline(i),v.setBindGroup(0,b),v.dispatchWorkgroups(Math.ceil(t*r/256),1,1),v.end(),U.queue.submit([g.finish()]),m.destroy()},50);Z(Le(l),"ok");const c=await o.readback(),d=St(a,t,r),p=St(c,t,r),f=$t?.querySelector("#image-display");if(f){f.innerHTML="";const m=document.createElement("div");m.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const b=document.createElement("div");b.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',b.appendChild(d);const g=document.createElement("div");g.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',g.appendChild(p),m.appendChild(b),m.appendChild(g),f.appendChild(m)}n.destroy(),o.destroy(),U.destroy(),Z("✓ Grayscale complete","ok")}async function Ft(){Z("═══ CONVOLUTION KERNEL TEST ═══","info");const e=await ye();if(!e){Z("WebGPU unavailable","err");return}U=await he(e),we(U);const t=128,r=128,a=3,n=xr(t,r),o={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},s=U.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=U.createComputePipeline({layout:U.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:U.createShaderModule({code:an}),entryPoint:"main"}}),u=new ArrayBuffer(16),l=new Uint32Array(u);l[0]=t,l[1]=r,l[2]=a,l[3]=0;for(const[c,d]of Object.entries(o)){const p=B.fromData(U,n,[t*r*4]),f=B.fromData(U,d,[a*a]),m=new B(U,[t*r*4]),b=await Fe(`Conv ${c} ${t}×${r}`,async()=>{const h=U.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});U.queue.writeBuffer(h,0,u);const w=U.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:f.buffer}},{binding:2,resource:{buffer:p.buffer}},{binding:3,resource:{buffer:m.buffer}}]}),C=U.createCommandEncoder(),x=C.beginComputePass();x.setPipeline(i),x.setBindGroup(0,w),x.dispatchWorkgroups(Math.ceil(t/16),Math.ceil(r/16),1),x.end(),U.queue.submit([C.finish()]),h.destroy()},30);Z(Le(b),"ok");const g=await m.readback(),v=$t?.querySelector("#image-display");if(v){const h=St(g,t,r),w=document.createElement("div");w.style.cssText="display:inline-block;margin:4px",w.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${c}</div>`,w.appendChild(h),v.appendChild(w)}p.destroy(),f.destroy(),m.destroy()}U.destroy(),Z("✓ All convolution kernels applied","ok")}let $t=null;function fn(e){$t=e,e.innerHTML=`
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
  `,me=e.querySelector("#image-log"),e.querySelector("#btn-grayscale").addEventListener("click",async()=>{me.innerHTML="",e.querySelector("#image-display").innerHTML="",await Rt()}),e.querySelector("#btn-conv").addEventListener("click",async()=>{me.innerHTML="",e.querySelector("#image-display").innerHTML="",await Ft()}),e.querySelector("#btn-all-img").addEventListener("click",async()=>{me.innerHTML="",e.querySelector("#image-display").innerHTML="",await Rt(),Z("",""),await Ft(),Z("",""),Z("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const pn=Object.freeze(Object.defineProperty({__proto__:null,render:fn},Symbol.toStringTag,{value:"Module"}));let R=null,He=null,tt=null;function Mt(e,t=""){if(!He)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,He.appendChild(r),He.scrollTop=He.scrollHeight}const mn=`
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
`;let Et=0,rt=0;async function gn(e,t,r,a,n){const o=await ye();if(!o){Mt("WebGPU unavailable","err");return}R=await he(o),we(R);const[s,i]=a.value.split("x").map(Number);e.width=s,e.height=i,Et=parseInt(n.value);const u=R.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),l=R.createComputePipeline({layout:R.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:R.createShaderModule({code:mn}),entryPoint:"main"}}),c=R.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),d=e.getContext("2d"),p=R.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let f=performance.now(),m=0,b=0;t.textContent="RENDERING",t.className="badge badge-pass";function g(){const v=new ArrayBuffer(16),h=new Uint32Array(v);h[0]=s,h[1]=i,h[2]=rt,h[3]=Et,R.queue.writeBuffer(p,0,v);const w=R.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:c}}]}),C=R.createCommandEncoder(),x=C.beginComputePass();x.setPipeline(l),x.setBindGroup(0,w),x.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(i/16),1),x.end();const k=R.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});C.copyBufferToBuffer(c,0,k,0,s*i*4*4),R.queue.submit([C.finish()]),k.mapAsync(GPUMapMode.READ).then(()=>{const N=new Float32Array(k.getMappedRange().slice(0));k.unmap(),k.destroy();const q=d.createImageData(s,i);for(let ae=0;ae<s*i*4;ae++)q.data[ae]=Math.round(N[ae]*255);d.putImageData(q,0,0),rt++,b++;const _=performance.now();_-f>=1e3&&(m=Math.round(b*1e3/(_-f)),r.textContent=`${m} FPS | Frame ${rt} | ${s}×${i}`,b=0,f=_),tt=requestAnimationFrame(g)})}g()}function Lt(){tt!==null&&(cancelAnimationFrame(tt),tt=null),R&&(R.destroy(),R=null)}function bn(e){e.innerHTML=`
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
  `,He=e.querySelector("#video-log");const t=e.querySelector("#video-canvas"),r=e.querySelector("#video-status"),a=e.querySelector("#video-fps"),n=e.querySelector("#res-select"),o=e.querySelector("#mode-select");e.querySelector("#btn-start").addEventListener("click",()=>{Lt(),rt=0,Et=parseInt(o.value),Mt(`Starting GPU compute video: ${n.value} mode=${o.value}`,"info"),gn(t,r,a,n,o)}),e.querySelector("#btn-stop").addEventListener("click",()=>{Lt(),r.textContent="STOPPED",r.className="badge badge-info",Mt("Rendering stopped","warn")})}const vn=Object.freeze(Object.defineProperty({__proto__:null,render:bn},Symbol.toStringTag,{value:"Module"}));let Te=null;function P(e,t=""){if(!Te)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Te.appendChild(r),Te.scrollTop=Te.scrollHeight}async function yn(){if(Te.innerHTML="",P("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),P(`Timestamp: ${new Date().toISOString()}`,""),!await hn())return;const t=await ye();if(!t){P("Cannot proceed: GPU not ready","err");return}P("",""),P("── MEMORY TEST ──","info");const r=await he(t);we(r);const a=Math.floor(t.limits.maxBufferSize/1048576);P(`Attempting to allocate buffer at reported max: ${a} MB`,"");try{const n=r.createBuffer({size:t.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});P("Buffer allocation at max: SUCCESS","ok"),n.destroy()}catch(n){P(`Buffer allocation at max: FAILED — ${n.message}`,"warn");for(const o of[256,128,64,32])try{const s=r.createBuffer({size:o*1048576,usage:GPUBufferUsage.STORAGE});P(`Largest successful allocation: ${o} MB`,"ok"),s.destroy();break}catch{continue}}P("",""),P("── COMPUTE THROUGHPUT ──","info");for(const n of[64,128,256]){const o=B.fromData(r,new Float32Array(n*n).fill(1),[n,n]),s=B.fromData(r,new Float32Array(n*n).fill(1),[n,n]),i=new B(r,[n,n]),u=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),l=r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:r.createShaderModule({code:at}),entryPoint:"main"}}),c=await Fe(`matmul ${n}×${n}`,async()=>{const d=r.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=new ArrayBuffer(12);new Uint32Array(p).set([n,n,n]),r.queue.writeBuffer(d,0,p);const f=r.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),m=r.createCommandEncoder(),b=m.beginComputePass();b.setPipeline(l),b.setBindGroup(0,f);const g=Math.ceil(n/16);b.dispatchWorkgroups(g,g,1),b.end(),r.queue.submit([m.finish()]),d.destroy()},30,2*n*n*n);P(Le(c),"ok"),o.destroy(),s.destroy(),i.destroy()}r.destroy(),P("",""),P("═══ DIAGNOSTICS COMPLETE ═══","info")}async function hn(){const e=await pt();return yr(e),P("── WEBGPU STATUS ──","info"),P(`${e.statusLabel} (Case ${e.case})`,e.ready?"ok":"err"),P(`Reason: ${e.reason}`,""),P(`Recommendation: ${e.recommendation}`,""),P("",""),P("── ENVIRONMENT ──","info"),P(`  URL: ${e.environment.url}`,""),P(`  Secure Context: ${e.environment.isSecureContext}`,e.environment.isSecureContext?"ok":"err"),P(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`,""),P(`  OS: ${e.environment.osName} ${e.environment.osVersion}`,""),P(`  iOS: ${e.environment.isIOS}`,""),P(`  Safari: ${e.environment.isSafari}`,""),P(`  WebView: ${e.environment.isWebView}`,e.environment.isWebView?"err":""),P(`  navigator.gpu: ${e.gpu.navigatorGpuExists}`,e.gpu.navigatorGpuExists?"ok":"err"),e.gpu.adapterName&&(P(`  Adapter: ${e.gpu.adapterName}`,"ok"),P(`  Vendor: ${e.gpu.adapterVendor}`,"")),e.gpu.adapterError&&P(`  Adapter Error: ${e.gpu.adapterError}`,"err"),e.gpu.deviceError&&P(`  Device Error: ${e.gpu.deviceError}`,"err"),e.ready?!0:(P("",""),P("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function wn(e){e.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,Te=e.querySelector("#diag-log"),e.querySelector("#btn-diag").addEventListener("click",()=>{yn()})}const xn=Object.freeze(Object.defineProperty({__proto__:null,render:wn},Symbol.toStringTag,{value:"Module"}));class pe{dims;ndim;size;strides;constructor(t){this.dims=typeof t=="number"?[t]:[...t],this.ndim=this.dims.length,this.size=this.dims.reduce((n,o)=>n*o,1);const r=new Array(this.ndim);let a=1;for(let n=this.ndim-1;n>=0;n--)r[n]=a,a*=this.dims[n];this.strides=r}equals(t){if(this.ndim!==t.ndim)return!1;for(let r=0;r<this.ndim;r++)if(this.dims[r]!==t.dims[r])return!1;return!0}isContiguous(){let t=1;for(let r=this.ndim-1;r>=0;r--){if(this.strides[r]!==t)return!1;t*=this.dims[r]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new pe([1])}static from(...t){return new pe(t)}}var oe=(e=>(e.Float32="f32",e.Float16="f16",e.Int32="i32",e.Int8="i8",e.Uint8="u8",e))(oe||{});const Sn={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function Sr(e){return Sn[e].bytes}let te=null;async function Mn(){if(te)return te;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.limits,r=new Set(e.features),a=await e.requestDevice({requiredLimits:{}});return a.lost.then(n=>{console.error("WebGPU device lost:",n.message),te=null}),te={adapter:e,device:a,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:t.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:t.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:t.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:t.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:t.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:t.maxTextureArrayLayers},features:r},te}function D(){if(!te)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return te}function En(){te&&(te.device.destroy(),te=null)}class ke{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(t,r,a){this.shape=t,this.dtype=r,this.byteSize=t.size*Sr(r),this.gpuBuffer=a??D().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(t,r,a=oe.Float32){const n=D(),o=new ke(t,a);return n.device.queue.writeBuffer(o.gpuBuffer,0,r.buffer,r.byteOffset,r.byteLength),o}async readback(){const t=D(),r=t.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),a=t.device.createCommandEncoder();a.copyBufferToBuffer(this.gpuBuffer,0,r,0,this.byteSize),t.device.queue.submit([a.finish()]),await r.mapAsync(GPUMapMode.READ);const n=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),n}destroy(){this.gpuBuffer.destroy()}}class M{shape;dtype;buffer;constructor(t,r=oe.Float32,a){this.shape=t,this.dtype=r,this.buffer=a??new ke(t,r)}static fromFloat32(t,r){const a=t instanceof Float32Array?t:new Float32Array(t),n=new pe(r);return new M(n,oe.Float32,ke.fromData(n,a,oe.Float32))}static fromInt32(t,r){const a=t instanceof Int32Array?t:new Int32Array(t),n=new pe(r);return new M(n,oe.Int32,ke.fromData(n,a,oe.Int32))}static zeros(t,r=oe.Float32){const a=new pe(t),n=a.size*Sr(r),s=D().device.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(s.getMappedRange()).fill(0),s.unmap();const i=new ke(a,r,s);return new M(a,r,i)}static ones(t,r=oe.Float32){const a=new pe(t).size,n=new Float32Array(a).fill(1);return M.fromFloat32(n,t)}static randn(t){const r=new pe(t).size,a=new Float32Array(r);for(let n=0;n<r;n++){const o=Math.random(),s=Math.random();a[n]=Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*s)}return M.fromFloat32(a,t)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class Pn{cache=new Map;getOrCreate(t,r,a){if(this.cache.has(t))return this.cache.get(t);const n=D(),o=n.device.createComputePipeline({layout:n.device.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:n.device.createShaderModule({code:r}),entryPoint:"main"}});return this.cache.set(t,o),o}get(t){return this.cache.get(t)}clear(){this.cache.clear()}}const An=`
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
`,Cn=`
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
`,Un=`
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
`,$n=`
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
`,Bn=`
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
`,Tn=`
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
`,kn=`
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
`,On=`
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
`,Dn=`
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
`,Gn=`
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
`;function Nn(e,t,r,a,n){const o=new Float32Array(r*a);for(let s=0;s<r;s++)for(let i=0;i<a;i++){let u=0;for(let l=0;l<n;l++)u+=e[s*n+l]*t[l*a+i];o[s*a+i]=u}return o}function _n(e,t){const r=new Float32Array(e.length);for(let a=0;a<e.length;a++)r[a]=e[a]+t[a];return r}function Rn(e,t){const r=new Float32Array(e.length);for(let a=0;a<e.length;a++)r[a]=e[a]*t[a];return r}function Fn(e,t,r=1e-6){const a=e.length;let n=0;for(let i=0;i<a;i++)n+=e[i]*e[i];const o=Math.sqrt(n/a+r),s=new Float32Array(a);for(let i=0;i<a;i++)s[i]=e[i]/o*t[i];return s}function Ln(e,t,r,a=1e-6){const n=e.length;let o=0;for(let l=0;l<n;l++)o+=e[l];o/=n;let s=0;for(let l=0;l<n;l++){const c=e[l]-o;s+=c*c}s/=n;const i=1/Math.sqrt(s+a),u=new Float32Array(n);for(let l=0;l<n;l++)u[l]=(e[l]-o)*i*t[l]+r[l];return u}function zn(e,t,r){const a=new Float32Array(e.length);for(let n=0;n<t;n++){const o=n*r;let s=-1e30;for(let u=0;u<r;u++)e[o+u]>s&&(s=e[o+u]);let i=0;for(let u=0;u<r;u++)a[o+u]=Math.exp(e[o+u]-s),i+=a[o+u];for(let u=0;u<r;u++)a[o+u]/=i}return a}function Wn(e,t,r,a=1e4){const n=new Float32Array(e.length);n.set(e);for(let o=0;o<t*r/2;o++){const s=Math.floor(o/(r/2)),i=o%(r/2),u=1/Math.pow(a,i/r),l=s*u,c=Math.cos(l),d=Math.sin(l),p=o*2,f=o*2+1,m=n[p],b=n[f];n[p]=m*c-b*d,n[f]=m*d+b*c}return n}function In(e,t,r,a,n,o,s,i,u){const l=n-i+1,c=o-u+1,d=new Float32Array(r*s*l*c);for(let p=0;p<r;p++)for(let f=0;f<s;f++)for(let m=0;m<l;m++)for(let b=0;b<c;b++){let g=0;for(let v=0;v<a;v++)for(let h=0;h<i;h++)for(let w=0;w<u;w++)g+=e[((p*a+v)*n+m+h)*o+b+w]*t[((f*a+v)*i+h)*u+w];d[((p*s+f)*l+m)*c+b]=g}return d}function qn(e,t,r){const a=new Float32Array(t*r);for(let n=0;n<t;n++)for(let o=0;o<r;o++)a[o*t+n]=e[n*r+o];return a}function Hn(e,t,r,a,n,o){const s=new Float32Array(a*n*o);for(let i=0;i<n;i++)for(let u=0;u<a;u++){const l=u*t/a,c=i*r/n,d=Math.floor(l),p=Math.floor(c),f=Math.min(d+1,t-1),m=Math.min(p+1,r-1),b=l-d,g=c-p;for(let v=0;v<o;v++){const h=e[(p*t+d)*o+v],w=e[(p*t+f)*o+v],C=e[(m*t+d)*o+v],x=e[(m*t+f)*o+v];s[(i*a+u)*o+v]=h*(1-b)*(1-g)+w*b*(1-g)+C*(1-b)*g+x*b*g}}return s}const ne=new Pn;function ue(e){return D().device.createBindGroupLayout({entries:Array.from({length:e},(r,a)=>({binding:a,visibility:GPUShaderStage.COMPUTE,buffer:a===0?{type:"uniform"}:{type:"storage"}}))})}function mt(e){const t=D(),r=t.device.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.device.queue.writeBuffer(r,0,e),r}function Pe(e,t,r,a,n,o){const s=D(),i=mt(n),u=[{binding:0,resource:{buffer:i}},...a.map((d,p)=>({binding:p+1,resource:{buffer:d.buffer.gpuBuffer}}))],l=s.device.createBindGroup({layout:r,entries:u}),c=e.beginComputePass();return c.setPipeline(t),c.setBindGroup(0,l),c.dispatchWorkgroups(o),c.end(),i}async function Ue(e,t,r,a,n){const o=D(),s=M.zeros([r,a]),i=ue(4),u=ne.getOrCreate("matmul",An,i),l=new ArrayBuffer(12),c=new Uint32Array(l);c[0]=r,c[1]=a,c[2]=n;const d=o.device.createCommandEncoder();return Pe(d,u,i,[e,t,s],l,Math.ceil(r/16)*Math.ceil(a/16)),o.device.queue.submit([d.finish()]),s}function $e(e,t,r,a,n){return Nn(e,t,r,a,n)}async function zt(e,t){const r=D(),a=M.zeros([e.shape.size]),n=ue(4),o=ne.getOrCreate("add",Cn,n),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=r.device.createCommandEncoder();return Pe(i,o,n,[e,t,a],s,Math.ceil(e.shape.size/256)),r.device.queue.submit([i.finish()]),a}function Wt(e,t){return _n(e,t)}async function It(e,t){const r=D(),a=M.zeros([e.shape.size]),n=ue(4),o=ne.getOrCreate("multiply",Un,n),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=r.device.createCommandEncoder();return Pe(i,o,n,[e,t,a],s,Math.ceil(e.shape.size/256)),r.device.queue.submit([i.finish()]),a}function qt(e,t){return Rn(e,t)}async function Ht(e,t,r=1e-6){const a=D(),n=e.shape.size,o=M.zeros([n]),s=ue(4),i=ne.getOrCreate("rms_norm",$n,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=n,new Float32Array(u)[1]=r;const l=a.device.createCommandEncoder();return Pe(l,i,s,[e,t,o],u,1),a.device.queue.submit([l.finish()]),o}function jt(e,t,r=1e-6){return Fn(e,t,r)}async function Vt(e,t,r,a=1e-6){const n=D(),o=e.shape.size,s=M.zeros([o]),i=n.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=ne.getOrCreate("layer_norm",Bn,i),l=new ArrayBuffer(8);new Uint32Array(l)[0]=o,new Float32Array(l)[1]=a;const c=D(),d=mt(l),p=c.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:e.buffer.gpuBuffer}},{binding:2,resource:{buffer:t.buffer.gpuBuffer}},{binding:3,resource:{buffer:r.buffer.gpuBuffer}},{binding:4,resource:{buffer:s.buffer.gpuBuffer}}]}),f=c.device.createCommandEncoder(),m=f.beginComputePass();return m.setPipeline(u),m.setBindGroup(0,p),m.dispatchWorkgroups(1),m.end(),c.device.queue.submit([f.finish()]),s}function Kt(e,t,r,a=1e-6){return Ln(e,t,r,a)}async function Yt(e,t,r){const a=D(),n=M.zeros([t,r]),o=a.device.createCommandEncoder();o.copyBufferToBuffer(e.buffer.gpuBuffer,0,n.buffer.gpuBuffer,0,t*r*4);const s=ue(2),i=ne.getOrCreate("softmax",Tn,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=t,new Uint32Array(u)[1]=r;const l=mt(u),c=a.device.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:n.buffer.gpuBuffer}}]}),d=o.beginComputePass();return d.setPipeline(i),d.setBindGroup(0,c),d.dispatchWorkgroups(Math.ceil(t)),d.end(),a.device.queue.submit([o.finish()]),n}function Qt(e,t,r){return zn(e,t,r)}async function Xt(e,t,r,a=1e4){const n=D(),o=M.zeros([t,r]),s=n.device.createCommandEncoder();s.copyBufferToBuffer(e.buffer.gpuBuffer,0,o.buffer.gpuBuffer,0,t*r*4);const i=ue(2),u=ne.getOrCreate("rope",kn,i),l=new ArrayBuffer(12);new Uint32Array(l)[0]=t,new Uint32Array(l)[1]=r,new Float32Array(l)[2]=a;const c=mt(l),d=n.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:o.buffer.gpuBuffer}}]}),p=s.beginComputePass();return p.setPipeline(u),p.setBindGroup(0,d),p.dispatchWorkgroups(Math.ceil(t*r/2/256)),p.end(),n.device.queue.submit([s.finish()]),o}function Zt(e,t,r,a=1e4){return Wn(e,t,r,a)}async function Jt(e,t,r,a,n,o,s,i,u){const l=D(),c=n-i+1,d=o-u+1,p=M.zeros([r,s,c,d]),f=ue(4),m=ne.getOrCreate("conv2d",On,f),b=new ArrayBuffer(36),g=new Uint32Array(b);g[0]=r,g[1]=a,g[2]=n,g[3]=o,g[4]=s,g[5]=i,g[6]=u,g[7]=c,g[8]=d;const v=l.device.createCommandEncoder();return Pe(v,m,f,[e,t,p],b,r*s),l.device.queue.submit([v.finish()]),p}function er(e,t,r,a,n,o,s,i,u){return In(e,t,r,a,n,o,s,i,u)}async function tr(e,t,r){const a=D(),n=M.zeros([r,t]),o=ue(3),s=ne.getOrCreate("transpose_2d",Dn,o),i=new ArrayBuffer(8);new Uint32Array(i)[0]=t,new Uint32Array(i)[1]=r;const u=a.device.createCommandEncoder();return Pe(u,s,o,[e,n],i,Math.ceil(t/16)*Math.ceil(r/16)),a.device.queue.submit([u.finish()]),n}function rr(e,t,r){return qn(e,t,r)}async function nr(e,t,r,a,n,o){const s=D(),i=M.zeros([n*a*o]),u=ue(3),l=ne.getOrCreate("interpolate_bilinear",Gn,u),c=new ArrayBuffer(20),d=new Uint32Array(c);d[0]=t,d[1]=r,d[2]=a,d[3]=n,d[4]=o;const p=s.device.createCommandEncoder();return Pe(p,l,u,[e,i],c,Math.ceil(a/16)*Math.ceil(n/16)),s.device.queue.submit([p.finish()]),i}function ar(e,t,r,a,n,o){return Hn(e,t,r,a,n,o)}let Oe=null,ot=null;function X(e,t=""){if(!Oe)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Oe.appendChild(r),Oe.scrollTop=Oe.scrollHeight}function j(e,t,r=.001){if(e.length!==t.length)return!1;for(let a=0;a<e.length;a++){const n=Math.abs(e[a]-t[a]),o=Math.max(Math.abs(e[a]),Math.abs(t[a]),1e-8);if(n/o>r)return!1}return!0}async function V(e,t,r=20){for(let n=0;n<3;n++)t();const a=[];for(let n=0;n<r;n++){const o=performance.now();t(),a.push(performance.now()-o)}return a.reduce((n,o)=>n+o,0)/a.length}async function K(e,t,r=20){const a=[];for(let n=0;n<Math.min(5,r);n++)await t();for(let n=0;n<r;n++){const o=performance.now();await t(),a.push(performance.now()-o)}return a.reduce((n,o)=>n+o,0)/a.length}function jn(e){if(!ot)return;const t=document.createElement("tr");t.innerHTML=`
    <td style="font-weight:600">${e.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${e.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${e.speedup>=1?"var(--green)":"var(--red)"}">
      ${e.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${e.correct?"badge-pass":"badge-fail"}">${e.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${e.tolerance.toExponential(1)}</td>
  `,ot.appendChild(t)}async function Vn(){Oe.innerHTML="",ot.innerHTML="",X("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),X("Initializing WebGPU...","");let e;try{e=await Mn()}catch(a){X(`FATAL: ${a.message}`,"err"),X("WebGPU is not available. Cannot run GPU benchmarks.","err");return}X(`GPU: ${e.adapter.name??"Unknown"}`,"ok"),X(`Running benchmarks...
`,"");const t=[];{const s=M.randn([64,64]),i=M.randn([64,64]),u=await s.readback(),l=await i.readback(),c=await V("matmul 64",()=>$e(u,l,64,64,64)),d=await K("matmul 64",async()=>{(await Ue(s,i,64,64,64)).destroy()}),p=await(await Ue(s,i,64,64,64)).readback(),f=$e(u,l,64,64,64),m=j(f,p),b=Math.max(...Array.from(f).map((g,v)=>Math.abs(g-p[v])));t.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:c,gpuMs:d,speedup:c/d,correct:m,tolerance:b}),s.destroy(),i.destroy()}{const s=M.randn([256,256]),i=M.randn([256,256]),u=await s.readback(),l=await i.readback(),c=await V("matmul 256",()=>$e(u,l,256,256,256),10),d=await K("matmul 256",async()=>{(await Ue(s,i,256,256,256)).destroy()}),p=await(await Ue(s,i,256,256,256)).readback(),f=$e(u,l,256,256,256),m=j(f,p),b=Math.max(...Array.from(f).map((g,v)=>Math.abs(g-p[v])));t.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:c,gpuMs:d,speedup:c/d,correct:m,tolerance:b}),s.destroy(),i.destroy()}{const s=M.randn([512,512]),i=M.randn([512,512]),u=await s.readback(),l=await i.readback(),c=await V("matmul 512",()=>$e(u,l,512,512,512),5),d=await K("matmul 512",async()=>{(await Ue(s,i,512,512,512)).destroy()}),p=await(await Ue(s,i,512,512,512)).readback(),f=$e(u,l,512,512,512),m=j(f,p),b=Math.max(...Array.from(f).map((g,v)=>Math.abs(g-p[v])));t.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:c,gpuMs:d,speedup:c/d,correct:m,tolerance:b}),s.destroy(),i.destroy()}{const n=M.randn([1e6]),o=M.randn([1e6]),s=await n.readback(),i=await o.readback(),u=await V("add 1M",()=>Wt(s,i)),l=await K("add 1M",async()=>{(await zt(n,o)).destroy()}),c=await(await zt(n,o)).readback(),d=Wt(s,i),p=j(d,c),f=Math.max(...Array.from(d).map((m,b)=>Math.abs(m-c[b])));t.push({name:"Add",shape:"[1000000]",cpuMs:u,gpuMs:l,speedup:u/l,correct:p,tolerance:f}),n.destroy(),o.destroy()}{const n=M.randn([1e6]),o=M.randn([1e6]),s=await n.readback(),i=await o.readback(),u=await V("mul 1M",()=>qt(s,i)),l=await K("mul 1M",async()=>{(await It(n,o)).destroy()}),c=await(await It(n,o)).readback(),d=qt(s,i),p=j(d,c),f=Math.max(...Array.from(d).map((m,b)=>Math.abs(m-c[b])));t.push({name:"Multiply",shape:"[1000000]",cpuMs:u,gpuMs:l,speedup:u/l,correct:p,tolerance:f}),n.destroy(),o.destroy()}{const n=M.randn([1024]),o=M.ones([1024]),s=await n.readback(),i=await o.readback(),u=await V("rmsnorm",()=>jt(s,i)),l=await K("rmsnorm",async()=>{(await Ht(n,o)).destroy()}),c=await(await Ht(n,o)).readback(),d=jt(s,i),p=j(d,c),f=Math.max(...Array.from(d).map((m,b)=>Math.abs(m-c[b])));t.push({name:"RMSNorm",shape:"[1024]",cpuMs:u,gpuMs:l,speedup:u/l,correct:p,tolerance:f}),n.destroy(),o.destroy()}{const n=M.randn([1024]),o=M.ones([1024]),s=M.zeros([1024]),i=await n.readback(),u=await o.readback(),l=await s.readback(),c=await V("layernorm",()=>Kt(i,u,l)),d=await K("layernorm",async()=>{(await Vt(n,o,s)).destroy()}),p=await(await Vt(n,o,s)).readback(),f=Kt(i,u,l),m=j(f,p),b=Math.max(...Array.from(f).map((g,v)=>Math.abs(g-p[v])));t.push({name:"LayerNorm",shape:"[1024]",cpuMs:c,gpuMs:d,speedup:c/d,correct:m,tolerance:b}),n.destroy(),o.destroy(),s.destroy()}{const o=M.randn([32,128]),s=await o.readback(),i=await V("softmax",()=>Qt(new Float32Array(s),32,128)),u=await K("softmax",async()=>{(await Yt(M.fromFloat32(new Float32Array(s),[32,128]),32,128)).destroy()}),l=await(await Yt(M.fromFloat32(new Float32Array(s),[32,128]),32,128)).readback(),c=Qt(new Float32Array(s),32,128),d=j(c,l),p=Math.max(...Array.from(c).map((f,m)=>Math.abs(f-l[m])));t.push({name:"Softmax",shape:"[32, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:p}),o.destroy()}{const o=M.randn([16,128]),s=await o.readback(),i=await V("rope",()=>Zt(new Float32Array(s),16,128)),u=await K("rope",async()=>{(await Xt(M.fromFloat32(new Float32Array(s),[16,128]),16,128)).destroy()}),l=await(await Xt(M.fromFloat32(new Float32Array(s),[16,128]),16,128)).readback(),c=Zt(new Float32Array(s),16,128),d=j(c,l),p=Math.max(...Array.from(c).map((f,m)=>Math.abs(f-l[m])));t.push({name:"RoPE",shape:"[16, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:p}),o.destroy()}{const c=M.randn([1,3,16,16]),d=M.randn([4,3,3,3]),p=await c.readback(),f=await d.readback(),m=await V("conv2d",()=>er(p,f,1,3,16,16,4,3,3)),b=await K("conv2d",async()=>{(await Jt(c,d,1,3,16,16,4,3,3)).destroy()}),g=await(await Jt(c,d,1,3,16,16,4,3,3)).readback(),v=er(p,f,1,3,16,16,4,3,3),h=j(v,g),w=Math.max(...Array.from(v).map((C,x)=>Math.abs(C-g[x])));t.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:m,gpuMs:b,speedup:m/b,correct:h,tolerance:w}),c.destroy(),d.destroy()}{const o=M.randn([256,256]),s=await o.readback(),i=await V("transpose",()=>rr(s,256,256)),u=await K("transpose",async()=>{(await tr(o,256,256)).destroy()}),l=await(await tr(o,256,256)).readback(),c=rr(s,256,256),d=j(c,l),p=Math.max(...Array.from(c).map((f,m)=>Math.abs(f-l[m])));t.push({name:"Transpose",shape:"[256, 256]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:p}),o.destroy()}{const u=M.randn([3072]),l=await u.readback(),c=await V("interp",()=>ar(l,32,32,64,64,3)),d=await K("interp",async()=>{(await nr(u,32,32,64,64,3)).destroy()}),p=await(await nr(u,32,32,64,64,3)).readback(),f=ar(l,32,32,64,64,3),m=j(f,p),b=Math.max(...Array.from(f).map((g,v)=>Math.abs(g-p[v])));t.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:c,gpuMs:d,speedup:c/d,correct:m,tolerance:b}),u.destroy()}X("",""),X("═══ RESULTS ═══","info");for(const a of t){jn(a);const n=a.correct?"✓":"✗",o=a.correct?"ok":"err";X(`${n} ${a.name} (${a.shape}): CPU ${a.cpuMs.toFixed(2)} ms | GPU ${a.gpuMs.toFixed(2)} ms | ${a.speedup.toFixed(1)}× | max diff ${a.tolerance.toExponential(1)}`,o)}const r=t.filter(a=>a.correct).length;X("",""),X(`═══ ${r}/${t.length} CORRECT ═══`,r===t.length?"ok":"err"),En()}function Kn(e){e.innerHTML=`
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
  `,Oe=e.querySelector("#bench-log"),ot=e.querySelector("#bench-tbody"),e.querySelector("#btn-run-bench").addEventListener("click",()=>{Vn()})}const Yn=Object.freeze(Object.defineProperty({__proto__:null,render:Kn},Symbol.toStringTag,{value:"Module"}));let ce=null,Je="";function Qn(e){const t=e.environment,r=e.gpu,a=e.case==="D"?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)";let n=`
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
    `),r.adapterError&&(n+=`<div class="row"><span class="row-label">Adapter Error</span><span class="row-value" style="color:var(--red)">${r.adapterError}</span></div>`),r.deviceError&&(n+=`<div class="row"><span class="row-label">Device Error</span><span class="row-value" style="color:var(--red)">${r.deviceError}</span></div>`),n+="</div>",r.limits){const o=r.limits,s=i=>i>=1073741824?`${(i/1073741824).toFixed(1)} GB`:i>=1048576?`${(i/1048576).toFixed(1)} MB`:i>=1024?`${(i/1024).toFixed(1)} KB`:`${i} B`;n+=`
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
    `}return r.features.length>0&&(n+=`
      <h3>Features (${r.features.length})</h3>
      <div class="card">
        ${r.features.map(o=>`<div class="row"><span class="row-value">${o}</span></div>`).join("")}
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
  `,n}function Xn(e){e.innerHTML=`
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;const t=e.querySelector("#wgdiag-result");ce=e.querySelector("#btn-copy-report"),e.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{t.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',ce.disabled=!0;const r=await pt();Je=yr(r),t.innerHTML=Qn(r),ce.disabled=!1}),ce.addEventListener("click",async()=>{if(Je)try{await navigator.clipboard.writeText(Je),ce.textContent="Copied!",setTimeout(()=>{ce.textContent="Copy Diagnostics"},2e3)}catch{const r=document.createElement("textarea");r.value=Je,document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),ce.textContent="Copied!",setTimeout(()=>{ce.textContent="Copy Diagnostics"},2e3)}}),e.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const Zn=Object.freeze(Object.defineProperty({__proto__:null,render:Xn},Symbol.toStringTag,{value:"Module"})),Jn=typeof GPUShaderStage<"u"?GPUShaderStage.COMPUTE:4;function ea(e,t=Jn){return e.map((r,a)=>({binding:a,visibility:t,buffer:{type:r}}))}function Mr(e,t){return e.createBindGroupLayout({entries:ea(t)})}function ta(e,t,r="bind group"){if(e.length!==t.length)throw new Error(`${r} binding count mismatch: pipeline layout declares ${e.length} bindings but ${t.length} entries were provided.`)}let je=null,xe=null,st=null,Pt=null;async function Ve(){if(xe&&!je&&(xe=null),xe)return xe;if(!navigator.gpu)throw new Error("WebGPU not supported");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.features.has("timestamp-query"),r=await e.requestDevice({requiredFeatures:t?["timestamp-query"]:[],requiredLimits:{}});st=null,Pt=null,r.lost.then(s=>{console.error("Benchmark device lost:",s.reason,s.message),st=s.reason??"unknown",Pt=s.message??"",je=null,xe=null}),je=r;let a=null;try{a=navigator.gpu.getPreferredCanvasFormat()}catch{}const n=e.limits,o=[];for(const s of e.features)o.push(s);return xe={webgpuAvailable:!0,adapterName:e.name??"Unknown",adapterVendor:e.vendor??"Unknown",adapterDevice:e.device??"Unknown",adapterFeatures:o,adapterLimits:{maxBufferSize:n.maxBufferSize,maxTextureDimension1D:n.maxTextureDimension1D,maxTextureDimension2D:n.maxTextureDimension2D,maxTextureDimension3D:n.maxTextureDimension3D,maxComputeWorkgroupStorageSize:n.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:n.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:n.maxStorageBufferBindingSize,maxUniformBufferBindingSize:n.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:n.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:n.maxComputeWorkgroupsPerDimension,maxColorAttachments:n.maxColorAttachments,minStorageBufferOffsetAlignment:n.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:n.minUniformBufferOffsetAlignment},preferredCanvasFormat:a,maxBufferSize:n.maxBufferSize,maxStorageBufferBindingSize:n.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:n.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:n.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:n.maxComputeWorkgroupsPerDimension,timestampQuerySupport:t,isFallbackAdapter:e.isFallbackAdapter??!1},xe}function T(){if(!je)throw new Error("Benchmark not initialized. Call initBenchmark() first.");return je}function ra(){return{reason:st,message:Pt}}function Ge(){return st!==null}async function na(e,t,r){e.pushErrorScope("validation"),e.pushErrorScope("out-of-memory"),e.pushErrorScope("internal");try{const a=await r(),o=(await Promise.all([e.popErrorScope(),e.popErrorScope(),e.popErrorScope()])).find(s=>s!==null);return{result:a,error:o?o.message:null}}catch(a){return await e.popErrorScope(),await e.popErrorScope(),await e.popErrorScope(),{result:null,error:a.message}}}function z(e){const t=T(),r=t.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(r,0,e),r}function S(e,t){const r=T(),a=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(t){const n=r.createBuffer({size:Math.max(e,t.byteLength),usage:a,mappedAtCreation:!0});return new Float32Array(n.getMappedRange()).set(t),n.unmap(),n}return r.createBuffer({size:e,usage:a})}function aa(e){return T().createBuffer({size:e,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})}async function O(e,t){const r=T(),a=aa(t),n=r.createCommandEncoder();n.copyBufferToBuffer(e,0,a,0,t),r.queue.submit([n.finish()]),await a.mapAsync(GPUMapMode.READ);const o=new Float32Array(a.getMappedRange().slice(0));return a.unmap(),a.destroy(),o}function I(e,t,r){const a=T();if(t.length===0)throw new Error("createPipeline: bindingTypes must be non-empty (uniform / read-only-storage / storage)");const n=Mr(a,t),o=a.createShaderModule({code:e}),s=a.createComputePipeline({layout:a.createPipelineLayout({bindGroupLayouts:[n]}),compute:{module:o,entryPoint:"main"}}),i=u=>r?.({bindingTypes:t,compilationMessages:u,pipelineLayoutInspected:!0});return typeof o.getCompilationInfo=="function"&&o.getCompilationInfo().then(u=>i(u.messages)).catch(()=>i([])),s}function F(e,t,r){const a=T();ta(t,r,"createBindGroupForPipeline");const n=e.getBindGroupLayout(0);return a.createBindGroup({layout:n,entries:r})}const Ne=`
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
`,Er=`
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
`,Bt=`
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
`,Pr=`
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
`,Ar=`
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
`,oa=["uniform","read-only-storage","read-only-storage","storage"],Cr=["uniform","read-only-storage","read-only-storage","storage"],sa=["uniform","read-only-storage","read-only-storage","storage"],ia=["uniform","read-only-storage","storage"],ua=["uniform","read-only-storage","read-only-storage","storage"],ca=["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"];function la(e,t){try{return e.pushErrorScope(t),!0}catch{return!1}}async function or(e,t){let r=null;for(let a=0;a<t;a++)try{const n=await e.popErrorScope();n&&!r&&(r=n)}catch{}return r}function da(e,t){let r;const a=new Promise((n,o)=>{r=window.setTimeout(()=>o(new Error(`GPU operation timed out after ${t}ms`)),t)});return Promise.race([e,a]).finally(()=>{r!==void 0&&window.clearTimeout(r)})}async function fa(e){const t=T(),r=["validation","out-of-memory","internal"];let a=0;for(const o of r)la(t,o)&&a++;let n="encode";try{const o=t.createBuffer({size:e.outputBytes,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});n="encode";const s=t.createCommandEncoder(),i=s.beginComputePass();n="dispatch",i.setPipeline(e.pipeline),i.setBindGroup(0,e.bindGroup),i.dispatchWorkgroups(...e.workgroups),i.end(),n="submit",s.copyBufferToBuffer(e.outputBuffer,0,o,0,e.outputBytes),t.queue.submit([s.finish()]),n="readback",await da(o.mapAsync(GPUMapMode.READ),15e3);const u=new Float32Array(o.getMappedRange().slice(0));o.unmap(),o.destroy();const l=await or(t,a);if(l)return{pass:!1,error:`GPU Error: ${l.message}`,stage:"submit",errorType:l.type??null};n="validation";const c=e.validator(u);return{pass:c.pass,error:c.pass?null:c.error,stage:c.pass?"complete":"validation",errorType:c.pass?null:"output-mismatch"}}catch(o){return await or(t,a),{pass:!1,error:o.message,stage:n,errorType:"exception"}}}function Ur(e,t){const r=new Float32Array(e.length);for(let a=0;a<e.length;a++)r[a]=e[a]+t[a];return r}function $r(e,t,r,a,n){const o=new Float32Array(r*a);for(let s=0;s<r;s++)for(let i=0;i<a;i++){let u=0;for(let l=0;l<n;l++)u+=e[s*n+l]*t[l*a+i];o[s*a+i]=u}return o}function Br(e,t,r,a,n,o,s,i,u){const l=n-i+1,c=o-u+1,d=new Float32Array(r*s*l*c);for(let p=0;p<r;p++)for(let f=0;f<s;f++)for(let m=0;m<l;m++)for(let b=0;b<c;b++){let g=0;for(let v=0;v<a;v++)for(let h=0;h<i;h++)for(let w=0;w<u;w++)g+=e[((p*a+v)*n+m+h)*o+b+w]*t[((f*a+v)*i+h)*u+w];d[((p*s+f)*l+m)*c+b]=g}return d}function Tt(e,t,r){const a=new Float32Array(e.length);for(let n=0;n<t;n++){const o=n*r;let s=-1e30;for(let u=0;u<r;u++)e[o+u]>s&&(s=e[o+u]);let i=0;for(let u=0;u<r;u++){const l=Math.exp(e[o+u]-s);a[o+u]=l,i+=l}for(let u=0;u<r;u++)a[o+u]/=i}return a}function Tr(e,t,r){const a=e.length;let n=0;for(let i=0;i<a;i++)n+=e[i]*e[i];const o=Math.sqrt(n/a+r),s=new Float32Array(a);for(let i=0;i<a;i++)s[i]=e[i]/o*t[i];return s}function kr(e,t,r,a,n,o,s){const i=new Float32Array(a*n*o);for(let u=0;u<a;u++)for(let l=0;l<n;l++){const c=[];let d=-1e30;for(let m=0;m<n;m++){let b=0;for(let v=0;v<o;v++)b+=e[(u*n+l)*o+v]*t[(u*n+m)*o+v];const g=b*s;c.push(g),g>d&&(d=g)}let p=0;const f=c.map(m=>{const b=Math.exp(m-d);return p+=b,b});for(let m=0;m<n;m++){const b=f[m]/p;for(let g=0;g<o;g++)i[(u*n+l)*o+g]+=b*r[(u*n+m)*o+g]}}return i}function pa(e,t,r){const a=e.length!==t.length,n=Math.min(e.length,t.length);let o=!0,s=-1,i=0,u=-1,l=null,c=null,d=1/0,p=-1/0,f=1/0,m=-1/0;for(let g=0;g<n;g++){const v=e[g],h=t[g];if(!Number.isFinite(v)){o=!1,s<0&&(s=g);continue}h<d&&(d=h),h>p&&(p=h),v<f&&(f=v),v>m&&(m=v);const w=Math.abs(v-h);w>i&&(i=w,u=g,l=h,c=v)}if(o){for(let g=n;g<e.length;g++)if(!Number.isFinite(e[g])){o=!1,s=g;break}}const b=!a&&o&&u>=0&&i<=r;return{maxError:i,errorIndex:u,cpuValue:l,gpuValue:c,expectedRange:d===1/0||p===-1/0?null:[d,p],actualRange:f===1/0||m===-1/0?null:[f,m],nonFiniteIndex:s,allFinite:o,lengthMismatch:a,pass:b}}function ma(e,t,r){const a=new Float32Array(t);for(let n=0;n<t;n++){let o=0;for(let s=0;s<r;s++)o+=e[n*r+s];a[n]=o}return a}const At=[];let sr=!1;function Or(){if(!sr)try{T().addEventListener("uncapturederror",t=>{const r=t.error;r&&At.push(r.message)}),sr=!0}catch{}}function Dr(){const e=At.slice();return At.length=0,e}function J(e){return S(e.byteLength,e)}function ir(e,t,r,a){return{config:e,pass:!1,stage:t,errorType:r,errorMessage:a,maxError:-1,errorIndex:-1,cpuValue:null,gpuValue:null,expectedRange:null,actualRange:null,nonFiniteIndex:-1}}async function ze(e){let t=null,r="pipeline",a=null,n=null;try{r="pipeline";const o=I(e.code,e.bindingTypes);r="bind-group";const s=F(o,e.bindingTypes,e.entries),i=await fa({name:e.name,pipeline:o,bindGroup:s,workgroups:e.workgroups,outputBuffer:e.outputBuffer,outputBytes:e.outputBytes,validator:d=>(t=d,{pass:!0,error:""})});if(r=i.stage,!i.pass)return ir(e.config,r,i.errorType??"gpu-error",i.error??"GPU execution failed");if(t===null)throw new Error("GPU returned no data after readback");r="validation";const u=pa(t,e.reference,e.tolerance),l=e.extraCheck?e.extraCheck(t):null,c=u.pass&&l===null;return c||(u.allFinite?u.lengthMismatch?(a="shape-mismatch",n=`GPU length ${t.length} != CPU reference length ${e.reference.length}`):u.pass?(a="constraint",n=l??"output constraint violated"):(a="output-mismatch",n=`max abs error ${u.maxError.toExponential(3)} at index ${u.errorIndex} (cpu ${u.cpuValue?.toExponential(4)??"n/a"}, gpu ${u.gpuValue?.toExponential(4)??"n/a"})`):(a="non-finite",n=`non-finite output at index ${u.nonFiniteIndex}`)),{config:e.config,pass:c,stage:c?"complete":"validation",errorType:c?null:a,errorMessage:c?null:n,maxError:u.maxError,errorIndex:u.errorIndex,cpuValue:u.cpuValue,gpuValue:u.gpuValue,expectedRange:u.expectedRange,actualRange:u.actualRange,nonFiniteIndex:u.nonFiniteIndex}}catch(o){return ir(e.config,r,a??"exception",n??o.message)}finally{try{e.dispose()}catch{}}}function We(e,t){const r=t.length>0&&t.every(o=>o.pass),a=t.reduce((o,s)=>Math.max(o,s.maxError),0),n=t.map(o=>`${o.config}:${o.pass?"PASS":"FAIL"}`).join(" ");return{name:e,pass:r,maxError:r?a:-1,details:n,cases:t}}async function ga(e){const t=new Float32Array(e).fill(1),r=new Float32Array(e).fill(2),a=J(t),n=J(r),o=S(e*4),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e;const i=z(s);return ze({name:"VecAdd",config:`N=${e}`,code:Ne,bindingTypes:oa,workgroups:[Math.ceil(e/64),1,1],entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:o}}],outputBuffer:o,outputBytes:e*4,reference:Ur(t,r),tolerance:1e-5,dispose:()=>{a.destroy(),n.destroy(),o.destroy(),i.destroy()}})}async function ba(){const e=[];for(const t of[64,1024,65536])if(e.push(await ga(t)),!e[e.length-1].pass)break;return We("VecAdd",e)}async function va(e){const t=new Float32Array(e*e).fill(1),r=new Float32Array(e*e).fill(.5),a=J(t),n=J(r),o=S(e*e*4),s=new ArrayBuffer(12),i=new Uint32Array(s);i[0]=e,i[1]=e,i[2]=e;const u=z(s);return ze({name:"Matmul",config:`${e}×${e}`,code:gt,bindingTypes:Cr,workgroups:[Math.ceil(e/16),Math.ceil(e/16),1],entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:o}}],outputBuffer:o,outputBytes:e*e*4,reference:$r(t,r,e,e,e),tolerance:.001,dispose:()=>{a.destroy(),n.destroy(),o.destroy(),u.destroy()}})}async function Gr(){const e=[];for(const t of[32,64,128])if(e.push(await va(t)),!e[e.length-1].pass)break;return We("Matmul",e)}function ya(e){if(e===1){const v=new Float32Array(25);for(let w=0;w<v.length;w++)v[w]=w+1;const h=new Float32Array([1,0,-1,1,0,-1,1,0,-1]);return{config:"5×5→3×3",N:1,C:1,H:5,W:5,F:1,FH:3,FW:3,input:v,kernel:h}}const t=1,r=2,a=3,n=3,o=1,s=2,i=2,u=new Float32Array(t*r*a*n);for(let c=0;c<u.length;c++)u[c]=c+1;const l=new Float32Array(o*r*s*i).fill(1);return{config:"C=2 (channel indexing)",N:t,C:r,H:a,W:n,F:o,FH:s,FW:i,input:u,kernel:l}}async function ha(e){const t=ya(e),{N:r,C:a,H:n,W:o,F:s,FH:i,FW:u}=t,l=n-i+1,c=o-u+1,d=r*s*l*c*4,p=J(t.input),f=J(t.kernel),m=S(d),b=new ArrayBuffer(9*4),g=new Uint32Array(b);g[0]=r,g[1]=a,g[2]=n,g[3]=o,g[4]=s,g[5]=i,g[6]=u,g[7]=l,g[8]=c;const v=z(b);return ze({name:"Conv2D",config:t.config,code:Er,bindingTypes:sa,workgroups:[r,s,l*c],entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:m}}],outputBuffer:m,outputBytes:d,reference:Br(t.input,t.kernel,r,a,n,o,s,i,u),tolerance:1e-4,dispose:()=>{p.destroy(),f.destroy(),m.destroy(),v.destroy()}})}async function wa(){const e=[];for(const t of[1,2])if(e.push(await ha(t)),!e[e.length-1].pass)break;return We("Conv2D",e)}function xa(e){if(e===1)return{rows:2,cols:5,data:new Float32Array([-2,-1,0,1,2,2,1,0,-1,-2])};const t=4,r=16,a=new Float32Array(t*r);for(let n=0;n<a.length;n++)a[n]=n%r*.1-1;return{rows:t,cols:r,data:a}}async function Sa(e){const t=xa(e),r=t.rows,a=t.cols,n=t.data.byteLength,o=S(n,t.data),s=S(n),i=new ArrayBuffer(8);new Uint32Array(i)[0]=r,new Uint32Array(i)[1]=a;const u=z(i);return ze({name:"Softmax",config:`${r}×${a}`,code:Bt,bindingTypes:ia,workgroups:[r,1,1],entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}}],outputBuffer:s,outputBytes:n,reference:Tt(t.data,r,a),tolerance:1e-4,extraCheck:l=>{for(let d=0;d<l.length;d++)if(l[d]<-1e-6)return`negative softmax output ${l[d].toExponential(3)} at index ${d}`;const c=ma(l,r,a);for(let d=0;d<r;d++)if(Math.abs(c[d]-1)>1e-4)return`row ${d} sums to ${c[d].toExponential(3)} (expected ≈ 1)`;return null},dispose:()=>{o.destroy(),s.destroy(),u.destroy()}})}async function Ma(){const e=[];for(const t of[1,2])if(e.push(await Sa(t)),!e[e.length-1].pass)break;return We("Softmax",e)}function Ea(e){if(e===1)return{N:8,input:new Float32Array([1,2,3,4,5,6,7,8]),weight:new Float32Array(8).fill(1),eps:1e-6};const t=128,r=new Float32Array(t);for(let a=0;a<t;a++)r[a]=a*37%11*.5+.1;return{N:t,input:r,weight:new Float32Array(t).fill(1),eps:1e-6}}async function Pa(e){const t=Ea(e),r=t.N,a=J(t.input),n=J(t.weight),o=S(r*4),s=new ArrayBuffer(8);new Uint32Array(s)[0]=r,new Float32Array(s)[1]=t.eps;const i=z(s);return ze({name:"RMSNorm",config:`N=${r}`,code:Pr,bindingTypes:ua,workgroups:[1,1,1],entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:o}}],outputBuffer:o,outputBytes:r*4,reference:Tr(t.input,t.weight,t.eps),tolerance:.001,dispose:()=>{a.destroy(),n.destroy(),o.destroy(),i.destroy()}})}async function Aa(){const e=[];for(const t of[1,2])if(e.push(await Pa(t)),!e[e.length-1].pass)break;return We("RMSNorm",e)}function Ca(e){const r=e===1?4:8,a=r,n=1/Math.sqrt(a),o=()=>{const s=new Float32Array(1*r*a);for(let i=0;i<s.length;i++)s[i]=(i%a+1)*.1;return s};return{batch:1,seq:r,dim:a,scale:n,Q:o(),K:o(),V:o()}}async function Ua(e){const t=Ca(e),{batch:r,seq:a,dim:n,scale:o}=t,s=r*a*n,i=r*a*a,u=J(t.Q),l=J(t.K),c=J(t.V),d=S(s*4),p=S(i*4),f=new ArrayBuffer(16),m=new Uint32Array(f),b=new Float32Array(f);m[0]=r,m[1]=a,m[2]=n,b[3]=o;const g=z(f);return ze({name:"Attention",config:`b${r}-s${a}-d${n}`,code:Ar,bindingTypes:ca,workgroups:[r,1,1],entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}},{binding:4,resource:{buffer:d}},{binding:5,resource:{buffer:p}}],outputBuffer:d,outputBytes:s*4,reference:kr(t.Q,t.K,t.V,r,a,n,o),tolerance:.001,dispose:()=>{u.destroy(),l.destroy(),c.destroy(),d.destroy(),p.destroy(),g.destroy()}})}async function $a(){const e=[];for(const t of[1,2])if(e.push(await Ua(t)),!e[e.length-1].pass)break;return We("Attention",e)}async function Ba(e){Or();const t=[{key:"vectorAdd",name:"VecAdd",fn:ba},{key:"matmul",name:"Matmul",fn:Gr},{key:"conv2d",name:"Conv2D",fn:wa},{key:"softmax",name:"Softmax",fn:Ma},{key:"rmsNorm",name:"RMSNorm",fn:Aa},{key:"attention",name:"Attention",fn:$a}],r=[];for(const a of t){if(Ge()){r.push({name:a.name,pass:!1,maxError:-1,details:"ABORTED — device lost",cases:[]});break}const n=await a.fn();if(r.push(n),e?.(n),Ge())break}return r}const Ta=["validation","out-of-memory","internal"];function Nr(e){try{if(typeof GPUOutOfMemoryError<"u"&&e instanceof GPUOutOfMemoryError)return"out-of-memory";if(typeof GPUInternalError<"u"&&e instanceof GPUInternalError)return"internal";if(typeof GPUValidationError<"u"&&e instanceof GPUValidationError)return"validation"}catch{}const t=e;return typeof t.name=="string"&&t.name?t.name:"validation"}async function _r(){if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=await e.requestDevice(),r=[],a={reason:null,message:null};return t.addEventListener("uncapturederror",n=>{const o=n.error;r.push({type:Nr(o),message:o.message})}),t.lost.then(n=>{a.reason=n.reason??"unknown",a.message=n.message??""}),{device:t,uncaptured:r,lost:a}}function Rr(e){let t=0;for(const r of Ta)try{e.pushErrorScope(r),t++}catch{}return t}async function it(e,t){const r=[];for(let a=0;a<t;a++)try{const n=await e.popErrorScope();n&&r.push({type:Nr(n),message:n.message})}catch{}return r}async function Fr(e,t){try{return{ok:!0,value:await t()}}catch(r){return{ok:!1,stage:e,error:r instanceof Error?r.message:String(r)}}}const ka=`
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
`,bt=[6,8,10,12];async function Oa(){const e={name:"GPU Sanity",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"[6, 8, 10, 12]",actual:null,exception:null};let t=null,r=0,a=!1,n=null;const o=await Fr("request-device",()=>_r());if(!o.ok)return e.stage=o.stage,e.errorType="exception",e.errorMessage=o.error,e;t=o.value,e.stage="request-device";try{if(t.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;r=Rr(t.device);const u=new Float32Array([1,2,3,4]),l=new Float32Array([5,6,7,8]),c=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const d=t.device.createBuffer({size:16,usage:c,mappedAtCreation:!0});new Float32Array(d.getMappedRange()).set(u),d.unmap();const p=t.device.createBuffer({size:16,usage:c,mappedAtCreation:!0});new Float32Array(p.getMappedRange()).set(l),p.unmap();const f=t.device.createBuffer({size:16,usage:c}),m=t.device.createBuffer({size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});e.stage="create-pipeline";const b=t.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),g=t.device.createComputePipeline({layout:t.device.createPipelineLayout({bindGroupLayouts:[b]}),compute:{module:t.device.createShaderModule({code:ka}),entryPoint:"main"}});e.stage="create-bind-group";const v=t.device.createBindGroup({layout:b,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}}]});e.stage="encode-submit";const h=t.device.createCommandEncoder(),w=h.beginComputePass();w.setPipeline(g),w.setBindGroup(0,v),w.dispatchWorkgroups(1,1,1),w.end(),h.copyBufferToBuffer(f,0,m,0,16),t.device.queue.submit([h.finish()]),e.stage="readback",await m.mapAsync(GPUMapMode.READ);const C=new Float32Array(m.getMappedRange().slice(0));m.unmap(),m.destroy(),e.stage="validate-output",e.scopeErrors=await it(t.device,r),a=!0,n=Array.from(C),e.actual=n.join(", "),d.destroy(),p.destroy(),f.destroy()}catch(u){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=u instanceof Error?u.message:String(u)}finally{if(t&&r>0&&!a)try{e.scopeErrors=await it(t.device,r)}catch{}}if(e.uncaptured=t.uncaptured,t.lost.reason&&!e.scopeErrors.length&&!e.errorMessage)return e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;if(e.scopeErrors.length>0)return e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e;if(e.uncaptured.length>0)return e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e;if(e.errorMessage)return e.pass=!1,e;const s=n??[],i=s.length===bt.length&&bt.every((u,l)=>Math.abs(s[l]-u)<1e-6);return e.pass=i,i||(e.errorType="output-mismatch",e.errorMessage=`expected [${bt.join(", ")}], got ${e.actual}`),e}async function Da(){const e={name:"Standalone MatMul 64×64",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"all elements = 32.0",actual:null,exception:null};let t=null,r=0,a=!1,n=null;const o=await Fr("request-device",()=>_r());if(!o.ok)return e.stage=o.stage,e.errorType="exception",e.errorMessage=o.error,e;t=o.value,e.stage="request-device";try{if(t.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;r=Rr(t.device);const s=64,i=64,u=s*s,l=new Float32Array(u).fill(1),c=new Float32Array(u).fill(.5),d=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const p=t.device.createBuffer({size:l.byteLength,usage:d,mappedAtCreation:!0});new Float32Array(p.getMappedRange()).set(l),p.unmap();const f=t.device.createBuffer({size:c.byteLength,usage:d,mappedAtCreation:!0});new Float32Array(f.getMappedRange()).set(c),f.unmap();const m=t.device.createBuffer({size:u*4,usage:d}),b=t.device.createBuffer({size:u*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),g=new ArrayBuffer(16),v=new Uint32Array(g);v[0]=s,v[1]=s,v[2]=i;const h=t.device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.device.queue.writeBuffer(h,0,g),e.stage="create-pipeline";const w=Mr(t.device,Cr),C=t.device.createComputePipeline({layout:t.device.createPipelineLayout({bindGroupLayouts:[w]}),compute:{module:t.device.createShaderModule({code:gt}),entryPoint:"main"}});e.stage="create-bind-group";const x=t.device.createBindGroup({layout:w,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:m}}]});e.stage="encode-submit";const k=t.device.createCommandEncoder(),N=k.beginComputePass();N.setPipeline(C),N.setBindGroup(0,x),N.dispatchWorkgroups(4,4,1),N.end(),k.copyBufferToBuffer(m,0,b,0,u*4),t.device.queue.submit([k.finish()]),e.stage="readback",await b.mapAsync(GPUMapMode.READ);const q=new Float32Array(b.getMappedRange().slice(0));b.unmap(),b.destroy(),e.stage="validate-output",e.scopeErrors=await it(t.device,r),a=!0,n=0;for(let _=0;_<u;_++)n=Math.max(n,Math.abs(q[_]-32));e.actual=`max err = ${n.toExponential(2)}`,p.destroy(),f.destroy(),m.destroy(),h.destroy()}catch(s){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=s instanceof Error?s.message:String(s)}finally{if(t&&r>0&&!a)try{e.scopeErrors=await it(t.device,r)}catch{}}return e.uncaptured=t.uncaptured,t.lost.reason&&!e.scopeErrors.length&&!e.errorMessage?(e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e):e.scopeErrors.length>0?(e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e):e.uncaptured.length>0?(e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e):e.errorMessage?(e.pass=!1,e):(e.pass=n!==null&&n<.001,e.pass||(e.errorType="output-mismatch",e.errorMessage=`expected all elements = 32.0, got ${e.actual}`),e)}function Lr(...e){for(const t of e)if(t)return t}const nt=Lr("48f382e045e65f4eed84b9c8fc3fb64e2172448f"),zr=Lr("2026-09-07T06:37:03.869Z"),_e=nt??zr??`dev-${Date.now().toString(36)}`,ut=nt&&/^[0-9a-f]{40}$/.test(nt)?nt:null,Ke=zr??"";function Ga(e,t,r,a,n){const o=e.length,s=[...e].sort((c,d)=>c-d),i=o>0?e.reduce((c,d)=>c+d,0)/o:0,u=o>0?s[Math.floor(o/2)]:0,l=o>0?e.reduce((c,d)=>c+(d-i)*(d-i),0)/o:0;return{mode:t,iterations:o,warmup:a,avgMs:i,medianMs:u,minMs:o>0?s[0]:0,maxMs:o>0?s[o-1]:0,stdDevMs:Math.sqrt(l),samplesMs:s,note:n}}class Na{device;_mode;_querySet=null;_resolve=null;_periodNs=1;_fallbackLogged=null;constructor(t){this.device=t;const r=this.tryEnableTimestamps(t);this._mode=r?"GPU_TIMESTAMP":"END_TO_END"}tryEnableTimestamps(t){try{if(!t.features||typeof t.features.has!="function"||!t.features.has("timestamp-query"))return!1;const r=t.createQuerySet({type:"timestamp",count:2}),a=t.createBuffer({size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),n=t.createCommandEncoder();n.beginComputePass({timestampWrites:{querySet:r,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1}}).end(),n.finish(),this._querySet=r,this._resolve=a;const s=t.limits.timestampPeriod;return this._periodNs=typeof s=="number"&&s>0?s:1,!0}catch{return this._querySet?.destroy?.(),this._resolve?.destroy?.(),this._querySet=null,this._resolve=null,!1}}get mode(){return this._mode}get fallbackNote(){return this._fallbackLogged}async measure(t,r){const a=r.warmup??3;for(let o=0;o<a;o++)this.dispatchPass(t),await this.sync();const n=[];for(let o=0;o<r.iterations;o++){let s;if(this._mode==="GPU_TIMESTAMP"){const i=await this.measureTimestampPass(t);i===null?(this.fallback("timestamp query returned zero/undefined values — switched to END_TO_END"),s=await this.measureEndToEnd(t,r.wait)):s=i}else s=await this.measureEndToEnd(t,r.wait);n.push(s)}return Ga(n,this._mode,r.iterations,a,this._fallbackLogged??void 0)}dispatchPass(t,r){const a=this.device.createCommandEncoder(),n=a.beginComputePass(r?{timestampWrites:r}:void 0);return t(n),n.end(),a}async timeOne(t,r){if(this._mode==="GPU_TIMESTAMP"){const a=await this.measureTimestampPass(t);if(a!==null)return a;this.fallback("timestamp query returned zero/undefined values — switched to END_TO_END")}return this.measureEndToEnd(t,r)}async measureTimestampPass(t){if(!this._querySet||!this._resolve)return null;try{const r=this.dispatchPass(t,{querySet:this._querySet,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1});r.resolveQuerySet(this._querySet,0,2,this._resolve,0),this.device.queue.submit([r.finish()]);const a=this.device.createBuffer({size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),n=this.device.createCommandEncoder();n.copyBufferToBuffer(this._resolve,0,a,0,16),this.device.queue.submit([n.finish()]),await a.mapAsync(GPUMapMode.READ);const o=new BigUint64Array(a.getMappedRange()),s=Number(o[1]-o[0]);return a.unmap(),a.destroy(),s>0?s*this._periodNs/1e6:null}catch{return null}}async measureEndToEnd(t,r){const a=performance.now(),n=this.dispatchPass(t);return this.device.queue.submit([n.finish()]),r?await r():await this.sync(),performance.now()-a}async sync(){try{await this.device.queue.onSubmittedWorkDone()}catch{await new Promise(t=>setTimeout(t,16))}}fallback(t){this._fallbackLogged||(this._fallbackLogged=t),this._mode="END_TO_END";try{this._querySet?.destroy(),this._resolve?.destroy()}catch{}this._querySet=null,this._resolve=null}destroy(){try{this._querySet?.destroy(),this._resolve?.destroy()}catch{}this._querySet=null,this._resolve=null}}const ur=["uniform","read-only-storage","read-only-storage","storage"],cr=["uniform","read-only-storage","read-only-storage","storage"],_a=`
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
`,Ra=`
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
`;function ct(e,t){return{value:e/(t/1e3)/1e9,unit:"GFLOPS"}}function Fa(e,t){return{value:e/(t/1e3)/1e9,unit:"GB/s (estimate)"}}function kt(e){for(let t=0;t<e.length;t++)if(!Number.isFinite(e[t]))return!1;return!0}function de(e,t){let r=0;const a=Math.min(e.length,t.length);for(let n=0;n<a;n++)r=Math.max(r,Math.abs(e[n]-t[n]));return r}function ve(e,t,r,a){return new Error(`${e} ${t}: ${r} (${a}) — fix correctness before benchmarking`)}function Ie(e,t,r,a,n){if(!kt(r))throw ve(e,t,"non-finite output","");if(r.length!==a.length)throw ve(e,t,"length mismatch",`${r.length} vs ${a.length}`);const o=de(r,a);if(o>Math.max(n,de(a,new Float32Array(a.length))*.01))throw ve(e,t,`correctness check failed (maxErr=${o.toExponential(2)})`,"")}async function H(e,t,r,a,n){const o=T(),s=o.createCommandEncoder(),i=s.beginComputePass();i.setPipeline(e),i.setBindGroup(0,t),i.dispatchWorkgroups(r[0],r[1],r[2]),i.end(),o.queue.submit([s.finish()]),await O(a,n)}function se(e,t){return()=>O(e,t).then(()=>{})}function ee(e){let t=2654435769;for(let r=0;r<e.length;r++)t=t*1664525+1013904223>>>0,e[r]=t%2001/1e3-1}function ie(e,t,r,a,n,o){return{id:e,name:t,size:r,timingMode:a.mode,iterations:a.iterations,warmup:a.warmup,medianMs:a.medianMs,averageMs:a.avgMs,minMs:a.minMs,maxMs:a.maxMs,stdDevMs:a.stdDevMs,throughput:n,note:o}}const La=[{size:128,iterations:12,validate:!0},{size:256,iterations:12,validate:!0},{size:512,iterations:10,validate:!1},{size:1024,iterations:8,validate:!1}];async function za(e,t){const r=[];for(const a of La){const n=a.size;if(t&&!t.has(`matmul-${n}`))continue;const o=n*n*4,s=new Float32Array(n*n),i=new Float32Array(n*n);ee(s),ee(i);const u=S(o,s),l=S(o,i),c=S(o),d=z(new Float32Array([n,n,n,1]).buffer),p=I(gt,["uniform","read-only-storage","read-only-storage","storage"]),f=F(p,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]),m=[n/16,n/16,1];await H(p,f,m,c,o);const b=await O(c,o);if(a.validate){const v=$r(s,i,n,n,n);Ie("matmul",`${n}×${n}`,b,v,.01)}else if(!kt(b))throw ve("matmul",`${n}×${n}`,"non-finite output","");const g=await e.measure(v=>{v.setPipeline(p),v.setBindGroup(0,f),v.dispatchWorkgroups(m[0],m[1],m[2])},{iterations:a.iterations,wait:se(c,o)});r.push(ie(`matmul-${n}`,"Matrix Multiply",`${n}×${n}`,g,ct(2*n*n*n,g.medianMs)))}return r}const Wa=[{n:1e3,iterations:12},{n:16e3,iterations:12},{n:64e3,iterations:12},{n:262144,iterations:10},{n:1048576,iterations:10},{n:4194304,iterations:8}];async function Ia(e,t){const r=[];for(const a of Wa){const n=a.n;if(t&&!t.has(`vecadd-${n}`))continue;const o=n*4,s=new Float32Array(n),i=new Float32Array(n);ee(s),ee(i);const u=S(o,s),l=S(o,i),c=S(o),d=z(new Float32Array([n,0,0,0]).buffer),p=I(Ne,["uniform","read-only-storage","read-only-storage","storage"]),f=F(p,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]),b=[Math.ceil(n/64),1,1];await H(p,f,b,c,o);const g=await O(c,o),v=Ur(s,i);Ie("vecadd",`${n.toLocaleString("en-US")} elements`,g,v,.01);const h=await e.measure(w=>{w.setPipeline(p),w.setBindGroup(0,f),w.dispatchWorkgroups(b[0],b[1],b[2])},{iterations:a.iterations,wait:se(c,o)});r.push(ie(`vecadd-${n}`,"Vector Add",`${n.toLocaleString("en-US")} elements`,h,Fa(3*n*4,h.medianMs)))}return r}const qa=[{channels:1,rows:32,cols:32,iterations:10},{channels:8,rows:64,cols:64,iterations:8},{channels:16,rows:128,cols:128,iterations:6}];async function Ha(e,t){const r=[];for(const a of qa){const n=a.channels,o=a.rows,s=a.cols,i=n,u=3,l=3,c=o-u+1,d=s-l+1,p=new Float32Array(n*o*s),f=new Float32Array(i*n*u*l);ee(p),ee(f);const m=S(n*o*s*4,p),b=S(i*n*u*l*4,f),g=S(i*c*d*4),v=z(new Float32Array([1,n,o,s,i,u,l,c,d,0,0,0]).buffer),h=I(Er,["uniform","read-only-storage","read-only-storage","storage"]),w=F(h,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:b}},{binding:3,resource:{buffer:g}}]),C=c*d,x=[1,i,C];await H(h,w,x,g,i*c*d*4);const k=await O(g,i*c*d*4),N=Br(p,f,1,n,o,s,i,u,l);Ie("conv2d",`${n}×${o}×${s} → ${i}×${c}×${d}`,k,N,.001);const q=await e.measure(_=>{_.setPipeline(h),_.setBindGroup(0,w),_.dispatchWorkgroups(x[0],x[1],x[2])},{iterations:a.iterations,wait:se(g,i*c*d*4)});r.push(ie(`conv2d-${n}-${o}`,"Convolution 3×3",`${n}×${o}×${s} → ${i}×${c}×${d}`,q))}return r}const ja=[{rows:128,cols:128,iterations:12},{rows:256,cols:256,iterations:12},{rows:512,cols:512,iterations:10}];async function Va(e,t){const r=[];for(const a of ja){const{rows:n,cols:o,iterations:s}=a;if(t&&!t.has(`softmax-${n}`))continue;const i=new Float32Array(n*o);ee(i);const u=S(n*o*4,i),l=S(n*o*4),c=z(new Float32Array([n,o,0,0]).buffer),d=I(Bt,["uniform","read-only-storage","storage"]),p=F(d,["uniform","read-only-storage","storage"],[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}}]),f=[n,1,1];await H(d,p,f,l,n*o*4);const m=await O(l,n*o*4),b=Tt(i,n,o);Ie("softmax",`${n}×${o}`,m,b,.001);const g=await e.measure(v=>{v.setPipeline(d),v.setBindGroup(0,p),v.dispatchWorkgroups(f[0],f[1],f[2])},{iterations:s,wait:se(l,n*o*4)});r.push(ie(`softmax-${n}`,"Softmax",`${n}×${o}`,g))}return r}const Ka=[{size:256,iterations:12},{size:512,iterations:12},{size:1024,iterations:12},{size:2048,iterations:10},{size:4096,iterations:10}];async function Ya(e,t){const r=[];for(const a of Ka){const{size:n,iterations:o}=a;if(t&&!t.has(`rmsnorm-${n}`))continue;const s=new Float32Array(n);ee(s);const i=new Float32Array(n);for(let w=0;w<n;w++)i[w]=1+w%7*.01;const u=1e-6,l=S(n*4,s),c=S(n*4,i),d=S(n*4),p=z(new Float32Array([n,u,0,0]).buffer),f=I(Pr,["uniform","read-only-storage","read-only-storage","storage"]),m=F(f,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:d}}]),b=[1,1,1];await H(f,m,b,d,n*4);const g=await O(d,n*4),v=Tr(s,i,u);Ie("rmsnorm",String(n),g,v,.001);const h=await e.measure(w=>{w.setPipeline(f),w.setBindGroup(0,m),w.dispatchWorkgroups(b[0],b[1],b[2])},{iterations:o,wait:se(d,n*4)});r.push(ie(`rmsnorm-${n}`,"RMSNorm",String(n),h))}return r}const Qa=[{seq:128,iterations:10,validate:!0},{seq:256,iterations:10,validate:!0},{seq:512,iterations:8,validate:!0},{seq:1024,iterations:6,validate:!1}];function Xa(e,t,r=1){const a=new Float32Array(r*e*t),n=new Float32Array(r*e*t),o=new Float32Array(r*e*t);ee(a),ee(n),ee(o);const s=1/Math.sqrt(t),i=new Float32Array(r*e*e);for(let c=0;c<r;c++)for(let d=0;d<e;d++)for(let p=0;p<e;p++){let f=0;for(let m=0;m<t;m++)f+=a[(c*e+d)*t+m]*n[(c*e+p)*t+m];i[c*e*e+d*e+p]=f*s}const u=Tt(i,r*e,e),l=kr(a,n,o,r,e,t,s);return{Q:a,K:n,V:o,scores:i,probs:u,out:l}}async function Za(e,t){const r=[],a={};for(const n of Qa){const{seq:o,iterations:s}=n;if(t&&!t.includes(o))continue;const i=64,u=1,l=await eo(o,i,u);await H(l.pipelines.total,l.groups.total,[u,1,1],l.bufs.out,o*i*4);const c=await O(l.bufs.out,o*i*4);if(n.validate)Ie("attention",`seq=${o}`,c,l.ref.out,.01);else if(!kt(c))throw ve("attention",`seq=${o}`,"non-finite output","");const d=await e.measure(p=>{p.setPipeline(l.pipelines.total),p.setBindGroup(0,l.groups.total),p.dispatchWorkgroups(u,1,1)},{iterations:s,wait:se(l.bufs.out,o*i*4)});r.push(ie(`attention-${o}`,"Attention (single pass)",`seq=${o} dim=64 batch=1`,d,ct(4*o*o*i,d.medianMs),"QK^T + softmax + PV in one pass")),a[`seq=${o}`]=await Ja(e,l,o,i,s)}return{main:r,phases:a}}async function Ja(e,t,r,a,n){const o=[Math.ceil(r/64),1,1],s=[Math.ceil(r/64),a,1],i=r*r*4,u=r*a*4;for(let c=0;c<3;c++)await H(t.pipelines.qkt,t.groups.qkt,o,t.bufs.scores,i),await H(t.pipelines.soft,t.groups.soft,[r,1,1],t.bufs.probs,i),await H(t.pipelines.pv,t.groups.pv,s,t.bufs.out,u);const l=[];{await H(t.pipelines.qkt,t.groups.qkt,o,t.bufs.scores,i);const c=await O(t.bufs.scores,i);if(de(c,t.ref.scores)>.01)throw ve("attention.qkt",`seq=${r}`,"phase correctness check failed",`maxErr=${de(c,t.ref.scores).toExponential(2)}`);const d=[];for(let p=0;p<n;p++)d.push(await e.timeOne(f=>{f.setPipeline(t.pipelines.qkt),f.setBindGroup(0,t.groups.qkt),f.dispatchWorkgroups(o[0],o[1],o[2])},se(t.bufs.scores,i)));l.push(ie(`attention-qkt-${r}`,"QK^T (scores)",`seq=${r} dim=64`,vt(d,e.mode),ct(2*r*r*a,lr(d))))}{const c=[];for(let p=0;p<n;p++)await H(t.pipelines.qkt,t.groups.qkt,o,t.bufs.scores,i),c.push(await e.timeOne(f=>{f.setPipeline(t.pipelines.soft),f.setBindGroup(0,t.groups.soft),f.dispatchWorkgroups(r,1,1)},se(t.bufs.probs,i)));const d=await O(t.bufs.probs,i);if(de(d,t.ref.probs)>.01)throw ve("attention.softmax",`seq=${r}`,"phase correctness check failed",`maxErr=${de(d,t.ref.probs).toExponential(2)}`);l.push(ie(`attention-softmax-${r}`,"Softmax on scores",`seq=${r} rows=${r}`,vt(c,e.mode)))}{const c=[];for(let p=0;p<n;p++)await H(t.pipelines.qkt,t.groups.qkt,o,t.bufs.scores,i),await H(t.pipelines.soft,t.groups.soft,[r,1,1],t.bufs.probs,i),c.push(await e.timeOne(f=>{f.setPipeline(t.pipelines.pv),f.setBindGroup(0,t.groups.pv),f.dispatchWorkgroups(s[0],s[1],s[2])},se(t.bufs.out,u)));const d=await O(t.bufs.out,u);if(de(d,t.ref.out)>.01)throw ve("attention.pv",`seq=${r}`,"phase correctness check failed",`maxErr=${de(d,t.ref.out).toExponential(2)}`);l.push(ie(`attention-pv-${r}`,"Softmax × V",`seq=${r} dim=64`,vt(c,e.mode),ct(2*r*r*a,lr(c))))}return l}function vt(e,t){const r=[...e].sort((s,i)=>s-i),a=e.reduce((s,i)=>s+i,0)/Math.max(e.length,1),n=r[Math.floor(r.length/2)]??0,o=e.reduce((s,i)=>s+(i-a)**2,0)/Math.max(e.length,1);return{mode:t,iterations:e.length,warmup:3,medianMs:n,avgMs:a,minMs:r[0]??0,maxMs:r[r.length-1]??0,stdDevMs:Math.sqrt(o)}}function lr(e){const t=[...e].sort((r,a)=>r-a);return t[Math.floor(t.length/2)]??0}async function eo(e,t,r){const a=Xa(e,t,r),n=1/Math.sqrt(t),o=S(e*t*4,a.Q),s=S(e*t*4,a.K),i=S(e*t*4,a.V),u=S(e*t*4),l=S(e*e*4),c=S(e*e*4),d=z(new Float32Array([r,e,t,n]).buffer),p=I(Ar,["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"]),f=I(_a,[...ur]),m=I(Bt,["uniform","read-only-storage","storage"]),b=I(Ra,[...cr]),g=F(p,["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:i}},{binding:4,resource:{buffer:u}},{binding:5,resource:{buffer:l}}]),v=F(f,ur,[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:l}}]),h=F(m,["uniform","read-only-storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:c}}]),w=F(b,cr,[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:u}}]);return{seq:e,dim:t,batch:r,pipelines:{total:p,qkt:f,soft:m,pv:b},groups:{total:g,qkt:v,soft:h,pv:w},bufs:{q:o,k:s,v:i,out:u,scores:l,probs:c},ref:{scores:a.scores,probs:a.probs,out:a.out}}}const ge=30,Wr=65536;function to(){return{pipeline:I(Ne,["uniform","read-only-storage","read-only-storage","storage"])}}function be(e){if(e.length===0)return 0;const t=[...e].sort((r,a)=>r-a);return t[Math.floor(t.length/2)]}async function Re(e){const t=performance.now();return await e(),performance.now()-t}const ro=[1,4,8,16,32,64,128];async function no(){const e=T(),t=[],r=[];let a=!1;for(const n of ro){if(a){t.push({id:`memory-${n}-mib`,requestedBytes:n*1024*1024,requestedMiB:n,created:!1,success:!1,note:"not attempted (previous allocation failed)"});continue}const o=n*1024*1024;let s=!1,i=!1,u;try{const l=S(o);s=!0,r.push(l);const{error:c}=await na(e,"memory-allocate",async()=>(await O(l,4),!0));i=!c,u=c?`GPU error while forcing allocation: ${c}`:void 0}catch(l){u=l.message}t.push({id:`memory-${n}-mib`,requestedBytes:o,requestedMiB:n,created:s,success:i,note:u}),i||(a=!0)}for(const n of r)try{n.destroy()}catch{}return t}async function ao(){const{pipeline:e}=to(),t=Wr,r=t*4,a=[Math.ceil(t/64),1,1],n=new Float32Array(t),o=new Float32Array(t);for(let f=0;f<t;f++)n[f]=f%100/25-2,o[f]=f%77/13-3;const s=z(new Float32Array([t,0,0,0]).buffer),i=[];for(let f=0;f<ge;f++){const m=await Re(async()=>{const b=S(r,n),g=S(r,o),v=S(r),h=F(e,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:b}},{binding:2,resource:{buffer:g}},{binding:3,resource:{buffer:v}}]),w=T().createCommandEncoder(),C=w.beginComputePass();C.setPipeline(e),C.setBindGroup(0,h),C.dispatchWorkgroups(a[0],a[1],a[2]),C.end(),T().queue.submit([w.finish()]),await O(v,r),b.destroy(),g.destroy(),v.destroy()});i.push(m)}const u=S(r,n),l=S(r,o),c=S(r),d=F(e,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]),p=[];for(let f=0;f<ge;f++){const m=await Re(async()=>{const b=T().createCommandEncoder(),g=b.beginComputePass();g.setPipeline(e),g.setBindGroup(0,d),g.dispatchWorkgroups(a[0],a[1],a[2]),g.end(),T().queue.submit([b.finish()]),await O(c,r)});p.push(m)}return{allocateDestroy:{id:"buffer-allocate-destroy",name:"Allocate + Destroy per op",size:`${dr(3*t*4)} (3 × VecAdd buffers)`,timingMode:"END_TO_END",perOpMs:be(i),totalMs:i.reduce((f,m)=>f+m,0),iterations:ge,samplesMs:[...i].sort((f,m)=>f-m),note:"full op = create 3 buffers + bind group + dispatch + readback + destroy"},bufferReuse:{id:"buffer-reuse",name:"Reuse persistent buffers",size:`${dr(3*t*4)} (3 × VecAdd buffers)`,timingMode:"END_TO_END",perOpMs:be(p),totalMs:p.reduce((f,m)=>f+m,0),iterations:ge,samplesMs:[...p].sort((f,m)=>f-m),note:"full op = dispatch + readback on pre-allocated buffers"}}}async function oo(){const e=Wr,t=e*4,r=[Math.ceil(e/64),1,1],a=new Float32Array(e),n=new Float32Array(e);for(let f=0;f<e;f++)a[f]=f%100/25-2,n[f]=f%77/13-3;const o=S(t,a),s=S(t,n),i=S(t),u=z(new Float32Array([e,0,0,0]).buffer),l=[];for(let f=0;f<ge;f++){const m=await Re(async()=>{const b=I(Ne,["uniform","read-only-storage","read-only-storage","storage"]),g=F(b,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:i}}]),v=T().createCommandEncoder(),h=v.beginComputePass();h.setPipeline(b),h.setBindGroup(0,g),h.dispatchWorkgroups(r[0],r[1],r[2]),h.end(),T().queue.submit([v.finish()]),await O(i,t),typeof b.destroy=="function"&&b.destroy()});l.push(m)}const c=I(Ne,["uniform","read-only-storage","read-only-storage","storage"]),d=F(c,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:i}}]),p=[];for(let f=0;f<ge;f++){const m=await Re(async()=>{const b=T().createCommandEncoder(),g=b.beginComputePass();g.setPipeline(c),g.setBindGroup(0,d),g.dispatchWorkgroups(r[0],r[1],r[2]),g.end(),T().queue.submit([b.finish()]),await O(i,t)});p.push(m)}return{recreate:{id:"pipeline-recreate",name:"Recreate pipeline per op",size:"VecAdd 65536",timingMode:"END_TO_END",perOpMs:be(l),totalMs:l.reduce((f,m)=>f+m,0),iterations:ge,samplesMs:[...l].sort((f,m)=>f-m),note:"full op = createPipeline + bind group + dispatch + readback"},cached:{id:"pipeline-cached",name:"Cached pipeline",size:"VecAdd 65536",timingMode:"END_TO_END",perOpMs:be(p),totalMs:p.reduce((f,m)=>f+m,0),iterations:ge,samplesMs:[...p].sort((f,m)=>f-m),note:"full op = dispatch + readback on a pre-built pipeline"}}}const le=8,yt=4096;async function so(){const e=yt,t=e*4,r=[Math.ceil(e/64),1,1],a=new Float32Array(e),n=new Float32Array(e);for(let f=0;f<e;f++)a[f]=f%100/25-2,n[f]=f%77/13-3;const o=z(new Float32Array([e,0,0,0]).buffer),s=S(t,a),i=S(t,n),u=S(t),l=I(Ne,["uniform","read-only-storage","read-only-storage","storage"]),c=F(l,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:u}}]),d=[];for(let f=0;f<20;f++){const m=await Re(async()=>{const b=[];for(let g=0;g<le;g++){const v=T().createCommandEncoder(),h=v.beginComputePass();h.setPipeline(l),h.setBindGroup(0,c),h.dispatchWorkgroups(r[0],r[1],r[2]),h.end(),b.push(v)}for(const g of b)T().queue.submit([g.finish()]);await O(u,t)});d.push(m)}const p=[];for(let f=0;f<20;f++){const m=await Re(async()=>{const b=T().createCommandEncoder(),g=b.beginComputePass();g.setPipeline(l),g.setBindGroup(0,c);for(let v=0;v<le;v++)g.dispatchWorkgroups(r[0],r[1],r[2]);g.end(),T().queue.submit([b.finish()]),await O(u,t)});p.push(m)}return[{id:"command-batch-individual",name:`${le} × VecAdd(${yt}) — individual submits`,dispatches:le,timingMode:"END_TO_END",totalMedianMs:be(d),perDispatchMs:be(d)/le,samplesMs:[...d].sort((f,m)=>f-m)},{id:"command-batch-batched",name:`${le} × VecAdd(${yt}) — one batched submit`,dispatches:le,timingMode:"END_TO_END",totalMedianMs:be(p),perDispatchMs:be(p)/le,samplesMs:[...p].sort((f,m)=>f-m)}]}function dr(e){return`${(e/1024).toFixed(1)} KiB`}function io(){const e=typeof navigator<"u"?navigator:void 0;if(e&&(typeof e.getGpuUtilization=="function"||typeof e.gpuUtilization=="number"))try{const t=typeof e.getGpuUtilization=="function"?e.getGpuUtilization():e.gpuUtilization;return typeof t=="number"?`${t}%`:"UNAVAILABLE"}catch{return"UNAVAILABLE"}return"UNAVAILABLE"}function Ct(){const e=typeof navigator<"u"?navigator:void 0;if(!e)return"UNAVAILABLE";const t=e;if(typeof t.getDeviceThermalLevel=="function")try{const r=t.getDeviceThermalLevel();return String(r)}catch{return"UNAVAILABLE"}return"UNAVAILABLE"}function fr(){const e=typeof navigator<"u"?navigator:void 0;return{userAgent:typeof navigator<"u"?navigator.userAgent:"unknown",platform:e&&typeof e.platform=="string"?e.platform:"unknown",hardwareConcurrency:e&&typeof e.hardwareConcurrency=="number"?e.hardwareConcurrency:null,deviceMemory:e&&typeof e.deviceMemory=="number"?e.deviceMemory:null,thermalState:Ct(),gpuUtilization:io()}}function uo(e){return JSON.parse(JSON.stringify(e))}function pr(e){const t=e.diag,r={device:{webgpuAvailable:t.webgpuAvailable,adapterName:t.adapterName,adapterVendor:t.adapterVendor,adapterDevice:t.adapterDevice,features:t.adapterFeatures,timestampQuerySupport:t.timestampQuerySupport,isFallbackAdapter:t.isFallbackAdapter},browser:e.browser,webgpu:{limits:{maxBufferSize:t.maxBufferSize,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension},maxBufferSize:t.maxBufferSize,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize},timingMode:e.timingMode,timestamp:new Date().toISOString(),build:e.build,tests:e.tests,memory:e.memory,bufferReuse:e.bufferReuse,pipelineCache:e.pipelineCache,commandBatching:e.commandBatching,sustained:e.sustained,suiteError:e.suiteError};return uo(r)}function co(e){const t=[],r=e.tests.matmul,a=e.tests.vecadd,n=e.tests.attention,o=(()=>{if(r.length===0)return null;const c=r.filter(d=>d.throughput);return c.length===0?null:c.reduce((d,p)=>d.throughput.value>p.throughput.value?d:p)})();o?t.push(`compute-bound: largest MatMul throughput measured ${o.throughput.value.toFixed(1)} ${o.throughput.unit} at ${o.size} — matrix multiply is the classic compute-bound workload here.`):t.push("compute-bound: no usable MatMul throughput recorded.");const s=a.reduce((c,d)=>d.throughput&&(!c||d.throughput.value>c.throughput.value)?d:c,null);if(s&&s.throughput?t.push(`memory-bandwidth-sensitive: Vector Add peaks at ${s.throughput.value.toFixed(1)} ${s.throughput.unit} at ${s.size} — trivial ALU per element, so this reflects practical device memory bandwidth.`):t.push("memory-bandwidth-sensitive: no usable Vector Add bandwidth recorded."),n.length>=2){const c=[...n].sort((p,f)=>p.size.length-f.size.length),d=c[c.length-1];t.push(`attention bottleneck: largest tested single-pass attention (${d.size}) took ${d.medianMs.toFixed(2)} ms median (${d.timingMode}). Scores grow O(seq²): this is the workload most likely to bottleneck video diffusion decoding.`)}else n.length===1&&t.push(`attention bottleneck: attention at ${n[0].size} took ${n[0].medianMs.toFixed(2)} ms median (${n[0].timingMode}). Scores grow O(seq²).`);const i=n.filter(c=>/seq=(\d+)/.test(c.size)).sort((c,d)=>parseInt(d.size.match(/seq=(\d+)/)[1],10)-parseInt(c.size.match(/seq=(\d+)/)[1],10));if(i.length>=2){const c=i[0],d=i[1],p=c.medianMs/Math.max(d.medianMs,1e-9),f=parseInt(c.size.match(/seq=(\d+)/)[1],10),m=parseInt(d.size.match(/seq=(\d+)/)[1],10),b=f/m;t.push(`attention scaling: ${c.size} ran ${p.toFixed(2)}× slower than ${d.size} (seq ×${b}). With O(seq²) scores, doubling seq multiplies score work by ~4× — expect ~${(b*b).toFixed(1)}× per double if score-dominated.`)}else t.push("attention scaling: need 2+ attention sizes to compute a scaling ratio.");const u=e.memory.filter(c=>c.created&&c.success);if(u.length>0){const c=u.reduce((d,p)=>d.requestedBytes>p.requestedBytes?d:p);t.push(`largest safe tested tensor: single storage buffer of ${(c.requestedBytes/(1024*1024)).toFixed(0)} MiB allocated and survived. This is a tested allocation, not the total GPU memory.`)}else t.push("largest safe tested tensor: no successful memory allocation recorded.");const l=e.bufferReuse;if(l.allocateDestroy&&l.bufferReuse&&l.allocateDestroy.perOpMs>0){const c=l.bufferReuse.perOpMs/l.allocateDestroy.perOpMs;t.push(`buffer reuse: persistent reuse measured ${(c*100).toFixed(0)}% of the allocate/destroy per-op cost (${l.allocateDestroy.perOpMs.toFixed(3)} ms → ${l.bufferReuse.perOpMs.toFixed(3)} ms). Persistent buffers should be the default in the tensor runtime.`)}else t.push("buffer reuse: insufficient data to compare allocation strategies.");return t}const lo=30,fo=2e3,po=750,G=256;function mr(e){let t=2654435769;for(let r=0;r<e.length;r++)t=t*1664525+1013904223>>>0,e[r]=t%2001/1e3-1}function mo(){const e=G*G*4,t=new Float32Array(G*G),r=new Float32Array(G*G);mr(t),mr(r);const a=S(e,t),n=S(e,r),o=S(e),s=z(new Float32Array([G,G,G,1]).buffer),i=I(gt,["uniform","read-only-storage","read-only-storage","storage"]),u=F(i,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:o}}]);return{pipeline:i,bg:u,bufC:o,wg:[G/16,G/16,1]}}function go(e){return new Promise(t=>setTimeout(t,e))}async function bo(e,t={}){const r=T(),a=t.seconds??lo,n=Ct(),{pipeline:o,bg:s,bufC:i,wg:u}=mo(),l=await e.timeOne(x=>{x.setPipeline(o),x.setBindGroup(0,s),x.dispatchWorkgroups(u[0],u[1],u[2])},()=>O(i,G*G*4).then(()=>{})),c=Math.max(1,Math.min(fo,Math.floor(po/Math.max(l,.01)))),d=[],p=performance.now(),f=2*G*G*G;for(let x=0;x<a;x++){const k=performance.now();let N=0;try{const Ae=r.createCommandEncoder(),Ce=Ae.beginComputePass();Ce.setPipeline(o),Ce.setBindGroup(0,s);for(let W=0;W<c;W++)Ce.dispatchWorkgroups(u[0],u[1],u[2]);Ce.end(),r.queue.submit([Ae.finish()]),await O(i,G*G*4),N=Math.max(performance.now()-k,.001)}catch(Ae){N=1e3,t.onProgress?.(Ae.message)}const q=N/c,_=f/(q/1e3)/1e9,ae={second:x+1,avgMs:q,gflops:_};d.push(ae),t.onSecond?.(x+1,ae,x);const Xe=1e3-(performance.now()-k);Xe>10&&await go(Xe)}Math.max(performance.now()-p,1);const m=d.map(x=>x.gflops),b=d.filter(x=>x.second<=10).map(x=>x.gflops),g=d.filter(x=>x.second>a-10).map(x=>x.gflops),v=x=>x.length?x.reduce((k,N)=>k+N,0)/x.length:0,h=v(b),w=v(g),C=h>0?(1-w/h)*100:0;return{durationSeconds:a,samples:d,first10sAvgGflops:h,last10sAvgGflops:w,throttled:w<h*.95,dropPct:Math.max(0,C),avgGflops:v(m),minGflops:d.length?Math.min(...m):0,maxGflops:d.length?Math.max(...m):0,thermalBefore:n,thermalAfter:Ct(),timingMode:"AGGREGATE_END_TO_END",error:void 0}}let ht=!1;const qe={matmul:new Set(["matmul-256","matmul-512"]),vecadd:new Set(["vecadd-1048576"]),conv2d:new Set,softmax:new Set(["softmax-256"]),rmsnorm:new Set(["rmsnorm-1024"]),attentionSeqs:[256]};async function vo(e){if(ht)throw new Error("A benchmark suite is already running.");ht=!0;let t=null;try{const r=await Ve();t=new Na(T());const a=fr(),n={id:_e,commit:ut??null,time:Ke??null},o=e.mode==="full",s={matmul:[],vecadd:[],conv2d:[],softmax:[],rmsnorm:[],attention:[],attentionPhases:{}},i=m=>e.onProgress?.(m);i("matmul"),s.matmul=await za(t,o?void 0:qe.matmul),i("vecadd"),s.vecadd=await Ia(t,o?void 0:qe.vecadd),o&&(i("conv2d"),s.conv2d=await Ha(t)),i("softmax"),s.softmax=await Va(t,o?void 0:qe.softmax),i("rmsnorm"),s.rmsnorm=await Ya(t,o?void 0:qe.rmsnorm),i("attention");const u=await Za(t,o?void 0:qe.attentionSeqs);s.attention=u.main,s.attentionPhases=u.phases;let l=[],c={},d={},p=[],f=null;return o&&(i("memory"),l=await no(),i("buffer reuse"),c=await ao(),i("pipeline cache"),d=await oo(),i("command batching"),p=await so()),e.mode==="sustained"&&(i("sustained (30s)"),f=await bo(t,{onSecond:(m,b)=>e.onSecond?.(m,`s${m}: ${b.gflops.toFixed(2)} GFLOPS`)})),pr({diag:r,browser:a,timingMode:t.mode,build:n,tests:s,memory:l,bufferReuse:c,pipelineCache:d,commandBatching:p,sustained:f})}catch(r){const a={matmul:[],vecadd:[],conv2d:[],softmax:[],rmsnorm:[],attention:[],attentionPhases:{}};let n=null;try{n=await Ve()}catch{}if(n&&t)return pr({diag:n,browser:fr(),timingMode:t.mode,build:{id:_e,commit:ut??null,time:Ke??null},tests:a,memory:[],bufferReuse:{},pipelineCache:{},commandBatching:[],sustained:null,suiteError:r.message});throw r}finally{t?.destroy(),ht=!1}}let Q=null,L=!1,Ut=!1,fe=null,Y=localStorage.getItem("aether.kernels-passed")!=="1",Ee=localStorage.getItem("aether.sustained.armed")==="1",Ye=null;const De={sanity:!1,standaloneMatmul:!1,harnessMatmul:!1};function lt(){return De.sanity&&De.standaloneMatmul&&De.harnessMatmul}function Ot(){const e=Q?.querySelector("#btn-correctness");if(!e)return;const t=lt();e.disabled=!t,e.textContent=t?"CORRECTNESS":"CORRECTNESS (LOCKED)"}function E(e,t=""){if(!Q)return;const r=Q.querySelector("#bench-log");if(!r)return;const a=document.createElement("div");a.className=`log-entry ${t}`,a.textContent=e,r.appendChild(a),r.scrollTop=r.scrollHeight}function gr(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function dt(){const e=ra();E(`WEBGPU DEVICE LOST — reason: ${e.reason??"unknown"} — message: ${e.message??""}`,"err"),E("Remaining tests stopped.","err")}function Dt(){if(!Ut)try{const e=T();e.addEventListener("uncapturederror",t=>{const r=t.error;E(`UNCAPTURED GPU ERROR: ${r?.message??"unknown"}`,"err")}),e.lost.then(t=>{E(`WEBGPU DEVICE LOST — reason: ${t.reason} — message: ${t.message}`,"err")}),Ut=!0}catch{}}function Gt(e,t){const r=Q?.querySelector(`#${e}`);if(!r)return;const a=[t.stage?`<div>stage: <b style="color:var(--text)">${A(t.stage)}</b></div>`:"",t.pass?"":t.errorType?`<div>error type: <b style="color:var(--red)">${A(t.errorType)}</b></div>`:"",t.pass?"":t.errorMessage?`<div>error message: <b style="color:var(--red)">${A(t.errorMessage)}</b></div>`:"",...t.notes.map(n=>`<div style="color:var(--text-dim)">${A(n)}</div>`)].join("");r.innerHTML=`
    <div class="card" style="border-color:${t.pass?"var(--green)":"var(--red)"};margin-top:12px">
      <div class="card-header">
        <span class="card-title">${A(t.title)}</span>
        <span class="badge ${t.pass?"badge-pass":"badge-fail"}">${t.pass?"PASS":"FAIL"}</span>
      </div>
      <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${a||'<div style="color:var(--text-dim)">—</div>'}</div>
    </div>
  `}function A(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ir(e){const t=[];for(const r of e.scopeErrors)t.push(`GPU error scope [${r.type}]: ${r.message}`);for(const r of e.uncaptured)t.push(`uncaptured GPU error [${r.type}]: ${r.message}`);return e.lost.reason&&t.push(`device lost — reason: ${e.lost.reason} — message: ${e.lost.message??""}`),t.push(`expected: ${e.expected}`),e.actual!==null&&t.push(`actual: ${e.actual}`),e.exception&&t.push(`exception: ${e.exception}`),t}function yo(e){const t=e.pass?"display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--green);color:var(--green)":"display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--red);color:var(--red)",r=e.pass?`${e.config} — complete`:`${e.config} — stage: ${e.stage} · ${e.errorType??""} · ${e.errorMessage??""}`;return`<span style="${t}" title="${A(r)}">${A(e.config)} ${e.pass?"✓":"✗"}</span>`}function ho(e){const t=[];return t.push(`stage: ${A(e.stage)} · error type: <b style="color:var(--red)">${A(e.errorType??"unknown")}</b>`),e.errorMessage&&t.push(`error: ${A(e.errorMessage)}`),e.nonFiniteIndex>=0&&t.push(`non-finite output at index ${e.nonFiniteIndex}`),e.errorIndex>=0&&e.cpuValue!==null&&e.gpuValue!==null&&t.push(`largest error @ ${e.errorIndex}: cpu=${e.cpuValue.toExponential(4)} gpu=${e.gpuValue.toExponential(4)}`),e.expectedRange&&t.push(`expected range [${e.expectedRange[0].toExponential(3)}, ${e.expectedRange[1].toExponential(3)}]`),e.actualRange&&t.push(`actual range [${e.actualRange[0].toExponential(3)}, ${e.actualRange[1].toExponential(3)}]`),t.map(r=>`<div style="color:var(--red)">${r}</div>`)}function wo(e){const t=Q?.querySelector("#validation-panel");if(!t)return;const r=e.length===6&&e.every(n=>n.pass),a=e.map(n=>{const o=n.cases.filter(i=>!i.pass).flatMap(ho),s=n.pass?"complete":n.details.includes("ABORTED")?"aborted (device lost)":n.cases.find(i=>!i.pass)?.stage??"failed";return`
      <div class="card" style="border-color:${n.pass?"var(--green)":"var(--red)"};margin-top:10px">
        <div class="card-header">
          <span class="card-title">${A(n.name.toUpperCase())}</span>
          <span class="badge ${n.pass?"badge-pass":"badge-fail"}">${n.pass?"PASS":"FAIL"}</span>
        </div>
        <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:4px;word-break:break-all">
          <div>${n.cases.map(yo).join("")||'<span style="color:var(--text-dim)">not run</span>'}</div>
          <div>max error: <b>${n.maxError>=0?n.maxError.toExponential(2):"—"}</b></div>
          <div>execution status: <b>${A(s)}</b></div>
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
    ${a}
  `}function Be(e){const t=e??{pass:!1,maxError:-1,cases:[]};return{pass:t.pass,maxError:t.maxError,cases:t.cases}}function xo(e){return!fe||e.length===0?null:{device:{webgpuAvailable:fe.webgpuAvailable,adapterName:fe.adapterName,adapterVendor:fe.adapterVendor,adapterDevice:fe.adapterDevice,fallbackAdapter:fe.isFallbackAdapter},build:{id:_e,commit:ut??null,time:Ke??null},timestamp:new Date().toISOString(),uncapturedErrors:Dr(),tests:{vectorAdd:Be(e[0]),matmul:Be(e[1]),conv2d:Be(e[2]),softmax:Be(e[3]),rmsNorm:Be(e[4]),attention:Be(e[5])},allPass:e.length===6&&e.every(t=>t.pass)}}function So(e){try{localStorage.setItem("aether.correctness",JSON.stringify(e))}catch{}}function Mo(e){const t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),r=URL.createObjectURL(t),a=document.createElement("a");a.href=r,a.download=`aether-correctness-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`,a.click(),URL.revokeObjectURL(r)}function Eo(e){const t=Q?.querySelector("#report-panel");t&&(t.innerHTML=`
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
        device: ${A(e.device.adapterName)} · ${A(e.device.adapterVendor)} · saved to localStorage
      </div>
    </div>
  `,t.querySelector("#btn-export-json")?.addEventListener("click",()=>Mo(e)),t.querySelector("#btn-reload")?.addEventListener("click",()=>location.reload()))}async function Po(){if(!L){L=!0;try{E("═══ GPU SANITY (standalone) ═══","info");const e=await Oa();De.sanity=e.pass,Ot(),Gt("res-sanity",{title:"GPU SANITY",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:Ir(e)}),E(`GPU SANITY TEST: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&E(`  error type: ${e.errorType}`,"err"),e.errorMessage&&E(`  error message: ${e.errorMessage}`,"err")}catch(e){E(`ERROR: ${e.message}`,"err")}finally{L=!1}}}async function Ao(){if(!L){L=!0;try{E("═══ STANDALONE MATMUL (64×64) ═══","info");const e=await Da();De.standaloneMatmul=e.pass,Ot(),Gt("res-standalone",{title:"STANDALONE MATMUL",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:Ir(e)}),E(`STANDALONE MATMUL: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&E(`  error type: ${e.errorType}`,"err"),e.errorMessage&&E(`  error message: ${e.errorMessage}`,"err")}catch(e){E(`ERROR: ${e.message}`,"err")}finally{L=!1}}}async function Co(){if(!L){L=!0;try{await Ve(),Dt(),E("═══ HARNESS MATMUL (runGpuTest) ═══","info");const e=await Gr();De.harnessMatmul=e.pass,Ot();const t=e.cases.map(r=>`${r.config}:${r.pass?"PASS":"FAIL"}`).join(" ");Gt("res-harness",{title:"HARNESS MATMUL",pass:e.pass,stage:e.pass?"complete":e.cases.find(r=>!r.pass)?.stage??"runGpuTest",errorType:e.pass?null:e.cases.find(r=>!r.pass)?.errorType??null,errorMessage:e.pass?null:e.cases.find(r=>!r.pass)?.errorMessage??e.details,notes:[`cases: ${t||"—"}`,`max error: ${e.maxError>=0?e.maxError.toExponential(2):"—"}`]}),E(`HARNESS MATMUL: ${e.pass?"PASS":"FAIL"} — ${e.details||""}`,e.pass?"ok":"err"),Ge()&&dt()}catch(e){E(`ERROR: ${e.message}`,"err"),Ge()&&dt()}finally{L=!1}}}async function Uo(){if(!L){if(!lt()){E("CORRECTNESS LOCKED — run GPU SANITY, STANDALONE MATMUL and HARNESS MATMUL first.","warn");return}L=!0;try{fe=await Ve(),Dt(),Dr(),Or(),E("═══ AETHER KERNEL VALIDATION (sequential, one test at a time) ═══","info");const t=await Ba(a=>{E(`${a.pass?"✓":"✗"} ${a.name} — ${a.details}`,a.pass?"ok":"err")});wo(t);const r=t.length===6&&t.every(a=>a.pass);if(E(r?"ALL KERNELS PASSED":"SOME KERNELS FAILED",r?"ok":"err"),r)$o(),E("Performance benchmarks UNLOCKED.","ok");else if(!Y){Y=!0;try{localStorage.removeItem("aether.kernels-passed")}catch{}ft(),E("Performance benchmarks RE-LOCKED (a validated kernel failed).","err")}if(Ge())dt(),E("Requires runtime reinitialization — reload the page (or re-run up the gate diagnostics) before retrying.","err");else{const a=xo(t);a&&(So(a),Eo(a),E("Correctness report saved locally (aether.correctness).","info"))}}catch(e){E(`ERROR: ${e.message}`,"err"),Ge()&&dt()}finally{L=!1}}}function $o(){Y=!1;try{localStorage.setItem("aether.kernels-passed","1")}catch{}ft()}function re(e){return Number.isFinite(e)?e<1?`${(e*1e3).toFixed(1)} µs`:e<1e3?`${e.toFixed(2)} ms`:`${(e/1e3).toFixed(2)} s`:"—"}function qr(e){return!e||!Number.isFinite(e.value)?"—":`${e.value.toFixed(1)} ${e.unit}`}function Hr(e){return e==="GPU_TIMESTAMP"?"GPU TIMESTAMP":e==="END_TO_END"?"END-TO-END":e}function Bo(e){return!e||e.length===0?'<tr><td colspan="7" style="color:var(--text-dim)">not run</td></tr>':e.map(t=>`<tr ${t.error?'style="color:var(--red)"':""}>
          <td class="td-l">${A(t.size)}</td>
          <td>${Hr(t.timingMode)}</td>
          <td>${re(t.medianMs)}</td>
          <td>${re(t.averageMs)}</td>
          <td>${re(t.minMs)}</td>
          <td>${re(t.maxMs)}</td>
          <td>${re(t.stdDevMs)}</td>
          <td>${qr(t.throughput)}</td>
        </tr>`).join("")}function Se(e,t){return`<div class="perf-block">
    <div class="perf-block-title">${A(e)} <span class="badge badge-info" style="float:right">${t?t.length:0} run</span></div>
    <table class="perf-table">
      <thead><tr>
        <th class="th-l">size</th><th>mode</th><th>median</th><th>avg</th><th>min</th><th>max</th><th>stddev</th><th>throughput</th>
      </tr></thead>
      <tbody>${Bo(t)}</tbody>
    </table>
  </div>`}function et(e,t){return t?`<div class="perf-block">
    <div class="perf-block-title">${A(e)} <span class="badge badge-info" style="float:right">${t.timingMode}</span></div>
    <table class="perf-table">
      <thead><tr><th class="th-l">configuration</th><th>per-op</th><th>total</th><th>iterations</th></tr></thead>
      <tbody>
        <tr>
          <td class="td-l">${A(t.name)} <span style="color:var(--text-dim)">· ${A(t.size)}</span></td>
          <td>${re(t.perOpMs)}</td>
          <td>${re(t.totalMs)}</td>
          <td>${t.iterations}</td>
        </tr>
      </tbody>
    </table>
    ${t.note?`<div style="font-size:11px;color:var(--text-dim)">${A(t.note)}</div>`:""}
  </div>`:""}function To(e){const t=Object.entries(e.tests.attentionPhases);return t.length===0?"":`<div class="perf-block">
    <div class="perf-block-title">Attention phases (per sequence length) <span class="badge badge-info" style="float:right">split</span></div>
    ${t.map(([a,n])=>`<div class="perf-sub">${A(a)}</div>${Se("",n)}`).join("")||'<div style="color:var(--text-dim)">not run</div>'}
  </div>`}function ko(e){return`<tr style="color:${e.success?"var(--green)":"var(--red)"}">
    <td class="td-l">${e.requestedMiB} MiB</td>
    <td>${e.created?"allocated":"skipped"}</td>
    <td>${e.success?"OK":"FAILED"}</td>
    <td style="color:var(--text-dim)">${A(e.note??"")}</td>
  </tr>`}function Oo(e){if(!e)return"";const t=e.samples.map(r=>`<div class="pad-bar" title="s${r.second}: ${r.gflops.toFixed(2)} GFLOPS" style="height:${Math.max(8,Math.min(80,100-r.gflops))}px"></div>`).join("");return`<div class="perf-block">
    <div class="perf-block-title">Sustained 30s — MatMul 256 ${e.throttled?'<span class="badge badge-fail">THROTTLED</span>':'<span class="badge badge-pass">STABLE</span>'}</div>
    <div style="display:flex;align-items:flex-end;gap:2px;height:80px;margin:8px 0">${t}</div>
    <table class="perf-table">
      <tbody>
        <tr><td class="td-l">first 10s avg</td><td>${e.first10sAvgGflops.toFixed(2)} GFLOPS</td></tr>
        <tr><td class="td-l">last 10s avg</td><td>${e.last10sAvgGflops.toFixed(2)} GFLOPS</td></tr>
        <tr><td class="td-l">drop</td><td>${e.dropPct.toFixed(1)}%</td></tr>
        <tr><td class="td-l">overall avg / min / max</td><td>${e.avgGflops.toFixed(2)} / ${e.minGflops.toFixed(2)} / ${e.maxGflops.toFixed(2)} GFLOPS</td></tr>
        <tr><td class="td-l">thermal before / after</td><td>${A(e.thermalBefore)} → ${A(e.thermalAfter)}</td></tr>
        <tr><td class="td-l">timing</td><td>${e.timingMode}</td></tr>
      </tbody>
    </table>
  </div>`}function Do(e){const t=Q?.querySelector("#perf-results");if(!t)return;const r=co(e),a=e.commandBatching.map(o=>`<tr><td class="td-l">${A(o.name)}</td><td>${re(o.totalMedianMs)}</td><td>${re(o.perDispatchMs)}</td><td>${o.timingMode}</td></tr>`).join(""),n=e.suiteError?`<div class="card" style="border-color:var(--red);margin-top:12px"><div class="card-header"><span class="card-title">SUITE ABORTED</span><span class="badge badge-fail">VALIDATION FAILURE</span></div><div style="font-size:12px;font-family:var(--mono);color:var(--red);margin-top:8px;word-break:break-all">${A(e.suiteError)}</div></div>`:"";t.innerHTML=n+`
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
        <div>device: <b style="color:var(--text)">${A(e.device.adapterName)}</b> · ${A(e.device.adapterVendor)} ${e.device.isFallbackAdapter?"(software fallback)":""}</div>
        <div>browser: <b style="color:var(--text)">${A(e.browser.platform)}</b> · thermal state: <b style="color:var(--text)">${A(e.browser.thermalState)}</b> · GPU utilization: <b style="color:var(--text)">${A(e.browser.gpuUtilization)}</b></div>
        <div>tested ${new Date(e.timestamp).toLocaleString()} · build ${A(String(e.build.id))}</div>
      </div>
    </div>
    ${Se("Matrix Multiply",e.tests.matmul)}
    ${Se("Vector Add",e.tests.vecadd)}
    ${Se("Convolution 3×3",e.tests.conv2d)}
    ${Se("Softmax",e.tests.softmax)}
    ${Se("RMSNorm",e.tests.rmsnorm)}
    ${Se("Attention (single pass)",e.tests.attention)}
    ${To(e)}
    ${e.memory.length?`<div class="perf-block"><div class="perf-block-title">Largest safe tested tensor</div><table class="perf-table"><thead><tr><th class="th-l">requested</th><th>state</th><th>result</th><th>note</th></tr></thead><tbody>${e.memory.map(ko).join("")}</tbody></table></div>`:""}
    ${et("Buffer allocation vs reuse",e.bufferReuse.allocateDestroy)}
    ${et("",e.bufferReuse.bufferReuse)}
    ${et("Pipeline cache vs recreate",e.pipelineCache.recreate)}
    ${et("",e.pipelineCache.cached)}
    ${e.commandBatching.length?`<div class="perf-block"><div class="perf-block-title">Command submission batching</div><table class="perf-table"><thead><tr><th class="th-l">configuration</th><th>total (8 ops)</th><th>per dispatch</th><th>mode</th></tr></thead><tbody>${a}</tbody></table></div>`:""}
    ${Oo(e.sustained)}
    <div class="perf-block">
      <div class="perf-block-title">Interpretation</div>
      <div style="font-size:12px;line-height:1.5;color:var(--text);margin-top:6px">${r.map(o=>`<div>• ${A(o)}</div>`).join("")}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Interpretation is data-driven from the samples above — no fabricated GPU utilization, thermal state or theoretical maxima.</div>
    </div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn" id="btn-export-perf">EXPORT JSON</button>
      <button class="btn btn-outline" id="btn-copy-perf">COPY RESULTS</button>
    </div>
  `,t.querySelector("#btn-export-perf")?.addEventListener("click",()=>Go()),t.querySelector("#btn-copy-perf")?.addEventListener("click",()=>No())}function Go(){if(!Ye)return;const e=new Blob([JSON.stringify(Ye,null,2)],{type:"application/json"}),t=URL.createObjectURL(e),r=document.createElement("a");r.href=t,r.download=`aether-gpu-benchmark-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`,r.click(),URL.revokeObjectURL(t)}function No(){if(!Ye)return;const e=Ye,t=[];t.push(`AETHER GPU BENCHMARK — ${e.device.adapterName} (${e.device.adapterVendor})`),t.push(`timing mode: ${e.timingMode}`),t.push(`thermal: ${e.browser.thermalState} · GPU utilization: ${e.browser.gpuUtilization}`),t.push(e.suiteError?`SUITE ERROR: ${e.suiteError}`:""),t.push("");const r=(a,n)=>{t.push(a);for(const o of n)t.push(`  ${o.size} — ${re(o.medianMs)} median (${Hr(o.timingMode)})${o.throughput?` · ${qr(o.throughput)}`:""}`);t.push("")};r("matmul",e.tests.matmul),r("vecadd",e.tests.vecadd),r("conv2d",e.tests.conv2d),r("softmax",e.tests.softmax),r("rmsnorm",e.tests.rmsnorm),r("attention",e.tests.attention);for(const[a,n]of Object.entries(e.tests.attentionPhases))r(`attention phases ${a}`,n);e.sustained&&t.push(`sustained 30s: avg ${e.sustained.avgGflops.toFixed(2)} GFLOPS, throttled=${e.sustained.throttled}, drop=${e.sustained.dropPct.toFixed(1)}%`),navigator.clipboard?.writeText(t.join(`
`)).catch(()=>{}),E("Benchmark summary copied to clipboard.","ok")}function ft(){const e=Q?.querySelector("#btn-perf-quick"),t=Q?.querySelector("#btn-perf-full"),r=Q?.querySelector("#btn-perf-sustained"),a=Q?.querySelector("#chk-sustained");e&&(e.disabled=Y,e.textContent=Y?"QUICK BENCHMARK (LOCKED)":"QUICK BENCHMARK"),t&&(t.disabled=Y,t.textContent=Y?"FULL BENCHMARK (LOCKED)":"FULL BENCHMARK"),a&&(a.checked=Ee),r&&(r.disabled=Y||!Ee,r.textContent=Y?"SUSTAINED (LOCKED)":Ee?"SUSTAINED 30s":"SUSTAINED (ARM FIRST)")}function wt(e){if(L){E("A benchmark is already running — wait for it to finish.","warn");return}if(e==="sustained"&&!Ee){E('SUSTAINED is not armed — confirm "Enable sustained 30s run" first.',"warn");return}L=!0;try{const t=e==="quick"?"QUICK":e==="full"?"FULL":"SUSTAINED";E(`═══ AETHER GPU PERFORMANCE — ${t} BENCHMARK ═══`,"info"),vo({mode:e,onProgress:r=>E(`  ${r}...`,"info"),onSecond:(r,a)=>E(`  ${a}`,"info")}).then(r=>{Ye=r,Do(r),E(r.suiteError?`SUITE ABORTED: ${r.suiteError}`:`${t} benchmark complete — mode: ${r.timingMode}`,r.suiteError?"err":"ok"),r.suiteError&&E("STOP — a validated kernel failed. Fix correctness before benchmarking.","err")}).catch(r=>E(`ERROR: ${r.message}`,"err")).finally(()=>{L=!1})}catch(t){L=!1,E(`ERROR: ${t.message}`,"err")}}function _o(e){const t=e.querySelector("#perf-panel");t&&(t.innerHTML=`
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
        <input type="checkbox" id="chk-sustained" ${Ee?"checked":""}>
        enable SUSTAINED 30s run (continuous MatMul load, per-second samples, thermal before/after)
      </label>
    </div>
    <div id="perf-results"></div>
  `,e.querySelector("#btn-perf-quick")?.addEventListener("click",()=>wt("quick")),e.querySelector("#btn-perf-full")?.addEventListener("click",()=>wt("full")),e.querySelector("#btn-perf-sustained")?.addEventListener("click",()=>wt("sustained")),e.querySelector("#chk-sustained")?.addEventListener("change",r=>{Ee=r.target.checked;try{localStorage.setItem("aether.sustained.armed",Ee?"1":"0")}catch{}ft()}),ft())}function Ro(e){const t=e.querySelector("#diag-panel");if(!t)return;const r=[["location.href",location.href],["location.hash",location.hash],["location.protocol",location.protocol],["window.isSecureContext",String(window.isSecureContext)],["navigator.userAgent",navigator.userAgent],["AETHER_BUILD_ID",_e],["Built at",Ke||"n/a"],["Benchmark code revision",_e]];t.innerHTML=r.map(([a,n])=>`<div style="font-size:11px;font-family:var(--mono);word-break:break-all">
        <span style="color:var(--text-dim)">${a}:</span> <b style="color:var(--text)">${n}</b>
      </div>`).join("")}function Fo(e){Q=e,Ut=!1,e.innerHTML=`
    <h2>GPU Compute Benchmark — Isolated Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Three independent checks — each requests its own GPU device. Kick the performance gates (GPU SANITY → STANDALONE MATMUL → HARNESS MATMUL → CORRECTNESS) to unlock the GPU performance benchmarks below.
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
    <div id="perf-panel"></div>

    <div class="log" id="bench-log"></div>

    <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;font-family:var(--mono);color:var(--text-dim)">
      <div>AETHER BUILD: <b id="build-id" style="color:var(--text)">${_e}</b></div>
      <div>Git commit: <b id="build-commit" style="color:var(--text)">${ut??"unavailable"}</b></div>
      <div>Build time: <b id="build-time" style="color:var(--text)">${Ke||"unavailable"}</b></div>
      <div>Environment: GitHub Pages</div>
    </div>
  `,Ro(e),e.querySelector("#btn-sanity")?.addEventListener("click",Po),e.querySelector("#btn-standalone")?.addEventListener("click",Ao),e.querySelector("#btn-harness")?.addEventListener("click",Co);const t=e.querySelector("#btn-correctness");t&&(t.addEventListener("click",Uo),t.disabled=!lt(),t.textContent=lt()?"CORRECTNESS":"CORRECTNESS (LOCKED)"),_o(e);const r=a=>{a.preventDefault()};window.addEventListener("error",r),window.addEventListener("unhandledrejection",r),Ve().then(a=>{fe=a,Dt();const n=e.querySelector("#device-badge"),o=e.querySelector("#device-info");n&&(n.textContent="WEBGPU READY",n.className="badge badge-pass"),o&&(o.innerHTML=`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
          <span>Adapter:</span><span style="color:var(--text)">${a.adapterName}</span>
          <span>Vendor:</span><span style="color:var(--text)">${a.adapterVendor}</span>
          <span>Features:</span><span style="color:var(--text)">${a.adapterFeatures.length}</span>
          <span>Max Buffer:</span><span style="color:var(--text)">${gr(a.maxBufferSize)}</span>
          <span>Max Storage:</span><span style="color:var(--text)">${gr(a.maxStorageBufferBindingSize)}</span>
          <span>Workgroup X:</span><span style="color:var(--text)">${a.maxComputeWorkgroupSizeX}</span>
          <span>Invocations/wg:</span><span style="color:var(--text)">${a.maxComputeInvocationsPerWorkgroup}</span>
          <span>Timestamp Query:</span><span style="color:var(--text)">${a.timestampQuerySupport?"YES":"NO"}</span>
          <span>Preferred Format:</span><span style="color:var(--text)">${a.preferredCanvasFormat??"N/A"}</span>
          <span>Fallback:</span><span style="color:var(--text)">${a.isFallbackAdapter?"YES (software)":"NO (hardware)"}</span>
        </div>
      `)}).catch(a=>{const n=e.querySelector("#device-badge");n&&(n.textContent="WEBGPU UNAVAILABLE",n.className="badge badge-fail"),E(`WEBGPU not available: ${a.message}`,"err")})}const Lo=Object.freeze(Object.defineProperty({__proto__:null,render:Fo},Symbol.toStringTag,{value:"Module"}));function zo(e){const t=e.toLowerCase();return t.includes("aether")||t==="external-cache"||t.startsWith("workbox-")||t.includes("webgpu")}async function jr(){if("serviceWorker"in navigator)try{const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(t=>t.unregister().catch(()=>{})))}catch{}}async function Vr(){if("caches"in window)try{const e=await caches.keys();await Promise.all(e.filter(zo).map(t=>caches.delete(t).catch(()=>{})))}catch{}}async function Wo(){try{const e=[],t=indexedDB;if(t.databases){const r=await t.databases();for(const a of r)a.name&&a.name.toLowerCase().includes("aether")&&e.push(a.name)}else e.push("aether-gpu-benchmark");for(const r of e)await new Promise(a=>{const n=indexedDB.deleteDatabase(r);n.onsuccess=()=>a(),n.onerror=()=>a(),n.onblocked=()=>a()})}catch{}}async function Io(){await jr(),await Vr()}async function qo(){await jr(),await Vr(),await Wo()}const Nt=[{id:"gpubench",label:"GPU Bench",module:Lo},{id:"device",label:"Device Test",module:en},{id:"webgpudiag",label:"WebGPU Diag",module:Zn},{id:"model",label:"Model Test",module:dn},{id:"tensor",label:"Tensor Bench",module:Yn},{id:"image",label:"Image Test",module:pn},{id:"video",label:"Video Test",module:vn},{id:"diag",label:"Diagnostics",module:xn}];let Kr="gpubench";function br(){const e=window.location.hash.replace("#","");return Nt.some(t=>t.id===e)?e:e==="diagnostics/webgpu"||e==="webgpu"?"webgpudiag":"gpubench"}function xt(e){Kr=e,window.location.hash=e;const t=document.getElementById("nav"),r=document.getElementById("screen");t.querySelectorAll("button").forEach(n=>{n.classList.toggle("active",n.dataset.screen===e)});const a=Nt.find(n=>n.id===e);a&&a.module.render(r)}function Ho(){const e=document.getElementById("app");e.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const t=document.getElementById("nav");document.getElementById("screen"),Nt.forEach(a=>{const n=document.createElement("button");n.textContent=a.label,n.dataset.screen=a.id,n.addEventListener("click",()=>xt(a.id)),t.appendChild(n)});const r=br();xt(r),window.addEventListener("hashchange",()=>{const a=br();a!==Kr&&xt(a)})}function jo(){const e=document.getElementById("app");e.innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;text-align:center;gap:16px;padding:24px">
      <h2 style="color:var(--green, #22c55e);margin:0">AETHER CACHE RESET COMPLETE</h2>
      <p style="color:var(--text-dim, #9ca3af);margin:0">Please reload AETHER normally.</p>
      <button id="btn-reset-reload" class="btn">Reload AETHER</button>
    </div>
  `,e.querySelector("#btn-reset-reload")?.addEventListener("click",()=>{history.replaceState(null,"",window.location.pathname+window.location.search),window.location.reload()})}async function vr(){if(window.location.hash==="#reset"){await qo(),jo();return}await Io(),Ho()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>void vr()):vr();
