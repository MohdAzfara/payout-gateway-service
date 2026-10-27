# Operational Runbook: Dead-Letter Queue (DLQ) Payout Quarantine & Recovery

## 1. Incident Trigger Conditions

A payout job is quarantined into the Dead-Letter Queue (`DLQ_QUARANTINED`) when:
1. Downstream banking PSP returns `HTTP 504 Gateway Timeout` or connection reset after maximum exponential backoff retries.
2. Webhook settlement signature verification fails (`HMAC-SHA256` mismatch).
3. Three-way reconciliation detects a state mismatch between internal `pending` balance and external bank EOD statement.

## 2. Golden Rule of Payout Recovery

> **NEVER** manually reverse a `DLQ_QUARANTINED` payout back to `available_balance` without first querying the external banking partner's settlement status by `Idempotency-Key`.

## 3. Standard Operating Procedure (SOP)

1. **Step 1 — Inspect Quarantine Payload**: Verify the deterministic `idempotencyKey`, `recipientId`, and `amountMinor` in the DLQ audit record.
2. **Step 2 — Execute Upstream Settlement Query**: Query the partner PSP status endpoint using the original `idempotencyKey`.
3. **Step 3 — Resolution Branching**:
   * **Case A (PSP confirms `SETTLED`)**: Transition internal payout state to `SETTLED` and finalize the `pending` balance debit.
   * **Case B (PSP confirms `NOT_FOUND` or `REJECTED`)**: Transition internal state to `FAILED` and execute an atomic compensating credit back to `available_balance`.
