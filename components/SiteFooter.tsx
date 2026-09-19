import { COMPANY_NAME, PAID_APP_URL, FOOTER_UTM } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="h-9 shrink-0 border-t border-line">
      <div className="mx-auto flex h-full max-w-[760px] items-center px-4">
        <p className="truncate text-xs text-muted">
          Made by {COMPANY_NAME} —{' '}
          <a
            href={`${PAID_APP_URL}?${FOOTER_UTM}`}
            target="_blank"
            rel="noopener"
            className="underline hover:text-ink"
          >
            the CRM built for web designers →
          </a>
        </p>
      </div>
    </footer>
  );
}
