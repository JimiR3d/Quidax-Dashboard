import { Mail, Linkedin, Github, ArrowUpRight } from "lucide-react"

export function PitchFooter() {
  return (
    <footer className="relative isolate mt-12 overflow-hidden border-t border-border/60 bg-card/40">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,_oklch(0.78_0.14_200/_0.18),_transparent_60%)]" />
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Built for the Quidax team
            </span>
            <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              I built this because I want to help Quidax win the B2B layer of African crypto.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              I&apos;m <span className="text-foreground">Oluwafolajinmi David Aboderin</span>. Computer Science from Covenant, data &amp; backend background at Qucoon (Basel regulatory reporting, financial data pipelines), and I&apos;ve spent the last two weeks studying Quidax — your product, your API, your competitors, and the regulatory surface you&apos;re about to operate inside.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              This dashboard is not a portfolio piece. It is a candidate analyst report. If any of it is useful, I&apos;d like to do this kind of work on the Quidax data, product, or strategy team — full-time, contract, or internship. I&apos;m ready to start tomorrow.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Get in touch
              </a>
              <a
                href="https://www.linkedin.com/"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                LinkedIn
              </a>
              <a
                href="https://github.com/"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-border/60 bg-card p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                What I&apos;d bring on day one
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Production data pipelines (SQL, Python, dbt-style modeling)
                </li>
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Regulatory-grade reporting (Basel III experience at a Nigerian Tier-1 bank stack)
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
            <div className="rounded-lg border border-border/60 bg-card p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Method note
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Live tickers fetched from{" "}
                <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[11px] text-foreground">
                  app.quidax.com/api/v1/markets/tickers
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
          <span className="font-mono uppercase tracking-widest">
            v0.1 · NGN Liquidity Intelligence
          </span>
        </div>
      </div>
    </footer>
  )
}
