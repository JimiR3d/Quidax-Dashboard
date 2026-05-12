import { Check, Minus, X } from "lucide-react"
import { COMPETITORS } from "@/lib/competitive-data"

function ApiBadge({ v }: { v: "yes" | "limited" | "no" }) {
  if (v === "yes")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-positive/40 bg-positive/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-positive">
        <Check className="h-3 w-3" aria-hidden="true" /> yes
      </span>
    )
  if (v === "limited")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-warning">
        <Minus className="h-3 w-3" aria-hidden="true" /> limited
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-destructive">
      <X className="h-3 w-3" aria-hidden="true" /> no
    </span>
  )
}

function FocusDot({ v }: { v: "core" | "secondary" | "none" | "high" | "medium" | "low" }) {
  const map: Record<string, string> = {
    core: "bg-primary",
    high: "bg-primary",
    secondary: "bg-warning",
    medium: "bg-warning",
    none: "bg-muted-foreground/50",
    low: "bg-muted-foreground/50",
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs capitalize">
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${map[v]}`} aria-hidden="true" />
      {v}
    </span>
  )
}

export function CompetitiveMatrix() {
  return (
    <section id="competition" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          04 · Competitive positioning
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          Only Quidax owns the &quot;NGN-native + API-first&quot; quadrant
        </p>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Yellow Card wins on pan-African breadth. Busha wins on retail UX. Luno wins on brand. Nobody else competes with Quidax on{" "}
          <span className="text-foreground">deep NGN liquidity exposed as a production-grade API</span>. That is the moat — and it is currently under-monetized.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-secondary/40 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Positioning</th>
                <th className="px-4 py-3">B2B API</th>
                <th className="px-4 py-3 text-right">NGN pairs</th>
                <th className="px-4 py-3">NGN focus</th>
                <th className="px-4 py-3 text-right">Africa countries</th>
                <th className="px-4 py-3">Stablecoin focus</th>
                <th className="px-4 py-3">Notable edge</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map((c) => {
                const isQuidax = c.name === "Quidax"
                return (
                  <tr
                    key={c.name}
                    className={`border-b border-border/40 last:border-0 ${
                      isQuidax ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.name}</span>
                        {isQuidax && (
                          <span className="rounded-md border border-primary/40 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-primary">
                            subject
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{c.positioning}</td>
                    <td className="px-4 py-4">
                      <ApiBadge v={c.b2bApi} />
                    </td>
                    <td className="px-4 py-4 text-right font-mono">{c.ngnPairs}</td>
                    <td className="px-4 py-4">
                      <FocusDot v={c.ngnFocus} />
                    </td>
                    <td className="px-4 py-4 text-right font-mono">{c.africaCountries}</td>
                    <td className="px-4 py-4">
                      <FocusDot v={c.stablecoinFocus} />
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{c.notableEdge}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
