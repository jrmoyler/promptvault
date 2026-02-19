"use client";

import TopBar from "@/components/layout/TopBar";
import VirtualPromptList from "@/components/prompts/VirtualPromptList";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useLibraryPrompts, useFlatPrompts, useTotalCount } from "@/hooks/usePrompts";
import { useAppStore, useFilter } from "@/store/useAppStore";
import { CATEGORIES, getToolConfig } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ─── Category filter chips ────────────────────────────────────────────────────
function FilterChips() {
  const filter = useFilter();
  const setCategoryFilter = useAppStore((s) => s.setCategoryFilter);
  const setToolFilter = useAppStore((s) => s.setToolFilter);

  return (
    <div className="flex items-center gap-2 px-6 py-3 overflow-x-auto scrollbar-hide border-b border-[rgba(120,100,255,0.06)]">
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
  );
}

// ─── Active tool filter banner ────────────────────────────────────────────────
function ToolFilterBanner() {
  const filter = useFilter();
  const setToolFilter = useAppStore((s) => s.setToolFilter);

  if (!filter.toolFilter) return null;
  const cfg = getToolConfig(filter.toolFilter);

  return (
    <div className="flex items-center gap-3 mx-6 mt-4 px-4 py-2.5 rounded-xl bg-accent/8 border border-accent/20 text-sm">
      <span className="text-base">{cfg.emoji}</span>
      <span className="text-text-primary font-medium">
        Filtering by: <span className="text-accent">{cfg.name}</span>
      </span>
      <button
        onClick={() => setToolFilter(null)}
        className="ml-auto text-muted hover:text-accent3 transition-colors text-xs cursor-pointer"
        aria-label="Clear tool filter"
      >
        × Clear
      </button>
    </div>
  );
}

// ─── Stats strip ──────────────────────────────────────────────────────────────
function StatsStrip() {
  return (
    <div className="grid grid-cols-3 gap-3 mx-6 mt-6 mb-2">
      {[
        { value: "5,010+", label: "Total Prompts", icon: "⚡" },
        { value: "38",     label: "AI Tools",       icon: "🤖" },
        { value: "24",     label: "Categories",     icon: "📂" },
      ].map(({ value, label, icon }) => (
        <div
          key={label}
          className="bg-surface border border-[rgba(120,100,255,0.1)] rounded-xl px-4 py-3 text-center"
        >
          <div className="text-lg mb-0.5">{icon}</div>
          <div className="font-display font-bold text-xl text-text-primary gradient-text">
            {value}
          </div>
          <div className="text-muted text-[11px]">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LibraryPage() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useLibraryPrompts();

  const prompts = useFlatPrompts(data);
  const total = useTotalCount(data);

  return (
    <main className="flex flex-col min-h-full">
      <TopBar showSearch showFilters={false} />
      <FilterChips />
      <ToolFilterBanner />
      <StatsStrip />

      <div className="px-6 pb-12 mt-6">
        <ErrorBoundary>
          <VirtualPromptList
            prompts={prompts}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={!!hasNextPage}
            fetchNextPage={fetchNextPage}
            total={total}
            emptyMessage="No prompts match your search or filters"
            emptyIcon="🔍"
          />
        </ErrorBoundary>
      </div>
    </main>
  );
}
