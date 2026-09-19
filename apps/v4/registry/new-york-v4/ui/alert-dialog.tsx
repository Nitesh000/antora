"use client"

import * as React from "react"
import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { Button } from "@/registry/new-york-v4/ui/button"

const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const
const fluidOverlay = { type: "spring", stiffness: 300, damping: 30, mass: 1 } as const

const AlertDialogContext = React.createContext<{ isOpen: boolean }>({ isOpen: false })

function AlertDialog({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  return (
    <AlertDialogContext.Provider value={{ isOpen }}>
      <AlertDialogPrimitive.Root
        data-slot="alert-dialog"
        open={isOpen}
        onOpenChange={(val) => {
          if (controlledOpen === undefined) {
            setInternalOpen(val)
          }
          onOpenChange?.(val)
        }}
        {...props}
      />
    </AlertDialogContext.Provider>
  )
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  const context = React.useContext(AlertDialogContext)
  return (
    <AnimatePresence>
      {context.isOpen && (
        <AlertDialogPrimitive.Overlay
          asChild
          forceMount
          data-slot="alert-dialog-overlay"
          {...props}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fluidOverlay}
            className={cn("fixed inset-0 z-50 bg-black/50", className)}
          />
        </AlertDialogPrimitive.Overlay>
      )}
    </AnimatePresence>
  )
}

function AlertDialogContent({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: "default" | "sm"
}) {
  const context = React.useContext(AlertDialogContext)

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AnimatePresence>
        {context.isOpen && (
          <AlertDialogPrimitive.Content
            asChild
            forceMount
            data-slot="alert-dialog-content"
            data-size={size}
            {...props}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: "-50%", x: "-50%" }}
              animate={{ scale: 1, opacity: 1, y: "-50%", x: "-50%" }}
              exit={{ scale: 0.95, opacity: 0, y: "-50%", x: "-50%" }}
              transition={fluidPop}
              className={cn(
                "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border bg-background p-6 shadow-lg data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-lg",
                className
              )}
            />
          </AlertDialogPrimitive.Content>
        )}
      </AnimatePresence>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "text-lg font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "mb-2 inline-flex size-16 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-8",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Action
        data-slot="alert-dialog-action"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Cancel
        data-slot="alert-dialog-cancel"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
