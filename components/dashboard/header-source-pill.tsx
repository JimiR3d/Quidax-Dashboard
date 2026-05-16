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
        label: "Live · Quidax API",
        classes: "border-positive/40 bg-positive/10 text-positive",
        dot: "bg-positive animate-pulse",
      }
    case "cached":
      return {
        label: "Cached (within 10s)",
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
 * The header status pill. Hydrates with the server-rendered snapshot, then
 * subscribes to the same `/api/markets` SWR cache as the proof strip — so
 * both surfaces always agree on age and source. The seconds counter
 * re-renders every second; at 15s SWR has already triggered the
 * next fetch, which resets the clock.
 *
 * IMPORTANT: Initialize `now` as close as possible to `initialFetchedAt`
 * so the age calculation doesn't show a 14s backlog from server-render latency.
 */
export function HeaderSourcePill({ initialSource, initialFetchedAt }: Props) {
  const { data } = useSWR<MarketSnapshot>("/api/markets", fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  })
  const source = data?.source ?? initialSource
  const fetchedAt = data?.fetchedAt ?? initialFetchedAt

  // Initialize as if the fetch just completed — don't wait for the first
  // interval tick. If initialFetchedAt is ~now, age starts at 0–1s.
  // If SWR has already updated and fetchedAt is fresh, SWR's data
  // overrides and age resets anyway.
  const [now, setNow] = useState(() => {
    if (initialFetchedAt) {
      const fetchMs = new Date(initialFetchedAt).getTime()
      // Age as of component mount time, not Date.now() 14s later
      return fetchMs
    }
    return Date.now()
  })

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const ageMs = fetchedAt ? Math.max(0, now - new Date(fetchedAt).getTime()) : null
  // No cap — past 15s the counter keeps climbing so the reader sees the
  // page is lagging rather than seeing a stuck "15s ago".
  const liveSeconds = ageMs == null ? null : Math.floor(ageMs / 1000)

  const b = badge(source)
  const ageText =
    source === "live" && liveSeconds != null
      ? liveSeconds === 1
        ? "1s ago"
        : `${liveSeconds}s ago`
      : ageMs != null
        ? fmtRelTime(ageMs)
        : "—"

  return (
    <span
      className={`hidden md:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${b.classes}`}
      aria-live="polite"
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${b.dot}`} aria-hidden="true" />
      <span>{b.label}</span>
      <span className="tabular-nums opacity-80">· {ageText}</span>
    </span>
  )
}
