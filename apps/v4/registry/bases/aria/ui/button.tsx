"use client"

import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { motion } from "motion/react"
import {
  Button as ButtonPrimitive,
  Link as LinkPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  type LinkProps as LinkPrimitiveProps,
} from "react-aria-components"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const

const buttonVariants = cva(
  "cn-button group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-[color,background-color,border-color,box-shadow] outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cn-button-variant-default",
        outline: "cn-button-variant-outline",
        secondary: "cn-button-variant-secondary",
        ghost: "cn-button-variant-ghost",
        destructive: "cn-button-variant-destructive",
        link: "cn-button-variant-link",
      },
      size: {
        default: "cn-button-size-default",
        xs: "cn-button-size-xs",
        sm: "cn-button-size-sm",
        lg: "cn-button-size-lg",
        icon: "cn-button-size-icon",
        "icon-xs": "cn-button-size-icon-xs",
        "icon-sm": "cn-button-size-icon-sm",
        "icon-lg": "cn-button-size-icon-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function isFullWidth(className?: string) {
  return /\b(w-full|flex-1|grow)\b/.test(className ?? "")
}

// Positioning/transform utilities must live on the wrapper that Motion
// actually animates, not the inner element — otherwise an absolutely
// positioned button (e.g. a dialog close button, carousel arrow) visually
// drifts from where its own position classes say it should be, since the
// wrapper's transform applies around its own (unrelated) box.
const POSITION_CLASS = /^-?(absolute|relative|fixed|sticky|static|inset(-|$)|top-|right-|bottom-|left-|translate-x-|translate-y-|rotate-|my-auto$|mx-auto$)/

function splitPositionClasses(className?: string) {
  const classes = (className ?? "").split(/\s+/).filter(Boolean)
  const position: string[] = []
  const rest: string[] = []
  for (const cls of classes) {
    ;(POSITION_CLASS.test(cls) ? position : rest).push(cls)
  }
  return { position: position.join(" "), rest: rest.join(" ") }
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: Omit<ButtonPrimitiveProps, "className"> &
  React.RefAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    className?: string
  }) {
  const { position, rest } = splitPositionClasses(className)
  const fullWidth = isFullWidth(rest)

  return (
    <motion.span
      whileTap={{ scale: 0.96 }}
      transition={fluidPress}
      className={position || undefined}
      style={
        position
          ? undefined
          : fullWidth
            ? { display: "flex", width: "100%" }
            : { display: "inline-flex" }
      }
    >
      <ButtonPrimitive
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className: rest }))}
        {...props}
      />
    </motion.span>
  )
}

function LinkButton({
  className,
  variant = "default",
  size = "default",
  ...props
}: Omit<LinkPrimitiveProps, "className"> &
  VariantProps<typeof buttonVariants> & {
    className?: string
  }) {
  const { position, rest } = splitPositionClasses(className)
  const fullWidth = isFullWidth(rest)

  return (
    <motion.span
      whileTap={{ scale: 0.96 }}
      transition={fluidPress}
      className={position || undefined}
      style={
        position
          ? undefined
          : fullWidth
            ? { display: "flex", width: "100%" }
            : { display: "inline-flex" }
      }
    >
      <LinkPrimitive
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className: rest }))}
        {...props}
      />
    </motion.span>
  )
}

export { Button, LinkButton, buttonVariants }
