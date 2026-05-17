import { Info } from "lucide-react"
import { RECOMMENDATIONS } from "@/lib/competitive-data"

function PriorityBadge({ p }: { p: "P0" | "P1" | "P2" }) {
  const styles =
    p === "P0"
      ? "border-primary/40 bg-primary/10 text-primary"
      : p === "P1"
        ? "border-warning/40 bg-warning/10 text-warning"
        : "border-border bg-secondary/40 text-muted-foreground"
  return (
    <span
      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${styles}`}
    >
      {p}
    </span>
  )
}

export function Recommendations() {
  return (
    <section id="thesis" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          10 · Five things I would build next
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          From idea to roadmap
        </p>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          These are the moves I&apos;d do first if I were on the Quidax product or data team
          tomorrow. Each one ties to a measurable outcome in the model above. Honest note:
          I&apos;m only working from what&apos;s public. Things the Quidax team may already
          be doing internally are flagged.
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {RECOMMENDATIONS.map((r, i) => (
          <li
            key={r.title}
            className="group relative flex flex-col gap-3 rounded-lg border border-border/60 bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-medium leading-snug">{r.title}</h3>
              </div>
              <PriorityBadge p={r.priority} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{r.thesis}</p>
            {r.visibilityCaveat && (
              <p className="flex items-start gap-2 rounded-md border border-border/50 bg-secondary/20 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                <Info
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning"
                  aria-hidden="true"
                />
                <span>
                  <span className="text-foreground/80 font-medium">Visibility note:</span>{" "}
                  {r.visibilityCaveat}
                </span>
              </p>
            )}
            <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Owner
              </span>
              <span className="text-xs text-foreground/90">{r.ownerHint}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
