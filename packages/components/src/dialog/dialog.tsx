"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@antora/utilities";
import { IconButton } from "../icon-button/icon-button";

const DialogContext = React.createContext<{ open: boolean }>({ open: false });

const Dialog = ({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) => {
  const [open, setOpen] = React.useState(defaultOpen || false);
  const isControlled = openProp !== undefined;
  const currentOpen = isControlled ? openProp : open;

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) {
      setOpen(value);
    }
    onOpenChange?.(value);
  };

  return (
    <DialogPrimitive.Root
      open={currentOpen}
      onOpenChange={handleOpenChange}
      {...props}
    >
      <DialogContext.Provider value={{ open: currentOpen }}>
        {children}
      </DialogContext.Provider>
    </DialogPrimitive.Root>
  );
};

const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(DialogContext);

  return (
    <AnimatePresence>
      {open && (
        <DialogPortal forceMount>
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="fixed inset-0 z-50 bg-on-surface/20 backdrop-blur-sm pointer-events-auto"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              ref={ref}
              asChild
              {...props}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                className={cn(
                  "pointer-events-auto z-50 grid w-full max-w-lg gap-4 rounded-3xl bg-surface-container-high p-6 shadow-xl sm:rounded-[2rem]",
                  className
                )}
              >
                {children}
                <DialogPrimitive.Close asChild>
                  <IconButton
                    variant="standard"
                    className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-surface transition-opacity hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </IconButton>
                </DialogPrimitive.Close>
              </motion.div>
            </DialogPrimitive.Content>
          </div>
        </DialogPortal>
      )}
    </AnimatePresence>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-xl font-semibold leading-none tracking-tight text-on-surface", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-outline", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
