// AETHER GPU Benchmark — Numeric Comparison Utilities
// Shared by the GPU correctness suite and the Node unit tests. Analyzes a GPU
// output against a CPU reference: max absolute error, index of the largest
// error, CPU/GPU values at that index, expected/actual value ranges, and an
// explicit every-element finiteness check (NaN/Infinity => FAIL, first index
// recorded). NaN/Infinity are never hidden.

export interface NumericInfo {
  maxError: number;
  errorIndex: number;
  cpuValue: number | null;
  gpuValue: number | null;
  expectedRange: [number, number] | null;
  actualRange: [number, number] | null;
  nonFiniteIndex: number;
  allFinite: boolean;
  lengthMismatch: boolean;
  pass: boolean;
}

export function analyzeNumeric(
  gpu: Float32Array,
  cpu: Float32Array,
  tolerance: number
): NumericInfo {
  const lengthMismatch = gpu.length !== cpu.length;
  const n = Math.min(gpu.length, cpu.length);

  let allFinite = true;
  let nonFiniteIndex = -1;
  let maxError = 0;
  let errorIndex = -1;
  let cpuValue: number | null = null;
  let gpuValue: number | null = null;
  let expMin = Infinity;
  let expMax = -Infinity;
  let actMin = Infinity;
  let actMax = -Infinity;
  let compared = false;

  for (let i = 0; i < n; i++) {
    const g = gpu[i];
    const c = cpu[i];
    if (!Number.isFinite(g)) {
      allFinite = false;
      if (nonFiniteIndex < 0) nonFiniteIndex = i;
      continue;
    }
    if (c < expMin) expMin = c;
    if (c > expMax) expMax = c;
    if (g < actMin) actMin = g;
    if (g > actMax) actMax = g;
    // Seed diagnostic values with the first valid comparison so perfect-zero
    // results (maxError == 0) still report a meaningful cpuValue / gpuValue.
    if (!compared) {
      compared = true;
      errorIndex = 0;
      cpuValue = c;
      gpuValue = g;
    }
    const e = Math.abs(g - c);
    if (e > maxError) {
      maxError = e;
      errorIndex = i;
      cpuValue = c;
      gpuValue = g;
    }
  }

  // A trailing longer GPU array (past the reference) must still be finite.
  if (allFinite) {
    for (let i = n; i < gpu.length; i++) {
      if (!Number.isFinite(gpu[i])) {
        allFinite = false;
        nonFiniteIndex = i;
        break;
      }
    }
  }

  const pass =
    !lengthMismatch &&
    allFinite &&
    compared &&
    maxError <= tolerance;

  return {
    maxError,
    errorIndex,
    cpuValue,
    gpuValue,
    expectedRange: expMin === Infinity || expMax === -Infinity ? null : [expMin, expMax],
    actualRange: actMin === Infinity || actMax === -Infinity ? null : [actMin, actMax],
    nonFiniteIndex,
    allFinite,
    lengthMismatch,
    pass,
  };
}

export function rowSums(data: Float32Array, rows: number, cols: number): Float32Array {
  const sums = new Float32Array(rows);
  for (let r = 0; r < rows; r++) {
    let s = 0;
    for (let c = 0; c < cols; c++) s += data[r * cols + c];
    sums[r] = s;
  }
  return sums;
}