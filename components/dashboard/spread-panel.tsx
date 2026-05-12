import type { MarketTicker } from "@/lib/quidax"
import { computeSpread, FX_REFERENCE } from "@/lib/insights"
import { fmtNgn } from "@/lib/format"

type Props = {
  usdtNgn?: MarketTicker
}

export function SpreadPanel({ usdtNgn }: Props) {
  const spread = computeSpread(usdtNgn)

  return (
    <section id="fx" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6" aria-labelledby="spread-title">
      <header className="mb-6">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">03 · Live insight · FX</h2>
        <p id="spread-title" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl text-balance">
          USDT/NGN vs the official rate
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          The single most actionable number for any Nigerian B2B treasurer: where does Quidax&apos;s stablecoin book
          price USD/NGN relative to CBN&apos;s NFEM official and the parallel market? Live Quidax data,
          analyst-modelled FX references.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <ReferenceCard
          label="CBN NFEM official"
          value={spread.cbnOfficial}
          subtitle="Analyst model · weighted NFEM avg"
          tone="muted"
        />
        <ReferenceCard
          label="Quidax USDT/NGN"
          value={spread.quidaxUsdtNgn}
          subtitle="Live · /markets/tickers/usdtngn"
          tone="primary"
        />
        <ReferenceCard
          label="Parallel / P2P"
          value={spread.parallel}
          subtitle="Analyst model · BDC street avg"
          tone="muted"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="card-elev rounded-xl p-5">
          <h3 className="text-sm font-medium">Spread map</h3>
          <SpreadBar spread={spread} />
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Quidax USDT/NGN is currently{" "}
            <span className="text-foreground tabular-nums">{spread.vsCbnPct.toFixed(2)}%</span> of CBN official and{" "}
            <span className="text-foreground tabular-nums">{spread.vsParallelPct.toFixed(2)}%</span> of parallel. A
            stablecoin trading below official is unusual and signals tight NGN liquidity on-exchange &mdash; a
            tailwind for B2B inflow products and a headwind for outflow ones.
          </p>
        </article>

        <article className="card-elev rounded-xl p-5">
          <h3 className="text-sm font-medium">Why this matters for B2B</h3>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>
                <span className="text-foreground">Treasury hedging:</span> fintechs need a single reliable benchmark
                for booking USD-denominated payables in NGN.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>
                <span className="text-foreground">Remittance pricing:</span> the FX gap is the merchant&apos;s pricing
                wedge &mdash; a published, signed Quidax rate would beat parallel-market opacity.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>
                <span className="text-foreground">Settlement risk:</span> spread compression in 2025 has meaningfully
                improved unit economics for cross-border B2B settlement using stablecoins.
              </span>
            </li>
          </ul>
        </article>
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        FX references as of {FX_REFERENCE.asOf}. Refresh manually &mdash; CBN and parallel markets have no free
        machine-readable feed.
      </p>
    </section>
  )
}

function ReferenceCard({
  label,
  value,
  subtitle,
  tone,
}: {
  label: string
  value: number
  subtitle: string
  tone: "primary" | "muted"
}) {
  const ring = tone === "primary" ? "ring-1 ring-primary/40" : ""
  return (
    <article className={`card-elev rounded-xl p-5 ${ring}`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-3xl font-medium tabular-nums tracking-tight md:text-4xl">{fmtNgn(value)}</p>
      <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>
    </article>
  )
}

function SpreadBar({ spread }: { spread: ReturnType<typeof computeSpread> }) {
  const points = [
    { label: "Quidax", value: spread.quidaxUsdtNgn, tone: "primary" as const },
    { label: "CBN", value: spread.cbnOfficial, tone: "muted" as const },
    { label: "Parallel", value: spread.parallel, tone: "muted" as const },
  ]
  const min = Math.min(...points.map((p) => p.value)) - 30
  const max = Math.max(...points.map((p) => p.value)) + 30
  const range = max - min

  return (
    <div className="mt-4">
      <div className="relative h-2 w-full rounded-full bg-muted/30">
        <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40" />
        {points.map((p) => {
          const pct = ((p.value - min) / range) * 100
          return (
            <div
              key={p.label}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pct}%` }}
            >
              <div
                className={`size-3 rounded-full ring-2 ring-background ${
                  p.tone === "primary" ? "bg-primary" : "bg-foreground/70"
                }`}
                aria-label={`${p.label} ${p.value}`}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex justify-between text-xs">
        {points
          .slice()
          .sort((a, b) => a.value - b.value)
          .map((p) => (
            <div key={p.label} className="flex flex-col">
              <span className="text-muted-foreground">{p.label}</span>
              <span className={`tabular-nums ${p.tone === "primary" ? "text-primary" : "text-foreground"}`}>
                {fmtNgn(p.value)}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
