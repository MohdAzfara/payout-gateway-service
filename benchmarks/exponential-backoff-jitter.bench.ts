import { performance } from 'perf_hooks';

/**
 * Micro-benchmark: AWS-Style Full-Jitter Exponential Backoff Calculation
 * Formula: sleep = random_between(0, min(capMs, baseMs * 2 ^ attempt))
 */
function computeFullJitterBackoffMs(attempt: number, baseMs = 100, capMs = 30_000): number {
  const exponentialDelay = Math.min(capMs, baseMs * Math.pow(2, attempt));
  return Math.floor(Math.random() * exponentialDelay);
}

function runBackoffBenchmark(iterations = 500_000): void {
  const start = performance.now();
  let accumulator = 0;

  for (let i = 0; i < iterations; i++) {
    accumulator += computeFullJitterBackoffMs(i % 8);
  }

  const durationMs = performance.now() - start;
  const opsPerSec = Math.round((iterations / durationMs) * 1000);

  console.info(`[Benchmark] Full-Jitter Exponential Backoff Computation:`);
  console.info(`  Iterations : ${iterations.toLocaleString()} (Checksum: ${accumulator > 0})`);
  console.info(`  Duration   : ${durationMs.toFixed(2)} ms`);
  console.info(`  Throughput : ${opsPerSec.toLocaleString()} calculations/sec`);
}

runBackoffBenchmark();
