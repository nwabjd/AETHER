const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/perf-v3-ui-CrETtUCV.js","assets/index-CdZUFsiu.js","assets/index-BX4ETZTQ.css"])))=>i.map(i=>d[i]);
import{b as ke,c as ve,d as Le,e as _e,_ as re}from"./index-CdZUFsiu.js";import{m as U,f as B,s as m,u as D,a as A,v as j,b as Q,c as K,d as T,e as Ae,g as ne,G as Be}from"./perf-v3-ui-CrETtUCV.js";const xe=`
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B_packed: array<u32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;
fn unpack_int8(packed: u32, idx: u32) -> f32 {
  let shift = (idx & 3u) * 8u;
  let raw = (packed >> shift) & 0xFFu;
  let val = select(i32(raw), i32(raw) - 256, raw >= 128u);
  return f32(val);
}
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x; let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.K; k++) {
    let idx = k * u.N + col;
    let val = unpack_int8(B_packed[idx >> 2u], idx & 3u);
    sum += A[row * u.K + k] * val;
  }
  C[row * u.N + col] = sum;
}`,De=`
struct Uniforms { M: u32, N: u32, K: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B_packed: array<u32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;
fn unpack_int4(packed: u32, idx: u32) -> f32 {
  let shift = (idx & 7u) * 4u;
  let raw = (packed >> shift) & 0xFu;
  let val = select(i32(raw), i32(raw) - 16, raw >= 8u);
  return f32(val);
}
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x; let col = gid.y;
  if (row >= u.M || col >= u.N) { return; }
  var sum: f32 = 0.0;
  for (var k: u32 = 0u; k < u.K; k++) {
    let idx = k * u.N + col;
    let val = unpack_int4(B_packed[idx >> 3u], idx & 7u);
    sum += A[row * u.K + k] * val;
  }
  C[row * u.N + col] = sum;
}`,Fe=`
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
}`,Ne=`
struct Uniforms { heads: u32, headDim: u32, context: u32, pad: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> Q: array<f32>;
@group(0) @binding(2) var<storage, read> K: array<f32>;
@group(0) @binding(3) var<storage, read> V: array<f32>;
@group(0) @binding(4) var<storage, read_write> Out: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  let total = u.heads * u.headDim;
  if (idx >= total) { return; }
  let h = idx / u.headDim;
  let d = idx % u.headDim;
  let scale = 1.0 / sqrt(f32(u.headDim));
  var maxScore: f32 = -1e30;
  for (var t: u32 = 0u; t < u.context; t++) {
    var dot: f32 = 0.0;
    for (var i: u32 = 0u; i < u.headDim; i++) {
      dot += Q[h * u.headDim + i] * K[t * u.heads * u.headDim + h * u.headDim + i];
    }
    let s = dot * scale;
    if (s > maxScore) { maxScore = s; }
  }
  var sumExp: f32 = 0.0;
  var outVal: f32 = 0.0;
  for (var t: u32 = 0u; t < u.context; t++) {
    var dot: f32 = 0.0;
    for (var i: u32 = 0u; i < u.headDim; i++) {
      dot += Q[h * u.headDim + i] * K[t * u.heads * u.headDim + h * u.headDim + i];
    }
    let s = dot * scale;
    let e = exp(s - maxScore);
    sumExp += e;
    outVal += e * V[t * u.heads * u.headDim + h * u.headDim + d];
  }
  Out[h * u.headDim + d] = outVal / sumExp;
}`,qe=`
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
  for (var c: u32 = 0u; c < cols; c++) {
    let v = input[row * cols + c];
    ss += v * v;
  }
  let rms = sqrt(ss / f32(cols) + bitcast<f32>(u.eps_bits));
  for (var c: u32 = 0u; c < cols; c++) {
    output[row * cols + c] = input[row * cols + c] / rms * weight[c];
  }
}`,Ge=`
@group(0) @binding(0) var<storage, read> a: array<f32>;
@group(0) @binding(1) var<storage, read> b: array<f32>;
@group(0) @binding(2) var<storage, read_write> c: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&a)) { return; }
  c[i] = a[i] + b[i];
}`,Ue=`
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
}`,Ee=`
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
  for (var j: u32 = 0u; j < seq; j++) {
    let kOff = (b * seq + j) * dim;
    var dot: f32 = 0.0;
    for (var d: u32 = 0u; d < dim; d++) { dot += QKV[qOff + d] * QKV[kOff + d]; }
    scores[b * seq * seq + row * seq + j] = dot * u.scale;
  }
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
  for (var d: u32 = 0u; d < dim; d++) {
    var sum: f32 = 0.0;
    for (var j: u32 = 0u; j < seq; j++) {
      let vOff = (b * seq + j) * dim + d;
      sum += scores[b * seq * seq + row * seq + j] * QKV[vOff];
    }
    out[(b * seq + row) * dim + d] = sum;
  }
}`;function Pe(o){const p=o.length,g=Math.ceil(p/4),c=new Uint32Array(g);for(let e=0;e<p;e++){const t=Math.max(-128,Math.min(127,Math.round(o[e])))&255;c[e>>>2]|=t<<(e&3)*8}return c}function Oe(o){const p=o.length,g=Math.ceil(p/8),c=new Uint32Array(g);for(let e=0;e<p;e++){const t=Math.max(-8,Math.min(7,Math.round(o[e])))&15;c[e>>>3]|=t<<(e&7)*4}return c}async function ae(o){const p=[],g=[512,768,1024,1536,2048],c=[{M:1,label:"decode"},{M:128,label:"prefill-128"},{M:256,label:"prefill-256"}];for(const e of g)for(const{M:a,label:t}of c){const r=e,n=e;o?.(`FP32 baseline matmul ${t} h=${e}`);const f=new Float32Array(a*r);B(f);const u=new Float32Array(r*n);B(u);const s=m(f.byteLength,f),i=m(u.byteLength,u),l=m(a*n*4),h=new ArrayBuffer(12);new Uint32Array(h).set([a,n,r]);const M=D(h),w=U(Fe),L=A(w,["uniform","read-only-storage","read-only-storage","storage"],[M,s,i,l]),v=Math.ceil(a/16),_=Math.ceil(n/16);let b=!1;try{const k=await j(w,L,v,_,1,l,a*n*4),F=ve(f,u,a,n,r);b=Q(k,F,1e-4,1e-4)}catch{b=!1}const y=await K(k=>{k.setPipeline(w),k.setBindGroup(0,L),k.dispatchWorkgroups(v,_,1)});p.push(T({category:"LLM_INFERENCE",operation:"FP32 MatMul (baseline)",workload:`${t} h=${e}`,shape:`[${a},${e}] × [${e},${e}]`,totalMs:y.totalMs,repetitions:y.reps,samples:y.samples.length,medianMs:y.medianMs,p95Ms:y.p95,p99Ms:y.p99,flopsPerExecution:2*a*r*n,bytesPerExecution:0,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:b,notes:"FP32 baseline — NOT a quantized path"})),s.destroy(),i.destroy(),l.destroy(),M.destroy()}for(const e of[8,4]){const a=e===8?xe:De,t=e===8?Pe:Oe,r=e===8?Le:_e,n=U(a),f=`INT${e} Quantized MatMul`;for(const u of g)for(const{M:s,label:i}of c){const l=u,h=u;o?.(`INT${e} matmul ${i} h=${u}`);const M=new Float32Array(s*l);B(M);const w=new Float32Array(l*h);B(w);const L=t(w),v=m(M.byteLength,M),_=m(L.byteLength,L),b=m(s*h*4),y=new ArrayBuffer(12);new Uint32Array(y).set([s,h,l]);const k=D(y),F=A(n,["uniform","read-only-storage","read-only-storage","storage"],[k,v,_,b]),E=Math.ceil(s/16),P=Math.ceil(h/16);let N=!1;try{const q=await j(n,F,E,P,1,b,s*h*4),O=r(M,L,s,h,l);N=Q(q,O,5,.1)}catch{N=!1}const x=await K(q=>{q.setPipeline(n),q.setBindGroup(0,F),q.dispatchWorkgroups(E,P,1)});p.push(T({category:"LLM_INFERENCE",operation:f,workload:`${i} h=${u}`,shape:`[${s},${l}]×[${l},${h}]`,totalMs:x.totalMs,repetitions:x.reps,samples:x.samples.length,medianMs:x.medianMs,p95Ms:x.p95,p99Ms:x.p99,flopsPerExecution:2*s*h*l,bytesPerExecution:s*l*4+Math.ceil(l*h/(e===8?4:8))*4+s*h*4,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:N,notes:`INT${e} weight-style, ${N?"correctness OK":"correctness FAILED"}`})),v.destroy(),_.destroy(),b.destroy(),k.destroy()}}return p}async function se(o){const p=[],e=U(Ne),a=[128,256,512,1024,2048,4096],t=new Set([128,512,1024]);for(const r of a){o?.(`kv-decode ctx=${r}`);const n=new Float32Array(8*64);B(n);const f=new Float32Array(r*8*64);B(f);const u=new Float32Array(r*8*64);B(u);const s=new Float32Array(8*64),i=m(n.byteLength,n),l=m(f.byteLength,f),h=m(u.byteLength,u),M=m(s.byteLength),w=new ArrayBuffer(16);new Uint32Array(w).set([8,64,r,0]);const L=D(w),v=A(e,["uniform","read-only-storage","read-only-storage","read-only-storage","storage"],[L,i,l,h,M]),_=Math.ceil(8*64/256);let b=!1;if(t.has(r))try{const k=await j(e,v,_,1,1,M,2048),F=ke(n,f,u,8,64,r);b=Q(k,F,.02,.02)}catch{b=!1}const y=await K(k=>{k.setPipeline(e),k.setBindGroup(0,v),k.dispatchWorkgroups(_,1,1)});p.push(T({category:"LLM_INFERENCE",operation:"KV-Cache Decode Attention",workload:`ctx=${r} heads=8 headDim=64`,shape:`q=[8,64] kv=[${r},8,64]`,totalMs:y.totalMs,repetitions:y.reps,samples:y.samples.length,medianMs:y.medianMs,p95Ms:y.p95,p99Ms:y.p99,flopsPerExecution:2*8*64*r+4*8*r+2*8*r*64,bytesPerExecution:(8*64+r*8*64*2+8*64)*4,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:t.has(r)?b:!0,notes:t.has(r)?b?"correctness OK":"correctness FAILED":"correctness not checked"})),i.destroy(),l.destroy(),h.destroy(),M.destroy(),L.destroy()}return p}const $e=[{name:"0.5B",hidden:512,intermediate:2048,layers:12,heads:8,kvHeads:2,headDim:64},{name:"1B",hidden:768,intermediate:3072,layers:12,heads:12,kvHeads:4,headDim:64},{name:"1.5B",hidden:768,intermediate:3072,layers:24,heads:12,kvHeads:4,headDim:64},{name:"3B",hidden:1024,intermediate:4096,layers:24,heads:16,kvHeads:8,headDim:64},{name:"7B",hidden:2048,intermediate:8192,layers:32,heads:32,kvHeads:8,headDim:64}];function Ie(o){const g=32e3*o.hidden,c=o.hidden*o.hidden+o.hidden*o.kvHeads*o.headDim+o.hidden*o.kvHeads*o.headDim+o.hidden*o.hidden+o.hidden*o.intermediate+o.intermediate*o.hidden+o.hidden*2,e=g+o.layers*c;return{fp16:e*2,int8:e,int4:Math.ceil(e/2)}}async function ie(o){const p=[],g=new ArrayBuffer(4);new Float32Array(g)[0]=1e-6;for(const c of $e){o?.(`transformer block ${c.name} hidden=${c.hidden}`);const e=c.hidden,a=c.intermediate,t=1,r=U(qe),n=U(Ue),f=U(Ee),u=U(Be),s=U(Ge),i=new Float32Array(e);i.fill(1);const l=new Float32Array(e*e*3);B(l);const h=new Float32Array(e*e);B(h);const M=new Float32Array(e);M.fill(1);const w=new Float32Array(e*a);B(w);const L=new Float32Array(a*e);B(L);const v=m(i.byteLength,i),_=m(l.byteLength,l),b=m(h.byteLength,h),y=m(M.byteLength,M),k=m(w.byteLength,w),F=m(L.byteLength,L),E=new Float32Array(t*e);B(E);const P=m(E.byteLength,E),N=m(t*e*4),x=m(t*e*3*4),q=m(t*t*4),O=m(t*e*4),S=m(t*e*4),$=m(t*e*4),V=m(t*e*4),W=m(t*a*4),C=m(t*a*4),R=m(t*e*4),z=m(t*e*4),H=D(new Uint32Array([t,new Uint32Array(g)[0]]).buffer),Y=D(new Uint32Array([t,e*3,e]).buffer),X=D(new Float32Array([1,t,e,1/Math.sqrt(e)]).buffer),J=D(new Uint32Array([t,e,e]).buffer),Z=D(new Uint32Array([t,new Uint32Array(g)[0]]).buffer),ee=D(new Uint32Array([t,a,e]).buffer),te=D(new Uint32Array([t,e,a]).buffer),de=A(r,["uniform","read-only-storage","read-only-storage","storage"],[H,P,v,N]),le=A(n,["uniform","read-only-storage","read-only-storage","storage"],[Y,N,_,x]),fe=A(f,["uniform","read-only-storage","storage","storage"],[X,x,q,O]),me=A(n,["uniform","read-only-storage","read-only-storage","storage"],[J,O,b,S]),ge=A(s,["read-only-storage","read-only-storage","storage"],[P,S,$]),pe=A(r,["uniform","read-only-storage","read-only-storage","storage"],[Z,$,y,V]),he=A(n,["uniform","read-only-storage","read-only-storage","storage"],[ee,V,k,W]),ye=A(u,["read-only-storage","storage"],[W,C]),be=A(n,["uniform","read-only-storage","read-only-storage","storage"],[te,C,F,R]),we=A(s,["read-only-storage","read-only-storage","storage"],[$,R,z]),G=await K(d=>{d.setPipeline(r),d.setBindGroup(0,de),d.dispatchWorkgroups(t,1,1),d.setPipeline(n),d.setBindGroup(0,le),d.dispatchWorkgroups(t,Math.ceil(e*3/16),1),d.setPipeline(f),d.setBindGroup(0,fe),d.dispatchWorkgroups(Math.ceil(t*e/64),1,1),d.setPipeline(n),d.setBindGroup(0,me),d.dispatchWorkgroups(t,Math.ceil(e/16),1),d.setPipeline(s),d.setBindGroup(0,ge),d.dispatchWorkgroups(Math.ceil(t*e/256),1,1),d.setPipeline(r),d.setBindGroup(0,pe),d.dispatchWorkgroups(t,1,1),d.setPipeline(n),d.setBindGroup(0,he),d.dispatchWorkgroups(t,Math.ceil(a/16),1),d.setPipeline(u),d.setBindGroup(0,ye),d.dispatchWorkgroups(Math.ceil(t*a/256),1,1),d.setPipeline(n),d.setBindGroup(0,be),d.dispatchWorkgroups(t,Math.ceil(e/16),1),d.setPipeline(s),d.setBindGroup(0,we),d.dispatchWorkgroups(Math.ceil(t*e/256),1,1)}),I=Ie(c),Me=(2*e*e*3+6*e*e+2*e*a+2*a*e)*G.reps,oe=T({category:"LLM_INFERENCE",operation:"TransformerBlock",workload:c.name,shape:`h=${e} i=${a}`,totalMs:G.totalMs,repetitions:G.reps,samples:G.samples.length,medianMs:G.medianMs,p95Ms:G.p95,p99Ms:G.p99,flopsPerExecution:Me/G.reps,bytesPerExecution:0,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:!0});p.push({config:c,paramCount:I.fp16/2,fp16Bytes:I.fp16,int8Bytes:I.int8,int4Bytes:I.int4,blockLatencyMs:oe.totalMs,...oe}),v.destroy(),_.destroy(),b.destroy(),y.destroy(),k.destroy(),F.destroy(),P.destroy(),N.destroy(),x.destroy(),q.destroy(),O.destroy(),S.destroy(),$.destroy(),V.destroy(),W.destroy(),C.destroy(),R.destroy(),z.destroy(),H.destroy(),Y.destroy(),X.destroy(),J.destroy(),Z.destroy(),ee.destroy(),te.destroy()}return p}function ue(o,p){const g=[],c=[{prompt:128,gen:32},{prompt:256,gen:64},{prompt:512,gen:64}],e=o.find(r=>r.config.name==="0.5B"),a=o.find(r=>r.config.name==="1B"),t=p.find(r=>r.workload.includes("ctx=1024"))??p[0];if(!e||!t)return g;for(const{prompt:r,gen:n}of c){const f=r*e.blockLatencyMs,u=e.blockLatencyMs,s=t.estimatedPerOperationMs*e.config.layers,i=s>0?1e3/s:0,l=f+n*s;g.push({promptTokens:r,generateTokens:n,prefillMs:f,firstTokenMs:u,avgDecodeMs:s,tokensPerSec:i,totalMs:l})}if(a)for(const{prompt:r,gen:n}of c){const f=r*a.blockLatencyMs,u=a.blockLatencyMs,s=t.estimatedPerOperationMs*a.config.layers,i=s>0?1e3/s:0,l=f+n*s;g.push({promptTokens:r,generateTokens:n,prefillMs:f,firstTokenMs:u,avgDecodeMs:s,tokensPerSec:i,totalMs:l})}return g}async function ce(o){const p=[],g=[128,256,512,768,1024,1536,2048],c=64,e=Ae(),a=Math.min(e.limits.maxBufferSize,256*1024*1024);for(const t of g){o?.(`memory budget ${t}MB`);const r=t*1024*1024,n=Math.min(c*1024*1024,a),f=[];let u=0,s=!0,i=null,l=0,h=0;const M=new Float32Array(256).fill(42);for(;u<r;){const w=Math.min(n,r-u),L=performance.now();let v;try{v=e.createBuffer({size:w,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}catch(y){s=!1,i=`buffer allocation failed at ${w/1048576}MB chunk (allocated ${u/1048576}MB of ${t}MB target): ${y.message}`;break}l+=performance.now()-L;const _=performance.now();let b=0;try{for(b=0;b<w;b+=M.byteLength)e.queue.writeBuffer(v,b,M,0,Math.min(M.length,(w-b)/4))}catch(y){v.destroy(),s=!1,i=`queue writeBuffer failed at offset ${b}: ${y.message}`;break}h+=performance.now()-_,f.push(v),u+=w}p.push({targetMB:t,chunkMB:c,success:s,totalAllocatedMB:u/(1024*1024),largestBufferMB:n/(1024*1024),numBuffers:f.length,allocMs:l,writeMs:h,failureReason:i});for(const w of f)w.destroy()}return p}async function Se(o){o?.("LLM Inference Gate: INT8/INT4 quantized matmul...");const p=await ae(o);o?.("LLM Inference Gate: KV-cache decode attention...");const g=await se(o);o?.("LLM Inference Gate: synthetic transformer block...");const c=await ie(o);o?.("LLM Inference Gate: token generation simulation...");const e=ue(c,g);o?.("LLM Inference Gate: memory budget...");const a=await ce(o),{benchV3Attention:t}=await re(async()=>{const{benchV3Attention:f}=await import("./perf-v3-ui-CrETtUCV.js").then(u=>u.p);return{benchV3Attention:f}},__vite__mapDeps([0,1,2])),r=await t(o),n=ne(p,r,g,c,a,0);return{quantizedMatmul:p,decodeAttention:g,transformerBlocks:c,tokenGeneration:e,memoryBudget:a,llmReadiness:n}}async function Ve(o){o?.("LLM Inference Gate Quick: INT8/INT4 quantized matmul...");const g=(await ae(o)).filter(i=>i.workload.includes("decode")&&(i.workload.includes("h=512")||i.workload.includes("h=1024")));o?.("LLM Inference Gate Quick: KV-cache decode attention...");const e=(await se(o)).filter(i=>i.workload.includes("ctx=128")||i.workload.includes("ctx=512")||i.workload.includes("ctx=1024"));o?.("LLM Inference Gate Quick: synthetic transformer block...");const t=(await ie(o)).filter(i=>i.config.name==="0.5B"||i.config.name==="1B");o?.("LLM Inference Gate Quick: token generation simulation...");const r=ue(t,e);o?.("LLM Inference Gate Quick: memory budget...");const n=await ce(o),{benchV3Attention:f}=await re(async()=>{const{benchV3Attention:i}=await import("./perf-v3-ui-CrETtUCV.js").then(l=>l.p);return{benchV3Attention:i}},__vite__mapDeps([0,1,2])),u=(await f(o)).slice(0,3),s=ne(g,u,e,t,n,0);return{quantizedMatmul:g,decodeAttention:e,transformerBlocks:t,tokenGeneration:r,memoryBudget:n,llmReadiness:s}}export{se as benchKVCacheDecodeAttention,ce as benchMemoryBudget,ae as benchQuantizedMatmul,ie as benchSyntheticTransformerBlock,ue as estimateTokenGeneration,Se as runLLMInferenceGate,Ve as runLLMInferenceGateQuick};
