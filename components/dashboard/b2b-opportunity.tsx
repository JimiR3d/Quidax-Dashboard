"use client"

import { useMemo, useState } from "react"
import Target from "lucide-react/dist/esm/icons/target"
import Zap from "lucide-react/dist/esm/icons/zap"
import BarChart3 from "lucide-react/dist/esm/icons/bar-chart-3"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { B2B_SEGMENTS } from "@/lib/competitive-data"
import { fmtUsd } from "@/lib/format"

type Knob = { capturePct: number; takeRateBps: number }

function defaultKnobs(): Knob[] {
  return B2B_SEGMENTS.map((s) => ({
    capturePct: Number(((s.capturePctLow + s.capturePctHigh) / 2).toFixed(2)),
    takeRateBps: s.takeRateBps,
  }))
}

export function B2BOpportunity() {
  const [knobs, setKnobs] = useState<Knob[]>(defaultKnobs)
  const [touched, setTouched] = useState(false)

  const enriched = useMemo(() => {
    return B2B_SEGMENTS.map((s, i) => {
      const k = knobs[i]
      const rev = s.tamUsd * (k.capturePct / 100) * (k.takeRateBps / 10000)
      const revLow = s.tamUsd * (s.capturePctLow / 100) * (s.takeRateBps / 10000)
      const revHigh = s.tamUsd * (s.capturePctHigh / 100) * (s.takeRateBps / 10000)
      return { ...s, ...k, rev, revLow, revHigh }
    })
  }, [knobs])

  const total = enriched.reduce((a, s) => a + s.rev, 0)
  const totalLow = enriched.reduce((a, s) => a + s.revLow, 0)
  const totalHigh = enriched.reduce((a, s) => a + s.revHigh, 0)

  const chartData = enriched.map((s) => ({
    name: s.segment.length > 22 ? s.segment.slice(0, 22) + "…" : s.segment,
    revenue: s.rev,
  }))

  function setKnob(i: number, patch: Partial<Knob>) {
    setTouched(true)
    setKnobs((prev) => prev.map((k, idx) => (idx === i ? { ...k, ...patch } : k)))
  }

  function reset() {
    setKnobs(defaultKnobs())
    setTouched(false)
  }

  return (
    <section id="b2b" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight">The B2B Opportunity</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
          Don't take our word for it. Drag the sliders and build your own business case 🔧. The defaults are middle-of-the-road assumptions for how much of each market Quidax could reasonably win, and what cut we could take. The brackets next to each slider are the realistic boundaries from public data.
        </p>
      </div>

      {(() => {
        const oob = enriched.some(
          (s) => s.capturePct > s.capturePctHigh + 0.001 || s.takeRateBps > 150,
        )
        return oob ? (
          <div
            role="status"
            className="mb-4 flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs text-warning"
          >
            <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-warning" aria-hidden />
            <span>
              You've pushed a slider above the realistic upper bound. The chart still updates, but the number is no longer backed by the public sources on the methodology page. Treat it as &quot;what would this take?&quot; not &quot;what to expect&quot;.
            </span>
          </div>
        ) : null
      })()}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="card-elev flex flex-col rounded-lg border border-border/60 bg-card p-5 lg:col-span-3">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium">Yearly revenue, by buyer segment</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Updates live as you drag. Hit reset to restore defaults.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              disabled={!touched}
              className="rounded-md border border-border/60 bg-background px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-40"
            >
              Reset to defaults
            </button>
          </div>

          <div className="h-80 w-full" aria-label="Modeled annual B2B revenue per segment" role="img">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
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
                  width={170}
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
                  formatter={(value: number) => [fmtUsd(value), "Annual revenue"]}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3 border-t border-border/60 pt-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Conservative
              </div>
              <div className="mt-0.5 font-mono text-lg tabular-nums">{fmtUsd(totalLow, { compact: true })}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Your number</div>
              <div className="mt-0.5 font-mono text-lg tabular-nums text-primary">
                {fmtUsd(total, { compact: true })}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Optimistic
              </div>
              <div className="mt-0.5 font-mono text-lg tabular-nums">
                {fmtUsd(totalHigh, { compact: true })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:col-span-2">
          {enriched.map((s, i) => (
            <article
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
                    Market Size
                  </div>
                  <div className="mt-0.5 font-mono text-sm tabular-nums">
                    {fmtUsd(s.tamUsd, { compact: true })}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2.5">
                <label className="block">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Share Quidax wins
                    </span>
                    <span className="font-mono text-xs tabular-nums text-foreground">
                      {s.capturePct.toFixed(2)}%
                      <span className="ml-1 text-muted-foreground/70">
                        (realistic {s.capturePctLow}–{s.capturePctHigh})
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(s.capturePctHigh * 2, 8)}
                    step={0.05}
                    value={s.capturePct}
                    onChange={(e) => setKnob(i, { capturePct: Number(e.target.value) })}
                    className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-[var(--primary)]"
                    aria-label={`Capture percentage for ${s.segment}`}
                    aria-valuetext={`${s.capturePct.toFixed(2)} percent`}
                  />
                </label>

                <label className="block">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Our Cut (Fee)
                    </span>
                    <span className="font-mono text-xs tabular-nums text-foreground">
                      {(s.takeRateBps / 100).toFixed(2)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={150}
                    step={1}
                    value={s.takeRateBps}
                    onChange={(e) => setKnob(i, { takeRateBps: Number(e.target.value) })}
                    className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-[var(--primary)]"
                    aria-label={`Take rate basis points for ${s.segment}`}
                    aria-valuetext={`${s.takeRateBps} basis points`}
                  />
                </label>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                <span className="font-mono text-muted-foreground">Revenue from this segment</span>
                <span className="font-mono tabular-nums text-primary">
                  {fmtUsd(s.rev, { compact: true })}/yr
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
