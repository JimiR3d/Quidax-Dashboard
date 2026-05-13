import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { getMarketSnapshot } from "@/lib/quidax"
import { rateLimit } from "@/lib/cache"

/**
 * /api/markets — public, read-only snapshot endpoint consumed by the
 * proof-strip on the dashboard.
 *
 * Hardening notes:
 *   - Edge CDN caches for 10s (s-maxage) with a 30s stale-while-revalidate.
 *     One viewer can hit this many times; only one survives to the function.
 *   - Inside the function, getMarketSnapshot has its own 10s in-memory cache
 *     (lib/cache.ts) shared across all viewers of a single instance. So
 *     even on a cold CDN miss spike, the upstream is hit at most ~6×/min.
 *   - Per-IP sliding-window rate limit (6 req/10s/IP) prevents one client
 *     from blowing through the cache.
 *   - On total upstream failure we return the snapshot with `source:"empty"`
 *     and HTTP 200 — the UI knows how to render a labelled empty state.
 *     We do NOT pretend the values are live.
 */

export const dynamic = "force-dynamic"
export const revalidate = 0

const RL = { windowMs: 10_000, max: 6 }

function clientIp(h: Headers): string {
  const xf = h.get("x-forwarded-for")
  if (xf) return xf.split(",")[0].trim()
  return h.get("x-real-ip") ?? "anon"
}

/**
 * Explicit OPTIONS: we deliberately do NOT advertise any cross-origin allowance.
 * Browsers calling from a different origin get a 405; rate-limited fetchers
 * (curl, server-to-server) can still GET — they bypass CORS but are throttled.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 405,
    headers: { Allow: "GET", "Cache-Control": "no-store" },
  })
}

export async function GET() {
  const h = await headers()
  const ip = clientIp(h)
  const rl = rateLimit(`markets:${ip}`, RL)
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfterMs: rl.retryAfterMs },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      },
    )
  }

  const snapshot = await getMarketSnapshot()
  return NextResponse.json(snapshot, {
    headers: {
      // Edge CDN: serve for 10s, then revalidate while serving stale for 30s.
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      "X-RateLimit-Remaining": String(rl.remaining),
      "X-Snapshot-Source": snapshot.source,
      ...(snapshot.fetchedAt ? { "X-Snapshot-FetchedAt": snapshot.fetchedAt } : {}),
    },
  })
}
