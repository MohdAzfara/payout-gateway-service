# ADR 0003: Automated Three-Way Settlement Reconciliation Engine

* **Status**: Accepted
* **Date**: 2026-10-27
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

Asynchronous vendor payouts rely on external banking networks (ACH, SEPA, RTP) where settlement finality may be delayed by hours or days. Relying solely on synchronous API responses creates blind spots for silent bank drops, fee discrepancies, or unrecorded chargebacks.

## Decision

We implement an **Automated Three-Way Reconciliation Engine** that continuously verifies state consistency across three independent sources of truth:

1. **Internal Platform Sub-Ledger**: The two-phase balance reservation records (`available` and `pending` state transitions).
2. **Payout Orchestration State Machine**: The operational dispatch records (`PENDING`, `PROCESSING`, `SETTLED`, `FAILED`).
3. **External Banking Settlement Statements**: End-of-day (EOD) CAMT.053 / BAI2 / webhook settlement reports ingested from partner PSPs.

## Consequences

* **Positive**: Detects penny-level discrepancies, phantom settlements, and stuck in-flight payouts within strict SLA windows.
* **Negative**: Requires deterministic correlation IDs (`Idempotency-Key` + PSP Reference) across all external banking calls.
