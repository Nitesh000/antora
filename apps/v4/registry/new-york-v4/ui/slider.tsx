"use client"

import * as React from "react"
import { cn } from "cn"
import { motion } from "motion/react"
import { Slider as SliderPrimitive } from "radix-ui"

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted-foreground/20 data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb asChild key={index}>
          <motion.span
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.2 }}
            transition={fluidPress}
            data-slot="slider-thumb"
            className="block size-5 shrink-0 rounded-full border-2 border-primary bg-primary shadow-sm transition-shadow focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          />
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
