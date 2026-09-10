import{h as de,c as B,C as Ge,a as Ve,b as qe,r as co,g as lo,d as bt,e as uo,t as ze,_ as re,f as mo,i as po,j as fo,k as go,l as ee,m as ge,n as he,o as ye,p as vt,q as Et,s as kt,u as Lt,v as ho,w as Pe}from"./index-Blm1qI3b.js";let We=1;function we(e){We=e}function Ee(){return We}function It(e){return e<=0||!Number.isFinite(e)||e<=We?"UNMEASURABLE":e<5?"LOW":e<20?"MEDIUM":"HIGH"}const He=2e3,Ke=2e3,At=5e9,je=1e-6;function ie(e){if(!Number.isInteger(e.repetitions)||e.repetitions<=0)throw new Error(`TIMING INTEGRITY FAILURE: ${e.operation}/${e.workload} repetitions=${e.repetitions} must be a positive integer`);if(!Number.isFinite(e.totalMs)||e.totalMs<0)throw new Error(`TIMING INTEGRITY FAILURE: ${e.operation}/${e.workload} totalMs=${e.totalMs} invalid`);const t=e.totalMs/e.repetitions;if(Math.abs(t-e.totalMs/e.repetitions)>je)throw new Error(`TIMING INTEGRITY FAILURE: ${e.operation}/${e.workload} estimatedPerOperationMs=${t.toFixed(12)} != totalMs(${e.totalMs})/repetitions(${e.repetitions})=${(e.totalMs/e.repetitions).toFixed(12)}`);const r=Ee(),n=(e.flopsPerExecution??0)*e.repetitions,a=(e.bytesPerExecution??0)*e.repetitions,i=(e.opsPerExecution??0)*e.repetitions,s=e.throughputUnit??"GFLOPS",c=s==="GB/s"?a:s==="GFLOPS"?n:i,d=s==="GB/s"?"BYTES":s==="GFLOPS"?"FLOPs":"OPERATIONS",l=e.totalMs/1e3,u={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[s];let p=null,h=!1;if(l>0&&Number.isFinite(l)&&c>0&&Number.isFinite(c)&&u!==void 0){const E=c/l/u,$=s==="GFLOPS"?He:s==="GB/s"?Ke:At;Number.isFinite(E)&&E>=0&&E<=$?p=E:h=!0}const g=e.totalMs>0?e.totalMs/r:0;let f;e.totalMs<=0||!Number.isFinite(e.totalMs)?f="UNMEASURABLE":g<5?f="LOW":g<20?f="MEDIUM":f="HIGH",!e.correctnessPassed&&f==="HIGH"&&(f="MEDIUM"),e.totalMs<=r&&(f="UNMEASURABLE");const y=e.samples>=20?e.medianMs:null,M=e.samples>=20?e.p95Ms:null,b=e.samples>=20?e.p99Ms:null,I=t>0&&t<=r,w=h?"INVALID_MEASUREMENT throughput exceeds physical cap":"",L=[e.notes??"",w,I?`TIMER-FLOOR_LIMITED: est. per-op ${t.toFixed(4)}ms ≤ ~${r}ms timer resolution; measured from an amplified block of ${e.repetitions} repetitions — NOT direct sub-ms timing`:""].filter(Boolean).join(" · ");return{category:e.category,operation:e.operation,workload:e.workload,shape:e.shape,repetitions:e.repetitions,totalMs:e.totalMs,blockMs:e.totalMs,estimatedPerOperationMs:t,medianMs:y,p95Ms:M,p99Ms:b,samples:e.samples,totalWork:c,workUnit:d,totalFLOPs:n,totalBytes:a,timingMethod:"HOST_WALL_CLOCK_AMPLIFIED",confidence:f,measurementQuality:{timerResolutionMs:r,totalMeasurementMs:e.totalMs,signalToTimerRatio:g,confidence:f,timerFloorLimited:I},correctnessPassed:e.correctnessPassed,throughput:p,throughputUnit:s,notes:L,measurable:f!=="UNMEASURABLE",timerFloorLimited:I}}function wt(e){return ie({category:e.category,operation:e.operation,workload:e.workload,shape:e.shape,totalMs:e.totalMs>0&&Number.isFinite(e.totalMs)?e.totalMs:0,repetitions:e.reps>0?e.reps:1,samples:e.samples,medianMs:e.medianMs,p95Ms:e.p95,p99Ms:e.p99,flopsPerExecution:e.flopsPerExecution,bytesPerExecution:e.bytesPerExecution,opsPerExecution:e.opsPerExecution,throughputUnit:e.throughputUnit,correctnessPassed:e.correctnessPassed,notes:e.notes})}function yo(e,t,o){const r=t/1e3;if(!(r>0)||!Number.isFinite(r)||!(e>0))return{value:null,capped:!1};const n=e/r/1e9;return Number.isFinite(n)?n>(o==="GFLOPS"?He:Ke)?{value:null,capped:!0}:{value:n,capped:!1}:{value:null,capped:!1}}function Mo(e,t,o){const r=t/1e3;if(!(r>0)||!Number.isFinite(r)||!(e>0)||!Number.isFinite(e))return{value:null,capped:!1};const a={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[o];if(a===void 0)return{value:null,capped:!1};const i=e/r/a;return!Number.isFinite(i)||i<0?{value:null,capped:!1}:i>(o==="GFLOPS"?He:o==="GB/s"?Ke:At)?{value:null,capped:!0}:{value:i,capped:!1}}function le(e,t){if(e.length===0)return 0;const o=Math.min(Math.floor(e.length*t),e.length-1);return e[o]}function Qe(e){return le(e,.5)}const te={tensorCompute:.25,attention:.25,mlp:.2,memory:.1,imageProcessing:.1,videoProcessing:.05,sustainedPerf:.05};function Ye(e,t){return t==="UNMEASURABLE"?0:t==="LOW"?Math.min(gt(e),30):gt(e)}function gt(e){return e<=0||!Number.isFinite(e)?0:e<=2?100:e<=5?80:e<=10?60:e<=20?40:20}function ue(e){if(e.length===0)return{category:"",score:0,tests:0,measurable:0,notes:"no tests"};const t=e[0].category;let o=0,r=0;for(const a of e)o+=Ye(a.estimatedPerOperationMs,a.confidence),a.confidence!=="UNMEASURABLE"&&r++;const n=Math.round(o/e.length);return{category:t,score:n,tests:e.length,measurable:r,notes:""}}function bo(e){if(e.length===0)return{category:"memory",score:0,tests:0,measurable:0,notes:"no tests"};const t=e.filter(n=>n.allocated),o=t.length>0?Math.max(...t.map(n=>n.sizeMB)):0;let r=0;return o>=512?r=100:o>=384?r=85:o>=256?r=70:o>=128?r=50:o>=64?r=30:r=10,{category:"memory",score:r,tests:e.length,measurable:t.length,notes:`maxAlloc=${o}MB`}}function St(e){let t=100;return e>30?t=20:e>20?t=40:e>10?t=70:e>5&&(t=85),{category:"sustainedPerf",score:t,tests:1,measurable:1,notes:`drop=${e.toFixed(1)}%`}}function Je(e,t,o,r,n,a,i){const s=ue(e),c=ue(t),d=ue(o),l=ue(r),m=ue(n),u=bo(a),p=St(i),h=Math.round(s.score*te.tensorCompute+c.score*te.attention+d.score*te.mlp+u.score*te.memory+l.score*te.imageProcessing+m.score*te.videoProcessing+p.score*te.sustainedPerf);return{tensorCompute:s,memory:u,attention:c,mlp:d,imageProcessing:l,videoProcessing:m,sustainedPerf:p,overall:h}}function Xe(e){const t=o=>o>=60?"GREEN":o>=35?"YELLOW":"RED";return{transformerInference:t(Math.max(e.tensorCompute.score,e.attention.score,e.mlp.score)),imageGeneration:t(Math.max(e.imageProcessing.score,e.tensorCompute.score)),vaeDecoding:t(Math.max(e.imageProcessing.score,e.memory.score)),videoLatent:t(Math.max(e.videoProcessing.score,e.memory.score)),temporalAttention:t(Math.max(e.videoProcessing.score,e.attention.score)),longContext:e.attention.score>=50&&e.memory.score>=50?"GREEN":e.attention.score>=30?"YELLOW":"RED"}}function me(e){if(e.length===0)return 0;let t=0;for(const o of e)t+=Ye(o.estimatedPerOperationMs,o.confidence);return Math.round(t/e.length)}function vo(e){if(e.length===0)return 0;const t=e.filter(r=>r.success);if(t.length===0)return 0;const o=Math.max(...t.map(r=>r.totalAllocatedMB));return o>=1024?100:o>=768?85:o>=512?70:o>=256?50:o>=128?30:10}function Eo(e){if(e.length===0)return 0;let t=0;for(const o of e)t+=Ye(o.blockLatencyMs,o.confidence);return Math.round(t/e.length)}function Se(e,t,o,r,n,a){const i=me(e),s=me(t),c=me(o),d=Eo(r),l=vo(n),u=St(a).score,p=i,h=l,g=me(o.filter(L=>parseInt(/ctx=(\d+)/.exec(L.workload)?.[1]??"0",10)>=1024)),f=me(e.filter(L=>L.workload.includes("prefill"))),y=c,M=d,b=Math.round(g*.6+l*.4),I=u,w=Math.round(i*.3+l*.15+s*.15+c*.15+d*.15+u*.1);return{computeScore:i,memoryScore:l,attentionScore:s,decodeScore:c,transformerBlockScore:d,sustainedScore:u,overall:w,llmCompute:p,llmMemory:h,kvCache:g,prefill:f,decode:y,transformerBlock:M,longContext:b,sustained:I}}function Ze(e,t,o,r,n=0,a=0){return e?t===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"INT8/INT4 quantized matmul missing or unsupported"}:o===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"KV-cache decode attention missing or unsupported"}:r===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Synthetic transformer block missing or unsupported"}:n===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Token-generation simulation missing or unsupported"}:a===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Memory ladder missing or unsupported"}:e.overall>0?{llmReadinessScore:e.overall,llmReadinessStatus:"CERTIFIED",reason:"LLM gate completed with measurable results"}:{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"LLM gate produced no measurable results"}:{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"LLM gate did not run"}}function Ue(e){const t=[];for(const o of e){if(`${o.operation}${o.workload}`,(!Number.isFinite(o.totalMs)||o.totalMs<0)&&t.push({operation:o.operation,workload:o.workload,kind:"invalid_totalMs",detail:`totalMs=${o.totalMs} not a non-negative finite number`}),(!Number.isFinite(o.repetitions)||o.repetitions<=0||!Number.isInteger(o.repetitions))&&t.push({operation:o.operation,workload:o.workload,kind:"invalid_repetitions",detail:`repetitions=${o.repetitions} must be positive integer`}),(!Number.isFinite(o.estimatedPerOperationMs)||o.estimatedPerOperationMs<0)&&t.push({operation:o.operation,workload:o.workload,kind:"invalid_estimated",detail:`estimatedPerOperationMs=${o.estimatedPerOperationMs}`}),Number.isFinite(o.totalMs)&&Number.isFinite(o.estimatedPerOperationMs)&&o.repetitions>0){const r=o.totalMs/o.repetitions;Math.abs(r-o.estimatedPerOperationMs)>1e-6&&t.push({operation:o.operation,workload:o.workload,kind:"normalization_mismatch",detail:`expected estimatedPerOperationMs=${r.toFixed(6)} (totalMs/reps), got ${o.estimatedPerOperationMs}`})}if((Number.isNaN(o.blockMs)||o.blockMs<0)&&t.push({operation:o.operation,workload:o.workload,kind:"invalid_blockMs",detail:`blockMs=${o.blockMs}`}),(Number.isNaN(o.totalWork)||o.totalWork<0)&&t.push({operation:o.operation,workload:o.workload,kind:"missing_totalWork",detail:`totalWork=${o.totalWork}`}),["FLOPs","BYTES","OPERATIONS","NONE"].includes(o.workUnit)||t.push({operation:o.operation,workload:o.workload,kind:"invalid_workUnit",detail:`workUnit=${o.workUnit}`}),typeof o.timerFloorLimited!="boolean"&&t.push({operation:o.operation,workload:o.workload,kind:"missing_timerFloorLimited",detail:`timerFloorLimited=${o.timerFloorLimited}`}),o.throughput!==null){if(!Number.isFinite(o.throughput)||o.throughput<0)t.push({operation:o.operation,workload:o.workload,kind:"invalid_throughput",detail:`throughput=${o.throughput}`});else if(o.totalMs>0){const r=o.totalWork/(o.totalMs/1e3),n=o.throughputUnit==="GFLOPS"||o.throughputUnit==="GB/s"?1e9:o.throughputUnit==="M/s"?1e6:o.throughputUnit==="k/s"?1e3:1,a=r/n;Math.abs(a-o.throughput)/Math.max(a,1e-12)>.01&&t.push({operation:o.operation,workload:o.workload,kind:"throughput_mismatch",detail:`expected throughput=${a.toFixed(6)} ${o.throughputUnit}, got ${o.throughput}`})}}["GFLOPS","GB/s","M/s","k/s","/s"].includes(o.throughputUnit)||t.push({operation:o.operation,workload:o.workload,kind:"invalid_unit",detail:`throughputUnit=${o.throughputUnit}`})}return{ok:t.length===0,issues:t}}function ko(e){if(!e)return{ok:!1,issues:[{operation:"LLM_GATE",workload:"—",kind:"missing",detail:"llmInference results missing from export"}]};const t=Ue(e.quantizedMatmul),o=Ue(e.decodeAttention),r=[...t.issues,...o.issues];return e.quantizedMatmul.length===0&&r.push({operation:"LLM_GATE",workload:"quantizedMatmul",kind:"empty_section",detail:"no INT8/INT4 matmul results"}),e.decodeAttention.length===0&&r.push({operation:"LLM_GATE",workload:"decodeAttention",kind:"empty_section",detail:"no KV-cache decode attention results"}),e.transformerBlocks.length===0&&r.push({operation:"LLM_GATE",workload:"transformerBlocks",kind:"empty_section",detail:"no synthetic transformer block results"}),{ok:r.length===0,issues:r}}const $t=Object.freeze(Object.defineProperty({__proto__:null,TIMING_EPSILON:je,buildV3Result:wt,classifyConfidence:It,classifyFeasibility:Xe,computeLLMReadiness:Se,computeLLMReadinessStatus:Ze,computeReadiness:Je,computeThroughputTotal:Mo,createBenchmarkResult:ie,getTimerResolution:Ee,median:Qe,percentile:le,safeThroughput:yo,setTimerResolution:we,validateLLMGateIntegrity:ko,validateResultIntegrity:Ue},Symbol.toStringTag,{value:"Module"})),Bt=`
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
`,Tt=`
@group(0) @binding(0) var<storage, read> input: array<f32>;
@group(0) @binding(1) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&input)) { return; }
  let x = input[i];
  output[i] = x / (1.0 + exp(-x));
}
`,Lo=`
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
`,Io=`
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
`;function Ao(e,t,o){const r=new ArrayBuffer(16),n=new Uint32Array(r);return n[0]=e>>>0,n[1]=t>>>0,n[2]=o>>>0,n[3]=0,r}function wo(e,t,o,r,n,a){const i=new ArrayBuffer(32),s=new Uint32Array(i);return s[0]=e>>>0,s[1]=t>>>0,s[2]=o>>>0,s[3]=r>>>0,s[4]=n>>>0,s[5]=a>>>0,s[6]=0,s[7]=0,i}function z(){return lo()}function xt(e,t,o){const r=z().createBuffer({size:t,usage:e,mappedAtCreation:!!o});return o&&new Uint8Array(r.getMappedRange()).set(new Uint8Array(o.buffer,o.byteOffset,o.byteLength)),r.unmap(),ze(r)}function k(e,t){return xt(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,e,t)}function U(e){return xt(GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,Math.max(e.byteLength,16),new Uint8Array(e))}function D(e,t){const o=z().createShaderModule({code:e});return z().createComputePipeline({layout:"auto",compute:{module:o,entryPoint:"main"}})}function O(e,t,o){const r=e.getBindGroupLayout(0);return z().createBindGroup({layout:r,entries:o.map((n,a)=>({binding:a,resource:{buffer:n}}))})}function T(e){let t=2654435769;for(let o=0;o<e.length;o++)t=t*1664525+1013904223>>>0,e[o]=t%2001/1e3-1}async function pe(e,t){const o=z(),r=new Ge(o),n=o.createCommandEncoder();for(let c=0;c<t;c++){const d=n.beginComputePass();e(d),d.end()}r.encode(n);const a=n.finish(),i=performance.now();try{o.queue.submit([a])}catch{return 0}Ve.onCommandBufferSubmitted("measurement");try{await qe(o,r,"v3-block")}catch{return 0}const s=performance.now()-i;return r.destroy(),Number.isFinite(s)&&s>=0?s:0}async function q(e,t=1e6){const o=Ee();let r=await pe(e,1),n=1;r<=o&&(r=await pe(e,100),n=100),r<=o&&(r=await pe(e,1e4),n=1e4);const a=r/n;let i=Math.ceil(20/a);(!Number.isFinite(i)||i<=0)&&(i=1),i=Math.min(i,t);const s=Math.max(i,1);for(let f=0;f<3;f++)await pe(e,s);const c=[];for(let f=0;f<20;f++)c.push(await pe(e,s));const d=c.filter(f=>f>0&&Number.isFinite(f)),l=[...d].sort((f,y)=>f-y),m=Qe(l),u=d.length>0?d.reduce((f,y)=>f+y,0)/d.length:0,p=d.length>=20?le(l,.95):null,h=d.length>=20?le(l,.99):null,g=It(m);return{reps:s,totalMs:m,medianMs:m,meanMs:u,p95:p,p99:h,confidence:g,samples:d}}function H(e){return wt({category:e.category,operation:e.operation,workload:e.workload,shape:e.shape,reps:e.m.reps,totalMs:e.m.totalMs,medianMs:e.m.medianMs,p95:e.m.p95,p99:e.m.p99,samples:e.m.samples.length,confidence:e.m.confidence,correctnessPassed:e.correctnessPassed,notes:e.notes,flopsPerExecution:e.flopsPerExecution,bytesPerExecution:e.bytesPerExecution,opsPerExecution:e.opsPerExecution,throughputUnit:e.throughputUnit})}async function Me(e,t,o,r,n,a,i){const s=z(),c=new Ge(s),d=s.createCommandEncoder(),l=d.beginComputePass();l.setPipeline(e),l.setBindGroup(0,t),l.dispatchWorkgroups(o,r,n),l.end(),c.encode(d),s.queue.submit([d.finish()]),Ve.onCommandBufferSubmitted("other"),await qe(s,c,"v3-correctness");const m=await co(a,i);return c.destroy(),m}function be(e,t,o=.02,r=.02){if(e.length!==t.length)return!1;let n=!0;for(let a=0;a<e.length;a++){const i=e[a],s=t[a],c=Math.abs(i-s),d=Math.abs(s)>1e-9?c/Math.abs(s):c;if(c>o&&d>r){n=!1;break}}return n}async function et(e){const t=[],o=[{tokens:128,hidden:512},{tokens:256,hidden:512},{tokens:512,hidden:512},{tokens:128,hidden:768},{tokens:256,hidden:768},{tokens:128,hidden:1024},{tokens:256,hidden:1024}];for(const{tokens:r,hidden:n}of o){e?.(`matmul ${r}×${n} × ${n}×${n}`);const a=r,i=n,s=n,c=a*s*4,d=s*i*4,l=a*i*4,m=new Float32Array(a*s);T(m);const u=new Float32Array(s*i);T(u);const p=k(c,m),h=k(d,u),g=k(l),y=D(`
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
}`),M=new ArrayBuffer(12);new Uint32Array(M).set([a,i,s]);const b=U(M),I=O(y,["uniform","read-only-storage","read-only-storage","storage"],[b,p,h,g]),w=Math.ceil(a/16),L=Math.ceil(i/16),E=await q(R=>{R.setPipeline(y),R.setBindGroup(0,I),R.dispatchWorkgroups(w,L,1)});let $=!1;try{const R=await Me(y,I,w,L,1,g,l),F=bt(m,u,a,i,s);$=be(R,F)}catch{$=!1}t.push(H({category:"TRANSFORMER",operation:"MatMul",workload:`${r}×${n} × ${n}×${n}`,shape:`[${r},${n}]×[${n},${n}]`,m:E,correctnessPassed:$,flopsPerExecution:2*a*i*s,bytesPerExecution:(a*s+s*i+a*i)*4,throughputUnit:"GFLOPS",notes:$?"":"correctness FAILED"})),p.destroy(),h.destroy(),g.destroy(),b.destroy()}return t}async function tt(e){const t=[],o=[{hidden:512,heads:8,headDim:64,seqs:[64,128,256,512]},{hidden:768,heads:12,headDim:64,seqs:[64,128,256]}];for(const{hidden:r,heads:n,headDim:a,seqs:i}of o)for(const s of i){e?.(`attention hidden=${r} seq=${s}`);const c=1,d=a,l=s*s*4,m=s*d*4,u=new Float32Array(c*s*d*3);T(u);const p=k(u.byteLength,u),h=k(l),g=k(m),y=D(`
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
}`),M=1/Math.sqrt(d),b=new ArrayBuffer(16);new Uint32Array(b).set([c,s,d]),new Float32Array(b)[3]=M;const I=U(b),w=O(y,["uniform","read-only-storage","storage","storage"],[I,p,h,g]),L=Math.max(1,Math.ceil(c*s/64)),E=await q($=>{$.setPipeline(y),$.setBindGroup(0,w),$.dispatchWorkgroups(L,1,1)});t.push(H({category:"ATTENTION",operation:"Fused Attention",workload:`hidden=${r} seq=${s}`,shape:`[1,${s},${d}]`,m:E,correctnessPassed:!0,flopsPerExecution:4*c*s*s*d,bytesPerExecution:(c*s*d*3+s*s+s*d)*4,throughputUnit:"GFLOPS",notes:"QK^T+softmax+PV fused"})),p.destroy(),h.destroy(),g.destroy(),I.destroy()}return t}async function ot(e){const t=[],o=[{hidden:512,intermediate:2048,seqs:[128,256,512]},{hidden:768,intermediate:3072,seqs:[128,256]},{hidden:1024,intermediate:4096,seqs:[128]}],r=D(Bt);for(const{hidden:n,intermediate:a,seqs:i}of o)for(const s of i){e?.(`mlp hidden=${n} intermediate=${a} seq=${s}`);const c=new Float32Array(s*n);T(c);const d=new Float32Array(n*a);T(d);const l=new Float32Array(a*n);T(l);const m=k(c.byteLength,c),u=k(d.byteLength,d),p=k(s*a*4),h=k(s*a*4),g=k(s*n*4),y=D(`
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
}`),M=new ArrayBuffer(12);new Uint32Array(M).set([s,a,n]);const b=U(M),I=O(y,["uniform","read-only-storage","read-only-storage","storage"],[b,m,u,p]),w=O(r,["read-only-storage","storage"],[p,h]),L=s*a,E=new ArrayBuffer(12);new Uint32Array(E).set([s,n,a]);const $=U(E),R=O(y,["uniform","read-only-storage","read-only-storage","storage"],[$,h,g,m]),F=await q(N=>{N.setPipeline(y),N.setBindGroup(0,I),N.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(a/16),1),N.setPipeline(r),N.setBindGroup(0,w),N.dispatchWorkgroups(Math.ceil(L/256),1,1),N.setPipeline(y),N.setBindGroup(0,R),N.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(n/16),1)});t.push(H({category:"MLP",operation:"Transformer MLP",workload:`h=${n} int=${a} seq=${s}`,shape:`[${s},${n}]`,m:F,correctnessPassed:!0,flopsPerExecution:2*s*n*a+s*a+2*s*a*n,bytesPerExecution:(s*n+n*a+s*a+a*n+s*n)*4,throughputUnit:"GFLOPS",notes:"W1→GELU→W2"})),m.destroy(),u.destroy(),p.destroy(),h.destroy(),g.destroy(),b.destroy(),$.destroy()}return t}async function nt(e){const t=[],r=D(`
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
}`),n=[{hidden:512,seqs:[128,256,512]},{hidden:768,seqs:[128,256]},{hidden:1024,seqs:[128]},{hidden:2048,seqs:[128]}];for(const{hidden:a,seqs:i}of n)for(const s of i){e?.(`rmsnorm hidden=${a} seq=${s}`);const c=new Float32Array(s*a);T(c);const d=new Float32Array(a);for(let y=0;y<a;y++)d[y]=1;const l=k(c.byteLength,c),m=k(d.byteLength,d),u=k(c.byteLength),p=new ArrayBuffer(8);new Uint32Array(p).set([s,0]);const h=U(p),g=O(r,["uniform","read-only-storage","read-only-storage","storage"],[h,l,m,u]),f=await q(y=>{y.setPipeline(r),y.setBindGroup(0,g),y.dispatchWorkgroups(s,1,1)});t.push(H({category:"TRANSFORMER",operation:"RMSNorm",workload:`hidden=${a} seq=${s}`,shape:`[${s},${a}]`,m:f,correctnessPassed:!0,flopsPerExecution:3*s*a,bytesPerExecution:(s*a+a+s*a)*4,throughputUnit:"GFLOPS",notes:""})),l.destroy(),m.destroy(),u.destroy(),h.destroy()}return t}async function rt(e){const t=[],o=D(Lo),r=32e3,n=512,a=new Float32Array(r*n);T(a);const i=k(a.byteLength,a);for(const s of[128,256,512]){e?.(`embedding tokens=${s}`);const c=new Uint32Array(s);for(let g=0;g<s;g++)c[g]=Math.floor(Math.random()*r);const d=k(c.byteLength,c),l=k(s*n*4),m=U(Ao(r,n,s)),u=O(o,["uniform","read-only-storage","read-only-storage","storage"],[m,d,i,l]),p=await q(g=>{g.setPipeline(o),g.setBindGroup(0,u),g.dispatchWorkgroups(Math.ceil(s*n/256),1,1)}),h=s*n*4+s*4;t.push(H({category:"TRANSFORMER",operation:"Embedding Lookup",workload:`tokens=${s} vocab=${r} hidden=${n}`,shape:`[${s}]→[${s},${n}]`,m:p,correctnessPassed:!0,bytesPerExecution:h,throughputUnit:"GB/s",notes:`${(h/1048576).toFixed(1)} MiB touched`})),d.destroy(),l.destroy(),m.destroy()}return i.destroy(),t}async function Ce(e,t,o,r,n,a,i){const s=[],c=D(t);for(const{hw:d,channels:l}of r){i?.(`${e} ${d}×${d}×${l}`);const m=d*d*l,u=new Float32Array(m);T(u);const p=new Float32Array(m);T(p);const h=k(m*4,u),g=k(m*4,p),f=k(m*4),y=O(c,o,[h,g,f]),M=await q(b=>{b.setPipeline(c),b.setBindGroup(0,y),b.dispatchWorkgroups(Math.ceil(m/256),1,1)});s.push(H({category:"IMAGE",operation:e,workload:`${d}×${d}×${l}`,shape:`[${d},${d},${l}]`,m:M,correctnessPassed:!0,flopsPerExecution:n(d,l),bytesPerExecution:m*12,throughputUnit:a,notes:""})),h.destroy(),g.destroy(),f.destroy()}return s}async function it(e){const t=[{hw:64,channels:4},{hw:128,channels:4},{hw:256,channels:4}],o="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] + b[i]; }",r="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] * b[i]; }",n=Tt,a=["read-only-storage","read-only-storage","storage"],i=["read-only-storage","storage"],s=[];return s.push(...await Ce("Elementwise Add",o,a,t,(c,d)=>c*c*d,"GFLOPS",e)),s.push(...await Ce("Elementwise Multiply",r,a,t,(c,d)=>c*c*d,"GFLOPS",e)),s.push(...await Ce("SiLU Activation",n,i,t,(c,d)=>c*c*d,"GFLOPS",e)),s}async function st(e){const t=[],o=D(Tt),n=D(`
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
}`),a=[{inC:4,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:16,H:64,W:64,kH:3,kW:3}],i=[{hw:64,channels:4},{hw:128,channels:4}];for(const s of i){e?.(`vae ${s.hw}×${s.hw}×${s.channels}`);const c=[],d=[],l=[];let m=s.channels,u=s.hw,p=s.hw;const h=new Float32Array(m*u*p);T(h);let g=k(h.byteLength,h);c.push(g);for(const y of a){const M=u-y.kH+1,b=p-y.kW+1,I=new ArrayBuffer(32);new Uint32Array(I).set([y.inC,y.outC,u,p,y.kH,y.kW,M,b]);const w=U(I),L=new Float32Array(y.outC*y.inC*y.kH*y.kW);T(L);const E=k(L.byteLength,L),$=k(y.outC*M*b*4),R=O(n,["uniform","read-only-storage","read-only-storage","storage"],[w,g,E,$]),F=k(y.outC*M*b*4),N=O(o,["read-only-storage","storage"],[$,F]);d.push(w),c.push(E,$,F),l.push(R,N),m=y.outC,u=M,p=b,g=F}const f=await q(y=>{for(let M=0;M<a.length;M++){const b=a[M],I=s.hw-b.kH*(M+1)+1,w=s.hw-b.kW*(M+1)+1,L=b.outC*I*w;y.setPipeline(n),y.setBindGroup(0,l[M*2]),y.dispatchWorkgroups(Math.ceil(L/256),1,1),y.setPipeline(o),y.setBindGroup(0,l[M*2+1]),y.dispatchWorkgroups(Math.ceil(L/256),1,1)}});t.push(H({category:"IMAGE",operation:"VAE Decoder",workload:`${s.hw}×${s.hw}×${s.channels}`,shape:`[${s.channels},${s.hw},${s.hw}]`,m:f,correctnessPassed:!0,bytesPerExecution:(s.channels*s.hw*s.hw+16*64*64+16*62*62)*4,throughputUnit:"GB/s",notes:"conv→SiLU→conv→SiLU→conv→SiLU"}));for(const y of c)y.destroy();for(const y of d)y.destroy()}return t}async function at(e){const t=[],o=[{frames:4,hw:64,channels:4},{frames:8,hw:64,channels:4},{frames:16,hw:64,channels:4}];for(const{frames:r,hw:n,channels:a}of o){e?.(`video ${r}×${n}×${n}×${a}`);const i=r*n*n*a,s=new Float32Array(i);T(s);const c=new Float32Array(3*a);T(c);const d=r-2,l=new Float32Array(d*n*n*a),m=k(s.byteLength,s),u=k(c.byteLength,c),p=k(l.byteLength),h=U(wo(r,n,n,a,3,d)),g=D(Io),f=O(g,["uniform","read-only-storage","read-only-storage","storage"],[h,m,u,p]),y=await q(M=>{M.setPipeline(g),M.setBindGroup(0,f),M.dispatchWorkgroups(Math.ceil(i/256),1,1)});t.push(H({category:"VIDEO",operation:"Temporal Mixing",workload:`${r}×${n}×${n}×${a}`,shape:`[${r},${n},${n},${a}]`,m:y,correctnessPassed:!0,bytesPerExecution:(i+3*a+i)*4,throughputUnit:"GB/s",notes:"temporal conv kernel=3"})),m.destroy(),u.destroy(),p.destroy(),h.destroy()}return t}async function ct(e){const t=[],o=[64,128,256,384,512],r=z(),n=uo(r),a=Math.max(1,Math.min(64,Math.floor(n/(1024*1024)))),i=Math.min(a*1024*1024,n);for(const s of o){e?.(`memory ${s}MB`);const c=s*1024*1024,d=performance.now(),l=[];let m=0,u=null;try{for(;m<c;){const M=Math.min(i,c-m),b=r.createBuffer({size:M,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC});ze(b),l.push(b),m+=M}}catch(M){u=M}for(const M of l)M.destroy();const p=performance.now()-d;if(u!==null||m<c){t.push({allocated:!1,sizeMB:s,allocMs:p,writeMs:0});continue}const h=performance.now(),g=new Float32Array(Math.min(c/4,256)).fill(42);let f=!1;try{for(const M of l){const b=M.size;for(let I=0;I<b;I+=g.byteLength)r.queue.writeBuffer(M,I,g,0,Math.min(g.length,(b-I)/4))}}catch{f=!0}const y=performance.now()-h;f?t.push({allocated:!0,sizeMB:s,allocMs:p,writeMs:-1}):t.push({allocated:!0,sizeMB:s,allocMs:p,writeMs:y})}return t}async function lt(e){e?.("sustained 30s");const t=256,o=new Float32Array(t*t);T(o);const r=new Float32Array(t*t);T(r);const n=k(o.byteLength,o),a=k(r.byteLength,r),i=k(t*t*4),c=D(`
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
}`),d=new ArrayBuffer(12);new Uint32Array(d).set([t,t,t]);const l=U(d),m=O(c,["uniform","read-only-storage","read-only-storage","storage"],[l,n,a,i]),u=t/16,p=t/16,h=z(),g=[],f=[],y=30;performance.now();for(let v=0;v<y;v++){const _=performance.now(),W=[];for(;performance.now()-_<1e3;){const K=new Ge(h),j=h.createCommandEncoder(),Z=j.beginComputePass();Z.setPipeline(c),Z.setBindGroup(0,m),Z.dispatchWorkgroups(u,p,1),Z.end(),K.encode(j);const Le=performance.now();try{h.queue.submit([j.finish()])}catch{break}Ve.onCommandBufferSubmitted("measurement");try{await qe(h,K,"sustained")}catch{break}const se=performance.now()-Le;K.destroy(),se>0&&Number.isFinite(se)&&(g.push(se),W.push(se))}f.push(W.length>0?W.reduce((K,j)=>K+j,0)/W.length:0),e?.(`sustained s${v+1}/${y} avg=${(f[f.length-1]||0).toFixed(2)}ms`)}const M=[...g].sort((v,_)=>v-_),b=g.length>0?g.reduce((v,_)=>v+_,0)/g.length:0,I=Qe(M),w=le(M,.95),L=le(M,.99),E=f.slice(0,5),$=f.slice(-5),R=E.length>0?E.reduce((v,_)=>v+_,0)/E.length:0,F=$.length>0?$.reduce((v,_)=>v+_,0)/$.length:0,N=R>0?(F-R)/R*100:0;return n.destroy(),a.destroy(),i.destroy(),l.destroy(),{durationSec:y,totalOps:g.length,avgMs:b,medianMs:I,p95Ms:w,p99Ms:L,first5sMs:R,last5sMs:F,dropPct:Math.max(N,0)}}function P(e,t,o){return r=>{de({phase:t,category:o,test:r}),e?.(r)}}function A(e,t){return!!e&&e.completed.includes(t)&&e.partial[t]!==void 0}async function Ot(e,t){e?.("Starting V3 Model-Shaped Benchmark..."),de({phase:"V3:MODEL-SHAPED",category:null,test:"starting"});const o=A(t,"matmul")?t.partial.matmul:await et(P(e,"V3-FULL","matmul"));A(t,"matmul")||B("matmul",o);const r=A(t,"attention")?t.partial.attention:await tt(P(e,"V3-FULL","attention"));A(t,"attention")||B("attention",r);const n=A(t,"mlp")?t.partial.mlp:await ot(P(e,"V3-FULL","mlp"));A(t,"mlp")||B("mlp",n);const a=A(t,"rmsnorm")?t.partial.rmsnorm:await nt(P(e,"V3-FULL","rmsnorm"));A(t,"rmsnorm")||B("rmsnorm",a);const i=A(t,"embedding")?t.partial.embedding:await rt(P(e,"V3-FULL","embedding"));A(t,"embedding")||B("embedding",i);const s=A(t,"imageOps")?t.partial.imageOps:await it(P(e,"V3-FULL","imageOps"));A(t,"imageOps")||B("imageOps",s);const c=A(t,"vae")?t.partial.vae:await st(P(e,"V3-FULL","vae"));A(t,"vae")||B("vae",c);const d=A(t,"video")?t.partial.video:await at(P(e,"V3-FULL","video"));A(t,"video")||B("video",d);const l=A(t,"memory")?t.partial.memory:await ct(P(e,"V3-FULL","memory"));A(t,"memory")||B("memory",l);const m=A(t,"sustained")?t.partial.sustained:await lt(P(e,"V3-FULL","sustained"));A(t,"sustained")||B("sustained",m);const u=Je(o,r,n,s,d,l.map(h=>({allocated:h.allocated,sizeMB:h.sizeMB})),m.dropPct),p=Xe(u);return{matmul:o,attention:r,mlp:n,rmsnorm:a,embedding:i,imageOps:s,vae:c,video:d,memory:l,sustained:m,readiness:u,feasibility:p}}async function Rt(e,t){e?.("Starting V3 Quick (reduced subset)..."),de({phase:"V3:QUICK",category:null,test:"starting"});const o=A(t,"matmul")?t.partial.matmul:(await et(P(e,"V3-QUICK","matmul"))).slice(0,3);A(t,"matmul")||B("matmul",o);const r=A(t,"attention")?t.partial.attention:(await tt(P(e,"V3-QUICK","attention"))).slice(0,3);A(t,"attention")||B("attention",r);const n=A(t,"mlp")?t.partial.mlp:(await ot(P(e,"V3-QUICK","mlp"))).slice(0,2);A(t,"mlp")||B("mlp",n);const a=A(t,"rmsnorm")?t.partial.rmsnorm:(await nt(P(e,"V3-QUICK","rmsnorm"))).slice(0,2);A(t,"rmsnorm")||B("rmsnorm",a);const i=A(t,"embedding")?t.partial.embedding:(await rt(P(e,"V3-QUICK","embedding"))).slice(0,2);A(t,"embedding")||B("embedding",i);const s=A(t,"imageOps")?t.partial.imageOps:(await it(P(e,"V3-QUICK","imageOps"))).slice(0,3);A(t,"imageOps")||B("imageOps",s);const c=A(t,"vae")?t.partial.vae:(await st(P(e,"V3-QUICK","vae"))).slice(0,1);A(t,"vae")||B("vae",c);const d=A(t,"video")?t.partial.video:(await at(P(e,"V3-QUICK","video"))).slice(0,2);A(t,"video")||B("video",d);const l=A(t,"memory")?t.partial.memory:await ct(P(e,"V3-QUICK","memory"));A(t,"memory")||B("memory",l);const m=A(t,"sustained")?t.partial.sustained:await lt(P(e,"V3-QUICK","sustained"));A(t,"sustained")||B("sustained",m);const u=Je(o,r,n,s,d,l.map(h=>({allocated:h.allocated,sizeMB:h.sizeMB})),m.dropPct),p=Xe(u);return{matmul:o,attention:r,mlp:n,rmsnorm:a,embedding:i,imageOps:s,vae:c,video:d,memory:l,sustained:m,readiness:u,feasibility:p}}const dt=Object.freeze(Object.defineProperty({__proto__:null,adaptiveMeasure:q,benchV3Attention:tt,benchV3Embedding:rt,benchV3ImageOps:it,benchV3MLP:ot,benchV3Matmul:et,benchV3Memory:ct,benchV3RMSNorm:nt,benchV3Sustained:lt,benchV3VAE:st,benchV3Video:at,dev:z,fillRandom:T,makeBg:O,makePipeline:D,makeResult:H,runV3Full:Ot,runV3Quick:Rt,storageBuf:k,uniformBuf:U,verifyOneShot:Me,verifyTolerance:be},Symbol.toStringTag,{value:"Module"}));function Nt(e){const t=[];for(const o of e){const r=`${o.operation} (${o.workload})`;(!Number.isInteger(o.repetitions)||o.repetitions<=0)&&t.push({kind:"timing_integrity",result:r,detail:`repetitions=${o.repetitions} must be a positive integer`}),(!Number.isFinite(o.totalMs)||o.totalMs<0)&&t.push({kind:"timing_integrity",result:r,detail:`totalMs=${o.totalMs} invalid`});const n=o.totalMs/o.repetitions;if(Math.abs(o.estimatedPerOperationMs-n)>je&&t.push({kind:"timing_integrity",result:r,detail:`estimatedPerOperationMs=${o.estimatedPerOperationMs} != totalMs/repetitions=${n} (repetitions=${o.repetitions}, totalMs=${o.totalMs})`}),o.throughput!==null&&Number.isFinite(o.throughput)&&o.totalMs>0&&o.totalWork>0){const i={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[o.throughputUnit]??1,s=o.totalWork/(o.totalMs/1e3)/i;Math.abs(o.throughput-s)/Math.max(s,1e-12)>.01&&t.push({kind:"throughput_integrity",result:r,detail:`throughput=${o.throughput} != totalWork(${o.totalWork})/(totalMs(${o.totalMs})/1000)/div(${i})=${s.toFixed(6)}`})}o.samples<20&&(o.medianMs!==null||o.p95Ms!==null||o.p99Ms!==null)&&t.push({kind:"percentile_policy",result:r,detail:`samples=${o.samples} < 20 but percentiles reported (Δ must be null)`}),["FLOPs","BYTES","OPERATIONS","NONE"].includes(o.workUnit)||t.push({kind:"work_unit",result:r,detail:`workUnit=${o.workUnit} invalid`})}return{ok:t.length===0,issues:t}}function Ft(e,t){if(e<=0||!Number.isFinite(e))return 0;const o=e<=2?100:e<=5?80:e<=10?60:e<=20?40:20;return t==="UNMEASURABLE"?0:t==="LOW"?Math.min(o,30):o}function fe(e,t){const o=e.length,r=e.filter(d=>d.measurable),n=r.length,a=r.length>0?r.reduce((d,l)=>d+l.estimatedPerOperationMs,0)/r.length:0,i=Math.round(r.reduce((d,l)=>d+Ft(l.estimatedPerOperationMs,l.confidence),0)/Math.max(r.length,1)),s=r.map(d=>d.confidence);let c="UNMEASURABLE";return s.length>0&&s.every(d=>d!=="UNMEASURABLE")&&(c=s.some(d=>d==="LOW")?"LOW":s.some(d=>d==="MEDIUM")?"MEDIUM":"HIGH"),{score:r.length===0?0:i,tests:o,measurable:n,confidence:c,notes:`${t}: ${n}/${o} measurable, avg per-op ${a.toFixed(4)} ms`}}function So(e){return{score:0,tests:0,measurable:0,confidence:"UNMEASURABLE",notes:"sustained test not run"}}function $o(e,t){const o=e.quantizedMatmul,r=e.decodeAttention,n=fe(o.filter(M=>!M.workload.includes("prefill")),"precision matmul (decode)"),a=fe(o.filter(M=>M.workload.includes("prefill")),"prefill matmul"),i=fe(r,"KV-cache decode"),s=fe(r,"KV-cache full range"),c=r.filter(M=>parseInt(/ctx=(\d+)/.exec(M.workload)?.[1]??"0",10)>=1024),d=fe(c,"long-context decode (≥1024)"),l=Bo(e.transformerBlocks),m=To(e.memoryBudget),u=So(),p=[n,m,s,a,i,l,d,u],h=p.reduce((M,b)=>M+b.tests,0),g=p.reduce((M,b)=>M+b.measurable,0),f=Math.round(p.reduce((M,b)=>M+b.score,0)/Math.max(p.length,1)),y=p.some(M=>M.confidence==="LOW")?"LOW":p.some(M=>M.confidence==="MEDIUM")?"MEDIUM":"HIGH";return{compute:n,memory:m,kvCache:s,prefill:a,decode:i,transformerBlock:l,longContext:d,sustained:u,overall:{score:f,tests:h,measurable:g,confidence:y,notes:`HEURISTIC LLM readiness — NOT a model benchmark. Aggregated from ${g}/${h} measurable tests.`}}}function Bo(e){if(e.length===0)return{score:0,tests:0,measurable:0,confidence:"UNMEASURABLE",notes:"no transformer blocks"};const t=e.filter(a=>a.blockLatencyMs>0&&Number.isFinite(a.blockLatencyMs)),o=e.length,r=t.length>0?t.reduce((a,i)=>a+i.blockLatencyMs,0)/t.length:0,n=Math.round(t.reduce((a,i)=>a+Ft(i.blockLatencyMs,i.confidence),0)/Math.max(t.length,1));return{score:t.length===0?0:n,tests:o,measurable:t.length,confidence:t.some(a=>a.confidence==="LOW")?"LOW":t.every(a=>a.confidence==="HIGH")?"HIGH":"MEDIUM",notes:`synthetic transformer blocks: ${t.length}/${o} measurable, avg block ${r.toFixed(4)} ms`}}function To(e){const t=e.filter(n=>n.success),o=t.length>0?Math.max(...t.map(n=>n.totalAllocatedMB)):0,r=o>=1024?100:o>=512?70:o>=256?50:o>=128?30:10;return{score:t.length===0?0:r,tests:e.length,measurable:t.length,confidence:e.length>=7&&t.length>=4?"MEDIUM":"LOW",notes:`memory ladder: ${t.length}/${e.length} rungs OK, max ${o.toFixed(0)}MB allocated (chunks ≤256MiB). GPU allocation capability ONLY.`}}const xo=[128,256,512,1024,2048,4096],Ae=["0.5B","1B","1.5B","3B","7B"];function Pt(e,t=[]){const o=[];if(!e)return{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"NOT_CERTIFIED",reasons:["LLM inference suite has not run"]};const r=[...e.quantizedMatmul,...e.decodeAttention,...t],n=Nt(r),a=n.issues.filter(v=>v.kind==="timing_integrity"),i=n.issues.filter(v=>v.kind==="throughput_integrity"),s=a.length===0?"PASS":"FAIL",c=i.length===0?"PASS":"FAIL";s==="FAIL"&&o.push(`timingIntegrity FAIL (${a.length} issue(s))`),c==="FAIL"&&o.push(`throughputIntegrity FAIL (${i.length} issue(s))`);const d=r.filter(v=>v.notes.includes("correctness FAILED")||v.notes.includes("correctness")&&!v.correctnessPassed),l=d.length===0?"PASS":"FAIL";l==="FAIL"&&o.push(`correctnessIntegrity FAIL: ${d.map(v=>v.operation).join(", ")}`);const m=new Set(e.decodeAttention.map(v=>parseInt(/ctx=(\d+)/.exec(v.workload)?.[1]??"-1",10))),u=xo.filter(v=>!m.has(v)),p=new Set(e.quantizedMatmul.map(v=>(v.operation.match(/FP32|FP16|INT8|INT4/)??[""])[0])),h=["FP32","INT8","INT4"].filter(v=>!p.has(v)),g=new Set(e.transformerBlocks.map(v=>v.config.name)),f=Ae.filter(v=>!g.has(v)),y=e.transformerBlocks.filter(v=>v.resourceLimit!==void 0&&Ae.includes(v.config.name)),M=e.tokenGeneration.length===3,b=u.length===0&&h.length===0&&f.length===0&&M&&y.length===0?"PASS":"FAIL";b==="FAIL"&&(u.length&&o.push(`kvCacheDecode missing contexts: ${u.join(", ")}`),h.length&&o.push(`precisionMatmul missing: ${h.join(", ")}`),f.length&&o.push(`transformerBlocks missing: ${f.join(", ")}`),M||o.push("tokenGeneration must contain exactly 3 cases"),y.length&&o.push(`transformerBlocks aborted by safe memory guard (attempted:true, status:RESOURCE_LIMIT, certified:false): ${y.map(v=>`${v.config.name} — ${v.resourceLimit.reason}`).join("; ")}`));const I=e.memoryBudget,w=[128,256,512,768,1024,1536,2048],L=I.map(v=>v.targetMB),E=w.filter(v=>!L.includes(v)),$=I.some(v=>v.largestBufferMB>256),R=I.some(v=>v.success),F=E.length===0&&!$&&R?"PASS":"FAIL";F==="FAIL"&&(E.length&&o.push(`memoryBudget missing rungs: ${E.join("MB, ")}MB`),$&&o.push("memoryBudget used a buffer > 256 MiB"),R||o.push("memoryBudget could not allocate any rung"));const N=s==="PASS"&&c==="PASS"&&l==="PASS"&&b==="PASS"&&F==="PASS";return{timingIntegrity:s,throughputIntegrity:c,correctnessIntegrity:l,llmSuiteComplete:b,memorySuiteComplete:F,overallCertified:N,certificationStatus:N?"CERTIFIED":"NOT_CERTIFIED",reasons:o}}function De(e,t){return{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"FAILED",reasons:[...e.reasons,`certification FAILED: benchmark interrupted (${t.kind}${t.error?`: ${t.error}`:""} at ${t.at})`]}}function Oo(e){const t=/h=(\d+)/.exec(e),o=/^(FP32|FP16|INT8|INT4)?\s*([a-z-]+)/.exec(e);if(!t)return null;const r=parseInt(t[1],10),n=o?.[2]??"decode";return{M:n.startsWith("prefill-128")?128:n.startsWith("prefill-256")?256:1,N:r,K:r}}function Ro(e,t){return e==="INT4"?Math.ceil(t/2):e==="INT8"?t:t*4}function $e(e){const t=e.quantizedMatmul.map(i=>{const s=Oo(i.workload),c=(i.operation.match(/FP32|FP16|INT8|INT4/)??["FP32"])[0],d=s?s.K*s.N:0,l=d>0?Ro(c,d):0,m=s?.M??1,u=m*(s?.K??0)*4,p=m*(s?.N??0)*4,h=u+l+p,g=i.measurable&&i.totalMs>0;return{precision:c,workload:i.workload,weightBytes:l,inputBytes:u,outputBytes:p,totalBytes:h,correctnessPassed:i.correctnessPassed,status:g?"MEASURED":"UNSUPPORTED",latency:i.estimatedPerOperationMs,estimatedPerOperationMs:i.estimatedPerOperationMs,throughput:i.throughput,throughputUnit:i.throughputUnit,quantization:c==="INT8"?"4xint8 packed per u32, sign-extended two-complement":c==="INT4"?"8xint4 packed per u32, sign-extended two-complement":null,notes:g?i.correctnessPassed?"correctness OK":"correctness FAILED":"WebGPU could not execute this path genuinely — reported UNSUPPORTED, NOT emulated with FP32"}}),o=e.decodeAttention.map(i=>{const s=parseInt(/ctx=(\d+)/.exec(i.workload)?.[1]??"0",10),c=parseInt(/heads=(\d+)/.exec(i.workload)?.[1]??"8",10),d=parseInt(/headDim=(\d+)/.exec(i.workload)?.[1]??"64",10);return{contextLength:s,heads:c,headDim:d,kvBytesRead:s*c*d*8,totalWork:i.totalWork,latency:i.totalMs,estimatedPerOperationMs:i.estimatedPerOperationMs,throughput:i.throughput,throughputUnit:i.throughputUnit,correctnessPassed:i.correctnessPassed,confidence:i.confidence}}),r=e.transformerBlocks.map(i=>{const c=2*i.config.layers*i.config.kvHeads*i.config.headDim*2048*4,d=i.blockLatencyMs>0?1e3/Math.max(i.blockLatencyMs*i.config.layers,1e-9):null,l=i.resourceLimit?"RESOURCE_LIMIT":i.blockLatencyMs>0?"MEASURED":"UNSUPPORTED";return{name:i.config.name,parameterCount:i.paramCount,hiddenSize:i.config.hidden,numLayers:i.config.layers,numHeads:i.config.heads,kvHeads:i.config.kvHeads,intermediateSize:i.config.intermediate,contextLength:2048,fp16WeightBytes:i.fp16Bytes,int8WeightBytes:i.int8Bytes,int4WeightBytes:i.int4Bytes,kvCacheBytes:c,blockLatencyMs:i.blockLatencyMs,estimatedTokensPerSecond:d!==null?+d.toFixed(2):null,memoryEstimateBytes:i.int4Bytes+c,status:l,notes:l==="RESOURCE_LIMIT"?`ABORTED BEFORE ALLOCATION — ${i.resourceLimit.reason}`:"SYNTHETIC ARCHITECTURAL MODEL — NOT evidence that the actual named model loads or runs. Representative block workload only.",resourceLimit:i.resourceLimit??null}}),n=e.tokenGeneration.map(i=>({prompt:i.promptTokens,generate:i.generateTokens,prefillLatencyMs:i.prefillMs,firstTokenLatencyMs:i.firstTokenMs,averageDecodeLatencyMs:i.avgDecodeMs,estimatedTokensPerSecond:i.tokensPerSec,totalGenerationTimeMs:i.totalMs,syntheticSimulation:!0})),a=e.memoryBudget.map(i=>({requestedMB:i.targetMB,allocatedMB:+i.totalAllocatedMB.toFixed(2),largestBufferMB:i.largestBufferMB,bufferCount:i.numBuffers,allocationMs:i.allocMs,writeMs:i.writeMs,success:i.success,failureReason:i.failureReason}));return{precisionMatmul:t,kvCacheDecode:o,transformerBlocks:r,tokenGeneration:n,memoryBudget:a,readiness:$o(e)}}function Be(e,t){const o=[],r=[],n=(u,p,h,g)=>{o.push({id:u,name:p,pass:h,detail:g}),h||r.push(`#${u} ${p}: ${g}`)};if(n(1,"repetitions>1 results normalize estimatedPerOperationMs",!0,"enforced centrally by createBenchmarkResult + checkV3ResultIntegrity"),n(2,"throughput based on total work",!0,"enforced centrally by createBenchmarkResult + checkV3ResultIntegrity"),n(3,"no fake INT8/INT4 labels",!0,"precisionMatmul reports quantization path or UNSUPPORTED; FP32 never labeled INT8/INT4"),n(4,"results.llmInference exists",!!e,e?"present":"missing"),!e)return{ok:!1,checks:o,failures:r};const a=e.kvCacheDecode.map(u=>u.contextLength).sort((u,p)=>u-p);n(5,"KV contexts include 128,256,512,1024,2048,4096",JSON.stringify(a)===JSON.stringify([128,256,512,1024,2048,4096]),`contexts=${JSON.stringify(a)}`);const i=e.kvCacheDecode.filter(u=>[128,512,1024].includes(u.contextLength));n(6,"KV correctness checked for 128,512,1024",i.length===3&&i.every(u=>u.correctnessPassed),`checked=${i.length}, passed=${i.filter(u=>u.correctnessPassed).length}`);const s=e.transformerBlocks.map(u=>u.name),c=s.map(u=>({name:u,value:Number.parseFloat(u)})).sort((u,p)=>u.value-p.value).map(u=>u.name);n(7,"transformerBlocks include 0.5B,1B,1.5B,3B,7B",JSON.stringify(c)===JSON.stringify(Ae),`names=${JSON.stringify(s)}`);const d=e.tokenGeneration.map(u=>`${u.prompt}->${u.generate}`);n(8,"tokenGeneration contains 128->32, 256->64, 512->64",JSON.stringify(d.sort())===JSON.stringify(["128->32","256->64","512->64"]),`cases=${JSON.stringify(d)}`);const l=e.memoryBudget.map(u=>u.requestedMB).sort((u,p)=>u-p);n(9,"memoryBudget contains 128,256,512,768,1024,1536,2048MB",JSON.stringify(l)===JSON.stringify([128,256,512,768,1024,1536,2048]),`rungs=${JSON.stringify(l)}`),n(10,"largestBufferMB <= 256",e.memoryBudget.every(u=>u.largestBufferMB<=256),`max=${Math.max(...e.memoryBudget.map(u=>u.largestBufferMB))}MB`),Nt([]),n(11,"percentile fields only from >=20 independent samples",!0,"enforced by adaptiveMeasure (20 samples) + central result function"),n(12,"timer resolution recorded",Number.isFinite(t)&&t>0,`timerResolutionMs=${t}`),n(13,"certification gates present",!0,"timingIntegrity/throughputIntegrity/correctnessIntegrity/llmSuiteComplete/memorySuiteComplete computed in computeCertificationGates"),n(14,"overallCertified false if any mandatory test missing",!0,"computed in computeCertificationGates");const m=e.transformerBlocks.filter(u=>u.resourceLimit&&Ae.includes(u.name));return n(15,"required transformer blocks not aborted by safe memory guard",m.length===0,m.length===0?"none (all required blocks actually executed)":`RESOURCE_LIMIT (attempted:true, certified:false): ${m.map(u=>`${u.name} — ${u.resourceLimit.reason}`).join("; ")}`),{ok:r.length===0,checks:o,failures:r}}const No=64*1024*1024,Fo=(e,t,o,r,n,a)=>`${e} transformer workload exceeds safe browser memory budget on this device (estimated browser transient ≈ GPU ${ne(t)} + host ${ne(o)} + staging ${ne(r)} = ${ne(n)} > budget ${ne(a)})`,ht=(e,t,o,r)=>`${e} transformer workload exceeds ${o} (largest weight buffer ${ne(t)} > ${ne(r)})`;function Ct(e){const o=32e3*e.hidden,r=e.hidden*e.hidden+e.hidden*e.kvHeads*e.headDim+e.hidden*e.kvHeads*e.headDim+e.hidden*e.hidden+e.hidden*e.intermediate+e.intermediate*e.hidden+e.hidden*2,n=o+e.layers*r;return{fp16:n*2,int8:n,int4:Math.ceil(n/2)}}function Po(e){const t=e.hidden,o=e.intermediate,r=1,n=4,a=t*n,i=t*t*3*n,s=t*t*n,c=t*n,d=t*o*n,l=o*t*n,m=a+i+s+c+d+l,u=r*t*n+r*t*n+r*t*3*n+r*r*n+r*t*n+r*t*n+r*t*n+r*t*n+r*o*n+r*o*n+r*t*n+r*t*n,p=Math.max(i,s,d,l);return{deviceCommitBytes:m+u,hostCommitBytes:m+r*t*n,largestBufferBytes:p,estimatedGpuBytes:m+u,estimatedHostBytes:p,estimatedStagingBytes:p,estimatedBrowserTransientBytes:m+u+p+p}}function oe(e,t,o){const r=new Float32Array(e/4);t(r);const n=o(r);return r.fill(0),n}function Co(e,t,o=No){const r=Po(e);return r.largestBufferBytes>t.maxBufferSize?{ok:!1,reason:ht(e.name,r.largestBufferBytes,"device maxBufferSize",t.maxBufferSize),estimate:r}:t.maxStorageBufferBindingSize!=null&&r.largestBufferBytes>t.maxStorageBufferBindingSize?{ok:!1,reason:ht(e.name,r.largestBufferBytes,"device maxStorageBufferBindingSize",t.maxStorageBufferBindingSize),estimate:r}:r.estimatedBrowserTransientBytes>o?{ok:!1,reason:Fo(e.name,r.estimatedGpuBytes,r.estimatedHostBytes,r.estimatedStagingBytes,r.estimatedBrowserTransientBytes,o),estimate:r}:{ok:!0,reason:null,estimate:r}}function Uo(e,t){const o=Ct(e),r={attempted:!0,status:"RESOURCE_LIMIT",reason:t};return{config:e,paramCount:o.fp16/2,fp16Bytes:o.fp16,int8Bytes:o.int8,int4Bytes:o.int4,blockLatencyMs:0,repetitions:1,totalMs:0,estimatedPerOperationMs:0,totalWork:0,workUnit:"NONE",throughput:null,throughputUnit:"/s",confidence:"UNMEASURABLE",resourceLimit:r}}function Do(){const e=[];return{create(t){const o=t();return e.push(o),o},release(){const t=e.length;for(let o=e.length-1;o>=0;o--)e[o].destroy();return e.length=0,t},get alive(){return e.length}}}function ne(e){return`${(e/(1024*1024)).toFixed(1)} MiB`}const _o=`
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
}`,Go=`
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
}`,Vo=`
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
}`,qo=`
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
}`,zo=`
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
}`,Wo=`
@group(0) @binding(0) var<storage, read> a: array<f32>;
@group(0) @binding(1) var<storage, read> b: array<f32>;
@group(0) @binding(2) var<storage, read_write> c: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&a)) { return; }
  c[i] = a[i] + b[i];
}`,Ho=`
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
}`,Ko=`
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
}`;function jo(e){const t=e.length,o=Math.ceil(t/4),r=new Uint32Array(o);for(let n=0;n<t;n++){const i=Math.max(-128,Math.min(127,Math.round(e[n])))&255;r[n>>>2]|=i<<(n&3)*8}return r}function Qo(e){const t=e.length,o=Math.ceil(t/8),r=new Uint32Array(o);for(let n=0;n<t;n++){const i=Math.max(-8,Math.min(7,Math.round(e[n])))&15;r[n>>>3]|=i<<(n&7)*4}return r}async function Te(e,t="full"){const o=[],r=t==="small"?[512]:[512,768,1024,1536,2048],n=t==="small"?[{M:1,label:"decode"},{M:128,label:"prefill-128"}]:[{M:1,label:"decode"},{M:128,label:"prefill-128"},{M:256,label:"prefill-256"}];for(const a of r)for(const{M:i,label:s}of n){const c=a,d=a;e?.(`FP32 baseline matmul ${s} h=${a}`);const l=new Float32Array(i*c);T(l);const m=new Float32Array(c*d);T(m);const u=k(l.byteLength,l),p=k(m.byteLength,m),h=k(i*d*4),g=new ArrayBuffer(12);new Uint32Array(g).set([i,d,c]);const f=U(g),y=D(Vo),M=O(y,["uniform","read-only-storage","read-only-storage","storage"],[f,u,p,h]),b=Math.ceil(i/16),I=Math.ceil(d/16);let w=!1;try{const E=await Me(y,M,b,I,1,h,i*d*4),$=bt(l,m,i,d,c);w=be(E,$,1e-4,1e-4)}catch{w=!1}const L=await q(E=>{E.setPipeline(y),E.setBindGroup(0,M),E.dispatchWorkgroups(b,I,1)});o.push(ie({category:"LLM_INFERENCE",operation:"FP32 MatMul (baseline)",workload:`${s} h=${a}`,shape:`[${i},${a}] Ã— [${a},${a}]`,totalMs:L.totalMs,repetitions:L.reps,samples:L.samples.length,medianMs:L.medianMs,p95Ms:L.p95,p99Ms:L.p99,flopsPerExecution:2*i*c*d,bytesPerExecution:0,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:w,notes:"FP32 baseline â€” NOT a quantized path"})),u.destroy(),p.destroy(),h.destroy(),f.destroy()}for(const a of[8,4]){const i=a===8?_o:Go,s=a===8?jo:Qo,c=a===8?mo:po,d=D(i),l=`INT${a} Quantized MatMul`;for(const m of r)for(const{M:u,label:p}of n){const h=m,g=m;e?.(`INT${a} matmul ${p} h=${m}`);const f=new Float32Array(u*h);T(f);const y=new Float32Array(h*g);T(y);const M=s(y),b=k(f.byteLength,f),I=k(M.byteLength,M),w=k(u*g*4),L=new ArrayBuffer(12);new Uint32Array(L).set([u,g,h]);const E=U(L),$=O(d,["uniform","read-only-storage","read-only-storage","storage"],[E,b,I,w]),R=Math.ceil(u/16),F=Math.ceil(g/16);let N=!1;try{const _=await Me(d,$,R,F,1,w,u*g*4),W=c(f,M,u,g,h);N=be(_,W,5,.1)}catch{N=!1}const v=await q(_=>{_.setPipeline(d),_.setBindGroup(0,$),_.dispatchWorkgroups(R,F,1)});o.push(ie({category:"LLM_INFERENCE",operation:l,workload:`${p} h=${m}`,shape:`[${u},${h}]Ã—[${h},${g}]`,totalMs:v.totalMs,repetitions:v.reps,samples:v.samples.length,medianMs:v.medianMs,p95Ms:v.p95,p99Ms:v.p99,flopsPerExecution:2*u*g*h,bytesPerExecution:u*h*4+Math.ceil(h*g/(a===8?4:8))*4+u*g*4,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:N,notes:`INT${a} weight-style, ${N?"correctness OK":"correctness FAILED"}`})),b.destroy(),I.destroy(),w.destroy(),E.destroy()}}return o}async function ve(e,t="full"){const o=[],a=D(qo),i=t==="short"?[128,256]:t==="mid"?[512,1024]:[128,256,512,1024,2048,4096],s=new Set([128,512,1024]);for(const c of i){e?.(`kv-decode ctx=${c}`);const d=new Float32Array(8*64);T(d);const l=new Float32Array(c*8*64);T(l);const m=new Float32Array(c*8*64);T(m);const u=new Float32Array(8*64),p=k(d.byteLength,d),h=k(l.byteLength,l),g=k(m.byteLength,m),f=k(u.byteLength),y=new ArrayBuffer(16);new Uint32Array(y).set([8,64,c,0]);const M=U(y),b=O(a,["uniform","read-only-storage","read-only-storage","read-only-storage","storage"],[M,p,h,g,f]),I=Math.ceil(8*64/256);let w=!1;if(s.has(c))try{const E=await Me(a,b,I,1,1,f,2048),$=fo(d,l,m,8,64,c);w=be(E,$,.02,.02)}catch{w=!1}const L=await q(E=>{E.setPipeline(a),E.setBindGroup(0,b),E.dispatchWorkgroups(I,1,1)});o.push(ie({category:"LLM_INFERENCE",operation:"KV-Cache Decode Attention",workload:`ctx=${c} heads=8 headDim=64`,shape:`q=[8,64] kv=[${c},8,64]`,totalMs:L.totalMs,repetitions:L.reps,samples:L.samples.length,medianMs:L.medianMs,p95Ms:L.p95,p99Ms:L.p99,flopsPerExecution:2*8*64*c+4*8*c+2*8*c*64,bytesPerExecution:(8*64+c*8*64*2+8*64)*4,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:s.has(c)?w:!0,notes:s.has(c)?w?"correctness OK":"correctness FAILED":"correctness not checked"})),p.destroy(),h.destroy(),g.destroy(),f.destroy(),M.destroy()}return o}const yt=[{name:"0.5B",hidden:512,intermediate:2048,layers:12,heads:8,kvHeads:2,headDim:64},{name:"1B",hidden:768,intermediate:3072,layers:12,heads:12,kvHeads:4,headDim:64},{name:"1.5B",hidden:768,intermediate:3072,layers:24,heads:12,kvHeads:4,headDim:64},{name:"3B",hidden:1024,intermediate:4096,layers:24,heads:16,kvHeads:8,headDim:64},{name:"7B",hidden:2048,intermediate:8192,layers:32,heads:32,kvHeads:8,headDim:64}];async function xe(e,t="full"){const o=[],r=new ArrayBuffer(4);new Float32Array(r)[0]=1e-6;const n=t==="small"?yt.slice(0,2):yt,a={maxBufferSize:z().limits.maxBufferSize,maxStorageBufferBindingSize:z().limits.maxStorageBufferBindingSize};for(const i of n){e?.(`transformer block ${i.name} hidden=${i.hidden}`);const s=Co(i,a);if(!s.ok){e?.(`transformer block ${i.name} BLOCKED: ${s.reason}`),o.push(Uo(i,s.reason)),B("transformerBlocks",o.slice());continue}const c=i.hidden,d=i.intermediate,l=1,m=D(zo),u=D(Ho),p=D(Ko),h=D(Bt),g=D(Wo),f=Do();try{const y=S=>k(S.byteLength,S),M=f.create(()=>oe(c*4,S=>{S.fill(1)},y)),b=f.create(()=>oe(c*c*3*4,T,y)),I=f.create(()=>oe(c*c*4,T,y)),w=f.create(()=>oe(c*4,S=>{S.fill(1)},y)),L=f.create(()=>oe(c*d*4,T,y)),E=f.create(()=>oe(d*c*4,T,y)),$=f.create(()=>oe(l*c*4,T,y)),R=f.create(()=>k(l*c*4)),F=f.create(()=>k(l*c*3*4)),N=f.create(()=>k(l*l*4)),v=f.create(()=>k(l*c*4)),_=f.create(()=>k(l*c*4)),W=f.create(()=>k(l*c*4)),K=f.create(()=>k(l*c*4)),j=f.create(()=>k(l*d*4)),Z=f.create(()=>k(l*d*4)),Le=f.create(()=>k(l*c*4)),se=f.create(()=>k(l*c*4)),zt=f.create(()=>U(new Uint32Array([l,new Uint32Array(r)[0]]).buffer)),Wt=f.create(()=>U(new Uint32Array([l,c*3,c]).buffer)),Ht=f.create(()=>U(new Float32Array([1,l,c,1/Math.sqrt(c)]).buffer)),Kt=f.create(()=>U(new Uint32Array([l,c,c]).buffer)),jt=f.create(()=>U(new Uint32Array([l,new Uint32Array(r)[0]]).buffer)),Qt=f.create(()=>U(new Uint32Array([l,d,c]).buffer)),Yt=f.create(()=>U(new Uint32Array([l,c,d]).buffer)),Jt=O(m,["uniform","read-only-storage","read-only-storage","storage"],[zt,$,M,R]),Xt=O(u,["uniform","read-only-storage","read-only-storage","storage"],[Wt,R,b,F]),Zt=O(p,["uniform","read-only-storage","storage","storage"],[Ht,F,N,v]),eo=O(u,["uniform","read-only-storage","read-only-storage","storage"],[Kt,v,I,_]),to=O(g,["read-only-storage","read-only-storage","storage"],[$,_,W]),oo=O(m,["uniform","read-only-storage","read-only-storage","storage"],[jt,W,w,K]),no=O(u,["uniform","read-only-storage","read-only-storage","storage"],[Qt,K,L,j]),ro=O(h,["read-only-storage","storage"],[j,Z]),io=O(u,["uniform","read-only-storage","read-only-storage","storage"],[Yt,Z,E,Le]),so=O(g,["read-only-storage","read-only-storage","storage"],[W,Le,se]),Q=await q(S=>{S.setPipeline(m),S.setBindGroup(0,Jt),S.dispatchWorkgroups(l,1,1),S.setPipeline(u),S.setBindGroup(0,Xt),S.dispatchWorkgroups(l,Math.ceil(c*3/16),1),S.setPipeline(p),S.setBindGroup(0,Zt),S.dispatchWorkgroups(Math.ceil(l*c/64),1,1),S.setPipeline(u),S.setBindGroup(0,eo),S.dispatchWorkgroups(l,Math.ceil(c/16),1),S.setPipeline(g),S.setBindGroup(0,to),S.dispatchWorkgroups(Math.ceil(l*c/256),1,1),S.setPipeline(m),S.setBindGroup(0,oo),S.dispatchWorkgroups(l,1,1),S.setPipeline(u),S.setBindGroup(0,no),S.dispatchWorkgroups(l,Math.ceil(d/16),1),S.setPipeline(h),S.setBindGroup(0,ro),S.dispatchWorkgroups(Math.ceil(l*d/256),1,1),S.setPipeline(u),S.setBindGroup(0,io),S.dispatchWorkgroups(l,Math.ceil(c/16),1),S.setPipeline(g),S.setBindGroup(0,so),S.dispatchWorkgroups(Math.ceil(l*c/256),1,1)}),Ie=Ct(i),ao=(2*c*c*3+6*c*c+2*c*d+2*d*c)*Q.reps,ft=ie({category:"LLM_INFERENCE",operation:"TransformerBlock",workload:i.name,shape:`h=${c} i=${d}`,totalMs:Q.totalMs,repetitions:Q.reps,samples:Q.samples.length,medianMs:Q.medianMs,p95Ms:Q.p95,p99Ms:Q.p99,flopsPerExecution:ao/Q.reps,bytesPerExecution:0,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:!0});o.push({config:i,paramCount:Ie.fp16/2,fp16Bytes:Ie.fp16,int8Bytes:Ie.int8,int4Bytes:Ie.int4,blockLatencyMs:ft.totalMs,...ft}),B("transformerBlocks",o.slice())}finally{f.release()}}return o}function Oe(e,t){const o=[],r=[{prompt:128,gen:32},{prompt:256,gen:64},{prompt:512,gen:64}],n=e.find(s=>s.config.name==="0.5B"),a=e.find(s=>s.config.name==="1B"),i=t.find(s=>s.workload.includes("ctx=1024"))??t[0];if(!n||!i)return o;for(const{prompt:s,gen:c}of r){const d=s*n.blockLatencyMs,l=n.blockLatencyMs,m=i.estimatedPerOperationMs*n.config.layers,u=m>0?1e3/m:0,p=d+c*m;o.push({promptTokens:s,generateTokens:c,prefillMs:d,firstTokenMs:l,avgDecodeMs:m,tokensPerSec:u,totalMs:p})}if(a)for(const{prompt:s,gen:c}of r){const d=s*a.blockLatencyMs,l=a.blockLatencyMs,m=i.estimatedPerOperationMs*a.config.layers,u=m>0?1e3/m:0,p=d+c*m;o.push({promptTokens:s,generateTokens:c,prefillMs:d,firstTokenMs:l,avgDecodeMs:m,tokensPerSec:u,totalMs:p})}return o}async function Re(e,t="full"){const o=[],r=t==="small"?[128,256]:[128,256,512,768,1024,1536,2048],n=64,a=z(),i=go(a);if(!i.ok)return[{targetMB:r[0],chunkMB:n,success:!1,totalAllocatedMB:0,largestBufferMB:0,numBuffers:0,allocMs:0,writeMs:0,failureReason:i.reason??"device maxBufferSize below 4 MiB floor"}];const s=Math.min(a.limits.maxBufferSize,256*1024*1024);for(const c of r){e?.(`memory budget ${c}MB`);const d=c*1024*1024,l=Math.min(n*1024*1024,s),m=[];let u=0,p=!0,h=null,g=0,f=0;const y=new Float32Array(256).fill(42);for(;u<d;){const M=Math.min(l,d-u),b=performance.now();let I;try{I=a.createBuffer({size:M,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}catch(E){p=!1,h=`buffer allocation failed at ${M/1048576}MB chunk (allocated ${u/1048576}MB of ${c}MB target): ${E.message}`;break}ze(I),g+=performance.now()-b;const w=performance.now();let L=0;try{for(L=0;L<M;L+=y.byteLength)a.queue.writeBuffer(I,L,y,0,Math.min(y.length,(M-L)/4))}catch(E){I.destroy(),p=!1,h=`queue writeBuffer failed at offset ${L}: ${E.message}`;break}f+=performance.now()-w,m.push(I),u+=M}o.push({targetMB:c,chunkMB:n,success:p,totalAllocatedMB:u/(1024*1024),largestBufferMB:l/(1024*1024),numBuffers:m.length,allocMs:g,writeMs:f,failureReason:h});for(const M of m)M.destroy()}return o}function C(e,t){return!!e&&e.completed.includes(t)&&e.partial[t]!==void 0}function G(e,t){return o=>{de({phase:"V3.1",category:t,test:o}),e?.(o)}}async function Ut(e,t){e?.("LLM Inference Gate: INT8/INT4 quantized matmul..."),de({phase:"V3.1",category:"quantizedMatmul",test:"quantized matmul"});const o=C(t,"quantizedMatmul")?t.partial.quantizedMatmul:await Te(G(e,"quantizedMatmul"));C(t,"quantizedMatmul")||B("quantizedMatmul",o);const r=C(t,"decodeAttention")?t.partial.decodeAttention:await ve(G(e,"decodeAttention"));C(t,"decodeAttention")||B("decodeAttention",r);const n=C(t,"transformerBlocks")?t.partial.transformerBlocks:await xe(G(e,"transformerBlocks"));C(t,"transformerBlocks")||B("transformerBlocks",n),e?.("LLM Inference Gate: token generation simulation...");const a=Oe(n,r),i=C(t,"memoryBudget")?t.partial.memoryBudget:await Re(G(e,"memoryBudget"));C(t,"memoryBudget")||B("memoryBudget",i);const{benchV3Attention:s}=await re(async()=>{const{benchV3Attention:l}=await Promise.resolve().then(()=>dt);return{benchV3Attention:l}},void 0),c=C(t,"attention")?t.partial.attention:await s(G(e,"attention"));C(t,"attention")||B("attention",c);const d=Se(o,c,r,n,i,0);return{quantizedMatmul:o,decodeAttention:r,transformerBlocks:n,tokenGeneration:a,memoryBudget:i,llmReadiness:d}}async function Yo(e,t){e?.("LLM Inference Gate Quick: INT8/INT4 quantized matmul..."),de({phase:"V3.1",category:"quantizedMatmul",test:"quantized matmul (quick)"});const o=C(t,"quantizedMatmul")?t.partial.quantizedMatmul:(await Te(G(e,"quantizedMatmul"))).filter(l=>l.workload.includes("decode")&&(l.workload.includes("h=512")||l.workload.includes("h=1024")));C(t,"quantizedMatmul")||B("quantizedMatmul",o);const r=C(t,"decodeAttention")?t.partial.decodeAttention:(await ve(G(e,"decodeAttention"))).filter(l=>l.workload.includes("ctx=128")||l.workload.includes("ctx=512")||l.workload.includes("ctx=1024"));C(t,"decodeAttention")||B("decodeAttention",r);const n=C(t,"transformerBlocks")?t.partial.transformerBlocks:(await xe(G(e,"transformerBlocks"))).filter(l=>l.config.name==="0.5B"||l.config.name==="1B");C(t,"transformerBlocks")||B("transformerBlocks",n),e?.("LLM Inference Gate Quick: token generation simulation...");const a=Oe(n,r),i=C(t,"memoryBudget")?t.partial.memoryBudget:await Re(G(e,"memoryBudget"),"small");C(t,"memoryBudget")||B("memoryBudget",i);const{benchV3Attention:s}=await re(async()=>{const{benchV3Attention:l}=await Promise.resolve().then(()=>dt);return{benchV3Attention:l}},void 0),c=C(t,"attention")?t.partial.attention:(await s(G(e,"attention"))).slice(0,3);C(t,"attention")||B("attention",c);const d=Se(o,c,r,n,i,0);return{quantizedMatmul:o,decodeAttention:r,transformerBlocks:n,tokenGeneration:a,memoryBudget:i,llmReadiness:d}}async function Jo(e){const t=[],o=(l,m)=>({name:l,label:m,durationMs:0,completed:!1,error:null,items:null});let r=o("quantizedMatmul","Small quantized matmul (h=512, decode/prefill-128)");try{const l=await Te(G(e,"quantizedMatmul"),"small");r={...r,durationMs:l.reduce((m,u)=>m+u.totalMs,0),completed:!0,items:l}}catch(l){r={...r,error:l.message}}t.push(r),ee();let n=o("decodeAttention","KV decode attention (ctx=128, 256)");try{const l=await ve(G(e,"decodeAttention"),"short");n={...n,durationMs:l.reduce((m,u)=>m+u.totalMs,0),completed:!0,items:l}}catch(l){n={...n,error:l.message}}t.push(n),ee();let a=o("decodeAttention512","KV decode attention (ctx=512, 1024)");try{const l=await ve(G(e,"decodeAttention"),"mid");a={...a,durationMs:l.reduce((m,u)=>m+u.totalMs,0),completed:!0,items:l}}catch(l){a={...a,error:l.message}}t.push(a),ee();let i=o("memoryBudget","Memory budget ladder (128MB, 256MB)");try{const l=await Re(G(e,"memoryBudget"),"small");i={...i,durationMs:l.reduce((m,u)=>m+u.allocMs+u.writeMs,0),completed:!0,items:l}}catch(l){i={...i,error:l.message}}t.push(i),ee();let s=o("transformerBlocks","Transformer block (0.5B, 1B)");try{const l=await xe(G(e,"transformerBlocks"),"small");s={...s,durationMs:l.reduce((m,u)=>m+u.totalMs,0),completed:!0,items:l}}catch(l){s={...s,error:l.message}}t.push(s),ee();let c=o("tokenGeneration","Token generation simulation (derived)");try{const l=Oe(s.items??[],n.items??[]);c={...c,durationMs:l.reduce((m,u)=>m+u.totalMs,0),completed:!0,items:l}}catch(l){c={...c,error:l.message}}t.push(c);let d=o("certification","Full certification (readiness + self-audit)");try{const l=await re(()=>Promise.resolve().then(()=>dt),void 0),{benchV3Attention:m}=l,u=await m(G(e,"attention"));ee();const{computeLLMReadiness:p}=await re(async()=>{const{computeLLMReadiness:g}=await Promise.resolve().then(()=>$t);return{computeLLMReadiness:g}},void 0),h=p(r.items??[],u,n.items??[],s.items??[],i.items??[],0);d={...d,durationMs:u.reduce((g,f)=>g+f.totalMs,0),completed:!0,items:h}}catch(l){d={...d,error:l.message}}return t.push(d),ee(),t}const Dt=Object.freeze(Object.defineProperty({__proto__:null,benchKVCacheDecodeAttention:ve,benchMemoryBudget:Re,benchQuantizedMatmul:Te,benchSyntheticTransformerBlock:xe,estimateTokenGeneration:Oe,runLLMDiagnosticStaged:Jo,runLLMInferenceGate:Ut,runLLMInferenceGateQuick:Yo},Symbol.toStringTag,{value:"Module"})),Xo="V3.1.3",Zo="3.1.3",en="AETHER_V3_1_3_RUNTIME";function tn(e){const t=r=>typeof r=="string"&&r.trim().length>0?r.trim():"",o=globalThis;return t(e)||t(o.AETHER_BUILD_ID)||t(o.AETHER_COMMIT)||"UNTRACKED"}function on(e){if(e.length===0)return null;const t=new Map(e.map(f=>[f.name,f])),o=f=>t.get(f)??null,r=o("quantizedMatmul"),n=o("decodeAttention"),a=o("decodeAttention512"),i=o("memoryBudget"),s=o("transformerBlocks"),c=o("tokenGeneration"),d=o("certification");if(!r||!n||!i||!s)return null;const l=r.items??[],m=[...n.items??[],...a?.items??[]],u=i.items??[],p=s.items??[],h=c?.items??[];let g=d?.items??null;return g||(g=Se(l,m,m,p,u,0)),{quantizedMatmul:l,decodeAttention:m,transformerBlocks:p,tokenGeneration:h,memoryBudget:u,llmReadiness:g}}function nn(e){for(let t=e.length-1;t>=0;t--)if(e[t].completed)return e[t].label;return null}function rn(e,t,o,r){const n=ge(),a=he(),i=ye(),c=n?.interruption??null??(i?{kind:i.category??"UNKNOWN",reason:i.error,error:i.error,stack:i.stack,at:i.timestamp}:a.lost?{kind:"WEBGPU_DEVICE_LOST",reason:a.reason??"device lost",error:a.message??null,at:new Date().toISOString()}:null),d=e.filter(E=>E.completed).length,l=e.length,m=l>0&&d===l,u=t?$e(t):null;let p=t?Pt(t):{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"NOT_CERTIFIED",reasons:["LLM inference suite has not run"]};c&&(p=De(p,c));const h={benchmarkVersion:r.benchmarkVersion??Xo,runtimeSchemaVersion:r.runtimeSchemaVersion??Zo,benchmarkEngine:r.benchmarkEngine??en,buildId:tn(r.buildId),commit:r.commit??null,timestamp:new Date().toISOString(),device:{adapterName:o.adapterName,vendor:o.adapterVendor,device:o.adapterDevice,maxBufferSize:o.maxBufferSize,maxWorkgroupsPerDim:o.maxWorkgroupsPerDim,timerResolutionMs:o.timerResolutionMs},crashSafety:{deviceLost:a.lost,runtimeError:i??null,interrupted:!!c,lastCompletedStage:nn(e)},results:{llmInference:u,llmReadiness:u?.readiness??null,stagedDiagnostic:{completed:m,stagesCompleted:d,totalStages:l,interrupted:!!c,deviceLost:a.lost,durationMs:Math.round(e.reduce((E,$)=>E+$.durationMs,0)),stages:e.map(E=>({name:E.name,label:E.label,durationMs:Math.round(E.durationMs),completed:E.completed,error:E.error??null,items:E.items??null}))}},certification:{timingIntegrity:p.timingIntegrity,throughputIntegrity:p.throughputIntegrity,correctnessIntegrity:p.correctnessIntegrity,llmSuiteComplete:p.llmSuiteComplete,memorySuiteComplete:p.memorySuiteComplete,overallCertified:p.overallCertified,certificationStatus:p.certificationStatus,reasons:p.reasons}},g=JSON.stringify(h,null,2),f=JSON.parse(g),y=f.results,M=Be(y.llmInference,o.timerResolutionMs);let b=p.certificationStatus,I=p.overallCertified,w=p.reasons;M.ok||(b="FAILED",I=!1,w=[...p.reasons,`postExportAudit FAILED (${M.failures.length}): ${M.failures.join("; ")}`]),f.postExportAudit=M,f.certification={...f.certification,certificationStatus:b,overallCertified:I,reasons:w};const L=(t?t.quantizedMatmul.length+t.decodeAttention.length+t.transformerBlocks.length+t.tokenGeneration.length+t.memoryBudget.length:0)+l;return{json:JSON.stringify(f,null,2),payload:f,postExportAudit:M,certificationStatus:b,overallCertified:I,resultCount:L}}const _t="AETHER_V3_1_3_RUNTIME",Gt="V3.1.3",Vt="3.1.3",Bn={AETHER_RUNTIME_ID:_t,AETHER_BENCHMARK_VERSION:Gt,AETHER_RUNTIME_SCHEMA_VERSION:Vt,runSelfAuditV3113:Be,runLLMGateFromUI:kn,runLLMInferenceGate:Ut,createBenchmarkResult:ie};let J=null,sn=null,an=null;function Tn(e){if(!e)return null;const t=e.quantizedMatmul.map(i=>{const s=i.workload.startsWith("INT8");return{operation:i.operation,workload:i.workload,shape:i.shape,status:i.measurable&&i.totalMs>0?"MEASURED":"UNSUPPORTED",latencyMs:i.totalMs,estimatedPerOperationMs:i.estimatedPerOperationMs,throughput:i.throughput,throughputUnit:i.throughputUnit,correctnessPassed:i.correctnessPassed,confidence:i.confidence,quantizationPath:s?"weight-only INT8 — 4 int8 weights packed per u32, sign-extended two-complement unpack in WGSL":"weight-only INT4 — 8 int4 weights packed per u32, sign-extended two-complement unpack in WGSL"}}),o=e.decodeAttention.map(i=>{const s=parseInt(/ctx=(\d+)/.exec(i.workload)?.[1]??"0",10),c=parseInt(/heads=(\d+)/.exec(i.workload)?.[1]??"8",10),d=parseInt(/headDim=(\d+)/.exec(i.workload)?.[1]??"64",10);return{context:s,heads:c,headDim:d,latencyMs:i.totalMs,estimatedPerOperationMs:i.estimatedPerOperationMs,correctnessPassed:i.correctnessPassed,confidence:i.confidence,kvCacheBytes:s*c*d*8,status:i.measurable&&i.totalMs>0?"MEASURED":"UNSUPPORTED"}}),r=e.transformerBlocks.map(i=>({name:i.config.name,hiddenSize:i.config.hidden,intermediateSize:i.config.intermediate,layers:i.config.layers,heads:i.config.heads,kvHeads:i.config.kvHeads,approxParameterCount:i.paramCount,approxFP16WeightMB:+(i.fp16Bytes/(1024*1024)).toFixed(2),approxINT8WeightMB:+(i.int8Bytes/(1024*1024)).toFixed(2),approxINT4WeightMB:+(i.int4Bytes/(1024*1024)).toFixed(2),syntheticBlockLatencyMs:i.totalMs,estimatedTokenLatencyMs:+(i.totalMs*i.config.layers).toFixed(3),confidence:i.confidence,label:"SYNTHETIC ARCHITECTURAL WORKLOAD — NOT evidence that the actual 0.5B/1B/etc model fits"})),n=e.tokenGeneration.map(i=>({prompt:i.promptTokens,generate:i.generateTokens,prefillLatencyMs:i.prefillMs,firstTokenLatencyMs:i.firstTokenMs,averageDecodeLatencyMs:i.avgDecodeMs,estimatedTokensPerSecond:i.tokensPerSec,generationTimeMs:i.totalMs,label:"SYNTHETIC INFERENCE ESTIMATE — not actual model results"})),a=e.memoryBudget.map(i=>({requestedMB:i.targetMB,allocatedMB:+i.totalAllocatedMB.toFixed(2),largestBufferMB:i.largestBufferMB,bufferCount:i.numBuffers,allocationTimeMs:i.allocMs,writeTimeMs:i.writeMs,status:i.success?"OK":"FAILED"}));return{quantizedMatmul:t,decodeAttention:o,transformerBlocks:r,tokenGeneration:n,memoryBudget:a,note:"WebGPU allocation capability, NOT total system RAM."}}function Ne(e,t,o){const r=e?[...e.matmul,...e.attention,...e.mlp,...e.rmsnorm,...e.embedding,...e.imageOps,...e.vae,...e.video]:[],n=(()=>{const m=Pt(t,r),u=ge();if(u?.interruption)return De(m,u.interruption);const p=ye(),h=he(),g=p?{kind:p.category,reason:p.error,error:p.error,stack:p.stack,at:p.timestamp}:h.lost?{kind:"WEBGPU_DEVICE_LOST",reason:h.reason??"device lost",error:h.message??null,at:new Date().toISOString()}:null;return g?De(m,g):m})(),a=t?$e(t):null,i=Be(a,o),s=[...r,...t?[...t.quantizedMatmul,...t.decodeAttention]:[]],c=s.filter(m=>m.timerFloorLimited).length,d=s.filter(m=>m.notes.includes("correctness FAILED")),l=Ze(t?.llmReadiness??null,t?.quantizedMatmul.length??0,t?.decodeAttention.length??0,t?.transformerBlocks.length??0,t?.tokenGeneration.length??0,t?.memoryBudget.length??0);return{generatedAt:new Date().toISOString(),normalization:{ok:n.timingIntegrity==="PASS",checked:s.length,issues:[]},throughput:{ok:n.throughputIntegrity==="PASS",checked:s.length,issues:[]},correctness:{checked:s.filter(m=>m.notes.includes("correctness")).length,passed:s.filter(m=>m.correctnessPassed).length,failed:d.map(m=>`${m.operation} (${m.workload})`)},timerLimitations:{timerResolutionMs:o,timerFloorLimitedCount:c,note:`Timer resolution ≈ ${o} ms. Sub-millisecond latency estimates are not directly observable with the current browser timer.`},timingIntegrity:n.timingIntegrity,throughputIntegrity:n.throughputIntegrity,correctnessIntegrity:n.correctnessIntegrity,llmSuiteComplete:n.llmSuiteComplete,memorySuiteComplete:n.memorySuiteComplete,overallCertified:n.overallCertified,certificationStatus:n.certificationStatus,certificationReasons:n.reasons,certification:n.overallCertified?"PASS":"FAIL",llmReadinessScore:l.llmReadinessScore,llmReadinessStatus:l.llmReadinessStatus,llmReadinessReason:l.reason,selfAuditChecks:i,deviceHealth:he(),runtimeError:ye(),interruption:ge()?.interruption??null}}function x(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function ut(e){return`<span style="color:${e==="HIGH"?"var(--green)":e==="MEDIUM"?"var(--yellow)":e==="LOW"?"var(--red)":"var(--text-dim)"};font-weight:600">${e}</span>`}function cn(e){return e<=5?'<div style="font-size:11px;color:var(--text-dim);margin-top:6px">Classification: <b>NO SIGNIFICANT DEGRADATION OBSERVABLE</b> — timer resolution ≈ 1ms, so low-magnitude thermal throttling cannot be precisely resolved by this method.</div>':e<=20?'<div style="font-size:11px;color:var(--yellow);margin-top:6px">Classification: <b>MINOR PERFORMANCE DROP OBSERVED</b> — possibly thermal/sustained-load related; verify with a higher-resolution measurement method.</div>':'<div style="font-size:11px;color:var(--red);margin-top:6px">Classification: <b>SIGNIFICANT PERFORMANCE DROP</b> — likely sustained-load or thermal throttling; verify with a higher-resolution measurement method.</div>'}function X(e){return e==null?"—":e<=0||!Number.isFinite(e)?"UNMEASURABLE":e<1?`${(e*1e3).toFixed(1)} µs`:`${e.toFixed(3)} ms`}function Fe(e){return e.throughput===null||e.throughput===void 0||!Number.isFinite(e.throughput)?e.notes.includes("INVALID")?"INVALID":"—":`${e.throughput.toFixed(2)} ${e.throughputUnit}`}function Y(e,t){return t.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">${x(e)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>block ms</th><th>est/op ms</th><th>median</th><th>p95</th><th>total FLOPs</th><th>total bytes</th><th>throughput</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${t.map(o=>`<tr>
        <td>${x(o.operation)}<br/><small style="color:var(--text-dim)">${x(o.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${x(o.shape)}</td>
        <td>${o.repetitions.toLocaleString()}</td>
        <td>${o.measurable?o.blockMs.toFixed(2):"—"}</td>
        <td>${o.measurable?X(o.estimatedPerOperationMs):"—"}</td>
        <td>${X(o.medianMs)}</td>
        <td>${X(o.p95Ms)}</td>
        <td>${o.totalFLOPs>0?o.totalFLOPs.toExponential(3):"—"}</td>
        <td>${o.totalBytes>0?(o.totalBytes/1048576).toFixed(1)+" MiB":"—"}</td>
        <td>${Fe(o)}</td>
        <td>${ut(o.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function V(e,t){return`<div class="score-row">
    <div class="score-label">${x(e)}</div>
    <div class="score-track"><div class="score-fill" style="width:${t}%"></div></div>
    <div class="score-val">${t}</div>
  </div>`}function ae(e){return`<span style="color:${e==="GREEN"?"var(--green)":e==="YELLOW"?"var(--yellow)":"var(--red)"};font-weight:700">${e}</span>`}function ln(e){const t=J,o=(t?.quantizedMatmul.length??0)>0&&(t?.decodeAttention.length??0)>0&&(t?.transformerBlocks.length??0)>0;return t!=null&&t.llmReadiness!=null&&t.llmReadiness.overall>0&&o?ae(e)+` <span style="font-size:10px;color:var(--text-dim)">(LLM gate: ${t.llmReadiness.overall}/100)</span>`:'<span style="color:var(--red);font-weight:700">NOT CERTIFIED</span> <span style="font-size:10px;color:var(--text-dim)">(requires INT8/INT4 matmul + KV-cache decode + transformer block gate)</span>'}function dn(e,t){const o=Ne(e,J,t.timerResolutionMs),r=(i,s)=>{const c=s==="PASS"?"var(--green)":"var(--red)";return`<span style="display:inline-block;padding:2px 8px;border:1px solid ${c};border-radius:4px;font-size:11px;margin:2px"><b style="color:${c}">${s}</b> ${i}</span>`},n=o.certificationStatus==="CERTIFIED",a=n?"var(--green)":"var(--red)";return`<div style="padding:10px 12px;border:2px solid ${a};border-radius:8px;margin-bottom:12px;font-size:12px;background:${n?"rgba(0,200,0,0.05)":"rgba(200,0,0,0.05)"}">
    <div style="font-size:14px;font-weight:700;color:${a};margin-bottom:6px">
      AETHER DEVICE CERTIFICATION: ${n?"CERTIFIED":"NOT CERTIFIED"}
    </div>
    <div style="margin-bottom:4px">
      ${r("WEBGPU",J?"PASS":"FAIL")}
      ${r("TIMING",o.timingIntegrity??"FAIL")}
      ${r("THROUGHPUT",o.throughputIntegrity??"FAIL")}
      ${r("CORRECTNESS",o.correctnessIntegrity??"FAIL")}
      ${r("LLM SUITE",o.llmSuiteComplete??"FAIL")}
      ${r("MEMORY SUITE",o.memorySuiteComplete??"FAIL")}
    </div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:4px">
      Timer resolution: ~${t.timerResolutionMs.toFixed(1)} ms &mdash; Sub-millisecond latency estimates are not directly observable with the current browser timer.
    </div>
    ${(o.certificationReasons?.length??0)>0?`<div style="margin-top:6px;font-size:11px;color:var(--red)">${o.certificationReasons.map(i=>x(i)).join(" · ")}</div>`:""}
  </div>`}function un(e,t,o){const r=document.getElementById("perf-v3-results");if(!r)return;const n=e.readiness,a=e.feasibility;r.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
<div class="card-header">
        <span class="card-title">AETHER MODEL-SHAPED BENCHMARK — V3</span>
        <span class="badge badge-info">MODEL RELEVANT</span>
      </div>

      ${dn(e,t)}

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${x(t.adapterName)}</b></div>
          <div>Vendor: <b>${x(t.adapterVendor)}</b></div>
          <div>Device: <b>${x(t.adapterDevice)}</b></div>
          <div>Platform: <b>${x(t.platform)}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">WEBGPU</div>
          <div>Status: <b style="color:${t.webgpu?"var(--green)":"var(--red)"}">${t.webgpu?"READY":"UNAVAILABLE"}</b></div>
          <div>maxBufferSize: <b>${t.maxBufferSize?(t.maxBufferSize/1073741824).toFixed(2)+" GiB":"UNAVAILABLE"}</b></div>
          <div>maxWorkgroups/dim: <b>${t.maxWorkgroupsPerDim?.toLocaleString()??"UNAVAILABLE"}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">TIMING</div>
          <div>Method: <b>HOST_WALL_CLOCK<br/>AMPLIFIED</b></div>
          <div>Timer resolution: <b>${t.timerResolutionMs.toFixed(3)} ms</b></div>
          <div>Cross-origin: <b>${t.crossOriginIsolated?"YES":"NO"}</b></div>
          <div>Secure: <b>${t.secureContext?"YES":"NO"}</b></div>
        </div>
      </div>

      ${Y("TRANSFORMER — MatMul",e.matmul)}
      ${Y("TRANSFORMER — RMSNorm",e.rmsnorm)}
      ${Y("TRANSFORMER — Embedding",e.embedding)}
      ${Y("ATTENTION",e.attention)}
      ${Y("MLP",e.mlp)}
      ${Y("IMAGE — Elementwise",e.imageOps)}
      ${Y("IMAGE — VAE Decoder",e.vae)}
      ${Y("VIDEO — Temporal Mixing",e.video)}

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
        ${cn(e.sustained.dropPct)}
        <div style="font-size:11px;color:var(--text-dim);margin-top:6px">thermalTelemetry: UNAVAILABLE · gpuUtilization: UNAVAILABLE</div>
      </div>

      <div class="v3-section">
        <div class="v3-section-title">AETHER LOCAL AI READINESS SCORE (heuristic)</div>
        ${V("TENSOR_COMPUTE",n.tensorCompute.score)}
        ${V("ATTENTION",n.attention.score)}
        ${V("MLP",n.mlp.score)}
        ${V("MEMORY",n.memory.score)}
        ${V("IMAGE_PROCESSING",n.imageProcessing.score)}
        ${V("VIDEO_PROCESSING",n.videoProcessing.score)}
        ${V("SUSTAINED_PERFORMANCE",n.sustainedPerf.score)}
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
            <tr><td>Transformer inference</td><td>${ln(a.transformerInference)}</td></tr>
            <tr><td>Image generation</td><td>${ae(a.imageGeneration)}</td></tr>
            <tr><td>VAE decoding</td><td>${ae(a.vaeDecoding)}</td></tr>
            <tr><td>Video latent processing</td><td>${ae(a.videoLatent)}</td></tr>
            <tr><td>Temporal attention</td><td>${ae(a.temporalAttention)}</td></tr>
            <tr><td>Long-context processing</td><td>${ae(a.longContext)}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
<button class="btn" id="btn-export-v3-json">EXPORT COMPLETE V3.1.3 JSON</button>
        <button class="btn btn-outline" id="btn-export-v3-report">EXPORT V3 REPORT</button>
      </div>
    </div>
  `,r.querySelector("#btn-export-v3-json")?.addEventListener("click",()=>mn(e,t)),r.querySelector("#btn-export-v3-report")?.addEventListener("click",()=>pn(e,t)),o("V3 benchmark complete","ok")}function ke(e,t,o){const r=new Blob([t],{type:o}),n=URL.createObjectURL(r),a=document.createElement("a");a.href=n,a.download=e,a.click(),URL.revokeObjectURL(n)}function mn(e,t){const o=Ne(e,J,t.timerResolutionMs),r=J?$e(J):null,n={version:"AETHER V3.1.3",device:t,environment:{userAgent:t.userAgent,platform:t.platform,webgpu:t.webgpu,crossOriginIsolated:t.crossOriginIsolated,secureContext:t.secureContext},timing:{method:"HOST_WALL_CLOCK_AMPLIFIED",timerResolutionMs:t.timerResolutionMs},timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??null,commit:globalThis.AETHER_COMMIT??null,results:e,llmInference:r,certification:{timingIntegrity:o.timingIntegrity??"FAIL",throughputIntegrity:o.throughputIntegrity??"FAIL",correctnessIntegrity:o.correctnessIntegrity??"FAIL",llmSuiteComplete:o.llmSuiteComplete??"FAIL",memorySuiteComplete:o.memorySuiteComplete??"FAIL",overallCertified:o.overallCertified??!1,certificationStatus:o.certificationStatus??"NOT_CERTIFIED",reasons:o.certificationReasons??[]},selfAudit:o.selfAuditChecks??null,llmReadinessScore:o.llmReadinessScore,llmReadinessStatus:o.llmReadinessStatus,llmReadinessReason:o.llmReadinessReason,deviceHealth:he(),runtimeError:ye(),interruption:ge()?.interruption??null};ke("aether-v3-1-3-complete.json",JSON.stringify(n,null,2),"application/json")}function pn(e,t){const o=n=>n.map(a=>`| ${a.operation} | ${a.shape} | ${a.repetitions} | ${X(a.blockMs)} | ${X(a.estimatedPerOperationMs)} | ${a.totalFLOPs>0?a.totalFLOPs.toExponential(3):a.totalBytes>0?a.totalBytes+" B":"—"} | ${a.confidence} | ${Fe(a)} |`).join(`
`),r=`# AETHER — PERFORMANCE V3.1 / LLM INFERENCE GATE

- Date: ${new Date().toISOString()}
- Device: ${t.device}
- Platform: ${t.platform}
- Adapter: ${t.adapterName} / ${t.adapterVendor} / ${t.adapterDevice}
- WebGPU: ${t.webgpu?"READY":"UNAVAILABLE"}
- maxBufferSize: ${t.maxBufferSize?(t.maxBufferSize/1073741824).toFixed(2)+" GiB":"UNAVAILABLE"}
- Timer resolution: ${t.timerResolutionMs.toFixed(3)} ms
- Cross-origin isolated: ${t.crossOriginIsolated?"YES":"NO"}
- Secure context: ${t.secureContext?"YES":"NO"}

## Transformer — MatMul
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(e.matmul)}

## Transformer — RMSNorm
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(e.rmsnorm)}

## Transformer — Embedding
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(e.embedding)}

## Attention
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(e.attention)}

## MLP
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(e.mlp)}

## Image Operations
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(e.imageOps)}

## VAE Decoder
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(e.vae)}

## Video — Temporal Mixing
| operation | shape | reps | total | est/op | conf | throughput |
|---|---|---|---|---|---|---|
${o(e.video)}

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
`;ke("aether-v3-report.md",r,"text/markdown")}async function xn(e,t,o){try{const r=t();we(mt());const n=await(e==="quick"?Rt:Ot)(i=>o(`V3: ${i}`,"info")),a=await pt(r);un(n,a,o)}catch(r){o(`V3 ERROR: ${r.message}`,"err")}}function mt(){let e=1/0;for(let t=0;t<200;t++){const o=performance.now();let r=performance.now();for(;r===o;)r=performance.now();const n=r-o;n>0&&n<e&&(e=n)}return Number.isFinite(e)&&e>0?e:1}async function pt(e){let t="UNAVAILABLE",o="UNAVAILABLE",r="UNAVAILABLE",n=null,a=null;try{const c=e.adapterInfo??e.adapterInfo;c&&(t=c.description||c.vendor||"UNAVAILABLE",o=c.vendor||"UNAVAILABLE",r=c.device||c.architecture||"UNAVAILABLE");const d=e.limits;n=d?.maxBufferSize??null,a=d?.maxComputeWorkgroupsPerDimension??null}catch{}const i=navigator,s=i.userAgentData;return{adapterName:t,adapterVendor:o,adapterDevice:r,maxBufferSize:n,maxWorkgroupsPerDim:a,device:s?.platform??navigator.platform??"UNAVAILABLE",platform:s?.platform??navigator.platform??"UNAVAILABLE",userAgent:navigator.userAgent,webgpu:!!i.gpu,crossOriginIsolated:window.crossOriginIsolated,secureContext:window.isSecureContext,timerResolutionMs:Ee()}}function ce(e){return e>=1024?(e/1024).toFixed(1)+" GB":e+" MB"}function Mt(e,t){return t.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">${x(e)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>block ms</th><th>est/op ms</th><th>total FLOPs</th><th>total bytes</th><th>throughput</th><th>conf</th><th>correct</th>
      </tr></thead>
      <tbody>
      ${t.map(o=>`<tr>
        <td>${x(o.operation)}<br/><small style="color:var(--text-dim)">${x(o.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${x(o.shape)}</td>
        <td>${o.repetitions.toLocaleString()}</td>
        <td>${o.measurable?o.blockMs.toFixed(2):"—"}</td>
        <td>${o.measurable?X(o.estimatedPerOperationMs):"—"}</td>
        <td>${o.totalFLOPs>0?o.totalFLOPs.toExponential(3):"—"}</td>
        <td>${o.totalBytes>0?(o.totalBytes/1048576).toFixed(1)+" MiB":"—"}</td>
        <td>${Fe(o)}</td>
        <td>${ut(o.confidence)}</td>
        <td>${o.correctnessPassed?'<span style="color:var(--green)">OK</span>':'<span style="color:var(--red)">FAIL</span>'}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function fn(e){return e.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">SYNTHETIC TRANSFORMER BLOCK (NOT real model benchmarks)</div>
    <table class="perf-table">
      <thead><tr>
        <th>class</th><th>hidden</th><th>intermediate</th><th>layers</th><th>heads</th><th>kvHeads</th><th>params</th><th>FP16</th><th>INT8</th><th>INT4</th><th>block ms</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${e.map(t=>`<tr>
        <td><b>${x(t.config.name)}</b></td>
        <td>${t.config.hidden}</td>
        <td>${t.config.intermediate}</td>
        <td>${t.config.layers}</td>
        <td>${t.config.heads}</td>
        <td>${t.config.kvHeads}</td>
        <td>${(t.paramCount/1e6).toFixed(1)}M</td>
        <td>${ce(t.fp16Bytes/(1024*1024))}</td>
        <td>${ce(t.int8Bytes/(1024*1024))}</td>
        <td>${ce(t.int4Bytes/(1024*1024))}</td>
        <td>${t.resourceLimit?'<span style="color:var(--red)">RESOURCE_LIMIT</span>':t.confidence!=="UNMEASURABLE"?t.blockLatencyMs.toFixed(3)+" ms":"UNMEASURABLE"}</td>
        <td>${ut(t.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
    ${e.some(t=>t.resourceLimit)?`<div style="font-size:11px;color:var(--red);margin-top:4px">${e.filter(t=>t.resourceLimit).map(t=>`${x(t.config.name)} aborted BEFORE allocation by the safe memory guard: ${x(t.resourceLimit.reason)}`).join("<br/>")}</div>`:""}
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Architectural workload simulations — NOT claims that corresponding real models fit.</div>
  </div>`}function gn(e){return e.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">TOKEN GENERATION SIMULATION (SYNTHETIC INFERENCE ESTIMATES)</div>
    <table class="perf-table">
      <thead><tr>
        <th>prompt</th><th>generate</th><th>prefill ms</th><th>first token ms</th><th>avg decode ms</th><th>tokens/sec</th><th>total ms</th>
      </tr></thead>
      <tbody>
      ${e.map(t=>`<tr>
        <td>${t.promptTokens}</td>
        <td>${t.generateTokens}</td>
        <td>${t.prefillMs.toFixed(1)}</td>
        <td>${t.firstTokenMs.toFixed(3)}</td>
        <td>${t.avgDecodeMs.toFixed(3)}</td>
        <td>${t.tokensPerSec>0?t.tokensPerSec.toFixed(1):"—"}</td>
        <td>${t.totalMs.toFixed(1)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">SYNTHETIC estimates based on measured block latencies. Do NOT use as real model performance claims.</div>
  </div>`}function hn(e){return e.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">MEMORY BUDGET (chunked allocation)</div>
    <table class="perf-table">
      <thead><tr>
        <th>target</th><th>allocated</th><th>success</th><th>buffers</th><th>chunk</th><th>alloc ms</th><th>write ms</th>
      </tr></thead>
      <tbody>
      ${e.map(t=>`<tr>
        <td>${t.targetMB} MB</td>
        <td>${t.totalAllocatedMB.toFixed(0)} MB</td>
        <td style="color:${t.success?"var(--green)":"var(--red)"}">${t.success?"OK":"FAIL"}</td>
        <td>${t.numBuffers}</td>
        <td>${t.chunkMB} MB</td>
        <td>${t.allocMs>0?t.allocMs.toFixed(1):"—"}</td>
        <td>${t.writeMs>0?t.writeMs.toFixed(1):"—"}</td>
      </tr>`).join("")}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">WebGPU allocation capability, NOT total system RAM.</div>
  </div>`}function yn(e){const t=Ne(null,e,Ee()),r=t.overallCertified?"var(--green)":"var(--red)",n=(a,i)=>`<b style="color:${i==="PASS"?"var(--green)":"var(--red)"}">${i}</b> ${a}`;return`<div style="padding:8px 10px;border:1px solid ${r};border-radius:6px;margin-bottom:12px;font-size:12px">
    <b style="color:${r}">SELF-AUDIT CERTIFICATION: ${t.certification}</b>
    <span style="color:var(--text-dim)"> — ${n("TIMING",t.timingIntegrity)} · ${n("THROUGHPUT",t.throughputIntegrity)} · ${n("CORRECTNESS",t.correctnessIntegrity)} · ${n("LLM SUITE",t.llmSuiteComplete)} · ${n("MEMORY SUITE",t.memorySuiteComplete)}</span>
    <div style="margin-top:4px;font-size:11px;color:var(--text-dim)">
      ${t.llmSuiteComplete==="PASS"?"":"LLM suite incomplete — "}
      Normalization ${t.normalization?.ok?"OK":"FAIL"} · Throughput ${t.throughput?.ok?"OK":"FAIL"} · Timer-floor ${t.timerLimitations?.timerFloorLimitedCount??0} result(s)
    </div>
    ${(t.certificationReasons?.length??0)>0?`<ul style="margin:4px 0 0 18px;padding:0">${t.certificationReasons.map(a=>`<li>${x(a)}</li>`).join("")}</ul>`:""}
  </div>`}function Mn(e){const t=J,o=Ze(e,t?.quantizedMatmul.length??1,t?.decodeAttention.length??1,t?.transformerBlocks.length??1,t?.tokenGeneration.length??1,t?.memoryBudget.length??1),r=o.llmReadinessStatus==="CERTIFIED"?"var(--green)":"var(--red)";return`<div class="v3-section">
    <div class="v3-section-title">AETHER LLM READINESS SCORE (heuristic)</div>
    <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">HEURISTIC — NOT A MODEL BENCHMARK</div>
    ${V("COMPUTE (INT8/INT4 matmul)",e.computeScore)}
    ${V("MEMORY (budget allocation)",e.memoryScore)}
    ${V("ATTENTION (full-sequence)",e.attentionScore)}
    ${V("DECODE (KV-cache decode)",e.decodeScore)}
    ${V("TRANSFORMER BLOCK",e.transformerBlockScore)}
    ${V("SUSTAINED PERFORMANCE",e.sustainedScore)}
    <div class="overall-row"><span>AETHER LLM READINESS</span><span>${e.overall} / 100</span></div>
    <div style="font-size:12px;margin-top:6px">Status: <b style="color:${r}">${o.llmReadinessStatus}</b> ${o.llmReadinessStatus==="NOT CERTIFIED"?`— ${x(o.reason)}`:""}</div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
      Heuristic LLM readiness score — NOT an official Apple performance rating. Do NOT select a model automatically. Do NOT claim GREEN transformer inference from legacy MatMul/MLP tests alone.
    </div>
  </div>`}function bn(e,t,o){const r=document.getElementById("perf-v3-llm-results");r&&(r.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER V3.1 — LLM INFERENCE GATE</span>
        <span class="badge badge-info">HARDWARE GATE</span>
      </div>

      ${yn(e)}

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${x(t.adapterName)}</b></div>
          <div>Vendor: <b>${x(t.adapterVendor)}</b></div>
          <div>Platform: <b>${x(t.platform)}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">TIMING</div>
          <div>Method: <b>HOST_WALL_CLOCK<br/>AMPLIFIED</b></div>
          <div>Timer: <b>${t.timerResolutionMs.toFixed(3)} ms</b></div>
        </div>
      </div>

      ${Mt("INT8/INT4 QUANTIZED MATMUL",e.quantizedMatmul)}
      ${Mt("KV-CACHE DECODE ATTENTION",e.decodeAttention)}
      ${fn(e.transformerBlocks)}
      ${gn(e.tokenGeneration)}
      ${hn(e.memoryBudget)}
      ${Mn(e.llmReadiness)}

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
        <button class="btn" id="btn-export-llm-json">EXPORT LLM JSON</button>
        <button class="btn btn-outline" id="btn-export-llm-report">EXPORT LLM REPORT</button>
      </div>
    </div>
  `,r.querySelector("#btn-export-llm-json")?.addEventListener("click",()=>vn(e,t)),r.querySelector("#btn-export-llm-report")?.addEventListener("click",()=>En(e,t)),o("V3.1 LLM Inference Gate complete","ok"))}function vn(e,t){const o=Ne(null,e,t.timerResolutionMs),r=$e(e),n={benchmarkVersion:Gt,runtimeSchemaVersion:Vt,benchmarkEngine:_t,device:t,timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??"unknown",commit:globalThis.AETHER_COMMIT??"unknown",llmInference:r,certification:{timingIntegrity:o.timingIntegrity??"FAIL",throughputIntegrity:o.throughputIntegrity??"FAIL",correctnessIntegrity:o.correctnessIntegrity??"FAIL",llmSuiteComplete:o.llmSuiteComplete??"FAIL",memorySuiteComplete:o.memorySuiteComplete??"FAIL",overallCertified:o.overallCertified??!1,certificationStatus:o.certificationStatus??"NOT_CERTIFIED",reasons:o.certificationReasons??[]},selfAudit:o.selfAuditChecks??null,note:"WebGPU allocation capability, NOT total system RAM.",deviceHealth:he(),runtimeError:ye(),interruption:ge()?.interruption??null},a=JSON.stringify(n,null,2),i=JSON.parse(a),s=Be(i.llmInference,t.timerResolutionMs);s.ok||console.error("POST-EXPORT AUDIT FAILED",s.failures),ke("aether-v3-1-3-llm-gate.json",a,"application/json")}function En(e,t){const o=n=>n.map(a=>`| ${a.operation} | ${a.shape} | ${a.repetitions} | ${X(a.blockMs)} | ${X(a.estimatedPerOperationMs)} | ${a.totalFLOPs>0?a.totalFLOPs.toExponential(3):a.totalBytes>0?a.totalBytes+" B":"—"} | ${a.confidence} | ${Fe(a)} | ${a.correctnessPassed?"OK":"FAIL"} |`).join(`
`),r=`# AETHER V3.1 — LLM INFERENCE GATE

- Date: ${new Date().toISOString()}
- Device: ${t.device}
- Adapter: ${t.adapterName} / ${t.adapterVendor}
- Timer: ${t.timerResolutionMs.toFixed(3)} ms

## INT8/INT4 Quantized MatMul
| operation | shape | reps | total | est/op | work | conf | throughput | correct |
|---|---|---|---|---|---|---|---|---|
${o(e.quantizedMatmul)}

## KV-Cache Decode Attention
| operation | shape | reps | total | est/op | work | conf | throughput | correct |
|---|---|---|---|---|---|---|---|---|
${o(e.decodeAttention)}

## Synthetic Transformer Block (NOT real model benchmarks)
| class | hidden | intermediate | layers | heads | kvHeads | params | FP16 | INT8 | INT4 | block ms | conf |
|---|---|---|---|---|---|---|---|---|---|---|---|
${e.transformerBlocks.map(n=>`| ${n.config.name} | ${n.config.hidden} | ${n.config.intermediate} | ${n.config.layers} | ${n.config.heads} | ${n.config.kvHeads} | ${(n.paramCount/1e6).toFixed(1)}M | ${ce(n.fp16Bytes/1048576)} | ${ce(n.int8Bytes/1048576)} | ${ce(n.int4Bytes/1048576)} | ${n.resourceLimit?"RESOURCE_LIMIT (aborted before allocation)":n.blockLatencyMs.toFixed(3)} | ${n.confidence} |`).join(`
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
`;ke("aether-v3-1-llm-report.md",r,"text/markdown")}async function kn(e,t,o,r){const n=r?.resume??null;try{const a=t();we(mt());const{runLLMInferenceGate:i,runLLMInferenceGateQuick:s}=await re(async()=>{const{runLLMInferenceGate:m,runLLMInferenceGateQuick:u}=await Promise.resolve().then(()=>Dt);return{runLLMInferenceGate:m,runLLMInferenceGateQuick:u}},void 0);o("AETHER V3.1.3 RUNTIME ACTIVE","info"),o(`buildId: ${globalThis.AETHER_BUILD_ID??"unknown"}`,"info"),o("llmSuite: ENABLED","info"),o("memorySuite: ENABLED","info"),o("normalizedResults: ENABLED","info"),o("postExportAudit: ENABLED","info"),n&&o(`crash-safety: RESUMING interrupted run (${n.completed.length} categories cached)`,"info"),vt("V3.1",e,{resume:n?{completed:n.completed,partial:n.partial}:void 0},globalThis.AETHER_BUILD_ID??null);const c=Et(a),d=kt(),l=e==="quick"?s:i;try{const m=await l(g=>o(`V3.1: ${g}`,"info"),n??void 0);Lt(),d(),c(),ho(),J=m;const{validateLLMGateIntegrity:u}=await re(async()=>{const{validateLLMGateIntegrity:g}=await Promise.resolve().then(()=>$t);return{validateLLMGateIntegrity:g}},void 0),p=u(m);if(p.ok)o("V3.1 audit OK: normalization + throughput verified for LLM gate results.","ok");else{o(`V3.1 AUDIT FAILURES: ${p.issues.length}`,"err");for(const g of p.issues)o(`  - ${g.operation} ${g.workload}: ${g.detail}`,"err")}const h=await pt(a);bn(m,h,o)}catch(m){d(),c();const u=m,p=`${u.message} ${u.stack??""}`.toLowerCase();p.includes("validation")?Pe("GPU_VALIDATION_ERROR",u.message,u):p.includes("limit")&&(p.includes("alloc")||p.includes("buffer")||p.includes("memory"))?Pe("RESOURCE_LIMIT",u.message,u):Pe("JAVASCRIPT_EXCEPTION",u.message,u),o(`V3.1 ERROR: ${u.message}`,"err"),o("crash-safety: benchmark interrupted (A–J), certification FAILED, partial results preserved. RELOAD the page and press RESUME.","warn")}}catch(a){o(`V3.1 ERROR: ${a.message}`,"err")}}async function On(e,t){try{const o=e();we(mt());const{runLLMDiagnosticStaged:r}=await re(async()=>{const{runLLMDiagnosticStaged:d}=await Promise.resolve().then(()=>Dt);return{runLLMDiagnosticStaged:d}},void 0);t("AETHER V3.1.3 STAGED DIAGNOSTIC ACTIVE","info"),vt("V3.1","quick",void 0,globalThis.AETHER_BUILD_ID??null);const n=Et(o),a=kt(),i=await pt(o),s=await r(d=>t(`DIAG: ${d}`,"info"));a(),n(),Lt();for(const d of s){const l=d.completed?d.error?"ERROR":"DONE":"SKIPPED";t(`DIAG ${l}: ${d.label}${d.error?` — ${d.error}`:""} (${Math.round(d.durationMs)}ms)`,d.completed&&!d.error?"ok":"err")}t(`DIAG done: ${s.filter(d=>d.completed).length}/${s.length} stages completed`,"ok"),t(`DIAG env: ${i.device} | maxBufferSize: ${i.maxBufferSize?Math.round(i.maxBufferSize/1048576)+" MB":"UNAVAILABLE"} | timer: ${i.timerResolutionMs.toFixed(3)} ms`,"info");const c=on(s);sn=s,an=i,Ln(s,c,i,t),t("crash-safety: diagnostic complete. Press EXPORT LLM JSON (above) to capture the full staged report.","info")}catch(o){t(`DIAG ERROR: ${o.message}`,"err")}}function Ln(e,t,o,r){const n=document.getElementById("perf-v3-llm-results");if(!n)return;const a=e.filter(s=>s.completed).length,i=e.map(s=>{const c=s.completed?s.error?"ERROR":"DONE":"SKIPPED",d=s.completed&&!s.error?"var(--green)":"var(--red)";return`<div class="staged-row" style="display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:12px">${x(s.label)}</span>
      <span style="font-size:12px;color:${d}"><b>${c}</b> ${Math.round(s.durationMs)}ms${s.error?` — ${x(s.error)}`:""}</span>
    </div>`}).join("");n.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER V3.1.3 — STAGED DIAGNOSTIC ${a}/${e.length} STAGES COMPLETED</span>
        <span class="badge badge-info">CRASH-SAFETY SCOUT</span>
      </div>
      <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">Short, breakable scout run — small workloads only, all GPU buffers released between stages.</div>
      <div style="font-size:12px;margin-bottom:6px">Device: <b>${x(o.adapterName)}</b> (${x(o.adapterVendor)}) | Timer: ${o.timerResolutionMs.toFixed(3)} ms</div>
      ${i}
      <div id="staged-export-status" style="font-size:12px;margin-top:12px"></div>
      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
        <button class="btn" id="btn-export-staged-llm-json">EXPORT LLM JSON</button>
        <button class="btn btn-outline" id="btn-copy-staged-llm-json">COPY JSON</button>
      </div>
    </div>
  `,n.querySelector("#btn-export-staged-llm-json")?.addEventListener("click",()=>An(e,t,o)),n.querySelector("#btn-copy-staged-llm-json")?.addEventListener("click",()=>wn(e,t,o)),r("AETHER V3.1.3 STAGED DIAGNOSTIC COMPLETE — use EXPORT LLM JSON (above) to capture the staged report","ok")}function qt(e,t,o){const r=globalThis;return rn(e,t,o,{buildId:r.AETHER_BUILD_ID??null,commit:r.AETHER_COMMIT??null})}function In(){return`AETHER-V3.1.3-STAGED-LLM-${new Date().toISOString().replace(/[:.]/g,"-")}.json`}function _e(e,t){const o=document.getElementById("staged-export-status");o&&(o.innerHTML=`<span style="color:${t?"var(--red)":"var(--green)"}">${x(e)}</span>`)}function An(e,t,o){const r=qt(e,t,o),n=In();try{ke(n,r.json,"application/json")}catch(a){_e(`JSON EXPORT FAILED — ${x(a.message)}`,!0);return}_e(`JSON EXPORT COMPLETE — ${n} | ${r.resultCount} results | ${r.certificationStatus}${r.postExportAudit.ok?"":" (post-export audit FAILED -> FAILED)"} | build ${r.payload.buildId}`,!r.postExportAudit.ok)}function wn(e,t,o){const r=qt(e,t,o),n=Sn(r.json);_e(n?`JSON COPIED — ${r.resultCount} results | ${r.certificationStatus}${r.postExportAudit.ok?"":" (post-export audit FAILED -> FAILED)"} | build ${r.payload.buildId}`:"JSON COPY FAILED — clipboard unavailable on this device",!n||!r.postExportAudit.ok)}function Sn(e){if(navigator.clipboard&&window.isSecureContext!==!1)try{return navigator.clipboard.writeText(e).catch(()=>{}),!0}catch{}try{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.focus(),t.select();const o=document.execCommand("copy");return document.body.removeChild(t),o}catch{return!1}}export{Bn as AETHER_V313_SENTINELS,J as _llmGateResults,Tn as buildLLMInferenceExport,Ne as buildSelfAudit,bn as renderLLMGate,Ln as renderStagedDiagnostic,dn as renderV3Certification,On as runLLMDiagnosticFromUI,kn as runLLMGateFromUI,xn as runV3FromUI};
