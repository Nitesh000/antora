"use client"

import * as React from "react"
import { cn } from "cn"
import { motion } from "motion/react"
import { Progress as ProgressPrimitive } from "radix-ui"

const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 } as const

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        asChild
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary"
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
