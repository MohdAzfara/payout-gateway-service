## Summary of Changes

Please provide a concise architectural summary of the changes introduced in this Pull Request.

## Fintech & Settlement Compliance Checklist

- [ ] **Idempotency Guaranteed**: All state-mutating payout or balance operations enforce strict `Idempotency-Key` validation.
- [ ] **Balance Conservation**: Available and pending balance deductions maintain strict ACID consistency with zero floating-point arithmetic.
- [ ] **Zero PII/IBAN Leakage**: Sensitive vendor bank account details and routing numbers are scrubbed from logs and telemetry.
- [ ] **Static Verification**: `npx tsc --noEmit` passes with zero compilation or type errors.
