try {
  process.loadEnvFile('.env.local');
} catch {}

import { db } from '@/lib/db';
import { phrases } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { collectAllSeedPhrases, runValidation } from './validate';

async function seed() {
  const { ok, counts, total } = runValidation();
  console.table(counts);
  console.log(`total: ${total}`);
  if (!ok) {
    console.error('\nseed data failed validation — aborting seed');
    process.exit(1);
  }

  const force = process.argv.includes('--force');
  const all = collectAllSeedPhrases();

  const query = db()
    .insert(phrases)
    .values(
      all.map((p) => ({
        slug: p.slug,
        triggers: p.triggers,
        keywords: p.keywords,
        category: p.category,
        meaning: p.meaning,
        question: p.question,
        reply: p.reply,
        risk: p.risk,
      })),
    );

  if (force) {
    await query.onConflictDoUpdate({
      target: phrases.slug,
      set: {
        triggers: sql`excluded.triggers`,
        keywords: sql`excluded.keywords`,
        category: sql`excluded.category`,
        meaning: sql`excluded.meaning`,
        question: sql`excluded.question`,
        reply: sql`excluded.reply`,
        risk: sql`excluded.risk`,
        updatedAt: sql`now()`,
      },
    });
  } else {
    await query.onConflictDoNothing({ target: phrases.slug });
  }

  console.log(`seeded ${all.length} phrases${force ? ' (force: existing rows overwritten)' : ' (existing rows kept)'}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
