'use client';

import { ArrowDownWideNarrow } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';
import { SORTS, groupFilters, toggleFilter, type GroupFilters } from '@shared/quran/mutashabih/browse';
import { SUPPORTED_TAGS } from '@shared/quran/mutashabih/evidence';
import Chip from '@/components/common/Chip';
import { PAGE_DEFAULT_KIND } from '@shared/quran/branchSearch';

const categories = {
  mutashabeh: { ar: 'في كتب المتشابهات', en: 'In the mutashabih books' },
  pondering: { ar: 'تدبّر', en: 'Pondering' },
  words: { ar: 'أشجار الكلمات', en: 'Word trees' },
};

/** Without `kinds` (the quiz, which asks only the books' mutashabihat) the comparison kinds are not offered. */
export default function GroupFilterControls({ filters: draft, onChange, sort = true, kinds = true, defaultCategories = PAGE_DEFAULT_KIND }: { filters: GroupFilters; onChange: (filters: GroupFilters) => void; sort?: boolean; kinds?: boolean; defaultCategories?: string }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const set = (key: keyof GroupFilters, value: string) => onChange(groupFilters({ ...draft, [key]: value }));
  const groups = [
    ...(kinds ? [{ label: ar ? 'نوع المقارنة' : 'Comparison category', key: 'categories' as const, values: categories }] : []),
    { label: ar ? 'نوع الاختلاف' : 'Difference', key: 'differences' as const, values: SUPPORTED_TAGS },
  ];
  const sorts = ar ? ['ترتيب المصحف', 'الأقرب', 'الأكثر مواضع', 'الأقل اختلافًا'] : ['Mushaf order', 'Closest', 'Most places', 'Fewest differences'];
  return <>
    {groups.map(group => <fieldset key={group.key} className="flex flex-wrap gap-1.5"><legend className="mb-1 text-sm">{group.label}</legend>
      {Object.entries(group.values).map(([id, label]) => {
        const selected = draft[group.key] ?? (group.key === 'categories' ? defaultCategories : '');
        const active = selected.split(',').includes(id);
        return <Chip key={id} check on={active} onClick={() => set(group.key, toggleFilter(selected, id) || (group.key === 'categories' ? 'none' : ''))} label={ar ? label.ar : label.en} />;
      })}
    </fieldset>)}
    {sort && <fieldset className="flex flex-wrap gap-1.5"><legend className="mb-1 text-sm">{ar ? 'الترتيب' : 'Sort'}</legend>
      {SORTS.map((order, index) => {
        const active = (draft.sort || 'mushaf') === order;
        return <Chip key={order} on={active} onClick={() => set('sort', index ? order : '')} label={<><ArrowDownWideNarrow size={12} aria-hidden />{sorts[index]}</>} />;
      })}
    </fieldset>}
  </>;
}
