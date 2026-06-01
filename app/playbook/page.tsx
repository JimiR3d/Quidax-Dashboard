import { SiteHeader } from "@/components/dashboard/site-header"
import { Recommendations } from "@/components/dashboard/recommendations"
import { CounterThesis } from "@/components/dashboard/counter-thesis"
import { PitchFooter } from "@/components/dashboard/pitch-footer"
import { ChapterNav } from "@/components/dashboard/chapter-nav"

export const metadata = {
  title: "What To Do Next — NGN Liquidity Intelligence",
  description:
    "Five prioritized moves for Quidax's B2B layer, honest counter-arguments, and what could go wrong.",
}

export const revalidate = 3600

export default function PlaybookPage() {
  return (
    <main className="min-h-screen bg-transparent">
      <SiteHeader snapshotSource="live" />

      <section className="mx-auto w-full max-w-7xl px-4 pt-12 md:px-6 md:pt-16">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
          05 · The playbook
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          From analysis to action 🗒️
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Five moves worth shipping next, the honest counter-arguments, and what could go wrong. Every recommendation ties to a measurable number in the model.
        </p>
      </section>

      <Recommendations />
      <CounterThesis />
      <ChapterNav current="/playbook" />
      <PitchFooter />
    </main>
  )
}
