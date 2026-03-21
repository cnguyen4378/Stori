import { NextRequest, NextResponse } from "next/server";
import { semanticSearch } from "@/lib/chroma";
import { getStoriesByIds, searchStoriesByKeyword } from "@/lib/db";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const results = await semanticSearch(query, 5);
    const ids = results.map((r) => r.id);
    const stories = getStoriesByIds(ids);

    // Preserve similarity ranking
    const scoreMap = new Map(results.map((r) => [r.id, r.score]));
    stories.sort(
      (a, b) => (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0)
    );

    const formatted = stories.map((s) => ({
      id: s.id,
      title: s.title,
      content: s.content,
      summary: s.summary,
      tags: JSON.parse(s.tags),
      media_url: s.media_url || null,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Semantic search failed, falling back to keyword:", err);

    const stories = searchStoriesByKeyword(query);
    const formatted = stories.map((s) => ({
      id: s.id,
      title: s.title,
      content: s.content,
      summary: s.summary,
      tags: JSON.parse(s.tags),
      media_url: s.media_url || null,
    }));

    return NextResponse.json(formatted);
  }
}
