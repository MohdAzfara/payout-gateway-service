export interface VendorBalanceWallet {
  readonly vendorAccountId: string;
  readonly availableMinor: bigint;
  readonly pendingPayoutMinor: bigint;
  readonly lockVersion: number;
}

/**
 * Two-Phase ACID Balance Reservation Lock (ADR 0001)
 * Atomically transitions funds from available to pending prior to external bank dispatch.
 */
export class PessimisticBalanceLock {
  public static reserveForPayout(
    wallet: VendorBalanceWallet,
    payoutAmountMinor: bigint
  ): VendorBalanceWallet {
    if (payoutAmountMinor <= 0n) {
      throw new Error('Payout reservation amount must be a positive BigInt minor unit.');
    }

    if (wallet.availableMinor < payoutAmountMinor) {
      throw new Error(
        `Insufficient available vendor balance on "${wallet.vendorAccountId}": available ${wallet.availableMinor.toString()} < requested ${payoutAmountMinor.toString()}.`
      );
    }

    return {
      vendorAccountId: wallet.vendorAccountId,
      availableMinor: wallet.availableMinor - payoutAmountMinor,
      pendingPayoutMinor: wallet.pendingPayoutMinor + payoutAmountMinor,
      lockVersion: wallet.lockVersion + 1
    };
  }
}
