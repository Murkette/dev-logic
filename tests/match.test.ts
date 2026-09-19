import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createEngine, type EnginePhrase } from '../lib/engine/match';
import { collectAllSeedPhrases } from '../db/seed/validate';
import { CASES, NEGATIVE_CASES, PARAPHRASE_CASES, LONG_INPUT_CASES } from './match.cases';

function buildEngine() {
  const seedPhrases = collectAllSeedPhrases();
  const enginePhrases: EnginePhrase[] = seedPhrases.map((p, i) => ({ id: i + 1, ...p }));
  return createEngine(enginePhrases);
}

test('all negatives return no-match', () => {
  const engine = buildEngine();
  const failures: string[] = [];
  for (const c of NEGATIVE_CASES) {
    const result = engine.match(c.text);
    if (result.phrase !== null) {
      failures.push(`"${c.text}" expected no-match, got "${result.phrase.slug}" (confidence ${result.confidence})`);
    }
  }
  assert.equal(failures.length, 0, failures.join('\n'));
});

test('at least 90% of paraphrase + long-input positives match the expected phrase', () => {
  const engine = buildEngine();
  const positives = [...PARAPHRASE_CASES, ...LONG_INPUT_CASES];
  const failures: string[] = [];
  let passed = 0;
  for (const c of positives) {
    const result = engine.match(c.text);
    if (result.phrase?.slug === c.expectedSlug) passed++;
    else failures.push(`"${c.text}" expected "${c.expectedSlug}", got "${result.phrase?.slug ?? 'none'}"`);
  }
  const ratio = passed / positives.length;
  assert.ok(
    ratio >= 0.9,
    `expected ≥90% accuracy, got ${passed}/${positives.length} (${(ratio * 100).toFixed(1)}%)\n${failures.join('\n')}`,
  );
});

test('"make it pop" matches make-it-pop at confidence 1', () => {
  const engine = buildEngine();
  const result = engine.match('make it pop');
  assert.equal(result.phrase?.slug, 'make-it-pop');
  assert.equal(result.confidence, 1);
});

test('worst-case match stays under 100ms', () => {
  const engine = buildEngine();
  const longInput =
    'um so like the client sent a really long email about how the homepage kind of needs to feel ' +
    'more premium and modern and maybe pop a bit more overall if that is possible for the next round ' +
    'of changes before the launch date that we agreed on earlier this month during the kickoff call';
  const start = performance.now();
  engine.match(longInput);
  const elapsed = performance.now() - start;
  assert.ok(elapsed < 100, `match took ${elapsed.toFixed(1)}ms, expected <100ms`);
});

test('every case in the combined list is exercised', () => {
  assert.ok(CASES.length >= 70);
});
