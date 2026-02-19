"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORIES, TOOL_CONFIGS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TOOLS = Object.entries(TOOL_CONFIGS).map(([id, cfg]) => ({
  id,
  name: cfg.name,
}));

// ─── Reusable field wrapper ───────────────────────────────────────────────────
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-accent3 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT_CLS =
  "bg-surface2 border border-[rgba(120,100,255,0.15)] rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UploadPage() {
  const router = useRouter();
  const addUpload = useAppStore((s) => s.addUpload);
  const showToast = useAppStore((s) => s.showToast);

  const [title, setTitle] = useState("");
  const [tool, setTool] = useState("");
  const [cat, setCat] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tips, setTips] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!tool) e.tool = "Please select a tool";
    if (!cat) e.cat = "Please select a category";
    if (prompt.trim().length < 20)
      e.prompt = "Prompt must be at least 20 characters";
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    // Simulate async (could be real API call in v2)
    await new Promise((r) => setTimeout(r, 400));

    addUpload({ title: title.trim(), tool, cat, prompt: prompt.trim(), tips: tips.trim() });
    showToast("Prompt added to the vault! 🎉");
    router.push("/library");
  }

  return (
    <main className="flex flex-col min-h-full">
      <TopBar title="Upload Prompt" showSearch={false} />

      <div className="flex-1 px-6 py-8 max-w-2xl w-full mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-text-primary">
            Share a Prompt
          </h1>
          <p className="text-muted text-sm mt-1">
            Contribute to the team library. Great prompts get used thousands of times.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Title */}
          <Field label="Prompt Title" required>
            <input
              type="text"
              placeholder="e.g. Expert Code Reviewer with SOLID Principles"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-err" : undefined}
              className={cn(INPUT_CLS, errors.title && "border-accent3/50")}
            />
            {errors.title && (
              <span id="title-err" className="text-accent3 text-xs">
                {errors.title}
              </span>
            )}
          </Field>

          {/* Tool + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="AI Tool" required>
              <select
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                aria-invalid={!!errors.tool}
                className={cn(INPUT_CLS, "cursor-pointer", errors.tool && "border-accent3/50")}
              >
                <option value="">Select tool…</option>
                {TOOLS.sort((a, b) => a.name.localeCompare(b.name)).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {errors.tool && (
                <span className="text-accent3 text-xs">{errors.tool}</span>
              )}
            </Field>

            <Field label="Category" required>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                aria-invalid={!!errors.cat}
                className={cn(INPUT_CLS, "cursor-pointer", errors.cat && "border-accent3/50")}
              >
                <option value="">Select category…</option>
                {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.cat && (
                <span className="text-accent3 text-xs">{errors.cat}</span>
              )}
            </Field>
          </div>

          {/* Prompt */}
          <Field label="Prompt Text" required>
            <textarea
              rows={8}
              placeholder="Write your prompt here. Be specific about the role, task, format, and constraints…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-invalid={!!errors.prompt}
              aria-describedby={errors.prompt ? "prompt-err" : undefined}
              className={cn(
                INPUT_CLS,
                "font-mono resize-y min-h-[160px]",
                errors.prompt && "border-accent3/50"
              )}
            />
            <div className="flex items-center justify-between">
              {errors.prompt ? (
                <span id="prompt-err" className="text-accent3 text-xs">
                  {errors.prompt}
                </span>
              ) : (
                <span />
              )}
              <span className="text-muted/50 text-xs font-mono ml-auto">
                {prompt.length} chars
              </span>
            </div>
          </Field>

          {/* Tips */}
          <Field label="Usage Tips (optional)">
            <textarea
              rows={3}
              placeholder="e.g. Works best when you paste the full context before asking the question…"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              className={cn(INPUT_CLS, "resize-y")}
            />
          </Field>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:flex-none sm:w-48 bg-accent hover:bg-accent/80 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting…" : "Submit Prompt"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
