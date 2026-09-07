// AETHER service-worker purge + cache reset.
// An old PWA service worker may already be installed on a device. Removing
// registration from new builds is not enough — we must actively unregister any
// existing service worker and delete its caches so Safari can never serve stale
// JavaScript.

function isAetherCache(name: string): boolean {
  const n = name.toLowerCase();
  return (
    n.includes('aether') ||
    n === 'external-cache' ||
    n.startsWith('workbox-') ||
    n.includes('webgpu')
  );
}

async function purgeServiceWorkers(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r => r.unregister().catch(() => {})));
  } catch {
    // Service workers unavailable — resolve cleanly.
  }
}

async function purgeCaches(): Promise<void> {
  if (!('caches' in window)) return;
  try {
    const names = await caches.keys();
    await Promise.all(
      names.filter(isAetherCache).map(n => caches.delete(n).catch(() => {}))
    );
  } catch {
    // CacheStorage unavailable — resolve cleanly.
  }
}

async function purgeAetherIndexedDB(): Promise<void> {
  try {
    const dbNames: string[] = [];
    const dbApi = indexedDB as unknown as {
      databases?: () => Promise<Array<{ name?: string }>>;
    };
    if (dbApi.databases) {
      const dbs = await dbApi.databases();
      for (const d of dbs) {
        if (d.name && d.name.toLowerCase().includes('aether')) dbNames.push(d.name);
      }
    } else {
      // Older engines: only known AETHER database names, guarded.
      dbNames.push('aether-gpu-benchmark');
    }
    for (const name of dbNames) {
      await new Promise<void>(resolve => {
        const req = indexedDB.deleteDatabase(name);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
        req.onblocked = () => resolve();
      });
    }
  } catch {
    // IndexedDB unavailable — resolve cleanly.
  }
}

// One-time cleanup executed BEFORE the application UI initializes.
export async function purgeLegacyServiceWorkers(): Promise<void> {
  await purgeServiceWorkers();
  await purgeCaches();
}

// Full reset used by the #reset route.
export async function resetAetherCache(): Promise<void> {
  await purgeServiceWorkers();
  await purgeCaches();
  await purgeAetherIndexedDB();
}