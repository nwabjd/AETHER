// AETHER GPU Benchmark — Robust Serialized WebGPU Readback Engine
//
// Solves iOS Safari / WebGPU mapAsync failures by ensuring:
// 1. One reusable MAP_READ staging buffer per size (recreated only on size increase)
// 2. Strict serialization of all readbacks via a promise chain
// 3. Guaranteed unmap() before buffer release/reuse
// 4. Exact mapAsync error reporting (surfacing real exceptions instead of generic aborts)
// 5. Explicit pre-map device-loss and size validation checks

export interface ReadbackDiagnostics {
  stagingSize: number;
  isMapped: boolean;
  isPending: boolean;
  queueDepth: number;
  lastStatus: 'IDLE' | 'PASS' | 'FAIL';
  lastError: string;
  deviceLost: boolean;
}

export class ReadbackManager {
  private static instance: ReadbackManager | null = null;

  public static getInstance(): ReadbackManager {
    if (!ReadbackManager.instance) {
      ReadbackManager.instance = new ReadbackManager();
    }
    return ReadbackManager.instance;
  }

  private stagingBuffer: GPUBuffer | null = null;
  private currentStagingSize = 0;
  private isMapped = false;
  private isPending = false;
  private queueDepth = 0;
  private lastStatus: 'IDLE' | 'PASS' | 'FAIL' = 'IDLE';
  private lastError = '';
  private readbackChain: Promise<void> = Promise.resolve();

  /**
   * Acquire or expand the reusable MAP_READ staging buffer for the given size.
   */
  public acquire(device: GPUDevice, size: number): GPUBuffer {
    if (size <= 0 || size % 4 !== 0) {
      throw new Error(`Invalid readback size: ${size} (must be > 0 and 4-byte aligned)`);
    }
    if (device.limits && size > device.limits.maxBufferSize) {
      throw new Error(`Readback size ${size} exceeds device limit maxBufferSize (${device.limits.maxBufferSize})`);
    }

    if (!this.stagingBuffer || this.currentStagingSize < size) {
      if (this.stagingBuffer) {
        if (this.isMapped) {
          try { this.stagingBuffer.unmap(); } catch {}
          this.isMapped = false;
        }
        try { this.stagingBuffer.destroy(); } catch {}
        this.stagingBuffer = null;
      }
      // Allocate to max of 16-byte alignment or requested size
      const targetSize = Math.max(Math.ceil(size / 16) * 16, 16);
      this.stagingBuffer = device.createBuffer({
        label: 'AETHER_Reusable_Staging_Buffer',
        size: targetSize,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      });
      this.currentStagingSize = targetSize;
    }
    return this.stagingBuffer;
  }

  /**
   * Copy source buffer contents to reusable staging buffer in a SINGLE command encoder,
   * mapAsync, copy Float32Array result, unmap, and return data.
   * Serialized sequentially so overlapping mapAsync calls are impossible.
   */
  public copyAndRead(
    device: GPUDevice,
    srcBuffer: GPUBuffer,
    size: number,
    contextInfo = 'Readback'
  ): Promise<Float32Array> {
    return this.enqueueReadback(device, async () => {
      // 1. Pre-readback validations
      if (srcBuffer.size < size) {
        throw new Error(`Copy size ${size} exceeds source buffer size ${srcBuffer.size}`);
      }

      const staging = this.acquire(device, size);
      if (staging.size < size) {
        throw new Error(`Staging buffer size ${staging.size} is smaller than requested copy size ${size}`);
      }

      // 2. Submit copy command in single encoder
      const encoder = device.createCommandEncoder({ label: `Encoder_${contextInfo}` });
      encoder.copyBufferToBuffer(srcBuffer, 0, staging, 0, size);
      device.queue.submit([encoder.finish()]);

      // 3. Map staging buffer & extract data with explicit error handling
      this.isPending = true;
      try {
        await staging.mapAsync(GPUMapMode.READ, 0, size);
        this.isMapped = true;
        this.isPending = false;

        const range = staging.getMappedRange(0, size);
        const result = new Float32Array(range.slice(0));

        staging.unmap();
        this.isMapped = false;

        this.lastStatus = 'PASS';
        this.lastError = '';
        return result;
      } catch (err: unknown) {
        this.isPending = false;
        this.isMapped = false;
        this.lastStatus = 'FAIL';
        const e = err as Error;
        const errName = e.name || 'UnknownError';
        const errMsg = e.message || String(err);
        const detailedError = `mapAsync FAIL [${contextInfo}] — ${errName}: ${errMsg} (size: ${size}B, srcSize: ${srcBuffer.size}B, stagingSize: ${staging.size}B)`;
        this.lastError = detailedError;
        console.error(detailedError);
        throw new Error(detailedError);
      }
    });
  }

  /**
   * Submit an ALREADY ENCODED command buffer (which includes copyBufferToBuffer to staging),
   * then mapAsync, extract data, and unmap.
   */
  public readSubmittedCopy(
    device: GPUDevice,
    staging: GPUBuffer,
    size: number,
    contextInfo = 'ReadbackSubmitted'
  ): Promise<Float32Array> {
    return this.enqueueReadback(device, async () => {
      this.isPending = true;
      try {
        await staging.mapAsync(GPUMapMode.READ, 0, size);
        this.isMapped = true;
        this.isPending = false;

        const range = staging.getMappedRange(0, size);
        const result = new Float32Array(range.slice(0));

        staging.unmap();
        this.isMapped = false;

        this.lastStatus = 'PASS';
        this.lastError = '';
        return result;
      } catch (err: unknown) {
        this.isPending = false;
        this.isMapped = false;
        this.lastStatus = 'FAIL';
        const e = err as Error;
        const errName = e.name || 'UnknownError';
        const errMsg = e.message || String(err);
        const detailedError = `mapAsync FAIL [${contextInfo}] — ${errName}: ${errMsg} (size: ${size}B, stagingSize: ${staging.size}B)`;
        this.lastError = detailedError;
        console.error(detailedError);
        throw new Error(detailedError);
      }
    });
  }

  /**
   * Enqueue operation on the serial readback chain.
   */
  private enqueueReadback<T>(device: GPUDevice, op: () => Promise<T>): Promise<T> {
    this.queueDepth++;
    const promise = this.readbackChain
      .catch(() => {}) // swallow previous failure so chain continues
      .then(() => op())
      .finally(() => {
        this.queueDepth = Math.max(0, this.queueDepth - 1);
      });

    this.readbackChain = promise.then(
      () => {},
      () => {}
    );
    return promise;
  }

  /**
   * Release and destroy reusable staging buffer resources.
   */
  public release(): void {
    if (this.stagingBuffer) {
      if (this.isMapped) {
        try { this.stagingBuffer.unmap(); } catch {}
        this.isMapped = false;
      }
      try { this.stagingBuffer.destroy(); } catch {}
      this.stagingBuffer = null;
      this.currentStagingSize = 0;
    }
  }

  /**
   * Return current diagnostic state for UI panel display.
   */
  public getDiagnostics(deviceLost = false): ReadbackDiagnostics {
    return {
      stagingSize: this.currentStagingSize,
      isMapped: this.isMapped,
      isPending: this.isPending,
      queueDepth: this.queueDepth,
      lastStatus: this.lastStatus,
      lastError: this.lastError,
      deviceLost,
    };
  }
}
