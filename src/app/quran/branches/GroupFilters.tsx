'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDownWideNarrow, BookOpen, Check, Link2, Plus, Tags, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import { num } from '@/lib/quran/arabicNumber';
import { normalizeWord } from '@/lib/quran/normalize';
import { SORTS, FILTER_KEYS, groupFilters, toggleFilter, type GroupFilters } from '@/lib/quran/mutashabih/browse';
import { TAGS } from '@/lib/quran/mutashabih/types';

const relations = {
  mutashabih_lafzi: { ar: 'متشابه لفظي', en: 'Verbal parallel' },
  shared_phrase: { ar: 'عبارة مشتركة', en: 'Shared phrase' },
  same_frame: { ar: 'قالب واحد', en: 'Same frame' },
  identical: { ar: 'تطابق تام', en: 'Identical' },
};

export type ScopeOption = { number: number; name: string; nameEn?: string };

function Picker({ name, value, onChange, options }: { name: string; value?: string; onChange: (value: string) => void; options: ScopeOption[] }) {
  const ar = useLanguage().language === 'ar';
  const [query, setQuery] = useState('');
  const picked = (value ?? '').split(',').filter(Boolean).map(Number);
  const title = (name: string) => normalizeWord(name.trim()).replace(/^سوره\s+/, '').replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
  const needle = title(query);
  const matches = options.filter(option => !picked.includes(option.number) && (title(option.name).includes(needle) || title(option.nameEn ?? '').toLowerCase().includes(needle.toLowerCase())))
    .sort((a, b) => Number(title(b.name) === needle) - Number(title(a.name) === needle));
  const toggle = (number: number) => {
    setQuery('');
    onChange(toggleFilter(value, String(number)));
  };
  return <div className="flex flex-col gap-1">
    <input aria-label={name} placeholder={name} value={query} onChange={event => setQuery(event.target.value)}
      className="w-full rounded border border-[var(--home-rule)] bg-[var(--home-paper)] px-2 py-1.5 text-base" />
    <div className="flex flex-wrap gap-1">
      {picked.flatMap(number => {
        const option = options.find(item => item.number === number);
        return option ? [<Button key={number} size="sm" onClick={() => toggle(number)}><X size={12} aria-hidden />{!ar && option.nameEn ? option.nameEn : option.name}</Button>] : [];
      })}
      {needle && matches.slice(0, 5).map(option =>
        <Button key={option.number} size="sm" onClick={() => toggle(option.number)}><Plus size={12} aria-hidden />{!ar && option.nameEn ? option.nameEn : option.name}</Button>)}
    </div>
  </div>;
}

export default function GroupFilterControls({ surahs, filters }: { surahs: ScopeOption[]; filters: GroupFilters }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const router = useNavigatingRouter();
  const [draft, setDraft] = useState(filters);
  const latest = useRef(filters);
  const pending = useRef(false);
  useEffect(() => {
    if (pending.current && JSON.stringify(filters) !== JSON.stringify(latest.current)) return;
    pending.current = false;
    latest.current = filters;
    setDraft(filters);
  }, [filters]);
  useEffect(() => {
    const restore = () => {
      const next = groupFilters(Object.fromEntries(new URL(location.href).searchParams));
      pending.current = false;
      latest.current = next;
      setDraft(next);
    };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  const set = (key: keyof GroupFilters, value: string) => {
    const next = groupFilters({ ...latest.current, [key]: value });
    latest.current = next;
    pending.current = true;
    setDraft(next);
    const url = new URL(location.href);
    for (const filter of FILTER_KEYS) url.searchParams.delete(filter);
    for (const [param, selected] of Object.entries(next)) {
      if (selected) url.searchParams.set(param, selected);
      else url.searchParams.delete(param);
    }
    url.searchParams.delete('n');
    try { sessionStorage.setItem('quran:filter-navigation', key); } catch {}
    router.replace(url.pathname + url.search, { scroll: false });
  };
  const groups = [
    { label: ar ? 'نوع الصلة' : 'Link kind', key: 'relations' as const, values: relations },
    { label: ar ? 'نوع الاختلاف' : 'Difference', key: 'differences' as const, values: TAGS },
  ];
  const sorts = ar ? ['ترتيب المصحف', 'الأقرب', 'الأكثر مواضع', 'الأقل اختلافًا'] : ['Mushaf order', 'Closest', 'Most places', 'Fewest differences'];
  return <>
    {groups.map(group => <fieldset key={group.key} className="flex flex-wrap gap-1.5"><legend className="mb-1 text-sm">{group.label}</legend>
      {Object.entries(group.values).map(([id, label]) => {
        const active = draft[group.key]?.split(',').includes(id) ?? false;
        return <Button key={id} size="sm" active={active} aria-pressed={active} onClick={() => set(group.key, toggleFilter(draft[group.key], id))}>
          {active ? <Check size={12} aria-hidden /> : group.key === 'relations' ? <Link2 size={12} aria-hidden /> : <Tags size={12} aria-hidden />}{ar ? label.ar : label.en}{'extension' in label && <span>{ar ? ' · امتداد نمق' : ' · Namaq extension'}</span>}
        </Button>;
      })}
      {group.key === 'relations' && <Button size="sm" active={draft.cited === '1'} aria-pressed={draft.cited === '1'} onClick={() => set('cited', draft.cited === '1' ? '' : '1')}>
        <BookOpen size={12} aria-hidden />{ar ? 'في كتب المتشابه' : 'In the books'}
      </Button>}
    </fieldset>)}
    <fieldset className="flex flex-col gap-1.5"><legend className="mb-1 text-sm">{ar ? 'النطاق' : 'Scope'}</legend>
      <Picker name={ar ? 'ابحث عن سورة' : 'Find a surah'} value={draft.surahs} onChange={value => set('surahs', value)} options={surahs} />
      <Picker name={ar ? 'ابحث عن جزء' : 'Find a juz'} value={draft.juz} onChange={value => set('juz', value)} options={Array.from({ length: 30 }, (_, index) => ({ number: index + 1, name: ar ? `الجزء ${num(index + 1)}` : `Juz ${index + 1}` }))} />
      <p className="m-0 text-xs text-[var(--home-muted)]">{ar ? 'يكفي أن يقع الموضع في إحدى السور أو الأجزاء المختارة.' : 'A place can match any selected surah or juz.'}</p>
      <div className="flex items-center gap-2"><span className="text-sm">{ar ? 'الصفحات' : 'Pages'}</span>
        {(['pageFrom', 'pageTo'] as const).map((key, index) => {
          const label = (ar ? ['من صفحة', 'إلى صفحة'] : ['From page', 'To page'])[index];
          const value = draft[key] ?? '';
          return <input key={key} aria-label={label} placeholder={label} inputMode="numeric"
            value={ar ? value.replace(/\d/g, digit => num(Number(digit))) : value}
            onChange={event => set(key, event.target.value.replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit))).replace(/[^0-9]/g, '').slice(0, 3))}
            className="w-24 rounded border border-[var(--home-rule)] px-2 py-1 text-base" />;
        })}
      </div>
    </fieldset>
    <fieldset className="flex flex-wrap gap-1.5"><legend className="mb-1 text-sm">{ar ? 'الترتيب' : 'Sort'}</legend>
      {SORTS.map((sort, index) => {
        const active = (draft.sort || 'mushaf') === sort;
        return <Button size="sm" key={sort} active={active} aria-pressed={active} onClick={() => set('sort', index ? sort : '')}>
          <ArrowDownWideNarrow size={12} aria-hidden />{sorts[index]}
        </Button>;
      })}
    </fieldset>
  </>;
}
