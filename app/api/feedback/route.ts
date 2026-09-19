import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { translations, feedback } from '@/db/schema';
import { bump } from '@/lib/counters';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/ip';
import { isUuid } from '@/lib/validate';

export const dynamic = 'force-dynamic';

function errorResponse(code: string, status: number, retryAfterSec?: number) {
  const headers: Record<string, string> = {};
  if (retryAfterSec) headers['Retry-After'] = String(retryAfterSec);
  return Response.json({ error: code }, { status, headers });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit('feedback', ip, 60, 60_000);
  if (!limit.ok) return errorResponse('rate_limited', 429, limit.retryAfterSec);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse('invalid_input', 400);
  }

  const { translationId, vote, sessionId } = (body ?? {}) as {
    translationId?: unknown;
    vote?: unknown;
    sessionId?: unknown;
  };

  if (typeof translationId !== 'number' || !Number.isInteger(translationId)) {
    return errorResponse('invalid_input', 400);
  }
  if (vote !== 1 && vote !== -1) return errorResponse('invalid_input', 400);
  if (!isUuid(sessionId)) return errorResponse('invalid_input', 400);

  try {
    const [row] = await db()
      .select({ sessionId: translations.sessionId })
      .from(translations)
      .where(eq(translations.id, translationId))
      .limit(1);

    // No oracle: an unknown translation id or a session mismatch both look
    // identical to the caller.
    if (!row || row.sessionId !== sessionId) {
      return Response.json({ ok: true });
    }

    const [inserted] = await db()
      .insert(feedback)
      .values({ translationId, vote })
      .onConflictDoNothing({ target: feedback.translationId })
      .returning({ id: feedback.id });

    if (inserted) bump(vote === 1 ? 'feedback_up' : 'feedback_down');

    return Response.json({ ok: true });
  } catch (err) {
    console.error('[feedback] unexpected error', err);
    return errorResponse('server_error', 500);
  }
}
