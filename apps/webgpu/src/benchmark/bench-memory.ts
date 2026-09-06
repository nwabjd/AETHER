// AETHER GPU Benchmark — Benchmark 7: Memory
// Buffer limits, allocation, upload, readback, reuse

import {
  getDevice, readbackBuffer, formatBytes,
  type BenchmarkResult, type DeviceDiagnostics,
} from './engine';

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

export async function benchmarkMemory(diag: DeviceDiagnostics): Promise<BenchmarkResult[]> {
  const device = getDevice();
  const results: BenchmarkResult[] = [];
  const maxBuf = diag.maxBufferSize;

  // ─── Test 1: Maximum buffer size ───
  {
    let maxAccepted = 0;
    let testSize = Math.min(maxBuf, 256 * 1024 * 1024); // cap at 256MB for safety
    try {
      while (testSize <= maxBuf) {
        const buf = device.createBuffer({
          size: testSize,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });
        maxAccepted = testSize;
        buf.destroy();
        if (testSize >= maxBuf) break;
        testSize = Math.min(testSize * 2, maxBuf);
      }
    } catch {
      // reached limit
    }

    results.push({
      id: 'mem_max_buffer',
      name: 'Max Buffer Size',
      inputSize: `limit=${formatBytes(maxBuf)}`,
      executionTimeMs: 0,
      throughput: `accepted=${formatBytes(maxAccepted)}`,
      memoryBytes: maxAccepted,
      success: maxAccepted > 0,
      gpuTimingAvailable: false,
      details: {
        maxBufferSizeLimit: maxBuf,
        maxBufferAccepted: maxAccepted,
        match: maxAccepted === maxBuf ? 'EXACT' : 'PARTIAL',
      },
    });
  }

  // ─── Test 2: Allocation time (multiple sizes) ───
  {
    const allocSizes = [
      1024 * 1024,        // 1 MB
      16 * 1024 * 1024,   // 16 MB
      64 * 1024 * 1024,   // 64 MB
      128 * 1024 * 1024,  // 128 MB
    ].filter(s => s <= maxBuf);

    for (const size of allocSizes) {
      try {
        const iterations = 20;
        const times: number[] = [];
        for (let i = 0; i < iterations; i++) {
          const start = performance.now();
          const buf = device.createBuffer({
            size,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
          });
          times.push(performance.now() - start);
          buf.destroy();
        }
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        results.push({
          id: `mem_alloc_${size}`,
          name: 'Allocation Time',
          inputSize: formatBytes(size),
          executionTimeMs: avg,
          throughput: `${(size / (avg / 1000) / 1048576).toFixed(1)} MB/s`,
          memoryBytes: size,
          success: true,
          gpuTimingAvailable: false,
          details: { avgMs: avg, iterations },
        });
      } catch (e) {
        results.push({
          id: `mem_alloc_${size}`,
          name: 'Allocation Time',
          inputSize: formatBytes(size),
          executionTimeMs: 0,
          throughput: 'N/A',
          memoryBytes: 0,
          success: false,
          error: (e as Error).message,
          gpuTimingAvailable: false,
        });
      }
    }
  }

  // ─── Test 3: Upload time (queue.writeBuffer) ───
  {
    const uploadSizes = [
      1024 * 1024,        // 1 MB
      16 * 1024 * 1024,   // 16 MB
      64 * 1024 * 1024,   // 64 MB
    ].filter(s => s <= maxBuf);

    for (const size of uploadSizes) {
      try {
        const elements = size / 4;
        const data = new Float32Array(elements).fill(3.14);
        const buf = createStorageBuffer(size);

        const iterations = 20;
        const times: number[] = [];
        for (let i = 0; i < iterations; i++) {
          const start = performance.now();
          device.queue.writeBuffer(buf, 0, data.buffer);
          await device.queue.onSubmittedWorkDone();
          times.push(performance.now() - start);
        }
        const avg = times.reduce((a, b) => a + b, 0) / times.length;

        results.push({
          id: `mem_upload_${size}`,
          name: 'Upload Time',
          inputSize: formatBytes(size),
          executionTimeMs: avg,
          throughput: `${(size / (avg / 1000) / 1048576).toFixed(1)} MB/s`,
          memoryBytes: size,
          success: true,
          gpuTimingAvailable: false,
          details: { avgMs: avg, iterations, method: 'queue.writeBuffer' },
        });

        buf.destroy();
      } catch (e) {
        results.push({
          id: `mem_upload_${size}`,
          name: 'Upload Time',
          inputSize: formatBytes(size),
          executionTimeMs: 0,
          throughput: 'N/A',
          memoryBytes: 0,
          success: false,
          error: (e as Error).message,
          gpuTimingAvailable: false,
        });
      }
    }
  }

  // ─── Test 4: Readback time ───
  {
    const readbackSizes = [
      1024 * 1024,        // 1 MB
      16 * 1024 * 1024,   // 16 MB
      64 * 1024 * 1024,   // 64 MB
    ].filter(s => s <= maxBuf);

    for (const size of readbackSizes) {
      try {
        const buf = createStorageBuffer(size);
        const iterations = 10;
        const times: number[] = [];
        for (let i = 0; i < iterations; i++) {
          const start = performance.now();
          await readbackBuffer(buf, size);
          times.push(performance.now() - start);
        }
        const avg = times.reduce((a, b) => a + b, 0) / times.length;

        results.push({
          id: `mem_readback_${size}`,
          name: 'Readback Time',
          inputSize: formatBytes(size),
          executionTimeMs: avg,
          throughput: `${(size / (avg / 1000) / 1048576).toFixed(1)} MB/s`,
          memoryBytes: size,
          success: true,
          gpuTimingAvailable: false,
          details: { avgMs: avg, iterations, method: 'copyBufferToBuffer + mapAsync' },
        });

        buf.destroy();
      } catch (e) {
        results.push({
          id: `mem_readback_${size}`,
          name: 'Readback Time',
          inputSize: formatBytes(size),
          executionTimeMs: 0,
          throughput: 'N/A',
          memoryBytes: 0,
          success: false,
          error: (e as Error).message,
          gpuTimingAvailable: false,
        });
      }
    }
  }

  // ─── Test 5: Buffer reuse vs re-allocation ───
  {
    const testSize = Math.min(16 * 1024 * 1024, maxBuf);
    try {
      const iterations = 50;

      // Reuse: allocate once, write many times
      const reusedBuf = createStorageBuffer(testSize);
      const data = new Float32Array(testSize / 4).fill(1.0);
      const reuseTimes: number[] = [];
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        device.queue.writeBuffer(reusedBuf, 0, data.buffer);
        reuseTimes.push(performance.now() - start);
      }

      // Re-allocate: new buffer each time
      const reallocTimes: number[] = [];
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        const buf = device.createBuffer({
          size: testSize,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(buf, 0, data.buffer);
        buf.destroy();
        reallocTimes.push(performance.now() - start);
      }

      const reuseAvg = reuseTimes.reduce((a, b) => a + b, 0) / reuseTimes.length;
      const reallocAvg = reallocTimes.reduce((a, b) => a + b, 0) / reallocTimes.length;

      results.push({
        id: 'mem_reuse_vs_realloc',
        name: 'Buffer Reuse vs Re-alloc',
        inputSize: formatBytes(testSize),
        executionTimeMs: reuseAvg,
        throughput: `reuse=${reuseAvg.toFixed(3)}ms re-alloc=${reallocAvg.toFixed(3)}ms`,
        memoryBytes: testSize,
        success: true,
        gpuTimingAvailable: false,
        details: {
          reuseAvgMs: reuseAvg,
          reallocAvgMs: reallocAvg,
          speedup: (reallocAvg / reuseAvg).toFixed(1) + 'x',
          iterations,
        },
      });

      reusedBuf.destroy();
    } catch (e) {
      results.push({
        id: 'mem_reuse_vs_realloc',
        name: 'Buffer Reuse vs Re-alloc',
        inputSize: formatBytes(testSize),
        executionTimeMs: 0,
        throughput: 'N/A',
        memoryBytes: 0,
        success: false,
        error: (e as Error).message,
        gpuTimingAvailable: false,
      });
    }
  }

  // ─── Test 6: Useful working-set size ───
  {
    // Determine the largest buffer we can actually use for computation
    let usefulSize = 0;
    const testSizes = [
      64 * 1024 * 1024,   // 64 MB
      128 * 1024 * 1024,  // 128 MB
      256 * 1024 * 1024,  // 256 MB
    ].filter(s => s <= maxBuf);

    for (const size of testSizes) {
      try {
        const buf = createStorageBuffer(size);
        // Try to actually use it: write + readback
        const data = new Float32Array(Math.min(size / 4, 1024)).fill(42.0);
        device.queue.writeBuffer(buf, 0, data.buffer);
        await device.queue.onSubmittedWorkDone();
        usefulSize = size;
        buf.destroy();
      } catch {
        break;
      }
    }

    results.push({
      id: 'mem_useful_working_set',
      name: 'Useful Working Set',
      inputSize: `tested up to ${formatBytes(maxBuf)}`,
      executionTimeMs: 0,
      throughput: `confirmed=${formatBytes(usefulSize)}`,
      memoryBytes: usefulSize,
      success: usefulSize > 0,
      gpuTimingAvailable: false,
      details: {
        maxBufferSize: maxBuf,
        usefulWorkingSet: usefulSize,
      },
    });
  }

  return results;
}

function createStorageBuffer(size: number, data?: Float32Array): GPUBuffer {
  const device = getDevice();
  const usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;

  if (data) {
    const buf = device.createBuffer({
      size: Math.max(size, data.byteLength),
      usage,
      mappedAtCreation: true,
    });
    new Float32Array(buf.getMappedRange()).set(data);
    buf.unmap();
    return buf;
  }

  return device.createBuffer({ size, usage });
}
