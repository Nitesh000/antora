"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "cn"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const

function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof motion.textarea>) {
  return (
    <motion.textarea
      whileTap={{ scale: 0.99 }}
      whileFocus={{ scale: 1.01 }}
      transition={fluidPress}
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
