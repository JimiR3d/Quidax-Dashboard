# Glossary for Beginners: Understanding the Dashboard

**Written for someone with zero crypto and zero computer science background.**

This document explains every term, number, and concept you see on the dashboard in plain English.

---

## Table of Contents

1. [Crypto Basics](#crypto-basics)
2. [Money Terms](#money-terms)
3. [Data Quality Terms](#data-quality-terms)
4. [The Specific Numbers](#the-specific-numbers)
5. [Analysis Terms](#analysis-terms)

---

## Crypto Basics

### What is a Cryptocurrency?

A cryptocurrency is digital money. Just like physical money (dollars, euros, naira), it's worth something and you can trade it. But instead of being controlled by a government or bank, cryptocurrencies run on a computer network.

**Example**: Bitcoin is digital money that people can send to each other without needing a bank.

### What is a Stablecoin?

A stablecoin is a special cryptocurrency designed to NOT go up and down in price. The goal is to keep it stable at 1 unit = 1 of something (usually US dollars).

**Real examples on this dashboard**:
- **USDT** (Tether): Should equal $1 USD
- **USDC** (USD Coin): Should equal $1 USD
- **cNGN** (Luno's Nigerian Naira stablecoin): Should equal ₦1 Nigerian Naira

### What is an Exchange?

An exchange is like a marketplace where people buy and sell cryptocurrencies. You might have heard of stock exchanges (where people buy and sell company stocks); a crypto exchange is the same idea but for digital currencies.

**Examples**: Coinbase (US), Quidax (Nigeria), Kraken (Europe)

### What is an "NGN pair"?

A "pair" is when you're trading two things. "USDT/NGN" means "swap USDT (US dollars) for NGN (Nigerian Naira)".

When you see "All 11 NGN pairs", it means Quidax lets you trade 11 different cryptocurrencies that all end in NGN (Nigerian Naira).

---

## Money Terms

### What is a "corridor"?

A corridor is a money-movement path between two places. The dashboard talks about "Nigeria → Kenya", "Nigeria → Ghana", etc.

**In plain English**: How do people send money from Nigeria to Kenya? There's a "corridor" (path) for that money to flow.

### What is "Volume"?

Volume is the total amount of money that traded in 24 hours.

**Example**: If $100 of USDT traded on Quidax today, the volume is $100.

### What is "Turnover"?

Turnover is another word for volume — it's the same thing. How much money moved around.

### What is a "Spread"?

A spread is the difference in price between two places.

**Example**:
- At Quidax, 1 USDT costs ₦800
- On the black market, 1 USDT costs ₦795
- The spread = ₦5

Spreads matter because they show how "good" an exchange's prices are.

### What does "NGN" mean?

NGN is the currency code for Nigerian Naira, Nigeria's official money. It's like "USD" for US Dollars or "EUR" for Euros.

### What does "BPS" mean?

**BPS = Basis Points**. It's a way to measure small percentage changes.

**How it works**:
- 1 BPS = 0.01% (one one-hundredth of a percent)
- 100 BPS = 1%
- 1,000 BPS = 10%

**Example**: If USDT should be ₦800 but Quidax sells it for ₦799, that's a 0.125% difference = **12.5 BPS**.

**Why use BPS?** Because spreads on stablecoins are tiny (under 1%), so saying "12.5 basis points" is clearer than saying "0.0125%".

---

## Data Quality Terms

### What does "Confidence" mean?

Confidence tells you how sure we are that a number is correct.

**The three levels**:

| Level | What it means | Example |
|-------|---|---|
| **High Confidence** | We have direct evidence (URL, official number, recent data). Trust this number. | Quidax USDT price RIGHT NOW (we fetch it every 15 seconds) |
| **Medium Confidence** | We have good sources (reports from banks/firms) but data might be 3-12 months old or come from aggregated reports. Probably true but could shift. | "Nigeria receives $20B remittances annually" (World Bank data from 2023) |
| **Low Confidence** | This is an estimate based on fragments. Treat it as "our best guess". | "Yellow Card does ~$50M/yr B2B volume" (educated guess from market signals, not published) |

**Real examples from the dashboard**:

- **High**: Quidax USDT/NGN price = HIGH (it's live)
- **Medium**: Nigeria→Kenya corridor is $22.5B/year = MEDIUM (World Bank data, updated annually)
- **Low**: Busha's user count = LOW (they haven't published recent numbers; we estimated)

### What does "Stale data" mean?

Stale data is old data. If the dashboard says "USDT/NGN price: last updated 30 minutes ago", that's stale — the real price might have changed.

### What does "LKG" mean?

**LKG = Last Known Good**. 

If the dashboard can't fetch fresh data (network down, server error), it shows you the last good reading it got, but clearly labels it as OLD.

**Plain English**: "I can't get you today's price, but here's what it was yesterday. This is old."

### What does "Source" mean in the top badge?

The top badge shows where the data is coming from:

- **Live** = Fresh data (updated 0-15 seconds ago)
- **Cached** = Still live, but from a cache that's 0-10 seconds old
- **Stale** = No new data; showing an old reading
- **Empty** = No data available at all

---

## The Specific Numbers

### What are the "KPIs"?

KPI = Key Performance Indicator. These are the big headline numbers:

| Number | What it means |
|--------|---|
| **Total NGN volume on Quidax** | How much Nigerian Naira worth of trading happened today |
| **Stablecoin share** | What percentage of that volume is stablecoins (USDT, USDC, cNGN) vs other cryptos |
| **USDT at NFEM** | Is Quidax's USDT price tracking Nigeria's official government FX rate? (It should be) |
| **cNGN peg integrity** | Is cNGN stable? Or did it drift away from ₦1? |

### What is "NFEM"?

**NFEM = Nigerian Foreign Exchange Market** (official rate).

Nigeria's government publishes an official FX rate every day. It's supposed to be what 1 USD = how many Nigerian Naira.

This dashboard checks: **Is Quidax's price close to NFEM, or do they differ?** If they differ a lot, traders might exploit the gap.

---

## Analysis Terms

### What is "TAM"?

**TAM = Total Addressable Market**. 

It's how big a business *could* be if it captured all the money flowing through that category.

**Example**: 
- Nigeria receives $20B in remittances per year
- That's the TAM for "remittance businesses"
- Quidax's current remittance revenue might be $100M
- So Quidax is capturing 0.5% of the TAM

### What is "B2B" vs "B2C"?

- **B2B** = Business-to-Business (selling to other companies)
- **B2C** = Business-to-Consumer (selling to regular people)

**Example**: 
- Quidax's **B2C** side: Regular people trading USDT on the app
- Quidax's **B2B** side: Selling API access to fintech companies so they can use Quidax's prices

### What does "Capture rate" mean?

Capture rate is: "Of the TAM, what % would this business realistically win?"

**Example**:
- TAM = $20B/year in remittances
- Quidax capture rate estimate = 2% (our guess they could reach 2%)
- Revenue at 2% capture = $400M/year

### What does "Take rate" mean?

Take rate is the fee the company charges.

**Example**: 
- A remittance costs $100
- Quidax charges 1% fee
- Quidax makes $1, the user pays $101
- Quidax's take rate = 1%

### What does "Margin" mean?

Margin is profit after costs.

If Quidax charges 1% fee (take rate) but only 0.3% goes to profit (the rest goes to servers, staff, regulations), then:
- **Gross margin** = 1% (the fee)
- **Net margin** = 0.3% (actual profit)

---

## How to Read the Competition Matrix

The dashboard shows how Quidax stacks up against other crypto exchanges:

| Column | What it means |
|--------|---|
| **Availability** | How many countries do they operate in? |
| **NGN pairs** | How many cryptocurrencies can you trade for Nigerian Naira? |
| **Notable edge** | What's their competitive advantage? |
| **Confidence** | How sure are we about this row's data? |

---

## Questions?

If a word isn't here, check the main dashboard pages:

- [Methodology Page](/methodology) — explains where every number came from
- [Architecture Docs](/docs/ARCHITECTURE.md) — explains how the dashboard works
- [Security Audit](/docs/SECURITY_AUDIT_REPORT.md) — explains why we can trust the data

