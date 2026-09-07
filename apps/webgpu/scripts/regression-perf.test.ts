// AETHER GPU Benchmark — Performance-Report Regression Test (Node, no GPU)
//
// Guards the GATE 3 plumbing that doesn't need a GPU:
//   • TimingStats statistics (median/min/max/stddev) are correct.
//   • buildPerfReport preserves the exact TASK 15 JSON shape and never
//     persists NaN/Infinity.
//   • Thermal state / GPU utilization report UNAVAILABLE rather than a
//     fabricated value.
//   • interpretResults is data-driven (no fabricated maxima) and covers the
//     compute-, bandwidth- and attention-bottleneck cases.
//
// Run: npm test
import { strict as assert } from 'node:assert';

import { statsOf } from '../src/benchmark/timing.ts';
import {
  buildPerfReport,
  buildIphoneBaseline,
  thermalStateValue,
  gpuUtilizationValue,
  interpretResults,
  captureBrowserInfo,
  type PerfReport,
  type ReportInput,
} from '../src/benchmark/perf-report.ts';

function diagFixture() {
  return {
    webgpuAvailable: true,
    adapterName: 'Apple Test GPU',
    adapterVendor: 'Apple',
    adapterDevice: 'A17 Pro',
    adapterFeatures: ['timestamp-query'],
    adapterLimits: {} as Record<string, number>,
    preferredCanvasFormat: 'bgra8unorm',
    maxBufferSize: 1 << 30,
    maxStorageBufferBindingSize: 1 << 29,
    maxComputeWorkgroupSizeX: 256,
    maxComputeWorkgroupSizeY: 256,
    maxComputeWorkgroupSizeZ: 64,
    maxComputeInvocationsPerWorkgroup: 512,
    maxComputeWorkgroupsPerDimension: 65535,
    timestampQuerySupport: true,
    isFallbackAdapter: false,
  };
}

const browserFixture = {
  userAgent: 'test-agent',
  platform: 'iPhone',
  hardwareConcurrency: 6,
  deviceMemory: 4,
  thermalState: 'UNAVAILABLE',
  gpuUtilization: 'UNAVAILABLE',
};

function emptyInput(over: Partial<ReportInput> = {}): ReportInput {
  return {
    diag: diagFixture() as unknown as ReportInput['diag'],
    browser: browserFixture,
    timingMode: 'GPU_TIMESTAMP',
    build: { id: 'test', commit: 'abc', time: 'now' },
    tests: {
      matmul: [],
      vecadd: [],
      conv2d: [],
      softmax: [],
      rmsnorm: [],
      attention: [],
      attentionPhases: {},
    },
    memory: [],
    bufferReuse: {},
    pipelineCache: {},
    commandBatching: [],
    sustained: null,
    ...over,
  };
}

function makeSample(over: Partial<PerfReport['tests']['matmul'][number]> = {}): PerfReport['tests']['matmul'][number] {
  return {
    id: 'matmul-128',
    name: 'Matrix Multiply',
    size: '128×128',
    timingMode: 'GPU_TIMESTAMP',
    iterations: 12,
    warmup: 3,
    medianMs: 0.05,
    averageMs: 0.052,
    minMs: 0.049,
    maxMs: 0.06,
    stdDevMs: 0.002,
    throughput: { value: 42, unit: 'GFLOPS' },
    ...over,
  };
}

import { test } from 'node:test';

test('statsOf computes median/min/max/stddev correctly', () => {
  const s = statsOf([1, 2, 3, 4, 100], 'END_TO_END', 5, 3);
  assert.equal(s.iterations, 5);
  assert.equal(s.medianMs, 3);
  assert.equal(s.minMs, 1);
  assert.equal(s.maxMs, 100);
  assert.equal(s.avgMs, 22);
  const variance = [1, 2, 3, 4, 100].reduce((a, b) => a + (b - 22) ** 2, 0) / 5;
  assert.ok(Math.abs(s.stdDevMs - Math.sqrt(variance)) < 1e-9);
  assert.equal(s.mode, 'END_TO_END');
});

test('statsOf is deterministic and empty-safe', () => {
  const s = statsOf([], 'GPU_TIMESTAMP', 0, 3);
  assert.equal(s.iterations, 0);
  assert.equal(s.medianMs, 0);
  assert.ok(Number.isFinite(s.avgMs));
});

test('buildPerfReport preserves TASK 15 shape and strips NaN/Infinity', () => {
  const over: ReportInput = emptyInput({
    timingMode: 'END_TO_END',
    tests: {
      matmul: [makeSample({ medianMs: NaN, throughput: { value: Infinity, unit: 'GFLOPS' } })],
      vecadd: [makeSample({ id: 'vecadd-1000', medianMs: 0.1 })],
      conv2d: [],
      softmax: [],
      rmsnorm: [],
      attention: [makeSample({ id: 'attention-128', medianMs: 2 })],
      attentionPhases: { 'seq=128': [makeSample({ id: 'attention-qkt-128', medianMs: 1 })] },
    },
    memory: [{ id: 'memory-1-mib', requestedBytes: 1048576, requestedMiB: 1, created: true, success: true }],
    bufferReuse: {},
    pipelineCache: {},
    commandBatching: [
      { id: 'command-batch-batched', name: 'batched', dispatches: 8, timingMode: 'END_TO_END', totalMedianMs: 12, perDispatchMs: 1.5, samplesMs: [] },
    ],
    sustained: null,
  });
  const r = buildPerfReport(over);
  assert.equal(r.device.adapterName, 'Apple Test GPU');
  assert.equal(r.timingMode, 'END_TO_END');
  assert.equal(r.tests.matmul.length, 1);
  assert.equal(r.tests.matmul[0].medianMs, null); // NaN → null via JSON
  assert.equal(r.tests.matmul[0].throughput!.value, null); // Infinity → null
  assert.equal(r.tests.attentionPhases['seq=128'].length, 1);
  assert.equal(r.memory.length, 1);
  assert.equal(r.commandBatching[0].totalMedianMs, 12);
  assert.equal(r.browser.thermalState, 'UNAVAILABLE');
  assert.equal(r.build.id, 'test');
  // round-trips cleanly
  const json = JSON.stringify(r);
  assert.ok(json.includes('"webgpuAvailable":true'));
  JSON.parse(json);
});

test('thermal state and GPU utilization never fabricate values', () => {
  assert.equal(thermalStateValue(), 'UNAVAILABLE');
  assert.equal(gpuUtilizationValue(), 'UNAVAILABLE');
});

test('captureBrowserInfo works without WebGPU', () => {
  const info = captureBrowserInfo();
  assert.ok(typeof info.userAgent === 'string');
  assert.deepEqual(info.thermalState, 'UNAVAILABLE');
  assert.deepEqual(info.gpuUtilization, 'UNAVAILABLE');
});

test('interpretResults is data-driven and covers the expected cases', () => {
  const matmulBig = makeSample({ id: 'matmul-512', size: '512×512', medianMs: 1.8, throughput: { value: 150, unit: 'GFLOPS' } });
  const matmulSmall = makeSample({ id: 'matmul-128', size: '128×128', medianMs: 0.05, throughput: { value: 42, unit: 'GFLOPS' } });
  const vec = makeSample({ id: 'vecadd-1048576', size: '1,048,576 elements', medianMs: 1.1, throughput: { value: 11.4, unit: 'GB/s (estimate)' } });
  const attn128 = makeSample({ id: 'attention-128', size: 'seq=128 dim=64 batch=1', medianMs: 4.2 });
  const attn256 = makeSample({ id: 'attention-256', size: 'seq=256 dim=64 batch=1', medianMs: 20.0 });
  const r = buildPerfReport(
    emptyInput({
      tests: {
        matmul: [matmulSmall, matmulBig],
        vecadd: [vec],
        conv2d: [],
        softmax: [],
        rmsnorm: [],
        attention: [attn128, attn256],
        attentionPhases: {},
      },
      bufferReuse: {
        allocateDestroy: { id: 'a', name: 'allocate+destroy', size: '3 MiB', timingMode: 'END_TO_END', perOpMs: 1.0, totalMs: 30, iterations: 30, samplesMs: [] },
        bufferReuse: { id: 'r', name: 'reuse', size: '3 MiB', timingMode: 'END_TO_END', perOpMs: 0.2, totalMs: 6, iterations: 30, samplesMs: [] },
      },
    })
  );
  const lines = interpretResults(r);
  assert.ok(lines.some((l) => l.includes('150.0 GFLOPS')));
  assert.ok(lines.some((l) => l.includes('GB/s')));
  assert.ok(lines.some((l) => l.includes('O(seq')) || lines.some((l) => l.includes('seq')));
  assert.ok(lines.some((l) => l.includes('buffer reuse')));
  // No fabricated utilization claim anywhere.
  assert.ok(!lines.some((l) => l.includes('utilization')));
});

test('buildIphoneBaseline emits the exact TASK 18 export shape', () => {
  const s = makeSample({ id: 'matmul-256', size: '256×256', medianMs: 0.9, throughput: { value: 88, unit: 'GFLOPS' } });
  const r = buildPerfReport(emptyInput({ tests: { matmul: [s], vecadd: [], conv2d: [], softmax: [], rmsnorm: [], attention: [], attentionPhases: {} } }));
  const out = buildIphoneBaseline(r);
  assert.ok('device' in out && 'browser' in out && 'webgpu' in out);
  assert.ok('timingMode' in out && 'timestamp' in out && 'commit' in out && 'results' in out);
  const sample = out.results['matmul.256×256'];
  assert.ok(sample, 'measurement present under matmul.<config>');
  for (const key of ['test', 'configuration', 'iterations', 'warmup', 'minMs', 'maxMs', 'meanMs', 'medianMs', 'stdDevMs', 'timingMode']) {
    assert.ok(key in sample, `sample has ${key}`);
  }
  assert.equal(sample.throughput, '88.00 GFLOPS');
});