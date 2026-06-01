# Architecture & Engineering Reference

**Project:** NGN Liquidity Intelligence — A B2B Growth Thesis for Quidax
**Audience:** Software engineers, web developers, technical reviewers
**Status:** Production-ready, single-author build, deployed on Vercel
**Last updated:** 2026-05-14

---

## 1. Product summary in one paragraph

A public, read-only, multi-page competitive-intelligence hub. It pulls live NGN-quoted ticker data from the unauthenticated Quidax public REST API every 60 seconds server-side and every 15 seconds client-side, normalises and validates it, computes a set of analyst-built KPIs (USDT/NGN vs. NFEM premium, cNGN peg deviation, NGN turnover composition), and presents them next to hand-curated competitive intelligence (Yellow Card, Bitnob, Conduit, Busha, Luno, Roqqu) plus an interactive B2B revenue model. The hub is intended to be sent to Quidax's executive team as a hiring/pitch artifact. No users, no logins, no database, no PII.

---

## 2. Technology stack

| Layer | Choice | Version |
|---|---|---|
| Runtime | Node.js | 20.x (Vercel) |
| Framework | Next.js (App Router) | 16.x |
| React | React | 19.2 (with `Activity`, `useEffectEvent`) |
| Language | TypeScript | 5.x, `strict: true` |
| Styling | Tailwind CSS | v4 (CSS-first config via `@theme inline`) |
| Charts | Recharts | latest |
| Component primitives | Radix UI + shadcn/ui patterns + 21st.dev | latest |
| Animations | Framer Motion + GSAP | latest |
| Client data layer | SWR | 2.x |
| Schema validation | Zod | 3.x |
| Tests | Vitest | 2.x |
| Bundler | Turbopack (Next.js default) | |
| Hosting | Vercel | Git-connected |
| Package manager | pnpm | 9.x |
| Analytics | `@vercel/analytics` | latest |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | |

No database. No ORM. No auth provider. No third-party API keys. No payment integration.

---

## 3. Directory layout

```
.
├── app/                      # Next.js App Router
│   ├── api/markets/route.ts  # Single GET endpoint (rate-limited, edge-cached)
│   ├── about/page.tsx        # Author bio + candidate framing
│   ├── methodology/page.tsx  # Per-claim provenance for every analyst estimate
│   ├── layout.tsx            # Root layout, metadata, viewport, fonts
│   ├── page.tsx              # Main dashboard composition
│   ├── error.tsx             # Route-level error boundary
│   ├── opengraph-image.tsx   # Dynamic OG image
│   ├── robots.ts             # robots.txt
│   ├── sitemap.ts            # sitemap.xml
│   └── globals.css           # Tailwind v4 @theme + design tokens
├── components/
│   ├── dashboard/            # 15+ analysis components (see section 5)
│   ├── ui/                   # shadcn primitives
│   └── theme-provider.tsx
├── lib/
│   ├── quidax.ts             # Upstream client: fetch + Zod + LKG + retry
│   ├── cache.ts              # Single-flight cache + per-IP rate limiter
│   ├── insights.ts           # Analyst math (spread, peg, FX staleness)
│   ├── competitive-data.ts   # Curated competitor / corridor / TAM data
│   ├── format.ts             # Locale-safe number formatters
│   └── utils.ts              # cn() helper
├── tests/
│   └── helpers.test.ts       # 14 unit tests (Zod, peg, spread, turnover)
├── .github/workflows/ci.yml  # typecheck + test + build on every PR
├── proxy.ts                  # Next.js 16 proxy.ts: security headers + CSP
├── docs/                     # This document + KIDS_GUIDE.md
├── RUNBOOK.md                # Rollback + triage runbook
├── README.md                 # Reader-facing description
├── INTERVIEW_PREP.md         # Internal notes
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Request lifecycle (end-to-end)

```
                 ┌─────────────────────────────────────────────────────────────┐
                 │                Browser (any reader, no auth)                │
                 │                                                             │
                 │  initial HTML  ─────────────────┐                           │
                 │  + RSC payload                  │ SWR poll every 15s        │
                 │                                 ▼                           │
                 │                          fetch('/api/markets')              │
                 └─────────────────────────┬───────────────────────────────────┘
                                           │
                                           │ same-origin only
                                           │ (CSP connect-src = 'self')
                                           ▼
                 ┌─────────────────────────────────────────────────────────────┐
                 │              Vercel Edge / Node runtime                     │
                 │                                                             │
                 │  proxy.ts ─ adds CSP, HSTS, X-Frame-Options, Referrer-Policy│
                 │       │                                                     │
                 │       ▼                                                     │
                 │  app/api/markets/route.ts                                   │
                 │       │                                                     │
                 │       ├── rate limiter (lib/cache.ts):                      │
                 │       │     6 req / 10s per IP → 429 + Retry-After          │
                 │       │                                                     │
                 │       ├── singleFlight('quidax-snapshot', 5000ms):          │
                 │       │     coalesces N concurrent requests into 1 upstream │
                 │       │     call regardless of viewer count                 │
                 │       │                                                     │
                 │       ▼                                                     │
                 │  lib/quidax.ts ─ getMarketSnapshot()                        │
                 │       │                                                     │
                 │       ├── fetchWithRetry: 3 tries, full-jitter backoff      │
                 │       │     (250ms → 1.5s → 4s), 5s timeout each            │
                 │       │                                                     │
                 │       ├── Zod parse upstream JSON                           │
                 │       │     (TickersPayload, KlinePayload schemas)          │
                 │       │                                                     │
                 │       ├── normalise into MarketTicker[]                     │
                 │       │     reject non-finite, last/open <= 0               │
                 │       │                                                     │
                 │       └── on success → cache snapshot to memory             │
                 │           on failure → return last-known-good with          │
                 │             source: 'lkg', ageMs from prior success         │
                 │           on never-succeeded → return source: 'empty'       │
                 │                                                             │
                 │  Response headers:                                          │
                 │       Cache-Control: s-maxage=10, stale-while-revalidate=30 │
                 │       X-Source: live|cached|lkg|empty                       │
                 │       X-Tickers: N                                          │
                 └─────────────────────────┬───────────────────────────────────┘
                                           │
                                           ▼
                              https://app.quidax.io/api/v1/markets/tickers
                              (unauthenticated public REST)
```

---

## 5. Component map (`components/dashboard/`)

| Component | Type | Purpose |
|---|---|---|
| `site-header.tsx` | Server | Sticky header + nav anchors |
| `header-source-pill.tsx` | Client | Live `Xs ago` counter, syncs with `/api/markets` via SWR |
| `hero.tsx` | Server | Above-the-fold value statement + freshness chip |
| `key-claims.tsx` | Server | 5 numbered claims, each anchored to its evidence section |
| `exec-summary.tsx` | Server | 30-second skim |
| `kpi-grid.tsx` | Server | 4 KPIs from `MarketSnapshot` (turnover, stable share, pair count, premium) |
| `spread-panel.tsx` | Server | USDT/NGN vs NFEM vs parallel with sr-only data table |
| `cngn-depeg-watch.tsx` | Server | Peg deviation in bps, stable / watch / depeg states, no-live-spot empty state |
| `stablecoin-deepdive.tsx` | Client | Recharts line + donut + bar; degrades to no-data state on `source: 'empty'` |
| `competitive-matrix.tsx` | Server | 6-player matrix with per-row confidence + verifiedAt |
| `b2b-competitor-strip.tsx` | Server | Non-exchange B2B rails (Yellow Card OTC, Conduit, Bitnob) |
| `corridor-view.tsx` | Server | NG corridor cards (NG→CN, NG→UK, etc.) with structured per-row provenance |
| `b2b-opportunity.tsx` | Client | Interactive sliders + out-of-band warning when knob exceeds modeled band |
| `customer-proof.tsx` | Server | Named-integration cards (Basqet, Blano, Gigxpad) — no per-partner volume claim |
| `recommendations.tsx` | Server | Public-facing recommendations with `visibilityCaveat` |
| `counter-thesis.tsx` | Server | Four falsifying conditions + the surface that would betray each first |
| `api-proof-strip.tsx` | Client | Live tickers, 1s ticker, 4-state source chip |
| `pitch-footer.tsx` | Server | Method note + candidate framing |
| `section-boundary.tsx` | Client | React error boundary wrapper per section |

Server-vs-client: every Recharts surface and every component that consumes `Date.now()` for "Xs ago" is `"use client"`. Everything else is a Server Component.

---

## 6. Data model — `lib/quidax.ts`

### Public types

```ts
export type SnapshotSource = "live" | "cached" | "lkg" | "empty"

export interface MarketTicker {
  market: string           // "usdtngn", "btcngn", "cngnusdt", ...
  base: string             // "usdt"
  quote: string            // "ngn"
  last: number             // last price in quote units
  open: number             // 24h-open price
  high: number
  low: number
  baseVolume: number       // EXPLICITLY base-asset volume; never quote-volume
  changePct: number        // (last - open) / open * 100
}

export interface MarketSnapshot {
  source: SnapshotSource
  fetchedAt: string | null   // ISO timestamp of LAST SUCCESS, or null if never
  ageMs: number              // 0 for live; positive for cached/lkg
  tickers: MarketTicker[]
  dropped: number            // Tickers rejected by validation
  candles?: Candle[]         // Only when caller asks for them
}
```

### Why `source` is a discriminated union, not a boolean

The original `simulated: boolean` flag could be true while serving 30-day-old hard-coded prices. Today the four states are mutually exclusive and visually distinct in the UI:

- `live` — fetched <10s ago, schema-valid, all green
- `cached` — within single-flight window, identical to live
- `lkg` — upstream failed, serving the last good snapshot, amber chip
- `empty` — never had a good snapshot, red chip, no numbers shown

### `baseVolume` discipline

The Quidax payload contains `vol` and `volume` fields that historically have been ambiguous (base-asset vs. quote-currency volume). The normaliser picks the field documented as base volume and renames it to `baseVolume` to make the downstream `last * baseVolume = NGN turnover` math unambiguous. A unit test (`tests/helpers.test.ts`) pins this contract.

---

## 7. Reliability stack

### 7.1 Single-flight upstream fetch (`lib/cache.ts`)

```
N concurrent /api/markets requests
        │
        ▼
┌──────────────────────────────────┐
│ singleFlight('quidax-snapshot',  │
│              5000)               │
│                                  │
│  if (fresh promise within 5s)    │
│       return it                  │
│  else                            │
│       start a new upstream fetch │
│       cache its promise          │
└──────────────────────────────────┘
        │ exactly 1 call to Quidax per 5s
        ▼
   app.quidax.io
```

Without this, 100 concurrent viewers = 400 upstream calls/minute. With it, the upstream call rate is bounded by `60 / interval × runtime-instances`, independent of viewer count.

### 7.2 Last-known-good fallback

`lib/quidax.ts` keeps `lastGoodSnapshot` in module memory. On upstream failure, it returns that snapshot with `source: "lkg"` and `ageMs = Date.now() - lastSuccessAt`. The UI labels it explicitly. There is no hard-coded fallback price array.

### 7.3 Retry with full-jitter backoff

```ts
attempts = 3
delays   = [random(0, 250ms), random(0, 1500ms), random(0, 4000ms)]
timeout  = 5000ms per attempt (AbortSignal.timeout)
```

The jitter prevents thundering-herd on a recovering upstream.

### 7.4 Zod validation on every upstream payload

```ts
const TickerInner = z.object({
  last:   z.coerce.number().finite(),
  open:   z.coerce.number().finite(),
  high:   z.coerce.number().finite(),
  low:    z.coerce.number().finite(),
  vol:    z.coerce.number().finite().optional(),
  volume: z.coerce.number().finite().optional(),
}).passthrough()

const TickersPayload = z.object({
  data: z.record(z.string(), z.object({
    ticker: TickerInner.optional(),
  }).passthrough()),
}).passthrough()
```

Any deviation from this schema produces a structured `console.error` and an `lkg` response. Schema drift never silently corrupts the UI.

### 7.5 Rate limiter (`lib/cache.ts`)

Per-IP sliding window:

```
6 requests per 10 seconds per IP
   ↓ on breach
HTTP 429
Retry-After: <seconds>
X-RateLimit-Limit: 6
X-RateLimit-Window: 10
```

Key = `x-forwarded-for` first hop, falls back to `x-real-ip`, falls back to `"anonymous"`. Implemented as an in-memory `Map<ip, number[]>` purged on each call. Multi-region cold starts are OK because the upstream is still single-flighted globally per instance.

---

## 8. Security posture

### 8.1 Headers (proxy.ts)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  connect-src 'self' https://va.vercel-scripts.com;
  font-src 'self' data:;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

`connect-src` deliberately omits Quidax — the browser never calls Quidax directly. Only the server-side route does. Tightening that header is what keeps a compromised inline script from exfiltrating data to attacker.example.

### 8.2 CORS

No `Access-Control-Allow-Origin` header anywhere. Browsers therefore enforce same-origin on `/api/markets`. The explicit `OPTIONS → 405 Allow: GET` handler defeats preflight probes from other origins.

### 8.3 Inputs

`GET /api/markets` accepts no path parameters, no query parameters, no body, and no client-controllable headers (every Quidax-bound request is constructed server-side). There is literally no user-supplied string that reaches the upstream. The Zod validation guards the *upstream* response, which is the realistic injection vector for an analytics dashboard.

### 8.4 Secrets

The repo contains zero secrets. Grep for `API_KEY`, `SECRET`, `TOKEN`, `Authorization`, `Bearer`, `NEXT_PUBLIC_` returns zero matches. Quidax's public market endpoints are unauthenticated; there is no key to leak.

### 8.5 Authentication / authorization

Both are deliberately absent. There are no user accounts, no admin endpoints, no protected routes. If Quidax wants the analysis behind a wall, the right answer is Vercel Password Protection at the deployment level, not bolted-on auth code in this repo.

---

## 9. Tailwind v4 design system

`app/globals.css` declares the entire design system via `@theme inline`. Key tokens:

```css
--background:        oklch(0.135 0.035 305)
--foreground:        oklch(0.96  0.01  305)
--muted-foreground:  oklch(0.74  0.025 305)
--card:              oklch(0.18  0.04  305)
--primary:           oklch(0.62  0.18  305)
--positive:          oklch(0.72  0.16  155)
--warning:           oklch(0.78  0.18  75)
--destructive:       oklch(0.62  0.22  25)
--radius:            0.625rem
--font-sans:         "Geist", "Geist Fallback"
--font-mono:         "Geist Mono", "Geist Mono Fallback"
```

Rules enforced across the codebase:

- No arbitrary values for spacing/font-size (`text-xs` not `text-[11px]`).
- No `space-*` classes; `gap-*` only.
- Every chart-y component overrides text and bg together so contrast can't drift.
- Sub-12px text was eliminated to clear WCAG 2.2 AA on the design-token contrast ratios.

---

## 10. Testing

`tests/helpers.test.ts` covers the math-and-validation kernel:

| Test group | Asserts |
|---|---|
| `MarketSnapshotSchema` | rejects extra source values, accepts the four canonical ones, fails on missing `tickers` |
| `computeCngnPeg` | stable / watch / depeg thresholds at 25 bps and 100 bps; "no live spot" path |
| `computeSpread` | NFEM premium math, parallel premium math, sign convention |
| `ngnTurnover` | base-volume contract; rejects non-finite, treats `last <= 0` as zero turnover |
| `fxReferenceStaleness` | "fresh" up to 3 days, "stale" 3-14, "very-stale" past 14 |

`pnpm test` runs them in <500ms. CI runs them on every PR.

What is NOT tested:

- Recharts rendering (would require Playwright; over-investment for current scope).
- Full E2E network flow.
- Visual regression.

If this graduates into a product, those become important.

---

## 11. Performance

- Server-rendered HTML on first paint. Recharts hydrates client-side under `next/dynamic` boundaries.
- Single SWR endpoint shared by header pill + proof strip via SWR's dedupe + key sharing.
- `Cache-Control: s-maxage=10, stale-while-revalidate=30` on `/api/markets` lets Vercel's edge serve most reads without invoking the function.
- No client-side data fetching from inside `useEffect`; everything goes through SWR.
- `Activity` (React 19.2) is available but not currently used; would be the right primitive if the page ever gains hidden tabs.

---

## 12. CI / CD

`.github/workflows/ci.yml`:

```
on: pull_request, push to main
concurrency: cancel-in-progress on same ref
job 'verify':
  - pnpm install --frozen-lockfile
  - pnpm exec tsc --noEmit        (if always)
  - pnpm test                      (if always)
  - pnpm build                     (if always)
```

`if: always()` means a single PR run reports every problem at once rather than hiding later failures behind an earlier one.

Deployment is Vercel git-connected: every commit gets a unique preview URL; pushes to `main` deploy to production automatically.

Branch protection on `main` (one-time GitHub UI setting, not in repo) should require the CI workflow green before merge.

---

## 13. Operability

`RUNBOOK.md` covers:

- What each `source` value means and which ones are designed states vs. bugs.
- Two rollback paths: Vercel instant promote (~30s) and `git revert` (~2-4 min).
- Triage for the four most likely incidents.
- Honest section on what rollback cannot do (undo reads, fix upstream).
- Forward-looking section on monitors/alerts/log drains for if this becomes a real service.

There are intentionally no monitors, alerts, or pagers in the current scope — there are no users to wake anyone up for. The Zod failure path and the LKG path both `console.error` to Vercel's runtime logs.

---

## 14. SEO / Discoverability

- Static `metadata` export in `app/layout.tsx` includes title, description, keywords, openGraph, twitter.
- `app/robots.ts` exposes a `Robots-allow-all` policy.
- `app/sitemap.ts` exposes `/`, `/about`, `/methodology`.
- `app/opengraph-image.tsx` renders a dynamic OG image with the hero number, so the URL unfurls properly in LinkedIn / Slack / X.
- Generator meta tag is stripped (no `generator: 'v0.app'`).

---

## 15. Accessibility

- Skip-link as the first focusable element in `<body>`.
- Every Recharts surface has `role="img"` + a hand-written `aria-label` summarising the trend (so a screen-reader user gets the takeaway without parsing 90 datapoints).
- `SpreadPanel` has a fully populated `<table class="sr-only">` companion for the custom SVG bar.
- Colour-coded indicators (peg status, source chip) pair colour with text + dot to defeat colourblind ambiguity.
- All sub-12px text was eliminated.
- Semantic landmarks: `<header>`, `<main>`, `<section>`, `<footer>`.
- Heading hierarchy is strictly nested.

What is NOT yet covered:

- Keyboard interaction on the B2B sliders is native `<input type="range">` keyboard support, but the out-of-band warning is not announced via `aria-live` (it relies on the user re-reading the surrounding card). A future pass could `aria-live="polite"` that warning.

---

## 16. Source data and provenance

Every analyst number on the dashboard carries a typed provenance block, surfaced on `/methodology`:

```ts
type Source = {
  label: string         // "World Bank Bilateral Migration Matrix 2024"
  url: string
  capturedAt: string    // ISO date
  methodologyNote?: string
}

type Provenance = {
  confidence: "high" | "medium" | "low"
  verifiedAt: string    // ISO date
  sources: Source[]
  notes?: string
}
```

Every competitor row, every corridor card, and every B2B segment carries this block. The `/methodology` page renders the full table.

---

## 17. What this codebase deliberately does NOT do

1. Persist anything. Zero database, zero KV, zero file writes.
2. Authenticate anything. Public surface.
3. Multi-tenant. Single-tenant by design.
4. Background work. No queues, no cron, no webhooks.
5. Real-time WebSockets. Quidax does not expose one publicly; 15s polling is the contract.
6. Mobile-app companion. Web only.
7. Internationalisation. en-US only.
8. Dark/light toggle. Dark by intent (matches the pitch context).

---

## 18. How to run locally

```bash
pnpm install
pnpm dev          # https://quidax-b2b-dashboard.vercel.app
pnpm test         # unit tests
pnpm build        # production build
pnpm exec tsc --noEmit   # typecheck
```

No env vars needed.

---

## 19. License & attribution

Independent work by Oluwafolajinmi David Aboderin. Not affiliated with Quidax Technologies Limited. Live market data fetched from Quidax's public REST API and rendered under fair use. Disclaimer on every page footer.

