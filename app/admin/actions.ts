'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { phrases, suggestions } from '@/db/schema';
import { requireAdmin } from '@/lib/admin-auth';
import { validatePhrase, type PhraseInput } from '@/lib/phrase-validate';
import { invalidatePhraseCache } from '@/lib/engine/cache';
import { ADMIN_COOKIE } from '@/lib/tokens';

const FLASH_COOKIE = 'cst_admin_flash';
const FLASH_MAX_AGE_SEC = 10;

export async function logoutAction(): Promise<void> {
  await requireAdmin();
  const cookieStore = await cookies();
  // delete() must be given the same path the cookie was set with (/admin) —
  // without it, Next writes a separate cleared cookie at the default path
  // '/', leaving the real /admin-scoped session cookie untouched.
  cookieStore.delete({ name: ADMIN_COOKIE, path: '/admin' });
  redirect('/admin/login');
}

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || 'phrase';
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = base;
  for (let suffix = 2; ; suffix++) {
    const [existing] = await db().select({ id: phrases.id }).from(phrases).where(eq(phrases.slug, candidate)).limit(1);
    if (!existing) return candidate;
    candidate = `${base}-${suffix}`;
  }
}

async function setFlash(data: Record<string, unknown>): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(FLASH_COOKIE, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin/phrases',
    maxAge: FLASH_MAX_AGE_SEC,
  });
}

// The edit/add form is plain HTML with no client JS: on a validation error we
// can't hold state in the browser, so we flash the submitted values and the
// errors into a short-lived cookie and redirect back to re-render them.
export async function savePhraseAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const idRaw = String(formData.get('id') ?? '');
  const id = idRaw ? Number(idRaw) : null;
  const suggestionIdRaw = formData.get('suggestionId');
  const suggestionId = suggestionIdRaw ? Number(suggestionIdRaw) : null;

  const triggersRaw = String(formData.get('triggers') ?? '');
  const keywordsRaw = String(formData.get('keywords') ?? '');
  const triggers = triggersRaw
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);
  const keywords = keywordsRaw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  const category = String(formData.get('category') ?? '');
  const risk = String(formData.get('risk') ?? '');
  const meaning = String(formData.get('meaning') ?? '').trim();
  const question = String(formData.get('question') ?? '').trim();
  const reply = String(formData.get('reply') ?? '').trim();
  const active = formData.get('active') === 'on';

  // New phrases always get a fresh auto-generated slug; existing phrases keep
  // theirs (submitted as a hidden, non-editable field) so links never break.
  const slug = id ? String(formData.get('slug') ?? '') : await uniqueSlug(slugify(triggers[0] ?? 'phrase'));

  const candidate: PhraseInput = { slug, triggers, keywords, category, meaning, question, reply, risk };
  const errors = validatePhrase(candidate);

  if (errors.length > 0) {
    await setFlash({ id, slug, triggersRaw, keywordsRaw, category, risk, meaning, question, reply, active, errors });
    redirect('/admin/phrases');
  }

  if (id) {
    await db()
      .update(phrases)
      .set({ triggers, keywords, category, meaning, question, reply, risk, active, updatedAt: new Date() })
      .where(eq(phrases.id, id));
  } else {
    await db().insert(phrases).values({ slug, triggers, keywords, category, meaning, question, reply, risk, active });
  }

  if (suggestionId) {
    await db().update(suggestions).set({ status: 'added' }).where(eq(suggestions.id, suggestionId));
  }

  invalidatePhraseCache();
  revalidatePath('/admin/phrases');
  redirect('/admin/phrases');
}

export async function toggleActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get('id'));
  await db()
    .update(phrases)
    .set({ active: sql`not ${phrases.active}`, updatedAt: new Date() })
    .where(eq(phrases.id, id));
  invalidatePhraseCache();
  revalidatePath('/admin/phrases');
}

export async function rejectSuggestionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get('id'));
  await db().update(suggestions).set({ status: 'rejected' }).where(eq(suggestions.id, id));
  revalidatePath('/admin/suggestions');
}
