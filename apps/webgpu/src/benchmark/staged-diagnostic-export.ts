// AETHER V3.1.3 — Staged Diagnostic Export
//
// Turns the crash-safety staged diagnostic (runLLMDiagnosticStaged) into an
// exportable JSON report WITHOUT re-running any benchmark and WITHOUT
// introducing a new schema. Reuses the existing V3.1.3 architecture:
//   assembleLLMGateFromStages(): rebuild the LLMGateResult from the 7 stage
//     item lists that were already collected and measured.
//   buildStagedDiagnosticExport(): builds the payload, runs the required
//     post-serialization audit path
//       results → JSON.stringify → JSON.parse → runSelfAuditV3113(parsed)
//     and records postExportAudit. A failed audit forces certificationStatus
//     to FAILED — never claims certification it cannot prove.

import {
  type V3Result, type TransformerBlockResult, type TokenGenEstimate,
  type MemBudgetResult, type LLMReadiness, type LLMGateResult,
  computeLLMReadiness,
} from './results-v3.ts';
import type { LLMDiagnosticStage } from './perf-v3-llm.ts';
import {
  type CertificationGates, type SelfAuditV3113,
  buildLlmInferenceV3113, computeCertificationGates, runSelfAuditV3113,
  finalizeCertificationWithInterruption,
} from './v3113.ts';
import {
  getCheckpoint, getDeviceHealth, getRuntimeError,
  type InterruptionInfo, type InterruptionKind, type RuntimeErrorRecord,
} from './crash-safety.ts';

// ─── Authoritative schema constants (mirror perf-v3-ui.ts) ────────────────

export const DEFAULT_BENCHMARK_VERSION = 'V3.1.3';
export const DEFAULT_SCHEMA_VERSION = '3.1.3';
export const DEFAULT_ENGINE = 'AETHER_V3_1_3_RUNTIME';

export function resolveBuildId(preferred: string | null | undefined): string {
  const nonEmpty = (s: unknown): string => (typeof s === 'string' && s.trim().length > 0 ? s.trim() : '');
  const g = globalThis as Record<string, unknown>;
  return nonEmpty(preferred) || nonEmpty(g.AETHER_BUILD_ID) || nonEmpty(g.AETHER_COMMIT) || 'UNTRACKED';
}

// ─── Environment snapshot (structural; callers pass V3Environment) ────────

export interface StagedDeviceEnv {
  adapterName: string;
  adapterVendor: string;
  adapterDevice: string;
  device: string;
  maxBufferSize: number | null;
  maxWorkgroupsPerDim: number | null;
  timerResolutionMs: number;
}

export interface StagedExportOptions {
  buildId?: string | null | undefined;
  commit?: string | null;
  benchmarkVersion?: string;
  runtimeSchemaVersion?: string;
  benchmarkEngine?: string;
}

// ─── Rebuild an LLMGateResult from the items the staged diagnostic kept ───
// The stage items ARE the measured results — nothing is re-run, nothing is
// simulated here. Missing stages simply contribute an empty array.

export function assembleLLMGateFromStages(stages: LLMDiagnosticStage[]): LLMGateResult | null {
  if (stages.length === 0) return null;
  const byName = new Map(stages.map(s => [s.name, s]));
  const stage = (name: string): LLMDiagnosticStage | null => byName.get(name) ?? null;

  const qm = stage('quantizedMatmul');
  const da = stage('decodeAttention');
  const da512 = stage('decodeAttention512');
  const mem = stage('memoryBudget');
  const blocks = stage('transformerBlocks');
  const tok = stage('tokenGeneration');
  const cert = stage('certification');

  if (!qm || !da || !mem || !blocks) return null;

  const quantizedMatmul = (qm.items as V3Result[] | null) ?? [];
  const decodeAttention: V3Result[] = [
    ...((da.items as V3Result[] | null) ?? []),
    ...((da512?.items as V3Result[] | null) ?? []),
  ];
  const memoryBudget = (mem.items as MemBudgetResult[] | null) ?? [];
  const transformerBlocks = (blocks.items as TransformerBlockResult[] | null) ?? [];
  const tokenGeneration = (tok?.items as TokenGenEstimate[] | null) ?? [];

  let llmReadiness = (cert?.items as LLMReadiness | null) ?? null;
  if (!llmReadiness) {
    // Certification stage did not complete — recompute from what DID measure.
    llmReadiness = computeLLMReadiness(
      quantizedMatmul, decodeAttention, decodeAttention, transformerBlocks, memoryBudget, 0,
    );
  }

  return { quantizedMatmul, decodeAttention, transformerBlocks, tokenGeneration, memoryBudget, llmReadiness };
}

// ─── Payload types ────────────────────────────────────────────────────────

export interface StagedDiagnosticStageExport {
  name: string;
  label: string;
  durationMs: number;
  completed: boolean;
  error: string | null;
  items: unknown;
}

export interface StagedDiagnosticReport {
  completed: boolean;
  stagesCompleted: number;
  totalStages: number;
  interrupted: boolean;
  deviceLost: boolean;
  durationMs: number;
  stages: StagedDiagnosticStageExport[];
}

export interface StagedExportPayload {
  benchmarkVersion: string;
  runtimeSchemaVersion: string;
  benchmarkEngine: string;
  buildId: string;
  commit: string | null;
  timestamp: string;
  device: {
    adapterName: string;
    vendor: string;
    device: string;
    maxBufferSize: number | null;
    maxWorkgroupsPerDim: number | null;
    timerResolutionMs: number;
  };
  crashSafety: {
    deviceLost: boolean;
    runtimeError: unknown;
    interrupted: boolean;
    lastCompletedStage: string | null;
  };
  results: {
    llmInference: unknown;
    llmReadiness: unknown;
    stagedDiagnostic: StagedDiagnosticReport;
  };
  certification: CertificationGates;
  postExportAudit: SelfAuditV3113;
}

export interface StagedDiagnosticExport {
  json: string;
  payload: StagedExportPayload;
  postExportAudit: SelfAuditV3113;
  certificationStatus: 'CERTIFIED' | 'NOT_CERTIFIED' | 'FAILED';
  overallCertified: boolean;
  resultCount: number;
}

function lastCompletedStage(stages: LLMDiagnosticStage[]): string | null {
  for (let i = stages.length - 1; i >= 0; i--) {
    if (stages[i].completed) return stages[i].label;
  }
  return null;
}

// ─── Build the staged diagnostic export (with post-serialization audit) ───

export function buildStagedDiagnosticExport(
  stages: LLMDiagnosticStage[],
  gate: LLMGateResult | null,
  env: StagedDeviceEnv,
  options: StagedExportOptions,
): StagedDiagnosticExport {
  const checkpoint = getCheckpoint();
  const health = getDeviceHealth();
  const runtimeError = getRuntimeError();
  const checkpointInterruption = checkpoint?.interruption ?? null;
  const interruption: InterruptionInfo | null =
    checkpointInterruption ??
    (runtimeError
      ? {
          kind: (runtimeError.category as InterruptionKind) ?? 'UNKNOWN',
          reason: runtimeError.error,
          error: runtimeError.error,
          stack: runtimeError.stack,
          at: runtimeError.timestamp,
        }
      : health.lost
        ? {
            kind: 'WEBGPU_DEVICE_LOST',
            reason: health.reason ?? 'device lost',
            error: health.message ?? null,
            stack: null,
            at: new Date().toISOString(),
          }
        : null);

  const stagesCompleted = stages.filter(s => s.completed).length;
  const totalStages = stages.length;
  const allCompleted = totalStages > 0 && stagesCompleted === totalStages;

  const llmInference = gate ? buildLlmInferenceV3113(gate) : null;
  let certification: CertificationGates = gate
    ? computeCertificationGates(gate)
    : {
        timingIntegrity: 'FAIL', throughputIntegrity: 'FAIL', correctnessIntegrity: 'FAIL',
        llmSuiteComplete: 'FAIL', memorySuiteComplete: 'FAIL',
        overallCertified: false, certificationStatus: 'NOT_CERTIFIED',
        reasons: ['LLM inference suite has not run'],
      };
  if (interruption) certification = finalizeCertificationWithInterruption(certification, interruption);

  const payload: Record<string, unknown> = {
    benchmarkVersion: options.benchmarkVersion ?? DEFAULT_BENCHMARK_VERSION,
    runtimeSchemaVersion: options.runtimeSchemaVersion ?? DEFAULT_SCHEMA_VERSION,
    benchmarkEngine: options.benchmarkEngine ?? DEFAULT_ENGINE,
    buildId: resolveBuildId(options.buildId),
    commit: options.commit ?? null,
    timestamp: new Date().toISOString(),
    device: {
      adapterName: env.adapterName,
      vendor: env.adapterVendor,
      device: env.adapterDevice,
      maxBufferSize: env.maxBufferSize,
      maxWorkgroupsPerDim: env.maxWorkgroupsPerDim,
      timerResolutionMs: env.timerResolutionMs,
    },
    crashSafety: {
      deviceLost: health.lost,
      runtimeError: runtimeError ?? null,
      interrupted: !!interruption,
      lastCompletedStage: lastCompletedStage(stages),
    },
    results: {
      llmInference,
      llmReadiness: llmInference?.readiness ?? null,
      stagedDiagnostic: {
        completed: allCompleted,
        stagesCompleted,
        totalStages,
        interrupted: !!interruption,
        deviceLost: health.lost,
        durationMs: Math.round(stages.reduce((a, s) => a + s.durationMs, 0)),
        stages: stages.map(s => ({
          name: s.name,
          label: s.label,
          durationMs: Math.round(s.durationMs),
          completed: s.completed,
          error: s.error ?? null,
          items: s.items ?? null,
        })),
      },
    },
    certification: {
      timingIntegrity: certification.timingIntegrity,
      throughputIntegrity: certification.throughputIntegrity,
      correctnessIntegrity: certification.correctnessIntegrity,
      llmSuiteComplete: certification.llmSuiteComplete,
      memorySuiteComplete: certification.memorySuiteComplete,
      overallCertified: certification.overallCertified,
      certificationStatus: certification.certificationStatus,
      reasons: certification.reasons,
    },
  };

  // Required post-serialization audit path (Phase 12):
  //   results → JSON.stringify → JSON.parse → runSelfAuditV3113(parsed)
  const serialized = JSON.stringify(payload, null, 2);
  const parsed = JSON.parse(serialized) as StagedExportPayload;
  const parsedResults = (parsed as { results: StagedExportPayload['results'] }).results;
  const postExportAudit = runSelfAuditV3113(parsedResults.llmInference as Parameters<typeof runSelfAuditV3113>[0], env.timerResolutionMs);

  let certificationStatus = certification.certificationStatus;
  let overallCertified = certification.overallCertified;
  let reasons = certification.reasons;
  if (!postExportAudit.ok) {
    // Failed audit MUST prevent certification.
    certificationStatus = 'FAILED';
    overallCertified = false;
    reasons = [...certification.reasons, `postExportAudit FAILED (${postExportAudit.failures.length}): ${postExportAudit.failures.join('; ')}`];
  }

  parsed.postExportAudit = postExportAudit;
  parsed.certification = { ...parsed.certification, certificationStatus, overallCertified, reasons };

  const resultCount =
    (gate ? gate.quantizedMatmul.length + gate.decodeAttention.length + gate.transformerBlocks.length
        + gate.tokenGeneration.length + gate.memoryBudget.length : 0) + totalStages;

  return {
    json: JSON.stringify(parsed, null, 2),
    payload: parsed,
    postExportAudit,
    certificationStatus,
    overallCertified,
    resultCount,
  };
}