import { Target, TrendingUp, Layers, ShieldCheck } from "lucide-react"

const POINTS = [
  {
    icon: Target,
    title: "The big idea",
    body:
      "Regular users trading is one slice of Nigeria's crypto market. The real business is helping companies move money — for payments, treasury, and remittances. Quidax is the only local exchange built for this.",
  },
  {
    icon: TrendingUp,
    title: "The opening",
    body:
      "USDT (a digital dollar) used to trade more than 20% above Nigeria's official dollar rate on Quidax. Today the gap is under 1%. That means stablecoins now work as a real money rail — and Quidax is the only Nigerian exchange listing cNGN, the regulated naira stablecoin.",
  },
  {
    icon: Layers,
    title: "The model",
    body:
      "Four business areas — moving money across borders, remittances home, fintech treasury, and embedded crypto features — together create a 24-month revenue path at a sensible share of the market.",
  },
  {
    icon: ShieldCheck,
    title: "The protection",
    body:
      "Quidax's SEC license, cNGN listing, and a public promise on liquidity turn today's compliance work into a real edge that Yellow Card and Busha can't easily match in Nigeria.",
  },
]

export function ExecSummary() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-6 md:px-6">
      <div className="rounded-2xl card-elev p-6 md:p-8">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            01 · The summary
          </span>
          <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
            Four moves, one advantage, one number.
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
