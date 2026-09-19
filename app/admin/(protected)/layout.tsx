import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { logoutAction } from '../actions';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false } };

const TABS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/phrases', label: 'Phrases' },
  { href: '/admin/suggestions', label: 'Suggestions' },
  { href: '/admin/leads', label: 'Leads' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-4 text-sm">
            {TABS.map((tab) => (
              <Link key={tab.href} href={tab.href} className="text-ink hover:text-accent">
                {tab.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-muted hover:text-ink">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
