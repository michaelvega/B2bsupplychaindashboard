/**
 * Auth helpers for the password-gated investor area (/seed). The password lives
 * only in the SEED_PASSWORD secret; sessions are HMAC-signed cookies keyed with a
 * secret derived from SESSION_SECRET, so a Foundry cookie can never open /seed.
 */
export const SEED_COOKIE = 'seed_session';
export const SEED_MAX_AGE = 60 * 60 * 24 * 3;

const enc = new TextEncoder();

function b64urlToBytes(s: string): Uint8Array {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  return Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad), (c) => c.charCodeAt(0));
}

function bytesToB64url(buf: ArrayBuffer): string {
  let bin = '';
  for (const b of new Uint8Array(buf)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const hmacKey = (secret: string) =>
  crypto.subtle.importKey('raw', enc.encode(`${secret}|seed`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);

/** Constant-time password check: compare fixed-length SHA-256 digests. */
export async function passwordMatches(input: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(input)),
    crypto.subtle.digest('SHA-256', enc.encode(expected)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export async function signSeedSession(secret: string): Promise<string> {
  const payload = bytesToB64url(enc.encode(JSON.stringify({ x: Math.floor(Date.now() / 1000) + SEED_MAX_AGE })).buffer as ArrayBuffer);
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(payload));
  return `${payload}.${bytesToB64url(sig)}`;
}

export async function hasSeedSession(cookieHeader: string | null, secret: string): Promise<boolean> {
  if (!cookieHeader || !secret) return false;
  const match = cookieHeader.split(/;\s*/).find((c) => c.startsWith(`${SEED_COOKIE}=`));
  if (!match) return false;
  const [payload, sig] = match.slice(SEED_COOKIE.length + 1).split('.');
  if (!payload || !sig) return false;
  try {
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(secret), b64urlToBytes(sig), enc.encode(payload));
    if (!ok) return false;
    return JSON.parse(new TextDecoder().decode(b64urlToBytes(payload))).x > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
