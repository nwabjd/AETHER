(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(a){if(a.ep)return;a.ep=!0;const s=r(a);fetch(a.href,s)}})();function Dn(e){let t="Unknown",r="Unknown",n="Unknown",a="Unknown";const s=e.match(/OS (\d+)_(\d+)/);s&&(n="iOS",a=`${s[1]}.${s[2]}`);const i=e.match(/Mac OS X (\d+)[_.](\d+)/);if(i&&(n="macOS",a=`${i[1]}.${i[2]}`),e.includes("Windows")){n="Windows";const u=e.match(/Windows NT (\d+\.\d+)/);u&&(a=u[1])}if(e.includes("Android")){n="Android";const u=e.match(/Android (\d+[\.\d]*)/);u&&(a=u[1])}if(e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")){t="Safari";const u=e.match(/Version\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Chrome")&&!e.includes("Edg")){t="Chrome";const u=e.match(/Chrome\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Edg/")){t="Edge";const u=e.match(/Edg\/(\d+[\.\d]*)/);u&&(r=u[1])}if(e.includes("Firefox")){t="Firefox";const u=e.match(/Firefox\/(\d+[\.\d]*)/);u&&(r=u[1])}return{browserName:t,browserVersion:r,osName:n,osVersion:a}}function Rn(e){return!!(e.includes("FBAN")||e.includes("FBIOS")||e.includes("Twitter")||e.includes("Instagram")||e.includes("Line/")||e.includes("WeChat")||e.includes("MicroMessenger")||e.includes("CocoaPods")||e.includes("wv)")||e.includes("Electron")||e.includes("; wv)"))}function On(e){return e.includes("Safari")&&!e.includes("Chrome")&&!e.includes("Chromium")}async function Pt(){const e=navigator.userAgent,t=Dn(e),r=t.osName==="iOS",n=On(e),a=Rn(e),s=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,i={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:e,platform:navigator.platform,isIOS:r,isSafari:n,isWebView:a,isStandalone:s,browserName:t.browserName,browserVersion:t.browserVersion,osName:t.osName,osVersion:t.osVersion},o={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(a)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:i,gpu:o};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:r?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:i,gpu:o};if(!navigator.gpu){let u="navigator.gpu is undefined. WebGPU API is not exposed.",l="";if(r){if(parseInt(t.osVersion.split(".")[0],10)<26)return u=`iOS ${t.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,l="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:l,environment:i,gpu:o};if(t.browserName!=="Safari")return u=`Running ${t.browserName} on iOS ${t.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,l="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:u,recommendation:l,environment:i,gpu:o}}return t.osName==="macOS"&&parseInt(t.osVersion.split(".")[0],10)<14?(u=`macOS ${t.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,l="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:l,environment:i,gpu:o}):(l="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:l,environment:i,gpu:o})}try{const u=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!u){o.adapterError="requestAdapter() returned null";let d="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",m="";return r?parseInt(t.osVersion.split(".")[0],10)>=26&&(d=`iOS ${t.osVersion} with Safari ${t.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,m="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(d="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",m="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):m="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:d,recommendation:m,environment:i,gpu:o}}o.adapterName=u.name??"Unknown GPU",o.adapterVendor=u.vendor??"Unknown",o.adapterDevice=u.device??"Unknown",o.isFallbackAdapter=u.isFallbackAdapter??!1;const l=[];for(const d of u.features)l.push(d.replace(/-/g," ").replace(/\b\w/g,m=>m.toUpperCase()));o.features=l;const c=u.limits;o.limits={maxBufferSize:c.maxBufferSize,maxTextureDimension1D:c.maxTextureDimension1D,maxTextureDimension2D:c.maxTextureDimension2D,maxTextureDimension3D:c.maxTextureDimension3D,maxComputeWorkgroupStorageSize:c.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:c.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:c.maxStorageBufferBindingSize,maxUniformBufferBindingSize:c.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:c.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:c.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:c.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:c.maxComputeWorkgroupsPerDimension,maxColorAttachments:c.maxColorAttachments,minStorageBufferOffsetAlignment:c.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:c.minUniformBufferOffsetAlignment};try{(await u.requestDevice({requiredLimits:{}})).destroy()}catch(d){return o.deviceError=d.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${o.adapterName}) but requestDevice() failed: ${d.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:i,gpu:o}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${o.adapterName}.`,recommendation:"No action needed.",environment:i,gpu:o}}catch(u){return o.adapterError=u.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${u.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:i,gpu:o}}}function Vr(e){const t=[];if(t.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),t.push(""),t.push(`STATUS: ${e.statusLabel}`),t.push(`CASE: ${e.case}`),t.push(`REASON: ${e.reason}`),t.push(`RECOMMENDATION: ${e.recommendation}`),t.push(""),t.push("── ENVIRONMENT ──"),t.push(`  URL: ${e.environment.url}`),t.push(`  Protocol: ${e.environment.protocol}`),t.push(`  Hostname: ${e.environment.hostname}`),t.push(`  Secure Context: ${e.environment.isSecureContext}`),t.push(`  iOS: ${e.environment.isIOS}`),t.push(`  Safari: ${e.environment.isSafari}`),t.push(`  WebView: ${e.environment.isWebView}`),t.push(`  Standalone PWA: ${e.environment.isStandalone}`),t.push(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`),t.push(`  OS: ${e.environment.osName} ${e.environment.osVersion}`),t.push(`  Platform: ${e.environment.platform}`),t.push(`  User Agent: ${e.environment.userAgent}`),t.push(""),t.push("── WEBGPU ──"),t.push(`  navigator.gpu exists: ${e.gpu.navigatorGpuExists}`),e.gpu.adapterName&&t.push(`  Adapter: ${e.gpu.adapterName}`),e.gpu.adapterVendor&&t.push(`  Vendor: ${e.gpu.adapterVendor}`),e.gpu.adapterDevice&&t.push(`  Device: ${e.gpu.adapterDevice}`),e.gpu.adapterError&&t.push(`  Adapter Error: ${e.gpu.adapterError}`),e.gpu.deviceError&&t.push(`  Device Error: ${e.gpu.deviceError}`),t.push(`  Fallback adapter: ${e.gpu.isFallbackAdapter}`),e.gpu.features.length>0){t.push(`  Features (${e.gpu.features.length}):`);for(const r of e.gpu.features)t.push(`    ${r}`)}if(e.gpu.limits){t.push("  Limits:");for(const[r,n]of Object.entries(e.gpu.limits))t.push(`    ${r}: ${typeof n=="number"?n.toLocaleString():n}`)}return t.push(""),t.push(`Timestamp: ${new Date().toISOString()}`),t.join(`
`)}function ft(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}async function Ue(){const e=await Pt();if(!e.ready||!e.gpu.adapterName)return null;const t=e.gpu.limits;return{available:!0,adapterName:e.gpu.adapterName,adapterVendor:e.gpu.adapterVendor,adapterDevice:e.gpu.adapterDevice,features:e.gpu.features,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:e.gpu.isFallbackAdapter,featuresMap:new Set(e.gpu.features),diagnostic:e}}async function Te(e,t=[]){const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("Failed to re-acquire GPU adapter");const n=await r.requestDevice({requiredFeatures:t.filter(a=>e.featuresMap.has(a)),requiredLimits:{}});return n.lost.then(a=>{console.error("WebGPU device lost:",a.message)}),n}function Nn(e){const t=e.environment,r=e.gpu;let n="badge-fail";e.case==="D"?n="badge-pass":(e.case==="B"||e.case==="C")&&(n="badge-warn");let a=`
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
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${ft(r.limits.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${r.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${r.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${r.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${ft(r.limits.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${ft(r.limits.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${ft(r.limits.maxComputeWorkgroupStorageSize)}</span></div>
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
        ${r.features.map(s=>`<div class="row"><span class="row-value">${s}</span></div>`).join("")}
      </div>
    `),a}function Gn(e){e.innerHTML=`
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;const t=e.querySelector("#device-status"),r=e.querySelector("#device-info");Pt().then(n=>{n.ready?t.innerHTML=`
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `:t.innerHTML="",r.innerHTML=Nn(n)})}const In=Object.freeze(Object.defineProperty({__proto__:null,render:Gn},Symbol.toStringTag,{value:"Module"}));let D=class jr{buffer;shape;dtype;size;device;constructor(t,r,n="f32"){this.device=t,this.shape=[...r],this.dtype=n,this.size=r.reduce((i,o)=>i*o,1);const a=n==="f32"?4:n==="f16"?2:4;this.buffer=t.createBuffer({size:this.size*a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(n==="f32"?new Float32Array(this.buffer.getMappedRange()):n==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(t,r,n){const a=new jr(t,n,r instanceof Float32Array?"f32":"i32");return t.queue.writeBuffer(a.buffer,0,r.buffer),a}async readback(){const t=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r=this.device.createCommandEncoder();r.copyBufferToBuffer(this.buffer,0,t,0,this.buffer.size),this.device.queue.submit([r.finish()]),await t.mapAsync(GPUMapMode.READ);const n=new Float32Array(t.getMappedRange().slice(0));return t.unmap(),t.destroy(),n}destroy(){this.buffer.destroy()}};async function Je(e,t,r=50,n){const a=[];for(let l=0;l<Math.min(5,r);l++)await t();for(let l=0;l<r;l++){const c=performance.now();await t(),await Kr?.queue.onSubmittedWorkDone();const d=performance.now();a.push(d-c)}a.sort((l,c)=>l-c);const s=a.reduce((l,c)=>l+c,0)/a.length,i=a[0],o=a[a.length-1],u={name:e,avgMs:s,minMs:i,maxMs:o,iterations:r};if(n){const c=n/(s/1e3)/1e9;u.gflops=c,u.throughput=`${c.toFixed(2)} GFLOPS`}return u}let Kr=null;function Be(e){Kr=e}function et(e){const t=[`${e.name}: ${e.avgMs.toFixed(2)} ms avg`,`(${e.minMs.toFixed(2)} – ${e.maxMs.toFixed(2)} ms)`,`[${e.iterations} iterations]`];return e.throughput&&t.push(e.throughput),t.join(" ")}const ht=`
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
`,Ln=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= uniforms.N) { return; }
  data[i] = max(data[i], 0.0);
}
`,Fn=`
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
`,_n=`
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
`,zn=`
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
`,qn=`
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
`;let w=null,Oe=null;function k(e,t=""){if(!Oe)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Oe.appendChild(r),Oe.scrollTop=Oe.scrollHeight}async function cr(){k("═══ TINY NEURAL NETWORK TEST ═══","info"),k("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),k("");const e=await Ue();if(!e)return k("WebGPU not available","err"),!1;w=await Te(e),Be(w);const t=performance.now(),r=D.fromData(w,new Float32Array([1,.5,-.3,.8]),[4]),n=D.fromData(w,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),a=D.fromData(w,new Float32Array([.1,-.1,.2]),[3]),s=new ArrayBuffer(12),i=new Uint32Array(s);i[0]=1,i[1]=3,i[2]=4;const o=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[o]}),compute:{module:w.createShaderModule({code:ht}),entryPoint:"main"}}),l=w.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(l,0,s);const c=new D(w,[1,3]),d=w.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:n.buffer}},{binding:3,resource:{buffer:c.buffer}}]});let m=w.createCommandEncoder(),f=m.beginComputePass();f.setPipeline(u),f.setBindGroup(0,d),f.dispatchWorkgroups(1,1,1),f.end(),w.queue.submit([m.finish()]),k(`  input[4]:  [${Array.from(await r.readback()).map(O=>O.toFixed(2)).join(", ")}]`,""),k("  W1[4×3]:   4 rows × 3 cols",""),k("  Matmul result: computing...","");const p=await c.readback();k(`  h1 = input @ W1: [${Array.from(p).map(O=>O.toFixed(3)).join(", ")}]`,"ok");for(let O=0;O<3;O++)p[O]+=[.1,-.1,.2][O];w.queue.writeBuffer(c.buffer,0,p.buffer),k(`  h1 + bias:       [${Array.from(p).map(O=>O.toFixed(3)).join(", ")}]`,"ok");const g=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),b=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[g]}),compute:{module:w.createShaderModule({code:Ln}),entryPoint:"main"}}),y=new ArrayBuffer(4);new Uint32Array(y)[0]=3;const v=w.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(v,0,y);const h=w.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:c.buffer}}]});m=w.createCommandEncoder(),f=m.beginComputePass(),f.setPipeline(b),f.setBindGroup(0,h),f.dispatchWorkgroups(1,1,1),f.end(),w.queue.submit([m.finish()]);const S=await c.readback();k(`  ReLU(h1):         [${Array.from(S).map(O=>O.toFixed(3)).join(", ")}]`,"ok");const M=D.fromData(w,new Float32Array([.7,-.3,.5]),[3,1]),B=new D(w,[1,1]),R=new ArrayBuffer(12),I=new Uint32Array(R);I[0]=1,I[1]=1,I[2]=3;const L=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),W=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[L]}),compute:{module:w.createShaderModule({code:ht}),entryPoint:"main"}}),ze=w.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(ze,0,R);const we=w.createBindGroup({layout:L,entries:[{binding:0,resource:{buffer:ze}},{binding:1,resource:{buffer:c.buffer}},{binding:2,resource:{buffer:M.buffer}},{binding:3,resource:{buffer:B.buffer}}]});m=w.createCommandEncoder(),f=m.beginComputePass(),f.setPipeline(W),f.setBindGroup(0,we),f.dispatchWorkgroups(1,1,1),f.end(),w.queue.submit([m.finish()]);const ee=await B.readback(),de=(performance.now()-t).toFixed(1);return k(`  Final output: ${ee[0].toFixed(4)}`,"ok"),k(`  Total pipeline: ${de} ms`,"ok"),k("",""),k("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),r.destroy(),n.destroy(),a.destroy(),c.destroy(),M.destroy(),B.destroy(),l.destroy(),ze.destroy(),v.destroy(),w.destroy(),!0}async function Wn(){k("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const e=await Ue();if(!e)return null;w=await Te(e),Be(w);const t=[64,128,256,512],r=[];for(const n of t){const a=D.fromData(w,new Float32Array(n*n).fill(1),[n,n]),s=D.fromData(w,new Float32Array(n*n).fill(.5),[n,n]),i=new D(w,[n,n]),o=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[o]}),compute:{module:w.createShaderModule({code:ht}),entryPoint:"main"}}),l=new ArrayBuffer(12),c=new Uint32Array(l);c[0]=n,c[1]=n,c[2]=n;const d=await Je(`${n}×${n} matmul`,async()=>{const m=w.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(m,0,l);const f=w.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),p=w.createCommandEncoder(),g=p.beginComputePass();g.setPipeline(u),g.setBindGroup(0,f);const b=Math.ceil(n/16);g.dispatchWorkgroups(b,b,1),g.end(),w.queue.submit([p.finish()]),m.destroy()},30,2*n*n*n);r.push(d),k(et(d),"ok"),a.destroy(),s.destroy(),i.destroy()}return w.destroy(),r[r.length-1]}async function Hn(){k("═══ CONVOLUTION BENCHMARK ═══","info");const e=await Ue();if(!e)return null;w=await Te(e),Be(w);const t=1,r=3,n=32,a=32,s=8,i=3,o=3,u=n-i+1,l=a-o+1,c=D.fromData(w,new Float32Array(t*r*n*a).fill(.5),[t,r,n,a]),d=D.fromData(w,new Float32Array(s*r*i*o).fill(.1),[s,r,i,o]),m=new D(w,[t,s,u,l]),f=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),p=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[f]}),compute:{module:w.createShaderModule({code:Fn}),entryPoint:"main"}}),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=t,b[1]=r,b[2]=n,b[3]=a,b[4]=s,b[5]=i,b[6]=o,b[7]=u,b[8]=l;const y=await Je(`Conv2D ${t}×${r}×${n}×${a} k=${i}→${s}×${u}×${l}`,async()=>{const v=w.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(v,0,g);const h=w.createBindGroup({layout:f,entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:c.buffer}},{binding:2,resource:{buffer:d.buffer}},{binding:3,resource:{buffer:m.buffer}}]}),S=w.createCommandEncoder(),M=S.beginComputePass();M.setPipeline(p),M.setBindGroup(0,h),M.dispatchWorkgroups(t,s,1),M.end(),w.queue.submit([S.finish()]),v.destroy()},20,2*t*s*r*i*o*u*l);return k(et(y),"ok"),c.destroy(),d.destroy(),m.destroy(),w.destroy(),y}async function Vn(){k("═══ ATTENTION BENCHMARK ═══","info");const e=await Ue();if(!e)return null;w=await Te(e),Be(w);const t=1,r=64,n=64,a=1/Math.sqrt(n),s=D.fromData(w,new Float32Array(t*r*n).fill(.1),[t,r,n]),i=D.fromData(w,new Float32Array(t*r*n).fill(.1),[t,r,n]),o=D.fromData(w,new Float32Array(t*r*n).fill(.1),[t,r,n]),u=new D(w,[t,r,n]),l=new D(w,[t,r,r]),c=w.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),d=w.createComputePipeline({layout:w.createPipelineLayout({bindGroupLayouts:[c]}),compute:{module:w.createShaderModule({code:_n}),entryPoint:"main"}}),m=new ArrayBuffer(16),f=new Uint32Array(m),p=new Float32Array(m);f[0]=t,f[1]=r,f[2]=n,p[3]=a;const g=await Je(`Attention b=${t} s=${r} d=${n}`,async()=>{const b=w.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.queue.writeBuffer(b,0,m);const y=w.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:s.buffer}},{binding:2,resource:{buffer:i.buffer}},{binding:3,resource:{buffer:o.buffer}},{binding:4,resource:{buffer:u.buffer}},{binding:5,resource:{buffer:l.buffer}}]}),v=w.createCommandEncoder(),h=v.beginComputePass();h.setPipeline(d),h.setBindGroup(0,y),h.dispatchWorkgroups(t,1,1),h.end(),w.queue.submit([v.finish()]),b.destroy()},20);return k(et(g),"ok"),s.destroy(),i.destroy(),o.destroy(),u.destroy(),l.destroy(),w.destroy(),g}function jn(e){e.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,Oe=e.querySelector("#model-log"),e.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{Oe.innerHTML="",await cr()}),e.querySelector("#btn-all-bench").addEventListener("click",async()=>{Oe.innerHTML="",await cr(),k("",""),await Wn(),k("",""),await Hn(),k("",""),await Vn(),k("",""),k("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const Kn=Object.freeze(Object.defineProperty({__proto__:null,render:jn},Symbol.toStringTag,{value:"Module"}));let T=null,Ee=null;function ne(e,t=""){if(!Ee)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Ee.appendChild(r),Ee.scrollTop=Ee.scrollHeight}function Yr(e,t){const r=new Float32Array(e*t*4);for(let n=0;n<t;n++)for(let a=0;a<e;a++){const s=(n*e+a)*4,i=(a>>4)+(n>>4)&1;r[s+0]=i?.9:a/e*.8,r[s+1]=i?.3:n/t*.6,r[s+2]=i?.6:.4,r[s+3]=1}return r}function qt(e,t,r){const n=document.createElement("canvas");n.width=t,n.height=r;const a=n.getContext("2d"),s=a.createImageData(t,r);for(let i=0;i<t*r*4;i++)s.data[i]=Math.round(e[i]*255);return a.putImageData(s,0,0),n}async function lr(){ne("═══ GRAYSCALE TEST ═══","info");const e=await Ue();if(!e){ne("WebGPU unavailable","err");return}T=await Te(e),Be(T);const t=256,r=256,n=Yr(t,r),a=D.fromData(T,n,[t*r*4]),s=new D(T,[t*r*4]),i=T.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),o=T.createComputePipeline({layout:T.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:T.createShaderModule({code:qn}),entryPoint:"main"}}),u=new ArrayBuffer(4);new Uint32Array(u)[0]=t*r;const l=await Je("Grayscale 256×256",async()=>{const p=T.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});T.queue.writeBuffer(p,0,u);const g=T.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:p}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:s.buffer}}]}),b=T.createCommandEncoder(),y=b.beginComputePass();y.setPipeline(o),y.setBindGroup(0,g),y.dispatchWorkgroups(Math.ceil(t*r/256),1,1),y.end(),T.queue.submit([b.finish()]),p.destroy()},50);ne(et(l),"ok");const c=await s.readback(),d=qt(n,t,r),m=qt(c,t,r),f=Zt?.querySelector("#image-display");if(f){f.innerHTML="";const p=document.createElement("div");p.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const g=document.createElement("div");g.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',g.appendChild(d);const b=document.createElement("div");b.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',b.appendChild(m),p.appendChild(g),p.appendChild(b),f.appendChild(p)}a.destroy(),s.destroy(),T.destroy(),ne("✓ Grayscale complete","ok")}async function dr(){ne("═══ CONVOLUTION KERNEL TEST ═══","info");const e=await Ue();if(!e){ne("WebGPU unavailable","err");return}T=await Te(e),Be(T);const t=128,r=128,n=3,a=Yr(t,r),s={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},i=T.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),o=T.createComputePipeline({layout:T.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:T.createShaderModule({code:zn}),entryPoint:"main"}}),u=new ArrayBuffer(16),l=new Uint32Array(u);l[0]=t,l[1]=r,l[2]=n,l[3]=0;for(const[c,d]of Object.entries(s)){const m=D.fromData(T,a,[t*r*4]),f=D.fromData(T,d,[n*n]),p=new D(T,[t*r*4]),g=await Je(`Conv ${c} ${t}×${r}`,async()=>{const v=T.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});T.queue.writeBuffer(v,0,u);const h=T.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:f.buffer}},{binding:2,resource:{buffer:m.buffer}},{binding:3,resource:{buffer:p.buffer}}]}),S=T.createCommandEncoder(),M=S.beginComputePass();M.setPipeline(o),M.setBindGroup(0,h),M.dispatchWorkgroups(Math.ceil(t/16),Math.ceil(r/16),1),M.end(),T.queue.submit([S.finish()]),v.destroy()},30);ne(et(g),"ok");const b=await p.readback(),y=Zt?.querySelector("#image-display");if(y){const v=qt(b,t,r),h=document.createElement("div");h.style.cssText="display:inline-block;margin:4px",h.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${c}</div>`,h.appendChild(v),y.appendChild(h)}m.destroy(),f.destroy(),p.destroy()}T.destroy(),ne("✓ All convolution kernels applied","ok")}let Zt=null;function Yn(e){Zt=e,e.innerHTML=`
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
  `,Ee=e.querySelector("#image-log"),e.querySelector("#btn-grayscale").addEventListener("click",async()=>{Ee.innerHTML="",e.querySelector("#image-display").innerHTML="",await lr()}),e.querySelector("#btn-conv").addEventListener("click",async()=>{Ee.innerHTML="",e.querySelector("#image-display").innerHTML="",await dr()}),e.querySelector("#btn-all-img").addEventListener("click",async()=>{Ee.innerHTML="",e.querySelector("#image-display").innerHTML="",await lr(),ne("",""),await dr(),ne("",""),ne("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const Qn=Object.freeze(Object.defineProperty({__proto__:null,render:Yn},Symbol.toStringTag,{value:"Module"}));let _=null,nt=null,bt=null;function Wt(e,t=""){if(!nt)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,nt.appendChild(r),nt.scrollTop=nt.scrollHeight}const Xn=`
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
`;let Ht=0,yt=0;async function Zn(e,t,r,n,a){const s=await Ue();if(!s){Wt("WebGPU unavailable","err");return}_=await Te(s),Be(_);const[i,o]=n.value.split("x").map(Number);e.width=i,e.height=o,Ht=parseInt(a.value);const u=_.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),l=_.createComputePipeline({layout:_.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:_.createShaderModule({code:Xn}),entryPoint:"main"}}),c=_.createBuffer({size:i*o*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),d=e.getContext("2d"),m=_.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let f=performance.now(),p=0,g=0;t.textContent="RENDERING",t.className="badge badge-pass";function b(){const y=new ArrayBuffer(16),v=new Uint32Array(y);v[0]=i,v[1]=o,v[2]=yt,v[3]=Ht,_.queue.writeBuffer(m,0,y);const h=_.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:c}}]}),S=_.createCommandEncoder(),M=S.beginComputePass();M.setPipeline(l),M.setBindGroup(0,h),M.dispatchWorkgroups(Math.ceil(i/16),Math.ceil(o/16),1),M.end();const B=_.createBuffer({size:i*o*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});S.copyBufferToBuffer(c,0,B,0,i*o*4*4),_.queue.submit([S.finish()]),B.mapAsync(GPUMapMode.READ).then(()=>{const R=new Float32Array(B.getMappedRange().slice(0));B.unmap(),B.destroy();const I=d.createImageData(i,o);for(let W=0;W<i*o*4;W++)I.data[W]=Math.round(R[W]*255);d.putImageData(I,0,0),yt++,g++;const L=performance.now();L-f>=1e3&&(p=Math.round(g*1e3/(L-f)),r.textContent=`${p} FPS | Frame ${yt} | ${i}×${o}`,g=0,f=L),bt=requestAnimationFrame(b)})}b()}function fr(){bt!==null&&(cancelAnimationFrame(bt),bt=null),_&&(_.destroy(),_=null)}function Jn(e){e.innerHTML=`
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
  `,nt=e.querySelector("#video-log");const t=e.querySelector("#video-canvas"),r=e.querySelector("#video-status"),n=e.querySelector("#video-fps"),a=e.querySelector("#res-select"),s=e.querySelector("#mode-select");e.querySelector("#btn-start").addEventListener("click",()=>{fr(),yt=0,Ht=parseInt(s.value),Wt(`Starting GPU compute video: ${a.value} mode=${s.value}`,"info"),Zn(t,r,n,a,s)}),e.querySelector("#btn-stop").addEventListener("click",()=>{fr(),r.textContent="STOPPED",r.className="badge badge-info",Wt("Rendering stopped","warn")})}const ea=Object.freeze(Object.defineProperty({__proto__:null,render:Jn},Symbol.toStringTag,{value:"Module"}));let Ve=null;function P(e,t=""){if(!Ve)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Ve.appendChild(r),Ve.scrollTop=Ve.scrollHeight}async function ta(){if(Ve.innerHTML="",P("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),P(`Timestamp: ${new Date().toISOString()}`,""),!await ra())return;const t=await Ue();if(!t){P("Cannot proceed: GPU not ready","err");return}P("",""),P("── MEMORY TEST ──","info");const r=await Te(t);Be(r);const n=Math.floor(t.limits.maxBufferSize/1048576);P(`Attempting to allocate buffer at reported max: ${n} MB`,"");try{const a=r.createBuffer({size:t.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});P("Buffer allocation at max: SUCCESS","ok"),a.destroy()}catch(a){P(`Buffer allocation at max: FAILED — ${a.message}`,"warn");for(const s of[256,128,64,32])try{const i=r.createBuffer({size:s*1048576,usage:GPUBufferUsage.STORAGE});P(`Largest successful allocation: ${s} MB`,"ok"),i.destroy();break}catch{continue}}P("",""),P("── COMPUTE THROUGHPUT ──","info");for(const a of[64,128,256]){const s=D.fromData(r,new Float32Array(a*a).fill(1),[a,a]),i=D.fromData(r,new Float32Array(a*a).fill(1),[a,a]),o=new D(r,[a,a]),u=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),l=r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:r.createShaderModule({code:ht}),entryPoint:"main"}}),c=await Je(`matmul ${a}×${a}`,async()=>{const d=r.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=new ArrayBuffer(12);new Uint32Array(m).set([a,a,a]),r.queue.writeBuffer(d,0,m);const f=r.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:s.buffer}},{binding:2,resource:{buffer:i.buffer}},{binding:3,resource:{buffer:o.buffer}}]}),p=r.createCommandEncoder(),g=p.beginComputePass();g.setPipeline(l),g.setBindGroup(0,f);const b=Math.ceil(a/16);g.dispatchWorkgroups(b,b,1),g.end(),r.queue.submit([p.finish()]),d.destroy()},30,2*a*a*a);P(et(c),"ok"),s.destroy(),i.destroy(),o.destroy()}r.destroy(),P("",""),P("═══ DIAGNOSTICS COMPLETE ═══","info")}async function ra(){const e=await Pt();return Vr(e),P("── WEBGPU STATUS ──","info"),P(`${e.statusLabel} (Case ${e.case})`,e.ready?"ok":"err"),P(`Reason: ${e.reason}`,""),P(`Recommendation: ${e.recommendation}`,""),P("",""),P("── ENVIRONMENT ──","info"),P(`  URL: ${e.environment.url}`,""),P(`  Secure Context: ${e.environment.isSecureContext}`,e.environment.isSecureContext?"ok":"err"),P(`  Browser: ${e.environment.browserName} ${e.environment.browserVersion}`,""),P(`  OS: ${e.environment.osName} ${e.environment.osVersion}`,""),P(`  iOS: ${e.environment.isIOS}`,""),P(`  Safari: ${e.environment.isSafari}`,""),P(`  WebView: ${e.environment.isWebView}`,e.environment.isWebView?"err":""),P(`  navigator.gpu: ${e.gpu.navigatorGpuExists}`,e.gpu.navigatorGpuExists?"ok":"err"),e.gpu.adapterName&&(P(`  Adapter: ${e.gpu.adapterName}`,"ok"),P(`  Vendor: ${e.gpu.adapterVendor}`,"")),e.gpu.adapterError&&P(`  Adapter Error: ${e.gpu.adapterError}`,"err"),e.gpu.deviceError&&P(`  Device Error: ${e.gpu.deviceError}`,"err"),e.ready?!0:(P("",""),P("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function na(e){e.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,Ve=e.querySelector("#diag-log"),e.querySelector("#btn-diag").addEventListener("click",()=>{ta()})}const aa=Object.freeze(Object.defineProperty({__proto__:null,render:na},Symbol.toStringTag,{value:"Module"}));class $e{dims;ndim;size;strides;constructor(t){this.dims=typeof t=="number"?[t]:[...t],this.ndim=this.dims.length,this.size=this.dims.reduce((a,s)=>a*s,1);const r=new Array(this.ndim);let n=1;for(let a=this.ndim-1;a>=0;a--)r[a]=n,n*=this.dims[a];this.strides=r}equals(t){if(this.ndim!==t.ndim)return!1;for(let r=0;r<this.ndim;r++)if(this.dims[r]!==t.dims[r])return!1;return!0}isContiguous(){let t=1;for(let r=this.ndim-1;r>=0;r--){if(this.strides[r]!==t)return!1;t*=this.dims[r]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new $e([1])}static from(...t){return new $e(t)}}var pe=(e=>(e.Float32="f32",e.Float16="f16",e.Int32="i32",e.Int8="i8",e.Uint8="u8",e))(pe||{});const sa={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function Qr(e){return sa[e].bytes}let ie=null;async function oa(){if(ie)return ie;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.limits,r=new Set(e.features),n=await e.requestDevice({requiredLimits:{}});return n.lost.then(a=>{console.error("WebGPU device lost:",a.message),ie=null}),ie={adapter:e,device:n,limits:{maxBufferSize:t.maxBufferSize,maxTextureDimension1D:t.maxTextureDimension1D,maxTextureDimension2D:t.maxTextureDimension2D,maxTextureDimension3D:t.maxTextureDimension3D,maxComputeWorkgroupStorageSize:t.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxUniformBufferBindingSize:t.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:t.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:t.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:t.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:t.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:t.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:t.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:t.minStorageBufferOffsetAlignment,maxColorAttachments:t.maxColorAttachments,maxTextureArrayLayers:t.maxTextureArrayLayers},features:r},ie}function N(){if(!ie)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return ie}function ia(){ie&&(ie.device.destroy(),ie=null)}class je{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(t,r,n){this.shape=t,this.dtype=r,this.byteSize=t.size*Qr(r),this.gpuBuffer=n??N().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(t,r,n=pe.Float32){const a=N(),s=new je(t,n);return a.device.queue.writeBuffer(s.gpuBuffer,0,r.buffer,r.byteOffset,r.byteLength),s}async readback(){const t=N(),r=t.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),n=t.device.createCommandEncoder();n.copyBufferToBuffer(this.gpuBuffer,0,r,0,this.byteSize),t.device.queue.submit([n.finish()]),await r.mapAsync(GPUMapMode.READ);const a=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),a}destroy(){this.gpuBuffer.destroy()}}class E{shape;dtype;buffer;constructor(t,r=pe.Float32,n){this.shape=t,this.dtype=r,this.buffer=n??new je(t,r)}static fromFloat32(t,r){const n=t instanceof Float32Array?t:new Float32Array(t),a=new $e(r);return new E(a,pe.Float32,je.fromData(a,n,pe.Float32))}static fromInt32(t,r){const n=t instanceof Int32Array?t:new Int32Array(t),a=new $e(r);return new E(a,pe.Int32,je.fromData(a,n,pe.Int32))}static zeros(t,r=pe.Float32){const n=new $e(t),a=n.size*Qr(r),i=N().device.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(i.getMappedRange()).fill(0),i.unmap();const o=new je(n,r,i);return new E(n,r,o)}static ones(t,r=pe.Float32){const n=new $e(t).size,a=new Float32Array(n).fill(1);return E.fromFloat32(a,t)}static randn(t){const r=new $e(t).size,n=new Float32Array(r);for(let a=0;a<r;a++){const s=Math.random(),i=Math.random();n[a]=Math.sqrt(-2*Math.log(s))*Math.cos(2*Math.PI*i)}return E.fromFloat32(n,t)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class ua{cache=new Map;getOrCreate(t,r,n){if(this.cache.has(t))return this.cache.get(t);const a=N(),s=a.device.createComputePipeline({layout:a.device.createPipelineLayout({bindGroupLayouts:[n]}),compute:{module:a.device.createShaderModule({code:r}),entryPoint:"main"}});return this.cache.set(t,s),s}get(t){return this.cache.get(t)}clear(){this.cache.clear()}}const ca=`
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
`,la=`
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
`,da=`
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
`,fa=`
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
`,pa=`
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
`,ma=`
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
`,ga=`
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
`,ba=`
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
`,ya=`
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
`,va=`
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
`;function ha(e,t,r,n,a){const s=new Float32Array(r*n);for(let i=0;i<r;i++)for(let o=0;o<n;o++){let u=0;for(let l=0;l<a;l++)u+=e[i*a+l]*t[l*n+o];s[i*n+o]=u}return s}function wa(e,t){const r=new Float32Array(e.length);for(let n=0;n<e.length;n++)r[n]=e[n]+t[n];return r}function xa(e,t){const r=new Float32Array(e.length);for(let n=0;n<e.length;n++)r[n]=e[n]*t[n];return r}function Sa(e,t,r=1e-6){const n=e.length;let a=0;for(let o=0;o<n;o++)a+=e[o]*e[o];const s=Math.sqrt(a/n+r),i=new Float32Array(n);for(let o=0;o<n;o++)i[o]=e[o]/s*t[o];return i}function Ma(e,t,r,n=1e-6){const a=e.length;let s=0;for(let l=0;l<a;l++)s+=e[l];s/=a;let i=0;for(let l=0;l<a;l++){const c=e[l]-s;i+=c*c}i/=a;const o=1/Math.sqrt(i+n),u=new Float32Array(a);for(let l=0;l<a;l++)u[l]=(e[l]-s)*o*t[l]+r[l];return u}function $a(e,t,r){const n=new Float32Array(e.length);for(let a=0;a<t;a++){const s=a*r;let i=-1e30;for(let u=0;u<r;u++)e[s+u]>i&&(i=e[s+u]);let o=0;for(let u=0;u<r;u++)n[s+u]=Math.exp(e[s+u]-i),o+=n[s+u];for(let u=0;u<r;u++)n[s+u]/=o}return n}function Ea(e,t,r,n=1e4){const a=new Float32Array(e.length);a.set(e);for(let s=0;s<t*r/2;s++){const i=Math.floor(s/(r/2)),o=s%(r/2),u=1/Math.pow(n,o/r),l=i*u,c=Math.cos(l),d=Math.sin(l),m=s*2,f=s*2+1,p=a[m],g=a[f];a[m]=p*c-g*d,a[f]=p*d+g*c}return a}function Aa(e,t,r,n,a,s,i,o,u){const l=a-o+1,c=s-u+1,d=new Float32Array(r*i*l*c);for(let m=0;m<r;m++)for(let f=0;f<i;f++)for(let p=0;p<l;p++)for(let g=0;g<c;g++){let b=0;for(let y=0;y<n;y++)for(let v=0;v<o;v++)for(let h=0;h<u;h++)b+=e[((m*n+y)*a+p+v)*s+g+h]*t[((f*n+y)*o+v)*u+h];d[((m*i+f)*l+p)*c+g]=b}return d}function Pa(e,t,r){const n=new Float32Array(t*r);for(let a=0;a<t;a++)for(let s=0;s<r;s++)n[s*t+a]=e[a*r+s];return n}function Ca(e,t,r,n,a,s){const i=new Float32Array(n*a*s);for(let o=0;o<a;o++)for(let u=0;u<n;u++){const l=u*t/n,c=o*r/a,d=Math.floor(l),m=Math.floor(c),f=Math.min(d+1,t-1),p=Math.min(m+1,r-1),g=l-d,b=c-m;for(let y=0;y<s;y++){const v=e[(m*t+d)*s+y],h=e[(m*t+f)*s+y],S=e[(p*t+d)*s+y],M=e[(p*t+f)*s+y];i[(o*n+u)*s+y]=v*(1-g)*(1-b)+h*g*(1-b)+S*(1-g)*b+M*g*b}}return i}const le=new ua;function ve(e){return N().device.createBindGroupLayout({entries:Array.from({length:e},(r,n)=>({binding:n,visibility:GPUShaderStage.COMPUTE,buffer:n===0?{type:"uniform"}:{type:"storage"}}))})}function Ct(e){const t=N(),r=t.device.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.device.queue.writeBuffer(r,0,e),r}function Ie(e,t,r,n,a,s){const i=N(),o=Ct(a),u=[{binding:0,resource:{buffer:o}},...n.map((d,m)=>({binding:m+1,resource:{buffer:d.buffer.gpuBuffer}}))],l=i.device.createBindGroup({layout:r,entries:u}),c=e.beginComputePass();return c.setPipeline(t),c.setBindGroup(0,l),c.dispatchWorkgroups(s),c.end(),o}async function qe(e,t,r,n,a){const s=N(),i=E.zeros([r,n]),o=ve(4),u=le.getOrCreate("matmul",ca,o),l=new ArrayBuffer(12),c=new Uint32Array(l);c[0]=r,c[1]=n,c[2]=a;const d=s.device.createCommandEncoder();return Ie(d,u,o,[e,t,i],l,Math.ceil(r/16)*Math.ceil(n/16)),s.device.queue.submit([d.finish()]),i}function We(e,t,r,n,a){return ha(e,t,r,n,a)}async function pr(e,t){const r=N(),n=E.zeros([e.shape.size]),a=ve(4),s=le.getOrCreate("add",la,a),i=new ArrayBuffer(4);new Uint32Array(i)[0]=e.shape.size;const o=r.device.createCommandEncoder();return Ie(o,s,a,[e,t,n],i,Math.ceil(e.shape.size/256)),r.device.queue.submit([o.finish()]),n}function mr(e,t){return wa(e,t)}async function gr(e,t){const r=N(),n=E.zeros([e.shape.size]),a=ve(4),s=le.getOrCreate("multiply",da,a),i=new ArrayBuffer(4);new Uint32Array(i)[0]=e.shape.size;const o=r.device.createCommandEncoder();return Ie(o,s,a,[e,t,n],i,Math.ceil(e.shape.size/256)),r.device.queue.submit([o.finish()]),n}function br(e,t){return xa(e,t)}async function yr(e,t,r=1e-6){const n=N(),a=e.shape.size,s=E.zeros([a]),i=ve(4),o=le.getOrCreate("rms_norm",fa,i),u=new ArrayBuffer(8);new Uint32Array(u)[0]=a,new Float32Array(u)[1]=r;const l=n.device.createCommandEncoder();return Ie(l,o,i,[e,t,s],u,1),n.device.queue.submit([l.finish()]),s}function vr(e,t,r=1e-6){return Sa(e,t,r)}async function hr(e,t,r,n=1e-6){const a=N(),s=e.shape.size,i=E.zeros([s]),o=a.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=le.getOrCreate("layer_norm",pa,o),l=new ArrayBuffer(8);new Uint32Array(l)[0]=s,new Float32Array(l)[1]=n;const c=N(),d=Ct(l),m=c.device.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:e.buffer.gpuBuffer}},{binding:2,resource:{buffer:t.buffer.gpuBuffer}},{binding:3,resource:{buffer:r.buffer.gpuBuffer}},{binding:4,resource:{buffer:i.buffer.gpuBuffer}}]}),f=c.device.createCommandEncoder(),p=f.beginComputePass();return p.setPipeline(u),p.setBindGroup(0,m),p.dispatchWorkgroups(1),p.end(),c.device.queue.submit([f.finish()]),i}function wr(e,t,r,n=1e-6){return Ma(e,t,r,n)}async function xr(e,t,r){const n=N(),a=E.zeros([t,r]),s=n.device.createCommandEncoder();s.copyBufferToBuffer(e.buffer.gpuBuffer,0,a.buffer.gpuBuffer,0,t*r*4);const i=ve(2),o=le.getOrCreate("softmax",ma,i),u=new ArrayBuffer(8);new Uint32Array(u)[0]=t,new Uint32Array(u)[1]=r;const l=Ct(u),c=n.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:a.buffer.gpuBuffer}}]}),d=s.beginComputePass();return d.setPipeline(o),d.setBindGroup(0,c),d.dispatchWorkgroups(Math.max(1,Math.ceil(t/256))),d.end(),n.device.queue.submit([s.finish()]),a}function Sr(e,t,r){return $a(e,t,r)}async function Mr(e,t,r,n=1e4){const a=N(),s=E.zeros([t,r]),i=a.device.createCommandEncoder();i.copyBufferToBuffer(e.buffer.gpuBuffer,0,s.buffer.gpuBuffer,0,t*r*4);const o=ve(2),u=le.getOrCreate("rope",ga,o),l=new ArrayBuffer(12);new Uint32Array(l)[0]=t,new Uint32Array(l)[1]=r,new Float32Array(l)[2]=n;const c=Ct(l),d=a.device.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:s.buffer.gpuBuffer}}]}),m=i.beginComputePass();return m.setPipeline(u),m.setBindGroup(0,d),m.dispatchWorkgroups(Math.ceil(t*r/2/256)),m.end(),a.device.queue.submit([i.finish()]),s}function $r(e,t,r,n=1e4){return Ea(e,t,r,n)}async function Er(e,t,r,n,a,s,i,o,u){const l=N(),c=a-o+1,d=s-u+1,m=E.zeros([r,i,c,d]),f=ve(4),p=le.getOrCreate("conv2d",ba,f),g=new ArrayBuffer(36),b=new Uint32Array(g);b[0]=r,b[1]=n,b[2]=a,b[3]=s,b[4]=i,b[5]=o,b[6]=u,b[7]=c,b[8]=d;const y=l.device.createCommandEncoder();return Ie(y,p,f,[e,t,m],g,r*i),l.device.queue.submit([y.finish()]),m}function Ar(e,t,r,n,a,s,i,o,u){return Aa(e,t,r,n,a,s,i,o,u)}async function Pr(e,t,r){const n=N(),a=E.zeros([r,t]),s=ve(3),i=le.getOrCreate("transpose_2d",ya,s),o=new ArrayBuffer(8);new Uint32Array(o)[0]=t,new Uint32Array(o)[1]=r;const u=n.device.createCommandEncoder();return Ie(u,i,s,[e,a],o,Math.ceil(t/16)*Math.ceil(r/16)),n.device.queue.submit([u.finish()]),a}function Cr(e,t,r){return Pa(e,t,r)}async function Ur(e,t,r,n,a,s){const i=N(),o=E.zeros([a*n*s]),u=ve(3),l=le.getOrCreate("interpolate_bilinear",va,u),c=new ArrayBuffer(20),d=new Uint32Array(c);d[0]=t,d[1]=r,d[2]=n,d[3]=a,d[4]=s;const m=i.device.createCommandEncoder();return Ie(m,l,u,[e,o],c,Math.ceil(n/16)*Math.ceil(a/16)),i.device.queue.submit([m.finish()]),o}function Tr(e,t,r,n,a,s){return Ca(e,t,r,n,a,s)}let Ke=null,wt=null;function te(e,t=""){if(!Ke)return;const r=document.createElement("div");r.className=`log-entry ${t}`,r.textContent=e,Ke.appendChild(r),Ke.scrollTop=Ke.scrollHeight}function Q(e,t,r=.001){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++){const a=Math.abs(e[n]-t[n]),s=Math.max(Math.abs(e[n]),Math.abs(t[n]),1e-8);if(a/s>r)return!1}return!0}async function X(e,t,r=20){for(let a=0;a<3;a++)t();const n=[];for(let a=0;a<r;a++){const s=performance.now();t(),n.push(performance.now()-s)}return n.reduce((a,s)=>a+s,0)/n.length}async function Z(e,t,r=20){const n=[];for(let a=0;a<Math.min(5,r);a++)await t();for(let a=0;a<r;a++){const s=performance.now();await t(),n.push(performance.now()-s)}return n.reduce((a,s)=>a+s,0)/n.length}function Ua(e){if(!wt)return;const t=document.createElement("tr");t.innerHTML=`
    <td style="font-weight:600">${e.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${e.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${e.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${e.speedup>=1?"var(--green)":"var(--red)"}">
      ${e.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${e.correct?"badge-pass":"badge-fail"}">${e.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${e.tolerance.toExponential(1)}</td>
  `,wt.appendChild(t)}async function Ta(){Ke.innerHTML="",wt.innerHTML="",te("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),te("Initializing WebGPU...","");let e;try{e=await oa()}catch(n){te(`FATAL: ${n.message}`,"err"),te("WebGPU is not available. Cannot run GPU benchmarks.","err");return}te(`GPU: ${e.adapter.name??"Unknown"}`,"ok"),te(`Running benchmarks...
`,"");const t=[];{const i=E.randn([64,64]),o=E.randn([64,64]),u=await i.readback(),l=await o.readback(),c=await X("matmul 64",()=>We(u,l,64,64,64)),d=await Z("matmul 64",async()=>{(await qe(i,o,64,64,64)).destroy()}),m=await(await qe(i,o,64,64,64)).readback(),f=We(u,l,64,64,64),p=Q(f,m),g=Math.max(...Array.from(f).map((b,y)=>Math.abs(b-m[y])));t.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:c,gpuMs:d,speedup:c/d,correct:p,tolerance:g}),i.destroy(),o.destroy()}{const i=E.randn([256,256]),o=E.randn([256,256]),u=await i.readback(),l=await o.readback(),c=await X("matmul 256",()=>We(u,l,256,256,256),10),d=await Z("matmul 256",async()=>{(await qe(i,o,256,256,256)).destroy()}),m=await(await qe(i,o,256,256,256)).readback(),f=We(u,l,256,256,256),p=Q(f,m),g=Math.max(...Array.from(f).map((b,y)=>Math.abs(b-m[y])));t.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:c,gpuMs:d,speedup:c/d,correct:p,tolerance:g}),i.destroy(),o.destroy()}{const i=E.randn([512,512]),o=E.randn([512,512]),u=await i.readback(),l=await o.readback(),c=await X("matmul 512",()=>We(u,l,512,512,512),5),d=await Z("matmul 512",async()=>{(await qe(i,o,512,512,512)).destroy()}),m=await(await qe(i,o,512,512,512)).readback(),f=We(u,l,512,512,512),p=Q(f,m),g=Math.max(...Array.from(f).map((b,y)=>Math.abs(b-m[y])));t.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:c,gpuMs:d,speedup:c/d,correct:p,tolerance:g}),i.destroy(),o.destroy()}{const a=E.randn([1e6]),s=E.randn([1e6]),i=await a.readback(),o=await s.readback(),u=await X("add 1M",()=>mr(i,o)),l=await Z("add 1M",async()=>{(await pr(a,s)).destroy()}),c=await(await pr(a,s)).readback(),d=mr(i,o),m=Q(d,c),f=Math.max(...Array.from(d).map((p,g)=>Math.abs(p-c[g])));t.push({name:"Add",shape:"[1000000]",cpuMs:u,gpuMs:l,speedup:u/l,correct:m,tolerance:f}),a.destroy(),s.destroy()}{const a=E.randn([1e6]),s=E.randn([1e6]),i=await a.readback(),o=await s.readback(),u=await X("mul 1M",()=>br(i,o)),l=await Z("mul 1M",async()=>{(await gr(a,s)).destroy()}),c=await(await gr(a,s)).readback(),d=br(i,o),m=Q(d,c),f=Math.max(...Array.from(d).map((p,g)=>Math.abs(p-c[g])));t.push({name:"Multiply",shape:"[1000000]",cpuMs:u,gpuMs:l,speedup:u/l,correct:m,tolerance:f}),a.destroy(),s.destroy()}{const a=E.randn([1024]),s=E.ones([1024]),i=await a.readback(),o=await s.readback(),u=await X("rmsnorm",()=>vr(i,o)),l=await Z("rmsnorm",async()=>{(await yr(a,s)).destroy()}),c=await(await yr(a,s)).readback(),d=vr(i,o),m=Q(d,c),f=Math.max(...Array.from(d).map((p,g)=>Math.abs(p-c[g])));t.push({name:"RMSNorm",shape:"[1024]",cpuMs:u,gpuMs:l,speedup:u/l,correct:m,tolerance:f}),a.destroy(),s.destroy()}{const a=E.randn([1024]),s=E.ones([1024]),i=E.zeros([1024]),o=await a.readback(),u=await s.readback(),l=await i.readback(),c=await X("layernorm",()=>wr(o,u,l)),d=await Z("layernorm",async()=>{(await hr(a,s,i)).destroy()}),m=await(await hr(a,s,i)).readback(),f=wr(o,u,l),p=Q(f,m),g=Math.max(...Array.from(f).map((b,y)=>Math.abs(b-m[y])));t.push({name:"LayerNorm",shape:"[1024]",cpuMs:c,gpuMs:d,speedup:c/d,correct:p,tolerance:g}),a.destroy(),s.destroy(),i.destroy()}{const s=E.randn([32,128]),i=await s.readback(),o=await X("softmax",()=>Sr(new Float32Array(i),32,128)),u=await Z("softmax",async()=>{(await xr(E.fromFloat32(new Float32Array(i),[32,128]),32,128)).destroy()}),l=await(await xr(E.fromFloat32(new Float32Array(i),[32,128]),32,128)).readback(),c=Sr(new Float32Array(i),32,128),d=Q(c,l),m=Math.max(...Array.from(c).map((f,p)=>Math.abs(f-l[p])));t.push({name:"Softmax",shape:"[32, 128]",cpuMs:o,gpuMs:u,speedup:o/u,correct:d,tolerance:m}),s.destroy()}{const s=E.randn([16,128]),i=await s.readback(),o=await X("rope",()=>$r(new Float32Array(i),16,128)),u=await Z("rope",async()=>{(await Mr(E.fromFloat32(new Float32Array(i),[16,128]),16,128)).destroy()}),l=await(await Mr(E.fromFloat32(new Float32Array(i),[16,128]),16,128)).readback(),c=$r(new Float32Array(i),16,128),d=Q(c,l),m=Math.max(...Array.from(c).map((f,p)=>Math.abs(f-l[p])));t.push({name:"RoPE",shape:"[16, 128]",cpuMs:o,gpuMs:u,speedup:o/u,correct:d,tolerance:m}),s.destroy()}{const c=E.randn([1,3,16,16]),d=E.randn([4,3,3,3]),m=await c.readback(),f=await d.readback(),p=await X("conv2d",()=>Ar(m,f,1,3,16,16,4,3,3)),g=await Z("conv2d",async()=>{(await Er(c,d,1,3,16,16,4,3,3)).destroy()}),b=await(await Er(c,d,1,3,16,16,4,3,3)).readback(),y=Ar(m,f,1,3,16,16,4,3,3),v=Q(y,b),h=Math.max(...Array.from(y).map((S,M)=>Math.abs(S-b[M])));t.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:p,gpuMs:g,speedup:p/g,correct:v,tolerance:h}),c.destroy(),d.destroy()}{const s=E.randn([256,256]),i=await s.readback(),o=await X("transpose",()=>Cr(i,256,256)),u=await Z("transpose",async()=>{(await Pr(s,256,256)).destroy()}),l=await(await Pr(s,256,256)).readback(),c=Cr(i,256,256),d=Q(c,l),m=Math.max(...Array.from(c).map((f,p)=>Math.abs(f-l[p])));t.push({name:"Transpose",shape:"[256, 256]",cpuMs:o,gpuMs:u,speedup:o/u,correct:d,tolerance:m}),s.destroy()}{const u=E.randn([3072]),l=await u.readback(),c=await X("interp",()=>Tr(l,32,32,64,64,3)),d=await Z("interp",async()=>{(await Ur(u,32,32,64,64,3)).destroy()}),m=await(await Ur(u,32,32,64,64,3)).readback(),f=Tr(l,32,32,64,64,3),p=Q(f,m),g=Math.max(...Array.from(f).map((b,y)=>Math.abs(b-m[y])));t.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:c,gpuMs:d,speedup:c/d,correct:p,tolerance:g}),u.destroy()}te("",""),te("═══ RESULTS ═══","info");for(const n of t){Ua(n);const a=n.correct?"✓":"✗",s=n.correct?"ok":"err";te(`${a} ${n.name} (${n.shape}): CPU ${n.cpuMs.toFixed(2)} ms | GPU ${n.gpuMs.toFixed(2)} ms | ${n.speedup.toFixed(1)}× | max diff ${n.tolerance.toExponential(1)}`,s)}const r=t.filter(n=>n.correct).length;te("",""),te(`═══ ${r}/${t.length} CORRECT ═══`,r===t.length?"ok":"err"),ia()}function Ba(e){e.innerHTML=`
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
  `,Ke=e.querySelector("#bench-log"),wt=e.querySelector("#bench-tbody"),e.querySelector("#btn-run-bench").addEventListener("click",()=>{Ta()})}const ka=Object.freeze(Object.defineProperty({__proto__:null,render:Ba},Symbol.toStringTag,{value:"Module"}));let Se=null,pt="";function Da(e){const t=e.environment,r=e.gpu,n=e.case==="D"?"var(--green)":e.case==="E"?"var(--yellow)":"var(--red)";let a=`
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
    `),r.adapterError&&(a+=`<div class="row"><span class="row-label">Adapter Error</span><span class="row-value" style="color:var(--red)">${r.adapterError}</span></div>`),r.deviceError&&(a+=`<div class="row"><span class="row-label">Device Error</span><span class="row-value" style="color:var(--red)">${r.deviceError}</span></div>`),a+="</div>",r.limits){const s=r.limits,i=o=>o>=1073741824?`${(o/1073741824).toFixed(1)} GB`:o>=1048576?`${(o/1048576).toFixed(1)} MB`:o>=1024?`${(o/1024).toFixed(1)} KB`:`${o} B`;a+=`
      <h3>GPU Limits</h3>
      <div class="card">
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${i(s.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${s.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${s.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${s.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${i(s.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${i(s.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${i(s.maxComputeWorkgroupStorageSize)}</span></div>
        <div class="row"><span class="row-label">Max invocations/wg</span><span class="row-value">${s.maxComputeInvocationsPerWorkgroup}</span></div>
        <div class="row"><span class="row-label">Max workgroup size</span><span class="row-value">${s.maxComputeWorkgroupSizeX}×${s.maxComputeWorkgroupSizeY}×${s.maxComputeWorkgroupSizeZ}</span></div>
        <div class="row"><span class="row-label">Max workgroups/dim</span><span class="row-value">${s.maxComputeWorkgroupsPerDimension}</span></div>
        <div class="row"><span class="row-label">Max color attachments</span><span class="row-value">${s.maxColorAttachments}</span></div>
        <div class="row"><span class="row-label">Storage buf alignment</span><span class="row-value">${s.minStorageBufferOffsetAlignment} B</span></div>
        <div class="row"><span class="row-label">Uniform buf alignment</span><span class="row-value">${s.minUniformBufferOffsetAlignment} B</span></div>
      </div>
    `}return r.features.length>0&&(a+=`
      <h3>Features (${r.features.length})</h3>
      <div class="card">
        ${r.features.map(s=>`<div class="row"><span class="row-value">${s}</span></div>`).join("")}
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
  `,a}function Ra(e){e.innerHTML=`
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;const t=e.querySelector("#wgdiag-result");Se=e.querySelector("#btn-copy-report"),e.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{t.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',Se.disabled=!0;const r=await Pt();pt=Vr(r),t.innerHTML=Da(r),Se.disabled=!1}),Se.addEventListener("click",async()=>{if(pt)try{await navigator.clipboard.writeText(pt),Se.textContent="Copied!",setTimeout(()=>{Se.textContent="Copy Diagnostics"},2e3)}catch{const r=document.createElement("textarea");r.value=pt,document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),Se.textContent="Copied!",setTimeout(()=>{Se.textContent="Copy Diagnostics"},2e3)}}),e.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const Oa=Object.freeze(Object.defineProperty({__proto__:null,render:Ra},Symbol.toStringTag,{value:"Module"})),Na=typeof GPUShaderStage<"u"?GPUShaderStage.COMPUTE:4;function Ga(e,t=Na){return e.map((r,n)=>({binding:n,visibility:t,buffer:{type:r}}))}function Jt(e,t){return e.createBindGroupLayout({entries:Ga(t)})}function Ia(e,t,r="bind group"){if(e.length!==t.length)throw new Error(`${r} binding count mismatch: pipeline layout declares ${e.length} bindings but ${t.length} entries were provided.`)}const Br=new WeakMap,Vt=new WeakMap,jt=new WeakMap,Xr=new WeakSet;let La=1;function Ut(e){let t=Br.get(e);return t===void 0&&(t=La++,Br.set(e,t)),t}function Fa(e,t){Vt.set(e,Ut(t))}function _a(e){return Vt.has(e)?Vt.get(e):null}function za(e,t){jt.set(e,Ut(t))}function qa(e){return jt.has(e)?jt.get(e):null}function Wa(e){Xr.add(e)}function Ha(e){return Xr.has(e)}class z{static instance=null;static getInstance(){return z.instance||(z.instance=new z),z.instance}stagingBuffer=null;currentStagingSize=0;isMapped=!1;isPending=!1;queueDepth=0;lastStatus="IDLE";lastError="";readbackChain=Promise.resolve();acquire(t,r){if(r<=0||r%4!==0)throw new Error(`Invalid readback size: ${r} (must be > 0 and 4-byte aligned)`);if(t.limits&&r>t.limits.maxBufferSize)throw new Error(`Readback size ${r} exceeds device limit maxBufferSize (${t.limits.maxBufferSize})`);if(!this.stagingBuffer||this.currentStagingSize<r){if(this.stagingBuffer){if(this.isMapped){try{this.stagingBuffer.unmap()}catch{}this.isMapped=!1}try{this.stagingBuffer.destroy()}catch{}this.stagingBuffer=null}const n=Math.max(Math.ceil(r/16)*16,16);this.stagingBuffer=t.createBuffer({label:"AETHER_Reusable_Staging_Buffer",size:n,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.currentStagingSize=n}return this.stagingBuffer}copyAndRead(t,r,n,a="Readback"){return this.enqueueReadback(t,async()=>{if(r.size<n)throw new Error(`Copy size ${n} exceeds source buffer size ${r.size}`);const s=this.acquire(t,n);if(s.size<n)throw new Error(`Staging buffer size ${s.size} is smaller than requested copy size ${n}`);const i=t.createCommandEncoder({label:`Encoder_${a}`});i.copyBufferToBuffer(r,0,s,0,n),t.queue.submit([i.finish()]),this.isPending=!0;try{await s.mapAsync(GPUMapMode.READ,0,n),this.isMapped=!0,this.isPending=!1;const o=s.getMappedRange(0,n),u=new Float32Array(o.slice(0));return s.unmap(),this.isMapped=!1,this.lastStatus="PASS",this.lastError="",u}catch(o){this.isPending=!1,this.isMapped=!1,this.lastStatus="FAIL";const u=o,l=u.name||"UnknownError",c=u.message||String(o),d=`mapAsync FAIL [${a}] — ${l}: ${c} (size: ${n}B, srcSize: ${r.size}B, stagingSize: ${s.size}B)`;throw this.lastError=d,console.error(d),new Error(d)}})}readSubmittedCopy(t,r,n,a="ReadbackSubmitted"){return this.enqueueReadback(t,async()=>{this.isPending=!0;try{await r.mapAsync(GPUMapMode.READ,0,n),this.isMapped=!0,this.isPending=!1;const s=r.getMappedRange(0,n),i=new Float32Array(s.slice(0));return r.unmap(),this.isMapped=!1,this.lastStatus="PASS",this.lastError="",i}catch(s){this.isPending=!1,this.isMapped=!1,this.lastStatus="FAIL";const i=s,o=i.name||"UnknownError",u=i.message||String(s),l=`mapAsync FAIL [${a}] — ${o}: ${u} (size: ${n}B, stagingSize: ${r.size}B)`;throw this.lastError=l,console.error(l),new Error(l)}})}enqueueReadback(t,r){this.queueDepth++;const n=this.readbackChain.catch(()=>{}).then(()=>r()).finally(()=>{this.queueDepth=Math.max(0,this.queueDepth-1)});return this.readbackChain=n.then(()=>{},()=>{}),n}release(){if(this.stagingBuffer){if(this.isMapped){try{this.stagingBuffer.unmap()}catch{}this.isMapped=!1}try{this.stagingBuffer.destroy()}catch{}this.stagingBuffer=null,this.currentStagingSize=0}}getDiagnostics(t=!1){return{stagingSize:this.currentStagingSize,isMapped:this.isMapped,isPending:this.isPending,queueDepth:this.queueDepth,lastStatus:this.lastStatus,lastError:this.lastError,deviceLost:t}}}let at=null,De=null,xt=null,Kt=null;async function se(){if(De&&!at&&(De=null),De)return De;if(!navigator.gpu)throw new Error("WebGPU not supported");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=e.features.has("timestamp-query"),r=await e.requestDevice({requiredFeatures:t?["timestamp-query"]:[],requiredLimits:{}});xt=null,Kt=null,r.lost.then(i=>{console.error("Benchmark device lost:",i.reason,i.message),Wa(r),xt=i.reason??"unknown",Kt=i.message??"",at=null,De=null}),at=r;let n=null;try{n=navigator.gpu.getPreferredCanvasFormat()}catch{}const a=e.limits,s=[];for(const i of e.features)s.push(i);return De={webgpuAvailable:!0,adapterName:e.name??"Unknown",adapterVendor:e.vendor??"Unknown",adapterDevice:e.device??"Unknown",adapterFeatures:s,adapterLimits:{maxBufferSize:a.maxBufferSize,maxTextureDimension1D:a.maxTextureDimension1D,maxTextureDimension2D:a.maxTextureDimension2D,maxTextureDimension3D:a.maxTextureDimension3D,maxComputeWorkgroupStorageSize:a.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:a.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:a.maxStorageBufferBindingSize,maxUniformBufferBindingSize:a.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:a.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:a.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:a.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:a.maxComputeWorkgroupsPerDimension,maxColorAttachments:a.maxColorAttachments,minStorageBufferOffsetAlignment:a.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:a.minUniformBufferOffsetAlignment},preferredCanvasFormat:n,maxBufferSize:a.maxBufferSize,maxStorageBufferBindingSize:a.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:a.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:a.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:a.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:a.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:a.maxComputeWorkgroupsPerDimension,timestampQuerySupport:t,isFallbackAdapter:e.isFallbackAdapter??!1},De}function U(){if(!at)throw new Error("Benchmark not initialized. Call initBenchmark() first.");return at}function Va(){return{reason:xt,message:Kt}}function Y(){return xt!==null}async function ja(e,t,r){e.pushErrorScope("validation"),e.pushErrorScope("out-of-memory"),e.pushErrorScope("internal");try{const n=await r(),s=(await Promise.all([e.popErrorScope(),e.popErrorScope(),e.popErrorScope()])).find(i=>i!==null);return{result:n,error:s?s.message:null}}catch(n){return await e.popErrorScope(),await e.popErrorScope(),await e.popErrorScope(),{result:null,error:n.message}}}function F(e){const t=U(),r=t.createBuffer({size:Math.ceil(e.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(r,0,e),r}function $(e,t){const r=U(),n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(t){const a=r.createBuffer({size:Math.max(e,t.byteLength),usage:n,mappedAtCreation:!0});return new Float32Array(a.getMappedRange()).set(t),a.unmap(),a}return r.createBuffer({size:e,usage:n})}async function ye(e,t,r="readbackBuffer"){const n=U();return z.getInstance().copyAndRead(n,e,t,r)}function V(e,t,r){const n=U();if(t.length===0)throw new Error("createPipeline: bindingTypes must be non-empty (uniform / read-only-storage / storage)");const a=Jt(n,t),s=n.createShaderModule({code:e}),i=n.createComputePipeline({layout:n.createPipelineLayout({bindGroupLayouts:[a]}),compute:{module:s,entryPoint:"main"}});Fa(i,n);const o=u=>r?.({bindingTypes:t,compilationMessages:u,pipelineLayoutInspected:!0});return typeof s.getCompilationInfo=="function"&&s.getCompilationInfo().then(u=>o(u.messages)).catch(()=>o([])),i}function q(e,t,r){const n=U();Ia(t,r,"createBindGroupForPipeline");const a=e.getBindGroupLayout(0),s=n.createBindGroup({layout:a,entries:r});return za(s,n),s}const Ye=`
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
`,ut=`
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
`,Zr=`
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
`,er=`
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
`;function Tt(e){return[Math.max(1,Math.ceil(e/64)),1,1]}function tr(e){const t=Math.max(1,Math.ceil(e/64));return{rows:e,workgroupSize:64,workgroupsX:t,totalInvocations:t*64}}function Ka(e){const t=tr(e);if(!(t.totalInvocations>=t.rows&&t.totalInvocations<t.rows+64))throw new Error(`softmax dispatch invariant violated: rows=${t.rows} wgX=${t.workgroupsX} total=${t.totalInvocations} (expected ${t.rows} ≤ total < ${t.rows+64})`);return t}const Jr=`
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
`,Le=-12345,st=`
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
`,Ya=["uniform","read-only-storage","read-only-storage","storage"],rr=["uniform","read-only-storage","read-only-storage","storage"],Qa=["uniform","read-only-storage","read-only-storage","storage"],Xa=["uniform","read-only-storage","storage"],Za=["uniform","read-only-storage","read-only-storage","storage"],en=["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"];function Ja(e,t){try{return e.pushErrorScope(t),!0}catch{return!1}}async function Nt(e,t){let r=null;for(let n=0;n<t;n++)try{const a=await e.popErrorScope();a&&!r&&(r=a)}catch{}return r}async function es(e,t){const r=Ut(e),n=_a(t.pipeline),a=qa(t.bindGroup);if(Ha(e))return{pass:!1,error:"DEVICE LOST — refusing to execute a pipeline on a lost device.",stage:"encode",errorType:"device-lost",mismatch:!1,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a};if(n!==null&&n!==r)return{pass:!1,error:`PIPELINE DEVICE MISMATCH — pipeline device: ${n}, execution device: ${r}. The pipeline was created by a different GPUDevice; refusing to call setPipeline().`,stage:"set-pipeline",errorType:"device-mismatch",mismatch:!0,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a};const s=["validation","out-of-memory","internal"];let i=0;for(const u of s)Ja(e,u)&&i++;let o="encode";try{const u=z.getInstance(),l=u.acquire(e,t.outputBytes);o="encode";const c=e.createCommandEncoder({label:`Enc_${t.name}`}),d=c.beginComputePass();if(o="set-pipeline",d.setPipeline(t.pipeline),a!==null&&a!==r)return await Nt(e,i),{pass:!1,error:`BIND GROUP DEVICE MISMATCH — bind group device: ${a}, execution device: ${r}. The bind group was created by a different GPUDevice; refusing to call setBindGroup().`,stage:"set-bind-group",errorType:"device-mismatch",mismatch:!0,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a};a===null&&console.warn(`[gpu-test] ${t.name}: bind group identity unavailable — continuing (not fabricated).`),o="set-bind-group",d.setBindGroup(0,t.bindGroup),o="dispatch",d.dispatchWorkgroups(...t.workgroups),d.end(),o="submit",c.copyBufferToBuffer(t.outputBuffer,0,l,0,t.outputBytes),e.queue.submit([c.finish()]),o="readback";const m=await u.readSubmittedCopy(e,l,t.outputBytes,t.name),f=await Nt(e,i);if(f)return{pass:!1,error:`GPU Error: ${f.message}`,stage:"submit",errorType:f.type??null,mismatch:!1,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a};o="validation";const p=t.validator(m);return{pass:p.pass,error:p.pass?null:p.error,stage:p.pass?"complete":"validation",errorType:p.pass?null:"output-mismatch",mismatch:!1,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a}}catch(u){return await Nt(e,i),{pass:!1,error:u.message,stage:o,errorType:"exception",mismatch:!1,pipelineDeviceId:n,executionDeviceId:r,bindGroupDeviceId:a}}}function tn(e,t){const r=new Float32Array(e.length);for(let n=0;n<e.length;n++)r[n]=e[n]+t[n];return r}function rn(e,t,r,n,a){const s=new Float32Array(r*n);for(let i=0;i<r;i++)for(let o=0;o<n;o++){let u=0;for(let l=0;l<a;l++)u+=e[i*a+l]*t[l*n+o];s[i*n+o]=u}return s}function nn(e,t,r,n,a,s,i,o,u){const l=a-o+1,c=s-u+1,d=new Float32Array(r*i*l*c);for(let m=0;m<r;m++)for(let f=0;f<i;f++)for(let p=0;p<l;p++)for(let g=0;g<c;g++){let b=0;for(let y=0;y<n;y++)for(let v=0;v<o;v++)for(let h=0;h<u;h++)b+=e[((m*n+y)*a+p+v)*s+g+h]*t[((f*n+y)*o+v)*u+h];d[((m*i+f)*l+p)*c+g]=b}return d}function nr(e,t,r){const n=new Float32Array(e.length);for(let a=0;a<t;a++){const s=a*r;let i=-1e30;for(let u=0;u<r;u++)e[s+u]>i&&(i=e[s+u]);let o=0;for(let u=0;u<r;u++){const l=Math.exp(e[s+u]-i);n[s+u]=l,o+=l}for(let u=0;u<r;u++)n[s+u]/=o}return n}function an(e,t,r){const n=e.length;let a=0;for(let o=0;o<n;o++)a+=e[o]*e[o];const s=Math.sqrt(a/n+r),i=new Float32Array(n);for(let o=0;o<n;o++)i[o]=e[o]/s*t[o];return i}function ar(e,t,r,n,a,s,i){const o=new Float32Array(n*a*s);for(let u=0;u<n;u++)for(let l=0;l<a;l++){const c=[];let d=-1e30;for(let p=0;p<a;p++){let g=0;for(let y=0;y<s;y++)g+=e[(u*a+l)*s+y]*t[(u*a+p)*s+y];const b=g*i;c.push(b),b>d&&(d=b)}let m=0;const f=c.map(p=>{const g=Math.exp(p-d);return m+=g,g});for(let p=0;p<a;p++){const g=f[p]/m;for(let b=0;b<s;b++)o[(u*a+l)*s+b]+=g*r[(u*a+p)*s+b]}}return o}function sn(e,t,r){const n=e.length!==t.length,a=Math.min(e.length,t.length);let s=!0,i=-1,o=0,u=-1,l=null,c=null,d=1/0,m=-1/0,f=1/0,p=-1/0,g=!1;for(let y=0;y<a;y++){const v=e[y],h=t[y];if(!Number.isFinite(v)){s=!1,i<0&&(i=y);continue}h<d&&(d=h),h>m&&(m=h),v<f&&(f=v),v>p&&(p=v),g||(g=!0,u=0,l=h,c=v);const S=Math.abs(v-h);S>o&&(o=S,u=y,l=h,c=v)}if(s){for(let y=a;y<e.length;y++)if(!Number.isFinite(e[y])){s=!1,i=y;break}}const b=!n&&s&&g&&o<=r;return{maxError:o,errorIndex:u,cpuValue:l,gpuValue:c,expectedRange:d===1/0||m===-1/0?null:[d,m],actualRange:f===1/0||p===-1/0?null:[f,p],nonFiniteIndex:i,allFinite:s,lengthMismatch:n,pass:b}}function on(e,t,r){const n=new Float32Array(t);for(let a=0;a<t;a++){let s=0;for(let i=0;i<r;i++)s+=e[a*r+i];n[a]=s}return n}function sr(e,t,r){const n=new ArrayBuffer(16),a=new Uint32Array(n);return a[0]=e>>>0,a[1]=t>>>0,a[2]=r>>>0,a[3]=0,n}function ct(e){const t=new ArrayBuffer(16),r=new Uint32Array(t);return r[0]=e>>>0,r[1]=0,r[2]=0,r[3]=0,t}function un(e,t,r,n,a,s,i,o,u){const l=new ArrayBuffer(48),c=new Uint32Array(l);return c[0]=e>>>0,c[1]=t>>>0,c[2]=r>>>0,c[3]=n>>>0,c[4]=a>>>0,c[5]=s>>>0,c[6]=i>>>0,c[7]=o>>>0,c[8]=u>>>0,c[9]=0,c[10]=0,c[11]=0,l}function cn(e,t){const r=new ArrayBuffer(16),n=new Uint32Array(r);return n[0]=e>>>0,n[1]=t>>>0,n[2]=0,n[3]=0,r}function ln(e,t){const r=new ArrayBuffer(16),n=new Uint32Array(r),a=new Float32Array(r);return n[0]=e>>>0,a[1]=t,n[2]=0,n[3]=0,r}function or(e,t,r,n){const a=new ArrayBuffer(16),s=new Uint32Array(a),i=new Float32Array(a);return s[0]=e>>>0,s[1]=t>>>0,s[2]=r>>>0,i[3]=n,a}function ts(e){const t=new Uint32Array(e),r=new Uint8Array(e),n=Array.from(r.slice(0,16)).map(a=>a.toString(16).padStart(2,"0")).join(" ");console.log("MATMUL UNIFORM DIAGNOSTIC:"),console.log(`M: ${t[0]}`),console.log(`N: ${t[1]}`),console.log(`K: ${t[2]}`),console.log(`Uniform bytes: ${n}`)}function dn(e,t){const r=new Uint32Array(e),n=new Float32Array(e),a=new Uint8Array(e),s=Array.from(a.slice(0,16)).map(o=>o.toString(16).padStart(2,"0")).join(" "),i={batch:r[0],seq:r[1],dim:r[2],scale:n[3]};return console.log("ATTENTION UNIFORM DIAGNOSTIC:"),console.log(`batch: ${i.batch} (expected ${t.batch})`),console.log(`seq: ${i.seq} (expected ${t.seq})`),console.log(`dim: ${i.dim} (expected ${t.dim})`),console.log(`scale: ${i.scale} (expected ${t.scale})`),console.log(`Uniform bytes: ${s}`),i.batch!==t.batch>>>0?`uniform batch ${i.batch} != ${t.batch}`:i.seq!==t.seq>>>0?`uniform seq ${i.seq} != ${t.seq}`:i.dim!==t.dim>>>0?`uniform dim ${i.dim} != ${t.dim}`:Math.abs(i.scale-t.scale)>1e-6?`uniform scale ${i.scale} != ${t.scale}`:null}const Yt=[];let kr=!1;function Bt(){if(!kr)try{U().addEventListener("uncapturederror",t=>{const r=t.error;r&&Yt.push(r.message)}),kr=!0}catch{}}function kt(){const e=Yt.slice();return Yt.length=0,e}function K(e){return $(e.byteLength,e)}function Qe(e,t,r,n){return{config:e,pass:!1,stage:t,errorType:r,errorMessage:n,maxError:-1,errorIndex:-1,cpuValue:null,gpuValue:null,expectedRange:null,actualRange:null,nonFiniteIndex:-1}}async function Fe(e){const t=U();let r=null,n="pipeline",a=null,s=null;try{n="pipeline";const i=V(e.code,e.bindingTypes);n="bind-group";const o=q(i,e.bindingTypes,e.entries),u=await es(t,{name:e.name,pipeline:i,bindGroup:o,workgroups:e.workgroups,outputBuffer:e.outputBuffer,outputBytes:e.outputBytes,validator:p=>(r=p,{pass:!0,error:""})});if(n=u.stage,!u.pass)return{...Qe(e.config,n,u.errorType??"gpu-error",u.error??"GPU execution failed"),pipelineDeviceId:u.pipelineDeviceId,executionDeviceId:u.executionDeviceId,bindGroupDeviceId:u.bindGroupDeviceId,mismatch:u.mismatch};if(r===null)throw new Error("GPU returned no data after readback");n="validation";const l=sn(r,e.reference,e.tolerance),c=e.extraCheck?e.extraCheck(r):null;let d=null,m={};if(e.postValidate)try{const p=await e.postValidate(r);d=p.error,m=p.diag??{}}catch(p){d=p.message}const f=l.pass&&c===null&&d===null;return f||(d!==null?(a="output-incomplete",s=d):l.allFinite?l.lengthMismatch?(a="shape-mismatch",s=`GPU length ${r.length} != CPU reference length ${e.reference.length}`):l.pass?(a="constraint",s=c??"output constraint violated"):(a="output-mismatch",s=`max abs error ${l.maxError.toExponential(3)} at index ${l.errorIndex} (cpu ${l.cpuValue?.toExponential(4)??"n/a"}, gpu ${l.gpuValue?.toExponential(4)??"n/a"})`):(a="non-finite",s=`non-finite output at index ${l.nonFiniteIndex}`)),{config:e.config,pass:f,stage:f?"complete":"validation",errorType:f?null:a,errorMessage:f?null:s,maxError:l.maxError,errorIndex:l.errorIndex,cpuValue:l.cpuValue,gpuValue:l.gpuValue,expectedRange:l.expectedRange,actualRange:l.actualRange,nonFiniteIndex:l.nonFiniteIndex,pipelineDeviceId:u.pipelineDeviceId,executionDeviceId:u.executionDeviceId,bindGroupDeviceId:u.bindGroupDeviceId,mismatch:u.mismatch,...m}}catch(i){return Qe(e.config,n,a??"exception",s??i.message)}finally{try{e.dispose()}catch{}}}function Ge(e,t){const r=t.length>0&&t.every(s=>s.pass),n=t.reduce((s,i)=>Math.max(s,i.maxError),0),a=t.map(s=>`${s.config}:${s.pass?"PASS":"FAIL"}`).join(" ");return{name:e,pass:r,maxError:r?n:-1,details:a,cases:t}}async function rs(e){const t=new Float32Array(e).fill(1),r=new Float32Array(e).fill(2),n=K(t),a=K(r),s=$(e*4),i=F(ct(e));return Fe({name:"VecAdd",config:`N=${e}`,code:Ye,bindingTypes:Ya,workgroups:[Math.ceil(e/64),1,1],entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:s}}],outputBuffer:s,outputBytes:e*4,reference:tn(t,r),tolerance:1e-5,dispose:()=>{n.destroy(),a.destroy(),s.destroy(),i.destroy()}})}async function ns(){const e=[];for(const t of[64,1024,65536])if(e.push(await rs(t)),!e[e.length-1].pass)break;return Ge("VecAdd",e)}async function as(e){const t=new Float32Array(e*e).fill(1),r=new Float32Array(e*e).fill(.5),n=K(t),a=K(r),s=$(e*e*4),i=F(sr(e,e,e));return Fe({name:"Matmul",config:`${e}×${e}`,code:ut,bindingTypes:rr,workgroups:[Math.ceil(e/16),Math.ceil(e/16),1],entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:s}}],outputBuffer:s,outputBytes:e*e*4,reference:rn(t,r,e,e,e),tolerance:.001,dispose:()=>{n.destroy(),a.destroy(),s.destroy(),i.destroy()}})}async function fn(){const e=[];for(const t of[32,64,128])if(e.push(await as(t)),!e[e.length-1].pass)break;return Ge("Matmul",e)}function ss(e){if(e===1){const y=new Float32Array(25);for(let h=0;h<y.length;h++)y[h]=h+1;const v=new Float32Array([1,0,-1,1,0,-1,1,0,-1]);return{config:"5×5→3×3",N:1,C:1,H:5,W:5,F:1,FH:3,FW:3,input:y,kernel:v}}const t=1,r=2,n=3,a=3,s=1,i=2,o=2,u=new Float32Array(t*r*n*a);for(let c=0;c<u.length;c++)u[c]=c+1;const l=new Float32Array(s*r*i*o).fill(1);return{config:"C=2 (channel indexing)",N:t,C:r,H:n,W:a,F:s,FH:i,FW:o,input:u,kernel:l}}async function os(e){const t=ss(e),{N:r,C:n,H:a,W:s,F:i,FH:o,FW:u}=t,l=a-o+1,c=s-u+1,d=r*i*l*c*4,m=K(t.input),f=K(t.kernel),p=$(d),g=F(un(r,n,a,s,i,o,u,l,c));return Fe({name:"Conv2D",config:t.config,code:Zr,bindingTypes:Qa,workgroups:[r,i,l*c],entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}}],outputBuffer:p,outputBytes:d,reference:nn(t.input,t.kernel,r,n,a,s,i,o,u),tolerance:1e-4,dispose:()=>{m.destroy(),f.destroy(),p.destroy(),g.destroy()}})}async function is(){const e=[];for(const t of[1,2])if(e.push(await os(t)),!e[e.length-1].pass)break;return Ge("Conv2D",e)}function us(e){if(e===1)return{rows:2,cols:5,data:new Float32Array([-2,-1,0,1,2,2,1,0,-1,-2])};const t=4,r=16,n=new Float32Array(t*r);for(let a=0;a<n.length;a++)n[a]=a%r*.1-1;return{rows:t,cols:r,data:n}}async function cs(e){const t=us(e),r=t.rows,n=t.cols,a=t.data.byteLength,s=tr(r),i=$(a,t.data),o=$(a),u=F(cn(r,n));return Fe({name:"Softmax",config:`${r}×${n} (wgX=${s.workgroupsX}, total=${s.totalInvocations})`,code:er,bindingTypes:Xa,workgroups:Tt(r),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:i}},{binding:2,resource:{buffer:o}}],outputBuffer:o,outputBytes:a,reference:nr(t.data,r,n),tolerance:1e-4,extraCheck:l=>{for(let d=0;d<l.length;d++)if(l[d]<-1e-6)return`negative softmax output ${l[d].toExponential(3)} at index ${d}`;const c=on(l,r,n);for(let d=0;d<r;d++)if(Math.abs(c[d]-1)>1e-4)return`row ${d} sums to ${c[d].toExponential(3)} (expected ≈ 1)`;return null},dispose:()=>{i.destroy(),o.destroy(),u.destroy()}})}async function ls(){const e=[];for(const t of[1,2])if(e.push(await cs(t)),!e[e.length-1].pass)break;return Ge("Softmax",e)}function ds(e){if(e===1)return{N:8,input:new Float32Array([1,2,3,4,5,6,7,8]),weight:new Float32Array(8).fill(1),eps:1e-6};const t=128,r=new Float32Array(t);for(let n=0;n<t;n++)r[n]=n*37%11*.5+.1;return{N:t,input:r,weight:new Float32Array(t).fill(1),eps:1e-6}}async function fs(e){const t=ds(e),r=t.N,n=K(t.input),a=K(t.weight),s=$(r*4),i=F(ln(r,t.eps));return Fe({name:"RMSNorm",config:`N=${r}`,code:Jr,bindingTypes:Za,workgroups:[1,1,1],entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:s}}],outputBuffer:s,outputBytes:r*4,reference:an(t.input,t.weight,t.eps),tolerance:.001,dispose:()=>{n.destroy(),a.destroy(),s.destroy(),i.destroy()}})}async function ps(){const e=[];for(const t of[1,2])if(e.push(await fs(t)),!e[e.length-1].pass)break;return Ge("RMSNorm",e)}function pn(e,t){return[Math.max(1,Math.ceil(e*t/64)),1,1]}function ms(e,t,r){let n=0,a=null,s=null;const i=new Array(t).fill(!1);for(let l=0;l<e.length;l++)e[l]===Le&&(n++,a===null&&(a=l),s=l,i[Math.floor(l/r)]=!0);let o=0,u=null;for(let l=0;l<t;l++)i[l]?u===null&&(u=l):o++;return{rowsExpected:t,rowsCovered:o,firstMissingRow:u,sentinelCount:n,firstSentinelIndex:a,lastSentinelIndex:s}}function mn(e,t,r){return async n=>{const a=ms(n,e*t,r),s={rowsExpected:a.rowsExpected,rowsCovered:a.rowsCovered,firstMissingRow:a.firstMissingRow,sentinelCount:a.sentinelCount,firstSentinelIndex:a.firstSentinelIndex,lastSentinelIndex:a.lastSentinelIndex};let i=null;return a.sentinelCount>0&&(i=`UNWRITTEN ATTENTION OUTPUT — ${a.sentinelCount} sentinel(s) remain (first @ ${a.firstSentinelIndex}, last @ ${a.lastSentinelIndex}) — rows covered ${a.rowsCovered}/${a.rowsExpected}`+(a.firstMissingRow!==null?`, first missing row ${a.firstMissingRow}`:"")),{error:i,diag:s}}}async function gn(e){const r=U().createShaderModule({code:e});if(typeof r.getCompilationInfo!="function")return null;let n;try{n=await r.getCompilationInfo()}catch(s){return`getCompilationInfo failed: ${s.message}`}const a=n.messages.filter(s=>s.type==="error");return a.length===0?null:a.map(s=>`[line ${s.lineNum}:${s.linePos}] ${s.message}`).join(" | ")}async function gs(){const a=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),s=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),i=new Float32Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]),o=1*4*4,u=1*4*4,l=or(1,4,4,.5),c=dn(l,{batch:1,seq:4,dim:4,scale:.5});if(c)return Qe("Attention 4x4 Identity (b1-s4-d4)","uniform","uniform-packing",c);const d=await gn(st);if(d)return Qe("Attention 4x4 Identity (b1-s4-d4)","shader-compilation","shader-compilation",d);const m=K(a),f=K(s),p=K(i),g=$(o*4,new Float32Array(o).fill(Le)),b=$(u*4),y=F(l);return Fe({name:"Attention",config:"4x4 Identity (b1-s4-d4)",code:st,bindingTypes:en,workgroups:pn(1,4),entries:[{binding:0,resource:{buffer:y}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}},{binding:4,resource:{buffer:g}},{binding:5,resource:{buffer:b}}],outputBuffer:g,outputBytes:o*4,reference:ar(a,s,i,1,4,4,.5),tolerance:.001,postValidate:mn(1,4,4),dispose:()=>{m.destroy(),f.destroy(),p.destroy(),g.destroy(),b.destroy(),y.destroy()}})}async function bn(e){const n=1/Math.sqrt(64),a=()=>{const h=new Float32Array(1*e*64);for(let S=0;S<h.length;S++)h[S]=(S%64+1)*.1;return h},s=a(),i=a(),o=a(),u=1*e*64,l=1*e*e,c=or(1,e,64,n),d=dn(c,{batch:1,seq:e,dim:64,scale:n});if(d)return Qe(`Attention b1-s${e}-d64`,"uniform","uniform-packing",d);const m=await gn(st);if(m)return Qe(`Attention b1-s${e}-d64`,"shader-compilation","shader-compilation",m);const f=K(s),p=K(i),g=K(o),b=$(u*4,new Float32Array(u).fill(Le)),y=$(l*4),v=F(c);return Fe({name:"Attention",config:`b1-s${e}-d64`,code:st,bindingTypes:en,workgroups:pn(1,e),entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:g}},{binding:4,resource:{buffer:b}},{binding:5,resource:{buffer:y}}],outputBuffer:b,outputBytes:u*4,reference:ar(s,i,o,1,e,64,n),tolerance:.001,postValidate:mn(1,e,64),dispose:()=>{f.destroy(),p.destroy(),g.destroy(),b.destroy(),y.destroy(),v.destroy()}})}async function yn(){const e=[];if(e.push(await gs()),!e[e.length-1].pass)return Ge("Attention",e);for(const t of[4,16,64,128,256])if(e.push(await bn(t)),!e[e.length-1].pass)break;return Ge("Attention",e)}async function bs(e){Bt();const t=[{key:"vectorAdd",name:"VecAdd",fn:ns},{key:"matmul",name:"Matmul",fn},{key:"conv2d",name:"Conv2D",fn:is},{key:"softmax",name:"Softmax",fn:ls},{key:"rmsNorm",name:"RMSNorm",fn:ps},{key:"attention",name:"Attention",fn:yn}],r=[];for(const n of t){if(Y()){r.push({name:n.name,pass:!1,maxError:-1,details:"ABORTED — device lost",cases:[]});break}const a=await n.fn();if(r.push(a),e?.(a),Y())break}return r}const ys=["validation","out-of-memory","internal"];function vn(e){try{if(typeof GPUOutOfMemoryError<"u"&&e instanceof GPUOutOfMemoryError)return"out-of-memory";if(typeof GPUInternalError<"u"&&e instanceof GPUInternalError)return"internal";if(typeof GPUValidationError<"u"&&e instanceof GPUValidationError)return"validation"}catch{}const t=e;return typeof t.name=="string"&&t.name?t.name:"validation"}async function hn(){if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e)throw new Error("No GPU adapter available");const t=await e.requestDevice(),r=[],n={reason:null,message:null};return t.addEventListener("uncapturederror",a=>{const s=a.error;r.push({type:vn(s),message:s.message})}),t.lost.then(a=>{n.reason=a.reason??"unknown",n.message=a.message??""}),{device:t,uncaptured:r,lost:n}}function wn(e){let t=0;for(const r of ys)try{e.pushErrorScope(r),t++}catch{}return t}async function St(e,t){const r=[];for(let n=0;n<t;n++)try{const a=await e.popErrorScope();a&&r.push({type:vn(a),message:a.message})}catch{}return r}async function xn(e,t){try{return{ok:!0,value:await t()}}catch(r){return{ok:!1,stage:e,error:r instanceof Error?r.message:String(r)}}}const vs=`
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
`,Gt=[6,8,10,12];async function hs(){const e={name:"GPU Sanity",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"[6, 8, 10, 12]",actual:null,exception:null};let t=null,r=0,n=!1,a=null;const s=await xn("request-device",()=>hn());if(!s.ok)return e.stage=s.stage,e.errorType="exception",e.errorMessage=s.error,e;t=s.value,e.stage="request-device";try{if(t.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;r=wn(t.device);const u=new Float32Array([1,2,3,4]),l=new Float32Array([5,6,7,8]),c=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const d=t.device.createBuffer({size:16,usage:c,mappedAtCreation:!0});new Float32Array(d.getMappedRange()).set(u),d.unmap();const m=t.device.createBuffer({size:16,usage:c,mappedAtCreation:!0});new Float32Array(m.getMappedRange()).set(l),m.unmap();const f=t.device.createBuffer({size:16,usage:c}),p=t.device.createBuffer({size:16,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});e.stage="create-pipeline";const g=t.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),b=t.device.createComputePipeline({layout:t.device.createPipelineLayout({bindGroupLayouts:[g]}),compute:{module:t.device.createShaderModule({code:vs}),entryPoint:"main"}});e.stage="create-bind-group";const y=t.device.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:f}}]});e.stage="encode-submit";const v=t.device.createCommandEncoder(),h=v.beginComputePass();h.setPipeline(b),h.setBindGroup(0,y),h.dispatchWorkgroups(1,1,1),h.end(),v.copyBufferToBuffer(f,0,p,0,16),t.device.queue.submit([v.finish()]),e.stage="readback",await p.mapAsync(GPUMapMode.READ);const S=new Float32Array(p.getMappedRange().slice(0));p.unmap(),p.destroy(),e.stage="validate-output",e.scopeErrors=await St(t.device,r),n=!0,a=Array.from(S),e.actual=a.join(", "),d.destroy(),m.destroy(),f.destroy()}catch(u){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=u instanceof Error?u.message:String(u)}finally{if(t&&r>0&&!n)try{e.scopeErrors=await St(t.device,r)}catch{}}if(e.uncaptured=t.uncaptured,t.lost.reason&&!e.scopeErrors.length&&!e.errorMessage)return e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;if(e.scopeErrors.length>0)return e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e;if(e.uncaptured.length>0)return e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e;if(e.errorMessage)return e.pass=!1,e;const i=a??[],o=i.length===Gt.length&&Gt.every((u,l)=>Math.abs(i[l]-u)<1e-6);return e.pass=o,o||(e.errorType="output-mismatch",e.errorMessage=`expected [${Gt.join(", ")}], got ${e.actual}`),e}async function ws(){const e={name:"Standalone MatMul 64×64",pass:!1,stage:"",errorType:null,errorMessage:null,scopeErrors:[],uncaptured:[],lost:{reason:null,message:null},expected:"all elements = 32.0",actual:null,exception:null};let t=null,r=0,n=!1,a=null;const s=await xn("request-device",()=>hn());if(!s.ok)return e.stage=s.stage,e.errorType="exception",e.errorMessage=s.error,e;t=s.value,e.stage="request-device";try{if(t.lost.reason)return e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e;r=wn(t.device);const i=64,o=64,u=i*i,l=new Float32Array(u).fill(1),c=new Float32Array(u).fill(.5),d=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;e.stage="create-buffers";const m=t.device.createBuffer({size:l.byteLength,usage:d,mappedAtCreation:!0});new Float32Array(m.getMappedRange()).set(l),m.unmap();const f=t.device.createBuffer({size:c.byteLength,usage:d,mappedAtCreation:!0});new Float32Array(f.getMappedRange()).set(c),f.unmap();const p=t.device.createBuffer({size:u*4,usage:d}),g=t.device.createBuffer({size:u*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),b=new ArrayBuffer(16),y=new Uint32Array(b);y[0]=i,y[1]=i,y[2]=o;const v=t.device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.device.queue.writeBuffer(v,0,b),e.stage="create-pipeline";const h=Jt(t.device,rr),S=t.device.createComputePipeline({layout:t.device.createPipelineLayout({bindGroupLayouts:[h]}),compute:{module:t.device.createShaderModule({code:ut}),entryPoint:"main"}});e.stage="create-bind-group";const M=t.device.createBindGroup({layout:h,entries:[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:p}}]});e.stage="encode-submit";const B=t.device.createCommandEncoder(),R=B.beginComputePass();R.setPipeline(S),R.setBindGroup(0,M),R.dispatchWorkgroups(4,4,1),R.end(),B.copyBufferToBuffer(p,0,g,0,u*4),t.device.queue.submit([B.finish()]),e.stage="readback",await g.mapAsync(GPUMapMode.READ);const I=new Float32Array(g.getMappedRange().slice(0));g.unmap(),g.destroy(),e.stage="validate-output",e.scopeErrors=await St(t.device,r),n=!0,a=0;for(let L=0;L<u;L++)a=Math.max(a,Math.abs(I[L]-32));e.actual=`max err = ${a.toExponential(2)}`,m.destroy(),f.destroy(),p.destroy(),v.destroy()}catch(i){e.stage=e.stage||"unknown",e.errorType="exception",e.errorMessage=i instanceof Error?i.message:String(i)}finally{if(t&&r>0&&!n)try{e.scopeErrors=await St(t.device,r)}catch{}}return e.uncaptured=t.uncaptured,t.lost.reason&&!e.scopeErrors.length&&!e.errorMessage?(e.pass=!1,e.stage="device-lost",e.errorType="device-lost",e.errorMessage=`${t.lost.reason}: ${t.lost.message??""}`,e):e.scopeErrors.length>0?(e.pass=!1,e.errorType=e.scopeErrors[0].type,e.errorMessage=e.scopeErrors[0].message,e):e.uncaptured.length>0?(e.pass=!1,e.errorType=e.uncaptured[0].type,e.errorMessage=e.uncaptured[0].message,e):e.errorMessage?(e.pass=!1,e):(e.pass=a!==null&&a<.001,e.pass||(e.errorType="output-mismatch",e.errorMessage=`expected all elements = 32.0, got ${e.actual}`),e)}function Dr(e){try{if(typeof GPUOutOfMemoryError<"u"&&e instanceof GPUOutOfMemoryError)return"out-of-memory";if(typeof GPUInternalError<"u"&&e instanceof GPUInternalError)return"internal";if(typeof GPUValidationError<"u"&&e instanceof GPUValidationError)return"validation"}catch{}const t=e;return typeof t.name=="string"&&t.name?t.name:"validation"}function xs(e,t){try{return e.pushErrorScope(t),!0}catch{return!1}}async function Sn(e){const t=e,r=e,n=e,a=t*t,s=r*1*.5,i=Math.ceil(t/16),o={name:`Minimal Harness MatMul ${t}×${t}`,size:t,pass:!1,stage:"request-device",errorType:null,errorMessage:null,stageResults:{pipeline:!1,"bind-group":!1,dispatch:!1,submission:!1,readback:!1,validation:!1},compilationMessages:[],gpuError:null,uncaptured:[],expected:s,actualMin:null,actualMax:null,maxError:null,nonFinite:0,first16:[],exception:null},u=U();let l=null,c=null,d=null,m=null,f=null,p=null;const g=[];p=h=>{const S=h.error;S&&g.push({type:Dr(S),message:S.message})},u.addEventListener("uncapturederror",p);const b=[];for(const h of["validation","out-of-memory","internal"])xs(u,h)&&b.push(h);let y=null,v=!1;try{o.stage="create-shader-module";const h=u.createShaderModule({code:ut});if(o.stage="shader-compilation",typeof h.getCompilationInfo=="function"){let xe;try{xe=await h.getCompilationInfo()}catch(fe){o.compilationMessages.push(`getCompilationInfo failed: ${fe.message}`),xe={messages:[]}}if(o.compilationMessages=xe.messages.map(fe=>`${fe.type}: ${fe.message}`),xe.messages.some(fe=>fe.type==="error"))return o.stage="shader-compilation",o.errorType="shader-compilation",o.errorMessage=o.compilationMessages.join(" | "),o}else o.compilationMessages.push("getCompilationInfo unavailable");o.stageResults.pipeline=!1,o.stage="create-buffers";const S=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,M=new Float32Array(a).fill(1),B=new Float32Array(a).fill(.5);l=u.createBuffer({size:M.byteLength,usage:S,mappedAtCreation:!0}),new Float32Array(l.getMappedRange()).set(M),l.unmap(),c=u.createBuffer({size:B.byteLength,usage:S,mappedAtCreation:!0}),new Float32Array(c.getMappedRange()).set(B),c.unmap(),d=u.createBuffer({size:a*4,usage:S}),o.stage="create-uniform";const R=new ArrayBuffer(16),I=new Uint32Array(R);I[0]=n,I[1]=t,I[2]=r,m=u.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u.queue.writeBuffer(m,0,R),o.stage="create-pipeline";const L=Jt(u,rr),W=u.createComputePipeline({layout:u.createPipelineLayout({bindGroupLayouts:[L]}),compute:{module:h,entryPoint:"main"}});o.stageResults.pipeline=!0,o.stage="create-bind-group";const ze=u.createBindGroup({layout:L,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:c}},{binding:3,resource:{buffer:d}}]});o.stageResults["bind-group"]=!0,o.stage="create-staging",f=u.createBuffer({size:a*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),o.stage="encode";const we=u.createCommandEncoder(),ee=we.beginComputePass();o.stage="set-pipeline",ee.setPipeline(W),o.stage="set-bind-group",ee.setBindGroup(0,ze),o.stage="dispatch",ee.dispatchWorkgroups(i,i,1),ee.end(),o.stageResults.dispatch=!0,o.stage="submit",we.copyBufferToBuffer(d,0,f,0,a*4),u.queue.submit([we.finish()]),o.stageResults.submission=!0,o.stage="readback",await f.mapAsync(GPUMapMode.READ);const de=new Float32Array(f.getMappedRange().slice(0));f.unmap(),o.stageResults.readback=!0,o.stage="validation";let O=1/0,lt=-1/0,dt=0,Ot=0;for(let xe=0;xe<a;xe++){const ke=de[xe];if(!Number.isFinite(ke)){Ot++;continue}ke<O&&(O=ke),ke>lt&&(lt=ke);const fe=Math.abs(ke-s);fe>dt&&(dt=fe)}o.actualMin=Number.isFinite(O)?O:null,o.actualMax=Number.isFinite(lt)?lt:null,o.maxError=dt,o.nonFinite=Ot,o.first16=Array.from(de.slice(0,16)),o.stageResults.validation=Ot===0&&dt<.001,f.destroy(),f=null}catch(h){o.pass=!1,o.stage=o.stage||"unknown",o.errorType="exception",o.exception=h instanceof Error?h.message:String(h),o.errorMessage=o.exception}finally{if(!v){for(const h of b.slice().reverse())try{const S=await u.popErrorScope();S&&!y&&(y={type:Dr(S),message:S.message})}catch{}v=!0}o.gpuError=y?`${y.type}: ${y.message}`:null,p&&(u.removeEventListener("uncapturederror",p),p=null);try{l?.destroy()}catch{}try{c?.destroy()}catch{}try{d?.destroy()}catch{}try{m?.destroy()}catch{}try{f?.destroy()}catch{}}return o.errorMessage?(o.pass=!1,o):y?(o.pass=!1,o.stage="gpu-error",o.errorType=y.type,o.errorMessage=`GPU Error: ${y.message}`,o):g.length?(o.pass=!1,o.stage="uncaptured",o.errorType="uncaptured-error",o.errorMessage=g.map(h=>`${h.type}: ${h.message}`).join(" | "),o):(o.uncaptured=g.map(h=>`${h.type}: ${h.message}`),o.pass=o.stageResults.validation,o.pass||(o.stage="validation",o.errorType="output-mismatch",o.errorMessage=`expected all elements = ${s} (min ${s}, max ${s}, nonFinite 0), got range [${o.actualMin}, ${o.actualMax}], maxErr ${o.maxError?.toExponential(2)}, nonFinite ${o.nonFinite}`),o.pass&&(o.stage="complete"),o)}async function Ss(){const e=U(),t=Ut(e),r=await Sn(64);return{name:"Shared-Device Direct MatMul 64×64",pass:r.pass,stage:r.stage||"complete",errorType:r.errorType,errorMessage:r.errorMessage,maxError:r.maxError,executionDeviceId:t,pipelineDeviceId:t,bindGroupDeviceId:t,mismatch:!1}}function Mn(...e){for(const t of e)if(t)return t}const vt=Mn("76b46753bb424220e975db024e3b67994d52dfba"),$n=Mn("2026-09-08T04:28:57.771Z"),Xe=vt??$n??`dev-${Date.now().toString(36)}`,Mt=vt&&/^[0-9a-f]{40}$/.test(vt)?vt:null,ot=$n??"";function Ms(e,t,r,n,a){const s=e.length,i=[...e].sort((c,d)=>c-d),o=s>0?e.reduce((c,d)=>c+d,0)/s:0,u=s>0?i[Math.floor(s/2)]:0,l=s>0?e.reduce((c,d)=>c+(d-o)*(d-o),0)/s:0;return{mode:t,iterations:s,warmup:n,avgMs:o,medianMs:u,minMs:s>0?i[0]:0,maxMs:s>0?i[s-1]:0,stdDevMs:Math.sqrt(l),samplesMs:i,note:a}}class $s{device;_mode;_querySet=null;_resolve=null;_periodNs=1;_fallbackLogged=null;constructor(t){this.device=t;const r=this.tryEnableTimestamps(t);this._mode=r?"GPU_TIMESTAMP":"END_TO_END"}tryEnableTimestamps(t){return!1}get mode(){return this._mode}get fallbackNote(){return this._fallbackLogged}async measure(t,r){const n=r.warmup??3;for(let s=0;s<n;s++)this.dispatchPass(t),await this.sync();const a=[];for(let s=0;s<r.iterations;s++){let i;if(this._mode==="GPU_TIMESTAMP"){const o=await this.measureTimestampPass(t);o===null?(this.fallback("timestamp query returned zero/undefined values — switched to END_TO_END"),i=await this.measureEndToEnd(t,r.wait)):i=o}else i=await this.measureEndToEnd(t,r.wait);a.push(i)}return Ms(a,this._mode,r.iterations,n,this._fallbackLogged??void 0)}dispatchPass(t,r){const n=this.device.createCommandEncoder(),a=n.beginComputePass(r?{timestampWrites:r}:void 0);return t(a),a.end(),n}async timeOne(t,r){if(this._mode==="GPU_TIMESTAMP"){const n=await this.measureTimestampPass(t);if(n!==null)return n;this.fallback("timestamp query returned zero/undefined values — switched to END_TO_END")}return this.measureEndToEnd(t,r)}async measureTimestampPass(t){if(!this._querySet||!this._resolve)return null;try{const r=this.dispatchPass(t,{querySet:this._querySet,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1});r.resolveQuerySet(this._querySet,0,2,this._resolve,0),this.device.queue.submit([r.finish()]);const n=await z.getInstance().copyAndRead(this.device,this._resolve,16,"measureTimestampPass"),a=new BigUint64Array(n.buffer),s=Number(a[1]-a[0]);return s>0?s*this._periodNs/1e6:null}catch{return null}}async measureEndToEnd(t,r){const n=performance.now(),a=this.dispatchPass(t);return this.device.queue.submit([a.finish()]),r?await r():await this.sync(),performance.now()-n}async sync(){try{const t=this.device.createBuffer({size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});await z.getInstance().copyAndRead(this.device,t,4,"sync"),t.destroy()}catch{await new Promise(t=>setTimeout(t,16))}}fallback(t){this._fallbackLogged||(this._fallbackLogged=t),this._mode="END_TO_END";try{this._querySet?.destroy(),this._resolve?.destroy()}catch{}this._querySet=null,this._resolve=null}destroy(){try{this._querySet?.destroy(),this._resolve?.destroy()}catch{}this._querySet=null,this._resolve=null}}const Rr=["uniform","read-only-storage","read-only-storage","storage"],Or=["uniform","read-only-storage","read-only-storage","storage"],Es=`
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
`,As=`
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
`;function $t(e,t){return{value:e/(t/1e3)/1e9,unit:"GFLOPS"}}function Ps(e,t){return{value:e/(t/1e3)/1e9,unit:"GB/s (estimate)"}}function Dt(e){for(let t=0;t<e.length;t++)if(!Number.isFinite(e[t]))return!1;return!0}function Cs(e){for(let t=0;t<e.length;t++)if(e[t]===Le)return t;return-1}function Us(e){return`rows=${e.rows} wgSize=${e.workgroupSize} wgX=${e.workgroupsX} total=${e.totalInvocations}`}function Ts(e,t,r){let n=0;for(let a=0;a<t;a++){let s=0;for(let i=0;i<r;i++)s+=e[a*r+i];n=Math.max(n,Math.abs(s-1))}return{ok:n<=.01,maxDev:n}}function Bs(e){let t=0;for(let r=0;r<e.length;r++)e[r]===Le&&t++;return t}function oe(e,t){let r=0;const n=Math.min(e.length,t.length);for(let a=0;a<n;a++)r=Math.max(r,Math.abs(e[a]-t[a]));return r}function re(e,t,r,n){return new Error(`${e} ${t}: ${r} (${n}) — fix correctness before benchmarking`)}function tt(e,t,r,n,a){if(!Dt(r))throw re(e,t,"non-finite output","");if(r.length!==n.length)throw re(e,t,"length mismatch",`${r.length} vs ${n.length}`);const s=oe(r,n);if(s>Math.max(a,oe(n,new Float32Array(n.length))*.01))throw re(e,t,`correctness check failed (maxErr=${s.toExponential(2)})`,"")}async function H(e,t,r,n,a,s="dispatchToAndRead"){const i=U(),o=z.getInstance(),u=o.acquire(i,a),l=i.createCommandEncoder({label:`Enc_${s}`}),c=l.beginComputePass();return c.setPipeline(e),c.setBindGroup(0,t),c.dispatchWorkgroups(r[0],r[1],r[2]),c.end(),l.copyBufferToBuffer(n,0,u,0,a),i.queue.submit([l.finish()]),o.readSubmittedCopy(i,u,a,s)}function ge(e,t,r="waitFor"){return async()=>{const n=U();await z.getInstance().copyAndRead(n,e,t,r)}}function ae(e){let t=2654435769;for(let r=0;r<e.length;r++)t=t*1664525+1013904223>>>0,e[r]=t%2001/1e3-1}function be(e,t,r,n,a,s){return{id:e,name:t,size:r,timingMode:n.mode,iterations:n.iterations,warmup:n.warmup,medianMs:n.medianMs,averageMs:n.avgMs,minMs:n.minMs,maxMs:n.maxMs,stdDevMs:n.stdDevMs,throughput:a,note:s}}const ks=[{size:128,iterations:12,validate:!0},{size:256,iterations:12,validate:!0},{size:512,iterations:10,validate:!1},{size:1024,iterations:10,validate:!1}];async function Ds(e,t){const r=[];for(const n of ks){const a=n.size;if(t&&!t.has(`matmul-${a}`))continue;const s=a*a*4,i=new Float32Array(a*a),o=new Float32Array(a*a);ae(i),ae(o);const u=$(s,i),l=$(s,o),c=$(s),d=sr(a,a,a);ts(d);const m=F(d),f=V(ut,["uniform","read-only-storage","read-only-storage","storage"]),p=q(f,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]),g=[a/16,a/16,1];try{const b=await H(f,p,g,c,s,`matmul-${a}`);if(n.validate){const v=rn(i,o,a,a,a);tt("matmul",`${a}×${a}`,b,v,.01)}else if(!Dt(b))throw re("matmul",`${a}×${a}`,"non-finite output","");const y=await e.measure(v=>{v.setPipeline(f),v.setBindGroup(0,p),v.dispatchWorkgroups(g[0],g[1],g[2])},{iterations:n.iterations,wait:ge(c,s,`matmul-${a}`)});r.push(be(`matmul-${a}`,"Matrix Multiply",`${a}×${a}`,y,$t(2*a*a*a,y.medianMs)))}finally{u.destroy(),l.destroy(),c.destroy(),m.destroy()}}return r}const Rs=[{n:1e3,iterations:12},{n:16e3,iterations:12},{n:64e3,iterations:12},{n:262144,iterations:10},{n:1048576,iterations:10},{n:4194304,iterations:8}];async function Os(e,t){const r=[];for(const n of Rs){const a=n.n;if(t&&!t.has(`vecadd-${a}`))continue;const s=a*4,i=new Float32Array(a),o=new Float32Array(a);ae(i),ae(o);const u=$(s,i),l=$(s,o),c=$(s),d=F(ct(a)),m=V(Ye,["uniform","read-only-storage","read-only-storage","storage"]),f=q(m,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]),g=[Math.ceil(a/64),1,1];try{const b=await H(m,f,g,c,s,`vecadd-${a}`),y=tn(i,o);tt("vecadd",`${a.toLocaleString("en-US")} elements`,b,y,.01);const v=await e.measure(h=>{h.setPipeline(m),h.setBindGroup(0,f),h.dispatchWorkgroups(g[0],g[1],g[2])},{iterations:n.iterations,wait:ge(c,s,`vecadd-${a}`)});r.push(be(`vecadd-${a}`,"Vector Add",`${a.toLocaleString("en-US")} elements`,v,Ps(3*a*4,v.medianMs)))}finally{u.destroy(),l.destroy(),c.destroy(),d.destroy()}}return r}const Ns=[{inputChannels:1,outputChannels:1,rows:32,cols:32,iterations:10},{inputChannels:1,outputChannels:8,rows:64,cols:64,iterations:8},{inputChannels:1,outputChannels:16,rows:128,cols:128,iterations:6}];async function Gs(e,t){const r=[];for(const n of Ns){const a=n.inputChannels,s=n.rows,i=n.cols,o=n.outputChannels,u=3,l=3,c=s-u+1,d=i-l+1,m=o*c*d*4,f=new Float32Array(a*s*i),p=new Float32Array(o*a*u*l);ae(f),ae(p);const g=$(a*s*i*4,f),b=$(o*a*u*l*4,p),y=$(m),v=F(un(1,a,s,i,o,u,l,c,d)),h=V(Zr,["uniform","read-only-storage","read-only-storage","storage"]),S=q(h,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:v}},{binding:1,resource:{buffer:g}},{binding:2,resource:{buffer:b}},{binding:3,resource:{buffer:y}}]),M=c*d,B=[1,o,M];try{const R=await H(h,S,B,y,m,`conv2d-${a}-${o}-${s}`),I=nn(f,p,1,a,s,i,o,u,l);tt("conv2d",`${a}×${s}×${i} → ${o}×${c}×${d}`,R,I,.001);const L=await e.measure(W=>{W.setPipeline(h),W.setBindGroup(0,S),W.dispatchWorkgroups(B[0],B[1],B[2])},{iterations:n.iterations,wait:ge(y,m,`conv2d-${a}-${o}-${s}`)});r.push(be(`conv2d-${a}-${o}-${s}`,"Convolution 3×3",`${a}→${o} ch, ${s}×${i} → ${c}×${d}`,L))}finally{g.destroy(),b.destroy(),y.destroy(),v.destroy()}}return r}const Is=[{rows:128,cols:128,iterations:12},{rows:256,cols:256,iterations:12},{rows:512,cols:512,iterations:10}];async function Ls(e,t){const r=[];for(const n of Is){const{rows:a,cols:s,iterations:i}=n;if(t&&!t.has(`softmax-${a}`))continue;const o=new Float32Array(a*s);ae(o);const u=a*s*4,l=$(u,o),c=$(u),d=F(cn(a,s)),m=V(er,["uniform","read-only-storage","storage"]),f=q(m,["uniform","read-only-storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:c}}]),p=Tt(a);try{const g=await H(m,f,p,c,u,`softmax-${a}`),b=nr(o,a,s);tt("softmax",`${a}×${s}`,g,b,.001);const y=await e.measure(v=>{v.setPipeline(m),v.setBindGroup(0,f),v.dispatchWorkgroups(p[0],p[1],p[2])},{iterations:i,wait:ge(c,u,`softmax-${a}`)});r.push(be(`softmax-${a}`,"Softmax",`${a}×${s}`,y))}finally{l.destroy(),c.destroy(),d.destroy()}}return r}const Fs=[{size:256,iterations:12},{size:512,iterations:12},{size:1024,iterations:12},{size:2048,iterations:10},{size:4096,iterations:10}];async function _s(e,t){const r=[];for(const n of Fs){const{size:a,iterations:s}=n;if(t&&!t.has(`rmsnorm-${a}`))continue;const i=new Float32Array(a);ae(i);const o=new Float32Array(a);for(let y=0;y<a;y++)o[y]=1+y%7*.01;const u=1e-6,l=a*4,c=$(l,i),d=$(l,o),m=$(l),f=F(ln(a,u)),p=V(Jr,["uniform","read-only-storage","read-only-storage","storage"]),g=q(p,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:d}},{binding:3,resource:{buffer:m}}]),b=[1,1,1];try{const y=await H(p,g,b,m,l,`rmsnorm-${a}`),v=an(i,o,u);tt("rmsnorm",String(a),y,v,.001);const h=await e.measure(S=>{S.setPipeline(p),S.setBindGroup(0,g),S.dispatchWorkgroups(b[0],b[1],b[2])},{iterations:s,wait:ge(m,l,`rmsnorm-${a}`)});r.push(be(`rmsnorm-${a}`,"RMSNorm",String(a),h))}finally{c.destroy(),d.destroy(),m.destroy(),f.destroy()}}return r}const zs=[{seq:128,iterations:10,validate:!0},{seq:256,iterations:10,validate:!0},{seq:512,iterations:8,validate:!0},{seq:1024,iterations:6,validate:!1}];function qs(e,t,r=1){const n=new Float32Array(r*e*t),a=new Float32Array(r*e*t),s=new Float32Array(r*e*t);ae(n),ae(a),ae(s);const i=1/Math.sqrt(t),o=new Float32Array(r*e*e);for(let c=0;c<r;c++)for(let d=0;d<e;d++)for(let m=0;m<e;m++){let f=0;for(let p=0;p<t;p++)f+=n[(c*e+d)*t+p]*a[(c*e+m)*t+p];o[c*e*e+d*e+m]=f*i}const u=nr(o,r*e,e),l=ar(n,a,s,r,e,t,i);return{Q:n,K:a,V:s,scores:o,probs:u,out:l}}async function Ws(e,t){const r=[],n={};for(const a of zs){const{seq:s,iterations:i}=a;if(t&&!t.includes(s))continue;const o=64,u=1,l=s*s*4;if(s*s>1<<24){r.push(mt(`attention-${s}`,"Attention (single pass)",`seq=${s} dim=64 batch=1`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")),n[`seq=${s}`]=[mt(`attention-skip-${s}`,"Attention phases",`seq=${s}`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")];continue}let c;try{c=await En(s,o,u)}catch{r.push(mt(`attention-${s}`,"Attention (single pass)",`seq=${s} dim=64 batch=1 scores=${(l/(1024*1024)).toFixed(1)} MiB`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")),n[`seq=${s}`]=[mt(`attention-skip-${s}`,"Attention phases",`seq=${s}`,"SKIPPED — UNSAFE MEMORY REQUIREMENT")];continue}try{const d=[Math.max(1,Math.ceil(u*s/64)),1,1],m=await H(c.pipelines.total,c.groups.total,d,c.bufs.out,s*o*4,`attention-${s}`),f=Cs(m);if(f>=0){const g=Math.floor(f/o);throw re("attention",`seq=${s}`,"UNWRITTEN ATTENTION OUTPUT",`sentinel remains @ index ${f} (row ${g}); rows not fully written — fix correctness before benchmarking`)}if(a.validate)tt("attention",`seq=${s}`,m,c.ref.out,.01);else if(!Dt(m))throw re("attention",`seq=${s}`,"non-finite output","");const p=await e.measure(g=>{g.setPipeline(c.pipelines.total),g.setBindGroup(0,c.groups.total),g.dispatchWorkgroups(d[0],d[1],d[2])},{iterations:i,wait:ge(c.bufs.out,s*o*4,`attention-${s}`)});r.push(be(`attention-${s}`,"Attention (single pass)",`seq=${s} dim=64 batch=1`,p,$t(4*s*s*o,p.medianMs),"QK^T + softmax + PV in one pass")),n[`seq=${s}`]=await Hs(e,c,s,o,i)}finally{try{c.bufs.q.destroy(),c.bufs.k.destroy(),c.bufs.v.destroy(),c.bufs.out.destroy(),c.bufs.scores.destroy(),c.bufs.probs.destroy()}catch{}}}return{main:r,phases:n}}async function Hs(e,t,r,n,a){const s=t.batch,i=[Math.ceil(r/64),s,1],o=[Math.ceil(r/64),n,s],u=Tt(r),l=tr(r),c=r*r*4,d=r*n*4;for(let f=0;f<3;f++)await H(t.pipelines.qkt,t.groups.qkt,i,t.bufs.scores,c,"warmup-qkt"),await H(t.pipelines.soft,t.groups.soft,u,t.bufs.probs,c,"warmup-soft"),await H(t.pipelines.pv,t.groups.pv,o,t.bufs.out,d,"warmup-pv");const m=[];{const f=await H(t.pipelines.qkt,t.groups.qkt,i,t.bufs.scores,c,`qkt-${r}`);if(oe(f,t.ref.scores)>.01)throw re("attention.qkt",`seq=${r}`,"phase correctness check failed",`maxErr=${oe(f,t.ref.scores).toExponential(2)}`);const p=[];for(let g=0;g<a;g++)p.push(await e.timeOne(b=>{b.setPipeline(t.pipelines.qkt),b.setBindGroup(0,t.groups.qkt),b.dispatchWorkgroups(i[0],i[1],i[2])},ge(t.bufs.scores,c,`qkt-${r}`)));m.push(be(`attention-qkt-${r}`,"QK^T (scores)",`seq=${r} dim=64`,It(p,e.mode),$t(2*r*r*n,Nr(p))))}{const f=[];for(let b=0;b<a;b++)await H(t.pipelines.qkt,t.groups.qkt,i,t.bufs.scores,c,`soft-prep-${r}`),f.push(await e.timeOne(y=>{y.setPipeline(t.pipelines.soft),y.setBindGroup(0,t.groups.soft),y.dispatchWorkgroups(u[0],u[1],u[2])},ge(t.bufs.probs,c,`soft-${r}`)));const p=await z.getInstance().copyAndRead(U(),t.bufs.probs,c,`soft-val-${r}`);if(p.length!==t.ref.probs.length||!Dt(p))throw re("attention.softmax",`seq=${r}`,"softmax output invalid",`len=${p.length}`);if(oe(p,t.ref.probs)>.01)throw re("attention.softmax",`seq=${r}`,"phase correctness check failed",`maxErr=${oe(p,t.ref.probs).toExponential(2)}`);const g=Ts(p,r,r);if(!g.ok)throw re("attention.softmax",`seq=${r}`,"softmax row sums deviate from 1",`max dev=${g.maxDev.toExponential(3)}`);m.push(be(`attention-softmax-${r}`,"Softmax on scores",`seq=${r} rows=${r} ${Us(l)}`,It(f,e.mode)))}{const f=[];for(let g=0;g<a;g++)await H(t.pipelines.qkt,t.groups.qkt,i,t.bufs.scores,c,`pv-prep1-${r}`),await H(t.pipelines.soft,t.groups.soft,u,t.bufs.probs,c,`pv-prep2-${r}`),f.push(await e.timeOne(b=>{b.setPipeline(t.pipelines.pv),b.setBindGroup(0,t.groups.pv),b.dispatchWorkgroups(o[0],o[1],o[2])},ge(t.bufs.out,d,`pv-${r}`)));const p=await z.getInstance().copyAndRead(U(),t.bufs.out,d,`pv-val-${r}`);if(oe(p,t.ref.out)>.01)throw re("attention.pv",`seq=${r}`,"phase correctness check failed",`maxErr=${oe(p,t.ref.out).toExponential(2)}`);m.push(be(`attention-pv-${r}`,"Softmax × V",`seq=${r} dim=64`,It(f,e.mode),$t(2*r*r*n,Nr(f))))}return m}function mt(e,t,r,n){return{id:e,name:t,size:r,timingMode:"END_TO_END",iterations:0,warmup:0,medianMs:0,averageMs:0,minMs:0,maxMs:0,stdDevMs:0,note:n}}function It(e,t){const r=[...e].sort((i,o)=>i-o),n=e.reduce((i,o)=>i+o,0)/Math.max(e.length,1),a=r[Math.floor(r.length/2)]??0,s=e.reduce((i,o)=>i+(o-n)**2,0)/Math.max(e.length,1);return{mode:t,iterations:e.length,warmup:3,medianMs:a,avgMs:n,minMs:r[0]??0,maxMs:r[r.length-1]??0,stdDevMs:Math.sqrt(s)}}function Nr(e){const t=[...e].sort((r,n)=>r-n);return t[Math.floor(t.length/2)]??0}async function En(e,t,r){const n=qs(e,t,r),a=1/Math.sqrt(t),s=$(e*t*4,n.Q),i=$(e*t*4,n.K),o=$(e*t*4,n.V),u=$(e*t*4,new Float32Array(e*t).fill(Le)),l=$(e*e*4),c=$(e*e*4),d=F(or(r,e,t,a)),m=V(st,["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"]),f=V(Es,[...Rr]),p=V(er,["uniform","read-only-storage","storage"]),g=V(As,[...Or]),b=q(m,["uniform","read-only-storage","read-only-storage","read-only-storage","storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:o}},{binding:4,resource:{buffer:u}},{binding:5,resource:{buffer:l}}]),y=q(f,Rr,[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:l}}]),v=q(p,["uniform","read-only-storage","storage"],[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:c}}]),h=q(g,Or,[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:u}}]);return{seq:e,dim:t,batch:r,pipelines:{total:m,qkt:f,soft:p,pv:g},groups:{total:b,qkt:y,soft:v,pv:h},bufs:{q:s,k:i,v:o,out:u,scores:l,probs:c},ref:{scores:n.scores,probs:n.probs,out:n.out}}}async function Vs(e=[4,16,64,128,256]){const t=U(),r=64,n=1,a=[];for(const s of e){const i=n*s,o=Ka(i),u=await En(s,r,n);try{let l="qkt",c=null,d=null;const m=[Math.ceil(i/64),n,1],f=await H(u.pipelines.qkt,u.groups.qkt,m,u.bufs.scores,s*s*4,`phase-softmax-qkt-${s}`);oe(f,u.ref.scores)>.01&&(c="phase-qkt-mismatch",d=`QK^T scores maxErr=${oe(f,u.ref.scores).toExponential(2)}`),t.queue.writeBuffer(u.bufs.probs,0,new Float32Array(s*s).fill(Le));const p=Tt(i),g=await H(u.pipelines.soft,u.groups.soft,p,u.bufs.probs,s*s*4,`phase-softmax-soft-${s}`);l=c===null?"softmax-validation":"qkt";let b=sn(g,u.ref.probs,.01);c===null&&!b.pass&&(c="softmax-mismatch",d=`maxErr=${b.maxError.toExponential(2)} @ idx ${b.errorIndex} (cpu ${b.cpuValue?.toExponential(4)} gpu ${b.gpuValue?.toExponential(4)})`);const y=on(g,i,s);let v=1/0,h=-1/0;for(const M of y)v=Math.min(v,M),h=Math.max(h,M);c===null&&(v<1-.01||h>1+.01)&&(c="softmax-row-sum",d=`row sums deviate: min=${v.toExponential(3)} max=${h.toExponential(3)}`);const S=Bs(g);c===null&&S>0&&(c="softmax-unwritten-output",d=`${S} sentinel(s) remain after softmax`),a.push({seq:s,pass:c===null,stage:l,errorType:c,errorMessage:d,rows:i,workgroupsX:o.workgroupsX,totalInvocations:o.totalInvocations,maxError:b.maxError,errorIndex:b.errorIndex,cpuValue:b.cpuValue,gpuValue:b.gpuValue,expectedRange:b.expectedRange,actualRange:b.actualRange,rowSumsMin:v===1/0?-1:v,rowSumsMax:h===-1/0?-1:h,sentinelCount:S})}finally{try{u.bufs.q.destroy(),u.bufs.k.destroy(),u.bufs.v.destroy(),u.bufs.out.destroy(),u.bufs.scores.destroy(),u.bufs.probs.destroy()}catch{}}}return a}const Ae=30,An=65536;function js(){return{pipeline:V(Ye,["uniform","read-only-storage","read-only-storage","storage"])}}function Pe(e){if(e.length===0)return 0;const t=[...e].sort((r,n)=>r-n);return t[Math.floor(t.length/2)]}async function Ze(e){const t=performance.now();return await e(),performance.now()-t}const Ks=[1,4,8,16,32,64,128];async function Ys(){const e=U(),t=[],r=[];let n=!1;for(const a of Ks){if(n){t.push({id:`memory-${a}-mib`,requestedBytes:a*1024*1024,requestedMiB:a,created:!1,success:!1,note:"not attempted (previous allocation failed)"});continue}const s=a*1024*1024;let i=!1,o=!1,u;try{const l=$(s);i=!0,r.push(l);const{error:c}=await ja(e,"memory-allocate",async()=>(await ye(l,4),!0));o=!c,u=c?`GPU error while forcing allocation: ${c}`:void 0}catch(l){u=l.message}t.push({id:`memory-${a}-mib`,requestedBytes:s,requestedMiB:a,created:i,success:o,note:u}),o||(n=!0)}for(const a of r)try{a.destroy()}catch{}return t}async function Qs(){const{pipeline:e}=js(),t=An,r=t*4,n=[Math.ceil(t/64),1,1],a=new Float32Array(t),s=new Float32Array(t);for(let f=0;f<t;f++)a[f]=f%100/25-2,s[f]=f%77/13-3;const i=F(ct(t)),o=[];for(let f=0;f<Ae;f++){const p=await Ze(async()=>{const g=$(r,a),b=$(r,s),y=$(r),v=q(e,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:g}},{binding:2,resource:{buffer:b}},{binding:3,resource:{buffer:y}}]),h=U().createCommandEncoder(),S=h.beginComputePass();S.setPipeline(e),S.setBindGroup(0,v),S.dispatchWorkgroups(n[0],n[1],n[2]),S.end(),U().queue.submit([h.finish()]),await ye(y,r),g.destroy(),b.destroy(),y.destroy()});o.push(p)}const u=$(r,a),l=$(r,s),c=$(r),d=q(e,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:u}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]),m=[];for(let f=0;f<Ae;f++){const p=await Ze(async()=>{const g=U().createCommandEncoder(),b=g.beginComputePass();b.setPipeline(e),b.setBindGroup(0,d),b.dispatchWorkgroups(n[0],n[1],n[2]),b.end(),U().queue.submit([g.finish()]),await ye(c,r)});m.push(p)}return{allocateDestroy:{id:"buffer-allocate-destroy",name:"Allocate + Destroy per op",size:`${Gr(3*t*4)} (3 × VecAdd buffers)`,timingMode:"END_TO_END",perOpMs:Pe(o),totalMs:o.reduce((f,p)=>f+p,0),iterations:Ae,samplesMs:[...o].sort((f,p)=>f-p),note:"full op = create 3 buffers + bind group + dispatch + readback + destroy"},bufferReuse:{id:"buffer-reuse",name:"Reuse persistent buffers",size:`${Gr(3*t*4)} (3 × VecAdd buffers)`,timingMode:"END_TO_END",perOpMs:Pe(m),totalMs:m.reduce((f,p)=>f+p,0),iterations:Ae,samplesMs:[...m].sort((f,p)=>f-p),note:"full op = dispatch + readback on pre-allocated buffers"}}}async function Xs(){const e=An,t=e*4,r=[Math.ceil(e/64),1,1],n=new Float32Array(e),a=new Float32Array(e);for(let f=0;f<e;f++)n[f]=f%100/25-2,a[f]=f%77/13-3;const s=$(t,n),i=$(t,a),o=$(t),u=F(ct(e)),l=[];for(let f=0;f<Ae;f++){const p=await Ze(async()=>{const g=V(Ye,["uniform","read-only-storage","read-only-storage","storage"]),b=q(g,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:o}}]),y=U().createCommandEncoder(),v=y.beginComputePass();v.setPipeline(g),v.setBindGroup(0,b),v.dispatchWorkgroups(r[0],r[1],r[2]),v.end(),U().queue.submit([y.finish()]),await ye(o,t),typeof g.destroy=="function"&&g.destroy()});l.push(p)}const c=V(Ye,["uniform","read-only-storage","read-only-storage","storage"]),d=q(c,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:i}},{binding:3,resource:{buffer:o}}]),m=[];for(let f=0;f<Ae;f++){const p=await Ze(async()=>{const g=U().createCommandEncoder(),b=g.beginComputePass();b.setPipeline(c),b.setBindGroup(0,d),b.dispatchWorkgroups(r[0],r[1],r[2]),b.end(),U().queue.submit([g.finish()]),await ye(o,t)});m.push(p)}return{recreate:{id:"pipeline-recreate",name:"Recreate pipeline per op",size:"VecAdd 65536",timingMode:"END_TO_END",perOpMs:Pe(l),totalMs:l.reduce((f,p)=>f+p,0),iterations:Ae,samplesMs:[...l].sort((f,p)=>f-p),note:"full op = createPipeline + bind group + dispatch + readback"},cached:{id:"pipeline-cached",name:"Cached pipeline",size:"VecAdd 65536",timingMode:"END_TO_END",perOpMs:Pe(m),totalMs:m.reduce((f,p)=>f+p,0),iterations:Ae,samplesMs:[...m].sort((f,p)=>f-p),note:"full op = dispatch + readback on a pre-built pipeline"}}}const Me=8,Lt=4096;async function Zs(){const e=Lt,t=e*4,r=[Math.ceil(e/64),1,1],n=new Float32Array(e),a=new Float32Array(e);for(let f=0;f<e;f++)n[f]=f%100/25-2,a[f]=f%77/13-3;const s=F(ct(e)),i=$(t,n),o=$(t,a),u=$(t),l=V(Ye,["uniform","read-only-storage","read-only-storage","storage"]),c=q(l,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:i}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:u}}]),d=[];for(let f=0;f<20;f++){const p=await Ze(async()=>{const g=[];for(let b=0;b<Me;b++){const y=U().createCommandEncoder(),v=y.beginComputePass();v.setPipeline(l),v.setBindGroup(0,c),v.dispatchWorkgroups(r[0],r[1],r[2]),v.end(),g.push(y)}for(const b of g)U().queue.submit([b.finish()]);await ye(u,t)});d.push(p)}const m=[];for(let f=0;f<20;f++){const p=await Ze(async()=>{const g=U().createCommandEncoder();for(let b=0;b<Me;b++){const y=g.beginComputePass();y.setPipeline(l),y.setBindGroup(0,c),y.dispatchWorkgroups(r[0],r[1],r[2]),y.end()}U().queue.submit([g.finish()]),await ye(u,t)});m.push(p)}return[{id:"command-batch-individual",name:`${Me} × VecAdd(${Lt}) — individual submits`,dispatches:Me,timingMode:"END_TO_END",totalMedianMs:Pe(d),perDispatchMs:Pe(d)/Me,samplesMs:[...d].sort((f,p)=>f-p)},{id:"command-batch-batched",name:`${Me} × VecAdd(${Lt}) — 8 passes, one command buffer`,dispatches:Me,timingMode:"END_TO_END",totalMedianMs:Pe(m),perDispatchMs:Pe(m)/Me,samplesMs:[...m].sort((f,p)=>f-p)}]}function Gr(e){return`${(e/1024).toFixed(1)} KiB`}function Js(){const e=typeof navigator<"u"?navigator:void 0;if(e&&(typeof e.getGpuUtilization=="function"||typeof e.gpuUtilization=="number"))try{const t=typeof e.getGpuUtilization=="function"?e.getGpuUtilization():e.gpuUtilization;return typeof t=="number"?`${t}%`:"UNAVAILABLE"}catch{return"UNAVAILABLE"}return"UNAVAILABLE"}function Qt(){const e=typeof navigator<"u"?navigator:void 0;if(!e)return"UNAVAILABLE";const t=e;if(typeof t.getDeviceThermalLevel=="function")try{const r=t.getDeviceThermalLevel();return String(r)}catch{return"UNAVAILABLE"}return"UNAVAILABLE"}function Ir(){const e=typeof navigator<"u"?navigator:void 0;return{userAgent:typeof navigator<"u"?navigator.userAgent:"unknown",platform:e&&typeof e.platform=="string"?e.platform:"unknown",hardwareConcurrency:e&&typeof e.hardwareConcurrency=="number"?e.hardwareConcurrency:null,deviceMemory:e&&typeof e.deviceMemory=="number"?e.deviceMemory:null,thermalState:Qt(),gpuUtilization:Js()}}function eo(e){return JSON.parse(JSON.stringify(e))}function Lr(e){const t=e.diag,r={device:{webgpuAvailable:t.webgpuAvailable,adapterName:t.adapterName,adapterVendor:t.adapterVendor,adapterDevice:t.adapterDevice,features:t.adapterFeatures,timestampQuerySupport:t.timestampQuerySupport,isFallbackAdapter:t.isFallbackAdapter},browser:e.browser,webgpu:{limits:{maxBufferSize:t.maxBufferSize,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize,maxComputeWorkgroupSizeX:t.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.maxComputeWorkgroupSizeZ,maxComputeInvocationsPerWorkgroup:t.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:t.maxComputeWorkgroupsPerDimension},maxBufferSize:t.maxBufferSize,maxStorageBufferBindingSize:t.maxStorageBufferBindingSize},timingMode:e.timingMode,timestamp:new Date().toISOString(),build:e.build,tests:e.tests,memory:e.memory,bufferReuse:e.bufferReuse,pipelineCache:e.pipelineCache,commandBatching:e.commandBatching,sustained:e.sustained,suiteError:e.suiteError};return eo(r)}function to(e){const t={},r=(n,a,s)=>{t[`${n}.${a}`]={test:n,configuration:a,iterations:s.iterations,warmup:s.warmup,minMs:s.minMs,maxMs:s.maxMs,meanMs:s.averageMs,medianMs:s.medianMs,stdDevMs:s.stdDevMs,timingMode:s.timingMode,throughput:s.throughput?`${s.throughput.value.toFixed(2)} ${s.throughput.unit}`:null,note:s.note??null}};for(const n of e.tests.matmul)r("matmul",n.size,n);for(const n of e.tests.vecadd)r("vecadd",n.size,n);for(const n of e.tests.conv2d)r("conv2d",n.size,n);for(const n of e.tests.softmax)r("softmax",n.size,n);for(const n of e.tests.rmsnorm)r("rmsnorm",n.size,n);for(const n of e.tests.attention)r("attention",n.size,n);for(const[n,a]of Object.entries(e.tests.attentionPhases))for(const s of a)r("attention",`${s.name} ${n}`,s);for(const n of e.memory)t[`memory.${n.requestedMiB} MiB`]={test:"memory",configuration:`${n.requestedMiB} MiB`,iterations:1,warmup:0,minMs:0,maxMs:0,meanMs:0,medianMs:0,stdDevMs:0,timingMode:"ALLOCATION",note:`${n.requestedMiB} MiB requested (${n.requestedBytes} B) — created=${n.success?"yes":"no"}, success=${n.success?"yes":"no"}${n.note?` — ${n.note}`:""}`,throughput:null};for(const n of Object.keys(e.bufferReuse)){const a=e.bufferReuse[n];t[`bufferReuse.${a.name}`]={test:"bufferReuse",configuration:a.name,iterations:a.iterations,warmup:0,minMs:Fr(a.samplesMs),maxMs:a.samplesMs[a.samplesMs.length-1]??0,meanMs:a.totalMs/Math.max(a.iterations,1),medianMs:a.perOpMs,stdDevMs:0,timingMode:a.timingMode,throughput:null,note:`per-op (median) ${a.perOpMs.toFixed(3)} ms — ${a.note??""}`.trim()}}for(const n of Object.keys(e.pipelineCache)){const a=e.pipelineCache[n];t[`pipelineReuse.${a.name}`]={test:"pipelineReuse",configuration:a.name,iterations:a.iterations,warmup:0,minMs:Fr(a.samplesMs),maxMs:a.samplesMs[a.samplesMs.length-1]??0,meanMs:a.totalMs/Math.max(a.iterations,1),medianMs:a.perOpMs,stdDevMs:0,timingMode:a.timingMode,throughput:null,note:`per-op (median) ${a.perOpMs.toFixed(3)} ms — ${a.note??""}`.trim()}}for(const n of e.commandBatching)t[`commandBatching.${n.name}`]={test:"commandBatching",configuration:n.name,iterations:n.samplesMs.length,warmup:0,minMs:n.samplesMs[0]??0,maxMs:n.samplesMs[n.samplesMs.length-1]??0,meanMs:n.samplesMs.reduce((a,s)=>a+s,0)/Math.max(n.samplesMs.length,1),medianMs:n.totalMedianMs,stdDevMs:0,timingMode:n.timingMode,throughput:null,note:`${n.dispatches} work dispatches across ${n.name.includes("one command buffer")?"passes in one command buffer":"separate submissions"}`};if(e.sustained){const n=e.sustained;t["sustained.30sec"]={test:"sustained",configuration:"MatMul 256×256, 30 seconds",iterations:n.samples.length,warmup:0,minMs:n.minGflops,maxMs:n.maxGflops,meanMs:n.avgGflops,medianMs:n.samples[Math.floor(n.samples.length/2)]?.gflops??0,stdDevMs:0,timingMode:n.timingMode,throughput:null,note:`avg ${n.avgGflops.toFixed(1)} GFLOPS; first10s ${n.first10sAvgGflops.toFixed(1)}, last10s ${n.last10sAvgGflops.toFixed(1)}; throttled=${n.throttled?"yes":"no"} (miss=${n.dropPct.toFixed(1)}%)${n.error?` — ${n.error}`:""}`}}return e.suiteError&&(t["suite.error"]={test:"suite",configuration:"aborted",iterations:0,warmup:0,minMs:0,maxMs:0,meanMs:0,medianMs:0,stdDevMs:0,timingMode:e.timingMode,throughput:null,note:e.suiteError}),{device:e.device,browser:e.browser,webgpu:e.webgpu,timingMode:e.timingMode,timestamp:e.timestamp,commit:e.build.commit,results:t}}function Fr(e){if(e.length===0)return 0;const t=[...e].sort((r,n)=>r-n);return t[Math.floor(t.length/2)]}function ro(e){const t=[],r=e.tests.matmul,n=e.tests.vecadd,a=e.tests.attention,s=(()=>{if(r.length===0)return null;const c=r.filter(d=>d.throughput);return c.length===0?null:c.reduce((d,m)=>d.throughput.value>m.throughput.value?d:m)})();s?t.push(`compute-bound: largest MatMul throughput measured ${s.throughput.value.toFixed(1)} ${s.throughput.unit} at ${s.size} — matrix multiply is the classic compute-bound workload here.`):t.push("compute-bound: no usable MatMul throughput recorded.");const i=n.reduce((c,d)=>d.throughput&&(!c||d.throughput.value>c.throughput.value)?d:c,null);if(i&&i.throughput?t.push(`memory-bandwidth-sensitive: Vector Add peaks at ${i.throughput.value.toFixed(1)} ${i.throughput.unit} at ${i.size} — trivial ALU per element, so this reflects practical device memory bandwidth.`):t.push("memory-bandwidth-sensitive: no usable Vector Add bandwidth recorded."),a.length>=2){const c=[...a].sort((m,f)=>m.size.length-f.size.length),d=c[c.length-1];t.push(`attention bottleneck: largest tested single-pass attention (${d.size}) took ${d.medianMs.toFixed(2)} ms median (${d.timingMode}). Scores grow O(seq²): this is the workload most likely to bottleneck video diffusion decoding.`)}else a.length===1&&t.push(`attention bottleneck: attention at ${a[0].size} took ${a[0].medianMs.toFixed(2)} ms median (${a[0].timingMode}). Scores grow O(seq²).`);const o=a.filter(c=>/seq=(\d+)/.test(c.size)).sort((c,d)=>parseInt(d.size.match(/seq=(\d+)/)[1],10)-parseInt(c.size.match(/seq=(\d+)/)[1],10));if(o.length>=2){const c=o[0],d=o[1],m=c.medianMs/Math.max(d.medianMs,1e-9),f=parseInt(c.size.match(/seq=(\d+)/)[1],10),p=parseInt(d.size.match(/seq=(\d+)/)[1],10),g=f/p;t.push(`attention scaling: ${c.size} ran ${m.toFixed(2)}× slower than ${d.size} (seq ×${g}). With O(seq²) scores, doubling seq multiplies score work by ~4× — expect ~${(g*g).toFixed(1)}× per double if score-dominated.`)}else t.push("attention scaling: need 2+ attention sizes to compute a scaling ratio.");const u=e.memory.filter(c=>c.created&&c.success);if(u.length>0){const c=u.reduce((d,m)=>d.requestedBytes>m.requestedBytes?d:m);t.push(`largest safe tested tensor: single storage buffer of ${(c.requestedBytes/(1024*1024)).toFixed(0)} MiB allocated and survived. This is a tested allocation, not the total GPU memory.`)}else t.push("largest safe tested tensor: no successful memory allocation recorded.");const l=e.bufferReuse;if(l.allocateDestroy&&l.bufferReuse&&l.allocateDestroy.perOpMs>0){const c=l.bufferReuse.perOpMs/l.allocateDestroy.perOpMs;t.push(`buffer reuse: persistent reuse measured ${(c*100).toFixed(0)}% of the allocate/destroy per-op cost (${l.allocateDestroy.perOpMs.toFixed(3)} ms → ${l.bufferReuse.perOpMs.toFixed(3)} ms). Persistent buffers should be the default in the tensor runtime.`)}else t.push("buffer reuse: insufficient data to compare allocation strategies.");return t}const no=30,ao=2e3,so=750,G=256;function _r(e){let t=2654435769;for(let r=0;r<e.length;r++)t=t*1664525+1013904223>>>0,e[r]=t%2001/1e3-1}function oo(){const e=G*G*4,t=new Float32Array(G*G),r=new Float32Array(G*G);_r(t),_r(r);const n=$(e,t),a=$(e,r),s=$(e),i=F(sr(G,G,G)),o=V(ut,["uniform","read-only-storage","read-only-storage","storage"]),u=q(o,["uniform","read-only-storage","read-only-storage","storage"],[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:n}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:s}}]);return{pipeline:o,bg:u,bufC:s,wg:[G/16,G/16,1]}}function io(e){return new Promise(t=>setTimeout(t,e))}async function uo(e,t={}){const r=U(),n=t.seconds??no,a=Qt(),{pipeline:s,bg:i,bufC:o,wg:u}=oo(),l=await e.timeOne(M=>{M.setPipeline(s),M.setBindGroup(0,i),M.dispatchWorkgroups(u[0],u[1],u[2])},()=>ye(o,G*G*4).then(()=>{})),c=Math.max(1,Math.min(ao,Math.floor(so/Math.max(l,.01)))),d=[],m=performance.now(),f=2*G*G*G;for(let M=0;M<n;M++){const B=performance.now();let R=0;try{const ee=r.createCommandEncoder(),de=ee.beginComputePass();de.setPipeline(s),de.setBindGroup(0,i);for(let O=0;O<c;O++)de.dispatchWorkgroups(u[0],u[1],u[2]);de.end(),r.queue.submit([ee.finish()]),await ye(o,G*G*4),R=Math.max(performance.now()-B,.001)}catch(ee){R=1e3,t.onProgress?.(ee.message)}const I=R/c,L=f/(I/1e3)/1e9,W={second:M+1,avgMs:I,gflops:L};d.push(W),t.onSecond?.(M+1,W,M);const we=1e3-(performance.now()-B);we>10&&await io(we)}Math.max(performance.now()-m,1);const p=d.map(M=>M.gflops),g=d.filter(M=>M.second<=10).map(M=>M.gflops),b=d.filter(M=>M.second>n-10).map(M=>M.gflops),y=M=>M.length?M.reduce((B,R)=>B+R,0)/M.length:0,v=y(g),h=y(b),S=v>0?(1-h/v)*100:0;return{durationSeconds:n,samples:d,first10sAvgGflops:v,last10sAvgGflops:h,throttled:h<v*.95,dropPct:Math.max(0,S),avgGflops:y(p),minGflops:d.length?Math.min(...p):0,maxGflops:d.length?Math.max(...p):0,thermalBefore:a,thermalAfter:Qt(),timingMode:"AGGREGATE_END_TO_END",error:void 0}}let Ft=!1;const rt={matmul:new Set(["matmul-128","matmul-256","matmul-512"]),vecadd:new Set(["vecadd-1048576"]),conv2d:new Set,softmax:new Set(["softmax-256"]),rmsnorm:new Set(["rmsnorm-1024"]),attentionSeqs:[256]};async function co(e){for(const t of e){const r=await bn(t);if(!r.pass){const n=r.errorMessage?` (${r.errorMessage})`:"";return`attention seq=${t} ${r.errorType??"failed"}${n}`}}return null}async function lo(e){if(Ft)throw new Error("A benchmark suite is already running.");Ft=!0;let t=null;try{const r=await se();t=new $s(U());const n=Ir(),a={id:Xe,commit:Mt??null,time:ot??null},s=e.mode==="full",i={matmul:[],vecadd:[],conv2d:[],softmax:[],rmsnorm:[],attention:[],attentionPhases:{}},o=p=>e.onProgress?.(p);if(e.mode==="quick"){o("attention correctness gate (seq=128,256)");const p=await co([128,256]);if(p)throw new Error(`Attention correctness failed — fix correctness before benchmarking. (${p})`)}o("matmul"),i.matmul=await Ds(t,s?void 0:rt.matmul),o("vecadd"),i.vecadd=await Os(t,s?void 0:rt.vecadd),s&&(o("conv2d"),i.conv2d=await Gs(t)),o("softmax"),i.softmax=await Ls(t,s?void 0:rt.softmax),o("rmsnorm"),i.rmsnorm=await _s(t,s?void 0:rt.rmsnorm),o("attention");const u=await Ws(t,s?void 0:rt.attentionSeqs);i.attention=u.main,i.attentionPhases=u.phases;let l=[],c={},d={},m=[],f=null;return s&&(o("memory"),l=await Ys(),o("buffer reuse"),c=await Qs(),o("pipeline cache"),d=await Xs(),o("command batching"),m=await Zs()),e.mode==="sustained"&&(o("sustained (30s)"),f=await uo(t,{onSecond:(p,g)=>e.onSecond?.(p,`s${p}: ${g.gflops.toFixed(2)} GFLOPS`)})),Lr({diag:r,browser:n,timingMode:t.mode,build:a,tests:i,memory:l,bufferReuse:c,pipelineCache:d,commandBatching:m,sustained:f})}catch(r){const n={matmul:[],vecadd:[],conv2d:[],softmax:[],rmsnorm:[],attention:[],attentionPhases:{}};let a=null;try{a=await se()}catch{}if(a&&t)return Lr({diag:a,browser:Ir(),timingMode:t.mode,build:{id:Xe,commit:Mt??null,time:ot??null},tests:n,memory:[],bufferReuse:{},pipelineCache:{},commandBatching:[],sustained:null,suiteError:r.message});throw r}finally{t?.destroy(),Ft=!1}}let j=null,C=!1,Xt=!1,me=null,J=localStorage.getItem("aether.kernels-passed")!=="1",Ne=localStorage.getItem("aether.sustained.armed")==="1",it=null;const Ce={sanity:!1,standaloneMatmul:!1,directMatmul:!1,harnessMatmul:!1};function Et(){return Ce.sanity&&Ce.standaloneMatmul&&Ce.directMatmul&&Ce.harnessMatmul}function Rt(){const e=j?.querySelector("#btn-correctness");if(!e)return;const t=Et();e.disabled=!t,e.textContent=t?"CORRECTNESS":"CORRECTNESS (LOCKED)"}function x(e,t=""){if(!j)return;const r=j.querySelector("#bench-log");if(!r)return;const n=document.createElement("div");n.className=`log-entry ${t}`,n.textContent=e,r.appendChild(n),r.scrollTop=r.scrollHeight}function zr(e){return e>=1073741824?`${(e/1073741824).toFixed(1)} GB`:e>=1048576?`${(e/1048576).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function ce(){const e=Va();x(`WEBGPU DEVICE LOST — reason: ${e.reason??"unknown"} — message: ${e.message??""}`,"err"),x("Remaining tests stopped.","err")}function he(){if(!Xt)try{const e=U();e.addEventListener("uncapturederror",t=>{const r=t.error;x(`UNCAPTURED GPU ERROR: ${r?.message??"unknown"}`,"err")}),e.lost.then(t=>{x(`WEBGPU DEVICE LOST — reason: ${t.reason} — message: ${t.message}`,"err")}),Xt=!0}catch{}}function _e(e,t){const r=j?.querySelector(`#${e}`);if(!r)return;const n=[t.stage?`<div>stage: <b style="color:var(--text)">${A(t.stage)}</b></div>`:"",t.pass?"":t.errorType?`<div>error type: <b style="color:var(--red)">${A(t.errorType)}</b></div>`:"",t.pass?"":t.errorMessage?`<div>error message: <b style="color:var(--red)">${A(t.errorMessage)}</b></div>`:"",...t.notes.map(a=>`<div style="color:var(--text-dim)">${A(a)}</div>`)].join("");r.innerHTML=`
    <div class="card" style="border-color:${t.pass?"var(--green)":"var(--red)"};margin-top:12px">
      <div class="card-header">
        <span class="card-title">${A(t.title)}</span>
        <span class="badge ${t.pass?"badge-pass":"badge-fail"}">${t.pass?"PASS":"FAIL"}</span>
      </div>
      <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${n||'<div style="color:var(--text-dim)">—</div>'}</div>
    </div>
  `}function A(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Pn(e){const t=[];for(const r of e.scopeErrors)t.push(`GPU error scope [${r.type}]: ${r.message}`);for(const r of e.uncaptured)t.push(`uncaptured GPU error [${r.type}]: ${r.message}`);return e.lost.reason&&t.push(`device lost — reason: ${e.lost.reason} — message: ${e.lost.message??""}`),t.push(`expected: ${e.expected}`),e.actual!==null&&t.push(`actual: ${e.actual}`),e.exception&&t.push(`exception: ${e.exception}`),t}function fo(e){const t=e.pass?"display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--green);color:var(--green)":"display:inline-block;margin:0 6px 6px 0;padding:2px 8px;border-radius:10px;font-size:11px;font-family:var(--mono);border:1px solid var(--red);color:var(--red)",r=e.pass?`${e.config} — complete`:`${e.config} — stage: ${e.stage} · ${e.errorType??""} · ${e.errorMessage??""}`;return`<span style="${t}" title="${A(r)}">${A(e.config)} ${e.pass?"✓":"✗"}</span>`}function po(e){const t=[];return t.push(`stage: ${A(e.stage)} · error type: <b style="color:var(--red)">${A(e.errorType??"unknown")}</b>`),e.errorMessage&&t.push(`error: ${A(e.errorMessage)}`),e.nonFiniteIndex>=0&&t.push(`non-finite output at index ${e.nonFiniteIndex}`),e.errorIndex>=0&&e.cpuValue!==null&&e.gpuValue!==null&&t.push(`largest error @ ${e.errorIndex}: cpu=${e.cpuValue.toExponential(4)} gpu=${e.gpuValue.toExponential(4)}`),e.expectedRange&&t.push(`expected range [${e.expectedRange[0].toExponential(3)}, ${e.expectedRange[1].toExponential(3)}]`),e.actualRange&&t.push(`actual range [${e.actualRange[0].toExponential(3)}, ${e.actualRange[1].toExponential(3)}]`),t.map(r=>`<div style="color:var(--red)">${r}</div>`)}function mo(e){const t=j?.querySelector("#validation-panel");if(!t)return;const r=e.length===6&&e.every(a=>a.pass),n=e.map(a=>{const s=a.cases.filter(o=>!o.pass).flatMap(po),i=a.pass?"complete":a.details.includes("ABORTED")?"aborted (device lost)":a.cases.find(o=>!o.pass)?.stage??"failed";return`
      <div class="card" style="border-color:${a.pass?"var(--green)":"var(--red)"};margin-top:10px">
        <div class="card-header">
          <span class="card-title">${A(a.name.toUpperCase())}</span>
          <span class="badge ${a.pass?"badge-pass":"badge-fail"}">${a.pass?"PASS":"FAIL"}</span>
        </div>
        <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:4px;word-break:break-all">
          <div>${a.cases.map(fo).join("")||'<span style="color:var(--text-dim)">not run</span>'}</div>
          <div>max error: <b>${a.maxError>=0?a.maxError.toExponential(2):"—"}</b></div>
          <div>execution status: <b>${A(i)}</b></div>
          ${s}
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
  `}function He(e){const t=e??{pass:!1,maxError:-1,cases:[]};return{pass:t.pass,maxError:t.maxError,cases:t.cases}}function go(e){return!me||e.length===0?null:{device:{webgpuAvailable:me.webgpuAvailable,adapterName:me.adapterName,adapterVendor:me.adapterVendor,adapterDevice:me.adapterDevice,fallbackAdapter:me.isFallbackAdapter},build:{id:Xe,commit:Mt??null,time:ot??null},timestamp:new Date().toISOString(),uncapturedErrors:kt(),tests:{vectorAdd:He(e[0]),matmul:He(e[1]),conv2d:He(e[2]),softmax:He(e[3]),rmsNorm:He(e[4]),attention:He(e[5])},allPass:e.length===6&&e.every(t=>t.pass)}}function bo(e){try{localStorage.setItem("aether.correctness",JSON.stringify(e))}catch{}}function yo(e){const t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=`aether-correctness-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`,n.click(),URL.revokeObjectURL(r)}function vo(e){const t=j?.querySelector("#report-panel");t&&(t.innerHTML=`
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
  `,t.querySelector("#btn-export-json")?.addEventListener("click",()=>yo(e)),t.querySelector("#btn-reload")?.addEventListener("click",()=>location.reload()))}async function ho(){if(!C){C=!0;try{x("═══ GPU SANITY (standalone) ═══","info");const e=await hs();Ce.sanity=e.pass,Rt(),_e("res-sanity",{title:"GPU SANITY",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:Pn(e)}),x(`GPU SANITY TEST: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&x(`  error type: ${e.errorType}`,"err"),e.errorMessage&&x(`  error message: ${e.errorMessage}`,"err")}catch(e){x(`ERROR: ${e.message}`,"err")}finally{C=!1}}}async function wo(){if(!C){C=!0;try{x("═══ STANDALONE MATMUL (64×64) ═══","info");const e=await ws();Ce.standaloneMatmul=e.pass,Rt(),_e("res-standalone",{title:"STANDALONE MATMUL",pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:Pn(e)}),x(`STANDALONE MATMUL: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&x(`  error type: ${e.errorType}`,"err"),e.errorMessage&&x(`  error message: ${e.errorMessage}`,"err")}catch(e){x(`ERROR: ${e.message}`,"err")}finally{C=!1}}}async function xo(){if(!C){C=!0;try{await se(),he(),x("═══ SHARED-DEVICE DIRECT MATMUL (engine device, inline) ═══","info");const e=await Ss();Ce.directMatmul=e.pass,Rt(),_e("res-direct",{title:e.name,pass:e.pass,stage:e.stage||"complete",errorType:e.errorType,errorMessage:e.errorMessage,notes:[`execution device id: ${e.executionDeviceId}`,`pipeline device id: ${e.pipelineDeviceId??"unknown"}`,`bind group device id: ${e.bindGroupDeviceId??"unknown"}`,`device mismatch: ${e.mismatch?"YES":"NO"}`,`max error: ${e.maxError!==null?e.maxError.toExponential(2):"—"}`]}),x(`SHARED-DEVICE DIRECT MATMUL: ${e.pass?"PASS":"FAIL"}`,e.pass?"ok":"err"),e.errorType&&x(`  error type: ${e.errorType}`,"err"),e.errorMessage&&x(`  error message: ${e.errorMessage}`,"err"),Y()&&ce()}catch(e){x(`ERROR: ${e.message}`,"err"),Y()&&ce()}finally{C=!1}}}async function qr(e,t){if(!C){C=!0;try{const r=await se();me=r,he(),x(`═══ MINIMAL HARNESS MATMUL ${e}×${e} (getDevice, inline, no runGpuTest) ═══`,"info");const n=await Sn(e),s=[`Device: ${r?`${r.adapterName}${r.adapterVendor?` / ${r.adapterVendor}`:""}`:"unknown"}`,`Pipeline: ${n.stageResults.pipeline?"PASS":"FAIL"}`,`Bind Group: ${n.stageResults["bind-group"]?"PASS":"FAIL"}`,`Dispatch: ${n.stageResults.dispatch?"PASS":"FAIL"}`,`Submission: ${n.stageResults.submission?"PASS":"FAIL"}`,`Readback: ${n.stageResults.readback?"PASS":"FAIL"}`,`Validation: ${n.stageResults.validation?"PASS":"FAIL"}`,`Expected: ${n.expected}`,`Actual range: [${n.actualMin}, ${n.actualMax}]`,`Max error: ${n.maxError!==null?n.maxError.toExponential(2):"—"}`,`Non-finite values: ${n.nonFinite}`,`GPU error: ${n.gpuError??"none"}`,`Uncaptured error: ${n.uncaptured.length?n.uncaptured.join(" | "):"none"}`,`Shader compilation: ${n.compilationMessages.length?n.compilationMessages.join(" | "):"none"}`,`expected first 16: ${Array(16).fill(n.expected).join(", ")}`,`actual first 16: ${n.first16.length?n.first16.slice(0,16).join(", "):"—"}`];_e(t,{title:`MINIMAL HARNESS MATMUL ${e}×${e}`,pass:n.pass,stage:n.stage||"complete",errorType:n.errorType,errorMessage:n.errorMessage,notes:s}),x(`MINIMAL HARNESS MATMUL ${e}×${e}: ${n.pass?"PASS":"FAIL"}`,n.pass?"ok":"err"),n.errorType&&x(`  error type: ${n.errorType}`,"err"),n.errorMessage&&x(`  error message: ${n.errorMessage}`,"err"),Y()&&ce()}catch(r){x(`ERROR: ${r.message}`,"err"),Y()&&ce()}finally{C=!1}}}function ir(){const e=document.getElementById("res-readback-engine");if(!e)return;const r=z.getInstance().getDiagnostics(Y());e.innerHTML=`
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
  `}async function So(){if(!C){C=!0;try{await se(),he(),x("═══ RUN READBACK TEST (4 B → 1 MB) ═══","info");const e=U(),t=[{name:"4 B",bytes:4},{name:"16 B",bytes:16},{name:"64 B",bytes:64},{name:"1 KB",bytes:1024},{name:"64 KB",bytes:65536},{name:"256 KB",bytes:262144},{name:"1 MB",bytes:1048576}],r=[];for(const{name:a,bytes:s}of t)try{const i=new Float32Array(s/4).fill(123),o=$(s,i),u=await z.getInstance().copyAndRead(e,o,s,`Test_${a}`);o.destroy();let l=u.length===s/4;l&&u.length>0&&(l=Math.abs(u[0]-123)<.001),r.push({name:a,pass:l}),x(`  ${a.padEnd(8)}: ${l?"PASS":"FAIL"}`,l?"ok":"err")}catch(i){const o=i.message;r.push({name:a,pass:!1,err:o}),x(`  ${a.padEnd(8)}: FAIL — ${o}`,"err");break}const n=r.length===t.length&&r.every(a=>a.pass);_e("res-readback-test",{title:"READBACK DIAGNOSTIC (4B → 1MB)",pass:n,stage:n?"complete":"readback-test",errorType:null,errorMessage:n?null:r.find(a=>!a.pass)?.err??"Readback size test failed",notes:r.map(a=>`${a.name}: ${a.pass?"PASS":"FAIL"}${a.err?` (${a.err})`:""}`)}),ir()}catch(e){x(`ERROR: ${e.message}`,"err")}finally{C=!1}}}async function Mo(){if(!C){C=!0;try{await se(),he(),x("═══ RUN READBACK STRESS (100 iterations) ═══","info");const e=U(),t=64;let r=0,n=0,a=null,s=null;const i=new Float32Array(t/4).fill(42),o=$(t,i);try{for(let l=1;l<=100;l++)try{const c=await z.getInstance().copyAndRead(e,o,t,`Stress_${l}`);if(c.length!==16||Math.abs(c[0]-42)>=.001)throw new Error(`Data mismatch at iteration ${l}: got ${c[0]}`);r++}catch(c){n++,a===null&&(a=l,s=c.message);break}}finally{o.destroy()}const u=n===0&&r===100;_e("res-readback-stress",{title:"READBACK STRESS (100 Iterations)",pass:u,stage:u?"complete":`iter-${a}`,errorType:null,errorMessage:s,notes:[`Successful reads: ${r}/100`,`Failed reads: ${n}`,`First failure iter: ${a??"None"}`,`Device lost: ${Y()?"YES":"NO"}`]}),x(`READBACK STRESS: ${u?"PASS":"FAIL"} (${r}/100 reads succeeded)`,u?"ok":"err"),s&&x(`  First failure at iter ${a}: ${s}`,"err"),ir()}catch(e){x(`ERROR: ${e.message}`,"err")}finally{C=!1}}}async function $o(){if(!C){C=!0;try{await se(),he(),x("═══ HARNESS MATMUL (runGpuTest) ═══","info");const e=await fn();Ce.harnessMatmul=e.pass,Rt();const t=e.cases.map(a=>`${a.config}:${a.pass?"PASS":"FAIL"}`).join(" "),r=e.cases.find(a=>!a.pass),n=r?[`pipeline device id: ${r.pipelineDeviceId??"unknown"}`,`execution device id: ${r.executionDeviceId??"unknown"}`,`bind group device id: ${r.bindGroupDeviceId??"unknown"}`,`device mismatch: ${r.mismatch?"YES":"NO"}`]:[];_e("res-harness",{title:"HARNESS MATMUL",pass:e.pass,stage:e.pass?"complete":r?.stage??"runGpuTest",errorType:e.pass?null:r?.errorType??null,errorMessage:e.pass?null:r?.errorMessage??e.details,notes:[`cases: ${t||"—"}`,`max error: ${e.maxError>=0?e.maxError.toExponential(2):"—"}`,...n]}),x(`HARNESS MATMUL: ${e.pass?"PASS":"FAIL"} — ${e.details||""}`,e.pass?"ok":"err"),Y()&&ce()}catch(e){x(`ERROR: ${e.message}`,"err"),Y()&&ce()}finally{C=!1}}}async function Eo(){if(!C){C=!0;try{await se(),he(),kt(),Bt(),x("═══ RUN ATTENTION CORRECTNESS (seq=4/16/64/128/256) ═══","info");const e=await yn(),t=j?.querySelector("#res-attention");t&&(t.innerHTML=e.cases.map(r=>{const n=[`sequence length: ${r.config}`,`maxError: ${r.maxError>=0?r.maxError.toExponential(3):"n/a"}`,`errorIndex: ${r.errorIndex>=0?r.errorIndex:"n/a"}`,`cpuValue: ${r.cpuValue!==null?r.cpuValue.toExponential(4):"n/a"}`,`gpuValue: ${r.gpuValue!==null?r.gpuValue.toExponential(4):"n/a"}`,`expected range: ${r.expectedRange?`[${r.expectedRange[0].toExponential(3)}, ${r.expectedRange[1].toExponential(3)}]`:"n/a"}`,`actual range: ${r.actualRange?`[${r.actualRange[0].toExponential(3)}, ${r.actualRange[1].toExponential(3)}]`:"n/a"}`,`non-finite count: ${r.nonFiniteIndex>=0?1:0}`];r.rowsExpected!==void 0&&(n.push(`rows: ${r.rowsCovered??0}/${r.rowsExpected} covered`+(r.firstMissingRow!==null&&r.firstMissingRow!==void 0?` (first missing row ${r.firstMissingRow})`:"")),n.push(`sentinel count: ${r.sentinelCount??0}`+(r.firstSentinelIndex!==null&&r.firstSentinelIndex!==void 0?` (first @ ${r.firstSentinelIndex}, last @ ${r.lastSentinelIndex})`:""))),r.pass||n.push(`stage: ${r.stage} · ${r.errorType??"gpu-error"} · ${r.errorMessage??""}`);const a=n.map(s=>`<div style="color:var(--text-dim)">${A(s)}</div>`).join("");return`
            <div class="card" style="border-color:${r.pass?"var(--green)":"var(--red)"};margin-top:12px">
              <div class="card-header">
                <span class="card-title">Attention ${A(r.config)}</span>
                <span class="badge ${r.pass?"badge-pass":"badge-fail"}">${r.pass?"PASS":"FAIL"}</span>
              </div>
              <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${a}</div>
            </div>`}).join("")),x(`ATTENTION CORRECTNESS: ${e.pass?"ALL PASS":"FAILED"} — ${e.details}`,e.pass?"ok":"err")}catch(e){x(`ERROR: ${e.message}`,"err"),Y()&&ce()}finally{C=!1}}}async function Ao(){if(!C){C=!0;try{await se(),he(),kt(),Bt(),x("═══ RUN ATTENTION PHASE SOFTMAX (seq=4/16/64/128/256) ═══","info");const e=await Vs(),t=j?.querySelector("#res-phase-softmax");t&&(t.innerHTML=e.map(r=>{const n=[`rows: ${r.rows} · workgroupsX: ${r.workgroupsX} · total invocations: ${r.totalInvocations}`,`maxError: ${r.maxError>=0?r.maxError.toExponential(3):"n/a"}`,`errorIndex: ${r.errorIndex>=0?r.errorIndex:"n/a"}`,`cpuValue: ${r.cpuValue!==null?r.cpuValue.toExponential(4):"n/a"}`,`gpuValue: ${r.gpuValue!==null?r.gpuValue.toExponential(4):"n/a"}`,`expected range: ${r.expectedRange?`[${r.expectedRange[0].toExponential(3)}, ${r.expectedRange[1].toExponential(3)}]`:"n/a"}`,`actual range: ${r.actualRange?`[${r.actualRange[0].toExponential(3)}, ${r.actualRange[1].toExponential(3)}]`:"n/a"}`,`row sums: [${r.rowSumsMin.toExponential(3)}, ${r.rowSumsMax.toExponential(3)}] (≈1)`,`sentinel count: ${r.sentinelCount}`];r.pass||n.push(`stage: ${r.stage} · ${r.errorType??"gpu-error"} · ${r.errorMessage??""}`);const a=n.map(s=>`<div style="color:var(--text-dim)">${A(s)}</div>`).join("");return`
            <div class="card" style="border-color:${r.pass?"var(--green)":"var(--red)"};margin-top:12px">
              <div class="card-header">
                <span class="card-title">Phase Softmax seq=${r.seq}</span>
                <span class="badge ${r.pass?"badge-pass":"badge-fail"}">${r.pass?"PASS":"FAIL"}</span>
              </div>
              <div style="margin-top:8px;font-size:12px;font-family:var(--mono);display:grid;gap:2px;word-break:break-all">${a}</div>
            </div>`}).join("")),x(`PHASE SOFTMAX: ${e.every(r=>r.pass)?"ALL PASS":"FAILED"} — ${e.map(r=>`s${r.seq}:${r.pass?"PASS":"FAIL"}`).join(" ")}`,e.every(r=>r.pass)?"ok":"err")}catch(e){x(`ERROR: ${e.message}`,"err"),Y()&&ce()}finally{C=!1}}}async function Po(){if(!C){if(!Et()){x("CORRECTNESS LOCKED — run GPU SANITY, STANDALONE MATMUL and HARNESS MATMUL first.","warn");return}C=!0;try{me=await se(),he(),kt(),Bt(),x("═══ AETHER KERNEL VALIDATION (sequential, one test at a time) ═══","info");const t=await bs(n=>{x(`${n.pass?"✓":"✗"} ${n.name} — ${n.details}`,n.pass?"ok":"err")});mo(t);const r=t.length===6&&t.every(n=>n.pass);if(x(r?"ALL KERNELS PASSED":"SOME KERNELS FAILED",r?"ok":"err"),r)Co(),x("Performance benchmarks UNLOCKED.","ok");else if(!J){J=!0;try{localStorage.removeItem("aether.kernels-passed")}catch{}At(),x("Performance benchmarks RE-LOCKED (a validated kernel failed).","err")}if(Y())ce(),x("Requires runtime reinitialization — reload the page (or re-run up the gate diagnostics) before retrying.","err");else{const n=go(t);n&&(bo(n),vo(n),x("Correctness report saved locally (aether.correctness).","info"))}}catch(e){x(`ERROR: ${e.message}`,"err"),Y()&&ce()}finally{C=!1}}}function Co(){J=!1;try{localStorage.setItem("aether.kernels-passed","1")}catch{}At()}function ue(e){return Number.isFinite(e)?e<1?`${(e*1e3).toFixed(1)} µs`:e<1e3?`${e.toFixed(2)} ms`:`${(e/1e3).toFixed(2)} s`:"—"}function Cn(e){return!e||!Number.isFinite(e.value)?"—":`${e.value.toFixed(1)} ${e.unit}`}function Un(e){return e==="GPU_TIMESTAMP"?"GPU TIMESTAMP":e==="END_TO_END"?"END-TO-END":e}function Uo(e){return!e||e.length===0?'<tr><td colspan="7" style="color:var(--text-dim)">not run</td></tr>':e.map(t=>t.note&&t.note.startsWith("SKIPPED")?`<tr><td class="td-l">${A(t.size)}</td><td colspan="7" style="color:var(--yellow)">${A(t.note)} — not reported as a failure</td></tr>`:`<tr ${t.error?'style="color:var(--red)"':""}>
          <td class="td-l">${A(t.size)}</td>
          <td>${Un(t.timingMode)}</td>
          <td>${ue(t.medianMs)}</td>
          <td>${ue(t.averageMs)}</td>
          <td>${ue(t.minMs)}</td>
          <td>${ue(t.maxMs)}</td>
          <td>${ue(t.stdDevMs)}</td>
          <td>${Cn(t.throughput)}</td>
        </tr>`).join("")}function Re(e,t){return`<div class="perf-block">
    <div class="perf-block-title">${A(e)} <span class="badge badge-info" style="float:right">${t?t.length:0} run</span></div>
    <table class="perf-table">
      <thead><tr>
        <th class="th-l">size</th><th>mode</th><th>median</th><th>avg</th><th>min</th><th>max</th><th>stddev</th><th>throughput</th>
      </tr></thead>
      <tbody>${Uo(t)}</tbody>
    </table>
  </div>`}function gt(e,t){return t?`<div class="perf-block">
    <div class="perf-block-title">${A(e)} <span class="badge badge-info" style="float:right">${t.timingMode}</span></div>
    <table class="perf-table">
      <thead><tr><th class="th-l">configuration</th><th>per-op</th><th>total</th><th>iterations</th></tr></thead>
      <tbody>
        <tr>
          <td class="td-l">${A(t.name)} <span style="color:var(--text-dim)">· ${A(t.size)}</span></td>
          <td>${ue(t.perOpMs)}</td>
          <td>${ue(t.totalMs)}</td>
          <td>${t.iterations}</td>
        </tr>
      </tbody>
    </table>
    ${t.note?`<div style="font-size:11px;color:var(--text-dim)">${A(t.note)}</div>`:""}
  </div>`:""}function To(e){const t=Object.entries(e.tests.attentionPhases);return t.length===0?"":`<div class="perf-block">
    <div class="perf-block-title">Attention phases (per sequence length) <span class="badge badge-info" style="float:right">split</span></div>
    ${t.map(([n,a])=>`<div class="perf-sub">${A(n)}</div>${Re("",a)}`).join("")||'<div style="color:var(--text-dim)">not run</div>'}
  </div>`}function Bo(e){return`<tr style="color:${e.success?"var(--green)":"var(--red)"}">
    <td class="td-l">${e.requestedMiB} MiB</td>
    <td>${e.created?"allocated":"skipped"}</td>
    <td>${e.success?"OK":"FAILED"}</td>
    <td style="color:var(--text-dim)">${A(e.note??"")}</td>
  </tr>`}function ko(e){if(!e)return"";const t=e.samples.map(r=>`<div class="pad-bar" title="s${r.second}: ${r.gflops.toFixed(2)} GFLOPS" style="height:${Math.max(8,Math.min(80,100-r.gflops))}px"></div>`).join("");return`<div class="perf-block">
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
  </div>`}function Do(e){const t=j?.querySelector("#perf-results");if(!t)return;const r=ro(e),n=e.commandBatching.map(s=>`<tr><td class="td-l">${A(s.name)}</td><td>${ue(s.totalMedianMs)}</td><td>${ue(s.perDispatchMs)}</td><td>${s.timingMode}</td></tr>`).join(""),a=e.suiteError?`<div class="card" style="border-color:var(--red);margin-top:12px"><div class="card-header"><span class="card-title">SUITE ABORTED</span><span class="badge badge-fail">VALIDATION FAILURE</span></div><div style="font-size:12px;font-family:var(--mono);color:var(--red);margin-top:8px;word-break:break-all">${A(e.suiteError)}</div></div>`:"";t.innerHTML=a+`
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
    ${Re("Matrix Multiply",e.tests.matmul)}
    ${Re("Vector Add",e.tests.vecadd)}
    ${Re("Convolution 3×3",e.tests.conv2d)}
    ${Re("Softmax",e.tests.softmax)}
    ${Re("RMSNorm",e.tests.rmsnorm)}
    ${Re("Attention (single pass)",e.tests.attention)}
    ${To(e)}
    ${e.memory.length?`<div class="perf-block"><div class="perf-block-title">Largest safe tested tensor</div><table class="perf-table"><thead><tr><th class="th-l">requested</th><th>state</th><th>result</th><th>note</th></tr></thead><tbody>${e.memory.map(Bo).join("")}</tbody></table></div>`:""}
    ${gt("Buffer allocation vs reuse",e.bufferReuse.allocateDestroy)}
    ${gt("",e.bufferReuse.bufferReuse)}
    ${gt("Pipeline cache vs recreate",e.pipelineCache.recreate)}
    ${gt("",e.pipelineCache.cached)}
    ${e.commandBatching.length?`<div class="perf-block"><div class="perf-block-title">Command submission batching</div><table class="perf-table"><thead><tr><th class="th-l">configuration</th><th>total (8 ops)</th><th>per dispatch</th><th>mode</th></tr></thead><tbody>${n}</tbody></table></div>`:""}
    ${ko(e.sustained)}
    <div class="perf-block">
      <div class="perf-block-title">Interpretation</div>
      <div style="font-size:12px;line-height:1.5;color:var(--text);margin-top:6px">${r.map(s=>`<div>• ${A(s)}</div>`).join("")}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Interpretation is data-driven from the samples above — no fabricated GPU utilization, thermal state or theoretical maxima.</div>
    </div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn" id="btn-export-perf">EXPORT JSON</button>
      <button class="btn btn-outline" id="btn-copy-perf">COPY RESULTS</button>
    </div>
  `,t.querySelector("#btn-export-perf")?.addEventListener("click",()=>Ro()),t.querySelector("#btn-copy-perf")?.addEventListener("click",()=>Oo())}function Ro(){if(!it)return;const e=JSON.stringify(to(it),null,2),t=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=`aether-gpu-benchmark-${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.json`,n.click(),URL.revokeObjectURL(r)}function Oo(){if(!it)return;const e=it,t=[];t.push(`AETHER GPU BENCHMARK — ${e.device.adapterName} (${e.device.adapterVendor})`),t.push(`timing mode: ${e.timingMode}`),t.push(`thermal: ${e.browser.thermalState} · GPU utilization: ${e.browser.gpuUtilization}`),t.push(e.suiteError?`SUITE ERROR: ${e.suiteError}`:""),t.push("");const r=(n,a)=>{t.push(n);for(const s of a)t.push(`  ${s.size} — ${ue(s.medianMs)} median (${Un(s.timingMode)})${s.throughput?` · ${Cn(s.throughput)}`:""}`);t.push("")};r("matmul",e.tests.matmul),r("vecadd",e.tests.vecadd),r("conv2d",e.tests.conv2d),r("softmax",e.tests.softmax),r("rmsnorm",e.tests.rmsnorm),r("attention",e.tests.attention);for(const[n,a]of Object.entries(e.tests.attentionPhases))r(`attention phases ${n}`,a);e.sustained&&t.push(`sustained 30s: avg ${e.sustained.avgGflops.toFixed(2)} GFLOPS, throttled=${e.sustained.throttled}, drop=${e.sustained.dropPct.toFixed(1)}%`),navigator.clipboard?.writeText(t.join(`
`)).catch(()=>{}),x("Benchmark summary copied to clipboard.","ok")}function At(){const e=j?.querySelector("#btn-perf-quick"),t=j?.querySelector("#btn-perf-full"),r=j?.querySelector("#btn-perf-sustained"),n=j?.querySelector("#chk-sustained");e&&(e.disabled=J,e.textContent=J?"QUICK BENCHMARK (LOCKED)":"QUICK BENCHMARK"),t&&(t.disabled=J,t.textContent=J?"FULL BENCHMARK (LOCKED)":"FULL BENCHMARK"),n&&(n.checked=Ne),r&&(r.disabled=J||!Ne,r.textContent=J?"SUSTAINED (LOCKED)":Ne?"SUSTAINED 30s":"SUSTAINED (ARM FIRST)")}function _t(e){if(C){x("A benchmark is already running — wait for it to finish.","warn");return}if(e==="sustained"&&!Ne){x('SUSTAINED is not armed — confirm "Enable sustained 30s run" first.',"warn");return}C=!0;try{const t=e==="quick"?"QUICK":e==="full"?"FULL":"SUSTAINED";x(`═══ AETHER GPU PERFORMANCE — ${t} BENCHMARK ═══`,"info"),lo({mode:e,onProgress:r=>x(`  ${r}...`,"info"),onSecond:(r,n)=>x(`  ${n}`,"info")}).then(r=>{it=r,Do(r),x(r.suiteError?`SUITE ABORTED: ${r.suiteError}`:`${t} benchmark complete — mode: ${r.timingMode}`,r.suiteError?"err":"ok"),r.suiteError&&x("STOP — a validated kernel failed. Fix correctness before benchmarking.","err")}).catch(r=>x(`ERROR: ${r.message}`,"err")).finally(()=>{C=!1})}catch(t){C=!1,x(`ERROR: ${t.message}`,"err")}}function No(e){const t=e.querySelector("#perf-panel");t&&(t.innerHTML=`
    <div class="card" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER GPU PERFORMANCE</span>
        <span class="badge ${J?"badge-fail":"badge-pass"}">${J?"LOCKED":"UNLOCKED"}</span>
      </div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:6px">
        ${J?"Run GPU SANITY → STANDALONE MATMUL → HARNESS MATMUL → CORRECTNESS (all six kernels pass) to unlock. Timing comes from GPU timestamp queries where the device supports them, otherwise honest END-TO-END GPU submission timing. Sustained (30s) stays disabled until you arm it below.":"Timing uses GPU timestamp queries where supported, otherwise honest END-TO-END GPU submission timing (never labeled GPU execution time). Sustained (30s) stays disabled until you arm it below."}
      </div>
      <div class="btn-row" style="margin-top:10px;flex-wrap:wrap">
        <button class="btn" id="btn-perf-quick">QUICK BENCHMARK</button>
        <button class="btn btn-outline" id="btn-perf-full">FULL BENCHMARK</button>
        <button class="btn btn-outline" id="btn-perf-sustained">SUSTAINED (ARM FIRST)</button>
      </div>
      <label style="display:flex;align-items:center;gap:6px;margin-top:10px;font-size:12px;color:var(--text-dim)">
        <input type="checkbox" id="chk-sustained" ${Ne?"checked":""}>
        enable SUSTAINED 30s run (continuous MatMul load, per-second samples, thermal before/after)
      </label>
    </div>
    <div id="perf-results"></div>
  `,e.querySelector("#btn-perf-quick")?.addEventListener("click",()=>_t("quick")),e.querySelector("#btn-perf-full")?.addEventListener("click",()=>_t("full")),e.querySelector("#btn-perf-sustained")?.addEventListener("click",()=>_t("sustained")),e.querySelector("#chk-sustained")?.addEventListener("change",r=>{Ne=r.target.checked;try{localStorage.setItem("aether.sustained.armed",Ne?"1":"0")}catch{}At()}),At())}function Go(e){const t=e.querySelector("#diag-panel");if(!t)return;const r=[["location.href",location.href],["location.hash",location.hash],["location.protocol",location.protocol],["window.isSecureContext",String(window.isSecureContext)],["navigator.userAgent",navigator.userAgent],["AETHER_BUILD_ID",Xe],["Built at",ot||"n/a"],["Benchmark code revision",Xe]];t.innerHTML=r.map(([n,a])=>`<div style="font-size:11px;font-family:var(--mono);word-break:break-all">
        <span style="color:var(--text-dim)">${n}:</span> <b style="color:var(--text)">${a}</b>
      </div>`).join("")}function Io(e){j=e,Xt=!1,e.innerHTML=`
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
    </div>

    <div id="res-minimal-64"></div>
    <div id="res-minimal-128"></div>
    <div id="res-readback-test"></div>
    <div id="res-readback-stress"></div>
    <div id="res-attention"></div>
    <div id="res-phase-softmax"></div>
    <div id="res-readback-engine"></div>

    <div id="validation-panel"></div>
    <div id="report-panel"></div>
    <div id="perf-panel"></div>

    <div class="log" id="bench-log"></div>

    <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;font-family:var(--mono);color:var(--text-dim)">
      <div>AETHER BUILD: <b id="build-id" style="color:var(--text)">${Xe}</b></div>
      <div>Git commit: <b id="build-commit" style="color:var(--text)">${Mt??"unavailable"}</b></div>
      <div>Build time: <b id="build-time" style="color:var(--text)">${ot||"unavailable"}</b></div>
      <div>Environment: GitHub Pages</div>
    </div>
  `,Go(e),e.querySelector("#btn-sanity")?.addEventListener("click",ho),e.querySelector("#btn-standalone")?.addEventListener("click",wo),e.querySelector("#btn-direct")?.addEventListener("click",xo),e.querySelector("#btn-minimal-64")?.addEventListener("click",()=>qr(64,"res-minimal-64")),e.querySelector("#btn-minimal-128")?.addEventListener("click",()=>qr(128,"res-minimal-128")),e.querySelector("#btn-readback-test")?.addEventListener("click",So),e.querySelector("#btn-readback-stress")?.addEventListener("click",Mo),e.querySelector("#btn-attention")?.addEventListener("click",Eo),e.querySelector("#btn-phase-softmax")?.addEventListener("click",Ao),e.querySelector("#btn-harness")?.addEventListener("click",$o);const t=e.querySelector("#btn-correctness");t&&(t.addEventListener("click",Po),t.disabled=!Et(),t.textContent=Et()?"CORRECTNESS":"CORRECTNESS (LOCKED)"),No(e);const r=n=>{n.preventDefault()};window.addEventListener("error",r),window.addEventListener("unhandledrejection",r),se().then(n=>{me=n,he(),ir();const a=e.querySelector("#device-badge"),s=e.querySelector("#device-info");a&&(a.textContent="WEBGPU READY",a.className="badge badge-pass"),s&&(s.innerHTML=`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">
          <span>Adapter:</span><span style="color:var(--text)">${n.adapterName}</span>
          <span>Vendor:</span><span style="color:var(--text)">${n.adapterVendor}</span>
          <span>Features:</span><span style="color:var(--text)">${n.adapterFeatures.length}</span>
          <span>Max Buffer:</span><span style="color:var(--text)">${zr(n.maxBufferSize)}</span>
          <span>Max Storage:</span><span style="color:var(--text)">${zr(n.maxStorageBufferBindingSize)}</span>
          <span>Workgroup X:</span><span style="color:var(--text)">${n.maxComputeWorkgroupSizeX}</span>
          <span>Invocations/wg:</span><span style="color:var(--text)">${n.maxComputeInvocationsPerWorkgroup}</span>
          <span>Timestamp Query:</span><span style="color:var(--text)">${n.timestampQuerySupport?"YES":"NO"}</span>
          <span>Preferred Format:</span><span style="color:var(--text)">${n.preferredCanvasFormat??"N/A"}</span>
          <span>Fallback:</span><span style="color:var(--text)">${n.isFallbackAdapter?"YES (software)":"NO (hardware)"}</span>
        </div>
      `)}).catch(n=>{const a=e.querySelector("#device-badge");a&&(a.textContent="WEBGPU UNAVAILABLE",a.className="badge badge-fail"),x(`WEBGPU not available: ${n.message}`,"err")})}const Lo=Object.freeze(Object.defineProperty({__proto__:null,render:Io},Symbol.toStringTag,{value:"Module"}));function Fo(e){const t=e.toLowerCase();return t.includes("aether")||t==="external-cache"||t.startsWith("workbox-")||t.includes("webgpu")}async function Tn(){if("serviceWorker"in navigator)try{const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(t=>t.unregister().catch(()=>{})))}catch{}}async function Bn(){if("caches"in window)try{const e=await caches.keys();await Promise.all(e.filter(Fo).map(t=>caches.delete(t).catch(()=>{})))}catch{}}async function _o(){try{const e=[],t=indexedDB;if(t.databases){const r=await t.databases();for(const n of r)n.name&&n.name.toLowerCase().includes("aether")&&e.push(n.name)}else e.push("aether-gpu-benchmark");for(const r of e)await new Promise(n=>{const a=indexedDB.deleteDatabase(r);a.onsuccess=()=>n(),a.onerror=()=>n(),a.onblocked=()=>n()})}catch{}}async function zo(){await Tn(),await Bn()}async function qo(){await Tn(),await Bn(),await _o()}const ur=[{id:"gpubench",label:"GPU Bench",module:Lo},{id:"device",label:"Device Test",module:In},{id:"webgpudiag",label:"WebGPU Diag",module:Oa},{id:"model",label:"Model Test",module:Kn},{id:"tensor",label:"Tensor Bench",module:ka},{id:"image",label:"Image Test",module:Qn},{id:"video",label:"Video Test",module:ea},{id:"diag",label:"Diagnostics",module:aa}];let kn="gpubench";function Wr(){const e=window.location.hash.replace("#","");return ur.some(t=>t.id===e)?e:e==="diagnostics/webgpu"||e==="webgpu"?"webgpudiag":"gpubench"}function zt(e){kn=e,window.location.hash=e;const t=document.getElementById("nav"),r=document.getElementById("screen");t.querySelectorAll("button").forEach(a=>{a.classList.toggle("active",a.dataset.screen===e)});const n=ur.find(a=>a.id===e);n&&n.module.render(r)}function Wo(){const e=document.getElementById("app");e.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const t=document.getElementById("nav");document.getElementById("screen"),ur.forEach(n=>{const a=document.createElement("button");a.textContent=n.label,a.dataset.screen=n.id,a.addEventListener("click",()=>zt(n.id)),t.appendChild(a)});const r=Wr();zt(r),window.addEventListener("hashchange",()=>{const n=Wr();n!==kn&&zt(n)})}function Ho(){const e=document.getElementById("app");e.innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;text-align:center;gap:16px;padding:24px">
      <h2 style="color:var(--green, #22c55e);margin:0">AETHER CACHE RESET COMPLETE</h2>
      <p style="color:var(--text-dim, #9ca3af);margin:0">Please reload AETHER normally.</p>
      <button id="btn-reset-reload" class="btn">Reload AETHER</button>
    </div>
  `,e.querySelector("#btn-reset-reload")?.addEventListener("click",()=>{history.replaceState(null,"",window.location.pathname+window.location.search),window.location.reload()})}async function Hr(){if(window.location.hash==="#reset"){await qo(),Ho();return}await zo(),Wo()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>void Hr()):Hr();
