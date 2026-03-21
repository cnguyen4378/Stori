import { NextRequest, NextResponse } from "next/server";
import { processStory } from "@/lib/process";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let content: string;
    let mediaUrl: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      content = (formData.get("content") as string)?.trim() || "";
      const file = formData.get("file") as File | null;

      if (file && file.size > 0) {
        const ext = path.extname(file.name) || ".bin";
        const filename = `${randomUUID()}${ext}`;
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir))
          fs.mkdirSync(uploadsDir, { recursive: true });

        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(uploadsDir, filename), buffer);
        mediaUrl = `/uploads/${filename}`;
      }
    } else {
      const body = await request.json();
      content = body.content?.trim() || "";
    }

    if (!content) {
      return NextResponse.json(
        { error: "No story text provided." },
        { status: 400 }
      );
    }

    const story = await processStory(content, mediaUrl);

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
