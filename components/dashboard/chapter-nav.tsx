import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

const CHAPTERS = [
  { href: "/market", label: "Live Market Data" },
  { href: "/stablecoins", label: "Nigeria's Digital Dollar" },
  { href: "/competition", label: "Who Does What" },
  { href: "/opportunity", label: "The B2B Case" },
  { href: "/playbook", label: "What To Do Next" },
] as const

type Props = {
  /** Current chapter href, e.g. "/market" */
  current: (typeof CHAPTERS)[number]["href"]
}

/**
 * Bottom navigation bar linking to previous/next chapter.
 * Keeps the reading flow linear without forcing scroll.
 */
export function ChapterNav({ current }: Props) {
  const idx = CHAPTERS.findIndex((c) => c.href === current)
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null

  return (
    <nav
      aria-label="Chapter navigation"
      className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6"
    >
      <div className="flex items-stretch gap-3">
        {prev ? (
          <Link
            href={prev.href}
            className="group flex flex-1 items-center gap-3 rounded-xl border border-border/60 bg-card/30 px-5 py-4 transition-colors hover:border-primary/40"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Previous
              </span>
              <span className="text-sm font-medium text-foreground">
                {prev.label}
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/"
            className="group flex flex-1 items-center gap-3 rounded-xl border border-border/60 bg-card/30 px-5 py-4 transition-colors hover:border-primary/40"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Back to
              </span>
              <span className="text-sm font-medium text-foreground">
                Dashboard
              </span>
            </div>
          </Link>
        )}

        {next ? (
          <Link
            href={next.href}
            className="group flex flex-1 items-center justify-end gap-3 rounded-xl border border-border/60 bg-card/30 px-5 py-4 text-right transition-colors hover:border-primary/40"
          >
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Next
              </span>
              <span className="text-sm font-medium text-foreground">
                {next.label}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
          </Link>
        ) : (
          <Link
            href="/"
            className="group flex flex-1 items-center justify-end gap-3 rounded-xl border border-border/60 bg-card/30 px-5 py-4 text-right transition-colors hover:border-primary/40"
          >
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Back to
              </span>
              <span className="text-sm font-medium text-foreground">
                Dashboard
              </span>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
          </Link>
        )}
      </div>
    </nav>
  )
}
