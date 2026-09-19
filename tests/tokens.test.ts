import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.COOKIE_SECRET ??= 'test-secret-not-for-production-use-only-in-tests';

const { sign, verify, signLibToken, verifyLibToken, signUnsubToken, verifyUnsubToken } = await import('../lib/tokens');

test('round-trips a signed token', () => {
  const token = sign('widget', ['abc', 123]);
  assert.deepEqual(verify('widget', token), ['abc', '123']);
});

test('rejects a tampered payload', () => {
  const token = sign('widget', ['abc']);
  const [payload, sig] = token.split(/\.(?=[^.]+$)/);
  const tampered = `${payload!.replace('abc', 'xyz')}.${sig}`;
  assert.equal(verify('widget', tampered), null);
});

test('rejects a tampered signature', () => {
  const token = sign('widget', ['abc']);
  const tampered = `${token.slice(0, -4)}zzzz`;
  assert.equal(verify('widget', tampered), null);
});

test('rejects an expired token when maxAgeSec is given', () => {
  const oldIat = Math.floor(Date.now() / 1000) - 1000;
  const token = sign('widget', ['abc', oldIat]);
  assert.equal(verify('widget', token, 500), null);
  assert.deepEqual(verify('widget', token, 2000), ['abc', String(oldIat)]);
});

test('rejects a token replayed under a different kind', () => {
  const token = sign('lib', ['abc']);
  assert.equal(verify('admin', token), null);
});

test('rejects malformed or missing tokens', () => {
  assert.equal(verify('widget', null), null);
  assert.equal(verify('widget', undefined), null);
  assert.equal(verify('widget', ''), null);
  assert.equal(verify('widget', 'not-enough-parts'), null);
});

test('lib token helpers round-trip a lead id', () => {
  const token = signLibToken(42);
  assert.deepEqual(verifyLibToken(token), { leadId: 42 });
});

test('lib token verification rejects garbage', () => {
  assert.equal(verifyLibToken('garbage'), null);
  assert.equal(verifyLibToken(signUnsubToken(42)), null); // wrong kind
});

test('unsub token helpers round-trip a lead id and never expire', () => {
  const token = signUnsubToken(7);
  assert.deepEqual(verifyUnsubToken(token), { leadId: 7 });
});
