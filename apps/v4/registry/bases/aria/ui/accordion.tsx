"use client"

import * as React from "react"
import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"
import {
  DisclosurePanel as AccordionContentPrimitive,
  Heading as AccordionHeaderPrimitive,
  Disclosure as AccordionItemPrimitive,
  DisclosureGroup as AccordionPrimitive,
  DisclosureStateContext,
  Button as AccordionTriggerPrimitive,
  type ButtonProps,
  type DisclosureGroupProps,
  type DisclosurePanelProps,
  type DisclosureProps,
} from "react-aria-components"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 } as const
const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const

function Accordion({ className, ...props }: DisclosureGroupProps) {
  return (
    <AccordionPrimitive
      data-slot="accordion"
      className={cn("cn-accordion flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, children, ...props }: DisclosureProps) {
  return (
    <AccordionItemPrimitive
      data-slot="accordion-item"
      className={cn("cn-accordion-item", className)}
      {...props}
    >
      <motion.div layout transition={fluidLayout}>
        {children as React.ReactNode}
      </motion.div>
    </AccordionItemPrimitive>
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: Omit<ButtonProps, "children"> & { children: React.ReactNode }) {
  const state = React.useContext(DisclosureStateContext)
  const isOpen = state?.isExpanded ?? false

  return (
    <AccordionHeaderPrimitive className="flex flex-1">
      <motion.div
        className="flex flex-1"
        whileTap={{ scale: 0.98 }}
        transition={fluidPress}
      >
        <AccordionTriggerPrimitive
          slot="trigger"
          data-slot="accordion-trigger"
          className={cn(
            "cn-accordion-trigger group/accordion-trigger relative flex flex-1 items-start justify-between border border-transparent outline-none disabled:pointer-events-none disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
          <motion.div
            layout
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={fluidLayout}
            className="pointer-events-none shrink-0"
          >
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              data-slot="accordion-trigger-icon"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              className="cn-accordion-trigger-icon"
            />
          </motion.div>
        </AccordionTriggerPrimitive>
      </motion.div>
    </AccordionHeaderPrimitive>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: DisclosurePanelProps) {
  const state = React.useContext(DisclosureStateContext)
  const isOpen = state?.isExpanded ?? false

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <AccordionContentPrimitive
          data-slot="accordion-content"
          className="cn-accordion-content overflow-hidden"
          {...props}
        >
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={fluidLayout}
            className={cn(
              "cn-accordion-content-inner [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
              className
            )}
          >
            {children}
          </motion.div>
        </AccordionContentPrimitive>
      )}
    </AnimatePresence>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
