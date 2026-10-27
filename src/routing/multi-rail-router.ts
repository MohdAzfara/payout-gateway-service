export type SettlementRail = 'INSTANT_RTP' | 'SEPA_CREDIT' | 'ACH_SAME_DAY' | 'SWIFT_WIRE';

export interface PayoutRoutingContext {
  readonly currency: 'USD' | 'EUR' | 'GBP' | 'SGD';
  readonly amountMinor: bigint;
  readonly primaryRailHealthy: boolean;
}

export interface RouteDecision {
  readonly selectedRail: SettlementRail;
  readonly failoverActivated: boolean;
  readonly routingRationale: string;
}

/**
 * Deterministic Multi-Rail Payout Router
 * Selects optimal clearing rails with automatic failover when primary gateways degrade.
 */
export class MultiRailPayoutRouter {
  private static readonly INSTANT_RTP_LIMIT_MINOR = 100_000_00n; // $100,000.00 cap

  public resolveRoute(ctx: PayoutRoutingContext): RouteDecision {
    if (ctx.currency === 'EUR') {
      return {
        selectedRail: ctx.primaryRailHealthy ? 'SEPA_CREDIT' : 'SWIFT_WIRE',
        failoverActivated: !ctx.primaryRailHealthy,
        routingRationale: ctx.primaryRailHealthy
          ? 'Primary EUR SEPA clearing rail healthy.'
          : 'SEPA gateway degraded; failing over to SWIFT wire corridor.'
      };
    }

    if (ctx.currency === 'USD' && ctx.amountMinor <= MultiRailPayoutRouter.INSTANT_RTP_LIMIT_MINOR) {
      if (ctx.primaryRailHealthy) {
        return {
          selectedRail: 'INSTANT_RTP',
          failoverActivated: false,
          routingRationale: 'Eligible for real-time USD RTP settlement.'
        };
      }
      return {
        selectedRail: 'ACH_SAME_DAY',
        failoverActivated: true,
        routingRationale: 'Primary RTP rail degraded; rerouting to Same-Day ACH fallback.'
      };
    }

    return {
      selectedRail: ctx.primaryRailHealthy ? 'ACH_SAME_DAY' : 'SWIFT_WIRE',
      failoverActivated: !ctx.primaryRailHealthy,
      routingRationale: 'High-value or international corridor routing applied.'
    };
  }
}
