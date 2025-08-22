import { json } from '../lib/utils.js';
import { ensureSchema } from '../lib/db.js';

export const onRequestGet = async ({ env }) => {
  const initErr = await ensureSchema(env);
  if (initErr) return initErr;
  const r = await env.DB.prepare('SELECT COUNT(*) AS n FROM reviews').first();
  const a = await env.DB.prepare('SELECT COUNT(*) AS n FROM appointments').first();
  return json({ ok: true, reviews: r?.n ?? 0, appointments: a?.n ?? 0 });
};
