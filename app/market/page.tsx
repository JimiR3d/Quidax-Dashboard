import { getMarketSnapshot, getCandles } from "@/lib/quidax"
import { getLiveFxRates } from "@/lib/fx-rates"
import { SiteHeader } from "@/components/dashboard/site-header"
import { KpiGrid } from "@/components/dashboard/kpi-grid"
import { SpreadPanel } from "@/components/dashboard/spread-panel"
import { CngnDepegWatch } from "@/components/dashboard/cngn-depeg-watch"
import { ApiProofStrip } from "@/components/dashboard/api-proof-strip"
import { ChapterNav } from "@/components/dashboard/chapter-nav"

export const metadata = {
  title: "Live Market Data — NGN Liquidity Intelligence",
  description:
    "Real-time Quidax NGN pair KPIs, USDT/NGN spread vs CBN rate, and cNGN peg status.",
}

export const revalidate = 60

export default async function MarketPage() {
  const [snapshotR, cngnCandlesR, fxRatesR] = await Promise.allSettled([
    getMarketSnapshot(),
    getCandles("cngnngn", 1440, 30),
    getLiveFxRates(),
  ])

  const snapshot =
    snapshotR.status === "fulfilled"
      ? snapshotR.value
      : { source: "empty" as const, fetchedAt: null, ageMs: 0, dropped: 0, tickers: [] }
  const cngnCandles = cngnCandlesR.status === "fulfilled" ? cngnCandlesR.value : []
  const liveFx = fxRatesR.status === "fulfilled" ? fxRatesR.value : undefined

  const usdt = snapshot.tickers.find((t) => t.market === "usdtngn")
  const cngn = snapshot.tickers.find((t) => t.market === "cngnngn")
  const cngnUsdt = snapshot.tickers.find((t) => t.market === "cngnusdt")

  return (
    <main className="min-h-screen bg-transparent">
      <SiteHeader snapshotSource={snapshot.source} fetchedAt={snapshot.fetchedAt} />

      <section className="mx-auto w-full max-w-7xl px-4 pt-12 md:px-6 md:pt-16">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
          01 · Live market data
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          What Quidax's order book says right now 📊
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Every number below comes from Quidax's public API, refreshed every 15 seconds. The spread panel shows how close the USDT/NGN price is to the official CBN rate.
        </p>
      </section>

      <KpiGrid snapshot={snapshot} />
      <SpreadPanel usdtNgn={usdt} liveFx={liveFx} />
      <CngnDepegWatch cngnNgn={cngn} cngnUsdt={cngnUsdt} candles={cngnCandles} />
      <ApiProofStrip initial={snapshot} />
      <ChapterNav current="/market" />
    </main>
  )
}
