"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, useFilter } from "@/store/useAppStore";
import { CATEGORIES } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  showSearch?: boolean;
  showFilters?: boolean;
}

export default function TopBar({
  title,
  showSearch = true,
  showFilters = false,
}: TopBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const filter = useFilter();
  const setSearch = useAppStore((s) => s.setSearch);
  const setCategoryFilter = useAppStore((s) => s.setCategoryFilter);
  const setSort = useAppStore((s) => s.setSort);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!showSearch) {
          router.push("/library");
        }
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [router, showSearch]);

  return (
    <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-xl border-b border-[rgba(120,100,255,0.08)]">
      <div className="flex items-center gap-4 px-6 h-16">
        {/* Title or Search */}
        {showSearch ? (
          <div className="flex-1 relative max-w-xl">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
              🔍
            </span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search 5,000+ prompts…"
              value={filter.search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search prompts"
              className="w-full bg-surface2 border border-[rgba(120,100,255,0.15)] rounded-xl pl-9 pr-16 py-2.5 text-sm text-text-primary placeholder:text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted/50 bg-surface px-1.5 py-0.5 rounded border border-[rgba(120,100,255,0.1)]">
              ⌘K
            </kbd>
          </div>
        ) : (
          <h1 className="font-display font-bold text-xl text-text-primary">
            {title}
          </h1>
        )}

        {/* Sort (only on search-enabled pages) */}
        {showSearch && (
          <select
            value={filter.sort}
            onChange={(e) => setSort(e.target.value as typeof filter.sort)}
            aria-label="Sort prompts"
            className="bg-surface2 border border-[rgba(120,100,255,0.15)] text-text-primary text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent/50 transition-all cursor-pointer"
          >
            <option value="most-used">Most Used</option>
            <option value="newest">Newest</option>
            <option value="alphabetical">A → Z</option>
          </select>
        )}

        {/* Add Prompt button */}
        <a
          href="/upload"
          className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 whitespace-nowrap"
        >
          <span className="text-base leading-none">+</span>
          Add Prompt
        </a>
      </div>

      {/* Filter chips (optional) */}
      {showFilters && (
        <div className="flex items-center gap-2 px-6 pb-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.slice(0, 12).map((cat) => {
            const isActive =
              cat.id === "all"
                ? !filter.categoryFilter
                : filter.categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() =>
                  setCategoryFilter(cat.id === "all" ? null : cat.id)
                }
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-accent text-white border-accent shadow-glow"
                    : "bg-surface2 text-muted border-[rgba(120,100,255,0.15)] hover:text-text-primary hover:border-accent/30"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
