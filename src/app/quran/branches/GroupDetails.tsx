'use client';

import { Tags } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { branchesHref, type BranchesView } from '@/lib/quran/branches';
import { toggleFilter } from '@/lib/quran/mutashabih/browse';
import { TAGS, type Group } from '@/lib/quran/mutashabih/types';
import type { JuzRange } from '@/lib/quran/juz';

export function GroupDetails({ group, range, view, shownKeys }: { group: Group; range: JuzRange | null; view: BranchesView; shownKeys?: string[] }) {
  const ar = useLanguage().language === 'ar';
  const selected = view.filters?.differences;
  return <div className="flex flex-col gap-2 text-sm">
    {(group.tags.length > 0 || group.detail) && <div className="flex flex-wrap items-center gap-1.5">
      {group.tags.map(tag => {
        const label = TAGS[tag];
        const active = selected?.split(',').includes(tag) ?? false;
        return <Button key={tag} size="sm" active={active} aria-pressed={active} scroll={false}
          href={branchesHref(group.id, range ?? undefined, { ...view, filters: { ...view.filters, differences: toggleFilter(selected, tag) } })}>
          <Tags size={12} aria-hidden />{ar ? label.ar : label.en}{'extension' in label && <span>{ar ? ' · امتداد نمق' : ' · Namaq extension'}</span>}
        </Button>;
      })}
      {!group.citations.length && <span className="text-xs text-[var(--home-muted)]">{ar ? 'تحديد آلي' : 'Automatically identified'}</span>}
      {group.detail && <span lang="ar" dir="rtl">{group.detail}</span>}
    </div>}
    {group.citations.filter(citation => !shownKeys || citation.places.every(place => shownKeys.includes(place.split('-')[0]))).map(citation => <p key={citation.id} lang="ar" dir="rtl" className="m-0 text-xs leading-relaxed text-[var(--home-muted)]">
      {citation.book}، {citation.edition}{' · '}
      <span dir="ltr">{ar ? citation.places.join(' ↔ ').replace(/\d/g, digit => Number(digit).toLocaleString('ar-EG')) : citation.places.join(' ↔ ')}</span>{' · '}
      <a className="underline" href={citation.url}>{ar ? citation.locator.replace(/\d/g, digit => Number(digit).toLocaleString('ar-EG')) : citation.locator}</a>
      <br /><q>{citation.quote}</q>
    </p>)}
  </div>;
}
