"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Accelerate towards end
        const increment = prev < 60 ? 3 : prev < 85 ? 2 : 1
        return Math.min(prev + increment, 100)
      })
    }, 30)

    // Hide after load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1800)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          {/* Background glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 50% 50%, oklch(0.62 0.27 305 / 0.15), transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* Logo / Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Pulsing dot */}
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <div className="absolute inset-0 h-3 w-3 rounded-full bg-primary live-ping" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Loading
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                NGN Liquidity Intelligence
              </h1>
            </div>

            {/* Progress bar */}
            <div className="w-48 overflow-hidden rounded-full bg-secondary/50">
              <motion.div
                className="h-[2px] rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>

            <span className="font-mono text-[10px] text-muted-foreground/60">
              {progress < 100 ? "Initializing dashboard..." : "Ready"}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
