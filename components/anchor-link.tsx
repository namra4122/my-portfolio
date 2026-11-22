"use client"

import type * as React from "react"
import { isHttpUrl } from "@/lib/url"

type AnchorLinkProps = React.PropsWithChildren<{
  /** A same-page hash like "#projects", or an absolute http(s) URL (opens in a new tab). */
  href: string
  className?: string
  onNavigated?: () => void
}> &
  // Pass-through attributes (e.g. data-track for analytics). target/rel are derived from href.
  Omit<React.ComponentPropsWithoutRef<"a">, "href" | "className" | "onClick" | "target" | "rel">

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

export function AnchorLink({ href, className, children, onNavigated, ...rest }: AnchorLinkProps) {
  if (isHttpUrl(href)) {
    return (
      <a
        {...rest}
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onNavigated?.()}
      >
        {children}
      </a>
    )
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!href.startsWith("#")) return
    e.preventDefault()
    // Update hash without jumping, then smooth-scroll.
    history.pushState(null, "", href)
    scrollToId(href.slice(1))
    onNavigated?.()
  }

  return (
    <a {...rest} href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  )
}
