// Post-build verification for the AETHER WebGPU benchmark.
// FAILS the build when:
//   1. dist/sw.js exists (a service worker would be served), or
//   2. any compiled JS under dist/assets contains serviceWorker.register.
// Run as: node scripts/verify-build.mjs  (wired into npm run build)

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');
let failed = false;

const swPath = join(DIST, 'sw.js');
if (existsSync(swPath)) {
  console.error('VERIFY FAILED: dist/sw.js still exists — remove the service worker.');
  failed = true;
} else {
  console.log('VERIFY OK: dist/sw.js is absent.');
}

const assetsDir = join(DIST, 'assets');
if (existsSync(assetsDir)) {
  const jsFiles = readdirSync(assetsDir).filter(f => f.endsWith('.js'));
  for (const file of jsFiles) {
    const code = readFileSync(join(assetsDir, file), 'utf-8');
    if (/serviceWorker\.register\s*\(/.test(code)) {
      console.error(`VERIFY FAILED: ${file} contains serviceWorker.register calls.`);
      failed = true;
    }
  }
}

const buildInfoPath = join(DIST, 'build-info.json');
if (!existsSync(buildInfoPath)) {
  console.error('VERIFY FAILED: dist/build-info.json was not generated.');
  failed = true;
} else {
  console.log(`VERIFY OK: build-info.json present -> ${readFileSync(buildInfoPath, 'utf-8').replace(/\s+/g, ' ')}`);
}

if (failed) {
  process.exit(1);
}
console.log('VERIFY PASS: no service worker, no serviceWorker.register in compiled output.');