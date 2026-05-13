import { Mail } from "lucide-react"
import type { SnapshotSource } from "@/lib/quidax"
import { HeaderSourcePill } from "./header-source-pill"

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

type Props = {
  snapshotSource: SnapshotSource
  fetchedAt?: string | null
}

/**
 * The header keeps the analysis surface dispassionate. The "Hire me" CTA
 * is intentionally NOT here — it lives once, in the pitch footer — so the
 * candidate framing doesn't bleed into the data the reader is evaluating.
 * The status pill is a live client subcomponent that ticks every second
 * up to 15s, sharing the SWR cache with the proof strip.
 */
export function SiteHeader({ snapshotSource, fetchedAt = null }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <BrandMark />
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              NGN Liquidity Intelligence
            </span>
            <span className="text-sm font-medium">
              A B2B growth thesis for{" "}
              <span className="text-gradient-primary font-semibold">Quidax</span>
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex" aria-label="Section navigation">
          <a href="#fx" className="hover:text-foreground transition-colors">FX</a>
          <a href="#cngn" className="hover:text-foreground transition-colors">cNGN</a>
          <a href="#stablecoins" className="hover:text-foreground transition-colors">Stablecoins</a>
          <a href="#competition" className="hover:text-foreground transition-colors">Competition</a>
          <a href="#b2b" className="hover:text-foreground transition-colors">B2B</a>
          <a href="#corridors" className="hover:text-foreground transition-colors">Corridors</a>
          <a href="#thesis" className="hover:text-foreground transition-colors">Thesis</a>
        </nav>

        <div className="flex items-center gap-2">
          <HeaderSourcePill initialSource={snapshotSource} initialFetchedAt={fetchedAt} />
          <a
            href="/methodology"
            className="hidden lg:inline-flex items-center rounded-md border border-border/60 bg-secondary/30 px-3 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:border-primary/40 hover:text-foreground"
          >
            Methodology
          </a>
          <a
            href="mailto:folajinmi13@gmail.com"
            className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-3 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:border-primary/40 hover:text-foreground"
            aria-label="Email the author"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Contact
          </a>
        </div>
      </div>
    </header>
  )
}
