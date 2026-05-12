export function fmtNgn(n: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(2)}B`
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(2)}M`
    if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`
    return `₦${n.toFixed(0)}`
  }
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: n >= 1000 ? 0 : 2,
  }).format(n)
}

export function fmtUsd(n: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
    return `$${n.toFixed(0)}`
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)
}

export function fmtNum(n: number, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n)
}

export function fmtPct(n: number, decimals = 2) {
  const sign = n > 0 ? "+" : ""
  return `${sign}${n.toFixed(decimals)}%`
}
