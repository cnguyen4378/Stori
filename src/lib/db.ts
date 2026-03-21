import Database from "better-sqlite3";
import path from "path";

export interface Story {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string; // JSON array stored as string
  media_url: string | null;
  created_at: string;
}

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;

  const dbPath = path.join(process.cwd(), "stori.db");
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT 'Untitled Story',
      content TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      media_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Add columns to existing databases that don't have them yet
  for (const col of [
    "ALTER TABLE stories ADD COLUMN media_url TEXT",
    "ALTER TABLE stories ADD COLUMN title TEXT NOT NULL DEFAULT 'Untitled Story'",
  ]) {
    try { db.exec(col); } catch { /* already exists */ }
  }

  return db;
}

export function insertStory(story: {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  mediaUrl?: string | null;
}): Story {
  const d = getDb();
  const tagsJson = JSON.stringify(story.tags);

  d.prepare(
    "INSERT INTO stories (id, title, content, summary, tags, media_url) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(story.id, story.title, story.content, story.summary, tagsJson, story.mediaUrl || null);

  return d.prepare("SELECT * FROM stories WHERE id = ?").get(story.id) as Story;
}

export function getStoryById(id: string): Story | undefined {
  const d = getDb();
  return d.prepare("SELECT * FROM stories WHERE id = ?").get(id) as
    | Story
    | undefined;
}

export function getAllStories(): Story[] {
  const d = getDb();
  return d
    .prepare("SELECT * FROM stories ORDER BY created_at DESC LIMIT 50")
    .all() as Story[];
}

export function getStoriesByIds(ids: string[]): Story[] {
  if (ids.length === 0) return [];
  const d = getDb();
  const placeholders = ids.map(() => "?").join(",");
  return d
    .prepare(`SELECT * FROM stories WHERE id IN (${placeholders})`)
    .all(...ids) as Story[];
}

export function searchStoriesByKeyword(query: string): Story[] {
  const d = getDb();
  const pattern = `%${query}%`;
  return d
    .prepare(
      "SELECT * FROM stories WHERE title LIKE ? OR content LIKE ? OR summary LIKE ? OR tags LIKE ? ORDER BY created_at DESC LIMIT 10"
    )
    .all(pattern, pattern, pattern, pattern) as Story[];
}
