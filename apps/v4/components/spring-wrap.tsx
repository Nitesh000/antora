"use client"

import { motion } from "motion/react"

export function SpringWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // The wrapped child is the focusable control; without an explicit
      // tabindex Motion's whileTap makes this wrapper a second tab stop.
      tabIndex={-1}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 600, damping: 18 }}
      style={{ display: "inline-flex" }}
    >
      {children}
    </motion.div>
  )
}
