"use client"

import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HoverButtonProps {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
  glowColor?: string
}

export function HoverButton({
  children,
  className,
  href,
  onClick,
  glowColor = "oklch(0.62 0.27 305 / 0.6)",
}: HoverButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const Comp = href ? "a" : "button"

  return (
    <Comp
      ref={ref as React.Ref<HTMLAnchorElement & HTMLButtonElement>}
      href={href}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-2 overflow-hidden rounded-md px-5 py-2.5 text-sm font-medium transition-all",
        "bg-primary text-primary-foreground",
        "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Cursor glow */}
      <motion.div
        className="pointer-events-none absolute -z-0 rounded-full"
        animate={{
          x: mousePos.x - 40,
          y: mousePos.y - 40,
          opacity: isHovering ? 1 : 0,
          scale: isHovering ? 1 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          width: 80,
          height: 80,
          background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Comp>
  )
}
