"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useAppStore, useFilter } from "@/store/useAppStore";
import { CATEGORIES } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  showSearch?: boolean;
}

export default function TopBar({ title, showSearch = true }: TopBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const filter = useFilter();
  const setSearch = useAppStore((s) => s.setSearch);
  const setCategoryFilter = useAppStore((s) => s.setCategoryFilter);
  const setSort = useAppStore((s) => s.setSort);
  const setToolFilter = useAppStore((s) => s.setToolFilter);
  const openSidebar = useAppStore((s) => s.openSidebar);

  // Debounced search
  const [localSearch, setLocalSearch] = useState(filter.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setSearch(value), 300);
    },
    [setSearch]
  );

  useEffect(() => {
    setLocalSearch(filter.search);
  }, [filter.search]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  // Trigger CMD+K palette from search bar click
  const openPalette = useCallback(() => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  }, []);

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-[rgba(99,102,241,0.06)]">
      {/* Primary row */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 h-14 sm:h-16">
        {/* Hamburger - mobile */}
        <button
          onClick={openSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-muted hover:text-text-primary hover:bg-surface2 transition-all cursor-pointer"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
            <rect width="18" height="2" rx="1" fill="currentColor" />
            <rect y="6" width="12" height="2" rx="1" fill="currentColor" />
            <rect y="12" width="18" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>

        {/* Search input or page title */}
        {showSearch ? (
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/50 pointer-events-none"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search 5,000+ prompts..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Search prompts"
              className="w-full bg-surface2/60 border border-[rgba(99,102,241,0.10)] rounded-xl pl-9 pr-4 sm:pr-16 py-2.5 text-sm text-text-primary placeholder:text-muted/40 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all"
            />
            <button
              onClick={openPalette}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 text-[10px] font-mono text-muted/40 bg-surface px-1.5 py-0.5 rounded border border-[rgba(99,102,241,0.08)] hover:border-accent/20 hover:text-muted/60 transition-all cursor-pointer"
            >
              <span>⌘</span>K
            </button>
          </div>
        ) : (
          <h1 className="font-semibold text-lg sm:text-xl text-text-primary flex-1 tracking-tight">
            {title}
          </h1>
        )}

        {/* Sort */}
        {showSearch && (
          <select
            value={filter.sort}
            onChange={(e) => setSort(e.target.value as typeof filter.sort)}
            aria-label="Sort prompts"
            className="hidden sm:block bg-surface2/60 border border-[rgba(99,102,241,0.10)] text-text-primary text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent/40 transition-all cursor-pointer flex-shrink-0"
          >
            <option value="most-used">Most Used</option>
            <option value="newest">Newest</option>
            <option value="alphabetical">A → Z</option>
          </select>
        )}

        {/* Add Prompt CTA */}
        <Link
          href="/upload"
          className="flex-shrink-0 flex items-center gap-1.5 bg-accent/8 hover:bg-accent/15 text-accent border border-accent/15 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap"
        >
          <span className="text-base leading-none">+</span>
          <span className="hidden sm:inline">Add Prompt</span>
        </Link>
      </div>

      {/* Mobile sort row */}
      {showSearch && (
        <div className="flex sm:hidden items-center gap-2 px-3 pb-2">
          <select
            value={filter.sort}
            onChange={(e) => setSort(e.target.value as typeof filter.sort)}
            aria-label="Sort prompts"
            className="bg-surface2/60 border border-[rgba(99,102,241,0.10)] text-text-primary text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-accent/40 transition-all cursor-pointer"
          >
            <option value="most-used">Most Used</option>
            <option value="newest">Newest</option>
            <option value="alphabetical">A → Z</option>
          </select>
        </div>
      )}

      {/* Category filter chips */}
      {showSearch && (
        <div className="flex items-center gap-2 px-3 sm:px-6 pb-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isActive =
              cat.id === "all"
                ? !filter.categoryFilter && !filter.toolFilter
                : filter.categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setToolFilter(null);
                  setCategoryFilter(cat.id === "all" ? null : cat.id);
                }}
                className={cn(
                  "flex-shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium border transition-all duration-150 cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-accent text-white border-accent shadow-glow-sm"
                    : "bg-surface2/60 text-muted border-[rgba(99,102,241,0.10)] hover:text-text-primary hover:border-accent/25"
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
