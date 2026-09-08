# Dispatch-Limit Audit — maxComputeWorkgroupsPerDimension

**Status:** Audited — no remaining `dispatchWorkgroups` call sites exceed `maxComputeWorkgroupsPerDimension` on any WebGPU device (the one real violation, large Vector Add, is fixed).

Every WebGPU device enforces `maxComputeWorkgroupsPerDimension` (the portable WebGPU spec default is **65,535** for all three dimensions; virtually all shipping implementations use at least this). Calling `dispatchWorkgroups(X, Y, Z)` with any dimension **>** the limit fails validation (`GPUValidationError`) or throws. This audit enumerates every `dispatchWorkgroups` call site in the app and confirms none can exceed the limit after the Vector Add fix.

## Method

For each compute-dispatch site record:
- the workload and its maximum problem size,
- the resulting per-dimension workgroup counts,
- whether any dimension can reach/exceed 65,535.

### 1. Vector Add — **was the violation, now fixed** ✅

**Call sites:** `src/benchmark/perf-kernels.ts` (`benchVecAdd`), `src/benchmark/tests.ts` (`vecAddCase`), `src/benchmark/bench-vecadd.ts`, `src/benchmark/perf-resources.ts`.

- Full Benchmark `VECADD_SIZES` includes `N = 4,194,304` → `ceil(4,194,304 / 64) = 65,536` workgroups.
- **Before:** dispatched `[65,536, 1, 1]` → X = 65,536 **> 65,535** → Full Benchmark fails validation. ✗
- **After:** routed through `calculateVectorDispatchForDevice` (`src/benchmark/vector-dispatch.ts`), which reads the real device limit and tiles to `X = 65,535, Y = 2` (stride `4,194,240`). Both dims ≤ limit. ✓
- All four Vector Add callers now use the shared helper (single source of truth). The helper hard-asserts `X,Y ≥ 1`, `X,Y ≤ limit`, `dispatchStride == X*64`, `totalWorkgroups ≤ X*Y` and throws rather than emit an illegal dispatch.

### 2. MatMul / RMSNorm / Softmax / Attention / Conv2D ✅

| Kernel | Dispatch geometry | Max problem | Max dim | vs 65,535 |
|---|---|---|---|---|
| MatMul (`tests.ts:332`, `perf-kernels.ts`, `bench-matmul.ts`, `harness-matmul.ts`) | `ceil(N/16) × ceil(N/16)` | N = 1024 | 64 | safe |
| RMSNorm (`tests.ts:517`, `bench-rmsnorm.ts`) | fixed `[1,1,1]` | — | 1 | safe |
| Softmax (`tests.ts:452`, `bench-softmax.ts`) | `softmaxWorkgroups(rows)` = `ceil(rows/64)` | rows = 256 | 4 | safe |
| Attention monolithic (`tests.ts:666/727`, `bench-attention.ts`, `perf-kernels.ts:610`) | `ceil(batch*seq/64)` | batch·seq = 1·1024 | 16 | safe |
| Attention phases (QK^T / PV) | one invocation per output row | row count ≤ 1024 | 16 | safe |
| Conv2D (`tests.ts:397`, `bench-conv2d.ts`) | `[N, F, OH·OW]` (1 inv/pixel) | OH·OW ≤ 900 | 900 | safe |

None of these can reach the portable 65,535 lower bound at their benchmark sizes.

### 3. Library / runtime entry points ✅

- `src/lib/compute.ts` (`runCompute`/`runComputeAsync`): generic `job.workgroups` — all in-benchmark peers pass small counts above; no built-in case exceeds 65,535.
- `src/lib/tensor.ts` (`mapInPlace` etc.): default `[1,1,1]`, callers pass row-parallel workgroups ≤ 900.
- `src/runtime/kernels/ops.ts`: row-parallel ops use `ceil(rows/256)`; rows bounded by benchmark tensor sizes (≤ 4096 → 16 workgroups).
- `src/benchmark/gpu-test.ts`: `params.workgroups` come from the benchmarks above.

### 4. Chains / sustained / resources ✅

- `bench-sustained.ts`, `perf-sustained.ts`: MatMul-only, max dim 64.
- `perf-resources.ts` (`benchBufferReuse`, `benchPipelineCache`, `benchCommandBatching`): now routed through `calculateVectorDispatchForDevice` for consistency (N = 65,536 / 4,096 → X = 1024 / 64, always 1D, safe).

## Conclusion

The only dispatch that could exceed the limit was the Large Vector Add case described by **Task 2**. It is now tiled via the shared `calculateVectorDispatch` helper with hard assertions. All other kernels and runtime paths are bounded well below 65,535 at every benchmark size. The helper is the required single choke point for any future large-array workloads.
