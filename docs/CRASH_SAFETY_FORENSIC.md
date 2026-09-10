# AETHER V3.1.3 Crash-Safety Forensic Report

Status: SHIPPED (deployed). Scoring and benchmark sizes are **unchanged**; this rollout adds crash containment, recovery, and fail-closed certification only.

## Deployed head

- `main` at `6f69183` (dist rebuild) — built from `186f771` (crash-safety source).
- buildId/commit reported by the live bundle: `186f771f87e2610f236de4a77226bb41e3efe622`.
- Pushed: `8ba1386..6f69183 main -> main`.
- Bundles: `assets/index-B8tQdwFW.js` (crash-safety: checkpoint/storage, global error capture, device-lost monitor, buffer registry, memory floor guards), `assets/perf-v3-ui-BeiAzkil.js` (V3.1.3 sentinels, certification, fail-closed self-audit, LLM gate + staged diagnostic).

## What shipped

- `crash-safety.ts`: checkpoint persistence to localStorage, heartbeat ticker, interruption classification, global error/unhandledrejection capture, `device.lost` monitor, tracked-buffer registry with cleanup on interruption, memory floor/cap guards (`checkResourceFloor`, `effectiveMaxBufferBytes`).
- Resume/checkpoint: interrupted V3.1.3 runs persist `completedCategories` + `partialResults`; on reload a banner offers **RESUME / START NEW RUN / CLEAR**. Resumed runs re-run only uncompleted categories (tokenGeneration is always recomputed).
- Chunked memory benchmark: the 512 MiB target is allocated in ≤64 MiB chunks; sub-floor devices return `RESOURCE_LIMIT` without allocating.
- Fail-closed certification: any interruption (device lost, JS exception, unhandled rejection, page termination) flips `certificationStatus` to `FAILED` with a reason string; an incomplete gate reads `NOT_CERTIFIED`, never `CERTIFIED`.
- UI: **STAGED DIAGNOSTIC** button runs `runLLMDiagnosticStaged` (7 breakable stages, buffers freed between stages).
- `screen.ts`: global error capture replaces the old `preventDefault`-only suppressors; interrupted-run recovery banner wired.

## Verification evidence

- `npm test` → EXIT 0. All 10 suites pass, incl. `regression-v3.test.ts` (54/54: the 12 new crash-safety tests **CS T1–T12** plus V3.1.3 tests 1–13).
- `npm run build` → EXIT 0. `tsc` clean, Vite build, `verify-build.mjs`: VERIFY PASS (no SW), build-info matches deployed commit.
- Bundle sentinels confirmed present in the live bundles: `AETHER_V3_1_3_RUNTIME`, `AETHER_V313_SENTINELS`, `runSelfAuditV3113`, `runLLMInferenceGate`, `runLLMGateFromUI`, `createBenchmarkResult`, `runtimeSchemaVersion`, `benchmarkEngine`, `llmInference`, `llmReadiness`, `postExportAudit`, `normalizedResults`; behavior strings `certification FAILED`, `STAGED DIAGNOSTIC`, `aether_v313_checkpoint`, `addEventListener("error"` + `unhandledrejection` all present.

## Bugs found and fixed during verification

1. CS T7/T12 failed: the "page reload" simulation called `resetForTests()`, which also wiped the checkpoint from storage, so a genuine reload would have lost nothing — the simulator was wrong. Fixed by adding `resetForTests(preserveStorage)`; reload tests now keep storage. 54/54 pass.

## What this does NOT change

- No scoring, readiness weights, benchmark sizes, repetition counts, or formulas.
- No fabricated metrics: percentiles remain `null` below 20 samples, throughput never emits `Infinity`, device-lost is only reported from a real `device.lost` event.

## First staged iPhone test (exact steps)

On the deployed site (iPhone, WebGPU enabled), open the console (via Web Inspector / Settings → Developer) and:

1. Click **STAGED DIAGNOSTIC** (V3.1 card).
2. Watch the console; the runner logs `DIAG stage N/7: <name> ...` per stage and will `releaseTrackedBuffers()` between stages.
3. Report back exactly: which stage numbers completed (console `DIAG` lines), which failed/skipped (if any), and the final log line (device, `maxBufferSize`, timer resolution).

Do NOT run the FULL V3.1.3 benchmark yet. If a stage fails, the crash-safety banner on reload must offer RESUME of that interrupted run — verify that banner appears before starting anything else.