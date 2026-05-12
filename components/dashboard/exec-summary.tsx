import { Target, TrendingUp, Layers, ShieldCheck } from "lucide-react"

const POINTS = [
  {
    icon: Target,
    title: "The thesis",
    body:
      "Retail volume is a feature of Nigeria's crypto market — settlement, treasury, and remittance are the business model. Quidax already owns the only NGN-native + API-first quadrant.",
  },
  {
    icon: TrendingUp,
    title: "The wedge",
    body:
      "USDT trades at a persistent premium to CBN's official window, and ~68% of NGN crypto turnover is stablecoin-denominated. cNGN listing gives Quidax a regulated rail no other local player has.",
  },
  {
    icon: Layers,
    title: "The model",
    body:
      "Four B2B segments — cross-border settlement, remittance, fintech treasury, and embedded crypto — combine into a defensible 24-month revenue ramp at mid-case capture.",
  },
  {
    icon: ShieldCheck,
    title: "The moat",
    body:
      "SEC licensing, cNGN integration, and a public Liquidity SLA convert today's compliance cost into a regulated-infrastructure premium that Yellow Card and Busha cannot match locally.",
  },
]

export function ExecSummary() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-6 md:px-6">
      <div className="rounded-2xl card-elev p-6 md:p-8">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            TL;DR for the busy operator
          </span>
          <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
            Four moves, one moat, one number.
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
