import { fmtUsd } from "@/lib/format"

type Corridor = {
  code: string
  name: string
  direction: "outbound" | "inbound" | "two-way"
  flowUsd: number // analyst proxy, annual
  quidaxPairs: string[]
  primaryUseCase: string
  bankWireDays: number
  stablecoinMinutes: number
  bankCostBps: number
  stablecoinCostBps: number
  sources: string
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
    sources: "NBS import data 2023; Chainalysis SSA report",
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
    sources: "NBS import data; CBN BoP statistics",
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
    sources: "AfCFTA trade flow estimates; Chainalysis",
  },
  {
    code: "DIASPORA → NG",
    name: "Diaspora → Nigeria (inbound)",
    direction: "inbound",
    flowUsd: 20_900_000_000,
    quidaxPairs: ["USDT/NGN", "CNGN/NGN", "USDC/NGN"],
    primaryUseCase: "Remittances routed via stablecoins (Sendwave / LemFi / Grey style)",
    bankWireDays: 2,
    stablecoinMinutes: 5,
    bankCostBps: 540,
    stablecoinCostBps: 130,
    sources: "World Bank Migration & Remittances Brief 2023",
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

export function CorridorView() {
  const total = CORRIDORS.reduce((a, c) => a + c.flowUsd, 0)

  return (
    <section id="corridors" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          06 · Corridor map
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          Where the dollars actually flow —{" "}
          <span className="text-primary">{fmtUsd(total, { compact: true })}</span> across four corridors
        </p>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          The B2B revenue case isn&apos;t abstract — it lives in specific corridors. Below: the four flows where
          stablecoin rails already out-compete correspondent banking on speed and cost, and the Quidax pairs that
          serve each one.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {CORRIDORS.map((c) => {
          const speedup = Math.round((c.bankWireDays * 24 * 60) / c.stablecoinMinutes)
          const savings = c.bankCostBps - c.stablecoinCostBps
          return (
            <article
              key={c.code}
              className="card-elev relative overflow-hidden rounded-lg border border-border/60 bg-card p-5"
            >
              <header className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${directionDot(c.direction)}`} aria-hidden="true" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {directionLabel(c.direction)}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold tracking-tight">{c.name}</h3>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{c.code}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Annual flow
                  </div>
                  <div className="mt-0.5 font-mono text-lg tabular-nums">
                    {fmtUsd(c.flowUsd, { compact: true })}
                  </div>
                </div>
              </header>

              <p className="mt-3 text-sm text-foreground/80">{c.primaryUseCase}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-md border border-border/60 bg-background/50 p-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Bank wire
                  </div>
                  <div className="mt-0.5 font-mono text-sm tabular-nums">
                    {c.bankWireDays}d · {c.bankCostBps}bps
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                    Stablecoin rail
                  </div>
                  <div className="mt-0.5 font-mono text-sm tabular-nums text-primary">
                    {c.stablecoinMinutes}min · {c.stablecoinCostBps}bps
                  </div>
                </div>
                <div className="col-span-2 mt-1 flex items-center justify-between border-t border-border/60 pt-2 text-xs text-muted-foreground">
                  <span>
                    Speed advantage:{" "}
                    <span className="font-mono tabular-nums text-foreground">{speedup.toLocaleString()}×</span>
                  </span>
                  <span>
                    Cost saving:{" "}
                    <span className="font-mono tabular-nums text-foreground">{savings} bps</span>
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Quidax pairs serving this corridor
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {c.quidaxPairs.map((p) => (
                    <span
                      key={p}
                      className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] tracking-wide text-primary"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted-foreground/70">
                Source: {c.sources}. Flow figures are analyst proxies, not Quidax-attributable volume.
              </p>
            </article>
          )
        })}
      </div>

      <p className="mt-4 max-w-3xl text-xs text-muted-foreground">
        These four corridors total ~{fmtUsd(total, { compact: true })} in annual flow. Even a 0.5% capture at a
        25 bps take rate produces an{" "}
        <span className="text-foreground">≈ {fmtUsd(total * 0.005 * 0.0025, { compact: true })}/yr</span>{" "}
        revenue line — which is the bottom of the range in the B2B sizing section above.
      </p>
    </section>
  )
}
