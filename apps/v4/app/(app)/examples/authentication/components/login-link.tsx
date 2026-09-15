"use client"

import Link from "next/link"
import { cn } from "cn"

import { buttonVariants } from "@/registry/new-york-v4/ui/button"

export function LoginLink() {
  return (
    <Link
      href="/examples/authentication"
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "absolute top-4 right-4 md:top-8 md:right-8"
      )}
    >
      Login
    </Link>
  )
}
