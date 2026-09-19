import { taste } from './phrases/taste';
import { trust } from './phrases/trust';
import { scope } from './phrases/scope';
import { money } from './phrases/money';
import { timeline } from './phrases/timeline';
import { committee } from './phrases/committee';
import { tech } from './phrases/tech';
import { launchFear } from './phrases/launch-fear';
import type { SeedPhrase } from './phrases/types';
import { validatePhrase, CATEGORIES } from '@/lib/phrase-validate';
import { normalise } from '@/lib/engine/normalise';

const CATEGORY_GROUPS: Record<string, SeedPhrase[]> = {
  taste, trust, scope, money, timeline, committee, tech, 'launch-fear': launchFear,
};

const MIN_PER_CATEGORY = 12;
const MIN_TOTAL = 120;

export function collectAllSeedPhrases(): SeedPhrase[] {
  return Object.values(CATEGORY_GROUPS).flat();
}

export function runValidation(): { ok: boolean; counts: Record<string, number>; total: number } {
  const all = collectAllSeedPhrases();
  let ok = true;

  const slugs = new Map<string, string>(); // slug -> first phrase's normalised trigger context (for messages)
  const triggerOwners = new Map<string, string>(); // normalised trigger -> slug

  for (const phrase of all) {
    const errors = validatePhrase(phrase);
    for (const err of errors) {
      console.error(`[${phrase.slug}] ${err}`);
      ok = false;
    }

    if (slugs.has(phrase.slug)) {
      console.error(`duplicate slug "${phrase.slug}"`);
      ok = false;
    }
    slugs.set(phrase.slug, phrase.slug);

    for (const trigger of phrase.triggers) {
      const n = normalise(trigger);
      const owner = triggerOwners.get(n);
      if (owner && owner !== phrase.slug) {
        console.error(`trigger "${trigger}" (normalised "${n}") collides between "${owner}" and "${phrase.slug}"`);
        ok = false;
      }
      triggerOwners.set(n, phrase.slug);
    }
  }

  const counts: Record<string, number> = {};
  for (const category of CATEGORIES) {
    counts[category] = CATEGORY_GROUPS[category]?.length ?? 0;
    if (counts[category]! < MIN_PER_CATEGORY) {
      console.error(`category "${category}" has only ${counts[category]} entries, needs ≥${MIN_PER_CATEGORY}`);
      ok = false;
    }
  }

  if (all.length < MIN_TOTAL) {
    console.error(`total phrase count ${all.length} is below the minimum of ${MIN_TOTAL}`);
    ok = false;
  }

  return { ok, counts, total: all.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { ok, counts, total } = runValidation();
  console.table(counts);
  console.log(`total: ${total}`);
  if (!ok) {
    console.error('\nseed validation FAILED');
    process.exit(1);
  }
  console.log('seed validation passed');
}
