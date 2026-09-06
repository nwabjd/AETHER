(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();function Ht(e){let t="Unknown",r="Unknown",a="Unknown",n="Unknown";const o=e.match(/OS (\d+)_(\d+)/);o&&(a="iOS",n=`${o[1]}.${o[2]}`);const s=e.match(/Mac OS X (\d+)[_.](\d+)/);if(s&&(a="macOS",n=`${s[1]}.${s[2]}`),e.includes("Windows")){a="Windows";const c=e.match(/Windows NT (\d+\.\d+)/);c&&(n=c[1])}if(e.includes("Android")){a="Android";const c=e.match(/Android (\d+[\.\d]*)/);c&&(n=c[1])}if(e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")){t="Safari";const c=e.match(/Version\/(\d+[\.\d]*)/);c&&(r=c[1])}if(e.includes("Chrome")&&!e.includes("Edg")){t="Chrome";const c=e.match(/Chrome\/(\d+[\.\d]*)/);c&&(r=c[1])}if(e.includes("Edg/")){t="Edge";const c=e.match(/Edg\/(\d+[\.\d]*)/);c&&(r=c[1])}if(e.includes("Firefox")){t="Firefox";const c=e.match(/Firefox\/(\d+[\.\d]*)/);c&&(r=c[1])}return{browserName:t,browserVersion:r,osName:a,osVersion:n}}function It(e){return!!(e.includes("FBAN")||e.includes("FBIOS")||e.includes("Twitter")||e.includes("Instagram")||e.includes("Line/")||e.includes("WeChat")||e.includes("MicroMessenger")||e.includes("CocoaPods")||e.includes("wv)")||e.includes("Electron")||e.includes("; wv)"))}function jt(e){return e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")}async function Fe(){const e=navigator.userAgent,t=Ht(e),r=t.osName==="iOS",a=jt(e),n=It(e),o=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,s={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:e,platform:navigator.platform,isIOS:r,isSafari:a,isWebView:n,isStandalone:o,browserName:t.browserName,browserVersion:t.browserVersion,osName:t.osName,osVersion:t.osVersion},i={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(n)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:s,gpu:i};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:r?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:s,gpu:i};if(!navigator.gpu){let c="navigator.gpu is undefined. WebGPU API is not exposed.",u="";if(r){if(parseInt(t.osVersion.split(".")[0],10)<26)return c=`iOS ${t.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,u="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:c,recommendation:u,environment:s,gpu:i};if(t.browserName!=="Safari")return c=`Running ${t.browserName} on iOS ${t.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,u="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:c,recommendation:u,environment:s,gpu:i}}return t.osName==="macOS"&&parseInt(t.osVersion.split(".")[0],10)<14?(c=`macOS ${t.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,u="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:c,recommendation:u,environment:s,gpu:i}):(u="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:c,recommendation:u,environment:s,gpu:i})}try{const c=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!c){i.adapterError="requestAdapter() returned null";let d="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",f="";return r?parseInt(t.osVersion.split(".")[0],10)>=26&&(d=`iOS ${t.osVersion} with Safari ${t.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,f="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(d="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",f="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):f="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:d,recommendation:f,environment:s,gpu:i}}i.adapterName=c.name??"Unknown GPU",i.adapterVendor=c.vendor??"Unknown",i.adapterDevice=c.device??"Unknown",i.isFallbackAdapter=c.isFallbackAdapter??!1;const u=[];for(const d of c.features)u.push(d.replace(/-/g," ").replace(/\b\w/g,f=>f.toUpperCase()));i.features=u;const l=c.limits;i.limits={maxBufferSize:l.maxBufferSize,maxTextureDimension1D:l.maxTextureDimension1D,maxTextureDimension2D:l.maxTextureDimension2D,maxTextureDimension3D:l.maxTextureDimension3D,maxComputeWorkgroupStorageSize:l.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:l.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:l.maxStorageBufferBindingSize,maxUniformBufferBindingSize:l.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:l.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:l.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:l.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:l.maxComputeWorkgroupsPerDimension,maxColorAttachments:l.maxColorAttachments,minStorageBufferOffsetAlignment:l.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:l.minUniformBufferOffsetAlignment};try{(await c.requestDevice({requiredLimits:{}})).destroy()}catch(d){return i.deviceError=d.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${i.adapterName}) but requestDevice() failed: ${d.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:s,gpu:i}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${i.adapterName}.`,recommendation:"No action needed.",environment:s,gpu:i}}catch(c){return i.adapterError=c.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${c.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:s,gpu:i}}}function Ct(e){const t=[];if(t.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),t.push(""),t.push(`STATUS: ${e.statusLabel}`),t.push(`CASE: ${e.case}`),t.push(`REASON: ${e.reason}`),t.push(`RECOMMENDATION: ${e.recommendation}`),t.push(""),t.push("── ENVIRONMENT ──"),t.push(`  URL: ${e.environment.url}`),t.push(`  Protocol: ${e.environment.protocol}`),t.push(`  Hostname: ${e.environment.hostname}`),t.push(`  Secure Context: ${e.environment.isSecureContext}`),t.push(`  iOS: ${e.environment.isIOS}`),t.push(`  Safari: ${e.environment.isSafari}`),t.push(`  WebView: ${e.environment.isWebView}`),t.push(`  Standalone PWA: ${e.environment.isStandalone}`),t.push(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`),t.push(`  OS: ${e.environment.osName} ${e.environment.osVersion}`),t.push(`  Platform: ${e.environment.platform}`),t.push(`  User Agent: ${e.environment.userAgent}`),t.push(""),t.push("── WEBGPU ──"),t.push(`  navigator.gpu exists: ${e.gpu.navigatorGpuExists}`),e.gpu.adapterName&&t.push(`  Adapter: ${e.gpu.adapterName}`),e.gpu.adapterVendor&&t.push(`  Vendor: ${e.gpu.adapterVendor}`),e.gpu.adapterDevice&&t.push(`  Device: ${e.gpu.adapterDevice}`),e.gpu.adapterError&&t.push(`  Adapter Error: ${e.gpu.adapterError}`),e.gpu.deviceError&&t.push(`  Device Error: ${e.gpu.deviceError}`),t.push(`  Fallback adapter: ${e.gpu.isFallbackAdapter}`),e.gpu.features.length>0){t.push(`  Features (${e.gpu.features.length}):`);for(const r of e.gpu.features)t.push(`    ${r}`)}if(e.gpu.limits){t.push("  Limits:");for(const[r,a]of Object.entries(e.gpu.limits))t.push(`    ${r}: ${typeof a=="number"?a.toLocaleString():a}`)}return t.push(""),t.push(`Timestamp: ${new Date().toISOString()}`),t.join(`
`)}function Te(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function fe(){const e=await Fe();if(!e.ready||!e.gpu.adapterName)return null;const t=e.gpu.limits;return{available:!0,adapterName:e.gpu.adapterName,adapterVendor:e.gpu.adapterVendor,adapterDevice:e.gpu.adapterDevice,features:e.gpu.features,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:e.gpu.isFallbackAdapter,featuresMap:new Set(e.gpu.features),diagnostic:e}}async function pe(e,t=[]){const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("Failed to re-acquire GPU adapter");const a=await r.requestDevice({requiredFeatures:t.filter(n=>e.featuresMap.has(n)),requiredLimits:{}});return a.lost.then(n=>{console.error("WebGPU device lost:",n.message)}),a}function Kt(e){const t=e.environment,r=e.gpu;let a="badge-fail";e.case==="D"?a="badge-pass":(e.case==="B"||e.case==="C")&&(a="badge-warn");let n=`
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
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${Te(r.limits.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${r.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${r.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${r.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${Te(r.limits.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${Te(r.limits.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${Te(r.limits.maxComputeWorkgroupStorageSize)}</span></div>
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
    `),n}function Vt(e){e.innerHTML=`
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;const t=e.querySelector("#device-status"),r=e.querySelector("#device-info");Fe().then(a=>{a.ready?t.innerHTML=`
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `:t.innerHTML="",r.innerHTML=Kt(a)})}const Yt=Object.freeze(Object.defineProperty({__proto__:null,render:Vt},Symbol.toStringTag,{value:"Module"}));let G=class Pt{buffer;shape;dtype;size;device;constructor(t,r,a="f32"){this.device=t,this.shape=[...r],this.dtype=a,this.size=r.reduce((s,i)=>s*i,1);const n=a==="f32"?4:a==="f16"?2:4;this.buffer=t.createBuffer({size:this.size*n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(a==="f32"?new Float32Array(this.buffer.getMappedRange()):a==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(t,r,a){const n=new Pt(t,a,r instanceof Float32Array?"f32":"i32");return t.queue.writeBuffer(n.buffer,0,r.buffer),n}async readback(){const t=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r=this.device.createCommandEncoder();r.copyBufferToBuffer(this.buffer,0,t,0,this.buffer.size),this.device.queue.submit([r.finish()]),await t.mapAsync(GPUMapMode.READ);const a=new Float32Array(t.getMappedRange().slice(0));return t.unmap(),t.destroy(),a}destroy(){this.buffer.destroy()}};async function Be(e,t,r=50,a){const n=[];for(let u=0;u<Math.min(5,r);u++)await t();for(let u=0;u<r;u++){const l=performance.now();await t(),await Ut?.queue.onSubmittedWorkDone();const d=performance.now();n.push(d-l)}n.sort((u,l)=>u-l);const o=n.reduce((u,l)=>u+l,0)/n.length,s=n[0],i=n[n.length-1],c={name:e,avgMs:o,minMs:s,maxMs:i,iterations:r};if(a){const l=a/(o/1e3)/1e9;c.gflops=l,c.throughput=`${l.toFixed(2)} GFLOPS`}return c}let Ut=null;function me(e){Ut=e}function Ae(e){const t=[`${e.name}: ${e.avgMs.toFixed(2)} ms avg`,`(${e.minMs.toFixed(2)} – ${e.maxMs.toFixed(2)} ms)`,`[${e.iterations} iterations]`];return e.throughput&&t.push(e.throughput),t.join(" ")}const Oe=`
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
`,Xt=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= uniforms.N) { return; }
  data[i] = max(data[i], 0.0);
}
`,Qt=`
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
`,Zt=`
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
`,Jt=`
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
`,er=`
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
`;let v=null,be=null;function N(e,t=""){if(!be)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,be.appendChild(r),be.scrollTop=be.scrollHeight}async function nt(){N("═══ TINY NEURAL NETWORK TEST ═══","info"),N("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),N("");const e=await fe();if(!e)return N("WebGPU not available","err"),!1;v=await pe(e),me(v);const t=performance.now(),r=G.fromData(v,new Float32Array([1,.5,-.3,.8]),[4]),a=G.fromData(v,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),n=G.fromData(v,new Float32Array([.1,-.1,.2]),[3]),o=new ArrayBuffer(12),s=new Uint32Array(o);s[0]=1,s[1]=3,s[2]=4;const i=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:v.createShaderModule({code:Oe}),entryPoint:"main"}}),u=v.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(u,0,o);const l=new G(v,[1,3]),d=v.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:a.buffer}},{binding:3,resource:{buffer:l.buffer}}]});let f=v.createCommandEncoder(),p=f.beginComputePass();p.setPipeline(c),p.setBindGroup(0,d),p.dispatchWorkgroups(1,1,1),p.end(),v.queue.submit([f.finish()]),N(`  input[4]:  [${Array.from(await r.readback()).map(_=>_.toFixed(2)).join(", ")}]`,""),N("  W1[4×3]:   4 rows × 3 cols",""),N("  Matmul result: computing...","");const m=await l.readback();N(`  h1 = input @ W1: [${Array.from(m).map(_=>_.toFixed(3)).join(", ")}]`,"ok");for(let _=0;_<3;_++)m[_]+=[.1,-.1,.2][_];v.queue.writeBuffer(l.buffer,0,m.buffer),N(`  h1 + bias:       [${Array.from(m).map(_=>_.toFixed(3)).join(", ")}]`,"ok");const g=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),b=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[g]}),compute:{module:v.createShaderModule({code:Xt}),entryPoint:"main"}}),y=new ArrayBuffer(4);new Uint32Array(y)[0]=3;const h=v.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(h,0,y);const x=v.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:l.buffer}}]});f=v.createCommandEncoder(),p=f.beginComputePass(),p.setPipeline(b),p.setBindGroup(0,x),p.dispatchWorkgroups(1,1,1),p.end(),v.queue.submit([f.finish()]);const S=await l.readback();N(`  ReLU(h1):         [${Array.from(S).map(_=>_.toFixed(3)).join(", ")}]`,"ok");const w=G.fromData(v,new Float32Array([.7,-.3,.5]),[3,1]),B=new G(v,[1,1]),k=new ArrayBuffer(12),C=new Uint32Array(k);C[0]=1,C[1]=1,C[2]=3;const O=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),U=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[O]}),compute:{module:v.createShaderModule({code:Oe}),entryPoint:"main"}}),K=v.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(K,0,k);const Z=v.createBindGroup({layout:O,entries:[{binding:0,resource:{buffer:K}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:w.buffer}},{binding:3,resource:{buffer:B.buffer}}]});f=v.createCommandEncoder(),p=f.beginComputePass(),p.setPipeline(U),p.setBindGroup(0,Z),p.dispatchWorkgroups(1,1,1),p.end(),v.queue.submit([f.finish()]);const z=await B.readback(),L=(performance.now()-t).toFixed(1);return N(`  Final output: ${z[0].toFixed(4)}`,"ok"),N(`  Total pipeline: ${L} ms`,"ok"),N("",""),N("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),r.destroy(),a.destroy(),n.destroy(),l.destroy(),w.destroy(),B.destroy(),u.destroy(),K.destroy(),h.destroy(),v.destroy(),!0}async function tr(){N("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const e=await fe();if(!e)return null;v=await pe(e),me(v);const t=[64,128,256,512],r=[];for(const a of t){const n=G.fromData(v,new Float32Array(a*a).fill(1),[a,a]),o=G.fromData(v,new Float32Array(a*a).fill(.5),[a,a]),s=new G(v,[a,a]),i=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:v.createShaderModule({code:Oe}),entryPoint:"main"}}),u=new ArrayBuffer(12),l=new Uint32Array(u);l[0]=a,l[1]=a,l[2]=a;const d=await Be(`${a}×${a} matmul`,async()=>{const f=v.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(f,0,u);const p=v.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:s.buffer}}]}),m=v.createCommandEncoder(),g=m.beginComputePass();g.setPipeline(c),g.setBindGroup(0,p);const b=Math.ceil(a/16);g.dispatchWorkgroups(b,b,1),g.end(),v.queue.submit([m.finish()]),f.destroy()},30,2*a*a*a);r.push(d),N(Ae(d),"ok"),n.destroy(),o.destroy(),s.destroy()}return v.destroy(),r[r.length-1]}async function rr(){N("═══ CONVOLUTION BENCHMARK ═══","info");const e=await fe();if(!e)return null;v=await pe(e),me(v);const t=1,r=3,a=32,n=32,o=8,s=3,i=3,c=a-s+1,u=n-i+1,l=G.fromData(v,new Float32Array(t*r*a*n).fill(.5),[t,r,a,n]),d=G.fromData(v,new Float32Array(o*r*s*i).fill(.1),[o,r,s,i]),f=new G(v,[t,o,c,u]),p=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),m=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[p]}),compute:{module:v.createShaderModule({code:Qt}),entryPoint:"main"}}),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=t,b[1]=r,b[2]=a,b[3]=n,b[4]=o,b[5]=s,b[6]=i,b[7]=c,b[8]=u;const y=await Be(`Conv2D ${t}×${r}×${a}×${n} k=${s}→${o}×${c}×${u}`,async()=>{const h=v.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(h,0,g);const x=v.createBindGroup({layout:p,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:d.buffer}},{binding:3,resource:{buffer:f.buffer}}]}),S=v.createCommandEncoder(),w=S.beginComputePass();w.setPipeline(m),w.setBindGroup(0,x),w.dispatchWorkgroups(t,o,1),w.end(),v.queue.submit([S.finish()]),h.destroy()},20,2*t*o*r*s*i*c*u);return N(Ae(y),"ok"),l.destroy(),d.destroy(),f.destroy(),v.destroy(),y}async function nr(){N("═══ ATTENTION BENCHMARK ═══","info");const e=await fe();if(!e)return null;v=await pe(e),me(v);const t=1,r=64,a=64,n=1/Math.sqrt(a),o=G.fromData(v,new Float32Array(t*r*a).fill(.1),[t,r,a]),s=G.fromData(v,new Float32Array(t*r*a).fill(.1),[t,r,a]),i=G.fromData(v,new Float32Array(t*r*a).fill(.1),[t,r,a]),c=new G(v,[t,r,a]),u=new G(v,[t,r,r]),l=v.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),d=v.createComputePipeline({layout:v.createPipelineLayout({bindGroupLayouts:[l]}),compute:{module:v.createShaderModule({code:Zt}),entryPoint:"main"}}),f=new ArrayBuffer(16),p=new Uint32Array(f),m=new Float32Array(f);p[0]=t,p[1]=r,p[2]=a,m[3]=n;const g=await Be(`Attention b=${t} s=${r} d=${a}`,async()=>{const b=v.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.queue.writeBuffer(b,0,f);const y=v.createBindGroup({layout:l,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}},{binding:4,resource:{buffer:c.buffer}},{binding:5,resource:{buffer:u.buffer}}]}),h=v.createCommandEncoder(),x=h.beginComputePass();x.setPipeline(d),x.setBindGroup(0,y),x.dispatchWorkgroups(t,1,1),x.end(),v.queue.submit([h.finish()]),b.destroy()},20);return N(Ae(g),"ok"),o.destroy(),s.destroy(),i.destroy(),c.destroy(),u.destroy(),v.destroy(),g}function ar(e){e.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,be=e.querySelector("#model-log"),e.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{be.innerHTML="",await nt()}),e.querySelector("#btn-all-bench").addEventListener("click",async()=>{be.innerHTML="",await nt(),N("",""),await tr(),N("",""),await rr(),N("",""),await nr(),N("",""),N("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const or=Object.freeze(Object.defineProperty({__proto__:null,render:ar},Symbol.toStringTag,{value:"Module"}));let $=null,le=null;function ee(e,t=""){if(!le)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,le.appendChild(r),le.scrollTop=le.scrollHeight}function $t(e,t){const r=new Float32Array(e*t*4);for(let a=0;a<t;a++)for(let n=0;n<e;n++){const o=(a*e+n)*4,s=(n>>4)+(a>>4)&1;r[o+0]=s?.9:n/e*.8,r[o+1]=s?.3:a/t*.6,r[o+2]=s?.6:.4,r[o+3]=1}return r}function Le(e,t,r){const a=document.createElement("canvas");a.width=t,a.height=r;const n=a.getContext("2d"),o=n.createImageData(t,r);for(let s=0;s<t*r*4;s++)o.data[s]=Math.round(e[s]*255);return n.putImageData(o,0,0),a}async function at(){ee("═══ GRAYSCALE TEST ═══","info");const e=await fe();if(!e){ee("WebGPU unavailable","err");return}$=await pe(e),me($);const t=256,r=256,a=$t(t,r),n=G.fromData($,a,[t*r*4]),o=new G($,[t*r*4]),s=$.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=$.createComputePipeline({layout:$.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:$.createShaderModule({code:er}),entryPoint:"main"}}),c=new ArrayBuffer(4);new Uint32Array(c)[0]=t*r;const u=await Be("Grayscale 256×256",async()=>{const m=$.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});$.queue.writeBuffer(m,0,c);const g=$.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:n.buffer}},{binding:2,resource:{buffer:o.buffer}}]}),b=$.createCommandEncoder(),y=b.beginComputePass();y.setPipeline(i),y.setBindGroup(0,g),y.dispatchWorkgroups(Math.ceil(t*r/256),1,1),y.end(),$.queue.submit([b.finish()]),m.destroy()},50);ee(Ae(u),"ok");const l=await o.readback(),d=Le(a,t,r),f=Le(l,t,r),p=je?.querySelector("#image-display");if(p){p.innerHTML="";const m=document.createElement("div");m.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const g=document.createElement("div");g.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',g.appendChild(d);const b=document.createElement("div");b.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',b.appendChild(f),m.appendChild(g),m.appendChild(b),p.appendChild(m)}n.destroy(),o.destroy(),$.destroy(),ee("✓ Grayscale complete","ok")}async function ot(){ee("═══ CONVOLUTION KERNEL TEST ═══","info");const e=await fe();if(!e){ee("WebGPU unavailable","err");return}$=await pe(e),me($);const t=128,r=128,a=3,n=$t(t,r),o={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},s=$.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=$.createComputePipeline({layout:$.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:$.createShaderModule({code:Jt}),entryPoint:"main"}}),c=new ArrayBuffer(16),u=new Uint32Array(c);u[0]=t,u[1]=r,u[2]=a,u[3]=0;for(const[l,d]of Object.entries(o)){const f=G.fromData($,n,[t*r*4]),p=G.fromData($,d,[a*a]),m=new G($,[t*r*4]),g=await Be(`Conv ${l} ${t}×${r}`,async()=>{const h=$.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});$.queue.writeBuffer(h,0,c);const x=$.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:p.buffer}},{binding:2,resource:{buffer:f.buffer}},{binding:3,resource:{buffer:m.buffer}}]}),S=$.createCommandEncoder(),w=S.beginComputePass();w.setPipeline(i),w.setBindGroup(0,x),w.dispatchWorkgroups(Math.ceil(t/16),Math.ceil(r/16),1),w.end(),$.queue.submit([S.finish()]),h.destroy()},30);ee(Ae(g),"ok");const b=await m.readback(),y=je?.querySelector("#image-display");if(y){const h=Le(b,t,r),x=document.createElement("div");x.style.cssText="display:inline-block;margin:4px",x.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${l}</div>`,x.appendChild(h),y.appendChild(x)}f.destroy(),p.destroy(),m.destroy()}$.destroy(),ee("✓ All convolution kernels applied","ok")}let je=null;function sr(e){je=e,e.innerHTML=`
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
  `,le=e.querySelector("#image-log"),e.querySelector("#btn-grayscale").addEventListener("click",async()=>{le.innerHTML="",e.querySelector("#image-display").innerHTML="",await at()}),e.querySelector("#btn-conv").addEventListener("click",async()=>{le.innerHTML="",e.querySelector("#image-display").innerHTML="",await ot()}),e.querySelector("#btn-all-img").addEventListener("click",async()=>{le.innerHTML="",e.querySelector("#image-display").innerHTML="",await at(),ee("",""),await ot(),ee("",""),ee("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const ir=Object.freeze(Object.defineProperty({__proto__:null,render:sr},Symbol.toStringTag,{value:"Module"}));let W=null,Ue=null,Ne=null;function Re(e,t=""){if(!Ue)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Ue.appendChild(r),Ue.scrollTop=Ue.scrollHeight}const ur=`
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
`;let He=0,Ge=0;async function cr(e,t,r,a,n){const o=await fe();if(!o){Re("WebGPU unavailable","err");return}W=await pe(o),me(W);const[s,i]=a.value.split("x").map(Number);e.width=s,e.height=i,He=parseInt(n.value);const c=W.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=W.createComputePipeline({layout:W.createPipelineLayout({bindGroupLayouts:[c]}),compute:{module:W.createShaderModule({code:ur}),entryPoint:"main"}}),l=W.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),d=e.getContext("2d"),f=W.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let p=performance.now(),m=0,g=0;t.textContent="RENDERING",t.className="badge badge-pass";function b(){const y=new ArrayBuffer(16),h=new Uint32Array(y);h[0]=s,h[1]=i,h[2]=Ge,h[3]=He,W.queue.writeBuffer(f,0,y);const x=W.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:l}}]}),S=W.createCommandEncoder(),w=S.beginComputePass();w.setPipeline(u),w.setBindGroup(0,x),w.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(i/16),1),w.end();const B=W.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});S.copyBufferToBuffer(l,0,B,0,s*i*4*4),W.queue.submit([S.finish()]),B.mapAsync(GPUMapMode.READ).then(()=>{const k=new Float32Array(B.getMappedRange().slice(0));B.unmap(),B.destroy();const C=d.createImageData(s,i);for(let U=0;U<s*i*4;U++)C.data[U]=Math.round(k[U]*255);d.putImageData(C,0,0),Ge++,g++;const O=performance.now();O-p>=1e3&&(m=Math.round(g*1e3/(O-p)),r.textContent=`${m} FPS | Frame ${Ge} | ${s}×${i}`,g=0,p=O),Ne=requestAnimationFrame(b)})}b()}function st(){Ne!==null&&(cancelAnimationFrame(Ne),Ne=null),W&&(W.destroy(),W=null)}function lr(e){e.innerHTML=`
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
  `,Ue=e.querySelector("#video-log");const t=e.querySelector("#video-canvas"),r=e.querySelector("#video-status"),a=e.querySelector("#video-fps"),n=e.querySelector("#res-select"),o=e.querySelector("#mode-select");e.querySelector("#btn-start").addEventListener("click",()=>{st(),Ge=0,He=parseInt(o.value),Re(`Starting GPU compute video: ${n.value} mode=${o.value}`,"info"),cr(t,r,a,n,o)}),e.querySelector("#btn-stop").addEventListener("click",()=>{st(),r.textContent="STOPPED",r.className="badge badge-info",Re("Rendering stopped","warn")})}const dr=Object.freeze(Object.defineProperty({__proto__:null,render:lr},Symbol.toStringTag,{value:"Module"}));let we=null;function P(e,t=""){if(!we)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,we.appendChild(r),we.scrollTop=we.scrollHeight}async function fr(){if(we.innerHTML="",P("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),P(`Timestamp: ${new Date().toISOString()}`,""),!await pr())return;const t=await fe();if(!t){P("Cannot proceed: GPU not ready","err");return}P("",""),P("── MEMORY TEST ──","info");const r=await pe(t);me(r);const a=Math.floor(t.limits.maxBufferSize/1048576);P(`Attempting to allocate buffer at reported max: ${a} MB`,"");try{const n=r.createBuffer({size:t.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});P("Buffer allocation at max: SUCCESS","ok"),n.destroy()}catch(n){P(`Buffer allocation at max: FAILED — ${n.message}`,"warn");for(const o of[256,128,64,32])try{const s=r.createBuffer({size:o*1048576,usage:GPUBufferUsage.STORAGE});P(`Largest successful allocation: ${o} MB`,"ok"),s.destroy();break}catch{continue}}P("",""),P("── COMPUTE THROUGHPUT ──","info");for(const n of[64,128,256]){const o=G.fromData(r,new Float32Array(n*n).fill(1),[n,n]),s=G.fromData(r,new Float32Array(n*n).fill(1),[n,n]),i=new G(r,[n,n]),c=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[c]}),compute:{module:r.createShaderModule({code:Oe}),entryPoint:"main"}}),l=await Be(`matmul ${n}×${n}`,async()=>{const d=r.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),f=new ArrayBuffer(12);new Uint32Array(f).set([n,n,n]),r.queue.writeBuffer(d,0,f);const p=r.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),m=r.createCommandEncoder(),g=m.beginComputePass();g.setPipeline(u),g.setBindGroup(0,p);const b=Math.ceil(n/16);g.dispatchWorkgroups(b,b,1),g.end(),r.queue.submit([m.finish()]),d.destroy()},30,2*n*n*n);P(Ae(l),"ok"),o.destroy(),s.destroy(),i.destroy()}r.destroy(),P("",""),P("═══ DIAGNOSTICS COMPLETE ═══","info")}async function pr(){const e=await Fe();return Ct(e),P("── WEBGPU STATUS ──","info"),P(`${e.statusLabel} (Case ${e.case})`,e.ready?"ok":"err"),P(`Reason: ${e.reason}`,""),P(`Recommendation: ${e.recommendation}`,""),P("",""),P("── ENVIRONMENT ──","info"),P(`  URL: ${e.environment.url}`,""),P(`  Secure Context: ${e.environment.isSecureContext}`,e.environment.isSecureContext?"ok":"err"),P(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`,""),P(`  OS: ${e.environment.osName} ${e.environment.osVersion}`,""),P(`  iOS: ${e.environment.isIOS}`,""),P(`  Safari: ${e.environment.isSafari}`,""),P(`  WebView: ${e.environment.isWebView}`,e.environment.isWebView?"err":""),P(`  navigator.gpu: ${e.gpu.navigatorGpuExists}`,e.gpu.navigatorGpuExists?"ok":"err"),e.gpu.adapterName&&(P(`  Adapter: ${e.gpu.adapterName}`,"ok"),P(`  Vendor: ${e.gpu.adapterVendor}`,"")),e.gpu.adapterError&&P(`  Adapter Error: ${e.gpu.adapterError}`,"err"),e.gpu.deviceError&&P(`  Device Error: ${e.gpu.deviceError}`,"err"),e.ready?!0:(P("",""),P("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function mr(e){e.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,we=e.querySelector("#diag-log"),e.querySelector("#btn-diag").addEventListener("click",()=>{fr()})}const gr=Object.freeze(Object.defineProperty({__proto__:null,render:mr},Symbol.toStringTag,{value:"Module"}));class ce{dims;ndim;size;strides;constructor(t){this.dims=typeof t=="number"?[t]:[...t],this.ndim=this.dims.length,this.size=this.dims.reduce((n,o)=>n*o,1);const r=new Array(this.ndim);let a=1;for(let n=this.ndim-1;n>=0;n--)r[n]=a,a*=this.dims[n];this.strides=r}equals(t){if(this.ndim!==t.ndim)return!1;for(let r=0;r<this.ndim;r++)if(this.dims[r]!==t.dims[r])return!1;return!0}isContiguous(){let t=1;for(let r=this.ndim-1;r>=0;r--){if(this.strides[r]!==t)return!1;t*=this.dims[r]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new ce([1])}static from(...t){return new ce(t)}}var se=(e=>(e.Float32="f32",e.Float16="f16",e.Int32="i32",e.Int8="i8",e.Uint8="u8",e))(se||{});const br={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function Tt(e){return br[e].bytes}let ae=null;async function yr(){if(ae)return ae;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.limits,r=new Set(e.features),a=await e.requestDevice({requiredLimits:{}});return a.lost.then(n=>{console.error("WebGPU device lost:",n.message),ae=null}),ae={adapter:e,device:a,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:t.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:t.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:t.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:t.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:t.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:t.maxTextureArrayLayers},features:r},ae}function F(){if(!ae)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return ae}function vr(){ae&&(ae.device.destroy(),ae=null)}class xe{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(t,r,a){this.shape=t,this.dtype=r,this.byteSize=t.size*Tt(r),this.gpuBuffer=a??F().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(t,r,a=se.Float32){const n=F(),o=new xe(t,a);return n.device.queue.writeBuffer(o.gpuBuffer,0,r.buffer,r.byteOffset,r.byteLength),o}async readback(){const t=F(),r=t.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),a=t.device.createCommandEncoder();a.copyBufferToBuffer(this.gpuBuffer,0,r,0,this.byteSize),t.device.queue.submit([a.finish()]),await r.mapAsync(GPUMapMode.READ);const n=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),n}destroy(){this.gpuBuffer.destroy()}}class A{shape;dtype;buffer;constructor(t,r=se.Float32,a){this.shape=t,this.dtype=r,this.buffer=a??new xe(t,r)}static fromFloat32(t,r){const a=t instanceof Float32Array?t:new Float32Array(t),n=new ce(r);return new A(n,se.Float32,xe.fromData(n,a,se.Float32))}static fromInt32(t,r){const a=t instanceof Int32Array?t:new Int32Array(t),n=new ce(r);return new A(n,se.Int32,xe.fromData(n,a,se.Int32))}static zeros(t,r=se.Float32){const a=new ce(t),n=a.size*Tt(r),s=F().device.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(s.getMappedRange()).fill(0),s.unmap();const i=new xe(a,r,s);return new A(a,r,i)}static ones(t,r=se.Float32){const a=new ce(t).size,n=new Float32Array(a).fill(1);return A.fromFloat32(n,t)}static randn(t){const r=new ce(t).size,a=new Float32Array(r);for(let n=0;n<r;n++){const o=Math.random(),s=Math.random();a[n]=Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*s)}return A.fromFloat32(a,t)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class hr{cache=new Map;getOrCreate(t,r,a){if(this.cache.has(t))return this.cache.get(t);const n=F(),o=n.device.createComputePipeline({layout:n.device.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:n.device.createShaderModule({code:r}),entryPoint:"main"}});return this.cache.set(t,o),o}get(t){return this.cache.get(t)}clear(){this.cache.clear()}}const wr=`
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
`,xr=`
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
`,Sr=`
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
`,Mr=`
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
`,Br=`
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
`,Ar=`
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
`,Cr=`
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
`,Pr=`
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
`,Ur=`
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
`,$r=`
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
`;function Tr(e,t,r,a,n){const o=new Float32Array(r*a);for(let s=0;s<r;s++)for(let i=0;i<a;i++){let c=0;for(let u=0;u<n;u++)c+=e[s*n+u]*t[u*a+i];o[s*a+i]=c}return o}function Er(e,t){const r=new Float32Array(e.length);for(let a=0;a<e.length;a++)r[a]=e[a]+t[a];return r}function kr(e,t){const r=new Float32Array(e.length);for(let a=0;a<e.length;a++)r[a]=e[a]*t[a];return r}function Nr(e,t,r=1e-6){const a=e.length;let n=0;for(let i=0;i<a;i++)n+=e[i]*e[i];const o=Math.sqrt(n/a+r),s=new Float32Array(a);for(let i=0;i<a;i++)s[i]=e[i]/o*t[i];return s}function Gr(e,t,r,a=1e-6){const n=e.length;let o=0;for(let u=0;u<n;u++)o+=e[u];o/=n;let s=0;for(let u=0;u<n;u++){const l=e[u]-o;s+=l*l}s/=n;const i=1/Math.sqrt(s+a),c=new Float32Array(n);for(let u=0;u<n;u++)c[u]=(e[u]-o)*i*t[u]+r[u];return c}function Or(e,t,r){const a=new Float32Array(e.length);for(let n=0;n<t;n++){const o=n*r;let s=-1e30;for(let c=0;c<r;c++)e[o+c]>s&&(s=e[o+c]);let i=0;for(let c=0;c<r;c++)a[o+c]=Math.exp(e[o+c]-s),i+=a[o+c];for(let c=0;c<r;c++)a[o+c]/=i}return a}function Dr(e,t,r,a=1e4){const n=new Float32Array(e.length);n.set(e);for(let o=0;o<t*r/2;o++){const s=Math.floor(o/(r/2)),i=o%(r/2),c=1/Math.pow(a,i/r),u=s*c,l=Math.cos(u),d=Math.sin(u),f=o*2,p=o*2+1,m=n[f],g=n[p];n[f]=m*l-g*d,n[p]=m*d+g*l}return n}function Fr(e,t,r,a,n,o,s,i,c){const u=n-i+1,l=o-c+1,d=new Float32Array(r*s*u*l);for(let f=0;f<r;f++)for(let p=0;p<s;p++)for(let m=0;m<u;m++)for(let g=0;g<l;g++){let b=0;for(let y=0;y<a;y++)for(let h=0;h<i;h++)for(let x=0;x<c;x++)b+=e[((f*a+y)*n+m+h)*o+g+x]*t[((p*a+y)*i+h)*c+x];d[((f*s+p)*u+m)*l+g]=b}return d}function _r(e,t,r){const a=new Float32Array(t*r);for(let n=0;n<t;n++)for(let o=0;o<r;o++)a[o*t+n]=e[n*r+o];return a}function Wr(e,t,r,a,n,o){const s=new Float32Array(a*n*o);for(let i=0;i<n;i++)for(let c=0;c<a;c++){const u=c*t/a,l=i*r/n,d=Math.floor(u),f=Math.floor(l),p=Math.min(d+1,t-1),m=Math.min(f+1,r-1),g=u-d,b=l-f;for(let y=0;y<o;y++){const h=e[(f*t+d)*o+y],x=e[(f*t+p)*o+y],S=e[(m*t+d)*o+y],w=e[(m*t+p)*o+y];s[(i*a+c)*o+y]=h*(1-g)*(1-b)+x*g*(1-b)+S*(1-g)*b+w*g*b}}return s}const oe=new hr;function ie(e){return F().device.createBindGroupLayout({entries:Array.from({length:e},(r,a)=>({binding:a,visibility:GPUShaderStage.COMPUTE,buffer:a===0?{type:"uniform"}:{type:"storage"}}))})}function _e(e){const t=F(),r=t.device.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.device.queue.writeBuffer(r,0,e),r}function ye(e,t,r,a,n,o){const s=F(),i=_e(n),c=[{binding:0,resource:{buffer:i}},...a.map((d,f)=>({binding:f+1,resource:{buffer:d.buffer.gpuBuffer}}))],u=s.device.createBindGroup({layout:r,entries:c}),l=e.beginComputePass();return l.setPipeline(t),l.setBindGroup(0,u),l.dispatchWorkgroups(o),l.end(),i}async function ve(e,t,r,a,n){const o=F(),s=A.zeros([r,a]),i=ie(4),c=oe.getOrCreate("matmul",wr,i),u=new ArrayBuffer(12),l=new Uint32Array(u);l[0]=r,l[1]=a,l[2]=n;const d=o.device.createCommandEncoder();return ye(d,c,i,[e,t,s],u,Math.ceil(r/16)*Math.ceil(a/16)),o.device.queue.submit([d.finish()]),s}function he(e,t,r,a,n){return Tr(e,t,r,a,n)}async function it(e,t){const r=F(),a=A.zeros([e.shape.size]),n=ie(4),o=oe.getOrCreate("add",xr,n),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=r.device.createCommandEncoder();return ye(i,o,n,[e,t,a],s,Math.ceil(e.shape.size/256)),r.device.queue.submit([i.finish()]),a}function ut(e,t){return Er(e,t)}async function ct(e,t){const r=F(),a=A.zeros([e.shape.size]),n=ie(4),o=oe.getOrCreate("multiply",Sr,n),s=new ArrayBuffer(4);new Uint32Array(s)[0]=e.shape.size;const i=r.device.createCommandEncoder();return ye(i,o,n,[e,t,a],s,Math.ceil(e.shape.size/256)),r.device.queue.submit([i.finish()]),a}function lt(e,t){return kr(e,t)}async function dt(e,t,r=1e-6){const a=F(),n=e.shape.size,o=A.zeros([n]),s=ie(4),i=oe.getOrCreate("rms_norm",Mr,s),c=new ArrayBuffer(8);new Uint32Array(c)[0]=n,new Float32Array(c)[1]=r;const u=a.device.createCommandEncoder();return ye(u,i,s,[e,t,o],c,1),a.device.queue.submit([u.finish()]),o}function ft(e,t,r=1e-6){return Nr(e,t,r)}async function pt(e,t,r,a=1e-6){const n=F(),o=e.shape.size,s=A.zeros([o]),i=n.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=oe.getOrCreate("layer_norm",Br,i),u=new ArrayBuffer(8);new Uint32Array(u)[0]=o,new Float32Array(u)[1]=a;const l=F(),d=_e(u),f=l.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:e.buffer.gpuBuffer}},{binding:2,resource:{buffer:t.buffer.gpuBuffer}},{binding:3,resource:{buffer:r.buffer.gpuBuffer}},{binding:4,resource:{buffer:s.buffer.gpuBuffer}}]}),p=l.device.createCommandEncoder(),m=p.beginComputePass();return m.setPipeline(c),m.setBindGroup(0,f),m.dispatchWorkgroups(1),m.end(),l.device.queue.submit([p.finish()]),s}function mt(e,t,r,a=1e-6){return Gr(e,t,r,a)}async function gt(e,t,r){const a=F(),n=A.zeros([t,r]),o=a.device.createCommandEncoder();o.copyBufferToBuffer(e.buffer.gpuBuffer,0,n.buffer.gpuBuffer,0,t*r*4);const s=ie(2),i=oe.getOrCreate("softmax",Ar,s),c=new ArrayBuffer(8);new Uint32Array(c)[0]=t,new Uint32Array(c)[1]=r;const u=_e(c),l=a.device.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:n.buffer.gpuBuffer}}]}),d=o.beginComputePass();return d.setPipeline(i),d.setBindGroup(0,l),d.dispatchWorkgroups(Math.ceil(t)),d.end(),a.device.queue.submit([o.finish()]),n}function bt(e,t,r){return Or(e,t,r)}async function yt(e,t,r,a=1e4){const n=F(),o=A.zeros([t,r]),s=n.device.createCommandEncoder();s.copyBufferToBuffer(e.buffer.gpuBuffer,0,o.buffer.gpuBuffer,0,t*r*4);const i=ie(2),c=oe.getOrCreate("rope",Cr,i),u=new ArrayBuffer(12);new Uint32Array(u)[0]=t,new Uint32Array(u)[1]=r,new Float32Array(u)[2]=a;const l=_e(u),d=n.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:o.buffer.gpuBuffer}}]}),f=s.beginComputePass();return f.setPipeline(c),f.setBindGroup(0,d),f.dispatchWorkgroups(Math.ceil(t*r/2/256)),f.end(),n.device.queue.submit([s.finish()]),o}function vt(e,t,r,a=1e4){return Dr(e,t,r,a)}async function ht(e,t,r,a,n,o,s,i,c){const u=F(),l=n-i+1,d=o-c+1,f=A.zeros([r,s,l,d]),p=ie(4),m=oe.getOrCreate("conv2d",Pr,p),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=r,b[1]=a,b[2]=n,b[3]=o,b[4]=s,b[5]=i,b[6]=c,b[7]=l,b[8]=d;const y=u.device.createCommandEncoder();return ye(y,m,p,[e,t,f],g,r*s),u.device.queue.submit([y.finish()]),f}function wt(e,t,r,a,n,o,s,i,c){return Fr(e,t,r,a,n,o,s,i,c)}async function xt(e,t,r){const a=F(),n=A.zeros([r,t]),o=ie(3),s=oe.getOrCreate("transpose_2d",Ur,o),i=new ArrayBuffer(8);new Uint32Array(i)[0]=t,new Uint32Array(i)[1]=r;const c=a.device.createCommandEncoder();return ye(c,s,o,[e,n],i,Math.ceil(t/16)*Math.ceil(r/16)),a.device.queue.submit([c.finish()]),n}function St(e,t,r){return _r(e,t,r)}async function Mt(e,t,r,a,n,o){const s=F(),i=A.zeros([n*a*o]),c=ie(3),u=oe.getOrCreate("interpolate_bilinear",$r,c),l=new ArrayBuffer(20),d=new Uint32Array(l);d[0]=t,d[1]=r,d[2]=a,d[3]=n,d[4]=o;const f=s.device.createCommandEncoder();return ye(f,u,c,[e,i],l,Math.ceil(a/16)*Math.ceil(n/16)),s.device.queue.submit([f.finish()]),i}function Bt(e,t,r,a,n,o){return Wr(e,t,r,a,n,o)}let Se=null,De=null;function J(e,t=""){if(!Se)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Se.appendChild(r),Se.scrollTop=Se.scrollHeight}function V(e,t,r=.001){if(e.length!==t.length)return!1;for(let a=0;a<e.length;a++){const n=Math.abs(e[a]-t[a]),o=Math.max(Math.abs(e[a]),Math.abs(t[a]),1e-8);if(n/o>r)return!1}return!0}async function Y(e,t,r=20){for(let n=0;n<3;n++)t();const a=[];for(let n=0;n<r;n++){const o=performance.now();t(),a.push(performance.now()-o)}return a.reduce((n,o)=>n+o,0)/a.length}async function X(e,t,r=20){const a=[];for(let n=0;n<Math.min(5,r);n++)await t();for(let n=0;n<r;n++){const o=performance.now();await t(),a.push(performance.now()-o)}return a.reduce((n,o)=>n+o,0)/a.length}function zr(e){if(!De)return;const t=document.createElement("tr");t.innerHTML=`
    <td style="font-weight:600">${e.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${e.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${e.speedup>=1?"var(--green)":"var(--red)"}">
      ${e.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${e.correct?"badge-pass":"badge-fail"}">${e.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${e.tolerance.toExponential(1)}</td>
  `,De.appendChild(t)}async function qr(){Se.innerHTML="",De.innerHTML="",J("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),J("Initializing WebGPU...","");let e;try{e=await yr()}catch(a){J(`FATAL: ${a.message}`,"err"),J("WebGPU is not available. Cannot run GPU benchmarks.","err");return}J(`GPU: ${e.adapter.name??"Unknown"}`,"ok"),J(`Running benchmarks...
`,"");const t=[];{const s=A.randn([64,64]),i=A.randn([64,64]),c=await s.readback(),u=await i.readback(),l=await Y("matmul 64",()=>he(c,u,64,64,64)),d=await X("matmul 64",async()=>{(await ve(s,i,64,64,64)).destroy()}),f=await(await ve(s,i,64,64,64)).readback(),p=he(c,u,64,64,64),m=V(p,f),g=Math.max(...Array.from(p).map((b,y)=>Math.abs(b-f[y])));t.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:g}),s.destroy(),i.destroy()}{const s=A.randn([256,256]),i=A.randn([256,256]),c=await s.readback(),u=await i.readback(),l=await Y("matmul 256",()=>he(c,u,256,256,256),10),d=await X("matmul 256",async()=>{(await ve(s,i,256,256,256)).destroy()}),f=await(await ve(s,i,256,256,256)).readback(),p=he(c,u,256,256,256),m=V(p,f),g=Math.max(...Array.from(p).map((b,y)=>Math.abs(b-f[y])));t.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:g}),s.destroy(),i.destroy()}{const s=A.randn([512,512]),i=A.randn([512,512]),c=await s.readback(),u=await i.readback(),l=await Y("matmul 512",()=>he(c,u,512,512,512),5),d=await X("matmul 512",async()=>{(await ve(s,i,512,512,512)).destroy()}),f=await(await ve(s,i,512,512,512)).readback(),p=he(c,u,512,512,512),m=V(p,f),g=Math.max(...Array.from(p).map((b,y)=>Math.abs(b-f[y])));t.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:g}),s.destroy(),i.destroy()}{const n=A.randn([1e6]),o=A.randn([1e6]),s=await n.readback(),i=await o.readback(),c=await Y("add 1M",()=>ut(s,i)),u=await X("add 1M",async()=>{(await it(n,o)).destroy()}),l=await(await it(n,o)).readback(),d=ut(s,i),f=V(d,l),p=Math.max(...Array.from(d).map((m,g)=>Math.abs(m-l[g])));t.push({name:"Add",shape:"[1000000]",cpuMs:c,gpuMs:u,speedup:c/u,correct:f,tolerance:p}),n.destroy(),o.destroy()}{const n=A.randn([1e6]),o=A.randn([1e6]),s=await n.readback(),i=await o.readback(),c=await Y("mul 1M",()=>lt(s,i)),u=await X("mul 1M",async()=>{(await ct(n,o)).destroy()}),l=await(await ct(n,o)).readback(),d=lt(s,i),f=V(d,l),p=Math.max(...Array.from(d).map((m,g)=>Math.abs(m-l[g])));t.push({name:"Multiply",shape:"[1000000]",cpuMs:c,gpuMs:u,speedup:c/u,correct:f,tolerance:p}),n.destroy(),o.destroy()}{const n=A.randn([1024]),o=A.ones([1024]),s=await n.readback(),i=await o.readback(),c=await Y("rmsnorm",()=>ft(s,i)),u=await X("rmsnorm",async()=>{(await dt(n,o)).destroy()}),l=await(await dt(n,o)).readback(),d=ft(s,i),f=V(d,l),p=Math.max(...Array.from(d).map((m,g)=>Math.abs(m-l[g])));t.push({name:"RMSNorm",shape:"[1024]",cpuMs:c,gpuMs:u,speedup:c/u,correct:f,tolerance:p}),n.destroy(),o.destroy()}{const n=A.randn([1024]),o=A.ones([1024]),s=A.zeros([1024]),i=await n.readback(),c=await o.readback(),u=await s.readback(),l=await Y("layernorm",()=>mt(i,c,u)),d=await X("layernorm",async()=>{(await pt(n,o,s)).destroy()}),f=await(await pt(n,o,s)).readback(),p=mt(i,c,u),m=V(p,f),g=Math.max(...Array.from(p).map((b,y)=>Math.abs(b-f[y])));t.push({name:"LayerNorm",shape:"[1024]",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:g}),n.destroy(),o.destroy(),s.destroy()}{const o=A.randn([32,128]),s=await o.readback(),i=await Y("softmax",()=>bt(new Float32Array(s),32,128)),c=await X("softmax",async()=>{(await gt(A.fromFloat32(new Float32Array(s),[32,128]),32,128)).destroy()}),u=await(await gt(A.fromFloat32(new Float32Array(s),[32,128]),32,128)).readback(),l=bt(new Float32Array(s),32,128),d=V(l,u),f=Math.max(...Array.from(l).map((p,m)=>Math.abs(p-u[m])));t.push({name:"Softmax",shape:"[32, 128]",cpuMs:i,gpuMs:c,speedup:i/c,correct:d,tolerance:f}),o.destroy()}{const o=A.randn([16,128]),s=await o.readback(),i=await Y("rope",()=>vt(new Float32Array(s),16,128)),c=await X("rope",async()=>{(await yt(A.fromFloat32(new Float32Array(s),[16,128]),16,128)).destroy()}),u=await(await yt(A.fromFloat32(new Float32Array(s),[16,128]),16,128)).readback(),l=vt(new Float32Array(s),16,128),d=V(l,u),f=Math.max(...Array.from(l).map((p,m)=>Math.abs(p-u[m])));t.push({name:"RoPE",shape:"[16, 128]",cpuMs:i,gpuMs:c,speedup:i/c,correct:d,tolerance:f}),o.destroy()}{const l=A.randn([1,3,16,16]),d=A.randn([4,3,3,3]),f=await l.readback(),p=await d.readback(),m=await Y("conv2d",()=>wt(f,p,1,3,16,16,4,3,3)),g=await X("conv2d",async()=>{(await ht(l,d,1,3,16,16,4,3,3)).destroy()}),b=await(await ht(l,d,1,3,16,16,4,3,3)).readback(),y=wt(f,p,1,3,16,16,4,3,3),h=V(y,b),x=Math.max(...Array.from(y).map((S,w)=>Math.abs(S-b[w])));t.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:m,gpuMs:g,speedup:m/g,correct:h,tolerance:x}),l.destroy(),d.destroy()}{const o=A.randn([256,256]),s=await o.readback(),i=await Y("transpose",()=>St(s,256,256)),c=await X("transpose",async()=>{(await xt(o,256,256)).destroy()}),u=await(await xt(o,256,256)).readback(),l=St(s,256,256),d=V(l,u),f=Math.max(...Array.from(l).map((p,m)=>Math.abs(p-u[m])));t.push({name:"Transpose",shape:"[256, 256]",cpuMs:i,gpuMs:c,speedup:i/c,correct:d,tolerance:f}),o.destroy()}{const c=A.randn([3072]),u=await c.readback(),l=await Y("interp",()=>Bt(u,32,32,64,64,3)),d=await X("interp",async()=>{(await Mt(c,32,32,64,64,3)).destroy()}),f=await(await Mt(c,32,32,64,64,3)).readback(),p=Bt(u,32,32,64,64,3),m=V(p,f),g=Math.max(...Array.from(p).map((b,y)=>Math.abs(b-f[y])));t.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:l,gpuMs:d,speedup:l/d,correct:m,tolerance:g}),c.destroy()}J("",""),J("═══ RESULTS ═══","info");for(const a of t){zr(a);const n=a.correct?"✓":"✗",o=a.correct?"ok":"err";J(`${n} ${a.name} (${a.shape}): CPU ${a.cpuMs.toFixed(2)} ms | GPU ${a.gpuMs.toFixed(2)} ms | ${a.speedup.toFixed(1)}× | max diff ${a.tolerance.toExponential(1)}`,o)}const r=t.filter(a=>a.correct).length;J("",""),J(`═══ ${r}/${t.length} CORRECT ═══`,r===t.length?"ok":"err"),vr()}function Lr(e){e.innerHTML=`
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
  `,Se=e.querySelector("#bench-log"),De=e.querySelector("#bench-tbody"),e.querySelector("#btn-run-bench").addEventListener("click",()=>{qr()})}const Rr=Object.freeze(Object.defineProperty({__proto__:null,render:Lr},Symbol.toStringTag,{value:"Module"}));let ue=null,Ee="";function Hr(e){const t=e.environment,r=e.gpu,a=e.case==="D"?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)";let n=`
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
  `,n}function Ir(e){e.innerHTML=`
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;const t=e.querySelector("#wgdiag-result");ue=e.querySelector("#btn-copy-report"),e.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{t.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',ue.disabled=!0;const r=await Fe();Ee=Ct(r),t.innerHTML=Hr(r),ue.disabled=!1}),ue.addEventListener("click",async()=>{if(Ee)try{await navigator.clipboard.writeText(Ee),ue.textContent="Copied!",setTimeout(()=>{ue.textContent="Copy Diagnostics"},2e3)}catch{const r=document.createElement("textarea");r.value=Ee,document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),ue.textContent="Copied!",setTimeout(()=>{ue.textContent="Copy Diagnostics"},2e3)}}),e.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const jr=Object.freeze(Object.defineProperty({__proto__:null,render:Ir},Symbol.toStringTag,{value:"Module"}));let $e=null,ge=null;async function Me(){if(ge&&!$e&&(ge=null),ge)return ge;if(!navigator.gpu)throw new Error("WebGPU not supported");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.features.has("timestamp-query"),r=await e.requestDevice({requiredFeatures:t?["timestamp-query"]:[],requiredLimits:{}});r.lost.then(s=>{console.error("Benchmark device lost:",s.message),$e=null,ge=null}),$e=r;let a=null;try{a=navigator.gpu.getPreferredCanvasFormat()}catch{}const n=e.limits,o=[];for(const s of e.features)o.push(s);return ge={webgpuAvailable:!0,adapterName:e.name??"Unknown",adapterVendor:e.vendor??"Unknown",adapterDevice:e.device??"Unknown",adapterFeatures:o,adapterLimits:{maxBufferSize:n.maxBufferSize,maxTextureDimension1D:n.maxTextureDimension1D,maxTextureDimension2D:n.maxTextureDimension2D,maxTextureDimension3D:n.maxTextureDimension3D,maxComputeWorkgroupStorageSize:n.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:n.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:n.maxStorageBufferBindingSize,maxUniformBufferBindingSize:n.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:n.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:n.maxComputeWorkgroupsPerDimension,maxColorAttachments:n.maxColorAttachments,minStorageBufferOffsetAlignment:n.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:n.minUniformBufferOffsetAlignment},preferredCanvasFormat:a,maxBufferSize:n.maxBufferSize,maxStorageBufferBindingSize:n.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:n.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:n.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:n.maxComputeWorkgroupsPerDimension,timestampQuerySupport:t,isFallbackAdapter:e.isFallbackAdapter??!1},ge}function E(){if(!$e)throw new Error("Benchmark not initialized. Call initBenchmark() first.");return $e}function I(e){const t=E(),r=t.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(r,0,e),r}function T(e,t){const r=E(),a=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(t){const n=r.createBuffer({size:Math.max(e,t.byteLength),usage:a,mappedAtCreation:!0});return new Float32Array(n.getMappedRange()).set(t),n.unmap(),n}return r.createBuffer({size:e,usage:a})}function Kr(e){return E().createBuffer({size:e,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})}async function H(e,t){const r=E(),a=Kr(t),n=r.createCommandEncoder();n.copyBufferToBuffer(e,0,a,0,t),r.queue.submit([n.finish()]),await a.mapAsync(GPUMapMode.READ);const o=new Float32Array(a.getMappedRange().slice(0));return a.unmap(),a.destroy(),o}function j(e,t){const r=E(),a=r.createBindGroupLayout({entries:Array.from({length:t},(n,o)=>({binding:o,visibility:GPUShaderStage.COMPUTE,buffer:o===0?{type:"uniform"}:{type:"storage"}}))});return r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:r.createShaderModule({code:e}),entryPoint:"main"}})}async function Ce(e,t=50,r=5){const a=E();for(let i=0;i<Math.min(r,3);i++)e();const n=[];for(let i=0;i<t;i++){const c=performance.now();e();try{await a.queue.onSubmittedWorkDone()}catch{await new Promise(l=>setTimeout(l,50))}const u=performance.now();n.push(u-c)}n.sort((i,c)=>i-c);const o=n.reduce((i,c)=>i+c,0)/n.length,s=n[Math.floor(n.length/2)];return{avgMs:o,minMs:n[0],maxMs:n[n.length-1],p50Ms:s,iterations:t}}function R(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}const Et=`
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
`,Ke=`
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
`,kt=`
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
`,Gt=`
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
`,Vr=[1024,65536,1048576,8388608];async function Dt(){const e=E(),t=[],r=j(Et,4),a=r.getBindGroupLayout(0);for(const n of Vr){const o=n*4;try{const s=new Float32Array(n).fill(1),i=new Float32Array(n).fill(2),c=T(o,s),u=T(o,i),l=T(o),d=new ArrayBuffer(4);new Uint32Array(d)[0]=n;const f=I(d),p=e.createBindGroup({layout:a,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:u}},{binding:3,resource:{buffer:l}}]}),m=Math.ceil(n/256),g=await Ce(()=>{const x=e.createCommandEncoder(),S=x.beginComputePass();S.setPipeline(r),S.setBindGroup(0,p),S.dispatchWorkgroups(m),S.end(),e.queue.submit([x.finish()])},n>1e6?20:50),y=(await H(l,o)).every(x=>Math.abs(x-3)<1e-5),h=n/(g.avgMs/1e3);t.push({id:`vecadd_${n}`,name:"Vector Addition",inputSize:`${n} elements (${R(o)})`,executionTimeMs:g.avgMs,throughput:`${(h/1e6).toFixed(1)} M elements/s`,memoryBytes:o*3,success:y,gpuTimingAvailable:!0,details:{iterations:g.iterations,minMs:g.minMs,maxMs:g.maxMs,p50Ms:g.p50Ms,elementsPerSecond:h,correctness:y?"PASS":"FAIL"}}),c.destroy(),u.destroy(),l.destroy(),f.destroy()}catch(s){t.push({id:`vecadd_${n}`,name:"Vector Addition",inputSize:`${n} elements (${R(o)})`,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}return t}const Yr=[128,256,512];function Xr(e,t,r,a,n){const o=new Float32Array(r*a);for(let s=0;s<r;s++)for(let i=0;i<a;i++){let c=0;for(let u=0;u<n;u++)c+=e[s*n+u]*t[u*a+i];o[s*a+i]=c}return o}async function Ft(){const e=E(),t=[],r=j(Ke,4),a=r.getBindGroupLayout(0);for(const n of Yr)try{const o=n,s=n,c=(o*s+s*n+o*n)*4,u=new Float32Array(o*s).fill(1),l=new Float32Array(s*n).fill(.5),d=T(o*s*4,u),f=T(s*n*4,l),p=T(o*n*4),m=new ArrayBuffer(12),g=new Uint32Array(m);g[0]=o,g[1]=n,g[2]=s;const b=I(m),y=e.createBindGroup({layout:a,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}}]}),h=Math.ceil(o/16),x=Math.ceil(n/16),S=await Ce(()=>{const C=e.createCommandEncoder(),O=C.beginComputePass();O.setPipeline(r),O.setBindGroup(0,y),O.dispatchWorkgroups(h,x),O.end(),e.queue.submit([C.finish()])},n<=256?50:20);let w=!0;if(n<=256){const C=await H(p,o*n*4),O=Xr(u,l,o,n,s);for(let U=0;U<o*n;U++)if(Math.abs(C[U]-O[U])>.001){w=!1;break}}const B=2*o*n*s,k=B/(S.avgMs/1e3)/1e9;t.push({id:`matmul_${n}`,name:"Matrix Multiplication",inputSize:`${n}×${n}`,executionTimeMs:S.avgMs,throughput:`${k.toFixed(2)} GFLOPS`,memoryBytes:c,success:w,gpuTimingAvailable:!0,details:{M:o,N:n,K:s,flops:B,gflops:k,iterations:S.iterations,minMs:S.minMs,maxMs:S.maxMs,p50Ms:S.p50Ms,correctness:n<=256?w?"PASS":"FAIL":"NOT_TESTED (>256)"}}),d.destroy(),f.destroy(),p.destroy(),b.destroy()}catch(o){t.push({id:`matmul_${n}`,name:"Matrix Multiplication",inputSize:`${n}×${n}`,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:o.message,gpuTimingAvailable:!1})}return t}const Qr=[{name:"1×3×32×32, 8×3×3×3",N:1,C:3,H:32,W:32,F:8,FH:3,FW:3},{name:"1×3×64×64, 16×3×5×5",N:1,C:3,H:64,W:64,F:16,FH:5,FW:5},{name:"1×16×64×64, 32×16×3×3",N:1,C:16,H:64,W:64,F:32,FH:3,FW:3},{name:"1×32×128×128, 64×32×3×3",N:1,C:32,H:128,W:128,F:64,FH:3,FW:3}];async function Zr(){const e=E(),t=[],r=j(kt,4),a=r.getBindGroupLayout(0);for(const n of Qr)try{const{N:o,C:s,H:i,W:c,F:u,FH:l,FW:d}=n,f=i-l+1,p=c-d+1,m=o*s*i*c,g=u*s*l*d,b=o*u*f*p,y=new Float32Array(m).fill(.5),h=new Float32Array(g).fill(.1),x=T(m*4,y),S=T(g*4,h),w=T(b*4),B=new ArrayBuffer(36),k=new Uint32Array(B);k[0]=o,k[1]=s,k[2]=i,k[3]=c,k[4]=u,k[5]=l,k[6]=d,k[7]=f,k[8]=p;const C=I(B),O=e.createBindGroup({layout:a,entries:[{binding:0,resource:{buffer:C}},{binding:1,resource:{buffer:x}},{binding:2,resource:{buffer:S}},{binding:3,resource:{buffer:w}}]}),U=await Ce(()=>{const z=e.createCommandEncoder(),L=z.beginComputePass();L.setPipeline(r),L.setBindGroup(0,O),L.dispatchWorkgroups(o,u),L.end(),e.queue.submit([z.finish()])},30),K=o*u*s*l*d*f*p*2,Z=K/(U.avgMs/1e3)/1e9;t.push({id:`conv2d_${n.name}`,name:"Convolution 2D",inputSize:n.name,executionTimeMs:U.avgMs,throughput:`${Z.toFixed(2)} GFLOPS`,memoryBytes:(m+g+b)*4,success:!0,gpuTimingAvailable:!0,details:{inputShape:`${o}×${s}×${i}×${c}`,kernelShape:`${u}×${s}×${l}×${d}`,outputShape:`${o}×${u}×${f}×${p}`,flops:K,gflops:Z,iterations:U.iterations,minMs:U.minMs,maxMs:U.maxMs,p50Ms:U.p50Ms}}),x.destroy(),S.destroy(),w.destroy(),C.destroy()}catch(o){t.push({id:`conv2d_${n.name}`,name:"Convolution 2D",inputSize:n.name,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:o.message,gpuTimingAvailable:!1})}return t}function Jr(e,t,r){const a=new Float32Array(e.length);for(let n=0;n<t;n++){const o=n*r;let s=-1e30;for(let c=0;c<r;c++)e[o+c]>s&&(s=e[o+c]);let i=0;for(let c=0;c<r;c++){const u=Math.exp(e[o+c]-s);a[o+c]=u,i+=u}for(let c=0;c<r;c++)a[o+c]/=i}return a}const en=[{rows:1,cols:1024,name:"1×1024"},{rows:32,cols:1024,name:"32×1024"},{rows:128,cols:1024,name:"128×1024"},{rows:256,cols:1024,name:"256×1024"}];async function _t(){const e=E(),t=[],r=j(Nt,2),a=r.getBindGroupLayout(0);for(const n of en)try{const o=n.rows*n.cols,s=o*4,i=new Float32Array(o);for(let y=0;y<o;y++)i[y]=(Math.random()-.5)*10;const c=T(s,i),u=new ArrayBuffer(8);new Uint32Array(u)[0]=n.rows,new Uint32Array(u)[1]=n.cols;const l=I(u),d=e.createBindGroup({layout:a,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:c}}]}),f=await Ce(()=>{const y=e.createCommandEncoder(),h=y.beginComputePass();h.setPipeline(r),h.setBindGroup(0,d),h.dispatchWorkgroups(n.rows),h.end(),e.queue.submit([y.finish()])},50),p=await H(c,s),m=Jr(i,n.rows,n.cols);let g=0;for(let y=0;y<o;y++)g=Math.max(g,Math.abs(p[y]-m[y]));const b=g<1e-4;t.push({id:`softmax_${n.name}`,name:"Softmax",inputSize:n.name,executionTimeMs:f.avgMs,throughput:`${(o/(f.avgMs/1e3)/1e6).toFixed(1)} M elements/s`,memoryBytes:s,success:b,gpuTimingAvailable:!0,details:{rows:n.rows,cols:n.cols,maxError:g,iterations:f.iterations,minMs:f.minMs,maxMs:f.maxMs,p50Ms:f.p50Ms,correctness:b?"PASS":"FAIL"}}),c.destroy(),l.destroy()}catch(o){t.push({id:`softmax_${n.name}`,name:"Softmax",inputSize:n.name,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:o.message,gpuTimingAvailable:!1})}return t}function tn(e,t,r){const a=e.length;let n=0;for(let i=0;i<a;i++)n+=e[i]*e[i];const o=Math.sqrt(n/a+r),s=new Float32Array(a);for(let i=0;i<a;i++)s[i]=e[i]/o*t[i];return s}const rn=[{N:64,name:"N=64"},{N:256,name:"N=256"},{N:1024,name:"N=1024"},{N:4096,name:"N=4096 (typical LLM hidden)"},{N:8192,name:"N=8192 (large hidden)"}];async function Wt(){const e=E(),t=[],r=j(Gt,4),a=r.getBindGroupLayout(0);for(const n of rn)try{const o=n.N,s=1e-6,i=new Float32Array(o),c=new Float32Array(o);for(let S=0;S<o;S++)i[S]=(Math.random()-.5)*2,c[S]=1;const u=T(o*4,i),l=T(o*4,c),d=T(o*4),f=new ArrayBuffer(8);new Uint32Array(f)[0]=o,new Float32Array(f)[1]=s;const p=I(f),m=e.createBindGroup({layout:a,entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:d}}]}),g=await Ce(()=>{const S=e.createCommandEncoder(),w=S.beginComputePass();w.setPipeline(r),w.setBindGroup(0,m),w.dispatchWorkgroups(1),w.end(),e.queue.submit([S.finish()])},100),b=await H(d,o*4),y=tn(i,c,s);let h=0;for(let S=0;S<o;S++)h=Math.max(h,Math.abs(b[S]-y[S]));const x=h<.001;t.push({id:`rmsnorm_${n.name}`,name:"RMSNorm",inputSize:n.name,executionTimeMs:g.avgMs,throughput:`${(o/(g.avgMs/1e3)/1e6).toFixed(1)} M elements/s`,memoryBytes:o*4*3,success:x,gpuTimingAvailable:!0,details:{N:o,eps:s,maxError:h,iterations:g.iterations,minMs:g.minMs,maxMs:g.maxMs,p50Ms:g.p50Ms,correctness:x?"PASS":"FAIL"}}),u.destroy(),l.destroy(),d.destroy(),p.destroy()}catch(o){t.push({id:`rmsnorm_${n.name}`,name:"RMSNorm",inputSize:n.name,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:o.message,gpuTimingAvailable:!1})}return t}const nn=[{batch:1,seq:128,dim:64,name:"seq=128 dim=64"},{batch:1,seq:256,dim:64,name:"seq=256 dim=64"},{batch:1,seq:512,dim:64,name:"seq=512 dim=64"},{batch:1,seq:128,dim:128,name:"seq=128 dim=128"},{batch:1,seq:256,dim:128,name:"seq=256 dim=128"},{batch:1,seq:512,dim:128,name:"seq=512 dim=128"}];async function an(){const e=E(),t=[],r=j(Ot,6),a=r.getBindGroupLayout(0);for(const n of nn)try{const{batch:o,seq:s,dim:i}=n,c=1/Math.sqrt(i),u=o*s*i,l=o*s*s,d=new Float32Array(u).fill(.1),f=new Float32Array(u).fill(.1),p=new Float32Array(u).fill(.1),m=T(u*4,d),g=T(u*4,f),b=T(u*4,p),y=T(u*4),h=T(l*4),x=new ArrayBuffer(16),S=new Uint32Array(x),w=new Float32Array(x);S[0]=o,S[1]=s,S[2]=i,w[3]=c;const B=I(x),k=e.createBindGroup({layout:a,entries:[{binding:0,resource:{buffer:B}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:g}},{binding:3,resource:{buffer:b}},{binding:4,resource:{buffer:y}},{binding:5,resource:{buffer:h}}]}),C=await Ce(()=>{const z=e.createCommandEncoder(),L=z.beginComputePass();L.setPipeline(r),L.setBindGroup(0,k),L.dispatchWorkgroups(o),L.end(),e.queue.submit([z.finish()])},s<=256?30:10),O=await H(y,u*4);let U=!0;for(let z=0;z<u;z++)if(!isFinite(O[z])){U=!1;break}const K=2*o*s*s*i+2*o*s*s+2*o*s*s*i,Z=K/(C.avgMs/1e3)/1e9;t.push({id:`attention_${n.name}`,name:"Attention",inputSize:n.name,executionTimeMs:C.avgMs,throughput:`${Z.toFixed(2)} GFLOPS`,memoryBytes:(u*3+u+l)*4,success:U,gpuTimingAvailable:!0,details:{batch:o,seq:s,dim:i,scale:c,qkvBytes:u*4,scoresBytes:l*4,flops:K,gflops:Z,iterations:C.iterations,minMs:C.minMs,maxMs:C.maxMs,p50Ms:C.p50Ms,outputFinite:U?"YES":"NO"}}),m.destroy(),g.destroy(),b.destroy(),y.destroy(),h.destroy(),B.destroy()}catch(o){t.push({id:`attention_${n.name}`,name:"Attention",inputSize:n.name,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:o.message,gpuTimingAvailable:!1})}return t}async function on(e){const t=E(),r=[],a=e.maxBufferSize;{let n=0,o=Math.min(a,256*1024*1024);try{for(;o<=a;){const s=t.createBuffer({size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});if(n=o,s.destroy(),o>=a)break;o=Math.min(o*2,a)}}catch{}r.push({id:"mem_max_buffer",name:"Max Buffer Size",inputSize:`limit=${R(a)}`,executionTimeMs:0,throughput:`accepted=${R(n)}`,memoryBytes:n,success:n>0,gpuTimingAvailable:!1,details:{maxBufferSizeLimit:a,maxBufferAccepted:n,match:n===a?"EXACT":"PARTIAL"}})}{const n=[1048576,16777216,67108864,134217728].filter(o=>o<=a);for(const o of n)try{const i=[];for(let u=0;u<20;u++){const l=performance.now(),d=t.createBuffer({size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});i.push(performance.now()-l),d.destroy()}const c=i.reduce((u,l)=>u+l,0)/i.length;r.push({id:`mem_alloc_${o}`,name:"Allocation Time",inputSize:R(o),executionTimeMs:c,throughput:`${(o/(c/1e3)/1048576).toFixed(1)} MB/s`,memoryBytes:o,success:!0,gpuTimingAvailable:!1,details:{avgMs:c,iterations:20}})}catch(s){r.push({id:`mem_alloc_${o}`,name:"Allocation Time",inputSize:R(o),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}{const n=[1048576,16777216,67108864].filter(o=>o<=a);for(const o of n)try{const s=o/4,i=new Float32Array(s).fill(3.14),c=ke(o),u=20,l=[];for(let f=0;f<u;f++){const p=performance.now();t.queue.writeBuffer(c,0,i.buffer),await t.queue.onSubmittedWorkDone(),l.push(performance.now()-p)}const d=l.reduce((f,p)=>f+p,0)/l.length;r.push({id:`mem_upload_${o}`,name:"Upload Time",inputSize:R(o),executionTimeMs:d,throughput:`${(o/(d/1e3)/1048576).toFixed(1)} MB/s`,memoryBytes:o,success:!0,gpuTimingAvailable:!1,details:{avgMs:d,iterations:u,method:"queue.writeBuffer"}}),c.destroy()}catch(s){r.push({id:`mem_upload_${o}`,name:"Upload Time",inputSize:R(o),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}{const n=[1048576,16777216,67108864].filter(o=>o<=a);for(const o of n)try{const s=ke(o),i=10,c=[];for(let l=0;l<i;l++){const d=performance.now();await H(s,o),c.push(performance.now()-d)}const u=c.reduce((l,d)=>l+d,0)/c.length;r.push({id:`mem_readback_${o}`,name:"Readback Time",inputSize:R(o),executionTimeMs:u,throughput:`${(o/(u/1e3)/1048576).toFixed(1)} MB/s`,memoryBytes:o,success:!0,gpuTimingAvailable:!1,details:{avgMs:u,iterations:i,method:"copyBufferToBuffer + mapAsync"}}),s.destroy()}catch(s){r.push({id:`mem_readback_${o}`,name:"Readback Time",inputSize:R(o),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:s.message,gpuTimingAvailable:!1})}}{const n=Math.min(16777216,a);try{const s=ke(n),i=new Float32Array(n/4).fill(1),c=[];for(let f=0;f<50;f++){const p=performance.now();t.queue.writeBuffer(s,0,i.buffer),c.push(performance.now()-p)}const u=[];for(let f=0;f<50;f++){const p=performance.now(),m=t.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(m,0,i.buffer),m.destroy(),u.push(performance.now()-p)}const l=c.reduce((f,p)=>f+p,0)/c.length,d=u.reduce((f,p)=>f+p,0)/u.length;r.push({id:"mem_reuse_vs_realloc",name:"Buffer Reuse vs Re-alloc",inputSize:R(n),executionTimeMs:l,throughput:`reuse=${l.toFixed(3)}ms re-alloc=${d.toFixed(3)}ms`,memoryBytes:n,success:!0,gpuTimingAvailable:!1,details:{reuseAvgMs:l,reallocAvgMs:d,speedup:(d/l).toFixed(1)+"x",iterations:50}}),s.destroy()}catch(o){r.push({id:"mem_reuse_vs_realloc",name:"Buffer Reuse vs Re-alloc",inputSize:R(n),executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:o.message,gpuTimingAvailable:!1})}}{let n=0;const o=[64*1024*1024,128*1024*1024,256*1024*1024].filter(s=>s<=a);for(const s of o)try{const i=ke(s),c=new Float32Array(Math.min(s/4,1024)).fill(42);t.queue.writeBuffer(i,0,c.buffer),await t.queue.onSubmittedWorkDone(),n=s,i.destroy()}catch{break}r.push({id:"mem_useful_working_set",name:"Useful Working Set",inputSize:`tested up to ${R(a)}`,executionTimeMs:0,throughput:`confirmed=${R(n)}`,memoryBytes:n,success:n>0,gpuTimingAvailable:!1,details:{maxBufferSize:a,usefulWorkingSet:n}})}return r}function ke(e,t){const r=E(),a=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;return r.createBuffer({size:e,usage:a})}const ze=[30,60,180];async function sn(e){const t=E(),r=[],a=256,n=a,o=a,s=2*n*a*o,i=j(Ke,4),c=i.getBindGroupLayout(0),u=new Float32Array(n*o).fill(1),l=new Float32Array(o*a).fill(.5),d=T(n*o*4,u),f=T(o*a*4,l),p=T(n*a*4),m=new ArrayBuffer(12),g=new Uint32Array(m);g[0]=n,g[1]=a,g[2]=o;const b=I(m),y=t.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}}]}),h=Math.ceil(n/16),x=Math.ceil(a/16);function S(){const w=t.createCommandEncoder(),B=w.beginComputePass();B.setPipeline(i),B.setBindGroup(0,y),B.dispatchWorkgroups(h,x),B.end(),t.queue.submit([w.finish()])}for(const w of ze)try{e?.(0,`Starting ${w}s sustained test...`);const B=[],k=performance.now();let C=k,O=0;for(let D=0;D<5;D++)S(),await t.queue.onSubmittedWorkDone();for(;;){const D=(performance.now()-k)/1e3;if(D>=w)break;const ne=performance.now();let We=0;for(;!(performance.now()-ne>=1e3);)S(),await t.queue.onSubmittedWorkDone(),We++;const tt=(performance.now()-ne)/1e3,Lt=tt/We*1e3,rt=s*We/(tt*1e9);B.push({second:O,avgMs:Lt,gflops:rt}),O++;const Rt=Math.min(D/w*100,100);e?.(Rt,`${w}s test: ${Math.floor(D)}s / ${w}s — ${rt.toFixed(1)} GFLOPS`)}const U=B.slice(0,10),K=B.slice(-10),Z=U.reduce((D,ne)=>D+ne.gflops,0)/U.length,z=K.reduce((D,ne)=>D+ne.gflops,0)/K.length,L=z<Z*.85,_=B.reduce((D,ne)=>D+ne.gflops,0)/B.length;r.push({id:`sustained_${w}s`,name:`Sustained Load ${w}s`,inputSize:`${a}×${a} matmul`,executionTimeMs:B.reduce((D,ne)=>D+ne.avgMs,0)/B.length,throughput:`${_.toFixed(1)} GFLOPS avg`,memoryBytes:(n*o+o*a+n*a)*4,success:!0,gpuTimingAvailable:!0,samples:B,thermalThrottling:L,avgGflops:_,durationSeconds:w,details:{duration:w,totalSamples:B.length,avgGflops:_,minGflops:Math.min(...B.map(D=>D.gflops)),maxGflops:Math.max(...B.map(D=>D.gflops)),first10sAvg:Z,last10sAvg:z,throttled:L?"YES":"NO",dropPct:((1-z/Z)*100).toFixed(1)+"%"}}),e?.(100,`${w}s test complete — ${_.toFixed(1)} GFLOPS avg`),w!==ze[ze.length-1]&&(e?.(-1,"Cooling down 10s before next test..."),await new Promise(D=>setTimeout(D,1e4)))}catch(B){r.push({id:`sustained_${w}s`,name:`Sustained Load ${w}s`,inputSize:`${a}×${a} matmul`,executionTimeMs:0,throughput:"N/A",memoryBytes:0,success:!1,error:B.message,gpuTimingAvailable:!1,samples:[],thermalThrottling:!1,avgGflops:0,durationSeconds:w})}return d.destroy(),f.destroy(),p.destroy(),b.destroy(),r}function un(e,t){const r=new Float32Array(e.length);for(let a=0;a<e.length;a++)r[a]=e[a]+t[a];return r}function cn(e,t,r,a,n){const o=new Float32Array(r*a);for(let s=0;s<r;s++)for(let i=0;i<a;i++){let c=0;for(let u=0;u<n;u++)c+=e[s*n+u]*t[u*a+i];o[s*a+i]=c}return o}function ln(e,t,r,a,n,o,s,i,c){const u=n-i+1,l=o-c+1,d=new Float32Array(r*s*u*l);for(let f=0;f<r;f++)for(let p=0;p<s;p++)for(let m=0;m<u;m++)for(let g=0;g<l;g++){let b=0;for(let y=0;y<a;y++)for(let h=0;h<i;h++)for(let x=0;x<c;x++)b+=e[((f*a+y)*n+m+h)*o+g+x]*t[((p*a+y)*i+h)*c+x];d[((f*s+p)*u+m)*l+g]=b}return d}function dn(e,t,r){const a=new Float32Array(e.length);for(let n=0;n<t;n++){const o=n*r;let s=-1e30;for(let c=0;c<r;c++)e[o+c]>s&&(s=e[o+c]);let i=0;for(let c=0;c<r;c++){const u=Math.exp(e[o+c]-s);a[o+c]=u,i+=u}for(let c=0;c<r;c++)a[o+c]/=i}return a}function fn(e,t,r){const a=e.length;let n=0;for(let i=0;i<a;i++)n+=e[i]*e[i];const o=Math.sqrt(n/a+r),s=new Float32Array(a);for(let i=0;i<a;i++)s[i]=e[i]/o*t[i];return s}function te(e){return T(e.byteLength,e)}function Pe(e,t,r=[1,1,1]){const a=E(),n=a.createCommandEncoder(),o=n.beginComputePass();o.setPipeline(e),o.setBindGroup(0,t),o.dispatchWorkgroups(...r),o.end(),a.queue.submit([n.finish()])}async function pn(){try{const t=new Float32Array(1024).fill(2),r=new Float32Array(1024).fill(3),a=te(t),n=te(r),o=T(1024*4),s=new ArrayBuffer(4);new Uint32Array(s)[0]=1024;const i=I(s),c=j(Et,4),u=E().createBindGroup({layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:o}}]});Pe(c,u,[Math.ceil(1024/256),1,1]),await E().queue.onSubmittedWorkDone();const l=await H(o,1024*4),d=un(t,r);let f=0;for(let p=0;p<1024;p++)f=Math.max(f,Math.abs(l[p]-d[p]));return a.destroy(),n.destroy(),o.destroy(),i.destroy(),{name:"VecAdd",pass:f<1e-5,maxError:f,details:"N=1024"}}catch(e){return{name:"VecAdd",pass:!1,maxError:1/0,details:e.message}}}async function mn(){try{const t=new Float32Array(4096).fill(1),r=new Float32Array(64*64).fill(.5),a=te(t),n=te(r),o=T(64*64*4),s=new ArrayBuffer(12),i=new Uint32Array(s);i[0]=64,i[1]=64,i[2]=64;const c=I(s),u=j(Ke,4),l=E().createBindGroup({layout:u.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:n}},{binding:3,resource:{buffer:o}}]});Pe(u,l,[Math.ceil(64/16),Math.ceil(64/16),1]),await E().queue.onSubmittedWorkDone();const d=await H(o,64*64*4),f=cn(t,r,64,64,64);let p=0;for(let m=0;m<64*64;m++)p=Math.max(p,Math.abs(d[m]-f[m]));return a.destroy(),n.destroy(),o.destroy(),c.destroy(),{name:"Matmul",pass:p<.001,maxError:p,details:"64×64"}}catch(e){return{name:"Matmul",pass:!1,maxError:1/0,details:e.message}}}async function gn(){try{const u=new Float32Array(64),l=new Float32Array(1*1*3*3);for(let B=0;B<u.length;B++)u[B]=Math.random();for(let B=0;B<l.length;B++)l[B]=Math.random();const d=te(u),f=te(l),p=T(1*1*6*6*4),m=new ArrayBuffer(36),g=new Uint32Array(m);g[0]=1,g[1]=1,g[2]=8,g[3]=8,g[4]=1,g[5]=3,g[6]=3,g[7]=6,g[8]=6;const b=I(m),y=j(kt,4),h=E().createBindGroup({layout:y.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}}]});Pe(y,h,[1,1,1]),await E().queue.onSubmittedWorkDone();const x=await H(p,1*1*6*6*4),S=ln(u,l,1,1,8,8,1,3,3);let w=0;for(let B=0;B<x.length;B++)w=Math.max(w,Math.abs(x[B]-S[B]));return d.destroy(),f.destroy(),p.destroy(),b.destroy(),{name:"Conv2D",pass:w<1e-4,maxError:w,details:"1×1×8×8 k=3"}}catch(e){return{name:"Conv2D",pass:!1,maxError:1/0,details:e.message}}}async function bn(){try{const r=new Float32Array(64);for(let d=0;d<r.length;d++)r[d]=(Math.random()-.5)*10;const a=T(r.byteLength,r),n=new ArrayBuffer(8);new Uint32Array(n)[0]=4,new Uint32Array(n)[1]=16;const o=I(n),s=j(Nt,2),i=E().createBindGroup({layout:s.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:a}}]});Pe(s,i,[4,1,1]),await E().queue.onSubmittedWorkDone();const c=await H(a,r.byteLength),u=dn(r,4,16);let l=0;for(let d=0;d<r.length;d++)l=Math.max(l,Math.abs(c[d]-u[d]));return a.destroy(),o.destroy(),{name:"Softmax",pass:l<1e-4,maxError:l,details:"4×16"}}catch(e){return{name:"Softmax",pass:!1,maxError:1/0,details:e.message}}}async function yn(){try{const r=new Float32Array(128),a=new Float32Array(128);for(let m=0;m<128;m++)r[m]=(Math.random()-.5)*2,a[m]=1;const n=te(r),o=te(a),s=T(128*4),i=new ArrayBuffer(8);new Uint32Array(i)[0]=128,new Float32Array(i)[1]=1e-6;const c=I(i),u=j(Gt,4),l=E().createBindGroup({layout:u.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:s}}]});Pe(u,l,[1,1,1]),await E().queue.onSubmittedWorkDone();const d=await H(s,128*4),f=fn(r,a,1e-6);let p=0;for(let m=0;m<128;m++)p=Math.max(p,Math.abs(d[m]-f[m]));return n.destroy(),o.destroy(),s.destroy(),c.destroy(),{name:"RMSNorm",pass:p<.001,maxError:p,details:"N=128"}}catch(e){return{name:"RMSNorm",pass:!1,maxError:1/0,details:e.message}}}async function vn(){try{const a=1/Math.sqrt(16),n=1*16*16,o=1*16*16,s=new Float32Array(n),i=new Float32Array(n),c=new Float32Array(n);for(let C=0;C<n;C++)s[C]=Math.random(),i[C]=Math.random(),c[C]=Math.random();const u=te(s),l=te(i),d=te(c),f=T(n*4),p=T(o*4),m=new ArrayBuffer(16),g=new Uint32Array(m),b=new Float32Array(m);g[0]=1,g[1]=16,g[2]=16,b[3]=a;const y=I(m),h=j(Ot,6),x=E().createBindGroup({layout:h.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:y}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:d}},{binding:4,resource:{buffer:f}},{binding:5,resource:{buffer:p}}]});Pe(h,x,[1,1,1]),await E().queue.onSubmittedWorkDone();const S=await H(f,n*4);let w=!0;for(let C=0;C<n;C++)if(!isFinite(S[C])){w=!1;break}const B=await H(p,o*4);let k=!0;for(let C=0;C<16;C++){let O=0;for(let U=0;U<16;U++)O+=B[C*16+U];if(Math.abs(O-1)>.01){k=!1;break}}return u.destroy(),l.destroy(),d.destroy(),f.destroy(),p.destroy(),y.destroy(),{name:"Attention",pass:w&&k,maxError:k?0:1,details:`batch=1 seq=16 dim=16 finite=${w} softmax_ok=${k}`}}catch(e){return{name:"Attention",pass:!1,maxError:1/0,details:e.message}}}async function Ve(){return[await pn(),await mn(),await gn(),await bn(),await yn(),await vn()]}const hn="aether-gpu-benchmark",wn=1,de="results";function Ye(){return new Promise((e,t)=>{const r=indexedDB.open(hn,wn);r.onupgradeneeded=()=>{const a=r.result;a.objectStoreNames.contains(de)||a.createObjectStore(de,{keyPath:"id"})},r.onsuccess=()=>e(r.result),r.onerror=()=>t(r.error)})}async function Xe(e,t){const r=await Ye(),a=`run_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,n={id:a,timestamp:new Date().toISOString(),device:navigator.userAgent,adapter:t.adapter,os:t.os,browser:t.browser,results:e};return new Promise((o,s)=>{const i=r.transaction(de,"readwrite");i.objectStore(de).put(n),i.oncomplete=()=>o(a),i.onerror=()=>s(i.error)})}async function zt(){const e=await Ye();return new Promise((t,r)=>{const n=e.transaction(de,"readonly").objectStore(de).getAll();n.onsuccess=()=>t(n.result),n.onerror=()=>r(n.error)})}async function xn(){const e=await Ye();return new Promise((t,r)=>{const a=e.transaction(de,"readwrite");a.objectStore(de).clear(),a.oncomplete=()=>t(),a.onerror=()=>r(a.error)})}function Sn(e,t){const r={version:"1.0",exportDate:new Date().toISOString(),userAgent:navigator.userAgent,deviceInfo:t??{},results:e.map(a=>({...a,details:a.details??{}}))};return JSON.stringify(r,null,2)}function Mn(e,t){const r=`aether-benchmark-${Date.now()}.json`,a=new Blob([e],{type:"application/json"}),n=URL.createObjectURL(a),o=document.createElement("a");o.href=n,o.download=r,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(n)}let re=null,Q=!1;function M(e,t=""){if(!re)return;const r=re.querySelector("#bench-log");if(!r)return;const a=document.createElement("div");a.className=`log-entry ${t}`,a.textContent=e,r.appendChild(a),r.scrollTop=r.scrollHeight}function q(e,t){if(!re)return;const r=re.querySelector("#progress-fill"),a=re.querySelector("#progress-label");r&&(r.style.width=e<0?"0%":`${Math.min(e,100)}%`),a&&(a.textContent=t)}function Qe(e){if(!re)return;const t=re.querySelector("#results-table");if(!t)return;if(e.length===0){t.innerHTML='<div class="empty-state"><p>No results yet</p></div>';return}let r=`<table style="width:100%;border-collapse:collapse;font-size:12px;font-family:var(--mono)">
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
      <td style="padding:6px;text-align:right;color:var(--text-dim)">${Ie(a.memoryBytes)}</td>
      <td style="padding:6px;text-align:center;${n}">${o}</td>
    </tr>`}r+="</tbody></table>",t.innerHTML=r}function Ie(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function Bn(){if(Q)return;Q=!0;const e=re?.querySelector("#btn-quick");e&&(e.disabled=!0);const t=[];try{M("═══ QUICK BENCHMARK ═══","info"),q(0,"Initializing GPU...");const r=await Me();M(`Adapter: ${r.adapterName}`,"ok"),M(`Timestamp query: ${r.timestampQuerySupport?"YES":"NO"}`,""),M("",""),M("── CORRECTNESS TESTS ──","info");const a=await Ve();for(const u of a)M(`  ${u.pass?"✓":"✗"} ${u.name}: ${u.details} (max err: ${u.maxError.toExponential(2)})`,u.pass?"ok":"err");const n=a.every(u=>u.pass);M(`  ${n?"ALL TESTS PASSED":"SOME TESTS FAILED"}`,n?"ok":"err"),M("",""),M("── BENCHMARKS ──","info"),q(10,"Vector Add..."),M("▸ Vector Addition","info");const o=await Dt();for(const u of o)M(`  ${u.name} ${u.inputSize}: ${u.executionTimeMs.toFixed(2)} ms — ${u.throughput} [${u.success?"PASS":"FAIL"}]`,u.success?"ok":"err"),t.push(u);q(30,"Matrix Multiply..."),M("▸ Matrix Multiply","info");const s=await Ft();for(const u of s)M(`  ${u.name} ${u.inputSize}: ${u.executionTimeMs.toFixed(2)} ms — ${u.throughput} [${u.success?"PASS":"FAIL"}]`,u.success?"ok":"err"),t.push(u);q(60,"Softmax..."),M("▸ Softmax","info");const i=await _t();for(const u of i)M(`  ${u.name} ${u.inputSize}: ${u.executionTimeMs.toFixed(2)} ms — ${u.throughput} [${u.success?"PASS":"FAIL"}]`,u.success?"ok":"err"),t.push(u);q(80,"RMSNorm..."),M("▸ RMSNorm","info");const c=await Wt();for(const u of c)M(`  ${u.name} ${u.inputSize}: ${u.executionTimeMs.toFixed(2)} ms — ${u.throughput} [${u.success?"PASS":"FAIL"}]`,u.success?"ok":"err"),t.push(u);q(100,"Done"),M("",""),M("═══ QUICK BENCHMARK COMPLETE ═══","info"),M(`${t.length} tests run`,""),Qe(t);try{await Xe(t,{adapter:r.adapterName,os:Ze(),browser:Je()})}catch{}}catch(r){M(`ERROR: ${r.message}`,"err"),q(0,"Error")}finally{Q=!1,e&&(e.disabled=!1)}}async function An(){if(Q)return;Q=!0;const e=re?.querySelector("#btn-full");e&&(e.disabled=!0);const t=[];try{M("═══ FULL BENCHMARK ═══","info"),q(0,"Initializing GPU...");const r=await Me();M(`Adapter: ${r.adapterName}`,"ok"),M("",""),M("── CORRECTNESS TESTS ──","info");const a=await Ve();for(const o of a)M(`  ${o.pass?"✓":"✗"} ${o.name}: ${o.details} (max err: ${o.maxError.toExponential(2)})`,o.pass?"ok":"err");const n=[{name:"Vector Addition",fn:Dt,pct:10},{name:"Matrix Multiply",fn:Ft,pct:25},{name:"Convolution",fn:Zr,pct:40},{name:"Softmax",fn:_t,pct:55},{name:"RMSNorm",fn:Wt,pct:65},{name:"Attention",fn:an,pct:75},{name:"Memory",fn:()=>on(r),pct:90}];for(const o of n){q(o.pct,`${o.name}...`),M(`▸ ${o.name}`,"info");try{const s=await o.fn();for(const i of s)M(`  ${i.inputSize}: ${i.executionTimeMs.toFixed(2)} ms — ${i.throughput} [${i.success?"PASS":"FAIL"}]`,i.success?"ok":"err"),t.push(i)}catch(s){M(`  ERROR: ${s.message}`,"err")}}q(100,"Done"),M("",""),M("═══ FULL BENCHMARK COMPLETE ═══","info"),M(`${t.length} tests run`,""),Qe(t);try{await Xe(t,{adapter:r.adapterName,os:Ze(),browser:Je()})}catch{}}catch(r){M(`ERROR: ${r.message}`,"err"),q(0,"Error")}finally{Q=!1,e&&(e.disabled=!1)}}async function Cn(){if(Q)return;Q=!0;const e=re?.querySelector("#btn-sustained");e&&(e.disabled=!0);const t=[];try{M("═══ SUSTAINED LOAD BENCHMARK ═══","info"),M("This will run 30s + 60s + 180s = 270s total","warn"),M("Keep the screen on and do not switch tabs","warn"),q(0,"Initializing GPU..."),await Me();const r=await sn((a,n)=>{a>=0&&q(a,n),M(`  ${n}`,"")});for(const a of r)M(`  ${a.name}: ${a.avgGflops.toFixed(1)} GFLOPS avg, throttled=${a.thermalThrottling}`,a.thermalThrottling?"warn":"ok"),t.push(a);q(100,"Done"),M("",""),M("═══ SUSTAINED BENCHMARK COMPLETE ═══","info"),Qe(t);try{await Xe(t,{adapter:(await Me()).adapterName,os:Ze(),browser:Je()})}catch{}}catch(r){M(`ERROR: ${r.message}`,"err"),q(0,"Error")}finally{Q=!1,e&&(e.disabled=!1)}}async function Pn(){if(!Q){Q=!0;try{M("═══ CORRECTNESS TESTS ═══","info"),await Me();const e=await Ve();let t=!0;for(const r of e)M(`${r.pass?"✓":"✗"} ${r.name}: ${r.details} — max error: ${r.maxError.toExponential(2)}`,r.pass?"ok":"err"),r.pass||(t=!1);M("",""),M(t?"ALL TESTS PASSED":"SOME TESTS FAILED",t?"ok":"err")}catch(e){M(`ERROR: ${e.message}`,"err")}finally{Q=!1}}}async function Un(){try{const e=await zt();if(e.length===0){M("No results to export. Run a benchmark first.","warn");return}const t=e[e.length-1],r=Sn(t.results,{adapter:t.adapter,os:t.os,browser:t.browser,timestamp:t.timestamp});Mn(r),M("JSON exported","ok")}catch(e){M(`Export error: ${e.message}`,"err")}}async function $n(){try{const e=await zt();M(`── HISTORY: ${e.length} saved runs ──`,"info");for(const t of e.slice(-5))M(`  ${t.timestamp} — ${t.results.length} results — ${t.adapter}`,"")}catch(e){M(`History error: ${e.message}`,"err")}}async function Tn(){try{await xn(),M("History cleared","ok")}catch(e){M(`Clear error: ${e.message}`,"err")}}function Ze(){const e=navigator.userAgent;if(e.includes("iPhone")||e.includes("iPad")){const t=e.match(/OS (\d+_\d+)/);return`iOS ${t?t[1].replace("_","."):"?"}`}return e.includes("Mac")?"macOS":e.includes("Windows")?"Windows":e.includes("Android")?"Android":"Unknown"}function Je(){const e=navigator.userAgent;return e.includes("Safari")&&!e.includes("Chrome")?"Safari":e.includes("Chrome")&&!e.includes("Edg")?"Chrome":e.includes("Edg")?"Edge":e.includes("Firefox")?"Firefox":"Unknown"}function En(e){re=e,e.innerHTML=`
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
      <button class="btn" id="btn-quick">⚡ QUICK BENCHMARK</button>
      <button class="btn" id="btn-full">FULL BENCHMARK</button>
      <button class="btn btn-outline" id="btn-sustained">SUSTAINED (270s)</button>
      <button class="btn btn-outline" id="btn-tests">✓ TESTS ONLY</button>
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
  `,e.querySelector("#btn-quick")?.addEventListener("click",Bn),e.querySelector("#btn-full")?.addEventListener("click",An),e.querySelector("#btn-sustained")?.addEventListener("click",Cn),e.querySelector("#btn-tests")?.addEventListener("click",Pn),e.querySelector("#btn-export")?.addEventListener("click",Un),e.querySelector("#btn-history")?.addEventListener("click",$n),e.querySelector("#btn-clear")?.addEventListener("click",Tn);const t=r=>{r.preventDefault()};window.addEventListener("error",t),window.addEventListener("unhandledrejection",t),Me().then(r=>{const a=e.querySelector("#device-badge"),n=e.querySelector("#device-info");a&&(a.textContent="WEBGPU READY",a.className="badge badge-pass"),n&&(n.innerHTML=`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
          <span>Adapter:</span><span style="color:var(--text)">${r.adapterName}</span>
          <span>Vendor:</span><span style="color:var(--text)">${r.adapterVendor}</span>
          <span>Features:</span><span style="color:var(--text)">${r.adapterFeatures.length}</span>
          <span>Max Buffer:</span><span style="color:var(--text)">${Ie(r.maxBufferSize)}</span>
          <span>Max Storage:</span><span style="color:var(--text)">${Ie(r.maxStorageBufferBindingSize)}</span>
          <span>Workgroup X:</span><span style="color:var(--text)">${r.maxComputeWorkgroupSizeX}</span>
          <span>Invocations/wg:</span><span style="color:var(--text)">${r.maxComputeInvocationsPerWorkgroup}</span>
          <span>Timestamp Query:</span><span style="color:var(--text)">${r.timestampQuerySupport?"YES":"NO"}</span>
          <span>Preferred Format:</span><span style="color:var(--text)">${r.preferredCanvasFormat??"N/A"}</span>
          <span>Fallback:</span><span style="color:var(--text)">${r.isFallbackAdapter?"YES (software)":"NO (hardware)"}</span>
        </div>
      `)}).catch(r=>{const a=e.querySelector("#device-badge");a&&(a.textContent="WEBGPU UNAVAILABLE",a.className="badge badge-fail")})}const kn=Object.freeze(Object.defineProperty({__proto__:null,render:En},Symbol.toStringTag,{value:"Module"})),et=[{id:"gpubench",label:"GPU Bench",module:kn},{id:"device",label:"Device Test",module:Yt},{id:"webgpudiag",label:"WebGPU Diag",module:jr},{id:"model",label:"Model Test",module:or},{id:"tensor",label:"Tensor Bench",module:Rr},{id:"image",label:"Image Test",module:ir},{id:"video",label:"Video Test",module:dr},{id:"diag",label:"Diagnostics",module:gr}];let qt="gpubench";function At(){const e=window.location.hash.replace("#","");return et.some(t=>t.id===e)?e:e==="diagnostics/webgpu"||e==="webgpu"?"webgpudiag":"gpubench"}function qe(e){qt=e,window.location.hash=e;const t=document.getElementById("nav"),r=document.getElementById("screen");t.querySelectorAll("button").forEach(n=>{n.classList.toggle("active",n.dataset.screen===e)});const a=et.find(n=>n.id===e);a&&a.module.render(r)}function Nn(){const e=document.getElementById("app");e.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const t=document.getElementById("nav");document.getElementById("screen"),et.forEach(a=>{const n=document.createElement("button");n.textContent=a.label,n.dataset.screen=a.id,n.addEventListener("click",()=>qe(a.id)),t.appendChild(n)});const r=At();qe(r),window.addEventListener("hashchange",()=>{const a=At();a!==qt&&qe(a)}),"serviceWorker"in navigator&&navigator.serviceWorker.register("/AETHER/sw.js").catch(()=>{})}Nn();
