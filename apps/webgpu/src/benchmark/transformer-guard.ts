// AETHER SAFE 7B MEMORY GUARD
//
// Forensic finding (iPhone 17 Pro / Safari, FULL V3.1.3): the synthetic 7B
// transformer block committed six weight GPUBuffers (~192 MiB) PLUS six
// mirrored host Float32Arrays (~192 MiB) PLUS per-buffer browser staging
// (mappedAtCreation copies) at the SAME time — a combined transient of
// ~384 MiB on top of a running benchmark page. Safari terminated the page.
//
// Every individual 7B buffer is BELOW the device's per-buffer maxBufferSize,
// which is exactly why a per-buffer check alone can never prove the block is
// safe: maxBufferSize reports the largest SINGLE allocation, not total
// allocatable memory, and WebGPU exposes no total-device-memory API.
//
// This guard therefore:
//   1. estimates the ACTUAL simultaneously-live device commit per config,
//   2. compares it to a conservative, per-run budget for the transformer
//      suite (a fixed constant — NOT a percentage of maxBufferSize),
//   3. ALSO verifies the largest buffer independently against the real
//      device limits (maxBufferSize / maxStorageBufferBindingSize),
//   4. fails CLOSED, BEFORE any allocation, so a config that cannot run
//      safely is reported as RESOURCE_LIMIT / not-certified instead of
//      killing the browser. It NEVER fabricates a measured performance num­ber.

import type {
  TransformerBlockConfig,
  TransformerBlockResult,
  TransformerResourceLimit,
} from './results-v3.ts';

/**
 * Conservative per-run live-commit budget for ONE synthetic transformer block.
 *
 * 0.5B        ≈ 12 MiB  device commit — runs
 * 1B / 1.5B   ≈ 27 MiB  device commit — runs
 * 3B          ≈ 48 MiB  device commit — runs
 * 7B          ≈ 192 MiB device commit (+ ~192 MiB host mirrors) — blocked
 *
 * 128 MiB sits comfortably above every block that actually runs safely and
 * below the observed failure point. It is deliberately NOT derived from
 * maxBufferSize (a per-buffer cap) because that value does not represent
 * total available memory.
 */
export const TRANSFORMER_SUITE_SAFE_COMMIT_BYTES = 128 * 1024 * 1024; // 128 MiB

export const REASON_BUDGET_EXCEEDED = (name: string, deviceBytes: number, budgetBytes: number): string =>
  `${name} transformer workload exceeds safe browser memory budget on this device ` +
  `(simultaneous live GPU commit ≈ ${miB(deviceBytes)} > ${miB(budgetBytes)})`;

export const REASON_BUFFER_CAP = (name: string, largestBytes: number, capName: string, capBytes: number): string =>
  `${name} transformer workload exceeds ${capName} (largest weight buffer ${miB(largestBytes)} > ${miB(capBytes)})`;

export interface TransformerBlockLimits {
  maxBufferSize: number;
  maxStorageBufferBindingSize?: number | null;
}

export interface TransformerBlockMemoryEstimate {
  deviceCommitBytes: number; // GPUBuffers alive simultaneously during measurement
  hostCommitBytes: number;   // host Float32Array sources alive simultaneously
  largestBufferBytes: number;
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

  return {
    deviceCommitBytes: weights + acts,
    hostCommitBytes: weights + seq * H * b, // host mirrors alive while device buffers are minted/measured
    largestBufferBytes: Math.max(wQKV, wO, wUp, wDown),
  };
}

/**
 * Fail-closed guard. Evaluated BEFORE any GPU allocation. `ok === false` means
 * the block MUST NOT run: report `RESOURCE_LIMIT`, never a measured number.
 */
export function guardTransformerBlock(
  cfg: TransformerBlockConfig,
  limits: TransformerBlockLimits,
  budgetBytes: number = TRANSFORMER_SUITE_SAFE_COMMIT_BYTES,
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
  if (estimate.deviceCommitBytes > budgetBytes) {
    return {
      ok: false,
      reason: REASON_BUDGET_EXCEEDED(cfg.name, estimate.deviceCommitBytes, budgetBytes),
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
 * next one (the exact failure mode the 7B guard was born from).
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