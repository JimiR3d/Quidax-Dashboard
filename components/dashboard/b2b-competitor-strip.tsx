import { ExternalLink } from "lucide-react"
import { B2B_COMPETITORS } from "@/lib/competitive-data"

/**
 * Audit fix [2]/[Medium]: the original analysis only enumerated crypto
 * exchanges. The Quidax buyer's first question is "what about Conduit and
 * Bitnob?" — so we now surface the B2B-only rails as a separate, labeled
 * comparison. Notably non-exchange players don't carry an NGN-spot order
 * book; comparing them on NGN-pair count is a category error, hence the
 * separate component.
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
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
        >
          06b · B2B-only rails · non-exchange competitors
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          The other thing a fintech CTO is comparing Quidax against
        </p>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Conduit, Bitnob, Yellow Card Payments, and Onafriq operate the
          alternative stack a buyer would consider for Quidax-as-a-Service.
          They don&apos;t run an NGN-spot order book, so they&apos;re compared
          on rails coverage and regulatory surface rather than pair count.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {B2B_COMPETITORS.map((c) => (
          <article
            key={c.name}
            className="card-elev rounded-xl border border-border/60 p-5"
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.positioning}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <LicenseBadge v={c.ngLicense} />
                <span
                  className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                    c.publicApi
                      ? "border-positive/40 bg-positive/10 text-positive"
                      : "border-warning/40 bg-warning/10 text-warning"
                  }`}
                >
                  Public API: {c.publicApi ? "yes" : "no"}
                </span>
              </div>
            </header>

            <div className="mt-3">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Primary corridors
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {c.primaryCorridors.map((p) => (
                  <span
                    key={p}
                    className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-xs tracking-wide text-primary"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {c.caveat && (
              <p className="mt-3 text-xs italic leading-relaxed text-warning">{c.caveat}</p>
            )}

            <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span className="font-mono tabular-nums">verified {c.verifiedAt}</span>
              <div className="flex flex-wrap gap-2">
                {c.sources.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    {s.label} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}

function LicenseBadge({ v }: { v: "vasp" | "none" | "unknown" }) {
  const map = {
    vasp: { label: "NG VASP", classes: "border-positive/40 bg-positive/10 text-positive" },
    none: { label: "No NG license", classes: "border-warning/40 bg-warning/10 text-warning" },
    unknown: { label: "License unknown", classes: "border-border bg-secondary/40 text-muted-foreground" },
  }
  const m = map[v]
  return (
    <span
      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${m.classes}`}
    >
      {m.label}
    </span>
  )
}
