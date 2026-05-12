import { getMarketSnapshot, getCandles, candlesToSeries, buildSyntheticSeries } from "@/lib/quidax"
import { SiteHeader } from "@/components/dashboard/site-header"
import { Hero } from "@/components/dashboard/hero"
import { ExecSummary } from "@/components/dashboard/exec-summary"
import { KpiGrid } from "@/components/dashboard/kpi-grid"
import { SpreadPanel } from "@/components/dashboard/spread-panel"
import { CngnDepegWatch } from "@/components/dashboard/cngn-depeg-watch"
import { StablecoinDeepDive } from "@/components/dashboard/stablecoin-deepdive"
import { CompetitiveMatrix } from "@/components/dashboard/competitive-matrix"
import { B2BOpportunity } from "@/components/dashboard/b2b-opportunity"
import { CustomerProof } from "@/components/dashboard/customer-proof"
import { Recommendations } from "@/components/dashboard/recommendations"
import { ApiProofStrip } from "@/components/dashboard/api-proof-strip"
import { PitchFooter } from "@/components/dashboard/pitch-footer"

export const revalidate = 60

export default async function Page() {
  const [snapshot, usdtCandles, cngnCandles] = await Promise.all([
    getMarketSnapshot(),
    getCandles("usdtngn", 1440, 30),
    getCandles("cngnngn", 1440, 30),
  ])

  const usdt = snapshot.tickers.find((t) => t.market === "usdtngn")
  const cngn = snapshot.tickers.find((t) => t.market === "cngnngn")
  const cngnUsdt = snapshot.tickers.find((t) => t.market === "cngnusdt")

  const usdtSeries =
    usdtCandles.length > 0
      ? candlesToSeries(usdtCandles)
      : buildSyntheticSeries("usdtngn", usdt?.last ?? 1380, 30)
  const usdtSource: "live" | "synthetic" = usdtCandles.length > 0 ? "live" : "synthetic"

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader source={snapshot.source} />
      <Hero fetchedAt={snapshot.fetchedAt} />
      <ExecSummary />
      <KpiGrid tickers={snapshot.tickers} />
      <SpreadPanel usdtNgn={usdt} />
      <CngnDepegWatch cngnNgn={cngn} cngnUsdt={cngnUsdt} candles={cngnCandles} />
      <StablecoinDeepDive usdtCandles={usdtSeries} source={usdtSource} />
      <CompetitiveMatrix />
      <B2BOpportunity />
      <CustomerProof />
      <Recommendations />
      <ApiProofStrip initial={snapshot} />
      <PitchFooter />
    </main>
  )
}
