# ADR 0002: Idempotent Asynchronous Payout Workers and Dead-Letter Isolation

* **Status**: Accepted
* **Date**: 2026-10-27
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

External banking rails (ACH, SEPA, SWIFT, Instant RTP) exhibit high latency variance and intermittent network timeouts. Synchronous HTTP payout execution ties up worker threads and risks duplicate fund transfers if a network timeout occurs after the bank has already accepted the instruction.

## Decision

All outbound vendor payouts are decoupled via an **Asynchronous Event-Driven Worker Pipeline**:

1. **Deterministic Idempotency Propagation**: The client-supplied `Idempotency-Key` is deterministically hashed and forwarded to the downstream banking PSP, ensuring that retry attempts never trigger duplicate wire transfers.
2. **Full-Jitter Exponential Backoff**: Transient 5xx errors or network timeouts trigger retries using AWS-style Full Jitter backoff to prevent thundering-herd overload on banking gateways.
3. **Dead-Letter Queue (DLQ) Quarantine**: Payouts exceeding maximum retry thresholds or returning ambiguous settlement states are quarantined in a DLQ and flagged for automated reconciliation before any balance reversal is permitted.

## Consequences

* **Positive**: Guarantees resilient throughput during banking partner brownouts and prevents premature balance rollbacks on ambiguous timeouts.
* **Negative**: Requires continuous reconciliation workers to resolve quarantined DLQ transactions.
