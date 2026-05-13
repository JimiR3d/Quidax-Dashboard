/**
 * Number formatting helpers.
 *
 * We deliberately do NOT rely on Intl with the "en-NG" locale for NGN —
 * Vercel's Edge runtime ships partial ICU, and "en-NG" can silently fall
 * back to "NGN 1,375" instead of "₦1,375". Hand-rolling the ₦ prefix plus
 * "en-US" grouping is portable and stable.
 *
 * `fmtPct` returns "—" for non-finite inputs so that "missing data" is
 * visually distinct from a real "0.00%" reading.
 */

function groupUs(n: number, decimals: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n)
}

export function fmtNgn(n: number, opts?: { compact?: boolean }): string {
  if (!Number.isFinite(n)) return "—"
  if (opts?.compact) {
    if (Math.abs(n) >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(2)}B`
    if (Math.abs(n) >= 1_000_000) return `₦${(n / 1_000_000).toFixed(2)}M`
    if (Math.abs(n) >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`
    return `₦${n.toFixed(0)}`
  }
  const decimals = Math.abs(n) >= 1000 ? 0 : 2
  return `₦${groupUs(n, decimals)}`
}

export function fmtUsd(n: number, opts?: { compact?: boolean }): string {
  if (!Number.isFinite(n)) return "—"
  if (opts?.compact) {
    if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`
    if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
    if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
    return `$${n.toFixed(0)}`
  }
  return `$${groupUs(n, 0)}`
}

export function fmtNum(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return "—"
  return groupUs(n, decimals)
}

export function fmtPct(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return "—"
  if (n === 0) return "0.00%"
  const sign = n > 0 ? "+" : ""
  return `${sign}${n.toFixed(decimals)}%`
}

export function fmtBps(n: number, decimals = 0): string {
  if (!Number.isFinite(n)) return "—"
  const sign = n > 0 ? "+" : ""
  return `${sign}${n.toFixed(decimals)} bps`
}

export function fmtRelTime(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "—"
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}
