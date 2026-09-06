# AETHER

Local on-device AI inference for iPhone, developed on Windows.

## What AETHER Is

AETHER runs AI models entirely on-device. No cloud inference. No remote APIs. The iPhone 17 Pro is the production target.

## Devices

| Device | Role |
|---|---|
| HP Z2 G4 Mini Workstation (Windows) | Development |
| iPhone 17 Pro (A19 Pro) | Production inference |

There is no Mac in the local development workflow.

## Client Targets

- **AETHER Native** — Swift / SwiftUI, Core ML, Metal, Accelerate. The production architecture.
- **AETHER WebGPU** — TypeScript, WebGPU, WebAssembly. The immediate testing path via Safari 26+ / iOS 26+.

## Build Strategy

```
HP Workstation → GitHub → GitHub Actions (macOS runner) → iPhone
```

GitHub Actions free-tier macOS runners are used only for Xcode build and signing. Everything else runs locally.

## Getting Started

1. Read [docs/HARDWARE.md](docs/HARDWARE.md) for device specifications.
2. Read [docs/CONSTRAINTS.md](docs/CONSTRAINTS.md) for non-negotiable rules.
3. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design.
4. Read [docs/TWO_DEVICE_STRATEGY.md](docs/TWO_DEVICE_STRATEGY.md) for the development workflow.
5. Read [docs/IOS_BUILD.md](docs/IOS_BUILD.md) for the iOS build pipeline.
6. Read [docs/WEBGPU_TROUBLESHOOTING.md](docs/WEBGPU_TROUBLESHOOTING.md) for WebGPU issues.

## Project Structure

```
AETHER/
├── .github/
│   └── workflows/
│       ├── build.yml              # iOS build via GitHub Actions
│       └── deploy-webgpu.yml      # WebGPU deploy to GitHub Pages
├── apps/
│   └── webgpu/                    # WebGPU prototype (PWA)
├── docs/
│   ├── HARDWARE.md
│   ├── CONSTRAINTS.md
│   ├── ARCHITECTURE.md
│   ├── IOS_BUILD.md
│   ├── TWO_DEVICE_STRATEGY.md
│   └── WEBGPU_TROUBLESHOOTING.md
├── AETHER-Native/                 # Swift / iOS project
├── models/                        # Model files and conversion scripts
└── README.md
```

## WebGPU Prototype (GitHub Pages)

The WebGPU prototype is deployed to GitHub Pages with HTTPS. This is the easiest way to test WebGPU on the iPhone — GitHub Pages serves over HTTPS, which satisfies the secure context requirement.

### Enable GitHub Pages

1. Go to your repository on GitHub
2. **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save

The deploy workflow runs automatically on push to `main`. It builds `apps/webgpu/` and deploys the static site.

### Access the HTTPS Diagnostic from iPhone

Once deployed, your site is at:

```
https://<YOUR-USERNAME>.github.io/AETHER/
```

On your iPhone:

1. Open **Safari** (not Chrome, not an in-app browser)
2. Go to: `https://<YOUR-USERNAME>.github.io/AETHER/#webgpudiag`
3. The WebGPU diagnostic runs automatically
4. If it says **WEBGPU READY** — the device supports WebGPU over HTTPS

### Why GitHub Pages Works

| Requirement | localhost (LAN) | GitHub Pages |
|---|---|---|
| HTTPS | Needs self-signed cert | Automatic |
| Secure context | No (plain HTTP) | Yes |
| WebGPU on iOS | Blocked by default | Works |
| Cost | Free | Free |

GitHub Pages provides free HTTPS hosting for static sites. No paid services are used.

### Local Development

For development on the HP workstation:

```bash
cd apps/webgpu
npm install
npm run dev    # http://localhost:5173
```

Desktop browsers allow WebGPU on `http://localhost`. For iPhone testing over LAN, either:
- Use GitHub Pages (recommended — free HTTPS)
- Or set up a self-signed certificate (see [WEBGPU_TROUBLESHOOTING.md](docs/WEBGPU_TROUBLESHOOTING.md))

## WebGPU Diagnostic Cases

| Case | Status | Meaning |
|---|---|---|
| A | UNAVAILABLE | Browser lacks WebGPU |
| B | BLOCKED | No GPU adapter available |
| C | BLOCKED | Device creation failed |
| D | READY | WebGPU works |
| E | BLOCKED | Not a secure context (HTTP) |
| F | UNAVAILABLE | OS/browser too old |
| G | BLOCKED | In-app browser / WebView |

## Screens

| Screen | Purpose |
|---|---|
| Device Test | WebGPU availability, adapter info, GPU limits |
| WebGPU Diag | Full root-cause analysis with cases A–G, copy-to-clipboard |
| Model Test | Tiny NN proof-of-concept, matmul/conv/attention benchmarks |
| Tensor Bench | GPU vs CPU correctness tests and performance comparison |
| Image Test | GPU-accelerated image processing |
| Video Test | Synthetic GPU compute video frames |
| Diagnostics | Full system diagnostics with compute benchmarks |

## License

TBD
