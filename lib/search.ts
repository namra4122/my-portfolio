import { content, type PortfolioContent, type Project, type BlogPost, type Experience } from "./content"

export type SearchResult = {
  id: string
  title: string
  section: "about" | "projects" | "skills" | "experience" | "learning" | "contributions" | "blog" | "contact" | "links"
  snippet: string
  href?: string
  meta?: Record<string, string>
}

/**
 * Simple word-matching search across the portfolio content.
 * Returns results where ALL query words are found (case-insensitive).
 */
export function searchContent(query: string, source: PortfolioContent = content): SearchResult[] {
  const qRaw = (query || "").trim()
  if (!qRaw) return []

  const queryWords = qRaw.toLowerCase().split(/\s+/).filter(Boolean)
  if (queryWords.length === 0) return []

  const results: SearchResult[] = []

  // Helper: check if all query words are found in the text
  function matches(text: string): boolean {
    const lower = text.toLowerCase()
    return queryWords.every((word) => lower.includes(word))
  }

  // Helper: count how many query words match (for ranking)
  function matchCount(text: string): number {
    const lower = text.toLowerCase()
    return queryWords.filter((word) => lower.includes(word)).length
  }

  // About
  {
    const block = [source.fullName, source.education, source.summary, ...(source.learning || [])]
      .filter(Boolean)
      .join(" ")
    if (matches(block)) {
      results.push({
        id: "about",
        title: "About Me",
        section: "about",
        snippet: makeSnippet(block, queryWords),
        href: "#about",
      })
    }
  }

  // Skills
  {
    const block = [
      ...(source.skills?.coreStack || []),
      ...(source.skills?.domains || []),
      ...(source.skills?.interests || []),
    ].join(", ")
    if (matches(block)) {
      results.push({
        id: "skills",
        title: "Skills",
        section: "skills",
        snippet: makeSnippet(block, queryWords),
        href: "#skills",
      })
    }
  }

  // Projects
  ; (source.projects || []).forEach((p: Project) => {
    const block = [p.title, p.description, ...(p.technologies || [])].join(" ")
    if (matches(block)) {
      results.push({
        id: `project-${p.id}`,
        title: `Project: ${p.title}`,
        section: "projects",
        snippet: makeSnippet(block, queryWords),
        href: "#projects",
        meta: { tech: (p.technologies || []).join(", ") },
      })
    }
  })

    // Experience
    ; (source.experience || []).forEach((e: Experience) => {
      const block = `${e.role} @ ${e.company} (${e.period}) — ${e.summary}`
      if (matches(block)) {
        results.push({
          id: `exp-${e.id}`,
          title: `Experience: ${e.role} @ ${e.company}`,
          section: "experience",
          snippet: makeSnippet(block, queryWords),
          href: "#experience",
        })
      }
    })

  // Learning
  {
    const block = (source.learning || []).join(" ")
    if (block && matches(block)) {
      results.push({
        id: "learning",
        title: "Learning",
        section: "learning",
        snippet: makeSnippet(block, queryWords),
        href: "#about",
      })
    }
  }

  // Contributions
  {
    const block = (source.contributions || []).join(" ")
    if (block && matches(block)) {
      results.push({
        id: "contrib",
        title: "Contributions",
        section: "contributions",
        snippet: makeSnippet(block, queryWords),
        href: "#projects",
      })
    }
  }

  // Blog
  ; (source.blog || []).forEach((b: BlogPost) => {
    const block = `${b.title} — ${b.excerpt}`
    if (matches(block)) {
      results.push({
        id: `blog-${b.id}`,
        title: `Blog: ${b.title}`,
        section: "blog",
        snippet: makeSnippet(block, queryWords),
        href: b.url || "#blog",
        meta: { date: b.date },
      })
    }
  })

  // Contact
  {
    const block = Object.entries(source.contact || {})
      .filter(([, v]) => Boolean(v))
      .map(([k, v]) => `${k}: ${v}`)
      .join(" ")
    if (block && matches(block)) {
      results.push({
        id: "contact",
        title: "Contact",
        section: "contact",
        snippet: makeSnippet(block, queryWords),
        href: "#contact",
      })
    }
  }

  // Links
  ; (source.links || []).forEach((l, idx) => {
    const block = `${l.label} — ${l.href}`
    if (matches(block)) {
      results.push({
        id: `link-${idx}`,
        title: `Link: ${l.label}`,
        section: "links",
        snippet: makeSnippet(block, queryWords),
        href: l.href,
      })
    }
  })

  // Sort by match relevance (title matches first, then by section importance)
  const sectionOrder = ["projects", "experience", "skills", "about", "contributions", "blog", "contact", "links", "learning"]

  return results
    .sort((a, b) => {
      // Prioritize results where query appears in title
      const aInTitle = queryWords.some((w) => a.title.toLowerCase().includes(w)) ? 1 : 0
      const bInTitle = queryWords.some((w) => b.title.toLowerCase().includes(w)) ? 1 : 0
      if (bInTitle !== aInTitle) return bInTitle - aInTitle

      // Then by section order
      return sectionOrder.indexOf(a.section) - sectionOrder.indexOf(b.section)
    })
    .slice(0, 20)
}

/* ----------------------------- Snippet helper ----------------------------- */

function makeSnippet(original: string, queryWords: string[], radius = 120): string {
  if (!original) return ""
  const lower = original.toLowerCase()

  // Find first matching word and center snippet around it
  for (const word of queryWords) {
    const idx = lower.indexOf(word)
    if (idx >= 0) {
      const start = Math.max(0, idx - Math.floor(radius / 2))
      const end = Math.min(original.length, idx + word.length + Math.floor(radius / 2))
      return (start > 0 ? "..." : "") + original.slice(start, end).trim() + (end < original.length ? "..." : "")
    }
  }

  // Fallback: return beginning of text
  return original.slice(0, radius).trim() + (original.length > radius ? "..." : "")
}
