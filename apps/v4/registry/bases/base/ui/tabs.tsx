"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "cn"

const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 } as const
const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 } as const

const TabsContext = React.createContext<{ value: unknown }>({
  value: undefined,
})

function Tabs({
  className,
  orientation = "horizontal",
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: TabsPrimitive.Root.Props) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const currentValue = valueProp !== undefined ? valueProp : internalValue

  return (
    <TabsContext.Provider value={{ value: currentValue }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-orientation={orientation}
        value={currentValue}
        onValueChange={(val, ...rest) => {
          if (valueProp === undefined) {
            setInternalValue(val)
          }
          onValueChange?.(val, ...rest)
        }}
        className={cn(
          "cn-tabs group/tabs flex data-horizontal:flex-col",
          className
        )}
        render={<motion.div layout transition={fluidLayout} />}
        {...props}
      />
    </TabsContext.Provider>
  )
}

const tabsListVariants = cva(
  "cn-tabs-list group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
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
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, value, ...props }: TabsPrimitive.Tab.Props) {
  const { value: activeValue } = React.useContext(TabsContext)
  const isActive = activeValue === value

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "cn-tabs-trigger relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap text-foreground/60 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        className
      )}
      render={
        <motion.button whileTap={{ scale: 0.98 }} transition={fluidPress} />
      }
      {...props}
    />
  )
}

function TabsContent({
  className,
  value,
  children,
  ...props
}: TabsPrimitive.Panel.Props) {
  const { value: activeValue } = React.useContext(TabsContext)
  const isActive = activeValue === value

  return (
    <AnimatePresence mode="popLayout">
      {isActive && (
        <TabsPrimitive.Panel
          data-slot="tabs-content"
          value={value}
          keepMounted
          className="cn-tabs-content flex-1 outline-none"
          render={
            <motion.div
              initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(4px)", y: 4 }}
              transition={fluidLayout}
            />
          }
          {...props}
        >
          {children}
        </TabsPrimitive.Panel>
      )}
    </AnimatePresence>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
