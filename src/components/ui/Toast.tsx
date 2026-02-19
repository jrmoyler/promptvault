"use client";

import { useToast, useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export default function Toast() {
  const toast = useToast();
  const clearToast = useAppStore((s) => s.clearToast);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-glow border text-sm font-medium animate-toast-in",
        toast.isError
          ? "bg-accent3/10 border-accent3/30 text-accent3"
          : "bg-accent2/10 border-accent2/30 text-accent2"
      )}
    >
      <span className="text-base leading-none">
        {toast.isError ? "✕" : "✓"}
      </span>
      {toast.message}
      <button
        onClick={clearToast}
        aria-label="Dismiss notification"
        className="ml-1 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}
