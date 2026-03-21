import { v4 as uuidv4 } from "uuid";
import { generateSummaryAndTags } from "./ai";
import { insertStory, Story } from "./db";
import { storeEmbedding } from "./chroma";

export interface ProcessedStory {
  content: string;
  summary: string;
  tags: string[];
}

export async function processStory(
  text: string,
  mediaUrl?: string | null
): Promise<Story> {
  const id = uuidv4();
  const { summary, tags } = await generateSummaryAndTags(text);
  const story = insertStory({ id, content: text, summary, tags, mediaUrl });

  // Store embedding for semantic search (non-blocking, won't crash on failure)
  storeEmbedding(id, text, summary, JSON.stringify(tags)).catch((err) =>
    console.error("Embedding storage failed (non-fatal):", err)
  );

  return story;
}
