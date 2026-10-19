/**
 * "Contact Us Now": name + email + optional message.
 * Every message is saved to D1 first (so nothing is lost), then emailed to the
 * founders through Cloudflare Email Service when CF_EMAIL_TOKEN is configured.
 *
 * Env: FOUNDRY_DB (D1), CF_EMAIL_TOKEN (secret), CF_ACCOUNT_ID, CONTACT_FROM (optional).
 */
const FOUNDERS = ['michael@procept.tech', 'sam@procept.tech'];
const DEFAULT_FROM = 'contact@procept.tech';
const ACCOUNT_ID = 'ebb00e8cdc5ed232cb0410d7ff2618af';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

function reply(body: object, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

async function sendToFounder(env: any, to: string, payload: { name: string; email: string; message: string; source: string }) {
  const accountId = env.CF_ACCOUNT_ID || ACCOUNT_ID;
  const text = `${payload.name} <${payload.email}> says:\n\n${payload.message || '(no message)'}\n\nSent from: ${payload.source || 'procept.tech'}\nReply to this email to answer them directly.`;
  const html = `<p><strong>${escapeHtml(payload.name)}</strong> &lt;${escapeHtml(payload.email)}&gt; says:</p><p style="white-space:pre-wrap">${escapeHtml(payload.message || '(no message)')}</p><p style="color:#666">Sent from: ${escapeHtml(payload.source || 'procept.tech')}. Reply to this email to answer them directly.</p>`;
  const base = {
    to,
    from: env.CONTACT_FROM || DEFAULT_FROM,
    subject: `Contact Us Now: ${payload.name}`,
    text,
    html,
  };

  const send = (body: object) =>
    fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`, {
      method: 'POST',
      headers: { ...JSON_HEADERS, Authorization: `Bearer ${env.CF_EMAIL_TOKEN}` },
      body: JSON.stringify(body),
    });

  // Prefer a Reply-To so the founders can answer in one click; retry without it if the API rejects the field.
  let res = await send({ ...base, reply_to: payload.email });
  if (res.status === 400) res = await send(base);
  return res.ok;
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
  if (env.CF_EMAIL_TOKEN) {
    try {
      const results = await Promise.all(FOUNDERS.map((to) => sendToFounder(env, to, payload)));
      emailed = results.some(Boolean);
    } catch (err: any) {
      console.error('contact email failed', err?.message);
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
