import { text } from '../../../lib/utils.js';
import { ensureSchema } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export const onRequestDelete = async ({ env, request, params }) => {
  const authErr = requireAuth(request); if(authErr) return authErr;
  const initErr = await ensureSchema(env); if(initErr) return initErr;
  const id = parseInt(params.id,10);
  if(!id) return text('Brak ID', 400);
  try{
    await env.DB.prepare('DELETE FROM reviews WHERE id=?1').bind(id).run();
    return new Response('ok');
  }catch(e){ return text('DB error: '+e.message, 500); }
};
