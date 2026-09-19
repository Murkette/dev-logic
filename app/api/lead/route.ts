import { eq } from 'drizzle-orm';
import { after } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { leads } from '@/db/schema';
import { bump } from '@/lib/counters';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp, hashIp } from '@/lib/ip';
import { isEmail } from '@/lib/validate';
import { signLibToken, LIB_COOKIE, LIB_MAX_AGE_SEC } from '@/lib/tokens';
import { isMailConfigured, sendLibraryEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

const SOURCES = ['bar', 'library'] as const;
const RESEND_WINDOW_MS = 24 * 60 * 60_000;

// Avoids re-sending the library email if the same address submits the form
// again within a day (e.g. the bar and the library wall both being used).
const g = globalThis as unknown as { __cstRecentLibraryEmails?: Map<string, number> };
function recentEmails(): Map<string, number> {
  if (!g.__cstRecentLibraryEmails) g.__cstRecentLibraryEmails = new Map();
  return g.__cstRecentLibraryEmails;
}

function errorResponse(code: string, status: number, message?: string, retryAfterSec?: number) {
  const headers: Record<string, string> = {};
  if (retryAfterSec) headers['Retry-After'] = String(retryAfterSec);
  return Response.json({ error: code, ...(message ? { message } : {}) }, { status, headers });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit('lead', ip, 5, 60 * 60_000);
  if (!limit.ok) return errorResponse('rate_limited', 429, undefined, limit.retryAfterSec);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse('invalid_input', 400);
  }

  const { email, consent, source, website } = (body ?? {}) as {
    email?: unknown;
    consent?: unknown;
    source?: unknown;
    website?: unknown;
  };

  // Honeypot: fake success, no row, no cookie, no email.
  if (typeof website === 'string' && website.length > 0) {
    return Response.json({ ok: true });
  }

  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!isEmail(cleanEmail)) {
    return errorResponse('invalid_input', 400, 'Enter a valid email address.');
  }
  if (consent !== true) {
    return errorResponse('invalid_input', 400, 'Please agree to the Terms and Privacy Policy.');
  }
  if (typeof source !== 'string' || !(SOURCES as readonly string[]).includes(source)) {
    return errorResponse('invalid_input', 400, 'Invalid source.');
  }

  try {
    const [inserted] = await db()
      .insert(leads)
      .values({
        email: cleanEmail,
        source,
        consentAt: new Date(),
        ipHash: await hashIp(ip),
        userAgent: (req.headers.get('user-agent') ?? '').slice(0, 300),
      })
      .onConflictDoNothing({ target: leads.email })
      .returning({ id: leads.id });

    let leadId: number;
    if (inserted) {
      leadId = inserted.id;
      bump('leads_total');
    } else {
      const [updated] = await db()
        .update(leads)
        .set({ consentAt: new Date(), unsubscribedAt: null })
        .where(eq(leads.email, cleanEmail))
        .returning({ id: leads.id });
      leadId = updated!.id;
    }

    const cookieStore = await cookies();
    cookieStore.set(LIB_COOKIE, signLibToken(leadId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: LIB_MAX_AGE_SEC,
    });

    if (isMailConfigured()) {
      const last = recentEmails().get(cleanEmail);
      if (!last || Date.now() - last > RESEND_WINDOW_MS) {
        recentEmails().set(cleanEmail, Date.now());
        after(() => sendLibraryEmail({ leadId, email: cleanEmail }));
      }
    }

    // Identical response for new and existing emails — no enumeration.
    return Response.json({ ok: true });
  } catch (err) {
    console.error('[lead] unexpected error', err);
    return errorResponse('server_error', 500);
  }
}
