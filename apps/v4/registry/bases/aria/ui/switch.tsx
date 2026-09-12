"use client"

import { cn } from "cn"
import { motion } from "motion/react"
import {
  composeRenderProps,
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from "react-aria-components"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const
const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 } as const

function Switch({
  className,
  size = "default",
  children,
  ...props
}: SwitchPrimitiveProps & {
  size?: "sm" | "default"
}) {
  return (
    <motion.span
      whileTap={{ scale: 0.95 }}
      transition={fluidPress}
      style={{ display: "inline-flex" }}
    >
      <SwitchPrimitive
        data-slot="switch"
        data-size={size}
        className={cn(
          "cn-switch cn-switch-aria peer group/switch relative inline-flex items-center outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {composeRenderProps(children, (children, { isSelected }) => (
          <>
            <motion.span
              layout
              transition={fluidLayout}
              data-slot="switch-thumb"
              data-selected={isSelected || undefined}
              className="cn-switch-thumb cn-switch-thumb-aria pointer-events-none block ring-0"
            />
            {children}
          </>
        ))}
      </SwitchPrimitive>
    </motion.span>
  )
}

export { Switch }
