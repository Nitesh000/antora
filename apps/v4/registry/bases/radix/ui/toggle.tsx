"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { motion } from "motion/react"
import { Toggle as TogglePrimitive } from "radix-ui"

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

const toggleVariants = cva(
  "cn-toggle group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none hover:bg-muted focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cn-toggle-variant-default",
        outline: "cn-toggle-variant-outline",
      },
      size: {
        default: "cn-toggle-size-default",
        sm: "cn-toggle-size-sm",
        lg: "cn-toggle-size-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root asChild data-slot="toggle" {...props}>
      <motion.button
        onPointerDownCapture={setPressOrigin}
        whileTap={{ scale: 0.95, transition: fluidPress }}
        className={cn(toggleVariants({ variant, size, className }))}
      >
        {children}
      </motion.button>
    </TogglePrimitive.Root>
  )
}

export { Toggle, toggleVariants }
