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
    headline: "If retail trading keeps growing fast, the B2B story is a sideshow.",
    body: "I'm assuming retail growth is plateauing relative to B2B. If Nigerian retail crypto volume re-accelerates — for example, on a fresh devaluation that pushes everyone into dollars again — then API revenue is small change and the right thing to do is defend the consumer business.",
    watch: "USDT/NGN volume and 24-hour change in the live KPI grid above.",
  },
  {
    headline: "If cNGN never gets real institutional uptake, the regulatory head-start fades.",
    body: "Quidax's structural edge over Yellow Card depends on the SEC licence + cNGN listing actually being useful. If cNGN volume stays trivial through 2026 — the asset exists on paper but no bank, fintech, or treasury actually routes through it — the regulatory premium isn't worth anything, and Yellow Card's wider footprint wins.",
    watch: "cNGN/NGN price and the cNGN deep-dive section.",
  },
  {
    headline: "If a big bank ships a real stablecoin rail, the route case erodes fast.",
    body: "The corridor revenue case rests on stablecoin rails being meaningfully cheaper and faster than banks. If a tier-1 Nigerian bank launches a low-cost, same-day FX corridor product (think NIBSS-NIP for FX), the cost-saving column on each corridor card shrinks and the speed advantage disappears.",
    watch: "Bank-wire vs stablecoin-rail bps in the corridor cards.",
  },
  {
    headline: "If fees collapse to single-digit basis points, the per-segment math breaks.",
    body: "My middle-of-the-road model assumes Quidax can charge 20–60 bps, depending on segment. If competition or regulator-mandated price caps push that below 10 bps everywhere, you'd need to win 2× more market share to keep the same revenue — and market share is the harder lever to move.",
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
            12 · How I could be wrong
          </p>
          <h2
            id="counter-thesis-title"
            className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl text-balance"
          >
            Four things that would make me take this analysis back
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            An analysis is only worth something if it can be checked. These are four observable signals that would tell me the rest of the page is wrong. Each one is paired with the live thing on this dashboard you can watch for it.
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
