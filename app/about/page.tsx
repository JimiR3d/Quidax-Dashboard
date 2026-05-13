import Link from "next/link"
import { ArrowLeft, Github, Linkedin, Mail } from "lucide-react"
import { SiteHeader } from "@/components/dashboard/site-header"

export const metadata = {
  title: "About the author — NGN Liquidity Intelligence",
  description:
    "Oluwafolajinmi David Aboderin — author of NGN Liquidity Intelligence. Hiring availability and background.",
}

export const revalidate = 3600

/**
 * Audit fix [5]/[Critical]: separates candidate framing from the analysis.
 * The dashboard at "/" is now purely the analysis; the explicit "I want a job"
 * lives here, behind a single discoverable link in the footer. Anyone who
 * likes the analysis will find their way here.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader source="live" staleMs={0} />

      <section className="mx-auto w-full max-w-2xl px-4 py-16 md:px-6 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to dashboard
        </Link>

        <header className="mt-6">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            About the author
          </span>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Oluwafolajinmi David Aboderin
          </h1>
          <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
            Data and backend engineer. Computer Science from Covenant. Prior
            work at Qucoon on Basel regulatory reporting and financial data
            pipelines for a Nigerian Tier-1 bank stack. Available for
            full-time, contract, or internship work on data, product, or
            strategy teams in African fintech.
          </p>
        </header>

        <div className="mt-10 flex flex-col gap-6">
          <section>
            <h2 className="text-lg font-semibold">Why I built this</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              I wanted an honest test of whether I can do the kind of analyst,
              data, and product-thinking work an exchange-as-a-service business
              actually needs — and a forcing function to learn the regulatory
              and competitive surface in detail. The dashboard is the artefact;
              the methodology page is the homework I had to do to ship it
              without overclaiming.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Where to reach me</h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href="mailto:folajinmi13@gmail.com"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                folajinmi13@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/oluwafolajinmi-aboderin-695848249/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                LinkedIn
              </a>
              <a
                href="https://github.com/JimiR3d"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                @JimiR3d
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Independence statement</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This dashboard uses only publicly accessible market data and
              publicly verifiable competitor information. It is independent
              and not affiliated with Quidax Technologies Limited or any other
              exchange. Information is presented for analytical purposes and
              is not investment advice.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}
