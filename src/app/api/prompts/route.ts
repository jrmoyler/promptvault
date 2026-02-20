import { NextRequest, NextResponse } from "next/server";
import { queryPrompts } from "@/data/prompts";
import type { FilterState } from "@/types";

export const dynamic = "force-dynamic";

function parseFavorites(value: string | null): number[] {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((id) => Number.isFinite(id));
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const filter: FilterState = {
    search: searchParams.get("search") ?? "",
    toolFilter: searchParams.get("toolFilter") || null,
    categoryFilter: searchParams.get("categoryFilter") || null,
    sort: (searchParams.get("sort") as FilterState["sort"]) || "most-used",
  };

  const page = Number(searchParams.get("page") ?? "0");
  const favorites = parseFavorites(searchParams.get("favorites"));

  const result = queryPrompts(filter, favorites, Number.isFinite(page) ? page : 0);
  return NextResponse.json(result);
}
