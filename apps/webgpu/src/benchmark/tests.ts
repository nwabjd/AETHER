// AETHER GPU Benchmark — Kernel Correctness Tests
// Every kernel is validated against a pure CPU reference on the shared AETHER
// device: create -> execute -> readback -> validate -> destroy, strictly one
// GPU test at a time. Each test runs its configurations sequentially, and a
// failing configuration aborts the remaining ones for that kernel.

import {
  getDevice,
  hasDeviceLost,
  createUniformBuffer,
  createStorageBuffer,
  createPipeline,
  createBindGroupForPipeline,
} from './engine';
import {
  VEC_ADD, MATMUL, CONV2D, SOFTMAX, RMS_NORM, ATTENTION, ATTENTION_OUTPUT_SENTINEL,
  softmaxWorkgroups, softmaxDispatchInfo,
} from './kernels';
import {
  VEC_ADD_BINDINGS, MATMUL_BINDINGS, CONV2D_BINDINGS,
  SOFTMAX_BINDINGS, RMS_NORM_BINDINGS, ATTENTION_BINDINGS,
} from './bindings';
import type { StorageAccess } from './layout';
import { runGpuTest } from './gpu-test';
import {
  cpuVecAdd, cpuMatmul, cpuConv2D, cpuSoftmax, cpuRMSNorm, cpuAttention,
} from './cpu-refs';
import { analyzeNumeric, rowSums, type NumericInfo } from './numeric';
import {
  createVecAddUniform,
  createMatmulUniform,
  createConv2DUniform,
  createSoftmaxUniform,
  createRMSNormUniform,
  createAttentionUniform,
  logAttentionUniformDiagnostic,
} from './uniforms';

// ─── Result shapes ───

export interface KernelCaseResult {
  config: string;
  pass: boolean;
  stage: string;
  errorType: string | null;
  errorMessage: string | null;
  maxError: number;
  errorIndex: number;
  cpuValue: number | null;
  gpuValue: number | null;
  expectedRange: [number, number] | null;
  actualRange: [number, number] | null;
  nonFiniteIndex: number;
  pipelineDeviceId?: number | null;
  executionDeviceId?: number;
  bindGroupDeviceId?: number | null;
  mismatch?: boolean;
  // Row-coverage / unwritten-output diagnostics (attention correctness, TASK 8–10).
  rowsExpected?: number;
  rowsCovered?: number;
  firstMissingRow?: number | null;
  sentinelCount?: number;
  firstSentinelIndex?: number | null;
  lastSentinelIndex?: number | null;
}

export interface TestResult {
  name: string;
  pass: boolean;
  maxError: number;
  details: string;
  cases: KernelCaseResult[];
}

export interface SuiteReportEntry {
  pass: boolean;
  maxError: number;
  cases: KernelCaseResult[];
}

export interface SuiteReport {
  device: {
    webgpuAvailable: boolean;
    adapterName: string;
    adapterVendor: string;
    adapterDevice: string;
    fallbackAdapter: boolean;
  };
  build: { id: string; commit: string | null; time: string | null };
  timestamp: string;
  uncapturedErrors: string[];
  tests: Record<'vectorAdd' | 'matmul' | 'conv2d' | 'softmax' | 'rmsNorm' | 'attention', SuiteReportEntry>;
  allPass: boolean;
}

// ─── GPU error capture (uncaptured + device-lost diagnostics) ───

const _uncaptured: string[] = [];
let _collectorInstalled = false;

export function installUncapturedCollector(): void {
  if (_collectorInstalled) return;
  try {
    const device = getDevice();
    device.addEventListener('uncapturederror', (ev) => {
      const err = (ev as unknown as { error?: GPUError }).error;
      if (err) _uncaptured.push(err.message);
    });
    _collectorInstalled = true;
  } catch {
    // Device not initialized yet; will be installed before the suite runs.
  }
}

export function drainUncaptured(): string[] {
  const out = _uncaptured.slice();
  _uncaptured.length = 0;
  return out;
}

// ─── Shared helpers ───

function makeBuf(data: Float32Array): GPUBuffer {
  return createStorageBuffer(data.byteLength, data);
}

function failedCase(config: string, stage: string, errorType: string, errorMessage: string): KernelCaseResult {
  return {
    config, pass: false, stage, errorType, errorMessage,
    maxError: -1, errorIndex: -1, cpuValue: null, gpuValue: null,
    expectedRange: null, actualRange: null, nonFiniteIndex: -1,
  };
}

interface RunCaseOptions {
  name: string;
  config: string;
  code: string;
  bindingTypes: readonly StorageAccess[];
  workgroups: [number, number, number];
  entries: GPUBindGroupEntry[];
  outputBuffer: GPUBuffer;
  outputBytes: number;
  dispose: () => void;
  reference: Float32Array;
  tolerance: number;
  extraCheck?: (gpu: Float32Array) => string | null;
  // TASK 8–10: async post-readback check (row coverage / sentinel scan).
  postValidate?: (gpu: Float32Array) => Promise<{ error: string | null; diag?: Partial<KernelCaseResult> }>;
}

// Executes one kernel configuration on the shared AETHER device with exact
// stage tracking (pipeline, bind-group, encode, dispatch, submit, readback,
// validation) and captures validation/out-of-memory/internal/exception
// failures. Buffers created for the case are always destroyed afterwards.
async function runComputeCase(o: RunCaseOptions): Promise<KernelCaseResult> {
  // TASK 2 — capture the EXACT device before creating the pipeline, bind group
  // and (via the shared factories which resolve to the same object) buffers.
  // runGpuTest receives this same object; execution cannot drift to another
  // GPUDevice.
  const device = getDevice();
  let gpu: Float32Array | null = null;
  let stage = 'pipeline';
  let errorType: string | null = null;
  let errorMessage: string | null = null;

  try {
    stage = 'pipeline';
    const pipeline = createPipeline(o.code, o.bindingTypes);

    stage = 'bind-group';
    const bg = createBindGroupForPipeline(pipeline, o.bindingTypes, o.entries);

    const outcome = await runGpuTest(device, {
      name: o.name,
      pipeline,
      bindGroup: bg,
      workgroups: o.workgroups,
      outputBuffer: o.outputBuffer,
      outputBytes: o.outputBytes,
      validator: (data) => {
        gpu = data;
        return { pass: true, error: '' };
      },
    });

    stage = outcome.stage;
    if (!outcome.pass) {
      return {
        ...failedCase(o.config, stage, outcome.errorType ?? 'gpu-error', outcome.error ?? 'GPU execution failed'),
        pipelineDeviceId: outcome.pipelineDeviceId,
        executionDeviceId: outcome.executionDeviceId,
        bindGroupDeviceId: outcome.bindGroupDeviceId,
        mismatch: outcome.mismatch,
      };
    }
    if (gpu === null) throw new Error('GPU returned no data after readback');

    stage = 'validation';
    const num: NumericInfo = analyzeNumeric(gpu, o.reference, o.tolerance);
    const extraErr = o.extraCheck ? o.extraCheck(gpu) : null;
    let postErr: string | null = null;
    let postDiag: Partial<KernelCaseResult> = {};
    if (o.postValidate) {
      try {
        const p = await o.postValidate(gpu);
        postErr = p.error;
        postDiag = p.diag ?? {};
      } catch (e) {
        postErr = (e as Error).message;
      }
    }
    const pass = num.pass && extraErr === null && postErr === null;

    if (!pass) {
      if (postErr !== null) {
        errorType = 'output-incomplete';
        errorMessage = postErr;
      } else if (!num.allFinite) {
        errorType = 'non-finite';
        errorMessage = `non-finite output at index ${num.nonFiniteIndex}`;
      } else if (num.lengthMismatch) {
        errorType = 'shape-mismatch';
        errorMessage = `GPU length ${(gpu as Float32Array).length} != CPU reference length ${o.reference.length}`;
      } else if (!num.pass) {
        errorType = 'output-mismatch';
        errorMessage =
          `max abs error ${num.maxError.toExponential(3)} at index ${num.errorIndex} ` +
          `(cpu ${num.cpuValue?.toExponential(4) ?? 'n/a'}, gpu ${num.gpuValue?.toExponential(4) ?? 'n/a'})`;
      } else {
        errorType = 'constraint';
        errorMessage = extraErr ?? 'output constraint violated';
      }
    }

    return {
      config: o.config,
      pass,
      stage: pass ? 'complete' : 'validation',
      errorType: pass ? null : errorType,
      errorMessage: pass ? null : errorMessage,
      maxError: num.maxError,
      errorIndex: num.errorIndex,
      cpuValue: num.cpuValue,
      gpuValue: num.gpuValue,
      expectedRange: num.expectedRange,
      actualRange: num.actualRange,
      nonFiniteIndex: num.nonFiniteIndex,
      pipelineDeviceId: outcome.pipelineDeviceId,
      executionDeviceId: outcome.executionDeviceId,
      bindGroupDeviceId: outcome.bindGroupDeviceId,
      mismatch: outcome.mismatch,
      ...postDiag,
    };
  } catch (e) {
    return failedCase(o.config, stage, errorType ?? 'exception', errorMessage ?? (e as Error).message);
  } finally {
    try {
      o.dispose();
    } catch {
      // Best-effort cleanup; never mask the real result.
    }
  }
}

function summarize(name: string, cases: KernelCaseResult[]): TestResult {
  const pass = cases.length > 0 && cases.every((c) => c.pass);
  const maxError = cases.reduce((m, c) => Math.max(m, c.maxError), 0);
  const details = cases.map((c) => `${c.config}:${c.pass ? 'PASS' : 'FAIL'}`).join(' ');
  return { name, pass, maxError: pass ? maxError : -1, details, cases };
}

// ─── Vector Add ───
// A = 1, B = 2, expected C = 3. N = 64, then 1024, then 65536.

async function vecAddCase(N: number): Promise<KernelCaseResult> {
  const A = new Float32Array(N).fill(1.0);
  const B = new Float32Array(N).fill(2.0);
  const bufA = makeBuf(A);
  const bufB = makeBuf(B);
  const bufC = createStorageBuffer(N * 4);
  const uBuf = createUniformBuffer(createVecAddUniform(N));

  return runComputeCase({
    name: 'VecAdd',
    config: `N=${N}`,
    code: VEC_ADD,
    bindingTypes: VEC_ADD_BINDINGS,
    workgroups: [Math.ceil(N / 64), 1, 1],
    entries: [
      { binding: 0, resource: { buffer: uBuf } },
      { binding: 1, resource: { buffer: bufA } },
      { binding: 2, resource: { buffer: bufB } },
      { binding: 3, resource: { buffer: bufC } },
    ],
    outputBuffer: bufC,
    outputBytes: N * 4,
    reference: cpuVecAdd(A, B),
    tolerance: 1e-5,
    dispose: () => { bufA.destroy(); bufB.destroy(); bufC.destroy(); uBuf.destroy(); },
  });
}

export async function testVecAdd(): Promise<TestResult> {
  const cases: KernelCaseResult[] = [];
  for (const N of [64, 1024, 65536]) {
    cases.push(await vecAddCase(N));
    if (!cases[cases.length - 1].pass) break; // only proceed after N=64 (then each) passes
  }
  return summarize('VecAdd', cases);
}

// ─── Matrix Multiplication (known-good shader, unchanged) ───
// A = 1.0, B = 0.5 diagonally-consistent: C[row*N+i] = Σ_k 1.0*0.5*K.
// 32×32, 64×64, 128×128.

async function matmulCase(N: number): Promise<KernelCaseResult> {
  const A = new Float32Array(N * N).fill(1.0);
  const B = new Float32Array(N * N).fill(0.5);
  const bufA = makeBuf(A);
  const bufB = makeBuf(B);
  const bufC = createStorageBuffer(N * N * 4);
  const uBuf = createUniformBuffer(createMatmulUniform(N, N, N));

  return runComputeCase({
    name: 'Matmul',
    config: `${N}×${N}`,
    code: MATMUL,
    bindingTypes: MATMUL_BINDINGS,
    workgroups: [Math.ceil(N / 16), Math.ceil(N / 16), 1],
    entries: [
      { binding: 0, resource: { buffer: uBuf } },
      { binding: 1, resource: { buffer: bufA } },
      { binding: 2, resource: { buffer: bufB } },
      { binding: 3, resource: { buffer: bufC } },
    ],
    outputBuffer: bufC,
    outputBytes: N * N * 4,
    reference: cpuMatmul(A, B, N, N, N),
    tolerance: 1e-3,
    dispose: () => { bufA.destroy(); bufB.destroy(); bufC.destroy(); uBuf.destroy(); },
  });
}

export async function testMatmul(): Promise<TestResult> {
  const cases: KernelCaseResult[] = [];
  for (const N of [32, 64, 128]) {
    cases.push(await matmulCase(N));
    if (!cases[cases.length - 1].pass) break;
  }
  return summarize('Matmul', cases);
}

// ─── Conv2D ───
// Case 1: N=1 C=1 H=5 W=5 F=1 FH=3 FW=3, input 1..25, kernel columns
// [1,0,-1]. Expected 3×3 output.
// Case 2: channel indexing check with C=2.

function convData(caseNum: number): {
  config: string;
  N: number; C: number; H: number; W: number; F: number; FH: number; FW: number;
  input: Float32Array; kernel: Float32Array;
} {
  if (caseNum === 1) {
    const N = 1, C = 1, H = 5, W = 5, F = 1, FH = 3, FW = 3;
    const input = new Float32Array(N * C * H * W);
    for (let i = 0; i < input.length; i++) input[i] = i + 1;
    const kernel = new Float32Array([1, 0, -1, 1, 0, -1, 1, 0, -1]);
    return { config: '5×5→3×3', N, C, H, W, F, FH, FW, input, kernel };
  }
  const N = 1, C = 2, H = 3, W = 3, F = 1, FH = 2, FW = 2;
  const input = new Float32Array(N * C * H * W);
  for (let i = 0; i < input.length; i++) input[i] = i + 1;
  const kernel = new Float32Array(F * C * FH * FW).fill(1.0);
  return { config: 'C=2 (channel indexing)', N, C, H, W, F, FH, FW, input, kernel };
}

async function conv2dCase(caseNum: number): Promise<KernelCaseResult> {
  const d = convData(caseNum);
  const { N, C, H, W, F, FH, FW } = d;
  const OH = H - FH + 1;
  const OW = W - FW + 1;
  const outputBytes = N * F * OH * OW * 4;

  const bufIn = makeBuf(d.input);
  const bufK = makeBuf(d.kernel);
  const bufOut = createStorageBuffer(outputBytes);
  const uBuf = createUniformBuffer(createConv2DUniform(N, C, H, W, F, FH, FW, OH, OW));

  return runComputeCase({
    name: 'Conv2D',
    config: d.config,
    code: CONV2D,
    bindingTypes: CONV2D_BINDINGS,
    workgroups: [N, F, OH * OW],
    entries: [
      { binding: 0, resource: { buffer: uBuf } },
      { binding: 1, resource: { buffer: bufIn } },
      { binding: 2, resource: { buffer: bufK } },
      { binding: 3, resource: { buffer: bufOut } },
    ],
    outputBuffer: bufOut,
    outputBytes,
    reference: cpuConv2D(d.input, d.kernel, N, C, H, W, F, FH, FW),
    tolerance: 1e-4,
    dispose: () => { bufIn.destroy(); bufK.destroy(); bufOut.destroy(); uBuf.destroy(); },
  });
}

export async function testConv2D(): Promise<TestResult> {
  const cases: KernelCaseResult[] = [];
  for (const caseNum of [1, 2]) {
    cases.push(await conv2dCase(caseNum));
    if (!cases[cases.length - 1].pass) break;
  }
  return summarize('Conv2D', cases);
}

// ─── Softmax (stable, separate input/output buffers) ───
// rows=2 cols=5 fixed input, then rows=4 cols=16 deterministic.

function softmaxData(caseNum: number): { rows: number; cols: number; data: Float32Array } {
  if (caseNum === 1) {
    return {
      rows: 2, cols: 5,
      data: new Float32Array([-2, -1, 0, 1, 2, 2, 1, 0, -1, -2]),
    };
  }
  const rows = 4, cols = 16;
  const data = new Float32Array(rows * cols);
  for (let i = 0; i < data.length; i++) data[i] = (i % cols) * 0.1 - 1;
  return { rows, cols, data };
}

async function softmaxCase(caseNum: number): Promise<KernelCaseResult> {
  const d = softmaxData(caseNum);
  const rows = d.rows, cols = d.cols;
  const bytes = d.data.byteLength;
  const diag = softmaxDispatchInfo(rows);

  const bufIn = createStorageBuffer(bytes, d.data);
  const bufOut = createStorageBuffer(bytes);
  const uBuf = createUniformBuffer(createSoftmaxUniform(rows, cols));

  return runComputeCase({
    name: 'Softmax',
    config: `${rows}×${cols} (wgX=${diag.workgroupsX}, total=${diag.totalInvocations})`,
    code: SOFTMAX,
    bindingTypes: SOFTMAX_BINDINGS,
    workgroups: softmaxWorkgroups(rows),
    entries: [
      { binding: 0, resource: { buffer: uBuf } },
      { binding: 1, resource: { buffer: bufIn } },
      { binding: 2, resource: { buffer: bufOut } },
    ],
    outputBuffer: bufOut,
    outputBytes: bytes,
    reference: cpuSoftmax(d.data, rows, cols),
    tolerance: 1e-4,
    extraCheck: (gpu) => {
      for (let i = 0; i < gpu.length; i++) {
        if (gpu[i] < -1e-6) return `negative softmax output ${gpu[i].toExponential(3)} at index ${i}`;
      }
      const sums = rowSums(gpu, rows, cols);
      for (let r = 0; r < rows; r++) {
        if (Math.abs(sums[r] - 1) > 1e-4) return `row ${r} sums to ${sums[r].toExponential(3)} (expected ≈ 1)`;
      }
      return null;
    },
    dispose: () => { bufIn.destroy(); bufOut.destroy(); uBuf.destroy(); },
  });
}

export async function testSoftmax(): Promise<TestResult> {
  const cases: KernelCaseResult[] = [];
  for (const caseNum of [1, 2]) {
    cases.push(await softmaxCase(caseNum));
    if (!cases[cases.length - 1].pass) break;
  }
  return summarize('Softmax', cases);
}

// ─── RMSNorm (separate input/output buffers) ───
// N=8 fixed input/ones weight, then N=128 deterministic.

function rmsData(caseNum: number): { N: number; input: Float32Array; weight: Float32Array; eps: number } {
  if (caseNum === 1) {
    return {
      N: 8,
      input: new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]),
      weight: new Float32Array(8).fill(1.0),
      eps: 1e-6,
    };
  }
  const N = 128;
  const input = new Float32Array(N);
  for (let i = 0; i < N; i++) input[i] = ((i * 37) % 11) * 0.5 + 0.1;
  return { N, input, weight: new Float32Array(N).fill(1.0), eps: 1e-6 };
}

async function rmsNormCase(caseNum: number): Promise<KernelCaseResult> {
  const d = rmsData(caseNum);
  const N = d.N;

  const bufIn = makeBuf(d.input);
  const bufW = makeBuf(d.weight);
  const bufOut = createStorageBuffer(N * 4);
  const uBuf = createUniformBuffer(createRMSNormUniform(N, d.eps));

  return runComputeCase({
    name: 'RMSNorm',
    config: `N=${N}`,
    code: RMS_NORM,
    bindingTypes: RMS_NORM_BINDINGS,
    workgroups: [1, 1, 1],
    entries: [
      { binding: 0, resource: { buffer: uBuf } },
      { binding: 1, resource: { buffer: bufIn } },
      { binding: 2, resource: { buffer: bufW } },
      { binding: 3, resource: { buffer: bufOut } },
    ],
    outputBuffer: bufOut,
    outputBytes: N * 4,
    reference: cpuRMSNorm(d.input, d.weight, d.eps),
    tolerance: 1e-3,
    dispose: () => { bufIn.destroy(); bufW.destroy(); bufOut.destroy(); uBuf.destroy(); },
  });
}

export async function testRMSNorm(): Promise<TestResult> {
  const cases: KernelCaseResult[] = [];
  for (const caseNum of [1, 2]) {
    cases.push(await rmsNormCase(caseNum));
    if (!cases[cases.length - 1].pass) break;
  }
  return summarize('RMSNorm', cases);
}

// ─── Scaled Dot-Product Attention (Monolithic & Phase Checks) ───

// TASK 3 — row-parallel dispatch: ceil(batch*seq/64) workgroups, 64 invocations
// each, one invocation per output row.
function attentionWorkgroups(batch: number, seq: number): [number, number, number] {
  return [Math.max(1, Math.ceil((batch * seq) / 64)), 1, 1];
}

// TASK 8 / TASK 17 — correctness-only output initialization. Every attention
// buffer is pre-filled with a sentinel before dispatch. Any element still equal
// to the sentinel after execution proves that output row was never written
// (buffer reuse / partial dispatch), because computed values never approach it.
// (ATTENTION_OUTPUT_SENTINEL defined in kernels.ts alongside ATTENTION.)

// TASK 9 / TASK 10 — row coverage + unwritten-output diagnostics. Uses the
// sentinel readback (rather than a separate GPU buffer) so coverage and
// unwritten-output are proven directly from the actual kernel output.
interface CoverageStats {
  rowsExpected: number;
  rowsCovered: number;
  firstMissingRow: number | null;
  sentinelCount: number;
  firstSentinelIndex: number | null;
  lastSentinelIndex: number | null;
}

function attentionCoverage(gpu: Float32Array, rows: number, dim: number): CoverageStats {
  let sentinelCount = 0;
  let firstSentinelIndex: number | null = null;
  let lastSentinelIndex: number | null = null;
  const rowHasSentinel = new Array<boolean>(rows).fill(false);
  for (let idx = 0; idx < gpu.length; idx++) {
    if (gpu[idx] === ATTENTION_OUTPUT_SENTINEL) {
      sentinelCount++;
      if (firstSentinelIndex === null) firstSentinelIndex = idx;
      lastSentinelIndex = idx;
      rowHasSentinel[Math.floor(idx / dim)] = true;
    }
  }
  let rowsCovered = 0;
  let firstMissingRow: number | null = null;
  for (let r = 0; r < rows; r++) {
    if (!rowHasSentinel[r]) rowsCovered++;
    else if (firstMissingRow === null) firstMissingRow = r;
  }
  return { rowsExpected: rows, rowsCovered, firstMissingRow, sentinelCount, firstSentinelIndex, lastSentinelIndex };
}

function attentionPostValidate(batch: number, seq: number, dim: number): RunCaseOptions['postValidate'] {
  return async (gpu) => {
    const c = attentionCoverage(gpu, batch * seq, dim);
    const diag: Partial<KernelCaseResult> = {
      rowsExpected: c.rowsExpected,
      rowsCovered: c.rowsCovered,
      firstMissingRow: c.firstMissingRow,
      sentinelCount: c.sentinelCount,
      firstSentinelIndex: c.firstSentinelIndex,
      lastSentinelIndex: c.lastSentinelIndex,
    };
    let error: string | null = null;
    if (c.sentinelCount > 0) {
      error =
        `UNWRITTEN ATTENTION OUTPUT — ${c.sentinelCount} sentinel(s) remain ` +
        `(first @ ${c.firstSentinelIndex}, last @ ${c.lastSentinelIndex}) — ` +
        `rows covered ${c.rowsCovered}/${c.rowsExpected}` +
        (c.firstMissingRow !== null ? `, first missing row ${c.firstMissingRow}` : '');
    }
    return { error, diag };
  };
}

// TASK 6 — verify shader compilation BEFORE any attention execution. A
// compilation error fails the case at the "shader-compilation" stage.
async function shaderCompilationError(code: string): Promise<string | null> {
  const device = getDevice();
  const module = device.createShaderModule({ code });
  if (typeof module.getCompilationInfo !== 'function') return null;
  let info: GPUCompilationInfo;
  try {
    info = await module.getCompilationInfo();
  } catch (e) {
    return `getCompilationInfo failed: ${(e as Error).message}`;
  }
  const errors = info.messages.filter((m) => m.type === 'error');
  if (errors.length === 0) return null;
  return errors.map((m) => `[line ${m.lineNum}:${m.linePos}] ${m.message}`).join(' | ');
}

export async function attentionSimpleCase(): Promise<KernelCaseResult> {
  const batch = 1;
  const seq = 4;
  const dim = 4;
  const scale = 0.5;

  const Q = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  const K = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  const V = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

  const qkv = batch * seq * dim;
  const scores = batch * seq * seq;

  const uData = createAttentionUniform(batch, seq, dim, scale);
  const uniformErr = logAttentionUniformDiagnostic(uData, { batch, seq, dim, scale });
  if (uniformErr) {
    return failedCase(`Attention 4x4 Identity (b${batch}-s${seq}-d${dim})`, 'uniform', 'uniform-packing', uniformErr);
  }

  const compileErr = await shaderCompilationError(ATTENTION);
  if (compileErr) {
    return failedCase(`Attention 4x4 Identity (b${batch}-s${seq}-d${dim})`, 'shader-compilation', 'shader-compilation', compileErr);
  }

  const bufQ = makeBuf(Q);
  const bufK = makeBuf(K);
  const bufV = makeBuf(V);
  // TASK 17 — pre-fill output with sentinel; any leftover proves unwritten rows.
  const bufOut = createStorageBuffer(qkv * 4, new Float32Array(qkv).fill(ATTENTION_OUTPUT_SENTINEL));
  const bufScores = createStorageBuffer(scores * 4);
  const uBuf = createUniformBuffer(uData);

  return runComputeCase({
    name: 'Attention',
    config: `4x4 Identity (b${batch}-s${seq}-d${dim})`,
    code: ATTENTION,
    bindingTypes: ATTENTION_BINDINGS,
    workgroups: attentionWorkgroups(batch, seq),
    entries: [
      { binding: 0, resource: { buffer: uBuf } },
      { binding: 1, resource: { buffer: bufQ } },
      { binding: 2, resource: { buffer: bufK } },
      { binding: 3, resource: { buffer: bufV } },
      { binding: 4, resource: { buffer: bufOut } },
      { binding: 5, resource: { buffer: bufScores } },
    ],
    outputBuffer: bufOut,
    outputBytes: qkv * 4,
    reference: cpuAttention(Q, K, V, batch, seq, dim, scale),
    tolerance: 1e-3,
    postValidate: attentionPostValidate(batch, seq, dim),
    dispose: () => {
      bufQ.destroy(); bufK.destroy(); bufV.destroy();
      bufOut.destroy(); bufScores.destroy(); uBuf.destroy();
    },
  });
}

export async function attentionSeqCase(seq: number): Promise<KernelCaseResult> {
  const batch = 1;
  const dim = 64;
  const scale = 1 / Math.sqrt(dim);
  const makeVals = () => {
    const a = new Float32Array(batch * seq * dim);
    for (let i = 0; i < a.length; i++) a[i] = (i % dim + 1) * 0.1;
    return a;
  };
  const Q = makeVals();
  const K = makeVals();
  const V = makeVals();

  const qkv = batch * seq * dim;
  const scores = batch * seq * seq;

  const uData = createAttentionUniform(batch, seq, dim, scale);
  const uniformErr = logAttentionUniformDiagnostic(uData, { batch, seq, dim, scale });
  if (uniformErr) {
    return failedCase(`Attention b${batch}-s${seq}-d${dim}`, 'uniform', 'uniform-packing', uniformErr);
  }

  const compileErr = await shaderCompilationError(ATTENTION);
  if (compileErr) {
    return failedCase(`Attention b${batch}-s${seq}-d${dim}`, 'shader-compilation', 'shader-compilation', compileErr);
  }

  const bufQ = makeBuf(Q);
  const bufK = makeBuf(K);
  const bufV = makeBuf(V);
  // TASK 17 — pre-fill output with sentinel; any leftover proves unwritten rows.
  const bufOut = createStorageBuffer(qkv * 4, new Float32Array(qkv).fill(ATTENTION_OUTPUT_SENTINEL));
  const bufScores = createStorageBuffer(scores * 4);
  const uBuf = createUniformBuffer(uData);

  return runComputeCase({
    name: 'Attention',
    config: `b${batch}-s${seq}-d${dim}`,
    code: ATTENTION,
    bindingTypes: ATTENTION_BINDINGS,
    workgroups: attentionWorkgroups(batch, seq),
    entries: [
      { binding: 0, resource: { buffer: uBuf } },
      { binding: 1, resource: { buffer: bufQ } },
      { binding: 2, resource: { buffer: bufK } },
      { binding: 3, resource: { buffer: bufV } },
      { binding: 4, resource: { buffer: bufOut } },
      { binding: 5, resource: { buffer: bufScores } },
    ],
    outputBuffer: bufOut,
    outputBytes: qkv * 4,
    reference: cpuAttention(Q, K, V, batch, seq, dim, scale),
    tolerance: 1e-3,
    postValidate: attentionPostValidate(batch, seq, dim),
    dispose: () => {
      bufQ.destroy(); bufK.destroy(); bufV.destroy();
      bufOut.destroy(); bufScores.destroy(); uBuf.destroy();
    },
  });
}

export async function testAttention(): Promise<TestResult> {
  const cases: KernelCaseResult[] = [];
  cases.push(await attentionSimpleCase());
  if (!cases[cases.length - 1].pass) return summarize('Attention', cases);

  for (const seq of [4, 16, 64, 128, 256]) {
    cases.push(await attentionSeqCase(seq));
    if (!cases[cases.length - 1].pass) break;
  }
  return summarize('Attention', cases);
}

// ─── Full suite (sequential, one GPU test at a time) ───

interface SuiteTest {
  key: keyof SuiteReport['tests'];
  name: string;
  fn: () => Promise<TestResult>;
}

export async function runAllTests(onTest?: (result: TestResult) => void): Promise<TestResult[]> {
  installUncapturedCollector();
  const tests: SuiteTest[] = [
    { key: 'vectorAdd', name: 'VecAdd', fn: testVecAdd },
    { key: 'matmul', name: 'Matmul', fn: testMatmul },
    { key: 'conv2d', name: 'Conv2D', fn: testConv2D },
    { key: 'softmax', name: 'Softmax', fn: testSoftmax },
    { key: 'rmsNorm', name: 'RMSNorm', fn: testRMSNorm },
    { key: 'attention', name: 'Attention', fn: testAttention },
  ];

  const results: TestResult[] = [];
  for (const t of tests) {
    if (hasDeviceLost()) {
      results.push({ name: t.name, pass: false, maxError: -1, details: 'ABORTED — device lost', cases: [] });
      break;
    }
    const result = await t.fn();
    results.push(result);
    onTest?.(result);
    if (hasDeviceLost()) break;
  }
  return results;
}