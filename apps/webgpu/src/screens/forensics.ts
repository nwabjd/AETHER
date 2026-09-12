// AETHER V3.1.3 — Forensic History Viewer (persistent run archive)
//
// Read-only diagnostic screen reached via #forensics. It NEVER starts a
// benchmark, never initialises WebGPU, and never purges service workers.
// It reads the crash-safety checkpoint, the transformer milestones, the
// session-memory device-health/error globals, and the persistent forensic
// run archive (aether_v313_forensic_runs). The ONLY write this screen ever
// performs is CLEAR FORENSIC HISTORY (two-step confirm), which deletes that
// one archive key — never the checkpoint or milestone keys.

import {
  clearForensicHistory,
  getActiveForensicRunId,
  getForensicArchiveRaw,
  getForensicRun,
  getForensicRuns,
  getForensicSnapshot,
  getForensicStorageStatus,
  getLatestForensicRun,
  FORENSIC_RUNS_KEY,
  recoverOrphanedForensicRuns,
  type ForensicRunRecord,
  type ForensicSnapshot,
} from '../benchmark/forensic-history';

const CHECKPOINT_KEY = 'aether_v313_checkpoint';
const MILESTONES_KEY = 'aether_v313_milestones';
const RUNTIME_ERROR_GLOBAL = 'AETHER_RUNTIME_ERROR';
const DEVICE_HEALTH_GLOBAL = 'AETHER_DEVICE_HEALTH';

interface StorageRead {
  ok: boolean;
  value: string | null;
  error: string | null;
}

function storageGet(key: string): StorageRead {
  try {
    if (typeof localStorage === 'undefined') {
      return { ok: true, value: null, error: null };
    }
    return { ok: true, value: localStorage.getItem(key), error: null };
  } catch (err) {
    return { ok: false, value: null, error: err instanceof Error ? err.message : String(err) };
  }
}

function utf8Bytes(s: string): number {
  try {
    return new TextEncoder().encode(s).length;
  } catch {
    return s.length;
  }
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function jsonText(s: string | null): string {
  if (s === null) return '';
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch {
    return '';
  }
}

function parseErr(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function cell(label: string, value: string): string {
  return `<div class="row" style="display:flex;justify-content:space-between;gap:12px;padding:2px 0">
    <span style="color:var(--text-dim);font-family:var(--mono);font-size:11px;flex:0 0 190px">${esc(label)}</span>
    <span style="color:var(--text);font-family:var(--mono);font-size:12px;word-break:break-all;text-align:right">${esc(value)}</span>
  </div>`;
}

function section(title: string, body: string): string {
  return `<div class="card" style="margin-top:14px">
    <div class="card-title" style="color:var(--text);font-weight:700;margin-bottom:8px">${esc(title)}</div>
    ${body}
  </div>`;
}

function readGlobal(name: string): string | null {
  try {
    const g = globalThis as Record<string, unknown>;
    const v = g[name];
    if (v === undefined || v === null) return null;
    return JSON.stringify(v, null, 2);
  } catch {
    return null;
  }
}

function shortId(runId: string): string {
  return runId.length > 8 ? runId.slice(0, 8) : runId;
}

function statusBadge(status: string): string {
  const color = status === 'COMPLETED' ? 'var(--green)' : status === 'INTERRUPTED' ? 'var(--yellow)' : 'var(--accent, var(--blue))';
  return `<span style="display:inline-block;padding:1px 8px;border-radius:20px;background:rgba(127,127,127,.10);border:1px solid ${color};color:${color};font-family:var(--mono);font-size:11px;font-weight:700">${esc(status)}</span>`;
}

function snapshotBlock(snap: ForensicSnapshot | null, activeRunId: string | null): string {
  if (!snap) {
    return `<div style="color:var(--text-dim);font-size:13px">No forensic run record found. Run the V3.1 benchmark once to create a durable history entry.</div>`;
  }
  const inter = snap.interruption;
  const recoveryNote = snap.recoveredAt
    ? `<div style="margin-top:4px"><span style="color:var(--text-dim);font-family:var(--mono);font-size:11px">recoveredAt</span><pre style="margin:4px 0 0;padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-family:var(--mono);font-size:11px;color:var(--yellow);white-space:pre-wrap;word-break:break-all">${esc(snap.recoveredAt)}</pre></div>`
    : '';
  const interBlock = inter
    ? `<div style="margin-top:4px"><span style="color:var(--text-dim);font-family:var(--mono);font-size:11px">interruption</span><pre style="margin:4px 0 0;padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-family:var(--mono);font-size:11px;color:var(--yellow);white-space:pre-wrap;word-break:break-all">${esc(JSON.stringify(inter, null, 2))}</pre></div>`
    : `<div style="color:var(--text-dim);font-size:12px">interruption: none recorded</div>`;
  const activeNote = activeRunId === snap.runId ? `<div style="color:var(--blue);font-size:12px;margin-top:2px">CURRENT SESSION RUN (still active in this page)</div>` : '';
  return [
    cell('status', `${snap.status}${activeNote ? ' — currently RUNNING' : ''}`),
    cell('runId', `${shortId(snap.runId)} (${snap.runId})`),
    cell('buildId', snap.buildId ?? 'n/a'),
    cell('runtimeId', snap.runtimeId),
    cell('benchmarkVersion', snap.benchmarkVersion),
    cell('runtimeSchemaVersion', snap.runtimeSchemaVersion),
    cell('startedAt', snap.startedAt),
    cell('lastUpdatedAt', snap.lastUpdatedAt),
    cell('finishedAt', snap.finishedAt ?? '— (never finalized)'),
    cell('currentPhase', snap.currentPhase ?? '—'),
    cell('currentCategory', snap.currentCategory ?? '—'),
    cell('lastMilestone', snap.lastMilestone ?? '—'),
    cell('milestoneCount', String(snap.milestoneCount)),
    cell('completedCategories', snap.completedCategories.length > 0 ? `${snap.completedCategories.length} — ${snap.completedCategories.join(', ')}` : 'none'),
    cell('partialResultKeys', snap.partialResultKeys.length > 0 ? `${snap.partialResultKeys.length} — ${snap.partialResultKeys.join(', ')}` : 'none'),
    cell('deviceHealth', snap.deviceHealth?.lost ? `LOST — ${snap.deviceHealth.reason ?? ''} ${snap.deviceHealth.message ?? ''}`.trim() : 'ok'),
    cell('persistence', snap.persistenceOk ? `ok (failures: ${snap.persistenceFailures})` : `FAILED (failures: ${snap.persistenceFailures})`),
    activeNote,
    interBlock,
    recoveryNote,
  ].join('');
}

function milestonesBlock(run: ForensicRunRecord | null): string {
  if (!run) {
    return `<div style="color:var(--text-dim);font-size:13px">No run selected.</div>`;
  }
  const all = run.milestones ?? [];
  if (all.length === 0) {
    return `<div style="color:var(--text-dim);font-size:13px">No persisted milestones for this run.</div>`;
  }
  const last25 = all.slice(-25);
  const rows = last25
    .map((m, i) => {
      const globalIndex = all.length - last25.length + i + 1;
      const isFinal = i === last25.length - 1;
      const state = typeof m === 'object' && m !== null && typeof m.state === 'string' ? m.state : String(m);
      const t = typeof m === 'object' && m !== null && typeof m.t === 'string' ? m.t : '';
      return `<div style="padding:4px 8px;border-radius:6px;margin-top:4px;${isFinal ? 'background:rgba(234,179,8,.14);border:1px solid var(--yellow)' : 'background:var(--bg);border:1px solid var(--border)'}">
        <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
          <span style="color:var(--text-dim);font-family:var(--mono);font-size:11px">#${globalIndex}${isFinal ? ' ★ FINAL MILESTONE' : ''}</span>
          <span style="color:var(--text-dim);font-family:var(--mono);font-size:11px">${esc(t)}</span>
        </div>
        <div style="color:${isFinal ? 'var(--yellow)' : 'var(--text)'};font-family:var(--mono);font-size:12px;margin-top:2px;font-weight:${isFinal ? '700' : '400'}">${esc(state)}</div>
      </div>`;
    })
    .join('');
  const totalLine =
    all.length > 25
      ? `<div style="color:var(--text-dim);font-size:12px;margin-bottom:4px">Run milestones: <b style="color:var(--text)">${all.length}</b> — showing the last 25, chronological oldest → newest.</div>`
      : `<div style="color:var(--text-dim);font-size:12px;margin-bottom:4px">Run milestones: <b style="color:var(--text)">${all.length}</b></div>`;
  return `${totalLine}${rows}`;
}

// ─── Legacy evidence (checkpoint / milestone keys / session memory) ──────

function checkpointSection(): string {
  const cpRead = storageGet(CHECKPOINT_KEY);
  const cpRaw = cpRead.ok ? cpRead.value : null;

  if (!cpRead.ok) {
    return `<div style="color:var(--red);font-family:var(--mono);font-size:12px">localStorage read failed: ${esc(cpRead.error ?? 'unknown error')}</div>`;
  }
  if (cpRaw === null || cpRaw === '') {
    return `<div style="color:var(--text-dim);font-size:13px">No persisted checkpoint found. Either the run never started, or its checkpoint was already consumed/cleared.</div>`;
  }
  let parsed: Record<string, unknown> | null = null;
  let parseError: string | null = null;
  try {
    const p = JSON.parse(cpRaw) as unknown;
    if (p && typeof p === 'object') parsed = p as Record<string, unknown>;
  } catch (err) {
    parseError = parseErr(err);
  }

  const parsedBlock = parsed
    ? (() => {
        const partial = parsed['partialResults'];
        const partialKeys = partial && typeof partial === 'object' ? Object.keys(partial as Record<string, unknown>) : [];
        const inter = parsed['interruption'];
        const interBlock =
          inter && typeof inter === 'object'
            ? `<div style="margin-top:4px"><span style="color:var(--text-dim);font-family:var(--mono);font-size:11px">interruption</span><pre style="margin:4px 0 0;padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-family:var(--mono);font-size:11px;color:var(--yellow);white-space:pre-wrap;word-break:break-all">${esc(JSON.stringify(inter, null, 2))}</pre></div>`
            : `<div style="color:var(--text-dim);font-size:12px">interruption: none recorded</div>`;
        return [
          cell('status', String(parsed['status'] ?? 'n/a')),
          cell('schemaVersion', String(parsed['schemaVersion'] ?? 'n/a')),
          cell('runtime', String(parsed['runtime'] ?? 'n/a')),
          cell('mode', String(parsed['mode'] ?? 'n/a')),
          cell('buildId', String(parsed['buildId'] ?? 'n/a')),
          cell('startedAt', String(parsed['startedAt'] ?? 'n/a')),
          cell('lastHeartbeat', String(parsed['lastHeartbeat'] ?? 'n/a')),
          cell('currentPhase', String(parsed['currentPhase'] ?? 'n/a')),
          cell('currentCategory', String(parsed['currentCategory'] ?? 'n/a')),
          cell('currentTest', String(parsed['currentTest'] ?? 'n/a')),
          cell('completedCategories', Array.isArray(parsed['completedCategories']) ? (parsed['completedCategories'] as string[]).join(', ') : String(parsed['completedCategories'] ?? 'n/a')),
          cell('certificationStatus', String(parsed['certificationStatus'] ?? 'n/a')),
          cell('partialResults keys', partialKeys.length > 0 ? `${partialKeys.length} — ${partialKeys.join(', ')}` : 'none'),
          interBlock,
        ].join('');
      })()
    : `<div style="color:var(--red);font-family:var(--mono);font-size:12px">CHECKPOINT PARSE FAILED: ${esc(parseError ?? 'unknown')} — showing raw JSON only.</div>`;

  const rawBlock = `<pre style="margin:0;padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-family:var(--mono);font-size:11px;color:var(--text);white-space:pre-wrap;word-break:break-all">${esc(jsonText(cpRaw) || cpRaw)}</pre>`;
  return `${parsedBlock}<div style="color:var(--text-dim);font-family:var(--mono);font-size:11px;margin-top:10px;text-transform:uppercase;letter-spacing:.4px">Raw checkpoint JSON</div>${rawBlock}`;
}

function milestoneKeySection(): string {
  const msRead = storageGet(MILESTONES_KEY);
  const msRaw = msRead.ok ? msRead.value : null;

  if (!msRead.ok) {
    return `<div style="color:var(--red);font-family:var(--mono);font-size:12px">localStorage read failed: ${esc(msRead.error ?? 'unknown error')}</div>`;
  }
  if (msRaw === null || msRaw === '') {
    return `<div style="color:var(--text-dim);font-size:13px">No persisted milestone log found.</div>`;
  }
  let milestones: Array<{ t: string; state: string }> = [];
  let msError: string | null = null;
  try {
    const p = JSON.parse(msRaw) as unknown;
    if (Array.isArray(p)) milestones = p as Array<{ t: string; state: string }>;
  } catch (err) {
    msError = parseErr(err);
  }
  if (msError !== null) {
    return `<div style="color:var(--red);font-family:var(--mono);font-size:12px">MILESTONE LOG PARSE FAILED: ${esc(msError)}</div>`;
  }
  if (!Array.isArray(milestones) && msRaw.trim().startsWith('[')) {
    return `<div style="color:var(--red);font-family:var(--mono);font-size:12px">Milestone log is a JSON array but not in {t,state} shape.</div>`;
  }
  const total = milestones.length;
  const last25 = milestones.slice(-25);
  const rows = last25
    .map((m, i) => {
      const globalIndex = total - last25.length + i + 1;
      const isFinal = i === last25.length - 1;
      const state = typeof m === 'object' && m !== null && typeof m.state === 'string' ? m.state : String(m);
      const t = typeof m === 'object' && m !== null && typeof m.t === 'string' ? m.t : '';
      return `<div style="padding:4px 8px;border-radius:6px;margin-top:4px;${isFinal ? 'background:rgba(234,179,8,.14);border:1px solid var(--yellow)' : 'background:var(--bg);border:1px solid var(--border)'}">
        <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
          <span style="color:var(--text-dim);font-family:var(--mono);font-size:11px">#${globalIndex}${isFinal ? ' ★ FINAL MILESTONE' : ''}</span>
          <span style="color:var(--text-dim);font-family:var(--mono);font-size:11px">${esc(t)}</span>
        </div>
        <div style="color:${isFinal ? 'var(--yellow)' : 'var(--text)'};font-family:var(--mono);font-size:12px;margin-top:2px;font-weight:${isFinal ? '700' : '400'}">${esc(state)}</div>
      </div>`;
    })
    .join('');
  const totalLine =
    total > 25
      ? `<div style="color:var(--text-dim);font-size:12px;margin-bottom:4px">Persisted milestones: <b style="color:var(--text)">${total}</b> — showing the last 25, chronological oldest → newest.</div>`
      : `<div style="color:var(--text-dim);font-size:12px;margin-bottom:4px">Persisted milestones: <b style="color:var(--text)">${total}</b></div>`;
  return total === 0 ? `<div style="color:var(--text-dim);font-size:13px">Milestone log is an empty array.</div>` : `${totalLine}${rows}`;
}

function sessionExtrasSection(): string {
  const devErrRaw = readGlobal(RUNTIME_ERROR_GLOBAL);
  const devHealthRaw = readGlobal(DEVICE_HEALTH_GLOBAL);
  const sessionBlock =
    devErrRaw || devHealthRaw
      ? ''
      : `<div style="color:var(--text-dim);font-size:12px">No in-memory device-health/error record (expected after a reload — these live only in JS memory; the durable source is the checkpoint 'interruption' field above).</div>`;

  const extras =
    (devErrRaw || devHealthRaw
      ? [
          devHealthRaw ? `<div style="margin-top:4px"><div style="color:var(--text-dim);font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.4px">AETHER_DEVICE_HEALTH (session, non-persisted)</div><pre style="margin:4px 0 0;padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-family:var(--mono);font-size:11px;color:var(--text);white-space:pre-wrap">${esc(devHealthRaw ?? '')}</pre></div>` : '',
          devErrRaw ? `<div style="margin-top:4px"><div style="color:var(--text-dim);font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.4px">AETHER_RUNTIME_ERROR (session, non-persisted)</div><pre style="margin:4px 0 0;padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-family:var(--mono);font-size:11px;color:var(--red);white-space:pre-wrap">${esc(devErrRaw ?? '')}</pre></div>` : '',
        ].join('')
      : '') + sessionBlock;
  return extras;
}

// ─── Render ──────────────────────────────────────────────────────────────

let selectedRunId: string | null = null;
let clearArm = false;

export function render(host: HTMLElement): void {
  clearArm = false;

  let recoveredCount = 0;
  try {
    recoveredCount = recoverOrphanedForensicRuns();
  } catch {
    // recovery must never break the viewer
  }

  const status = getForensicStorageStatus();
  const runs = getForensicRuns(); // oldest → newest
  const latest = getLatestForensicRun();
  const activeRunId = getActiveForensicRunId();
  const selectedRun = selectedRunId ? getForensicRun(selectedRunId) ?? latest : latest;
  const selectedSnapshot = selectedRun ? getForensicSnapshot(selectedRun) : null;
  const rawArchive = getForensicArchiveRaw();

  const clipAvailable = typeof navigator !== 'undefined' && !!navigator.clipboard;

  const copyRunJson = selectedSnapshot ? JSON.stringify(selectedSnapshot, null, 2) : null;
  const copyMsJson = selectedRun ? JSON.stringify(selectedRun.milestones ?? [], null, 2) : null;
  const copyRawJson = rawArchive;

  // Run selector rows (newest first).
  const reversed = runs.slice().reverse();
  const selectorRows = reversed
    .slice(0, status.maxRuns)
    .map((r, i) => {
      const isSelected = selectedRun && r.runId === selectedRun.runId;
      const border = isSelected ? 'border:1px solid var(--accent, var(--blue))' : 'border:1px solid var(--border)';
      return `<button data-run-id="${esc(r.runId)}" style="display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:7px 10px;border-radius:8px;background:var(--bg);${border};color:var(--text);cursor:pointer;font-family:var(--mono);font-size:11px;margin-top:4px" class="run-select">
        <span style="color:var(--text-dim);flex:0 0 24px">#${i + 1}</span>
        <span style="flex:0 0 56px">${statusBadge(r.status)}</span>
        <span style="flex:0 0 60px;color:var(--text-dim)">${esc(shortId(r.runId))}</span>
        <span style="color:var(--text-dim);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.startedAt)}</span>
        <span style="color:var(--text-dim)">${r.milestones?.length ?? 0} ms</span>
      </button>`;
    })
    .join('');
  const selectorBlock =
    runs.length === 0
      ? `<div style="color:var(--text-dim);font-size:13px">Forensic archive is empty — no runs recorded yet.</div>`
      : selectorRows;

  const statusBlock = [
    cell('archive key', FORENSIC_RUNS_KEY),
    cell('archive byte length', String(status.archiveBytes)),
    cell('runs (total / active / interrupted / completed)', `${status.runCount} / ${status.activeRuns} / ${status.incompleteRuns} / ${status.completedRuns}`),
    cell('retention bounds', `${status.maxRuns} runs · ${status.maxMilestonesPerRun} milestones/run · ~${status.maxArchiveBytes} bytes`),
    cell('corrupted', status.corrupted ? 'YES — archive unreadable' : 'NO'),
    ...(status.readError ? [cell('read error', status.readError)] : []),
  ].join('');

  const corruptedNote = status.corrupted
    ? `<div style="margin-top:6px;color:var(--yellow);font-family:var(--mono);font-size:12px">FORENSIC ARCHIVE: CORRUPTED / UNREADABLE — the run archive could not be parsed. Use CLEAR FORENSIC HISTORY to reset it; the legacy checkpoint/milestone evidence below is not affected.</div>`
    : '';

  const recoveredNote = recoveredCount > 0
    ? `<div style="margin-top:6px;color:var(--yellow);font-size:12px">Recovered <b>${recoveredCount}</b> orphaned RUNNING run(s) — previous page termination/reload or GPU device loss was recorded as INTERRUPTED.</div>`
    : '';

  host.innerHTML = `
    <div style="padding:16px;max-width:880px;margin:0 auto">
      <div style="border:2px solid var(--yellow);background:rgba(234,179,8,.10);border-radius:12px;padding:16px 18px">
        <div style="font-size:22px;font-weight:800;color:var(--yellow);letter-spacing:1px">FORENSIC HISTORY — PERSISTED RUN ARCHIVE</div>
        <div style="font-size:15px;font-weight:600;color:var(--text);margin-top:4px">READ-ONLY VIEWER — NO BENCHMARK WILL RUN</div>
        <div style="font-size:12px;color:var(--text-dim);margin-top:8px;font-family:var(--mono)">This screen only reads persisted evidence (checkpoint, milestones, session memory, and the durable forensic run archive). The only writes allowed here are orphan-run recovery (classifying a previous page-terminated run as INTERRUPTED) and CLEAR FORENSIC HISTORY below — both touch exactly one key: ${esc(FORENSIC_RUNS_KEY)}.</div>
      </div>

      ${corruptedNote}
      ${recoveredNote}

      ${section('PERSISTENCE STATUS', statusBlock)}

      ${section('LATEST RUN', snapshotBlock(selectedSnapshot, activeRunId))}

      ${section('RUN SELECTOR (newest first — click to inspect)', selectorBlock)}

      ${section(`SELECTED RUN MILESTONES ${selectedRun ? `— ${shortId(selectedRun.runId)} (last 25)` : ''}`, milestonesBlock(selectedRun))}

      ${section('LEGACY EVIDENCE — CHECKPOINT', checkpointSection())}

      ${section('LEGACY EVIDENCE — MILESTONE LOG', milestoneKeySection())}

      ${section('DEVICE HEALTH / ERROR (SESSION MEMORY ONLY)', sessionExtrasSection())}

      <div class="card" style="margin-top:14px">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${clipAvailable ? `
            <button class="btn" id="btn-copy-run" ${copyRunJson === null ? 'disabled' : ''}>Copy Current Run</button>
            <button class="btn" id="btn-copy-ms" ${copyMsJson === null ? 'disabled' : ''}>Copy Selected Run Milestones</button>
            <button class="btn" id="btn-copy-raw" ${copyRawJson === null ? 'disabled' : ''}>Copy Raw Forensic Archive</button>
          ` : `<div style="color:var(--text-dim);font-size:12px">navigator.clipboard unavailable — copy the raw JSON blocks above manually.</div>`}
          <button class="btn btn-outline" id="btn-clear-forensic" style="color:var(--red)">CLEAR FORENSIC HISTORY</button>
          <button class="btn btn-outline" id="btn-back">Back to AETHER</button>
        </div>
        <div id="clear-hint" style="color:var(--red);font-size:12px;margin-top:8px"></div>
        <div style="color:var(--text-dim);font-size:11px;font-family:var(--mono);margin-top:10px">Copy buttons only copy the already-read strings to the clipboard; they never read or write localStorage. CLEAR FORENSIC HISTORY requires a two-step confirm and deletes ONLY the ${esc(FORENSIC_RUNS_KEY)} archive key.</div>
      </div>
    </div>
  `;

  host.querySelectorAll<HTMLButtonElement>('.run-select').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.runId ?? null;
      selectedRunId = id;
      render(host);
    });
  });

  const bindCopy = (id: string, text: string | null) => {
    const btn = host.querySelector<HTMLButtonElement>(id);
    if (!btn || text === null || !clipAvailable) return;
    btn.addEventListener('click', () => {
      const prev = btn.textContent ?? '';
      navigator.clipboard.writeText(text).then(
        () => {
          btn.textContent = 'COPIED';
          setTimeout(() => (btn.textContent = prev), 1500);
        },
        () => {
          btn.textContent = 'COPY FAILED';
          setTimeout(() => (btn.textContent = prev), 1500);
        }
      );
    });
  };

  bindCopy('#btn-copy-run', copyRunJson);
  bindCopy('#btn-copy-ms', copyMsJson);
  bindCopy('#btn-copy-raw', copyRawJson);

  const clearBtn = host.querySelector<HTMLButtonElement>('#btn-clear-forensic');
  const clearHint = host.querySelector<HTMLElement>('#clear-hint');
  clearBtn?.addEventListener('click', () => {
    if (!clearArm) {
      clearArm = true;
      clearBtn.textContent = 'CONFIRM: CLEAR FORENSIC HISTORY (irreversible)';
      if (clearHint) {
        clearHint.textContent = `Step 1 of 2. Press again to permanently erase the ${status.runCount} archived run(s). This deletes ONLY ${FORENSIC_RUNS_KEY}; checkpoint and milestone keys are untouched. Auto-disarms in 20s.`;
      }
      window.setTimeout(() => {
        clearArm = false;
        const fresh = host.querySelector<HTMLButtonElement>('#btn-clear-forensic');
        if (fresh) fresh.textContent = 'CLEAR FORENSIC HISTORY';
        const hint = host.querySelector<HTMLElement>('#clear-hint');
        if (hint) hint.textContent = '';
      }, 20000);
      return;
    }
    clearArm = false;
    const ok = clearForensicHistory();
    selectedRunId = null;
    render(host);
    if (clearHint) {
      clearHint.textContent = ok ? 'FORENSIC HISTORY CLEARED.' : 'CLEAR FAILED — storage unavailable or refused.';
    }
  });

  const backBtn = host.querySelector<HTMLButtonElement>('#btn-back');
  backBtn?.addEventListener('click', () => {
    window.location.hash = '';
  });
}