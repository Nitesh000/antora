"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { motion } from "motion/react"
import {
  TabList as TabListPrimitive,
  TabPanel as TabPanelPrimitive,
  Tab as TabPrimitive,
  Tabs as TabsPrimitive,
} from "react-aria-components"

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
  damping: 38,
  mass: 1,
} as const

const TabsIdContext = React.createContext("")

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive>) {
  // Scope the sliding indicator to this Tabs instance.
  const id = React.useId()

  return (
    <TabsIdContext.Provider value={id}>
      <TabsPrimitive
        data-slot="tabs"
        className={cn(
          "cn-tabs group/tabs flex data-horizontal:flex-col",
          className
        )}
        {...props}
      />
    </TabsIdContext.Provider>
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
}: React.ComponentProps<typeof TabListPrimitive> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabListPrimitive
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
  ...props
}: React.ComponentProps<typeof TabPrimitive>) {
  const id = React.useContext(TabsIdContext)

  return (
    <TabPrimitive
      data-slot="tabs-trigger"
      className={cn(
        "cn-tabs-trigger cn-tabs-trigger-aria relative inline-flex h-[calc(100%-1px)] flex-1 cursor-default items-center justify-center whitespace-nowrap text-foreground/60 transition-colors group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        // The active surface is the sliding indicator below, not the trigger.
        "data-selected:bg-transparent data-selected:text-foreground data-selected:shadow-none! dark:data-selected:text-foreground",
        className
      )}
      {...props}
    >
      {(renderProps) => (
        <>
          {/* One indicator per Tabs instance, slid between triggers. It sits at
              z-0 under every label (z-10), so it never covers the text of the
              triggers it travels across, and it is a pill or an underline
              depending on the list variant. */}
          {renderProps.isSelected && (
            <motion.span
              layoutId={`${id}-tab-indicator`}
              data-slot="tabs-indicator"
              className="pointer-events-none absolute z-0 rounded-[inherit] group-data-[variant=default]/tabs-list:inset-0 group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:bg-background group-data-[variant=default]/tabs-list:shadow-sm group-data-[variant=line]/tabs-list:rounded-full group-data-[variant=line]/tabs-list:bg-foreground group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:inset-x-0 group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:-bottom-[5px] group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:h-0.5 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:inset-y-0 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:-right-1 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:w-0.5 dark:group-data-[variant=default]/tabs-list:border-input dark:group-data-[variant=default]/tabs-list:bg-input/30"
              transition={fluidIndicator}
            />
          )}
          <motion.span
            onPointerDownCapture={setPressOrigin}
            tabIndex={-1}
            className="relative z-10 inline-flex items-center justify-center gap-1.5"
            whileTap={{ scale: 0.98 }}
            transition={fluidPress}
          >
            {typeof children === "function" ? children(renderProps) : children}
          </motion.span>
        </>
      )}
    </TabPrimitive>
  )
}

function TabsContent({
  className,
  ...props
}: Omit<React.ComponentProps<typeof TabPanelPrimitive>, "className"> & {
  className?: string
}) {
  // React Aria only renders the selected panel, so a mount keyframe is enough:
  // no AnimatePresence/popLayout (which pulls the leaving panel out of flow and
  // makes everything below it jump) and no blur filter.
  return (
    <TabPanelPrimitive
      data-slot="tabs-content"
      className={cn(
        "cn-tabs-content flex-1 animate-in duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] fade-in-0 outline-none slide-in-from-bottom-1 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
