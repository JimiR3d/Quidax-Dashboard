# Monitoring & Alerting

This document covers the three pieces of operational instrumentation that
were captured in `RUNBOOK.md §6` as "things that would page someone if
this had a real userbase":

1. **Synthetic uptime monitor** — `/api/health` endpoint + Better Stack
2. **External log drain** — structured JSON logs + your drain of choice
3. **Alerting on `source === "empty"`** — generic webhook via `ALERT_WEBHOOK_URL`

None of this requires changes to application logic. If the env vars below
are unset, the system silently falls back to the previous behavior
(stdout-only logs, no alerts). Connecting a sink is a one-line change.

---

## 1. Synthetic uptime monitor

### Endpoint

```
GET  /api/health
HEAD /api/health
```

### Response shape

```json
{
  "status": "ok" | "degraded" | "down",
  "source": "live" | "cached" | "lkg" | "empty",
  "fetchedAt": "2026-05-17T19:42:08.123Z",
  "ageMs": 4317,
  "tickerCount": 47,
  "dropped": 0,
  "version": "a1b2c3d",
  "env": "production",
  "region": "iad1",
  "uptimeSec": 12345
}
```

### Status semantics

| HTTP | `status`    | Meaning                                                 | Page someone? |
| ---- | ----------- | ------------------------------------------------------- | ------------- |
| 200  | `ok`        | `source` is `live` or `cached`. Fully healthy.          | No            |
| 200  | `degraded`  | `source` is `lkg`. Page renders honest staleness.       | Soft warn     |
| 503  | `down`      | `source` is `empty`. No upstream + no LKG.              | **Yes**       |

`degraded` returns 200 deliberately — the page is still serving viewers
truthfully. A monitor that pages on 200/degraded is being too noisy for a
public-data dashboard. Use the keyword check (next section) to escalate
prolonged `degraded`.

### Better Stack setup

1. Better Stack → **Monitors** → **Create monitor** → **HTTP(S)**.
2. Fill in:
   - **URL:** `https://<your-prod-domain>/api/health`
   - **Check frequency:** `60 seconds`
   - **Request timeout:** `10 seconds`
   - **Regions:** at least 2 (e.g. `us-east-1`, `eu-west-1`)
   - **Expected status code:** `200`
   - **Recovery threshold:** `1 successful check`
   - **Alerts:** **after `2` failed checks** (covers a 2-minute outage
     before paging — enough to absorb a single Quidax blip).
3. **Keyword check (optional but recommended):**
   - Add a body assertion: `"status":"ok"` must be present.
   - This makes Better Stack also alert on prolonged `degraded` (200 +
     `"status":"degraded"` will fail the keyword check).
4. **Heartbeat (optional):** Better Stack also supports inbound
   heartbeats. We don't currently emit one — `/api/health` is the only
   signal.

### Checkly setup (alternative)

If Better Stack isn't an option, Checkly's API check is the equivalent:

```yaml
# checkly/api-checks/health.check.ts
import { ApiCheck, AssertionBuilder } from "checkly/constructs"

new ApiCheck("quidax-dashboard-health", {
  name: "Quidax Dashboard /api/health",
  frequency: 1, // minutes
  locations: ["us-east-1", "eu-west-1"],
  request: {
    method: "GET",
    url: "https://<your-prod-domain>/api/health",
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody("$.status").equals("ok"),
    ],
  },
})
```

### Free fallback: GitHub Actions cron

If you don't want to pay for a synthetic monitor, the same effect is
achievable for $0 via a scheduled workflow. Drop this into
`.github/workflows/uptime.yml`:

```yaml
name: uptime
on:
  schedule:
    - cron: "*/5 * * * *" # every 5 minutes (GitHub's minimum)
  workflow_dispatch:
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: |
          STATUS=$(curl -sk -o /tmp/body -w "%{http_code}" https://<your-prod-domain>/api/health)
          echo "status=$STATUS"
          cat /tmp/body
          if [ "$STATUS" -ne 200 ]; then
            echo "::error::Health endpoint returned $STATUS"
            exit 1
          fi
          grep -q '"status":"ok"' /tmp/body || {
            echo "::warning::status is not ok — degraded or down"
          }
```

Caveat: GitHub's minimum cron resolution is 5 minutes, and runs are
silently skipped during heavy queue pressure. Fine for portfolio /
pre-product; not fine for a real userbase.

---

## 2. Log drain

All server-side logs are emitted as **single-line JSON** via `lib/logger.ts`.
Every line carries:

```json
{
  "ts":      "ISO-8601",
  "level":   "info" | "warn" | "error",
  "msg":     "stable.event.name",
  "service": "quidax-dashboard",
  "env":     "production" | "preview" | "development",
  "region":  "iad1",
  ...event-specific fields
}
```

Stable event names currently in use:

| `msg`                            | Where                  | Notes                                  |
| -------------------------------- | ---------------------- | -------------------------------------- |
| `markets.served`                 | `/api/markets`         | One per successful response            |
| `quidax.tickers.upstream_non_2xx`| `lib/quidax.ts`        | Upstream non-2xx                       |
| `quidax.tickers.schema_rejected` | `lib/quidax.ts`        | Zod rejection at top level             |
| `quidax.kline.upstream_non_2xx`  | `lib/quidax.ts`        | K-line upstream non-2xx                |
| `quidax.kline.schema_rejected`   | `lib/quidax.ts`        | K-line shape change                    |
| `quidax.snapshot.empty`          | `lib/quidax.ts`        | No upstream + no LKG                   |
| `alert:<key>`                    | `lib/logger.ts#alert`  | One per fired alert                    |

### Connecting Vercel → Better Stack (Logtail)

1. Better Stack → **Sources** → **Create source** → **Vercel**.
2. Better Stack walks you through OAuthing the Vercel integration.
3. After setup, every `console.log` / `console.error` / `console.warn` from
   this project ships to Better Stack as a structured record. The JSON
   fields above become indexed columns automatically.

### Connecting Vercel → Axiom

1. Vercel project → **Settings** → **Log Drains** → **Connect** → Axiom.
2. Pick the Axiom dataset. That's it — JSON is auto-detected.

### Connecting Vercel → Logflare / Datadog / S3

Same place: **Settings** → **Log Drains** → **Add drain**. The drain
posts JSON-per-line to whatever endpoint you configure. No code change.

### What we deliberately do NOT log

- Full request headers (could include cookies / auth tokens we don't
  control — Vercel proxy headers, etc).
- Full upstream response bodies (truncated to 200 chars on non-2xx).
- Any client IP except inside the rate limiter, which keeps it in
  memory and never logs it.

---

## 3. Alerting on `source === "empty"`

When `/api/markets` returns a snapshot with `source === "empty"` — i.e.
upstream Quidax is unreachable AND we have no last-known-good cache —
the server fires a webhook to `ALERT_WEBHOOK_URL`.

### Setting `ALERT_WEBHOOK_URL`

In **Vercel → Project → Settings → Environment Variables**, add:

| Name                | Example value                                           | Scope                   |
| ------------------- | ------------------------------------------------------- | ----------------------- |
| `ALERT_WEBHOOK_URL` | `https://hooks.slack.com/services/T0.../B0.../xyz`      | Production (recommended) |

Compatible providers (no code change needed for any of these):

- **Slack** — Incoming Webhook URL.
- **Discord** — Channel webhook URL (Discord renders the `text` field).
- **Better Stack** — *Incidents* → *On-Call* → *Generic webhook* source.
- **PagerDuty** — Use the *Events API v2* generic webhook, or any
  intermediary like Zapier.

### Payload shape

```json
{
  "text": "[CRITICAL] Quidax dashboard: no live data and no LKG cache",
  "severity": "critical",
  "service": "quidax-dashboard",
  "env": "production",
  "region": "iad1",
  "key": "markets:source-empty:production",
  "title": "Quidax dashboard: no live data and no LKG cache",
  "fields": {
    "reason": "source_empty",
    "hint": "Upstream Quidax unreachable AND in-memory LKG was empty (cold instance)."
  },
  "ts": "2026-05-17T19:42:08.123Z"
}
```

### Dedupe

In-process dedupe: one alert per key per **5 minutes** per function
instance. A sustained outage produces one alert per cold-started
instance per 5min, not one per request.

For more aggressive dedupe (across instances, across regions), use the
deduplication features of your incident tool — Better Stack and
PagerDuty both have a built-in `dedup_key` concept and will collapse
the alerts using the `key` field.

### Why fire-and-forget

The webhook POST is **never awaited inside the request path**. A slow or
hung webhook cannot extend `/api/markets` latency. The trade-off is that
a webhook delivery failure is best-effort — we log the failure but don't
retry. For at-least-once semantics, point `ALERT_WEBHOOK_URL` at a queue
(SQS, an Inngest webhook, etc) and let that handle retries.

---

## What this still does not give us

(Captured here so the next contributor doesn't think it's done.)

- **Cross-region empty detection.** Each Vercel function instance has its
  own LKG. A new region boot will report `empty` for one or two refreshes
  even if other regions are healthy. Better Stack's multi-region
  monitor partially compensates by checking from outside.
- **Latency SLO.** `/api/health` reports `ageMs` but we don't currently
  alert on a sustained climb. Add a Better Stack response-time alert if
  needed (recommend: warn at p95 > 2s for 5min, page at p95 > 8s for 5min).
- **Quidax-side outage classification.** When Quidax is down, every
  region will alert. Suppress with the `key` namespace if this becomes
  noisy.
