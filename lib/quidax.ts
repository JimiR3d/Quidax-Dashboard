/**
 * Quidax public market data client.
 *
 * Fetches live tickers from the public Quidax markets endpoint on the server
 * (with ISR-style revalidation). Falls back to a high-fidelity simulated
 * snapshot if the upstream is unavailable, so the dashboard always renders.
 *
 * Public docs reference: https://docs.quidax.io/
 * Verified live endpoint: https://app.quidax.io/api/v1/markets/tickers
 */

export type MarketTicker = {
  market: string // e.g. "btcngn"
  base: string // e.g. "BTC"
  quote: string // e.g. "NGN"
  last: number
  open: number
  high: number
  low: number
  volume: number // base volume (e.g. BTC)
  changePct: number
  timestamp: number
}

export type MarketSnapshot = {
  source: "live" | "simulated"
  fetchedAt: string
  tickers: MarketTicker[]
}

const QUIDAX_TICKERS_URL = "https://app.quidax.io/api/v1/markets/tickers"

// Plausible snapshot used when the upstream is unreachable. Numbers reflect
// late-2025 Nigerian market conditions and exist purely so the dashboard
// always renders something readable.
const SIMULATED: MarketTicker[] = [
  {
    market: "usdtngn",
    base: "USDT",
    quote: "NGN",
    last: 1685.5,
    open: 1672.0,
    high: 1692.0,
    low: 1668.0,
    volume: 4_820_000,
    changePct: 0.81,
    timestamp: Date.now(),
  },
  {
    market: "cngnngn",
    base: "cNGN",
    quote: "NGN",
    last: 1.0,
    open: 1.0,
    high: 1.0,
    low: 1.0,
    volume: 9_400_000,
    changePct: 0.0,
    timestamp: Date.now(),
  },
  {
    market: "btcngn",
    base: "BTC",
    quote: "NGN",
    last: 111_166_267,
    open: 112_797_906,
    high: 113_466_135,
    low: 109_978_144,
    volume: 0.57,
    changePct: -1.45,
    timestamp: Date.now(),
  },
  {
    market: "ethngn",
    base: "ETH",
    quote: "NGN",
    last: 3_186_147,
    open: 3_216_536,
    high: 3_236_060,
    low: 3_116_234,
    volume: 4.2,
    changePct: -0.94,
    timestamp: Date.now(),
  },
  {
    market: "xrpngn",
    base: "XRP",
    quote: "NGN",
    last: 3_240,
    open: 3_210,
    high: 3_280,
    low: 3_180,
    volume: 184_000,
    changePct: 0.93,
    timestamp: Date.now(),
  },
  {
    market: "trxngn",
    base: "TRX",
    quote: "NGN",
    last: 412,
    open: 408,
    high: 415,
    low: 406,
    volume: 1_240_000,
    changePct: 0.98,
    timestamp: Date.now(),
  },
  {
    market: "ltcngn",
    base: "LTC",
    quote: "NGN",
    last: 165_400,
    open: 168_200,
    high: 170_100,
    low: 163_900,
    volume: 28,
    changePct: -1.66,
    timestamp: Date.now(),
  },
  {
    market: "dashngn",
    base: "DASH",
    quote: "NGN",
    last: 38_200,
    open: 38_400,
    high: 38_900,
    low: 37_950,
    volume: 84,
    changePct: -0.52,
    timestamp: Date.now(),
  },
]

function normalize(raw: unknown): MarketTicker[] {
  // Quidax shape: { data: { btcngn: { ticker: { last, open, high, low, vol, ... }, at: ... } } }
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
    // Filter dead / disabled markets that report all-zero ticks.
    if (last <= 0 || open <= 0) continue

    const m = market.toLowerCase()
    // quote inference
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

function num(x: unknown): number {
  if (typeof x === "number") return x
  if (typeof x === "string") {
    const n = Number(x)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

export async function getMarketSnapshot(): Promise<MarketSnapshot> {
  try {
    const res = await fetch(QUIDAX_TICKERS_URL, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    })
    if (!res.ok) throw new Error(`Upstream ${res.status}`)
    const json = await res.json()
    const tickers = normalize(json)
    if (tickers.length === 0) throw new Error("Empty normalization")
    return {
      source: "live",
      fetchedAt: new Date().toISOString(),
      tickers,
    }
  } catch {
    return {
      source: "simulated",
      fetchedAt: new Date().toISOString(),
      tickers: SIMULATED,
    }
  }
}

// Build a synthetic 30-day price/volume series for a given ticker. Used for
// trend charts when the upstream history endpoint is unavailable. Deterministic
// per market so the dashboard is stable between renders.
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
  // Pin last point to endValue for accuracy
  points[points.length - 1].price = endValue
  return points
}
