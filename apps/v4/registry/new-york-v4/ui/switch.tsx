"use client"

import * as React from "react"
import { cn } from "cn"
import { motion } from "motion/react"
import { Switch as SwitchPrimitive } from "radix-ui"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const
const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 } as const

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
        whileTap={{ scale: 0.95 }}
        transition={fluidPress}
        className={cn(
          "peer group/switch inline-flex shrink-0 items-center rounded-full border-2 border-transparent shadow-xs outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-7 data-[size=default]:w-12 data-[size=sm]:h-5 data-[size=sm]:w-8 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30",
          className
        )}
      >
        <SwitchPrimitive.Thumb asChild data-slot="switch-thumb">
          <motion.span
            layout
            transition={fluidLayout}
            className={cn(
              "pointer-events-none block rounded-full bg-background shadow-lg ring-0 group-data-[size=default]/switch:size-5 group-data-[size=sm]/switch:size-4 data-[state=checked]:translate-x-[calc(100%+0.25rem)] data-[state=checked]:bg-primary-foreground data-[state=unchecked]:translate-x-0.5 data-[state=unchecked]:bg-background"
            )}
          />
        </SwitchPrimitive.Thumb>
      </motion.button>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
