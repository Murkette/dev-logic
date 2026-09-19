import { forwardRef } from 'react';
import { RiskBadge, type Risk } from './RiskBadge';
import { APP_NAME } from '@/lib/site';

const MAX_CHARS = 140;

function clampPhrase(text: string): string {
  if (text.length <= MAX_CHARS) return text;
  return `${text.slice(0, MAX_CHARS - 1).trimEnd()}…`;
}

function phraseSizeClass(len: number): string {
  if (len <= 60) return 'text-6xl';
  if (len <= 100) return 'text-5xl';
  return 'text-4xl';
}

export type ShareCardProps = {
  phraseText: string;
  meaning: string;
  risk: Risk;
  siteHost: string;
};

// Rendered off-screen and captured to a PNG by html-to-image (see ResultCard's
// share handler) — never shown on screen, and always light theme regardless of
// the viewer's colour scheme (`.force-light`, defined in globals.css).
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { phraseText, meaning, risk, siteHost },
  ref,
) {
  const clamped = clampPhrase(phraseText);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="force-light fixed top-0 left-[-10000px] flex h-[675px] w-[1200px] flex-col justify-between bg-bg p-16 text-ink"
    >
      <div className="flex items-start justify-between">
        <span className="text-lg font-medium text-muted">{APP_NAME}</span>
        <RiskBadge risk={risk} />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-10 py-8">
        <p className={`font-serif leading-tight ${phraseSizeClass(clamped.length)}`}>&ldquo;{clamped}&rdquo;</p>
        <div>
          <p className="text-sm font-medium tracking-wide text-muted uppercase">What they probably mean</p>
          <p className="mt-2 max-w-[900px] text-2xl leading-snug">{meaning}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <span className="text-lg text-muted">{siteHost}</span>
      </div>
    </div>
  );
});
