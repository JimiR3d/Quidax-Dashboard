import { SiteHeader } from "@/components/dashboard/site-header"
import { CorridorView } from "@/components/dashboard/corridor-view"
import { B2BOpportunity } from "@/components/dashboard/b2b-opportunity"
import { CustomerProof } from "@/components/dashboard/customer-proof"
import { ChapterNav } from "@/components/dashboard/chapter-nav"

export const metadata = {
  title: "The B2B Case — NGN Liquidity Intelligence",
  description:
    "Four trade corridors, five buyer segments, three existing customers. The $4–14M/year opportunity for Quidax-as-a-Service.",
}

export default function OpportunityPage() {
  return (
    <main className="min-h-screen bg-transparent">
      <SiteHeader snapshotSource="live" />

      <section className="mx-auto w-full max-w-7xl px-4 pt-12 md:px-6 md:pt-16">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
          04 · The B2B opportunity
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Where the money is 💰
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Four trade corridors, five buyer segments, three companies already using Quidax's API today. The opportunity model is interactive — adjust the capture rates yourself.
        </p>
      </section>

      <CorridorView />
      <B2BOpportunity />
      <CustomerProof />
      <ChapterNav current="/opportunity" />
    </main>
  )
}
