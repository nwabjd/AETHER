// AETHER GPU Benchmark — Canonical Per-Kernel Binding Layouts
// Binding index order matches the @binding(n) declarations in kernels.ts:
//   uniform          → var<uniform>             (uniform buffer)
//   read-only-storage → var<storage, read>      (input buffers)
//   storage          → var<storage, read_write> (output buffers)
// Shared by engine.ts, tests.ts, the perf benchmarks, standalone-matmul.ts,
// and the Node layout regression test so binding layouts can never silently
// drift from the WGSL shader declarations again.
import type { StorageAccess } from './layout';

export const VEC_ADD_BINDINGS: readonly StorageAccess[] = ['uniform', 'read-only-storage', 'read-only-storage', 'storage'];
export const MATMUL_BINDINGS: readonly StorageAccess[] = ['uniform', 'read-only-storage', 'read-only-storage', 'storage'];
export const CONV2D_BINDINGS: readonly StorageAccess[] = ['uniform', 'read-only-storage', 'read-only-storage', 'storage'];
export const SOFTMAX_BINDINGS: readonly StorageAccess[] = ['uniform', 'read-only-storage', 'storage'];
export const RMS_NORM_BINDINGS: readonly StorageAccess[] = ['uniform', 'read-only-storage', 'read-only-storage', 'storage'];
export const ATTENTION_BINDINGS: readonly StorageAccess[] = ['uniform', 'read-only-storage', 'read-only-storage', 'read-only-storage', 'storage', 'storage'];