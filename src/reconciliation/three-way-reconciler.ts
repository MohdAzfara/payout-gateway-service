export interface InternalPayoutRecord {
  readonly payoutId: string;
  readonly idempotencyKey: string;
  readonly amountMinor: bigint;
  readonly currency: string;
  readonly internalState: 'PENDING' | 'PROCESSING' | 'SETTLED' | 'FAILED';
}

export interface ExternalBankStatementEntry {
  readonly endToEndId: string;
  readonly settledAmountMinor: bigint;
  readonly currency: string;
  readonly bankStatus: 'BOOKED' | 'REJECTED';
}

export interface ReconciliationFinding {
  readonly payoutId: string;
  readonly status: 'MATCHED' | 'AMOUNT_MISMATCH' | 'STATE_MISMATCH' | 'MISSING_EXTERNAL_ENTRY';
  readonly deltaMinor: bigint;
}

/**
 * Automated Three-Way Settlement Reconciliation Engine
 * Verifies exact parity between internal payout states and external bank settlement files.
 */
export class ThreeWayReconciler {
  public reconcileBatch(
    internalRecords: readonly InternalPayoutRecord[],
    externalEntries: readonly ExternalBankStatementEntry[]
  ): ReconciliationFinding[] {
    const externalByKey = new Map<string, ExternalBankStatementEntry>();
    for (const entry of externalEntries) {
      externalByKey.set(entry.endToEndId, entry);
    }

    return internalRecords.map((record): ReconciliationFinding => {
      const external = externalByKey.get(record.idempotencyKey);

      if (!external) {
        return {
          payoutId: record.payoutId,
          status: 'MISSING_EXTERNAL_ENTRY',
          deltaMinor: record.amountMinor
        };
      }

      const delta = record.amountMinor - external.settledAmountMinor;
      if (delta !== 0n || record.currency !== external.currency) {
        return {
          payoutId: record.payoutId,
          status: 'AMOUNT_MISMATCH',
          deltaMinor: delta
        };
      }

      const expectedInternalState = external.bankStatus === 'BOOKED' ? 'SETTLED' : 'FAILED';
      if (record.internalState !== expectedInternalState) {
        return {
          payoutId: record.payoutId,
          status: 'STATE_MISMATCH',
          deltaMinor: 0n
        };
      }

      return {
        payoutId: record.payoutId,
        status: 'MATCHED',
        deltaMinor: 0n
      };
    });
  }
}
