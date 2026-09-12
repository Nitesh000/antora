"use client"

import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"
import {
  Checkbox as CheckboxPrimitive,
  composeRenderProps,
  type CheckboxProps,
} from "react-aria-components"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const
const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const

function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <motion.span
      whileTap={{ scale: 0.92 }}
      transition={fluidPress}
      style={{ display: "inline-flex" }}
    >
      <CheckboxPrimitive
        data-slot="checkbox"
        className={cn(
          "cn-checkbox cn-checkbox-aria peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          className
        )}
        {...props}
      >
        {composeRenderProps(
          children,
          (children, { isSelected, isIndeterminate }) => (
            <>
              <span
                data-slot="checkbox-indicator"
                className="cn-checkbox-indicator grid place-content-center text-current transition-none"
              >
                <AnimatePresence>
                  {(isSelected || isIndeterminate) && (
                    <motion.span
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
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              {children}
            </>
          )
        )}
      </CheckboxPrimitive>
    </motion.span>
  )
}

export { Checkbox }
