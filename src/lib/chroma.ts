/**
 * ChromaDB vector store with file-backed fallback.
 * Uses a local ChromaDB instance when available, otherwise persists
 * embeddings to a JSON file and searches with cosine similarity.
 */

import { ChromaClient, Collection } from "chromadb";
import { generateEmbedding } from "./embeddings";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// ChromaDB client (lazy-initialised)
// ---------------------------------------------------------------------------

let collection: Collection | null = null;
let chromaFailed = false;

async function getCollection(): Promise<Collection | null> {
  if (chromaFailed) return null;
  if (collection) return collection;

  try {
    const client = new ChromaClient({ path: "http://localhost:8000" });
    collection = await client.getOrCreateCollection({ name: "stories" });
    console.log("Connected to ChromaDB");
    return collection;
  } catch (err) {
    console.warn("ChromaDB unavailable, using file fallback:", err);
    chromaFailed = true;
    return null;
  }
}

// ---------------------------------------------------------------------------
// File-backed fallback
// ---------------------------------------------------------------------------

interface VectorEntry {
  id: string;
  embedding: number[];
  metadata: { content: string; summary: string; tags: string };
}

const STORE_PATH = path.join(process.cwd(), "data", "vectors.json");
let vectors: VectorEntry[] = [];
let loaded = false;

function load() {
  if (loaded) return;
  try {
    if (fs.existsSync(STORE_PATH)) {
      vectors = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    }
  } catch {
    vectors = [];
  }
  loaded = true;
}

function save() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(vectors));
}

function cosine(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function storeEmbedding(
  id: string,
  content: string,
  summary: string,
  tags: string
) {
  try {
    const embedding = await generateEmbedding(content);
    const col = await getCollection();

    if (col) {
      await col.upsert({
        ids: [id],
        embeddings: [embedding],
        documents: [content],
        metadatas: [{ summary, tags }],
      });
      return;
    }

    load();
    vectors = vectors.filter((v) => v.id !== id);
    vectors.push({ id, embedding, metadata: { content, summary, tags } });
    save();
  } catch (err) {
    console.error("Failed to store embedding (non-fatal):", err);
  }
}

export async function semanticSearch(
  query: string,
  topK = 5
): Promise<{ id: string; score: number }[]> {
  const queryEmbedding = await generateEmbedding(query);
  const col = await getCollection();

  if (col) {
    const results = await col.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK,
    });
    const ids = results.ids[0] || [];
    const distances = results.distances?.[0] || [];
    return ids.map((id, i) => ({
      id: id as string,
      score: 1 - (distances[i] ?? 0),
    }));
  }

  load();
  return vectors
    .map((v) => ({ id: v.id, score: cosine(queryEmbedding, v.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
