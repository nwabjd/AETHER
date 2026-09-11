// AETHER — PRE-DEVICE A/B REGRESSION ISOLATION HARNESS (test-only, GPU-free)
//
// STATIC MODEL of the three transformer-block execution paths, built purely from
// the production pure functions (estimateTransformerBlockMemory / guardTransformerBlock)
// plus the op sequences of the current and pre-guard bench bodies. It deliberately
// performs no GPU work: it is a source-level isolation harness that answers, for
// any config, the exact allocation/lifetime/supervision deltas between:
//
//   baseline          — pre-guard execution (4036fe6^): no guard, no tracker,
//                       six host weight arrays + input held simultaneously,
//                       explicit per-block destroy, category-level checkpoint only.
//   current           — HEAD bench: guard + tracker + withLocalWeightHost +
//                       per-block checkpoint + milestone store + progress.
//   current-minimal   — same GPU workload as current, but striped of progress/
//                       checkpoint/milestone/localStorage supervision.
//
// The GPU workload (pipelines, weights/acts/uniform buffers, bind groups,
// measurement, destroy) is IDENTICAL across the three variants for allowed
// configs; the variants differ only in host-array policy and supervision ops.
//
// Invariants asserted by the AB tests (scripts/regression-v3.test.ts):
//   * GPU bytes live during measure are byte-identical across all variants.
//   * Async-wait count and position are identical across all variants.
//   * destroy() is always the LAST op of an allowed block (never checkpoint /
//     milestone AFTER destroy).
//   * current has the most supervision ops; minimal = current minus
//     PROGRESS/MILESTONE/CHECKPOINT/LOCALSTORAGE; baseline has none of those.

import {
  TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES,
  estimateTransformerBlockMemory,
  guardTransformerBlock,
} from './transformer-guard.ts';
import type { TransformerBlockConfig, TransformerBlockLimits } from './results-v3.ts';

export type ABVariant = 'baseline' | 'current' | 'current-minimal';

export const AB_VARIANTS: readonly ABVariant[] = ['baseline', 'current', 'current-minimal'];

/**
 * Number of GPU-completion awaits adaptiveMeasure performs per block:
 * 1 calibration + up to 2 re-calibrations (bounded) + 3 warmup + 20 measured
 * block samples. Fixed in all variants because adaptiveMeasure is untouched by
 * the guard commits.
 */
export const MEASURE_AWAITS = 24;

export const COUNT_WEIGHT_BUFS = 6;
export const COUNT_ACT_BUFS = 12;
export const COUNT_UNIFORM_BUFS = 7;
export const COUNT_BIND_GROUPS = 11;
export const COUNT_PIPELINES = 5;
export const COUNT_DESTROY = COUNT_WEIGHT_BUFS + COUNT_ACT_BUFS + COUNT_UNIFORM_BUFS;

export interface ABOp {
  kind: string;
  async?: boolean;
  bytes?: number;
  detail?: string;
}

export interface ABBlockPlan {
  variant: ABVariant;
  configName: string;
  allowed: boolean;
  reason: string | null;
  deviceBytes: number;
  hostPeakBytes: number;
  stagingPeakBytes: number;
  transientBytes: number;
  asyncWaits: number;
  destroyCount: number;
  ops: ABOp[];
}

const GENEROUS_LIMITS: TransformerBlockLimits = {
  maxBufferSize: 2 * 1024 * 1024 * 1024,
  maxStorageBufferBindingSize: 2 * 1024 * 1024 * 1024,
};

function weightBytes(cfg: TransformerBlockConfig): number[] {
  const H = cfg.hidden;
  const I = cfg.intermediate;
  return [H * 4, H * H * 3 * 4, H * H * 4, H * 4, H * I * 4, I * H * 4];
}

function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}

/**
 * Static one-block execution plan for a variant. `runTransientBytes` feeds the
 * run-progressive guard term so 1.5B's refusal by the cumulative cap is modeled
 * exactly as production would decide it for the same run state.
 */
export function planTransformerBlock(
  variant: ABVariant,
  cfg: TransformerBlockConfig,
  limits: TransformerBlockLimits = GENEROUS_LIMITS,
  runTransientBytes = 0,
): ABBlockPlan {
  const est = estimateTransformerBlockMemory(cfg);
  const wSix = weightBytes(cfg);
  const maxWeight = Math.max(...wSix);
  const inputBytes = cfg.hidden * 4;

  const ops: ABOp[] = [];

  // Guard decision when present (current + current-minimal).
  const g = variant === 'baseline'
    ? null
    : guardTransformerBlock(cfg, limits, TRANSFORMER_SUITE_SAFE_BROWSER_TRANSIENT_BYTES, runTransientBytes);

  const push = (kind: string, extra: Partial<ABOp> = {}): void => {
    ops.push({ kind, ...extra });
  };

  if (variant === 'baseline') {
    push('PROGRESS', { detail: `transformer block ${cfg.name} hidden=${cfg.hidden}` });
    push('HOST_ALLOC', {
      bytes: sum(wSix) + inputBytes,
      detail: 'six weight arrays + input activation alive simultaneously until block end',
    });
  } else if (g && !g.ok) {
    push('GUARD', { detail: g.reason ?? 'blocked' });
    if (variant === 'current') {
      push('GUARD_BLOCK');
      push('PROGRESS', { detail: `transformer block ${cfg.name} BLOCKED: ${g.reason}` });
      push('CHECKPOINT', { bytes: 0, detail: 'partial transformer results JSON.stringify -> localStorage' });
      push('MILESTONE', { detail: `${cfg.name} CHECKPOINTED` });
    } else {
      push('GUARD_BLOCK', { detail: 'minimal variant: no progress/checkpoint/milestone emit' });
    }
    return {
      variant, configName: cfg.name, allowed: false, reason: g.reason, deviceBytes: 0,
      hostPeakBytes: 0, stagingPeakBytes: 0, transientBytes: est.estimatedBrowserTransientBytes,
      asyncWaits: 0, destroyCount: 0, ops,
    };
  }

  if (variant !== 'baseline') {
    push('ENTER', {});
    push('GUARD_START', {});
  }
  if (variant !== 'current-minimal') {
    push('PROGRESS', { detail: `transformer block ${cfg.name} hidden=${cfg.hidden}` });
  }
  if (variant === 'current') {
    push('MILESTONE', { detail: `${cfg.name} ENTER` });
    push('MILESTONE', { detail: `${cfg.name} GUARD_START` });
    push('GUARD_OP', { detail: 'pure arithmetic — zero allocations' });
    if (g) push('MILESTONE', { detail: `${cfg.name} ${g.ok ? 'GUARD_PASS' : 'GUARD_BLOCK'}` });
    push('MILESTONE', { detail: `${cfg.name} PIPELINES` });
  } else if (variant === 'current-minimal') {
    push('GUARD_OP', { detail: 'pure arithmetic — zero allocations' });
  }

  push('PIPELINE', { bytes: COUNT_PIPELINES, detail: `${COUNT_PIPELINES}x createShaderModule + createComputePipeline` });
  push('UPLOAD_WEIGHTS', {
    bytes: sum(wSix) + (variant === 'baseline' ? inputBytes : 0),
    detail: variant === 'baseline'
      ? 'storageBuf per weight (host array already alive)'
      : 'withLocalWeightHost per weight (ONE host array released right after upload)',
  });
  // individual weight upload milestones (current only)
  if (variant === 'current') {
    push('MILESTONE', { detail: 'UPLOAD_START' });
    push('MILESTONE', { detail: 'HOST_ALLOC_AND_GPU_BUF 1/6' });
    push('MILESTONE', { detail: 'UPLOAD_W2..W6' });
  }
  push('ACT_BUFFERS', { bytes: est.deviceCommitBytes - sum(wSix), detail: `${COUNT_ACT_BUFS} activation buffers + input upload` });
  push('UNIFORM_BUFS', { bytes: COUNT_UNIFORM_BUFS * 28, detail: `${COUNT_UNIFORM_BUFS} uniform buffers` });
  if (variant === 'current') push('MILESTONE', { detail: 'ALL_BUFFERS_CREATED' });
  push('BIND_GROUPS', { bytes: COUNT_BIND_GROUPS, detail: `${COUNT_BIND_GROUPS} bind groups` });
  if (variant === 'current') {
    push('MILESTONE', { detail: 'BIND_GROUP_READY' });
    push('MILESTONE', { detail: 'DISPATCH_SUBMIT_START' });
  }
  push('MEASURE', { async: true, detail: `await adaptiveMeasure — ${MEASURE_AWAITS} GPU-completion awaits` });
  if (variant === 'current') push('MILESTONE', { detail: 'GPU_COMPLETION' });
  push('RESULT', { detail: 'createBenchmarkResult + out.push' });
  if (variant === 'current') {
    push('CHECKPOINT', { detail: 'per-block checkpointCategory: JSON.stringify(partial) -> localStorage' });
    push('RUN_ACCUM', { bytes: est.estimatedBrowserTransientBytes, detail: 'runTransientBytes += estimate' });
    push('MILESTONE', { detail: `${cfg.name} CHECKPOINTED` });
    push('MILESTONE', { detail: `${cfg.name} COMPLETE` });
  }
  // Destroy BEFORE the next block in every variant — the op order guarantee.
  push('DESTROY', {
    bytes: COUNT_DESTROY,
    detail: variant === 'baseline'
      ? `${COUNT_DESTROY} explicit .destroy() at block end`
      : `${COUNT_DESTROY} via tracker.release() in finally (BEFORE next block)`,
  });

  const hostPeak = variant === 'baseline'
    ? sum(wSix) + inputBytes
    : Math.max(maxWeight, inputBytes);

  return {
    variant, configName: cfg.name, allowed: true, reason: null,
    deviceBytes: est.deviceCommitBytes,
    hostPeakBytes: hostPeak,
    stagingPeakBytes: maxWeight,
    transientBytes: est.estimatedBrowserTransientBytes,
    asyncWaits: MEASURE_AWAITS,
    destroyCount: COUNT_DESTROY,
    ops,
  };
}