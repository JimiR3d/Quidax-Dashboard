# NGN Liquidity Intelligence — A B2B Growth Thesis for Quidax

A live competitive-intelligence dashboard built to demonstrate analyst, data, and product-thinking ability to the Quidax team. Built by **Oluwafolajinmi David Aboderin** ([folajinmi13@gmail.com](mailto:folajinmi13@gmail.com)).

> **What this is in one sentence:** A web page that pulls real prices from Quidax's public API every 15 seconds, presents them next to a competitive analysis of Yellow Card / Busha / Luno / Roqqu, and argues — with numbers — that Quidax's biggest growth opportunity is selling its API to other businesses (B2B), not chasing retail traders.

---

## Table of contents

1. [Read this first (plain English)](#1-read-this-first-plain-english)
2. [The eight sections of the dashboard](#2-the-eight-sections-of-the-dashboard)
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
- Quidax is the only Nigerian exchange that is **(a)** SEC-licensed, **(b)** has deep naira liquidity, and **(c)** offers a real API to other businesses.
- Therefore Quidax should double down on selling that API to fintechs, banks, and remittance apps — that's where the next $10–20 million per year of revenue is hiding.

The whole dashboard is built to make that argument with **data you can verify yourself by clicking a link**, not vibes.

---

## 2. The eight sections of the dashboard

When someone opens the page, here is what they scroll through, top to bottom.

### 2.1 Site header (top bar)
- The little **purple "Q"** in the corner is the brand mark.
- The **green pulsing dot** that says "Live · Quidax API" means the page is currently pulling real data. If it ever says "Simulated snapshot" in amber, the upstream API is unreachable and we are showing a backup snapshot.
- The **"Hire me"** button opens an email to you.

### 2.2 Hero (the big headline)
- The headline: **"Nigeria's next billion dollars of crypto flow is B2B, not retail."** That is the thesis in one sentence.
- Three small cards underneath show **who wrote it**, **where the data comes from** (`app.quidax.io`), and **when it was last updated**. The "Generated" timestamp ticks fresh every time the page is revalidated.

### 2.3 Executive Summary (TL;DR)
Four tiles labelled **The thesis**, **The wedge**, **The model**, **The moat**. This is for a busy executive (like Buchi Okoro, Quidax's CEO) who has 20 seconds and wants to know whether to keep reading. Each tile is one short paragraph.

### 2.4 Executive snapshot (KPI grid)
Six big number cards across the screen:
1. **USDT/NGN** — current price of one dollar (in stablecoin) in naira on Quidax.
2. **BTC/NGN** — current price of one Bitcoin in naira on Quidax.
3. **NGN spot turnover (24h)** — total naira value traded across all Quidax NGN pairs in the last 24 hours.
4. **USDT premium vs CBN FX** — how much more expensive a "crypto dollar" is than the official central-bank dollar. This is the **single most important number** in the deck because it justifies the entire B2B thesis.
5. **Active NGN pairs** — how many naira trading pairs Quidax actually runs (9 right now).
6. **B2B revenue opportunity** — the highlighted purple-glow card. The mid-case annual revenue Quidax could capture from the four B2B segments combined.

### 2.5 The NGN tape (live ticker table)
A live, updating table of every NGN trading pair on Quidax. Each row shows the pair, last price, 24-hour change, daily high/low, base-asset volume, naira turnover, and a tiny 30-day trend chart.

- **Polls every 15 seconds** to a route at `/api/markets` that calls Quidax fresh each time.
- **Rows flash green or red** for under a second whenever the price changes.
- The **"Updated Xs ago"** counter on the right ticks every second so you can see it staying fresh.

### 2.6 Stablecoin deep-dive
Two charts:
- **Big chart:** USDT/NGN price (real Quidax daily closes for 30 days) vs an analyst model of the official CBN dollar rate. The gap between the lines is the **premium**. A small chart under it shows just that premium as a percentage line.
- **Donut chart:** what percentage of NGN crypto turnover is each asset. Stablecoins (USDT + cNGN + USDC + others) total about **93%**. Bitcoin is now used more like a digital savings account than a trading asset.

### 2.7 Competitive positioning (table)
A table comparing Quidax to four competitors: Yellow Card, Busha, Luno, Roqqu. Six dimensions: positioning, whether they have a B2B API, number of NGN pairs, how core NGN is to them, how many African countries they cover, how much they focus on stablecoins, and their "notable edge." Quidax's row is highlighted in purple — it is the only one with a **yes** on B2B API and a **core / high** focus on NGN and stablecoins simultaneously.

### 2.8 B2B opportunity sizing
Four numbered segments where Quidax can monetize businesses:
1. **Cross-border B2B settlement** — Nigerian SMEs paying suppliers in China / UAE / India with stablecoins instead of slow bank wires.
2. **Inbound remittances** — diaspora money coming home, routed through stablecoins.
3. **Fintech treasury & FX hedging** — companies holding USDT to protect themselves from naira volatility.
4. **Embedded crypto** — neobanks and payment apps using Quidax's API to offer crypto in their own product.

For each segment we show **TAM** (total addressable market in dollars), the % share Quidax could realistically capture, the **take rate** (what fee Quidax earns per dollar of flow, in basis points), and the resulting annual revenue. A horizontal stacked bar chart visualises low / mid / high scenarios. The top-right tile aggregates the three scenarios into a single number.

### 2.9 Five things I would ship next
Five priority-ranked recommendations (P0, P1, P2). Each has a title, a thesis (why), and the team that would own it (e.g. "Product + B2B GTM"). This converts the analysis into a roadmap and shows you can think like an operator, not just an analyst.

### 2.10 Pitch footer
Your contact card. Your headshot story in two paragraphs, three buttons (email, LinkedIn, GitHub), a "what I'd bring on day one" list, and a method note explaining honestly which numbers are live versus analyst estimates. Ends with a copyright and a version tag.

---

## 3. How it works (no code knowledge required)

Pretend the dashboard is a restaurant. Here are the people working in it.

**The waiter (Next.js — the framework).** Takes the customer's order ("show me the dashboard") and decides which kitchen workers need to cook what.

**The cook who calls Quidax (the API client, `lib/quidax.ts`).** Every 15 seconds, this cook picks up the phone and calls Quidax at the number `https://app.quidax.io/api/v1/markets/tickers`. Quidax sends back the current prices for every market. The cook also calls a second number, `…/markets/usdtngn/k`, to get 30 days of historical USDT/NGN candles for the chart.

**The kitchen rules (safety nets).**
- If Quidax doesn't answer within **5 seconds**, the cook hangs up so the customer is not kept waiting.
- If Quidax answers with garbage, the cook serves a pre-prepared backup plate (the simulated snapshot) and tells the waiter to put a small amber warning sticker on it.

**The plating team (React components in `components/dashboard/`).** Each section of the dashboard is a separate plate (component). The KPI plate, the tape plate, the chart plate. They all get the same data and lay it out differently.

**The dining room (the browser).** The customer sees the finished plates. Some plates (like the live tape) keep getting refreshed by a tiny robot called **SWR** that calls the kitchen every 15 seconds and swaps the plate quietly without the customer noticing.

**The walls and lighting (`globals.css`).** All the purple colours, the glow effects, the noise texture, the grid in the background — all defined in one file using a colour system called **OKLCH**, which is just a modern way to describe colours that looks the same on every screen.

**The signage (`app/layout.tsx`).** Sets the website title ("NGN Liquidity Intelligence…"), the description that shows up when you share the link, the fonts, and the dark theme.

---

## 4. What's real data vs analyst estimate

This is the most important table to memorise before any interview.

| Number on the dashboard | Source | Honest label |
|---|---|---|
| Every price in the NGN tape | Quidax public ticker API, polled every 15s | **REAL · LIVE** |
| 24-hour change %, high, low, volume | Quidax public ticker API | **REAL · LIVE** |
| USDT/NGN 30-day chart line | Quidax K-line API (daily candles) | **REAL · 30 days back** |
| Total NGN turnover KPI | Computed from real Quidax volumes × prices | **REAL · derived** |
| Active NGN pair count | Counted from live API response | **REAL · live** |
| Number of NGN pairs per competitor (Yellow Card, Busha, etc.) | Manually checked on their public sites | **REAL · manually verified** |
| The "Official CBN FX (model)" line in the chart | Analyst model anchored to a plausible discount to real USDT closes | **ESTIMATE · explicitly labeled "model"** |
| USDT premium vs CBN FX % | Derived from the model above | **ESTIMATE · directional** |
| Stablecoin volume mix donut (USDT 68%, cNGN 9%, etc.) | Analyst estimate triangulated from Chainalysis / public reporting | **ESTIMATE · directional** |
| Every TAM (total addressable market) number in the B2B section | Analyst proxies: World Bank remittance data, public corridor reporting | **ESTIMATE · sourced proxies** |
| Capture % and take-rate (bps) for each B2B segment | Working assumptions | **ASSUMPTION** |
| The aggregate "B2B revenue opportunity" number | A model output, not a forecast | **MODEL OUTPUT** |
| The 5 recommendations | Analyst opinion | **OPINION** |

**Rule when presenting:** If anyone asks "is that real?", you only ever answer **yes** about the items marked REAL. For everything else say "analyst model — here are my assumptions." Honest analysts get hired; bluffers get caught.

---

## 5. The tech stack in one breath

- **Next.js 16** — the website framework. Handles routing, server rendering, and the API route. Think "factory that turns code into a fast website."
- **React 19** — the UI library that draws everything you see on screen.
- **TypeScript** — JavaScript with type-safety. Catches bugs before they ship.
- **Tailwind CSS v4** — utility-first styling. The `className="flex items-center gap-3"` strings in the code.
- **shadcn/ui** — a curated set of pre-built UI primitives (cards, badges, etc.) layered on top of Tailwind.
- **Recharts** — the library that draws the line, area, bar, and donut charts.
- **SWR** — the data-fetching robot that polls `/api/markets` every 15 seconds in the browser.
- **lucide-react** — the icon set (the little arrows, sparkles, padlocks, etc.).
- **Vercel** — where it deploys. One click and the world can see it.
- **The Quidax public API** at `app.quidax.io/api/v1/...` — no auth needed for market data.

You can recite this list in an interview verbatim and it will read as "this person knows their stack."

---

## 6. File-by-file map of the project

```
my-project/
├─ app/
│  ├─ layout.tsx              ← Page wrapper: fonts, theme color, <html>/<body>.
│  ├─ globals.css             ← All the purple, the glow, the grid pattern.
│  ├─ page.tsx                ← The home page. Imports + stacks every section.
│  └─ api/
│     └─ markets/route.ts     ← The /api/markets endpoint the browser polls.
│
├─ lib/
│  ├─ quidax.ts               ← Calls Quidax. Handles timeouts. Normalizes data.
│  ├─ competitive-data.ts     ← The hand-curated analyst data (competitors, segments, recommendations).
│  └─ format.ts               ← Number/currency/percent formatting helpers.
│
├─ components/dashboard/
│  ├─ site-header.tsx         ← Top bar with logo + nav + "Hire me" button.
│  ├─ hero.tsx                ← The big headline section.
│  ├─ exec-summary.tsx        ← The four-tile TL;DR.
│  ├─ kpi-grid.tsx            ← The six big-number cards.
│  ├─ market-tape.tsx         ← The live-polling NGN ticker table.
│  ├─ sparkline.tsx           ← The tiny 30-day trend chart in each row.
│  ├─ stablecoin-deepdive.tsx ← The USDT/CBN line chart + donut.
│  ├─ competitive-matrix.tsx  ← The competitor comparison table.
│  ├─ b2b-opportunity.tsx     ← The B2B segment sizing + bar chart.
│  ├─ recommendations.tsx     ← The 5 "things I'd ship" cards.
│  └─ pitch-footer.tsx        ← The contact + method note.
│
├─ components/ui/             ← shadcn primitives. Pre-installed, do not edit.
├─ package.json               ← Dependency list.
└─ README.md                  ← You are reading it.
```

**The mental rule:** `lib/` holds data + logic, `components/dashboard/` holds visual sections, `app/` wires them together.

---

## 7. Running, exporting, and publishing

### 7.1 Publishing the live version (no code needed)

This is what you actually want. The dashboard lives inside v0. To put it on the public internet so you can send Buchi a link:

1. In v0, click the **Publish** button in the top right of the screen.
2. v0 deploys it to Vercel and gives you a URL like `something.vercel.app`.
3. That URL is what you send to Quidax. Anyone who opens it sees the live, polling dashboard.

### 7.2 Downloading the code (for GitHub / your CV)

1. Click the **three-dot menu** in the top right of the Block view.
2. Choose **Download ZIP**.
3. Unzip it on your laptop. You now have the whole project folder.
4. Push it to your GitHub at `github.com/JimiR3d` so recruiters can read the source. Add this exact line to your CV under projects:
   > **Quidax B2B Intelligence Dashboard** — Live Next.js dashboard pulling Quidax public market data; competitive teardown of Yellow Card / Busha / Luno / Roqqu; sized $X.XM annual B2B revenue opportunity. *Link: …vercel.app · Code: github.com/JimiR3d/…*

### 7.3 Running it on your own laptop (only if curious)

You don't need to. But if you ever want to:

```bash
# install dependencies once
pnpm install

# start the dev server
pnpm dev
# then open http://localhost:3000
```

Any code change you make refreshes the page instantly thanks to Next.js hot-reload.

### 7.4 Updating data without touching code

The competitor numbers, B2B segment sizes, and recommendations all live in **one file: `lib/competitive-data.ts`**. You can change a competitor's NGN pair count, or add a new segment, and the entire dashboard updates. Live prices update themselves — you never touch those.

---

## 8. Glossary

- **API** — a digital socket. One program asks another program for data using a URL. Quidax's API gives anyone (no password needed for market data) the current prices.
- **Endpoint** — a specific URL on an API. `app.quidax.io/api/v1/markets/tickers` is one endpoint.
- **Ticker** — a snapshot of one market: last price, high, low, volume, etc.
- **K-line / candles** — historical price data shaped like Japanese candlesticks: open, high, low, close per time bucket. We use 1-day buckets (1440 minutes).
- **OKLCH** — a colour system that describes colour by **lightness**, **chroma** (saturation), and **hue** (the angle on the colour wheel). We use hue **305** for Quidax purple.
- **Stablecoin** — a crypto token pegged to a fiat currency. USDT and USDC are pegged to the US dollar. cNGN is pegged to the naira.
- **NGN tape** — the running list of trades / current quotes on naira pairs.
- **Turnover** — last price × volume = the naira value of what changed hands.
- **Premium** — the gap between the crypto-dollar price and the official-dollar price, expressed as a percentage.
- **TAM** — Total Addressable Market: the maximum revenue a business could earn if it captured 100% of a segment.
- **Capture %** — the realistic share of TAM you think you can win.
- **Take rate / bps** — your fee per dollar flowing through. 1 bp = 0.01%. 35 bps = 0.35%.
- **SLA** — Service Level Agreement. A promise like "USDT/NGN spread will be under 0.5% during business hours, or we refund."
- **VASP** — Virtual Asset Service Provider. The SEC Nigeria regulatory category Quidax operates under.
- **B2B / B2C** — Business-to-Business / Business-to-Consumer. Quidax has both; the thesis says the B2B side is undermonetised.
- **SWR** — the JavaScript library that polls `/api/markets` every 15s in the browser. Stands for "stale-while-revalidate."
- **Server component** — code that runs on the server before the page is sent. The page.tsx file is a server component.
- **Client component** — code that runs in the user's browser. Files marked `"use client"` at the top. The market tape and charts are client components because they need to update over time.

---

**This project is independent and not affiliated with Quidax.** It uses only publicly accessible market data and publicly verifiable competitor information.
