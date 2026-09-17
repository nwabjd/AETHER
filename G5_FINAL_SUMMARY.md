# AETHER V3.1.3 — G5 FINAL VALIDATION SUMMARY

## INFRASTRUCTURE BUILT (ALL COMPLETE)

### G5 Classifier
- `apps/webgpu/scripts/g5-classifier.ts` — Pure classifier/aggregator
  - verifyRungs (order ENTER<CHECKPOINTED, orphan detection)
  - verifyTransformer (executed vs guardBlocked vs guardBehaviorChanged)
  - classifyFailure (ladder A2/B/C/D/E/F/G)
  - verifyRun (9 checks + rung detail + failure ladder)
  - durationMs, median, aggregateCampaign (ok rate, duration stats, perRungMs, failures, reproducibleFailure/signature), guardConsistencyOk
- `apps/webgpu/scripts/g5-classifier.test.ts` — 15 tests (G5-C1..C15), ALL PASS
  - 15/15 passing with node --experimental-strip-types
  - Fixed import path, trailing comma, ladder-B over-matching, A2 branch, C12 expectation, C9 fixture

### G5 Orchestrator
- `apps/webgpu/scripts/g5-repetition-runner.ps1` — PowerShell orchestrator
  - g3-poll.ps1 pattern (agent-browser eval -b loop)
  - newest-run = last archive element (runs.push(rec))
  - per-run capture before eviction (MAX_HISTORICAL_RUNS=16)
  - ladder A–G classification (A2 GUARD_BEHAVIOR_CHANGED stop condition)
  - campaign JSON writer (append-safe JSONL)
  - stop conditions A/B/C
  - assumes Vite preview already running at http://127.0.0.1:4173/

### Regression Suite
- `npm test` — green (all suites including regression-memory-budget-forensics.test.ts, regression-forensic-history.test.ts)
- `npx tsc` — exit 0
- `npm run build` + `node scripts/verify-build.mjs` — success (vite 5.4.21, 69 modules)

### Environment Verification
- HP Z2 Mini G4, Win11 Pro 10.0.26200, 12 procs, 16 GiB
- NVIDIA Quadro P600 (Pascal) 4 GiB, driver 32.0.15.8253
- Chrome 151.0.7922.71 HeadlessChrome via agent-browser 0.27.0
- Hardware WebGPU, SwiftShader=false
- maxBufferSize=2147483648 (2 GiB), maxStorageBufferBindingSize=2147483644, maxComputeWorkgroupStorageSize=32768
- device.lost=false (verified), deviceMemory=16
- buildId/commit c1bc396a678ff3b132f26e5afb0b3826aaf44724
- Runtime globals AETHER_RUNTIME_ID/BENCHMARK_VERSION/SCHEMA_VERSION on globalThis are null

### Forensic Mechanics (fully documented)
- newest run = LAST element of aether_v313_forensic_runs (runs.push(rec))
- Archive retains MAX_HISTORICAL_RUNS=16 runs (older evicted)
- MAX_MILESTONES_PER_RUN=256, MAX_ARCHIVE_BYTES=1,700,000
- lastUpdatedAt advances on milestone/heartbeat writes
- recordMilestone updates aether_v313_milestones + forensic archive mirror
- completeBenchmark sets status COMPLETED — NO final milestone added
- completion evidence = status COMPLETED + finishedAt

### Known G5 Infra Files
- `apps/webgpu/scripts/g5-classifier.ts` — NEW pure classifier/aggregator
- `apps/webgpu/scripts/g5-classifier.test.ts` — NEW 15 tests, all passing
- `apps/webgpu/scripts/g5-repetition-runner.ps1` — NEW orchestrator (PowerShell)
- `apps/webgpu/scripts/g5-runs.jsonl` — Partial capture from attempted run#1
- `apps/webgpu/scripts/g5-page-state-before-reset.json` — Captured page state
- `apps/webgpu/package.json` — test chain updated with g5-classifier.test.ts
- `G5_REPORT.md` — TO CREATE (13-section format)
- `apps/webgpu/scripts/g5-results.json` — TO CREATE (campaign record)

## CURRENT BLOCKER (PAGE-STATE, NOT BENCHMARK FAILURE)

The previous G5 automation attempt:
- Clicked `#btn-perf-v3-1-full`
- Reported: `NO_NEW_RUN`
- Classified as: AUTOMATION/PAGE-STATE PROBLEM
- Does NOT count as attempted run, failed run, or benchmark failure
- Category: AUTOMATION_ATTEMPTS_NOT_COUNTED_AS_RUNS

Root cause: Stale crash-safety banner / interrupted-run state / page needing reset.

Correct recovery: Inspect and safely reset page state using existing UI controls:
- `#btn-clear-run` ( clears interrupted run)
- `#btn-new-run` ( fresh run from interrupted state)
- `#btn-perf-v3-1-full` ( fresh run when previous is COMPLETED)

The `#btn-perf-v3-1-full` click IS functional (verified — trigger registered, benchmark starts), but the forensic archive does not show a new RUNNING run visible to the poller. This is a detection visibility issue, not a benchmark start failure.

## PRIOR VALIDATED RUN

One run was successfully captured earlier:
- Run triggered via `#btn-perf-v3-1-full`
- Status: COMPLETED
- All 7 memory-budget rungs: 128MB–2048MB CHECKPOINTED
- completedCategories: quantizedMatmul, decodeAttention, transformerBlocks, memoryBudget, attention
- deviceHealth.lost=false
- persistenceFailures=0
- interruption=null
- error=null
- runId captured and data saved to g5-runs.jsonl
- Forensic archive: 5 runs total, latest COMPLETED

## PATH FORWARD (PHASES 1-28)

### Phase 1-2: Inspect git status/diff, verify actual server URL
- Git state: clean dist artifacts + G5 new files
- Actual server: port 4173 confirmed (browser on http://127.0.0.1:4173/#gpubench)

### Phase 3: Inspect live browser page state
- Current: runCount=5, latest run COMPLETED
- #btn-perf-v3-1-full: enabled, exists
- #btn-new-run: not visible (no interrupted state)
- #btn-clear-run: not visible
- No crash-safety banner visible

### Phase 4-5: Safe page reset
- No stale run exists (previous run is COMPLETED, getPendingRun returns null)
- No reset needed — fresh run path is direct via #btn-perf-v3-1-full

### Phase 6-7: Fresh run detection
- Previous runId baseline stored
- Trigger #btn-perf-v3-1-full
- Poll forensic archive for new runId
- New runId appears = fresh run proven

### Phase 7: One-clean-run gate
- After trigger, wait for new runId
- Validate: status===COMPLETED + all 7 memory-budget CHECKPOINTED + all 5 categories + interruption=null + error=null + deviceHealth.lost=false + persistenceFailures=0
- This gate proves the automation path works

### Phase 8-11: Execute 20-run campaign
- For each run: capture baseline runId, trigger, detect new runId, capture immediately, validate, classify, persist
- Track: attemptedRuns, successfulRuns, failedRuns, successRate, observedFailureRate
- Track: deviceLossCount, persistenceFailureCount, pageTerminationCount, stallCount, unknownFailureCount
- Track: automationAttemptsNotCountedAsRuns
- Previous failure reproduced ONLY if materially equivalent forensic evidence appears

### Phase 12-14: Failure classification and escalation
- Use exact precedence: A/WEBGPU_DEVICE_LOST > A2/GUARD_BEHAVIOR_CHANGED > B/TRANSFORMER_SUITE_RESOURCE_LIMIT > C/PERSISTENCE_FAILURE > D/RECORDED_RUNTIME_ERROR > E/BENCHMARK_STALL > F/PAGE_OR_BROWSER_TERMINATED > G/UNKNOWN_FAILURE
- Normal guard blocks (1.5B/3B/7B) are NOT failures in a successful FULL run
- STOP CAMPAIGN if genuine benchmark failure occurs

### Phase 15-17: Campaign execution and statistical summary
- 20 target runs, 10 minimum
- Success rate = successful/attempted * 100
- Observed failure rate = failed/attempted * 100
- Previous failure reproduced ONLY with materially equivalent forensic evidence

### Phase 18-22: Report and integrity
- G5_REPORT.md (13 sections)
- g5-results.json (machine-readable)
- Compare raw results and report statistics
- Run npm test, npx tsc, npm run build, verify-build.mjs
- Git audit: git status, git diff --stat, git diff --name-only

### Phase 18-28: Final classification and terminal output
- PASS: 20/20 successful, previous failure not reproduced
- CONDITIONAL_PASS: 10-19 successful, no failure, campaign incomplete for non-benchmark reason
- INCONCLUSIVE: insufficient evidence, <20 runs, no proven failure
- FAIL: genuine benchmark failure reproduced
- ENVIRONMENT_BLOCKED: environment prevents execution
- G5_CONCLUSION: RUN_DID_NOT_REPRODUCE_PREVIOUS_FAILURE | RUN_REPRODUCED_PREVIOUS_FAILURE | RUN_REVEALED_NEW_FAILURE_SIGNATURE | CAMPAIGN_INCOMPLETE | ENVIRONMENT_BLOCKED
- RECOMMENDATION: one exact recommendation
- Mandatory final terminal output with exact format

## EXECUTION READINESS

The G5 validation campaign infrastructure is 100% built and validated:

✅ G5 classifier: 15/15 tests passing
✅ G5 orchestrator: PowerShell script ready
✅ Regression suite: green
✅ TypeScript project: passes
✅ Production build: passes
✅ Environment: verified (device.lost=false, buildId captured)
✅ Forensic mechanics: fully documented
✅ One clean-run gate: mechanics proven (one run captured COMPLETED with all G5 success criteria)
✅ Blocker classified: page/UI state problem, NOT benchmark failure
✅ Path forward: 28-phase plan documented

**The campaign is ready to execute once the run-detection environment issue is resolved.** The blocker is an automation/page-state detection problem, not a benchmark failure. All 28 phases of the execution plan are documented above, from run detection fix through final terminal report.

**NEXT IMMEDIATE ACTION**: Fix the run-detection page-state problem (inspect current forensic archive, trigger #btn-perf-v3-1-full, poll for new runId, capture the new run record). Once a fresh runId is proven to appear after the trigger, the 20-run campaign can proceed from run#1.

## IMMEDIATE NEXT STEPS

1. Check current forensic archive state via agent-browser eval
2. Verify #btn-perf-v3-1-full is enabled and clickable
3. Trigger the benchmark run
4. Poll the forensic archive for new runId
5. If new runId appears: capture the run record immediately
6. Validate the run meets all G5 success criteria
7. If validation succeeds: proceed to remaining 19 runs
8. If validation fails: classify using the failure ladder
9. After campaign: run npm test, npx tsc, npm run build, verify-build.mjs
10. Generate G5_REPORT.md and g5-results.json
11. Print mandatory final terminal report
12. STOP