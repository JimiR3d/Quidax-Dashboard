"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ButtonBorderProps {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
  duration?: number
}

/**
 * Animated border button — uses CSS offset-path with a mask-composite
 * technique so a glowing dot orbits the rounded border. Based on the
 * 21st.dev reference implementation.
 */
export function ButtonBorder({
  children,
  className,
  href,
  onClick,
  duration = 5,
}: ButtonBorderProps) {
  const Comp = href ? "a" : "button"

  return (
    <Comp
      href={href}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
        "border border-border/70 bg-card/50 text-muted-foreground",
        "hover:border-primary/40 hover:text-foreground hover:shadow-lg hover:shadow-primary/10",
        "hover:-translate-y-0.5",
        className
      )}
    >
      {/* Animated orbiting border glow — mask-composite technique */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-[inherit] border-2 border-transparent",
          "[mask-clip:padding-box,border-box]",
          "[mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
        )}
        aria-hidden="true"
      >
        <motion.div
          className="absolute aspect-square bg-gradient-to-r from-transparent via-primary to-primary"
          animate={{
            offsetDistance: ["0%", "100%"],
          }}
          style={{
            width: 20,
            offsetPath: `rect(0 auto auto 0 round 20px)`,
          }}
          transition={{
            repeat: Infinity,
            duration,
            ease: "linear",
          }}
        />
      </div>
      {children}
    </Comp>
  )
}
