// AETHER GPU Benchmark — suite orchestrator.
// Runs QUICK / FULL / SUSTAINED benchmark sets strictly sequentially, builds
// the TASK 15 report shape, and aborts the remaining suite if a validated
// kernel fails its pre-timing correctness check (TASK 23).

import { initBenchmark, getDevice, type DeviceDiagnostics } from './engine';
import { TimingManager } from './timing';
import {
  benchMatmul,
  benchVecAdd,
  benchConv2D,
  benchSoftmax,
  benchRMSNorm,
  benchAttention,
  type AttentionResult,
} from './perf-kernels';
import { benchMemory, benchBufferReuse, benchPipelineCache, benchCommandBatching } from './perf-resources';
import { benchSustained } from './perf-sustained';
import {
  buildPerfReport,
  captureBrowserInfo,
  type PerfReport,
} from './perf-report';
import { AETHER_BUILD_ID, AETHER_COMMIT, AETHER_BUILD_TIME } from '../build-info';

export type PerfMode = 'quick' | 'full' | 'sustained';

export interface PerfOpts {
  mode: PerfMode;
  onProgress?: (msg: string) => void;
  onSecond?: (second: number, msg: string) => void;
}

let _suiteRunning = false;

export function isSuiteRunning(): boolean {
  return _suiteRunning;
}

const QUICK = {
  matmul: new Set(['matmul-128', 'matmul-256', 'matmul-512']),
  vecadd: new Set(['vecadd-1048576']),
  conv2d: new Set<string>(),
  softmax: new Set(['softmax-256']),
  rmsnorm: new Set(['rmsnorm-1024']),
  attentionSeqs: [256] as number[],
};

export async function runPerfSuite(opts: PerfOpts): Promise<PerfReport> {
  if (_suiteRunning) throw new Error('A benchmark suite is already running.');
  _suiteRunning = true;
  let tm: TimingManager | null = null;
  try {
    const diag = await initBenchmark();
    initDevLostMsg(opts);
    tm = new TimingManager(getDevice());

    const browser = captureBrowserInfo();
    const build = { id: AETHER_BUILD_ID, commit: AETHER_COMMIT ?? null, time: AETHER_BUILD_TIME ?? null };
    const full = opts.mode === 'full';

    const tests: PerfReport['tests'] = {
      matmul: [],
      vecadd: [],
      conv2d: [],
      softmax: [],
      rmsnorm: [],
      attention: [],
      attentionPhases: {},
    };

    const step = (msg: string) => opts.onProgress?.(msg);

    step('matmul');
    tests.matmul = await benchMatmul(tm, full ? undefined : QUICK.matmul);
    step('vecadd');
    tests.vecadd = await benchVecAdd(tm, full ? undefined : QUICK.vecadd);
    if (full) {
      step('conv2d');
      tests.conv2d = await benchConv2D(tm);
    }
    step('softmax');
    tests.softmax = await benchSoftmax(tm, full ? undefined : QUICK.softmax);
    step('rmsnorm');
    tests.rmsnorm = await benchRMSNorm(tm, full ? undefined : QUICK.rmsnorm);
    step('attention');
    const attn: AttentionResult = await benchAttention(tm, full ? undefined : QUICK.attentionSeqs);
    tests.attention = attn.main;
    tests.attentionPhases = attn.phases;

    let memory: PerfReport['memory'] = [];
    let bufferReuse: PerfReport['bufferReuse'] = {};
    let pipelineCache: PerfReport['pipelineCache'] = {};
    let commandBatching: PerfReport['commandBatching'] = [];
    let sustained: PerfReport['sustained'] = null;

    if (full) {
      step('memory');
      memory = await benchMemory();
      step('buffer reuse');
      bufferReuse = await benchBufferReuse();
      step('pipeline cache');
      pipelineCache = await benchPipelineCache();
      step('command batching');
      commandBatching = await benchCommandBatching();
    }

    if (opts.mode === 'sustained') {
      step('sustained (30s)');
      sustained = await benchSustained(tm, {
        onSecond: (second, sample) => opts.onSecond?.(second, `s${second}: ${sample.gflops.toFixed(2)} GFLOPS`),
      });
    }

    return buildPerfReport({ diag, browser, timingMode: tm.mode, build, tests, memory, bufferReuse, pipelineCache, commandBatching, sustained });
  } catch (e) {
    // TASK 23: a kernel validation failure aborts the remaining suite and is
    // surfaced as "fix correctness first", not as a throughput number.
    const partial: PerfReport['tests'] = {
      matmul: [],
      vecadd: [],
      conv2d: [],
      softmax: [],
      rmsnorm: [],
      attention: [],
      attentionPhases: {},
    };
    let diag: DeviceDiagnostics | null = null;
    try {
      diag = await initBenchmark();
    } catch {
      // engine may not be init-recoverable here; report what we can
    }
    if (diag && tm) {
      const report = buildPerfReport({
        diag,
        browser: captureBrowserInfo(),
        timingMode: tm.mode,
        build: { id: AETHER_BUILD_ID, commit: AETHER_COMMIT ?? null, time: AETHER_BUILD_TIME ?? null },
        tests: partial,
        memory: [],
        bufferReuse: {},
        pipelineCache: {},
        commandBatching: [],
        sustained: null,
        suiteError: (e as Error).message,
      });
      return report;
    }
    throw e;
  } finally {
    tm?.destroy();
    _suiteRunning = false;
  }
}

function initDevLostMsg(_opts: PerfOpts): void {
  // device.lost logging is handled by screen listeners; nothing extra here.
}