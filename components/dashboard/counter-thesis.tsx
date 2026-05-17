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
    headline: "If regular-user trading keeps growing fast, the business-customer angle is a side-show.",
    body: "This whole story assumes regular-user growth is slowing relative to business demand. If retail crypto trading in Nigeria takes off again — say, on another big naira drop that sends people running to dollars — then API revenue is small change, and the right move is to defend the regular-user side instead.",
    watch: "USDT/NGN volume and 24-hour change in the live KPI grid above.",
  },
  {
    headline: "If cNGN never gets used by serious institutions, the regulated edge falls apart.",
    body: "Quidax's edge over Yellow Card depends on the SEC license + cNGN listing actually being useful. If cNGN volume stays tiny through 2026 — meaning the asset exists but no bank, fintech, or treasury actually routes money through it — the regulatory edge is worth nothing, and Yellow Card's larger footprint wins.",
    watch: "cNGN/NGN price and the cNGN volume chart in the deep-dive section.",
  },
  {
    headline: "If a bank ships a real stablecoin rail, the cross-border story collapses fast.",
    body: "The cross-border revenue case rests on stablecoin rails being clearly cheaper and faster than the banking system. If a tier-1 Nigerian bank launches a cheap, instant cross-border product (think NIBSS-style for FX), the cost saving in the corridor cards shrinks to almost nothing and the speed advantage disappears.",
    watch: "Bank wire vs stablecoin cost savings in the corridor cards.",
  },
  {
    headline: "If fees get squeezed too low, the per-area revenue math breaks.",
    body: "The middle-case sliders assume Quidax keeps 20–60 basis points (0.2–0.6%) on each transaction. If competition or regulator-mandated price caps push fees below 10 bps across all four areas, you'd need more than double the market share to hit the same revenue — and market share is the harder lever to move.",
    watch: "The fee sliders in the business-customer opportunity section.",
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
            12 · How this could be wrong
          </p>
          <h2
            id="counter-thesis-title"
            className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl text-balance"
          >
            Four things that would make me retract this whole analysis
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            An idea is only useful if it can be proven wrong. These are the four signals that would tell me
            the rest of the page is off. Each one is paired with the live part of this dashboard that would
            show it first — so you can literally watch for it.
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
