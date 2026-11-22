"use client";

import * as React from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { searchContent, type SearchResult } from "@/lib/search";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Search } from 'lucide-react';
import { isHttpUrl, openExternal } from "@/lib/url";
import { trackEvent } from "@/lib/analytics";

const SECTION_LABELS: Record<SearchResult["section"], string> = {
  about: "About",
  projects: "Projects",
  skills: "Skills",
  experience: "Experience",
  learning: "Learning",
  contributions: "Contributions",
  blog: "Blog",
  contact: "Contact",
  links: "Links",
};

const noopSubscribe = () => () => { };

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const results = React.useMemo(() => (query ? searchContent(query) : []), [query]);
  // Server render and hydration use the non-Mac label; the client corrects it after.
  const isMac = React.useSyncExternalStore(
    noopSubscribe,
    () => navigator.userAgent.includes("Mac"),
    () => false,
  );

  // Analytics: only counts and ids we own are sent, never the query text.
  // openRef mirrors `open` synchronously so repeated signals (e.g. Escape during
  // the exit animation) aren't counted as new transitions.
  const openRef = React.useRef(false);
  const selectedRef = React.useRef(false);

  function handleOpenChange(next: boolean, method: "keyboard" | "button" = "button") {
    if (next !== openRef.current) {
      if (next) {
        selectedRef.current = false;
        trackEvent("search_open", { method, surface: "home" });
      } else if (!selectedRef.current && query.trim()) {
        trackEvent("search_abandon", { result_count: results.length });
      }
    }
    openRef.current = next;
    setOpen(next);
  }

  const onShortcut = React.useEffectEvent(() => handleOpenChange(!openRef.current, "keyboard"));

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onShortcut();
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  function goto(res: SearchResult) {
    selectedRef.current = true;
    trackEvent("search_select", { section: res.section, result_id: res.id, result_count: results.length });
    const href = res.href;
    if (href?.startsWith("#")) {
      const id = href.slice(1);
      history.pushState(null, "", href);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (href) {
      // Only http(s)/mailto are ever opened; anything else is ignored.
      openExternal(href);
    }
    handleOpenChange(false);
  }

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    const k = SECTION_LABELS[r.section] || r.section;
    (acc[k] ||= []).push(r);
    return acc;
  }, {});

  return (
    <>
      <button
        type="button"
        onClick={() => handleOpenChange(true, "button")}
        className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        aria-label="Open search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-3 hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono sm:inline">{isMac ? "⌘" : "Ctrl"}+K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={(v) => handleOpenChange(v)}>
        <CommandInput value={query} onValueChange={setQuery} placeholder="Search projects, skills, experience, blog..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(grouped).map(([group, items]) => (
            <CommandGroup key={group} heading={group}>
              {items.map((res) => (
                <CommandItem key={res.id} value={`${res.title} ${res.snippet}`} onSelect={() => goto(res)}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{res.title}</span>
                      {res.href && isHttpUrl(res.href) && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
                      {res.meta?.tech && <Badge variant="secondary">{res.meta.tech}</Badge>}
                      {res.meta?.date && <Badge variant="outline">{res.meta.date}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{res.snippet}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
