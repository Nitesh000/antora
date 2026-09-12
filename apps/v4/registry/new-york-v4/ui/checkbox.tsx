"use client"

import * as React from "react"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const
const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const

function Checkbox({
  className,
  checked: controlledChecked,
  defaultChecked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const [internalChecked, setInternalChecked] = React.useState<
    boolean | "indeterminate"
  >(defaultChecked ?? false)
  const isChecked =
    controlledChecked !== undefined ? controlledChecked : internalChecked

  return (
    <CheckboxPrimitive.Root
      asChild
      data-slot="checkbox"
      checked={isChecked}
      onCheckedChange={(val) => {
        if (controlledChecked === undefined) {
          setInternalChecked(val)
        }
        onCheckedChange?.(val)
      }}
      {...props}
    >
      <motion.button
        whileTap={{ scale: 0.94 }}
        transition={fluidPress}
        className={cn(
          "peer size-5 shrink-0 rounded-[6px] border-2 border-border shadow-xs outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          className
        )}
      >
        <AnimatePresence>
          {isChecked === true && (
            <CheckboxPrimitive.Indicator
              asChild
              forceMount
              data-slot="checkbox-indicator"
              className="grid place-content-center text-current"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={fluidPop}
              >
                <CheckIcon className="size-4" strokeWidth={3} />
              </motion.div>
            </CheckboxPrimitive.Indicator>
          )}
        </AnimatePresence>
      </motion.button>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
