"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore, useFilter } from "@/store/useAppStore";
import { CATEGORIES, getToolConfig, TOOL_CONFIGS } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filter = useFilter();
  const setSearch = useAppStore((s) => s.setSearch);
  const setCategoryFilter = useAppStore((s) => s.setCategoryFilter);
  const setToolFilter = useAppStore((s) => s.setToolFilter);
  const setSort = useAppStore((s) => s.setSort);

  // CMD+K / Ctrl+K listener
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Build results
  const results = useMemo(() => {
    const items: Array<{
      id: string;
      type: "action" | "category" | "tool" | "sort";
      label: string;
      hint?: string;
      emoji?: string;
    }> = [];

    const q = query.toLowerCase().trim();

    // Actions
    const actions = [
      { id: "nav-library", label: "Go to Library", hint: "/library", emoji: "⚡" },
      { id: "nav-favorites", label: "Go to Favorites", hint: "/favorites", emoji: "★" },
      { id: "nav-trending", label: "Go to Trending", hint: "/trending", emoji: "🔥" },
      { id: "nav-upload", label: "Upload Prompt", hint: "/upload", emoji: "+" },
      { id: "sort-most-used", label: "Sort by Most Used", hint: "sort", emoji: "📊" },
      { id: "sort-newest", label: "Sort by Newest", hint: "sort", emoji: "🆕" },
      { id: "sort-alphabetical", label: "Sort A → Z", hint: "sort", emoji: "🔤" },
    ];

    for (const a of actions) {
      if (!q || a.label.toLowerCase().includes(q)) {
        items.push({ ...a, type: "action" });
      }
    }

    // Categories
    for (const cat of CATEGORIES) {
      if (cat.id === "all") continue;
      if (!q || cat.label.toLowerCase().includes(q)) {
        items.push({
          id: `cat-${cat.id}`,
          type: "category",
          label: cat.label,
          hint: "category",
          emoji: "📂",
        });
      }
    }

    // Tools
    for (const [toolId, cfg] of Object.entries(TOOL_CONFIGS)) {
      if (!q || cfg.name.toLowerCase().includes(q)) {
        items.push({
          id: `tool-${toolId}`,
          type: "tool",
          label: cfg.name,
          hint: "tool",
          emoji: cfg.emoji,
        });
      }
    }

    // If user typed something that doesn't match commands, offer text search
    if (q && items.length === 0) {
      items.push({
        id: "search-text",
        type: "action",
        label: `Search for "${query}"`,
        hint: "text search",
        emoji: "🔍",
      });
    } else if (q) {
      items.unshift({
        id: "search-text",
        type: "action",
        label: `Search for "${query}"`,
        hint: "text search",
        emoji: "🔍",
      });
    }

    return items.slice(0, 20);
  }, [query]);

  const handleSelect = useCallback(
    (id: string) => {
      setOpen(false);

      if (id === "search-text") {
        setSearch(query);
        router.push("/library");
        return;
      }
      if (id.startsWith("nav-")) {
        const path = id.replace("nav-", "/");
        router.push(path);
        return;
      }
      if (id.startsWith("sort-")) {
        const sortVal = id.replace("sort-", "") as "most-used" | "newest" | "alphabetical";
        setSort(sortVal);
        router.push("/library");
        return;
      }
      if (id.startsWith("cat-")) {
        const catId = id.replace("cat-", "");
        setCategoryFilter(catId);
        router.push("/library");
        return;
      }
      if (id.startsWith("tool-")) {
        const toolId = id.replace("tool-", "");
        setToolFilter(toolId);
        router.push("/library");
        return;
      }
    },
    [query, router, setSearch, setSort, setCategoryFilter, setToolFilter]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[activeIdx]) {
        e.preventDefault();
        handleSelect(results[activeIdx].id);
      }
    },
    [results, activeIdx, handleSelect]
  );

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-bg/70 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-lg mx-4 bg-surface border border-[rgba(99,102,241,0.15)] rounded-2xl shadow-glow overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-[rgba(99,102,241,0.08)]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted flex-shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search prompts, tools, categories..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent py-4 text-sm text-text-primary placeholder:text-muted/50 focus:outline-none"
              />
              <kbd className="text-[10px] font-mono text-muted/40 bg-surface2 px-1.5 py-0.5 rounded border border-[rgba(99,102,241,0.08)]">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
              {results.length === 0 && (
                <div className="text-center text-muted text-sm py-8">
                  No results found
                </div>
              )}
              {results.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-75 cursor-pointer",
                    i === activeIdx
                      ? "bg-accent/10 text-text-primary"
                      : "text-muted hover:bg-surface2"
                  )}
                >
                  <span className="w-5 text-center text-sm flex-shrink-0">
                    {item.emoji}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.hint && (
                    <span className="text-[10px] text-muted/40 font-mono flex-shrink-0">
                      {item.hint}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Footer hints */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[rgba(99,102,241,0.06)] text-[10px] text-muted/40 font-mono">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
