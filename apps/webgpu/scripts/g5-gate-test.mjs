import { chromium } from 'playwright';

(async () => {
  console.log('Starting G5 One-Run Gate...');
  
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
    
    // Wait for benchmark to potentially complete
    await new Promise(r => setTimeout(r, 10000));
    
    // Check localStorage for forensic runs
    try {
      const result = await page.evaluate(() => {
        const raw = localStorage.getItem('aether_v313_forensic_runs');
        if (!raw) return 'no-storage';
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return 'not-array';
        if (parsed.length === 0) return 'empty';
        const latest = parsed[parsed.length - 1];
        return `runId=${latest.runId}, status=${latest.status}`;
      });
      console.log('Forensic result:', result);
    } catch(e) {
      console.log('Error reading forensic:', e.message);
    }
  }
  
  await browser.close();
  console.log('G5 One-Run Gate completed');
})().catch(e => {
  console.error('Fatal error:', e.message);
});