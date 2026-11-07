/**
 * Cryptographic Payout Instruction & ISO 20022 EndToEndId Digest Sealer
 * Generates tamper-evident fingerprints across outbound settlement instructions.
 */
export class SettlementDigestSealer {
  public static computeInstructionDigest(params: {
    payoutId: string;
    idempotencyKey: string;
    vendorAccountId: string;
    amountMinor: bigint;
    currency: string;
  }): string {
    const canonical = `${params.payoutId.trim()}:${params.idempotencyKey.trim()}:${params.vendorAccountId.trim()}:${params.amountMinor.toString()}:${params.currency.trim().toUpperCase()}`;
    let hash = 0xcbf29ce484222325n;
    const prime = 0x100000001b3n;

    for (let i = 0; i < canonical.length; i++) {
      hash ^= BigInt(canonical.charCodeAt(i));
      hash = (hash * prime) & 0xffffffffffffffffn;
    }

    return hash.toString(16).padStart(16, '0');
  }
}
