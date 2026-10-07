"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { motion } from "motion/react"
import { Slot } from "radix-ui"

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

const badgeVariants = cva(
  "cn-badge group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "cn-badge-variant-default",
        secondary: "cn-badge-variant-secondary",
        destructive: "cn-badge-variant-destructive",
        outline: "cn-badge-variant-outline",
        ghost: "cn-badge-variant-ghost",
        link: "cn-badge-variant-link",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<typeof motion.span> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const isInteractive = props.onClick !== undefined

  if (asChild) {
    return (
      <Slot.Root
        data-slot="badge"
        data-variant={variant}
        className={cn(badgeVariants({ variant }), className)}
        {...(props as React.ComponentProps<"span">)}
      />
    )
  }

  return (
    <motion.span
      onPointerDownCapture={setPressOrigin}
      whileTap={
        isInteractive ? { scale: 0.96, transition: fluidPress } : undefined
      }
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...(props as any)}
    />
  )
}

export { Badge, badgeVariants }
