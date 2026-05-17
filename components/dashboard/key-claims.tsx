import { TrendingUp, ShieldCheck, Network, Banknote, Gauge } from "lucide-react"

/**
 * Above-the-fold "5 key claims" strip.
 *
 * Each claim is the one-line version of a section below; clicking jumps
 * straight to the evidence. The point is to let a reader in a hurry
 * (the buying audience for this report) extract the entire thesis in
 * under thirty seconds without scrolling past the masthead.
 *
 * Every claim links to the section that backs it up with live data or
 * a labelled analyst model. We do NOT make a sixth claim, because five
 * is what fits in a single visual sweep on a 13" laptop.
 */
const CLAIMS = [
  {
    icon: Gauge,
    label: "The gap is closing",
    body: "Quidax's USDT–to–naira price now sits within ~1% of the official dollar rate — after years of being far above it.",
    href: "#fx",
  },
  {
    icon: ShieldCheck,
    label: "Regulated edge",
    body: "Quidax is the only Nigerian exchange that lists cNGN, the SEC-recognised naira stablecoin.",
    href: "#cngn",
  },
  {
    icon: TrendingUp,
    label: "People save, not gamble",
    body: "About 86% of naira trading on the exchange goes through stablecoins — Nigerians use them as a steady FX layer, not for speculation.",
    href: "#stablecoins",
  },
  {
    icon: Network,
    label: "Defensible position",
    body: "Quidax is the only player with deep naira liquidity AND a developer API. Yellow Card and Busha don't do both.",
    href: "#competition",
  },
  {
    icon: Banknote,
    label: "The number",
    body: "A modeled $4–14M per year in business-customer revenue at mid-case across four areas.",
    href: "#b2b",
  },
] as const

export function KeyClaims() {
  return (
    <section
      aria-label="Five key claims"
      className="mx-auto w-full max-w-7xl px-4 pt-6 md:px-6"
    >
      <div className="rounded-2xl border border-border/60 bg-card/30 p-4 md:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            The whole story, in five lines
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            see the proof ↓
          </span>
        </div>
        <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CLAIMS.map((c, i) => {
            const Icon = c.icon
            return (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="group flex h-full flex-col gap-2 rounded-xl border border-border/60 bg-background/40 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      className="h-4 w-4 text-primary/80 transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">
                    {c.label}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">{c.body}</p>
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
