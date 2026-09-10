# AETHER V3.1.3 — FULL CERTIFICATION PREFLIGHT

**Scope:** Static trace of the production **FULL** V3.1.3 LLM certification execution path. Raw materials: the certified staged iPhone export (buildId `5d30cf0e…`) plus a read of the shipped benchmark source. **No benchmark code, scoring, thresholds, workloads, kernels, or gates were changed to produce this report.**

---

## A. Full execution graph (as shipped)

```
iPhone Safari (HTTPS, WebGPU) → screen.ts: runPerfV31('full')
  → perf-v3-ui.ts: runLLMGateFromUI('full', getDevice, log, resume?)
      → beginBenchmark('V3.1','full',{...})            // crash-safety session + heartbeat
      → monitorDeviceLost(device) + startHeartbeatTicker()
      → runLLMInferenceGate(onProgress, resume)        // perf-v3-llm.ts
          ├─ benchQuantizedMatmul('full')               → 45 results       (precisionMatmul)
          │     per case → createBenchmarkResult
          ├─ benchKVCacheDecodeAttention('full')        → 6 results        (KV-cache decode)
          ├─ benchSyntheticTransformerBlock('full')     → 5 results        (transformer blocks)
          ├─ estimateTokenGeneration(blocks, decode)    → 3 derived cases  (token generation, CPU)
          ├─ benchMemoryBudget('full')                  → 7 rungs          (memory ladder)
          ├─ benchV3Attention()                         → 6 results        (attention, readiness only)
          └─ computeLLMReadiness(...)                    → llmReadiness (heuristic)
      → completeBenchmark(); _llmGateResults = gate
      → validateLLMGateIntegrity(gate)                   // in-page gate audit
      → renderLLMGate(gate, env, log)
          └─ renderCertificationBanner(): buildSelfAudit(null, gate) → computeCertificationGates
               → certificationStatus CERTIFIED | NOT_CERTIFIED
      → user taps EXPORT LLM JSON (renderLLMGate button) → buildLLMInferenceExport(gate)
           → results.llmInference / results.llmReadiness
           → normalizedResults → JSON.stringify → JSON.parse
           → runSelfAuditV3113(parsed.results.llmInference, timerResolutionMs)
           → postExportAudit embedded; audit failure forces certificationStatus FAILED
```

The same `runLLMInferenceGate` is reachable from the `FULL V3.1.1 LLM INFERENCE` button; crash-safety RESUME (reload → RESUME) replays only the not-yet-completed categories via per-category checkpoints. The STAGED diagnostic is a *separate small scout* and is **not** part of this trace.

## B. Every mandatory workload (FULL path)

| # | Group | Exact workload set | Results |
|---|-------|--------------------|---------|
| 1 | precisionMatmul (quantizedMatmul) | hidden `[512,768,1024,1536,2048]` × shape `[decode M=1, prefill-128 M=128, prefill-256 M=256]` × precision `[FP32 baseline, INT8, INT4]` | 45 |
| 2 | KV-cache decode | contexts `[128,256,512,1024,2048,4096]`, heads=8, headDim=64 | 6 |
| 3 | transformer blocks | `0.5B, 1B, 1.5B, 3B, 7B` (FP32, seq=1 decode-step, 11 dispatch sub-blocks each) | 5 |
| 4 | token generation | `128→32, 256→64, 512→64` (derived from 0.5B block + ctx=1024 decode) | 3 |
| 5 | memory ladder | `[128,256,512,768,1024,1536,2048]` MB, 64 MiB chunks | 7 |
| 6 | attention (readiness) | h=512 seq `[64,128,256,512]`; h=768 seq `[64,128,256]` | 6 |
| 7 | prefill | covered by quantizedMatmul prefill-128 / prefill-256 (CPU-verified) | in #1 |
| 8 | decode | covered by quantizedMatmul decode + KV-cache decode + transformer block | in #1/#2/#3 |
| 9 | sustained | **not required by the LLM gate** — `computeLLMReadiness` uses sustained drop = 0. (The separate V3-FULL benchmark `runV3Full` runs a 30 s sustained MatMul — outside the LLM certification path.) | n/a |

Every mandatory workload exists, is reachable, and is produced by the FULL runner using `createBenchmarkResult` (single normalization contract) → `results.llmInference` / `results.llmReadiness` → `computeCertificationGates` → post-serialization `runSelfAuditV3113` (check #7 now numeric-ordered; `REQUIRED_CONTEXTS`, `REQUIRED_BLOCKS` and the rung list all match what FULL produces).

## C. Expected memory at each stage (device, committed concurrently)

| Stage | Peak concurrent device commit | Largest single buffer | Live buffers (worst) |
|-------|------------------------------|-----------------------|----------------------|
| quantizedMatmul FP32 (h=2048, M=256) | ≈ 20 MiB | 16 MiB (B weights K·N·4) | 4 (A,B,C,uniform) |
| quantizedMatmul INT8 (h=2048) | ≈ 8 MiB | 4 MiB (packed) | 4 |
| quantizedMatmul INT4 (h=2048) | ≈ 6 MiB | 2 MiB (packed) | 4 |
| KV-cache decode ctx=4096 | ≈ 16 MiB | 8 MiB (K and V each) | 5 |
| transformer 0.5B (h512 i2048) | ≈ 12 MiB | 4 MiB (up/down) | 19 |
| transformer 1B / 1.5B | ≈ 27 MiB | 9 MiB (up/down) | 19 |
| transformer 3B (h1024 i4096) | ≈ 48 MiB | 16 MiB (up/down) | 19 |
| transformer 7B (h2048 i8192) | ≈ **192 MiB** | **64 MiB** (up/down) | 19 |
| token generation | 0 (CPU derived) | 0 | 0 |
| memory rung 128 / 256 / 512 | 128 / 256 / 512 MiB | 64 MiB | 2 / 4 / 8 |
| memory rung 768 / 1024 | 768 / 1024 MiB | 64 MiB | 12 / 16 |
| memory rung 1536 / 2048 | **1536 / 2048 MiB** | 64 MiB | 24 / 32 |
| attention (max h=512 seq=512) | ≈ 1.5 MiB | 1 MiB (scores) | 3 |

All buffers are `destroy()`ed at the end of each measurement iteration; no cross-stage accumulation. Host-side mirrored `Float32Array` uploads duplicate the same footprint while a stage is live (e.g. 7B ≈ 192 MiB JS + 192 MiB device ≈ 384 MiB transient).

## D. Maximum individual allocation

**64 MiB** — the 7B transformer `wUp`/`wDown` (2048×8192×4 B) and the memory-ladder chunk buffers (64 MiB). **No single allocation ever exceeds 256 MiB** (the iPhone `maxBufferSize`); memory-ladder chunking is additionally capped at `min(64 MiB, maxBufferSize, 256 MiB)`.

## E. High-risk stages

1. **Transformer 7B block** — 192 MiB concurrent device commit + ~192 MiB host, ~384 MiB transient.
2. **Memory rungs 1536 / 2048 MiB** — 24 / 32 live 64 MiB buffers, 1.5–2 GiB cumulative device-committed.
3. **Memory ladder wall time** — ~2.1 M×1 KiB `queue.writeBuffer` calls just for the 2048 MiB rung; the whole ladder is tens of seconds to ~2 minutes.
4. **Quantized matmul CPU verification** — 45 one-shot CPU reference matmuls, the largest 256×2048×2048 ≈ 4.3 GFLOPS in JS (single-threaded), ~0.5–3 s each; phase total ~1–2 min.

## F. SAFE / HIGH-RISK / BLOCKED per stage

| Stage | Verdict | |
|-------|---------|---|
| precisionMatmul FP32 / INT8 / INT4 | **SAFE** | time note (see E4) |
| KV-cache decode 128–1024 | **SAFE** | |
| KV-cache decode 2048 / 4096 | **SAFE** | ≤ 16 MiB commit; the 2048/4096 loops are small workgroups × O(ctx) inner loop |
| transformer 0.5B / 1B / 1.5B / 3B | **SAFE** | ≤ 48 MiB commit |
| transformer 7B | **HIGH-RISK** | see E1 |
| token generation 128/256/512 | **SAFE** | CPU-derived, no GPU |
| memory rung 128–1024 MB | **SAFE** | ≤ 1 GiB cumulative; 1024 marked borderline |
| memory rung 1536 / 2048 MB | **HIGH-RISK** | see E2 (polite failure handled; hard OOM possible) |
| attention (all 6) | **SAFE** | |
| sustained | **n/a** | outside LLM gate |
| **BLOCKED stages** | **none** | every mandatory workload is implemented and reachable |

## G. Exact reasons for every HIGH-RISK classification

- **7B synthetic block — HIGH-RISK (memory):** weight buffers alone commit 192 MiB on-device (48+16+64+64), plus the same ~192 MiB again as live JS `Float32Array` upload sources. On 4 GiB-class iPhones (SE 2 / 12 mini / 12), Safari memory compression and GPU-process pressure make a tab kill or `RESOURCE_LIMIT` plausible. On 6 GiB+ (13 Pro and newer) this fits comfortably. Every individual buffer (≤ 64 MiB) respects `maxBufferSize`; the risk is cumulative commit, not per-buffer size.
- **Memory rung 1536 / 2048 MB — HIGH-RISK (memory + wall time):** 24 or 32 simultaneous 64 MiB storage buffers mean 1.5–2 GiB **device-committed** for the top rungs, which on shared-GPU iPhones is the practical ceiling. `createBuffer` failure is caught and recorded as `success=false` with a `failureReason` (polite failure), **but** a hard iOS GPU-process OOM can terminate the page despite the try/catch. The ladder is also the slowest phase: the 64 MiB chunks are filled with 1 KiB `queue.writeBuffer` calls (~65 k calls per chunk, ~2.1 M for 2048 MiB).
- **Full-suite wall time (not a memory risk):** the 45-quantized-matmul CPU verifications plus the memory write-storm put the FULL run in the ~2–5 minute band. Safe for certification mechanics (heartbeat + per-category checkpoints), but it is the reason the staged scout was kept small.

## H. Confirmation: no benchmark numbers were modified

Verified against `git status` / diff scope before this report: **no source changes**. This is a documentation-only artifact. Specifically unchanged: workloads (shapes, sizes, precisions, contexts, blocks, ladder, token cases), timing (adaptive-measure loop, 20-sample/percentile policy), throughput (single `createBenchmarkResult` normalization), readiness, certification thresholds, all gates (including the check-#7 ordering fix already shipped), INT8/INT4 packing, KV-cache, memory ladder chunking, token simulation, staged diagnostic behavior, and the export schema.

### Review flags (observations only — intentionally NOT changed)
1. `computeCertificationGates.memorySuiteComplete` (and `runSelfAuditV3113` checks #9/#10) test the ladder by **presence** of targets plus `largestBuffer ≤ 256 MiB` plus `atLeastOneOk`. A fully-failed 1536/2048 rung still yields `PASS` so long as one lower rung succeeded — **a top-rung failure alone will not flip certification to FAILED**. Flag for product review; not altered here per instruction.
2. `benchMemoryBudget` is checkpointed as one `memoryBudget` category **after** the whole ladder returns; a page kill mid-ladder re-runs the ladder on RESUME (correctness safe, no per-rung resume).
3. Transformer blocks are not CPU-verified (`correctnessPassed: true` hardcoded) — the UI labels this "SYNTHETIC ARCHITECTURAL WORKLOAD" and refuses to read it as a real-model claim; unchanged.
4. 7B-block 192 MiB commit is the single highest-memory **measurement** node; run it last on the device profile that matters (6 GiB+ recommended for a clean CERTIFIED result).

**Readiness to execute:** the FULL run satisfies every mandatory gate (`REQUIRED_CONTEXTS`, `REQUIRED_BLOCKS`, FP32/INT8/INT4, 3 token cases, 7 rungs), and the post-serialization audit can now pass end-to-end. No code change is required for the preflight; execution safety on a given iPhone depends on the memory-risk notes above.