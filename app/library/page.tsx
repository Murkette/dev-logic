import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { phrases } from '@/db/schema';
import { verifyLibToken, LIB_COOKIE } from '@/lib/tokens';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LibraryBrowser, type LibraryEntry } from '@/components/LibraryBrowser';
import type { Risk } from '@/components/RiskBadge';

export const dynamic = 'force-dynamic';

const FREE_SAMPLE_SIZE = 10;

export default async function LibraryPage() {
  const cookieStore = await cookies();
  const unlocked = verifyLibToken(cookieStore.get(LIB_COOKIE)?.value) !== null;

  const rows = await db().select().from(phrases).where(eq(phrases.active, true)).orderBy(phrases.id);

  // Locked visitors get full content for the first 10 (by id) only — the
  // "free sample" — and just a title/risk/category for everything else.
  // Never ship locked bodies to the client and hide them with CSS: the point
  // of the wall is that the text genuinely isn't in the response.
  const entries: LibraryEntry[] = rows.map((row, i) => {
    if (unlocked || i < FREE_SAMPLE_SIZE) {
      return {
        locked: false,
        slug: row.slug,
        triggers: row.triggers,
        keywords: row.keywords,
        category: row.category,
        meaning: row.meaning,
        question: row.question,
        reply: row.reply,
        risk: row.risk as Risk,
      };
    }
    return {
      locked: true,
      slug: row.slug,
      title: row.triggers[0] ?? row.slug,
      category: row.category,
      risk: row.risk as Risk,
    };
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <LibraryBrowser entries={entries} unlocked={unlocked} />
      <SiteFooter />
    </div>
  );
}
