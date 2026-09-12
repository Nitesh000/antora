"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "cn"

const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 } as const

const CollapsibleContext = React.createContext<{ isOpen: boolean } | null>(
  null
)

function Collapsible({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: CollapsiblePrimitive.Root.Props) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  return (
    <CollapsibleContext.Provider value={{ isOpen }}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        open={isOpen}
        onOpenChange={(val, ...rest) => {
          if (controlledOpen === undefined) {
            setInternalOpen(val)
          }
          onOpenChange?.(val, ...rest)
        }}
        {...props}
      />
    </CollapsibleContext.Provider>
  )
}

function CollapsibleTrigger({
  ...props
}: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  )
}

function CollapsibleContent({
  className,
  children,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  const context = React.useContext(CollapsibleContext)
  const isOpen = context?.isOpen ?? false

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <CollapsiblePrimitive.Panel
          data-slot="collapsible-content"
          keepMounted
          render={
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={fluidLayout}
            />
          }
          className={cn("overflow-hidden", className)}
          {...props}
        >
          {children}
        </CollapsiblePrimitive.Panel>
      )}
    </AnimatePresence>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
