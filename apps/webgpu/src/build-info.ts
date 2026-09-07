// AETHER build / commit identifiers.
// Read from import.meta.env. Vite inlines VITE_-prefixed variables at build
// time (see vite.config.ts):
//   VITE_GIT_COMMIT  -> git commit SHA (injected by the GitHub Actions workflow;
//                       falls back to the local git SHA, then a timestamp)
//   VITE_BUILD_TIME  -> ISO-8601 time this bundle was produced
// Falls back to a dev timestamp when running outside a build (type-check only).

function firstDefined(...values: Array<string | undefined>): string | undefined {
  for (const v of values) {
    if (v) return v;
  }
  return undefined;
}

const gitCommit = firstDefined(import.meta.env.VITE_GIT_COMMIT as string | undefined);
const buildTime = firstDefined(import.meta.env.VITE_BUILD_TIME as string | undefined);

export const AETHER_BUILD_ID: string = gitCommit ?? buildTime ?? `dev-${Date.now().toString(36)}`;

export const AETHER_COMMIT: string | null =
  gitCommit && /^[0-9a-f]{40}$/.test(gitCommit) ? gitCommit : null;

export const AETHER_BUILD_TIME: string = buildTime ?? '';