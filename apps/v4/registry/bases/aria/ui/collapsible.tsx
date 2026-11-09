"use client"

import * as React from "react"
import { cn } from "cn"
import { AnimatePresence, motion } from "motion/react"
import {
  DisclosurePanel as CollapsibleContentPrimitive,
  Disclosure as CollapsiblePrimitive,
  Button as CollapsibleTriggerPrimitive,
  DisclosureStateContext,
  type ButtonProps,
  type DisclosurePanelProps,
  type DisclosureProps,
} from "react-aria-components"

const fluidLayout = {
  type: "spring",
  stiffness: 500,
  damping: 40,
  mass: 1,
} as const
const fluidHeight = {
  type: "spring",
  stiffness: 500,
  damping: 45,
  mass: 1,
} as const

function Collapsible({ ...props }: DisclosureProps) {
  return <CollapsiblePrimitive data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: ButtonProps) {
  return (
    <CollapsibleTriggerPrimitive
      slot="trigger"
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  children,
  ...props
}: DisclosurePanelProps) {
  const state = React.useContext(DisclosureStateContext)
  const isOpen = state?.isExpanded ?? false

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <CollapsibleContentPrimitive data-slot="collapsible-content" {...props}>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={fluidHeight}
            className={cn("overflow-hidden", className)}
          >
            {children}
          </motion.div>
        </CollapsibleContentPrimitive>
      )}
    </AnimatePresence>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
