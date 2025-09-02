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
  // Minimal CSP (adjust as you add external assets)
  {
    key: "Content-Security-Policy",
    value: [
      "img-src 'self' data:",
      "base-uri 'self'",
      "frame-ancestors 'none'",
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
