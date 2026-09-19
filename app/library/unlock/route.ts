import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyLibToken, signLibToken, LIB_COOKIE, LIB_MAX_AGE_SEC } from '@/lib/tokens';

export const dynamic = 'force-dynamic';

// The link mailed by sendLibraryEmail. Cookies can only be set in a route
// handler or server action, never during page render, so unlocking has to
// happen here before redirecting to the actual library page.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token');
  const verified = verifyLibToken(token);

  if (verified) {
    const cookieStore = await cookies();
    cookieStore.set(LIB_COOKIE, signLibToken(verified.leadId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: LIB_MAX_AGE_SEC,
    });
  }

  redirect('/library');
}
