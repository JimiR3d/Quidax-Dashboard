import { Mail } from "lucide-react"

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
        className="relative font-mono text-base font-semibold leading-none text-white"
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

export function SiteHeader({ source }: { source: "live" | "simulated" }) {
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

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#kpis" className="hover:text-foreground transition-colors">
            Snapshot
          </a>
          <a href="#market" className="hover:text-foreground transition-colors">
            Market
          </a>
          <a href="#stablecoins" className="hover:text-foreground transition-colors">
            Stablecoins
          </a>
          <a href="#competition" className="hover:text-foreground transition-colors">
            Competition
          </a>
          <a href="#b2b" className="hover:text-foreground transition-colors">
            B2B
          </a>
          <a href="#thesis" className="hover:text-foreground transition-colors">
            Thesis
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <span
            className={`hidden md:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${
              source === "live"
                ? "border-positive/40 bg-positive/10 text-positive"
                : "border-warning/40 bg-warning/10 text-warning"
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                source === "live" ? "bg-positive animate-pulse" : "bg-warning"
              }`}
              aria-hidden="true"
            />
            {source === "live" ? "Live · Quidax API" : "Simulated snapshot"}
          </span>
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
