"use client"

import * as React from "react"
import { cn } from "cn"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { motion, AnimatePresence } from "motion/react"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const
const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const

const RadioGroupContext = React.createContext<{ value: string | null }>({
  value: null,
})

function RadioGroup({
  className,
  value: controlledValue,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  // Mirror Radix's own value locally, purely to gate each item's indicator
  // AnimatePresence — never fed back into Root's `value`, so Radix remains
  // the single source of truth (controlled or uncontrolled) instead of us
  // re-deriving/overriding it.
  const [internalValue, setInternalValue] = React.useState<string | null>(
    controlledValue ?? defaultValue ?? null
  )
  const effectiveValue =
    controlledValue !== undefined ? controlledValue : internalValue

  return (
    <RadioGroupContext.Provider value={{ value: effectiveValue }}>
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        className={cn("cn-radio-group w-full", className)}
        value={controlledValue}
        defaultValue={defaultValue}
        onValueChange={(val) => {
          setInternalValue(val)
          onValueChange?.(val)
        }}
        {...props}
      />
    </RadioGroupContext.Provider>
  )
}

function RadioGroupItem({
  className,
  value,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const context = React.useContext(RadioGroupContext)
  const isChecked = context.value === value

  return (
    <RadioGroupPrimitive.Item
      asChild
      data-slot="radio-group-item"
      value={value}
      {...props}
    >
      <motion.button
        whileTap={{ scale: 0.92, transition: fluidPress }}
        className={cn(
          "cn-radio-group-item group/radio-group-item peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <AnimatePresence>
          {isChecked && (
            <RadioGroupPrimitive.Indicator
              asChild
              forceMount
              data-slot="radio-group-indicator"
              className="cn-radio-group-indicator"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={fluidPop}
              >
                <span className="cn-radio-group-indicator-icon" />
              </motion.div>
            </RadioGroupPrimitive.Indicator>
          )}
        </AnimatePresence>
      </motion.button>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
