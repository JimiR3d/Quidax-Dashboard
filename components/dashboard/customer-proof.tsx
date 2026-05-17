import { QUIDAX_B2B_CUSTOMERS } from "@/lib/insights"

export function CustomerProof() {
  return (
    <section id="customers" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6" aria-labelledby="customers-title">
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary">09 · The proof it&apos;s already working</p>
        <h2 id="customers-title" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl text-balance">
          Companies are already using Quidax this way &mdash; today
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Selling Quidax-as-a-Service isn&apos;t something on a roadmap &mdash; three named fintechs publicly say they connect to Quidax&apos;s API for naira-stablecoin flow. The opportunity model below treats them as the head-start, not the ceiling. Volume per partner isn&apos;t public, so think of these cards as proof that the integration works, not a guess at revenue.
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
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Confirmed integration</span>
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
