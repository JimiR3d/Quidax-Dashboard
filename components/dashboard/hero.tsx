"use client"

import { ArrowDownRight, Sparkles } from "lucide-react"
import type { SnapshotSource } from "@/lib/quidax"
import { fmtRelTime } from "@/lib/format"
import { TextCycle } from "@/components/ui/animated-text-cycle"
import { SpecialText } from "@/components/ui/special-text"
import { ButtonBorder } from "@/components/ui/button-border"

type Props = {
  fetchedAt: string | null
  snapshotSource: SnapshotSource
  ageMs: number
}

/**
 * Above-the-fold hero. Reads truthfully from the snapshot:
 *   - If we have a `fetchedAt`, format it in WAT for the Nigerian audience.
 *   - If we don't (`empty` snapshot), say so plainly; do not pretend.
 *   - Always pair the timestamp with the snapshot source so a reader can
 *     immediately tell whether they're looking at live, cached, or LKG data.
 */
export function Hero({ fetchedAt, snapshotSource, ageMs }: Props) {
  const dateLabel = fetchedAt
    ? new Date(fetchedAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Lagos",
        timeZoneName: "short",
      })
    : "No upstream data right now"

  const sourceCopy =
    snapshotSource === "live"
      ? "Live · server snapshot, taken at page load"
      : snapshotSource === "cached"
        ? `From a recent server cache · last refreshed ${fmtRelTime(ageMs)}`
        : snapshotSource === "lkg"
          ? `Last good snapshot · ${fmtRelTime(ageMs)} · Quidax not reachable right now`
          : "Snapshot not available · Quidax and our cache are both empty"

  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            <SpecialText inView once speed={60} delay={0.1}>
              An independent analysis · built for the Quidax team
            </SpecialText>
          </span>
          <h1 className="mt-6 max-w-4xl text-pretty text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            Nigeria&apos;s next billion dollars in crypto won&apos;t come from{" "}
            <TextCycle
              words={[
                "retail traders",
                "individual wallets",
                "single users",
                "small accounts",
              ]}
              interval={3000}
            />
            .
            <br className="hidden md:block" /> It will come from businesses 🚀
          </h1>
          <p className="mt-7 max-w-3xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            This dashboard is your cheat sheet to the B2B crypto world. We&apos;ll show you how Quidax&apos;s dollar price stacks up against the CBN rate, how we square up against the competition, and the four massive money pools where Quidax can make bank by selling rails to other businesses 💰. Way cheaper than chasing more retail traders, right? (Don&apos;t worry, we&apos;re not going bankrupt!)
          </p>

          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="card-elev relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)] hover:border-primary/40 group cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  Author
                </span>
              <p className="mt-2 text-sm font-medium text-foreground">
                Oluwafolajinmi David Aboderin
              </p>
                <p className="mt-0.5 text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  Data and backend engineer · Computer Science, Covenant University · previously at Qucoon
                </p>
              </div>
            </div>
            <div className="card-elev relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)] hover:border-primary/40 group cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  Where the numbers come from
                </span>
              <p className="mt-2 text-sm font-medium text-foreground">
                Quidax&apos;s own public markets API
              </p>
                <p className="mt-0.5 text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  app.quidax.io · checked, cached, and clearly labelled when a number is estimated
                </p>
              </div>
            </div>
            <div className="card-elev relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)] hover:border-primary/40 group cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  Snapshot
                </span>
              <p className="mt-2 text-sm font-medium text-foreground">{dateLabel}</p>
                <p className="mt-0.5 text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{sourceCopy}</p>
              </div>
            </div>
          </div>

          <ButtonBorder
            href="/market"
            className="mt-12 w-fit"
          >
            Show me the numbers
            <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
          </ButtonBorder>
        </div>
      </div>
    </section>
  )
}
