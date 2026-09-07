// AETHER GPU Benchmark — Device / object identity tracking (diagnostics only).
//
// WebGPU objects do not expose the GPUDevice that created them, so when a
// browser reports "GPUComputePipeline is invalid to use with this
// GPUComputePassEncoder" we cannot read the culprit device off the object.
// Instead we assign monotonically increasing ids at creation time, inside our
// own factories, and record which device created each pipeline / bind group.
// runGpuTest then compares the recorded identities against the explicit
// execution device BEFORE setPipeline()/setBindGroup() so a real mismatch is
// reported clearly instead of surfacing as an opaque GPU validation error.

const deviceIds = new WeakMap<GPUDevice, number>();
const pipelineDeviceIds = new WeakMap<GPUComputePipeline, number>();
const bindGroupDeviceIds = new WeakMap<GPUBindGroup, number>();
const lostDevices = new WeakSet<GPUDevice>();
let nextDeviceId = 1;

export function getDeviceIdentity(device: GPUDevice): number {
  let id = deviceIds.get(device);
  if (id === undefined) {
    id = nextDeviceId++;
    deviceIds.set(device, id);
  }
  return id;
}

/** Record that `pipeline` was created by `device`. Called inside createPipeline. */
export function trackPipelineDevice(pipeline: GPUComputePipeline, device: GPUDevice): void {
  pipelineDeviceIds.set(pipeline, getDeviceIdentity(device));
}

/** Identity of the device that created the pipeline, or null if untracked. */
export function getPipelineDeviceIdentity(pipeline: GPUComputePipeline): number | null {
  return pipelineDeviceIds.has(pipeline) ? (pipelineDeviceIds.get(pipeline) as number) : null;
}

/** Record that `bindGroup` was created by `device`. Called inside createBindGroup*. */
export function trackBindGroupDevice(bindGroup: GPUBindGroup, device: GPUDevice): void {
  bindGroupDeviceIds.set(bindGroup, getDeviceIdentity(device));
}

/** Identity of the device that created the bind group, or null if untracked. */
export function getBindGroupDeviceIdentity(bindGroup: GPUBindGroup): number | null {
  return bindGroupDeviceIds.has(bindGroup) ? (bindGroupDeviceIds.get(bindGroup) as number) : null;
}

/** Mark a device as lost so no pipeline is ever executed on it afterwards. */
export function registerDeviceLost(device: GPUDevice): void {
  lostDevices.add(device);
}

export function isDeviceLost(device: GPUDevice): boolean {
  return lostDevices.has(device);
}