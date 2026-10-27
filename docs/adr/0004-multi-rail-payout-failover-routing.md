# ADR 0004: Deterministic Multi-Rail Payout Routing and Banking Failover

* **Status**: Accepted
* **Date**: 2026-10-27
* **Deciders**: Principal Distributed Systems & Fintech Architecture Team

## Context

Single-homing outbound payouts on a single banking partner exposes merchants to regional clearing house outages, maintenance windows, and liquidity bottlenecks.

## Decision

We introduce a **Deterministic Multi-Rail Routing Matrix** with health-aware failover:

1. **Primary vs. Backup Rail Selection**: Payout instructions evaluate currency, destination country, and SLA tier (Instant RTP vs. Standard ACH/SEPA) to select the optimal banking gateway.
2. **Idempotent Failover Re-Routing**: If the primary banking rail returns a hard gateway outage (`502`/`503`/`504`) prior to transaction acceptance, the router deterministically re-routes the instruction to a secondary banking PSP using a derived child `Idempotency-Key`.

## Consequences

* **Positive**: Achieves 99.999% outbound disbursement availability even during regional banking partner outages.
* **Negative**: Ambiguous timeouts must still be quarantined in the Dead-Letter Queue (DLQ) rather than immediately re-routed to prevent double disbursement.
