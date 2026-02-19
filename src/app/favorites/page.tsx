"use client";

import TopBar from "@/components/layout/TopBar";
import VirtualPromptList from "@/components/prompts/VirtualPromptList";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useFavoritePrompts, useFlatPrompts, useTotalCount } from "@/hooks/usePrompts";
import { useFavorites } from "@/store/useAppStore";
import Link from "next/link";

function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-4xl">
        ★
      </div>
      <div className="text-center">
        <h2 className="font-display font-bold text-xl text-text-primary mb-2">
          No favourites yet
        </h2>
        <p className="text-muted text-sm max-w-xs">
          Star any prompt from the library to save it here for quick access.
        </p>
      </div>
      <Link
        href="/library"
        className="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
      >
        Browse Library
      </Link>
    </div>
  );
}

export default function FavoritesPage() {
  const favorites = useFavorites();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFavoritePrompts();

  const prompts = useFlatPrompts(data);
  const total = useTotalCount(data);

  return (
    <main className="flex flex-col min-h-full">
      <TopBar title="My Favorites" showSearch={false} />

      <div className="px-6 py-6">
        {favorites.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <ErrorBoundary>
            <VirtualPromptList
              prompts={prompts}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={!!hasNextPage}
              fetchNextPage={fetchNextPage}
              total={total}
              emptyMessage="None of your favourites match this search"
              emptyIcon="★"
            />
          </ErrorBoundary>
        )}
      </div>
    </main>
  );
}
