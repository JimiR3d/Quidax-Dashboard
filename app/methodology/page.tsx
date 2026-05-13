import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/dashboard/site-header"
import { B2B_SEGMENTS, COMPETITORS, B2B_COMPETITORS } from "@/lib/competitive-data"
import { FX_REFERENCE, fxReferenceAgeDays } from "@/lib/insights"

export const metadata = {
  title: "Methodology — NGN Liquidity Intelligence",
  description:
    "Per-claim provenance and methodology notes for every analyst estimate in the dashboard.",
}

export const revalidate = 3600

/**
 * Audit fix [5]/[Critical]: enumerates every analyst estimate with definition,
 * source, capture date, and methodology. Linked from every ESTIMATE badge in
 * the UI so a reader can answer "where did the $X TAM come from?" in <30s.
 */
export default function MethodologyPage() {
  const fxAge = fxReferenceAgeDays()

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader source="live" staleMs={0} />

      <section className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to dashboard
        </Link>

        <header className="mt-6">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Methodology · provenance register
          </span>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            How every number on this page was computed
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Every figure on the dashboard is either (a) read live from a public
            API and labelled <strong className="text-foreground">REAL</strong>, or
            (b) an analyst estimate with the methodology and source URL below.
            If a reader cannot trace a figure to its source from this page in
            under 30 seconds, this page has failed and I want to know.
          </p>
        </header>

        <Section title="1 · Live market data">
          <Bullet>
            <strong>Tickers (every NGN pair, last price, 24h high/low, base
            volume, % change)</strong> — read live from{" "}
            <code className="rounded bg-muted/40 px-1.5 py-0.5 text-foreground">
              https://app.quidax.io/api/v1/markets/tickers
            </code>
            . Cached server-side for 8s across all viewers via an in-memory
            Last-Known-Good cache; CDN holds the response for 8s with up to 30s
            stale-while-revalidate. Upstream is hit at most ~7 times per minute
            per server instance regardless of viewer count.
          </Bullet>
          <Bullet>
            <strong>30-day USDT/NGN and cNGN/NGN daily candles</strong> — read
            live from{" "}
            <code className="rounded bg-muted/40 px-1.5 py-0.5 text-foreground">
              /markets/usdtngn/k
            </code>{" "}
            and{" "}
            <code className="rounded bg-muted/40 px-1.5 py-0.5 text-foreground">
              /markets/cngnngn/k
            </code>
            . If the K-line endpoint is unavailable, the USDT/NGN chart falls
            back to a deterministic synthetic series anchored to the last
            observed price; the chart legend says <em>synthetic</em> in that
            case. The cNGN chart never falls back to synthetic — it degrades
            to an empty state with a label.
          </Bullet>
          <Bullet>
            <strong>24h NGN turnover and stablecoin share</strong> — computed
            as <code>last_price_ngn × base_volume</code> per pair, summed across
            all NGN pairs. Quidax&apos;s <code>vol</code> field is{" "}
            <strong>base-asset</strong> volume per their docs sample response
            (verified manually on Quidax docs at capture time). If a future API
            change makes that ambiguous, an integration test against the
            captured fixture will fail loudly.
          </Bullet>
        </Section>

        <Section title="2 · FX references (modeled, not live)">
          <p className="mb-3 text-sm text-muted-foreground">
            CBN&apos;s NFEM daily print and the parallel-market midpoint do not
            publish free machine-readable feeds. We update them manually and
            stamp the verification date.
          </p>
          <Bullet>
            <strong>NFEM official rate</strong>: ₦{FX_REFERENCE.cbnOfficial}{" "}
            (as of {FX_REFERENCE.asOf}, {fxAge} day{fxAge === 1 ? "" : "s"} old).{" "}
            Source: CBN daily NFEM print. If this number is more than 7 days
            old, the dashboard renders every NFEM-derived figure with a
            staleness warning.
          </Bullet>
          <Bullet>
            <strong>Parallel-market midpoint</strong>: ₦{FX_REFERENCE.parallel}.
            Sourced from AbokiFX captured at the same time.
          </Bullet>
          <Bullet>
            <strong>vsCBN % and FX gap (bps)</strong> are derived from these
            references — they are <em>not</em> live calculations on both legs.
            Treat them as analyst-modeled.
          </Bullet>
        </Section>

        <Section title="3 · Competitive matrix">
          <p className="mb-3 text-sm text-muted-foreground">
            Quidax row figures are read live; every other row is an analyst
            estimate verified manually at the stamped capture date. Numbers in
            italics in the matrix are flagged as estimates.
          </p>
          <ul className="flex flex-col gap-3">
            {COMPETITORS.map((c) => (
              <li
                key={c.name}
                className="rounded-lg border border-border/60 bg-card p-4 text-sm"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{c.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    verified {c.verifiedAt}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.caveat ?? c.notableEdge}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {c.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {s.label} →
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="4 · B2B-only rails (non-exchange competitors)">
          <p className="mb-3 text-sm text-muted-foreground">
            Included to address the audit&apos;s "what about Conduit / Bitnob?"
            question. These rails compete with Quidax-as-a-Service even though
            they don&apos;t run a retail order book.
          </p>
          <ul className="flex flex-col gap-3">
            {B2B_COMPETITORS.map((c) => (
              <li
                key={c.name}
                className="rounded-lg border border-border/60 bg-card p-4 text-sm"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{c.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    verified {c.verifiedAt}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{c.positioning}</p>
                {c.caveat ? (
                  <p className="mt-1 text-xs text-warning">{c.caveat}</p>
                ) : null}
                <ul className="mt-2 flex flex-wrap gap-2">
                  {c.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {s.label} →
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="5 · B2B segment TAMs">
          <p className="mb-3 text-sm text-muted-foreground">
            TAM is the annual flow proxy in USD for the buyer category. Capture
            % is the share of TAM Quidax could realistically win in 24 months.
            Take rate is the gross revenue per dollar of captured flow. Variable
            cost is the analyst default for contribution-margin computation
            (KYB + treasury risk + GTM) — toggleable in the in-page model.
            Segments are <strong>disjoint by initiating party</strong>: corporate
            B2B settlement is corporate-initiated; remittance is retail-initiated
            via licensed MTOs, so the two do not double-count.
          </p>
          <ul className="flex flex-col gap-3">
            {B2B_SEGMENTS.map((s) => (
              <li
                key={s.segment}
                className="rounded-lg border border-border/60 bg-card p-4 text-sm"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{s.segment}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    verified {s.verifiedAt}
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
                  <dd className="font-mono tabular-nums text-foreground">{s.takeRateBps} bps</dd>
                  <dt className="text-muted-foreground">Variable cost (default)</dt>
                  <dd className="font-mono tabular-nums text-foreground">
                    {s.defaultVariableCostPct}%
                  </dd>
                </dl>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {s.sources.map((src) => (
                    <li key={src.url}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {src.label} →
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="6 · Corridor flows and speed/cost claims">
          <p className="text-sm text-muted-foreground">
            Corridor annual flow figures are proxies from NBS Foreign Trade
            Statistics (NG→CN, NG→AE), AfCFTA trade-flow estimates (NG↔KE),
            and the World Bank Migration &amp; Remittances Brief 2023
            (diaspora→NG). Bank-wire speed/cost is the analyst midpoint of
            published SWIFT correspondent-banking pricing for NGN-leg payments
            (typical range 250–500 bps and 2–5 business days). Stablecoin
            speed/cost is wall-clock end-to-end including on-ramp and off-ramp
            (typical range 5–15 minutes and 60–150 bps) — not just the on-chain
            hop. The "speed multiplier" in each card divides like-with-like
            wall-clock; the methodology note appears on hover. <br />
            Audit fix [1]/[Medium]: previously the multiplier mixed
            business-day clearing with wall-clock minutes and produced
            unrealistic ratios (e.g. 720×). The current numbers are
            conservative.
          </p>
        </Section>

        <Section title="7 · Stablecoin demand-purpose mix">
          <p className="text-sm text-muted-foreground">
            The donut chart in the stablecoin deep-dive shows <em>demand
            purpose</em> — what NGN holders use crypto for (settlement,
            savings, trading) — and is <strong>not</strong> 24h trading
            turnover. The turnover ratio on the KPI grid is the live
            calculation from Quidax tickers; the two figures are not
            comparable. Sources: Chainalysis SSA reports, public PSP
            commentary, and exchange-volume mix data triangulated. Reported as
            100% normalised; the actual residual "other / unattributed" is
            folded into "Other stables".
          </p>
        </Section>

        <Section title="8 · Ops &amp; reliability">
          <p className="text-sm text-muted-foreground">
            The in-memory cache and rate-limiter are best-effort per Vercel
            function instance. For multi-region production, swap for Upstash
            Ratelimit (Redis-backed sliding window) and Upstash Redis for the
            shared cache. The dashboard&apos;s 8s TTL means a single instance
            takes at most ~7 upstream calls per minute. Recommended monitor:
            a Better Uptime / Checkly probe on{" "}
            <code className="rounded bg-muted/40 px-1.5 py-0.5 text-foreground">/api/markets</code>
            {" "}expecting 200 in &lt;2s.
          </p>
        </Section>

        <p className="mt-12 text-xs text-muted-foreground">
          If any source on this page 404s, the row was wrong and I want to know.
          Email <a className="text-primary hover:underline" href="mailto:folajinmi13@gmail.com">folajinmi13@gmail.com</a>.
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
