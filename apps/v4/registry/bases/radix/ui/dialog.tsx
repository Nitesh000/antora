"use client"

import * as React from "react"
import { cn } from "cn"
import { Dialog as DialogPrimitive } from "radix-ui"
import { motion, AnimatePresence } from "motion/react"

import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 }
const fluidOverlay = { type: "spring", stiffness: 300, damping: 30, mass: 1 }

const DialogContext = React.createContext<{ isOpen: boolean }>({ isOpen: false })

function Dialog({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  return (
    <DialogContext.Provider value={{ isOpen }}>
      <DialogPrimitive.Root
        data-slot="dialog"
        open={isOpen}
        onOpenChange={(val) => {
          if (controlledOpen === undefined) {
            setInternalOpen(val)
          }
          onOpenChange?.(val)
        }}
        {...props}
      />
    </DialogContext.Provider>
  )
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  const context = React.useContext(DialogContext)
  return (
    <AnimatePresence>
      {context.isOpen && (
        <DialogPrimitive.Overlay
          asChild
          forceMount
          data-slot="dialog-overlay"
          {...props}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fluidOverlay}
            className={cn("cn-dialog-overlay fixed inset-0 isolate z-50", className)}
          />
        </DialogPrimitive.Overlay>
      )}
    </AnimatePresence>
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  const context = React.useContext(DialogContext)
  
  return (
    <DialogPortal>
      <DialogOverlay />
      <AnimatePresence>
        {context.isOpen && (
          <DialogPrimitive.Content
            asChild
            forceMount
            data-slot="dialog-content"
            {...props}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: "-50%", x: "-50%" }}
              animate={{ scale: 1, opacity: 1, y: "-50%", x: "-50%" }}
              exit={{ scale: 0.95, opacity: 0, y: "-50%", x: "-50%" }}
              transition={fluidPop}
              className={cn(
                "cn-dialog-content fixed top-1/2 left-1/2 z-50 w-full outline-none",
                className
              )}
            >
              {children}
              {showCloseButton && (
                <DialogPrimitive.Close data-slot="dialog-close" asChild>
                  <Button variant="ghost" className="cn-dialog-close" size="icon-sm">
                    <IconPlaceholder
                      lucide="XIcon"
                      tabler="IconX"
                      hugeicons="Cancel01Icon"
                      phosphor="XIcon"
                      remixicon="RiCloseLine"
                    />
                    <span className="sr-only">Close</span>
                  </Button>
                </DialogPrimitive.Close>
              )}
            </motion.div>
          </DialogPrimitive.Content>
        )}
      </AnimatePresence>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("cn-dialog-header flex flex-col", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "cn-dialog-footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("cn-dialog-title cn-font-heading", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("cn-dialog-description", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
