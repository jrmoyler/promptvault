"use client";

import TopBar from "@/components/layout/TopBar";
import PromptCard from "@/components/prompts/PromptCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useTrendingPrompts } from "@/hooks/usePrompts";

// Rank badge colours
const RANK_COLORS = [
  "bg-[rgba(240,192,64,0.15)] border-gold/30 text-gold",  // 1 – Gold
  "bg-[rgba(192,192,192,0.12)] border-white/20 text-white/60", // 2 – Silver
  "bg-[rgba(205,127,50,0.12)] border-[rgba(205,127,50,0.3)] text-[#cd7f32]", // 3 – Bronze
];

function RankBadge({ rank }: { rank: number }) {
  const colorClass =
    rank <= 3
      ? RANK_COLORS[rank - 1]
      : "bg-surface2 border-[rgba(120,100,255,0.12)] text-muted";

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
  const prompts = useTrendingPrompts();

  return (
    <main className="flex flex-col min-h-full">
      <TopBar title="Trending" showSearch={false} />

      <div className="px-6 py-6">
        {/* Hero label */}
        <div className="mb-6">
          <h2 className="font-display font-bold text-2xl text-text-primary">
            🔥 Most Used Prompts
          </h2>
          <p className="text-muted text-sm mt-1">
            Top 48 prompts ranked by total usage across the team.
          </p>
        </div>

        <ErrorBoundary>
          <div
            role="list"
            aria-label="Trending prompts"
            className="grid gap-4"
            style={{
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 380px), 1fr))",
            }}
          >
            {prompts.map((p, index) => (
              <div key={p.id} role="listitem" className="relative">
                <RankBadge rank={index + 1} />
                <PromptCard prompt={p} />
              </div>
            ))}
          </div>
        </ErrorBoundary>
      </div>
    </main>
  );
}
