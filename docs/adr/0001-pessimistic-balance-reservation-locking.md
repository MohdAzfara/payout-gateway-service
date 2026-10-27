# ADR 0001: Two-Phase Balance Reservation and Serializable Locking

* **Status**: Accepted
* **Date**: 2026-10-27
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

In high-throughput vendor payout systems, concurrent disbursement requests for the same connected merchant account can trigger race conditions (Time-of-Check to Time-of-Use / TOCTOU), potentially resulting in negative platform balances or overdrafts when external banking APIs respond asynchronously.

## Decision

We enforce a strict **Two-Phase Balance Reservation Pattern** backed by serializable transaction boundaries:

1. **Phase 1 (Synchronous Reservation)**: Upon receiving an authenticated payout request with a unique `Idempotency-Key`, the engine atomically deducts the requested amount from `available_balance` and credits `pending_payout_balance` within an isolated ACID transaction before enqueuing the disbursement job.
2. **Phase 2 (Asynchronous Settlement or Rollback)**: Background workers dispatch the transfer to the external banking PSP.
   * On confirmed settlement (`SETTLED`), `pending_payout_balance` is permanently debited.
   * On terminal failure (`FAILED`), a compensating ledger entry atomically restores funds from `pending_payout_balance` back to `available_balance`.

## Consequences

* **Positive**: Eliminates double-spending and race-condition overdrafts under extreme concurrency; ensures 100% auditability during in-flight bank transfers.
* **Negative**: Requires strict idempotency key indexing and compensating transaction logic for terminal banking rejections.
