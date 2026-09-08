// AETHER GPU Benchmark — Harness submission / readback counters (developer mode)
//
// TASK 21/22: records commandBuffer creation/submission, warmup vs measurement
// submissions, full-tensor readbacks, completion-token reads, and mapAsync
// concurrency. Everything is observable so no submission is ever hidden.
// This module is pure state (no imports) so Node tests can drive it directly.

export interface HarnessSnapshot {
  commandBuffersCreated: number;
  commandBuffersSubmitted: number;
  warmupSubmissions: number;
  measurementSubmissions: number;
  syncSubmissions: number;
  readbackOperations: number;
  completionReads: number;
  mapOverlapDetected: boolean;
  peakMappedConcurrent: number;
}

class HarnessCounters {
  commandBuffersCreated = 0;
  commandBuffersSubmitted = 0;
  warmupSubmissions = 0;
  measurementSubmissions = 0;
  syncSubmissions = 0;
  readbackOperations = 0;
  completionReads = 0;
  mapOverlapDetected = false;
  peakMappedConcurrent = 0;
  private _activeMaps = 0;

  reset(): void {
    this.commandBuffersCreated = 0;
    this.commandBuffersSubmitted = 0;
    this.warmupSubmissions = 0;
    this.measurementSubmissions = 0;
    this.syncSubmissions = 0;
    this.readbackOperations = 0;
    this.completionReads = 0;
    this.mapOverlapDetected = false;
    this.peakMappedConcurrent = 0;
    this._activeMaps = 0;
  }

  onCommandBufferCreated(): void {
    this.commandBuffersCreated++;
  }

  onCommandBufferSubmitted(kind: 'warmup' | 'measurement' | 'sync' | 'readback' | 'other' = 'other'): void {
    this.commandBuffersSubmitted++;
    if (kind === 'warmup') this.warmupSubmissions++;
    else if (kind === 'measurement') this.measurementSubmissions++;
    else if (kind === 'sync') this.syncSubmissions++;
  }

  onReadbackOperation(): void {
    this.readbackOperations++;
  }

  onCompletionRead(): void {
    this.completionReads++;
  }

  onMapBegin(): void {
    if (this._activeMaps > 0) this.mapOverlapDetected = true;
    this._activeMaps++;
    this.peakMappedConcurrent = Math.max(this.peakMappedConcurrent, this._activeMaps);
  }

  onMapEnd(): void {
    this._activeMaps = Math.max(0, this._activeMaps - 1);
  }

  snapshot(): HarnessSnapshot {
    return {
      commandBuffersCreated: this.commandBuffersCreated,
      commandBuffersSubmitted: this.commandBuffersSubmitted,
      warmupSubmissions: this.warmupSubmissions,
      measurementSubmissions: this.measurementSubmissions,
      syncSubmissions: this.syncSubmissions,
      readbackOperations: this.readbackOperations,
      completionReads: this.completionReads,
      mapOverlapDetected: this.mapOverlapDetected,
      peakMappedConcurrent: this.peakMappedConcurrent,
    };
  }
}

export const harnessCounters = new HarnessCounters();