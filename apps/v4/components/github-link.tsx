import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { Icons } from "@/components/icons"
import { SpringWrap } from "@/components/spring-wrap"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"

export function GitHubLink() {
  return (
    <SpringWrap>
      <Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
        <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
          <Icons.gitHub />
          <React.Suspense fallback={<Skeleton className="h-4 w-[42px]" />}>
            <StarsCount />
          </React.Suspense>
        </Link>
      </Button>
    </SpringWrap>
  )
}

export async function StarsCount() {
  // The star count is decoration: a blocked/rate-limited GitHub API must not
  // throw out of the Suspense boundary (that forces React to discard the server
  // HTML and re-render the whole header on the client, which reads as a flash).
  let stars: number | undefined
  try {
    const data = await fetch("https://api.github.com/repos/Nitesh000/antora", {
      next: { revalidate: 86400 },
    })
    if (data.ok) {
      const json = await data.json()
      stars =
        typeof json.stargazers_count === "number"
          ? json.stargazers_count
          : undefined
    }
  } catch {
    stars = undefined
  }

  if (stars === undefined) {
    return null
  }

  const formattedCount =
    stars >= 1000 ? `${Math.round(stars / 1000)}k` : stars.toLocaleString()

  return (
    <span className="w-fit text-xs text-muted-foreground tabular-nums">
      {formattedCount}
    </span>
  )
}
