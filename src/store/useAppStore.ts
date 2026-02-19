"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Prompt, FilterState, SortOption, ToastMessage, User } from "@/types";
import { generateId } from "@/lib/utils";

// ─── Store Shape ──────────────────────────────────────────────────────────────
interface AppStore {
  // Persisted
  favorites: number[];
  userUploads: Prompt[];
  user: User | null;

  // Session
  filter: FilterState;
  openModal: Prompt | null;
  toast: ToastMessage | null;
  sidebarOpen: boolean;

  // Actions – Filter
  setSearch: (q: string) => void;
  setToolFilter: (tool: string | null) => void;
  setCategoryFilter: (cat: string | null) => void;
  setSort: (sort: SortOption) => void;
  resetFilters: () => void;

  // Actions – Favorites
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;

  // Actions – Modal
  openPromptModal: (prompt: Prompt) => void;
  closePromptModal: () => void;

  // Actions – Upload
  addUpload: (prompt: Omit<Prompt, "id" | "uses" | "createdAt" | "isUserUpload">) => void;

  // Actions – User
  saveUser: (user: User) => void;
  clearUser: () => void;

  // Actions – Sidebar
  openSidebar: () => void;
  closeSidebar: () => void;

  // Actions – Toast
  showToast: (message: string, isError?: boolean) => void;
  clearToast: () => void;
}

const DEFAULT_FILTER: FilterState = {
  search: "",
  toolFilter: null,
  categoryFilter: null,
  sort: "most-used",
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Initial state ───────────────────────────────────────────────────────
      favorites: [],
      userUploads: [],
      user: null,
      filter: DEFAULT_FILTER,
      openModal: null,
      toast: null,
      sidebarOpen: false,

      // ── Filter actions ──────────────────────────────────────────────────────
      setSearch: (q) =>
        set((s) => ({ filter: { ...s.filter, search: q } })),

      setToolFilter: (tool) =>
        set((s) => ({
          filter: {
            ...s.filter,
            toolFilter: tool,
            categoryFilter: null, // mutually exclusive
          },
        })),

      setCategoryFilter: (cat) =>
        set((s) => ({
          filter: {
            ...s.filter,
            categoryFilter: cat,
            toolFilter: null, // mutually exclusive
          },
        })),

      setSort: (sort) =>
        set((s) => ({ filter: { ...s.filter, sort } })),

      resetFilters: () => set({ filter: DEFAULT_FILTER }),

      // ── Favorites ───────────────────────────────────────────────────────────
      toggleFavorite: (id) =>
        set((s) => {
          const already = s.favorites.includes(id);
          const next = already
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id];
          return { favorites: next };
        }),

      isFavorite: (id) => get().favorites.includes(id),

      // ── Modal ───────────────────────────────────────────────────────────────
      openPromptModal: (prompt) => set({ openModal: prompt }),
      closePromptModal: () => set({ openModal: null }),

      // ── Upload ──────────────────────────────────────────────────────────────
      addUpload: (data) => {
        const newPrompt: Prompt = {
          ...data,
          id: generateId(),
          uses: 0,
          createdAt: Date.now(),
          isUserUpload: true,
        };
        set((s) => ({ userUploads: [newPrompt, ...s.userUploads] }));
        get().showToast("Prompt added to the vault!");
      },

      // ── User ────────────────────────────────────────────────────────────────
      saveUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      // ── Sidebar ─────────────────────────────────────────────────────────────
      openSidebar: () => set({ sidebarOpen: true }),
      closeSidebar: () => set({ sidebarOpen: false }),

      // ── Toast ────────────────────────────────────────────────────────────────
      showToast: (message, isError = false) => {
        const id = String(generateId());
        set({ toast: { id, message, isError } });
        setTimeout(() => {
          set((s) => (s.toast?.id === id ? { toast: null } : {}));
        }, 2800);
      },

      clearToast: () => set({ toast: null }),
    }),
    {
      name: "promptvault-storage",
      // Only persist these keys; filter and modal are session-only
      partialize: (s) => ({
        favorites: s.favorites,
        userUploads: s.userUploads,
        user: s.user,
      }),
    }
  )
);

// ─── Selector hooks (prevent unnecessary re-renders) ─────────────────────────
export const useFilter = () => useAppStore((s) => s.filter);
export const useFavorites = () => useAppStore((s) => s.favorites);
export const useOpenModal = () => useAppStore((s) => s.openModal);
export const useToast = () => useAppStore((s) => s.toast);
export const useUser = () => useAppStore((s) => s.user);
export const useUserUploads = () => useAppStore((s) => s.userUploads);
export const useSidebarOpen = () => useAppStore((s) => s.sidebarOpen);
