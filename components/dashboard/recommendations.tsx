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
          10 · Five things I would ship next
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          From thesis to roadmap
        </p>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          These are the moves I would prioritize if I were sitting on the Quidax product or data team tomorrow. Each is tied to a measurable outcome in the model above.
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
