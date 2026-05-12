# NGN Liquidity Intelligence — A B2B Growth Thesis for Quidax

A live competitive-intelligence dashboard built to demonstrate analyst, data, and product-thinking ability to the Quidax team. Built by **Oluwafolajinmi David Aboderin** ([folajinmi13@gmail.com](mailto:folajinmi13@gmail.com)).

> **What this is in one sentence:** A web page that pulls real prices from Quidax's public API every 15 seconds, presents them next to an interactive competitive analysis of Yellow Card / Busha / Luno / Roqqu, and argues — with numbers you can drag and re-compute yourself — that Quidax's biggest growth opportunity is selling its API to other businesses (B2B), not chasing retail traders.

---

## Table of contents

1. [Read this first (plain English)](#1-read-this-first-plain-english)
2. [The thirteen sections of the dashboard](#2-the-thirteen-sections-of-the-dashboard)
3. [How it works (no code knowledge required)](#3-how-it-works-no-code-knowledge-required)
4. [What's real data vs analyst estimate](#4-whats-real-data-vs-analyst-estimate)
5. [The tech stack in one breath](#5-the-tech-stack-in-one-breath)
6. [File-by-file map of the project](#6-file-by-file-map-of-the-project)
7. [Running, exporting, and publishing](#7-running-exporting-and-publishing)
8. [Glossary](#8-glossary)

See also **`INTERVIEW_PREP.md`** for the outreach playbook, talking points, and likely interview questions.

---

## 1. Read this first (plain English)

Imagine Quidax is a giant marketplace where Nigerians swap naira (₦) for crypto. Most people picture it as a place where regular humans trade Bitcoin on their phones — that's the **retail** business.

But the same marketplace can be **rented out** to other businesses. A bank, a remittance app, or a fintech that wants to let their users buy crypto without building the plumbing themselves can plug into Quidax's API (a kind of digital socket) and use Quidax's exchange under the hood. That's the **B2B** business — also known as "Quidax-as-a-Service."

**The argument this dashboard makes:**

- The biggest pile of money flowing through Nigerian crypto right now is not regular people trading — it's businesses moving dollars in and out of the country using stablecoins (digital dollars like USDT).
- Quidax is the only Nigerian exchange that is **(a)** SEC-licensed, **(b)** has deep naira liquidity, **(c)** offers a real API to other businesses, and **(d)** lists cNGN — the regulated naira stablecoin.
- Therefore Quidax should double down on selling that API to fintechs, banks, and remittance apps — that's where the next $10–20 million per year of revenue is hiding.

The dashboard makes that argument with **data you can verify yourself by clicking a link**, not vibes. The interactive B2B model lets a reader plug in their own assumptions and see if the number still holds.

---

## 2. The thirteen sections of the dashboard

The page is deliberately ordered to surface the **differentiated analyst work first** — the things Quidax does not already have on their own homepage — and to put the live price plumbing last, as evidence of integration capability.

### 2.1 Site header (top bar)
- The **purple "Q"** is the brand mark.
- The **green pulsing dot** that says "Live · Quidax API" means the page is currently pulling real data. If it ever says "Simulated snapshot" in amber, the upstream API is unreachable and we are showing a backup snapshot.
- The **"Hire me"** button opens an email to you.

### 2.2 Hero
The headline: **"Nigeria's next billion dollars of crypto flow is B2B, not retail."** Three small metadata cards underneath: who wrote it, where the data comes from (`app.quidax.io`), and when it was last generated.

### 2.3 Executive Summary
Four tiles labelled **The thesis**, **The wedge**, **The model**, **The moat**. For a busy executive who has 20 seconds and wants to know whether to keep reading.

### 2.4 Executive snapshot (KPI grid — 4 cards)
The four highest-signal numbers, deliberately not duplicating what's on Quidax's own homepage:
1. **Total NGN spot turnover (24h)** — naira value traded across every Quidax NGN pair in the last day.
2. **Active NGN pairs** — how many naira markets Quidax actually runs.
3. **Stablecoin share of NGN volume** — proves the thesis in one number.
4. **B2B revenue opportunity** — the highlighted purple-glow card. The mid-case annual revenue Quidax could capture from the four B2B segments combined.

### 2.5 FX Spread Panel (the single most useful number for any Nigerian treasurer)
Live USDT/NGN on Quidax vs implied parallel-market USD/NGN vs official CBN FX. The premium between each pair is shown as a gauge. **Quidax themselves do not publish this** — it's exactly the kind of monitoring an internal data team would build.

### 2.6 cNGN Depeg Watch (live)
Quidax is the only local exchange listing cNGN (the regulated naira stablecoin). This panel reads the live `cngnngn` and `cngnusdt` markets, computes the implied peg deviation, and flags any meaningful drift. **Internal-data-team-level work, done from public endpoints.** No competitor publishes this.

### 2.7 Stablecoin deep-dive
Two charts:
- **Big chart:** USDT/NGN price (real Quidax daily closes for 30 days) vs an analyst model of the official CBN dollar rate. The gap is the **premium**, plotted as a percentage line underneath.
- **Donut chart:** USDT 68%, cNGN 9%, USDC 12%, other stables 4%, BTC 7% — totalling ~93% stablecoin-denominated turnover on NGN pairs.

### 2.8 Competitive positioning
Comparison table: Quidax vs Yellow Card vs Busha vs Luno vs Roqqu across positioning, B2B API maturity, NGN pair count, NGN focus, African country footprint, stablecoin focus, and notable edge. Quidax's row is highlighted in purple.

### 2.9 B2B opportunity sizing — INTERACTIVE
Four segments where Quidax can monetize businesses:
1. Cross-border B2B settlement
2. Inbound remittances
3. Fintech treasury & FX hedging
4. Embedded crypto in fintech apps

**Each segment has two sliders** — Capture % and Take rate (bps) — that re-compute the bar chart and aggregate total live. The model-low and model-high totals stay pinned so the reader can see how their assumption compares to the bracket. A **Reset to model** button restores the analyst defaults.

This is the section that lets the reader pressure-test the thesis themselves. If their assumptions still produce $5M+/yr, the case is made.

### 2.10 Corridor map
Four real-world flows where stablecoin rails already out-compete correspondent banking:
- **NG → CN** (importer settlement)
- **NG → AE** (Dubai trade + diaspora savings)
- **NG ↔ KE** (regional B2B / SaaS / agritech)
- **DIASPORA → NG** (inbound remittances)

For each: annual flow, the Quidax pairs that serve it, bank-wire speed/cost vs stablecoin speed/cost, calculated speed-advantage and bps-saving. Sources cited per card (NBS, CBN BoP, World Bank).

### 2.11 Customer proof
Names Quidax's actual public B2B clients (**Basqet, Blano, Gigxpad**) from their own homepage, positions each in the four-segment B2B map, and notes the visible gap (no major remittance partner publicly named yet). Shows the reader you did your homework.

### 2.12 Five things I would ship next
Five priority-ranked recommendations (P0, P1, P2) with thesis and owning team. Converts analysis into a roadmap and shows operator thinking, not just analyst thinking.

### 2.13 API integration proof strip
A compact bottom-of-page bar listing every live NGN pair, with last price, 24h change, and a tiny 30-day sparkline. Polls `/api/markets` every 15s via SWR. **Deliberately framed as integration evidence**, not as a competitor to Quidax's own ticker. Rows flash green or red for ~0.9s when a price changes.

### 2.14 Pitch footer
Contact card: email, LinkedIn, GitHub. Two-paragraph candidate brief. "What I'd bring on day one" list. Honest method note explaining live vs modelled data.

---

## 3. How it works (no code knowledge required)

Pretend the dashboard is a restaurant. Here are the people working in it.

**The waiter (Next.js — the framework).** Takes the customer's order ("show me the dashboard") and decides which kitchen workers need to cook what.

**The cook who calls Quidax (the API client, `lib/quidax.ts`).** When a request comes in, this cook picks up the phone and calls Quidax at `https://app.quidax.io/api/v1/markets/tickers` for the live ticker board, and at `…/markets/usdtngn/k` for 30 days of historical candles.

**The kitchen safety net.**
- If Quidax doesn't answer within **5 seconds**, the cook hangs up so the customer is not kept waiting.
- If Quidax answers with garbage, the cook serves a pre-prepared backup plate (the simulated snapshot) and the waiter puts a small amber warning sticker on it ("Simulated snapshot").

**The plating team (React components in `components/dashboard/`).** Each section of the dashboard is a separate plate. The KPI plate, the cNGN watch plate, the corridor plate, the interactive B2B plate. They all get fed the same source data and lay it out differently.

**The dining room (the browser).** The customer sees the finished plates. One specific plate — the API Integration Proof strip at the bottom — is being constantly re-plated by a tiny robot called **SWR** that calls the kitchen every 15 seconds and swaps the plate quietly without the customer noticing. The interactive B2B sliders live in the customer's own browser; they re-cook their plate locally every time the customer drags.

**The walls and lighting (`globals.css`).** All the purple colours, glow effects, noise texture, the grid pattern in the background — all defined in one file using a colour system called **OKLCH** at hue 305 (the Quidax brand purple).

**The signage (`app/layout.tsx`).** Sets the website title, the description that shows when you share the link, the fonts, and the dark theme.

---

## 4. What's real data vs analyst estimate

This is the most important table to memorise before any interview. Honest analysts get hired; bluffers get caught.

| Number on the dashboard | Source | Honest label |
|---|---|---|
| Every price in the API proof strip | Quidax public ticker API, polled every 15s | **REAL · LIVE** |
| 24-hour change %, high, low, base/quote volume | Quidax public ticker API | **REAL · LIVE** |
| USDT/NGN 30-day chart line | Quidax K-line API (daily candles) | **REAL · 30 days back** |
| cNGN/NGN, cNGN/USDT live values | Quidax public ticker API | **REAL · LIVE** |
| Total NGN turnover KPI | Computed from real Quidax volumes × prices | **REAL · derived** |
| Active NGN pair count | Counted from live API response | **REAL · live** |
| Number of NGN pairs per competitor | Manually checked on their public sites | **REAL · manually verified** |
| The "Official CBN FX (model)" line | Analyst model anchored to a plausible discount to real USDT closes | **ESTIMATE · explicitly labeled "model"** |
| USDT premium vs CBN FX % (Spread Panel + KPI) | Derived from the model above | **ESTIMATE · directional** |
| Stablecoin volume mix donut (USDT 68%, cNGN 9%, etc.) | Analyst estimate triangulated from Chainalysis / public reporting | **ESTIMATE · directional** |
| Corridor flow figures (NG→CN $22.5B, etc.) | Analyst proxies from NBS import data, CBN BoP, World Bank, Chainalysis | **ESTIMATE · sourced proxies** |
| Bank-wire vs stablecoin speed/cost in each corridor | Industry benchmarks, not Quidax-specific | **ESTIMATE · benchmark** |
| Every TAM number in the B2B section | Analyst proxies, sources cited | **ESTIMATE · sourced proxies** |
| Capture % and take rate (bps) per segment | Working assumptions (and now user-adjustable via sliders) | **ASSUMPTION** |
| Aggregate "B2B revenue opportunity" | Model output, not a forecast | **MODEL OUTPUT** |
| Customer-proof names (Basqet, Blano, Gigxpad) | Read off quidax.com homepage | **REAL · publicly disclosed** |
| The 5 recommendations | Analyst opinion | **OPINION** |

**Rule when presenting:** If anyone asks "is that real?", only answer **yes** about items marked REAL. For everything else say "analyst model — here are my assumptions."

---

## 5. The tech stack in one breath

- **Next.js 16** with Turbopack — the website framework. Handles routing, server rendering, and the `/api/markets` route. Static page revalidated every 15s; dynamic API route never cached.
- **React 19** — the UI library that draws everything you see.
- **TypeScript** — JavaScript with type-safety. Catches bugs before they ship.
- **Tailwind CSS v4** — utility-first styling. The `className="flex items-center gap-3"` strings in the code. All theme colours defined in OKLCH via `globals.css`.
- **shadcn/ui** — pre-built UI primitives (cards, badges, etc.) layered on top of Tailwind.
- **Recharts** — the library that draws the line, area, bar, and donut charts.
- **SWR** — the data-fetching robot that polls `/api/markets` every 15 seconds in the browser. Stands for "stale-while-revalidate."
- **lucide-react** — the icon set.
- **Vercel** — where it deploys. One-click publish.
- **The Quidax public API** at `app.quidax.io/api/v1/...` — no auth needed for market data.

You can recite this list in an interview verbatim and it reads as "this person knows their stack."

---

## 6. File-by-file map of the project

```
my-project/
├─ app/
│  ├─ layout.tsx              ← Page wrapper: fonts, theme color, <html>/<body>.
│  ├─ globals.css             ← All the purple, the glow, the grid pattern. OKLCH hue 305.
│  ├─ page.tsx                ← The home page. Imports + stacks every section.
│  └─ api/
│     └─ markets/route.ts     ← The /api/markets endpoint the browser polls every 15s.
│
├─ lib/
│  ├─ quidax.ts               ← Calls Quidax. Handles timeouts (5s). Normalizes data.
│  ├─ competitive-data.ts     ← Hand-curated analyst data (competitors, B2B segments, recs).
│  ├─ insights.ts             ← Spread / depeg / premium computations from live data.
│  └─ format.ts               ← Number/currency/percent formatting helpers.
│
├─ components/dashboard/
│  ├─ site-header.tsx         ← Top bar with logo + nav + "Hire me" button.
│  ├─ hero.tsx                ← The big headline section.
│  ├─ exec-summary.tsx        ← The four-tile TL;DR.
│  ├─ kpi-grid.tsx            ← The four big-number cards.
│  ├─ spread-panel.tsx        ← USDT/NGN vs parallel vs CBN FX panel (NEW).
│  ├─ cngn-depeg-watch.tsx    ← Live cNGN peg monitor (NEW).
│  ├─ stablecoin-deepdive.tsx ← USDT/CBN line chart + donut.
│  ├─ competitive-matrix.tsx  ← The competitor comparison table.
│  ├─ b2b-opportunity.tsx     ← Interactive B2B sizing with sliders (NEW).
│  ├─ corridor-view.tsx       ← Four-corridor settlement map (NEW).
│  ├─ customer-proof.tsx      ← Basqet / Blano / Gigxpad citations (NEW).
│  ├─ recommendations.tsx     ← The 5 "things I'd ship" cards.
│  ├─ api-proof-strip.tsx     ← Compact live ticker, framed as integration proof (NEW).
│  ├─ sparkline.tsx           ← The tiny 30-day trend chart.
│  └─ pitch-footer.tsx        ← The contact + method note.
│
├─ components/ui/             ← shadcn primitives. Pre-installed, do not edit.
├─ package.json               ← Dependency list.
├─ README.md                  ← You are reading it.
└─ INTERVIEW_PREP.md          ← Talking-points and outreach playbook.
```

**The mental rule:** `lib/` holds data + logic, `components/dashboard/` holds visual sections, `app/` wires them together.

---

## 7. Running, exporting, and publishing

### 7.1 Publishing the live version (no code needed)

This is what you actually want. The dashboard lives inside v0. To put it on the public internet so you can send Buchi a link:

1. In v0, click the **Publish** button in the top right.
2. v0 deploys to Vercel and gives you a URL like `something.vercel.app`.
3. That URL is what you send to Quidax.

### 7.2 Downloading the code (for GitHub / your CV)

1. Click the **three-dot menu** in the top right of the Block view.
2. Choose **Download ZIP**.
3. Unzip it on your laptop.
4. Push it to GitHub at `github.com/JimiR3d/quidax-intelligence` (or any name). Add this line to your CV:
   > **Quidax B2B Intelligence Dashboard** — Live Next.js dashboard pulling Quidax public market data; interactive B2B revenue model across 4 segments; corridor map for NG→CN, NG→AE, NG↔KE, diaspora→NG; cNGN depeg watch. *Link: …vercel.app · Code: github.com/JimiR3d/…*

### 7.3 Running it on your own laptop (only if curious)

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

### 7.4 Updating data without touching code

The competitor numbers, B2B segment defaults, and recommendations all live in **one file: `lib/competitive-data.ts`**. Corridor flows live in `components/dashboard/corridor-view.tsx`. Live prices update themselves — never touch those.

---

## 8. Glossary

- **API** — a digital socket. One program asks another for data using a URL. Quidax's API gives anyone (no password needed for market data) the current prices.
- **Endpoint** — a specific URL on an API. `app.quidax.io/api/v1/markets/tickers` is one endpoint.
- **Ticker** — a snapshot of one market: last price, high, low, volume.
- **K-line / candles** — historical price data shaped like Japanese candlesticks: open, high, low, close per time bucket. We use 1-day buckets (1440 minutes).
- **OKLCH** — a colour system that describes colour by **lightness**, **chroma** (saturation), and **hue** (angle on the colour wheel). Quidax purple is hue **305**.
- **Stablecoin** — a crypto token pegged to a fiat currency. USDT and USDC are pegged to the US dollar. cNGN is pegged to the naira.
- **Depeg** — when a stablecoin trades meaningfully away from its peg (e.g. cNGN trading at ₦0.998 instead of ₦1.000).
- **Turnover** — last price × volume = the naira value of what changed hands.
- **Premium** — the gap between the crypto-dollar price and the official-dollar price, expressed as a percentage.
- **Corridor** — a flow path between two markets (NG → CN means money moving from Nigeria to China).
- **TAM** — Total Addressable Market: the maximum revenue a business could earn if it captured 100% of a segment.
- **Capture %** — the realistic share of TAM you think you can win.
- **Take rate / bps** — your fee per dollar flowing through. 1 bp = 0.01%. 35 bps = 0.35%.
- **SLA** — Service Level Agreement. A promise like "USDT/NGN spread will be under 0.5% during business hours."
- **VASP** — Virtual Asset Service Provider. The SEC Nigeria regulatory category Quidax operates under.
- **B2B / B2C** — Business-to-Business / Business-to-Consumer.
- **SWR** — the JavaScript library that polls `/api/markets` every 15s in the browser.
- **Server component** — code that runs on the server before the page is sent. `app/page.tsx` is one.
- **Client component** — code that runs in the user's browser. Files marked `"use client"` at the top. The interactive B2B sliders and the API proof strip are client components.

---

**This project is independent and not affiliated with Quidax.** It uses only publicly accessible market data and publicly verifiable competitor information.
