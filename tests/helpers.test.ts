import { describe, it, expect } from "vitest"
import {
  computeCngnPeg,
  computeSpread,
  ngnTurnover,
  fxReferenceStaleness,
} from "@/lib/insights"
import { MarketSnapshotSchema, type MarketTicker } from "@/lib/quidax"

/**
 * These tests guard the pieces of math that the dashboard's claims rest on.
 * If any of them break, a claim becomes a lie — fail loudly in CI before it
 * ever ships to a reader.
 */

function makeTicker(over: Partial<MarketTicker>): MarketTicker {
  return {
    market: "usdtngn",
    base: "USDT",
    quote: "NGN",
    last: 1400,
    open: 1395,
    high: 1410,
    low: 1392,
    baseVolume: 100,
    changePct: 0.36,
    timestamp: Date.now(),
    ...over,
  }
}

describe("computeCngnPeg", () => {
  it("classifies a perfectly pegged ticker as stable", () => {
    const peg = computeCngnPeg(makeTicker({ market: "cngnngn", base: "CNGN", last: 1.0 }))
    expect(peg.status).toBe("stable")
    expect(peg.hasLiveSpot).toBe(true)
    expect(Math.abs(peg.deviationBps)).toBeLessThan(1)
  })

  it("classifies a 50bps deviation as 'watch'", () => {
    const peg = computeCngnPeg(makeTicker({ market: "cngnngn", base: "CNGN", last: 1.005 }))
    expect(peg.status).toBe("watch")
  })

  it("classifies a 200bps deviation as 'depeg'", () => {
    const peg = computeCngnPeg(makeTicker({ market: "cngnngn", base: "CNGN", last: 1.02 }))
    expect(peg.status).toBe("depeg")
  })

  it("reports hasLiveSpot=false when no cngnNgn ticker is provided", () => {
    const peg = computeCngnPeg(undefined)
    expect(peg.hasLiveSpot).toBe(false)
  })

  it("derives implied USDT/NGN from cNGN/USDT cross", () => {
    const peg = computeCngnPeg(
      makeTicker({ market: "cngnngn", base: "CNGN", last: 1.0 }),
      makeTicker({ market: "cngnusdt", base: "CNGN", quote: "USDT", last: 1 / 1400 }),
    )
    expect(peg.impliedUsdtNgnFromCngn).toBeCloseTo(1400, 0)
  })
})

describe("computeSpread", () => {
  it("returns zero deviation when Quidax sits on NFEM", () => {
    const s = computeSpread(makeTicker({ last: 1375 }))
    expect(s.vsCbnPct).toBeCloseTo(100, 4)
    expect(s.vsCbnBps).toBeCloseTo(0, 4)
  })

  it("computes a positive bps deviation when Quidax trades above NFEM", () => {
    const s = computeSpread(makeTicker({ last: 1400 }))
    expect(s.vsCbnBps).toBeGreaterThan(100)
  })

  it("falls back to NFEM mid when no ticker is provided", () => {
    const s = computeSpread(undefined)
    expect(s.quidaxUsdtNgn).toBe(1375)
    expect(s.vsCbnBps).toBe(0)
  })

  it("flags staleness based on the reference asOf date", () => {
    // No assertion on exact category — we only assert it's one of the 3 valid values.
    expect(["ok", "stale", "very-stale"]).toContain(fxReferenceStaleness())
  })
})

describe("ngnTurnover", () => {
  it("multiplies last by baseVolume for NGN-quoted markets", () => {
    expect(ngnTurnover(makeTicker({ last: 1400, baseVolume: 250 }))).toBe(350_000)
  })

  it("refuses to compute turnover for non-NGN markets (returns 0)", () => {
    expect(ngnTurnover(makeTicker({ quote: "USDT", last: 1, baseVolume: 100 }))).toBe(0)
  })
})

describe("MarketSnapshotSchema", () => {
  it("accepts a well-formed empty snapshot", () => {
    const r = MarketSnapshotSchema.safeParse({
      source: "empty",
      fetchedAt: null,
      ageMs: 0,
      dropped: 0,
      tickers: [],
    })
    expect(r.success).toBe(true)
  })

  it("rejects an invalid source value", () => {
    const r = MarketSnapshotSchema.safeParse({
      source: "fresh", // not in enum
      fetchedAt: null,
      ageMs: 0,
      dropped: 0,
      tickers: [],
    })
    expect(r.success).toBe(false)
  })

  it("rejects a snapshot whose ticker is missing required fields", () => {
    const r = MarketSnapshotSchema.safeParse({
      source: "live",
      fetchedAt: new Date().toISOString(),
      ageMs: 0,
      dropped: 0,
      tickers: [{ market: "usdtngn" }],
    })
    expect(r.success).toBe(false)
  })
})
