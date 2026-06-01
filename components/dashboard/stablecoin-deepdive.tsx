"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { STABLECOIN_MIX } from "@/lib/competitive-data"
import { FX_REFERENCE } from "@/lib/insights"
import { fmtNgn } from "@/lib/format"

type ChartPoint = {
  label: string
  usdtFx: number
  // Deviation from official NFEM, as a percentage.
  deviationPct: number
}

type Source = "live" | "synthetic" | "empty"

export function StablecoinDeepDive({
  usdtCandles,
  source,
}: {
  usdtCandles: { day: string; price: number }[]
  source: Source
}) {
  const data: ChartPoint[] = usdtCandles.map((c) => ({
    label: c.day,
    usdtFx: Math.round(c.price),
    deviationPct: Number((((c.price - FX_REFERENCE.cbnOfficial) / FX_REFERENCE.cbnOfficial) * 100).toFixed(2)),
  }))

  const avgDevPct =
    data.length > 0 ? Number((data.reduce((s, p) => s + p.deviationPct, 0) / data.length).toFixed(2)) : 0
  const absMaxDev = data.length > 0 ? Number(Math.max(...data.map((p) => Math.abs(p.deviationPct))).toFixed(2)) : 0

  const sourceChip =
    source === "live"
      ? { label: "live · from Quidax", classes: "border-positive/30 bg-positive/10 text-positive" }
      : source === "synthetic"
        ? {
            label: "estimated fallback",
            classes: "border-warning/40 bg-warning/10 text-warning",
          }
        : { label: "no data", classes: "border-destructive/40 bg-destructive/10 text-destructive" }

  return (
    <section id="stablecoins" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          05 · What are people actually doing with their crypto? 🤔
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl text-balance">
          Stablecoins are Nigeria&apos;s new digital dollar
        </p>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground text-pretty">
          The gap between the naira and the dollar used to be{" "}
          <span className="text-foreground">wild (50–60%) before FX unification</span>. Today it's{" "}
          <span className="text-foreground">only 1–2.5%</span>. Stablecoins didn't shrink—they became the main way Nigerians hold and move dollars. Roughly{" "}
          <span className="text-foreground">86% of the money flowing into crypto</span>{" "}
          goes straight to USDT, cNGN, and USDC <span className="text-muted-foreground font-mono text-[10px] uppercase">(analyst estimate calibrated against Chainalysis and TRM Labs data)</span>. People are settling invoices and paying suppliers, not just speculating on dog coins. 📊
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl card-elev p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium">USDT/NGN vs the official CBN rate, last 30 days</h3>
              <p className="mt-1 max-w-md text-xs text-muted-foreground text-pretty">
                <span className="text-foreground/90">The solid line:</span>{" "}
                {source === "live"
                  ? "real daily closing prices from Quidax"
                  : source === "synthetic"
                  ? "an estimated fill-in, clearly labelled, not a prediction"
                  : "no data available for this window"}.{" "}
                <span className="text-foreground/90">The dashed line:</span> the official CBN rate, flat at{" "}
                <span className="tabular-nums">{fmtNgn(FX_REFERENCE.cbnOfficial)}</span>{" "}
                (tracked manually).
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${sourceChip.classes}`}
              >
                {sourceChip.label}
              </span>
              <span className="font-mono text-[11px] text-foreground/80">
                avg gap{" "}
                <span className={avgDevPct >= 0 ? "text-warning" : "text-positive"}>
                  {avgDevPct >= 0 ? "+" : ""}
                  {avgDevPct}%
                </span>
              </span>
            </div>
          </div>
          <div
            className="h-72 w-full"
            role="img"
            aria-label={`USDT to NGN daily close, last ${data.length} days, ${source} data, with NFEM reference line at ${FX_REFERENCE.cbnOfficial} naira`}
          >
            {data.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border/60 text-xs text-muted-foreground">
                No daily price history right now. Quidax's K-line endpoint isn't reachable 🛠️
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="usdtGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                    interval="preserveStartEnd"
                    minTickGap={32}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                    width={56}
                    domain={["dataMin - 20", "dataMax + 20"]}
                    tickFormatter={(v: number) => `₦${(v / 1000).toFixed(2)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "var(--muted-foreground)" }}
                    formatter={(value: number, name: string) => [fmtNgn(value), name]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }}
                    iconType="circle"
                  />
                  <ReferenceLine
                    y={FX_REFERENCE.cbnOfficial}
                    stroke="var(--chart-4)"
                    strokeDasharray="4 4"
                    label={{
                      value: `NFEM ${fmtNgn(FX_REFERENCE.cbnOfficial)}`,
                      position: "insideTopRight",
                      fill: "var(--muted-foreground)",
                      fontSize: 10,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="usdtFx"
                    name={`USDT/NGN (Quidax, ${source})`}
                    stroke="var(--chart-1)"
                    strokeWidth={2.2}
                    fill="url(#usdtGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          {data.length > 0 && (
            <div
              className="mt-4 h-32 w-full border-t border-border/60 pt-4"
              role="img"
              aria-label={`Deviation as a percentage from NFEM official rate. Average ${avgDevPct}%, maximum absolute ${absMaxDev}% over the window.`}
            >
              <div className="mb-1 flex items-baseline justify-between">
                <h4 className="text-xs font-medium text-foreground/80">
                  How far Quidax drifted from the official rate 🌊
                </h4>
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  biggest gap {absMaxDev}%
                </span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                    interval="preserveStartEnd"
                    minTickGap={32}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                    width={40}
                    tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [
                      `${value > 0 ? "+" : ""}${value}%`,
                      "Difference",
                    ]}
                  />
                  <ReferenceLine y={0} stroke="var(--chart-4)" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="deviationPct"
                    name="Deviation"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl card-elev p-5">
          <div className="mb-2">
            <h3 className="text-sm font-medium">What people actually use crypto for</h3>
            <p className="mt-1 text-xs text-muted-foreground text-pretty">
              This is the breakdown of why Nigerians buy crypto with naira. It's not 24-hour day trading. It's saving, settling invoices, and paying for things. Stablecoins absolutely dominate. 🎯
            </p>
          </div>
          <div
            className="h-56 w-full"
            role="img"
            aria-label={`Stablecoin demand mix: ${STABLECOIN_MIX.map(
              (s) => `${s.name} ${s.share} percent`,
            ).join(", ")}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STABLECOIN_MIX}
                  dataKey="share"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {STABLECOIN_MIX.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 flex flex-col gap-2">
            {STABLECOIN_MIX.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: s.color }}
                    aria-hidden="true"
                  />
                  <span className="text-foreground/90">{s.name}</span>
                </span>
                <span className="font-mono text-muted-foreground tabular-nums">
                  {s.share}%
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-border/60 pt-2 text-[10px] leading-relaxed text-muted-foreground">
            Estimated demand split, intentionally NOT a 24-hour trading ratio. Calibrated against Chainalysis SSA reports and observed exchange usage patterns. The &quot;stablecoin share of NGN volume&quot; KPI above is the live trading number; these are two different things.
          </p>
        </div>
      </div>
    </section>
  )
}
