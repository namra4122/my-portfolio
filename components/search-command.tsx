"use client";

import * as React from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { searchContent, type SearchResult } from "@/lib/search";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Search } from 'lucide-react';

type SearchCommandProps = {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
};

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

export function SearchCommand(props: SearchCommandProps = { open: false, onOpenChange: () => { } }) {
  const [open, setOpen] = React.useState<boolean>(props.open ?? false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isMac, setIsMac] = React.useState(false);

  const onOpenChange = props.onOpenChange ?? (() => { });
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setOpen((o) => !o);
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    setResults(query ? searchContent(query) : []);
  }, [query]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(navigator.userAgent.includes("Mac"));
    }

    setIsMac(false);
  }, []);

  function goto(res: SearchResult) {
    if (res.href?.startsWith("http")) {
      window.open(res.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (res.href) {
      // anchor on same page
      const url = new URL(window.location.href);
      url.hash = res.href.replace("#", "");
      window.location.hash = url.hash;
      // smooth scroll to anchor
      const el = document.getElementById(res.href.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
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
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        aria-label="Open search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-3 hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono sm:inline">{isMac ? "⌘" : "Ctrl"}+K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={(v) => { setOpen(v); onOpenChange(v); }}>
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
                      {res.href?.startsWith("http") && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
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
