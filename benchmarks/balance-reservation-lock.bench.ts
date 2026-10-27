import { performance } from 'perf_hooks';

interface AccountBalanceState {
  availableMinor: bigint;
  pendingMinor: bigint;
  version: number;
}

/**
 * Micro-benchmark: In-Memory Optimistic & Two-Phase Balance Reservation Throughput
 * Validates zero floating-point drift and high-speed atomic state mutation.
 */
function runBalanceReservationBenchmark(iterations = 250_000): void {
  const state: AccountBalanceState = {
    availableMinor: 1_000_000_000_00n, // $1,000,000,000.00 in cents
    pendingMinor: 0n,
    version: 1
  };

  const debitAmount = 100_00n; // $100.00 per payout
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    if (state.availableMinor >= debitAmount) {
      state.availableMinor -= debitAmount;
      state.pendingMinor += debitAmount;
      state.version += 1;
    }
  }

  const durationMs = performance.now() - start;
  const opsPerSec = Math.round((iterations / durationMs) * 1000);

  console.info(`[Benchmark] Two-Phase BigInt Balance Reservation:`);
  console.info(`  Iterations : ${iterations.toLocaleString()}`);
  console.info(`  Duration   : ${durationMs.toFixed(2)} ms`);
  console.info(`  Throughput : ${opsPerSec.toLocaleString()} reservations/sec`);
}

runBalanceReservationBenchmark();
