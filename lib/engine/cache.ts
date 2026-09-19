import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { phrases } from '@/db/schema';
import { createEngine, type Engine } from './match';

const TTL_MS = 10 * 60 * 1000;

type CacheState = { engine: Engine | null; loadedAt: number; loading: Promise<Engine> | null };

const g = globalThis as unknown as { __cstEngineCache?: CacheState };

function state(): CacheState {
  if (!g.__cstEngineCache) g.__cstEngineCache = { engine: null, loadedAt: 0, loading: null };
  return g.__cstEngineCache;
}

async function load(): Promise<Engine> {
  const rows = await db().select().from(phrases).where(eq(phrases.active, true));
  return createEngine(rows);
}

export async function getEngine(): Promise<Engine> {
  const s = state();
  if (s.engine && Date.now() - s.loadedAt < TTL_MS) return s.engine;
  if (s.loading) return s.loading;

  s.loading = load()
    .then((engine) => {
      s.engine = engine;
      s.loadedAt = Date.now();
      s.loading = null;
      return engine;
    })
    .catch((err: unknown) => {
      s.loading = null;
      console.error('[engine] failed to reload phrase cache', err);
      if (s.engine) return s.engine;
      throw err;
    });

  return s.loading;
}

export function invalidatePhraseCache(): void {
  state().loadedAt = 0;
}
