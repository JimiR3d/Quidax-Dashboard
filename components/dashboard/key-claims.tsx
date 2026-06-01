"use client"

import { TrendingUp, ShieldCheck, Network, Banknote, Gauge } from "lucide-react"
import { motion } from "framer-motion"
import { GlowCard } from "@/components/ui/spotlight-card"

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
    label: "The naira-dollar gap closed",
    body: "Buying USDT on Quidax now costs approximately 1–2.5% of the official CBN rate, down from years when crypto was materially above official-rate parity, mirroring parallel market premiums of 20–50%. 📉",
    href: "/market",
  },
  {
    icon: ShieldCheck,
    label: "Quidax was a pioneer on cNGN",
    body: "cNGN is the naira stablecoin Nigeria's SEC actually recognises — issued by the African Stablecoin Consortium (ASC) under SEC ARIP oversight. Busha listed it first on February 3, 2025 (per TechCabal); Quidax followed on March 12, 2025 (per Quidax corporate blog). Quidax's cNGN/NGN order book remains the deepest among Nigerian exchanges. 🏆",
    href: "/stablecoins",
  },
  {
    icon: TrendingUp,
    label: "People want stable, not speculative",
    body: "Roughly 86% of the naira flowing into crypto on exchanges goes into stablecoins (analyst estimate calibrated against Chainalysis and TRM Labs data — not a directly measured figure). Nigerians are using them as their new dollar account. 💵",
    href: "/stablecoins",
  },
  {
    icon: Network,
    label: "Quidax has a head start, but it's a race",
    body: "Naira-deep, API-first, SEC-licensed (ARIP cohort), first-month cNGN listing. Busha now checks most of those boxes too. Quidax's edge is order book depth and existing B2B customers. That lead is real but not permanent. 🛡️",
    href: "/competition",
  },
  {
    icon: Banknote,
    label: "The opportunity, in one number",
    body: "Selling Quidax's rails to other businesses could add roughly $4 to $14 million a year, across four buyer segments. Modeled, assumptions shown below. 💰",
    href: "/opportunity",
  },
] as const

export function KeyClaims() {
  return (
    <section
      aria-label="Five key claims"
      className="mx-auto w-full max-w-7xl px-4 pt-6 md:px-6"
    >
      <div className="rounded-2xl border border-border/60 bg-card/30 p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
            The whole story, in five lines
          </h2>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary/80">
            tap one to see the proof ↓
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CLAIMS.map((c, i) => {
            const Icon = c.icon
            return (
              <GlowCard key={c.label} className="h-full group">
                <a
                  href={c.href}
                  className="relative z-10 flex h-full flex-col gap-2 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Floating icon effect on hover */}
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_8px_-1px_rgba(255,149,0,0.4),inset_1px_1px_2px_rgba(255,255,255,0.2)]"
                    >
                      <Icon
                        className="h-4 w-4 text-primary transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  
                  {/* Content styling */}
                  <p 
                    className="text-xs font-medium uppercase tracking-wider text-primary mt-2 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,149,0,0.3)]"
                  >
                    {c.label}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">{c.body}</p>
                </a>
              </GlowCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
