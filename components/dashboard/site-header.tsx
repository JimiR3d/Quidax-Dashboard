import { Mail } from "lucide-react"
import type { SnapshotSource } from "@/lib/quidax"

function BrandMark() {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center">
      <div
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-[var(--chart-4)] opacity-90"
        aria-hidden="true"
      />
      <div
        className="absolute inset-px rounded-[7px] bg-background/40 backdrop-blur"
        aria-hidden="true"
      />
      <span
        className="relative font-mono text-base font-semibold leading-none text-primary-foreground"
        aria-hidden="true"
      >
        Q
      </span>
      <span
        className="absolute -inset-1 -z-10 rounded-xl bg-primary/40 blur-xl opacity-60 pulse-glow"
        aria-hidden="true"
      />
    </div>
  )
}

/**
 * The header badge is the project's single source of truth for "what kind
 * of data are you looking at right now". The four states map 1:1 onto
 * `SnapshotSource`; we never collapse them into a "live vs simulated"
 * binary because that would be lying about staleness.
 */
function sourceBadge(source: SnapshotSource): {
  label: string
  classes: string
  dotClass: string
} {
  switch (source) {
    case "live":
      return {
        label: "Live · Quidax API",
        classes: "border-positive/40 bg-positive/10 text-positive",
        dotClass: "bg-positive animate-pulse",
      }
    case "cached":
      return {
        label: "Cached (within 10s)",
        classes: "border-positive/30 bg-positive/5 text-positive",
        dotClass: "bg-positive",
      }
    case "lkg":
      return {
        label: "Stale · upstream unreachable",
        classes: "border-warning/40 bg-warning/10 text-warning",
        dotClass: "bg-warning",
      }
    case "empty":
      return {
        label: "No live data available",
        classes: "border-destructive/40 bg-destructive/10 text-destructive",
        dotClass: "bg-destructive",
      }
  }
}

export function SiteHeader({ snapshotSource }: { snapshotSource: SnapshotSource }) {
  const badge = sourceBadge(snapshotSource)
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <BrandMark />
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              NGN Liquidity Intelligence
            </span>
            <span className="text-sm font-medium">
              A B2B growth thesis for{" "}
              <span className="text-gradient-primary font-semibold">Quidax</span>
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          <a href="#fx" className="hover:text-foreground transition-colors">FX</a>
          <a href="#cngn" className="hover:text-foreground transition-colors">cNGN</a>
          <a href="#stablecoins" className="hover:text-foreground transition-colors">Stablecoins</a>
          <a href="#competition" className="hover:text-foreground transition-colors">Competition</a>
          <a href="#b2b" className="hover:text-foreground transition-colors">B2B</a>
          <a href="#corridors" className="hover:text-foreground transition-colors">Corridors</a>
          <a href="#thesis" className="hover:text-foreground transition-colors">Thesis</a>
        </nav>

        <div className="flex items-center gap-2">
          <span
            className={`hidden md:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${badge.classes}`}
            aria-live="polite"
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${badge.dotClass}`}
              aria-hidden="true"
            />
            {badge.label}
          </span>
          <a
            href="/methodology"
            className="hidden lg:inline-flex items-center rounded-md border border-border/60 bg-secondary/30 px-3 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:border-primary/40 hover:text-foreground"
          >
            Methodology
          </a>
          <a
            href="mailto:folajinmi13@gmail.com"
            className="inline-flex items-center gap-2 rounded-md bg-primary/90 px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Hire me
          </a>
        </div>
      </div>
    </header>
  )
}
