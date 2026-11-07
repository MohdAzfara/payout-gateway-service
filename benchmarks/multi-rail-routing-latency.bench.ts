/**
 * Micro-benchmark: Deterministic Multi-Rail Payout Corridor Selection
 */
function selectPayoutCorridorFast(
  currency: 'USD' | 'EUR',
  amountMinor: bigint,
  primaryHealthy: boolean
): string {
  if (currency === 'EUR') {
    return primaryHealthy ? 'SEPA_CREDIT' : 'SWIFT_WIRE';
  }
  if (amountMinor <= 10_000_000n && primaryHealthy) {
    return 'INSTANT_RTP';
  }
  return 'ACH_SAME_DAY';
}

function runRoutingBenchmark(iterations = 500_000): void {
  const startMs = Date.now();
  let rtpCount = 0;

  for (let i = 0; i < iterations; i++) {
    const rail = selectPayoutCorridorFast(
      i % 2 === 0 ? 'USD' : 'EUR',
      BigInt((i % 500) * 10_000),
      i % 10 !== 0
    );
    if (rail === 'INSTANT_RTP') {
      rtpCount += 1;
    }
  }

  const durationMs = Math.max(1, Date.now() - startMs);
  const opsPerSec = Math.round((iterations / durationMs) * 1000);

  console.info(`[Benchmark] Multi-Rail Payout Corridor Evaluation:`);
  console.info(`  Iterations : ${iterations.toLocaleString()} (RTP Selected: ${rtpCount.toLocaleString()})`);
  console.info(`  Duration   : ${durationMs} ms`);
  console.info(`  Throughput : ${opsPerSec.toLocaleString()} routes/sec`);
}

runRoutingBenchmark();
