"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  OPEN_CONSENT_EVENT,
  isAnalyticsEnabled,
  readConsent,
  updateConsent,
  type ConsentChoice,
} from "@/lib/analytics"

export function ConsentBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (readConsent() === null) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [])

  if (!open) return null

  function choose(choice: ConsentChoice) {
    updateConsent(choice)
    setOpen(false)
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-lg border bg-background/95 p-4 text-sm shadow-lg backdrop-blur sm:right-4 sm:left-auto sm:mx-0"
    >
      <p className="text-muted-foreground">
        I use Google Analytics cookies to see which pages get read. No ads, no tracking across other
        sites.
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => choose("denied")}>
          Decline
        </Button>
        <Button size="sm" onClick={() => choose("granted")}>
          Accept
        </Button>
      </div>
    </div>
  )
}

/** Footer link to reopen the banner. Renders nothing when GA isn't loaded. */
export function ConsentPreferencesButton({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => setEnabled(isAnalyticsEnabled()), [])
  if (!enabled) return null
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
    >
      Cookies
    </button>
  )
}
