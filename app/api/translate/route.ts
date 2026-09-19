import { getEngine } from '@/lib/engine/cache';
import { FALLBACK } from '@/lib/engine/fallback';
import { db } from '@/lib/db';
import { translations } from '@/db/schema';
import { bump } from '@/lib/counters';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/ip';
import { isUuid, cleanText } from '@/lib/validate';

export const dynamic = 'force-dynamic';

function errorResponse(code: string, status: number, retryAfterSec?: number) {
  const headers: Record<string, string> = {};
  if (retryAfterSec) headers['Retry-After'] = String(retryAfterSec);
  return Response.json({ error: code }, { status, headers });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit('translate', ip, 30, 60_000);
  if (!limit.ok) return errorResponse('rate_limited', 429, limit.retryAfterSec);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse('invalid_input', 400);
  }

  const { text, sessionId } = (body ?? {}) as { text?: unknown; sessionId?: unknown };
  const trimmed = cleanText(text, 400);
  if (!trimmed) return errorResponse('invalid_input', 400);
  if (!isUuid(sessionId)) return errorResponse('invalid_input', 400);

  try {
    const engine = await getEngine();
    const result = engine.match(trimmed);

    let translationId: number | null = null;
    try {
      const [row] = await db()
        .insert(translations)
        .values({
          sessionId,
          inputText: trimmed,
          phraseId: result.phrase?.id ?? null,
          confidence: result.confidence,
        })
        .returning({ id: translations.id });
      translationId = row?.id ?? null;
    } catch (err) {
      console.error('[translate] failed to log translation', err);
    }

    bump('translations_total');
    if (!result.phrase) bump('translations_unmatched');

    if (result.phrase) {
      return Response.json({
        matched: true,
        phraseId: result.phrase.id,
        translationId,
        confidence: result.confidence,
        meaning: result.phrase.meaning,
        question: result.phrase.question,
        reply: result.phrase.reply,
        risk: result.phrase.risk,
        category: result.phrase.category,
        slug: result.phrase.slug,
      });
    }

    return Response.json({
      matched: false,
      phraseId: null,
      translationId,
      confidence: result.confidence,
      meaning: FALLBACK.meaning,
      question: FALLBACK.question,
      reply: FALLBACK.reply,
      risk: FALLBACK.risk,
      category: null,
      slug: null,
    });
  } catch (err) {
    console.error('[translate] unexpected error', err);
    return errorResponse('server_error', 500);
  }
}
