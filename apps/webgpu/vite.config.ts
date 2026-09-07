import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

// Build identity: the current git commit SHA when available (preferring the
// AETHER_COMMIT env var injected by the GitHub Actions workflow), otherwise a
// timestamp. Injected into the bundle + build-info.json so a stale browser
// cache is immediately detectable.
function getCommitSha(): string {
  const injected = process.env.AETHER_COMMIT;
  if (injected) return injected.trim();
  try {
    const sha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    if (sha) return sha;
  } catch {
    // Not a git checkout — fall through to timestamp.
  }
  return '';
}

function getBuildId(commit: string): string {
  return commit || new Date().toISOString().replace(/[:]/g, '-');
}

// Emit dist/build-info.json so deployments can be identified.
function buildInfoJsonPlugin(buildId: string, commit: string): Plugin {
  return {
    name: 'aether-build-info',
    apply: 'build',
    writeBundle(output) {
      const outDir = output.dir ?? 'dist';
      writeFileSync(
        resolve(outDir, 'build-info.json'),
        JSON.stringify(
          { buildId, commit, builtAt: new Date().toISOString() },
          null,
          2
        ),
        'utf-8'
      );
    },
  };
}

const basePath = process.env.BASE_PATH || '/';
const commit = getCommitSha();
const buildId = getBuildId(commit);

export default defineConfig({
  base: basePath,
  define: {
    __AETHER_BUILD_ID__: JSON.stringify(buildId),
    __AETHER_COMMIT__: JSON.stringify(commit || undefined),
  },
  plugins: [buildInfoJsonPlugin(buildId, commit)],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
  },
});