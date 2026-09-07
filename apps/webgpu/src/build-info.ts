// AETHER build / commit identifiers.
// Replaced at build time by Vite (see vite.config.ts):
//   __AETHER_BUILD_ID__  -> git commit SHA (prefers AETHER_COMMIT env) or timestamp
//   __AETHER_COMMIT__    -> commit SHA when available, otherwise undefined
// Falls back to a dev timestamp when the defines were not injected (e.g. type-check only).

declare const __AETHER_BUILD_ID__: string | undefined;
declare const __AETHER_COMMIT__: string | undefined;

export const AETHER_BUILD_ID: string =
  typeof __AETHER_BUILD_ID__ !== 'undefined'
    ? __AETHER_BUILD_ID__
    : `dev-${Date.now().toString(36)}`;

export const AETHER_COMMIT: string | null =
  typeof __AETHER_COMMIT__ !== 'undefined' && __AETHER_COMMIT__
    ? __AETHER_COMMIT__
    : AETHER_BUILD_ID.length === 40 && /^[0-9a-f]{40}$/.test(AETHER_BUILD_ID)
      ? AETHER_BUILD_ID
      : null;