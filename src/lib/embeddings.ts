import { GoogleGenerativeAI } from "@google/generative-ai";

const EMBED_MODEL = "gemini-embedding-001";

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return hashEmbedding(text);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: EMBED_MODEL });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (err) {
    console.error("Gemini embedding failed, using hash fallback:", err);
    return hashEmbedding(text);
  }
}

function hashEmbedding(text: string): number[] {
  const DIM = 128;
  const vec = new Array(DIM).fill(0);
  for (const word of text.toLowerCase().split(/\s+/)) {
    for (let i = 0; i < word.length; i++) {
      vec[(word.charCodeAt(i) * (i + 1)) % DIM] += 1;
    }
  }
  const mag = Math.sqrt(vec.reduce((s: number, v: number) => s + v * v, 0));
  if (mag > 0) for (let i = 0; i < DIM; i++) vec[i] /= mag;
  return vec;
}
