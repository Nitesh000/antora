"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"
import { Tabs as TabsPrimitive } from "radix-ui"

const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 }
const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 }

const TabsContext = React.createContext<{ value?: string }>({
  value: undefined,
})

function Tabs({
  className,
  orientation = "horizontal",
  value: valueProp,
  defaultValue,
  onValueChange,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [value, setValue] = React.useState(valueProp || defaultValue)
  const isControlled = valueProp !== undefined
  const currentValue = isControlled ? valueProp : value

  const handleValueChange = (val: string) => {
    if (!isControlled) setValue(val)
    onValueChange?.(val)
  }

  return (
    <TabsPrimitive.Root
      asChild
      data-slot="tabs"
      data-orientation={orientation}
      value={currentValue}
      onValueChange={handleValueChange}
      {...props}
    >
      <motion.div
        layout
        transition={fluidLayout}
        className={cn(
          "cn-tabs group/tabs flex data-horizontal:flex-col",
          className
        )}
      >
        <TabsContext.Provider value={{ value: currentValue }}>
          {children}
        </TabsContext.Provider>
      </motion.div>
    </TabsPrimitive.Root>
  )
}

const tabsListVariants = cva(
  "cn-tabs-list group/tabs-list relative inline-flex w-fit items-center justify-center rounded-2xl bg-muted p-1.5 text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "cn-tabs-list-variant-default bg-muted",
        line: "cn-tabs-list-variant-line gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { value: activeValue } = React.useContext(TabsContext)
  const isActive = activeValue === value

  return (
    <TabsPrimitive.Trigger
      asChild
      data-slot="tabs-trigger"
      value={value}
      {...props}
    >
      <motion.button
        whileTap={{ scale: 0.98, transition: fluidPress }}
        className={cn(
          "cn-tabs-trigger relative z-10 inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-4 py-2 text-sm font-medium whitespace-nowrap text-foreground/70 transition-colors group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          isActive && "text-foreground",
          className
        )}
      >
        {isActive && (
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute inset-0 z-[-1] rounded-xl border border-border/30 bg-background shadow-sm"
            transition={fluidLayout}
          />
        )}
        {children}
      </motion.button>
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const { value: activeValue } = React.useContext(TabsContext)
  const isActive = activeValue === value

  return (
    <AnimatePresence mode="popLayout">
      {isActive && (
        <TabsPrimitive.Content asChild forceMount value={value} {...props}>
          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(4px)", y: 4 }}
            transition={fluidLayout}
            data-slot="tabs-content"
            className={cn("cn-tabs-content mt-2 flex-1 outline-none", className)}
          >
            {children}
          </motion.div>
        </TabsPrimitive.Content>
      )}
    </AnimatePresence>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
