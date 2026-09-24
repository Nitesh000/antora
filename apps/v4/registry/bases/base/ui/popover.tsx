"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"

const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const

const PopoverContext = React.createContext<{ isOpen: boolean }>({ isOpen: false })

function Popover({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: PopoverPrimitive.Root.Props) {
  const [internalOpen, setInternalOpen] = React.useState(
    controlledOpen ?? defaultOpen ?? false
  )
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  return (
    <PopoverContext.Provider value={{ isOpen }}>
      <PopoverPrimitive.Root
        data-slot="popover"
        open={controlledOpen}
        defaultOpen={defaultOpen}
        onOpenChange={(val, eventDetails) => {
          setInternalOpen(val)
          onOpenChange?.(val, eventDetails)
        }}
        {...props}
      />
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const context = React.useContext(PopoverContext)

  return (
    <AnimatePresence>
      {context.isOpen && (
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner
            align={align}
            alignOffset={alignOffset}
            side={side}
            sideOffset={sideOffset}
            className="isolate z-50"
          >
            <PopoverPrimitive.Popup
              data-slot="popover-content"
              render={
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 4 }}
                  transition={fluidPop}
                />
              }
              className={cn(
                "cn-popover-content cn-popover-content-logical z-50 w-72 origin-(--transform-origin) outline-hidden",
                className
              )}
              {...props}
            />
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("cn-popover-header", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("cn-popover-title", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("cn-popover-description", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
