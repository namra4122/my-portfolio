import "@/app/globals.css"
import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export const metadata: Metadata = {
  title: "Namra Maniar — Backend Engineer",
  description:
    "Backend Software Engineer skilled in Python, Go, and JavaScript. Building scalable APIs and microservices with AWS, Docker, and CI/CD.",
  keywords: [
    "backend engineer",
    "software engineer",
    "Python",
    "Go",
    "JavaScript",
    "TypeScript",
    "AWS",
    "microservices",
    "APIs",
    "Docker",
  ],
  authors: [{ name: "Namra Maniar" }],
  creator: "Namra Maniar",
  openGraph: {
    title: "Namra Maniar — Backend Engineer",
    description:
      "Backend Software Engineer building scalable APIs and microservices",
    url: "https://maniarnamra.com",
    siteName: "Namra Maniar Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/hero_pic_3.png",
        width: 1200,
        height: 630,
        alt: "Namra Maniar - Backend Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ManiarNamra",
    creator: "@ManiarNamra",
    title: "Namra Maniar — Backend Engineer",
    description:
      "Backend Software Engineer building scalable APIs and microservices",
    images: ["/hero_pic_3.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://maniarnamra.com"),
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Namra Maniar",
  jobTitle: "Backend Software Engineer",
  url: "https://maniarnamra.com",
  sameAs: [
    "https://github.com/namra4122",
    "https://linkedin.com/in/namra-maniar",
    "https://x.com/ManiarNamra",
  ],
  email: "mailto:hey@maniarnamra.com",
  knowsAbout: ["Python", "Go", "JavaScript", "AWS", "Microservices", "Docker"],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline focus:outline-2"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
