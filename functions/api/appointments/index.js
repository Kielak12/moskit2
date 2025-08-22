import { json, text, readJson, requireFields, sanitize } from '../../lib/utils.js';
import { ensureSchema } from '../../lib/db.js';
import { requireAuth } from '../../lib/auth.js';

export const onRequestGet = async ({ env, request }) => {
  const authErr = requireAuth(request); if(authErr) return authErr;
  const initErr = await ensureSchema(env); if(initErr) return initErr;
  const rs = await env.DB.prepare('SELECT id, name, phone, email, city, type, qty, date, notes, created_at FROM appointments ORDER BY created_at DESC').all();
  return json(rs.results || []);
};

export const onRequestPost = async ({ env, request }) => {
  const initErr = await ensureSchema(env); if(initErr) return initErr;
  const body = await readJson(request);
  if(!requireFields(body, ['name','phone','city','type','qty','date'])) return text('Brak wymaganych pól', 400);
  const v = {
    name: sanitize(body.name).slice(0,120),
    phone: sanitize(body.phone).slice(0,40),
    email: (body.email? sanitize(body.email).slice(0,120): null),
    city: sanitize(body.city).slice(0,120),
    type: sanitize(body.type).slice(0,60),
    qty: Math.max(1, parseInt(body.qty,10) || 1),
    date: sanitize(body.date).slice(0,20),
    notes: body.notes? sanitize(body.notes).slice(0,2000): null
  };
  try{
    await env.DB.prepare('INSERT INTO appointments (name, phone, email, city, type, qty, date, notes) VALUES (?1,?2,?3,?4,?5,?6,?7,?8)')
      .bind(v.name, v.phone, v.email, v.city, v.type, v.qty, v.date, v.notes).run();
    return json({ ok:true });
  }catch(e){ return text('DB error: '+e.message, 500); }
};
