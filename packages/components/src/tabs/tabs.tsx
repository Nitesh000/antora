"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { cn } from "@antora/utilities";

const TabsContext = React.createContext<{ value?: string }>({ value: undefined });

const Tabs = ({ value: valueProp, defaultValue, onValueChange, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) => {
  const [value, setValue] = React.useState(valueProp || defaultValue);
  const isControlled = valueProp !== undefined;
  const currentValue = isControlled ? valueProp : value;

  const handleValueChange = (val: string) => {
    if (!isControlled) setValue(val);
    onValueChange?.(val);
  };

  return (
    <TabsPrimitive.Root
      value={currentValue}
      onValueChange={handleValueChange}
      {...props}
    >
      <TabsContext.Provider value={{ value: currentValue }}>
        {children}
      </TabsContext.Provider>
    </TabsPrimitive.Root>
  );
};

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-2xl bg-surface-container p-1 text-outline relative",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  const isActive = context.value === value;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2 text-sm font-medium ring-offset-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative z-10",
        isActive ? "text-on-surface" : "hover:text-on-surface/80",
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute inset-0 z-[-1] rounded-xl bg-surface shadow-sm"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {children}
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
