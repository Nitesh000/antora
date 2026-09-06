import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "cn"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"
import { motion } from "motion/react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 }

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "cn-navigation-menu group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "cn-navigation-menu-list group flex flex-1 list-none items-center justify-center",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("cn-navigation-menu-item relative", className)}
      {...props}
    />
  )
}

const fluidPress = { type: "spring", stiffness: 600, damping: 20, mass: 1 }

const navigationMenuTriggerStyle = cva(
  "cn-navigation-menu-trigger group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center outline-none disabled:pointer-events-none"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      asChild
      data-slot="navigation-menu-trigger"
      {...props}
    >
      <motion.button
        whileTap={{ scale: 0.98, transition: fluidPress }}
        className={cn(navigationMenuTriggerStyle(), "group", className)}
      >
        {children}{" "}
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconChevronDown"
          hugeicons="ArrowDown01Icon"
          phosphor="CaretDownIcon"
          remixicon="RiArrowDownSLine"
          className="cn-navigation-menu-trigger-icon"
          aria-hidden="true"
        />
      </motion.button>
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "cn-navigation-menu-content top-0 left-0 w-full group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "cn-navigation-menu-viewport-wrapper absolute top-full left-0 isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        asChild
        data-slot="navigation-menu-viewport"
        {...props}
      >
        <motion.div
          layout
          transition={fluidLayout}
          className={cn(
            "cn-navigation-menu-viewport origin-top-center relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden md:w-(--radix-navigation-menu-viewport-width)",
            className
          )}
        />
      </NavigationMenuPrimitive.Viewport>
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      asChild
      data-slot="navigation-menu-link"
      {...props}
    >
      <motion.a
        whileTap={{ scale: 0.98, transition: fluidPress }}
        className={cn("cn-navigation-menu-link cursor-pointer", className)}
      >
        {props.children}
      </motion.a>
    </NavigationMenuPrimitive.Link>
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      asChild
      data-slot="navigation-menu-indicator"
      {...props}
    >
      <motion.div
        layout
        transition={fluidLayout}
        className={cn(
          "cn-navigation-menu-indicator top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
          className
        )}
      >
        <div className="cn-navigation-menu-indicator-arrow relative top-[60%] h-2 w-2 rotate-45" />
      </motion.div>
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
