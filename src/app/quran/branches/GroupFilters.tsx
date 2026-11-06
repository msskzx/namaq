'use client';

import { ArrowDownWideNarrow, BookOpen, Check, Link2, Tags } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { SORTS, groupFilters, toggleFilter, type GroupFilters } from '@/lib/quran/mutashabih/browse';
import { TAGS } from '@/lib/quran/mutashabih/types';

const relations = {
  mutashabih_lafzi: { ar: 'متشابه لفظي', en: 'Verbal parallel' },
  shared_phrase: { ar: 'عبارة مشتركة', en: 'Shared phrase' },
  same_frame: { ar: 'قالب واحد', en: 'Same frame' },
  identical: { ar: 'تطابق تام', en: 'Identical' },
};

export default function GroupFilterControls({ filters: draft, onChange }: { filters: GroupFilters; onChange: (filters: GroupFilters) => void }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const set = (key: keyof GroupFilters, value: string) => onChange(groupFilters({ ...draft, [key]: value }));
  const groups = [
    { label: ar ? 'نوع الصلة' : 'Link kind', key: 'relations' as const, values: relations },
    { label: ar ? 'نوع الاختلاف' : 'Difference', key: 'differences' as const, values: TAGS },
  ];
  const sorts = ar ? ['ترتيب المصحف', 'الأقرب', 'الأكثر مواضع', 'الأقل اختلافًا'] : ['Mushaf order', 'Closest', 'Most places', 'Fewest differences'];
  return <>
    {groups.map(group => <fieldset key={group.key} className="flex flex-wrap gap-1.5"><legend className="mb-1 text-sm">{group.label}</legend>
      {Object.entries(group.values).map(([id, label]) => {
        const active = draft[group.key]?.split(',').includes(id) ?? false;
        return <Button key={id} size="sm" variant="neutral" active={active} aria-pressed={active} onClick={() => set(group.key, toggleFilter(draft[group.key], id))}>
          {active ? <Check size={12} aria-hidden /> : group.key === 'relations' ? <Link2 size={12} aria-hidden /> : <Tags size={12} aria-hidden />}{ar ? label.ar : label.en}{'extension' in label && <span>{ar ? ' · امتداد نمق' : ' · Namaq extension'}</span>}
        </Button>;
      })}
      {group.key === 'relations' && <Button size="sm" variant="neutral" active={draft.cited === '1'} aria-pressed={draft.cited === '1'} onClick={() => set('cited', draft.cited === '1' ? '' : '1')}>
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
