import { ArrowDownRight } from "lucide-react"

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
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,_oklch(0.78_0.14_200/_0.22),_transparent_60%)]" />
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            Independent analysis · prepared for the Quidax team
          </span>
          <h1 className="mt-4 max-w-4xl text-pretty text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Nigeria&apos;s next billion dollars of crypto flow is{" "}
            <span className="text-primary">B2B</span>, not retail.
          </h1>
          <p className="mt-6 max-w-3xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            This dashboard quantifies the NGN-stablecoin liquidity gap, benchmarks Quidax against Yellow Card, Busha, Luno, and Roqqu, and sizes four B2B segments where{" "}
            <span className="text-foreground">Quidax-as-a-Service</span> can compound revenue with structurally lower CAC than the retail order book.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 font-mono text-xs text-muted-foreground">
            <div className="flex flex-col">
              <span className="uppercase tracking-widest">Author</span>
              <span className="mt-1 text-sm text-foreground">Oluwafolajinmi David Aboderin</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-widest">Data source</span>
              <span className="mt-1 text-sm text-foreground">Quidax public markets API + analyst model</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-widest">Generated</span>
              <span className="mt-1 text-sm text-foreground">{date}</span>
            </div>
          </div>

          <a
            href="#kpis"
            className="mt-12 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Scroll to the data
            <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
