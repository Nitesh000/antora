"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const fluidSheet = { type: "spring", stiffness: 350, damping: 30, mass: 1 } as const
const fluidOverlay = { type: "spring", stiffness: 300, damping: 30, mass: 1 } as const

const SheetContext = React.createContext<{ isOpen: boolean }>({ isOpen: false })

function Sheet({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: SheetPrimitive.Root.Props) {
  const [internalOpen, setInternalOpen] = React.useState(
    controlledOpen ?? defaultOpen ?? false
  )
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  return (
    <SheetContext.Provider value={{ isOpen }}>
      <SheetPrimitive.Root
        data-slot="sheet"
        open={controlledOpen}
        defaultOpen={defaultOpen}
        onOpenChange={(val, eventDetails) => {
          setInternalOpen(val)
          onOpenChange?.(val, eventDetails)
        }}
        {...props}
      />
    </SheetContext.Provider>
  )
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" keepMounted {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  const context = React.useContext(SheetContext)
  return (
    <AnimatePresence>
      {context.isOpen && (
        <SheetPrimitive.Backdrop
          data-slot="sheet-overlay"
          render={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fluidOverlay}
            />
          }
          className={cn("cn-sheet-overlay fixed inset-0 z-50", className)}
          {...props}
        />
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
}: SheetPrimitive.Popup.Props & {
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
          <SheetPrimitive.Popup
            data-slot="sheet-content"
            data-side={side}
            render={
              <motion.div
                initial={{ ...slideVariants[side], opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{ ...slideVariants[side], opacity: 0 }}
                transition={fluidSheet}
              />
            }
            className={cn("cn-sheet-content", className)}
            {...props}
          >
            {children}
            {showCloseButton && (
              <SheetPrimitive.Close
                data-slot="sheet-close"
                render={
                  <Button
                    variant="ghost"
                    className="cn-sheet-close"
                    size="icon-sm"
                  />
                }
              >
                <IconPlaceholder
                  lucide="XIcon"
                  tabler="IconX"
                  hugeicons="Cancel01Icon"
                  phosphor="XIcon"
                  remixicon="RiCloseLine"
                />
                <span className="sr-only">Close</span>
              </SheetPrimitive.Close>
            )}
          </SheetPrimitive.Popup>
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

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
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
}: SheetPrimitive.Description.Props) {
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
