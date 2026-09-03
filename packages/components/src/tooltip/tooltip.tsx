"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@antora/utilities";

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipContext = React.createContext<{ open: boolean }>({ open: false });

const Tooltip = ({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  const [open, setOpen] = React.useState(defaultOpen || false);
  const isControlled = openProp !== undefined;
  const currentOpen = isControlled ? openProp : open;

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) setOpen(value);
    onOpenChange?.(value);
  };

  return (
    <TooltipPrimitive.Root
      open={currentOpen}
      onOpenChange={handleOpenChange}
      {...props}
    >
      <TooltipContext.Provider value={{ open: currentOpen }}>
        {children}
      </TooltipContext.Provider>
    </TooltipPrimitive.Root>
  );
};

const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipPortal = TooltipPrimitive.Portal;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => {
  const { open } = React.useContext(TooltipContext);

  return (
    <AnimatePresence>
      {open && (
        <TooltipPortal forceMount>
          <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            asChild
            {...props}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "z-50 overflow-hidden rounded-lg bg-on-surface px-3 py-1.5 text-xs text-surface shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
              )}
            >
              {children}
              <TooltipPrimitive.Arrow className="fill-on-surface" />
            </motion.div>
          </TooltipPrimitive.Content>
        </TooltipPortal>
      )}
    </AnimatePresence>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
