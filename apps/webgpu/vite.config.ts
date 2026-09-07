import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';

// Build ID: current git commit SHA when available, otherwise a timestamp.
// Injected into the bundle at build time so the deployed HTML can be verified
// against the source commit (cache-busting / stale-code detection).
function getBuildId(): string {
  try {
    const sha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    if (sha) return sha;
  } catch {
    // Not a git checkout — fall through to timestamp.
  }
  return new Date().toISOString().replace(/[:]/g, '-');
}

const basePath = process.env.BASE_PATH || '/';
const buildId = getBuildId();

export default defineConfig({
  base: basePath,
  define: {
    __AETHER_BUILD_ID__: JSON.stringify(buildId),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
  },
});