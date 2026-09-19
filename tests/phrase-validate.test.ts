import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validatePhrase, type PhraseInput } from '../lib/phrase-validate';

function valid(overrides: Partial<PhraseInput> = {}): PhraseInput {
  return {
    slug: 'make-it-pop',
    triggers: ['make it pop', 'can you make it pop', 'needs to pop more'],
    keywords: ['pop', 'punchy', 'energy'],
    category: 'taste',
    meaning: 'They want more contrast or hierarchy but do not have the words for it. It usually means one thing is not loud enough.',
    question: 'Which element should someone notice first?',
    reply: 'Happy to push the energy. Which element should grab attention first? I will build around that.',
    risk: 'medium',
    ...overrides,
  };
}

test('accepts a well-formed phrase', () => {
  assert.deepEqual(validatePhrase(valid()), []);
});

test('rejects a non-kebab-case slug', () => {
  const errors = validatePhrase(valid({ slug: 'Make_It_Pop' }));
  assert.ok(errors.some((e) => e.includes('slug')));
});

test('rejects too few or too many triggers', () => {
  assert.ok(validatePhrase(valid({ triggers: ['only one'] })).some((e) => e.includes('triggers')));
  assert.ok(
    validatePhrase(valid({ triggers: Array(9).fill('two words') })).some((e) => e.includes('triggers')),
  );
});

test('rejects a single-word trigger', () => {
  const errors = validatePhrase(valid({ triggers: ['pop', 'make it pop', 'needs to pop'] }));
  assert.ok(errors.some((e) => e.includes('trigger')));
});

test('rejects multi-word or uppercase keywords', () => {
  assert.ok(validatePhrase(valid({ keywords: ['two words', 'ok', 'fine'] })).some((e) => e.includes('keyword')));
  assert.ok(validatePhrase(valid({ keywords: ['Pop', 'ok', 'fine'] })).some((e) => e.includes('keyword')));
});

test('rejects a filler word used as a keyword', () => {
  const errors = validatePhrase(valid({ keywords: ['just', 'pop', 'energy'] }));
  assert.ok(errors.some((e) => e.includes('filler')));
});

test('rejects an unknown category or risk', () => {
  assert.ok(validatePhrase(valid({ category: 'vibes' })).some((e) => e.includes('category')));
  assert.ok(validatePhrase(valid({ risk: 'extreme' })).some((e) => e.includes('risk')));
});

test('rejects meaning outside the 2-3 sentence / 260 char window', () => {
  assert.ok(validatePhrase(valid({ meaning: 'Only one sentence here.' })).some((e) => e.includes('meaning')));
  assert.ok(validatePhrase(valid({ meaning: 'A. '.repeat(150) })).some((e) => e.includes('meaning')));
});

test('rejects a question that is not exactly one question', () => {
  assert.ok(validatePhrase(valid({ question: 'This is not a question.' })).some((e) => e.includes('question')));
  assert.ok(
    validatePhrase(valid({ question: 'Is this ok? Or is it not?' })).some((e) => e.includes('question')),
  );
});

test('rejects reply outside the 2-4 sentence / 360 char window', () => {
  assert.ok(validatePhrase(valid({ reply: 'Only one sentence.' })).some((e) => e.includes('reply')));
});

test('rejects a brand name inside meaning, question, or reply', () => {
  const errors = validatePhrase(valid({ meaning: 'They compare this to Wix and think it should cost the same amount here.' }));
  assert.ok(errors.some((e) => e.includes('brand name')));
});
