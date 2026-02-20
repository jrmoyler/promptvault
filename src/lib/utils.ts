import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Category, ToolConfig } from "@/types";

// ─── Tailwind merge helper ────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── XSS-safe HTML escape ─────────────────────────────────────────────────────
export function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─── Tool registry ────────────────────────────────────────────────────────────
export const TOOL_CONFIGS: Record<string, ToolConfig> = {
  claude:         { name: "Claude Pro",         emoji: "🧠", badge: "bg-[rgba(215,119,65,0.12)] text-[#e8884a]" },
  "claude-code":  { name: "Claude Code",        emoji: "💻", badge: "bg-[rgba(215,119,65,0.10)] text-[#d97a3e]" },
  gemini:         { name: "Gemini Pro",         emoji: "✨", badge: "bg-[rgba(66,133,244,0.12)] text-[#6ca0f5]" },
  "gemini-biz":   { name: "Gemini Business",    emoji: "💼", badge: "bg-[rgba(66,133,244,0.10)] text-[#5a8fe0]" },
  "google-ai":    { name: "Google AI Studio",   emoji: "🔬", badge: "bg-[rgba(52,168,83,0.12)] text-[#5bbf74]" },
  chatgpt:        { name: "ChatGPT Pro",        emoji: "🤖", badge: "bg-[rgba(16,163,127,0.12)] text-[#1cc494]" },
  perplexity:     { name: "Perplexity Pro",     emoji: "🔍", badge: "bg-[rgba(99,102,241,0.12)] text-[#818cf8]" },
  copilot:        { name: "MS Copilot",         emoji: "🪟", badge: "bg-[rgba(0,120,212,0.12)] text-[#4da6f5]" },
  qwen:           { name: "Qwen",               emoji: "🌐", badge: "bg-[rgba(255,107,107,0.10)] text-[#ff8f8f]" },
  kimi:           { name: "Kimi AI",            emoji: "🌙", badge: "bg-[rgba(99,102,241,0.12)] text-[#9d7dfd]" },
  cursor:         { name: "Cursor Pro",         emoji: "⚡", badge: "bg-[rgba(6,214,160,0.10)] text-[#06d6a0]" },
  replit:         { name: "Replit",              emoji: "🔧", badge: "bg-[rgba(245,106,0,0.12)] text-[#f57832]" },
  langchain:      { name: "LangChain",          emoji: "🔗", badge: "bg-[rgba(50,200,100,0.10)] text-[#4ade80]" },
  huggingface:    { name: "HuggingFace",        emoji: "🤗", badge: "bg-[rgba(255,215,0,0.10)] text-[#fbbf24]" },
  supabase:       { name: "Supabase",           emoji: "🗄️", badge: "bg-[rgba(62,207,142,0.12)] text-[#3ecf8e]" },
  github:         { name: "GitHub Copilot",     emoji: "🐙", badge: "bg-[rgba(200,200,200,0.08)] text-[#9ca3af]" },
  sora:           { name: "Sora",               emoji: "🎬", badge: "bg-[rgba(99,102,241,0.12)] text-[#9d7dfd]" },
  veo:            { name: "Veo 3.1",            emoji: "🎥", badge: "bg-[rgba(66,133,244,0.12)] text-[#6ca0f5]" },
  kling:          { name: "Kling AI",           emoji: "🎞️", badge: "bg-[rgba(255,72,66,0.10)] text-[#ff6b6b]" },
  hailuo:         { name: "Hailuo",             emoji: "🌊", badge: "bg-[rgba(0,180,219,0.10)] text-[#22d3ee]" },
  heygen:         { name: "HeyGen",             emoji: "🎙️", badge: "bg-[rgba(255,107,107,0.10)] text-[#f87171]" },
  higgsfield:     { name: "Higgsfield",         emoji: "🚀", badge: "bg-[rgba(99,102,241,0.10)] text-[#a78bfa]" },
  elevenlabs:     { name: "ElevenLabs",         emoji: "🔊", badge: "bg-[rgba(6,214,160,0.12)] text-[#06d6a0]" },
  suno:           { name: "Suno",               emoji: "🎵", badge: "bg-[rgba(255,165,0,0.10)] text-[#fb923c]" },
  "music-fx":     { name: "Music FX",           emoji: "🎶", badge: "bg-[rgba(52,168,83,0.12)] text-[#4ade80]" },
  n8n:            { name: "N8N",                emoji: "⚙️", badge: "bg-[rgba(234,67,53,0.10)] text-[#f87171]" },
  zapier:         { name: "Zapier",             emoji: "⚡", badge: "bg-[rgba(255,102,0,0.12)] text-[#fb923c]" },
  abacus:         { name: "Abacus AI",          emoji: "🧮", badge: "bg-[rgba(99,102,241,0.12)] text-[#6366f1]" },
  manus:          { name: "Manus AI",           emoji: "🦾", badge: "bg-[rgba(6,214,160,0.10)] text-[#2dd4bf]" },
  "lemon-ai":     { name: "Lemon AI",           emoji: "🍋", badge: "bg-[rgba(255,215,0,0.12)] text-[#fbbf24]" },
  midjourney:     { name: "Midjourney",         emoji: "🎨", badge: "bg-[rgba(99,102,241,0.15)] text-[#6366f1]" },
  freepik:        { name: "Freepik AI",         emoji: "🖼️", badge: "bg-[rgba(6,214,160,0.10)] text-[#06d6a0]" },
  roboflow:       { name: "Roboflow",           emoji: "👁️", badge: "bg-[rgba(82,196,26,0.10)] text-[#86efac]" },
  minimax:        { name: "Minimax",            emoji: "🔮", badge: "bg-[rgba(200,100,255,0.10)] text-[#d8b4fe]" },
  firebase:       { name: "Firebase Studio",    emoji: "🔥", badge: "bg-[rgba(255,193,7,0.10)] text-[#fbbf24]" },
  "nano-banana":  { name: "Nano Banana Pro",    emoji: "🍌", badge: "bg-[rgba(255,230,0,0.12)] text-[#fde047]" },
  "atoms-dev":    { name: "Atoms.dev",          emoji: "⚛️", badge: "bg-[rgba(6,214,160,0.10)] text-[#67e8f9]" },
  "blink-new":    { name: "Blink.new",          emoji: "✦",  badge: "bg-[rgba(99,102,241,0.10)] text-[#c4b5fd]" },
};

export function getToolConfig(toolId: string): ToolConfig {
  return (
    TOOL_CONFIGS[toolId] ?? {
      name: toolId.charAt(0).toUpperCase() + toolId.slice(1),
      emoji: "🤖",
      badge: "bg-surface2 text-text-primary",
    }
  );
}

// ─── Category registry ────────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  { id: "all",           label: "All Prompts" },
  { id: "system-prompt", label: "System Prompt" },
  { id: "god-prompt",    label: "God Prompt" },
  { id: "meta-prompt",   label: "Meta Prompt" },
  { id: "workflow",      label: "Workflow / Automation" },
  { id: "image-gen",     label: "Image Generation" },
  { id: "video-gen",     label: "Video Generation" },
  { id: "audio-music",   label: "Audio / Music" },
  { id: "code-gen",      label: "Code Generation" },
  { id: "research",      label: "Research / Analysis" },
  { id: "content",       label: "Content Creation" },
  { id: "agent",         label: "Agent Framework" },
  { id: "rag",           label: "RAG / Data" },
  { id: "ux-design",     label: "UX / Design" },
  { id: "marketing",     label: "Marketing" },
  { id: "productivity",  label: "Productivity" },
  { id: "persona",       label: "Persona" },
  { id: "creative",      label: "Creative Writing" },
  { id: "data-analysis", label: "Data Analysis" },
  { id: "testing",       label: "Testing / QA" },
  { id: "devops",        label: "DevOps" },
  { id: "support",       label: "Customer Support" },
  { id: "sales",         label: "Sales" },
  { id: "education",     label: "Education" },
  { id: "seo",           label: "SEO / Copywriting" },
];

// ─── Readable category labels ─────────────────────────────────────────────────
export function getCategoryLabel(catId: string): string {
  return CATEGORIES.find((c) => c.id === catId)?.label ?? catId;
}

// ─── Format numbers ───────────────────────────────────────────────────────────
export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ─── Generate a unique ID ─────────────────────────────────────────────────────
export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}
