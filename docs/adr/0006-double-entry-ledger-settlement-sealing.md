# ADR 0006: Double-Entry Ledger Settlement Journal Emission and Clawback Parity

* **Status**: Accepted
* **Date**: 2026-11-03
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

`payout-gateway-service` manages outbound vendor disbursements funded by `checkout-flow-sdk` captures and subject to pro-rata reversals from `automated-refund-worker`. All balance transitions must reconcile with `double-entry-ledger-core`.

## Decision

Every payout lifecycle transition emits an atomic **Double-Entry Settlement Journal Envelope**:

1. **Reservation Leg (`PENDING`)**: Debits `acct_vendor_available` and credits `acct_vendor_payout_in_flight` in `BigInt` minor units.
2. **Settlement Leg (`SETTLED`)**: Debits `acct_vendor_payout_in_flight` and credits `acct_settlement_bank_clearing`.
3. **Failure Rollback Leg (`REVERSED`)**: Posts a compensating contra-entry restoring `acct_vendor_available`.

## Consequences

* **Positive**: Preserves mathematical zero-sum parity between `payout-gateway-service` and `double-entry-ledger-core`.
* **Negative**: Requires strict sequence ordering between reservation and settlement journal emissions.
