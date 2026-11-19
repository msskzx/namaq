import type { Metadata } from 'next';
import { termChapters } from '@/lib/balaghaTerms';
import TermsList from './TermsList';

export const metadata: Metadata = { title: 'مصطلحات البلاغة' };

/** «مصطلحات البلاغة» (owner, 2026-11-18; the app's terms screen): every balagha term under al-Suyuti's chapters in al-Itqan. */
export default function BalaghaTermsPage() {
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex w-full max-w-2xl flex-col gap-2.5 p-4 text-[var(--home-ink)]">
      <h1 className="text-3xl">مصطلحات البلاغة</h1>
      <TermsList chapters={termChapters()} />
    </div>
  );
}
