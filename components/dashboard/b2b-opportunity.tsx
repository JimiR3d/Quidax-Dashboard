"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { B2B_SEGMENTS } from "@/lib/competitive-data"
import { fmtUsd } from "@/lib/format"

export function B2BOpportunity() {
  const enriched = B2B_SEGMENTS.map((s) => {
    const midPct = (s.capturePctLow + s.capturePctHigh) / 2 / 100
    const lowPct = s.capturePctLow / 100
    const highPct = s.capturePctHigh / 100
    const rev = (pct: number) => s.tamUsd * pct * (s.takeRateBps / 10000)
    return {
      ...s,
      revLow: rev(lowPct),
      revMid: rev(midPct),
      revHigh: rev(highPct),
    }
  })

  const totalLow = enriched.reduce((a, s) => a + s.revLow, 0)
  const totalMid = enriched.reduce((a, s) => a + s.revMid, 0)
  const totalHigh = enriched.reduce((a, s) => a + s.revHigh, 0)

  const chartData = enriched.map((s) => ({
    name: s.segment,
    low: s.revLow,
    mid: s.revMid - s.revLow,
    high: s.revHigh - s.revMid,
    total: s.revHigh,
  }))

  return (
    <section id="b2b" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          05 · B2B opportunity sizing
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          A modeled path to{" "}
          <span className="text-primary">{fmtUsd(totalMid, { compact: true })}</span> in annual B2B revenue
        </p>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Four segments, each with a defensible take-rate. Capture ranges reflect a 24-month outlook. Even at the conservative bound ({fmtUsd(totalLow, { compact: true })}), this is a step-change over what an exchange order book alone produces, with materially lower CAC.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-lg border border-border/60 bg-card p-5">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium">Modeled annual revenue by segment</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Stacked bars: solid = low-bound, mid + high bands extend to upside.
              </p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                  tickFormatter={(v: number) => fmtUsd(v, { compact: true })}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => [
                    fmtUsd(value),
                    name === "low" ? "Low bound" : name === "mid" ? "Mid extension" : "High extension",
                  ]}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Bar dataKey="low" stackId="rev" fill="var(--chart-1)" radius={[0, 0, 0, 4]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="var(--chart-1)" />
                  ))}
                </Bar>
                <Bar dataKey="mid" stackId="rev" fill="var(--chart-2)" fillOpacity={0.6} />
                <Bar dataKey="high" stackId="rev" fill="var(--chart-2)" fillOpacity={0.25} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-[var(--chart-1)]" aria-hidden="true" />
              Low-bound capture
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-[var(--chart-2)] opacity-60" aria-hidden="true" />
              Mid extension
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-[var(--chart-2)] opacity-30" aria-hidden="true" />
              High extension
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 gap-3">
          <div className="rounded-lg border border-border/60 bg-card p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Aggregate (annual)
            </div>
            <div className="mt-2 grid grid-cols-3 gap-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Low
                </div>
                <div className="mt-1 font-mono text-xl">{fmtUsd(totalLow, { compact: true })}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Mid</div>
                <div className="mt-1 font-mono text-xl text-primary">{fmtUsd(totalMid, { compact: true })}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  High
                </div>
                <div className="mt-1 font-mono text-xl">{fmtUsd(totalHigh, { compact: true })}</div>
              </div>
            </div>
          </div>

          {enriched.map((s) => (
            <div
              key={s.segment}
              className="rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{s.segment}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    TAM
                  </div>
                  <div className="mt-0.5 font-mono text-sm">{fmtUsd(s.tamUsd, { compact: true })}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">
                  Capture {s.capturePctLow.toFixed(1)}–{s.capturePctHigh.toFixed(1)}% · {s.takeRateBps}bps
                </span>
                <span className="font-mono text-primary">
                  ≈ {fmtUsd(s.revMid, { compact: true })}/yr
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
