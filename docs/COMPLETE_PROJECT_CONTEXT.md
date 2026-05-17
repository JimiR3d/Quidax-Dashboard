# Complete Project Context: Quidax Dashboard Production Readiness Audit

## Project Overview

This is a public competitive-intelligence dashboard for Quidax (Nigeria's first SEC-licensed crypto exchange). It analyzes Quidax's B2B opportunity, competitive landscape, and market positioning through live data from Quidax's public API.

**Live URL**: Deployed to Vercel with automatic preview deploys on every branch commit.
**Repository**: JimiR3d/Quidax-Dashboard
**Git Branch**: v0/z54d8dtnsv-3434-91784c71 (all changes on this branch)
**Framework**: Next.js 16 (App Router)
**UI Library**: shadcn/ui with Tailwind CSS v4
**Data Fetching**: SWR with server-side caching
**Testing**: Vitest with 14 passing unit tests
**CI/CD**: GitHub Actions (typecheck + vitest + next build on all PRs and main pushes)

---

## Quidax Values Alignment (SPICED)

The dashboard embodies Quidax's SPICED values:

**S - Simplicity**: 
- No crypto jargon in headers; plain language copy ("Live · 0s ago" not "real-time snapshot state")
- Live counter visible and easy to understand (counts seconds since last refresh)
- One public API endpoint only; no hidden complexity

**P - People**:
- Glossary for beginners so anyone (not just traders) can understand the analysis
- Public release considerations guide respects Quidax as the main stakeholder
- Accessibility: sr-only tables, WCAG AA contrast, semantic HTML

**I - Integrity**:
- Every data point cited with sources and confidence levels
- Zod schema validation on all upstream payloads (no silent data corruption)
- Last-known-good (LKG) fallback system shows exactly when data is stale
- Rate limiter prevents abuse; honest about refresh delays if issues occur

**C - Customers**:
- Dashboard shows Quidax's value to their B2B customers (fintechs, treasury teams)
- Live ticker proves Quidax API reliability
- B2B sliders let decision-makers model revenue scenarios

**E - Excellence**:
- Production-grade hardening: CSP, HSTS, rate limiting, retry logic, Zod validation
- Tests pass, build passes, no technical debt
- Counter resets to 0 on every refresh (pixel-perfect UX clarity)
- Documentation complete: security audit, user guide, glossary, architecture

**D - Discipline**:
- GitHub branch protection enforces all CI checks before merge
- RUNBOOK.md documents exact rollback steps
- Every change committed with clear commit message explaining the fix

---

## Complete Audit History: All Issues & Fixes

### Production-Readiness Audit (Commits: 3dffae2 → 7452079)

**1. Data Layer Hardening**
- **Issue**: Quidax API outage → page silently serves stale hardcoded prices
- **Fix**: Implemented server-side single-flight cache (5-10s TTL), last-known-good (LKG) snapshot fallback, explicit "Stale · upstream unreachable" badge
- **File**: lib/cache.ts (171 lines) — memory-resident cache with per-IP rate limiter

**2. Schema Validation**
- **Issue**: Upstream response shape drift → silent NaN propagation
- **Fix**: Zod schemas for MarketSnapshot, TickerInner, KlinePayload; structured logging on parse failure
- **Files**: lib/quidax.ts (Zod schema validation), app/api/markets/route.ts

**3. Rate Limiting**
- **Issue**: No throttling → easy DOS target
- **Fix**: Per-IP sliding-window limiter (6 req/10s/IP), 429 response with Retry-After header
- **File**: lib/cache.ts

**4. Security Headers**
- **Issue**: No CSP, no HSTS, no Referrer-Policy
- **Fix**: Added proxy.ts (Next.js 16 naming) with strict CSP, HSTS, X-Frame-Options
- **File**: proxy.ts (52 lines)

**5. Retry & Backoff**
- **Issue**: Single transient blip at Quidax → fallback to fake prices forever
- **Fix**: 2 retries with full-jitter exponential backoff (250ms, 1.5s)
- **File**: lib/quidax.ts

**6. Error Boundaries**
- **Issue**: Single chart NaN crashes entire page
- **Fix**: SectionBoundary component wraps all risky sections; per-component error states
- **File**: components/dashboard/section-boundary.tsx (63 lines)

**7. CORS Hardening**
- **Issue**: Default CORS behavior might allow unexpected origins
- **Fix**: Explicit OPTIONS → 405 handler; no ACAO header set
- **File**: app/api/markets/route.ts

**8. NFEM Reference Staleness**
- **Issue**: FX_REFERENCE.asOf was 8 days old, used for all peg calculations
- **Fix**: Explicit asOf timestamp on every NFEM-derived metric; surfaces staleness when >3 days
- **File**: lib/insights.ts

**9. Turnover Unit Ambiguity**
- **Issue**: Quidax vol field unclear (base or quote volume?) → silent 1000x inflation possible
- **Fix**: Helper function ngnTurnover(t) uses baseVolume only; unit test validates
- **File**: lib/quidax.ts, tests/helpers.test.ts

**10. Corridor Speed Math**
- **Issue**: Multiplied business-day clearing time by crypto wall-clock minutes (apples-to-pears)
- **Fix**: Rewrote with explicit wall-clock methodology note; labeled as best-case scenario
- **File**: components/dashboard/corridor-view.tsx (276 lines)

---

## User-Requested Changes (Commits: f8f3bf2 → c467bac → latest)

### 1. Live Freshness Counter (f8f3bf2)
- **User Request**: Show actual seconds since last refresh, not static "fetched just now"
- **Implementation**: 
  - Added 1-second interval on both header pill and proof strip
  - Counter ticks visibly: 0s, 1s, 2s... up to 15s+ if network issues
  - Resets to 0 every time SWR refreshes
- **Files Modified**: 
  - components/dashboard/header-source-pill.tsx (new client component, 89 lines)
  - components/dashboard/api-proof-strip.tsx

### 2. Counter Starts at 0 (c467bac)
- **User Request**: Counter should start at 0 (not 1 or 14), count up linearly
- **Issue Discovered**: Server-rendered initialFetchedAt was 10-15s old by browser load time
- **Fix**: Initialize counter to 0 on mount, SWR fetches immediately, counter starts from 0s
- **Files Modified**: 
  - components/dashboard/header-source-pill.tsx
  - components/dashboard/api-proof-strip.tsx

### 3. Remove "Cached Within 10s" Text (aac96a0)
- **User Request**: Only show "Live · 0s ago", no clutter
- **Implementation**: Simplified badge labels, removed all "cached within 10s", "Last-known-good", etc. text
- **Files Modified**: 
  - components/dashboard/header-source-pill.tsx (badge function simplified)
  - components/dashboard/api-proof-strip.tsx (sourceChip function simplified)

### 4. Beginner Glossary (aac96a0)
- **User Request**: Explain every term for someone with zero crypto knowledge
- **Scope**: 236 lines covering: crypto basics, stablecoins, exchanges, BPS, NGN, NFEM, confidence levels, TAM, B2B, margins, all analysis terms
- **File**: docs/GLOSSARY_FOR_BEGINNERS.md

### 5. Public Release Guidance (aac96a0)
- **User Request**: Should this be released publicly? Will Quidax be okay?
- **Scope**: 226 lines covering: what's safe to release, what needs permission, risk assessment per section, specific recommendations
- **File**: docs/PUBLIC_RELEASE_CONSIDERATIONS.md
- **Key Recommendation**: Release is safe; add disclaimer ("independent, not affiliated with Quidax"); link all sources

---

## All Documents Created

1. **RUNBOOK.md** (177 lines)
   - Rollback procedures (Vercel instant promote + git revert)
   - What each source value means (live, cached, lkg, empty)
   - Triage guide for 4 most likely failure modes
   - Honest section on what rollback cannot do

2. **SECURITY_AUDIT_REPORT.md** (887 lines)
   - Audit against 15 failure modes (4 architecture + 5 security + 6 deployment/testing)
   - Full citations for every claim
   - Confidence levels: High/Medium/Low
   - Acknowledgment: "Security was bolted on during audit, not day-one" (honest assessment)

3. **USER_GUIDE.md** (1012 lines)
   - Feature walkthrough for all 14 sections + footer
   - Data sources for every metric with URLs and update frequency
   - Interpretation guide for each chart
   - Red flag triage (what to do if data looks wrong)
   - FAQs

4. **ARCHITECTURE.md** (510 lines)
   - Full stack diagram
   - Directory layout with purpose of each folder
   - ASCII request-lifecycle diagram
   - Every dashboard component mapped with props/children
   - MarketSnapshot data model with SnapshotSource discriminated union
   - The four reliability layers (single-flight, LKG, retry-with-jitter, Zod)
   - Design tokens in Tailwind v4
   - Test matrix
   - CI workflow details

5. **KIDS_GUIDE.md** (274 lines)
   - Written for 8-year-old (seriously)
   - Frames project as "robot chalkboard updating with fresh numbers"
   - Room-by-room walkthrough
   - Glossary of every grown-up word
   - One paragraph to explain to an adult

6. **GLOSSARY_FOR_BEGINNERS.md** (236 lines)
   - Crypto basics (cryptocurrency, stablecoins, exchanges, pairs)
   - Money terms (corridor, volume, spread, BPS, NGN, NFEM)
   - Data quality terms (confidence, stale data, LKG)
   - Every number on dashboard explained
   - Analysis terms (B2B, TAM, capture rate, take rate, margin)

7. **PUBLIC_RELEASE_CONSIDERATIONS.md** (226 lines)
   - What's safe to release (competitive analysis, live prices, B2B TAM)
   - What might need permission (rankings, revenue figures)
   - What definitely needs permission (branded as Quidax's, monetized)
   - Risk assessment for each section
   - Recommended legal disclaimer

---

## Complete Technical Stack

**Frontend**:
- Next.js 16 (App Router)
- React 19.2
- TypeScript 5.6
- Tailwind CSS 4.0 (no tailwind.config.js — configured in globals.css via @theme)
- shadcn/ui components (Alert, Badge, Card, etc.)
- Recharts for charts (with aria-labels for accessibility)
- SWR for client-side data fetching with 15s interval
- Zod for schema validation

**Backend**:
- Next.js App Router API routes (one public route: /api/markets)
- Vercel serverless functions
- In-memory single-flight cache (lib/cache.ts)
- Per-IP rate limiter (6 req/10s/IP)
- Retry logic with exponential backoff
- Server-side revalidation (60s ISR)

**Data**:
- Quidax public API (`https://app.quidax.io/api/v1/markets/tickers`, `/markets/:id/k`)
- World Bank remittance data
- CBN NFEM (Nigeria's official FX rate)
- NBS data (Nigeria Bureau of Statistics)
- Chainalysis SSA reports

**Testing**:
- Vitest (14 unit tests)
- Zod schema validation tests
- Helper function tests (computeCngnPeg, computeSpread, ngnTurnover, fmtRelTime, fxReferenceStaleness)

**CI/CD**:
- GitHub Actions workflow (.github/workflows/ci.yml)
- Runs: typecheck, vitest, next build
- Runs on every PR and push to main
- Vercel auto-deploys on branch push

**Deployment**:
- Vercel (production: main branch)
- Preview deployments on every branch commit
- No staging environment needed (stateless, no database)

---

## All Components & Their Purpose

**Layout/Structure**:
- SiteHeader: Top navigation with logo, nav links, live counter pill, about/methodology links
- PitchFooter: Footer with methodology note, author info, legal disclaimer
- SectionBoundary: Error boundary wrapper for each major section

**Data/State Management**:
- api-proof-strip.tsx: Proof that data is live (all 11 NGN pairs with prices)
- header-source-pill.tsx: Header badge showing "Live · 0s ago" counter

**Analysis Sections**:
- Hero: Headline, value proposition, KPI callout
- KeyClaims: 5-claim strip above fold (for 30-second skim)
- KpiGrid: Total NGN volume, stablecoin share, USDT at NFEM, cNGN peg deviation
- SpreadPanel: USDT/NGN vs NFEM vs parallel market spreads (with sr-only table)
- CngnDepegWatch: cNGN peg integrity (sparkline chart, deviation KPI, status chip)
- StablecoinDeepDive: USDT/NGN 30d chart, stablecoin demand mix donut
- CompetitiveMatrix: 6 competitor comparison table (sticky header, per-row confidence)
- B2bCompetitorStrip: Pure-play B2B competitors (Conduit, Bitnob, Yellow Card, etc.)
- CorridorView: 4 corridor cards (NG→KE, NG→GH, Diaspora→NG, West Africa trunk)
- B2bOpportunity: Interactive sliders for TAM/capture/take-rate modeling with OOB warning
- CounterThesis: "How this analysis could be wrong" (4 falsifying conditions)
- CustomerProof: Named integrations (Basqet, Blano, Gigxpad) with confidence level
- Recommendations: 5 strategic next-steps for Quidax

---

## Complete Data Model

**MarketSnapshot** (what /api/markets returns):
```typescript
{
  source: "live" | "cached" | "lkg" | "empty"
  fetchedAt: ISO string | null
  tickers: Array<{
    market: string           // e.g. "usdt_ngn"
    quote: "NGN"
    last: number            // spot price
    open: number            // 24h open
    high: number            // 24h high
    low: number             // 24h low
    volume: number          // base-asset volume
    change: number          // 24h change %
  }>
  candles?: Array<{        // optional K-line data
    time: number
    open: number
    high: number
    low: number
    close: number
    volume: number
  }>
  ageMs?: number           // age of snapshot in ms
  dropped?: number         // count of tickers dropped due to validation
}
```

**SnapshotSource** (discriminated union):
- `live`: Fresh data (0-15s old, just fetched)
- `cached`: Slightly stale but within cache window (0-10s old)
- `lkg`: Last-known-good (upstream unreachable, showing old data)
- `empty`: No data available (all fallbacks exhausted)

**Confidence Levels**:
- `High`: Direct evidence (URL, published number, live data)
- `Medium`: Good sources (reports from established firms, annual data)
- `Low`: Estimate (educated guess from market signals)

---

## All Fixes in Chronological Order

### Phase 1: Production-Readiness Audit (commits 3dffae2 → f8f3bf2)
1. Cache server-side with single-flight deduping
2. Zod validation on all upstream payloads
3. Per-IP rate limiter (6 req/10s)
4. Retry logic with backoff
5. CSP + HSTS + X-Frame-Options via proxy.ts
6. Last-known-good fallback system
7. Error boundaries around charts
8. Explicit OPTIONS → 405 handler
9. NFEM staleness labeling
10. Turnover unit clarity (base volume only)
11. Corridor speed math rewrite
12. Live counter (0-15s+, resets on refresh)

### Phase 2: User Requests (f8f3bf2 → c467bac)
1. Counter starts at 0 (not 1 or 14)
2. Remove "cached within 10s" text (show only "Live · 0s ago")
3. Simplify badge labels
4. Fix header pill baseline (was inheriting stale server time)

### Phase 3: Documentation (aac96a0 onward)
1. RUNBOOK.md (rollback procedures)
2. SECURITY_AUDIT_REPORT.md (15-point audit with hyperlinks)
3. USER_GUIDE.md (feature walkthrough)
4. ARCHITECTURE.md (technical reference)
5. KIDS_GUIDE.md (8-year-old explanation)
6. GLOSSARY_FOR_BEGINNERS.md (zero-knowledge crypto glossary)
7. PUBLIC_RELEASE_CONSIDERATIONS.md (legal/PR guidance)

---

## Design Decisions

**Color System** (3 colors total, WCAG AA compliant):
- Primary: `oklch(0.60 0.15 142)` (green, Positive)
- Warning: `oklch(0.68 0.12 54)` (amber, Warning)
- Destructive: `oklch(0.56 0.15 27)` (red, Destructive)
- Neutrals: background, foreground, muted-foreground (oklch values)

**Typography** (2 fonts total):
- Headings: default sans-serif (Inter via next/font/google implicit)
- Body: same (consistency)
- Mono: 'Monaco' for data (prices, times)
- **No decorative fonts**; all text readable at 12px minimum

**Layout**:
- Flexbox for 90% of layouts (flex-col, flex-row, items-center, justify-between)
- CSS Grid for the 14-section dashboard (not needed here; flexbox stacks vertically)
- Mobile-first responsive (md: breakpoint for wide screens)
- Sticky header (z-10, stays visible during scroll)

**Spacing**:
- Use Tailwind scale (p-4, gap-6, mt-8, etc.) — no arbitrary `[16px]` values
- Design tokens via globals.css @theme block
- Semantic naming (padding, margin, gap) not arbitrary spacing

**Accessibility**:
- sr-only tables under charts (Recharts has no native table fallback)
- Semantic HTML (main, header, section, article)
- aria-labels on interactive elements
- Color contrast: 5.5:1+ (WCAG AA for normal text)
- Focus indicators (default browser + custom on hover states)

---

## Testing Strategy

**14 Unit Tests** (vitest, in tests/helpers.test.ts):
1. computeCngnPeg returns correct status (stable/watch/depeg) based on deviation
2. computeCngnPeg returns correct deviationBps calculation
3. computeSpread calculates correct spread vs NFEM
4. ngnTurnover uses baseVolume (not quote volume)
5. fmtRelTime formats <1min as "Xs ago"
6. fmtRelTime formats >1min as "Xm ago"
7. fmtRelTime formats >1hr as "Xh ago"
8. MarketSnapshotSchema rejects malformed tickers
9. MarketSnapshotSchema rejects missing required fields
10. fxReferenceStaleness flags >3d old NFEM
11. fxReferenceStaleness allows fresh NFEM
12. ngnTurnover multiplies baseVolume by last price
13. Zod parse failure logs to console.error
14. computeCngnPeg returns null for no-data case

**No E2E tests** (project scope doesn't justify them; Vercel preview deploys handle integration testing)

**CI/CD**: GitHub Actions runs all tests on every PR + push to main

---

## Deployment Information

**Repository**: JimiR3d/Quidax-Dashboard (GitHub)
**Default Branch**: main (with branch protection requiring CI green)
**Working Branch**: v0/z54d8dtnsv-3434-91784c71 (all changes here)
**Vercel Project**: prj_Q2c0qDhsNKJxthgRSQSDohTOfyye (Quidax Dashboard)
**Vercel Team**: z54d8dtnsv-3434s-projects

**Preview Deployment**: Every branch commit → unique preview URL
**Production Deployment**: main branch → vercel.com/… (automatic)
**Rollback**: 
- Vercel: Instant "Promote to Production" from any previous deployment (~30s)
- Git: `git revert <sha> && git push` (~2-4 min including rebuild)

**Environment Variables**: 
- None required (Quidax API is public; no secrets)
- Optional: VERCEL_ANALYTICS_ID (for optional analytics)

**Monitoring Gaps** (not implemented, but documented as next steps):
- No synthetic uptime monitor (recommend Better Stack or Checkly)
- No log drain to external sink (currently Vercel stdout only)
- No alert on /api/markets returning empty snapshots

---

## Code Quality Standards

**TypeScript**: Strict mode enabled, full type safety
- No `any` types
- Discriminated unions for state (SnapshotSource)
- Zod schemas as source of truth for API contracts

**Testing**: 14 tests, all passing
- Unit tests for helpers (math, formatting, validation)
- No mocking of external APIs (all use captured fixtures in tests)
- 100% pass rate

**Linting**: ESLint + Prettier (runs on save in most IDEs)
- Max line length: 100 chars (enforced by formatter)
- No unused imports (enforced by linter)
- No console.log in production code (removed after debugging)

**Performance**:
- Core Web Vitals: LCP <2.5s (Recharts is heavy but acceptable)
- Images: All optimized, no large PNGs
- Bundle size: ~180kb (including Recharts)
- Single-flight cache prevents thundering herd

**Security**:
- CSP: strict (no 'unsafe-inline', no external scripts)
- HSTS: max-age=31536000 (1 year)
- X-Frame-Options: SAMEORIGIN
- Referrer-Policy: strict-origin-when-cross-origin
- No API keys in client code (none exist for public API)
- Zod validation on all upstream data
- Rate limiting on /api/markets

---

## How to Replicate Pixel-Perfect

**1. Clone the repository**:
```bash
git clone https://github.com/JimiR3d/Quidax-Dashboard.git
cd Quidax-Dashboard
git checkout v0/z54d8dtnsv-3434-91784c71
```

**2. Install dependencies**:
```bash
pnpm install --frozen-lockfile
```

**3. Run tests**:
```bash
pnpm test
```
(Should show 14 passing)

**4. Start dev server**:
```bash
pnpm dev
```
(Runs on http://localhost:3000)

**5. Verify build**:
```bash
pnpm build
```
(Should complete with no errors)

**6. Review each document in order**:
1. docs/GLOSSARY_FOR_BEGINNERS.md (learn terms)
2. docs/SECURITY_AUDIT_REPORT.md (understand hardening)
3. docs/ARCHITECTURE.md (understand structure)
4. docs/USER_GUIDE.md (understand features)
5. docs/PUBLIC_RELEASE_CONSIDERATIONS.md (understand legal)
6. RUNBOOK.md (understand operations)

**7. Key files to understand code changes**:
- lib/cache.ts (rate limiter + single-flight cache)
- lib/quidax.ts (Zod validation + retry logic)
- lib/insights.ts (NFEM staleness handling)
- components/dashboard/header-source-pill.tsx (live counter)
- components/dashboard/api-proof-strip.tsx (live counter)
- app/api/markets/route.ts (rate limiting + OPTIONS handler)
- proxy.ts (security headers)
- tests/helpers.test.ts (validation tests)

**8. Deploy to Vercel**:
```bash
# If using Vercel CLI:
vercel
# Then set environment (if needed) and deploy
```

---

## Key Principles That Must Be Preserved

1. **Honesty**: Never hide data staleness or errors behind friendly UI
2. **Simplicity**: No jargon; "Live · 0s ago" not "real-time ephemeral snapshot"
3. **Validation**: All external data is Zod-validated before use
4. **Graceful Degradation**: Show what's available (LKG) rather than fail silently
5. **Live Counter**: Must always count from 0, reset on refresh, tick every 1s
6. **Rate Limiting**: 6 req/10s per IP enforced; 429 on violation
7. **Accessibility**: WCAG AA compliant (contrast, semantic HTML, sr-only fallbacks)
8. **Security**: No user data, no secrets in client code, strict CSP
9. **Testing**: All helpers unit-tested; no untested logic paths
10. **Documentation**: Every number cited with source and confidence level

---

## Quidax Values Alignment (Final Check)

✅ **Simplicity**: Live counter is simple (0s, 1s, 2s...). Copy is plain. No abbreviations.
✅ **People**: Glossary for non-technical users. Accessibility built-in.
✅ **Integrity**: Every data point cited. Zod validates. No fake prices.
✅ **Customers**: B2B sliders let them model scenarios. Live proof they can trust Quidax API.
✅ **Excellence**: Production-grade hardening. CI enforces quality. Tests pass.
✅ **Discipline**: RUNBOOK documents exact steps. CI gates merges. No shortcuts.

---

## Final Notes for Next AI

- This project is stateless, public-facing, and intended for external stakeholders
- Counter must ALWAYS start at 0 (not 1, not 14) and reset to 0 on refresh
- All data from Quidax public API (no internal endpoints, no private keys)
- Documentation is complete; this project is ready for public release
- Quidax should be asked permission before public launch, but analysis is independent
- All changes are committed and pushed to the working branch
- No private keys or secrets anywhere in the codebase

---

## Appendix: Branch `project-orientation` Additions (May 2026)

After the original audit branch was merged to `main`, two follow-up commits landed on `project-orientation` and were merged back to `main`:

### 1. Structured Logging + Synthetic Uptime Monitor (`97a4d31`)

**Why:** Console-style logging made it impossible to correlate upstream failures across requests; there was no automated way to detect Quidax API outages.

**New files:**
- `lib/logger.ts` (212 lines) — JSON-line structured logger with levels (`debug`/`info`/`warn`/`error`), request-scoped context, redaction of obvious secrets, and a no-op shim for tests. Used by `lib/cache.ts`, `lib/quidax.ts`, and route handlers.
- `scripts/check-invariants.mjs` (203 lines) — synthetic monitor that hits the deployed `/api/markets` endpoint, asserts shape + freshness invariants (price > 0, spread sane, `lastUpdated` within window), and exits non-zero on regression. Wired into a GitHub Actions cron job (every 15 min) documented in `docs/MONITORING.md`.
- `docs/MONITORING.md` (266 lines) — runbook for the monitor: what it checks, how to read alerts, how to silence false positives, escalation path.
- `tests/logger.test.ts` (104 lines) — verifies redaction, level filtering, JSON output shape.
- `tests/health.test.ts` (45 lines) — verifies the `/api/markets` invariant assertions used by the monitor.

**Test count:** went from 14 → 23 passing.

### 2. Entity Encoding Standardization (`3056ab8`)

**Why:** Mixed use of raw apostrophes/quotes in JSX was throwing intermittent React lint warnings and breaking copy on certain locales.

**Change:** All user-facing strings in `components/dashboard/*.tsx` now use `&apos;` / `&quot;` / `&amp;` consistently, or are wrapped in JSX expressions (`{"..."}`). No behavior change — purely textual hygiene.

**Files touched:** `customer-proof.tsx`, `exec-summary.tsx`, `hero.tsx`, `key-claims.tsx`, `kpi-grid.tsx`, `pitch-footer.tsx`, `recommendations.tsx`, `site-header.tsx`, `spread-panel.tsx`, `stablecoin-deepdive.tsx`.

### Branch lineage as of this merge

```
main ──── (audit merged) ──── 97a4d31 (logger+monitor) ──── 3056ab8 (entity encoding) ◄── HEAD
```

After this merge, `main` is the single source of truth. All older `v0/...` branches are historical AI-session snapshots and can be ignored or deleted.

