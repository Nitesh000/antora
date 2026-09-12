"use client"

import * as React from "react"
import { cn } from "cn"
import { motion } from "motion/react"

const fluidLayout = { type: "spring", stiffness: 500, damping: 25, mass: 1 } as const

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof motion.div> & { size?: "default" | "sm" }) {
  return (
    <motion.div
      layout
      transition={fluidLayout}
      data-slot="card"
      data-size={size}
      className={cn("cn-card group/card flex flex-col", className)}
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
        "cn-card-header group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
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
      className={cn("cn-card-title cn-font-heading", className)}
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
      className={cn("cn-card-description", className)}
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
        "cn-card-action col-start-2 row-span-2 row-start-1 self-start justify-self-end",
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
      className={cn("cn-card-content", className)}
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
      className={cn("cn-card-footer flex items-center", className)}
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
