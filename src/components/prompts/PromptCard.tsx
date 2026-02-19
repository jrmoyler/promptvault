"use client";

import { memo, useCallback } from "react";
import Badge from "@/components/ui/Badge";
import { useAppStore } from "@/store/useAppStore";
import { formatCount } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Prompt } from "@/types";

interface PromptCardProps {
  prompt: Prompt;
}

// ─── Memoised to avoid re-renders from parent scroll events ──────────────────
const PromptCard = memo(function PromptCard({ prompt }: PromptCardProps) {
  const openPromptModal = useAppStore((s) => s.openPromptModal);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const showToast = useAppStore((s) => s.showToast);
  const isFav = useAppStore((s) => s.favorites.includes(prompt.id));

  const handleOpen = useCallback(() => {
    openPromptModal(prompt);
  }, [openPromptModal, prompt]);

  const handleFav = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleFavorite(prompt.id);
      const msg = isFav ? "Removed from favorites" : "Added to favorites ★";
      showToast(msg);
    },
    [toggleFavorite, showToast, prompt.id, isFav]
  );

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(prompt.prompt);
        showToast("Prompt copied to clipboard!");
      } catch {
        showToast("Copy failed — please try manually.", true);
      }
    },
    [showToast, prompt.prompt]
  );

  return (
    <article
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label={`Open prompt: ${prompt.title}`}
      onKeyDown={(e) => e.key === "Enter" && handleOpen()}
      className="group bg-surface border border-[rgba(120,100,255,0.1)] rounded-2xl p-5 cursor-pointer flex flex-col gap-3 shadow-card hover:shadow-card-hover hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <Badge toolId={prompt.tool} />
        <button
          onClick={handleFav}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFav}
          className={cn(
            "flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer",
            isFav
              ? "text-gold bg-gold/10"
              : "text-muted/40 hover:text-gold hover:bg-gold/10"
          )}
        >
          ★
        </button>
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-text-primary text-[15px] leading-snug group-hover:text-accent transition-colors duration-150">
        {prompt.title}
      </h3>

      {/* Full prompt text */}
      <div className="flex-1">
        <pre className="text-muted text-xs font-mono leading-relaxed whitespace-pre-wrap break-words">
          {prompt.prompt}
        </pre>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[rgba(120,100,255,0.08)]">
        <div className="flex items-center gap-1.5">
          <span className="text-muted/50 text-[10px]">📊</span>
          <span className="text-muted text-[11px] font-mono">
            {formatCount(prompt.uses)} uses
          </span>
          {prompt.isUserUpload && (
            <span className="ml-1 text-[9px] uppercase tracking-widest text-accent2 bg-accent2/10 px-1.5 py-0.5 rounded-md font-semibold">
              Mine
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy prompt to clipboard"
          className="text-[10px] uppercase tracking-widest font-semibold text-muted/50 hover:text-accent2 transition-colors duration-150 cursor-pointer"
        >
          Copy
        </button>
      </div>
    </article>
  );
});

export default PromptCard;
