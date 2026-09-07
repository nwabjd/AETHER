# WebGPU Uniform Buffer Packing Specification

This document defines the exact byte layout, field types, offsets, and JavaScript typed array representations for all WebGPU WGSL `struct Uniforms` buffers across the AETHER benchmark suite.

## Background & Rule

In WGSL, `struct Uniforms` fields can be declared as `u32` (32-bit unsigned integer), `i32` (32-bit signed integer), or `f32` (32-bit IEEE-754 floating point).

Creating uniform buffers using `new Float32Array([...]).buffer` encodes integer values (such as dimension `128`) into IEEE-754 float bit representations (`0x43000000`). When WGSL reads those words as `u32`, `0x43000000` evaluates to `1124073472` instead of `128`.

**Rule:** Every `u32` field must be written using `Uint32Array` or `(val >>> 0)` at its target byte offset in an `ArrayBuffer`. `Float32Array` must ONLY be used for fields declared `f32` in WGSL. All uniform buffers must be padded to a multiple of 16 bytes for WGSL uniform buffer layout alignment.

---

## Uniform Packing Table

| Shader | Field | WGSL Type | Byte Offset | JS Representation | Helper Function |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MATMUL** | `M` | `u32` | 0 | `Uint32Array[0]` | `createMatmulUniform(M, N, K)` |
| | `N` | `u32` | 4 | `Uint32Array[1]` | |
| | `K` | `u32` | 8 | `Uint32Array[2]` | |
| | *(padding)* | `u32` | 12 | `Uint32Array[3] = 0` | |
| **VEC_ADD** | `N` | `u32` | 0 | `Uint32Array[0]` | `createVecAddUniform(N)` |
| | *(padding)* | `u32` | 4..15 | `Uint32Array[1..3] = 0` | |
| **CONV2D** | `N` | `u32` | 0 | `Uint32Array[0]` | `createConv2DUniform(...)` |
| | `C` | `u32` | 4 | `Uint32Array[1]` | |
| | `H` | `u32` | 8 | `Uint32Array[2]` | |
| | `W` | `u32` | 12 | `Uint32Array[3]` | |
| | `F` | `u32` | 16 | `Uint32Array[4]` | |
| | `FH` | `u32` | 20 | `Uint32Array[5]` | |
| | `FW` | `u32` | 24 | `Uint32Array[6]` | |
| | `OH` | `u32` | 28 | `Uint32Array[7]` | |
| | `OW` | `u32` | 32 | `Uint32Array[8]` | |
| | *(padding)* | `u32` | 36..47 | `Uint32Array[9..11] = 0` | |
| **SOFTMAX** | `rows` | `u32` | 0 | `Uint32Array[0]` | `createSoftmaxUniform(rows, cols)` |
| | `cols` | `u32` | 4 | `Uint32Array[1]` | |
| | *(padding)* | `u32` | 8..15 | `Uint32Array[2..3] = 0` | |
| **RMS_NORM** | `N` | `u32` | 0 | `Uint32Array[0]` | `createRMSNormUniform(N, eps)` |
| | `eps` | `f32` | 4 | `Float32Array[1]` | |
| | *(padding)* | `u32` | 8..15 | `Uint32Array[2..3] = 0` | |
| **ATTENTION** | `batch` | `u32` | 0 | `Uint32Array[0]` | `createAttentionUniform(...)` |
| | `seq` | `u32` | 4 | `Uint32Array[1]` | |
| | `dim` | `u32` | 8 | `Uint32Array[2]` | |
| | `scale` | `f32` | 12 | `Float32Array[3]` | |
