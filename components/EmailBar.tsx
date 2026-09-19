'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EmailForm } from './EmailForm';
import { safeGet, safeSet } from '@/lib/client/storage';
import { LIBRARY_COUNT_LABEL } from '@/lib/site';

const DISMISSED_KEY = 'cst_bar_dismissed_at';
const LEAD_KEY = 'cst_lead'; // set by EmailForm on any successful submit
const DISMISS_WINDOW_MS = 30 * 24 * 60 * 60_000;

export function EmailBar({ txCount }: { txCount: number }) {
  const [visible, setVisible] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (txCount < 2) return;
    if (safeGet('local', LEAD_KEY) === '1') return;
    const dismissedAt = Number(safeGet('local', DISMISSED_KEY));
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_WINDOW_MS) return;
    setVisible(true);
  }, [txCount]);

  function handleDismiss() {
    safeSet('local', DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  }

  function handleSuccess() {
    setSent(true);
  }

  if (!visible) return null;

  return (
    <div className="flex min-h-12 shrink-0 flex-wrap items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2 text-sm">
      {sent ? (
        <p className="text-ink">
          Sent. The library is unlocked —{' '}
          <Link href="/library" className="underline hover:text-accent">
            open it &rarr;
          </Link>
        </p>
      ) : (
        <>
          <p className="shrink-0 text-ink">Want the full library of {LIBRARY_COUNT_LABEL} decoded phrases?</p>
          <div className="min-w-0 flex-1">
            <EmailForm source="bar" layout="inline" onSuccess={handleSuccess} />
          </div>
          <button type="button" onClick={handleDismiss} aria-label="Dismiss" className="shrink-0 text-muted hover:text-ink">
            &times;
          </button>
        </>
      )}
    </div>
  );
}
