// Owner-only list of signups. Open /api/signups?key=YOUR_ADMIN_KEY&slug=PAGE_ID (add &format=csv for a spreadsheet file).
export async function onRequestGet({ request, env }) {
  const u = new URL(request.url);
  if (!env.ADMIN_KEY || u.searchParams.get('key') !== env.ADMIN_KEY) return new Response('Unauthorized', { status: 401 });
  const slug = u.searchParams.get('slug');
  const q = slug
    ? env.DB.prepare('SELECT slug,email,created_at FROM signups WHERE slug=? ORDER BY id DESC').bind(slug)
    : env.DB.prepare('SELECT slug,email,created_at FROM signups ORDER BY id DESC LIMIT 500');
  const { results } = await q.all();
  if (u.searchParams.get('format') === 'csv') {
    const csv = 'slug,email,created_at\n' + results.map(r => [r.slug, r.email, r.created_at].join(',')).join('\n');
    return new Response(csv, { headers: { 'Content-Type': 'text/csv' } });
  }
  return Response.json(results);
}
