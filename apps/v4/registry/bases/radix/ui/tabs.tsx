"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { motion } from "motion/react"
import { Tabs as TabsPrimitive } from "radix-ui"

// Scale the pressed element about the pointer: with a centered whileTap scale
// the shrinking hit area slid out from under a press near the left/right edge,
// so mouseup landed on the parent and the click was lost.
function setPressOrigin(event: {
  currentTarget: HTMLElement
  clientX: number
  clientY: number
}) {
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.transformOrigin = `${event.clientX - rect.left}px ${event.clientY - rect.top}px`
}

// Near-critically damped: the indicator glides into place with only a hint of
// settle instead of ringing back and forth across the label.
const fluidIndicator = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.9,
} as const
const fluidPress = {
  type: "spring",
  stiffness: 600,
  damping: 20,
  mass: 1,
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
      value={valueProp}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      className={cn(
        "cn-tabs group/tabs flex data-horizontal:flex-col",
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
  const { value: activeValue, id } = React.useContext(TabsContext)
  const isActive = activeValue === value

  return (
    <TabsPrimitive.Trigger
      asChild
      data-slot="tabs-trigger"
      value={value}
      {...props}
    >
      <motion.button
        onPointerDownCapture={setPressOrigin}
        whileTap={{ scale: 0.98, transition: fluidPress }}
        className={cn(
          "cn-tabs-trigger relative inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-4 py-2 text-sm font-medium whitespace-nowrap text-foreground/70 transition-colors group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          isActive && "text-foreground",
          className
        )}
      >
        {/* One indicator per Tabs instance, slid between triggers. It sits at
            z-0 under every label (z-10), so it never covers the text of the
            triggers it travels across, and it is a pill or an underline
            depending on the list variant. */}
        {isActive && (
          <motion.span
            layoutId={`${id}-tab-indicator`}
            data-slot="tabs-indicator"
            className="pointer-events-none absolute z-0 rounded-[inherit] group-data-[variant=default]/tabs-list:inset-0 group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:bg-background group-data-[variant=default]/tabs-list:shadow-sm group-data-[variant=line]/tabs-list:rounded-full group-data-[variant=line]/tabs-list:bg-foreground group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:inset-x-0 group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:-bottom-[5px] group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:h-0.5 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:inset-y-0 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:-right-1 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:w-0.5 dark:group-data-[variant=default]/tabs-list:border-input dark:group-data-[variant=default]/tabs-list:bg-input/30"
            transition={fluidIndicator}
          />
        )}
        <span className="relative z-10 inline-flex items-center justify-center [gap:inherit]">
          {children}
        </span>
      </motion.button>
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  // Radix unmounts inactive panels, so a mount keyframe is enough: no
  // AnimatePresence/popLayout (which pulls the leaving panel out of flow and
  // makes everything below it jump) and no blur filter.
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "cn-tabs-content mt-2 flex-1 outline-none data-[state=active]:animate-in data-[state=active]:duration-200 data-[state=active]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
