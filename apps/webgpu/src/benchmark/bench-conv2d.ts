// AETHER GPU Benchmark — Benchmark 3: Convolution
// 2D convolution with multiple tensor sizes

import {
  getDevice, createUniformBuffer, createStorageBuffer, readbackBuffer,
  createPipeline, timeExecution, formatBytes,
  type BenchmarkResult,
} from './engine';
import { CONV2D } from './kernels';

interface ConvConfig {
  name: string;
  N: number; C: number; H: number; W: number;
  F: number; FH: number; FW: number;
}

const CONFIGS: ConvConfig[] = [
  { name: '1×3×32×32, 8×3×3×3', N: 1, C: 3, H: 32, W: 32, F: 8, FH: 3, FW: 3 },
  { name: '1×3×64×64, 16×3×5×5', N: 1, C: 3, H: 64, W: 64, F: 16, FH: 5, FW: 5 },
  { name: '1×16×64×64, 32×16×3×3', N: 1, C: 16, H: 64, W: 64, F: 32, FH: 3, FW: 3 },
  { name: '1×32×128×128, 64×32×3×3', N: 1, C: 32, H: 128, W: 128, F: 64, FH: 3, FW: 3 },
];

export async function benchmarkConv2D(): Promise<BenchmarkResult[]> {
  const device = getDevice();
  const results: BenchmarkResult[] = [];

  const pipeline = createPipeline(CONV2D, 4);
  const layout = pipeline.getBindGroupLayout(0);

  for (const cfg of CONFIGS) {
    try {
      const { N, C, H, W, F, FH, FW } = cfg;
      const OH = H - FH + 1;
      const OW = W - FW + 1;

      const inputElements = N * C * H * W;
      const kernelElements = F * C * FH * FW;
      const outputElements = N * F * OH * OW;

      const inputData = new Float32Array(inputElements).fill(0.5);
      const kernelData = new Float32Array(kernelElements).fill(0.1);

      const bufInput = createStorageBuffer(inputElements * 4, inputData);
      const bufKernel = createStorageBuffer(kernelElements * 4, kernelData);
      const bufOutput = createStorageBuffer(outputElements * 4);

      const uniformData = new ArrayBuffer(36);
      const uv = new Uint32Array(uniformData);
      uv[0] = N; uv[1] = C; uv[2] = H; uv[3] = W;
      uv[4] = F; uv[5] = FH; uv[6] = FW; uv[7] = OH; uv[8] = OW;
      const uBuf = createUniformBuffer(uniformData);

      const bindGroup = device.createBindGroup({
        layout,
        entries: [
          { binding: 0, resource: { buffer: uBuf } },
          { binding: 1, resource: { buffer: bufInput } },
          { binding: 2, resource: { buffer: bufKernel } },
          { binding: 3, resource: { buffer: bufOutput } },
        ],
      });

      const timing = await timeExecution(() => {
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.dispatchWorkgroups(N, F);
        pass.end();
        device.queue.submit([encoder.finish()]);
      }, 30);

      const totalOps = N * F * C * FH * FW * OH * OW * 2;
      const gflops = totalOps / (timing.avgMs / 1000) / 1e9;

      results.push({
        id: `conv2d_${cfg.name}`,
        name: 'Convolution 2D',
        inputSize: cfg.name,
        executionTimeMs: timing.avgMs,
        throughput: `${gflops.toFixed(2)} GFLOPS`,
        memoryBytes: (inputElements + kernelElements + outputElements) * 4,
        success: true,
        gpuTimingAvailable: true,
        details: {
          inputShape: `${N}×${C}×${H}×${W}`,
          kernelShape: `${F}×${C}×${FH}×${FW}`,
          outputShape: `${N}×${F}×${OH}×${OW}`,
          flops: totalOps,
          gflops,
          iterations: timing.iterations,
          minMs: timing.minMs,
          maxMs: timing.maxMs,
          p50Ms: timing.p50Ms,
        },
      });

      bufInput.destroy();
      bufKernel.destroy();
      bufOutput.destroy();
      uBuf.destroy();
    } catch (e) {
      results.push({
        id: `conv2d_${cfg.name}`,
        name: 'Convolution 2D',
        inputSize: cfg.name,
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
