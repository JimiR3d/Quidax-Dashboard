/**
 * Hand-curated competitive & opportunity data.
 *
 * These are the analyst's working estimates used to frame the B2B thesis.
 * Numbers are directionally accurate based on public reporting (Chainalysis
 * Geography of Crypto reports, IMF / World Bank remittance corridors, public
 * statements from Quidax, Yellow Card, Busha, and Luno). Treat as a model,
 * not a forecast.
 */

export type Competitor = {
  name: string
  positioning: string
  b2bApi: "yes" | "limited" | "no"
  ngnPairs: number
  ngnFocus: "core" | "secondary" | "none"
  africaCountries: number
  stablecoinFocus: "high" | "medium" | "low"
  notableEdge: string
}

export const COMPETITORS: Competitor[] = [
  {
    name: "Quidax",
    positioning: "NGN-native exchange + API for African fintechs",
    b2bApi: "yes",
    ngnPairs: 9,
    ngnFocus: "core",
    africaCountries: 4,
    stablecoinFocus: "high",
    notableEdge: "Only local exchange listing cNGN (regulated naira stablecoin); deepest USDT/NGN order book among Nigerian players",
  },
  {
    name: "Yellow Card",
    positioning: "Pan-African retail + Yellow Card Pay (B2B)",
    b2bApi: "yes",
    ngnPairs: 6,
    ngnFocus: "secondary",
    africaCountries: 20,
    stablecoinFocus: "high",
    notableEdge: "Largest pan-African footprint; strong stablecoin payments rails",
  },
  {
    name: "Busha",
    positioning: "Retail-first Nigerian exchange",
    b2bApi: "limited",
    ngnPairs: 18,
    ngnFocus: "core",
    africaCountries: 1,
    stablecoinFocus: "medium",
    notableEdge: "Clean retail UX; growing recurring-buy product",
  },
  {
    name: "Luno",
    positioning: "Pan-African retail (Singapore-owned)",
    b2bApi: "no",
    ngnPairs: 5,
    ngnFocus: "secondary",
    africaCountries: 5,
    stablecoinFocus: "low",
    notableEdge: "Trusted brand, conservative product surface, no NGN-native B2B API",
  },
  {
    name: "Roqqu",
    positioning: "Retail + virtual cards",
    b2bApi: "no",
    ngnPairs: 12,
    ngnFocus: "core",
    africaCountries: 2,
    stablecoinFocus: "medium",
    notableEdge: "Card issuance; weaker liquidity depth on majors",
  },
]

export type B2BSegment = {
  segment: string
  description: string
  // Annual TAM proxy in USD (analyst estimate)
  tamUsd: number
  // Realistic share Quidax could capture in 24 months
  capturePctLow: number
  capturePctHigh: number
  // Revenue take rate (bps) applied to captured flow
  takeRateBps: number
  signals: string[]
}

export const B2B_SEGMENTS: B2BSegment[] = [
  {
    segment: "Cross-border B2B settlement",
    description:
      "SMEs and fintechs settling supplier invoices into China, UAE, India via USDT rails instead of correspondent banking.",
    tamUsd: 18_000_000_000,
    capturePctLow: 0.3,
    capturePctHigh: 1.2,
    takeRateBps: 35,
    signals: [
      "Naira's persistent FX gap drives stablecoin substitution",
      "Banking corridors to CN/AE remain slow and expensive",
      "Yellow Card and Conduit already monetizing this flow",
    ],
  },
  {
    segment: "Remittance corridors (inbound)",
    description:
      "Diaspora remittances routed through stablecoins for lower fees and faster settlement than MTO rails.",
    tamUsd: 20_900_000_000, // World Bank Nigeria inbound remittances proxy
    capturePctLow: 0.2,
    capturePctHigh: 0.8,
    takeRateBps: 25,
    signals: [
      "World Bank: Nigeria is #1 SSA remittance recipient",
      "Sendwave, LemFi, Grey already partnering with on-chain liquidity providers",
      "CBN allowance for licensed VASPs improves legitimacy",
    ],
  },
  {
    segment: "Fintech treasury & FX hedging",
    description:
      "Nigerian fintechs and exporters holding USD-exposure via USDT to manage naira volatility.",
    tamUsd: 4_200_000_000,
    capturePctLow: 0.8,
    capturePctHigh: 3.0,
    takeRateBps: 18,
    signals: [
      "Naira volatility >35% YoY",
      "Lack of formal USD hedging instruments for SMEs",
      "Treasury-as-a-service is greenfield in the region",
    ],
  },
  {
    segment: "Embedded crypto in fintech apps",
    description:
      "Neobanks and PSPs offering buy/sell/hold via white-label exchange APIs (Quidax-as-a-Service).",
    tamUsd: 2_800_000_000,
    capturePctLow: 1.5,
    capturePctHigh: 6.0,
    takeRateBps: 60,
    signals: [
      "10+ Nigerian fintechs publicly exploring crypto features",
      "Build-vs-buy strongly favors buy due to licensing burden",
      "Quidax is the only locally-licensed API provider at this depth",
    ],
  },
]

export type Recommendation = {
  title: string
  thesis: string
  priority: "P0" | "P1" | "P2"
  ownerHint: string
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    title: "Productize 'Quidax Treasury API' for fintech CFOs",
    thesis:
      "Separate the B2B treasury SKU from the generic exchange API. Add multi-account ledgers, programmatic NGN/USDT sweeps, and a CFO-grade reporting endpoint. This is the highest-leverage wedge into the embedded-crypto segment.",
    priority: "P0",
    ownerHint: "Product + B2B GTM",
  },
  {
    title: "Publish a public Liquidity & Spread SLA",
    thesis:
      "B2B buyers (especially regulated ones) need predictability. A public, monitored SLA for USDT/NGN spread and depth would be a structural moat versus Yellow Card and Busha, neither of which expose this.",
    priority: "P0",
    ownerHint: "Engineering + Trading",
  },
  {
    title: "Corridor playbooks: NG→CN, NG→AE, NG→IN",
    thesis:
      "Ship documented reference implementations for the three corridors where stablecoin B2B settlement is already winning. Bundle sandbox keys, sample code, and a compliance starter kit. Lowers integration cost for fintech buyers from weeks to days.",
    priority: "P1",
    ownerHint: "DevRel + Compliance",
  },
  {
    title: "VASP regulatory reporting pipeline",
    thesis:
      "SEC Nigeria's VASP regime will require structured transaction reporting. Build the pipeline once, expose it as a paid add-on, and license it back to the same fintechs using your API. Turns a compliance cost center into a revenue line.",
    priority: "P1",
    ownerHint: "Data + Compliance",
  },
  {
    title: "Open public market data terminal",
    thesis:
      "A public, no-auth read-only market terminal (this project is a prototype) functions as continuous marketing for the API and as a recruiting flywheel. Cheap to run; compounds credibility.",
    priority: "P2",
    ownerHint: "Marketing + Data",
  },
]

/**
 * Stablecoin demand mix — analyst estimate of how local NGN volume splits.
 * Used in the stablecoin deep-dive chart.
 */
export const STABLECOIN_MIX = [
  { name: "USDT", share: 68, color: "var(--chart-1)" },
  { name: "cNGN (regulated)", share: 9, color: "var(--chart-4)" },
  { name: "USDC", share: 12, color: "var(--chart-2)" },
  { name: "Other stables", share: 4, color: "var(--chart-3)" },
  { name: "BTC (as quasi-savings)", share: 7, color: "var(--chart-5)" },
]

/**
 * Stablecoin premium vs. official CBN FX, last 12 weeks — analyst estimate.
 * Demonstrates the structural FX gap that drives B2B substitution demand.
 */
export const NGN_USDT_PREMIUM = (() => {
  // deterministic synthetic series
  const out: { week: string; premiumPct: number; officialFx: number; usdtFx: number }[] = []
  const officialBase = 1545
  const usdtBase = 1685
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i * 7)
    const w = d.toISOString().slice(5, 10)
    const drift = Math.sin(i / 2.4) * 18
    const official = officialBase + (11 - i) * 3 + drift * 0.4
    const usdt = usdtBase + (11 - i) * 4 + drift
    out.push({
      week: w,
      officialFx: Math.round(official),
      usdtFx: Math.round(usdt),
      premiumPct: Number((((usdt - official) / official) * 100).toFixed(2)),
    })
  }
  return out
})()
