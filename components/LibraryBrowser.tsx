'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EmailForm } from './EmailForm';
import { RiskBadge, type Risk } from './RiskBadge';
import { CATEGORIES } from '@/lib/phrase-validate';

export type LibraryEntry =
  | {
      locked: false;
      slug: string;
      triggers: string[];
      keywords: string[];
      category: string;
      meaning: string;
      question: string;
      reply: string;
      risk: Risk;
    }
  | { locked: true; slug: string; title: string; category: string; risk: Risk };

const CATEGORY_LABELS: Record<string, string> = {
  taste: 'Taste',
  trust: 'Trust',
  scope: 'Scope',
  money: 'Money',
  timeline: 'Timeline',
  committee: 'Committee',
  tech: 'Tech',
  'launch-fear': 'Launch fear',
};

function matchesQuery(entry: LibraryEntry, q: string): boolean {
  if (!q) return true;
  if (entry.locked) return entry.title.toLowerCase().includes(q);
  const haystack = `${entry.triggers.join(' ')} ${entry.keywords.join(' ')} ${entry.meaning}`.toLowerCase();
  return haystack.includes(q);
}

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // best-effort — the text is also visible to select manually
  }
}

function LockedRow({ entry }: { entry: Extract<LibraryEntry, { locked: true }> }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink">{entry.title}</p>
        <RiskBadge risk={entry.risk} />
      </div>
      <p aria-hidden="true" className="mt-2 text-sm text-ink blur-sm select-none">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
      </p>
    </div>
  );
}

function UnlockedEntry({ entry }: { entry: Extract<LibraryEntry, { locked: false }> }) {
  const [copied, setCopied] = useState(false);
  const others = entry.triggers.slice(1);

  async function handleCopy() {
    await copyText(entry.reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <details id={entry.slug} className="rounded-lg border border-line bg-surface p-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-sm font-medium text-ink">{entry.triggers[0]}</span>
        <RiskBadge risk={entry.risk} />
      </summary>
      <div className="mt-3 flex flex-col gap-3 text-sm">
        {others.length > 0 && <p className="text-muted">Also sounds like: {others.join(' · ')}</p>}
        <div>
          <p className="font-medium text-muted">What they probably mean</p>
          <p className="mt-1 text-ink">{entry.meaning}</p>
        </div>
        <div>
          <p className="font-medium text-muted">Ask them this</p>
          <blockquote className="mt-1 border-l-2 border-accent pl-3 text-ink">{entry.question}</blockquote>
        </div>
        <div>
          <p className="mb-1 font-medium text-muted">Copy-paste reply</p>
          <div className="relative rounded-md border border-line bg-bg p-3 pr-20">
            <p className="text-ink">{entry.reply}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-2 right-2 h-7 rounded border border-line bg-surface px-2 text-xs font-medium text-ink hover:bg-line"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </details>
  );
}

export function LibraryBrowser({ entries, unlocked }: { entries: LibraryEntry[]; unlocked: boolean }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => entries.filter((e) => matchesQuery(e, q)), [entries, q]);

  // Locked visitors see their 10 full entries pulled out as a "Free sample"
  // above the category sections, not repeated inside them.
  const freeSample = unlocked ? [] : filtered.filter((e): e is Extract<LibraryEntry, { locked: false }> => !e.locked);
  const categorySource = unlocked ? filtered : filtered.filter((e) => e.locked);

  const grouped = CATEGORIES.map((category) => ({
    category,
    items: categorySource.filter((e) => e.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="mx-auto w-full max-w-[760px] flex-1 px-4 py-8">
      <h1 className="font-serif text-2xl text-ink">The Client-Speak Library</h1>
      <p className="mt-1 text-muted">Every phrase we&rsquo;ve decoded so far, grouped by what&rsquo;s really going on.</p>

      <label htmlFor="library-search" className="sr-only">
        Search the library
      </label>
      <input
        id="library-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search phrases…"
        className="mt-4 w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink placeholder:text-muted"
      />

      <div className="mt-6 flex flex-col gap-6">
        {!unlocked && (
          <div className="sticky top-0 z-10 rounded-lg border border-line bg-surface p-4 shadow-sm">
            <p className="mb-2 text-sm font-medium text-ink">Unlock the rest of the library</p>
            <EmailForm source="library" layout="stacked" onSuccess={() => router.refresh()} />
          </div>
        )}

        {freeSample.length > 0 && (
          <section>
            <h2 className="mb-2 text-lg font-medium text-ink">Free sample</h2>
            <div className="flex flex-col gap-2">
              {freeSample.map((entry) => (
                <UnlockedEntry key={entry.slug} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {grouped.map((g) => (
          <section key={g.category}>
            <h2 className="mb-2 text-lg font-medium text-ink">
              {CATEGORY_LABELS[g.category]}
              {unlocked && <span className="ml-2 text-sm font-normal text-muted">({g.items.length})</span>}
            </h2>
            <div className="flex flex-col gap-2">
              {g.items.map((entry) =>
                entry.locked ? <LockedRow key={entry.slug} entry={entry} /> : <UnlockedEntry key={entry.slug} entry={entry} />,
              )}
            </div>
          </section>
        ))}

        {filtered.length === 0 && (
          <p className="text-muted">
            Nothing matches that —{' '}
            <Link href="/" className="underline hover:text-ink">
              try the translator instead →
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
