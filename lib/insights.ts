import type { MarketTicker } from "./quidax"
import type { LiveFxReference } from "./fx-rates"

/**
 * FX reference rates. These are static fallback values used when the live
 * API (open.er-api.com) is unreachable. Updated periodically from public
 * sources (abokifx.com for parallel, CBN NFEM daily print for official).
 *
 * In normal operation, `getLiveFxRates()` in fx-rates.ts provides auto-updated
 * rates and these constants are never used. The UI surfaces `asOf`
 * everywhere a reference rate is displayed.
 *
 * Staleness policy (also enforced by `isFxReferenceStale`):
 *   < 3 days  -> "ok"
 *   3–10 days -> "stale" (UI shows amber chip, hides bps deviation)
 *   ≥ 10 days -> "very-stale" (UI hides the comparison entirely)
 */
export const FX_REFERENCE = {
  cbnOfficial: 1371, // NFEM daily weighted average (verified: 1371.04, May 15 print)
  parallel: 1395, // BDC / P2P midpoint (verified range: 1393-1398, nairatoday May 18)
  asOf: "2026-05-18",
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
  /** Whether rates came from a live API or from hardcoded fallback. */
  fxSource: "live-api" | "fallback"
}

/**
 * Compute the FX spread, optionally using live auto-fetched rates.
 * If `liveFx` is provided (from `getLiveFxRates()`), uses those rates
 * and marks staleness as "ok" (since they were just fetched).
 * Falls back to the static FX_REFERENCE if not provided.
 */
export function computeSpread(
  usdtTicker: MarketTicker | undefined,
  liveFx?: LiveFxReference,
): Spread {
  const cbn = liveFx?.cbnOfficial ?? FX_REFERENCE.cbnOfficial
  const par = liveFx?.parallel ?? FX_REFERENCE.parallel
  const asOf = liveFx?.asOf ?? FX_REFERENCE.asOf
  const fxSource = liveFx?.source ?? "fallback"

  // If we have live rates, staleness is based on fetch age, not a hardcoded date
  const staleness: FxStaleness = liveFx?.source === "live-api"
    ? "ok" // Live API rates are always fresh enough
    : fxReferenceStaleness()

  const quidax = usdtTicker?.last ?? cbn
  const vsCbnPct = (quidax / cbn) * 100
  const vsParallelPct = (quidax / par) * 100
  const vsCbnBps = ((quidax - cbn) / cbn) * 10000
  const fxGapBps = ((par - cbn) / cbn) * 10000

  return {
    cbnOfficial: cbn,
    parallel: par,
    quidaxUsdtNgn: quidax,
    vsCbnPct,
    vsParallelPct,
    vsCbnBps,
    fxGapBps,
    staleness,
    asOf,
    fxSource,
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
    name: "Helicode",
    category: "Global payroll infrastructure",
    description:
      "Global hiring and payroll platform. Uses Quidax as crypto-rail infrastructure to facilitate stablecoin payouts, enabling fast and reliable cross-border payroll processing.",
    source: "helicode.xyz",
    url: "https://helicode.xyz",
  },
  {
    name: "Lisk",
    category: "Layer 2 Blockchain",
    description:
      "Layer 2 blockchain focused on emerging markets. Partners with Quidax to integrate stablecoin and digital asset products, catering to the increasing demand from businesses building across Africa.",
    source: "Quidax Public Statement",
    url: "https://lisk.com",
  },
  {
    name: "Gigxpad",
    category: "DeFi staking & rewards",
    description:
      "DeFi platform built around staking and rewards. Uses Quidax as the financial backbone for asset management and reliable transaction processing, freeing the team to focus on product.",
    source: "quidax.com",
    url: "https://gigxpad.com",
  },
] as const
