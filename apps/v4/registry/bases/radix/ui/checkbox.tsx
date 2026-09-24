"use client"

import * as React from "react"
import { cn } from "cn"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { motion, AnimatePresence } from "motion/react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const
const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const

function Checkbox({
  className,
  checked: controlledChecked,
  defaultChecked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  // Mirror Radix's own checked state locally, purely to gate AnimatePresence
  // for the indicator icon — never fed back into Root's `checked`, so Radix
  // remains the single source of truth (controlled or uncontrolled) instead
  // of us re-deriving/overriding it.
  const [isChecked, setIsChecked] = React.useState<boolean | "indeterminate">(
    controlledChecked ?? defaultChecked ?? false
  )
  const effectiveChecked = controlledChecked !== undefined ? controlledChecked : isChecked

  return (
    <CheckboxPrimitive.Root
      asChild
      data-slot="checkbox"
      checked={controlledChecked}
      defaultChecked={defaultChecked}
      onCheckedChange={(val) => {
        setIsChecked(val)
        onCheckedChange?.(val)
      }}
      {...props}
    >
      <motion.button
        whileTap={{ scale: 0.92, transition: fluidPress }}
        className={cn(
          "cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <AnimatePresence>
          {effectiveChecked === true && (
            <CheckboxPrimitive.Indicator
              asChild
              forceMount
              data-slot="checkbox-indicator"
              className="cn-checkbox-indicator grid place-content-center text-current transition-none"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={fluidPop}
              >
                <IconPlaceholder
                  lucide="CheckIcon"
                  tabler="IconCheck"
                  hugeicons="Tick02Icon"
                  phosphor="CheckIcon"
                  remixicon="RiCheckLine"
                />
              </motion.div>
            </CheckboxPrimitive.Indicator>
          )}
        </AnimatePresence>
      </motion.button>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
