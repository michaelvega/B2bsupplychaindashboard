import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifyFirebaseIdToken } from '../_lib/foundry-auth';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/**
 * POST { idToken }  verify the Firebase token, record the email in D1, set the session cookie.
 * DELETE            clear the session cookie.
 */
export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method === 'DELETE') {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...JSON_HEADERS, 'Set-Cookie': `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: JSON_HEADERS });
  }
  if (!env.SESSION_SECRET) {
    return new Response(JSON.stringify({ error: 'SESSION_SECRET not configured' }), { status: 503, headers: JSON_HEADERS });
  }

  let user: { email: string; name: string };
  try {
    const { idToken } = await request.json();
    user = await verifyFirebaseIdToken(idToken);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Sign-in failed: ${err.message}` }), { status: 401, headers: JSON_HEADERS });
  }

  if (env.FOUNDRY_DB) {
    const now = new Date().toISOString();
    await env.FOUNDRY_DB
      .prepare(
        `INSERT INTO foundry_signups (email, name, first_seen, last_seen, visits)
         VALUES (?1, ?2, ?3, ?3, 1)
         ON CONFLICT(email) DO UPDATE SET name = ?2, last_seen = ?3, visits = visits + 1`,
      )
      .bind(user.email, user.name.slice(0, 120), now)
      .run();
  }

  const session = await signSession(user.email, env.SESSION_SECRET);
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      ...JSON_HEADERS,
      'Set-Cookie': `${SESSION_COOKIE}=${session}; Path=/; Max-Age=${SESSION_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}
