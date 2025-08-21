import { json, text, readJson } from '../../../lib/utils.js';
import { ensureSchema } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export const onRequestPost = async ({ env, request, params }) => {
  const authErr = requireAuth(request); if(authErr) return authErr;
  const initErr = await ensureSchema(env); if(initErr) return initErr;
  const id = parseInt(params.id,10);
  const body = await readJson(request) || {};
  const approved = body.approved ? 1 : 0;
  if(!id) return text('Brak ID', 400);
  try{
    await env.DB.prepare('UPDATE reviews SET approved=?1 WHERE id=?2').bind(approved, id).run();
    return json({ ok:true });
  }catch(e){ return text('DB error: '+e.message, 500); }
};
