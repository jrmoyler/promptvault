"use client";

import TopBar from "@/components/layout/TopBar";
import PromptCard from "@/components/prompts/PromptCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useTrendingPrompts } from "@/hooks/usePrompts";

const RANK_COLORS = [
  "bg-gold/15 border-gold/30 text-gold",
  "bg-[rgba(192,192,192,0.10)] border-white/15 text-white/60",
  "bg-[rgba(205,127,50,0.10)] border-[rgba(205,127,50,0.25)] text-[#cd7f32]",
];

function RankBadge({ rank }: { rank: number }) {
  const colorClass =
    rank <= 3
      ? RANK_COLORS[rank - 1]
      : "bg-surface2 border-[rgba(99,102,241,0.10)] text-muted";

  return (
    <div
      className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border z-10 ${colorClass}`}
      aria-label={`Rank ${rank}`}
    >
      {rank}
    </div>
  );
}

export default function TrendingPage() {
  const { data: prompts = [], isLoading } = useTrendingPrompts();

  return (
    <main className="flex flex-col min-h-full">
      <TopBar title="Trending" showSearch={false} />

      <div className="px-3 sm:px-6 py-4 sm:py-6">
        <div className="mb-6">
          <h2 className="font-bold text-2xl text-text-primary tracking-tight">
            Most Used Prompts
          </h2>
          <p className="text-muted text-sm mt-1">
            Top 48 prompts ranked by total usage across the team.
          </p>
        </div>

        <ErrorBoundary>
          {isLoading ? (
            <p className="text-muted text-sm">Loading trending prompts...</p>
          ) : (
            <div
              role="list"
              aria-label="Trending prompts"
              className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6"
            >
              {prompts.map((p, index) => (
                <div key={p.id} role="listitem" className="relative">
                  <RankBadge rank={index + 1} />
                  <PromptCard prompt={p} index={index} />
                </div>
              ))}
            </div>
          )}
        </ErrorBoundary>
      </div>
    </main>
  );
}
