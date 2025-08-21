import { text } from '../lib/utils.js';
import { clearAuthCookie } from '../lib/auth.js';

export const onRequestPost = async () => {
  return new Response('ok', { status: 200, headers: { 'set-cookie': clearAuthCookie() } });
};
