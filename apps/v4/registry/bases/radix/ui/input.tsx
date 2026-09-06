import * as React from "react"
import { cn } from "cn"
import { motion } from "motion/react"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 }

function Input({ className, type, ...props }: React.ComponentProps<typeof motion.input>) {
  return (
    <motion.input
      type={type}
      whileTap={{ scale: 0.99, transition: fluidPress }}
      whileFocus={{ scale: 1.01, transition: fluidPress }}
      data-slot="input"
      className={cn(
        "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
