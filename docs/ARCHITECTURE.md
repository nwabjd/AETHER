# AETHER Architecture

## Overview

AETHER is a local-only on-device AI inference system. It ships two client targets that share a common model pipeline but diverge in runtime and UI layer.

The architecture is defined by a two-device strategy: development happens on a Windows workstation, production runs on an iPhone 17 Pro, and GitHub Actions free-tier macOS runners serve as a build bridge.

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  DEVELOPMENT TRACK                       │
│                                                          │
│  HP Z2 G4 Mini Workstation (Windows)                    │
│  ├─ OpenCode (AI-assisted development)                  │
│  ├─ Model research & conversion                         │
│  ├─ Quantization & optimization                         │
│  ├─ WebGPU client testing (local browser)               │
│  ├─ Git operations                                      │
│  └─ Push to GitHub                                      │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                  BUILD BRIDGE                             │
│                                                          │
│  GitHub Actions — public macOS runner (free tier)       │
│  ├─ Xcode build                                         │
│  ├─ Code signing                                        │
│  └─ IPA / app artifact output                           │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                  PRODUCTION TARGET                        │
│                                                          │
│  iPhone 17 Pro (A19 Pro)                                │
│  ├─ TARGET A: AETHER Native                             │
│  │   Swift / SwiftUI                                    │
│  │   Core ML runtime                                    │
│  │   Metal compute                                      │
│  │   Accelerate framework                               │
│  │   Vision / AVFoundation / VideoToolbox               │
│  │                                                       │
│  └─ TARGET B: AETHER WebGPU                             │
│      TypeScript + WebGPU                                │
│      WebAssembly                                        │
│      Safari local inference                             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Client Targets

### Target A — AETHER Native

The production architecture. Runs as a native iOS app.

| Layer | Technology |
|---|---|
| UI | Swift / SwiftUI |
| ML Runtime | Core ML |
| Compute | Metal, Accelerate |
| Vision | Vision framework |
| Media | AVFoundation, VideoToolbox |
| AI Assist | Core AI (where appropriate) |

Core ML is the primary inference runtime. Models are converted from research formats (ONNX, PyTorch) to Core ML format (.mlmodel / .mlpackage) during the development phase on the HP workstation.

Metal provides low-level GPU compute for custom operations not covered by Core ML. Accelerate provides CPU-optimized math for pre/post-processing.

### Target B — AETHER WebGPU

The immediate testing and prototyping path. Runs in Safari on the iPhone.

| Layer | Technology |
|---|---|
| Language | TypeScript |
| GPU API | WebGPU |
| Runtime | WebAssembly |
| Interface | Browser (Safari) |

WebGPU is available in Safari 26+ on iOS 26+. This allows the developer to test model inference on the actual target device (iPhone 17 Pro) without needing Xcode or a Mac for every iteration.

The WebGPU client validates model quality, latency, and memory behavior before the Native client is built.

## Model Pipeline

```
Research Model (PyTorch / ONNX / etc.)
  ↓
Format Conversion (on HP workstation)
  ↓
Quantization & Optimization (on HP workstation)
  ↓
┌──────────────────┬──────────────────┐
│ Core ML export   │ WebGPU/WASM      │
│ (.mlpackage)     │ export           │
└────────┬─────────┴────────┬─────────┘
         │                  │
    Native target      WebGPU target
```

All conversion and optimization happens on the HP workstation. The P600's 2 GB VRAM limits what can be tested locally — larger models are validated on-device via the WebGPU path or after Xcode deployment.

## Inference Architecture

- **100% on-device.** No cloud API calls. No remote inference.
- Models ship with the app or are downloaded to local storage.
- The A19 Pro's 16-core Neural Engine is the primary acceleration target for the Native client.
- The WebGPU client uses the iPhone's GPU via the browser.

## Development Workflow

See [TWO_DEVICE_STRATEGY.md](TWO_DEVICE_STRATEGY.md) for the full development workflow between the HP workstation, GitHub, and the iPhone.

See [IOS_BUILD.md](IOS_BUILD.md) for the Xcode build pipeline via GitHub Actions.

## Attention Kernel � Correctness-First Architecture (TASK 1�17)

The monolithic ATTENTION shader (`kernels.ts`) is CURRENTLY a correctness implementation, not an optimized one. It is ROW-PARALLEL: `@workgroup_size(64)`, with ONE invocation owning ONE output row (`let rowIndex = gid.x; let totalRows = u.batch * u.seq; let b = rowIndex / u.seq; let i = rowIndex % u.seq;`). Dispatch is `ceil(batch*seq/64)` workgroups (seq=256 -> 4 groups). Each invocation writes only its own `scores[base + j]` row and `out[row*seq + ...]` row, so no two invocations ever write the same memory.

Why row-parallel instead of a single-invocation monolith: the previous `@workgroup_size(1)` fix was still WRONG on iPhone — seq=256 left output rows 128..255 unwritten (observed stale GPU memory: exact 64.0 at row 128, identical to the reused MatMul-128 output buffer). A single invocation processing all rows exercised the same trap; independent row invocations make every row an independent thread.

The math is deliberately preserved: QK^T -> scale by 1/sqrt(dim) -> numerically stable softmax (max subtraction) -> softmax x V. Nothing about the algorithm was changed for the correctness fix.

Buffers are NEVER assumed zero-initialized (TASK 16): all attention output buffers are pre-filled with sentinel `-12345.0` (`ATTENTION_OUTPUT_SENTINEL`) before dispatch, and any sentinel remaining after execution is reported as UNWRITTEN ATTENTION OUTPUT with the first index. Row coverage is derived from the sentinel readback (mass-equivalent to a dedicated `rowCoverage[]` buffer): `rows covered X/N, first missing row R`.

Once correctness is fully green (seq=4/16/64/128/256), we will COMPARE performance architectures � NOT before:

- A) Row-parallel reference kernel (the current correctness implementation).
- B) Phase-split ATTN_QKT -> Softmax -> ATTN_PV (bench-only path in perf-kernels.ts, structurally closer to a parallel design).
- C) Tiled attention (shared-memory blocking).
- D) Future fused optimized attention.

No shared memory, tiling, subgroups, SIMD tricks, vectorization, atomics, half precision, or quantization is introduced until the correctness suite is fully green.
