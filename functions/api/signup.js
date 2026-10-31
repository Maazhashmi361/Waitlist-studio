// Saves a waitlist email into D1. Open to any origin so downloaded pages can post here.
const H = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Content-Type': 'application/json' };

export const onRequestOptions = () => new Response(null, { headers: H });

export async function onRequestPost({ request, env }) {
  const slug = new URL(request.url).searchParams.get('slug') || '';
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const valid = /^[a-z0-9-]{3,60}$/.test(slug) && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  if (!valid) return new Response('{"error":"invalid"}', { status: 400, headers: H });
  await env.DB.prepare('INSERT OR IGNORE INTO signups(slug,email) VALUES(?,?)').bind(slug, email).run();
  return new Response('{"ok":true}', { headers: H });
}
