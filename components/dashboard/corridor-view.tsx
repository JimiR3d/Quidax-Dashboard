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

type Confidence = "high" | "medium" | "low"

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
    flowUsd: 22_500_000_000,
    quidaxPairs: ["USDT/NGN", "USDC/NGN"],
    primaryUseCase: "Importer settlement (electronics, textiles, machinery)",
    bankWireDays: 4,
    stablecoinMinutes: 8,
    bankCostBps: 320,
    stablecoinCostBps: 90,
    confidence: "medium",
    verifiedAt: "2026-05-10",
    sources: [
      { label: "NBS Foreign Trade in Goods Q4", year: 2024 },
      { label: "Chainalysis SSA Geography of Crypto", year: 2024 },
    ],
    notes:
      "Annual flow is gross merchandise import to China; only a fraction settles via stablecoins today, but it's the proxy for the addressable corridor.",
  },
  {
    code: "NG → AE",
    name: "Nigeria → UAE (Dubai)",
    direction: "outbound",
    flowUsd: 6_800_000_000,
    quidaxPairs: ["USDT/NGN"],
    primaryUseCase: "Re-export trade, gold, luxury, diaspora savings",
    bankWireDays: 3,
    stablecoinMinutes: 6,
    bankCostBps: 280,
    stablecoinCostBps: 70,
    confidence: "medium",
    verifiedAt: "2026-05-10",
    sources: [
      { label: "NBS Foreign Trade in Goods Q4", year: 2024 },
      { label: "CBN Balance of Payments Statistics", year: 2024 },
    ],
    notes:
      "Combines official trade flow with documented BDC outflow to UAE banks. The stablecoin share is reportedly growing as bank correspondent friction increases.",
  },
  {
    code: "NG ↔ KE",
    name: "Nigeria ↔ Kenya",
    direction: "two-way",
    flowUsd: 1_200_000_000,
    quidaxPairs: ["USDT/NGN"],
    primaryUseCase: "Regional B2B (SaaS, logistics, agritech)",
    bankWireDays: 5,
    stablecoinMinutes: 10,
    bankCostBps: 380,
    stablecoinCostBps: 110,
    confidence: "low",
    verifiedAt: "2026-05-10",
    sources: [
      { label: "AfCFTA trade flow estimates", year: 2023 },
      { label: "Chainalysis SSA Geography of Crypto", year: 2024 },
    ],
    notes:
      "Most fragile estimate on the page — intra-African flows are poorly instrumented in public data. Confidence: low. Treat as directional.",
  },
  {
    code: "DIASPORA → NG",
    name: "Diaspora → Nigeria (inbound)",
    direction: "inbound",
    flowUsd: 20_900_000_000,
    quidaxPairs: ["USDT/NGN", "CNGN/NGN", "USDC/NGN"],
    primaryUseCase: "Remittances routed via stablecoins (Sendwave / LemFi / Grey-style)",
    bankWireDays: 2,
    stablecoinMinutes: 5,
    bankCostBps: 540,
    stablecoinCostBps: 130,
    confidence: "high",
    verifiedAt: "2026-05-10",
    sources: [
      { label: "World Bank Migration & Remittances Brief", year: 2023 },
      { label: "CBN Diaspora Remittance Reports", year: 2024 },
    ],
    notes:
      "Of the four, this is the best-documented and the one where stablecoin rails are most measurably eating bank-correspondent share.",
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
  if (c === "high")
    return { label: "High confidence", classes: "border-positive/40 bg-positive/10 text-positive" }
  if (c === "medium")
    return { label: "Medium confidence", classes: "border-warning/40 bg-warning/10 text-warning" }
  return { label: "Low confidence", classes: "border-destructive/40 bg-destructive/10 text-destructive" }
}

export function CorridorView() {
  const total = CORRIDORS.reduce((a, c) => a + c.flowUsd, 0)

  return (
    <section id="corridors" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          08 · Where the dollars go
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          Four real money routes &mdash;{" "}
          <span className="text-primary">{fmtUsd(total, { compact: true })}</span> a year between them
        </p>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          The B2B opportunity isn&apos;t abstract &mdash; it lives in specific routes. Below: four real flows where stablecoins already beat bank wires on speed and cost, and the Quidax pairs that serve each one. Each card has a confidence rating and the sources I used &mdash; on purpose, kept conservative.
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

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-md border border-border/60 bg-background/50 p-3">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Bank wire
                  </div>
                  <div className="mt-0.5 font-mono text-sm tabular-nums">
                    {c.bankWireDays}d · {c.bankCostBps}bps
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-primary">
                    Stablecoin rail
                  </div>
                  <div className="mt-0.5 font-mono text-sm tabular-nums text-primary">
                    {c.stablecoinMinutes}min · {c.stablecoinCostBps}bps
                  </div>
                </div>
                <div className="col-span-2 mt-1 flex items-center justify-between border-t border-border/60 pt-2 text-xs text-muted-foreground">
                  <span>
                    Faster by:{" "}
                    <span className="font-mono tabular-nums text-foreground">{speedup.toLocaleString()}×</span>
                  </span>
                  <span>
                    Cheaper by:{" "}
                    <span className="font-mono tabular-nums text-foreground">{savings} bps</span>
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
                      {s.label} ({s.year})
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
        These four routes carry roughly {fmtUsd(total, { compact: true })} a year between them. Even if Quidax wins just half a percent of that and charges 25 bps, that&apos;s already{" "}
        <span className="text-foreground">≈ {fmtUsd(total * 0.005 * 0.0025, { compact: true })}/yr</span>{" "}
        &mdash; which is the bottom of the range in the B2B section above. The yearly-flow numbers are estimates from public sources, not Quidax&apos;s actual volume.
      </p>
    </section>
  )
}
