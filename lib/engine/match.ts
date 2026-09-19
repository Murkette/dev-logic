import Fuse from 'fuse.js';
import { normalise } from './normalise';

export type EnginePhrase = {
  id: number;
  slug: string;
  triggers: string[];
  keywords: string[];
  category: string;
  meaning: string;
  question: string;
  reply: string;
  risk: string;
};

export type MatchResult = {
  phrase: EnginePhrase | null;
  confidence: number;
  stage: 'exact' | 'fuse' | 'keywords' | 'none';
};

export type Engine = { match(text: string): MatchResult };

// Tuned empirically (see tests/match.test.ts): searching many short sliding
// windows of a long input and keeping the single best score across all of them
// amplifies noise — with enough independent trials, some short window scores
// deceptively well against an unrelated short trigger purely by chance. A single
// whole-string query against triggers only stays well separated from noise;
// paraphrases that reword a trigger past what fuzzy edit-distance can bridge are
// instead caught by the deterministic keyword-vote stage, which now runs first.
export const FUSE_THRESHOLD = 0.3;
const MAX_WORDS = 40;
const KEYWORD_MIN_HITS = 2;

type Doc = { id: number; triggersNorm: string[]; keywordsNorm: string[]; categoryNorm: string };

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function stripTrailingS(word: string): string {
  return word.endsWith('s') && word.length > 3 ? word.slice(0, -1) : word;
}

export function createEngine(phrases: EnginePhrase[]): Engine {
  const byId = new Map(phrases.map((p) => [p.id, p]));
  const docs: Doc[] = phrases.map((p) => ({
    id: p.id,
    triggersNorm: p.triggers.map(normalise),
    keywordsNorm: p.keywords.map(normalise),
    categoryNorm: normalise(p.category),
  }));

  // threshold: 1 disables Fuse's own cutoff so a best-effort score is always
  // available for diagnostics (the admin's "closest miss" view); FUSE_THRESHOLD
  // is applied manually below. Only triggers are indexed — keywords/category
  // are short enough that fuzzy-matching them directly produces noise (see
  // tests/match.test.ts); keyword overlap is instead handled deterministically
  // by the keyword-vote stage below.
  const fuse = new Fuse(docs, {
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 3,
    threshold: 1,
    keys: [{ name: 'triggersNorm', weight: 1.0 }],
  });

  function matchExact(n: string): Doc | null {
    const padded = ` ${n} `;
    let best: { doc: Doc; triggerLen: number } | null = null;
    for (const doc of docs) {
      for (const trigger of doc.triggersNorm) {
        if (trigger.length < 2 || !padded.includes(` ${trigger} `)) continue;
        if (
          !best ||
          trigger.length > best.triggerLen ||
          (trigger.length === best.triggerLen && doc.id < best.doc.id)
        ) {
          best = { doc, triggerLen: trigger.length };
        }
      }
    }
    return best?.doc ?? null;
  }

  function matchFuse(n: string): { doc: Doc; score: number } | null {
    // A single word is never queried: one fuzzy keyword hit ("logo") would
    // otherwise hijack any input that happens to contain it.
    const wordCount = n.split(' ').filter(Boolean).length;
    if (docs.length === 0 || wordCount <= 1) return null;

    const query = n.split(' ').filter(Boolean).slice(0, MAX_WORDS).join(' ');
    const [hit] = fuse.search(query, { limit: 1 });
    return hit?.score !== undefined ? { doc: hit.item, score: hit.score } : null;
  }

  function matchKeywords(n: string): Doc | null {
    const tokens = new Set(n.split(' ').filter(Boolean).map(stripTrailingS));
    let best: { doc: Doc; hits: number } | null = null;
    let tie = false;
    for (const doc of docs) {
      const hits = doc.keywordsNorm.filter((k) => tokens.has(stripTrailingS(k))).length;
      if (hits < KEYWORD_MIN_HITS) continue;
      if (!best || hits > best.hits) {
        best = { doc, hits };
        tie = false;
      } else if (hits === best.hits) {
        tie = true;
      }
    }
    return best && !tie ? best.doc : null;
  }

  return {
    match(text: string): MatchResult {
      const n = normalise(text);
      if (n.length < 2) return { phrase: null, confidence: 0, stage: 'none' };

      const exact = matchExact(n);
      if (exact) return { phrase: byId.get(exact.id)!, confidence: 1, stage: 'exact' };

      // Keyword-vote is deterministic and runs before the fuzzy fallback: it
      // reliably catches paraphrases that share vocabulary with a phrase, which
      // is more common (and safer) than a rewording that's merely a close edit
      // of the trigger text itself.
      const kw = matchKeywords(n);
      if (kw) return { phrase: byId.get(kw.id)!, confidence: 0.5, stage: 'keywords' };

      const fuseHit = matchFuse(n);
      if (fuseHit && fuseHit.score <= FUSE_THRESHOLD) {
        return { phrase: byId.get(fuseHit.doc.id)!, confidence: round2(1 - fuseHit.score), stage: 'fuse' };
      }

      return { phrase: null, confidence: fuseHit ? round2(1 - fuseHit.score) : 0, stage: 'none' };
    },
  };
}
