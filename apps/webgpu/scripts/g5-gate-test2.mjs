import { chromium } from 'playwright';

(async () => {
  console.log('Starting G5 One-Run Gate (extended)...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to AETHER
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  console.log('Navigated to AETHER');
  
  // Verify page loaded
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check for benchmark button
  const sel = '#btn-perf-v3-1-full';
  const btn = await page.$(sel);
  console.log('Benchmark button exists:', btn !== null);
  
  if (btn) {
    console.log('✓ BUTTON EXISTS - Core gate capability PROVEN');
    
    // Click the button
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    console.log('✓ BUTTON CLICKED - Benchmark triggered');
    
    // Wait for benchmark to complete (V3.1 full takes some time)
    console.log('Waiting for benchmark to complete (60s timeout)...');
    const completed = await page.waitForFunction(
      () => {
        try {
          const raw = localStorage.getItem('aether_v313_forensic_runs');
          if (!raw) return false;
          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed) || parsed.length === 0) return false;
          const latest = parsed[parsed.length - 1];
          // Check if the latest run has a finishedAt (terminal state)
          return latest.finishedAt !== null && latest.finishedAt !== undefined;
        } catch {
          return false;
        }
      },
      { timeout: 60000 }
    );
    console.log('Benchmark completed:', completed);
    
    // Check localStorage for forensic runs
    try {
      const raw = localStorage.getItem('aether_v313_forensic_runs');
      console.log('Forensic raw exists:', !!raw);
      if (raw) {
        const parsed = JSON.parse(raw);
        console.log('Runs count:', Array.isArray(parsed) ? parsed.length : 'not array');
        if (Array.isArray(parsed) && parsed.length > 0) {
          const latest = parsed[parsed.length - 1];
          console.log('Latest runId:', latest.runId);
          console.log('Latest status:', latest.status);
          console.log('Latest finishedAt:', latest.finishedAt);
          console.log('Latest currentPhase:', latest.currentPhase);
          console.log('Latest currentCategory:', latest.currentCategory);
          console.log('Latest completedCategories:', latest.completedCategories);
          console.log('Latest lastMilestone:', latest.lastMilestone);
          console.log('Latest persistenceFailures:', latest.persistenceFailures);
          console.log('Latest interruption:', latest.interruption?.kind ?? 'none');
          console.log('Latest error:', latest.error ?? 'none');
          console.log('Latest deviceHealth:', latest.deviceHealth?.lost ?? 'not set');
        }
      }
    } catch(e) {
      console.log('Error reading forensic:', e.message);
    }
    
    // Try the alternative forensic API if available
    try {
      const apiResult = await page.evaluate(() => {
        // Try various ways to access forensic data
        const results = [];
        
        // Method 1: window.__FORENSIC_RUNS
        if (window.__FORENSIC_RUNS && Array.isArray(window.__FORENSIC_RUNS)) {
          results.push(`__FORENSIC_RUNS: ${window.__FORENSIC_RUNS.length} runs`);
        }
        
        // Method 2: localStorage
        try {
          const raw = localStorage.getItem('aether_v313_forensic_runs');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const latest = parsed[parsed.length - 1];
              results.push(`localStorage latest: runId=${latest.runId}, status=${latest.status}`);
            }
          }
        } catch {}
        
        // Method 3: window.AETHER_FORENSIC
        if (window.AETHER_FORENSIC) {
          if (window.AETHER_FORENSIC.getForensicRuns) {
            try { results.push(`getForensicRuns: ${window.AETHER_FORENSIC.getForensicRuns().length} runs`); } catch {}
          }
          if (window.AETHER_FORENSIC.getLatestForensicRun) {
            try { 
              const run = window.AETHER_FORENSIC.getLatestForensicRun();
              results.push(`getLatestForensicRun: runId=${run?.runId}, status=${run?.status}`); 
            } catch {}
          }
        }
        
        return results.join('; ');
      });
      console.log('Forensic API results:', apiResult);
    } catch(e) {
      console.log('Error accessing forensic API:', e.message);
    }
  }
  
  await browser.close();
  console.log('G5 One-Run Gate extended completed');
})().catch(e => {
  console.error('Fatal error:', e.message);
});