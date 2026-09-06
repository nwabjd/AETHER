// AETHER WebGPU — Device initialization and capability detection
// Delegates to the full diagnostic system

import { runWebGPUDiagnostics, WebGPUDiagnostic } from './webgpu-diagnostics';

export interface GPUDeviceInfo {
  available: boolean;
  adapterName: string;
  adapterVendor: string;
  adapterDevice: string;
  features: string[];
  limits: {
    maxBufferSize: number;
    maxTextureDimension1D: number;
    maxTextureDimension2D: number;
    maxTextureDimension3D: number;
    maxComputeWorkgroupStorageSize: number;
    maxComputeInvocationsPerWorkgroup: number;
    maxStorageBufferBindingSize: number;
    maxUniformBufferBindingSize: number;
    maxStorageBuffersPerShaderStage: number;
    maxComputeWorkgroupSizeX: number;
    maxComputeWorkgroupSizeY: number;
    maxComputeWorkgroupSizeZ: number;
    maxComputeWorkgroupsPerDimension: number;
    maxBindingsPerBindGroup: number;
    maxSampledTexturesPerShaderStage: number;
    maxSamplersPerShaderStage: number;
    maxUniformBuffersPerShaderStage: number;
    minUniformBufferOffsetAlignment: number;
    minStorageBufferOffsetAlignment: number;
    maxColorAttachments: number;
    maxTextureArrayLayers: number;
  };
  isFallbackAdapter: boolean;
  featuresMap: Set<GPUFeatureName>;
  diagnostic?: WebGPUDiagnostic;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export async function detectGPU(): Promise<GPUDeviceInfo | null> {
  const d = await runWebGPUDiagnostics();
  if (!d.ready || !d.gpu.adapterName) return null;

  const lim = d.gpu.limits!;
  return {
    available: true,
    adapterName: d.gpu.adapterName,
    adapterVendor: d.gpu.adapterVendor,
    adapterDevice: d.gpu.adapterDevice,
    features: d.gpu.features,
    limits: {
      maxBufferSize: lim.maxBufferSize,
      maxTextureDimension1D: lim.maxTextureDimension1D,
      maxTextureDimension2D: lim.maxTextureDimension2D,
      maxTextureDimension3D: lim.maxTextureDimension3D,
      maxComputeWorkgroupStorageSize: lim.maxComputeWorkgroupStorageSize,
      maxComputeInvocationsPerWorkgroup: lim.maxComputeInvocationsPerWorkgroup,
      maxStorageBufferBindingSize: lim.maxStorageBufferBindingSize,
      maxUniformBufferBindingSize: lim.maxUniformBufferBindingSize,
      maxStorageBuffersPerShaderStage: 0,
      maxComputeWorkgroupSizeX: lim.maxComputeWorkgroupSizeX,
      maxComputeWorkgroupSizeY: lim.maxComputeWorkgroupSizeY,
      maxComputeWorkgroupSizeZ: lim.maxComputeWorkgroupSizeZ,
      maxComputeWorkgroupsPerDimension: lim.maxComputeWorkgroupsPerDimension,
      maxBindingsPerBindGroup: 0,
      maxSampledTexturesPerShaderStage: 0,
      maxSamplersPerShaderStage: 0,
      maxUniformBuffersPerShaderStage: 0,
      minUniformBufferOffsetAlignment: lim.minStorageBufferOffsetAlignment,
      minStorageBufferOffsetAlignment: lim.minUniformBufferOffsetAlignment,
      maxColorAttachments: lim.maxColorAttachments,
      maxTextureArrayLayers: 0,
    },
    isFallbackAdapter: d.gpu.isFallbackAdapter,
    featuresMap: new Set(d.gpu.features as unknown as GPUFeatureName[]),
    diagnostic: d,
  };
}

export async function getDevice(
  info: GPUDeviceInfo,
  requiredFeatures: GPUFeatureName[] = []
): Promise<GPUDevice> {
  const adapter = await navigator.gpu!.requestAdapter({
    powerPreference: 'high-performance'
  });
  if (!adapter) throw new Error('Failed to re-acquire GPU adapter');

  const device = await adapter.requestDevice({
    requiredFeatures: requiredFeatures.filter(f => info.featuresMap.has(f)),
    requiredLimits: {}
  });

  device.lost.then((info) => {
    console.error('WebGPU device lost:', info.message);
  });

  return device;
}

export { formatBytes };
