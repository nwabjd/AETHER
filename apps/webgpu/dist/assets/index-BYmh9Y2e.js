(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();function Vt(e){let t="Unknown",r="Unknown",a="Unknown",n="Unknown";const o=e.match(/OS (\d+)_(\d+)/);o&&(a="iOS",n=`${o[1]}.${o[2]}`);const s=e.match(/Mac OS X (\d+)[_.](\d+)/);if(s&&(a="macOS",n=`${s[1]}.${s[2]}`),e.includes("Windows")){a="Windows";const c=e.match(/Windows NT (\d+\.\d+)/);c&&(n=c[1])}if(e.includes("Android")){a="Android";const c=e.match(/Android (\d+[\.\d]*)/);c&&(n=c[1])}if(e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")){t="Safari";const c=e.match(/Version\/(\d+[\.\d]*)/);c&&(r=c[1])}if(e.includes("Chrome")&&!e.includes("Edg")){t="Chrome";const c=e.match(/Chrome\/(\d+[\.\d]*)/);c&&(r=c[1])}if(e.includes("Edg/")){t="Edge";const c=e.match(/Edg\/(\d+[\.\d]*)/);c&&(r=c[1])}if(e.includes("Firefox")){t="Firefox";const c=e.match(/Firefox\/(\d+[\.\d]*)/);c&&(r=c[1])}return{browserName:t,browserVersion:r,osName:a,osVersion:n}}function Yt(e){return!!(e.includes("FBAN")||e.includes("FBIOS")||e.includes("Twitter")||e.includes("Instagram")||e.includes("Line/")||e.includes("WeChat")||e.includes("MicroMessenger")||e.includes("CocoaPods")||e.includes("wv)")||e.includes("Electron")||e.includes("; wv)"))}function Xt(e){return e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")}async function Ne(){const e=navigator.userAgent,t=Vt(e),r=t.osName==="iOS",a=Xt(e),n=Yt(e),o=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,s={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:e,platform:navigator.platform,isIOS:r,isSafari:a,isWebView:n,isStandalone:o,browserName:t.browserName,browserVersion:t.browserVersion,osName:t.osName,osVersion:t.osVersion},i={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(n)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:s,gpu:i};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:r?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:s,gpu:i};if(!navigator.gpu){let c="navigator.gpu is undefined. WebGPU API is not exposed.",u="";if(r){if(parseInt(t.osVersion.split(".")[0],10)<26)return c=`iOS ${t.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,u="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:c,recommendation:u,environment:s,gpu:i};if(t.browserName!=="Safari")return c=`Running ${t.browserName} on iOS ${t.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,u="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:c,recommendation:u,environment:s,gpu:i}}return t.osName==="macOS"&&parseInt(t.osVersion.split(".")[0],10)<14?(c=`macOS ${t.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,u="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:c,recommendation:u,environment:s,gpu:i}):(u="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:c,recommendation:u,environment:s,gpu:i})}try{const c=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!c){i.adapterError="requestAdapter() returned null";let d="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",f="";return r?parseInt(t.osVersion.split(".")[0],10)>=26&&(d=`iOS ${t.osVersion} with Safari ${t.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,f="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(d="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",f="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):f="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:d,recommendation:f,environment:s,gpu:i}}i.adapterName=c.name??"Unknown GPU",i.adapterVendor=c.vendor??"Unknown",i.adapterDevice=c.device??"Unknown",i.isFallbackAdapter=c.isFallbackAdapter??!1;const u=[];for(const d of c.features)u.push(d.replace(/-/g," ").replace(/\b\w/g,f=>f.toUpperCase()));i.features=u;const l=c.limits;i.limits={maxBufferSize:l.maxBufferSize,maxTextureDimension1D:l.maxTextureDimension1D,maxTextureDimension2D:l.maxTextureDimension2D,maxTextureDimension3D:l.maxTextureDimension3D,maxComputeWorkgroupStorageSize:l.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:l.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:l.maxStorageBufferBindingSize,maxUniformBufferBindingSize:l.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:l.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:l.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:l.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:l.maxComputeWorkgroupsPerDimension,maxColorAttachments:l.maxColorAttachments,minStorageBufferOffsetAlignment:l.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:l.minUniformBufferOffsetAlignment};try{(await c.requestDevice({requiredLimits:{}})).destroy()}catch(d){return i.deviceError=d.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${i.adapterName}) but requestDevice() failed: ${d.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:s,gpu:i}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${i.adapterName}.`,recommendation:"No action needed.",environment:s,gpu:i}}catch(c){return i.adapterError=c.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${c.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:s,gpu:i}}}function $t(e){const t=[];if(t.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),t.push(""),t.push(`STATUS: ${e.statusLabel}`),t.push(`CASE: ${e.case}`),t.push(`REASON: ${e.reason}`),t.push(`RECOMMENDATION: ${e.recommendation}`),t.push(""),t.push("── ENVIRONMENT ──"),t.push(`  URL: ${e.environment.url}`),t.push(`  Protocol: ${e.environment.protocol}`),t.push(`  Hostname: ${e.environment.hostname}`),t.push(`  Secure Context: ${e.environment.isSecureContext}`),t.push(`  iOS: ${e.environment.isIOS}`),t.push(`  Safari: ${e.environment.isSafari}`),t.push(`  WebView: ${e.environment.isWebView}`),t.push(`  Standalone PWA: ${e.environment.isStandalone}`),t.push(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`),t.push(`  OS: ${e.environment.osName} ${e.environment.osVersion}`),t.push(`  Platform: ${e.environment.platform}`),t.push(`  User Agent: ${e.environment.userAgent}`),t.push(""),t.push("── WEBGPU ──"),t.push(`  navigator.gpu exists: ${e.gpu.navigatorGpuExists}`),e.gpu.adapterName&&t.push(`  Adapter: ${e.gpu.adapterName}`),e.gpu.adapterVendor&&t.push(`  Vendor: ${e.gpu.adapterVendor}`),e.gpu.adapterDevice&&t.push(`  Device: ${e.gpu.adapterDevice}`),e.gpu.adapterError&&t.push(`  Adapter Error: ${e.gpu.adapterError}`),e.gpu.deviceError&&t.push(`  Device Error: ${e.gpu.deviceError}`),t.push(`  Fallback adapter: ${e.gpu.isFallbackAdapter}`),e.gpu.features.length>0){t.push(`  Features (${e.gpu.features.length}):`);for(const r of e.gpu.features)t.push(`    ${r}`)}if(e.gpu.limits){t.push("  Limits:");for(const[r,a]of Object.entries(e.gpu.limits))t.push(`    ${r}: ${typeof a=="number"?a.toLocaleString():a}`)}return t.push(""),t.push(`Timestamp: ${new Date().toISOString()}`),t.join(`
`)}function Me(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function ie(){const e=await Ne();if(!e.ready||!e.gpu.adapterName)return null;const t=e.gpu.limits;return{available:!0,adapterName:e.gpu.adapterName,adapterVendor:e.gpu.adapterVendor,adapterDevice:e.gpu.adapterDevice,features:e.gpu.features,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:e.gpu.isFallbackAdapter,featuresMap:new Set(e.gpu.features),diagnostic:e}}async function ue(e,t=[]){const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("Failed to re-acquire GPU adapter");const a=await r.requestDevice({requiredFeatures:t.filter(n=>e.featuresMap.has(n)),requiredLimits:{}});return a.lost.then(n=>{console.error("WebGPU device lost:",n.message)}),a}function Qt(e){const t=e.environment,r=e.gpu;let a="badge-fail";e.case==="D"?a="badge-pass":(e.case==="B"||e.case==="C")&&(a="badge-warn");let n=`
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
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${Me(r.limits.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${r.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${r.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${r.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${Me(r.limits.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${Me(r.limits.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${Me(r.limits.maxComputeWorkgroupStorageSize)}</span></div>
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
    `),n}function Zt(e){e.innerHTML=`
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;const t=e.querySelector("#device-status"),r=e.querySelector("#device-info");Ne().then(a=>{a.ready?t.innerHTML=`
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `:t.innerHTML="",r.innerHTML=Qt(a)})}const Jt=Object.freeze(Object.defineProperty({__proto__:null,render:Zt},Symbol.toStringTag,{value:"Module"}));let k=class Et{buffer;shape;dtype;size;device;constructor(t,r,a="f32"){this.device=t,this.shape=[...r],this.dtype=a,this.size=r.reduce((s,i)=>s*i,1);const n=a==="f32"?4:a==="f16"?2:4;this.buffer=t.createBuffer({size:this.size*n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(a==="f32"?new Float32Array(this.buffer.getMappedRange()):a==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(t,r,a){const n=new Et(t,a,r instanceof Float32Array?"f32":"i32");return t.queue.writeBuffer(n.buffer,0,r.buffer),n}async readback(){const t=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r=this.device.createCommandEncoder();r.copyBufferToBuffer(this.buffer,0,t,0,this.buffer.size),this.device.queue.submit([r.finish()]),await t.mapAsync(GPUMapMode.READ);const a=new Float32Array(t.getMappedRange().slice(0));return t.unmap(),t.destroy(),a}destroy(){this.buffer.destroy()}};async function he(e,t,r=50,a){const n=[];for(let u=0;u<Math.min(5,r);u++)await t();for(let u=0;u<r;u++){const l=performance.now();await t(),await Tt?.queue.onSubmittedWorkDone();const d=performance.now();n.push(d-l)}n.sort((u,l)=>u-l);const o=n.reduce((u,l)=>u+l,0)/n.length,s=n[0],i=n[n.length-1],c={name:e,avgMs:o,minMs:s,maxMs:i,iterations:r};if(a){const l=a/(o/1e3)/1e9;c.gflops=l,c.throughput=`${l.toFixed(2)} GFLOPS`}return c}let Tt=null;function ce(e){Tt=e}function xe(e){const t=[`${e.name}: ${e.avgMs.toFixed(2)} ms avg`,`(${e.minMs.toFixed(2)} – ${e.maxMs.toFixed(2)} ms)`,`[${e.iterations} iterations]`];return e.throughput&&t.push(e.throughput),t.join(" ")}const Oe=`
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
`,er=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= uniforms.N) { return; }
  data[i] = max(data[i], 0.0);
}
`,tr=`
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
`,rr=`
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
`,nr=`
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
`,ar=`
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
`;let y=null,fe=null;function T(e,t=""){if(!fe)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,fe.appendChild(r),fe.scrollTop=fe.scrollHeight}async function st(){T("═══ TINY NEURAL NETWORK TEST ═══","info"),T("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),T("");const e=await ie();if(!e)return T("WebGPU not available","err"),!1;y=await ue(e),ce(y);const t=performance.now(),r=k.fromData(y,new Float32Array([1,.5,-.3,.8]),[4]),a=k.fromData(y,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),n=k.fromData(y,new Float32Array([.1,-.1,.2]),[3]),o=new ArrayBuffer(12),s=new Uint32Array(o);s[0]=1,s[1]=3,s[2]=4;const i=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:y.createShaderModule({code:Oe}),entryPoint:"main"}}),u=y.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(u,0,o);const l=new k(y,[1,3]),d=y.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:a.buffer}},{binding:3,resource:{buffer:l.buffer}}]});let f=y.createCommandEncoder(),p=f.beginComputePass();p.setPipeline(c),p.setBindGroup(0,d),p.dispatchWorkgroups(1,1,1),p.end(),y.queue.submit([f.finish()]),T(`  input[4]:  [${Array.from(await r.readback()).map(_=>_.toFixed(2)).join(", ")}]`,""),T("  W1[4×3]:   4 rows × 3 cols",""),T("  Matmul result: computing...","");const g=await l.readback();T(`  h1 = input @ W1: [${Array.from(g).map(_=>_.toFixed(3)).join(", ")}]`,"ok");for(let _=0;_<3;_++)g[_]+=[.1,-.1,.2][_];y.queue.writeBuffer(l.buffer,0,g.buffer),T(`  h1 + bias:       [${Array.from(g).map(_=>_.toFixed(3)).join(", ")}]`,"ok");const m=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),b=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[m]}),compute:{module:y.createShaderModule({code:er}),entryPoint:"main"}}),v=new ArrayBuffer(4);new Uint32Array(v)[0]=3;const x=y.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(x,0,v);const S=y.createBindGroup({layout:m,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:l.buffer}}]});f=y.createCommandEncoder(),p=f.beginComputePass(),p.setPipeline(b),p.setBindGroup(0,S),p.dispatchWorkgroups(1,1,1),p.end(),y.queue.submit([f.finish()]);const B=await l.readback();T(`  ReLU(h1):         [${Array.from(B).map(_=>_.toFixed(3)).join(", ")}]`,"ok");const w=k.fromData(y,new Float32Array([.7,-.3,.5]),[3,1]),A=new k(y,[1,1]),G=new ArrayBuffer(12),M=new Uint32Array(G);M[0]=1,M[1]=1,M[2]=3;const E=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),W=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[E]}),compute:{module:y.createShaderModule({code:Oe}),entryPoint:"main"}}),ee=y.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(ee,0,G);const le=y.createBindGroup({layout:E,entries:[{binding:0,resource:{buffer:ee}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:w.buffer}},{binding:3,resource:{buffer:A.buffer}}]});f=y.createCommandEncoder(),p=f.beginComputePass(),p.setPipeline(W),p.setBindGroup(0,le),p.dispatchWorkgroups(1,1,1),p.end(),y.queue.submit([f.finish()]);const Be=await A.readback(),Pe=(performance.now()-t).toFixed(1);return T(`  Final output: ${Be[0].toFixed(4)}`,"ok"),T(`  Total pipeline: ${Pe} ms`,"ok"),T("",""),T("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),r.destroy(),a.destroy(),n.destroy(),l.destroy(),w.destroy(),A.destroy(),u.destroy(),ee.destroy(),x.destroy(),y.destroy(),!0}async function or(){T("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const e=await ie();if(!e)return null;y=await ue(e),ce(y);const t=[64,128,256,512],r=[];for(const a of t){const n=k.fromData(y,new Float32Array(a*a).fill(1),[a,a]),o=k.fromData(y,new Float32Array(a*a).fill(.5),[a,a]),s=new k(y,[a,a]),i=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:y.createShaderModule({code:Oe}),entryPoint:"main"}}),u=new ArrayBuffer(12),l=new Uint32Array(u);l[0]=a,l[1]=a,l[2]=a;const d=await he(`${a}×${a} matmul`,async()=>{const f=y.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(f,0,u);const p=y.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:s.buffer}}]}),g=y.createCommandEncoder(),m=g.beginComputePass();m.setPipeline(c),m.setBindGroup(0,p);const b=Math.ceil(a/16);m.dispatchWorkgroups(b,b,1),m.end(),y.queue.submit([g.finish()]),f.destroy()},30,2*a*a*a);r.push(d),T(xe(d),"ok"),n.destroy(),o.destroy(),s.destroy()}return y.destroy(),r[r.length-1]}async function sr(){T("═══ CONVOLUTION BENCHMARK ═══","info");const e=await ie();if(!e)return null;y=await ue(e),ce(y);const t=1,r=3,a=32,n=32,o=8,s=3,i=3,c=a-s+1,u=n-i+1,l=k.fromData(y,new Float32Array(t*r*a*n).fill(.5),[t,r,a,n]),d=k.fromData(y,new Float32Array(o*r*s*i).fill(.1),[o,r,s,i]),f=new k(y,[t,o,c,u]),p=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),g=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[p]}),compute:{module:y.createShaderModule({code:tr}),entryPoint:"main"}}),m=new ArrayBuffer(36),b=new Uint32Array(m);b[0]=t,b[1]=r,b[2]=a,b[3]=n,b[4]=o,b[5]=s,b[6]=i,b[7]=c,b[8]=u;const v=await he(`Conv2D ${t}×${r}×${a}×${n} k=${s}→${o}×${c}×${u}`,async()=>{const x=y.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(x,0,m);const S=y.createBindGroup({layout:p,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:d.buffer}},{binding:3,resource:{buffer:f.buffer}}]}),B=y.createCommandEncoder(),w=B.beginComputePass();w.setPipeline(g),w.setBindGroup(0,S),w.dispatchWorkgroups(t,o,1),w.end(),y.queue.submit([B.finish()]),x.destroy()},20,2*t*o*r*s*i*c*u);return T(xe(v),"ok"),l.destroy(),d.destroy(),f.destroy(),y.destroy(),v}async function ir(){T("═══ ATTENTION BENCHMARK ═══","info");const e=await ie();if(!e)return null;y=await ue(e),ce(y);const t=1,r=64,a=64,n=1/Math.sqrt(a),o=k.fromData(y,new Float32Array(t*r*a).fill(.1),[t,r,a]),s=k.fromData(y,new Float32Array(t*r*a).fill(.1),[t,r,a]),i=k.fromData(y,new Float32Array(t*r*a).fill(.1),[t,r,a]),c=new k(y,[t,r,a]),u=new k(y,[t,r,r]),l=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),d=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[l]}),compute:{module:y.createShaderModule({code:rr}),entryPoint:"main"}}),f=new ArrayBuffer(16),p=new Uint32Array(f),g=new Float32Array(f);p[0]=t,p[1]=r,p[2]=a,g[3]=n;const m=await he(`Attention b=${t} s=${r} d=${a}`,async()=>{const b=y.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(b,0,f);const v=y.createBindGroup({layout:l,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}},{binding:4,resource:{buffer:c.buffer}},{binding:5,resource:{buffer:u.buffer}}]}),x=y.createCommandEncoder(),S=x.beginComputePass();S.setPipeline(d),S.setBindGroup(0,v),S.dispatchWorkgroups(t,1,1),S.end(),y.queue.submit([x.finish()]),b.destroy()},20);return T(xe(m),"ok"),o.destroy(),s.destroy(),i.destroy(),c.destroy(),u.destroy(),y.destroy(),m}function ur(e){e.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,fe=e.querySelector("#model-log"),e.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{fe.innerHTML="",await st()}),e.querySelector("#btn-all-bench").addEventListener("click",async()=>{fe.innerHTML="",await st(),T("",""),await or(),T("",""),await sr(),T("",""),await ir(),T("",""),T("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const cr=Object.freeze(Object.defineProperty({__proto__:null,render:ur},Symbol.toStringTag,{value:"Module"}));let $=null,oe=null;function Y(e,t=""){if(!oe)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,oe.appendChild(r),oe.scrollTop=oe.scrollHeight}function kt(e,t){const r=new Float32Array(e*t*4);for(let a=0;a<t;a++)for(let n=0;n<e;n++){const o=(a*e+n)*4,s=(n>>4)+(a>>4)&1;r[o+0]=s?.9:n/e*.8,r[o+1]=s?.3:a/t*.6,r[o+2]=s?.6:.4,r[o+3]=1}return r}function ze(e,t,r){const a=document.createElement("canvas");a.width=t,a.height=r;const n=a.getContext("2d"),o=n.createImageData(t,r);for(let s=0;s<t*r*4;s++)o.data[s]=Math.round(e[s]*255);return n.putImageData(o,0,0),a}async function it(){Y("═══ GRAYSCALE TEST ═══","info");const e=await ie();if(!e){Y("WebGPU unavailable","err");return}$=await ue(e),ce($);const t=256,r=256,a=kt(t,r),n=k.fromData($,a,[t*r*4]),o=new k($,[t*r*4]),s=$.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=$.createComputePipeline({layout:$.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:$.createShaderModule({code:ar}),entryPoint:"main"}}),c=new ArrayBuffer(4);new Uint32Array(c)[0]=t*r;const u=await he("Grayscale 256×256",async()=>{const g=$.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});$.queue.writeBuffer(g,0,c);const m=$.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:o.buffer}}]}),b=$.createCommandEncoder(),v=b.beginComputePass();v.setPipeline(i),v.setBindGroup(0,m),v.dispatchWorkgroups(Math.ceil(t*r/256),1,1),v.end(),$.queue.submit([b.finish()]),g.destroy()},50);Y(xe(u),"ok");const l=await o.readback(),d=ze(a,t,r),f=ze(l,t,r),p=He?.querySelector("#image-display");if(p){p.innerHTML="";const g=document.createElement("div");g.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const m=document.createElement("div");m.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',m.appendChild(d);const b=document.createElement("div");b.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',b.appendChild(f),g.appendChild(m),g.appendChild(b),p.appendChild(g)}n.destroy(),o.destroy(),$.destroy(),Y("✓ Grayscale complete","ok")}async function ut(){Y("═══ CONVOLUTION KERNEL TEST ═══","info");const e=await ie();if(!e){Y("WebGPU unavailable","err");return}$=await ue(e),ce($);const t=128,r=128,a=3,n=kt(t,r),o={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},s=$.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=$.createComputePipeline({layout:$.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:$.createShaderModule({code:nr}),entryPoint:"main"}}),c=new ArrayBuffer(16),u=new Uint32Array(c);u[0]=t,u[1]=r,u[2]=a,u[3]=0;for(const[l,d]of Object.entries(o)){const f=k.fromData($,n,[t*r*4]),p=k.fromData($,d,[a*a]),g=new k($,[t*r*4]),m=await he(`Conv ${l} ${t}×${r}`,async()=>{const x=$.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});$.queue.writeBuffer(x,0,c);const S=$.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:p.buffer}},{binding:2,resource:{buffer:f.buffer}},{binding:3,resource:{buffer:g.buffer}}]}),B=$.createCommandEncoder(),w=B.beginComputePass();w.setPipeline(i),w.setBindGroup(0,S),w.dispatchWorkgroups(Math.ceil(t/16),Math.ceil(r/16),1),w.end(),$.queue.submit([B.finish()]),x.destroy()},30);Y(xe(m),"ok");const b=await g.readback(),v=He?.querySelector("#image-display");if(v){const x=ze(b,t,r),S=document.createElement("div");S.style.cssText="display:inline-block;margin:4px",S.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${l}</div>`,S.appendChild(x),v.appendChild(S)}f.destroy(),p.destroy(),g.destroy()}$.destroy(),Y("✓ All convolution kernels applied","ok")}let He=null;function lr(e){He=e,e.innerHTML=`
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
  `,oe=e.querySelector("#image-log"),e.querySelector("#btn-grayscale").addEventListener("click",async()=>{oe.innerHTML="",e.querySelector("#image-display").innerHTML="",await it()}),e.querySelector("#btn-conv").addEventListener("click",async()=>{oe.innerHTML="",e.querySelector("#image-display").innerHTML="",await ut()}),e.querySelector("#btn-all-img").addEventListener("click",async()=>{oe.innerHTML="",e.querySelector("#image-display").innerHTML="",await it(),Y("",""),await ut(),Y("",""),Y("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const dr=Object.freeze(Object.defineProperty({__proto__:null,render:lr},Symbol.toStringTag,{value:"Module"}));let F=null,Ae=null,Te=null;function Re(e,t=""){if(!Ae)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Ae.appendChild(r),Ae.scrollTop=Ae.scrollHeight}const fr=`
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
`;let Le=0,ke=0;async function pr(e,t,r,a,n){const o=await ie();if(!o){Re("WebGPU unavailable","err");return}F=await ue(o),ce(F);const[s,i]=a.value.split("x").map(Number);e.width=s,e.height=i,Le=parseInt(n.value);const c=F.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=F.createComputePipeline({layout:F.createPipelineLayout({bindGroupLayouts:[c]}),compute:{module:F.createShaderModule({code:fr}),entryPoint:"main"}}),l=F.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),d=e.getContext("2d"),f=F.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let p=performance.now(),g=0,m=0;t.textContent="RENDERING",t.className="badge badge-pass";function b(){const v=new ArrayBuffer(16),x=new Uint32Array(v);x[0]=s,x[1]=i,x[2]=ke,x[3]=Le,F.queue.writeBuffer(f,0,v);const S=F.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:l}}]}),B=F.createCommandEncoder(),w=B.beginComputePass();w.setPipeline(u),w.setBindGroup(0,S),w.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(i/16),1),w.end();const A=F.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});B.copyBufferToBuffer(l,0,A,0,s*i*4*4),F.queue.submit([B.finish()]),A.mapAsync(GPUMapMode.READ).then(()=>{const G=new Float32Array(A.getMappedRange().slice(0));A.unmap(),A.destroy();const M=d.createImageData(s,i);for(let W=0;W<s*i*4;W++)M.data[W]=Math.round(G[W]*255);d.putImageData(M,0,0),ke++,m++;const E=performance.now();E-p>=1e3&&(g=Math.round(m*1e3/(E-p)),r.textContent=`${g} FPS | Frame ${ke} | ${s}×${i}`,m=0,p=E),Te=requestAnimationFrame(b)})}b()}function ct(){Te!==null&&(cancelAnimationFrame(Te),Te=null),F&&(F.destroy(),F=null)}function mr(e){e.innerHTML=`
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
  `,Ae=e.querySelector("#video-log");const t=e.querySelector("#video-canvas"),r=e.querySelector("#video-status"),a=e.querySelector("#video-fps"),n=e.querySelector("#res-select"),o=e.querySelector("#mode-select");e.querySelector("#btn-start").addEventListener("click",()=>{ct(),ke=0,Le=parseInt(o.value),Re(`Starting GPU compute video: ${n.value} mode=${o.value}`,"info"),pr(t,r,a,n,o)}),e.querySelector("#btn-stop").addEventListener("click",()=>{ct(),r.textContent="STOPPED",r.className="badge badge-info",Re("Rendering stopped","warn")})}const gr=Object.freeze(Object.defineProperty({__proto__:null,render:mr},Symbol.toStringTag,{value:"Module"}));let be=null;function P(e,t=""){if(!be)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,be.appendChild(r),be.scrollTop=be.scrollHeight}async function br(){if(be.innerHTML="",P("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),P(`Timestamp: ${new Date().toISOString()}`,""),!await yr())return;const t=await ie();if(!t){P("Cannot proceed: GPU not ready","err");return}P("",""),P("── MEMORY TEST ──","info");const r=await ue(t);ce(r);const a=Math.floor(t.limits.maxBufferSize/1048576);P(`Attempting to allocate buffer at reported max: ${a} MB`,"");try{const n=r.createBuffer({size:t.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});P("Buffer allocation at max: SUCCESS","ok"),n.destroy()}catch(n){P(`Buffer allocation at max: FAILED — ${n.message}`,"warn");for(const o of[256,128,64,32])try{const s=r.createBuffer({size:o*1048576,usage:GPUBufferUsage.STORAGE});P(`Largest successful allocation: ${o} MB`,"ok"),s.destroy();break}catch{continue}}P("",""),P("── COMPUTE THROUGHPUT ──","info");for(const n of[64,128,256]){const o=k.fromData(r,new Float32Array(n*n).fill(1),[n,n]),s=k.fromData(r,new Float32Array(n*n).fill(1),[n,n]),i=new k(r,[n,n]),c=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[c]}),compute:{module:r.createShaderModule({code:Oe}),entryPoint:"main"}}),l=await he(`matmul ${n}×${n}`,async()=>{const d=r.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),f=new ArrayBuffer(12);new Uint32Array(f).set([n,n,n]),r.queue.writeBuffer(d,0,f);const p=r.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),g=r.createCommandEncoder(),m=g.beginComputePass();m.setPipeline(u),m.setBindGroup(0,p);const b=Math.ceil(n/16);m.dispatchWorkgroups(b,b,1),m.end(),r.queue.submit([g.finish()]),d.destroy()},30,2*n*n*n);P(xe(l),"ok"),o.destroy(),s.destroy(),i.destroy()}r.destroy(),P("",""),P("═══ DIAGNOSTICS COMPLETE ═══","info")}async function yr(){const e=await Ne();return $t(e),P("── WEBGPU STATUS ──","info"),P(`${e.statusLabel} (Case ${e.case})`,e.ready?"ok":"err"),P(`Reason: ${e.reason}`,""),P(`Recommendation: ${e.recommendation}`,""),P("",""),P("── ENVIRONMENT ──","info"),P(`  URL: ${e.environment.url}`,""),P(`  Secure Context: ${e.environment.isSecureContext}`,e.environment.isSecureContext?"ok":"err"),P(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`,""),P(`  OS: ${e.environment.osName} ${e.environment.osVersion}`,""),P(`  iOS: ${e.environment.isIOS}`,""),P(`  Safari: ${e.environment.isSafari}`,""),P(`  WebView: ${e.environment.isWebView}`,e.environment.isWebView?"err":""),P(`  navigator.gpu: ${e.gpu.navigatorGpuExists}`,e.gpu.navigatorGpuExists?"ok":"err"),e.gpu.adapterName&&(P(`  Adapter: ${e.gpu.adapterName}`,"ok"),P(`  Vendor: ${e.gpu.adapterVendor}`,"")),e.gpu.adapterError&&P(`  Adapter Error: ${e.gpu.adapterError}`,"err"),e.gpu.deviceError&&P(`  Device Error: ${e.gpu.deviceError}`,"err"),e.ready?!0:(P("",""),P("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function vr(e){e.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,be=e.querySelector("#diag-log"),e.querySelector("#btn-diag").addEventListener("click",()=>{br()})}const wr=Object.freeze(Object.defineProperty({__proto__:null,render:vr},Symbol.toStringTag,{value:"Module"}));class ae{dims;ndim;size;strides;constructor(t){this.dims=typeof t=="number"?[t]:[...t],this.ndim=this.dims.length,this.size=this.dims.reduce((n,o)=>n*o,1);const r=new Array(this.ndim);let a=1;for(let n=this.ndim-1;n>=0;n--)r[n]=a,a*=this.dims[n];this.strides=r}equals(t){if(this.ndim!==t.ndim)return!1;for(let r=0;r<this.ndim;r++)if(this.dims[r]!==t.dims[r])return!1;return!0}isContiguous(){let t=1;for(let r=this.ndim-1;r>=0;r--){if(this.strides[r]!==t)return!1;t*=this.dims[r]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new ae([1])}static from(...t){return new ae(t)}}var te=(e=>(e.Float32="f32",e.Float16="f16",e.Int32="i32",e.Int8="i8",e.Uint8="u8",e))(te||{});const hr={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function Ot(e){return hr[e].bytes}let Z=null;async function xr(){if(Z)return Z;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.limits,r=new Set(e.features),a=await e.requestDevice({requiredLimits:{}});return a.lost.then(n=>{console.error("WebGPU device lost:",n.message),Z=null}),Z={adapter:e,device:a,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:t.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:t.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:t.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:t.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:t.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:t.maxTextureArrayLayers},features:r},Z}function D(){if(!Z)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return Z}function Sr(){Z&&(Z.device.destroy(),Z=null)}class ye{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(t,r,a){this.shape=t,this.dtype=r,this.byteSize=t.size*Ot(r),this.gpuBuffer=a??D().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(t,r,a=te.Float32){const n=D(),o=new ye(t,a);return n.device.queue.writeBuffer(o.gpuBuffer,0,r.buffer,r.byteOffset,r.byteLength),o}async readback(){const t=D(),r=t.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),a=t.device.createCommandEncoder();a.copyBufferToBuffer(this.gpuBuffer,0,r,0,this.byteSize),t.device.queue.submit([a.finish()]),await r.mapAsync(GPUMapMode.READ);const n=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),n}destroy(){this.gpuBuffer.destroy()}}class C{shape;dtype;buffer;constructor(t,r=te.Float32,a){this.shape=t,this.dtype=r,this.buffer=a??new ye(t,r)}static fromFloat32(t,r){const a=t instanceof Float32Array?t:new Float32Array(t),n=new ae(r);return new C(n,te.Float32,ye.fromData(n,a,te.Float32))}static fromInt32(t,r){const a=t instanceof Int32Array?t:new Int32Array(t),n=new ae(r);return new C(n,te.Int32,ye.fromData(n,a,te.Int32))}static zeros(t,r=te.Float32){const a=new ae(t),n=a.size*Ot(r),s=D().device.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(s.getMappedRange()).fill(0),s.unmap();const i=new ye(a,r,s);return new C(a,r,i)}static ones(t,r=te.Float32){const a=new ae(t).size,n=new Float32Array(a).fill(1);return C.fromFloat32(n,t)}static randn(t){const r=new ae(t).size,a=new Float32Array(r);for(let n=0;n<r;n++){const o=Math.random(),s=Math.random();a[n]=Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*s)}return C.fromFloat32(a,t)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class Br{cache=new Map;getOrCreate(t,r,a){if(this.cache.has(t))return this.cache.get(t);const n=D(),o=n.device.createComputePipeline({layout:n.device.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:n.device.createShaderModule({code:r}),entryPoint:"main"}});return this.cache.set(t,o),o}get(t){return this.cache.get(t)}clear(){this.cache.clear()}}const Ar=`
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
`,Mr=`
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
`,$r=`
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
`,Er=`
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
`,Tr=`
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
`,kr=`
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
`;function Gr(e,t,r,a,n){const o=new Float32Array(r*a);for(let s=0;s<r;s++)for(let i=0;i<a;i++){let c=0;for(let u=0;u<n;u++)c+=e[s*n+u]*t[u*a+i];o[s*a+i]=c}return o}function Nr(e,t){const r=new Float32Array(e.length);for(let a=0;a<e.length;a++)r[a]=e[a]+t[a];return r}function Dr(e,t){const r=new Float32Array(e.length);for(let a=0;a<e.length;a++)r[a]=e[a]*t[a];return r}function _r(e,t,r=1e-6){const a=e.length;let n=0;for(let i=0;i<a;i++)n+=e[i]*e[i];const o=Math.sqrt(n/a+r),s=new Float32Array(a);for(let i=0;i<a;i++)s[i]=e[i]/o*t[i];return s}function Fr(e,t,r,a=1e-6){const n=e.length;let o=0;for(let u=0;u<n;u++)o+=e[u];o/=n;let s=0;for(let u=0;u<n;u++){const l=e[u]-o;s+=l*l}s/=n;const i=1/Math.sqrt(s+a),c=new Float32Array(n);for(let u=0;u<n;u++)c[u]=(e[u]-o)*i*t[u]+r[u];return c}function Wr(e,t,r){const a=new Float32Array(e.length);for(let n=0;n<t;n++){const o=n*r;let s=-1e30;for(let c=0;c<r;c++)e[o+c]>s&&(s=e[o+c]);let i=0;for(let c=0;c<r;c++)a[o+c]=Math.exp(e[o+c]-s),i+=a[o+c];for(let c=0;c<r;c++)a[o+c]/=i}return a}function zr(e,t,r,a=1e4){const n=new Float32Array(e.length);n.set(e);for(let o=0;o<t*r/2;o++){const s=Math.floor(o/(r/2)),i=o%(r/2),c=1/Math.pow(a,i/r),u=s*c,l=Math.cos(u),d=Math.sin(u),f=o*2,p=o*2+1,g=n[f],m=n[p];n[f]=g*l-m*d,n[p]=g*d+m*l}return n}function Rr(e,t,r,a,n,o,s,i,c){const u=n-i+1,l=o-c+1,d=new Float32Array(r*s*u*l);for(let f=0;f<r;f++)for(let p=0;p<s;p++)for(let g=0;g<u;g++)for(let m=0;m<l;m++){let b=0;for(let v=0;v<a;v++)for(let x=0;x<i;x++)for(let S=0;S<c;S++)b+=e[((f*a+v)*n+g+x)*o+m+S]*t[((p*a+v)*i+x)*c+S];d[((f*s+p)*u+g)*l+m]=b}return d}function Lr(e,t,r){const a=new Float32Array(t*r);for(let n=0;n<t;n++)for(let o=0;o<r;o++)a[o*t+n]=e[n*r+o];return a}function qr(e,t,r,a,n,o){const s=new Float32Array(a*n*o);for(let i=0;i<n;i++)for(let c=0;c<a;c++){const u=c*t/a,l=i*r/n,d=Math.floor(u),f=Math.floor(l),p=Math.min(d+1,t-1),g=Math.min(f+1,r-1),m=u-d,b=l-f;for(let v=0;v<o;v++){const x=e[(f*t+d)*o+v],S=e[(f*t+p)*o+v],B=e[(g*t+d)*o+v],w=e[(g*t+p)*o+v];s[(i*a+c)*o+v]=x*(1-m)*(1-b)+S*m*(1-b)+B*(1-m)*b+w*m*b}}return s}const J=new Br;function re(e){return D().device.createBindGroupLayout({entries:Array.from({length:e},(r,a)=>({binding:a,visibility:GPUShaderStage.COMPUTE,buffer:a===0?{type:"uniform"}:{type:"storage"}}))})}function De(e){const t=D(),r=t.device.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.device.queue.writeBuffer(r,0,e),r}function pe(e,t,r,a,n,o){const s=D(),i=De(n),c=[{binding:0,resource:{buffer:i}},...a.map((d,f)=>({binding:f+1,resource:{buffer:d.buffer.gpuBuffer}}))],u=s.device.createBindGroup({layout:r,entries:c}),l=e.beginComputePass();return l.setPipeline(t),l.setBindGroup(0,u),l.dispatchWorkgroups(o),l.end(),i}async function me(e,t,r,a,n){const o=D(),s=C.zeros([r,a]),i=re(4),c=J.getOrCreate("matmul",Ar,i),u=new ArrayBuffer(12),l=new Uint32Array(u);l[0]=r,l[1]=a,l[2]=n;const d=o.device.createCommandEncoder();return pe(d,c,i,[e,t,s],u,Math.ceil(r/16)*Math.ceil(a/16)),o.device.queue.submit([d.finish()]),s}function ge(e,t,r,a,n){return Gr(e,t,r,a,n)}async function lt(e,t){const r=D(),a=C.zeros([e.shape.size]),n=re(4),o=J.getOrCreate("add",Cr,n),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=r.device.createCommandEncoder();return pe(i,o,n,[e,t,a],s,Math.ceil(e.shape.size/256)),r.device.queue.submit([i.finish()]),a}function dt(e,t){return Nr(e,t)}async function ft(e,t){const r=D(),a=C.zeros([e.shape.size]),n=re(4),o=J.getOrCreate("multiply",Ur,n),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=r.device.createCommandEncoder();return pe(i,o,n,[e,t,a],s,Math.ceil(e.shape.size/256)),r.device.queue.submit([i.finish()]),a}function pt(e,t){return Dr(e,t)}async function mt(e,t,r=1e-6){const a=D(),n=e.shape.size,o=C.zeros([n]),s=re(4),i=J.getOrCreate("rms_norm",Pr,s),c=new ArrayBuffer(8);new Uint32Array(c)[0]=n,new Float32Array(c)[1]=r;const u=a.device.createCommandEncoder();return pe(u,i,s,[e,t,o],c,1),a.device.queue.submit([u.finish()]),o}function gt(e,t,r=1e-6){return _r(e,t,r)}async function bt(e,t,r,a=1e-6){const n=D(),o=e.shape.size,s=C.zeros([o]),i=n.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=J.getOrCreate("layer_norm",Mr,i),u=new ArrayBuffer(8);new Uint32Array(u)[0]=o,new Float32Array(u)[1]=a;const l=D(),d=De(u),f=l.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:e.buffer.gpuBuffer}},{binding:2,resource:{buffer:t.buffer.gpuBuffer}},{binding:3,resource:{buffer:r.buffer.gpuBuffer}},{binding:4,resource:{buffer:s.buffer.gpuBuffer}}]}),p=l.device.createCommandEncoder(),g=p.beginComputePass();return g.setPipeline(c),g.setBindGroup(0,f),g.dispatchWorkgroups(1),g.end(),l.device.queue.submit([p.finish()]),s}function yt(e,t,r,a=1e-6){return Fr(e,t,r,a)}async function vt(e,t,r){const a=D(),n=C.zeros([t,r]),o=a.device.createCommandEncoder();o.copyBufferToBuffer(e.buffer.gpuBuffer,0,n.buffer.gpuBuffer,0,t*r*4);const s=re(2),i=J.getOrCreate("softmax",$r,s),c=new ArrayBuffer(8);new Uint32Array(c)[0]=t,new Uint32Array(c)[1]=r;const u=De(c),l=a.device.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:n.buffer.gpuBuffer}}]}),d=o.beginComputePass();return d.setPipeline(i),d.setBindGroup(0,l),d.dispatchWorkgroups(Math.ceil(t)),d.end(),a.device.queue.submit([o.finish()]),n}function wt(e,t,r){return Wr(e,t,r)}async function ht(e,t,r,a=1e4){const n=D(),o=C.zeros([t,r]),s=n.device.createCommandEncoder();s.copyBufferToBuffer(e.buffer.gpuBuffer,0,o.buffer.gpuBuffer,0,t*r*4);const i=re(2),c=J.getOrCreate("rope",Er,i),u=new ArrayBuffer(12);new Uint32Array(u)[0]=t,new Uint32Array(u)[1]=r,new Float32Array(u)[2]=a;const l=De(u),d=n.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:o.buffer.gpuBuffer}}]}),f=s.beginComputePass();return f.setPipeline(c),f.setBindGroup(0,d),f.dispatchWorkgroups(Math.ceil(t*r/2/256)),f.end(),n.device.queue.submit([s.finish()]),o}function xt(e,t,r,a=1e4){return zr(e,t,r,a)}async function St(e,t,r,a,n,o,s,i,c){const u=D(),l=n-i+1,d=o-c+1,f=C.zeros([r,s,l,d]),p=re(4),g=J.getOrCreate("conv2d",Tr,p),m=new ArrayBuffer(36),b=new Uint32Array(m);b[0]=r,b[1]=a,b[2]=n,b[3]=o,b[4]=s,b[5]=i,b[6]=c,b[7]=l,b[8]=d;const v=u.device.createCommandEncoder();return pe(v,g,p,[e,t,f],m,r*s),u.device.queue.submit([v.finish()]),f}function Bt(e,t,r,a,n,o,s,i,c){return Rr(e,t,r,a,n,o,s,i,c)}async function At(e,t,r){const a=D(),n=C.zeros([r,t]),o=re(3),s=J.getOrCreate("transpose_2d",kr,o),i=new ArrayBuffer(8);new Uint32Array(i)[0]=t,new Uint32Array(i)[1]=r;const c=a.device.createCommandEncoder();return pe(c,s,o,[e,n],i,Math.ceil(t/16)*Math.ceil(r/16)),a.device.queue.submit([c.finish()]),n}function Ct(e,t,r){return Lr(e,t,r)}async function Ut(e,t,r,a,n,o){const s=D(),i=C.zeros([n*a*o]),c=re(3),u=J.getOrCreate("interpolate_bilinear",Or,c),l=new ArrayBuffer(20),d=new Uint32Array(l);d[0]=t,d[1]=r,d[2]=a,d[3]=n,d[4]=o;const f=s.device.createCommandEncoder();return pe(f,u,c,[e,i],l,Math.ceil(a/16)*Math.ceil(n/16)),s.device.queue.submit([f.finish()]),i}function Pt(e,t,r,a,n,o){return qr(e,t,r,a,n,o)}let ve=null,Ge=null;function V(e,t=""){if(!ve)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,ve.appendChild(r),ve.scrollTop=ve.scrollHeight}function H(e,t,r=.001){if(e.length!==t.length)return!1;for(let a=0;a<e.length;a++){const n=Math.abs(e[a]-t[a]),o=Math.max(Math.abs(e[a]),Math.abs(t[a]),1e-8);if(n/o>r)return!1}return!0}async function I(e,t,r=20){for(let n=0;n<3;n++)t();const a=[];for(let n=0;n<r;n++){const o=performance.now();t(),a.push(performance.now()-o)}return a.reduce((n,o)=>n+o,0)/a.length}async function j(e,t,r=20){const a=[];for(let n=0;n<Math.min(5,r);n++)await t();for(let n=0;n<r;n++){const o=performance.now();await t(),a.push(performance.now()-o)}return a.reduce((n,o)=>n+o,0)/a.length}function Hr(e){if(!Ge)return;const t=document.createElement("tr");t.innerHTML=`
    <td style="font-weight:600">${e.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${e.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${e.speedup>=1?"var(--green)":"var(--red)"}">
      ${e.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${e.correct?"badge-pass":"badge-fail"}">${e.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${e.tolerance.toExponential(1)}</td>
  `,Ge.appendChild(t)}async function Ir(){ve.innerHTML="",Ge.innerHTML="",V("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),V("Initializing WebGPU...","");let e;try{e=await xr()}catch(a){V(`FATAL: ${a.message}`,"err"),V("WebGPU is not available. Cannot run GPU benchmarks.","err");return}V(`GPU: ${e.adapter.name??"Unknown"}`,"ok"),V(`Running benchmarks...
`,"");const t=[];{const s=C.randn([64,64]),i=C.randn([64,64]),c=await s.readback(),u=await i.readback(),l=await I("matmul 64",()=>ge(c,u,64,64,64)),d=await j("matmul 64",async()=>{(await me(s,i,64,64,64)).destroy()}),f=await(await me(s,i,64,64,64)).readback(),p=ge(c,u,64,64,64),g=H(p,f),m=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-f[v])));t.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:l,gpuMs:d,speedup:l/d,correct:g,tolerance:m}),s.destroy(),i.destroy()}{const s=C.randn([256,256]),i=C.randn([256,256]),c=await s.readback(),u=await i.readback(),l=await I("matmul 256",()=>ge(c,u,256,256,256),10),d=await j("matmul 256",async()=>{(await me(s,i,256,256,256)).destroy()}),f=await(await me(s,i,256,256,256)).readback(),p=ge(c,u,256,256,256),g=H(p,f),m=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-f[v])));t.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:l,gpuMs:d,speedup:l/d,correct:g,tolerance:m}),s.destroy(),i.destroy()}{const s=C.randn([512,512]),i=C.randn([512,512]),c=await s.readback(),u=await i.readback(),l=await I("matmul 512",()=>ge(c,u,512,512,512),5),d=await j("matmul 512",async()=>{(await me(s,i,512,512,512)).destroy()}),f=await(await me(s,i,512,512,512)).readback(),p=ge(c,u,512,512,512),g=H(p,f),m=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-f[v])));t.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:l,gpuMs:d,speedup:l/d,correct:g,tolerance:m}),s.destroy(),i.destroy()}{const n=C.randn([1e6]),o=C.randn([1e6]),s=await n.readback(),i=await o.readback(),c=await I("add 1M",()=>dt(s,i)),u=await j("add 1M",async()=>{(await lt(n,o)).destroy()}),l=await(await lt(n,o)).readback(),d=dt(s,i),f=H(d,l),p=Math.max(...Array.from(d).map((g,m)=>Math.abs(g-l[m])));t.push({name:"Add",shape:"[1000000]",cpuMs:c,gpuMs:u,speedup:c/u,correct:f,tolerance:p}),n.destroy(),o.destroy()}{const n=C.randn([1e6]),o=C.randn([1e6]),s=await n.readback(),i=await o.readback(),c=await I("mul 1M",()=>pt(s,i)),u=await j("mul 1M",async()=>{(await ft(n,o)).destroy()}),l=await(await ft(n,o)).readback(),d=pt(s,i),f=H(d,l),p=Math.max(...Array.from(d).map((g,m)=>Math.abs(g-l[m])));t.push({name:"Multiply",shape:"[1000000]",cpuMs:c,gpuMs:u,speedup:c/u,correct:f,tolerance:p}),n.destroy(),o.destroy()}{const n=C.randn([1024]),o=C.ones([1024]),s=await n.readback(),i=await o.readback(),c=await I("rmsnorm",()=>gt(s,i)),u=await j("rmsnorm",async()=>{(await mt(n,o)).destroy()}),l=await(await mt(n,o)).readback(),d=gt(s,i),f=H(d,l),p=Math.max(...Array.from(d).map((g,m)=>Math.abs(g-l[m])));t.push({name:"RMSNorm",shape:"[1024]",cpuMs:c,gpuMs:u,speedup:c/u,correct:f,tolerance:p}),n.destroy(),o.destroy()}{const n=C.randn([1024]),o=C.ones([1024]),s=C.zeros([1024]),i=await n.readback(),c=await o.readback(),u=await s.readback(),l=await I("layernorm",()=>yt(i,c,u)),d=await j("layernorm",async()=>{(await bt(n,o,s)).destroy()}),f=await(await bt(n,o,s)).readback(),p=yt(i,c,u),g=H(p,f),m=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-f[v])));t.push({name:"LayerNorm",shape:"[1024]",cpuMs:l,gpuMs:d,speedup:l/d,correct:g,tolerance:m}),n.destroy(),o.destroy(),s.destroy()}{const o=C.randn([32,128]),s=await o.readback(),i=await I("softmax",()=>wt(new Float32Array(s),32,128)),c=await j("softmax",async()=>{(await vt(C.fromFloat32(new Float32Array(s),[32,128]),32,128)).destroy()}),u=await(await vt(C.fromFloat32(new Float32Array(s),[32,128]),32,128)).readback(),l=wt(new Float32Array(s),32,128),d=H(l,u),f=Math.max(...Array.from(l).map((p,g)=>Math.abs(p-u[g])));t.push({name:"Softmax",shape:"[32, 128]",cpuMs:i,gpuMs:c,speedup:i/c,correct:d,tolerance:f}),o.destroy()}{const o=C.randn([16,128]),s=await o.readback(),i=await I("rope",()=>xt(new Float32Array(s),16,128)),c=await j("rope",async()=>{(await ht(C.fromFloat32(new Float32Array(s),[16,128]),16,128)).destroy()}),u=await(await ht(C.fromFloat32(new Float32Array(s),[16,128]),16,128)).readback(),l=xt(new Float32Array(s),16,128),d=H(l,u),f=Math.max(...Array.from(l).map((p,g)=>Math.abs(p-u[g])));t.push({name:"RoPE",shape:"[16, 128]",cpuMs:i,gpuMs:c,speedup:i/c,correct:d,tolerance:f}),o.destroy()}{const l=C.randn([1,3,16,16]),d=C.randn([4,3,3,3]),f=await l.readback(),p=await d.readback(),g=await I("conv2d",()=>Bt(f,p,1,3,16,16,4,3,3)),m=await j("conv2d",async()=>{(await St(l,d,1,3,16,16,4,3,3)).destroy()}),b=await(await St(l,d,1,3,16,16,4,3,3)).readback(),v=Bt(f,p,1,3,16,16,4,3,3),x=H(v,b),S=Math.max(...Array.from(v).map((B,w)=>Math.abs(B-b[w])));t.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:g,gpuMs:m,speedup:g/m,correct:x,tolerance:S}),l.destroy(),d.destroy()}{const o=C.randn([256,256]),s=await o.readback(),i=await I("transpose",()=>Ct(s,256,256)),c=await j("transpose",async()=>{(await At(o,256,256)).destroy()}),u=await(await At(o,256,256)).readback(),l=Ct(s,256,256),d=H(l,u),f=Math.max(...Array.from(l).map((p,g)=>Math.abs(p-u[g])));t.push({name:"Transpose",shape:"[256, 256]",cpuMs:i,gpuMs:c,speedup:i/c,correct:d,tolerance:f}),o.destroy()}{const c=C.randn([3072]),u=await c.readback(),l=await I("interp",()=>Pt(u,32,32,64,64,3)),d=await j("interp",async()=>{(await Ut(c,32,32,64,64,3)).destroy()}),f=await(await Ut(c,32,32,64,64,3)).readback(),p=Pt(u,32,32,64,64,3),g=H(p,f),m=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-f[v])));t.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:l,gpuMs:d,speedup:l/d,correct:g,tolerance:m}),c.destroy()}V("",""),V("═══ RESULTS ═══","info");for(const a of t){Hr(a);const n=a.correct?"✓":"✗",o=a.correct?"ok":"err";V(`${n} ${a.name} (${a.shape}): CPU ${a.cpuMs.toFixed(2)} ms | GPU ${a.gpuMs.toFixed(2)} ms | ${a.speedup.toFixed(1)}× | max diff ${a.tolerance.toExponential(1)}`,o)}const r=t.filter(a=>a.correct).length;V("",""),V(`═══ ${r}/${t.length} CORRECT ═══`,r===t.length?"ok":"err"),Sr()}function jr(e){e.innerHTML=`
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
  `,ve=e.querySelector("#bench-log"),Ge=e.querySelector("#bench-tbody"),e.querySelector("#btn-run-bench").addEventListener("click",()=>{Ir()})}const Kr=Object.freeze(Object.defineProperty({__proto__:null,render:jr},Symbol.toStringTag,{value:"Module"}));let ne=null,$e="";function Vr(e){const t=e.environment,r=e.gpu,a=e.case==="D"?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)";let n=`
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
  `,n}function Yr(e){e.innerHTML=`
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;const t=e.querySelector("#wgdiag-result");ne=e.querySelector("#btn-copy-report"),e.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{t.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',ne.disabled=!0;const r=await Ne();$e=$t(r),t.innerHTML=Vr(r),ne.disabled=!1}),ne.addEventListener("click",async()=>{if($e)try{await navigator.clipboard.writeText($e),ne.textContent="Copied!",setTimeout(()=>{ne.textContent="Copy Diagnostics"},2e3)}catch{const r=document.createElement("textarea");r.value=$e,document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),ne.textContent="Copied!",setTimeout(()=>{ne.textContent="Copy Diagnostics"},2e3)}}),e.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const Xr=Object.freeze(Object.defineProperty({__proto__:null,render:Yr},Symbol.toStringTag,{value:"Module"}));let Ce=null,de=null;async function we(){if(de&&!Ce&&(de=null),de)return de;if(!navigator.gpu)throw new Error("WebGPU not supported");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.features.has("timestamp-query"),r=await e.requestDevice({requiredFeatures:t?["timestamp-query"]:[],requiredLimits:{}});r.lost.then(s=>{console.error("Benchmark device lost:",s.message),Ce=null,de=null}),Ce=r;let a=null;try{a=navigator.gpu.getPreferredCanvasFormat()}catch{}const n=e.limits,o=[];for(const s of e.features)o.push(s);return de={webgpuAvailable:!0,adapterName:e.name??"Unknown",adapterVendor:e.vendor??"Unknown",adapterDevice:e.device??"Unknown",adapterFeatures:o,adapterLimits:{maxBufferSize:n.maxBufferSize,maxTextureDimension1D:n.maxTextureDimension1D,maxTextureDimension2D:n.maxTextureDimension2D,maxTextureDimension3D:n.maxTextureDimension3D,maxComputeWorkgroupStorageSize:n.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:n.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:n.maxStorageBufferBindingSize,maxUniformBufferBindingSize:n.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:n.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:n.maxComputeWorkgroupsPerDimension,maxColorAttachments:n.maxColorAttachments,minStorageBufferOffsetAlignment:n.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:n.minUniformBufferOffsetAlignment},preferredCanvasFormat:a,maxBufferSize:n.maxBufferSize,maxStorageBufferBindingSize:n.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:n.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:n.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:n.maxComputeWorkgroupsPerDimension,timestampQuerySupport:t,isFallbackAdapter:e.isFallbackAdapter??!1},de}function O(){if(!Ce)throw new Error("Benchmark not initialized. Call initBenchmark() first.");return Ce}function L(e){const t=O(),r=t.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(r,0,e),r}function U(e,t){const r=O(),a=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(t){const n=r.createBuffer({size:Math.max(e,t.byteLength),usage:a,mappedAtCreation:!0});return new Float32Array(n.getMappedRange()).set(t),n.unmap(),n}return r.createBuffer({size:e,usage:a})}function Qr(e){return O().createBuffer({size:e,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})}async function Gt(e,t){const r=O(),a=Qr(t),n=r.createCommandEncoder();n.copyBufferToBuffer(e,0,a,0,t),r.queue.submit([n.finish()]),await a.mapAsync(GPUMapMode.READ);const o=new Float32Array(a.getMappedRange().slice(0));return a.unmap(),a.destroy(),o}function q(e,t){const r=O(),a=r.createBindGroupLayout({entries:Array.from({length:t},(n,o)=>({binding:o,visibility:GPUShaderStage.COMPUTE,buffer:o===0?{type:"uniform"}:{type:"storage"}}))});return r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:r.createShaderModule({code:e}),entryPoint:"main"}})}async function Zr(e,t=50,r=5){const a=O();for(let i=0;i<Math.min(r,3);i++)e();const n=[];for(let i=0;i<t;i++){const c=performance.now();e();try{await a.queue.onSubmittedWorkDone()}catch{await new Promise(l=>setTimeout(l,50))}const u=performance.now();n.push(u-c)}n.sort((i,c)=>i-c);const o=n.reduce((i,c)=>i+c,0)/n.length,s=n[Math.floor(n.length/2)];return{avgMs:o,minMs:n[0],maxMs:n[n.length-1],p50Ms:s,iterations:t}}function R(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}const Nt=`
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
`,Ie=`
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
`,Dt=`
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
`,_t=`
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
`,Ft=`
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
`,Wt=`
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
`;async function Ue(e){const t=O();t.pushErrorScope("validation"),t.pushErrorScope("out-of-memory"),t.pushErrorScope("internal");try{const r=t.createCommandEncoder(),a=r.beginComputePass();a.setPipeline(e.pipeline),a.setBindGroup(0,e.bindGroup),a.dispatchWorkgroups(...e.workgroups),a.end(),t.queue.submit([r.finish()]),await t.queue.onSubmittedWorkDone();const o=(await Promise.all([t.popErrorScope(),t.popErrorScope(),t.popErrorScope()])).find(l=>l!==null);if(o)return{pass:!1,error:`Validation Error: ${o.message}`};const s=t.createBuffer({size:e.outputBytes,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),i=t.createCommandEncoder();i.copyBufferToBuffer(e.outputBuffer,0,s,0,e.outputBytes),t.queue.submit([i.finish()]),await s.mapAsync(GPUMapMode.READ);const c=new Float32Array(s.getMappedRange().slice(0));s.unmap(),s.destroy();const u=e.validator(c);return{pass:u.pass,error:u.pass?null:u.error}}catch(r){return{pass:!1,error:r.message}}}async function zt(){const e=O(),t=[],r=q(Nt,4),a=[64,1024,65536];for(const n of a){const o=n*4,s=new Float32Array(n).fill(1),i=new Float32Array(n).fill(2),c=U(o,s),u=U(o,i),l=U(o),d=new ArrayBuffer(4);new Uint32Array(d)[0]=n;const f=L(d),p=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:u}},{binding:3,resource:{buffer:l}}]}),g=await Ue({name:"Vector Addition",pipeline:r,bindGroup:p,workgroups:[Math.ceil(n/64),1,1],outputBuffer:l,outputBytes:o,validator:m=>{const b=m.every(v=>Math.abs(v-3)<1e-5);return{pass:b,error:b?"":"Incorrect values"}}});t.push({id:`vecadd_${n}`,name:"Vector Addition",inputSize:`${n} elements (${R(o)})`,executionTimeMs:0,throughput:"N/A",memoryBytes:o*3,success:g.pass,error:g.error||void 0,gpuTimingAvailable:!1}),c.destroy(),u.destroy(),l.destroy(),f.destroy()}return t}const Jr=[128,256,512];function en(e,t,r,a,n){const o=new Float32Array(r*a);for(let s=0;s<r;s++)for(let i=0;i<a;i++){let c=0;for(let u=0;u<n;u++)c+=e[s*n+u]*t[u*a+i];o[s*a+i]=c}return o}async function Rt(){const e=O(),t=[],r=q(Ie,4),a=r.getBindGroupLayout(0);for(const n of Jr)try{const o=n,s=n,c=(o*s+s*n+o*n)*4,u=new Float32Array(o*s).fill(1),l=new Float32Array(s*n).fill(.5),d=U(o*s*4,u),f=U(s*n*4,l),p=U(o*n*4),g=new ArrayBuffer(12),m=new Uint32Array(g);m[0]=o,m[1]=n,m[2]=s;const b=L(g),v=e.createBindGroup({layout:a,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}}]}),x=Math.ceil(o/16),S=Math.ceil(n/16),B=await Zr(()=>{const M=e.createCommandEncoder(),E=M.beginComputePass();E.setPipeline(r),E.setBindGroup(0,v),E.dispatchWorkgroups(x,S),E.end(),e.queue.submit([M.finish()])},n<=256?50:20);let w=!0;if(n<=256){const M=await Gt(p,o*n*4),E=en(u,l,o,n,s);for(let W=0;W<o*n;W++)if(Math.abs(M[W]-E[W])>.001){w=!1;break}}const A=2*o*n*s,G=A/(B.avgMs/1e3)/1e9;t.push({id:`matmul_${n}`,name:"Matrix Multiplication",inputSize:`${n}×${n}`,executionTimeMs:B.avgMs,throughput:`${G.toFixed(2)} GFLOPS`,memoryBytes:c,success:w,gpuTimingAvailable:!0,details:{M:o,N:n,K:s,flops:A,gflops:G,iterations:B.iterations,minMs:B.minMs,maxMs:B.maxMs,p50Ms:B.p50Ms,correctness:n<=256?w?"PASS":"FAIL":"NOT_TESTED (>256)"}}),d.destroy(),f.destroy(),p.destroy(),b.destroy()}catch(o){t.push({id:`matmul_${n}`,name:"Matrix Multiplication",inputSize:`${n}×${n}`,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:o.message,gpuTimingAvailable:!1})}return t}async function tn(){const e=O(),t=[],r=q(Dt,4),a=1,n=1,o=5,s=5,i=1,c=3,u=3,l=o-c+1,d=s-u+1,f=a*n*o*s,p=i*n*c*u,g=a*i*l*d,m=new Float32Array(f).fill(1),b=new Float32Array(p).fill(1),v=U(f*4,m),x=U(p*4,b),S=U(g*4),B=new ArrayBuffer(36),w=new Uint32Array(B);w[0]=a,w[1]=n,w[2]=o,w[3]=s,w[4]=i,w[5]=c,w[6]=u,w[7]=l,w[8]=d;const A=L(B),G=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:A}},{binding:1,resource:{buffer:v}},{binding:2,resource:{buffer:x}},{binding:3,resource:{buffer:S}}]}),M=await Ue({name:"Conv2D",pipeline:r,bindGroup:G,workgroups:[a,i,l*d],outputBuffer:S,outputBytes:g*4,validator:E=>{const ee=E.every(le=>Math.abs(le-9)<1e-4);return{pass:ee,error:ee?"":`Expected 9, got ${E[0]}`}}});return t.push({id:`conv2d_${a}x${n}x${o}x${s}`,name:"Conv2D",inputSize:`${a}x${n}x${o}x${s} k=${c}`,executionTimeMs:0,throughput:"N/A",memoryBytes:(f+p+g)*4,success:M.pass,error:M.error||void 0,gpuTimingAvailable:!1}),v.destroy(),x.destroy(),S.destroy(),A.destroy(),t}async function Lt(){const e=O(),t=[],r=q(_t,3),a=[{rows:1,cols:64},{rows:4,cols:64}];for(const n of a){const o=n.rows*n.cols,s=o*4,i=new Float32Array(o).map((g,m)=>m%n.cols*.1),c=U(s,i),u=U(s),l=new ArrayBuffer(8);new Uint32Array(l)[0]=n.rows,new Uint32Array(l)[1]=n.cols;const d=L(l),f=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:u}}]}),p=await Ue({name:"Softmax",pipeline:r,bindGroup:f,workgroups:[n.rows,1,1],outputBuffer:u,outputBytes:s,validator:g=>{let m=!0;for(let b=0;b<n.rows;b++){const v=b*n.cols;let x=0;for(let S=0;S<n.cols;S++)x+=g[v+S];if(Math.abs(x-1)>1e-4){m=!1;break}}return{pass:m,error:m?"":"Softmax rows do not sum to 1"}}});t.push({id:`softmax_${n.rows}x${n.cols}`,name:"Softmax",inputSize:`${n.rows}x${n.cols}`,executionTimeMs:0,throughput:"N/A",memoryBytes:s,success:p.pass,error:p.error||void 0,gpuTimingAvailable:!1}),c.destroy(),u.destroy(),d.destroy()}return t}async function qt(){const e=O(),t=[],r=q(Ft,4),a=[8,128,512];for(const n of a){const o=n*4,s=new Float32Array(n).fill(.5),i=new Float32Array(n).fill(1),c=U(o,s),u=U(o,i),l=U(o),d=new ArrayBuffer(8);new Uint32Array(d)[0]=n,new Float32Array(d)[1]=1e-6;const f=L(d),p=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:u}},{binding:3,resource:{buffer:l}}]}),g=await Ue({name:"RMSNorm",pipeline:r,bindGroup:p,workgroups:[1,1,1],outputBuffer:l,outputBytes:o,validator:m=>{const b=s.reduce((B,w)=>B+w*w,0),v=Math.sqrt(b/n+1e-6),x=s.map(B=>B/v),S=m.every((B,w)=>Math.abs(B-x[w])<1e-4);return{pass:S,error:S?"":`Incorrect values: got ${m[0]} expected ${x[0]}`}}});t.push({id:`rmsnorm_${n}`,name:"RMSNorm",inputSize:`${n} elements (${R(o)})`,executionTimeMs:0,throughput:"N/A",memoryBytes:o*3,success:g.pass,error:g.error||void 0,gpuTimingAvailable:!1}),c.destroy(),u.destroy(),l.destroy(),f.destroy()}return t}async function rn(){const e=O(),t=[],r=q(Wt,6),a=1,n=4,o=4,s=1/Math.sqrt(o),i=a*n*o,c=a*n*n,u=new Float32Array(i).map((G,M)=>(M%o+1)*.1),l=new Float32Array(i).map((G,M)=>(M%o+1)*.1),d=new Float32Array(i).map((G,M)=>(M%o+1)*.1),f=U(i*4,u),p=U(i*4,l),g=U(i*4,d),m=U(i*4),b=U(c*4),v=new ArrayBuffer(16),x=new Uint32Array(v),S=new Float32Array(v);x[0]=a,x[1]=n,x[2]=o,S[3]=s;const B=L(v),w=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:B}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:g}},{binding:4,resource:{buffer:m}},{binding:5,resource:{buffer:b}}]}),A=await Ue({name:"Attention",pipeline:r,bindGroup:w,workgroups:[a,1,1],outputBuffer:m,outputBytes:i*4,validator:G=>{const M=G.every(E=>isFinite(E));return{pass:M,error:M?"":"Non-finite output"}}});return t.push({id:`attention_${a}x${n}x${o}`,name:"Attention",inputSize:`batch=${a} seq=${n} dim=${o}`,executionTimeMs:0,throughput:"N/A",memoryBytes:(i*3+i+c)*4,success:A.pass,error:A.error||void 0,gpuTimingAvailable:!1}),f.destroy(),p.destroy(),g.destroy(),m.destroy(),b.destroy(),B.destroy(),t}async function nn(e){const t=O(),r=[],a=e.maxBufferSize;{let n=0,o=Math.min(a,256*1024*1024);try{for(;o<=a;){const s=t.createBuffer({size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});if(n=o,s.destroy(),o>=a)break;o=Math.min(o*2,a)}}catch{}r.push({id:"mem_max_buffer",name:"Max Buffer Size",inputSize:`limit=${R(a)}`,executionTimeMs:0,throughput:`accepted=${R(n)}`,memoryBytes:n,success:n>0,gpuTimingAvailable:!1,details:{maxBufferSizeLimit:a,maxBufferAccepted:n,match:n===a?"EXACT":"PARTIAL"}})}{const n=[1048576,16777216,67108864,134217728].filter(o=>o<=a);for(const o of n)try{const i=[];for(let u=0;u<20;u++){const l=performance.now(),d=t.createBuffer({size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});i.push(performance.now()-l),d.destroy()}const c=i.reduce((u,l)=>u+l,0)/i.length;r.push({id:`mem_alloc_${o}`,name:"Allocation Time",inputSize:R(o),executionTimeMs:c,throughput:`${(o/(c/1e3)/1048576).toFixed(1)} MB/s`,memoryBytes:o,success:!0,gpuTimingAvailable:!1,details:{avgMs:c,iterations:20}})}catch(s){r.push({id:`mem_alloc_${o}`,name:"Allocation Time",inputSize:R(o),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}{const n=[1048576,16777216,67108864].filter(o=>o<=a);for(const o of n)try{const s=o/4,i=new Float32Array(s).fill(3.14),c=Ee(o),u=20,l=[];for(let f=0;f<u;f++){const p=performance.now();t.queue.writeBuffer(c,0,i.buffer),await t.queue.onSubmittedWorkDone(),l.push(performance.now()-p)}const d=l.reduce((f,p)=>f+p,0)/l.length;r.push({id:`mem_upload_${o}`,name:"Upload Time",inputSize:R(o),executionTimeMs:d,throughput:`${(o/(d/1e3)/1048576).toFixed(1)} MB/s`,memoryBytes:o,success:!0,gpuTimingAvailable:!1,details:{avgMs:d,iterations:u,method:"queue.writeBuffer"}}),c.destroy()}catch(s){r.push({id:`mem_upload_${o}`,name:"Upload Time",inputSize:R(o),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}{const n=[1048576,16777216,67108864].filter(o=>o<=a);for(const o of n)try{const s=Ee(o),i=10,c=[];for(let l=0;l<i;l++){const d=performance.now();await Gt(s,o),c.push(performance.now()-d)}const u=c.reduce((l,d)=>l+d,0)/c.length;r.push({id:`mem_readback_${o}`,name:"Readback Time",inputSize:R(o),executionTimeMs:u,throughput:`${(o/(u/1e3)/1048576).toFixed(1)} MB/s`,memoryBytes:o,success:!0,gpuTimingAvailable:!1,details:{avgMs:u,iterations:i,method:"copyBufferToBuffer + mapAsync"}}),s.destroy()}catch(s){r.push({id:`mem_readback_${o}`,name:"Readback Time",inputSize:R(o),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}{const n=Math.min(16777216,a);try{const s=Ee(n),i=new Float32Array(n/4).fill(1),c=[];for(let f=0;f<50;f++){const p=performance.now();t.queue.writeBuffer(s,0,i.buffer),c.push(performance.now()-p)}const u=[];for(let f=0;f<50;f++){const p=performance.now(),g=t.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(g,0,i.buffer),g.destroy(),u.push(performance.now()-p)}const l=c.reduce((f,p)=>f+p,0)/c.length,d=u.reduce((f,p)=>f+p,0)/u.length;r.push({id:"mem_reuse_vs_realloc",name:"Buffer Reuse vs Re-alloc",inputSize:R(n),executionTimeMs:l,throughput:`reuse=${l.toFixed(3)}ms re-alloc=${d.toFixed(3)}ms`,memoryBytes:n,success:!0,gpuTimingAvailable:!1,details:{reuseAvgMs:l,reallocAvgMs:d,speedup:(d/l).toFixed(1)+"x",iterations:50}}),s.destroy()}catch(o){r.push({id:"mem_reuse_vs_realloc",name:"Buffer Reuse vs Re-alloc",inputSize:R(n),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:o.message,gpuTimingAvailable:!1})}}{let n=0;const o=[64*1024*1024,128*1024*1024,256*1024*1024].filter(s=>s<=a);for(const s of o)try{const i=Ee(s),c=new Float32Array(Math.min(s/4,1024)).fill(42);t.queue.writeBuffer(i,0,c.buffer),await t.queue.onSubmittedWorkDone(),n=s,i.destroy()}catch{break}r.push({id:"mem_useful_working_set",name:"Useful Working Set",inputSize:`tested up to ${R(a)}`,executionTimeMs:0,throughput:`confirmed=${R(n)}`,memoryBytes:n,success:n>0,gpuTimingAvailable:!1,details:{maxBufferSize:a,usefulWorkingSet:n}})}return r}function Ee(e,t){const r=O(),a=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;return r.createBuffer({size:e,usage:a})}const Fe=[30,60,180];async function an(e){const t=O(),r=[],a=256,n=a,o=a,s=2*n*a*o,i=q(Ie,4),c=i.getBindGroupLayout(0),u=new Float32Array(n*o).fill(1),l=new Float32Array(o*a).fill(.5),d=U(n*o*4,u),f=U(o*a*4,l),p=U(n*a*4),g=new ArrayBuffer(12),m=new Uint32Array(g);m[0]=n,m[1]=a,m[2]=o;const b=L(g),v=t.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}}]}),x=Math.ceil(n/16),S=Math.ceil(a/16);function B(){const w=t.createCommandEncoder(),A=w.beginComputePass();A.setPipeline(i),A.setBindGroup(0,v),A.dispatchWorkgroups(x,S),A.end(),t.queue.submit([w.finish()])}for(const w of Fe)try{e?.(0,`Starting ${w}s sustained test...`);const A=[],G=performance.now();let M=G,E=0;for(let N=0;N<5;N++)B(),await t.queue.onSubmittedWorkDone();for(;;){const N=(performance.now()-G)/1e3;if(N>=w)break;const Q=performance.now();let _e=0;for(;!(performance.now()-Q>=1e3);)B(),await t.queue.onSubmittedWorkDone(),_e++;const at=(performance.now()-Q)/1e3,jt=at/_e*1e3,ot=s*_e/(at*1e9);A.push({second:E,avgMs:jt,gflops:ot}),E++;const Kt=Math.min(N/w*100,100);e?.(Kt,`${w}s test: ${Math.floor(N)}s / ${w}s — ${ot.toFixed(1)} GFLOPS`)}const W=A.slice(0,10),ee=A.slice(-10),le=W.reduce((N,Q)=>N+Q.gflops,0)/W.length,Be=ee.reduce((N,Q)=>N+Q.gflops,0)/ee.length,Pe=Be<le*.85,_=A.reduce((N,Q)=>N+Q.gflops,0)/A.length;r.push({id:`sustained_${w}s`,name:`Sustained Load ${w}s`,inputSize:`${a}×${a} matmul`,executionTimeMs:A.reduce((N,Q)=>N+Q.avgMs,0)/A.length,throughput:`${_.toFixed(1)} GFLOPS avg`,memoryBytes:(n*o+o*a+n*a)*4,success:!0,gpuTimingAvailable:!0,samples:A,thermalThrottling:Pe,avgGflops:_,durationSeconds:w,details:{duration:w,totalSamples:A.length,avgGflops:_,minGflops:Math.min(...A.map(N=>N.gflops)),maxGflops:Math.max(...A.map(N=>N.gflops)),first10sAvg:le,last10sAvg:Be,throttled:Pe?"YES":"NO",dropPct:((1-Be/le)*100).toFixed(1)+"%"}}),e?.(100,`${w}s test complete — ${_.toFixed(1)} GFLOPS avg`),w!==Fe[Fe.length-1]&&(e?.(-1,"Cooling down 10s before next test..."),await new Promise(N=>setTimeout(N,1e4)))}catch(A){r.push({id:`sustained_${w}s`,name:`Sustained Load ${w}s`,inputSize:`${a}×${a} matmul`,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:A.message,gpuTimingAvailable:!1,samples:[],thermalThrottling:!1,avgGflops:0,durationSeconds:w})}return d.destroy(),f.destroy(),p.destroy(),b.destroy(),r}async function Se(e,t,r,a,n,o,s,i){const c=O();try{c.pushErrorScope("validation"),c.pushErrorScope("out-of-memory"),c.pushErrorScope("internal");const u=c.createCommandEncoder(),l=u.beginComputePass();l.setPipeline(t),l.setBindGroup(0,r),l.dispatchWorkgroups(...a),l.end();const d=c.createBuffer({size:o,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});u.copyBufferToBuffer(n,0,d,0,o),c.queue.submit([u.finish()]);const[f,p,g]=await Promise.all([c.popErrorScope(),c.popErrorScope(),c.popErrorScope()]),m=f||p||g;if(m)return d.destroy(),{name:e,pass:!1,maxError:1/0,details:"",webgpuError:`Stage: Dispatch — ${m.constructor.name}: ${m.message}`};await c.queue.onSubmittedWorkDone(),await d.mapAsync(GPUMapMode.READ);const b=new Float32Array(d.getMappedRange().slice(0));d.unmap(),d.destroy();let v=0;for(let S=0;S<s.length;S++){const B=Math.abs(b[S]-s[S]);B>v&&(v=B)}const x=v<i;return{name:e,pass:x,maxError:v,details:x?`OK (${s.length} elements)`:`Max error: ${v.toExponential(3)} (tolerance: ${i})`}}catch(u){return{name:e,pass:!1,maxError:1/0,details:u.message,webgpuError:`Stage: Exception — ${u.message}`}}}async function je(){const t=new Float32Array(Array.from({length:64},(f,p)=>p+1)),r=new Float32Array(Array.from({length:64},(f,p)=>2*p+1)),a=new Float32Array(64);for(let f=0;f<64;f++)a[f]=t[f]+r[f];const n=U(t.byteLength,t),o=U(r.byteLength,r),s=U(64*4),i=new ArrayBuffer(4);new Uint32Array(i)[0]=64;const c=L(i),u=q(Nt,4),l=O().createBindGroup({layout:u.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:s}}]}),d=await Se("VecAdd",u,l,[1,1,1],s,64*4,a,1e-5);return n.destroy(),o.destroy(),s.destroy(),c.destroy(),d}async function Ke(){const t=new Float32Array(4096).fill(1),r=new Float32Array(64*64).fill(.5),a=new Float32Array(64*64);for(let p=0;p<64;p++)for(let g=0;g<64;g++){let m=0;for(let b=0;b<64;b++)m+=t[p*64+b]*r[b*64+g];a[p*64+g]=m}const n=U(t.byteLength,t),o=U(r.byteLength,r),s=U(64*64*4),i=new ArrayBuffer(12),c=new Uint32Array(i);c[0]=64,c[1]=64,c[2]=64;const u=L(i),l=q(Ie,4),d=O().createBindGroup({layout:l.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:s}}]}),f=await Se("Matmul",l,d,[Math.ceil(64/16),Math.ceil(64/16),1],s,64*64*4,a,.001);return n.destroy(),o.destroy(),s.destroy(),u.destroy(),f}async function Ve(){const r=new Float32Array([1,2,3,4,5,6,7,8]),a=new Float32Array(8).fill(1);let n=0;for(let m=0;m<8;m++)n+=r[m]*r[m];const o=Math.sqrt(n/8+1e-6),s=new Float32Array(8);for(let m=0;m<8;m++)s[m]=r[m]/o*a[m];const i=U(r.byteLength,r),c=U(a.byteLength,a),u=U(8*4),l=new ArrayBuffer(8);new Uint32Array(l)[0]=8,new Float32Array(l)[1]=1e-6;const d=L(l),f=q(Ft,4),p=O().createBindGroup({layout:f.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:i}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:u}}]}),g=await Se("RMSNorm",f,p,[1,1,1],u,8*4,s,1e-4);return i.destroy(),c.destroy(),u.destroy(),d.destroy(),g}async function Ye(){const r=new Float32Array([-2,-1,0,1,2,2,1,0,-1,-2]),a=new Float32Array(2*5);for(let d=0;d<2;d++){const f=d*5;let p=-1e30;for(let m=0;m<5;m++)r[f+m]>p&&(p=r[f+m]);let g=0;for(let m=0;m<5;m++){const b=Math.exp(r[f+m]-p);a[f+m]=b,g+=b}for(let m=0;m<5;m++)a[f+m]/=g}const n=U(r.byteLength,r),o=U(r.byteLength),s=new ArrayBuffer(8);new Uint32Array(s)[0]=2,new Uint32Array(s)[1]=5;const i=L(s),c=q(_t,3),u=O().createBindGroup({layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}}]}),l=await Se("Softmax",c,u,[2,1,1],o,r.byteLength,a,1e-4);return n.destroy(),o.destroy(),i.destroy(),l}async function Xe(){const u=new Float32Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]),l=new Float32Array([1,0,-1,1,0,-1,1,0,-1]),d=new Float32Array(1*1*3*3);for(let w=0;w<3;w++)for(let A=0;A<3;A++){let G=0;for(let M=0;M<3;M++)for(let E=0;E<3;E++)G+=u[(w+M)*5+(A+E)]*l[M*3+E];d[w*3+A]=G}const f=U(u.byteLength,u),p=U(l.byteLength,l),g=U(d.byteLength),m=new ArrayBuffer(36),b=new Uint32Array(m);b[0]=1,b[1]=1,b[2]=5,b[3]=5,b[4]=1,b[5]=3,b[6]=3,b[7]=3,b[8]=3;const v=L(m),x=q(Dt,4),S=O().createBindGroup({layout:x.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:g}}]}),B=await Se("Conv2D",x,S,[1,1,3*3],g,d.byteLength,d,1e-4);return f.destroy(),p.destroy(),g.destroy(),v.destroy(),B}async function Qe(){const a=1/Math.sqrt(4),n=1*4*4,o=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),s=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),i=new Float32Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]),c=new Float32Array(i),u=U(o.byteLength,o),l=U(s.byteLength,s),d=U(i.byteLength,i),f=U(n*4),p=U(1*4*4*4),g=new ArrayBuffer(16),m=new Uint32Array(g),b=new Float32Array(g);m[0]=1,m[1]=4,m[2]=4,b[3]=a;const v=L(g),x=q(Wt,6),S=O().createBindGroup({layout:x.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:d}},{binding:4,resource:{buffer:f}},{binding:5,resource:{buffer:p}}]}),B=await Se("Attention",x,S,[1,1,1],f,n*4,c,.001);return u.destroy(),l.destroy(),d.destroy(),f.destroy(),p.destroy(),v.destroy(),B}const on="aether-gpu-benchmark",sn=1,se="results";function Ze(){return new Promise((e,t)=>{const r=indexedDB.open(on,sn);r.onupgradeneeded=()=>{const a=r.result;a.objectStoreNames.contains(se)||a.createObjectStore(se,{keyPath:"id"})},r.onsuccess=()=>e(r.result),r.onerror=()=>t(r.error)})}async function Je(e,t){const r=await Ze(),a=`run_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,n={id:a,timestamp:new Date().toISOString(),device:navigator.userAgent,adapter:t.adapter,os:t.os,browser:t.browser,results:e};return new Promise((o,s)=>{const i=r.transaction(se,"readwrite");i.objectStore(se).put(n),i.oncomplete=()=>o(a),i.onerror=()=>s(i.error)})}async function Ht(){const e=await Ze();return new Promise((t,r)=>{const n=e.transaction(se,"readonly").objectStore(se).getAll();n.onsuccess=()=>t(n.result),n.onerror=()=>r(n.error)})}async function un(){const e=await Ze();return new Promise((t,r)=>{const a=e.transaction(se,"readwrite");a.objectStore(se).clear(),a.oncomplete=()=>t(),a.onerror=()=>r(a.error)})}function cn(e,t){const r={version:"1.0",exportDate:new Date().toISOString(),userAgent:navigator.userAgent,deviceInfo:t??{},results:e.map(a=>({...a,details:a.details??{}}))};return JSON.stringify(r,null,2)}function ln(e,t){const r=`aether-benchmark-${Date.now()}.json`,a=new Blob([e],{type:"application/json"}),n=URL.createObjectURL(a),o=document.createElement("a");o.href=n,o.download=r,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(n)}let X=null,K=!1;function h(e,t=""){if(!X)return;const r=X.querySelector("#bench-log");if(!r)return;const a=document.createElement("div");a.className=`log-entry ${t}`,a.textContent=e,r.appendChild(a),r.scrollTop=r.scrollHeight}function z(e,t){if(!X)return;const r=X.querySelector("#progress-fill"),a=X.querySelector("#progress-label");r&&(r.style.width=e<0?"0%":`${Math.min(e,100)}%`),a&&(a.textContent=t)}function et(e){if(!X)return;const t=X.querySelector("#results-table");if(!t)return;if(e.length===0){t.innerHTML='<div class="empty-state"><p>No results yet</p></div>';return}let r=`<table style="width:100%;border-collapse:collapse;font-size:12px;font-family:var(--mono)">
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
    <tbody>`;for(const a of e){const n=a.success?"color:var(--green)":"color:var(--red)",o=a.success?"PASS":"FAIL";r+=`<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:6px;color:var(--text)">${a.name}</td>
      <td style="padding:6px;color:var(--text-dim)">${a.inputSize}</td>
      <td style="padding:6px;text-align:right;color:var(--text)">${a.executionTimeMs.toFixed(2)} ms</td>
      <td style="padding:6px;text-align:right;color:var(--text)">${a.throughput}</td>
      <td style="padding:6px;text-align:right;color:var(--text-dim)">${qe(a.memoryBytes)}</td>
      <td style="padding:6px;text-align:center;${n}">${o}</td>
    </tr>`}r+="</tbody></table>",t.innerHTML=r}function qe(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function dn(){if(K)return;K=!0;const e=X?.querySelector("#btn-quick");e&&(e.disabled=!0);const t=[];try{h("═══ QUICK BENCHMARK ═══","info"),z(0,"Initializing GPU...");const r=await we();h(`Adapter: ${r.adapterName}`,"ok"),h(`Timestamp query: ${r.timestampQuerySupport?"YES":"NO"}`,""),h("",""),h("── CORRECTNESS TESTS ──","info");const a=[{name:"Vector Add",fn:je},{name:"Matmul",fn:Ke},{name:"Conv2D",fn:Xe},{name:"Softmax",fn:Ye},{name:"RMSNorm",fn:Ve},{name:"Attention",fn:Qe}];let n=!0;for(const u of a)try{const l=await u.fn();h(`  ${l.pass?"✓":"✗"} ${l.name}: ${l.details||""} (max err: ${l.maxError.toExponential(2)})`,l.pass?"ok":"err"),l.pass||(n=!1)}catch(l){h(`  ✗ ${u.name}: FAILED WITH ERROR: ${l.message}`,"err"),n=!1}h(`  ${n?"ALL TESTS PASSED":"SOME TESTS FAILED"}`,n?"ok":"err"),h("",""),h("── BENCHMARKS ──","info"),z(10,"Vector Add..."),h("▸ Vector Addition","info");const o=await zt();for(const u of o)h(`  ${u.name} ${u.inputSize}: ${u.executionTimeMs.toFixed(2)} ms — ${u.throughput} [${u.success?"PASS":"FAIL"}]`,u.success?"ok":"err"),t.push(u);z(30,"Matrix Multiply..."),h("▸ Matrix Multiply","info");const s=await Rt();for(const u of s)h(`  ${u.name} ${u.inputSize}: ${u.executionTimeMs.toFixed(2)} ms — ${u.throughput} [${u.success?"PASS":"FAIL"}]`,u.success?"ok":"err"),t.push(u);z(60,"Softmax..."),h("▸ Softmax","info");const i=await Lt();for(const u of i)h(`  ${u.name} ${u.inputSize}: ${u.executionTimeMs.toFixed(2)} ms — ${u.throughput} [${u.success?"PASS":"FAIL"}]`,u.success?"ok":"err"),t.push(u);z(80,"RMSNorm..."),h("▸ RMSNorm","info");const c=await qt();for(const u of c)h(`  ${u.name} ${u.inputSize}: ${u.executionTimeMs.toFixed(2)} ms — ${u.throughput} [${u.success?"PASS":"FAIL"}]`,u.success?"ok":"err"),t.push(u);z(100,"Done"),h("",""),h("═══ QUICK BENCHMARK COMPLETE ═══","info"),h(`${t.length} tests run`,""),et(t);try{await Je(t,{adapter:r.adapterName,os:tt(),browser:rt()})}catch{}}catch(r){h(`ERROR: ${r.message}`,"err"),z(0,"Error")}finally{K=!1,e&&(e.disabled=!1)}}async function fn(){if(K)return;K=!0;const e=X?.querySelector("#btn-full");e&&(e.disabled=!0);const t=[];try{h("═══ FULL BENCHMARK ═══","info"),z(0,"Initializing GPU...");const r=await we();h(`Adapter: ${r.adapterName}`,"ok"),h("",""),h("── CORRECTNESS TESTS ──","info");const a=[{name:"Vector Add",fn:je},{name:"Matmul",fn:Ke},{name:"Conv2D",fn:Xe},{name:"Softmax",fn:Ye},{name:"RMSNorm",fn:Ve},{name:"Attention",fn:Qe}];for(const o of a)try{const s=await o.fn();h(`  ${s.pass?"✓":"✗"} ${s.name}: ${s.details||""} (max err: ${s.maxError.toExponential(2)})`,s.pass?"ok":"err")}catch(s){h(`  ✗ ${o.name}: FAILED WITH ERROR: ${s.message}`,"err")}const n=[{name:"Vector Addition",fn:zt,pct:10},{name:"Matrix Multiply",fn:Rt,pct:25},{name:"Convolution",fn:tn,pct:40},{name:"Softmax",fn:Lt,pct:55},{name:"RMSNorm",fn:qt,pct:65},{name:"Attention",fn:rn,pct:75},{name:"Memory",fn:()=>nn(r),pct:90}];for(const o of n){z(o.pct,`${o.name}...`),h(`▸ ${o.name}`,"info");try{const s=await o.fn();for(const i of s)h(`  ${i.inputSize}: ${i.executionTimeMs.toFixed(2)} ms — ${i.throughput} [${i.success?"PASS":"FAIL"}]`,i.success?"ok":"err"),t.push(i)}catch(s){h(`  ERROR: ${s.message}`,"err")}}z(100,"Done"),h("",""),h("═══ FULL BENCHMARK COMPLETE ═══","info"),h(`${t.length} tests run`,""),et(t);try{await Je(t,{adapter:r.adapterName,os:tt(),browser:rt()})}catch{}}catch(r){h(`ERROR: ${r.message}`,"err"),z(0,"Error")}finally{K=!1,e&&(e.disabled=!1)}}async function pn(){if(K)return;K=!0;const e=X?.querySelector("#btn-sustained");e&&(e.disabled=!0);const t=[];try{h("═══ SUSTAINED LOAD BENCHMARK ═══","info"),h("This will run 30s + 60s + 180s = 270s total","warn"),h("Keep the screen on and do not switch tabs","warn"),z(0,"Initializing GPU..."),await we();const r=await an((a,n)=>{a>=0&&z(a,n),h(`  ${n}`,"")});for(const a of r)h(`  ${a.name}: ${a.avgGflops.toFixed(1)} GFLOPS avg, throttled=${a.thermalThrottling}`,a.thermalThrottling?"warn":"ok"),t.push(a);z(100,"Done"),h("",""),h("═══ SUSTAINED BENCHMARK COMPLETE ═══","info"),et(t);try{await Je(t,{adapter:(await we()).adapterName,os:tt(),browser:rt()})}catch{}}catch(r){h(`ERROR: ${r.message}`,"err"),z(0,"Error")}finally{K=!1,e&&(e.disabled=!1)}}async function mn(){if(!K){K=!0;try{h("═══ CORRECTNESS TESTS ═══","info"),await we();const e=[{name:"Vector Add",fn:je},{name:"Matmul",fn:Ke},{name:"Conv2D",fn:Xe},{name:"Softmax",fn:Ye},{name:"RMSNorm",fn:Ve},{name:"Attention",fn:Qe}];let t=!0;for(const r of e)try{const a=await r.fn();h(`${a.pass?"✓":"✗"} ${a.name}: ${a.details||""} (max err: ${a.maxError.toExponential(2)})`,a.pass?"ok":"err"),a.pass||(t=!1)}catch(a){h(`✗ ${r.name}: FAILED WITH ERROR: ${a.message}`,"err"),t=!1}h("",""),h(t?"ALL TESTS PASSED":"SOME TESTS FAILED",t?"ok":"err")}catch(e){h(`ERROR: ${e.message}`,"err")}finally{K=!1}}}async function gn(){try{const e=await Ht();if(e.length===0){h("No results to export. Run a benchmark first.","warn");return}const t=e[e.length-1],r=cn(t.results,{adapter:t.adapter,os:t.os,browser:t.browser,timestamp:t.timestamp});ln(r),h("JSON exported","ok")}catch(e){h(`Export error: ${e.message}`,"err")}}async function bn(){try{const e=await Ht();h(`── HISTORY: ${e.length} saved runs ──`,"info");for(const t of e.slice(-5))h(`  ${t.timestamp} — ${t.results.length} results — ${t.adapter}`,"")}catch(e){h(`History error: ${e.message}`,"err")}}async function yn(){try{await un(),h("History cleared","ok")}catch(e){h(`Clear error: ${e.message}`,"err")}}function tt(){const e=navigator.userAgent;if(e.includes("iPhone")||e.includes("iPad")){const t=e.match(/OS (\d+_\d+)/);return`iOS ${t?t[1].replace("_","."):"?"}`}return e.includes("Mac")?"macOS":e.includes("Windows")?"Windows":e.includes("Android")?"Android":"Unknown"}function rt(){const e=navigator.userAgent;return e.includes("Safari")&&!e.includes("Chrome")?"Safari":e.includes("Chrome")&&!e.includes("Edg")?"Chrome":e.includes("Edg")?"Edge":e.includes("Firefox")?"Firefox":"Unknown"}function vn(e){X=e,e.innerHTML=`
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
  `,e.querySelector("#btn-quick")?.addEventListener("click",dn),e.querySelector("#btn-full")?.addEventListener("click",fn),e.querySelector("#btn-sustained")?.addEventListener("click",pn),e.querySelector("#btn-correctness")?.addEventListener("click",mn),e.querySelector("#btn-export")?.addEventListener("click",gn),e.querySelector("#btn-history")?.addEventListener("click",bn),e.querySelector("#btn-clear")?.addEventListener("click",yn);const t=r=>{r.preventDefault()};window.addEventListener("error",t),window.addEventListener("unhandledrejection",t),we().then(r=>{const a=e.querySelector("#device-badge"),n=e.querySelector("#device-info");a&&(a.textContent="WEBGPU READY",a.className="badge badge-pass"),n&&(n.innerHTML=`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
          <span>Adapter:</span><span style="color:var(--text)">${r.adapterName}</span>
          <span>Vendor:</span><span style="color:var(--text)">${r.adapterVendor}</span>
          <span>Features:</span><span style="color:var(--text)">${r.adapterFeatures.length}</span>
          <span>Max Buffer:</span><span style="color:var(--text)">${qe(r.maxBufferSize)}</span>
          <span>Max Storage:</span><span style="color:var(--text)">${qe(r.maxStorageBufferBindingSize)}</span>
          <span>Workgroup X:</span><span style="color:var(--text)">${r.maxComputeWorkgroupSizeX}</span>
          <span>Invocations/wg:</span><span style="color:var(--text)">${r.maxComputeInvocationsPerWorkgroup}</span>
          <span>Timestamp Query:</span><span style="color:var(--text)">${r.timestampQuerySupport?"YES":"NO"}</span>
          <span>Preferred Format:</span><span style="color:var(--text)">${r.preferredCanvasFormat??"N/A"}</span>
          <span>Fallback:</span><span style="color:var(--text)">${r.isFallbackAdapter?"YES (software)":"NO (hardware)"}</span>
        </div>
      `)}).catch(r=>{const a=e.querySelector("#device-badge");a&&(a.textContent="WEBGPU UNAVAILABLE",a.className="badge badge-fail")})}const wn=Object.freeze(Object.defineProperty({__proto__:null,render:vn},Symbol.toStringTag,{value:"Module"})),nt=[{id:"gpubench",label:"GPU Bench",module:wn},{id:"device",label:"Device Test",module:Jt},{id:"webgpudiag",label:"WebGPU Diag",module:Xr},{id:"model",label:"Model Test",module:cr},{id:"tensor",label:"Tensor Bench",module:Kr},{id:"image",label:"Image Test",module:dr},{id:"video",label:"Video Test",module:gr},{id:"diag",label:"Diagnostics",module:wr}];let It="gpubench";function Mt(){const e=window.location.hash.replace("#","");return nt.some(t=>t.id===e)?e:e==="diagnostics/webgpu"||e==="webgpu"?"webgpudiag":"gpubench"}function We(e){It=e,window.location.hash=e;const t=document.getElementById("nav"),r=document.getElementById("screen");t.querySelectorAll("button").forEach(n=>{n.classList.toggle("active",n.dataset.screen===e)});const a=nt.find(n=>n.id===e);a&&a.module.render(r)}function hn(){const e=document.getElementById("app");e.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const t=document.getElementById("nav");document.getElementById("screen"),nt.forEach(a=>{const n=document.createElement("button");n.textContent=a.label,n.dataset.screen=a.id,n.addEventListener("click",()=>We(a.id)),t.appendChild(n)});const r=Mt();We(r),window.addEventListener("hashchange",()=>{const a=Mt();a!==It&&We(a)}),"serviceWorker"in navigator&&navigator.serviceWorker.register("/AETHER/sw.js").catch(()=>{})}hn();
