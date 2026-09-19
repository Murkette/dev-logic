import { and, desc, ilike, isNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { leads } from '@/db/schema';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 100;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; all?: string; page?: string }>;
}) {
  const { q, all, page: pageRaw } = await searchParams;
  const includeUnsubscribed = all === '1';
  const page = Math.max(1, Number(pageRaw) || 1);

  const conditions = [
    ...(q ? [ilike(leads.email, `%${q}%`)] : []),
    ...(includeUnsubscribed ? [] : [isNull(leads.unsubscribedAt)]),
  ];

  const rows = await db()
    .select()
    .from(leads)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(leads.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const exportHref = `/admin/leads/export${includeUnsubscribed ? '?all=1' : ''}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-ink">Leads</h1>
        <a href={exportHref} className="flex h-9 items-center rounded border border-line bg-surface px-3 text-sm text-ink hover:bg-line">
          Export CSV
        </a>
      </div>

      <form method="get" className="flex flex-wrap items-center gap-3 text-sm">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search email…"
          className="h-9 rounded border border-line bg-surface px-3 text-ink placeholder:text-muted"
        />
        <label className="flex items-center gap-2 text-muted">
          <input type="checkbox" name="all" value="1" defaultChecked={includeUnsubscribed} className="h-4 w-4 rounded border-line" />
          Include unsubscribed
        </label>
        <button type="submit" className="h-9 rounded border border-line bg-surface px-3 text-ink hover:bg-line">
          Filter
        </button>
      </form>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-muted">
            <th className="py-1 pr-4 font-medium">Email</th>
            <th className="py-1 pr-4 font-medium">Source</th>
            <th className="py-1 pr-4 font-medium">Consented</th>
            <th className="py-1 pr-4 font-medium">Created</th>
            <th className="py-1 font-medium">Unsubscribed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line">
              <td className="py-1 pr-4 text-ink">{row.email}</td>
              <td className="py-1 pr-4 text-muted">{row.source}</td>
              <td className="py-1 pr-4 text-muted">{new Date(row.consentAt).toLocaleDateString()}</td>
              <td className="py-1 pr-4 text-muted">{new Date(row.createdAt).toLocaleDateString()}</td>
              <td className="py-1 text-muted">{row.unsubscribedAt ? new Date(row.unsubscribedAt).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="text-sm text-muted">No leads found.</p>}
    </div>
  );
}
