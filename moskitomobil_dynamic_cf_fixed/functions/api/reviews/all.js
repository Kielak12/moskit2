import { json, text } from '../../lib/utils.js';
import { ensureSchema } from '../../lib/db.js';
import { requireAuth } from '../../lib/auth.js';

export const onRequestGet = async ({ env, request }) => {
  const authErr = requireAuth(request); if(authErr) return authErr;
  const initErr = await ensureSchema(env); if(initErr) return initErr;
  const rs = await env.DB.prepare('SELECT id, name, rating, content, approved, created_at FROM reviews ORDER BY created_at DESC').all();
  return json(rs.results || []);
};
