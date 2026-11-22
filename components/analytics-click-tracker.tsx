"use client"

import { useEffect } from "react"
import { socialPlatformFor, trackEvent } from "@/lib/analytics"

/**
 * One delegated listener instead of onClick props on every link, so server
 * components (app/page.tsx) can stay server components.
 *
 * Markup contract:
 *   data-track="resume"                      -> resume_click
 *   data-track="project" data-project-id=... -> project_link_click
 *   (no data-track) github/linkedin/x/mailto -> social_click
 *   data-track-location on any ancestor names where the click happened.
 */
export function AnalyticsClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // left click or middle click (open in new tab)
      if (e.type === "auxclick" && e.button !== 1) return
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null
      if (!a) return

      const location =
        (a.closest("[data-track-location]") as HTMLElement | null)?.dataset.trackLocation ?? "page"
      const kind = a.dataset.track

      if (kind === "resume") {
        trackEvent("resume_click", { location })
        return
      }
      if (kind === "project") {
        trackEvent("project_link_click", {
          project_id: a.dataset.projectId ?? "unknown",
          link_label: (a.dataset.linkLabel ?? a.textContent ?? "").trim().slice(0, 40),
        })
        return
      }
      const platform = socialPlatformFor(a.getAttribute("href") ?? "")
      if (platform) trackEvent("social_click", { platform, location })
    }

    document.addEventListener("click", onClick, { capture: true })
    document.addEventListener("auxclick", onClick, { capture: true })
    return () => {
      document.removeEventListener("click", onClick, { capture: true })
      document.removeEventListener("auxclick", onClick, { capture: true })
    }
  }, [])

  return null
}
