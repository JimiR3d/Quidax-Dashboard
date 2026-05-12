import { Sparkles } from "lucide-react"
import type { MarketTicker } from "@/lib/quidax"
import { B2B_SEGMENTS } from "@/lib/competitive-data"
import { fmtNgn, fmtUsd } from "@/lib/format"

function KpiCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}) {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl p-5 transition-all duration-300 ${
        highlight ? "card-elev glow-primary" : "card-elev hover:-translate-y-0.5 hover:border-primary/40"
      }`}
    >
      {highlight && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at top left, oklch(0.62 0.27 305 / 0.22), transparent 60%)",
          }}
          aria-hidden="true"
        />
      )}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        {highlight && <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
      </div>
      <div
        className={`mt-3 font-mono text-2xl font-medium tracking-tight md:text-3xl ${
          highlight ? "text-gradient-primary" : "text-foreground"
        }`}
      >
        {value}
      </div>
      {sub && <div className="mt-3 text-xs text-muted-foreground">{sub}</div>}
    </div>
  )
}

export function KpiGrid({ tickers }: { tickers: MarketTicker[] }) {
  const ngn = tickers.filter((t) => t.quote === "NGN")
  const turnover = ngn.reduce((s, t) => s + t.last * t.volume, 0)
  const STABLE_BASES = ["USDT", "CNGN", "USDC", "DAI", "TUSD"]
  const stables = ngn.filter((t) => STABLE_BASES.includes(t.base.toUpperCase()))
  const stableTurn = stables.reduce((s, t) => s + t.last * t.volume, 0)
  const stableShare = turnover > 0 ? (stableTurn / turnover) * 100 : 0
  // Only count constituents that actually carry NGN turnover — avoids
  // claiming pairs that aren't listed on Quidax.
  const stableLabel =
    stables
      .filter((t) => t.last * t.volume > 0)
      .map((t) => t.base.toUpperCase())
      .join(" + ") || "USDT-only proxy"

  // Midpoint of modelled B2B annual revenue.
  const midCaptureRev = B2B_SEGMENTS.reduce((acc, s) => {
    const mid = (s.capturePctLow + s.capturePctHigh) / 2 / 100
    return acc + s.tamUsd * mid * (s.takeRateBps / 10000)
  }, 0)

  return (
    <section id="kpis" className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6 md:py-16">
      <div className="mb-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          02 · Live market snapshot
        </h2>
        <p className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Where the money <span className="text-gradient-primary">actually</span> moves
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="24h NGN turnover"
          value={fmtNgn(turnover, { compact: true })}
          sub={`${ngn.length} active pairs aggregated`}
        />
        <KpiCard
          label="Stablecoin share of NGN volume"
          value={`${stableShare.toFixed(1)}%`}
          sub={stableLabel}
        />
        <KpiCard
          label="Active NGN markets"
          value={String(ngn.length)}
          sub={stables.some((t) => t.base.toUpperCase() === "CNGN") ? "Includes regulated cNGN" : "Spot pairs"}
        />
        <KpiCard
          label="B2B revenue opportunity"
          value={fmtUsd(midCaptureRev, { compact: true })}
          sub="annual · midpoint estimate"
          highlight
        />
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Source:{" "}
        <code className="rounded bg-muted/40 px-1.5 py-0.5 text-foreground">app.quidax.io/api/v1/markets/tickers</code>{" "}
        (live or simulated fallback &mdash; see the badge in the header).
        The B2B figure is an analyst estimate &mdash; assumptions detailed in the B2B Opportunity section below.
      </p>
    </section>
  )
}
