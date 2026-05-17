import { Target, TrendingUp, Layers, ShieldCheck } from "lucide-react"

const POINTS = [
  {
    icon: Target,
    title: "What I think",
    body:
      "Retail trading is the noisy part of Nigerian crypto. The quiet, growing part — the part that pays bills — is companies using crypto rails to settle, hold, and move money. Quidax is the only Nigerian exchange that's deep in naira AND has a real API, which is exactly what those companies need.",
  },
  {
    icon: TrendingUp,
    title: "Why now",
    body:
      "USDT (the digital dollar) used to cost 20%+ more than the official rate on Quidax. Today the gap is about 1%. That predictability is what makes a fintech CFO comfortable using stablecoins for real settlement. And cNGN — the naira stablecoin Nigeria's SEC actually recognises — is only listed on Quidax. That's a head-start no other local exchange has.",
  },
  {
    icon: Layers,
    title: "Where the revenue comes from",
    body:
      "Four kinds of customers, all paying for the same rails: cross-border settlement (importers, exporters), remittance apps, fintechs that need to park dollars, and apps that want to embed crypto without building it. The math is on this page — you can move my sliders.",
  },
  {
    icon: ShieldCheck,
    title: "Why Yellow Card and Busha can't copy this in a quarter",
    body:
      "The SEC licence, the cNGN listing, and a public uptime promise on the API. Each one takes time to get. Together they turn what looks like a compliance cost into something companies will pay extra for: a regulated, predictable rail.",
  },
]

export function ExecSummary() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-6 md:px-6">
      <div className="rounded-2xl card-elev p-6 md:p-8">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            01 · The short version
          </span>
          <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
            Four moves, one head-start, one number worth chasing.
          </h3>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/40 p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
