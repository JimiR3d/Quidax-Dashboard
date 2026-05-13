"use client"

import { useEffect } from "react"

/**
 * Route-level error boundary.
 *
 * Audit fix [3]/[High]: previously a single throw in any client component
 * (Recharts on NaN, SWR on malformed JSON, etc.) crashed the whole page.
 * This boundary catches it, surfaces a labeled empty state, and gives the
 * reader a retry button — better than a blank page.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] route error boundary tripped", error)
    // Hook for Sentry/Axiom — production deployments should wire here:
    // Sentry.captureException(error, { tags: { digest: error.digest } })
  }, [error])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-start justify-center gap-4 px-6 py-24">
      <span className="font-mono text-xs uppercase tracking-widest text-warning">
        Render error
      </span>
      <h1 className="text-3xl font-semibold tracking-tight">
        We couldn&apos;t fully render this view.
      </h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The dashboard hit a render error. The most likely cause is malformed
        upstream data or a stale cached snapshot. The error was logged for the
        operator. You can retry below or refresh the page.
      </p>
      <pre className="max-w-full overflow-x-auto rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">
        <code>{error.message}</code>
        {error.digest ? (
          <span className="ml-2 text-muted-foreground/60">[{error.digest}]</span>
        ) : null}
      </pre>
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Try again
      </button>
    </main>
  )
}
