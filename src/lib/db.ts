import Database from "better-sqlite3";
import path from "path";

export interface Story {
  id: string;
  content: string;
  summary: string;
  tags: string; // JSON array stored as string
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
      content TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  return db;
}

export function insertStory(story: {
  id: string;
  content: string;
  summary: string;
  tags: string[];
}): Story {
  const d = getDb();
  const tagsJson = JSON.stringify(story.tags);

  d.prepare(
    "INSERT INTO stories (id, content, summary, tags) VALUES (?, ?, ?, ?)"
  ).run(story.id, story.content, story.summary, tagsJson);

  return d.prepare("SELECT * FROM stories WHERE id = ?").get(story.id) as Story;
}

export function getAllStories(): Story[] {
  const d = getDb();
  return d
    .prepare("SELECT * FROM stories ORDER BY created_at DESC LIMIT 50")
    .all() as Story[];
}
