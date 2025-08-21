import { json, text, readJson, requireFields, sanitize } from '../../lib/utils.js';
import { ensureSchema } from '../../lib/db.js';

export const onRequestGet = async ({ env }) => {
  const initErr = await ensureSchema(env); if(initErr) return initErr;
  const rs = await env.DB.prepare('SELECT id, name, rating, content, approved, created_at FROM reviews WHERE approved=1 ORDER BY created_at DESC LIMIT 50').all();
  return json(rs.results || []);
};

export const onRequestPost = async ({ env, request }) => {
  const initErr = await ensureSchema(env); if(initErr) return initErr;
  const body = await readJson(request);
  if(!requireFields(body, ['name','rating','content'])) return text('Brak pól', 400);
  const name = sanitize(String(body.name)).slice(0, 80);
  const rating = Math.max(1, Math.min(5, parseInt(body.rating,10)||5));
  const content = sanitize(String(body.content)).slice(0, 2000);
  try{
    await env.DB.prepare('INSERT INTO reviews (name, rating, content, approved) VALUES (?1, ?2, ?3, 0)').bind(name, rating, content).run();
    return json({ ok:true });
  }catch(e){ return text('DB error: '+e.message, 500); }
};
