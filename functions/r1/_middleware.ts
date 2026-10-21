import { hasR1Session } from '../_lib/r1-auth';

const redirect = (location: string, status: number) => new Response(null, { status, headers: { Location: location } });

/** Gate for /r1/*: no valid session cookie means redirect to the password page. */
export async function onRequest(context: any) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (url.pathname === '/r1') return redirect(`/r1/${url.search}`, 308);

  if (!(await hasR1Session(request.headers.get('Cookie'), env.SESSION_SECRET))) {
    return redirect('/r1-login/', 302);
  }

  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'private, no-store');
  out.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return out;
}
