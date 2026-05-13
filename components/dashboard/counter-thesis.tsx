import { AlertTriangle } from "lucide-react"

/**
 * Counter-thesis section — audit item [5][High].
 *
 * Every B2B thesis ships with conditions under which it's wrong. Reading
 * those conditions is how a serious analyst stress-tests the case before
 * committing capital or hiring. We make them explicit and pair each one
 * with the on-page surface that would betray it first — so a reader can
 * literally watch for the falsifier.
 */

const FALSIFIERS = [
  {
    headline: "If retail volume keeps compounding double-digits, the B2B wedge is a sideshow.",
    body: "The thesis assumes retail growth is plateauing relative to B2B. If Nigerian retail crypto volume re-accelerates — for example, on a fresh devaluation cycle that drives savings dollarization — then API revenue is rounding error and the right strategy is to defend the consumer book.",
    watch: "USDT/NGN turnover and 24h change in the live KPI grid above.",
  },
  {
    headline: "If cNGN never gets institutional adoption, the regulatory wedge collapses.",
    body: "Quidax's structural advantage over Yellow Card hinges on the SEC license + cNGN listing becoming actually useful. If cNGN volume stays trivial through 2026 — i.e. the asset exists on paper but no bank, fintech, or treasury routes through it — the regulatory premium is unpriced and Yellow Card's larger footprint wins.",
    watch: "cNGN/NGN spot and cNGN deep-dive volume series.",
  },
  {
    headline: "If a bank-backed competitor ships a real stablecoin rail, the corridor case erodes fast.",
    body: "The corridor revenue case rests on stablecoin rails being meaningfully cheaper and faster than the banking system. If a tier-1 Nigerian bank launches a low-spread, T+0 corridor product (NIBSS-NIP-style for FX), the cost-saving column in the corridor cards shrinks to single-digit bps and the speed advantage disappears.",
    watch: "Bank wire vs stablecoin rail bps in the corridor cards.",
  },
  {
    headline: "If take-rates compress to single-digit bps, the per-segment revenue math breaks.",
    body: "The mid-case slider assumes 20–60 bps blended take rates. If competitive pressure or regulator-mandated price caps push take-rates below 10 bps across all four segments, you'd need >2× capture to hold the same revenue line — and capture is the harder lever to move.",
    watch: "Take-rate sliders in the B2B opportunity model.",
  },
]

export function CounterThesis() {
  return (
    <section
      id="counter-thesis"
      className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6"
      aria-labelledby="counter-thesis-title"
    >
      <header className="mb-6 flex items-start gap-3">
        <span
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-warning/40 bg-warning/10 text-warning"
          aria-hidden="true"
        >
          <AlertTriangle className="h-4 w-4" />
        </span>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-warning">
            12 · How the thesis fails
          </p>
          <h2
            id="counter-thesis-title"
            className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl text-balance"
          >
            Four conditions under which I&apos;d retract this analysis
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            A B2B thesis is only useful if it can be falsified. These are the four observable signals that
            would tell me the case in the rest of the page is wrong. Each one is paired with the live
            surface on this dashboard that would betray it first — so you can literally watch for it.
          </p>
        </div>
      </header>

      <ol className="grid gap-3 md:grid-cols-2">
        {FALSIFIERS.map((f, i) => (
          <li key={f.headline} className="card-elev rounded-xl p-5">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-base font-semibold tracking-tight text-foreground text-pretty">
                {f.headline}
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            <p className="mt-3 border-t border-border/60 pt-3 font-mono text-xs text-muted-foreground">
              <span className="text-foreground">Watch:</span> {f.watch}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
