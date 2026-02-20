"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import PromptCard from "./PromptCard";
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

const CARD_ESTIMATED_HEIGHT = 400;
const ROW_GAP = 16;

function SkeletonCard() {
  return (
    <div className="bg-surface border border-[rgba(120,100,255,0.08)] rounded-2xl p-5 flex flex-col gap-3 animate-pulse min-h-[360px]">
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

function getColumnCount(width: number): number {
  if (width >= 1280) return 3;
  if (width >= 640) return 2;
  return 1;
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateColumns = () => setColumns(getColumnCount(element.clientWidth));
    updateColumns();

    const observer = new ResizeObserver(updateColumns);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const rows = useMemo(() => {
    const grouped: Prompt[][] = [];
    for (let i = 0; i < prompts.length; i += columns) {
      grouped.push(prompts.slice(i, i + columns));
    }
    return grouped;
  }, [prompts, columns]);

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => CARD_ESTIMATED_HEIGHT + ROW_GAP,
    overscan: 4,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastRow = virtualRows[virtualRows.length - 1];
    if (!lastRow) return;

    const isNearEnd = lastRow.index >= rows.length - 3;
    if (isNearEnd && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [virtualRows, rows.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading prompts">
        {Array.from({ length: 12 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="text-5xl">{emptyIcon}</span>
        <p className="text-muted text-base">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      <p className="text-muted text-xs font-mono px-0.5">
        Showing <span className="text-accent font-semibold">{prompts.length.toLocaleString()}</span> of{" "}
        <span className="text-text-primary font-semibold">{total.toLocaleString()}</span> prompts
      </p>

      <div
        role="list"
        aria-label="Prompt library"
        className="relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {virtualRows.map((virtualRow) => {
          const rowPrompts = rows[virtualRow.index] ?? [];

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className="absolute left-0 top-0 w-full"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-4">
                {rowPrompts.map((prompt) => (
                  <div key={prompt.id} role="listitem">
                    <PromptCard prompt={prompt} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isFetchingNextPage && (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard key={`sk-${i}`} />
          ))}
        </div>
      )}

      {!hasNextPage && prompts.length > 0 && (
        <p className="text-center text-muted/40 text-xs py-8 font-mono">
          — all {total.toLocaleString()} prompts loaded —
        </p>
      )}
    </div>
  );
}
