"use client"

import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts"

export function Sparkline({
  data,
  positive,
}: {
  data: { day: string; price: number }[]
  positive: boolean
}) {
  const id = `spark-${positive ? "up" : "dn"}-${data[0]?.day ?? "x"}`
  const color = positive ? "var(--positive)" : "var(--destructive)"
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${id})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
