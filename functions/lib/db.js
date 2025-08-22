import { text } from './utils.js';

export async function ensureSchema(env){
  try{
    await env.DB.exec(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      content TEXT NOT NULL,
      approved INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );`);
    await env.DB.exec(`CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews (approved, created_at DESC);`);
    await env.DB.exec(`CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      city TEXT NOT NULL,
      type TEXT NOT NULL,
      qty INTEGER NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );`);
    await env.DB.exec(`CREATE INDEX IF NOT EXISTS idx_appts_created ON appointments (created_at DESC);`);
  }catch(e){
    return text('DB init error: ' + e.message, 500);
  }
  return null;
}
