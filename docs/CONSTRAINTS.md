# AETHER Constraints

These are non-negotiable. Every architecture decision, build step, and dependency choice must satisfy all of them.

## Hardware Constraints

1. Exactly two physical devices exist: HP Z2 G4 Mini Workstation (Windows) and iPhone 17 Pro.
2. There is NO Mac available locally.
3. Do not design the project assuming the developer owns or has local access to a Mac.
4. The HP workstation is NOT the production inference target.
5. The iPhone 17 Pro IS the production inference target.

## Infrastructure Constraints

6. Do not introduce paid infrastructure.
7. Do not introduce paid cloud AI inference.
8. GitHub Actions may be used only where necessary for the Apple toolchain (Xcode build/signing).
9. GitHub Actions usage must stay within the free public runner tier.

## Inference Constraints

10. The project's AI inference architecture must remain LOCAL ON DEVICE.
11. No remote inference calls. No cloud API dependencies at runtime.
12. Model weights ship with or are downloaded to the device and run entirely on-device.

## Development Constraints

13. The HP workstation is the sole local development environment.
14. Do not introduce a Mac requirement into local development documentation.
15. All local tooling must run on Windows.

## Client Target Constraints

16. AETHER MUST have two client targets:
    - **Target A — AETHER Native:** Swift / SwiftUI, Core ML, Core AI, Metal, Accelerate, Vision, AVFoundation, VideoToolbox.
    - **Target B — AETHER WebGPU:** TypeScript, WebGPU, WebAssembly, browser-compatible local inference.
17. The WebGPU client is the immediate testing path because the iPhone can run WebGPU through Safari 26+ / iOS 26+.
18. The Native client remains the final production architecture.

## Build Strategy

```
Windows HP workstation
  → OpenCode
  → model research / conversion / testing
  → GitHub repository
  → GitHub Actions public macOS runner
  → Xcode build / signing workflow
  → iPhone 17 Pro
```
