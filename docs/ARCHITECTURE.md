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

The monolithic ATTENTION shader (`kernels.ts`) is CURRENTLY a correctness implementation, not an optimized one. It uses `@workgroup_size(1)` so that exactly ONE invocation owns ONE batch: no two invocations ever write the same `scores`/`out` locations, which eliminates the data race seen when 16 invocations concurrently ran the full QK^T -> softmax -> PV loop for batch=1. Worker-scope loops over all i/j/d make determinism the priority.

The math is deliberately preserved: QK^T -> scale by 1/sqrt(dim) -> numerically stable softmax (max subtraction) -> softmax x V. Nothing about the algorithm was changed for the correctness fix.

Once correctness is fully green (seq=4/16/64/128/256), we will COMPARE performance architectures � NOT before:

- A) Safe monolithic correctness kernel (current: @workgroup_size(1)).
- B) Phase-split ATTN_QKT -> Softmax -> ATTN_PV (bench-only path in perf-kernels.ts, structurally closer to a parallel design).
- C) Tiled attention (shared-memory blocking).
- D) Future fused optimized attention.

No shared memory, tiling, subgroups, SIMD tricks, vectorization, atomics, half precision, or quantization is introduced until the correctness suite is fully green.
