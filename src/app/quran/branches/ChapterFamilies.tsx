'use client';

import { GitBranch } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { branchesHref, type BranchesView } from '@/lib/quran/branches';
import type { ChapterFamily } from '@/lib/quran/chapterFamilies';
import type { JuzRange } from '@/lib/quran/juz';

export default function ChapterFamilies({ families, juz, view, current }: { families: ChapterFamily[]; juz: JuzRange | null; view: BranchesView; current: string }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  if (!families.length) return null;
  return <nav aria-label={ar ? 'مجموعات فواتح السور' : 'Chapter opening families'} className="flex flex-wrap gap-2">
    {families.map(family => <Button key={family.id} size="sm" active={current === family.id} href={branchesHref(family.id, juz ?? undefined, { ...view, spelling: undefined, partition: undefined })}>
      <GitBranch size={16} aria-hidden />
      {ar ? family.text : family.textEn}
    </Button>)}
  </nav>;
}
