import { Activity } from "lucide-react"

export function SiteHeader({ source }: { source: "live" | "simulated" }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              NGN Liquidity Intelligence
            </span>
            <span className="text-sm font-medium">
              A B2B growth thesis for{" "}
              <span className="text-primary">Quidax</span>
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
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
            B2B Opportunity
          </a>
          <a href="#thesis" className="hover:text-foreground transition-colors">
            Thesis
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${
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
        </div>
      </div>
    </header>
  )
}
