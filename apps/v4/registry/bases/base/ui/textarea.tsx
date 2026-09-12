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
        "cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
