export type PayoutLifecycleState =
  | 'PENDING'
  | 'PROCESSING'
  | 'SETTLED'
  | 'DLQ_QUARANTINED'
  | 'REVERSED';

/**
 * Deterministic Payout Lifecycle State Machine
 * Enforces valid state transitions and prevents illegal backward mutations from SETTLED.
 */
export class PayoutStateMachine {
  private static readonly ALLOWED_TRANSITIONS: Readonly<
    Record<PayoutLifecycleState, readonly PayoutLifecycleState[]>
  > = {
    PENDING: ['PROCESSING', 'REVERSED'],
    PROCESSING: ['SETTLED', 'DLQ_QUARANTINED', 'REVERSED'],
    DLQ_QUARANTINED: ['SETTLED', 'REVERSED'],
    SETTLED: [],
    REVERSED: []
  };

  public static assertValidTransition(
    fromState: PayoutLifecycleState,
    toState: PayoutLifecycleState
  ): PayoutLifecycleState {
    const allowed = this.ALLOWED_TRANSITIONS[fromState];
    if (!allowed.includes(toState)) {
      throw new Error(
        `Invalid payout state transition: cannot transition from "${fromState}" to "${toState}".`
      );
    }
    return toState;
  }
}
