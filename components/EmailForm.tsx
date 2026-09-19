'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { safeSet } from '@/lib/client/storage';

const LEAD_KEY = 'cst_lead';

export type EmailFormProps = {
  source: 'bar' | 'library';
  layout: 'inline' | 'stacked';
  onSuccess: () => void;
};

export function EmailForm({ source, layout, onSuccess }: EmailFormProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, source, website }),
      });
      if (res.status === 429) {
        setErrorMessage('Too many tries — give it an hour.');
        setStatus('error');
        return;
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        setErrorMessage(data.message ?? 'Something went wrong. Try again.');
        setStatus('error');
        return;
      }
      // Set regardless of which surface (bar or library wall) submitted —
      // any successful lead capture suppresses the bar going forward.
      safeSet('local', LEAD_KEY, '1');
      onSuccess();
    } catch {
      setErrorMessage('Something went wrong. Try again.');
      setStatus('error');
    }
  }

  const isInline = layout === 'inline';

  return (
    <form onSubmit={submit} className={isInline ? 'flex flex-wrap items-center gap-2' : 'flex flex-col gap-3'}>
      <label htmlFor={`email-${source}`} className="sr-only">
        Email
      </label>
      <input
        id={`email-${source}`}
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@studio.com"
        className="h-9 min-w-0 flex-1 rounded border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted"
      />

      <label className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="h-4 w-4 rounded border-line"
        />
        I agree to the{' '}
        <Link href="/terms" className="underline hover:text-ink">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline hover:text-ink">
          Privacy Policy
        </Link>
      </label>

      <span className="sr-only">
        <label htmlFor={`website-${source}`}>Leave this field empty</label>
        <input
          id={`website-${source}`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </span>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="h-9 shrink-0 rounded bg-accent px-4 text-sm font-medium text-on-accent disabled:opacity-60"
      >
        Send it
      </button>

      {/* The bar has a hard 48px height budget (build spec §6.1), so the
          disclosure line only renders in the stacked (library wall) layout. */}
      {!isInline && (
        <p className="text-xs text-muted">One email with the link. Occasional product updates. Unsubscribe anytime.</p>
      )}
      {status === 'error' && errorMessage && (
        <p className={`text-xs text-risk-high-text ${isInline ? 'w-full' : ''}`}>{errorMessage}</p>
      )}
    </form>
  );
}
