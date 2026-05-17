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
  // Deviation from official NFEM, in basis points (1% = 100 bps).
  deviationBps: number
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
    deviationBps: Math.round(
      ((c.price - FX_REFERENCE.cbnOfficial) / FX_REFERENCE.cbnOfficial) * 10000,
    ),
  }))

  const avgDevBps =
    data.length > 0 ? Math.round(data.reduce((s, p) => s + p.deviationBps, 0) / data.length) : 0
  const absMaxDev = data.length > 0 ? Math.max(...data.map((p) => Math.abs(p.deviationBps))) : 0

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
          05 · A closer look at stablecoins
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl text-balance">
          Stablecoins have become Nigeria&apos;s digital dollar
        </p>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground text-pretty">
          The gap between the naira and the dollar used to be{" "}
          <span className="text-foreground">over 30% in 2023</span> &mdash; today it&apos;s{" "}
          <span className="text-foreground">about 1%</span>. Stablecoins didn&apos;t lose; they became the rail people use to hold dollars. Of the dollar-substitute demand Nigerians route through exchanges, roughly{" "}
          <span className="text-foreground">86% sits in USDT, cNGN, and USDC</span>. Bitcoin is treated more like savings now, less like trading. That&apos;s a settlements story, not a speculation story.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl card-elev p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium">USDT/NGN vs the official CBN rate &mdash; last 30 days</h3>
              <p className="mt-1 max-w-md text-xs text-muted-foreground text-pretty">
                <span className="text-foreground/90">The blue line:</span>{" "}
                {source === "live"
                  ? "real daily closing prices from Quidax"
                  : source === "synthetic"
                    ? "an estimated fill-in — clearly labelled, not a prediction"
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
                <span className={avgDevBps >= 0 ? "text-warning" : "text-positive"}>
                  {avgDevBps >= 0 ? "+" : ""}
                  {avgDevBps} bps
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
                No daily price history right now &mdash; Quidax&apos;s K-line endpoint isn&apos;t reachable
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
              aria-label={`Deviation in basis points from NFEM official rate. Average ${avgDevBps} bps, maximum absolute ${absMaxDev} bps over the window.`}
            >
              <div className="mb-1 flex items-baseline justify-between">
                <h4 className="text-xs font-medium text-foreground/80">
                  How far Quidax was from the official rate, day by day
                </h4>
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  biggest gap {absMaxDev} bps
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
                      `${value > 0 ? "+" : ""}${value} bps`,
                      "Deviation",
                    ]}
                  />
                  <ReferenceLine y={0} stroke="var(--chart-4)" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="deviationBps"
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
            <h3 className="text-sm font-medium">What people use crypto FOR (not 24-hour trading)</h3>
            <p className="mt-1 text-xs text-muted-foreground text-pretty">
              This is what Nigerians use crypto-on-naira for &mdash; saving, settling, paying &mdash; not how much trading happens in a day. Stablecoins and savings dominate. cNGN is the only regulated naira-pegged option, and it&apos;s only on Quidax.
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
            My estimated split &mdash; on purpose, NOT a 24-hour trading ratio. I calibrated it against Chainalysis SSA reports and how people actually use these exchanges. The &quot;stablecoin share of NGN volume&quot; KPI above is the live trading number; these are two different things.
          </p>
        </div>
      </div>
    </section>
  )
}
