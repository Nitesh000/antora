"use client"

import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"
import {
  composeRenderProps,
  RadioGroup as RadioGroupPrimitive,
  Radio as RadioPrimitive,
  type RadioGroupProps,
  type RadioProps,
} from "react-aria-components"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const
const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("cn-radio-group w-full", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, children, ...props }: RadioProps) {
  return (
    <motion.span
      whileTap={{ scale: 0.92 }}
      transition={fluidPress}
      style={{ display: "inline-flex" }}
    >
      <RadioPrimitive
        data-slot="radio-group-item"
        className={cn(
          "cn-radio-group-item cn-radio-group-item-aria group/radio-group-item peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          className
        )}
        {...props}
      >
        {composeRenderProps(children, (children, { isSelected }) => (
          <>
            <span
              data-slot="radio-group-indicator"
              className="cn-radio-group-indicator"
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={fluidPop}
                    className="cn-radio-group-indicator-icon"
                  />
                )}
              </AnimatePresence>
            </span>
            {children}
          </>
        ))}
      </RadioPrimitive>
    </motion.span>
  )
}

export { RadioGroup, RadioGroupItem }
