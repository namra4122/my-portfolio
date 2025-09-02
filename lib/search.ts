import { content, type PortfolioContent, type Project, type BlogPost, type Experience } from "./content"

export type SearchResult = {
  id: string
  title: string
  section: "about" | "projects" | "skills" | "experience" | "learning" | "contributions" | "blog" | "contact" | "links"
  snippet: string
  href?: string // internal anchor or external url
  meta?: Record<string, string>
}

/**
 * Fuzzy search across the shared content source.
 * - Multi-token queries
 * - Exact/prefix bonuses per token
 * - Subsequence matching with adjacency weighting
 * - Section-aware weights and final sort by score
 */
export function searchContent(query: string, source: PortfolioContent = content): SearchResult[] {
  const qRaw = (query || "").trim()
  if (!qRaw) return []
  const q = norm(qRaw)
  const tokens = q.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return []

  const results: (SearchResult & { score: number })[] = []

  // About
  {
    const blockOriginal = [source.fullName, source.education, source.summary, ...(source.learning || [])]
      .filter(Boolean)
      .join(" • ")
    const block = norm(blockOriginal)
    const score = sectionWeightedScore(tokens, block, 0.9) // About is important
    if (score > 0) {
      results.push({
        id: "about",
        title: "About Me",
        section: "about",
        snippet: makeSnippet(blockOriginal, tokens),
        href: "#about",
        score,
      })
    }
  }

  // Skills
  {
    const skillTextOriginal = [
      ...(source.skills?.coreStack || []),
      ...(source.skills?.domains || []),
      ...(source.skills?.interests || []),
    ].join(", ")
    const block = norm(skillTextOriginal)
    const score = sectionWeightedScore(tokens, block, 0.75)
    if (score > 0) {
      results.push({
        id: "skills",
        title: "Skills",
        section: "skills",
        snippet: makeSnippet(skillTextOriginal, tokens),
        href: "#skills",
        score,
      })
    }
  }
  // Projects
  ; (source.projects || []).forEach((p: Project) => {
    const blockOriginal = [p.title, p.description, ...(p.technologies || [])].join(" • ")
    const block = norm(blockOriginal)
    const score = sectionWeightedScore(tokens, block, 1.0) + titleBoost(tokens, p.title)
    if (score > 0) {
      results.push({
        id: `project-${p.id}`,
        title: `Project: ${p.title}`,
        section: "projects",
        snippet: makeSnippet(blockOriginal, tokens),
        href: "#projects",
        meta: { tech: (p.technologies || []).join(", ") },
        score,
      })
    }
  })

    // Experience
    ; (source.experience || []).forEach((e: Experience, idx: number) => {
      const header = `${e.role} @ ${e.company} (${e.period})`
      const blockOriginal = `${header} — ${e.summary}`
      const block = norm(blockOriginal)
      const score = sectionWeightedScore(tokens, block, 0.95) + titleBoost(tokens, header)
      if (score > 0) {
        results.push({
          id: `exp-${idx}`,
          title: `Experience: ${e.role} @ ${e.company}`,
          section: "experience",
          snippet: makeSnippet(blockOriginal, tokens),
          href: "#experience",
          score,
        })
      }
    })

  // Learning
  {
    const learningTextOriginal = (source.learning || []).join(" • ")
    if (learningTextOriginal) {
      const score = sectionWeightedScore(tokens, norm(learningTextOriginal), 0.6)
      if (score > 0) {
        results.push({
          id: "learning",
          title: "Learning",
          section: "learning",
          snippet: makeSnippet(learningTextOriginal, tokens),
          href: "#about",
          score,
        })
      }
    }
  }

  // Contributions
  {
    const contribTextOriginal = (source.contributions || []).join(" • ")
    if (contribTextOriginal) {
      const score = sectionWeightedScore(tokens, norm(contribTextOriginal), 0.65)
      if (score > 0) {
        results.push({
          id: "contrib",
          title: "Contributions",
          section: "contributions",
          snippet: makeSnippet(contribTextOriginal, tokens),
          href: "#projects",
          score,
        })
      }
    }
  }
  // Blog
  ; (source.blog || []).forEach((b: BlogPost) => {
    const blockOriginal = `${b.title} — ${b.excerpt}`
    const block = norm(blockOriginal)
    const score = sectionWeightedScore(tokens, block, 0.7) + titleBoost(tokens, b.title)
    if (score > 0) {
      results.push({
        id: `blog-${b.id}`,
        title: `Blog: ${b.title}`,
        section: "blog",
        snippet: makeSnippet(blockOriginal, tokens),
        href: b.url || "#blog",
        meta: { date: b.date },
        score,
      })
    }
  })

  // Contact
  {
    const contactBlockOriginal = Object.entries(source.contact || {})
      .filter(([, v]) => Boolean(v))
      .map(([k, v]) => `${k}: ${v}`)
      .join(" • ")
    if (contactBlockOriginal) {
      const score = sectionWeightedScore(tokens, norm(contactBlockOriginal), 0.55)
      if (score > 0) {
        results.push({
          id: "contact",
          title: "Contact",
          section: "contact",
          snippet: makeSnippet(contactBlockOriginal, tokens),
          href: "#contact",
          score,
        })
      }
    }
  }
  // Links
  ; (source.links || []).forEach((l, idx) => {
    const blockOriginal = `${l.label} — ${l.href}`
    const block = norm(blockOriginal)
    const score = sectionWeightedScore(tokens, block, 0.5)
    if (score > 0) {
      results.push({
        id: `link-${idx}`,
        title: `Link: ${l.label}`,
        section: "links",
        snippet: makeSnippet(blockOriginal, tokens),
        href: l.href,
        score,
      })
    }
  })

  // Sort by score desc, stable fallback by title asc, take top N
  const ranked = results
    .filter((r) => r.score >= 0.3) // threshold for fuzzy matches
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 24)
    .map(({ score: _score, ...rest }) => rest)

  return ranked
}

/* ------------------------- Fuzzy scoring utilities ------------------------ */

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
}

function titleBoost(tokens: string[], title: string): number {
  const t = norm(title)
  const score = tokens.reduce((acc, tok) => acc + tokenScore(tok, t), 0) / tokens.length
  // small boost so title matches rank above description-only matches
  return score * 0.15
}

function sectionWeightedScore(tokens: string[], block: string, weight = 1): number {
  if (!block) return 0
  const s = tokens.reduce((acc, tok) => acc + tokenScore(tok, block), 0) / tokens.length
  return s * weight
}

/**
 * Token scoring with:
 * - 1.0 for exact substring
 * - 0.85 for word-prefix match
 * - subsequence score in [0, 0.8) with adjacency weighting
 */
function tokenScore(token: string, hay: string): number {
  if (!token || !hay) return 0

  if (hay.includes(token)) return 1

  // word prefix bonus
  const wordPrefix = new RegExp(`(?:^|\\W)${escapeReg(token)}`, "i")
  if (wordPrefix.test(hay)) return 0.85

  // subsequence fuzzy match
  const sub = subsequenceAdjacencyScore(token, hay) // 0..1
  return Math.min(0.8, sub * 0.8)
}

/**
 * Subsequence match with adjacency bonus.
 * Walk through hay; when matching consecutive token chars, increase adjacency.
 * Score normalized by token length and spread.
 */
function subsequenceAdjacencyScore(needle: string, hay: string): number {
  let i = 0 // needle pointer
  let score = 0
  let streak = 0
  let lastMatchIdx = -1

  for (let j = 0; j < hay.length && i < needle.length; j++) {
    if (hay[j] === needle[i]) {
      // adjacency bonus if consecutive in hay
      if (lastMatchIdx >= 0 && j === lastMatchIdx + 1) {
        streak += 1
        score += 1 + streak * 0.3
      } else {
        streak = 0
        score += 1
      }
      lastMatchIdx = j
      i++
    }
  }

  if (i < needle.length) return 0
  // normalize by needle length
  const base = score / needle.length // >=1 with adjacency bumps
  // limit to [0,1.2] then clamp to [0,1]
  return Math.max(0, Math.min(1, base / 1.2))
}

function escapeReg(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/* ----------------------------- Snippet helpers ---------------------------- */

function makeSnippet(original: string, tokens: string[], radius = 160): string {
  if (!original) return ""
  const oNorm = norm(original)
  // try to center around the first token occurrence
  for (const tok of tokens) {
    const idx = oNorm.indexOf(tok)
    if (idx >= 0) {
      const start = Math.max(0, idx - Math.floor(radius / 2))
      const end = Math.min(original.length, idx + tok.length + Math.floor(radius / 2))
      return (start > 0 ? "..." : "") + original.slice(start, end) + (end < original.length ? "..." : "")
    }
  }
  // fallback: chunk from the start
  return original.slice(0, radius) + (original.length > radius ? "..." : "")
}
