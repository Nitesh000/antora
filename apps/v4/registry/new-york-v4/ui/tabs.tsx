"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { motion } from "motion/react"
import { Tabs as TabsPrimitive } from "radix-ui"

// Near-critically damped: the indicator glides into place with only a hint of
// settle instead of ringing back and forth across the label.
const fluidIndicator = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.9,
} as const

const TabsContext = React.createContext<{ value?: string; id: string }>({
  value: undefined,
  id: "",
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
  const [value, setValue] = React.useState(valueProp ?? defaultValue)
  const currentValue = valueProp !== undefined ? valueProp : value

  const handleValueChange = (val: string) => {
    setValue(val)
    onValueChange?.(val)
  }

  // Scope the sliding indicator to this Tabs instance. A shared layoutId makes
  // every Tabs on the page fly its indicator between lists.
  const id = React.useId()

  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      value={valueProp}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    >
      <TabsContext.Provider value={{ value: currentValue, id }}>
        {children}
      </TabsContext.Provider>
    </TabsPrimitive.Root>
  )
}

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center rounded-2xl bg-muted p-1.5 text-muted-foreground group-data-[orientation=horizontal]/tabs:h-12 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
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
  const { value: activeValue, id } = React.useContext(TabsContext)
  const isActive = activeValue === value

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "relative inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-4 py-2 text-sm font-medium whitespace-nowrap text-foreground/70 transition-colors group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive && "text-foreground",
        className
      )}
      {...props}
    >
      {/* One indicator per Tabs instance, slid between triggers. It sits at
          z-0 under every label (z-10), so it never covers the text of the
          triggers it travels across, and it is a pill or an underline
          depending on the list variant. */}
      {isActive && (
        <motion.span
          layoutId={`${id}-tab-indicator`}
          data-slot="tabs-indicator"
          className="pointer-events-none absolute z-0 rounded-[inherit] group-data-[variant=default]/tabs-list:inset-0 group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-border/30 group-data-[variant=default]/tabs-list:bg-background group-data-[variant=default]/tabs-list:shadow-sm group-data-[variant=line]/tabs-list:rounded-full group-data-[variant=line]/tabs-list:bg-foreground group-data-[orientation=horizontal]/tabs:group-data-[variant=line]/tabs-list:inset-x-0 group-data-[orientation=horizontal]/tabs:group-data-[variant=line]/tabs-list:-bottom-[5px] group-data-[orientation=horizontal]/tabs:group-data-[variant=line]/tabs-list:h-0.5 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:inset-y-0 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:-right-1 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:w-0.5"
          transition={fluidIndicator}
        />
      )}
      <span className="relative z-10 inline-flex items-center justify-center [gap:inherit]">
        {children}
      </span>
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-2 flex-1 outline-none data-[state=active]:animate-in data-[state=active]:duration-200 data-[state=active]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
