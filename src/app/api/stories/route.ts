import { NextResponse } from "next/server";
import { getAllStories } from "@/lib/db";

export async function GET() {
  try {
    const stories = getAllStories();
    const formatted = stories.map((s) => ({
      id: s.id,
      title: s.title,
      content: s.content,
      summary: s.summary,
      tags: JSON.parse(s.tags),
      media_url: s.media_url || null,
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Stories fetch error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
