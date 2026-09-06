# AETHER Hardware Reference

## Physical Devices

AETHER operates on exactly two physical devices. There is no Mac in the development workflow.

### Device 1 — Development Workstation

| Attribute | Value |
|---|---|
| Model | HP Z2 G4 Mini Workstation |
| OS | Windows |
| RAM | 16 GB |
| Storage | ~4 TB SSD |
| GPU | NVIDIA Quadro P600 |
| Role | Development, model research, conversion, testing |

**GPU Note:** The Quadro P600 is a Pascal-generation card with 2 GB VRAM. Treat it as a low-VRAM development accelerator. Verify actual VRAM at runtime before allocating model weights to GPU memory. The P600 is NOT the production inference target.

### Device 2 — Target Device

| Attribute | Value |
|---|---|
| Model | iPhone 17 Pro |
| Storage | 256 GB |
| SoC | Apple A19 Pro |
| CPU | 6-core |
| GPU | 6-core with Neural Accelerators |
| Neural Engine | 16-core |
| Role | Production inference target |

The iPhone 17 Pro is the ONLY production inference target. All model sizing, optimization, and performance budgets are calibrated to this device.

---

## Why Two Devices

The HP workstation handles everything that requires a desktop OS: code editing, model research, weight conversion, testing with CUDA/OpenCL, Git operations, and CI pipeline management.

The iPhone handles all on-device AI inference in production. It is the device end users will experience.

GitHub Actions free-tier macOS runners serve as a build bridge only — they compile and sign the iOS app, nothing more.
