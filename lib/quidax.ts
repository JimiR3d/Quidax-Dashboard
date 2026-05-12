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
// real Quidax data observed Nov 2025 so the dashboard always renders sanely.
const SIMULATED: MarketTicker[] = [
  { market: "usdtngn", base: "USDT", quote: "NGN", last: 1380.41, open: 1382.29, high: 1399.17, low: 1372.79, volume: 42_643, changePct: -0.14, timestamp: Date.now() },
  { market: "cngnngn", base: "CNGN", quote: "NGN", last: 1.0, open: 1.0, high: 1.0, low: 1.0, volume: 9_400_000, changePct: 0.0, timestamp: Date.now() },
  { market: "btcngn", base: "BTC", quote: "NGN", last: 111_061_754, open: 112_850_740, high: 113_174_097, low: 109_978_144, volume: 0.57, changePct: -1.58, timestamp: Date.now() },
  { market: "ethngn", base: "ETH", quote: "NGN", last: 3_156_589, open: 3_220_870, high: 3_236_060, low: 3_116_234, volume: 36.7, changePct: -2.00, timestamp: Date.now() },
  { market: "xrpngn", base: "XRP", quote: "NGN", last: 1_983.91, open: 2_028.97, high: 2_044.89, low: 1_958.81, volume: 13_491, changePct: -2.22, timestamp: Date.now() },
  { market: "trxngn", base: "TRX", quote: "NGN", last: 412, open: 408, high: 415, low: 406, volume: 1_240_000, changePct: 0.98, timestamp: Date.now() },
  { market: "ltcngn", base: "LTC", quote: "NGN", last: 79_619, open: 81_120, high: 81_368, low: 78_820, volume: 34.6, changePct: -1.85, timestamp: Date.now() },
  { market: "dashngn", base: "DASH", quote: "NGN", last: 63_562, open: 64_706, high: 65_264, low: 62_142, volume: 7.57, changePct: -1.77, timestamp: Date.now() },
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
  try {
    const res = await fetch(QUIDAX_TICKERS_URL, {
      ...(opts?.noCache ? { cache: "no-store" as const } : { next: { revalidate: 15 } }),
      headers: { Accept: "application/json" },
    })
    if (!res.ok) throw new Error(`Upstream ${res.status}`)
    const json = await res.json()
    const tickers = normalize(json)
    if (tickers.length === 0) throw new Error("Empty normalization")
    return { source: "live", fetchedAt: new Date().toISOString(), tickers }
  } catch {
    return { source: "simulated", fetchedAt: new Date().toISOString(), tickers: SIMULATED }
  }
}

/**
 * Fetch real OHLCV candles from Quidax. Period is in MINUTES.
 * Common values: 1, 5, 15, 60, 240 (4h), 1440 (1d).
 */
export async function getCandles(market: string, periodMinutes = 1440, limit = 30): Promise<Candle[]> {
  try {
    const res = await fetch(QUIDAX_KLINE(market, periodMinutes, limit), {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
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
