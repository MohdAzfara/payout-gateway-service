---------------- MODULE MultiRailFailoverIdempotency ----------------
EXTENDS Naturals, FiniteSets

VARIABLES 
    primaryRailState,
    backupRailState,
    disbursedCount,
    activeIdempotencyKey

vars == <<primaryRailState, backupRailState, disbursedCount, activeIdempotencyKey>>

RailStates == {"IDLE", "HARD_REJECT_503", "SETTLED"}

Init ==
    /\ primaryRailState = "IDLE"
    /\ backupRailState = "IDLE"
    /\ disbursedCount = 0
    /\ activeIdempotencyKey = "KEY_NONE"

AttemptPrimarySettled ==
    /\ primaryRailState = "IDLE"
    /\ backupRailState = "IDLE"
    /\ primaryRailState' = "SETTLED"
    /\ disbursedCount' = disbursedCount + 1
    /\ activeIdempotencyKey' = "KEY_PRIMARY"
    /\ UNCHANGED <<backupRailState>>

PrimaryHardOutageBeforeAccept ==
    /\ primaryRailState = "IDLE"
    /\ primaryRailState' = "HARD_REJECT_503"
    /\ UNCHANGED <<backupRailState, disbursedCount, activeIdempotencyKey>>

FailoverToBackupRail ==
    /\ primaryRailState = "HARD_REJECT_503"
    /\ backupRailState = "IDLE"
    /\ disbursedCount = 0
    /\ backupRailState' = "SETTLED"
    /\ disbursedCount' = disbursedCount + 1
    /\ activeIdempotencyKey' = "KEY_BACKUP_DERIVED"
    /\ UNCHANGED <<primaryRailState>>

Next ==
    \/ AttemptPrimarySettled
    \/ PrimaryHardOutageBeforeAccept
    \/ FailoverToBackupRail

\* Invariant: Total vendor disbursements across primary and backup rails never exceed 1
SingleDisbursementFailoverInvariant ==
    disbursedCount <= 1

Spec == Init /\ [][Next]_vars
=============================================================================
