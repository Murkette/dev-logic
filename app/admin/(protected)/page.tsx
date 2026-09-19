import { sql, eq, and, gte, isNull, isNotNull, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { counters, translations, phrases, feedback } from '@/db/schema';

export const dynamic = 'force-dynamic';

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

async function getCounterStats() {
  const rows = await db().select().from(counters);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    translationsTotal: map.get('translations_total') ?? 0,
    translationsUnmatched: map.get('translations_unmatched') ?? 0,
    leadsTotal: map.get('leads_total') ?? 0,
    feedbackUp: map.get('feedback_up') ?? 0,
    feedbackDown: map.get('feedback_down') ?? 0,
  };
}

async function getTopMatched(since: Date) {
  return db()
    .select({
      phraseId: translations.phraseId,
      trigger: sql<string>`(${phrases.triggers})[1]`,
      category: phrases.category,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(translations)
    .innerJoin(phrases, eq(translations.phraseId, phrases.id))
    .where(and(isNotNull(translations.phraseId), gte(translations.createdAt, since)))
    .groupBy(translations.phraseId, phrases.triggers, phrases.category)
    .orderBy(desc(sql`count(*)`))
    .limit(20);
}

async function getTopUnmatched(since: Date) {
  return db()
    .select({
      normalized: sql<string>`lower(trim(${translations.inputText}))`,
      count: sql<number>`count(*)`.mapWith(Number),
      lastSeen: sql<Date>`max(${translations.createdAt})`,
    })
    .from(translations)
    .where(and(isNull(translations.phraseId), gte(translations.createdAt, since)))
    .groupBy(sql`lower(trim(${translations.inputText}))`)
    .orderBy(desc(sql`count(*)`))
    .limit(20);
}

async function getTopDownvoted(since: Date) {
  return db()
    .select({
      phraseId: translations.phraseId,
      trigger: sql<string>`(${phrases.triggers})[1]`,
      downvotes: sql<number>`count(*)`.mapWith(Number),
    })
    .from(feedback)
    .innerJoin(translations, eq(feedback.translationId, translations.id))
    .innerJoin(phrases, eq(translations.phraseId, phrases.id))
    .where(and(eq(feedback.vote, -1), gte(feedback.createdAt, since)))
    .groupBy(translations.phraseId, phrases.triggers)
    .orderBy(desc(sql`count(*)`))
    .limit(10);
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-medium text-ink">{value}</p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const since = daysAgo(30);
  const [stats, topMatched, topUnmatched, topDownvoted] = await Promise.all([
    getCounterStats(),
    getTopMatched(since),
    getTopUnmatched(since),
    getTopDownvoted(since),
  ]);

  const unmatchedPct =
    stats.translationsTotal > 0 ? (stats.translationsUnmatched / stats.translationsTotal) * 100 : 0;
  const feedbackTotal = stats.feedbackUp + stats.feedbackDown;
  const feedbackRatio = feedbackTotal > 0 ? (stats.feedbackUp / feedbackTotal) * 100 : null;

  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Translations" value={stats.translationsTotal} />
        <StatTile label="Unmatched" value={`${unmatchedPct.toFixed(1)}%`} />
        <StatTile label="Leads" value={stats.leadsTotal} />
        <StatTile label="Feedback (helpful)" value={feedbackRatio === null ? '—' : `${feedbackRatio.toFixed(0)}%`} />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium text-ink">Top matched phrases (30 days)</h2>
        {topMatched.length === 0 ? (
          <p className="text-sm text-muted">No matches yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-1 pr-4 font-medium">Phrase</th>
                <th className="py-1 pr-4 font-medium">Category</th>
                <th className="py-1 font-medium">Count</th>
              </tr>
            </thead>
            <tbody>
              {topMatched.map((row) => (
                <tr key={row.phraseId} className="border-b border-line">
                  <td className="py-1 pr-4 text-ink">{row.trigger}</td>
                  <td className="py-1 pr-4 text-muted">{row.category}</td>
                  <td className="py-1 text-ink">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium text-ink">Top unmatched inputs (30 days)</h2>
        <p className="mb-2 text-sm text-muted">This is how the library grows — add the common ones as real phrases.</p>
        {topUnmatched.length === 0 ? (
          <p className="text-sm text-muted">Nothing unmatched recently.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-1 pr-4 font-medium">Input</th>
                <th className="py-1 pr-4 font-medium">Count</th>
                <th className="py-1 pr-4 font-medium">Last seen</th>
                <th className="py-1"></th>
              </tr>
            </thead>
            <tbody>
              {topUnmatched.map((row) => (
                <tr key={row.normalized} className="border-b border-line">
                  <td className="py-1 pr-4 text-ink">{row.normalized}</td>
                  <td className="py-1 pr-4 text-ink">{row.count}</td>
                  <td className="py-1 pr-4 text-muted">{new Date(row.lastSeen).toLocaleDateString()}</td>
                  <td className="py-1">
                    <a
                      href={`/admin/phrases?new=1&trigger=${encodeURIComponent(row.normalized)}`}
                      className="text-accent hover:underline"
                    >
                      Add as phrase
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium text-ink">Most down-voted phrases (30 days)</h2>
        {topDownvoted.length === 0 ? (
          <p className="text-sm text-muted">No down-votes recently.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-1 pr-4 font-medium">Phrase</th>
                <th className="py-1 font-medium">Down-votes</th>
              </tr>
            </thead>
            <tbody>
              {topDownvoted.map((row) => (
                <tr key={row.phraseId} className="border-b border-line">
                  <td className="py-1 pr-4 text-ink">{row.trigger}</td>
                  <td className="py-1 text-ink">{row.downvotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
