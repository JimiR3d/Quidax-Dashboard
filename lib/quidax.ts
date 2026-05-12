/**
 * Quidax public market data client.
 *
 * Public endpoints (no auth required):
 *   - GET https://app.quidax.io/api/v1/markets             — list all markets
 *   - GET https://app.quidax.io/api/v1/markets/tickers     — all tickers
 *   - GET https://app.quidax.io/api/v1/markets/:id/k       — K-line candles
 *
 * Verified against: https://docs.quidax.io/
 */

export type MarketTicker = {
  market: string // "btcngn"
  base: string // "BTC"
  quote: string // "NGN"
  last: number
  open: number
  high: number
  low: number
  volume: number
  changePct: number
  timestamp: number
}

export type MarketSnapshot = {
  source: "live" | "simulated"
  fetchedAt: string
  tickers: MarketTicker[]
}

export type Candle = { t: number; open: number; high: number; low: number; close: number; volume: number }

const QUIDAX_TICKERS_URL = "https://app.quidax.io/api/v1/markets/tickers"
const QUIDAX_KLINE = (market: string, period: number, limit: number) =>
  `https://app.quidax.io/api/v1/markets/${market}/k?period=${period}&limit=${limit}`

// Plausible fallback if the upstream is unreachable. Numbers calibrated to
// real Quidax tickers observed May 2026 so the dashboard always renders sanely.
const SIMULATED: MarketTicker[] = [
  { market: "usdtngn", base: "USDT", quote: "NGN", last: 1375.03, open: 1381.29, high: 1387.73, low: 1373.03, volume: 50_826, changePct: -0.45, timestamp: Date.now() },
  { market: "cngnngn", base: "CNGN", quote: "NGN", last: 0.9998, open: 1.0002, high: 1.0002, low: 0.9998, volume: 3_875, changePct: -0.04, timestamp: Date.now() },
  { market: "btcngn", base: "BTC", quote: "NGN", last: 110_893_620, open: 112_466_078, high: 113_017_321, low: 109_978_144, volume: 0.58, changePct: -1.40, timestamp: Date.now() },
  { market: "ethngn", base: "ETH", quote: "NGN", last: 3_142_453, open: 3_220_557, high: 3_232_599, low: 3_116_234, volume: 36.34, changePct: -2.42, timestamp: Date.now() },
  { market: "xrpngn", base: "XRP", quote: "NGN", last: 1_981.89, open: 2_032.41, high: 2_044.89, low: 1_958.81, volume: 13_488, changePct: -2.49, timestamp: Date.now() },
  { market: "trxngn", base: "TRX", quote: "NGN", last: 482.31, open: 484.12, high: 485.44, low: 479.06, volume: 8_117, changePct: -0.37, timestamp: Date.now() },
  { market: "ltcngn", base: "LTC", quote: "NGN", last: 79_845, open: 80_825, high: 80_936, low: 78_820, volume: 33.09, changePct: -1.21, timestamp: Date.now() },
  { market: "dashngn", base: "DASH", quote: "NGN", last: 64_442, open: 64_526, high: 65_116, low: 62_142, volume: 7.50, changePct: -0.13, timestamp: Date.now() },
  { market: "qdxngn", base: "QDX", quote: "NGN", last: 180.72, open: 180.72, high: 180.72, low: 180.72, volume: 0, changePct: 0.0, timestamp: Date.now() },
]

function num(x: unknown): number {
  if (typeof x === "number") return x
  if (typeof x === "string") {
    const n = Number(x)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function normalize(raw: unknown): MarketTicker[] {
  if (!raw || typeof raw !== "object") return []
  const obj = raw as Record<string, unknown>
  const data = (obj.data ?? obj) as Record<string, unknown>
  if (!data || typeof data !== "object") return []

  const out: MarketTicker[] = []
  for (const [market, value] of Object.entries(data)) {
    if (!value || typeof value !== "object") continue
    const v = value as Record<string, unknown>
    const ticker = (v.ticker ?? v) as Record<string, unknown>
    const last = num(ticker.last)
    const open = num(ticker.open)
    const high = num(ticker.high)
    const low = num(ticker.low)
    const volume = num(ticker.vol ?? ticker.volume)
    if (last <= 0 || open <= 0) continue

    const m = market.toLowerCase()
    let quote = "USD"
    let base = m.toUpperCase()
    if (m.endsWith("ngn")) {
      quote = "NGN"
      base = m.slice(0, -3).toUpperCase()
    } else if (m.endsWith("usdt")) {
      quote = "USDT"
      base = m.slice(0, -4).toUpperCase()
    } else if (m.endsWith("usd")) {
      quote = "USD"
      base = m.slice(0, -3).toUpperCase()
    }

    out.push({
      market: m,
      base,
      quote,
      last,
      open,
      high: high || last,
      low: low || last,
      volume: volume || 0,
      changePct: ((last - open) / open) * 100,
      timestamp: Date.now(),
    })
  }
  return out
}

export async function getMarketSnapshot(opts?: { noCache?: boolean }): Promise<MarketSnapshot> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  try {
    const res = await fetch(QUIDAX_TICKERS_URL, {
      ...(opts?.noCache ? { cache: "no-store" as const } : { next: { revalidate: 60 } }),
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`Upstream ${res.status}`)
    const json = await res.json()
    const tickers = normalize(json)
    if (tickers.length === 0) throw new Error("Empty normalization")
    return { source: "live", fetchedAt: new Date().toISOString(), tickers }
  } catch {
    return { source: "simulated", fetchedAt: new Date().toISOString(), tickers: SIMULATED }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Fetch real OHLCV candles from Quidax. Period is in MINUTES.
 * Common values: 1, 5, 15, 60, 240 (4h), 1440 (1d).
 */
export async function getCandles(market: string, periodMinutes = 1440, limit = 30): Promise<Candle[]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  try {
    const res = await fetch(QUIDAX_KLINE(market, periodMinutes, limit), {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`Upstream ${res.status}`)
    const json = (await res.json()) as { data: unknown[] }
    const rows = Array.isArray(json?.data) ? json.data : []
    return rows
      .map((row) => {
        if (!Array.isArray(row) || row.length < 6) return null
        return {
          t: num(row[0]) * 1000,
          open: num(row[1]),
          high: num(row[2]),
          low: num(row[3]),
          close: num(row[4]),
          volume: num(row[5]),
        } as Candle
      })
      .filter((c): c is Candle => c !== null && c.close > 0)
  } catch {
    return []
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Synthetic fallback if K-line is unavailable. Deterministic per market.
 */
export function buildSyntheticSeries(
  market: string,
  endValue: number,
  days = 30,
): { day: string; price: number; volume: number }[] {
  let seed = 0
  for (const c of market) seed = (seed * 31 + c.charCodeAt(0)) >>> 0
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return (seed & 0xffffffff) / 0xffffffff
  }
  const start = endValue * (0.92 + rand() * 0.05)
  const points: { day: string; price: number; volume: number }[] = []
  let price = start
  const drift = (endValue - start) / days
  for (let i = 0; i < days; i++) {
    const noise = (rand() - 0.5) * endValue * 0.012
    price = price + drift + noise
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    points.push({
      day: d.toISOString().slice(5, 10),
      price: Math.max(0, price),
      volume: Math.round((0.6 + rand() * 0.8) * endValue * 0.0008),
    })
  }
  points[points.length - 1].price = endValue
  return points
}

/**
 * Convert real candles to the chart shape used by the stablecoin chart.
 */
export function candlesToSeries(candles: Candle[]): { day: string; price: number; volume: number }[] {
  return candles.map((c) => ({
    day: new Date(c.t).toISOString().slice(5, 10),
    price: c.close,
    volume: Math.round(c.volume),
  }))
}
