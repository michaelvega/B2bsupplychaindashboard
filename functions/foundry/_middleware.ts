import { readSession } from '../_lib/foundry-auth';

/** Relative redirect, so it stays on whatever host (or dev proxy) the visitor used. */
function redirect(location: string, status: number) {
  return new Response(null, { status, headers: { Location: location } });
}

/** Gate for /foundry/*: no valid session cookie means redirect to the sign-in page. */
export async function onRequest(context: any) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (url.pathname === '/foundry') {
    return redirect(`/foundry/${url.search}`, 308);
  }

  const email = await readSession(request.headers.get('Cookie'), env.SESSION_SECRET);
  if (!email) {
    return redirect('/foundry-login/', 302);
  }

  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'private, no-store');
  return out;
}
