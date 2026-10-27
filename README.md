# Payout Gateway Service

[![Payout CI & Verification Pipeline](https://img.shields.io/badge/Payout%20CI%20%26%20Security%20Pipeline-passing-brightgreen)](https://github.com/MohdAzfara/payout-gateway-service/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![SemVer](https://img.shields.io/badge/SemVer-1.0.0-green.svg)](https://semver.org/)

A high-throughput, enterprise-grade TypeScript microservice engineered for asynchronous vendor payouts, two-phase balance reservation, and automated settlement reconciliation.

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
[ Asynchronous Payout Worker Queue ] ─(Full-Jitter Exponential Backoff)
                       │
          ┌────────────┴────────────┐
          ▼ (2xx Settled)           ▼ (Timeout / 5xx Error)
[ Finalize Ledger Debit ]   [ Dead-Letter Queue (DLQ) & Reconciliation ]
```

---

## 🏛️ Architectural Overview & Settlement Flow

Designed as the outbound settlement counterpart to [`checkout-flow-sdk`](https://github.com/MohdAzfara/checkout-flow-sdk), this service enforces strict financial invariants across every stage of fund disbursement:

1. **Two-Phase Balance Reservation**: Synchronously locks funds by transitioning balances from `available` to `pending` prior to external PSP dispatch, eliminating Time-of-Check to Time-of-Use (TOCTOU) overdraft anomalies.
2. **Idempotent Asynchronous Execution**: Enforces deterministic `Idempotency-Key` propagation across background worker queues and downstream banking rails to guarantee zero duplicate disbursements under network retries.
3. **Automated Settlement Reconciliation**: Continuously matches internal payout state machines (`PENDING` $\rightarrow$ `PROCESSING` $\rightarrow$ `SETTLED` / `FAILED`) against external banking partner statements to detect and flag discrepancies.
4. **Graceful Failure Recovery & DLQ Quarantine**: Routes ambiguous gateway timeouts into a Dead-Letter Queue (DLQ) with AWS-style Full Jitter backoff, preventing premature balance rollbacks until settlement finality is verified.

---

## ✨ Key Architectural Features

* **Recipient Account & Eligibility Guards**: Validates connected vendor onboarding status, currency compatibility, and minimum payout thresholds prior to balance locking.
* **Formal Verification (TLA+)**: Mathematical specifications proven via TLA+ guaranteeing strict conservation of funds and non-negative balance invariants (`docs/formal-verification/`).
* **Micro-Benchmarks**: High-throughput SHA-256 idempotency fingerprinting and batch reconciliation benchmarks (`benchmarks/`).
* **Strict Supply-Chain & Runtime Security**: Exact dependency locking (`.npmrc`, `.nvmrc`) paired with automated Dependabot supply-chain auditing.

---

## 🔒 Security & Vulnerability Disclosure

We treat financial settlement integrity and banking data protection as non-negotiable priorities:

* **Security Policy & Settlement Boundaries**: Review our [SECURITY.md](SECURITY.md) for HMAC verification, idempotency locks, and IBAN/PII redaction standards.
* **STRIDE Threat Model**: Comprehensive backend threat analysis and mitigations are documented in [docs/threat-model.md](docs/threat-model.md).
* **RFC 9116 Compliance**: Standardized vulnerability disclosure contact policy is published at [.well-known/security.txt](.well-known/security.txt).

---

## 📚 Documentation & Architecture Decision Records (ADRs)

* [ADR 0001: Two-Phase Balance Reservation and Serializable Locking](docs/adr/0001-pessimistic-balance-reservation-locking.md)
* [ADR 0002: Idempotent Asynchronous Payout Workers and DLQ Isolation](docs/adr/0002-idempotent-async-payout-workers.md)
* [TLA+ Formal Specification: Conservation of Funds Invariant](docs/formal-verification/payout-conservation-invariant.tla)

---

## 🤝 Contributing

We welcome contributions from distributed systems engineers and security researchers. Please review our [CONTRIBUTING.md](CONTRIBUTING.md) and adhere strictly to [Conventional Commits](https://www.conventionalcommits.org/) standards.

---

## 📄 License

Distributed under the **Apache-2.0 License**. See [LICENSE](LICENSE) for details.
