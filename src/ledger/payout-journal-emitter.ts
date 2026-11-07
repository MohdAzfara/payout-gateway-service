export interface PayoutJournalLine {
  readonly accountId: string;
  readonly direction: 'DEBIT' | 'CREDIT';
  readonly amountMinor: bigint;
  readonly currency: string;
}

/**
 * Double-Entry Payout Settlement Journal Emitter (ADR 0006)
 * Emits balanced zero-sum debit/credit lines to double-entry-ledger-core.
 */
export class PayoutJournalEmitter {
  public buildSettlementJournalLines(params: {
    vendorPendingAccountId: string;
    bankSettlementClearingAccountId: string;
    amountMinor: bigint;
    currency: string;
  }): readonly PayoutJournalLine[] {
    if (params.amountMinor <= 0n) {
      throw new Error('Settlement journal amount must be a positive BigInt minor unit.');
    }

    const normCurrency = params.currency.trim().toUpperCase();
    return [
      {
        accountId: params.vendorPendingAccountId,
        direction: 'DEBIT',
        amountMinor: params.amountMinor,
        currency: normCurrency
      },
      {
        accountId: params.bankSettlementClearingAccountId,
        direction: 'CREDIT',
        amountMinor: params.amountMinor,
        currency: normCurrency
      }
    ];
  }
}
