#!/usr/bin/env node
// AETHER GPU Benchmark — Baseline Comparison (TASK 5)
//
// Usage: npm run benchmark:compare -- baseline.json current.json
//
// Compares medianMs per operation between two benchmark result JSON files.
// LOWER time is better; a HIGHER current median is flagged as a regression.
// Thresholds: >5% / >10% / >20% are labeled regression thresholds only —
// no statistical-significance claim is made.

import { readFileSync } from 'node:fs';

function flatten(json) {
  const map = new Map();
  const push = (op, s) => {
    if (s && typeof s.medianMs === 'number') map.set(op, s.medianMs);
  };

  // Format A: PerfReport tests object (arrays of samples keyed by kernel group)
  if (json.tests && typeof json.tests === 'object') {
    for (const [group, samples] of Object.entries(json.tests)) {
      if (Array.isArray(samples)) {
        for (const s of samples) push(s.id ?? `${group}.${s.size}`, s);
      } else if (samples && typeof samples === 'object') {
        // attentionPhases: { "seq=128": [samples] }
        for (const list of Object.values(samples)) {
          for (const s of list) push(s.id ?? s.size, s);
        }
      }
    }
  }

  // Format B: IphoneBaselineJson results map ({ "op.config": sample })
  if (json.results && typeof json.results === 'object') {
    for (const [key, s] of Object.entries(json.results)) push(key, s);
  }

  return map;
}

function fmt(n) {
  return n === null || n === undefined ? '—' : (Math.abs(n) < 1 ? `${(n * 1000).toFixed(1)}µs` : `${n.toFixed(3)}ms`);
}

function pct(base, cur) {
  if (!(base > 0)) return null; // avoid divide-by-zero for sub-threshold zero baselines
  return ((cur - base) / base) * 100;
}

const [baselinePath, currentPath] = process.argv.slice(2);
if (!baselinePath || !currentPath) {
  console.error('Usage: npm run benchmark:compare -- baseline.json current.json');
  process.exit(2);
}

const base = flatten(JSON.parse(readFileSync(baselinePath, 'utf8')));
const cur = flatten(JSON.parse(readFileSync(currentPath, 'utf8')));

if (base.size === 0) {
  console.error(`No comparable samples (medianMs) found in ${baselinePath}`);
  process.exit(2);
}
if (cur.size === 0) {
  console.error(`No comparable samples (medianMs) found in ${currentPath}`);
  process.exit(2);
}

const rows = [];
for (const [op, baseMs] of base) {
  const curMs = cur.get(op);
  if (curMs === undefined) {
    rows.push({ op, baseMs, curMs: null, diff: null, pct: null, flag: 'MISSING IN CURRENT' });
    continue;
  }
  const diff = curMs - baseMs;
  const p = pct(baseMs, curMs);
  let flag = '';
  if (p !== null && baseMs > 0) {
    if (p > 20) flag = 'REGRESSION >20%';
    else if (p > 10) flag = 'REGRESSION >10%';
    else if (p > 5) flag = 'REGRESSION >5%';
    else if (p < -5) flag = 'improvement >5%';
  }
  rows.push({ op, baseMs, curMs, diff, pct: p, flag });
}

const colW = [48, 12, 12, 12, 9, 18];
const line = (cells) => cells.map((c, i) => String(c).padEnd(colW[i])).join('│ ');

console.log(line(['operation', 'baseline', 'current', 'diff', 'diff %', 'flag']));
console.log('─'.repeat(colW.reduce((a, b) => a + b + 2, 0)));

let regressions = 0;
for (const r of rows) {
  console.log(line([
    r.op,
    fmt(r.baseMs),
    fmt(r.curMs),
    r.diff === null ? '—' : `${r.diff >= 0 ? '+' : ''}${fmt(Math.abs(r.diff))}`,
    r.pct === null ? 'n/a' : `${r.pct >= 0 ? '+' : ''}${r.pct.toFixed(2)}%`,
    r.flag,
  ]));
  if (r.flag.startsWith('REGRESSION')) regressions++;
}

console.log('');
console.log(`Compared operations: ${rows.length}`);
console.log(`Regression thresholds flagged (>5% />10% />20%): ${regressions}`);
console.log('Note: these are *threshold labels*, not statistical-significance claims.');
process.exit(regressions > 0 ? 1 : 0);
