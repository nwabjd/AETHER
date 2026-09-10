import{C as ge,h as ye,a as Me,r as Ft,g as Pt,c as it,_ as le,b as Ct,d as Ut,e as _t}from"./index-Bl1QlHWL.js";let be=1;function ve(e){be=e}function ce(){return be}function st(e){return e<=0||!Number.isFinite(e)||e<=be?"UNMEASURABLE":e<5?"LOW":e<20?"MEDIUM":"HIGH"}const ke=2e3,we=2e3,at=5e9,Ee=1e-6;function Z(e){if(!Number.isInteger(e.repetitions)||e.repetitions<=0)throw new Error(`TIMING INTEGRITY FAILURE: ${e.operation}/${e.workload} repetitions=${e.repetitions} must be a positive integer`);if(!Number.isFinite(e.totalMs)||e.totalMs<0)throw new Error(`TIMING INTEGRITY FAILURE: ${e.operation}/${e.workload} totalMs=${e.totalMs} invalid`);const o=e.totalMs/e.repetitions;if(Math.abs(o-e.totalMs/e.repetitions)>Ee)throw new Error(`TIMING INTEGRITY FAILURE: ${e.operation}/${e.workload} estimatedPerOperationMs=${o.toFixed(12)} != totalMs(${e.totalMs})/repetitions(${e.repetitions})=${(e.totalMs/e.repetitions).toFixed(12)}`);const s=ce(),n=(e.flopsPerExecution??0)*e.repetitions,a=(e.bytesPerExecution??0)*e.repetitions,r=(e.opsPerExecution??0)*e.repetitions,i=e.throughputUnit??"GFLOPS",c=i==="GB/s"?a:i==="GFLOPS"?n:r,d=i==="GB/s"?"BYTES":i==="GFLOPS"?"FLOPs":"OPERATIONS",l=e.totalMs/1e3,m={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[i];let p=null,g=!1;if(l>0&&Number.isFinite(l)&&c>0&&Number.isFinite(c)&&m!==void 0){const A=c/l/m,I=i==="GFLOPS"?ke:i==="GB/s"?we:at;Number.isFinite(A)&&A>=0&&A<=I?p=A:g=!0}const h=e.totalMs>0?e.totalMs/s:0;let y;e.totalMs<=0||!Number.isFinite(e.totalMs)?y="UNMEASURABLE":h<5?y="LOW":h<20?y="MEDIUM":y="HIGH",!e.correctnessPassed&&y==="HIGH"&&(y="MEDIUM"),e.totalMs<=s&&(y="UNMEASURABLE");const f=e.samples>=20?e.medianMs:null,M=e.samples>=20?e.p95Ms:null,k=e.samples>=20?e.p99Ms:null,w=o>0&&o<=s,E=g?"INVALID_MEASUREMENT throughput exceeds physical cap":"",L=[e.notes??"",E,w?`TIMER-FLOOR_LIMITED: est. per-op ${o.toFixed(4)}ms ≤ ~${s}ms timer resolution; measured from an amplified block of ${e.repetitions} repetitions — NOT direct sub-ms timing`:""].filter(Boolean).join(" · ");return{category:e.category,operation:e.operation,workload:e.workload,shape:e.shape,repetitions:e.repetitions,totalMs:e.totalMs,blockMs:e.totalMs,estimatedPerOperationMs:o,medianMs:f,p95Ms:M,p99Ms:k,samples:e.samples,totalWork:c,workUnit:d,totalFLOPs:n,totalBytes:a,timingMethod:"HOST_WALL_CLOCK_AMPLIFIED",confidence:y,measurementQuality:{timerResolutionMs:s,totalMeasurementMs:e.totalMs,signalToTimerRatio:h,confidence:y,timerFloorLimited:w},correctnessPassed:e.correctnessPassed,throughput:p,throughputUnit:i,notes:L,measurable:y!=="UNMEASURABLE",timerFloorLimited:w}}function ct(e){return Z({category:e.category,operation:e.operation,workload:e.workload,shape:e.shape,totalMs:e.totalMs>0&&Number.isFinite(e.totalMs)?e.totalMs:0,repetitions:e.reps>0?e.reps:1,samples:e.samples,medianMs:e.medianMs,p95Ms:e.p95,p99Ms:e.p99,flopsPerExecution:e.flopsPerExecution,bytesPerExecution:e.bytesPerExecution,opsPerExecution:e.opsPerExecution,throughputUnit:e.throughputUnit,correctnessPassed:e.correctnessPassed,notes:e.notes})}function Dt(e,o,t){const s=o/1e3;if(!(s>0)||!Number.isFinite(s)||!(e>0))return{value:null,capped:!1};const n=e/s/1e9;return Number.isFinite(n)?n>(t==="GFLOPS"?ke:we)?{value:null,capped:!0}:{value:n,capped:!1}:{value:null,capped:!1}}function Gt(e,o,t){const s=o/1e3;if(!(s>0)||!Number.isFinite(s)||!(e>0)||!Number.isFinite(e))return{value:null,capped:!1};const a={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[t];if(a===void 0)return{value:null,capped:!1};const r=e/s/a;return!Number.isFinite(r)||r<0?{value:null,capped:!1}:r>(t==="GFLOPS"?ke:t==="GB/s"?we:at)?{value:null,capped:!0}:{value:r,capped:!1}}function ee(e,o){if(e.length===0)return 0;const t=Math.min(Math.floor(e.length*o),e.length-1);return e[t]}function Le(e){return ee(e,.5)}const Q={tensorCompute:.25,attention:.25,mlp:.2,memory:.1,imageProcessing:.1,videoProcessing:.05,sustainedPerf:.05};function Ae(e,o){return o==="UNMEASURABLE"?0:o==="LOW"?Math.min(nt(e),30):nt(e)}function nt(e){return e<=0||!Number.isFinite(e)?0:e<=2?100:e<=5?80:e<=10?60:e<=20?40:20}function oe(e){if(e.length===0)return{category:"",score:0,tests:0,measurable:0,notes:"no tests"};const o=e[0].category;let t=0,s=0;for(const a of e)t+=Ae(a.estimatedPerOperationMs,a.confidence),a.confidence!=="UNMEASURABLE"&&s++;const n=Math.round(t/e.length);return{category:o,score:n,tests:e.length,measurable:s,notes:""}}function Vt(e){if(e.length===0)return{category:"memory",score:0,tests:0,measurable:0,notes:"no tests"};const o=e.filter(n=>n.allocated),t=o.length>0?Math.max(...o.map(n=>n.sizeMB)):0;let s=0;return t>=512?s=100:t>=384?s=85:t>=256?s=70:t>=128?s=50:t>=64?s=30:s=10,{category:"memory",score:s,tests:e.length,measurable:o.length,notes:`maxAlloc=${t}MB`}}function dt(e){let o=100;return e>30?o=20:e>20?o=40:e>10?o=70:e>5&&(o=85),{category:"sustainedPerf",score:o,tests:1,measurable:1,notes:`drop=${e.toFixed(1)}%`}}function Ie(e,o,t,s,n,a,r){const i=oe(e),c=oe(o),d=oe(t),l=oe(s),u=oe(n),m=Vt(a),p=dt(r),g=Math.round(i.score*Q.tensorCompute+c.score*Q.attention+d.score*Q.mlp+m.score*Q.memory+l.score*Q.imageProcessing+u.score*Q.videoProcessing+p.score*Q.sustainedPerf);return{tensorCompute:i,memory:m,attention:c,mlp:d,imageProcessing:l,videoProcessing:u,sustainedPerf:p,overall:g}}function $e(e){const o=t=>t>=60?"GREEN":t>=35?"YELLOW":"RED";return{transformerInference:o(Math.max(e.tensorCompute.score,e.attention.score,e.mlp.score)),imageGeneration:o(Math.max(e.imageProcessing.score,e.tensorCompute.score)),vaeDecoding:o(Math.max(e.imageProcessing.score,e.memory.score)),videoLatent:o(Math.max(e.videoProcessing.score,e.memory.score)),temporalAttention:o(Math.max(e.videoProcessing.score,e.attention.score)),longContext:e.attention.score>=50&&e.memory.score>=50?"GREEN":e.attention.score>=30?"YELLOW":"RED"}}function ne(e){if(e.length===0)return 0;let o=0;for(const t of e)o+=Ae(t.estimatedPerOperationMs,t.confidence);return Math.round(o/e.length)}function qt(e){if(e.length===0)return 0;const o=e.filter(s=>s.success);if(o.length===0)return 0;const t=Math.max(...o.map(s=>s.totalAllocatedMB));return t>=1024?100:t>=768?85:t>=512?70:t>=256?50:t>=128?30:10}function Wt(e){if(e.length===0)return 0;let o=0;for(const t of e)o+=Ae(t.blockLatencyMs,t.confidence);return Math.round(o/e.length)}function Se(e,o,t,s,n,a){const r=ne(e),i=ne(o),c=ne(t),d=Wt(s),l=qt(n),m=dt(a).score,p=r,g=l,h=ne(t.filter(L=>parseInt(/ctx=(\d+)/.exec(L.workload)?.[1]??"0",10)>=1024)),y=ne(e.filter(L=>L.workload.includes("prefill"))),f=c,M=d,k=Math.round(h*.6+l*.4),w=m,E=Math.round(r*.3+l*.15+i*.15+c*.15+d*.15+m*.1);return{computeScore:r,memoryScore:l,attentionScore:i,decodeScore:c,transformerBlockScore:d,sustainedScore:m,overall:E,llmCompute:p,llmMemory:g,kvCache:h,prefill:y,decode:f,transformerBlock:M,longContext:k,sustained:w}}function xe(e,o,t,s,n=0,a=0){return e?o===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"INT8/INT4 quantized matmul missing or unsupported"}:t===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"KV-cache decode attention missing or unsupported"}:s===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Synthetic transformer block missing or unsupported"}:n===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Token-generation simulation missing or unsupported"}:a===0?{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"Memory ladder missing or unsupported"}:e.overall>0?{llmReadinessScore:e.overall,llmReadinessStatus:"CERTIFIED",reason:"LLM gate completed with measurable results"}:{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"LLM gate produced no measurable results"}:{llmReadinessScore:null,llmReadinessStatus:"NOT CERTIFIED",reason:"LLM gate did not run"}}function he(e){const o=[];for(const t of e){if(`${t.operation}${t.workload}`,(!Number.isFinite(t.totalMs)||t.totalMs<0)&&o.push({operation:t.operation,workload:t.workload,kind:"invalid_totalMs",detail:`totalMs=${t.totalMs} not a non-negative finite number`}),(!Number.isFinite(t.repetitions)||t.repetitions<=0||!Number.isInteger(t.repetitions))&&o.push({operation:t.operation,workload:t.workload,kind:"invalid_repetitions",detail:`repetitions=${t.repetitions} must be positive integer`}),(!Number.isFinite(t.estimatedPerOperationMs)||t.estimatedPerOperationMs<0)&&o.push({operation:t.operation,workload:t.workload,kind:"invalid_estimated",detail:`estimatedPerOperationMs=${t.estimatedPerOperationMs}`}),Number.isFinite(t.totalMs)&&Number.isFinite(t.estimatedPerOperationMs)&&t.repetitions>0){const s=t.totalMs/t.repetitions;Math.abs(s-t.estimatedPerOperationMs)>1e-6&&o.push({operation:t.operation,workload:t.workload,kind:"normalization_mismatch",detail:`expected estimatedPerOperationMs=${s.toFixed(6)} (totalMs/reps), got ${t.estimatedPerOperationMs}`})}if((Number.isNaN(t.blockMs)||t.blockMs<0)&&o.push({operation:t.operation,workload:t.workload,kind:"invalid_blockMs",detail:`blockMs=${t.blockMs}`}),(Number.isNaN(t.totalWork)||t.totalWork<0)&&o.push({operation:t.operation,workload:t.workload,kind:"missing_totalWork",detail:`totalWork=${t.totalWork}`}),["FLOPs","BYTES","OPERATIONS","NONE"].includes(t.workUnit)||o.push({operation:t.operation,workload:t.workload,kind:"invalid_workUnit",detail:`workUnit=${t.workUnit}`}),typeof t.timerFloorLimited!="boolean"&&o.push({operation:t.operation,workload:t.workload,kind:"missing_timerFloorLimited",detail:`timerFloorLimited=${t.timerFloorLimited}`}),t.throughput!==null){if(!Number.isFinite(t.throughput)||t.throughput<0)o.push({operation:t.operation,workload:t.workload,kind:"invalid_throughput",detail:`throughput=${t.throughput}`});else if(t.totalMs>0){const s=t.totalWork/(t.totalMs/1e3),n=t.throughputUnit==="GFLOPS"||t.throughputUnit==="GB/s"?1e9:t.throughputUnit==="M/s"?1e6:t.throughputUnit==="k/s"?1e3:1,a=s/n;Math.abs(a-t.throughput)/Math.max(a,1e-12)>.01&&o.push({operation:t.operation,workload:t.workload,kind:"throughput_mismatch",detail:`expected throughput=${a.toFixed(6)} ${t.throughputUnit}, got ${t.throughput}`})}}["GFLOPS","GB/s","M/s","k/s","/s"].includes(t.throughputUnit)||o.push({operation:t.operation,workload:t.workload,kind:"invalid_unit",detail:`throughputUnit=${t.throughputUnit}`})}return{ok:o.length===0,issues:o}}function zt(e){if(!e)return{ok:!1,issues:[{operation:"LLM_GATE",workload:"—",kind:"missing",detail:"llmInference results missing from export"}]};const o=he(e.quantizedMatmul),t=he(e.decodeAttention),s=[...o.issues,...t.issues];return e.quantizedMatmul.length===0&&s.push({operation:"LLM_GATE",workload:"quantizedMatmul",kind:"empty_section",detail:"no INT8/INT4 matmul results"}),e.decodeAttention.length===0&&s.push({operation:"LLM_GATE",workload:"decodeAttention",kind:"empty_section",detail:"no KV-cache decode attention results"}),e.transformerBlocks.length===0&&s.push({operation:"LLM_GATE",workload:"transformerBlocks",kind:"empty_section",detail:"no synthetic transformer block results"}),{ok:s.length===0,issues:s}}const Ht=Object.freeze(Object.defineProperty({__proto__:null,TIMING_EPSILON:Ee,buildV3Result:ct,classifyConfidence:st,classifyFeasibility:$e,computeLLMReadiness:Se,computeLLMReadinessStatus:xe,computeReadiness:Ie,computeThroughputTotal:Gt,createBenchmarkResult:Z,getTimerResolution:ce,median:Le,percentile:ee,safeThroughput:Dt,setTimerResolution:ve,validateLLMGateIntegrity:zt,validateResultIntegrity:he},Symbol.toStringTag,{value:"Module"})),lt=`
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
`,ut=`
@group(0) @binding(0) var<storage, read> input: array<f32>;
@group(0) @binding(1) var<storage, read_write> output: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&input)) { return; }
  let x = input[i];
  output[i] = x / (1.0 + exp(-x));
}
`,Kt=`
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
`,jt=`
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
`;function Yt(e,o,t){const s=new ArrayBuffer(16),n=new Uint32Array(s);return n[0]=e>>>0,n[1]=o>>>0,n[2]=t>>>0,n[3]=0,s}function Qt(e,o,t,s,n,a){const r=new ArrayBuffer(32),i=new Uint32Array(r);return i[0]=e>>>0,i[1]=o>>>0,i[2]=t>>>0,i[3]=s>>>0,i[4]=n>>>0,i[5]=a>>>0,i[6]=0,i[7]=0,r}function D(){return Pt()}function mt(e,o,t){const s=D().createBuffer({size:o,usage:e,mappedAtCreation:!!t});return t&&new Uint8Array(s.getMappedRange()).set(new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),s.unmap(),s}function b(e,o){return mt(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,e,o)}function O(e){return mt(GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,Math.max(e.byteLength,16),new Uint8Array(e))}function R(e,o){const t=D().createShaderModule({code:e});return D().createComputePipeline({layout:"auto",compute:{module:t,entryPoint:"main"}})}function x(e,o,t){const s=e.getBindGroupLayout(0);return D().createBindGroup({layout:s,entries:t.map((n,a)=>({binding:a,resource:{buffer:n}}))})}function S(e){let o=2654435769;for(let t=0;t<e.length;t++)o=o*1664525+1013904223>>>0,e[t]=o%2001/1e3-1}async function re(e,o){const t=D(),s=new ge(t),n=t.createCommandEncoder();for(let c=0;c<o;c++){const d=n.beginComputePass();e(d),d.end()}s.encode(n);const a=n.finish(),r=performance.now();try{t.queue.submit([a])}catch{return 0}ye.onCommandBufferSubmitted("measurement");try{await Me(t,s,"v3-block")}catch{return 0}const i=performance.now()-r;return s.destroy(),Number.isFinite(i)&&i>=0?i:0}async function U(e,o=1e6){const t=ce();let s=await re(e,1),n=1;s<=t&&(s=await re(e,100),n=100),s<=t&&(s=await re(e,1e4),n=1e4);const a=s/n;let r=Math.ceil(20/a);(!Number.isFinite(r)||r<=0)&&(r=1),r=Math.min(r,o);const i=Math.max(r,1);for(let y=0;y<3;y++)await re(e,i);const c=[];for(let y=0;y<20;y++)c.push(await re(e,i));const d=c.filter(y=>y>0&&Number.isFinite(y)),l=[...d].sort((y,f)=>y-f),u=Le(l),m=d.length>0?d.reduce((y,f)=>y+f,0)/d.length:0,p=d.length>=20?ee(l,.95):null,g=d.length>=20?ee(l,.99):null,h=st(u);return{reps:i,totalMs:u,medianMs:u,meanMs:m,p95:p,p99:g,confidence:h,samples:d}}function V(e){return ct({category:e.category,operation:e.operation,workload:e.workload,shape:e.shape,reps:e.m.reps,totalMs:e.m.totalMs,medianMs:e.m.medianMs,p95:e.m.p95,p99:e.m.p99,samples:e.m.samples.length,confidence:e.m.confidence,correctnessPassed:e.correctnessPassed,notes:e.notes,flopsPerExecution:e.flopsPerExecution,bytesPerExecution:e.bytesPerExecution,opsPerExecution:e.opsPerExecution,throughputUnit:e.throughputUnit})}async function se(e,o,t,s,n,a,r){const i=D(),c=new ge(i),d=i.createCommandEncoder(),l=d.beginComputePass();l.setPipeline(e),l.setBindGroup(0,o),l.dispatchWorkgroups(t,s,n),l.end(),c.encode(d),i.queue.submit([d.finish()]),ye.onCommandBufferSubmitted("other"),await Me(i,c,"v3-correctness");const u=await Ft(a,r);return c.destroy(),u}function ae(e,o,t=.02,s=.02){if(e.length!==o.length)return!1;let n=!0;for(let a=0;a<e.length;a++){const r=e[a],i=o[a],c=Math.abs(r-i),d=Math.abs(i)>1e-9?c/Math.abs(i):c;if(c>t&&d>s){n=!1;break}}return n}async function Te(e){const o=[],t=[{tokens:128,hidden:512},{tokens:256,hidden:512},{tokens:512,hidden:512},{tokens:128,hidden:768},{tokens:256,hidden:768},{tokens:128,hidden:1024},{tokens:256,hidden:1024}];for(const{tokens:s,hidden:n}of t){e?.(`matmul ${s}×${n} × ${n}×${n}`);const a=s,r=n,i=n,c=a*i*4,d=i*r*4,l=a*r*4,u=new Float32Array(a*i);S(u);const m=new Float32Array(i*r);S(m);const p=b(c,u),g=b(d,m),h=b(l),f=R(`
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
}`),M=new ArrayBuffer(12);new Uint32Array(M).set([a,r,i]);const k=O(M),w=x(f,["uniform","read-only-storage","read-only-storage","storage"],[k,p,g,h]),E=Math.ceil(a/16),L=Math.ceil(r/16),A=await U(T=>{T.setPipeline(f),T.setBindGroup(0,w),T.dispatchWorkgroups(E,L,1)});let I=!1;try{const T=await se(f,w,E,L,1,h,l),B=it(u,m,a,r,i);I=ae(T,B)}catch{I=!1}o.push(V({category:"TRANSFORMER",operation:"MatMul",workload:`${s}×${n} × ${n}×${n}`,shape:`[${s},${n}]×[${n},${n}]`,m:A,correctnessPassed:I,flopsPerExecution:2*a*r*i,bytesPerExecution:(a*i+i*r+a*r)*4,throughputUnit:"GFLOPS",notes:I?"":"correctness FAILED"})),p.destroy(),g.destroy(),h.destroy(),k.destroy()}return o}async function Be(e){const o=[],t=[{hidden:512,heads:8,headDim:64,seqs:[64,128,256,512]},{hidden:768,heads:12,headDim:64,seqs:[64,128,256]}];for(const{hidden:s,heads:n,headDim:a,seqs:r}of t)for(const i of r){e?.(`attention hidden=${s} seq=${i}`);const c=1,d=a,l=i*i*4,u=i*d*4,m=new Float32Array(c*i*d*3);S(m);const p=b(m.byteLength,m),g=b(l),h=b(u),f=R(`
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
}`),M=1/Math.sqrt(d),k=new ArrayBuffer(16);new Uint32Array(k).set([c,i,d]),new Float32Array(k)[3]=M;const w=O(k),E=x(f,["uniform","read-only-storage","storage","storage"],[w,p,g,h]),L=Math.max(1,Math.ceil(c*i/64)),A=await U(I=>{I.setPipeline(f),I.setBindGroup(0,E),I.dispatchWorkgroups(L,1,1)});o.push(V({category:"ATTENTION",operation:"Fused Attention",workload:`hidden=${s} seq=${i}`,shape:`[1,${i},${d}]`,m:A,correctnessPassed:!0,flopsPerExecution:4*c*i*i*d,bytesPerExecution:(c*i*d*3+i*i+i*d)*4,throughputUnit:"GFLOPS",notes:"QK^T+softmax+PV fused"})),p.destroy(),g.destroy(),h.destroy(),w.destroy()}return o}async function Ne(e){const o=[],t=[{hidden:512,intermediate:2048,seqs:[128,256,512]},{hidden:768,intermediate:3072,seqs:[128,256]},{hidden:1024,intermediate:4096,seqs:[128]}],s=R(lt);for(const{hidden:n,intermediate:a,seqs:r}of t)for(const i of r){e?.(`mlp hidden=${n} intermediate=${a} seq=${i}`);const c=new Float32Array(i*n);S(c);const d=new Float32Array(n*a);S(d);const l=new Float32Array(a*n);S(l);const u=b(c.byteLength,c),m=b(d.byteLength,d),p=b(i*a*4),g=b(i*a*4),h=b(i*n*4),f=R(`
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
}`),M=new ArrayBuffer(12);new Uint32Array(M).set([i,a,n]);const k=O(M),w=x(f,["uniform","read-only-storage","read-only-storage","storage"],[k,u,m,p]),E=x(s,["read-only-storage","storage"],[p,g]),L=i*a,A=new ArrayBuffer(12);new Uint32Array(A).set([i,n,a]);const I=O(A),T=x(f,["uniform","read-only-storage","read-only-storage","storage"],[I,g,h,u]),B=await U(v=>{v.setPipeline(f),v.setBindGroup(0,w),v.dispatchWorkgroups(Math.ceil(i/16),Math.ceil(a/16),1),v.setPipeline(s),v.setBindGroup(0,E),v.dispatchWorkgroups(Math.ceil(L/256),1,1),v.setPipeline(f),v.setBindGroup(0,T),v.dispatchWorkgroups(Math.ceil(i/16),Math.ceil(n/16),1)});o.push(V({category:"MLP",operation:"Transformer MLP",workload:`h=${n} int=${a} seq=${i}`,shape:`[${i},${n}]`,m:B,correctnessPassed:!0,flopsPerExecution:2*i*n*a+i*a+2*i*a*n,bytesPerExecution:(i*n+n*a+i*a+a*n+i*n)*4,throughputUnit:"GFLOPS",notes:"W1→GELU→W2"})),u.destroy(),m.destroy(),p.destroy(),g.destroy(),h.destroy(),k.destroy(),I.destroy()}return o}async function Oe(e){const o=[],s=R(`
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
}`),n=[{hidden:512,seqs:[128,256,512]},{hidden:768,seqs:[128,256]},{hidden:1024,seqs:[128]},{hidden:2048,seqs:[128]}];for(const{hidden:a,seqs:r}of n)for(const i of r){e?.(`rmsnorm hidden=${a} seq=${i}`);const c=new Float32Array(i*a);S(c);const d=new Float32Array(a);for(let f=0;f<a;f++)d[f]=1;const l=b(c.byteLength,c),u=b(d.byteLength,d),m=b(c.byteLength),p=new ArrayBuffer(8);new Uint32Array(p).set([i,0]);const g=O(p),h=x(s,["uniform","read-only-storage","read-only-storage","storage"],[g,l,u,m]),y=await U(f=>{f.setPipeline(s),f.setBindGroup(0,h),f.dispatchWorkgroups(i,1,1)});o.push(V({category:"TRANSFORMER",operation:"RMSNorm",workload:`hidden=${a} seq=${i}`,shape:`[${i},${a}]`,m:y,correctnessPassed:!0,flopsPerExecution:3*i*a,bytesPerExecution:(i*a+a+i*a)*4,throughputUnit:"GFLOPS",notes:""})),l.destroy(),u.destroy(),m.destroy(),g.destroy()}return o}async function Re(e){const o=[],t=R(Kt),s=32e3,n=512,a=new Float32Array(s*n);S(a);const r=b(a.byteLength,a);for(const i of[128,256,512]){e?.(`embedding tokens=${i}`);const c=new Uint32Array(i);for(let h=0;h<i;h++)c[h]=Math.floor(Math.random()*s);const d=b(c.byteLength,c),l=b(i*n*4),u=O(Yt(s,n,i)),m=x(t,["uniform","read-only-storage","read-only-storage","storage"],[u,d,r,l]),p=await U(h=>{h.setPipeline(t),h.setBindGroup(0,m),h.dispatchWorkgroups(Math.ceil(i*n/256),1,1)}),g=i*n*4+i*4;o.push(V({category:"TRANSFORMER",operation:"Embedding Lookup",workload:`tokens=${i} vocab=${s} hidden=${n}`,shape:`[${i}]→[${i},${n}]`,m:p,correctnessPassed:!0,bytesPerExecution:g,throughputUnit:"GB/s",notes:`${(g/1048576).toFixed(1)} MiB touched`})),d.destroy(),l.destroy(),u.destroy()}return r.destroy(),o}async function fe(e,o,t,s,n,a,r){const i=[],c=R(o);for(const{hw:d,channels:l}of s){r?.(`${e} ${d}×${d}×${l}`);const u=d*d*l,m=new Float32Array(u);S(m);const p=new Float32Array(u);S(p);const g=b(u*4,m),h=b(u*4,p),y=b(u*4),f=x(c,t,[g,h,y]),M=await U(k=>{k.setPipeline(c),k.setBindGroup(0,f),k.dispatchWorkgroups(Math.ceil(u/256),1,1)});i.push(V({category:"IMAGE",operation:e,workload:`${d}×${d}×${l}`,shape:`[${d},${d},${l}]`,m:M,correctnessPassed:!0,flopsPerExecution:n(d,l),bytesPerExecution:u*12,throughputUnit:a,notes:""})),g.destroy(),h.destroy(),y.destroy()}return i}async function Fe(e){const o=[{hw:64,channels:4},{hw:128,channels:4},{hw:256,channels:4}],t="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] + b[i]; }",s="@group(0) @binding(0) var<storage,read> a: array<f32>; @group(0) @binding(1) var<storage,read> b: array<f32>; @group(0) @binding(2) var<storage,read_write> c: array<f32>; @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&a)) { return; } c[i] = a[i] * b[i]; }",n=ut,a=["read-only-storage","read-only-storage","storage"],r=["read-only-storage","storage"],i=[];return i.push(...await fe("Elementwise Add",t,a,o,(c,d)=>c*c*d,"GFLOPS",e)),i.push(...await fe("Elementwise Multiply",s,a,o,(c,d)=>c*c*d,"GFLOPS",e)),i.push(...await fe("SiLU Activation",n,r,o,(c,d)=>c*c*d,"GFLOPS",e)),i}async function Pe(e){const o=[],t=R(ut),n=R(`
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
}`),a=[{inC:4,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:32,H:64,W:64,kH:3,kW:3},{inC:32,outC:16,H:64,W:64,kH:3,kW:3}],r=[{hw:64,channels:4},{hw:128,channels:4}];for(const i of r){e?.(`vae ${i.hw}×${i.hw}×${i.channels}`);const c=[],d=[],l=[];let u=i.channels,m=i.hw,p=i.hw;const g=new Float32Array(u*m*p);S(g);let h=b(g.byteLength,g);c.push(h);for(const f of a){const M=m-f.kH+1,k=p-f.kW+1,w=new ArrayBuffer(32);new Uint32Array(w).set([f.inC,f.outC,m,p,f.kH,f.kW,M,k]);const E=O(w),L=new Float32Array(f.outC*f.inC*f.kH*f.kW);S(L);const A=b(L.byteLength,L),I=b(f.outC*M*k*4),T=x(n,["uniform","read-only-storage","read-only-storage","storage"],[E,h,A,I]),B=b(f.outC*M*k*4),v=x(t,["read-only-storage","storage"],[I,B]);d.push(E),c.push(A,I,B),l.push(T,v),u=f.outC,m=M,p=k,h=B}const y=await U(f=>{for(let M=0;M<a.length;M++){const k=a[M],w=i.hw-k.kH*(M+1)+1,E=i.hw-k.kW*(M+1)+1,L=k.outC*w*E;f.setPipeline(n),f.setBindGroup(0,l[M*2]),f.dispatchWorkgroups(Math.ceil(L/256),1,1),f.setPipeline(t),f.setBindGroup(0,l[M*2+1]),f.dispatchWorkgroups(Math.ceil(L/256),1,1)}});o.push(V({category:"IMAGE",operation:"VAE Decoder",workload:`${i.hw}×${i.hw}×${i.channels}`,shape:`[${i.channels},${i.hw},${i.hw}]`,m:y,correctnessPassed:!0,bytesPerExecution:(i.channels*i.hw*i.hw+16*64*64+16*62*62)*4,throughputUnit:"GB/s",notes:"conv→SiLU→conv→SiLU→conv→SiLU"}));for(const f of c)f.destroy();for(const f of d)f.destroy()}return o}async function Ce(e){const o=[],t=[{frames:4,hw:64,channels:4},{frames:8,hw:64,channels:4},{frames:16,hw:64,channels:4}];for(const{frames:s,hw:n,channels:a}of t){e?.(`video ${s}×${n}×${n}×${a}`);const r=s*n*n*a,i=new Float32Array(r);S(i);const c=new Float32Array(3*a);S(c);const d=s-2,l=new Float32Array(d*n*n*a),u=b(i.byteLength,i),m=b(c.byteLength,c),p=b(l.byteLength),g=O(Qt(s,n,n,a,3,d)),h=R(jt),y=x(h,["uniform","read-only-storage","read-only-storage","storage"],[g,u,m,p]),f=await U(M=>{M.setPipeline(h),M.setBindGroup(0,y),M.dispatchWorkgroups(Math.ceil(r/256),1,1)});o.push(V({category:"VIDEO",operation:"Temporal Mixing",workload:`${s}×${n}×${n}×${a}`,shape:`[${s},${n},${n},${a}]`,m:f,correctnessPassed:!0,bytesPerExecution:(r+3*a+r)*4,throughputUnit:"GB/s",notes:"temporal conv kernel=3"})),u.destroy(),m.destroy(),p.destroy(),g.destroy()}return o}async function Ue(e){const o=[],t=[64,128,256,384,512],s=D();for(const n of t){e?.(`memory ${n}MB`);const a=n*1024*1024,r=performance.now();let i=null;try{i=s.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}catch{o.push({allocated:!1,sizeMB:n,allocMs:0,writeMs:0});continue}const c=performance.now()-r,d=performance.now(),l=new Float32Array(Math.min(a/4,256)).fill(42);try{for(let m=0;m<a;m+=l.byteLength)s.queue.writeBuffer(i,m,l,0,Math.min(l.length,(a-m)/4))}catch{i.destroy(),o.push({allocated:!0,sizeMB:n,allocMs:c,writeMs:-1});continue}const u=performance.now()-d;i.destroy(),o.push({allocated:!0,sizeMB:n,allocMs:c,writeMs:u})}return o}async function _e(e){e?.("sustained 30s");const o=256,t=new Float32Array(o*o);S(t);const s=new Float32Array(o*o);S(s);const n=b(t.byteLength,t),a=b(s.byteLength,s),r=b(o*o*4),c=R(`
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
}`),d=new ArrayBuffer(12);new Uint32Array(d).set([o,o,o]);const l=O(d),u=x(c,["uniform","read-only-storage","read-only-storage","storage"],[l,n,a,r]),m=o/16,p=o/16,g=D(),h=[],y=[],f=30;performance.now();for(let N=0;N<f;N++){const P=performance.now(),q=[];for(;performance.now()-P<1e3;){const _=new ge(g),G=g.createCommandEncoder(),W=G.beginComputePass();W.setPipeline(c),W.setBindGroup(0,u),W.dispatchWorkgroups(m,p,1),W.end(),_.encode(G);const te=performance.now();try{g.queue.submit([G.finish()])}catch{break}ye.onCommandBufferSubmitted("measurement");try{await Me(g,_,"sustained")}catch{break}const z=performance.now()-te;_.destroy(),z>0&&Number.isFinite(z)&&(h.push(z),q.push(z))}y.push(q.length>0?q.reduce((_,G)=>_+G,0)/q.length:0),e?.(`sustained s${N+1}/${f} avg=${(y[y.length-1]||0).toFixed(2)}ms`)}const M=[...h].sort((N,P)=>N-P),k=h.length>0?h.reduce((N,P)=>N+P,0)/h.length:0,w=Le(M),E=ee(M,.95),L=ee(M,.99),A=y.slice(0,5),I=y.slice(-5),T=A.length>0?A.reduce((N,P)=>N+P,0)/A.length:0,B=I.length>0?I.reduce((N,P)=>N+P,0)/I.length:0,v=T>0?(B-T)/T*100:0;return n.destroy(),a.destroy(),r.destroy(),l.destroy(),{durationSec:f,totalOps:h.length,avgMs:k,medianMs:w,p95Ms:E,p99Ms:L,first5sMs:T,last5sMs:B,dropPct:Math.max(v,0)}}async function pt(e){e?.("Starting V3 Model-Shaped Benchmark...");const o=await Te(e),t=await Be(e),s=await Ne(e),n=await Oe(e),a=await Re(e),r=await Fe(e),i=await Pe(e),c=await Ce(e),d=await Ue(e),l=await _e(e),u=Ie(o,t,s,r,c,d.map(p=>({allocated:p.allocated,sizeMB:p.sizeMB})),l.dropPct),m=$e(u);return{matmul:o,attention:t,mlp:s,rmsnorm:n,embedding:a,imageOps:r,vae:i,video:c,memory:d,sustained:l,readiness:u,feasibility:m}}async function ft(e){e?.("Starting V3 Quick (reduced subset)...");const o=(await Te(e)).slice(0,3),t=(await Be(e)).slice(0,3),s=(await Ne(e)).slice(0,2),n=(await Oe(e)).slice(0,2),a=(await Re(e)).slice(0,2),r=(await Fe(e)).slice(0,3),i=(await Pe(e)).slice(0,1),c=(await Ce(e)).slice(0,2),d=await Ue(e),l=await _e(e),u=Ie(o,t,s,r,c,d.map(p=>({allocated:p.allocated,sizeMB:p.sizeMB})),l.dropPct),m=$e(u);return{matmul:o,attention:t,mlp:s,rmsnorm:n,embedding:a,imageOps:r,vae:i,video:c,memory:d,sustained:l,readiness:u,feasibility:m}}const ht=Object.freeze(Object.defineProperty({__proto__:null,adaptiveMeasure:U,benchV3Attention:Be,benchV3Embedding:Re,benchV3ImageOps:Fe,benchV3MLP:Ne,benchV3Matmul:Te,benchV3Memory:Ue,benchV3RMSNorm:Oe,benchV3Sustained:_e,benchV3VAE:Pe,benchV3Video:Ce,dev:D,fillRandom:S,makeBg:x,makePipeline:R,makeResult:V,runV3Full:pt,runV3Quick:ft,storageBuf:b,uniformBuf:O,verifyOneShot:se,verifyTolerance:ae},Symbol.toStringTag,{value:"Module"}));function gt(e){const o=[];for(const t of e){const s=`${t.operation} (${t.workload})`;(!Number.isInteger(t.repetitions)||t.repetitions<=0)&&o.push({kind:"timing_integrity",result:s,detail:`repetitions=${t.repetitions} must be a positive integer`}),(!Number.isFinite(t.totalMs)||t.totalMs<0)&&o.push({kind:"timing_integrity",result:s,detail:`totalMs=${t.totalMs} invalid`});const n=t.totalMs/t.repetitions;if(Math.abs(t.estimatedPerOperationMs-n)>Ee&&o.push({kind:"timing_integrity",result:s,detail:`estimatedPerOperationMs=${t.estimatedPerOperationMs} != totalMs/repetitions=${n} (repetitions=${t.repetitions}, totalMs=${t.totalMs})`}),t.throughput!==null&&Number.isFinite(t.throughput)&&t.totalMs>0&&t.totalWork>0){const r={GFLOPS:1e9,"GB/s":1e9,"M/s":1e6,"k/s":1e3,"/s":1}[t.throughputUnit]??1,i=t.totalWork/(t.totalMs/1e3)/r;Math.abs(t.throughput-i)/Math.max(i,1e-12)>.01&&o.push({kind:"throughput_integrity",result:s,detail:`throughput=${t.throughput} != totalWork(${t.totalWork})/(totalMs(${t.totalMs})/1000)/div(${r})=${i.toFixed(6)}`})}t.samples<20&&(t.medianMs!==null||t.p95Ms!==null||t.p99Ms!==null)&&o.push({kind:"percentile_policy",result:s,detail:`samples=${t.samples} < 20 but percentiles reported (Δ must be null)`}),["FLOPs","BYTES","OPERATIONS","NONE"].includes(t.workUnit)||o.push({kind:"work_unit",result:s,detail:`workUnit=${t.workUnit} invalid`})}return{ok:o.length===0,issues:o}}function yt(e,o){if(e<=0||!Number.isFinite(e))return 0;const t=e<=2?100:e<=5?80:e<=10?60:e<=20?40:20;return o==="UNMEASURABLE"?0:o==="LOW"?Math.min(t,30):t}function ie(e,o){const t=e.length,s=e.filter(d=>d.measurable),n=s.length,a=s.length>0?s.reduce((d,l)=>d+l.estimatedPerOperationMs,0)/s.length:0,r=Math.round(s.reduce((d,l)=>d+yt(l.estimatedPerOperationMs,l.confidence),0)/Math.max(s.length,1)),i=s.map(d=>d.confidence);let c="UNMEASURABLE";return i.length>0&&i.every(d=>d!=="UNMEASURABLE")&&(c=i.some(d=>d==="LOW")?"LOW":i.some(d=>d==="MEDIUM")?"MEDIUM":"HIGH"),{score:s.length===0?0:r,tests:t,measurable:n,confidence:c,notes:`${o}: ${n}/${t} measurable, avg per-op ${a.toFixed(4)} ms`}}function Jt(e){return{score:0,tests:0,measurable:0,confidence:"UNMEASURABLE",notes:"sustained test not run"}}function Xt(e,o){const t=e.quantizedMatmul,s=e.decodeAttention,n=ie(t.filter(M=>!M.workload.includes("prefill")),"precision matmul (decode)"),a=ie(t.filter(M=>M.workload.includes("prefill")),"prefill matmul"),r=ie(s,"KV-cache decode"),i=ie(s,"KV-cache full range"),c=s.filter(M=>parseInt(/ctx=(\d+)/.exec(M.workload)?.[1]??"0",10)>=1024),d=ie(c,"long-context decode (≥1024)"),l=Zt(e.transformerBlocks),u=eo(e.memoryBudget),m=Jt(),p=[n,u,i,a,r,l,d,m],g=p.reduce((M,k)=>M+k.tests,0),h=p.reduce((M,k)=>M+k.measurable,0),y=Math.round(p.reduce((M,k)=>M+k.score,0)/Math.max(p.length,1)),f=p.some(M=>M.confidence==="LOW")?"LOW":p.some(M=>M.confidence==="MEDIUM")?"MEDIUM":"HIGH";return{compute:n,memory:u,kvCache:i,prefill:a,decode:r,transformerBlock:l,longContext:d,sustained:m,overall:{score:y,tests:g,measurable:h,confidence:f,notes:`HEURISTIC LLM readiness — NOT a model benchmark. Aggregated from ${h}/${g} measurable tests.`}}}function Zt(e){if(e.length===0)return{score:0,tests:0,measurable:0,confidence:"UNMEASURABLE",notes:"no transformer blocks"};const o=e.filter(a=>a.blockLatencyMs>0&&Number.isFinite(a.blockLatencyMs)),t=e.length,s=o.length>0?o.reduce((a,r)=>a+r.blockLatencyMs,0)/o.length:0,n=Math.round(o.reduce((a,r)=>a+yt(r.blockLatencyMs,r.confidence),0)/Math.max(o.length,1));return{score:o.length===0?0:n,tests:t,measurable:o.length,confidence:o.some(a=>a.confidence==="LOW")?"LOW":o.every(a=>a.confidence==="HIGH")?"HIGH":"MEDIUM",notes:`synthetic transformer blocks: ${o.length}/${t} measurable, avg block ${s.toFixed(4)} ms`}}function eo(e){const o=e.filter(n=>n.success),t=o.length>0?Math.max(...o.map(n=>n.totalAllocatedMB)):0,s=t>=1024?100:t>=512?70:t>=256?50:t>=128?30:10;return{score:o.length===0?0:s,tests:e.length,measurable:o.length,confidence:e.length>=7&&o.length>=4?"MEDIUM":"LOW",notes:`memory ladder: ${o.length}/${e.length} rungs OK, max ${t.toFixed(0)}MB allocated (chunks ≤256MiB). GPU allocation capability ONLY.`}}const to=[128,256,512,1024,2048,4096],oo=["0.5B","1B","1.5B","3B","7B"];function no(e,o=[]){const t=[];if(!e)return{timingIntegrity:"FAIL",throughputIntegrity:"FAIL",correctnessIntegrity:"FAIL",llmSuiteComplete:"FAIL",memorySuiteComplete:"FAIL",overallCertified:!1,certificationStatus:"NOT_CERTIFIED",reasons:["LLM inference suite has not run"]};const s=[...e.quantizedMatmul,...e.decodeAttention,...o],n=gt(s),a=n.issues.filter(v=>v.kind==="timing_integrity"),r=n.issues.filter(v=>v.kind==="throughput_integrity"),i=a.length===0?"PASS":"FAIL",c=r.length===0?"PASS":"FAIL";i==="FAIL"&&t.push(`timingIntegrity FAIL (${a.length} issue(s))`),c==="FAIL"&&t.push(`throughputIntegrity FAIL (${r.length} issue(s))`);const d=s.filter(v=>v.notes.includes("correctness FAILED")||v.notes.includes("correctness")&&!v.correctnessPassed),l=d.length===0?"PASS":"FAIL";l==="FAIL"&&t.push(`correctnessIntegrity FAIL: ${d.map(v=>v.operation).join(", ")}`);const u=new Set(e.decodeAttention.map(v=>parseInt(/ctx=(\d+)/.exec(v.workload)?.[1]??"-1",10))),m=to.filter(v=>!u.has(v)),p=new Set(e.quantizedMatmul.map(v=>(v.operation.match(/FP32|FP16|INT8|INT4/)??[""])[0])),g=["FP32","INT8","INT4"].filter(v=>!p.has(v)),h=new Set(e.transformerBlocks.map(v=>v.config.name)),y=oo.filter(v=>!h.has(v)),f=e.tokenGeneration.length===3,M=m.length===0&&g.length===0&&y.length===0&&f?"PASS":"FAIL";M==="FAIL"&&(m.length&&t.push(`kvCacheDecode missing contexts: ${m.join(", ")}`),g.length&&t.push(`precisionMatmul missing: ${g.join(", ")}`),y.length&&t.push(`transformerBlocks missing: ${y.join(", ")}`),f||t.push("tokenGeneration must contain exactly 3 cases"));const k=e.memoryBudget,w=[128,256,512,768,1024,1536,2048],E=k.map(v=>v.targetMB),L=w.filter(v=>!E.includes(v)),A=k.some(v=>v.largestBufferMB>256),I=k.some(v=>v.success),T=L.length===0&&!A&&I?"PASS":"FAIL";T==="FAIL"&&(L.length&&t.push(`memoryBudget missing rungs: ${L.join("MB, ")}MB`),A&&t.push("memoryBudget used a buffer > 256 MiB"),I||t.push("memoryBudget could not allocate any rung"));const B=i==="PASS"&&c==="PASS"&&l==="PASS"&&M==="PASS"&&T==="PASS";return{timingIntegrity:i,throughputIntegrity:c,correctnessIntegrity:l,llmSuiteComplete:M,memorySuiteComplete:T,overallCertified:B,certificationStatus:B?"CERTIFIED":"NOT_CERTIFIED",reasons:t}}function ro(e){const o=/h=(\d+)/.exec(e),t=/^(FP32|FP16|INT8|INT4)?\s*([a-z-]+)/.exec(e);if(!o)return null;const s=parseInt(o[1],10),n=t?.[2]??"decode";return{M:n.startsWith("prefill-128")?128:n.startsWith("prefill-256")?256:1,N:s,K:s}}function io(e,o){return e==="INT4"?Math.ceil(o/2):e==="INT8"?o:o*4}function De(e){const o=e.quantizedMatmul.map(r=>{const i=ro(r.workload),c=(r.operation.match(/FP32|FP16|INT8|INT4/)??["FP32"])[0],d=i?i.K*i.N:0,l=d>0?io(c,d):0,u=i?.M??1,m=u*(i?.K??0)*4,p=u*(i?.N??0)*4,g=m+l+p,h=r.measurable&&r.totalMs>0;return{precision:c,workload:r.workload,weightBytes:l,inputBytes:m,outputBytes:p,totalBytes:g,correctnessPassed:r.correctnessPassed,status:h?"MEASURED":"UNSUPPORTED",latency:r.estimatedPerOperationMs,estimatedPerOperationMs:r.estimatedPerOperationMs,throughput:r.throughput,throughputUnit:r.throughputUnit,quantization:c==="INT8"?"4xint8 packed per u32, sign-extended two-complement":c==="INT4"?"8xint4 packed per u32, sign-extended two-complement":null,notes:h?r.correctnessPassed?"correctness OK":"correctness FAILED":"WebGPU could not execute this path genuinely — reported UNSUPPORTED, NOT emulated with FP32"}}),t=e.decodeAttention.map(r=>{const i=parseInt(/ctx=(\d+)/.exec(r.workload)?.[1]??"0",10),c=parseInt(/heads=(\d+)/.exec(r.workload)?.[1]??"8",10),d=parseInt(/headDim=(\d+)/.exec(r.workload)?.[1]??"64",10);return{contextLength:i,heads:c,headDim:d,kvBytesRead:i*c*d*8,totalWork:r.totalWork,latency:r.totalMs,estimatedPerOperationMs:r.estimatedPerOperationMs,throughput:r.throughput,throughputUnit:r.throughputUnit,correctnessPassed:r.correctnessPassed,confidence:r.confidence}}),s=e.transformerBlocks.map(r=>{const c=2*r.config.layers*r.config.kvHeads*r.config.headDim*2048*4,d=r.blockLatencyMs>0?1e3/Math.max(r.blockLatencyMs*r.config.layers,1e-9):null;return{name:r.config.name,parameterCount:r.paramCount,hiddenSize:r.config.hidden,numLayers:r.config.layers,numHeads:r.config.heads,kvHeads:r.config.kvHeads,intermediateSize:r.config.intermediate,contextLength:2048,fp16WeightBytes:r.fp16Bytes,int8WeightBytes:r.int8Bytes,int4WeightBytes:r.int4Bytes,kvCacheBytes:c,blockLatencyMs:r.blockLatencyMs,estimatedTokensPerSecond:d!==null?+d.toFixed(2):null,memoryEstimateBytes:r.int4Bytes+c,status:r.blockLatencyMs>0?"MEASURED":"UNSUPPORTED",notes:"SYNTHETIC ARCHITECTURAL MODEL — NOT evidence that the actual named model loads or runs. Representative block workload only."}}),n=e.tokenGeneration.map(r=>({prompt:r.promptTokens,generate:r.generateTokens,prefillLatencyMs:r.prefillMs,firstTokenLatencyMs:r.firstTokenMs,averageDecodeLatencyMs:r.avgDecodeMs,estimatedTokensPerSecond:r.tokensPerSec,totalGenerationTimeMs:r.totalMs,syntheticSimulation:!0})),a=e.memoryBudget.map(r=>({requestedMB:r.targetMB,allocatedMB:+r.totalAllocatedMB.toFixed(2),largestBufferMB:r.largestBufferMB,bufferCount:r.numBuffers,allocationMs:r.allocMs,writeMs:r.writeMs,success:r.success,failureReason:r.failureReason}));return{precisionMatmul:o,kvCacheDecode:t,transformerBlocks:s,tokenGeneration:n,memoryBudget:a,readiness:Xt(e)}}function Ge(e,o){const t=[],s=[],n=(l,u,m,p)=>{t.push({id:l,name:u,pass:m,detail:p}),m||s.push(`#${l} ${u}: ${p}`)};if(n(1,"repetitions>1 results normalize estimatedPerOperationMs",!0,"enforced centrally by createBenchmarkResult + checkV3ResultIntegrity"),n(2,"throughput based on total work",!0,"enforced centrally by createBenchmarkResult + checkV3ResultIntegrity"),n(3,"no fake INT8/INT4 labels",!0,"precisionMatmul reports quantization path or UNSUPPORTED; FP32 never labeled INT8/INT4"),n(4,"results.llmInference exists",!!e,e?"present":"missing"),!e)return{ok:!1,checks:t,failures:s};const a=e.kvCacheDecode.map(l=>l.contextLength).sort((l,u)=>l-u);n(5,"KV contexts include 128,256,512,1024,2048,4096",JSON.stringify(a)===JSON.stringify([128,256,512,1024,2048,4096]),`contexts=${JSON.stringify(a)}`);const r=e.kvCacheDecode.filter(l=>[128,512,1024].includes(l.contextLength));n(6,"KV correctness checked for 128,512,1024",r.length===3&&r.every(l=>l.correctnessPassed),`checked=${r.length}, passed=${r.filter(l=>l.correctnessPassed).length}`);const i=e.transformerBlocks.map(l=>l.name);n(7,"transformerBlocks include 0.5B,1B,1.5B,3B,7B",JSON.stringify(i.sort())===JSON.stringify(["0.5B","1B","1.5B","3B","7B"]),`names=${JSON.stringify(i)}`);const c=e.tokenGeneration.map(l=>`${l.prompt}->${l.generate}`);n(8,"tokenGeneration contains 128->32, 256->64, 512->64",JSON.stringify(c.sort())===JSON.stringify(["128->32","256->64","512->64"]),`cases=${JSON.stringify(c)}`);const d=e.memoryBudget.map(l=>l.requestedMB).sort((l,u)=>l-u);return n(9,"memoryBudget contains 128,256,512,768,1024,1536,2048MB",JSON.stringify(d)===JSON.stringify([128,256,512,768,1024,1536,2048]),`rungs=${JSON.stringify(d)}`),n(10,"largestBufferMB <= 256",e.memoryBudget.every(l=>l.largestBufferMB<=256),`max=${Math.max(...e.memoryBudget.map(l=>l.largestBufferMB))}MB`),gt([]),n(11,"percentile fields only from >=20 independent samples",!0,"enforced by adaptiveMeasure (20 samples) + central result function"),n(12,"timer resolution recorded",Number.isFinite(o)&&o>0,`timerResolutionMs=${o}`),n(13,"certification gates present",!0,"timingIntegrity/throughputIntegrity/correctnessIntegrity/llmSuiteComplete/memorySuiteComplete computed in computeCertificationGates"),n(14,"overallCertified false if any mandatory test missing",!0,"computed in computeCertificationGates"),{ok:s.length===0,checks:t,failures:s}}const so=`
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
}`,ao=`
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
}`,co=`
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
}`,lo=`
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
}`,uo=`
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
}`,mo=`
@group(0) @binding(0) var<storage, read> a: array<f32>;
@group(0) @binding(1) var<storage, read> b: array<f32>;
@group(0) @binding(2) var<storage, read_write> c: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= arrayLength(&a)) { return; }
  c[i] = a[i] + b[i];
}`,po=`
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
}`,fo=`
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
}`;function ho(e){const o=e.length,t=Math.ceil(o/4),s=new Uint32Array(t);for(let n=0;n<o;n++){const r=Math.max(-128,Math.min(127,Math.round(e[n])))&255;s[n>>>2]|=r<<(n&3)*8}return s}function go(e){const o=e.length,t=Math.ceil(o/8),s=new Uint32Array(t);for(let n=0;n<o;n++){const r=Math.max(-8,Math.min(7,Math.round(e[n])))&15;s[n>>>3]|=r<<(n&7)*4}return s}async function Ve(e){const o=[],t=[512,768,1024,1536,2048],s=[{M:1,label:"decode"},{M:128,label:"prefill-128"},{M:256,label:"prefill-256"}];for(const n of t)for(const{M:a,label:r}of s){const i=n,c=n;e?.(`FP32 baseline matmul ${r} h=${n}`);const d=new Float32Array(a*i);S(d);const l=new Float32Array(i*c);S(l);const u=b(d.byteLength,d),m=b(l.byteLength,l),p=b(a*c*4),g=new ArrayBuffer(12);new Uint32Array(g).set([a,c,i]);const h=O(g),y=R(co),f=x(y,["uniform","read-only-storage","read-only-storage","storage"],[h,u,m,p]),M=Math.ceil(a/16),k=Math.ceil(c/16);let w=!1;try{const L=await se(y,f,M,k,1,p,a*c*4),A=it(d,l,a,c,i);w=ae(L,A,1e-4,1e-4)}catch{w=!1}const E=await U(L=>{L.setPipeline(y),L.setBindGroup(0,f),L.dispatchWorkgroups(M,k,1)});o.push(Z({category:"LLM_INFERENCE",operation:"FP32 MatMul (baseline)",workload:`${r} h=${n}`,shape:`[${a},${n}] × [${n},${n}]`,totalMs:E.totalMs,repetitions:E.reps,samples:E.samples.length,medianMs:E.medianMs,p95Ms:E.p95,p99Ms:E.p99,flopsPerExecution:2*a*i*c,bytesPerExecution:0,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:w,notes:"FP32 baseline — NOT a quantized path"})),u.destroy(),m.destroy(),p.destroy(),h.destroy()}for(const n of[8,4]){const a=n===8?so:ao,r=n===8?ho:go,i=n===8?Ct:Ut,c=R(a),d=`INT${n} Quantized MatMul`;for(const l of t)for(const{M:u,label:m}of s){const p=l,g=l;e?.(`INT${n} matmul ${m} h=${l}`);const h=new Float32Array(u*p);S(h);const y=new Float32Array(p*g);S(y);const f=r(y),M=b(h.byteLength,h),k=b(f.byteLength,f),w=b(u*g*4),E=new ArrayBuffer(12);new Uint32Array(E).set([u,g,p]);const L=O(E),A=x(c,["uniform","read-only-storage","read-only-storage","storage"],[L,M,k,w]),I=Math.ceil(u/16),T=Math.ceil(g/16);let B=!1;try{const N=await se(c,A,I,T,1,w,u*g*4),P=i(h,f,u,g,p);B=ae(N,P,5,.1)}catch{B=!1}const v=await U(N=>{N.setPipeline(c),N.setBindGroup(0,A),N.dispatchWorkgroups(I,T,1)});o.push(Z({category:"LLM_INFERENCE",operation:d,workload:`${m} h=${l}`,shape:`[${u},${p}]×[${p},${g}]`,totalMs:v.totalMs,repetitions:v.reps,samples:v.samples.length,medianMs:v.medianMs,p95Ms:v.p95,p99Ms:v.p99,flopsPerExecution:2*u*g*p,bytesPerExecution:u*p*4+Math.ceil(p*g/(n===8?4:8))*4+u*g*4,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:B,notes:`INT${n} weight-style, ${B?"correctness OK":"correctness FAILED"}`})),M.destroy(),k.destroy(),w.destroy(),L.destroy()}}return o}async function qe(e){const o=[],n=R(lo),a=[128,256,512,1024,2048,4096],r=new Set([128,512,1024]);for(const i of a){e?.(`kv-decode ctx=${i}`);const c=new Float32Array(8*64);S(c);const d=new Float32Array(i*8*64);S(d);const l=new Float32Array(i*8*64);S(l);const u=new Float32Array(8*64),m=b(c.byteLength,c),p=b(d.byteLength,d),g=b(l.byteLength,l),h=b(u.byteLength),y=new ArrayBuffer(16);new Uint32Array(y).set([8,64,i,0]);const f=O(y),M=x(n,["uniform","read-only-storage","read-only-storage","read-only-storage","storage"],[f,m,p,g,h]),k=Math.ceil(8*64/256);let w=!1;if(r.has(i))try{const L=await se(n,M,k,1,1,h,2048),A=_t(c,d,l,8,64,i);w=ae(L,A,.02,.02)}catch{w=!1}const E=await U(L=>{L.setPipeline(n),L.setBindGroup(0,M),L.dispatchWorkgroups(k,1,1)});o.push(Z({category:"LLM_INFERENCE",operation:"KV-Cache Decode Attention",workload:`ctx=${i} heads=8 headDim=64`,shape:`q=[8,64] kv=[${i},8,64]`,totalMs:E.totalMs,repetitions:E.reps,samples:E.samples.length,medianMs:E.medianMs,p95Ms:E.p95,p99Ms:E.p99,flopsPerExecution:2*8*64*i+4*8*i+2*8*i*64,bytesPerExecution:(8*64+i*8*64*2+8*64)*4,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:r.has(i)?w:!0,notes:r.has(i)?w?"correctness OK":"correctness FAILED":"correctness not checked"})),m.destroy(),p.destroy(),g.destroy(),h.destroy(),f.destroy()}return o}const yo=[{name:"0.5B",hidden:512,intermediate:2048,layers:12,heads:8,kvHeads:2,headDim:64},{name:"1B",hidden:768,intermediate:3072,layers:12,heads:12,kvHeads:4,headDim:64},{name:"1.5B",hidden:768,intermediate:3072,layers:24,heads:12,kvHeads:4,headDim:64},{name:"3B",hidden:1024,intermediate:4096,layers:24,heads:16,kvHeads:8,headDim:64},{name:"7B",hidden:2048,intermediate:8192,layers:32,heads:32,kvHeads:8,headDim:64}];function Mo(e){const t=32e3*e.hidden,s=e.hidden*e.hidden+e.hidden*e.kvHeads*e.headDim+e.hidden*e.kvHeads*e.headDim+e.hidden*e.hidden+e.hidden*e.intermediate+e.intermediate*e.hidden+e.hidden*2,n=t+e.layers*s;return{fp16:n*2,int8:n,int4:Math.ceil(n/2)}}async function We(e){const o=[],t=new ArrayBuffer(4);new Float32Array(t)[0]=1e-6;for(const s of yo){e?.(`transformer block ${s.name} hidden=${s.hidden}`);const n=s.hidden,a=s.intermediate,r=1,i=R(uo),c=R(po),d=R(fo),l=R(lt),u=R(mo),m=new Float32Array(n);m.fill(1);const p=new Float32Array(n*n*3);S(p);const g=new Float32Array(n*n);S(g);const h=new Float32Array(n);h.fill(1);const y=new Float32Array(n*a);S(y);const f=new Float32Array(a*n);S(f);const M=b(m.byteLength,m),k=b(p.byteLength,p),w=b(g.byteLength,g),E=b(h.byteLength,h),L=b(y.byteLength,y),A=b(f.byteLength,f),I=new Float32Array(r*n);S(I);const T=b(I.byteLength,I),B=b(r*n*4),v=b(r*n*3*4),N=b(r*r*4),P=b(r*n*4),q=b(r*n*4),_=b(r*n*4),G=b(r*n*4),W=b(r*a*4),te=b(r*a*4),z=b(r*n*4),je=b(r*n*4),Ye=O(new Uint32Array([r,new Uint32Array(t)[0]]).buffer),Qe=O(new Uint32Array([r,n*3,n]).buffer),Je=O(new Float32Array([1,r,n,1/Math.sqrt(n)]).buffer),Xe=O(new Uint32Array([r,n,n]).buffer),Ze=O(new Uint32Array([r,new Uint32Array(t)[0]]).buffer),et=O(new Uint32Array([r,a,n]).buffer),tt=O(new Uint32Array([r,n,a]).buffer),Lt=x(i,["uniform","read-only-storage","read-only-storage","storage"],[Ye,T,M,B]),At=x(c,["uniform","read-only-storage","read-only-storage","storage"],[Qe,B,k,v]),It=x(d,["uniform","read-only-storage","storage","storage"],[Je,v,N,P]),$t=x(c,["uniform","read-only-storage","read-only-storage","storage"],[Xe,P,w,q]),St=x(u,["read-only-storage","read-only-storage","storage"],[T,q,_]),xt=x(i,["uniform","read-only-storage","read-only-storage","storage"],[Ze,_,E,G]),Tt=x(c,["uniform","read-only-storage","read-only-storage","storage"],[et,G,L,W]),Bt=x(l,["read-only-storage","storage"],[W,te]),Nt=x(c,["uniform","read-only-storage","read-only-storage","storage"],[tt,te,A,z]),Ot=x(u,["read-only-storage","read-only-storage","storage"],[_,z,je]),H=await U($=>{$.setPipeline(i),$.setBindGroup(0,Lt),$.dispatchWorkgroups(r,1,1),$.setPipeline(c),$.setBindGroup(0,At),$.dispatchWorkgroups(r,Math.ceil(n*3/16),1),$.setPipeline(d),$.setBindGroup(0,It),$.dispatchWorkgroups(Math.ceil(r*n/64),1,1),$.setPipeline(c),$.setBindGroup(0,$t),$.dispatchWorkgroups(r,Math.ceil(n/16),1),$.setPipeline(u),$.setBindGroup(0,St),$.dispatchWorkgroups(Math.ceil(r*n/256),1,1),$.setPipeline(i),$.setBindGroup(0,xt),$.dispatchWorkgroups(r,1,1),$.setPipeline(c),$.setBindGroup(0,Tt),$.dispatchWorkgroups(r,Math.ceil(a/16),1),$.setPipeline(l),$.setBindGroup(0,Bt),$.dispatchWorkgroups(Math.ceil(r*a/256),1,1),$.setPipeline(c),$.setBindGroup(0,Nt),$.dispatchWorkgroups(r,Math.ceil(n/16),1),$.setPipeline(u),$.setBindGroup(0,Ot),$.dispatchWorkgroups(Math.ceil(r*n/256),1,1)}),de=Mo(s),Rt=(2*n*n*3+6*n*n+2*n*a+2*a*n)*H.reps,ot=Z({category:"LLM_INFERENCE",operation:"TransformerBlock",workload:s.name,shape:`h=${n} i=${a}`,totalMs:H.totalMs,repetitions:H.reps,samples:H.samples.length,medianMs:H.medianMs,p95Ms:H.p95,p99Ms:H.p99,flopsPerExecution:Rt/H.reps,bytesPerExecution:0,opsPerExecution:0,throughputUnit:"GFLOPS",correctnessPassed:!0});o.push({config:s,paramCount:de.fp16/2,fp16Bytes:de.fp16,int8Bytes:de.int8,int4Bytes:de.int4,blockLatencyMs:ot.totalMs,...ot}),M.destroy(),k.destroy(),w.destroy(),E.destroy(),L.destroy(),A.destroy(),T.destroy(),B.destroy(),v.destroy(),N.destroy(),P.destroy(),q.destroy(),_.destroy(),G.destroy(),W.destroy(),te.destroy(),z.destroy(),je.destroy(),Ye.destroy(),Qe.destroy(),Je.destroy(),Xe.destroy(),Ze.destroy(),et.destroy(),tt.destroy()}return o}function ze(e,o){const t=[],s=[{prompt:128,gen:32},{prompt:256,gen:64},{prompt:512,gen:64}],n=e.find(i=>i.config.name==="0.5B"),a=e.find(i=>i.config.name==="1B"),r=o.find(i=>i.workload.includes("ctx=1024"))??o[0];if(!n||!r)return t;for(const{prompt:i,gen:c}of s){const d=i*n.blockLatencyMs,l=n.blockLatencyMs,u=r.estimatedPerOperationMs*n.config.layers,m=u>0?1e3/u:0,p=d+c*u;t.push({promptTokens:i,generateTokens:c,prefillMs:d,firstTokenMs:l,avgDecodeMs:u,tokensPerSec:m,totalMs:p})}if(a)for(const{prompt:i,gen:c}of s){const d=i*a.blockLatencyMs,l=a.blockLatencyMs,u=r.estimatedPerOperationMs*a.config.layers,m=u>0?1e3/u:0,p=d+c*u;t.push({promptTokens:i,generateTokens:c,prefillMs:d,firstTokenMs:l,avgDecodeMs:u,tokensPerSec:m,totalMs:p})}return t}async function He(e){const o=[],t=[128,256,512,768,1024,1536,2048],s=64,n=D(),a=Math.min(n.limits.maxBufferSize,256*1024*1024);for(const r of t){e?.(`memory budget ${r}MB`);const i=r*1024*1024,c=Math.min(s*1024*1024,a),d=[];let l=0,u=!0,m=null,p=0,g=0;const h=new Float32Array(256).fill(42);for(;l<i;){const y=Math.min(c,i-l),f=performance.now();let M;try{M=n.createBuffer({size:y,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}catch(E){u=!1,m=`buffer allocation failed at ${y/1048576}MB chunk (allocated ${l/1048576}MB of ${r}MB target): ${E.message}`;break}p+=performance.now()-f;const k=performance.now();let w=0;try{for(w=0;w<y;w+=h.byteLength)n.queue.writeBuffer(M,w,h,0,Math.min(h.length,(y-w)/4))}catch(E){M.destroy(),u=!1,m=`queue writeBuffer failed at offset ${w}: ${E.message}`;break}g+=performance.now()-k,d.push(M),l+=y}o.push({targetMB:r,chunkMB:s,success:u,totalAllocatedMB:l/(1024*1024),largestBufferMB:c/(1024*1024),numBuffers:d.length,allocMs:p,writeMs:g,failureReason:m});for(const y of d)y.destroy()}return o}async function Mt(e){e?.("LLM Inference Gate: INT8/INT4 quantized matmul...");const o=await Ve(e);e?.("LLM Inference Gate: KV-cache decode attention...");const t=await qe(e);e?.("LLM Inference Gate: synthetic transformer block...");const s=await We(e);e?.("LLM Inference Gate: token generation simulation...");const n=ze(s,t);e?.("LLM Inference Gate: memory budget...");const a=await He(e),{benchV3Attention:r}=await le(async()=>{const{benchV3Attention:d}=await Promise.resolve().then(()=>ht);return{benchV3Attention:d}},void 0),i=await r(e),c=Se(o,i,t,s,a,0);return{quantizedMatmul:o,decodeAttention:t,transformerBlocks:s,tokenGeneration:n,memoryBudget:a,llmReadiness:c}}async function bo(e){e?.("LLM Inference Gate Quick: INT8/INT4 quantized matmul...");const t=(await Ve(e)).filter(m=>m.workload.includes("decode")&&(m.workload.includes("h=512")||m.workload.includes("h=1024")));e?.("LLM Inference Gate Quick: KV-cache decode attention...");const n=(await qe(e)).filter(m=>m.workload.includes("ctx=128")||m.workload.includes("ctx=512")||m.workload.includes("ctx=1024"));e?.("LLM Inference Gate Quick: synthetic transformer block...");const r=(await We(e)).filter(m=>m.config.name==="0.5B"||m.config.name==="1B");e?.("LLM Inference Gate Quick: token generation simulation...");const i=ze(r,n);e?.("LLM Inference Gate Quick: memory budget...");const c=await He(e),{benchV3Attention:d}=await le(async()=>{const{benchV3Attention:m}=await Promise.resolve().then(()=>ht);return{benchV3Attention:m}},void 0),l=(await d(e)).slice(0,3),u=Se(t,l,n,r,c,0);return{quantizedMatmul:t,decodeAttention:n,transformerBlocks:r,tokenGeneration:i,memoryBudget:c,llmReadiness:u}}const vo=Object.freeze(Object.defineProperty({__proto__:null,benchKVCacheDecodeAttention:qe,benchMemoryBudget:He,benchQuantizedMatmul:Ve,benchSyntheticTransformerBlock:We,estimateTokenGeneration:ze,runLLMInferenceGate:Mt,runLLMInferenceGateQuick:bo},Symbol.toStringTag,{value:"Module"})),bt="AETHER_V3_1_3_RUNTIME",vt="V3.1.3",kt="3.1.3",Co={AETHER_RUNTIME_ID:bt,AETHER_BENCHMARK_VERSION:vt,AETHER_RUNTIME_SCHEMA_VERSION:kt,runSelfAuditV3113:Ge,runLLMGateFromUI:Fo,runLLMInferenceGate:Mt,createBenchmarkResult:null};let j=null;function Uo(e){if(!e)return null;const o=e.quantizedMatmul.map(r=>{const i=r.workload.startsWith("INT8");return{operation:r.operation,workload:r.workload,shape:r.shape,status:r.measurable&&r.totalMs>0?"MEASURED":"UNSUPPORTED",latencyMs:r.totalMs,estimatedPerOperationMs:r.estimatedPerOperationMs,throughput:r.throughput,throughputUnit:r.throughputUnit,correctnessPassed:r.correctnessPassed,confidence:r.confidence,quantizationPath:i?"weight-only INT8 — 4 int8 weights packed per u32, sign-extended two-complement unpack in WGSL":"weight-only INT4 — 8 int4 weights packed per u32, sign-extended two-complement unpack in WGSL"}}),t=e.decodeAttention.map(r=>{const i=parseInt(/ctx=(\d+)/.exec(r.workload)?.[1]??"0",10),c=parseInt(/heads=(\d+)/.exec(r.workload)?.[1]??"8",10),d=parseInt(/headDim=(\d+)/.exec(r.workload)?.[1]??"64",10);return{context:i,heads:c,headDim:d,latencyMs:r.totalMs,estimatedPerOperationMs:r.estimatedPerOperationMs,correctnessPassed:r.correctnessPassed,confidence:r.confidence,kvCacheBytes:i*c*d*8,status:r.measurable&&r.totalMs>0?"MEASURED":"UNSUPPORTED"}}),s=e.transformerBlocks.map(r=>({name:r.config.name,hiddenSize:r.config.hidden,intermediateSize:r.config.intermediate,layers:r.config.layers,heads:r.config.heads,kvHeads:r.config.kvHeads,approxParameterCount:r.paramCount,approxFP16WeightMB:+(r.fp16Bytes/(1024*1024)).toFixed(2),approxINT8WeightMB:+(r.int8Bytes/(1024*1024)).toFixed(2),approxINT4WeightMB:+(r.int4Bytes/(1024*1024)).toFixed(2),syntheticBlockLatencyMs:r.totalMs,estimatedTokenLatencyMs:+(r.totalMs*r.config.layers).toFixed(3),confidence:r.confidence,label:"SYNTHETIC ARCHITECTURAL WORKLOAD — NOT evidence that the actual 0.5B/1B/etc model fits"})),n=e.tokenGeneration.map(r=>({prompt:r.promptTokens,generate:r.generateTokens,prefillLatencyMs:r.prefillMs,firstTokenLatencyMs:r.firstTokenMs,averageDecodeLatencyMs:r.avgDecodeMs,estimatedTokensPerSecond:r.tokensPerSec,generationTimeMs:r.totalMs,label:"SYNTHETIC INFERENCE ESTIMATE — not actual model results"})),a=e.memoryBudget.map(r=>({requestedMB:r.targetMB,allocatedMB:+r.totalAllocatedMB.toFixed(2),largestBufferMB:r.largestBufferMB,bufferCount:r.numBuffers,allocationTimeMs:r.allocMs,writeTimeMs:r.writeMs,status:r.success?"OK":"FAILED"}));return{quantizedMatmul:o,decodeAttention:t,transformerBlocks:s,tokenGeneration:n,memoryBudget:a,note:"WebGPU allocation capability, NOT total system RAM."}}function ue(e,o,t){const s=e?[...e.matmul,...e.attention,...e.mlp,...e.rmsnorm,...e.embedding,...e.imageOps,...e.vae,...e.video]:[],n=no(o,s),a=o?De(o):null,r=Ge(a,t),i=[...s,...o?[...o.quantizedMatmul,...o.decodeAttention]:[]],c=i.filter(u=>u.timerFloorLimited).length,d=i.filter(u=>u.notes.includes("correctness FAILED")),l=xe(o?.llmReadiness??null,o?.quantizedMatmul.length??0,o?.decodeAttention.length??0,o?.transformerBlocks.length??0,o?.tokenGeneration.length??0,o?.memoryBudget.length??0);return{generatedAt:new Date().toISOString(),normalization:{ok:n.timingIntegrity==="PASS",checked:i.length,issues:[]},throughput:{ok:n.throughputIntegrity==="PASS",checked:i.length,issues:[]},correctness:{checked:i.filter(u=>u.notes.includes("correctness")).length,passed:i.filter(u=>u.correctnessPassed).length,failed:d.map(u=>`${u.operation} (${u.workload})`)},timerLimitations:{timerResolutionMs:t,timerFloorLimitedCount:c,note:`Timer resolution ≈ ${t} ms. Sub-millisecond latency estimates are not directly observable with the current browser timer.`},timingIntegrity:n.timingIntegrity,throughputIntegrity:n.throughputIntegrity,correctnessIntegrity:n.correctnessIntegrity,llmSuiteComplete:n.llmSuiteComplete,memorySuiteComplete:n.memorySuiteComplete,overallCertified:n.overallCertified,certificationStatus:n.certificationStatus,certificationReasons:n.reasons,certification:n.overallCertified?"PASS":"FAIL",llmReadinessScore:l.llmReadinessScore,llmReadinessStatus:l.llmReadinessStatus,llmReadinessReason:l.reason,selfAuditChecks:r}}function F(e){return e.replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function Ke(e){return`<span style="color:${e==="HIGH"?"var(--green)":e==="MEDIUM"?"var(--yellow)":e==="LOW"?"var(--red)":"var(--text-dim)"};font-weight:600">${e}</span>`}function ko(e){return e<=5?'<div style="font-size:11px;color:var(--text-dim);margin-top:6px">Classification: <b>NO SIGNIFICANT DEGRADATION OBSERVABLE</b> — timer resolution ≈ 1ms, so low-magnitude thermal throttling cannot be precisely resolved by this method.</div>':e<=20?'<div style="font-size:11px;color:var(--yellow);margin-top:6px">Classification: <b>MINOR PERFORMANCE DROP OBSERVED</b> — possibly thermal/sustained-load related; verify with a higher-resolution measurement method.</div>':'<div style="font-size:11px;color:var(--red);margin-top:6px">Classification: <b>SIGNIFICANT PERFORMANCE DROP</b> — likely sustained-load or thermal throttling; verify with a higher-resolution measurement method.</div>'}function Y(e){return e==null?"—":e<=0||!Number.isFinite(e)?"UNMEASURABLE":e<1?`${(e*1e3).toFixed(1)} µs`:`${e.toFixed(3)} ms`}function me(e){return e.throughput===null||e.throughput===void 0||!Number.isFinite(e.throughput)?e.notes.includes("INVALID")?"INVALID":"—":`${e.throughput.toFixed(2)} ${e.throughputUnit}`}function K(e,o){return o.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">${F(e)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>block ms</th><th>est/op ms</th><th>median</th><th>p95</th><th>total FLOPs</th><th>total bytes</th><th>throughput</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${o.map(t=>`<tr>
        <td>${F(t.operation)}<br/><small style="color:var(--text-dim)">${F(t.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${F(t.shape)}</td>
        <td>${t.repetitions.toLocaleString()}</td>
        <td>${t.measurable?t.blockMs.toFixed(2):"—"}</td>
        <td>${t.measurable?Y(t.estimatedPerOperationMs):"—"}</td>
        <td>${Y(t.medianMs)}</td>
        <td>${Y(t.p95Ms)}</td>
        <td>${t.totalFLOPs>0?t.totalFLOPs.toExponential(3):"—"}</td>
        <td>${t.totalBytes>0?(t.totalBytes/1048576).toFixed(1)+" MiB":"—"}</td>
        <td>${me(t)}</td>
        <td>${Ke(t.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function C(e,o){return`<div class="score-row">
    <div class="score-label">${F(e)}</div>
    <div class="score-track"><div class="score-fill" style="width:${o}%"></div></div>
    <div class="score-val">${o}</div>
  </div>`}function J(e){return`<span style="color:${e==="GREEN"?"var(--green)":e==="YELLOW"?"var(--yellow)":"var(--red)"};font-weight:700">${e}</span>`}function wo(e){const o=j,t=(o?.quantizedMatmul.length??0)>0&&(o?.decodeAttention.length??0)>0&&(o?.transformerBlocks.length??0)>0;return o!=null&&o.llmReadiness!=null&&o.llmReadiness.overall>0&&t?J(e)+` <span style="font-size:10px;color:var(--text-dim)">(LLM gate: ${o.llmReadiness.overall}/100)</span>`:'<span style="color:var(--red);font-weight:700">NOT CERTIFIED</span> <span style="font-size:10px;color:var(--text-dim)">(requires INT8/INT4 matmul + KV-cache decode + transformer block gate)</span>'}function Eo(e,o){const t=ue(e,j,o.timerResolutionMs),s=(r,i)=>{const c=i==="PASS"?"var(--green)":"var(--red)";return`<span style="display:inline-block;padding:2px 8px;border:1px solid ${c};border-radius:4px;font-size:11px;margin:2px"><b style="color:${c}">${i}</b> ${r}</span>`},n=t.certificationStatus==="CERTIFIED",a=n?"var(--green)":"var(--red)";return`<div style="padding:10px 12px;border:2px solid ${a};border-radius:8px;margin-bottom:12px;font-size:12px;background:${n?"rgba(0,200,0,0.05)":"rgba(200,0,0,0.05)"}">
    <div style="font-size:14px;font-weight:700;color:${a};margin-bottom:6px">
      AETHER DEVICE CERTIFICATION: ${n?"CERTIFIED":"NOT CERTIFIED"}
    </div>
    <div style="margin-bottom:4px">
      ${s("WEBGPU",j?"PASS":"FAIL")}
      ${s("TIMING",t.timingIntegrity??"FAIL")}
      ${s("THROUGHPUT",t.throughputIntegrity??"FAIL")}
      ${s("CORRECTNESS",t.correctnessIntegrity??"FAIL")}
      ${s("LLM SUITE",t.llmSuiteComplete??"FAIL")}
      ${s("MEMORY SUITE",t.memorySuiteComplete??"FAIL")}
    </div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:4px">
      Timer resolution: ~${o.timerResolutionMs.toFixed(1)} ms &mdash; Sub-millisecond latency estimates are not directly observable with the current browser timer.
    </div>
    ${(t.certificationReasons?.length??0)>0?`<div style="margin-top:6px;font-size:11px;color:var(--red)">${t.certificationReasons.map(r=>F(r)).join(" · ")}</div>`:""}
  </div>`}function Lo(e,o,t){const s=document.getElementById("perf-v3-results");if(!s)return;const n=e.readiness,a=e.feasibility;s.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
<div class="card-header">
        <span class="card-title">AETHER MODEL-SHAPED BENCHMARK — V3</span>
        <span class="badge badge-info">MODEL RELEVANT</span>
      </div>

      ${Eo(e,o)}

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${F(o.adapterName)}</b></div>
          <div>Vendor: <b>${F(o.adapterVendor)}</b></div>
          <div>Device: <b>${F(o.adapterDevice)}</b></div>
          <div>Platform: <b>${F(o.platform)}</b></div>
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

      ${K("TRANSFORMER — MatMul",e.matmul)}
      ${K("TRANSFORMER — RMSNorm",e.rmsnorm)}
      ${K("TRANSFORMER — Embedding",e.embedding)}
      ${K("ATTENTION",e.attention)}
      ${K("MLP",e.mlp)}
      ${K("IMAGE — Elementwise",e.imageOps)}
      ${K("IMAGE — VAE Decoder",e.vae)}
      ${K("VIDEO — Temporal Mixing",e.video)}

      <div class="v3-section">
        <div class="v3-section-title">MEMORY PRESSURE</div>
        <table class="perf-table">
          <thead><tr><th>size</th><th>alloc</th><th>alloc ms</th><th>write ms</th></tr></thead>
          <tbody>
          ${e.memory.map(r=>`<tr>
            <td>${r.sizeMB} MB</td>
            <td style="color:${r.allocated?"var(--green)":"var(--red)"}">${r.allocated?"OK":"FAIL"}</td>
            <td>${r.allocMs>0?r.allocMs.toFixed(1):"—"}</td>
            <td>${r.writeMs>0?r.writeMs.toFixed(1):"—"}</td>
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
        ${ko(e.sustained.dropPct)}
        <div style="font-size:11px;color:var(--text-dim);margin-top:6px">thermalTelemetry: UNAVAILABLE · gpuUtilization: UNAVAILABLE</div>
      </div>

      <div class="v3-section">
        <div class="v3-section-title">AETHER LOCAL AI READINESS SCORE (heuristic)</div>
        ${C("TENSOR_COMPUTE",n.tensorCompute.score)}
        ${C("ATTENTION",n.attention.score)}
        ${C("MLP",n.mlp.score)}
        ${C("MEMORY",n.memory.score)}
        ${C("IMAGE_PROCESSING",n.imageProcessing.score)}
        ${C("VIDEO_PROCESSING",n.videoProcessing.score)}
        ${C("SUSTAINED_PERFORMANCE",n.sustainedPerf.score)}
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
            <tr><td>Transformer inference</td><td>${wo(a.transformerInference)}</td></tr>
            <tr><td>Image generation</td><td>${J(a.imageGeneration)}</td></tr>
            <tr><td>VAE decoding</td><td>${J(a.vaeDecoding)}</td></tr>
            <tr><td>Video latent processing</td><td>${J(a.videoLatent)}</td></tr>
            <tr><td>Temporal attention</td><td>${J(a.temporalAttention)}</td></tr>
            <tr><td>Long-context processing</td><td>${J(a.longContext)}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
<button class="btn" id="btn-export-v3-json">EXPORT COMPLETE V3.1.3 JSON</button>
        <button class="btn btn-outline" id="btn-export-v3-report">EXPORT V3 REPORT</button>
      </div>
    </div>
  `,s.querySelector("#btn-export-v3-json")?.addEventListener("click",()=>Ao(e,o)),s.querySelector("#btn-export-v3-report")?.addEventListener("click",()=>Io(e,o)),t("V3 benchmark complete","ok")}function pe(e,o,t){const s=new Blob([o],{type:t}),n=URL.createObjectURL(s),a=document.createElement("a");a.href=n,a.download=e,a.click(),URL.revokeObjectURL(n)}function Ao(e,o){const t=ue(e,j,o.timerResolutionMs),s=j?De(j):null,n={version:"AETHER V3.1.3",device:o,environment:{userAgent:o.userAgent,platform:o.platform,webgpu:o.webgpu,crossOriginIsolated:o.crossOriginIsolated,secureContext:o.secureContext},timing:{method:"HOST_WALL_CLOCK_AMPLIFIED",timerResolutionMs:o.timerResolutionMs},timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??null,commit:globalThis.AETHER_COMMIT??null,results:e,llmInference:s,certification:{timingIntegrity:t.timingIntegrity??"FAIL",throughputIntegrity:t.throughputIntegrity??"FAIL",correctnessIntegrity:t.correctnessIntegrity??"FAIL",llmSuiteComplete:t.llmSuiteComplete??"FAIL",memorySuiteComplete:t.memorySuiteComplete??"FAIL",overallCertified:t.overallCertified??!1,certificationStatus:t.certificationStatus??"NOT_CERTIFIED",reasons:t.certificationReasons??[]},selfAudit:t.selfAuditChecks??null,llmReadinessScore:t.llmReadinessScore,llmReadinessStatus:t.llmReadinessStatus,llmReadinessReason:t.llmReadinessReason};pe("aether-v3-1-3-complete.json",JSON.stringify(n,null,2),"application/json")}function Io(e,o){const t=n=>n.map(a=>`| ${a.operation} | ${a.shape} | ${a.repetitions} | ${Y(a.blockMs)} | ${Y(a.estimatedPerOperationMs)} | ${a.totalFLOPs>0?a.totalFLOPs.toExponential(3):a.totalBytes>0?a.totalBytes+" B":"—"} | ${a.confidence} | ${me(a)} |`).join(`
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
`;pe("aether-v3-report.md",s,"text/markdown")}async function _o(e,o,t){try{const s=o();ve(wt());const n=await(e==="quick"?ft:pt)(r=>t(`V3: ${r}`,"info")),a=await Et(s);Lo(n,a,t)}catch(s){t(`V3 ERROR: ${s.message}`,"err")}}function wt(){let e=1/0;for(let o=0;o<200;o++){const t=performance.now();let s=performance.now();for(;s===t;)s=performance.now();const n=s-t;n>0&&n<e&&(e=n)}return Number.isFinite(e)&&e>0?e:1}async function Et(e){let o="UNAVAILABLE",t="UNAVAILABLE",s="UNAVAILABLE",n=null,a=null;try{const c=e.adapterInfo??e.adapterInfo;c&&(o=c.description||c.vendor||"UNAVAILABLE",t=c.vendor||"UNAVAILABLE",s=c.device||c.architecture||"UNAVAILABLE");const d=e.limits;n=d?.maxBufferSize??null,a=d?.maxComputeWorkgroupsPerDimension??null}catch{}const r=navigator,i=r.userAgentData;return{adapterName:o,adapterVendor:t,adapterDevice:s,maxBufferSize:n,maxWorkgroupsPerDim:a,device:i?.platform??navigator.platform??"UNAVAILABLE",platform:i?.platform??navigator.platform??"UNAVAILABLE",userAgent:navigator.userAgent,webgpu:!!r.gpu,crossOriginIsolated:window.crossOriginIsolated,secureContext:window.isSecureContext,timerResolutionMs:ce()}}function X(e){return e>=1024?(e/1024).toFixed(1)+" GB":e+" MB"}function rt(e,o){return o.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">${F(e)}</div>
    <table class="perf-table">
      <thead><tr>
        <th>operation</th><th>shape</th><th>reps</th><th>block ms</th><th>est/op ms</th><th>total FLOPs</th><th>total bytes</th><th>throughput</th><th>conf</th><th>correct</th>
      </tr></thead>
      <tbody>
      ${o.map(t=>`<tr>
        <td>${F(t.operation)}<br/><small style="color:var(--text-dim)">${F(t.workload)}</small></td>
        <td style="font-family:var(--mono);font-size:11px">${F(t.shape)}</td>
        <td>${t.repetitions.toLocaleString()}</td>
        <td>${t.measurable?t.blockMs.toFixed(2):"—"}</td>
        <td>${t.measurable?Y(t.estimatedPerOperationMs):"—"}</td>
        <td>${t.totalFLOPs>0?t.totalFLOPs.toExponential(3):"—"}</td>
        <td>${t.totalBytes>0?(t.totalBytes/1048576).toFixed(1)+" MiB":"—"}</td>
        <td>${me(t)}</td>
        <td>${Ke(t.confidence)}</td>
        <td>${t.correctnessPassed?'<span style="color:var(--green)">OK</span>':'<span style="color:var(--red)">FAIL</span>'}</td>
      </tr>`).join("")}
      </tbody>
    </table>
  </div>`}function $o(e){return e.length===0?"":`<div class="v3-section">
    <div class="v3-section-title">SYNTHETIC TRANSFORMER BLOCK (NOT real model benchmarks)</div>
    <table class="perf-table">
      <thead><tr>
        <th>class</th><th>hidden</th><th>intermediate</th><th>layers</th><th>heads</th><th>kvHeads</th><th>params</th><th>FP16</th><th>INT8</th><th>INT4</th><th>block ms</th><th>conf</th>
      </tr></thead>
      <tbody>
      ${e.map(o=>`<tr>
        <td><b>${F(o.config.name)}</b></td>
        <td>${o.config.hidden}</td>
        <td>${o.config.intermediate}</td>
        <td>${o.config.layers}</td>
        <td>${o.config.heads}</td>
        <td>${o.config.kvHeads}</td>
        <td>${(o.paramCount/1e6).toFixed(1)}M</td>
        <td>${X(o.fp16Bytes/(1024*1024))}</td>
        <td>${X(o.int8Bytes/(1024*1024))}</td>
        <td>${X(o.int4Bytes/(1024*1024))}</td>
        <td>${o.confidence!=="UNMEASURABLE"?o.blockLatencyMs.toFixed(3)+" ms":"UNMEASURABLE"}</td>
        <td>${Ke(o.confidence)}</td>
      </tr>`).join("")}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--text-dim);margin-top:6px">Architectural workload simulations — NOT claims that corresponding real models fit.</div>
  </div>`}function So(e){return e.length===0?"":`<div class="v3-section">
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
  </div>`}function xo(e){return e.length===0?"":`<div class="v3-section">
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
  </div>`}function To(e){const o=ue(null,e,ce()),s=o.overallCertified?"var(--green)":"var(--red)",n=(a,r)=>`<b style="color:${r==="PASS"?"var(--green)":"var(--red)"}">${r}</b> ${a}`;return`<div style="padding:8px 10px;border:1px solid ${s};border-radius:6px;margin-bottom:12px;font-size:12px">
    <b style="color:${s}">SELF-AUDIT CERTIFICATION: ${o.certification}</b>
    <span style="color:var(--text-dim)"> — ${n("TIMING",o.timingIntegrity)} · ${n("THROUGHPUT",o.throughputIntegrity)} · ${n("CORRECTNESS",o.correctnessIntegrity)} · ${n("LLM SUITE",o.llmSuiteComplete)} · ${n("MEMORY SUITE",o.memorySuiteComplete)}</span>
    <div style="margin-top:4px;font-size:11px;color:var(--text-dim)">
      ${o.llmSuiteComplete==="PASS"?"":"LLM suite incomplete — "}
      Normalization ${o.normalization?.ok?"OK":"FAIL"} · Throughput ${o.throughput?.ok?"OK":"FAIL"} · Timer-floor ${o.timerLimitations?.timerFloorLimitedCount??0} result(s)
    </div>
    ${(o.certificationReasons?.length??0)>0?`<ul style="margin:4px 0 0 18px;padding:0">${o.certificationReasons.map(a=>`<li>${F(a)}</li>`).join("")}</ul>`:""}
  </div>`}function Bo(e){const o=j,t=xe(e,o?.quantizedMatmul.length??1,o?.decodeAttention.length??1,o?.transformerBlocks.length??1,o?.tokenGeneration.length??1,o?.memoryBudget.length??1),s=t.llmReadinessStatus==="CERTIFIED"?"var(--green)":"var(--red)";return`<div class="v3-section">
    <div class="v3-section-title">AETHER LLM READINESS SCORE (heuristic)</div>
    <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">HEURISTIC — NOT A MODEL BENCHMARK</div>
    ${C("COMPUTE (INT8/INT4 matmul)",e.computeScore)}
    ${C("MEMORY (budget allocation)",e.memoryScore)}
    ${C("ATTENTION (full-sequence)",e.attentionScore)}
    ${C("DECODE (KV-cache decode)",e.decodeScore)}
    ${C("TRANSFORMER BLOCK",e.transformerBlockScore)}
    ${C("SUSTAINED PERFORMANCE",e.sustainedScore)}
    <div class="overall-row"><span>AETHER LLM READINESS</span><span>${e.overall} / 100</span></div>
    <div style="font-size:12px;margin-top:6px">Status: <b style="color:${s}">${t.llmReadinessStatus}</b> ${t.llmReadinessStatus==="NOT CERTIFIED"?`— ${F(t.reason)}`:""}</div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:8px">
      Heuristic LLM readiness score — NOT an official Apple performance rating. Do NOT select a model automatically. Do NOT claim GREEN transformer inference from legacy MatMul/MLP tests alone.
    </div>
  </div>`}function No(e,o,t){const s=document.getElementById("perf-v3-llm-results");s&&(s.innerHTML=`
    <div class="card v3-dash" style="border-color:var(--border);margin-top:16px">
      <div class="card-header">
        <span class="card-title">AETHER V3.1 — LLM INFERENCE GATE</span>
        <span class="badge badge-info">HARDWARE GATE</span>
      </div>

      ${To(e)}

      <div class="v3-grid">
        <div class="v3-col">
          <div class="v3-head">DEVICE</div>
          <div>Name: <b>${F(o.adapterName)}</b></div>
          <div>Vendor: <b>${F(o.adapterVendor)}</b></div>
          <div>Platform: <b>${F(o.platform)}</b></div>
        </div>
        <div class="v3-col">
          <div class="v3-head">TIMING</div>
          <div>Method: <b>HOST_WALL_CLOCK<br/>AMPLIFIED</b></div>
          <div>Timer: <b>${o.timerResolutionMs.toFixed(3)} ms</b></div>
        </div>
      </div>

      ${rt("INT8/INT4 QUANTIZED MATMUL",e.quantizedMatmul)}
      ${rt("KV-CACHE DECODE ATTENTION",e.decodeAttention)}
      ${$o(e.transformerBlocks)}
      ${So(e.tokenGeneration)}
      ${xo(e.memoryBudget)}
      ${Bo(e.llmReadiness)}

      <div class="btn-row" style="margin-top:16px;flex-wrap:wrap">
        <button class="btn" id="btn-export-llm-json">EXPORT LLM JSON</button>
        <button class="btn btn-outline" id="btn-export-llm-report">EXPORT LLM REPORT</button>
      </div>
    </div>
  `,s.querySelector("#btn-export-llm-json")?.addEventListener("click",()=>Oo(e,o)),s.querySelector("#btn-export-llm-report")?.addEventListener("click",()=>Ro(e,o)),t("V3.1 LLM Inference Gate complete","ok"))}function Oo(e,o){const t=ue(null,e,o.timerResolutionMs),s=De(e),n={benchmarkVersion:vt,runtimeSchemaVersion:kt,benchmarkEngine:bt,device:o,timestamp:new Date().toISOString(),buildId:globalThis.AETHER_BUILD_ID??"unknown",commit:globalThis.AETHER_COMMIT??"unknown",llmInference:s,certification:{timingIntegrity:t.timingIntegrity??"FAIL",throughputIntegrity:t.throughputIntegrity??"FAIL",correctnessIntegrity:t.correctnessIntegrity??"FAIL",llmSuiteComplete:t.llmSuiteComplete??"FAIL",memorySuiteComplete:t.memorySuiteComplete??"FAIL",overallCertified:t.overallCertified??!1,certificationStatus:t.certificationStatus??"NOT_CERTIFIED",reasons:t.certificationReasons??[]},selfAudit:t.selfAuditChecks??null,note:"WebGPU allocation capability, NOT total system RAM."},a=JSON.stringify(n,null,2),r=JSON.parse(a),i=Ge(r.llmInference,o.timerResolutionMs);i.ok||console.error("POST-EXPORT AUDIT FAILED",i.failures),pe("aether-v3-1-3-llm-gate.json",a,"application/json")}function Ro(e,o){const t=n=>n.map(a=>`| ${a.operation} | ${a.shape} | ${a.repetitions} | ${Y(a.blockMs)} | ${Y(a.estimatedPerOperationMs)} | ${a.totalFLOPs>0?a.totalFLOPs.toExponential(3):a.totalBytes>0?a.totalBytes+" B":"—"} | ${a.confidence} | ${me(a)} | ${a.correctnessPassed?"OK":"FAIL"} |`).join(`
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
${e.transformerBlocks.map(n=>`| ${n.config.name} | ${n.config.hidden} | ${n.config.intermediate} | ${n.config.layers} | ${n.config.heads} | ${n.config.kvHeads} | ${(n.paramCount/1e6).toFixed(1)}M | ${X(n.fp16Bytes/1048576)} | ${X(n.int8Bytes/1048576)} | ${X(n.int4Bytes/1048576)} | ${n.blockLatencyMs.toFixed(3)} | ${n.confidence} |`).join(`
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
`;pe("aether-v3-1-llm-report.md",s,"text/markdown")}async function Fo(e,o,t){try{const s=o();ve(wt());const{runLLMInferenceGate:n,runLLMInferenceGateQuick:a}=await le(async()=>{const{runLLMInferenceGate:l,runLLMInferenceGateQuick:u}=await Promise.resolve().then(()=>vo);return{runLLMInferenceGate:l,runLLMInferenceGateQuick:u}},void 0);t("AETHER V3.1.3 RUNTIME ACTIVE","info"),t(`buildId: ${globalThis.AETHER_BUILD_ID??"unknown"}`,"info"),t("llmSuite: ENABLED","info"),t("memorySuite: ENABLED","info"),t("normalizedResults: ENABLED","info"),t("postExportAudit: ENABLED","info");const r=await(e==="quick"?a:n)(l=>t(`V3.1: ${l}`,"info"));j=r;const{validateLLMGateIntegrity:i}=await le(async()=>{const{validateLLMGateIntegrity:l}=await Promise.resolve().then(()=>Ht);return{validateLLMGateIntegrity:l}},void 0),c=i(r);if(c.ok)t("V3.1 audit OK: normalization + throughput verified for LLM gate results.","ok");else{t(`V3.1 AUDIT FAILURES: ${c.issues.length}`,"err");for(const l of c.issues)t(`  - ${l.operation} ${l.workload}: ${l.detail}`,"err")}const d=await Et(s);No(r,d,t)}catch(s){t(`V3.1 ERROR: ${s.message}`,"err")}}export{Co as AETHER_V313_SENTINELS,j as _llmGateResults,Uo as buildLLMInferenceExport,ue as buildSelfAudit,No as renderLLMGate,Eo as renderV3Certification,Fo as runLLMGateFromUI,_o as runV3FromUI};
