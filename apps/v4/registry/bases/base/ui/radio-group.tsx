"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "cn"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const
const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const

const RadioGroupContext = React.createContext<{ value: unknown }>({
  value: undefined,
})

function RadioGroup({
  className,
  value: controlledValue,
  defaultValue,
  onValueChange,
  ...props
}: RadioGroupPrimitive.Props) {
  // Mirror Base UI's own value locally, purely to gate each item's
  // indicator AnimatePresence — never fed back into Root's `value`, so
  // Base UI remains the single source of truth instead of us
  // re-deriving/overriding it.
  const [internalValue, setInternalValue] = React.useState(
    controlledValue !== undefined ? controlledValue : defaultValue
  )
  const effectiveValue =
    controlledValue !== undefined ? controlledValue : internalValue

  return (
    <RadioGroupContext.Provider value={{ value: effectiveValue }}>
      <RadioGroupPrimitive
        data-slot="radio-group"
        className={cn("cn-radio-group w-full", className)}
        value={controlledValue}
        defaultValue={defaultValue}
        onValueChange={(val, ...rest) => {
          setInternalValue(val)
          onValueChange?.(val, ...rest)
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
}: RadioPrimitive.Root.Props) {
  const context = React.useContext(RadioGroupContext)
  const isChecked = context.value === value

  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      value={value}
      className={cn(
        "cn-radio-group-item group/radio-group-item peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      render={
        <motion.button whileTap={{ scale: 0.92 }} transition={fluidPress} />
      }
      {...props}
    >
      <AnimatePresence>
        {isChecked && (
          <RadioPrimitive.Indicator
            keepMounted
            data-slot="radio-group-indicator"
            className="cn-radio-group-indicator"
            render={
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={fluidPop}
              />
            }
          >
            <span className="cn-radio-group-indicator-icon" />
          </RadioPrimitive.Indicator>
        )}
      </AnimatePresence>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
