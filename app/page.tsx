import { getMarketSnapshot } from "@/lib/quidax"
import { SiteHeader } from "@/components/dashboard/site-header"
import { Hero } from "@/components/dashboard/hero"
import { KeyClaims } from "@/components/dashboard/key-claims"
import { PitchFooter } from "@/components/dashboard/pitch-footer"

export const revalidate = 60

export default async function Page() {
  const snapshot = await getMarketSnapshot().catch(() => ({
    source: "empty" as const,
    fetchedAt: null,
    ageMs: 0,
    dropped: 0,
    tickers: [],
  }))

  return (
    <div className="relative w-full font-sans overflow-x-hidden">
      {/* Main Content Area - high z-index and border radius to slide over the footer */}
      <main className="relative z-10 w-full min-h-[120vh] bg-transparent border-b border-white/10 shadow-xl rounded-b-3xl">
        <SiteHeader snapshotSource={snapshot.source} fetchedAt={snapshot.fetchedAt} />
        <Hero
          fetchedAt={snapshot.fetchedAt}
          snapshotSource={snapshot.source}
          ageMs={snapshot.ageMs}
        />
        <KeyClaims />
      </main>

      {/* The Cinematic Footer is revealed as main scrolls up */}
      <PitchFooter />
    </div>
  )
}
