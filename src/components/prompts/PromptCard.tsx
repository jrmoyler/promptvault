"use client";

import { memo, useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import { useAppStore } from "@/store/useAppStore";
import { formatCount } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Prompt } from "@/types";

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
}

const PREVIEW_LIMIT = 280;

function getPromptPreview(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= PREVIEW_LIMIT) return trimmed;
  return `${trimmed.slice(0, PREVIEW_LIMIT).trimEnd()}...`;
}

// Deterministic "variant" based on prompt id for masonry-like height variety
function getCardVariant(id: number): "compact" | "standard" | "tall" {
  const mod = id % 5;
  if (mod === 0 || mod === 3) return "compact";
  if (mod === 2 || mod === 4) return "tall";
  return "standard";
}

const variantPreviewLimit: Record<string, number> = {
  compact: 140,
  standard: 280,
  tall: 440,
};

function spawnParticles(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    const dist = 30 + Math.random() * 20;
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

const cardSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 24,
};

const PromptCard = memo(function PromptCard({ prompt, index = 0 }: PromptCardProps) {
  const openPromptModal = useAppStore((s) => s.openPromptModal);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const showToast = useAppStore((s) => s.showToast);
  const isFav = useAppStore((s) => s.favorites.includes(prompt.id));
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const variant = getCardVariant(prompt.id);
  const previewText = getPromptPreview(
    prompt.prompt.slice(0, variantPreviewLimit[variant])
  );

  const handleOpen = useCallback(() => {
    openPromptModal(prompt);
  }, [openPromptModal, prompt]);

  const handleFav = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleFavorite(prompt.id);
      const msg = isFav ? "Removed from favorites" : "Added to favorites";
      showToast(msg);
    },
    [toggleFavorite, showToast, prompt.id, isFav]
  );

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(prompt.prompt);
        setCopied(true);
        if (cardRef.current) spawnParticles(cardRef.current);
        showToast("Copied to clipboard!");
        setTimeout(() => setCopied(false), 1200);
      } catch {
        showToast("Copy failed — please try manually.", true);
      }
    },
    [showToast, prompt.prompt]
  );

  return (
    <motion.article
      ref={cardRef}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label={`Open prompt: ${prompt.title}`}
      onKeyDown={(e) => e.key === "Enter" && handleOpen()}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        ...cardSpring,
        delay: Math.min(index * 0.03, 0.3),
      }}
      whileHover={{
        y: -4,
        transition: { ...cardSpring, delay: 0 },
      }}
      className={cn(
        "group relative bg-surface/80 border border-[rgba(99,102,241,0.08)] rounded-2xl p-5 cursor-pointer flex flex-col gap-3",
        "shadow-card hover:shadow-card-hover hover:border-accent/25",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        "backdrop-blur-sm overflow-hidden",
      )}
    >
      {/* Subtle top-edge glow on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/40 transition-all duration-500" />

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
              : "text-muted/30 hover:text-gold hover:bg-gold/10"
          )}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      <h3 className="font-semibold text-text-primary text-[15px] leading-snug tracking-tight group-hover:text-accent-bright transition-colors duration-200">
        {prompt.title}
      </h3>

      <div className="flex-1 overflow-hidden">
        <p className="text-muted text-[12px] font-mono leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
          {previewText}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[rgba(99,102,241,0.06)]">
        <div className="flex items-center gap-2">
          <span className="text-muted/60 text-[11px] font-mono">
            {formatCount(prompt.uses)} uses
          </span>
          {prompt.isUserUpload && (
            <span className="text-[9px] uppercase tracking-widest text-accent2 bg-accent2/10 px-1.5 py-0.5 rounded-md font-semibold">
              Mine
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy prompt to clipboard"
          className={cn(
            "relative text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer",
            copied
              ? "text-accent2 bg-accent2/10"
              : "text-muted/40 hover:text-accent2 hover:bg-accent2/5"
          )}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </motion.article>
  );
});

export default PromptCard;
