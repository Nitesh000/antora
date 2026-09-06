"use client"

import * as React from "react"
import { cn } from "cn"
import { Progress as ProgressPrimitive } from "radix-ui"
import { motion } from "motion/react"

const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 }

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
