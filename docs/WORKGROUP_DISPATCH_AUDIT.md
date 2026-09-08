# Workgroup Dispatch Audit

Every WebGPU kernel maps `global_invocation_id` to a logical row/column/slice in a
specific way. The **dispatch dimensions** for that pipeline must match that mapping,
otherwise rows are either left unwritten or — worse — written by many invocations at
once (a cross-workgroup data race that produces non-deterministic, silently-wrong
output). This doc is the single audit trail for every dispatch site in the benchmark.

Rule of thumb for this audit:

- Kernel maps `gid.x` → row (e.g. `let row = gid.x`) with `@workgroup_size(W)`:
  dispatch X must be `ceil(rows / W)`, NOT `rows`.
- Kernel maps `gid.x` → row, `gid.y` → batch (and `gid.z` → depth): dispatch
  `[ceil(rows / W), batch, ...]`.
- Kernel intentionally runs one invocation per output element (workgroup is just a
  batching container, e.g. MatMul `@workgroup_size(8, 8)` with threads mapped by
  `local_invocation_id` inside a tiled loop): dispatch `[..., elementCount, ...]`
  is correct there.

## Hot-fix history

- `76b4675` — row-parallel ATTENTION: kernel rewritten so one invocation owns one
  output row (`rowIndex = gid.x`, `@workgroup_size(64)`), dispatch changed from
  `Math.ceil(batch / 64)` × `seq` to `Math.ceil(batch * seq / 64)` in X.
  Monolithic attention then passed correctness through seq=256 on device.
- Phase-split Softmax had the same class of bug: the shared `SOFTMAX` kernel is
  `@workgroup_size(64)` with `row = gid.x`, but the phase benchmark dispatched
  `[seq, 1, 1]`. At seq=256 that is 256 workgroups × 64 invocations = 16,384
  invocations for 256 rows → 64 concurrent writers per row → data race
  (`attention.softmax seq=256: phase correctness check failed, maxErr ≈ 1.27e-1`).
  Fixed by routing every SOFTMAX dispatch through `softmaxWorkgroups(rows)`.

## Audit table (benchmark sources)

| Kernel | WGSL mapping | Dispatch X | Dispatch Y/Z | Site | Verdict |
|---|---|---|---|---|---|
| `VEC_ADD` | `gid.x = element` | `Math.ceil(N / 256)` | 1/1 | `bench-vecadd.ts` | correct |
| `MATMUL` | 1 invocation per output cell | `Math.ceil(N / 8)` | N/8, 1 | `bench-matmul.ts` | correct |
| `CONV2D` | `gid.x = N`, `gid.y = F`, `gid.z = out px` | N | F, OH*OW | `bench-conv2d.ts` | correct |
| `RMS_NORM` | single invocation, serial loop | 1 | 1/1 | `bench-rmsnorm.ts` | correct |
| `SOFTMAX` | `gid.x = row`, `@workgroup_size(64)` | **`ceil(rows / 64)`** | 1/1 | `softmaxWorkgroups()` | FIXED |
| `ATTENTION` (monolithic) | `rowIndex = gid.x`, `@workgroup_size(64)` | `ceil(batch*seq / 64)` | 1/1 | `attentionWorkgroups()` | correct |
| `ATTN_QKT` | `gid.x = i(row)`, `gid.y = b` | `ceil(seq / 64)` | batch | `perf-kernels.ts` | correct |
| `ATTN_SOFT` (phase) | `gid.x = row`, `@workgroup_size(64)` | **`ceil(seq / 64)`** | 1 | `softmaxWorkgroups()` | FIXED |
| `ATTN_PV` | `gid.x = i`, `gid.y = d`, `gid.z = b` | `ceil(seq / 64)` | dim, batch | `perf-kernels.ts` | correct |

## Source of truth (never hand-write these counts)

- `softmaxWorkgroups(rows)` → `[max(1, ceil(rows/64)), 1, 1]`.
- `softmaxDispatchInfo(rows)` → diagnostic `{rows, workgroupSize, workgroupsX,
  totalInvocations}`.
- `assertSoftmaxDispatch(rows)` → throws unless
  `rows ≤ totalInvocations < rows + 64` (proves 1:1 row ownership).
- `attentionWorkgroups(batch, seq)` → `[max(1, ceil(batch*seq/64)), 1, 1]`.

Rules enforced by regression-layout.test.ts:

- `SOFTMAX` WGSL must keep `@workgroup_size(64)`, `row = gid.x`, and the
  `row >= u.rows` bounds check (it must stay a row-per-invocation kernel).
- `softmaxWorkgroups` must keep the exact values above.

## Out-of-scope findings (runtime)

- `src/runtime/kernels/ops.ts` `opSoftmax` had the SAME bug class: its own
  `SOFTMAX` kernel (`src/runtime/kernels/wgsl.ts`, `@workgroup_size(256)`,
  `row = gid.x`, `row >= u.rows` guard) is row-per-invocation, but the op
  dispatched `Math.ceil(rows)` → rows × 256 invocations racing every row 256×.
  **Fixed** to `Math.max(1, Math.ceil(rows / 256))`. It is outside the benchmark
  correctness gates, so add a runtime-level softmax verification before it ships.
- Remaining runtime dispatches audited and confirmed correct: MatMul
  (`ceil(M/16)*ceil(N/16)` for 16×16 windowed workgroups), elementwise VecOps
  (`ceil(size/256)` for `@workgroup_size(256)` element-per-invocation), RoPE
  (`ceil(seq*dim/2/256)`), RMSNORM single-invocation `dispatchWorkgroups(1)`,
  Transpose 2D and bilinear Interpolate (`ceil(rows/16)*ceil(cols/16)` /
  `ceil(outW/16)*ceil(outH/16)` for 16×16 windowed workgroups).

## Screens / demo shaders (src/lib, src/screens)

- `MATMUL_SHADER` (lib): `@workgroup_size(16,16)`, `row=gid.x`, `col=gid.y`,
  dispatch `[(ceil(M/16)), (ceil(N/16)), 1]` — windowed 1:1 coverage, correct.
- `RELU_SHADER` / `BIAS_ADD_SHADER` (lib): `@workgroup_size(256)`,
  element-per-`gid.x`, dispatch `ceil(N/256)` — correct.
- `CONV2D_SHADER` (lib + model-test): `gid.x=N`, `gid.y=F` with serial OH×OW
  loop, dispatch `(N, F, 1)` — correct.
- `ATTENTION_SHADER` (lib + model-test): `gid.x=batch` with serial seq loop,
  dispatch `(batch, 1, 1)` — correct.
- `SOFTMAX_SHADER` (lib): `row = gid.x`, `@workgroup_size(256)` — only imported
  (unused) by model-test.ts and never dispatched; if it is ever wired up, it
  must be dispatched `ceil(rows/256)` in X. No action taken.