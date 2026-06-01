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

function FocusDot({
  v,
}: {
  v: "core" | "secondary" | "none" | "high" | "medium" | "low"
}) {
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
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${map[v]}`}
        aria-hidden="true"
      />
      {v}
    </span>
  )
}

function LicenseBadge({ v }: { v: "yes" | "applying" | "no" | "unknown" }) {
  if (v === "yes")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-positive/40 bg-positive/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-positive">
        SEC
      </span>
    )
  if (v === "applying")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-warning">
        applying
      </span>
    )
  if (v === "no")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-destructive">
        none
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      unknown
    </span>
  )
}

function ConfidencePill({ c }: { c: "Verified" | "Estimated / Proxy" | "Derived / Analyst estimate" | "Company-announced" | "Certificate of Entry" | "SEC-provisional" | "Snapshot Input" | "high" | "med" | "low" }) {
  const isHigh = c === "high" || c === "Verified" || c === "SEC-provisional" || c === "Certificate of Entry"
  const isMed = c === "med" || c === "Company-announced" || c === "Snapshot Input"
  
  let classes = "border-muted bg-secondary/30 text-muted-foreground" // low
  if (isHigh) classes = "border-positive/30 bg-positive/10 text-positive"
  else if (isMed) classes = "border-warning/30 bg-warning/10 text-warning"

  return (
    <span
      className={`inline-flex items-center rounded border px-1 py-px font-mono text-[9px] uppercase tracking-widest ${classes}`}
    >
      {c}
    </span>
  )
}

export function CompetitiveMatrix() {
  return (
    <section
      id="competition"
      className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6"
    >
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          06 · Who does what, side by side
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          Two players have the full stack. Here's what separates them.
        </p>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Yellow Card has shifted to a B2B-only model across about 20 African countries but isn't deep in naira. Busha now has a strong B2B offering too (APIs, treasury, OTC desk), and they're SEC-licensed like Quidax. Luno is a trusted retail brand without an API. So the real competition is{" "}
          <span className="text-foreground">
            Quidax vs. Busha for the naira B2B API crown
          </span>
          . Quidax's edge: deepest USDT/NGN order book and earliest cNGN listing. That advantage is real but not permanent. 💡
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <p className="border-b border-border/60 bg-secondary/20 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Quidax row is verified live · others manually checked against public sources · each row carries its own confidence rating
          </p>
          <table className="w-full text-sm">
            <caption className="sr-only">
              Competitive positioning matrix for Nigerian and pan-African crypto exchanges
              across B2B API availability, NGN pair count, NGN focus, Africa country
              coverage, stablecoin focus, SEC licensing, and notable competitive edge.
            </caption>
            <thead className="border-b border-border/60 bg-secondary/40 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Positioning</th>
                <th className="px-4 py-3">B2B API</th>
                <th className="px-4 py-3 text-right">Verified NGN markets</th>
                <th className="px-4 py-3">NGN focus</th>
                <th className="px-4 py-3 text-right">Africa countries</th>
                <th className="px-4 py-3">Stablecoin focus</th>
                <th className="px-4 py-3">NG SEC</th>
                <th className="px-4 py-3">Notable edge</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map((c) => {
                const isQuidax = c.name === "Quidax"
                return (
                  <tr
                    key={c.name}
                    className={`border-b border-border/40 align-top last:border-0 ${
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
                      <div className="mt-1 flex items-center gap-1.5">
                        <ConfidencePill c={c.provenance.confidence} />
                        <span className="font-mono text-[9px] text-muted-foreground tabular-nums">
                          v {c.provenance.verifiedAt}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{c.positioning}</td>
                    <td className="px-4 py-4">
                      <ApiBadge v={c.b2bApi} />
                    </td>
                    <td className="px-4 py-4 text-right font-mono tabular-nums">
                      {c.verifiedNgnMarkets}
                    </td>
                    <td className="px-4 py-4">
                      <FocusDot v={c.ngnFocus} />
                    </td>
                    <td className="px-4 py-4 text-right font-mono tabular-nums">
                      {c.africaCountries}
                    </td>
                    <td className="px-4 py-4">
                      <FocusDot v={c.stablecoinFocus} />
                    </td>
                    <td className="px-4 py-4">
                      <LicenseBadge v={c.secLicensed} />
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{c.notableEdge}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        Confidence levels: <span className="text-foreground">high</span> = pulled directly from
        the row&apos;s source; <span className="text-foreground">medium</span> = inferred
        from credible public sources; <span className="text-foreground">low</span> = best
        estimate from market signals. Every source for every row is on the{" "}
        <a href="/methodology" className="underline hover:text-foreground">
          methodology page
        </a>
        .<br />
        <span className="text-muted-foreground/70">* Estimated NGN market depth parity based on supported assets. Busha's UI does not explicitly isolate NGN order books from global pairs.</span>
      </p>
    </section>
  )
}
