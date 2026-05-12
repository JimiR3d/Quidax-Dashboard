import { ArrowDownRight, Sparkles } from "lucide-react"

export function Hero({ fetchedAt }: { fetchedAt: string }) {
  const date = new Date(fetchedAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })
  return (
    <section className="relative isolate overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-grid opacity-50" aria-hidden="true" />
      <div className="absolute inset-0 bg-noise opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[1100px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.65 0.22 295 / 0.45), oklch(0.78 0.12 320 / 0.18) 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Independent analysis · prepared for the Quidax team
          </span>
          <h1 className="mt-6 max-w-4xl text-pretty text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Nigeria&apos;s next billion dollars of crypto flow is{" "}
            <span className="text-gradient-primary">B2B</span>,
            <br className="hidden md:block" /> not retail.
          </h1>
          <p className="mt-7 max-w-3xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            This dashboard quantifies the NGN-stablecoin liquidity gap, benchmarks Quidax against Yellow Card, Busha, Luno, and Roqqu, and sizes four B2B segments where{" "}
            <span className="text-foreground">Quidax-as-a-Service</span> can compound revenue with structurally lower CAC than the retail order book.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="card-elev rounded-lg p-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Author
              </span>
              <p className="mt-2 text-sm font-medium text-foreground">
                Oluwafolajinmi David Aboderin
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Data &amp; backend · Covenant CS · ex-Qucoon
              </p>
            </div>
            <div className="card-elev rounded-lg p-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Data source
              </span>
              <p className="mt-2 text-sm font-medium text-foreground">
                Quidax public markets API
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                app.quidax.io · 60s ISR · analyst model overlays
              </p>
            </div>
            <div className="card-elev rounded-lg p-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Generated
              </span>
              <p className="mt-2 text-sm font-medium text-foreground">{date}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Auto-refreshes server-side every minute
              </p>
            </div>
          </div>

          <a
            href="#kpis"
            className="mt-12 inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            Scroll to the data
            <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
