// AETHER Tensor Runtime — GPU context

export interface GPUContextState {
  adapter: GPUAdapter;
  device: GPUDevice;
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
  features: Set<string>;
}

let _state: GPUContextState | null = null;

export async function initGPUContext(): Promise<GPUContextState> {
  if (_state) return _state;

  if (!navigator.gpu) {
    throw new Error('WebGPU not supported in this browser');
  }

  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: 'high-performance'
  });

  if (!adapter) {
    throw new Error('No GPU adapter available');
  }

  const limits = adapter.limits;
  const features = new Set<string>(adapter.features as unknown as string[]);

  const device = await adapter.requestDevice({
    requiredLimits: {}
  });

  device.lost.then(info => {
    console.error('WebGPU device lost:', info.message);
    _state = null;
  });

  _state = {
    adapter,
    device,
    limits: {
      maxBufferSize: limits.maxBufferSize,
      maxTextureDimension1D: limits.maxTextureDimension1D,
      maxTextureDimension2D: limits.maxTextureDimension2D,
      maxTextureDimension3D: limits.maxTextureDimension3D,
      maxComputeWorkgroupStorageSize: limits.maxComputeWorkgroupStorageSize,
      maxComputeInvocationsPerWorkgroup: limits.maxComputeInvocationsPerWorkgroup,
      maxStorageBufferBindingSize: limits.maxStorageBufferBindingSize,
      maxUniformBufferBindingSize: limits.maxUniformBufferBindingSize,
      maxStorageBuffersPerShaderStage: limits.maxStorageBuffersPerShaderStage,
      maxComputeWorkgroupSizeX: limits.maxComputeWorkgroupSizeX,
      maxComputeWorkgroupSizeY: limits.maxComputeWorkgroupSizeY,
      maxComputeWorkgroupSizeZ: limits.maxComputeWorkgroupSizeZ,
      maxComputeWorkgroupsPerDimension: limits.maxComputeWorkgroupsPerDimension,
      maxBindingsPerBindGroup: limits.maxBindingsPerBindGroup,
      maxSampledTexturesPerShaderStage: limits.maxSampledTexturesPerShaderStage,
      maxSamplersPerShaderStage: limits.maxSamplersPerShaderStage,
      maxUniformBuffersPerShaderStage: limits.maxUniformBuffersPerShaderStage,
      minUniformBufferOffsetAlignment: limits.minUniformBufferOffsetAlignment,
      minStorageBufferOffsetAlignment: limits.minStorageBufferOffsetAlignment,
      maxColorAttachments: limits.maxColorAttachments,
      maxTextureArrayLayers: limits.maxTextureArrayLayers,
    },
    features,
  };

  return _state;
}

export function getGPUContext(): GPUContextState {
  if (!_state) throw new Error('GPUContext not initialized. Call initGPUContext() first.');
  return _state;
}

export function destroyGPUContext(): void {
  if (_state) {
    _state.device.destroy();
    _state = null;
  }
}
