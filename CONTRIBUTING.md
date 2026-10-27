# Contributing to Payout Gateway Service

We welcome contributions from distributed systems engineers and fintech security researchers. Because this service handles outbound fund disbursements and balance reconciliation, all contributions must meet strict engineering invariants.

## 1. Architectural Invariants

* **Zero Double-Payout Guarantee**: Every state-mutating endpoint and worker job must preserve strict `Idempotency-Key` enforcement.
* **Precision Arithmetic**: Never use IEEE 754 floating-point numbers for currency amounts; represent all monetary values in minor units (`bigint` or integer cents).
* **Deterministic State Transitions**: All payout lifecycle transitions (`PENDING` -> `PROCESSING` -> `SETTLED` / `FAILED` / `REVERSED`) must be atomic and auditable.

## 2. Commit Message Convention

We strictly follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

* `feat(payout): ...` for new disbursement or reconciliation features
* `fix(ledger): ...` for balance tracking or state transition fixes
* `docs(security): ...` for threat models, ADRs, or compliance documentation
* `perf(bench): ...` for throughput or concurrency optimizations
* `chore(security): ...` for dependency locking and supply-chain hardening

## 3. Pull Request Checklist

1. Ensure `npx tsc --noEmit` passes with zero errors.
2. Verify that no raw banking credentials or PII can leak into error logs.
3. Update relevant Architecture Decision Records (`docs/adr/`) if modifying state machine behavior.
