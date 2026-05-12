import { QUIDAX_B2B_CUSTOMERS } from "@/lib/insights"

export function CustomerProof() {
  return (
    <section className="container mx-auto px-4 lg:px-8 mt-12" aria-labelledby="customers-title">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">B2B Validation</p>
        <h2 id="customers-title" className="mt-2 text-3xl font-semibold tracking-tight text-balance">
          The B2B thesis is already shipping
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Quidax-as-a-Service is not a roadmap item — it is live revenue. Three named fintechs already settle real
          flows through Quidax&apos;s API today. The TAM model below treats these as the wedge, not the ceiling.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {QUIDAX_B2B_CUSTOMERS.map((c, idx) => (
          <article
            key={c.name}
            className="card-elev group relative overflow-hidden rounded-xl p-5 transition hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 ring-1 ring-primary/40">
                <span className="text-sm font-semibold tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Live customer</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">{c.name}</h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary">{c.category}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
            <p className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground">Source: {c.source}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
