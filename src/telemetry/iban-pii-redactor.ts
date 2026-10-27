/**
 * Zero-Trust Telemetry Redactor for Banking Identifiers (IBAN, Routing, Account Numbers)
 * Ensures raw financial credentials never leak into structured application logs.
 */
export class BankingPiiRedactor {
  private static readonly SENSITIVE_KEYS = new Set([
    'accountnumber',
    'iban',
    'routingnumber',
    'swiftbic',
    'taxid',
    'secretkey'
  ]);

  public static maskAccountIdentifier(rawIdentifier: string): string {
    const cleaned = rawIdentifier.replace(/\s+/g, '');
    if (cleaned.length <= 4) {
      return '****';
    }
    const visibleTail = cleaned.slice(-4);
    return `****-REDACTED-${visibleTail}`;
  }

  public static scrubRecord(payload: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(payload)) {
      const normalizedKey = key.toLowerCase().replace(/[_-]/g, '');

      if (this.SENSITIVE_KEYS.has(normalizedKey) && typeof value === 'string') {
        sanitized[key] = this.maskAccountIdentifier(value);
      } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = this.scrubRecord(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}
