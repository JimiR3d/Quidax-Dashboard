import type { Candle, MarketTicker } from "@/lib/quidax"
import { computeCngnPeg } from "@/lib/insights"
import { fmtNgn } from "@/lib/format"

type Props = {
  cngnNgn?: MarketTicker
  cngnUsdt?: MarketTicker
  candles: Candle[]
}

export function CngnDepegWatch({ cngnNgn, cngnUsdt, candles }: Props) {
  const peg = computeCngnPeg(cngnNgn, cngnUsdt)
  // If we have no live cNGN/NGN ticker we MUST NOT report "stable 0.0 bps" —
  // that would be a fiction. Render an explicit no-data chip instead.
  const noLive = !peg.hasLiveSpot
  // Single source of truth: every visual cue (pill, dot, deviation colour)
  // derives from peg.status so the colour can never disagree with the label.
  const statusColor = noLive
    ? "text-muted-foreground"
    : peg.status === "stable"
      ? "text-positive"
      : peg.status === "watch"
        ? "text-warning"
        : "text-destructive"
  const statusBg = noLive
    ? "bg-muted/40 border-border"
    : peg.status === "stable"
      ? "bg-positive/10 border-positive/30"
      : peg.status === "watch"
        ? "bg-warning/10 border-warning/30"
        : "bg-destructive/10 border-destructive/30"
  const statusDot = noLive
    ? "bg-muted-foreground"
    : peg.status === "stable"
      ? "bg-positive"
      : peg.status === "watch"
        ? "bg-warning"
        : "bg-destructive"
  const statusLabel = noLive
    ? "No live spot"
    : peg.status === "stable"
      ? "Stable"
      : peg.status === "watch"
        ? "Watch"
        : "Depeg event"

  const series = candles.slice(-30).map((c) => c.close)
  const path = buildPegPath(series)
  // Display min/max use the raw observed range. The chart itself uses a
  // fixed visual band so a perfectly stable peg renders as a flat line
  // through the center rather than collapsing to the bottom edge.
  const min = series.length ? Math.min(...series) : 1
  const max = series.length ? Math.max(...series) : 1

  return (
    <section id="cngn" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6" aria-labelledby="cngn-title">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            04 · Live insight · Exclusive
          </h2>
          <p id="cngn-title" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl text-balance">
            cNGN Peg Watch
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
            Quidax is the only local exchange listing cNGN &mdash; Nigeria&apos;s regulated naira stablecoin. This
            panel computes live peg deviation directly from the cNGN/NGN order book. Quidax could expose this
            monitoring view to enterprise treasury clients as a paid B2B feed.
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${statusBg}`}>
          <span className={`size-1.5 rounded-full ${statusDot} animate-pulse`} aria-hidden />
          <span className={statusColor}>{statusLabel}</span>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="card-elev rounded-xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Current cNGN/NGN</p>
          <p className="mt-2 font-mono text-3xl font-medium tabular-nums tracking-tight md:text-4xl">
            {noLive ? "—" : peg.cngnNgn.toFixed(4)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {noLive ? "Awaiting cNGN/NGN ticker" : "Target peg: "}
            {!noLive && <span className="tabular-nums text-foreground">1.0000</span>}
          </p>
        </article>

        <article className="card-elev rounded-xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Deviation from peg</p>
          <p
            className={`mt-2 font-mono text-3xl font-medium tabular-nums tracking-tight md:text-4xl ${statusColor}`}
          >
            {noLive
              ? "—"
              : `${peg.deviationBps >= 0 ? "+" : ""}${peg.deviationBps.toFixed(1)} bps`}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Thresholds: <span className="text-foreground">Stable &lt; 25</span> · Watch 25&ndash;&lt;100 · Depeg &ge; 100
          </p>
        </article>

        <article className="card-elev rounded-xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Cross-check: USDT/NGN from cNGN
          </p>
          <p className="mt-2 font-mono text-3xl font-medium tabular-nums tracking-tight md:text-4xl">
            {peg.impliedUsdtNgnFromCngn ? fmtNgn(peg.impliedUsdtNgnFromCngn) : "—"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Derived from cNGN/USDT cross. Should track the direct USDT/NGN book.
          </p>
        </article>
      </div>

      <div className="mt-4 card-elev rounded-xl p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-medium">30-day cNGN/NGN &mdash; peg integrity</h3>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground tabular-nums">
            {series.length} datapoints · /markets/cngnngn/k
          </span>
        </div>
        <div className="mt-4 h-32 w-full">
          {path ? (
            <svg
              viewBox="0 0 600 100"
              preserveAspectRatio="none"
              className="h-full w-full"
              role="img"
              aria-label="cNGN to NGN price history over 30 days"
            >
              <defs>
                <linearGradient id="cngn-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.27 305)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="oklch(0.62 0.27 305)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="50" x2="600" y2="50" stroke="oklch(0.55 0.03 290 / 0.4)" strokeDasharray="3 3" />
              <path d={path.fill} fill="url(#cngn-fill)" />
              <path
                d={path.line}
                fill="none"
                stroke="oklch(0.62 0.27 305)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          ) : (
            <p className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Awaiting candle data
            </p>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span>
            Min: <span className="tabular-nums text-foreground">{min.toFixed(4)}</span>
          </span>
          <span>
            Max: <span className="tabular-nums text-foreground">{max.toFixed(4)}</span>
          </span>
          <span>Dotted line = 1.0000 target peg</span>
        </div>
      </div>
    </section>
  )
}

function buildPegPath(values: number[]) {
  if (values.length < 2) return null
  // Visual band is anchored at 1.0000 with a minimum ±100 bps half-width
  // (the depeg threshold). This makes a perfectly stable series render as
  // a flat line through the centre instead of collapsing to the bottom.
  const observed = Math.max(
    Math.abs(Math.max(...values) - 1),
    Math.abs(1 - Math.min(...values)),
  )
  const half = Math.max(0.01, observed * 1.5)
  const min = 1 - half
  const range = half * 2
  const stepX = 600 / (values.length - 1)
  const points = values.map((v, i) => {
    const x = i * stepX
    const y = 100 - ((v - min) / range) * 100
    return [x, y] as const
  })
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ")
  const fill = `${line} L600,100 L0,100 Z`
  return { line, fill }
}
