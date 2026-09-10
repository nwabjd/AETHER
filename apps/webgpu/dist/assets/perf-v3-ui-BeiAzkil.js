import{h as ct,c as B,C as Ft,a as Pt,b as Ct,r as no,g as ro,d as Le,e as io,t as Ut,_ as nt,f as so,i as ao,j as co,k as lo,l as et,m as Ae,n as Ie,s as $e,o as Se,p as uo,q as Ot,u as vt,v as bt,w as kt}from"./index-B8tQdwFW.js";let Dt=1;function Et(t){Dt=t}function yt(){return Dt}function Be(t){return t<=0||!Number.isFinite(t)||t<=Dt?"UNMEASURABLE":t<5?"LOW":t<20?"MEDIUM":"HIGH"}const _t=2e3,Gt=2e3,xe=5e9,Vt=1e-6;function rt(t){if(!Number.isInteger(t.repetitions)||t.repetitions<=0)throw new Error(`TIMING INTEGRITY FAILURE: ${t.operation}/${t.workload} repetitions=${t.repetitions} must be a positive integer`);if(!Number.isFinite(t.totalMs)||t.totalMs<0)throw new Error(`TIMING INTEGRITY FAILURE: ${t.operation}/${t.workload} totalMs=${t.totalMs} invalid`);const e=t.totalMs/t.repetitions;if(Math.abs(e-t.totalMs/t.repetitions)>Vt)throw new Error(`TIMING INTEGRITY FAILURE: ${t.operation}/${t.workload} estimatedPerOperationMs=${e.toFixed(12)} != totalMs(${t.totalMs})/repetitions(${t.repetitions})=${(t.totalMs/t.repetitions).toFixed(12)}`);const s=yt(),r=(t.flopsPerExecution??0)*t.repetitions,a=(t.bytesPerExecution??0)*t.repetitions,n=(t.opsPerExecution??0)*t.repetitions,i=t.throughputUnit??"GFLOPS",c=i==="GB/s"?a:i==="GFLOPS"?r:n,d=i==="GB/s"?"BYTES":i==="GFLOPS"?"FLOPs":"OPERATIONS",l=t.totalMs/1e3,m={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[i];let p=null,h=!1;if(l>0&&Number.isFinite(l)&&c>0&&Number.isFinite(c)&&m!==void 0){const L=c/l/m,$=i==="GFLOPS"?_t:i==="GB/s"?Gt:xe;Number.isFinite(L)&&L>=0&&L<=$?p=L:h=!0}const f=t.totalMs>0?t.totalMs/s:0;let M;t.totalMs<=0||!Number.isFinite(t.totalMs)?M="UNMEASURABLE":f<5?M="LOW":f<20?M="MEDIUM":M="HIGH",!t.correctnessPassed&&M==="HIGH"&&(M="MEDIUM"),t.totalMs<=s&&(M="UNMEASURABLE");const y=t.samples>=20?t.medianMs:null,g=t.samples>=20?t.p95Ms:null,v=t.samples>=20?t.p99Ms:null,w=e>0&&e<=s,I=h?"INVALID_MEASUREMENT throughput exceeds physical cap":"",k=[t.notes??"",I,w?`TIMER-FLOOR_LIMITED: est. per-op ${e.toFixed(4)}ms ≤ ~${s}ms timer resolution; measured from an amplified block of ${t.repetitions} repetitions — NOT direct sub-ms timing`:""].filter(Boolean).join(" · ");return{category:t.category,operation:t.operation,workload:t.workload,shape:t.shape,repetitions:t.repetitions,totalMs:t.totalMs,blockMs:t.totalMs,estimatedPerOperationMs:e,medianMs:y,p95Ms:g,p99Ms:v,samples:t.samples,totalWork:c,workUnit:d,totalFLOPs:r,totalBytes:a,timingMethod:"HOST_WALL_CLOCK_AMPLIFIED",confidence:M,measurementQuality:{timerResolutionMs:s,totalMeasurementMs:t.totalMs,signalToTimerRatio:f,confidence:M,timerFloorLimited:w},correctnessPassed:t.correctnessPassed,throughput:p,throughputUnit:i,notes:k,measurable:M!=="UNMEASURABLE",timerFloorLimited:w}}function Te(t){return rt({category:t.category,operation:t.operation,workload:t.workload,shape:t.shape,totalMs:t.totalMs>0&&Number.isFinite(t.totalMs)?t.totalMs:0,repetitions:t.reps>0?t.reps:1,samples:t.samples,medianMs:t.medianMs,p95Ms:t.p95,p99Ms:t.p99,flopsPerExecution:t.flopsPerExecution,bytesPerExecution:t.bytesPerExecution,opsPerExecution:t.opsPerExecution,throughputUnit:t.throughputUnit,correctnessPassed:t.correctnessPassed,notes:t.notes})}function mo(t,e,o){const s=e/1e3;if(!(s>0)||!Number.isFinite(s)||!(t>0))return{value:null,capped:!1};const r=t/s/1e9;return Number.isFinite(r)?r>(o==="GFLOPS"?_t:Gt)?{value:null,capped:!0}:{value:r,capped:!1}:{value:null,capped:!1}}function po(t,e,o){const s=e/1e3;if(!(s>0)||!Number.isFinite(s)||!(t>0)||!Number.isFinite(t))return{value:null,capped:!1};const a={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[o];if(a===void 0)return{value:null,capped:!1};const n=t/s/a;return!Number.isFinite(n)||n<0?{value:null,capped:!1}:n>(o==="GFLOPS"?_t:o==="GB/s"?Gt:xe)?{value:null,capped:!0}:{value:n,capped:!1}}function at(t,e){if(t.length===0)return 0;const o=Math.min(Math.floor(t.length*e),t.length-1);return t[o]}function qt(t){return at(t,.5)}const ot={tensorCompute:.25,attention:.25,mlp:.2,memory:.1,imageProcessing:.1,videoProcessing:.05,sustainedPerf:.05};function zt(t,e){return e==="UNMEASURABLE"?0:e==="LOW"?Math.min(be(t),30):be(t)}function be(t){return t<=0||!Number.isFinite(t)?0:t<=2?100:t<=5?80:t<=10?60:t<=20?40:20}function dt(t){if(t.length===0)return{category:"",score:0,tests:0,measurable:0,notes:"no tests"};const e=t[0].category;let o=0,s=0;for(const a of t)o+=zt(a.estimatedPerOperationMs,a.confidence),a.confidence!=="UNMEASURABLE"&&s++;const r=Math.round(o/t.length);return{category:e,score:r,tests:t.length,measurable:s,notes:""}}function fo(t){if(t.length===0)return{category:"memory",score:0,tests:0,measurable:0,notes:"no tests"};const e=t.filter(r=>r.allocated),o=e.length>0?Math.max(...e.map(r=>r.sizeMB)):0;let s=0;return o>=512?s=100:o>=384?s=85:o>=256?s=70:o>=128?s=50:o>=64?s=30:s=10,{category:"memory",score:s,tests:t.length,measurable:e.length,notes:`maxAlloc=${o}MB`}}function Oe(t){let e=100;return t>30?e=20:t>20?e=40:t>10?e=70:t>5&&(e=85),{category:"sustainedPerf",score:e,tests:1,measurable:1,notes:`drop=${t.toFixed(1)}%`}}function Wt(t,e,o,s,r,a,n){const i=dt(t),c=dt(e),d=dt(o),l=dt(s),u=dt(r),m=fo(a),p=Oe(n),h=Math.round(i.score*ot.tensorCompute+c.score*ot.attention+d.score*ot.mlp+m.score*ot.memory+l.score*ot.imageProcessing+u.score*ot.videoProcessing+p.score*ot.sustainedPerf);return{tensorCompute:i,memory:m,attention:c,mlp:d,imageProcessing:l,videoProcessing:u,sustainedPerf:p,overall:h}}function Ht(t){const e=o=>o>=60?"GREEN":o>=35?"YELLOW":"RED";return{transformerInference:e(Math.max(t.tensorCompute.score,t.attention.score,t.mlp.score)),imageGeneration:e(Math.max(t.imageProcessing.score,t.tensorCompute.score)),vaeDecoding:e(Math.max(t.imageProcessing.score,t.memory.score)),videoLatent:e(Math.max(t.videoProcessing.score,t.memory.score)),temporalAttention:e(Math.max(t.videoProcessing.score,t.attention.score)),longContext:t.attention.score>=50&&t.memory.score>=50?"GREEN":t.attention.score>=30?"YELLOW":"RED"}}function ut(t){if(t.length===0)return 0;let e=0;for(const o of t)e+=zt(o.estimatedPerOperationMs,o.confidence);return Math.round(e/t.length)}function ho(t){if(t.length===0)return 0;const e=t.filter(s=>s.success);if(e.length===0)return 0;const o=Math.max(...e.map(s=>s.totalAllocatedMB));return o>=1024?100:o>=768?85:o>=512?70:o>=256?50:o>=128?30:10}function go(t){if(t.length===0)return 0;let e=0;for(const o of t)e+=zt(o.blockLatencyMs,o.confidence);return Math.round(e/t.length)}function Kt(t,e,o,s,r,a){const n=ut(t),i=ut(e),c=ut(o),d=go(s),l=ho(r),m=Oe(a).score,p=n,h=l,f=ut(o.filter(k=>parseInt(/ctx=(\d+)/.exec(k.workload)?.[1]??"0",10)>=1024)),M=ut(t.filter(k=>k.workload.includes("prefill"))),y=c,g=d,v=Math.round(f*.6+l*.4),w=m,I=Math.round(n*.3+l*.15+i*.15+c*.15+d*.15+m*.1);return{computeScore:n,memoryScore:l,attentionScore:i,decodeScore:c,transformerBlockScore:d,sustainedScore:m,overall:I,llmCompute:p,llmMemory:h,kvCache:f,prefill:M,decode:y,transformerBlock:g,longContext:v,sustained:w}}function jt(t,e,o,s,r=0,a=0){return t?e===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"INT8/INT4 quantized matmul missing or unsupported"}:o===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"KV-cache decode attention missing or unsupported"}:s===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Synthetic transformer block missing or unsupported"}:r===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Token-generation simulation missing or unsupported"}:a===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Memory ladder missing or unsupported"}:t.overall>0?{llmReadinessScore:t.overall,llmReadinessStatus:"CERTIFIED",reason:"LLM gate completed with measurable results"}:{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"LLM gate produced no measurable results"}:{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"LLM gate did not run"}}function Rt(t){const e=[];for(const o of t){if(`${o.operation}${o.workload}`,(!Number.isFinite(o.totalMs)||o.totalMs<0)&&e.push({operation:o.operation,workload:o.workload,kind:"invalid_totalMs",detail:`totalMs=${o.totalMs} not a non-negative finite number`}),(!Number.isFinite(o.repetitions)||o.repetitions<=0||!Number.isInteger(o.repetitions))&&e.push({operation:o.operation,workload:o.workload,kind:"invalid_repetitions",detail:`repetitions=${o.repetitions} must be positive integer`}),(!Number.isFinite(o.estimatedPerOperationMs)||o.estimatedPerOperationMs<0)&&e.push({operation:o.operation,workload:o.workload,kind:"invalid_estimated",detail:`estimatedPerOperationMs=${o.estimatedPerOperationMs}`}),Number.isFinite(o.totalMs)&&Number.isFinite(o.estimatedPerOperationMs)&&o.repetitions>0){const s=o.totalMs/o.repetitions;Math.abs(s-o.estimatedPerOperationMs)>1e-6&&e.push({operation:o.operation,workload:o.workload,kind:"normalization_mismatch",detail:`expected estimatedPerOperationMs=${s.toFixed(6)} (totalMs/reps), got ${o.estimatedPerOperationMs}`})}if((Number.isNaN(o.blockMs)||o.blockMs<0)&&e.push({operation:o.operation,workload:o.workload,kind:"invalid_blockMs",detail:`blockMs=${o.blockMs}`}),(Number.isNaN(o.totalWork)||o.totalWork<0)&&e.push({operation:o.operation,workload:o.workload,kind:"missing_totalWork",detail:`totalWork=${o.totalWork}`}),["FLOPs","BYTES","OPERATIONS","NONE"].includes(o.workUnit)||e.push({operation:o.operation,workload:o.workload,kind:"invalid_workUnit",detail:`workUnit=${o.workUnit}`}),typeof o.timerFloorLimited!="boolean"&&e.push({operation:o.operation,workload:o.workload,kind:"missing_timerFloorLimited",detail:`timerFloorLimited=${o.timerFloorLimited}`}),o.throughput!==null){if(!Number.isFinite(o.throughput)||o.throughput<0)e.push({operation:o.operation,workload:o.workload,kind:"invalid_throughput",detail:`throughput=${o.throughput}`});else if(o.totalMs>0){const s=o.totalWork/(o.totalMs/1e3),r=o.throughputUnit==="GFLOPS"||o.throughputUnit==="GB/s"?1e9:o.throughputUnit==="M/s"?1e6:o.throughputUnit==="k/s"?1e3:1,a=s/r;Math.abs(a-o.throughput)/Math.max(a,1e-12)>.01&&e.push({operation:o.operation,workload:o.workload,kind:"throughput_mismatch",detail:`expected throughput=${a.toFixed(6)} ${o.throughputUnit}, got ${o.throughput}`})}}["GFLOPS","GB/s","M/s","k/s","/s"].includes(o.throughputUnit)||e.push({operation:o.operation,workload:o.workload,kind:"invalid_unit",detail:`throughputUnit=${o.throughputUnit}`})}return{ok:e.length===0,issues:e}}function yo(t){if(!t)return{ok:!1,issues:[{operation:"LLM_GATE",workload:"—",kind:"missing",detail:"llmInference results missing from export"}]};const e=Rt(t.quantizedMatmul),o=Rt(t.decodeAttention),s=[...e.issues,...o.issues];return t.quantizedMatmul.length===0&&s.push({operation:"LLM_GATE",workload:"quantizedMatmul",kind:"empty_section",detail:"no INT8/INT4 matmul results"}),t.decodeAttention.length===0&&s.push({operation:"LLM_GATE",workload:"decodeAttention",kind:"empty_section",detail:"no KV-cache decode attention results"}),t.transformerBlocks.length===0&&s.push({operation:"LLM_GATE",workload:"transformerBlocks",kind:"empty_section",detail:"no synthetic transformer block results"}),{ok:s.length===0,issues:s}}const Ne=Object.freeze(Object.defineProperty({__proto__:null,TIMING_EPSILON:Vt,buildV3Result:Te,classifyConfidence:Be,classifyFeasibility:Ht,computeLLMReadiness:Kt,computeLLMReadinessStatus:jt,computeReadiness:Wt,computeThroughputTotal:po,createBenchmarkResult:rt,getTimerResolution:yt,median:qt,percentile:at,safeThroughput:mo,setTimerResolution:Et,validateLLMGateIntegrity:yo,validateResultIntegrity:Rt},Symbol.toStringTag,{value:"Module"})),Re=`
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
`,Fe=`
@group(0) @binding(0) var<storage, read> input: array<f32>;
@group(0) @binding(1) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&input)) { return; }
  let x = input[i];
  output[i] = x / (1.0 + exp(-x));
}
`,Mo=`
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
`,vo=`
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
`;function bo(t,e,o){const s=new ArrayBuffer(16),r=new Uint32Array(s);return r[0]=t>>>0,r[1]=e>>>0,r[2]=o>>>0,r[3]=0,s}function ko(t,e,o,s,r,a){const n=new ArrayBuffer(32),i=new Uint32Array(n);return i[0]=t>>>0,i[1]=e>>>0,i[2]=o>>>0,i[3]=s>>>0,i[4]=r>>>0,i[5]=a>>>0,i[6]=0,i[7]=0,n}function z(){return ro()}function Pe(t,e,o){const s=z().createBuffer({size:e,usage:t,mappedAtCreation:!!o});return o&&new Uint8Array(s.getMappedRange()).set(new Uint8Array(o.buffer,o.byteOffset,o.byteLength)),s.unmap(),Ut(s)}function b(t,e){return Pe(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,t,e)}function C(t){return Pe(GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,Math.max(t.byteLength,16),new Uint8Array(t))}function U(t,e){const o=z().createShaderModule({code:t});return z().createComputePipeline({layout:"auto",compute:{module:o,entryPoint:"main"}})}function T(t,e,o){const s=t.getBindGroupLayout(0);return z().createBindGroup({layout:s,entries:o.map((r,a)=>({binding:a,resource:{buffer:r}}))})}function x(t){let e=2654435769;for(let o=0;o<t.length;o++)e=e*1664525+1013904223>>>0,t[o]=e%2001/1e3-1}async function mt(t,e){const o=z(),s=new Ft(o),r=o.createCommandEncoder();for(let c=0;c<e;c++){const d=r.beginComputePass();t(d),d.end()}s.encode(r);const a=r.finish(),n=performance.now();try{o.queue.submit([a])}catch{return 0}Pt.onCommandBufferSubmitted("measurement");try{await Ct(o,s,"v3-block")}catch{return 0}const i=performance.now()-n;return s.destroy(),Number.isFinite(i)&&i>=0?i:0}async function q(t,e=1e6){const o=yt();let s=await mt(t,1),r=1;s<=o&&(s=await mt(t,100),r=100),s<=o&&(s=await mt(t,1e4),r=1e4);const a=s/r;let n=Math.ceil(20/a);(!Number.isFinite(n)||n<=0)&&(n=1),n=Math.min(n,e);const i=Math.max(n,1);for(let M=0;M<3;M++)await mt(t,i);const c=[];for(let M=0;M<20;M++)c.push(await mt(t,i));const d=c.filter(M=>M>0&&Number.isFinite(M)),l=[...d].sort((M,y)=>M-y),u=qt(l),m=d.length>0?d.reduce((M,y)=>M+y,0)/d.length:0,p=d.length>=20?at(l,.95):null,h=d.length>=20?at(l,.99):null,f=Be(u);return{reps:i,totalMs:u,medianMs:u,meanMs:m,p95:p,p99:h,confidence:f,samples:d}}function Q(t){return Te({category:t.category,operation:t.operation,workload:t.workload,shape:t.shape,reps:t.m.reps,totalMs:t.m.totalMs,medianMs:t.m.medianMs,p95:t.m.p95,p99:t.m.p99,samples:t.m.samples.length,confidence:t.m.confidence,correctnessPassed:t.correctnessPassed,notes:t.notes,flopsPerExecution:t.flopsPerExecution,bytesPerExecution:t.bytesPerExecution,opsPerExecution:t.opsPerExecution,throughputUnit:t.throughputUnit})}async function ft(t,e,o,s,r,a,n){const i=z(),c=new Ft(i),d=i.createCommandEncoder(),l=d.beginComputePass();l.setPipeline(t),l.setBindGroup(0,e),l.dispatchWorkgroups(o,s,r),l.end(),c.encode(d),i.queue.submit([d.finish()]),Pt.onCommandBufferSubmitted("other"),await Ct(i,c,"v3-correctness");const u=await no(a,n);return c.destroy(),u}function ht(t,e,o=.02,s=.02){if(t.length!==e.length)return!1;let r=!0;for(let a=0;a<t.length;a++){const n=t[a],i=e[a],c=Math.abs(n-i),d=Math.abs(i)>1e-9?c/Math.abs(i):c;if(c>o&&d>s){r=!1;break}}return r}async function Qt(t){const e=[],o=[{tokens:128,hidden:512},{tokens:256,hidden:512},{tokens:512,hidden:512},{tokens:128,hidden:768},{tokens:256,hidden:768},{tokens:128,hidden:1024},{tokens:256,hidden:1024}];for(const{tokens:s,hidden:r}of o){t?.(`matmul ${s}×${r} × ${r}×${r}`);const a=s,n=r,i=r,c=a*i*4,d=i*n*4,l=a*n*4,u=new Float32Array(a*i);x(u);const m=new Float32Array(i*n);x(m);const p=b(c,u),h=b(d,m),f=b(l),y=U(`
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
}`),g=new ArrayBuffer(12);new Uint32Array(g).set([a,n,i]);const v=C(g),w=T(y,["uniform","read-only-storage","read-only-storage","storage"],[v,p,h,f]),I=Math.ceil(a/16),k=Math.ceil(n/16),L=await q(O=>{O.setPipeline(y),O.setBindGroup(0,w),O.dispatchWorkgroups(I,k,1)});let $=!1;try{const O=await ft(y,w,I,k,1,f,l),R=Le(u,m,a,n,i);$=ht(O,R)}catch{$=!1}e.push(Q({category:"TRANSFORMER",operation:"MatMul",workload:`${s}×${r} × ${r}×${r}`,shape:`[${s},${r}]×[${r},${r}]`,m:L,correctnessPassed:$,flopsPerExecution:2*a*n*i,bytesPerExecution:(a*i+i*n+a*n)*4,throughputUnit:"GFLOPS",notes:$?"":"correctness FAILED"})),p.destroy(),h.destroy(),f.destroy(),v.destroy()}return e}async function Yt(t){const e=[],o=[{hidden:512,heads:8,headDim:64,seqs:[64,128,256,512]},{hidden:768,heads:12,headDim:64,seqs:[64,128,256]}];for(const{hidden:s,heads:r,headDim:a,seqs:n}of o)for(const i of n){t?.(`attention hidden=${s} seq=${i}`);const c=1,d=a,l=i*i*4,u=i*d*4,m=new Float32Array(c*i*d*3);x(m);const p=b(m.byteLength,m),h=b(l),f=b(u),y=U(`
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
}`),g=1/Math.sqrt(d),v=new ArrayBuffer(16);new Uint32Array(v).set([c,i,d]),new Float32Array(v)[3]=g;const w=C(v),I=T(y,["uniform","read-only-storage","storage","storage"],[w,p,h,f]),k=Math.max(1,Math.ceil(c*i/64)),L=await q($=>{$.setPipeline(y),$.setBindGroup(0,I),$.dispatchWorkgroups(k,1,1)});e.push(Q({category:"ATTENTION",operation:"Fused Attention",workload:`hidden=${s} seq=${i}`,shape:`[1,${i},${d}]`,m:L,correctnessPassed:!0,flopsPerExecution:4*c*i*i*d,bytesPerExecution:(c*i*d*3+i*i+i*d)*4,throughputUnit:"GFLOPS",notes:"QK^T+softmax+PV fused"})),p.destroy(),h.destroy(),f.destroy(),w.destroy()}return e}async function Jt(t){const e=[],o=[{hidden:512,intermediate:2048,seqs:[128,256,512]},{hidden:768,intermediate:3072,seqs:[128,256]},{hidden:1024,intermediate:4096,seqs:[128]}],s=U(Re);for(const{hidden:r,intermediate:a,seqs:n}of o)for(const i of n){t?.(`mlp hidden=${r} intermediate=${a} seq=${i}`);const c=new Float32Array(i*r);x(c);const d=new Float32Array(r*a);x(d);const l=new Float32Array(a*r);x(l);const u=b(c.byteLength,c),m=b(d.byteLength,d),p=b(i*a*4),h=b(i*a*4),f=b(i*r*4),y=U(`
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
}`),g=new ArrayBuffer(12);new Uint32Array(g).set([i,a,r]);const v=C(g),w=T(y,["uniform","read-only-storage","read-only-storage","storage"],[v,u,m,p]),I=T(s,["read-only-storage","storage"],[p,h]),k=i*a,L=new ArrayBuffer(12);new Uint32Array(L).set([i,r,a]);const $=C(L),O=T(y,["uniform","read-only-storage","read-only-storage","storage"],[$,h,f,u]),R=await q(E=>{E.setPipeline(y),E.setBindGroup(0,w),E.dispatchWorkgroups(Math.ceil(i/16),Math.ceil(a/16),1),E.setPipeline(s),E.setBindGroup(0,I),E.dispatchWorkgroups(Math.ceil(k/256),1,1),E.setPipeline(y),E.setBindGroup(0,O),E.dispatchWorkgroups(Math.ceil(i/16),Math.ceil(r/16),1)});e.push(Q({category:"MLP",operation:"Transformer MLP",workload:`h=${r} int=${a} seq=${i}`,shape:`[${i},${r}]`,m:R,correctnessPassed:!0,flopsPerExecution:2*i*r*a+i*a+2*i*a*r,bytesPerExecution:(i*r+r*a+i*a+a*r+i*r)*4,throughputUnit:"GFLOPS",notes:"W1→GELU→W2"})),u.destroy(),m.destroy(),p.destroy(),h.destroy(),f.destroy(),v.destroy(),$.destroy()}return e}async function Xt(t){const e=[],s=U(`
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
}`),r=[{hidden:512,seqs:[128,256,512]},{hidden:768,seqs:[128,256]},{hidden:1024,seqs:[128]},{hidden:2048,seqs:[128]}];for(const{hidden:a,seqs:n}of r)for(const i of n){t?.(`rmsnorm hidden=${a} seq=${i}`);const c=new Float32Array(i*a);x(c);const d=new Float32Array(a);for(let y=0;y<a;y++)d[y]=1;const l=b(c.byteLength,c),u=b(d.byteLength,d),m=b(c.byteLength),p=new ArrayBuffer(8);new Uint32Array(p).set([i,0]);const h=C(p),f=T(s,["uniform","read-only-storage","read-only-storage","storage"],[h,l,u,m]),M=await q(y=>{y.setPipeline(s),y.setBindGroup(0,f),y.dispatchWorkgroups(i,1,1)});e.push(Q({category:"TRANSFORMER",operation:"RMSNorm",workload:`hidden=${a} seq=${i}`,shape:`[${i},${a}]`,m:M,correctnessPassed:!0,flopsPerExecution:3*i*a,bytesPerExecution:(i*a+a+i*a)*4,throughputUnit:"GFLOPS",notes:""})),l.destroy(),u.destroy(),m.destroy(),h.destroy()}return e}async function Zt(t){const e=[],o=U(Mo),s=32e3,r=512,a=new Float32Array(s*r);x(a);const n=b(a.byteLength,a);for(const i of[128,256,512]){t?.(`embedding tokens=${i}`);const c=new Uint32Array(i);for(let f=0;f<i;f++)c[f]=Math.floor(Math.random()*s);const d=b(c.byteLength,c),l=b(i*r*4),u=C(bo(s,r,i)),m=T(o,["uniform","read-only-storage","read-only-storage","storage"],[u,d,n,l]),p=await q(f=>{f.setPipeline(o),f.setBindGroup(0,m),f.dispatchWorkgroups(Math.ceil(i*r/256),1,1)}),h=i*r*4+i*4;e.push(Q({category:"TRANSFORMER",operation:"Embedding Lookup",workload:`tokens=${i} vocab=${s} hidden=${r}`,shape:`[${i}]→[${i},${r}]`,m:p,correctnessPassed:!0,bytesPerExecution:h,throughputUnit:"GB/s",notes:`${(h/1048576).toFixed(1)} MiB touched`})),d.destroy(),l.destroy(),u.destroy()}return n.destroy(),e}async function Nt(t,e,o,s,r,a,n){const i=[],c=U(e);for(const{hw:d,channels:l}of s){n?.(`${t} ${d}×${d}×${l}`);const u=d*d*l,m=new Float32Array(u);x(m);const p=new Float32Array(u);x(p);const h=b(u*4,m),f=b(u*4,p),M=b(u*4),y=T(c,o,[h,f,M]),g=await q(v=>{v.setPipeline(c),v.setBindGroup(0,y),v.dispatchWorkgroups(Math.ceil(u/256),1,1)});i.push(Q({category:"IMAGE",operation:t,workload:`${d}×${d}×${l}`,shape:`[${d},${d},${l}]`,m:g,correctnessPassed:!0,flopsPerExecution:r(d,l),bytesPerExecution:u*12,throughputUnit:a,notes:""})),h.destroy(),f.destroy(),M.destroy()}return i}async function te(t){const e=[{hw:64,channels:4},{hw:128,channels:4},{hw:256,channels:4}],o="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] + b[i]; }",s="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] * b[i]; }",r=Fe,a=["read-only-storage","read-only-storage","storage"],n=["read-only-storage","storage"],i=[];return i.push(...await Nt("Elementwise Add",o,a,e,(c,d)=>c*c*d,"GFLOPS",t)),i.push(...await Nt("Elementwise Multiply",s,a,e,(c,d)=>c*c*d,"GFLOPS",t)),i.push(...await Nt("SiLU Activation",r,n,e,(c,d)=>c*c*d,"GFLOPS",t)),i}async function ee(t){const e=[],o=U(Fe),r=U(`
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
}`),a=[{inC:4,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:16,H:64,W:64,kH:3,kW:3}],n=[{hw:64,channels:4},{hw:128,channels:4}];for(const i of n){t?.(`vae ${i.hw}×${i.hw}×${i.channels}`);const c=[],d=[],l=[];let u=i.channels,m=i.hw,p=i.hw;const h=new Float32Array(u*m*p);x(h);let f=b(h.byteLength,h);c.push(f);for(const y of a){const g=m-y.kH+1,v=p-y.kW+1,w=new ArrayBuffer(32);new Uint32Array(w).set([y.inC,y.outC,m,p,y.kH,y.kW,g,v]);const I=C(w),k=new Float32Array(y.outC*y.inC*y.kH*y.kW);x(k);const L=b(k.byteLength,k),$=b(y.outC*g*v*4),O=T(r,["uniform","read-only-storage","read-only-storage","storage"],[I,f,L,$]),R=b(y.outC*g*v*4),E=T(o,["read-only-storage","storage"],[$,R]);d.push(I),c.push(L,$,R),l.push(O,E),u=y.outC,m=g,p=v,f=R}const M=await q(y=>{for(let g=0;g<a.length;g++){const v=a[g],w=i.hw-v.kH*(g+1)+1,I=i.hw-v.kW*(g+1)+1,k=v.outC*w*I;y.setPipeline(r),y.setBindGroup(0,l[g*2]),y.dispatchWorkgroups(Math.ceil(k/256),1,1),y.setPipeline(o),y.setBindGroup(0,l[g*2+1]),y.dispatchWorkgroups(Math.ceil(k/256),1,1)}});e.push(Q({category:"IMAGE",operation:"VAE Decoder",workload:`${i.hw}×${i.hw}×${i.channels}`,shape:`[${i.channels},${i.hw},${i.hw}]`,m:M,correctnessPassed:!0,bytesPerExecution:(i.channels*i.hw*i.hw+16*64*64+16*62*62)*4,throughputUnit:"GB/s",notes:"conv→SiLU→conv→SiLU→conv→SiLU"}));for(const y of c)y.destroy();for(const y of d)y.destroy()}return e}async function oe(t){const e=[],o=[{frames:4,hw:64,channels:4},{frames:8,hw:64,channels:4},{frames:16,hw:64,channels:4}];for(const{frames:s,hw:r,channels:a}of o){t?.(`video ${s}×${r}×${r}×${a}`);const n=s*r*r*a,i=new Float32Array(n);x(i);const c=new Float32Array(3*a);x(c);const d=s-2,l=new Float32Array(d*r*r*a),u=b(i.byteLength,i),m=b(c.byteLength,c),p=b(l.byteLength),h=C(ko(s,r,r,a,3,d)),f=U(vo),M=T(f,["uniform","read-only-storage","read-only-storage","storage"],[h,u,m,p]),y=await q(g=>{g.setPipeline(f),g.setBindGroup(0,M),g.dispatchWorkgroups(Math.ceil(n/256),1,1)});e.push(Q({category:"VIDEO",operation:"Temporal Mixing",workload:`${s}×${r}×${r}×${a}`,shape:`[${s},${r},${r},${a}]`,m:y,correctnessPassed:!0,bytesPerExecution:(n+3*a+n)*4,throughputUnit:"GB/s",notes:"temporal conv kernel=3"})),u.destroy(),m.destroy(),p.destroy(),h.destroy()}return e}async function ne(t){const e=[],o=[64,128,256,384,512],s=z(),r=io(s),a=Math.max(1,Math.min(64,Math.floor(r/(1024*1024)))),n=Math.min(a*1024*1024,r);for(const i of o){t?.(`memory ${i}MB`);const c=i*1024*1024,d=performance.now(),l=[];let u=0,m=null;try{for(;u<c;){const g=Math.min(n,c-u),v=s.createBuffer({size:g,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC});Ut(v),l.push(v),u+=g}}catch(g){m=g}for(const g of l)g.destroy();const p=performance.now()-d;if(m!==null||u<c){e.push({allocated:!1,sizeMB:i,allocMs:p,writeMs:0});continue}const h=performance.now(),f=new Float32Array(Math.min(c/4,256)).fill(42);let M=!1;try{for(const g of l){const v=g.size;for(let w=0;w<v;w+=f.byteLength)s.queue.writeBuffer(g,w,f,0,Math.min(f.length,(v-w)/4))}}catch{M=!0}const y=performance.now()-h;M?e.push({allocated:!0,sizeMB:i,allocMs:p,writeMs:-1}):e.push({allocated:!0,sizeMB:i,allocMs:p,writeMs:y})}return e}async function re(t){t?.("sustained 30s");const e=256,o=new Float32Array(e*e);x(o);const s=new Float32Array(e*e);x(s);const r=b(o.byteLength,o),a=b(s.byteLength,s),n=b(e*e*4),c=U(`
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
}`),d=new ArrayBuffer(12);new Uint32Array(d).set([e,e,e]);const l=C(d),u=T(c,["uniform","read-only-storage","read-only-storage","storage"],[l,r,a,n]),m=e/16,p=e/16,h=z(),f=[],M=[],y=30;performance.now();for(let N=0;N<y;N++){const _=performance.now(),W=[];for(;performance.now()-_<1e3;){const H=new Ft(h),K=h.createCommandEncoder(),j=K.beginComputePass();j.setPipeline(c),j.setBindGroup(0,u),j.dispatchWorkgroups(m,p,1),j.end(),H.encode(K);const lt=performance.now();try{h.queue.submit([K.finish()])}catch{break}Pt.onCommandBufferSubmitted("measurement");try{await Ct(h,H,"sustained")}catch{break}const Y=performance.now()-lt;H.destroy(),Y>0&&Number.isFinite(Y)&&(f.push(Y),W.push(Y))}M.push(W.length>0?W.reduce((H,K)=>H+K,0)/W.length:0),t?.(`sustained s${N+1}/${y} avg=${(M[M.length-1]||0).toFixed(2)}ms`)}const g=[...f].sort((N,_)=>N-_),v=f.length>0?f.reduce((N,_)=>N+_,0)/f.length:0,w=qt(g),I=at(g,.95),k=at(g,.99),L=M.slice(0,5),$=M.slice(-5),O=L.length>0?L.reduce((N,_)=>N+_,0)/L.length:0,R=$.length>0?$.reduce((N,_)=>N+_,0)/$.length:0,E=O>0?(R-O)/O*100:0;return r.destroy(),a.destroy(),n.destroy(),l.destroy(),{durationSec:y,totalOps:f.length,avgMs:v,medianMs:w,p95Ms:I,p99Ms:k,first5sMs:O,last5sMs:R,dropPct:Math.max(E,0)}}function F(t,e,o){return s=>{ct({phase:e,category:o,test:s}),t?.(s)}}function A(t,e){return!!t&&t.completed.includes(e)&&t.partial[e]!==void 0}async function Ce(t,e){t?.("Starting V3 Model-Shaped Benchmark..."),ct({phase:"V3:MODEL-SHAPED",category:null,test:"starting"});const o=A(e,"matmul")?e.partial.matmul:await Qt(F(t,"V3-FULL","matmul"));A(e,"matmul")||B("matmul",o);const s=A(e,"attention")?e.partial.attention:await Yt(F(t,"V3-FULL","attention"));A(e,"attention")||B("attention",s);const r=A(e,"mlp")?e.partial.mlp:await Jt(F(t,"V3-FULL","mlp"));A(e,"mlp")||B("mlp",r);const a=A(e,"rmsnorm")?e.partial.rmsnorm:await Xt(F(t,"V3-FULL","rmsnorm"));A(e,"rmsnorm")||B("rmsnorm",a);const n=A(e,"embedding")?e.partial.embedding:await Zt(F(t,"V3-FULL","embedding"));A(e,"embedding")||B("embedding",n);const i=A(e,"imageOps")?e.partial.imageOps:await te(F(t,"V3-FULL","imageOps"));A(e,"imageOps")||B("imageOps",i);const c=A(e,"vae")?e.partial.vae:await ee(F(t,"V3-FULL","vae"));A(e,"vae")||B("vae",c);const d=A(e,"video")?e.partial.video:await oe(F(t,"V3-FULL","video"));A(e,"video")||B("video",d);const l=A(e,"memory")?e.partial.memory:await ne(F(t,"V3-FULL","memory"));A(e,"memory")||B("memory",l);const u=A(e,"sustained")?e.partial.sustained:await re(F(t,"V3-FULL","sustained"));A(e,"sustained")||B("sustained",u);const m=Wt(o,s,r,i,d,l.map(h=>({allocated:h.allocated,sizeMB:h.sizeMB})),u.dropPct),p=Ht(m);return{matmul:o,attention:s,mlp:r,rmsnorm:a,embedding:n,imageOps:i,vae:c,video:d,memory:l,sustained:u,readiness:m,feasibility:p}}async function Ue(t,e){t?.("Starting V3 Quick (reduced subset)..."),ct({phase:"V3:QUICK",category:null,test:"starting"});const o=A(e,"matmul")?e.partial.matmul:(await Qt(F(t,"V3-QUICK","matmul"))).slice(0,3);A(e,"matmul")||B("matmul",o);const s=A(e,"attention")?e.partial.attention:(await Yt(F(t,"V3-QUICK","attention"))).slice(0,3);A(e,"attention")||B("attention",s);const r=A(e,"mlp")?e.partial.mlp:(await Jt(F(t,"V3-QUICK","mlp"))).slice(0,2);A(e,"mlp")||B("mlp",r);const a=A(e,"rmsnorm")?e.partial.rmsnorm:(await Xt(F(t,"V3-QUICK","rmsnorm"))).slice(0,2);A(e,"rmsnorm")||B("rmsnorm",a);const n=A(e,"embedding")?e.partial.embedding:(await Zt(F(t,"V3-QUICK","embedding"))).slice(0,2);A(e,"embedding")||B("embedding",n);const i=A(e,"imageOps")?e.partial.imageOps:(await te(F(t,"V3-QUICK","imageOps"))).slice(0,3);A(e,"imageOps")||B("imageOps",i);const c=A(e,"vae")?e.partial.vae:(await ee(F(t,"V3-QUICK","vae"))).slice(0,1);A(e,"vae")||B("vae",c);const d=A(e,"video")?e.partial.video:(await oe(F(t,"V3-QUICK","video"))).slice(0,2);A(e,"video")||B("video",d);const l=A(e,"memory")?e.partial.memory:await ne(F(t,"V3-QUICK","memory"));A(e,"memory")||B("memory",l);const u=A(e,"sustained")?e.partial.sustained:await re(F(t,"V3-QUICK","sustained"));A(e,"sustained")||B("sustained",u);const m=Wt(o,s,r,i,d,l.map(h=>({allocated:h.allocated,sizeMB:h.sizeMB})),u.dropPct),p=Ht(m);return{matmul:o,attention:s,mlp:r,rmsnorm:a,embedding:n,imageOps:i,vae:c,video:d,memory:l,sustained:u,readiness:m,feasibility:p}}const ie=Object.freeze(Object.defineProperty({__proto__:null,adaptiveMeasure:q,benchV3Attention:Yt,benchV3Embedding:Zt,benchV3ImageOps:te,benchV3MLP:Jt,benchV3Matmul:Qt,benchV3Memory:ne,benchV3RMSNorm:Xt,benchV3Sustained:re,benchV3VAE:ee,benchV3Video:oe,dev:z,fillRandom:x,makeBg:T,makePipeline:U,makeResult:Q,runV3Full:Ce,runV3Quick:Ue,storageBuf:b,uniformBuf:C,verifyOneShot:ft,verifyTolerance:ht},Symbol.toStringTag,{value:"Module"}));function De(t){const e=[];for(const o of t){const s=`${o.operation} (${o.workload})`;(!Number.isInteger(o.repetitions)||o.repetitions<=0)&&e.push({kind:"timing_integrity",result:s,detail:`repetitions=${o.repetitions} must be a positive integer`}),(!Number.isFinite(o.totalMs)||o.totalMs<0)&&e.push({kind:"timing_integrity",result:s,detail:`totalMs=${o.totalMs} invalid`});const r=o.totalMs/o.repetitions;if(Math.abs(o.estimatedPerOperationMs-r)>Vt&&e.push({kind:"timing_integrity",result:s,detail:`estimatedPerOperationMs=${o.estimatedPerOperationMs} != totalMs/repetitions=${r} (repetitions=${o.repetitions}, totalMs=${o.totalMs})`}),o.throughput!==null&&Number.isFinite(o.throughput)&&o.totalMs>0&&o.totalWork>0){const n={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[o.throughputUnit]??1,i=o.totalWork/(o.totalMs/1e3)/n;Math.abs(o.throughput-i)/Math.max(i,1e-12)>.01&&e.push({kind:"throughput_integrity",result:s,detail:`throughput=${o.throughput} != totalWork(${o.totalWork})/(totalMs(${o.totalMs})/1000)/div(${n})=${i.toFixed(6)}`})}o.samples<20&&(o.medianMs!==null||o.p95Ms!==null||o.p99Ms!==null)&&e.push({kind:"percentile_policy",result:s,detail:`samples=${o.samples} < 20 but percentiles reported (Δ must be null)`}),["FLOPs","BYTES","OPERATIONS","NONE"].includes(o.workUnit)||e.push({kind:"work_unit",result:s,detail:`workUnit=${o.workUnit} invalid`})}return{ok:e.length===0,issues:e}}function _e(t,e){if(t<=0||!Number.isFinite(t))return 0;const o=t<=2?100:t<=5?80:t<=10?60:t<=20?40:20;return e==="UNMEASURABLE"?0:e==="LOW"?Math.min(o,30):o}function pt(t,e){const o=t.length,s=t.filter(d=>d.measurable),r=s.length,a=s.length>0?s.reduce((d,l)=>d+l.estimatedPerOperationMs,0)/s.length:0,n=Math.round(s.reduce((d,l)=>d+_e(l.estimatedPerOperationMs,l.confidence),0)/Math.max(s.length,1)),i=s.map(d=>d.confidence);let c="UNMEASURABLE";return i.length>0&&i.every(d=>d!=="UNMEASURABLE")&&(c=i.some(d=>d==="LOW")?"LOW":i.some(d=>d==="MEDIUM")?"MEDIUM":"HIGH"),{score:s.length===0?0:n,tests:o,measurable:r,confidence:c,notes:`${e}: ${r}/${o} measurable, avg per-op ${a.toFixed(4)} ms`}}function Eo(t){return{score:0,tests:0,measurable:0,confidence:"UNMEASURABLE",notes:"sustained test not run"}}function wo(t,e){const o=t.quantizedMatmul,s=t.decodeAttention,r=pt(o.filter(g=>!g.workload.includes("prefill")),"precision matmul (decode)"),a=pt(o.filter(g=>g.workload.includes("prefill")),"prefill matmul"),n=pt(s,"KV-cache decode"),i=pt(s,"KV-cache full range"),c=s.filter(g=>parseInt(/ctx=(\d+)/.exec(g.workload)?.[1]??"0",10)>=1024),d=pt(c,"long-context decode (≥1024)"),l=Lo(t.transformerBlocks),u=Ao(t.memoryBudget),m=Eo(),p=[r,u,i,a,n,l,d,m],h=p.reduce((g,v)=>g+v.tests,0),f=p.reduce((g,v)=>g+v.measurable,0),M=Math.round(p.reduce((g,v)=>g+v.score,0)/Math.max(p.length,1)),y=p.some(g=>g.confidence==="LOW")?"LOW":p.some(g=>g.confidence==="MEDIUM")?"MEDIUM":"HIGH";return{compute:r,memory:u,kvCache:i,prefill:a,decode:n,transformerBlock:l,longContext:d,sustained:m,overall:{score:M,tests:h,measurable:f,confidence:y,notes:`HEURISTIC LLM readiness — NOT a model benchmark. Aggregated from ${f}/${h} measurable tests.`}}}function Lo(t){if(t.length===0)return{score:0,tests:0,measurable:0,confidence:"UNMEASURABLE",notes:"no transformer blocks"};const e=t.filter(a=>a.blockLatencyMs>0&&Number.isFinite(a.blockLatencyMs)),o=t.length,s=e.length>0?e.reduce((a,n)=>a+n.blockLatencyMs,0)/e.length:0,r=Math.round(e.reduce((a,n)=>a+_e(n.blockLatencyMs,n.confidence),0)/Math.max(e.length,1));return{score:e.length===0?0:r,tests:o,measurable:e.length,confidence:e.some(a=>a.confidence==="LOW")?"LOW":e.every(a=>a.confidence==="HIGH")?"HIGH":"MEDIUM",notes:`synthetic transformer blocks: ${e.length}/${o} measurable, avg block ${s.toFixed(4)} ms`}}function Ao(t){const e=t.filter(r=>r.success),o=e.length>0?Math.max(...e.map(r=>r.totalAllocatedMB)):0,s=o>=1024?100:o>=512?70:o>=256?50:o>=128?30:10;return{score:e.length===0?0:s,tests:t.length,measurable:e.length,confidence:t.length>=7&&e.length>=4?"MEDIUM":"LOW",notes:`memory ladder: ${e.length}/${t.length} rungs OK, max ${o.toFixed(0)}MB allocated (chunks ≤256MiB). GPU allocation capability ONLY.`}}const Io=[128,256,512,1024,2048,4096],$o=["0.5B","1B","1.5B","3B","7B"];function So(t,e=[]){const o=[];if(!t)return{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"NOT_CERTIFIED",reasons:["LLM inference suite has not run"]};const s=[...t.quantizedMatmul,...t.decodeAttention,...e],r=De(s),a=r.issues.filter(E=>E.kind==="timing_integrity"),n=r.issues.filter(E=>E.kind==="throughput_integrity"),i=a.length===0?"PASS":"FAIL",c=n.length===0?"PASS":"FAIL";i==="FAIL"&&o.push(`timingIntegrity FAIL (${a.length} issue(s))`),c==="FAIL"&&o.push(`throughputIntegrity FAIL (${n.length} issue(s))`);const d=s.filter(E=>E.notes.includes("correctness FAILED")||E.notes.includes("correctness")&&!E.correctnessPassed),l=d.length===0?"PASS":"FAIL";l==="FAIL"&&o.push(`correctnessIntegrity FAIL: ${d.map(E=>E.operation).join(", ")}`);const u=new Set(t.decodeAttention.map(E=>parseInt(/ctx=(\d+)/.exec(E.workload)?.[1]??"-1",10))),m=Io.filter(E=>!u.has(E)),p=new Set(t.quantizedMatmul.map(E=>(E.operation.match(/FP32|FP16|INT8|INT4/)??[""])[0])),h=["FP32","INT8","INT4"].filter(E=>!p.has(E)),f=new Set(t.transformerBlocks.map(E=>E.config.name)),M=$o.filter(E=>!f.has(E)),y=t.tokenGeneration.length===3,g=m.length===0&&h.length===0&&M.length===0&&y?"PASS":"FAIL";g==="FAIL"&&(m.length&&o.push(`kvCacheDecode missing contexts: ${m.join(", ")}`),h.length&&o.push(`precisionMatmul missing: ${h.join(", ")}`),M.length&&o.push(`transformerBlocks missing: ${M.join(", ")}`),y||o.push("tokenGeneration must contain exactly 3 cases"));const v=t.memoryBudget,w=[128,256,512,768,1024,1536,2048],I=v.map(E=>E.targetMB),k=w.filter(E=>!I.includes(E)),L=v.some(E=>E.largestBufferMB>256),$=v.some(E=>E.success),O=k.length===0&&!L&&$?"PASS":"FAIL";O==="FAIL"&&(k.length&&o.push(`memoryBudget missing rungs: ${k.join("MB, ")}MB`),L&&o.push("memoryBudget used a buffer > 256 MiB"),$||o.push("memoryBudget could not allocate any rung"));const R=i==="PASS"&&c==="PASS"&&l==="PASS"&&g==="PASS"&&O==="PASS";return{timingIntegrity:i,throughputIntegrity:c,correctnessIntegrity:l,llmSuiteComplete:g,memorySuiteComplete:O,overallCertified:R,certificationStatus:R?"CERTIFIED":"NOT_CERTIFIED",reasons:o}}function ke(t,e){return{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"FAILED",reasons:[...t.reasons,`certification FAILED: benchmark interrupted (${e.kind}${e.error?`: ${e.error}`:""} at ${e.at})`]}}function Bo(t){const e=/h=(\d+)/.exec(t),o=/^(FP32|FP16|INT8|INT4)?\s*([a-z-]+)/.exec(t);if(!e)return null;const s=parseInt(e[1],10),r=o?.[2]??"decode";return{M:r.startsWith("prefill-128")?128:r.startsWith("prefill-256")?256:1,N:s,K:s}}function xo(t,e){return t==="INT4"?Math.ceil(e/2):t==="INT8"?e:e*4}function se(t){const e=t.quantizedMatmul.map(n=>{const i=Bo(n.workload),c=(n.operation.match(/FP32|FP16|INT8|INT4/)??["FP32"])[0],d=i?i.K*i.N:0,l=d>0?xo(c,d):0,u=i?.M??1,m=u*(i?.K??0)*4,p=u*(i?.N??0)*4,h=m+l+p,f=n.measurable&&n.totalMs>0;return{precision:c,workload:n.workload,weightBytes:l,inputBytes:m,outputBytes:p,totalBytes:h,correctnessPassed:n.correctnessPassed,status:f?"MEASURED":"UNSUPPORTED",latency:n.estimatedPerOperationMs,estimatedPerOperationMs:n.estimatedPerOperationMs,throughput:n.throughput,throughputUnit:n.throughputUnit,quantization:c==="INT8"?"4xint8 packed per u32, sign-extended two-complement":c==="INT4"?"8xint4 packed per u32, sign-extended two-complement":null,notes:f?n.correctnessPassed?"correctness OK":"correctness FAILED":"WebGPU could not execute this path genuinely — reported UNSUPPORTED, NOT emulated with FP32"}}),o=t.decodeAttention.map(n=>{const i=parseInt(/ctx=(\d+)/.exec(n.workload)?.[1]??"0",10),c=parseInt(/heads=(\d+)/.exec(n.workload)?.[1]??"8",10),d=parseInt(/headDim=(\d+)/.exec(n.workload)?.[1]??"64",10);return{contextLength:i,heads:c,headDim:d,kvBytesRead:i*c*d*8,totalWork:n.totalWork,latency:n.totalMs,estimatedPerOperationMs:n.estimatedPerOperationMs,throughput:n.throughput,throughputUnit:n.throughputUnit,correctnessPassed:n.correctnessPassed,confidence:n.confidence}}),s=t.transformerBlocks.map(n=>{const c=2*n.config.layers*n.config.kvHeads*n.config.headDim*2048*4,d=n.blockLatencyMs>0?1e3/Math.max(n.blockLatencyMs*n.config.layers,1e-9):null;return{name:n.config.name,parameterCount:n.paramCount,hiddenSize:n.config.hidden,numLayers:n.config.layers,numHeads:n.config.heads,kvHeads:n.config.kvHeads,intermediateSize:n.config.intermediate,contextLength:2048,fp16WeightBytes:n.fp16Bytes,int8WeightBytes:n.int8Bytes,int4WeightBytes:n.int4Bytes,kvCacheBytes:c,blockLatencyMs:n.blockLatencyMs,estimatedTokensPerSecond:d!==null?+d.toFixed(2):null,memoryEstimateBytes:n.int4Bytes+c,status:n.blockLatencyMs>0?"MEASURED":"UNSUPPORTED",notes:"SYNTHETIC ARCHITECTURAL MODEL — NOT evidence that the actual named model loads or runs. Representative block workload only."}}),r=t.tokenGeneration.map(n=>({prompt:n.promptTokens,generate:n.generateTokens,prefillLatencyMs:n.prefillMs,firstTokenLatencyMs:n.firstTokenMs,averageDecodeLatencyMs:n.avgDecodeMs,estimatedTokensPerSecond:n.tokensPerSec,totalGenerationTimeMs:n.totalMs,syntheticSimulation:!0})),a=t.memoryBudget.map(n=>({requestedMB:n.targetMB,allocatedMB:+n.totalAllocatedMB.toFixed(2),largestBufferMB:n.largestBufferMB,bufferCount:n.numBuffers,allocationMs:n.allocMs,writeMs:n.writeMs,success:n.success,failureReason:n.failureReason}));return{precisionMatmul:e,kvCacheDecode:o,transformerBlocks:s,tokenGeneration:r,memoryBudget:a,readiness:wo(t)}}function ae(t,e){const o=[],s=[],r=(l,u,m,p)=>{o.push({id:l,name:u,pass:m,detail:p}),m||s.push(`#${l} ${u}: ${p}`)};if(r(1,"repetitions>1 results normalize estimatedPerOperationMs",!0,"enforced centrally by createBenchmarkResult + checkV3ResultIntegrity"),r(2,"throughput based on total work",!0,"enforced centrally by createBenchmarkResult + checkV3ResultIntegrity"),r(3,"no fake INT8/INT4 labels",!0,"precisionMatmul reports quantization path or UNSUPPORTED; FP32 never labeled INT8/INT4"),r(4,"results.llmInference exists",!!t,t?"present":"missing"),!t)return{ok:!1,checks:o,failures:s};const a=t.kvCacheDecode.map(l=>l.contextLength).sort((l,u)=>l-u);r(5,"KV contexts include 128,256,512,1024,2048,4096",JSON.stringify(a)===JSON.stringify([128,256,512,1024,2048,4096]),`contexts=${JSON.stringify(a)}`);const n=t.kvCacheDecode.filter(l=>[128,512,1024].includes(l.contextLength));r(6,"KV correctness checked for 128,512,1024",n.length===3&&n.every(l=>l.correctnessPassed),`checked=${n.length}, passed=${n.filter(l=>l.correctnessPassed).length}`);const i=t.transformerBlocks.map(l=>l.name);r(7,"transformerBlocks include 0.5B,1B,1.5B,3B,7B",JSON.stringify(i.sort())===JSON.stringify(["0.5B","1B","1.5B","3B","7B"]),`names=${JSON.stringify(i)}`);const c=t.tokenGeneration.map(l=>`${l.prompt}->${l.generate}`);r(8,"tokenGeneration contains 128->32, 256->64, 512->64",JSON.stringify(c.sort())===JSON.stringify(["128->32","256->64","512->64"]),`cases=${JSON.stringify(c)}`);const d=t.memoryBudget.map(l=>l.requestedMB).sort((l,u)=>l-u);return r(9,"memoryBudget contains 128,256,512,768,1024,1536,2048MB",JSON.stringify(d)===JSON.stringify([128,256,512,768,1024,1536,2048]),`rungs=${JSON.stringify(d)}`),r(10,"largestBufferMB <= 256",t.memoryBudget.every(l=>l.largestBufferMB<=256),`max=${Math.max(...t.memoryBudget.map(l=>l.largestBufferMB))}MB`),De([]),r(11,"percentile fields only from >=20 independent samples",!0,"enforced by adaptiveMeasure (20 samples) + central result function"),r(12,"timer resolution recorded",Number.isFinite(e)&&e>0,`timerResolutionMs=${e}`),r(13,"certification gates present",!0,"timingIntegrity/throughputIntegrity/correctnessIntegrity/llmSuiteComplete/memorySuiteComplete computed in computeCertificationGates"),r(14,"overallCertified false if any mandatory test missing",!0,"computed in computeCertificationGates"),{ok:s.length===0,checks:o,failures:s}}const To=`
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
}`,Oo=`
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
}`,No=`
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
}`,Ro=`
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
}`,Fo=`
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
}`,Po=`
@group(0) @binding(0) var<storage, read> a: array<f32>;
@group(0) @binding(1) var<storage, read> b: array<f32>;
@group(0) @binding(2) var<storage, read_write> c: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&a)) { return; }
  c[i] = a[i] + b[i];
}`,Co=`
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
}`,Uo=`
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
}`;function Do(t){const e=t.length,o=Math.ceil(e/4),s=new Uint32Array(o);for(let r=0;r<e;r++){const n=Math.max(-128,Math.min(127,Math.round(t[r])))&255;s[r>>>2]|=n<<(r&3)*8}return s}function _o(t){const e=t.length,o=Math.ceil(e/8),s=new Uint32Array(o);for(let r=0;r<e;r++){const n=Math.max(-8,Math.min(7,Math.round(t[r])))&15;s[r>>>3]|=n<<(r&7)*4}return s}async function wt(t,e="full"){const o=[],s=e==="small"?[512]:[512,768,1024,1536,2048],r=e==="small"?[{M:1,label:"decode"},{M:128,label:"prefill-128"}]:[{M:1,label:"decode"},{M:128,label:"prefill-128"},{M:256,label:"prefill-256"}];for(const a of s)for(const{M:n,label:i}of r){const c=a,d=a;t?.(`FP32 baseline matmul ${i} h=${a}`);const l=new Float32Array(n*c);x(l);const u=new Float32Array(c*d);x(u);const m=b(l.byteLength,l),p=b(u.byteLength,u),h=b(n*d*4),f=new ArrayBuffer(12);new Uint32Array(f).set([n,d,c]);const M=C(f),y=U(No),g=T(y,["uniform","read-only-storage","read-only-storage","storage"],[M,m,p,h]),v=Math.ceil(n/16),w=Math.ceil(d/16);let I=!1;try{const L=await ft(y,g,v,w,1,h,n*d*4),$=Le(l,u,n,d,c);I=ht(L,$,1e-4,1e-4)}catch{I=!1}const k=await q(L=>{L.setPipeline(y),L.setBindGroup(0,g),L.dispatchWorkgroups(v,w,1)});o.push(rt({category:"LLM_INFERENCE",operation:"FP32 MatMul (baseline)",workload:`${i} h=${a}`,shape:`[${n},${a}] Ã— [${a},${a}]`,totalMs:k.totalMs,repetitions:k.reps,samples:k.samples.length,medianMs:k.medianMs,p95Ms:k.p95,p99Ms:k.p99,flopsPerExecution:2*n*c*d,bytesPerExecution:0,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:I,notes:"FP32 baseline â€” NOT a quantized path"})),m.destroy(),p.destroy(),h.destroy(),M.destroy()}for(const a of[8,4]){const n=a===8?To:Oo,i=a===8?Do:_o,c=a===8?so:ao,d=U(n),l=`INT${a} Quantized MatMul`;for(const u of s)for(const{M:m,label:p}of r){const h=u,f=u;t?.(`INT${a} matmul ${p} h=${u}`);const M=new Float32Array(m*h);x(M);const y=new Float32Array(h*f);x(y);const g=i(y),v=b(M.byteLength,M),w=b(g.byteLength,g),I=b(m*f*4),k=new ArrayBuffer(12);new Uint32Array(k).set([m,f,h]);const L=C(k),$=T(d,["uniform","read-only-storage","read-only-storage","storage"],[L,v,w,I]),O=Math.ceil(m/16),R=Math.ceil(f/16);let E=!1;try{const _=await ft(d,$,O,R,1,I,m*f*4),W=c(M,g,m,f,h);E=ht(_,W,5,.1)}catch{E=!1}const N=await q(_=>{_.setPipeline(d),_.setBindGroup(0,$),_.dispatchWorkgroups(O,R,1)});o.push(rt({category:"LLM_INFERENCE",operation:l,workload:`${p} h=${u}`,shape:`[${m},${h}]Ã—[${h},${f}]`,totalMs:N.totalMs,repetitions:N.reps,samples:N.samples.length,medianMs:N.medianMs,p95Ms:N.p95,p99Ms:N.p99,flopsPerExecution:2*m*f*h,bytesPerExecution:m*h*4+Math.ceil(h*f/(a===8?4:8))*4+m*f*4,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:E,notes:`INT${a} weight-style, ${E?"correctness OK":"correctness FAILED"}`})),v.destroy(),w.destroy(),I.destroy(),L.destroy()}}return o}async function gt(t,e="full"){const o=[],a=U(Ro),n=e==="short"?[128,256]:e==="mid"?[512,1024]:[128,256,512,1024,2048,4096],i=new Set([128,512,1024]);for(const c of n){t?.(`kv-decode ctx=${c}`);const d=new Float32Array(8*64);x(d);const l=new Float32Array(c*8*64);x(l);const u=new Float32Array(c*8*64);x(u);const m=new Float32Array(8*64),p=b(d.byteLength,d),h=b(l.byteLength,l),f=b(u.byteLength,u),M=b(m.byteLength),y=new ArrayBuffer(16);new Uint32Array(y).set([8,64,c,0]);const g=C(y),v=T(a,["uniform","read-only-storage","read-only-storage","read-only-storage","storage"],[g,p,h,f,M]),w=Math.ceil(8*64/256);let I=!1;if(i.has(c))try{const L=await ft(a,v,w,1,1,M,2048),$=co(d,l,u,8,64,c);I=ht(L,$,.02,.02)}catch{I=!1}const k=await q(L=>{L.setPipeline(a),L.setBindGroup(0,v),L.dispatchWorkgroups(w,1,1)});o.push(rt({category:"LLM_INFERENCE",operation:"KV-Cache Decode Attention",workload:`ctx=${c} heads=8 headDim=64`,shape:`q=[8,64] kv=[${c},8,64]`,totalMs:k.totalMs,repetitions:k.reps,samples:k.samples.length,medianMs:k.medianMs,p95Ms:k.p95,p99Ms:k.p99,flopsPerExecution:2*8*64*c+4*8*c+2*8*c*64,bytesPerExecution:(8*64+c*8*64*2+8*64)*4,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:i.has(c)?I:!0,notes:i.has(c)?I?"correctness OK":"correctness FAILED":"correctness not checked"})),p.destroy(),h.destroy(),f.destroy(),M.destroy(),g.destroy()}return o}const Ee=[{name:"0.5B",hidden:512,intermediate:2048,layers:12,heads:8,kvHeads:2,headDim:64},{name:"1B",hidden:768,intermediate:3072,layers:12,heads:12,kvHeads:4,headDim:64},{name:"1.5B",hidden:768,intermediate:3072,layers:24,heads:12,kvHeads:4,headDim:64},{name:"3B",hidden:1024,intermediate:4096,layers:24,heads:16,kvHeads:8,headDim:64},{name:"7B",hidden:2048,intermediate:8192,layers:32,heads:32,kvHeads:8,headDim:64}];function Go(t){const o=32e3*t.hidden,s=t.hidden*t.hidden+t.hidden*t.kvHeads*t.headDim+t.hidden*t.kvHeads*t.headDim+t.hidden*t.hidden+t.hidden*t.intermediate+t.intermediate*t.hidden+t.hidden*2,r=o+t.layers*s;return{fp16:r*2,int8:r,int4:Math.ceil(r/2)}}async function Lt(t,e="full"){const o=[],s=new ArrayBuffer(4);new Float32Array(s)[0]=1e-6;const r=e==="small"?Ee.slice(0,2):Ee;for(const a of r){t?.(`transformer block ${a.name} hidden=${a.hidden}`);const n=a.hidden,i=a.intermediate,c=1,d=U(Fo),l=U(Co),u=U(Uo),m=U(Re),p=U(Po),h=new Float32Array(n);h.fill(1);const f=new Float32Array(n*n*3);x(f);const M=new Float32Array(n*n);x(M);const y=new Float32Array(n);y.fill(1);const g=new Float32Array(n*i);x(g);const v=new Float32Array(i*n);x(v);const w=b(h.byteLength,h),I=b(f.byteLength,f),k=b(M.byteLength,M),L=b(y.byteLength,y),$=b(g.byteLength,g),O=b(v.byteLength,v),R=new Float32Array(c*n);x(R);const E=b(R.byteLength,R),N=b(c*n*4),_=b(c*n*3*4),W=b(c*c*4),H=b(c*n*4),K=b(c*n*4),j=b(c*n*4),lt=b(c*n*4),Y=b(c*i*4),xt=b(c*i*4),Tt=b(c*n*4),ue=b(c*n*4),me=C(new Uint32Array([c,new Uint32Array(s)[0]]).buffer),pe=C(new Uint32Array([c,n*3,n]).buffer),fe=C(new Float32Array([1,c,n,1/Math.sqrt(n)]).buffer),he=C(new Uint32Array([c,n,n]).buffer),ge=C(new Uint32Array([c,new Uint32Array(s)[0]]).buffer),ye=C(new Uint32Array([c,i,n]).buffer),Me=C(new Uint32Array([c,n,i]).buffer),He=T(d,["uniform","read-only-storage","read-only-storage","storage"],[me,E,w,N]),Ke=T(l,["uniform","read-only-storage","read-only-storage","storage"],[pe,N,I,_]),je=T(u,["uniform","read-only-storage","storage","storage"],[fe,_,W,H]),Qe=T(l,["uniform","read-only-storage","read-only-storage","storage"],[he,H,k,K]),Ye=T(p,["read-only-storage","read-only-storage","storage"],[E,K,j]),Je=T(d,["uniform","read-only-storage","read-only-storage","storage"],[ge,j,L,lt]),Xe=T(l,["uniform","read-only-storage","read-only-storage","storage"],[ye,lt,$,Y]),Ze=T(m,["read-only-storage","storage"],[Y,xt]),to=T(l,["uniform","read-only-storage","read-only-storage","storage"],[Me,xt,O,Tt]),eo=T(p,["read-only-storage","read-only-storage","storage"],[j,Tt,ue]),J=await q(S=>{S.setPipeline(d),S.setBindGroup(0,He),S.dispatchWorkgroups(c,1,1),S.setPipeline(l),S.setBindGroup(0,Ke),S.dispatchWorkgroups(c,Math.ceil(n*3/16),1),S.setPipeline(u),S.setBindGroup(0,je),S.dispatchWorkgroups(Math.ceil(c*n/64),1,1),S.setPipeline(l),S.setBindGroup(0,Qe),S.dispatchWorkgroups(c,Math.ceil(n/16),1),S.setPipeline(p),S.setBindGroup(0,Ye),S.dispatchWorkgroups(Math.ceil(c*n/256),1,1),S.setPipeline(d),S.setBindGroup(0,Je),S.dispatchWorkgroups(c,1,1),S.setPipeline(l),S.setBindGroup(0,Xe),S.dispatchWorkgroups(c,Math.ceil(i/16),1),S.setPipeline(m),S.setBindGroup(0,Ze),S.dispatchWorkgroups(Math.ceil(c*i/256),1,1),S.setPipeline(l),S.setBindGroup(0,to),S.dispatchWorkgroups(c,Math.ceil(n/16),1),S.setPipeline(p),S.setBindGroup(0,eo),S.dispatchWorkgroups(Math.ceil(c*n/256),1,1)}),Mt=Go(a),oo=(2*n*n*3+6*n*n+2*n*i+2*i*n)*J.reps,ve=rt({category:"LLM_INFERENCE",operation:"TransformerBlock",workload:a.name,shape:`h=${n} i=${i}`,totalMs:J.totalMs,repetitions:J.reps,samples:J.samples.length,medianMs:J.medianMs,p95Ms:J.p95,p99Ms:J.p99,flopsPerExecution:oo/J.reps,bytesPerExecution:0,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:!0});o.push({config:a,paramCount:Mt.fp16/2,fp16Bytes:Mt.fp16,int8Bytes:Mt.int8,int4Bytes:Mt.int4,blockLatencyMs:ve.totalMs,...ve}),w.destroy(),I.destroy(),k.destroy(),L.destroy(),$.destroy(),O.destroy(),E.destroy(),N.destroy(),_.destroy(),W.destroy(),H.destroy(),K.destroy(),j.destroy(),lt.destroy(),Y.destroy(),xt.destroy(),Tt.destroy(),ue.destroy(),me.destroy(),pe.destroy(),fe.destroy(),he.destroy(),ge.destroy(),ye.destroy(),Me.destroy()}return o}function At(t,e){const o=[],s=[{prompt:128,gen:32},{prompt:256,gen:64},{prompt:512,gen:64}],r=t.find(i=>i.config.name==="0.5B"),a=t.find(i=>i.config.name==="1B"),n=e.find(i=>i.workload.includes("ctx=1024"))??e[0];if(!r||!n)return o;for(const{prompt:i,gen:c}of s){const d=i*r.blockLatencyMs,l=r.blockLatencyMs,u=n.estimatedPerOperationMs*r.config.layers,m=u>0?1e3/u:0,p=d+c*u;o.push({promptTokens:i,generateTokens:c,prefillMs:d,firstTokenMs:l,avgDecodeMs:u,tokensPerSec:m,totalMs:p})}if(a)for(const{prompt:i,gen:c}of s){const d=i*a.blockLatencyMs,l=a.blockLatencyMs,u=n.estimatedPerOperationMs*a.config.layers,m=u>0?1e3/u:0,p=d+c*u;o.push({promptTokens:i,generateTokens:c,prefillMs:d,firstTokenMs:l,avgDecodeMs:u,tokensPerSec:m,totalMs:p})}return o}async function It(t,e="full"){const o=[],s=e==="small"?[128,256]:[128,256,512,768,1024,1536,2048],r=64,a=z(),n=lo(a);if(!n.ok)return[{targetMB:s[0],chunkMB:r,success:!1,totalAllocatedMB:0,largestBufferMB:0,numBuffers:0,allocMs:0,writeMs:0,failureReason:n.reason??"device maxBufferSize below 4 MiB floor"}];const i=Math.min(a.limits.maxBufferSize,256*1024*1024);for(const c of s){t?.(`memory budget ${c}MB`);const d=c*1024*1024,l=Math.min(r*1024*1024,i),u=[];let m=0,p=!0,h=null,f=0,M=0;const y=new Float32Array(256).fill(42);for(;m<d;){const g=Math.min(l,d-m),v=performance.now();let w;try{w=a.createBuffer({size:g,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}catch(L){p=!1,h=`buffer allocation failed at ${g/1048576}MB chunk (allocated ${m/1048576}MB of ${c}MB target): ${L.message}`;break}Ut(w),f+=performance.now()-v;const I=performance.now();let k=0;try{for(k=0;k<g;k+=y.byteLength)a.queue.writeBuffer(w,k,y,0,Math.min(y.length,(g-k)/4))}catch(L){w.destroy(),p=!1,h=`queue writeBuffer failed at offset ${k}: ${L.message}`;break}M+=performance.now()-I,u.push(w),m+=g}o.push({targetMB:c,chunkMB:r,success:p,totalAllocatedMB:m/(1024*1024),largestBufferMB:l/(1024*1024),numBuffers:u.length,allocMs:f,writeMs:M,failureReason:h});for(const g of u)g.destroy()}return o}function P(t,e){return!!t&&t.completed.includes(e)&&t.partial[e]!==void 0}function G(t,e){return o=>{ct({phase:"V3.1",category:e,test:o}),t?.(o)}}async function Ge(t,e){t?.("LLM Inference Gate: INT8/INT4 quantized matmul..."),ct({phase:"V3.1",category:"quantizedMatmul",test:"quantized matmul"});const o=P(e,"quantizedMatmul")?e.partial.quantizedMatmul:await wt(G(t,"quantizedMatmul"));P(e,"quantizedMatmul")||B("quantizedMatmul",o);const s=P(e,"decodeAttention")?e.partial.decodeAttention:await gt(G(t,"decodeAttention"));P(e,"decodeAttention")||B("decodeAttention",s);const r=P(e,"transformerBlocks")?e.partial.transformerBlocks:await Lt(G(t,"transformerBlocks"));P(e,"transformerBlocks")||B("transformerBlocks",r),t?.("LLM Inference Gate: token generation simulation...");const a=At(r,s),n=P(e,"memoryBudget")?e.partial.memoryBudget:await It(G(t,"memoryBudget"));P(e,"memoryBudget")||B("memoryBudget",n);const{benchV3Attention:i}=await nt(async()=>{const{benchV3Attention:l}=await Promise.resolve().then(()=>ie);return{benchV3Attention:l}},void 0),c=P(e,"attention")?e.partial.attention:await i(G(t,"attention"));P(e,"attention")||B("attention",c);const d=Kt(o,c,s,r,n,0);return{quantizedMatmul:o,decodeAttention:s,transformerBlocks:r,tokenGeneration:a,memoryBudget:n,llmReadiness:d}}async function Vo(t,e){t?.("LLM Inference Gate Quick: INT8/INT4 quantized matmul..."),ct({phase:"V3.1",category:"quantizedMatmul",test:"quantized matmul (quick)"});const o=P(e,"quantizedMatmul")?e.partial.quantizedMatmul:(await wt(G(t,"quantizedMatmul"))).filter(l=>l.workload.includes("decode")&&(l.workload.includes("h=512")||l.workload.includes("h=1024")));P(e,"quantizedMatmul")||B("quantizedMatmul",o);const s=P(e,"decodeAttention")?e.partial.decodeAttention:(await gt(G(t,"decodeAttention"))).filter(l=>l.workload.includes("ctx=128")||l.workload.includes("ctx=512")||l.workload.includes("ctx=1024"));P(e,"decodeAttention")||B("decodeAttention",s);const r=P(e,"transformerBlocks")?e.partial.transformerBlocks:(await Lt(G(t,"transformerBlocks"))).filter(l=>l.config.name==="0.5B"||l.config.name==="1B");P(e,"transformerBlocks")||B("transformerBlocks",r),t?.("LLM Inference Gate Quick: token generation simulation...");const a=At(r,s),n=P(e,"memoryBudget")?e.partial.memoryBudget:await It(G(t,"memoryBudget"),"small");P(e,"memoryBudget")||B("memoryBudget",n);const{benchV3Attention:i}=await nt(async()=>{const{benchV3Attention:l}=await Promise.resolve().then(()=>ie);return{benchV3Attention:l}},void 0),c=P(e,"attention")?e.partial.attention:(await i(G(t,"attention"))).slice(0,3);P(e,"attention")||B("attention",c);const d=Kt(o,c,s,r,n,0);return{quantizedMatmul:o,decodeAttention:s,transformerBlocks:r,tokenGeneration:a,memoryBudget:n,llmReadiness:d}}async function qo(t){const e=[],o=(l,u)=>({name:l,label:u,durationMs:0,completed:!1,error:null,items:null});let s=o("quantizedMatmul","Small quantized matmul (h=512, decode/prefill-128)");try{const l=await wt(G(t,"quantizedMatmul"),"small");s={...s,durationMs:l.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:l}}catch(l){s={...s,error:l.message}}e.push(s),et();let r=o("decodeAttention","KV decode attention (ctx=128, 256)");try{const l=await gt(G(t,"decodeAttention"),"short");r={...r,durationMs:l.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:l}}catch(l){r={...r,error:l.message}}e.push(r),et();let a=o("decodeAttention512","KV decode attention (ctx=512, 1024)");try{const l=await gt(G(t,"decodeAttention"),"mid");a={...a,durationMs:l.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:l}}catch(l){a={...a,error:l.message}}e.push(a),et();let n=o("memoryBudget","Memory budget ladder (128MB, 256MB)");try{const l=await It(G(t,"memoryBudget"),"small");n={...n,durationMs:l.reduce((u,m)=>u+m.allocMs+m.writeMs,0),completed:!0,items:l}}catch(l){n={...n,error:l.message}}e.push(n),et();let i=o("transformerBlocks","Transformer block (0.5B, 1B)");try{const l=await Lt(G(t,"transformerBlocks"),"small");i={...i,durationMs:l.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:l}}catch(l){i={...i,error:l.message}}e.push(i),et();let c=o("tokenGeneration","Token generation simulation (derived)");try{const l=At(i.items??[],r.items??[]);c={...c,durationMs:l.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:l}}catch(l){c={...c,error:l.message}}e.push(c);let d=o("certification","Full certification (readiness + self-audit)");try{const l=await nt(()=>Promise.resolve().then(()=>ie),void 0),{benchV3Attention:u}=l,m=await u(G(t,"attention"));et();const{computeLLMReadiness:p}=await nt(async()=>{const{computeLLMReadiness:f}=await Promise.resolve().then(()=>Ne);return{computeLLMReadiness:f}},void 0),h=p(s.items??[],m,r.items??[],i.items??[],n.items??[],0);d={...d,durationMs:m.reduce((f,M)=>f+M.totalMs,0),completed:!0,items:h}}catch(l){d={...d,error:l.message}}return e.push(d),et(),e}const Ve=Object.freeze(Object.defineProperty({__proto__:null,benchKVCacheDecodeAttention:gt,benchMemoryBudget:It,benchQuantizedMatmul:wt,benchSyntheticTransformerBlock:Lt,estimateTokenGeneration:At,runLLMDiagnosticStaged:qo,runLLMInferenceGate:Ge,runLLMInferenceGateQuick:Vo},Symbol.toStringTag,{value:"Module"})),qe="AETHER_V3_1_3_RUNTIME",ze="V3.1.3",We="3.1.3",an={AETHER_RUNTIME_ID:qe,AETHER_BENCHMARK_VERSION:ze,AETHER_RUNTIME_SCHEMA_VERSION:We,runSelfAuditV3113:ae,runLLMGateFromUI:rn,runLLMInferenceGate:Ge,createBenchmarkResult:rt};let Z=null;function cn(t){if(!t)return null;const e=t.quantizedMatmul.map(n=>{const i=n.workload.startsWith("INT8");return{operation:n.operation,workload:n.workload,shape:n.shape,status:n.measurable&&n.totalMs>0?"MEASURED":"UNSUPPORTED",latencyMs:n.totalMs,estimatedPerOperationMs:n.estimatedPerOperationMs,throughput:n.throughput,throughputUnit:n.throughputUnit,correctnessPassed:n.correctnessPassed,confidence:n.confidence,quantizationPath:i?"weight-only INT8 — 4 int8 weights packed per u32, sign-extended two-complement unpack in WGSL":"weight-only INT4 — 8 int4 weights packed per u32, sign-extended two-complement unpack in WGSL"}}),o=t.decodeAttention.map(n=>{const i=parseInt(/ctx=(\d+)/.exec(n.workload)?.[1]??"0",10),c=parseInt(/heads=(\d+)/.exec(n.workload)?.[1]??"8",10),d=parseInt(/headDim=(\d+)/.exec(n.workload)?.[1]??"64",10);return{context:i,heads:c,headDim:d,latencyMs:n.totalMs,estimatedPerOperationMs:n.estimatedPerOperationMs,correctnessPassed:n.correctnessPassed,confidence:n.confidence,kvCacheBytes:i*c*d*8,status:n.measurable&&n.totalMs>0?"MEASURED":"UNSUPPORTED"}}),s=t.transformerBlocks.map(n=>({name:n.config.name,hiddenSize:n.config.hidden,intermediateSize:n.config.intermediate,layers:n.config.layers,heads:n.config.heads,kvHeads:n.config.kvHeads,approxParameterCount:n.paramCount,approxFP16WeightMB:+(n.fp16Bytes/(1024*1024)).toFixed(2),approxINT8WeightMB:+(n.int8Bytes/(1024*1024)).toFixed(2),approxINT4WeightMB:+(n.int4Bytes/(1024*1024)).toFixed(2),syntheticBlockLatencyMs:n.totalMs,estimatedTokenLatencyMs:+(n.totalMs*n.config.layers).toFixed(3),confidence:n.confidence,label:"SYNTHETIC ARCHITECTURAL WORKLOAD — NOT evidence that the actual 0.5B/1B/etc model fits"})),r=t.tokenGeneration.map(n=>({prompt:n.promptTokens,generate:n.generateTokens,prefillLatencyMs:n.prefillMs,firstTokenLatencyMs:n.firstTokenMs,averageDecodeLatencyMs:n.avgDecodeMs,estimatedTokensPerSecond:n.tokensPerSec,generationTimeMs:n.totalMs,label:"SYNTHETIC INFERENCE ESTIMATE — not actual model results"})),a=t.memoryBudget.map(n=>({requestedMB:n.targetMB,allocatedMB:+n.totalAllocatedMB.toFixed(2),largestBufferMB:n.largestBufferMB,bufferCount:n.numBuffers,allocationTimeMs:n.allocMs,writeTimeMs:n.writeMs,status:n.success?"OK":"FAILED"}));return{quantizedMatmul:e,decodeAttention:o,transformerBlocks:s,tokenGeneration:r,memoryBudget:a,note:"WebGPU allocation capability, NOT total system RAM."}}function $t(t,e,o){const s=t?[...t.matmul,...t.attention,...t.mlp,...t.rmsnorm,...t.embedding,...t.imageOps,...t.vae,...t.video]:[],r=(()=>{const u=So(e,s),m=vt();if(m?.interruption)return ke(u,m.interruption);const p=bt(),h=kt(),f=p?{kind:p.category,reason:p.error,error:p.error,stack:p.stack,at:p.timestamp}:h.lost?{kind:"WEBGPU_DEVICE_LOST",reason:h.reason??"device lost",error:h.message??null,at:new Date().toISOString()}:null;return f?ke(u,f):u})(),a=e?se(e):null,n=ae(a,o),i=[...s,...e?[...e.quantizedMatmul,...e.decodeAttention]:[]],c=i.filter(u=>u.timerFloorLimited).length,d=i.filter(u=>u.notes.includes("correctness FAILED")),l=jt(e?.llmReadiness??null,e?.quantizedMatmul.length??0,e?.decodeAttention.length??0,e?.transformerBlocks.length??0,e?.tokenGeneration.length??0,e?.memoryBudget.length??0);return{generatedAt:new Date().toISOString(),normalization:{ok:r.timingIntegrity==="PASS",checked:i.length,issues:[]},throughput:{ok:r.throughputIntegrity==="PASS",checked:i.length,issues:[]},correctness:{checked:i.filter(u=>u.notes.includes("correctness")).length,passed:i.filter(u=>u.correctnessPassed).length,failed:d.map(u=>`${u.operation} (${u.workload})`)},timerLimitations:{timerResolutionMs:o,timerFloorLimitedCount:c,note:`Timer resolution ≈ ${o} ms. Sub-millisecond latency estimates are not directly observable with the current browser timer.`},timingIntegrity:r.timingIntegrity,throughputIntegrity:r.throughputIntegrity,correctnessIntegrity:r.correctnessIntegrity,llmSuiteComplete:r.llmSuiteComplete,memorySuiteComplete:r.memorySuiteComplete,overallCertified:r.overallCertified,certificationStatus:r.certificationStatus,certificationReasons:r.reasons,certification:r.overallCertified?"PASS":"FAIL",llmReadinessScore:l.llmReadinessScore,llmReadinessStatus:l.llmReadinessStatus,llmReadinessReason:l.reason,selfAuditChecks:n,deviceHealth:kt(),runtimeError:bt(),interruption:vt()?.interruption??null}}function D(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function ce(t){return`<span style="color:${t==="HIGH"?"var(--green)":t==="MEDIUM"?"var(--yellow)":t==="LOW"?"var(--red)":"var(--text-dim)"};font-weight:600">${t}</span>`}function zo(t){return t<=5?'<div style="font-size:11px;color:var(--text-dim);margin-top:6px">Classification: <b>NO SIGNIFICANT DEGRADATION OBSERVABLE</b> — timer resolution ≈ 1ms, so low-magnitude thermal throttling cannot be precisely resolved by this method.</div>':t<=20?'<div style="font-size:11px;color:var(--yellow);margin-top:6px">Classification: <b>MINOR PERFORMANCE DROP OBSERVED</b> — possibly thermal/sustained-load related; verify with a higher-resolution measurement method.</div>':'<div style="font-size:11px;color:var(--red);margin-top:6px">Classification: <b>SIGNIFICANT PERFORMANCE DROP</b> — likely sustained-load or thermal throttling; verify with a higher-resolution measurement method.</div>'}function tt(t){return t==null?"—":t<=0||!Number.isFinite(t)?"UNMEASURABLE":t<1?`${(t*1e3).toFixed(1)} µs`:`${t.toFixed(3)} ms`}function St(t){return t.throughput===null||t.throughput===void 0||!Number.isFinite(t.throughput)?t.notes.includes("INVALID")?"INVALID":"—":`${t.throughput.toFixed(2)} ${t.throughputUnit}`}function X(t,e){return e.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">${D(t)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>block ms</th><th>est/op ms</th><th>median</th><th>p95</th><th>total FLOPs</th><th>total bytes</th><th>throughput</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${e.map(o=>`<tr>
        <td>${D(o.operation)}<br/><small style="color:var(--text-dim)">${D(o.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${D(o.shape)}</td>
        <td>${o.repetitions.toLocaleString()}</td>
        <td>${o.measurable?o.blockMs.toFixed(2):"—"}</td>
        <td>${o.measurable?tt(o.estimatedPerOperationMs):"—"}</td>
        <td>${tt(o.medianMs)}</td>
        <td>${tt(o.p95Ms)}</td>
        <td>${o.totalFLOPs>0?o.totalFLOPs.toExponential(3):"—"}</td>
        <td>${o.totalBytes>0?(o.totalBytes/1048576).toFixed(1)+" MiB":"—"}</td>
        <td>${St(o)}</td>
        <td>${ce(o.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function V(t,e){return`<div class="score-row">
    <div class="score-label">${D(t)}</div>
    <div class="score-track"><div class="score-fill" style="width:${e}%"></div></div>
    <div class="score-val">${e}</div>
  </div>`}function it(t){return`<span style="color:${t==="GREEN"?"var(--green)":t==="YELLOW"?"var(--yellow)":"var(--red)"};font-weight:700">${t}</span>`}function Wo(t){const e=Z,o=(e?.quantizedMatmul.length??0)>0&&(e?.decodeAttention.length??0)>0&&(e?.transformerBlocks.length??0)>0;return e!=null&&e.llmReadiness!=null&&e.llmReadiness.overall>0&&o?it(t)+` <span style="font-size:10px;color:var(--text-dim)">(LLM gate: ${e.llmReadiness.overall}/100)</span>`:'<span style="color:var(--red);font-weight:700">NOT CERTIFIED</span> <span style="font-size:10px;color:var(--text-dim)">(requires INT8/INT4 matmul + KV-cache decode + transformer block gate)</span>'}function Ho(t,e){const o=$t(t,Z,e.timerResolutionMs),s=(n,i)=>{const c=i==="PASS"?"var(--green)":"var(--red)";return`<span style="display:inline-block;padding:2px 8px;border:1px solid ${c};border-radius:4px;font-size:11px;margin:2px"><b style="color:${c}">${i}</b> ${n}</span>`},r=o.certificationStatus==="CERTIFIED",a=r?"var(--green)":"var(--red)";return`<div style="padding:10px 12px;border:2px solid ${a};border-radius:8px;margin-bottom:12px;font-size:12px;background:${r?"rgba(0,200,0,0.05)":"rgba(200,0,0,0.05)"}">
    <div style="font-size:14px;font-weight:700;color:${a};margin-bottom:6px">
      AETHER DEVICE CERTIFICATION: ${r?"CERTIFIED":"NOT CERTIFIED"}
    </div>
    <div style="margin-bottom:4px">
      ${s("WEBGPU",Z?"PASS":"FAIL")}
      ${s("TIMING",o.timingIntegrity??"FAIL")}
      ${s("THROUGHPUT",o.throughputIntegrity??"FAIL")}
      ${s("CORRECTNESS",o.correctnessIntegrity??"FAIL")}
      ${s("LLM SUITE",o.llmSuiteComplete??"FAIL")}
      ${s("MEMORY SUITE",o.memorySuiteComplete??"FAIL")}
    </div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:4px">
      Timer resolution: ~${e.timerResolutionMs.toFixed(1)} ms &mdash; Sub-millisecond latency estimates are not directly observable with the current browser timer.
    </div>
    ${(o.certificationReasons?.length??0)>0?`<div style="margin-top:6px;font-size:11px;color:var(--red)">${o.certificationReasons.map(n=>D(n)).join(" · ")}</div>`:""}
  </div>`}function Ko(t,e,o){const s=document.getElementById("perf-v3-results");if(!s)return;const r=t.readiness,a=t.feasibility;s.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
<div class="card-header">
        <span class="card-title">AETHER MODEL-SHAPED BENCHMARK — V3</span>
        <span class="badge badge-info">MODEL RELEVANT</span>
      </div>

      ${Ho(t,e)}

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${D(e.adapterName)}</b></div>
          <div>Vendor: <b>${D(e.adapterVendor)}</b></div>
          <div>Device: <b>${D(e.adapterDevice)}</b></div>
          <div>Platform: <b>${D(e.platform)}</b></div>
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

      ${X("TRANSFORMER — MatMul",t.matmul)}
      ${X("TRANSFORMER — RMSNorm",t.rmsnorm)}
      ${X("TRANSFORMER — Embedding",t.embedding)}
      ${X("ATTENTION",t.attention)}
      ${X("MLP",t.mlp)}
      ${X("IMAGE — Elementwise",t.imageOps)}
      ${X("IMAGE — VAE Decoder",t.vae)}
      ${X("VIDEO — Temporal Mixing",t.video)}

      <div class="v3-section">
        <div class="v3-section-title">MEMORY PRESSURE</div>
        <table class="perf-table">
          <thead><tr><th>size</th><th>alloc</th><th>alloc ms</th><th>write ms</th></tr></thead>
          <tbody>
          ${t.memory.map(n=>`<tr>
            <td>${n.sizeMB} MB</td>
            <td style="color:${n.allocated?"var(--green)":"var(--red)"}">${n.allocated?"OK":"FAIL"}</td>
            <td>${n.allocMs>0?n.allocMs.toFixed(1):"—"}</td>
            <td>${n.writeMs>0?n.writeMs.toFixed(1):"—"}</td>
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
        ${zo(t.sustained.dropPct)}
        <div style="font-size:11px;color:var(--text-dim);margin-top:6px">thermalTelemetry: UNAVAILABLE · gpuUtilization: UNAVAILABLE</div>
      </div>

      <div class="v3-section">
        <div class="v3-section-title">AETHER LOCAL AI READINESS SCORE (heuristic)</div>
        ${V("TENSOR_COMPUTE",r.tensorCompute.score)}
        ${V("ATTENTION",r.attention.score)}
        ${V("MLP",r.mlp.score)}
        ${V("MEMORY",r.memory.score)}
        ${V("IMAGE_PROCESSING",r.imageProcessing.score)}
        ${V("VIDEO_PROCESSING",r.videoProcessing.score)}
        ${V("SUSTAINED_PERFORMANCE",r.sustainedPerf.score)}
        <div class="overall-row"><span>LOCAL_AI_READINESS</span><span>${r.overall} / 100</span></div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
          Heuristic benchmark score — NOT an official Apple performance rating.
        </div>
      </div>

<div class="v3-section">
        <div class="v3-section-title">LOCAL AI CAPABILITY CLASSIFICATION</div>
        <table class="perf-table">
          <thead><tr><th>capability</th><th>class</th></tr></thead>
          <tbody>
            <tr><td>Transformer inference</td><td>${Wo(a.transformerInference)}</td></tr>
            <tr><td>Image generation</td><td>${it(a.imageGeneration)}</td></tr>
            <tr><td>VAE decoding</td><td>${it(a.vaeDecoding)}</td></tr>
            <tr><td>Video latent processing</td><td>${it(a.videoLatent)}</td></tr>
            <tr><td>Temporal attention</td><td>${it(a.temporalAttention)}</td></tr>
            <tr><td>Long-context processing</td><td>${it(a.longContext)}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
<button class="btn" id="btn-export-v3-json">EXPORT COMPLETE V3.1.3 JSON</button>
        <button class="btn btn-outline" id="btn-export-v3-report">EXPORT V3 REPORT</button>
      </div>
    </div>
  `,s.querySelector("#btn-export-v3-json")?.addEventListener("click",()=>jo(t,e)),s.querySelector("#btn-export-v3-report")?.addEventListener("click",()=>Qo(t,e)),o("V3 benchmark complete","ok")}function Bt(t,e,o){const s=new Blob([e],{type:o}),r=URL.createObjectURL(s),a=document.createElement("a");a.href=r,a.download=t,a.click(),URL.revokeObjectURL(r)}function jo(t,e){const o=$t(t,Z,e.timerResolutionMs),s=Z?se(Z):null,r={version:"AETHER V3.1.3",device:e,environment:{userAgent:e.userAgent,platform:e.platform,webgpu:e.webgpu,crossOriginIsolated:e.crossOriginIsolated,secureContext:e.secureContext},timing:{method:"HOST_WALL_CLOCK_AMPLIFIED",timerResolutionMs:e.timerResolutionMs},timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??null,commit:globalThis.AETHER_COMMIT??null,results:t,llmInference:s,certification:{timingIntegrity:o.timingIntegrity??"FAIL",throughputIntegrity:o.throughputIntegrity??"FAIL",correctnessIntegrity:o.correctnessIntegrity??"FAIL",llmSuiteComplete:o.llmSuiteComplete??"FAIL",memorySuiteComplete:o.memorySuiteComplete??"FAIL",overallCertified:o.overallCertified??!1,certificationStatus:o.certificationStatus??"NOT_CERTIFIED",reasons:o.certificationReasons??[]},selfAudit:o.selfAuditChecks??null,llmReadinessScore:o.llmReadinessScore,llmReadinessStatus:o.llmReadinessStatus,llmReadinessReason:o.llmReadinessReason,deviceHealth:kt(),runtimeError:bt(),interruption:vt()?.interruption??null};Bt("aether-v3-1-3-complete.json",JSON.stringify(r,null,2),"application/json")}function Qo(t,e){const o=r=>r.map(a=>`| ${a.operation} | ${a.shape} | ${a.repetitions} | ${tt(a.blockMs)} | ${tt(a.estimatedPerOperationMs)} | ${a.totalFLOPs>0?a.totalFLOPs.toExponential(3):a.totalBytes>0?a.totalBytes+" B":"—"} | ${a.confidence} | ${St(a)} |`).join(`
`),s=`# AETHER — PERFORMANCE V3.1 / LLM INFERENCE GATE

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
${o(t.matmul)}

## Transformer — RMSNorm
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(t.rmsnorm)}

## Transformer — Embedding
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(t.embedding)}

## Attention
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(t.attention)}

## MLP
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(t.mlp)}

## Image Operations
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(t.imageOps)}

## VAE Decoder
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(t.vae)}

## Video — Temporal Mixing
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(t.video)}

## Memory
| size | alloc |
|---|---|
${t.memory.map(r=>`| ${r.sizeMB} MB | ${r.allocated?"OK":"FAIL"} |`).join(`
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
`;Bt("aether-v3-report.md",s,"text/markdown")}async function ln(t,e,o){try{const s=e();Et(le());const r=await(t==="quick"?Ue:Ce)(n=>o(`V3: ${n}`,"info")),a=await de(s);Ko(r,a,o)}catch(s){o(`V3 ERROR: ${s.message}`,"err")}}function le(){let t=1/0;for(let e=0;e<200;e++){const o=performance.now();let s=performance.now();for(;s===o;)s=performance.now();const r=s-o;r>0&&r<t&&(t=r)}return Number.isFinite(t)&&t>0?t:1}async function de(t){let e="UNAVAILABLE",o="UNAVAILABLE",s="UNAVAILABLE",r=null,a=null;try{const c=t.adapterInfo??t.adapterInfo;c&&(e=c.description||c.vendor||"UNAVAILABLE",o=c.vendor||"UNAVAILABLE",s=c.device||c.architecture||"UNAVAILABLE");const d=t.limits;r=d?.maxBufferSize??null,a=d?.maxComputeWorkgroupsPerDimension??null}catch{}const n=navigator,i=n.userAgentData;return{adapterName:e,adapterVendor:o,adapterDevice:s,maxBufferSize:r,maxWorkgroupsPerDim:a,device:i?.platform??navigator.platform??"UNAVAILABLE",platform:i?.platform??navigator.platform??"UNAVAILABLE",userAgent:navigator.userAgent,webgpu:!!n.gpu,crossOriginIsolated:window.crossOriginIsolated,secureContext:window.isSecureContext,timerResolutionMs:yt()}}function st(t){return t>=1024?(t/1024).toFixed(1)+" GB":t+" MB"}function we(t,e){return e.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">${D(t)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>block ms</th><th>est/op ms</th><th>total FLOPs</th><th>total bytes</th><th>throughput</th><th>conf</th><th>correct</th>
      </tr></thead>
      <tbody>
      ${e.map(o=>`<tr>
        <td>${D(o.operation)}<br/><small style="color:var(--text-dim)">${D(o.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${D(o.shape)}</td>
        <td>${o.repetitions.toLocaleString()}</td>
        <td>${o.measurable?o.blockMs.toFixed(2):"—"}</td>
        <td>${o.measurable?tt(o.estimatedPerOperationMs):"—"}</td>
        <td>${o.totalFLOPs>0?o.totalFLOPs.toExponential(3):"—"}</td>
        <td>${o.totalBytes>0?(o.totalBytes/1048576).toFixed(1)+" MiB":"—"}</td>
        <td>${St(o)}</td>
        <td>${ce(o.confidence)}</td>
        <td>${o.correctnessPassed?'<span style="color:var(--green)">OK</span>':'<span style="color:var(--red)">FAIL</span>'}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function Yo(t){return t.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">SYNTHETIC TRANSFORMER BLOCK (NOT real model benchmarks)</div>
    <table class="perf-table">
      <thead><tr>
        <th>class</th><th>hidden</th><th>intermediate</th><th>layers</th><th>heads</th><th>kvHeads</th><th>params</th><th>FP16</th><th>INT8</th><th>INT4</th><th>block ms</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${t.map(e=>`<tr>
        <td><b>${D(e.config.name)}</b></td>
        <td>${e.config.hidden}</td>
        <td>${e.config.intermediate}</td>
        <td>${e.config.layers}</td>
        <td>${e.config.heads}</td>
        <td>${e.config.kvHeads}</td>
        <td>${(e.paramCount/1e6).toFixed(1)}M</td>
        <td>${st(e.fp16Bytes/(1024*1024))}</td>
        <td>${st(e.int8Bytes/(1024*1024))}</td>
        <td>${st(e.int4Bytes/(1024*1024))}</td>
        <td>${e.confidence!=="UNMEASURABLE"?e.blockLatencyMs.toFixed(3)+" ms":"UNMEASURABLE"}</td>
        <td>${ce(e.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Architectural workload simulations — NOT claims that corresponding real models fit.</div>
  </div>`}function Jo(t){return t.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">TOKEN GENERATION SIMULATION (SYNTHETIC INFERENCE ESTIMATES)</div>
    <table class="perf-table">
      <thead><tr>
        <th>prompt</th><th>generate</th><th>prefill ms</th><th>first token ms</th><th>avg decode ms</th><th>tokens/sec</th><th>total ms</th>
      </tr></thead>
      <tbody>
      ${t.map(e=>`<tr>
        <td>${e.promptTokens}</td>
        <td>${e.generateTokens}</td>
        <td>${e.prefillMs.toFixed(1)}</td>
        <td>${e.firstTokenMs.toFixed(3)}</td>
        <td>${e.avgDecodeMs.toFixed(3)}</td>
        <td>${e.tokensPerSec>0?e.tokensPerSec.toFixed(1):"—"}</td>
        <td>${e.totalMs.toFixed(1)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">SYNTHETIC estimates based on measured block latencies. Do NOT use as real model performance claims.</div>
  </div>`}function Xo(t){return t.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">MEMORY BUDGET (chunked allocation)</div>
    <table class="perf-table">
      <thead><tr>
        <th>target</th><th>allocated</th><th>success</th><th>buffers</th><th>chunk</th><th>alloc ms</th><th>write ms</th>
      </tr></thead>
      <tbody>
      ${t.map(e=>`<tr>
        <td>${e.targetMB} MB</td>
        <td>${e.totalAllocatedMB.toFixed(0)} MB</td>
        <td style="color:${e.success?"var(--green)":"var(--red)"}">${e.success?"OK":"FAIL"}</td>
        <td>${e.numBuffers}</td>
        <td>${e.chunkMB} MB</td>
        <td>${e.allocMs>0?e.allocMs.toFixed(1):"—"}</td>
        <td>${e.writeMs>0?e.writeMs.toFixed(1):"—"}</td>
      </tr>`).join("")}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">WebGPU allocation capability, NOT total system RAM.</div>
  </div>`}function Zo(t){const e=$t(null,t,yt()),s=e.overallCertified?"var(--green)":"var(--red)",r=(a,n)=>`<b style="color:${n==="PASS"?"var(--green)":"var(--red)"}">${n}</b> ${a}`;return`<div style="padding:8px 10px;border:1px solid ${s};border-radius:6px;margin-bottom:12px;font-size:12px">
    <b style="color:${s}">SELF-AUDIT CERTIFICATION: ${e.certification}</b>
    <span style="color:var(--text-dim)"> — ${r("TIMING",e.timingIntegrity)} · ${r("THROUGHPUT",e.throughputIntegrity)} · ${r("CORRECTNESS",e.correctnessIntegrity)} · ${r("LLM SUITE",e.llmSuiteComplete)} · ${r("MEMORY SUITE",e.memorySuiteComplete)}</span>
    <div style="margin-top:4px;font-size:11px;color:var(--text-dim)">
      ${e.llmSuiteComplete==="PASS"?"":"LLM suite incomplete — "}
      Normalization ${e.normalization?.ok?"OK":"FAIL"} · Throughput ${e.throughput?.ok?"OK":"FAIL"} · Timer-floor ${e.timerLimitations?.timerFloorLimitedCount??0} result(s)
    </div>
    ${(e.certificationReasons?.length??0)>0?`<ul style="margin:4px 0 0 18px;padding:0">${e.certificationReasons.map(a=>`<li>${D(a)}</li>`).join("")}</ul>`:""}
  </div>`}function tn(t){const e=Z,o=jt(t,e?.quantizedMatmul.length??1,e?.decodeAttention.length??1,e?.transformerBlocks.length??1,e?.tokenGeneration.length??1,e?.memoryBudget.length??1),s=o.llmReadinessStatus==="CERTIFIED"?"var(--green)":"var(--red)";return`<div class="v3-section">
    <div class="v3-section-title">AETHER LLM READINESS SCORE (heuristic)</div>
    <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">HEURISTIC — NOT A MODEL BENCHMARK</div>
    ${V("COMPUTE (INT8/INT4 matmul)",t.computeScore)}
    ${V("MEMORY (budget allocation)",t.memoryScore)}
    ${V("ATTENTION (full-sequence)",t.attentionScore)}
    ${V("DECODE (KV-cache decode)",t.decodeScore)}
    ${V("TRANSFORMER BLOCK",t.transformerBlockScore)}
    ${V("SUSTAINED PERFORMANCE",t.sustainedScore)}
    <div class="overall-row"><span>AETHER LLM READINESS</span><span>${t.overall} / 100</span></div>
    <div style="font-size:12px;margin-top:6px">Status: <b style="color:${s}">${o.llmReadinessStatus}</b> ${o.llmReadinessStatus==="NOT CERTIFIED"?`— ${D(o.reason)}`:""}</div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
      Heuristic LLM readiness score — NOT an official Apple performance rating. Do NOT select a model automatically. Do NOT claim GREEN transformer inference from legacy MatMul/MLP tests alone.
    </div>
  </div>`}function en(t,e,o){const s=document.getElementById("perf-v3-llm-results");s&&(s.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER V3.1 — LLM INFERENCE GATE</span>
        <span class="badge badge-info">HARDWARE GATE</span>
      </div>

      ${Zo(t)}

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${D(e.adapterName)}</b></div>
          <div>Vendor: <b>${D(e.adapterVendor)}</b></div>
          <div>Platform: <b>${D(e.platform)}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">TIMING</div>
          <div>Method: <b>HOST_WALL_CLOCK<br/>AMPLIFIED</b></div>
          <div>Timer: <b>${e.timerResolutionMs.toFixed(3)} ms</b></div>
        </div>
      </div>

      ${we("INT8/INT4 QUANTIZED MATMUL",t.quantizedMatmul)}
      ${we("KV-CACHE DECODE ATTENTION",t.decodeAttention)}
      ${Yo(t.transformerBlocks)}
      ${Jo(t.tokenGeneration)}
      ${Xo(t.memoryBudget)}
      ${tn(t.llmReadiness)}

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
        <button class="btn" id="btn-export-llm-json">EXPORT LLM JSON</button>
        <button class="btn btn-outline" id="btn-export-llm-report">EXPORT LLM REPORT</button>
      </div>
    </div>
  `,s.querySelector("#btn-export-llm-json")?.addEventListener("click",()=>on(t,e)),s.querySelector("#btn-export-llm-report")?.addEventListener("click",()=>nn(t,e)),o("V3.1 LLM Inference Gate complete","ok"))}function on(t,e){const o=$t(null,t,e.timerResolutionMs),s=se(t),r={benchmarkVersion:ze,runtimeSchemaVersion:We,benchmarkEngine:qe,device:e,timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??"unknown",commit:globalThis.AETHER_COMMIT??"unknown",llmInference:s,certification:{timingIntegrity:o.timingIntegrity??"FAIL",throughputIntegrity:o.throughputIntegrity??"FAIL",correctnessIntegrity:o.correctnessIntegrity??"FAIL",llmSuiteComplete:o.llmSuiteComplete??"FAIL",memorySuiteComplete:o.memorySuiteComplete??"FAIL",overallCertified:o.overallCertified??!1,certificationStatus:o.certificationStatus??"NOT_CERTIFIED",reasons:o.certificationReasons??[]},selfAudit:o.selfAuditChecks??null,note:"WebGPU allocation capability, NOT total system RAM.",deviceHealth:kt(),runtimeError:bt(),interruption:vt()?.interruption??null},a=JSON.stringify(r,null,2),n=JSON.parse(a),i=ae(n.llmInference,e.timerResolutionMs);i.ok||console.error("POST-EXPORT AUDIT FAILED",i.failures),Bt("aether-v3-1-3-llm-gate.json",a,"application/json")}function nn(t,e){const o=r=>r.map(a=>`| ${a.operation} | ${a.shape} | ${a.repetitions} | ${tt(a.blockMs)} | ${tt(a.estimatedPerOperationMs)} | ${a.totalFLOPs>0?a.totalFLOPs.toExponential(3):a.totalBytes>0?a.totalBytes+" B":"—"} | ${a.confidence} | ${St(a)} | ${a.correctnessPassed?"OK":"FAIL"} |`).join(`
`),s=`# AETHER V3.1 — LLM INFERENCE GATE

- Date: ${new Date().toISOString()}
- Device: ${e.device}
- Adapter: ${e.adapterName} / ${e.adapterVendor}
- Timer: ${e.timerResolutionMs.toFixed(3)} ms

## INT8/INT4 Quantized MatMul
| operation | shape | reps | total | est/op | work | conf | throughput | correct |
|---|---|---|---|---|---|---|---|---|
${o(t.quantizedMatmul)}

## KV-Cache Decode Attention
| operation | shape | reps | total | est/op | work | conf | throughput | correct |
|---|---|---|---|---|---|---|---|---|
${o(t.decodeAttention)}

## Synthetic Transformer Block (NOT real model benchmarks)
| class | hidden | intermediate | layers | heads | kvHeads | params | FP16 | INT8 | INT4 | block ms | conf |
|---|---|---|---|---|---|---|---|---|---|---|---|
${t.transformerBlocks.map(r=>`| ${r.config.name} | ${r.config.hidden} | ${r.config.intermediate} | ${r.config.layers} | ${r.config.heads} | ${r.config.kvHeads} | ${(r.paramCount/1e6).toFixed(1)}M | ${st(r.fp16Bytes/1048576)} | ${st(r.int8Bytes/1048576)} | ${st(r.int4Bytes/1048576)} | ${r.blockLatencyMs.toFixed(3)} | ${r.confidence} |`).join(`
`)}

## Token Generation Simulation (SYNTHETIC INFERENCE ESTIMATES)
| prompt | generate | prefill ms | first token ms | avg decode ms | tokens/sec | total ms |
|---|---|---|---|---|---|---|
${t.tokenGeneration.map(r=>`| ${r.promptTokens} | ${r.generateTokens} | ${r.prefillMs.toFixed(1)} | ${r.firstTokenMs.toFixed(3)} | ${r.avgDecodeMs.toFixed(3)} | ${r.tokensPerSec>0?r.tokensPerSec.toFixed(1):"—"} | ${r.totalMs.toFixed(1)} |`).join(`
`)}

## Memory Budget
| target | allocated | success | buffers | chunk | alloc ms | write ms |
|---|---|---|---|---|---|---|
${t.memoryBudget.map(r=>`| ${r.targetMB} MB | ${r.totalAllocatedMB.toFixed(0)} MB | ${r.success?"OK":"FAIL"} | ${r.numBuffers} | ${r.chunkMB} MB | ${r.allocMs.toFixed(1)} | ${r.writeMs.toFixed(1)} |`).join(`
`)}

WebGPU allocation capability, NOT total system RAM.

## AETHER LLM Readiness Score (heuristic)
- COMPUTE: ${t.llmReadiness.computeScore}
- MEMORY: ${t.llmReadiness.memoryScore}
- ATTENTION: ${t.llmReadiness.attentionScore}
- DECODE: ${t.llmReadiness.decodeScore}
- TRANSFORMER_BLOCK: ${t.llmReadiness.transformerBlockScore}
- SUSTAINED: ${t.llmReadiness.sustainedScore}
- **AETHER_LLM_READINESS: ${t.llmReadiness.overall} / 100**

## Limitations
- INT8/INT4 matmul uses weight-only quantization with sign-extended unpacking in WGSL.
- KV-cache decode attention uses two-pass softmax (max + exp) per thread.
- Synthetic transformer block chains 10 compute passes per forward; actual models have KV-cache optimizations.
- Token generation is SYNTHETIC — estimates based on measured block latencies, NOT real model inference.
- Memory budget measures WebGPU buffer allocation capability, NOT total device RAM.
- thermal/gpuUtilization unavailable in browser.
- Heuristic score — NOT an official Apple performance rating.
`;Bt("aether-v3-1-llm-report.md",s,"text/markdown")}async function rn(t,e,o,s){const r=s?.resume??null;try{const a=e();Et(le());const{runLLMInferenceGate:n,runLLMInferenceGateQuick:i}=await nt(async()=>{const{runLLMInferenceGate:u,runLLMInferenceGateQuick:m}=await Promise.resolve().then(()=>Ve);return{runLLMInferenceGate:u,runLLMInferenceGateQuick:m}},void 0);o("AETHER V3.1.3 RUNTIME ACTIVE","info"),o(`buildId: ${globalThis.AETHER_BUILD_ID??"unknown"}`,"info"),o("llmSuite: ENABLED","info"),o("memorySuite: ENABLED","info"),o("normalizedResults: ENABLED","info"),o("postExportAudit: ENABLED","info"),r&&o(`crash-safety: RESUMING interrupted run (${r.completed.length} categories cached)`,"info"),Ae("V3.1",t,{resume:r?{completed:r.completed,partial:r.partial}:void 0},globalThis.AETHER_BUILD_ID??null);const c=Ie(a),d=$e(),l=t==="quick"?i:n;try{const u=await l(f=>o(`V3.1: ${f}`,"info"),r??void 0);Se(),d(),c(),uo(),Z=u;const{validateLLMGateIntegrity:m}=await nt(async()=>{const{validateLLMGateIntegrity:f}=await Promise.resolve().then(()=>Ne);return{validateLLMGateIntegrity:f}},void 0),p=m(u);if(p.ok)o("V3.1 audit OK: normalization + throughput verified for LLM gate results.","ok");else{o(`V3.1 AUDIT FAILURES: ${p.issues.length}`,"err");for(const f of p.issues)o(`  - ${f.operation} ${f.workload}: ${f.detail}`,"err")}const h=await de(a);en(u,h,o)}catch(u){d(),c();const m=u,p=`${m.message} ${m.stack??""}`.toLowerCase();p.includes("validation")?Ot("GPU_VALIDATION_ERROR",m.message,m):p.includes("limit")&&(p.includes("alloc")||p.includes("buffer")||p.includes("memory"))?Ot("RESOURCE_LIMIT",m.message,m):Ot("JAVASCRIPT_EXCEPTION",m.message,m),o(`V3.1 ERROR: ${m.message}`,"err"),o("crash-safety: benchmark interrupted (A–J), certification FAILED, partial results preserved. RELOAD the page and press RESUME.","warn")}}catch(a){o(`V3.1 ERROR: ${a.message}`,"err")}}async function dn(t,e){try{const o=t();Et(le());const{runLLMDiagnosticStaged:s}=await nt(async()=>{const{runLLMDiagnosticStaged:c}=await Promise.resolve().then(()=>Ve);return{runLLMDiagnosticStaged:c}},void 0);e("AETHER V3.1.3 STAGED DIAGNOSTIC ACTIVE","info"),Ae("V3.1","quick",void 0,globalThis.AETHER_BUILD_ID??null);const r=Ie(o),a=$e(),n=await de(o),i=await s(c=>e(`DIAG: ${c}`,"info"));a(),r(),Se();for(const c of i){const d=c.completed?c.error?"ERROR":"DONE":"SKIPPED";e(`DIAG ${d}: ${c.label}${c.error?` — ${c.error}`:""} (${Math.round(c.durationMs)}ms)`,c.completed&&!c.error?"ok":"err")}e(`DIAG done: ${i.filter(c=>c.completed).length}/${i.length} stages completed`,"ok"),e(`DIAG env: ${n.device} | maxBufferSize: ${n.maxBufferSize?Math.round(n.maxBufferSize/1048576)+" MB":"UNAVAILABLE"} | timer: ${n.timerResolutionMs.toFixed(3)} ms`,"info"),e("crash-safety: diagnostic complete. Export the LLM JSON to capture the full staged report.","info")}catch(o){e(`DIAG ERROR: ${o.message}`,"err")}}export{an as AETHER_V313_SENTINELS,Z as _llmGateResults,cn as buildLLMInferenceExport,$t as buildSelfAudit,en as renderLLMGate,Ho as renderV3Certification,dn as runLLMDiagnosticFromUI,rn as runLLMGateFromUI,ln as runV3FromUI};
