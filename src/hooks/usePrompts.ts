"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { queryPrompts, getTrendingPrompts, PAGE_SIZE } from "@/data/prompts";
import { useFilter, useFavorites, useUserUploads } from "@/store/useAppStore";
import { prependUserPrompts } from "@/data/prompts";
import type { Prompt } from "@/types";

// ─── Infinite-scroll library query ───────────────────────────────────────────
export function useLibraryPrompts() {
  const filter = useFilter();
  const favorites = useFavorites();
  const userUploads = useUserUploads();

  // Inject user uploads into the DB before querying
  if (userUploads.length > 0) {
    prependUserPrompts(userUploads);
  }

  return useInfiniteQuery({
    queryKey: ["prompts", filter, favorites.length, userUploads.length],
    queryFn: ({ pageParam = 0 }) =>
      Promise.resolve(queryPrompts(filter, favorites, pageParam as number)),
    getNextPageParam: (last) =>
      last.hasMore ? last.page + 1 : undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // 5 min – data is static
  });
}

// ─── Flat array of all loaded prompts ────────────────────────────────────────
export function useFlatPrompts(
  data: ReturnType<typeof useLibraryPrompts>["data"]
): Prompt[] {
  return useMemo(
    () => data?.pages.flatMap((p) => p.prompts) ?? [],
    [data]
  );
}

// ─── Favorites page query ─────────────────────────────────────────────────────
export function useFavoritePrompts() {
  const filter = useFilter();
  const favorites = useFavorites();

  return useInfiniteQuery({
    queryKey: ["favorites", favorites, filter.search],
    queryFn: ({ pageParam = 0 }) =>
      Promise.resolve(
        queryPrompts(
          { ...filter, sort: "favorites" },
          favorites,
          pageParam as number
        )
      ),
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    initialPageParam: 0,
    enabled: favorites.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Trending prompts (static, no pagination needed) ─────────────────────────
export function useTrendingPrompts() {
  return useMemo(() => getTrendingPrompts(), []);
}

// ─── Total count helper ───────────────────────────────────────────────────────
export function useTotalCount(
  data: ReturnType<typeof useLibraryPrompts>["data"]
): number {
  return data?.pages[0]?.total ?? 0;
}

// ─── Page size export ─────────────────────────────────────────────────────────
export { PAGE_SIZE };
