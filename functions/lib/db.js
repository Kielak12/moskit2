// functions/lib/db.js
import { text } from './utils.js';

export async function ensureSchema(env){
  // Czy DB jest zbindowane?
  if (!env.DB) {
    return text(
      'DB binding `DB` is missing. Configure it in Pages → Settings → Functions → D1 bindings (both Preview and Production).',
      500
    );
  }

  try {
    // Prosty, kompatybilny schemat (bez CHECK/strftime)
    await env.DB.exec(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        content TEXT NOT NULL,
        approved INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );
    `);

    await env.DB.exec(`
      CREATE INDEX IF NOT EXISTS idx_reviews_approved
      ON reviews (approved, created_at);
    `);

    await env.DB.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        city TEXT NOT NULL,
        type TEXT NOT NULL,
        qty INTEGER NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );
    `);

    await env.DB.exec(`
      CREATE INDEX IF NOT EXISTS idx_appts_created
      ON appointments (created_at);
    `);
  } catch (e) {
    return text('DB init error: ' + e.message, 500);
  }
  return null;
}

