"use client";

import TopBar from "@/components/layout/TopBar";
import VirtualPromptList from "@/components/prompts/VirtualPromptList";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useLibraryPrompts, useFlatPrompts, useTotalCount } from "@/hooks/usePrompts";
import { useAppStore, useFilter } from "@/store/useAppStore";
import { getToolConfig } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ─── Active tool filter banner ────────────────────────────────────────────────
function ToolFilterBanner() {
  const filter = useFilter();
  const setToolFilter = useAppStore((s) => s.setToolFilter);

  if (!filter.toolFilter) return null;
  const cfg = getToolConfig(filter.toolFilter);

  return (
    <div className="flex items-center gap-3 mx-3 sm:mx-6 mt-3 sm:mt-4 px-3 sm:px-4 py-2.5 rounded-xl bg-accent/8 border border-accent/20 text-sm">
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
function StatsStrip({ total }: { total: number }) {
  const totalLabel = total > 0 ? `${total.toLocaleString()}+` : "5,000+";

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 mx-3 sm:mx-6 mt-4 sm:mt-6 mb-2">
      {[
        { value: totalLabel, label: "Total Prompts", icon: "⚡" },
        { value: "38",     label: "AI Tools",       icon: "🤖" },
        { value: "24",     label: "Categories",     icon: "📂" },
      ].map(({ value, label, icon }) => (
        <div
          key={label}
          className="bg-surface border border-[rgba(120,100,255,0.1)] rounded-xl px-2 sm:px-4 py-2.5 sm:py-3 text-center"
        >
          <div className="text-lg mb-0.5">{icon}</div>
          <div className="font-display font-bold text-lg sm:text-xl text-text-primary gradient-text">
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
      <TopBar showSearch />
      <ToolFilterBanner />
      <StatsStrip total={total} />

      <div className="px-3 sm:px-6 pb-12 mt-4 sm:mt-6">
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
