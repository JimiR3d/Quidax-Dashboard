"use client"

import useSWR from "swr"
import { useEffect, useRef, useState } from "react"
import { Radio } from "lucide-react"
import type { MarketSnapshot, MarketTicker, SnapshotSource } from "@/lib/quidax"
import { fmtNgn, fmtPct, fmtRelTime } from "@/lib/format"

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json() as Promise<MarketSnapshot>
  })

type Props = { initial: MarketSnapshot }

function sourceChip(source: SnapshotSource, ageMs: number) {
  switch (source) {
    case "live":
      return {
        label: "Live · refreshes every 15s",
        classes: "border-positive/30 bg-positive/10 text-positive",
        dot: "bg-positive animate-pulse",
        ageText: "fetched just now",
      }
    case "cached":
      return {
        label: "Cached snapshot",
        classes: "border-positive/30 bg-positive/5 text-positive",
        dot: "bg-positive",
        ageText: `cache age ${fmtRelTime(ageMs)}`,
      }
    case "lkg":
      return {
        label: "Last-known-good · upstream unreachable",
        classes: "border-warning/40 bg-warning/10 text-warning",
        dot: "bg-warning",
        ageText: `last success ${fmtRelTime(ageMs)}`,
      }
    case "empty":
      return {
        label: "No live data available",
        classes: "border-destructive/40 bg-destructive/10 text-destructive",
        dot: "bg-destructive",
        ageText: "no cache · no upstream",
      }
  }
}

/**
 * Live ticker strip. Polls `/api/markets` every 15s via SWR; that route
 * applies a sliding-window rate-limit per IP, edge-caches for 10s, and
 * internally single-flights upstream Quidax calls. So we get a near-live
 * read without ever hammering the upstream.
 *
 * The strip flashes each pill green/red on price change, and shows the
 * truthful source chip from `snapshot.source` — including the "stale"
 * (LKG) and "empty" cases.
 */
export function ApiProofStrip({ initial }: Props) {
  const { data } = useSWR<MarketSnapshot>("/api/markets", fetcher, {
    refreshInterval: 15000,
    fallbackData: initial,
    revalidateOnFocus: false,
    keepPreviousData: true,
  })
  const snapshot = data ?? initial
  const tickers = snapshot.tickers.filter((t) => t.quote === "NGN")
  const [, force] = useState(0)
  const lastPriceRef = useRef<Record<string, number>>({})
  const [flash, setFlash] = useState<Record<string, "up" | "down" | undefined>>({})

  // Re-render every second so the "Xs ago" indicator stays accurate without
  // re-fetching. We don't need actual state — the snapshot itself is unchanged.
  useEffect(() => {
    const i = setInterval(() => force((n) => n + 1), 1000)
    return () => clearInterval(i)
  }, [])

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

  const fetchedAtMs = snapshot.fetchedAt ? new Date(snapshot.fetchedAt).getTime() : null
  const liveAgeMs = fetchedAtMs ? Math.max(0, Date.now() - fetchedAtMs) : snapshot.ageMs
  const chip = sourceChip(snapshot.source, liveAgeMs)

  return (
    <section
      id="api"
      className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6"
      aria-labelledby="api-proof-title"
    >
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            11 · API integration · Proof
          </h2>
          <p
            id="api-proof-title"
            className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
          >
            All {tickers.length} NGN pairs · {snapshot.source}
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${chip.classes}`}
          aria-live="polite"
        >
          <span className={`size-1.5 rounded-full ${chip.dot}`} aria-hidden />
          <span className="font-medium">{chip.label}</span>
          <span className="tabular-nums text-muted-foreground">· {chip.ageText}</span>
        </div>
      </header>

      <div
        className="card-elev overflow-x-auto rounded-xl p-3"
        role="region"
        aria-label="Live NGN pair prices"
      >
        <ul className="flex min-w-max gap-2">
          {tickers.length === 0 ? (
            <li className="px-3 py-2 text-xs text-muted-foreground">
              No NGN markets available — see the chip above for why.
            </li>
          ) : (
            tickers.map((t) => <PairPill key={t.market} t={t} flash={flash[t.market]} />)
          )}
        </ul>
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <Radio className="h-3 w-3" aria-hidden="true" />
        <span>
          This strip polls <span className="text-foreground/80">/api/markets</span> every 15 s
          via SWR. The route validates the upstream payload with Zod, caches it cross-viewer,
          and degrades to a labelled stale or empty state on failure — it does not invent
          prices.
        </span>
      </p>
    </section>
  )
}

function PairPill({
  t,
  flash,
}: {
  t: MarketTicker
  flash: "up" | "down" | undefined
}) {
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
      <span
        className={`font-mono text-xs tabular-nums ${
          positive ? "text-positive" : "text-destructive"
        }`}
      >
        {fmtPct(t.changePct)}
      </span>
    </li>
  )
}
