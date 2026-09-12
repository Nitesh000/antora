"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

import { PAGES_NEW } from "@/lib/docs"
import { Button } from "@/registry/new-york-v4/ui/button"

const fluidPop = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 0.9,
} as const

const navContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
    },
  },
}

const navItem = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: fluidPop },
}

export function MainNav({
  items,
  className,
  ...props
}: Omit<
  React.ComponentProps<"nav">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
> & {
  items: { href: string; label: string }[]
}) {
  const pathname = usePathname()

  return (
    <motion.nav
      variants={navContainer}
      initial="hidden"
      animate="show"
      className={cn("items-center gap-0", className)}
      {...props}
    >
      {items.map((item) => (
        <motion.div key={item.href} variants={navItem} whileTap={{ scale: 0.94, transition: { type: "spring", stiffness: 600, damping: 20 } }}>
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="px-2.5"
          >
            <Link
              href={item.href}
              data-active={pathname === item.href}
              data-new={PAGES_NEW.includes(item.href)}
              className="relative items-center"
            >
              {item.label}
            </Link>
          </Button>
        </motion.div>
      ))}
    </motion.nav>
  )
}
