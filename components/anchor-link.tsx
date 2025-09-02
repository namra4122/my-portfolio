"use client"

import type * as React from "react"

type AnchorLinkProps = React.PropsWithChildren<{
  href: string // expects hash like "#projects" or an absolute path with hash like "/#projects"
  className?: string
  onNavigated?: () => void
}>

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

export function AnchorLink({ href, className, children, onNavigated }: AnchorLinkProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Only intercept same-page hash anchors
    if (href.startsWith("#")) {
      e.preventDefault()
      const id = href.replace("#", "")
      // Update hash without jumping
      history.pushState(null, "", href)
      scrollToId(id)
      onNavigated?.()
    } else if (href.startsWith("/#")) {
      // route to root and keep hash
      // allow default navigation
    }
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  )
}
