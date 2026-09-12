"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "cn"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 } as const
const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const

const AccordionContext = React.createContext<{ value: unknown[] } | null>(
  null
)
const AccordionItemContext = React.createContext<{ isOpen: boolean } | null>(
  null
)

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  const [internalValue, setInternalValue] = React.useState<unknown[]>(
    props.defaultValue ?? []
  )
  const value = props.value !== undefined ? props.value : internalValue

  return (
    <AccordionContext.Provider value={{ value }}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        className={cn("cn-accordion flex w-full flex-col", className)}
        {...props}
        value={value}
        onValueChange={(val, ...rest) => {
          if (props.value === undefined) {
            setInternalValue(val)
          }
          props.onValueChange?.(val, ...rest)
        }}
      />
    </AccordionContext.Provider>
  )
}

function AccordionItem({
  className,
  value,
  ...props
}: AccordionPrimitive.Item.Props) {
  const context = React.useContext(AccordionContext)
  const isOpen = context ? context.value.includes(value) : false

  return (
    <AccordionItemContext.Provider value={{ isOpen }}>
      <AccordionPrimitive.Item
        data-slot="accordion-item"
        value={value}
        className={cn("cn-accordion-item", className)}
        render={<motion.div layout transition={fluidLayout} />}
        {...props}
      />
    </AccordionItemContext.Provider>
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  const context = React.useContext(AccordionItemContext)
  const isOpen = context?.isOpen ?? false

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "cn-accordion-trigger group/accordion-trigger relative flex flex-1 items-start justify-between border border-transparent outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
        render={
          <motion.button
            layout
            whileTap={{ scale: 0.98 }}
            transition={fluidPress}
          />
        }
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
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  const context = React.useContext(AccordionItemContext)
  const isOpen = context?.isOpen ?? false

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <AccordionPrimitive.Panel
          data-slot="accordion-content"
          keepMounted
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
        </AccordionPrimitive.Panel>
      )}
    </AnimatePresence>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
