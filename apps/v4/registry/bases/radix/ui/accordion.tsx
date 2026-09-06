"use client"

import * as React from "react"
import { cn } from "cn"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { motion, AnimatePresence } from "motion/react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 }
const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 }

const AccordionContext = React.createContext<{
  value: string | string[]
} | null>(null)

const AccordionItemContext = React.createContext<{
  isOpen: boolean
} | null>(null)

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  const isMultiple = props.type === "multiple"
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    props.defaultValue ?? (isMultiple ? [] : "")
  )

  const value = props.value !== undefined ? props.value : internalValue

  return (
    <AccordionContext.Provider value={{ value }}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        className={cn("cn-accordion flex w-full flex-col", className)}
        {...(props as any)}
        value={value}
        onValueChange={(val: any) => {
          if (props.value === undefined) {
            setInternalValue(val)
          }
          ;(props as any).onValueChange?.(val)
        }}
      />
    </AccordionContext.Provider>
  )
}

function AccordionItem({
  className,
  value,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const context = React.useContext(AccordionContext)
  const isOpen = context
    ? Array.isArray(context.value)
      ? context.value.includes(value)
      : context.value === value
    : false

  return (
    <AccordionItemContext.Provider value={{ isOpen }}>
      <AccordionPrimitive.Item asChild value={value} {...props}>
        <motion.div
          layout
          transition={fluidLayout}
          data-slot="accordion-item"
          className={cn("cn-accordion-item overflow-hidden", className)}
        >
          {props.children}
        </motion.div>
      </AccordionPrimitive.Item>
    </AccordionItemContext.Provider>
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const context = React.useContext(AccordionItemContext)
  const isOpen = context?.isOpen ?? false

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger asChild {...props}>
        <motion.button
          layout
          whileTap={{ scale: 0.98, transition: fluidPress }}
          transition={fluidLayout}
          data-slot="accordion-trigger"
          className={cn(
            "cn-accordion-trigger group/accordion-trigger relative flex flex-1 items-start justify-between border border-transparent outline-none disabled:pointer-events-none disabled:opacity-50",
            className
          )}
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
        </motion.button>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const context = React.useContext(AccordionItemContext)
  const isOpen = context?.isOpen ?? false

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <AccordionPrimitive.Content asChild forceMount {...props}>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={fluidLayout}
            data-slot="accordion-content"
            className="cn-accordion-content overflow-hidden"
          >
            <div
              className={cn(
                "cn-accordion-content-inner [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
                className
              )}
            >
              {children}
            </div>
          </motion.div>
        </AccordionPrimitive.Content>
      )}
    </AnimatePresence>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
