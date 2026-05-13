import { getMarketSnapshot, getCandles, candlesToSeries, buildSyntheticSeries } from "@/lib/quidax"
import { SiteHeader } from "@/components/dashboard/site-header"
import { Hero } from "@/components/dashboard/hero"
import { KeyClaims } from "@/components/dashboard/key-claims"
import { ExecSummary } from "@/components/dashboard/exec-summary"
import { KpiGrid } from "@/components/dashboard/kpi-grid"
import { SpreadPanel } from "@/components/dashboard/spread-panel"
import { CngnDepegWatch } from "@/components/dashboard/cngn-depeg-watch"
import { StablecoinDeepDive } from "@/components/dashboard/stablecoin-deepdive"
import { CompetitiveMatrix } from "@/components/dashboard/competitive-matrix"
import { B2BCompetitorStrip } from "@/components/dashboard/b2b-competitor-strip"
import { B2BOpportunity } from "@/components/dashboard/b2b-opportunity"
import { CorridorView } from "@/components/dashboard/corridor-view"
import { CustomerProof } from "@/components/dashboard/customer-proof"
import { Recommendations } from "@/components/dashboard/recommendations"
import { ApiProofStrip } from "@/components/dashboard/api-proof-strip"
import { PitchFooter } from "@/components/dashboard/pitch-footer"
import { SectionBoundary } from "@/components/dashboard/section-boundary"

export const revalidate = 60

export default async function Page() {
  // `Promise.allSettled` so a single failing fetcher never 500s the whole page.
  // Each fetcher already returns safe defaults; this is belt-and-braces.
  const [snapshotR, usdtCandlesR, cngnCandlesR] = await Promise.allSettled([
    getMarketSnapshot(),
    getCandles("usdtngn", 1440, 30),
    getCandles("cngnngn", 1440, 30),
  ])

  const snapshot =
    snapshotR.status === "fulfilled"
      ? snapshotR.value
      : {
          source: "empty" as const,
          fetchedAt: null,
          ageMs: 0,
          dropped: 0,
          tickers: [],
        }
  const usdtCandles = usdtCandlesR.status === "fulfilled" ? usdtCandlesR.value : []
  const cngnCandles = cngnCandlesR.status === "fulfilled" ? cngnCandlesR.value : []

  const usdt = snapshot.tickers.find((t) => t.market === "usdtngn")
  const cngn = snapshot.tickers.find((t) => t.market === "cngnngn")
  const cngnUsdt = snapshot.tickers.find((t) => t.market === "cngnusdt")

  // If candles are missing AND we have no spot, the series degrades to a
  // synthetic placeholder; we explicitly label that downstream.
  const usdtSeries =
    usdtCandles.length > 0
      ? candlesToSeries(usdtCandles)
      : usdt
        ? buildSyntheticSeries("usdtngn", usdt.last, 30)
        : []
  const usdtSource: "live" | "synthetic" | "empty" =
    usdtCandles.length > 0 ? "live" : usdt ? "synthetic" : "empty"

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader snapshotSource={snapshot.source} fetchedAt={snapshot.fetchedAt} />
      <Hero
        fetchedAt={snapshot.fetchedAt}
        snapshotSource={snapshot.source}
        ageMs={snapshot.ageMs}
      />
      <KeyClaims />
      <SectionBoundary label="Executive summary">
        <ExecSummary />
      </SectionBoundary>
      <SectionBoundary label="Live market KPIs">
        <KpiGrid snapshot={snapshot} />
      </SectionBoundary>
      <SectionBoundary label="USDT/NGN spread panel">
        <SpreadPanel usdtNgn={usdt} />
      </SectionBoundary>
      <SectionBoundary label="cNGN depeg watch">
        <CngnDepegWatch cngnNgn={cngn} cngnUsdt={cngnUsdt} candles={cngnCandles} />
      </SectionBoundary>
      <SectionBoundary label="Stablecoin deep-dive">
        <StablecoinDeepDive usdtCandles={usdtSeries} source={usdtSource} />
      </SectionBoundary>
      <SectionBoundary label="Competitive matrix">
        <CompetitiveMatrix />
      </SectionBoundary>
      <SectionBoundary label="B2B-only competitors">
        <B2BCompetitorStrip />
      </SectionBoundary>
      <SectionBoundary label="B2B opportunity model">
        <B2BOpportunity />
      </SectionBoundary>
      <SectionBoundary label="Corridor view">
        <CorridorView />
      </SectionBoundary>
      <SectionBoundary label="Customer proof">
        <CustomerProof />
      </SectionBoundary>
      <SectionBoundary label="Recommendations">
        <Recommendations />
      </SectionBoundary>
      <SectionBoundary label="Live proof strip">
        <ApiProofStrip initial={snapshot} />
      </SectionBoundary>
      <PitchFooter />
    </main>
  )
}
