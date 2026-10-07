"use client"

import * as React from "react"
import { cn } from "cn"
import { motion } from "motion/react"
import { Switch as SwitchPrimitive } from "radix-ui"

// Scale the pressed element about the pointer: with a centered whileTap scale
// the shrinking hit area slid out from under a press near the left/right edge,
// so mouseup landed on the parent and the click was lost.
function setPressOrigin(event: {
  currentTarget: HTMLElement
  clientX: number
  clientY: number
}) {
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.transformOrigin = `${event.clientX - rect.left}px ${event.clientY - rect.top}px`
}

const fluidPress = {
  type: "spring",
  stiffness: 600,
  damping: 20,
  mass: 1,
} as const
const fluidLayout = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  mass: 1,
} as const

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      asChild
      data-slot="switch"
      data-size={size}
      {...props}
    >
      <motion.button
        onPointerDownCapture={setPressOrigin}
        whileTap={{ scale: 0.95, transition: fluidPress }}
        className={cn(
          "cn-switch peer group/switch relative inline-flex items-center outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className
        )}
      >
        <SwitchPrimitive.Thumb asChild data-slot="switch-thumb">
          <motion.span
            layout
            transition={fluidLayout}
            className="cn-switch-thumb pointer-events-none block ring-0"
          />
        </SwitchPrimitive.Thumb>
      </motion.button>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
