# Runbook — Quidax NGN Liquidity Intelligence Dashboard

This is the on-call cheat sheet for the dashboard at the production URL.
It is intentionally short — most failure modes degrade gracefully on their
own, so the right reaction is almost always **observe before acting**.

---

## 1. What this service is (and isn't)

- Single Next.js (App Router) deployment on Vercel.
- One server route: `GET /api/markets` — read-only passthrough of the
  Quidax public ticker API, with edge-cached, rate-limited, Zod-validated
  responses and a last-known-good fallback.
- **No database, no auth, no user data, no PII, no secrets.**
- The blast radius of a bad deploy is therefore: viewers see stale or
  empty market data for the minutes between the bad deploy and the
  rollback. There is no data to repair, no users to email, no refunds
  to issue.

---

## 2. Read this first: what each `source` value means

The snapshot returned by `/api/markets` always carries an explicit
`source` discriminator. The header pill and the bottom proof strip both
render this value verbatim — if you're looking at the live page, you
already know which state you're in.

| `source`   | Meaning                                                                 | Triage urgency |
| ---------- | ----------------------------------------------------------------------- | -------------- |
| `live`     | Just fetched from Quidax. Counter starts at 0s, climbs every second.   | None — healthy.|
| `cached`   | Served from the in-memory single-flight cache (≤10s old).               | None — healthy.|
| `lkg`      | **Last-known-good.** Upstream fetch failed, we are serving the most recent successful snapshot we have. `ageMs` shows how stale. | Investigate if it persists >5 min. |
| `empty`    | We have no cache and upstream is unreachable. Page renders explicit "No live data" tiles, never invented prices. | Page upstream / Vercel status. |

**If you only remember one thing:** `lkg` and `empty` are designed
states, not bugs. They are the system refusing to lie. Don't panic-rollback
on seeing them — first confirm upstream Quidax is actually up by hitting
`https://app.quidax.io/api/v1/markets/tickers` directly.

---

## 3. Rollback procedure

There are two rollback paths. Pick by **time-to-recover**, not by purity.

### 3a. Vercel instant promote (preferred — ~30 seconds)

1. Open the Vercel dashboard for this project.
2. **Deployments** → pick the last known-good production deployment
   (one with a green checkmark and a working preview URL).
3. Click the menu → **Promote to Production**.
4. Confirm. Production alias switches to that deployment within seconds.
5. Open the production URL in an incognito window and confirm the
   header pill shows `live` and the counter is ticking.

This is **non-destructive**: the bad deploy still exists in the
Deployments list. You can re-promote it later if the rollback turns
out to have been the wrong call.

### 3b. Git revert (use when you also need the codebase to reflect reality)

```bash
# Identify the bad commit
git log --oneline -5

# Revert it
git revert <sha>
git push origin main
```

Vercel auto-deploys the revert. **This is slower** (full build cycle,
~2–4 minutes) and only do it if you want subsequent contributors
working off a clean HEAD. For a pure "stop the bleeding" rollback,
use 3a.

### What rollback cannot do

- It cannot undo what readers already saw. If a wrong figure was on
  screen for 15 minutes, anyone who screenshotted it still has the
  screenshot. Be honest about that.
- It cannot fix upstream Quidax problems. If `source === "empty"`
  because Quidax itself is down, rolling back makes no difference —
  the new (old) code will also see an empty upstream.

---

## 4. Common failure modes and what to do

### "The counter is stuck"

- **Stuck at 0s** → SWR is not running. Open browser devtools, check
  for client-side errors. Probable cause: a render-time exception in a
  client component crashed the SWR provider tree. Check Vercel
  function logs.
- **Climbing past 15s and not resetting** → upstream is slow or the
  browser tab is throttled. This is **correct behavior** — the unbounded
  climb is honest signal that the page is lagging. Refresh; if it
  persists, check Quidax status.
- **Always shows "—" or "no cache · no upstream"** → `source === "empty"`.
  Both the upstream fetch and the cache miss. See section 2.

### "All the prices look wrong"

This is the scariest failure. Cross-check:

1. Compare two or three prices in the page against
   `https://app.quidax.io/api/v1/markets/tickers` directly. If they
   match: the page is correct, the prices just moved.
2. If they don't match, check `source`. If `lkg`, the prices are stale
   (the page tells you the staleness — see the header pill age).
3. If `source === "live"` and prices still mismatch, that's a real bug.
   Roll back immediately (3a) and open an issue.

### "/api/markets returns 429"

The IP rate limiter is doing its job (6 req per 10s per IP).

- One viewer hitting 429 = client-side bug, probably an effect with a
  missing dep array spamming the endpoint.
- Many viewers hitting 429 simultaneously = legitimate traffic spike.
  Increase the per-IP budget in `lib/cache.ts` if needed. The upstream
  Quidax call is single-flighted to ≤1 req per 10s globally, so this
  knob only affects how aggressive a single browser can be.

### "Zod parse error in logs"

```
[quidax] schema validation failed for tickers payload
```

This means Quidax changed their response shape. The page will fall back
to `lkg` (and eventually `empty` once the LKG ages out).

1. Don't panic. The system is doing exactly what it was designed for:
   refusing to serve unvalidated data.
2. Hit the upstream directly, look at the new shape.
3. Update the Zod schemas in `lib/quidax.ts` (`TickerInner`,
   `TickersPayload`) to accept the new shape, with a normalize step
   into our existing `MarketTicker` type.
4. Add a fixture under `tests/` capturing the new shape so it can't
   silently regress.

---

## 5. Who to contact

- **Author / on-call:** see `/about` on the live site for current contact
  details.
- **Upstream (Quidax):** the dashboard depends on
  `app.quidax.io/api/v1/markets/tickers`. If that's broken, the
  dashboard can't be fixed by deploying — only by waiting for upstream
  to recover (`lkg` will keep serving) or accepting `empty`.
- **Vercel:** [vercel.com/help](https://vercel.com/help) for platform
  issues (build failures, edge network, function timeouts).

---

## 6. Operational instrumentation

The three things originally captured here as "would page someone if this
had a real userbase" are now wired in code. They activate when the
relevant env vars / external services are connected; with nothing
connected the system falls back to its previous behavior (stdout-only
logs, no alerts).

See [`docs/MONITORING.md`](./docs/MONITORING.md) for the full setup
guide. Quick reference:

- **Synthetic uptime monitor.** `GET /api/health` returns:
  - `200 { status: "ok" }` when `source` is `live` / `cached`
  - `200 { status: "degraded" }` when `source` is `lkg`
  - `503 { status: "down" }` when `source` is `empty`

  Point Better Stack / Checkly / a GitHub Actions cron at it. The
  endpoint is unrate-limited (separate from `/api/markets`) and ~200B,
  so polling every 60s is cheap.

- **External log drain.** All server-side events are emitted as
  single-line JSON via `lib/logger.ts` with stable `msg` names
  (`markets.served`, `quidax.tickers.upstream_non_2xx`, etc). Connect
  any drain in **Vercel → Settings → Log Drains** — Better Stack /
  Axiom / Logflare / Datadog / S3 all auto-parse the JSON. No code
  change needed when switching drains.

- **Alerting on `source === "empty"`.** When `/api/markets` returns an
  empty snapshot, we fire-and-forget a POST to `ALERT_WEBHOOK_URL` if
  it is set. Payload is Slack / Discord / Better Stack / generic-webhook
  compatible. In-process dedupe collapses repeats to one alert per
  5-min window per instance.

What's still NOT wired (intentionally):

- E2E tests — explicit out-of-scope decision; the 14 unit tests +
  typecheck + production build + `/api/health` smoke in CI cover the
  contracts that matter for a public, no-auth dashboard.
- Cross-instance LKG sharing — a fresh region boot will see one or two
  `empty` snapshots before its in-memory cache warms up. Better Stack's
  multi-region monitor partially compensates. For real product scale,
  swap `lib/cache.ts` to Upstash Redis (the contract is unchanged).

