// AETHER SAFE TRANSFORMER MEMORY GUARD
//
// Forensic finding #1 (iPhone 17 Pro / Safari, FULL V3.1.3): the synthetic 7B
// transformer block committed six weight GPUBuffers (~192 MiB) PLUS six
// mirrored host Float32Arrays (~192 MiB) PLUS per-buffer browser staging
// (mappedAtCreation copies) at the SAME time — a combined transient of
// ~384 MiB on top of a running benchmark page. Safari terminated the page.
//
// Forensic finding #2 (iPhone 17 Pro / Safari, FULL V3.1.3 after 7B was
// guarded): the run advanced to the synthetic 3B transformer block and the
// page terminated again. The 3B allocation was byte-for-byte identical to the
// pre-guard code, but the guard only modelled the simultaneously-live GPU
// device commit (~48 MiB), NOT the ~50 MiB of retained host Float32Array
// mirrors nor the per-buffer mappedAtCreation staging (~16 MiB at the largest
// upload). Real sustained transient for the old code was ~96 MiB and the peak
// ~112 MiB while the guard confidently reported "≈48 MiB device commit — runs".
// The estimate was off by ~2.3× and 3B became the largest stage actually
// executed, reloading Safari.
//
// Every individual 3B/7B buffer is BELOW the device's per-buffer
// maxBufferSize, which is exactly why a per-buffer check alone can never prove
// a block is safe: maxBufferSize reports the largest SINGLE allocation, not
// total allocatable memory, and WebGPU exposes no total-device-memory API.
//
// This guard therefore:
//   1. estimates the ACTUAL simultaneously-live **total browser transient**
//      footprint of the bench for a config:
//          estimatedBrowserTransientBytes =
//              estimatedGpuBytes        (all GPUBuffers alive at once)
//            + estimatedHostBytes       (peak host Float32Array alive — the
//                                        bench RELEASES each host array right
//                                        after upload, so this is the largest
//                                        single weight, never the full set)
//            + estimatedStagingBytes    (one mappedAtCreation staging copy at
//                                        a time — the largest single weight)
//   2. compares it to a conservative, evidence-based budget (a fixed
//      constant — NOT a percentage of maxBufferSize),
//   3. ALSO verifies the largest buffer independently against the real
//      device limits (maxBufferSize / maxStorageBufferBindingSize),
//   4. fails CLOSED, BEFORE any allocation, so a config that cannot run
//      safely is reported as RESOURCE_LIMIT / not-certified instead of
//      killing the browser. It NEVER fabricates a measured performance number.
//
// Budget basis (observed on-device for FULL V3.1.3, unified-memory Safari):
//   sizes through 1.5B (true peak ≈ 66 MiB under the old retained-host code)
//   ran successfully; 3B (true peak ≈ 112 MiB) terminated the page. 64 MiB
//   sits below the largest workload that ever ran safely and far below the
//   observed crash onset, while the post-restructure workload estimates land
//   comfortably on both sides:
//   0.5B     ≈ 20 MiB  transient — runs
//   1B/1.5B  ≈ 45 MiB  transient — runs
//   3B       ≈ 80 MiB  transient — blocked (would need ~50 MiB device + ~17
//                        MiB staging sustained; marginal on iOS)
//   7B       ≈ 320 MiB transient — blocked

import type {
  TransformerBlockConfig,
  TransformerBlockResult,
  TransformerResourceLimit,
} from './results-v3.ts';

/**
 * Conservative per-run TOTAL-BROWSER-TRANSIENT budget for ONE synthetic
 * transformer block, in the units of `estimatedBrowserTransientBytes`.
 *
 * Chosen from OBSERVED workloads on iPhone-class unified-memory devices
 * (see module header), independently of maxBufferSize.
 */
export const TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES = 64 * 1024 * 1024; // 64 MiB

/**
 * Historical GPU-device-commit-only budget retained for continuity/context.
 * It is informational; the guard decision now uses the total transient budget.
 */
export const TRANSFORMER_SUITE_SAFE_COMMIT_BYTES = 128 * 1024 * 1024; // 128 MiB (device commit ≈ 48 MiB for 3B — under-counted the real transient)

export const REASON_BUDGET_EXCEEDED = (
  name: string,
  gpuBytes: number,
  hostBytes: number,
  stagingBytes: number,
  totalBytes: number,
  budgetBytes: number,
): string =>
  `${name} transformer workload exceeds safe browser memory budget on this device ` +
  `(estimated browser transient ≈ GPU ${miB(gpuBytes)} + host ${miB(hostBytes)} + staging ${miB(stagingBytes)} = ${miB(totalBytes)} > budget ${miB(budgetBytes)})`;

export const REASON_BUFFER_CAP = (name: string, largestBytes: number, capName: string, capBytes: number): string =>
  `${name} transformer workload exceeds ${capName} (largest weight buffer ${miB(largestBytes)} > ${miB(capBytes)})`;

export interface TransformerBlockLimits {
  maxBufferSize: number;
  maxStorageBufferBindingSize?: number | null;
}

export interface TransformerBlockMemoryEstimate {
  deviceCommitBytes: number;       // GPUBuffers alive simultaneously during measurement
  hostCommitBytes: number;         // host Float32Array sources alive simultaneously (legacy retained-host view)
  largestBufferBytes: number;
  estimatedGpuBytes: number;       // = deviceCommitBytes — all GPUBuffers alive at once
  estimatedHostBytes: number;      // peak host Float32Array alive — largest single upload (host released after upload)
  estimatedStagingBytes: number;   // one mappedAtCreation staging copy at a time — largest single upload
  estimatedBrowserTransientBytes: number; // = gpu + host + staging — conservative workload-specific safety estimate
}

export interface TransformerBlockGuardResult {
  ok: boolean;
  reason: string | null;
  estimate: TransformerBlockMemoryEstimate;
}

/**
 * Parameter-count math shared by the measured bench and the blocked-result
 * builder. Kept here (pure) so the guard module stays Node-testable.
 */
export function computeParamCount(cfg: TransformerBlockConfig): { fp16: number; int8: number; int4: number } {
  const vocab = 32000;
  const embed = vocab * cfg.hidden;
  const perLayer =
    cfg.hidden * cfg.hidden +               // Q projection
    cfg.hidden * cfg.kvHeads * cfg.headDim + // K projection
    cfg.hidden * cfg.kvHeads * cfg.headDim + // V projection
    cfg.hidden * cfg.hidden +               // O projection
    cfg.hidden * cfg.intermediate +         // MLP up
    cfg.intermediate * cfg.hidden +         // MLP down
    cfg.hidden * 2;                          // 2x RMSNorm
  const total = embed + cfg.layers * perLayer;
  return { fp16: total * 2, int8: total, int4: Math.ceil(total / 2) };
}

/**
 * Model the EXACT simultaneously-live allocation set of
 * `benchSyntheticTransformerBlock` for a config (seq=1, FP32 block weights).
 *
 * Assumes the bench uploads each weight through `withLocalWeightHost`, i.e.
 * the host Float32Array exists ONLY inside the upload call and is released the
 * moment the GPUBuffer is minted. Host and staging peaks are therefore each
 * the LARGEST single buffer — never the whole weight set.
 */
export function estimateTransformerBlockMemory(cfg: TransformerBlockConfig): TransformerBlockMemoryEstimate {
  const H = cfg.hidden;
  const I = cfg.intermediate;
  const seq = 1;
  const b = 4; // bytes per f32 element

  const wNorm1 = H * b;
  const wQKV = H * H * 3 * b;
  const wO = H * H * b;
  const wNorm2 = H * b;
  const wUp = H * I * b;
  const wDown = I * H * b;
  const weights = wNorm1 + wQKV + wO + wNorm2 + wUp + wDown;

  const acts =
    seq * H * b +                  // input
    seq * H * b +                  // norm1Out
    seq * H * 3 * b +              // qkvOut
    seq * seq * b +                // scores
    seq * H * b +                  // attnOut
    seq * H * b +                  // projOut
    seq * H * b +                  // res1
    seq * H * b +                  // norm2Out
    seq * I * b +                  // hidden
    seq * I * b +                  // geluOut
    seq * H * b +                  // mlpOut
    seq * H * b;                   // output

  const largest = Math.max(wQKV, wO, wUp, wDown);
  return {
    deviceCommitBytes: weights + acts,
    hostCommitBytes: weights + seq * H * b, // legacy view: ALL host mirrors retained together
    largestBufferBytes: largest,
    estimatedGpuBytes: weights + acts,
    estimatedHostBytes: largest,   // one host array alive at a time after upload (post-restructure)
    estimatedStagingBytes: largest, // one mappedAtCreation staging copy at a time
    estimatedBrowserTransientBytes: weights + acts + largest + largest,
  };
}

/**
 * Upload one weight/prefill host buffer and RELEASE it immediately.
 *
 * The host Float32Array exists only inside this call: it is created, filled by
 * `init`, handed to `upload` (which uploads it into a GPUBuffer), and then
 * becomes unreachable — the caller only ever sees `upload`'s result. This is
 * the "release the host mirror as soon as possible" contract the guard's
 * `estimatedHostBytes` / `estimatedStagingBytes` accounting depends on.
 *
 * The bench uses this for every weight AND the input activation; nothing else
 * in the block path holds a large host typed array.
 */
export function withLocalWeightHost<T>(bytes: number, init: (a: Float32Array) => void, upload: (a: Float32Array) => T): T {
  const a = new Float32Array(bytes / 4);
  init(a);
  const out = upload(a);
  a.fill(0); // best-effort: scrub the buffer contents so a lingering engine
             // reference cannot re-climb the memory footprint assumption
  return out;
}

/**
 * Fail-closed guard. Evaluated BEFORE any GPU allocation. `ok === false` means
 * the block MUST NOT run: report `RESOURCE_LIMIT`, never a measured number.
 *
 * Checks, in order:
 *   1. largest single buffer vs device maxBufferSize
 *   2. largest single buffer vs device maxStorageBufferBindingSize
 *   3. total browser transient (GPU + host + staging) vs conservative budget
 */
export function guardTransformerBlock(
  cfg: TransformerBlockConfig,
  limits: TransformerBlockLimits,
  transientBudgetBytes: number = TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES,
): TransformerBlockGuardResult {
  const estimate = estimateTransformerBlockMemory(cfg);
  if (estimate.largestBufferBytes > limits.maxBufferSize) {
    return {
      ok: false,
      reason: REASON_BUFFER_CAP(cfg.name, estimate.largestBufferBytes, 'device maxBufferSize', limits.maxBufferSize),
      estimate,
    };
  }
  if (limits.maxStorageBufferBindingSize != null && estimate.largestBufferBytes > limits.maxStorageBufferBindingSize) {
    return {
      ok: false,
      reason: REASON_BUFFER_CAP(cfg.name, estimate.largestBufferBytes, 'device maxStorageBufferBindingSize', limits.maxStorageBufferBindingSize),
      estimate,
    };
  }
  if (estimate.estimatedBrowserTransientBytes > transientBudgetBytes) {
    return {
      ok: false,
      reason: REASON_BUDGET_EXCEEDED(
        cfg.name,
        estimate.estimatedGpuBytes,
        estimate.estimatedHostBytes,
        estimate.estimatedStagingBytes,
        estimate.estimatedBrowserTransientBytes,
        transientBudgetBytes,
      ),
      estimate,
    };
  }
  return { ok: true, reason: null, estimate };
}

/**
 * Honest, non-measured result for a guard-blocked config. Zero latency, no
 * throughput, `UNMEASURABLE` confidence, correctness not claimed, and the
 * `resourceLimit` marker so UI/export/certification can distinguish it from a
 * measured pass and from a hard crash.
 */
export function buildBlockedTransformerBlock(cfg: TransformerBlockConfig, reason: string): TransformerBlockResult {
  const params = computeParamCount(cfg);
  const resourceLimit: TransformerResourceLimit = { attempted: true, status: 'RESOURCE_LIMIT', reason };
  return {
    config: cfg,
    paramCount: params.fp16 / 2,
    fp16Bytes: params.fp16,
    int8Bytes: params.int8,
    int4Bytes: params.int4,
    blockLatencyMs: 0, // NOT measured — never fabricate a latency
    repetitions: 1,
    totalMs: 0,
    estimatedPerOperationMs: 0,
    totalWork: 0,
    workUnit: 'NONE',
    throughput: null,
    throughputUnit: '/s',
    confidence: 'UNMEASURABLE',
    resourceLimit,
  };
}

export interface DisposableLike {
  destroy(): void;
}

/**
 * Deterministic resource tracker for the transformer-block bench. Every GPU
 * buffer created for a block is registered here and released in a `finally`,
 * so a mid-block throw can never leak the previous block's memory into the
 * next one (the exact failure mode the memory guard was born from).
 */
export function createDisposableTracker<T extends DisposableLike>() {
  const live: T[] = [];
  return {
    create<R extends T>(make: () => R): R {
      const item = make();
      live.push(item);
      return item;
    },
    release(): number {
      const destroyed = live.length;
      for (let i = live.length - 1; i >= 0; i--) {
        live[i].destroy();
      }
      live.length = 0;
      return destroyed;
    },
    get alive(): number {
      return live.length;
    },
  };
}

function miB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}