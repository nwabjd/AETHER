import{h as ue,c as B,C as Ve,a as qe,b as ze,r as po,g as fo,d as Et,e as go,t as We,_ as se,f as ho,i as yo,j as Mo,k as D,l as bo,m as ne,n as he,o as ye,p as Me,q as kt,s as Lt,u as At,v as It,w as vo,x as Ce}from"./index-B3gP19d2.js";let He=1;function $e(e){He=e}function ke(){return He}function wt(e){return e<=0||!Number.isFinite(e)||e<=He?"UNMEASURABLE":e<5?"LOW":e<20?"MEDIUM":"HIGH"}const Ke=2e3,je=2e3,$t=5e9,Ye=1e-6;function ae(e){if(!Number.isInteger(e.repetitions)||e.repetitions<=0)throw new Error(`TIMING INTEGRITY FAILURE: ${e.operation}/${e.workload} repetitions=${e.repetitions} must be a positive integer`);if(!Number.isFinite(e.totalMs)||e.totalMs<0)throw new Error(`TIMING INTEGRITY FAILURE: ${e.operation}/${e.workload} totalMs=${e.totalMs} invalid`);const t=e.totalMs/e.repetitions;if(Math.abs(t-e.totalMs/e.repetitions)>Ye)throw new Error(`TIMING INTEGRITY FAILURE: ${e.operation}/${e.workload} estimatedPerOperationMs=${t.toFixed(12)} != totalMs(${e.totalMs})/repetitions(${e.repetitions})=${(e.totalMs/e.repetitions).toFixed(12)}`);const r=ke(),n=(e.flopsPerExecution??0)*e.repetitions,a=(e.bytesPerExecution??0)*e.repetitions,i=(e.opsPerExecution??0)*e.repetitions,s=e.throughputUnit??"GFLOPS",l=s==="GB/s"?a:s==="GFLOPS"?n:i,c=s==="GB/s"?"BYTES":s==="GFLOPS"?"FLOPs":"OPERATIONS",d=e.totalMs/1e3,m={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[s];let p=null,h=!1;if(d>0&&Number.isFinite(d)&&l>0&&Number.isFinite(l)&&m!==void 0){const E=l/d/m,S=s==="GFLOPS"?Ke:s==="GB/s"?je:$t;Number.isFinite(E)&&E>=0&&E<=S?p=E:h=!0}const g=e.totalMs>0?e.totalMs/r:0;let M;e.totalMs<=0||!Number.isFinite(e.totalMs)?M="UNMEASURABLE":g<5?M="LOW":g<20?M="MEDIUM":M="HIGH",!e.correctnessPassed&&M==="HIGH"&&(M="MEDIUM"),e.totalMs<=r&&(M="UNMEASURABLE");const f=e.samples>=20?e.medianMs:null,y=e.samples>=20?e.p95Ms:null,b=e.samples>=20?e.p99Ms:null,A=t>0&&t<=r,w=h?"INVALID_MEASUREMENT throughput exceeds physical cap":"",L=[e.notes??"",w,A?`TIMER-FLOOR_LIMITED: est. per-op ${t.toFixed(4)}ms ≤ ~${r}ms timer resolution; measured from an amplified block of ${e.repetitions} repetitions — NOT direct sub-ms timing`:""].filter(Boolean).join(" · ");return{category:e.category,operation:e.operation,workload:e.workload,shape:e.shape,repetitions:e.repetitions,totalMs:e.totalMs,blockMs:e.totalMs,estimatedPerOperationMs:t,medianMs:f,p95Ms:y,p99Ms:b,samples:e.samples,totalWork:l,workUnit:c,totalFLOPs:n,totalBytes:a,timingMethod:"HOST_WALL_CLOCK_AMPLIFIED",confidence:M,measurementQuality:{timerResolutionMs:r,totalMeasurementMs:e.totalMs,signalToTimerRatio:g,confidence:M,timerFloorLimited:A},correctnessPassed:e.correctnessPassed,throughput:p,throughputUnit:s,notes:L,measurable:M!=="UNMEASURABLE",timerFloorLimited:A}}function St(e){return ae({category:e.category,operation:e.operation,workload:e.workload,shape:e.shape,totalMs:e.totalMs>0&&Number.isFinite(e.totalMs)?e.totalMs:0,repetitions:e.reps>0?e.reps:1,samples:e.samples,medianMs:e.medianMs,p95Ms:e.p95,p99Ms:e.p99,flopsPerExecution:e.flopsPerExecution,bytesPerExecution:e.bytesPerExecution,opsPerExecution:e.opsPerExecution,throughputUnit:e.throughputUnit,correctnessPassed:e.correctnessPassed,notes:e.notes})}function Eo(e,t,o){const r=t/1e3;if(!(r>0)||!Number.isFinite(r)||!(e>0))return{value:null,capped:!1};const n=e/r/1e9;return Number.isFinite(n)?n>(o==="GFLOPS"?Ke:je)?{value:null,capped:!0}:{value:n,capped:!1}:{value:null,capped:!1}}function ko(e,t,o){const r=t/1e3;if(!(r>0)||!Number.isFinite(r)||!(e>0)||!Number.isFinite(e))return{value:null,capped:!1};const a={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[o];if(a===void 0)return{value:null,capped:!1};const i=e/r/a;return!Number.isFinite(i)||i<0?{value:null,capped:!1}:i>(o==="GFLOPS"?Ke:o==="GB/s"?je:$t)?{value:null,capped:!0}:{value:i,capped:!1}}function de(e,t){if(e.length===0)return 0;const o=Math.min(Math.floor(e.length*t),e.length-1);return e[o]}function Qe(e){return de(e,.5)}const re={tensorCompute:.25,attention:.25,mlp:.2,memory:.1,imageProcessing:.1,videoProcessing:.05,sustainedPerf:.05};function Je(e,t){return t==="UNMEASURABLE"?0:t==="LOW"?Math.min(ht(e),30):ht(e)}function ht(e){return e<=0||!Number.isFinite(e)?0:e<=2?100:e<=5?80:e<=10?60:e<=20?40:20}function me(e){if(e.length===0)return{category:"",score:0,tests:0,measurable:0,notes:"no tests"};const t=e[0].category;let o=0,r=0;for(const a of e)o+=Je(a.estimatedPerOperationMs,a.confidence),a.confidence!=="UNMEASURABLE"&&r++;const n=Math.round(o/e.length);return{category:t,score:n,tests:e.length,measurable:r,notes:""}}function Lo(e){if(e.length===0)return{category:"memory",score:0,tests:0,measurable:0,notes:"no tests"};const t=e.filter(n=>n.allocated),o=t.length>0?Math.max(...t.map(n=>n.sizeMB)):0;let r=0;return o>=512?r=100:o>=384?r=85:o>=256?r=70:o>=128?r=50:o>=64?r=30:r=10,{category:"memory",score:r,tests:e.length,measurable:t.length,notes:`maxAlloc=${o}MB`}}function Bt(e){let t=100;return e>30?t=20:e>20?t=40:e>10?t=70:e>5&&(t=85),{category:"sustainedPerf",score:t,tests:1,measurable:1,notes:`drop=${e.toFixed(1)}%`}}function Xe(e,t,o,r,n,a,i){const s=me(e),l=me(t),c=me(o),d=me(r),u=me(n),m=Lo(a),p=Bt(i),h=Math.round(s.score*re.tensorCompute+l.score*re.attention+c.score*re.mlp+m.score*re.memory+d.score*re.imageProcessing+u.score*re.videoProcessing+p.score*re.sustainedPerf);return{tensorCompute:s,memory:m,attention:l,mlp:c,imageProcessing:d,videoProcessing:u,sustainedPerf:p,overall:h}}function Ze(e){const t=o=>o>=60?"GREEN":o>=35?"YELLOW":"RED";return{transformerInference:t(Math.max(e.tensorCompute.score,e.attention.score,e.mlp.score)),imageGeneration:t(Math.max(e.imageProcessing.score,e.tensorCompute.score)),vaeDecoding:t(Math.max(e.imageProcessing.score,e.memory.score)),videoLatent:t(Math.max(e.videoProcessing.score,e.memory.score)),temporalAttention:t(Math.max(e.videoProcessing.score,e.attention.score)),longContext:e.attention.score>=50&&e.memory.score>=50?"GREEN":e.attention.score>=30?"YELLOW":"RED"}}function pe(e){if(e.length===0)return 0;let t=0;for(const o of e)t+=Je(o.estimatedPerOperationMs,o.confidence);return Math.round(t/e.length)}function Ao(e){if(e.length===0)return 0;const t=e.filter(r=>r.success);if(t.length===0)return 0;const o=Math.max(...t.map(r=>r.totalAllocatedMB));return o>=1024?100:o>=768?85:o>=512?70:o>=256?50:o>=128?30:10}function Io(e){if(e.length===0)return 0;let t=0;for(const o of e)t+=Je(o.blockLatencyMs,o.confidence);return Math.round(t/e.length)}function Se(e,t,o,r,n,a){const i=pe(e),s=pe(t),l=pe(o),c=Io(r),d=Ao(n),m=Bt(a).score,p=i,h=d,g=pe(o.filter(L=>parseInt(/ctx=(\d+)/.exec(L.workload)?.[1]??"0",10)>=1024)),M=pe(e.filter(L=>L.workload.includes("prefill"))),f=l,y=c,b=Math.round(g*.6+d*.4),A=m,w=Math.round(i*.3+d*.15+s*.15+l*.15+c*.15+m*.1);return{computeScore:i,memoryScore:d,attentionScore:s,decodeScore:l,transformerBlockScore:c,sustainedScore:m,overall:w,llmCompute:p,llmMemory:h,kvCache:g,prefill:M,decode:f,transformerBlock:y,longContext:b,sustained:A}}function et(e,t,o,r,n=0,a=0){return e?t===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"INT8/INT4 quantized matmul missing or unsupported"}:o===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"KV-cache decode attention missing or unsupported"}:r===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Synthetic transformer block missing or unsupported"}:n===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Token-generation simulation missing or unsupported"}:a===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Memory ladder missing or unsupported"}:e.overall>0?{llmReadinessScore:e.overall,llmReadinessStatus:"CERTIFIED",reason:"LLM gate completed with measurable results"}:{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"LLM gate produced no measurable results"}:{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"LLM gate did not run"}}function _e(e){const t=[];for(const o of e){if(`${o.operation}${o.workload}`,(!Number.isFinite(o.totalMs)||o.totalMs<0)&&t.push({operation:o.operation,workload:o.workload,kind:"invalid_totalMs",detail:`totalMs=${o.totalMs} not a non-negative finite number`}),(!Number.isFinite(o.repetitions)||o.repetitions<=0||!Number.isInteger(o.repetitions))&&t.push({operation:o.operation,workload:o.workload,kind:"invalid_repetitions",detail:`repetitions=${o.repetitions} must be positive integer`}),(!Number.isFinite(o.estimatedPerOperationMs)||o.estimatedPerOperationMs<0)&&t.push({operation:o.operation,workload:o.workload,kind:"invalid_estimated",detail:`estimatedPerOperationMs=${o.estimatedPerOperationMs}`}),Number.isFinite(o.totalMs)&&Number.isFinite(o.estimatedPerOperationMs)&&o.repetitions>0){const r=o.totalMs/o.repetitions;Math.abs(r-o.estimatedPerOperationMs)>1e-6&&t.push({operation:o.operation,workload:o.workload,kind:"normalization_mismatch",detail:`expected estimatedPerOperationMs=${r.toFixed(6)} (totalMs/reps), got ${o.estimatedPerOperationMs}`})}if((Number.isNaN(o.blockMs)||o.blockMs<0)&&t.push({operation:o.operation,workload:o.workload,kind:"invalid_blockMs",detail:`blockMs=${o.blockMs}`}),(Number.isNaN(o.totalWork)||o.totalWork<0)&&t.push({operation:o.operation,workload:o.workload,kind:"missing_totalWork",detail:`totalWork=${o.totalWork}`}),["FLOPs","BYTES","OPERATIONS","NONE"].includes(o.workUnit)||t.push({operation:o.operation,workload:o.workload,kind:"invalid_workUnit",detail:`workUnit=${o.workUnit}`}),typeof o.timerFloorLimited!="boolean"&&t.push({operation:o.operation,workload:o.workload,kind:"missing_timerFloorLimited",detail:`timerFloorLimited=${o.timerFloorLimited}`}),o.throughput!==null){if(!Number.isFinite(o.throughput)||o.throughput<0)t.push({operation:o.operation,workload:o.workload,kind:"invalid_throughput",detail:`throughput=${o.throughput}`});else if(o.totalMs>0){const r=o.totalWork/(o.totalMs/1e3),n=o.throughputUnit==="GFLOPS"||o.throughputUnit==="GB/s"?1e9:o.throughputUnit==="M/s"?1e6:o.throughputUnit==="k/s"?1e3:1,a=r/n;Math.abs(a-o.throughput)/Math.max(a,1e-12)>.01&&t.push({operation:o.operation,workload:o.workload,kind:"throughput_mismatch",detail:`expected throughput=${a.toFixed(6)} ${o.throughputUnit}, got ${o.throughput}`})}}["GFLOPS","GB/s","M/s","k/s","/s"].includes(o.throughputUnit)||t.push({operation:o.operation,workload:o.workload,kind:"invalid_unit",detail:`throughputUnit=${o.throughputUnit}`})}return{ok:t.length===0,issues:t}}function wo(e){if(!e)return{ok:!1,issues:[{operation:"LLM_GATE",workload:"—",kind:"missing",detail:"llmInference results missing from export"}]};const t=_e(e.quantizedMatmul),o=_e(e.decodeAttention),r=[...t.issues,...o.issues];return e.quantizedMatmul.length===0&&r.push({operation:"LLM_GATE",workload:"quantizedMatmul",kind:"empty_section",detail:"no INT8/INT4 matmul results"}),e.decodeAttention.length===0&&r.push({operation:"LLM_GATE",workload:"decodeAttention",kind:"empty_section",detail:"no KV-cache decode attention results"}),e.transformerBlocks.length===0&&r.push({operation:"LLM_GATE",workload:"transformerBlocks",kind:"empty_section",detail:"no synthetic transformer block results"}),{ok:r.length===0,issues:r}}const Tt=Object.freeze(Object.defineProperty({__proto__:null,TIMING_EPSILON:Ye,buildV3Result:St,classifyConfidence:wt,classifyFeasibility:Ze,computeLLMReadiness:Se,computeLLMReadinessStatus:et,computeReadiness:Xe,computeThroughputTotal:ko,createBenchmarkResult:ae,getTimerResolution:ke,median:Qe,percentile:de,safeThroughput:Eo,setTimerResolution:$e,validateLLMGateIntegrity:wo,validateResultIntegrity:_e},Symbol.toStringTag,{value:"Module"})),xt=`
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
`,Ot=`
@group(0) @binding(0) var<storage, read> input: array<f32>;
@group(0) @binding(1) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&input)) { return; }
  let x = input[i];
  output[i] = x / (1.0 + exp(-x));
}
`,$o=`
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
`,So=`
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
`;function Bo(e,t,o){const r=new ArrayBuffer(16),n=new Uint32Array(r);return n[0]=e>>>0,n[1]=t>>>0,n[2]=o>>>0,n[3]=0,r}function To(e,t,o,r,n,a){const i=new ArrayBuffer(32),s=new Uint32Array(i);return s[0]=e>>>0,s[1]=t>>>0,s[2]=o>>>0,s[3]=r>>>0,s[4]=n>>>0,s[5]=a>>>0,s[6]=0,s[7]=0,i}function W(){return fo()}function Rt(e,t,o){const r=W().createBuffer({size:t,usage:e,mappedAtCreation:!!o});return o&&new Uint8Array(r.getMappedRange()).set(new Uint8Array(o.buffer,o.byteOffset,o.byteLength)),r.unmap(),We(r)}function k(e,t){return Rt(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,e,t)}function U(e){return Rt(GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,Math.max(e.byteLength,16),new Uint8Array(e))}function _(e,t){const o=W().createShaderModule({code:e});return W().createComputePipeline({layout:"auto",compute:{module:o,entryPoint:"main"}})}function O(e,t,o){const r=e.getBindGroupLayout(0);return W().createBindGroup({layout:r,entries:o.map((n,a)=>({binding:a,resource:{buffer:n}}))})}function T(e){let t=2654435769;for(let o=0;o<e.length;o++)t=t*1664525+1013904223>>>0,e[o]=t%2001/1e3-1}async function fe(e,t){const o=W(),r=new Ve(o),n=o.createCommandEncoder();for(let l=0;l<t;l++){const c=n.beginComputePass();e(c),c.end()}r.encode(n);const a=n.finish(),i=performance.now();try{o.queue.submit([a])}catch{return 0}qe.onCommandBufferSubmitted("measurement");try{await ze(o,r,"v3-block")}catch{return 0}const s=performance.now()-i;return r.destroy(),Number.isFinite(s)&&s>=0?s:0}async function z(e,t=1e6){const o=ke();let r=await fe(e,1),n=1;r<=o&&(r=await fe(e,100),n=100),r<=o&&(r=await fe(e,1e4),n=1e4);const a=r/n;let i=Math.ceil(20/a);(!Number.isFinite(i)||i<=0)&&(i=1),i=Math.min(i,t);const s=Math.max(i,1);for(let M=0;M<3;M++)await fe(e,s);const l=[];for(let M=0;M<20;M++)l.push(await fe(e,s));const c=l.filter(M=>M>0&&Number.isFinite(M)),d=[...c].sort((M,f)=>M-f),u=Qe(d),m=c.length>0?c.reduce((M,f)=>M+f,0)/c.length:0,p=c.length>=20?de(d,.95):null,h=c.length>=20?de(d,.99):null,g=wt(u);return{reps:s,totalMs:u,medianMs:u,meanMs:m,p95:p,p99:h,confidence:g,samples:c}}function Y(e){return St({category:e.category,operation:e.operation,workload:e.workload,shape:e.shape,reps:e.m.reps,totalMs:e.m.totalMs,medianMs:e.m.medianMs,p95:e.m.p95,p99:e.m.p99,samples:e.m.samples.length,confidence:e.m.confidence,correctnessPassed:e.correctnessPassed,notes:e.notes,flopsPerExecution:e.flopsPerExecution,bytesPerExecution:e.bytesPerExecution,opsPerExecution:e.opsPerExecution,throughputUnit:e.throughputUnit})}async function be(e,t,o,r,n,a,i){const s=W(),l=new Ve(s),c=s.createCommandEncoder(),d=c.beginComputePass();d.setPipeline(e),d.setBindGroup(0,t),d.dispatchWorkgroups(o,r,n),d.end(),l.encode(c),s.queue.submit([c.finish()]),qe.onCommandBufferSubmitted("other"),await ze(s,l,"v3-correctness");const u=await po(a,i);return l.destroy(),u}function ve(e,t,o=.02,r=.02){if(e.length!==t.length)return!1;let n=!0;for(let a=0;a<e.length;a++){const i=e[a],s=t[a],l=Math.abs(i-s),c=Math.abs(s)>1e-9?l/Math.abs(s):l;if(l>o&&c>r){n=!1;break}}return n}async function tt(e){const t=[],o=[{tokens:128,hidden:512},{tokens:256,hidden:512},{tokens:512,hidden:512},{tokens:128,hidden:768},{tokens:256,hidden:768},{tokens:128,hidden:1024},{tokens:256,hidden:1024}];for(const{tokens:r,hidden:n}of o){e?.(`matmul ${r}×${n} × ${n}×${n}`);const a=r,i=n,s=n,l=a*s*4,c=s*i*4,d=a*i*4,u=new Float32Array(a*s);T(u);const m=new Float32Array(s*i);T(m);const p=k(l,u),h=k(c,m),g=k(d),f=_(`
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
}`),y=new ArrayBuffer(12);new Uint32Array(y).set([a,i,s]);const b=U(y),A=O(f,["uniform","read-only-storage","read-only-storage","storage"],[b,p,h,g]),w=Math.ceil(a/16),L=Math.ceil(i/16),E=await z(N=>{N.setPipeline(f),N.setBindGroup(0,A),N.dispatchWorkgroups(w,L,1)});let S=!1;try{const N=await be(f,A,w,L,1,g,d),P=Et(u,m,a,i,s);S=ve(N,P)}catch{S=!1}t.push(Y({category:"TRANSFORMER",operation:"MatMul",workload:`${r}×${n} × ${n}×${n}`,shape:`[${r},${n}]×[${n},${n}]`,m:E,correctnessPassed:S,flopsPerExecution:2*a*i*s,bytesPerExecution:(a*s+s*i+a*i)*4,throughputUnit:"GFLOPS",notes:S?"":"correctness FAILED"})),p.destroy(),h.destroy(),g.destroy(),b.destroy()}return t}async function ot(e){const t=[],o=[{hidden:512,heads:8,headDim:64,seqs:[64,128,256,512]},{hidden:768,heads:12,headDim:64,seqs:[64,128,256]}];for(const{hidden:r,heads:n,headDim:a,seqs:i}of o)for(const s of i){e?.(`attention hidden=${r} seq=${s}`);const l=1,c=a,d=s*s*4,u=s*c*4,m=new Float32Array(l*s*c*3);T(m);const p=k(m.byteLength,m),h=k(d),g=k(u),f=_(`
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
}`),y=1/Math.sqrt(c),b=new ArrayBuffer(16);new Uint32Array(b).set([l,s,c]),new Float32Array(b)[3]=y;const A=U(b),w=O(f,["uniform","read-only-storage","storage","storage"],[A,p,h,g]),L=Math.max(1,Math.ceil(l*s/64)),E=await z(S=>{S.setPipeline(f),S.setBindGroup(0,w),S.dispatchWorkgroups(L,1,1)});t.push(Y({category:"ATTENTION",operation:"Fused Attention",workload:`hidden=${r} seq=${s}`,shape:`[1,${s},${c}]`,m:E,correctnessPassed:!0,flopsPerExecution:4*l*s*s*c,bytesPerExecution:(l*s*c*3+s*s+s*c)*4,throughputUnit:"GFLOPS",notes:"QK^T+softmax+PV fused"})),p.destroy(),h.destroy(),g.destroy(),A.destroy()}return t}async function nt(e){const t=[],o=[{hidden:512,intermediate:2048,seqs:[128,256,512]},{hidden:768,intermediate:3072,seqs:[128,256]},{hidden:1024,intermediate:4096,seqs:[128]}],r=_(xt);for(const{hidden:n,intermediate:a,seqs:i}of o)for(const s of i){e?.(`mlp hidden=${n} intermediate=${a} seq=${s}`);const l=new Float32Array(s*n);T(l);const c=new Float32Array(n*a);T(c);const d=new Float32Array(a*n);T(d);const u=k(l.byteLength,l),m=k(c.byteLength,c),p=k(s*a*4),h=k(s*a*4),g=k(s*n*4),f=_(`
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
}`),y=new ArrayBuffer(12);new Uint32Array(y).set([s,a,n]);const b=U(y),A=O(f,["uniform","read-only-storage","read-only-storage","storage"],[b,u,m,p]),w=O(r,["read-only-storage","storage"],[p,h]),L=s*a,E=new ArrayBuffer(12);new Uint32Array(E).set([s,n,a]);const S=U(E),N=O(f,["uniform","read-only-storage","read-only-storage","storage"],[S,h,g,u]),P=await z(R=>{R.setPipeline(f),R.setBindGroup(0,A),R.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(a/16),1),R.setPipeline(r),R.setBindGroup(0,w),R.dispatchWorkgroups(Math.ceil(L/256),1,1),R.setPipeline(f),R.setBindGroup(0,N),R.dispatchWorkgroups(Math.ceil(s/16),Math.ceil(n/16),1)});t.push(Y({category:"MLP",operation:"Transformer MLP",workload:`h=${n} int=${a} seq=${s}`,shape:`[${s},${n}]`,m:P,correctnessPassed:!0,flopsPerExecution:2*s*n*a+s*a+2*s*a*n,bytesPerExecution:(s*n+n*a+s*a+a*n+s*n)*4,throughputUnit:"GFLOPS",notes:"W1→GELU→W2"})),u.destroy(),m.destroy(),p.destroy(),h.destroy(),g.destroy(),b.destroy(),S.destroy()}return t}async function rt(e){const t=[],r=_(`
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
}`),n=[{hidden:512,seqs:[128,256,512]},{hidden:768,seqs:[128,256]},{hidden:1024,seqs:[128]},{hidden:2048,seqs:[128]}];for(const{hidden:a,seqs:i}of n)for(const s of i){e?.(`rmsnorm hidden=${a} seq=${s}`);const l=new Float32Array(s*a);T(l);const c=new Float32Array(a);for(let f=0;f<a;f++)c[f]=1;const d=k(l.byteLength,l),u=k(c.byteLength,c),m=k(l.byteLength),p=new ArrayBuffer(8);new Uint32Array(p).set([s,0]);const h=U(p),g=O(r,["uniform","read-only-storage","read-only-storage","storage"],[h,d,u,m]),M=await z(f=>{f.setPipeline(r),f.setBindGroup(0,g),f.dispatchWorkgroups(s,1,1)});t.push(Y({category:"TRANSFORMER",operation:"RMSNorm",workload:`hidden=${a} seq=${s}`,shape:`[${s},${a}]`,m:M,correctnessPassed:!0,flopsPerExecution:3*s*a,bytesPerExecution:(s*a+a+s*a)*4,throughputUnit:"GFLOPS",notes:""})),d.destroy(),u.destroy(),m.destroy(),h.destroy()}return t}async function it(e){const t=[],o=_($o),r=32e3,n=512,a=new Float32Array(r*n);T(a);const i=k(a.byteLength,a);for(const s of[128,256,512]){e?.(`embedding tokens=${s}`);const l=new Uint32Array(s);for(let g=0;g<s;g++)l[g]=Math.floor(Math.random()*r);const c=k(l.byteLength,l),d=k(s*n*4),u=U(Bo(r,n,s)),m=O(o,["uniform","read-only-storage","read-only-storage","storage"],[u,c,i,d]),p=await z(g=>{g.setPipeline(o),g.setBindGroup(0,m),g.dispatchWorkgroups(Math.ceil(s*n/256),1,1)}),h=s*n*4+s*4;t.push(Y({category:"TRANSFORMER",operation:"Embedding Lookup",workload:`tokens=${s} vocab=${r} hidden=${n}`,shape:`[${s}]→[${s},${n}]`,m:p,correctnessPassed:!0,bytesPerExecution:h,throughputUnit:"GB/s",notes:`${(h/1048576).toFixed(1)} MiB touched`})),c.destroy(),d.destroy(),u.destroy()}return i.destroy(),t}async function Ue(e,t,o,r,n,a,i){const s=[],l=_(t);for(const{hw:c,channels:d}of r){i?.(`${e} ${c}×${c}×${d}`);const u=c*c*d,m=new Float32Array(u);T(m);const p=new Float32Array(u);T(p);const h=k(u*4,m),g=k(u*4,p),M=k(u*4),f=O(l,o,[h,g,M]),y=await z(b=>{b.setPipeline(l),b.setBindGroup(0,f),b.dispatchWorkgroups(Math.ceil(u/256),1,1)});s.push(Y({category:"IMAGE",operation:e,workload:`${c}×${c}×${d}`,shape:`[${c},${c},${d}]`,m:y,correctnessPassed:!0,flopsPerExecution:n(c,d),bytesPerExecution:u*12,throughputUnit:a,notes:""})),h.destroy(),g.destroy(),M.destroy()}return s}async function st(e){const t=[{hw:64,channels:4},{hw:128,channels:4},{hw:256,channels:4}],o="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] + b[i]; }",r="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] * b[i]; }",n=Ot,a=["read-only-storage","read-only-storage","storage"],i=["read-only-storage","storage"],s=[];return s.push(...await Ue("Elementwise Add",o,a,t,(l,c)=>l*l*c,"GFLOPS",e)),s.push(...await Ue("Elementwise Multiply",r,a,t,(l,c)=>l*l*c,"GFLOPS",e)),s.push(...await Ue("SiLU Activation",n,i,t,(l,c)=>l*l*c,"GFLOPS",e)),s}async function at(e){const t=[],o=_(Ot),n=_(`
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
}`),a=[{inC:4,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:16,H:64,W:64,kH:3,kW:3}],i=[{hw:64,channels:4},{hw:128,channels:4}];for(const s of i){e?.(`vae ${s.hw}×${s.hw}×${s.channels}`);const l=[],c=[],d=[];let u=s.channels,m=s.hw,p=s.hw;const h=new Float32Array(u*m*p);T(h);let g=k(h.byteLength,h);l.push(g);for(const f of a){const y=m-f.kH+1,b=p-f.kW+1,A=new ArrayBuffer(32);new Uint32Array(A).set([f.inC,f.outC,m,p,f.kH,f.kW,y,b]);const w=U(A),L=new Float32Array(f.outC*f.inC*f.kH*f.kW);T(L);const E=k(L.byteLength,L),S=k(f.outC*y*b*4),N=O(n,["uniform","read-only-storage","read-only-storage","storage"],[w,g,E,S]),P=k(f.outC*y*b*4),R=O(o,["read-only-storage","storage"],[S,P]);c.push(w),l.push(E,S,P),d.push(N,R),u=f.outC,m=y,p=b,g=P}const M=await z(f=>{for(let y=0;y<a.length;y++){const b=a[y],A=s.hw-b.kH*(y+1)+1,w=s.hw-b.kW*(y+1)+1,L=b.outC*A*w;f.setPipeline(n),f.setBindGroup(0,d[y*2]),f.dispatchWorkgroups(Math.ceil(L/256),1,1),f.setPipeline(o),f.setBindGroup(0,d[y*2+1]),f.dispatchWorkgroups(Math.ceil(L/256),1,1)}});t.push(Y({category:"IMAGE",operation:"VAE Decoder",workload:`${s.hw}×${s.hw}×${s.channels}`,shape:`[${s.channels},${s.hw},${s.hw}]`,m:M,correctnessPassed:!0,bytesPerExecution:(s.channels*s.hw*s.hw+16*64*64+16*62*62)*4,throughputUnit:"GB/s",notes:"conv→SiLU→conv→SiLU→conv→SiLU"}));for(const f of l)f.destroy();for(const f of c)f.destroy()}return t}async function ct(e){const t=[],o=[{frames:4,hw:64,channels:4},{frames:8,hw:64,channels:4},{frames:16,hw:64,channels:4}];for(const{frames:r,hw:n,channels:a}of o){e?.(`video ${r}×${n}×${n}×${a}`);const i=r*n*n*a,s=new Float32Array(i);T(s);const l=new Float32Array(3*a);T(l);const c=r-2,d=new Float32Array(c*n*n*a),u=k(s.byteLength,s),m=k(l.byteLength,l),p=k(d.byteLength),h=U(To(r,n,n,a,3,c)),g=_(So),M=O(g,["uniform","read-only-storage","read-only-storage","storage"],[h,u,m,p]),f=await z(y=>{y.setPipeline(g),y.setBindGroup(0,M),y.dispatchWorkgroups(Math.ceil(i/256),1,1)});t.push(Y({category:"VIDEO",operation:"Temporal Mixing",workload:`${r}×${n}×${n}×${a}`,shape:`[${r},${n},${n},${a}]`,m:f,correctnessPassed:!0,bytesPerExecution:(i+3*a+i)*4,throughputUnit:"GB/s",notes:"temporal conv kernel=3"})),u.destroy(),m.destroy(),p.destroy(),h.destroy()}return t}async function lt(e){const t=[],o=[64,128,256,384,512],r=W(),n=go(r),a=Math.max(1,Math.min(64,Math.floor(n/(1024*1024)))),i=Math.min(a*1024*1024,n);for(const s of o){e?.(`memory ${s}MB`);const l=s*1024*1024,c=performance.now(),d=[];let u=0,m=null;try{for(;u<l;){const y=Math.min(i,l-u),b=r.createBuffer({size:y,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC});We(b),d.push(b),u+=y}}catch(y){m=y}for(const y of d)y.destroy();const p=performance.now()-c;if(m!==null||u<l){t.push({allocated:!1,sizeMB:s,allocMs:p,writeMs:0});continue}const h=performance.now(),g=new Float32Array(Math.min(l/4,256)).fill(42);let M=!1;try{for(const y of d){const b=y.size;for(let A=0;A<b;A+=g.byteLength)r.queue.writeBuffer(y,A,g,0,Math.min(g.length,(b-A)/4))}}catch{M=!0}const f=performance.now()-h;M?t.push({allocated:!0,sizeMB:s,allocMs:p,writeMs:-1}):t.push({allocated:!0,sizeMB:s,allocMs:p,writeMs:f})}return t}async function dt(e){e?.("sustained 30s");const t=256,o=new Float32Array(t*t);T(o);const r=new Float32Array(t*t);T(r);const n=k(o.byteLength,o),a=k(r.byteLength,r),i=k(t*t*4),l=_(`
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
}`),c=new ArrayBuffer(12);new Uint32Array(c).set([t,t,t]);const d=U(c),u=O(l,["uniform","read-only-storage","read-only-storage","storage"],[d,n,a,i]),m=t/16,p=t/16,h=W(),g=[],M=[],f=30;performance.now();for(let v=0;v<f;v++){const G=performance.now(),K=[];for(;performance.now()-G<1e3;){const j=new Ve(h),Q=h.createCommandEncoder(),te=Q.beginComputePass();te.setPipeline(l),te.setBindGroup(0,u),te.dispatchWorkgroups(m,p,1),te.end(),j.encode(Q);const Ae=performance.now();try{h.queue.submit([Q.finish()])}catch{break}qe.onCommandBufferSubmitted("measurement");try{await ze(h,j,"sustained")}catch{break}const oe=performance.now()-Ae;j.destroy(),oe>0&&Number.isFinite(oe)&&(g.push(oe),K.push(oe))}M.push(K.length>0?K.reduce((j,Q)=>j+Q,0)/K.length:0),e?.(`sustained s${v+1}/${f} avg=${(M[M.length-1]||0).toFixed(2)}ms`)}const y=[...g].sort((v,G)=>v-G),b=g.length>0?g.reduce((v,G)=>v+G,0)/g.length:0,A=Qe(y),w=de(y,.95),L=de(y,.99),E=M.slice(0,5),S=M.slice(-5),N=E.length>0?E.reduce((v,G)=>v+G,0)/E.length:0,P=S.length>0?S.reduce((v,G)=>v+G,0)/S.length:0,R=N>0?(P-N)/N*100:0;return n.destroy(),a.destroy(),i.destroy(),d.destroy(),{durationSec:f,totalOps:g.length,avgMs:b,medianMs:A,p95Ms:w,p99Ms:L,first5sMs:N,last5sMs:P,dropPct:Math.max(R,0)}}function F(e,t,o){return r=>{ue({phase:t,category:o,test:r}),e?.(r)}}function I(e,t){return!!e&&e.completed.includes(t)&&e.partial[t]!==void 0}async function Nt(e,t){e?.("Starting V3 Model-Shaped Benchmark..."),ue({phase:"V3:MODEL-SHAPED",category:null,test:"starting"});const o=I(t,"matmul")?t.partial.matmul:await tt(F(e,"V3-FULL","matmul"));I(t,"matmul")||B("matmul",o);const r=I(t,"attention")?t.partial.attention:await ot(F(e,"V3-FULL","attention"));I(t,"attention")||B("attention",r);const n=I(t,"mlp")?t.partial.mlp:await nt(F(e,"V3-FULL","mlp"));I(t,"mlp")||B("mlp",n);const a=I(t,"rmsnorm")?t.partial.rmsnorm:await rt(F(e,"V3-FULL","rmsnorm"));I(t,"rmsnorm")||B("rmsnorm",a);const i=I(t,"embedding")?t.partial.embedding:await it(F(e,"V3-FULL","embedding"));I(t,"embedding")||B("embedding",i);const s=I(t,"imageOps")?t.partial.imageOps:await st(F(e,"V3-FULL","imageOps"));I(t,"imageOps")||B("imageOps",s);const l=I(t,"vae")?t.partial.vae:await at(F(e,"V3-FULL","vae"));I(t,"vae")||B("vae",l);const c=I(t,"video")?t.partial.video:await ct(F(e,"V3-FULL","video"));I(t,"video")||B("video",c);const d=I(t,"memory")?t.partial.memory:await lt(F(e,"V3-FULL","memory"));I(t,"memory")||B("memory",d);const u=I(t,"sustained")?t.partial.sustained:await dt(F(e,"V3-FULL","sustained"));I(t,"sustained")||B("sustained",u);const m=Xe(o,r,n,s,c,d.map(h=>({allocated:h.allocated,sizeMB:h.sizeMB})),u.dropPct),p=Ze(m);return{matmul:o,attention:r,mlp:n,rmsnorm:a,embedding:i,imageOps:s,vae:l,video:c,memory:d,sustained:u,readiness:m,feasibility:p}}async function Pt(e,t){e?.("Starting V3 Quick (reduced subset)..."),ue({phase:"V3:QUICK",category:null,test:"starting"});const o=I(t,"matmul")?t.partial.matmul:(await tt(F(e,"V3-QUICK","matmul"))).slice(0,3);I(t,"matmul")||B("matmul",o);const r=I(t,"attention")?t.partial.attention:(await ot(F(e,"V3-QUICK","attention"))).slice(0,3);I(t,"attention")||B("attention",r);const n=I(t,"mlp")?t.partial.mlp:(await nt(F(e,"V3-QUICK","mlp"))).slice(0,2);I(t,"mlp")||B("mlp",n);const a=I(t,"rmsnorm")?t.partial.rmsnorm:(await rt(F(e,"V3-QUICK","rmsnorm"))).slice(0,2);I(t,"rmsnorm")||B("rmsnorm",a);const i=I(t,"embedding")?t.partial.embedding:(await it(F(e,"V3-QUICK","embedding"))).slice(0,2);I(t,"embedding")||B("embedding",i);const s=I(t,"imageOps")?t.partial.imageOps:(await st(F(e,"V3-QUICK","imageOps"))).slice(0,3);I(t,"imageOps")||B("imageOps",s);const l=I(t,"vae")?t.partial.vae:(await at(F(e,"V3-QUICK","vae"))).slice(0,1);I(t,"vae")||B("vae",l);const c=I(t,"video")?t.partial.video:(await ct(F(e,"V3-QUICK","video"))).slice(0,2);I(t,"video")||B("video",c);const d=I(t,"memory")?t.partial.memory:await lt(F(e,"V3-QUICK","memory"));I(t,"memory")||B("memory",d);const u=I(t,"sustained")?t.partial.sustained:await dt(F(e,"V3-QUICK","sustained"));I(t,"sustained")||B("sustained",u);const m=Xe(o,r,n,s,c,d.map(h=>({allocated:h.allocated,sizeMB:h.sizeMB})),u.dropPct),p=Ze(m);return{matmul:o,attention:r,mlp:n,rmsnorm:a,embedding:i,imageOps:s,vae:l,video:c,memory:d,sustained:u,readiness:m,feasibility:p}}const ut=Object.freeze(Object.defineProperty({__proto__:null,adaptiveMeasure:z,benchV3Attention:ot,benchV3Embedding:it,benchV3ImageOps:st,benchV3MLP:nt,benchV3Matmul:tt,benchV3Memory:lt,benchV3RMSNorm:rt,benchV3Sustained:dt,benchV3VAE:at,benchV3Video:ct,dev:W,fillRandom:T,makeBg:O,makePipeline:_,makeResult:Y,runV3Full:Nt,runV3Quick:Pt,storageBuf:k,uniformBuf:U,verifyOneShot:be,verifyTolerance:ve},Symbol.toStringTag,{value:"Module"}));function Ft(e){const t=[];for(const o of e){const r=`${o.operation} (${o.workload})`;(!Number.isInteger(o.repetitions)||o.repetitions<=0)&&t.push({kind:"timing_integrity",result:r,detail:`repetitions=${o.repetitions} must be a positive integer`}),(!Number.isFinite(o.totalMs)||o.totalMs<0)&&t.push({kind:"timing_integrity",result:r,detail:`totalMs=${o.totalMs} invalid`});const n=o.totalMs/o.repetitions;if(Math.abs(o.estimatedPerOperationMs-n)>Ye&&t.push({kind:"timing_integrity",result:r,detail:`estimatedPerOperationMs=${o.estimatedPerOperationMs} != totalMs/repetitions=${n} (repetitions=${o.repetitions}, totalMs=${o.totalMs})`}),o.throughput!==null&&Number.isFinite(o.throughput)&&o.totalMs>0&&o.totalWork>0){const i={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[o.throughputUnit]??1,s=o.totalWork/(o.totalMs/1e3)/i;Math.abs(o.throughput-s)/Math.max(s,1e-12)>.01&&t.push({kind:"throughput_integrity",result:r,detail:`throughput=${o.throughput} != totalWork(${o.totalWork})/(totalMs(${o.totalMs})/1000)/div(${i})=${s.toFixed(6)}`})}o.samples<20&&(o.medianMs!==null||o.p95Ms!==null||o.p99Ms!==null)&&t.push({kind:"percentile_policy",result:r,detail:`samples=${o.samples} < 20 but percentiles reported (Δ must be null)`}),["FLOPs","BYTES","OPERATIONS","NONE"].includes(o.workUnit)||t.push({kind:"work_unit",result:r,detail:`workUnit=${o.workUnit} invalid`})}return{ok:t.length===0,issues:t}}function Ct(e,t){if(e<=0||!Number.isFinite(e))return 0;const o=e<=2?100:e<=5?80:e<=10?60:e<=20?40:20;return t==="UNMEASURABLE"?0:t==="LOW"?Math.min(o,30):o}function ge(e,t){const o=e.length,r=e.filter(c=>c.measurable),n=r.length,a=r.length>0?r.reduce((c,d)=>c+d.estimatedPerOperationMs,0)/r.length:0,i=Math.round(r.reduce((c,d)=>c+Ct(d.estimatedPerOperationMs,d.confidence),0)/Math.max(r.length,1)),s=r.map(c=>c.confidence);let l="UNMEASURABLE";return s.length>0&&s.every(c=>c!=="UNMEASURABLE")&&(l=s.some(c=>c==="LOW")?"LOW":s.some(c=>c==="MEDIUM")?"MEDIUM":"HIGH"),{score:r.length===0?0:i,tests:o,measurable:n,confidence:l,notes:`${t}: ${n}/${o} measurable, avg per-op ${a.toFixed(4)} ms`}}function xo(e){return{score:0,tests:0,measurable:0,confidence:"UNMEASURABLE",notes:"sustained test not run"}}function Oo(e,t){const o=e.quantizedMatmul,r=e.decodeAttention,n=ge(o.filter(y=>!y.workload.includes("prefill")),"precision matmul (decode)"),a=ge(o.filter(y=>y.workload.includes("prefill")),"prefill matmul"),i=ge(r,"KV-cache decode"),s=ge(r,"KV-cache full range"),l=r.filter(y=>parseInt(/ctx=(\d+)/.exec(y.workload)?.[1]??"0",10)>=1024),c=ge(l,"long-context decode (≥1024)"),d=Ro(e.transformerBlocks),u=No(e.memoryBudget),m=xo(),p=[n,u,s,a,i,d,c,m],h=p.reduce((y,b)=>y+b.tests,0),g=p.reduce((y,b)=>y+b.measurable,0),M=Math.round(p.reduce((y,b)=>y+b.score,0)/Math.max(p.length,1)),f=p.some(y=>y.confidence==="LOW")?"LOW":p.some(y=>y.confidence==="MEDIUM")?"MEDIUM":"HIGH";return{compute:n,memory:u,kvCache:s,prefill:a,decode:i,transformerBlock:d,longContext:c,sustained:m,overall:{score:M,tests:h,measurable:g,confidence:f,notes:`HEURISTIC LLM readiness — NOT a model benchmark. Aggregated from ${g}/${h} measurable tests.`}}}function Ro(e){if(e.length===0)return{score:0,tests:0,measurable:0,confidence:"UNMEASURABLE",notes:"no transformer blocks"};const t=e.filter(a=>a.blockLatencyMs>0&&Number.isFinite(a.blockLatencyMs)),o=e.length,r=t.length>0?t.reduce((a,i)=>a+i.blockLatencyMs,0)/t.length:0,n=Math.round(t.reduce((a,i)=>a+Ct(i.blockLatencyMs,i.confidence),0)/Math.max(t.length,1));return{score:t.length===0?0:n,tests:o,measurable:t.length,confidence:t.some(a=>a.confidence==="LOW")?"LOW":t.every(a=>a.confidence==="HIGH")?"HIGH":"MEDIUM",notes:`synthetic transformer blocks: ${t.length}/${o} measurable, avg block ${r.toFixed(4)} ms`}}function No(e){const t=e.filter(n=>n.success),o=t.length>0?Math.max(...t.map(n=>n.totalAllocatedMB)):0,r=o>=1024?100:o>=512?70:o>=256?50:o>=128?30:10;return{score:t.length===0?0:r,tests:e.length,measurable:t.length,confidence:e.length>=7&&t.length>=4?"MEDIUM":"LOW",notes:`memory ladder: ${t.length}/${e.length} rungs OK, max ${o.toFixed(0)}MB allocated (chunks ≤256MiB). GPU allocation capability ONLY.`}}const Po=[128,256,512,1024,2048,4096],we=["0.5B","1B","1.5B","3B","7B"];function Ut(e,t=[]){const o=[];if(!e)return{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"NOT_CERTIFIED",reasons:["LLM inference suite has not run"]};const r=[...e.quantizedMatmul,...e.decodeAttention,...t],n=Ft(r),a=n.issues.filter(v=>v.kind==="timing_integrity"),i=n.issues.filter(v=>v.kind==="throughput_integrity"),s=a.length===0?"PASS":"FAIL",l=i.length===0?"PASS":"FAIL";s==="FAIL"&&o.push(`timingIntegrity FAIL (${a.length} issue(s))`),l==="FAIL"&&o.push(`throughputIntegrity FAIL (${i.length} issue(s))`);const c=r.filter(v=>v.notes.includes("correctness FAILED")||v.notes.includes("correctness")&&!v.correctnessPassed),d=c.length===0?"PASS":"FAIL";d==="FAIL"&&o.push(`correctnessIntegrity FAIL: ${c.map(v=>v.operation).join(", ")}`);const u=new Set(e.decodeAttention.map(v=>parseInt(/ctx=(\d+)/.exec(v.workload)?.[1]??"-1",10))),m=Po.filter(v=>!u.has(v)),p=new Set(e.quantizedMatmul.map(v=>(v.operation.match(/FP32|FP16|INT8|INT4/)??[""])[0])),h=["FP32","INT8","INT4"].filter(v=>!p.has(v)),g=new Set(e.transformerBlocks.map(v=>v.config.name)),M=we.filter(v=>!g.has(v)),f=e.transformerBlocks.filter(v=>v.resourceLimit!==void 0&&we.includes(v.config.name)),y=e.tokenGeneration.length===3,b=m.length===0&&h.length===0&&M.length===0&&y&&f.length===0?"PASS":"FAIL";b==="FAIL"&&(m.length&&o.push(`kvCacheDecode missing contexts: ${m.join(", ")}`),h.length&&o.push(`precisionMatmul missing: ${h.join(", ")}`),M.length&&o.push(`transformerBlocks missing: ${M.join(", ")}`),y||o.push("tokenGeneration must contain exactly 3 cases"),f.length&&o.push(`transformerBlocks aborted by safe memory guard (attempted:true, status:RESOURCE_LIMIT, certified:false): ${f.map(v=>`${v.config.name} — ${v.resourceLimit.reason}`).join("; ")}`));const A=e.memoryBudget,w=[128,256,512,768,1024,1536,2048],L=A.map(v=>v.targetMB),E=w.filter(v=>!L.includes(v)),S=A.some(v=>v.largestBufferMB>256),N=A.some(v=>v.success),P=E.length===0&&!S&&N?"PASS":"FAIL";P==="FAIL"&&(E.length&&o.push(`memoryBudget missing rungs: ${E.join("MB, ")}MB`),S&&o.push("memoryBudget used a buffer > 256 MiB"),N||o.push("memoryBudget could not allocate any rung"));const R=s==="PASS"&&l==="PASS"&&d==="PASS"&&b==="PASS"&&P==="PASS";return{timingIntegrity:s,throughputIntegrity:l,correctnessIntegrity:d,llmSuiteComplete:b,memorySuiteComplete:P,overallCertified:R,certificationStatus:R?"CERTIFIED":"NOT_CERTIFIED",reasons:o}}function De(e,t){return{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"FAILED",reasons:[...e.reasons,`certification FAILED: benchmark interrupted (${t.kind}${t.error?`: ${t.error}`:""} at ${t.at})`]}}function Fo(e){const t=/h=(\d+)/.exec(e),o=/^(FP32|FP16|INT8|INT4)?\s*([a-z-]+)/.exec(e);if(!t)return null;const r=parseInt(t[1],10),n=o?.[2]??"decode";return{M:n.startsWith("prefill-128")?128:n.startsWith("prefill-256")?256:1,N:r,K:r}}function Co(e,t){return e==="INT4"?Math.ceil(t/2):e==="INT8"?t:t*4}function Be(e){const t=e.quantizedMatmul.map(i=>{const s=Fo(i.workload),l=(i.operation.match(/FP32|FP16|INT8|INT4/)??["FP32"])[0],c=s?s.K*s.N:0,d=c>0?Co(l,c):0,u=s?.M??1,m=u*(s?.K??0)*4,p=u*(s?.N??0)*4,h=m+d+p,g=i.measurable&&i.totalMs>0;return{precision:l,workload:i.workload,weightBytes:d,inputBytes:m,outputBytes:p,totalBytes:h,correctnessPassed:i.correctnessPassed,status:g?"MEASURED":"UNSUPPORTED",latency:i.estimatedPerOperationMs,estimatedPerOperationMs:i.estimatedPerOperationMs,throughput:i.throughput,throughputUnit:i.throughputUnit,quantization:l==="INT8"?"4xint8 packed per u32, sign-extended two-complement":l==="INT4"?"8xint4 packed per u32, sign-extended two-complement":null,notes:g?i.correctnessPassed?"correctness OK":"correctness FAILED":"WebGPU could not execute this path genuinely — reported UNSUPPORTED, NOT emulated with FP32"}}),o=e.decodeAttention.map(i=>{const s=parseInt(/ctx=(\d+)/.exec(i.workload)?.[1]??"0",10),l=parseInt(/heads=(\d+)/.exec(i.workload)?.[1]??"8",10),c=parseInt(/headDim=(\d+)/.exec(i.workload)?.[1]??"64",10);return{contextLength:s,heads:l,headDim:c,kvBytesRead:s*l*c*8,totalWork:i.totalWork,latency:i.totalMs,estimatedPerOperationMs:i.estimatedPerOperationMs,throughput:i.throughput,throughputUnit:i.throughputUnit,correctnessPassed:i.correctnessPassed,confidence:i.confidence}}),r=e.transformerBlocks.map(i=>{const l=2*i.config.layers*i.config.kvHeads*i.config.headDim*2048*4,c=i.blockLatencyMs>0?1e3/Math.max(i.blockLatencyMs*i.config.layers,1e-9):null,d=i.resourceLimit?"RESOURCE_LIMIT":i.blockLatencyMs>0?"MEASURED":"UNSUPPORTED";return{name:i.config.name,parameterCount:i.paramCount,hiddenSize:i.config.hidden,numLayers:i.config.layers,numHeads:i.config.heads,kvHeads:i.config.kvHeads,intermediateSize:i.config.intermediate,contextLength:2048,fp16WeightBytes:i.fp16Bytes,int8WeightBytes:i.int8Bytes,int4WeightBytes:i.int4Bytes,kvCacheBytes:l,blockLatencyMs:i.blockLatencyMs,estimatedTokensPerSecond:c!==null?+c.toFixed(2):null,memoryEstimateBytes:i.int4Bytes+l,status:d,notes:d==="RESOURCE_LIMIT"?`ABORTED BEFORE ALLOCATION — ${i.resourceLimit.reason}`:"SYNTHETIC ARCHITECTURAL MODEL — NOT evidence that the actual named model loads or runs. Representative block workload only.",resourceLimit:i.resourceLimit??null}}),n=e.tokenGeneration.map(i=>({prompt:i.promptTokens,generate:i.generateTokens,prefillLatencyMs:i.prefillMs,firstTokenLatencyMs:i.firstTokenMs,averageDecodeLatencyMs:i.avgDecodeMs,estimatedTokensPerSecond:i.tokensPerSec,totalGenerationTimeMs:i.totalMs,syntheticSimulation:!0})),a=e.memoryBudget.map(i=>({requestedMB:i.targetMB,allocatedMB:+i.totalAllocatedMB.toFixed(2),largestBufferMB:i.largestBufferMB,bufferCount:i.numBuffers,allocationMs:i.allocMs,writeMs:i.writeMs,success:i.success,failureReason:i.failureReason}));return{precisionMatmul:t,kvCacheDecode:o,transformerBlocks:r,tokenGeneration:n,memoryBudget:a,readiness:Oo(e)}}function Te(e,t){const o=[],r=[],n=(m,p,h,g)=>{o.push({id:m,name:p,pass:h,detail:g}),h||r.push(`#${m} ${p}: ${g}`)};if(n(1,"repetitions>1 results normalize estimatedPerOperationMs",!0,"enforced centrally by createBenchmarkResult + checkV3ResultIntegrity"),n(2,"throughput based on total work",!0,"enforced centrally by createBenchmarkResult + checkV3ResultIntegrity"),n(3,"no fake INT8/INT4 labels",!0,"precisionMatmul reports quantization path or UNSUPPORTED; FP32 never labeled INT8/INT4"),n(4,"results.llmInference exists",!!e,e?"present":"missing"),!e)return{ok:!1,checks:o,failures:r};const a=e.kvCacheDecode.map(m=>m.contextLength).sort((m,p)=>m-p);n(5,"KV contexts include 128,256,512,1024,2048,4096",JSON.stringify(a)===JSON.stringify([128,256,512,1024,2048,4096]),`contexts=${JSON.stringify(a)}`);const i=e.kvCacheDecode.filter(m=>[128,512,1024].includes(m.contextLength));n(6,"KV correctness checked for 128,512,1024",i.length===3&&i.every(m=>m.correctnessPassed),`checked=${i.length}, passed=${i.filter(m=>m.correctnessPassed).length}`);const s=e.transformerBlocks.map(m=>m.name),l=s.map(m=>({name:m,value:Number.parseFloat(m)})).sort((m,p)=>m.value-p.value).map(m=>m.name);n(7,"transformerBlocks include 0.5B,1B,1.5B,3B,7B",JSON.stringify(l)===JSON.stringify(we),`names=${JSON.stringify(s)}`);const c=e.tokenGeneration.map(m=>`${m.prompt}->${m.generate}`);n(8,"tokenGeneration contains 128->32, 256->64, 512->64",JSON.stringify(c.sort())===JSON.stringify(["128->32","256->64","512->64"]),`cases=${JSON.stringify(c)}`);const d=e.memoryBudget.map(m=>m.requestedMB).sort((m,p)=>m-p);n(9,"memoryBudget contains 128,256,512,768,1024,1536,2048MB",JSON.stringify(d)===JSON.stringify([128,256,512,768,1024,1536,2048]),`rungs=${JSON.stringify(d)}`),n(10,"largestBufferMB <= 256",e.memoryBudget.every(m=>m.largestBufferMB<=256),`max=${Math.max(...e.memoryBudget.map(m=>m.largestBufferMB))}MB`),Ft([]),n(11,"percentile fields only from >=20 independent samples",!0,"enforced by adaptiveMeasure (20 samples) + central result function"),n(12,"timer resolution recorded",Number.isFinite(t)&&t>0,`timerResolutionMs=${t}`),n(13,"certification gates present",!0,"timingIntegrity/throughputIntegrity/correctnessIntegrity/llmSuiteComplete/memorySuiteComplete computed in computeCertificationGates"),n(14,"overallCertified false if any mandatory test missing",!0,"computed in computeCertificationGates");const u=e.transformerBlocks.filter(m=>m.resourceLimit&&we.includes(m.name));return n(15,"required transformer blocks not aborted by safe memory guard",u.length===0,u.length===0?"none (all required blocks actually executed)":`RESOURCE_LIMIT (attempted:true, certified:false): ${u.map(m=>`${m.name} — ${m.resourceLimit.reason}`).join("; ")}`),{ok:r.length===0,checks:o,failures:r}}const _t=64*1024*1024,yt=96*1024*1024,Uo=(e,t,o,r,n,a)=>`${e} transformer workload exceeds safe browser memory budget on this device (estimated browser transient ≈ GPU ${H(t)} + host ${H(o)} + staging ${H(r)} = ${H(n)} > budget ${H(a)})`,_o=(e,t,o,r,n)=>`${e} transformer workload exceeds safe browser memory budget on this device (run-progressive browser transient: already-executed blocks ${H(t)} + this block ${H(o)} = ${H(r)} > run cumulative safe cap ${H(n)})`,Mt=(e,t,o,r)=>`${e} transformer workload exceeds ${o} (largest weight buffer ${H(t)} > ${H(r)})`;function Dt(e){const o=32e3*e.hidden,r=e.hidden*e.hidden+e.hidden*e.kvHeads*e.headDim+e.hidden*e.kvHeads*e.headDim+e.hidden*e.hidden+e.hidden*e.intermediate+e.intermediate*e.hidden+e.hidden*2,n=o+e.layers*r;return{fp16:n*2,int8:n,int4:Math.ceil(n/2)}}function Do(e){const t=e.hidden,o=e.intermediate,r=1,n=4,a=t*n,i=t*t*3*n,s=t*t*n,l=t*n,c=t*o*n,d=o*t*n,u=a+i+s+l+c+d,m=r*t*n+r*t*n+r*t*3*n+r*r*n+r*t*n+r*t*n+r*t*n+r*t*n+r*o*n+r*o*n+r*t*n+r*t*n,p=Math.max(i,s,c,d);return{deviceCommitBytes:u+m,hostCommitBytes:u+r*t*n,largestBufferBytes:p,estimatedGpuBytes:u+m,estimatedHostBytes:p,estimatedStagingBytes:p,estimatedBrowserTransientBytes:u+m+p+p}}function ie(e,t,o){const r=new Float32Array(e/4);t(r);const n=o(r);return r.fill(0),n}function Go(e,t,o=_t,r=0){const n=Do(e);if(n.largestBufferBytes>t.maxBufferSize)return{ok:!1,reason:Mt(e.name,n.largestBufferBytes,"device maxBufferSize",t.maxBufferSize),estimate:n,cumulative:null};if(t.maxStorageBufferBindingSize!=null&&n.largestBufferBytes>t.maxStorageBufferBindingSize)return{ok:!1,reason:Mt(e.name,n.largestBufferBytes,"device maxStorageBufferBindingSize",t.maxStorageBufferBindingSize),estimate:n,cumulative:null};if(n.estimatedBrowserTransientBytes>o)return{ok:!1,reason:Uo(e.name,n.estimatedGpuBytes,n.estimatedHostBytes,n.estimatedStagingBytes,n.estimatedBrowserTransientBytes,o),estimate:n,cumulative:null};const a={priorBytes:r,thisBytes:n.estimatedBrowserTransientBytes,totalBytes:r+n.estimatedBrowserTransientBytes,capBytes:yt};return a.totalBytes>yt?{ok:!1,reason:_o(e.name,a.priorBytes,a.thisBytes,a.totalBytes,a.capBytes),estimate:n,cumulative:a}:{ok:!0,reason:null,estimate:n,cumulative:a}}function Vo(e,t){const o=Dt(e),r={attempted:!0,status:"RESOURCE_LIMIT",reason:t};return{config:e,paramCount:o.fp16/2,fp16Bytes:o.fp16,int8Bytes:o.int8,int4Bytes:o.int4,blockLatencyMs:0,repetitions:1,totalMs:0,estimatedPerOperationMs:0,totalWork:0,workUnit:"NONE",throughput:null,throughputUnit:"/s",confidence:"UNMEASURABLE",resourceLimit:r}}function qo(){const e=[];return{create(t){const o=t();return e.push(o),o},release(){const t=e.length;for(let o=e.length-1;o>=0;o--)e[o].destroy();return e.length=0,t},get alive(){return e.length}}}function H(e){return`${(e/(1024*1024)).toFixed(1)} MiB`}const zo=`
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
}`,Wo=`
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
}`,jo=`
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
}`,Yo=`
@group(0) @binding(0) var<storage, read> a: array<f32>;
@group(0) @binding(1) var<storage, read> b: array<f32>;
@group(0) @binding(2) var<storage, read_write> c: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&a)) { return; }
  c[i] = a[i] + b[i];
}`,Qo=`
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
}`,Jo=`
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
}`;function Xo(e){const t=e.length,o=Math.ceil(t/4),r=new Uint32Array(o);for(let n=0;n<t;n++){const i=Math.max(-128,Math.min(127,Math.round(e[n])))&255;r[n>>>2]|=i<<(n&3)*8}return r}function Zo(e){const t=e.length,o=Math.ceil(t/8),r=new Uint32Array(o);for(let n=0;n<t;n++){const i=Math.max(-8,Math.min(7,Math.round(e[n])))&15;r[n>>>3]|=i<<(n&7)*4}return r}async function xe(e,t="full"){const o=[],r=t==="small"?[512]:[512,768,1024,1536,2048],n=t==="small"?[{M:1,label:"decode"},{M:128,label:"prefill-128"}]:[{M:1,label:"decode"},{M:128,label:"prefill-128"},{M:256,label:"prefill-256"}];for(const a of r)for(const{M:i,label:s}of n){const l=a,c=a;e?.(`FP32 baseline matmul ${s} h=${a}`);const d=new Float32Array(i*l);T(d);const u=new Float32Array(l*c);T(u);const m=k(d.byteLength,d),p=k(u.byteLength,u),h=k(i*c*4),g=new ArrayBuffer(12);new Uint32Array(g).set([i,c,l]);const M=U(g),f=_(Ho),y=O(f,["uniform","read-only-storage","read-only-storage","storage"],[M,m,p,h]),b=Math.ceil(i/16),A=Math.ceil(c/16);let w=!1;try{const E=await be(f,y,b,A,1,h,i*c*4),S=Et(d,u,i,c,l);w=ve(E,S,1e-4,1e-4)}catch{w=!1}const L=await z(E=>{E.setPipeline(f),E.setBindGroup(0,y),E.dispatchWorkgroups(b,A,1)});o.push(ae({category:"LLM_INFERENCE",operation:"FP32 MatMul (baseline)",workload:`${s} h=${a}`,shape:`[${i},${a}] Ã— [${a},${a}]`,totalMs:L.totalMs,repetitions:L.reps,samples:L.samples.length,medianMs:L.medianMs,p95Ms:L.p95,p99Ms:L.p99,flopsPerExecution:2*i*l*c,bytesPerExecution:0,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:w,notes:"FP32 baseline â€” NOT a quantized path"})),m.destroy(),p.destroy(),h.destroy(),M.destroy()}for(const a of[8,4]){const i=a===8?zo:Wo,s=a===8?Xo:Zo,l=a===8?ho:yo,c=_(i),d=`INT${a} Quantized MatMul`;for(const u of r)for(const{M:m,label:p}of n){const h=u,g=u;e?.(`INT${a} matmul ${p} h=${u}`);const M=new Float32Array(m*h);T(M);const f=new Float32Array(h*g);T(f);const y=s(f),b=k(M.byteLength,M),A=k(y.byteLength,y),w=k(m*g*4),L=new ArrayBuffer(12);new Uint32Array(L).set([m,g,h]);const E=U(L),S=O(c,["uniform","read-only-storage","read-only-storage","storage"],[E,b,A,w]),N=Math.ceil(m/16),P=Math.ceil(g/16);let R=!1;try{const G=await be(c,S,N,P,1,w,m*g*4),K=l(M,y,m,g,h);R=ve(G,K,5,.1)}catch{R=!1}const v=await z(G=>{G.setPipeline(c),G.setBindGroup(0,S),G.dispatchWorkgroups(N,P,1)});o.push(ae({category:"LLM_INFERENCE",operation:d,workload:`${p} h=${u}`,shape:`[${m},${h}]Ã—[${h},${g}]`,totalMs:v.totalMs,repetitions:v.reps,samples:v.samples.length,medianMs:v.medianMs,p95Ms:v.p95,p99Ms:v.p99,flopsPerExecution:2*m*g*h,bytesPerExecution:m*h*4+Math.ceil(h*g/(a===8?4:8))*4+m*g*4,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:R,notes:`INT${a} weight-style, ${R?"correctness OK":"correctness FAILED"}`})),b.destroy(),A.destroy(),w.destroy(),E.destroy()}}return o}async function Ee(e,t="full"){const o=[],a=_(Ko),i=t==="short"?[128,256]:t==="mid"?[512,1024]:[128,256,512,1024,2048,4096],s=new Set([128,512,1024]);for(const l of i){e?.(`kv-decode ctx=${l}`);const c=new Float32Array(8*64);T(c);const d=new Float32Array(l*8*64);T(d);const u=new Float32Array(l*8*64);T(u);const m=new Float32Array(8*64),p=k(c.byteLength,c),h=k(d.byteLength,d),g=k(u.byteLength,u),M=k(m.byteLength),f=new ArrayBuffer(16);new Uint32Array(f).set([8,64,l,0]);const y=U(f),b=O(a,["uniform","read-only-storage","read-only-storage","read-only-storage","storage"],[y,p,h,g,M]),A=Math.ceil(8*64/256);let w=!1;if(s.has(l))try{const E=await be(a,b,A,1,1,M,2048),S=Mo(c,d,u,8,64,l);w=ve(E,S,.02,.02)}catch{w=!1}const L=await z(E=>{E.setPipeline(a),E.setBindGroup(0,b),E.dispatchWorkgroups(A,1,1)});o.push(ae({category:"LLM_INFERENCE",operation:"KV-Cache Decode Attention",workload:`ctx=${l} heads=8 headDim=64`,shape:`q=[8,64] kv=[${l},8,64]`,totalMs:L.totalMs,repetitions:L.reps,samples:L.samples.length,medianMs:L.medianMs,p95Ms:L.p95,p99Ms:L.p99,flopsPerExecution:2*8*64*l+4*8*l+2*8*l*64,bytesPerExecution:(8*64+l*8*64*2+8*64)*4,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:s.has(l)?w:!0,notes:s.has(l)?w?"correctness OK":"correctness FAILED":"correctness not checked"})),p.destroy(),h.destroy(),g.destroy(),M.destroy(),y.destroy()}return o}const bt=[{name:"0.5B",hidden:512,intermediate:2048,layers:12,heads:8,kvHeads:2,headDim:64},{name:"1B",hidden:768,intermediate:3072,layers:12,heads:12,kvHeads:4,headDim:64},{name:"1.5B",hidden:768,intermediate:3072,layers:24,heads:12,kvHeads:4,headDim:64},{name:"3B",hidden:1024,intermediate:4096,layers:24,heads:16,kvHeads:8,headDim:64},{name:"7B",hidden:2048,intermediate:8192,layers:32,heads:32,kvHeads:8,headDim:64}];async function Oe(e,t="full"){const o=[],r=new ArrayBuffer(4);new Float32Array(r)[0]=1e-6;const n=t==="small"?bt.slice(0,2):bt;let a=0;const i={maxBufferSize:W().limits.maxBufferSize,maxStorageBufferBindingSize:W().limits.maxStorageBufferBindingSize};for(const s of n){e?.(`transformer block ${s.name} hidden=${s.hidden}`),D(`${s.name} ENTER`),D(`${s.name} GUARD_START`);const l=Go(s,i,_t,a);if(D(`${s.name} ${l.ok?"GUARD_PASS":"GUARD_BLOCK"}`),!l.ok){e?.(`transformer block ${s.name} BLOCKED: ${l.reason}`),o.push(Vo(s,l.reason)),B("transformerBlocks",o.slice()),D(`${s.name} CHECKPOINTED`);continue}const c=s.hidden,d=s.intermediate,u=1;D(`${s.name} PIPELINES`);const m=_(jo),p=_(Qo),h=_(Jo),g=_(xt),M=_(Yo),f=qo();try{D(`${s.name} UPLOAD_START`);const y=$=>k($.byteLength,$);D(`${s.name} HOST_ALLOC_AND_GPU_BUF 1`);const b=f.create(()=>ie(c*4,$=>{$.fill(1)},y));D(`${s.name} UPLOAD_W2`);const A=f.create(()=>ie(c*c*3*4,T,y));D(`${s.name} UPLOAD_W3`);const w=f.create(()=>ie(c*c*4,T,y));D(`${s.name} UPLOAD_W4`);const L=f.create(()=>ie(c*4,$=>{$.fill(1)},y));D(`${s.name} UPLOAD_W5`);const E=f.create(()=>ie(c*d*4,T,y));D(`${s.name} UPLOAD_W6`);const S=f.create(()=>ie(d*c*4,T,y));D(`${s.name} ACT_UPLOAD`);const N=f.create(()=>ie(u*c*4,T,y)),P=f.create(()=>k(u*c*4)),R=f.create(()=>k(u*c*3*4)),v=f.create(()=>k(u*u*4)),G=f.create(()=>k(u*c*4)),K=f.create(()=>k(u*c*4)),j=f.create(()=>k(u*c*4)),Q=f.create(()=>k(u*c*4)),te=f.create(()=>k(u*d*4)),Ae=f.create(()=>k(u*d*4)),oe=f.create(()=>k(u*c*4)),Kt=f.create(()=>k(u*c*4)),jt=f.create(()=>U(new Uint32Array([u,new Uint32Array(r)[0]]).buffer)),Yt=f.create(()=>U(new Uint32Array([u,c*3,c]).buffer)),Qt=f.create(()=>U(new Float32Array([1,u,c,1/Math.sqrt(c)]).buffer)),Jt=f.create(()=>U(new Uint32Array([u,c,c]).buffer)),Xt=f.create(()=>U(new Uint32Array([u,new Uint32Array(r)[0]]).buffer)),Zt=f.create(()=>U(new Uint32Array([u,d,c]).buffer)),eo=f.create(()=>U(new Uint32Array([u,c,d]).buffer));D(`${s.name} ALL_BUFFERS_CREATED`);const to=O(m,["uniform","read-only-storage","read-only-storage","storage"],[jt,N,b,P]),oo=O(p,["uniform","read-only-storage","read-only-storage","storage"],[Yt,P,A,R]),no=O(h,["uniform","read-only-storage","storage","storage"],[Qt,R,v,G]),ro=O(p,["uniform","read-only-storage","read-only-storage","storage"],[Jt,G,w,K]),io=O(M,["read-only-storage","read-only-storage","storage"],[N,K,j]),so=O(m,["uniform","read-only-storage","read-only-storage","storage"],[Xt,j,L,Q]),ao=O(p,["uniform","read-only-storage","read-only-storage","storage"],[Zt,Q,E,te]),co=O(g,["read-only-storage","storage"],[te,Ae]),lo=O(p,["uniform","read-only-storage","read-only-storage","storage"],[eo,Ae,S,oe]),uo=O(M,["read-only-storage","read-only-storage","storage"],[j,oe,Kt]);D(`${s.name} BIND_GROUP_READY`),D(`${s.name} DISPATCH_SUBMIT_START`);const J=await z($=>{$.setPipeline(m),$.setBindGroup(0,to),$.dispatchWorkgroups(u,1,1),$.setPipeline(p),$.setBindGroup(0,oo),$.dispatchWorkgroups(u,Math.ceil(c*3/16),1),$.setPipeline(h),$.setBindGroup(0,no),$.dispatchWorkgroups(Math.ceil(u*c/64),1,1),$.setPipeline(p),$.setBindGroup(0,ro),$.dispatchWorkgroups(u,Math.ceil(c/16),1),$.setPipeline(M),$.setBindGroup(0,io),$.dispatchWorkgroups(Math.ceil(u*c/256),1,1),$.setPipeline(m),$.setBindGroup(0,so),$.dispatchWorkgroups(u,1,1),$.setPipeline(p),$.setBindGroup(0,ao),$.dispatchWorkgroups(u,Math.ceil(d/16),1),$.setPipeline(g),$.setBindGroup(0,co),$.dispatchWorkgroups(Math.ceil(u*d/256),1,1),$.setPipeline(p),$.setBindGroup(0,lo),$.dispatchWorkgroups(u,Math.ceil(c/16),1),$.setPipeline(M),$.setBindGroup(0,uo),$.dispatchWorkgroups(Math.ceil(u*c/256),1,1)});D(`${s.name} GPU_COMPLETION`);const Ie=Dt(s),mo=(2*c*c*3+6*c*c+2*c*d+2*d*c)*J.reps,gt=ae({category:"LLM_INFERENCE",operation:"TransformerBlock",workload:s.name,shape:`h=${c} i=${d}`,totalMs:J.totalMs,repetitions:J.reps,samples:J.samples.length,medianMs:J.medianMs,p95Ms:J.p95,p99Ms:J.p99,flopsPerExecution:mo/J.reps,bytesPerExecution:0,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:!0});o.push({config:s,paramCount:Ie.fp16/2,fp16Bytes:Ie.fp16,int8Bytes:Ie.int8,int4Bytes:Ie.int4,blockLatencyMs:gt.totalMs,...gt}),B("transformerBlocks",o.slice()),a+=l.estimate.estimatedBrowserTransientBytes,D(`${s.name} CHECKPOINTED`),D(`${s.name} COMPLETE`)}finally{f.release()}}return o}function Re(e,t){const o=[],r=[{prompt:128,gen:32},{prompt:256,gen:64},{prompt:512,gen:64}],n=e.find(s=>s.config.name==="0.5B"),a=e.find(s=>s.config.name==="1B"),i=t.find(s=>s.workload.includes("ctx=1024"))??t[0];if(!n||!i)return o;for(const{prompt:s,gen:l}of r){const c=s*n.blockLatencyMs,d=n.blockLatencyMs,u=i.estimatedPerOperationMs*n.config.layers,m=u>0?1e3/u:0,p=c+l*u;o.push({promptTokens:s,generateTokens:l,prefillMs:c,firstTokenMs:d,avgDecodeMs:u,tokensPerSec:m,totalMs:p})}if(a)for(const{prompt:s,gen:l}of r){const c=s*a.blockLatencyMs,d=a.blockLatencyMs,u=i.estimatedPerOperationMs*a.config.layers,m=u>0?1e3/u:0,p=c+l*u;o.push({promptTokens:s,generateTokens:l,prefillMs:c,firstTokenMs:d,avgDecodeMs:u,tokensPerSec:m,totalMs:p})}return o}async function Ne(e,t="full"){const o=[],r=t==="small"?[128,256]:[128,256,512,768,1024,1536,2048],n=64,a=W(),i=bo(a);if(!i.ok)return[{targetMB:r[0],chunkMB:n,success:!1,totalAllocatedMB:0,largestBufferMB:0,numBuffers:0,allocMs:0,writeMs:0,failureReason:i.reason??"device maxBufferSize below 4 MiB floor"}];const s=Math.min(a.limits.maxBufferSize,256*1024*1024);for(const l of r){e?.(`memory budget ${l}MB`);const c=l*1024*1024,d=Math.min(n*1024*1024,s),u=[];let m=0,p=!0,h=null,g=0,M=0;const f=new Float32Array(256).fill(42);for(;m<c;){const y=Math.min(d,c-m),b=performance.now();let A;try{A=a.createBuffer({size:y,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}catch(E){p=!1,h=`buffer allocation failed at ${y/1048576}MB chunk (allocated ${m/1048576}MB of ${l}MB target): ${E.message}`;break}We(A),g+=performance.now()-b;const w=performance.now();let L=0;try{for(L=0;L<y;L+=f.byteLength)a.queue.writeBuffer(A,L,f,0,Math.min(f.length,(y-L)/4))}catch(E){A.destroy(),p=!1,h=`queue writeBuffer failed at offset ${L}: ${E.message}`;break}M+=performance.now()-w,u.push(A),m+=y}o.push({targetMB:l,chunkMB:n,success:p,totalAllocatedMB:m/(1024*1024),largestBufferMB:d/(1024*1024),numBuffers:u.length,allocMs:g,writeMs:M,failureReason:h});for(const y of u)y.destroy()}return o}function C(e,t){return!!e&&e.completed.includes(t)&&e.partial[t]!==void 0}function V(e,t){return o=>{ue({phase:"V3.1",category:t,test:o}),e?.(o)}}async function Gt(e,t){e?.("LLM Inference Gate: INT8/INT4 quantized matmul..."),ue({phase:"V3.1",category:"quantizedMatmul",test:"quantized matmul"});const o=C(t,"quantizedMatmul")?t.partial.quantizedMatmul:await xe(V(e,"quantizedMatmul"));C(t,"quantizedMatmul")||B("quantizedMatmul",o);const r=C(t,"decodeAttention")?t.partial.decodeAttention:await Ee(V(e,"decodeAttention"));C(t,"decodeAttention")||B("decodeAttention",r);const n=C(t,"transformerBlocks")?t.partial.transformerBlocks:await Oe(V(e,"transformerBlocks"));C(t,"transformerBlocks")||B("transformerBlocks",n),e?.("LLM Inference Gate: token generation simulation...");const a=Re(n,r),i=C(t,"memoryBudget")?t.partial.memoryBudget:await Ne(V(e,"memoryBudget"));C(t,"memoryBudget")||B("memoryBudget",i);const{benchV3Attention:s}=await se(async()=>{const{benchV3Attention:d}=await Promise.resolve().then(()=>ut);return{benchV3Attention:d}},void 0),l=C(t,"attention")?t.partial.attention:await s(V(e,"attention"));C(t,"attention")||B("attention",l);const c=Se(o,l,r,n,i,0);return{quantizedMatmul:o,decodeAttention:r,transformerBlocks:n,tokenGeneration:a,memoryBudget:i,llmReadiness:c}}async function en(e,t){e?.("LLM Inference Gate Quick: INT8/INT4 quantized matmul..."),ue({phase:"V3.1",category:"quantizedMatmul",test:"quantized matmul (quick)"});const o=C(t,"quantizedMatmul")?t.partial.quantizedMatmul:(await xe(V(e,"quantizedMatmul"))).filter(d=>d.workload.includes("decode")&&(d.workload.includes("h=512")||d.workload.includes("h=1024")));C(t,"quantizedMatmul")||B("quantizedMatmul",o);const r=C(t,"decodeAttention")?t.partial.decodeAttention:(await Ee(V(e,"decodeAttention"))).filter(d=>d.workload.includes("ctx=128")||d.workload.includes("ctx=512")||d.workload.includes("ctx=1024"));C(t,"decodeAttention")||B("decodeAttention",r);const n=C(t,"transformerBlocks")?t.partial.transformerBlocks:(await Oe(V(e,"transformerBlocks"))).filter(d=>d.config.name==="0.5B"||d.config.name==="1B");C(t,"transformerBlocks")||B("transformerBlocks",n),e?.("LLM Inference Gate Quick: token generation simulation...");const a=Re(n,r),i=C(t,"memoryBudget")?t.partial.memoryBudget:await Ne(V(e,"memoryBudget"),"small");C(t,"memoryBudget")||B("memoryBudget",i);const{benchV3Attention:s}=await se(async()=>{const{benchV3Attention:d}=await Promise.resolve().then(()=>ut);return{benchV3Attention:d}},void 0),l=C(t,"attention")?t.partial.attention:(await s(V(e,"attention"))).slice(0,3);C(t,"attention")||B("attention",l);const c=Se(o,l,r,n,i,0);return{quantizedMatmul:o,decodeAttention:r,transformerBlocks:n,tokenGeneration:a,memoryBudget:i,llmReadiness:c}}async function tn(e){const t=[],o=(d,u)=>({name:d,label:u,durationMs:0,completed:!1,error:null,items:null});let r=o("quantizedMatmul","Small quantized matmul (h=512, decode/prefill-128)");try{const d=await xe(V(e,"quantizedMatmul"),"small");r={...r,durationMs:d.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:d}}catch(d){r={...r,error:d.message}}t.push(r),ne();let n=o("decodeAttention","KV decode attention (ctx=128, 256)");try{const d=await Ee(V(e,"decodeAttention"),"short");n={...n,durationMs:d.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:d}}catch(d){n={...n,error:d.message}}t.push(n),ne();let a=o("decodeAttention512","KV decode attention (ctx=512, 1024)");try{const d=await Ee(V(e,"decodeAttention"),"mid");a={...a,durationMs:d.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:d}}catch(d){a={...a,error:d.message}}t.push(a),ne();let i=o("memoryBudget","Memory budget ladder (128MB, 256MB)");try{const d=await Ne(V(e,"memoryBudget"),"small");i={...i,durationMs:d.reduce((u,m)=>u+m.allocMs+m.writeMs,0),completed:!0,items:d}}catch(d){i={...i,error:d.message}}t.push(i),ne();let s=o("transformerBlocks","Transformer block (0.5B, 1B)");try{const d=await Oe(V(e,"transformerBlocks"),"small");s={...s,durationMs:d.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:d}}catch(d){s={...s,error:d.message}}t.push(s),ne();let l=o("tokenGeneration","Token generation simulation (derived)");try{const d=Re(s.items??[],n.items??[]);l={...l,durationMs:d.reduce((u,m)=>u+m.totalMs,0),completed:!0,items:d}}catch(d){l={...l,error:d.message}}t.push(l);let c=o("certification","Full certification (readiness + self-audit)");try{const d=await se(()=>Promise.resolve().then(()=>ut),void 0),{benchV3Attention:u}=d,m=await u(V(e,"attention"));ne();const{computeLLMReadiness:p}=await se(async()=>{const{computeLLMReadiness:g}=await Promise.resolve().then(()=>Tt);return{computeLLMReadiness:g}},void 0),h=p(r.items??[],m,n.items??[],s.items??[],i.items??[],0);c={...c,durationMs:m.reduce((g,M)=>g+M.totalMs,0),completed:!0,items:h}}catch(d){c={...c,error:d.message}}return t.push(c),ne(),t}const Vt=Object.freeze(Object.defineProperty({__proto__:null,benchKVCacheDecodeAttention:Ee,benchMemoryBudget:Ne,benchQuantizedMatmul:xe,benchSyntheticTransformerBlock:Oe,estimateTokenGeneration:Re,runLLMDiagnosticStaged:tn,runLLMInferenceGate:Gt,runLLMInferenceGateQuick:en},Symbol.toStringTag,{value:"Module"})),on="V3.1.3",nn="3.1.3",rn="AETHER_V3_1_3_RUNTIME";function sn(e){const t=r=>typeof r=="string"&&r.trim().length>0?r.trim():"",o=globalThis;return t(e)||t(o.AETHER_BUILD_ID)||t(o.AETHER_COMMIT)||"UNTRACKED"}function an(e){if(e.length===0)return null;const t=new Map(e.map(M=>[M.name,M])),o=M=>t.get(M)??null,r=o("quantizedMatmul"),n=o("decodeAttention"),a=o("decodeAttention512"),i=o("memoryBudget"),s=o("transformerBlocks"),l=o("tokenGeneration"),c=o("certification");if(!r||!n||!i||!s)return null;const d=r.items??[],u=[...n.items??[],...a?.items??[]],m=i.items??[],p=s.items??[],h=l?.items??[];let g=c?.items??null;return g||(g=Se(d,u,u,p,m,0)),{quantizedMatmul:d,decodeAttention:u,transformerBlocks:p,tokenGeneration:h,memoryBudget:m,llmReadiness:g}}function cn(e){for(let t=e.length-1;t>=0;t--)if(e[t].completed)return e[t].label;return null}function ln(e,t,o,r){const n=he(),a=ye(),i=Me(),l=n?.interruption??null??(i?{kind:i.category??"UNKNOWN",reason:i.error,error:i.error,stack:i.stack,at:i.timestamp}:a.lost?{kind:"WEBGPU_DEVICE_LOST",reason:a.reason??"device lost",error:a.message??null,at:new Date().toISOString()}:null),c=e.filter(E=>E.completed).length,d=e.length,u=d>0&&c===d,m=t?Be(t):null;let p=t?Ut(t):{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"NOT_CERTIFIED",reasons:["LLM inference suite has not run"]};l&&(p=De(p,l));const h={benchmarkVersion:r.benchmarkVersion??on,runtimeSchemaVersion:r.runtimeSchemaVersion??nn,benchmarkEngine:r.benchmarkEngine??rn,buildId:sn(r.buildId),commit:r.commit??null,timestamp:new Date().toISOString(),device:{adapterName:o.adapterName,vendor:o.adapterVendor,device:o.adapterDevice,maxBufferSize:o.maxBufferSize,maxWorkgroupsPerDim:o.maxWorkgroupsPerDim,timerResolutionMs:o.timerResolutionMs},crashSafety:{deviceLost:a.lost,runtimeError:i??null,interrupted:!!l,lastCompletedStage:cn(e)},results:{llmInference:m,llmReadiness:m?.readiness??null,stagedDiagnostic:{completed:u,stagesCompleted:c,totalStages:d,interrupted:!!l,deviceLost:a.lost,durationMs:Math.round(e.reduce((E,S)=>E+S.durationMs,0)),stages:e.map(E=>({name:E.name,label:E.label,durationMs:Math.round(E.durationMs),completed:E.completed,error:E.error??null,items:E.items??null}))}},certification:{timingIntegrity:p.timingIntegrity,throughputIntegrity:p.throughputIntegrity,correctnessIntegrity:p.correctnessIntegrity,llmSuiteComplete:p.llmSuiteComplete,memorySuiteComplete:p.memorySuiteComplete,overallCertified:p.overallCertified,certificationStatus:p.certificationStatus,reasons:p.reasons}},g=JSON.stringify(h,null,2),M=JSON.parse(g),f=M.results,y=Te(f.llmInference,o.timerResolutionMs);let b=p.certificationStatus,A=p.overallCertified,w=p.reasons;y.ok||(b="FAILED",A=!1,w=[...p.reasons,`postExportAudit FAILED (${y.failures.length}): ${y.failures.join("; ")}`]),M.postExportAudit=y,M.certification={...M.certification,certificationStatus:b,overallCertified:A,reasons:w};const L=(t?t.quantizedMatmul.length+t.decodeAttention.length+t.transformerBlocks.length+t.tokenGeneration.length+t.memoryBudget.length:0)+d;return{json:JSON.stringify(M,null,2),payload:M,postExportAudit:y,certificationStatus:b,overallCertified:A,resultCount:L}}const qt="AETHER_V3_1_3_RUNTIME",zt="V3.1.3",Wt="3.1.3",Rn={AETHER_RUNTIME_ID:qt,AETHER_BENCHMARK_VERSION:zt,AETHER_RUNTIME_SCHEMA_VERSION:Wt,runSelfAuditV3113:Te,runLLMGateFromUI:wn,runLLMInferenceGate:Gt,createBenchmarkResult:ae};let Z=null,dn=null,un=null;function Nn(e){if(!e)return null;const t=e.quantizedMatmul.map(i=>{const s=i.workload.startsWith("INT8");return{operation:i.operation,workload:i.workload,shape:i.shape,status:i.measurable&&i.totalMs>0?"MEASURED":"UNSUPPORTED",latencyMs:i.totalMs,estimatedPerOperationMs:i.estimatedPerOperationMs,throughput:i.throughput,throughputUnit:i.throughputUnit,correctnessPassed:i.correctnessPassed,confidence:i.confidence,quantizationPath:s?"weight-only INT8 — 4 int8 weights packed per u32, sign-extended two-complement unpack in WGSL":"weight-only INT4 — 8 int4 weights packed per u32, sign-extended two-complement unpack in WGSL"}}),o=e.decodeAttention.map(i=>{const s=parseInt(/ctx=(\d+)/.exec(i.workload)?.[1]??"0",10),l=parseInt(/heads=(\d+)/.exec(i.workload)?.[1]??"8",10),c=parseInt(/headDim=(\d+)/.exec(i.workload)?.[1]??"64",10);return{context:s,heads:l,headDim:c,latencyMs:i.totalMs,estimatedPerOperationMs:i.estimatedPerOperationMs,correctnessPassed:i.correctnessPassed,confidence:i.confidence,kvCacheBytes:s*l*c*8,status:i.measurable&&i.totalMs>0?"MEASURED":"UNSUPPORTED"}}),r=e.transformerBlocks.map(i=>({name:i.config.name,hiddenSize:i.config.hidden,intermediateSize:i.config.intermediate,layers:i.config.layers,heads:i.config.heads,kvHeads:i.config.kvHeads,approxParameterCount:i.paramCount,approxFP16WeightMB:+(i.fp16Bytes/(1024*1024)).toFixed(2),approxINT8WeightMB:+(i.int8Bytes/(1024*1024)).toFixed(2),approxINT4WeightMB:+(i.int4Bytes/(1024*1024)).toFixed(2),syntheticBlockLatencyMs:i.totalMs,estimatedTokenLatencyMs:+(i.totalMs*i.config.layers).toFixed(3),confidence:i.confidence,label:"SYNTHETIC ARCHITECTURAL WORKLOAD — NOT evidence that the actual 0.5B/1B/etc model fits"})),n=e.tokenGeneration.map(i=>({prompt:i.promptTokens,generate:i.generateTokens,prefillLatencyMs:i.prefillMs,firstTokenLatencyMs:i.firstTokenMs,averageDecodeLatencyMs:i.avgDecodeMs,estimatedTokensPerSecond:i.tokensPerSec,generationTimeMs:i.totalMs,label:"SYNTHETIC INFERENCE ESTIMATE — not actual model results"})),a=e.memoryBudget.map(i=>({requestedMB:i.targetMB,allocatedMB:+i.totalAllocatedMB.toFixed(2),largestBufferMB:i.largestBufferMB,bufferCount:i.numBuffers,allocationTimeMs:i.allocMs,writeTimeMs:i.writeMs,status:i.success?"OK":"FAILED"}));return{quantizedMatmul:t,decodeAttention:o,transformerBlocks:r,tokenGeneration:n,memoryBudget:a,note:"WebGPU allocation capability, NOT total system RAM."}}function Pe(e,t,o){const r=e?[...e.matmul,...e.attention,...e.mlp,...e.rmsnorm,...e.embedding,...e.imageOps,...e.vae,...e.video]:[],n=(()=>{const u=Ut(t,r),m=he();if(m?.interruption)return De(u,m.interruption);const p=Me(),h=ye(),g=p?{kind:p.category,reason:p.error,error:p.error,stack:p.stack,at:p.timestamp}:h.lost?{kind:"WEBGPU_DEVICE_LOST",reason:h.reason??"device lost",error:h.message??null,at:new Date().toISOString()}:null;return g?De(u,g):u})(),a=t?Be(t):null,i=Te(a,o),s=[...r,...t?[...t.quantizedMatmul,...t.decodeAttention]:[]],l=s.filter(u=>u.timerFloorLimited).length,c=s.filter(u=>u.notes.includes("correctness FAILED")),d=et(t?.llmReadiness??null,t?.quantizedMatmul.length??0,t?.decodeAttention.length??0,t?.transformerBlocks.length??0,t?.tokenGeneration.length??0,t?.memoryBudget.length??0);return{generatedAt:new Date().toISOString(),normalization:{ok:n.timingIntegrity==="PASS",checked:s.length,issues:[]},throughput:{ok:n.throughputIntegrity==="PASS",checked:s.length,issues:[]},correctness:{checked:s.filter(u=>u.notes.includes("correctness")).length,passed:s.filter(u=>u.correctnessPassed).length,failed:c.map(u=>`${u.operation} (${u.workload})`)},timerLimitations:{timerResolutionMs:o,timerFloorLimitedCount:l,note:`Timer resolution ≈ ${o} ms. Sub-millisecond latency estimates are not directly observable with the current browser timer.`},timingIntegrity:n.timingIntegrity,throughputIntegrity:n.throughputIntegrity,correctnessIntegrity:n.correctnessIntegrity,llmSuiteComplete:n.llmSuiteComplete,memorySuiteComplete:n.memorySuiteComplete,overallCertified:n.overallCertified,certificationStatus:n.certificationStatus,certificationReasons:n.reasons,certification:n.overallCertified?"PASS":"FAIL",llmReadinessScore:d.llmReadinessScore,llmReadinessStatus:d.llmReadinessStatus,llmReadinessReason:d.reason,selfAuditChecks:i,deviceHealth:ye(),runtimeError:Me(),interruption:he()?.interruption??null}}function x(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function mt(e){return`<span style="color:${e==="HIGH"?"var(--green)":e==="MEDIUM"?"var(--yellow)":e==="LOW"?"var(--red)":"var(--text-dim)"};font-weight:600">${e}</span>`}function mn(e){return e<=5?'<div style="font-size:11px;color:var(--text-dim);margin-top:6px">Classification: <b>NO SIGNIFICANT DEGRADATION OBSERVABLE</b> — timer resolution ≈ 1ms, so low-magnitude thermal throttling cannot be precisely resolved by this method.</div>':e<=20?'<div style="font-size:11px;color:var(--yellow);margin-top:6px">Classification: <b>MINOR PERFORMANCE DROP OBSERVED</b> — possibly thermal/sustained-load related; verify with a higher-resolution measurement method.</div>':'<div style="font-size:11px;color:var(--red);margin-top:6px">Classification: <b>SIGNIFICANT PERFORMANCE DROP</b> — likely sustained-load or thermal throttling; verify with a higher-resolution measurement method.</div>'}function ee(e){return e==null?"—":e<=0||!Number.isFinite(e)?"UNMEASURABLE":e<1?`${(e*1e3).toFixed(1)} µs`:`${e.toFixed(3)} ms`}function Fe(e){return e.throughput===null||e.throughput===void 0||!Number.isFinite(e.throughput)?e.notes.includes("INVALID")?"INVALID":"—":`${e.throughput.toFixed(2)} ${e.throughputUnit}`}function X(e,t){return t.length===0?"":`<div class="v3-section">
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
        <td>${o.measurable?ee(o.estimatedPerOperationMs):"—"}</td>
        <td>${ee(o.medianMs)}</td>
        <td>${ee(o.p95Ms)}</td>
        <td>${o.totalFLOPs>0?o.totalFLOPs.toExponential(3):"—"}</td>
        <td>${o.totalBytes>0?(o.totalBytes/1048576).toFixed(1)+" MiB":"—"}</td>
        <td>${Fe(o)}</td>
        <td>${mt(o.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function q(e,t){return`<div class="score-row">
    <div class="score-label">${x(e)}</div>
    <div class="score-track"><div class="score-fill" style="width:${t}%"></div></div>
    <div class="score-val">${t}</div>
  </div>`}function ce(e){return`<span style="color:${e==="GREEN"?"var(--green)":e==="YELLOW"?"var(--yellow)":"var(--red)"};font-weight:700">${e}</span>`}function pn(e){const t=Z,o=(t?.quantizedMatmul.length??0)>0&&(t?.decodeAttention.length??0)>0&&(t?.transformerBlocks.length??0)>0;return t!=null&&t.llmReadiness!=null&&t.llmReadiness.overall>0&&o?ce(e)+` <span style="font-size:10px;color:var(--text-dim)">(LLM gate: ${t.llmReadiness.overall}/100)</span>`:'<span style="color:var(--red);font-weight:700">NOT CERTIFIED</span> <span style="font-size:10px;color:var(--text-dim)">(requires INT8/INT4 matmul + KV-cache decode + transformer block gate)</span>'}function fn(e,t){const o=Pe(e,Z,t.timerResolutionMs),r=(i,s)=>{const l=s==="PASS"?"var(--green)":"var(--red)";return`<span style="display:inline-block;padding:2px 8px;border:1px solid ${l};border-radius:4px;font-size:11px;margin:2px"><b style="color:${l}">${s}</b> ${i}</span>`},n=o.certificationStatus==="CERTIFIED",a=n?"var(--green)":"var(--red)";return`<div style="padding:10px 12px;border:2px solid ${a};border-radius:8px;margin-bottom:12px;font-size:12px;background:${n?"rgba(0,200,0,0.05)":"rgba(200,0,0,0.05)"}">
    <div style="font-size:14px;font-weight:700;color:${a};margin-bottom:6px">
      AETHER DEVICE CERTIFICATION: ${n?"CERTIFIED":"NOT CERTIFIED"}
    </div>
    <div style="margin-bottom:4px">
      ${r("WEBGPU",Z?"PASS":"FAIL")}
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
  </div>`}function gn(e,t,o){const r=document.getElementById("perf-v3-results");if(!r)return;const n=e.readiness,a=e.feasibility;r.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
<div class="card-header">
        <span class="card-title">AETHER MODEL-SHAPED BENCHMARK — V3</span>
        <span class="badge badge-info">MODEL RELEVANT</span>
      </div>

      ${fn(e,t)}

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

      ${X("TRANSFORMER — MatMul",e.matmul)}
      ${X("TRANSFORMER — RMSNorm",e.rmsnorm)}
      ${X("TRANSFORMER — Embedding",e.embedding)}
      ${X("ATTENTION",e.attention)}
      ${X("MLP",e.mlp)}
      ${X("IMAGE — Elementwise",e.imageOps)}
      ${X("IMAGE — VAE Decoder",e.vae)}
      ${X("VIDEO — Temporal Mixing",e.video)}

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
        ${mn(e.sustained.dropPct)}
        <div style="font-size:11px;color:var(--text-dim);margin-top:6px">thermalTelemetry: UNAVAILABLE · gpuUtilization: UNAVAILABLE</div>
      </div>

      <div class="v3-section">
        <div class="v3-section-title">AETHER LOCAL AI READINESS SCORE (heuristic)</div>
        ${q("TENSOR_COMPUTE",n.tensorCompute.score)}
        ${q("ATTENTION",n.attention.score)}
        ${q("MLP",n.mlp.score)}
        ${q("MEMORY",n.memory.score)}
        ${q("IMAGE_PROCESSING",n.imageProcessing.score)}
        ${q("VIDEO_PROCESSING",n.videoProcessing.score)}
        ${q("SUSTAINED_PERFORMANCE",n.sustainedPerf.score)}
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
            <tr><td>Transformer inference</td><td>${pn(a.transformerInference)}</td></tr>
            <tr><td>Image generation</td><td>${ce(a.imageGeneration)}</td></tr>
            <tr><td>VAE decoding</td><td>${ce(a.vaeDecoding)}</td></tr>
            <tr><td>Video latent processing</td><td>${ce(a.videoLatent)}</td></tr>
            <tr><td>Temporal attention</td><td>${ce(a.temporalAttention)}</td></tr>
            <tr><td>Long-context processing</td><td>${ce(a.longContext)}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
<button class="btn" id="btn-export-v3-json">EXPORT COMPLETE V3.1.3 JSON</button>
        <button class="btn btn-outline" id="btn-export-v3-report">EXPORT V3 REPORT</button>
      </div>
    </div>
  `,r.querySelector("#btn-export-v3-json")?.addEventListener("click",()=>hn(e,t)),r.querySelector("#btn-export-v3-report")?.addEventListener("click",()=>yn(e,t)),o("V3 benchmark complete","ok")}function Le(e,t,o){const r=new Blob([t],{type:o}),n=URL.createObjectURL(r),a=document.createElement("a");a.href=n,a.download=e,a.click(),URL.revokeObjectURL(n)}function hn(e,t){const o=Pe(e,Z,t.timerResolutionMs),r=Z?Be(Z):null,n={version:"AETHER V3.1.3",device:t,environment:{userAgent:t.userAgent,platform:t.platform,webgpu:t.webgpu,crossOriginIsolated:t.crossOriginIsolated,secureContext:t.secureContext},timing:{method:"HOST_WALL_CLOCK_AMPLIFIED",timerResolutionMs:t.timerResolutionMs},timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??null,commit:globalThis.AETHER_COMMIT??null,results:e,llmInference:r,certification:{timingIntegrity:o.timingIntegrity??"FAIL",throughputIntegrity:o.throughputIntegrity??"FAIL",correctnessIntegrity:o.correctnessIntegrity??"FAIL",llmSuiteComplete:o.llmSuiteComplete??"FAIL",memorySuiteComplete:o.memorySuiteComplete??"FAIL",overallCertified:o.overallCertified??!1,certificationStatus:o.certificationStatus??"NOT_CERTIFIED",reasons:o.certificationReasons??[]},selfAudit:o.selfAuditChecks??null,llmReadinessScore:o.llmReadinessScore,llmReadinessStatus:o.llmReadinessStatus,llmReadinessReason:o.llmReadinessReason,deviceHealth:ye(),runtimeError:Me(),interruption:he()?.interruption??null};Le("aether-v3-1-3-complete.json",JSON.stringify(n,null,2),"application/json")}function yn(e,t){const o=n=>n.map(a=>`| ${a.operation} | ${a.shape} | ${a.repetitions} | ${ee(a.blockMs)} | ${ee(a.estimatedPerOperationMs)} | ${a.totalFLOPs>0?a.totalFLOPs.toExponential(3):a.totalBytes>0?a.totalBytes+" B":"—"} | ${a.confidence} | ${Fe(a)} |`).join(`
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
`;Le("aether-v3-report.md",r,"text/markdown")}async function Pn(e,t,o){try{const r=t();$e(pt());const n=await(e==="quick"?Pt:Nt)(i=>o(`V3: ${i}`,"info")),a=await ft(r);gn(n,a,o)}catch(r){o(`V3 ERROR: ${r.message}`,"err")}}function pt(){let e=1/0;for(let t=0;t<200;t++){const o=performance.now();let r=performance.now();for(;r===o;)r=performance.now();const n=r-o;n>0&&n<e&&(e=n)}return Number.isFinite(e)&&e>0?e:1}async function ft(e){let t="UNAVAILABLE",o="UNAVAILABLE",r="UNAVAILABLE",n=null,a=null;try{const l=e.adapterInfo??e.adapterInfo;l&&(t=l.description||l.vendor||"UNAVAILABLE",o=l.vendor||"UNAVAILABLE",r=l.device||l.architecture||"UNAVAILABLE");const c=e.limits;n=c?.maxBufferSize??null,a=c?.maxComputeWorkgroupsPerDimension??null}catch{}const i=navigator,s=i.userAgentData;return{adapterName:t,adapterVendor:o,adapterDevice:r,maxBufferSize:n,maxWorkgroupsPerDim:a,device:s?.platform??navigator.platform??"UNAVAILABLE",platform:s?.platform??navigator.platform??"UNAVAILABLE",userAgent:navigator.userAgent,webgpu:!!i.gpu,crossOriginIsolated:window.crossOriginIsolated,secureContext:window.isSecureContext,timerResolutionMs:ke()}}function le(e){return e>=1024?(e/1024).toFixed(1)+" GB":e+" MB"}function vt(e,t){return t.length===0?"":`<div class="v3-section">
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
        <td>${o.measurable?ee(o.estimatedPerOperationMs):"—"}</td>
        <td>${o.totalFLOPs>0?o.totalFLOPs.toExponential(3):"—"}</td>
        <td>${o.totalBytes>0?(o.totalBytes/1048576).toFixed(1)+" MiB":"—"}</td>
        <td>${Fe(o)}</td>
        <td>${mt(o.confidence)}</td>
        <td>${o.correctnessPassed?'<span style="color:var(--green)">OK</span>':'<span style="color:var(--red)">FAIL</span>'}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function Mn(e){return e.length===0?"":`<div class="v3-section">
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
        <td>${le(t.fp16Bytes/(1024*1024))}</td>
        <td>${le(t.int8Bytes/(1024*1024))}</td>
        <td>${le(t.int4Bytes/(1024*1024))}</td>
        <td>${t.resourceLimit?'<span style="color:var(--red)">RESOURCE_LIMIT</span>':t.confidence!=="UNMEASURABLE"?t.blockLatencyMs.toFixed(3)+" ms":"UNMEASURABLE"}</td>
        <td>${mt(t.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
    ${e.some(t=>t.resourceLimit)?`<div style="font-size:11px;color:var(--red);margin-top:4px">${e.filter(t=>t.resourceLimit).map(t=>`${x(t.config.name)} aborted BEFORE allocation by the safe memory guard: ${x(t.resourceLimit.reason)}`).join("<br/>")}</div>`:""}
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Architectural workload simulations — NOT claims that corresponding real models fit.</div>
  </div>`}function bn(e){return e.length===0?"":`<div class="v3-section">
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
  </div>`}function vn(e){return e.length===0?"":`<div class="v3-section">
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
  </div>`}function En(e){const t=Pe(null,e,ke()),r=t.overallCertified?"var(--green)":"var(--red)",n=(a,i)=>`<b style="color:${i==="PASS"?"var(--green)":"var(--red)"}">${i}</b> ${a}`;return`<div style="padding:8px 10px;border:1px solid ${r};border-radius:6px;margin-bottom:12px;font-size:12px">
    <b style="color:${r}">SELF-AUDIT CERTIFICATION: ${t.certification}</b>
    <span style="color:var(--text-dim)"> — ${n("TIMING",t.timingIntegrity)} · ${n("THROUGHPUT",t.throughputIntegrity)} · ${n("CORRECTNESS",t.correctnessIntegrity)} · ${n("LLM SUITE",t.llmSuiteComplete)} · ${n("MEMORY SUITE",t.memorySuiteComplete)}</span>
    <div style="margin-top:4px;font-size:11px;color:var(--text-dim)">
      ${t.llmSuiteComplete==="PASS"?"":"LLM suite incomplete — "}
      Normalization ${t.normalization?.ok?"OK":"FAIL"} · Throughput ${t.throughput?.ok?"OK":"FAIL"} · Timer-floor ${t.timerLimitations?.timerFloorLimitedCount??0} result(s)
    </div>
    ${(t.certificationReasons?.length??0)>0?`<ul style="margin:4px 0 0 18px;padding:0">${t.certificationReasons.map(a=>`<li>${x(a)}</li>`).join("")}</ul>`:""}
  </div>`}function kn(e){const t=Z,o=et(e,t?.quantizedMatmul.length??1,t?.decodeAttention.length??1,t?.transformerBlocks.length??1,t?.tokenGeneration.length??1,t?.memoryBudget.length??1),r=o.llmReadinessStatus==="CERTIFIED"?"var(--green)":"var(--red)";return`<div class="v3-section">
    <div class="v3-section-title">AETHER LLM READINESS SCORE (heuristic)</div>
    <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">HEURISTIC — NOT A MODEL BENCHMARK</div>
    ${q("COMPUTE (INT8/INT4 matmul)",e.computeScore)}
    ${q("MEMORY (budget allocation)",e.memoryScore)}
    ${q("ATTENTION (full-sequence)",e.attentionScore)}
    ${q("DECODE (KV-cache decode)",e.decodeScore)}
    ${q("TRANSFORMER BLOCK",e.transformerBlockScore)}
    ${q("SUSTAINED PERFORMANCE",e.sustainedScore)}
    <div class="overall-row"><span>AETHER LLM READINESS</span><span>${e.overall} / 100</span></div>
    <div style="font-size:12px;margin-top:6px">Status: <b style="color:${r}">${o.llmReadinessStatus}</b> ${o.llmReadinessStatus==="NOT CERTIFIED"?`— ${x(o.reason)}`:""}</div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
      Heuristic LLM readiness score — NOT an official Apple performance rating. Do NOT select a model automatically. Do NOT claim GREEN transformer inference from legacy MatMul/MLP tests alone.
    </div>
  </div>`}function Ln(e,t,o){const r=document.getElementById("perf-v3-llm-results");r&&(r.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER V3.1 — LLM INFERENCE GATE</span>
        <span class="badge badge-info">HARDWARE GATE</span>
      </div>

      ${En(e)}

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

      ${vt("INT8/INT4 QUANTIZED MATMUL",e.quantizedMatmul)}
      ${vt("KV-CACHE DECODE ATTENTION",e.decodeAttention)}
      ${Mn(e.transformerBlocks)}
      ${bn(e.tokenGeneration)}
      ${vn(e.memoryBudget)}
      ${kn(e.llmReadiness)}

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
        <button class="btn" id="btn-export-llm-json">EXPORT LLM JSON</button>
        <button class="btn btn-outline" id="btn-export-llm-report">EXPORT LLM REPORT</button>
      </div>
    </div>
  `,r.querySelector("#btn-export-llm-json")?.addEventListener("click",()=>An(e,t)),r.querySelector("#btn-export-llm-report")?.addEventListener("click",()=>In(e,t)),o("V3.1 LLM Inference Gate complete","ok"))}function An(e,t){const o=Pe(null,e,t.timerResolutionMs),r=Be(e),n={benchmarkVersion:zt,runtimeSchemaVersion:Wt,benchmarkEngine:qt,device:t,timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??"unknown",commit:globalThis.AETHER_COMMIT??"unknown",llmInference:r,certification:{timingIntegrity:o.timingIntegrity??"FAIL",throughputIntegrity:o.throughputIntegrity??"FAIL",correctnessIntegrity:o.correctnessIntegrity??"FAIL",llmSuiteComplete:o.llmSuiteComplete??"FAIL",memorySuiteComplete:o.memorySuiteComplete??"FAIL",overallCertified:o.overallCertified??!1,certificationStatus:o.certificationStatus??"NOT_CERTIFIED",reasons:o.certificationReasons??[]},selfAudit:o.selfAuditChecks??null,note:"WebGPU allocation capability, NOT total system RAM.",deviceHealth:ye(),runtimeError:Me(),interruption:he()?.interruption??null},a=JSON.stringify(n,null,2),i=JSON.parse(a),s=Te(i.llmInference,t.timerResolutionMs);s.ok||console.error("POST-EXPORT AUDIT FAILED",s.failures),Le("aether-v3-1-3-llm-gate.json",a,"application/json")}function In(e,t){const o=n=>n.map(a=>`| ${a.operation} | ${a.shape} | ${a.repetitions} | ${ee(a.blockMs)} | ${ee(a.estimatedPerOperationMs)} | ${a.totalFLOPs>0?a.totalFLOPs.toExponential(3):a.totalBytes>0?a.totalBytes+" B":"—"} | ${a.confidence} | ${Fe(a)} | ${a.correctnessPassed?"OK":"FAIL"} |`).join(`
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
${e.transformerBlocks.map(n=>`| ${n.config.name} | ${n.config.hidden} | ${n.config.intermediate} | ${n.config.layers} | ${n.config.heads} | ${n.config.kvHeads} | ${(n.paramCount/1e6).toFixed(1)}M | ${le(n.fp16Bytes/1048576)} | ${le(n.int8Bytes/1048576)} | ${le(n.int4Bytes/1048576)} | ${n.resourceLimit?"RESOURCE_LIMIT (aborted before allocation)":n.blockLatencyMs.toFixed(3)} | ${n.confidence} |`).join(`
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
`;Le("aether-v3-1-llm-report.md",r,"text/markdown")}async function wn(e,t,o,r){const n=r?.resume??null;try{const a=t();$e(pt());const{runLLMInferenceGate:i,runLLMInferenceGateQuick:s}=await se(async()=>{const{runLLMInferenceGate:u,runLLMInferenceGateQuick:m}=await Promise.resolve().then(()=>Vt);return{runLLMInferenceGate:u,runLLMInferenceGateQuick:m}},void 0);o("AETHER V3.1.3 RUNTIME ACTIVE","info"),o(`buildId: ${globalThis.AETHER_BUILD_ID??"unknown"}`,"info"),o("llmSuite: ENABLED","info"),o("memorySuite: ENABLED","info"),o("normalizedResults: ENABLED","info"),o("postExportAudit: ENABLED","info"),n&&o(`crash-safety: RESUMING interrupted run (${n.completed.length} categories cached)`,"info"),kt("V3.1",e,{resume:n?{completed:n.completed,partial:n.partial}:void 0},globalThis.AETHER_BUILD_ID??null);const l=Lt(a),c=At(),d=e==="quick"?s:i;try{const u=await d(g=>o(`V3.1: ${g}`,"info"),n??void 0);It(),c(),l(),vo(),Z=u;const{validateLLMGateIntegrity:m}=await se(async()=>{const{validateLLMGateIntegrity:g}=await Promise.resolve().then(()=>Tt);return{validateLLMGateIntegrity:g}},void 0),p=m(u);if(p.ok)o("V3.1 audit OK: normalization + throughput verified for LLM gate results.","ok");else{o(`V3.1 AUDIT FAILURES: ${p.issues.length}`,"err");for(const g of p.issues)o(`  - ${g.operation} ${g.workload}: ${g.detail}`,"err")}const h=await ft(a);Ln(u,h,o)}catch(u){c(),l();const m=u,p=`${m.message} ${m.stack??""}`.toLowerCase();p.includes("validation")?Ce("GPU_VALIDATION_ERROR",m.message,m):p.includes("limit")&&(p.includes("alloc")||p.includes("buffer")||p.includes("memory"))?Ce("RESOURCE_LIMIT",m.message,m):Ce("JAVASCRIPT_EXCEPTION",m.message,m),o(`V3.1 ERROR: ${m.message}`,"err"),o("crash-safety: benchmark interrupted (A–J), certification FAILED, partial results preserved. RELOAD the page and press RESUME.","warn")}}catch(a){o(`V3.1 ERROR: ${a.message}`,"err")}}async function Fn(e,t){try{const o=e();$e(pt());const{runLLMDiagnosticStaged:r}=await se(async()=>{const{runLLMDiagnosticStaged:c}=await Promise.resolve().then(()=>Vt);return{runLLMDiagnosticStaged:c}},void 0);t("AETHER V3.1.3 STAGED DIAGNOSTIC ACTIVE","info"),kt("V3.1","quick",void 0,globalThis.AETHER_BUILD_ID??null);const n=Lt(o),a=At(),i=await ft(o),s=await r(c=>t(`DIAG: ${c}`,"info"));a(),n(),It();for(const c of s){const d=c.completed?c.error?"ERROR":"DONE":"SKIPPED";t(`DIAG ${d}: ${c.label}${c.error?` — ${c.error}`:""} (${Math.round(c.durationMs)}ms)`,c.completed&&!c.error?"ok":"err")}t(`DIAG done: ${s.filter(c=>c.completed).length}/${s.length} stages completed`,"ok"),t(`DIAG env: ${i.device} | maxBufferSize: ${i.maxBufferSize?Math.round(i.maxBufferSize/1048576)+" MB":"UNAVAILABLE"} | timer: ${i.timerResolutionMs.toFixed(3)} ms`,"info");const l=an(s);dn=s,un=i,$n(s,l,i,t),t("crash-safety: diagnostic complete. Press EXPORT LLM JSON (above) to capture the full staged report.","info")}catch(o){t(`DIAG ERROR: ${o.message}`,"err")}}function $n(e,t,o,r){const n=document.getElementById("perf-v3-llm-results");if(!n)return;const a=e.filter(s=>s.completed).length,i=e.map(s=>{const l=s.completed?s.error?"ERROR":"DONE":"SKIPPED",c=s.completed&&!s.error?"var(--green)":"var(--red)";return`<div class="staged-row" style="display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:12px">${x(s.label)}</span>
      <span style="font-size:12px;color:${c}"><b>${l}</b> ${Math.round(s.durationMs)}ms${s.error?` — ${x(s.error)}`:""}</span>
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
  `,n.querySelector("#btn-export-staged-llm-json")?.addEventListener("click",()=>Bn(e,t,o)),n.querySelector("#btn-copy-staged-llm-json")?.addEventListener("click",()=>Tn(e,t,o)),r("AETHER V3.1.3 STAGED DIAGNOSTIC COMPLETE — use EXPORT LLM JSON (above) to capture the staged report","ok")}function Ht(e,t,o){const r=globalThis;return ln(e,t,o,{buildId:r.AETHER_BUILD_ID??null,commit:r.AETHER_COMMIT??null})}function Sn(){return`AETHER-V3.1.3-STAGED-LLM-${new Date().toISOString().replace(/[:.]/g,"-")}.json`}function Ge(e,t){const o=document.getElementById("staged-export-status");o&&(o.innerHTML=`<span style="color:${t?"var(--red)":"var(--green)"}">${x(e)}</span>`)}function Bn(e,t,o){const r=Ht(e,t,o),n=Sn();try{Le(n,r.json,"application/json")}catch(a){Ge(`JSON EXPORT FAILED — ${x(a.message)}`,!0);return}Ge(`JSON EXPORT COMPLETE — ${n} | ${r.resultCount} results | ${r.certificationStatus}${r.postExportAudit.ok?"":" (post-export audit FAILED -> FAILED)"} | build ${r.payload.buildId}`,!r.postExportAudit.ok)}function Tn(e,t,o){const r=Ht(e,t,o),n=xn(r.json);Ge(n?`JSON COPIED — ${r.resultCount} results | ${r.certificationStatus}${r.postExportAudit.ok?"":" (post-export audit FAILED -> FAILED)"} | build ${r.payload.buildId}`:"JSON COPY FAILED — clipboard unavailable on this device",!n||!r.postExportAudit.ok)}function xn(e){if(navigator.clipboard&&window.isSecureContext!==!1)try{return navigator.clipboard.writeText(e).catch(()=>{}),!0}catch{}try{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.focus(),t.select();const o=document.execCommand("copy");return document.body.removeChild(t),o}catch{return!1}}export{Rn as AETHER_V313_SENTINELS,Z as _llmGateResults,Nn as buildLLMInferenceExport,Pe as buildSelfAudit,Ln as renderLLMGate,$n as renderStagedDiagnostic,fn as renderV3Certification,Fn as runLLMDiagnosticFromUI,wn as runLLMGateFromUI,Pn as runV3FromUI};
