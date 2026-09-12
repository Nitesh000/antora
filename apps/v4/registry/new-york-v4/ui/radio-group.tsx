"use client"

import * as React from "react"
import { cn } from "cn"
import { CircleIcon } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

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
  const [internalValue, setInternalValue] = React.useState<string | null>(
    defaultValue ?? null
  )
  const value = controlledValue !== undefined ? controlledValue : internalValue

  return (
    <RadioGroupContext.Provider value={{ value }}>
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        className={cn("grid gap-3", className)}
        value={value}
        onValueChange={(val) => {
          if (controlledValue === undefined) {
            setInternalValue(val)
          }
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
        whileTap={{ scale: 0.92 }}
        transition={fluidPress}
        className={cn(
          "aspect-square size-5 shrink-0 rounded-full border-2 border-border text-primary shadow-xs outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary",
          className
        )}
      >
        <AnimatePresence>
          {isChecked && (
            <RadioGroupPrimitive.Indicator
              asChild
              forceMount
              data-slot="radio-group-indicator"
              className="relative flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={fluidPop}
              >
                <CircleIcon className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 fill-primary text-primary" />
              </motion.div>
            </RadioGroupPrimitive.Indicator>
          )}
        </AnimatePresence>
      </motion.button>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
