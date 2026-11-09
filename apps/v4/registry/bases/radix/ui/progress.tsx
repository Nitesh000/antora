"use client"

import * as React from "react"
import { cn } from "cn"
import { motion } from "motion/react"
import { Progress as ProgressPrimitive } from "radix-ui"

const fluidLayout = {
  type: "spring",
  stiffness: 500,
  damping: 40,
  mass: 1,
} as const

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "cn-progress relative flex w-full items-center overflow-x-hidden",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        asChild
        data-slot="progress-indicator"
        className="cn-progress-indicator size-full flex-1"
      >
        <motion.div
          initial={false}
          animate={{ x: `-${100 - (value || 0)}%` }}
          transition={fluidLayout}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
