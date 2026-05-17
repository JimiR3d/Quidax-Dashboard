import { Sparkles } from "lucide-react"
import type { MarketSnapshot } from "@/lib/quidax"
import { B2B_SEGMENTS } from "@/lib/competitive-data"
import { ngnTurnover } from "@/lib/insights"
import { fmtNgn, fmtUsd, fmtRelTime } from "@/lib/format"

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
        highlight
          ? "card-elev glow-primary"
          : "card-elev hover:-translate-y-0.5 hover:border-primary/40"
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
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
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

const STABLE_BASES = new Set(["USDT", "USDC", "DAI", "TUSD", "CNGN"])

export function KpiGrid({ snapshot }: { snapshot: MarketSnapshot }) {
  const ngn = snapshot.tickers.filter((t) => t.quote === "NGN")
  // NGN-turnover uses `baseVolume` (Quidax `vol` is base-asset volume).
  // Anyone summing `last * baseVolume` for non-NGN markets would be doing
  // mixed-quote arithmetic; `ngnTurnover` guards against that.
  const totalNgnTurnover = ngn.reduce((s, t) => s + ngnTurnover(t), 0)

  const stableTickers = ngn.filter((t) => STABLE_BASES.has(t.base.toUpperCase()))
  const stableTurnover = stableTickers.reduce((s, t) => s + ngnTurnover(t), 0)
  const stableShare = totalNgnTurnover > 0 ? (stableTurnover / totalNgnTurnover) * 100 : 0
  const stableLabel =
    stableTickers
      .filter((t) => ngnTurnover(t) > 0)
      .map((t) => t.base.toUpperCase())
      .join(" + ") || "USDT-only proxy"

  // Midpoint of modelled B2B annual revenue, expressed in USD.
  const midCaptureRev = B2B_SEGMENTS.reduce((acc, s) => {
    const mid = (s.capturePctLow + s.capturePctHigh) / 2 / 100
    return acc + s.tamUsd * mid * (s.takeRateBps / 10000)
  }, 0)

  const isEmpty = snapshot.source === "empty" || ngn.length === 0
  const sourceFootnote =
    snapshot.source === "live"
      ? "Live · just refreshed"
      : snapshot.source === "cached"
        ? `Recent · ${fmtRelTime(snapshot.ageMs)}`
        : snapshot.source === "lkg"
          ? `Older · ${fmtRelTime(snapshot.ageMs)} · live source not responding`
          : "No data; figures unavailable"

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
          label="24-hour naira trading volume"
          value={isEmpty ? "—" : fmtNgn(totalNgnTurnover, { compact: true })}
          sub={isEmpty ? "Live source not available" : `${ngn.length} active naira pairs added together`}
        />
        <KpiCard
          label="Stablecoin share of naira trades"
          value={isEmpty ? "—" : `${stableShare.toFixed(1)}%`}
          sub={isEmpty ? "Cannot calculate" : stableLabel}
        />
        <KpiCard
          label="Active naira markets"
          value={isEmpty ? "—" : String(ngn.length)}
          sub={
            isEmpty
              ? "No data loaded"
              : stableTickers.some((t) => t.base.toUpperCase() === "CNGN")
                ? "Includes regulated cNGN"
                : "Spot trading pairs"
          }
        />
        <KpiCard
          label="Business-customer revenue opportunity"
          value={fmtUsd(midCaptureRev, { compact: true })}
          sub="per year · middle estimate"
          highlight
        />
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Source:{" "}
        <code className="rounded bg-muted/40 px-1.5 py-0.5 text-foreground">
          app.quidax.io/api/v1/markets/tickers
        </code>{" "}
        · {sourceFootnote}. The revenue opportunity number is an estimate — see the
        Business-Customer Opportunity section below for the full math.
      </p>
    </section>
  )
}
