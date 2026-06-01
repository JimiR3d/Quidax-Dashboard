# Interview & Outreach Prep — Quidax

A field manual for the dashboard you built. Read it before sending the link to anyone, and re-read it the morning of any interview.

---

## Part 1 — How to talk about this in one breath

If someone in an elevator asks "what did you build?", say this and nothing more:

> *"I built a live market intelligence dashboard for Quidax that pulls real prices from their public API, monitors the cNGN peg in real time, models a roughly $4–14-million-a-year B2B revenue opportunity across four corridors that you can pressure-test with sliders, and benchmarks Quidax against Yellow Card, Busha, Luno, and Roqqu. The link is in my LinkedIn."*

Three sentences. **Don't add anything.** Let the interviewer ask the next question.

---

## Part 2 — The thesis you are arguing

Memorise this paragraph word for word:

> *"Retail volume on Nigerian exchanges has plateaued. The fastest-growing flow is businesses — fintechs, SMEs, remittance operators — using stablecoins to settle dollars in and out of Nigeria. Quidax is one of only two SEC ARIP-licensed exchanges with deep NGN liquidity and a production-grade API. cNGN, the regulated naira stablecoin issued by the African Stablecoin Consortium, is listed on both Quidax and Busha. Quidax's edge is order book depth and existing B2B customers. My dashboard quantifies the opportunity in five B2B segments, maps it onto four real corridors, lets the reader plug in their own assumptions, and proposes five concrete moves to capture it."*

Recite it three times before any call. If you can deliver it without stumbling, you sound like an analyst.

---

## Part 3 — The five competitors in one line each

You will be asked. Be ready.

- **Yellow Card** — pan-African, 20 countries, now B2B-only (discontinued all retail trading Jan 23, 2026). *Their breadth is their moat. They hold a Dec 2023 Certificate of Entry, not a full ARIP provisional licence.*
- **Busha** — SEC ARIP-licensed (August 2024 cohort), retail-first with growing Busha Business B2B stack. *Listed cNGN first (Feb 3, 2025). Strongest direct competitor on both retail and B2B.*
- **Luno** — Singapore-owned, regulated and active in Nigeria, trusted brand. *No provisional SEC ARIP licence equivalent. No NGN-native B2B API. Not a B2B competitor.*
- **Roqqu** — retail + virtual cards, expanded into East Africa via Flitaa acquisition (July 2025). *Card issuance is the wedge; liquidity on majors is thin.*
- **Quidax** — NGN-native, SEC ARIP-licensed, API-first, listed cNGN (Mar 12, 2025). *Order book depth + existing B2B customers (Basqet, Blano, Gigxpad) = the real moat.*

---

## Part 4 — The four B2B segments and why each one matters

| Segment | TAM | Real-world example | Why it works |
|---|---|---|---|
| Cross-border B2B settlement | ~$18B/yr | Lagos electronics importer pays Shenzhen supplier $50K in USDT in 4 minutes instead of $50K wire in 4 days | Banking corridors to CN/AE are slow, expensive, capped. Stablecoins skip the queue. |
| Inbound remittances | ~$20.9B/yr (World Bank Nigeria proxy) | Sendwave / LemFi / Grey route diaspora dollars through stablecoins to cut MTO fees | Nigeria is sub-Saharan Africa's #1 remittance recipient. Existing rails are inefficient. |
| Fintech treasury & FX hedging | ~$4.2B/yr | A SaaS with NGN revenue parks 30% in USDT to hedge naira volatility | Naira volatility >35% YoY. No formal hedging instruments for SMEs. |
| Embedded crypto in fintech apps | ~$2.8B/yr | A neobank adds "buy USDT" inside their app via Quidax-as-a-Service | Build-vs-buy favors buy because of the SEC licensing burden. Quidax already paid that cost. |

**If asked "where do those TAMs come from?":**
- Remittance: World Bank Migration & Remittances 2023.
- Cross-border B2B: Triangulated from Nigeria's import data with CN/AE/IN + Chainalysis sub-Saharan Africa report.
- Treasury / Embedded: My bottom-up estimates from fintech announcements. Honest about that.

**Never** claim these are precise. Always say "directionally accurate, my model, here are the inputs — and the sliders in the dashboard let you swap them out."

---

## Part 5 — The four corridors and what they buy you

You will be asked which corridor is the most important.

| Corridor | Annual flow | Why it matters | Quidax pairs |
|---|---|---|---|
| **NG → CN** | $13B | Largest single trade corridor. 320 bps + 4 days via banks vs 90 bps + 8 minutes via USDT. | USDT/NGN, USDC/NGN |
| **NG → AE (Dubai)** | ~$4B | Re-export, gold, luxury, diaspora savings. CEPA signed Jan 2026 projected to accelerate. | USDT/NGN |
| **NG ↔ KE** | ~$100M | ⚠️ Aspirational AfCFTA opportunity, not a current high-volume flow. Formal bilateral trade is under $100M/yr per UN COMTRADE. | USDT/NGN |
| **DIASPORA → NG** | $20–22B official | World Bank's #1 SSA recipient. Estimated true volume including informal channels likely exceeds $23B. | USDT/NGN, CNGN/NGN, USDC/NGN |

**The headline answer if asked "which one first?":** *"NG → CN. It's the largest flow, it's the worst-served by banking, and the speed gap (4 days vs 8 minutes) is so big the sales conversation is short. Diaspora → NG is bigger but it's already being captured by remittance fintechs — the way Quidax wins there is by becoming the on-chain liquidity layer underneath those fintechs, not by competing with them."*

---

## Part 6 — The interactive model (and how to talk about it)

The B2B sizing section has sliders on capture % and take rate per segment. The chart re-computes live.

**If asked "what happens if I set Embedded Crypto capture to 10%?":** Drag the slider. Read the new total out loud. Then say *"That's the optimistic case. My defaults are mid. The lower bound is also pinned so you can see how aggressive any individual assumption is."*

**If asked "what's the most sensitive input?":** *"Take rate on Embedded Crypto. It's the only segment where the take rate is plausibly above 50 bps — because you're providing a full SaaS surface, not just liquidity. A 10 bp move there is roughly worth a 1 percentage-point move in capture rate on the same segment."*

The sliders' real purpose: they take the report from *"trust my numbers"* to *"don't trust my numbers — plug in yours."* That's the level of intellectual honesty senior people hire for.

---

## Part 7 — The five recommendations in order

You will be asked which one you'd ship first.

1. **Productize "Quidax Treasury API" for fintech CFOs (P0).** Highest leverage. Existing exchange API plus a multi-account ledger, NGN/USDT sweep automation, and a CFO-grade reporting endpoint. Unlocks the embedded-crypto segment — highest take rate, lowest CAC.
2. **Publish a public Liquidity & Spread SLA (P0).** Regulated buyers need predictability. Yellow Card and Busha don't expose this. A monitored, posted SLA is a structural moat.
3. **Corridor playbooks for NG→CN, NG→AE, NG→IN (P1).** Drop-in reference implementations + sandbox keys + compliance starter kit. Cuts a fintech's integration time from weeks to days.
4. **VASP regulatory reporting pipeline (P1).** SEC Nigeria will require structured transaction reporting. Build once, license it back as a paid add-on. Turns a cost centre into a revenue line.
5. **Public market-data terminal (P2).** *That's this dashboard.* Continuous marketing for the API. Compounds credibility. Cheap to run.

**When asked "why P0 first?":** *"Because it directly unlocks the highest-margin segment, and Quidax already owns 80% of the technical surface. The remaining 20% is product packaging, not engineering."*

---

## Part 8 — Likely interview questions and your prepared answers

### Q: "How did you get the data?"
A: *"Quidax exposes a public, no-auth REST API at `app.quidax.io/api/v1`. I read the docs at `docs.quidax.io`, verified the endpoints, then wrote a thin TypeScript client with a 5-second timeout and a normalized output. Live tickers poll every 15 seconds. Historical USDT/NGN and CNGN/NGN come from the K-line endpoint."*

### Q: "What did you make up?"
A: *"Live prices, volumes, 24-hour changes, the 30-day USDT and cNGN chart lines, the cNGN peg deviation, and pair counts are real. The official CBN FX line is an analyst model because CBN doesn't publish a free machine-readable feed. TAM and corridor flow figures are sourced proxies (World Bank, NBS, Chainalysis). Capture % and take rates are my working assumptions — and they're sliders, so anyone can replace them with their own."*

### Q: "Why purple?"
A: *"It's Quidax's brand. I matched the hue I read off quidax.com and tuned it in OKLCH at hue 305, chroma 0.27, so the contrast against the dark background is WCAG-compliant."*

### Q: "Why B2B, not retail?"
A: *"Retail crypto trading in Nigeria has plateaued and is heavily commoditised. B2B is structurally different: fewer customers, much higher per-customer revenue, and the licensing burden creates a real moat. Quidax has the licence. Most competitors don't. That's an asymmetric position."*

### Q: "Why include the cNGN watch?"
A: *"Two reasons. One, Quidax is the only Nigerian exchange listing cNGN, so any analysis of Quidax that ignores it is missing the most defensible part of the moat. Two, the regulated-rail thesis is the part of Quidax's story that's hardest to replicate, so any future Quidax investor or partner is going to ask about cNGN liquidity. A live depeg watch lets you answer that question with evidence instead of assertions."*

### Q: "What would you measure in your first 90 days here?"
A: *"Three things. One: B2B API customer count and median monthly volume per customer — that tells me if the B2B SKU is product-market-fitting. Two: NGN spread on the top 3 pairs during business hours — that's the SLA proxy. Three: cNGN turnover ratio — that's the leading indicator for regulated-rail demand."*

### Q: "What's the weakest part of this analysis?"
A: *"The CBN FX line is modelled, not pulled. If I were doing this internally I'd plug into the actual interbank rate from a Bloomberg or Refinitiv feed. Second: my capture % assumptions are based on directional signals, not customer interviews. Inside Quidax I'd validate those against your actual sales pipeline — and then I'd hard-code the validated numbers, retire the sliders, and the report becomes a forecast instead of a model."*

### Q: "How long did this take?"
A: *"About two weeks of evening work. Most of the time was reading: Quidax's docs, the competitors' product pages, World Bank remittance data, the Chainalysis sub-Saharan Africa report, NBS import data. The code itself is straightforward."*

### Q (curveball): "Walk me through the data flow when I refresh the page."
A: *"The browser hits Next.js, which runs `app/page.tsx` on the server. That server component calls `getMarketSnapshot()`, `getCandles('usdtngn')`, and `getCandles('cngnngn')` in parallel — each hits Quidax's public API with a 5-second timeout. Results are passed as props into the section components, which render as HTML on the server and stream to the browser. Once hydrated, two pieces become interactive: the API Proof Strip polls `/api/markets` every 15 seconds via SWR and diff-flashes rows green/red on change, and the B2B sliders update state locally in the browser and re-compute the revenue chart with `useMemo`. The `/api/markets` route is `force-dynamic` so it never caches."*

If you can deliver that last answer cleanly, you have de-risked 70% of the technical interview.

### Q (deep curveball): "What would you change about the dashboard if you had another week?"
A: *"Three things. One: hook up a real CBN FX feed instead of the model line. Two: add a fourth chart showing actual fintech announcements as a timeline so the embedded-crypto segment has a leading indicator. Three: build a Slack alerter on the cNGN depeg watch so a Quidax ops person gets a ping when deviation crosses 25 bps. That last one is genuinely useful infrastructure, not just a portfolio piece."*

---

## Part 9 — The outreach DM/email (use this, don't write your own)

### Subject: `Built something for Quidax — 2-minute read`

Hi Buchi,

I'm a Computer Science grad from Covenant. I spent the last two weeks studying Quidax — your product, your API, your competitors, the cNGN angle, and the regulatory surface you're about to operate inside — and I built something I think will be useful to you.

**The link:** https://quidax-b2b-dashboard.vercel.app

It's a live dashboard that pulls real prices from your public API every 15 seconds, monitors the cNGN peg, benchmarks Quidax against Yellow Card / Busha / Luno / Roqqu, maps four real corridors (NG→CN, NG→AE, NG↔KE, diaspora→NG), and sizes a ~$20M/yr revenue opportunity that anyone can pressure-test with sliders. Five concrete P0/P1/P2 recommendations at the bottom.

I'm not asking for a job in this email. I'm asking for **15 minutes** with whoever owns the B2B / API roadmap. If the work has any value, I'd like to do this kind of thing inside Quidax — full-time, contract, or internship. If it doesn't, I'd love your two-line critique.

CV attached. GitHub: github.com/JimiR3d.

Thanks for building Quidax.

— Oluwafolajinmi David Aboderin
folajinmi13@gmail.com

---

**Send the same email to:**
- Buchi Okoro (CEO) — `buchi@quidax.com` is the educated guess; if it bounces, DM on LinkedIn / X.
- Morris Maina (CTO) — LinkedIn DM.
- Whoever heads Product / B2B / Data — find them on LinkedIn, connection request first with one line ("Built a B2B intelligence dashboard for Quidax — link?"), then the full email after they accept.

**Do not** send a generic "I would like to apply" message through the careers page first. Send the artifact first. If they're impressed they will route you to whoever handles hiring.

---

## Part 10 — The 30-second "tell me about yourself"

> *"I'm Folajinmi. I studied Computer Science at Covenant. My most relevant work is at Qucoon where I built Basel regulatory reporting pipelines for a Nigerian Tier-1 bank — financial data, hard accuracy requirements, structured outputs to regulators. I'm strongest at the intersection of data and backend: SQL, Python, PHP, API design. I'm here because I spent two weeks building a B2B intelligence dashboard for Quidax and I'd like to do that kind of work full-time inside the company."*

Practise this. Time yourself. 30 seconds. No more.

---

## Part 11 — Things to NOT do

- **Do not** improvise numbers in the interview. If asked "what's the take rate on segment 2?" and you forget — say *"I'd have to check the dashboard."* Bluffers get caught.
- **Do not** share or post your Quidax personal API key anywhere ever. Rotate the one you pasted into chat.
- **Do not** claim affiliation with Quidax in the link or in any social post. The dashboard footer is explicit: *"Independent analysis, no Quidax affiliation."*
- **Do not** send the cold email to a `careers@` address — it dies in HR triage. Send it directly to people, named.
- **Do not** apologise in the email. You built something useful. Lead with the artifact, never with apology.

---

## Part 12 — Day-of-interview checklist

Morning of:

- [ ] Re-read **Part 2** (the thesis) and recite it once.
- [ ] Re-read **Part 8** (Q&A) and recite the data-flow answer once.
- [ ] Open the live dashboard. Verify the green "Live" dot is pulsing. Drag the B2B sliders so you remember how they feel.
- [ ] Open the GitHub link. Verify the README is the first thing they'd see.
- [ ] Have one printed copy of your CV. One.
- [ ] Glass of water. Phone on silent. Camera framed waist-up if remote.

In the room:

- [ ] Open with: *"Thanks for making the time. Before we start — have you had a chance to look at the dashboard?"* (Anchors them to your work.)
- [ ] When asked anything you don't know, say *"I don't know — I'd find out by [specific method]."* Never guess.
- [ ] Close with: *"What would the first 90 days look like for someone in this seat?"* (Shows you think about ownership, not job descriptions.)

You're ready.
