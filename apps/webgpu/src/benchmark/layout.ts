// AETHER GPU Benchmark — Shared Binding Layout Utilities
// Maps explicit storage-access types to WebGPU bind-group layout entries so
// the engine pipeline helper, the standalone harness, and the Node regression
// test all share a single source of truth for `var<storage, read>` bindings.
//
// This module is intentionally pure: no engine state, no device singleton, and
// no DOM/WebGPU canvas globals at module evaluation time, so it can run inside
// Node for the layout regression test as well as in the browser.

export type StorageAccess = 'uniform' | 'read-only-storage' | 'storage';

// GPUShaderStage.COMPUTE is 4. Read it defensively so this module can be
// imported in Node (regression tests) where the WebGPU globals do not exist.
const COMPUTE_VISIBILITY =
  typeof GPUShaderStage !== 'undefined' ? GPUShaderStage.COMPUTE : 4;

export function buildBindingLayoutEntries(
  bindingTypes: readonly StorageAccess[],
  visibility: number = COMPUTE_VISIBILITY
): GPUBindGroupLayoutEntry[] {
  return bindingTypes.map((type, binding) => ({
    binding,
    visibility,
    buffer: { type },
  }));
}

export function createBindGroupLayoutForBindings(
  device: GPUDevice,
  bindingTypes: readonly StorageAccess[]
): GPUBindGroupLayout {
  return device.createBindGroupLayout({ entries: buildBindingLayoutEntries(bindingTypes) });
}

export function assertBindingCount(
  bindingTypes: readonly StorageAccess[],
  entries: readonly GPUBindGroupEntry[],
  label = 'bind group'
): void {
  if (bindingTypes.length !== entries.length) {
    throw new Error(
      `${label} binding count mismatch: pipeline layout declares ${bindingTypes.length} bindings ` +
      `but ${entries.length} entries were provided.`
    );
  }
}