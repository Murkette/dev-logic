const g = globalThis as unknown as { __cstRateLimit?: Map<string, number[]> };
const MAX_KEYS = 10_000;

function store(): Map<string, number[]> {
  if (!g.__cstRateLimit) g.__cstRateLimit = new Map();
  return g.__cstRateLimit;
}

export function rateLimit(
  bucket: string,
  ip: string,
  max: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const map = store();
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const timestamps = (map.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= max) {
    map.set(key, timestamps);
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - timestamps[0]!)) / 1000));
    return { ok: false, retryAfterSec };
  }

  timestamps.push(now);
  map.set(key, timestamps);

  if (map.size > MAX_KEYS) {
    for (const [k, v] of map) {
      const fresh = v.filter((t) => now - t < windowMs);
      if (fresh.length === 0) map.delete(k);
      else map.set(k, fresh);
    }
  }

  return { ok: true };
}
