/**
 * Auth helpers for the gated Foundry demo: Firebase ID-token verification
 * (RS256 against Google's public JWKS, no secret needed) and a small
 * HMAC-signed session cookie.
 */
const PROJECT_ID = 'project-6fd6b5b1-7691-4eea-a70';
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

export const SESSION_COOKIE = 'foundry_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const enc = new TextEncoder();

function b64urlToBytes(s: string): Uint8Array {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function bytesToB64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = '';
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function verifyFirebaseIdToken(token: string): Promise<{ email: string; name: string }> {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('Malformed token');
  const [h, p, s] = parts;

  const header = JSON.parse(new TextDecoder().decode(b64urlToBytes(h)));
  if (header.alg !== 'RS256') throw new Error('Unexpected alg');

  const res = await fetch(JWKS_URL, { cf: { cacheTtl: 3600, cacheEverything: true } } as any);
  const jwks: any = await res.json();
  const jwk = jwks.keys.find((k: any) => k.kid === header.kid);
  if (!jwk) throw new Error('Unknown signing key');

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(s), enc.encode(`${h}.${p}`));
  if (!ok) throw new Error('Bad signature');

  const claims = JSON.parse(new TextDecoder().decode(b64urlToBytes(p)));
  const now = Math.floor(Date.now() / 1000);
  if (claims.aud !== PROJECT_ID) throw new Error('Wrong audience');
  if (claims.iss !== `https://securetoken.google.com/${PROJECT_ID}`) throw new Error('Wrong issuer');
  if (claims.exp < now) throw new Error('Token expired');
  if (!claims.sub) throw new Error('No subject');
  if (!claims.email || claims.email_verified !== true) throw new Error('Unverified email');

  return { email: String(claims.email).toLowerCase(), name: String(claims.name || '') };
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function signSession(email: string, secret: string): Promise<string> {
  const payload = bytesToB64url(enc.encode(JSON.stringify({ e: email, x: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE })));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(payload));
  return `${payload}.${bytesToB64url(sig)}`;
}

export async function readSession(cookieHeader: string | null, secret: string): Promise<string | null> {
  if (!cookieHeader || !secret) return null;
  const match = cookieHeader.split(/;\s*/).find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  const [payload, sig] = match.slice(SESSION_COOKIE.length + 1).split('.');
  if (!payload || !sig) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(secret), b64urlToBytes(sig), enc.encode(payload));
    if (!ok) return null;
    const { e, x } = JSON.parse(new TextDecoder().decode(b64urlToBytes(payload)));
    return x > Math.floor(Date.now() / 1000) ? e : null;
  } catch {
    return null;
  }
}
