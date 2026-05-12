# Interview & Outreach Prep — Quidax

A field manual for the dashboard you built. Use it before sending the link to anyone, and re-read it the morning of any interview.

---

## Part 1 — How to talk about this in one breath

If someone in an elevator asks "what did you build?", say this and nothing more:

> *"I built a live competitive-intelligence dashboard for Quidax that pulls real prices from their public API every 15 seconds, benchmarks them against Yellow Card, Busha, Luno, and Roqqu, and sizes a roughly $20-million-a-year B2B revenue opportunity that their current retail-first product doesn't capture. The link is in my LinkedIn."*

That's it. **Three sentences. Don't add anything.** Let the interviewer ask the next question.

---

## Part 2 — The thesis you are arguing

Memorise this paragraph word for word:

> *"Retail volume on Nigerian exchanges has plateaued. The fastest-growing flow is businesses — fintechs, SMEs, remittance operators — using stablecoins to settle dollars in and out of Nigeria. Quidax is the only locally-licensed exchange with both deep NGN liquidity and a production-grade API, and they are the only Nigerian player listing cNGN, the regulated naira stablecoin. That puts them in a quadrant nobody else can enter quickly. My dashboard quantifies the opportunity in four B2B segments and proposes five concrete moves to capture it."*

If you can recite that, you sound like an analyst. If you stumble, practise it in front of a mirror until you don't.

---

## Part 3 — The five competitors in one line each

You will be asked. Be ready.

- **Yellow Card** — pan-African, 20 countries, Yellow Card Pay is a real B2B product. *Their breadth is their moat. Their NGN depth is not.*
- **Busha** — retail-first, clean UX, growing recurring-buy product. *Their B2B API is limited; they're a UX company.*
- **Luno** — Singapore-owned, conservative product surface, trusted brand. *They have no NGN-native B2B API. They are not a B2B competitor.*
- **Roqqu** — retail + virtual cards. *Card issuance is the wedge; liquidity on majors is thin.*
- **Quidax** — NGN-native, SEC-licensed, API-first, only one with cNGN. *Owns the only quadrant that matters for the B2B thesis.*

---

## Part 4 — The four B2B segments and why each one matters

| Segment | TAM | Real-world example | Why it works |
|---|---|---|---|
| Cross-border B2B settlement | ~$18 B/yr | A Lagos electronics importer paying a Shenzhen supplier $50K with USDT in 4 minutes instead of $50K wire in 4 days | Banking corridors to CN/AE are slow, expensive, capped. Stablecoins skip the queue. |
| Inbound remittances | ~$20.9 B/yr (World Bank Nigeria proxy) | Sendwave / LemFi / Grey routing diaspora dollars through stablecoins to cut MTO fees | Nigeria is sub-Saharan Africa's #1 remittance recipient. Existing rails are inefficient. |
| Fintech treasury & FX hedging | ~$4.2 B/yr | A SaaS company with NGN revenue parking 30% in USDT to hedge naira volatility | Naira volatility >35% YoY. No formal hedging instruments exist for SMEs. |
| Embedded crypto in fintech apps | ~$2.8 B/yr | A neobank adding "buy USDT" inside their app via Quidax-as-a-Service | Build-vs-buy strongly favors buy because of the SEC licensing burden. Quidax already paid that cost. |

**If asked "where do those TAMs come from?":**
- Remittance: World Bank Migration & Remittances 2023.
- Cross-border B2B: Triangulated from Nigeria's import data with China/UAE/India + Chainalysis sub-Saharan Africa Geography of Crypto report.
- Treasury / Embedded: My own bottom-up estimates from fintech announcements. Honest about that.

**Never** claim these are precise. Always say "directionally accurate, my model, here are the inputs."

---

## Part 5 — The five recommendations in order

You will be asked which one you'd ship first and why. Here is your answer.

1. **Productize Quidax Treasury API for fintech CFOs (P0).** Highest leverage. Existing exchange API plus a multi-account ledger, NGN/USDT sweep automation, and a CFO-grade reporting endpoint. Unlocks the "embedded crypto" segment, which has the highest take rate (60 bps) and lowest CAC.
2. **Publish a public Liquidity & Spread SLA (P0).** Regulated buyers need predictability. Yellow Card and Busha don't expose this. A monitored, posted SLA is a structural moat.
3. **Corridor playbooks for NG→CN, NG→AE, NG→IN (P1).** Drop-in reference implementations + sandbox keys + a compliance starter kit. Cuts a fintech's integration time from weeks to days.
4. **VASP regulatory reporting pipeline (P1).** SEC Nigeria will require structured transaction reporting. Build once, license it back to the same API customers as a paid add-on. Turns a cost centre into a revenue line.
5. **Public market-data terminal (P2).** *That's this dashboard.* Continuous marketing for the API. Compounds credibility. Cheap to run.

**When asked "why P0 first?"**: *"Because it directly unlocks the highest-margin segment, and because Quidax already owns 80% of the technical surface area. The remaining 20% is product packaging, not engineering."*

---

## Part 6 — Likely interview questions and your prepared answers

### Q: "How did you get the data?"
A: *"Quidax exposes a public, no-auth REST API at `app.quidax.io/api/v1`. I read the docs at `docs.quidax.io`, verified the endpoints, then wrote a thin TypeScript client with a 5-second timeout and a normalized output. Live tickers poll every 15 seconds. Historical USDT/NGN comes from the K-line endpoint."*

### Q: "What did you make up?"
A: *"Live prices, volumes, 24-hour changes, the 30-day USDT chart line, and pair counts are real. The official CBN FX line is an analyst model because CBN doesn't publish a free machine-readable feed. TAM numbers are sourced proxies (World Bank, Chainalysis). Capture % and take rates are my working assumptions, clearly labelled in the method note."*

### Q: "Why purple?"
A: *"It's Quidax's brand. I matched the hue I read off quidax.com and tuned it in OKLCH so the contrast against the dark background is WCAG-compliant."*

### Q: "Why B2B, not retail?"
A: *"Retail crypto trading in Nigeria has plateaued and is heavily commoditised — every player charges similar fees. B2B is structurally different: fewer customers, much higher per-customer revenue, and the licensing burden creates a real moat. Quidax has the licence. Most competitors don't. That's an asymmetric position."*

### Q: "What would you measure in your first 90 days here?"
A: *"Three things. One: API customer count and median monthly volume per customer — that tells me if the B2B SKU is product-market-fitting. Two: NGN spread on the top 3 pairs during business hours — that's the SLA proxy. Three: cNGN turnover ratio — that's the leading indicator for regulated-rail demand."*

### Q: "What's the weakest part of this analysis?"
A: *"The CBN FX line is modelled, not pulled. If I were doing this internally I'd plug into the actual interbank rate from a Bloomberg or Refinitiv feed. Second: my capture % assumptions are based on directional signals, not customer interviews. Inside Quidax I'd validate those numbers against your actual sales pipeline."*

### Q: "How long did this take?"
A: *"Two weeks of evening work. Most of the time was reading: Quidax's docs, the competitors' product pages, World Bank remittance data, and the Chainalysis sub-Saharan Africa report. The code itself is straightforward."*

### Q (curveball): "Walk me through the data flow when I refresh the page."
A: *"The browser hits Next.js, which runs `app/page.tsx` on the server. That server component calls `getMarketSnapshot()` and `getCandles('usdtngn')` in parallel — each hits Quidax's public API with a 5-second timeout. The results are passed as props into the section components, which render as HTML on the server and stream to the browser. Once the page is hydrated, the Market Tape component takes over: it polls a route at `/api/markets` every 15 seconds via SWR, diff-checks each pair's last price, and flashes the row green or red on change. The route is `force-dynamic` so it never caches."*

If you can deliver that last answer cleanly, you have de-risked 70% of the technical interview.

---

## Part 7 — The outreach DM/email (use this, don't write your own)

### Subject: `Built something for Quidax — 2-minute read`

Hi Buchi,

I'm a Computer Science grad from Covenant. I spent the last two weeks studying Quidax — your product, your API, your competitors, and the regulatory surface you're about to operate inside — and I built something I think will be useful to you.

**The link:** https://your-deploy.vercel.app

It's a live dashboard that pulls real prices from your public API every 15 seconds, benchmarks Quidax against Yellow Card, Busha, Luno, and Roqqu across the dimensions that actually matter for the B2B SKU, and sizes a ~$20M/yr revenue opportunity across four segments — cross-border settlement, remittance, fintech treasury, and embedded crypto.

I'm not asking for a job in this email. I'm asking for **15 minutes** with whoever owns the B2B / API roadmap. If the work has any value, I'd like to do this kind of thing inside Quidax — full-time, contract, or internship. If it doesn't, I'd love your two-line critique.

CV attached. GitHub: github.com/JimiR3d.

Thanks for building Quidax.

— Oluwafolajinmi David Aboderin
folajinmi13@gmail.com

---

**Send the same email to:**
- Buchi Okoro (CEO) — `buchi@quidax.com` is the educated guess; if that bounces, DM on LinkedIn / X.
- Morris Maina (CTO) — LinkedIn DM.
- Whoever heads Product / B2B / Data — find them on LinkedIn, send a connection request first with a one-liner ("Built a B2B intelligence dashboard for Quidax — link?"), then send the full email after they accept.

**Do not** send a generic "I would like to apply" message through the careers page first. Send the artifact first. If they're impressed they will route you to whoever handles hiring.

---

## Part 8 — The 30-second answer to "tell me about yourself"

> *"I'm Folajinmi. I studied Computer Science at Covenant. My most relevant work is at Qucoon where I built Basel regulatory reporting pipelines for a Nigerian Tier-1 bank — financial data, hard accuracy requirements, structured outputs to regulators. I'm strongest at the intersection of data and backend: SQL, Python, PHP, API design. I'm here because I spent two weeks building a B2B intelligence dashboard for Quidax and I'd like to do that kind of work full-time inside the company."*

Practise this. Time yourself. 30 seconds, no more.

---

## Part 9 — Things to NOT do

- **Do not** improvise numbers in the interview. If asked "what's the take rate on segment 2?" and you forget — say "I'd have to check the dashboard." Bluffers get caught.
- **Do not** share or post your Quidax personal API key anywhere ever. Even on a private form. Rotate the one you already pasted.
- **Do not** claim affiliation with Quidax in the link or in any social post. The dashboard footer is explicit: *"Independent analysis, no Quidax affiliation."*
- **Do not** send the cold email to a `careers@` address — it will die in HR triage. Send it directly to people, named.
- **Do not** apologise in the email. You built something useful. Lead with the artifact, never with the apology.

---

## Part 10 — Day-of-interview checklist

Morning of:

- [ ] Re-read **Part 2** (the thesis) and recite it once.
- [ ] Re-read **Part 6** (Q&A) and recite the data-flow answer once.
- [ ] Open the live dashboard. Verify the green "Live" dot is pulsing.
- [ ] Open the GitHub link. Verify the README is the first thing they'd see.
- [ ] Have one printed copy of your CV. One.
- [ ] Glass of water. Phone on silent. Camera framed waist-up if remote.

In the room:

- [ ] Open with: *"Thanks for making the time. Before we start — have you had a chance to look at the dashboard?"* (Anchors them to your work.)
- [ ] When asked anything you don't know, say *"I don't know — I'd find out by [specific method]."* Never guess.
- [ ] Close with: *"What would the first 90 days look like for someone in this seat?"* (Shows you think about ownership, not about the job description.)

You're ready.
