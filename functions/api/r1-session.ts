import { R1_COOKIE, R1_MAX_AGE, passwordMatches, signR1Session } from '../_lib/r1-auth';

const JSON_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...extra } });

/**
 * POST { password }  check against the SEED_PASSWORD secret, set the session cookie.
 * DELETE             clear the session cookie.
 */
export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method === 'DELETE') {
    return json({ ok: true }, 200, { 'Set-Cookie': `${R1_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` });
  }
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!env.SEED_PASSWORD || !env.SESSION_SECRET) return json({ error: 'Not configured' }, 503);

  let password = '';
  try {
    password = String((await request.json()).password ?? '').slice(0, 200);
  } catch {
    return json({ error: 'Bad request' }, 400);
  }

  if (!(await passwordMatches(password.trim(), env.SEED_PASSWORD))) {
    await new Promise((r) => setTimeout(r, 1200)); // slow down guessing
    return json({ error: 'Incorrect password' }, 401);
  }

  const session = await signR1Session(env.SESSION_SECRET);
  return json({ ok: true }, 200, {
    'Set-Cookie': `${R1_COOKIE}=${session}; Path=/; Max-Age=${R1_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
  });
}
