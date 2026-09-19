import { headers } from 'next/headers';
import { env } from './env';

function firstForwardedIp(xff: string | null): string {
  return xff ? xff.split(',')[0]!.trim() : '0.0.0.0';
}

export function getClientIp(req: Request): string {
  return firstForwardedIp(req.headers.get('x-forwarded-for'));
}

// Server actions have no Request object to read headers from.
export async function getClientIpFromHeaders(): Promise<string> {
  const h = await headers();
  return firstForwardedIp(h.get('x-forwarded-for'));
}

export async function hashIp(ip: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(env().IP_HASH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ip));
  return Buffer.from(sig).toString('hex');
}
