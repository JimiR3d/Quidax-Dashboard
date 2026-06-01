import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  B2B_SEGMENTS,
  COMPETITORS,
  B2B_ONLY_COMPETITORS,
} from "@/lib/competitive-data"
import { FX_REFERENCE, fxReferenceAgeDays } from "@/lib/insights"
import { getLiveFxRates } from "@/lib/fx-rates"

export const metadata = {
  title: "Methodology — NGN Liquidity Intelligence",
  description:
    "Per-claim provenance and methodology notes for every analyst estimate in the dashboard.",
}

export const revalidate = 3600

/**
 * Per-claim provenance register. Linked from every analyst estimate in the
 * UI so a reader can answer "where did the $X TAM come from?" in 45 seconds.
 *
 * This page is intentionally text-heavy and content-driven. If any source
 * URL 404s, the row was wrong — that is the failure mode I want to know
 * about, not a smooth-looking page that hides bad numbers.
 */
export default async function MethodologyPage() {
  const fxAge = fxReferenceAgeDays()
  const liveFx = await getLiveFxRates().catch(() => undefined)

  return (
    <main className="min-h-screen bg-transparent">
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
            Every figure on this site is one of two things: (a) read live from a public API and labelled as such, or (b) my own estimate, with the calculation and source list below. If you can't trace any number back to its source from here in under 45 seconds, this page has failed and I want to know. 📎
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Link
              href="/glossary"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Read the Beginner's Glossary
            </Link>
          </div>
        </header>

        <Section title="1 · Live market data">
          <p className="mb-3 text-sm text-muted-foreground">
            API calls are executed server-side via Next.js Route Handlers to avoid CORS issues and hide sensitive implementation details. These endpoints are protected by rate limiting and a shared-cache layer to prevent upstream bans.
          </p>
          <Bullet>
            <strong>
              Tickers (every NGN pair, last price, 24 h high/low, base volume, % change)
            </strong>{" "}
            , read live from{" "}
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
            <strong>30-day USDT/NGN and cNGN/NGN daily candles</strong>, read live from{" "}
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
            to synthetic. It degrades to an empty state with a label.
          </Bullet>
          <Bullet>
            <strong>24 h NGN turnover and stablecoin share</strong>, computed as{" "}
            <code>last_price_ngn × base_volume</code> per NGN-quoted pair, summed across
            all NGN pairs only (the `ngnTurnover` helper refuses to sum non-NGN markets).
            Quidax&apos;s <code>vol</code> field is base-asset volume per their docs.
          </Bullet>
        </Section>

        <Section title="2 · FX references">
          <p className="mb-3 text-sm text-muted-foreground">
            CBN&apos;s NFEM daily print and the parallel-market midpoint do not publish
            free machine-readable feeds. As of May 2026, the dashboard auto-fetches
            the USD/NGN rate from <code className="rounded bg-muted/40 px-1.5 py-0.5 text-foreground">open.er-api.com/v6/latest/USD</code> (primary, requires no API key!)
            and <code className="rounded bg-muted/40 px-1.5 py-0.5 text-foreground">cdn.jsdelivr.net/@fawazahmed0/currency-api</code> (backup),
            with a 6-hour in-memory cache. The parallel rate is estimated as +1.8% over official (the historical BDC spread midpoint).
            If both APIs fail, the dashboard falls back to manually verified static values.
          </p>
          <Bullet>
            <strong>Auto-fetched CBN rate</strong>:{" "}
            {liveFx?.source === "live-api" ? (
              <>₦{liveFx.cbnOfficial.toLocaleString()} (as of {liveFx.asOf}, auto-updated from open.er-api.com). Parallel estimate: ₦{liveFx.parallel.toLocaleString()}.  </>
            ) : (
              <>Auto-fetch unavailable at render time. Using fallback: ₦{FX_REFERENCE.cbnOfficial} / ₦{FX_REFERENCE.parallel} (as of {FX_REFERENCE.asOf}, {fxAge} day{fxAge === 1 ? "" : "s"} old).  </>
            )}
          </Bullet>
          <Bullet>
            <strong>Fallback values</strong>: ₦{FX_REFERENCE.cbnOfficial} (CBN NFEM) and ₦{FX_REFERENCE.parallel} (parallel),
            last manually verified {FX_REFERENCE.asOf}. These are only used when both live APIs are unreachable.
          </Bullet>
          <Bullet>
            <strong>Staleness policy (fallback only)</strong>: &lt; 3 days &quot;ok&quot;, 3–10 days
            &quot;stale&quot; (% difference hidden in the UI), ≥ 10 days
            &quot;very-stale&quot; (the whole comparison is hidden). Live API rates
            are always treated as fresh.
          </Bullet>
          <Bullet>
            <strong>vsCBN % and FX-gap %</strong> are derived from these
            references. They auto-update when the upstream rate changes.
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
                    verified {c.provenance.verifiedAt} (Updated 2026-06-01) · confidence{" "}
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
            These rails compete with Quidax-as-a-Service even though they don't run a
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
                    verified {c.verifiedAt} (Updated 2026-06-01)
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

        <Section title="5 · B2B Market Sizes">
          <p className="mb-3 text-sm text-muted-foreground">
            Market Size is the annual flow proxy in USD for the buyer category. Capture % is the
            share of Market Size Quidax could realistically win in 24 months. Our Cut (Fee) is gross
            revenue per dollar of captured flow. Gross-margin default is the analyst
            estimate used in the in-page model. The five segments are disjoint by{" "}
            <strong>buyer type and revenue line</strong>; the data file notes how
            double-counting is avoided. Confidence is &quot;low&quot; on every row. Market sizes
            this large are always model outputs, not measurements.
          </p>
          <p className="mb-3 rounded-md border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-medium text-warning">⚠️ Methodology note:</span>{" "}
            The Cross-border B2B ($10B), Corporate/PSP ($6.5B), and Remittance ($4.5B) market sizes are
            grounded in NBS trade data, CBN BoP releases, and the World Bank remittances brief.
            The Fintech Treasury ($4.2B) and Embedded Crypto ($2.8B) market sizes are speculative
            projections based on analyst modeling of corporate asset allocations and fintech
            product roadmap tracking — not hard public census data. All five carry &quot;low&quot;
            confidence.
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
                    verified {s.provenance.verifiedAt} (Updated 2026-06-01) · confidence{" "}
                    {s.provenance.confidence}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <dt className="text-muted-foreground">Market Size</dt>
                  <dd className="font-mono tabular-nums text-foreground">
                    ${(s.tamUsd / 1e9).toFixed(1)}B
                  </dd>
                  <dt className="text-muted-foreground">Capture range</dt>
                  <dd className="font-mono tabular-nums text-foreground">
                    {s.capturePctLow}–{s.capturePctHigh}%
                  </dd>
                  <dt className="text-muted-foreground">Our Cut</dt>
                  <dd className="font-mono tabular-nums text-foreground">
                    {(s.takeRateBps / 100).toFixed(2)}%
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
            (NG → CN: $13B confirmed), CBN Balance of Payments (NG → AE: approximately $4B current
            baseline, projected to grow following January 2026 CEPA), and the World Bank
            Migration &amp; Remittances Brief (diaspora → NG: official $20–22B, estimated true volume
            including informal channels likely exceeds $23B). The NG ↔ KE corridor is presented as
            an aspirational AfCFTA opportunity — formal bilateral trade is under $100M per year per
            UN COMTRADE and OEC data. Bank-wire speed/cost is an analyst estimate based on
            published SWIFT correspondent-banking and VASP pricing for the NGN leg (typical range
            2.5–5% and 2–5 business days). Stablecoin speed/cost is an analyst estimate of
            wall-clock end-to-end including on-ramp and off-ramp (typical range 5–15 minutes and
            0.6–1.5%), not just the on-chain hop. The &quot;speed multiplier&quot; on each card
            divides like-for-like wall-clock minutes.
          </p>
        </Section>

        <Section title="7 · Stablecoin demand-purpose mix">
          <p className="text-sm text-muted-foreground">
            The donut chart in the stablecoin deep-dive shows{" "}
            <em>demand purpose</em>, what NGN holders use crypto for (settlement,
            savings, trading), and is <strong>not</strong> 24 h trading turnover. The
            turnover ratio on the KPI grid is the live calculation from Quidax tickers;
            the two figures are not comparable. The 86% stablecoin share is an analyst estimate
            calibrated against Chainalysis SSA reports, TRM Labs data, public PSP commentary, and
            exchange-volume mix data — it is not a directly measured figure. The exact percentage
            split (USDT 66%, USDC 12%, cNGN 8%) is directionally supported but should be treated as
            an approximation. cNGN is issued by the African Stablecoin Consortium (ASC) under SEC
            ARIP oversight. Normalised to 100%.
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
