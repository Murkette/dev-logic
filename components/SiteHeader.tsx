import Link from 'next/link';
import { APP_NAME } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="h-12 shrink-0 border-b border-line">
      <div className="mx-auto flex h-full max-w-[760px] items-center justify-between px-4">
        <Link href="/" className="text-sm font-medium text-ink">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted">
          <Link href="/library" className="hover:text-ink">
            Library
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}
