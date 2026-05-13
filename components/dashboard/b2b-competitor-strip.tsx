import { ExternalLink } from "lucide-react"
import { B2B_ONLY_COMPETITORS } from "@/lib/competitive-data"

/**
 * Audit fix: the exchange matrix only enumerates retail exchanges. The
 * Quidax B2B buyer's first question is "what about Conduit and Bitnob?",
 * so we surface the B2B-only stack as a separate, deliberately-different
 * comparison. These players don't run an NGN-spot order book, so comparing
 * them on NGN pair count would be a category error.
 */
export function B2BCompetitorStrip() {
  return (
    <section
      id="b2b-rails"
      className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6"
      aria-labelledby="b2b-rails-heading"
    >
      <div className="mb-6 flex flex-col gap-1">
        <h2
          id="b2b-rails-heading"
          className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
        >
          06b · B2B-only rails · non-exchange competitors
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          The other stack a fintech CTO is comparing Quidax against
        </p>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Conduit, Bitnob, Stables, and Yellow Card OTC operate the alternative B2B stack a
          buyer would consider for Quidax-as-a-Service. They don&apos;t run an NGN-spot
          order book, so they&apos;re shown here separately rather than in the retail matrix
          above. Each row carries its own &quot;verified at&quot; date.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {B2B_ONLY_COMPETITORS.map((c) => (
          <article
            key={c.name}
            className="card-elev rounded-xl border border-border/60 p-5"
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">{c.name}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary">
                  {c.type}
                </p>
              </div>
              {c.link && (
                <a
                  href={c.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-secondary/30 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  Visit <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              )}
            </header>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">{c.notable}</p>
            <footer className="mt-4 border-t border-border/60 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Verified {c.verifiedAt}
            </footer>
          </article>
        ))}
      </div>

      <p className="mt-4 max-w-3xl text-[11px] text-muted-foreground">
        These are real adjacent buyers, not direct retail competitors. They sit closer to
        Quidax-as-an-API than to the retail order book — which is exactly why the B2B sizing
        below treats &quot;embedded crypto&quot; and &quot;cross-border settlement&quot; as
        distinct revenue lines.
      </p>
    </section>
  )
}
