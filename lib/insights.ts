import type { MarketTicker } from "./quidax"

/**
 * FX reference rates. Updated manually from public sources because neither
 * CBN nor parallel-market feeds publish a free machine-readable endpoint.
 *
 * Last verified May 2026 against abokifx.com (parallel) and the CBN NFEM
 * daily print. Until we wire a server-side scrape, this MUST be treated as
 * an analyst-modeled reference, not as live data. The UI surfaces `asOf`
 * everywhere a NFEM-derived number is displayed.
 *
 * Staleness policy (also enforced by `isFxReferenceStale`):
 *   < 3 days  -> "ok"
 *   3–10 days -> "stale" (UI shows amber chip, hides bps deviation)
 *   ≥ 10 days -> "very-stale" (UI hides the comparison entirely)
 */
export const FX_REFERENCE = {
  cbnOfficial: 1375, // NFEM daily weighted average (verified: 1374.9431)
  parallel: 1395, // BDC / P2P midpoint (verified range: 1393-1398)
  asOf: "2026-05-12",
} as const

export type FxStaleness = "ok" | "stale" | "very-stale"

export function fxReferenceAgeDays(now: Date = new Date()): number {
  const asOf = new Date(FX_REFERENCE.asOf + "T00:00:00Z").getTime()
  const diff = now.getTime() - asOf
  return Math.floor(diff / (24 * 60 * 60 * 1000))
}

export function fxReferenceStaleness(now: Date = new Date()): FxStaleness {
  const days = fxReferenceAgeDays(now)
  if (days < 3) return "ok"
  if (days < 10) return "stale"
  return "very-stale"
}

export type Spread = {
  cbnOfficial: number
  parallel: number
  quidaxUsdtNgn: number
  /** Quidax USDT/NGN as a % of NFEM. <100% means crypto trades inside official. */
  vsCbnPct: number
  vsParallelPct: number
  /** Basis-point gap between parallel and NFEM (the "FX gap" itself). */
  fxGapBps: number
  /** Basis-point deviation of Quidax vs NFEM. Positive => Quidax > NFEM. */
  vsCbnBps: number
  /** Whether the NFEM reference is fresh enough to trust the bps deviation. */
  staleness: FxStaleness
  asOf: string
}

export function computeSpread(usdtTicker: MarketTicker | undefined): Spread {
  const quidax = usdtTicker?.last ?? FX_REFERENCE.cbnOfficial
  const vsCbnPct = (quidax / FX_REFERENCE.cbnOfficial) * 100
  const vsParallelPct = (quidax / FX_REFERENCE.parallel) * 100
  const vsCbnBps =
    ((quidax - FX_REFERENCE.cbnOfficial) / FX_REFERENCE.cbnOfficial) * 10000
  const fxGapBps =
    ((FX_REFERENCE.parallel - FX_REFERENCE.cbnOfficial) /
      FX_REFERENCE.cbnOfficial) *
    10000
  return {
    cbnOfficial: FX_REFERENCE.cbnOfficial,
    parallel: FX_REFERENCE.parallel,
    quidaxUsdtNgn: quidax,
    vsCbnPct,
    vsParallelPct,
    vsCbnBps,
    fxGapBps,
    staleness: fxReferenceStaleness(),
    asOf: FX_REFERENCE.asOf,
  }
}

export type PegStatus = "stable" | "watch" | "depeg"

export type Peg = {
  cngnNgn: number
  deviationBps: number
  status: PegStatus
  /** Implied USDT/NGN derived from cNGN cross — should track Quidax USDT/NGN. */
  impliedUsdtNgnFromCngn: number | null
  /** Whether we even have a real cNGN/NGN spot to compute from. */
  hasLiveSpot: boolean
}

export function computeCngnPeg(
  cngnNgn?: MarketTicker,
  cngnUsdt?: MarketTicker,
): Peg {
  const price = cngnNgn?.last ?? 1
  const deviationBps = (price - 1) * 10000
  const abs = Math.abs(deviationBps)
  const status: PegStatus = abs < 25 ? "stable" : abs < 100 ? "watch" : "depeg"
  const impliedUsdtNgnFromCngn =
    cngnUsdt?.last && cngnUsdt.last > 0 ? 1 / cngnUsdt.last : null
  return {
    cngnNgn: price,
    deviationBps,
    status,
    impliedUsdtNgnFromCngn,
    hasLiveSpot: Boolean(cngnNgn?.last && cngnNgn.last > 0),
  }
}

/**
 * NGN turnover for a single ticker, in NGN.
 *
 * Quidax's public ticker `vol` field is base-asset volume. So NGN-turnover =
 * `last * baseVolume` for NGN-quoted markets only. We refuse to compute it
 * for non-NGN markets and return 0 — anyone summing this is safe.
 */
export function ngnTurnover(t: MarketTicker): number {
  if (t.quote !== "NGN") return 0
  return t.last * t.baseVolume
}

/**
 * Real Quidax B2B customers as named on quidax.com/business.
 * Descriptions paraphrased directly from their own published testimonials —
 * do not embellish; the value of citing them is precision.
 */
export const QUIDAX_B2B_CUSTOMERS = [
  {
    name: "Basqet",
    category: "Payment collections infrastructure",
    description:
      "Collections-and-settlement platform. Uses Quidax as crypto-rail infrastructure, treating the exchange as a dependable backbone for reliable payment processing and stable transaction flow.",
    source: "quidax.com/business",
  },
  {
    name: "Blano",
    category: "Bitcoin & gift card trading",
    description:
      "Bitcoin and gift card trading platform for African users. Plugs into Quidax's exchange infrastructure and liquidity so user trades settle quickly, securely, and efficiently.",
    source: "quidax.com/business",
  },
  {
    name: "Gigxpad",
    category: "DeFi staking & rewards",
    description:
      "DeFi platform built around staking and rewards. Uses Quidax as the financial backbone for asset management and reliable transaction processing, freeing the team to focus on product.",
    source: "quidax.com/business",
  },
] as const
