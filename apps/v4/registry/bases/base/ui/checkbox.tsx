"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "cn"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const
const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const

function Checkbox({
  className,
  checked: controlledChecked,
  defaultChecked,
  onCheckedChange,
  ...props
}: CheckboxPrimitive.Root.Props) {
  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked ?? false
  )
  const isChecked =
    controlledChecked !== undefined ? controlledChecked : internalChecked

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={isChecked}
      onCheckedChange={(val, ...rest) => {
        if (controlledChecked === undefined) {
          setInternalChecked(val)
        }
        onCheckedChange?.(val, ...rest)
      }}
      className={cn(
        "cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      render={
        <motion.button whileTap={{ scale: 0.92 }} transition={fluidPress} />
      }
      {...props}
    >
      <AnimatePresence>
        {isChecked && (
          <CheckboxPrimitive.Indicator
            keepMounted
            data-slot="checkbox-indicator"
            className="cn-checkbox-indicator grid place-content-center text-current transition-none"
            render={
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={fluidPop}
              />
            }
          >
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              phosphor="CheckIcon"
              remixicon="RiCheckLine"
            />
          </CheckboxPrimitive.Indicator>
        )}
      </AnimatePresence>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
