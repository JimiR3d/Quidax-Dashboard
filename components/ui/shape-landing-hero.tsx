"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

function GridPattern() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 2, delay: 0.5 }}
      className="absolute inset-0 bg-grid"
      aria-hidden="true"
    />
  )
}

/**
 * HeroGeometric — background shapes are inlined directly as raw
 * framer-motion divs instead of importing a separate component.
 * This bypasses any import/rendering/stacking-context issues.
 *
 * Shapes float with a subtle y-axis bob animation (12s loop).
 * Purple/violet/fuchsia gradients at varied opacities.
 */
export function HeroGeometric({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "relative min-h-[80vh] border-b border-border/60",
        className
      )}
    >
      {/* ── Inlined floating shapes ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Shape 1 — top-left violet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -27 }}
          animate={{ opacity: 1, scale: 1, rotate: -12 }}
          transition={{ duration: 1.8, delay: 0.2, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
          className="absolute -left-10 -top-10"
        >
          <motion.div
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="h-[220px] w-[600px] rounded-full blur-[80px]"
            style={{ background: "radial-gradient(ellipse, oklch(0.62 0.27 305 / 0.55), transparent 70%)" }}
          />
        </motion.div>

        {/* Shape 2 — right fuchsia */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 15 }}
          transition={{ duration: 1.8, delay: 0.5, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
          className="absolute -right-20 top-1/4"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="h-[180px] w-[520px] rounded-full blur-[70px]"
            style={{ background: "radial-gradient(ellipse, oklch(0.70 0.24 320 / 0.40), transparent 70%)" }}
          />
        </motion.div>

        {/* Shape 3 — bottom-center violet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -23 }}
          animate={{ opacity: 1, scale: 1, rotate: -8 }}
          transition={{ duration: 1.8, delay: 0.8, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
          className="absolute bottom-0 left-1/3"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="h-[200px] w-[480px] rounded-full blur-[70px]"
            style={{ background: "radial-gradient(ellipse, oklch(0.62 0.27 305 / 0.30), transparent 70%)" }}
          />
        </motion.div>

        {/* Shape 4 — mid-left emerald accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 20 }}
          transition={{ duration: 1.8, delay: 1.1, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
          className="absolute left-1/4 top-1/2"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="h-[140px] w-[320px] rounded-full blur-[60px]"
            style={{ background: "radial-gradient(ellipse, oklch(0.74 0.17 155 / 0.22), transparent 70%)" }}
          />
        </motion.div>
      </div>

      {/* Grid overlay — sits above shapes */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <GridPattern />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[2] bg-noise opacity-30" aria-hidden="true" />

      {/* Content — highest z */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </section>
  )
}
