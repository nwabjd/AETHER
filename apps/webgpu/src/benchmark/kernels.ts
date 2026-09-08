// AETHER GPU Benchmark — WGSL Compute Shaders
// All kernels operate on f32 storage buffers

// ─── Vector Addition: C = A + B ───

export const VEC_ADD = /* wgsl */ `
struct Uniforms { N: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> A: array<f32>;
@group(0) @binding(2) var<storage, read> B: array<f32>;
@group(0) @binding(3) var<storage, read_write> C: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= u.N) { return; }
  C[i] = A[i] + B[i];
}
`;

// ─── Matrix Multiplication: C = A × B ───

export const MATMUL = /* wgsl */ `
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
`;

// ─── 2D Convolution (simplified, 1 invocation per output pixel) ───

export const CONV2D = /* wgsl */ `
struct Uniforms { N: u32, C: u32, H: u32, W: u32, F: u32, FH: u32, FW: u32, OH: u32, OW: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> kernel: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(1, 1, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let n = gid.x;
  let f = gid.y;
  let out_pos = gid.z;
  let oh = out_pos / u.OW;
  let ow = out_pos % u.OW;

  if (n >= u.N || f >= u.F || oh >= u.OH || ow >= u.OW) { return; }

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
`;

// ─── Softmax (row-wise) - separate input/output ───

export const SOFTMAX = /* wgsl */ `
struct Uniforms { rows: u32, cols: u32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let row = gid.x;
  if (row >= u.rows) { return; }
  let base = row * u.cols;
  var max_val: f32 = -1e30;
  for (var j: u32 = 0u; j < u.cols; j++) {
    if (input[base + j] > max_val) { max_val = input[base + j]; }
  }
  var sum_exp: f32 = 0.0;
  for (var j: u32 = 0u; j < u.cols; j++) {
    let e = exp(input[base + j] - max_val);
    output[base + j] = e;
    sum_exp += e;
  }
  for (var j: u32 = 0u; j < u.cols; j++) {
    output[base + j] /= sum_exp;
  }
}
`;

// ─── SOFTMAX dispatch (single source of truth) ───
// The shared SOFTMAX shader above is `@workgroup_size(64)` and maps
// `gid.x` → `row` (one invocation per row). Therefore dispatch X must be
// `ceil(rows/64)`, NOT `rows`. Dispatching `[rows,1,1]` launches 64× the rows
// as invocations; invocations from different workgroups then own the SAME row
// (e.g. gid.x=0 and gid.x=64 both target row 0), racing on `output[...]`.

// TASK 5 — single source of truth. Every dispatch of the shared SOFTMAX
// pipeline must route through this helper.
export function softmaxWorkgroups(rows: number): [number, number, number] {
  const wgX = Math.max(1, Math.ceil(rows / 64));
  return [wgX, 1, 1];
}

export interface SoftmaxDispatchInfo {
  rows: number;
  workgroupSize: number;
  workgroupsX: number;
  totalInvocations: number;
}

// TASK 6 — the dispatch diagnostic (rows / workgroupSize / workgroupsX /
// totalInvocations) that makes an accidental 64× over-dispatch impossible to miss.
export function softmaxDispatchInfo(rows: number): SoftmaxDispatchInfo {
  const wgX = Math.max(1, Math.ceil(rows / 64));
  return { rows, workgroupSize: 64, workgroupsX: wgX, totalInvocations: wgX * 64 };
}

// TASK 7 — row-ownership assertion: totalInvocations must cover every row and
// leave every row owned by exactly one invocation (final partial workgroup OK).
export function assertSoftmaxDispatch(rows: number): SoftmaxDispatchInfo {
  const info = softmaxDispatchInfo(rows);
  if (!(info.totalInvocations >= info.rows && info.totalInvocations < info.rows + 64)) {
    throw new Error(
      `softmax dispatch invariant violated: rows=${info.rows} wgX=${info.workgroupsX} ` +
      `total=${info.totalInvocations} (expected ${info.rows} ≤ total < ${info.rows + 64})`
    );
  }
  return info;
}

// ─── RMSNorm - single-pass approach (for now) ───

export const RMS_NORM = /* wgsl */ `
struct Uniforms { N: u32, eps: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> input: array<f32>;
@group(0) @binding(2) var<storage, read> weight: array<f32>;
@group(0) @binding(3) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  var sum_sq: f32 = 0.0;
  for (var j: u32 = 0u; j < u.N; j++) {
    sum_sq += input[j] * input[j];
  }
  let rms = sqrt(sum_sq / f32(u.N) + u.eps);
  for (var j: u32 = 0u; j < u.N; j++) {
    output[j] = (input[j] / rms) * weight[j];
  }
}
`;

// ─── Scaled Dot-Product Attention (row-parallel correctness kernel) ───
// FIX: The previous single-threaded @workgroup_size(1) monolith caused the
// GPU to stall/skip later rows on iOS Safari, leaving stale buffer content
// in the output (observed as 64.0 at row 128 of seq=256 from reused
// MatMul-128 output memory). Row-parallelism ensures every row is an
// independent invocation.

// TASK 8/17 — sentinel used to prove every output row was written. Correctness
// buffers are pre-filled with it before dispatch; any leftover after execution
// means that output row/region was never written (buffer reuse / partial
// dispatch), never a legitimate computed result (computed values ≈ 0.1–n).
export const ATTENTION_OUTPUT_SENTINEL = -12345.0;

export const ATTENTION = /* wgsl */ `
struct Uniforms { batch: u32, seq: u32, dim: u32, scale: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var<storage, read> Q: array<f32>;
@group(0) @binding(2) var<storage, read> K: array<f32>;
@group(0) @binding(3) var<storage, read> V: array<f32>;
@group(0) @binding(4) var<storage, read_write> out: array<f32>;
@group(0) @binding(5) var<storage, read_write> scores: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let totalRows = u.batch * u.seq;
  let rowIndex = gid.x;
  if (rowIndex >= totalRows) { return; }

  let b = rowIndex / u.seq;
  let i = rowIndex % u.seq;
  let base = b * u.seq * u.seq + i * u.seq;

  var max_val: f32 = -1e30;
  for (var j = 0u; j < u.seq; j++) {
    var dot: f32 = 0.0;
    for (var d = 0u; d < u.dim; d++) {
      dot += Q[(b * u.seq + i) * u.dim + d] * K[(b * u.seq + j) * u.dim + d];
    }
    let s = dot * u.scale;
    scores[base + j] = s;
    if (s > max_val) { max_val = s; }
  }

  var sum_exp: f32 = 0.0;
  for (var j = 0u; j < u.seq; j++) {
    let e = exp(scores[base + j] - max_val);
    scores[base + j] = e;
    sum_exp += e;
  }
  for (var j = 0u; j < u.seq; j++) {
    scores[base + j] /= sum_exp;
  }

  for (var d = 0u; d < u.dim; d++) {
    var sum: f32 = 0.0;
    for (var j = 0u; j < u.seq; j++) {
      sum += scores[base + j] * V[(b * u.seq + j) * u.dim + d];
    }
    out[(b * u.seq + i) * u.dim + d] = sum;
  }
}
`;
