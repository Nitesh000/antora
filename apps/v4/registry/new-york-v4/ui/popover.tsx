"use client"

import * as React from "react"
import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"
import { Popover as PopoverPrimitive } from "radix-ui"

const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const

const PopoverContext = React.createContext<{ isOpen: boolean }>({ isOpen: false })

function Popover({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  return (
    <PopoverContext.Provider value={{ isOpen }}>
      <PopoverPrimitive.Root
        data-slot="popover"
        open={isOpen}
        onOpenChange={(val) => {
          if (controlledOpen === undefined) {
            setInternalOpen(val)
          }
          onOpenChange?.(val)
        }}
        {...props}
      />
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const context = React.useContext(PopoverContext)

  return (
    <AnimatePresence>
      {context.isOpen && (
        <PopoverPrimitive.Portal forceMount>
          <PopoverPrimitive.Content
            asChild
            forceMount
            data-slot="popover-content"
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
                "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-2xl border border-border/40 bg-popover p-6 text-popover-foreground shadow-[0_4px_16px_rgba(0,0,0,0.08)] outline-hidden",
                className
              )}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
}
