import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  B2B_SEGMENTS,
  COMPETITORS,
  B2B_ONLY_COMPETITORS,
} from "@/lib/competitive-data"
import { FX_REFERENCE, fxReferenceAgeDays } from "@/lib/insights"

export const metadata = {
  title: "Methodology — NGN Liquidity Intelligence",
  description:
    "Per-claim provenance and methodology notes for every analyst estimate in the dashboard.",
}

export const revalidate = 3600

/**
 * Per-claim provenance register. Linked from every analyst estimate in the
 * UI so a reader can answer "where did the $X TAM come from?" in <30 s.
 *
 * This page is intentionally text-heavy and content-driven. If any source
 * URL 404s, the row was wrong — that is the failure mode I want to know
 * about, not a smooth-looking page that hides bad numbers.
 */
export default function MethodologyPage() {
  const fxAge = fxReferenceAgeDays()

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader snapshotSource="live" />

      <section className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to dashboard
        </Link>

        <header className="mt-6">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Methodology · where every number comes from
          </span>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            How every number on this page was worked out
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Every figure on the dashboard is one of two things: (a) read live from a public API and labelled as such, or (b) my own estimate, with the calculation and source list below. If you can&apos;t trace any number on the page back to its source from here in under 30 seconds, this page has failed and I want to know.
          </p>
        </header>

        <Section title="1 · Live market data">
          <Bullet>
            <strong>
              Tickers (every NGN pair, last price, 24 h high/low, base volume, % change)
            </strong>{" "}
            — read live from{" "}
            <code className="rounded bg-muted/40 px-1.5 py-0.5 text-foreground">
              https://app.quidax.io/api/v1/markets/tickers
            </code>
            . Validated with Zod before use; malformed rows are dropped (and the dropped
            count is surfaced on the snapshot). Cached server-side for 10 s across all
            viewers via an in-memory last-known-good cache with single-flight upstream
            calls; the CDN holds the response for 10 s with up to 30 s
            stale-while-revalidate. Upstream is hit at most ~6 times per minute per
            function instance regardless of viewer count.
          </Bullet>
          <Bullet>
            <strong>30-day USDT/NGN and cNGN/NGN daily candles</strong> — read live from{" "}
            <code className="rounded bg-muted/40 px-1.5 py-0.5 text-foreground">
              /markets/usdtngn/k
            </code>{" "}
            and{" "}
            <code className="rounded bg-muted/40 px-1.5 py-0.5 text-foreground">
              /markets/cngnngn/k
            </code>
            . If the K-line endpoint is unavailable, the USDT/NGN chart falls back to a
            deterministic synthetic series anchored to the last observed price; the chart
            chip then reads <em>synthetic fallback</em>. The cNGN chart never falls back
            to synthetic — it degrades to an empty state with a label.
          </Bullet>
          <Bullet>
            <strong>24 h NGN turnover and stablecoin share</strong> — computed as{" "}
            <code>last_price_ngn × base_volume</code> per NGN-quoted pair, summed across
            all NGN pairs only (the `ngnTurnover` helper refuses to sum non-NGN markets).
            Quidax&apos;s <code>vol</code> field is base-asset volume per their docs.
          </Bullet>
        </Section>

        <Section title="2 · FX references (modeled, not live)">
          <p className="mb-3 text-sm text-muted-foreground">
            CBN&apos;s NFEM daily print and the parallel-market midpoint do not publish
            free machine-readable feeds. We update them manually and stamp the
            verification date. Staleness policy: &lt; 3 days &quot;ok&quot;, 3–10 days
            &quot;stale&quot; (bps deviation hidden in the UI), ≥ 10 days
            &quot;very-stale&quot; (the whole comparison is hidden).
          </p>
          <Bullet>
            <strong>NFEM official rate</strong>: ₦{FX_REFERENCE.cbnOfficial} (as of{" "}
            {FX_REFERENCE.asOf}, {fxAge} day{fxAge === 1 ? "" : "s"} old). Source: CBN
            daily NFEM print.
          </Bullet>
          <Bullet>
            <strong>Parallel-market midpoint</strong>: ₦{FX_REFERENCE.parallel}. Sourced
            from AbokiFX (BDC midpoint) at the same time.
          </Bullet>
          <Bullet>
            <strong>vsCBN %, vsCBN bps, and FX-gap bps</strong> are derived from these
            references — they are not live calculations on both legs. Treat them as
            analyst-modeled.
          </Bullet>
        </Section>

        <Section title="3 · Competitive matrix">
          <p className="mb-3 text-sm text-muted-foreground">
            Quidax row figures are read live from the markets API; every other row is an
            analyst estimate verified manually at the stamped capture date. Each row
            carries its own confidence rating (high / med / low).
          </p>
          <ul className="flex flex-col gap-3">
            {COMPETITORS.map((c) => (
              <li
                key={c.name}
                className="rounded-lg border border-border/60 bg-card p-4 text-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="font-semibold">{c.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    verified {c.provenance.verifiedAt} · confidence{" "}
                    {c.provenance.confidence}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{c.notableEdge}</p>
                <ul className="mt-2 flex flex-col gap-1">
                  {c.provenance.sources.map((s, i) => (
                    <li key={s.label + i} className="text-xs">
                      {s.url ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          {s.label} →
                        </a>
                      ) : (
                        <span className="text-foreground/80">{s.label}</span>
                      )}
                      {s.note && (
                        <span className="ml-1 text-muted-foreground"> — {s.note}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="4 · B2B-only rails (non-exchange competitors)">
          <p className="mb-3 text-sm text-muted-foreground">
            Included to answer the &quot;what about Conduit / Bitnob?&quot; question.
            These rails compete with Quidax-as-a-Service even though they don&apos;t run a
            retail order book.
          </p>
          <ul className="flex flex-col gap-3">
            {B2B_ONLY_COMPETITORS.map((c) => (
              <li
                key={c.name}
                className="rounded-lg border border-border/60 bg-card p-4 text-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="font-semibold">
                    {c.name}{" "}
                    <span className="font-mono text-xs font-normal text-muted-foreground">
                      · {c.type}
                    </span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    verified {c.verifiedAt}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{c.notable}</p>
                {c.link && (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-primary hover:underline"
                  >
                    {c.link} →
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="5 · B2B segment TAMs">
          <p className="mb-3 text-sm text-muted-foreground">
            TAM is the annual flow proxy in USD for the buyer category. Capture % is the
            share of TAM Quidax could realistically win in 24 months. Take rate is gross
            revenue per dollar of captured flow. Gross-margin default is the analyst
            estimate used in the in-page model. The five segments are disjoint by{" "}
            <strong>buyer type and revenue line</strong>; the data file notes how
            double-counting is avoided. Confidence is &quot;low&quot; on every row — TAMs
            this size are always model outputs, not measurements.
          </p>
          <ul className="flex flex-col gap-3">
            {B2B_SEGMENTS.map((s) => (
              <li
                key={s.segment}
                className="rounded-lg border border-border/60 bg-card p-4 text-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="font-semibold">{s.segment}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    verified {s.provenance.verifiedAt} · confidence{" "}
                    {s.provenance.confidence}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <dt className="text-muted-foreground">TAM</dt>
                  <dd className="font-mono tabular-nums text-foreground">
                    ${(s.tamUsd / 1e9).toFixed(1)}B
                  </dd>
                  <dt className="text-muted-foreground">Capture range</dt>
                  <dd className="font-mono tabular-nums text-foreground">
                    {s.capturePctLow}–{s.capturePctHigh}%
                  </dd>
                  <dt className="text-muted-foreground">Take rate</dt>
                  <dd className="font-mono tabular-nums text-foreground">
                    {s.takeRateBps} bps
                  </dd>
                  <dt className="text-muted-foreground">Default gross margin</dt>
                  <dd className="font-mono tabular-nums text-foreground">
                    {s.marginPctDefault}%
                  </dd>
                </dl>
                <ul className="mt-3 flex flex-col gap-1">
                  {s.provenance.sources.map((src, i) => (
                    <li key={src.label + i} className="text-xs">
                      {src.url ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          {src.label} →
                        </a>
                      ) : (
                        <span className="text-foreground/80">{src.label}</span>
                      )}
                      {src.note && (
                        <span className="ml-1 text-muted-foreground"> — {src.note}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="6 · Corridor flows and speed/cost claims">
          <p className="text-sm text-muted-foreground">
            Corridor annual flow figures are proxies from NBS Foreign Trade Statistics
            (NG → CN, NG → AE), AfCFTA trade-flow estimates (NG ↔ KE), and the World Bank
            Migration &amp; Remittances Brief (diaspora → NG). Bank-wire speed/cost is
            the analyst midpoint of published SWIFT correspondent-banking pricing for the
            NGN leg (typical range 250–500 bps and 2–5 business days). Stablecoin
            speed/cost is wall-clock end-to-end including on-ramp and off-ramp (typical
            range 5–15 minutes and 60–150 bps) — not just the on-chain hop. The
            &quot;speed multiplier&quot; on each card divides like-for-like wall-clock
            minutes.
          </p>
        </Section>

        <Section title="7 · Stablecoin demand-purpose mix">
          <p className="text-sm text-muted-foreground">
            The donut chart in the stablecoin deep-dive shows{" "}
            <em>demand purpose</em> — what NGN holders use crypto for (settlement,
            savings, trading) — and is <strong>not</strong> 24 h trading turnover. The
            turnover ratio on the KPI grid is the live calculation from Quidax tickers;
            the two figures are not comparable. Sources: Chainalysis SSA reports, public
            PSP commentary, and exchange-volume mix data triangulated. Normalised to
            100 %.
          </p>
        </Section>

        <Section title="8 · Ops &amp; reliability">
          <p className="text-sm text-muted-foreground">
            The in-memory cache and rate-limiter are best-effort per Vercel function
            instance. For multi-region production, swap for Upstash Ratelimit
            (Redis-backed sliding window) and Upstash Redis for the shared cache. With
            the current 10 s TTL a single instance hits upstream at most ~6 times/min.
            Recommended monitor: a Better Uptime / Checkly probe on{" "}
            <code className="rounded bg-muted/40 px-1.5 py-0.5 text-foreground">
              /api/markets
            </code>{" "}
            expecting 200 in &lt; 2 s.
          </p>
        </Section>

        <p className="mt-12 text-xs text-muted-foreground">
          If any source on this page 404s, the row was wrong and I want to know. Email{" "}
          <a className="text-primary hover:underline" href="mailto:folajinmi13@gmail.com">
            folajinmi13@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex gap-2 text-sm leading-relaxed text-muted-foreground">
      <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden />
      <span>{children}</span>
    </div>
  )
}
