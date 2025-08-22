export const json = (obj, status=200, headers={}) => new Response(JSON.stringify(obj), {status, headers:{'content-type':'application/json; charset=utf-8', ...headers}});
export const text = (t, status=200, headers={}) => new Response(t, {status, headers:{'content-type':'text/plain; charset=utf-8', ...headers}});
export async function readJson(req){
  try{ return await req.json(); }catch{ return null; }
}
export function requireFields(obj, fields){
  for(const f of fields){ if(!obj || obj[f]===undefined || obj[f]===null || String(obj[f]).trim()==='') return false; }
  return true;
}
export function sanitize(s){ return String(s).replace(/\s+/g,' ').trim(); }
