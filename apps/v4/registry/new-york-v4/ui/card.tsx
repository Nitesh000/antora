"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "cn"

const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 } as const

function Card({ className, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      layout
      transition={fluidLayout}
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-border/40 bg-card py-6 text-card-foreground shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      layout
      transition={fluidLayout}
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      layout
      transition={fluidLayout}
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      layout
      transition={fluidLayout}
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      layout
      transition={fluidLayout}
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      layout
      transition={fluidLayout}
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      layout
      transition={fluidLayout}
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
