import { NextResponse } from "next/server";
import { getTrendingPrompts } from "@/data/prompts";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTrendingPrompts());
}
