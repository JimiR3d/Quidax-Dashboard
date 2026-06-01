/**
 * Hand-curated competitive & opportunity data.
 *
 * Every row carries:
 *   - `sources[]`    — at least one URL/citation per row
 *   - `verifiedAt`   — YYYY-MM-DD of last manual verification
 *   - `confidence`   — "high" | "med" | "low" — analyst's own honesty signal
 *
 * Treat as a model, not a forecast. The methodology page surfaces this
 * provenance to the reader; do NOT remove the `sources` field from any row.
 */

export type Provenance = {
  sources: Array<{ label: string; url?: string; note?: string }>
  verifiedAt: string // ISO date
  confidence: "Verified" | "Estimated / Proxy" | "Derived / Analyst estimate" | "Company-announced" | "Certificate of Entry" | "SEC-provisional" | "Snapshot Input" | "high" | "med" | "low"
}

export type Competitor = {
  name: string
  positioning: string
  b2bApi: "yes" | "limited" | "no"
  verifiedNgnMarkets: number | string
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
    verifiedNgnMarkets: 9, // Verified live from /api/v1/markets/tickers (9 active NGN pairs, 49 total active pairs across all markets)
    ngnFocus: "core",
    africaCountries: 4,
    stablecoinFocus: "high",
    secLicensed: "yes",
    notableEdge:
      "Listed cNGN on March 12, 2025 (per Quidax corporate blog), five weeks after Busha's February 3 debut (per TechCabal); deepest USDT/NGN order book among Nigerian players",
    provenance: {
      sources: [
        { label: "Quidax — Markets API (live ticker count)", url: "https://app.quidax.io/api/v1/markets" },
        { label: "Quidax — Business page (B2B customers, API)", url: "https://quidax.com" },
        { label: "Quidax — SEC Nigeria provisional VASP licence (public statements)" },
      ],
      verifiedAt: "2026-06-01",
      confidence: "high",
    },
  },
  {
    name: "Yellow Card",
    positioning: "B2B-only stablecoin infrastructure (retail discontinued January 1, 2026)",
    b2bApi: "yes",
    verifiedNgnMarkets: 0, // Retail trading fully discontinued; app deactivated; users required to withdraw by Dec 31, 2025
    ngnFocus: "none",
    africaCountries: 20, // verified directly from yellowcard.io/about
    stablecoinFocus: "high",
    secLicensed: "no", // Dec 2023: obtained Certificate of Entry into the Register of Business within Virtual Currencies — NOT a provisional licence equivalent to Busha/Quidax ARIP approval
    notableEdge:
      "Pan-African B2B stablecoin infrastructure; deep enterprise GTM across 20 African markets. Discontinued all retail trading as of January 1, 2026 (app deactivated, users required to withdraw funds by Dec 31, 2025). Holds a December 2023 Certificate of Entry into the Register of Business within Virtual Currencies — not a full SEC provisional licence equivalent to Busha or Quidax.",
    provenance: {
      sources: [
        { label: "yellowcard.io / about (countries served)", url: "https://yellowcard.io" },
        {
          label: "Yellow Card retail discontinuation",
          note: "Yellow Card discontinued all retail trading, deactivated its app, and required users to withdraw funds before December 31, 2025. As of January 1, 2026, it operates exclusively as B2B stablecoin infrastructure.",
        },
        {
          label: "SEC Nigeria — Certificate of Entry (Dec 2023)",
          note: "Yellow Card obtained a Certificate of Entry into the Register of Business within Virtual Currencies in December 2023. This is a different regulatory instrument from the provisional VASP/DAX licences granted to Busha and Quidax under the August 2024 ARIP cohort.",
        },
      ],
      verifiedAt: "2026-06-01",
      confidence: "Company-announced",
    },
  },
  {
    name: "Busha",
    positioning: "Retail-first SEC-licensed Nigerian exchange",
    b2bApi: "yes",
    verifiedNgnMarkets: "16*", // Note: Busha lists several assets, but the UI does not explicitly break down NGN-specific order books from global pairs. NGN market depth parity is an estimate based on supported assets.
    ngnFocus: "core",
    africaCountries: 1,
    stablecoinFocus: "medium",
    secLicensed: "yes",
    notableEdge:
      "Strong retail UX, SEC-licensed alongside Quidax, recurring-buy and USD-card features. Busha Business offers full B2B infrastructure: stablecoin on/off-ramp APIs, treasury management, OTC desk, and developer APIs.",
    provenance: {
      sources: [
        { label: "busha.io — public listings", url: "https://busha.io" },
        {
          label: "SEC Nigeria — VASP licensees",
          note: "Busha named in SEC Nigeria's August 2024 ARIP cohort of provisionally-approved digital asset operators (DAX/VASP), alongside Quidax.",
        },
      ],
      verifiedAt: "2026-06-01",
      confidence: "SEC-provisional",
    },
  },
  {
    name: "Luno",
    positioning: "Retail exchange (Singapore-owned, Pan-African + global)",
    b2bApi: "no",
    verifiedNgnMarkets: 14, // verified manually against luno.com API tickers
    ngnFocus: "secondary",
    africaCountries: 3, // Nigeria, South Africa, Kenya (re-entered 2025; dropped Zambia/Uganda)
    stablecoinFocus: "low",
    secLicensed: "unknown", // Public status is unclear. Reports from early 2024 indicated application to SEC, but no ARIP confirmation
    notableEdge:
      "Trusted retail brand expanding into staking and tokenized US stocks. Operates in 3 African markets (Nigeria, South Africa, Kenya); no NGN-native B2B API. Regulated and active in Nigeria, but exact SEC VASP status is unknown.",
    provenance: {
      sources: [
        {
          label: "luno.com/en/countries (African countries served)",
          url: "https://www.luno.com/en/countries",
          note: "Luno serves 3 African markets: Nigeria, South Africa, and Kenya (re-entered 2025). Regulated and active, but not in the August 2024 ARIP cohort.",
        },
        {
          label: "SEC Nigeria — ARIP Cohort",
          note: "Luno's exact SEC Nigeria status is unknown. Reports from early 2024 indicated they were in discussions, but they were not publicly named in the August 2024 ARIP cohort of approved VASPs.",
        },
      ],
      verifiedAt: "2026-06-01",
      confidence: "Verified",
    },
  },
  {
    name: "Roqqu",
    positioning: "Retail exchange + virtual cards",
    b2bApi: "no",
    verifiedNgnMarkets: 10, // verified manually against roqqu.com markets page
    ngnFocus: "core",
    africaCountries: 5, // Nigeria + Kenya (via verified Flitaa acquisition July 2025), Ghana, Uganda, Tanzania
    stablecoinFocus: "medium",
    secLicensed: "unknown",
    notableEdge:
      "USD virtual cards, futures trading (launched 2025), EU-licensed via Lithuania. Expanded into East Africa via verified Flitaa acquisition (July 2025, first intra-African crypto M&A).",
    provenance: {
      sources: [
        { label: "roqqu.com — public listings", url: "https://roqqu.com" },
        { label: "Daba Finance — Roqqu acquires Flitaa (July 2025)", url: "https://dabafinance.com/en/news/roqqu-flitaa-acquisition-crypto-expansion-east-africa" },
      ],
      verifiedAt: "2026-06-01",
      confidence: "med",
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
    notable: "B2B cross-border payments using stablecoin rails; corridor-agnostic API. (Fee structure: typically percentage-based volume fees rather than flat dollar network/withdrawal fees).",
    link: "https://conduit.financial",
    verifiedAt: "2026-06-01",
  },
  {
    name: "Bitnob",
    type: "Crypto-native PSP",
    notable: "Africa-first Bitcoin/stablecoin business and remittance API; strong NG developer mindshare. Actively partnered with Strike for cross-border US-Africa Lightning/stablecoin settlements.",
    link: "https://bitnob.com",
    verifiedAt: "2026-06-01",
  },
  {
    name: "Stables",
    type: "Treasury platform",
    notable: "USD-stablecoin treasury account with virtual card issuance; appeals to SME treasurers. Strategic partnerships with Mastercard and Circle for global card processing.",
    link: "https://stables.money",
    verifiedAt: "2026-06-01",
  },
  {
    name: "Yellow Card OTC",
    type: "OTC rail",
    notable: "Counted separately from the exchange matrix: enterprise OTC is the real adjacent buyer. Deep liquidity network powered by API integrations and enterprise partnerships across 20 African nations.",
    link: "https://yellowcard.io",
    verifiedAt: "2026-06-01",
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
    tamUsd: 10_000_000_000,
    capturePctLow: 0.3,
    capturePctHigh: 1.2,
    takeRateBps: 35,
    marginPctDefault: 55,
    signals: [
      "Banking corridors to CN/AE still settle in 3–5 business days",
      "Stablecoin settlement now cheaper AND faster. Case no longer depends on arbitrage",
      "Yellow Card and Conduit already monetizing this flow",
    ],
    provenance: {
      sources: [
        {
          label: "NBS — Nigeria Foreign Trade Statistics",
          url: "https://nigerianstat.gov.ng/",
          note: "Annualised import flows to CN+AE+IN (NBS 2025). TAM ceiling, not all eligible for stablecoin rails today.",
        },
        { 
          label: "Chainalysis — 2024 Sub-Saharan Africa report",
          url: "https://www.chainalysis.com/blog/sub-saharan-africa-crypto-adoption/"
        },
      ],
      verifiedAt: "2026-06-01",
      confidence: "Derived / Analyst estimate",
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
      "Distinct sales motion from SME settlement. Enterprise procurement, longer cycles",
      "Few licensed alternatives in NG with depth + reporting pipeline",
    ],
    provenance: {
      sources: [{ 
        label: "CBN — Balance of Payments releases",
        url: "https://www.cbn.gov.ng/documents/bop.asp"
      }],
      verifiedAt: "2026-06-01",
      confidence: "Derived / Analyst estimate",
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
      "World Bank: Nigeria is #1 SSA remittance recipient (official ~$20–22B in 2025; estimated true volume including informal and crypto channels likely exceeds $23B)",
      "Sendwave, LemFi, Grey already partnering with on-chain liquidity providers",
      "CBN allowance for licensed VASPs improves legitimacy",
    ],
    provenance: {
      sources: [
        {
          label: "World Bank — Migration & Remittances brief (Nigeria inbound)",
          url: "https://www.worldbank.org/en/topic/migrationremittancesdiasporaissues/brief/migration-remittances-data",
          note: "Official World Bank figure approximately $20–22B in 2025; estimated true volume including informal and crypto channels likely exceeds $23B. The addressable B2B-liquidity slice is much smaller, hence the de-rated TAM.",
        },
      ],
      verifiedAt: "2026-06-01",
      confidence: "Derived / Analyst estimate",
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
      "Naira volatility spiked above 40% post-unification during peak devaluation waves and has compressed significantly by mid-2026",
      "No formal USD hedging instruments available to most Nigerian SMEs",
      "Treasury-as-a-service is greenfield in the region. cNGN gives Quidax a regulated lever",
    ],
    provenance: {
      sources: [{ label: "CBN — exchange-rate volatility series; analyst spread observations", note: "TAM is a speculative model output based on typical corporate asset allocations and observed fintech treasury behavior, not hard public census data." }],
      verifiedAt: "2026-06-01",
      confidence: "Derived / Analyst estimate",
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
      "10+ Nigerian fintechs publicly exploring crypto features — including Paga (Sui blockchain partnership), Zone (layer-1 interbank settlement), Busha, Quidax, Yellow Card, Roqqu, Luno, and Monica.cash",
      "Build-vs-buy strongly favours buy due to licensing burden",
      "Quidax and Busha are the only locally-licensed API providers at this depth; build-vs-buy favours buy",
    ],
    provenance: {
      sources: [{ label: "Analyst observation of fintech product roadmaps", note: "TAM is a speculative projection based on product roadmap tracking and build-vs-buy analysis, not a public dataset." }],
      verifiedAt: "2026-06-01",
      confidence: "Derived / Analyst estimate",
    },
  },
]

/**
 * Note on TAM disjointness:
 *   - "Cross-border B2B settlement (SME / fintech)" and "Corporate / PSP payout treasury"
 *     are split by buyer type and do not double-count.
 *   - "Remittance corridors" counts ONLY the wholesale liquidity-provider slice,
 *     deliberately de-rated from the headline $20–22B WB number, so it does not
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
    title: "Launch a dedicated Treasury API",
    thesis:
      "Right now, the Quidax API looks like a standard exchange API. Packaging a dedicated 'Treasury' version—think multi-account ledgers, automated NGN to USDT sweeps, and clean CFO-level reporting—speaks directly to the people controlling the big money, not just the developers building the apps.",
    priority: "P0",
    ownerHint: "Product + B2B GTM",
    visibilityCaveat:
      "Based on what is publicly observable on quidax.io; the team may already be building this internally.",
  },
  {
    title: "Show off our Liquidity and Spread publicly",
    thesis:
      "Big businesses want predictability before they move billions. Publishing a live, publicly tracked dashboard showing our USDT/NGN spread and order book depth would be a massive flex that competitors like Yellow Card and Busha simply aren't doing.",
    priority: "P0",
    ownerHint: "Engineering + Trading",
    visibilityCaveat: "No public SLA found as of May 2026.",
  },
  {
    title: "Ready-to-use Corridor Playbooks (NG→CN, NG→AE)",
    thesis:
      "Imagine handing fintechs a complete starter pack for the exact routes where stablecoins are already beating bank wires. Bundle some sample code, sandbox keys, and a compliance guide, and they can go live in days instead of weeks. Easy money. 🚀",
    priority: "P1",
    ownerHint: "DevRel + Compliance",
  },
  {
    title: "Turn SEC VASP reporting into a paid feature",
    thesis:
      "The new SEC rules mean everyone needs heavy transaction reporting. If we build that reporting pipeline once, we can package it up and sell it back to the fintechs already using our API. We flip a boring compliance cost right into a fresh revenue stream. 💸",
    priority: "P1",
    ownerHint: "Data + Compliance",
  },
  {
    title: "A free, public market-data terminal",
    thesis:
      "A clean, no-login dashboard (exactly like this one!) works as 24/7 marketing for our API and acts as a massive flex to recruit top engineering talent. It's super cheap to run and constantly builds trust in the market.",
    priority: "P2",
    ownerHint: "Marketing + Data",
  },
]

/**
 * Stablecoin demand mix — ANALYST ESTIMATE of how local NGN demand splits by
 * PURPOSE. Calibrated against Chainalysis SSA reports and TRM Labs data, but
 * the exact percentage split is NOT a directly measured figure. This is
 * explicitly NOT a 24h turnover ratio; it does not corroborate the on-exchange
 * "stablecoin share of turnover" KPI computed live from tickers. The two are
 * framed as separate metrics on the dashboard.
 *
 * cNGN is issued by the African Stablecoin Consortium (ASC) under SEC ARIP oversight.
 * Global stablecoin market cap approximately $321B as of April 2026.
 * Stablecoins account for approximately 75% of global crypto trading volume (per CoinMarketCap).
 */
export const STABLECOIN_MIX = [
  { name: "USDT", share: 66, color: "var(--chart-1)" },
  { name: "cNGN (regulated)", share: 8, color: "var(--chart-4)" },
  { name: "USDC", share: 12, color: "var(--chart-2)" },
  { name: "Other stables", share: 4, color: "var(--chart-3)" },
  { name: "BTC (as quasi-savings)", share: 7, color: "var(--chart-5)" },
  { name: "Unattributed", share: 3, color: "var(--muted-foreground)" },
]
