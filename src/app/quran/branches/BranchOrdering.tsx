'use client';

import { useRouter } from 'next/navigation';
import { ListOrdered, Layers3 } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';
import { branchesHref, type BranchesView } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';

export default function BranchOrdering({ grouped, phrase = '', juz = null, view = {} }: { grouped: boolean; phrase?: string; juz?: JuzRange | null; view?: BranchesView }) {
  const { language } = useLanguage();
  const router = useRouter();
  const ar = language === 'ar';
  return (
    <div role="group" aria-label={ar ? 'ترتيب المتشابهات' : 'Entry order'} className="inline-flex max-w-full self-start rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper-deep)] p-1">
      {[{ grouped: false, icon: ListOrdered, label: ar ? 'الأطول اشتراكًا' : 'Longest shared phrase' }, { grouped: true, icon: Layers3, label: ar ? 'حسب الفاتحة' : 'By opening' }].map(option => (
        <button data-branch-navigation key={String(option.grouped)} type="button" aria-pressed={grouped === option.grouped} onClick={() => router.push(branchesHref(phrase, juz ?? undefined, { ...view, grouped: option.grouped, page: 1 }))}
          className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-accent)] ${grouped === option.grouped ? 'bg-[var(--home-accent)] text-[var(--home-paper)] shadow-sm' : 'text-[var(--home-muted)] hover:text-[var(--home-ink)]'}`}>
          <option.icon size={16} aria-hidden />
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
