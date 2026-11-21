/**
 * Thin, typed wrapper around gtag for GA4 custom events.
 *
 * Rules:
 * - No-op when GA isn't loaded (dev, preview deploys, env var unset), so
 *   call sites never need to guard.
 * - Never send free text a visitor typed (search queries, terminal args),
 *   emails, or anything else that could be PII. Only enums, ids we own and
 *   counts belong in params.
 */

/**
 * Consent is a first-party cookie on .maniarnamra.com (not localStorage) so a
 * choice made here also applies on sites.maniarnamra.com, which reads the same
 * cookie in its /assets/ga.js. Both sites share one GA4 stream and _ga cookie.
 */
export const CONSENT_COOKIE = "ga_consent"
const PARENT_DOMAIN = "maniarnamra.com"
export type ConsentChoice = "granted" | "denied"

export type SocialPlatform = "github" | "linkedin" | "x" | "mail"

export type AnalyticsEvents = {
  resume_click: { location: string }
  social_click: { platform: SocialPlatform; location: string }
  project_link_click: { project_id: string; link_label: string }
  terminal_open: Record<string, never>
  /** `command` is a known command name or "unknown"; arguments are never sent. */
  terminal_command: { command: string; result_count?: number }
  search_open: { method: "keyboard" | "button"; surface: "home" | "terminal" }
  search_select: { section: string; result_id: string; result_count: number }
  search_abandon: { result_count: number }
}

type GtagFn = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: GtagFn
    dataLayer?: unknown[]
  }
}

export function isAnalyticsEnabled(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function"
}

export function trackEvent<E extends keyof AnalyticsEvents>(
  name: E,
  ...[params]: AnalyticsEvents[E] extends Record<string, never> ? [] : [AnalyticsEvents[E]]
): void {
  if (!isAnalyticsEnabled()) return
  window.gtag!("event", name, params ?? {})
}

export function updateConsent(choice: ConsentChoice): void {
  const host = window.location.hostname
  const domain = host === PARENT_DOMAIN || host.endsWith("." + PARENT_DOMAIN) ? `; Domain=.${PARENT_DOMAIN}` : ""
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${CONSENT_COOKIE}=${choice}; Path=/; Max-Age=31536000; SameSite=Lax${domain}${secure}`
  if (!isAnalyticsEnabled()) return
  window.gtag!("consent", "update", { analytics_storage: choice })
  if (choice === "denied") clearGaCookies()
}

export function readConsent(): ConsentChoice | null {
  const m = document.cookie.match(/(?:^|;\s*)ga_consent=(granted|denied)/)
  return m ? (m[1] as ConsentChoice) : null
}

/** Remove _ga / _ga_<stream> cookies set before consent was withdrawn. */
function clearGaCookies(): void {
  const host = window.location.hostname
  const parts = host.split(".")
  // gtag's cookie_domain "auto" uses the highest settable domain, e.g. .maniarnamra.com
  const domains = ["", host, ...parts.slice(1).map((_, i) => "." + parts.slice(i + 1).join("."))]
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim()
    if (name !== "_ga" && !name.startsWith("_ga_")) continue
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`
    }
  }
}

export const OPEN_CONSENT_EVENT = "open-consent-preferences"

/** Classify an outbound href into a social platform, or null if it isn't one. */
export function socialPlatformFor(href: string): SocialPlatform | null {
  if (href.startsWith("mailto:")) return "mail"
  let host: string
  try {
    host = new URL(href).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
  if (host === "github.com") return "github"
  if (host === "linkedin.com" || host.endsWith(".linkedin.com")) return "linkedin"
  if (host === "x.com" || host === "twitter.com") return "x"
  return null
}
