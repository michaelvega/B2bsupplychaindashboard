/**
 * Waitlist / demo request: appends a submission to the Google Sheet via
 * the Apps Script web app bound to that spreadsheet.
 *
 * Configure SHEET_WEBAPP_URL in Cloudflare Pages environment variables
 * (project settings -> Environment variables). See
 * scripts/google-sheet-waitlist.gs for the Apps Script to deploy.
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: CORS });
  }

  const webAppUrl = env.SHEET_WEBAPP_URL;
  if (!webAppUrl) {
    return new Response(JSON.stringify({ error: 'SHEET_WEBAPP_URL not configured' }), { status: 503, headers: CORS });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: CORS });
  }

  const name = String(payload.name || '').trim().slice(0, 120);
  const email = String(payload.email || '').trim().slice(0, 200);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !validEmail) {
    return new Response(JSON.stringify({ error: 'Name and a valid email are required' }), { status: 400, headers: CORS });
  }

  const row = {
    name,
    email,
    business: String(payload.business || '').trim().slice(0, 200),
    timestamp: String(payload.timestamp || new Date().toISOString()),
  };

  const upstream = await fetch(webAppUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  });

  return new Response(
    JSON.stringify({ ok: upstream.ok }),
    { status: upstream.ok ? 200 : 502, headers: CORS }
  );
}
