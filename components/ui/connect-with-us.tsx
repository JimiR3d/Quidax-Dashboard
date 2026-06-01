"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Linkedin, Github } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialLink {
  icon: React.ReactNode
  label: string
  href: string
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: <Linkedin className="h-4 w-4" />,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/oluwafolajinmi-aboderin-695848249/",
  },
  {
    icon: <Github className="h-4 w-4" />,
    label: "GitHub",
    href: "https://github.com/JimiR3d/Quidax-Dashboard",
  },
  {
    icon: <Mail className="h-4 w-4" />,
    label: "Email",
    href: "mailto:folajinmi13@gmail.com",
  },
]

function SocialIcon({
  link,
  index,
}: {
  link: SocialLink
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.a
      href={link.href}
      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noreferrer"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-lg px-3 py-2",
        "border border-border/60 bg-card/40 backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-primary/50 hover:bg-card/70 hover:-translate-y-0.5",
        "hover:shadow-md hover:shadow-primary/10"
      )}
    >
      {/* Glow effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 -z-10 rounded-lg bg-primary/10 blur-md"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      <div className="text-muted-foreground transition-colors group-hover:text-primary">
        {link.icon}
      </div>
      <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        {link.label}
      </span>
    </motion.a>
  )
}

/**
 * Compact inline social links — no heading, no stacking.
 * LinkedIn, GitHub, Email in a single row.
 */
export function ConnectSection({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {SOCIAL_LINKS.map((link, index) => (
        <SocialIcon key={link.label} link={link} index={index} />
      ))}
    </div>
  )
}
