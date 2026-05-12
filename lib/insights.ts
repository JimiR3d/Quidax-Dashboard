import type { MarketTicker } from "./quidax"

/**
 * Analyst-modeled FX reference rates (Nov 2025 estimates).
 * Not pulled from live feeds — CBN NFEM and parallel-market rates have no
 * free machine-readable API. These are sourced from publicly reported daily
 * averages and should be refreshed manually.
 */
export const FX_REFERENCE = {
  cbnOfficial: 1432, // NFEM weighted average estimate
  parallel: 1470, // P2P / BDC average estimate
  asOf: "2025-11-12",
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

/** Real Quidax B2B customers as named on quidax.com/business. */
export const QUIDAX_B2B_CUSTOMERS = [
  {
    name: "Basqet",
    category: "Multi-currency wallet & payments",
    description:
      "Pan-African personal-finance app. Uses Quidax rails for crypto on/off-ramp inside its multi-currency wallet, letting users move between NGN, stablecoins, and other crypto without leaving the app.",
    source: "quidax.com/business",
  },
  {
    name: "Blano",
    category: "Stablecoin remittance & savings",
    description:
      "Africa-focused stablecoin app for diaspora remittance and dollar savings. Built on Quidax's API to settle USDT/NGN flows for users sending money home.",
    source: "quidax.com/business",
  },
  {
    name: "Gigxpad",
    category: "Creator & gig-economy payouts",
    description:
      "Payout platform for African creators and gig workers. Plugs into Quidax to deliver instant NGN settlements from USD-denominated revenue, removing dependence on slow correspondent banking.",
    source: "quidax.com/business",
  },
] as const
