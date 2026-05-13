/**
 * Quidax public market data client.
 *
 * Public endpoints (no auth required):
 *   - GET https://app.quidax.io/api/v1/markets             — list all markets
 *   - GET https://app.quidax.io/api/v1/markets/tickers     — all tickers
 *   - GET https://app.quidax.io/api/v1/markets/:id/k       — K-line candles
 *
 * Verified against: https://docs.quidax.io/
 *
 * Production hardening (vs the original):
 *   - Zod validates the upstream payload BEFORE we touch it. Schema drift now
 *     surfaces as a structured log + an empty snapshot, not silent corruption.
 *   - getMarketSnapshot is wrapped in a cross-viewer cache (lib/cache.ts).
 *     Upstream is hit at most once per TTL window per function instance,
 *     regardless of viewer count. Single-flight prevents stampedes.
 *   - Retry with full-jitter exponential backoff on transient failures.
 *   - On total upstream failure: serve the Last-Known-Good snapshot with an
 *     accurate `fetchedAt` from the last success. NO hard-coded fake prices.
 *   - Snapshot now carries `source`, `ageMs`, and `dropped` so the UI can
 *     truthfully degrade.
 */

import { z } from "zod"
import { getCachedOrFetch, retry } from "./cache"

export type MarketTicker = {
  market: string // "btcngn"
  base: string // "BTC"
  quote: string // "NGN"
  last: number
  open: number
  high: number
  low: number
  /**
   * Base-asset volume over the rolling 24h window.
   * Quidax's public ticker `vol` field is documented as base volume on
   * https://docs.quidax.io/. We persist it under an explicit name so any
   * downstream NGN-turnover math (last * baseVolume) is unambiguous.
   */
  baseVolume: number
  changePct: number
  timestamp: number
}

export type SnapshotSource = "live" | "cached" | "lkg" | "empty"

export type MarketSnapshot = {
  /** live = fresh fetch; cached = within TTL; lkg = upstream failed, last-known-good; empty = nothing to show */
  source: SnapshotSource
  /** ISO timestamp of the last SUCCESSFUL upstream fetch this snapshot represents */
  fetchedAt: string | null
  /** Milliseconds since `fetchedAt`. Lets the UI compute staleness without re-parsing. */
  ageMs: number
  /** Number of malformed ticker rows dropped by the validator. */
  dropped: number
  tickers: MarketTicker[]
}

export type Candle = {
  t: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

const QUIDAX_TICKERS_URL = "https://app.quidax.io/api/v1/markets/tickers"
const QUIDAX_KLINE = (market: string, period: number, limit: number) =>
  `https://app.quidax.io/api/v1/markets/${market}/k?period=${period}&limit=${limit}`

// TTL for the in-memory cache. With this set to 10s a single function
// instance hits Quidax at most 6 times/minute, regardless of viewer count.
const TICKERS_TTL_MS = 10_000
const CANDLES_TTL_MS = 5 * 60_000

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

// Tickers payload tolerates string-or-number for every numeric field because
// Quidax has historically been inconsistent. We coerce explicitly.
const NumLike = z.union([z.number(), z.string()]).transform((v) => {
  const n = typeof v === "number" ? v : Number(v)
  return Number.isFinite(n) ? n : 0
})

const TickerInner = z
  .object({
    last: NumLike.optional(),
    open: NumLike.optional(),
    high: NumLike.optional(),
    low: NumLike.optional(),
    vol: NumLike.optional(),
    volume: NumLike.optional(),
  })
  .passthrough()

const TickerEntry = z
  .object({
    ticker: TickerInner.optional(),
  })
  .passthrough()
  .or(TickerInner)

const TickersPayload = z
  .object({
    data: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()
  .or(z.record(z.string(), z.unknown()))

const KlineRow = z.tuple([NumLike, NumLike, NumLike, NumLike, NumLike, NumLike])
const KlinePayload = z
  .object({
    data: z.array(z.unknown()),
  })
  .passthrough()

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

function parseQuotePair(marketId: string): { base: string; quote: string } {
  const m = marketId.toLowerCase()
  if (m.endsWith("ngn")) return { base: m.slice(0, -3).toUpperCase(), quote: "NGN" }
  if (m.endsWith("usdt")) return { base: m.slice(0, -4).toUpperCase(), quote: "USDT" }
  if (m.endsWith("usd")) return { base: m.slice(0, -3).toUpperCase(), quote: "USD" }
  if (m.endsWith("btc")) return { base: m.slice(0, -3).toUpperCase(), quote: "BTC" }
  return { base: m.toUpperCase(), quote: "USD" }
}

type NormalizationResult = {
  tickers: MarketTicker[]
  dropped: number
}

function normalizeTickers(raw: unknown): NormalizationResult {
  const top = TickersPayload.safeParse(raw)
  if (!top.success) {
    console.error("[quidax] tickers: top-level schema rejected", {
      issues: top.error.issues.slice(0, 3),
    })
    return { tickers: [], dropped: 0 }
  }

  const root = top.data as Record<string, unknown>
  const data = ((root.data ?? root) as Record<string, unknown>) ?? {}
  if (typeof data !== "object" || data === null) return { tickers: [], dropped: 0 }

  const out: MarketTicker[] = []
  let dropped = 0
  for (const [marketId, value] of Object.entries(data)) {
    const parsed = TickerEntry.safeParse(value)
    if (!parsed.success) {
      dropped += 1
      continue
    }
    const v = parsed.data as { ticker?: z.infer<typeof TickerInner> } & z.infer<typeof TickerInner>
    const t = ("ticker" in v && v.ticker ? v.ticker : v) as z.infer<typeof TickerInner>
    const last = t.last ?? 0
    const open = t.open ?? 0
    const high = t.high ?? last
    const low = t.low ?? last
    const baseVolume = t.vol ?? t.volume ?? 0
    if (last <= 0 || open <= 0) {
      dropped += 1
      continue
    }
    const { base, quote } = parseQuotePair(marketId)
    out.push({
      market: marketId.toLowerCase(),
      base,
      quote,
      last,
      open,
      high,
      low,
      baseVolume,
      changePct: ((last - open) / open) * 100,
      timestamp: Date.now(),
    })
  }
  return { tickers: out, dropped }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

async function fetchTickersRaw(opts: { signal?: AbortSignal }): Promise<unknown> {
  const res = await fetch(QUIDAX_TICKERS_URL, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: opts.signal,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    console.error("[quidax] tickers upstream non-2xx", {
      status: res.status,
      body: text.slice(0, 200),
    })
    throw new Error(`Quidax tickers ${res.status}`)
  }
  return res.json()
}

/**
 * Fetch a fresh snapshot or return whatever we have cached.
 *
 * Behavior matrix:
 *   - cache hot within TTL          -> source="cached", fetchedAt = last success
 *   - cache cold, upstream succeeds -> source="live",  fetchedAt = now
 *   - cache cold, upstream fails    -> source="lkg" if we have one (with real
 *                                       fetchedAt of last success), else "empty"
 */
export async function getMarketSnapshot(_opts?: {
  noCache?: boolean
}): Promise<MarketSnapshot> {
  try {
    const result = await getCachedOrFetch(
      "quidax:tickers",
      async () => {
        const raw = await retry(
          () => {
            const controller = new AbortController()
            const timer = setTimeout(() => controller.abort(), 5_000)
            return fetchTickersRaw({ signal: controller.signal }).finally(() =>
              clearTimeout(timer),
            )
          },
          { attempts: 3, baseMs: 250, capMs: 1_500 },
        )
        const { tickers, dropped } = normalizeTickers(raw)
        if (tickers.length === 0) {
          // Treat empty-after-normalize as a failure so LKG kicks in.
          throw new Error("Quidax tickers normalized to empty set")
        }
        const snap: MarketSnapshot = {
          source: "live",
          fetchedAt: new Date().toISOString(),
          ageMs: 0,
          dropped,
          tickers,
        }
        return snap
      },
      TICKERS_TTL_MS,
    )
    const snap = result.value
    // Map cache `source` onto snapshot.source while preserving the original
    // `fetchedAt` from the last successful upstream call.
    if (result.source === "fresh") {
      return { ...snap, source: "live", ageMs: 0 }
    }
    if (result.source === "hot") {
      return { ...snap, source: "cached", ageMs: result.ageMs }
    }
    // result.source === "lkg"
    return { ...snap, source: "lkg", ageMs: result.ageMs }
  } catch (err) {
    console.error("[quidax] no cache available, returning empty snapshot", err)
    return {
      source: "empty",
      fetchedAt: null,
      ageMs: 0,
      dropped: 0,
      tickers: [],
    }
  }
}

/**
 * Fetch real OHLCV candles from Quidax. Period is in MINUTES.
 * Common values: 1, 5, 15, 60, 240 (4h), 1440 (1d).
 *
 * Cached per (market, period, limit). Returns [] on persistent failure;
 * the caller is responsible for labelling the empty state.
 */
export async function getCandles(
  market: string,
  periodMinutes = 1440,
  limit = 30,
): Promise<Candle[]> {
  try {
    const result = await getCachedOrFetch(
      `quidax:k:${market}:${periodMinutes}:${limit}`,
      async () => {
        const raw = await retry(
          () => {
            const controller = new AbortController()
            const timer = setTimeout(() => controller.abort(), 5_000)
            return fetch(QUIDAX_KLINE(market, periodMinutes, limit), {
              cache: "no-store",
              headers: { Accept: "application/json" },
              signal: controller.signal,
            })
              .then(async (res) => {
                if (!res.ok) {
                  const text = await res.text().catch(() => "")
                  console.error("[quidax] k-line upstream non-2xx", {
                    market,
                    status: res.status,
                    body: text.slice(0, 200),
                  })
                  throw new Error(`Quidax k-line ${res.status}`)
                }
                return res.json()
              })
              .finally(() => clearTimeout(timer))
          },
          { attempts: 2, baseMs: 250, capMs: 1_500 },
        )
        const parsed = KlinePayload.safeParse(raw)
        if (!parsed.success) {
          console.error("[quidax] k-line schema rejected", {
            market,
            issues: parsed.error.issues.slice(0, 3),
          })
          return [] as Candle[]
        }
        const out: Candle[] = []
        for (const row of parsed.data.data) {
          const r = KlineRow.safeParse(row)
          if (!r.success) continue
          const [t, open, high, low, close, volume] = r.data
          if (close <= 0) continue
          out.push({ t: t * 1000, open, high, low, close, volume })
        }
        return out
      },
      CANDLES_TTL_MS,
    )
    return result.value
  } catch {
    return []
  }
}

/**
 * Synthetic fallback for the chart when K-line is unavailable. Deterministic
 * per market so we never animate fake variance over reloads. The UI MUST
 * label any series built this way as synthetic — see StablecoinDeepDive.
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
export function candlesToSeries(
  candles: Candle[],
): { day: string; price: number; volume: number }[] {
  return candles.map((c) => ({
    day: new Date(c.t).toISOString().slice(5, 10),
    price: c.close,
    volume: Math.round(c.volume),
  }))
}

// ---------------------------------------------------------------------------
// Re-exports of the snapshot Zod schema for the route handler & tests.
// ---------------------------------------------------------------------------

export const MarketTickerSchema = z.object({
  market: z.string(),
  base: z.string(),
  quote: z.string(),
  last: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  baseVolume: z.number(),
  changePct: z.number(),
  timestamp: z.number(),
})

export const MarketSnapshotSchema = z.object({
  source: z.enum(["live", "cached", "lkg", "empty"]),
  fetchedAt: z.string().nullable(),
  ageMs: z.number(),
  dropped: z.number(),
  tickers: z.array(MarketTickerSchema),
})
