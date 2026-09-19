try {
  process.loadEnvFile('.env.local');
} catch {}

import { db } from '@/lib/db';
import { phrases } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { collectAllSeedPhrases, runValidation } from './validate';

// The brief's ten original tone-setting examples, in that order — inserted
// first (on a fresh DB) so they land at ids 1-10 and become the /library
// "free sample" (see docs/build-spec.md §12 and its repo-map note on this file).
const FREE_SAMPLE_SLUGS = [
  'make-it-pop',
  'know-it-when-i-see-it',
  'something-feels-off',
  'brother-nephew-friend-thinks',
  'just-a-small-change',
  'add-a-blog-shop-booking',
  'diy-builder-is-free',
  'when-will-it-be-done',
  'make-the-logo-bigger',
  'hold-off-until-perfect',
];

async function seed() {
  const { ok, counts, total } = runValidation();
  console.table(counts);
  console.log(`total: ${total}`);
  if (!ok) {
    console.error('\nseed data failed validation — aborting seed');
    process.exit(1);
  }

  const force = process.argv.includes('--force');
  const allPhrases = collectAllSeedPhrases();
  const bySlug = new Map(allPhrases.map((p) => [p.slug, p]));
  const freeSample = FREE_SAMPLE_SLUGS.map((slug) => {
    const p = bySlug.get(slug);
    if (!p) throw new Error(`FREE_SAMPLE_SLUGS references unknown slug "${slug}"`);
    return p;
  });
  const freeSampleSet = new Set(FREE_SAMPLE_SLUGS);
  const rest = allPhrases.filter((p) => !freeSampleSet.has(p.slug));
  const all = [...freeSample, ...rest];

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
