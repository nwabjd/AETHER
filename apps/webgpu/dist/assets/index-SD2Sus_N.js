(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=r(a);fetch(a.href,o)}})();function et(t){let e="Unknown",r="Unknown",n="Unknown",a="Unknown";const o=t.match(/OS (\d+)_(\d+)/);o&&(n="iOS",a=`${o[1]}.${o[2]}`);const s=t.match(/Mac OS X (\d+)[_.](\d+)/);if(s&&(n="macOS",a=`${s[1]}.${s[2]}`),t.includes("Windows")){n="Windows";const u=t.match(/Windows NT (\d+\.\d+)/);u&&(a=u[1])}if(t.includes("Android")){n="Android";const u=t.match(/Android (\d+[\.\d]*)/);u&&(a=u[1])}if(t.includes("Safari")&&!t.includes("Chrome")&&!t.includes("Chromium")){e="Safari";const u=t.match(/Version\/(\d+[\.\d]*)/);u&&(r=u[1])}if(t.includes("Chrome")&&!t.includes("Edg")){e="Chrome";const u=t.match(/Chrome\/(\d+[\.\d]*)/);u&&(r=u[1])}if(t.includes("Edg/")){e="Edge";const u=t.match(/Edg\/(\d+[\.\d]*)/);u&&(r=u[1])}if(t.includes("Firefox")){e="Firefox";const u=t.match(/Firefox\/(\d+[\.\d]*)/);u&&(r=u[1])}return{browserName:e,browserVersion:r,osName:n,osVersion:a}}function tt(t){return!!(t.includes("FBAN")||t.includes("FBIOS")||t.includes("Twitter")||t.includes("Instagram")||t.includes("Line/")||t.includes("WeChat")||t.includes("MicroMessenger")||t.includes("CocoaPods")||t.includes("wv)")||t.includes("Electron")||t.includes("; wv)"))}function rt(t){return t.includes("Safari")&&!t.includes("Chrome")&&!t.includes("Chromium")}async function pe(){const t=navigator.userAgent,e=et(t),r=e.osName==="iOS",n=rt(t),a=tt(t),o=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,s={url:window.location.href,protocol:window.location.protocol,hostname:window.location.hostname,isSecureContext:window.isSecureContext,userAgent:t,platform:navigator.platform,isIOS:r,isSafari:n,isWebView:a,isStandalone:o,browserName:e.browserName,browserVersion:e.browserVersion,osName:e.osName,osVersion:e.osVersion},i={navigatorGpuExists:!!navigator.gpu,adapterName:"",adapterVendor:"",adapterDevice:"",adapterError:null,deviceError:null,features:[],limits:null,isFallbackAdapter:!1};if(a)return{case:"G",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:"Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.",recommendation:"Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).",environment:s,gpu:i};if(!window.isSecureContext)return{case:"E",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,recommendation:r?"For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.":"Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.",environment:s,gpu:i};if(!navigator.gpu){let u="navigator.gpu is undefined. WebGPU API is not exposed.",c="";if(r){if(parseInt(e.osVersion.split(".")[0],10)<26)return u=`iOS ${e.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`,c="Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i};if(e.browserName!=="Safari")return u=`Running ${e.browserName} on iOS ${e.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`,c="Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.",{case:"F",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:u,recommendation:c,environment:s,gpu:i}}return e.osName==="macOS"&&parseInt(e.osVersion.split(".")[0],10)<14?(u=`macOS ${e.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`,c="Update to macOS 14 (Sonoma) or later with Safari 18+.",{case:"F",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i}):(c="Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.",{case:"A",ready:!1,statusLabel:"WEBGPU UNAVAILABLE",reason:u,recommendation:c,environment:s,gpu:i})}try{const u=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!u){i.adapterError="requestAdapter() returned null";let d="navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.",f="";return r?parseInt(e.osVersion.split(".")[0],10)>=26&&(d=`iOS ${e.osVersion} with Safari ${e.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`,f="Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari."):window.location.protocol==="http:"&&window.location.hostname!=="localhost"?(d="requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.",f="Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins."):f="Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.",{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:d,recommendation:f,environment:s,gpu:i}}i.adapterName=u.name??"Unknown GPU",i.adapterVendor=u.vendor??"Unknown",i.adapterDevice=u.device??"Unknown",i.isFallbackAdapter=u.isFallbackAdapter??!1;const c=[];for(const d of u.features)c.push(d.replace(/-/g," ").replace(/\b\w/g,f=>f.toUpperCase()));i.features=c;const l=u.limits;i.limits={maxBufferSize:l.maxBufferSize,maxTextureDimension1D:l.maxTextureDimension1D,maxTextureDimension2D:l.maxTextureDimension2D,maxTextureDimension3D:l.maxTextureDimension3D,maxComputeWorkgroupStorageSize:l.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:l.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:l.maxStorageBufferBindingSize,maxUniformBufferBindingSize:l.maxUniformBufferBindingSize,maxComputeWorkgroupSizeX:l.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:l.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:l.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:l.maxComputeWorkgroupsPerDimension,maxColorAttachments:l.maxColorAttachments,minStorageBufferOffsetAlignment:l.minStorageBufferOffsetAlignment,minUniformBufferOffsetAlignment:l.minUniformBufferOffsetAlignment};try{(await u.requestDevice({requiredLimits:{}})).destroy()}catch(d){return i.deviceError=d.message,{case:"C",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`Adapter found (${i.adapterName}) but requestDevice() failed: ${d.message}`,recommendation:"The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.",environment:s,gpu:i}}return{case:"D",ready:!0,statusLabel:"WEBGPU READY",reason:`WebGPU is fully functional. Adapter: ${i.adapterName}.`,recommendation:"No action needed.",environment:s,gpu:i}}catch(u){return i.adapterError=u.message,{case:"B",ready:!1,statusLabel:"WEBGPU BLOCKED",reason:`requestAdapter() threw an error: ${u.message}`,recommendation:"An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.",environment:s,gpu:i}}}function Ie(t){const e=[];if(e.push("═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══"),e.push(""),e.push(`STATUS: ${t.statusLabel}`),e.push(`CASE: ${t.case}`),e.push(`REASON: ${t.reason}`),e.push(`RECOMMENDATION: ${t.recommendation}`),e.push(""),e.push("── ENVIRONMENT ──"),e.push(`  URL: ${t.environment.url}`),e.push(`  Protocol: ${t.environment.protocol}`),e.push(`  Hostname: ${t.environment.hostname}`),e.push(`  Secure Context: ${t.environment.isSecureContext}`),e.push(`  iOS: ${t.environment.isIOS}`),e.push(`  Safari: ${t.environment.isSafari}`),e.push(`  WebView: ${t.environment.isWebView}`),e.push(`  Standalone PWA: ${t.environment.isStandalone}`),e.push(`  Browser: ${t.environment.browserName} ${t.environment.browserVersion}`),e.push(`  OS: ${t.environment.osName} ${t.environment.osVersion}`),e.push(`  Platform: ${t.environment.platform}`),e.push(`  User Agent: ${t.environment.userAgent}`),e.push(""),e.push("── WEBGPU ──"),e.push(`  navigator.gpu exists: ${t.gpu.navigatorGpuExists}`),t.gpu.adapterName&&e.push(`  Adapter: ${t.gpu.adapterName}`),t.gpu.adapterVendor&&e.push(`  Vendor: ${t.gpu.adapterVendor}`),t.gpu.adapterDevice&&e.push(`  Device: ${t.gpu.adapterDevice}`),t.gpu.adapterError&&e.push(`  Adapter Error: ${t.gpu.adapterError}`),t.gpu.deviceError&&e.push(`  Device Error: ${t.gpu.deviceError}`),e.push(`  Fallback adapter: ${t.gpu.isFallbackAdapter}`),t.gpu.features.length>0){e.push(`  Features (${t.gpu.features.length}):`);for(const r of t.gpu.features)e.push(`    ${r}`)}if(t.gpu.limits){e.push("  Limits:");for(const[r,n]of Object.entries(t.gpu.limits))e.push(`    ${r}: ${typeof n=="number"?n.toLocaleString():n}`)}return e.push(""),e.push(`Timestamp: ${new Date().toISOString()}`),e.join(`
`)}function ie(t){return t>=1073741824?`${(t/1073741824).toFixed(1)} GB`:t>=1048576?`${(t/1048576).toFixed(1)} MB`:t>=1024?`${(t/1024).toFixed(1)} KB`:`${t} B`}async function H(){const t=await pe();if(!t.ready||!t.gpu.adapterName)return null;const e=t.gpu.limits;return{available:!0,adapterName:t.gpu.adapterName,adapterVendor:t.gpu.adapterVendor,adapterDevice:t.gpu.adapterDevice,features:t.gpu.features,limits:{maxBufferSize:e.maxBufferSize,maxTextureDimension1D:e.maxTextureDimension1D,maxTextureDimension2D:e.maxTextureDimension2D,maxTextureDimension3D:e.maxTextureDimension3D,maxComputeWorkgroupStorageSize:e.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:e.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:e.maxStorageBufferBindingSize,maxUniformBufferBindingSize:e.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:0,maxComputeWorkgroupSizeX:e.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:e.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:e.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:e.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:0,maxSampledTexturesPerShaderStage:0,maxSamplersPerShaderStage:0,maxUniformBuffersPerShaderStage:0,minUniformBufferOffsetAlignment:e.minStorageBufferOffsetAlignment,minStorageBufferOffsetAlignment:e.minUniformBufferOffsetAlignment,maxColorAttachments:e.maxColorAttachments,maxTextureArrayLayers:0},isFallbackAdapter:t.gpu.isFallbackAdapter,featuresMap:new Set(t.gpu.features),diagnostic:t}}async function I(t,e=[]){const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("Failed to re-acquire GPU adapter");const n=await r.requestDevice({requiredFeatures:e.filter(a=>t.featuresMap.has(a)),requiredLimits:{}});return n.lost.then(a=>{console.error("WebGPU device lost:",a.message)}),n}function at(t){const e=t.environment,r=t.gpu;let n="badge-fail";t.case==="D"?n="badge-pass":(t.case==="B"||t.case==="C")&&(n="badge-warn");let a=`
    <div class="card" style="border-color:${t.ready?"var(--green)":t.case==="E"?"var(--yellow)":"var(--red)"}">
      <div class="card-header">
        <span class="card-title" style="font-size:18px">${t.statusLabel}</span>
        <span class="badge ${n}">CASE ${t.case}</span>
      </div>
      <p style="font-size:13px;color:var(--text-dim);margin-top:6px">${t.reason}</p>
      <p style="font-size:13px;color:var(--text);margin-top:8px;font-weight:500">${t.recommendation}</p>
    </div>

    <h3>Environment</h3>
    <div class="card">
      <div class="row"><span class="row-label">URL</span><span class="row-value" style="font-size:10px;word-break:break-all;max-width:60%">${e.url}</span></div>
      <div class="row"><span class="row-label">Protocol</span><span class="row-value">${e.protocol}</span></div>
      <div class="row"><span class="row-label">Hostname</span><span class="row-value">${e.hostname}</span></div>
      <div class="row"><span class="row-label">Secure Context</span><span class="row-value">${e.isSecureContext?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">Browser</span><span class="row-value">${e.browserName} ${e.browserVersion}</span></div>
      <div class="row"><span class="row-label">OS</span><span class="row-value">${e.osName} ${e.osVersion}</span></div>
      <div class="row"><span class="row-label">Platform</span><span class="row-value">${e.platform}</span></div>
      <div class="row"><span class="row-label">iOS</span><span class="row-value">${e.isIOS?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">Safari</span><span class="row-value">${e.isSafari?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">WebView / In-App</span><span class="row-value">${e.isWebView?"Yes (BLOCKED)":"No"}</span></div>
      <div class="row"><span class="row-label">Standalone PWA</span><span class="row-value">${e.isStandalone?"Yes":"No"}</span></div>
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
        <div class="row"><span class="row-label">Max buffer size</span><span class="row-value">${ie(r.limits.maxBufferSize)}</span></div>
        <div class="row"><span class="row-label">Max texture 1D</span><span class="row-value">${r.limits.maxTextureDimension1D}px</span></div>
        <div class="row"><span class="row-label">Max texture 2D</span><span class="row-value">${r.limits.maxTextureDimension2D}px</span></div>
        <div class="row"><span class="row-label">Max texture 3D</span><span class="row-value">${r.limits.maxTextureDimension3D}px</span></div>
        <div class="row"><span class="row-label">Max storage buffer</span><span class="row-value">${ie(r.limits.maxStorageBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max uniform buffer</span><span class="row-value">${ie(r.limits.maxUniformBufferBindingSize)}</span></div>
        <div class="row"><span class="row-label">Max workgroup storage</span><span class="row-value">${ie(r.limits.maxComputeWorkgroupStorageSize)}</span></div>
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
    `),a}function nt(t){t.innerHTML=`
    <h2>Device Test</h2>
    <div id="device-status" class="card">
      <div class="card-header">
        <span class="card-title">WebGPU</span>
        <span class="badge badge-info">CHECKING...</span>
      </div>
    </div>
    <div id="device-info"></div>
  `;const e=t.querySelector("#device-status"),r=t.querySelector("#device-info");pe().then(n=>{n.ready?e.innerHTML=`
        <div class="card-header">
          <span class="card-title">WebGPU</span>
          <span class="badge badge-pass">READY</span>
        </div>
      `:e.innerHTML="",r.innerHTML=at(n)})}const ot=Object.freeze(Object.defineProperty({__proto__:null,render:nt},Symbol.toStringTag,{value:"Module"}));let C=class je{buffer;shape;dtype;size;device;constructor(e,r,n="f32"){this.device=e,this.shape=[...r],this.dtype=n,this.size=r.reduce((s,i)=>s*i,1);const a=n==="f32"?4:n==="f16"?2:4;this.buffer=e.createBuffer({size:this.size*a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0}),(n==="f32"?new Float32Array(this.buffer.getMappedRange()):n==="i32"?new Int32Array(this.buffer.getMappedRange()):new Uint16Array(this.buffer.getMappedRange())).fill(0),this.buffer.unmap()}static fromData(e,r,n){const a=new je(e,n,r instanceof Float32Array?"f32":"i32");return e.queue.writeBuffer(a.buffer,0,r.buffer),a}async readback(){const e=this.device.createBuffer({size:this.buffer.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r=this.device.createCommandEncoder();r.copyBufferToBuffer(this.buffer,0,e,0,this.buffer.size),this.device.queue.submit([r.finish()]),await e.mapAsync(GPUMapMode.READ);const n=new Float32Array(e.getMappedRange().slice(0));return e.unmap(),e.destroy(),n}destroy(){this.buffer.destroy()}};async function ae(t,e,r=50,n){const a=[];for(let c=0;c<Math.min(5,r);c++)await e();for(let c=0;c<r;c++){const l=performance.now();await e(),await Ke?.queue.onSubmittedWorkDone();const d=performance.now();a.push(d-l)}a.sort((c,l)=>c-l);const o=a.reduce((c,l)=>c+l,0)/a.length,s=a[0],i=a[a.length-1],u={name:t,avgMs:o,minMs:s,maxMs:i,iterations:r};if(n){const l=n/(o/1e3)/1e9;u.gflops=l,u.throughput=`${l.toFixed(2)} GFLOPS`}return u}let Ke=null;function j(t){Ke=t}function ne(t){const e=[`${t.name}: ${t.avgMs.toFixed(2)} ms avg`,`(${t.minMs.toFixed(2)} – ${t.maxMs.toFixed(2)} ms)`,`[${t.iterations} iterations]`];return t.throughput&&e.push(t.throughput),e.join(" ")}const de=`
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
`,st=`
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= uniforms.N) { return; }
  data[i] = max(data[i], 0.0);
}
`,it=`
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
`,ut=`
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
`,ct=`
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
`,lt=`
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
`;let m=null,K=null;function U(t,e=""){if(!K)return;const r=document.createElement("div");r.className=`log-entry ${e}`,r.textContent=t,K.appendChild(r),K.scrollTop=K.scrollHeight}async function Se(){U("═══ TINY NEURAL NETWORK TEST ═══","info"),U("Architecture: input(4) → linear(4,3) → ReLU → linear(3,1)","info"),U("");const t=await H();if(!t)return U("WebGPU not available","err"),!1;m=await I(t),j(m);const e=performance.now(),r=C.fromData(m,new Float32Array([1,.5,-.3,.8]),[4]),n=C.fromData(m,new Float32Array([.2,-.4,.1,.5,.3,-.2,-.1,.6,.4,.3,-.1,.5]),[4,3]),a=C.fromData(m,new Float32Array([.1,-.1,.2]),[3]),o=new ArrayBuffer(12),s=new Uint32Array(o);s[0]=1,s[1]=3,s[2]=4;const i=m.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=m.createComputePipeline({layout:m.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:m.createShaderModule({code:de}),entryPoint:"main"}}),c=m.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});m.queue.writeBuffer(c,0,o);const l=new C(m,[1,3]),d=m.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:r.buffer}},{binding:2,resource:{buffer:n.buffer}},{binding:3,resource:{buffer:l.buffer}}]});let f=m.createCommandEncoder(),p=f.beginComputePass();p.setPipeline(u),p.setBindGroup(0,d),p.dispatchWorkgroups(1,1,1),p.end(),m.queue.submit([f.finish()]),U(`  input[4]:  [${Array.from(await r.readback()).map(T=>T.toFixed(2)).join(", ")}]`,""),U("  W1[4×3]:   4 rows × 3 cols",""),U("  Matmul result: computing...","");const g=await l.readback();U(`  h1 = input @ W1: [${Array.from(g).map(T=>T.toFixed(3)).join(", ")}]`,"ok");for(let T=0;T<3;T++)g[T]+=[.1,-.1,.2][T];m.queue.writeBuffer(l.buffer,0,g.buffer),U(`  h1 + bias:       [${Array.from(g).map(T=>T.toFixed(3)).join(", ")}]`,"ok");const v=m.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),b=m.createComputePipeline({layout:m.createPipelineLayout({bindGroupLayouts:[v]}),compute:{module:m.createShaderModule({code:st}),entryPoint:"main"}}),y=new ArrayBuffer(4);new Uint32Array(y)[0]=3;const x=m.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});m.queue.writeBuffer(x,0,y);const P=m.createBindGroup({layout:v,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:l.buffer}}]});f=m.createCommandEncoder(),p=f.beginComputePass(),p.setPipeline(b),p.setBindGroup(0,P),p.dispatchWorkgroups(1,1,1),p.end(),m.queue.submit([f.finish()]);const A=await l.readback();U(`  ReLU(h1):         [${Array.from(A).map(T=>T.toFixed(3)).join(", ")}]`,"ok");const M=C.fromData(m,new Float32Array([.7,-.3,.5]),[3,1]),_=new C(m,[1,1]),se=new ArrayBuffer(12),Y=new Uint32Array(se);Y[0]=1,Y[1]=1,Y[2]=3;const X=m.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),Z=m.createComputePipeline({layout:m.createPipelineLayout({bindGroupLayouts:[X]}),compute:{module:m.createShaderModule({code:de}),entryPoint:"main"}}),ge=m.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});m.queue.writeBuffer(ge,0,se);const Ze=m.createBindGroup({layout:X,entries:[{binding:0,resource:{buffer:ge}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:M.buffer}},{binding:3,resource:{buffer:_.buffer}}]});f=m.createCommandEncoder(),p=f.beginComputePass(),p.setPipeline(Z),p.setBindGroup(0,Ze),p.dispatchWorkgroups(1,1,1),p.end(),m.queue.submit([f.finish()]);const Qe=await _.readback(),Je=(performance.now()-e).toFixed(1);return U(`  Final output: ${Qe[0].toFixed(4)}`,"ok"),U(`  Total pipeline: ${Je} ms`,"ok"),U("",""),U("✓ Tiny NN passed: JavaScript → WebGPU → compute shader → tensor → result","ok"),r.destroy(),n.destroy(),a.destroy(),l.destroy(),M.destroy(),_.destroy(),c.destroy(),ge.destroy(),x.destroy(),m.destroy(),!0}async function dt(){U("═══ MATRIX MULTIPLICATION BENCHMARK ═══","info");const t=await H();if(!t)return null;m=await I(t),j(m);const e=[64,128,256,512],r=[];for(const n of e){const a=C.fromData(m,new Float32Array(n*n).fill(1),[n,n]),o=C.fromData(m,new Float32Array(n*n).fill(.5),[n,n]),s=new C(m,[n,n]),i=m.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=m.createComputePipeline({layout:m.createPipelineLayout({bindGroupLayouts:[i]}),compute:{module:m.createShaderModule({code:de}),entryPoint:"main"}}),c=new ArrayBuffer(12),l=new Uint32Array(c);l[0]=n,l[1]=n,l[2]=n;const d=await ae(`${n}×${n} matmul`,async()=>{const f=m.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});m.queue.writeBuffer(f,0,c);const p=m.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:o.buffer}},{binding:3,resource:{buffer:s.buffer}}]}),g=m.createCommandEncoder(),v=g.beginComputePass();v.setPipeline(u),v.setBindGroup(0,p);const b=Math.ceil(n/16);v.dispatchWorkgroups(b,b,1),v.end(),m.queue.submit([g.finish()]),f.destroy()},30,2*n*n*n);r.push(d),U(ne(d),"ok"),a.destroy(),o.destroy(),s.destroy()}return m.destroy(),r[r.length-1]}async function ft(){U("═══ CONVOLUTION BENCHMARK ═══","info");const t=await H();if(!t)return null;m=await I(t),j(m);const e=1,r=3,n=32,a=32,o=8,s=3,i=3,u=n-s+1,c=a-i+1,l=C.fromData(m,new Float32Array(e*r*n*a).fill(.5),[e,r,n,a]),d=C.fromData(m,new Float32Array(o*r*s*i).fill(.1),[o,r,s,i]),f=new C(m,[e,o,u,c]),p=m.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),g=m.createComputePipeline({layout:m.createPipelineLayout({bindGroupLayouts:[p]}),compute:{module:m.createShaderModule({code:it}),entryPoint:"main"}}),v=new ArrayBuffer(36),b=new Uint32Array(v);b[0]=e,b[1]=r,b[2]=n,b[3]=a,b[4]=o,b[5]=s,b[6]=i,b[7]=u,b[8]=c;const y=await ae(`Conv2D ${e}×${r}×${n}×${a} k=${s}→${o}×${u}×${c}`,async()=>{const x=m.createBuffer({size:36,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});m.queue.writeBuffer(x,0,v);const P=m.createBindGroup({layout:p,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:l.buffer}},{binding:2,resource:{buffer:d.buffer}},{binding:3,resource:{buffer:f.buffer}}]}),A=m.createCommandEncoder(),M=A.beginComputePass();M.setPipeline(g),M.setBindGroup(0,P),M.dispatchWorkgroups(e,o,1),M.end(),m.queue.submit([A.finish()]),x.destroy()},20,2*e*o*r*s*i*u*c);return U(ne(y),"ok"),l.destroy(),d.destroy(),f.destroy(),m.destroy(),y}async function pt(){U("═══ ATTENTION BENCHMARK ═══","info");const t=await H();if(!t)return null;m=await I(t),j(m);const e=1,r=64,n=64,a=1/Math.sqrt(n),o=C.fromData(m,new Float32Array(e*r*n).fill(.1),[e,r,n]),s=C.fromData(m,new Float32Array(e*r*n).fill(.1),[e,r,n]),i=C.fromData(m,new Float32Array(e*r*n).fill(.1),[e,r,n]),u=new C(m,[e,r,n]),c=new C(m,[e,r,r]),l=m.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),d=m.createComputePipeline({layout:m.createPipelineLayout({bindGroupLayouts:[l]}),compute:{module:m.createShaderModule({code:ut}),entryPoint:"main"}}),f=new ArrayBuffer(16),p=new Uint32Array(f),g=new Float32Array(f);p[0]=e,p[1]=r,p[2]=n,g[3]=a;const v=await ae(`Attention b=${e} s=${r} d=${n}`,async()=>{const b=m.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});m.queue.writeBuffer(b,0,f);const y=m.createBindGroup({layout:l,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}},{binding:4,resource:{buffer:u.buffer}},{binding:5,resource:{buffer:c.buffer}}]}),x=m.createCommandEncoder(),P=x.beginComputePass();P.setPipeline(d),P.setBindGroup(0,y),P.dispatchWorkgroups(e,1,1),P.end(),m.queue.submit([x.finish()]),b.destroy()},20);return U(ne(v),"ok"),o.destroy(),s.destroy(),i.destroy(),u.destroy(),c.destroy(),m.destroy(),v}function mt(t){t.innerHTML=`
    <h2>Model Test</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Proves the full pipeline: JavaScript → WebGPU → compute shaders → tensor operations → results.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-tiny-nn">Run Tiny NN Test</button>
      <button class="btn btn-outline" id="btn-all-bench">Run All Benchmarks</button>
    </div>

    <div class="log" id="model-log"></div>
  `,K=t.querySelector("#model-log"),t.querySelector("#btn-tiny-nn").addEventListener("click",async()=>{K.innerHTML="",await Se()}),t.querySelector("#btn-all-bench").addEventListener("click",async()=>{K.innerHTML="",await Se(),U("",""),await dt(),U("",""),await ft(),U("",""),await pt(),U("",""),U("═══ ALL BENCHMARKS COMPLETE ═══","info")})}const gt=Object.freeze(Object.defineProperty({__proto__:null,render:mt},Symbol.toStringTag,{value:"Module"}));let S=null,q=null;function D(t,e=""){if(!q)return;const r=document.createElement("div");r.className=`log-entry ${e}`,r.textContent=t,q.appendChild(r),q.scrollTop=q.scrollHeight}function Ve(t,e){const r=new Float32Array(t*e*4);for(let n=0;n<e;n++)for(let a=0;a<t;a++){const o=(n*t+a)*4,s=(a>>4)+(n>>4)&1;r[o+0]=s?.9:a/t*.8,r[o+1]=s?.3:n/e*.6,r[o+2]=s?.6:.4,r[o+3]=1}return r}function ve(t,e,r){const n=document.createElement("canvas");n.width=e,n.height=r;const a=n.getContext("2d"),o=a.createImageData(e,r);for(let s=0;s<e*r*4;s++)o.data[s]=Math.round(t[s]*255);return a.putImageData(o,0,0),n}async function Pe(){D("═══ GRAYSCALE TEST ═══","info");const t=await H();if(!t){D("WebGPU unavailable","err");return}S=await I(t),j(S);const e=256,r=256,n=Ve(e,r),a=C.fromData(S,n,[e*r*4]),o=new C(S,[e*r*4]),s=S.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=S.createComputePipeline({layout:S.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:S.createShaderModule({code:lt}),entryPoint:"main"}}),u=new ArrayBuffer(4);new Uint32Array(u)[0]=e*r;const c=await ae("Grayscale 256×256",async()=>{const g=S.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});S.queue.writeBuffer(g,0,u);const v=S.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:{buffer:a.buffer}},{binding:2,resource:{buffer:o.buffer}}]}),b=S.createCommandEncoder(),y=b.beginComputePass();y.setPipeline(i),y.setBindGroup(0,v),y.dispatchWorkgroups(Math.ceil(e*r/256),1,1),y.end(),S.queue.submit([b.finish()]),g.destroy()},50);D(ne(c),"ok");const l=await o.readback(),d=ve(n,e,r),f=ve(l,e,r),p=he?.querySelector("#image-display");if(p){p.innerHTML="";const g=document.createElement("div");g.style.cssText="display:flex;gap:12px;flex-wrap:wrap;align-items:start;margin:8px 0";const v=document.createElement("div");v.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Input</div>',v.appendChild(d);const b=document.createElement("div");b.innerHTML='<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">Grayscale Output</div>',b.appendChild(f),g.appendChild(v),g.appendChild(b),p.appendChild(g)}a.destroy(),o.destroy(),S.destroy(),D("✓ Grayscale complete","ok")}async function Ue(){D("═══ CONVOLUTION KERNEL TEST ═══","info");const t=await H();if(!t){D("WebGPU unavailable","err");return}S=await I(t),j(S);const e=128,r=128,n=3,a=Ve(e,r),o={"Edge Detect":new Float32Array([-1,-1,-1,-1,8,-1,-1,-1,-1]),Sharpen:new Float32Array([0,-1,0,-1,5,-1,0,-1,0]),Blur:new Float32Array([1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9]),Emboss:new Float32Array([-2,-1,0,-1,1,1,0,1,2])},s=S.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),i=S.createComputePipeline({layout:S.createPipelineLayout({bindGroupLayouts:[s]}),compute:{module:S.createShaderModule({code:ct}),entryPoint:"main"}}),u=new ArrayBuffer(16),c=new Uint32Array(u);c[0]=e,c[1]=r,c[2]=n,c[3]=0;for(const[l,d]of Object.entries(o)){const f=C.fromData(S,a,[e*r*4]),p=C.fromData(S,d,[n*n]),g=new C(S,[e*r*4]),v=await ae(`Conv ${l} ${e}×${r}`,async()=>{const x=S.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});S.queue.writeBuffer(x,0,u);const P=S.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:p.buffer}},{binding:2,resource:{buffer:f.buffer}},{binding:3,resource:{buffer:g.buffer}}]}),A=S.createCommandEncoder(),M=A.beginComputePass();M.setPipeline(i),M.setBindGroup(0,P),M.dispatchWorkgroups(Math.ceil(e/16),Math.ceil(r/16),1),M.end(),S.queue.submit([A.finish()]),x.destroy()},30);D(ne(v),"ok");const b=await g.readback(),y=he?.querySelector("#image-display");if(y){const x=ve(b,e,r),P=document.createElement("div");P.style.cssText="display:inline-block;margin:4px",P.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">${l}</div>`,P.appendChild(x),y.appendChild(P)}f.destroy(),p.destroy(),g.destroy()}S.destroy(),D("✓ All convolution kernels applied","ok")}let he=null;function bt(t){he=t,t.innerHTML=`
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
  `,q=t.querySelector("#image-log"),t.querySelector("#btn-grayscale").addEventListener("click",async()=>{q.innerHTML="",t.querySelector("#image-display").innerHTML="",await Pe()}),t.querySelector("#btn-conv").addEventListener("click",async()=>{q.innerHTML="",t.querySelector("#image-display").innerHTML="",await Ue()}),t.querySelector("#btn-all-img").addEventListener("click",async()=>{q.innerHTML="",t.querySelector("#image-display").innerHTML="",await Pe(),D("",""),await Ue(),D("",""),D("═══ ALL IMAGE TESTS COMPLETE ═══","info")})}const vt=Object.freeze(Object.defineProperty({__proto__:null,render:bt},Symbol.toStringTag,{value:"Module"}));let E=null,oe=null,ce=null;function ye(t,e=""){if(!oe)return;const r=document.createElement("div");r.className=`log-entry ${e}`,r.textContent=t,oe.appendChild(r),oe.scrollTop=oe.scrollHeight}const yt=`
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
`;let we=0,le=0;async function wt(t,e,r,n,a){const o=await H();if(!o){ye("WebGPU unavailable","err");return}E=await I(o),j(E);const[s,i]=n.value.split("x").map(Number);t.width=s,t.height=i,we=parseInt(a.value);const u=E.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=E.createComputePipeline({layout:E.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:E.createShaderModule({code:yt}),entryPoint:"main"}}),l=E.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),d=t.getContext("2d"),f=E.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let p=performance.now(),g=0,v=0;e.textContent="RENDERING",e.className="badge badge-pass";function b(){const y=new ArrayBuffer(16),x=new Uint32Array(y);x[0]=s,x[1]=i,x[2]=le,x[3]=we,E.queue.writeBuffer(f,0,y);const P=E.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:l}}]}),A=E.createCommandEncoder(),M=A.beginComputePass();M.setPipeline(c),M.setBindGroup(0,P),M.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(i/16),1),M.end();const _=E.createBuffer({size:s*i*4*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});A.copyBufferToBuffer(l,0,_,0,s*i*4*4),E.queue.submit([A.finish()]),_.mapAsync(GPUMapMode.READ).then(()=>{const se=new Float32Array(_.getMappedRange().slice(0));_.unmap(),_.destroy();const Y=d.createImageData(s,i);for(let Z=0;Z<s*i*4;Z++)Y.data[Z]=Math.round(se[Z]*255);d.putImageData(Y,0,0),le++,v++;const X=performance.now();X-p>=1e3&&(g=Math.round(v*1e3/(X-p)),r.textContent=`${g} FPS | Frame ${le} | ${s}×${i}`,v=0,p=X),ce=requestAnimationFrame(b)})}b()}function Ce(){ce!==null&&(cancelAnimationFrame(ce),ce=null),E&&(E.destroy(),E=null)}function ht(t){t.innerHTML=`
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
  `,oe=t.querySelector("#video-log");const e=t.querySelector("#video-canvas"),r=t.querySelector("#video-status"),n=t.querySelector("#video-fps"),a=t.querySelector("#res-select"),o=t.querySelector("#mode-select");t.querySelector("#btn-start").addEventListener("click",()=>{Ce(),le=0,we=parseInt(o.value),ye(`Starting GPU compute video: ${a.value} mode=${o.value}`,"info"),wt(e,r,n,a,o)}),t.querySelector("#btn-stop").addEventListener("click",()=>{Ce(),r.textContent="STOPPED",r.className="badge badge-info",ye("Rendering stopped","warn")})}const xt=Object.freeze(Object.defineProperty({__proto__:null,render:ht},Symbol.toStringTag,{value:"Module"}));let ee=null;function h(t,e=""){if(!ee)return;const r=document.createElement("div");r.className=`log-entry ${e}`,r.textContent=t,ee.appendChild(r),ee.scrollTop=ee.scrollHeight}async function St(){if(ee.innerHTML="",h("═══ AETHER WEBGPU DIAGNOSTICS ═══","info"),h(`Timestamp: ${new Date().toISOString()}`,""),!await Pt())return;const e=await H();if(!e){h("Cannot proceed: GPU not ready","err");return}h("",""),h("── MEMORY TEST ──","info");const r=await I(e);j(r);const n=Math.floor(e.limits.maxBufferSize/1048576);h(`Attempting to allocate buffer at reported max: ${n} MB`,"");try{const a=r.createBuffer({size:e.limits.maxBufferSize,usage:GPUBufferUsage.STORAGE});h("Buffer allocation at max: SUCCESS","ok"),a.destroy()}catch(a){h(`Buffer allocation at max: FAILED — ${a.message}`,"warn");for(const o of[256,128,64,32])try{const s=r.createBuffer({size:o*1048576,usage:GPUBufferUsage.STORAGE});h(`Largest successful allocation: ${o} MB`,"ok"),s.destroy();break}catch{continue}}h("",""),h("── COMPUTE THROUGHPUT ──","info");for(const a of[64,128,256]){const o=C.fromData(r,new Float32Array(a*a).fill(1),[a,a]),s=C.fromData(r,new Float32Array(a*a).fill(1),[a,a]),i=new C(r,[a,a]),u=r.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),c=r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[u]}),compute:{module:r.createShaderModule({code:de}),entryPoint:"main"}}),l=await ae(`matmul ${a}×${a}`,async()=>{const d=r.createBuffer({size:12,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),f=new ArrayBuffer(12);new Uint32Array(f).set([a,a,a]),r.queue.writeBuffer(d,0,f);const p=r.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:o.buffer}},{binding:2,resource:{buffer:s.buffer}},{binding:3,resource:{buffer:i.buffer}}]}),g=r.createCommandEncoder(),v=g.beginComputePass();v.setPipeline(c),v.setBindGroup(0,p);const b=Math.ceil(a/16);v.dispatchWorkgroups(b,b,1),v.end(),r.queue.submit([g.finish()]),d.destroy()},30,2*a*a*a);h(ne(l),"ok"),o.destroy(),s.destroy(),i.destroy()}r.destroy(),h("",""),h("═══ DIAGNOSTICS COMPLETE ═══","info")}async function Pt(){const t=await pe();return Ie(t),h("── WEBGPU STATUS ──","info"),h(`${t.statusLabel} (Case ${t.case})`,t.ready?"ok":"err"),h(`Reason: ${t.reason}`,""),h(`Recommendation: ${t.recommendation}`,""),h("",""),h("── ENVIRONMENT ──","info"),h(`  URL: ${t.environment.url}`,""),h(`  Secure Context: ${t.environment.isSecureContext}`,t.environment.isSecureContext?"ok":"err"),h(`  Browser: ${t.environment.browserName} ${t.environment.browserVersion}`,""),h(`  OS: ${t.environment.osName} ${t.environment.osVersion}`,""),h(`  iOS: ${t.environment.isIOS}`,""),h(`  Safari: ${t.environment.isSafari}`,""),h(`  WebView: ${t.environment.isWebView}`,t.environment.isWebView?"err":""),h(`  navigator.gpu: ${t.gpu.navigatorGpuExists}`,t.gpu.navigatorGpuExists?"ok":"err"),t.gpu.adapterName&&(h(`  Adapter: ${t.gpu.adapterName}`,"ok"),h(`  Vendor: ${t.gpu.adapterVendor}`,"")),t.gpu.adapterError&&h(`  Adapter Error: ${t.gpu.adapterError}`,"err"),t.gpu.deviceError&&h(`  Device Error: ${t.gpu.deviceError}`,"err"),t.ready?!0:(h("",""),h("Cannot run GPU benchmarks. Fix the issue above first.","err"),!1)}function Ut(t){t.innerHTML=`
    <h2>Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      WebGPU root-cause analysis + real performance measurements. No synthetic data.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-diag">Run Full Diagnostics</button>
    </div>

    <div class="log" id="diag-log"></div>
  `,ee=t.querySelector("#diag-log"),t.querySelector("#btn-diag").addEventListener("click",()=>{St()})}const Ct=Object.freeze(Object.defineProperty({__proto__:null,render:Ut},Symbol.toStringTag,{value:"Module"}));class R{dims;ndim;size;strides;constructor(e){this.dims=typeof e=="number"?[e]:[...e],this.ndim=this.dims.length,this.size=this.dims.reduce((a,o)=>a*o,1);const r=new Array(this.ndim);let n=1;for(let a=this.ndim-1;a>=0;a--)r[a]=n,n*=this.dims[a];this.strides=r}equals(e){if(this.ndim!==e.ndim)return!1;for(let r=0;r<this.ndim;r++)if(this.dims[r]!==e.dims[r])return!1;return!0}isContiguous(){let e=1;for(let r=this.ndim-1;r>=0;r--){if(this.strides[r]!==e)return!1;e*=this.dims[r]}return!0}toString(){return`TensorShape([${this.dims.join(", ")}])`}static scalar(){return new R([1])}static from(...e){return new R(e)}}var z=(t=>(t.Float32="f32",t.Float16="f16",t.Int32="i32",t.Int8="i8",t.Uint8="u8",t))(z||{});const Mt={f32:{bytes:4,name:"f32"},f16:{bytes:2,name:"f16"},i32:{bytes:4,name:"i32"},i8:{bytes:1,name:"i8"},u8:{bytes:1,name:"u8"}};function Ye(t){return Mt[t].bytes}let N=null;async function Bt(){if(N)return N;if(!navigator.gpu)throw new Error("WebGPU not supported in this browser");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No GPU adapter available");const e=t.limits,r=new Set(t.features),n=await t.requestDevice({requiredLimits:{}});return n.lost.then(a=>{console.error("WebGPU device lost:",a.message),N=null}),N={adapter:t,device:n,limits:{maxBufferSize:e.maxBufferSize,maxTextureDimension1D:e.maxTextureDimension1D,maxTextureDimension2D:e.maxTextureDimension2D,maxTextureDimension3D:e.maxTextureDimension3D,maxComputeWorkgroupStorageSize:e.maxComputeWorkgroupStorageSize,maxComputeInvocationsPerWorkgroup:e.maxComputeInvocationsPerWorkgroup,maxStorageBufferBindingSize:e.maxStorageBufferBindingSize,maxUniformBufferBindingSize:e.maxUniformBufferBindingSize,maxStorageBuffersPerShaderStage:e.maxStorageBuffersPerShaderStage,maxComputeWorkgroupSizeX:e.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:e.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:e.maxComputeWorkgroupSizeZ,maxComputeWorkgroupsPerDimension:e.maxComputeWorkgroupsPerDimension,maxBindingsPerBindGroup:e.maxBindingsPerBindGroup,maxSampledTexturesPerShaderStage:e.maxSampledTexturesPerShaderStage,maxSamplersPerShaderStage:e.maxSamplersPerShaderStage,maxUniformBuffersPerShaderStage:e.maxUniformBuffersPerShaderStage,minUniformBufferOffsetAlignment:e.minUniformBufferOffsetAlignment,minStorageBufferOffsetAlignment:e.minStorageBufferOffsetAlignment,maxColorAttachments:e.maxColorAttachments,maxTextureArrayLayers:e.maxTextureArrayLayers},features:r},N}function B(){if(!N)throw new Error("GPUContext not initialized. Call initGPUContext() first.");return N}function At(){N&&(N.device.destroy(),N=null)}class te{shape;dtype;gpuBuffer;byteSize;_mapped=!1;constructor(e,r,n){this.shape=e,this.dtype=r,this.byteSize=e.size*Ye(r),this.gpuBuffer=n??B().device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}static fromData(e,r,n=z.Float32){const a=B(),o=new te(e,n);return a.device.queue.writeBuffer(o.gpuBuffer,0,r.buffer,r.byteOffset,r.byteLength),o}async readback(){const e=B(),r=e.device.createBuffer({size:this.byteSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),n=e.device.createCommandEncoder();n.copyBufferToBuffer(this.gpuBuffer,0,r,0,this.byteSize),e.device.queue.submit([n.finish()]),await r.mapAsync(GPUMapMode.READ);const a=new Float32Array(r.getMappedRange().slice(0));return r.unmap(),r.destroy(),a}destroy(){this.gpuBuffer.destroy()}}class w{shape;dtype;buffer;constructor(e,r=z.Float32,n){this.shape=e,this.dtype=r,this.buffer=n??new te(e,r)}static fromFloat32(e,r){const n=e instanceof Float32Array?e:new Float32Array(e),a=new R(r);return new w(a,z.Float32,te.fromData(a,n,z.Float32))}static fromInt32(e,r){const n=e instanceof Int32Array?e:new Int32Array(e),a=new R(r);return new w(a,z.Int32,te.fromData(a,n,z.Int32))}static zeros(e,r=z.Float32){const n=new R(e),a=n.size*Ye(r),s=B().device.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});new Uint8Array(s.getMappedRange()).fill(0),s.unmap();const i=new te(n,r,s);return new w(n,r,i)}static ones(e,r=z.Float32){const n=new R(e).size,a=new Float32Array(n).fill(1);return w.fromFloat32(a,e)}static randn(e){const r=new R(e).size,n=new Float32Array(r);for(let a=0;a<r;a++){const o=Math.random(),s=Math.random();n[a]=Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*s)}return w.fromFloat32(n,e)}async readback(){return this.buffer.readback()}destroy(){this.buffer.destroy()}}class Et{cache=new Map;getOrCreate(e,r,n){if(this.cache.has(e))return this.cache.get(e);const a=B(),o=a.device.createComputePipeline({layout:a.device.createPipelineLayout({bindGroupLayouts:[n]}),compute:{module:a.device.createShaderModule({code:r}),entryPoint:"main"}});return this.cache.set(e,o),o}get(e){return this.cache.get(e)}clear(){this.cache.clear()}}const Tt=`
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
`,kt=`
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
`,Dt=`
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
`,Nt=`
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
`,Wt=`
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
`,_t=`
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
`,zt=`
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
`;function Lt(t,e,r,n,a){const o=new Float32Array(r*n);for(let s=0;s<r;s++)for(let i=0;i<n;i++){let u=0;for(let c=0;c<a;c++)u+=t[s*a+c]*e[c*n+i];o[s*n+i]=u}return o}function Ft(t,e){const r=new Float32Array(t.length);for(let n=0;n<t.length;n++)r[n]=t[n]+e[n];return r}function Rt(t,e){const r=new Float32Array(t.length);for(let n=0;n<t.length;n++)r[n]=t[n]*e[n];return r}function qt(t,e,r=1e-6){const n=t.length;let a=0;for(let i=0;i<n;i++)a+=t[i]*t[i];const o=Math.sqrt(a/n+r),s=new Float32Array(n);for(let i=0;i<n;i++)s[i]=t[i]/o*e[i];return s}function Ht(t,e,r,n=1e-6){const a=t.length;let o=0;for(let c=0;c<a;c++)o+=t[c];o/=a;let s=0;for(let c=0;c<a;c++){const l=t[c]-o;s+=l*l}s/=a;const i=1/Math.sqrt(s+n),u=new Float32Array(a);for(let c=0;c<a;c++)u[c]=(t[c]-o)*i*e[c]+r[c];return u}function It(t,e,r){const n=new Float32Array(t.length);for(let a=0;a<e;a++){const o=a*r;let s=-1e30;for(let u=0;u<r;u++)t[o+u]>s&&(s=t[o+u]);let i=0;for(let u=0;u<r;u++)n[o+u]=Math.exp(t[o+u]-s),i+=n[o+u];for(let u=0;u<r;u++)n[o+u]/=i}return n}function jt(t,e,r,n=1e4){const a=new Float32Array(t.length);a.set(t);for(let o=0;o<e*r/2;o++){const s=Math.floor(o/(r/2)),i=o%(r/2),u=1/Math.pow(n,i/r),c=s*u,l=Math.cos(c),d=Math.sin(c),f=o*2,p=o*2+1,g=a[f],v=a[p];a[f]=g*l-v*d,a[p]=g*d+v*l}return a}function Kt(t,e,r,n,a,o,s,i,u){const c=a-i+1,l=o-u+1,d=new Float32Array(r*s*c*l);for(let f=0;f<r;f++)for(let p=0;p<s;p++)for(let g=0;g<c;g++)for(let v=0;v<l;v++){let b=0;for(let y=0;y<n;y++)for(let x=0;x<i;x++)for(let P=0;P<u;P++)b+=t[((f*n+y)*a+g+x)*o+v+P]*e[((p*n+y)*i+x)*u+P];d[((f*s+p)*c+g)*l+v]=b}return d}function Vt(t,e,r){const n=new Float32Array(e*r);for(let a=0;a<e;a++)for(let o=0;o<r;o++)n[o*e+a]=t[a*r+o];return n}function Yt(t,e,r,n,a,o){const s=new Float32Array(n*a*o);for(let i=0;i<a;i++)for(let u=0;u<n;u++){const c=u*e/n,l=i*r/a,d=Math.floor(c),f=Math.floor(l),p=Math.min(d+1,e-1),g=Math.min(f+1,r-1),v=c-d,b=l-f;for(let y=0;y<o;y++){const x=t[(f*e+d)*o+y],P=t[(f*e+p)*o+y],A=t[(g*e+d)*o+y],M=t[(g*e+p)*o+y];s[(i*n+u)*o+y]=x*(1-v)*(1-b)+P*v*(1-b)+A*(1-v)*b+M*v*b}}return s}const W=new Et;function L(t){return B().device.createBindGroupLayout({entries:Array.from({length:t},(r,n)=>({binding:n,visibility:GPUShaderStage.COMPUTE,buffer:n===0?{type:"uniform"}:{type:"storage"}}))})}function me(t){const e=B(),r=e.device.createBuffer({size:Math.ceil(t.byteLength/16)*16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.device.queue.writeBuffer(r,0,t),r}function V(t,e,r,n,a,o){const s=B(),i=me(a),u=[{binding:0,resource:{buffer:i}},...n.map((d,f)=>({binding:f+1,resource:{buffer:d.buffer.gpuBuffer}}))],c=s.device.createBindGroup({layout:r,entries:u}),l=t.beginComputePass();return l.setPipeline(e),l.setBindGroup(0,c),l.dispatchWorkgroups(o),l.end(),i}async function Q(t,e,r,n,a){const o=B(),s=w.zeros([r,n]),i=L(4),u=W.getOrCreate("matmul",Tt,i),c=new ArrayBuffer(12),l=new Uint32Array(c);l[0]=r,l[1]=n,l[2]=a;const d=o.device.createCommandEncoder();return V(d,u,i,[t,e,s],c,Math.ceil(r/16)*Math.ceil(n/16)),o.device.queue.submit([d.finish()]),s}function J(t,e,r,n,a){return Lt(t,e,r,n,a)}async function Me(t,e){const r=B(),n=w.zeros([t.shape.size]),a=L(4),o=W.getOrCreate("add",$t,a),s=new ArrayBuffer(4);new Uint32Array(s)[0]=t.shape.size;const i=r.device.createCommandEncoder();return V(i,o,a,[t,e,n],s,Math.ceil(t.shape.size/256)),r.device.queue.submit([i.finish()]),n}function Be(t,e){return Ft(t,e)}async function Ae(t,e){const r=B(),n=w.zeros([t.shape.size]),a=L(4),o=W.getOrCreate("multiply",kt,a),s=new ArrayBuffer(4);new Uint32Array(s)[0]=t.shape.size;const i=r.device.createCommandEncoder();return V(i,o,a,[t,e,n],s,Math.ceil(t.shape.size/256)),r.device.queue.submit([i.finish()]),n}function Ee(t,e){return Rt(t,e)}async function Te(t,e,r=1e-6){const n=B(),a=t.shape.size,o=w.zeros([a]),s=L(4),i=W.getOrCreate("rms_norm",Gt,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=a,new Float32Array(u)[1]=r;const c=n.device.createCommandEncoder();return V(c,i,s,[t,e,o],u,1),n.device.queue.submit([c.finish()]),o}function $e(t,e,r=1e-6){return qt(t,e,r)}async function ke(t,e,r,n=1e-6){const a=B(),o=t.shape.size,s=w.zeros([o]),i=a.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=W.getOrCreate("layer_norm",Ot,i),c=new ArrayBuffer(8);new Uint32Array(c)[0]=o,new Float32Array(c)[1]=n;const l=B(),d=me(c),f=l.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:t.buffer.gpuBuffer}},{binding:2,resource:{buffer:e.buffer.gpuBuffer}},{binding:3,resource:{buffer:r.buffer.gpuBuffer}},{binding:4,resource:{buffer:s.buffer.gpuBuffer}}]}),p=l.device.createCommandEncoder(),g=p.beginComputePass();return g.setPipeline(u),g.setBindGroup(0,f),g.dispatchWorkgroups(1),g.end(),l.device.queue.submit([p.finish()]),s}function Ge(t,e,r,n=1e-6){return Ht(t,e,r,n)}async function Oe(t,e,r){const n=B(),a=w.zeros([e,r]),o=n.device.createCommandEncoder();o.copyBufferToBuffer(t.buffer.gpuBuffer,0,a.buffer.gpuBuffer,0,e*r*4);const s=L(2),i=W.getOrCreate("softmax",Dt,s),u=new ArrayBuffer(8);new Uint32Array(u)[0]=e,new Uint32Array(u)[1]=r;const c=me(u),l=n.device.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:a.buffer.gpuBuffer}}]}),d=o.beginComputePass();return d.setPipeline(i),d.setBindGroup(0,l),d.dispatchWorkgroups(Math.ceil(e)),d.end(),n.device.queue.submit([o.finish()]),a}function De(t,e,r){return It(t,e,r)}async function Ne(t,e,r,n=1e4){const a=B(),o=w.zeros([e,r]),s=a.device.createCommandEncoder();s.copyBufferToBuffer(t.buffer.gpuBuffer,0,o.buffer.gpuBuffer,0,e*r*4);const i=L(2),u=W.getOrCreate("rope",Nt,i),c=new ArrayBuffer(12);new Uint32Array(c)[0]=e,new Uint32Array(c)[1]=r,new Float32Array(c)[2]=n;const l=me(c),d=a.device.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:o.buffer.gpuBuffer}}]}),f=s.beginComputePass();return f.setPipeline(u),f.setBindGroup(0,d),f.dispatchWorkgroups(Math.ceil(e*r/2/256)),f.end(),a.device.queue.submit([s.finish()]),o}function We(t,e,r,n=1e4){return jt(t,e,r,n)}async function _e(t,e,r,n,a,o,s,i,u){const c=B(),l=a-i+1,d=o-u+1,f=w.zeros([r,s,l,d]),p=L(4),g=W.getOrCreate("conv2d",Wt,p),v=new ArrayBuffer(36),b=new Uint32Array(v);b[0]=r,b[1]=n,b[2]=a,b[3]=o,b[4]=s,b[5]=i,b[6]=u,b[7]=l,b[8]=d;const y=c.device.createCommandEncoder();return V(y,g,p,[t,e,f],v,r*s),c.device.queue.submit([y.finish()]),f}function ze(t,e,r,n,a,o,s,i,u){return Kt(t,e,r,n,a,o,s,i,u)}async function Le(t,e,r){const n=B(),a=w.zeros([r,e]),o=L(3),s=W.getOrCreate("transpose_2d",_t,o),i=new ArrayBuffer(8);new Uint32Array(i)[0]=e,new Uint32Array(i)[1]=r;const u=n.device.createCommandEncoder();return V(u,s,o,[t,a],i,Math.ceil(e/16)*Math.ceil(r/16)),n.device.queue.submit([u.finish()]),a}function Fe(t,e,r){return Vt(t,e,r)}async function Re(t,e,r,n,a,o){const s=B(),i=w.zeros([a*n*o]),u=L(3),c=W.getOrCreate("interpolate_bilinear",zt,u),l=new ArrayBuffer(20),d=new Uint32Array(l);d[0]=e,d[1]=r,d[2]=n,d[3]=a,d[4]=o;const f=s.device.createCommandEncoder();return V(f,c,u,[t,i],l,Math.ceil(n/16)*Math.ceil(a/16)),s.device.queue.submit([f.finish()]),i}function qe(t,e,r,n,a,o){return Yt(t,e,r,n,a,o)}let re=null,fe=null;function O(t,e=""){if(!re)return;const r=document.createElement("div");r.className=`log-entry ${e}`,r.textContent=t,re.appendChild(r),re.scrollTop=re.scrollHeight}function $(t,e,r=.001){if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++){const a=Math.abs(t[n]-e[n]),o=Math.max(Math.abs(t[n]),Math.abs(e[n]),1e-8);if(a/o>r)return!1}return!0}async function k(t,e,r=20){for(let a=0;a<3;a++)e();const n=[];for(let a=0;a<r;a++){const o=performance.now();e(),n.push(performance.now()-o)}return n.reduce((a,o)=>a+o,0)/n.length}async function G(t,e,r=20){const n=[];for(let a=0;a<Math.min(5,r);a++)await e();for(let a=0;a<r;a++){const o=performance.now();await e(),n.push(performance.now()-o)}return n.reduce((a,o)=>a+o,0)/n.length}function Xt(t){if(!fe)return;const e=document.createElement("tr");e.innerHTML=`
    <td style="font-weight:600">${t.name}</td>
    <td style="font-family:var(--mono);font-size:12px">${t.shape}</td>
    <td style="font-family:var(--mono);font-size:12px">${t.cpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px">${t.gpuMs.toFixed(2)} ms</td>
    <td style="font-family:var(--mono);font-size:12px;color:${t.speedup>=1?"var(--green)":"var(--red)"}">
      ${t.speedup.toFixed(1)}×
    </td>
    <td><span class="badge ${t.correct?"badge-pass":"badge-fail"}">${t.correct?"PASS":"FAIL"}</span></td>
    <td style="font-family:var(--mono);font-size:12px">${t.tolerance.toExponential(1)}</td>
  `,fe.appendChild(e)}async function Zt(){re.innerHTML="",fe.innerHTML="",O("═══ TENSOR RUNTIME BENCHMARKS ═══","info"),O("Initializing WebGPU...","");let t;try{t=await Bt()}catch(n){O(`FATAL: ${n.message}`,"err"),O("WebGPU is not available. Cannot run GPU benchmarks.","err");return}O(`GPU: ${t.adapter.name??"Unknown"}`,"ok"),O(`Running benchmarks...
`,"");const e=[];{const s=w.randn([64,64]),i=w.randn([64,64]),u=await s.readback(),c=await i.readback(),l=await k("matmul 64",()=>J(u,c,64,64,64)),d=await G("matmul 64",async()=>{(await Q(s,i,64,64,64)).destroy()}),f=await(await Q(s,i,64,64,64)).readback(),p=J(u,c,64,64,64),g=$(p,f),v=Math.max(...Array.from(p).map((b,y)=>Math.abs(b-f[y])));e.push({name:"Matmul",shape:"64×64 @ 64×64",cpuMs:l,gpuMs:d,speedup:l/d,correct:g,tolerance:v}),s.destroy(),i.destroy()}{const s=w.randn([256,256]),i=w.randn([256,256]),u=await s.readback(),c=await i.readback(),l=await k("matmul 256",()=>J(u,c,256,256,256),10),d=await G("matmul 256",async()=>{(await Q(s,i,256,256,256)).destroy()}),f=await(await Q(s,i,256,256,256)).readback(),p=J(u,c,256,256,256),g=$(p,f),v=Math.max(...Array.from(p).map((b,y)=>Math.abs(b-f[y])));e.push({name:"Matmul",shape:"256×256 @ 256×256",cpuMs:l,gpuMs:d,speedup:l/d,correct:g,tolerance:v}),s.destroy(),i.destroy()}{const s=w.randn([512,512]),i=w.randn([512,512]),u=await s.readback(),c=await i.readback(),l=await k("matmul 512",()=>J(u,c,512,512,512),5),d=await G("matmul 512",async()=>{(await Q(s,i,512,512,512)).destroy()}),f=await(await Q(s,i,512,512,512)).readback(),p=J(u,c,512,512,512),g=$(p,f),v=Math.max(...Array.from(p).map((b,y)=>Math.abs(b-f[y])));e.push({name:"Matmul",shape:"512×512 @ 512×512",cpuMs:l,gpuMs:d,speedup:l/d,correct:g,tolerance:v}),s.destroy(),i.destroy()}{const a=w.randn([1e6]),o=w.randn([1e6]),s=await a.readback(),i=await o.readback(),u=await k("add 1M",()=>Be(s,i)),c=await G("add 1M",async()=>{(await Me(a,o)).destroy()}),l=await(await Me(a,o)).readback(),d=Be(s,i),f=$(d,l),p=Math.max(...Array.from(d).map((g,v)=>Math.abs(g-l[v])));e.push({name:"Add",shape:"[1000000]",cpuMs:u,gpuMs:c,speedup:u/c,correct:f,tolerance:p}),a.destroy(),o.destroy()}{const a=w.randn([1e6]),o=w.randn([1e6]),s=await a.readback(),i=await o.readback(),u=await k("mul 1M",()=>Ee(s,i)),c=await G("mul 1M",async()=>{(await Ae(a,o)).destroy()}),l=await(await Ae(a,o)).readback(),d=Ee(s,i),f=$(d,l),p=Math.max(...Array.from(d).map((g,v)=>Math.abs(g-l[v])));e.push({name:"Multiply",shape:"[1000000]",cpuMs:u,gpuMs:c,speedup:u/c,correct:f,tolerance:p}),a.destroy(),o.destroy()}{const a=w.randn([1024]),o=w.ones([1024]),s=await a.readback(),i=await o.readback(),u=await k("rmsnorm",()=>$e(s,i)),c=await G("rmsnorm",async()=>{(await Te(a,o)).destroy()}),l=await(await Te(a,o)).readback(),d=$e(s,i),f=$(d,l),p=Math.max(...Array.from(d).map((g,v)=>Math.abs(g-l[v])));e.push({name:"RMSNorm",shape:"[1024]",cpuMs:u,gpuMs:c,speedup:u/c,correct:f,tolerance:p}),a.destroy(),o.destroy()}{const a=w.randn([1024]),o=w.ones([1024]),s=w.zeros([1024]),i=await a.readback(),u=await o.readback(),c=await s.readback(),l=await k("layernorm",()=>Ge(i,u,c)),d=await G("layernorm",async()=>{(await ke(a,o,s)).destroy()}),f=await(await ke(a,o,s)).readback(),p=Ge(i,u,c),g=$(p,f),v=Math.max(...Array.from(p).map((b,y)=>Math.abs(b-f[y])));e.push({name:"LayerNorm",shape:"[1024]",cpuMs:l,gpuMs:d,speedup:l/d,correct:g,tolerance:v}),a.destroy(),o.destroy(),s.destroy()}{const o=w.randn([32,128]),s=await o.readback(),i=await k("softmax",()=>De(new Float32Array(s),32,128)),u=await G("softmax",async()=>{(await Oe(w.fromFloat32(new Float32Array(s),[32,128]),32,128)).destroy()}),c=await(await Oe(w.fromFloat32(new Float32Array(s),[32,128]),32,128)).readback(),l=De(new Float32Array(s),32,128),d=$(l,c),f=Math.max(...Array.from(l).map((p,g)=>Math.abs(p-c[g])));e.push({name:"Softmax",shape:"[32, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:f}),o.destroy()}{const o=w.randn([16,128]),s=await o.readback(),i=await k("rope",()=>We(new Float32Array(s),16,128)),u=await G("rope",async()=>{(await Ne(w.fromFloat32(new Float32Array(s),[16,128]),16,128)).destroy()}),c=await(await Ne(w.fromFloat32(new Float32Array(s),[16,128]),16,128)).readback(),l=We(new Float32Array(s),16,128),d=$(l,c),f=Math.max(...Array.from(l).map((p,g)=>Math.abs(p-c[g])));e.push({name:"RoPE",shape:"[16, 128]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:f}),o.destroy()}{const l=w.randn([1,3,16,16]),d=w.randn([4,3,3,3]),f=await l.readback(),p=await d.readback(),g=await k("conv2d",()=>ze(f,p,1,3,16,16,4,3,3)),v=await G("conv2d",async()=>{(await _e(l,d,1,3,16,16,4,3,3)).destroy()}),b=await(await _e(l,d,1,3,16,16,4,3,3)).readback(),y=ze(f,p,1,3,16,16,4,3,3),x=$(y,b),P=Math.max(...Array.from(y).map((A,M)=>Math.abs(A-b[M])));e.push({name:"Conv2D",shape:"[1,3,16,16] k=3→4",cpuMs:g,gpuMs:v,speedup:g/v,correct:x,tolerance:P}),l.destroy(),d.destroy()}{const o=w.randn([256,256]),s=await o.readback(),i=await k("transpose",()=>Fe(s,256,256)),u=await G("transpose",async()=>{(await Le(o,256,256)).destroy()}),c=await(await Le(o,256,256)).readback(),l=Fe(s,256,256),d=$(l,c),f=Math.max(...Array.from(l).map((p,g)=>Math.abs(p-c[g])));e.push({name:"Transpose",shape:"[256, 256]",cpuMs:i,gpuMs:u,speedup:i/u,correct:d,tolerance:f}),o.destroy()}{const u=w.randn([3072]),c=await u.readback(),l=await k("interp",()=>qe(c,32,32,64,64,3)),d=await G("interp",async()=>{(await Re(u,32,32,64,64,3)).destroy()}),f=await(await Re(u,32,32,64,64,3)).readback(),p=qe(c,32,32,64,64,3),g=$(p,f),v=Math.max(...Array.from(p).map((b,y)=>Math.abs(b-f[y])));e.push({name:"Interpolate",shape:"32×32 → 64×64 ch=3",cpuMs:l,gpuMs:d,speedup:l/d,correct:g,tolerance:v}),u.destroy()}O("",""),O("═══ RESULTS ═══","info");for(const n of e){Xt(n);const a=n.correct?"✓":"✗",o=n.correct?"ok":"err";O(`${a} ${n.name} (${n.shape}): CPU ${n.cpuMs.toFixed(2)} ms | GPU ${n.gpuMs.toFixed(2)} ms | ${n.speedup.toFixed(1)}× | max diff ${n.tolerance.toExponential(1)}`,o)}const r=e.filter(n=>n.correct).length;O("",""),O(`═══ ${r}/${e.length} CORRECT ═══`,r===e.length?"ok":"err"),At()}function Qt(t){t.innerHTML=`
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
  `,re=t.querySelector("#bench-log"),fe=t.querySelector("#bench-tbody"),t.querySelector("#btn-run-bench").addEventListener("click",()=>{Zt()})}const Jt=Object.freeze(Object.defineProperty({__proto__:null,render:Qt},Symbol.toStringTag,{value:"Module"}));let F=null,ue="";function er(t){const e=t.environment,r=t.gpu,n=t.case==="D"?"var(--green)":t.case==="E"?"var(--yellow)":"var(--red)";let a=`
    <div style="text-align:center;margin:20px 0">
      <div style="font-size:28px;font-weight:800;color:${n};letter-spacing:1px">${t.statusLabel}</div>
      <div style="font-size:14px;color:var(--text-dim);margin-top:8px">Case ${t.case}</div>
    </div>

    <div class="card" style="border-color:${n}">
      <div class="card-title" style="margin-bottom:8px">Diagnosis</div>
      <p style="font-size:13px;color:var(--text);line-height:1.6">${t.reason}</p>
      <p style="font-size:13px;color:var(--text);margin-top:10px;font-weight:600;line-height:1.6">${t.recommendation}</p>
    </div>
  `;if(a+=`
    <h3>Environment</h3>
    <div class="card">
      <div class="row"><span class="row-label">URL</span><span class="row-value" style="font-size:10px;word-break:break-all;max-width:55%;text-align:right">${e.url}</span></div>
      <div class="row"><span class="row-label">Protocol</span><span class="row-value">${e.protocol}</span></div>
      <div class="row"><span class="row-label">Hostname</span><span class="row-value">${e.hostname}</span></div>
      <div class="row"><span class="row-label">Secure Context</span><span class="row-value" style="color:${e.isSecureContext?"var(--green)":"var(--red)"}">${e.isSecureContext?"Yes ✓":"No ✗"}</span></div>
      <div class="row"><span class="row-label">Browser</span><span class="row-value">${e.browserName} ${e.browserVersion}</span></div>
      <div class="row"><span class="row-label">OS</span><span class="row-value">${e.osName} ${e.osVersion}</span></div>
      <div class="row"><span class="row-label">Platform</span><span class="row-value">${e.platform}</span></div>
      <div class="row"><span class="row-label">iOS Device</span><span class="row-value">${e.isIOS?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">Safari</span><span class="row-value">${e.isSafari?"Yes":"No"}</span></div>
      <div class="row"><span class="row-label">WebView / In-App Browser</span><span class="row-value" style="color:${e.isWebView?"var(--red)":"var(--green)"}">${e.isWebView?"Yes (BLOCKED)":"No"}</span></div>
      <div class="row"><span class="row-label">Standalone PWA</span><span class="row-value">${e.isStandalone?"Yes":"No"}</span></div>
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
    `),r.adapterError&&(a+=`<div class="row"><span class="row-label">Adapter Error</span><span class="row-value" style="color:var(--red)">${r.adapterError}</span></div>`),r.deviceError&&(a+=`<div class="row"><span class="row-label">Device Error</span><span class="row-value" style="color:var(--red)">${r.deviceError}</span></div>`),a+="</div>",r.limits){const o=r.limits,s=i=>i>=1073741824?`${(i/1073741824).toFixed(1)} GB`:i>=1048576?`${(i/1048576).toFixed(1)} MB`:i>=1024?`${(i/1024).toFixed(1)} KB`:`${i} B`;a+=`
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
  `,a}function tr(t){t.innerHTML=`
    <h2>WebGPU Diagnostics</h2>
    <p style="color:var(--text-dim);margin-bottom:16px;font-size:13px">
      Complete root-cause analysis of WebGPU availability on this device and browser.
    </p>

    <div class="btn-row">
      <button class="btn" id="btn-run-wgdiag">Run Diagnostics</button>
      <button class="btn btn-outline" id="btn-copy-report" disabled>Copy Diagnostics</button>
    </div>

    <div id="wgdiag-result"></div>
  `;const e=t.querySelector("#wgdiag-result");F=t.querySelector("#btn-copy-report"),t.querySelector("#btn-run-wgdiag").addEventListener("click",async()=>{e.innerHTML='<div class="card"><p style="color:var(--text-dim)">Running diagnostics...</p></div>',F.disabled=!0;const r=await pe();ue=Ie(r),e.innerHTML=er(r),F.disabled=!1}),F.addEventListener("click",async()=>{if(ue)try{await navigator.clipboard.writeText(ue),F.textContent="Copied!",setTimeout(()=>{F.textContent="Copy Diagnostics"},2e3)}catch{const r=document.createElement("textarea");r.value=ue,document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),F.textContent="Copied!",setTimeout(()=>{F.textContent="Copy Diagnostics"},2e3)}}),t.querySelector("#btn-run-wgdiag").dispatchEvent(new Event("click"))}const rr=Object.freeze(Object.defineProperty({__proto__:null,render:tr},Symbol.toStringTag,{value:"Module"})),xe=[{id:"device",label:"Device Test",module:ot},{id:"webgpudiag",label:"WebGPU Diag",module:rr},{id:"model",label:"Model Test",module:gt},{id:"tensor",label:"Tensor Bench",module:Jt},{id:"image",label:"Image Test",module:vt},{id:"video",label:"Video Test",module:xt},{id:"diag",label:"Diagnostics",module:Ct}];let Xe="device";function He(){const t=window.location.hash.replace("#","");return xe.some(e=>e.id===t)?t:t==="diagnostics/webgpu"||t==="webgpu"?"webgpudiag":"device"}function be(t){Xe=t,window.location.hash=t;const e=document.getElementById("nav"),r=document.getElementById("screen");e.querySelectorAll("button").forEach(a=>{a.classList.toggle("active",a.dataset.screen===t)});const n=xe.find(a=>a.id===t);n&&n.module.render(r)}function ar(){const t=document.getElementById("app");t.innerHTML=`
    <nav id="nav"></nav>
    <div class="screen" id="screen"></div>
  `;const e=document.getElementById("nav");document.getElementById("screen"),xe.forEach(n=>{const a=document.createElement("button");a.textContent=n.label,a.dataset.screen=n.id,a.addEventListener("click",()=>be(n.id)),e.appendChild(a)});const r=He();be(r),window.addEventListener("hashchange",()=>{const n=He();n!==Xe&&be(n)}),"serviceWorker"in navigator&&navigator.serviceWorker.register("/AETHER/sw.js").catch(()=>{})}ar();
