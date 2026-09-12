"use client"

import * as React from "react"
import { cn } from "cn"
import { motion } from "motion/react"
import {
  composeRenderProps,
  Input as InputPrimitive,
} from "react-aria-components"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const

function Input({
  className,
  type,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof InputPrimitive>) {
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <motion.span
      className="block w-full"
      animate={{ scale: isFocused ? 1.01 : 1 }}
      whileTap={{ scale: 0.99 }}
      transition={fluidPress}
    >
      <InputPrimitive
        type={type}
        data-slot="input"
        onFocus={(e) => {
          setIsFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          onBlur?.(e)
        }}
        className={composeRenderProps(className, (className) =>
          cn(
            "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )
        )}
        {...props}
      />
    </motion.span>
  )
}

export { Input }
