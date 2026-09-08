# AETHER Performance Baseline

This document records the initial WebGPU performance baseline for the AETHER benchmark on the iPhone 17 Pro.

## Baseline Definition

- **Device**: iPhone 17 Pro
- **Platform**: iOS / Safari
- **Methodology**: End-to-end measurement (completion-gated)
- **Reference Commit**: `119880d`
- **Date**: 2026-09-08

## Purpose

The purpose of this baseline is to provide a fixed reference point for evaluating performance optimizations or regressions as the AETHER inference engine evolves. All subsequent performance changes will be measured against these initial results.

## Key Observations

1. **Compute Throughput**: MatMul performance scales significantly with matrix size, reaching over 100 GFLOPS at 1024x1024.
2. **Memory Bandwidth**: Vector Add shows strong scaling for large element counts, peaking at ~16.8 GB/s.
3. **Timer Resolution**: Small workloads often measure as 0.0 µs due to the Safari/WebKit timer resolution. This motivates the move towards "Amplified Timing" in future versions.
4. **Attention Scaling**: Attention execution time follows the expected quadratic growth with sequence length.

For detailed results, see [BENCHMARK.md](../benchmarks/iphone17pro/BENCHMARK.md).
