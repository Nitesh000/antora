"use client"

import * as React from "react"
import { cn } from "cn"
import { Switch as SwitchPrimitive } from "radix-ui"
import { motion } from "motion/react"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 }
const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 }

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
        whileTap={{ scale: 0.95, transition: fluidPress }}
        className={cn(
          "cn-switch peer group/switch relative inline-flex items-center outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className
        )}
      >
        <SwitchPrimitive.Thumb
          asChild
          data-slot="switch-thumb"
        >
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
