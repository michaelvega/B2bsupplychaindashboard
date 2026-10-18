import { readSession } from '../_lib/foundry-auth';

/** Gate for /foundry/*: no valid session cookie means redirect to the sign-in page. */
export async function onRequest(context: any) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (url.pathname === '/foundry') {
    return Response.redirect(`${url.origin}/foundry/${url.search}`, 308);
  }

  const email = await readSession(request.headers.get('Cookie'), env.SESSION_SECRET);
  if (!email) {
    return Response.redirect(`${url.origin}/foundry-login/`, 302);
  }

  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'private, no-store');
  return out;
}
