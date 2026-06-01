"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Mail, Menu, X } from "lucide-react"
import { useState } from "react"
import type { SnapshotSource } from "@/lib/quidax"
import { HeaderSourcePill } from "./header-source-pill"
import { ButtonBorder } from "@/components/ui/button-border"

function BrandMark() {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center">
      {/* Glow */}
      <div className="absolute -inset-1 rounded-xl bg-primary/30 blur-md animate-[pulse_3s_ease-in-out_infinite]" />
      
      {/* Box */}
      <div className="relative flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[var(--chart-4)] shadow-inner overflow-hidden">
        <div className="absolute inset-0 bg-background/10" />
        <span className="relative z-10 font-sans text-lg font-extrabold text-white drop-shadow-sm">
          Q
        </span>
      </div>
    </div>
  )
}

const NAV_CHAPTERS = [
  { href: "/market", label: "Market" },
  { href: "/stablecoins", label: "Stablecoins" },
  { href: "/competition", label: "Competition" },
  { href: "/opportunity", label: "Opportunity" },
  { href: "/playbook", label: "Playbook" },
]

type Props = {
  snapshotSource: SnapshotSource
  fetchedAt?: string | null
}

/**
 * Site header with chapter-based navigation.
 * Uses pathname matching instead of scroll-spy since
 * content is now split across multiple pages.
 */
export function SiteHeader({ snapshotSource, fetchedAt = null }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark />
            <div className="flex flex-col leading-tight">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                NGN Liquidity Intelligence
              </span>
              <span className="text-sm font-medium">
                An outside view of{" "}
                <span className="text-gradient-primary font-semibold">Quidax</span>&apos;s next move
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex" aria-label="Chapter navigation">
          {NAV_CHAPTERS.map((chapter) => {
            const isActive = pathname === chapter.href
            return (
              <Link
                key={chapter.href}
                href={chapter.href}
                className={`
                  group relative rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300
                  ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
                `}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full -z-10 animate-in fade-in duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.62 0.27 305 / 0.18), oklch(0.70 0.24 320 / 0.12))",
                      border: "1px solid oklch(0.62 0.27 305 / 0.3)",
                      boxShadow:
                        "inset 0 1px 0 oklch(1 0 0 / 0.08), 0 0 12px oklch(0.62 0.27 305 / 0.2)",
                      backdropFilter: "blur(12px)",
                    }}
                    aria-hidden="true"
                  />
                )}
                {!isActive && (
                  <span
                    className="absolute inset-0 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.62 0.27 305 / 0.08), oklch(0.70 0.24 320 / 0.05))",
                      border: "1px solid oklch(0.62 0.27 305 / 0.12)",
                      backdropFilter: "blur(8px)",
                    }}
                    aria-hidden="true"
                  />
                )}
                {chapter.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <HeaderSourcePill initialSource={snapshotSource} initialFetchedAt={fetchedAt} />
          <ButtonBorder
            href="/methodology"
            className="hidden lg:inline-flex text-xs"
            duration={6}
          >
            Methodology
          </ButtonBorder>
          <ButtonBorder
            href="mailto:folajinmi13@gmail.com"
            className="hidden sm:inline-flex text-xs"
            duration={5}
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Contact
          </ButtonBorder>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV_CHAPTERS.map((chapter) => {
              const isActive = pathname === chapter.href
              return (
                <Link
                  key={chapter.href}
                  href={chapter.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {chapter.label}
                </Link>
              )
            })}
            <div className="mt-2 flex gap-2 border-t border-border/40 pt-3">
              <Link
                href="/methodology"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Methodology
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
