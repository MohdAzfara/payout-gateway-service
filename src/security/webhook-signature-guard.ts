export interface WebhookEnvelope {
  readonly timestampSec: number;
  readonly rawBody: string;
  readonly providedSignatureHex: string;
}

/**
 * Replay-Safe Webhook Attestation Guard
 * Enforces strict timestamp tolerance windows and constant-time signature comparison.
 */
export class WebhookSignatureGuard {
  constructor(private readonly toleranceWindowSec = 300) {}

  public isWithinReplayWindow(eventTimestampSec: number, nowSec = Math.floor(Date.now() / 1000)): boolean {
    const drift = Math.abs(nowSec - eventTimestampSec);
    return drift <= this.toleranceWindowSec;
  }

  public constantTimeHexEquals(expectedHex: string, actualHex: string): boolean {
    if (expectedHex.length !== actualHex.length || expectedHex.length === 0) {
      return false;
    }
    let diff = 0;
    for (let i = 0; i < expectedHex.length; i++) {
      diff |= expectedHex.charCodeAt(i) ^ actualHex.charCodeAt(i);
    }
    return diff === 0;
  }
}
