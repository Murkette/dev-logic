import { sql } from 'drizzle-orm';
import { db } from './db';
import { counters } from '@/db/schema';

export type CounterKey =
  | 'translations_total'
  | 'translations_unmatched'
  | 'leads_total'
  | 'feedback_up'
  | 'feedback_down'
  | 'suggestions_total';

export async function bump(key: CounterKey): Promise<void> {
  try {
    await db()
      .insert(counters)
      .values({ key, value: 1 })
      .onConflictDoUpdate({ target: counters.key, set: { value: sql`${counters.value} + 1` } });
  } catch (err) {
    console.error(`[counters] failed to bump ${key}`, err);
  }
}
