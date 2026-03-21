import { NextRequest, NextResponse } from "next/server";
import { processStory } from "@/lib/process";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json(
        { error: "No story text provided." },
        { status: 400 }
      );
    }

    const story = await processStory(content);

    return NextResponse.json({
      success: true,
      story: {
        ...story,
        tags: JSON.parse(story.tags),
      },
    });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Failed to process story. Please try again." },
      { status: 500 }
    );
  }
}
