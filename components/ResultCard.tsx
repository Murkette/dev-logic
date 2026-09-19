'use client';

import { useRef, useState } from 'react';
import { RiskBadge, type Risk } from './RiskBadge';
import { ShareCard } from './ShareCard';
import { SuggestForm } from './SuggestForm';
import { getSessionId } from '@/lib/client/session';

export type ResultCardProps = {
  inputText: string;
  meaning: string;
  question: string;
  reply: string;
  risk: Risk;
  matched: boolean;
  translationId: number | null;
  slug: string | null;
  stale: boolean;
  onTryAnother: () => void;
};

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function ResultCard({
  inputText,
  meaning,
  question,
  reply,
  risk,
  matched,
  translationId,
  slug,
  stale,
  onTryAnother,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<0 | 1 | -1>(0);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestSent, setSuggestSent] = useState(false);
  const [shareLabel, setShareLabel] = useState('Share as image');
  const [sharing, setSharing] = useState(false);
  const shareNodeRef = useRef<HTMLDivElement>(null);

  async function handleCopy() {
    const ok = await copyText(reply);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  async function handleVote(v: 1 | -1) {
    if (vote !== 0 || translationId === null) return;
    setVote(v);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translationId, vote: v, sessionId: getSessionId() }),
      });
    } catch {
      // optimistic UI — the vote already shows as recorded either way
    }
  }

  async function handleShare() {
    if (sharing || !shareNodeRef.current) return;
    setSharing(true);
    setShareLabel('Rendering…');
    try {
      const { toBlob } = await import('html-to-image');
      await document.fonts.ready;
      const opts = { width: 1200, height: 675, pixelRatio: 1, cacheBust: true };
      let blob = await toBlob(shareNodeRef.current, opts);
      if (isSafari()) blob = await toBlob(shareNodeRef.current, opts);
      if (!blob) throw new Error('render produced no image');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `client-speak-${slug ?? 'unknown'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setShareLabel('Saved + copied');
      } catch {
        setShareLabel('Saved');
      }
      setTimeout(() => setShareLabel('Share as image'), 2000);
    } catch {
      setShareLabel('Share as image');
    } finally {
      setSharing(false);
    }
  }

  const siteHost = typeof window !== 'undefined' ? window.location.host : 'clientspeak.example';

  return (
    <div
      className={`animate-slide-in flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-lg border border-line bg-surface p-4 motion-safe:transition-opacity motion-safe:duration-150 ${stale ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">What they probably mean</p>
        <RiskBadge risk={risk} />
      </div>
      <p className="text-[15px] leading-[22px] text-ink">{meaning}</p>

      <div>
        <p className="text-sm font-medium text-muted">Ask them this</p>
        <blockquote className="mt-1 border-l-2 border-accent pl-3 text-[15px] leading-[22px] text-ink">
          {question}
        </blockquote>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-muted">Copy-paste reply</p>
        <div className="relative rounded-md border border-line bg-bg p-3 pr-20">
          <p className="text-[14px] leading-[20px] text-ink">{reply}</p>
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-2 right-2 h-7 rounded border border-line bg-surface px-2 text-xs font-medium text-ink hover:bg-line"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Reply copied to clipboard' : ''}
          </span>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-1 text-sm text-muted">
        {matched
          ? translationId !== null &&
            (vote === 0 ? (
              <>
                <button type="button" aria-label="This was helpful" onClick={() => handleVote(1)} className="hover:text-ink">
                  👍
                </button>
                <button type="button" aria-label="This missed the mark" onClick={() => handleVote(-1)} className="hover:text-ink">
                  👎
                </button>
              </>
            ) : (
              <span>Thanks</span>
            ))
          : suggestSent
            ? <span>Got it — thanks.</span>
            : suggestOpen
              ? <SuggestForm text={inputText} onSuccess={() => setSuggestSent(true)} />
              : (
                <button type="button" onClick={() => setSuggestOpen(true)} className="hover:text-ink">
                  Want us to add this phrase?
                </button>
              )}

        {(matched || !suggestOpen || suggestSent) && (
          <>
            <button type="button" onClick={handleShare} disabled={sharing} className="hover:text-ink disabled:opacity-60">
              {shareLabel}
            </button>
            <button type="button" onClick={onTryAnother} className="hover:text-ink">
              Try another
            </button>
          </>
        )}
      </div>

      <ShareCard ref={shareNodeRef} phraseText={inputText} meaning={meaning} risk={risk} siteHost={siteHost} />
    </div>
  );
}
