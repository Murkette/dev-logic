import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { checkPassword } from '@/lib/admin-auth';
import { signAdminToken, ADMIN_COOKIE, ADMIN_MAX_AGE_SEC } from '@/lib/tokens';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIpFromHeaders } from '@/lib/ip';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false } };

async function login(formData: FormData) {
  'use server';

  const ip = await getClientIpFromHeaders();
  const limit = rateLimit('admin-login', ip, 5, 15 * 60_000);
  const password = String(formData.get('password') ?? '');

  if (!limit.ok || !checkPassword(password)) {
    redirect('/admin/login?error=1');
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, signAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: ADMIN_MAX_AGE_SEC,
  });
  redirect('/admin');
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4">
      <h1 className="text-xl font-medium text-ink">Admin login</h1>
      <form action={login} className="mt-6 flex flex-col gap-3">
        <label htmlFor="password" className="text-sm text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="h-10 rounded border border-line bg-surface px-3 text-ink"
        />
        {error && <p className="text-sm text-risk-high-text">Wrong password.</p>}
        <button type="submit" className="h-10 rounded bg-accent font-medium text-on-accent">
          Log in
        </button>
      </form>
    </main>
  );
}
