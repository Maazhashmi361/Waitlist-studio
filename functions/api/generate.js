// Writes landing page copy with Cloudflare Workers AI (free daily allowance).
// If the model name is ever rejected, change MODEL to another text model from the Workers AI catalog.
const MODEL = '@cf/meta/llama-3.1-8b-instruct';
const DAILY_CAP = 100; // generations per day, keeps usage under the free allowance

const json = (o, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  const { prompt } = await request.json().catch(() => ({}));
  if (typeof prompt !== 'string' || prompt.length < 20 || prompt.length > 3000) return json({ error: 'bad request' }, 400);

  const day = new Date().toISOString().slice(0, 10);
  const row = await env.DB.prepare(
    'INSERT INTO usage(day,n) VALUES(?,1) ON CONFLICT(day) DO UPDATE SET n=n+1 RETURNING n'
  ).bind(day).first();
  if (row.n > DAILY_CAP) return json({ error: 'daily cap reached' }, 429);

  const out = await env.AI.run(MODEL, {
    messages: [
      { role: 'system', content: 'You output only valid JSON. No markdown, no commentary.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 600,
  });

  let r = out.response;
  if (typeof r === 'string') {
    const a = r.indexOf('{'), b = r.lastIndexOf('}');
    try { r = JSON.parse(r.slice(a, b + 1)); } catch { return json({ error: 'bad model output' }, 502); }
  }
  return json(r);
}
