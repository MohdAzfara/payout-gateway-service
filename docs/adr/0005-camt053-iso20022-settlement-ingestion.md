# ADR 0005: ISO 20022 CAMT.053 End-of-Day Bank Statement Ingestion

* **Status**: Accepted
* **Date**: 2026-11-03
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

Asynchronous webhook callbacks from partner banks can be dropped during network partitions. Relying solely on real-time webhooks leaves in-flight vendor payouts stuck in `PROCESSING` or `DLQ_QUARANTINED` states.

## Decision

We enforce deterministic ingestion of **ISO 20022 `camt.053` (Bank-to-Customer Statement)** end-of-day clearing files:

1. **Deterministic EndToEndId Matching**: Every settled bank entry is matched against internal payout records using the canonical `Idempotency-Key` mapped to ISO 20022 `EndToEndIdentification`.
2. **Automated Ledger Finalization**: Matched entries trigger a final settlement journal batch in `double-entry-ledger-core`, clearing the reserved `pending` balance.

## Consequences

* **Positive**: Guarantees 100% eventual settlement finality even if real-time PSP webhooks fail completely.
* **Negative**: Requires idempotent statement parsing so duplicate EOD file uploads do not double-debit `pending` balances.
