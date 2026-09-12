"use client"

import { motion } from "motion/react"
import { cn } from "cn"

const fluidPop = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 0.9,
} as const

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: fluidPop,
  },
}

function PageHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("border-grid", className)} {...props}>
      <div className="container-wrapper">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="container flex flex-col items-center gap-2 px-6 py-8 text-center md:py-16 lg:py-20 xl:gap-4"
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}

function PageHeaderHeading({
  className,
  ...props
}: Omit<
  React.ComponentProps<"h1">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>) {
  return (
    <motion.h1
      variants={item}
      className={cn(
        "leading-tighter max-w-3xl text-3xl font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDescription({
  className,
  ...props
}: Omit<
  React.ComponentProps<"p">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>) {
  return (
    <motion.p
      variants={item}
      className={cn(
        "max-w-4xl text-base text-balance text-foreground sm:text-lg",
        className
      )}
      {...props}
    />
  )
}

function PageActions({
  className,
  ...props
}: Omit<
  React.ComponentProps<"div">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>) {
  return (
    <motion.div
      variants={item}
      className={cn(
        "flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none",
        className
      )}
      {...props}
    />
  )
}

export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading }
