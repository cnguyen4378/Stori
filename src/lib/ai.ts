import { GoogleGenerativeAI } from "@google/generative-ai";

interface AiResult {
  summary: string;
  tags: string[];
}

export async function generateSummaryAndTags(content: string): Promise<AiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.log("No Gemini API key, using fallback");
    return fallback(content);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are processing a story from a first-generation college graduate.

Given the following story text, return:
1. A concise summary (2–3 sentences max)
2. 3–6 relevant lowercase tags as a JSON array

Story:
"""
${content}
"""

Respond ONLY with valid JSON in this exact format, nothing else:
{"summary": "...", "tags": ["tag1", "tag2", "tag3"]}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Gemini response was not valid JSON:", text);
      return fallback(content);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || fallbackSummary(content),
      tags: Array.isArray(parsed.tags) ? parsed.tags : ["general"],
    };
  } catch (error) {
    console.error("Gemini AI processing failed:", error);
    return fallback(content);
  }
}

function fallback(content: string): AiResult {
  return { summary: fallbackSummary(content), tags: ["general"] };
}

function fallbackSummary(content: string): string {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const first = sentences.slice(0, 2).join(". ").trim();
  return first ? first + "." : "A first-gen college student shares their experience.";
}
