// AETHER GPU Benchmark — Results Store (IndexedDB)
// Persists benchmark results locally and supports JSON export

import type { BenchmarkResult } from './engine';

const DB_NAME = 'aether-gpu-benchmark';
const DB_VERSION = 1;
const STORE_NAME = 'results';

interface StoredRun {
  id: string;
  timestamp: string;
  device: string;
  adapter: string;
  os: string;
  browser: string;
  results: BenchmarkResult[];
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

let _runSeq = 0;

export async function saveResults(
  results: BenchmarkResult[],
  deviceInfo: { adapter: string; os: string; browser: string }
): Promise<string> {
  const db = await openDB();
  const runId = `run_${Date.now().toString(36)}_${(_runSeq++).toString(36)}`;

  const run: StoredRun = {
    id: runId,
    timestamp: new Date().toISOString(),
    device: navigator.userAgent,
    adapter: deviceInfo.adapter,
    os: deviceInfo.os,
    browser: deviceInfo.browser,
    results,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(run);
    tx.oncomplete = () => resolve(runId);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllRuns(): Promise<StoredRun[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getRun(id: string): Promise<StoredRun | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteRun(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearAllRuns(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function exportJSON(results: BenchmarkResult[], deviceInfo?: Record<string, string | number>): string {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    userAgent: navigator.userAgent,
    deviceInfo: deviceInfo ?? {},
    results: results.map(r => ({
      ...r,
      details: r.details ?? {},
    })),
  };
  return JSON.stringify(exportData, null, 2);
}

export function downloadJSON(json: string, filename?: string): void {
  const name = filename ?? `aether-benchmark-${Date.now()}.json`;
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
