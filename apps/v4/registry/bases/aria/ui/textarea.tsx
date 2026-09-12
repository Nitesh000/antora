"use client"

import * as React from "react"
import { cn } from "cn"
import { motion } from "motion/react"
import {
  composeRenderProps,
  TextArea as TextareaPrimitive,
} from "react-aria-components"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const

function Textarea({
  className,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof TextareaPrimitive>) {
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <motion.span
      className="block w-full"
      animate={{ scale: isFocused ? 1.01 : 1 }}
      whileTap={{ scale: 0.99 }}
      transition={fluidPress}
    >
      <TextareaPrimitive
        data-slot="textarea"
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
            "cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )
        )}
        {...props}
      />
    </motion.span>
  )
}

export { Textarea }
