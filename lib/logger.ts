/**
 * Structured logger + generic alert sink.
 *
 * Why this exists:
 *   - Before: ad-hoc `console.error("[quidax] ...", err)` calls scattered
 *     across lib/. Searchable in Vercel's rolling buffer, invisible
 *     anywhere else, and impossible to alert on.
 *   - After: every log line is a single JSON object with a stable shape, so
 *     a log drain (Better Stack, Axiom, Datadog, Logflare, anything that
 *     ingests Vercel stdout) can index and query it. Critical events
 *     additionally fire a webhook for the on-call channel.
 *
 * Drain wiring:
 *   - Vercel stdout is the default sink — every JSON line printed here
 *     ships to whichever drain is connected to the project. No SDK lock-in.
 *   - For "page someone" events we POST to `ALERT_WEBHOOK_URL`. The payload
 *     is shaped like a Slack/Discord-compatible incoming webhook (a single
 *     `text` field plus the structured payload), which both providers
 *     accept verbatim and Better Stack accepts via its generic webhook.
 *
 * Hard rules:
 *   - Never throw from a logger. A broken sink must not break the request.
 *   - Never log secrets, full headers, or full request bodies.
 *   - Alerts are best-effort and fire-and-forget; we do NOT await them
 *     inside the request path.
 */

export type LogLevel = "info" | "warn" | "error"

export type LogFields = Record<string, unknown>

type LogLine = {
  ts: string
  level: LogLevel
  msg: string
  service: "quidax-dashboard"
  env: string
  region?: string
} & LogFields

const SERVICE = "quidax-dashboard"

function envName(): string {
  return (
    process.env.VERCEL_ENV ??
    process.env.NODE_ENV ??
    "development"
  )
}

function region(): string | undefined {
  return process.env.VERCEL_REGION
}

function emit(level: LogLevel, msg: string, fields: LogFields = {}): void {
  const line: LogLine = {
    ts: new Date().toISOString(),
    level,
    msg,
    service: SERVICE,
    env: envName(),
    region: region(),
    ...fields,
  }
  const json = JSON.stringify(line)
  // Use the matching console method so Vercel's level inference is correct.
  if (level === "error") {
    console.error(json)
  } else if (level === "warn") {
    console.warn(json)
  } else {
    console.log(json)
  }
}

export const log = {
  info(msg: string, fields?: LogFields) {
    emit("info", msg, fields)
  },
  warn(msg: string, fields?: LogFields) {
    emit("warn", msg, fields)
  },
  error(msg: string, fields?: LogFields) {
    emit("error", msg, fields)
  },
}

// ---------------------------------------------------------------------------
// Alert webhook (best-effort, fire-and-forget)
// ---------------------------------------------------------------------------

/**
 * In-process dedupe so a sustained outage doesn't blast the webhook every
 * 10 seconds. One alert per (key) per ALERT_DEDUPE_MS window per instance.
 */
const ALERT_DEDUPE_MS = 5 * 60_000
const lastAlertAt = new Map<string, number>()

function shouldFire(key: string): boolean {
  const now = Date.now()
  const prev = lastAlertAt.get(key)
  if (prev && now - prev < ALERT_DEDUPE_MS) return false
  lastAlertAt.set(key, now)
  return true
}

export type AlertSeverity = "warning" | "critical"

export type AlertInput = {
  /** Stable identifier used for in-process dedupe. e.g. "markets:source-empty". */
  key: string
  severity: AlertSeverity
  /** Human-readable headline. Will be the `text` field of the webhook payload. */
  title: string
  fields?: LogFields
}

/**
 * Fire-and-forget alert. Always emits a structured `error` log line, and
 * additionally POSTs to ALERT_WEBHOOK_URL if it is configured.
 *
 * Returns immediately; the network call resolves on the global event loop.
 * Callers MUST NOT await this — it is intentionally not awaited so a slow
 * webhook can never extend a user-facing request.
 */
export function alert(input: AlertInput): void {
  const { key, severity, title, fields } = input

  // Always record the alert in the log stream, even if no webhook is set.
  log.error(`alert:${key}`, { alert: true, severity, title, ...fields })

  const url = process.env.ALERT_WEBHOOK_URL
  if (!url) return
  if (!shouldFire(key)) return

  const payload = {
    // Compatible with Slack & Discord incoming webhooks AND Better Stack's
    // generic webhook integration. Slack/Discord render `text`; Better Stack
    // and other JSON-ingesters keep the full structured body.
    text: `[${severity.toUpperCase()}] ${title}`,
    severity,
    service: SERVICE,
    env: envName(),
    region: region(),
    key,
    title,
    fields: fields ?? {},
    ts: new Date().toISOString(),
  }

  // Fire-and-forget. AbortController gives us a hard ceiling on the
  // outbound request so a hung webhook can't pin a serverless instance.
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2_000)
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      // Edge runtime: keepalive lets the request outlive the function.
      keepalive: true,
    })
      .catch((err) => {
        // Logger must never throw. Webhook failure becomes a normal log line.
        console.error(
          JSON.stringify({
            ts: new Date().toISOString(),
            level: "error",
            msg: "alert.webhook_failed",
            service: SERVICE,
            env: envName(),
            key,
            error: err instanceof Error ? err.message : String(err),
          }),
        )
      })
      .finally(() => clearTimeout(timer))
  } catch (err) {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "error",
        msg: "alert.dispatch_threw",
        service: SERVICE,
        env: envName(),
        key,
        error: err instanceof Error ? err.message : String(err),
      }),
    )
  }
}

/**
 * Convenience: fire an alert iff a market snapshot is fully empty (we have
 * no cache AND upstream is unreachable). Called from /api/markets.
 *
 * Dedupe key includes the env so a staging blip doesn't suppress a prod
 * alert.
 */
export function maybeAlertOnEmptySnapshot(source: string): void {
  if (source !== "empty") return
  alert({
    key: `markets:source-empty:${envName()}`,
    severity: "critical",
    title: "Quidax dashboard: no live data and no LKG cache",
    fields: {
      reason: "source_empty",
      hint: "Upstream Quidax unreachable AND in-memory LKG was empty (cold instance).",
    },
  })
}
