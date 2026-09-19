import { isNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { leads } from '@/db/schema';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// Route handlers bypass the (protected) layout entirely, so this needs its
// own auth check even though it lives under the same URL prefix.
function csvField(value: string): string {
  const guarded = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  await requireAdmin();

  const includeUnsubscribed = new URL(req.url).searchParams.get('all') === '1';

  const rows = await db()
    .select({ email: leads.email, source: leads.source, consentAt: leads.consentAt, createdAt: leads.createdAt })
    .from(leads)
    .where(includeUnsubscribed ? undefined : isNull(leads.unsubscribedAt));

  const lines = [
    ['email', 'source', 'consent_at', 'created_at'].map(csvField).join(','),
    ...rows.map((r) => [r.email, r.source, r.consentAt.toISOString(), r.createdAt.toISOString()].map(csvField).join(',')),
  ];

  const csv = lines.join('\r\n');
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${date}.csv"`,
    },
  });
}
