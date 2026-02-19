import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-6 text-center">
      <div className="text-6xl">🔮</div>
      <h1 className="font-display font-bold text-3xl text-text-primary">
        404 — Page Not Found
      </h1>
      <p className="text-muted text-sm max-w-xs">
        This page doesn&apos;t exist. Head back to the library to explore 5,000+ prompts.
      </p>
      <Link
        href="/library"
        className="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
      >
        Back to Library
      </Link>
    </main>
  );
}
