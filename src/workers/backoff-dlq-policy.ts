export interface RetryEvaluationResult {
  readonly action: 'RETRY_WITH_BACKOFF' | 'QUARANTINE_TO_DLQ' | 'FAIL_IMMEDIATELY';
  readonly nextDelayMs: number;
  readonly reason: string;
}

/**
 * Deterministic Retry & Dead-Letter Queue (DLQ) Escalation Policy
 * Implements AWS-style Full-Jitter exponential backoff for asynchronous payout workers.
 */
export class BackoffDlqPolicy {
  constructor(
    private readonly maxRetries = 5,
    private readonly baseDelayMs = 250,
    private readonly maxCapDelayMs = 30_000
  ) {}

  public evaluateAttempt(
    attemptNumber: number,
    isRetryableError: boolean,
    deterministicSeed?: number
  ): RetryEvaluationResult {
    if (!isRetryableError) {
      return {
        action: 'FAIL_IMMEDIATELY',
        nextDelayMs: 0,
        reason: 'Terminal validation or upstream bank rejection; skipping retry queue.'
      };
    }

    if (attemptNumber >= this.maxRetries) {
      return {
        action: 'QUARANTINE_TO_DLQ',
        nextDelayMs: 0,
        reason: `Exceeded maximum retry threshold (${this.maxRetries}); isolating in DLQ for reconciliation.`
      };
    }

    const exponentialCap = Math.min(
      this.maxCapDelayMs,
      this.baseDelayMs * Math.pow(2, Math.max(0, attemptNumber))
    );
    const randomFactor =
      deterministicSeed !== undefined
        ? Math.max(0, Math.min(1, deterministicSeed))
        : Math.random();

    return {
      action: 'RETRY_WITH_BACKOFF',
      nextDelayMs: Math.floor(randomFactor * exponentialCap),
      reason: `Transient banking gateway fault on attempt ${attemptNumber + 1}/${this.maxRetries}.`
    };
  }
}
