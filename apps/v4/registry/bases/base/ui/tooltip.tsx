"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"

const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

const TooltipContext = React.createContext<{ isOpen: boolean }>({ isOpen: false })

function Tooltip({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: TooltipPrimitive.Root.Props) {
  const [internalOpen, setInternalOpen] = React.useState(
    controlledOpen ?? defaultOpen ?? false
  )
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  return (
    <TooltipContext.Provider value={{ isOpen }}>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        open={controlledOpen}
        defaultOpen={defaultOpen}
        onOpenChange={(val, eventDetails) => {
          setInternalOpen(val)
          onOpenChange?.(val, eventDetails)
        }}
        {...props}
      />
    </TooltipContext.Provider>
  )
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const context = React.useContext(TooltipContext)

  return (
    <AnimatePresence>
      {context.isOpen && (
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Positioner
            align={align}
            alignOffset={alignOffset}
            side={side}
            sideOffset={sideOffset}
            className="isolate z-50"
          >
            <TooltipPrimitive.Popup
              data-slot="tooltip-content"
              render={
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 4 }}
                  transition={fluidPop}
                />
              }
              className={cn(
                "cn-tooltip-content cn-tooltip-content-logical z-50 w-fit max-w-xs origin-(--transform-origin) bg-foreground text-background",
                className
              )}
              {...props}
            >
              {children}
              <TooltipPrimitive.Arrow className="cn-tooltip-arrow cn-tooltip-arrow-logical z-50 bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
            </TooltipPrimitive.Popup>
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
