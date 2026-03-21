import { v4 as uuidv4 } from "uuid";
import { generateSummaryAndTags } from "./ai";
import { insertStory, Story } from "./db";

export interface ProcessedStory {
  content: string;
  summary: string;
  tags: string[];
}

export async function processStory(text: string): Promise<Story> {
  const id = uuidv4();
  const { summary, tags } = await generateSummaryAndTags(text);
  const story = insertStory({ id, content: text, summary, tags });
  return story;
}
