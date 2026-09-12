"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { motion } from "motion/react"
import { cn } from "cn"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      render={
        <motion.input
          whileTap={{ scale: 0.99 }}
          whileFocus={{ scale: 1.01 }}
          transition={fluidPress}
        />
      }
      {...props}
    />
  )
}

export { Input }
