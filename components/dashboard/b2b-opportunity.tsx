"use client"

import { useMemo, useState } from "react"
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
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          07 · B2B opportunity sizing — interactive
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          A modeled path to{" "}
          <span className="text-primary tabular-nums">{fmtUsd(total, { compact: true })}</span> in annual B2B
          revenue
        </p>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Drag the sliders to change your own assumptions. The chart and aggregate re-compute live. The defaults
          are my mid-case capture rates and take rates per segment; the model bound shown next to each slider is
          the bracket from public proxies.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="card-elev rounded-lg border border-border/60 bg-card p-5 lg:col-span-3">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium">Modeled annual revenue by segment</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Live from your slider values. Reset to return to the model defaults.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              disabled={!touched}
              className="rounded-md border border-border/60 bg-background px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-40"
            >
              Reset to model
            </button>
          </div>

          <div className="h-80 w-full" aria-label="Modeled annual B2B revenue per segment" role="img">
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
                Model low
              </div>
              <div className="mt-0.5 font-mono text-lg tabular-nums">{fmtUsd(totalLow, { compact: true })}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Your model</div>
              <div className="mt-0.5 font-mono text-lg tabular-nums text-primary">
                {fmtUsd(total, { compact: true })}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Model high
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
                    TAM
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
                      Capture %
                    </span>
                    <span className="font-mono text-xs tabular-nums text-foreground">
                      {s.capturePct.toFixed(2)}%
                      <span className="ml-1 text-muted-foreground/70">
                        (model {s.capturePctLow}–{s.capturePctHigh})
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
                      Take rate
                    </span>
                    <span className="font-mono text-xs tabular-nums text-foreground">
                      {s.takeRateBps} bps
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
                <span className="font-mono text-muted-foreground">Modeled revenue</span>
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
