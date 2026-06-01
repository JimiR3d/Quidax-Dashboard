/**
 * Cross-viewer in-memory cache for the Quidax snapshot.
 *
 * Why module-scope and not external KV?
 *   - In a single Vercel function instance, every viewer shares one cached
 *     snapshot. The upstream is hit once per TTL window per instance,
 *     not once per viewer. That solves the [3]/[Critical] rate-limit blow-up
 *     for any realistic preview traffic.
 *   - For multi-region / multi-instance scale we would swap this for Upstash
 *     Redis (see methodology.md §Ops). The contract stays the same.
 *
 * Two slots:
 *   - `hot`   — last successful fetch, valid for TTL_MS. Used for normal serves.
 *   - `lkg`   — Last-Known-Good snapshot, never expires. Used as a graceful
 *              fallback when the upstream is unreachable. Replaces the old
 *              hard-coded SIMULATED array so we never lie about freshness.
 */

export type CacheEntry<T> = {
  value: T
  storedAt: number // ms epoch when it landed in cache
}

type Slot<T> = {
  hot: CacheEntry<T> | null
  lkg: CacheEntry<T> | null
  inflight: Promise<T> | null
}

const slots = new Map<string, Slot<unknown>>()

function getSlot<T>(key: string): Slot<T> {
  let s = slots.get(key) as Slot<T> | undefined
  if (!s) {
    s = { hot: null, lkg: null, inflight: null }
    slots.set(key, s as Slot<unknown>)
  }
  return s
}

export type CachedResult<T> = {
  value: T
  storedAt: number
  ageMs: number
  source: "hot" | "lkg" | "fresh"
}

/**
 * Get a cached value if hot, otherwise call `fetcher` to refresh.
 * On fetcher failure, returns the last-known-good entry if present.
 * If both are missing, the fetcher error propagates.
 *
 * Concurrent callers share the same in-flight promise (single-flight) so we
 * never hit upstream more than once per TTL window per instance.
 */
export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number,
): Promise<CachedResult<T>> {
  const slot = getSlot<T>(key)
  const now = Date.now()

  if (slot.hot && now - slot.hot.storedAt < ttlMs) {
    return {
      value: slot.hot.value,
      storedAt: slot.hot.storedAt,
      ageMs: now - slot.hot.storedAt,
      source: "hot",
    }
  }

  if (!slot.inflight) {
    slot.inflight = fetcher()
      .then((value) => {
        const entry: CacheEntry<T> = { value, storedAt: Date.now() }
        slot.hot = entry
        slot.lkg = entry
        return value
      })
      .finally(() => {
        slot.inflight = null
      })
  }

  try {
    const value = await slot.inflight
    return {
      value,
      storedAt: slot.hot?.storedAt ?? Date.now(),
      ageMs: 0,
      source: "fresh",
    }
  } catch (err) {
    if (slot.lkg) {
      return {
        value: slot.lkg.value,
        storedAt: slot.lkg.storedAt,
        ageMs: Date.now() - slot.lkg.storedAt,
        source: "lkg",
      }
    }
    throw err
  }
}

/**
 * Retry with full-jitter exponential backoff.
 * Honors a single Retry-After header if the upstream throws a RetryableError.
 */
export class RetryableError extends Error {
  retryAfterMs?: number
  constructor(msg: string, retryAfterMs?: number) {
    super(msg)
    this.retryAfterMs = retryAfterMs
  }
}

export async function retry<T>(
  fn: () => Promise<T>,
  opts: { attempts?: number; baseMs?: number; capMs?: number } = {},
): Promise<T> {
  const attempts = opts.attempts ?? 3
  const baseMs = opts.baseMs ?? 250
  const capMs = opts.capMs ?? 2_000
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (i === attempts - 1) break
      const respect =
        err instanceof RetryableError && err.retryAfterMs ? err.retryAfterMs : 0
      const expo = Math.min(capMs, baseMs * 2 ** i)
      const jitter = Math.random() * expo
      await new Promise((r) => setTimeout(r, Math.max(respect, jitter)))
    }
  }
  throw lastErr
}

/**
 * Best-effort in-memory rate limiter for a single function instance.
 * Sliding window. Not a substitute for Upstash Ratelimit in production —
 * see methodology.md §Ops for the multi-region recipe.
 */
const rlBuckets = new Map<string, number[]>()

export function rateLimit(
  key: string,
  opts: { windowMs: number; max: number },
): { ok: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now()
  const arr = rlBuckets.get(key) ?? []
  const cutoff = now - opts.windowMs
  const fresh = arr.filter((t) => t > cutoff)
  if (fresh.length >= opts.max) {
    rlBuckets.set(key, fresh)
    const retryAfterMs = Math.max(0, fresh[0] + opts.windowMs - now)
    return { ok: false, remaining: 0, retryAfterMs }
  }
  fresh.push(now)
  rlBuckets.set(key, fresh)
  return {
    ok: true,
    remaining: opts.max - fresh.length,
    retryAfterMs: 0,
  }
}
