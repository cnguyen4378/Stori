import { NextRequest, NextResponse } from "next/server";
import { semanticSearch, SearchResult } from "@/lib/chroma";
import { getStoriesByIds, searchStoriesByKeyword } from "@/lib/db";

const SIMILARITY_THRESHOLD = 0.75;
const TAG_BOOST = 0.05;
const MAX_RESULTS = 5;
const KEYWORD_FALLBACK_LIMIT = 3;

function boostByTags(
  results: SearchResult[],
  queryWords: string[]
): SearchResult[] {
  return results.map((r) => {
    let tags: string[] = [];
    try {
      tags = JSON.parse(r.tags);
    } catch { /* ignore */ }

    const hasTagMatch = tags.some((tag) =>
      queryWords.some((w) => tag.includes(w))
    );

    return {
      ...r,
      score: hasTagMatch ? r.score + TAG_BOOST : r.score,
    };
  });
}

function formatStory(s: { id: string; title: string; summary: string; tags: string; media_url: string | null }) {
  return {
    id: s.id,
    title: s.title,
    summary: s.summary,
    tags: JSON.parse(s.tags) as string[],
    media_url: s.media_url || null,
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json([]);
  }

  const queryWords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

  try {
    let results = await semanticSearch(query, 10);

    results = boostByTags(results, queryWords);

    results.sort((a, b) => b.score - a.score);

    const filtered = results.filter((r) => r.score >= SIMILARITY_THRESHOLD);

    if (filtered.length === 0) {
      const kwStories = searchStoriesByKeyword(query);
      return NextResponse.json(
        kwStories.slice(0, KEYWORD_FALLBACK_LIMIT).map(formatStory)
      );
    }

    const topIds = filtered.slice(0, MAX_RESULTS).map((r) => r.id);
    const stories = getStoriesByIds(topIds);

    const scoreMap = new Map(filtered.map((r) => [r.id, r.score]));
    stories.sort(
      (a, b) => (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0)
    );

    return NextResponse.json(stories.map(formatStory));
  } catch (err) {
    console.error("Semantic search failed, falling back to keyword:", err);

    const stories = searchStoriesByKeyword(query);
    return NextResponse.json(
      stories.slice(0, KEYWORD_FALLBACK_LIMIT).map(formatStory)
    );
  }
}
