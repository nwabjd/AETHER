# AETHER iOS GPU Benchmark

Real WebGPU compute benchmarks running on the iPhone 17 Pro GPU via Safari 26+ / iOS 26+.

## Overview

Every measurement comes from actual timed GPU execution. No theoretical numbers. No fake measurements. The benchmark runs entirely on the device GPU — the HP workstation only hosts the static web application during development.

## Architecture

```
benchmark/
  engine.ts          — Core GPU init, timing, buffer management
  kernels.ts         — All WGSL compute shaders
  bench-vecadd.ts    — Benchmark 1: Vector Addition
  bench-matmul.ts    — Benchmark 2: Matrix Multiplication
  bench-conv2d.ts    — Benchmark 3: Convolution
  bench-softmax.ts   — Benchmark 4: Softmax
  bench-rmsnorm.ts   — Benchmark 5: RMSNorm
  bench-attention.ts — Benchmark 6: Attention
  bench-memory.ts    — Benchmark 7: Memory
  bench-sustained.ts — Benchmark 8: Sustained Load
  tests.ts           — Correctness tests for all kernels
  results-store.ts   — IndexedDB persistence + JSON export
  screen.ts          — UI screen with Quick/Full/Sustained modes
```

## Device Diagnostics Displayed

- WebGPU available
- Adapter name, vendor, device
- Adapter features count
- Adapter limits (max buffer size, max storage buffer binding size, max compute workgroup size, max compute invocations per workgroup)
- Preferred canvas format
- Timestamp-query support
- Fallback adapter status

## Benchmark 1 — Vector Addition

**Operation:** C = A + B (element-wise)

**Sizes tested:**
- 1K elements (4 KB)
- 64K elements (256 KB)
- 1M elements (4 MB)
- 16M elements (64 MB)
- 64M elements (256 MB)

**Metrics:** Execution time, elements/second throughput, correctness verification (C[i] == 3.0)

**Kernel:** `@workgroup_size(256)` — simple 1D dispatch with bounds check

## Benchmark 2 — Matrix Multiplication

**Operation:** C = A × B

**Sizes tested:**
- 128×128
- 256×256
- 512×512
- 1024×1024

**Metrics:** Execution time, GFLOPS (2×M×N×K FLOPs), correctness verification against CPU reference

**Correctness:** Verified for 128×128 and 256×256 against CPU matmul (max error < 1e-3)

**Kernel:** `@workgroup_size(16, 16)` — 2D dispatch with naive O(N³) algorithm

## Benchmark 3 — Convolution

**Operation:** 2D convolution with multiple filter sizes

**Configurations:**
- 1×3×32×32 input, 8×3×3×3 kernel (small)
- 1×3×64×64 input, 16×3×5×5 kernel (medium)
- 1×16×64×64 input, 32×16×3×3 kernel (deep)
- 1×32×128×128 input, 64×32×3×3 kernel (large)

**Metrics:** Execution time, GFLOPS, memory usage

**Kernel:** `@workgroup_size(8, 8)` — 2D dispatch over batch×filters

## Benchmark 4 — Softmax

**Operation:** Row-wise softmax (numerically stable with max subtraction)

**Sizes tested:**
- 1×1024
- 32×1024
- 128×1024
- 512×1024
- 1024×1024

**Metrics:** Execution time, elements/second, correctness verification against CPU reference

**Correctness:** Max error < 1e-4 for all sizes

**Kernel:** `@workgroup_size(256)` — one workgroup per row

## Benchmark 5 — RMSNorm

**Operation:** Root Mean Square Layer Normalization

**Formula:** `output[i] = (input[i] / sqrt(mean(input²) + eps)) × weight[i]`

**Sizes tested:**
- N=64
- N=256
- N=1024
- N=4096 (typical LLM hidden dimension)
- N=8192 (large hidden dimension)
- N=16384

**Metrics:** Execution time, elements/second, correctness verification

**Correctness:** Max error < 1e-3 against CPU reference

**Kernel:** `@workgroup_size(256)` — single workgroup computes entire normalization

## Benchmark 6 — Attention

**Operation:** Simplified scaled dot-product attention

**Formula:** `output = softmax(Q × K^T / sqrt(dim)) × V`

**Configurations:**
- seq=128, dim=64
- seq=256, dim=64
- seq=512, dim=64
- seq=128, dim=128
- seq=256, dim=128
- seq=512, dim=128

**Metrics:** Execution time, GFLOPS, output finiteness verification, softmax row-sum verification

**Kernel:** `@workgroup_size(16)` — one workgroup per batch element

## Benchmark 7 — Memory

**Tests:**

1. **Maximum buffer size** — Probes up to adapter's `maxBufferSize` limit
2. **Allocation time** — Time to create buffers at 1MB, 16MB, 64MB, 128MB
3. **Upload time** — `queue.writeBuffer()` throughput at 1MB, 16MB, 64MB
4. **Readback time** — `copyBufferToBuffer` + `mapAsync` throughput at 1MB, 16MB, 64MB
5. **Buffer reuse vs re-alloc** — Compares reusing a buffer vs creating a new one each time
6. **Useful working-set size** — Largest buffer that can be used for actual computation

**Graceful failure:** Each sub-test handles allocation failures independently. The benchmark never attempts to allocate dangerous amounts.

## Benchmark 8 — Sustained Load

**Workload:** 256×256 matrix multiplication dispatched continuously

**Durations:**
- 30 seconds
- 60 seconds
- 180 seconds (3 minutes)

**Between tests:** 10-second cooldown period

**Metrics:**
- Per-second GFLOPS samples
- Average GFLOPS across duration
- Min/max GFLOPS
- First-10s vs last-10s comparison
- Thermal throttling detection (>15% performance drop)

**Responsiveness:** Uses `requestAnimationFrame`-compatible async loop. The UI remains responsive.

## Correctness Tests

Automated verification of every kernel against CPU reference implementation:

| Test | Method | Tolerance |
|------|--------|-----------|
| VecAdd | Exact match (C[i] = 3.0) | < 1e-5 |
| Matmul | CPU reference comparison | < 1e-3 |
| Conv2D | CPU reference comparison | < 1e-4 |
| Softmax | CPU reference comparison | < 1e-4 |
| RMSNorm | CPU reference comparison | < 1e-3 |
| Attention | Finiteness + softmax row-sum ≈ 1.0 | < 0.01 |

## Results Storage

- **IndexedDB:** Results persisted locally in `aether-gpu-benchmark` database
- **JSON Export:** Full results downloadable as timestamped JSON file
- **History:** View last 5 saved runs
- **Clear:** Wipe all stored results

## Benchmark Modes

### ⚡ QUICK BENCHMARK (~30s)
- Correctness tests (all 6 kernels)
- VecAdd at all sizes
- Matmul at all sizes
- Softmax at all sizes
- RMSNorm at all sizes

### FULL BENCHMARK (~3-5 min)
- Correctness tests
- All 8 benchmarks at all sizes
- Memory tests (allocation, upload, readback, reuse)

### SUSTAINED BENCHMARK (~5 min)
- 30s + 60s + 180s continuous GPU load
- Thermal throttling detection
- Per-second GFLOPS tracking

## Timing Methodology

All timing uses `performance.now()` before dispatch and `queue.onSubmittedWorkDone()` after GPU completion. This measures true GPU execution time including:

- Command encoding
- GPU queue wait
- Actual shader execution
- Queue synchronization

If `timestamp-query` feature is available, it is requested at device creation. Whether or not it is available is clearly displayed in device diagnostics.

## Running on iPhone 17 Pro

1. Open `https://nwabjd.github.io/AETHER/#gpubench` in Safari
2. Wait for device info to populate
3. Tap **QUICK BENCHMARK** for initial assessment
4. Tap **FULL BENCHMARK** for comprehensive results
5. Tap **SUSTAINED (270s)** for thermal analysis
6. Tap **EXPORT JSON** to download results

**Requirements:**
- iOS 26+ with Safari 26+
- HTTPS (GitHub Pages provides this)
- Do not switch tabs during benchmarks
- Keep screen on during sustained tests
