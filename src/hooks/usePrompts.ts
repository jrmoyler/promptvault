"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useFilter, useFavorites } from "@/store/useAppStore";
import type { PaginatedResult, Prompt } from "@/types";

export const PAGE_SIZE = 24;

async function fetchPromptPage(params: {
  page: number;
  search?: string;
  toolFilter?: string | null;
  categoryFilter?: string | null;
  sort?: string;
  favorites?: number[];
}): Promise<PaginatedResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    search: params.search ?? "",
    toolFilter: params.toolFilter ?? "",
    categoryFilter: params.categoryFilter ?? "",
    sort: params.sort ?? "most-used",
    favorites: (params.favorites ?? []).join(","),
  });

  const res = await fetch(`/api/prompts?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to load prompts");
  return res.json();
}

export function useLibraryPrompts() {
  const filter = useFilter();
  const favorites = useFavorites();

  return useInfiniteQuery({
    queryKey: ["prompts", filter],
    queryFn: ({ pageParam = 0 }) =>
      fetchPromptPage({
        page: pageParam as number,
        search: filter.search,
        toolFilter: filter.toolFilter,
        categoryFilter: filter.categoryFilter,
        sort: filter.sort,
        favorites,
      }),
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFlatPrompts(
  data: ReturnType<typeof useLibraryPrompts>["data"]
): Prompt[] {
  return useMemo(() => data?.pages.flatMap((p) => p.prompts) ?? [], [data]);
}

export function useFavoritePrompts() {
  const filter = useFilter();
  const favorites = useFavorites();

  return useInfiniteQuery({
    queryKey: ["favorites", favorites, filter.search, filter.toolFilter, filter.categoryFilter],
    queryFn: ({ pageParam = 0 }) =>
      fetchPromptPage({
        page: pageParam as number,
        search: filter.search,
        toolFilter: filter.toolFilter,
        categoryFilter: filter.categoryFilter,
        sort: "favorites",
        favorites,
      }),
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    initialPageParam: 0,
    enabled: favorites.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrendingPrompts() {
  return useQuery({
    queryKey: ["trending-prompts"],
    queryFn: async () => {
      const res = await fetch("/api/prompts/trending");
      if (!res.ok) throw new Error("Failed to load trending prompts");
      return (await res.json()) as Prompt[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useTotalCount(data: { pages?: PaginatedResult[] } | undefined): number {
  return data?.pages?.[0]?.total ?? 0;
}
