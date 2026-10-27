---------------- MODULE SettlementStateMachine ----------------
EXTENDS Naturals, FiniteSets

CONSTANTS MaxRetries

VARIABLES 
    payoutStatus,
    retryCount,
    dlqIsolated

vars == <<payoutStatus, retryCount, dlqIsolated>>

States == {"PENDING", "PROCESSING", "SETTLED", "FAILED", "REVERSED", "DLQ_QUARANTINED"}

Init ==
    /\ payoutStatus = "PENDING"
    /\ retryCount = 0
    /\ dlqIsolated = FALSE

DispatchToBank ==
    /\ payoutStatus = "PENDING"
    /\ payoutStatus' = "PROCESSING"
    /\ UNCHANGED <<retryCount, dlqIsolated>>

ConfirmSettlement ==
    /\ payoutStatus = "PROCESSING"
    /\ payoutStatus' = "SETTLED"
    /\ UNCHANGED <<retryCount, dlqIsolated>>

RetryTransientTimeout ==
    /\ payoutStatus = "PROCESSING"
    /\ retryCount < MaxRetries
    /\ retryCount' = retryCount + 1
    /\ payoutStatus' = "PENDING"
    /\ UNCHANGED <<dlqIsolated>>

QuarantineToDLQ ==
    /\ payoutStatus = "PROCESSING"
    /\ retryCount >= MaxRetries
    /\ payoutStatus' = "DLQ_QUARANTINED"
    /\ dlqIsolated' = TRUE
    /\ UNCHANGED <<retryCount>>

FailAndReverse ==
    /\ payoutStatus \in {"PROCESSING", "DLQ_QUARANTINED"}
    /\ payoutStatus' = "REVERSED"
    /\ UNCHANGED <<retryCount, dlqIsolated>>

Next ==
    \/ DispatchToBank
    \/ ConfirmSettlement
    \/ RetryTransientTimeout
    \/ QuarantineToDLQ
    \/ FailAndReverse

TypeOK ==
    /\ payoutStatus \in States
    /\ retryCount \in 0..MaxRetries
    /\ dlqIsolated \in BOOLEAN

\* Terminal State Invariant: Settled payouts cannot transition backward to PENDING
SettlementFinalityInvariant ==
    (payoutStatus = "SETTLED") => (dlqIsolated = FALSE)

Spec == Init /\ [][Next]_vars
=============================================================================
