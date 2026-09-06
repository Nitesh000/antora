import * as React from "react"
import { cn } from "cn"
import { motion } from "motion/react"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 }

function Textarea({ className, ...props }: React.ComponentProps<typeof motion.textarea>) {
  return (
    <motion.textarea
      whileTap={{ scale: 0.99, transition: fluidPress }}
      whileFocus={{ scale: 1.01, transition: fluidPress }}
      data-slot="textarea"
      className={cn(
        "cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
