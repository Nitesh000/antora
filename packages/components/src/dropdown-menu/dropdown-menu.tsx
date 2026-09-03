"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@antora/utilities";

const DropdownMenuContext = React.createContext<{ open: boolean }>({ open: false });

const DropdownMenu = ({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) => {
  const [open, setOpen] = React.useState(defaultOpen || false);
  const isControlled = openProp !== undefined;
  const currentOpen = isControlled ? openProp : open;

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) setOpen(value);
    onOpenChange?.(value);
  };

  return (
    <DropdownMenuPrimitive.Root
      open={currentOpen}
      onOpenChange={handleOpenChange}
      {...props}
    >
      <DropdownMenuContext.Provider value={{ open: currentOpen }}>
        {children}
      </DropdownMenuContext.Provider>
    </DropdownMenuPrimitive.Root>
  );
};

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => {
  const { open } = React.useContext(DropdownMenuContext);

  return (
    <AnimatePresence>
      {open && (
        <DropdownMenuPortal forceMount>
          <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            asChild
            {...props}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-xl bg-surface-container-high p-1 text-on-surface shadow-md",
                className
              )}
            >
              {children}
            </motion.div>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPortal>
      )}
    </AnimatePresence>
  );
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-secondary-container focus:text-secondary-container-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-outline",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-outline/20", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
