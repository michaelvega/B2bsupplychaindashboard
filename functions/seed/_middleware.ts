import { hasSeedSession } from '../_lib/seed-auth';

const redirect = (location: string, status: number) => new Response(null, { status, headers: { Location: location } });

/** Gate for /seed/*: no valid session cookie means redirect to the password page. */
export async function onRequest(context: any) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (url.pathname === '/seed') return redirect(`/seed/${url.search}`, 308);

  if (!(await hasSeedSession(request.headers.get('Cookie'), env.SESSION_SECRET))) {
    return redirect('/seed-login/', 302);
  }

  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'private, no-store');
  out.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return out;
}
