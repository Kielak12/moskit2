import { json, text } from '../lib/utils.js';
import { checkAuth } from '../lib/auth.js';

export const onRequestGet = async ({ request }) => {
  if(!checkAuth(request)) return text('Unauthorized', 401);
  return json({ ok: true });
};
