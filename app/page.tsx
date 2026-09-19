import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Translator } from '@/components/Translator';

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col desk:h-dvh desk:overflow-hidden">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[760px] flex-1 min-h-0 flex-col px-4 py-2">
        <Translator />
      </main>
      <SiteFooter />
    </div>
  );
}
