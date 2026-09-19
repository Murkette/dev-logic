import { createHmac, timingSafeEqual } from 'crypto';
import { env } from './env';

const DAY_SEC = 24 * 60 * 60;

export const LIB_COOKIE = 'cst_lib';
export const LIB_MAX_AGE_SEC = 90 * DAY_SEC;

export const ADMIN_COOKIE = 'cst_admin';
export const ADMIN_MAX_AGE_SEC = 7 * DAY_SEC;

function hmac(payload: string): Buffer {
  return createHmac('sha256', env().COOKIE_SECRET).update(payload).digest();
}

/**
 * One generic signed-token pair backs the library-unlock cookie, the admin
 * session cookie, and the unsubscribe URL token (see docs/build-spec.md §11).
 * `kind` is folded into the signed payload so a token can't be replayed
 * across purposes even though all three share this format.
 */
export function sign(kind: string, parts: Array<string | number>): string {
  const payload = [kind, ...parts].join('.');
  return `${payload}.${hmac(payload).toString('base64url')}`;
}

/**
 * Verifies a token's kind and signature, and — when `maxAgeSec` is given —
 * treats the last part as a unix-seconds issued-at timestamp and rejects
 * expired tokens. Returns the parts (kind stripped) or null.
 */
export function verify(kind: string, token: string | undefined | null, maxAgeSec?: number): string[] | null {
  if (!token) return null;
  const segments = token.split('.');
  if (segments.length < 3) return null;

  const sig = segments[segments.length - 1]!;
  const payloadParts = segments.slice(0, -1);
  if (payloadParts[0] !== kind) return null;

  const expected = hmac(payloadParts.join('.'));
  let actual: Buffer;
  try {
    actual = Buffer.from(sig, 'base64url');
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  const parts = payloadParts.slice(1);

  if (maxAgeSec !== undefined) {
    const iat = Number(parts[parts.length - 1]);
    if (!Number.isFinite(iat) || Date.now() / 1000 - iat > maxAgeSec) return null;
  }

  return parts;
}

export function signLibToken(leadId: number): string {
  return sign('lib', [leadId, Math.floor(Date.now() / 1000)]);
}

export function verifyLibToken(token: string | undefined | null): { leadId: number } | null {
  const parts = verify('lib', token, LIB_MAX_AGE_SEC);
  if (!parts) return null;
  const leadId = Number(parts[0]);
  return Number.isFinite(leadId) ? { leadId } : null;
}

export function signAdminToken(): string {
  return sign('admin', [Math.floor(Date.now() / 1000)]);
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  return verify('admin', token, ADMIN_MAX_AGE_SEC) !== null;
}

export function signUnsubToken(leadId: number): string {
  return sign('unsub', [leadId]);
}

export function verifyUnsubToken(token: string | undefined | null): { leadId: number } | null {
  const parts = verify('unsub', token);
  if (!parts) return null;
  const leadId = Number(parts[0]);
  return Number.isFinite(leadId) ? { leadId } : null;
}
