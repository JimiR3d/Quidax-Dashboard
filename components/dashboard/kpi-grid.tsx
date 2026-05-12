import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react"
import type { MarketTicker } from "@/lib/quidax"
import { NGN_USDT_PREMIUM, B2B_SEGMENTS } from "@/lib/competitive-data"
import { fmtNgn, fmtUsd, fmtPct } from "@/lib/format"

function KpiCard({
  label,
  value,
  sub,
  trend,
  highlight,
}: {
  label: string
  value: string
  sub?: string
  trend?: { dir: "up" | "down" | "flat"; text: string }
  highlight?: boolean
}) {
  const TrendIcon = trend?.dir === "up" ? TrendingUp : trend?.dir === "down" ? TrendingDown : Minus
  const trendColor =
    trend?.dir === "up"
      ? "text-positive"
      : trend?.dir === "down"
        ? "text-destructive"
        : "text-muted-foreground"
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
        {highlight && (
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        )}
      </div>
      <div
        className={`mt-3 font-mono text-2xl font-medium tracking-tight md:text-3xl ${
          highlight ? "text-gradient-primary" : "text-foreground"
        }`}
      >
        {value}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        {trend ? (
          <span className={`inline-flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-mono">{trend.text}</span>
          </span>
        ) : (
          <span />
        )}
        {sub && <span className="text-muted-foreground">{sub}</span>}
      </div>
    </div>
  )
}

export function KpiGrid({ tickers }: { tickers: MarketTicker[] }) {
  const usdt = tickers.find((t) => t.market === "usdtngn")
  const btc = tickers.find((t) => t.market === "btcngn")
  const ngnTickers = tickers.filter((t) => t.quote === "NGN")
  const totalNgnVol = ngnTickers.reduce((acc, t) => acc + t.last * t.volume, 0)

  const latestPremium = NGN_USDT_PREMIUM[NGN_USDT_PREMIUM.length - 1]
  const firstPremium = NGN_USDT_PREMIUM[0]
  const premiumDelta = latestPremium.premiumPct - firstPremium.premiumPct

  const midCaptureRev = B2B_SEGMENTS.reduce((acc, s) => {
    const mid = (s.capturePctLow + s.capturePctHigh) / 2 / 100
    return acc + s.tamUsd * mid * (s.takeRateBps / 10000)
  }, 0)

  return (
    <section id="kpis" className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6 md:py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            01 · Executive snapshot
          </h2>
          <p className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Where the money <span className="text-gradient-primary">actually</span> moves
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="USDT / NGN"
          value={usdt ? fmtNgn(usdt.last) : "—"}
          trend={
            usdt
              ? {
                  dir: usdt.changePct > 0 ? "up" : usdt.changePct < 0 ? "down" : "flat",
                  text: fmtPct(usdt.changePct),
                }
              : undefined
          }
          sub="24h"
        />
        <KpiCard
          label="BTC / NGN"
          value={btc ? fmtNgn(btc.last, { compact: true }) : "—"}
          trend={
            btc
              ? {
                  dir: btc.changePct > 0 ? "up" : btc.changePct < 0 ? "down" : "flat",
                  text: fmtPct(btc.changePct),
                }
              : undefined
          }
          sub="24h"
        />
        <KpiCard
          label="NGN spot turnover (24h)"
          value={fmtNgn(totalNgnVol, { compact: true })}
          sub="across all pairs"
        />
        <KpiCard
          label="USDT premium vs CBN FX"
          value={`${latestPremium.premiumPct.toFixed(1)}%`}
          trend={{
            dir: premiumDelta > 0 ? "up" : premiumDelta < 0 ? "down" : "flat",
            text: `${premiumDelta > 0 ? "+" : ""}${premiumDelta.toFixed(1)}pp · 12w`,
          }}
        />
        <KpiCard
          label="Active NGN pairs"
          value={String(ngnTickers.length)}
          sub="live · liquid"
        />
        <KpiCard
          label="B2B revenue opportunity"
          value={fmtUsd(midCaptureRev, { compact: true })}
          sub="annual · midpoint"
          highlight
        />
      </div>
    </section>
  )
}
