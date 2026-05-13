/**
 * Hand-curated competitive & opportunity data.
 *
 * Every row carries:
 *   - `sources[]`    — at least one URL/citation captured at audit time
 *   - `verifiedAt`   — YYYY-MM-DD of last manual verification
 *   - `confidence`   — "high" | "med" | "low" — analyst's own honesty signal
 *
 * Treat as a model, not a forecast. The methodology page surfaces this
 * provenance to the reader; do NOT remove the `sources` field from any row.
 */

export type Provenance = {
  sources: Array<{ label: string; url?: string; note?: string }>
  verifiedAt: string // ISO date
  confidence: "high" | "med" | "low"
}

export type Competitor = {
  name: string
  positioning: string
  b2bApi: "yes" | "limited" | "no"
  ngnPairs: number
  ngnFocus: "core" | "secondary" | "none"
  africaCountries: number
  stablecoinFocus: "high" | "medium" | "low"
  /** Holds a Nigerian SEC VASP-class licence or comparable local authorisation. */
  secLicensed: "yes" | "applying" | "no" | "unknown"
  notableEdge: string
  provenance: Provenance
}

export const COMPETITORS: Competitor[] = [
  {
    name: "Quidax",
    positioning: "NGN-native exchange + API for African fintechs",
    b2bApi: "yes",
    ngnPairs: 9, // verified live from /api/markets at audit time
    ngnFocus: "core",
    africaCountries: 4,
    stablecoinFocus: "high",
    secLicensed: "yes",
    notableEdge:
      "Only local exchange listing cNGN (regulated naira stablecoin); deepest USDT/NGN order book among Nigerian players",
    provenance: {
      sources: [
        { label: "Quidax — Markets API (live ticker count)", url: "https://app.quidax.io/api/v1/markets" },
        { label: "Quidax — Business page (B2B customers, API)", url: "https://quidax.com/business" },
        { label: "Quidax — SEC Nigeria provisional VASP licence (public statements)" },
      ],
      verifiedAt: "2026-05-12",
      confidence: "high",
    },
  },
  {
    name: "Yellow Card",
    positioning: "B2B-only stablecoin payments & treasury infrastructure",
    b2bApi: "yes",
    ngnPairs: 0, // OTC/portal model; no exchange-style NGN spot book
    ngnFocus: "secondary",
    africaCountries: 20, // verified directly from yellowcard.io/about (2026-05-12); previous "35+" was outdated
    stablecoinFocus: "high",
    secLicensed: "no", // Yellow Card Nigeria exited retail; runs on partner-bank pipes
    notableEdge:
      "Pan-African OTC + treasury portal; deep enterprise GTM. Light NGN-spot depth — they do not run a public exchange order book.",
    provenance: {
      sources: [
        { label: "yellowcard.io / about (countries served)", url: "https://yellowcard.io" },
        {
          label: "Yellow Card B2B / retail pivot",
          note: "Yellow Card publicly announced its B2B-focused repositioning in 2024 and wound down its retail wallet for Nigerian users in early 2025.",
        },
      ],
      verifiedAt: "2026-05-12",
      confidence: "med",
    },
  },
  {
    name: "Busha",
    positioning: "Retail-first SEC-licensed Nigerian exchange",
    b2bApi: "limited",
    ngnPairs: 16, // verified manually against busha.co listings page
    ngnFocus: "core",
    africaCountries: 1,
    stablecoinFocus: "medium",
    secLicensed: "yes",
    notableEdge:
      "Strong retail UX, SEC-licensed alongside Quidax, recurring-buy and USD-card features. No publicly documented B2B API.",
    provenance: {
      sources: [
        { label: "busha.co — public listings", url: "https://busha.co" },
        {
          label: "SEC Nigeria — VASP licensees",
          note: "Busha named in SEC Nigeria's 2024 cohort of provisionally-approved digital asset operators (DAX/VASP), alongside Quidax.",
        },
      ],
      verifiedAt: "2026-05-12",
      confidence: "med",
    },
  },
  {
    name: "Luno",
    positioning: "Retail exchange (Singapore-owned, Pan-African + global)",
    b2bApi: "no",
    ngnPairs: 4, // verified manually against luno.com Nigeria listings
    ngnFocus: "secondary",
    africaCountries: 4, // South Africa, Nigeria, Uganda, Zambia (Luno markets page)
    stablecoinFocus: "low",
    secLicensed: "no",
    notableEdge:
      "Trusted retail brand with conservative product surface. Operates in 4 African + several non-African markets; no NGN-native B2B API.",
    provenance: {
      sources: [
        {
          label: "luno.com/en/countries (African countries served)",
          url: "https://www.luno.com/en/countries",
          note: "Previous 5-country count in this dashboard was incorrect; corrected to 4 after re-verification.",
        },
      ],
      verifiedAt: "2026-05-12",
      confidence: "med",
    },
  },
  {
    name: "Roqqu",
    positioning: "Retail exchange + virtual cards",
    b2bApi: "no",
    ngnPairs: 10, // verified manually against roqqu.com markets page
    ngnFocus: "core",
    africaCountries: 2,
    stablecoinFocus: "medium",
    secLicensed: "unknown",
    notableEdge:
      "USD virtual cards; weaker liquidity depth on majors; limited public B2B surface.",
    provenance: {
      sources: [{ label: "roqqu.com — public listings", url: "https://roqqu.com" }],
      verifiedAt: "2026-05-12",
      confidence: "low",
    },
  },
]

/**
 * Non-exchange B2B stablecoin rails that compete with Quidax-as-an-API.
 * These are the names a fintech CTO will compare you to in the same RFP,
 * even though they are not retail exchanges.
 */
export type B2BCompetitor = {
  name: string
  type: "OTC rail" | "Stablecoin orchestrator" | "Crypto-native PSP" | "Treasury platform"
  notable: string
  link?: string
  verifiedAt: string
}

export const B2B_ONLY_COMPETITORS: B2BCompetitor[] = [
  {
    name: "Conduit",
    type: "Stablecoin orchestrator",
    notable: "B2B cross-border payments using stablecoin rails; corridor-agnostic API.",
    link: "https://conduit.financial",
    verifiedAt: "2026-05-12",
  },
  {
    name: "Bitnob",
    type: "Crypto-native PSP",
    notable: "Africa-first Bitcoin/stablecoin business and remittance API; strong NG developer mindshare.",
    link: "https://bitnob.com",
    verifiedAt: "2026-05-12",
  },
  {
    name: "Stables",
    type: "Treasury platform",
    notable: "USD-stablecoin treasury account with virtual card issuance; appeals to SME treasurers.",
    link: "https://stables.money",
    verifiedAt: "2026-05-12",
  },
  {
    name: "Yellow Card OTC",
    type: "OTC rail",
    notable: "Counted separately from the exchange matrix: enterprise OTC is the real adjacent buyer.",
    link: "https://yellowcard.io",
    verifiedAt: "2026-05-12",
  },
]

export type B2BSegment = {
  segment: string
  description: string
  /** Annual TAM proxy in USD (analyst estimate). */
  tamUsd: number
  /** Realistic share Quidax could capture in 24 months. */
  capturePctLow: number
  capturePctHigh: number
  /** Revenue take rate (bps) applied to captured flow. */
  takeRateBps: number
  /** Default fully-loaded gross-margin contribution — used in the counter-thesis layer. */
  marginPctDefault: number
  signals: string[]
  provenance: Provenance
}

export const B2B_SEGMENTS: B2BSegment[] = [
  {
    segment: "Cross-border B2B settlement (SME / fintech)",
    description:
      "Mid-market fintechs and SMEs settling supplier invoices into China, UAE, India via stablecoin rails instead of correspondent banking.",
    tamUsd: 12_000_000_000,
    capturePctLow: 0.3,
    capturePctHigh: 1.2,
    takeRateBps: 35,
    marginPctDefault: 55,
    signals: [
      "Banking corridors to CN/AE still settle in 3–5 business days",
      "Stablecoin settlement now cheaper AND faster — case no longer depends on arbitrage",
      "Yellow Card and Conduit already monetizing this flow",
    ],
    provenance: {
      sources: [
        {
          label: "NBS — Nigeria Foreign Trade Statistics",
          note: "Annualised import flows to CN+AE+IN, FOB, taken as a TAM ceiling — not all eligible for stablecoin rails today.",
        },
        { label: "Chainalysis — 2024 Sub-Saharan Africa report" },
      ],
      verifiedAt: "2026-05-12",
      confidence: "low",
    },
  },
  {
    segment: "Corporate / PSP payout treasury",
    description:
      "Licensed Nigerian businesses (PSPs, merchant acquirers, large corporates) running cross-border payouts and FX hedging through an API.",
    tamUsd: 6_500_000_000,
    capturePctLow: 0.2,
    capturePctHigh: 1.0,
    takeRateBps: 28,
    marginPctDefault: 60,
    signals: [
      "PSPs face strict CBN BoP-reporting requirements that a licensed exchange can absorb",
      "Distinct sales motion from SME settlement — enterprise procurement, longer cycles",
      "Few licensed alternatives in NG with depth + reporting pipeline",
    ],
    provenance: {
      sources: [{ label: "CBN — Balance of Payments releases" }],
      verifiedAt: "2026-05-12",
      confidence: "low",
    },
  },
  {
    segment: "Remittance corridors (inbound, B2B side only)",
    description:
      "Stablecoin liquidity provisioning to licensed MTOs and remittance fintechs serving the Nigeria-inbound diaspora flow. We count only the wholesale (B2B liquidity) leg, not the retail recipient leg.",
    tamUsd: 4_500_000_000,
    capturePctLow: 0.2,
    capturePctHigh: 0.8,
    takeRateBps: 18,
    marginPctDefault: 50,
    signals: [
      "World Bank: Nigeria is #1 SSA remittance recipient (~$20B headline)",
      "Sendwave, LemFi, Grey already partnering with on-chain liquidity providers",
      "CBN allowance for licensed VASPs improves legitimacy",
    ],
    provenance: {
      sources: [
        {
          label: "World Bank — Migration & Remittances brief (Nigeria inbound)",
          note: "Headline ~$20B is retail remittance flow; the addressable B2B-liquidity slice is much smaller, hence the de-rated TAM.",
        },
      ],
      verifiedAt: "2026-05-12",
      confidence: "low",
    },
  },
  {
    segment: "Fintech treasury & FX hedging",
    description:
      "Nigerian fintechs and exporters holding USD-exposure via USDT to manage naira volatility.",
    tamUsd: 4_200_000_000,
    capturePctLow: 0.8,
    capturePctHigh: 3.0,
    takeRateBps: 18,
    marginPctDefault: 65,
    signals: [
      "Naira realised volatility still 18–25% annualised post-unification",
      "No formal USD hedging instruments available to most Nigerian SMEs",
      "Treasury-as-a-service is greenfield in the region — cNGN gives Quidax a regulated lever",
    ],
    provenance: {
      sources: [{ label: "CBN — exchange-rate volatility series; analyst spread observations" }],
      verifiedAt: "2026-05-12",
      confidence: "low",
    },
  },
  {
    segment: "Embedded crypto in fintech apps",
    description:
      "Neobanks and PSPs offering buy/sell/hold via white-label exchange APIs (Quidax-as-a-Service).",
    tamUsd: 2_800_000_000,
    capturePctLow: 1.5,
    capturePctHigh: 6.0,
    takeRateBps: 60,
    marginPctDefault: 70,
    signals: [
      "10+ Nigerian fintechs publicly exploring crypto features",
      "Build-vs-buy strongly favours buy due to licensing burden",
      "Quidax is the only locally-licensed API provider at this depth",
    ],
    provenance: {
      sources: [{ label: "Analyst observation of fintech product roadmaps" }],
      verifiedAt: "2026-05-12",
      confidence: "low",
    },
  },
]

/**
 * Note on TAM disjointness:
 *   - "Cross-border B2B settlement (SME / fintech)" and "Corporate / PSP payout treasury"
 *     are split by buyer type and do not double-count.
 *   - "Remittance corridors" counts ONLY the wholesale liquidity-provider slice,
 *     deliberately de-rated from the headline $20B WB number, so it does not
 *     double-count with the B2B settlement segments.
 *   - "Fintech treasury" and "Embedded crypto" are about the same buyer (a
 *     Nigerian fintech) but distinct revenue lines (treasury margin vs API fee).
 *     The B2B model treats them additively — see methodology page.
 */

export type Recommendation = {
  title: string
  thesis: string
  priority: "P0" | "P1" | "P2"
  ownerHint: string
  /**
   * Honest framing: most "recommendations" are observations about what is
   * PUBLICLY VISIBLE today. Quidax may already have any of these internally.
   */
  visibilityCaveat?: string
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    title: "Make the Treasury API a first-class public SKU",
    thesis:
      "Quidax's API is currently positioned as a generic exchange API. Spinning out an explicit Treasury SKU (multi-account ledgers, programmatic NGN/USDT sweeps, CFO-grade reporting) targets a different buyer (CFOs / treasurers) with different willingness-to-pay than fintech CTOs.",
    priority: "P0",
    ownerHint: "Product + B2B GTM",
    visibilityCaveat:
      "Based on what is publicly observable on quidax.com/business; the team may already be building this internally.",
  },
  {
    title: "Publish a public Liquidity & Spread SLA",
    thesis:
      "B2B buyers (especially regulated ones) need predictability. A public, monitored SLA for USDT/NGN spread and depth would be a structural moat versus Yellow Card and Busha, neither of which expose this.",
    priority: "P0",
    ownerHint: "Engineering + Trading",
    visibilityCaveat: "No public SLA found at time of audit (2026-05-12).",
  },
  {
    title: "Corridor playbooks: NG→CN, NG→AE, NG→IN",
    thesis:
      "Documented reference implementations for the three corridors where stablecoin B2B settlement is already winning. Bundle sandbox keys, sample code, compliance starter kit. Lowers integration cost for fintech buyers from weeks to days.",
    priority: "P1",
    ownerHint: "DevRel + Compliance",
  },
  {
    title: "VASP regulatory reporting pipeline as a paid add-on",
    thesis:
      "SEC Nigeria's VASP regime will require structured transaction reporting. Build the pipeline once, expose it as a paid add-on, license it back to the same fintechs using your API. Turns a compliance cost-center into a revenue line.",
    priority: "P1",
    ownerHint: "Data + Compliance",
  },
  {
    title: "Open public market-data terminal",
    thesis:
      "A public, no-auth read-only market terminal (this project is a prototype) functions as continuous marketing for the API and as a recruiting flywheel. Cheap to run; compounds credibility.",
    priority: "P2",
    ownerHint: "Marketing + Data",
  },
]

/**
 * Stablecoin demand mix — analyst estimate of how local NGN demand splits by
 * PURPOSE. This is explicitly NOT a 24h turnover ratio; it does not corroborate
 * the on-exchange "stablecoin share of turnover" KPI computed live from tickers.
 * The two are framed as separate metrics on the dashboard.
 */
export const STABLECOIN_MIX = [
  { name: "USDT", share: 66, color: "var(--chart-1)" },
  { name: "cNGN (regulated)", share: 8, color: "var(--chart-4)" },
  { name: "USDC", share: 12, color: "var(--chart-2)" },
  { name: "Other stables", share: 4, color: "var(--chart-3)" },
  { name: "BTC (as quasi-savings)", share: 7, color: "var(--chart-5)" },
  { name: "Unattributed", share: 3, color: "var(--muted-foreground)" },
]
