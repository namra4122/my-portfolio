import Script from "next/script"
import { CONSENT_STORAGE_KEY } from "@/lib/analytics"
import { AnalyticsClickTracker } from "@/components/analytics-click-tracker"
import { ConsentBanner } from "@/components/consent-banner"

/**
 * GA4 via gtag.js, loaded only in production builds when
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 *
 * Page views: gtag sends one on the initial load. App Router client-side
 * navigations are covered by GA4 enhanced measurement ("Page changes based on
 * browser history events"), so we deliberately send no manual page_view —
 * doing both would double count.
 *
 * Consent Mode v2: analytics_storage defaults to denied in the EEA, UK and
 * Switzerland and granted elsewhere; ad storage is denied everywhere (no ads).
 * A stored choice from the banner overrides the default before config runs.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
const IS_PRODUCTION = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production"

// Measurement IDs are G- followed by alphanumerics; validating also keeps the
// value safe to interpolate into the inline script below.
const ENABLED = IS_PRODUCTION && !!GA_ID && /^G-[A-Z0-9]+$/.test(GA_ID)

// EEA + UK + CH (ISO 3166-1 alpha-2)
const CONSENT_REQUIRED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL", "NO", "PL", "PT", "RO",
  "SK", "SI", "ES", "SE", "GB", "CH",
]

function initScript(id: string): string {
  return `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:${JSON.stringify(CONSENT_REQUIRED_REGIONS)},wait_for_update:500});
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
try{var c=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});if(c==='granted'||c==='denied'){gtag('consent','update',{analytics_storage:c});}}catch(e){}
gtag('js',new Date());
gtag('config',${JSON.stringify(id)});`
}

export function GoogleAnalytics() {
  if (!ENABLED || !GA_ID) return null
  return (
    <>
      {/* Inline and server-rendered so gtag + consent defaults exist before
          hydration; events fired from early effects are queued, not lost. */}
      <script id="ga-init" dangerouslySetInnerHTML={{ __html: initScript(GA_ID) }} />
      <Script
        id="ga-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <AnalyticsClickTracker />
      <ConsentBanner />
    </>
  )
}
