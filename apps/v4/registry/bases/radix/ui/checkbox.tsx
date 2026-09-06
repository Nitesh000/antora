"use client"

import * as React from "react"
import { cn } from "cn"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { motion, AnimatePresence } from "motion/react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 }
const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 }

function Checkbox({
  className,
  checked: controlledChecked,
  defaultChecked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const [internalChecked, setInternalChecked] = React.useState<boolean | "indeterminate">(defaultChecked ?? false)
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked

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
        whileTap={{ scale: 0.92, transition: fluidPress }}
        className={cn(
          "cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <AnimatePresence>
          {isChecked === true && (
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
