import { AlertTriangle } from "lucide-react"

/**
 * Counter-thesis section.
 *
 * Every B2B thesis ships with conditions under which it's wrong. Reading
 * those conditions is how a serious analyst stress-tests the case before
 * committing capital or hiring. We make them explicit and pair each one
 * with the on-page surface that would betray it first — so a reader can
 * literally watch for the falsifier.
 */

const FALSIFIERS = [
  {
    headline: "Retail trading explodes again, and B2B becomes a sideshow.",
    body: "This whole dashboard bets that B2B is the next big growth engine. But if Nigerian retail crypto volume goes completely crazy again—like if another big currency shift pushes everyone into dollars—then B2B API revenue might just look like pocket change. If that happens, defending the consumer business becomes priority #1. 📉",
    watch: "USDT/NGN volume and 24-hour change in the live KPI grid above.",
  },
  {
    headline: "cNGN flops, and our regulatory head start doesn't matter.",
    body: "Quidax's massive edge right now is the SEC ARIP licence and our super-early cNGN listing. But guess what? Busha also has an ARIP licence and listed cNGN first. If people don't actually end up using cNGN, and Busha matches our Naira liquidity, that shiny first-mover advantage shrinks fast.",
    watch: "cNGN/NGN price and the cNGN deep-dive section.",
  },
  {
    headline: "A big traditional bank actually builds a fast, cheap stablecoin rail.",
    body: "The only reason the 'Corridor' strategy works is because stablecoins are way cheaper and faster than traditional banks. If a major tier-1 Nigerian bank wakes up and launches a low-cost, same-day cross-border product that actually works, our massive speed and cost advantages vanish overnight.",
    watch: "Bank-wire vs stablecoin-rail fees in the corridor cards.",
  },
  {
    headline: "Fees crash to zero, and the math stops making sense.",
    body: "Our models assume we can charge a fair fee (like 20 to 60 bps) for this B2B magic. But if competitors start a race to the bottom, or regulators cap pricing below 10 bps, we'd have to capture twice as much market share just to make the same revenue. And honestly, doubling market share isn't exactly easy.",
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
            12 · The Reality Check ⚠️
          </p>
          <h2
            id="counter-thesis-title"
            className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl text-balance"
          >
            What could totally blow up this plan?
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            We don't do "yes-men" here. A strategy is only good if you know how it fails. Here are four things that would prove this entire dashboard wrong, and exactly which metrics to watch so you aren't caught off guard.
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
