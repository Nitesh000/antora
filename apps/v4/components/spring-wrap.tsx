"use client"

import { motion } from "motion/react"

export function SpringWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 600, damping: 18 }}
      style={{ display: "inline-flex" }}
    >
      {children}
    </motion.div>
  )
}
