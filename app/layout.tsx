import "@/app/globals.css"
import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export const metadata: Metadata = {
  title: "Namra Maniar",
  description:
    "Software engineer focused on backend systems, automation, and security data pipelines. Experienced in Python, Go, microservices, containerization, observability, and CI/CD. Building reliable, high-performance systems at Optiv.",
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
    "Kubernetes",
    "security",
    "observability",
    "CI/CD",
    "RAG",
    "LLMs",
    "FastAPI",
    "Echo",
    "Node.js",
    "Redis",
    "PostgreSQL",
    "MongoDB",
  ],
  authors: [{ name: "Namra Maniar" }],
  creator: "Namra Maniar",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Namra Maniar",
    description:
      "Software engineer focused on backend systems, automation, and security data pipelines. Experienced in Python, Go, microservices, containerization, observability, and CI/CD.",
    url: "https://maniarnamra.com",
    siteName: "Namra Maniar Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/hero_pic_3.png",
        width: 1200,
        height: 630,
        alt: "Namra Maniar - Backend Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ManiarNamra",
    creator: "@ManiarNamra",
    title: "Namra Maniar",
    description:
      "Software engineer focused on backend systems, automation, and security data pipelines.",
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
  knowsAbout: [
    "Python",
    "Go",
    "JavaScript",
    "TypeScript",
    "AWS",
    "Microservices",
    "Docker",
    "Kubernetes",
    "Security Data Pipelines",
    "Observability",
    "CI/CD",
    "RAG",
    "LLMs",
    "FastAPI",
    "Echo",
    "Redis",
    "PostgreSQL",
    "MongoDB",
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background font-sans text-foreground antialiased"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
