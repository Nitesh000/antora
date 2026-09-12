"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"

const fluidPop = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 0.9,
} as const

export function Announcement() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...fluidPop, delay: 0.05 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      <Badge asChild variant="secondary" className="bg-muted">
        <Link href="/docs/changelog">
          New Questionnaire component <ArrowRightIcon />
        </Link>
      </Badge>
    </motion.div>
  )
}
