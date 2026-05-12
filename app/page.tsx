import { getMarketSnapshot } from "@/lib/quidax"
import { SiteHeader } from "@/components/dashboard/site-header"
import { Hero } from "@/components/dashboard/hero"
import { ExecSummary } from "@/components/dashboard/exec-summary"
import { KpiGrid } from "@/components/dashboard/kpi-grid"
import { MarketTape } from "@/components/dashboard/market-tape"
import { StablecoinDeepDive } from "@/components/dashboard/stablecoin-deepdive"
import { CompetitiveMatrix } from "@/components/dashboard/competitive-matrix"
import { B2BOpportunity } from "@/components/dashboard/b2b-opportunity"
import { Recommendations } from "@/components/dashboard/recommendations"
import { PitchFooter } from "@/components/dashboard/pitch-footer"

export const revalidate = 60

export default async function Page() {
  const snapshot = await getMarketSnapshot()

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader source={snapshot.source} />
      <Hero fetchedAt={snapshot.fetchedAt} />
      <ExecSummary />
      <KpiGrid tickers={snapshot.tickers} />
      <MarketTape tickers={snapshot.tickers} />
      <StablecoinDeepDive />
      <CompetitiveMatrix />
      <B2BOpportunity />
      <Recommendations />
      <PitchFooter />
    </main>
  )
}
