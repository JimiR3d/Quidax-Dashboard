# NGN Liquidity Intelligence — A B2B Growth Thesis for Quidax

A live competitive-intelligence dashboard built to demonstrate product-thinking, data analysis, and technical implementation. Built by **Oluwafolajinmi David Aboderin** ([folajinmi13@gmail.com](mailto:folajinmi13@gmail.com)).

> **TL;DR:** A full-stack competitive-intelligence hub that aggregates real-time market data from the Quidax public API and evaluates the B2B revenue opportunity against major competitors (Yellow Card, Busha, Luno, Roqqu). The thesis explores why Quidax’s immediate growth opportunity lies in its API and institutional services rather than retail flow.

---

## The Dashboard

The dashboard is structured as a multi-page analytical hub, providing a detailed breakdown of the NGN cryptocurrency market.

1. **Live Market**  
   Monitors live NGN pair metrics, FX spreads against the official CBN rate, and a live cNGN peg monitor reading the latest stablecoin trades in real-time.

2. **Stablecoin Deep-Dive**  
   Analyzes the dominance of USDT, cNGN, and USDC in the NGN market, highlighting stablecoins as the primary driver of exchange volume.

3. **Competitive Matrix**  
   A comparison of Quidax against tier-1 competitors across API capabilities, regulatory posture (SEC ARIP vs. COE), and institutional focus.

4. **B2B Opportunity (Interactive)**  
   A dynamic sizing model for the institutional market, allowing readers to toggle assumptions around capture rate and basis points across cross-border settlement, remittances, and embedded fintech features.

5. **Corridor Map**  
   Maps structural fiat-to-crypto flows (e.g., NG↔CN, Diaspora→NG) highlighting the transaction speed and cost advantages of stablecoin rails vs. traditional SWIFT correspondent banking.

---

## Tech Stack

The application is a modern, high-performance web app designed for fast data ingestion and responsive interactivity.

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19 + Tailwind CSS v4
- **Components:** shadcn/ui & Radix UI primitives
- **Data Visualization:** Recharts
- **Live Polling:** SWR (Stale-While-Revalidate)
- **Language:** TypeScript
- **Deployment:** Vercel

## Architecture & Data Flow

The project integrates live data from the `app.quidax.io/api/v1/markets/` endpoints with static analyst estimates.

### API Integration & Reliability
A primary goal was robust error handling when interacting with the live orderbook data. 
- **Timeouts & Fallbacks:** The application handles API latency by enforcing a 5-second timeout on requests. If the upstream Quidax API is unreachable or under heavy load, the dashboard automatically degrades to serving a cached or simulated snapshot, visually signaling this state to the user.
- **Client-Side Polling:** Live ticker strips use SWR to poll the endpoint every 15 seconds, flashing UI updates without reloading the layout.

### Methodology & Data Provenance
Data on this dashboard is strictly categorized into live API metrics and analyst estimates.
- **Live Data:** Ticker prices, 24h volumes, and active pairs are pulled dynamically.
- **Analyst Estimates:** Corridor TAMs, Stablecoin market share, and competitive benchmarks are derived from public reports (CBN, NBS, World Bank) and explicit methodologies linked on the `/methodology` page.

---

## Running Locally

To run the dashboard on your own machine:

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```
Navigate to `http://localhost:3000` to view the live dashboard.

---

*This project is an independent product-thinking exercise and is not affiliated with or endorsed by Quidax. All market data is sourced from public API endpoints.*
