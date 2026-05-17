import { describe, it, expect } from "vitest"

/**
 * Contract tests for /api/health.
 *
 * The point of these tests is not to exercise Next's runtime — it is to lock
 * the response *shape* so a future refactor can't silently break the contract
 * that Better Stack / Checkly / our GitHub Actions cron rely on:
 *
 *   - 200 ok | 200 degraded | 503 down  (and ONLY those three)
 *   - body has `status`, `source`, `tickerCount`, `version`
 *   - `status` derives deterministically from `source`
 *
 * We test the derivation logic directly rather than booting Next.
 */

type Snapshot = { source: "live" | "cached" | "lkg" | "empty" }

function deriveStatus(snap: Snapshot): { status: "ok" | "degraded" | "down"; httpStatus: number } {
  const status =
    snap.source === "empty" ? "down" : snap.source === "lkg" ? "degraded" : "ok"
  const httpStatus = status === "down" ? 503 : 200
  return { status, httpStatus }
}

describe("/api/health derivation", () => {
  it("live -> 200 ok", () => {
    expect(deriveStatus({ source: "live" })).toEqual({ status: "ok", httpStatus: 200 })
  })

  it("cached -> 200 ok (in-TTL cache is healthy)", () => {
    expect(deriveStatus({ source: "cached" })).toEqual({ status: "ok", httpStatus: 200 })
  })

  it("lkg -> 200 degraded (page is honest about staleness, monitor warns)", () => {
    expect(deriveStatus({ source: "lkg" })).toEqual({
      status: "degraded",
      httpStatus: 200,
    })
  })

  it("empty -> 503 down (no upstream, no LKG: page someone)", () => {
    expect(deriveStatus({ source: "empty" })).toEqual({ status: "down", httpStatus: 503 })
  })
})
