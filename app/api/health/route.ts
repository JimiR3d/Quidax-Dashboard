import { NextResponse } from "next/server"
import { getMarketSnapshot } from "@/lib/quidax"

/**
 * /api/health — synthetic monitor target.
 *
 * Designed for Better Stack / Checkly / UptimeRobot / GitHub Actions cron
 * to hit every 60s. Contract is intentionally narrow:
 *
 *   - HTTP 200  => the app is up AND we can serve real (or LKG) data.
 *                  Body's `status` is "ok" or "degraded".
 *   - HTTP 503  => snapshot.source is "empty" — upstream is unreachable
 *                  AND we have no last-known-good. Page someone.
 *
 * `degraded` (200) covers the `source === "lkg"` case: page is honest about
 * staleness, viewer-visible UX is intact, but the upstream has been failing
 * for at least one TTL window. Worth investigating, not worth waking
 * anyone up at 3am.
 *
 * Why a separate route instead of reusing /api/markets:
 *   - /api/markets is rate-limited per-IP. A monitor banging on it from
 *     a single IP every 60s would eventually trip 429 and look like a
 *     real outage.
 *   - /api/markets returns the full ticker array (~5–10KB). /api/health
 *     is ~200 bytes — cheap to poll.
 *   - Different SLO: /api/markets is "serve viewers"; /api/health is
 *     "is the system alive". Conflating them means one outage budget.
 *
 * Better Stack setup (paste into a new HTTP monitor):
 *   - URL:               https://<your-prod-domain>/api/health
 *   - Method:            GET
 *   - Frequency:         60s
 *   - Expected status:   200
 *   - Expected keyword:  "ok"      (treats "degraded" as a soft alert)
 *   - Recovery:          1 successful check
 *   - Region:            multi-region recommended
 *
 * See docs/MONITORING.md for the full setup guide and Checkly equivalent.
 */

export const dynamic = "force-dynamic"
export const revalidate = 0

type HealthBody = {
  status: "ok" | "degraded" | "down"
  source: "live" | "cached" | "lkg" | "empty"
  fetchedAt: string | null
  ageMs: number
  tickerCount: number
  dropped: number
  version: string
  env: string
  region: string | null
  uptimeSec: number
}

const startedAt = Date.now()

function appVersion(): string {
  // Vercel injects this in production. Locally falls back to a static label.
  return (
    process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
    process.env.NEXT_PUBLIC_APP_VERSION ??
    "dev"
  )
}

export async function GET() {
  const snap = await getMarketSnapshot()

  const status: HealthBody["status"] =
    snap.source === "empty"
      ? "down"
      : snap.source === "lkg"
        ? "degraded"
        : "ok"

  const httpStatus = status === "down" ? 503 : 200

  const body: HealthBody = {
    status,
    source: snap.source,
    fetchedAt: snap.fetchedAt,
    ageMs: snap.ageMs,
    tickerCount: snap.tickers.length,
    dropped: snap.dropped,
    version: appVersion(),
    env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    region: process.env.VERCEL_REGION ?? null,
    uptimeSec: Math.round((Date.now() - startedAt) / 1000),
  }

  return NextResponse.json(body, {
    status: httpStatus,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Health-Status": status,
      "X-Snapshot-Source": snap.source,
    },
  })
}

export async function HEAD() {
  // Cheaper variant for monitors that only care about status code.
  const snap = await getMarketSnapshot()
  const httpStatus = snap.source === "empty" ? 503 : 200
  return new NextResponse(null, {
    status: httpStatus,
    headers: {
      "Cache-Control": "no-store",
      "X-Health-Status":
        snap.source === "empty"
          ? "down"
          : snap.source === "lkg"
            ? "degraded"
            : "ok",
      "X-Snapshot-Source": snap.source,
    },
  })
}
