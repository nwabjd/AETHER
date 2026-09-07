// AETHER GPU Benchmark — CPU Reference Implementations
// Pure numeric kernels used as ground truth for GPU correctness tests.
// No WebGPU/DOM imports: safe to run in Node for the CPU unit tests.

export function cpuVecAdd(A: Float32Array, B: Float32Array): Float32Array {
  const C = new Float32Array(A.length);
  for (let i = 0; i < A.length; i++) C[i] = A[i] + B[i];
  return C;
}

export function cpuMatmul(A: Float32Array, B: Float32Array, M: number, N: number, K: number): Float32Array {
  const C = new Float32Array(M * N);
  for (let r = 0; r < M; r++) {
    for (let c = 0; c < N; c++) {
      let sum = 0;
      for (let k = 0; k < K; k++) sum += A[r * K + k] * B[k * N + c];
      C[r * N + c] = sum;
    }
  }
  return C;
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

// Numerically stable row-wise softmax (max subtraction). Never modifies input.
export function cpuSoftmax(data: Float32Array, rows: number, cols: number): Float32Array {
  const out = new Float32Array(data.length);
  for (let r = 0; r < rows; r++) {
    const base = r * cols;
    let max = -1e30;
    for (let c = 0; c < cols; c++) if (data[base + c] > max) max = data[base + c];
    let sumExp = 0;
    for (let c = 0; c < cols; c++) {
      const e = Math.exp(data[base + c] - max);
      out[base + c] = e;
      sumExp += e;
    }
    for (let c = 0; c < cols; c++) out[base + c] /= sumExp;
  }
  return out;
}

export function cpuRMSNorm(input: Float32Array, weight: Float32Array, eps: number): Float32Array {
  const N = input.length;
  let sumSq = 0;
  for (let i = 0; i < N; i++) sumSq += input[i] * input[i];
  const rms = Math.sqrt(sumSq / N + eps);
  const out = new Float32Array(N);
  for (let i = 0; i < N; i++) out[i] = (input[i] / rms) * weight[i];
  return out;
}

export function cpuAttention(
  Q: Float32Array, K: Float32Array, V: Float32Array,
  batch: number, seq: number, dim: number, scale: number
): Float32Array {
  const out = new Float32Array(batch * seq * dim);
  for (let b = 0; b < batch; b++) {
    for (let i = 0; i < seq; i++) {
      const scores: number[] = [];
      let max = -1e30;
      for (let j = 0; j < seq; j++) {
        let dot = 0;
        for (let d = 0; d < dim; d++) {
          dot += Q[(b * seq + i) * dim + d] * K[(b * seq + j) * dim + d];
        }
        const s = dot * scale;
        scores.push(s);
        if (s > max) max = s;
      }
      let sumExp = 0;
      const exps = scores.map(s => {
        const e = Math.exp(s - max);
        sumExp += e;
        return e;
      });
      for (let j = 0; j < seq; j++) {
        const p = exps[j] / sumExp;
        for (let d = 0; d < dim; d++) {
          out[(b * seq + i) * dim + d] += p * V[(b * seq + j) * dim + d];
        }
      }
    }
  }
  return out;
}