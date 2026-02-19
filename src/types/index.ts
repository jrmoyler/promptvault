// ============================================================
// PromptVault Type Definitions
// ============================================================

export interface Prompt {
  id: number;
  tool: string;
  title: string;
  cat: string;
  uses: number;
  prompt: string;
  tips?: string;
  isUserUpload?: boolean;
  createdAt?: number;
}

export type SortOption = "most-used" | "newest" | "alphabetical" | "favorites";

export interface FilterState {
  search: string;
  toolFilter: string | null;
  categoryFilter: string | null;
  sort: SortOption;
}

export interface PaginatedResult {
  prompts: Prompt[];
  total: number;
  hasMore: boolean;
  page: number;
}

export interface ToolConfig {
  name: string;
  emoji: string;
  badge: string;
}

export type CategoryId =
  | "all"
  | "system-prompt"
  | "god-prompt"
  | "meta-prompt"
  | "workflow"
  | "image-gen"
  | "video-gen"
  | "audio-music"
  | "code-gen"
  | "research"
  | "content"
  | "agent"
  | "rag"
  | "ux-design"
  | "marketing"
  | "productivity"
  | "persona"
  | "creative"
  | "data-analysis"
  | "testing"
  | "devops"
  | "support"
  | "sales"
  | "education"
  | "seo";

export interface Category {
  id: string;
  label: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
}

export interface AppState {
  favorites: number[];
  uploads: number[];
  user: User | null;
  openModal: Prompt | null;
  toast: ToastMessage | null;
}

export interface ToastMessage {
  id: string;
  message: string;
  isError?: boolean;
}
