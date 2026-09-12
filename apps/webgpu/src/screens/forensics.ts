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

export function render(host: HTMLElement): void {
  const cpRead = storageGet(CHECKPOINT_KEY);
  const msRead = storageGet(MILESTONES_KEY);
  const cpRaw = cpRead.ok ? cpRead.value : null;
  const msRaw = msRead.ok ? msRead.value : null;

  let cpBody: string;
  if (!cpRead.ok) {
    cpBody = `<div style="color:var(--red);font-family:var(--mono);font-size:12px">localStorage read failed: ${esc(cpRead.error ?? 'unknown error')}</div>`;
  } else if (cpRaw === null || cpRaw === '') {
    cpBody = `<div style="color:var(--text-dim);font-size:13px">No persisted checkpoint found. Either the run never started, or its checkpoint was already consumed/cleared.</div>`;
  } else {
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
    cpBody = `${parsedBlock}<div style="color:var(--text-dim);font-family:var(--mono);font-size:11px;margin-top:10px;text-transform:uppercase;letter-spacing:.4px">Raw checkpoint JSON</div>${rawBlock}`;
  }

  let msBody: string;
  if (!msRead.ok) {
    msBody = `<div style="color:var(--red);font-family:var(--mono);font-size:12px">localStorage read failed: ${esc(msRead.error ?? 'unknown error')}</div>`;
  } else if (msRaw === null || msRaw === '') {
    msBody = `<div style="color:var(--text-dim);font-size:13px">No persisted milestone log found.</div>`;
  } else {
    let milestones: Array<{ t: string; state: string }> = [];
    let msError: string | null = null;
    try {
      const p = JSON.parse(msRaw) as unknown;
      if (Array.isArray(p)) milestones = p as Array<{ t: string; state: string }>;
    } catch (err) {
      msError = parseErr(err);
    }
    if (msError !== null) {
      msBody = `<div style="color:var(--red);font-family:var(--mono);font-size:12px">MILESTONE LOG PARSE FAILED: ${esc(msError)}</div>`;
    } else if (!Array.isArray(milestones) && msRaw.trim().startsWith('[')) {
      msBody = `<div style="color:var(--red);font-family:var(--mono);font-size:12px">Milestone log is a JSON array but not in {t,state} shape.</div>`;
    } else {
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
      msBody = total === 0 ? `<div style="color:var(--text-dim);font-size:13px">Milestone log is an empty array.</div>` : `${totalLine}${rows}`;
    }
  }

  const devErrRaw = readGlobal(RUNTIME_ERROR_GLOBAL);
  const devHealthRaw = readGlobal(DEVICE_HEALTH_GLOBAL);
  const sessionBlock =
    devErrRaw || devHealthRaw || `${readGlobal(RUNTIME_ERROR_GLOBAL)}`.length
      ? ''
      : `<div style="color:var(--text-dim);font-size:12px">No in-memory device-health/error record (expected after a reload — these live only in JS memory; the durable source is the checkpoint 'interruption' field above).</div>`;

  const sessionExtras =
    (devErrRaw || devHealthRaw
      ? [
          devHealthRaw ? `<div style="margin-top:4px"><div style="color:var(--text-dim);font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.4px">AETHER_DEVICE_HEALTH (session, non-persisted)</div><pre style="margin:4px 0 0;padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-family:var(--mono);font-size:11px;color:var(--text);white-space:pre-wrap">${esc(devHealthRaw ?? '')}</pre></div>` : '',
          devErrRaw ? `<div style="margin-top:4px"><div style="color:var(--text-dim);font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.4px">AETHER_RUNTIME_ERROR (session, non-persisted)</div><pre style="margin:4px 0 0;padding:8px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-family:var(--mono);font-size:11px;color:var(--red);white-space:pre-wrap">${esc(devErrRaw ?? '')}</pre></div>` : '',
        ].join('')
      : '') + sessionBlock;

  const clipAvailable = typeof navigator !== 'undefined' && !!navigator.clipboard;

  host.innerHTML = `
    <div style="padding:16px;max-width:880px;margin:0 auto">
      <div style="border:2px solid var(--yellow);background:rgba(234,179,8,.10);border-radius:12px;padding:16px 18px">
        <div style="font-size:22px;font-weight:800;color:var(--yellow);letter-spacing:1px">READ-ONLY FORENSIC MODE</div>
        <div style="font-size:15px;font-weight:600;color:var(--text);margin-top:4px">NO BENCHMARK WILL RUN</div>
        <div style="font-size:12px;color:var(--text-dim);margin-top:8px;font-family:var(--mono)">This screen only reads persisted crash evidence. It never writes to localStorage and never initialises WebGPU. Do not operate any benchmark button after leaving this screen until evidence has been copied.</div>
      </div>

      ${section('LOCAL STORAGE STATUS', `
        ${cell('checkpoint key exists', cpRead.ok ? (cpRaw !== null && cpRaw !== '' ? 'YES' : 'NO') : 'READ FAILED')}
        ${cell('checkpoint byte length', cpRead.ok ? String(cpRaw !== null ? utf8Bytes(cpRaw) : 0) : '—')}
        ${cell('milestones key exists', msRead.ok ? (msRaw !== null && msRaw !== '' ? 'YES' : 'NO') : 'READ FAILED')}
        ${cell('milestones byte length', msRead.ok ? String(msRaw !== null ? utf8Bytes(msRaw) : 0) : '—')}
        ${cpRead.error ? `<div style="color:var(--red);font-size:12px;margin-top:4px">checkpoint read error: ${esc(cpRead.error)}</div>` : ''}
        ${msRead.error ? `<div style="color:var(--red);font-size:12px;margin-top:4px">milestones read error: ${esc(msRead.error)}</div>` : ''}
      `)}

      ${section('CHECKPOINT', cpBody)}

      ${section('MILESTONES', msBody)}

      ${section('DEVICE HEALTH / ERROR (SESSION MEMORY ONLY)', sessionExtras)}

      <div class="card" style="margin-top:14px">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${clipAvailable ? `
            <button class="btn" id="btn-copy-cp" ${cpRaw === null ? 'disabled' : ''}>Copy Checkpoint</button>
            <button class="btn" id="btn-copy-ms" ${msRaw === null ? 'disabled' : ''}>Copy Milestones</button>
          ` : `<div style="color:var(--text-dim);font-size:12px">navigator.clipboard unavailable — copy the raw JSON blocks above manually.</div>`}
          <button class="btn btn-outline" id="btn-back">Back to AETHER</button>
        </div>
        <div style="color:var(--text-dim);font-size:11px;font-family:var(--mono);margin-top:10px">Copy buttons only copy the already-read strings to the clipboard. They do not read or modify localStorage.</div>
      </div>
    </div>
  `;

  const bindCopy = (id: string, text: string | null) => {
    const btn = host.querySelector<HTMLButtonElement>(id);
    if (!btn || text === null || !clipAvailable) return;
    btn.addEventListener('click', () => {
      const plain = text.replace(/^"|"$/g, '');
      const prev = btn.textContent ?? '';
      navigator.clipboard.writeText(plain).then(
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

  bindCopy('#btn-copy-cp', cpRaw);
  bindCopy('#btn-copy-ms', msRaw);

  const backBtn = host.querySelector<HTMLButtonElement>('#btn-back');
  backBtn?.addEventListener('click', () => {
    window.location.hash = '';
  });
}