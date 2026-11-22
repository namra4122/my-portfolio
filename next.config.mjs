/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production"

// ── Third-party origins ──────────────────────────────────────────────
// Google Analytics / Tag Manager (GA4 via gtag.js)
const GA_SCRIPT = ["https://www.googletagmanager.com"]
const GA_CONNECT_IMG = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
]
// Vercel Web Analytics (served same-origin in prod; these are the fallbacks)
const VERCEL_ANALYTICS = ["https://va.vercel-scripts.com", "https://vitals.vercel-insights.com"]
// Vercel preview toolbar / comments (vercel.live), preview deployments only
const VERCEL_LIVE = ["https://vercel.live"]

// ── Content-Security-Policy ──────────────────────────────────────────
// Static (not nonce-based) so pages stay prerendered and CDN-cacheable.
// 'unsafe-inline' scripts are required for Next's inline hydration payloads
// without nonces; 'unsafe-eval' is only needed by React in development.
const csp = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    ...GA_SCRIPT,
    ...VERCEL_ANALYTICS,
    ...VERCEL_LIVE,
  ],
  "style-src": ["'self'", "'unsafe-inline'", ...VERCEL_LIVE],
  "img-src": ["'self'", "data:", "blob:", ...GA_CONNECT_IMG, ...VERCEL_LIVE, "https://vercel.com"],
  "font-src": ["'self'", ...VERCEL_LIVE, "https://assets.vercel.com"],
  "connect-src": [
    "'self'",
    ...GA_CONNECT_IMG,
    ...VERCEL_ANALYTICS,
    ...VERCEL_LIVE,
    "wss://ws-us3.pusher.com",
  ],
  "frame-src": [...VERCEL_LIVE],
  "worker-src": ["'self'", "blob:"],
  "manifest-src": ["'self'"],
  "media-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  ...(isDev ? {} : { "upgrade-insecure-requests": [] }),
}

const contentSecurityPolicy = Object.entries(csp)
  .map(([directive, sources]) => [directive, ...sources].join(" "))
  .join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
]

const nextConfig = {
  poweredByHeader: false,
  typescript: {
    // Fail builds on type errors
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        // Social cards and icons are meant to be embedded by other origins.
        source: "/:path(opengraph-image|twitter-image|icon.png|apple-icon.png|favicon.ico)",
        headers: [{ key: "Cross-Origin-Resource-Policy", value: "cross-origin" }],
      },
    ]
  },
}

export default nextConfig
