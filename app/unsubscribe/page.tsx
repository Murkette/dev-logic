import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { leads } from '@/db/schema';
import { verifyUnsubToken } from '@/lib/tokens';

export const dynamic = 'force-dynamic';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const mask = (s: string) => (s.length <= 2 ? `${s[0]}*` : `${s[0]}${'*'.repeat(s.length - 2)}${s[s.length - 1]}`);
  const [domainName, ...rest] = domain.split('.');
  return `${mask(local)}@${mask(domainName ?? '')}${rest.length ? `.${rest.join('.')}` : ''}`;
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const verified = verifyUnsubToken(token);

  if (!verified) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-medium text-ink">This link isn&rsquo;t valid</h1>
        <p className="mt-2 text-muted">It may have expired or been mistyped.</p>
      </main>
    );
  }

  const leadId = verified.leadId;
  const [lead] = await db()
    .select({ email: leads.email, unsubscribedAt: leads.unsubscribedAt })
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1);

  if (!lead) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-medium text-ink">This link isn&rsquo;t valid</h1>
      </main>
    );
  }

  if (lead.unsubscribedAt) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-medium text-ink">Done. You won&rsquo;t hear from us again.</h1>
      </main>
    );
  }

  async function unsubscribe() {
    'use server';
    await db().update(leads).set({ unsubscribedAt: new Date() }).where(eq(leads.id, leadId));
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-xl font-medium text-ink">Unsubscribe {maskEmail(lead.email)}?</h1>
      <form action={unsubscribe} className="mt-6">
        <button type="submit" className="h-11 rounded-lg bg-accent px-6 font-medium text-on-accent">
          Unsubscribe
        </button>
      </form>
    </main>
  );
}
