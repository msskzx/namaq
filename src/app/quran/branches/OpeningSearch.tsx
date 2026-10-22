'use client';

import React, { useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, GitBranch, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';
import { branchesHref, startsWith, type BranchesView, type Opening } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import { normalizeWord } from '@/lib/quran/normalize';
const NOTE = 'text-sm text-[var(--home-muted)]';
const SEARCH = 'w-full rounded-sm border border-[var(--home-rule)] bg-transparent ps-10 pe-3 py-2 text-[var(--home-ink)] placeholder:text-[var(--home-muted)]';

export const SUGGESTIONS = 10;
const comparison = (value: string) => normalizeWord(value.normalize('NFC')).replace(/[ؤئء]/g, 'ا').trim().split(/\s+/).join(' ');

export default function OpeningSearch({ top, phrases, current, juz = null, unavailable = false, view = {}, alternatives = [] }: { top: Opening[]; phrases: Opening[]; current: string; juz?: JuzRange | null; unavailable?: boolean; view?: BranchesView; alternatives?: Opening[] }) {
  const router = useRouter();
  const { language } = useLanguage();
  const ar = language === 'ar';
  const listId = useId();
  const [query, setQuery] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [selected, setSelected] = useState(-1);
  useEffect(() => setSelected(-1), [phrases]);
  const needle = comparison(query);
  const candidates = phrases.map(phrase => ({ phrase, value: comparison(phrase.id) }));
  const suggestions = needle
    ? [...candidates.filter(candidate => candidate.value.startsWith(needle)), ...candidates.filter(candidate => !candidate.value.startsWith(needle) && candidate.value.includes(needle))].slice(0, SUGGESTIONS).map(candidate => candidate.phrase)
    : [];
  const visible = !!needle && !dismissed;
  const href = (phrase: Opening) => branchesHref(phrase.id, juz ?? undefined, { ...view, spelling: undefined, partition: phrase.partition });
  const open = (phrase: Opening) => {
    setQuery('');
    setSelected(-1);
    router.push(href(phrase));
  };
  return (
    <div className="flex flex-col gap-3">
      <div role="group" className="flex flex-wrap gap-2" aria-label={ar ? 'أكثر الفواتح تكرارًا' : 'Most frequent openings'}>
        {top.map(opening => (
          <Button key={`${opening.id}:${opening.partition ?? ''}`} size="sm" href={href(opening)} onClick={() => { setQuery(''); setSelected(-1); }} active={startsWith(current, opening.id) && (!opening.partition || opening.partition === view.partition)} aria-current={opening.id === current && opening.partition === view.partition ? 'page' : undefined}>
            <GitBranch size={16} aria-hidden />
            {`${opening.text} (${ar ? num(opening.count) : opening.count})`}
          </Button>
        ))}
      </div>
      <label className="relative block">
        <span className="sr-only">{ar ? 'ابحث عن عبارة تبدأ بها آيتان أو أكثر' : 'Search phrases shared by two or more ayat'}</span>
        <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--home-muted)]" />
        <input type="search" role="combobox" aria-autocomplete="list" aria-expanded={visible} aria-controls={listId} aria-activedescendant={visible && selected >= 0 && suggestions[selected] ? `${listId}-${selected}` : undefined} value={query}
          onChange={event => { setQuery(event.target.value); setSelected(-1); setDismissed(false); }}
          placeholder={ar ? `ابحث بين ${num(phrases.length)} عبارة تبدأ بها آيتان أو أكثر` : `Search ${phrases.length} shared phrases`}
          onKeyDown={event => {
            if (event.key === 'Escape') { setDismissed(true); setSelected(-1); }
            if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && suggestions.length) {
              event.preventDefault();
              setDismissed(false);
              setSelected(index => event.key === 'ArrowDown' ? (index + 1) % suggestions.length : (index <= 0 ? suggestions.length - 1 : index - 1));
            }
            if (event.key === 'Enter' && visible && suggestions.length) { event.preventDefault(); open(suggestions[selected] ?? suggestions[0]); }
          }} className={SEARCH} />
      </label>
      {visible && <ul id={listId} role="listbox" aria-label={ar ? 'عبارات مقترحة' : 'Suggested phrases'} className="flex flex-col rounded border border-[var(--home-rule)]">
        {suggestions.length === 0 ? <li role="presentation" className={`${NOTE} px-3 py-2`}><span role="status">{ar ? 'لا عبارة مشتركة تطابق البحث.' : 'No shared phrase matches your search.'}</span></li> : suggestions.map((opening, index) => (
          <li key={`${opening.id}:${opening.partition ?? ''}`} role="presentation">
            <button id={`${listId}-${index}`} data-branch-navigation type="button" role="option" aria-selected={selected === index} onClick={() => open(opening)} onMouseEnter={() => setSelected(index)} className={`flex w-full items-baseline gap-2 px-3 py-2 text-start hover:bg-[var(--home-paper-deep)] ${selected === index ? 'bg-[var(--home-paper-deep)]' : ''}`}>
              <span className="text-lg font-arabic flex-1" dir="rtl">{opening.text}</span>
              <span className="text-[var(--home-accent)]">{ar ? num(opening.count) : opening.count}</span>
            </button>
          </li>
        ))}
      </ul>}
      {current && <Button size="sm" className="self-start" href={branchesHref('', juz ?? undefined, { grouped: view.grouped, page: view.page })}>
        {ar ? <ArrowRight size={16} aria-hidden /> : <ArrowLeft size={16} aria-hidden />}
        {ar ? 'العودة إلى القائمة' : 'Return to list'}
      </Button>}
      {unavailable && <p role="status" className={NOTE}>{ar
        ? 'لا تطابق العبارة المطلوبة آيتان أو أكثر داخل هذه الأجزاء. عد إلى القائمة أو امسح نطاق الأجزاء.'
        : 'No two ayat share the requested phrase in this range. Return to the list or clear the juz range.'}</p>}
      {alternatives.length > 1 && <div role="group" aria-label={ar ? 'مجموعات العبارة' : 'Matching phrase groups'} className="flex flex-col gap-2">
        <p className={NOTE}>{ar ? 'تطابق هذه العبارة مجموعات مختلفة. اختر العبارة المقصودة.' : 'This link matches different groups. Choose the intended phrase.'}</p>
        {alternatives.map(phrase => <Button key={phrase.partition} href={href(phrase)} onClick={() => { setQuery(''); setSelected(-1); }} className="self-start">
          <GitBranch size={16} aria-hidden />
          <span dir="rtl">{phrase.text}</span>
          <span>{ar ? num(phrase.count) : phrase.count}</span>
        </Button>)}
      </div>}
    </div>
  );
}
