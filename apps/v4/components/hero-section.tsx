"use client"

import { motion } from "motion/react"

export function HeroSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="container-wrapper flex-1 p-0"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 28,
        mass: 1,
        delay: 0.45,
      }}
    >
      {children}
    </motion.div>
  )
}
