/**
 * "Contact Us Now": name + email + optional message.
 * Every message is saved to D1 first (so nothing is lost), then handed to the
 * Apps Script web app (scripts/contact-notify.gs) which emails both founders.
 *
 * Env: FOUNDRY_DB (D1), CONTACT_WEBAPP_URL (secret, the Apps Script /exec URL).
 */
const JSON_HEADERS = { 'Content-Type': 'application/json' };

function reply(body: object, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

/** Ask the Apps Script to email the founders. Resolves true only if it confirms. */
async function notifyFounders(env: any, payload: { name: string; email: string; message: string; source: string }) {
  const res = await fetch(env.CONTACT_WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  });
  if (!res.ok) return false;
  const data: any = await res.json().catch(() => ({}));
  return data.ok === true;
}

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return reply({ error: 'Invalid request' }, 400);
  }

  // Honeypot: real people never fill this hidden field.
  if (body.website) return reply({ ok: true });

  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().slice(0, 200);
  const message = String(body.message || '').trim().slice(0, 2000);
  const source = String(body.source || '').trim().slice(0, 200);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply({ error: 'Please enter your name and a valid email.' }, 400);
  }

  const payload = { name, email, message, source };
  let stored = false;
  let rowId: number | null = null;
  try {
    const res = await env.FOUNDRY_DB
      .prepare('INSERT INTO contact_messages (name, email, message, source, created_at) VALUES (?1, ?2, ?3, ?4, ?5)')
      .bind(name, email, message, source, new Date().toISOString())
      .run();
    stored = true;
    rowId = res?.meta?.last_row_id ?? null;
  } catch (err: any) {
    console.error('contact store failed', err?.message);
  }

  let emailed = false;
  if (env.CONTACT_WEBAPP_URL) {
    try {
      emailed = await notifyFounders(env, payload);
    } catch (err: any) {
      console.error('contact notify failed', err?.message);
    }
  }

  if (emailed && stored && rowId !== null) {
    try {
      await env.FOUNDRY_DB.prepare('UPDATE contact_messages SET emailed = 1 WHERE id = ?1').bind(rowId).run();
    } catch { /* best effort */ }
  }

  if (!stored && !emailed) {
    console.error('contact message not delivered or stored', JSON.stringify(payload));
    return reply({ error: 'Something went wrong. Please email michael@procept.tech directly.' }, 502);
  }
  return reply({ ok: true });
}
