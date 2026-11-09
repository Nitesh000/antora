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
  damping: 38,
  mass: 1,
} as const

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
// Classes that place the button in its parent's layout belong on the Motion
// wrapper (the actual flex/grid child), not on the inner <button>: margins
// (`ml-auto` pushing a toolbar button right), self/order/grid placement and
// z-index. Matched on the utility after any variant prefix (`sm:ml-auto`).
const POSITION_CLASS =
  /^-?(absolute|relative|fixed|sticky|static|inset(-|$)|top-|right-|bottom-|left-|start-|end-|translate-x-|translate-y-|rotate-|m[trblxyse]?-|self-|justify-self-|place-self-|order-|col-(span|start|end)-|row-(span|start|end)-|z-)/

function splitPositionClasses(className?: string) {
  const classes = (className ?? "").split(/\s+/).filter(Boolean)
  const position: string[] = []
  const rest: string[] = []
  for (const cls of classes) {
    const utility = cls.replace(/^(?:[^:[\]]*:|\[[^\]]*\]:)*/, "")
    ;(POSITION_CLASS.test(utility) ? position : rest).push(cls)
  }
  return { position: position.join(" "), rest: rest.join(" ") }
}

// The wrapper is the element Motion animates, so it also has to behave like the
// button it stands in for: stretched wrappers (w-full / flex-1) fill their
// row, and an absolutely positioned wrapper stretched by `inset-y-0 my-auto`
// (carousel arrows, dialog close) must keep its button centered.
const SELF_POSITIONED = /(^|\s)cn-[\w-]+-close(\s|$)/

function wrapperStyle(
  position: string,
  fullWidth: boolean
): React.CSSProperties {
  if (position) {
    return {
      display: "flex",
      alignItems: /\bmy-auto\b/.test(position) ? "center" : undefined,
      justifyContent: /\bmx-auto\b/.test(position) ? "center" : undefined,
    }
  }
  return fullWidth
    ? { display: "flex", width: "100%" }
    : { display: "inline-flex" }
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

  // A style class that positions the button itself (`cn-dialog-close`,
  // `cn-sheet-close`: `absolute top-4 right-4 ...`) can't move to the wrapper
  // with its visuals. Wrapped, the empty in-flow span took a flex slot (an
  // extra gap under the footer) and, once pressed, its transform made it the
  // containing block, so the close button jumped to the bottom of the panel
  // mid-press and the click never landed. Press it with CSS instead.
  if (SELF_POSITIONED.test(rest)) {
    return (
      <ButtonPrimitive
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(
          buttonVariants({ variant, size, className: rest }),
          "transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-out data-pressed:scale-96 motion-reduce:transition-none"
        )}
        {...props}
      />
    )
  }

  return (
    <motion.span
      onPointerDownCapture={setPressOrigin}
      tabIndex={-1}
      whileTap={{ scale: 0.96 }}
      transition={fluidPress}
      className={position || undefined}
      style={wrapperStyle(position, fullWidth)}
    >
      <ButtonPrimitive
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(
          // Fills a stretched Motion wrapper (e.g. inside a flex-col footer) while
          // staying shrink-to-fit in inline contexts.
          "grow",
          buttonVariants({ variant, size, className: rest })
        )}
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
      onPointerDownCapture={setPressOrigin}
      tabIndex={-1}
      whileTap={{ scale: 0.96 }}
      transition={fluidPress}
      className={position || undefined}
      style={wrapperStyle(position, fullWidth)}
    >
      <LinkPrimitive
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(
          // Fills a stretched Motion wrapper (e.g. inside a flex-col footer) while
          // staying shrink-to-fit in inline contexts.
          "grow",
          buttonVariants({ variant, size, className: rest })
        )}
        {...props}
      />
    </motion.span>
  )
}

export { Button, LinkButton, buttonVariants }
