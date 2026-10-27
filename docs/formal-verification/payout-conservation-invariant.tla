---------------- MODULE PayoutConservationInvariant ----------------
EXTENDS Integers, FiniteSets

CONSTANTS InitialBalance, PayoutAmount, RequestKeys

VARIABLES 
    availableBalance,
    pendingBalance,
    settledTotal,
    processedKeys

vars == <<availableBalance, pendingBalance, settledTotal, processedKeys>>

Init ==
    /\ availableBalance = InitialBalance
    /\ pendingBalance = 0
    /\ settledTotal = 0
    /\ processedKeys = {}

ReservePayout(key) ==
    /\ key \notin processedKeys
    /\ availableBalance >= PayoutAmount
    /\ availableBalance' = availableBalance - PayoutAmount
    /\ pendingBalance' = pendingBalance + PayoutAmount
    /\ processedKeys' = processedKeys \cup {key}
    /\ UNCHANGED <<settledTotal>>

SettlePayout ==
    /\ pendingBalance >= PayoutAmount
    /\ pendingBalance' = pendingBalance - PayoutAmount
    /\ settledTotal' = settledTotal + PayoutAmount
    /\ UNCHANGED <<availableBalance, processedKeys>>

RevertFailedPayout ==
    /\ pendingBalance >= PayoutAmount
    /\ pendingBalance' = pendingBalance - PayoutAmount
    /\ availableBalance' = availableBalance + PayoutAmount
    /\ UNCHANGED <<settledTotal, processedKeys>>

Next ==
    \/ \E k \in RequestKeys : ReservePayout(k)
    \/ SettlePayout
    \/ RevertFailedPayout

\* Invariant 1: Total funds across all states must strictly equal InitialBalance
ConservationOfFundsInvariant ==
    (availableBalance + pendingBalance + settledTotal) = InitialBalance

\* Invariant 2: Balances must never drop below zero (No Overdrafts)
NonNegativeBalanceInvariant ==
    /\ availableBalance >= 0
    /\ pendingBalance >= 0
    /\ settledTotal >= 0

Spec == Init /\ [][Next]_vars
=============================================================================
