# Payout Gateway Service

[![Payout CI Pipeline](https://img.shields.io/badge/Payout_CI_Pipeline-passing-brightgreen.svg)](https://github.com/MohdAzfara/payout-gateway-service/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1.0-6ba539.svg)](docs/api/payout-gateway-openapi.yaml)
[![SemVer](https://img.shields.io/badge/SemVer-1.0.0-green.svg)](https://semver.org/)

A high-throughput, enterprise-grade TypeScript microservice engineered for asynchronous vendor payouts, two-phase balance reservation, multi-rail failover routing, and automated three-way settlement reconciliation.

---

## 🗺️ Payout Execution & Reconciliation Flow

```text
[ Connected Merchant / Platform Payout Trigger ]
                       │
                       ▼
[ Idempotency & Eligibility Guard ] ──(Duplicate & KYC Verification)
                       │
                       ▼
[ Two-Phase Balance Reservation ] ────(ACID Lock: Available ──► Pending Balance)
                       │
                       ▼
[ Multi-Rail Payout Router ] ─────────(Instant RTP / SEPA / Same-Day ACH / SWIFT)
                       │
                       ▼
[ Asynchronous Payout Worker Queue ] ─(Full-Jitter Exponential Backoff)
                       │
          ┌────────────┴────────────────────┐
          ▼ (2xx Settled)                   ▼ (Timeout / 5xx Error)
[ Double-Entry Ledger Debit Seal ]   [ Dead-Letter Queue (DLQ) & 3-Way Reconciliation ]
```

---

## 🏛️ Architectural Overview & Ecosystem Integration

Serving as the outbound vendor disbursement engine coupled with [`checkout-flow-sdk`](https://github.com/MohdAzfara/checkout-flow-sdk) (Inbound Capture), [`double-entry-ledger-core`](https://github.com/MohdAzfara/double-entry-ledger-core) (Immutable Accounting), and [`automated-refund-worker`](https://github.com/MohdAzfara/automated-refund-worker) (Compensating Reversal Saga), this service enforces strict financial invariants:

1. **Two-Phase Balance Reservation**: Synchronously locks funds by transitioning balances from `available` to `pending` using 64-bit `BigInt` minor units prior to external PSP dispatch (`src/concurrency/pessimistic-balance-lock.ts`), eliminating Time-of-Check to Time-of-Use (TOCTOU) overdraft anomalies.
2. **Deterministic Multi-Rail Routing**: Evaluates currency corridors, transaction limits, and real-time gateway health to route payouts across Instant RTP, SEPA, Same-Day ACH, or SWIFT wire rails (`src/routing/multi-rail-router.ts`).
3. **Idempotent Asynchronous Execution**: Enforces strict `Idempotency-Key` validation and payload conflict detection (`src/guards/idempotency-guard.ts`) across background workers and downstream banking rails.
4. **Automated Three-Way Reconciliation**: Continuously reconciles internal sub-ledgers and payout state machines against external ISO 20022 `camt.053` banking EOD settlement statements (`src/reconciliation/three-way-reconciler.ts`).
5. **Double-Entry Settlement Journal Emission**: Emits balanced debit/credit settlement envelopes (`src/ledger/payout-journal-emitter.ts`) directly to `double-entry-ledger-core`.

---

## ✨ Key Architectural Features

* **Zero-Trust Webhook Attestation**: Constant-time signature verification and 300-second replay window guards (`src/security/webhook-signature-guard.ts`).
* **Automated Banking PII & IBAN Redaction**: Recursive telemetry scrubbing that masks bank account numbers, IBANs, and routing identifiers to last-4 digits (`src/telemetry/iban-pii-redactor.ts`).
* **Formal Verification (TLA+)**: Triple mathematical specifications proving strict conservation of funds, state machine finality, and multi-rail failover safety (`docs/formal-verification/`).
* **High-Throughput Micro-Benchmarks**: Deterministic benchmarks for SHA-256 idempotency fingerprinting, `BigInt` balance locking, Full-Jitter backoff, three-way reconciliation, and multi-rail routing (`benchmarks/`).

---

## 🔒 Security, Compliance & Vulnerability Disclosure

We treat financial settlement integrity and banking data protection as non-negotiable priorities:

* **Security Policy & Settlement Boundaries**: Review our [SECURITY.md](SECURITY.md) for HMAC verification, idempotency locks, and IBAN/PII redaction standards.
* **STRIDE Threat Model**: Comprehensive backend threat analysis and mitigations are documented in [docs/threat-model.md](docs/threat-model.md).
* **ISO 20022 & Regulatory Controls Matrix**: Alignment with `pain.001` end-to-end identification, `camt.053` statements, and SOC 1 ledger controls is documented in [docs/compliance/financial-settlement-controls.md](docs/compliance/financial-settlement-controls.md).
* **RFC 9116 Compliance**: Standardized vulnerability disclosure contact policy is published at [.well-known/security.txt](.well-known/security.txt).

---

## 📚 Documentation, Specifications & Runbooks

### Architecture Decision Records (ADRs)
* [ADR 0001: Two-Phase Balance Reservation and Serializable Locking](docs/adr/0001-pessimistic-balance-reservation-locking.md)
* [ADR 0002: Idempotent Asynchronous Payout Workers and DLQ Isolation](docs/adr/0002-idempotent-async-payout-workers.md)
* [ADR 0003: Automated Three-Way Settlement Reconciliation Engine](docs/adr/0003-automated-three-way-reconciliation.md)
* [ADR 0004: Deterministic Multi-Rail Payout Routing and Banking Failover](docs/adr/0004-multi-rail-payout-failover-routing.md)
* [ADR 0005: ISO 20022 CAMT.053 End-of-Day Bank Statement Ingestion](docs/adr/0005-camt053-iso20022-settlement-ingestion.md)
* [ADR 0006: Double-Entry Ledger Settlement Journal Emission and Clawback Parity](docs/adr/0006-double-entry-ledger-settlement-sealing.md)

### Formal Verification (TLA+), API Contracts & Operational Runbooks
* [TLA+ Invariant 1: Payout Conservation of Funds Specification](docs/formal-verification/payout-conservation-invariant.tla)
* [TLA+ Invariant 2: Settlement State Machine Finality Specification](docs/formal-verification/settlement-state-machine.tla)
* [TLA+ Invariant 3: Multi-Rail Failover Single-Disbursement Specification](docs/formal-verification/multi-rail-failover-idempotency.tla)
* [OpenAPI 3.1 Specification: Payout Orchestration Contract](docs/api/payout-gateway-openapi.yaml)
* [Operational Runbook 1: DLQ Payout Quarantine & Recovery SOP](docs/runbooks/dlq-reconciliation-recovery.md)
* [Operational Runbook 2: Banking Rail Brownout & Multi-Rail Failover SOP](docs/runbooks/banking-rail-brownout-failover-sop.md)

---

## 🤝 Contributing

We welcome contributions from distributed systems engineers and security researchers. Please review our [CONTRIBUTING.md](CONTRIBUTING.md) and adhere strictly to [Conventional Commits](https://www.conventionalcommits.org/) standards.

---

## 📄 License

Distributed under the **Apache-2.0 License**. See [LICENSE](LICENSE) for details.
