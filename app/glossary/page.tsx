import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/dashboard/site-header"

export const metadata = {
  title: "Glossary — NGN Liquidity Intelligence",
  description: "A beginner-friendly glossary explaining all technical terms and metrics used on the dashboard.",
}

export default function GlossaryPage() {
  return (
    <main className="min-h-screen bg-transparent">
      <SiteHeader snapshotSource="live" />

      <section className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to dashboard
        </Link>

        <header className="mt-6">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Glossary · For Beginners
          </span>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Understanding the Dashboard
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Written for someone with zero crypto and zero computer science background. This document explains every term, number, and concept you see on the dashboard in plain English.
          </p>
        </header>

        <Section title="1. Crypto Basics">
          <Term title="What is a Cryptocurrency?">
            A cryptocurrency is digital money. Just like physical money (dollars, euros, naira), it's worth something and you can trade it. But instead of being controlled by a government or bank, cryptocurrencies run on a computer network. 
            <br/><br/>
            <strong>Example:</strong> Bitcoin is digital money that people can send to each other without needing a bank.
          </Term>

          <Term title="What is a Stablecoin?">
            A stablecoin is a special cryptocurrency designed to NOT go up and down in price. The goal is to keep it stable at 1 unit = 1 of something (usually US dollars).
            <br/><br/>
            <strong>Real examples on this dashboard:</strong>
            <ul className="ml-4 mt-2 list-inside list-disc">
              <li><strong>USDT (Tether):</strong> Should equal $1 USD</li>
              <li><strong>USDC (USD Coin):</strong> Should equal $1 USD</li>
              <li><strong>cNGN:</strong> Nigerian Naira stablecoin, issued by the African Stablecoin Consortium under SEC ARIP oversight. Should equal ₦1 Nigerian Naira.</li>
            </ul>
          </Term>

          <Term title="What is an Exchange?">
            An exchange is like a marketplace where people buy and sell cryptocurrencies. You might have heard of stock exchanges (where people buy and sell company stocks); a crypto exchange is the same idea but for digital currencies.
            <br/><br/>
            <strong>Examples:</strong> Coinbase (US), Quidax (Nigeria), Kraken (Europe).
          </Term>

          <Term title='What is an "NGN pair"?'>
            A "pair" is when you're trading two things. "USDT/NGN" means "swap USDT (US dollars) for NGN (Nigerian Naira)". When you see "All 9 NGN pairs", it means the exchange lets you trade 9 different cryptocurrencies that all end in NGN.
          </Term>
        </Section>

        <Section title="2. Money Terms">
          <Term title='What is a "corridor"?'>
            A corridor is a money-movement path between two places. The dashboard talks about "Nigeria → Kenya", "Nigeria → China", etc.
            <br/><br/>
            <strong>In plain English:</strong> How do people send money from Nigeria to Kenya? There's a "corridor" (path) for that money to flow.
          </Term>

          <Term title="What is Volume / Turnover?">
            Volume (or Turnover) is the total amount of money that traded in 24 hours.
            <br/><br/>
            <strong>Example:</strong> If $100 of USDT traded on Quidax today, the volume is $100.
          </Term>

          <Term title='What is a "Spread"?'>
            A spread is the difference in price between two places.
            <br/><br/>
            <strong>Example:</strong>
            <ul className="ml-4 mt-2 list-inside list-disc">
              <li>At Quidax, 1 USDT costs ₦800</li>
              <li>On the black market, 1 USDT costs ₦795</li>
              <li>The spread = ₦5</li>
            </ul>
            Spreads matter because they show how "good" an exchange's prices are.
          </Term>

          <Term title="What does NGN mean?">
            NGN is the currency code for Nigerian Naira, Nigeria's official money. It's like "USD" for US Dollars or "EUR" for Euros.
          </Term>

          <Term title="What does BPS mean?">
            <strong>BPS = Basis Points.</strong> It's a way to measure small percentage changes.
            <ul className="ml-4 mt-2 list-inside list-disc">
              <li>1 BPS = 0.01% (one one-hundredth of a percent)</li>
              <li>100 BPS = 1%</li>
              <li>1,000 BPS = 10%</li>
            </ul>
            <strong>Example:</strong> If USDT should be ₦800 but an exchange sells it for ₦799, that's a 0.125% difference = <strong>12.5 BPS</strong>. We use BPS because spreads on stablecoins are tiny, so saying "12.5 basis points" is clearer than saying "0.125%".
          </Term>
        </Section>

        <Section title="3. Data Quality Terms">
          <Term title="What does Confidence mean?">
            Confidence tells you how sure we are that a number is correct.
            <ul className="ml-4 mt-2 list-inside list-disc">
              <li><strong>High Confidence:</strong> We have direct evidence (URL, official number, recent data). Trust this number.</li>
              <li><strong>Medium Confidence:</strong> We have good sources (reports from banks/firms) but data might be older or aggregated. Probably true but could shift.</li>
              <li><strong>Low Confidence:</strong> This is an estimate based on fragments. Treat it as "our best guess".</li>
            </ul>
          </Term>

          <Term title="What does LKG mean?">
            <strong>LKG = Last Known Good.</strong> If the dashboard can't fetch fresh data (network down, server error), it shows you the last good reading it got, but clearly labels it as OLD.
            <br/><br/>
            <strong>Plain English:</strong> "I can't get you today's price, but here's what it was yesterday. This is old."
          </Term>

          <Term title="What does 'Source' mean in the top badge?">
            The top badge shows where the data is coming from:
            <ul className="ml-4 mt-2 list-inside list-disc">
              <li><strong>Live</strong> = Fresh data (updated 0-15 seconds ago)</li>
              <li><strong>Cached</strong> = Still live, but from a cache that's 0-10 seconds old</li>
              <li><strong>Stale</strong> = No new data; showing an old reading</li>
              <li><strong>Empty</strong> = No data available at all</li>
            </ul>
          </Term>
        </Section>

        <Section title="4. The Specific Numbers">
          <Term title="What are the KPIs?">
            KPI = Key Performance Indicator. These are the big headline numbers:
            <ul className="ml-4 mt-2 list-inside list-disc">
              <li><strong>Total NGN volume on Quidax:</strong> How much Nigerian Naira worth of trading happened today.</li>
              <li><strong>Stablecoin share:</strong> What percentage of that volume is stablecoins (USDT, USDC, cNGN) vs other cryptos.</li>
              <li><strong>USDT at NFEM:</strong> Is the USDT price tracking Nigeria's official government FX rate?</li>
              <li><strong>cNGN peg integrity:</strong> Is cNGN stable? Or did it drift away from ₦1?</li>
            </ul>
          </Term>

          <Term title="What is NFEM?">
            <strong>NFEM = Nigerian Foreign Exchange Market</strong> (official rate). Nigeria's government publishes an official FX rate every day. It's supposed to be what 1 USD = how many Nigerian Naira.
          </Term>
        </Section>

        <Section title="5. Analysis Terms">
          <Term title="What is TAM?">
            <strong>TAM = Total Addressable Market.</strong> It's how big a business <em>could</em> be if it captured all the money flowing through that category.
          </Term>

          <Term title="B2B vs B2C">
            <ul className="ml-4 mt-2 list-inside list-disc">
              <li><strong>B2B</strong> = Business-to-Business (selling to other companies)</li>
              <li><strong>B2C</strong> = Business-to-Consumer (selling to regular people)</li>
            </ul>
          </Term>

          <Term title="Capture rate, Take rate, and Margin">
            <ul className="ml-4 mt-2 list-inside list-disc">
              <li><strong>Capture rate:</strong> Of the TAM, what % would this business realistically win?</li>
              <li><strong>Take rate:</strong> The fee the company charges. (If an exchange charges 1% fee, their take rate is 1%).</li>
              <li><strong>Margin:</strong> Profit after costs. If a fee is 1% but 0.7% goes to servers and staff, the <em>gross margin</em> is 1% but the <em>net margin</em> is 0.3%.</li>
            </ul>
          </Term>
        </Section>
      </section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  )
}

function Term({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-5">
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  )
}
