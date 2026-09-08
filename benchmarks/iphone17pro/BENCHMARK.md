# iPhone 17 Pro WebGPU Performance Baseline

- **Device**: iPhone 17 Pro
- **WebGPU Support**: Enabled
- **Benchmark Version**: 0.1.0
- **Git Commit**: 119880d
- **Timestamp**: 2026-09-08T12:43:00Z

## Performance Summary

| Operation | Configuration | Median (ms) | Throughput | Note |
| :--- | :--- | :--- | :--- | :--- |
| MatMul | 128×128 | 1.00 | 4.2 GFLOPS | |
| MatMul | 256×256 | 2.00 | 16.8 GFLOPS | |
| MatMul | 512×512 | 4.00 | 67.1 GFLOPS | |
| MatMul | 1024×1024 | 18.00 | 119.3 GFLOPS | |
| Vector Add | 1,000 | 0.0 | - | |
| Vector Add | 16,000 | 0.0 | - | |
| Vector Add | 64,000 | 0.0 | - | |
| Vector Add | 262,144 | 0.0 | - | |
| Vector Add | 1,048,576 | 1.00 | 12.6 GB/s | |
| Vector Add | 4,194,304 | 3.00 | 16.8 GB/s | |
| Conv2D | 32×32 | 0.0 | - | |
| Conv2D | 64×64 | 0.0 | - | |
| Conv2D | 128×128 | 0.0 | - | |
| Softmax | 128×128 | 0.0 | - | |
| Softmax | 256×256 | 1.00 | - | |
| Softmax | 512×512 | 0.0 | - | |
| RMSNorm | 256 | 0.0 | - | |
| RMSNorm | 512 | 0.0 | - | |
| RMSNorm | 1024 | 0.0 | - | |
| RMSNorm | 2048 | 1.00 | - | |
| RMSNorm | 4096 | 1.00 | - | |
| Attention | 128 | 2.00 | 2.1 GFLOPS | |
| Attention | 256 | 3.00 | 5.6 GFLOPS | |
| Attention | 512 | 7.00 | 9.6 GFLOPS | |
| Attention | 1024 | 17.00 | 15.8 GFLOPS | |

*(Note: 0.0 µs indicates sub-millisecond execution time, likely due to timer resolution limitations on this platform.)*
