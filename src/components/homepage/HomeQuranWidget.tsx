'use client';

import { useState } from 'react';
import { ArrowLeftRight, BookOpen, Layers, List, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import Segmented from '@/components/common/Segmented';
import TreeIcon from '@/components/common/TreeIcon';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@shared/quran/arabicNumber';
import { searchHomeQuranSections, type HomeQuranSections } from '@/lib/homeQuranSections';
import styles from './HomeQuranWidget.module.css';

export default function HomeQuranWidget({ sections }: { sections: HomeQuranSections }) {
  const ar = useLanguage().language === 'ar';
  const [unit, setUnit] = useState<'surah' | 'juz'>('surah');
  const [query, setQuery] = useState('');
  const [number, setNumber] = useState<number | null>(null);
  const selected = sections[unit].find(section => section.number === number);
  const shown = searchHomeQuranSections(sections, unit, query);
  const choose = ar ? (unit === 'surah' ? 'اختر سورة' : 'اختر جزءًا') : (unit === 'surah' ? 'Choose a surah' : 'Choose a juz');
  const searchLabel = ar ? (unit === 'surah' ? 'ابحث عن سورة' : 'ابحث عن جزء') : (unit === 'surah' ? 'Find a surah' : 'Find a juz');
  return <section className={styles.widget} aria-labelledby="quran-widget-title">
    <header className={styles.heading}>
      <h2 id="quran-widget-title"><BookOpen size={20} aria-hidden />{ar ? 'القرآن الكريم' : 'Quran'}</h2>
      <Segmented className={styles.tabs} label={ar ? 'عرض حسب' : 'Browse by'} options={(['surah', 'juz'] as const).map(value => {
          const Icon = value === 'surah' ? List : Layers;
          return {
            key: value,
            label: value === 'surah' ? (ar ? 'السور' : 'Surahs') : (ar ? 'الأجزاء' : 'Juz'),
            icon: <Icon size={16} aria-hidden />,
            current: unit === value,
            onClick: () => { setUnit(value); setQuery(''); setNumber(null); },
          };
        })} />
    </header>
    <label className={styles.search}>
      <Search size={18} aria-hidden />
      <input type="search" aria-label={searchLabel} placeholder={searchLabel} value={query} onChange={event => { setQuery(event.target.value); setNumber(null); }} />
    </label>
    <fieldset className={styles.choices}>
      <legend className="sr-only">{choose}</legend>
      <div className={styles.scroll}>
        <div className={styles.list}>
          {shown.map(section => <label key={section.number} className={styles.row}>
            <input type="radio" className="sr-only" name={`home-quran-${unit}`} value={section.number} checked={number === section.number} onChange={() => setNumber(section.number)} />
            <span className={styles.number} aria-hidden>{ar ? num(section.number) : section.number}</span>
            <span lang={unit === 'surah' || ar ? 'ar' : 'en'}>{unit === 'juz' && !ar ? section.nameTransliterated : section.name}</span>
            <span className={styles.radio} aria-hidden />
          </label>)}
        </div>
        {!shown.length && <p className={styles.empty} role="status">{ar ? 'لا توجد نتيجة مطابقة.' : 'No matching section.'}</p>}
      </div>
    </fieldset>
    <footer className={styles.footer}>
      <p aria-live="polite">{selected ? <span lang={unit === 'surah' || ar ? 'ar' : 'en'}>{unit === 'juz' && !ar ? selected.nameTransliterated : selected.name}</span> : choose}</p>
      <div className={styles.actions}>
        <Button variant="primary" {...(selected ? { href: selected.readerHref } : { disabled: true })}><BookOpen size={18} aria-hidden />{ar ? 'اقرأ' : 'Read'}</Button>
        <Button {...(selected ? { href: selected.branchesHref } : { disabled: true })}><TreeIcon size={18} aria-hidden />{ar ? 'استكشف المتشابهات' : 'Explore shared wording'}</Button>
        {unit === 'surah' && <Button {...(selected?.compareHref ? { href: selected.compareHref } : { disabled: true })}><ArrowLeftRight size={18} aria-hidden />{ar ? 'قارن' : 'Compare'}</Button>}
      </div>
    </footer>
  </section>;
}
