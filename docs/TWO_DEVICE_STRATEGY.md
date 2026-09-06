# AETHER Two-Device Strategy

## The Problem

The developer has a Windows workstation and an iPhone. iOS apps require Xcode, which requires macOS. There is no Mac locally.

## The Solution

Three environments, each with a defined role:

| Environment | Role | Used For |
|---|---|---|
| HP Z2 G4 Mini (Windows) | Development | Code, model research, conversion, WebGPU testing, Git |
| GitHub Actions (macOS runner) | Build bridge | Xcode build, code signing, IPA generation only |
| iPhone 17 Pro | Production target | On-device inference, UI testing, final validation |

## Development Phases

### Phase 1 — WebGPU Client (Immediate)

This is the fastest path to running inference on the iPhone.

```
HP Workstation
  Write TypeScript + WebGPU code
  ↓
  Test in Chrome/Edge on Windows (WebGPU supported)
  ↓
  Push to GitHub
  ↓
  Open on iPhone via Safari
  ↓
  WebGPU runs locally in browser
  ↓
  Validate: latency, memory, model quality
```

No Mac needed. No Xcode needed. The iPhone's Safari browser supports WebGPU and can run the inference pipeline entirely in-browser.

**What this validates:**
- Model fits in device memory
- Inference latency is acceptable
- Output quality is correct
- The TypeScript/WebGPU pipeline works end-to-end

### Phase 2 — Native Client (Production)

Once the WebGPU client validates the model pipeline, build the native iOS app.

```
HP Workstation
  Write Swift/SwiftUI code
  Convert models to Core ML format
  ↓
  git push
  ↓
  GitHub Actions (macOS runner)
  Xcode build + sign
  ↓
  IPA artifact
  ↓
  Install on iPhone
  ↓
  Validate: native performance, Neural Engine, full feature set
```

The macOS runner is only invoked here — to produce a signed IPA that can install on the iPhone.

### Phase 3 — Iteration Loop

After the initial native build, iteration follows this pattern:

1. **Quick iterations** — Use the WebGPU client on the iPhone (push to GitHub, open in Safari).
2. **Native feature work** — Push to GitHub, let Actions build, install IPA.
3. **Model updates** — Convert on HP workstation, test via WebGPU first, then rebuild native.

## What the HP Workstation Handles

| Task | Tool |
|---|---|
| Code editing | OpenCode |
| Model research | Python, PyTorch, ONNX Runtime |
| Model conversion | Core ML tools, ONNX converters |
| Quantization | GGML/GGUF tools, custom scripts |
| WebGPU testing | Local browser (Chrome/Edge with WebGPU) |
| Version control | Git → GitHub |
| Build triggering | git push triggers GitHub Actions |

## What GitHub Actions Handles

| Task | Runner |
|---|---|
| Xcode build | `macos-latest` (free tier) |
| Code signing | Automatic with stored certificates |
| IPA export | xcodebuild -exportArchive |

That is ALL GitHub Actions does. It is not a CI/CD platform for this project. It is a build bridge.

## What the iPhone Handles

| Task | Runtime |
|---|---|
| Production inference | Core ML (Native) or WebGPU (Safari) |
| UI | SwiftUI (Native) or Web (Safari) |
| Camera/vision | Vision, AVFoundation (Native) |
| Media processing | VideoToolbox, Metal (Native) |

## Cost

| Component | Cost |
|---|---|
| HP Workstation | Already owned |
| iPhone 17 Pro | Already owned |
| GitHub Actions | Free (public repo, macOS runner) |
| Apple Developer | $99/year (required for device deployment) |
| Cloud inference | None — everything is on-device |

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| GitHub Actions runner changes pricing | Keep build simple; minimize runner time; public repo tier is stable |
| Apple changes signing requirements | Monitor WWDC; keep certificates updated |
| WebGPU support changes in Safari | Target stable WebGPU spec; fallback to WebAssembly |
| Model too large for iPhone | Quantize aggressively; validate memory on-device early |
| P600 VRAM limits testing | Use CPU fallback for large model testing; validate on iPhone via WebGPU |

## Documentation Map

- [HARDWARE.md](HARDWARE.md) — Device specifications
- [CONSTRAINTS.md](CONSTRAINTS.md) — Non-negotiable rules
- [ARCHITECTURE.md](ARCHITECTURE.md) — System design and client targets
- [IOS_BUILD.md](IOS_BUILD.md) — Xcode build pipeline via GitHub Actions
