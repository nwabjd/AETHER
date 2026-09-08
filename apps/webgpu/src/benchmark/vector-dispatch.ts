// AETHER GPU Benchmark — Scalable 2D Vector-Add Dispatch
//
// WebGPU's portable default `maxComputeWorkgroupsPerDimension` is 65,535, but a
// large Vector Add (N = 4,194,304 → ceil(N/64) = 65,536 workgroups) exceeds it
// along X. Dispatching 65,536 workgroups in one dimension is invalid and the
// GPU silently fails to cover the tail, producing a correctness failure without
// a validation error on some drivers.
//
// This module tiles the workgroups across X and Y so that neither dimension
// ever exceeds the device's real limit, while mapping every invocation to a
// unique linear element index through `gid.x + gid.y * dispatchStride`.
//
// The core math is pure (takes a limit number) so it is unit-testable in Node
// without a GPU; a convenience wrapper reads the limit off a real device.

/**
 * Compute a safe, correctly-tiled 2D dispatch for Vector Add.
 *
 * The returned object is used both for the dispatch dimensions and for the
 * uniform's `dispatchStride` (workgroupsX * 64) so every invocation derives a
 * unique element index: `i = gid.x + gid.y * dispatchStride`.
 *
 * @param n                     element count (N)
 * @param maxWorkgroupsPerDimension  device.limits.maxComputeWorkgroupsPerDimension
 * @param workgroupSize         invocation count per workgroup (default 64)
 */
export interface VectorDispatch {
  workgroupsX: number;
  workgroupsY: number;
  workgroupSize: number;
  totalWorkgroups: number;
  dispatchStride: number;
  maxWorkgroupsPerDimension: number;
}

export function calculateVectorDispatch(
  n: number,
  maxWorkgroupsPerDimension: number,
  workgroupSize = 64
): VectorDispatch {
  const maxLimit = maxWorkgroupsPerDimension >>> 0;
  const wgSize = workgroupSize >>> 0;
  if (!(wgSize >= 1)) throw new Error(`vector dispatch: workgroupSize=${workgroupSize} must be >= 1`);
  const totalWorkgroups = Math.max(1, Math.ceil(n / wgSize));

  // TASK 2 — tile across X then Y. If total fits in one dimension, stay 1D
  // (TASK 7 — do not unnecessarily use 2D). With workgroupsX = 65,535 and
  // total = 65,536, workgroupsY = ceil(65536/65535) = 2.
  const workgroupsX = Math.min(totalWorkgroups, maxLimit);
  const workgroupsY = Math.max(1, Math.ceil(totalWorkgroups / workgroupsX));

  const dispatchStride = workgroupsX * wgSize;

  const result: VectorDispatch = {
    workgroupsX,
    workgroupsY,
    workgroupSize: wgSize,
    totalWorkgroups,
    dispatchStride,
    maxWorkgroupsPerDimension: maxLimit,
  };

  // TASK 9 — hard assertions, fail fast instead of a silent GPU tail loss.
  assertVectorDispatch(result);

  return result;
}

/** TASK 9 — hard dispatch invariants. Throws on any violation. */
export function assertVectorDispatch(d: VectorDispatch): void {
  if (!(d.workgroupsX >= 1)) throw new Error(`vector dispatch: workgroupsX=${d.workgroupsX} must be >= 1`);
  if (!(d.workgroupsY >= 1)) throw new Error(`vector dispatch: workgroupsY=${d.workgroupsY} must be >= 1`);
  if (!(d.workgroupsX <= d.maxWorkgroupsPerDimension)) {
    throw new Error(`vector dispatch: workgroupsX=${d.workgroupsX} exceeds maxComputeWorkgroupsPerDimension=${d.maxWorkgroupsPerDimension}`);
  }
  if (!(d.workgroupsY <= d.maxWorkgroupsPerDimension)) {
    throw new Error(`vector dispatch: workgroupsY=${d.workgroupsY} exceeds maxComputeWorkgroupsPerDimension=${d.maxWorkgroupsPerDimension}`);
  }
  // dispatchStride must exactly match the X extent so gid.y tiles contiguously.
  if (d.dispatchStride !== d.workgroupsX * d.workgroupSize) {
    throw new Error(`vector dispatch: dispatchStride=${d.dispatchStride} must equal workgroupsX(${d.workgroupsX}) * size(${d.workgroupSize})`);
  }
  if (!(d.dispatchStride > 0)) throw new Error(`vector dispatch: dispatchStride=${d.dispatchStride} must be > 0`);
  // The grid must be large enough to cover every requested workgroup.
  if (!(d.totalWorkgroups <= d.workgroupsX * d.workgroupsY)) {
    throw new Error(`vector dispatch: totalWorkgroups=${d.totalWorkgroups} must be <= X(${d.workgroupsX})*Y(${d.workgroupsY})`);
  }
}

/** Convenience wrapper — read the real limit from a GPUDevice. */
export function calculateVectorDispatchForDevice(device: GPUDevice, n: number, workgroupSize = 64): VectorDispatch {
  const maxWorkgroupsPerDimension = device.limits.maxComputeWorkgroupsPerDimension;
  return calculateVectorDispatch(n, maxWorkgroupsPerDimension, workgroupSize);
}

/**
 * TASK 10 — human-readable dispatch diagnostic. Wide enough to show the
 * 4,194,304 case exactly as specified.
 */
export function formatVectorDispatch(d: VectorDispatch, n: number): string {
  const rows = [
    'VECTOR ADD',
    `Elements: ${n.toLocaleString('en-US')}`,
    `Workgroup size: ${d.workgroupSize}`,
    `Total workgroups: ${d.totalWorkgroups.toLocaleString('en-US')}`,
    `Dispatch X: ${d.workgroupsX.toLocaleString('en-US')}`,
    `Dispatch Y: ${d.workgroupsY.toLocaleString('en-US')}`,
    'Dispatch Z: 1',
    `Dispatch stride: ${d.dispatchStride.toLocaleString('en-US')}`,
    `Max workgroups/dimension: ${d.maxWorkgroupsPerDimension.toLocaleString('en-US')}`,
    `Total theoretical invocations: ${(d.workgroupsX * d.workgroupsY * d.workgroupSize).toLocaleString('en-US')}`,
    `Valid elements: ${n.toLocaleString('en-US')}`,
  ];
  return rows.join('\n');
}
