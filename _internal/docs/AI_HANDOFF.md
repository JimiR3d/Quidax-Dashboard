# AI Handoff Document — Quidax Dashboard Project

**Last Updated:** 2026-05-27  
**Author:** Antigravity IDE Agent  
**For:** Any AI agent continuing work on this project

---

## What This Project Is

A **live market intelligence dashboard** built by **Oluwafolajinmi David Aboderin (Jimi)** as a job application / outreach project for the **Quidax** team. It argues — with live data and interactive models — that Quidax's biggest growth opportunity is **B2B** (selling its exchange API to fintechs, remittance operators, and corporate treasury teams), not retail trading.

- **Framework:** Next.js 16.2.6 (App Router, Turbopack) + TypeScript + shadcn/ui + Recharts
- **Hosting:** **Live on Vercel** at https://quidax-b2b-dashboard.vercel.app/
- **Live data:** Quidax public API (`app.quidax.io/api/v1/markets/tickers`)
- **Repo location:** `c:\Users\Jimi\Downloads\The Anti-Gravity\Quidax-Dashboard`

---

## The User — Jimi

- **Full name:** Oluwafolajinmi David Aboderin
- **Background:** CS graduate (Covenant University), data analysis internship, looking for a role at Quidax
- **Strategic asset:** His father is the CFO of May & Baker Nigeria PLC — a publicly listed pharma company that imports 90% of raw materials internationally. This makes Jimi uniquely positioned to open a B2B deal between Quidax and May & Baker.
- **Communication style:** Prefers simple, scannable, Kodak-style writing. No wall of text. Warm and casual.

---

## Current Project Architecture (Multi-Page Hub)

Refactored from a single-page dashboard to a **6-page hub** with shared header navigation:

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Hero, key claims, pitch footer |
| `/market` | Live Market | FX spread panel, cNGN depeg watch, API ticker strip |
| `/stablecoins` | Stablecoins | Deep-dive into stablecoin dominance, demand-purpose mix chart |
| `/competition` | Competition | Competitive matrix (5 exchanges), B2B competitor strip, counter-thesis |
| `/opportunity` | Opportunity | Interactive B2B revenue model (5 segments with sliders), corridor view (4 corridors), customer proof |
| `/playbook` | Playbook | 5 recommendations for Quidax |
| `/about` | About | Candidate bio and contact info |
| `/methodology` | Methodology | Full provenance register, source attribution, confidence levels |

---

## Key Files and Their Roles

### Data Layer (`lib/`)
| File | Role |
|---|---|
| `lib/competitive-data.ts` | **⭐ MASTER DATA FILE.** All competitor data, B2B segments/TAMs, corridor references, stablecoin mix. Every row has `provenance` (sources, verifiedAt, confidence). Change data here FIRST. |
| `lib/quidax.ts` | API client with Zod validation, 10s TTL cache, LKG snapshotting |
| `lib/fx-rates.ts` | Dual-API FX fetcher (open.er-api.com + fawazahmed0), 6h TTL |
| `lib/insights.ts` | Spread computation, staleness logic, B2B customer testimonials |
| `lib/format.ts` | Number/currency formatting utilities |

### Components (`components/dashboard/`)
| Component | Page | What it renders |
|---|---|---|
| `hero.tsx` | Home | Headline + metadata cards |
| `key-claims.tsx` | Home | 5 expandable claim cards |
| `pitch-footer.tsx` | Home | Contact info + method note |
| `spread-panel.tsx` | Market | Live USDT vs CBN vs parallel FX |
| `cngn-depeg-watch.tsx` | Market | Live cNGN peg deviation |
| `api-proof-strip.tsx` | Market | All NGN pairs, live prices, sparklines |
| `stablecoin-deepdive.tsx` | Stablecoins | USDT/NGN chart + demand-purpose donut |
| `competitive-matrix.tsx` | Competition | 5-exchange comparison table |
| `b2b-competitor-strip.tsx` | Competition | Non-exchange B2B rails |
| `counter-thesis.tsx` | Competition | 4 falsifiers / bear cases |
| `b2b-opportunity.tsx` | Opportunity | Interactive TAM model with sliders |
| `corridor-view.tsx` | Opportunity | 4 trade corridors with speed/cost comparisons |
| `customer-proof.tsx` | Opportunity | Named B2B customers (Basqet, Blano, Gigxpad) |
| `recommendations.tsx` | Playbook | 5 prioritized recommendations |
| `exec-summary.tsx` | **Unused** | Legacy component, not imported anywhere |
| `site-header.tsx` | All pages | Nav bar with live/stale source pill |

---

## Critical Data Corrections (May 27, 2026)

All corrections were fact-checked by the user via Perplexity AI and applied across the codebase:

### Competitor Corrections
- **Yellow Card:** Discontinued ALL retail trading as of Jan 1, 2026. App deactivated. Now B2B-only stablecoin infrastructure. Their Dec 2023 registration was a "Certificate of Entry into the Register of Business within Virtual Currencies" — **NOT** a provisional licence equivalent to Busha/Quidax ARIP.
- **Luno:** Regulated and active in Nigeria, but does **NOT** hold a provisional SEC VASP licence equivalent to Busha or Quidax.
- **Busha:** SEC provisional licence confirmed (August 2024 ARIP cohort). Listed cNGN first (Feb 3, 2025). **Strongest direct competitor on both retail and B2B.** Has "Busha Business" B2B stack.
- **Roqqu:** Flitaa acquisition July 2025 confirmed. Expanded into East Africa.
- **cNGN dates:** Busha listed Feb 3, 2025 (per TechCabal); Quidax listed Mar 12, 2025 (per Quidax corporate blog).
- **cNGN issuer:** African Stablecoin Consortium (ASC) under SEC ARIP oversight — NOT "AFEX" or "Luno."

### Corridor/TAM Corrections
| Corridor | Old Value | Corrected Value | Source |
|---|---|---|---|
| NG→CN | $22.5B | **$13B** | NBS Foreign Trade in Goods 2025 |
| NG→AE | $5.5B | **~$4B** | NBS + CBN BoP; CEPA Jan 2026 accelerating |
| NG↔KE | $1.5B | **~$100M** | UN COMTRADE. Aspirational AfCFTA opportunity. |
| Diaspora→NG | $20.9B | **$20–22B official, ~$23B with informal** | World Bank 2025 |

### FX/Market Corrections
- Pre-unification premium: "well above 30%, frequently reaching 50–60%"
- Current spread: "approximately 1–2.5% as of May 2026"
- Naira volatility: REMOVED "18–25% annualised." Replaced with "spiked above 40% post-unification, compressed significantly by mid-2026"

### Stablecoin Corrections
- 86% stablecoin share: Confirmed directionally but labelled as **analyst estimate** everywhere.
- cNGN is listed on BOTH Quidax and Busha — NOT exclusive to Quidax.

---

## User Preferences and Directives

1. **"Make it simple."** No wall of text. Kodak-style writing. Scannable. Emojis for visual breaks.
2. **"Do not delete anything — qualify it honestly."** If a claim is unverifiable, add a caveat, don't remove it.
3. **"Do not make exclusivity claims about SEC status unless verifiably true."**
4. **Tone:** Warm, casual, strategic use of emojis, Quidax brand voice.
5. **Integrity:** Every estimate must carry its sources. If unverifiable, add a visible caveat.
6. **No placeholders:** Everything should be production-quality.

---

## Documentation Inventory

All docs are in the project `docs/` folder:

| Document | Purpose | Status |
|---|---|---|
| `README.md` (root) | Project overview, setup, architecture | ✅ Updated May 27 |
| `docs/AI_HANDOFF.md` | This document | ✅ Current |
| `docs/COMPLETE_PROJECT_CONTEXT.md` | Full project context for new readers | ✅ Updated May 27 |
| `docs/ARCHITECTURE.md` | Technical architecture reference | ⚠️ May need page-route updates |
| `docs/GLOSSARY_FOR_BEGINNERS.md` | Plain-English term glossary | ✅ Updated May 27 |
| `docs/KIDS_GUIDE.md` | Explain-like-I'm-5 version | ✅ Updated May 27 |
| `docs/USER_GUIDE.md` | Comprehensive feature walkthrough | ✅ Updated May 27 |
| `docs/MONITORING.md` | Observability & data pipeline notes | ⚠️ Review if still accurate |
| `docs/SECURITY_AUDIT_REPORT.md` | Security posture review | ✅ No changes needed |
| `docs/LINKEDIN_OUTREACH_PLAN.md` | Full outreach playbook (messages, DMs, step-by-step) | ✅ Copied May 27 |
| `docs/QUIDAX_STRATEGY.md` | Strategy v2 (the "deal-maker not job applicant" plan) | ✅ Copied May 27 |
| `INTERVIEW_PREP.md` (root) | Quick-reference interview talking points | ✅ Updated May 27 |
| `RUNBOOK.md` (root) | Dev ops / deployment runbook | ⚠️ Review if still accurate |

---

## LinkedIn Outreach Plan

Two documents are now in `docs/`:

### `docs/LINKEDIN_OUTREACH_PLAN.md` — The Full Playbook
Contains:
- Step-by-step execution guide (10 steps, 15-30 days)
- Protection layers (how to keep yourself in the center)
- LinkedIn DM templates for **Kelechi Onwuka (CBO)** and **Buchi Okoro (CEO)**
- The **Deal Memo** template for May & Baker
- Quick reference card (what to say vs. what NOT to say)
- Contingency plans if things go wrong

### `docs/QUIDAX_STRATEGY.md` — The Strategic Framework
Contains:
- Jimi's three unfair advantages
- "Deal-maker, not job applicant" positioning
- Day-by-day 30-day execution timeline
- What NOT to do (critical mistakes to avoid)

### LinkedIn Profile Optimization
Located at: `C:\Users\Jimi\.gemini\antigravity-ide\brain\fe80fe1a-d6b7-4e15-bd62-ddbe31eaeb86\linkedin_optimization.md`

**One-liner for when he posts the dashboard:**
> "I built a live market intelligence dashboard that shows Quidax exactly where its next $4–14M in B2B revenue is hiding — with real data, honest assumptions, and sliders you can drag to test the math yourself."

---

## Conversation History

All conversation logs for this session are at:
`C:\Users\Jimi\.gemini\antigravity-ide\brain\1b46411d-94a4-4d77-90e5-f9730ca675cc\.system_generated\logs\transcript.jsonl`

### Key Artifacts from This Session
| Artifact | Path |
|---|---|
| Full Content Audit | `brain\1b46411d...\full_content_audit.md` |
| Fact-Check Dossier | `brain\1b46411d...\fact_check_dossier.md` |
| Implementation Plan | `brain\1b46411d...\implementation_plan.md` |
| Walkthrough | `brain\1b46411d...\walkthrough.md` |

### Prior Conversation Artifacts
| Artifact | Path |
|---|---|
| Quidax Complete Playbook | `brain\8b90e084...\quidax_complete_playbook.md` |
| Quidax Strategy v2 | `brain\8b90e084...\quidax_strategy_v2.md` |
| Quidax Strategy v1 | `brain\8b90e084...\quidax_strategy.md` |
| LinkedIn Optimization | `brain\fe80fe1a...\linkedin_optimization.md` |
| Brand Strategy | `brain\fe80fe1a...\brand_strategy.md` |
| Original Action Plan | `brain\dfd9f92b...\implementation_plan.md` |

---

## Outstanding Work Items

| Item | Priority | Notes |
|---|---|---|
| FX fallback refresh | Medium | Hardcoded fallback values in `fx-rates.ts` are stale |
| ~~Production deployment~~ | ✅ Done | Live at https://quidax-b2b-dashboard.vercel.app/ |
| Methodology section numbering | Low | May reference old single-page numbering |
| Historical FX claim verification | Low | Needs time-series data for precise verification |

---

## How to Pick Up Where I Left Off

1. **Read `lib/competitive-data.ts`** — this is the single source of truth for all claims, competitors, TAMs, and provenance.
2. **Read `components/dashboard/corridor-view.tsx`** — corridor data is defined here, NOT in competitive-data.ts.
3. **Check `app/methodology/page.tsx`** — this renders the provenance register the reader sees.
4. **Run `npm run dev`** for local dev. For production, **push to git** — Vercel auto-deploys from the repo. Delete `.next` folder and hard-refresh browser (Ctrl+Shift+R) if local data changes aren't reflecting.
5. **Build with `npx next build`** to verify all routes compile.
6. The project has **no tests** — verification is build + manual review.
7. All competitive data carries `verifiedAt` dates — update these when refreshing claims.
8. **User's operating system is Windows 11.** All file paths use Windows conventions.
