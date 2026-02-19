"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getToolConfig, TOOL_CONFIGS } from "@/lib/utils";
import { useAppStore, useFavorites, useUser } from "@/store/useAppStore";
import { getPromptDB } from "@/data/prompts";

// ─── Nav item config ──────────────────────────────────────────────────────────
const MAIN_NAV = [
  { href: "/library",   icon: "⚡", label: "All Prompts",  badge: true },
  { href: "/favorites", icon: "★",  label: "My Favorites", badge: false },
  { href: "/trending",  icon: "🔥", label: "Trending",     badge: false },
  { href: "/upload",    icon: "+",  label: "Upload Prompt", badge: false },
  { href: "/profile",   icon: "◎",  label: "My Profile",   badge: false },
];

// Featured tools shown in sidebar
const FEATURED_TOOLS = [
  "claude", "cursor", "gemini", "chatgpt", "midjourney",
  "sora", "elevenlabs", "n8n", "perplexity", "replit",
];

export default function Sidebar() {
  const pathname = usePathname();
  const favorites = useFavorites();
  const user = useUser();
  const setToolFilter = useAppStore((s) => s.setToolFilter);
  const totalCount = getPromptDB().length;

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "TM";

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col bg-surface border-r border-[rgba(120,100,255,0.12)] z-40 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[rgba(120,100,255,0.1)]">
        <div className="w-9 h-9 rounded-xl bg-accent-gradient flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0 shadow-glow">
          PV
        </div>
        <div>
          <div className="font-display font-bold text-text-primary text-[15px] leading-none">
            PromptVault
          </div>
          <div className="text-muted text-[11px] mt-0.5">Team AI Library</div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="px-3 py-4 flex flex-col gap-0.5">
        {MAIN_NAV.map(({ href, icon, label, badge }) => {
          const isActive = pathname === href || (href === "/library" && pathname === "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-accent/15 text-accent border border-accent/20"
                  : "text-muted hover:text-text-primary hover:bg-surface2"
              )}
            >
              <span className={cn("w-5 text-center text-base leading-none", isActive && "text-accent")}>
                {icon}
              </span>
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-[10px] font-mono bg-accent/10 text-accent border border-accent/20 px-1.5 py-0.5 rounded-md">
                  {totalCount.toLocaleString()}
                </span>
              )}
              {!badge && label === "My Favorites" && favorites.length > 0 && (
                <span className="text-[10px] font-mono bg-gold/10 text-gold border border-gold/20 px-1.5 py-0.5 rounded-md">
                  {favorites.length}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* By Tool section */}
      <div className="px-3 py-2">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted/60 px-3 mb-2">
          By Tool
        </div>
        <div className="flex flex-col gap-0.5">
          {FEATURED_TOOLS.map((toolId) => {
            const cfg = getToolConfig(toolId);
            return (
              <Link
                key={toolId}
                href="/library"
                onClick={() => setToolFilter(toolId)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted hover:text-text-primary hover:bg-surface2 transition-all duration-150 group"
              >
                <span className="text-base leading-none">{cfg.emoji}</span>
                <span className="truncate">{cfg.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User footer */}
      <div className="px-4 py-4 border-t border-[rgba(120,100,255,0.1)]">
        <Link href="/profile" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-text-primary text-[13px] font-medium truncate">
              {user?.name ?? "Team Member"}
            </div>
            <div className="text-muted text-[11px] truncate">
              {user?.role ?? "Pro Access"}
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
