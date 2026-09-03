"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@antora/utilities";

const PopoverContext = React.createContext<{ open: boolean }>({ open: false });

const Popover = ({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) => {
  const [open, setOpen] = React.useState(defaultOpen || false);
  const isControlled = openProp !== undefined;
  const currentOpen = isControlled ? openProp : open;

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) setOpen(value);
    onOpenChange?.(value);
  };

  return (
    <PopoverPrimitive.Root
      open={currentOpen}
      onOpenChange={handleOpenChange}
      {...props}
    >
      <PopoverContext.Provider value={{ open: currentOpen }}>
        {children}
      </PopoverContext.Provider>
    </PopoverPrimitive.Root>
  );
};

const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverPortal = PopoverPrimitive.Portal;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
  const { open } = React.useContext(PopoverContext);

  return (
    <AnimatePresence>
      {open && (
        <PopoverPortal forceMount>
          <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            asChild
            {...props}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className={cn(
                "z-50 w-72 rounded-2xl bg-surface-container-high p-4 text-on-surface shadow-lg outline-none",
                className
              )}
            >
              {children}
            </motion.div>
          </PopoverPrimitive.Content>
        </PopoverPortal>
      )}
    </AnimatePresence>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
