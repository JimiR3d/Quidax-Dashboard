import { SiteHeader } from "@/components/dashboard/site-header"
import { CompetitiveMatrix } from "@/components/dashboard/competitive-matrix"
import { B2BCompetitorStrip } from "@/components/dashboard/b2b-competitor-strip"
import { ChapterNav } from "@/components/dashboard/chapter-nav"
import { getMarketSnapshot } from "@/lib/quidax"

export const metadata = {
  title: "Who Does What — NGN Liquidity Intelligence",
  description:
    "Quidax vs Yellow Card, Busha, Luno, Roqqu — and the B2B-only rails competing for the same fintech buyers.",
}

export const revalidate = 3600

export default async function CompetitionPage() {
  const snapshot = await getMarketSnapshot().catch(() => null)
  const liveNgnCount = snapshot
    ? snapshot.tickers.filter((t) => t.quote === "NGN").length
    : undefined

  return (
    <main className="min-h-screen bg-transparent">
      <SiteHeader snapshotSource="live" />

      <section className="mx-auto w-full max-w-7xl px-4 pt-12 md:px-6 md:pt-16">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
          03 · Competitive landscape
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Who does what, honestly 🛡️
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Quidax has a head start, but it's a race. This is every Nigerian exchange and B2B rail that a fintech CTO would evaluate in the same RFP. No false exclusivity claims — just what each player actually offers today.
        </p>
      </section>

      <CompetitiveMatrix liveQuidaxNgnCount={liveNgnCount} />
      <B2BCompetitorStrip />
      <ChapterNav current="/competition" />
    </main>
  )
}
