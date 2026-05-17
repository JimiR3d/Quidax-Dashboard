import type { MarketTicker } from "@/lib/quidax"
import { computeSpread, FX_REFERENCE } from "@/lib/insights"
import { fmtNgn, fmtBps } from "@/lib/format"

type Props = {
  usdtNgn?: MarketTicker
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
export function SpreadPanel({ usdtNgn }: Props) {
  const spread = computeSpread(usdtNgn)
  const hasLive = Boolean(usdtNgn?.last && usdtNgn.last > 0)
  const showBps = spread.staleness !== "very-stale"
  const stalenessChip =
    spread.staleness === "ok"
      ? null
      : spread.staleness === "stale"
        ? {
            label: "Reference stale",
            classes: "border-warning/40 bg-warning/10 text-warning",
          }
        : {
            label: "Reference very stale — bps hidden",
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
            03 · Live insight · Naira–dollar rate
          </h2>
          <p
            id="spread-title"
            className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl text-balance"
          >
            How Quidax&apos;s dollar price compares to the official rate and the street rate
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
            The most useful number for any Nigerian company moving money: where does
            Quidax&apos;s dollar–to–naira price land compared to the Central Bank&apos;s
            official rate and the street market rate?
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
          label="Official rate (Central Bank NFEM)"
          value={spread.cbnOfficial}
          subtitle="Tracked by hand · weighted official rate"
          tone="muted"
        />
        <ReferenceCard
          label="Quidax USDT/NGN (live)"
          value={spread.quidaxUsdtNgn}
          subtitle={hasLive ? "Live · from Quidax markets API" : "No live price — using a reference"}
          tone="primary"
        />
        <ReferenceCard
          label="Street rate (parallel market)"
          value={spread.parallel}
          subtitle="Tracked by hand · BDC street average"
          tone="muted"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="card-elev rounded-xl p-5">
          <h3 className="text-sm font-medium">How the three rates line up</h3>
          <SpreadBar spread={spread} />
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Quidax&apos;s dollar price prints at{" "}
            <span className="text-foreground tabular-nums">{spread.vsCbnPct.toFixed(2)}%</span>{" "}
            of the official rate and{" "}
            <span className="text-foreground tabular-nums">
              {spread.vsParallelPct.toFixed(2)}%
            </span>{" "}
            of the street rate.
            {showBps && (
              <>
                {" "}
                That&apos;s{" "}
                <span className="text-foreground tabular-nums">
                  {fmtBps(spread.vsCbnBps)}
                </span>{" "}
                away from official, against a street-vs-official gap of{" "}
                <span className="text-foreground tabular-nums">{fmtBps(spread.fxGapBps)}</span>.
                <span className="ml-1 text-muted-foreground/80">(bps = basis points; 100 bps = 1%.)</span>
              </>
            )}{" "}
            After Nigeria unified its FX rates, the three lines are converging — which is exactly the
            condition that makes stablecoin rails work for businesses moving money: predictable pricing,
            not arbitrage.
          </p>
        </article>

        <article className="card-elev rounded-xl p-5">
          <h3 className="text-sm font-medium">Why this matters for businesses</h3>
          <ul className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2">
              <span
                className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
              <span>
                <span className="text-foreground">Treasury planning:</span> fintechs need
                one reliable benchmark to price dollar bills they have to pay in naira.
              </span>
            </li>
            <li className="flex gap-2">
              <span
                className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
              <span>
                <span className="text-foreground">Remittance pricing:</span> the gap is
                where remittance companies make their margin — a published, signed Quidax
                rate would beat the opacity of street rates.
              </span>
            </li>
            <li className="flex gap-2">
              <span
                className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
              <span>
                <span className="text-foreground">Settlement risk:</span> the gap closing
                in 2025 has made the math actually work for cross-border business
                payments using stablecoins.
              </span>
            </li>
          </ul>
        </article>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Reference rates as of {FX_REFERENCE.asOf}. The Central Bank and street rates have
        no free machine-readable feed — they are tracked manually and timestamped.
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
            <td>Analyst-tracked, as of {FX_REFERENCE.asOf}</td>
          </tr>
          <tr>
            <th scope="row">Parallel market</th>
            <td>{spread.parallel.toFixed(2)}</td>
            <td>Analyst-tracked, as of {FX_REFERENCE.asOf}</td>
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
