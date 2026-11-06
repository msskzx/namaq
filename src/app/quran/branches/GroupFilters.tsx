'use client';

import { ArrowDownWideNarrow, BookOpen, Check, Link2, Tags } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { SORTS, groupFilters, toggleFilter, type GroupFilters } from '@/lib/quran/mutashabih/browse';
import { SUPPORTED_TAGS } from '@/lib/quran/mutashabih/evidence';

const categories = {
  mutashabeh: { ar: 'متشابهات', en: 'Mutashabeh' },
  pondering: { ar: 'تدبّر', en: 'Pondering' },
  words: { ar: 'أشجار الكلمات', en: 'Word trees' },
};

export default function GroupFilterControls({ filters: draft, onChange }: { filters: GroupFilters; onChange: (filters: GroupFilters) => void }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const set = (key: keyof GroupFilters, value: string) => onChange(groupFilters({ ...draft, [key]: value }));
  const groups = [
    { label: ar ? 'نوع المقارنة' : 'Comparison category', key: 'categories' as const, values: categories },
    { label: ar ? 'نوع الاختلاف' : 'Difference', key: 'differences' as const, values: SUPPORTED_TAGS },
  ];
  const sorts = ar ? ['ترتيب المصحف', 'الأقرب', 'الأكثر مواضع', 'الأقل اختلافًا'] : ['Mushaf order', 'Closest', 'Most places', 'Fewest differences'];
  return <>
    {groups.map(group => <fieldset key={group.key} className="flex flex-wrap gap-1.5"><legend className="mb-1 text-sm">{group.label}</legend>
      {Object.entries(group.values).map(([id, label]) => {
        const selected = draft[group.key] ?? (group.key === 'categories' ? 'mutashabeh,pondering' : '');
        const active = selected.split(',').includes(id);
        return <Button key={id} size="sm" variant="neutral" active={active} aria-pressed={active} onClick={() => set(group.key, toggleFilter(selected, id) || (group.key === 'categories' ? 'none' : ''))}>
          {active ? <Check size={12} aria-hidden /> : group.key === 'categories' ? <Link2 size={12} aria-hidden /> : <Tags size={12} aria-hidden />}{ar ? label.ar : label.en}
        </Button>;
      })}
      {group.key === 'categories' && <Button size="sm" variant="neutral" active={draft.cited === '1'} aria-pressed={draft.cited === '1'} onClick={() => set('cited', draft.cited === '1' ? '' : '1')}>
        <BookOpen size={12} aria-hidden />{ar ? 'في كتب المتشابه' : 'In the books'}
      </Button>}
    </fieldset>)}
    <fieldset className="flex flex-wrap gap-1.5"><legend className="mb-1 text-sm">{ar ? 'الترتيب' : 'Sort'}</legend>
      {SORTS.map((sort, index) => {
        const active = (draft.sort || 'mushaf') === sort;
        return <Button size="sm" variant="neutral" key={sort} active={active} aria-pressed={active} onClick={() => set('sort', index ? sort : '')}>
          <ArrowDownWideNarrow size={12} aria-hidden />{sorts[index]}
        </Button>;
      })}
    </fieldset>
  </>;
}
