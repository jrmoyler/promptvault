"use client";

import { useEffect, useCallback } from "react";
import { useAppStore, useOpenModal } from "@/store/useAppStore";
import Badge from "@/components/ui/Badge";
import { formatCount } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function PromptModal() {
  const prompt = useOpenModal();
  const closePromptModal = useAppStore((s) => s.closePromptModal);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const showToast = useAppStore((s) => s.showToast);
  const isFav = useAppStore((s) =>
    prompt ? s.favorites.includes(prompt.id) : false
  );

  // Close on Escape
  useEffect(() => {
    if (!prompt) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closePromptModal();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prompt, closePromptModal]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = prompt ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [prompt]);

  const handleCopy = useCallback(async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      showToast("Prompt copied to clipboard!");
    } catch {
      showToast("Copy failed — please try manually.", true);
    }
  }, [prompt, showToast]);

  const handleFav = useCallback(() => {
    if (!prompt) return;
    toggleFavorite(prompt.id);
    showToast(isFav ? "Removed from favorites" : "Added to favorites ★");
  }, [prompt, toggleFavorite, showToast, isFav]);

  if (!prompt) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg/80 backdrop-blur-xl"
        onClick={closePromptModal}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-surface border border-[rgba(120,100,255,0.2)] rounded-2xl shadow-glow w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-[rgba(120,100,255,0.1)]">
          <div className="flex-1 min-w-0">
            <Badge toolId={prompt.tool} />
            <h2
              id="modal-title"
              className="font-display font-bold text-text-primary text-lg sm:text-xl mt-1.5 sm:mt-2 leading-snug"
            >
              {prompt.title}
            </h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-muted text-xs font-mono">
                📊 {formatCount(prompt.uses)} uses
              </span>
              <span className="text-muted/30">·</span>
              <span className="text-muted text-xs capitalize">
                {prompt.cat.replace(/-/g, " ")}
              </span>
            </div>
          </div>
          <button
            onClick={closePromptModal}
            aria-label="Close prompt"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-muted hover:text-text-primary hover:bg-surface2 transition-all text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5">
          {/* Prompt text */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted/60 font-semibold mb-2">
              Prompt
            </div>
            <pre className="font-mono text-sm text-text-primary/90 bg-surface2 border border-[rgba(120,100,255,0.1)] rounded-xl p-4 whitespace-pre-wrap break-words leading-relaxed overflow-auto max-h-60">
              {prompt.prompt}
            </pre>
          </div>

          {/* Tips */}
          {prompt.tips && (
            <div className="bg-accent/5 border border-accent/15 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-widest text-accent/70 font-semibold mb-1.5">
                💡 Usage Tips
              </div>
              <p className="text-muted text-sm leading-relaxed">{prompt.tips}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-[rgba(120,100,255,0.1)]">
          <button
            onClick={handleCopy}
            className="flex-1 bg-accent hover:bg-accent/80 text-white font-semibold text-sm py-2.5 rounded-xl transition-all duration-150 cursor-pointer"
          >
            Copy Prompt
          </button>
          <button
            onClick={handleFav}
            aria-pressed={isFav}
            className={cn(
              "flex items-center gap-2 border font-medium text-sm py-2.5 px-4 rounded-xl transition-all duration-150 cursor-pointer",
              isFav
                ? "bg-gold/10 border-gold/30 text-gold"
                : "bg-surface2 border-[rgba(120,100,255,0.15)] text-muted hover:text-gold hover:border-gold/30"
            )}
          >
            <span>★</span>
            {isFav ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
