import { text } from './utils.js';

const COOKIE_NAME = 'mm_auth';

function cookie(parts){
  return Object.entries(parts)
    .map(([k,v]) => (v === true || v === null ? k : `${k}=${v}`))
    .join('; ');
}

export function getCookie(request, name=COOKIE_NAME){
  const h = request.headers.get('cookie') || '';
  const m = h.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[1]) : null;
}

export function setAuthCookie(){
  const value = '1';
  const maxAge = 60*60*8;
  return cookie({[COOKIE_NAME]: value, Path:'/', HttpOnly:true, SameSite:'Lax', 'Max-Age': maxAge});
}

export function clearAuthCookie(){
  return cookie({[COOKIE_NAME]:'', Path:'/', HttpOnly:true, SameSite:'Lax', 'Max-Age': 0});
}

export function checkAuth(request){
  return getCookie(request) === '1';
}

export function requireAuth(request){
  if(!checkAuth(request)) return text('Unauthorized', 401);
  return null;
}

export async function verifyLogin(request, env){
  const body = await request.json().catch(()=>null);
  const u = (env.ADMIN_USER || '123');
  const p = (env.ADMIN_PASS || '123');
  if(!body) return false;
  return String(body.user)===u && String(body.pass)===p;
}
