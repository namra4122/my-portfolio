import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { content } from "@/lib/content"
import { SearchCommand } from "@/components/search-command"
import { ArrowRight, Mail, MapPin, Terminal } from "lucide-react"
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/brand-icons"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnchorLink } from "@/components/anchor-link"
import { SmoothScrollOnHash } from "@/components/smooth-scroll"
import { MobileNav } from "@/components/mobile-nav"
import { isHttpUrl } from "@/lib/url"

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
          <AnchorLink href={content.resumeUrl} className="text-muted-foreground hover:text-foreground">
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

const socialLinks = [
  { label: "GitHub", href: content.contact.github, Icon: GithubIcon },
  { label: "LinkedIn", href: content.contact.linkedin, Icon: LinkedinIcon },
  { label: "Twitter", href: content.contact.twitter, Icon: XIcon },
].filter((l): l is typeof l & { href: string } => Boolean(l.href))

function Hero() {
  return (
    <section id="about" className="scroll-mt-24 border-b">
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
          <div id="contact" className="mt-6 flex scroll-mt-24 flex-wrap items-center gap-4 text-sm">
            {content.contact.location && (
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {content.contact.location}
              </span>
            )}
            {content.contact.email && (
              <a
                href={`mailto:${content.contact.email}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" /> Mail
              </a>
            )}
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Icon className="h-4 w-4" /> {label}
              </a>
            ))}
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
            {content.contributions.map((org) => (
              <a
                key={org.id}
                href={org.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-medium">{org.name}</h3>
                  <span className="text-xs text-emerald-700 hover:underline">GitHub →</span>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {org.contributions.map((c) => (
                    <p key={c.title}>
                      <strong>{c.title}:</strong> {c.description}
                    </p>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {org.technologies.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              </a>
            ))}
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
              {...(isHttpUrl(l.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
