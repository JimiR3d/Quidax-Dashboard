"use client"

import useSWR from "swr"
import { useEffect, useState } from "react"
import type { MarketSnapshot, SnapshotSource } from "@/lib/quidax"
import { fmtRelTime } from "@/lib/format"

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json() as Promise<MarketSnapshot>
  })

type Props = { initialSource: SnapshotSource; initialFetchedAt: string | null }

function badge(source: SnapshotSource) {
  switch (source) {
    case "live":
      return {
        label: "Live",
        classes: "border-positive/40 bg-positive/10 text-positive",
        dot: "bg-positive animate-pulse",
      }
    case "cached":
      return {
        label: "Live",
        classes: "border-positive/30 bg-positive/5 text-positive",
        dot: "bg-positive",
      }
    case "lkg":
      return {
        label: "Stale · upstream unreachable",
        classes: "border-warning/40 bg-warning/10 text-warning",
        dot: "bg-warning",
      }
    case "empty":
      return {
        label: "No live data available",
        classes: "border-destructive/40 bg-destructive/10 text-destructive",
        dot: "bg-destructive",
      }
  }
}

/**
 * Header status pill. Shows "Live" + seconds-since-refresh counter.
 * Counter starts at 1, counts up continuously, resets to 1 every time
 * SWR fetches fresh data (every 15s ideally, up to 30s if issues).
 */
export function HeaderSourcePill({ initialSource, initialFetchedAt }: Props) {
  const { data } = useSWR<MarketSnapshot>("/api/markets", fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  })
  const source = data?.source ?? initialSource
  const fetchedAt = data?.fetchedAt ?? initialFetchedAt

  // Counter: starts at 1, counts up every second, resets when data changes
  const [counter, setCounter] = useState(1)

  // Increment counter every second
  useEffect(() => {
    const id = setInterval(() => {
      setCounter((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Reset counter to 1 when SWR brings fresh data
  useEffect(() => {
    setCounter(1)
  }, [data?.fetchedAt])

  const b = badge(source)
  const counterText = counter === 1 ? "1s ago" : `${counter}s ago`

  return (
    <span
      className={`hidden md:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${b.classes}`}
      aria-live="polite"
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${b.dot}`} aria-hidden="true" />
      <span>{b.label}</span>
      <span className="tabular-nums opacity-80">· {counterText}</span>
    </span>
  )
}
