import "server-only"

/**
 * Live FX reference rates — auto-fetched from free public APIs.
 *
 * Strategy:
 *   1. Primary: open.er-api.com (free, no key, updates daily at 00:02 UTC)
 *      → gives the "official-ish" USD/NGN rate (tracks CBN NFEM closely)
 *   2. Parallel: derived as a markup over official. Historical spread between
 *      CBN NFEM and BDC/street is typically 1.5–2.5%. We use 1.8% as default.
 *      This is a modeled estimate — the street rate has no machine-readable API.
 *   3. Fallback: hardcoded values from the last manual check, clearly labelled.
 *
 * Caching: 6 hours (CBN publishes once daily, street rates are intraday but we
 *   have no live feed, so 6h is a sensible TTL).
 */

export type LiveFxReference = {
  cbnOfficial: number
  parallel: number
  asOf: string // ISO date string
  source: "live-api" | "fallback"
  /** Time the rates were fetched, for staleness checks */
  fetchedAt: number
}

/* ── Hardcoded fallback (last manual verification) ────────────────────── */
const FALLBACK: LiveFxReference = {
  cbnOfficial: 1372,
  parallel: 1397,
  asOf: "2026-05-27",
  source: "fallback",
  fetchedAt: Date.now(),
}

/**
 * Historical parallel-market markup over official CBN rate.
 * As of May 2026, the spread is ~1.5–2.5%.
 * We use 1.8% as the midpoint estimate.
 */
const PARALLEL_MARKUP = 0.018

/* ── In-memory cache ──────────────────────────────────────────────────── */
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours
let cached: LiveFxReference | null = null
let cacheTimestamp = 0

/* ── Fetch logic ──────────────────────────────────────────────────────── */

async function fetchFromOpenErApi(): Promise<{ rate: number; date: string } | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 21600 }, // 6h Next.js cache
    })
    if (!res.ok) return null
    const data = await res.json()
    const ngn = data?.rates?.NGN
    if (typeof ngn !== "number" || ngn <= 0) return null

    // The API returns time_last_update_utc like "Mon, 18 May 2026 00:02:31 +0000"
    const dateStr = data.time_last_update_utc
      ? new Date(data.time_last_update_utc).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)

    return { rate: ngn, date: dateStr }
  } catch {
    return null
  }
}

/**
 * Backup: fawazahmed0's free currency API (GitHub-hosted CDN).
 * Different data provider = different failure mode.
 */
async function fetchFromFawazApi(): Promise<{ rate: number; date: string } | null> {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
      { signal: AbortSignal.timeout(5000) },
    )
    if (!res.ok) return null
    const data = await res.json()
    const ngn = data?.usd?.ngn
    if (typeof ngn !== "number" || ngn <= 0) return null
    const dateStr = data.date ?? new Date().toISOString().slice(0, 10)
    return { rate: ngn, date: dateStr }
  } catch {
    return null
  }
}

/**
 * Get live FX reference rates. Uses in-memory cache with 6h TTL.
 * Falls back to hardcoded values if both APIs fail.
 */
export async function getLiveFxRates(): Promise<LiveFxReference> {
  const now = Date.now()

  // Return cache if still fresh
  if (cached && now - cacheTimestamp < CACHE_TTL_MS) {
    return cached
  }

  // Try primary API
  let result = await fetchFromOpenErApi()

  // Try backup if primary fails
  if (!result) {
    result = await fetchFromFawazApi()
  }

  // If we got a rate, build the reference
  if (result) {
    const official = Math.round(result.rate * 100) / 100
    // Parallel = official × (1 + markup), rounded
    const parallel = Math.round(official * (1 + PARALLEL_MARKUP) * 100) / 100

    const live: LiveFxReference = {
      cbnOfficial: official,
      parallel,
      asOf: result.date,
      source: "live-api",
      fetchedAt: now,
    }
    cached = live
    cacheTimestamp = now
    return live
  }

  // Both APIs failed — use fallback
  console.warn("[fx-rates] All FX APIs failed, using hardcoded fallback")
  return FALLBACK
}
