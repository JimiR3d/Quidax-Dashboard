import { Mail, Linkedin, Github, ArrowUpRight } from "lucide-react"

export function PitchFooter() {
  return (
    <footer className="relative isolate mt-12 overflow-hidden border-t border-border/60 bg-card/30">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80"
        style={{
          background:
            "radial-gradient(ellipse at top, oklch(0.62 0.27 305 / 0.26), transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-noise opacity-40" aria-hidden="true" />
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-glow" aria-hidden="true" />
              Built for the Quidax team
            </span>
            <h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
              I built this because I want to help Quidax win the{" "}
              <span className="text-gradient-primary">B2B layer</span> of African crypto.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              I&apos;m <span className="text-foreground font-medium">Oluwafolajinmi David Aboderin</span>. Computer Science from Covenant, data &amp; backend background at Qucoon (Basel regulatory reporting, financial data pipelines), and I&apos;ve spent the last two weeks studying Quidax — your product, your API, your competitors, and the regulatory surface you&apos;re about to operate inside.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              This dashboard is not a portfolio piece. It is a candidate analyst report. If any of it is useful, I&apos;d like to do this kind of work on the Quidax data, product, or strategy team — full-time, contract, or internship. I&apos;m ready to start tomorrow.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="mailto:folajinmi13@gmail.com"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                folajinmi13@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/oluwafolajinmi-aboderin-695848249/"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                LinkedIn
              </a>
              <a
                href="https://github.com/JimiR3d"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                @JimiR3d
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="card-elev rounded-xl p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                What I&apos;d bring on day one
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Production data pipelines (SQL, Python, dbt-style modeling)
                </li>
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Regulatory-grade reporting (Basel III at a Nigerian Tier-1 bank stack)
                </li>
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Backend engineering (PHP / Python / API design)
                </li>
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Product thinking: this dashboard is exhibit A
                </li>
              </ul>
            </div>
            <div className="card-elev rounded-xl p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Method note
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Live tickers fetched from{" "}
                <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[11px] text-foreground">
                  app.quidax.io/api/v1/markets/tickers
                </code>{" "}
                with 60s revalidation. Where the upstream is unavailable, a static snapshot renders so the analysis is always inspectable. Premium series, volume mix, and B2B opportunity sizing are analyst estimates explicitly labeled as such.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>
            © {new Date().getFullYear()} Oluwafolajinmi David Aboderin · Independent analysis, no Quidax affiliation.
          </span>
          <span className="font-mono uppercase tracking-[0.2em]">
            v1.0 · NGN Liquidity Intelligence
          </span>
        </div>
      </div>
    </footer>
  )
}
