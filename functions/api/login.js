import { json, text } from '../lib/utils.js';
import { setAuthCookie, verifyLogin } from '../lib/auth.js';

export const onRequestPost = async ({ request, env }) => {
  const ok = await verifyLogin(request, env);
  if (!ok) return text('Invalid credentials', 401);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'set-cookie': setAuthCookie(),
    },
  });
};
