"use client"

import { Component, type ReactNode } from "react"

type Props = {
  /** Human-readable section name shown in the fallback message. */
  label: string
  children: ReactNode
  /** Optional minimum height of the fallback so the page layout doesn't collapse. */
  minHeightClass?: string
}

type State = { error: Error | null }

/**
 * Per-section error boundary.
 *
 * Recharts is famously brittle on bad data — a single
 * NaN crashes the whole tree below it. By wrapping each chart-bearing
 * section in this boundary, a malformed ticker or empty candle set degrades
 * to a labelled placeholder, and the rest of the page keeps rendering.
 */
export class SectionBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error(`[v0] section boundary "${this.props.label}" caught:`, error)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div
        className={`mx-auto w-full max-w-7xl px-4 py-8 md:px-6 ${this.props.minHeightClass ?? ""}`}
        role="alert"
      >
        <div className="card-elev flex flex-col gap-2 rounded-xl border border-warning/40 bg-warning/5 p-5">
          <span className="font-mono text-xs uppercase tracking-widest text-warning">
            Section unavailable · {this.props.label}
          </span>
          <p className="text-sm text-muted-foreground">
            This section couldn&apos;t render due to an upstream data issue. The rest
            of the dashboard is unaffected.
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="mt-1 w-fit rounded-md border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }
}
