import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { MarketTicker } from "@/lib/quidax"
import { buildSyntheticSeries } from "@/lib/quidax"
import { fmtNgn, fmtNum, fmtPct } from "@/lib/format"
import { Sparkline } from "./sparkline"

export function MarketTape({ tickers }: { tickers: MarketTicker[] }) {
  const ngn = tickers
    .filter((t) => t.quote === "NGN")
    .sort((a, b) => b.last * b.volume - a.last * a.volume)

  return (
    <section id="market" className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          02 · The NGN tape
        </h2>
        <p className="text-2xl font-semibold tracking-tight md:text-3xl">
          Quidax&apos;s NGN order book in one screen
        </p>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Live ticker data via the public Quidax markets API, sorted by 24h NGN-denominated volume. This is the surface area Quidax already monetizes — and the foundation any B2B SKU sits on top of.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-secondary/40 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Pair</th>
                <th className="px-4 py-3 text-right">Last</th>
                <th className="px-4 py-3 text-right">24h</th>
                <th className="px-4 py-3 text-right">High</th>
                <th className="px-4 py-3 text-right">Low</th>
                <th className="px-4 py-3 text-right">Volume (base)</th>
                <th className="px-4 py-3 text-right">NGN turnover</th>
                <th className="px-4 py-3 text-right">30d trend</th>
              </tr>
            </thead>
            <tbody>
              {ngn.map((t) => {
                const positive = t.changePct >= 0
                const series = buildSyntheticSeries(t.market, t.last, 30)
                const turnover = t.last * t.volume
                return (
                  <tr
                    key={t.market}
                    className="border-b border-border/40 last:border-0 transition-colors hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary font-mono text-[10px] font-medium text-foreground/80">
                          {t.base.slice(0, 3)}
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
                    <td className="px-4 py-3 text-right font-mono">{fmtNgn(t.last)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-mono ${
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
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                      {fmtNgn(t.high)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                      {fmtNgn(t.low)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                      {fmtNum(t.volume, t.volume > 1000 ? 0 : 2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {fmtNgn(turnover, { compact: true })}
                    </td>
                    <td className="px-4 py-3">
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
    </section>
  )
}
