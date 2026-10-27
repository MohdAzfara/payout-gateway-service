/**
 * Deterministic Error Taxonomy for Outbound Payout Orchestration
 * Separates terminal business rejections from retryable transient banking faults.
 */
export enum PayoutErrorCode {
  INSUFFICIENT_AVAILABLE_BALANCE = 'ERR_PAYOUT_INSUFFICIENT_AVAILABLE_BALANCE',
  IDEMPOTENCY_KEY_PAYLOAD_MISMATCH = 'ERR_PAYOUT_IDEMPOTENCY_KEY_PAYLOAD_MISMATCH',
  RECIPIENT_ACCOUNT_UNVERIFIED = 'ERR_PAYOUT_RECIPIENT_ACCOUNT_UNVERIFIED',
  UNSUPPORTED_SETTLEMENT_CURRENCY = 'ERR_PAYOUT_UNSUPPORTED_SETTLEMENT_CURRENCY',
  UPSTREAM_PSP_TRANSIENT_TIMEOUT = 'ERR_PAYOUT_UPSTREAM_PSP_TRANSIENT_TIMEOUT',
  DLQ_QUARANTINE_THRESHOLD_EXCEEDED = 'ERR_PAYOUT_DLQ_QUARANTINE_THRESHOLD_EXCEEDED',
  WEBHOOK_SIGNATURE_ATTESTATION_FAILED = 'ERR_PAYOUT_WEBHOOK_SIGNATURE_ATTESTATION_FAILED'
}

export class PayoutDomainError extends Error {
  public readonly code: PayoutErrorCode;
  public readonly retryable: boolean;
  public readonly timestampIso: string;

  constructor(code: PayoutErrorCode, message: string, retryable = false) {
    super(message);
    this.name = 'PayoutDomainError';
    this.code = code;
    this.retryable = retryable;
    this.timestampIso = new Date().toISOString();
    Object.setPrototypeOf(this, PayoutDomainError.prototype);
  }
}
