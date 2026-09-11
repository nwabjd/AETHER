// Static ordering / resource-lifetime model for the memory-scout
// (benchMemoryBudget) vs the transformer suite. GPU-free, test-only.
//
// Every op is attributed to the exact production line it models. The harness
// does NOT claim anything about Safari/WebKit runtime behavior: it only pins
// ownership semantics that are provable from OUR source across the six
// candidate orderings (A-F) requested in the isolation experiment.

export type ScoutOpKind =
  | 'GUARD'               // guardTransformerBlock evaluated before any block allocation (perf-v3-llm.ts:471)
  | 'BLOCK_ALLOC'         // one transformer block's tracked GPUBuffer set created (perf-v3-llm.ts:501-544)
  | 'BLOCK_DESTROY'       // tracked.release() in finally — destroys every block buffer (perf-v3-llm.ts:613)
  | 'BLOCK_AWAIT'         // await adaptiveMeasure → measureBlock → CompletionToken → awaitCompletion (perf-v3-llm.ts:565, perf-v3.ts:75-90)
  | 'CHECKPOINT'          // checkpointCategory(...) → persistCheckpoint() (perf-v3-llm.ts:481/603; ::771/779/824; crash-safety.ts:435-443)
  | 'MILESTONE'           // recordMilestone(...) (perf-v3-llm.ts:468+; crash-safety.ts:472+)
  | 'SCOUT_ALLOC'         // d.createBuffer per chunk (perf-v3-llm.ts:704) + trackBuffer (::710)
  | 'SCOUT_WRITE'         // synchronous-enqueue queue.writeBuffer loop, never awaited (perf-v3-llm.ts:715-717)
  | 'SCOUT_DESTROY'       // for (const b of bufs) b.destroy() — end of each rung (perf-v3-llm.ts:735)
  | 'SCOUT_RETURN'        // benchMemoryBudget returns (perf-v3-llm.ts:738)
  | 'RELEASE_TRACKED'     // releaseTrackedBuffers() — synchronous destroy+clear (perf-v3-llm.ts:899; crash-safety.ts:301-310)
  | 'CLEANUP_BOUNDARY'    // named explicit cleanup boundary (real only in B/C = staged s4→s5)
  | 'MICROTASK_BOUNDARY'  // hypothetical await Promise.resolve() insertion (E — NOT in current source)
  | 'MACROTASK_BOUNDARY'  // hypothetical await setTimeout(0) insertion (F — NOT in current source)

export interface ScoutOp {
  kind: ScoutOpKind;
  label: string;
  source: string;
  count?: number;  // BLOCK_ALLOC=25, BLOCK_AWAIT=24, SCOUT_ALLOC/SCOUT_DESTROY = chunk count
}

export type SequenceId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export const SCOUT_SMALL_TARGETS = [128, 256];
export const SCOUT_CHUNK_MB = 64;
export const SCOUT_CHUNK_BYTES = 64 * 1024 * 1024;
export const TRANSFORMER_BLOCK_BUFFERS = 25;
export const TRANSFORMER_BLOCK_AWAITS = 24;

const CHUNKS: Record<number, number> = { 128: 2, 256: 4 };

function scoutAllocs(targets: number[], src: string): ScoutOp[] {
  const ops: ScoutOp[] = [];
  for (const t of targets) {
    const n = CHUNKS[t];
    for (let i = 0; i < n; i++) {
      ops.push({ kind: 'SCOUT_ALLOC', label: `chunk ${i + 1}/${n} of ${t}MB rung (64 MiB)`, source: `${src}:704`, count: 1 });
    }
    ops.push({ kind: 'SCOUT_WRITE', label: `enqueue-${t / SCOUT_CHUNK_MB}MiB writeBuffer, no sync`, source: `${src}:715-717`, count: n });
    ops.push({ kind: 'SCOUT_DESTROY', label: `destroy ${t}MB rung (${n} chunks)`, source: `${src}:735`, count: n });
  }
  ops.push({ kind: 'SCOUT_RETURN', label: 'benchMemoryBudget returns data-only records', source: `${src}:738` });
  return ops;
}

function blockAlloc(name: string, src: string): ScoutOp[] {
  return [
    { kind: 'GUARD', label: `guard(${name})`, source: `${src}:471` },
    { kind: 'BLOCK_ALLOC', label: `${name}: 25 tracked GPUBuffers`, source: `${src}:501-544`, count: TRANSFORMER_BLOCK_BUFFERS },
    { kind: 'BLOCK_AWAIT', label: `${name}: 24 CompletionToken awaits`, source: `${src}:565 / perf-v3.ts:100-125`, count: TRANSFORMER_BLOCK_AWAITS },
    { kind: 'CHECKPOINT', label: `${name}: per-block checkpoint`, source: `${src}:603` },
    { kind: 'MILESTONE', label: `${name}: CHECKPOINTED/COMPLETE milestones`, source: `${src}:608-609` },
    { kind: 'BLOCK_DESTROY', label: `${name}: tracked.release() (finally)`, source: `${src}:613`, count: TRANSFORMER_BLOCK_BUFFERS },
  ];
}

function realBlockSuite(src: string): ScoutOp[] {
  return [...blockAlloc('0.5B', src), ...blockAlloc('1B', src)];
}

export interface BuiltSequence {
  id: SequenceId;
  real: boolean;
  source: string;
  ops: ScoutOp[];
}

export function buildSequence(id: SequenceId): BuiltSequence {
  switch (id) {
    case 'A': // REAL: FULL/Quick gate — transformer suite first, ladder after (perf-v3-llm.ts:768-771 then :776-778)
      return {
        id, real: true,
        source: 'runLLMInferenceGate/Quick: transformerBlocks (768-771 / 813-816) followed by memoryBudget (776-778 / 823)',
        ops: [...realBlockSuite('perf-v3-llm.ts'), ...scoutAllocs(SCOUT_SMALL_TARGETS, 'perf-v3-llm.ts')],
      };
    case 'B': // REAL: staged s4→s5 — ladder first, transformer after (perf-v3-llm.ts:891-899 then :901-909); boundary implicit
      return {
        id, real: true,
        source: 'runLLMDiagnosticStaged: s4 benchMemoryBudget(\'small\') (893) → releaseTrackedBuffers() (899) → s5 benchSyntheticTransformerBlock(\'small\') (903)',
        ops: [...scoutAllocs(SCOUT_SMALL_TARGETS, 'perf-v3-llm.ts'), { kind: 'RELEASE_TRACKED', label: 'releaseTrackedBuffers() destroy+clear', source: 'perf-v3-llm.ts:899 / crash-safety.ts:301-310' }, ...realBlockSuite('perf-v3-llm.ts')],
      };
    case 'C': // REAL: same staged s4→s5, cleanup boundary made explicit
      return {
        id, real: true,
        source: 'same as B; releaseTrackedBuffers() named as the explicit cleanup boundary between scout return and transformer',
        ops: [...scoutAllocs(SCOUT_SMALL_TARGETS, 'perf-v3-llm.ts'), { kind: 'RELEASE_TRACKED', label: 'EXPLICIT CLEANUP BOUNDARY — releaseTrackedBuffers()', source: 'perf-v3-llm.ts:899' }, { kind: 'CLEANUP_BOUNDARY', label: 'boundary', source: 'perf-v3-llm.ts:899' }, ...realBlockSuite('perf-v3-llm.ts')],
      };
    case 'D': // HYPOTHETICAL: transformer → explicit cleanup → ladder (NOT a current source order)
      return {
        id, real: false,
        source: 'hypothetical comparison only — current FULL gate has no release between transformer and ladder; cleanup only at completeBenchmark',
        ops: [...realBlockSuite('(hypothetical)'), { kind: 'RELEASE_TRACKED', label: 'hypothetical cleanup boundary', source: '(hypothetical)' }, { kind: 'CLEANUP_BOUNDARY', label: 'boundary', source: '(hypothetical)' }, ...scoutAllocs(SCOUT_SMALL_TARGETS, '(hypothetical)')],
      };
    case 'E': // HYPOTHETICAL: ladder → cleanup → microtask → transformer
      return {
        id, real: false,
        source: 'hypothetical: inserts await Promise.resolve() between cleanup and transformer to test ownership invariance',
        ops: [...scoutAllocs(SCOUT_SMALL_TARGETS, '(hypothetical)'), { kind: 'RELEASE_TRACKED', label: 'cleanup boundary', source: '(hypothetical)' }, { kind: 'MICROTASK_BOUNDARY', label: 'await Promise.resolve()', source: '(hypothetical)' }, ...realBlockSuite('(hypothetical)')],
      };
    case 'F': // HYPOTHETICAL: ladder → cleanup → macrotask → transformer
      return {
        id, real: false,
        source: 'hypothetical: inserts await setTimeout(0) between cleanup and transformer to test ownership invariance',
        ops: [...scoutAllocs(SCOUT_SMALL_TARGETS, '(hypothetical)'), { kind: 'RELEASE_TRACKED', label: 'cleanup boundary', source: '(hypothetical)' }, { kind: 'MACROTASK_BOUNDARY', label: 'await setTimeout(0)', source: '(hypothetical)' }, ...realBlockSuite('(hypothetical)')],
      };
  }
}

export interface SimMetrics {
  peakLiveScoutBytes: number;
  peakLiveBlockBytes: number;
  peakSimultaneousScoutAndBlockBytes: number; // max(overlap of live scout + live block)
  overlapOps: number;                          // ops where scout>0 && block>0 at once
  liveScoutAtTransformerStart: number;         // undestroyed scout chunks at first BLOCK_ALLOC
  liveBlockAtTransformerStart: number;
  awaitOpsBetweenScoutReturnAndFirstBlock: number;
  guardBeforeEveryBlock: boolean;
}

export interface SimResult {
  metrics: SimMetrics;
  ops: ScoutOp[];
}

export const BLOCK0_BYTES = 12_625_924;   // 0.5B deviceCommit (weights+acts), matched to estimateTransformerBlockMemory
export const BLOCK1_BYTES = 28_376_068;   // 1B deviceCommit
export const RUNG_BYTES: Record<number, number> = { 128: 128 * 1024 * 1024, 256: 256 * 1024 * 1024 };

export function simulateSequence(seq: BuiltSequence): SimResult {
  let liveScoutChunks = 0;
  let liveBlockBuffers = 0;
  let peakScout = 0, peakBlock = 0, peakBoth = 0;
  let overlapOps = 0;
  let firstBlockAt = -1;
  let liveScoutAtFirstBlock: number | null = null;
  let liveBlockAtFirstBlock = 0;
  let guardEveryBlock = true;
  let blockIndex = -1;
  let scoutReturnIndex = -1;

  const ops = seq.ops.map(o => ({ ...o }));
  for (let i = 0; i < ops.length; i++) {
    const o = ops[i];
    switch (o.kind) {
      case 'GUARD':
        break;
      case 'BLOCK_ALLOC':
        blockIndex++;
        guardEveryBlock = guardEveryBlock && i > 0 && ops[i - 1].kind === 'GUARD';
        liveBlockBuffers += o.count ?? TRANSFORMER_BLOCK_BUFFERS;
        if (liveBlockBuffers > peakBlock) peakBlock = liveBlockBuffers;
        if (firstBlockAt < 0) {
          firstBlockAt = i;
          liveScoutAtFirstBlock = liveScoutChunks;
          liveBlockAtFirstBlock = liveBlockBuffers;
        }
        break;
      case 'BLOCK_DESTROY':
        liveBlockBuffers = Math.max(0, liveBlockBuffers - (o.count ?? TRANSFORMER_BLOCK_BUFFERS));
        break;
      case 'BLOCK_AWAIT':
        break;
      case 'SCOUT_ALLOC':
        liveScoutChunks += o.count ?? 1;
        if (liveScoutChunks > peakScout) peakScout = liveScoutChunks;
        break;
      case 'SCOUT_DESTROY':
        liveScoutChunks = Math.max(0, liveScoutChunks - (o.count ?? 1));
        break;
      case 'SCOUT_RETURN':
        scoutReturnIndex = i;
        break;
      case 'RELEASE_TRACKED':
        // GPU memory already freed by SCOUT_DESTROY; registry clear only.
        break;
      case 'CLEANUP_BOUNDARY':
      case 'MICROTASK_BOUNDARY':
      case 'MACROTASK_BOUNDARY':
        break;
      case 'CHECKPOINT':
      case 'MILESTONE':
      case 'SCOUT_WRITE':
        break;
    }
    if (liveScoutChunks > 0 && liveBlockBuffers > 0) overlapOps++;
    const both = (liveScoutChunks > 0 ? peakScoutBytesAt(liveScoutChunks) : 0) + blockLiveBytes(blockIndex, liveBlockBuffers);
    if (both > peakBoth) peakBoth = both;
  }

  const awaitOpsBetween = firstBlockAt >= 0 && scoutReturnIndex >= 0
    ? ops.slice(scoutReturnIndex + 1, firstBlockAt).reduce((a, o) => a + (o.kind === 'BLOCK_AWAIT' ? (o.count ?? 1) : 0), 0)
    : 0;

  const metrics: SimMetrics = {
    peakLiveScoutBytes: peakScoutBytesAt(peakScout),
    peakLiveBlockBytes: peakBlock * (BLOCK1_BYTES / TRANSFORMER_BLOCK_BUFFERS),
    peakSimultaneousScoutAndBlockBytes: peakBoth,
    overlapOps,
    liveScoutAtTransformerStart: liveScoutAtFirstBlock ?? 0,
    liveBlockAtTransformerStart: liveBlockAtFirstBlock,
    awaitOpsBetweenScoutReturnAndFirstBlock: awaitOpsBetween,
    guardBeforeEveryBlock: guardEveryBlock,
  };
  return { metrics, ops };
}

function peakScoutBytesAt(chunks: number): number {
  // Peak scout bytes model the largest rung currently alive: 64 MiB per chunk.
  return chunks * SCOUT_CHUNK_BYTES;
}

function blockLiveBytes(blockIndex: number, count: number): number {
  const per = blockIndex === 0 ? BLOCK0_BYTES : BLOCK1_BYTES;
  return Math.min(count, TRANSFORMER_BLOCK_BUFFERS) * (per / TRANSFORMER_BLOCK_BUFFERS);
}

export const ALL_SEQUENCES: SequenceId[] = ['A', 'B', 'C', 'D', 'E', 'F'];

export function buildAndSimulateAll(): Record<SequenceId, { built: BuiltSequence; result: SimResult }> {
  const out = {} as Record<SequenceId, { built: BuiltSequence; result: SimResult }>;
  for (const id of ALL_SEQUENCES) {
    const built = buildSequence(id);
    out[id] = { built, result: simulateSequence(built) };
  }
  return out;
}