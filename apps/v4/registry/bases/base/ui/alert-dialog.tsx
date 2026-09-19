"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"

import { Button } from "@/registry/bases/base/ui/button"

const fluidPop = { type: "spring", stiffness: 400, damping: 25, mass: 0.9 } as const
const fluidOverlay = { type: "spring", stiffness: 300, damping: 30, mass: 1 } as const

const AlertDialogContext = React.createContext<{ isOpen: boolean }>({ isOpen: false })

function AlertDialog({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: AlertDialogPrimitive.Root.Props) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  return (
    <AlertDialogContext.Provider value={{ isOpen }}>
      <AlertDialogPrimitive.Root
        data-slot="alert-dialog"
        open={isOpen}
        onOpenChange={(val, eventDetails) => {
          if (controlledOpen === undefined) {
            setInternalOpen(val)
          }
          onOpenChange?.(val, eventDetails)
        }}
        {...props}
      />
    </AlertDialogContext.Provider>
  )
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal
      data-slot="alert-dialog-portal"
      keepMounted
      {...props}
    />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  const context = React.useContext(AlertDialogContext)
  return (
    <AnimatePresence>
      {context.isOpen && (
        <AlertDialogPrimitive.Backdrop
          data-slot="alert-dialog-overlay"
          render={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fluidOverlay}
            />
          }
          className={cn("cn-alert-dialog-overlay fixed inset-0 isolate z-50", className)}
          {...props}
        />
      )}
    </AnimatePresence>
  )
}

function AlertDialogContent({
  className,
  size = "default",
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  size?: "default" | "sm"
}) {
  const context = React.useContext(AlertDialogContext)

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AnimatePresence>
        {context.isOpen && (
          <AlertDialogPrimitive.Popup
            data-slot="alert-dialog-content"
            data-size={size}
            render={
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: "-50%", x: "-50%" }}
                animate={{ scale: 1, opacity: 1, y: "-50%", x: "-50%" }}
                exit={{ scale: 0.95, opacity: 0, y: "-50%", x: "-50%" }}
                transition={fluidPop}
              />
            }
            className={cn(
              "cn-alert-dialog-content group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none",
              className
            )}
            {...props}
          />
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
      className={cn("cn-alert-dialog-header", className)}
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
        "cn-alert-dialog-footer flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      )}
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
      className={cn("cn-alert-dialog-media", className)}
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
      className={cn("cn-alert-dialog-title cn-font-heading", className)}
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
      className={cn("cn-alert-dialog-description", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="alert-dialog-action"
      className={cn("cn-alert-dialog-action", className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogPrimitive.Close.Props &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn("cn-alert-dialog-cancel", className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
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
