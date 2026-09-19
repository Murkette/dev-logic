'use client';

import { useEffect, useRef, useState } from 'react';
import { ResultCard } from './ResultCard';
import { EmailBar } from './EmailBar';
import type { Risk } from './RiskBadge';
import { EXAMPLE_PHRASES, HERO_LINE } from '@/lib/site';
import { getSessionId, getTranslationCount, incrementTranslationCount } from '@/lib/client/session';

type TranslateResponse = {
  matched: boolean;
  phraseId: number | null;
  translationId: number | null;
  confidence: number;
  meaning: string;
  question: string;
  reply: string;
  risk: Risk;
  category: string | null;
  slug: string | null;
};

type Status = 'idle' | 'loading' | 'result' | 'error';

const MAX_CHARS = 400;
const PLACEHOLDER_INTERVAL_MS = 3500;
const MIN_LOADING_MS = 400;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Translator() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<TranslateResponse | null>(null);
  const [translatedText, setTranslatedText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [txCount, setTxCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasContent = status !== 'idle';
  const stale = status === 'result' && text.trim() !== translatedText;

  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      textareaRef.current?.focus();
    }
    // Picks up a count from earlier in the same tab session (e.g. after a
    // refresh), since the bar's eligibility is defined against the stored
    // count, not just translations made since this component mounted.
    setTxCount(getTranslationCount());
  }, []);

  useEffect(() => {
    if (text.length > 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % EXAMPLE_PHRASES.length);
    }, PLACEHOLDER_INTERVAL_MS);
    return () => clearInterval(id);
  }, [text]);

  async function submit() {
    const trimmed = text.trim();
    if (!trimmed || status === 'loading') return;
    setStatus('loading');
    setErrorMessage(null);

    try {
      const sessionId = getSessionId();
      const [res] = await Promise.all([
        fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmed, sessionId }),
        }),
        sleep(MIN_LOADING_MS),
      ]);

      if (res.status === 429) {
        setStatus('error');
        setErrorMessage('Easy there — try again in a minute.');
        return;
      }
      if (!res.ok) throw new Error(`request failed with ${res.status}`);

      const data = (await res.json()) as TranslateResponse;
      setResult(data);
      setTranslatedText(trimmed);
      setStatus('result');
      if (data.matched) setTxCount(incrementTranslationCount());
    } catch {
      setStatus('error');
      setErrorMessage('Something broke on our end. Try again.');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  function handleTryAnother() {
    setText('');
    setResult(null);
    setStatus('idle');
    setErrorMessage(null);
    textareaRef.current?.focus();
  }

  const counterColor = text.length >= 380 ? 'text-accent' : 'text-muted';

  return (
    <div className={`flex min-h-0 flex-1 flex-col gap-3 ${hasContent ? '' : 'desk:justify-center'}`}>
      <h1
        className={
          hasContent
            ? 'compact:sr-only shrink-0 font-serif text-xl text-ink desk:text-2xl'
            : 'shrink-0 font-serif text-4xl text-ink md:text-5xl'
        }
      >
        {HERO_LINE}
      </h1>

      <div className="shrink-0">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={MAX_CHARS}
            rows={hasContent ? 2 : 6}
            placeholder={EXAMPLE_PHRASES[placeholderIndex]}
            aria-label="Paste the client feedback you want translated"
            className={`w-full resize-none rounded-lg border border-line bg-surface p-3 text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${hasContent ? 'min-h-[56px]' : 'min-h-[160px]'} transition-[min-height] duration-200`}
          />
          <span className={`pointer-events-none absolute right-2 bottom-2 text-xs ${counterColor}`}>
            {text.length}/{MAX_CHARS}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={status === 'loading' || text.trim().length === 0}
        aria-busy={status === 'loading'}
        className="flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-accent font-medium text-on-accent disabled:opacity-60"
      >
        {status === 'loading' && (
          <span
            className="h-3.5 w-3.5 motion-safe:animate-spin rounded-full border-2 border-on-accent border-t-transparent"
            aria-hidden="true"
          />
        )}
        {status === 'loading' ? 'Decoding…' : 'Translate'}
      </button>

      <div aria-live="polite" className="flex min-h-0 flex-1 flex-col">
        {status === 'error' ? (
          <div role="alert" className="rounded-lg border border-line bg-surface p-4 text-sm text-ink">
            {errorMessage}
          </div>
        ) : result ? (
          <ResultCard
            key={result.translationId ?? result.slug ?? 'result'}
            inputText={translatedText}
            meaning={result.meaning}
            question={result.question}
            reply={result.reply}
            risk={result.risk}
            matched={result.matched}
            translationId={result.translationId}
            slug={result.slug}
            stale={stale}
            onTryAnother={handleTryAnother}
          />
        ) : null}
      </div>

      <EmailBar txCount={txCount} />
    </div>
  );
}
