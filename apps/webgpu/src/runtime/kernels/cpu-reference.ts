// AETHER Tensor Runtime — CPU Reference Implementations
// Pure JavaScript fallbacks for correctness verification

export function cpuMatmul(A: Float32Array, B: Float32Array, M: number, N: number, K: number): Float32Array {
  const C = new Float32Array(M * N);
  for (let row = 0; row < M; row++) {
    for (let col = 0; col < N; col++) {
      let sum = 0;
      for (let k = 0; k < K; k++) {
        sum += A[row * K + k] * B[k * N + col];
      }
      C[row * N + col] = sum;
    }
  }
  return C;
}

export function cpuMatmulQuant(A: Float32Array, B: Int32Array, M: number, N: number, K: number, scale: number): Float32Array {
  const C = new Float32Array(M * N);
  for (let row = 0; row < M; row++) {
    for (let col = 0; col < N; col++) {
      let sum = 0;
      for (let k = 0; k < K; k++) {
        sum += A[row * K + k] * B[k * N + col] * scale;
      }
      C[row * N + col] = sum;
    }
  }
  return C;
}

export function cpuAdd(A: Float32Array, B: Float32Array): Float32Array {
  const C = new Float32Array(A.length);
  for (let i = 0; i < A.length; i++) C[i] = A[i] + B[i];
  return C;
}

export function cpuMultiply(A: Float32Array, B: Float32Array): Float32Array {
  const C = new Float32Array(A.length);
  for (let i = 0; i < A.length; i++) C[i] = A[i] * B[i];
  return C;
}

export function cpuRMSNorm(input: Float32Array, weight: Float32Array, eps: number = 1e-6): Float32Array {
  const N = input.length;
  let sumSq = 0;
  for (let i = 0; i < N; i++) sumSq += input[i] * input[i];
  const rms = Math.sqrt(sumSq / N + eps);
  const out = new Float32Array(N);
  for (let i = 0; i < N; i++) out[i] = (input[i] / rms) * weight[i];
  return out;
}

export function cpuLayerNorm(input: Float32Array, gamma: Float32Array, beta: Float32Array, eps: number = 1e-6): Float32Array {
  const N = input.length;
  let mean = 0;
  for (let i = 0; i < N; i++) mean += input[i];
  mean /= N;
  let variance = 0;
  for (let i = 0; i < N; i++) {
    const d = input[i] - mean;
    variance += d * d;
  }
  variance /= N;
  const invStd = 1 / Math.sqrt(variance + eps);
  const out = new Float32Array(N);
  for (let i = 0; i < N; i++) out[i] = (input[i] - mean) * invStd * gamma[i] + beta[i];
  return out;
}

export function cpuSoftmax(data: Float32Array, rows: number, cols: number): Float32Array {
  const out = new Float32Array(data.length);
  for (let r = 0; r < rows; r++) {
    const base = r * cols;
    let maxVal = -1e30;
    for (let j = 0; j < cols; j++) if (data[base + j] > maxVal) maxVal = data[base + j];
    let sumExp = 0;
    for (let j = 0; j < cols; j++) {
      out[base + j] = Math.exp(data[base + j] - maxVal);
      sumExp += out[base + j];
    }
    for (let j = 0; j < cols; j++) out[base + j] /= sumExp;
  }
  return out;
}

export function cpuRoPE(data: Float32Array, seq: number, dim: number, base: number = 10000): Float32Array {
  const out = new Float32Array(data.length);
  out.set(data);
  for (let i = 0; i < seq * dim / 2; i++) {
    const pos = Math.floor(i / (dim / 2));
    const half = i % (dim / 2);
    const freq = 1 / Math.pow(base, half / dim);
    const theta = pos * freq;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const idx0 = i * 2;
    const idx1 = i * 2 + 1;
    const x0 = out[idx0];
    const x1 = out[idx1];
    out[idx0] = x0 * cosT - x1 * sinT;
    out[idx1] = x0 * sinT + x1 * cosT;
  }
  return out;
}

export function cpuConv2D(
  input: Float32Array, kernel: Float32Array,
  N: number, C: number, H: number, W: number,
  F: number, FH: number, FW: number
): Float32Array {
  const OH = H - FH + 1;
  const OW = W - FW + 1;
  const output = new Float32Array(N * F * OH * OW);
  for (let n = 0; n < N; n++) {
    for (let f = 0; f < F; f++) {
      for (let oh = 0; oh < OH; oh++) {
        for (let ow = 0; ow < OW; ow++) {
          let sum = 0;
          for (let c = 0; c < C; c++) {
            for (let fh = 0; fh < FH; fh++) {
              for (let fw = 0; fw < FW; fw++) {
                sum += input[((n * C + c) * H + oh + fh) * W + ow + fw]
                     * kernel[((f * C + c) * FH + fh) * FW + fw];
              }
            }
          }
          output[((n * F + f) * OH + oh) * OW + ow] = sum;
        }
      }
    }
  }
  return output;
}

export function cpuTranspose2D(input: Float32Array, rows: number, cols: number): Float32Array {
  const output = new Float32Array(rows * cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      output[c * rows + r] = input[r * cols + c];
    }
  }
  return output;
}

export function cpuInterpolateBilinear(
  input: Float32Array,
  inW: number, inH: number,
  outW: number, outH: number,
  channels: number
): Float32Array {
  const output = new Float32Array(outW * outH * channels);
  for (let oy = 0; oy < outH; oy++) {
    for (let ox = 0; ox < outW; ox++) {
      const fx = ox * inW / outW;
      const fy = oy * inH / outH;
      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const x1 = Math.min(x0 + 1, inW - 1);
      const y1 = Math.min(y0 + 1, inH - 1);
      const wx = fx - x0;
      const wy = fy - y0;
      for (let ch = 0; ch < channels; ch++) {
        const v00 = input[(y0 * inW + x0) * channels + ch];
        const v10 = input[(y0 * inW + x1) * channels + ch];
        const v01 = input[(y1 * inW + x0) * channels + ch];
        const v11 = input[(y1 * inW + x1) * channels + ch];
        output[(oy * outW + ox) * channels + ch] =
          v00 * (1 - wx) * (1 - wy) +
          v10 * wx * (1 - wy) +
          v01 * (1 - wx) * wy +
          v11 * wx * wy;
      }
    }
  }
  return output;
}
