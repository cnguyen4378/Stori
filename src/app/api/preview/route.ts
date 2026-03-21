import { NextRequest, NextResponse } from "next/server";
import { generateSummaryAndTags } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json(
        { error: "No text provided." },
        { status: 400 }
      );
    }

    const { summary, tags } = await generateSummaryAndTags(content);
    return NextResponse.json({ summary, tags });
  } catch (error) {
    console.error("Preview error:", error);
    return NextResponse.json(
      { error: "Failed to generate preview." },
      { status: 500 }
    );
  }
}
