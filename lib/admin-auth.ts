import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { env } from './env';
import { ADMIN_COOKIE, verifyAdminToken } from './tokens';

const MIN_PASSWORD_LENGTH = 12;
let warnedWeakPassword = false;

export function checkPassword(input: string): boolean {
  const adminPassword = env().ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < MIN_PASSWORD_LENGTH) {
    if (!warnedWeakPassword) {
      console.warn('[admin-auth] ADMIN_PASSWORD is unset or shorter than 12 characters — login is disabled');
      warnedWeakPassword = true;
    }
    return false;
  }
  const a = createHash('sha256').update(input).digest();
  const b = createHash('sha256').update(adminPassword).digest();
  return timingSafeEqual(a, b);
}

// Call this at the top of every admin server action and route handler, not
// just the protected layout — layouts don't re-run for actions or route
// handlers, so an action without its own check would be publicly callable.
export async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login');
  }
}
