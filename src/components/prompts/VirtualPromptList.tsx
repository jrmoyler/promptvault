"use client";

import { useEffect, useRef, useCallback } from "react";
import PromptCard from "./PromptCard";
import { cn } from "@/lib/utils";
import type { Prompt } from "@/types";

interface VirtualPromptListProps {
  prompts: Prompt[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  total: number;
  emptyMessage?: string;
  emptyIcon?: string;
}

// ─── Skeleton card for loading state ─────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-surface border border-[rgba(120,100,255,0.08)] rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-5 w-24 bg-surface2 rounded-lg" />
      <div className="h-4 w-full bg-surface2 rounded-lg" />
      <div className="h-4 w-3/4 bg-surface2 rounded-lg" />
      <div className="flex-1 space-y-2 mt-1">
        <div className="h-3 w-full bg-surface2 rounded" />
        <div className="h-3 w-5/6 bg-surface2 rounded" />
        <div className="h-3 w-4/5 bg-surface2 rounded" />
      </div>
      <div className="h-px bg-surface2 mt-auto" />
      <div className="flex justify-between">
        <div className="h-3 w-16 bg-surface2 rounded" />
        <div className="h-3 w-8 bg-surface2 rounded" />
      </div>
    </div>
  );
}

// ─── Sentinel div watched by IntersectionObserver ────────────────────────────
interface SentinelProps {
  onVisible: () => void;
}

function LoadMoreSentinel({ onVisible }: SentinelProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onVisible();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before sentinel enters view
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function VirtualPromptList({
  prompts,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  total,
  emptyMessage = "No prompts found",
  emptyIcon = "🔍",
}: VirtualPromptListProps) {
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Loading skeleton (initial load) ────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        aria-busy="true"
        aria-label="Loading prompts"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!isLoading && prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="text-5xl">{emptyIcon}</span>
        <p className="text-muted text-base">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Result count */}
      <p className="text-muted text-xs font-mono px-0.5">
        Showing{" "}
        <span className="text-accent font-semibold">{prompts.length.toLocaleString()}</span>
        {" "}of{" "}
        <span className="text-text-primary font-semibold">{total.toLocaleString()}</span>{" "}
        prompts
      </p>

      {/* Grid — CSS grid handles responsive layout; only rendered cards exist in DOM */}
      <div
        role="list"
        aria-label="Prompt library"
        className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      >
        {prompts.map((p) => (
          <div key={p.id} role="listitem">
            <PromptCard prompt={p} />
          </div>
        ))}

        {/* Inline skeleton cards while fetching next page */}
        {isFetchingNextPage &&
          Array.from({ length: 6 }, (_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>

      {/* Invisible sentinel triggers next page load automatically */}
      {hasNextPage && !isFetchingNextPage && (
        <LoadMoreSentinel onVisible={handleLoadMore} />
      )}

      {/* End of results */}
      {!hasNextPage && prompts.length > 0 && (
        <p className="text-center text-muted/40 text-xs py-8 font-mono">
          — all {total.toLocaleString()} prompts loaded —
        </p>
      )}
    </div>
  );
}
