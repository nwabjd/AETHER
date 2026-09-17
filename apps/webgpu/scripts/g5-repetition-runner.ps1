# G5 controlled-repetition campaign runner (PS 5.1).
#
# Drives the FULL V3.1.3 benchmark repeatedly through an agent-browser
# session against the Vite preview served from dist. For every repetition it:
#   1. clears any stale interrupted state, triggers a FRESH run via DOM click,
#   2. polls the forensic archive (+ checkpoint, + device/error globals),
#   3. detects COMPLETED / INTERRUPTED / stall / timeout / page-gone,
#   4. captures the full latest run record + legacy milestones at the end,
#   5. appends one JSON line to the raw capture file (crash-safe, resumable).
#
# Classification/verification for each capture happens OFF-line via
# scripts/g5-classifier.ts (g5-aggregate.ts reads the JSONL and emits
# g5-results.json). This runner never falsifies results.

param(
  [ValidateRange(1, 400)] [int]$TargetRuns = 20,
  [int]$PollMs = 500,
  [int]$RunTimeoutSec = 300,
  [int]$NoHeartbeatSec = 30,
  [string]$OutFile = "D:\AETHER\apps\webgpu\scripts\g5-runs.jsonl",
  [string]$StateFile = "D:\AETHER\apps\webgpu\scripts\g5-runs.state.json",
  [string]$PreviewUrl = "http://127.0.0.1:4173/"
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath (Split-Path -Parent $OutFile))) {
  Write-Output "OUTFILE_DIR_MISSING: $(Split-Path -Parent $OutFile)"; exit 2
}

# ─── JS snippets ──────────────────────────────────────────────────────────

$SNAP_JS = @'
(() => {
  const out = { t: Date.now(), iso: new Date().toISOString(), runCount: 0, newest: null, cp: null, btn: null };
  try {
    const raw = localStorage.getItem('aether_v313_forensic_runs');
    if (raw) { const arr = JSON.parse(raw); out.runCount = Array.isArray(arr) ? arr.length : 0; out.newest = Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null; }
  } catch (e) { out.snapErr = e.message; }
  try {
    const raw = localStorage.getItem('aether_v313_checkpoint');
    if (raw) out.cp = JSON.parse(raw);
  } catch (e) { out.cpErr = e.message; }
  const btn = document.querySelector('#btn-perf-v3-1-full');
  out.btn = btn ? { disabled: !!btn.disabled } : null;
  const clr = document.querySelector('#btn-clear-run');
  out.hasClearBtn = !!clr;
  out.url = location.href;
  return JSON.stringify({
    runCount: out.runCount,
    newest: out.newest ? {
      runId: out.newest.runId,
      status: out.newest.status,
      lastUpdatedAt: out.newest.lastUpdatedAt,
      lastHeartbeat: out.newest.lastHeartbeat,
      msCount: (out.newest.milestones || []).length,
      lastMs: out.newest.milestones && out.newest.milestones.length ? out.newest.milestones[out.newest.milestones.length - 1].state : null,
      phase: out.newest.currentPhase,
      cat: out.newest.currentCategory,
      completedCats: (out.newest.completedCategories || []),
      devLost: out.newest.deviceHealth ? !!out.newest.deviceHealth.lost : null,
      persFail: out.newest.persistenceFailures,
      interKind: out.newest.interruption ? out.newest.interruption.kind : null,
      err: out.newest.error,
      finishedAt: out.newest.finishedAt,
    } : null,
    cp: out.cp ? { status: out.cp.status, completedCats: out.cp.completedCategories || [], interKind: out.cp.interruption ? out.cp.interruption.kind : null } : null,
    btn: out.btn,
    hasClearBtn: out.hasClearBtn,
    url: out.url,
  });
})()
'@

$TRIGGER_CLEAR_JS = @'
(() => {
  const clr = document.querySelector('#btn-clear-run');
  if (clr) { clr.click(); return 'CLEARED'; }
  return 'NO_CLEAR_BTN';
})()
'@

$TRIGGER_FULL_JS = @'
(() => {
  const btn = document.querySelector('#btn-perf-v3-1-full');
  if (!btn) return 'NO_FULL_BTN';
  if (btn.disabled) return 'FULL_BTN_DISABLED';
  btn.click();
  return 'CLICKED';
})()
'@

$CAPTURE_JS = @'
(() => {
  const out = { t: Date.now(), iso: new Date().toISOString(), runs: null, cp: null, milestones: null, deviceHealth: null, runtimeError: null, btn: null };
  try { const raw = localStorage.getItem('aether_v313_forensic_runs'); out.runs = raw ? JSON.parse(raw) : []; } catch (e) { out.runsErr = e.message; }
  try { const raw = localStorage.getItem('aether_v313_checkpoint'); out.cp = raw ? JSON.parse(raw) : null; } catch (e) { out.cpErr = e.message; }
  try { const raw = localStorage.getItem('aether_v313_milestones'); out.milestones = raw ? JSON.parse(raw) : []; } catch (e) { out.milesErr = e.message; }
  try { out.deviceHealth = window.AETHER_DEVICE_HEALTH ? JSON.parse(JSON.stringify(window.AETHER_DEVICE_HEALTH)) : null; } catch (e) {}
  try { out.runtimeError = window.AETHER_RUNTIME_ERROR ? JSON.parse(JSON.stringify(window.AETHER_RUNTIME_ERROR)) : null; } catch (e) {}
  const btn = document.querySelector('#btn-perf-v3-1-full');
  out.btn = btn ? { disabled: !!btn.disabled } : null;
  return JSON.stringify(out);
})()
'@

function B64([string]$Text) { return [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($Text)) }

function Invoke-AgentBrowser([string]$Js) {
  $b = B64 $Js
  $raw = (agent-browser eval -b $b 2>&1 | Out-String).Trim()
  if ([string]::IsNullOrWhiteSpace($raw)) { return @{ parseError = 'EMPTY_OUTPUT' } }
  if ($raw.StartsWith('✗ Evaluation error:')) { return @{ agentError = $raw } }
  try { return $raw | ConvertFrom-Json } catch { return @{ parseError = $raw } }
}

function Resolve-PollResult($obj, [string]$what) {
  if ($null -eq $obj) { return 'AGENT_NO_OUTPUT' }
  if ($obj.PSObject.Properties.Name -contains 'parseError') { return 'EVAL_PARSE_ERROR:' + $obj.parseError }
  if ($obj.PSObject.Properties.Name -contains 'agentError') { return 'AGENT_ERROR:' + $obj.agentError }
  return 'OK'
}

# ─── state / resume ───────────────────────────────────────────────────────

$state = @{ seenRunIds = @() }
if (Test-Path -LiteralPath $StateFile) {
  try { $state = Get-Content -LiteralPath $StateFile -Raw | ConvertFrom-Json } catch {}
  if ($null -eq $state.seenRunIds) { $state.seenRunIds = @() }
}

$campaignStartedAt = [DateTime]::UtcNow.ToString('o')

Write-Output "G5_RUNNER start target=$TargetRuns pollMs=$PollMs timeoutSec=$RunTimeoutSec noHeartbeatSec=$NoHeartbeatSec"
Write-Output "G5_RUNNER out=$OutFile state=$StateFile"
Write-Output "G5_RUNNER seen=$(($state.seenRunIds | Measure-Object).Count)"

$completedRuns = 0
$priorRunId = $null
$priorRunCount = 0

for ($i = 1; $i -le $TargetRuns; $i++) {
  $runLabel = "run#$i"
  $runDir = Split-Path -Parent $OutFile
  $startedWall = [DateTime]::UtcNow

  Write-Output "=== $runLabel starting at $($startedWall.ToString('o'))"

  # -- pre-trigger snapshot (learn priorRunId/count so we can detect the new run)
  $snap = Invoke-AgentBrowser $SNAP_JS
  $res = Resolve-PollResult $snap 'snap'
  if ($res -ne 'OK') { Write-Output "$runLabel PRETRIGGER_FAIL $res"; break }
  $priorRunCount = [int]$snap.runCount
  $priorRunId = if ($snap.newest) { $snap.newest.runId } else { $null }

  # -- clear stale interrupted state so the trigger is a FRESH run
  $c = Invoke-AgentBrowser $TRIGGER_CLEAR_JS
  $cc = Resolve-PollResult $c 'clear'
  if ($cc -ne 'OK') { Write-Output "$runLabel CLEAR_FAIL $cc"; break }

  # -- trigger
  $startTrigger = [DateTime]::UtcNow
  $tr = Invoke-AgentBrowser $TRIGGER_FULL_JS
  $trc = Resolve-PollResult $tr 'trigger'
  if ($trc -ne 'OK') { Write-Output "$runLabel TRIGGER_FAIL $trc"; break }
  if ($tr -is [string]) { Write-Output "$runLabel trigger=$tr" } else { Write-Output "$runLabel trigger=$($tr | Out-String)" }

  # -- wait for a NEW RUNNING run to appear
  $newRunId = $null
  $waitStart = [DateTime]::UtcNow
  $waitMs = 0
  while ($waitMs -lt 15000) {
    Start-Sleep -Milliseconds 250
    $s2 = Invoke-AgentBrowser $SNAP_JS
    if ((Resolve-PollResult $s2 'wait') -ne 'OK') { Start-Sleep -Milliseconds 250; continue }
    if ($s2.runCount -gt $priorRunCount -and $s2.newest -and $s2.newest.status -eq 'RUNNING') {
      $newRunId = $s2.newest.runId
      Write-Output "$runLabel NEW_RUN_DETECTED runId=$newRunId runCount=$($s2.runCount) priorRunCount=$priorRunCount"
      break
    }
    if ($s2.newest -and $s2.newest.runId -ne $priorRunId -and $s2.newest.status -eq 'RUNNING') {
      $newRunId = $s2.newest.runId
      Write-Output "$runLabel NEW_RUN_DETECTED_VIA_ID runId=$newRunId"
      break
    }
    $waitMs += 250
  }
  if (-not $newRunId) {
    Write-Output "$runLabel NO_NEW_RUN (stale or trigger failed)"
    break
  }

  # -- poll until terminal state / stall / timeout / page-gone
  $pollDeadline = [DateTime]::UtcNow.AddSeconds($RunTimeoutSec)
  $lastSeenUpdate = [DateTime]::UtcNow
  $lastUpdatedAtLocal = [DateTime]::UtcNow
  $heartbeatSilentMs = 0
  $terminal = $null       # 'COMPLETED' | 'INTERRUPTED' | 'STALL' | 'TIMEOUT' | 'PAGE_GONE' | 'DEVICE_LOST'
  $terminalReason = $null

  while ($true) {
    Start-Sleep -Milliseconds $PollMs
    $sn = Invoke-AgentBrowser $SNAP_JS
    $sr = Resolve-PollResult $sn 'poll'
    $now = [DateTime]::UtcNow

    if ($sr -ne 'OK') {
      if ($sr -like 'EVAL_PARSE_ERROR*') { Start-Sleep -Milliseconds 300; $sn2 = Invoke-AgentBrowser $SNAP_JS; if ($null -ne $sn2) { $sn = $sn2 } else { $terminal = 'PAGE_GONE'; $terminalReason = $sr; break } }
      else { $terminal = 'PAGE_GONE'; $terminalReason = $sr; break }
    }

    if ($sn.newest) {
      $st = $sn.newest
      if ($st.lastUpdatedAt) {
        try { $lastUpdatedAtLocal = [DateTime]::Parse($st.lastUpdatedAt).ToUniversalTime() } catch {}
      }
      if ($st.status -eq 'COMPLETED') { $terminal = 'COMPLETED'; break }
      if ($st.status -eq 'INTERRUPTED') { $terminal = 'INTERRUPTED'; break }
      if ($st.devLost) { $terminal = 'DEVICE_LOST'; break }
      if ($st.interKind) { $terminal = "INTERRUPTED($($st.interKind))"; break }
    }

    $elapsed = ($now - $startedWall)
    if ($elapsed.TotalSeconds -gt $RunTimeoutSec) { $terminal = 'TIMEOUT'; $terminalReason = "elapsed $($elapsed.TotalSeconds)s > ${RunTimeoutSec}s"; break }

    $silent = ($now - $lastUpdatedAtLocal).TotalSeconds
    if ($silent -gt $NoHeartbeatSec) {
      $heartbeatSilentMs += $PollMs
      if ($heartbeatSilentMs -ge ($NoHeartbeatSec * 1000)) {
        $terminal = 'STALL'; $terminalReason = "no heartbeat/lastUpdatedAt advance for ${NoHeartbeatSec}s"; break
      }
    } else {
      $heartbeatSilentMs = 0
    }
  }

  # -- capture full state
  $cap = Invoke-AgentBrowser $CAPTURE_JS
  $capOk = Resolve-PollResult $cap 'capture'

  # Locate the run we started (last element of captured archive with matching runId).
  $rec = $null
  if ($capOk -eq 'OK' -and $cap.runs -is [System.Collections.IEnumerable]) {
    $rr = @($cap.runs) | Where-Object { $_.runId -eq $newRunId }
    if ($rr.Count -gt 0) { $rec = $rr[0] }
    elseif (@($cap.runs).Count -gt 0) { $rec = @($cap.runs)[-1] }
  }
  if ($null -eq $rec) {
    Write-Output "$runLabel CAPTURE_NO_RECORD capOk=$capOk"
    $rec = @{ runId = $newRunId }
  }

  $finishWall = [DateTime]::UtcNow
  $entry = @{
    runIndex = $i
    runId = $newRunId
    terminal = $terminal
    terminalReason = $terminalReason
    startedWallUtc = $startedWall.ToString('o')
    finishedWallUtc = $finishWall.ToString('o')
    wallDurationMs = [int](($finishWall - $startedWall).TotalMilliseconds)
    capture = @{ capOk = $capOk; rec = $rec; cp = $cap.cp; milestones = $cap.milestones; deviceHealth = $cap.deviceHealth; runtimeError = $cap.runtimeError; btn = $cap.btn }
  }

  $jsonLine = $entry | ConvertTo-Json -Depth 20 -Compress
  Add-Content -LiteralPath $OutFile -Value $jsonLine -Encoding utf8
  Write-Output "$runLabel result terminal=$terminal reason=$terminalReason runId=$newRunId wallMs=$($entry.wallDurationMs)"

  # update state file
  $state.seenRunIds = @($state.seenRunIds) + $newRunId
  $state.updatedAt = [DateTime]::UtcNow.ToString('o')
  $state.terminal = $terminal
  $state | ConvertTo-Json -Depth 6 -Compress | Set-Content -LiteralPath $StateFile -Encoding utf8

  if ($terminal -eq 'COMPLETED') { $completedRuns++ }

  # stop conditions
  if ($terminal -ne 'COMPLETED' -and $terminal -ne 'INTERRUPTED' -and $terminal -notlike 'DEVICE_LOST*') {
    Write-Output "G5_RUNNER STOP_CONDITION: non-terminal result on run#$i ($terminal)"
    break
  }
}

$campaignEndedAt = [DateTime]::UtcNow.ToString('o')
Write-Output "G5_RUNNER done completedRuns=$completedRuns campaignEndedAt=$campaignEndedAt"

# End of script — assumes the Vite preview server is already running
# at $PreviewUrl and the agent-browser session is attached to it.
# Do NOT call this script with server-start logic; start the server
# externally (e.g., `npm run preview` in the apps/webgpu directory)
# before invoking this runner.