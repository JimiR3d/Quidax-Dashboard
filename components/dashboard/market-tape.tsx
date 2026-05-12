"use client"

import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { ArrowUpRight, ArrowDownRight, Radio } from "lucide-react"
import type { MarketTicker, MarketSnapshot } from "@/lib/quidax"
import { buildSyntheticSeries } from "@/lib/quidax"
import { fmtNgn, fmtNum, fmtPct } from "@/lib/format"
import { Sparkline } from "./sparkline"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function timeAgo(iso: string, nowMs: number) {
  const t = new Date(iso).getTime()
  const s = Math.max(0, Math.floor((nowMs - t) / 1000))
  if (s < 5) return "just now"
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

export function MarketTape({ tickers: initialTickers }: { tickers: MarketTicker[] }) {
  const { data } = useSWR<MarketSnapshot>("/api/markets", fetcher, {
    refreshInterval: 15_000,
    revalidateOnFocus: true,
    fallbackData: { source: "live", fetchedAt: new Date().toISOString(), tickers: initialTickers },
  })

  const tickers = data?.tickers ?? initialTickers
  const fetchedAt = data?.fetchedAt ?? new Date().toISOString()
  const source = data?.source ?? "live"

  // Track previous price per market to flash green/red on change
  const prevRef = useRef<Record<string, number>>({})
  const [flash, setFlash] = useState<Record<string, "up" | "down" | undefined>>({})

  useEffect(() => {
    const updates: Record<string, "up" | "down"> = {}
    for (const t of tickers) {
      const prev = prevRef.current[t.market]
      if (prev !== undefined && prev !== t.last) {
        updates[t.market] = t.last > prev ? "up" : "down"
      }
      prevRef.current[t.market] = t.last
    }
    if (Object.keys(updates).length) {
      setFlash(updates)
      const id = setTimeout(() => setFlash({}), 900)
      return () => clearTimeout(id)
    }
  }, [tickers])

  // Tick re-render every second so "Updated Xs ago" stays fresh
  const [, setNow] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setNow((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const ngn = tickers
    .filter((t) => t.quote === "NGN")
    .sort((a, b) => b.last * b.volume - a.last * a.volume)

  return (
    <section id="market" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            02 · The NGN tape
          </h2>
          <p className="text-2xl font-semibold tracking-tight md:text-3xl text-balance">
            Quidax&apos;s NGN order book, polling every 15s
          </p>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground text-pretty">
            Live ticker data via Quidax&apos;s public API, sorted by 24h NGN-denominated turnover. This is the surface area Quidax already monetizes — and the foundation any B2B SKU sits on top of.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${
                source === "live" ? "bg-positive live-ping" : "bg-warning"
              }`}
              aria-hidden="true"
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                source === "live" ? "bg-positive" : "bg-warning"
              }`}
            />
          </div>
          <div className="flex flex-col text-right leading-tight">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {source === "live" ? "Live · Quidax public API" : "Fallback data"}
            </span>
            <span className="text-xs text-foreground/80">
              Updated {timeAgo(fetchedAt, Date.now())}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 card-elev">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-secondary/40 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Pair</th>
                <th className="px-4 py-3 text-right">Last</th>
                <th className="px-4 py-3 text-right">24h</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">High</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Low</th>
                <th className="px-4 py-3 text-right hidden lg:table-cell">Volume (base)</th>
                <th className="px-4 py-3 text-right">NGN turnover</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">30d trend</th>
              </tr>
            </thead>
            <tbody>
              {ngn.map((t) => {
                const positive = t.changePct >= 0
                const series = buildSyntheticSeries(t.market, t.last, 30)
                const turnover = t.last * t.volume
                const f = flash[t.market]
                return (
                  <tr
                    key={t.market}
                    className={`border-b border-border/40 last:border-0 transition-colors hover:bg-secondary/30 ${
                      f === "up"
                        ? "bg-positive/10"
                        : f === "down"
                          ? "bg-destructive/10"
                          : ""
                    }`}
                    style={{ transition: "background-color 800ms ease" }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-primary/25 to-accent/15 font-mono text-[10px] font-semibold text-foreground/90 ring-1 ring-primary/20">
                          {t.base.slice(0, 4)}
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="font-medium">
                            {t.base}/{t.quote}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            {t.market}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{fmtNgn(t.last)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-mono tabular-nums ${
                          positive ? "text-positive" : "text-destructive"
                        }`}
                      >
                        {positive ? (
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {fmtPct(t.changePct)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground tabular-nums hidden md:table-cell">
                      {fmtNgn(t.high)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground tabular-nums hidden md:table-cell">
                      {fmtNgn(t.low)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground tabular-nums hidden lg:table-cell">
                      {fmtNum(t.volume, t.volume > 1000 ? 0 : 2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {fmtNgn(turnover, { compact: true })}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex justify-end">
                        <Sparkline data={series} positive={positive} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <Radio className="h-3 w-3" aria-hidden="true" />
        Polling <span className="text-foreground/80">/api/markets</span> every 15s · pairs flash on price tick · {ngn.length} active NGN markets
      </p>
    </section>
  )
}
