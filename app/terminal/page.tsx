"use client"

import * as React from "react"
import { content } from "@/lib/content"
import { searchContent } from "@/lib/search"

type FSNode = {
  type: "dir" | "file"
  name: string
  children?: Record<string, FSNode>
  read?: () => string
  url?: string
}

// Build a simple virtual filesystem derived from shared content
function buildFS(): FSNode {
  const root: FSNode = { type: "dir", name: "", children: {} }

  root.children!["about"] = {
    type: "dir",
    name: "about",
    children: {
      "about.txt": {
        type: "file",
        name: "about.txt",
        read: () =>
          `${content.fullName}\n${content.education}\n\n${content.summary}\n\nLearning:\n- ${(content.learning || []).join("\n- ")}`,
      },
    },
  }

  root.children!["projects"] = {
    type: "dir",
    name: "projects",
    children: Object.fromEntries(
      (content.projects || []).map((p) => [
        p.id,
        {
          type: "dir",
          name: p.id,
          children: {
            "README.md": {
              type: "file",
              name: "README.md",
              read: () =>
                `# ${p.title}\n\n${p.description}\n\nTech: ${p.technologies.join(", ")}\n${(p.links || []).map((l) => `- [${l.label}](${l.href})`).join("\n") || ""
                }`,
            },
          },
        } as FSNode,
      ]),
    ),
  }

  root.children!["skills"] = {
    type: "dir",
    name: "skills",
    children: {
      "skills.txt": {
        type: "file",
        name: "skills.txt",
        read: () =>
          `Core: ${content.skills.coreStack.join(", ")}\nDomains: ${content.skills.domains.join(", ")}\nInterests: ${content.skills.interests.join(", ")}`,
      },
    },
  }

  root.children!["experience"] = {
    type: "dir",
    name: "experience",
    children: {
      "experience.txt": {
        type: "file",
        name: "experience.txt",
        read: () =>
          (content.experience || []).map((e) => `- ${e.role} @ ${e.company} (${e.period})\n  ${e.summary}`).join("\n"),
      },
    },
  }

  root.children!["contact"] = {
    type: "dir",
    name: "contact",
    children: {
      "contact.txt": {
        type: "file",
        name: "contact.txt",
        read: () =>
          Object.entries(content.contact || {})
            .filter(([, v]) => Boolean(v))
            .map(([k, v]) => `- ${k}: ${v}`)
            .join("\n"),
      },
    },
  }

  root.children!["blog"] = {
    type: "dir",
    name: "blog",
    children: Object.fromEntries(
      (content.blog || []).map((b) => [
        `${b.id}.md`,
        {
          type: "file",
          name: `${b.id}.md`,
          read: () => `# ${b.title}\n${b.date}\n\n${b.excerpt}\n\n${b.url ? `Link: ${b.url}` : ""}`,
        } as FSNode,
      ]),
    ),
  }

  root.children!["links"] = {
    type: "dir",
    name: "links",
    children: {
      "links.txt": {
        type: "file",
        name: "links.txt",
        read: () => (content.links || []).map((l) => `- ${l.label}: ${l.href}`).join("\n"),
      },
    },
  }

  return root
}

type Entry = { type: "input" | "output" | "system"; text: string }

// Known commands and direct section commands
const BASE_COMMANDS = ["help", "clear", "ls", "l", "cd", "cat", "open", "search"]
const SECTION_COMMANDS = ["about", "projects", "skills", "experience", "contact", "blog", "links"]
const ALL_COMMANDS = [...BASE_COMMANDS, ...SECTION_COMMANDS]

const SEPARATOR = "───────────────────────────────────────────────────────────────────────────────"

export default function BackendTerminalPage() {
  const [fs] = React.useState<FSNode>(() => buildFS())
  const [cwd, setCwd] = React.useState<string[]>([])
  const [history, setHistory] = React.useState<Entry[]>([
    { type: "system", text: "Welcome to Namra's portfolio terminal. Type 'help' or press Ctrl/Cmd+K to search." },
  ])
  const [input, setInput] = React.useState("")
  const [searchMode, setSearchMode] = React.useState(false)
  const wrapRef = React.useRef<HTMLDivElement | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // global search hotkey
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        activateSearchMode()
        return
      }
      // vim-like navigation
      if (["h", "j", "k", "l"].includes(e.key) && document.activeElement !== inputRef.current) {
        e.preventDefault()
        const el = wrapRef.current
        if (!el) return
        const delta = 80
        if (e.key === "j") el.scrollBy({ top: delta, behavior: "smooth" })
        if (e.key === "k") el.scrollBy({ top: -delta, behavior: "smooth" })
        if (e.key === "h") el.scrollBy({ left: -delta, behavior: "smooth" })
        if (e.key === "l") el.scrollBy({ left: delta, behavior: "smooth" })
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  React.useEffect(() => {
    // autoscroll to bottom on new history
    wrapRef.current?.scrollTo({ top: wrapRef.current.scrollHeight })
  }, [history])

  function pwdNode(): FSNode {
    let node = fs
    for (const part of cwd) {
      node = node.children?.[part] || node
    }
    return node
  }

  function listDir(node: FSNode): string[] {
    if (node.type !== "dir" || !node.children) return []
    return Object.values(node.children)
      .filter((n) => n.type === "dir")
      .map((n) => n.name)
  }

  function listFiles(node: FSNode): string[] {
    if (node.type !== "dir" || !node.children) return []
    return Object.values(node.children)
      .filter((n) => n.type === "file")
      .map((n) => n.name)
  }

  function resolve(path: string[]): FSNode | null {
    let node: FSNode = fs
    for (const part of path) {
      const next = node.children?.[part]
      if (!next) return null
      node = next
    }
    return node
  }

  function activateSearchMode() {
    setHistory((h) => [...h, { type: "system", text: "Search mode: Type your query and press Enter." }])
    setSearchMode(true)
    setInput("")
    inputRef.current?.focus()
  }

  function exec(raw: string) {
    const line = raw.trim()
    if (!line) return
    setHistory((h) => [...h, { type: "input", text: line }])

    // If in search mode, treat input as query
    if (searchMode) {
      const results = searchContent(line)
      if (results.length === 0) {
        setHistory((h) => [...h, { type: "output", text: "Fuzzy search results (0): No results." }])
      } else {
        const list = results
          .map((r, i) => `${i + 1}. [${r.section}] ${r.title}\n   ${r.snippet}\n   ${r.href ? `→ ${r.href}` : ""}`)
          .join("\n")
        const block = `Fuzzy search results (${results.length}):\n${list}\nTip: use direct section commands like 'about' or 'projects'.`
        setHistory((h) => [...h, { type: "output", text: block }])
      }
      setSearchMode(false)
      return
    }

    const [cmd, ...args] = line.split(/\s+/)

    // Direct section commands
    if (SECTION_COMMANDS.includes(cmd)) {
      setHistory((h) => [...h, { type: "output", text: renderSection(cmd) }])
      return
    }

    switch (cmd) {
      case "help": {
        setHistory((h) => [
          ...h,
          {
            type: "output",
            text:
              "Commands:\n" +
              "  ls                       List directories/files\n" +
              "  cd <section|..>          Change directory (about, projects, skills, contact, blog, links)\n" +
              "  cat <file>               View file content (e.g., cat about.txt)\n" +
              "  open <url|#section|section>\n" +
              "                           Open external URL or navigate to Bento section (e.g., open #projects)\n" +
              "  search [query]           Fuzzy search across portfolio (or press Ctrl/Cmd+K)\n" +
              "  clear                    Clear screen\n" +
              "  help                     Show this help\n" +
              "\nDirect section commands:\n" +
              "  about | projects | skills | experience | contact | blog | links\n" +
              "                          Print that section content without cd/cat\n" +
              "\nFeatures:\n" +
              "  Tab completion           Auto-complete commands, cd targets, and file names\n" +
              "  Vim keys                 h/j/k/l scroll the terminal",
          },
        ])
        break
      }
      case "clear": {
        setHistory([])
        break
      }
      case "ls": {
        const node = pwdNode()
        const items = listDir(node)
        const files = listFiles(node)
        const out = [...items, ...files].join("\n") || "."
        setHistory((h) => [...h, { type: "output", text: out }])
        break
      }
      case "l": {
        const node = pwdNode()
        const items = listDir(node)
        const files = listFiles(node)
        const out = [...items, ...files].join("\n") || "."
        setHistory((h) => [...h, { type: "output", text: out }])
        break
      }
      case "cd": {
        if (args.length === 0) {
          setCwd([])
          break
        }
        const target = args[0]
        if (target === "..") {
          setCwd((curr) => curr.slice(0, -1))
          break
        }
        const nextPath = [...cwd, target]
        const node = resolve(nextPath)
        if (!node || node.type !== "dir") {
          setHistory((h) => [...h, { type: "output", text: "Error: No such directory" }])
          break
        }
        setCwd(nextPath)
        break
      }
      case "cat": {
        if (args.length === 0) {
          setHistory((h) => [...h, { type: "output", text: "Usage: cat <file>" }])
          break
        }
        const node = resolve([...cwd, args[0]])
        if (!node || node.type !== "file" || !node.read) {
          setHistory((h) => [...h, { type: "output", text: "Error: File not found" }])
          break
        }
        setHistory((h) => [...h, { type: "output", text: node.read!() }])
        break
      }
      case "open": {
        if (args.length === 0) {
          setHistory((h) => [...h, { type: "output", text: "Usage: open <url|#section|section>" }])
          break
        }
        const rawTarget = args[0]

        // Internal section navigation: "#projects" or "projects"
        const targetSection = rawTarget.startsWith("#")
          ? rawTarget.replace("#", "")
          : SECTION_COMMANDS.includes(rawTarget)
            ? rawTarget
            : null

        if (targetSection) {
          const hash = `#${targetSection}`
          setHistory((h) => [...h, { type: "output", text: `Navigating to ${hash}` }])
          try {
            // Navigate to in-page anchor without reloading
            window.location.hash = hash
          } catch { }
          break
        }

        // External or absolute
        const url = rawTarget
        setHistory((h) => [...h, { type: "output", text: `Opening ${url} ...` }])
        try {
          window.open(url, "_blank", "noopener,noreferrer")
        } catch { }
        break
      }
      case "search": {
        const q = args.join(" ")
        if (!q) {
          activateSearchMode()
        } else {
          const results = searchContent(q)
          const out =
            results.length === 0
              ? "Fuzzy search results (0): No results."
              : `Fuzzy search results (${results.length}):\n` +
              results
                .map(
                  (r, i) => `${i + 1}. [${r.section}] ${r.title}\n   ${r.snippet}\n   ${r.href ? `→ ${r.href}` : ""}`,
                )
                .join("\n")
          setHistory((h) => [...h, { type: "output", text: out }])
        }
        break
      }
      default: {
        setHistory((h) => [
          ...h,
          {
            type: "output",
            text: "Error: Command not found. Type 'help' for available commands.",
          },
        ])
      }
    }
  }

  // Renderers for direct section commands
  function renderSection(section: string): string {
    switch (section) {
      case "about":
        return `${content.fullName}\n${content.education}\n\n${content.summary}\n${(content.learning?.length || 0) > 0 ? `\nLearning:\n- ${content.learning.join("\n- ")}` : ""
          }`
      case "projects":
        return (
          (content.projects || [])
            .map(
              (p, i) =>
                `${i + 1}. ${p.title} [${p.id}]\n   Tech: ${p.technologies.join(", ")}\n   ${p.description}\n   ${(p.links || []).map((l) => `${l.label}: ${l.href}`).join(" • ") || ""
                }`,
            )
            .join("\n\n") || "No projects."
        )
      case "skills":
        return `Core: ${content.skills.coreStack.join(", ")}\nDomains: ${content.skills.domains.join(", ")}\nInterests: ${content.skills.interests.join(", ")}`
      case "experience":
        return (
          (content.experience || [])
            .map((e) => `- ${e.role} @ ${e.company} (${e.period})\n  ${e.summary}`)
            .join("\n\n") || "No experience."
        )
      case "contact":
        return (
          Object.entries(content.contact || {})
            .filter(([, v]) => Boolean(v))
            .map(([k, v]) => `- ${k}: ${v}`)
            .join("\n") || "No contact info."
        )
      case "blog":
        return (
          (content.blog || [])
            .map((b) => `- ${b.title} (${b.date})\n  ${b.excerpt}\n  ${b.url ? b.url : ""}`)
            .join("\n\n") || "No blog posts."
        )
      case "links":
        return (content.links || []).map((l) => `- ${l.label}: ${l.href}`).join("\n") || "No links."
      default:
        return "Unknown section."
    }
  }

  // Tab completion utilities
  function commonPrefix(items: string[]): string {
    if (items.length === 0) return ""
    if (items.length === 1) return items[0]
    let prefix = items[0]
    for (const s of items.slice(1)) {
      let i = 0
      while (i < prefix.length && i < s.length && prefix[i] === s[i]) i++
      prefix = prefix.slice(0, i)
      if (!prefix) break
    }
    return prefix
  }

  function getCandidates(currentInput: string): string[] {
    const caretAtEnd =
      inputRef.current &&
      inputRef.current.selectionStart === inputRef.current.value.length &&
      inputRef.current.selectionEnd === inputRef.current.value.length

    if (!caretAtEnd) return [] // simple: only complete at end

    const parts = currentInput.split(/\s+/).filter(Boolean)
    const isFirstToken = parts.length <= 1
    const lastToken = parts[parts.length - 1] || ""

    // Determine context
    if (isFirstToken) {
      // commands and section names
      const pool = ALL_COMMANDS
      return pool.filter((x) => x.startsWith(lastToken))
    }

    const cmd = parts[0]
    const argPrefix = lastToken

    if (cmd === "cd") {
      const node = pwdNode()
      const dirs = listDir(node).filter((name) => {
        const child = node.children?.[name]
        return child?.type === "dir"
      })
      const pool = ["..", ...dirs]
      return pool.filter((x) => x.startsWith(argPrefix))
    }

    if (cmd === "cat") {
      const node = pwdNode()
      const files = listFiles(node)
      return files.filter((x) => x.startsWith(argPrefix))
    }

    // For open/search or others, no completion for now
    return []
  }

  function handleTabComplete(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Tab") return
    e.preventDefault()
    const curr = input
    const candidates = getCandidates(curr)

    if (candidates.length === 0) return

    const parts = curr.split(/\s+/).filter(Boolean)
    const lastToken = parts[parts.length - 1] || ""
    const isFirstToken = parts.length <= 1

    // Single candidate => full complete
    if (candidates.length === 1) {
      const replacement = candidates[0]
      if (isFirstToken) {
        setInput(replacement + " ")
      } else {
        const before = curr.slice(0, curr.length - lastToken.length)
        setInput(before + replacement + " ")
      }
      return
    }

    // Multiple candidates: expand to common prefix if longer than current
    const cp = commonPrefix(candidates)
    if (cp && cp.length > lastToken.length) {
      if (isFirstToken) {
        setInput(cp)
      } else {
        const before = curr.slice(0, curr.length - lastToken.length)
        setInput(before + cp)
      }
      return
    }

    // Otherwise, print suggestions
    setHistory((h) => [...h, { type: "output", text: candidates.join("    ") }])
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const line = input
    setInput("")
    exec(line)
  }

  const promptPath = "/" + (cwd.join("/") || "")

  return (
    <div className="min-h-screen bg-black text-emerald-400">
      <div className="m-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-emerald-300/80">{content.fullName} — Terminal Interface</div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="text-xs text-emerald-300/80 underline decoration-dotted underline-offset-2 hover:text-emerald-200"
            >
              Back to Bento
            </a>
          </div>
        </div>

        <div
          ref={wrapRef}
          className="h-[90vh] w-full overflow-auto rounded-lg border border-emerald-700/40 bg-black p-4 font-mono text-[13px] leading-relaxed text-emerald-400 shadow-inner outline outline-emerald-900/30"
          style={{ fontFamily: '"Inconsolata", "Fira Code", ui-monospace, monospace' }}
          aria-label="Terminal window"
          role="region"
        >
          <Output history={history} />
          <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2">
            <label htmlFor="cmd" className="sr-only">
              Command input
            </label>
            <div className="flex w-full items-center">
              <span className="mr-2 text-emerald-500">
                {"Namra@portfolio:"}
                {promptPath}
                &nbsp;{">>"}
              </span>
              <input
                id="cmd"
                ref={inputRef}
                className="w-full bg-transparent text-emerald-300 placeholder-emerald-700 outline-none"
                placeholder={
                  searchMode ? "Search query..." : "Type a command (help). Try 'about' or press Tab to autocomplete"
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleTabComplete}
                autoFocus
                aria-label={searchMode ? "Search query" : "Terminal command"}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
              />
            </div>
          </form>
          <div className="mt-2 text-xs text-emerald-700">
            {"Hotkeys: Ctrl/Cmd+K to search • h/j/k/l to scroll • Tab to autocomplete • clear to reset"}
          </div>
        </div>
      </div>
    </div>
  )
}

function Output({ history }: { history?: Entry[] }) {
  const list = history || []
  return (
    <div role="log" aria-live="polite">
      {list.map((e, i) => (
        <div
          key={i}
          className={e.type === "input" ? "text-emerald-200" : e.type === "system" ? "text-emerald-500" : ""}
        >
          {e.type === "input" ? ">>" : ""}
          <pre className="whitespace-pre-wrap">{e.text}</pre>
          {e.type === "output" ? (
            <div role="separator" aria-hidden="true" className="my-2 text-emerald-700">
              {SEPARATOR}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
