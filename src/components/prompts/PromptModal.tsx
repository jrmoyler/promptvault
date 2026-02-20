"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, useOpenModal } from "@/store/useAppStore";
import Badge from "@/components/ui/Badge";
import { formatCount } from "@/lib/utils";
import { cn } from "@/lib/utils";

function spawnParticles(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 * i) / 10;
    const dist = 40 + Math.random() * 30;
    const el = document.createElement("span");
    el.className = "copy-burst-particle";
    el.style.left = `${cx}px`;
    el.style.top = `${cy}px`;
    el.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
    el.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
    container.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }
}

export default function PromptModal() {
  const prompt = useOpenModal();
  const closePromptModal = useAppStore((s) => s.closePromptModal);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const showToast = useAppStore((s) => s.showToast);
  const isFav = useAppStore((s) =>
    prompt ? s.favorites.includes(prompt.id) : false
  );
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!prompt) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closePromptModal();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prompt, closePromptModal]);

  useEffect(() => {
    document.body.style.overflow = prompt ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [prompt]);

  const handleCopy = useCallback(async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      if (copyBtnRef.current) spawnParticles(copyBtnRef.current);
      showToast("Copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast("Copy failed — please try manually.", true);
    }
  }, [prompt, showToast]);

  const handleFav = useCallback(() => {
    if (!prompt) return;
    toggleFavorite(prompt.id);
    showToast(isFav ? "Removed from favorites" : "Added to favorites");
  }, [prompt, toggleFavorite, showToast, isFav]);

  return (
    <AnimatePresence>
      {prompt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-bg/80 backdrop-blur-xl"
            onClick={closePromptModal}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative bg-surface border border-[rgba(99,102,241,0.15)] rounded-2xl shadow-glow w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start gap-3 sm:gap-4 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-[rgba(99,102,241,0.08)]">
              <div className="flex-1 min-w-0">
                <Badge toolId={prompt.tool} />
                <h2
                  id="modal-title"
                  className="font-bold text-text-primary text-lg sm:text-xl mt-1.5 sm:mt-2 leading-snug tracking-tight"
                >
                  {prompt.title}
                </h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-muted text-xs font-mono">
                    {formatCount(prompt.uses)} uses
                  </span>
                  <span className="text-muted/20">·</span>
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
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted/50 font-semibold mb-2">
                  Prompt
                </div>
                <pre className="font-mono text-sm text-text-primary/90 bg-surface2 border border-[rgba(99,102,241,0.08)] rounded-xl p-4 whitespace-pre-wrap break-words leading-relaxed overflow-auto max-h-[50vh]">
                  {prompt.prompt}
                </pre>
              </div>

              {prompt.tips && (
                <div className="bg-accent/5 border border-accent/10 rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-accent/60 font-semibold mb-1.5">
                    Usage Tips
                  </div>
                  <p className="text-muted text-sm leading-relaxed">{prompt.tips}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-[rgba(99,102,241,0.08)]">
              <button
                ref={copyBtnRef}
                onClick={handleCopy}
                className={cn(
                  "relative flex-1 font-semibold text-sm py-2.5 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden",
                  copied
                    ? "bg-accent2 text-bg"
                    : "bg-accent hover:bg-accent-bright text-white"
                )}
              >
                {copied ? "Copied!" : "Copy Prompt"}
              </button>
              <button
                onClick={handleFav}
                aria-pressed={isFav}
                className={cn(
                  "flex items-center gap-2 border font-medium text-sm py-2.5 px-4 rounded-xl transition-all duration-150 cursor-pointer",
                  isFav
                    ? "bg-gold/10 border-gold/25 text-gold"
                    : "bg-surface2 border-[rgba(99,102,241,0.10)] text-muted hover:text-gold hover:border-gold/25"
                )}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {isFav ? "Saved" : "Save"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
