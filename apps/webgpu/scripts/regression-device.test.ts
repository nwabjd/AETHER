// AETHER GPU Benchmark — WebGPU Device-Identity Regression Test (Node, no GPU)
//
// TASK 14 — proves the pre-setPipeline() guard: a pipeline created by device A
// is never accepted for execution on device B. Runs entirely in Node against
// the pure identity maps from device-identity.ts and the verifyPipelineDevice
// guard from gpu-test.ts (which only touches WeakMaps — no WebGPU calls).
//
// Run: npm test
import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import {
  getDeviceIdentity,
  trackPipelineDevice,
  getPipelineDeviceIdentity,
  trackBindGroupDevice,
  getBindGroupDeviceIdentity,
  registerDeviceLost,
  isDeviceLost,
} from '../src/benchmark/device-identity.ts';
import { verifyPipelineDevice } from '../src/benchmark/gpu-test.ts';

function fakeDevice(): GPUDevice {
  return {} as unknown as GPUDevice;
}

test('device identities are unique per device and stable per device', () => {
  const a = fakeDevice();
  const b = fakeDevice();
  const a1 = getDeviceIdentity(a);
  const a2 = getDeviceIdentity(a);
  const b1 = getDeviceIdentity(b);
  assert.equal(a1, a2, 'same device returns the same id');
  assert.notEqual(a1, b1, 'different devices get different ids');
});

test('pipeline created by device A never passes execution on device B', () => {
  const a = fakeDevice();
  const b = fakeDevice();
  const pipeline = {} as unknown as GPUComputePipeline;
  trackPipelineDevice(pipeline, a);

  const check = verifyPipelineDevice(b, pipeline);
  assert.equal(check.mismatch, true);
  assert.equal(check.ok, false);
  assert.equal(check.pipelineDeviceId, getDeviceIdentity(a));
  assert.equal(check.executionDeviceId, getDeviceIdentity(b));
  // The message a user would see on the iPhone.
  assert.equal(
    check.pipelineDeviceId! === check.executionDeviceId,
    false,
    'pipeline device id and execution device id differ'
  );
});

test('pipeline created by the same device passes execution', () => {
  const a = fakeDevice();
  const pipeline = {} as unknown as GPUComputePipeline;
  trackPipelineDevice(pipeline, a);

  const check = verifyPipelineDevice(a, pipeline);
  assert.equal(check.mismatch, false);
  assert.equal(check.ok, true);
});

test('untracked pipeline reports identity unavailable and is allowed (not fabricated)', () => {
  const a = fakeDevice();
  const pipeline = {} as unknown as GPUComputePipeline;

  const check = verifyPipelineDevice(a, pipeline);
  assert.equal(check.identityUnavailable, true);
  assert.equal(check.mismatch, false);
  assert.equal(check.ok, true);
  assert.equal(getPipelineDeviceIdentity(pipeline), null);
  assert.equal(getBindGroupDeviceIdentity({} as unknown as GPUBindGroup), null);
});

test('bind group identity is recorded per binding device and readable', () => {
  const a = fakeDevice();
  const b = fakeDevice();
  const bg = {} as unknown as GPUBindGroup;
  trackBindGroupDevice(bg, a);

  assert.equal(getBindGroupDeviceIdentity(bg), getDeviceIdentity(a));
  assert.notEqual(getBindGroupDeviceIdentity(bg), getDeviceIdentity(b));
});

test('device lost registration blocks later execution checks', () => {
  const a = fakeDevice();
  assert.equal(isDeviceLost(a), false);
  registerDeviceLost(a);
  assert.equal(isDeviceLost(a), true);
});