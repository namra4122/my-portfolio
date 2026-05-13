import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { content } from "@/lib/content"
import { SearchCommand } from "@/components/search-command"
import { ArrowRight, Github, Linkedin, Mail, MapPin, Phone, Terminal, createLucideIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnchorLink } from "@/components/anchor-link"
import { SmoothScrollOnHash } from "@/components/smooth-scroll"
import { MobileNav } from "@/components/mobile-nav"
import React from "react"

const XIcon = createLucideIcon("X", [
  [
    "path",
    {
      d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
      stroke: "none",
      fill: "currentColor",
    },
  ],
]);

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen">
      <SmoothScrollOnHash />
      <Header />
      <Hero />
      <Sections />
      <Footer />
    </main>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          {content.fullName}
        </Link>
        <MobileNav />
        <nav className="hidden items-center gap-5 text-sm sm:flex">
          <AnchorLink href="https://drive.google.com/file/d/18VrVOGwgkuFtzb998CVaNY_Gk54xQEPw/view" className="text-muted-foreground hover:text-foreground">
            Resume
          </AnchorLink>
          <AnchorLink href="#experience" className="text-muted-foreground hover:text-foreground">
            Experience
          </AnchorLink>
          <AnchorLink href="#skills" className="text-muted-foreground hover:text-foreground">
            Skills
          </AnchorLink>
          <AnchorLink href="#projects" className="text-muted-foreground hover:text-foreground">
            Projects
          </AnchorLink>
          <AnchorLink href="#open-source" className="text-muted-foreground hover:text-foreground">
            Open Source
          </AnchorLink>
          <Link href="/terminal" className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700">
            <Terminal className="h-4 w-4" /> Terminal
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <SearchCommand />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

function Hero() {

  return (
    <section className="border-b">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{content.fullName}</h1>
          <p className="mt-3 text-muted-foreground">{content.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild>
              <AnchorLink href="#projects" className="inline-flex items-center">
                <span>View Projects</span> <ArrowRight className="ml-2 h-4 w-4" />
              </AnchorLink>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/terminal" className="inline-flex items-center">
                Open Terminal UI <Terminal className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            {content.contact.phone && (
              <a
                href={`tel:${content.contact.phone}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-4 w-4" /> {content.contact.phone}
              </a>
            )}
            {content.contact.location && (
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {content.contact.location}
              </span>
            )}
            <a
              href={content.contact.email || "#"}
              target="_blank"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              rel="noopener noreferrer"
            >
              <Mail className="h-4 w-4" /> Mail
            </a>
            <a
              href={content.contact.github || "#"}
              target="_blank"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a
              href={content.contact.linkedin || "#"}
              target="_blank"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href={content.contact.twitter || "#"}
              target="_blank"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              rel="noopener noreferrer"
            >
              <XIcon className="h-4 w-4" /> Twitter
            </a>
          </div>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
          <Image
            src="/hero_pic_3.png"
            alt="Namra Maniar - Backend Engineer"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}

function Sections() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div id="experience" className="scroll-mt-24 md:col-span-3" />
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {content.experience.map((e) => (
              <div key={e.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{e.role}</p>
                    <p className="text-sm text-muted-foreground">@ {e.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{e.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{e.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <div id="skills" className="scroll-mt-24 md:col-span-3" />
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row label="Core Stack" items={content.skills.coreStack} />
            <Row label="Domains" items={content.skills.domains} />
            <Row label="Interests" items={content.skills.interests} />
          </CardContent>
        </Card>

        <div id="projects" className="scroll-mt-24 md:col-span-3" />
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {content.projects.map((p) => (
              <div key={p.id} className="rounded-lg border p-4">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-medium">{p.title}</h3>
                  <div className="flex gap-2">
                    {(p.links || []).map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-700 hover:underline"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.technologies.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div id="open-source" className="scroll-mt-24 md:col-span-3" />
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Open Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href="https://github.com/TeamShiksha"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-medium">Team.Shiksha</h3>
                <span className="text-xs text-emerald-700 hover:underline">GitHub →</span>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong>Multi-tenant Merchandise E-commerce Platform:</strong> Building the Go backend for a community-run e-commerce platform supporting multiple tenants. Designing service boundaries, tenant isolation logic, and API contracts for concurrent store operations.
                </p>
                <p>
                  <strong>Community Website — Contributor Onboarding Module:</strong> Developed a Python-based backend module for the community&apos;s main website to streamline contributor onboarding; built the data models, API endpoints, and onboarding workflow logic to reduce friction for new developers joining the community.
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Go", "Python", "Multi-tenancy", "REST APIs", "DevOps"].map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function Row({ label, items }: { label?: string; items?: string[] }) {
  const _label = label || "Label"
  const _items = items || []
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-22 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">{_label}</span>
      <div className="flex flex-wrap gap-2">
        {_items.map((x) => (
          <Badge key={x} variant="secondary">
            {x}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 text-sm text-muted-foreground">
        <span>
          {"© "}
          {new Date().getFullYear()} {content.fullName}
        </span>
        <div className="flex items-center gap-4">
          {content.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-foreground"
              target={l.href.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
