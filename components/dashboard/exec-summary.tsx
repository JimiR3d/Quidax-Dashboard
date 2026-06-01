import { Target, TrendingUp, Layers, ShieldCheck } from "lucide-react"

const POINTS = [
  {
    icon: Target,
    title: "The thesis",
    body:
      "Everyone talks about retail trading in Nigerian crypto. But the part that actually pays the bills is quieter: companies using crypto rails to settle, hold, and move money. Quidax goes deep on naira AND has a real API. That's exactly what those companies need. 🎯",
  },
  {
    icon: TrendingUp,
    title: "Why now",
    body:
      "USDT (the digital dollar) used to cost materially more than the official rate on Quidax, mirroring parallel market premiums of 20–50%. Today the gap is approximately 1–2.5%. That kind of predictability is what makes a fintech CFO comfortable using stablecoins for real settlement. And cNGN, the naira stablecoin issued by ASC under SEC ARIP oversight, was listed on Quidax on March 12, 2025 (per Quidax corporate blog), five weeks after Busha's February 3, 2025 debut (per TechCabal). That early-mover advantage still counts. 📈",
  },
  {
    icon: Layers,
    title: "Where the revenue comes from",
    body:
      "Four kinds of customers, all paying for the same rails: cross-border settlement (importers, exporters), remittance apps, fintechs that need to park dollars, and apps that want to embed crypto without building it. The math is on this page. The sliders below let you test the assumptions yourself.",
  },
  {
    icon: ShieldCheck,
    title: "Why the head start matters",
    body:
      "The SEC ARIP licence, early cNGN listing (March 12, 2025), and deepest USDT/NGN order book. Busha is catching up with its own B2B stack and listed cNGN first (February 3, 2025), but Quidax's naira liquidity depth and existing B2B customer base (HeliCode, Lisk, Gigxpad) are hard to replicate overnight. 🛡️",
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
            Four moves, one headstart, one number worth chasing.
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
