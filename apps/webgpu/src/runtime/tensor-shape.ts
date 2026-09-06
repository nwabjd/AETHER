// AETHER Tensor Runtime — Shape

export class TensorShape {
  readonly dims: readonly number[];
  readonly ndim: number;
  readonly size: number;
  readonly strides: readonly number[];

  constructor(dims: number | readonly number[]) {
    this.dims = typeof dims === 'number' ? [dims] : [...dims];
    this.ndim = this.dims.length;
    this.size = this.dims.reduce((a, b) => a * b, 1);

    const s = new Array<number>(this.ndim);
    let stride = 1;
    for (let i = this.ndim - 1; i >= 0; i--) {
      s[i] = stride;
      stride *= this.dims[i];
    }
    this.strides = s;
  }

  equals(other: TensorShape): boolean {
    if (this.ndim !== other.ndim) return false;
    for (let i = 0; i < this.ndim; i++) {
      if (this.dims[i] !== other.dims[i]) return false;
    }
    return true;
  }

  isContiguous(): boolean {
    let expected = 1;
    for (let i = this.ndim - 1; i >= 0; i--) {
      if (this.strides[i] !== expected) return false;
      expected *= this.dims[i];
    }
    return true;
  }

  toString(): string {
    return `TensorShape([${this.dims.join(', ')}])`;
  }

  static scalar(): TensorShape {
    return new TensorShape([1]);
  }

  static from(...dims: number[]): TensorShape {
    return new TensorShape(dims);
  }
}
