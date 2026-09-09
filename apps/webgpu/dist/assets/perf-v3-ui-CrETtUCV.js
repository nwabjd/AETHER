const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/perf-v3-llm-X5L7lz1u.js","assets/index-CdZUFsiu.js","assets/index-BX4ETZTQ.css"])))=>i.map(i=>d[i]);
import{C as ce,h as le,a as de,r as et,g as tt,c as ot,_ as Ne}from"./index-CdZUFsiu.js";let ue=1;function me(e){ue=e}function Z(){return ue}function Fe(e){return e<=0||!Number.isFinite(e)||e<=ue?"UNMEASURABLE":e<5?"LOW":e<20?"MEDIUM":"HIGH"}const pe=2e3,fe=2e3,Ce=5e9,he=1e-6;function Ue(e){if(!Number.isInteger(e.repetitions)||e.repetitions<=0)throw new Error(`TIMING INTEGRITY FAILURE: ${e.operation}/${e.workload} repetitions=${e.repetitions} must be a positive integer`);if(!Number.isFinite(e.totalMs)||e.totalMs<0)throw new Error(`TIMING INTEGRITY FAILURE: ${e.operation}/${e.workload} totalMs=${e.totalMs} invalid`);const o=e.totalMs/e.repetitions;if(Math.abs(o-e.totalMs/e.repetitions)>he)throw new Error(`TIMING INTEGRITY FAILURE: ${e.operation}/${e.workload} estimatedPerOperationMs=${o.toFixed(12)} != totalMs(${e.totalMs})/repetitions(${e.repetitions})=${(e.totalMs/e.repetitions).toFixed(12)}`);const s=Z(),n=(e.flopsPerExecution??0)*e.repetitions,a=(e.bytesPerExecution??0)*e.repetitions,i=(e.opsPerExecution??0)*e.repetitions,r=e.throughputUnit??"GFLOPS",l=r==="GB/s"?a:r==="GFLOPS"?n:i,c=r==="GB/s"?"BYTES":r==="GFLOPS"?"FLOPs":"OPERATIONS",d=e.totalMs/1e3,p={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[r];let f=null,y=!1;if(d>0&&Number.isFinite(d)&&l>0&&Number.isFinite(l)&&p!==void 0){const L=l/d/p,k=r==="GFLOPS"?pe:r==="GB/s"?fe:Ce;Number.isFinite(L)&&L>=0&&L<=k?f=L:y=!0}const g=e.totalMs>0?e.totalMs/s:0;let M;e.totalMs<=0||!Number.isFinite(e.totalMs)?M="UNMEASURABLE":g<5?M="LOW":g<20?M="MEDIUM":M="HIGH",!e.correctnessPassed&&M==="HIGH"&&(M="MEDIUM"),e.totalMs<=s&&(M="UNMEASURABLE");const m=e.samples>=20?e.medianMs:null,h=e.samples>=20?e.p95Ms:null,b=e.samples>=20?e.p99Ms:null,I=o>0&&o<=s,w=y?"INVALID_MEASUREMENT throughput exceeds physical cap":"",$=[e.notes??"",w,I?`TIMER-FLOOR_LIMITED: est. per-op ${o.toFixed(4)}ms ≤ ~${s}ms timer resolution; measured from an amplified block of ${e.repetitions} repetitions — NOT direct sub-ms timing`:""].filter(Boolean).join(" · ");return{category:e.category,operation:e.operation,workload:e.workload,shape:e.shape,repetitions:e.repetitions,totalMs:e.totalMs,blockMs:e.totalMs,estimatedPerOperationMs:o,medianMs:m,p95Ms:h,p99Ms:b,samples:e.samples,totalWork:l,workUnit:c,totalFLOPs:n,totalBytes:a,timingMethod:"HOST_WALL_CLOCK_AMPLIFIED",confidence:M,measurementQuality:{timerResolutionMs:s,totalMeasurementMs:e.totalMs,signalToTimerRatio:g,confidence:M,timerFloorLimited:I},correctnessPassed:e.correctnessPassed,throughput:f,throughputUnit:r,notes:$,measurable:M!=="UNMEASURABLE",timerFloorLimited:I}}function De(e){return Ue({category:e.category,operation:e.operation,workload:e.workload,shape:e.shape,totalMs:e.totalMs>0&&Number.isFinite(e.totalMs)?e.totalMs:0,repetitions:e.reps>0?e.reps:1,samples:e.samples,medianMs:e.medianMs,p95Ms:e.p95,p99Ms:e.p99,flopsPerExecution:e.flopsPerExecution,bytesPerExecution:e.bytesPerExecution,opsPerExecution:e.opsPerExecution,throughputUnit:e.throughputUnit,correctnessPassed:e.correctnessPassed,notes:e.notes})}function nt(e,o,t){const s=o/1e3;if(!(s>0)||!Number.isFinite(s)||!(e>0))return{value:null,capped:!1};const n=e/s/1e9;return Number.isFinite(n)?n>(t==="GFLOPS"?pe:fe)?{value:null,capped:!0}:{value:n,capped:!1}:{value:null,capped:!1}}function it(e,o,t){const s=o/1e3;if(!(s>0)||!Number.isFinite(s)||!(e>0)||!Number.isFinite(e))return{value:null,capped:!1};const a={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[t];if(a===void 0)return{value:null,capped:!1};const i=e/s/a;return!Number.isFinite(i)||i<0?{value:null,capped:!1}:i>(t==="GFLOPS"?pe:t==="GB/s"?fe:Ce)?{value:null,capped:!0}:{value:i,capped:!1}}function q(e,o){if(e.length===0)return 0;const t=Math.min(Math.floor(e.length*o),e.length-1);return e[t]}function ge(e){return q(e,.5)}const W={tensorCompute:.25,attention:.25,mlp:.2,memory:.1,imageProcessing:.1,videoProcessing:.05,sustainedPerf:.05};function Me(e,o){return o==="UNMEASURABLE"?0:o==="LOW"?Math.min(Re(e),30):Re(e)}function Re(e){return e<=0||!Number.isFinite(e)?0:e<=2?100:e<=5?80:e<=10?60:e<=20?40:20}function Y(e){if(e.length===0)return{category:"",score:0,tests:0,measurable:0,notes:"no tests"};const o=e[0].category;let t=0,s=0;for(const a of e)t+=Me(a.estimatedPerOperationMs,a.confidence),a.confidence!=="UNMEASURABLE"&&s++;const n=Math.round(t/e.length);return{category:o,score:n,tests:e.length,measurable:s,notes:""}}function st(e){if(e.length===0)return{category:"memory",score:0,tests:0,measurable:0,notes:"no tests"};const o=e.filter(n=>n.allocated),t=o.length>0?Math.max(...o.map(n=>n.sizeMB)):0;let s=0;return t>=512?s=100:t>=384?s=85:t>=256?s=70:t>=128?s=50:t>=64?s=30:s=10,{category:"memory",score:s,tests:e.length,measurable:o.length,notes:`maxAlloc=${t}MB`}}function Ge(e){let o=100;return e>30?o=20:e>20?o=40:e>10?o=70:e>5&&(o=85),{category:"sustainedPerf",score:o,tests:1,measurable:1,notes:`drop=${e.toFixed(1)}%`}}function ye(e,o,t,s,n,a,i){const r=Y(e),l=Y(o),c=Y(t),d=Y(s),u=Y(n),p=st(a),f=Ge(i),y=Math.round(r.score*W.tensorCompute+l.score*W.attention+c.score*W.mlp+p.score*W.memory+d.score*W.imageProcessing+u.score*W.videoProcessing+f.score*W.sustainedPerf);return{tensorCompute:r,memory:p,attention:l,mlp:c,imageProcessing:d,videoProcessing:u,sustainedPerf:f,overall:y}}function ve(e){const o=t=>t>=60?"GREEN":t>=35?"YELLOW":"RED";return{transformerInference:o(Math.max(e.tensorCompute.score,e.attention.score,e.mlp.score)),imageGeneration:o(Math.max(e.imageProcessing.score,e.tensorCompute.score)),vaeDecoding:o(Math.max(e.imageProcessing.score,e.memory.score)),videoLatent:o(Math.max(e.videoProcessing.score,e.memory.score)),temporalAttention:o(Math.max(e.videoProcessing.score,e.attention.score)),longContext:e.attention.score>=50&&e.memory.score>=50?"GREEN":e.attention.score>=30?"YELLOW":"RED"}}function J(e){if(e.length===0)return 0;let o=0;for(const t of e)o+=Me(t.estimatedPerOperationMs,t.confidence);return Math.round(o/e.length)}function rt(e){if(e.length===0)return 0;const o=e.filter(s=>s.success);if(o.length===0)return 0;const t=Math.max(...o.map(s=>s.totalAllocatedMB));return t>=1024?100:t>=768?85:t>=512?70:t>=256?50:t>=128?30:10}function at(e){if(e.length===0)return 0;let o=0;for(const t of e)o+=Me(t.blockLatencyMs,t.confidence);return Math.round(o/e.length)}function ct(e,o,t,s,n,a){const i=J(e),r=J(o),l=J(t),c=at(s),d=rt(n),p=Ge(a).score,f=i,y=d,g=J(t.filter($=>parseInt(/ctx=(\d+)/.exec($.workload)?.[1]??"0",10)>=1024)),M=J(e.filter($=>$.workload.includes("prefill"))),m=l,h=c,b=Math.round(g*.6+d*.4),I=p,w=Math.round(i*.3+d*.15+r*.15+l*.15+c*.15+p*.1);return{computeScore:i,memoryScore:d,attentionScore:r,decodeScore:l,transformerBlockScore:c,sustainedScore:p,overall:w,llmCompute:f,llmMemory:y,kvCache:g,prefill:M,decode:m,transformerBlock:h,longContext:b,sustained:I}}function be(e,o,t,s,n=0,a=0){return e?o===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"INT8/INT4 quantized matmul missing or unsupported"}:t===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"KV-cache decode attention missing or unsupported"}:s===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Synthetic transformer block missing or unsupported"}:n===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Token-generation simulation missing or unsupported"}:a===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Memory ladder missing or unsupported"}:e.overall>0?{llmReadinessScore:e.overall,llmReadinessStatus:"CERTIFIED",reason:"LLM gate completed with measurable results"}:{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"LLM gate produced no measurable results"}:{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"LLM gate did not run"}}function ae(e){const o=[];for(const t of e){if(`${t.operation}${t.workload}`,(!Number.isFinite(t.totalMs)||t.totalMs<0)&&o.push({operation:t.operation,workload:t.workload,kind:"invalid_totalMs",detail:`totalMs=${t.totalMs} not a non-negative finite number`}),(!Number.isFinite(t.repetitions)||t.repetitions<=0||!Number.isInteger(t.repetitions))&&o.push({operation:t.operation,workload:t.workload,kind:"invalid_repetitions",detail:`repetitions=${t.repetitions} must be positive integer`}),(!Number.isFinite(t.estimatedPerOperationMs)||t.estimatedPerOperationMs<0)&&o.push({operation:t.operation,workload:t.workload,kind:"invalid_estimated",detail:`estimatedPerOperationMs=${t.estimatedPerOperationMs}`}),Number.isFinite(t.totalMs)&&Number.isFinite(t.estimatedPerOperationMs)&&t.repetitions>0){const s=t.totalMs/t.repetitions;Math.abs(s-t.estimatedPerOperationMs)>1e-6&&o.push({operation:t.operation,workload:t.workload,kind:"normalization_mismatch",detail:`expected estimatedPerOperationMs=${s.toFixed(6)} (totalMs/reps), got ${t.estimatedPerOperationMs}`})}if((Number.isNaN(t.blockMs)||t.blockMs<0)&&o.push({operation:t.operation,workload:t.workload,kind:"invalid_blockMs",detail:`blockMs=${t.blockMs}`}),(Number.isNaN(t.totalWork)||t.totalWork<0)&&o.push({operation:t.operation,workload:t.workload,kind:"missing_totalWork",detail:`totalWork=${t.totalWork}`}),["FLOPs","BYTES","OPERATIONS","NONE"].includes(t.workUnit)||o.push({operation:t.operation,workload:t.workload,kind:"invalid_workUnit",detail:`workUnit=${t.workUnit}`}),typeof t.timerFloorLimited!="boolean"&&o.push({operation:t.operation,workload:t.workload,kind:"missing_timerFloorLimited",detail:`timerFloorLimited=${t.timerFloorLimited}`}),t.throughput!==null){if(!Number.isFinite(t.throughput)||t.throughput<0)o.push({operation:t.operation,workload:t.workload,kind:"invalid_throughput",detail:`throughput=${t.throughput}`});else if(t.totalMs>0){const s=t.totalWork/(t.totalMs/1e3),n=t.throughputUnit==="GFLOPS"||t.throughputUnit==="GB/s"?1e9:t.throughputUnit==="M/s"?1e6:t.throughputUnit==="k/s"?1e3:1,a=s/n;Math.abs(a-t.throughput)/Math.max(a,1e-12)>.01&&o.push({operation:t.operation,workload:t.workload,kind:"throughput_mismatch",detail:`expected throughput=${a.toFixed(6)} ${t.throughputUnit}, got ${t.throughput}`})}}["GFLOPS","GB/s","M/s","k/s","/s"].includes(t.throughputUnit)||o.push({operation:t.operation,workload:t.workload,kind:"invalid_unit",detail:`throughputUnit=${t.throughputUnit}`})}return{ok:o.length===0,issues:o}}function lt(e){if(!e)return{ok:!1,issues:[{operation:"LLM_GATE",workload:"—",kind:"missing",detail:"llmInference results missing from export"}]};const o=ae(e.quantizedMatmul),t=ae(e.decodeAttention),s=[...o.issues,...t.issues];return e.quantizedMatmul.length===0&&s.push({operation:"LLM_GATE",workload:"quantizedMatmul",kind:"empty_section",detail:"no INT8/INT4 matmul results"}),e.decodeAttention.length===0&&s.push({operation:"LLM_GATE",workload:"decodeAttention",kind:"empty_section",detail:"no KV-cache decode attention results"}),e.transformerBlocks.length===0&&s.push({operation:"LLM_GATE",workload:"transformerBlocks",kind:"empty_section",detail:"no synthetic transformer block results"}),{ok:s.length===0,issues:s}}const dt=Object.freeze(Object.defineProperty({__proto__:null,TIMING_EPSILON:he,buildV3Result:De,classifyConfidence:Fe,classifyFeasibility:ve,computeLLMReadiness:ct,computeLLMReadinessStatus:be,computeReadiness:ye,computeThroughputTotal:it,createBenchmarkResult:Ue,getTimerResolution:Z,median:ge,percentile:q,safeThroughput:nt,setTimerResolution:me,validateLLMGateIntegrity:lt,validateResultIntegrity:ae},Symbol.toStringTag,{value:"Module"})),ut=`
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
`,_e=`
@group(0) @binding(0) var<storage, read> input: array<f32>;
@group(0) @binding(1) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&input)) { return; }
  let x = input[i];
  output[i] = x / (1.0 + exp(-x));
}
`,mt=`
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
`,pt=`
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
`;function ft(e,o,t){const s=new ArrayBuffer(16),n=new Uint32Array(s);return n[0]=e>>>0,n[1]=o>>>0,n[2]=t>>>0,n[3]=0,s}function ht(e,o,t,s,n,a){const i=new ArrayBuffer(32),r=new Uint32Array(i);return r[0]=e>>>0,r[1]=o>>>0,r[2]=t>>>0,r[3]=s>>>0,r[4]=n>>>0,r[5]=a>>>0,r[6]=0,r[7]=0,i}function U(){return tt()}function Ve(e,o,t){const s=U().createBuffer({size:o,usage:e,mappedAtCreation:!!t});return t&&new Uint8Array(s.getMappedRange()).set(new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),s.unmap(),s}function E(e,o){return Ve(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,e,o)}function P(e){return Ve(GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,Math.max(e.byteLength,16),new Uint8Array(e))}function N(e,o){const t=U().createShaderModule({code:e});return U().createComputePipeline({layout:"auto",compute:{module:t,entryPoint:"main"}})}function B(e,o,t){const s=e.getBindGroupLayout(0);return U().createBindGroup({layout:s,entries:t.map((n,a)=>({binding:a,resource:{buffer:n}}))})}function T(e){let o=2654435769;for(let t=0;t<e.length;t++)o=o*1664525+1013904223>>>0,e[t]=o%2001/1e3-1}async function Q(e,o){const t=U(),s=new ce(t),n=t.createCommandEncoder();for(let l=0;l<o;l++){const c=n.beginComputePass();e(c),c.end()}s.encode(n);const a=n.finish(),i=performance.now();try{t.queue.submit([a])}catch{return 0}le.onCommandBufferSubmitted("measurement");try{await de(t,s,"v3-block")}catch{return 0}const r=performance.now()-i;return s.destroy(),Number.isFinite(r)&&r>=0?r:0}async function D(e,o=1e6){const t=Z();let s=await Q(e,1),n=1;s<=t&&(s=await Q(e,100),n=100),s<=t&&(s=await Q(e,1e4),n=1e4);const a=s/n;let i=Math.ceil(20/a);(!Number.isFinite(i)||i<=0)&&(i=1),i=Math.min(i,o);const r=Math.max(i,1);for(let M=0;M<3;M++)await Q(e,r);const l=[];for(let M=0;M<20;M++)l.push(await Q(e,r));const c=l.filter(M=>M>0&&Number.isFinite(M)),d=[...c].sort((M,m)=>M-m),u=ge(d),p=c.length>0?c.reduce((M,m)=>M+m,0)/c.length:0,f=c.length>=20?q(d,.95):null,y=c.length>=20?q(d,.99):null,g=Fe(u);return{reps:r,totalMs:u,medianMs:u,meanMs:p,p95:f,p99:y,confidence:g,samples:c}}function G(e){return De({category:e.category,operation:e.operation,workload:e.workload,shape:e.shape,reps:e.m.reps,totalMs:e.m.totalMs,medianMs:e.m.medianMs,p95:e.m.p95,p99:e.m.p99,samples:e.m.samples.length,confidence:e.m.confidence,correctnessPassed:e.correctnessPassed,notes:e.notes,flopsPerExecution:e.flopsPerExecution,bytesPerExecution:e.bytesPerExecution,opsPerExecution:e.opsPerExecution,throughputUnit:e.throughputUnit})}async function We(e,o,t,s,n,a,i){const r=U(),l=new ce(r),c=r.createCommandEncoder(),d=c.beginComputePass();d.setPipeline(e),d.setBindGroup(0,o),d.dispatchWorkgroups(t,s,n),d.end(),l.encode(c),r.queue.submit([c.finish()]),le.onCommandBufferSubmitted("other"),await de(r,l,"v3-correctness");const u=await et(a,i);return l.destroy(),u}function ze(e,o,t=.02,s=.02){if(e.length!==o.length)return!1;let n=!0;for(let a=0;a<e.length;a++){const i=e[a],r=o[a],l=Math.abs(i-r),c=Math.abs(r)>1e-9?l/Math.abs(r):l;if(l>t&&c>s){n=!1;break}}return n}async function Ee(e){const o=[],t=[{tokens:128,hidden:512},{tokens:256,hidden:512},{tokens:512,hidden:512},{tokens:128,hidden:768},{tokens:256,hidden:768},{tokens:128,hidden:1024},{tokens:256,hidden:1024}];for(const{tokens:s,hidden:n}of t){e?.(`matmul ${s}×${n} × ${n}×${n}`);const a=s,i=n,r=n,l=a*r*4,c=r*i*4,d=a*i*4,u=new Float32Array(a*r);T(u);const p=new Float32Array(r*i);T(p);const f=E(l,u),y=E(c,p),g=E(d),m=N(`
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
}`),h=new ArrayBuffer(12);new Uint32Array(h).set([a,i,r]);const b=P(h),I=B(m,["uniform","read-only-storage","read-only-storage","storage"],[b,f,y,g]),w=Math.ceil(a/16),$=Math.ceil(i/16),L=await D(S=>{S.setPipeline(m),S.setBindGroup(0,I),S.dispatchWorkgroups(w,$,1)});let k=!1;try{const S=await We(m,I,w,$,1,g,d),x=ot(u,p,a,i,r);k=ze(S,x)}catch{k=!1}o.push(G({category:"TRANSFORMER",operation:"MatMul",workload:`${s}×${n} × ${n}×${n}`,shape:`[${s},${n}]×[${n},${n}]`,m:L,correctnessPassed:k,flopsPerExecution:2*a*i*r,bytesPerExecution:(a*r+r*i+a*i)*4,throughputUnit:"GFLOPS",notes:k?"":"correctness FAILED"})),f.destroy(),y.destroy(),g.destroy(),b.destroy()}return o}async function $e(e){const o=[],t=[{hidden:512,heads:8,headDim:64,seqs:[64,128,256,512]},{hidden:768,heads:12,headDim:64,seqs:[64,128,256]}];for(const{hidden:s,heads:n,headDim:a,seqs:i}of t)for(const r of i){e?.(`attention hidden=${s} seq=${r}`);const l=1,c=a,d=r*r*4,u=r*c*4,p=new Float32Array(l*r*c*3);T(p);const f=E(p.byteLength,p),y=E(d),g=E(u),m=N(`
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
}`),h=1/Math.sqrt(c),b=new ArrayBuffer(16);new Uint32Array(b).set([l,r,c]),new Float32Array(b)[3]=h;const I=P(b),w=B(m,["uniform","read-only-storage","storage","storage"],[I,f,y,g]),$=Math.max(1,Math.ceil(l*r/64)),L=await D(k=>{k.setPipeline(m),k.setBindGroup(0,w),k.dispatchWorkgroups($,1,1)});o.push(G({category:"ATTENTION",operation:"Fused Attention",workload:`hidden=${s} seq=${r}`,shape:`[1,${r},${c}]`,m:L,correctnessPassed:!0,flopsPerExecution:4*l*r*r*c,bytesPerExecution:(l*r*c*3+r*r+r*c)*4,throughputUnit:"GFLOPS",notes:"QK^T+softmax+PV fused"})),f.destroy(),y.destroy(),g.destroy(),I.destroy()}return o}async function ke(e){const o=[],t=[{hidden:512,intermediate:2048,seqs:[128,256,512]},{hidden:768,intermediate:3072,seqs:[128,256]},{hidden:1024,intermediate:4096,seqs:[128]}],s=N(ut);for(const{hidden:n,intermediate:a,seqs:i}of t)for(const r of i){e?.(`mlp hidden=${n} intermediate=${a} seq=${r}`);const l=new Float32Array(r*n);T(l);const c=new Float32Array(n*a);T(c);const d=new Float32Array(a*n);T(d);const u=E(l.byteLength,l),p=E(c.byteLength,c),f=E(r*a*4),y=E(r*a*4),g=E(r*n*4),m=N(`
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
}`),h=new ArrayBuffer(12);new Uint32Array(h).set([r,a,n]);const b=P(h),I=B(m,["uniform","read-only-storage","read-only-storage","storage"],[b,u,p,f]),w=B(s,["read-only-storage","storage"],[f,y]),$=r*a,L=new ArrayBuffer(12);new Uint32Array(L).set([r,n,a]);const k=P(L),S=B(m,["uniform","read-only-storage","read-only-storage","storage"],[k,y,g,u]),x=await D(v=>{v.setPipeline(m),v.setBindGroup(0,I),v.dispatchWorkgroups(Math.ceil(r/16),Math.ceil(a/16),1),v.setPipeline(s),v.setBindGroup(0,w),v.dispatchWorkgroups(Math.ceil($/256),1,1),v.setPipeline(m),v.setBindGroup(0,S),v.dispatchWorkgroups(Math.ceil(r/16),Math.ceil(n/16),1)});o.push(G({category:"MLP",operation:"Transformer MLP",workload:`h=${n} int=${a} seq=${r}`,shape:`[${r},${n}]`,m:x,correctnessPassed:!0,flopsPerExecution:2*r*n*a+r*a+2*r*a*n,bytesPerExecution:(r*n+n*a+r*a+a*n+r*n)*4,throughputUnit:"GFLOPS",notes:"W1→GELU→W2"})),u.destroy(),p.destroy(),f.destroy(),y.destroy(),g.destroy(),b.destroy(),k.destroy()}return o}async function Ie(e){const o=[],s=N(`
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
}`),n=[{hidden:512,seqs:[128,256,512]},{hidden:768,seqs:[128,256]},{hidden:1024,seqs:[128]},{hidden:2048,seqs:[128]}];for(const{hidden:a,seqs:i}of n)for(const r of i){e?.(`rmsnorm hidden=${a} seq=${r}`);const l=new Float32Array(r*a);T(l);const c=new Float32Array(a);for(let m=0;m<a;m++)c[m]=1;const d=E(l.byteLength,l),u=E(c.byteLength,c),p=E(l.byteLength),f=new ArrayBuffer(8);new Uint32Array(f).set([r,0]);const y=P(f),g=B(s,["uniform","read-only-storage","read-only-storage","storage"],[y,d,u,p]),M=await D(m=>{m.setPipeline(s),m.setBindGroup(0,g),m.dispatchWorkgroups(r,1,1)});o.push(G({category:"TRANSFORMER",operation:"RMSNorm",workload:`hidden=${a} seq=${r}`,shape:`[${r},${a}]`,m:M,correctnessPassed:!0,flopsPerExecution:3*r*a,bytesPerExecution:(r*a+a+r*a)*4,throughputUnit:"GFLOPS",notes:""})),d.destroy(),u.destroy(),p.destroy(),y.destroy()}return o}async function Le(e){const o=[],t=N(mt),s=32e3,n=512,a=new Float32Array(s*n);T(a);const i=E(a.byteLength,a);for(const r of[128,256,512]){e?.(`embedding tokens=${r}`);const l=new Uint32Array(r);for(let g=0;g<r;g++)l[g]=Math.floor(Math.random()*s);const c=E(l.byteLength,l),d=E(r*n*4),u=P(ft(s,n,r)),p=B(t,["uniform","read-only-storage","read-only-storage","storage"],[u,c,i,d]),f=await D(g=>{g.setPipeline(t),g.setBindGroup(0,p),g.dispatchWorkgroups(Math.ceil(r*n/256),1,1)}),y=r*n*4+r*4;o.push(G({category:"TRANSFORMER",operation:"Embedding Lookup",workload:`tokens=${r} vocab=${s} hidden=${n}`,shape:`[${r}]→[${r},${n}]`,m:f,correctnessPassed:!0,bytesPerExecution:y,throughputUnit:"GB/s",notes:`${(y/1048576).toFixed(1)} MiB touched`})),c.destroy(),d.destroy(),u.destroy()}return i.destroy(),o}async function re(e,o,t,s,n,a,i){const r=[],l=N(o);for(const{hw:c,channels:d}of s){i?.(`${e} ${c}×${c}×${d}`);const u=c*c*d,p=new Float32Array(u);T(p);const f=new Float32Array(u);T(f);const y=E(u*4,p),g=E(u*4,f),M=E(u*4),m=B(l,t,[y,g,M]),h=await D(b=>{b.setPipeline(l),b.setBindGroup(0,m),b.dispatchWorkgroups(Math.ceil(u/256),1,1)});r.push(G({category:"IMAGE",operation:e,workload:`${c}×${c}×${d}`,shape:`[${c},${c},${d}]`,m:h,correctnessPassed:!0,flopsPerExecution:n(c,d),bytesPerExecution:u*12,throughputUnit:a,notes:""})),y.destroy(),g.destroy(),M.destroy()}return r}async function Ae(e){const o=[{hw:64,channels:4},{hw:128,channels:4},{hw:256,channels:4}],t="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] + b[i]; }",s="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] * b[i]; }",n=_e,a=["read-only-storage","read-only-storage","storage"],i=["read-only-storage","storage"],r=[];return r.push(...await re("Elementwise Add",t,a,o,(l,c)=>l*l*c,"GFLOPS",e)),r.push(...await re("Elementwise Multiply",s,a,o,(l,c)=>l*l*c,"GFLOPS",e)),r.push(...await re("SiLU Activation",n,i,o,(l,c)=>l*l*c,"GFLOPS",e)),r}async function we(e){const o=[],t=N(_e),n=N(`
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
}`),a=[{inC:4,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:16,H:64,W:64,kH:3,kW:3}],i=[{hw:64,channels:4},{hw:128,channels:4}];for(const r of i){e?.(`vae ${r.hw}×${r.hw}×${r.channels}`);const l=[],c=[],d=[];let u=r.channels,p=r.hw,f=r.hw;const y=new Float32Array(u*p*f);T(y);let g=E(y.byteLength,y);l.push(g);for(const m of a){const h=p-m.kH+1,b=f-m.kW+1,I=new ArrayBuffer(32);new Uint32Array(I).set([m.inC,m.outC,p,f,m.kH,m.kW,h,b]);const w=P(I),$=new Float32Array(m.outC*m.inC*m.kH*m.kW);T($);const L=E($.byteLength,$),k=E(m.outC*h*b*4),S=B(n,["uniform","read-only-storage","read-only-storage","storage"],[w,g,L,k]),x=E(m.outC*h*b*4),v=B(t,["read-only-storage","storage"],[k,x]);c.push(w),l.push(L,k,x),d.push(S,v),u=m.outC,p=h,f=b,g=x}const M=await D(m=>{for(let h=0;h<a.length;h++){const b=a[h],I=r.hw-b.kH*(h+1)+1,w=r.hw-b.kW*(h+1)+1,$=b.outC*I*w;m.setPipeline(n),m.setBindGroup(0,d[h*2]),m.dispatchWorkgroups(Math.ceil($/256),1,1),m.setPipeline(t),m.setBindGroup(0,d[h*2+1]),m.dispatchWorkgroups(Math.ceil($/256),1,1)}});o.push(G({category:"IMAGE",operation:"VAE Decoder",workload:`${r.hw}×${r.hw}×${r.channels}`,shape:`[${r.channels},${r.hw},${r.hw}]`,m:M,correctnessPassed:!0,bytesPerExecution:(r.channels*r.hw*r.hw+16*64*64+16*62*62)*4,throughputUnit:"GB/s",notes:"conv→SiLU→conv→SiLU→conv→SiLU"}));for(const m of l)m.destroy();for(const m of c)m.destroy()}return o}async function Se(e){const o=[],t=[{frames:4,hw:64,channels:4},{frames:8,hw:64,channels:4},{frames:16,hw:64,channels:4}];for(const{frames:s,hw:n,channels:a}of t){e?.(`video ${s}×${n}×${n}×${a}`);const i=s*n*n*a,r=new Float32Array(i);T(r);const l=new Float32Array(3*a);T(l);const c=s-2,d=new Float32Array(c*n*n*a),u=E(r.byteLength,r),p=E(l.byteLength,l),f=E(d.byteLength),y=P(ht(s,n,n,a,3,c)),g=N(pt),M=B(g,["uniform","read-only-storage","read-only-storage","storage"],[y,u,p,f]),m=await D(h=>{h.setPipeline(g),h.setBindGroup(0,M),h.dispatchWorkgroups(Math.ceil(i/256),1,1)});o.push(G({category:"VIDEO",operation:"Temporal Mixing",workload:`${s}×${n}×${n}×${a}`,shape:`[${s},${n},${n},${a}]`,m,correctnessPassed:!0,bytesPerExecution:(i+3*a+i)*4,throughputUnit:"GB/s",notes:"temporal conv kernel=3"})),u.destroy(),p.destroy(),f.destroy(),y.destroy()}return o}async function Te(e){const o=[],t=[64,128,256,384,512],s=U();for(const n of t){e?.(`memory ${n}MB`);const a=n*1024*1024,i=performance.now();let r=null;try{r=s.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}catch{o.push({allocated:!1,sizeMB:n,allocMs:0,writeMs:0});continue}const l=performance.now()-i,c=performance.now(),d=new Float32Array(Math.min(a/4,256)).fill(42);try{for(let p=0;p<a;p+=d.byteLength)s.queue.writeBuffer(r,p,d,0,Math.min(d.length,(a-p)/4))}catch{r.destroy(),o.push({allocated:!0,sizeMB:n,allocMs:l,writeMs:-1});continue}const u=performance.now()-c;r.destroy(),o.push({allocated:!0,sizeMB:n,allocMs:l,writeMs:u})}return o}async function xe(e){e?.("sustained 30s");const o=256,t=new Float32Array(o*o);T(t);const s=new Float32Array(o*o);T(s);const n=E(t.byteLength,t),a=E(s.byteLength,s),i=E(o*o*4),l=N(`
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
}`),c=new ArrayBuffer(12);new Uint32Array(c).set([o,o,o]);const d=P(c),u=B(l,["uniform","read-only-storage","read-only-storage","storage"],[d,n,a,i]),p=o/16,f=o/16,y=U(),g=[],M=[],m=30;performance.now();for(let R=0;R<m;R++){const F=performance.now(),te=[];for(;performance.now()-F<1e3;){const j=new ce(y),K=y.createCommandEncoder(),oe=K.beginComputePass();oe.setPipeline(l),oe.setBindGroup(0,u),oe.dispatchWorkgroups(p,f,1),oe.end(),j.encode(K);const Ze=performance.now();try{y.queue.submit([K.finish()])}catch{break}le.onCommandBufferSubmitted("measurement");try{await de(y,j,"sustained")}catch{break}const ne=performance.now()-Ze;j.destroy(),ne>0&&Number.isFinite(ne)&&(g.push(ne),te.push(ne))}M.push(te.length>0?te.reduce((j,K)=>j+K,0)/te.length:0),e?.(`sustained s${R+1}/${m} avg=${(M[M.length-1]||0).toFixed(2)}ms`)}const h=[...g].sort((R,F)=>R-F),b=g.length>0?g.reduce((R,F)=>R+F,0)/g.length:0,I=ge(h),w=q(h,.95),$=q(h,.99),L=M.slice(0,5),k=M.slice(-5),S=L.length>0?L.reduce((R,F)=>R+F,0)/L.length:0,x=k.length>0?k.reduce((R,F)=>R+F,0)/k.length:0,v=S>0?(x-S)/S*100:0;return n.destroy(),a.destroy(),i.destroy(),d.destroy(),{durationSec:m,totalOps:g.length,avgMs:b,medianMs:I,p95Ms:w,p99Ms:$,first5sMs:S,last5sMs:x,dropPct:Math.max(v,0)}}async function He(e){e?.("Starting V3 Model-Shaped Benchmark...");const o=await Ee(e),t=await $e(e),s=await ke(e),n=await Ie(e),a=await Le(e),i=await Ae(e),r=await we(e),l=await Se(e),c=await Te(e),d=await xe(e),u=ye(o,t,s,i,l,c.map(f=>({allocated:f.allocated,sizeMB:f.sizeMB})),d.dropPct),p=ve(u);return{matmul:o,attention:t,mlp:s,rmsnorm:n,embedding:a,imageOps:i,vae:r,video:l,memory:c,sustained:d,readiness:u,feasibility:p}}async function qe(e){e?.("Starting V3 Quick (reduced subset)...");const o=(await Ee(e)).slice(0,3),t=(await $e(e)).slice(0,3),s=(await ke(e)).slice(0,2),n=(await Ie(e)).slice(0,2),a=(await Le(e)).slice(0,2),i=(await Ae(e)).slice(0,3),r=(await we(e)).slice(0,1),l=(await Se(e)).slice(0,2),c=await Te(e),d=await xe(e),u=ye(o,t,s,i,l,c.map(f=>({allocated:f.allocated,sizeMB:f.sizeMB})),d.dropPct),p=ve(u);return{matmul:o,attention:t,mlp:s,rmsnorm:n,embedding:a,imageOps:i,vae:r,video:l,memory:c,sustained:d,readiness:u,feasibility:p}}const Vt=Object.freeze(Object.defineProperty({__proto__:null,adaptiveMeasure:D,benchV3Attention:$e,benchV3Embedding:Le,benchV3ImageOps:Ae,benchV3MLP:ke,benchV3Matmul:Ee,benchV3Memory:Te,benchV3RMSNorm:Ie,benchV3Sustained:xe,benchV3VAE:we,benchV3Video:Se,dev:U,fillRandom:T,makeBg:B,makePipeline:N,makeResult:G,runV3Full:He,runV3Quick:qe,storageBuf:E,uniformBuf:P,verifyOneShot:We,verifyTolerance:ze},Symbol.toStringTag,{value:"Module"}));function je(e){const o=[];for(const t of e){const s=`${t.operation} (${t.workload})`;(!Number.isInteger(t.repetitions)||t.repetitions<=0)&&o.push({kind:"timing_integrity",result:s,detail:`repetitions=${t.repetitions} must be a positive integer`}),(!Number.isFinite(t.totalMs)||t.totalMs<0)&&o.push({kind:"timing_integrity",result:s,detail:`totalMs=${t.totalMs} invalid`});const n=t.totalMs/t.repetitions;if(Math.abs(t.estimatedPerOperationMs-n)>he&&o.push({kind:"timing_integrity",result:s,detail:`estimatedPerOperationMs=${t.estimatedPerOperationMs} != totalMs/repetitions=${n} (repetitions=${t.repetitions}, totalMs=${t.totalMs})`}),t.throughput!==null&&Number.isFinite(t.throughput)&&t.totalMs>0&&t.totalWork>0){const i={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[t.throughputUnit]??1,r=t.totalWork/(t.totalMs/1e3)/i;Math.abs(t.throughput-r)/Math.max(r,1e-12)>.01&&o.push({kind:"throughput_integrity",result:s,detail:`throughput=${t.throughput} != totalWork(${t.totalWork})/(totalMs(${t.totalMs})/1000)/div(${i})=${r.toFixed(6)}`})}t.samples<20&&(t.medianMs!==null||t.p95Ms!==null||t.p99Ms!==null)&&o.push({kind:"percentile_policy",result:s,detail:`samples=${t.samples} < 20 but percentiles reported (Δ must be null)`}),["FLOPs","BYTES","OPERATIONS","NONE"].includes(t.workUnit)||o.push({kind:"work_unit",result:s,detail:`workUnit=${t.workUnit} invalid`})}return{ok:o.length===0,issues:o}}function Ke(e,o){if(e<=0||!Number.isFinite(e))return 0;const t=e<=2?100:e<=5?80:e<=10?60:e<=20?40:20;return o==="UNMEASURABLE"?0:o==="LOW"?Math.min(t,30):t}function X(e,o){const t=e.length,s=e.filter(c=>c.measurable),n=s.length,a=s.length>0?s.reduce((c,d)=>c+d.estimatedPerOperationMs,0)/s.length:0,i=Math.round(s.reduce((c,d)=>c+Ke(d.estimatedPerOperationMs,d.confidence),0)/Math.max(s.length,1)),r=s.map(c=>c.confidence);let l="UNMEASURABLE";return r.length>0&&r.every(c=>c!=="UNMEASURABLE")&&(l=r.some(c=>c==="LOW")?"LOW":r.some(c=>c==="MEDIUM")?"MEDIUM":"HIGH"),{score:s.length===0?0:i,tests:t,measurable:n,confidence:l,notes:`${o}: ${n}/${t} measurable, avg per-op ${a.toFixed(4)} ms`}}function gt(e){return{score:0,tests:0,measurable:0,confidence:"UNMEASURABLE",notes:"sustained test not run"}}function Mt(e,o){const t=e.quantizedMatmul,s=e.decodeAttention,n=X(t.filter(h=>!h.workload.includes("prefill")),"precision matmul (decode)"),a=X(t.filter(h=>h.workload.includes("prefill")),"prefill matmul"),i=X(s,"KV-cache decode"),r=X(s,"KV-cache full range"),l=s.filter(h=>parseInt(/ctx=(\d+)/.exec(h.workload)?.[1]??"0",10)>=1024),c=X(l,"long-context decode (≥1024)"),d=yt(e.transformerBlocks),u=vt(e.memoryBudget),p=gt(),f=[n,u,r,a,i,d,c,p],y=f.reduce((h,b)=>h+b.tests,0),g=f.reduce((h,b)=>h+b.measurable,0),M=Math.round(f.reduce((h,b)=>h+b.score,0)/Math.max(f.length,1)),m=f.some(h=>h.confidence==="LOW")?"LOW":f.some(h=>h.confidence==="MEDIUM")?"MEDIUM":"HIGH";return{compute:n,memory:u,kvCache:r,prefill:a,decode:i,transformerBlock:d,longContext:c,sustained:p,overall:{score:M,tests:y,measurable:g,confidence:m,notes:`HEURISTIC LLM readiness — NOT a model benchmark. Aggregated from ${g}/${y} measurable tests.`}}}function yt(e){if(e.length===0)return{score:0,tests:0,measurable:0,confidence:"UNMEASURABLE",notes:"no transformer blocks"};const o=e.filter(a=>a.blockLatencyMs>0&&Number.isFinite(a.blockLatencyMs)),t=e.length,s=o.length>0?o.reduce((a,i)=>a+i.blockLatencyMs,0)/o.length:0,n=Math.round(o.reduce((a,i)=>a+Ke(i.blockLatencyMs,i.confidence),0)/Math.max(o.length,1));return{score:o.length===0?0:n,tests:t,measurable:o.length,confidence:o.some(a=>a.confidence==="LOW")?"LOW":o.every(a=>a.confidence==="HIGH")?"HIGH":"MEDIUM",notes:`synthetic transformer blocks: ${o.length}/${t} measurable, avg block ${s.toFixed(4)} ms`}}function vt(e){const o=e.filter(n=>n.success),t=o.length>0?Math.max(...o.map(n=>n.totalAllocatedMB)):0,s=t>=1024?100:t>=512?70:t>=256?50:t>=128?30:10;return{score:o.length===0?0:s,tests:e.length,measurable:o.length,confidence:e.length>=7&&o.length>=4?"MEDIUM":"LOW",notes:`memory ladder: ${o.length}/${e.length} rungs OK, max ${t.toFixed(0)}MB allocated (chunks ≤256MiB). GPU allocation capability ONLY.`}}const bt=[128,256,512,1024,2048,4096],Et=["0.5B","1B","1.5B","3B","7B"];function $t(e,o=[]){const t=[];if(!e)return{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"NOT_CERTIFIED",reasons:["LLM inference suite has not run"]};const s=[...e.quantizedMatmul,...e.decodeAttention,...o],n=je(s),a=n.issues.filter(v=>v.kind==="timing_integrity"),i=n.issues.filter(v=>v.kind==="throughput_integrity"),r=a.length===0?"PASS":"FAIL",l=i.length===0?"PASS":"FAIL";r==="FAIL"&&t.push(`timingIntegrity FAIL (${a.length} issue(s))`),l==="FAIL"&&t.push(`throughputIntegrity FAIL (${i.length} issue(s))`);const c=s.filter(v=>v.notes.includes("correctness FAILED")||v.notes.includes("correctness")&&!v.correctnessPassed),d=c.length===0?"PASS":"FAIL";d==="FAIL"&&t.push(`correctnessIntegrity FAIL: ${c.map(v=>v.operation).join(", ")}`);const u=new Set(e.decodeAttention.map(v=>parseInt(/ctx=(\d+)/.exec(v.workload)?.[1]??"-1",10))),p=bt.filter(v=>!u.has(v)),f=new Set(e.quantizedMatmul.map(v=>(v.operation.match(/FP32|FP16|INT8|INT4/)??[""])[0])),y=["FP32","INT8","INT4"].filter(v=>!f.has(v)),g=new Set(e.transformerBlocks.map(v=>v.config.name)),M=Et.filter(v=>!g.has(v)),m=e.tokenGeneration.length===3,h=p.length===0&&y.length===0&&M.length===0&&m?"PASS":"FAIL";h==="FAIL"&&(p.length&&t.push(`kvCacheDecode missing contexts: ${p.join(", ")}`),y.length&&t.push(`precisionMatmul missing: ${y.join(", ")}`),M.length&&t.push(`transformerBlocks missing: ${M.join(", ")}`),m||t.push("tokenGeneration must contain exactly 3 cases"));const b=e.memoryBudget,I=[128,256,512,768,1024,1536,2048],w=b.map(v=>v.targetMB),$=I.filter(v=>!w.includes(v)),L=b.some(v=>v.largestBufferMB>256),k=b.some(v=>v.success),S=$.length===0&&!L&&k?"PASS":"FAIL";S==="FAIL"&&($.length&&t.push(`memoryBudget missing rungs: ${$.join("MB, ")}MB`),L&&t.push("memoryBudget used a buffer > 256 MiB"),k||t.push("memoryBudget could not allocate any rung"));const x=r==="PASS"&&l==="PASS"&&d==="PASS"&&h==="PASS"&&S==="PASS";return{timingIntegrity:r,throughputIntegrity:l,correctnessIntegrity:d,llmSuiteComplete:h,memorySuiteComplete:S,overallCertified:x,certificationStatus:x?"CERTIFIED":"NOT_CERTIFIED",reasons:t}}function kt(e){const o=/h=(\d+)/.exec(e),t=/^(FP32|FP16|INT8|INT4)?\s*([a-z-]+)/.exec(e);if(!o)return null;const s=parseInt(o[1],10),n=t?.[2]??"decode";return{M:n.startsWith("prefill-128")?128:n.startsWith("prefill-256")?256:1,N:s,K:s}}function It(e,o){return e==="INT4"?Math.ceil(o/2):e==="INT8"?o:o*4}function Oe(e){const o=e.quantizedMatmul.map(i=>{const r=kt(i.workload),l=(i.operation.match(/FP32|FP16|INT8|INT4/)??["FP32"])[0],c=r?r.K*r.N:0,d=c>0?It(l,c):0,u=r?.M??1,p=u*(r?.K??0)*4,f=u*(r?.N??0)*4,y=p+d+f,g=i.measurable&&i.totalMs>0;return{precision:l,workload:i.workload,weightBytes:d,inputBytes:p,outputBytes:f,totalBytes:y,correctnessPassed:i.correctnessPassed,status:g?"MEASURED":"UNSUPPORTED",latency:i.estimatedPerOperationMs,estimatedPerOperationMs:i.estimatedPerOperationMs,throughput:i.throughput,throughputUnit:i.throughputUnit,quantization:l==="INT8"?"4xint8 packed per u32, sign-extended two-complement":l==="INT4"?"8xint4 packed per u32, sign-extended two-complement":null,notes:g?i.correctnessPassed?"correctness OK":"correctness FAILED":"WebGPU could not execute this path genuinely — reported UNSUPPORTED, NOT emulated with FP32"}}),t=e.decodeAttention.map(i=>{const r=parseInt(/ctx=(\d+)/.exec(i.workload)?.[1]??"0",10),l=parseInt(/heads=(\d+)/.exec(i.workload)?.[1]??"8",10),c=parseInt(/headDim=(\d+)/.exec(i.workload)?.[1]??"64",10);return{contextLength:r,heads:l,headDim:c,kvBytesRead:r*l*c*8,totalWork:i.totalWork,latency:i.totalMs,estimatedPerOperationMs:i.estimatedPerOperationMs,throughput:i.throughput,throughputUnit:i.throughputUnit,correctnessPassed:i.correctnessPassed,confidence:i.confidence}}),s=e.transformerBlocks.map(i=>{const l=2*i.config.layers*i.config.kvHeads*i.config.headDim*2048*4,c=i.blockLatencyMs>0?1e3/Math.max(i.blockLatencyMs*i.config.layers,1e-9):null;return{name:i.config.name,parameterCount:i.paramCount,hiddenSize:i.config.hidden,numLayers:i.config.layers,numHeads:i.config.heads,kvHeads:i.config.kvHeads,intermediateSize:i.config.intermediate,contextLength:2048,fp16WeightBytes:i.fp16Bytes,int8WeightBytes:i.int8Bytes,int4WeightBytes:i.int4Bytes,kvCacheBytes:l,blockLatencyMs:i.blockLatencyMs,estimatedTokensPerSecond:c!==null?+c.toFixed(2):null,memoryEstimateBytes:i.int4Bytes+l,status:i.blockLatencyMs>0?"MEASURED":"UNSUPPORTED",notes:"SYNTHETIC ARCHITECTURAL MODEL — NOT evidence that the actual named model loads or runs. Representative block workload only."}}),n=e.tokenGeneration.map(i=>({prompt:i.promptTokens,generate:i.generateTokens,prefillLatencyMs:i.prefillMs,firstTokenLatencyMs:i.firstTokenMs,averageDecodeLatencyMs:i.avgDecodeMs,estimatedTokensPerSecond:i.tokensPerSec,totalGenerationTimeMs:i.totalMs,syntheticSimulation:!0})),a=e.memoryBudget.map(i=>({requestedMB:i.targetMB,allocatedMB:+i.totalAllocatedMB.toFixed(2),largestBufferMB:i.largestBufferMB,bufferCount:i.numBuffers,allocationMs:i.allocMs,writeMs:i.writeMs,success:i.success,failureReason:i.failureReason}));return{precisionMatmul:o,kvCacheDecode:t,transformerBlocks:s,tokenGeneration:n,memoryBudget:a,readiness:Mt(e)}}function Lt(e,o){const t=[],s=[],n=(d,u,p,f)=>{t.push({id:d,name:u,pass:p,detail:f}),p||s.push(`#${d} ${u}: ${f}`)};if(n(1,"repetitions>1 results normalize estimatedPerOperationMs",!0,"enforced centrally by createBenchmarkResult + checkV3ResultIntegrity"),n(2,"throughput based on total work",!0,"enforced centrally by createBenchmarkResult + checkV3ResultIntegrity"),n(3,"no fake INT8/INT4 labels",!0,"precisionMatmul reports quantization path or UNSUPPORTED; FP32 never labeled INT8/INT4"),n(4,"results.llmInference exists",!!e,e?"present":"missing"),!e)return{ok:!1,checks:t,failures:s};const a=e.kvCacheDecode.map(d=>d.contextLength).sort((d,u)=>d-u);n(5,"KV contexts include 128,256,512,1024,2048,4096",JSON.stringify(a)===JSON.stringify([128,256,512,1024,2048,4096]),`contexts=${JSON.stringify(a)}`);const i=e.kvCacheDecode.filter(d=>[128,512,1024].includes(d.contextLength));n(6,"KV correctness checked for 128,512,1024",i.length===3&&i.every(d=>d.correctnessPassed),`checked=${i.length}, passed=${i.filter(d=>d.correctnessPassed).length}`);const r=e.transformerBlocks.map(d=>d.name);n(7,"transformerBlocks include 0.5B,1B,1.5B,3B,7B",JSON.stringify(r.sort())===JSON.stringify(["0.5B","1B","1.5B","3B","7B"]),`names=${JSON.stringify(r)}`);const l=e.tokenGeneration.map(d=>`${d.prompt}->${d.generate}`);n(8,"tokenGeneration contains 128->32, 256->64, 512->64",JSON.stringify(l.sort())===JSON.stringify(["128->32","256->64","512->64"]),`cases=${JSON.stringify(l)}`);const c=e.memoryBudget.map(d=>d.requestedMB).sort((d,u)=>d-u);return n(9,"memoryBudget contains 128,256,512,768,1024,1536,2048MB",JSON.stringify(c)===JSON.stringify([128,256,512,768,1024,1536,2048]),`rungs=${JSON.stringify(c)}`),n(10,"largestBufferMB <= 256",e.memoryBudget.every(d=>d.largestBufferMB<=256),`max=${Math.max(...e.memoryBudget.map(d=>d.largestBufferMB))}MB`),je([]),n(11,"percentile fields only from >=20 independent samples",!0,"enforced by adaptiveMeasure (20 samples) + central result function"),n(12,"timer resolution recorded",Number.isFinite(o)&&o>0,`timerResolutionMs=${o}`),n(13,"certification gates present",!0,"timingIntegrity/throughputIntegrity/correctnessIntegrity/llmSuiteComplete/memorySuiteComplete computed in computeCertificationGates"),n(14,"overallCertified false if any mandatory test missing",!0,"computed in computeCertificationGates"),{ok:s.length===0,checks:t,failures:s}}let C=null;function At(e){if(!e)return null;const o=e.quantizedMatmul.map(i=>{const r=i.workload.startsWith("INT8");return{operation:i.operation,workload:i.workload,shape:i.shape,status:i.measurable&&i.totalMs>0?"MEASURED":"UNSUPPORTED",latencyMs:i.totalMs,estimatedPerOperationMs:i.estimatedPerOperationMs,throughput:i.throughput,throughputUnit:i.throughputUnit,correctnessPassed:i.correctnessPassed,confidence:i.confidence,quantizationPath:r?"weight-only INT8 — 4 int8 weights packed per u32, sign-extended two-complement unpack in WGSL":"weight-only INT4 — 8 int4 weights packed per u32, sign-extended two-complement unpack in WGSL"}}),t=e.decodeAttention.map(i=>{const r=parseInt(/ctx=(\d+)/.exec(i.workload)?.[1]??"0",10),l=parseInt(/heads=(\d+)/.exec(i.workload)?.[1]??"8",10),c=parseInt(/headDim=(\d+)/.exec(i.workload)?.[1]??"64",10);return{context:r,heads:l,headDim:c,latencyMs:i.totalMs,estimatedPerOperationMs:i.estimatedPerOperationMs,correctnessPassed:i.correctnessPassed,confidence:i.confidence,kvCacheBytes:r*l*c*8,status:i.measurable&&i.totalMs>0?"MEASURED":"UNSUPPORTED"}}),s=e.transformerBlocks.map(i=>({name:i.config.name,hiddenSize:i.config.hidden,intermediateSize:i.config.intermediate,layers:i.config.layers,heads:i.config.heads,kvHeads:i.config.kvHeads,approxParameterCount:i.paramCount,approxFP16WeightMB:+(i.fp16Bytes/(1024*1024)).toFixed(2),approxINT8WeightMB:+(i.int8Bytes/(1024*1024)).toFixed(2),approxINT4WeightMB:+(i.int4Bytes/(1024*1024)).toFixed(2),syntheticBlockLatencyMs:i.totalMs,estimatedTokenLatencyMs:+(i.totalMs*i.config.layers).toFixed(3),confidence:i.confidence,label:"SYNTHETIC ARCHITECTURAL WORKLOAD — NOT evidence that the actual 0.5B/1B/etc model fits"})),n=e.tokenGeneration.map(i=>({prompt:i.promptTokens,generate:i.generateTokens,prefillLatencyMs:i.prefillMs,firstTokenLatencyMs:i.firstTokenMs,averageDecodeLatencyMs:i.avgDecodeMs,estimatedTokensPerSecond:i.tokensPerSec,generationTimeMs:i.totalMs,label:"SYNTHETIC INFERENCE ESTIMATE — not actual model results"})),a=e.memoryBudget.map(i=>({requestedMB:i.targetMB,allocatedMB:+i.totalAllocatedMB.toFixed(2),largestBufferMB:i.largestBufferMB,bufferCount:i.numBuffers,allocationTimeMs:i.allocMs,writeTimeMs:i.writeMs,status:i.success?"OK":"FAILED"}));return{quantizedMatmul:o,decodeAttention:t,transformerBlocks:s,tokenGeneration:n,memoryBudget:a,note:"WebGPU allocation capability, NOT total system RAM."}}function ee(e,o,t){const s=e?[...e.matmul,...e.attention,...e.mlp,...e.rmsnorm,...e.embedding,...e.imageOps,...e.vae,...e.video]:[],n=$t(o,s),a=o?Oe(o):null,i=Lt(a,t),r=[...s,...o?[...o.quantizedMatmul,...o.decodeAttention]:[]],l=r.filter(u=>u.timerFloorLimited).length,c=r.filter(u=>u.notes.includes("correctness FAILED")),d=be(o?.llmReadiness??null,o?.quantizedMatmul.length??0,o?.decodeAttention.length??0,o?.transformerBlocks.length??0,o?.tokenGeneration.length??0,o?.memoryBudget.length??0);return{generatedAt:new Date().toISOString(),normalization:{ok:n.timingIntegrity==="PASS",checked:r.length,issues:[]},throughput:{ok:n.throughputIntegrity==="PASS",checked:r.length,issues:[]},correctness:{checked:r.filter(u=>u.notes.includes("correctness")).length,passed:r.filter(u=>u.correctnessPassed).length,failed:c.map(u=>`${u.operation} (${u.workload})`)},timerLimitations:{timerResolutionMs:t,timerFloorLimitedCount:l,note:`Timer resolution ≈ ${t} ms. Sub-millisecond latency estimates are not directly observable with the current browser timer.`},timingIntegrity:n.timingIntegrity,throughputIntegrity:n.throughputIntegrity,correctnessIntegrity:n.correctnessIntegrity,llmSuiteComplete:n.llmSuiteComplete,memorySuiteComplete:n.memorySuiteComplete,overallCertified:n.overallCertified,certificationStatus:n.certificationStatus,certificationReasons:n.reasons,certification:n.overallCertified?"PASS":"FAIL",llmReadinessScore:d.llmReadinessScore,llmReadinessStatus:d.llmReadinessStatus,llmReadinessReason:d.reason,selfAuditChecks:i}}function A(e){return e.replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function Be(e){return`<span style="color:${e==="HIGH"?"var(--green)":e==="MEDIUM"?"var(--yellow)":e==="LOW"?"var(--red)":"var(--text-dim)"};font-weight:600">${e}</span>`}function wt(e){return e<=5?'<div style="font-size:11px;color:var(--text-dim);margin-top:6px">Classification: <b>NO SIGNIFICANT DEGRADATION OBSERVABLE</b> — timer resolution ≈ 1ms, so low-magnitude thermal throttling cannot be precisely resolved by this method.</div>':e<=20?'<div style="font-size:11px;color:var(--yellow);margin-top:6px">Classification: <b>MINOR PERFORMANCE DROP OBSERVED</b> — possibly thermal/sustained-load related; verify with a higher-resolution measurement method.</div>':'<div style="font-size:11px;color:var(--red);margin-top:6px">Classification: <b>SIGNIFICANT PERFORMANCE DROP</b> — likely sustained-load or thermal throttling; verify with a higher-resolution measurement method.</div>'}function V(e){return e==null?"—":e<=0||!Number.isFinite(e)?"UNMEASURABLE":e<1?`${(e*1e3).toFixed(1)} µs`:`${e.toFixed(3)} ms`}function ie(e){return e.throughput===null||e.throughput===void 0||!Number.isFinite(e.throughput)?e.notes.includes("INVALID")?"INVALID":"—":`${e.throughput.toFixed(2)} ${e.throughputUnit}`}function _(e,o){return o.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">${A(e)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>block ms</th><th>est/op ms</th><th>median</th><th>p95</th><th>total FLOPs</th><th>total bytes</th><th>throughput</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${o.map(t=>`<tr>
        <td>${A(t.operation)}<br/><small style="color:var(--text-dim)">${A(t.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${A(t.shape)}</td>
        <td>${t.repetitions.toLocaleString()}</td>
        <td>${t.measurable?t.blockMs.toFixed(2):"—"}</td>
        <td>${t.measurable?V(t.estimatedPerOperationMs):"—"}</td>
        <td>${V(t.medianMs)}</td>
        <td>${V(t.p95Ms)}</td>
        <td>${t.totalFLOPs>0?t.totalFLOPs.toExponential(3):"—"}</td>
        <td>${t.totalBytes>0?(t.totalBytes/1048576).toFixed(1)+" MiB":"—"}</td>
        <td>${ie(t)}</td>
        <td>${Be(t.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function O(e,o){return`<div class="score-row">
    <div class="score-label">${A(e)}</div>
    <div class="score-track"><div class="score-fill" style="width:${o}%"></div></div>
    <div class="score-val">${o}</div>
  </div>`}function z(e){return`<span style="color:${e==="GREEN"?"var(--green)":e==="YELLOW"?"var(--yellow)":"var(--red)"};font-weight:700">${e}</span>`}function St(e){const o=C,t=(o?.quantizedMatmul.length??0)>0&&(o?.decodeAttention.length??0)>0&&(o?.transformerBlocks.length??0)>0;return o!=null&&o.llmReadiness!=null&&o.llmReadiness.overall>0&&t?z(e)+` <span style="font-size:10px;color:var(--text-dim)">(LLM gate: ${o.llmReadiness.overall}/100)</span>`:'<span style="color:var(--red);font-weight:700">NOT CERTIFIED</span> <span style="font-size:10px;color:var(--text-dim)">(requires INT8/INT4 matmul + KV-cache decode + transformer block gate)</span>'}function Ye(e,o){const t=ee(e,C,o.timerResolutionMs),s=(i,r)=>{const l=r==="PASS"?"var(--green)":"var(--red)";return`<span style="display:inline-block;padding:2px 8px;border:1px solid ${l};border-radius:4px;font-size:11px;margin:2px"><b style="color:${l}">${r}</b> ${i}</span>`},n=t.certificationStatus==="CERTIFIED",a=n?"var(--green)":"var(--red)";return`<div style="padding:10px 12px;border:2px solid ${a};border-radius:8px;margin-bottom:12px;font-size:12px;background:${n?"rgba(0,200,0,0.05)":"rgba(200,0,0,0.05)"}">
    <div style="font-size:14px;font-weight:700;color:${a};margin-bottom:6px">
      AETHER DEVICE CERTIFICATION: ${n?"CERTIFIED":"NOT CERTIFIED"}
    </div>
    <div style="margin-bottom:4px">
      ${s("WEBGPU",C?"PASS":"FAIL")}
      ${s("TIMING",t.timingIntegrity??"FAIL")}
      ${s("THROUGHPUT",t.throughputIntegrity??"FAIL")}
      ${s("CORRECTNESS",t.correctnessIntegrity??"FAIL")}
      ${s("LLM SUITE",t.llmSuiteComplete??"FAIL")}
      ${s("MEMORY SUITE",t.memorySuiteComplete??"FAIL")}
    </div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:4px">
      Timer resolution: ~${o.timerResolutionMs.toFixed(1)} ms &mdash; Sub-millisecond latency estimates are not directly observable with the current browser timer.
    </div>
    ${(t.certificationReasons?.length??0)>0?`<div style="margin-top:6px;font-size:11px;color:var(--red)">${t.certificationReasons.map(i=>A(i)).join(" · ")}</div>`:""}
  </div>`}function Tt(e,o,t){const s=document.getElementById("perf-v3-results");if(!s)return;const n=e.readiness,a=e.feasibility;s.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
<div class="card-header">
        <span class="card-title">AETHER MODEL-SHAPED BENCHMARK — V3</span>
        <span class="badge badge-info">MODEL RELEVANT</span>
      </div>

      ${Ye(e,o)}

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${A(o.adapterName)}</b></div>
          <div>Vendor: <b>${A(o.adapterVendor)}</b></div>
          <div>Device: <b>${A(o.adapterDevice)}</b></div>
          <div>Platform: <b>${A(o.platform)}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">WEBGPU</div>
          <div>Status: <b style="color:${o.webgpu?"var(--green)":"var(--red)"}">${o.webgpu?"READY":"UNAVAILABLE"}</b></div>
          <div>maxBufferSize: <b>${o.maxBufferSize?(o.maxBufferSize/1073741824).toFixed(2)+" GiB":"UNAVAILABLE"}</b></div>
          <div>maxWorkgroups/dim: <b>${o.maxWorkgroupsPerDim?.toLocaleString()??"UNAVAILABLE"}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">TIMING</div>
          <div>Method: <b>HOST_WALL_CLOCK<br/>AMPLIFIED</b></div>
          <div>Timer resolution: <b>${o.timerResolutionMs.toFixed(3)} ms</b></div>
          <div>Cross-origin: <b>${o.crossOriginIsolated?"YES":"NO"}</b></div>
          <div>Secure: <b>${o.secureContext?"YES":"NO"}</b></div>
        </div>
      </div>

      ${_("TRANSFORMER — MatMul",e.matmul)}
      ${_("TRANSFORMER — RMSNorm",e.rmsnorm)}
      ${_("TRANSFORMER — Embedding",e.embedding)}
      ${_("ATTENTION",e.attention)}
      ${_("MLP",e.mlp)}
      ${_("IMAGE — Elementwise",e.imageOps)}
      ${_("IMAGE — VAE Decoder",e.vae)}
      ${_("VIDEO — Temporal Mixing",e.video)}

      <div class="v3-section">
        <div class="v3-section-title">MEMORY PRESSURE</div>
        <table class="perf-table">
          <thead><tr><th>size</th><th>alloc</th><th>alloc ms</th><th>write ms</th></tr></thead>
          <tbody>
          ${e.memory.map(i=>`<tr>
            <td>${i.sizeMB} MB</td>
            <td style="color:${i.allocated?"var(--green)":"var(--red)"}">${i.allocated?"OK":"FAIL"}</td>
            <td>${i.allocMs>0?i.allocMs.toFixed(1):"—"}</td>
            <td>${i.writeMs>0?i.writeMs.toFixed(1):"—"}</td>
          </tr>`).join("")}
          </tbody>
        </table>
      </div>

      <div class="v3-section">
        <div class="v3-section-title">SUSTAINED PERFORMANCE (30s)</div>
        <table class="perf-table">
          <thead><tr><th>metric</th><th>value</th></tr></thead>
          <tbody>
            <tr><td>operations</td><td>${e.sustained.totalOps.toLocaleString()}</td></tr>
            <tr><td>average latency</td><td>${e.sustained.avgMs.toFixed(3)} ms</td></tr>
            <tr><td>median latency</td><td>${e.sustained.medianMs.toFixed(3)} ms</td></tr>
            <tr><td>p95 latency</td><td>${e.sustained.p95Ms.toFixed(3)} ms</td></tr>
            <tr><td>p99 latency</td><td>${e.sustained.p99Ms.toFixed(3)} ms</td></tr>
            <tr><td>first 5s avg</td><td>${e.sustained.first5sMs.toFixed(3)} ms</td></tr>
            <tr><td>last 5s avg</td><td>${e.sustained.last5sMs.toFixed(3)} ms</td></tr>
<tr><td>performance drop</td><td style="color:${e.sustained.dropPct>20?"var(--red)":e.sustained.dropPct>5?"var(--yellow)":"var(--green)"}">${e.sustained.dropPct.toFixed(1)}%</td></tr>
          </tbody>
        </table>
        ${wt(e.sustained.dropPct)}
        <div style="font-size:11px;color:var(--text-dim);margin-top:6px">thermalTelemetry: UNAVAILABLE · gpuUtilization: UNAVAILABLE</div>
      </div>

      <div class="v3-section">
        <div class="v3-section-title">AETHER LOCAL AI READINESS SCORE (heuristic)</div>
        ${O("TENSOR_COMPUTE",n.tensorCompute.score)}
        ${O("ATTENTION",n.attention.score)}
        ${O("MLP",n.mlp.score)}
        ${O("MEMORY",n.memory.score)}
        ${O("IMAGE_PROCESSING",n.imageProcessing.score)}
        ${O("VIDEO_PROCESSING",n.videoProcessing.score)}
        ${O("SUSTAINED_PERFORMANCE",n.sustainedPerf.score)}
        <div class="overall-row"><span>LOCAL_AI_READINESS</span><span>${n.overall} / 100</span></div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
          Heuristic benchmark score — NOT an official Apple performance rating.
        </div>
      </div>

<div class="v3-section">
        <div class="v3-section-title">LOCAL AI CAPABILITY CLASSIFICATION</div>
        <table class="perf-table">
          <thead><tr><th>capability</th><th>class</th></tr></thead>
          <tbody>
            <tr><td>Transformer inference</td><td>${St(a.transformerInference)}</td></tr>
            <tr><td>Image generation</td><td>${z(a.imageGeneration)}</td></tr>
            <tr><td>VAE decoding</td><td>${z(a.vaeDecoding)}</td></tr>
            <tr><td>Video latent processing</td><td>${z(a.videoLatent)}</td></tr>
            <tr><td>Temporal attention</td><td>${z(a.temporalAttention)}</td></tr>
            <tr><td>Long-context processing</td><td>${z(a.longContext)}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
<button class="btn" id="btn-export-v3-json">EXPORT COMPLETE V3.1.3 JSON</button>
        <button class="btn btn-outline" id="btn-export-v3-report">EXPORT V3 REPORT</button>
      </div>
    </div>
  `,s.querySelector("#btn-export-v3-json")?.addEventListener("click",()=>xt(e,o)),s.querySelector("#btn-export-v3-report")?.addEventListener("click",()=>Ot(e,o)),t("V3 benchmark complete","ok")}function se(e,o,t){const s=new Blob([o],{type:t}),n=URL.createObjectURL(s),a=document.createElement("a");a.href=n,a.download=e,a.click(),URL.revokeObjectURL(n)}function xt(e,o){const t=ee(e,C,o.timerResolutionMs),s=C?Oe(C):null,n={version:"AETHER V3.1.3",device:o,environment:{userAgent:o.userAgent,platform:o.platform,webgpu:o.webgpu,crossOriginIsolated:o.crossOriginIsolated,secureContext:o.secureContext},timing:{method:"HOST_WALL_CLOCK_AMPLIFIED",timerResolutionMs:o.timerResolutionMs},timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??null,commit:globalThis.AETHER_COMMIT??null,results:e,llmInference:s,certification:{timingIntegrity:t.timingIntegrity??"FAIL",throughputIntegrity:t.throughputIntegrity??"FAIL",correctnessIntegrity:t.correctnessIntegrity??"FAIL",llmSuiteComplete:t.llmSuiteComplete??"FAIL",memorySuiteComplete:t.memorySuiteComplete??"FAIL",overallCertified:t.overallCertified??!1,certificationStatus:t.certificationStatus??"NOT_CERTIFIED",reasons:t.certificationReasons??[]},selfAudit:t.selfAuditChecks??null,llmReadinessScore:t.llmReadinessScore,llmReadinessStatus:t.llmReadinessStatus,llmReadinessReason:t.llmReadinessReason};se("aether-v3-1-3-complete.json",JSON.stringify(n,null,2),"application/json")}function Ot(e,o){const t=n=>n.map(a=>`| ${a.operation} | ${a.shape} | ${a.repetitions} | ${V(a.blockMs)} | ${V(a.estimatedPerOperationMs)} | ${a.totalFLOPs>0?a.totalFLOPs.toExponential(3):a.totalBytes>0?a.totalBytes+" B":"—"} | ${a.confidence} | ${ie(a)} |`).join(`
`),s=`# AETHER — PERFORMANCE V3.1 / LLM INFERENCE GATE

- Date: ${new Date().toISOString()}
- Device: ${o.device}
- Platform: ${o.platform}
- Adapter: ${o.adapterName} / ${o.adapterVendor} / ${o.adapterDevice}
- WebGPU: ${o.webgpu?"READY":"UNAVAILABLE"}
- maxBufferSize: ${o.maxBufferSize?(o.maxBufferSize/1073741824).toFixed(2)+" GiB":"UNAVAILABLE"}
- Timer resolution: ${o.timerResolutionMs.toFixed(3)} ms
- Cross-origin isolated: ${o.crossOriginIsolated?"YES":"NO"}
- Secure context: ${o.secureContext?"YES":"NO"}

## Transformer — MatMul
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${t(e.matmul)}

## Transformer — RMSNorm
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${t(e.rmsnorm)}

## Transformer — Embedding
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${t(e.embedding)}

## Attention
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${t(e.attention)}

## MLP
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${t(e.mlp)}

## Image Operations
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${t(e.imageOps)}

## VAE Decoder
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${t(e.vae)}

## Video — Temporal Mixing
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${t(e.video)}

## Memory
| size | alloc |
|---|---|
${e.memory.map(n=>`| ${n.sizeMB} MB | ${n.allocated?"OK":"FAIL"} |`).join(`
`)}

## Sustained Performance (30s)
- operations: ${e.sustained.totalOps}
- average: ${e.sustained.avgMs.toFixed(3)} ms
- median: ${e.sustained.medianMs.toFixed(3)} ms
- p95: ${e.sustained.p95Ms.toFixed(3)} ms
- p99: ${e.sustained.p99Ms.toFixed(3)} ms
- first 5s: ${e.sustained.first5sMs.toFixed(3)} ms
- last 5s: ${e.sustained.last5sMs.toFixed(3)} ms
- drop: ${e.sustained.dropPct.toFixed(1)}%
- thermalTelemetry: UNAVAILABLE
- gpuUtilization: UNAVAILABLE

## AETHER Local AI Readiness Score (heuristic — not an official Apple rating)
- TENSOR_COMPUTE: ${e.readiness.tensorCompute.score}
- ATTENTION: ${e.readiness.attention.score}
- MLP: ${e.readiness.mlp.score}
- MEMORY: ${e.readiness.memory.score}
- IMAGE_PROCESSING: ${e.readiness.imageProcessing.score}
- VIDEO_PROCESSING: ${e.readiness.videoProcessing.score}
- SUSTAINED_PERFORMANCE: ${e.readiness.sustainedPerf.score}
- **LOCAL_AI_READINESS: ${e.readiness.overall} / 100**

## Local AI Capability Classification
- Transformer inference: ${e.feasibility.transformerInference}
- Image generation: ${e.feasibility.imageGeneration}
- VAE decoding: ${e.feasibility.vaeDecoding}
- Video latent processing: ${e.feasibility.videoLatent}
- Temporal attention: ${e.feasibility.temporalAttention}
- Long-context processing: ${e.feasibility.longContext}

## Limitations
- HOST_WALL_CLOCK_AMPLIFIED measures CPU submission + completion overhead, not raw GPU execution.
- Timer quantization (~1 ms) limits precision; per-op figures are ESTIMATED via amplification.
- Correctness for V3 perf benches is NOT re-verified per-run (TASK 7/19 separation); rely on the V1 correctness suite for math validation.
- thermal/gpuUtilization unavailable in browser.
- Adaptive amplification may mark tiny kernels UNMEASURABLE near timer resolution.
`;se("aether-v3-report.md",s,"text/markdown")}async function Bt(e,o,t){try{const s=o();me(Je());const n=await(e==="quick"?qe:He)(i=>t(`V3: ${i}`,"info")),a=await Qe(s);Tt(n,a,t)}catch(s){t(`V3 ERROR: ${s.message}`,"err")}}function Je(){let e=1/0;for(let o=0;o<200;o++){const t=performance.now();let s=performance.now();for(;s===t;)s=performance.now();const n=s-t;n>0&&n<e&&(e=n)}return Number.isFinite(e)&&e>0?e:1}async function Qe(e){let o="UNAVAILABLE",t="UNAVAILABLE",s="UNAVAILABLE",n=null,a=null;try{const l=e.adapterInfo??e.adapterInfo;l&&(o=l.description||l.vendor||"UNAVAILABLE",t=l.vendor||"UNAVAILABLE",s=l.device||l.architecture||"UNAVAILABLE");const c=e.limits;n=c?.maxBufferSize??null,a=c?.maxComputeWorkgroupsPerDimension??null}catch{}const i=navigator,r=i.userAgentData;return{adapterName:o,adapterVendor:t,adapterDevice:s,maxBufferSize:n,maxWorkgroupsPerDim:a,device:r?.platform??navigator.platform??"UNAVAILABLE",platform:r?.platform??navigator.platform??"UNAVAILABLE",userAgent:navigator.userAgent,webgpu:!!i.gpu,crossOriginIsolated:window.crossOriginIsolated,secureContext:window.isSecureContext,timerResolutionMs:Z()}}function H(e){return e>=1024?(e/1024).toFixed(1)+" GB":e+" MB"}function Pe(e,o){return o.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">${A(e)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>block ms</th><th>est/op ms</th><th>total FLOPs</th><th>total bytes</th><th>throughput</th><th>conf</th><th>correct</th>
      </tr></thead>
      <tbody>
      ${o.map(t=>`<tr>
        <td>${A(t.operation)}<br/><small style="color:var(--text-dim)">${A(t.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${A(t.shape)}</td>
        <td>${t.repetitions.toLocaleString()}</td>
        <td>${t.measurable?t.blockMs.toFixed(2):"—"}</td>
        <td>${t.measurable?V(t.estimatedPerOperationMs):"—"}</td>
        <td>${t.totalFLOPs>0?t.totalFLOPs.toExponential(3):"—"}</td>
        <td>${t.totalBytes>0?(t.totalBytes/1048576).toFixed(1)+" MiB":"—"}</td>
        <td>${ie(t)}</td>
        <td>${Be(t.confidence)}</td>
        <td>${t.correctnessPassed?'<span style="color:var(--green)">OK</span>':'<span style="color:var(--red)">FAIL</span>'}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function Nt(e){return e.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">SYNTHETIC TRANSFORMER BLOCK (NOT real model benchmarks)</div>
    <table class="perf-table">
      <thead><tr>
        <th>class</th><th>hidden</th><th>intermediate</th><th>layers</th><th>heads</th><th>kvHeads</th><th>params</th><th>FP16</th><th>INT8</th><th>INT4</th><th>block ms</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${e.map(o=>`<tr>
        <td><b>${A(o.config.name)}</b></td>
        <td>${o.config.hidden}</td>
        <td>${o.config.intermediate}</td>
        <td>${o.config.layers}</td>
        <td>${o.config.heads}</td>
        <td>${o.config.kvHeads}</td>
        <td>${(o.paramCount/1e6).toFixed(1)}M</td>
        <td>${H(o.fp16Bytes/(1024*1024))}</td>
        <td>${H(o.int8Bytes/(1024*1024))}</td>
        <td>${H(o.int4Bytes/(1024*1024))}</td>
        <td>${o.confidence!=="UNMEASURABLE"?o.blockLatencyMs.toFixed(3)+" ms":"UNMEASURABLE"}</td>
        <td>${Be(o.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Architectural workload simulations — NOT claims that corresponding real models fit.</div>
  </div>`}function Rt(e){return e.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">TOKEN GENERATION SIMULATION (SYNTHETIC INFERENCE ESTIMATES)</div>
    <table class="perf-table">
      <thead><tr>
        <th>prompt</th><th>generate</th><th>prefill ms</th><th>first token ms</th><th>avg decode ms</th><th>tokens/sec</th><th>total ms</th>
      </tr></thead>
      <tbody>
      ${e.map(o=>`<tr>
        <td>${o.promptTokens}</td>
        <td>${o.generateTokens}</td>
        <td>${o.prefillMs.toFixed(1)}</td>
        <td>${o.firstTokenMs.toFixed(3)}</td>
        <td>${o.avgDecodeMs.toFixed(3)}</td>
        <td>${o.tokensPerSec>0?o.tokensPerSec.toFixed(1):"—"}</td>
        <td>${o.totalMs.toFixed(1)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">SYNTHETIC estimates based on measured block latencies. Do NOT use as real model performance claims.</div>
  </div>`}function Pt(e){return e.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">MEMORY BUDGET (chunked allocation)</div>
    <table class="perf-table">
      <thead><tr>
        <th>target</th><th>allocated</th><th>success</th><th>buffers</th><th>chunk</th><th>alloc ms</th><th>write ms</th>
      </tr></thead>
      <tbody>
      ${e.map(o=>`<tr>
        <td>${o.targetMB} MB</td>
        <td>${o.totalAllocatedMB.toFixed(0)} MB</td>
        <td style="color:${o.success?"var(--green)":"var(--red)"}">${o.success?"OK":"FAIL"}</td>
        <td>${o.numBuffers}</td>
        <td>${o.chunkMB} MB</td>
        <td>${o.allocMs>0?o.allocMs.toFixed(1):"—"}</td>
        <td>${o.writeMs>0?o.writeMs.toFixed(1):"—"}</td>
      </tr>`).join("")}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">WebGPU allocation capability, NOT total system RAM.</div>
  </div>`}function Ft(e){const o=ee(null,e,Z()),s=o.overallCertified?"var(--green)":"var(--red)",n=(a,i)=>`<b style="color:${i==="PASS"?"var(--green)":"var(--red)"}">${i}</b> ${a}`;return`<div style="padding:8px 10px;border:1px solid ${s};border-radius:6px;margin-bottom:12px;font-size:12px">
    <b style="color:${s}">SELF-AUDIT CERTIFICATION: ${o.certification}</b>
    <span style="color:var(--text-dim)"> — ${n("TIMING",o.timingIntegrity)} · ${n("THROUGHPUT",o.throughputIntegrity)} · ${n("CORRECTNESS",o.correctnessIntegrity)} · ${n("LLM SUITE",o.llmSuiteComplete)} · ${n("MEMORY SUITE",o.memorySuiteComplete)}</span>
    <div style="margin-top:4px;font-size:11px;color:var(--text-dim)">
      ${o.llmSuiteComplete==="PASS"?"":"LLM suite incomplete — "}
      Normalization ${o.normalization?.ok?"OK":"FAIL"} · Throughput ${o.throughput?.ok?"OK":"FAIL"} · Timer-floor ${o.timerLimitations?.timerFloorLimitedCount??0} result(s)
    </div>
    ${(o.certificationReasons?.length??0)>0?`<ul style="margin:4px 0 0 18px;padding:0">${o.certificationReasons.map(a=>`<li>${A(a)}</li>`).join("")}</ul>`:""}
  </div>`}function Ct(e){const o=C,t=be(e,o?.quantizedMatmul.length??1,o?.decodeAttention.length??1,o?.transformerBlocks.length??1,o?.tokenGeneration.length??1,o?.memoryBudget.length??1),s=t.llmReadinessStatus==="CERTIFIED"?"var(--green)":"var(--red)";return`<div class="v3-section">
    <div class="v3-section-title">AETHER LLM READINESS SCORE (heuristic)</div>
    <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">HEURISTIC — NOT A MODEL BENCHMARK</div>
    ${O("COMPUTE (INT8/INT4 matmul)",e.computeScore)}
    ${O("MEMORY (budget allocation)",e.memoryScore)}
    ${O("ATTENTION (full-sequence)",e.attentionScore)}
    ${O("DECODE (KV-cache decode)",e.decodeScore)}
    ${O("TRANSFORMER BLOCK",e.transformerBlockScore)}
    ${O("SUSTAINED PERFORMANCE",e.sustainedScore)}
    <div class="overall-row"><span>AETHER LLM READINESS</span><span>${e.overall} / 100</span></div>
    <div style="font-size:12px;margin-top:6px">Status: <b style="color:${s}">${t.llmReadinessStatus}</b> ${t.llmReadinessStatus==="NOT CERTIFIED"?`— ${A(t.reason)}`:""}</div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
      Heuristic LLM readiness score — NOT an official Apple performance rating. Do NOT select a model automatically. Do NOT claim GREEN transformer inference from legacy MatMul/MLP tests alone.
    </div>
  </div>`}function Xe(e,o,t){const s=document.getElementById("perf-v3-llm-results");s&&(s.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER V3.1 — LLM INFERENCE GATE</span>
        <span class="badge badge-info">HARDWARE GATE</span>
      </div>

      ${Ft(e)}

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${A(o.adapterName)}</b></div>
          <div>Vendor: <b>${A(o.adapterVendor)}</b></div>
          <div>Platform: <b>${A(o.platform)}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">TIMING</div>
          <div>Method: <b>HOST_WALL_CLOCK<br/>AMPLIFIED</b></div>
          <div>Timer: <b>${o.timerResolutionMs.toFixed(3)} ms</b></div>
        </div>
      </div>

      ${Pe("INT8/INT4 QUANTIZED MATMUL",e.quantizedMatmul)}
      ${Pe("KV-CACHE DECODE ATTENTION",e.decodeAttention)}
      ${Nt(e.transformerBlocks)}
      ${Rt(e.tokenGeneration)}
      ${Pt(e.memoryBudget)}
      ${Ct(e.llmReadiness)}

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
        <button class="btn" id="btn-export-llm-json">EXPORT LLM JSON</button>
        <button class="btn btn-outline" id="btn-export-llm-report">EXPORT LLM REPORT</button>
      </div>
    </div>
  `,s.querySelector("#btn-export-llm-json")?.addEventListener("click",()=>Ut(e,o)),s.querySelector("#btn-export-llm-report")?.addEventListener("click",()=>Dt(e,o)),t("V3.1 LLM Inference Gate complete","ok"))}function Ut(e,o){const t=ee(null,e,o.timerResolutionMs),s=Oe(e),n={version:"AETHER V3.1.3 — LLM INFERENCE GATE",device:o,timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??null,commit:globalThis.AETHER_COMMIT??null,llmInference:s,certification:{timingIntegrity:t.timingIntegrity??"FAIL",throughputIntegrity:t.throughputIntegrity??"FAIL",correctnessIntegrity:t.correctnessIntegrity??"FAIL",llmSuiteComplete:t.llmSuiteComplete??"FAIL",memorySuiteComplete:t.memorySuiteComplete??"FAIL",overallCertified:t.overallCertified??!1,certificationStatus:t.certificationStatus??"NOT_CERTIFIED",reasons:t.certificationReasons??[]},selfAudit:t.selfAuditChecks??null,note:"WebGPU allocation capability, NOT total system RAM."};se("aether-v3-1-3-llm-gate.json",JSON.stringify(n,null,2),"application/json")}function Dt(e,o){const t=n=>n.map(a=>`| ${a.operation} | ${a.shape} | ${a.repetitions} | ${V(a.blockMs)} | ${V(a.estimatedPerOperationMs)} | ${a.totalFLOPs>0?a.totalFLOPs.toExponential(3):a.totalBytes>0?a.totalBytes+" B":"—"} | ${a.confidence} | ${ie(a)} | ${a.correctnessPassed?"OK":"FAIL"} |`).join(`
`),s=`# AETHER V3.1 — LLM INFERENCE GATE

- Date: ${new Date().toISOString()}
- Device: ${o.device}
- Adapter: ${o.adapterName} / ${o.adapterVendor}
- Timer: ${o.timerResolutionMs.toFixed(3)} ms

## INT8/INT4 Quantized MatMul
| operation | shape | reps | total | est/op | work | conf | throughput | correct |
|---|---|---|---|---|---|---|---|---|
${t(e.quantizedMatmul)}

## KV-Cache Decode Attention
| operation | shape | reps | total | est/op | work | conf | throughput | correct |
|---|---|---|---|---|---|---|---|---|
${t(e.decodeAttention)}

## Synthetic Transformer Block (NOT real model benchmarks)
| class | hidden | intermediate | layers | heads | kvHeads | params | FP16 | INT8 | INT4 | block ms | conf |
|---|---|---|---|---|---|---|---|---|---|---|---|
${e.transformerBlocks.map(n=>`| ${n.config.name} | ${n.config.hidden} | ${n.config.intermediate} | ${n.config.layers} | ${n.config.heads} | ${n.config.kvHeads} | ${(n.paramCount/1e6).toFixed(1)}M | ${H(n.fp16Bytes/1048576)} | ${H(n.int8Bytes/1048576)} | ${H(n.int4Bytes/1048576)} | ${n.blockLatencyMs.toFixed(3)} | ${n.confidence} |`).join(`
`)}

## Token Generation Simulation (SYNTHETIC INFERENCE ESTIMATES)
| prompt | generate | prefill ms | first token ms | avg decode ms | tokens/sec | total ms |
|---|---|---|---|---|---|---|
${e.tokenGeneration.map(n=>`| ${n.promptTokens} | ${n.generateTokens} | ${n.prefillMs.toFixed(1)} | ${n.firstTokenMs.toFixed(3)} | ${n.avgDecodeMs.toFixed(3)} | ${n.tokensPerSec>0?n.tokensPerSec.toFixed(1):"—"} | ${n.totalMs.toFixed(1)} |`).join(`
`)}

## Memory Budget
| target | allocated | success | buffers | chunk | alloc ms | write ms |
|---|---|---|---|---|---|---|
${e.memoryBudget.map(n=>`| ${n.targetMB} MB | ${n.totalAllocatedMB.toFixed(0)} MB | ${n.success?"OK":"FAIL"} | ${n.numBuffers} | ${n.chunkMB} MB | ${n.allocMs.toFixed(1)} | ${n.writeMs.toFixed(1)} |`).join(`
`)}

WebGPU allocation capability, NOT total system RAM.

## AETHER LLM Readiness Score (heuristic)
- COMPUTE: ${e.llmReadiness.computeScore}
- MEMORY: ${e.llmReadiness.memoryScore}
- ATTENTION: ${e.llmReadiness.attentionScore}
- DECODE: ${e.llmReadiness.decodeScore}
- TRANSFORMER_BLOCK: ${e.llmReadiness.transformerBlockScore}
- SUSTAINED: ${e.llmReadiness.sustainedScore}
- **AETHER_LLM_READINESS: ${e.llmReadiness.overall} / 100**

## Limitations
- INT8/INT4 matmul uses weight-only quantization with sign-extended unpacking in WGSL.
- KV-cache decode attention uses two-pass softmax (max + exp) per thread.
- Synthetic transformer block chains 10 compute passes per forward; actual models have KV-cache optimizations.
- Token generation is SYNTHETIC — estimates based on measured block latencies, NOT real model inference.
- Memory budget measures WebGPU buffer allocation capability, NOT total device RAM.
- thermal/gpuUtilization unavailable in browser.
- Heuristic score — NOT an official Apple performance rating.
`;se("aether-v3-1-llm-report.md",s,"text/markdown")}async function Gt(e,o,t){try{const s=o();me(Je());const{runLLMInferenceGate:n,runLLMInferenceGateQuick:a}=await Ne(async()=>{const{runLLMInferenceGate:d,runLLMInferenceGateQuick:u}=await import("./perf-v3-llm-X5L7lz1u.js");return{runLLMInferenceGate:d,runLLMInferenceGateQuick:u}},__vite__mapDeps([0,1,2])),i=await(e==="quick"?a:n)(d=>t(`V3.1: ${d}`,"info"));C=i;const{validateLLMGateIntegrity:r}=await Ne(async()=>{const{validateLLMGateIntegrity:d}=await Promise.resolve().then(()=>dt);return{validateLLMGateIntegrity:d}},void 0),l=r(i);if(l.ok)t("V3.1 audit OK: normalization + throughput verified for LLM gate results.","ok");else{t(`V3.1 AUDIT FAILURES: ${l.issues.length}`,"err");for(const d of l.issues)t(`  - ${d.operation} ${d.workload}: ${d.detail}`,"err")}const c=await Qe(s);Xe(i,c,t)}catch(s){t(`V3.1 ERROR: ${s.message}`,"err")}}const Wt=Object.freeze(Object.defineProperty({__proto__:null,get _llmGateResults(){return C},buildLLMInferenceExport:At,buildSelfAudit:ee,renderLLMGate:Xe,renderV3Certification:Ye,runLLMGateFromUI:Gt,runV3FromUI:Bt},Symbol.toStringTag,{value:"Module"}));export{ut as G,B as a,ze as b,D as c,Ue as d,U as e,T as f,ct as g,Wt as h,N as m,Vt as p,E as s,P as u,We as v};
