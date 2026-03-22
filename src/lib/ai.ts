import { GoogleGenerativeAI } from "@google/generative-ai";

interface AiResult {
  title: string;
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are processing a story from a first-generation college graduate.

Given the following story text, return:
1. A short, engaging title (5–10 words, like a blog post headline)
2. A concise summary (2–3 sentences max)
3. 3–6 relevant lowercase tags as a JSON array

TAG RULES (important):
- All tags must be lowercase, hyphenated (no spaces). Example: "first-gen", "financial-aid", "imposter-syndrome"
- ALWAYS use "first-gen" instead of "first-generation", "first generation", or "1st gen"
- Use consistent short forms: "mental-health" not "mental health", "career-advice" not "career"
- Prefer specific tags over vague ones: "financial-aid" over "money", "imposter-syndrome" over "feelings"

Story:
"""
${content}
"""

Respond ONLY with valid JSON in this exact format, nothing else:
{"title": "...", "summary": "...", "tags": ["tag1", "tag2", "tag3"]}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Gemini response was not valid JSON:", text);
      return fallback(content);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const rawTags: string[] = Array.isArray(parsed.tags) ? parsed.tags : ["general"];
    const normalizedTags = rawTags.map(normalizeTags);
    return {
      title: parsed.title || fallbackTitle(content),
      summary: parsed.summary || fallbackSummary(content),
      tags: [...new Set(normalizedTags)],
    };
  } catch (error) {
    console.error("Gemini AI processing failed:", error);
    return fallback(content);
  }
}

const TAG_ALIASES: Record<string, string> = {
  "first-generation": "first-gen",
  "first generation": "first-gen",
  "1st gen": "first-gen",
  "1st-gen": "first-gen",
  "mental health": "mental-health",
  "imposter syndrome": "imposter-syndrome",
  "impostor syndrome": "imposter-syndrome",
  "financial aid": "financial-aid",
  "career advice": "career-advice",
  "family pressure": "family-pressure",
  "college life": "college-life",
  "time management": "time-management",
  "study tips": "study-tips",
  "work life balance": "work-life-balance",
};

function normalizeTags(tag: string): string {
  const lower = tag.toLowerCase().trim();
  if (TAG_ALIASES[lower]) return TAG_ALIASES[lower];
  return lower.replace(/\s+/g, "-");
}

function fallback(content: string): AiResult {
  return { title: fallbackTitle(content), summary: fallbackSummary(content), tags: ["general"] };
}

function fallbackTitle(content: string): string {
  const first = content.split(/[.!?\n]+/)[0]?.trim() || "";
  if (first.length <= 60) return first || "Untitled Story";
  return first.slice(0, 57) + "...";
}

function fallbackSummary(content: string): string {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const first = sentences.slice(0, 2).join(". ").trim();
  return first ? first + "." : "A first-gen college student shares their experience.";
}
