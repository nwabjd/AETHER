// AETHER V3.1.3 — Crash-Safety: Runtime Diagnostics, Checkpointing, Interruption
//
// Production hardening for the FULL V3.1 benchmark after a mid-benchmark page
// refresh on iPhone. Responsibilities:
//
//   1. Global error capture (window.onerror / unhandledrejection) that records
//      `AETHER_RUNTIME_ERROR = {timestamp, phase, category, test, error, stack}`
//      while still suppressing the default browser error dialog.
//   2. WebGPU device.lost monitoring -> exports `deviceHealth`.
//   3. GPUBuffer lifecycle registry so failed/interrupted benchmarks release
//      resources (GPUBuffer.destroy() in finally blocks).
//   4. `aether_v313_checkpoint` in localStorage — LIGHTWEIGHT metadata only
//      (no tensors, no weights): status, heartbeat, current phase/category/test,
//      completed categories, partial result sections, interruption record.
//   5. Interruption classification A–J. When no JS handler survives a pending
//      run (page terminated/browser reloaded) the checkpoint alone determines
//      the classification — never fabricate a JS error.
//   6. Fail-closed certification: any interruption marks certificationStatus
//      FAILED.
//   7. Conservative memory-limit guards so single buffers never exceed the
//      device maxBufferSize (~256 MiB on iPhone); callers report
//      UNSUPPORTED / RESOURCE_LIMIT / UNMEASURABLE instead of crashing.
//
// The module is deliberately free of imports from perf-v3/perf-v3-llm to avoid
// import cycles; it only reads structural types from results-v3.ts and works
// with a plain Record for partial results.

// ─── Interruption classification (A–J) ────────────────────────────────────

export type InterruptionKind =
  | 'JAVASCRIPT_EXCEPTION'             // A
  | 'UNHANDLED_REJECTION'              // B
  | 'WEBGPU_DEVICE_LOST'               // C
  | 'GPU_VALIDATION_ERROR'             // D
  | 'RESOURCE_LIMIT'                   // E
  | 'MEMORY_LIMIT'                     // F
  | 'APPLICATION_NAVIGATION'           // G
  | 'SERVICE_WORKER_RELOAD'            // H
  | 'PAGE_TERMINATED_OR_BROWSER_RELOADED' // I
  | 'TRANSFORMER_SUITE_RESOURCE_LIMIT' // K — controlled guard abort, NOT a crash
  | 'UNKNOWN';                         // J

export const INTERRUPTION_KINDS: InterruptionKind[] = [
  'JAVASCRIPT_EXCEPTION',
  'UNHANDLED_REJECTION',
  'WEBGPU_DEVICE_LOST',
  'GPU_VALIDATION_ERROR',
  'RESOURCE_LIMIT',
  'MEMORY_LIMIT',
  'APPLICATION_NAVIGATION',
  'SERVICE_WORKER_RELOAD',
  'PAGE_TERMINATED_OR_BROWSER_RELOADED',
  'TRANSFORMER_SUITE_RESOURCE_LIMIT',
  'UNKNOWN',
];

// ─── Types ───────────────────────────────────────────────────────────────

export interface RuntimeErrorRecord {
  timestamp: string;
  phase: string | null;
  category: string | null;
  test: string | null;
  error: string;
  stack: string | null;
}

export interface DeviceHealth {
  lost: boolean;
  reason?: string;
  message?: string;
}

export interface InterruptionInfo {
  kind: InterruptionKind;
  reason: string;
  error: string | null;
  stack: string | null;
  at: string;
}

export interface PartialResults {
  [category: string]: unknown;
}

export interface Checkpoint {
  schemaVersion: 1;
  runtime: 'V3' | 'V3.1';
  mode: 'quick' | 'full';
  buildId: string | null;
  startedAt: string;
  lastHeartbeat: string;
  status: 'RUNNING' | 'INTERRUPTED' | 'COMPLETED';
  currentPhase: string | null;
  currentCategory: string | null;
  currentTest: string | null;
  completedCategories: string[];
  partialResults: PartialResults;
  interruption: InterruptionInfo | null;
  certificationStatus: 'FAILED' | null;
}

export interface ResumeContext {
  completed: string[];
  partial: PartialResults;
}

// ─── Constants ───────────────────────────────────────────────────────────

export const CHECKPOINT_KEY = 'aether_v313_checkpoint';
export const RUNTIME_ERROR_GLOBAL = 'AETHER_RUNTIME_ERROR';
export const DEVICE_HEALTH_GLOBAL = 'AETHER_DEVICE_HEALTH';

// iPhone-class WebGPU devices report maxBufferSize ≈ 256 MiB. Never create a
// single GPUBuffer above the device limit (or this portability floor).
export const MAX_SAFE_BUFFER_BYTES = 256 * 1024 * 1024;
export const DEFAULT_ASSUMED_MAX_BUFFER = 256 * 1024 * 1024;

// ─── Module state ────────────────────────────────────────────────────────

interface InternalRuntimeError extends RuntimeErrorRecord {
  kind: InterruptionKind | null;
}

let _runtimeError: InternalRuntimeError | null = null;
let _deviceHealth: DeviceHealth = { lost: false };
let _activeCheckpoint: Checkpoint | null = null;
let _buffers = new Set<GPUBuffer>();
let _ticker: ReturnType<typeof setInterval> | null = null;
let _storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null = null;

function resolveStorage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null {
  if (_storage) return _storage;
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
  } catch {
    // localStorage can throw in private browsing / sandboxed iframes
  }
  return null;
}

/** Test hook: inject a fake storage backend (in-memory Map-backed object). */
export function setStorageForTests(s: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null) {
  _storage = s;
}

// ─── Global error capture ────────────────────────────────────────────────

function recordErrorInternal(
  kind: InterruptionKind | null,
  error: string,
  where: string | null,
  stack: string | null,
  evtKind: 'error' | 'rejection'
) {
  const cp = _activeCheckpoint;
  _runtimeError = {
    timestamp: new Date().toISOString(),
    phase: cp?.currentPhase ?? null,
    category: cp?.currentCategory ?? null,
    test: cp?.currentTest ?? null,
    error: `${error}${where ? ` @ ${where}` : ''}`,
    stack,
    kind,
  };
  try {
    (globalThis as Record<string, unknown>)[RUNTIME_ERROR_GLOBAL] = {
      timestamp: _runtimeError.timestamp,
      phase: _runtimeError.phase,
      category: _runtimeError.category,
      test: _runtimeError.test,
      error: _runtimeError.error,
      stack: _runtimeError.stack,
    };
  } catch {
    // ignore when globalThis is sealed in hostile environments
  }
  // Classify immediately so page death still leaves a usable record.
  const kind2: InterruptionKind = evtKind === 'rejection' ? 'UNHANDLED_REJECTION' : kind ?? 'JAVASCRIPT_EXCEPTION';
  const r = recordRuntimeErrorRecord(kind2, error, where, stack);
  void r;
}

/**
 * Replaces the old `e.preventDefault()`-only handlers in screen.ts. Still
 * prevents the crash dialog, but now records the failure for forensics.
 */
export function installGlobalErrorCapture(): () => void {
  if (typeof window === 'undefined') return () => { /* no-op in Node tests */ };

  const handleError = (e: Event) => {
    const evt = e as ErrorEvent;
    const msg = evt.message ?? String(e);
    const where = evt.filename && evt.lineno ? `${evt.filename}:${evt.lineno}` : null;
    const err = evt.error as Error | undefined;
    recordErrorInternal('JAVASCRIPT_EXCEPTION', msg, where, err?.stack ?? null, 'error');
    e.preventDefault();
  };
  const handleRejection = (e: Event) => {
    const evt = e as PromiseRejectionEvent;
    const reason: unknown = evt.reason;
    const msg = reason instanceof Error ? reason.message : typeof reason === 'string' ? reason : 'Unhandled promise rejection';
    const err = reason instanceof Error ? reason : undefined;
    recordErrorInternal('UNHANDLED_REJECTION', msg, null, err?.stack ?? null, 'rejection');
    e.preventDefault();
  };

  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleRejection);
  return () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleRejection);
  };
}

export function getRuntimeError(): RuntimeErrorRecord | null {
  if (!_runtimeError) return null;
  const { kind: _kind, ...record } = _runtimeError;
  return record;
}

export function clearRuntimeError() {
  _runtimeError = null;
  try {
    delete (globalThis as Record<string, unknown>)[RUNTIME_ERROR_GLOBAL];
  } catch {
    // ignore
  }
}

// ─── WebGPU device.lost monitoring ───────────────────────────────────────

/**
 * Attaches a `lost` listener. The device is typed loosely so tests can pass a
 * fake object implementing addEventListener/removeEventListener.
 */
export function monitorDeviceLost(device: unknown): () => void {
  if (!device || typeof (device as GPUDevice).addEventListener !== 'function') {
    return () => { /* nothing to monitor */ };
  }
  _deviceHealth = { lost: false };
  const d = device as GPUDevice;
  const onLost = (ev: unknown) => {
    const e = ev as { reason?: string; message?: string };
    const reason = e?.reason ?? 'unknown';
    const message = e?.message ?? '';
    _deviceHealth = { lost: true, reason, message };
    try {
      (globalThis as Record<string, unknown>)[DEVICE_HEALTH_GLOBAL] = _deviceHealth;
    } catch {
      // ignore
    }
    if (_activeCheckpoint && _activeCheckpoint.status === 'RUNNING') {
      finalizeInterrupted('WEBGPU_DEVICE_LOST', `GPU device lost: ${reason}${message ? ` — ${message}` : ''}`);
    }
  };
  try {
    d.addEventListener('lost', onLost);
  } catch {
    // some devices reject the listener registration; ignore
  }
  return () => {
    try {
      d.removeEventListener('lost', onLost);
    } catch {
      // ignore
    }
  };
}

export function getDeviceHealth(): DeviceHealth {
  return { ..._deviceHealth };
}

// ─── GPUBuffer lifecycle registry ────────────────────────────────────────

/** Register a buffer so crash-safety can destroy it if the run dies. */
export function trackBuffer(buf: GPUBuffer | null | undefined): GPUBuffer | null | undefined {
  if (buf) _buffers.add(buf);
  return buf;
}

export function releaseTrackedBuffers() {
  for (const b of _buffers) {
    try {
      b.destroy();
    } catch {
      // ignore double-destroy
    }
  }
  _buffers.clear();
}

export function trackedBufferCount(): number {
  return _buffers.size;
}

// ─── Memory-limit guards ─────────────────────────────────────────────────

export function deviceMaxBufferBytes(device: unknown): number {
  try {
    const limits = (device as GPUDevice | null | undefined)?.limits;
    if (limits && typeof limits.maxBufferSize === 'number') {
      return Math.max(limits.maxBufferSize, 1);
    }
  } catch {
    // ignore
  }
  return DEFAULT_ASSUMED_MAX_BUFFER;
}

export function effectiveMaxBufferBytes(device: unknown): number {
  return Math.min(deviceMaxBufferBytes(device), MAX_SAFE_BUFFER_BYTES);
}

/**
 * Estimate whether a workload buffer fits the device (CPU-side staging +
 * GPU-side storage must each stay under the cap). Returns {fit, maxBytes}.
 */
export function estimateBufferFit(device: unknown, requiredBytes: number): { fit: boolean; reason: string; maxBytes: number } {
  const max = effectiveMaxBufferBytes(device);
  if (!Number.isFinite(requiredBytes) || requiredBytes <= 0) {
    return { fit: true, reason: '', maxBytes: max };
  }
  if (requiredBytes > max) {
    return {
      fit: false,
      reason: `RESOURCE_LIMIT: workload needs ${requiredBytes} bytes > device buffer cap ${max} bytes`,
      maxBytes: max,
    };
  }
  return { fit: true, reason: '', maxBytes: max };
}

/** Conservative floor check run once at benchmark start. */
export function checkResourceFloor(device: unknown): { ok: boolean; reason: string | null } {
  const max = deviceMaxBufferBytes(device);
  // Portability floor: modern mobile-class WebGPU always advertises >= 256 MiB.
  if (max < 4 * 1024 * 1024) {
    return { ok: false, reason: `RESOURCE_LIMIT: device maxBufferSize ${max} bytes is below the AETHER portability floor (4 MiB)` };
  }
  return { ok: true, reason: null };
}

// ─── Checkpoint lifecycle ────────────────────────────────────────────────

function persistCheckpoint() {
  const s = resolveStorage();
  if (!s || !_activeCheckpoint) return;
  try {
    s.setItem(CHECKPOINT_KEY, JSON.stringify(_activeCheckpoint));
  } catch {
    // quota exceeded / private mode — checkpoint is best-effort only
  }
}

function loadCheckpoint(): Checkpoint | null {
  const s = resolveStorage();
  if (!s) return null;
  try {
    const raw = s.getItem(CHECKPOINT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Checkpoint;
    if (parsed && parsed.schemaVersion === 1 && parsed.status) return parsed;
    return null;
  } catch {
    return null;
  }
}

export interface BeginOptions {
  /**
   * Crash-safety resume: categories in `completed` that also have a value in
   * `partial` are skipped by the runner; everything else is re-measured.
   */
  resume?: ResumeContext;
}

export function beginBenchmark(runtime: 'V3' | 'V3.1', mode: 'quick' | 'full', opts?: BeginOptions, buildId: string | null = null): void {
  const resumeContext = opts?.resume;
  const previous = resumeContext ? loadCheckpoint() : null;
  clearCheckpointStorage();
  _activeCheckpoint = {
    schemaVersion: 1,
    runtime,
    mode,
    buildId: buildId ?? previous?.buildId ?? null,
    startedAt: previous?.startedAt ?? new Date().toISOString(),
    lastHeartbeat: new Date().toISOString(),
    status: 'RUNNING',
    currentPhase: 'RUNNING',
    currentCategory: null,
    currentTest: null,
    completedCategories: resumeContext ? [...resumeContext.completed] : [],
    partialResults: resumeContext ? { ...resumeContext.partial } : {},
    interruption: null,
    certificationStatus: null,
  };
  clearRuntimeError();
  _deviceHealth = { lost: false };
  releaseTrackedBuffers();
  persistCheckpoint();
}

export function getCheckpoint(): Checkpoint | null {
  return _activeCheckpoint ? { ..._activeCheckpoint, partialResults: { ..._activeCheckpoint.partialResults } } : null;
}

/** A checkpoint that indicates a run that never finished (for the banner). */
export function getPendingRun(): Checkpoint | null {
  const cp = loadCheckpoint();
  if (!cp) return null;
  if (cp.status === 'RUNNING' || cp.status === 'INTERRUPTED') return cp;
  return null;
}

export function checkpointCategory(category: string, data: unknown): void {
  if (!_activeCheckpoint) return;
  _activeCheckpoint.partialResults[category] = data;
  if (!_activeCheckpoint.completedCategories.includes(category)) {
    _activeCheckpoint.completedCategories.push(category);
  }
  _activeCheckpoint.lastHeartbeat = new Date().toISOString();
  persistCheckpoint();
}

export interface HeartbeatState {
  phase: string | null;
  category: string | null;
  test: string | null;
}

export function heartbeat(state: Partial<HeartbeatState> = {}): void {
  if (!_activeCheckpoint) return;
  if (state.phase !== undefined) _activeCheckpoint.currentPhase = state.phase;
  if (state.category !== undefined) _activeCheckpoint.currentCategory = state.category;
  if (state.test !== undefined) _activeCheckpoint.currentTest = state.test;
  _activeCheckpoint.lastHeartbeat = new Date().toISOString();
  persistCheckpoint();
}

export function elapsedMs(): number {
  if (!_activeCheckpoint) return 0;
  return Math.max(Date.now() - new Date(_activeCheckpoint.startedAt).getTime(), 0);
}

export function completeBenchmark(): void {
  if (!_activeCheckpoint) return;
  _activeCheckpoint.status = 'COMPLETED';
  _activeCheckpoint.certificationStatus = null;
  _activeCheckpoint.lastHeartbeat = new Date().toISOString();
  persistCheckpoint();
  releaseTrackedBuffers();
}

export function finalizeInterrupted(kind: InterruptionKind, reason: string, error: string | null = null, stack: string | null = null): void {
  if (!_activeCheckpoint) return;
  _activeCheckpoint.status = 'INTERRUPTED';
  _activeCheckpoint.certificationStatus = 'FAILED';
  _activeCheckpoint.interruption = {
    kind,
    reason,
    error,
    stack,
    at: new Date().toISOString(),
  };
  _activeCheckpoint.lastHeartbeat = new Date().toISOString();
  persistCheckpoint();
  releaseTrackedBuffers();
}

/** Explicit app-driven interrupt (e.g. navigation leaving the page). */
export function interrupt(kind: InterruptionKind, reason: string, error: Error | null = null): void {
  finalizeInterrupted(kind, reason, error?.message ?? null, error?.stack ?? null);
}

export function clearInterruptedRun(): void {
  clearCheckpointStorage();
  _activeCheckpoint = null;
  clearRuntimeError();
  releaseTrackedBuffers();
}

function clearCheckpointStorage(): void {
  const s = resolveStorage();
  if (!s) return;
  try {
    s.removeItem(CHECKPOINT_KEY);
  } catch {
    // ignore
  }
}

// ─── Interruption classifier ─────────────────────────────────────────────

interface GuardAbortedBlockInfo {
  names: string[];
}

/**
 * Detect transformer blocks that were aborted BEFORE allocation by the safe
 * transformer memory guard (transformer-guard.ts). A controlled abort is a
 * distinct, first-class state — it must NEVER be misreported as a JavaScript
 * exception, a WebGPU device loss, or a generic page reload.
 */
function checkpointGuardAborted(checkpoint: Checkpoint | null): GuardAbortedBlockInfo | null {
  const blocks = checkpoint?.partialResults?.transformerBlocks;
  if (!Array.isArray(blocks)) return null;
  const names = blocks
    .filter((b: unknown) => {
      const bd = b as { config?: { name?: unknown }; resourceLimit?: unknown };
      return !!bd && typeof bd === 'object' && bd.config && typeof bd.config.name === 'string' && !!bd.resourceLimit;
    })
    .map((b) => (b as { config: { name: string } }).config.name);
  return names.length > 0 ? { names } : null;
}

/**
 * Given a checkpoint (default: the pending one), classify how the previous
 * run ended using the strongest evidence available. If only a RUNNING
 * checkpoint survives with no JS error and no device-loss record, classify
 * `PAGE_TERMINATED_OR_BROWSER_RELOADED` — NOT a fabricated JS exception.
 */
export function classifyInterruption(cp: Checkpoint | null = null): InterruptionInfo {
  const checkpoint = cp ?? loadCheckpoint();
  if (checkpoint?.interruption) {
    return checkpoint.interruption;
  }
  const err = getRuntimeError();
  if (_deviceHealth.lost) {
    return {
      kind: 'WEBGPU_DEVICE_LOST',
      reason: _deviceHealth.reason ?? 'device lost',
      error: _deviceHealth.message ?? null,
      stack: null,
      at: new Date().toISOString(),
    };
  }
  // DISTINCT controlled-abort classification: the run reached the 7B block,
  // the guard rejected it before allocation (resourceLimit recorded in the
  // checkpointed transformerBlocks), and the page later died or was reloaded
  // before a JavaScript handler could finalize. This is NOT a JS/driver crash.
  const guardAborted = checkpointGuardAborted(checkpoint);
  if (guardAborted) {
    return {
      kind: 'TRANSFORMER_SUITE_RESOURCE_LIMIT',
      reason: `Safe transformer memory guard aborted required block(s) ${guardAborted.names.join(', ')} BEFORE allocation (resourceLimit) — a controlled resource-limit abort, NOT a JavaScript exception, device loss, or random page reload. The page then terminated/reloaded before the run could finalize.`,
      error: err ? err.error : null,
      stack: err?.stack ?? null,
      at: new Date().toISOString(),
    };
  }
  if (checkpoint && checkpoint.status === 'RUNNING') {
    // No JS handler survived long enough to write INTERRUPTED.
    return {
      kind: 'PAGE_TERMINATED_OR_BROWSER_RELOADED',
      reason: 'The page was terminated or reloaded during the benchmark with no surviving JavaScript handler. No checkpoint was finalized — data above is the last consistent state.',
      error: err ? err.error : null,
      stack: err?.stack ?? null,
      at: new Date().toISOString(),
    };
  }
  if (err) {
    const msg = `${err.error} ${err.stack ?? ''}`.toLowerCase();
    if (msg.includes('validation')) {
      return { kind: 'GPU_VALIDATION_ERROR', reason: err.error, error: err.error, stack: err.stack, at: err.timestamp };
    }
    if (msg.includes('limit') && (msg.includes('alloc') || msg.includes('buffer') || msg.includes('memory'))) {
      return { kind: 'RESOURCE_LIMIT', reason: err.error, error: err.error, stack: err.stack, at: err.timestamp };
    }
    return { kind: 'JAVASCRIPT_EXCEPTION', reason: err.error, error: err.error, stack: err.stack, at: err.timestamp };
  }
  return { kind: 'UNKNOWN', reason: 'No crash evidence recorded.', error: null, stack: null, at: new Date().toISOString() };
}

function recordRuntimeErrorRecord(kind: InterruptionKind, error: string, where: string | null, stack: string | null): InterruptionInfo | null {
  if (!_activeCheckpoint) return null;
  finalizeInterrupted(kind, `${error}${where ? ` @ ${where}` : ''}`, error, stack);
  return _activeCheckpoint.interruption;
}

// ─── Heartbeat ticker (few-second cadence) ───────────────────────────────

export function startHeartbeatTicker(intervalMs = 3000): () => void {
  stopHeartbeatTicker();
  if (typeof setInterval === 'undefined') return () => {};
  _ticker = setInterval(() => {
    if (_activeCheckpoint && _activeCheckpoint.status === 'RUNNING') {
      _activeCheckpoint.lastHeartbeat = new Date().toISOString();
      persistCheckpoint();
    }
  }, intervalMs);
  return () => stopHeartbeatTicker();
}

export function stopHeartbeatTicker(): void {
  if (_ticker !== null && typeof clearInterval === 'function') {
    clearInterval(_ticker);
    _ticker = null;
  }
}

// ─── Test hooks ──────────────────────────────────────────────────────────

export function resetForTests(preserveStorage = false): void {
  _runtimeError = null;
  _deviceHealth = { lost: false };
  _activeCheckpoint = null;
  _buffers.clear();
  stopHeartbeatTicker();
  if (!preserveStorage) clearCheckpointStorage();
  try {
    delete (globalThis as Record<string, unknown>)[RUNTIME_ERROR_GLOBAL];
    delete (globalThis as Record<string, unknown>)[DEVICE_HEALTH_GLOBAL];
  } catch {
    // ignore
  }
}