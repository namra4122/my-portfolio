"use client"

import * as React from "react"

function scrollToHash(hash: string) {
  const id = hash.replace("#", "")
  const el = document.getElementById(id)
  if (el) {
    // small timeout to ensure layout is ready
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }
}

export function SmoothScrollOnHash() {
  React.useEffect(() => {
    if (window.location.hash) {
      scrollToHash(window.location.hash)
    }
    const onHash = () => {
      if (window.location.hash) {
        scrollToHash(window.location.hash)
      }
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  return null
}
