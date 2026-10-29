'use client';

import { GitBranch, ListStart, WholeWord } from 'lucide-react';
import Segmented from '@/components/common/Segmented';
import { useLanguage } from '@/components/language/LanguageContext';
import { branchesHref, type BranchesView, type BranchScope as Scope } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';

export default function BranchScope({ scope, juz, view }: { scope: Scope; juz: JuzRange | null; view: BranchesView }) {
  const ar = useLanguage().language === 'ar';
  return <Segmented label={ar ? 'موضع العبارة' : 'Phrase position'} options={[
    { key: 'all', label: ar ? 'الكل' : 'All', icon: <GitBranch size={16} aria-hidden /> },
    { key: 'opening', label: ar ? 'أول الآية' : 'Ayah openings', icon: <ListStart size={16} aria-hidden /> },
    { key: 'inside', label: ar ? 'داخل الآية' : 'Inside ayat', icon: <WholeWord size={16} aria-hidden /> },
  ].map(option => ({ ...option, current: option.key === scope, href: branchesHref('', juz ?? undefined, { ...view, kind: undefined, phraseId: undefined, spelling: undefined, partition: undefined, page: 1, scope: option.key as Scope }) }))} />;
}
