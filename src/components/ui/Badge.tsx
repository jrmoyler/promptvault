import { getToolConfig } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface BadgeProps {
  toolId: string;
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({ toolId, size = "md", className }: BadgeProps) {
  const cfg = getToolConfig(toolId);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-lg border border-white/5 whitespace-nowrap",
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1",
        cfg.badge,
        className
      )}
    >
      <span className="text-[11px] leading-none">{cfg.emoji}</span>
      {cfg.name}
    </span>
  );
}
