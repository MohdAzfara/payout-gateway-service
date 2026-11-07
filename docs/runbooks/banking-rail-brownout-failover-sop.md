# Operational Runbook: Banking Clearing Rail Brownout & Multi-Rail Failover SOP

## 1. Incident Trigger Conditions

This runbook is triggered when a primary clearing rail (`INSTANT_RTP`, `SEPA_CREDIT`, or `ACH_SAME_DAY`) experiences regional maintenance or elevated `HTTP 502/503` gateway rejections prior to transaction acceptance.

## 2. Automated Multi-Rail Rerouting

1. **Pre-Acceptance Failover**: `MultiRailPayoutRouter` (`src/routing/multi-rail-router.ts`) automatically shifts new outbound disbursements to the designated fallback corridor (`ACH_SAME_DAY` or `SWIFT_WIRE`).
2. **Ambiguous Timeout Quarantine**: Any payout that timed out *after* payload transmission remains locked in `DLQ_QUARANTINED` until three-way reconciliation confirms upstream bank status.

## 3. Recovery Verification Checklist

1. **Step 1 — Verify Ledger Reservation Parity**: Confirm via `double-entry-ledger-core` that all rerouted payouts maintain a single active `pending` balance lock.
2. **Step 2 — Restore Primary Rail Weight**: Gradually restore traffic to the primary clearing rail after 50 consecutive healthy probe settlements.
