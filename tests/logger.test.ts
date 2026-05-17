import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { log, alert } from "@/lib/logger"

/**
 * Logger contract tests.
 *
 * These guard the JSON shape that downstream log drains parse, and the
 * fire-and-forget semantics of the alert sink. If we break either contract
 * a real log drain breaks silently in prod — fail in CI instead.
 */

describe("log()", () => {
  let infoSpy: ReturnType<typeof vi.spyOn>
  let warnSpy: ReturnType<typeof vi.spyOn>
  let errSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    infoSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("emits a single JSON line with the expected fields", () => {
    log.info("test.event", { foo: 1 })
    expect(infoSpy).toHaveBeenCalledTimes(1)
    const line = JSON.parse(infoSpy.mock.calls[0][0] as string)
    expect(line).toMatchObject({
      level: "info",
      msg: "test.event",
      service: "quidax-dashboard",
      foo: 1,
    })
    expect(typeof line.ts).toBe("string")
    expect(() => new Date(line.ts).toISOString()).not.toThrow()
  })

  it("routes warn and error to the matching console method", () => {
    log.warn("warn.event")
    log.error("err.event")
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(errSpy).toHaveBeenCalledTimes(1)
  })
})

describe("alert()", () => {
  let errSpy: ReturnType<typeof vi.spyOn>
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    // Stub fetch so we can assert dispatch without making a real call.
    fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response(null, { status: 200 }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete process.env.ALERT_WEBHOOK_URL
  })

  it("always logs an error line, even with no webhook configured", () => {
    delete process.env.ALERT_WEBHOOK_URL
    alert({ key: "test:no-webhook:" + Date.now(), severity: "critical", title: "x" })
    expect(errSpy).toHaveBeenCalled()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("POSTs to ALERT_WEBHOOK_URL when configured (fire-and-forget)", async () => {
    process.env.ALERT_WEBHOOK_URL = "https://example.invalid/hook"
    alert({
      key: "test:webhook:" + Date.now(),
      severity: "critical",
      title: "outage",
      fields: { reason: "test" },
    })
    // alert() returns synchronously; the fetch is scheduled. Yield once.
    await new Promise((r) => setTimeout(r, 0))
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe("https://example.invalid/hook")
    const body = JSON.parse((init as RequestInit).body as string)
    expect(body).toMatchObject({
      severity: "critical",
      title: "outage",
      service: "quidax-dashboard",
      fields: { reason: "test" },
    })
    expect(body.text).toContain("[CRITICAL]")
  })

  it("dedupes repeat alerts with the same key inside the dedupe window", async () => {
    process.env.ALERT_WEBHOOK_URL = "https://example.invalid/hook"
    const key = "test:dedupe:" + Date.now()
    alert({ key, severity: "warning", title: "first" })
    alert({ key, severity: "warning", title: "second" })
    await new Promise((r) => setTimeout(r, 0))
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })
})
