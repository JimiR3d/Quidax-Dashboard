import type { MarketTicker } from "@/lib/quidax"
import type { LiveFxReference } from "@/lib/fx-rates"
import { computeSpread, FX_REFERENCE } from "@/lib/insights"
import { fmtNgn, fmtBps } from "@/lib/format"

type Props = {
  usdtNgn?: MarketTicker
  liveFx?: LiveFxReference
}

/**
 * USDT/NGN vs NFEM vs parallel reference panel.
 *
 * Honest about its inputs:
 *   - Quidax USDT/NGN is the live spot ticker.
 *   - NFEM and parallel are analyst-tracked references with an `asOf` date.
 *     If those references go stale (>3 days) we hide the bps deviation and
 *     show an amber chip; if very stale (>10 days) we hide the comparison
 *     entirely. See `fxReferenceStaleness` in lib/insights.ts.
 */
export function SpreadPanel({ usdtNgn, liveFx }: Props) {
  const spread = computeSpread(usdtNgn, liveFx)
  const hasLive = Boolean(usdtNgn?.last && usdtNgn.last > 0)
  const showBps = spread.staleness !== "very-stale"
  const stalenessChip =
    spread.staleness === "ok"
      ? null
      : spread.staleness === "stale"
        ? {
            label: "Reference rate is getting old",
            classes: "border-warning/40 bg-warning/10 text-warning",
          }
        : {
            label: "Reference too old to compare, bps hidden",
            classes: "border-destructive/40 bg-destructive/10 text-destructive",
          }

  return (
    <section
      id="fx"
      className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6"
      aria-labelledby="spread-title"
    >
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            03 · Live · The naira-dollar gap
          </h2>
          <p
            id="spread-title"
            className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl text-balance"
          >
            What does a dollar cost on Quidax vs. the CBN vs. the streets? 🚦
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
            Three dollar prices, side by side: the USDT price on Quidax, the official CBN rate, and the parallel street rate. The smaller the gap, the more sense stablecoins make for real business settlement.
          </p>
        </div>
        {stalenessChip && (
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${stalenessChip.classes}`}
          >
            {stalenessChip.label}
          </span>
        )}
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <ReferenceCard
          label="Official CBN rate (NFEM)"
          value={spread.cbnOfficial}
          subtitle={spread.fxSource === "live-api" ? "Auto-updated · open.er-api.com" : "Tracked manually · CBN's daily print"}
          tone="muted"
        />
        <ReferenceCard
          label="Quidax (USDT/NGN)"
          value={spread.quidaxUsdtNgn}
          subtitle={hasLive ? "Live · from /markets/tickers" : "No live price right now. Using reference"}
          tone="primary"
        />
        <ReferenceCard
          label="Street / parallel market"
          value={spread.parallel}
          subtitle={spread.fxSource === "live-api" ? "Auto-estimated · 1.8% over official" : "Tracked manually · BDC street average"}
          tone="muted"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="card-elev rounded-xl p-5">
          <h3 className="text-sm font-medium">How the three prices compare</h3>
          <SpreadBar spread={spread} />
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Quidax is{" "}
            {showBps && (
              <>
                <span className="text-foreground tabular-nums">
                  {fmtBps(spread.vsCbnBps)}
                </span>{" "}
                from the official CBN rate. The street market is{" "}
                <span className="text-foreground tabular-nums">{fmtBps(spread.fxGapBps)}</span>{" "}
                away.
              </>
            )}
            {!showBps && (
              <>
                <span className="text-foreground tabular-nums">{spread.vsCbnPct.toFixed(2)}%</span>{" "}
                of the official CBN rate.
              </>
            )}{" "}
            Since Nigeria unified its FX windows, these three prices keep converging. The closer they get, the more practical stablecoins become for real business settlement. 🏦
          </p>
        </article>

        <article className="card-elev rounded-xl p-5">
          <h3 className="text-sm font-medium">Why this matters</h3>
          <ul className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2">
              <span
                className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
              <span>
                <span className="text-foreground">Treasury planning:</span> CFOs need one trustworthy number to book dollar bills in naira without guessing games.
              </span>
            </li>
            <li className="flex gap-2">
              <span
                className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
              <span>
                <span className="text-foreground">Remittance pricing:</span> The gap between official and street is where remittance apps make their money. A published Quidax rate beats trying to guess the BDC rate on WhatsApp.
              </span>
            </li>
            <li className="flex gap-2">
              <span
                className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
              <span>
                <span className="text-foreground">Less risk on every trade:</span> Smaller spreads mean cross-border settlement using stablecoins finally pencils out perfectly.
              </span>
            </li>
          </ul>
        </article>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {spread.fxSource === "live-api" ? (
          <>Reference rates are auto-updated (as of {spread.asOf}). Parallel estimated at +1.8% over official.</>
        ) : (
          <>Reference rates are as of {FX_REFERENCE.asOf}. The CBN and the street market don't publish a free, machine-readable feed, so they're tracked manually and timestamped.</>
        )}
      </p>

      {/* Screen-reader companion. The SpreadBar above is a custom SVG-like
          element and would otherwise be unreadable to assistive tech. */}
      <table className="sr-only">
        <caption>USDT/NGN compared to NFEM official and parallel references</caption>
        <thead>
          <tr>
            <th scope="col">Reference</th>
            <th scope="col">NGN per USD</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Quidax USDT/NGN</th>
            <td>{spread.quidaxUsdtNgn.toFixed(2)}</td>
            <td>{hasLive ? "Live ticker" : "No live ticker, reference fallback"}</td>
          </tr>
          <tr>
            <th scope="row">CBN NFEM official</th>
            <td>{spread.cbnOfficial.toFixed(2)}</td>
            <td>{spread.fxSource === "live-api" ? `Auto-updated, as of ${spread.asOf}` : `Analyst-tracked, as of ${FX_REFERENCE.asOf}`}</td>
          </tr>
          <tr>
            <th scope="row">Parallel market</th>
            <td>{spread.parallel.toFixed(2)}</td>
            <td>{spread.fxSource === "live-api" ? `Auto-estimated, as of ${spread.asOf}` : `Analyst-tracked, as of ${FX_REFERENCE.asOf}`}</td>
          </tr>
        </tbody>
      </table>
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
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-mono text-3xl font-medium tabular-nums tracking-tight md:text-4xl">
        {fmtNgn(value)}
      </p>
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
  const range = max - min || 1
  // Render muted markers first so the primary Quidax dot stays visually on top
  // when it overlaps the CBN reference (which happens whenever the live USDT
  // price tracks the official rate exactly).
  const draw = [...points].sort((a, b) => {
    const rank = (tone: "primary" | "muted") => (tone === "primary" ? 1 : 0)
    return rank(a.tone) - rank(b.tone)
  })

  return (
    <div className="mt-4">
      <div className="relative h-2 w-full rounded-full bg-muted/30">
        <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40" />
        {draw.map((p) => {
          const pct = ((p.value - min) / range) * 100
          return (
            <div
              key={p.label}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pct}%`, zIndex: p.tone === "primary" ? 2 : 1 }}
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
              <span
                className={`tabular-nums ${
                  p.tone === "primary" ? "text-primary" : "text-foreground"
                }`}
              >
                {fmtNgn(p.value)}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
