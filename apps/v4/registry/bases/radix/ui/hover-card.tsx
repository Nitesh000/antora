"use client"

import * as React from "react"
import { cn } from "cn"
import { HoverCard as HoverCardPrimitive } from "radix-ui"
import { motion, AnimatePresence } from "motion/react"

const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 }

const HoverCardContext = React.createContext<{ isOpen: boolean }>({ isOpen: false })

function HoverCard({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  return (
    <HoverCardContext.Provider value={{ isOpen }}>
      <HoverCardPrimitive.Root
        data-slot="hover-card"
        open={isOpen}
        onOpenChange={(val) => {
          if (controlledOpen === undefined) {
            setInternalOpen(val)
          }
          onOpenChange?.(val)
        }}
        {...props}
      />
    </HoverCardContext.Provider>
  )
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  const context = React.useContext(HoverCardContext)

  return (
    <AnimatePresence>
      {context.isOpen && (
        <HoverCardPrimitive.Portal data-slot="hover-card-portal" forceMount>
          <HoverCardPrimitive.Content
            asChild
            forceMount
            data-slot="hover-card-content"
            align={align}
            sideOffset={sideOffset}
            {...props}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 4 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 4 }}
              transition={fluidPop}
              className={cn(
                "cn-hover-card-content z-50 origin-(--radix-hover-card-content-transform-origin) outline-hidden",
                className
              )}
            />
          </HoverCardPrimitive.Content>
        </HoverCardPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
