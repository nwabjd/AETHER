// AETHER GPU Benchmark — ReadbackManager Unit Tests (Node, no WebGPU device)
import { strict as assert } from 'node:assert';
import { ReadbackManager } from '../src/benchmark/readback.ts';

// 1. Singleton pattern test
{
  const r1 = ReadbackManager.getInstance();
  const r2 = ReadbackManager.getInstance();
  assert.strictEqual(r1, r2, 'ReadbackManager must be a singleton instance');
}

// 2. Initial state verification
{
  const mgr = ReadbackManager.getInstance();
  const diag = mgr.getDiagnostics(false);
  assert.strictEqual(diag.stagingSize, 0);
  assert.strictEqual(diag.isMapped, false);
  assert.strictEqual(diag.isPending, false);
  assert.strictEqual(diag.queueDepth, 0);
  assert.strictEqual(diag.lastStatus, 'IDLE');
}

// 3. Size validation errors
{
  const mgr = ReadbackManager.getInstance();
  // Fake device object
  const mockDevice = { limits: { maxBufferSize: 1048576 } } as unknown as GPUDevice;

  assert.throws(() => {
    mgr.acquire(mockDevice, 0);
  }, /Invalid readback size/);

  assert.throws(() => {
    mgr.acquire(mockDevice, 3); // not 4-byte aligned
  }, /Invalid readback size/);

  assert.throws(() => {
    mgr.acquire(mockDevice, 2000000); // exceeds limit
  }, /exceeds device limit/);
}

console.log('PASS: ReadbackManager regression tests');
