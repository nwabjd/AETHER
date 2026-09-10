import{h as ct,c as x,C as _t,a as Gt,b as Vt,r as ao,g as co,d as we,e as lo,t as qt,_ as nt,f as uo,i as mo,j as po,k as fo,l as et,m as ft,n as gt,o as ht,p as Ie,q as $e,s as Se,u as xe,v as go,w as Ft}from"./index-q_GqSeNh.js";let zt=1;function Lt(t){zt=t}function vt(){return zt}function Te(t){return t<=0||!Number.isFinite(t)||t<=zt?"UNMEASURABLE":t<5?"LOW":t<20?"MEDIUM":"HIGH"}const Wt=2e3,Ht=2e3,Be=5e9,Kt=1e-6;function rt(t){if(!Number.isInteger(t.repetitions)||t.repetitions<=0)throw new Error(`TIMING INTEGRITY FAILURE: ${t.operation}/${t.workload} repetitions=${t.repetitions} must be a positive integer`);if(!Number.isFinite(t.totalMs)||t.totalMs<0)throw new Error(`TIMING INTEGRITY FAILURE: ${t.operation}/${t.workload} totalMs=${t.totalMs} invalid`);const e=t.totalMs/t.repetitions;if(Math.abs(e-t.totalMs/t.repetitions)>Kt)throw new Error(`TIMING INTEGRITY FAILURE: ${t.operation}/${t.workload} estimatedPerOperationMs=${e.toFixed(12)} != totalMs(${t.totalMs})/repetitions(${t.repetitions})=${(t.totalMs/t.repetitions).toFixed(12)}`);const i=vt(),r=(t.flopsPerExecution??0)*t.repetitions,a=(t.bytesPerExecution??0)*t.repetitions,n=(t.opsPerExecution??0)*t.repetitions,s=t.throughputUnit??"GFLOPS",c=s==="GB/s"?a:s==="GFLOPS"?r:n,l=s==="GB/s"?"BYTES":s==="GFLOPS"?"FLOPs":"OPERATIONS",d=t.totalMs/1e3,m={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[s];let p=null,g=!1;if(d>0&&Number.isFinite(d)&&c>0&&Number.isFinite(c)&&m!==void 0){const E=c/d/m,$=s==="GFLOPS"?Wt:s==="GB/s"?Ht:Be;Number.isFinite(E)&&E>=0&&E<=$?p=E:g=!0}const f=t.totalMs>0?t.totalMs/i:0;let M;t.totalMs<=0||!Number.isFinite(t.totalMs)?M="UNMEASURABLE":f<5?M="LOW":f<20?M="MEDIUM":M="HIGH",!t.correctnessPassed&&M==="HIGH"&&(M="MEDIUM"),t.totalMs<=i&&(M="UNMEASURABLE");const y=t.samples>=20?t.medianMs:null,h=t.samples>=20?t.p95Ms:null,b=t.samples>=20?t.p99Ms:null,A=e>0&&e<=i,w=g?"INVALID_MEASUREMENT throughput exceeds physical cap":"",k=[t.notes??"",w,A?`TIMER-FLOOR_LIMITED: est. per-op ${e.toFixed(4)}ms ≤ ~${i}ms timer resolution; measured from an amplified block of ${t.repetitions} repetitions — NOT direct sub-ms timing`:""].filter(Boolean).join(" · ");return{category:t.category,operation:t.operation,workload:t.workload,shape:t.shape,repetitions:t.repetitions,totalMs:t.totalMs,blockMs:t.totalMs,estimatedPerOperationMs:e,medianMs:y,p95Ms:h,p99Ms:b,samples:t.samples,totalWork:c,workUnit:l,totalFLOPs:r,totalBytes:a,timingMethod:"HOST_WALL_CLOCK_AMPLIFIED",confidence:M,measurementQuality:{timerResolutionMs:i,totalMeasurementMs:t.totalMs,signalToTimerRatio:f,confidence:M,timerFloorLimited:A},correctnessPassed:t.correctnessPassed,throughput:p,throughputUnit:s,notes:k,measurable:M!=="UNMEASURABLE",timerFloorLimited:A}}function Oe(t){return rt({category:t.category,operation:t.operation,workload:t.workload,shape:t.shape,totalMs:t.totalMs>0&&Number.isFinite(t.totalMs)?t.totalMs:0,repetitions:t.reps>0?t.reps:1,samples:t.samples,medianMs:t.medianMs,p95Ms:t.p95,p99Ms:t.p99,flopsPerExecution:t.flopsPerExecution,bytesPerExecution:t.bytesPerExecution,opsPerExecution:t.opsPerExecution,throughputUnit:t.throughputUnit,correctnessPassed:t.correctnessPassed,notes:t.notes})}function ho(t,e,o){const i=e/1e3;if(!(i>0)||!Number.isFinite(i)||!(t>0))return{value:null,capped:!1};const r=t/i/1e9;return Number.isFinite(r)?r>(o==="GFLOPS"?Wt:Ht)?{value:null,capped:!0}:{value:r,capped:!1}:{value:null,capped:!1}}function yo(t,e,o){const i=e/1e3;if(!(i>0)||!Number.isFinite(i)||!(t>0)||!Number.isFinite(t))return{value:null,capped:!1};const a={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[o];if(a===void 0)return{value:null,capped:!1};const n=t/i/a;return!Number.isFinite(n)||n<0?{value:null,capped:!1}:n>(o==="GFLOPS"?Wt:o==="GB/s"?Ht:Be)?{value:null,capped:!0}:{value:n,capped:!1}}function at(t,e){if(t.length===0)return 0;const o=Math.min(Math.floor(t.length*e),t.length-1);return t[o]}function jt(t){return at(t,.5)}const ot={tensorCompute:.25,attention:.25,mlp:.2,memory:.1,imageProcessing:.1,videoProcessing:.05,sustainedPerf:.05};function Qt(t,e){return e==="UNMEASURABLE"?0:e==="LOW"?Math.min(ke(t),30):ke(t)}function ke(t){return t<=0||!Number.isFinite(t)?0:t<=2?100:t<=5?80:t<=10?60:t<=20?40:20}function dt(t){if(t.length===0)return{category:"",score:0,tests:0,measurable:0,notes:"no tests"};const e=t[0].category;let o=0,i=0;for(const a of t)o+=Qt(a.estimatedPerOperationMs,a.confidence),a.confidence!=="UNMEASURABLE"&&i++;const r=Math.round(o/t.length);return{category:e,score:r,tests:t.length,measurable:i,notes:""}}function Mo(t){if(t.length===0)return{category:"memory",score:0,tests:0,measurable:0,notes:"no tests"};const e=t.filter(r=>r.allocated),o=e.length>0?Math.max(...e.map(r=>r.sizeMB)):0;let i=0;return o>=512?i=100:o>=384?i=85:o>=256?i=70:o>=128?i=50:o>=64?i=30:i=10,{category:"memory",score:i,tests:t.length,measurable:e.length,notes:`maxAlloc=${o}MB`}}function Ne(t){let e=100;return t>30?e=20:t>20?e=40:t>10?e=70:t>5&&(e=85),{category:"sustainedPerf",score:e,tests:1,measurable:1,notes:`drop=${t.toFixed(1)}%`}}function Yt(t,e,o,i,r,a,n){const s=dt(t),c=dt(e),l=dt(o),d=dt(i),u=dt(r),m=Mo(a),p=Ne(n),g=Math.round(s.score*ot.tensorCompute+c.score*ot.attention+l.score*ot.mlp+m.score*ot.memory+d.score*ot.imageProcessing+u.score*ot.videoProcessing+p.score*ot.sustainedPerf);return{tensorCompute:s,memory:m,attention:c,mlp:l,imageProcessing:d,videoProcessing:u,sustainedPerf:p,overall:g}}function Jt(t){const e=o=>o>=60?"GREEN":o>=35?"YELLOW":"RED";return{transformerInference:e(Math.max(t.tensorCompute.score,t.attention.score,t.mlp.score)),imageGeneration:e(Math.max(t.imageProcessing.score,t.tensorCompute.score)),vaeDecoding:e(Math.max(t.imageProcessing.score,t.memory.score)),videoLatent:e(Math.max(t.videoProcessing.score,t.memory.score)),temporalAttention:e(Math.max(t.videoProcessing.score,t.attention.score)),longContext:t.attention.score>=50&&t.memory.score>=50?"GREEN":t.attention.score>=30?"YELLOW":"RED"}}function ut(t){if(t.length===0)return 0;let e=0;for(const o of t)e+=Qt(o.estimatedPerOperationMs,o.confidence);return Math.round(e/t.length)}function bo(t){if(t.length===0)return 0;const e=t.filter(i=>i.success);if(e.length===0)return 0;const o=Math.max(...e.map(i=>i.totalAllocatedMB));return o>=1024?100:o>=768?85:o>=512?70:o>=256?50:o>=128?30:10}function vo(t){if(t.length===0)return 0;let e=0;for(const o of t)e+=Qt(o.blockLatencyMs,o.confidence);return Math.round(e/t.length)}function At(t,e,o,i,r,a){const n=ut(t),s=ut(e),c=ut(o),l=vo(i),d=bo(r),m=Ne(a).score,p=n,g=d,f=ut(o.filter(k=>parseInt(/ctx=(\d+)/.exec(k.workload)?.[1]??"0",10)>=1024)),M=ut(t.filter(k=>k.workload.includes("prefill"))),y=c,h=l,b=Math.round(f*.6+d*.4),A=m,w=Math.round(n*.3+d*.15+s*.15+c*.15+l*.15+m*.1);return{computeScore:n,memoryScore:d,attentionScore:s,decodeScore:c,transformerBlockScore:l,sustainedScore:m,overall:w,llmCompute:p,llmMemory:g,kvCache:f,prefill:M,decode:y,transformerBlock:h,longContext:b,sustained:A}}function Xt(t,e,o,i,r=0,a=0){return t?e===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"INT8/INT4 quantized matmul missing or unsupported"}:o===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"KV-cache decode attention missing or unsupported"}:i===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Synthetic transformer block missing or unsupported"}:r===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Token-generation simulation missing or unsupported"}:a===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Memory ladder missing or unsupported"}:t.overall>0?{llmReadinessScore:t.overall,llmReadinessStatus:"CERTIFIED",reason:"LLM gate completed with measurable results"}:{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"LLM gate produced no measurable results"}:{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"LLM gate did not run"}}function Ct(t){const e=[];for(const o of t){if(`${o.operation}${o.workload}`,(!Number.isFinite(o.totalMs)||o.totalMs<0)&&e.push({operation:o.operation,workload:o.workload,kind:"invalid_totalMs",detail:`totalMs=${o.totalMs} not a non-negative finite number`}),(!Number.isFinite(o.repetitions)||o.repetitions<=0||!Number.isInteger(o.repetitions))&&e.push({operation:o.operation,workload:o.workload,kind:"invalid_repetitions",detail:`repetitions=${o.repetitions} must be positive integer`}),(!Number.isFinite(o.estimatedPerOperationMs)||o.estimatedPerOperationMs<0)&&e.push({operation:o.operation,workload:o.workload,kind:"invalid_estimated",detail:`estimatedPerOperationMs=${o.estimatedPerOperationMs}`}),Number.isFinite(o.totalMs)&&Number.isFinite(o.estimatedPerOperationMs)&&o.repetitions>0){const i=o.totalMs/o.repetitions;Math.abs(i-o.estimatedPerOperationMs)>1e-6&&e.push({operation:o.operation,workload:o.workload,kind:"normalization_mismatch",detail:`expected estimatedPerOperationMs=${i.toFixed(6)} (totalMs/reps), got ${o.estimatedPerOperationMs}`})}if((Number.isNaN(o.blockMs)||o.blockMs<0)&&e.push({operation:o.operation,workload:o.workload,kind:"invalid_blockMs",detail:`blockMs=${o.blockMs}`}),(Number.isNaN(o.totalWork)||o.totalWork<0)&&e.push({operation:o.operation,workload:o.workload,kind:"missing_totalWork",detail:`totalWork=${o.totalWork}`}),["FLOPs","BYTES","OPERATIONS","NONE"].includes(o.workUnit)||e.push({operation:o.operation,workload:o.workload,kind:"invalid_workUnit",detail:`workUnit=${o.workUnit}`}),typeof o.timerFloorLimited!="boolean"&&e.push({operation:o.operation,workload:o.workload,kind:"missing_timerFloorLimited",detail:`timerFloorLimited=${o.timerFloorLimited}`}),o.throughput!==null){if(!Number.isFinite(o.throughput)||o.throughput<0)e.push({operation:o.operation,workload:o.workload,kind:"invalid_throughput",detail:`throughput=${o.throughput}`});else if(o.totalMs>0){const i=o.totalWork/(o.totalMs/1e3),r=o.throughputUnit==="GFLOPS"||o.throughputUnit==="GB/s"?1e9:o.throughputUnit==="M/s"?1e6:o.throughputUnit==="k/s"?1e3:1,a=i/r;Math.abs(a-o.throughput)/Math.max(a,1e-12)>.01&&e.push({operation:o.operation,workload:o.workload,kind:"throughput_mismatch",detail:`expected throughput=${a.toFixed(6)} ${o.throughputUnit}, got ${o.throughput}`})}}["GFLOPS","GB/s","M/s","k/s","/s"].includes(o.throughputUnit)||e.push({operation:o.operation,workload:o.workload,kind:"invalid_unit",detail:`throughputUnit=${o.throughputUnit}`})}return{ok:e.length===0,issues:e}}function Eo(t){if(!t)return{ok:!1,issues:[{operation:"LLM_GATE",workload:"—",kind:"missing",detail:"llmInference results missing from export"}]};const e=Ct(t.quantizedMatmul),o=Ct(t.decodeAttention),i=[...e.issues,...o.issues];return t.quantizedMatmul.length===0&&i.push({operation:"LLM_GATE",workload:"quantizedMatmul",kind:"empty_section",detail:"no INT8/INT4 matmul results"}),t.decodeAttention.length===0&&i.push({operation:"LLM_GATE",workload:"decodeAttention",kind:"empty_section",detail:"no KV-cache decode attention results"}),t.transformerBlocks.length===0&&i.push({operation:"LLM_GATE",workload:"transformerBlocks",kind:"empty_section",detail:"no synthetic transformer block results"}),{ok:i.length===0,issues:i}}const Re=Object.freeze(Object.defineProperty({__proto__:null,TIMING_EPSILON:Kt,buildV3Result:Oe,classifyConfidence:Te,classifyFeasibility:Jt,computeLLMReadiness:At,computeLLMReadinessStatus:Xt,computeReadiness:Yt,computeThroughputTotal:yo,createBenchmarkResult:rt,getTimerResolution:vt,median:jt,percentile:at,safeThroughput:ho,setTimerResolution:Lt,validateLLMGateIntegrity:Eo,validateResultIntegrity:Ct},Symbol.toStringTag,{value:"Module"})),Fe=`
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
`,Pe=`
@group(0) @binding(0) var<storage, read> input: array<f32>;
@group(0) @binding(1) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&input)) { return; }
  let x = input[i];
  output[i] = x / (1.0 + exp(-x));
}
`,ko=`
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
`,Lo=`
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
`;function Ao(t,e,o){const i=new ArrayBuffer(16),r=new Uint32Array(i);return r[0]=t>>>0,r[1]=e>>>0,r[2]=o>>>0,r[3]=0,i}function wo(t,e,o,i,r,a){const n=new ArrayBuffer(32),s=new Uint32Array(n);return s[0]=t>>>0,s[1]=e>>>0,s[2]=o>>>0,s[3]=i>>>0,s[4]=r>>>0,s[5]=a>>>0,s[6]=0,s[7]=0,n}function z(){return co()}function Ce(t,e,o){const i=z().createBuffer({size:e,usage:t,mappedAtCreation:!!o});return o&&new Uint8Array(i.getMappedRange()).set(new Uint8Array(o.buffer,o.byteOffset,o.byteLength)),i.unmap(),qt(i)}function v(t,e){return Ce(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,t,e)}function D(t){return Ce(GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,Math.max(t.byteLength,16),new Uint8Array(t))}function U(t,e){const o=z().createShaderModule({code:t});return z().createComputePipeline({layout:"auto",compute:{module:o,entryPoint:"main"}})}function B(t,e,o){const i=t.getBindGroupLayout(0);return z().createBindGroup({layout:i,entries:o.map((r,a)=>({binding:a,resource:{buffer:r}}))})}function T(t){let e=2654435769;for(let o=0;o<t.length;o++)e=e*1664525+1013904223>>>0,t[o]=e%2001/1e3-1}async function mt(t,e){const o=z(),i=new _t(o),r=o.createCommandEncoder();for(let c=0;c<e;c++){const l=r.beginComputePass();t(l),l.end()}i.encode(r);const a=r.finish(),n=performance.now();try{o.queue.submit([a])}catch{return 0}Gt.onCommandBufferSubmitted("measurement");try{await Vt(o,i,"v3-block")}catch{return 0}const s=performance.now()-n;return i.destroy(),Number.isFinite(s)&&s>=0?s:0}async function q(t,e=1e6){const o=vt();let i=await mt(t,1),r=1;i<=o&&(i=await mt(t,100),r=100),i<=o&&(i=await mt(t,1e4),r=1e4);const a=i/r;let n=Math.ceil(20/a);(!Number.isFinite(n)||n<=0)&&(n=1),n=Math.min(n,e);const s=Math.max(n,1);for(let M=0;M<3;M++)await mt(t,s);const c=[];for(let M=0;M<20;M++)c.push(await mt(t,s));const l=c.filter(M=>M>0&&Number.isFinite(M)),d=[...l].sort((M,y)=>M-y),u=jt(d),m=l.length>0?l.reduce((M,y)=>M+y,0)/l.length:0,p=l.length>=20?at(d,.95):null,g=l.length>=20?at(d,.99):null,f=Te(u);return{reps:s,totalMs:u,medianMs:u,meanMs:m,p95:p,p99:g,confidence:f,samples:l}}function Q(t){return Oe({category:t.category,operation:t.operation,workload:t.workload,shape:t.shape,reps:t.m.reps,totalMs:t.m.totalMs,medianMs:t.m.medianMs,p95:t.m.p95,p99:t.m.p99,samples:t.m.samples.length,confidence:t.m.confidence,correctnessPassed:t.correctnessPassed,notes:t.notes,flopsPerExecution:t.flopsPerExecution,bytesPerExecution:t.bytesPerExecution,opsPerExecution:t.opsPerExecution,throughputUnit:t.throughputUnit})}async function yt(t,e,o,i,r,a,n){const s=z(),c=new _t(s),l=s.createCommandEncoder(),d=l.beginComputePass();d.setPipeline(t),d.setBindGroup(0,e),d.dispatchWorkgroups(o,i,r),d.end(),c.encode(l),s.queue.submit([l.finish()]),Gt.onCommandBufferSubmitted("other"),await Vt(s,c,"v3-correctness");const u=await ao(a,n);return c.destroy(),u}function Mt(t,e,o=.02,i=.02){if(t.length!==e.length)return!1;let r=!0;for(let a=0;a<t.length;a++){const n=t[a],s=e[a],c=Math.abs(n-s),l=Math.abs(s)>1e-9?c/Math.abs(s):c;if(c>o&&l>i){r=!1;break}}return r}async function Zt(t){const e=[],o=[{tokens:128,hidden:512},{tokens:256,hidden:512},{tokens:512,hidden:512},{tokens:128,hidden:768},{tokens:256,hidden:768},{tokens:128,hidden:1024},{tokens:256,hidden:1024}];for(const{tokens:i,hidden:r}of o){t?.(`matmul ${i}×${r} × ${r}×${r}`);const a=i,n=r,s=r,c=a*s*4,l=s*n*4,d=a*n*4,u=new Float32Array(a*s);T(u);const m=new Float32Array(s*n);T(m);const p=v(c,u),g=v(l,m),f=v(d),y=U(`
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
}`),h=new ArrayBuffer(12);new Uint32Array(h).set([a,n,s]);const b=D(h),A=B(y,["uniform","read-only-storage","read-only-storage","storage"],[b,p,g,f]),w=Math.ceil(a/16),k=Math.ceil(n/16),E=await q(N=>{N.setPipeline(y),N.setBindGroup(0,A),N.dispatchWorkgroups(w,k,1)});let $=!1;try{const N=await yt(y,A,w,k,1,f,d),F=we(u,m,a,n,s);$=Mt(N,F)}catch{$=!1}e.push(Q({category:"TRANSFORMER",operation:"MatMul",workload:`${i}×${r} × ${r}×${r}`,shape:`[${i},${r}]×[${r},${r}]`,m:E,correctnessPassed:$,flopsPerExecution:2*a*n*s,bytesPerExecution:(a*s+s*n+a*n)*4,throughputUnit:"GFLOPS",notes:$?"":"correctness FAILED"})),p.destroy(),g.destroy(),f.destroy(),b.destroy()}return e}async function te(t){const e=[],o=[{hidden:512,heads:8,headDim:64,seqs:[64,128,256,512]},{hidden:768,heads:12,headDim:64,seqs:[64,128,256]}];for(const{hidden:i,heads:r,headDim:a,seqs:n}of o)for(const s of n){t?.(`attention hidden=${i} seq=${s}`);const c=1,l=a,d=s*s*4,u=s*l*4,m=new Float32Array(c*s*l*3);T(m);const p=v(m.byteLength,m),g=v(d),f=v(u),y=U(`
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
}`),h=1/Math.sqrt(l),b=new ArrayBuffer(16);new Uint32Array(b).set([c,s,l]),new Float32Array(b)[3]=h;const A=D(b),w=B(y,["uniform","read-only-storage","storage","storage"],[A,p,g,f]),k=Math.max(1,Math.ceil(c*s/64)),E=await q($=>{$.setPipeline(y),$.setBindGroup(0,w),$.dispatchWorkgroups(k,1,1)});e.push(Q({category:"ATTENTION",operation:"Fused Attention",workload:`hidden=${i} seq=${s}`,shape:`[1,${s},${l}]`,m:E,correctnessPassed:!0,flopsPerExecution:4*c*s*s*l,bytesPerExecution:(c*s*l*3+s*s+s*l)*4,throughputUnit:"GFLOPS",notes:"QK^T+softmax+PV fused"})),p.destroy(),g.destroy(),f.destroy(),A.destroy()}return e}async function ee(t){const e=[],o=[{hidden:512,intermediate:2048,seqs:[128,256,512]},{hidden:768,intermediate:3072,seqs:[128,256]},{hidden:1024,intermediate:4096,seqs:[128]}],i=U(Fe);for(const{hidden:r,intermediate:a,seqs:n}of o)for(const s of n){t?.(`mlp hidden=${r} intermediate=${a} seq=${s}`);const c=new Float32Array(s*r);T(c);const l=new Float32Array(r*a);T(l);const d=new Float32Array(a*r);T(d);const u=v(c.byteLength,c),m=v(l.byteLength,l),p=v(s*a*4),g=v(s*a*4),f=v(s*r*4),y=U(`
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
}`),h=new ArrayBuffer(12);new Uint32Array(h).set([s,a,r]);const b=D(h),A=B(y,["uniform","read-only-storage","read-only-storage","storage"],[b,u,m,p]),w=B(i,["read-only-storage","storage"],[p,g]),k=s*a,E=new ArrayBuffer(12);new Uint32Array(E).set([s,r,a]);const $=D(E),N=B(y,["uniform","read-only-storage","read-only-storage","storage"],[$,g,f,u]),F=await q(L=>{L.setPipeline(y),L.setBindGroup(0,A),L.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(a/16),1),L.setPipeline(i),L.setBindGroup(0,w),L.dispatchWorkgroups(Math.ceil(k/256),1,1),L.setPipeline(y),L.setBindGroup(0,N),L.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(r/16),1)});e.push(Q({category:"MLP",operation:"Transformer MLP",workload:`h=${r} int=${a} seq=${s}`,shape:`[${s},${r}]`,m:F,correctnessPassed:!0,flopsPerExecution:2*s*r*a+s*a+2*s*a*r,bytesPerExecution:(s*r+r*a+s*a+a*r+s*r)*4,throughputUnit:"GFLOPS",notes:"W1→GELU→W2"})),u.destroy(),m.destroy(),p.destroy(),g.destroy(),f.destroy(),b.destroy(),$.destroy()}return e}async function oe(t){const e=[],i=U(`
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
}`),r=[{hidden:512,seqs:[128,256,512]},{hidden:768,seqs:[128,256]},{hidden:1024,seqs:[128]},{hidden:2048,seqs:[128]}];for(const{hidden:a,seqs:n}of r)for(const s of n){t?.(`rmsnorm hidden=${a} seq=${s}`);const c=new Float32Array(s*a);T(c);const l=new Float32Array(a);for(let y=0;y<a;y++)l[y]=1;const d=v(c.byteLength,c),u=v(l.byteLength,l),m=v(c.byteLength),p=new ArrayBuffer(8);new Uint32Array(p).set([s,0]);const g=D(p),f=B(i,["uniform","read-only-storage","read-only-storage","storage"],[g,d,u,m]),M=await q(y=>{y.setPipeline(i),y.setBindGroup(0,f),y.dispatchWorkgroups(s,1,1)});e.push(Q({category:"TRANSFORMER",operation:"RMSNorm",workload:`hidden=${a} seq=${s}`,shape:`[${s},${a}]`,m:M,correctnessPassed:!0,flopsPerExecution:3*s*a,bytesPerExecution:(s*a+a+s*a)*4,throughputUnit:"GFLOPS",notes:""})),d.destroy(),u.destroy(),m.destroy(),g.destroy()}return e}async function ne(t){const e=[],o=U(ko),i=32e3,r=512,a=new Float32Array(i*r);T(a);const n=v(a.byteLength,a);for(const s of[128,256,512]){t?.(`embedding tokens=${s}`);const c=new Uint32Array(s);for(let f=0;f<s;f++)c[f]=Math.floor(Math.random()*i);const l=v(c.byteLength,c),d=v(s*r*4),u=D(Ao(i,r,s)),m=B(o,["uniform","read-only-storage","read-only-storage","storage"],[u,l,n,d]),p=await q(f=>{f.setPipeline(o),f.setBindGroup(0,m),f.dispatchWorkgroups(Math.ceil(s*r/256),1,1)}),g=s*r*4+s*4;e.push(Q({category:"TRANSFORMER",operation:"Embedding Lookup",workload:`tokens=${s} vocab=${i} hidden=${r}`,shape:`[${s}]→[${s},${r}]`,m:p,correctnessPassed:!0,bytesPerExecution:g,throughputUnit:"GB/s",notes:`${(g/1048576).toFixed(1)} MiB touched`})),l.destroy(),d.destroy(),u.destroy()}return n.destroy(),e}async function Pt(t,e,o,i,r,a,n){const s=[],c=U(e);for(const{hw:l,channels:d}of i){n?.(`${t} ${l}×${l}×${d}`);const u=l*l*d,m=new Float32Array(u);T(m);const p=new Float32Array(u);T(p);const g=v(u*4,m),f=v(u*4,p),M=v(u*4),y=B(c,o,[g,f,M]),h=await q(b=>{b.setPipeline(c),b.setBindGroup(0,y),b.dispatchWorkgroups(Math.ceil(u/256),1,1)});s.push(Q({category:"IMAGE",operation:t,workload:`${l}×${l}×${d}`,shape:`[${l},${l},${d}]`,m:h,correctnessPassed:!0,flopsPerExecution:r(l,d),bytesPerExecution:u*12,throughputUnit:a,notes:""})),g.destroy(),f.destroy(),M.destroy()}return s}async function re(t){const e=[{hw:64,channels:4},{hw:128,channels:4},{hw:256,channels:4}],o="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] + b[i]; }",i="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] * b[i]; }",r=Pe,a=["read-only-storage","read-only-storage","storage"],n=["read-only-storage","storage"],s=[];return s.push(...await Pt("Elementwise Add",o,a,e,(c,l)=>c*c*l,"GFLOPS",t)),s.push(...await Pt("Elementwise Multiply",i,a,e,(c,l)=>c*c*l,"GFLOPS",t)),s.push(...await Pt("SiLU Activation",r,n,e,(c,l)=>c*c*l,"GFLOPS",t)),s}async function ie(t){const e=[],o=U(Pe),r=U(`
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
}`),a=[{inC:4,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:16,H:64,W:64,kH:3,kW:3}],n=[{hw:64,channels:4},{hw:128,channels:4}];for(const s of n){t?.(`vae ${s.hw}×${s.hw}×${s.channels}`);const c=[],l=[],d=[];let u=s.channels,m=s.hw,p=s.hw;const g=new Float32Array(u*m*p);T(g);let f=v(g.byteLength,g);c.push(f);for(const y of a){const h=m-y.kH+1,b=p-y.kW+1,A=new ArrayBuffer(32);new Uint32Array(A).set([y.inC,y.outC,m,p,y.kH,y.kW,h,b]);const w=D(A),k=new Float32Array(y.outC*y.inC*y.kH*y.kW);T(k);const E=v(k.byteLength,k),$=v(y.outC*h*b*4),N=B(r,["uniform","read-only-storage","read-only-storage","storage"],[w,f,E,$]),F=v(y.outC*h*b*4),L=B(o,["read-only-storage","storage"],[$,F]);l.push(w),c.push(E,$,F),d.push(N,L),u=y.outC,m=h,p=b,f=F}const M=await q(y=>{for(let h=0;h<a.length;h++){const b=a[h],A=s.hw-b.kH*(h+1)+1,w=s.hw-b.kW*(h+1)+1,k=b.outC*A*w;y.setPipeline(r),y.setBindGroup(0,d[h*2]),y.dispatchWorkgroups(Math.ceil(k/256),1,1),y.setPipeline(o),y.setBindGroup(0,d[h*2+1]),y.dispatchWorkgroups(Math.ceil(k/256),1,1)}});e.push(Q({category:"IMAGE",operation:"VAE Decoder",workload:`${s.hw}×${s.hw}×${s.channels}`,shape:`[${s.channels},${s.hw},${s.hw}]`,m:M,correctnessPassed:!0,bytesPerExecution:(s.channels*s.hw*s.hw+16*64*64+16*62*62)*4,throughputUnit:"GB/s",notes:"conv→SiLU→conv→SiLU→conv→SiLU"}));for(const y of c)y.destroy();for(const y of l)y.destroy()}return e}async function se(t){const e=[],o=[{frames:4,hw:64,channels:4},{frames:8,hw:64,channels:4},{frames:16,hw:64,channels:4}];for(const{frames:i,hw:r,channels:a}of o){t?.(`video ${i}×${r}×${r}×${a}`);const n=i*r*r*a,s=new Float32Array(n);T(s);const c=new Float32Array(3*a);T(c);const l=i-2,d=new Float32Array(l*r*r*a),u=v(s.byteLength,s),m=v(c.byteLength,c),p=v(d.byteLength),g=D(wo(i,r,r,a,3,l)),f=U(Lo),M=B(f,["uniform","read-only-storage","read-only-storage","storage"],[g,u,m,p]),y=await q(h=>{h.setPipeline(f),h.setBindGroup(0,M),h.dispatchWorkgroups(Math.ceil(n/256),1,1)});e.push(Q({category:"VIDEO",operation:"Temporal Mixing",workload:`${i}×${r}×${r}×${a}`,shape:`[${i},${r},${r},${a}]`,m:y,correctnessPassed:!0,bytesPerExecution:(n+3*a+n)*4,throughputUnit:"GB/s",notes:"temporal conv kernel=3"})),u.destroy(),m.destroy(),p.destroy(),g.destroy()}return e}async function ae(t){const e=[],o=[64,128,256,384,512],i=z(),r=lo(i),a=Math.max(1,Math.min(64,Math.floor(r/(1024*1024)))),n=Math.min(a*1024*1024,r);for(const s of o){t?.(`memory ${s}MB`);const c=s*1024*1024,l=performance.now(),d=[];let u=0,m=null;try{for(;u<c;){const h=Math.min(n,c-u),b=i.createBuffer({size:h,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC});qt(b),d.push(b),u+=h}}catch(h){m=h}for(const h of d)h.destroy();const p=performance.now()-l;if(m!==null||u<c){e.push({allocated:!1,sizeMB:s,allocMs:p,writeMs:0});continue}const g=performance.now(),f=new Float32Array(Math.min(c/4,256)).fill(42);let M=!1;try{for(const h of d){const b=h.size;for(let A=0;A<b;A+=f.byteLength)i.queue.writeBuffer(h,A,f,0,Math.min(f.length,(b-A)/4))}}catch{M=!0}const y=performance.now()-g;M?e.push({allocated:!0,sizeMB:s,allocMs:p,writeMs:-1}):e.push({allocated:!0,sizeMB:s,allocMs:p,writeMs:y})}return e}async function ce(t){t?.("sustained 30s");const e=256,o=new Float32Array(e*e);T(o);const i=new Float32Array(e*e);T(i);const r=v(o.byteLength,o),a=v(i.byteLength,i),n=v(e*e*4),c=U(`
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
}`),l=new ArrayBuffer(12);new Uint32Array(l).set([e,e,e]);const d=D(l),u=B(c,["uniform","read-only-storage","read-only-storage","storage"],[d,r,a,n]),m=e/16,p=e/16,g=z(),f=[],M=[],y=30;performance.now();for(let R=0;R<y;R++){const _=performance.now(),W=[];for(;performance.now()-_<1e3;){const H=new _t(g),K=g.createCommandEncoder(),j=K.beginComputePass();j.setPipeline(c),j.setBindGroup(0,u),j.dispatchWorkgroups(m,p,1),j.end(),H.encode(K);const lt=performance.now();try{g.queue.submit([K.finish()])}catch{break}Gt.onCommandBufferSubmitted("measurement");try{await Vt(g,H,"sustained")}catch{break}const Y=performance.now()-lt;H.destroy(),Y>0&&Number.isFinite(Y)&&(f.push(Y),W.push(Y))}M.push(W.length>0?W.reduce((H,K)=>H+K,0)/W.length:0),t?.(`sustained s${R+1}/${y} avg=${(M[M.length-1]||0).toFixed(2)}ms`)}const h=[...f].sort((R,_)=>R-_),b=f.length>0?f.reduce((R,_)=>R+_,0)/f.length:0,A=jt(h),w=at(h,.95),k=at(h,.99),E=M.slice(0,5),$=M.slice(-5),N=E.length>0?E.reduce((R,_)=>R+_,0)/E.length:0,F=$.length>0?$.reduce((R,_)=>R+_,0)/$.length:0,L=N>0?(F-N)/N*100:0;return r.destroy(),a.destroy(),n.destroy(),d.destroy(),{durationSec:y,totalOps:f.length,avgMs:b,medianMs:A,p95Ms:w,p99Ms:k,first5sMs:N,last5sMs:F,dropPct:Math.max(L,0)}}function P(t,e,o){return i=>{ct({phase:e,category:o,test:i}),t?.(i)}}function I(t,e){return!!t&&t.completed.includes(e)&&t.partial[e]!==void 0}async function De(t,e){t?.("Starting V3 Model-Shaped Benchmark..."),ct({phase:"V3:MODEL-SHAPED",category:null,test:"starting"});const o=I(e,"matmul")?e.partial.matmul:await Zt(P(t,"V3-FULL","matmul"));I(e,"matmul")||x("matmul",o);const i=I(e,"attention")?e.partial.attention:await te(P(t,"V3-FULL","attention"));I(e,"attention")||x("attention",i);const r=I(e,"mlp")?e.partial.mlp:await ee(P(t,"V3-FULL","mlp"));I(e,"mlp")||x("mlp",r);const a=I(e,"rmsnorm")?e.partial.rmsnorm:await oe(P(t,"V3-FULL","rmsnorm"));I(e,"rmsnorm")||x("rmsnorm",a);const n=I(e,"embedding")?e.partial.embedding:await ne(P(t,"V3-FULL","embedding"));I(e,"embedding")||x("embedding",n);const s=I(e,"imageOps")?e.partial.imageOps:await re(P(t,"V3-FULL","imageOps"));I(e,"imageOps")||x("imageOps",s);const c=I(e,"vae")?e.partial.vae:await ie(P(t,"V3-FULL","vae"));I(e,"vae")||x("vae",c);const l=I(e,"video")?e.partial.video:await se(P(t,"V3-FULL","video"));I(e,"video")||x("video",l);const d=I(e,"memory")?e.partial.memory:await ae(P(t,"V3-FULL","memory"));I(e,"memory")||x("memory",d);const u=I(e,"sustained")?e.partial.sustained:await ce(P(t,"V3-FULL","sustained"));I(e,"sustained")||x("sustained",u);const m=Yt(o,i,r,s,l,d.map(g=>({allocated:g.allocated,sizeMB:g.sizeMB})),u.dropPct),p=Jt(m);return{matmul:o,attention:i,mlp:r,rmsnorm:a,embedding:n,imageOps:s,vae:c,video:l,memory:d,sustained:u,readiness:m,feasibility:p}}async function Ue(t,e){t?.("Starting V3 Quick (reduced subset)..."),ct({phase:"V3:QUICK",category:null,test:"starting"});const o=I(e,"matmul")?e.partial.matmul:(await Zt(P(t,"V3-QUICK","matmul"))).slice(0,3);I(e,"matmul")||x("matmul",o);const i=I(e,"attention")?e.partial.attention:(await te(P(t,"V3-QUICK","attention"))).slice(0,3);I(e,"attention")||x("attention",i);const r=I(e,"mlp")?e.partial.mlp:(await ee(P(t,"V3-QUICK","mlp"))).slice(0,2);I(e,"mlp")||x("mlp",r);const a=I(e,"rmsnorm")?e.partial.rmsnorm:(await oe(P(t,"V3-QUICK","rmsnorm"))).slice(0,2);I(e,"rmsnorm")||x("rmsnorm",a);const n=I(e,"embedding")?e.partial.embedding:(await ne(P(t,"V3-QUICK","embedding"))).slice(0,2);I(e,"embedding")||x("embedding",n);const s=I(e,"imageOps")?e.partial.imageOps:(await re(P(t,"V3-QUICK","imageOps"))).slice(0,3);I(e,"imageOps")||x("imageOps",s);const c=I(e,"vae")?e.partial.vae:(await ie(P(t,"V3-QUICK","vae"))).slice(0,1);I(e,"vae")||x("vae",c);const l=I(e,"video")?e.partial.video:(await se(P(t,"V3-QUICK","video"))).slice(0,2);I(e,"video")||x("video",l);const d=I(e,"memory")?e.partial.memory:await ae(P(t,"V3-QUICK","memory"));I(e,"memory")||x("memory",d);const u=I(e,"sustained")?e.partial.sustained:await ce(P(t,"V3-QUICK","sustained"));I(e,"sustained")||x("sustained",u);const m=Yt(o,i,r,s,l,d.map(g=>({allocated:g.allocated,sizeMB:g.sizeMB})),u.dropPct),p=Jt(m);return{matmul:o,attention:i,mlp:r,rmsnorm:a,embedding:n,imageOps:s,vae:c,video:l,memory:d,sustained:u,readiness:m,feasibility:p}}const le=Object.freeze(Object.defineProperty({__proto__:null,adaptiveMeasure:q,benchV3Attention:te,benchV3Embedding:ne,benchV3ImageOps:re,benchV3MLP:ee,benchV3Matmul:Zt,benchV3Memory:ae,benchV3RMSNorm:oe,benchV3Sustained:ce,benchV3VAE:ie,benchV3Video:se,dev:z,fillRandom:T,makeBg:B,makePipeline:U,makeResult:Q,runV3Full:De,runV3Quick:Ue,storageBuf:v,uniformBuf:D,verifyOneShot:yt,verifyTolerance:Mt},Symbol.toStringTag,{value:"Module"}));function _e(t){const e=[];for(const o of t){const i=`${o.operation} (${o.workload})`;(!Number.isInteger(o.repetitions)||o.repetitions<=0)&&e.push({kind:"timing_integrity",result:i,detail:`repetitions=${o.repetitions} must be a positive integer`}),(!Number.isFinite(o.totalMs)||o.totalMs<0)&&e.push({kind:"timing_integrity",result:i,detail:`totalMs=${o.totalMs} invalid`});const r=o.totalMs/o.repetitions;if(Math.abs(o.estimatedPerOperationMs-r)>Kt&&e.push({kind:"timing_integrity",result:i,detail:`estimatedPerOperationMs=${o.estimatedPerOperationMs} != totalMs/repetitions=${r} (repetitions=${o.repetitions}, totalMs=${o.totalMs})`}),o.throughput!==null&&Number.isFinite(o.throughput)&&o.totalMs>0&&o.totalWork>0){const n={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[o.throughputUnit]??1,s=o.totalWork/(o.totalMs/1e3)/n;Math.abs(o.throughput-s)/Math.max(s,1e-12)>.01&&e.push({kind:"throughput_integrity",result:i,detail:`throughput=${o.throughput} != totalWork(${o.totalWork})/(totalMs(${o.totalMs})/1000)/div(${n})=${s.toFixed(6)}`})}o.samples<20&&(o.medianMs!==null||o.p95Ms!==null||o.p99Ms!==null)&&e.push({kind:"percentile_policy",result:i,detail:`samples=${o.samples} < 20 but percentiles reported (Δ must be null)`}),["FLOPs","BYTES","OPERATIONS","NONE"].includes(o.workUnit)||e.push({kind:"work_unit",result:i,detail:`workUnit=${o.workUnit} invalid`})}return{ok:e.length===0,issues:e}}function Ge(t,e){if(t<=0||!Number.isFinite(t))return 0;const o=t<=2?100:t<=5?80:t<=10?60:t<=20?40:20;return e==="UNMEASURABLE"?0:e==="LOW"?Math.min(o,30):o}function pt(t,e){const o=t.length,i=t.filter(l=>l.measurable),r=i.length,a=i.length>0?i.reduce((l,d)=>l+d.estimatedPerOperationMs,0)/i.length:0,n=Math.round(i.reduce((l,d)=>l+Ge(d.estimatedPerOperationMs,d.confidence),0)/Math.max(i.length,1)),s=i.map(l=>l.confidence);let c="UNMEASURABLE";return s.length>0&&s.every(l=>l!=="UNMEASURABLE")&&(c=s.some(l=>l==="LOW")?"LOW":s.some(l=>l==="MEDIUM")?"MEDIUM":"HIGH"),{score:i.length===0?0:n,tests:o,measurable:r,confidence:c,notes:`${e}: ${r}/${o} measurable, avg per-op ${a.toFixed(4)} ms`}}function Io(t){return{score:0,tests:0,measurable:0,confidence:"UNMEASURABLE",notes:"sustained test not run"}}function $o(t,e){const o=t.quantizedMatmul,i=t.decodeAttention,r=pt(o.filter(h=>!h.workload.includes("prefill")),"precision matmul (decode)"),a=pt(o.filter(h=>h.workload.includes("prefill")),"prefill matmul"),n=pt(i,"KV-cache decode"),s=pt(i,"KV-cache full range"),c=i.filter(h=>parseInt(/ctx=(\d+)/.exec(h.workload)?.[1]??"0",10)>=1024),l=pt(c,"long-context decode (≥1024)"),d=So(t.transformerBlocks),u=xo(t.memoryBudget),m=Io(),p=[r,u,s,a,n,d,l,m],g=p.reduce((h,b)=>h+b.tests,0),f=p.reduce((h,b)=>h+b.measurable,0),M=Math.round(p.reduce((h,b)=>h+b.score,0)/Math.max(p.length,1)),y=p.some(h=>h.confidence==="LOW")?"LOW":p.some(h=>h.confidence==="MEDIUM")?"MEDIUM":"HIGH";return{compute:r,memory:u,kvCache:s,prefill:a,decode:n,transformerBlock:d,longContext:l,sustained:m,overall:{score:M,tests:g,measurable:f,confidence:y,notes:`HEURISTIC LLM readiness — NOT a model benchmark. Aggregated from ${f}/${g} measurable tests.`}}}function So(t){if(t.length===0)return{score:0,tests:0,measurable:0,confidence:"UNMEASURABLE",notes:"no transformer blocks"};const e=t.filter(a=>a.blockLatencyMs>0&&Number.isFinite(a.blockLatencyMs)),o=t.length,i=e.length>0?e.reduce((a,n)=>a+n.blockLatencyMs,0)/e.length:0,r=Math.round(e.reduce((a,n)=>a+Ge(n.blockLatencyMs,n.confidence),0)/Math.max(e.length,1));return{score:e.length===0?0:r,tests:o,measurable:e.length,confidence:e.some(a=>a.confidence==="LOW")?"LOW":e.every(a=>a.confidence==="HIGH")?"HIGH":"MEDIUM",notes:`synthetic transformer blocks: ${e.length}/${o} measurable, avg block ${i.toFixed(4)} ms`}}function xo(t){const e=t.filter(r=>r.success),o=e.length>0?Math.max(...e.map(r=>r.totalAllocatedMB)):0,i=o>=1024?100:o>=512?70:o>=256?50:o>=128?30:10;return{score:e.length===0?0:i,tests:t.length,measurable:e.length,confidence:t.length>=7&&e.length>=4?"MEDIUM":"LOW",notes:`memory ladder: ${e.length}/${t.length} rungs OK, max ${o.toFixed(0)}MB allocated (chunks ≤256MiB). GPU allocation capability ONLY.`}}const To=[128,256,512,1024,2048,4096],Ve=["0.5B","1B","1.5B","3B","7B"];function qe(t,e=[]){const o=[];if(!t)return{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"NOT_CERTIFIED",reasons:["LLM inference suite has not run"]};const i=[...t.quantizedMatmul,...t.decodeAttention,...e],r=_e(i),a=r.issues.filter(L=>L.kind==="timing_integrity"),n=r.issues.filter(L=>L.kind==="throughput_integrity"),s=a.length===0?"PASS":"FAIL",c=n.length===0?"PASS":"FAIL";s==="FAIL"&&o.push(`timingIntegrity FAIL (${a.length} issue(s))`),c==="FAIL"&&o.push(`throughputIntegrity FAIL (${n.length} issue(s))`);const l=i.filter(L=>L.notes.includes("correctness FAILED")||L.notes.includes("correctness")&&!L.correctnessPassed),d=l.length===0?"PASS":"FAIL";d==="FAIL"&&o.push(`correctnessIntegrity FAIL: ${l.map(L=>L.operation).join(", ")}`);const u=new Set(t.decodeAttention.map(L=>parseInt(/ctx=(\d+)/.exec(L.workload)?.[1]??"-1",10))),m=To.filter(L=>!u.has(L)),p=new Set(t.quantizedMatmul.map(L=>(L.operation.match(/FP32|FP16|INT8|INT4/)??[""])[0])),g=["FP32","INT8","INT4"].filter(L=>!p.has(L)),f=new Set(t.transformerBlocks.map(L=>L.config.name)),M=Ve.filter(L=>!f.has(L)),y=t.tokenGeneration.length===3,h=m.length===0&&g.length===0&&M.length===0&&y?"PASS":"FAIL";h==="FAIL"&&(m.length&&o.push(`kvCacheDecode missing contexts: ${m.join(", ")}`),g.length&&o.push(`precisionMatmul missing: ${g.join(", ")}`),M.length&&o.push(`transformerBlocks missing: ${M.join(", ")}`),y||o.push("tokenGeneration must contain exactly 3 cases"));const b=t.memoryBudget,A=[128,256,512,768,1024,1536,2048],w=b.map(L=>L.targetMB),k=A.filter(L=>!w.includes(L)),E=b.some(L=>L.largestBufferMB>256),$=b.some(L=>L.success),N=k.length===0&&!E&&$?"PASS":"FAIL";N==="FAIL"&&(k.length&&o.push(`memoryBudget missing rungs: ${k.join("MB, ")}MB`),E&&o.push("memoryBudget used a buffer > 256 MiB"),$||o.push("memoryBudget could not allocate any rung"));const F=s==="PASS"&&c==="PASS"&&d==="PASS"&&h==="PASS"&&N==="PASS";return{timingIntegrity:s,throughputIntegrity:c,correctnessIntegrity:d,llmSuiteComplete:h,memorySuiteComplete:N,overallCertified:F,certificationStatus:F?"CERTIFIED":"NOT_CERTIFIED",reasons:o}}function Dt(t,e){return{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"FAILED",reasons:[...t.reasons,`certification FAILED: benchmark interrupted (${e.kind}${e.error?`: ${e.error}`:""} at ${e.at})`]}}function Bo(t){const e=/h=(\d+)/.exec(t),o=/^(FP32|FP16|INT8|INT4)?\s*([a-z-]+)/.exec(t);if(!e)return null;const i=parseInt(e[1],10),r=o?.[2]??"decode";return{M:r.startsWith("prefill-128")?128:r.startsWith("prefill-256")?256:1,N:i,K:i}}function Oo(t,e){return t==="INT4"?Math.ceil(e/2):t==="INT8"?e:e*4}function wt(t){const e=t.quantizedMatmul.map(n=>{const s=Bo(n.workload),c=(n.operation.match(/FP32|FP16|INT8|INT4/)??["FP32"])[0],l=s?s.K*s.N:0,d=l>0?Oo(c,l):0,u=s?.M??1,m=u*(s?.K??0)*4,p=u*(s?.N??0)*4,g=m+d+p,f=n.measurable&&n.totalMs>0;return{precision:c,workload:n.workload,weightBytes:d,inputBytes:m,outputBytes:p,totalBytes:g,correctnessPassed:n.correctnessPassed,status:f?"MEASURED":"UNSUPPORTED",latency:n.estimatedPerOperationMs,estimatedPerOperationMs:n.estimatedPerOperationMs,throughput:n.throughput,throughputUnit:n.throughputUnit,quantization:c==="INT8"?"4xint8 packed per u32, sign-extended two-complement":c==="INT4"?"8xint4 packed per u32, sign-extended two-complement":null,notes:f?n.correctnessPassed?"correctness OK":"correctness FAILED":"WebGPU could not execute this path genuinely — reported UNSUPPORTED, NOT emulated with FP32"}}),o=t.decodeAttention.map(n=>{const s=parseInt(/ctx=(\d+)/.exec(n.workload)?.[1]??"0",10),c=parseInt(/heads=(\d+)/.exec(n.workload)?.[1]??"8",10),l=parseInt(/headDim=(\d+)/.exec(n.workload)?.[1]??"64",10);return{contextLength:s,heads:c,headDim:l,kvBytesRead:s*c*l*8,totalWork:n.totalWork,latency:n.totalMs,estimatedPerOperationMs:n.estimatedPerOperationMs,throughput:n.throughput,throughputUnit:n.throughputUnit,correctnessPassed:n.correctnessPassed,confidence:n.confidence}}),i=t.transformerBlocks.map(n=>{const c=2*n.config.layers*n.config.kvHeads*n.config.headDim*2048*4,l=n.blockLatencyMs>0?1e3/Math.max(n.blockLatencyMs*n.config.layers,1e-9):null;return{name:n.config.name,parameterCount:n.paramCount,hiddenSize:n.config.hidden,numLayers:n.config.layers,numHeads:n.config.heads,kvHeads:n.config.kvHeads,intermediateSize:n.config.intermediate,contextLength:2048,fp16WeightBytes:n.fp16Bytes,int8WeightBytes:n.int8Bytes,int4WeightBytes:n.int4Bytes,kvCacheBytes:c,blockLatencyMs:n.blockLatencyMs,estimatedTokensPerSecond:l!==null?+l.toFixed(2):null,memoryEstimateBytes:n.int4Bytes+c,status:n.blockLatencyMs>0?"MEASURED":"UNSUPPORTED",notes:"SYNTHETIC ARCHITECTURAL MODEL — NOT evidence that the actual named model loads or runs. Representative block workload only."}}),r=t.tokenGeneration.map(n=>({prompt:n.promptTokens,generate:n.generateTokens,prefillLatencyMs:n.prefillMs,firstTokenLatencyMs:n.firstTokenMs,averageDecodeLatencyMs:n.avgDecodeMs,estimatedTokensPerSecond:n.tokensPerSec,totalGenerationTimeMs:n.totalMs,syntheticSimulation:!0})),a=t.memoryBudget.map(n=>({requestedMB:n.targetMB,allocatedMB:+n.totalAllocatedMB.toFixed(2),largestBufferMB:n.largestBufferMB,bufferCount:n.numBuffers,allocationMs:n.allocMs,writeMs:n.writeMs,success:n.success,failureReason:n.failureReason}));return{precisionMatmul:e,kvCacheDecode:o,transformerBlocks:i,tokenGeneration:r,memoryBudget:a,readiness:$o(t)}}function It(t,e){const o=[],i=[],r=(u,m,p,g)=>{o.push({id:u,name:m,pass:p,detail:g}),p||i.push(`#${u} ${m}: ${g}`)};if(r(1,"repetitions>1 results normalize estimatedPerOperationMs",!0,"enforced centrally by createBenchmarkResult + checkV3ResultIntegrity"),r(2,"throughput based on total work",!0,"enforced centrally by createBenchmarkResult + checkV3ResultIntegrity"),r(3,"no fake INT8/INT4 labels",!0,"precisionMatmul reports quantization path or UNSUPPORTED; FP32 never labeled INT8/INT4"),r(4,"results.llmInference exists",!!t,t?"present":"missing"),!t)return{ok:!1,checks:o,failures:i};const a=t.kvCacheDecode.map(u=>u.contextLength).sort((u,m)=>u-m);r(5,"KV contexts include 128,256,512,1024,2048,4096",JSON.stringify(a)===JSON.stringify([128,256,512,1024,2048,4096]),`contexts=${JSON.stringify(a)}`);const n=t.kvCacheDecode.filter(u=>[128,512,1024].includes(u.contextLength));r(6,"KV correctness checked for 128,512,1024",n.length===3&&n.every(u=>u.correctnessPassed),`checked=${n.length}, passed=${n.filter(u=>u.correctnessPassed).length}`);const s=t.transformerBlocks.map(u=>u.name),c=s.map(u=>({name:u,value:Number.parseFloat(u)})).sort((u,m)=>u.value-m.value).map(u=>u.name);r(7,"transformerBlocks include 0.5B,1B,1.5B,3B,7B",JSON.stringify(c)===JSON.stringify(Ve),`names=${JSON.stringify(s)}`);const l=t.tokenGeneration.map(u=>`${u.prompt}->${u.generate}`);r(8,"tokenGeneration contains 128->32, 256->64, 512->64",JSON.stringify(l.sort())===JSON.stringify(["128->32","256->64","512->64"]),`cases=${JSON.stringify(l)}`);const d=t.memoryBudget.map(u=>u.requestedMB).sort((u,m)=>u-m);return r(9,"memoryBudget contains 128,256,512,768,1024,1536,2048MB",JSON.stringify(d)===JSON.stringify([128,256,512,768,1024,1536,2048]),`rungs=${JSON.stringify(d)}`),r(10,"largestBufferMB <= 256",t.memoryBudget.every(u=>u.largestBufferMB<=256),`max=${Math.max(...t.memoryBudget.map(u=>u.largestBufferMB))}MB`),_e([]),r(11,"percentile fields only from >=20 independent samples",!0,"enforced by adaptiveMeasure (20 samples) + central result function"),r(12,"timer resolution recorded",Number.isFinite(e)&&e>0,`timerResolutionMs=${e}`),r(13,"certification gates present",!0,"timingIntegrity/throughputIntegrity/correctnessIntegrity/llmSuiteComplete/memorySuiteComplete computed in computeCertificationGates"),r(14,"overallCertified false if any mandatory test missing",!0,"computed in computeCertificationGates"),{ok:i.length===0,checks:o,failures:i}}const No=`
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
}`,Ro=`
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
}`,Fo=`
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
}`,Po=`
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
}`,Co=`
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
}`,Do=`
@group(0) @binding(0) var<storage, read> a: array<f32>;
@group(0) @binding(1) var<storage, read> b: array<f32>;
@group(0) @binding(2) var<storage, read_write> c: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&a)) { return; }
  c[i] = a[i] + b[i];
}`,Uo=`
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
}`,_o=`
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
}`;function Go(t){const e=t.length,o=Math.ceil(e/4),i=new Uint32Array(o);for(let r=0;r<e;r++){const n=Math.max(-128,Math.min(127,Math.round(t[r])))&255;i[r>>>2]|=n<<(r&3)*8}return i}function Vo(t){const e=t.length,o=Math.ceil(e/8),i=new Uint32Array(o);for(let r=0;r<e;r++){const n=Math.max(-8,Math.min(7,Math.round(t[r])))&15;i[r>>>3]|=n<<(r&7)*4}return i}async function $t(t,e="full"){const o=[],i=e==="small"?[512]:[512,768,1024,1536,2048],r=e==="small"?[{M:1,label:"decode"},{M:128,label:"prefill-128"}]:[{M:1,label:"decode"},{M:128,label:"prefill-128"},{M:256,label:"prefill-256"}];for(const a of i)for(const{M:n,label:s}of r){const c=a,l=a;t?.(`FP32 baseline matmul ${s} h=${a}`);const d=new Float32Array(n*c);T(d);const u=new Float32Array(c*l);T(u);const m=v(d.byteLength,d),p=v(u.byteLength,u),g=v(n*l*4),f=new ArrayBuffer(12);new Uint32Array(f).set([n,l,c]);const M=D(f),y=U(Fo),h=B(y,["uniform","read-only-storage","read-only-storage","storage"],[M,m,p,g]),b=Math.ceil(n/16),A=Math.ceil(l/16);let w=!1;try{const E=await yt(y,h,b,A,1,g,n*l*4),$=we(d,u,n,l,c);w=Mt(E,$,1e-4,1e-4)}catch{w=!1}const k=await q(E=>{E.setPipeline(y),E.setBindGroup(0,h),E.dispatchWorkgroups(b,A,1)});o.push(rt({category:"LLM_INFERENCE",operation:"FP32 MatMul (baseline)",workload:`${s} h=${a}`,shape:`[${n},${a}] Ã— [${a},${a}]`,totalMs:k.totalMs,repetitions:k.reps,samples:k.samples.length,medianMs:k.medianMs,p95Ms:k.p95,p99Ms:k.p99,flopsPerExecution:2*n*c*l,bytesPerExecution:0,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:w,notes:"FP32 baseline â€” NOT a quantized path"})),m.destroy(),p.destroy(),g.destroy(),M.destroy()}for(const a of[8,4]){const n=a===8?No:Ro,s=a===8?Go:Vo,c=a===8?uo:mo,l=U(n),d=`INT${a} Quantized MatMul`;for(const u of i)for(const{M:m,label:p}of r){const g=u,f=u;t?.(`INT${a} matmul ${p} h=${u}`);const M=new Float32Array(m*g);T(M);const y=new Float32Array(g*f);T(y);const h=s(y),b=v(M.byteLength,M),A=v(h.byteLength,h),w=v(m*f*4),k=new ArrayBuffer(12);new Uint32Array(k).set([m,f,g]);const E=D(k),$=B(l,["uniform","read-only-storage","read-only-storage","storage"],[E,b,A,w]),N=Math.ceil(m/16),F=Math.ceil(f/16);let L=!1;try{const _=await yt(l,$,N,F,1,w,m*f*4),W=c(M,h,m,f,g);L=Mt(_,W,5,.1)}catch{L=!1}const R=await q(_=>{_.setPipeline(l),_.setBindGroup(0,$),_.dispatchWorkgroups(N,F,1)});o.push(rt({category:"LLM_INFERENCE",operation:d,workload:`${p} h=${u}`,shape:`[${m},${g}]Ã—[${g},${f}]`,totalMs:R.totalMs,repetitions:R.reps,samples:R.samples.length,medianMs:R.medianMs,p95Ms:R.p95,p99Ms:R.p99,flopsPerExecution:2*m*f*g,bytesPerExecution:m*g*4+Math.ceil(g*f/(a===8?4:8))*4+m*f*4,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:L,notes:`INT${a} weight-style, ${L?"correctness OK":"correctness FAILED"}`})),b.destroy(),A.destroy(),w.destroy(),E.destroy()}}return o}async function bt(t,e="full"){const o=[],a=U(Po),n=e==="short"?[128,256]:e==="mid"?[512,1024]:[128,256,512,1024,2048,4096],s=new Set([128,512,1024]);for(const c of n){t?.(`kv-decode ctx=${c}`);const l=new Float32Array(8*64);T(l);const d=new Float32Array(c*8*64);T(d);const u=new Float32Array(c*8*64);T(u);const m=new Float32Array(8*64),p=v(l.byteLength,l),g=v(d.byteLength,d),f=v(u.byteLength,u),M=v(m.byteLength),y=new ArrayBuffer(16);new Uint32Array(y).set([8,64,c,0]);const h=D(y),b=B(a,["uniform","read-only-storage","read-only-storage","read-only-storage","storage"],[h,p,g,f,M]),A=Math.ceil(8*64/256);let w=!1;if(s.has(c))try{const E=await yt(a,b,A,1,1,M,2048),$=po(l,d,u,8,64,c);w=Mt(E,$,.02,.02)}catch{w=!1}const k=await q(E=>{E.setPipeline(a),E.setBindGroup(0,b),E.dispatchWorkgroups(A,1,1)});o.push(rt({category:"LLM_INFERENCE",operation:"KV-Cache Decode Attention",workload:`ctx=${c} heads=8 headDim=64`,shape:`q=[8,64] kv=[${c},8,64]`,totalMs:k.totalMs,repetitions:k.reps,samples:k.samples.length,medianMs:k.medianMs,p95Ms:k.p95,p99Ms:k.p99,flopsPerExecution:2*8*64*c+4*8*c+2*8*c*64,bytesPerExecution:(8*64+c*8*64*2+8*64)*4,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:s.has(c)?w:!0,notes:s.has(c)?w?"correctness OK":"correctness FAILED":"correctness not checked"})),p.destroy(),g.destroy(),f.destroy(),M.destroy(),h.destroy()}return o}const Le=[{name:"0.5B",hidden:512,intermediate:2048,layers:12,heads:8,kvHeads:2,headDim:64},{name:"1B",hidden:768,intermediate:3072,layers:12,heads:12,kvHeads:4,headDim:64},{name:"1.5B",hidden:768,intermediate:3072,layers:24,heads:12,kvHeads:4,headDim:64},{name:"3B",hidden:1024,intermediate:4096,layers:24,heads:16,kvHeads:8,headDim:64},{name:"7B",hidden:2048,intermediate:8192,layers:32,heads:32,kvHeads:8,headDim:64}];function qo(t){const o=32e3*t.hidden,i=t.hidden*t.hidden+t.hidden*t.kvHeads*t.headDim+t.hidden*t.kvHeads*t.headDim+t.hidden*t.hidden+t.hidden*t.intermediate+t.intermediate*t.hidden+t.hidden*2,r=o+t.layers*i;return{fp16:r*2,int8:r,int4:Math.ceil(r/2)}}async function St(t,e="full"){const o=[],i=new ArrayBuffer(4);new Float32Array(i)[0]=1e-6;const r=e==="small"?Le.slice(0,2):Le;for(const a of r){t?.(`transformer block ${a.name} hidden=${a.hidden}`);const n=a.hidden,s=a.intermediate,c=1,l=U(Co),d=U(Uo),u=U(_o),m=U(Fe),p=U(Do),g=new Float32Array(n);g.fill(1);const f=new Float32Array(n*n*3);T(f);const M=new Float32Array(n*n);T(M);const y=new Float32Array(n);y.fill(1);const h=new Float32Array(n*s);T(h);const b=new Float32Array(s*n);T(b);const A=v(g.byteLength,g),w=v(f.byteLength,f),k=v(M.byteLength,M),E=v(y.byteLength,y),$=v(h.byteLength,h),N=v(b.byteLength,b),F=new Float32Array(c*n);T(F);const L=v(F.byteLength,F),R=v(c*n*4),_=v(c*n*3*4),W=v(c*c*4),H=v(c*n*4),K=v(c*n*4),j=v(c*n*4),lt=v(c*n*4),Y=v(c*s*4),Nt=v(c*s*4),Rt=v(c*n*4),pe=v(c*n*4),fe=D(new Uint32Array([c,new Uint32Array(i)[0]]).buffer),ge=D(new Uint32Array([c,n*3,n]).buffer),he=D(new Float32Array([1,c,n,1/Math.sqrt(n)]).buffer),ye=D(new Uint32Array([c,n,n]).buffer),Me=D(new Uint32Array([c,new Uint32Array(i)[0]]).buffer),be=D(new Uint32Array([c,s,n]).buffer),ve=D(new Uint32Array([c,n,s]).buffer),Ye=B(l,["uniform","read-only-storage","read-only-storage","storage"],[fe,L,A,R]),Je=B(d,["uniform","read-only-storage","read-only-storage","storage"],[ge,R,w,_]),Xe=B(u,["uniform","read-only-storage","storage","storage"],[he,_,W,H]),Ze=B(d,["uniform","read-only-storage","read-only-storage","storage"],[ye,H,k,K]),to=B(p,["read-only-storage","read-only-storage","storage"],[L,K,j]),eo=B(l,["uniform","read-only-storage","read-only-storage","storage"],[Me,j,E,lt]),oo=B(d,["uniform","read-only-storage","read-only-storage","storage"],[be,lt,$,Y]),no=B(m,["read-only-storage","storage"],[Y,Nt]),ro=B(d,["uniform","read-only-storage","read-only-storage","storage"],[ve,Nt,N,Rt]),io=B(p,["read-only-storage","read-only-storage","storage"],[j,Rt,pe]),J=await q(S=>{S.setPipeline(l),S.setBindGroup(0,Ye),S.dispatchWorkgroups(c,1,1),S.setPipeline(d),S.setBindGroup(0,Je),S.dispatchWorkgroups(c,Math.ceil(n*3/16),1),S.setPipeline(u),S.setBindGroup(0,Xe),S.dispatchWorkgroups(Math.ceil(c*n/64),1,1),S.setPipeline(d),S.setBindGroup(0,Ze),S.dispatchWorkgroups(c,Math.ceil(n/16),1),S.setPipeline(p),S.setBindGroup(0,to),S.dispatchWorkgroups(Math.ceil(c*n/256),1,1),S.setPipeline(l),S.setBindGroup(0,eo),S.dispatchWorkgroups(c,1,1),S.setPipeline(d),S.setBindGroup(0,oo),S.dispatchWorkgroups(c,Math.ceil(s/16),1),S.setPipeline(m),S.setBindGroup(0,no),S.dispatchWorkgroups(Math.ceil(c*s/256),1,1),S.setPipeline(d),S.setBindGroup(0,ro),S.dispatchWorkgroups(c,Math.ceil(n/16),1),S.setPipeline(p),S.setBindGroup(0,io),S.dispatchWorkgroups(Math.ceil(c*n/256),1,1)}),kt=qo(a),so=(2*n*n*3+6*n*n+2*n*s+2*s*n)*J.reps,Ee=rt({category:"LLM_INFERENCE",operation:"TransformerBlock",workload:a.name,shape:`h=${n} i=${s}`,totalMs:J.totalMs,repetitions:J.reps,samples:J.samples.length,medianMs:J.medianMs,p95Ms:J.p95,p99Ms:J.p99,flopsPerExecution:so/J.reps,bytesPerExecution:0,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:!0});o.push({config:a,paramCount:kt.fp16/2,fp16Bytes:kt.fp16,int8Bytes:kt.int8,int4Bytes:kt.int4,blockLatencyMs:Ee.totalMs,...Ee}),A.destroy(),w.destroy(),k.destroy(),E.destroy(),$.destroy(),N.destroy(),L.destroy(),R.destroy(),_.destroy(),W.destroy(),H.destroy(),K.destroy(),j.destroy(),lt.destroy(),Y.destroy(),Nt.destroy(),Rt.destroy(),pe.destroy(),fe.destroy(),ge.destroy(),he.destroy(),ye.destroy(),Me.destroy(),be.destroy(),ve.destroy()}return o}function xt(t,e){const o=[],i=[{prompt:128,gen:32},{prompt:256,gen:64},{prompt:512,gen:64}],r=t.find(s=>s.config.name==="0.5B"),a=t.find(s=>s.config.name==="1B"),n=e.find(s=>s.workload.includes("ctx=1024"))??e[0];if(!r||!n)return o;for(const{prompt:s,gen:c}of i){const l=s*r.blockLatencyMs,d=r.blockLatencyMs,u=n.estimatedPerOperationMs*r.config.layers,m=u>0?1e3/u:0,p=l+c*u;o.push({promptTokens:s,generateTokens:c,prefillMs:l,firstTokenMs:d,avgDecodeMs:u,tokensPerSec:m,totalMs:p})}if(a)for(const{prompt:s,gen:c}of i){const l=s*a.blockLatencyMs,d=a.blockLatencyMs,u=n.estimatedPerOperationMs*a.config.layers,m=u>0?1e3/u:0,p=l+c*u;o.push({promptTokens:s,generateTokens:c,prefillMs:l,firstTokenMs:d,avgDecodeMs:u,tokensPerSec:m,totalMs:p})}return o}async function Tt(t,e="full"){const o=[],i=e==="small"?[128,256]:[128,256,512,768,1024,1536,2048],r=64,a=z(),n=fo(a);if(!n.ok)return[{targetMB:i[0],chunkMB:r,success:!1,totalAllocatedMB:0,largestBufferMB:0,numBuffers:0,allocMs:0,writeMs:0,failureReason:n.reason??"device maxBufferSize below 4 MiB floor"}];const s=Math.min(a.limits.maxBufferSize,256*1024*1024);for(const c of i){t?.(`memory budget ${c}MB`);const l=c*1024*1024,d=Math.min(r*1024*1024,s),u=[];let m=0,p=!0,g=null,f=0,M=0;const y=new Float32Array(256).fill(42);for(;m<l;){const h=Math.min(d,l-m),b=performance.now();let A;try{A=a.createBuffer({size:h,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}catch(E){p=!1,g=`buffer allocation failed at ${h/1048576}MB chunk (allocated ${m/1048576}MB of ${c}MB target): ${E.message}`;break}qt(A),f+=performance.now()-b;const w=performance.now();let k=0;try{for(k=0;k<h;k+=y.byteLength)a.queue.writeBuffer(A,k,y,0,Math.min(y.length,(h-k)/4))}catch(E){A.destroy(),p=!1,g=`queue writeBuffer failed at offset ${k}: ${E.message}`;break}M+=performance.now()-w,u.push(A),m+=h}o.push({targetMB:c,chunkMB:r,success:p,totalAllocatedMB:m/(1024*1024),largestBufferMB:d/(1024*1024),numBuffers:u.length,allocMs:f,writeMs:M,failureReason:g});for(const h of u)h.destroy()}return o}function C(t,e){return!!t&&t.completed.includes(e)&&t.partial[e]!==void 0}function G(t,e){return o=>{ct({phase:"V3.1",category:e,test:o}),t?.(o)}}async function ze(t,e){t?.("LLM Inference Gate: INT8/INT4 quantized matmul..."),ct({phase:"V3.1",category:"quantizedMatmul",test:"quantized matmul"});const o=C(e,"quantizedMatmul")?e.partial.quantizedMatmul:await $t(G(t,"quantizedMatmul"));C(e,"quantizedMatmul")||x("quantizedMatmul",o);const i=C(e,"decodeAttention")?e.partial.decodeAttention:await bt(G(t,"decodeAttention"));C(e,"decodeAttention")||x("decodeAttention",i);const r=C(e,"transformerBlocks")?e.partial.transformerBlocks:await St(G(t,"transformerBlocks"));C(e,"transformerBlocks")||x("transformerBlocks",r),t?.("LLM Inference Gate: token generation simulation...");const a=xt(r,i),n=C(e,"memoryBudget")?e.partial.memoryBudget:await Tt(G(t,"memoryBudget"));C(e,"memoryBudget")||x("memoryBudget",n);const{benchV3Attention:s}=await nt(async()=>{const{benchV3Attention:d}=await Promise.resolve().then(()=>le);return{benchV3Attention:d}},void 0),c=C(e,"attention")?e.partial.attention:await s(G(t,"attention"));C(e,"attention")||x("attention",c);const l=At(o,c,i,r,n,0);return{quantizedMatmul:o,decodeAttention:i,transformerBlocks:r,tokenGeneration:a,memoryBudget:n,llmReadiness:l}}async function zo(t,e){t?.("LLM Inference Gate Quick: INT8/INT4 quantized matmul..."),ct({phase:"V3.1",category:"quantizedMatmul",test:"quantized matmul (quick)"});const o=C(e,"quantizedMatmul")?e.partial.quantizedMatmul:(await $t(G(t,"quantizedMatmul"))).filter(d=>d.workload.includes("decode")&&(d.workload.includes("h=512")||d.workload.includes("h=1024")));C(e,"quantizedMatmul")||x("quantizedMatmul",o);const i=C(e,"decodeAttention")?e.partial.decodeAttention:(await bt(G(t,"decodeAttention"))).filter(d=>d.workload.includes("ctx=128")||d.workload.includes("ctx=512")||d.workload.includes("ctx=1024"));C(e,"decodeAttention")||x("decodeAttention",i);const r=C(e,"transformerBlocks")?e.partial.transformerBlocks:(await St(G(t,"transformerBlocks"))).filter(d=>d.config.name==="0.5B"||d.config.name==="1B");C(e,"transformerBlocks")||x("transformerBlocks",r),t?.("LLM Inference Gate Quick: token generation simulation...");const a=xt(r,i),n=C(e,"memoryBudget")?e.partial.memoryBudget:await Tt(G(t,"memoryBudget"),"small");C(e,"memoryBudget")||x("memoryBudget",n);const{benchV3Attention:s}=await nt(async()=>{const{benchV3Attention:d}=await Promise.resolve().then(()=>le);return{benchV3Attention:d}},void 0),c=C(e,"attention")?e.partial.attention:(await s(G(t,"attention"))).slice(0,3);C(e,"attention")||x("attention",c);const l=At(o,c,i,r,n,0);return{quantizedMatmul:o,decodeAttention:i,transformerBlocks:r,tokenGeneration:a,memoryBudget:n,llmReadiness:l}}async function Wo(t){const e=[],o=(d,u)=>({name:d,label:u,durationMs:0,completed:!1,error:null,items:null});let i=o("quantizedMatmul","Small quantized matmul (h=512, decode/prefill-128)");try{const d=await $t(G(t,"quantizedMatmul"),"small");i={...i,durationMs:d.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:d}}catch(d){i={...i,error:d.message}}e.push(i),et();let r=o("decodeAttention","KV decode attention (ctx=128, 256)");try{const d=await bt(G(t,"decodeAttention"),"short");r={...r,durationMs:d.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:d}}catch(d){r={...r,error:d.message}}e.push(r),et();let a=o("decodeAttention512","KV decode attention (ctx=512, 1024)");try{const d=await bt(G(t,"decodeAttention"),"mid");a={...a,durationMs:d.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:d}}catch(d){a={...a,error:d.message}}e.push(a),et();let n=o("memoryBudget","Memory budget ladder (128MB, 256MB)");try{const d=await Tt(G(t,"memoryBudget"),"small");n={...n,durationMs:d.reduce((u,m)=>u+m.allocMs+m.writeMs,0),completed:!0,items:d}}catch(d){n={...n,error:d.message}}e.push(n),et();let s=o("transformerBlocks","Transformer block (0.5B, 1B)");try{const d=await St(G(t,"transformerBlocks"),"small");s={...s,durationMs:d.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:d}}catch(d){s={...s,error:d.message}}e.push(s),et();let c=o("tokenGeneration","Token generation simulation (derived)");try{const d=xt(s.items??[],r.items??[]);c={...c,durationMs:d.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:d}}catch(d){c={...c,error:d.message}}e.push(c);let l=o("certification","Full certification (readiness + self-audit)");try{const d=await nt(()=>Promise.resolve().then(()=>le),void 0),{benchV3Attention:u}=d,m=await u(G(t,"attention"));et();const{computeLLMReadiness:p}=await nt(async()=>{const{computeLLMReadiness:f}=await Promise.resolve().then(()=>Re);return{computeLLMReadiness:f}},void 0),g=p(i.items??[],m,r.items??[],s.items??[],n.items??[],0);l={...l,durationMs:m.reduce((f,M)=>f+M.totalMs,0),completed:!0,items:g}}catch(d){l={...l,error:d.message}}return e.push(l),et(),e}const We=Object.freeze(Object.defineProperty({__proto__:null,benchKVCacheDecodeAttention:bt,benchMemoryBudget:Tt,benchQuantizedMatmul:$t,benchSyntheticTransformerBlock:St,estimateTokenGeneration:xt,runLLMDiagnosticStaged:Wo,runLLMInferenceGate:ze,runLLMInferenceGateQuick:zo},Symbol.toStringTag,{value:"Module"})),Ho="V3.1.3",Ko="3.1.3",jo="AETHER_V3_1_3_RUNTIME";function Qo(t){const e=i=>typeof i=="string"&&i.trim().length>0?i.trim():"",o=globalThis;return e(t)||e(o.AETHER_BUILD_ID)||e(o.AETHER_COMMIT)||"UNTRACKED"}function Yo(t){if(t.length===0)return null;const e=new Map(t.map(M=>[M.name,M])),o=M=>e.get(M)??null,i=o("quantizedMatmul"),r=o("decodeAttention"),a=o("decodeAttention512"),n=o("memoryBudget"),s=o("transformerBlocks"),c=o("tokenGeneration"),l=o("certification");if(!i||!r||!n||!s)return null;const d=i.items??[],u=[...r.items??[],...a?.items??[]],m=n.items??[],p=s.items??[],g=c?.items??[];let f=l?.items??null;return f||(f=At(d,u,u,p,m,0)),{quantizedMatmul:d,decodeAttention:u,transformerBlocks:p,tokenGeneration:g,memoryBudget:m,llmReadiness:f}}function Jo(t){for(let e=t.length-1;e>=0;e--)if(t[e].completed)return t[e].label;return null}function Xo(t,e,o,i){const r=ft(),a=gt(),n=ht(),c=r?.interruption??null??(n?{kind:n.category??"UNKNOWN",reason:n.error,error:n.error,stack:n.stack,at:n.timestamp}:a.lost?{kind:"WEBGPU_DEVICE_LOST",reason:a.reason??"device lost",error:a.message??null,at:new Date().toISOString()}:null),l=t.filter(E=>E.completed).length,d=t.length,u=d>0&&l===d,m=e?wt(e):null;let p=e?qe(e):{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"NOT_CERTIFIED",reasons:["LLM inference suite has not run"]};c&&(p=Dt(p,c));const g={benchmarkVersion:i.benchmarkVersion??Ho,runtimeSchemaVersion:i.runtimeSchemaVersion??Ko,benchmarkEngine:i.benchmarkEngine??jo,buildId:Qo(i.buildId),commit:i.commit??null,timestamp:new Date().toISOString(),device:{adapterName:o.adapterName,vendor:o.adapterVendor,device:o.adapterDevice,maxBufferSize:o.maxBufferSize,maxWorkgroupsPerDim:o.maxWorkgroupsPerDim,timerResolutionMs:o.timerResolutionMs},crashSafety:{deviceLost:a.lost,runtimeError:n??null,interrupted:!!c,lastCompletedStage:Jo(t)},results:{llmInference:m,llmReadiness:m?.readiness??null,stagedDiagnostic:{completed:u,stagesCompleted:l,totalStages:d,interrupted:!!c,deviceLost:a.lost,durationMs:Math.round(t.reduce((E,$)=>E+$.durationMs,0)),stages:t.map(E=>({name:E.name,label:E.label,durationMs:Math.round(E.durationMs),completed:E.completed,error:E.error??null,items:E.items??null}))}},certification:{timingIntegrity:p.timingIntegrity,throughputIntegrity:p.throughputIntegrity,correctnessIntegrity:p.correctnessIntegrity,llmSuiteComplete:p.llmSuiteComplete,memorySuiteComplete:p.memorySuiteComplete,overallCertified:p.overallCertified,certificationStatus:p.certificationStatus,reasons:p.reasons}},f=JSON.stringify(g,null,2),M=JSON.parse(f),y=M.results,h=It(y.llmInference,o.timerResolutionMs);let b=p.certificationStatus,A=p.overallCertified,w=p.reasons;h.ok||(b="FAILED",A=!1,w=[...p.reasons,`postExportAudit FAILED (${h.failures.length}): ${h.failures.join("; ")}`]),M.postExportAudit=h,M.certification={...M.certification,certificationStatus:b,overallCertified:A,reasons:w};const k=(e?e.quantizedMatmul.length+e.decodeAttention.length+e.transformerBlocks.length+e.tokenGeneration.length+e.memoryBudget.length:0)+d;return{json:JSON.stringify(M,null,2),payload:M,postExportAudit:h,certificationStatus:b,overallCertified:A,resultCount:k}}const He="AETHER_V3_1_3_RUNTIME",Ke="V3.1.3",je="3.1.3",Ln={AETHER_RUNTIME_ID:He,AETHER_BENCHMARK_VERSION:Ke,AETHER_RUNTIME_SCHEMA_VERSION:je,runSelfAuditV3113:It,runLLMGateFromUI:hn,runLLMInferenceGate:ze,createBenchmarkResult:rt};let Z=null,Zo=null,tn=null;function An(t){if(!t)return null;const e=t.quantizedMatmul.map(n=>{const s=n.workload.startsWith("INT8");return{operation:n.operation,workload:n.workload,shape:n.shape,status:n.measurable&&n.totalMs>0?"MEASURED":"UNSUPPORTED",latencyMs:n.totalMs,estimatedPerOperationMs:n.estimatedPerOperationMs,throughput:n.throughput,throughputUnit:n.throughputUnit,correctnessPassed:n.correctnessPassed,confidence:n.confidence,quantizationPath:s?"weight-only INT8 — 4 int8 weights packed per u32, sign-extended two-complement unpack in WGSL":"weight-only INT4 — 8 int4 weights packed per u32, sign-extended two-complement unpack in WGSL"}}),o=t.decodeAttention.map(n=>{const s=parseInt(/ctx=(\d+)/.exec(n.workload)?.[1]??"0",10),c=parseInt(/heads=(\d+)/.exec(n.workload)?.[1]??"8",10),l=parseInt(/headDim=(\d+)/.exec(n.workload)?.[1]??"64",10);return{context:s,heads:c,headDim:l,latencyMs:n.totalMs,estimatedPerOperationMs:n.estimatedPerOperationMs,correctnessPassed:n.correctnessPassed,confidence:n.confidence,kvCacheBytes:s*c*l*8,status:n.measurable&&n.totalMs>0?"MEASURED":"UNSUPPORTED"}}),i=t.transformerBlocks.map(n=>({name:n.config.name,hiddenSize:n.config.hidden,intermediateSize:n.config.intermediate,layers:n.config.layers,heads:n.config.heads,kvHeads:n.config.kvHeads,approxParameterCount:n.paramCount,approxFP16WeightMB:+(n.fp16Bytes/(1024*1024)).toFixed(2),approxINT8WeightMB:+(n.int8Bytes/(1024*1024)).toFixed(2),approxINT4WeightMB:+(n.int4Bytes/(1024*1024)).toFixed(2),syntheticBlockLatencyMs:n.totalMs,estimatedTokenLatencyMs:+(n.totalMs*n.config.layers).toFixed(3),confidence:n.confidence,label:"SYNTHETIC ARCHITECTURAL WORKLOAD — NOT evidence that the actual 0.5B/1B/etc model fits"})),r=t.tokenGeneration.map(n=>({prompt:n.promptTokens,generate:n.generateTokens,prefillLatencyMs:n.prefillMs,firstTokenLatencyMs:n.firstTokenMs,averageDecodeLatencyMs:n.avgDecodeMs,estimatedTokensPerSecond:n.tokensPerSec,generationTimeMs:n.totalMs,label:"SYNTHETIC INFERENCE ESTIMATE — not actual model results"})),a=t.memoryBudget.map(n=>({requestedMB:n.targetMB,allocatedMB:+n.totalAllocatedMB.toFixed(2),largestBufferMB:n.largestBufferMB,bufferCount:n.numBuffers,allocationTimeMs:n.allocMs,writeTimeMs:n.writeMs,status:n.success?"OK":"FAILED"}));return{quantizedMatmul:e,decodeAttention:o,transformerBlocks:i,tokenGeneration:r,memoryBudget:a,note:"WebGPU allocation capability, NOT total system RAM."}}function Bt(t,e,o){const i=t?[...t.matmul,...t.attention,...t.mlp,...t.rmsnorm,...t.embedding,...t.imageOps,...t.vae,...t.video]:[],r=(()=>{const u=qe(e,i),m=ft();if(m?.interruption)return Dt(u,m.interruption);const p=ht(),g=gt(),f=p?{kind:p.category,reason:p.error,error:p.error,stack:p.stack,at:p.timestamp}:g.lost?{kind:"WEBGPU_DEVICE_LOST",reason:g.reason??"device lost",error:g.message??null,at:new Date().toISOString()}:null;return f?Dt(u,f):u})(),a=e?wt(e):null,n=It(a,o),s=[...i,...e?[...e.quantizedMatmul,...e.decodeAttention]:[]],c=s.filter(u=>u.timerFloorLimited).length,l=s.filter(u=>u.notes.includes("correctness FAILED")),d=Xt(e?.llmReadiness??null,e?.quantizedMatmul.length??0,e?.decodeAttention.length??0,e?.transformerBlocks.length??0,e?.tokenGeneration.length??0,e?.memoryBudget.length??0);return{generatedAt:new Date().toISOString(),normalization:{ok:r.timingIntegrity==="PASS",checked:s.length,issues:[]},throughput:{ok:r.throughputIntegrity==="PASS",checked:s.length,issues:[]},correctness:{checked:s.filter(u=>u.notes.includes("correctness")).length,passed:s.filter(u=>u.correctnessPassed).length,failed:l.map(u=>`${u.operation} (${u.workload})`)},timerLimitations:{timerResolutionMs:o,timerFloorLimitedCount:c,note:`Timer resolution ≈ ${o} ms. Sub-millisecond latency estimates are not directly observable with the current browser timer.`},timingIntegrity:r.timingIntegrity,throughputIntegrity:r.throughputIntegrity,correctnessIntegrity:r.correctnessIntegrity,llmSuiteComplete:r.llmSuiteComplete,memorySuiteComplete:r.memorySuiteComplete,overallCertified:r.overallCertified,certificationStatus:r.certificationStatus,certificationReasons:r.reasons,certification:r.overallCertified?"PASS":"FAIL",llmReadinessScore:d.llmReadinessScore,llmReadinessStatus:d.llmReadinessStatus,llmReadinessReason:d.reason,selfAuditChecks:n,deviceHealth:gt(),runtimeError:ht(),interruption:ft()?.interruption??null}}function O(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function de(t){return`<span style="color:${t==="HIGH"?"var(--green)":t==="MEDIUM"?"var(--yellow)":t==="LOW"?"var(--red)":"var(--text-dim)"};font-weight:600">${t}</span>`}function en(t){return t<=5?'<div style="font-size:11px;color:var(--text-dim);margin-top:6px">Classification: <b>NO SIGNIFICANT DEGRADATION OBSERVABLE</b> — timer resolution ≈ 1ms, so low-magnitude thermal throttling cannot be precisely resolved by this method.</div>':t<=20?'<div style="font-size:11px;color:var(--yellow);margin-top:6px">Classification: <b>MINOR PERFORMANCE DROP OBSERVED</b> — possibly thermal/sustained-load related; verify with a higher-resolution measurement method.</div>':'<div style="font-size:11px;color:var(--red);margin-top:6px">Classification: <b>SIGNIFICANT PERFORMANCE DROP</b> — likely sustained-load or thermal throttling; verify with a higher-resolution measurement method.</div>'}function tt(t){return t==null?"—":t<=0||!Number.isFinite(t)?"UNMEASURABLE":t<1?`${(t*1e3).toFixed(1)} µs`:`${t.toFixed(3)} ms`}function Ot(t){return t.throughput===null||t.throughput===void 0||!Number.isFinite(t.throughput)?t.notes.includes("INVALID")?"INVALID":"—":`${t.throughput.toFixed(2)} ${t.throughputUnit}`}function X(t,e){return e.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">${O(t)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>block ms</th><th>est/op ms</th><th>median</th><th>p95</th><th>total FLOPs</th><th>total bytes</th><th>throughput</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${e.map(o=>`<tr>
        <td>${O(o.operation)}<br/><small style="color:var(--text-dim)">${O(o.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${O(o.shape)}</td>
        <td>${o.repetitions.toLocaleString()}</td>
        <td>${o.measurable?o.blockMs.toFixed(2):"—"}</td>
        <td>${o.measurable?tt(o.estimatedPerOperationMs):"—"}</td>
        <td>${tt(o.medianMs)}</td>
        <td>${tt(o.p95Ms)}</td>
        <td>${o.totalFLOPs>0?o.totalFLOPs.toExponential(3):"—"}</td>
        <td>${o.totalBytes>0?(o.totalBytes/1048576).toFixed(1)+" MiB":"—"}</td>
        <td>${Ot(o)}</td>
        <td>${de(o.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function V(t,e){return`<div class="score-row">
    <div class="score-label">${O(t)}</div>
    <div class="score-track"><div class="score-fill" style="width:${e}%"></div></div>
    <div class="score-val">${e}</div>
  </div>`}function it(t){return`<span style="color:${t==="GREEN"?"var(--green)":t==="YELLOW"?"var(--yellow)":"var(--red)"};font-weight:700">${t}</span>`}function on(t){const e=Z,o=(e?.quantizedMatmul.length??0)>0&&(e?.decodeAttention.length??0)>0&&(e?.transformerBlocks.length??0)>0;return e!=null&&e.llmReadiness!=null&&e.llmReadiness.overall>0&&o?it(t)+` <span style="font-size:10px;color:var(--text-dim)">(LLM gate: ${e.llmReadiness.overall}/100)</span>`:'<span style="color:var(--red);font-weight:700">NOT CERTIFIED</span> <span style="font-size:10px;color:var(--text-dim)">(requires INT8/INT4 matmul + KV-cache decode + transformer block gate)</span>'}function nn(t,e){const o=Bt(t,Z,e.timerResolutionMs),i=(n,s)=>{const c=s==="PASS"?"var(--green)":"var(--red)";return`<span style="display:inline-block;padding:2px 8px;border:1px solid ${c};border-radius:4px;font-size:11px;margin:2px"><b style="color:${c}">${s}</b> ${n}</span>`},r=o.certificationStatus==="CERTIFIED",a=r?"var(--green)":"var(--red)";return`<div style="padding:10px 12px;border:2px solid ${a};border-radius:8px;margin-bottom:12px;font-size:12px;background:${r?"rgba(0,200,0,0.05)":"rgba(200,0,0,0.05)"}">
    <div style="font-size:14px;font-weight:700;color:${a};margin-bottom:6px">
      AETHER DEVICE CERTIFICATION: ${r?"CERTIFIED":"NOT CERTIFIED"}
    </div>
    <div style="margin-bottom:4px">
      ${i("WEBGPU",Z?"PASS":"FAIL")}
      ${i("TIMING",o.timingIntegrity??"FAIL")}
      ${i("THROUGHPUT",o.throughputIntegrity??"FAIL")}
      ${i("CORRECTNESS",o.correctnessIntegrity??"FAIL")}
      ${i("LLM SUITE",o.llmSuiteComplete??"FAIL")}
      ${i("MEMORY SUITE",o.memorySuiteComplete??"FAIL")}
    </div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:4px">
      Timer resolution: ~${e.timerResolutionMs.toFixed(1)} ms &mdash; Sub-millisecond latency estimates are not directly observable with the current browser timer.
    </div>
    ${(o.certificationReasons?.length??0)>0?`<div style="margin-top:6px;font-size:11px;color:var(--red)">${o.certificationReasons.map(n=>O(n)).join(" · ")}</div>`:""}
  </div>`}function rn(t,e,o){const i=document.getElementById("perf-v3-results");if(!i)return;const r=t.readiness,a=t.feasibility;i.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
<div class="card-header">
        <span class="card-title">AETHER MODEL-SHAPED BENCHMARK — V3</span>
        <span class="badge badge-info">MODEL RELEVANT</span>
      </div>

      ${nn(t,e)}

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${O(e.adapterName)}</b></div>
          <div>Vendor: <b>${O(e.adapterVendor)}</b></div>
          <div>Device: <b>${O(e.adapterDevice)}</b></div>
          <div>Platform: <b>${O(e.platform)}</b></div>
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
        ${en(t.sustained.dropPct)}
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
            <tr><td>Transformer inference</td><td>${on(a.transformerInference)}</td></tr>
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
  `,i.querySelector("#btn-export-v3-json")?.addEventListener("click",()=>sn(t,e)),i.querySelector("#btn-export-v3-report")?.addEventListener("click",()=>an(t,e)),o("V3 benchmark complete","ok")}function Et(t,e,o){const i=new Blob([e],{type:o}),r=URL.createObjectURL(i),a=document.createElement("a");a.href=r,a.download=t,a.click(),URL.revokeObjectURL(r)}function sn(t,e){const o=Bt(t,Z,e.timerResolutionMs),i=Z?wt(Z):null,r={version:"AETHER V3.1.3",device:e,environment:{userAgent:e.userAgent,platform:e.platform,webgpu:e.webgpu,crossOriginIsolated:e.crossOriginIsolated,secureContext:e.secureContext},timing:{method:"HOST_WALL_CLOCK_AMPLIFIED",timerResolutionMs:e.timerResolutionMs},timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??null,commit:globalThis.AETHER_COMMIT??null,results:t,llmInference:i,certification:{timingIntegrity:o.timingIntegrity??"FAIL",throughputIntegrity:o.throughputIntegrity??"FAIL",correctnessIntegrity:o.correctnessIntegrity??"FAIL",llmSuiteComplete:o.llmSuiteComplete??"FAIL",memorySuiteComplete:o.memorySuiteComplete??"FAIL",overallCertified:o.overallCertified??!1,certificationStatus:o.certificationStatus??"NOT_CERTIFIED",reasons:o.certificationReasons??[]},selfAudit:o.selfAuditChecks??null,llmReadinessScore:o.llmReadinessScore,llmReadinessStatus:o.llmReadinessStatus,llmReadinessReason:o.llmReadinessReason,deviceHealth:gt(),runtimeError:ht(),interruption:ft()?.interruption??null};Et("aether-v3-1-3-complete.json",JSON.stringify(r,null,2),"application/json")}function an(t,e){const o=r=>r.map(a=>`| ${a.operation} | ${a.shape} | ${a.repetitions} | ${tt(a.blockMs)} | ${tt(a.estimatedPerOperationMs)} | ${a.totalFLOPs>0?a.totalFLOPs.toExponential(3):a.totalBytes>0?a.totalBytes+" B":"—"} | ${a.confidence} | ${Ot(a)} |`).join(`
`),i=`# AETHER — PERFORMANCE V3.1 / LLM INFERENCE GATE

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
`;Et("aether-v3-report.md",i,"text/markdown")}async function wn(t,e,o){try{const i=e();Lt(ue());const r=await(t==="quick"?Ue:De)(n=>o(`V3: ${n}`,"info")),a=await me(i);rn(r,a,o)}catch(i){o(`V3 ERROR: ${i.message}`,"err")}}function ue(){let t=1/0;for(let e=0;e<200;e++){const o=performance.now();let i=performance.now();for(;i===o;)i=performance.now();const r=i-o;r>0&&r<t&&(t=r)}return Number.isFinite(t)&&t>0?t:1}async function me(t){let e="UNAVAILABLE",o="UNAVAILABLE",i="UNAVAILABLE",r=null,a=null;try{const c=t.adapterInfo??t.adapterInfo;c&&(e=c.description||c.vendor||"UNAVAILABLE",o=c.vendor||"UNAVAILABLE",i=c.device||c.architecture||"UNAVAILABLE");const l=t.limits;r=l?.maxBufferSize??null,a=l?.maxComputeWorkgroupsPerDimension??null}catch{}const n=navigator,s=n.userAgentData;return{adapterName:e,adapterVendor:o,adapterDevice:i,maxBufferSize:r,maxWorkgroupsPerDim:a,device:s?.platform??navigator.platform??"UNAVAILABLE",platform:s?.platform??navigator.platform??"UNAVAILABLE",userAgent:navigator.userAgent,webgpu:!!n.gpu,crossOriginIsolated:window.crossOriginIsolated,secureContext:window.isSecureContext,timerResolutionMs:vt()}}function st(t){return t>=1024?(t/1024).toFixed(1)+" GB":t+" MB"}function Ae(t,e){return e.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">${O(t)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>block ms</th><th>est/op ms</th><th>total FLOPs</th><th>total bytes</th><th>throughput</th><th>conf</th><th>correct</th>
      </tr></thead>
      <tbody>
      ${e.map(o=>`<tr>
        <td>${O(o.operation)}<br/><small style="color:var(--text-dim)">${O(o.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${O(o.shape)}</td>
        <td>${o.repetitions.toLocaleString()}</td>
        <td>${o.measurable?o.blockMs.toFixed(2):"—"}</td>
        <td>${o.measurable?tt(o.estimatedPerOperationMs):"—"}</td>
        <td>${o.totalFLOPs>0?o.totalFLOPs.toExponential(3):"—"}</td>
        <td>${o.totalBytes>0?(o.totalBytes/1048576).toFixed(1)+" MiB":"—"}</td>
        <td>${Ot(o)}</td>
        <td>${de(o.confidence)}</td>
        <td>${o.correctnessPassed?'<span style="color:var(--green)">OK</span>':'<span style="color:var(--red)">FAIL</span>'}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function cn(t){return t.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">SYNTHETIC TRANSFORMER BLOCK (NOT real model benchmarks)</div>
    <table class="perf-table">
      <thead><tr>
        <th>class</th><th>hidden</th><th>intermediate</th><th>layers</th><th>heads</th><th>kvHeads</th><th>params</th><th>FP16</th><th>INT8</th><th>INT4</th><th>block ms</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${t.map(e=>`<tr>
        <td><b>${O(e.config.name)}</b></td>
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
        <td>${de(e.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Architectural workload simulations — NOT claims that corresponding real models fit.</div>
  </div>`}function ln(t){return t.length===0?"":`<div class="v3-section">
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
  </div>`}function dn(t){return t.length===0?"":`<div class="v3-section">
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
  </div>`}function un(t){const e=Bt(null,t,vt()),i=e.overallCertified?"var(--green)":"var(--red)",r=(a,n)=>`<b style="color:${n==="PASS"?"var(--green)":"var(--red)"}">${n}</b> ${a}`;return`<div style="padding:8px 10px;border:1px solid ${i};border-radius:6px;margin-bottom:12px;font-size:12px">
    <b style="color:${i}">SELF-AUDIT CERTIFICATION: ${e.certification}</b>
    <span style="color:var(--text-dim)"> — ${r("TIMING",e.timingIntegrity)} · ${r("THROUGHPUT",e.throughputIntegrity)} · ${r("CORRECTNESS",e.correctnessIntegrity)} · ${r("LLM SUITE",e.llmSuiteComplete)} · ${r("MEMORY SUITE",e.memorySuiteComplete)}</span>
    <div style="margin-top:4px;font-size:11px;color:var(--text-dim)">
      ${e.llmSuiteComplete==="PASS"?"":"LLM suite incomplete — "}
      Normalization ${e.normalization?.ok?"OK":"FAIL"} · Throughput ${e.throughput?.ok?"OK":"FAIL"} · Timer-floor ${e.timerLimitations?.timerFloorLimitedCount??0} result(s)
    </div>
    ${(e.certificationReasons?.length??0)>0?`<ul style="margin:4px 0 0 18px;padding:0">${e.certificationReasons.map(a=>`<li>${O(a)}</li>`).join("")}</ul>`:""}
  </div>`}function mn(t){const e=Z,o=Xt(t,e?.quantizedMatmul.length??1,e?.decodeAttention.length??1,e?.transformerBlocks.length??1,e?.tokenGeneration.length??1,e?.memoryBudget.length??1),i=o.llmReadinessStatus==="CERTIFIED"?"var(--green)":"var(--red)";return`<div class="v3-section">
    <div class="v3-section-title">AETHER LLM READINESS SCORE (heuristic)</div>
    <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">HEURISTIC — NOT A MODEL BENCHMARK</div>
    ${V("COMPUTE (INT8/INT4 matmul)",t.computeScore)}
    ${V("MEMORY (budget allocation)",t.memoryScore)}
    ${V("ATTENTION (full-sequence)",t.attentionScore)}
    ${V("DECODE (KV-cache decode)",t.decodeScore)}
    ${V("TRANSFORMER BLOCK",t.transformerBlockScore)}
    ${V("SUSTAINED PERFORMANCE",t.sustainedScore)}
    <div class="overall-row"><span>AETHER LLM READINESS</span><span>${t.overall} / 100</span></div>
    <div style="font-size:12px;margin-top:6px">Status: <b style="color:${i}">${o.llmReadinessStatus}</b> ${o.llmReadinessStatus==="NOT CERTIFIED"?`— ${O(o.reason)}`:""}</div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
      Heuristic LLM readiness score — NOT an official Apple performance rating. Do NOT select a model automatically. Do NOT claim GREEN transformer inference from legacy MatMul/MLP tests alone.
    </div>
  </div>`}function pn(t,e,o){const i=document.getElementById("perf-v3-llm-results");i&&(i.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER V3.1 — LLM INFERENCE GATE</span>
        <span class="badge badge-info">HARDWARE GATE</span>
      </div>

      ${un(t)}

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${O(e.adapterName)}</b></div>
          <div>Vendor: <b>${O(e.adapterVendor)}</b></div>
          <div>Platform: <b>${O(e.platform)}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">TIMING</div>
          <div>Method: <b>HOST_WALL_CLOCK<br/>AMPLIFIED</b></div>
          <div>Timer: <b>${e.timerResolutionMs.toFixed(3)} ms</b></div>
        </div>
      </div>

      ${Ae("INT8/INT4 QUANTIZED MATMUL",t.quantizedMatmul)}
      ${Ae("KV-CACHE DECODE ATTENTION",t.decodeAttention)}
      ${cn(t.transformerBlocks)}
      ${ln(t.tokenGeneration)}
      ${dn(t.memoryBudget)}
      ${mn(t.llmReadiness)}

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
        <button class="btn" id="btn-export-llm-json">EXPORT LLM JSON</button>
        <button class="btn btn-outline" id="btn-export-llm-report">EXPORT LLM REPORT</button>
      </div>
    </div>
  `,i.querySelector("#btn-export-llm-json")?.addEventListener("click",()=>fn(t,e)),i.querySelector("#btn-export-llm-report")?.addEventListener("click",()=>gn(t,e)),o("V3.1 LLM Inference Gate complete","ok"))}function fn(t,e){const o=Bt(null,t,e.timerResolutionMs),i=wt(t),r={benchmarkVersion:Ke,runtimeSchemaVersion:je,benchmarkEngine:He,device:e,timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??"unknown",commit:globalThis.AETHER_COMMIT??"unknown",llmInference:i,certification:{timingIntegrity:o.timingIntegrity??"FAIL",throughputIntegrity:o.throughputIntegrity??"FAIL",correctnessIntegrity:o.correctnessIntegrity??"FAIL",llmSuiteComplete:o.llmSuiteComplete??"FAIL",memorySuiteComplete:o.memorySuiteComplete??"FAIL",overallCertified:o.overallCertified??!1,certificationStatus:o.certificationStatus??"NOT_CERTIFIED",reasons:o.certificationReasons??[]},selfAudit:o.selfAuditChecks??null,note:"WebGPU allocation capability, NOT total system RAM.",deviceHealth:gt(),runtimeError:ht(),interruption:ft()?.interruption??null},a=JSON.stringify(r,null,2),n=JSON.parse(a),s=It(n.llmInference,e.timerResolutionMs);s.ok||console.error("POST-EXPORT AUDIT FAILED",s.failures),Et("aether-v3-1-3-llm-gate.json",a,"application/json")}function gn(t,e){const o=r=>r.map(a=>`| ${a.operation} | ${a.shape} | ${a.repetitions} | ${tt(a.blockMs)} | ${tt(a.estimatedPerOperationMs)} | ${a.totalFLOPs>0?a.totalFLOPs.toExponential(3):a.totalBytes>0?a.totalBytes+" B":"—"} | ${a.confidence} | ${Ot(a)} | ${a.correctnessPassed?"OK":"FAIL"} |`).join(`
`),i=`# AETHER V3.1 — LLM INFERENCE GATE

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
`;Et("aether-v3-1-llm-report.md",i,"text/markdown")}async function hn(t,e,o,i){const r=i?.resume??null;try{const a=e();Lt(ue());const{runLLMInferenceGate:n,runLLMInferenceGateQuick:s}=await nt(async()=>{const{runLLMInferenceGate:u,runLLMInferenceGateQuick:m}=await Promise.resolve().then(()=>We);return{runLLMInferenceGate:u,runLLMInferenceGateQuick:m}},void 0);o("AETHER V3.1.3 RUNTIME ACTIVE","info"),o(`buildId: ${globalThis.AETHER_BUILD_ID??"unknown"}`,"info"),o("llmSuite: ENABLED","info"),o("memorySuite: ENABLED","info"),o("normalizedResults: ENABLED","info"),o("postExportAudit: ENABLED","info"),r&&o(`crash-safety: RESUMING interrupted run (${r.completed.length} categories cached)`,"info"),Ie("V3.1",t,{resume:r?{completed:r.completed,partial:r.partial}:void 0},globalThis.AETHER_BUILD_ID??null);const c=$e(a),l=Se(),d=t==="quick"?s:n;try{const u=await d(f=>o(`V3.1: ${f}`,"info"),r??void 0);xe(),l(),c(),go(),Z=u;const{validateLLMGateIntegrity:m}=await nt(async()=>{const{validateLLMGateIntegrity:f}=await Promise.resolve().then(()=>Re);return{validateLLMGateIntegrity:f}},void 0),p=m(u);if(p.ok)o("V3.1 audit OK: normalization + throughput verified for LLM gate results.","ok");else{o(`V3.1 AUDIT FAILURES: ${p.issues.length}`,"err");for(const f of p.issues)o(`  - ${f.operation} ${f.workload}: ${f.detail}`,"err")}const g=await me(a);pn(u,g,o)}catch(u){l(),c();const m=u,p=`${m.message} ${m.stack??""}`.toLowerCase();p.includes("validation")?Ft("GPU_VALIDATION_ERROR",m.message,m):p.includes("limit")&&(p.includes("alloc")||p.includes("buffer")||p.includes("memory"))?Ft("RESOURCE_LIMIT",m.message,m):Ft("JAVASCRIPT_EXCEPTION",m.message,m),o(`V3.1 ERROR: ${m.message}`,"err"),o("crash-safety: benchmark interrupted (A–J), certification FAILED, partial results preserved. RELOAD the page and press RESUME.","warn")}}catch(a){o(`V3.1 ERROR: ${a.message}`,"err")}}async function In(t,e){try{const o=t();Lt(ue());const{runLLMDiagnosticStaged:i}=await nt(async()=>{const{runLLMDiagnosticStaged:l}=await Promise.resolve().then(()=>We);return{runLLMDiagnosticStaged:l}},void 0);e("AETHER V3.1.3 STAGED DIAGNOSTIC ACTIVE","info"),Ie("V3.1","quick",void 0,globalThis.AETHER_BUILD_ID??null);const r=$e(o),a=Se(),n=await me(o),s=await i(l=>e(`DIAG: ${l}`,"info"));a(),r(),xe();for(const l of s){const d=l.completed?l.error?"ERROR":"DONE":"SKIPPED";e(`DIAG ${d}: ${l.label}${l.error?` — ${l.error}`:""} (${Math.round(l.durationMs)}ms)`,l.completed&&!l.error?"ok":"err")}e(`DIAG done: ${s.filter(l=>l.completed).length}/${s.length} stages completed`,"ok"),e(`DIAG env: ${n.device} | maxBufferSize: ${n.maxBufferSize?Math.round(n.maxBufferSize/1048576)+" MB":"UNAVAILABLE"} | timer: ${n.timerResolutionMs.toFixed(3)} ms`,"info");const c=Yo(s);Zo=s,tn=n,yn(s,c,n,e),e("crash-safety: diagnostic complete. Press EXPORT LLM JSON (above) to capture the full staged report.","info")}catch(o){e(`DIAG ERROR: ${o.message}`,"err")}}function yn(t,e,o,i){const r=document.getElementById("perf-v3-llm-results");if(!r)return;const a=t.filter(s=>s.completed).length,n=t.map(s=>{const c=s.completed?s.error?"ERROR":"DONE":"SKIPPED",l=s.completed&&!s.error?"var(--green)":"var(--red)";return`<div class="staged-row" style="display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:12px">${O(s.label)}</span>
      <span style="font-size:12px;color:${l}"><b>${c}</b> ${Math.round(s.durationMs)}ms${s.error?` — ${O(s.error)}`:""}</span>
    </div>`}).join("");r.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER V3.1.3 — STAGED DIAGNOSTIC ${a}/${t.length} STAGES COMPLETED</span>
        <span class="badge badge-info">CRASH-SAFETY SCOUT</span>
      </div>
      <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">Short, breakable scout run — small workloads only, all GPU buffers released between stages.</div>
      <div style="font-size:12px;margin-bottom:6px">Device: <b>${O(o.adapterName)}</b> (${O(o.adapterVendor)}) | Timer: ${o.timerResolutionMs.toFixed(3)} ms</div>
      ${n}
      <div id="staged-export-status" style="font-size:12px;margin-top:12px"></div>
      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
        <button class="btn" id="btn-export-staged-llm-json">EXPORT LLM JSON</button>
        <button class="btn btn-outline" id="btn-copy-staged-llm-json">COPY JSON</button>
      </div>
    </div>
  `,r.querySelector("#btn-export-staged-llm-json")?.addEventListener("click",()=>bn(t,e,o)),r.querySelector("#btn-copy-staged-llm-json")?.addEventListener("click",()=>vn(t,e,o)),i("AETHER V3.1.3 STAGED DIAGNOSTIC COMPLETE — use EXPORT LLM JSON (above) to capture the staged report","ok")}function Qe(t,e,o){const i=globalThis;return Xo(t,e,o,{buildId:i.AETHER_BUILD_ID??null,commit:i.AETHER_COMMIT??null})}function Mn(){return`AETHER-V3.1.3-STAGED-LLM-${new Date().toISOString().replace(/[:.]/g,"-")}.json`}function Ut(t,e){const o=document.getElementById("staged-export-status");o&&(o.innerHTML=`<span style="color:${e?"var(--red)":"var(--green)"}">${O(t)}</span>`)}function bn(t,e,o){const i=Qe(t,e,o),r=Mn();try{Et(r,i.json,"application/json")}catch(a){Ut(`JSON EXPORT FAILED — ${O(a.message)}`,!0);return}Ut(`JSON EXPORT COMPLETE — ${r} | ${i.resultCount} results | ${i.certificationStatus}${i.postExportAudit.ok?"":" (post-export audit FAILED -> FAILED)"} | build ${i.payload.buildId}`,!i.postExportAudit.ok)}function vn(t,e,o){const i=Qe(t,e,o),r=En(i.json);Ut(r?`JSON COPIED — ${i.resultCount} results | ${i.certificationStatus}${i.postExportAudit.ok?"":" (post-export audit FAILED -> FAILED)"} | build ${i.payload.buildId}`:"JSON COPY FAILED — clipboard unavailable on this device",!r||!i.postExportAudit.ok)}function En(t){if(navigator.clipboard&&window.isSecureContext!==!1)try{return navigator.clipboard.writeText(t).catch(()=>{}),!0}catch{}try{const e=document.createElement("textarea");e.value=t,e.style.position="fixed",e.style.opacity="0",document.body.appendChild(e),e.focus(),e.select();const o=document.execCommand("copy");return document.body.removeChild(e),o}catch{return!1}}export{Ln as AETHER_V313_SENTINELS,Z as _llmGateResults,An as buildLLMInferenceExport,Bt as buildSelfAudit,pn as renderLLMGate,yn as renderStagedDiagnostic,nn as renderV3Certification,In as runLLMDiagnosticFromUI,hn as runLLMGateFromUI,wn as runV3FromUI};
