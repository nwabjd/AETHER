// AETHER Tensor Runtime — Data types

export enum TensorDType {
  Float32 = 'f32',
  Float16 = 'f16',
  Int32 = 'i32',
  Int8 = 'i8',
  Uint8 = 'u8',
}

export const DTYPE_INFO: Record<TensorDType, { bytes: number; name: string }> = {
  [TensorDType.Float32]: { bytes: 4, name: 'f32' },
  [TensorDType.Float16]: { bytes: 2, name: 'f16' },
  [TensorDType.Int32]: { bytes: 4, name: 'i32' },
  [TensorDType.Int8]: { bytes: 1, name: 'i8' },
  [TensorDType.Uint8]: { bytes: 1, name: 'u8' },
};

export function dtypeBytes(dt: TensorDType): number {
  return DTYPE_INFO[dt].bytes;
}
