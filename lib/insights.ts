import type { MarketTicker } from "./quidax"

/**
 * FX reference rates. Updated manually from public sources because neither
 * CBN nor parallel-market feeds publish a free machine-readable endpoint.
 * Verified May 2026 against abokifx.com and CBN NFEM daily print.
 */
export const FX_REFERENCE = {
  cbnOfficial: 1375, // NFEM daily weighted average (verified: 1374.9431)
  parallel: 1395, // BDC / P2P midpoint (verified range: 1393-1398)
  asOf: "2026-05-12",
} as const

export type Spread = {
  cbnOfficial: number
  parallel: number
  quidaxUsdtNgn: number
  // Quidax USDT/NGN as a % of CBN. <100% means crypto is cheaper than official.
  vsCbnPct: number
  // Quidax USDT/NGN as a % of parallel.
  vsParallelPct: number
  // Bps spread between parallel and CBN (the "FX gap" itself).
  fxGapBps: number
}

export function computeSpread(usdtTicker: MarketTicker | undefined): Spread {
  const quidax = usdtTicker?.last ?? FX_REFERENCE.cbnOfficial
  const vsCbnPct = (quidax / FX_REFERENCE.cbnOfficial) * 100
  const vsParallelPct = (quidax / FX_REFERENCE.parallel) * 100
  const fxGapBps = ((FX_REFERENCE.parallel - FX_REFERENCE.cbnOfficial) / FX_REFERENCE.cbnOfficial) * 10000
  return {
    cbnOfficial: FX_REFERENCE.cbnOfficial,
    parallel: FX_REFERENCE.parallel,
    quidaxUsdtNgn: quidax,
    vsCbnPct,
    vsParallelPct,
    fxGapBps,
  }
}

export type PegStatus = "stable" | "watch" | "depeg"

export type Peg = {
  cngnNgn: number
  deviationBps: number
  status: PegStatus
  // Implied USDT/NGN derived from cNGN cross — should track Quidax USDT/NGN.
  impliedUsdtNgnFromCngn: number | null
}

export function computeCngnPeg(cngnNgn?: MarketTicker, cngnUsdt?: MarketTicker): Peg {
  const price = cngnNgn?.last ?? 1
  const deviationBps = (price - 1) * 10000
  const abs = Math.abs(deviationBps)
  const status: PegStatus = abs < 25 ? "stable" : abs < 100 ? "watch" : "depeg"
  // 1 cNGN ~ 1 NGN, so implied USDT/NGN ~ 1 / (cngnUsdt.last)
  const impliedUsdtNgnFromCngn = cngnUsdt?.last && cngnUsdt.last > 0 ? 1 / cngnUsdt.last : null
  return {
    cngnNgn: price,
    deviationBps,
    status,
    impliedUsdtNgnFromCngn,
  }
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
