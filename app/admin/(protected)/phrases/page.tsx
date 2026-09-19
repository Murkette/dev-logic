import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { phrases } from '@/db/schema';
import { CATEGORIES, RISKS } from '@/lib/phrase-validate';
import { savePhraseAction, toggleActiveAction } from '../../actions';

export const dynamic = 'force-dynamic';

const FLASH_COOKIE = 'cst_admin_flash';

type FlashData = {
  id: number | null;
  slug: string;
  triggersRaw: string;
  keywordsRaw: string;
  category: string;
  risk: string;
  meaning: string;
  question: string;
  reply: string;
  active: boolean;
  errors: string[];
};

type FormDefaults = {
  id: number | null;
  slug: string;
  triggersRaw: string;
  keywordsRaw: string;
  category: string;
  risk: string;
  meaning: string;
  question: string;
  reply: string;
  active: boolean;
  suggestionId: number | null;
};

function PhraseFields({ defaults, errors }: { defaults: FormDefaults; errors: string[] }) {
  return (
    <>
      {errors.length > 0 && (
        <ul className="rounded-md border border-risk-high-bg bg-risk-high-bg p-3 text-sm text-risk-high-text">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      <input type="hidden" name="id" value={defaults.id ?? ''} />
      {defaults.suggestionId !== null && <input type="hidden" name="suggestionId" value={defaults.suggestionId} />}
      {defaults.id !== null && <input type="hidden" name="slug" value={defaults.slug} />}
      {defaults.id !== null && (
        <p className="text-xs text-muted">
          slug: <span className="font-mono">{defaults.slug}</span>
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Triggers (one per line, 3–8)</span>
        <textarea
          name="triggers"
          defaultValue={defaults.triggersRaw}
          rows={4}
          required
          className="rounded border border-line bg-bg p-2 text-ink"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Keywords (comma-separated, 3–10)</span>
        <input
          name="keywords"
          defaultValue={defaults.keywordsRaw}
          required
          className="rounded border border-line bg-bg p-2 text-ink"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="text-muted">Category</span>
          <select name="category" defaultValue={defaults.category} required className="rounded border border-line bg-bg p-2 text-ink">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="text-muted">Risk</span>
          <select name="risk" defaultValue={defaults.risk} required className="rounded border border-line bg-bg p-2 text-ink">
            {RISKS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Meaning (2–3 sentences, ≤260 chars)</span>
        <textarea
          name="meaning"
          defaultValue={defaults.meaning}
          rows={2}
          maxLength={260}
          required
          className="rounded border border-line bg-bg p-2 text-ink"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Question (≤160 chars)</span>
        <input
          name="question"
          defaultValue={defaults.question}
          maxLength={160}
          required
          className="rounded border border-line bg-bg p-2 text-ink"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Reply (2–4 sentences, ≤360 chars)</span>
        <textarea
          name="reply"
          defaultValue={defaults.reply}
          rows={3}
          maxLength={360}
          required
          className="rounded border border-line bg-bg p-2 text-ink"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" name="active" defaultChecked={defaults.active} className="h-4 w-4 rounded border-line" />
        Active
      </label>

      <button type="submit" className="h-9 self-start rounded bg-accent px-4 text-sm font-medium text-on-accent">
        Save
      </button>
    </>
  );
}

const EMPTY_DEFAULTS: FormDefaults = {
  id: null,
  slug: '',
  triggersRaw: '',
  keywordsRaw: '',
  category: CATEGORIES[0],
  risk: RISKS[0],
  meaning: '',
  question: '',
  reply: '',
  active: true,
  suggestionId: null,
};

export default async function AdminPhrasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; active?: string; trigger?: string; suggestionId?: string }>;
}) {
  const { q, category, active, trigger, suggestionId } = await searchParams;

  const cookieStore = await cookies();
  const flashRaw = cookieStore.get(FLASH_COOKIE)?.value;
  const flash: FlashData | null = flashRaw ? (JSON.parse(flashRaw) as FlashData) : null;

  const addDefaults: FormDefaults =
    flash && flash.id === null
      ? { ...flash, suggestionId: suggestionId ? Number(suggestionId) : null }
      : {
          ...EMPTY_DEFAULTS,
          triggersRaw: trigger ?? '',
          suggestionId: suggestionId ? Number(suggestionId) : null,
        };
  const addErrors = flash && flash.id === null ? flash.errors : [];

  const allRows = await db().select().from(phrases).orderBy(phrases.id);

  const filtered = allRows.filter((row) => {
    if (category && row.category !== category) return false;
    if (active === '1' && !row.active) return false;
    if (active === '0' && row.active) return false;
    if (q) {
      const needle = q.toLowerCase();
      const haystack = `${row.slug} ${row.triggers.join(' ')}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="mb-3 text-lg font-medium text-ink">Add phrase</h1>
        <form action={savePhraseAction} className="flex max-w-xl flex-col gap-3 rounded-lg border border-line bg-surface p-4">
          <PhraseFields defaults={addDefaults} errors={addErrors} />
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium text-ink">Phrases ({filtered.length})</h2>

        <form method="get" className="mb-4 flex flex-wrap gap-2 text-sm">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ''}
            placeholder="Search triggers or slug…"
            className="h-9 rounded border border-line bg-surface px-3 text-ink placeholder:text-muted"
          />
          <select name="category" defaultValue={category ?? ''} className="h-9 rounded border border-line bg-surface px-2 text-ink">
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select name="active" defaultValue={active ?? ''} className="h-9 rounded border border-line bg-surface px-2 text-ink">
            <option value="">Active + inactive</option>
            <option value="1">Active only</option>
            <option value="0">Inactive only</option>
          </select>
          <button type="submit" className="h-9 rounded border border-line bg-surface px-3 text-ink hover:bg-line">
            Filter
          </button>
        </form>

        <div className="flex flex-col gap-2">
          {filtered.map((row) => {
            const rowFlash = flash && flash.id === row.id ? flash : null;
            const defaults: FormDefaults = rowFlash
              ? { ...rowFlash, suggestionId: null }
              : {
                  id: row.id,
                  slug: row.slug,
                  triggersRaw: row.triggers.join('\n'),
                  keywordsRaw: row.keywords.join(', '),
                  category: row.category,
                  risk: row.risk,
                  meaning: row.meaning,
                  question: row.question,
                  reply: row.reply,
                  active: row.active,
                  suggestionId: null,
                };

            return (
              <details key={row.id} open={Boolean(rowFlash)} className="rounded-lg border border-line bg-surface p-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span className="text-sm text-ink">{row.triggers[0]}</span>
                  <span className="flex items-center gap-3 text-xs text-muted">
                    <span>{row.category}</span>
                    <span>{row.risk}</span>
                    <span className={row.active ? 'text-risk-low-text' : 'text-risk-high-text'}>
                      {row.active ? 'active' : 'inactive'}
                    </span>
                  </span>
                </summary>
                <div className="mt-3 flex flex-col gap-3">
                  <form action={toggleActiveAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="h-8 rounded border border-line bg-bg px-3 text-xs font-medium text-ink hover:bg-line">
                      {row.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </form>
                  <form action={savePhraseAction} className="flex flex-col gap-3">
                    <PhraseFields defaults={defaults} errors={rowFlash?.errors ?? []} />
                  </form>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}
