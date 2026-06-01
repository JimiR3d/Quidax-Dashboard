"use client"

import { ArrowUpRight } from "lucide-react"
import { ConnectSection } from "@/components/ui/connect-with-us"
import { CinematicFooter } from "@/components/ui/motion-footer"
import { HoverButton } from "@/components/ui/hover-button"

/**
 * Pitch footer — Phase 1 content restored.
 * Lamp component removed per user request.
 * CinematicFooter retained for scroll-triggered marquee bands.
 */
export function PitchFooter() {
  return (
    <CinematicFooter>
      <div className="flex flex-col items-center text-center w-full max-w-4xl mx-auto">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-glow" aria-hidden="true" />
          Made for the Quidax team
        </span>
        <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl text-foreground">
          I built this because I want to help Quidax win the{" "}
          <span className="text-gradient-primary font-black">B2B layer</span> of African crypto.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-8 w-full max-w-6xl mx-auto text-left">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            I'm <span className="text-foreground font-medium">Oluwafolajinmi David Aboderin</span>. Computer Science from Covenant University. Data and backend background at Qucoon (Basel regulatory reporting, financial data pipelines for a Nigerian Tier-1 bank). I spent the last two weeks studying Quidax: the product, the API, the competitors, and the regulatory ground you're standing on. 📚
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            This dashboard isn't a portfolio piece. It's an analyst's job application. If any of it is useful, I'd like to do this kind of work on the Quidax data, product, or strategy team, full-time, contract, or internship. I can start tomorrow. 🤝
          </p>

          <div className="mt-2">
            <ConnectSection />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border/50 bg-background/40 backdrop-blur-md p-6">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              What I'd bring on day one
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2 text-foreground/80">
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                Production data pipelines (SQL, Python, dbt-style)
              </li>
              <li className="flex items-start gap-2 text-foreground/80">
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                Regulator-grade reporting (Basel III experience)
              </li>
              <li className="flex items-start gap-2 text-foreground/80">
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                Backend engineering (PHP, Python, API design)
              </li>
              <li className="flex items-start gap-2 text-foreground/80">
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                Product thinking: this dashboard is the proof
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12 w-full max-w-6xl mx-auto border-t border-border/30 pt-6 pb-12">
        <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-4xl">
          <strong>Disclaimer:</strong> This analysis is independent and not affiliated with, endorsed by, or prepared by Quidax Technologies Limited. All market data is sourced from public APIs and reports. Competitor information is based on public sources and may not be current. This is for informational purposes only and not investment advice.
        </p>
      </div>
    </CinematicFooter>
  )
}
