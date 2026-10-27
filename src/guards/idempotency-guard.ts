export interface IdempotencyRecord<TResult = unknown> {
  readonly idempotencyKey: string;
  readonly payloadFingerprint: string;
  readonly status: 'IN_FLIGHT' | 'COMPLETED' | 'FAILED';
  readonly createdAtMs: number;
  readonly responseSnapshot?: TResult;
}

/**
 * Deterministic Idempotency Key Validator & Conflict Guard
 * Ensures state-mutating payout requests never execute twice under network retries.
 */
export class IdempotencyGuard {
  private readonly store = new Map<string, IdempotencyRecord>();

  public assertValidKeyFormat(key: string): void {
    const trimmed = key.trim();
    if (trimmed.length < 16 || trimmed.length > 128) {
      throw new Error('Invalid Idempotency-Key: length must be between 16 and 128 characters.');
    }
  }

  public registerOrVerify(
    idempotencyKey: string,
    payloadFingerprint: string,
    nowMs = Date.now()
  ): { isDuplicate: boolean; record: IdempotencyRecord } {
    this.assertValidKeyFormat(idempotencyKey);
    const existing = this.store.get(idempotencyKey);

    if (existing) {
      if (existing.payloadFingerprint !== payloadFingerprint) {
        throw new Error(
          `Idempotency conflict: key "${idempotencyKey}" reused with mutated payout parameters.`
        );
      }
      return { isDuplicate: true, record: existing };
    }

    const created: IdempotencyRecord = {
      idempotencyKey,
      payloadFingerprint,
      status: 'IN_FLIGHT',
      createdAtMs: nowMs
    };
    this.store.set(idempotencyKey, created);
    return { isDuplicate: false, record: created };
  }
}
