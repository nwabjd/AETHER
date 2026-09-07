// AETHER build identifier.
// Replaced at build time by Vite (__AETHER_BUILD_ID__, declared in
// vite-env.d.ts) with the git commit SHA or a timestamp fallback. Falls back
// to a dev timestamp when the define was not injected.

export const AETHER_BUILD_ID: string =
  typeof __AETHER_BUILD_ID__ !== 'undefined'
    ? __AETHER_BUILD_ID__
    : `dev-${Date.now().toString(36)}`;