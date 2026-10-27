---
name: "🚨 Settlement or Reconciliation Discrepancy"
about: "Report an anomaly between internal pending/settled balances and external PSP statements"
title: "[RECONCILIATION] "
labels: ["reconciliation", "priority:critical", "fintech-invariants"]
---

## 1. Discrepancy Summary
Describe the observed state mismatch between internal payout records and external partner statements (please redact all live IBAN/PII data).

## 2. Invariant Context
- **Payout State Transition**: (e.g., `PROCESSING` -> `DLQ_QUARANTINED`)
- **Currency & Minor Units**: (e.g., `USD`, `integer cents`)
- **Banking Rail Corridor**: (e.g., `ACH` / `SEPA` / `RTP`)

## 3. Deterministic Reproduction Steps
1. Trigger payout with `Idempotency-Key`...
2. Simulate downstream gateway response...
3. Observe balance reservation state...
