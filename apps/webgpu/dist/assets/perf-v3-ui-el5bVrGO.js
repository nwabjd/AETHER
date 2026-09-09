import{c as Lt,C as tt,h as et,a as ot,r as Ot,g as St}from"./index-CL5DjBM2.js";let nt=1;function Bt(t){nt=t}function at(){return nt}function kt(t){return t<=0||!Number.isFinite(t)||t<=nt?"UNMEASURABLE":t<5?"LOW":t<20?"MEDIUM":"HIGH"}const xt=500,Ct=1e3;function Q(t,e,r){const a=e/1e3;if(!(a>0)||!Number.isFinite(a)||!(t>0))return{value:null,capped:!1};const o=t/a/1e9;return Number.isFinite(o)?o>(r==="GFLOPS"?xt:Ct)?{value:null,capped:!0}:{value:o,capped:!1}:{value:null,capped:!1}}function Y(t,e){if(t.length===0)return 0;const r=Math.min(Math.floor(t.length*e),t.length-1);return t[r]}function st(t){return Y(t,.5)}const G={tensorCompute:.25,attention:.25,mlp:.2,memory:.1,imageProcessing:.1,videoProcessing:.05,sustainedPerf:.05};function It(t,e){return e==="UNMEASURABLE"?0:e==="LOW"?Math.min(rt(t),30):rt(t)}function rt(t){return t<=0||!Number.isFinite(t)?0:t<=2?100:t<=5?80:t<=10?60:t<=20?40:20}function H(t){if(t.length===0)return{category:"",score:0,tests:0,measurable:0,notes:"no tests"};const e=t[0].category;let r=0,a=0;for(const i of t)r+=It(i.estimatedPerOperationMs,i.confidence),i.confidence!=="UNMEASURABLE"&&a++;const o=Math.round(r/t.length);return{category:e,score:o,tests:t.length,measurable:a,notes:""}}function Nt(t){if(t.length===0)return{category:"memory",score:0,tests:0,measurable:0,notes:"no tests"};const e=t.filter(o=>o.allocated),r=e.length>0?Math.max(...e.map(o=>o.sizeMB)):0;let a=0;return r>=512?a=100:r>=384?a=85:r>=256?a=70:r>=128?a=50:r>=64?a=30:a=10,{category:"memory",score:a,tests:t.length,measurable:e.length,notes:`maxAlloc=${r}MB`}}function Ut(t){let e=100;return t>30?e=20:t>20?e=40:t>10?e=70:t>5&&(e=85),{category:"sustainedPerf",score:e,tests:1,measurable:1,notes:`drop=${t.toFixed(1)}%`}}function ct(t,e,r,a,o,i,u){const n=H(t),s=H(e),c=H(r),d=H(a),f=H(o),p=Nt(i),m=Ut(u),h=Math.round(n.score*G.tensorCompute+s.score*G.attention+c.score*G.mlp+p.score*G.memory+d.score*G.imageProcessing+f.score*G.videoProcessing+m.score*G.sustainedPerf);return{tensorCompute:n,memory:p,attention:s,mlp:c,imageProcessing:d,videoProcessing:f,sustainedPerf:m,overall:h}}function ut(t){const e=r=>r>=60?"GREEN":r>=35?"YELLOW":"RED";return{transformerInference:e(Math.max(t.tensorCompute.score,t.attention.score,t.mlp.score)),imageGeneration:e(Math.max(t.imageProcessing.score,t.tensorCompute.score)),vaeDecoding:e(Math.max(t.imageProcessing.score,t.memory.score)),videoLatent:e(Math.max(t.videoProcessing.score,t.memory.score)),temporalAttention:e(Math.max(t.videoProcessing.score,t.attention.score)),longContext:t.attention.score>=50&&t.memory.score>=50?"GREEN":t.attention.score>=30?"YELLOW":"RED"}}const Rt=`
@group(0) @binding(0) var<storage, read> input: array<f32>;
@group(0) @binding(1) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&input)) { return; }
  let x = input[i];
  let t = 0.7978845608 * (x + 0.044715 * x * x * x);
  output[i] = 0.5 * x * (1.0 + tanh(t));
}
`,dt=`
@group(0) @binding(0) var<storage, read> input: array<f32>;
@group(0) @binding(1) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&input)) { return; }
  let x = input[i];
  output[i] = x / (1.0 + exp(-x));
}
`,Pt=`
struct Uniforms { vocabSize: u32, hiddenDim: u32, numTokens: u32, pad: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> indices: array<u32>;
@group(0) @binding(2) var<storage, read> vocabTable: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u.numTokens * u.hiddenDim) { return; }
  let tokenIdx = i / u.hiddenDim;
  let dimIdx = i % u.hiddenDim;
  let vocabIdx = indices[tokenIdx];
  output[i] = vocabTable[vocabIdx * u.hiddenDim + dimIdx];
}
`,_t=`
struct Uniforms { frames: u32, height: u32, width: u32, channels: u32,
                 kernelSize: u32, outFrames: u32, pad0: u32, pad1: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  let outSize = u.outFrames * u.height * u.width * u.channels;
  if (i >= outSize) { return; }
  let c = i % u.channels;
  let w = (i / u.channels) % u.width;
  let h = (i / (u.channels * u.width)) % u.height;
  let t_out = i / (u.channels * u.width * u.height);
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.kernelSize; k++) {
    let t_in = t_out + k;
    if (t_in < u.frames) {
      let inIdx = t_in * u.height * u.width * u.channels + h * u.width * u.channels + w * u.channels + c;
      sum += input[inIdx] * weight[k * u.channels + c];
    }
  }
  output[i] = sum;
}
`;function Ft(t,e,r){const a=new ArrayBuffer(16),o=new Uint32Array(a);return o[0]=t>>>0,o[1]=e>>>0,o[2]=r>>>0,o[3]=0,a}function Tt(t,e,r,a,o,i){const u=new ArrayBuffer(32),n=new Uint32Array(u);return n[0]=t>>>0,n[1]=e>>>0,n[2]=r>>>0,n[3]=a>>>0,n[4]=o>>>0,n[5]=i>>>0,n[6]=0,n[7]=0,u}function F(){return St()}function lt(t,e,r){const a=F().createBuffer({size:e,usage:t,mappedAtCreation:!!r});return r&&new Uint8Array(a.getMappedRange()).set(new Uint8Array(r.buffer,r.byteOffset,r.byteLength)),a.unmap(),a}function w(t,e){return lt(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,t,e)}function P(t){return lt(GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,Math.max(t.byteLength,16),new Uint8Array(t))}function U(t,e){const r=F().createShaderModule({code:t});return F().createComputePipeline({layout:"auto",compute:{module:r,entryPoint:"main"}})}function I(t,e,r){const a=t.getBindGroupLayout(0);return F().createBindGroup({layout:a,entries:r.map((o,i)=>({binding:i,resource:{buffer:o}}))})}function O(t){let e=2654435769;for(let r=0;r<t.length;r++)e=e*1664525+1013904223>>>0,t[r]=e%2001/1e3-1}async function j(t,e){const r=F(),a=new tt(r),o=r.createCommandEncoder();for(let s=0;s<e;s++){const c=o.beginComputePass();t(c),c.end()}a.encode(o);const i=o.finish(),u=performance.now();try{r.queue.submit([i])}catch{return 0}et.onCommandBufferSubmitted("measurement");try{await ot(r,a,"v3-block")}catch{return 0}const n=performance.now()-u;return a.destroy(),Number.isFinite(n)&&n>=0?n:0}async function T(t,e=1e6){const r=at();let a=await j(t,1),o=1;a<=r&&(a=await j(t,100),o=100),a<=r&&(a=await j(t,1e4),o=1e4);const i=a/o;let u=Math.ceil(20/i);(!Number.isFinite(u)||u<=0)&&(u=1),u=Math.min(u,e);const n=Math.max(u,1);for(let b=0;b<3;b++)await j(t,n);const s=[];for(let b=0;b<7;b++)s.push(await j(t,n));const c=s.filter(b=>b>0&&Number.isFinite(b)),d=[...c].sort((b,g)=>b-g),f=st(d),p=c.length>0?c.reduce((b,g)=>b+g,0)/c.length:0,m=Y(d,.95),h=Y(d,.99),v=kt(f);return{reps:n,totalMs:f,medianMs:f,meanMs:p,p95:m,p99:h,confidence:v,samples:c}}function V(t,e,r,a,o,i,u,n,s,c){return{category:t,operation:e,workload:r,shape:a,repetitions:o.reps,totalMs:o.totalMs,estimatedPerOperationMs:i,medianMs:o.medianMs,p95Ms:o.p95,p99Ms:o.p99,timingMethod:"HOST_WALL_CLOCK_AMPLIFIED",confidence:o.confidence,correctnessPassed:u,throughput:n,throughputUnit:s,notes:c,measurable:o.confidence!=="UNMEASURABLE"}}async function Vt(t,e,r,a,o,i,u){const n=F(),s=new tt(n),c=n.createCommandEncoder(),d=c.beginComputePass();d.setPipeline(t),d.setBindGroup(0,e),d.dispatchWorkgroups(r,a,o),d.end(),s.encode(c),n.queue.submit([c.finish()]),et.onCommandBufferSubmitted("other"),await ot(n,s,"v3-correctness");const f=await Ot(i,u);return s.destroy(),f}function Gt(t,e,r=.02,a=.02){if(t.length!==e.length)return!1;let o=!0;for(let i=0;i<t.length;i++){const u=t[i],n=e[i],s=Math.abs(u-n),c=Math.abs(n)>1e-9?s/Math.abs(n):s;if(s>r&&c>a){o=!1;break}}return o}async function ft(t){const e=[],r=[{tokens:128,hidden:512},{tokens:256,hidden:512},{tokens:512,hidden:512},{tokens:128,hidden:768},{tokens:256,hidden:768},{tokens:128,hidden:1024},{tokens:256,hidden:1024}];for(const{tokens:a,hidden:o}of r){t?.(`matmul ${a}×${o} × ${o}×${o}`);const i=a,u=o,n=o,s=i*n*4,c=n*u*4,d=i*u*4,f=new Float32Array(i*n);O(f);const p=new Float32Array(n*u);O(p);const m=w(s,f),h=w(c,p),v=w(d),g=U(`
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x; let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.K; k++) { sum += A[row * u.K + k] * B[k * u.N + col]; }
  C[row * u.N + col] = sum;
}`),l=new ArrayBuffer(12);new Uint32Array(l).set([i,u,n]);const y=P(l),M=I(g,["uniform","read-only-storage","read-only-storage","storage"],[y,m,h,v]),S=Math.ceil(i/16),E=Math.ceil(u/16),A=await T($=>{$.setPipeline(g),$.setBindGroup(0,M),$.dispatchWorkgroups(S,E,1)}),B=A.totalMs,{value:k}=Q(2*i*u*n,B,"GFLOPS");let x=!1;try{const $=await Vt(g,M,S,E,1,v,d),L=Lt(f,p,i,u,n);x=Gt($,L)}catch{x=!1}e.push(V("TRANSFORMER","MatMul",`${a}×${o} × ${o}×${o}`,`[${a},${o}]×[${o},${o}]`,A,B,x,k,"GFLOPS",x?"":"correctness FAILED")),m.destroy(),h.destroy(),v.destroy(),y.destroy()}return e}async function pt(t){const e=[],r=[{hidden:512,heads:8,headDim:64,seqs:[64,128,256,512]},{hidden:768,heads:12,headDim:64,seqs:[64,128,256]}];for(const{hidden:a,heads:o,headDim:i,seqs:u}of r)for(const n of u){t?.(`attention hidden=${a} seq=${n}`);const s=1,c=i,d=n*n*4,f=n*c*4,p=new Float32Array(s*n*c*3);O(p);const m=w(p.byteLength,p),h=w(d),v=w(f),g=U(`
struct Uniforms { batch: u32, seq: u32, dim: u32, scale: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> QKV: array<f32>;
@group(0) @binding(2) var<storage, read_write> scores: array<f32>;
@group(0) @binding(3) var<storage, read_write> out: array<f32>;
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u.batch * u.seq) { return; }
  let b = i / u.seq; let row = i % u.seq;
  let seq = u.seq; let dim = u.dim;
  let qOff = (b * seq + row) * dim;
  // QK^T
  for (var j: u32 = 0u; j < seq; j++) {
    let kOff = (b * seq + j) * dim;
    var dot: f32 = 0.0;
    for (var d: u32 = 0u; d < dim; d++) { dot += QKV[qOff + d] * QKV[kOff + d]; }
    scores[b * seq * seq + row * seq + j] = dot * u.scale;
  }
  // Softmax (per row)
  var maxVal: f32 = -1e30;
  for (var j: u32 = 0u; j < seq; j++) {
    let v = scores[b * seq * seq + row * seq + j];
    if (v > maxVal) { maxVal = v; }
  }
  var sumExp: f32 = 0.0;
  for (var j: u32 = 0u; j < seq; j++) {
    let e = exp(scores[b * seq * seq + row * seq + j] - maxVal);
    scores[b * seq * seq + row * seq + j] = e;
    sumExp += e;
  }
  for (var j: u32 = 0u; j < seq; j++) {
    scores[b * seq * seq + row * seq + j] /= sumExp;
  }
  // PV
  for (var d: u32 = 0u; d < dim; d++) {
    var sum: f32 = 0.0;
    for (var j: u32 = 0u; j < seq; j++) {
      let vOff = (b * seq + j) * dim + d;
      sum += scores[b * seq * seq + row * seq + j] * QKV[vOff];
    }
    out[(b * seq + row) * dim + d] = sum;
  }
}`),l=1/Math.sqrt(c),y=new ArrayBuffer(16);new Uint32Array(y).set([s,n,c]),new Float32Array(y)[3]=l;const M=P(y),S=I(g,["uniform","read-only-storage","storage","storage"],[M,m,h,v]),E=Math.max(1,Math.ceil(s*n/64)),A=await T($=>{$.setPipeline(g),$.setBindGroup(0,S),$.dispatchWorkgroups(E,1,1)}),B=A.totalMs,k=4*s*n*n*c,{value:x}=Q(k,B,"GFLOPS");e.push(V("ATTENTION","Fused Attention",`hidden=${a} seq=${n}`,`[1,${n},${c}]`,A,B,!0,x,"GFLOPS","QK^T+softmax+PV fused")),m.destroy(),h.destroy(),v.destroy(),M.destroy()}return e}async function mt(t){const e=[],r=[{hidden:512,intermediate:2048,seqs:[128,256,512]},{hidden:768,intermediate:3072,seqs:[128,256]},{hidden:1024,intermediate:4096,seqs:[128]}],a=U(Rt);for(const{hidden:o,intermediate:i,seqs:u}of r)for(const n of u){t?.(`mlp hidden=${o} intermediate=${i} seq=${n}`);const s=new Float32Array(n*o);O(s);const c=new Float32Array(o*i);O(c);const d=new Float32Array(i*o);O(d);const f=w(s.byteLength,s),p=w(c.byteLength,c),m=w(n*i*4),h=w(n*i*4),v=w(n*o*4),g=U(`
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x; let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.K; k++) { sum += A[row * u.K + k] * B[k * u.N + col]; }
  C[row * u.N + col] = sum;
}`),l=new ArrayBuffer(12);new Uint32Array(l).set([n,i,o]);const y=P(l),M=I(g,["uniform","read-only-storage","read-only-storage","storage"],[y,f,p,m]),S=I(a,["read-only-storage","storage"],[m,h]),E=n*i,A=new ArrayBuffer(12);new Uint32Array(A).set([n,o,i]);const B=P(A),k=I(g,["uniform","read-only-storage","read-only-storage","storage"],[B,h,v,f]),x=await T(C=>{C.setPipeline(g),C.setBindGroup(0,M),C.dispatchWorkgroups(Math.ceil(n/16),Math.ceil(i/16),1),C.setPipeline(a),C.setBindGroup(0,S),C.dispatchWorkgroups(Math.ceil(E/256),1,1),C.setPipeline(g),C.setBindGroup(0,k),C.dispatchWorkgroups(Math.ceil(n/16),Math.ceil(o/16),1)}),$=x.totalMs,L=2*n*o*i+n*i+2*n*i*o,{value:N}=Q(L,$,"GFLOPS");e.push(V("MLP","Transformer MLP",`h=${o} int=${i} seq=${n}`,`[${n},${o}]`,x,$,!0,N,"GFLOPS","W1→GELU→W2")),f.destroy(),p.destroy(),m.destroy(),h.destroy(),v.destroy(),y.destroy(),B.destroy()}return e}async function gt(t){const e=[],a=U(`
struct Uniforms { N: u32, eps_bits: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x;
  if (row >= u.N) { return; }
  let cols = u.N;
  var ss: f32 = 0.0;
  for (var c: u32 = 0u; c < cols; c++) { let v = input[row * cols + c]; ss += v * v; }
  let rms = sqrt(ss / f32(cols) + bitcast<f32>(u.eps_bits));
  for (var c: u32 = 0u; c < cols; c++) {
    output[row * cols + c] = input[row * cols + c] / rms * weight[c];
  }
}`),o=[{hidden:512,seqs:[128,256,512]},{hidden:768,seqs:[128,256]},{hidden:1024,seqs:[128]},{hidden:2048,seqs:[128]}];for(const{hidden:i,seqs:u}of o)for(const n of u){t?.(`rmsnorm hidden=${i} seq=${n}`);const s=new Float32Array(n*i);O(s);const c=new Float32Array(i);for(let l=0;l<i;l++)c[l]=1;const d=w(s.byteLength,s),f=w(c.byteLength,c),p=w(s.byteLength),m=new ArrayBuffer(8);new Uint32Array(m).set([n,0]);const h=P(m),v=I(a,["uniform","read-only-storage","read-only-storage","storage"],[h,d,f,p]),b=await T(l=>{l.setPipeline(a),l.setBindGroup(0,v),l.dispatchWorkgroups(n,1,1)}),g=b.totalMs;e.push(V("TRANSFORMER","RMSNorm",`hidden=${i} seq=${n}`,`[${n},${i}]`,b,g,!0,null,"","")),d.destroy(),f.destroy(),p.destroy(),h.destroy()}return e}async function ht(t){const e=[],r=U(Pt),a=32e3,o=512,i=new Float32Array(a*o);O(i);const u=w(i.byteLength,i);for(const n of[128,256,512]){t?.(`embedding tokens=${n}`);const s=new Uint32Array(n);for(let g=0;g<n;g++)s[g]=Math.floor(Math.random()*a);const c=w(s.byteLength,s),d=w(n*o*4),f=P(Ft(a,o,n)),p=I(r,["uniform","read-only-storage","read-only-storage","storage"],[f,c,u,d]),m=await T(g=>{g.setPipeline(r),g.setBindGroup(0,p),g.dispatchWorkgroups(Math.ceil(n*o/256),1,1)}),h=m.totalMs,v=n*o*4+n*4,{value:b}=Q(v,h,"GB/s");e.push(V("TRANSFORMER","Embedding Lookup",`tokens=${n} vocab=${a} hidden=${o}`,`[${n}]→[${n},${o}]`,m,h,!0,b,"GB/s",`${(v/1048576).toFixed(1)} MiB touched`)),c.destroy(),d.destroy(),f.destroy()}return u.destroy(),e}async function Z(t,e,r,a,o,i,u){const n=[],s=U(e);for(const{hw:c,channels:d}of a){u?.(`${t} ${c}×${c}×${d}`);const f=c*c*d,p=new Float32Array(f);O(p);const m=new Float32Array(f);O(m);const h=w(f*4,p),v=w(f*4,m),b=w(f*4),g=I(s,r,[h,v,b]),l=await T(E=>{E.setPipeline(s),E.setBindGroup(0,g),E.dispatchWorkgroups(Math.ceil(f/256),1,1)}),y=l.totalMs,M=o(c,d),{value:S}=Q(M,y,i);n.push(V("IMAGE",t,`${c}×${c}×${d}`,`[${c},${c},${d}]`,l,y,!0,S,i,"")),h.destroy(),v.destroy(),b.destroy()}return n}async function bt(t){const e=[{hw:64,channels:4},{hw:128,channels:4},{hw:256,channels:4}],r="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] + b[i]; }",a="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] * b[i]; }",o=dt,i=["read-only-storage","read-only-storage","storage"],u=["read-only-storage","storage"],n=[];return n.push(...await Z("Elementwise Add",r,i,e,(s,c)=>s*s*c,"GFLOPS",t)),n.push(...await Z("Elementwise Multiply",a,i,e,(s,c)=>s*s*c,"GFLOPS",t)),n.push(...await Z("SiLU Activation",o,u,e,(s,c)=>s*s*c,"GFLOPS",t)),n}async function vt(t){const e=[],r=U(dt),o=U(`
struct Uniforms { inC: u32, outC: u32, H: u32, W: u32, kH: u32, kW: u32, oH: u32, oW: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x; let outSize = u.outC * u.oH * u.oW;
  if (i >= outSize) { return; }
  let ow = i % u.oW; let oh = (i / u.oW) % u.oH; let oc = i / (u.oW * u.oH);
  var sum: f32 = 0.0;
  for (var ic: u32 = 0u; ic < u.inC; ic++) {
    for (var kh: u32 = 0u; kh < u.kH; kh++) {
      for (var kw: u32 = 0u; kw < u.kW; kw++) {
        let ih = oh + kh; let iw = ow + kw;
        if (ih < u.H && iw < u.W) {
          sum += input[ic * u.H * u.W + ih * u.W + iw] * weight[(oc * u.inC + ic) * u.kH * u.kW + kh * u.kW + kw];
        }
      }
    }
  }
  output[i] = sum;
}`),i=[{inC:4,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:16,H:64,W:64,kH:3,kW:3}],u=[{hw:64,channels:4},{hw:128,channels:4}];for(const n of u){t?.(`vae ${n.hw}×${n.hw}×${n.channels}`);const s=[],c=[],d=[];let f=n.channels,p=n.hw,m=n.hw;const h=new Float32Array(f*p*m);O(h);let v=w(h.byteLength,h);s.push(v);for(const l of i){const y=p-l.kH+1,M=m-l.kW+1,S=new ArrayBuffer(32);new Uint32Array(S).set([l.inC,l.outC,p,m,l.kH,l.kW,y,M]);const E=P(S),A=new Float32Array(l.outC*l.inC*l.kH*l.kW);O(A);const B=w(A.byteLength,A),k=w(l.outC*y*M*4),x=I(o,["uniform","read-only-storage","read-only-storage","storage"],[E,v,B,k]),$=w(l.outC*y*M*4),L=I(r,["read-only-storage","storage"],[k,$]);c.push(E),s.push(B,k,$),d.push(x,L),f=l.outC,p=y,m=M,v=$}const b=await T(l=>{for(let y=0;y<i.length;y++){const M=i[y],S=n.hw-M.kH*(y+1)+1,E=n.hw-M.kW*(y+1)+1,A=M.outC*S*E;l.setPipeline(o),l.setBindGroup(0,d[y*2]),l.dispatchWorkgroups(Math.ceil(A/256),1,1),l.setPipeline(r),l.setBindGroup(0,d[y*2+1]),l.dispatchWorkgroups(Math.ceil(A/256),1,1)}}),g=b.totalMs;e.push(V("IMAGE","VAE Decoder",`${n.hw}×${n.hw}×${n.channels}`,`[${n.channels},${n.hw},${n.hw}]`,b,g,!0,null,"","conv→SiLU→conv→SiLU→conv→SiLU"));for(const l of s)l.destroy();for(const l of c)l.destroy()}return e}async function yt(t){const e=[],r=[{frames:4,hw:64,channels:4},{frames:8,hw:64,channels:4},{frames:16,hw:64,channels:4}];for(const{frames:a,hw:o,channels:i}of r){t?.(`video ${a}×${o}×${o}×${i}`);const u=a*o*o*i,n=new Float32Array(u);O(n);const s=new Float32Array(3*i);O(s);const c=a-2,d=new Float32Array(c*o*o*i),f=w(n.byteLength,n),p=w(s.byteLength,s),m=w(d.byteLength),h=P(Tt(a,o,o,i,3,c)),v=U(_t),b=I(v,["uniform","read-only-storage","read-only-storage","storage"],[h,f,p,m]),g=await T(y=>{y.setPipeline(v),y.setBindGroup(0,b),y.dispatchWorkgroups(Math.ceil(u/256),1,1)}),l=g.totalMs;e.push(V("VIDEO","Temporal Mixing",`${a}×${o}×${o}×${i}`,`[${a},${o},${o},${i}]`,g,l,!0,null,"","temporal conv kernel=3")),f.destroy(),p.destroy(),m.destroy(),h.destroy()}return e}async function wt(t){const e=[],r=[64,128,256,384,512],a=F();for(const o of r){t?.(`memory ${o}MB`);const i=o*1024*1024,u=performance.now();let n=null;try{n=a.createBuffer({size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}catch{e.push({allocated:!1,sizeMB:o,allocMs:0,writeMs:0});continue}const s=performance.now()-u,c=performance.now(),d=new Float32Array(Math.min(i/4,256)).fill(42);try{for(let p=0;p<i;p+=d.byteLength)a.queue.writeBuffer(n,p,d,0,Math.min(d.length,(i-p)/4))}catch{n.destroy(),e.push({allocated:!0,sizeMB:o,allocMs:s,writeMs:-1});continue}const f=performance.now()-c;n.destroy(),e.push({allocated:!0,sizeMB:o,allocMs:s,writeMs:f})}return e}async function Mt(t){t?.("sustained 30s");const e=256,r=new Float32Array(e*e);O(r);const a=new Float32Array(e*e);O(a);const o=w(r.byteLength,r),i=w(a.byteLength,a),u=w(e*e*4),s=U(`
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x; let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.K; k++) { sum += A[row * u.K + k] * B[k * u.N + col]; }
  C[row * u.N + col] = sum;
}`),c=new ArrayBuffer(12);new Uint32Array(c).set([e,e,e]);const d=P(c),f=I(s,["uniform","read-only-storage","read-only-storage","storage"],[d,o,i,u]),p=e/16,m=e/16,h=F(),v=[],b=[],g=30;performance.now();for(let L=0;L<g;L++){const N=performance.now(),C=[];for(;performance.now()-N<1e3;){const q=new tt(h),z=h.createCommandEncoder(),X=z.beginComputePass();X.setPipeline(s),X.setBindGroup(0,f),X.dispatchWorkgroups(p,m,1),X.end(),q.encode(z);const Et=performance.now();try{h.queue.submit([z.finish()])}catch{break}et.onCommandBufferSubmitted("measurement");try{await ot(h,q,"sustained")}catch{break}const J=performance.now()-Et;q.destroy(),J>0&&Number.isFinite(J)&&(v.push(J),C.push(J))}b.push(C.length>0?C.reduce((q,z)=>q+z,0)/C.length:0),t?.(`sustained s${L+1}/${g} avg=${(b[b.length-1]||0).toFixed(2)}ms`)}const l=[...v].sort((L,N)=>L-N),y=v.length>0?v.reduce((L,N)=>L+N,0)/v.length:0,M=st(l),S=Y(l,.95),E=Y(l,.99),A=b.slice(0,5),B=b.slice(-5),k=A.length>0?A.reduce((L,N)=>L+N,0)/A.length:0,x=B.length>0?B.reduce((L,N)=>L+N,0)/B.length:0,$=k>0?(x-k)/k*100:0;return o.destroy(),i.destroy(),u.destroy(),d.destroy(),{durationSec:g,totalOps:v.length,avgMs:y,medianMs:M,p95Ms:S,p99Ms:E,first5sMs:k,last5sMs:x,dropPct:Math.max($,0)}}async function Dt(t){t?.("Starting V3 Model-Shaped Benchmark...");const e=await ft(t),r=await pt(t),a=await mt(t),o=await gt(t),i=await ht(t),u=await bt(t),n=await vt(t),s=await yt(t),c=await wt(t),d=await Mt(t),f=ct(e,r,a,u,s,c.map(m=>({allocated:m.allocated,sizeMB:m.sizeMB})),d.dropPct),p=ut(f);return{matmul:e,attention:r,mlp:a,rmsnorm:o,embedding:i,imageOps:u,vae:n,video:s,memory:c,sustained:d,readiness:f,feasibility:p}}async function Wt(t){t?.("Starting V3 Quick (reduced subset)...");const e=(await ft(t)).slice(0,3),r=(await pt(t)).slice(0,3),a=(await mt(t)).slice(0,2),o=(await gt(t)).slice(0,2),i=(await ht(t)).slice(0,2),u=(await bt(t)).slice(0,3),n=(await vt(t)).slice(0,1),s=(await yt(t)).slice(0,2),c=await wt(t),d=await Mt(t),f=ct(e,r,a,u,s,c.map(m=>({allocated:m.allocated,sizeMB:m.sizeMB})),d.dropPct),p=ut(f);return{matmul:e,attention:r,mlp:a,rmsnorm:o,embedding:i,imageOps:u,vae:n,video:s,memory:c,sustained:d,readiness:f,feasibility:p}}function R(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function it(t){return`<span style="color:${t==="HIGH"?"var(--green)":t==="MEDIUM"?"var(--yellow)":t==="LOW"?"var(--red)":"var(--text-dim)"};font-weight:600">${t}</span>`}function K(t){return t<=0||!Number.isFinite(t)?"UNMEASURABLE":t<1?`${(t*1e3).toFixed(1)} µs`:`${t.toFixed(3)} ms`}function At(t){return t.throughput===null||t.throughput===void 0||!Number.isFinite(t.throughput)?t.notes.includes("INVALID")?"INVALID":"—":`${t.throughput.toFixed(2)} ${t.throughputUnit}`}function _(t,e){return e.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">${R(t)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>total</th><th>est/op</th><th>median</th><th>p95</th><th>throughput</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${e.map(r=>`<tr>
        <td>${R(r.operation)}<br/><small style="color:var(--text-dim)">${R(r.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${R(r.shape)}</td>
        <td>${r.repetitions.toLocaleString()}</td>
        <td>${r.measurable?r.totalMs>0?r.totalMs.toFixed(2):"0.00":"—"}</td>
        <td>${it(r.confidence)} ${K(r.estimatedPerOperationMs)}</td>
        <td>${K(r.medianMs)}</td>
        <td>${K(r.p95Ms)}</td>
        <td>${At(r)}</td>
        <td>${it(r.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function D(t,e){return`<div class="score-row">
    <div class="score-label">${R(t)}</div>
    <div class="score-track"><div class="score-fill" style="width:${e}%"></div></div>
    <div class="score-val">${e}</div>
  </div>`}function W(t){return`<span style="color:${t==="GREEN"?"var(--green)":t==="YELLOW"?"var(--yellow)":"var(--red)"};font-weight:700">${t}</span>`}function qt(t,e,r){const a=document.getElementById("perf-v3-results");if(!a)return;const o=t.readiness,i=t.feasibility;a.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER MODEL-SHAPED BENCHMARK — V3</span>
        <span class="badge badge-info">MODEL RELEVANT</span>
      </div>

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${R(e.adapterName)}</b></div>
          <div>Vendor: <b>${R(e.adapterVendor)}</b></div>
          <div>Device: <b>${R(e.adapterDevice)}</b></div>
          <div>Platform: <b>${R(e.platform)}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">WEBGPU</div>
          <div>Status: <b style="color:${e.webgpu?"var(--green)":"var(--red)"}">${e.webgpu?"READY":"UNAVAILABLE"}</b></div>
          <div>maxBufferSize: <b>${e.maxBufferSize?(e.maxBufferSize/1073741824).toFixed(2)+" GiB":"UNAVAILABLE"}</b></div>
          <div>maxWorkgroups/dim: <b>${e.maxWorkgroupsPerDim?.toLocaleString()??"UNAVAILABLE"}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">TIMING</div>
          <div>Method: <b>HOST_WALL_CLOCK<br/>AMPLIFIED</b></div>
          <div>Timer resolution: <b>${e.timerResolutionMs.toFixed(3)} ms</b></div>
          <div>Cross-origin: <b>${e.crossOriginIsolated?"YES":"NO"}</b></div>
          <div>Secure: <b>${e.secureContext?"YES":"NO"}</b></div>
        </div>
      </div>

      ${_("TRANSFORMER — MatMul",t.matmul)}
      ${_("TRANSFORMER — RMSNorm",t.rmsnorm)}
      ${_("TRANSFORMER — Embedding",t.embedding)}
      ${_("ATTENTION",t.attention)}
      ${_("MLP",t.mlp)}
      ${_("IMAGE — Elementwise",t.imageOps)}
      ${_("IMAGE — VAE Decoder",t.vae)}
      ${_("VIDEO — Temporal Mixing",t.video)}

      <div class="v3-section">
        <div class="v3-section-title">MEMORY PRESSURE</div>
        <table class="perf-table">
          <thead><tr><th>size</th><th>alloc</th><th>alloc ms</th><th>write ms</th></tr></thead>
          <tbody>
          ${t.memory.map(u=>`<tr>
            <td>${u.sizeMB} MB</td>
            <td style="color:${u.allocated?"var(--green)":"var(--red)"}">${u.allocated?"OK":"FAIL"}</td>
            <td>${u.allocMs>0?u.allocMs.toFixed(1):"—"}</td>
            <td>${u.writeMs>0?u.writeMs.toFixed(1):"—"}</td>
          </tr>`).join("")}
          </tbody>
        </table>
      </div>

      <div class="v3-section">
        <div class="v3-section-title">SUSTAINED PERFORMANCE (30s)</div>
        <table class="perf-table">
          <thead><tr><th>metric</th><th>value</th></tr></thead>
          <tbody>
            <tr><td>operations</td><td>${t.sustained.totalOps.toLocaleString()}</td></tr>
            <tr><td>average latency</td><td>${t.sustained.avgMs.toFixed(3)} ms</td></tr>
            <tr><td>median latency</td><td>${t.sustained.medianMs.toFixed(3)} ms</td></tr>
            <tr><td>p95 latency</td><td>${t.sustained.p95Ms.toFixed(3)} ms</td></tr>
            <tr><td>p99 latency</td><td>${t.sustained.p99Ms.toFixed(3)} ms</td></tr>
            <tr><td>first 5s avg</td><td>${t.sustained.first5sMs.toFixed(3)} ms</td></tr>
            <tr><td>last 5s avg</td><td>${t.sustained.last5sMs.toFixed(3)} ms</td></tr>
            <tr><td>performance drop</td><td style="color:${t.sustained.dropPct>20?"var(--red)":t.sustained.dropPct>5?"var(--yellow)":"var(--green)"}">${t.sustained.dropPct.toFixed(1)}%</td></tr>
          </tbody>
        </table>
        <div style="font-size:11px;color:var(--text-dim);margin-top:6px">thermalTelemetry: UNAVAILABLE · gpuUtilization: UNAVAILABLE</div>
      </div>

      <div class="v3-section">
        <div class="v3-section-title">AETHER LOCAL AI READINESS SCORE (heuristic)</div>
        ${D("TENSOR_COMPUTE",o.tensorCompute.score)}
        ${D("ATTENTION",o.attention.score)}
        ${D("MLP",o.mlp.score)}
        ${D("MEMORY",o.memory.score)}
        ${D("IMAGE_PROCESSING",o.imageProcessing.score)}
        ${D("VIDEO_PROCESSING",o.videoProcessing.score)}
        ${D("SUSTAINED_PERFORMANCE",o.sustainedPerf.score)}
        <div class="overall-row"><span>LOCAL_AI_READINESS</span><span>${o.overall} / 100</span></div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
          Heuristic benchmark score — NOT an official Apple performance rating.
        </div>
      </div>

      <div class="v3-section">
        <div class="v3-section-title">LOCAL AI CAPABILITY CLASSIFICATION</div>
        <table class="perf-table">
          <thead><tr><th>capability</th><th>class</th></tr></thead>
          <tbody>
            <tr><td>Transformer inference</td><td>${W(i.transformerInference)}</td></tr>
            <tr><td>Image generation</td><td>${W(i.imageGeneration)}</td></tr>
            <tr><td>VAE decoding</td><td>${W(i.vaeDecoding)}</td></tr>
            <tr><td>Video latent processing</td><td>${W(i.videoLatent)}</td></tr>
            <tr><td>Temporal attention</td><td>${W(i.temporalAttention)}</td></tr>
            <tr><td>Long-context processing</td><td>${W(i.longContext)}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
        <button class="btn" id="btn-export-v3-json">EXPORT V3 JSON</button>
        <button class="btn btn-outline" id="btn-export-v3-report">EXPORT V3 REPORT</button>
      </div>
    </div>
  `,a.querySelector("#btn-export-v3-json")?.addEventListener("click",()=>zt(t,e)),a.querySelector("#btn-export-v3-report")?.addEventListener("click",()=>Ht(t,e)),r("V3 benchmark complete","ok")}function $t(t,e,r){const a=new Blob([e],{type:r}),o=URL.createObjectURL(a),i=document.createElement("a");i.href=o,i.download=t,i.click(),URL.revokeObjectURL(o)}function zt(t,e){const r={device:e,environment:{userAgent:e.userAgent,platform:e.platform,webgpu:e.webgpu,crossOriginIsolated:e.crossOriginIsolated,secureContext:e.secureContext},timing:{method:"HOST_WALL_CLOCK_AMPLIFIED",timerResolutionMs:e.timerResolutionMs},timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??null,commit:globalThis.AETHER_COMMIT??null,results:t};$t("aether-v3.json",JSON.stringify(r,null,2),"application/json")}function Ht(t,e){const r=o=>o.map(i=>`| ${i.operation} | ${i.shape} | ${i.repetitions} | ${K(i.totalMs)} | ${K(i.estimatedPerOperationMs)} | ${i.confidence} | ${At(i)} |`).join(`
`),a=`# AETHER — PERFORMANCE V3 / MODEL-SHAPED GPU BENCHMARK

- Date: ${new Date().toISOString()}
- Device: ${e.device}
- Platform: ${e.platform}
- Adapter: ${e.adapterName} / ${e.adapterVendor} / ${e.adapterDevice}
- WebGPU: ${e.webgpu?"READY":"UNAVAILABLE"}
- maxBufferSize: ${e.maxBufferSize?(e.maxBufferSize/1073741824).toFixed(2)+" GiB":"UNAVAILABLE"}
- Timer resolution: ${e.timerResolutionMs.toFixed(3)} ms
- Cross-origin isolated: ${e.crossOriginIsolated?"YES":"NO"}
- Secure context: ${e.secureContext?"YES":"NO"}

## Transformer — MatMul
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${r(t.matmul)}

## Transformer — RMSNorm
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${r(t.rmsnorm)}

## Transformer — Embedding
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${r(t.embedding)}

## Attention
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${r(t.attention)}

## MLP
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${r(t.mlp)}

## Image Operations
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${r(t.imageOps)}

## VAE Decoder
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${r(t.vae)}

## Video — Temporal Mixing
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${r(t.video)}

## Memory
| size | alloc |
|---|---|
${t.memory.map(o=>`| ${o.sizeMB} MB | ${o.allocated?"OK":"FAIL"} |`).join(`
`)}

## Sustained Performance (30s)
- operations: ${t.sustained.totalOps}
- average: ${t.sustained.avgMs.toFixed(3)} ms
- median: ${t.sustained.medianMs.toFixed(3)} ms
- p95: ${t.sustained.p95Ms.toFixed(3)} ms
- p99: ${t.sustained.p99Ms.toFixed(3)} ms
- first 5s: ${t.sustained.first5sMs.toFixed(3)} ms
- last 5s: ${t.sustained.last5sMs.toFixed(3)} ms
- drop: ${t.sustained.dropPct.toFixed(1)}%
- thermalTelemetry: UNAVAILABLE
- gpuUtilization: UNAVAILABLE

## AETHER Local AI Readiness Score (heuristic — not an official Apple rating)
- TENSOR_COMPUTE: ${t.readiness.tensorCompute.score}
- ATTENTION: ${t.readiness.attention.score}
- MLP: ${t.readiness.mlp.score}
- MEMORY: ${t.readiness.memory.score}
- IMAGE_PROCESSING: ${t.readiness.imageProcessing.score}
- VIDEO_PROCESSING: ${t.readiness.videoProcessing.score}
- SUSTAINED_PERFORMANCE: ${t.readiness.sustainedPerf.score}
- **LOCAL_AI_READINESS: ${t.readiness.overall} / 100**

## Local AI Capability Classification
- Transformer inference: ${t.feasibility.transformerInference}
- Image generation: ${t.feasibility.imageGeneration}
- VAE decoding: ${t.feasibility.vaeDecoding}
- Video latent processing: ${t.feasibility.videoLatent}
- Temporal attention: ${t.feasibility.temporalAttention}
- Long-context processing: ${t.feasibility.longContext}

## Limitations
- HOST_WALL_CLOCK_AMPLIFIED measures CPU submission + completion overhead, not raw GPU execution.
- Timer quantization (~1 ms) limits precision; per-op figures are ESTIMATED via amplification.
- Correctness for V3 perf benches is NOT re-verified per-run (TASK 7/19 separation); rely on the V1 correctness suite for math validation.
- thermal/gpuUtilization unavailable in browser.
- Adaptive amplification may mark tiny kernels UNMEASURABLE near timer resolution.
`;$t("aether-v3-report.md",a,"text/markdown")}async function Qt(t,e,r){try{const a=e();Bt(jt());const o=await(t==="quick"?Wt:Dt)(u=>r(`V3: ${u}`,"info")),i=await Kt(a);qt(o,i,r)}catch(a){r(`V3 ERROR: ${a.message}`,"err")}}function jt(){let t=1/0;for(let e=0;e<200;e++){const r=performance.now();let a=performance.now();for(;a===r;)a=performance.now();const o=a-r;o>0&&o<t&&(t=o)}return Number.isFinite(t)&&t>0?t:1}async function Kt(t){let e="UNAVAILABLE",r="UNAVAILABLE",a="UNAVAILABLE",o=null,i=null;try{const s=t.adapterInfo??t.adapterInfo;s&&(e=s.description||s.vendor||"UNAVAILABLE",r=s.vendor||"UNAVAILABLE",a=s.device||s.architecture||"UNAVAILABLE");const c=t.limits;o=c?.maxBufferSize??null,i=c?.maxComputeWorkgroupsPerDimension??null}catch{}const u=navigator,n=u.userAgentData;return{adapterName:e,adapterVendor:r,adapterDevice:a,maxBufferSize:o,maxWorkgroupsPerDim:i,device:n?.platform??navigator.platform??"UNAVAILABLE",platform:n?.platform??navigator.platform??"UNAVAILABLE",userAgent:navigator.userAgent,webgpu:!!u.gpu,crossOriginIsolated:window.crossOriginIsolated,secureContext:window.isSecureContext,timerResolutionMs:at()}}export{qt as renderV3,Qt as runV3FromUI};
