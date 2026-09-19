import { eq, and, isNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { leads } from '@/db/schema';
import { verifyUnsubToken } from '@/lib/tokens';

export const dynamic = 'force-dynamic';

// RFC 8058 one-click unsubscribe target, referenced by the email's
// List-Unsubscribe header — must be a POST and must not require confirmation.
export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get('token');
  const verified = verifyUnsubToken(token);
  if (!verified) return Response.json({ error: 'invalid_input' }, { status: 400 });

  try {
    await db()
      .update(leads)
      .set({ unsubscribedAt: new Date() })
      .where(and(eq(leads.id, verified.leadId), isNull(leads.unsubscribedAt)));
    return Response.json({ ok: true });
  } catch (err) {
    console.error('[unsubscribe] unexpected error', err);
    return Response.json({ error: 'server_error' }, { status: 500 });
  }
}
