import { db } from '@/lib/db';
import { suggestions } from '@/db/schema';
import { bump } from '@/lib/counters';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/ip';
import { isEmail, cleanText } from '@/lib/validate';

export const dynamic = 'force-dynamic';

function errorResponse(code: string, status: number, retryAfterSec?: number) {
  const headers: Record<string, string> = {};
  if (retryAfterSec) headers['Retry-After'] = String(retryAfterSec);
  return Response.json({ error: code }, { status, headers });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit('suggest', ip, 5, 60 * 60_000);
  if (!limit.ok) return errorResponse('rate_limited', 429, limit.retryAfterSec);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse('invalid_input', 400);
  }

  const { text, email, website } = (body ?? {}) as { text?: unknown; email?: unknown; website?: unknown };

  // Honeypot: a bot that fills every field gets a fake success with no side effects.
  if (typeof website === 'string' && website.length > 0) {
    return Response.json({ ok: true });
  }

  const trimmedText = cleanText(text, 400);
  if (!trimmedText) return errorResponse('invalid_input', 400);

  let cleanEmail: string | null = null;
  if (email !== undefined && email !== null && email !== '') {
    const candidate = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!isEmail(candidate)) return errorResponse('invalid_input', 400);
    cleanEmail = candidate;
  }

  try {
    await db().insert(suggestions).values({ text: trimmedText, email: cleanEmail, status: 'new' });
    bump('suggestions_total');
    return Response.json({ ok: true });
  } catch (err) {
    console.error('[suggest] unexpected error', err);
    return errorResponse('server_error', 500);
  }
}
