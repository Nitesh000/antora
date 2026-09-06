"use client"

import * as React from "react"
import { cn } from "cn"
import { Dialog as SheetPrimitive } from "radix-ui"
import { motion, AnimatePresence } from "motion/react"

import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const fluidSheet = { type: "spring", stiffness: 350, damping: 30, mass: 1 }
const fluidOverlay = { type: "spring", stiffness: 300, damping: 30, mass: 1 }

const SheetContext = React.createContext<{ isOpen: boolean }>({ isOpen: false })

function Sheet({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  return (
    <SheetContext.Provider value={{ isOpen }}>
      <SheetPrimitive.Root
        data-slot="sheet"
        open={isOpen}
        onOpenChange={(val) => {
          if (controlledOpen === undefined) {
            setInternalOpen(val)
          }
          onOpenChange?.(val)
        }}
        {...props}
      />
    </SheetContext.Provider>
  )
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  const context = React.useContext(SheetContext)
  return (
    <AnimatePresence>
      {context.isOpen && (
        <SheetPrimitive.Overlay
          asChild
          forceMount
          data-slot="sheet-overlay"
          {...props}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fluidOverlay}
            className={cn(
              "cn-sheet-overlay fixed inset-0 z-50",
              className
            )}
          />
        </SheetPrimitive.Overlay>
      )}
    </AnimatePresence>
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  const context = React.useContext(SheetContext)

  const slideVariants = {
    top: { y: "-100%" },
    bottom: { y: "100%" },
    left: { x: "-100%" },
    right: { x: "100%" },
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <AnimatePresence>
        {context.isOpen && (
          <SheetPrimitive.Content
            asChild
            forceMount
            data-slot="sheet-content"
            data-side={side}
            {...props}
          >
            <motion.div
              initial={{ ...slideVariants[side], opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ ...slideVariants[side], opacity: 0 }}
              transition={fluidSheet}
              className={cn(
                "cn-sheet-content",
                className
              )}
            >
              {children}
              {showCloseButton && (
                <SheetPrimitive.Close data-slot="sheet-close" asChild>
                  <Button variant="ghost" className="cn-sheet-close" size="icon-sm">
                    <IconPlaceholder
                      lucide="XIcon"
                      tabler="IconX"
                      hugeicons="Cancel01Icon"
                      phosphor="XIcon"
                      remixicon="RiCloseLine"
                    />
                    <span className="sr-only">Close</span>
                  </Button>
                </SheetPrimitive.Close>
              )}
            </motion.div>
          </SheetPrimitive.Content>
        )}
      </AnimatePresence>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("cn-sheet-header flex flex-col", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("cn-sheet-footer mt-auto flex flex-col", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("cn-sheet-title cn-font-heading", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("cn-sheet-description", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
