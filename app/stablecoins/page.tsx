import { getMarketSnapshot, getCandles, candlesToSeries, buildSyntheticSeries } from "@/lib/quidax"
import { SiteHeader } from "@/components/dashboard/site-header"
import { StablecoinDeepDive } from "@/components/dashboard/stablecoin-deepdive"
import { ChapterNav } from "@/components/dashboard/chapter-nav"

export const metadata = {
  title: "Nigeria's Digital Dollar — NGN Liquidity Intelligence",
  description:
    "Why 86% of naira crypto volume flows into stablecoins, and what that means for Quidax's B2B thesis.",
}

export const revalidate = 60

export default async function StablecoinsPage() {
  const [snapshotR, usdtCandlesR] = await Promise.allSettled([
    getMarketSnapshot(),
    getCandles("usdtngn", 1440, 30),
  ])

  const snapshot =
    snapshotR.status === "fulfilled"
      ? snapshotR.value
      : { source: "empty" as const, fetchedAt: null, ageMs: 0, dropped: 0, tickers: [] }
  const usdtCandles = usdtCandlesR.status === "fulfilled" ? usdtCandlesR.value : []

  const usdt = snapshot.tickers.find((t) => t.market === "usdtngn")

  const usdtSeries =
    usdtCandles.length > 0
      ? candlesToSeries(usdtCandles)
      : usdt
        ? buildSyntheticSeries("usdtngn", usdt.last, 30)
        : []
  const usdtSource: "live" | "synthetic" | "empty" =
    usdtCandles.length > 0 ? "live" : usdt ? "synthetic" : "empty"

  return (
    <main className="min-h-screen bg-transparent">
      <SiteHeader snapshotSource={snapshot.source} fetchedAt={snapshot.fetchedAt} />

      <section className="mx-auto w-full max-w-7xl px-4 pt-12 md:px-6 md:pt-16">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
          02 · Nigeria's digital dollar
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          People want stable, not speculative 💵
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Roughly 86% of the naira flowing into crypto on exchanges goes into stablecoins. Nigerians are using them as their new dollar account, not for speculation. This is what makes the B2B settlement case real.
        </p>
      </section>

      <StablecoinDeepDive usdtCandles={usdtSeries} source={usdtSource} />
      <ChapterNav current="/stablecoins" />
    </main>
  )
}
