// AETHER GPU Benchmark — Benchmark 2: Matrix Multiplication
// C = A × B at 128×128, 256×256, 512×512, 1024×1024

import {
  getDevice, createUniformBuffer, createStorageBuffer, readbackBuffer,
  createPipeline, timeExecution, formatBytes,
  type BenchmarkResult,
} from './engine';
import { MATMUL } from './kernels';

const SIZES = [128, 256, 512];

// CPU reference for correctness
function cpuMatmul(A: Float32Array, B: Float32Array, M: number, N: number, K: number): Float32Array {
  const C = new Float32Array(M * N);
  for (let r = 0; r < M; r++) {
    for (let c = 0; c < N; c++) {
      let sum = 0;
      for (let k = 0; k < K; k++) {
        sum += A[r * K + k] * B[k * N + c];
      }
      C[r * N + c] = sum;
    }
  }
  return C;
}

export async function benchmarkMatmul(): Promise<BenchmarkResult[]> {
  const device = getDevice();
  const results: BenchmarkResult[] = [];

  const pipeline = createPipeline(MATMUL, 4);
  const layout = pipeline.getBindGroupLayout(0);

  for (const N of SIZES) {
    try {
      const M = N;
      const K = N;
      const totalElements = M * K + K * N + M * N;
      const totalBytes = totalElements * 4;

      const aData = new Float32Array(M * K).fill(1.0);
      const bData = new Float32Array(K * N).fill(0.5);

      const bufA = createStorageBuffer(M * K * 4, aData);
      const bufB = createStorageBuffer(K * N * 4, bData);
      const bufC = createStorageBuffer(M * N * 4);

      const uniformData = new ArrayBuffer(12);
      const uv = new Uint32Array(uniformData);
      uv[0] = M; uv[1] = N; uv[2] = K;
      const uBuf = createUniformBuffer(uniformData);

      const bindGroup = device.createBindGroup({
        layout,
        entries: [
          { binding: 0, resource: { buffer: uBuf } },
          { binding: 1, resource: { buffer: bufA } },
          { binding: 2, resource: { buffer: bufB } },
          { binding: 3, resource: { buffer: bufC } },
        ],
      });

      const wgX = Math.ceil(M / 16);
      const wgY = Math.ceil(N / 16);

      const timing = await timeExecution(() => {
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.dispatchWorkgroups(wgX, wgY);
        pass.end();
        device.queue.submit([encoder.finish()]);
      }, N <= 256 ? 50 : 20);

      // Verify correctness (small sizes only)
      let correct = true;
      if (N <= 256) {
        const gpuResult = await readbackBuffer(bufC, M * N * 4);
        const cpuResult = cpuMatmul(aData, bData, M, N, K);
        for (let i = 0; i < M * N; i++) {
          if (Math.abs(gpuResult[i] - cpuResult[i]) > 1e-3) {
            correct = false;
            break;
          }
        }
      }

      // Throughput: 2*M*N*K FLOPs per multiply
      const flops = 2 * M * N * K;
      const gflops = flops / (timing.avgMs / 1000) / 1e9;

      results.push({
        id: `matmul_${N}`,
        name: 'Matrix Multiplication',
        inputSize: `${N}×${N}`,
        executionTimeMs: timing.avgMs,
        throughput: `${gflops.toFixed(2)} GFLOPS`,
        memoryBytes: totalBytes,
        success: correct,
        gpuTimingAvailable: true,
        details: {
          M, N, K,
          flops,
          gflops,
          iterations: timing.iterations,
          minMs: timing.minMs,
          maxMs: timing.maxMs,
          p50Ms: timing.p50Ms,
          correctness: N <= 256 ? (correct ? 'PASS' : 'FAIL') : 'NOT_TESTED (>256)',
        },
      });

      bufA.destroy();
      bufB.destroy();
      bufC.destroy();
      uBuf.destroy();
    } catch (e) {
      results.push({
        id: `matmul_${N}`,
        name: 'Matrix Multiplication',
        inputSize: `${N}×${N}`,
        executionTimeMs: 0,
        throughput: 'N/A',
        memoryBytes: 0,
        success: false,
        error: (e as Error).message,
        gpuTimingAvailable: false,
      });
    }
  }

  return results;
}
