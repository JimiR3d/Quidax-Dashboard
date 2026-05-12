"use client"

import useSWR from "swr"
import { useEffect, useRef, useState } from "react"
import { Radio } from "lucide-react"
import type { MarketSnapshot, MarketTicker } from "@/lib/quidax"
import { fmtNgn, fmtPct } from "@/lib/format"

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<MarketSnapshot>)

type Props = { initial: MarketSnapshot }

export function ApiProofStrip({ initial }: Props) {
  const { data } = useSWR<MarketSnapshot>("/api/markets", fetcher, {
    refreshInterval: 15000,
    fallbackData: initial,
    revalidateOnFocus: false,
  })
  const snapshot = data ?? initial
  const tickers = snapshot.tickers.filter((t) => t.quote === "NGN")
  const [secondsAgo, setSecondsAgo] = useState(0)
  const lastPriceRef = useRef<Record<string, number>>({})
  const [flash, setFlash] = useState<Record<string, "up" | "down" | undefined>>({})

  useEffect(() => {
    // Reset the "Xs ago" indicator immediately whenever a fresh snapshot
    // arrives — otherwise the previous interval would show stale values
    // for ~1s after each SWR refetch.
    setSecondsAgo(0)
    const i = setInterval(() => {
      setSecondsAgo(Math.max(0, Math.floor((Date.now() - new Date(snapshot.fetchedAt).getTime()) / 1000)))
    }, 1000)
    return () => clearInterval(i)
  }, [snapshot.fetchedAt])

  useEffect(() => {
    const updates: Record<string, "up" | "down"> = {}
    for (const t of tickers) {
      const prev = lastPriceRef.current[t.market]
      if (prev !== undefined && prev !== t.last) {
        updates[t.market] = t.last > prev ? "up" : "down"
      }
      lastPriceRef.current[t.market] = t.last
    }
    if (Object.keys(updates).length) {
      setFlash(updates)
      const id = setTimeout(() => setFlash({}), 900)
      return () => clearTimeout(id)
    }
  }, [tickers])

  return (
    <section id="api" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6" aria-labelledby="api-proof-title">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            11 · API integration · Proof
          </h2>
          <p id="api-proof-title" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            All {tickers.length} NGN pairs · live
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
            snapshot.source === "live"
              ? "border-positive/30 bg-positive/10"
              : "border-warning/30 bg-warning/10"
          }`}
        >
          <span
            className={`size-1.5 rounded-full animate-pulse ${
              snapshot.source === "live" ? "bg-positive" : "bg-warning"
            }`}
            aria-hidden
          />
          <span
            className={`font-medium ${snapshot.source === "live" ? "text-positive" : "text-warning"}`}
          >
            {snapshot.source === "live" ? "Live · refreshes every 15s" : "Simulated · upstream unreachable"}
          </span>
          <span className="tabular-nums text-muted-foreground">· updated {secondsAgo}s ago</span>
        </div>
      </header>

      <div className="card-elev overflow-x-auto rounded-xl p-3" role="region" aria-label="Live NGN pair prices">
        <ul className="flex min-w-max gap-2">
          {tickers.length === 0 ? (
            <li className="px-3 py-2 text-xs text-muted-foreground">No NGN markets available</li>
          ) : (
            tickers.map((t) => <PairPill key={t.market} t={t} flash={flash[t.market]} />)
          )}
        </ul>
      </div>

      <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <Radio className="h-3 w-3" aria-hidden="true" />
        Plumbing exhibit: this strip polls <span className="text-foreground/80">/api/markets</span> every 15 seconds
        via SWR. The route fetches Quidax&apos;s public ticker endpoint server-side with a 5-second timeout and a
        simulated fallback.
      </p>
    </section>
  )
}

function PairPill({ t, flash }: { t: MarketTicker; flash: "up" | "down" | undefined }) {
  const positive = t.changePct >= 0
  const flashCls =
    flash === "up"
      ? "ring-positive/70 bg-positive/10"
      : flash === "down"
        ? "ring-destructive/70 bg-destructive/10"
        : ""
  return (
    <li
      className={`group flex shrink-0 items-center gap-3 rounded-lg border border-border/60 bg-card/40 px-3 py-2 ring-1 ring-transparent transition-all duration-300 ${flashCls}`}
    >
      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">
        {t.base}/{t.quote}
      </span>
      <span className="font-mono text-sm tabular-nums">{fmtNgn(t.last)}</span>
      <span className={`font-mono text-xs tabular-nums ${positive ? "text-positive" : "text-destructive"}`}>
        {fmtPct(t.changePct)}
      </span>
    </li>
  )
}
