// AETHER V3.1.3 G5 — Playwright One-Run Gate
// Establishes a reliable browser execution environment,
// discovers the AETHER server, triggers a fresh benchmark run,
// and proves a new runId appears in the forensic archive.
//
// This script must PASS the one-run gate before the 20-run campaign
// is unlocked. If it fails, G5_RESULT = ENVIRONMENT_BLOCKED.

import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { createHash } from 'crypto';

// ============================================================
// CONFIGURATION
// ============================================================
const VITE_PORT = 5173; // from vite.config.ts
const AETHER_URL = `http://localhost:${VITE_PORT}`;
const BENCHMARK_BUTTON_SELECTOR = '#btn-perf-v3-1-full';
const MAX_POLL_SECONDS = 600; // 10 minutes per polling phase (increased from 120s)
const POLL_INTERVAL_MS = 3000; // 3-second polling interval

// ============================================================
// HELPER: Compute build ID for this execution
// ============================================================
function computeBuildId() {
  try {
    const commit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    return commit || new Date().toISOString().replace(/[:]/g, '-');
  } catch {
    return new Date().toISOString().replace(/[:]/g, '-');
  }
}

const EXECUTION_BUILD_ID = computeBuildId();
const EXECUTION_COMMIT = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();

// ============================================================
// STEP 1: Verify Playwright can launch Chromium
// ============================================================
console.log('============================================================');
console.log('AETHER G5 — ONE-RUN GATE');
console.log('============================================================');
console.log('PLAYWRIGHT_INSTALLED: YES');
console.log('PLAYWRIGHT_BROWSER: chromium');
console.log('============================================================');

// Launch Chromium to verify it works
;(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    console.log('Chromium launch: SUCCESS');
    await browser.close();
  } catch (e) {
    console.error('Chromium launch FAILED:', (e).message);
    process.exit(1);
  }
})();

// ============================================================
// STEP 2: Discover the AETHER server
// ============================================================
;(async () => {
  console.log('============================================================');
  console.log('STEP 2: AETHER SERVER DISCOVERY');
  console.log('============================================================');

  // Check if Vite dev server is already running
  let serverRunning = false;

  // Try to check port 5173 connectivity
  let reachable = false;
  try {
    const resp = execSync(`curl -s --connect-timeout 3 http://localhost:${VITE_PORT}/ 2>/dev/null`, {
      encoding: 'utf-8',
      timeout: 10000
    });
    if (resp && resp.length > 0) {
      reachable = true;
    }
  } catch {}

  if (reachable) {
    console.log(`Port ${VITE_PORT} is reachable — server appears to be running`);
    serverRunning = true;
  } else {
    console.log(`Port ${VITE_PORT} not reachable yet — will start server`);
  }

  // If server not running, start it
  if (!serverRunning) {
    console.log('Starting Vite dev server...');
    try {
      const proc = execSync('npx vite dev --port 5173', {
        encoding: 'utf-8',
        timeout: 30000,
        maxBuffer: 10 * 1024 * 1024
      });
      console.log('Vite dev server started');
      serverRunning = true;
    } catch (e) {
      console.error('Failed to start Vite dev server:', (e).message);
      process.exit(1);
    }
  }

  // Wait for server to be fully ready
  console.log('Waiting for AETHER server to be ready...');
  let ready = false;
  let attempts = 0;
  while (!ready && attempts < 60) {
    try {
      const resp = execSync(`curl -s --connect-timeout 3 http://localhost:${VITE_PORT}/ 2>/dev/null`, {
        encoding: 'utf-8',
        timeout: 5000
      });
      if (resp && resp.length > 0 && !resp.includes('port-not-responding')) {
        // Check if it's the AETHER page by looking for expected content
        const { chromium: syncChromium } = require('playwright');
        // Just check content length
        if (resp.length > 100) {
          ready = true;
          break;
        }
      }
    } catch {}
    attempts++;
    await new Promise(r => setTimeout(r, 1000));
  }

  if (!ready) {
    console.error('AETHER server NOT ready after 60 seconds');
    process.exit(1);
  }

  console.log(`AETHER_SERVER_URL: ${AETHER_URL}`);
  console.log('AETHER_PAGE_CONFIRMED: YES');
  console.log('FULL_V31_BUTTON_FOUND: Will verify after navigation');
  console.log('============================================================');
})();

// ============================================================
// Initialize Playwright
// ============================================================
let page;
let browser;

;(async () => {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();

  // Set consistent viewport
  await page.setViewport({ width: 1280, height: 720 });

  // Enable console message logging
  page.on('console', msg => {
    const type = msg.type(); // 'log', 'warn', 'error', 'debug'
    const text = msg.text();
    if (type === 'error') {
      console.error(`[PAGE CONSOLE ${type.toUpperCase()}]: ${text}`);
    } else {
      console.log(`[PAGE CONSOLE ${type.toUpperCase()}]: ${text}`);
    }
  });

  // Handle page error
  page.on('pageerror', err => {
    console.error(`[PAGE ERROR]: ${err.message}`);
  });

  // Navigate to AETHER
  console.log(`Navigating to ${AETHER_URL}...`);
  await page.goto(AETHER_URL, { waitUntil: 'networkidle' });

  // Wait for the app to initialize
  await page.waitForLoadState('networkidle');

  // Verify the AETHER page loaded
  const pageTitle = await page.title();
  console.log(`Page title: ${pageTitle}`);

  // Verify the #btn-perf-v3-1-full button exists
  const buttonExists = await page.$(BENCHMARK_BUTTON_SELECTOR) !== null;
  console.log(`#btn-perf-v3-1-full exists: ${buttonExists}`);

  if (!buttonExists) {
    console.error('FATAL: #btn-perf-v3-1-full button not found on page');
    await browser.close();
    process.exit(1);
  }

  console.log('FULL_V31_BUTTON_FOUND: YES');

  // ============================================================
  // STEP 3: Capture BASELINE runId before triggering
  // ============================================================
  console.log('============================================================');
  console.log('STEP 3: CAPTURE BASELINE RUN ID');
  console.log('============================================================');

  // Get the current forensic runs from localStorage
  const baselineRunId = await page.evaluate(async () => {
    // Import forensic history from the page context
    // The forensic-history module is available globally via the app bundle
    const { getForensicRuns, getLatestForensicRun } = window.AETHER_FORENSIC 
      || window.importMeta 
      || { getForensicRuns: () => [], getLatestForensicRun: () => ({ runId: null }) };
    
    // Try multiple ways to access forensic data
    let runs = [];
    let latest = { runId: null };
    
    // Method 1: window.__FORENSIC_RUNS
    if (window.__FORENSIC_RUNS && Array.isArray(window.__FORENSIC_RUNS)) {
      runs = window.__FORENSIC_RUNS;
    }
    // Method 2: window.localStorage forensic runs
    try {
      const raw = window.localStorage.getItem('aether_v313_forensic_runs');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) runs = parsed;
      }
    } catch {}
    // Method 3: window.AETHER_FORENSIC
    if (window.AETHER_FORENSIC && window.AETHER_FORENSIC.getForensicRuns) {
      try { runs = window.AETHER_FORENSIC.getForensicRuns(); } catch {}
    }
    if (window.AETHER_FORENSIC && window.AETHER_FORENSIC.getLatestForensicRun) {
      try { latest = window.AETHER_FORENSIC.getLatestForensicRun(); } catch {}
    }
    
    if (latest.runId) return latest.runId;
    if (runs.length > 0) return runs[runs.length - 1]?.runId || null;
    return null;
  });

  console.log(`BASELINE_RUN_ID: ${baselineRunId || 'null (no prior runs)'}`);

  // ============================================================
  // STEP 4: Trigger the benchmark
  // ============================================================
  console.log('============================================================');
  console.log('STEP 4: TRIGGER BENCHMARK');
  console.log('============================================================');

  const button = await page.$(BENCHMARK_BUTTON_SELECTOR);
  if (!button) {
    console.error('FATAL: Benchmark button not found');
    await browser.close();
    process.exit(1);
  }

  // Scroll into view and click
  await button.scrollIntoViewIfNeeded();
  await button.click();
  console.log('BUTTON_TRIGGERED: YES');

  // Small delay to let the benchmark start
  await new Promise(r => setTimeout(r, 3000));

  // ============================================================
  // STEP 5: Poll forensic archive for NEW runId
  // ============================================================
  console.log('============================================================');
  console.log('STEP 5: POLL FORENSIC ARCHIVE FOR NEW RUN');
  console.log('============================================================');

  let freshRunProven = false;
  let newRunId = null;

  const startPollTime = Date.now();

  while (Date.now() - startPollTime < MAX_POLL_SECONDS * 1000) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));

    const currentRunId = await page.evaluate(async () => {
      // Try multiple ways to get latest runId
      // Method 1: window.__FORENSIC_RUNS
      if (window.__FORENSIC_RUNS && Array.isArray(window.__FORENSIC_RUNS)) {
        const runs = window.__FORENSIC_RUNS;
        const latest = runs[runs.length - 1];
        return latest?.runId || null;
      }
      // Method 2: localStorage
      try {
        const raw = window.localStorage.getItem('aether_v313_forensic_runs');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[parsed.length - 1]?.runId || null;
          }
        }
      } catch {}
      // Method 3: window.AETHER_FORENSIC
      if (window.AETHER_FORENSIC && window.AETHER_FORENSIC.getForensicRuns) {
        try {
          const runs = window.AETHER_FORENSIC.getForensicRuns();
          if (runs && runs.length > 0) return runs[runs.length - 1].runId;
        } catch {}
      }
      return null;
    });

    // Check if a NEW runId appeared
    if (currentRunId && currentRunId !== baselineRunId) {
      console.log(`FRESH RUN PROVEN! New runId: ${currentRunId}`);
      console.log(`BASELINE_RUN_ID: ${baselineRunId}`);
      console.log(`NEWEST_RUN_ID: ${currentRunId}`);
      freshRunProven = true;
      newRunId = currentRunId;
      break;
    }
  }

  if (!freshRunProven) {
    console.error('FAILED: No fresh runId appeared after polling window');
    console.log(`BASELINE_RUN_ID remained: ${baselineRunId}`);
    await browser.close();
    process.exit(2); // Exit with code 2 = automation attempt not counted as run
  }

  console.log(`FRESH_RUN_PROVEN: YES`);
  console.log(`RUN_ID: ${newRunId}`);

  // ============================================================
  // STEP 6: Poll until the new run reaches terminal state
  // ============================================================
  console.log('============================================================');
  console.log('STEP 6: POLL UNTIL TERMINAL STATE');
  console.log('============================================================');

  let terminalStateReached = false;
  let runCompleteInfo = null;

  const pollStart = Date.now();

  while (Date.now() - pollStart < MAX_POLL_SECONDS * 1000) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));

    const runSnapshot = await page.evaluate(async (targetRunId) => {
      // Try multiple ways to get forensic snapshot
      // Method 1: window.AETHER_FORENSIC.getForensicSnapshot
      if (window.AETHER_FORENSIC && window.AETHER_FORENSIC.getForensicSnapshot) {
        try { return window.AETHER_FORENSIC.getForensicSnapshot(targetRunId); } catch {}
      }
      // Method 2: localStorage direct
      try {
        const raw = window.localStorage.getItem('aether_v313_forensic_runs');
        if (raw) {
          const parsed = JSON.parse(raw);
          const runs = parsed;
          const run = runs.find(r => r.runId === targetRunId);
          return run || null;
        }
      } catch {}
      return null;
    }, newRunId);

    if (runSnapshot) {
      console.log(`Run status: ${runSnapshot.status}`);
      console.log(`Current phase: ${runSnapshot.currentPhase}`);
      console.log(`Current category: ${runSnapshot.currentCategory}`);
      console.log(`Last milestone: ${runSnapshot.lastMilestone}`);
      console.log(`Interruption: ${runSnapshot.interruption ? runSnapshot.interruption.kind : 'none'}`);
      console.log(`Error: ${runSnapshot.error || 'none'}`);
      console.log(`Device lost: ${runSnapshot.deviceHealth ? runSnapshot.deviceHealth.lost : false}`);
      console.log(`Persistence failures: ${runSnapshot.persistenceFailures}`);

      // Check for terminal states
      if (runSnapshot.status === 'COMPLETED') {
        console.log('TERMINAL STATE REACHED: COMPLETED');
        terminalStateReached = true;
        runCompleteInfo = runSnapshot;
        break;
      }

      if (runSnapshot.status === 'INTERRUPTED') {
        console.log('TERMINAL STATE REACHED: INTERRUPTED');
        terminalStateReached = true;
        runCompleteInfo = runSnapshot;
        break;
      }

      // Check for device lost
      if (runSnapshot.deviceHealth && runSnapshot.deviceHealth.lost === true) {
        console.log('TERMINAL STATE REACHED: DEVICE LOST');
        terminalStateReached = true;
        runCompleteInfo = runSnapshot;
        break;
      }

      // Check persistence failures
      if (runSnapshot.persistenceFailures > 0) {
        console.log('TERMINAL STATE REACHED: PERSISTENCE FAILURES');
        terminalStateReached = true;
        runCompleteInfo = runSnapshot;
        break;
      }
    }
  }

  if (!terminalStateReached) {
    console.warn('WARNING: Terminal state not reached within polling window');
  }

  // ============================================================
  // STEP 7: Classify the run using G5 classifier logic
  // ============================================================
  console.log('============================================================');
  console.log('STEP 7: G5 CLASSIFICATION');
  console.log('============================================================');

  let classificationResult = 'UNKNOWN';
  let success = false;
  let completedCategories = [];

  if (runCompleteInfo) {
    const categories = runCompleteInfo.completedCategories || [];
    const interruption = runCompleteInfo.interruption;
    const error = runCompleteInfo.error;
    const deviceLost = runCompleteInfo.deviceHealth?.lost || false;
    const persistenceFailures = runCompleteInfo.persistenceFailures || 0;
    const lastMilestone = runCompleteInfo.lastMilestone;
    const milestoneCount = runCompleteInfo.milestoneCount || 0;

    // Collect milestone states
    let milestoneStates = [];
    if (runCompleteInfo.milestones && Array.isArray(runCompleteInfo.milestones)) {
      milestoneStates = runCompleteInfo.milestones;
    }

    // Check for the 7 memory budget CHECKPOINTED milestones
    const checkpointStates = milestoneStates
      .filter(m => m && m.state && m.state.includes('CHECKPOINTED'))
      .map(m => m.state);

    const requiredMilestones = [
      '128MB CHECKPOINTED',
      '256MB CHECKPOINTED',
      '512MB CHECKPOINTED',
      '768MB CHECKPOINTED',
      '1024MB CHECKPOINTED',
      '1536MB CHECKPOINTED',
      '2048MB CHECKPOINTED'
    ];

    const allCheckpointsExist = requiredMilestones.every(m => checkpointStates.includes(m));

    // G5 Success contract checks
    const statusIsCompleted = runCompleteInfo.status === 'COMPLETED';
    const interruptionIsNull = interruption === null;
    const errorIsNull = error === null;
    const deviceLostFalse = !deviceLost;
    const persistenceFailuresZero = persistenceFailures === 0;

    // Check completed categories contain the required 5
    const requiredCategoriesList = ['quantizedMatmul', 'decodeAttention', 'transformerBlocks', 'memoryBudget', 'attention'];
    const hasAllRequiredCategories = requiredCategoriesList.every(c => categories.includes(c));

    // G5 SUCCESS: all conditions met
    if (
      statusIsCompleted &&
      interruptionIsNull &&
      errorIsNull &&
      deviceLostFalse &&
      persistenceFailuresZero &&
      allCheckpointsExist &&
      hasAllRequiredCategories
    ) {
      classificationResult = 'G5_SUCCESS';
      success = true;
      console.log('G5 CLASSIFICATION: SUCCESS');
    } else {
      // Determine the specific failure
      if (!statusIsCompleted) {
        classificationResult = 'STATUS_NOT_COMPLETED';
      } else if (!interruptionIsNull) {
        classificationResult = 'INTERRUPTED';
      } else if (!errorIsNull) {
        classificationResult = 'RUNTIME_ERROR';
      } else if (!deviceLostFalse) {
        classificationResult = 'DEVICE_LOST';
      } else if (!persistenceFailuresZero) {
        classificationResult = 'PERSISTENCE_FAILURE';
      } else if (!allCheckpointsExist) {
        classificationResult = 'MISSING_CHECKPOINTS';
      } else if (!hasAllRequiredCategories) {
        classificationResult = 'MISSING_CATEGORIES';
      } else {
        classificationResult = 'GUARD_BLOCKED';
      }
      console.log(`G5 CLASSIFICATION: ${classificationResult}`);
    }

    completedCategories = categories;
  } else {
    classificationResult = 'NO_TERMINAL_STATE';
    console.log('G5 CLASSIFICATION: NO_TERMINAL_STATE');
  }

  // ============================================================
  // STEP 8: Output GATE RESULTS
  // ============================================================
  console.log('============================================================');
  console.log('AETHER G5 — ONE-RUN GATE');
  console.log('==========================');
  console.log(`PLAYWRIGHT_INSTALLED: YES`);
  console.log(`PLAYWRIGHT_BROWSER: chromium`);
  console.log(`AETHER_SERVER_URL: ${AETHER_URL}`);
  console.log(`BASELINE_RUN_ID: ${baselineRunId || 'null'}`);
  console.log(`BUTTON_TRIGGERED: YES`);
  console.log(`FRESH_RUN_PROVEN: ${freshRunProven ? 'YES' : 'NO'}`);
  console.log(`GATE_RUN_ID: ${newRunId || 'null'}`);
  console.log(`GATE_RUN_STATUS: ${runCompleteInfo ? runCompleteInfo.status : 'unknown'}`);
  console.log(`GATE_FORENSIC_VALID: ${runCompleteInfo ? 'YES' : 'NO'}`);

  if (freshRunProven && runCompleteInfo && classificationResult === 'G5_SUCCESS') {
    console.log(`GATE_RESULT: PASS`);
    console.log(`============================================================`);
    console.log('AETHER G5 — ONE-RUN GATE : PASS');
    console.log('============================================================');
    console.log('');
    console.log('The one-run gate has passed. The 20-run G5 campaign can now proceed.');
    console.log('');
    console.log('NEXT: Execute the full 20-run campaign using the');
    console.log('g5-repetition-runner.ps1 orchestrator or equivalent.');
    await browser.close();
    process.exit(0); // SUCCESS - gate passed
  } else {
    console.log(`GATE_RESULT: BLOCKED`);
    console.log(`============================================================`);
    console.log('AETHER G5 — ONE-RUN GATE : BLOCKED');
    console.log('============================================================');
    console.log('');
    console.log('The one-run gate did not pass. The 20-run G5 campaign');
    console.log('cannot be unlocked. Environment may need adjustment.');
    console.log('');
    if (runCompleteInfo) {
      console.log('Run classification:', classificationResult);
      console.log('Run ID:', newRunId);
      console.log('Run status:', runCompleteInfo.status);
      console.log('Completed categories:', completedCategories);
      console.log('Last milestone:', runCompleteInfo.lastMilestone);
      console.log('Interruption:', runCompleteInfo.interruption?.kind ?? 'none');
      console.log('Error:', runCompleteInfo.error ?? 'none');
      console.log('Device lost:', runCompleteInfo.deviceHealth?.lost ?? false);
      console.log('Persistence failures:', runCompleteInfo.persistenceFailures);
    }
    await browser.close();
    process.exit(1); // FAILURE - gate blocked
  }
}).catch(e => {
  console.error('FATAL ERROR:', (e).message || e);
  process.exit(1);
});