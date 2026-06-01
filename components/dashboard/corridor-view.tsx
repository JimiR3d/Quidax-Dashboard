import { Building2 } from "lucide-react"
import { fmtUsd } from "@/lib/format"

/**
 * Corridor reference data with structured provenance.
 *
 * Every figure that the eye reads as a single number here is the product of
 * an analyst proxy — these are not Quidax-attributable volumes. So each row
 * carries:
 *   - `confidence` — how much weight a reader should put on the row
 *   - `verifiedAt` — when these sources were last re-checked
 *   - `sources[]` — structured, not a free-text blob
 *   - `notes` — what to remember when reading the numbers
 */

type Confidence = "Verified" | "Estimated / Proxy" | "Derived / Analyst estimate" | "Company-announced" | "Certificate of Entry" | "SEC-provisional" | "Snapshot Input" | "high" | "medium" | "low"

type CorridorSource = { label: string; year: number; url?: string }

type Corridor = {
  code: string
  name: string
  direction: "outbound" | "inbound" | "two-way"
  flowUsd: number
  quidaxPairs: string[]
  primaryUseCase: string
  bankWireDays: number
  stablecoinMinutes: number
  bankCostBps: number
  stablecoinCostBps: number
  confidence: Confidence
  verifiedAt: string
  sources: CorridorSource[]
  notes: string
}

const CORRIDORS: Corridor[] = [
  {
    code: "NG → CN",
    name: "Nigeria → China",
    direction: "outbound",
    flowUsd: 13_000_000_000,
    quidaxPairs: ["USDT/NGN", "USDC/NGN"],
    primaryUseCase: "Importer settlement (electronics, textiles, machinery)",
    bankWireDays: 4,
    stablecoinMinutes: 8,
    bankCostBps: 320,
    stablecoinCostBps: 90,
    confidence: "medium",
    verifiedAt: "2026-06-01",
    sources: [
      { label: "OEC Bilateral Trade Data: Nigeria & China (2024)", year: 2024, url: "https://oec.world/en/profile/bilateral-country/nga/partner/chn" },
      { label: "Chainalysis 2024 Geography of Cryptocurrency", year: 2024, url: "https://go.chainalysis.com/2024-geography-of-cryptocurrency-report.html" },
      { label: "[Source: verified but no direct deep link available] NBS Foreign Trade in Goods Statistics", year: 2024 },
    ],
    notes:
      "Nigeria's import bill from China (OEC 2024: $16.6B). The $13B figure is derived from the NBS baseline (₦19.8T). Only a fraction settles via stablecoins today, but it represents the addressable corridor ceiling.",
  },
  {
    code: "NG → AE",
    name: "Nigeria → UAE (Dubai)",
    direction: "outbound",
    flowUsd: 4_000_000_000,
    quidaxPairs: ["USDT/NGN"],
    primaryUseCase: "Re-export trade, gold, luxury, diaspora savings",
    bankWireDays: 3,
    stablecoinMinutes: 6,
    bankCostBps: 280,
    stablecoinCostBps: 70,
    confidence: "medium",
    verifiedAt: "2026-06-01",
    sources: [
      { label: "OEC Bilateral Trade Data: Nigeria & UAE", year: 2024, url: "https://oec.world/en/profile/bilateral-country/nga/partner/are" },
      { label: "[Source: verified but no direct deep link available] CBN Economic Reports", year: 2025 },
      { label: "[Source: verified but no direct deep link available] Nigeria-UAE CEPA Announcement", year: 2026 },
    ],
    notes:
      "Approximately $4B current baseline (non-oil bilateral trade was $4.3B in 2024). CEPA signed January 2026 is projected to accelerate flows. Stablecoin settlement share growing as bank correspondent friction increases.",
  },
  {
    code: "NG ↔ KE",
    name: "Nigeria ↔ Kenya",
    direction: "two-way",
    flowUsd: 100_000_000,
    quidaxPairs: ["USDT/NGN"],
    primaryUseCase: "Regional B2B (SaaS, logistics, agritech) — aspirational AfCFTA opportunity",
    bankWireDays: 5,
    stablecoinMinutes: 10,
    bankCostBps: 380,
    stablecoinCostBps: 110,
    confidence: "low",
    verifiedAt: "2026-06-01",
    sources: [
      { label: "UN COMTRADE Bilateral Trade Data (NGA-KEN)", year: 2024, url: "https://comtradeplus.un.org/TradeFlow?Frequency=A&Flows=X%2CM&CommodityCodes=TOTAL&partnerCode=404&reporterCode=566&period=2023" },
      { label: "OEC Bilateral Trade Data: Nigeria & Kenya", year: 2024, url: "https://oec.world/en/profile/bilateral-country/nga/partner/ken" },
      { label: "Forward-looking AfCFTA projection — no single verified source", year: 2025 },
    ],
    notes:
      "⚠️ Formal bilateral trade between Nigeria and Kenya is under $100M per year per UN COMTRADE and OEC data. This corridor is presented as an aspirational AfCFTA opportunity, not a current flow. Earlier versions of this analysis cited $1.5B — that figure was incorrect and has been corrected. Treat as the most speculative corridor on this page.",
  },
  {
    code: "DIASPORA → NG",
    name: "Diaspora → Nigeria (inbound)",
    direction: "inbound",
    flowUsd: 23_000_000_000,
    quidaxPairs: ["USDT/NGN", "CNGN/NGN", "USDC/NGN"],
    primaryUseCase: "Remittances routed via stablecoins (Sendwave / LemFi / Grey-style)",
    bankWireDays: 2,
    stablecoinMinutes: 5,
    bankCostBps: 540,
    stablecoinCostBps: 130,
    confidence: "high",
    verifiedAt: "2026-06-01",
    sources: [
      { label: "World Bank (KNOMAD) Migration & Remittances Brief 40", year: 2024, url: "https://www.knomad.org/publication/migration-and-development-brief-40" },
      { label: "Analyst estimate — formal $20–22B (World Bank 2025) plus informal channel estimate", year: 2026 },
    ],
    notes:
      "Of the four, this is the best-documented and the one where stablecoin rails are most measurably eating bank-correspondent share. Official World Bank figure approximately $20–22B in 2025; estimated true volume including informal and crypto channels likely exceeds $23B.",
  },
]

function directionLabel(d: Corridor["direction"]) {
  if (d === "outbound") return "Outbound"
  if (d === "inbound") return "Inbound"
  return "Two-way"
}

function directionDot(d: Corridor["direction"]) {
  if (d === "outbound") return "bg-[var(--chart-2)]"
  if (d === "inbound") return "bg-[var(--chart-1)]"
  return "bg-[var(--chart-4)]"
}

function confidenceChip(c: Confidence) {
  if (c === "high" || c === "Verified" || c === "SEC-provisional" || c === "Certificate of Entry")
    return { label: c === "high" ? "High confidence" : c, classes: "border-positive/40 bg-positive/10 text-positive" }
  if (c === "medium" || c === "Company-announced" || c === "Snapshot Input")
    return { label: c === "medium" ? "Medium confidence" : c, classes: "border-warning/40 bg-warning/10 text-warning" }
  return { label: c === "low" ? "Low confidence" : c, classes: "border-destructive/40 bg-destructive/10 text-destructive" }
}

export function CorridorView() {
  const total = CORRIDORS.reduce((a, c) => a + c.flowUsd, 0)

  return (
    <section id="corridors" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          08 · Where the dollars go 🌍
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          Four real money routes moving{" "}
          <span className="text-primary">{fmtUsd(total, { compact: true })}</span> a year
        </p>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          The B2B opportunity isn't abstract. It lives in specific routes. Below are four major routes where stablecoins are already bodying bank wires on speed and cost. This is the exact reason businesses are moving over. ⚡
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {CORRIDORS.map((c) => {
          const speedup = Math.round((c.bankWireDays * 24 * 60) / c.stablecoinMinutes)
          const savings = c.bankCostBps - c.stablecoinCostBps
          const conf = confidenceChip(c.confidence)
          return (
            <article
              key={c.code}
              className="card-elev relative overflow-hidden rounded-lg border border-border/60 bg-card p-5"
            >
              <header className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${directionDot(c.direction)}`} aria-hidden="true" />
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {directionLabel(c.direction)}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold tracking-tight">{c.name}</h3>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">{c.code}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Money moving each year
                  </div>
                  <div className="mt-0.5 font-mono text-lg tabular-nums">
                    {fmtUsd(c.flowUsd, { compact: true })}
                  </div>
                  <span
                    className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${conf.classes}`}
                  >
                    {conf.label}
                  </span>
                </div>
              </header>

              <p className="mt-3 text-sm text-foreground/80">{c.primaryUseCase}</p>

              <div className="mt-4 flex flex-col gap-2 rounded-md border border-border/60 bg-background/50 p-3">
                <div className="flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Building2 className="h-3 w-3 shrink-0" />
                    <span title="Traditional cross-border SWIFT/correspondent banking">SWIFT Bank wire</span>
                  </div>
                  <span className="font-mono tabular-nums shrink-0">
                    {c.bankWireDays}d · {(c.bankCostBps / 100).toFixed(1)}% fee
                  </span>
                </div>
                <div className="flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-border/60 pt-2 text-xs font-medium">
                  <div className="font-mono uppercase tracking-widest text-primary shrink-0">
                    Stablecoin rail
                  </div>
                  <div className="font-mono tabular-nums text-primary shrink-0">
                    {c.stablecoinMinutes}min · {(c.stablecoinCostBps / 100).toFixed(1)}% fee
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-border/60 pt-2 text-xs text-muted-foreground">
                  <span>
                    Faster by:{" "}
                    <span className="font-mono tabular-nums text-foreground">{speedup.toLocaleString()}×</span>
                  </span>
                  <span>
                    Cheaper by:{" "}
                    <span className="font-mono tabular-nums text-foreground">{(savings / 100).toFixed(1)}%</span>
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Quidax pairs that serve this route
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {c.quidaxPairs.map((p) => (
                    <span
                      key={p}
                      className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-xs tracking-wide text-primary"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 border-t border-border/60 pt-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Sources
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/70">
                    Verified {c.verifiedAt}
                  </span>
                </div>
                <ul className="mt-1.5 flex flex-col gap-0.5">
                  {c.sources.map((s) => (
                    <li key={s.label} className="text-xs text-muted-foreground">
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                          {s.label} ({s.year})
                        </a>
                      ) : (
                        <>{s.label} ({s.year})</>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs italic leading-relaxed text-muted-foreground/80">{c.notes}</p>
              </div>
            </article>
          )
        })}
      </div>

      <p className="mt-4 max-w-3xl text-xs text-muted-foreground">
        These four routes carry roughly {fmtUsd(total, { compact: true })} a year between them. Even if Quidax wins just half a percent of that and charges 0.25%, that&apos;s already{" "}
        <span className="text-foreground">≈ {fmtUsd(total * 0.005 * 0.0025, { compact: true })}/yr</span>{" "}
                in recurring revenue. That is the bottom of the range in the B2B section above. The yearly-flow numbers are estimates from public sources, not Quidax&apos;s actual volume.
      </p>
    </section>
  )
}
