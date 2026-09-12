// AETHER V3.1.3 — Persistent Forensic Run History (observer layer)
//
// Durable, read-only-by-design historical archive of every benchmark run
// (incl. orphaned RUNNING records recovered after page termination/reload).
//
// Isolation rules:
//   - This module is a pure observer. It never executes a benchmark, never
//     touches WebGPU, never participates in timing, certification, scoring,
//     the transformer guard, or the memory ladder.
//   - It reads/writes exactly ONE localStorage key: `aether_v313_forensic_runs`.
//     It must NEVER touch `aether_v313_checkpoint` or `aether_v313_milestones`.
//   - Every storage call is guarded so a forensic failure can never propagate
//     into benchmark execution.

export const FORENSIC_RUNS_KEY = 'aether_v313_forensic_runs';

export const FORENSIC_RUNTIME_ID = 'AETHER_V3_1_3_RUNTIME';
export const FORENSIC_BENCHMARK_VERSION = 'V3.1.3';
export const FORENSIC_RUNTIME_SCHEMA_VERSION = '3.1.3';

export const MAX_HISTORICAL_RUNS = 16;
export const MAX_MILESTONES_PER_RUN = 256;
export const MAX_ARCHIVE_BYTES = 1_700_000;

export type ForensicRunStatus = 'RUNNING' | 'INTERRUPTED' | 'COMPLETED';

export interface ForensicMilestone {
  t: string;
  state: string;
}

export interface ForensicInterruption {
  kind: string;
  reason: string;
  error: string | null;
  stack: string | null;
  at: string;
  recoveredAt?: string;
}

export interface ForensicDeviceHealth {
  lost: boolean;
  reason?: string;
  message?: string;
}

export interface ForensicRunRecord {
  runId: string;
  sessionId: string;
  runtimeId: string;
  buildId: string | null;
  benchmarkVersion: string;
  runtimeSchemaVersion: string;
  startedAt: string;
  lastUpdatedAt: string;
  lastHeartbeat: string | null;
  finishedAt: string | null;
  status: ForensicRunStatus;
  currentPhase: string | null;
  currentCategory: string | null;
  completedCategories: string[];
  lastMilestone: string | null;
  milestones: ForensicMilestone[];
  interruption: ForensicInterruption | null;
  deviceHealth: ForensicDeviceHealth | null;
  partialResults: Record<string, { count: number }>;
  partialResultKeys: string[];
  error: string | null;
  recoveredAt: string | null;
  persistenceFailures: number;
}

export interface ForensicSnapshot {
  runId: string;
  buildId: string | null;
  runtimeId: string;
  benchmarkVersion: string;
  runtimeSchemaVersion: string;
  status: ForensicRunStatus;
  startedAt: string;
  lastUpdatedAt: string;
  finishedAt: string | null;
  currentPhase: string | null;
  currentCategory: string | null;
  completedCategories: string[];
  interruption: ForensicInterruption | null;
  lastMilestone: string | null;
  milestoneCount: number;
  deviceHealth: ForensicDeviceHealth | null;
  partialResultKeys: string[];
  persistenceOk: boolean;
  persistenceFailures: number;
  recoveredAt: string | null;
}

export interface ForensicStorageStatus {
  archiveExists: boolean;
  corrupted: boolean;
  readError: string | null;
  runCount: number;
  activeRuns: number;
  incompleteRuns: number;
  completedRuns: number;
  archiveBytes: number;
  maxRuns: number;
  maxMilestonesPerRun: number;
  maxArchiveBytes: number;
}

export interface ForensicRunPatch {
  status?: ForensicRunStatus;
  currentPhase?: string | null;
  currentCategory?: string | null;
  completedCategories?: string[];
  lastHeartbeat?: string | null;
  deviceHealth?: ForensicDeviceHealth | null;
  partialResults?: Record<string, { count: number }>;
  partialResultKeys?: string[];
  interruption?: ForensicInterruption | null;
  error?: string | null;
  finishedAt?: string | null;
}

export interface BeginForensicRunOptions {
  runtime?: string;
  runtimeId?: string;
  buildId?: string | null;
  benchmarkVersion?: string;
  runtimeSchemaVersion?: string;
  phase?: string | null;
  category?: string | null;
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

let _testStorage: StorageLike | null = null;
let _sessionId: string = makeId();
let _active: ForensicRunRecord | null = null;

export function setForensicStorageForTests(s: StorageLike | null): void {
  _testStorage = s;
}

function storage(): StorageLike | null {
  if (_testStorage) return _testStorage;
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

function makeId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // fall through to defacto random id
  }
  const rand = () => Math.random().toString(36).slice(2);
  return `f-${Date.now().toString(36)}-${rand()}${rand()}`;
}

function iso(): string {
  return new Date().toISOString();
}

function utf8Bytes(s: string): number {
  try {
    return new TextEncoder().encode(s).length;
  } catch {
    return s.length;
  }
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function isRecord(v: unknown): v is ForensicRunRecord {
  if (!v || typeof v !== 'object') return false;
  const r = v as Record<string, unknown>;
  return typeof r.runId === 'string' && typeof r.startedAt === 'string' && typeof r.status === 'string';
}

function deepClone<T>(value: T): T {
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    return value;
  }
}

function newRecord(runId: string, opts: BeginForensicRunOptions): ForensicRunRecord {
  const now = iso();
  return {
    runId,
    sessionId: _sessionId,
    runtimeId: opts.runtimeId ?? FORENSIC_RUNTIME_ID,
    buildId: opts.buildId ?? null,
    benchmarkVersion: opts.benchmarkVersion ?? FORENSIC_BENCHMARK_VERSION,
    runtimeSchemaVersion: opts.runtimeSchemaVersion ?? FORENSIC_RUNTIME_SCHEMA_VERSION,
    startedAt: now,
    lastUpdatedAt: now,
    lastHeartbeat: now,
    finishedAt: null,
    status: 'RUNNING',
    currentPhase: opts.phase ?? null,
    currentCategory: opts.category ?? null,
    completedCategories: [],
    lastMilestone: null,
    milestones: [],
    interruption: null,
    deviceHealth: null,
    partialResults: {},
    partialResultKeys: [],
    error: null,
    recoveredAt: null,
    persistenceFailures: 0,
  };
}

interface ArchiveState {
  runs: ForensicRunRecord[];
  corrupted: boolean;
  raw: string | null;
  readError: string | null;
}

function readArchive(): ArchiveState {
  const s = storage();
  if (!s) return { runs: [], corrupted: false, raw: null, readError: null };
  let raw: string | null = null;
  try {
    raw = s.getItem(FORENSIC_RUNS_KEY);
  } catch (err) {
    return { runs: [], corrupted: false, raw: null, readError: errMsg(err) };
  }
  if (raw === null || raw === '') return { runs: [], corrupted: false, raw, readError: null };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { runs: [], corrupted: true, raw, readError: null };
    const runs = parsed.filter(isRecord) as ForensicRunRecord[];
    const corrupted = parsed.some((p) => !isRecord(p));
    return { runs, corrupted, raw, readError: null };
  } catch {
    return { runs: [], corrupted: true, raw, readError: null };
  }
}

function writeArchive(runs: ForensicRunRecord[]): { ok: boolean; error: string | null } {
  const s = storage();
  if (!s) return { ok: false, error: 'no-forensic-storage' };
  let json: string;
  try {
    json = JSON.stringify(runs);
  } catch (err) {
    return { ok: false, error: errMsg(err) };
  }
  try {
    s.setItem(FORENSIC_RUNS_KEY, json);
    return { ok: true, error: null };
  } catch (err) {
    return { ok: false, error: errMsg(err) };
  }
}

function enforceRunLimit(runs: ForensicRunRecord[], activeRunId: string | null): ForensicRunRecord[] {
  const list = runs.slice();
  let guard = 0;
  while (list.length > MAX_HISTORICAL_RUNS && guard++ < 1000) {
    const idx = list.findIndex((r) => r.runId !== activeRunId);
    if (idx === -1) break;
    list.splice(idx, 1);
  }
  return list;
}

function enforceMilestoneLimit(runs: ForensicRunRecord[]): ForensicRunRecord[] {
  return runs.map((r) => {
    if (r.milestones && r.milestones.length > MAX_MILESTONES_PER_RUN) {
      return { ...r, milestones: r.milestones.slice(-MAX_MILESTONES_PER_RUN) };
    }
    return r;
  });
}

function enforceByteLimit(runs: ForensicRunRecord[], activeRunId: string | null): ForensicRunRecord[] {
  const list = deepClone(runs);
  let guard = 0;
  while (utf8Bytes(JSON.stringify(list)) > MAX_ARCHIVE_BYTES && guard++ < 500) {
    const idx = list.findIndex(
      (r) => r.runId !== activeRunId && r.status !== 'RUNNING' && (r.milestones.length > 0 || Object.keys(r.partialResults).length > 0)
    );
    if (idx === -1) break;
    list[idx] = { ...list[idx], milestones: [], partialResults: {}, partialResultKeys: [] };
  }
  return list;
}

function persistArchive(runs: ForensicRunRecord[], activeRunId: string | null): { ok: boolean; error: string | null } {
  let list = enforceRunLimit(runs, activeRunId);
  list = enforceMilestoneLimit(list);
  list = enforceByteLimit(list, activeRunId);
  let res = writeArchive(list);
  if (!res.ok) {
    const shrunk = list.map((r) =>
      r.runId === activeRunId ? { ...r, milestones: r.milestones.slice(-MAX_MILESTONES_PER_RUN) } : { ...r, milestones: [], partialResults: {}, partialResultKeys: [] }
    );
    res = writeArchive(enforceByteLimit(shrunk, activeRunId));
  }
  return res;
}

function persistActiveArchive(): boolean {
  const act = _active;
  if (!act) return false;
  const arch = readArchive();
  let runs: ForensicRunRecord[];
  if (arch.corrupted) {
    runs = [act];
  } else {
    runs = arch.runs.filter((r) => r.runId !== act.runId);
    runs.push(act);
  }
  const out = persistArchive(runs, act.runId);
  if (!out.ok) act.persistenceFailures += 1;
  return out.ok;
}

export function beginForensicRun(opts: BeginForensicRunOptions = {}): string | null {
  const runId = makeId();
  const rec = newRecord(runId, opts);
  _active = rec;
  const arch = readArchive();
  let runs: ForensicRunRecord[];
  if (arch.corrupted) {
    runs = [rec];
  } else {
    runs = arch.runs.filter((r) => r.runId !== runId);
    runs.push(rec);
  }
  const out = persistArchive(runs, runId);
  if (!out.ok) rec.persistenceFailures += 1;
  return runId;
}

export function appendForensicMilestone(state: string): void {
  const act = _active;
  if (!act) return;
  const m: ForensicMilestone = { t: iso(), state };
  act.milestones.push(m);
  if (act.milestones.length > MAX_MILESTONES_PER_RUN) {
    act.milestones = act.milestones.slice(-MAX_MILESTONES_PER_RUN);
  }
  act.lastMilestone = state;
  act.lastUpdatedAt = iso();
  persistActiveArchive();
}

export function updateForensicRun(patch: ForensicRunPatch): void {
  const act = _active;
  if (!act) return;
  if (patch.status !== undefined) act.status = patch.status;
  if (patch.currentPhase !== undefined) act.currentPhase = patch.currentPhase;
  if (patch.currentCategory !== undefined) act.currentCategory = patch.currentCategory;
  if (patch.completedCategories !== undefined) act.completedCategories = patch.completedCategories.slice();
  if (patch.lastHeartbeat !== undefined) act.lastHeartbeat = patch.lastHeartbeat;
  if (patch.deviceHealth !== undefined) act.deviceHealth = patch.deviceHealth;
  if (patch.partialResults !== undefined) act.partialResults = patch.partialResults;
  if (patch.partialResultKeys !== undefined) act.partialResultKeys = patch.partialResultKeys.slice();
  if (patch.interruption !== undefined) act.interruption = patch.interruption;
  if (patch.error !== undefined) act.error = patch.error;
  if (patch.finishedAt !== undefined) act.finishedAt = patch.finishedAt;
  act.lastUpdatedAt = iso();
  persistActiveArchive();
}

export function finalizeForensicRun(
  opts:
    | { status: 'COMPLETED'; deviceHealth?: ForensicDeviceHealth | null }
    | { status: 'INTERRUPTED'; interruption?: ForensicInterruption | null; error?: string | null; deviceHealth?: ForensicDeviceHealth | null }
): void {
  const act = _active;
  if (!act) return;
  act.status = opts.status;
  act.finishedAt = iso();
  act.lastUpdatedAt = iso();
  if (opts.deviceHealth !== undefined) act.deviceHealth = opts.deviceHealth;
  if (opts.status === 'INTERRUPTED') {
    if (opts.interruption !== undefined) act.interruption = opts.interruption;
    if (opts.error !== undefined) act.error = opts.error;
  }
  persistActiveArchive();
}

export function recoverOrphanedForensicRuns(): number {
  const arch = readArchive();
  if (arch.corrupted) return 0;
  let recovered = 0;
  let changed = false;
  for (const r of arch.runs) {
    if (r.status !== 'RUNNING') continue;
    if (r.sessionId === _sessionId) continue;
    let kind = 'PAGE_TERMINATED_OR_BROWSER_RELOADED';
    let reason =
      'Previous run was left RUNNING when the page terminated or reloaded; recovered by the forensic history layer on page load.';
    if (r.deviceHealth?.lost) {
      kind = 'WEBGPU_DEVICE_LOST';
      reason = `GPU device lost recovered from persisted forensic device health: ${r.deviceHealth.reason ?? ''}${r.deviceHealth.message ? ` — ${r.deviceHealth.message}` : ''}`.trim();
    }
    const recoveredAt = iso();
    const existing = r.interruption;
    const interruption: ForensicInterruption = existing
      ? { ...existing, recoveredAt }
      : { kind, reason, error: null, stack: null, at: r.lastUpdatedAt, recoveredAt };
    if (!existing) r.interruption = interruption;
    else r.interruption = existing;
    r.interruption = interruption;
    r.status = 'INTERRUPTED';
    r.recoveredAt = recoveredAt;
    r.lastUpdatedAt = recoveredAt;
    changed = true;
    recovered += 1;
  }
  if (changed) {
    const out = persistArchive(arch.runs, _active?.runId ?? null);
    if (!out.ok && _active) _active.persistenceFailures += 1;
  }
  return recovered;
}

export function getForensicRuns(): ForensicRunRecord[] {
  const arch = readArchive();
  return deepClone(arch.runs);
}

export function getForensicRun(runId: string): ForensicRunRecord | null {
  const arch = readArchive();
  const run = arch.runs.find((r) => r.runId === runId);
  return run ? deepClone(run) : null;
}

export function getLatestForensicRun(): ForensicRunRecord | null {
  const arch = readArchive();
  const run = arch.runs.length > 0 ? arch.runs[arch.runs.length - 1] : null;
  return run ? deepClone(run) : null;
}

export function getForensicMilestones(runId: string): ForensicMilestone[] {
  const run = getForensicRun(runId);
  return run ? deepClone(run.milestones ?? []) : [];
}

export function getForensicSnapshot(run?: ForensicRunRecord): ForensicSnapshot | null {
  const src = run ? deepClone(run) : getLatestForensicRun();
  if (!src) return null;
  return {
    runId: src.runId,
    buildId: src.buildId,
    runtimeId: src.runtimeId,
    benchmarkVersion: src.benchmarkVersion,
    runtimeSchemaVersion: src.runtimeSchemaVersion,
    status: src.status,
    startedAt: src.startedAt,
    lastUpdatedAt: src.lastUpdatedAt,
    finishedAt: src.finishedAt,
    currentPhase: src.currentPhase,
    currentCategory: src.currentCategory,
    completedCategories: (src.completedCategories ?? []).slice(),
    interruption: src.interruption ? deepClone(src.interruption) : null,
    lastMilestone: src.lastMilestone,
    milestoneCount: (src.milestones ?? []).length,
    deviceHealth: src.deviceHealth ? deepClone(src.deviceHealth) : null,
    partialResultKeys: (src.partialResultKeys ?? []).slice(),
    persistenceOk: src.persistenceFailures === 0 && storage() !== null,
    persistenceFailures: src.persistenceFailures,
    recoveredAt: src.recoveredAt,
  };
}

export function getForensicArchiveRaw(): string | null {
  const arch = readArchive();
  return arch.raw;
}

export function getForensicStorageStatus(): ForensicStorageStatus {
  const arch = readArchive();
  let runCount = 0;
  let activeRuns = 0;
  let incompleteRuns = 0;
  let completedRuns = 0;
  if (!arch.corrupted) {
    runCount = arch.runs.length;
    activeRuns = arch.runs.filter((r) => r.status === 'RUNNING').length;
    incompleteRuns = arch.runs.filter((r) => r.status === 'INTERRUPTED').length;
    completedRuns = arch.runs.filter((r) => r.status === 'COMPLETED').length;
  }
  return {
    archiveExists: arch.raw !== null && arch.raw !== '',
    corrupted: arch.corrupted,
    readError: arch.readError,
    runCount,
    activeRuns,
    incompleteRuns,
    completedRuns,
    archiveBytes: arch.raw !== null ? utf8Bytes(arch.raw) : 0,
    maxRuns: MAX_HISTORICAL_RUNS,
    maxMilestonesPerRun: MAX_MILESTONES_PER_RUN,
    maxArchiveBytes: MAX_ARCHIVE_BYTES,
  };
}

export function clearForensicHistory(): boolean {
  _active = null;
  const s = storage();
  if (!s) return false;
  try {
    s.removeItem(FORENSIC_RUNS_KEY);
    return true;
  } catch {
    return false;
  }
}

export function resetForensicActive(): void {
  _active = null;
}

export function getActiveForensicRunId(): string | null {
  return _active ? _active.runId : null;
}

export function getActiveForensicRun(): ForensicRunRecord | null {
  return _active ? deepClone(_active) : null;
}