/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Basic security hardening
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()",
  },
  // Comprehensive CSP for Next.js with Vercel Analytics
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; "),
  },
]

const nextConfig = {
  eslint: {
    // Enforce lint in CI/builds
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Fail builds on type errors
    ignoreBuildErrors: false,
  },
  images: {
    // Use Next.js image optimization (or configure your CDN)
    unoptimized: false,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
