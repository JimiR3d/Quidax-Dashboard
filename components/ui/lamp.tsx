"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function LampContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-md",
        className
      )}
    >
      {/* Lamp beam */}
      <div className="relative flex w-full flex-1 items-center justify-center isolate">
        {/* Left beam */}
        <motion.div
          initial={{ opacity: 0.3, width: "8rem" }}
          whileInView={{ opacity: 1, width: "16rem" }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
          style={{
            backgroundImage:
              "conic-gradient(from 70deg at center top, oklch(0.62 0.27 305 / 0), oklch(0.62 0.27 305 / 0.5) 20%, transparent 25%)",
          }}
          className="absolute right-1/2 top-0 h-56 w-64 bg-no-repeat [mask-image:linear-gradient(to_bottom,white,transparent)]"
        />
        {/* Right beam */}
        <motion.div
          initial={{ opacity: 0.3, width: "8rem" }}
          whileInView={{ opacity: 1, width: "16rem" }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
          style={{
            backgroundImage:
              "conic-gradient(from 290deg at center top, transparent, oklch(0.62 0.27 305 / 0.5) 80%, oklch(0.62 0.27 305 / 0))",
          }}
          className="absolute left-1/2 top-0 h-56 w-64 bg-no-repeat [mask-image:linear-gradient(to_bottom,white,transparent)]"
        />
        {/* Top glow bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-primary/80 rounded-full shadow-[0_0_20px_6px_oklch(0.62_0.27_305_/_0.5)]" />
        {/* Blur pad */}
        <motion.div
          initial={{ width: "6rem", opacity: 0 }}
          whileInView={{ width: "12rem", opacity: 0.7 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="absolute top-0 left-1/2 -translate-x-1/2 h-24 rounded-full bg-primary/40 blur-2xl"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 w-full"
      >
        {children}
      </motion.div>
    </div>
  )
}
