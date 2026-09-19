'use client';

import { useState, type FormEvent } from 'react';

export function SuggestForm({ text, onSuccess }: { text: string; onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, email: email.trim() || undefined, website }),
      });
      if (!res.ok) throw new Error('request failed');
      onSuccess();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2 text-sm">
      <label htmlFor="suggest-email" className="sr-only">
        Email (optional)
      </label>
      <input
        id="suggest-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (optional)"
        className="h-8 min-w-0 flex-1 rounded border border-line bg-surface px-2 text-ink placeholder:text-muted"
      />
      <span className="sr-only">
        <label htmlFor="suggest-website">Leave this field empty</label>
        <input
          id="suggest-website"
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
        className="h-8 shrink-0 rounded bg-accent px-3 font-medium text-on-accent disabled:opacity-60"
      >
        Send
      </button>
      {status === 'error' && (
        <span className="text-xs text-risk-high-text">Couldn&rsquo;t send — try again.</span>
      )}
    </form>
  );
}
