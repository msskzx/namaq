'use client';

import { ArrowLeftRight, Expand, ListOrdered, Waves } from 'lucide-react';
import Button from '@/components/common/Button';
import NumberInput from '@/components/common/NumberInput';
import { useLanguage } from '@/components/language/LanguageContext';
import { compareHref, type Range } from '@/lib/quran/compare';
import { NOTE, PANEL } from '../panel';
import CompareModeToggle from './CompareModeToggle';
import SurahPicker from './SurahPicker';
import { viewHref } from './modeHref';

type Side = { number: number; range: NonNullable<Range>; count: number };
type Props = { surahs: { number: number; name: string }[]; a: Side; b: Side; query: Record<string, string | string[] | undefined>; themes?: boolean };

export default function CompareControls({ surahs, a, b, query, themes = false }: Props) {
  const ar = useLanguage().language === 'ar';
  const ayat = query.view === 'ayat';
  const side = (key: 'a' | 'b', current: Side) => {
    const title = ar ? (key === 'a' ? 'السورة الأولى' : 'السورة الثانية') : (key === 'a' ? 'First surah' : 'Second surah');
    const whole = { from: 1, to: current.count };
    const all = key === 'a' ? compareHref(a.number, whole, b.number, b.range) : compareHref(a.number, a.range, b.number, whole);
    return <fieldset className="flex flex-wrap items-center gap-3 min-w-0">
      <legend className={`${NOTE} mb-1`}>{title}</legend>
      <SurahPicker name={key} label={title} value={current.number} surahs={surahs} />
      {!themes && <div className="flex flex-wrap items-center gap-2">
        {(['from', 'to'] as const).map((edge, index) => <span key={edge} className={`${NOTE} flex items-center gap-1`}>
          {ar ? (index === 0 ? 'من' : 'إلى') : (index === 0 ? 'From' : 'To')}
          <NumberInput name={`${key}${index === 0 ? 'f' : 't'}`} label={ar ? `${index === 0 ? 'من' : 'إلى'} آية (${key === 'a' ? 'الأولى' : 'الثانية'})` : `${title}: ${index === 0 ? 'from' : 'to'} ayah`} defaultValue={current.range[edge]} min={1} max={current.count} />
        </span>)}
        <Button size="sm" href={`${all}${ayat ? '&view=ayat' : ''}`} aria-label={ar ? `الكل: آيات ${title}` : `All ayat: ${title}`}><Expand size={16} aria-hidden />{ar ? 'الكل' : 'All'}</Button>
      </div>}
    </fieldset>;
  };
  return <form key={[themes, a.number, a.range.from, a.range.to, b.number, b.range.from, b.range.to].join()} method="get" dir={ar ? 'rtl' : 'ltr'} className={`${PANEL} flex flex-col gap-4`}>
    {themes ? <input type="hidden" name="mode" value="themes" /> : <>
      <CompareModeToggle on={ayat} offHref={viewHref(false, query)} onHref={viewHref(true, query)} offLabel={ar ? 'المتشابه' : 'Similar ayat'} onLabel={ar ? 'آية بآية' : 'Ayah by ayah'} label={ar ? 'المقارنة آية بآية' : 'Compare ayah by ayah'} offIcon={<Waves size={14} aria-hidden />} onIcon={<ListOrdered size={14} aria-hidden />} />
      {ayat && <input type="hidden" name="view" value="ayat" />}
    </>}
    {side('a', a)}
    {side('b', b)}
    <Button type="submit" variant="primary" className="w-fit"><ArrowLeftRight size={16} aria-hidden />{ar ? 'قارن' : 'Compare'}</Button>
  </form>;
}

export function DifferentSelection({ themes = false }: { themes?: boolean }) {
  const ar = useLanguage().language === 'ar';
  return <p className={NOTE}>{themes ? (ar ? 'اختر سورتين مختلفتين.' : 'Choose two different surahs.') : (ar ? 'اختر مقطعين مختلفين.' : 'Choose two different passages.')}</p>;
}
