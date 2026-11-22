const SAFE_EXTERNAL_PROTOCOLS = new Set(["http:", "https:", "mailto:"])

/**
 * Returns the normalized URL if `href` is an absolute http(s) or mailto URL,
 * otherwise null. Use before handing user- or content-supplied strings to
 * `window.open`, `location.assign`, or an `<a href>` so that `javascript:`,
 * `data:`, `vbscript:` etc. can never be navigated to.
 */
export function toSafeExternalUrl(href: string | undefined | null): string | null {
  if (!href) return null
  try {
    const url = new URL(href.trim())
    return SAFE_EXTERNAL_PROTOCOLS.has(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

/** True for absolute http(s) URLs, which should open in a new tab. */
export function isHttpUrl(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

/**
 * Opens a vetted external URL. http(s) opens in a new tab without an opener
 * reference; mailto is handed to the OS mail client in the current context.
 * Returns false (and does nothing) for anything else.
 */
export function openExternal(href: string): boolean {
  const safe = toSafeExternalUrl(href)
  if (!safe) return false
  if (safe.startsWith("mailto:")) {
    window.location.href = safe
  } else {
    window.open(safe, "_blank", "noopener,noreferrer")
  }
  return true
}
