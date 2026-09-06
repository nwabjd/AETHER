// AETHER Tensor Runtime — KernelRegistry
// Registry of WGSL compute shaders

export interface KernelEntry {
  name: string;
  code: string;
  entryPoint: string;
}

export class KernelRegistry {
  private kernels = new Map<string, KernelEntry>();

  register(name: string, code: string, entryPoint: string = 'main'): void {
    this.kernels.set(name, { name, code, entryPoint });
  }

  get(name: string): KernelEntry | undefined {
    return this.kernels.get(name);
  }

  has(name: string): boolean {
    return this.kernels.has(name);
  }

  names(): string[] {
    return Array.from(this.kernels.keys());
  }
}
