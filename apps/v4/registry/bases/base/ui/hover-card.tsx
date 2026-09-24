"use client"

import * as React from "react"
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"

const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const

const HoverCardContext = React.createContext<{ isOpen: boolean }>({ isOpen: false })

function HoverCard({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: PreviewCardPrimitive.Root.Props) {
  const [internalOpen, setInternalOpen] = React.useState(
    controlledOpen ?? defaultOpen ?? false
  )
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  return (
    <HoverCardContext.Provider value={{ isOpen }}>
      <PreviewCardPrimitive.Root
        data-slot="hover-card"
        open={controlledOpen}
        defaultOpen={defaultOpen}
        onOpenChange={(val, eventDetails) => {
          setInternalOpen(val)
          onOpenChange?.(val, eventDetails)
        }}
        {...props}
      />
    </HoverCardContext.Provider>
  )
}

function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const context = React.useContext(HoverCardContext)

  return (
    <AnimatePresence>
      {context.isOpen && (
        <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
          <PreviewCardPrimitive.Positioner
            align={align}
            alignOffset={alignOffset}
            side={side}
            sideOffset={sideOffset}
            className="isolate z-50"
          >
            <PreviewCardPrimitive.Popup
              data-slot="hover-card-content"
              render={
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 4 }}
                  transition={fluidPop}
                />
              }
              className={cn(
                "cn-hover-card-content cn-hover-card-content-logical z-50 origin-(--transform-origin) outline-hidden",
                className
              )}
              {...props}
            />
          </PreviewCardPrimitive.Positioner>
        </PreviewCardPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
