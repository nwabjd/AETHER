(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();function Vt(e){let t="Unknown",r="Unknown",a="Unknown",n="Unknown";const o=e.match(/OS (\d+)_(\d+)/);o&&(a="iOS",n=`${o[1]}.${o[2]}`);const s=e.match(/Mac OS X (\d+)[_.](\d+)/);if(s&&(a="macOS",n=`${s[1]}.${s[2]}`),e.includes("Windows")){a="Windows";const c=e.match(/Windows NT (\d+\.\d+)/);c&&(n=c[1])}if(e.includes("Android")){a="Android";const c=e.match(/Android (\d+[\.\d]*)/);c&&(n=c[1])}if(e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")){t="Safari";const c=e.match(/Version\/(\d+[\.\d]*)/);c&&(r=c[1])}if(e.includes("Chrome")&&!e.includes("Edg")){t="Chrome";const c=e.match(/Chrome\/(\d+[\.\d]*)/);c&&(r=c[1])}if(e.includes("Edg/")){t="Edge";const c=e.match(/Edg\/(\d+[\.\d]*)/);c&&(r=c[1])}if(e.includes("Firefox")){t="Firefox";const c=e.match(/Firefox\/(\d+[\.\d]*)/);c&&(r=c[1])}return{browserName:t,browserVersion:r,osName:a,osVersion:n}}function Yt(e){return!!(e.includes("FBAN")||e.includes("FBIOS")||e.includes("Twitter")||e.includes("Instagram")||e.includes("Line/")||e.includes("WeChat")||e.includes("MicroMessenger")||e.includes("CocoaPods")||e.includes("wv)")||e.includes("Electron")||e.includes("; wv)"))}function Xt(e){return e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")}async function Ne(){const e=navigator.userAgent,t=Vt(e),r=t.osName==="iOS",a=Xt(e),n=Yt(e),o=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,s={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:e,platform:navigator.platform,isIOS:r,isSafari:a,isWebView:n,isStandalone:o,browserName:t.browserName,browserVersion:t.browserVersion,osName:t.osName,osVersion:t.osVersion},i={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(n)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:s,gpu:i};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:r?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:s,gpu:i};if(!navigator.gpu){let c="navigator.gpu is undefined. WebGPU API is not exposed.",u="";if(r){if(parseInt(t.osVersion.split(".")[0],10)<26)return c=`iOS ${t.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,u="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:c,recommendation:u,environment:s,gpu:i};if(t.browserName!=="Safari")return c=`Running ${t.browserName} on iOS ${t.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,u="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:c,recommendation:u,environment:s,gpu:i}}return t.osName==="macOS"&&parseInt(t.osVersion.split(".")[0],10)<14?(c=`macOS ${t.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,u="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:c,recommendation:u,environment:s,gpu:i}):(u="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:c,recommendation:u,environment:s,gpu:i})}try{const c=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!c){i.adapterError="requestAdapter() returned null";let d="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",f="";return r?parseInt(t.osVersion.split(".")[0],10)>=26&&(d=`iOS ${t.osVersion} with Safari ${t.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,f="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(d="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",f="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):f="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:d,recommendation:f,environment:s,gpu:i}}i.adapterName=c.name??"Unknown GPU",i.adapterVendor=c.vendor??"Unknown",i.adapterDevice=c.device??"Unknown",i.isFallbackAdapter=c.isFallbackAdapter??!1;const u=[];for(const d of c.features)u.push(d.replace(/-/g," ").replace(/\b\w/g,f=>f.toUpperCase()));i.features=u;const l=c.limits;i.limits={maxBufferSize:l.maxBufferSize,maxTextureDimension1D:l.maxTextureDimension1D,maxTextureDimension2D:l.maxTextureDimension2D,maxTextureDimension3D:l.maxTextureDimension3D,maxComputeWorkgroupStorageSize:l.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:l.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:l.maxStorageBufferBindingSize,maxUniformBufferBindingSize:l.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:l.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:l.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:l.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:l.maxComputeWorkgroupsPerDimension,maxColorAttachments:l.maxColorAttachments,minStorageBufferOffsetAlignment:l.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:l.minUniformBufferOffsetAlignment};try{(await c.requestDevice({requiredLimits:{}})).destroy()}catch(d){return i.deviceError=d.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${i.adapterName}) but requestDevice() failed: ${d.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:s,gpu:i}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${i.adapterName}.`,recommendation:"No action needed.",environment:s,gpu:i}}catch(c){return i.adapterError=c.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${c.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:s,gpu:i}}}function $t(e){const t=[];if(t.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),t.push(""),t.push(`STATUS: ${e.statusLabel}`),t.push(`CASE: ${e.case}`),t.push(`REASON: ${e.reason}`),t.push(`RECOMMENDATION: ${e.recommendation}`),t.push(""),t.push("── ENVIRONMENT ──"),t.push(`  URL: ${e.environment.url}`),t.push(`  Protocol: ${e.environment.protocol}`),t.push(`  Hostname: ${e.environment.hostname}`),t.push(`  Secure Context: ${e.environment.isSecureContext}`),t.push(`  iOS: ${e.environment.isIOS}`),t.push(`  Safari: ${e.environment.isSafari}`),t.push(`  WebView: ${e.environment.isWebView}`),t.push(`  Standalone PWA: ${e.environment.isStandalone}`),t.push(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`),t.push(`  OS: ${e.environment.osName} ${e.environment.osVersion}`),t.push(`  Platform: ${e.environment.platform}`),t.push(`  User Agent: ${e.environment.userAgent}`),t.push(""),t.push("── WEBGPU ──"),t.push(`  navigator.gpu exists: ${e.gpu.navigatorGpuExists}`),e.gpu.adapterName&&t.push(`  Adapter: ${e.gpu.adapterName}`),e.gpu.adapterVendor&&t.push(`  Vendor: ${e.gpu.adapterVendor}`),e.gpu.adapterDevice&&t.push(`  Device: ${e.gpu.adapterDevice}`),e.gpu.adapterError&&t.push(`  Adapter Error: ${e.gpu.adapterError}`),e.gpu.deviceError&&t.push(`  Device Error: ${e.gpu.deviceError}`),t.push(`  Fallback adapter: ${e.gpu.isFallbackAdapter}`),e.gpu.features.length>0){t.push(`  Features (${e.gpu.features.length}):`);for(const r of e.gpu.features)t.push(`    ${r}`)}if(e.gpu.limits){t.push("  Limits:");for(const[r,a]of Object.entries(e.gpu.limits))t.push(`    ${r}: ${typeof a=="number"?a.toLocaleString():a}`)}return t.push(""),t.push(`Timestamp: ${new Date().toISOString()}`),t.join(`
`)}function Pe(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function ce(){const e=await Ne();if(!e.ready||!e.gpu.adapterName)return null;const t=e.gpu.limits;return{available:!0,adapterName:e.gpu.adapterName,adapterVendor:e.gpu.adapterVendor,adapterDevice:e.gpu.adapterDevice,features:e.gpu.features,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:e.gpu.isFallbackAdapter,featuresMap:new Set(e.gpu.features),diagnostic:e}}async function le(e,t=[]){const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("Failed to re-acquire GPU adapter");const a=await r.requestDevice({requiredFeatures:t.filter(n=>e.featuresMap.has(n)),requiredLimits:{}});return a.lost.then(n=>{console.error("WebGPU device lost:",n.message)}),a}function Qt(e){const t=e.environment,r=e.gpu;let a="badge-fail";e.case==="D"?a="badge-pass":(e.case==="B"||e.case==="C")&&(a="badge-warn");let n=`
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
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${Pe(r.limits.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${r.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${r.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${r.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${Pe(r.limits.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${Pe(r.limits.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${Pe(r.limits.maxComputeWorkgroupStorageSize)}</span></div>
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
      `:t.innerHTML="",r.innerHTML=Qt(a)})}const Jt=Object.freeze(Object.defineProperty({__proto__:null,render:Zt},Symbol.toStringTag,{value:"Module"}));let T=class Et{buffer;shape;dtype;size;device;constructor(t,r,a="f32"){this.device=t,this.shape=[...r],this.dtype=a,this.size=r.reduce((s,i)=>s*i,1);const n=a==="f32"?4:a==="f16"?2:4;this.buffer=t.createBuffer({size:this.size*n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(a==="f32"?new Float32Array(this.buffer.getMappedRange()):a==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(t,r,a){const n=new Et(t,a,r instanceof Float32Array?"f32":"i32");return t.queue.writeBuffer(n.buffer,0,r.buffer),n}async readback(){const t=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r=this.device.createCommandEncoder();r.copyBufferToBuffer(this.buffer,0,t,0,this.buffer.size),this.device.queue.submit([r.finish()]),await t.mapAsync(GPUMapMode.READ);const a=new Float32Array(t.getMappedRange().slice(0));return t.unmap(),t.destroy(),a}destroy(){this.buffer.destroy()}};async function Se(e,t,r=50,a){const n=[];for(let u=0;u<Math.min(5,r);u++)await t();for(let u=0;u<r;u++){const l=performance.now();await t(),await Tt?.queue.onSubmittedWorkDone();const d=performance.now();n.push(d-l)}n.sort((u,l)=>u-l);const o=n.reduce((u,l)=>u+l,0)/n.length,s=n[0],i=n[n.length-1],c={name:e,avgMs:o,minMs:s,maxMs:i,iterations:r};if(a){const l=a/(o/1e3)/1e9;c.gflops=l,c.throughput=`${l.toFixed(2)} GFLOPS`}return c}let Tt=null;function fe(e){Tt=e}function Be(e){const t=[`${e.name}: ${e.avgMs.toFixed(2)} ms avg`,`(${e.minMs.toFixed(2)} – ${e.maxMs.toFixed(2)} ms)`,`[${e.iterations} iterations]`];return e.throughput&&t.push(e.throughput),t.join(" ")}const Oe=`
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
`;let y=null,me=null;function E(e,t=""){if(!me)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,me.appendChild(r),me.scrollTop=me.scrollHeight}async function st(){E("═══ TINY NEURAL NETWORK TEST ═══","info"),E("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),E("");const e=await ce();if(!e)return E("WebGPU not available","err"),!1;y=await le(e),fe(y);const t=performance.now(),r=T.fromData(y,new Float32Array([1,.5,-.3,.8]),[4]),a=T.fromData(y,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),n=T.fromData(y,new Float32Array([.1,-.1,.2]),[3]),o=new ArrayBuffer(12),s=new Uint32Array(o);s[0]=1,s[1]=3,s[2]=4;const i=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:y.createShaderModule({code:Oe}),entryPoint:"main"}}),u=y.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(u,0,o);const l=new T(y,[1,3]),d=y.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:a.buffer}},{binding:3,resource:{buffer:l.buffer}}]});let f=y.createCommandEncoder(),p=f.beginComputePass();p.setPipeline(c),p.setBindGroup(0,d),p.dispatchWorkgroups(1,1,1),p.end(),y.queue.submit([f.finish()]),E(`  input[4]:  [${Array.from(await r.readback()).map(_=>_.toFixed(2)).join(", ")}]`,""),E("  W1[4×3]:   4 rows × 3 cols",""),E("  Matmul result: computing...","");const m=await l.readback();E(`  h1 = input @ W1: [${Array.from(m).map(_=>_.toFixed(3)).join(", ")}]`,"ok");for(let _=0;_<3;_++)m[_]+=[.1,-.1,.2][_];y.queue.writeBuffer(l.buffer,0,m.buffer),E(`  h1 + bias:       [${Array.from(m).map(_=>_.toFixed(3)).join(", ")}]`,"ok");const g=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),b=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[g]}),compute:{module:y.createShaderModule({code:er}),entryPoint:"main"}}),v=new ArrayBuffer(4);new Uint32Array(v)[0]=3;const h=y.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(h,0,v);const S=y.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:l.buffer}}]});f=y.createCommandEncoder(),p=f.beginComputePass(),p.setPipeline(b),p.setBindGroup(0,S),p.dispatchWorkgroups(1,1,1),p.end(),y.queue.submit([f.finish()]);const A=await l.readback();E(`  ReLU(h1):         [${Array.from(A).map(_=>_.toFixed(3)).join(", ")}]`,"ok");const w=T.fromData(y,new Float32Array([.7,-.3,.5]),[3,1]),B=new T(y,[1,1]),k=new ArrayBuffer(12),P=new Uint32Array(k);P[0]=1,P[1]=1,P[2]=3;const G=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),W=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[G]}),compute:{module:y.createShaderModule({code:Oe}),entryPoint:"main"}}),re=y.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(re,0,k);const de=y.createBindGroup({layout:G,entries:[{binding:0,resource:{buffer:re}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:w.buffer}},{binding:3,resource:{buffer:B.buffer}}]});f=y.createCommandEncoder(),p=f.beginComputePass(),p.setPipeline(W),p.setBindGroup(0,de),p.dispatchWorkgroups(1,1,1),p.end(),y.queue.submit([f.finish()]);const Ae=await B.readback(),Ue=(performance.now()-t).toFixed(1);return E(`  Final output: ${Ae[0].toFixed(4)}`,"ok"),E(`  Total pipeline: ${Ue} ms`,"ok"),E("",""),E("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),r.destroy(),a.destroy(),n.destroy(),l.destroy(),w.destroy(),B.destroy(),u.destroy(),re.destroy(),h.destroy(),y.destroy(),!0}async function or(){E("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const e=await ce();if(!e)return null;y=await le(e),fe(y);const t=[64,128,256,512],r=[];for(const a of t){const n=T.fromData(y,new Float32Array(a*a).fill(1),[a,a]),o=T.fromData(y,new Float32Array(a*a).fill(.5),[a,a]),s=new T(y,[a,a]),i=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:y.createShaderModule({code:Oe}),entryPoint:"main"}}),u=new ArrayBuffer(12),l=new Uint32Array(u);l[0]=a,l[1]=a,l[2]=a;const d=await Se(`${a}×${a} matmul`,async()=>{const f=y.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(f,0,u);const p=y.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:s.buffer}}]}),m=y.createCommandEncoder(),g=m.beginComputePass();g.setPipeline(c),g.setBindGroup(0,p);const b=Math.ceil(a/16);g.dispatchWorkgroups(b,b,1),g.end(),y.queue.submit([m.finish()]),f.destroy()},30,2*a*a*a);r.push(d),E(Be(d),"ok"),n.destroy(),o.destroy(),s.destroy()}return y.destroy(),r[r.length-1]}async function sr(){E("═══ CONVOLUTION BENCHMARK ═══","info");const e=await ce();if(!e)return null;y=await le(e),fe(y);const t=1,r=3,a=32,n=32,o=8,s=3,i=3,c=a-s+1,u=n-i+1,l=T.fromData(y,new Float32Array(t*r*a*n).fill(.5),[t,r,a,n]),d=T.fromData(y,new Float32Array(o*r*s*i).fill(.1),[o,r,s,i]),f=new T(y,[t,o,c,u]),p=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),m=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[p]}),compute:{module:y.createShaderModule({code:tr}),entryPoint:"main"}}),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=t,b[1]=r,b[2]=a,b[3]=n,b[4]=o,b[5]=s,b[6]=i,b[7]=c,b[8]=u;const v=await Se(`Conv2D ${t}×${r}×${a}×${n} k=${s}→${o}×${c}×${u}`,async()=>{const h=y.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(h,0,g);const S=y.createBindGroup({layout:p,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:d.buffer}},{binding:3,resource:{buffer:f.buffer}}]}),A=y.createCommandEncoder(),w=A.beginComputePass();w.setPipeline(m),w.setBindGroup(0,S),w.dispatchWorkgroups(t,o,1),w.end(),y.queue.submit([A.finish()]),h.destroy()},20,2*t*o*r*s*i*c*u);return E(Be(v),"ok"),l.destroy(),d.destroy(),f.destroy(),y.destroy(),v}async function ir(){E("═══ ATTENTION BENCHMARK ═══","info");const e=await ce();if(!e)return null;y=await le(e),fe(y);const t=1,r=64,a=64,n=1/Math.sqrt(a),o=T.fromData(y,new Float32Array(t*r*a).fill(.1),[t,r,a]),s=T.fromData(y,new Float32Array(t*r*a).fill(.1),[t,r,a]),i=T.fromData(y,new Float32Array(t*r*a).fill(.1),[t,r,a]),c=new T(y,[t,r,a]),u=new T(y,[t,r,r]),l=y.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),d=y.createComputePipeline({layout:y.createPipelineLayout({bindGroupLayouts:[l]}),compute:{module:y.createShaderModule({code:rr}),entryPoint:"main"}}),f=new ArrayBuffer(16),p=new Uint32Array(f),m=new Float32Array(f);p[0]=t,p[1]=r,p[2]=a,m[3]=n;const g=await Se(`Attention b=${t} s=${r} d=${a}`,async()=>{const b=y.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.queue.writeBuffer(b,0,f);const v=y.createBindGroup({layout:l,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}},{binding:4,resource:{buffer:c.buffer}},{binding:5,resource:{buffer:u.buffer}}]}),h=y.createCommandEncoder(),S=h.beginComputePass();S.setPipeline(d),S.setBindGroup(0,v),S.dispatchWorkgroups(t,1,1),S.end(),y.queue.submit([h.finish()]),b.destroy()},20);return E(Be(g),"ok"),o.destroy(),s.destroy(),i.destroy(),c.destroy(),u.destroy(),y.destroy(),g}function ur(e){e.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,me=e.querySelector("#model-log"),e.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{me.innerHTML="",await st()}),e.querySelector("#btn-all-bench").addEventListener("click",async()=>{me.innerHTML="",await st(),E("",""),await or(),E("",""),await sr(),E("",""),await ir(),E("",""),E("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const cr=Object.freeze(Object.defineProperty({__proto__:null,render:ur},Symbol.toStringTag,{value:"Module"}));let $=null,ie=null;function Y(e,t=""){if(!ie)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,ie.appendChild(r),ie.scrollTop=ie.scrollHeight}function kt(e,t){const r=new Float32Array(e*t*4);for(let a=0;a<t;a++)for(let n=0;n<e;n++){const o=(a*e+n)*4,s=(n>>4)+(a>>4)&1;r[o+0]=s?.9:n/e*.8,r[o+1]=s?.3:a/t*.6,r[o+2]=s?.6:.4,r[o+3]=1}return r}function ze(e,t,r){const a=document.createElement("canvas");a.width=t,a.height=r;const n=a.getContext("2d"),o=n.createImageData(t,r);for(let s=0;s<t*r*4;s++)o.data[s]=Math.round(e[s]*255);return n.putImageData(o,0,0),a}async function it(){Y("═══ GRAYSCALE TEST ═══","info");const e=await ce();if(!e){Y("WebGPU unavailable","err");return}$=await le(e),fe($);const t=256,r=256,a=kt(t,r),n=T.fromData($,a,[t*r*4]),o=new T($,[t*r*4]),s=$.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=$.createComputePipeline({layout:$.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:$.createShaderModule({code:ar}),entryPoint:"main"}}),c=new ArrayBuffer(4);new Uint32Array(c)[0]=t*r;const u=await Se("Grayscale 256×256",async()=>{const m=$.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});$.queue.writeBuffer(m,0,c);const g=$.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:o.buffer}}]}),b=$.createCommandEncoder(),v=b.beginComputePass();v.setPipeline(i),v.setBindGroup(0,g),v.dispatchWorkgroups(Math.ceil(t*r/256),1,1),v.end(),$.queue.submit([b.finish()]),m.destroy()},50);Y(Be(u),"ok");const l=await o.readback(),d=ze(a,t,r),f=ze(l,t,r),p=Ie?.querySelector("#image-display");if(p){p.innerHTML="";const m=document.createElement("div");m.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const g=document.createElement("div");g.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',g.appendChild(d);const b=document.createElement("div");b.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',b.appendChild(f),m.appendChild(g),m.appendChild(b),p.appendChild(m)}n.destroy(),o.destroy(),$.destroy(),Y("✓ Grayscale complete","ok")}async function ut(){Y("═══ CONVOLUTION KERNEL TEST ═══","info");const e=await ce();if(!e){Y("WebGPU unavailable","err");return}$=await le(e),fe($);const t=128,r=128,a=3,n=kt(t,r),o={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},s=$.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=$.createComputePipeline({layout:$.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:$.createShaderModule({code:nr}),entryPoint:"main"}}),c=new ArrayBuffer(16),u=new Uint32Array(c);u[0]=t,u[1]=r,u[2]=a,u[3]=0;for(const[l,d]of Object.entries(o)){const f=T.fromData($,n,[t*r*4]),p=T.fromData($,d,[a*a]),m=new T($,[t*r*4]),g=await Se(`Conv ${l} ${t}×${r}`,async()=>{const h=$.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});$.queue.writeBuffer(h,0,c);const S=$.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:p.buffer}},{binding:2,resource:{buffer:f.buffer}},{binding:3,resource:{buffer:m.buffer}}]}),A=$.createCommandEncoder(),w=A.beginComputePass();w.setPipeline(i),w.setBindGroup(0,S),w.dispatchWorkgroups(Math.ceil(t/16),Math.ceil(r/16),1),w.end(),$.queue.submit([A.finish()]),h.destroy()},30);Y(Be(g),"ok");const b=await m.readback(),v=Ie?.querySelector("#image-display");if(v){const h=ze(b,t,r),S=document.createElement("div");S.style.cssText="display:inline-block;margin:4px",S.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${l}</div>`,S.appendChild(h),v.appendChild(S)}f.destroy(),p.destroy(),m.destroy()}$.destroy(),Y("✓ All convolution kernels applied","ok")}let Ie=null;function lr(e){Ie=e,e.innerHTML=`
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
  `,ie=e.querySelector("#image-log"),e.querySelector("#btn-grayscale").addEventListener("click",async()=>{ie.innerHTML="",e.querySelector("#image-display").innerHTML="",await it()}),e.querySelector("#btn-conv").addEventListener("click",async()=>{ie.innerHTML="",e.querySelector("#image-display").innerHTML="",await ut()}),e.querySelector("#btn-all-img").addEventListener("click",async()=>{ie.innerHTML="",e.querySelector("#image-display").innerHTML="",await it(),Y("",""),await ut(),Y("",""),Y("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const fr=Object.freeze(Object.defineProperty({__proto__:null,render:lr},Symbol.toStringTag,{value:"Module"}));let F=null,Me=null,Te=null;function Re(e,t=""){if(!Me)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Me.appendChild(r),Me.scrollTop=Me.scrollHeight}const dr=`
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
`;let Le=0,ke=0;async function pr(e,t,r,a,n){const o=await ce();if(!o){Re("WebGPU unavailable","err");return}F=await le(o),fe(F);const[s,i]=a.value.split("x").map(Number);e.width=s,e.height=i,Le=parseInt(n.value);const c=F.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=F.createComputePipeline({layout:F.createPipelineLayout({bindGroupLayouts:[c]}),compute:{module:F.createShaderModule({code:dr}),entryPoint:"main"}}),l=F.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),d=e.getContext("2d"),f=F.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let p=performance.now(),m=0,g=0;t.textContent="RENDERING",t.className="badge badge-pass";function b(){const v=new ArrayBuffer(16),h=new Uint32Array(v);h[0]=s,h[1]=i,h[2]=ke,h[3]=Le,F.queue.writeBuffer(f,0,v);const S=F.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:l}}]}),A=F.createCommandEncoder(),w=A.beginComputePass();w.setPipeline(u),w.setBindGroup(0,S),w.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(i/16),1),w.end();const B=F.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});A.copyBufferToBuffer(l,0,B,0,s*i*4*4),F.queue.submit([A.finish()]),B.mapAsync(GPUMapMode.READ).then(()=>{const k=new Float32Array(B.getMappedRange().slice(0));B.unmap(),B.destroy();const P=d.createImageData(s,i);for(let W=0;W<s*i*4;W++)P.data[W]=Math.round(k[W]*255);d.putImageData(P,0,0),ke++,g++;const G=performance.now();G-p>=1e3&&(m=Math.round(g*1e3/(G-p)),r.textContent=`${m} FPS | Frame ${ke} | ${s}×${i}`,g=0,p=G),Te=requestAnimationFrame(b)})}b()}function ct(){Te!==null&&(cancelAnimationFrame(Te),Te=null),F&&(F.destroy(),F=null)}function mr(e){e.innerHTML=`
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
  `,Me=e.querySelector("#video-log");const t=e.querySelector("#video-canvas"),r=e.querySelector("#video-status"),a=e.querySelector("#video-fps"),n=e.querySelector("#res-select"),o=e.querySelector("#mode-select");e.querySelector("#btn-start").addEventListener("click",()=>{ct(),ke=0,Le=parseInt(o.value),Re(`Starting GPU compute video: ${n.value} mode=${o.value}`,"info"),pr(t,r,a,n,o)}),e.querySelector("#btn-stop").addEventListener("click",()=>{ct(),r.textContent="STOPPED",r.className="badge badge-info",Re("Rendering stopped","warn")})}const gr=Object.freeze(Object.defineProperty({__proto__:null,render:mr},Symbol.toStringTag,{value:"Module"}));let ve=null;function C(e,t=""){if(!ve)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,ve.appendChild(r),ve.scrollTop=ve.scrollHeight}async function br(){if(ve.innerHTML="",C("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),C(`Timestamp: ${new Date().toISOString()}`,""),!await yr())return;const t=await ce();if(!t){C("Cannot proceed: GPU not ready","err");return}C("",""),C("── MEMORY TEST ──","info");const r=await le(t);fe(r);const a=Math.floor(t.limits.maxBufferSize/1048576);C(`Attempting to allocate buffer at reported max: ${a} MB`,"");try{const n=r.createBuffer({size:t.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});C("Buffer allocation at max: SUCCESS","ok"),n.destroy()}catch(n){C(`Buffer allocation at max: FAILED — ${n.message}`,"warn");for(const o of[256,128,64,32])try{const s=r.createBuffer({size:o*1048576,usage:GPUBufferUsage.STORAGE});C(`Largest successful allocation: ${o} MB`,"ok"),s.destroy();break}catch{continue}}C("",""),C("── COMPUTE THROUGHPUT ──","info");for(const n of[64,128,256]){const o=T.fromData(r,new Float32Array(n*n).fill(1),[n,n]),s=T.fromData(r,new Float32Array(n*n).fill(1),[n,n]),i=new T(r,[n,n]),c=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[c]}),compute:{module:r.createShaderModule({code:Oe}),entryPoint:"main"}}),l=await Se(`matmul ${n}×${n}`,async()=>{const d=r.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),f=new ArrayBuffer(12);new Uint32Array(f).set([n,n,n]),r.queue.writeBuffer(d,0,f);const p=r.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),m=r.createCommandEncoder(),g=m.beginComputePass();g.setPipeline(u),g.setBindGroup(0,p);const b=Math.ceil(n/16);g.dispatchWorkgroups(b,b,1),g.end(),r.queue.submit([m.finish()]),d.destroy()},30,2*n*n*n);C(Be(l),"ok"),o.destroy(),s.destroy(),i.destroy()}r.destroy(),C("",""),C("═══ DIAGNOSTICS COMPLETE ═══","info")}async function yr(){const e=await Ne();return $t(e),C("── WEBGPU STATUS ──","info"),C(`${e.statusLabel} (Case ${e.case})`,e.ready?"ok":"err"),C(`Reason: ${e.reason}`,""),C(`Recommendation: ${e.recommendation}`,""),C("",""),C("── ENVIRONMENT ──","info"),C(`  URL: ${e.environment.url}`,""),C(`  Secure Context: ${e.environment.isSecureContext}`,e.environment.isSecureContext?"ok":"err"),C(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`,""),C(`  OS: ${e.environment.osName} ${e.environment.osVersion}`,""),C(`  iOS: ${e.environment.isIOS}`,""),C(`  Safari: ${e.environment.isSafari}`,""),C(`  WebView: ${e.environment.isWebView}`,e.environment.isWebView?"err":""),C(`  navigator.gpu: ${e.gpu.navigatorGpuExists}`,e.gpu.navigatorGpuExists?"ok":"err"),e.gpu.adapterName&&(C(`  Adapter: ${e.gpu.adapterName}`,"ok"),C(`  Vendor: ${e.gpu.adapterVendor}`,"")),e.gpu.adapterError&&C(`  Adapter Error: ${e.gpu.adapterError}`,"err"),e.gpu.deviceError&&C(`  Device Error: ${e.gpu.deviceError}`,"err"),e.ready?!0:(C("",""),C("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function vr(e){e.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,ve=e.querySelector("#diag-log"),e.querySelector("#btn-diag").addEventListener("click",()=>{br()})}const wr=Object.freeze(Object.defineProperty({__proto__:null,render:vr},Symbol.toStringTag,{value:"Module"}));class se{dims;ndim;size;strides;constructor(t){this.dims=typeof t=="number"?[t]:[...t],this.ndim=this.dims.length,this.size=this.dims.reduce((n,o)=>n*o,1);const r=new Array(this.ndim);let a=1;for(let n=this.ndim-1;n>=0;n--)r[n]=a,a*=this.dims[n];this.strides=r}equals(t){if(this.ndim!==t.ndim)return!1;for(let r=0;r<this.ndim;r++)if(this.dims[r]!==t.dims[r])return!1;return!0}isContiguous(){let t=1;for(let r=this.ndim-1;r>=0;r--){if(this.strides[r]!==t)return!1;t*=this.dims[r]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new se([1])}static from(...t){return new se(t)}}var ne=(e=>(e.Float32="f32",e.Float16="f16",e.Int32="i32",e.Int8="i8",e.Uint8="u8",e))(ne||{});const hr={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function Ot(e){return hr[e].bytes}let ee=null;async function xr(){if(ee)return ee;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.limits,r=new Set(e.features),a=await e.requestDevice({requiredLimits:{}});return a.lost.then(n=>{console.error("WebGPU device lost:",n.message),ee=null}),ee={adapter:e,device:a,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:t.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:t.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:t.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:t.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:t.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:t.maxTextureArrayLayers},features:r},ee}function D(){if(!ee)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return ee}function Sr(){ee&&(ee.device.destroy(),ee=null)}class we{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(t,r,a){this.shape=t,this.dtype=r,this.byteSize=t.size*Ot(r),this.gpuBuffer=a??D().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(t,r,a=ne.Float32){const n=D(),o=new we(t,a);return n.device.queue.writeBuffer(o.gpuBuffer,0,r.buffer,r.byteOffset,r.byteLength),o}async readback(){const t=D(),r=t.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),a=t.device.createCommandEncoder();a.copyBufferToBuffer(this.gpuBuffer,0,r,0,this.byteSize),t.device.queue.submit([a.finish()]),await r.mapAsync(GPUMapMode.READ);const n=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),n}destroy(){this.gpuBuffer.destroy()}}class M{shape;dtype;buffer;constructor(t,r=ne.Float32,a){this.shape=t,this.dtype=r,this.buffer=a??new we(t,r)}static fromFloat32(t,r){const a=t instanceof Float32Array?t:new Float32Array(t),n=new se(r);return new M(n,ne.Float32,we.fromData(n,a,ne.Float32))}static fromInt32(t,r){const a=t instanceof Int32Array?t:new Int32Array(t),n=new se(r);return new M(n,ne.Int32,we.fromData(n,a,ne.Int32))}static zeros(t,r=ne.Float32){const a=new se(t),n=a.size*Ot(r),s=D().device.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(s.getMappedRange()).fill(0),s.unmap();const i=new we(a,r,s);return new M(a,r,i)}static ones(t,r=ne.Float32){const a=new se(t).size,n=new Float32Array(a).fill(1);return M.fromFloat32(n,t)}static randn(t){const r=new se(t).size,a=new Float32Array(r);for(let n=0;n<r;n++){const o=Math.random(),s=Math.random();a[n]=Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*s)}return M.fromFloat32(a,t)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class Br{cache=new Map;getOrCreate(t,r,a){if(this.cache.has(t))return this.cache.get(t);const n=D(),o=n.device.createComputePipeline({layout:n.device.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:n.device.createShaderModule({code:r}),entryPoint:"main"}});return this.cache.set(t,o),o}get(t){return this.cache.get(t)}clear(){this.cache.clear()}}const Ar=`
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
`,Mr=`
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
  C[i] = A[i] * B[i];
}
`,Ur=`
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
`,Pr=`
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
`;function Gr(e,t,r,a,n){const o=new Float32Array(r*a);for(let s=0;s<r;s++)for(let i=0;i<a;i++){let c=0;for(let u=0;u<n;u++)c+=e[s*n+u]*t[u*a+i];o[s*a+i]=c}return o}function Nr(e,t){const r=new Float32Array(e.length);for(let a=0;a<e.length;a++)r[a]=e[a]+t[a];return r}function Dr(e,t){const r=new Float32Array(e.length);for(let a=0;a<e.length;a++)r[a]=e[a]*t[a];return r}function _r(e,t,r=1e-6){const a=e.length;let n=0;for(let i=0;i<a;i++)n+=e[i]*e[i];const o=Math.sqrt(n/a+r),s=new Float32Array(a);for(let i=0;i<a;i++)s[i]=e[i]/o*t[i];return s}function Fr(e,t,r,a=1e-6){const n=e.length;let o=0;for(let u=0;u<n;u++)o+=e[u];o/=n;let s=0;for(let u=0;u<n;u++){const l=e[u]-o;s+=l*l}s/=n;const i=1/Math.sqrt(s+a),c=new Float32Array(n);for(let u=0;u<n;u++)c[u]=(e[u]-o)*i*t[u]+r[u];return c}function Wr(e,t,r){const a=new Float32Array(e.length);for(let n=0;n<t;n++){const o=n*r;let s=-1e30;for(let c=0;c<r;c++)e[o+c]>s&&(s=e[o+c]);let i=0;for(let c=0;c<r;c++)a[o+c]=Math.exp(e[o+c]-s),i+=a[o+c];for(let c=0;c<r;c++)a[o+c]/=i}return a}function zr(e,t,r,a=1e4){const n=new Float32Array(e.length);n.set(e);for(let o=0;o<t*r/2;o++){const s=Math.floor(o/(r/2)),i=o%(r/2),c=1/Math.pow(a,i/r),u=s*c,l=Math.cos(u),d=Math.sin(u),f=o*2,p=o*2+1,m=n[f],g=n[p];n[f]=m*l-g*d,n[p]=m*d+g*l}return n}function Rr(e,t,r,a,n,o,s,i,c){const u=n-i+1,l=o-c+1,d=new Float32Array(r*s*u*l);for(let f=0;f<r;f++)for(let p=0;p<s;p++)for(let m=0;m<u;m++)for(let g=0;g<l;g++){let b=0;for(let v=0;v<a;v++)for(let h=0;h<i;h++)for(let S=0;S<c;S++)b+=e[((f*a+v)*n+m+h)*o+g+S]*t[((p*a+v)*i+h)*c+S];d[((f*s+p)*u+m)*l+g]=b}return d}function Lr(e,t,r){const a=new Float32Array(t*r);for(let n=0;n<t;n++)for(let o=0;o<r;o++)a[o*t+n]=e[n*r+o];return a}function qr(e,t,r,a,n,o){const s=new Float32Array(a*n*o);for(let i=0;i<n;i++)for(let c=0;c<a;c++){const u=c*t/a,l=i*r/n,d=Math.floor(u),f=Math.floor(l),p=Math.min(d+1,t-1),m=Math.min(f+1,r-1),g=u-d,b=l-f;for(let v=0;v<o;v++){const h=e[(f*t+d)*o+v],S=e[(f*t+p)*o+v],A=e[(m*t+d)*o+v],w=e[(m*t+p)*o+v];s[(i*a+c)*o+v]=h*(1-g)*(1-b)+S*g*(1-b)+A*(1-g)*b+w*g*b}}return s}const te=new Br;function ae(e){return D().device.createBindGroupLayout({entries:Array.from({length:e},(r,a)=>({binding:a,visibility:GPUShaderStage.COMPUTE,buffer:a===0?{type:"uniform"}:{type:"storage"}}))})}function De(e){const t=D(),r=t.device.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.device.queue.writeBuffer(r,0,e),r}function ge(e,t,r,a,n,o){const s=D(),i=De(n),c=[{binding:0,resource:{buffer:i}},...a.map((d,f)=>({binding:f+1,resource:{buffer:d.buffer.gpuBuffer}}))],u=s.device.createBindGroup({layout:r,entries:c}),l=e.beginComputePass();return l.setPipeline(t),l.setBindGroup(0,u),l.dispatchWorkgroups(o),l.end(),i}async function be(e,t,r,a,n){const o=D(),s=M.zeros([r,a]),i=ae(4),c=te.getOrCreate("matmul",Ar,i),u=new ArrayBuffer(12),l=new Uint32Array(u);l[0]=r,l[1]=a,l[2]=n;const d=o.device.createCommandEncoder();return ge(d,c,i,[e,t,s],u,Math.ceil(r/16)*Math.ceil(a/16)),o.device.queue.submit([d.finish()]),s}function ye(e,t,r,a,n){return Gr(e,t,r,a,n)}async function lt(e,t){const r=D(),a=M.zeros([e.shape.size]),n=ae(4),o=te.getOrCreate("add",Mr,n),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=r.device.createCommandEncoder();return ge(i,o,n,[e,t,a],s,Math.ceil(e.shape.size/256)),r.device.queue.submit([i.finish()]),a}function ft(e,t){return Nr(e,t)}async function dt(e,t){const r=D(),a=M.zeros([e.shape.size]),n=ae(4),o=te.getOrCreate("multiply",Cr,n),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=r.device.createCommandEncoder();return ge(i,o,n,[e,t,a],s,Math.ceil(e.shape.size/256)),r.device.queue.submit([i.finish()]),a}function pt(e,t){return Dr(e,t)}async function mt(e,t,r=1e-6){const a=D(),n=e.shape.size,o=M.zeros([n]),s=ae(4),i=te.getOrCreate("rms_norm",Ur,s),c=new ArrayBuffer(8);new Uint32Array(c)[0]=n,new Float32Array(c)[1]=r;const u=a.device.createCommandEncoder();return ge(u,i,s,[e,t,o],c,1),a.device.queue.submit([u.finish()]),o}function gt(e,t,r=1e-6){return _r(e,t,r)}async function bt(e,t,r,a=1e-6){const n=D(),o=e.shape.size,s=M.zeros([o]),i=n.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=te.getOrCreate("layer_norm",Pr,i),u=new ArrayBuffer(8);new Uint32Array(u)[0]=o,new Float32Array(u)[1]=a;const l=D(),d=De(u),f=l.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:e.buffer.gpuBuffer}},{binding:2,resource:{buffer:t.buffer.gpuBuffer}},{binding:3,resource:{buffer:r.buffer.gpuBuffer}},{binding:4,resource:{buffer:s.buffer.gpuBuffer}}]}),p=l.device.createCommandEncoder(),m=p.beginComputePass();return m.setPipeline(c),m.setBindGroup(0,f),m.dispatchWorkgroups(1),m.end(),l.device.queue.submit([p.finish()]),s}function yt(e,t,r,a=1e-6){return Fr(e,t,r,a)}async function vt(e,t,r){const a=D(),n=M.zeros([t,r]),o=a.device.createCommandEncoder();o.copyBufferToBuffer(e.buffer.gpuBuffer,0,n.buffer.gpuBuffer,0,t*r*4);const s=ae(2),i=te.getOrCreate("softmax",$r,s),c=new ArrayBuffer(8);new Uint32Array(c)[0]=t,new Uint32Array(c)[1]=r;const u=De(c),l=a.device.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:n.buffer.gpuBuffer}}]}),d=o.beginComputePass();return d.setPipeline(i),d.setBindGroup(0,l),d.dispatchWorkgroups(Math.ceil(t)),d.end(),a.device.queue.submit([o.finish()]),n}function wt(e,t,r){return Wr(e,t,r)}async function ht(e,t,r,a=1e4){const n=D(),o=M.zeros([t,r]),s=n.device.createCommandEncoder();s.copyBufferToBuffer(e.buffer.gpuBuffer,0,o.buffer.gpuBuffer,0,t*r*4);const i=ae(2),c=te.getOrCreate("rope",Er,i),u=new ArrayBuffer(12);new Uint32Array(u)[0]=t,new Uint32Array(u)[1]=r,new Float32Array(u)[2]=a;const l=De(u),d=n.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:o.buffer.gpuBuffer}}]}),f=s.beginComputePass();return f.setPipeline(c),f.setBindGroup(0,d),f.dispatchWorkgroups(Math.ceil(t*r/2/256)),f.end(),n.device.queue.submit([s.finish()]),o}function xt(e,t,r,a=1e4){return zr(e,t,r,a)}async function St(e,t,r,a,n,o,s,i,c){const u=D(),l=n-i+1,d=o-c+1,f=M.zeros([r,s,l,d]),p=ae(4),m=te.getOrCreate("conv2d",Tr,p),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=r,b[1]=a,b[2]=n,b[3]=o,b[4]=s,b[5]=i,b[6]=c,b[7]=l,b[8]=d;const v=u.device.createCommandEncoder();return ge(v,m,p,[e,t,f],g,r*s),u.device.queue.submit([v.finish()]),f}function Bt(e,t,r,a,n,o,s,i,c){return Rr(e,t,r,a,n,o,s,i,c)}async function At(e,t,r){const a=D(),n=M.zeros([r,t]),o=ae(3),s=te.getOrCreate("transpose_2d",kr,o),i=new ArrayBuffer(8);new Uint32Array(i)[0]=t,new Uint32Array(i)[1]=r;const c=a.device.createCommandEncoder();return ge(c,s,o,[e,n],i,Math.ceil(t/16)*Math.ceil(r/16)),a.device.queue.submit([c.finish()]),n}function Mt(e,t,r){return Lr(e,t,r)}async function Ct(e,t,r,a,n,o){const s=D(),i=M.zeros([n*a*o]),c=ae(3),u=te.getOrCreate("interpolate_bilinear",Or,c),l=new ArrayBuffer(20),d=new Uint32Array(l);d[0]=t,d[1]=r,d[2]=a,d[3]=n,d[4]=o;const f=s.device.createCommandEncoder();return ge(f,u,c,[e,i],l,Math.ceil(a/16)*Math.ceil(n/16)),s.device.queue.submit([f.finish()]),i}function Ut(e,t,r,a,n,o){return qr(e,t,r,a,n,o)}let he=null,Ge=null;function V(e,t=""){if(!he)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,he.appendChild(r),he.scrollTop=he.scrollHeight}function I(e,t,r=.001){if(e.length!==t.length)return!1;for(let a=0;a<e.length;a++){const n=Math.abs(e[a]-t[a]),o=Math.max(Math.abs(e[a]),Math.abs(t[a]),1e-8);if(n/o>r)return!1}return!0}async function H(e,t,r=20){for(let n=0;n<3;n++)t();const a=[];for(let n=0;n<r;n++){const o=performance.now();t(),a.push(performance.now()-o)}return a.reduce((n,o)=>n+o,0)/a.length}async function j(e,t,r=20){const a=[];for(let n=0;n<Math.min(5,r);n++)await t();for(let n=0;n<r;n++){const o=performance.now();await t(),a.push(performance.now()-o)}return a.reduce((n,o)=>n+o,0)/a.length}function Ir(e){if(!Ge)return;const t=document.createElement("tr");t.innerHTML=`
    <td style="font-weight:600">${e.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${e.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${e.speedup>=1?"var(--green)":"var(--red)"}">
      ${e.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${e.correct?"badge-pass":"badge-fail"}">${e.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${e.tolerance.toExponential(1)}</td>
  `,Ge.appendChild(t)}async function Hr(){he.innerHTML="",Ge.innerHTML="",V("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),V("Initializing WebGPU...","");let e;try{e=await xr()}catch(a){V(`FATAL: ${a.message}`,"err"),V("WebGPU is not available. Cannot run GPU benchmarks.","err");return}V(`GPU: ${e.adapter.name??"Unknown"}`,"ok"),V(`Running benchmarks...
`,"");const t=[];{const s=M.randn([64,64]),i=M.randn([64,64]),c=await s.readback(),u=await i.readback(),l=await H("matmul 64",()=>ye(c,u,64,64,64)),d=await j("matmul 64",async()=>{(await be(s,i,64,64,64)).destroy()}),f=await(await be(s,i,64,64,64)).readback(),p=ye(c,u,64,64,64),m=I(p,f),g=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-f[v])));t.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:g}),s.destroy(),i.destroy()}{const s=M.randn([256,256]),i=M.randn([256,256]),c=await s.readback(),u=await i.readback(),l=await H("matmul 256",()=>ye(c,u,256,256,256),10),d=await j("matmul 256",async()=>{(await be(s,i,256,256,256)).destroy()}),f=await(await be(s,i,256,256,256)).readback(),p=ye(c,u,256,256,256),m=I(p,f),g=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-f[v])));t.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:g}),s.destroy(),i.destroy()}{const s=M.randn([512,512]),i=M.randn([512,512]),c=await s.readback(),u=await i.readback(),l=await H("matmul 512",()=>ye(c,u,512,512,512),5),d=await j("matmul 512",async()=>{(await be(s,i,512,512,512)).destroy()}),f=await(await be(s,i,512,512,512)).readback(),p=ye(c,u,512,512,512),m=I(p,f),g=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-f[v])));t.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:g}),s.destroy(),i.destroy()}{const n=M.randn([1e6]),o=M.randn([1e6]),s=await n.readback(),i=await o.readback(),c=await H("add 1M",()=>ft(s,i)),u=await j("add 1M",async()=>{(await lt(n,o)).destroy()}),l=await(await lt(n,o)).readback(),d=ft(s,i),f=I(d,l),p=Math.max(...Array.from(d).map((m,g)=>Math.abs(m-l[g])));t.push({name:"Add",shape:"[1000000]",cpuMs:c,gpuMs:u,speedup:c/u,correct:f,tolerance:p}),n.destroy(),o.destroy()}{const n=M.randn([1e6]),o=M.randn([1e6]),s=await n.readback(),i=await o.readback(),c=await H("mul 1M",()=>pt(s,i)),u=await j("mul 1M",async()=>{(await dt(n,o)).destroy()}),l=await(await dt(n,o)).readback(),d=pt(s,i),f=I(d,l),p=Math.max(...Array.from(d).map((m,g)=>Math.abs(m-l[g])));t.push({name:"Multiply",shape:"[1000000]",cpuMs:c,gpuMs:u,speedup:c/u,correct:f,tolerance:p}),n.destroy(),o.destroy()}{const n=M.randn([1024]),o=M.ones([1024]),s=await n.readback(),i=await o.readback(),c=await H("rmsnorm",()=>gt(s,i)),u=await j("rmsnorm",async()=>{(await mt(n,o)).destroy()}),l=await(await mt(n,o)).readback(),d=gt(s,i),f=I(d,l),p=Math.max(...Array.from(d).map((m,g)=>Math.abs(m-l[g])));t.push({name:"RMSNorm",shape:"[1024]",cpuMs:c,gpuMs:u,speedup:c/u,correct:f,tolerance:p}),n.destroy(),o.destroy()}{const n=M.randn([1024]),o=M.ones([1024]),s=M.zeros([1024]),i=await n.readback(),c=await o.readback(),u=await s.readback(),l=await H("layernorm",()=>yt(i,c,u)),d=await j("layernorm",async()=>{(await bt(n,o,s)).destroy()}),f=await(await bt(n,o,s)).readback(),p=yt(i,c,u),m=I(p,f),g=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-f[v])));t.push({name:"LayerNorm",shape:"[1024]",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:g}),n.destroy(),o.destroy(),s.destroy()}{const o=M.randn([32,128]),s=await o.readback(),i=await H("softmax",()=>wt(new Float32Array(s),32,128)),c=await j("softmax",async()=>{(await vt(M.fromFloat32(new Float32Array(s),[32,128]),32,128)).destroy()}),u=await(await vt(M.fromFloat32(new Float32Array(s),[32,128]),32,128)).readback(),l=wt(new Float32Array(s),32,128),d=I(l,u),f=Math.max(...Array.from(l).map((p,m)=>Math.abs(p-u[m])));t.push({name:"Softmax",shape:"[32, 128]",cpuMs:i,gpuMs:c,speedup:i/c,correct:d,tolerance:f}),o.destroy()}{const o=M.randn([16,128]),s=await o.readback(),i=await H("rope",()=>xt(new Float32Array(s),16,128)),c=await j("rope",async()=>{(await ht(M.fromFloat32(new Float32Array(s),[16,128]),16,128)).destroy()}),u=await(await ht(M.fromFloat32(new Float32Array(s),[16,128]),16,128)).readback(),l=xt(new Float32Array(s),16,128),d=I(l,u),f=Math.max(...Array.from(l).map((p,m)=>Math.abs(p-u[m])));t.push({name:"RoPE",shape:"[16, 128]",cpuMs:i,gpuMs:c,speedup:i/c,correct:d,tolerance:f}),o.destroy()}{const l=M.randn([1,3,16,16]),d=M.randn([4,3,3,3]),f=await l.readback(),p=await d.readback(),m=await H("conv2d",()=>Bt(f,p,1,3,16,16,4,3,3)),g=await j("conv2d",async()=>{(await St(l,d,1,3,16,16,4,3,3)).destroy()}),b=await(await St(l,d,1,3,16,16,4,3,3)).readback(),v=Bt(f,p,1,3,16,16,4,3,3),h=I(v,b),S=Math.max(...Array.from(v).map((A,w)=>Math.abs(A-b[w])));t.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:m,gpuMs:g,speedup:m/g,correct:h,tolerance:S}),l.destroy(),d.destroy()}{const o=M.randn([256,256]),s=await o.readback(),i=await H("transpose",()=>Mt(s,256,256)),c=await j("transpose",async()=>{(await At(o,256,256)).destroy()}),u=await(await At(o,256,256)).readback(),l=Mt(s,256,256),d=I(l,u),f=Math.max(...Array.from(l).map((p,m)=>Math.abs(p-u[m])));t.push({name:"Transpose",shape:"[256, 256]",cpuMs:i,gpuMs:c,speedup:i/c,correct:d,tolerance:f}),o.destroy()}{const c=M.randn([3072]),u=await c.readback(),l=await H("interp",()=>Ut(u,32,32,64,64,3)),d=await j("interp",async()=>{(await Ct(c,32,32,64,64,3)).destroy()}),f=await(await Ct(c,32,32,64,64,3)).readback(),p=Ut(u,32,32,64,64,3),m=I(p,f),g=Math.max(...Array.from(p).map((b,v)=>Math.abs(b-f[v])));t.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:g}),c.destroy()}V("",""),V("═══ RESULTS ═══","info");for(const a of t){Ir(a);const n=a.correct?"✓":"✗",o=a.correct?"ok":"err";V(`${n} ${a.name} (${a.shape}): CPU ${a.cpuMs.toFixed(2)} ms | GPU ${a.gpuMs.toFixed(2)} ms | ${a.speedup.toFixed(1)}× | max diff ${a.tolerance.toExponential(1)}`,o)}const r=t.filter(a=>a.correct).length;V("",""),V(`═══ ${r}/${t.length} CORRECT ═══`,r===t.length?"ok":"err"),Sr()}function jr(e){e.innerHTML=`
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
  `,he=e.querySelector("#bench-log"),Ge=e.querySelector("#bench-tbody"),e.querySelector("#btn-run-bench").addEventListener("click",()=>{Hr()})}const Kr=Object.freeze(Object.defineProperty({__proto__:null,render:jr},Symbol.toStringTag,{value:"Module"}));let oe=null,$e="";function Vr(e){const t=e.environment,r=e.gpu,a=e.case==="D"?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)";let n=`
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
  `;const t=e.querySelector("#wgdiag-result");oe=e.querySelector("#btn-copy-report"),e.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{t.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',oe.disabled=!0;const r=await Ne();$e=$t(r),t.innerHTML=Vr(r),oe.disabled=!1}),oe.addEventListener("click",async()=>{if($e)try{await navigator.clipboard.writeText($e),oe.textContent="Copied!",setTimeout(()=>{oe.textContent="Copy Diagnostics"},2e3)}catch{const r=document.createElement("textarea");r.value=$e,document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),oe.textContent="Copied!",setTimeout(()=>{oe.textContent="Copy Diagnostics"},2e3)}}),e.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const Xr=Object.freeze(Object.defineProperty({__proto__:null,render:Yr},Symbol.toStringTag,{value:"Module"}));let Ce=null,pe=null;async function xe(){if(pe&&!Ce&&(pe=null),pe)return pe;if(!navigator.gpu)throw new Error("WebGPU not supported");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.features.has("timestamp-query"),r=await e.requestDevice({requiredFeatures:t?["timestamp-query"]:[],requiredLimits:{}});r.lost.then(s=>{console.error("Benchmark device lost:",s.message),Ce=null,pe=null}),Ce=r;let a=null;try{a=navigator.gpu.getPreferredCanvasFormat()}catch{}const n=e.limits,o=[];for(const s of e.features)o.push(s);return pe={webgpuAvailable:!0,adapterName:e.name??"Unknown",adapterVendor:e.vendor??"Unknown",adapterDevice:e.device??"Unknown",adapterFeatures:o,adapterLimits:{maxBufferSize:n.maxBufferSize,maxTextureDimension1D:n.maxTextureDimension1D,maxTextureDimension2D:n.maxTextureDimension2D,maxTextureDimension3D:n.maxTextureDimension3D,maxComputeWorkgroupStorageSize:n.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:n.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:n.maxStorageBufferBindingSize,maxUniformBufferBindingSize:n.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:n.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:n.maxComputeWorkgroupsPerDimension,maxColorAttachments:n.maxColorAttachments,minStorageBufferOffsetAlignment:n.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:n.minUniformBufferOffsetAlignment},preferredCanvasFormat:a,maxBufferSize:n.maxBufferSize,maxStorageBufferBindingSize:n.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:n.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:n.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:n.maxComputeWorkgroupsPerDimension,timestampQuerySupport:t,isFallbackAdapter:e.isFallbackAdapter??!1},pe}function O(){if(!Ce)throw new Error("Benchmark not initialized. Call initBenchmark() first.");return Ce}function L(e){const t=O(),r=t.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(r,0,e),r}function U(e,t){const r=O(),a=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(t){const n=r.createBuffer({size:Math.max(e,t.byteLength),usage:a,mappedAtCreation:!0});return new Float32Array(n.getMappedRange()).set(t),n.unmap(),n}return r.createBuffer({size:e,usage:a})}function Qr(e){return O().createBuffer({size:e,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})}async function Gt(e,t){const r=O(),a=Qr(t),n=r.createCommandEncoder();n.copyBufferToBuffer(e,0,a,0,t),r.queue.submit([n.finish()]),await a.mapAsync(GPUMapMode.READ);const o=new Float32Array(a.getMappedRange().slice(0));return a.unmap(),a.destroy(),o}function q(e,t){const r=O(),a=r.createBindGroupLayout({entries:Array.from({length:t},(n,o)=>({binding:o,visibility:GPUShaderStage.COMPUTE,buffer:o===0?{type:"uniform"}:{type:"storage"}}))});return r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:r.createShaderModule({code:e}),entryPoint:"main"}})}async function Zr(e,t=50,r=5){const a=O();for(let i=0;i<Math.min(r,3);i++)e();const n=[];for(let i=0;i<t;i++){const c=performance.now();e();try{await a.queue.onSubmittedWorkDone()}catch{await new Promise(l=>setTimeout(l,50))}const u=performance.now();n.push(u-c)}n.sort((i,c)=>i-c);const o=n.reduce((i,c)=>i+c,0)/n.length,s=n[Math.floor(n.length/2)];return{avgMs:o,minMs:n[0],maxMs:n[n.length-1],p50Ms:s,iterations:t}}function R(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}const Nt=`
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
`;async function Z(e){const t=O();t.pushErrorScope("validation"),t.pushErrorScope("out-of-memory"),t.pushErrorScope("internal");try{const r=t.createCommandEncoder(),a=r.beginComputePass();a.setPipeline(e.pipeline),a.setBindGroup(0,e.bindGroup),a.dispatchWorkgroups(...e.workgroups),a.end(),t.queue.submit([r.finish()]),await t.queue.onSubmittedWorkDone();const o=(await Promise.all([t.popErrorScope(),t.popErrorScope(),t.popErrorScope()])).find(l=>l!==null);if(o)return{pass:!1,error:`Validation Error: ${o.message}`};const s=t.createBuffer({size:e.outputBytes,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),i=t.createCommandEncoder();i.copyBufferToBuffer(e.outputBuffer,0,s,0,e.outputBytes),t.queue.submit([i.finish()]),await s.mapAsync(GPUMapMode.READ);const c=new Float32Array(s.getMappedRange().slice(0));s.unmap(),s.destroy();const u=e.validator(c);return{pass:u.pass,error:u.pass?null:u.error}}catch(r){return{pass:!1,error:r.message}}}async function zt(){const e=O(),t=[],r=q(Nt,4),a=[64,1024,65536];for(const n of a){const o=n*4,s=new Float32Array(n).fill(1),i=new Float32Array(n).fill(2),c=U(o,s),u=U(o,i),l=U(o),d=new ArrayBuffer(4);new Uint32Array(d)[0]=n;const f=L(d),p=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:u}},{binding:3,resource:{buffer:l}}]}),m=await Z({name:"Vector Addition",pipeline:r,bindGroup:p,workgroups:[Math.ceil(n/64),1,1],outputBuffer:l,outputBytes:o,validator:g=>{const b=g.every(v=>Math.abs(v-3)<1e-5);return{pass:b,error:b?"":"Incorrect values"}}});t.push({id:`vecadd_${n}`,name:"Vector Addition",inputSize:`${n} elements (${R(o)})`,executionTimeMs:0,throughput:"N/A",memoryBytes:o*3,success:m.pass,error:m.error||void 0,gpuTimingAvailable:!1}),c.destroy(),u.destroy(),l.destroy(),f.destroy()}return t}const Jr=[128,256,512];function en(e,t,r,a,n){const o=new Float32Array(r*a);for(let s=0;s<r;s++)for(let i=0;i<a;i++){let c=0;for(let u=0;u<n;u++)c+=e[s*n+u]*t[u*a+i];o[s*a+i]=c}return o}async function Rt(){const e=O(),t=[],r=q(He,4),a=r.getBindGroupLayout(0);for(const n of Jr)try{const o=n,s=n,c=(o*s+s*n+o*n)*4,u=new Float32Array(o*s).fill(1),l=new Float32Array(s*n).fill(.5),d=U(o*s*4,u),f=U(s*n*4,l),p=U(o*n*4),m=new ArrayBuffer(12),g=new Uint32Array(m);g[0]=o,g[1]=n,g[2]=s;const b=L(m),v=e.createBindGroup({layout:a,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}}]}),h=Math.ceil(o/16),S=Math.ceil(n/16),A=await Zr(()=>{const P=e.createCommandEncoder(),G=P.beginComputePass();G.setPipeline(r),G.setBindGroup(0,v),G.dispatchWorkgroups(h,S),G.end(),e.queue.submit([P.finish()])},n<=256?50:20);let w=!0;if(n<=256){const P=await Gt(p,o*n*4),G=en(u,l,o,n,s);for(let W=0;W<o*n;W++)if(Math.abs(P[W]-G[W])>.001){w=!1;break}}const B=2*o*n*s,k=B/(A.avgMs/1e3)/1e9;t.push({id:`matmul_${n}`,name:"Matrix Multiplication",inputSize:`${n}×${n}`,executionTimeMs:A.avgMs,throughput:`${k.toFixed(2)} GFLOPS`,memoryBytes:c,success:w,gpuTimingAvailable:!0,details:{M:o,N:n,K:s,flops:B,gflops:k,iterations:A.iterations,minMs:A.minMs,maxMs:A.maxMs,p50Ms:A.p50Ms,correctness:n<=256?w?"PASS":"FAIL":"NOT_TESTED (>256)"}}),d.destroy(),f.destroy(),p.destroy(),b.destroy()}catch(o){t.push({id:`matmul_${n}`,name:"Matrix Multiplication",inputSize:`${n}×${n}`,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:o.message,gpuTimingAvailable:!1})}return t}async function tn(){const e=O(),t=[],r=q(Dt,4),a=1,n=1,o=5,s=5,i=1,c=3,u=3,l=o-c+1,d=s-u+1,f=a*n*o*s,p=i*n*c*u,m=a*i*l*d,g=new Float32Array(f).fill(1),b=new Float32Array(p).fill(1),v=U(f*4,g),h=U(p*4,b),S=U(m*4),A=new ArrayBuffer(36),w=new Uint32Array(A);w[0]=a,w[1]=n,w[2]=o,w[3]=s,w[4]=i,w[5]=c,w[6]=u,w[7]=l,w[8]=d;const B=L(A),k=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:B}},{binding:1,resource:{buffer:v}},{binding:2,resource:{buffer:h}},{binding:3,resource:{buffer:S}}]}),P=await Z({name:"Conv2D",pipeline:r,bindGroup:k,workgroups:[a,i,l*d],outputBuffer:S,outputBytes:m*4,validator:G=>{const re=G.every(de=>Math.abs(de-9)<1e-4);return{pass:re,error:re?"":`Expected 9, got ${G[0]}`}}});return t.push({id:`conv2d_${a}x${n}x${o}x${s}`,name:"Conv2D",inputSize:`${a}x${n}x${o}x${s} k=${c}`,executionTimeMs:0,throughput:"N/A",memoryBytes:(f+p+m)*4,success:P.pass,error:P.error||void 0,gpuTimingAvailable:!1}),v.destroy(),h.destroy(),S.destroy(),B.destroy(),t}async function Lt(){const e=O(),t=[],r=q(_t,3),a=[{rows:1,cols:64},{rows:4,cols:64}];for(const n of a){const o=n.rows*n.cols,s=o*4,i=new Float32Array(o).map((m,g)=>g%n.cols*.1),c=U(s,i),u=U(s),l=new ArrayBuffer(8);new Uint32Array(l)[0]=n.rows,new Uint32Array(l)[1]=n.cols;const d=L(l),f=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:u}}]}),p=await Z({name:"Softmax",pipeline:r,bindGroup:f,workgroups:[n.rows,1,1],outputBuffer:u,outputBytes:s,validator:m=>{let g=!0;for(let b=0;b<n.rows;b++){const v=b*n.cols;let h=0;for(let S=0;S<n.cols;S++)h+=m[v+S];if(Math.abs(h-1)>1e-4){g=!1;break}}return{pass:g,error:g?"":"Softmax rows do not sum to 1"}}});t.push({id:`softmax_${n.rows}x${n.cols}`,name:"Softmax",inputSize:`${n.rows}x${n.cols}`,executionTimeMs:0,throughput:"N/A",memoryBytes:s,success:p.pass,error:p.error||void 0,gpuTimingAvailable:!1}),c.destroy(),u.destroy(),d.destroy()}return t}async function qt(){const e=O(),t=[],r=q(Ft,4),a=[8,128,512];for(const n of a){const o=n*4,s=new Float32Array(n).fill(.5),i=new Float32Array(n).fill(1),c=U(o,s),u=U(o,i),l=U(o),d=new ArrayBuffer(8);new Uint32Array(d)[0]=n,new Float32Array(d)[1]=1e-6;const f=L(d),p=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:u}},{binding:3,resource:{buffer:l}}]}),m=await Z({name:"RMSNorm",pipeline:r,bindGroup:p,workgroups:[1,1,1],outputBuffer:l,outputBytes:o,validator:g=>{const b=s.reduce((A,w)=>A+w*w,0),v=Math.sqrt(b/n+1e-6),h=s.map(A=>A/v),S=g.every((A,w)=>Math.abs(A-h[w])<1e-4);return{pass:S,error:S?"":`Incorrect values: got ${g[0]} expected ${h[0]}`}}});t.push({id:`rmsnorm_${n}`,name:"RMSNorm",inputSize:`${n} elements (${R(o)})`,executionTimeMs:0,throughput:"N/A",memoryBytes:o*3,success:m.pass,error:m.error||void 0,gpuTimingAvailable:!1}),c.destroy(),u.destroy(),l.destroy(),f.destroy()}return t}async function rn(){const e=O(),t=[],r=q(Wt,6),a=1,n=4,o=4,s=1/Math.sqrt(o),i=a*n*o,c=a*n*n,u=new Float32Array(i).map((k,P)=>(P%o+1)*.1),l=new Float32Array(i).map((k,P)=>(P%o+1)*.1),d=new Float32Array(i).map((k,P)=>(P%o+1)*.1),f=U(i*4,u),p=U(i*4,l),m=U(i*4,d),g=U(i*4),b=U(c*4),v=new ArrayBuffer(16),h=new Uint32Array(v),S=new Float32Array(v);h[0]=a,h[1]=n,h[2]=o,S[3]=s;const A=L(v),w=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:A}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:m}},{binding:4,resource:{buffer:g}},{binding:5,resource:{buffer:b}}]}),B=await Z({name:"Attention",pipeline:r,bindGroup:w,workgroups:[a,1,1],outputBuffer:g,outputBytes:i*4,validator:k=>{const P=k.every(G=>isFinite(G));return{pass:P,error:P?"":"Non-finite output"}}});return t.push({id:`attention_${a}x${n}x${o}`,name:"Attention",inputSize:`batch=${a} seq=${n} dim=${o}`,executionTimeMs:0,throughput:"N/A",memoryBytes:(i*3+i+c)*4,success:B.pass,error:B.error||void 0,gpuTimingAvailable:!1}),f.destroy(),p.destroy(),m.destroy(),g.destroy(),b.destroy(),A.destroy(),t}async function nn(e){const t=O(),r=[],a=e.maxBufferSize;{let n=0,o=Math.min(a,256*1024*1024);try{for(;o<=a;){const s=t.createBuffer({size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});if(n=o,s.destroy(),o>=a)break;o=Math.min(o*2,a)}}catch{}r.push({id:"mem_max_buffer",name:"Max Buffer Size",inputSize:`limit=${R(a)}`,executionTimeMs:0,throughput:`accepted=${R(n)}`,memoryBytes:n,success:n>0,gpuTimingAvailable:!1,details:{maxBufferSizeLimit:a,maxBufferAccepted:n,match:n===a?"EXACT":"PARTIAL"}})}{const n=[1048576,16777216,67108864,134217728].filter(o=>o<=a);for(const o of n)try{const i=[];for(let u=0;u<20;u++){const l=performance.now(),d=t.createBuffer({size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});i.push(performance.now()-l),d.destroy()}const c=i.reduce((u,l)=>u+l,0)/i.length;r.push({id:`mem_alloc_${o}`,name:"Allocation Time",inputSize:R(o),executionTimeMs:c,throughput:`${(o/(c/1e3)/1048576).toFixed(1)} MB/s`,memoryBytes:o,success:!0,gpuTimingAvailable:!1,details:{avgMs:c,iterations:20}})}catch(s){r.push({id:`mem_alloc_${o}`,name:"Allocation Time",inputSize:R(o),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}{const n=[1048576,16777216,67108864].filter(o=>o<=a);for(const o of n)try{const s=o/4,i=new Float32Array(s).fill(3.14),c=Ee(o),u=20,l=[];for(let f=0;f<u;f++){const p=performance.now();t.queue.writeBuffer(c,0,i.buffer),await t.queue.onSubmittedWorkDone(),l.push(performance.now()-p)}const d=l.reduce((f,p)=>f+p,0)/l.length;r.push({id:`mem_upload_${o}`,name:"Upload Time",inputSize:R(o),executionTimeMs:d,throughput:`${(o/(d/1e3)/1048576).toFixed(1)} MB/s`,memoryBytes:o,success:!0,gpuTimingAvailable:!1,details:{avgMs:d,iterations:u,method:"queue.writeBuffer"}}),c.destroy()}catch(s){r.push({id:`mem_upload_${o}`,name:"Upload Time",inputSize:R(o),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}{const n=[1048576,16777216,67108864].filter(o=>o<=a);for(const o of n)try{const s=Ee(o),i=10,c=[];for(let l=0;l<i;l++){const d=performance.now();await Gt(s,o),c.push(performance.now()-d)}const u=c.reduce((l,d)=>l+d,0)/c.length;r.push({id:`mem_readback_${o}`,name:"Readback Time",inputSize:R(o),executionTimeMs:u,throughput:`${(o/(u/1e3)/1048576).toFixed(1)} MB/s`,memoryBytes:o,success:!0,gpuTimingAvailable:!1,details:{avgMs:u,iterations:i,method:"copyBufferToBuffer + mapAsync"}}),s.destroy()}catch(s){r.push({id:`mem_readback_${o}`,name:"Readback Time",inputSize:R(o),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}{const n=Math.min(16777216,a);try{const s=Ee(n),i=new Float32Array(n/4).fill(1),c=[];for(let f=0;f<50;f++){const p=performance.now();t.queue.writeBuffer(s,0,i.buffer),c.push(performance.now()-p)}const u=[];for(let f=0;f<50;f++){const p=performance.now(),m=t.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(m,0,i.buffer),m.destroy(),u.push(performance.now()-p)}const l=c.reduce((f,p)=>f+p,0)/c.length,d=u.reduce((f,p)=>f+p,0)/u.length;r.push({id:"mem_reuse_vs_realloc",name:"Buffer Reuse vs Re-alloc",inputSize:R(n),executionTimeMs:l,throughput:`reuse=${l.toFixed(3)}ms re-alloc=${d.toFixed(3)}ms`,memoryBytes:n,success:!0,gpuTimingAvailable:!1,details:{reuseAvgMs:l,reallocAvgMs:d,speedup:(d/l).toFixed(1)+"x",iterations:50}}),s.destroy()}catch(o){r.push({id:"mem_reuse_vs_realloc",name:"Buffer Reuse vs Re-alloc",inputSize:R(n),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:o.message,gpuTimingAvailable:!1})}}{let n=0;const o=[64*1024*1024,128*1024*1024,256*1024*1024].filter(s=>s<=a);for(const s of o)try{const i=Ee(s),c=new Float32Array(Math.min(s/4,1024)).fill(42);t.queue.writeBuffer(i,0,c.buffer),await t.queue.onSubmittedWorkDone(),n=s,i.destroy()}catch{break}r.push({id:"mem_useful_working_set",name:"Useful Working Set",inputSize:`tested up to ${R(a)}`,executionTimeMs:0,throughput:`confirmed=${R(n)}`,memoryBytes:n,success:n>0,gpuTimingAvailable:!1,details:{maxBufferSize:a,usefulWorkingSet:n}})}return r}function Ee(e,t){const r=O(),a=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;return r.createBuffer({size:e,usage:a})}const Fe=[30,60,180];async function an(e){const t=O(),r=[],a=256,n=a,o=a,s=2*n*a*o,i=q(He,4),c=i.getBindGroupLayout(0),u=new Float32Array(n*o).fill(1),l=new Float32Array(o*a).fill(.5),d=U(n*o*4,u),f=U(o*a*4,l),p=U(n*a*4),m=new ArrayBuffer(12),g=new Uint32Array(m);g[0]=n,g[1]=a,g[2]=o;const b=L(m),v=t.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}}]}),h=Math.ceil(n/16),S=Math.ceil(a/16);function A(){const w=t.createCommandEncoder(),B=w.beginComputePass();B.setPipeline(i),B.setBindGroup(0,v),B.dispatchWorkgroups(h,S),B.end(),t.queue.submit([w.finish()])}for(const w of Fe)try{e?.(0,`Starting ${w}s sustained test...`);const B=[],k=performance.now();let P=k,G=0;for(let N=0;N<5;N++)A(),await t.queue.onSubmittedWorkDone();for(;;){const N=(performance.now()-k)/1e3;if(N>=w)break;const J=performance.now();let _e=0;for(;!(performance.now()-J>=1e3);)A(),await t.queue.onSubmittedWorkDone(),_e++;const at=(performance.now()-J)/1e3,jt=at/_e*1e3,ot=s*_e/(at*1e9);B.push({second:G,avgMs:jt,gflops:ot}),G++;const Kt=Math.min(N/w*100,100);e?.(Kt,`${w}s test: ${Math.floor(N)}s / ${w}s — ${ot.toFixed(1)} GFLOPS`)}const W=B.slice(0,10),re=B.slice(-10),de=W.reduce((N,J)=>N+J.gflops,0)/W.length,Ae=re.reduce((N,J)=>N+J.gflops,0)/re.length,Ue=Ae<de*.85,_=B.reduce((N,J)=>N+J.gflops,0)/B.length;r.push({id:`sustained_${w}s`,name:`Sustained Load ${w}s`,inputSize:`${a}×${a} matmul`,executionTimeMs:B.reduce((N,J)=>N+J.avgMs,0)/B.length,throughput:`${_.toFixed(1)} GFLOPS avg`,memoryBytes:(n*o+o*a+n*a)*4,success:!0,gpuTimingAvailable:!0,samples:B,thermalThrottling:Ue,avgGflops:_,durationSeconds:w,details:{duration:w,totalSamples:B.length,avgGflops:_,minGflops:Math.min(...B.map(N=>N.gflops)),maxGflops:Math.max(...B.map(N=>N.gflops)),first10sAvg:de,last10sAvg:Ae,throttled:Ue?"YES":"NO",dropPct:((1-Ae/de)*100).toFixed(1)+"%"}}),e?.(100,`${w}s test complete — ${_.toFixed(1)} GFLOPS avg`),w!==Fe[Fe.length-1]&&(e?.(-1,"Cooling down 10s before next test..."),await new Promise(N=>setTimeout(N,1e4)))}catch(B){r.push({id:`sustained_${w}s`,name:`Sustained Load ${w}s`,inputSize:`${a}×${a} matmul`,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:B.message,gpuTimingAvailable:!1,samples:[],thermalThrottling:!1,avgGflops:0,durationSeconds:w})}return d.destroy(),f.destroy(),p.destroy(),b.destroy(),r}function on(e,t,r,a,n){const o=new Float32Array(r*a);for(let s=0;s<r;s++)for(let i=0;i<a;i++){let c=0;for(let u=0;u<n;u++)c+=e[s*n+u]*t[u*a+i];o[s*a+i]=c}return o}function sn(e,t,r,a,n,o,s,i,c){const u=n-i+1,l=o-c+1,d=new Float32Array(r*s*u*l);for(let f=0;f<r;f++)for(let p=0;p<s;p++)for(let m=0;m<u;m++)for(let g=0;g<l;g++){let b=0;for(let v=0;v<a;v++)for(let h=0;h<i;h++)for(let S=0;S<c;S++)b+=e[((f*a+v)*n+m+h)*o+g+S]*t[((p*a+v)*i+h)*c+S];d[((f*s+p)*u+m)*l+g]=b}return d}function un(e,t,r){const a=new Float32Array(e.length);for(let n=0;n<t;n++){const o=n*r;let s=-1e30;for(let c=0;c<r;c++)e[o+c]>s&&(s=e[o+c]);let i=0;for(let c=0;c<r;c++){const u=Math.exp(e[o+c]-s);a[o+c]=u,i+=u}for(let c=0;c<r;c++)a[o+c]/=i}return a}function cn(e,t,r){const a=e.length;let n=0;for(let i=0;i<a;i++)n+=e[i]*e[i];const o=Math.sqrt(n/a+r),s=new Float32Array(a);for(let i=0;i<a;i++)s[i]=e[i]/o*t[i];return s}function X(e){return U(e.byteLength,e)}async function je(){try{const t=new Float32Array(64).fill(1),r=new Float32Array(64).fill(2),a=X(t),n=X(r),o=U(64*4),s=new ArrayBuffer(4);new Uint32Array(s)[0]=64;const i=L(s),c=q(Nt,4),u=O().createBindGroup({layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:o}}]}),l=await Z({name:"VecAdd",pipeline:c,bindGroup:u,workgroups:[1,1,1],outputBuffer:o,outputBytes:64*4,validator:d=>{const f=d.every((p,m)=>Math.abs(p-3)<1e-5);return{pass:f,error:f?"":"Incorrect values"}}});return a.destroy(),n.destroy(),o.destroy(),i.destroy(),{name:"VecAdd",pass:l.pass,maxError:0,details:l.error||"N=64"}}catch(e){return{name:"VecAdd",pass:!1,maxError:1/0,details:e.message}}}async function Ke(){try{const t=new Float32Array(4096).fill(1),r=new Float32Array(64*64).fill(.5),a=X(t),n=X(r),o=U(64*64*4),s=new ArrayBuffer(12),i=new Uint32Array(s);i[0]=64,i[1]=64,i[2]=64;const c=L(s),u=q(He,4),l=O().createBindGroup({layout:u.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:o}}]}),d=await Z({name:"Matmul",pipeline:u,bindGroup:l,workgroups:[Math.ceil(64/16),Math.ceil(64/16),1],outputBuffer:o,outputBytes:64*64*4,validator:f=>{const p=on(t,r,64,64,64);let m=0;for(let b=0;b<64*64;b++)m=Math.max(m,Math.abs(f[b]-p[b]));const g=m<.001;return{pass:g,error:g?"":`Max error: ${m}`}}});return a.destroy(),n.destroy(),o.destroy(),c.destroy(),{name:"Matmul",pass:d.pass,maxError:0,details:d.error||"64×64"}}catch(e){return{name:"Matmul",pass:!1,maxError:1/0,details:e.message}}}async function Ve(){try{const u=new Float32Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]),l=new Float32Array([1,0,-1,1,0,-1,1,0,-1]),d=X(u),f=X(l),p=U(1*1*3*3*4),m=new ArrayBuffer(36),g=new Uint32Array(m);g[0]=1,g[1]=1,g[2]=5,g[3]=5,g[4]=1,g[5]=3,g[6]=3,g[7]=3,g[8]=3;const b=L(m),v=q(Dt,4),h=O().createBindGroup({layout:v.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}}]}),S=await Z({name:"Conv2D",pipeline:v,bindGroup:h,workgroups:[1,1,3*3],outputBuffer:p,outputBytes:1*1*3*3*4,validator:A=>{const w=sn(u,l,1,1,5,5,1,3,3);let B=0;for(let P=0;P<A.length;P++)B=Math.max(B,Math.abs(A[P]-w[P]));const k=B<1e-4;return{pass:k,error:k?"":`Max error: ${B}`}}});return d.destroy(),f.destroy(),p.destroy(),b.destroy(),{name:"Conv2D",pass:S.pass,maxError:0,details:S.error||"1×1×5×5"}}catch(e){return{name:"Conv2D",pass:!1,maxError:1/0,details:e.message}}}async function Ye(){try{const r=new Float32Array([-2,-1,0,1,2,2,1,0,-1,-2]),a=U(r.byteLength,r),n=U(r.byteLength),o=new ArrayBuffer(8);new Uint32Array(o)[0]=2,new Uint32Array(o)[1]=5;const s=L(o),i=q(_t,3),c=O().createBindGroup({layout:i.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:n}}]}),u=await Z({name:"Softmax",pipeline:i,bindGroup:c,workgroups:[2,1,1],outputBuffer:n,outputBytes:r.byteLength,validator:l=>{const d=un(r,2,5);let f=0;for(let m=0;m<r.length;m++)f=Math.max(f,Math.abs(l[m]-d[m]));const p=f<1e-4;return{pass:p,error:p?"":`Max error: ${f}`}}});return a.destroy(),n.destroy(),s.destroy(),{name:"Softmax",pass:u.pass,maxError:0,details:u.error||"Rows=2"}}catch(e){return{name:"Softmax",pass:!1,maxError:1/0,details:e.message}}}async function Xe(){try{const r=new Float32Array(128),a=new Float32Array(128);for(let f=0;f<128;f++)r[f]=(Math.random()-.5)*2,a[f]=1;const n=X(r),o=X(a),s=U(128*4),i=new ArrayBuffer(8);new Uint32Array(i)[0]=128,new Float32Array(i)[1]=1e-6;const c=L(i),u=q(Ft,4),l=O().createBindGroup({layout:u.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:s}}]}),d=await Z({name:"RMSNorm",pipeline:u,bindGroup:l,workgroups:[1,1,1],outputBuffer:s,outputBytes:128*4,validator:f=>{const p=new Float32Array(128).fill(.5),m=new Float32Array(128).fill(1),g=cn(p,m,1e-6);let b=0;for(let h=0;h<128;h++)b=Math.max(b,Math.abs(f[h]-g[h]));const v=b<.001;return{pass:v,error:v?"":`Max error: ${b}`}}});return n.destroy(),o.destroy(),s.destroy(),c.destroy(),{name:"RMSNorm",pass:d.pass,maxError:0,details:d.error||"N=128"}}catch(e){return{name:"RMSNorm",pass:!1,maxError:1/0,details:e.message}}}async function Qe(){try{const a=1/Math.sqrt(16),n=1*16*16,o=1*16*16,s=new Float32Array(n),i=new Float32Array(n),c=new Float32Array(n);for(let w=0;w<n;w++)s[w]=Math.random(),i[w]=Math.random(),c[w]=Math.random();const u=X(s),l=X(i),d=X(c),f=U(n*4),p=U(o*4),m=new ArrayBuffer(16),g=new Uint32Array(m),b=new Float32Array(m);g[0]=1,g[1]=16,g[2]=16,b[3]=a;const v=L(m),h=q(Wt,6),S=O().createBindGroup({layout:h.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:d}},{binding:4,resource:{buffer:f}},{binding:5,resource:{buffer:p}}]}),A=await Z({name:"Attention",pipeline:h,bindGroup:S,workgroups:[1,1,1],outputBuffer:f,outputBytes:n*4,validator:w=>{let B=!0;for(let k=0;k<n;k++)if(!isFinite(w[k])){B=!1;break}return{pass:B,error:B?"":"Non-finite output"}}});return u.destroy(),l.destroy(),d.destroy(),f.destroy(),p.destroy(),v.destroy(),{name:"Attention",pass:A.pass,maxError:0,details:A.error||"Finite check passed"}}catch(e){return{name:"Attention",pass:!1,maxError:1/0,details:e.message}}}const ln="aether-gpu-benchmark",fn=1,ue="results";function Ze(){return new Promise((e,t)=>{const r=indexedDB.open(ln,fn);r.onupgradeneeded=()=>{const a=r.result;a.objectStoreNames.contains(ue)||a.createObjectStore(ue,{keyPath:"id"})},r.onsuccess=()=>e(r.result),r.onerror=()=>t(r.error)})}async function Je(e,t){const r=await Ze(),a=`run_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,n={id:a,timestamp:new Date().toISOString(),device:navigator.userAgent,adapter:t.adapter,os:t.os,browser:t.browser,results:e};return new Promise((o,s)=>{const i=r.transaction(ue,"readwrite");i.objectStore(ue).put(n),i.oncomplete=()=>o(a),i.onerror=()=>s(i.error)})}async function It(){const e=await Ze();return new Promise((t,r)=>{const n=e.transaction(ue,"readonly").objectStore(ue).getAll();n.onsuccess=()=>t(n.result),n.onerror=()=>r(n.error)})}async function dn(){const e=await Ze();return new Promise((t,r)=>{const a=e.transaction(ue,"readwrite");a.objectStore(ue).clear(),a.oncomplete=()=>t(),a.onerror=()=>r(a.error)})}function pn(e,t){const r={version:"1.0",exportDate:new Date().toISOString(),userAgent:navigator.userAgent,deviceInfo:t??{},results:e.map(a=>({...a,details:a.details??{}}))};return JSON.stringify(r,null,2)}function mn(e,t){const r=`aether-benchmark-${Date.now()}.json`,a=new Blob([e],{type:"application/json"}),n=URL.createObjectURL(a),o=document.createElement("a");o.href=n,o.download=r,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(n)}let Q=null,K=!1;function x(e,t=""){if(!Q)return;const r=Q.querySelector("#bench-log");if(!r)return;const a=document.createElement("div");a.className=`log-entry ${t}`,a.textContent=e,r.appendChild(a),r.scrollTop=r.scrollHeight}function z(e,t){if(!Q)return;const r=Q.querySelector("#progress-fill"),a=Q.querySelector("#progress-label");r&&(r.style.width=e<0?"0%":`${Math.min(e,100)}%`),a&&(a.textContent=t)}function et(e){if(!Q)return;const t=Q.querySelector("#results-table");if(!t)return;if(e.length===0){t.innerHTML='<div class="empty-state"><p>No results yet</p></div>';return}let r=`<table style="width:100%;border-collapse:collapse;font-size:12px;font-family:var(--mono)">
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
    </tr>`}r+="</tbody></table>",t.innerHTML=r}function qe(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function gn(){if(K)return;K=!0;const e=Q?.querySelector("#btn-quick");e&&(e.disabled=!0);const t=[];try{x("═══ QUICK BENCHMARK ═══","info"),z(0,"Initializing GPU...");const r=await xe();x(`Adapter: ${r.adapterName}`,"ok"),x(`Timestamp query: ${r.timestampQuerySupport?"YES":"NO"}`,""),x("",""),x("── CORRECTNESS TESTS ──","info");const a=[{name:"Vector Add",fn:je},{name:"Matmul",fn:Ke},{name:"Conv2D",fn:Ve},{name:"Softmax",fn:Ye},{name:"RMSNorm",fn:Xe},{name:"Attention",fn:Qe}];let n=!0;for(const u of a)try{const l=await u.fn();x(`  ${l.pass?"✓":"✗"} ${l.name}: ${l.details||""} (max err: ${l.maxError.toExponential(2)})`,l.pass?"ok":"err"),l.pass||(n=!1)}catch(l){x(`  ✗ ${u.name}: FAILED WITH ERROR: ${l.message}`,"err"),n=!1}x(`  ${n?"ALL TESTS PASSED":"SOME TESTS FAILED"}`,n?"ok":"err"),x("",""),x("── BENCHMARKS ──","info"),z(10,"Vector Add..."),x("▸ Vector Addition","info");const o=await zt();for(const u of o)x(`  ${u.name} ${u.inputSize}: ${u.executionTimeMs.toFixed(2)} ms — ${u.throughput} [${u.success?"PASS":"FAIL"}]`,u.success?"ok":"err"),t.push(u);z(30,"Matrix Multiply..."),x("▸ Matrix Multiply","info");const s=await Rt();for(const u of s)x(`  ${u.name} ${u.inputSize}: ${u.executionTimeMs.toFixed(2)} ms — ${u.throughput} [${u.success?"PASS":"FAIL"}]`,u.success?"ok":"err"),t.push(u);z(60,"Softmax..."),x("▸ Softmax","info");const i=await Lt();for(const u of i)x(`  ${u.name} ${u.inputSize}: ${u.executionTimeMs.toFixed(2)} ms — ${u.throughput} [${u.success?"PASS":"FAIL"}]`,u.success?"ok":"err"),t.push(u);z(80,"RMSNorm..."),x("▸ RMSNorm","info");const c=await qt();for(const u of c)x(`  ${u.name} ${u.inputSize}: ${u.executionTimeMs.toFixed(2)} ms — ${u.throughput} [${u.success?"PASS":"FAIL"}]`,u.success?"ok":"err"),t.push(u);z(100,"Done"),x("",""),x("═══ QUICK BENCHMARK COMPLETE ═══","info"),x(`${t.length} tests run`,""),et(t);try{await Je(t,{adapter:r.adapterName,os:tt(),browser:rt()})}catch{}}catch(r){x(`ERROR: ${r.message}`,"err"),z(0,"Error")}finally{K=!1,e&&(e.disabled=!1)}}async function bn(){if(K)return;K=!0;const e=Q?.querySelector("#btn-full");e&&(e.disabled=!0);const t=[];try{x("═══ FULL BENCHMARK ═══","info"),z(0,"Initializing GPU...");const r=await xe();x(`Adapter: ${r.adapterName}`,"ok"),x("",""),x("── CORRECTNESS TESTS ──","info");const a=[{name:"Vector Add",fn:je},{name:"Matmul",fn:Ke},{name:"Conv2D",fn:Ve},{name:"Softmax",fn:Ye},{name:"RMSNorm",fn:Xe},{name:"Attention",fn:Qe}];for(const o of a)try{const s=await o.fn();x(`  ${s.pass?"✓":"✗"} ${s.name}: ${s.details||""} (max err: ${s.maxError.toExponential(2)})`,s.pass?"ok":"err")}catch(s){x(`  ✗ ${o.name}: FAILED WITH ERROR: ${s.message}`,"err")}const n=[{name:"Vector Addition",fn:zt,pct:10},{name:"Matrix Multiply",fn:Rt,pct:25},{name:"Convolution",fn:tn,pct:40},{name:"Softmax",fn:Lt,pct:55},{name:"RMSNorm",fn:qt,pct:65},{name:"Attention",fn:rn,pct:75},{name:"Memory",fn:()=>nn(r),pct:90}];for(const o of n){z(o.pct,`${o.name}...`),x(`▸ ${o.name}`,"info");try{const s=await o.fn();for(const i of s)x(`  ${i.inputSize}: ${i.executionTimeMs.toFixed(2)} ms — ${i.throughput} [${i.success?"PASS":"FAIL"}]`,i.success?"ok":"err"),t.push(i)}catch(s){x(`  ERROR: ${s.message}`,"err")}}z(100,"Done"),x("",""),x("═══ FULL BENCHMARK COMPLETE ═══","info"),x(`${t.length} tests run`,""),et(t);try{await Je(t,{adapter:r.adapterName,os:tt(),browser:rt()})}catch{}}catch(r){x(`ERROR: ${r.message}`,"err"),z(0,"Error")}finally{K=!1,e&&(e.disabled=!1)}}async function yn(){if(K)return;K=!0;const e=Q?.querySelector("#btn-sustained");e&&(e.disabled=!0);const t=[];try{x("═══ SUSTAINED LOAD BENCHMARK ═══","info"),x("This will run 30s + 60s + 180s = 270s total","warn"),x("Keep the screen on and do not switch tabs","warn"),z(0,"Initializing GPU..."),await xe();const r=await an((a,n)=>{a>=0&&z(a,n),x(`  ${n}`,"")});for(const a of r)x(`  ${a.name}: ${a.avgGflops.toFixed(1)} GFLOPS avg, throttled=${a.thermalThrottling}`,a.thermalThrottling?"warn":"ok"),t.push(a);z(100,"Done"),x("",""),x("═══ SUSTAINED BENCHMARK COMPLETE ═══","info"),et(t);try{await Je(t,{adapter:(await xe()).adapterName,os:tt(),browser:rt()})}catch{}}catch(r){x(`ERROR: ${r.message}`,"err"),z(0,"Error")}finally{K=!1,e&&(e.disabled=!1)}}async function vn(){if(!K){K=!0;try{x("═══ CORRECTNESS TESTS ═══","info"),await xe();const e=[{name:"Vector Add",fn:je},{name:"Matmul",fn:Ke},{name:"Conv2D",fn:Ve},{name:"Softmax",fn:Ye},{name:"RMSNorm",fn:Xe},{name:"Attention",fn:Qe}];let t=!0;for(const r of e)try{const a=await r.fn();x(`${a.pass?"✓":"✗"} ${a.name}: ${a.details||""} (max err: ${a.maxError.toExponential(2)})`,a.pass?"ok":"err"),a.pass||(t=!1)}catch(a){x(`✗ ${r.name}: FAILED WITH ERROR: ${a.message}`,"err"),t=!1}x("",""),x(t?"ALL TESTS PASSED":"SOME TESTS FAILED",t?"ok":"err")}catch(e){x(`ERROR: ${e.message}`,"err")}finally{K=!1}}}async function wn(){try{const e=await It();if(e.length===0){x("No results to export. Run a benchmark first.","warn");return}const t=e[e.length-1],r=pn(t.results,{adapter:t.adapter,os:t.os,browser:t.browser,timestamp:t.timestamp});mn(r),x("JSON exported","ok")}catch(e){x(`Export error: ${e.message}`,"err")}}async function hn(){try{const e=await It();x(`── HISTORY: ${e.length} saved runs ──`,"info");for(const t of e.slice(-5))x(`  ${t.timestamp} — ${t.results.length} results — ${t.adapter}`,"")}catch(e){x(`History error: ${e.message}`,"err")}}async function xn(){try{await dn(),x("History cleared","ok")}catch(e){x(`Clear error: ${e.message}`,"err")}}function tt(){const e=navigator.userAgent;if(e.includes("iPhone")||e.includes("iPad")){const t=e.match(/OS (\d+_\d+)/);return`iOS ${t?t[1].replace("_","."):"?"}`}return e.includes("Mac")?"macOS":e.includes("Windows")?"Windows":e.includes("Android")?"Android":"Unknown"}function rt(){const e=navigator.userAgent;return e.includes("Safari")&&!e.includes("Chrome")?"Safari":e.includes("Chrome")&&!e.includes("Edg")?"Chrome":e.includes("Edg")?"Edge":e.includes("Firefox")?"Firefox":"Unknown"}function Sn(e){Q=e,e.innerHTML=`
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
  `,e.querySelector("#btn-quick")?.addEventListener("click",gn),e.querySelector("#btn-full")?.addEventListener("click",bn),e.querySelector("#btn-sustained")?.addEventListener("click",yn),e.querySelector("#btn-correctness")?.addEventListener("click",vn),e.querySelector("#btn-export")?.addEventListener("click",wn),e.querySelector("#btn-history")?.addEventListener("click",hn),e.querySelector("#btn-clear")?.addEventListener("click",xn);const t=r=>{r.preventDefault()};window.addEventListener("error",t),window.addEventListener("unhandledrejection",t),xe().then(r=>{const a=e.querySelector("#device-badge"),n=e.querySelector("#device-info");a&&(a.textContent="WEBGPU READY",a.className="badge badge-pass"),n&&(n.innerHTML=`
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
      `)}).catch(r=>{const a=e.querySelector("#device-badge");a&&(a.textContent="WEBGPU UNAVAILABLE",a.className="badge badge-fail")})}const Bn=Object.freeze(Object.defineProperty({__proto__:null,render:Sn},Symbol.toStringTag,{value:"Module"})),nt=[{id:"gpubench",label:"GPU Bench",module:Bn},{id:"device",label:"Device Test",module:Jt},{id:"webgpudiag",label:"WebGPU Diag",module:Xr},{id:"model",label:"Model Test",module:cr},{id:"tensor",label:"Tensor Bench",module:Kr},{id:"image",label:"Image Test",module:fr},{id:"video",label:"Video Test",module:gr},{id:"diag",label:"Diagnostics",module:wr}];let Ht="gpubench";function Pt(){const e=window.location.hash.replace("#","");return nt.some(t=>t.id===e)?e:e==="diagnostics/webgpu"||e==="webgpu"?"webgpudiag":"gpubench"}function We(e){Ht=e,window.location.hash=e;const t=document.getElementById("nav"),r=document.getElementById("screen");t.querySelectorAll("button").forEach(n=>{n.classList.toggle("active",n.dataset.screen===e)});const a=nt.find(n=>n.id===e);a&&a.module.render(r)}function An(){const e=document.getElementById("app");e.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const t=document.getElementById("nav");document.getElementById("screen"),nt.forEach(a=>{const n=document.createElement("button");n.textContent=a.label,n.dataset.screen=a.id,n.addEventListener("click",()=>We(a.id)),t.appendChild(n)});const r=Pt();We(r),window.addEventListener("hashchange",()=>{const a=Pt();a!==Ht&&We(a)}),"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").catch(()=>{})}An();
