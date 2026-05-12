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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { NGN_USDT_PREMIUM, STABLECOIN_MIX } from "@/lib/competitive-data"
import { fmtNgn } from "@/lib/format"

export function StablecoinDeepDive() {
  return (
    <section id="stablecoins" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          03 · Stablecoin deep-dive
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          The naira&apos;s structural FX gap is Quidax&apos;s B2B wedge
        </p>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          USDT trades at a persistent premium to the official CBN window, and roughly{" "}
          <span className="text-foreground">88% of NGN crypto volume</span> is stablecoin-denominated. That is not a trading narrative — that is a treasury and settlements narrative, and it directly maps to a B2B API SKU.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Premium chart */}
        <div className="lg:col-span-2 rounded-lg border border-border/60 bg-card p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium">USDT/NGN vs official CBN FX · last 12 weeks</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Analyst model. The gap between the two lines is the premium B2B flow is paying to escape naira convertibility friction.
              </p>
            </div>
            <span className="rounded-md border border-border/60 bg-secondary/40 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              weekly
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={NGN_USDT_PREMIUM} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="usdtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fxGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                  width={56}
                  tickFormatter={(v: number) => `₦${(v / 1000).toFixed(1)}k`}
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
                <Area
                  type="monotone"
                  dataKey="usdtFx"
                  name="USDT/NGN (market)"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#usdtGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="officialFx"
                  name="Official CBN FX"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  fill="url(#fxGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 h-32 w-full border-t border-border/60 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={NGN_USDT_PREMIUM} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                  width={40}
                  tickFormatter={(v: number) => `${v.toFixed(0)}%`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, "Premium"]}
                />
                <Line
                  type="monotone"
                  dataKey="premiumPct"
                  name="Premium"
                  stroke="var(--warning)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mix */}
        <div className="rounded-lg border border-border/60 bg-card p-5">
          <div className="mb-2">
            <h3 className="text-sm font-medium">NGN volume mix by asset</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Stablecoins dominate; BTC is increasingly used as a quasi-savings instrument, not for trading.
            </p>
          </div>
          <div className="h-56 w-full">
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
          <ul className="mt-2 space-y-2">
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
                <span className="font-mono text-muted-foreground">{s.share}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
