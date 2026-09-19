import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from './env';
import * as schema from '../db/schema';

type Db = ReturnType<typeof drizzle<typeof schema>>;

const g = globalThis as unknown as { __cstDb?: Db };

export function db(): Db {
  if (!g.__cstDb) {
    const sql = postgres(env().DATABASE_URL, { max: 5 });
    g.__cstDb = drizzle(sql, { schema });
  }
  return g.__cstDb;
}
