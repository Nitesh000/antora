"use client"

import * as React from "react"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Accordion as AccordionPrimitive } from "radix-ui"

const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 } as const
const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const

const AccordionContext = React.createContext<{
  value: string | string[]
} | null>(null)

const AccordionItemContext = React.createContext<{ isOpen: boolean } | null>(
  null
)

function Accordion({
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
          className={cn("overflow-hidden border-b last:border-b-0", className)}
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
          whileTap={{ scale: 0.98 }}
          transition={fluidPress}
          data-slot="accordion-trigger"
          className={cn(
            "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
            className
          )}
        >
          {children}
          <motion.div
            layout
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={fluidLayout}
            className="pointer-events-none shrink-0 translate-y-0.5"
          >
            <ChevronDownIcon className="size-4 text-muted-foreground" />
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
            className="overflow-hidden text-sm"
          >
            <div className={cn("pt-0 pb-4", className)}>{children}</div>
          </motion.div>
        </AccordionPrimitive.Content>
      )}
    </AnimatePresence>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
