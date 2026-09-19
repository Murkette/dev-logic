import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { suggestions } from '@/db/schema';
import { rejectSuggestionAction } from '../../actions';

export const dynamic = 'force-dynamic';

const STATUS_TABS = ['new', 'added', 'rejected', 'all'] as const;

export default async function AdminSuggestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filterStatus = status ?? 'new';

  const rows =
    filterStatus === 'all'
      ? await db().select().from(suggestions).orderBy(desc(suggestions.createdAt))
      : await db().select().from(suggestions).where(eq(suggestions.status, filterStatus)).orderBy(desc(suggestions.createdAt));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-ink">Suggestions</h1>
        <nav className="flex gap-3 text-sm">
          {STATUS_TABS.map((tab) => (
            <Link
              key={tab}
              href={`/admin/suggestions?status=${tab}`}
              className={filterStatus === tab ? 'text-accent' : 'text-muted hover:text-ink'}
            >
              {tab}
            </Link>
          ))}
        </nav>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted">Nothing here.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3 text-sm">
              <div className="min-w-0">
                <p className="text-ink">{row.text}</p>
                <p className="mt-1 text-xs text-muted">
                  {row.email ? `${row.email} · ` : ''}
                  {new Date(row.createdAt).toLocaleDateString()} · {row.status}
                </p>
              </div>
              {row.status === 'new' && (
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/admin/phrases?new=1&trigger=${encodeURIComponent(row.text)}&suggestionId=${row.id}`}
                    className="flex h-8 items-center rounded border border-line bg-bg px-3 text-xs font-medium text-ink hover:bg-line"
                  >
                    Add as phrase
                  </Link>
                  <form action={rejectSuggestionAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="h-8 rounded border border-line bg-bg px-3 text-xs font-medium text-ink hover:bg-line">
                      Reject
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
