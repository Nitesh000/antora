"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { motion } from "motion/react"
import {
  ToggleButton as TogglePrimitive,
  type ToggleButtonProps,
} from "react-aria-components"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const

const toggleVariants = cva(
  "cn-toggle cn-toggle-aria group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none hover:bg-muted focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
  ...props
}: ToggleButtonProps & VariantProps<typeof toggleVariants>) {
  return (
    <motion.span
      whileTap={{ scale: 0.95 }}
      transition={fluidPress}
      style={{ display: "inline-flex" }}
    >
      <TogglePrimitive
        data-slot="toggle"
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
      />
    </motion.span>
  )
}

export { Toggle, toggleVariants }
