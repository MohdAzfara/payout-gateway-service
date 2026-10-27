---
name: "🏛️ Banking Rail / PSP Integration Proposal"
about: "Propose a new outbound payout rail, clearing corridor, or failover provider"
title: "[RAIL-PROPOSAL] "
labels: ["enhancement", "payment-rail", "architecture"]
---

## 1. Target Settlement Corridor & Rail
Specify the proposed banking rail (e.g., FedNow, SEPA Instant, Faster Payments, SWIFT) and supported currencies.

## 2. Idempotency & Finality Guarantees
- Does the upstream PSP support native `Idempotency-Key` deduplication?
- How are asynchronous settlement webhooks signed (e.g., `HMAC-SHA256`, `mTLS`)?

## 3. Failure Modes & DLQ Mapping
Document expected HTTP timeout behaviors and deterministic rejection codes vs. retryable transient errors.
