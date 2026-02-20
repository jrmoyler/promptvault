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

// Estimated row heights per card variant (compact / standard / tall)
function estimateRowHeight(cols: number): number {
  // Average across variants with gap
  const base = cols <= 2 ? 320 : 300;
  return base + 16;
}

const ROW_GAP = 16;

function SkeletonCard({ variant = "standard" }: { variant?: string }) {
  const heights: Record<string, string> = {
    compact: "min-h-[200px]",
    standard: "min-h-[280px]",
    tall: "min-h-[360px]",
  };
  return (
    <div
      className={`bg-surface border border-[rgba(99,102,241,0.06)] rounded-2xl p-5 flex flex-col gap-3 ${heights[variant] ?? heights.standard}`}
    >
      <div className="flex items-center gap-2">
        <div className="h-5 w-20 bg-surface2 rounded-lg animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-surface2 via-surface3 to-surface2" />
      </div>
      <div className="h-4 w-3/4 bg-surface2 rounded-lg animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-surface2 via-surface3 to-surface2" />
      <div className="flex-1 space-y-2 mt-1">
        <div className="h-3 w-full bg-surface2 rounded animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-surface2 via-surface3 to-surface2" />
        <div className="h-3 w-5/6 bg-surface2 rounded animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-surface2 via-surface3 to-surface2" />
        <div className="h-3 w-4/5 bg-surface2 rounded animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-surface2 via-surface3 to-surface2" />
      </div>
      <div className="h-px bg-surface2 mt-auto" />
      <div className="flex justify-between">
        <div className="h-3 w-16 bg-surface2 rounded animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-surface2 via-surface3 to-surface2" />
        <div className="h-3 w-8 bg-surface2 rounded animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-surface2 via-surface3 to-surface2" />
      </div>
    </div>
  );
}

function getColumnCount(width: number): number {
  if (width >= 1920) return 6;  // 3xl / ultrawide
  if (width >= 1536) return 5;  // 2xl
  if (width >= 1280) return 4;  // xl
  if (width >= 1024) return 3;  // lg
  if (width >= 640) return 2;   // sm
  return 1;                     // mobile
}

const GRID_CLASSES: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

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
    estimateSize: () => estimateRowHeight(columns),
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  // Infinite scroll trigger
  useEffect(() => {
    const lastRow = virtualRows[virtualRows.length - 1];
    if (!lastRow) return;

    const isNearEnd = lastRow.index >= rows.length - 4;
    if (isNearEnd && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [virtualRows, rows.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div
        className={`grid gap-4 ${GRID_CLASSES[columns] ?? "grid-cols-1"}`}
        aria-busy="true"
        aria-label="Loading prompts"
      >
        {Array.from({ length: columns * 3 }, (_, i) => (
          <SkeletonCard key={i} variant={["compact", "standard", "tall"][i % 3]} />
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

  const gridClass = GRID_CLASSES[columns] ?? "grid-cols-1";

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      <p className="text-muted text-xs font-mono px-0.5">
        Showing{" "}
        <span className="text-accent font-semibold">
          {prompts.length.toLocaleString()}
        </span>{" "}
        of{" "}
        <span className="text-text-primary font-semibold">
          {total.toLocaleString()}
        </span>{" "}
        prompts
      </p>

      <div
        role="list"
        aria-label="Prompt library"
        className="relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {virtualRows.map((virtualRow) => {
          const rowPrompts = rows[virtualRow.index] ?? [];
          const baseIndex = virtualRow.index * columns;

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className="absolute left-0 top-0 w-full"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <div className={`grid gap-4 ${gridClass} pb-4`}>
                {rowPrompts.map((prompt, colIdx) => (
                  <div key={prompt.id} role="listitem">
                    <PromptCard prompt={prompt} index={baseIndex + colIdx} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isFetchingNextPage && (
        <div className={`grid gap-4 ${gridClass}`}>
          {Array.from({ length: columns }, (_, i) => (
            <SkeletonCard key={`sk-${i}`} variant={["compact", "standard", "tall"][i % 3]} />
          ))}
        </div>
      )}

      {!hasNextPage && prompts.length > 0 && (
        <p className="text-center text-muted/30 text-xs py-8 font-mono">
          all {total.toLocaleString()} prompts loaded
        </p>
      )}
    </div>
  );
}
