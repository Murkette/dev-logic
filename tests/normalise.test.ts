import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalise } from '../lib/engine/normalise';

test('lowercases and strips punctuation', () => {
  assert.equal(normalise("Can You Make It POP?!"), 'can you make it pop');
});

test('strips apostrophes without inserting a space', () => {
  assert.equal(normalise("I'll know it when I see it"), 'ill know it when i see it');
  // "like" is itself a filler word, so it's removed along with the apostrophe
  assert.equal(normalise("don't like it"), 'dont it');
});

test('handles unicode curly quotes the same as straight ones', () => {
  assert.equal(normalise('I’ll know it'), normalise("I'll know it"));
});

test('collapses whitespace', () => {
  assert.equal(normalise('too   much    space'), 'too much space');
});

test('removes filler words (multi-word fillers first)', () => {
  assert.equal(normalise('just kind of make it pop please'), 'make it pop');
});

test('does not strip filler substrings from other words', () => {
  // "like" is a filler, but "unlike" and "liked" are different words and untouched
  assert.equal(normalise('I liked the first version'), 'i liked the first version');
});

test('returns empty string for filler-only or punctuation-only input', () => {
  assert.equal(normalise('um, like, maybe'), '');
  assert.equal(normalise('!!! ??? ...'), '');
});
