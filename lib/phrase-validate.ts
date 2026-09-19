import { normalise, FILLERS } from './engine/normalise';

export const CATEGORIES = [
  'taste', 'trust', 'scope', 'money', 'timeline', 'committee', 'tech', 'launch-fear',
] as const;
export const RISKS = ['low', 'medium', 'high'] as const;

export type Category = (typeof CATEGORIES)[number];
export type Risk = (typeof RISKS)[number];

export type PhraseInput = {
  slug: string;
  triggers: string[];
  keywords: string[];
  category: string;
  meaning: string;
  question: string;
  reply: string;
  risk: string;
};

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FILLER_WORDS = new Set(FILLERS.flatMap((f) => f.split(' ')));
// Real product names belong in triggers/keywords (clients say them) but never in
// the written content, which stays generic (D14 in docs/build-spec.md).
const BRAND_NAMES = ['wix', 'squarespace', 'wordpress', 'shopify', 'webflow', 'godaddy', 'weebly'];

function countSentences(text: string): number {
  return text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length;
}

export function validatePhrase(p: PhraseInput): string[] {
  const errors: string[] = [];

  if (!SLUG_RE.test(p.slug) || p.slug.length > 60) {
    errors.push(`slug "${p.slug}" must be kebab-case and ≤60 chars`);
  }

  if (p.triggers.length < 3 || p.triggers.length > 8) {
    errors.push(`triggers must have 3–8 items (has ${p.triggers.length})`);
  }
  for (const t of p.triggers) {
    if (normalise(t).split(' ').filter(Boolean).length < 2) {
      errors.push(`trigger "${t}" must be at least 2 words after normalisation`);
    }
  }

  if (p.keywords.length < 3 || p.keywords.length > 10) {
    errors.push(`keywords must have 3–10 items (has ${p.keywords.length})`);
  }
  for (const k of p.keywords) {
    const trimmed = k.trim();
    if (/\s/.test(trimmed) || trimmed !== trimmed.toLowerCase() || trimmed.length === 0) {
      errors.push(`keyword "${k}" must be a single lowercase word`);
    }
    if (FILLER_WORDS.has(trimmed.toLowerCase())) {
      errors.push(`keyword "${k}" is a filler word and will never match (both sides are normalised)`);
    }
  }

  if (!CATEGORIES.includes(p.category as Category)) {
    errors.push(`category "${p.category}" must be one of ${CATEGORIES.join(', ')}`);
  }
  if (!RISKS.includes(p.risk as Risk)) {
    errors.push(`risk "${p.risk}" must be one of ${RISKS.join(', ')}`);
  }

  const meaningSentences = countSentences(p.meaning);
  if (meaningSentences < 2 || meaningSentences > 3) {
    errors.push(`meaning must be 2–3 sentences (has ${meaningSentences})`);
  }
  if (p.meaning.length > 260) errors.push(`meaning must be ≤260 chars (has ${p.meaning.length})`);

  const questionMarks = (p.question.match(/\?/g) ?? []).length;
  if (questionMarks !== 1 || !p.question.trim().endsWith('?')) {
    errors.push('question must be exactly one question');
  }
  if (p.question.length > 160) errors.push(`question must be ≤160 chars (has ${p.question.length})`);

  const replySentences = countSentences(p.reply);
  if (replySentences < 2 || replySentences > 4) {
    errors.push(`reply must be 2–4 sentences (has ${replySentences})`);
  }
  if (p.reply.length > 360) errors.push(`reply must be ≤360 chars (has ${p.reply.length})`);

  const contentText = `${p.meaning} ${p.question} ${p.reply}`.toLowerCase();
  for (const brand of BRAND_NAMES) {
    if (new RegExp(`\\b${brand}\\b`).test(contentText)) {
      errors.push(`brand name "${brand}" must not appear in meaning/question/reply`);
    }
  }

  return errors;
}
